import './globals.css'
import './components.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import VoiceAssistant from '@/components/voice/VoiceAssistant'

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   
      <html lang="en">
        <body className={inter.className}>
        <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
          <div className="min-h-screen bg-background">
            <Sidebar />
            <Header />
            <main className="pl-16 pt-16 min-h-screen">
              {children}
            </main>
            <VoiceAssistant />
          </div>
          </ThemeProvider>
        </body>
      </html>
    
  );
}
