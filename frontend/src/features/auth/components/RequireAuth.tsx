import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router'

import { useSession } from '@/features/auth'

export function RequireAuth() {
  const { status } = useSession()

  if (status === 'loading') {
    return (
      <div
        role="status"
        aria-label="Cargando sesión"
        className="flex min-h-svh items-center justify-center"
      >
        <Loader2 className="animate-spin text-muted-foreground" aria-hidden />
      </div>
    )
  }
  if (status === 'anonymous') return <Navigate to="/login" replace />

  return <Outlet />
}
