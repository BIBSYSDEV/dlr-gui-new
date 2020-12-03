import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputLabel, MenuItem, Select } from '@material-ui/core';
import { Resource } from '../types/resource.types';
import { Field, FieldProps, useFormikContext } from 'formik';
import { getLicenses } from '../api/resourceApi';
import { License } from '../types/license.types';

interface LicenseAndAccessFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

interface ResourceWrapper {
  resource: Resource;
}

const LicenseAndAccessFields: FC<LicenseAndAccessFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const [licenses, setLicenses] = useState<License[]>();
  const { values, handleChange, resetForm } = useFormikContext<ResourceWrapper>();

  useEffect(() => {
    getLicenses().then((response) => {
      setLicenses(response.data);
    });
  }, []);

  const saveField = (event: any) => {
    console.log(event);
    //todo: lagre lisens
    //https://api-dev.dlr.aws.unit.no/dlr-gui-backend-resources/v1/resources/0a6344b1-8ded-4aa7-b757-8bfdf799365a/licenses
    //data: identifierLicense=5d498312-7b5d-40af-a346-3e39df43ca77
  };

  return (
    <>
      <Field name="resource.licenses[0].identifier">
        {({ field, meta: { touched, error } }: FieldProps) => (
          <>
            <InputLabel id="demo-controlled-open-select-label">{t('resource.metadata.license')}</InputLabel>
            <Select
              {...field}
              variant="outlined"
              labelId="demo-controlled-open-select-label"
              onChange={(event) => {
                handleChange(event);
                !error && saveField(event);
              }}>
              {licenses &&
                licenses.map((license) => (
                  <MenuItem key={license.identifier} value={license.identifier}>
                    {license.features?.dlr_license_code}
                  </MenuItem>
                ))}
            </Select>
          </>
        )}
      </Field>

      {/*<pre style={{ maxWidth: '90%' }}>{JSON.stringify(licenses, null, 2)}</pre>*/}
    </>
  );
};

// <TextField
//   variant="filled"
//   fullWidth
//   label={t('resource.metadata.licence')}
//   error={touched && !!error}
//   helperText={<ErrorMessage name={field.name} />}
//   // onBlur={(event) => {
//   //   formikProps.handleBlur(event);
//   //   !error && saveField(event, formikProps.resetForm, formikProps.values);
//   // }}
// />

export default LicenseAndAccessFields;
