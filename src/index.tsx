import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider as MUIThemeProvider } from '@material-ui/styles';
import mainTheme from './themes/mainTheme';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { interceptRequestsOnMock } from './api/mock-interceptor';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { USE_MOCK_DATA } from './utils/constants';
// import i18n (needs to be bundled ;))
import './translations/i18n';
import LogRocket from 'logrocket';

LogRocket.init('8rv8br/dlr');

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

Sentry.init({
  dsn: 'https://83dde54f791f42f29c351d3278cd3087@o644956.ingest.sentry.io/5758486',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <StylesProvider injectFirst>
      <ThemeProvider theme={mainTheme}>
        <MUIThemeProvider theme={mainTheme}>
          <CssBaseline />
          <App />
        </MUIThemeProvider>
      </ThemeProvider>
    </StylesProvider>
  </Provider>,
  //</React.StrictMode>,
  document.getElementById('root')
);
