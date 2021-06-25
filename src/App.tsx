import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './state/userSlice';
import { getAnonymousWebToken, getUserAuthorizationsInstitution, getUserData } from './api/userApi';
import { RootState } from './state/rootReducer';
import { CircularProgress } from '@material-ui/core';
import { USE_MOCK_DATA } from './utils/constants';
import i18next from 'i18next';
import ErrorBanner from './components/ErrorBanner';
import LoginRedirectPage from './pages/LoginRedirectPage';
import AppContent from './AppContent';
import { StyledFullPageProgressWrapper } from './components/styled/Wrappers';

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
  const [userError, setUserError] = useState<Error>();
  const [tokenError, setTokenError] = useState<Error>();
  const [hasValidToken, setHasValidToken] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userDataResponse = await getUserData();
        const institutionAuthorities = await getUserAuthorizationsInstitution();
        dispatch(setUser({ ...userDataResponse.data, institutionAuthorities: institutionAuthorities }));
      } catch (error) {
        setUserError(error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    if (USE_MOCK_DATA && !user.id) {
      loadUser();
    } else {
      if (localStorage.token) {
        setUserError(undefined);
        if (localStorage.token && !isTokenAnonymous() && !isLoggedInTokenExpired() && !user.id) {
          loadUser();
        } else {
          setIsLoadingUser(false);
        }
      } else {
        setIsLoadingUser(false);
      }
    }
  }, [dispatch, user.id]);

  useEffect(() => {
    setTokenError(undefined);
    if (!window.location.href.includes('/loginRedirect')) {
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
        <Route path="/loginRedirect" component={LoginRedirectPage} />
        <Route path="*">
          {tokenError && <ErrorBanner error={tokenError} />}
          {!isLoadingUser && hasValidToken ? (
            <AppContent mainContentRef={mainContentRef} userError={userError} />
          ) : (
            <StyledFullPageProgressWrapper>
              <CircularProgress />
            </StyledFullPageProgressWrapper>
          )}
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
