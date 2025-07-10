// src/components/progress/PhotoProgress.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import type { ProgressLog } from '@/types/progress';

type ViewType = 'front' | 'side' | 'back';

export default function PhotoProgress() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/progress/photos');
        if (!res.ok) throw new Error('Failed to fetch photos');
        const data = await res.json();
        setPhotos(data.files || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load photos');
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  const handlePhotoUpload = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/progress/photos', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload photo');
      // Refresh photo list
      const res = await fetch('/api/progress/photos');
      const data = await res.json();
      setPhotos(data.files || []);
    } catch (error) {
      setError('Error uploading photo');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDelete = async (key: string) => {
    setDeleting(key);
    setError(null);
    try {
      const res = await fetch('/api/progress/photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      if (!res.ok) throw new Error('Failed to delete photo');
      setPhotos((prev) => prev.filter((p: any) => p.key !== key));
    } catch (err: any) {
      setError(err.message || 'Failed to delete photo');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="p-6 text-center text-lg text-fitness-blue animate-pulse">Loading progress photos...</div>;
  if (error) return <div className="p-6 text-center text-lg text-red-500">{error}</div>;
  if (!photos.length) return <div className="p-6 text-center text-lg text-gray-500">No progress photos found.</div>;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Progress Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4 items-center">
          <label className="cursor-pointer bg-fitness-green text-white px-4 py-2 rounded-lg font-bold shadow-fitness transition-transform duration-200 hover:scale-105">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={isUploading}
              aria-label="Upload Progress Photo"
            />
          </label>
          {isUploading && <span className="text-fitness-blue animate-pulse">Uploading...</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {photos.map((photo: any) => (
            <div key={photo.key} className="relative group animate-fade-in">
              <Image
                src={photo.url || photo.signedUrl || photo.Location || ''}
                alt={photo.key}
                width={300}
                height={300}
                className="object-cover rounded-lg w-full h-64"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-80 hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(photo.key)}
                disabled={deleting === photo.key}
                aria-label="Delete Photo"
              >
                {deleting === photo.key ? '...' : '✕'}
              </button>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {new Date(photo.lastModified || photo.LastModified || Date.now()).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}