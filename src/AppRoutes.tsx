import React, { FC, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivacyPolicy from './pages/infopages/PrivacyPolicy';
import { useSelector } from 'react-redux';
import ResourcePage from './pages/resource/ResourcePage';
import MyResources from './pages/my_resources/MyResources';
import LoginRedirectPage from './pages/LoginRedirectPage';
import { RootState } from './state/rootReducer';
import { Suspense } from 'react';
import DelayedFallback from './components/DelayedFallback';
import { v4 as uuidv4 } from 'uuid';
import Forbidden from './pages/errorpages/Forbidden';
import Sitemap from './pages/sitemap/Sitemap';

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const EditResourcePage = lazy(() => import('./pages/edit_resource/EditResourcePage'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));

const AppRoutes: FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Suspense fallback={<DelayedFallback />}>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/resource/:identifier" component={ResourcePage} />
        <Route exact path="/resources/user/current" component={MyResources} />
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
          path="/editresource/:identifier"
          render={(props) => <EditResourcePage id={user.id} {...props} key={uuidv4()} />}
        />
        <Route exact path="/forbidden" component={Forbidden} />
        <Route exact path="/sitemap" component={Sitemap} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
