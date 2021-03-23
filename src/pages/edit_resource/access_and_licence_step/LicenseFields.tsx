import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText, MenuItem, TextField } from '@material-ui/core';
import { FieldNames, Resource } from '../../../types/resource.types';
import { Field, FieldProps, useFormikContext } from 'formik';
import { deleteResourceLicense, setResourceLicense } from '../../../api/resourceApi';
import { License } from '../../../types/license.types';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import ErrorBanner from '../../../components/ErrorBanner';
import LicenseCard from '../../../components/LicenseCard';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';

interface LicenseAndAccessFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[];
}

const LicenceFieldName = `${FieldNames.LicensesBase}[0]`; //While we are dealing with only one license

const LicenseFields: FC<LicenseAndAccessFieldsProps> = ({ setAllChangesSaved, licenses }) => {
  const { t } = useTranslation();
  const { values, setFieldValue, setFieldTouched, resetForm, setTouched, touched } = useFormikContext<Resource>();
  const [savingLicenseError, setSavingLicensesError] = useState<Error>();

  const saveField = async (event: any) => {
    const selectedLicense = licenses?.find((license) => license.identifier === event.target.value);
    setAllChangesSaved(false);
    if (selectedLicense) {
      try {
        await setResourceLicense(values.identifier, selectedLicense.identifier);
        setSavingLicensesError(undefined);
        setFieldValue(LicenceFieldName, selectedLicense);
        if (values.licenses?.length === 1) {
          if (
            values.licenses[0].identifier !== selectedLicense.identifier &&
            values.licenses[0].identifier.length > 0
          ) {
            await deleteResourceLicense(values.identifier, values.licenses[0].identifier);
          }
          values.licenses[0] = selectedLicense;
          resetFormButKeepTouched(touched, resetForm, values, setTouched);
        }
      } catch (error) {
        error?.response ? setSavingLicensesError(new Error(error.response.status)) : setSavingLicensesError(error);
      } finally {
        setAllChangesSaved(true);
      }
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor3}>
      <StyledContentWrapper>
        {licenses && (
          <Field name={LicenceFieldName}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <>
                <TextField
                  id="license-picker"
                  select
                  required
                  label={t('resource.metadata.license')}
                  variant="filled"
                  value={field.value.identifier}
                  error={touched && !!error}
                  fullWidth
                  data-testid="licence-field"
                  onClick={(event) => {
                    //OnBlur does not work until clicked twice outside selector. Using onClick instead
                    setFieldTouched(LicenceFieldName, true, true);
                  }}
                  onChange={(event) => {
                    saveField(event);
                  }}>
                  {licenses.map((license) => (
                    <MenuItem
                      key={license.identifier}
                      value={license.identifier}
                      data-testid={`license-option-${license.identifier}`}>
                      {license.features?.dlr_license_code}
                    </MenuItem>
                  ))}
                </TextField>
                {error && touched && <FormHelperText error>{t('feedback.required_field')}</FormHelperText>}
                {savingLicenseError && <ErrorBanner userNeedsToBeLoggedIn={true} error={savingLicenseError} />}
              </>
            )}
          </Field>
        )}
        {values.licenses?.[0] && values.licenses?.[0].identifier.length > 1 && (
          <LicenseCard license={values.licenses[0]} />
        )}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default LicenseFields;
