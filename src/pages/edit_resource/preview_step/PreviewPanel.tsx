import React, { FC } from 'react';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import ResourcePresentation from '../../resource/ResourcePresentation';
import { Resource } from '../../../types/resource.types';
import { Box, Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledTypography = styled(Typography)``;

interface DescriptionFieldsProps {
  formikProps: FormikProps<FormikValues>;
}

const PreviewPanel: FC<DescriptionFieldsProps> = () => {
  const { values } = useFormikContext<Resource>();

  return (
    <>
      <StyledTypography>
        Sjekk at ting ser riktig ut før du publiserer. Ser du noe som ikke stemmer kan du gå tilbake og redigere.
      </StyledTypography>

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
