import React, { FC, useState } from 'react';
import Radio from '@material-ui/core/Radio';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, useFormikContext } from 'formik';
import { ResourceWrapper } from '../../../types/resource.types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { Colors } from '../../../themes/mainTheme';
import {
  StyledContentWrapper,
  StyledRadioBoxWrapper,
  StyledRadioGroup,
  StyledSchemaPartColored,
} from '../../../components/styled/Wrappers';
import { deleteResourceLicense, putAccessType, setResourceLicense } from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { AccessTypes, emptyLicense, License, LicenseConstants } from '../../../types/license.types';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import { FormHelperText } from '@material-ui/core';

const StyledOutLinedBox = styled.div`
  display: flex;
  outline-style: solid;
  outline-color: ${({ theme }) => theme.palette.primary};
  outline-width: 0.1rem;
  padding: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StyledTypography = styled(Typography)`
  padding-left: 1rem;
`;

const LicenseAgreements: string[] = [LicenseConstants.CC, LicenseConstants.YesOther, LicenseConstants.NoClearance];

interface ContainsOtherWorksFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[] | undefined;
  forceResetInLicenseWizard: () => void;
  setHasSelectedCC: (value: boolean) => void;
}

export enum ContainsContainsOtherPeoplesWorkOptions {
  Yes = 'yes',
  No = 'no',
}
const otherPeopleWorkId = 'other-peoples-work';

const usageClearedId = 'usage-is-cleared';

const additionalLicenseProviders: string[] = [LicenseConstants.NTNU, LicenseConstants.BI];

const ContainsOtherWorksFields: FC<ContainsOtherWorksFieldsProps> = ({
  setAllChangesSaved,
  licenses,
  setHasSelectedCC,
  forceResetInLicenseWizard,
}) => {
  const { institution } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const { values, resetForm, setFieldValue, setTouched, touched } = useFormikContext<ResourceWrapper>();
  const [containsOtherPeoplesWork, setContainsOtherPeoplesWork] = useState(false);
  const [LicenseAgreement, setLicenseAgreement] = useState<string>('');
  const [savingError, setSavingError] = useState(false);
  const [additionalLicense] = useState<string | undefined>(
    additionalLicenseProviders.find((element) => element.includes(institution.toLowerCase()))
  );

  const handleChangeInContainsOtherPeoplesWork = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setContainsOtherPeoplesWork(event.target.value === ContainsContainsOtherPeoplesWorkOptions.Yes);
    setLicenseAgreement('');
    forceResetInLicenseWizard();
    if (values.resource?.licenses) {
      await replaceOldLicense(emptyLicense);
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
      setFieldValue('resource.containsContainsOtherPeoplesWork', event.target.value);
    }
    if (event.target.value === ContainsContainsOtherPeoplesWorkOptions.No) {
      setHasSelectedCC(false);
    }
    if (
      event.target.value === ContainsContainsOtherPeoplesWorkOptions.Yes &&
      LicenseAgreement === LicenseConstants.CC
    ) {
      setHasSelectedCC(true);
    }
  };

  const replaceOldLicense = async (newLicence: License) => {
    if (values.resource.licenses && values.resource.licenses[0].identifier.length > 0) {
      await deleteResourceLicense(values.resource.identifier, values.resource.licenses[0].identifier);
    }
    if (values.resource.licenses) {
      values.resource.licenses[0] = newLicence;
    }
  };

  const handleLicenseAgreementChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setAllChangesSaved(false);
      setLicenseAgreement(event.target.value);
      let accessType = AccessTypes.private;
      if (event.target.value === LicenseConstants.CC) {
        accessType = AccessTypes.open;
        setHasSelectedCC(true);
      } else {
        setHasSelectedCC(false);
      }
      if (event.target.value === LicenseConstants.YesOther) {
        accessType = AccessTypes.open;
      }
      if (event.target.value === LicenseConstants.BI || event.target.value === LicenseConstants.NTNU) {
        const license = licenses?.find((license) => license.features?.dlr_license_code === event.target.value);
        if (license) {
          await replaceOldLicense(license);
          await setResourceLicense(values.resource.identifier, license.identifier);
        }
      } else {
        await replaceOldLicense(emptyLicense);
      }
      if (values.resource.features.dlr_access !== accessType) {
        await putAccessType(values.resource.identifier, accessType);
        setFieldValue('resource.features.dlr_access', accessType);
        values.resource.features.dlr_access = accessType;
      }
      resetForm({ values });
      setSavingError(false);
    } catch (error) {
      setSavingError(true);
    } finally {
      setAllChangesSaved(true);
      forceResetInLicenseWizard();
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor1}>
      <StyledContentWrapper>
        <StyledRadioBoxWrapper>
          <FormLabel component="legend" id={otherPeopleWorkId}>
            <Typography variant="h3">{t('license.questions.contains_other_peoples_work')}</Typography>
            <Typography variant="overline">{t('license.questions.examples')}</Typography>
          </FormLabel>
          <Field name={'resource.containsContainsOtherPeoplesWork'}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <>
                <StyledRadioGroup
                  {...field}
                  aria-label={t('license.questions.examples')}
                  value={field.value}
                  onChange={(event) => {
                    handleChangeInContainsOtherPeoplesWork(event);
                  }}>
                  <FormControlLabel
                    value={ContainsContainsOtherPeoplesWorkOptions.No}
                    control={<Radio color="primary" />}
                    label={t('common.no')}
                  />
                  <FormControlLabel
                    value={ContainsContainsOtherPeoplesWorkOptions.Yes}
                    control={<Radio color="primary" />}
                    label={t('common.yes')}
                  />
                </StyledRadioGroup>
                {error && touched && <FormHelperText error>{t('feedback.required_field')}</FormHelperText>}
              </>
            )}
          </Field>
        </StyledRadioBoxWrapper>
        {containsOtherPeoplesWork && (
          <StyledRadioBoxWrapper>
            <FormLabel id={usageClearedId} component="legend">
              <Typography variant="subtitle1"> {t('license.questions.usage_cleared_with_owner')}</Typography>
            </FormLabel>
            <StyledRadioGroup
              aria-label={t('license.questions.usage_cleared_with_owner')}
              value={LicenseAgreement}
              onChange={(event) => handleLicenseAgreementChange(event)}>
              {additionalLicense && (
                <FormControlLabel
                  value={additionalLicense}
                  label={t(`license.limitation.${additionalLicense}.title`)}
                  control={<Radio color="primary" />}
                />
              )}
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
        {LicenseAgreement !== LicenseConstants.YesOther && LicenseAgreement !== '' && containsOtherPeoplesWork && (
          <StyledOutLinedBox>
            <ErrorOutlineIcon color="primary" />
            <StyledTypography>{t(`license.limitation.${LicenseAgreement}.important_notice`)}</StyledTypography>
          </StyledOutLinedBox>
        )}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default ContainsOtherWorksFields;
