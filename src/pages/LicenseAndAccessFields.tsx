import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, MenuItem, TextField } from '@material-ui/core';
import { Resource } from '../types/resource.types';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { getLicenses, setResourceLicense } from '../api/resourceApi';
import { License } from '../types/license.types';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import ErrorBanner from '../components/ErrorBanner';
import { StatusCode } from '../utils/constants';

interface LicenseAndAccessFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[];
}

interface ResourceWrapper {
  resource: Resource;
}

const LicenseAndAccessFields: FC<LicenseAndAccessFieldsProps> = ({ setAllChangesSaved, licenses }) => {
  const { t } = useTranslation();
  const { values, setFieldValue, resetForm } = useFormikContext<ResourceWrapper>();
  const [isSavingLicenses, setIsSavingLicenses] = useState(false);
  const [savingLicenseErrorStatus, setSavingLicensesErrorStatus] = useState(StatusCode.ACCEPTED); //todo: String


  const saveField = async (event: any) => {
    const selectedLicense = licenses?.find((license) => license.identifier === event.target.value);
    setIsSavingLicenses(true);
    setAllChangesSaved(false);
    setSavingLicensesErrorStatus(StatusCode.ACCEPTED);
    if (selectedLicense) {
      setFieldValue('resource.licenses[0]', selectedLicense);
      try {
        await setResourceLicense(values.resource.identifier, selectedLicense.identifier);
      } catch (err) {
        err?.response && setSavingLicensesErrorStatus(err.response.status);
      } finally {
        setIsSavingLicenses(false);
        setAllChangesSaved(true);
        //        resetForm({ values: values });
      }
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor1}>
      <StyledContentWrapper>
        {licenses && (
          <Field name="resource.licenses[0]">
            {({ field, meta: { error, touched } }: FieldProps) => (
              <>
                <TextField
                  select
                  label={t('resource.metadata.license')}
                  variant="outlined"
                  value={field.value.identifier}
                  error={touched && !!error}
                  helperText={<ErrorMessage name={field.name} />}
                  fullWidth
                  onChange={(event) => {
                    saveField(event);
                  }}>
                  {licenses.map((license) => (
                    <MenuItem key={license.identifier} value={license.identifier}>
                      {license.features?.dlr_license_code}
                    </MenuItem>
                  ))}
                </TextField>
                {isSavingLicenses && <CircularProgress />}
                {savingLicenseErrorStatus !== StatusCode.ACCEPTED && (
                  <ErrorBanner statusCode={savingLicenseErrorStatus} />
                )}
              </>
            )}
          </Field>
        )}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default LicenseAndAccessFields;
