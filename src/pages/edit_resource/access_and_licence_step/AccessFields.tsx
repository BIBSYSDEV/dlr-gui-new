import React, { FC, useEffect, useState } from 'react';
import { Colors, StyleWidths } from '../../../themes/mainTheme';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { MenuItem, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource, ResourceFeatureNamesFullPath } from '../../../types/resource.types';
import { putAccessType } from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import { AccessTypes, LicenseAgreementsOptions } from '../../../types/license.types';
import styled from 'styled-components';
import { postCurrentUserInstitutionConsumerAccess } from '../../../api/sharingApi';
import PrivateConsumerAccessFields from './PrivateConsumerAccessFields';

const StyledFieldWrapper = styled.div`
  max-width: ${StyleWidths.width1};
`;

const StyledTextField = styled(TextField)`
  & .Mui-disabled .MuiTypography-body1 {
    color: grey;
  }
`;

const accessTypeArray = [AccessTypes.open, AccessTypes.private];

interface AccessFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

const AccessFields: FC<AccessFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, setFieldTouched, setFieldValue, handleChange, resetForm } = useFormikContext<Resource>();
  const [savingAccessTypeError, setSavingAccessTypeError] = useState<Error>();
  const [forceRefreshInPrivateConsumerAccessFields, setForceRefreshInPrivateConsumerAccessFields] = useState(false);
  const [disabledUserInput, setDisabledUserInput] = useState(false);
  const [disabledHelperText, setDisabledHelperText] = useState('');

  const saveResourceAccessType = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value.length > 0) {
      setAllChangesSaved(false);
      try {
        if (event.target.value in AccessTypes) {
          setSavingAccessTypeError(undefined);
          await putAccessType(values.identifier, event.target.value as AccessTypes);
          setFieldValue(ResourceFeatureNamesFullPath.Access, event.target.value);
          values.features.dlr_access = event.target.value;
          resetForm({ values });
          if (
            event.target.value === AccessTypes.private &&
            values.containsOtherPeoplesWork !== LicenseAgreementsOptions.NoClearance
          ) {
            await postCurrentUserInstitutionConsumerAccess(values.identifier);
            setForceRefreshInPrivateConsumerAccessFields((prevState) => !prevState);
          }
        }
      } catch (error) {
        setSavingAccessTypeError(error);
      } finally {
        setAllChangesSaved(true);
      }
    }
  };

  useEffect(() => {
    const setPrivateAccess = async () => {
      setAllChangesSaved(false);
      try {
        await putAccessType(values.identifier, AccessTypes.private);
        values.features.dlr_access = AccessTypes.private;
      } catch (error) {
        setSavingAccessTypeError(true);
      } finally {
        setAllChangesSaved(true);
      }
    };

    if (
      (values.licenses[0]?.features?.dlr_license_code &&
        !values.licenses[0].features.dlr_license_code.toLowerCase().includes('cc')) ||
      (values.usageClearedWithOwner && values.usageClearedWithOwner === 'no_clearance')
    ) {
      if (values.features.dlr_access !== AccessTypes.private) {
        setPrivateAccess();
      }
      if (values.usageClearedWithOwner && values.usageClearedWithOwner === 'no_clearance') {
        setDisabledHelperText(t('access.no_clearance_no_public_access'));
      } else {
        setDisabledHelperText(t('access.only_private_is_available'));
      }
      setDisabledUserInput(true);
    } else {
      setDisabledUserInput(false);
    }
  }, [values, setAllChangesSaved, setFieldValue, resetForm, t]);

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor2}>
      <StyledContentWrapper>
        <Typography variant="h3">{t('resource.metadata.access')}</Typography>
        <StyledFieldWrapper>
          <Field name={ResourceFeatureNamesFullPath.Access}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <>
                <StyledTextField
                  {...field}
                  id="access-dropdown-menu"
                  data-testid="access-dropdown-menu"
                  variant="filled"
                  select
                  disabled={disabledUserInput}
                  required
                  error={touched && !!error}
                  fullWidth
                  helperText={disabledUserInput ? <Typography variant="caption">{disabledHelperText} </Typography> : ''}
                  value={field.value}
                  label={t('resource.metadata.access')}
                  onBlur={() => {
                    setFieldTouched(ResourceFeatureNamesFullPath.Access, true, true);
                  }}
                  onChange={(event) => {
                    handleChange(event);
                    saveResourceAccessType(event);
                  }}>
                  {accessTypeArray.map((accessType, index) => (
                    <MenuItem data-testid={`access-dropdown-menu-option-${accessType}`} key={index} value={accessType}>
                      <Typography>{t(`resource.access_types.${accessType}`)}</Typography>
                    </MenuItem>
                  ))}
                </StyledTextField>
                {savingAccessTypeError && <ErrorBanner userNeedsToBeLoggedIn={true} error={savingAccessTypeError} />}
              </>
            )}
          </Field>
        </StyledFieldWrapper>
        {values.features.dlr_access === AccessTypes.private && (
          <PrivateConsumerAccessFields forceRefresh={forceRefreshInPrivateConsumerAccessFields} />
        )}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default AccessFields;
