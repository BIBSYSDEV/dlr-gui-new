import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './state/userSlice';
import {
  getAnonymousWebToken,
  getUserAppFeaturesApplication,
  getUserAuthorizationsInstitution,
  getUserData,
} from './api/userApi';
import { RootState } from './state/rootReducer';
import { CircularProgress } from '@material-ui/core';
import { USE_MOCK_DATA } from './utils/constants';
import i18next from 'i18next';
import ErrorBanner from './components/ErrorBanner';
import LoginRedirectPage from './pages/LoginRedirectPage';
import AppContent from './AppContent';
import { StyledFullPageProgressWrapper } from './components/styled/Wrappers';
import useInterval from './utils/useInterval';
import { LMSParametersName } from './types/LMSParameters';

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

const completedDelayMilliSeconds = 3000;

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
        const userDataPromise = getUserData();
        const institutionAuthoritiesPromise = getUserAuthorizationsInstitution();
        const appFeaturePromise = getUserAppFeaturesApplication();
        const userData = await userDataPromise;
        const institutionAuthorities = await institutionAuthoritiesPromise;
        const appFeature = await appFeaturePromise;
        dispatch(setUser({ ...userData.data, institutionAuthorities: institutionAuthorities, appFeature: appFeature }));
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

  const pollForLoginInterval = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const shouldPollForLogin = searchParams.get(LMSParametersName.PollForLogin);
    if (user.id || !shouldPollForLogin || isLoadingUser) {
      return null;
    } else {
      return completedDelayMilliSeconds;
    }
  }, [isLoadingUser, user.id]);

  //useInterval exists for pages that embeds more than one DLR iframe, this way the user only needs to log into one of the iframes in order to log into all of them
  useInterval(() => {
    if (localStorage.token && !isTokenAnonymous() && !isLoggedInTokenExpired() && !user.id) {
      window.location.reload();
    }
  }, pollForLoginInterval());

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
