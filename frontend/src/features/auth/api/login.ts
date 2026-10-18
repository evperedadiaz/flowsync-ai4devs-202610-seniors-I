import { apiRequest } from '@/shared/lib/api-client'

import type { LoginResponse } from '../types'
import type { LoginValues } from '../schemas'

export function login(values: LoginValues) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: values,
  })
}
