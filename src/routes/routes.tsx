import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound'; // optional
import HouseDetailPage from '../pages/HouseDetailPage';

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
      }, // this is `/`
    ],
  },
  {
    path: '*',
    element: <NotFound />, // optional
  },
];

export default routes;
