// src/components/Header.tsx
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className='flex justify-between items-center gap-5'>
        <Link to="/">
          <h1 className="text-xl font-bold text-blue-600">Realtor Platform</h1>
        </Link>

        <Link to="/statistics"><h6>Statistics</h6></Link>
      </div>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;
