import '@/styles/globals.css'
import '@/styles/components.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Auth0Provider } from '@/components/providers/auth0-provider';
import { Inter } from 'next/font/google'
import React from 'react'
import AppShell from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-fitness-gradient min-h-screen'}>
        <Auth0Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
