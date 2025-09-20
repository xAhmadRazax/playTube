import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { axios } from '@/utils/axios.util'

type Settings = {
  siteName: string
  siteLogo: string
  siteLogoSVG: string
}

type SettingsContextType = {
  settings: Settings | undefined
  isLoading: boolean
  error: Error | null
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery<Settings>({
    // Type goes here as generic
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('admin-settings/get-public-settings')
        return data.data
      } catch (err) {
        console.log(err)
        throw new Error('Failed to fetch settings')
      }
    },
    staleTime: 60 * 60 * 1000,
    retry: 1, // Only retry once instead of 3 times
    retryDelay: 1000,
  })

  if (error) {
    return (
      <div className="bg-gray-900 text-red-400 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl mb-4">Something went wrong</h1>
        <p className="mb-4">Please try again later</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <SettingsContext.Provider value={{ settings, isLoading, error }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
