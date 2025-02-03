// src/app/page.tsx
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 transition-colors duration-300">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b dark:bg-slate-950/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg animate-pulse"></div>
            <div className="absolute inset-0.5 bg-white dark:bg-slate-950 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                LK
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl opacity-20 animate-pulse"></div>
            <h1 className="relative text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              LK Fitness
            </h1>
          </div>

          <p className="text-xl text-muted-foreground">
            Transform Your Life with Smart Fitness Tracking
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="p-6 rounded-2xl bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">Track Progress</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Monitor your fitness journey with detailed analytics
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">Set Goals</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Create and achieve your fitness goals step by step
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">Get Insights</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Understand your fitness data with smart analysis
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LK Fitness. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}