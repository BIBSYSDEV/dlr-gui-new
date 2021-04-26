import React, { FC } from 'react';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import ResourcePresentation from '../../resource/ResourcePresentation';
import { Resource } from '../../../types/resource.types';
import { Box, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Colors } from '../../../themes/mainTheme';

const StyledAlert = styled(Alert)`
  &.MuiAlert-standardInfo {
    background-color: ${Colors.DLRBlue1};
  }
  margin-bottom: 2rem;
`;

interface DescriptionFieldsProps {
  formikProps: FormikProps<FormikValues>;
}

const PreviewPanel: FC<DescriptionFieldsProps> = () => {
  const { values } = useFormikContext<Resource>();
  const { t } = useTranslation();

  return (
    <>
      <StyledAlert severity="info">
        <AlertTitle>{t('confirm_before_publishing_title')}</AlertTitle>
        {t('confirm_before_publishing')}.
      </StyledAlert>
      {values && (
        <>
          <Typography data-testid="resource-title" variant="h2">
            <Box textAlign="left">{values.features.dlr_title}</Box>
          </Typography>
          <ResourcePresentation resource={values} />
        </>
      )}
    </>
  );
};

export default PreviewPanel;
