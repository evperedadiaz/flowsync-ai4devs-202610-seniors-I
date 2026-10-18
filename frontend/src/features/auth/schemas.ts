import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Introduce tu email')
    .email('Introduce un email válido'),
  password: z.string().min(1, 'Introduce tu contraseña'),
})

export type LoginValues = z.infer<typeof loginSchema>
