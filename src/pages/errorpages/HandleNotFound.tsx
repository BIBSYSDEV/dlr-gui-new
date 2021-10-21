import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ResourceInSpace from '../../resources/images/illustrations/resource_in_space.svg';
import { StyledContentWrapperLarge, StyledContentWrapperMedium } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';
import { Typography } from '@mui/material';

const StyledImg = styled.img`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 23rem;
  }
  width: 100%;
`;

const StyledTypography = styled(Typography)`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const HandleNotFound = () => {
  const { t } = useTranslation();
  return (
    <StyledContentWrapperLarge>
      <PageHeader testId="404">{`404 ${t('handle_not_found.handle_not_found')}`}</PageHeader>
      <StyledContentWrapperMedium>
        <StyledImg src={ResourceInSpace} alt={t('illustration_alts_tags.resource_in_space')} />
        <StyledTypography>{t('handle_not_found.this_resource_has_been_deleted')}</StyledTypography>
      </StyledContentWrapperMedium>
    </StyledContentWrapperLarge>
  );
};

export default HandleNotFound;
