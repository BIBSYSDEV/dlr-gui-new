import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import {
  getTokenExpiry,
  getUserAppFeaturesApplication,
  getUserAuthorizationsInstitution,
  getUserData,
} from '../api/userApi';
import { setUser } from '../state/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBanner from '../components/ErrorBanner';
import { RootState } from '../state/rootReducer';
import { unpackFeideLogin } from '../utils/rewriteSearchParams';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../utils/AxiosErrorHandling';

const LoginRedirectPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState<Error | AxiosError>();
  const [doneLoading, setDoneLoading] = useState(false);

  useEffect(() => {
    const login = async () => {
      try {
        setError(undefined);
        const query = new URLSearchParams(location.search);
        const token: string = query.get('token') + '';
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('anonymousToken', 'false');
          const tokenExpiryResponsePromise = getTokenExpiry(token);
          const institutionAuthoritiesPromise = getUserAuthorizationsInstitution();
          const userDataPromise = getUserData();
          const appFeaturePromise = getUserAppFeaturesApplication();
          const userDataResponse = await userDataPromise;
          const institutionAuthorities = await institutionAuthoritiesPromise;
          const tokenExpiryResponse = await tokenExpiryResponsePromise;
          const appFeature = await appFeaturePromise;
          localStorage.setItem('tokenExpiry', tokenExpiryResponse.data.exp);
          dispatch(
            setUser({
              ...userDataResponse.data,
              institutionAuthorities: institutionAuthorities,
              appFeature: appFeature,
            })
          );
        }
      } catch (error) {
        setError(handlePotentialAxiosError(error));
      } finally {
        setDoneLoading(true);
      }
    };
    login();
  }, [location, dispatch]);

  return (
    <>
      {user.id && !error && doneLoading && <Redirect to={unpackFeideLogin()} from={location.toString()} />}
      <div>{error && <ErrorBanner error={error} />}</div>
    </>
  );
};

export default LoginRedirectPage;
