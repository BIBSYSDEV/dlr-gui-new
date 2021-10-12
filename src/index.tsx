import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { StyledEngineProvider, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { StylesProvider, ThemeProvider as MUIThemeProvider } from '@mui/styles';
import mainTheme from './themes/mainTheme';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { interceptRequestsOnMock } from './api/mock-interceptor';
import { USE_MOCK_DATA } from './utils/constants';
// import i18n (needs to be bundled ;))
import './translations/i18n';

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <StylesProvider injectFirst>
      <StyledEngineProvider injectFirst>
        <StyledComponentsThemeProvider theme={mainTheme}>
          <MuiThemeProvider theme={mainTheme}>
            <CssBaseline />
            <App />
          </MuiThemeProvider>
        </StyledComponentsThemeProvider>
      </StyledEngineProvider>
    </StylesProvider>
  </Provider>,
  //</React.StrictMode>,
  document.getElementById('root')
);
