import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getTokenExpiry, getUserAuthorizationsInstitution, getUserData } from '../api/userApi';
import { setUser } from '../state/userSlice';
import { useDispatch } from 'react-redux';
import ErrorBanner from '../components/ErrorBanner';

const LoginRedirectPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const login = async () => {
      try {
        const query = new URLSearchParams(location.search);
        const token: string = query.get('token') + '';
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('anonymousToken', 'false');
          const tokenExpiryResponse = await getTokenExpiry(token);
          localStorage.tokenExpiry = tokenExpiryResponse.data.exp;
          const userDataPromise = getUserData();
          const institutionAuthorities = await getUserAuthorizationsInstitution();
          const userDataResponse = await userDataPromise;
          dispatch(setUser({ ...userDataResponse.data, institutionAuthorities: institutionAuthorities }));
        }
      } catch (error) {
        setError(error);
      } finally {
        const newPathName = window.location.pathname.replace('/loginRedirect', '');
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('token');
        const newUrl = newPathName + (searchParams.toString().length > 0 ? '?' + searchParams.toString() : '');
        history.push(newUrl);
        history.go(0);
      }
    };
    login();
  }, [history, location, dispatch]);

  return <div>{error && <ErrorBanner error={error} />}</div>;
};

export default LoginRedirectPage;
