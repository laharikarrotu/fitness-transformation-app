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
  Users,
} from 'lucide-react';

const navigationItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { href: '/nutrition', icon: Utensils, label: 'Nutrition' },
  { href: '/progress', icon: BarChart2, label: 'Progress' },
  { href: '/activities', icon: Activity, label: 'Activities' },
  { href: '/trainers', icon: Users, label: 'Trainers' },
];

const userItems = [
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 w-20 h-full border-r bg-fitness-dark flex flex-col py-6 shadow-fitness z-30">
      <div className="flex flex-col flex-1 gap-6 items-center">
        {/* Fitness Logo/Icon */}
        <div className="mb-4">
          <div className="w-14 h-14 flex items-center justify-center bg-fitness-green/90 text-white rounded-2xl shadow-fitness">
            <Dumbbell className="w-8 h-8" />
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-2 items-center">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-14 h-14 flex items-center justify-center rounded-2xl transition-colors hover:bg-fitness-green/20 hover:text-fitness-green text-white",
                  isActive && "bg-fitness-green/90 text-white shadow-fitness"
                )}
                title={item.label}
              >
                <Icon className="w-6 h-6" />
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-2 items-center mt-4">
          {userItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-14 h-14 flex items-center justify-center rounded-2xl transition-colors hover:bg-fitness-accent/20 hover:text-fitness-accent text-white",
                  isActive && "bg-fitness-accent/90 text-white shadow-fitness"
                )}
                title={item.label}
              >
                <Icon className="w-6 h-6" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
