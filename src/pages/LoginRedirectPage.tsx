import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getTokenExpiry, getUserData } from '../api/userApi';
import { setUser } from '../state/userSlice';
import { useDispatch } from 'react-redux';
import ErrorBanner from '../components/ErrorBanner';

const LoginRedirectPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token: string = query.get('token') + '';
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('anonymousToken', 'false');
      getTokenExpiry(token)
        .then((response) => {
          if (response.data.exp) {
            localStorage.tokenExpiry = response.data.exp;
            getUserData()
              .then((response) => {
                //TODO: const institutionAuthorities = await getUserAuthorizationsInstitution();
                //TODO: rewrite as async
                dispatch(setUser(response.data));
              })
              .finally(() => {
                const newPathName = window.location.pathname.replace('/loginRedirect', '');
                const searchParams = new URLSearchParams(location.search);
                searchParams.delete('token');
                const newUrl = newPathName + (searchParams.toString().length > 0 ? '?' + searchParams.toString() : '');
                history.push(newUrl);
                history.go(0);
              });
          }
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, [history, location, dispatch]);

  return <div>{error && <ErrorBanner error={error} />}</div>;
};

export default LoginRedirectPage;
