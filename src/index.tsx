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
