import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Footer from './layout/Footer';
import Header from './layout/header/Header';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Breadcrumbs from './layout/Breadcrumbs';
import ResourcePage from './pages/ResourcePage';

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
`;

const App: FC = () => {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <StyledApp>
        <Header />
        <Breadcrumbs />
        <StyledContent>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/resource/:identifier" component={ResourcePage} />
          </Switch>
        </StyledContent>
        <Footer />
      </StyledApp>
    </BrowserRouter>
  );
};

export default App;
