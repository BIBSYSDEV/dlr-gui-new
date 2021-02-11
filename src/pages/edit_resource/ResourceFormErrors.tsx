import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../components/styled/Wrappers';
import { Colors } from '../../themes/mainTheme';
import WarningIcon from '@material-ui/icons/Warning';

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
  return (
    <StyledPanel data-testid="form-errors-panel">
      <StyledSchemaPartColored color={Colors.DangerLight}>
        <StyledContentWrapper>
          <Typography variant={'h5'} component="h2">
            <StyledWarningIcon /> {t('feedback.form_errors')}
          </Typography>
        </StyledContentWrapper>
      </StyledSchemaPartColored>
    </StyledPanel>
  );
};

export default ResourceFormErrors;
