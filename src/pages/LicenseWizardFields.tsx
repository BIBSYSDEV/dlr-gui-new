import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import { License } from '../types/license.types';
import { setResourceLicense } from '../api/resourceApi';
import { useFormikContext } from 'formik';
import { ResourceWrapper } from '../types/resource.types';
import ErrorBanner from '../components/ErrorBanner';
import AccordionRadioGroup from '../components/AccordionRadioGroup';

//kommer med pull fra master
const StyledRadioGroup = styled(RadioGroup)`
  margin-left: 20rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 0;
  }
`;

const StyledSubRadioGroup = styled(RadioGroup)`
  margin-left: 5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 0;
  }
`;

const extraRestrictionRadio = 'extra-restriction';
const commercialRadio = 'commersial';
const modifyAndBuildRadio = 'change-and-build';

const defaultRestrictionOptions = ['CC BY 4.0', 'yes'];
const defaultCommercialOptions = ['no', 'yes'];
const defaultModifyAndBuildOptions = ['primary_yes', 'no', 'dont_care', 'share_alike'];

interface LicenseWizardFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[];
}

const LicenseWizardFields: FC<LicenseWizardFieldsProps> = ({ setAllChangesSaved, licenses }) => {
  const { t } = useTranslation();
  const { values, resetForm } = useFormikContext<ResourceWrapper>();
  const [extraRestriction, setExtraRestriction] = useState('');
  const [saveResctrictionError, setSaveResctrictionError] = useState(false);
  const [commercialValue, setCommercialValue] = useState('');
  const [modifyAndBuildValue, setModifyAndBuildValue] = useState('');
  const [modifyAndBuildSubValue, setModifyAndBuildSubValue] = useState('');

  const handleChangeInExtraRestriction = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtraRestriction(event.target.value);
    await calculatePreferredLicense(event.target.value, commercialValue, modifyAndBuildValue, modifyAndBuildSubValue);
  };

  const calculatePreferredLicense = async (
    restrictedValue: string,
    commercialValue: string,
    modifyAndBuildValue: string,
    modifyAndBuildSubValue: string
  ) => {
    if (restrictedValue === defaultRestrictionOptions[1] || restrictedValue === '') {
      let licenseTempCode = 'CC BY';
      if (commercialValue === defaultCommercialOptions[0]) {
        licenseTempCode += '-NC';
      }
      if (modifyAndBuildValue === defaultModifyAndBuildOptions[1]) {
        licenseTempCode += '-ND';
      }
      if (
        modifyAndBuildValue === defaultModifyAndBuildOptions[0] &&
        modifyAndBuildSubValue === defaultModifyAndBuildOptions[3]
      ) {
        licenseTempCode += '-SA';
      }
      licenseTempCode += ' 4.0';
      await saveLicense(licenseTempCode);
    } else {
      await saveLicense(restrictedValue);
    }
  };

  const saveLicense = async (licenseCode: string) => {
    try {
      setAllChangesSaved(false);
      const license = licenses.find((license) => license.features?.dlr_license_code === licenseCode);
      if (license) {
        await setResourceLicense(values.resource.identifier, license.identifier);
        if (values.resource.licenses) {
          values.resource.licenses[0] = license;
          resetForm({ values });
        }
        setSaveResctrictionError(false);
      } else {
        setSaveResctrictionError(true);
      }
    } catch (error) {
      setSaveResctrictionError(true);
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
      <AccordionRadioGroup ariaDescription={extraRestrictionRadio} title={t('license.extra_restrictions')}>
        <FormLabel component="legend" id={`${extraRestrictionRadio}-label`}>
          <Typography variant="subtitle1">{t('license.questions.special_needs')}</Typography>
        </FormLabel>
        <StyledRadioGroup
          aria-labelby={`${extraRestrictionRadio}-label`}
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
        </StyledRadioGroup>
      </AccordionRadioGroup>

      {extraRestriction === defaultRestrictionOptions[1] && (
        <AccordionRadioGroup ariaDescription={commercialRadio} title={t('license.commercial_purposes')}>
          <FormLabel component="legend" id={`${commercialRadio}-label`}>
            <Typography variant="subtitle1">{t('license.questions.commercial')}</Typography>
          </FormLabel>
          <StyledRadioGroup
            aria-labelby={`${commercialRadio}-label`}
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

      {extraRestriction === defaultRestrictionOptions[1] && (
        <AccordionRadioGroup ariaDescription={modifyAndBuildRadio} title={t('license.modify_and_build')}>
          <FormLabel component="legend" id={`${modifyAndBuildRadio}-label`}>
            <Typography variant="subtitle1">{t('license.questions.modify_and_build')}</Typography>
          </FormLabel>
          <StyledRadioGroup
            aria-labelby={`${modifyAndBuildRadio}-label`}
            value={modifyAndBuildValue}
            onChange={(event) => handleChangeInModifyAndBuildOption(event)}>
            <FormControlLabel
              value={defaultModifyAndBuildOptions[0]}
              control={<Radio color="primary" />}
              label={t(`license.modify_and_build_options.${defaultModifyAndBuildOptions[0]}`)}
            />
            {modifyAndBuildValue === defaultModifyAndBuildOptions[0] && (
              <StyledSubRadioGroup
                onChange={(event) => handleChangeInModifyAndBuildSubOptions(event)}
                aria-labelby={`${modifyAndBuildRadio}-label`}
                value={modifyAndBuildSubValue}>
                <FormControlLabel
                  value={defaultModifyAndBuildOptions[2]}
                  control={<Radio color="primary" />}
                  label={t(`license.modify_and_build_options.${defaultModifyAndBuildOptions[2]}`)}
                />
                <FormControlLabel
                  value={defaultModifyAndBuildOptions[3]}
                  control={<Radio color="primary" />}
                  label={t(`license.modify_and_build_options.${defaultModifyAndBuildOptions[3]}`)}
                />
              </StyledSubRadioGroup>
            )}
            <FormControlLabel
              value={defaultModifyAndBuildOptions[1]}
              control={<Radio color="primary" />}
              label={t(`license.modify_and_build_options.${defaultModifyAndBuildOptions[1]}`)}
            />
          </StyledRadioGroup>
        </AccordionRadioGroup>
      )}

      {saveResctrictionError && <ErrorBanner />}
    </StyledSchemaPartColored>
  );
};

export default LicenseWizardFields;
