import { use } from 'react'

import { AuthContext } from '../auth-context'

export function useSession() {
  const context = use(AuthContext)
  if (!context) throw new Error('useSession requiere un AuthProvider')
  return context
}
