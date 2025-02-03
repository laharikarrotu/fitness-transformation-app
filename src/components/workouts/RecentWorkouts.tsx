'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WorkoutVideo } from "@/types/workout";

export default function RecentWorkouts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Workouts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add workout list items here */}
          <p className="text-sm text-muted-foreground">No recent workouts</p>
        </div>
      </CardContent>
    </Card>
  );
} 