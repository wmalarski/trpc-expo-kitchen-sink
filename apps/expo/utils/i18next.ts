import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';

const supportedLngs = ['en'];

i18n.use(initReactI18next).init({
  resources: { en },
  fallbackLng: 'en',
  supportedLngs,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
