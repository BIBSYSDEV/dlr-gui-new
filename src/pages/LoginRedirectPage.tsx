import React, { FC, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getTokenExpiry, getUserData } from '../api/api';
import { toast } from 'react-toastify';
import { setUser } from '../state/userSlice';
import { useDispatch } from 'react-redux';

const LoginRedirectPage: FC = () => {
  let query = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    let token: string = query.get('token') + '';
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
  }, [history, query, dispatch]);

  return <div />;
};

export default LoginRedirectPage;
