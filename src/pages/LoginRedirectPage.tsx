import React, { useEffect, useRef, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { getTokenExpiry, getUserAuthorizationsInstitution, getUserData } from '../api/userApi';
import { setUser } from '../state/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBanner from '../components/ErrorBanner';
import { RootState } from '../state/rootReducer';

const LoginRedirectPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [error, setError] = useState<Error | null>();
  const mountedRef = useRef(true);

  let newPathName = window.location.pathname.replace('/loginRedirect', '');
  if (newPathName.length === 0) {
    newPathName = '/';
  }
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.delete('token');
  let newSearchParams = searchParams.toString().length > 0 ? '?' : '';
  searchParams.forEach((value, key) => {
    const paramsList = key.split('ZZZ').slice(1);
    paramsList.forEach((valuePair, index) => {
      const pairs = valuePair.split('XXX');
      if (index === 0) {
        newSearchParams += `${pairs[0]}=${pairs[1]}`;
      } else {
        newSearchParams += `&${pairs[0]}=${pairs[1]}`;
      }
    });
  });
  const newUrl = newPathName + newSearchParams;

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
          if (!mountedRef.current) return null;
          dispatch(setUser({ ...userDataResponse.data, institutionAuthorities: institutionAuthorities }));
        }
      } catch (error) {
        if (!mountedRef.current) return null;
        setError(error);
      }
    };
    login();
  }, [location, dispatch]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <>
      {user.id && !error && <Redirect to={newUrl} from={location.toString()} />}
      <div>{error && <ErrorBanner error={error} />}</div>
    </>
  );
};

export default LoginRedirectPage;
