import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';

interface DescriptionFieldsProps {
  formikProps: FormikProps<FormikValues>;
}

const PreviewPanel: FC<DescriptionFieldsProps> = ({ formikProps }) => {
  const { t } = useTranslation();

  return (
    <StyledSchemaPartColored color={'#FFFFFF'}>
      <StyledContentWrapper>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(formikProps.values, null, 2)}</pre>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default PreviewPanel;
