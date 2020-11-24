import React, { FC, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivacyPolicy from './pages/infopages/PrivacyPolicy';
import { useSelector } from 'react-redux';
import ResourcePage from './pages/ResourcePage';
import LoginRedirectPage from './pages/LoginRedirectPage';
import { RootState } from './state/rootReducer';
import { Suspense } from 'react';
import DelayedFallback from './components/DelayedFallback';
import { v4 as uuidv4 } from 'uuid';
import Forbidden from './pages/Forbidden';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const EditResourcePage = lazy(() => import('./pages/EditResourcePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AppRoutes: FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Suspense fallback={<DelayedFallback />}>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/resource" component={ResourcePage} />
        <Route exact path="/resource/:identifier" component={ResourcePage} />
        <Route exact path="/privacy-policy" component={PrivacyPolicy} />
        <Route exact path="/loginRedirect" component={LoginRedirectPage} />
        {/* CreatorRoutes */}
        <Route
          exact
          path="/registration"
          render={(props) => <EditResourcePage id={user.id} {...props} key={uuidv4()} />}
        />
        {/*hack: uuidv4-key is forcing page refresh*/}
        <Route
          exact
          path="/registration/:identifier"
          render={(props) => <EditResourcePage id={user.id} {...props} key={uuidv4()} />}
        />
        <Route exact path="/forbidden" component={Forbidden} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
