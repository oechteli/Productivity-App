import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/auth-provider'
import { AuthLayout } from '@/components/layout/auth-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FocusFlow - Die letzte Produktivitäts-App, die du jemals brauchen wirst',
  description: 'Eine moderne, intuitive To-Do App für Overwhelmed Professionals, die Einfachheit ohne Funktionsverlust wollen.',
  keywords: ['todo', 'productivity', 'focus', 'task management', 'organize'],
  authors: [{ name: 'FocusFlow Team' }],
  creator: 'FocusFlow Team',
  publisher: 'FocusFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://focusflow.app'),
  openGraph: {
    title: 'FocusFlow - Die letzte Produktivitäts-App',
    description: 'Eine moderne, intuitive To-Do App für Overwhelmed Professionals',
    url: 'https://focusflow.app',
    siteName: 'FocusFlow',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FocusFlow - Produktivitäts-App',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FocusFlow - Die letzte Produktivitäts-App',
    description: 'Eine moderne, intuitive To-Do App für Overwhelmed Professionals',
    images: ['/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F80FF" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <AuthLayout>
              {children}
            </AuthLayout>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 