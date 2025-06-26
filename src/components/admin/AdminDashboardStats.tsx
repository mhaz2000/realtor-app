// src/components/admin/AdminDashboardStats.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardAdminData } from '../../types/dashboard';
import { getAdminDashboardData } from '../../api/dashboard';
import StatCard from '../StatCard';

const AdminDashboardStats = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardAdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardData()
      .then(setStats)
      .catch((err) => console.error('Failed to fetch admin stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center py-20 text-lg">{t('loading') || 'Loading...'}</p>;
  }

  if (!stats) {
    return <p className="text-center py-20 text-red-500">{t('data_not_found') || 'Data not found.'}</p>;
  }

  const { total_projects, total_units, avg_price } = stats.dashboard_stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <StatCard title={t('total_projects')} value={total_projects} color="blue" />
      <StatCard title={t('total_units')} value={total_units} color="green" />
      <StatCard title={t('avg_price')} value={`${avg_price.toLocaleString()} AED`} color="purple" />
    </div>
  );
};

export default AdminDashboardStats;
