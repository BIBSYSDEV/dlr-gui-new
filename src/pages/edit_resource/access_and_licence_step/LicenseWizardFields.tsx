import React, { FC, useEffect, useState } from 'react';
import { FormControlLabel, FormLabel, Radio, Typography } from '@material-ui/core';
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
  const { values, resetForm, setFieldValue } = useFormikContext<Resource>();
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
      let licenseTempCode = 'CC BY';
      if (commercialValue === CommercialOptions.NC) {
        licenseTempCode += '-NC';
      }
      if (modifyAndBuildValue === ModifyAndBuildOptions.ND) {
        licenseTempCode += '-ND';
      }
      if (modifyAndBuildValue === ModifyAndBuildOptions.SA) {
        licenseTempCode += '-SA';
      }
      licenseTempCode += ' 4.0';
      await saveLicenseAndChangeAccess(licenseTempCode, AccessTypes.open);
    } else if (restrictedValue === Licenses.BI || restrictedValue === Licenses.NTNU) {
      await saveLicenseAndChangeAccess(restrictedValue, AccessTypes.private);
    } else {
      await saveLicenseAndChangeAccess(restrictedValue, AccessTypes.open);
    }
  };

  const saveLicenseAndChangeAccess = async (licenseCode: string, accessType: AccessTypes) => {
    try {
      setAllChangesSaved(false);
      const license = licenses.find((license) => license.features?.dlr_license_code === licenseCode);
      if (license && values.licenses && values.licenses[0].identifier !== license.identifier) {
        await putAccessType(values.identifier, accessType);
        await setResourceLicense(values.identifier, license.identifier);
        values.features.dlr_access = accessType;
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
    setExpandModifyAndBuildOption(true);
    await calculatePreferredLicense(values.resourceRestriction, event.target.value, values.othersCanModifyAndBuildUpon);
    setFieldValue('canBeUsedCommercially', event.target.value);
  };

  const handleChangeInModifyAndBuildOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          <FormLabel component="legend" id={`${extraRestrictionRadio}-label`}>
            <Typography variant="overline">{t('license.questions.special_needs')}</Typography>
          </FormLabel>
          <Field name={'resourceRestriction'}>
            {({ field }: FieldProps) => (
              <StyledRadioGroup
                {...field}
                aria-label={t('license.questions.special_needs')}
                value={field.value}
                onChange={(event) => handleChangeInExtraRestriction(event)}>
                {licenseRestrictions.map((element, index) => (
                  <FormControlLabel
                    key={element}
                    value={element}
                    control={<Radio color="primary" />}
                    label={t(`license.restriction_options.${element.replace(/[.\s]/g, '_')}`)}
                  />
                ))}
                {containsOtherWorksFieldsSelectedCC && (
                  <>
                    <FormControlLabel
                      value={Licenses.CC_BY_SA_4_0}
                      control={<Radio color="primary" />}
                      label={t(`license.restriction_options.CC_BY-SA_4_0`)}
                    />
                    <FormControlLabel
                      value={Licenses.CC_BY_NC_SA}
                      control={<Radio color="primary" />}
                      label={t(`license.restriction_options.CC_BY-NC-SA_4_0`)}
                    />
                  </>
                )}
              </StyledRadioGroup>
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
                    aria-label={t('license.questions.commercial')}
                    value={field.value}
                    onChange={(event) => handleChangeInCommercialOption(event)}>
                    {commercialPurposes.map((element, index) => (
                      <FormControlLabel
                        key={index}
                        value={element}
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
                    value={field.value}
                    aria-label={t('license.questions.modify_and_build')}
                    onChange={(event) => handleChangeInModifyAndBuildOption(event)}>
                    <FormControlLabel
                      value={ModifyAndBuildOptions.primaryYes}
                      control={<Radio color="primary" />}
                      label={t(`license.modify_and_build_options.${ModifyAndBuildOptions.primaryYes}`)}
                    />
                    <FormControlLabel
                      value={ModifyAndBuildOptions.SA}
                      control={<Radio color="primary" />}
                      label={t(`license.modify_and_build_options.${ModifyAndBuildOptions.SA}`)}
                    />
                    <FormControlLabel
                      value={ModifyAndBuildOptions.ND}
                      control={<Radio color="primary" />}
                      label={t(`license.modify_and_build_options.${ModifyAndBuildOptions.ND}`)}
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
