import '@/styles/globals.css'
import '@/styles/components.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { Inter } from 'next/font/google'
import React from 'react'
import AppShell from '@/components/layout/AppShell';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect('/api/auth/login');
  }
  return (
    <html lang="en">
      <body className={inter.className + ' bg-fitness-gradient min-h-screen'}>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
