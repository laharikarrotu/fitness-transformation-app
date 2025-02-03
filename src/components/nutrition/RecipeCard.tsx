// src/components/nutrition/RecipeCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Users, Flame } from 'lucide-react';
import type { Recipe } from '@/types/nutrition';
import Image from 'next/image';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card>
      <div className="relative aspect-video">
        <Image
          src={recipe.image || '/placeholder-recipe.jpg'}
          alt={recipe.name}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.prepTime + recipe.cookTime} min
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {recipe.servings} servings
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4" />
            {recipe.calories} cal
          </div>
        </div>
      </CardContent>
    </Card>
  );
}