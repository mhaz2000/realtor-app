import { Navigate, Outlet } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <>
      <AdminHeader />
      <Outlet />
    </>
  );
};

export default ProtectedAdminRoute;
