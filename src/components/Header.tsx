import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useRef, useState } from 'react';
import { Settings, LogOut, Languages } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isRtl = i18n.dir() === 'rtl';

  const handleLogout = () => {
    logout('user'); 
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-5">
        <Link to="/">
          <h1 className="text-xl font-bold text-blue-600">Realtor Platform</h1>
        </Link>
        <Link to="/statistics" className="text-gray-700 hover:text-blue-600 font-medium">
          {t('statistics')}
        </Link>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
        >
          <Settings className="w-5 h-5" />
        </button>

        {menuOpen && (
          <div
            className={`absolute mt-2 w-48 bg-white border rounded-lg shadow-md z-50 ${
              isRtl ? 'left-0' : 'right-0'
            }`}
          >
            <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition cursor-pointer">
              <Languages className="w-4 h-4 text-gray-500" />
              <LanguageSwitcher />
            </div>
            <div
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer transition rounded-b-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout') || 'Sign out securely'}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;