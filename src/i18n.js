import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './translations/en';
import es from './translations/es';
import fr from './translations/fr';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      checkWhitelist: true
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n; 