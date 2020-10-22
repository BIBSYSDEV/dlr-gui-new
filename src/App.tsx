import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Breadcrumbs from './layout/Breadcrumbs';
import ResourcePage from './pages/ResourcePage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginRedirectPage from './pages/LoginRedirectPage';
import { useDispatch } from 'react-redux';
import { setUser } from './state/userSlice';
import { getAnonymousWebToken, getUserData } from './api/api';

const StyledApp = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'};
  align-items: center;
  flex-grow: 1;
  color: ${({ theme }) => theme.palette.primary.main};
  word-break: break-all;
`;

const isTokenExpired = () => {
  return !!localStorage.tokenExpiry && parseInt(localStorage.tokenExpiry, 10) < ((Date.now() / 1000) | 0) + 3600;
};

const App: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.token || isTokenExpired()) {
      getAnonymousWebToken()
        .then((response) => {
          if (response.data) {
            localStorage.token = response.data;
            localStorage.anonymousToken = true;
          } else {
            toast.error('API ERROR');
          }
        })
        .catch(() => {
          toast.error('API ERROR');
        });
    } else if (localStorage.anonymousToken !== 'true') {
      getUserData()
        .then((response) => {
          dispatch(setUser(response.data));
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <StyledApp>
        <ToastContainer autoClose={3000} hideProgressBar />
        <Header />
        <Breadcrumbs />
        <StyledContent>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/resource/:identifier" component={ResourcePage} />
            <Route exact path="/loginRedirect" component={LoginRedirectPage} />
          </Switch>
        </StyledContent>
        <Footer />
      </StyledApp>
    </BrowserRouter>
  );
};

export default App;
