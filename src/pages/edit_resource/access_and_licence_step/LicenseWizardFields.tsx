import React, { FC, useEffect, useState } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, Typography } from '@material-ui/core';
import { StyledContentWrapper, StyledRadioGroup, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../state/rootReducer';
import { useSelector } from 'react-redux';
import { AccessTypes, InstitutionLicenseProviders, License, Licenses } from '../../../types/license.types';
import { deleteResourceLicense, putAccessType, setResourceLicense } from '../../../api/resourceApi';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import AccordionRadioGroup from '../../../components/AccordionRadioGroup';
import ErrorBanner from '../../../components/ErrorBanner';

const extraRestrictionRadio = 'extra-restriction';
const commercialRadio = 'commersial';
const modifyAndBuildRadio = 'change-and-build';

enum LicenseRestrictionOptions {
  yes = 'yes',
  CC_BY = 'CC BY 4.0',
}

enum CommercialOptions {
  NC = 'NC',
  yes = 'yes',
}

enum ModifyAndBuildOptions {
  primaryYes = 'primary_yes',
  ND = 'ND',
  SA = 'share_alike',
}

const commercialPurposes = [CommercialOptions.yes, CommercialOptions.NC];

interface LicenseWizardFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[];
  forceResetInLicenseWizard: boolean;
  containsOtherWorksFieldsSelectedCC: boolean;
}

const LicenseWizardFields: FC<LicenseWizardFieldsProps> = ({
  setAllChangesSaved,
  licenses,
  containsOtherWorksFieldsSelectedCC,
  forceResetInLicenseWizard,
}) => {
  const { t } = useTranslation();
  const { institution } = useSelector((state: RootState) => state.user);
  const { values, resetForm, setFieldValue, handleChange } = useFormikContext<Resource>();
  const [saveRestrictionError, setSaveRestrictionError] = useState(false);
  const [expandModifyAndBuildOption, setExpandModifyAndBuildOption] = useState(false);

  const licenseRestrictions = [
    LicenseRestrictionOptions.CC_BY,
    LicenseRestrictionOptions.yes,
    ...(institution.toLowerCase() === InstitutionLicenseProviders.NTNU ? [Licenses.NTNU] : []),
    ...(institution.toLowerCase() === InstitutionLicenseProviders.BI ? [Licenses.BI] : []),
  ];

  useEffect(() => {
    setFieldValue('resourceRestriction', '');
    setFieldValue('canBeUsedCommercially', '');
    setFieldValue('othersCanModifyAndBuildUpon', '');
    setSaveRestrictionError(false);
  }, [forceResetInLicenseWizard, setFieldValue]);

  const calculatePreferredLicense = async (
    restrictedValue: string,
    commercialValue: string,
    modifyAndBuildValue: string
  ) => {
    if (restrictedValue === LicenseRestrictionOptions.yes || restrictedValue === '') {
      let licenseCode = 'CC BY';
      if (commercialValue === CommercialOptions.NC) {
        licenseCode += '-NC';
      }
      if (modifyAndBuildValue === ModifyAndBuildOptions.ND) {
        licenseCode += '-ND';
      } else if (modifyAndBuildValue === ModifyAndBuildOptions.SA) {
        licenseCode += '-SA';
      }
      licenseCode += ' 4.0';
      if (commercialValue === '' && modifyAndBuildValue === '') {
        licenseCode = Licenses.CC_BY_NC_ND;
      }
      await saveLicense(licenseCode);
    } else {
      await saveLicense(restrictedValue);
      if (restrictedValue === Licenses.BI || restrictedValue === Licenses.NTNU) {
        await putAccessType(values.identifier, AccessTypes.private);
        setFieldValue('features.dlr_access', AccessTypes.private);
      }
    }
  };

  const saveLicense = async (licenseCode: string) => {
    try {
      setAllChangesSaved(false);
      const license = licenses.find((license) => license.features?.dlr_license_code === licenseCode);
      if (license && values.licenses && values.licenses[0].identifier !== license.identifier) {
        await setResourceLicense(values.identifier, license.identifier);
        if (values.licenses) {
          if (values.licenses[0].identifier.length > 0) {
            await deleteResourceLicense(values.identifier, values.licenses[0].identifier);
          }
          values.licenses[0] = license;
        }
        resetForm({ values });
        setSaveRestrictionError(false);
      } else if (license && values.licenses && values.licenses[0].identifier === license.identifier) {
        setSaveRestrictionError(false);
      } else {
        setSaveRestrictionError(true);
      }
    } catch (error) {
      setSaveRestrictionError(true);
    } finally {
      setAllChangesSaved(true);
    }
  };

  const handleChangeInExtraRestriction = async (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    await calculatePreferredLicense(
      event.target.value,
      values.canBeUsedCommercially,
      values.othersCanModifyAndBuildUpon
    );
    if (event.target.value !== LicenseRestrictionOptions.yes) {
      setFieldValue('canBeUsedCommercially', '');
      setFieldValue('othersCanModifyAndBuildUpon', '');
    }
    setFieldValue('resourceRestriction', event.target.value);
  };

  const handleChangeInCommercialOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    setExpandModifyAndBuildOption(true);
    await calculatePreferredLicense(values.resourceRestriction, event.target.value, values.othersCanModifyAndBuildUpon);
    setFieldValue('canBeUsedCommercially', event.target.value);
  };

  const handleChangeInModifyAndBuildOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    await calculatePreferredLicense(values.resourceRestriction, values.canBeUsedCommercially, event.target.value);
    setFieldValue('othersCanModifyAndBuildUpon', event.target.value);
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor3}>
      <StyledContentWrapper>
        <AccordionRadioGroup
          ariaDescription={extraRestrictionRadio}
          title={t('license.extra_restrictions')}
          expanded={true}>
          <Field name={'resourceRestriction'}>
            {({ field }: FieldProps) => (
              <FormControl component="fieldset">
                <FormLabel component="legend" id={`${extraRestrictionRadio}-label`}>
                  <Typography variant="overline">{t('license.questions.special_needs')}</Typography>
                </FormLabel>
                <StyledRadioGroup
                  {...field}
                  data-testid="extra_restriction_radio_group"
                  value={field.value}
                  onChange={(event) => handleChangeInExtraRestriction(event)}>
                  {licenseRestrictions.map((element, index) => (
                    <FormControlLabel
                      key={element}
                      data-testid={`resource_restriction_option_${element.replace(/[.\s]/g, '_')}`}
                      value={element}
                      control={<Radio color="primary" />}
                      label={t(`license.restriction_options.${element.replace(/[.\s]/g, '_')}`)}
                    />
                  ))}
                  {containsOtherWorksFieldsSelectedCC && (
                    <>
                      <FormControlLabel
                        value={Licenses.CC_BY_SA}
                        data-testid={`resource_restriction_option_${Licenses.CC_BY_SA}`}
                        control={<Radio color="primary" />}
                        label={t(`license.restriction_options.CC_BY-SA_4_0`)}
                      />
                      <FormControlLabel
                        value={Licenses.CC_BY_NC_SA}
                        data-testid={`resource_restriction_option_${Licenses.CC_BY_NC_SA}`}
                        control={<Radio color="primary" />}
                        label={t(`license.restriction_options.CC_BY-NC-SA_4_0`)}
                      />
                    </>
                  )}
                </StyledRadioGroup>
              </FormControl>
            )}
          </Field>
        </AccordionRadioGroup>

        {values.resourceRestriction === LicenseRestrictionOptions.yes && (
          <AccordionRadioGroup
            ariaDescription={commercialRadio}
            title={t('license.commercial_purposes')}
            expanded={true}>
            <FormLabel component="legend" id={`${commercialRadio}-label`}>
              <Typography variant="overline">{t('license.questions.commercial')}</Typography>
            </FormLabel>
            <Field name={'canBeUsedCommercially'}>
              {({ field }: FieldProps) => (
                <>
                  <StyledRadioGroup
                    {...field}
                    data-testid="commercial_use_radio_group"
                    aria-label={t('license.questions.commercial')}
                    value={field.value}
                    onChange={(event) => handleChangeInCommercialOption(event)}>
                    {commercialPurposes.map((element, index) => (
                      <FormControlLabel
                        key={index}
                        value={element}
                        data-testid={`commercial_use_option_${element}`}
                        control={<Radio color="primary" />}
                        label={t(`license.commercial_options.${element}`)}
                      />
                    ))}
                  </StyledRadioGroup>
                </>
              )}
            </Field>
          </AccordionRadioGroup>
        )}

        {values.resourceRestriction === LicenseRestrictionOptions.yes && (
          <AccordionRadioGroup
            ariaDescription={modifyAndBuildRadio}
            title={t('license.modify_and_build')}
            expanded={expandModifyAndBuildOption}>
            <FormLabel component="legend" id={`${modifyAndBuildRadio}-label`}>
              <Typography variant="overline">{t('license.questions.modify_and_build')}</Typography>
            </FormLabel>
            <Field name={'othersCanModifyAndBuildUpon'}>
              {({ field }: FieldProps) => (
                <>
                  <StyledRadioGroup
                    {...field}
                    data-testid="modify_and_build_radio_group"
                    value={field.value}
                    aria-label={t('license.questions.modify_and_build')}
                    onChange={(event) => handleChangeInModifyAndBuildOption(event)}>
                    <FormControlLabel
                      value={ModifyAndBuildOptions.primaryYes}
                      data-testid={`modify_and_build_option_${ModifyAndBuildOptions.primaryYes}`}
                      control={<Radio color="primary" />}
                      label={t(`license.modify_and_build_options.yes`)}
                    />
                    <FormControlLabel
                      value={ModifyAndBuildOptions.SA}
                      data-testid={`modify_and_build_option_${ModifyAndBuildOptions.SA}`}
                      control={<Radio color="primary" />}
                      label={
                        <>
                          <Typography variant="body1">{t(`license.modify_and_build_options.share_alike`)}</Typography>
                          <Typography variant="caption">
                            {t(`license.modify_and_build_options.share_alike_warning`)}
                          </Typography>
                        </>
                      }
                    />
                    <FormControlLabel
                      value={ModifyAndBuildOptions.ND}
                      data-testid={`modify_and_build_option_${ModifyAndBuildOptions.ND}`}
                      control={<Radio color="primary" />}
                      label={t(`license.modify_and_build_options.non_destructive`)}
                    />
                  </StyledRadioGroup>
                </>
              )}
            </Field>
          </AccordionRadioGroup>
        )}

        {saveRestrictionError && <ErrorBanner userNeedsToBeLoggedIn={true} />}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default LicenseWizardFields;
