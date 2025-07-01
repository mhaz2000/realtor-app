// src/pages/admin/DashboardAdmin.tsx

import { useTranslation } from 'react-i18next';
import AdminDashboardStats from '../../components/admin/AdminDashboardStats';
import AdminLocationSearch from '../../components/admin/AdminLocationSearch';

const DashboardAdmin = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">{t('admin_dashboard')}</h1>
      <AdminDashboardStats />

      <br />
      
      <AdminLocationSearch />
    </div>
  );
};

export default DashboardAdmin;
