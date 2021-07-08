import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperMedium } from '../../components/styled/Wrappers';
import ResourceInSpace from '../../resources/images/illustrations/resource_in_space.svg';

const StyledImg = styled.img`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 23rem;
  }
  width: 100%;
`;

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader data-testid="404">{t('error.404_page')}</PageHeader>
      <StyledContentWrapperMedium>
        <StyledImg src={ResourceInSpace} alt={t('illustration_alts_tags.resource_in_space')} />
      </StyledContentWrapperMedium>
    </>
  );
};

export default NotFound;
