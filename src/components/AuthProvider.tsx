'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials, setLoading } from '@/store/slices/authSlice'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setLoading(true))
      
      try {
        // Check for stored token
        const token = localStorage.getItem('token')
        
        if (token) {
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              dispatch(setCredentials({
                user: data.data.user,
                token: token
              }))
            } else {
              // Invalid token, remove it
              localStorage.removeItem('token')
            }
          } else {
            // Token verification failed
            localStorage.removeItem('token')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('token')
      } finally {
        dispatch(setLoading(false))
      }
    }

    initializeAuth()
  }, [dispatch])

  return <>{children}</>
}
