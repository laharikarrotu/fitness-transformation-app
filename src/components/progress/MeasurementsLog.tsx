// src/components/progress/MeasurementsLog.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProgressLog } from '@/types/progress';

type MeasurementKey = 'chest' | 'waist' | 'hips' | 'arms' | 'thighs';

export default function MeasurementsLog() {
  const [measurements, setMeasurements] = useState<ProgressLog['measurements']>({
    chest: 0,
    waist: 0,
    hips: 0,
    arms: 0,
    thighs: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/progress/measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ measurements }),
      });
      
      if (!response.ok) throw new Error('Failed to save measurements');
      
      // Show success message or refresh data
    } catch (error) {
      console.error('Error saving measurements:', error);
    }
  };

  const measurementFields: Array<{ key: MeasurementKey; label: string }> = [
    { key: 'chest', label: 'Chest' },
    { key: 'waist', label: 'Waist' },
    { key: 'hips', label: 'Hips' },
    { key: 'arms', label: 'Arms' },
    { key: 'thighs', label: 'Thighs' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Measurements</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {measurementFields.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label} (cm)</Label>
                <Input
                  id={key}
                  type="number"
                  step="0.1"
                  value={measurements[key]}
                  onChange={(e) => setMeasurements(prev => ({
                    ...prev,
                    [key]: parseFloat(e.target.value)
                  }))}
                />
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full">
            Save Measurements
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}