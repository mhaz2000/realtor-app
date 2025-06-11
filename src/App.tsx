import Header from './components/Header';
import { useRoutes } from 'react-router-dom';
import routes from './routes/routes';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function App() {

const { i18n } = useTranslation();

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
      <Header />
      <main className="p-4">{routing}</main>
    </div>
  );
}
