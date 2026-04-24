import type { Metadata } from 'next'
import { IBM_Plex_Mono, Inter, Orbitron } from 'next/font/google'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-accent',
})

export const metadata: Metadata = {
  title: 'GlobeNews Live | Real-Time Global Intelligence',
  description: 'Real-time conflict monitoring, military activity tracking, and geopolitical intelligence. Iran war coverage, flight radar, ship tracking, and 54+ news sources.',
  keywords: 'OSINT, intelligence, conflict, military, geopolitical, Iran, Israel, war, real-time, news, global',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'GlobeNews Live',
    description: 'Real-time global conflict intelligence dashboard - Iran war coverage, flight radar, ship tracking',
    type: 'website',
    url: 'https://globenews.live',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlobeNews Live',
    description: 'Real-time global intelligence dashboard',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} ${inter.variable} ${orbitron.variable} bg-void text-text-primary min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
