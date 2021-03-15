import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getTokenExpiry, getUserData } from '../api/userApi';
import { toast } from 'react-toastify';
import { setUser } from '../state/userSlice';
import { useDispatch } from 'react-redux';

const LoginRedirectPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

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
            getUserData().then((response) => {
              dispatch(setUser(response.data));
            });
            history.push('/');
          }
        })
        .catch((error) => {
          toast.error('ERROR: ' + error.message);
        });
    }
  }, [history, location, dispatch]);

  return <div />;
};

export default LoginRedirectPage;
