'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, Play } from 'lucide-react';
import { Exercise } from '@/types/exercise';

interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number; // in seconds
}

export default function WorkoutBuilder() {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [duration, setDuration] = useState(4); // weeks
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const muscleGroups = ['all', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  const equipmentOptions = [
    'all',
    'Barbell',
    'Dumbbell',
    'Machine',
    'Cable',
    'Kettlebell',
    'Bodyweight',
    'Resistance Band',
    'Medicine Ball',
    'Exercise Ball',
    'EZ Bar',
    'Smith Machine',
    'Other',
  ];
  const difficultyOptions = ['all', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedMuscleGroup !== 'all') params.append('muscleGroup', selectedMuscleGroup);
        if (selectedEquipment !== 'all') params.append('equipment', selectedEquipment);
        if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
        if (search) params.append('search', search);
        params.append('limit', '50');
        const res = await fetch(`/api/exercises?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch exercises');
        const data = await res.json();
        setExercises(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching exercises');
      } finally {
        setLoading(false);
      }
    }
    fetchExercises();
  }, [selectedMuscleGroup, selectedEquipment, selectedDifficulty, search]);

  const filteredExercises = exercises;

  const addExercise = (exercise: Exercise) => {
    const workoutExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exercise,
      sets: 3,
      reps: 10,
      restTime: 60
    };
    setSelectedExercises([...selectedExercises, workoutExercise]);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, updates: Partial<WorkoutExercise>) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], ...updates };
    setSelectedExercises(updated);
  };

  const saveWorkout = async () => {
    if (!workoutName.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'plan',
          name: workoutName,
          description: workoutDescription,
          difficulty,
          duration,
          exercises: selectedExercises.map(ex => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            restTime: ex.restTime
          }))
        })
      });

      if (response.ok) {
        // Reset form
        setWorkoutName('');
        setWorkoutDescription('');
        setSelectedExercises([]);
        alert('Workout plan saved successfully!');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout plan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Workout Plan</CardTitle>
          <CardDescription>
            Build a custom workout plan tailored to your fitness goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="e.g., Upper Body Strength"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={workoutDescription}
              onChange={(e) => setWorkoutDescription(e.target.value)}
              placeholder="Describe your workout plan..."
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration (weeks)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="12"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise Library */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise Library</CardTitle>
            <CardDescription>Select exercises for your workout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[180px]">
                <Label>Search</Label>
                <Input
                  placeholder="Search exercises..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="min-w-[160px]">
                <Label>Muscle Group</Label>
                <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map(group => (
                      <SelectItem key={group} value={group}>
                        {group === 'all' ? 'All Groups' : group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[160px]">
                <Label>Equipment</Label>
                <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentOptions.map(equip => (
                      <SelectItem key={equip} value={equip}>
                        {equip === 'all' ? 'All Equipment' : equip}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[160px]">
                <Label>Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map(diff => (
                      <SelectItem key={diff} value={diff}>
                        {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {loading ? (
              <div className="text-center py-8">Loading exercises...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredExercises.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No exercises found.</div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => addExercise(exercise)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{exercise.name}</h4>
                          <p className="text-sm text-gray-600">
                            {exercise.muscleGroup} • {exercise.equipment} • {exercise.difficulty}
                          </p>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Exercises */}
        <Card>
          <CardHeader>
            <CardTitle>Your Workout</CardTitle>
            <CardDescription>
              {selectedExercises.length} exercises selected
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedExercises.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Select exercises from the library to build your workout
              </p>
            ) : (
              <div className="space-y-4">
                {selectedExercises.map((exercise, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{exercise.exercise.name}</h4>
                        <p className="text-sm text-gray-600">{exercise.exercise.muscleGroup}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Sets</Label>
                        <Input
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, { sets: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Reps</Label>
                        <Input
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, { reps: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rest (sec)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={exercise.restTime}
                          onChange={(e) => updateExercise(index, { restTime: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  onClick={saveWorkout}
                  disabled={isSaving || !workoutName.trim()}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Workout Plan
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 