'use client'

import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/store'
import { AuthInitializer } from '@/components/AuthInitializer'
import { SettingsInitializer } from '@/components/SettingsInitializer'
import { Session } from 'next-auth'

interface ProvidersProps {
  children: React.ReactNode
  session?: Session | null
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthInitializer />
          <SettingsInitializer />
          {children}
        </PersistGate>
      </Provider>
    </SessionProvider>
  )
}
