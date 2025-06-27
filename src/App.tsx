import { useLocation, useRoutes } from 'react-router-dom';
import routes from './routes/routes';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import AIAssistant from './components/house/AIAssistant';

export default function App() {

  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (i18n.language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [i18n.language]);

  const routing = useRoutes(routes);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* {!location.pathname.includes('login') ? <Header /> : <></>} */}
      <main>{routing}</main>
      {location.pathname.includes('login') ? <></> : <AIAssistant />}
    </div>
  );
}
