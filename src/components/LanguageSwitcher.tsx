import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: 'en' | 'ar') => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="space-x-4 rtl:space-x-reverse">
      <button
        onClick={() => changeLanguage('en')}
        className={`text-sm ${i18n.language === 'en' ? 'font-bold text-blue-600' : 'text-gray-600'}`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`text-sm ${i18n.language === 'ar' ? 'font-bold text-blue-600' : 'text-gray-600'}`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
