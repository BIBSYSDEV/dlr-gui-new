import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { getTokenExpiry, getUserAuthorizationsInstitution, getUserData } from '../api/userApi';
import { setUser } from '../state/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBanner from '../components/ErrorBanner';
import { RootState } from '../state/rootReducer';
import { unpackFeideLogin } from '../utils/rewriteSearchParams';

const LoginRedirectPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState<Error | null>();
  const [doneLoading, setDoneLoading] = useState(false);

  useEffect(() => {
    const login = async () => {
      try {
        setError(null);
        const query = new URLSearchParams(location.search);
        const token: string = query.get('token') + '';
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('anonymousToken', 'false');
          const tokenExpiryResponse = await getTokenExpiry(token);
          localStorage.tokenExpiry = tokenExpiryResponse.data.exp;
          const institutionAuthoritiesPromise = getUserAuthorizationsInstitution(token);
          const userDataResponse = await getUserData(token);
          const institutionAuthorities = await institutionAuthoritiesPromise;
          dispatch(setUser({ ...userDataResponse.data, institutionAuthorities: institutionAuthorities }));
        }
      } catch (error) {
        setError(error);
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
