import i18next from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

const backendOptions = {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
};

const i18nextOptions = {
  backend: backendOptions,
  debug: process.env.NODE_ENV !== 'production',
  ns: ['labels', 'info', 'errors'],
  lng: 'en',
  whitelist: ['en', 'ru'],
  fallbackLng: false,
  defaultNS: 'labels',
};

i18next
  .use(Backend)
  .use(initReactI18next)
  .init(i18nextOptions);
