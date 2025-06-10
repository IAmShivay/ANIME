'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSettings, setLoading, setError, restoreCurrency } from '@/store/slices/settingsSlice'

export function SettingsInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        dispatch(setLoading(true))
        
        const response = await fetch('/api/settings')
        const data = await response.json()
        
        if (data.success) {
          dispatch(setSettings(data.data))
          dispatch(restoreCurrency())
        } else {
          dispatch(setError('Failed to load settings'))
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
        dispatch(setError('Failed to load settings'))
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchSettings()
  }, [dispatch])

  return null // This component doesn't render anything
}
