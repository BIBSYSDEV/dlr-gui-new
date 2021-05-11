import React, { ComponentType } from 'react';
import { Redirect } from 'react-router-dom';

const AdminRoute = (Component: ComponentType<any>) => (props: any) => {
  return props.isAdmin ? <Component {...props} /> : <Redirect to="/forbidden" />;
};

export default AdminRoute;
