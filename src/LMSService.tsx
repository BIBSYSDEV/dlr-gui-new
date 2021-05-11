import React, { FC } from 'react';
import ScrollToContentButton from './components/ScrollToContentButton';
import Header from './layout/header/Header';
import ErrorBanner from './components/ErrorBanner';
import AppRoutes from './AppRoutes';
import Footer from './layout/Footer';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { API_PATHS, API_URL } from './utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from './state/rootReducer';

const StyledApp = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  flex-grow: 1;
  word-break: break-word;
  width: 100%;
`;

interface LMSServiceProps {
  mainContentRef: React.RefObject<HTMLDivElement>;
  userError: Error | undefined;
}

const LMSService: FC<LMSServiceProps> = ({ mainContentRef, userError }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);

  const searchParams = new URLSearchParams(window.location.search);
  const forceAuthentication = searchParams.get('forceAuthentication') === 'true';
  const navbar = searchParams.get('navbar') !== 'false';

  if (user.id.length === 0 && forceAuthentication) {
    const originSearchParams = searchParams.toString().length > 0 ? '?' + searchParams.toString() : '';
    const originHref = window.location.origin + '/loginRedirect' + window.location.pathname + originSearchParams;
    window.location.href = `${API_URL}${API_PATHS.guiBackendLoginPath}/feideLogin?target=${originHref}`;
  }

  return (
    <StyledApp>
      <ScrollToContentButton contentRef={mainContentRef} text={t('skip_to_main_content')} />
      {navbar && <Header />}
      {userError && <ErrorBanner error={userError} />}
      <StyledContent tabIndex={-1} ref={mainContentRef} role="main" id="content">
        <AppRoutes />
      </StyledContent>
      <Footer />
    </StyledApp>
  );
};

export default LMSService;
