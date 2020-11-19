import React from 'react';
import { Redirect } from 'react-router-dom';

const WithAuth = (Component: any) => (props: any) => {
  return props.id ? <Component {...props} /> : <Redirect to="/loginRedirect" />;
};

export default WithAuth;
