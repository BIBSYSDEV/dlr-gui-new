import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../components/styled/Wrappers';
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
`;

const ResourceFormErrors = () => {
  const { t } = useTranslation();
  const { errors } = useFormikContext<Resource>();

  return (
    <StyledPanel data-testid="form-errors-panel">
      <StyledSchemaPartColored color={Colors.DangerLight}>
        <StyledContentWrapper>
          <Typography gutterBottom variant={'h5'} component="h2">
            {t('feedback.form_errors')}
          </Typography>
          {errors.features?.dlr_title && (
            <Typography gutterBottom>
              <StyledWarningIcon />
              Ressurstittel er {errors.features?.dlr_title.toLowerCase()}
            </Typography>
          )}
          {errors.features?.dlr_type && (
            <Typography gutterBottom>
              <StyledWarningIcon />
              Ressurstype kan kun være noen av forslagene
            </Typography>
          )}
          {errors.creators && (
            <>
              {Array.isArray(errors.creators) && errors.creators.length > 1 ? (
                <Typography gutterBottom>
                  <StyledWarningIcon />
                  Alle felt for opphavernavn må fylles ut, eller slette tomme felt.
                </Typography>
              ) : (
                <Typography gutterBottom>
                  <StyledWarningIcon />
                  Det må minst være én opphaver utfylt.
                </Typography>
              )}
            </>
          )}
          {errors.contributors && (
            <Typography gutterBottom>
              <StyledWarningIcon />
              Alle felt for bidragsytertype og navn på bidragsyter må fylles ut, eventuelt slette unødvendige felt
            </Typography>
          )}
          {errors.contents && (
            <Typography gutterBottom>
              <StyledWarningIcon />
              Filtittel på hovedfil må være fylt ut.
            </Typography>
          )}
          {errors.features?.dlr_licensehelper_contains_other_peoples_work && (
            <Typography gutterBottom>
              <StyledWarningIcon />
              Spørsmålet "Inneholder ressursen andres arbeid?" må besvares
            </Typography>
          )}
          {errors.features?.dlr_licensehelper_usage_cleared_with_owner && (
            <Typography gutterBottom>
              <StyledWarningIcon />
              Spørsmålet "Er arbeidet rettighetsklarert?" må besvares
            </Typography>
          )}
          {errors.licenses && (
            <Typography gutterBottom>
              <StyledWarningIcon />
              Du må velge en lisens
            </Typography>
          )}
        </StyledContentWrapper>
      </StyledSchemaPartColored>
    </StyledPanel>
  );
};

export default ResourceFormErrors;
