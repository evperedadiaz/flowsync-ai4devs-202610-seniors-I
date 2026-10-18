import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { ApiError } from '@/shared/lib/api-client'

import { getProfile } from '../api/getProfile'
import { AuthContext } from '../auth-context'
import type { AuthContextValue } from '../auth-context'
import { clearToken, readToken, saveToken } from '../session-storage'
import type { User } from '../types'

type AuthProviderProps = { children: ReactNode }

type AuthState = Pick<AuthContextValue, 'status' | 'user'>

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(() => ({
    status: readToken() ? 'loading' : 'anonymous',
    user: null,
  }))

  // Restaura la sesión tras recargar comprobando el token guardado.
  useEffect(() => {
    const token = readToken()
    if (!token) return

    let cancelled = false
    getProfile(token)
      .then((user) => {
        if (!cancelled) setState({ status: 'authenticated', user })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        // Solo un 401 invalida el token; un fallo de red no cierra la sesión.
        if (error instanceof ApiError && error.status === 401) clearToken()
        setState({ status: 'anonymous', user: null })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const signIn = useCallback((token: string, user: User) => {
    saveToken(token)
    setState({ status: 'authenticated', user })
  }, [])

  const value = useMemo(() => ({ ...state, signIn }), [state, signIn])

  return <AuthContext value={value}>{children}</AuthContext>
}
