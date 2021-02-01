import React, { FC } from 'react';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import ResourcePresentation from '../../resource/ResourcePresentation';
import { Resource } from '../../../types/resource.types';

interface DescriptionFieldsProps {
  formikProps: FormikProps<FormikValues>;
}

const PreviewPanel: FC<DescriptionFieldsProps> = ({ formikProps }) => {
  const { values } = useFormikContext<Resource>();

  return (
    <StyledSchemaPartColored color={'#FFFFFF'}>
      <StyledContentWrapper>{values && <ResourcePresentation resource={values} />}</StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default PreviewPanel;
