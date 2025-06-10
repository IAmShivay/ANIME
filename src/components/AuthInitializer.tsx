'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { restoreCredentials } from '@/store/slices/authSlice'

export function AuthInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Restore auth state from localStorage on app initialization
    dispatch(restoreCredentials())
  }, [dispatch])

  return null // This component doesn't render anything
}
