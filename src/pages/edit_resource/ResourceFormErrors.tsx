import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { StyledContentWrapperMedium, StyledSchemaPartColored } from '../../components/styled/Wrappers';
import { Colors } from '../../themes/mainTheme';
import WarningIcon from '@material-ui/icons/Warning';
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

//TODO: translations
//TODO: ref to fields

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
            <StyledWarningTypography>
              <StyledWarningIcon />
              Feltet tittel er obligatorisk og må fylles ut.
            </StyledWarningTypography>
          )}
          {errors.features?.dlr_type && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              Ressurstype er obligatorisk og kan kun være noen av forslagene i nedtrekkslista
            </StyledWarningTypography>
          )}
          {errors.creators && (
            <>
              {Array.isArray(errors.creators) && errors.creators.length > 1 ? (
                <StyledWarningTypography>
                  <StyledWarningIcon />
                  Alle felt for opphavernavn må fylles ut, eller slette tomme felt.
                </StyledWarningTypography>
              ) : (
                <StyledWarningTypography>
                  <StyledWarningIcon />
                  Minst en opphaver er obligatorisk og må fylles ut
                </StyledWarningTypography>
              )}
            </>
          )}
          {errors.contributors && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              Alle felt for navn og type på bidragsyter må fylles ut, eventuelt slette unødvendige felt
            </StyledWarningTypography>
          )}
          {errors.contents && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              Filtittel på hovedfil er obligatorisk og må fylles ut.
            </StyledWarningTypography>
          )}
          {errors.features?.dlr_licensehelper_contains_other_peoples_work && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              Spørsmålet "Inneholder ressursen andres arbeid?" må besvares
            </StyledWarningTypography>
          )}
          {errors.features?.dlr_licensehelper_usage_cleared_with_owner && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              Spørsmålet "Er arbeidet rettighetsklarert?" må besvares
            </StyledWarningTypography>
          )}
          {errors.licenses && (
            <StyledWarningTypography>
              <StyledWarningIcon />
              Lisens mangler og må velges
            </StyledWarningTypography>
          )}
        </StyledContentWrapperMedium>
      </StyledSchemaPartColored>
    </StyledPanel>
  );
};

export default ResourceFormErrors;
