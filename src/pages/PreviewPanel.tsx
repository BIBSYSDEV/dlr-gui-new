import React, { FC } from 'react';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import ResourcePresentation from './ResourcePresentation';
import { ResourceWrapper } from '../types/resource.types';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content">
          Show full object (for debugging purposes)
        </AccordionSummary>
        <AccordionDetails>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(formikProps.values, null, 2)}</pre>
        </AccordionDetails>
      </Accordion>
    </StyledSchemaPartColored>
  );
};

export default PreviewPanel;
