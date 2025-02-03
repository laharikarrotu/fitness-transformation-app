
export interface WorkoutVideo {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    channelName: string;
    viewCount: number;
    category: WorkoutCategory;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    targetMuscles: string[];
    equipmentNeeded: string[];
  }
  
  export type WorkoutCategory =
    | 'strength'
    | 'cardio'
    | 'hiit'
    | 'yoga'
    | 'pilates'
    | 'stretching'
    | 'crossfit';
  
  export interface WorkoutLog {
    id: string;
    userId: string;
    workoutType: WorkoutCategory;
    duration: number;
    caloriesBurned: number;
    date: Date;
    notes?: string;
  }
  