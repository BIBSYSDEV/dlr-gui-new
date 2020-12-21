import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { License } from '../types/license.types';
import { setResourceLicense } from '../api/resourceApi';
import { useFormikContext } from 'formik';
import { ResourceWrapper } from '../types/resource.types';
import ErrorBanner from '../components/ErrorBanner';

//kommer med en pull fra master
const StyledRadioBoxWrapper = styled.div`
  width: 80%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
  display: block;
  padding-bottom: 2rem;
`;

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

const StyledAccordionTypeDivHeader = styled.div`
  display: flex;
  padding-bottom: 0.5rem;
  align-items: center;
  cursor: pointer;
`;

const StyledTypography = styled(Typography)`
  padding-right: 1rem;
`;

const extraRestrictionRadio = 'extra-restriction';
const commercialRadio = 'commersial';
const modifyAndBuildRadio = 'change-and-build';

const defaultRestrictionOptions = ['no', 'yes'];
const defaultCommercialOptions = ['no', 'yes'];
const defaultModifyAndBuildOptions = ['primary_yes', 'no'];

interface LicenseWizardFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[];
}

const LicenseWizardFields: FC<LicenseWizardFieldsProps> = ({ setAllChangesSaved, licenses }) => {
  const { t } = useTranslation();
  const { values, resetForm } = useFormikContext<ResourceWrapper>();
  const [extraRestriction, setExtraRestriction] = useState('');
  const [showExtraRestrictionRadio, setShowExtraRestrictionRadio] = useState(false);
  const [saveResctrictionError, setSaveResctrictionError] = useState(false);
  const [showCommercialRadio, setShowCommercialRadio] = useState(false);
  const [commercialValue, setCommercialValue] = useState('');
  const [showModifyAndBuild, setShowModifyAndBuild] = useState(false);
  const [modifyAndBuildValue, setModifyAndBuildValue] = useState('');
  const [modifyAndBuildSubValue, setModifyAndBuildSubValue] = useState('');

  const handleChangeInExtraRestriction = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtraRestriction(event.target.value);
    if (event.target.value === defaultRestrictionOptions[0]) {
      try {
        setAllChangesSaved(false);
        const license = licenses.find((license) => license.features?.dlr_license_code === 'CC BY 4.0');
        if (license) {
          await setResourceLicense(values.resource.identifier, license.identifier);
          if (values.resource.licenses) {
            values.resource.licenses[0] = license;
          }
          resetForm({ values });
        }
      } catch (error) {
        setSaveResctrictionError(true);
      } finally {
        setAllChangesSaved(true);
      }
    }
  };

  const handleChangeInCommercialOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommercialValue(event.target.value);
  };

  const handleChangeInModifyAndBuildOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModifyAndBuildValue(event.target.value);
  };

  const handleChangeInModifyAndBuildSubOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModifyAndBuildSubValue(event.target.value);
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor3}>
      <StyledRadioBoxWrapper>
        <StyledAccordionTypeDivHeader
          aria-controls={extraRestrictionRadio}
          id={`${extraRestrictionRadio}-header`}
          onClick={() => setShowExtraRestrictionRadio(!showExtraRestrictionRadio)}>
          <StyledTypography variant="h6">{t('license.extra_restrictions')}</StyledTypography>
          {!showExtraRestrictionRadio && <ExpandMoreIcon />}
          {showExtraRestrictionRadio && <ExpandLessIcon />}
        </StyledAccordionTypeDivHeader>
        {showExtraRestrictionRadio && (
          <div id={extraRestrictionRadio}>
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
                  label={t(`license.restriction_options.${element}`)}
                />
              ))}
            </StyledRadioGroup>
          </div>
        )}
        {saveResctrictionError && <ErrorBanner />}
      </StyledRadioBoxWrapper>

      <StyledRadioBoxWrapper>
        <StyledAccordionTypeDivHeader
          aria-controls={commercialRadio}
          id={`${commercialRadio}-header`}
          onClick={() => setShowCommercialRadio(!showCommercialRadio)}>
          <StyledTypography variant="h6">{t('license.commercial_purposes')}</StyledTypography>
          {!showCommercialRadio && <ExpandMoreIcon />}
          {showCommercialRadio && <ExpandLessIcon />}
        </StyledAccordionTypeDivHeader>
        {showCommercialRadio && (
          <div id={commercialRadio}>
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
          </div>
        )}
      </StyledRadioBoxWrapper>

      <StyledRadioBoxWrapper>
        <StyledAccordionTypeDivHeader
          aria-controls={modifyAndBuildRadio}
          id={`${modifyAndBuildRadio}-header`}
          onClick={() => setShowModifyAndBuild(!showModifyAndBuild)}>
          <StyledTypography variant="h6">{t('license.modify_and_build')}</StyledTypography>
          {!showModifyAndBuild && <ExpandMoreIcon />}
          {showModifyAndBuild && <ExpandLessIcon />}
        </StyledAccordionTypeDivHeader>
        {showModifyAndBuild && (
          <div id={modifyAndBuildRadio}>
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
                    value={'yes_unlimited'}
                    control={<Radio color="primary" />}
                    label={t(`license.modify_and_build_options.${defaultModifyAndBuildOptions[1]}`)}
                  />
                  <FormControlLabel
                    value={'yes_limited'}
                    control={<Radio color="primary" />}
                    label={t(`license.modify_and_build_options.${defaultModifyAndBuildOptions[1]}`)}
                  />
                </StyledSubRadioGroup>
              )}
              <FormControlLabel
                value={defaultModifyAndBuildOptions[1]}
                control={<Radio color="primary" />}
                label={t(`license.modify_and_build_options.${defaultModifyAndBuildOptions[1]}`)}
              />
            </StyledRadioGroup>
          </div>
        )}
      </StyledRadioBoxWrapper>
    </StyledSchemaPartColored>
  );
};

export default LicenseWizardFields;
