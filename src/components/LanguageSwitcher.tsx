import type React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: 'en' | 'ar', e: React.FormEvent) => {
    e.preventDefault();

    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="space-x-4 rtl:space-x-reverse">
      <button
        onClick={(e) => changeLanguage('en', e)}
        className={`text-sm ${i18n.language === 'en' ? 'font-bold text-blue-600' : 'text-gray-600'}`}
      >
        EN
      </button>
      <button
        onClick={(e) => changeLanguage('ar', e)}
        className={`text-sm ${i18n.language === 'ar' ? 'font-bold text-blue-600' : 'text-gray-600'}`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
