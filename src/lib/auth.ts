import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: string
  email: string
  role: 'user' | 'admin'
  iat: number
  exp: number
}

export async function verifyToken(request: NextRequest): Promise<TokenPayload | null> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export function generateToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function isAdmin(user: TokenPayload): boolean {
  return user.role === 'admin'
}

export async function requireAuth(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request)
  if (!isAdmin(user)) {
    throw new Error('Admin access required')
  }
  return user
}
