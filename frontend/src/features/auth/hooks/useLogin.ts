import { useState } from 'react'

import { ApiError } from '@/shared/lib/api-client'

import { login } from '../api/login'
import type { LoginValues } from '../schemas'
import { useSession } from './useSession'

const INVALID_CREDENTIALS_MESSAGE = 'El email o la contraseña no son correctos'
const GENERIC_ERROR_MESSAGE =
  'No se ha podido iniciar sesión. Inténtalo de nuevo más tarde'
const NETWORK_ERROR_MESSAGE =
  'No se pudo conectar con el servidor. Revisa tu conexión'

export function useLogin() {
  const { signIn } = useSession()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(values: LoginValues) {
    if (isPending) return false
    setIsPending(true)
    setError(null)
    try {
      const { token, user } = await login(values)
      signIn(token, user)
      return true
    } catch (e) {
      setError(messageFor(e))
      setIsPending(false)
      return false
    }
  }

  return { submit, isPending, error }
}

function messageFor(error: unknown) {
  if (!(error instanceof ApiError)) return GENERIC_ERROR_MESSAGE
  if (error.status === 0) return NETWORK_ERROR_MESSAGE
  // 400/401/422: nunca se revela si falló el email o la contraseña.
  if ([400, 401, 422].includes(error.status)) {
    return INVALID_CREDENTIALS_MESSAGE
  }
  return GENERIC_ERROR_MESSAGE
}
