import { createBrowserRouter } from 'react-router-dom';
import StoreFront from '../pages/StoreFront';
import AdminPanel from '../pages/AdminPanel';
import AdminLogin from '../pages/AdminLogin';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StoreFront />
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <ProtectedRoute><AdminPanel /></ProtectedRoute>
  }
]);