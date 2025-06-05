import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import { Cart } from '@/components/Cart'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AnimeScience - Premium Anime Clothing & Collectibles',
  description: 'Discover premium anime clothing, collectibles, and accessories. Your premier destination for anime and science-themed merchandise.',
  keywords: 'anime clothing, anime merchandise, collectibles, anime fashion, science themed',
  authors: [{ name: 'AnimeScience Team' }],
  creator: 'AnimeScience',
  publisher: 'AnimeScience',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://animescience.com',
    title: 'AnimeScience - Premium Anime Clothing & Collectibles',
    description: 'Discover premium anime clothing, collectibles, and accessories.',
    siteName: 'AnimeScience',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnimeScience - Premium Anime Clothing & Collectibles',
    description: 'Discover premium anime clothing, collectibles, and accessories.',
    creator: '@animescience',
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
          <Cart />
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
