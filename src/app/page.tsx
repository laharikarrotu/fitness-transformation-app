// src/app/page.tsx
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import Link from 'next/link';

// Example SVG fitness illustration (can be replaced with a custom one)
const FitnessHeroSVG = () => (
  <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="160" cy="180" rx="120" ry="20" fill="#22c55e" fillOpacity="0.15" />
    <rect x="120" y="60" width="80" height="80" rx="40" fill="#2563eb" />
    <rect x="140" y="80" width="40" height="60" rx="20" fill="#f97316" />
    <circle cx="160" cy="70" r="18" fill="#22c55e" />
    <rect x="150" y="120" width="20" height="40" rx="10" fill="#2563eb" />
  </svg>
);

const FitnessBackgroundSVG = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#22c55e" fillOpacity="0.08" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
    <circle cx="1200" cy="80" r="60" fill="#2563eb" fillOpacity="0.12" />
    <circle cx="200" cy="220" r="80" fill="#f97316" fillOpacity="0.10" />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-fitness-gradient flex flex-col relative overflow-hidden">
      <FitnessBackgroundSVG />
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-fitness-dark/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-fitness-green tracking-tight">FitVibe</span>
            <span className="ml-2 px-2 py-1 rounded bg-fitness-orange/20 text-fitness-orange text-xs font-semibold">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a href="/api/auth/login">
              <Button size="sm" className="bg-fitness-blue hover:bg-fitness-green text-white font-bold shadow-fitness px-6 py-2 animate-bounce">
                Login
              </Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col justify-center items-center pt-32 pb-16 relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl w-full mx-auto text-center space-y-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex-1 flex flex-col items-center md:items-start">
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-fitness-green to-fitness-blue bg-clip-text text-transparent mb-4 drop-shadow-lg animate-fade-in">
                Transform Your Fitness Journey
              </h1>
              <p className="text-xl md:text-2xl text-fitness-dark dark:text-fitness-light font-medium mb-6 animate-fade-in delay-100">
                Smart tracking, real results. Join a vibrant community and unlock your best self.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in delay-200">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-fitness-green hover:bg-fitness-blue text-white shadow-fitness px-8 py-3 text-lg font-bold">
                    Start Your Journey
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="border-fitness-green text-fitness-green px-8 py-3 text-lg font-bold">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center animate-fade-in delay-300">
              <FitnessHeroSVG />
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="max-w-5xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/90 dark:bg-fitness-dark/80 shadow-fitness flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-fitness-green/10 flex items-center justify-center mb-4">
              <span className="text-3xl">🏋️‍♂️</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-fitness-green">Track Workouts</h3>
            <p className="text-base text-fitness-dark dark:text-fitness-light text-center">Log your exercises, monitor progress, and stay motivated with detailed analytics.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white/90 dark:bg-fitness-dark/80 shadow-fitness flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-fitness-blue/10 flex items-center justify-center mb-4">
              <span className="text-3xl">🥗</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-fitness-blue">Nutrition Plans</h3>
            <p className="text-base text-fitness-dark dark:text-fitness-light text-center">Personalized meal plans and nutrition tracking for your goals.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white/90 dark:bg-fitness-dark/80 shadow-fitness flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-fitness-orange/10 flex items-center justify-center mb-4">
              <span className="text-3xl">📈</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-fitness-orange">Progress Photos</h3>
            <p className="text-base text-fitness-dark dark:text-fitness-light text-center">Visualize your transformation and celebrate milestones.</p>
          </div>
        </div>

        {/* Community & Motivation */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-fitness-green to-fitness-blue bg-clip-text text-transparent">
            Join a Community That Moves You
          </h2>
          <p className="text-lg text-fitness-dark dark:text-fitness-light mb-8">
            Connect with fellow fitness enthusiasts, share your journey, and get inspired by real success stories.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <div className="flex-1 bg-white/80 dark:bg-fitness-dark/70 rounded-xl p-6 shadow-fitness">
              <p className="text-fitness-green font-bold text-lg mb-2">“I never thought I’d love working out. FitVibe made it fun and easy to track my progress!”</p>
              <span className="text-fitness-dark dark:text-fitness-light font-medium">— Jamie, lost 20 lbs</span>
            </div>
            <div className="flex-1 bg-white/80 dark:bg-fitness-dark/70 rounded-xl p-6 shadow-fitness">
              <p className="text-fitness-blue font-bold text-lg mb-2">“The nutrition plans are a game changer. I feel healthier and more energetic every day.”</p>
              <span className="text-fitness-dark dark:text-fitness-light font-medium">— Alex, marathon runner</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white/80 dark:bg-fitness-dark/90 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-fitness-dark dark:text-fitness-light">
            © {new Date().getFullYear()} FitVibe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}