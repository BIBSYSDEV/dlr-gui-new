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
}

interface ResourceWrapper {
  resource: Resource;
}

const LicenseAndAccessFields: FC<LicenseAndAccessFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<ResourceWrapper>();
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [isSavingLicenses, setIsSavingLicenses] = useState(false);
  const [loadingLicensesErrorStatus, setLoadingLicensesErrorStatus] = useState(StatusCode.ACCEPTED); //todo: String
  const [savingLicenseErrorStatus, setSavingLicensesErrorStatus] = useState(StatusCode.ACCEPTED); //todo: String

  const [licenses, setLicenses] = useState<License[]>();

  useEffect(() => {
    async function getAllLicences() {
      setIsLoadingLicenses(true);
      setLoadingLicensesErrorStatus(StatusCode.ACCEPTED);

      try {
        const response = await getLicenses(); //todo: Async method
        const defaultLicense = response.data[0];
        setFieldValue('resource.licenses[0]', defaultLicense);
        setLicenses(response.data);
      } catch (err) {
        err?.response && setLoadingLicensesErrorStatus(err.response.status);
      } finally {
        setIsLoadingLicenses(false);
      }
    }

    getAllLicences();
  }, [setFieldValue]);

  const saveField = async (event: any) => {
    const selectedLicense = licenses?.find((license) => license.identifier === event.target.value);
    setIsSavingLicenses(true);
    setSavingLicensesErrorStatus(StatusCode.ACCEPTED);
    if (selectedLicense) {
      setFieldValue('resource.licenses[0]', selectedLicense);
      try {
        await setResourceLicense(values.resource.identifier, selectedLicense.identifier);
      } catch (err) {
        err?.response && setSavingLicensesErrorStatus(err.response.status);
      } finally {
        setIsSavingLicenses(false);
      }
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor1}>
      <StyledContentWrapper>
        {isLoadingLicenses && <CircularProgress />}
        {loadingLicensesErrorStatus !== StatusCode.ACCEPTED && <ErrorBanner statusCode={loadingLicensesErrorStatus} />}
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
