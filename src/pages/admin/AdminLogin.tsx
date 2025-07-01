import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const AdminLoginPage = () => {
    const { t } = useTranslation();
    const { login, isPending, error } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login({ username, password }, 'admin');
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left side image */}
            <div className="hidden md:block md:w-1/2 h-screen">
                <img
                    src="/admin-login-photo.jpg"
                    alt="Admin Illustration"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Form Section */}
            <div className="flex flex-col justify-center items-center md:w-1/2 w-full px-6 z-10 bg-transparent md:bg-white">

                {/* Mobile background image */}
                <div className="md:hidden absolute inset-0 -z-10">
                    <img
                        src="/admin-login-photo.jpg"
                        alt="Admin Background"
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="z-10 bg-white/80 md:bg-white rounded-lg shadow-md p-8 w-full max-w-md space-y-6 backdrop-blur-md"
                >
                    <h1 className="text-2xl font-bold text-center text-blue-700">{t('admin_login') || 'Admin Login'}</h1>

                    {error && (
                        <div className="text-red-600 text-sm text-center">
                            {t(error)}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('username')}</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:opacity-50"
                    >
                        {isPending ? t('logging_in') || 'Logging in...' : t('login') || 'Login'}
                    </button>

                    <div className='pt-8 flex justify-center'>
                        <LanguageSwitcher />
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
