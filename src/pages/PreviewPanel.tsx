import React, { FC } from 'react';
import { FormikProps, FormikValues } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';

interface DescriptionFieldsProps {
  formikProps: FormikProps<FormikValues>;
}

const PreviewPanel: FC<DescriptionFieldsProps> = ({ formikProps }) => {
  return (
    <StyledSchemaPartColored color={'#FFFFFF'}>
      <StyledContentWrapper>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(formikProps.values, null, 2)}</pre>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default PreviewPanel;
