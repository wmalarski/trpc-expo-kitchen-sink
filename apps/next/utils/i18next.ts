import { resources } from '@tens/common/src/locales';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const supportedLngs = ['en'];

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  supportedLngs,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
