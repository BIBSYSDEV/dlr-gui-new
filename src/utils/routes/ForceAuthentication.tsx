import React, { ComponentType } from 'react';
import { API_PATHS, API_URL } from '../constants';

const ForceAuthentication = (Component: ComponentType<any>) => (props: any) => {
  const Forced = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const forceAuthentication = searchParams.get('forceAuthentication') === 'true';
    if (props.user.id.length === 0 && forceAuthentication) {
      searchParams.delete('forceAuthentication');
      const originSearchParams = searchParams.toString().length > 0 ? '?' + searchParams.toString() : '';
      const originHref = window.location.origin + '/loginRedirect' + window.location.pathname + originSearchParams;
      window.location.href = `${API_URL}${API_PATHS.guiBackendLoginPath}/feideLogin?target=${originHref}`;
      return <></>;
    } else {
      return <Component {...props} />;
    }
  };
  return <Forced />;
};

export default ForceAuthentication;
