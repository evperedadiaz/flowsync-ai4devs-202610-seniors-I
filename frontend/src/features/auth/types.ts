export type User = {
  id: number
  fullName: string | null
  email: string
  initials: string
}

export type LoginResponse = {
  user: User
  token: string
}
