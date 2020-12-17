import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText, MenuItem, TextField, Typography } from '@material-ui/core';
import { Resource } from '../types/resource.types';
import { Field, FieldProps, useFormikContext } from 'formik';
import { setResourceLicense } from '../api/resourceApi';
import { License } from '../types/license.types';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import ErrorBanner from '../components/ErrorBanner';
import { resetFormButKeepTouched } from '../utils/formik-helpers';

interface LicenseAndAccessFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[];
}

interface ResourceWrapper {
  resource: Resource;
}

const LicenseAndAccessFields: FC<LicenseAndAccessFieldsProps> = ({ setAllChangesSaved, licenses }) => {
  const { t } = useTranslation();
  const {
    values,
    setFieldValue,
    setFieldTouched,
    resetForm,
    setTouched,
    touched,
  } = useFormikContext<ResourceWrapper>();
  const [savingLicenseError, setSavingLicensesError] = useState(false);

  const saveField = async (event: any) => {
    const selectedLicense = licenses?.find((license) => license.identifier === event.target.value);
    setAllChangesSaved(false);
    if (selectedLicense) {
      try {
        await setResourceLicense(values.resource.identifier, selectedLicense.identifier);
        setSavingLicensesError(false);
        setFieldValue('resource.licenses[0]', selectedLicense);
        if (values.resource.licenses?.length === 1) {
          values.resource.licenses[0] = selectedLicense;
          resetFormButKeepTouched(touched, resetForm, values, setTouched);
        }
      } catch (err) {
        err?.response && setSavingLicensesError(err.response.status);
        setSavingLicensesError(true);
      } finally {
        setAllChangesSaved(true);
      }
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor1}>
      <StyledContentWrapper>
        <Typography variant="h4">{t('resource.metadata.license')}</Typography>
        {licenses && (
          <Field name="resource.licenses[0]">
            {({ field, meta: { error, touched } }: FieldProps) => (
              <>
                <TextField
                  select
                  required
                  label={t('resource.metadata.license')}
                  variant="outlined"
                  value={field.value.identifier}
                  error={touched && !!error}
                  fullWidth
                  onBlur={(event) => {
                    setFieldTouched('resource.licenses[0]', true, true);
                  }}
                  onChange={(event) => {
                    saveField(event);
                  }}>
                  {licenses.map((license) => (
                    <MenuItem key={license.identifier} value={license.identifier}>
                      {license.features?.dlr_license_code}
                    </MenuItem>
                  ))}
                </TextField>
                {error && touched && <FormHelperText error>{t('feedback.required_field')}</FormHelperText>}
                {savingLicenseError && <ErrorBanner />}
              </>
            )}
          </Field>
        )}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default LicenseAndAccessFields;
