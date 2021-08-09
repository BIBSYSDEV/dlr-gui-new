import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { StyledContentWrapperLarge, StyledContentWrapperMedium } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';
import SecureFiles from '../../resources/images/illustrations/secure_files.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import LoginReminder from '../../components/LoginReminder';

const StyledImg = styled.img`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 23rem;
  }
  width: 100%;
`;

const Forbidden = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  return (
    <StyledContentWrapperLarge>
      <PageHeader testId="401">{user.id ? t('error.401_page') : t('error.403_page')}</PageHeader>
      <StyledContentWrapperMedium>
        <StyledImg src={SecureFiles} alt={t('illustration_alts_tags.secure_files')} />
      </StyledContentWrapperMedium>
      {!user.id && <LoginReminder customMessage={t('error.login_for_more_functionality')} />}
    </StyledContentWrapperLarge>
  );
};

export default Forbidden;
