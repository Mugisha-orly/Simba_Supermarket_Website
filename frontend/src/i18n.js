import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationRW from './locales/rw/translation.json';
import translationSW from './locales/sw/translation.json';

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  rw: { translation: translationRW },
  sw: { translation: translationSW }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
