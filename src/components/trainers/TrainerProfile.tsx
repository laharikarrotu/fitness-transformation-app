'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Award, 
  Clock, 
  MapPin, 
  Star, 
  MessageCircle, 
  Calendar,
  Edit,
  Save,
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth0 } from '@/hooks/useAuth0';

interface TrainerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  experience: number; // years
  certifications: Certification[];
  specialties: string[];
  location: string;
  hourlyRate: number;
  availability: Availability[];
  rating: number;
  totalReviews: number;
  clients: number;
  isVerified: boolean;
  profileImage?: string;
}

interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  dateObtained: string;
  expiryDate?: string;
  isActive: boolean;
}

interface Availability {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export default function TrainerProfile() {
  const { user } = useAuth0();
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuingBody: '',
    dateObtained: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/trainers/profile?userId=${user?.id}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) fetchProfile();
  }, [user?.id]);

  const updateProfile = (updates: Partial<TrainerProfile>) => {
    setProfile((prev) => prev ? { ...prev, ...updates } : prev);
  };

  const addCertification = () => {
    if (!newCertification.name || !newCertification.issuingBody || !newCertification.dateObtained) return;
    const certification: Certification = {
      id: Date.now().toString(),
      name: newCertification.name,
      issuingBody: newCertification.issuingBody,
      dateObtained: newCertification.dateObtained,
      expiryDate: newCertification.expiryDate || undefined,
      isActive: true
    };
    setProfile((prev) => prev ? { ...prev, certifications: [...prev.certifications, certification] } : prev);
    setNewCertification({ name: '', issuingBody: '', dateObtained: '', expiryDate: '' });
  };

  const removeCertification = (id: string) => {
    setProfile((prev) => prev ? { ...prev, certifications: prev.certifications.filter(cert => cert.id !== id) } : prev);
  };

  const updateAvailability = (id: string, updates: Partial<Availability>) => {
    setProfile((prev) => prev ? {
      ...prev,
      availability: prev.availability.map(avail => avail.id === id ? { ...avail, ...updates } : avail)
    } : prev);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/trainers/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, userId: user?.id })
      });
      if (!response.ok) throw new Error('Failed to update profile');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const specialties = [
    'Strength Training', 'Weight Loss', 'Cardio Fitness', 'Functional Fitness',
    'Nutrition', 'Sports Performance', 'Rehabilitation', 'Yoga', 'Pilates',
    'CrossFit', 'Bodybuilding', 'Senior Fitness', 'Pre/Post Natal'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (loading) return <div className="p-6 text-center text-lg text-fitness-blue animate-pulse">Loading trainer profile...</div>;
  if (error) return <div className="p-6 text-center text-lg text-red-500">{error}</div>;
  if (!profile) return <div className="p-6 text-center text-lg text-gray-500">No profile found.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-fitness-blue/10 via-fitness-green/10 to-fitness-accent/10 shadow-fitness border-0 animate-slide-down">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-fitness-blue/20 rounded-full flex items-center justify-center shadow-fitness animate-pop">
                <User className="w-10 h-10 text-fitness-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-fitness-blue drop-shadow-sm">{profile.name}</h2>
                <p className="text-fitness-dark dark:text-fitness-light">{profile.location}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-fitness-accent fill-current animate-bounce" />
                    <span className="ml-1 font-bold text-fitness-accent">{profile.rating}</span>
                  </div>
                  <span className="text-xs text-fitness-dark dark:text-fitness-light">({profile.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
            {profile.isVerified && (
              <span className="ml-4 px-3 py-1 bg-fitness-green/80 text-white rounded-full font-bold text-xs animate-fade-in">Verified</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="specialties">Specialties</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={profile.email}
                    onChange={(e) => updateProfile({ email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => updateProfile({ phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={profile.location}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Hourly Rate ($)</Label>
                  <Input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => updateProfile({ hourlyRate: parseInt(e.target.value) })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bio & Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Bio</Label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    value={profile.experience}
                    onChange={(e) => updateProfile({ experience: parseInt(e.target.value) })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {isEditing && (
            <Card>
              <CardContent className="p-6">
                <Button onClick={saveProfile} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Manage your professional certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.certifications.map((cert) => (
                <div key={cert.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuingBody}</p>
                      <p className="text-xs text-gray-500">
                        Obtained: {cert.dateObtained}
                        {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        cert.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cert.isActive ? 'Active' : 'Expired'}
                      </span>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertification(cert.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isEditing && (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <h4 className="font-medium mb-3">Add New Certification</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Certification Name</Label>
                      <Input
                        value={newCertification.name}
                        onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                        placeholder="e.g., NASM Personal Trainer"
                      />
                    </div>
                    <div>
                      <Label>Issuing Body</Label>
                      <Input
                        value={newCertification.issuingBody}
                        onChange={(e) => setNewCertification({...newCertification, issuingBody: e.target.value})}
                        placeholder="e.g., National Academy of Sports Medicine"
                      />
                    </div>
                    <div>
                      <Label>Date Obtained</Label>
                      <Input
                        type="date"
                        value={newCertification.dateObtained}
                        onChange={(e) => setNewCertification({...newCertification, dateObtained: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Expiry Date (Optional)</Label>
                      <Input
                        type="date"
                        value={newCertification.expiryDate}
                        onChange={(e) => setNewCertification({...newCertification, expiryDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={addCertification} className="mt-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Availability Schedule</CardTitle>
              <CardDescription>Set your working hours for each day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.availability.map((day) => (
                <div key={day.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="w-24">
                    <span className="font-medium">{day.day}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={day.isAvailable}
                      onChange={(e) => updateAvailability(day.id, { isAvailable: e.target.checked })}
                      disabled={!isEditing}
                    />
                    <span className="text-sm">Available</span>
                  </div>
                  {day.isAvailable && (
                    <>
                      <Input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => updateAvailability(day.id, { startTime: e.target.value })}
                        disabled={!isEditing}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={day.endTime}
                        onChange={(e) => updateAvailability(day.id, { endTime: e.target.value })}
                        disabled={!isEditing}
                        className="w-32"
                      />
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
              <CardDescription>Select your areas of expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={specialty}
                      checked={profile.specialties.includes(specialty)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateProfile({ specialties: [...profile.specialties, specialty] });
                        } else {
                          updateProfile({ 
                            specialties: profile.specialties.filter(s => s !== specialty) 
                          });
                        }
                      }}
                      disabled={!isEditing}
                    />
                    <Label htmlFor={specialty} className="text-sm cursor-pointer">
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 