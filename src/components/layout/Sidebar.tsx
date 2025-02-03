// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Dumbbell,
  Home,
  Utensils,
  Activity,
  User,
  Settings,
  BarChart2,
} from 'lucide-react';


const navigationItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { href: '/progress', icon: BarChart2, label: 'Progress' },
  { href: '/activities', icon: Activity, label: 'Activities' },
];

const userItems = [
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 w-16 h-full border-r bg-background flex flex-col py-6">
      <div className="flex flex-col flex-1 gap-6">
        <div className="px-2">
          <Link href="/dashboard">
            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
              <Dumbbell className="w-6 h-6" />
            </div>
          </Link>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-lg transition-colors hover:bg-muted",
                  isActive && "bg-primary/10 text-primary"
                )}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>

        <div className="px-2 flex flex-col gap-2">
          {userItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-lg transition-colors hover:bg-muted",
                  isActive && "bg-primary/10 text-primary"
                )}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
