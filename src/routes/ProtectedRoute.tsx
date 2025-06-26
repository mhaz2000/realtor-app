import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/Header';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />

      <Outlet />
    </>
  );
};

export default ProtectedRoute;
