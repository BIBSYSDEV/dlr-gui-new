import React, { FC, useState } from 'react';
import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import styled from 'styled-components';
import { StyleWidths } from '../../../themes/mainTheme';
import { postAdditionalUserConsumerAccess } from '../../../api/sharingApi';
import { ResourceReadAccess, ResourceReadAccessNames } from '../../../types/resourceReadAccess.types';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import { StyledCancelButton, StyledConfirmButton } from '../../../components/styled/StyledButtons';
import { StyledFieldsWrapper } from '../../../components/styled/Wrappers';
import FormHelperText from '@material-ui/core/FormHelperText';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';
import SoftenPrivateAccessAfterPublicationDialog from './SoftenPrivateAccessAfterPublicationDialog';

const StyledFormControl = styled(FormControl)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: ${StyleWidths.width1};
  }
`;

const MinimumEmailLength = 5;
const HelperTextId = 'email-helper-text';

interface PrivateConsumerPersonalAccessFieldsProps {
  privateAccessList: ResourceReadAccess[];
  setShowPersonAccessField: (showPersonAccessField: boolean) => void;
  setUpdatingPrivateAccessList: (updatingPrivateAccessList: boolean) => void;
  setSavePrivateAccessNetworkError: (savePrivateAccessNetworkError: Error | AxiosError | undefined) => void;
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
  const [personAccessTextFieldValueError, setPersonAccessTextFieldValueError] = useState<Error>();
  const [hasDuplicateEmail, setHasDuplicateEmail] = useState(false);
  const [networkErrorOccured, setNetworkErrorOccured] = useState(false);
  const [containsInvalidEmail, setContainsInvalidEmail] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const savePersonConsumerAccess = async () => {
    const emailRegex =
      /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    const accessUsers = personAccessTextFieldValue.split(/[,;\s]/g);
    let errorList = '';
    const alreadySavedEmails: string[] = [];
    setSavePrivateAccessNetworkError(undefined);
    setHasDuplicateEmail(false);
    setNetworkErrorOccured(false);
    setContainsInvalidEmail(false);
    for (let i = 0; i < accessUsers.length; i++) {
      if (accessUsers[i].length > 0 && !emailRegex.test(accessUsers[i])) {
        errorList += accessUsers[i] + ' ';
        setContainsInvalidEmail(true);
      } else if (
        alreadySavedEmails.includes(accessUsers[i]) ||
        privateAccessList.find((access) => access.subject === accessUsers[i])
      ) {
        errorList += accessUsers[i] + ' ';
        setHasDuplicateEmail(true);
      } else if (
        !privateAccessList.find((access) => access.subject === accessUsers[i]) &&
        accessUsers[i].length > MinimumEmailLength
      ) {
        setUpdatingPrivateAccessList(true);
        try {
          await postAdditionalUserConsumerAccess(values.identifier, accessUsers[i]);
          alreadySavedEmails.push(accessUsers[i]);
          addPrivateAccess({ subject: accessUsers[i], profiles: [{ name: ResourceReadAccessNames.Person }] });
        } catch (error) {
          errorList += accessUsers[i] + ' ';
          setNetworkErrorOccured(true);
          setSavePrivateAccessNetworkError(handlePotentialAxiosError(error));
        }
      }
    }
    setUpdatingPrivateAccessList(false);
    errorList.length > 0 && setPersonAccessTextFieldValueError(new Error('internal error'));
    setPersonAccessFieldTextValue(errorList);
  };

  const handleSubmit = () => {
    if (values.features.dlr_status_published) {
      setShowConfirmDialog(true);
    } else {
      savePersonConsumerAccess();
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
            aria-describedby={HelperTextId}
            multiline
            fullWidth
            error={personAccessTextFieldValueError && personAccessTextFieldValue.length > 0}
            onChange={(event) => setPersonAccessFieldTextValue(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSubmit();
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
                      setPersonAccessTextFieldValueError(undefined);
                      setHasDuplicateEmail(false);
                      setNetworkErrorOccured(false);
                      setContainsInvalidEmail(false);
                      setPersonAccessFieldTextValue('');
                    }}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }
          />
          {!containsInvalidEmail && !networkErrorOccured && !hasDuplicateEmail && (
            <FormHelperText id={HelperTextId}>{t('access.email_helper_text')}</FormHelperText>
          )}
          {hasDuplicateEmail && (
            <FormHelperText id={HelperTextId} error>
              {t('access.save_personal_access_error.duplicate_email')}.
            </FormHelperText>
          )}
          {networkErrorOccured && (
            <FormHelperText id={HelperTextId} error>
              {t('access.save_personal_access_error.network_error')}.
            </FormHelperText>
          )}
          {containsInvalidEmail && (
            <FormHelperText id={HelperTextId} error>
              {t('access.save_personal_access_error.invalid_email')}.
            </FormHelperText>
          )}
        </StyledFormControl>
        <StyledCancelButton
          variant="outlined"
          color="primary"
          onClick={() => {
            setPersonAccessFieldTextValue('');
            setShowPersonAccessField(false);
            setHasDuplicateEmail(false);
            setNetworkErrorOccured(false);
            setContainsInvalidEmail(false);
          }}>
          {t('common.cancel')}
        </StyledCancelButton>
        <StyledConfirmButton
          disabled={personAccessTextFieldValue.length < 3}
          variant="contained"
          color="primary"
          onClick={handleSubmit}>
          {t('access.grant_access')}
        </StyledConfirmButton>
      </StyledFieldsWrapper>
      <SoftenPrivateAccessAfterPublicationDialog
        type={'person'}
        open={showConfirmDialog}
        setOpen={setShowConfirmDialog}
        softenPrivateAccess={savePersonConsumerAccess}
      />
    </>
  );
};

export default PrivateConsumerPersonalAccessFields;
