import React, { FC, useEffect, useRef, useState } from 'react';
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
import { USE_MOCK_DATA } from './utils/constants';
import { mockUser } from './api/mockdata';
import i18next from 'i18next';
import ScrollToContentButton from './components/ScrollToContentButton';
import { useTranslation } from 'react-i18next';

const StyledApp = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  flex-grow: 1;
  word-break: break-word;
  width: 100%;
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
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
    if (USE_MOCK_DATA) {
      dispatch(setUser(mockUser));
      setIsLoadingUser(false);
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
    if (i18next.language.includes('en')) {
      document.documentElement.lang = 'en';
    }
  }, []);

  return (
    <BrowserRouter>
      {!isLoadingUser ? (
        <StyledApp>
          <ScrollToContentButton contentRef={mainContentRef} text={t('skip_to_main_content')} />
          <ToastContainer autoClose={3000} hideProgressBar />
          <Header />
          <StyledContent tabIndex={-1} ref={mainContentRef} role="main" id="content">
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
