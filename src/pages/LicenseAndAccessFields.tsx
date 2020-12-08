import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@material-ui/core';
import { Resource } from '../types/resource.types';
import { ErrorMessage, Field, FieldProps, FormikValues, useFormikContext } from 'formik';
import { getLicenses } from '../api/resourceApi';
import { License } from '../types/license.types';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';

interface LicenseAndAccessFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

interface ResourceWrapper {
  resource: Resource;
}

const LicenseAndAccessFields: FC<LicenseAndAccessFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  //const { values } = useFormikContext<ResourceWrapper>();

  const [licenses, setLicenses] = useState<License[]>();

  useEffect(() => {
    getLicenses().then((response) => {
      setLicenses(response.data);
    });
  }, []);

  const saveField = (event: any, values: FormikValues) => {
    console.log('MOCK-saving license with id:', event.target.value);
    const result = licenses?.find((license) => license.identifier === event.target.value);
    values.licenses[0] = result;
    //todo: lagre lisens
    //https://api-dev.dlr.aws.unit.no/dlr-gui-backend-resources/v1/resources/0a6344b1-8ded-4aa7-b757-8bfdf799365a/licenses
    //data: identifierLicense=5d498312-7b5d-40af-a346-3e39df43ca77
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor1}>
      <StyledContentWrapper>
        <Field name="resource.licenses[0]">
          {({ form, field, meta: { error, touched } }: FieldProps) => (
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
                  const result = licenses?.find((license) => license.identifier === event.target.value);
                  form.setFieldValue('resource.licenses[0]', result);
                }}>
                {licenses &&
                  licenses.map((license) => (
                    <MenuItem key={license.identifier} value={license.identifier}>
                      {license.features?.dlr_license_code}
                    </MenuItem>
                  ))}
              </TextField>
            </>
          )}
        </Field>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default LicenseAndAccessFields;
