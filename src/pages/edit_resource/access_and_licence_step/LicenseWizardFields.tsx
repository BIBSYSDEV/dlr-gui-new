import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { StyledContentWrapper, StyledRadioGroup, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../state/rootReducer';
import { useSelector } from 'react-redux';
import { License, AccessTypes, LicenseConstants } from '../../../types/license.types';
import { deleteResourceLicense, putAccessType, setResourceLicense } from '../../../api/resourceApi';
import { useFormikContext } from 'formik';
import { ResourceWrapper } from '../../../types/resource.types';
import ErrorBanner from '../../../components/ErrorBanner';
import AccordionRadioGroup from '../../../components/AccordionRadioGroup';

const StyledSubRadioGroup = styled(RadioGroup)`
  margin-left: 5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 2;
  }
`;

const extraRestrictionRadio = 'extra-restriction';
const commercialRadio = 'commersial';
const modifyAndBuildRadio = 'change-and-build';

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

const defaultRestrictionOptions = [LicenseConstants.CC_BY, LicenseConstants.yes];
const defaultCommercialOptions = [DefaultCommercial.yes, DefaultCommercial.NC];

interface LicenseWizardFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[];
  forceResetInLicenseWizard: boolean;
  containsOtherWorksFieldsSelectedCC: boolean;
}

const additionalLicenseProviders: string[] = [LicenseConstants.NTNU, LicenseConstants.BI];

const LicenseWizardFields: FC<LicenseWizardFieldsProps> = ({
  setAllChangesSaved,
  licenses,
  containsOtherWorksFieldsSelectedCC,
  forceResetInLicenseWizard,
}) => {
  const { t } = useTranslation();
  const { institution } = useSelector((state: RootState) => state.user);
  const { values, resetForm } = useFormikContext<ResourceWrapper>();
  const [extraRestriction, setExtraRestriction] = useState('');
  const [institutionRestriction] = useState<string | undefined>(
    additionalLicenseProviders.find((element) => element.includes(institution.toLowerCase()))
  );
  const [saveRestrictionError, setSaveRestrictionError] = useState(false);
  const [commercialValue, setCommercialValue] = useState('');
  const [modifyAndBuildValue, setModifyAndBuildValue] = useState('');
  const [modifyAndBuildSubValue, setModifyAndBuildSubValue] = useState('');

  const handleChangeInExtraRestriction = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtraRestriction(event.target.value);
    await calculatePreferredLicense(event.target.value, commercialValue, modifyAndBuildValue, modifyAndBuildSubValue);
  };

  useEffect(() => {
    setExtraRestriction('');
    setSaveRestrictionError(false);
    setCommercialValue('');
    setModifyAndBuildValue('');
    setModifyAndBuildSubValue('');
  }, [forceResetInLicenseWizard]);

  const calculatePreferredLicense = async (
    restrictedValue: string,
    commercialValue: string,
    modifyAndBuildValue: string,
    modifyAndBuildSubValue: string
  ) => {
    if (restrictedValue === LicenseConstants.yes || restrictedValue === '') {
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
    } else if (restrictedValue === LicenseConstants.BI || restrictedValue === LicenseConstants.NTNU) {
      await saveLicenseAndChangeAccess(restrictedValue, AccessTypes.private);
    } else {
      await saveLicenseAndChangeAccess(restrictedValue, AccessTypes.open);
    }
  };

  const saveLicenseAndChangeAccess = async (licenseCode: string, accessType: AccessTypes) => {
    try {
      setAllChangesSaved(false);
      const license = licenses.find((license) => license.features?.dlr_license_code === licenseCode);
      if (license && values.resource.licenses && values.resource.licenses[0].identifier !== license.identifier) {
        await putAccessType(values.resource.identifier, accessType);
        await setResourceLicense(values.resource.identifier, license.identifier);
        values.resource.features.dlr_access = accessType;
        if (values.resource.licenses) {
          if (values.resource.licenses[0].identifier.length > 0) {
            await deleteResourceLicense(values.resource.identifier, values.resource.licenses[0].identifier);
          }
          values.resource.licenses[0] = license;
        }
        resetForm({ values });
        setSaveRestrictionError(false);
      } else if (license && values.resource.licenses && values.resource.licenses[0].identifier === license.identifier) {
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

  const handleChangeInCommercialOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommercialValue(event.target.value);
    await calculatePreferredLicense(extraRestriction, event.target.value, modifyAndBuildValue, modifyAndBuildSubValue);
  };

  const handleChangeInModifyAndBuildOption = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setModifyAndBuildValue(event.target.value);
    await calculatePreferredLicense(extraRestriction, commercialValue, event.target.value, modifyAndBuildSubValue);
  };

  const handleChangeInModifyAndBuildSubOptions = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setModifyAndBuildSubValue(event.target.value);
    await calculatePreferredLicense(extraRestriction, commercialValue, modifyAndBuildValue, event.target.value);
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor3}>
      <StyledContentWrapper>
        <Typography variant="h3">{t('resource.metadata.license')}</Typography>
        <Typography variant="overline">
          Svar på spørsmålene for å få hjelp til å velge lisens eller velg lisens direkte fra nedtrekksmenyen{' '}
        </Typography>
        <AccordionRadioGroup ariaDescription={extraRestrictionRadio} title={t('license.extra_restrictions')}>
          <FormLabel component="legend" id={`${extraRestrictionRadio}-label`}>
            <Typography variant="overline">{t('license.questions.special_needs')}</Typography>
          </FormLabel>
          <StyledRadioGroup
            aria-label={t('license.questions.special_needs')}
            value={extraRestriction}
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
                  value={LicenseConstants.CC_BY_SA_4_0}
                  control={<Radio color="primary" />}
                  label={t(`license.restriction_options.CC_BY-SA_4_0`)}
                />
                <FormControlLabel
                  value={LicenseConstants.CC_BY_NC_SA}
                  control={<Radio color="primary" />}
                  label={t(`license.restriction_options.CC_BY-NC-SA_4_0`)}
                />
              </>
            )}
          </StyledRadioGroup>
        </AccordionRadioGroup>

        {extraRestriction === LicenseConstants.yes && (
          <AccordionRadioGroup ariaDescription={commercialRadio} title={t('license.commercial_purposes')}>
            <FormLabel component="legend" id={`${commercialRadio}-label`}>
              <Typography variant="overline">{t('license.questions.commercial')}</Typography>
            </FormLabel>
            <StyledRadioGroup
              aria-label={t('license.questions.commercial')}
              value={commercialValue}
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
          </AccordionRadioGroup>
        )}

        {extraRestriction === LicenseConstants.yes && (
          <AccordionRadioGroup ariaDescription={modifyAndBuildRadio} title={t('license.modify_and_build')}>
            <FormLabel component="legend" id={`${modifyAndBuildRadio}-label`}>
              <Typography variant="overline">{t('license.questions.modify_and_build')}</Typography>
            </FormLabel>
            <StyledRadioGroup
              value={modifyAndBuildValue}
              aria-label={t('license.questions.modify_and_build')}
              onChange={(event) => handleChangeInModifyAndBuildOption(event)}>
              <FormControlLabel
                value={DefaultModifyAndBuildOptions.primaryYes}
                control={<Radio color="primary" />}
                label={t(`license.modify_and_build_options.${DefaultModifyAndBuildOptions.primaryYes}`)}
              />
              {modifyAndBuildValue === DefaultModifyAndBuildOptions.primaryYes && (
                <StyledSubRadioGroup
                  aria-label={t(`license.modify_and_build_options.${DefaultModifyAndBuildOptions.primaryYes}`)}
                  onChange={(event) => handleChangeInModifyAndBuildSubOptions(event)}
                  value={modifyAndBuildSubValue}>
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
              )}
              <FormControlLabel
                value={DefaultModifyAndBuildOptions.ND}
                control={<Radio color="primary" />}
                label={t(`license.modify_and_build_options.${DefaultModifyAndBuildOptions.ND}`)}
              />
            </StyledRadioGroup>
          </AccordionRadioGroup>
        )}

        {saveRestrictionError && <ErrorBanner />}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default LicenseWizardFields;
