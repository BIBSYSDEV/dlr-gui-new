import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { StyledEngineProvider, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import mainTheme from './themes/mainTheme';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { interceptRequestsOnMock } from './api/mock-interceptor';
import { USE_MOCK_DATA } from './utils/constants';
import './translations/i18n';

// Fonts
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/crimson-text/400.css';

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

ReactDOM.render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <StyledComponentsThemeProvider theme={mainTheme}>
        <MuiThemeProvider theme={mainTheme}>
          <CssBaseline />
          <App />
        </MuiThemeProvider>
      </StyledComponentsThemeProvider>
    </StyledEngineProvider>
  </Provider>,
  document.getElementById('root')
);
