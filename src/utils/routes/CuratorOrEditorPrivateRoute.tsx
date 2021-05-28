import React, { ComponentType } from 'react';
import { Redirect } from 'react-router-dom';

const CuratorOrEditorPrivateRoute = (Component: ComponentType<any>) => (props: any) => {
  return props.isEditor || props.isCurator ? <Component {...props} /> : <Redirect to="/forbidden" />;
};

export default CuratorOrEditorPrivateRoute;
