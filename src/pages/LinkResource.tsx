import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import LinkResourceForm, { LinkResourceFormValues } from './LinkResourceForm';
import PublicationAccordion from './PublicationAccordion';
import { urlValidationSchema } from '../utils/validation/urlValidation';
import { createResource } from '../api/api';
import { ResourceCreationType } from '../types/resource.types';

const StyledBody = styled.div`
  width: 100%;
`;

interface LinkPublicationPanelProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
}

const LinkResource: FC<LinkPublicationPanelProps> = ({ expanded, onChange }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleSubmit = (values: LinkResourceFormValues) => {
    const ensureTrimmedValues = urlValidationSchema.cast(values);
    const url = ensureTrimmedValues?.url as string;
    //const decodedUrl = decodeURIComponent(url);
    //todo: ekte url-validering (denne sjekker ikke http://

    createResource(ResourceCreationType.LINK, url).then((response) => {
      if (response.data.identifier) {
        history.push(`/registration/${response.data.identifier}`);
      }
    });
  };

  return (
    <PublicationAccordion
      headerLabel={t('resource.start_with_link_to_resource')}
      icon={<LinkIcon className="icon" />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-link"
      dataTestId="new-publication-link">
      <StyledBody>
        <Typography>{t('resource.link_to_resource')}:</Typography>
        <LinkResourceForm handleSubmit={handleSubmit} />
      </StyledBody>
    </PublicationAccordion>
  );
};

export default LinkResource;
