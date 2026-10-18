import { createBrowserRouter } from 'react-router'

import { LoginPage, RequireAuth } from '@/features/auth'

import { HomePage } from './pages/HomePage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [{ path: '/', element: <HomePage /> }],
  },
])
