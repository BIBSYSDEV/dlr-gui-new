import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
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
import { resourcePath } from './utils/constants';
import HandleNotFound from './pages/errorpages/HandleNotFound';
import ResourceNotFound from './pages/errorpages/ResourceNotFound';

const Explore = lazy(() => import('./pages/dashboard/Explore'));
const EditResourcePage = lazy(() => import('./pages/edit_resource/EditResourcePage'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));

const AppRoutes = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Suspense fallback={<DelayedFallback />}>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/handlenotfound" element={<HandleNotFound />} />
        <Route path="/resourcenotfound" element={<ResourceNotFound />} />
        <Route path="/resource/:identifier" render={() => <Redirect to={`${resourcePath}/:identifier`} />} />
        <Route
          path="/resource/:resourceIdentifier/content/main"
          render={() => <Redirect to={`${resourcePath}/:resourceIdentifier/content/main`} />}
        />
        <Route path={`${resourcePath}/:identifier`} element={<ResourcePage />} />
        <Route path={`${resourcePath}/:resourceIdentifier/content/main`} element={<MainContentView />} />
        <Route path={`${resourcePath}/user/current`} render={(props) => <MyResources id={user.id} {...props} />} />
        <Route
          path="/admin"
          render={(props) => <AdminPage isAdmin={user.institutionAuthorities?.isAdministrator} {...props} />}
        />
        <Route path="/profile" render={(props) => <ProfilePage id={user.id} {...props} />} />
        <Route path="/privacy-policy" element={PrivacyPolicy} />
        {/* CreatorRoutes */}
        <Route path="/registration" render={(props) => <EditResourcePage id={user.id} {...props} />} />
        {/*hack: uuidv4-key is forcing page refresh*/}
        <Route
          path="/editresource/:identifier"
          render={(props) => <EditResourcePage id={user.id} {...props} key={uuidv4()} />}
        />
        <Route
          path="/worklist"
          render={(props) => (
            <WorkListPage
              isEditor={user.institutionAuthorities?.isEditor}
              isCurator={user.institutionAuthorities?.isCurator}
              {...props}
            />
          )}
        />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/search-helper" element={<SearchExplainer />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
