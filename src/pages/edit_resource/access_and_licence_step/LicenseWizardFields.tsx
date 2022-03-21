import React, { FC, useState } from 'react';
import { CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, Typography } from '@mui/material';
import { StyledContentWrapper, StyledRadioGroup } from '../../../components/styled/Wrappers';
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
import styled from 'styled-components';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';

const StyledFormControlLabel = styled.div`
  font-size: 1rem;
`;

const StyledFormControlLabelDetail = styled.div`
  font-weight: 400;
  line-height: 0.875rem;
  font-size: 0.75rem;
`;

const StyledSchemaPartNoBottomPadding = styled.div`
  background-color: ${Colors.LicenseAccessPageGradientColor3};
  padding: 2rem 1rem 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledHeavyWeightTypography = styled(Typography)`
  font-weight: bold;
  margin-top: 1rem;
`;
const StyledTypography = styled(Typography)`
  margin-top: 1rem;
`;

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
  undefined = 'undefined',
}

enum ModifyAndBuildOptions {
  primaryYes = 'primary_yes',
  ND = 'ND',
  SA = 'share_alike',
  undefined = 'undefined',
}

const commercialPurposes = [CommercialOptions.yes, CommercialOptions.NC];

const calculatePreferredLicense = (
  restrictedValue: string,
  commercialValue: string,
  modifyAndBuildValue: string
): string => {
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
    if (commercialValue === CommercialOptions.undefined && modifyAndBuildValue === ModifyAndBuildOptions.undefined) {
      licenseCode = Licenses.CC_BY_NC_ND;
    }
    return licenseCode;
  } else {
    return restrictedValue;
  }
};

interface LicenseWizardFieldsProps {
  allChangesSaved: boolean;
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[];
  containsOtherWorksFieldsSelectedCC: boolean;
}

const LicenseWizardFields: FC<LicenseWizardFieldsProps> = ({
  allChangesSaved,
  setAllChangesSaved,
  licenses,
  containsOtherWorksFieldsSelectedCC,
}) => {
  const { t } = useTranslation();
  const { institution } = useSelector((state: RootState) => state.user);
  const { values, resetForm, setTouched, touched } = useFormikContext<Resource>();
  const [savingLicenseError, setSavingLicenseError] = useState<Error | AxiosError>();
  const [savingResourceRestrictionError, setSavingResourceRestrictionError] = useState<Error | AxiosError>();
  const [savingOthersCanModifyAndBuildUponError, setSavingOthersCanModifyAndBuildUponError] = useState<Error>();
  const [savingCanBeUsedCommerciallyError, setSavingCanBeUsedCommerciallyError] = useState<Error | AxiosError>();
  const [savingAccessTypeError, setSavingAccessTypeError] = useState<Error | AxiosError>();
  const [expandModifyAndBuildOption, setExpandModifyAndBuildOption] = useState(
    !!values.features.dlr_licensehelper_others_can_modify_and_build_upon
  );
  const [recommendedLicense, setRecommendedLicenes] = useState(
    calculatePreferredLicense(
      values.features.dlr_licensehelper_resource_restriction,
      values.features.dlr_licensehelper_can_be_used_commercially,
      values.features.dlr_licensehelper_others_can_modify_and_build_upon
    )
  );

  const licenseRestrictions = [
    LicenseRestrictionOptions.CC_BY,
    LicenseRestrictionOptions.yes,
    ...(institution.toLowerCase() === InstitutionLicenseProviders.NTNU ? [Licenses.NTNU] : []),
    ...(institution.toLowerCase() === InstitutionLicenseProviders.BI ? [Licenses.BI] : []),
  ];

  const setAccessTypePrivate = async () => {
    setSavingAccessTypeError(undefined);
    try {
      await putAccessType(values.identifier, AccessTypes.private);
    } catch (error) {
      setSavingAccessTypeError(handlePotentialAxiosError(error));
    }
    values.features.dlr_access = AccessTypes.private;
  };

  const savePreferredLicense = async (
    restrictedValue: string,
    commercialValue: string,
    modifyAndBuildValue: string
  ) => {
    const preferredLicense = calculatePreferredLicense(restrictedValue, commercialValue, modifyAndBuildValue);
    setRecommendedLicenes(preferredLicense);
    await saveLicense(preferredLicense);
    if (preferredLicense === Licenses.BI || preferredLicense === Licenses.NTNU) {
      await setAccessTypePrivate();
    }
  };

  const saveLicense = async (licenseCode: string) => {
    try {
      setAllChangesSaved(false);
      const license = licenses.find((license) => license.features?.dlr_license_code === licenseCode);
      if (license && values.licenses && values.licenses[0].identifier !== license.identifier) {
        setSavingLicenseError(undefined);
        await setResourceLicense(values.identifier, license.identifier).then();
        if (values.licenses[0].identifier.length > 0) {
          await deleteResourceLicense(values.identifier, values.licenses[0].identifier).then();
        }
        values.licenses[0] = license;
      } else if (license && values.licenses && values.licenses[0].identifier === license.identifier) {
        setSavingLicenseError(undefined);
      } else {
        setSavingLicenseError(new Error('internal error'));
      }
    } catch (error) {
      setSavingLicenseError(handlePotentialAxiosError(error));
    } finally {
      setAllChangesSaved(true);
    }
  };

  const handleChangeInExtraRestriction = async (event: React.ChangeEvent<HTMLInputElement>) => {
    values.features.dlr_licensehelper_resource_restriction = event.target.value;
    try {
      setAllChangesSaved(false);
      setSavingResourceRestrictionError(undefined);
      const promiseArray: Promise<any>[] = [];
      promiseArray.push(
        postResourceFeature(values.identifier, ResourceFeatureNames.ResourceRestriction, event.target.value)
      );
      if (event.target.value !== LicenseRestrictionOptions.yes) {
        setExpandModifyAndBuildOption(true);
        values.features.dlr_licensehelper_can_be_used_commercially = CommercialOptions.undefined;
        values.features.dlr_licensehelper_others_can_modify_and_build_upon = ModifyAndBuildOptions.undefined;
        promiseArray.push(
          postResourceFeature(
            values.identifier,
            ResourceFeatureNames.CanBeUsedCommercially,
            values.features.dlr_licensehelper_can_be_used_commercially
          )
        );
        promiseArray.push(
          postResourceFeature(
            values.identifier,
            ResourceFeatureNames.OthersCanModifyAndBuildUpon,
            values.features.dlr_licensehelper_others_can_modify_and_build_upon
          )
        );
      }
      promiseArray.push(
        savePreferredLicense(
          event.target.value,
          values.features.dlr_licensehelper_can_be_used_commercially,
          values.features.dlr_licensehelper_others_can_modify_and_build_upon
        )
      );
      await Promise.all(promiseArray);
      setAllChangesSaved(true);
    } catch (error) {
      setSavingResourceRestrictionError(handlePotentialAxiosError(error));
    }
    resetFormButKeepTouched(touched, resetForm, values, setTouched);
  };

  const handleChangeInCommercialOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    values.features.dlr_licensehelper_can_be_used_commercially = event.target.value;
    try {
      setAllChangesSaved(false);
      setSavingCanBeUsedCommerciallyError(undefined);
      const promiseArray: Promise<any>[] = [];
      promiseArray.push(
        postResourceFeature(values.identifier, ResourceFeatureNames.CanBeUsedCommercially, event.target.value)
      );
      promiseArray.push(
        savePreferredLicense(
          values.features.dlr_licensehelper_resource_restriction,
          event.target.value,
          values.features.dlr_licensehelper_others_can_modify_and_build_upon
        )
      );
      await Promise.all(promiseArray);
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
      setAllChangesSaved(true);
    } catch (error) {
      setSavingCanBeUsedCommerciallyError(handlePotentialAxiosError(error));
    }
    setExpandModifyAndBuildOption(true);
  };

  const handleChangeInModifyAndBuildOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    values.features.dlr_licensehelper_others_can_modify_and_build_upon = event.target.value;
    try {
      setAllChangesSaved(false);
      setSavingOthersCanModifyAndBuildUponError(undefined);
      const promiseArray: Promise<any>[] = [];
      promiseArray.push(
        postResourceFeature(values.identifier, ResourceFeatureNames.OthersCanModifyAndBuildUpon, event.target.value)
      );
      promiseArray.push(
        savePreferredLicense(
          values.features.dlr_licensehelper_resource_restriction,
          values.features.dlr_licensehelper_can_be_used_commercially,
          event.target.value
        )
      );
      await Promise.all(promiseArray);
      setAllChangesSaved(true);
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (error) {
      setSavingOthersCanModifyAndBuildUponError(handlePotentialAxiosError(error));
    }
  };

  return (
    <StyledSchemaPartNoBottomPadding>
      <StyledContentWrapper>
        <Typography variant="h3" gutterBottom>
          {t('resource.metadata.license')}
        </Typography>
      </StyledContentWrapper>
      <StyledContentWrapper>
        <AccordionRadioGroup
          ariaDescription={extraRestrictionRadio}
          title={t('license.extra_restrictions')}
          expanded={true}>
          <FormControl component="fieldset">
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
                      disabled={values.features.dlr_status_published}
                      control={<Radio color="primary" />}
                      label={
                        <Typography>{t(`license.restriction_options.${element.replace(/[.\s]/g, '_')}`)}</Typography>
                      }
                    />
                  ))}
                  {containsOtherWorksFieldsSelectedCC && (
                    <>
                      <FormControlLabel
                        value={Licenses.CC_BY_SA}
                        data-testid={`resource-restriction-option-${Licenses.CC_BY_SA}`}
                        control={<Radio color="primary" />}
                        disabled={values.features.dlr_status_published}
                        label={<Typography>{t(`license.restriction_options.CC_BY-SA_4_0`)}</Typography>}
                      />
                      <FormControlLabel
                        value={Licenses.CC_BY_NC_SA}
                        disabled={values.features.dlr_status_published}
                        data-testid={`resource-restriction-option-${Licenses.CC_BY_NC_SA}`}
                        control={<Radio color="primary" />}
                        label={<Typography>{t(`license.restriction_options.CC_BY-NC-SA_4_0`)}</Typography>}
                      />
                    </>
                  )}
                </StyledRadioGroup>
              )}
            </Field>
            {savingResourceRestrictionError && (
              <ErrorBanner userNeedsToBeLoggedIn={true} error={savingResourceRestrictionError} />
            )}{' '}
            {savingAccessTypeError && <ErrorBanner userNeedsToBeLoggedIn={true} error={savingAccessTypeError} />}
          </FormControl>
        </AccordionRadioGroup>
        {values.features.dlr_licensehelper_resource_restriction === LicenseRestrictionOptions.yes && (
          <AccordionRadioGroup
            ariaDescription={commercialRadio}
            title={t('license.commercial_purposes')}
            expanded={true}>
            <FormControl component="fieldset">
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
                          disabled={values.features.dlr_status_published}
                          data-testid={`commercial-use-option-${element}`}
                          control={<Radio color="primary" />}
                          label={<Typography>{t(`license.commercial_options.${element}`)}</Typography>}
                        />
                      ))}
                    </StyledRadioGroup>
                  </>
                )}
              </Field>
              {savingCanBeUsedCommerciallyError && (
                <ErrorBanner userNeedsToBeLoggedIn={true} error={savingCanBeUsedCommerciallyError} />
              )}
            </FormControl>
          </AccordionRadioGroup>
        )}
        {values.features.dlr_licensehelper_resource_restriction === LicenseRestrictionOptions.yes && (
          <AccordionRadioGroup
            ariaDescription={modifyAndBuildRadio}
            title={t('license.modify_and_build')}
            expanded={expandModifyAndBuildOption}>
            <FormControl component="fieldset">
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
                        disabled={values.features.dlr_status_published}
                        control={<Radio color="primary" />}
                        label={<Typography>{t(`license.modify_and_build_options.yes`)}</Typography>}
                      />
                      <FormControlLabel
                        value={ModifyAndBuildOptions.SA}
                        data-testid={`modify-and-build-option-${ModifyAndBuildOptions.SA}`}
                        disabled={values.features.dlr_status_published}
                        control={<Radio color="primary" />}
                        label={
                          <>
                            <StyledFormControlLabel>
                              {t(`license.modify_and_build_options.share_alike`)}
                            </StyledFormControlLabel>
                            <StyledFormControlLabelDetail>
                              {t(`license.modify_and_build_options.share_alike_warning`)}
                            </StyledFormControlLabelDetail>
                          </>
                        }
                      />
                      <FormControlLabel
                        value={ModifyAndBuildOptions.ND}
                        disabled={values.features.dlr_status_published}
                        data-testid={`modify-and-build-option-${ModifyAndBuildOptions.ND}`}
                        control={<Radio color="primary" />}
                        label={<Typography>{t(`license.modify_and_build_options.non_destructive`)}</Typography>}
                      />
                    </StyledRadioGroup>
                  </>
                )}
              </Field>
              {savingOthersCanModifyAndBuildUponError && (
                <ErrorBanner userNeedsToBeLoggedIn={true} error={savingOthersCanModifyAndBuildUponError} />
              )}
            </FormControl>
          </AccordionRadioGroup>
        )}
        {values.licenses[0].features?.dlr_license_code && values.features.dlr_licensehelper_resource_restriction && (
          <>
            {allChangesSaved && recommendedLicense === values.licenses[0].features.dlr_license_code && (
              <StyledTypography data-testid="recommended-license">
                {t('license.got_recommended_license')}.
              </StyledTypography>
            )}
            {allChangesSaved && recommendedLicense !== values.licenses[0].features.dlr_license_code && (
              <StyledHeavyWeightTypography data-testid="recommended-license">
                {t('license.recommended_license_is', {
                  license: recommendedLicense.replace(' 4.0', ''),
                })}
                .
              </StyledHeavyWeightTypography>
            )}
            {!allChangesSaved && <CircularProgress size="2rem" />}
          </>
        )}

        {savingLicenseError && <ErrorBanner userNeedsToBeLoggedIn={true} error={savingLicenseError} />}
      </StyledContentWrapper>
    </StyledSchemaPartNoBottomPadding>
  );
};

export default LicenseWizardFields;
