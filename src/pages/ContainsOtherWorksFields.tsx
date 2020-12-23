import React, { FC, useState } from 'react';
import Radio from '@material-ui/core/Radio';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { ResourceWrapper } from '../types/resource.types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { Colors } from '../themes/mainTheme';
import { StyledRadioBoxWrapper, StyledRadioGroup, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { putAccessType } from '../api/resourceApi';
import ErrorBanner from '../components/ErrorBanner';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { AccessTypes } from '../types/license.types';

const StyledOutLinedBox = styled.div`
  display: flex;
  outline-style: solid;
  outline-color: ${({ theme }) => theme.palette.primary};
  padding: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  outline-width: 0.1rem;
  width: 80%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
`;

const StyledTypography = styled(Typography)`
  padding-left: 1rem;
`;

enum LicenseAgreementsOptions {
  CC = 'creative_commons',
  YesOther = 'yes_other',
  NoClearance = 'no_clearance',
}

const LicenseAgreements: string[] = [
  LicenseAgreementsOptions.CC,
  LicenseAgreementsOptions.YesOther,
  LicenseAgreementsOptions.NoClearance,
];

interface ContainsOtherWorksFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

const otherPeopleWorkId = 'other-peoples-work';

const usageClearedId = 'usage-is-cleared';

const ContainsOtherWorksFields: FC<ContainsOtherWorksFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, resetForm, setFieldValue } = useFormikContext<ResourceWrapper>();
  const [containsOtherPeoplesWork, setContainsOtherPeoplesWork] = useState(false);
  const [LicenseAgreement, setLicenseAgreement] = useState<string>(LicenseAgreementsOptions.CC);
  const [savingError, setSavingError] = useState(false);

  //TODO: fetch additional license options such as NTNU / BI internal license possibilities and append those to LicenseAgreements

  const handleChangeInContainsOtherPeoplesWork = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContainsOtherPeoplesWork(event.target.value === 'true');
  };

  const handleLicenseAgreementChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setAllChangesSaved(false);
      setLicenseAgreement(event.target.value);
      let accessType = AccessTypes.private;
      if (
        event.target.value === LicenseAgreementsOptions.CC ||
        event.target.value === LicenseAgreementsOptions.YesOther
      ) {
        accessType = AccessTypes.open;
      }
      await putAccessType(values.resource.identifier, accessType);
      setFieldValue('resource.features.dlr_access', accessType);
      values.resource.features.dlr_access = accessType;
      resetForm({ values });

      setSavingError(false);
    } catch (error) {
      setSavingError(true);
    } finally {
      setAllChangesSaved(true);
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor1}>
      <StyledRadioBoxWrapper>
        <FormLabel component="legend" id={otherPeopleWorkId}>
          <Typography variant="subtitle1">{t('license.questions.contains_other_peoples_work')}</Typography>
          <Typography variant="overline">{t('license.questions.examples')}</Typography>
        </FormLabel>
        <StyledRadioGroup
          aria-label={t('license.questions.examples')}
          value={containsOtherPeoplesWork}
          onChange={(event) => handleChangeInContainsOtherPeoplesWork(event)}>
          <FormControlLabel value={false} control={<Radio color="primary" />} label={t('common.no')} />
          <FormControlLabel value={true} control={<Radio color="primary" />} label={t('common.yes')} />
        </StyledRadioGroup>
      </StyledRadioBoxWrapper>
      {containsOtherPeoplesWork && (
        <StyledRadioBoxWrapper>
          <FormLabel id={usageClearedId} component="legend">
            {t('license.questions.usage_cleared_with_owner')}
          </FormLabel>
          <StyledRadioGroup
            aria-label={t('license.questions.usage_cleared_with_owner')}
            value={LicenseAgreement}
            onChange={(event) => handleLicenseAgreementChange(event)}>
            {LicenseAgreements.map((element, index) => (
              <FormControlLabel
                value={element}
                key={index}
                label={t(`license.limitation.${element}.title`)}
                control={<Radio color="primary" />}
              />
            ))}
          </StyledRadioGroup>
        </StyledRadioBoxWrapper>
      )}
      {savingError && <ErrorBanner />}
      {LicenseAgreement !== LicenseAgreementsOptions.YesOther && containsOtherPeoplesWork && (
        <StyledOutLinedBox>
          <ErrorOutlineIcon color="primary" />
          <StyledTypography>{t(`license.limitation.${LicenseAgreement}.important_notice`)}</StyledTypography>
        </StyledOutLinedBox>
      )}
    </StyledSchemaPartColored>
  );
};

export default ContainsOtherWorksFields;
