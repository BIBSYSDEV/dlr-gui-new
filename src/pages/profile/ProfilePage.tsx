import React from 'react';
import PrivateRoute from '../../utils/routes/PrivateRoute';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Colors } from '../../themes/mainTheme';
import UserInformation from './UserInformation';
import EmailNotificationSetting from './EmailNotificationSetting';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';

const StyledWrapperWithTopMargin = styled.div`
  background-color: ${Colors.DLRYellow1};
  padding: 1rem 1rem 2rem 1rem;
  margin-top: 2rem;
`;

interface Props {
  color: string;
}

const ColoringWrapper = styled.div<Props>`
  background-color: ${(props) => props.color};
  padding: 1rem 1rem 2rem 1rem;
`;

const ProfilePage = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('profile.profile')}</PageHeader>
      <StyledWrapperWithTopMargin>
        <UserInformation />
      </StyledWrapperWithTopMargin>
      {(user.institutionAuthorities?.isEditor || user.institutionAuthorities?.isCurator) && (
        <ColoringWrapper color={Colors.DLRYellow2}>
          <EmailNotificationSetting />
        </ColoringWrapper>
      )}
    </StyledContentWrapperLarge>
  );
};

export default PrivateRoute(ProfilePage);
