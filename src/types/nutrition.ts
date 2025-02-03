// src/types/nutrition.ts
export interface Recipe {
    id: string;
    name: string;
    image?: string;
    servings: number;
    prepTime: number;
    cookTime: number;
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fats: number;
    };
    ingredients: {
      name: string;
      amount: number;
      unit: string;
    }[];
    instructions: string[];
    tags: string[];
  }
  
  export interface MealLog {
    id: string;
    userId: string;
    date: Date;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: {
      name: string;
      servingSize: number;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    }[];
    totalCalories: number;
    notes?: string;
  }