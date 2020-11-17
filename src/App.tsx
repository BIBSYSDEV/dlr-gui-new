import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import { BrowserRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './state/userSlice';
import { getAnonymousWebToken, getUserData } from './api/userApi';
import AppRoutes from './AppRoutes';
import { RootState } from './state/rootReducer';
import { CircularProgress } from '@material-ui/core';

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

const StyledProgressWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  align-items: center;
  justify-content: center;
`;

const isTokenExpired = () => {
  if (localStorage.tokenExpiry) {
    return parseInt(localStorage.tokenExpiry, 10) < ((Date.now() / 1000) | 0) + 3600;
  } else {
    return true;
  }
};

const isTokenAnonymous = () => {
  if (localStorage.anonymousToken) {
    return localStorage.anonymousToken === true;
  } else return false;
};

const App: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false); //TODO: put in redux-store (loginredirect-page should use this as well)

  useEffect(() => {
    if (localStorage.token && !isTokenAnonymous() && !isTokenExpired() && !user.id) {
      setIsLoadingUser(true);
      getUserData()
        .then((response) => {
          dispatch(setUser(response.data));
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => setIsLoadingUser(false));
    }
  }, [dispatch, user.id]);

  useEffect(() => {
    //TODO: better ways to achieve this ?
    if (!window.location.href.includes('/loginRedirect?token')) {
      if (!localStorage.token || isTokenExpired()) {
        getAnonymousWebToken()
          .then((response) => {
            if (response.data) {
              localStorage.token = response.data;
              localStorage.anonymousToken = true;
            } else {
              toast.error('API error');
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    }
  }, []);

  return (
    <BrowserRouter>
      {!isLoadingUser ? (
        <StyledApp>
          <ToastContainer autoClose={3000} hideProgressBar />
          <Header />
          <StyledContent>
            <AppRoutes />
          </StyledContent>
          <Footer />
        </StyledApp>
      ) : (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      )}
    </BrowserRouter>
  );
};

export default App;
