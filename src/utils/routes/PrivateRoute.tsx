import React, { ComponentType } from 'react';
import { Redirect } from 'react-router-dom';

const PrivateRoute = (Component: ComponentType<any>) => (props: any) => {
  return props.id ? <Component {...props} /> : <Redirect to="/forbidden" />;
};

export default PrivateRoute;
