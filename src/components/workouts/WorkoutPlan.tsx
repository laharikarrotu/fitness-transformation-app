
// src/components/workouts/WorkoutPlan.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

export default function WorkoutPlan() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="space-y-6">
      {daysOfWeek.map((day) => (
        <Card key={day}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">{day}</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Workout
            </Button>
          </CardHeader>
          <CardContent>
            {/* Workout slots would go here */}
            <p className="text-sm text-muted-foreground">No workouts planned</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}