import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LinkIcon from '@material-ui/icons/Link';
import LinkResourceForm, { LinkResourceFormValues } from './LinkResourceForm';
import PublicationAccordion from './PublicationAccordion';
import { urlValidationSchema } from '../../utils/validation/urlValidation';

const StyledBody = styled.div`
  width: 100%;
`;

interface LinkRegistrationPanelProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  onSubmit: (id: string) => void;
}

const LinkResource: FC<LinkRegistrationPanelProps> = ({ expanded, onChange, onSubmit }) => {
  const { t } = useTranslation();

  const handleSubmit = (values: LinkResourceFormValues) => {
    const ensureTrimmedValues = urlValidationSchema.cast(values);
    const url = ensureTrimmedValues?.url as string;
    onSubmit(url);
  };

  return (
    <PublicationAccordion
      headerLabel={t('resource.start_with_link_to_resource')}
      icon={<LinkIcon className="icon" />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="resource-method-link"
      dataTestId="new-resource-link">
      <StyledBody>
        <LinkResourceForm handleSubmit={handleSubmit} />
      </StyledBody>
    </PublicationAccordion>
  );
};

export default LinkResource;
