// src/pages/admin/DashboardAdmin.tsx

import AdminDashboardStats from '../../components/admin/AdminDashboardStats';
import AdminLocationSearch from '../../components/admin/AdminLocationSearch';

const DashboardAdmin = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <AdminDashboardStats />

      <br />
      
      <AdminLocationSearch />
    </div>
  );
};

export default DashboardAdmin;
