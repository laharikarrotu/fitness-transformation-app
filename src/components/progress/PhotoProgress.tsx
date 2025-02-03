// src/components/progress/PhotoProgress.tsx
'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import type { ProgressLog } from '@/types/progress';

type ViewType = 'front' | 'side' | 'back';

export default function PhotoProgress() {
  const [photos, setPhotos] = useState<ProgressLog['photos']>({});
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    viewType: ViewType
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('viewType', viewType);

      const response = await fetch('/api/progress/photos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload photo');

      const { photoUrl } = await response.json();
      setPhotos(prev => ({
        ...prev,
        [viewType]: photoUrl
      }));
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['front', 'side', 'back'] as ViewType[]).map((view) => (
            <div key={view} className="aspect-square relative">
              {photos?.[view] ? (
                <div className="relative w-full h-full">
                  <Image
                    src={photos[view]!}
                    alt={`${view} view`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e, view)}
                      disabled={isUploading}
                    />
                    <Camera className="w-8 h-8 text-gray-400" />
                  </label>
                </div>
              )}
              <p className="text-center mt-2 capitalize">{view} View</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}