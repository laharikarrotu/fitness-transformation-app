// src/components/voice/VoiceAssistant.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { generateResponse } from '@/lib/gemini';

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

const NAV_COMMANDS: { [key: string]: string } = {
  dashboard: '/dashboard',
  workouts: '/workouts',
  nutrition: '/nutrition',
  progress: '/progress',
  activities: '/activities',
  trainers: '/trainers',
  profile: '/profile',
  settings: '/settings',
};

function detectNavigationCommand(command: string): string | null {
  const lower = command.toLowerCase();
  for (const [key, path] of Object.entries(NAV_COMMANDS)) {
    if (
      lower.includes(`go to ${key}`) ||
      lower.includes(`open ${key}`) ||
      lower.includes(`show ${key}`) ||
      lower === key
    ) {
      return path;
    }
  }
  return null;
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  const processCommand = useCallback(async (command: string) => {
    try {
      setIsProcessing(true);
      // Navigation command detection
      const navPath = detectNavigationCommand(command);
      if (navPath) {
        setResponse(`Navigating to ${navPath.replace('/', '')}...`);
        speakResponse(`Navigating to ${navPath.replace('/', '')}`);
        router.push(navPath);
        setIsProcessing(false);
        return;
      }
      // Context for the AI about its role
      const context = `You are a fitness assistant AI. Help the user with:
      1. Exercise recommendations and form guidance
      2. Nutrition advice and meal planning
      3. Workout scheduling and tracking
      4. Progress monitoring and motivation
      5. Health and wellness tips
      Keep responses concise, encouraging, and actionable.`;
      const prompt = `${context}\n\nUser: ${command}\nAssistant:`;
      const aiResponse = await generateResponse(prompt);
      setResponse(aiResponse);
      speakResponse(aiResponse);
    } catch (error) {
      console.error('Error processing command:', error);
      setError('Failed to process command');
    } finally {
      setIsProcessing(false);
    }
  }, [router]);

  const initializeRecognition = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.message}`);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
      if (event.results[current].isFinal) {
        await processCommand(transcriptText);
      }
    };
    recognitionRef.current = recognition;
  }, [processCommand]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      initializeRecognition();
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      setResponse('');
      recognitionRef.current?.start();
    }
  }, [isListening, initializeRecognition]);

  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "default"}
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : isListening ? (
                <MicOff className="w-4 h-4 mr-2" />
              ) : (
                <Mic className="w-4 h-4 mr-2" />
              )}
              {isProcessing ? 'Processing...' : isListening ? 'Stop' : 'Start Voice Assistant'}
            </Button>
          </div>

          {transcript && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium">You said:</p>
              <p className="text-sm text-gray-600">{transcript}</p>
            </div>
          )}

          {response && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Assistant:</p>
              <p className="text-sm text-gray-600">{response}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}