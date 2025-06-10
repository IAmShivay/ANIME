import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import { CartSidebar } from '@/components/CartSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bindass - Premium Anime Fashion & Streetwear',
  description: 'Discover premium anime-inspired fashion, streetwear, and accessories. Where anime culture meets contemporary style.',
  keywords: 'anime fashion, streetwear, anime clothing, bindass, anime merchandise, anime streetwear',
  authors: [{ name: 'Bindass Team' }],
  creator: 'Bindass',
  publisher: 'Bindass',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bindass.com',
    title: 'Bindass - Premium Anime Fashion & Streetwear',
    description: 'Discover premium anime-inspired fashion, streetwear, and accessories.',
    siteName: 'Bindass',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bindass - Premium Anime Fashion & Streetwear',
    description: 'Discover premium anime-inspired fashion, streetwear, and accessories.',
    creator: '@bindass',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <CartSidebar />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
