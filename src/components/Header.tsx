// src/components/Header.tsx
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Realtor Platform</h1>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;
