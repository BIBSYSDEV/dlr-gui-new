import React, { FC } from 'react';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import ResourcePresentation from '../../resource/ResourcePresentation';
import { Resource } from '../../../types/resource.types';
import { Box, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const StyledTypography = styled(Typography)`
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
      <StyledTypography>{t('confirm_before_publishing')}.</StyledTypography>
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
