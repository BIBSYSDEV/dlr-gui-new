import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import { StyledContentWrapperMedium, StyledSchemaPartColored } from '../../components/styled/Wrappers';
import { Colors } from '../../themes/mainTheme';
import WarningIcon from '@mui/icons-material/Warning';
import { useFormikContext } from 'formik';
import { Resource } from '../../types/resource.types';

const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 10rem;
  padding-top: 2rem;
  padding-bottom: 1rem;
`;

const StyledWarningIcon = styled(WarningIcon)`
  vertical-align: text-bottom;
  margin-right: 1rem;
`;

const StyledWarningTypography = styled(Typography)`
  margin-bottom: 1rem;
`;

const StyledHeaderTypography = styled(Typography)`
  margin-bottom: 2rem;
`;

const ApostropheEncoding = '&#39;';

const ResourceFormErrors = () => {
  const { t } = useTranslation();
  const { errors } = useFormikContext<Resource>();

  return (
    <StyledPanel id="styled-panel" data-testid="form-errors-panel">
      <StyledSchemaPartColored
        id="styled-schema-part-colored"
        data-testid="form-errors-panel"
        color={Colors.DangerLight}>
        <StyledContentWrapperMedium id="styled-content-wrapper">
          <StyledHeaderTypography gutterBottom variant="h2">
            {t('feedback.form_errors')}
          </StyledHeaderTypography>
          {errors.features?.dlr_title && (
            <>
              <StyledWarningTypography>
                <StyledWarningIcon />
                {t('feedback.warning_box.resource_title')}.
              </StyledWarningTypography>
            </>
          )}
          {errors.features?.dlr_type && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              {t('feedback.warning_box.type')}.
            </StyledWarningTypography>
          )}
          {errors.creators && (
            <>
              {Array.isArray(errors.creators) && errors.creators.length > 1 ? (
                <StyledWarningTypography>
                  <StyledWarningIcon />
                  {t('feedback.warning_box.creator_plural')}.
                </StyledWarningTypography>
              ) : (
                <StyledWarningTypography>
                  <StyledWarningIcon />
                  {t('feedback.warning_box.creator_singular')}.
                </StyledWarningTypography>
              )}
            </>
          )}
          {errors.contributors && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              {t('feedback.warning_box.contributor')}.
            </StyledWarningTypography>
          )}
          {errors.contents && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              {t('feedback.warning_box.file_title')}.
            </StyledWarningTypography>
          )}
          {errors.features?.dlr_licensehelper_contains_other_peoples_work && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              {t('feedback.warning_box.question_must_be_answered', {
                question: t('license.questions.contains_other_peoples_work'),
              }).replace(ApostropheEncoding, "'")}
            </StyledWarningTypography>
          )}
          {errors.features?.dlr_licensehelper_usage_cleared_with_owner && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              {t('feedback.warning_box.question_must_be_answered', {
                question: t('license.questions.usage_cleared_with_owner'),
              })}
              .
            </StyledWarningTypography>
          )}
          {errors.licenses && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              {t('feedback.warning_box.license')}
            </StyledWarningTypography>
          )}
        </StyledContentWrapperMedium>
      </StyledSchemaPartColored>
    </StyledPanel>
  );
};

export default ResourceFormErrors;
