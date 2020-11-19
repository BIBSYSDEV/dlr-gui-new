import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../components/Heading';

const StyledForbiddenWrapper = styled.div`
  width: 100%;
  text-align: center;
  padding-top: 4rem;
`;

const Forbidden: React.FC = () => {
  const { t } = useTranslation();

  return (
    <StyledForbiddenWrapper data-testid="403">
      <Heading>{t('error.403_page')}</Heading>
    </StyledForbiddenWrapper>
  );
};

export default Forbidden;
