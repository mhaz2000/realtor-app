import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound'; // optional
import HouseDetailPage from '../pages/HouseDetailPage';
import Dashboard from '../pages/Dashboard';
import AdminLoginPage from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import UploadExcelPage from '../pages/admin/UploadExcelPage';

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedAdminRoute />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'excel-upload', element: <UploadExcelPage /> }
    ]
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'house/:unitCode', // <-- relative to `/`
        element: <HouseDetailPage />,
      },
      {
        path: 'statistics',
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />, // optional
  },
];

export default routes;
