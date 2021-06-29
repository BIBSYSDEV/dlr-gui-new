import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PrivacyPolicy from './pages/infopages/PrivacyPolicy';
import { useSelector } from 'react-redux';
import ResourcePage from './pages/resource/ResourcePage';
import MyResources from './pages/my_resources/MyResources';
import { RootState } from './state/rootReducer';
import DelayedFallback from './components/DelayedFallback';
import { v4 as uuidv4 } from 'uuid';
import Forbidden from './pages/errorpages/Forbidden';
import Sitemap from './pages/sitemap/Sitemap';
import SearchExplainer from './pages/infopages/SearchExplainer';
import AdminPage from './pages/admin/AdminPage';
import MainContentView from './pages/content_view/MainContentView';
import WorkListPage from './pages/worklist/WorkListPage';
import ProfilePage from './pages/profile/ProfilePage';

const Explore = lazy(() => import('./pages/dashboard/Explore'));
const EditResourcePage = lazy(() => import('./pages/edit_resource/EditResourcePage'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));

const AppRoutes = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Suspense fallback={<DelayedFallback />}>
      <Switch>
        <Route exact path="/" component={Explore} />
        <Redirect exact path="/resource/:identifier" to="/resources/:identifier" />
        <Redirect
          exact
          path="/resource/:resourceIdentifier/content/main"
          to="/resources/:resourceIdentifier/content/main"
        />
        <Route exact path="/resources/:identifier" component={ResourcePage} />
        <Route exact path="/resources/:resourceIdentifier/content/main" component={MainContentView} />
        <Route exact path="/resources/user/current" render={(props) => <MyResources id={user.id} {...props} />} />
        <Route
          exact
          path="/admin"
          render={(props) => <AdminPage isAdmin={user.institutionAuthorities?.isAdministrator} {...props} />}
        />
        <Route exact path="/profile" render={(props) => <ProfilePage id={user.id} {...props} />} />
        <Route exact path="/privacy-policy" component={PrivacyPolicy} />
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
        <Route
          exact
          path="/worklist"
          render={(props) => (
            <WorkListPage
              isEditor={user.institutionAuthorities?.isEditor}
              isCurator={user.institutionAuthorities?.isCurator}
              {...props}
            />
          )}
        />
        <Route exact path="/forbidden" component={Forbidden} />
        <Route exact path="/search-helper" component={SearchExplainer} />
        <Route exact path="/sitemap" component={Sitemap} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
