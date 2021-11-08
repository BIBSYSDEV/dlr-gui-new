import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
import LoginRedirectPage from './pages/LoginRedirectPage';

const Explore = lazy(() => import('./pages/dashboard/Explore'));
const EditResourcePage = lazy(() => import('./pages/edit_resource/EditResourcePage'));
const NotFound = lazy(() => import('./pages/errorpages/NotFound'));

function RequireAuth({ children }: any) {
  const user = useSelector((state: RootState) => state.user);
  return user.id ? children : <Navigate to="/forbidden" />;
}

function RequireAdmin({ children }: any) {
  const user = useSelector((state: RootState) => state.user);
  return user.institutionAuthorities?.isAdministrator ? children : <Navigate to="/forbidden" />;
}

function RequireCuratorOrEditor({ children }: any) {
  const user = useSelector((state: RootState) => state.user);
  return user.institutionAuthorities?.isEditor || user.institutionAuthorities?.isCurator ? (
    children
  ) : (
    <Navigate to="/forbidden" />
  );
}

const AppRoutes = () => {
  return (
    <Suspense fallback={<DelayedFallback />}>
      <Routes>
        <Route path="/loginRedirect" element={<LoginRedirectPage />} />
        <Route path="/" element={<Explore />} />
        <Route path="/handlenotfound" element={<HandleNotFound />} />
        <Route path="/resourcenotfound" element={<ResourceNotFound />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/resource/:identifier" element={<Navigate replace to={`${resourcePath}/:identifier`} />} />
        <Route
          path="/resource/:resourceIdentifier/content/main"
          element={<Navigate replace to={`${resourcePath}/:resourceIdentifier/content/main`} />}
        />
        <Route path={`${resourcePath}/:identifier`} element={<ResourcePage />} />
        <Route path={`${resourcePath}/:resourceIdentifier/content/main`} element={<MainContentView />} />
        <Route
          path={`${resourcePath}/user/current`}
          element={
            <RequireAuth>
              <MyResources />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />

        <Route
          path="/registration"
          element={
            <RequireAuth>
              <EditResourcePage />
            </RequireAuth>
          }
        />
        {/*TODO/!*hack: uuidv4-key is forcing page refresh*!/*/}
        <Route
          path="/editresource/:identifier"
          element={
            <RequireAuth>
              <EditResourcePage key={uuidv4()} />
            </RequireAuth>
          }
        />
        <Route
          path="/worklist"
          element={
            <RequireCuratorOrEditor>
              <WorkListPage />
            </RequireCuratorOrEditor>
          }
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
