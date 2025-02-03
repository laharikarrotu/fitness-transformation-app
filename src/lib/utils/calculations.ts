// src/lib/utils/calculations.ts
export function calculateBMI(weight: number, height: number): number {
    // Weight in kg, height in cm
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }
  
  export function calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female'
  ): number {
    // Mifflin-St Jeor Equation
    const bmr = gender === 'male'
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;
    
    return Math.round(bmr);
  }
  
  export function calculateTDEE(bmr: number, activityLevel: string): number {
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725
    };
  
    const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2;
    return Math.round(bmr * multiplier);
  }
  