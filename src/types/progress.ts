// src/types/progress.ts
export interface ProgressLog {
    id: string;
    userId: string;
    date: Date;
    weight?: number;
    measurements: {
      chest: number;
      waist: number;
      hips: number;
      arms: number;
      thighs: number;
    };
    photos?: {
      front?: string;
      side?: string;
      back?: string;
    };
    notes?: string;
  }
  