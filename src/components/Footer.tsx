import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-blue-50 border-t-4 border-blue-300 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-gray-700">

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-blue-700 mb-3">{t('quick_links')}</h3>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link to="/" className="hover:text-blue-600 transition">
                {t('home')}
              </Link>
            </li>
            <li>
              <Link to="/statistics" className="hover:text-blue-600 transition">
                {t('statistics')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Branding / Motto */}
        <div className="flex flex-col items-center justify-center text-center md:text-left">
          <p className="text-blue-800 font-bold text-lg">Finitx</p>
          <p className="text-green-600 text-sm mt-1">{t('empowering_real_estate_tech')}</p>
        </div>

        {/* Powered By */}
        <div className="flex items-center justify-center md:justify-end text-blue-600 text-sm font-semibold">
          <div dir='ltr'>
            <span>Powered by</span>
            <span className="text-green-600 font-bold ml-1 hover:underline cursor-pointer">
              <Link to='https://www.finitx.com/'> Finitx </Link>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
