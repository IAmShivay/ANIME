import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import '@/styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}