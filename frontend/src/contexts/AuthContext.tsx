import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { login } from '@/lib/auth'

type User = {
  email: string
  name: string
  fullName: string
  avatar: string
  isVerified: boolean
  accountStatus: string
  monetizationStatus: string
  watchHistory: Array<any>
  refreshToken: string
  createdAt: Date
  updatedAt: Date
}

interface Error {
  type: string
  error: string
  ErrorCode: string
  errorMessage: string
}
const authContext = createContext({
  loading: false,
  login: async (_: { identifier: string; password: string }) => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()

  const loginUser = async ({
    identifier,
    password,
  }: {
    identifier: string
    password: string
  }) => {
    setIsLoading(true)
    try {
      const { data } = await login({ identifier, password })
      console.log(data)
      setUser(data.user as User)
    } catch (err) {
      console.log('error')
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <authContext.Provider value={{ loading: isLoading, login: loginUser }}>
      {children}
    </authContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(authContext)
  return context
}
