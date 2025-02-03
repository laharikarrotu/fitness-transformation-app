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
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <Button
          size="sm"
          variant="secondary"
          className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white/80 hover:bg-white"
        >
          <Play className="h-6 w-6" />
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{video.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {video.duration}
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {video.difficulty}
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4" />
            {video.equipmentNeeded.join(', ')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}