import { API_URL } from '@/shared/lib/env'

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>

  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string | null
}

type ErrorBody = {
  message?: string
  errors?: { field?: string; message?: string }[]
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor')
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as ErrorBody
    const fieldErrors: Record<string, string> = {}
    for (const error of data.errors ?? []) {
      if (error.field && error.message && !(error.field in fieldErrors)) {
        fieldErrors[error.field] = error.message
      }
    }
    throw new ApiError(
      response.status,
      data.message ?? 'Ha ocurrido un error inesperado',
      fieldErrors,
    )
  }

  // El backend envuelve las respuestas correctas en `{ data }`.
  const payload = (await response.json()) as { data: T }
  return payload.data
}
