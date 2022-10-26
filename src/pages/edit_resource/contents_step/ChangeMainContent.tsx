import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';
import UppyDashboard from '../../../components/UppyDashboard';
import { Content } from '../../../types/content.types';
import { useUppy } from '@uppy/react';
import { createMainFileChangerUppy } from '../../../utils/uppy-config';
import { Resource } from '../../../types/resource.types';
import {
  setContentAsDefaultThumbnail,
  setContentAsDefaultContent,
  setContentAsMasterContent,
  deleteContentAsMasterContent,
} from '../../../api/fileApi';
import { useFormikContext } from 'formik';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';

const StyledAccordion = styled(Accordion)`
  max-width: 100%;
  margin-top: 1rem;
  border: 1px;
`;

const ChangeMainContent = () => {
  const { values, resetForm, touched, setTouched } = useFormikContext<Resource>();
  const [newContent, setNewContent] = useState<Content | undefined>();
  const mainFileChangeUppy = useUppy(createMainFileChangerUppy(values.identifier, setNewContent));

  useEffect(() => {
    mainFileChangeUppy.on('complete', () => {
      const changeDefaultContent = async () => {
        if (newContent) {
          newContent.features.dlr_content_title = newContent.features.dlr_content;
          await setContentAsDefaultContent(values.identifier, newContent.identifier);
          const oldMasterContent = values.contents.masterContent;
          newContent.features.dlr_content_default = 'true';
          oldMasterContent.features.dlr_content_default = 'false';
          await setContentAsMasterContent(values.identifier, newContent.identifier);
          newContent.features.dlr_content_master = 'true';
          oldMasterContent.features.dlr_content_master = 'false';

          if (oldMasterContent.features.dlr_thumbnail_default === 'true') {
            await setContentAsDefaultThumbnail(values.identifier, newContent.identifier);
            oldMasterContent.features.dlr_thumbnail_default = 'false';
            newContent.features.dlr_thumbnail_default = 'true';
          }
          values.contents.additionalContent = [...values.contents.additionalContent, oldMasterContent];
          values.contents.masterContent = newContent;
          resetFormButKeepTouched(touched, resetForm, values, setTouched);
          await deleteContentAsMasterContent(values.identifier, oldMasterContent.identifier);
        }
      };
      changeDefaultContent().then();
    });
  }, [newContent, mainFileChangeUppy, resetForm, setTouched, touched, values]);

  return (
    <>
      <StyledAccordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Bytt ut hovedinnhold</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {!values.features.dlr_identifier_doi ? (
            <UppyDashboard hideCancelButton={false} uppy={mainFileChangeUppy} />
          ) : (
            <Typography color="secondary">Du kan ikke bytte ut hovedfil etter at en ressurs har fått doi</Typography>
          )}
        </AccordionDetails>
      </StyledAccordion>
    </>
  );
};

export default ChangeMainContent;
