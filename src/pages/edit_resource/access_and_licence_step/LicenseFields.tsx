import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText, Grid, MenuItem, TextField } from '@mui/material';
import { FieldNames, Resource } from '../../../types/resource.types';
import { Field, FieldProps, useFormikContext } from 'formik';
import { deleteResourceLicense, setResourceLicense } from '../../../api/resourceApi';
import { InstitutionLicenseProviders, License } from '../../../types/license.types';
import { StyledContentWrapper } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import ErrorBanner from '../../../components/ErrorBanner';
import LicenseCard from '../../../components/LicenseCard';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import CClogoImage from '../../../components/CClogoImage';
import styled from 'styled-components';
import LicensePopoverExplanation from '../../../components/LicensePopoverExplanation';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';

const StyledSchemaPartLessTopPadding = styled.div`
  background-color: ${Colors.LicenseAccessPageGradientColor3};
  padding: 1rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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
        setSavingLicensesError(undefined);
        await setResourceLicense(values.identifier, selectedLicense.identifier);
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
        setSavingLicensesError(handlePotentialAxiosError(error));
      } finally {
        setAllChangesSaved(true);
      }
    }
  };

  const showInternalLicenseExplanation = (): boolean => {
    return (
      licenses.findIndex(
        (license) =>
          license.features?.dlr_license_code?.toLowerCase().includes(InstitutionLicenseProviders.BI) ||
          license.features?.dlr_license_code?.toLowerCase().includes(InstitutionLicenseProviders.NTNU) ||
          license.features?.dlr_license_code?.toLowerCase().includes(InstitutionLicenseProviders.VID)
      ) > -1
    );
  };

  return (
    <StyledSchemaPartLessTopPadding>
      <StyledContentWrapper>
        {licenses && (
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={10}>
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
                      disabled={values.features.dlr_status_published}
                      data-testid="licence-field"
                      onClick={() => {
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
                          <CClogoImage
                            textFirst={true}
                            licenseCode={license.features?.dlr_license_code ?? ''}
                            showCCImage={true}
                          />
                        </MenuItem>
                      ))}
                    </TextField>
                    {error && touched && <FormHelperText error>{t('feedback.required_field')}</FormHelperText>}
                    {savingLicenseError && (
                      <ErrorBanner userNeedsToBeLoggedIn={true} error={savingLicenseError} showAxiosStatusCode={true} />
                    )}
                  </>
                )}
              </Field>
            </Grid>
            <Grid item xs={2}>
              <LicensePopoverExplanation
                licenseCode={'CC BY SA ND NC CD 1'}
                showLink={false}
                showIntroduction={true}
                showInternalLicenseExplanation={showInternalLicenseExplanation()}
              />
            </Grid>
          </Grid>
        )}
        {values.licenses?.[0] && values.licenses?.[0].identifier.length > 1 && (
          <LicenseCard license={values.licenses[0]} />
        )}
      </StyledContentWrapper>
    </StyledSchemaPartLessTopPadding>
  );
};

export default LicenseFields;
