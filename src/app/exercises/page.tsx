"use client";

import React, { useEffect, useState } from 'react';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  description?: string;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/exercises?search=${encodeURIComponent(search)}`);
        if (!res.ok) throw new Error('Failed to fetch exercises');
        const data = await res.json();
        setExercises(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load exercises');
      } finally {
        setLoading(false);
      }
    }
    fetchExercises();
  }, [search]);

  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold mb-6 text-fitness-blue">Exercises</h1>
      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fitness-green"
        />
      </div>
      {loading ? (
        <div className="text-center text-fitness-blue animate-pulse">Loading exercises...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : exercises.length === 0 ? (
        <div className="text-center text-gray-500">No exercises found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {exercises.map(ex => (
            <div key={ex.id} className="bg-white dark:bg-fitness-dark rounded-xl shadow p-5 flex flex-col gap-2 border border-fitness-border">
              <h2 className="text-xl font-bold text-fitness-green mb-1">{ex.name}</h2>
              <div className="text-sm text-fitness-dark dark:text-fitness-light">
                <span className="font-semibold">Muscle Group:</span> {ex.muscleGroup || 'N/A'}
              </div>
              <div className="text-sm text-fitness-dark dark:text-fitness-light">
                <span className="font-semibold">Equipment:</span> {ex.equipment || 'None'}
              </div>
              <div className="text-sm text-fitness-dark dark:text-fitness-light">
                <span className="font-semibold">Difficulty:</span> {ex.difficulty || 'N/A'}
              </div>
              {ex.description && (
                <div className="text-xs text-gray-500 mt-2 line-clamp-3">{ex.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 