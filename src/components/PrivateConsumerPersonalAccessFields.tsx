import React, { FC, useState } from 'react';
import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import styled from 'styled-components';
import { StyleWidths } from '../themes/mainTheme';
import { postAdditionalUserConsumerAccess } from '../api/sharingApi';
import { ResourceReadAccess, ResourceReadAccessNames } from '../types/resourceReadAccess.types';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Resource } from '../types/resource.types';
import { StyledCancelButton, StyledConfirmButton } from './styled/StyledButtons';
import { StyledFieldsWrapper } from './styled/Wrappers';

const StyledFormControl = styled(FormControl)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: ${StyleWidths.width1};
  }
`;

const MinimumEmailLength = 6;

interface PrivateConsumerPersonalAccessFieldsProps {
  privateAccessList: ResourceReadAccess[];
  setShowPersonAccessField: (showPersonAccessField: boolean) => void;
  setUpdatingPrivateAccessList: (updatingPrivateAccessList: boolean) => void;
  setSavePrivateAccessNetworkError: (savePrivateAccessNetworkError: boolean) => void;
  addPrivateAccess: (newPrivateAccess: ResourceReadAccess) => void;
}

const PrivateConsumerPersonalAccessFields: FC<PrivateConsumerPersonalAccessFieldsProps> = ({
  privateAccessList,
  setShowPersonAccessField,
  setUpdatingPrivateAccessList,
  setSavePrivateAccessNetworkError,
  addPrivateAccess,
}) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<Resource>();
  const [personAccessTextFieldValue, setPersonAccessFieldTextValue] = useState('');
  const [personAccessTextFieldValueError, setPersonAccessTextFieldValueError] = useState(false);

  const savePersonConsumerAccess = async () => {
    const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    const accessUsers = personAccessTextFieldValue.split(/[,;\s]/g);
    let errorOccurred = false;
    let errorList = '';
    try {
      const alreadysavedEmails: string[] = [];
      for (let i = 0; i < accessUsers.length; i++) {
        if (accessUsers[i].length > 0 && !emailRegex.test(accessUsers[i])) {
          errorOccurred = true;
          errorList += accessUsers[i] + ' ';
        } else if (alreadysavedEmails.includes(accessUsers[i])) {
          errorOccurred = true;
          errorList += ' ' + accessUsers[i] + ' ';
        } else if (
          !privateAccessList.find((access) => access.subject === accessUsers[i]) &&
          accessUsers[i].length > MinimumEmailLength
        ) {
          setUpdatingPrivateAccessList(true);
          await postAdditionalUserConsumerAccess(values.identifier, accessUsers[i]);
          alreadysavedEmails.push(accessUsers[i]);
          addPrivateAccess({ subject: accessUsers[i], profiles: [{ name: ResourceReadAccessNames.Person }] });
        }
      }
      setPersonAccessFieldTextValue(errorList);
      setPersonAccessTextFieldValueError(errorOccurred);
      setSavePrivateAccessNetworkError(false);
    } catch (error) {
      setPersonAccessTextFieldValueError(true);
      setSavePrivateAccessNetworkError(true);
    } finally {
      setUpdatingPrivateAccessList(false);
    }
  };

  return (
    <>
      <StyledFieldsWrapper>
        <StyledFormControl variant="filled" fullWidth>
          <InputLabel htmlFor="feide-id-input">{t('access.email_label')}</InputLabel>
          <FilledInput
            data-testid="feide-id-input"
            id="feide-id-input"
            value={personAccessTextFieldValue}
            autoFocus={true}
            multiline
            fullWidth
            error={personAccessTextFieldValueError && personAccessTextFieldValue.length > 0}
            onChange={(event) => setPersonAccessFieldTextValue(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                savePersonConsumerAccess();
              }
            }}
            endAdornment={
              personAccessTextFieldValue.length > 0 ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label={t('common.clear')}
                    title={t('common.cancel')}
                    onClick={() => {
                      setPersonAccessTextFieldValueError(false);
                      setPersonAccessFieldTextValue('');
                    }}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }
          />
        </StyledFormControl>
        <StyledCancelButton
          variant="outlined"
          color="primary"
          onClick={() => {
            setPersonAccessFieldTextValue('');
            setShowPersonAccessField(false);
          }}>
          {t('common.cancel')}
        </StyledCancelButton>
        <StyledConfirmButton
          disabled={personAccessTextFieldValue.length < 3}
          variant="contained"
          color="primary"
          onClick={() => savePersonConsumerAccess()}>
          {t('access.grant_access')}
        </StyledConfirmButton>
      </StyledFieldsWrapper>
    </>
  );
};

export default PrivateConsumerPersonalAccessFields;
