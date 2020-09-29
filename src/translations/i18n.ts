import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { LanguageCodes } from '../types/language.types';
import translationsEn from './translations_EN.json';
import translationsNb from './translations_NO.json';

export const fallbackLanguage = LanguageCodes.NORWEGIAN_BOKMAL;

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translations: translationsEn,
    },
    nob: {
      translations: translationsNb,
    },
  },
  fallbackLng: fallbackLanguage,
  debug: false,
  ns: ['translations'],
  defaultNS: 'translations',
  interpolation: {
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
});

// Seems like i18next require 4-letter languages for pluralization to work out of box, so we must add our own rules
// https://github.com/i18next/i18next/issues/1061#issuecomment-395528467
i18n.services.pluralResolver.addRule('nob', {
  numbers: [1, 2],
  plurals: (n: number) => Number(n !== 1),
});
i18n.services.pluralResolver.addRule('eng', {
  numbers: [1, 2],
  plurals: (n: number) => Number(n !== 1),
});

export default i18n;
