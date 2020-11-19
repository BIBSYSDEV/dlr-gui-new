import React, { ComponentType } from 'react';
import { Redirect } from 'react-router-dom';

/**
 * Higher-order-component that redirects to forbidden unless user is logged in.
 * @param Component that will receive auth-guard.
 * Components that should use "PrivateRoute" should be exported like this: "export defaults PrivateRoute(myComponent)";
 */
const PrivateRoute = (Component: ComponentType<any>) => (props: any) => {
  return props.id ? <Component {...props} /> : <Redirect to="/forbidden" />;
};

export default PrivateRoute;
