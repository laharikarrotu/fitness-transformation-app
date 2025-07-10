"use client";
import { Header } from './Header';
import VoiceAssistant from '../voice/VoiceAssistant';
import React from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main className="pt-16 min-h-screen">
        <div className="w-full py-4 px-6 mb-4 rounded-xl bg-white/80 shadow-fitness flex items-center justify-between">
          <span className="text-2xl font-bold text-fitness-green">Transform Your Fitness Journey</span>
          <span className="text-fitness-blue font-semibold hidden md:block">Stay motivated. Stay strong. 💪</span>
        </div>
        {children}
      </main>
      <VoiceAssistant />
    </div>
  );
} 