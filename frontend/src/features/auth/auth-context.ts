import { createContext } from 'react'

import type { User } from './types'

export type AuthContextValue = {
  status: 'loading' | 'authenticated' | 'anonymous'
  user: User | null
  signIn: (token: string, user: User) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
