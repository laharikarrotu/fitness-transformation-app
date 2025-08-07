// src/components/layout/Header.tsx
'use client';

import { useState } from 'react';
import { Bell, Search, LogOut, User, Settings, Dumbbell, Home, Utensils, Activity, BarChart2, Users, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/exercises', label: 'Exercises', icon: List },
  { href: '/nutrition', label: 'Nutrition', icon: Utensils },
  { href: '/progress', label: 'Progress', icon: BarChart2 },
  { href: '/activities', label: 'Activities', icon: Activity },
  { href: '/trainers', label: 'Trainers', icon: Users },
];

export function Header() {
  const [notifications] = useState([
    { id: 1, title: 'Workout Reminder', message: 'Time for your daily workout!' },
    { id: 2, title: 'Goal Achieved', message: 'You reached your weekly goal!' },
  ]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-white/90 dark:bg-fitness-dark/95 backdrop-blur z-30 shadow-fitness">
      <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">
        {/* Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-fitness-green tracking-tight">FitVibe</span>
            <span className="ml-1 px-2 py-1 rounded bg-fitness-orange/20 text-fitness-orange text-xs font-semibold">Beta</span>
          </Link>
          <nav className="hidden md:flex gap-2 lg:gap-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-fitness-dark dark:text-fitness-light hover:bg-fitness-green/10 transition-colors"
              >
                <Icon className="w-5 h-5 mr-1 text-fitness-green" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search anything..."
              className="pl-10 rounded-full bg-white/80 dark:bg-fitness-dark/80"
            />
          </div>
        </div>

        {/* Right Side: Notifications, Theme, User */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id}>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          <Link href="/api/auth/login" className="ml-2">
            <Button variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </div>
      {/* Mobile nav links */}
      <nav className="flex md:hidden gap-2 px-4 pb-2 pt-1 bg-white/90 dark:bg-fitness-dark/95 border-b border-t">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-0.5 py-1 rounded-lg font-semibold text-fitness-dark dark:text-fitness-light hover:bg-fitness-green/10 transition-colors text-xs"
          >
            <Icon className="w-5 h-5 text-fitness-green" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
