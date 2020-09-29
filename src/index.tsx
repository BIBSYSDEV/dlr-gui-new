import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import i18n from './translations/i18n';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider as MUIThemeProvider } from '@material-ui/styles';
import mainTheme from './themes/mainTheme';

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={mainTheme}>
          <MUIThemeProvider theme={mainTheme}>
            <CssBaseline />
            <App />
          </MUIThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
