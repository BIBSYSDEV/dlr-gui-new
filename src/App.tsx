import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './layout/Breadcrumbs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './state/userSlice';
import { getAnonymousWebToken, getUserData } from './api/api';
import AppRoutes from './AppRoutes';
import { RootState } from './state/rootReducer';

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

const isTokenValid = () => {
  if (localStorage.tokenExpiry) {
    return parseInt(localStorage.tokenExpiry, 10) > ((Date.now() / 1000) | 0) + 3600;
  } else {
    return false;
  }
};

const App: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // console.log(user);
    // console.log('HAS_EXPIRY_DATE?', localStorage.tokenExpiry);
    // console.log('IS_EXPIRED?', parseInt(localStorage.tokenExpiry, 10) < ((Date.now() / 1000) | 0) + 3600);
    // console.log('IS_TOKEN_VALID?', isTokenValid());
    if (user.id === '') {
      if (!localStorage.token || !isTokenValid()) {
        getAnonymousWebToken()
          .then((response) => {
            if (response.data) {
              //console.log('setting new anonymous token');
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
        //console.log('is logged in');
        getUserData()
          .then((response) => {
            dispatch(setUser(response.data));
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    }
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <StyledApp>
        <ToastContainer autoClose={3000} hideProgressBar />
        <Header />
        <Breadcrumbs />
        <StyledContent>
          <AppRoutes />
        </StyledContent>
        <Footer />
      </StyledApp>
    </BrowserRouter>
  );
};

export default App;
