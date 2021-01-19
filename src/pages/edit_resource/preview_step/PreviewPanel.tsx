import React, { FC } from 'react';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import ResourcePresentation from '../../resource/ResourcePresentation';
import { ResourceWrapper } from '../../../types/resource.types';

interface DescriptionFieldsProps {
  formikProps: FormikProps<FormikValues>;
}

const PreviewPanel: FC<DescriptionFieldsProps> = ({ formikProps }) => {
  const { values } = useFormikContext<ResourceWrapper>();

  return (
    <StyledSchemaPartColored color={'#FFFFFF'}>
      <StyledContentWrapper>
        {values.resource && <ResourcePresentation resource={values.resource} />}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default PreviewPanel;
