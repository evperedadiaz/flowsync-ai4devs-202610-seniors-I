import { useSession } from '@/features/auth'

export function HomePage() {
  const { user } = useSession()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">FlowSync</h1>
      <p className="text-muted-foreground">
        Hola, {user?.fullName ?? user?.email}
      </p>
    </main>
  )
}
