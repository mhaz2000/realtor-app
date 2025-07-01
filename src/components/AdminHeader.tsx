import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { Settings, LogOut, Languages, Upload } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const AdminHeader = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isRtl = i18n.dir() === 'rtl';

  const handleLogout = () => logout('admin');

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
    <header className="bg-white shadow-sm border-b border-blue-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between relative">

        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/admin/dashboard">
            <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight hover:text-green-600 transition">
              Realtor Platform
            </h1>
          </Link>
        </div>

        {/* Center: Upload Excel Template */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link
            to="/admin/excel-upload"
            className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-md font-semibold text-sm hover:bg-blue-100 hover:text-green-600 transition"
          >
            <Upload className="w-4 h-4" />
            {t('upload_excel_template') || 'Upload Excel'}
          </Link>
        </div>

        {/* Right: Settings Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
            title={t('settings')}
          >
            <Settings className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div
              className={`absolute mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 ${
                isRtl ? 'left-0' : 'right-0'
              }`}
            >
              {/* Language Switcher */}
              <div className="flex items-center gap-2 px-4 py-3 hover:bg-blue-50 transition cursor-pointer rounded-t-xl">
                <Languages className="w-4 h-4 text-gray-500" />
                <LanguageSwitcher />
              </div>

              {/* Logout */}
              <div
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer transition rounded-b-xl"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {t('logout') || 'Sign out'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
