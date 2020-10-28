import React, { FC, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getTokenExpiry } from '../api/api';
import { toast } from 'react-toastify';

const LoginRedirectPage: FC = () => {
  let query = new URLSearchParams(useLocation().search);
  const history = useHistory();

  useEffect(() => {
    let token = query.get('token');
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('anonymousToken', 'false');
      getTokenExpiry(token)
        .then((response) => {
          if (response.data.exp) {
            localStorage.tokenExpiry = response.data.exp;
          }
          history.push('/');
        })
        .catch(() => {
          toast.error('API ERROR');
        });
    }
  }, [history, query]);

  return <div />;
};

export default LoginRedirectPage;
