import React from 'react';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Colors } from '../../themes/mainTheme';
import UserInformation from './UserInformation';
import EmailNotificationSetting from './EmailNotificationSetting';

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
  margin-bottom: 2rem;
`;

const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('profile.profile')}</PageHeader>
      <StyledWrapperWithTopMargin>
        <UserInformation />
      </StyledWrapperWithTopMargin>
      <ColoringWrapper color={Colors.DLRYellow2}>
        <EmailNotificationSetting />
      </ColoringWrapper>
    </StyledContentWrapperLarge>
  );
};

export default ProfilePage;
