// src/components/workouts/WorkoutCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Target, Dumbbell } from 'lucide-react';
import { WorkoutVideo } from '@/types/workout';

interface WorkoutCardProps {
  video: WorkoutVideo;
}

export default function WorkoutCard({ video }: WorkoutCardProps) {
  return (
    <Card className="overflow-hidden shadow-fitness bg-white/90 dark:bg-fitness-dark/80 border-0">
      <div className="relative aspect-video group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          size="sm"
          variant="secondary"
          className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-fitness-green/90 hover:bg-fitness-blue/90 text-white shadow-fitness opacity-90 group-hover:scale-110 transition-transform duration-300"
        >
          <Play className="h-7 w-7" />
        </Button>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-lg text-fitness-green group-hover:text-fitness-blue transition-colors duration-300">{video.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-fitness-dark dark:text-fitness-light">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-fitness-blue" />
            {video.duration}
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-fitness-accent" />
            {video.difficulty}
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4 text-fitness-green" />
            {video.equipmentNeeded.join(', ')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}