import React, { FC, useEffect, useState } from 'react';
import { FormControlLabel, FormLabel, Radio, Typography } from '@material-ui/core';
import { StyledContentWrapper, StyledRadioGroup, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../state/rootReducer';
import { useSelector } from 'react-redux';
import { AccessTypes, InstitutionLicenseProviders, License, Licenses } from '../../../types/license.types';
import {
  deleteResourceLicense,
  postResourceFeature,
  putAccessType,
  setResourceLicense,
} from '../../../api/resourceApi';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource, ResourceFeatureNames, ResourceFeatureNamesFullPath } from '../../../types/resource.types';
import AccordionRadioGroup from '../../../components/AccordionRadioGroup';
import ErrorBanner from '../../../components/ErrorBanner';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';

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
  const { values, resetForm, setFieldValue, handleChange, setTouched, touched } = useFormikContext<Resource>();
  const [saveRestrictionError, setSaveRestrictionError] = useState<Error>();

  const [savingResourceRestrictionError, setSavingResourceRestrictionError] = useState<Error>();
  const [savingOthersCanModifyAndBuildUponError, setSavingOthersCanModifyAndBuildUponError] = useState<Error>();
  const [savingCanBeUsedCommerciallyError, setSavingCanBeUsedCommerciallyError] = useState<Error>();

  const [expandModifyAndBuildOption, setExpandModifyAndBuildOption] = useState(false);

  const licenseRestrictions = [
    LicenseRestrictionOptions.CC_BY,
    LicenseRestrictionOptions.yes,
    ...(institution.toLowerCase() === InstitutionLicenseProviders.NTNU ? [Licenses.NTNU] : []),
    ...(institution.toLowerCase() === InstitutionLicenseProviders.BI ? [Licenses.BI] : []),
  ];

  useEffect(() => {
    if (values.features.dlr_licensehelper_others_can_modify_and_build_upon) setExpandModifyAndBuildOption(true);
  }, [values.features.dlr_licensehelper_others_can_modify_and_build_upon]);

  useEffect(() => {
    setSaveRestrictionError(undefined);
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
        setSaveRestrictionError(undefined);
        await setResourceLicense(values.identifier, license.identifier);
        if (values.licenses) {
          if (values.licenses[0].identifier.length > 0) {
            await deleteResourceLicense(values.identifier, values.licenses[0].identifier);
          }
          values.licenses[0] = license;
        }
        resetForm({ values });
      } else if (license && values.licenses && values.licenses[0].identifier === license.identifier) {
        setSaveRestrictionError(undefined);
      } else {
        setSaveRestrictionError(new Error('internal error'));
      }
    } catch (error) {
      setSaveRestrictionError(error);
    } finally {
      setAllChangesSaved(true);
    }
  };

  const handleChangeInExtraRestriction = async (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    console.log('->', event.target.value);
    setFieldValue(ResourceFeatureNamesFullPath.ResourceRestriction, event.target.value);
    try {
      setAllChangesSaved(false);
      setSavingResourceRestrictionError(undefined);
      await postResourceFeature(values.identifier, ResourceFeatureNames.ResourceRestriction, event.target.value);
      setAllChangesSaved(true);
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (error) {
      setSavingResourceRestrictionError(error);
    }
    await calculatePreferredLicense(
      event.target.value,
      values.features.dlr_licensehelper_can_be_used_commercially,
      values.features.dlr_licensehelper_others_can_modify_and_build_upon
    );
    if (event.target.value !== LicenseRestrictionOptions.yes) {
      setFieldValue(ResourceFeatureNamesFullPath.CanBeUsedCommercially, '');
      setFieldValue(ResourceFeatureNamesFullPath.OthersCanModifyAndBuildUpon, '');
    }
    setFieldValue(ResourceFeatureNamesFullPath.ResourceRestriction, event.target.value);
  };

  const handleChangeInCommercialOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    setFieldValue(ResourceFeatureNamesFullPath.CanBeUsedCommercially, event.target.value);
    try {
      setAllChangesSaved(false);
      setSavingCanBeUsedCommerciallyError(undefined);
      await postResourceFeature(values.identifier, ResourceFeatureNames.CanBeUsedCommercially, event.target.value);
      setAllChangesSaved(true);
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (error) {
      setSavingCanBeUsedCommerciallyError(error);
    }

    setExpandModifyAndBuildOption(true);
    await calculatePreferredLicense(
      values.features.dlr_licensehelper_resource_restriction,
      event.target.value,
      values.features.dlr_licensehelper_others_can_modify_and_build_upon
    );
    setFieldValue(ResourceFeatureNamesFullPath.CanBeUsedCommercially, event.target.value);
  };

  const handleChangeInModifyAndBuildOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    setFieldValue(ResourceFeatureNamesFullPath.OthersCanModifyAndBuildUpon, event.target.value);
    try {
      setAllChangesSaved(false);
      setSavingOthersCanModifyAndBuildUponError(undefined);
      await postResourceFeature(
        values.identifier,
        ResourceFeatureNames.OthersCanModifyAndBuildUpon,
        event.target.value
      );
      setAllChangesSaved(true);
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (error) {
      setSavingOthersCanModifyAndBuildUponError(error);
    }

    await calculatePreferredLicense(
      values.features.dlr_licensehelper_resource_restriction,
      values.features.dlr_licensehelper_can_be_used_commercially,
      event.target.value
    );
    setFieldValue(ResourceFeatureNamesFullPath.OthersCanModifyAndBuildUpon, event.target.value);
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
          <Field name={ResourceFeatureNamesFullPath.ResourceRestriction}>
            {({ field }: FieldProps) => (
              <StyledRadioGroup
                {...field}
                data-testid="extra_restriction_radio_group"
                aria-label={t('license.questions.special_needs')}
                value={field.value}
                onChange={(event) => handleChangeInExtraRestriction(event)}>
                {licenseRestrictions.map((element) => (
                  <FormControlLabel
                    key={element}
                    data-testid={`resource-restriction-option-${element.replace(/[.\s]/g, '_')}`}
                    value={element}
                    control={<Radio color="primary" />}
                    label={t(`license.restriction_options.${element.replace(/[.\s]/g, '_')}`)}
                  />
                ))}
                {containsOtherWorksFieldsSelectedCC && (
                  <>
                    <FormControlLabel
                      value={Licenses.CC_BY_SA}
                      data-testid={`resource-restriction-option-${Licenses.CC_BY_SA}`}
                      control={<Radio color="primary" />}
                      label={t(`license.restriction_options.CC_BY-SA_4_0`)}
                    />
                    <FormControlLabel
                      value={Licenses.CC_BY_NC_SA}
                      data-testid={`resource-restriction-option-${Licenses.CC_BY_NC_SA}`}
                      control={<Radio color="primary" />}
                      label={t(`license.restriction_options.CC_BY-NC-SA_4_0`)}
                    />
                  </>
                )}
              </StyledRadioGroup>
            )}
          </Field>
          {savingResourceRestrictionError && (
            <ErrorBanner userNeedsToBeLoggedIn={true} error={savingResourceRestrictionError} />
          )}
        </AccordionRadioGroup>
        <pre style={{ maxWidth: '90%' }}>PER2: {JSON.stringify(values, null, 2)}</pre>
        {values.features.dlr_licensehelper_resource_restriction === LicenseRestrictionOptions.yes && (
          <AccordionRadioGroup
            ariaDescription={commercialRadio}
            title={t('license.commercial_purposes')}
            expanded={true}>
            <FormLabel component="legend" id={`${commercialRadio}-label`}>
              <Typography variant="overline">{t('license.questions.commercial')}</Typography>
            </FormLabel>
            <Field name={ResourceFeatureNamesFullPath.CanBeUsedCommercially}>
              {({ field }: FieldProps) => (
                <>
                  <StyledRadioGroup
                    {...field}
                    data-testid="commercial-use-radio-group"
                    aria-label={t('license.questions.commercial')}
                    value={field.value}
                    onChange={(event) => handleChangeInCommercialOption(event)}>
                    {commercialPurposes.map((element, index) => (
                      <FormControlLabel
                        key={index}
                        value={element}
                        data-testid={`commercial-use-option-${element}`}
                        control={<Radio color="primary" />}
                        label={t(`license.commercial_options.${element}`)}
                      />
                    ))}
                  </StyledRadioGroup>
                </>
              )}
            </Field>
            {savingCanBeUsedCommerciallyError && (
              <ErrorBanner userNeedsToBeLoggedIn={true} error={savingCanBeUsedCommerciallyError} />
            )}
          </AccordionRadioGroup>
        )}

        {values.features.dlr_licensehelper_resource_restriction === LicenseRestrictionOptions.yes && (
          <AccordionRadioGroup
            ariaDescription={modifyAndBuildRadio}
            title={t('license.modify_and_build')}
            expanded={expandModifyAndBuildOption}>
            <FormLabel component="legend" id={`${modifyAndBuildRadio}-label`}>
              <Typography variant="overline">{t('license.questions.modify_and_build')}</Typography>
            </FormLabel>
            <Field name={ResourceFeatureNamesFullPath.OthersCanModifyAndBuildUpon}>
              {({ field }: FieldProps) => (
                <>
                  <StyledRadioGroup
                    {...field}
                    data-testid="modify-and-build-radio-group"
                    value={field.value}
                    aria-label={t('license.questions.modify_and_build')}
                    onChange={(event) => handleChangeInModifyAndBuildOption(event)}>
                    <FormControlLabel
                      value={ModifyAndBuildOptions.primaryYes}
                      data-testid={`modify-and-build-option-${ModifyAndBuildOptions.primaryYes}`}
                      control={<Radio color="primary" />}
                      label={t(`license.modify_and_build_options.yes`)}
                    />
                    <FormControlLabel
                      value={ModifyAndBuildOptions.SA}
                      data-testid={`modify-and-build-option-${ModifyAndBuildOptions.SA}`}
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
                      data-testid={`modify-and-build-option-${ModifyAndBuildOptions.ND}`}
                      control={<Radio color="primary" />}
                      label={t(`license.modify_and_build_options.non_destructive`)}
                    />
                  </StyledRadioGroup>
                </>
              )}
            </Field>
            {savingOthersCanModifyAndBuildUponError && (
              <ErrorBanner userNeedsToBeLoggedIn={true} error={savingOthersCanModifyAndBuildUponError} />
            )}
          </AccordionRadioGroup>
        )}

        {saveRestrictionError && <ErrorBanner userNeedsToBeLoggedIn={true} error={saveRestrictionError} />}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default LicenseWizardFields;
