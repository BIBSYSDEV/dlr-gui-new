import React, { FC, useState } from 'react';
import Radio from '@material-ui/core/Radio';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource, ResourceFeatureNames, ResourceFeatureNamesFullPath } from '../../../types/resource.types';
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
import {
  deleteResourceLicense,
  postResourceFeature,
  putAccessType,
  setResourceLicense,
} from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import {
  AccessTypes,
  ContainsOtherPeoplesWorkOptions,
  InstitutionLicenseProviders,
  License,
  LicenseAgreementsOptions,
  Licenses,
} from '../../../types/license.types';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import { FormControl, FormHelperText } from '@material-ui/core';

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

const otherPeopleWorkId = 'other-peoples-work';

const usageClearedId = 'usage-is-cleared';

const StyledFormLabel: any = styled(FormLabel)`
  display: flex;
`;

interface ContainsOtherWorksFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
  licenses: License[] | undefined;
  forceResetInLicenseWizard: () => void;
  setHasSelectedCC: (value: boolean) => void;
}

const ContainsOtherWorksFields: FC<ContainsOtherWorksFieldsProps> = ({
  setAllChangesSaved,
  licenses,
  setHasSelectedCC,
  forceResetInLicenseWizard,
}) => {
  const { institution } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const { values, resetForm, setTouched, touched } = useFormikContext<Resource>();
  const [savingUsageClearedWithOwnerError, setSavingUsageClearedWithOwnerError] = useState<Error>();
  const [savingContainsOtherPeoplesWorkError, setSavingContainsOtherPeoplesWorkError] = useState<Error>();

  const LicenseAgreements: string[] = [
    Licenses.CC,
    LicenseAgreementsOptions.YesOther,
    LicenseAgreementsOptions.NoClearance,
    ...(institution.toLowerCase() === InstitutionLicenseProviders.NTNU ? [Licenses.NTNU] : []),
    ...(institution.toLowerCase() === InstitutionLicenseProviders.BI ? [Licenses.BI] : []),
  ];

  const handleChangeInContainsOtherPeoplesWork = async (event: React.ChangeEvent<HTMLInputElement>) => {
    values.features.dlr_licensehelper_contains_other_peoples_work = event.target.value;
    try {
      setAllChangesSaved(false);
      setSavingContainsOtherPeoplesWorkError(undefined);
      await postResourceFeature(values.identifier, ResourceFeatureNames.ContainsOtherPeoplesWorks, event.target.value);
      setAllChangesSaved(true);
      forceResetInLicenseWizard();
    } catch (error) {
      setSavingContainsOtherPeoplesWorkError(error);
    }
    if (event.target.value === ContainsOtherPeoplesWorkOptions.No) {
      setHasSelectedCC(false);
      values.features.dlr_licensehelper_usage_cleared_with_owner = '';
    }
    if (
      event.target.value === ContainsOtherPeoplesWorkOptions.Yes &&
      values.features.dlr_licensehelper_usage_cleared_with_owner === Licenses.CC
    ) {
      setHasSelectedCC(true);
    }
    resetFormButKeepTouched(touched, resetForm, values, setTouched);
  };

  const replaceOldLicense = async (newLicence: License) => {
    if (values.licenses && values.licenses[0].identifier.length > 0) {
      await deleteResourceLicense(values.identifier, values.licenses[0].identifier);
    }
    if (values.licenses) {
      values.licenses[0] = newLicence;
    }
  };

  const handleUsageClearedWithOwnerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    values.features.dlr_licensehelper_usage_cleared_with_owner = event.target.value;
    try {
      setSavingUsageClearedWithOwnerError(undefined);
      setAllChangesSaved(false);
      await postResourceFeature(values.identifier, ResourceFeatureNames.UsageClearedWithOwner, event.target.value);
      let accessType = AccessTypes.private;
      if (event.target.value === Licenses.CC) {
        accessType = AccessTypes.open;
        setHasSelectedCC(true);
      } else {
        setHasSelectedCC(false);
      }
      if (event.target.value === LicenseAgreementsOptions.YesOther) {
        accessType = AccessTypes.open;
      }
      if (event.target.value === Licenses.BI || event.target.value === Licenses.NTNU) {
        const license = licenses?.find((license) => license.features?.dlr_license_code === event.target.value);
        if (license) {
          await replaceOldLicense(license);
          await setResourceLicense(values.identifier, license.identifier);
        }
      }
      if (values.features.dlr_access !== accessType) {
        values.features.dlr_access = accessType;
        await putAccessType(values.identifier, accessType);
      }
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (error) {
      setSavingUsageClearedWithOwnerError(error);
    } finally {
      setAllChangesSaved(true);
      forceResetInLicenseWizard();
    }
  };

  const hasError = (error: string | undefined, touched: boolean): boolean => {
    if (error) {
      return error.length > 0 && touched;
    } else {
      return false;
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor1}>
      <StyledContentWrapper>
        <Field name={ResourceFeatureNamesFullPath.ContainsOtherPeoplesWorks}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <FormControl component="fieldset" required error={hasError(error, touched)}>
              <StyledFormLabel component="legend" id={otherPeopleWorkId}>
                <Typography variant="h3" color={hasError(error, touched) ? 'error' : 'initial'}>
                  {t('license.questions.contains_other_peoples_work')}
                </Typography>
              </StyledFormLabel>
              <FormHelperText error={false}>{t('license.questions.examples')}</FormHelperText>
              <StyledRadioGroup
                {...field}
                aria-label={t('license.questions.contains_other_peoples_work')}
                value={field.value}
                data-testid="contains-other-peoples-work-radio-group"
                onChange={(event) => handleChangeInContainsOtherPeoplesWork(event)}>
                <FormControlLabel
                  value={ContainsOtherPeoplesWorkOptions.No}
                  data-testid="contains-other-peoples-work-option-no"
                  disabled={values.features.dlr_status_published}
                  control={<Radio required={true} color="primary" />}
                  label={t('common.no')}
                />
                <FormControlLabel
                  value={ContainsOtherPeoplesWorkOptions.Yes}
                  data-testid="contains-other-peoples-work-option-yes"
                  disabled={values.features.dlr_status_published}
                  control={<Radio color="primary" />}
                  label={t('common.yes')}
                />
              </StyledRadioGroup>
              {error && touched && <FormHelperText error>{t('feedback.required_field')}</FormHelperText>}
            </FormControl>
          )}
        </Field>
        {savingUsageClearedWithOwnerError && (
          <ErrorBanner userNeedsToBeLoggedIn={true} error={savingUsageClearedWithOwnerError} />
        )}
        {values.features.dlr_licensehelper_contains_other_peoples_work === ContainsOtherPeoplesWorkOptions.Yes && (
          <StyledRadioBoxWrapper>
            <Field name={ResourceFeatureNamesFullPath.UsageClearedWithOwner}>
              {({ field, meta: { error, touched } }: FieldProps) => (
                <FormControl component="fieldset" required error={hasError(error, touched)}>
                  <StyledFormLabel id={usageClearedId} component="legend">
                    <Typography variant="subtitle1" color={hasError(error, touched) ? 'error' : 'initial'}>
                      {t('license.questions.usage_cleared_with_owner')}
                    </Typography>
                  </StyledFormLabel>
                  <StyledRadioGroup
                    {...field}
                    aria-label={t('license.questions.usage_cleared_with_owner')}
                    value={field.value}
                    data-testid="usage-cleared-with-owner-radio-group"
                    onChange={(event) => handleUsageClearedWithOwnerChange(event)}>
                    {LicenseAgreements.map((element, index) => (
                      <FormControlLabel
                        value={element}
                        key={index}
                        disabled={values.features.dlr_status_published}
                        data-testid={`usage-cleared-with-owner-option-${element}`}
                        label={t(`license.limitation.${element}.title`)}
                        control={<Radio required={true} color="primary" />}
                      />
                    ))}
                  </StyledRadioGroup>
                  {error && touched && <FormHelperText error>{t('feedback.required_field')}</FormHelperText>}
                </FormControl>
              )}
            </Field>
          </StyledRadioBoxWrapper>
        )}

        {savingContainsOtherPeoplesWorkError && (
          <ErrorBanner userNeedsToBeLoggedIn={true} error={savingContainsOtherPeoplesWorkError} />
        )}
        {!values.features.dlr_status_published &&
          values.features.dlr_licensehelper_usage_cleared_with_owner !== LicenseAgreementsOptions.YesOther &&
          values.features.dlr_licensehelper_usage_cleared_with_owner !== '' &&
          values.features.dlr_licensehelper_contains_other_peoples_work && (
            <StyledOutLinedBox data-testid={'usage-cleared-with-owner-info'}>
              <ErrorOutlineIcon color="primary" />
              <StyledTypography>
                {t(`license.limitation.${values.features.dlr_licensehelper_usage_cleared_with_owner}.important_notice`)}
              </StyledTypography>
            </StyledOutLinedBox>
          )}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default ContainsOtherWorksFields;
