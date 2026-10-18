import { Navigate } from 'react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

import { LoginForm } from '../components/LoginForm'
import { useSession } from '@/features/auth'

export function LoginPage() {
  const { status } = useSession()
  if (status === 'authenticated') return <Navigate to="/" replace />

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Accede a tu espacio de trabajo en FlowSync
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
