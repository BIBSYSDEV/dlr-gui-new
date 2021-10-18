import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LinkIcon from '@mui/icons-material/Link';
import LinkResourceForm, { LinkResourceFormValues } from './LinkResourceForm';
import StartRegistrationMethodAccordion from './StartRegistrationMethodAccordion';
import { urlValidationSchema } from '../../utils/validation/urlValidation';

const StyledBody = styled.div`
  width: 100%;
`;

interface LinkRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  onSubmit: (id: string) => void;
}

const LinkRegistration: FC<LinkRegistrationProps> = ({ expanded, onChange, onSubmit }) => {
  const { t } = useTranslation();

  const handleSubmit = (values: LinkResourceFormValues) => {
    const ensureTrimmedValues = urlValidationSchema.cast(values);
    const url = ensureTrimmedValues?.url as string;
    onSubmit(url);
  };

  return (
    <StartRegistrationMethodAccordion
      headerLabel={t('resource.start_with_link_to_resource')}
      icon={<LinkIcon className="icon" />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="resource-method-link"
      dataTestId="new-resource-link">
      <StyledBody>
        <LinkResourceForm handleSubmit={handleSubmit} />
      </StyledBody>
    </StartRegistrationMethodAccordion>
  );
};

export default LinkRegistration;
