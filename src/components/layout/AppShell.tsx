"use client";
import { Header } from './Header';
import VoiceAssistant from '../voice/VoiceAssistant';
import React from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-fitness-bg dark:bg-fitness-bg-dark text-fitness-dark dark:text-fitness-light">
      <Header />
      <main className="pt-16 min-h-screen section-bg">
        <div className="w-full py-4 px-6 mb-4 rounded-xl card flex items-center justify-between">
          <span className="section-header">Transform Your Fitness Journey</span>
          <span className="section-subheader hidden md:block">Stay motivated. Stay strong. 💪</span>
        </div>
        {children}
      </main>
      <VoiceAssistant />
    </div>
  );
} 