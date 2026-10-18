import { apiRequest } from '@/shared/lib/api-client'

import type { User } from '../types'

export function getProfile(token: string) {
  return apiRequest<User>('/account/profile', { token })
}
