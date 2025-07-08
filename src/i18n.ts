import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import dayjs from 'dayjs';

import 'dayjs/locale/en';
import 'dayjs/locale/az';

import en from './locales/en.json';
import az from './locales/az.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      resources: {
        en: { translation: en },
        az: { translation: az },
      },
      fallbackLng: 'az',
      interpolation: {
        escapeValue: false,
      },
    },
    () => {
      dayjs.locale(i18n.language);
    }
  );

i18n.on('languageChanged', (lng) => {
  dayjs.locale(lng);
});

export default i18n;
