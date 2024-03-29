import React, { FC, useEffect, useState } from 'react';
import { Colors, DeviceWidths, StyleWidths } from '../../../themes/mainTheme';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { MenuItem, TextField, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource, ResourceFeatureNamesFullPath } from '../../../types/resource.types';
import { putAccessType } from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import { AccessTypes, LicenseAgreementsOptions } from '../../../types/license.types';
import styled from 'styled-components';
import { postCurrentUserInstitutionConsumerAccess } from '../../../api/sharingApi';
import PrivateConsumerAccessFields from './PrivateConsumerAccessFields';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';
import { typographyClasses, inputBaseClasses } from '@mui/material';

const StyledFieldWrapper = styled.div`
  max-width: ${StyleWidths.width1};
`;

const StyledTextField = styled(TextField)`
  & .${inputBaseClasses.disabled} .${typographyClasses.body1} {
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
  const [savingAccessTypeError, setSavingAccessTypeError] = useState<Error | AxiosError>();
  const [forceRefreshInPrivateConsumerAccessFields, setForceRefreshInPrivateConsumerAccessFields] = useState(false);
  const [disabledUserInput, setDisabledUserInput] = useState(false);
  const [busySavingResourceAccessType, setBusySavingResourceAccessType] = useState(false);
  const [disabledHelperText, setDisabledHelperText] = useState('');
  const mediumOrLargerScreen = useMediaQuery(`(min-width:${DeviceWidths.md}px)`);

  const saveResourceAccessType = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value.length > 0) {
      setBusySavingResourceAccessType(true);
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
            values.features.dlr_licensehelper_contains_other_peoples_work !== LicenseAgreementsOptions.NoClearance
          ) {
            await postCurrentUserInstitutionConsumerAccess(values.identifier);
            setForceRefreshInPrivateConsumerAccessFields((prevState) => !prevState);
          }
        }
      } catch (error) {
        setSavingAccessTypeError(handlePotentialAxiosError(error));
      } finally {
        setAllChangesSaved(true);
        setBusySavingResourceAccessType(false);
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
        setSavingAccessTypeError(handlePotentialAxiosError(error));
      } finally {
        setAllChangesSaved(true);
      }
    };

    if (
      (values.licenses[0]?.features?.dlr_license_code &&
        !values.licenses[0].features.dlr_license_code.toLowerCase().includes('cc')) ||
      values.features.dlr_licensehelper_usage_cleared_with_owner === LicenseAgreementsOptions.NoClearance
    ) {
      if (values.features.dlr_access !== AccessTypes.private) {
        setPrivateAccess();
      }
      if (
        values.features.dlr_licensehelper_usage_cleared_with_owner &&
        values.features.dlr_licensehelper_usage_cleared_with_owner === LicenseAgreementsOptions.NoClearance
      ) {
        setDisabledHelperText(t('access.no_clearance_no_public_access') ?? '');
      } else {
        setDisabledHelperText(t('access.only_private_is_available') ?? '');
      }
      setDisabledUserInput(true);
    } else {
      setDisabledUserInput(false);
    }
  }, [values, setAllChangesSaved, setFieldValue, resetForm, t]);

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor2}>
      <StyledContentWrapper>
        <Typography variant="h3" component={mediumOrLargerScreen ? 'h2' : 'h3'}>
          {t('resource.metadata.access')}
        </Typography>
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
                  disabled={disabledUserInput || values.features.dlr_status_published}
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
          <PrivateConsumerAccessFields
            busySavingResourceAccessType={busySavingResourceAccessType}
            forceRefresh={forceRefreshInPrivateConsumerAccessFields}
          />
        )}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default AccessFields;
