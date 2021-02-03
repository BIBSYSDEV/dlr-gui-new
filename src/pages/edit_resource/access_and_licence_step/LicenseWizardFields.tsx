import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormControlLabel, FormLabel, Radio, Typography } from '@material-ui/core';
import { StyledContentWrapper, StyledRadioGroup, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../state/rootReducer';
import { useSelector } from 'react-redux';
import { AccessTypes, License, Licenses } from '../../../types/license.types';
import { deleteResourceLicense, putAccessType, setResourceLicense } from '../../../api/resourceApi';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import AccordionRadioGroup from '../../../components/AccordionRadioGroup';
import ErrorBanner from '../../../components/ErrorBanner';

const StyledSubRadioGroup = styled(StyledRadioGroup)`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 2rem;
  }
`;

const extraRestrictionRadio = 'extra-restriction';
const commercialRadio = 'commersial';
const modifyAndBuildRadio = 'change-and-build';

enum LicenseRestrictionValues {
  yes = 'yes',
}

enum DefaultCommercial {
  NC = 'NC',
  yes = 'yes',
}

enum DefaultModifyAndBuildOptions {
  primaryYes = 'primary_yes',
  ND = 'ND',
  dontCare = 'dont_care',
  SA = 'share_alike',
}

const defaultRestrictionOptions = [Licenses.CC_BY, LicenseRestrictionValues.yes];
const defaultCommercialOptions = [DefaultCommercial.yes, DefaultCommercial.NC];

interface LicenseWizardFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[];
  forceResetInLicenseWizard: boolean;
  containsOtherWorksFieldsSelectedCC: boolean;
}

const additionalLicenseProviders: string[] = [Licenses.NTNU, Licenses.BI];

const LicenseWizardFields: FC<LicenseWizardFieldsProps> = ({
  setAllChangesSaved,
  licenses,
  containsOtherWorksFieldsSelectedCC,
  forceResetInLicenseWizard,
}) => {
  const { t } = useTranslation();
  const { institution } = useSelector((state: RootState) => state.user);
  const { values, resetForm, setFieldValue } = useFormikContext<Resource>();
  const [institutionRestriction] = useState<string | undefined>(
    additionalLicenseProviders.find((element) => element.includes(institution.toLowerCase()))
  );
  const [saveRestrictionError, setSaveRestrictionError] = useState(false);
  const [expandModifyAndBuildOption, setExpandModifyAndBuildOption] = useState(false);
  const [modifyAndBuildSubValue, setModifyAndBuildSubValue] = useState('');

  useEffect(() => {
    setFieldValue('resourceRestriction', '');
    setFieldValue('canBeUsedCommercially', '');
    setFieldValue('othersCanModifyAndBuildUpon', '');
    setModifyAndBuildSubValue('');
    setSaveRestrictionError(false);
  }, [forceResetInLicenseWizard, setFieldValue]);

  const calculatePreferredLicense = async (
    restrictedValue: string,
    commercialValue: string,
    modifyAndBuildValue: string,
    modifyAndBuildSubValue: string
  ) => {
    if (restrictedValue === LicenseRestrictionValues.yes || restrictedValue === '') {
      let licenseTempCode = 'CC BY';
      if (commercialValue === DefaultCommercial.NC) {
        licenseTempCode += '-NC';
      }
      if (modifyAndBuildValue === DefaultModifyAndBuildOptions.ND) {
        licenseTempCode += '-ND';
      }
      if (
        modifyAndBuildValue === DefaultModifyAndBuildOptions.primaryYes &&
        modifyAndBuildSubValue === DefaultModifyAndBuildOptions.SA
      ) {
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
      values.othersCanModifyAndBuildUpon,
      modifyAndBuildSubValue
    );
    setFieldValue('resourceRestriction', event.target.value);
  };

  const handleChangeInCommercialOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpandModifyAndBuildOption(true);
    await calculatePreferredLicense(
      values.resourceRestriction,
      event.target.value,
      values.othersCanModifyAndBuildUpon,
      modifyAndBuildSubValue
    );
    setFieldValue('canBeUsedCommercially', event.target.value);
  };

  const handleChangeInModifyAndBuildOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await calculatePreferredLicense(
      values.resourceRestriction,
      values.canBeUsedCommercially,
      event.target.value,
      modifyAndBuildSubValue
    );
    setFieldValue('othersCanModifyAndBuildUpon', event.target.value);
  };

  const handleChangeInModifyAndBuildSubOptions = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setModifyAndBuildSubValue(event.target.value);
    await calculatePreferredLicense(
      values.resourceRestriction,
      values.canBeUsedCommercially,
      values.othersCanModifyAndBuildUpon,
      event.target.value
    );
    setFieldValue('othersCanModifyAndBuildUponSUB', event.target.value);
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
                {defaultRestrictionOptions.map((element, index) => (
                  <FormControlLabel
                    key={index}
                    value={element}
                    control={<Radio color="primary" />}
                    label={t(`license.restriction_options.${element.replace(/[.\s]/g, '_')}`)}
                  />
                ))}
                {institutionRestriction && (
                  <FormControlLabel
                    value={institutionRestriction}
                    control={<Radio color="primary" />}
                    label={t(`license.restriction_options.${institutionRestriction}`)}
                  />
                )}
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

        {values.resourceRestriction === LicenseRestrictionValues.yes && (
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
                    {defaultCommercialOptions.map((element, index) => (
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

        {values.resourceRestriction === LicenseRestrictionValues.yes && (
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
                      value={DefaultModifyAndBuildOptions.primaryYes}
                      control={<Radio color="primary" />}
                      label={t(`license.modify_and_build_options.${DefaultModifyAndBuildOptions.primaryYes}`)}
                    />
                    {values.othersCanModifyAndBuildUpon === DefaultModifyAndBuildOptions.primaryYes && (
                      <Field name={'othersCanModifyAndBuildUponSUB'}>
                        {({ field }: FieldProps) => (
                          <>
                            <StyledSubRadioGroup
                              {...field}
                              value={field.value}
                              aria-label={t(
                                `license.modify_and_build_options.${DefaultModifyAndBuildOptions.primaryYes}`
                              )}
                              onChange={(event) => handleChangeInModifyAndBuildSubOptions(event)}>
                              <FormControlLabel
                                value={DefaultModifyAndBuildOptions.dontCare}
                                control={<Radio color="primary" />}
                                label={t(`license.modify_and_build_options.${DefaultModifyAndBuildOptions.dontCare}`)}
                              />
                              <FormControlLabel
                                value={DefaultModifyAndBuildOptions.SA}
                                control={<Radio color="primary" />}
                                label={t(`license.modify_and_build_options.${DefaultModifyAndBuildOptions.SA}`)}
                              />
                            </StyledSubRadioGroup>
                          </>
                        )}
                      </Field>
                    )}
                    <FormControlLabel
                      value={DefaultModifyAndBuildOptions.ND}
                      control={<Radio color="primary" />}
                      label={t(`license.modify_and_build_options.${DefaultModifyAndBuildOptions.ND}`)}
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
