import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importing translation files
import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import ptTranslation from './locales/pt/translation.json';
import zhTranslation from './locales/zh/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    hi: { translation: hiTranslation },
    es: { translation: esTranslation },
    fr: { translation: frTranslation },
    pt: { translation: ptTranslation },
    zh: { translation: zhTranslation },
  },
  lng: localStorage.getItem('selectedLanguage') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
