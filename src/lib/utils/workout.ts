// src/lib/utils/workout.ts
export function calculateCaloriesBurned(
    weight: number, // in kg
    duration: number, // in minutes
    intensity: 'low' | 'moderate' | 'high',
    exerciseType: string
  ): number {
    // MET (Metabolic Equivalent of Task) values
    const metValues: Record<string, Record<string, number>> = {
      running: { low: 7, moderate: 9, high: 12 },
      cycling: { low: 4, moderate: 6, high: 8 },
      swimming: { low: 6, moderate: 8, high: 10 },
      weightlifting: { low: 3, moderate: 4, high: 6 }
    };
  
    const defaultMet = { low: 3, moderate: 5, high: 7 };
    const met = metValues[exerciseType]?.[intensity] || defaultMet[intensity];
  
    // Calories = MET × Weight (kg) × Duration (hours)
    return Math.round((met * weight * (duration / 60)));
  }