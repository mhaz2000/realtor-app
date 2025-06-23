import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound'; // optional
import HouseDetailPage from '../pages/HouseDetailPage';
import Dashboard from '../pages/Dashboard';

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
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
