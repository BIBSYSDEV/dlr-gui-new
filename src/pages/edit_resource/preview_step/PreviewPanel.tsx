import React, { FC } from 'react';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import ResourcePresentation from '../../resource/ResourcePresentation';
import { Resource } from '../../../types/resource.types';
import { Typography } from '@material-ui/core';
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
    values && (
      <>
        {!values.features.dlr_status_published && (
          <StyledTypography>
            {t('confirm_before_publishing_title')} {t('confirm_before_publishing')}
          </StyledTypography>
        )}
        <Typography data-testid="resource-title" variant="h2">
          {values.features.dlr_title}
        </Typography>
        <ResourcePresentation resource={values} isPreview={true} />
      </>
    )
  );
};

export default PreviewPanel;
