import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './state/userSlice';
import { getAnonymousWebToken, getUserData } from './api/userApi';
import AppRoutes from './AppRoutes';
import { RootState } from './state/rootReducer';
import { CircularProgress } from '@material-ui/core';
import { USE_MOCK_DATA } from './utils/constants';
import { mockUser } from './api/mockdata';
import i18next from 'i18next';
import ScrollToContentButton from './components/ScrollToContentButton';
import { useTranslation } from 'react-i18next';
import ErrorBanner from './components/ErrorBanner';
import LoginRedirectPage from './pages/LoginRedirectPage';

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

const StyledProgressWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  align-items: center;
  justify-content: center;
`;

const isLoggedInTokenExpired = () => {
  if (localStorage.tokenExpiry) {
    return parseInt(localStorage.tokenExpiry, 10) < ((Date.now() / 1000) | 0) + 3600;
  } else {
    return true;
  }
};

const isTokenAnonymous = () => {
  if (localStorage.anonymousToken) {
    return localStorage.anonymousToken === 'true';
  } else return false;
};

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [userError, setUserError] = useState<Error>();
  const [tokenError, setTokenError] = useState<Error>();
  const [hasValidToken, setHasValidToken] = useState(false);

  useEffect(() => {
    if (localStorage.token) {
      setUserError(undefined);
      if (localStorage.token && !isTokenAnonymous() && !isLoggedInTokenExpired() && !user.id) {
        getUserData()
          .then((response) => {
            dispatch(setUser(response.data));
          })
          .catch((error) => {
            setUserError(error);
          })
          .finally(() => setIsLoadingUser(false));
      } else {
        setIsLoadingUser(false);
      }
    } else {
      setIsLoadingUser(false);
    }
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
      setIsLoadingUser(false);
    }
  }, [dispatch, user.id]);

  useEffect(() => {
    setTokenError(undefined);
    if (!window.location.href.includes('/loginRedirect?token')) {
      if (!localStorage.token || (localStorage.token && isLoggedInTokenExpired()) || !localStorage.anonymousToken) {
        getAnonymousWebToken()
          .then((response) => {
            if (response.data) {
              localStorage.token = response.data;
              localStorage.anonymousToken = true;
              setHasValidToken(true);
            } else {
              setTokenError(new Error('Could not get anonymous token'));
            }
          })
          .catch((error) => {
            setTokenError(error);
          });
      } else {
        setHasValidToken(true);
      }
    } else {
      setHasValidToken(true);
    }
    if (i18next.language.includes('en')) {
      document.documentElement.lang = 'en';
    }
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/loginRedirect" component={LoginRedirectPage} />
        <Route path="*">
          {tokenError && <ErrorBanner error={tokenError} />}
          {!isLoadingUser && hasValidToken ? (
            <StyledApp>
              <ScrollToContentButton contentRef={mainContentRef} text={t('skip_to_main_content')} />
              <Header />
              {userError && <ErrorBanner error={userError} />}
              <StyledContent tabIndex={-1} ref={mainContentRef} role="main" id="content">
                <AppRoutes />
              </StyledContent>
              <Footer />
            </StyledApp>
          ) : (
            <StyledProgressWrapper>
              <CircularProgress />
            </StyledProgressWrapper>
          )}
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
