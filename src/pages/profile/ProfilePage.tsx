import React from 'react';
import PrivateRoute from '../../utils/routes/PrivateRoute';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import { Colors } from '../../themes/mainTheme';

const StyledWrapper = styled(Grid)`
  background-color: ${Colors.DLRYellow1};
  padding: 1rem 1rem 2rem 1rem;
  margin-top: 2rem;
`;

const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('profile.profile')}</PageHeader>
      <StyledWrapper>Functionality coming soon...</StyledWrapper>
    </StyledContentWrapperLarge>
  );
};

export default PrivateRoute(ProfilePage);
