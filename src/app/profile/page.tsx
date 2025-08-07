"use client";
// src/app/profile/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, Mail, Lock, Weight, Ruler, 
  Target, Activity, Flame, Award 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/useToast';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };
  const handlePrefChange = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, preferences: { ...prev.preferences, [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: profile.preferences,
          name: profile.name,
          email: profile.email,
        }),
      });
      if (!res.ok) throw new Error('Failed to save profile');
      setSuccess(true);
      toast({ title: 'Profile updated!', description: 'Your changes have been saved.' });
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
      toast({ title: 'Error', description: err.message || 'Failed to save profile', variant: 'destructive' });
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg text-fitness-blue animate-pulse">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="space-y-8 p-6">
      {/* Motivational Banner */}
      <div className="w-full rounded-xl bg-gradient-to-r from-fitness-green to-fitness-blue p-6 flex items-center justify-between shadow-fitness mb-4 animate-fade-in">
        <div className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Award className="w-8 h-8 text-fitness-orange animate-bounce" />
          Your Fitness Profile
        </div>
        <div className="text-lg text-white font-semibold hidden md:block">
          "Progress, not perfection."
        </div>
      </div>

      <h1 className="text-3xl font-bold text-fitness-green mb-2 animate-fade-in">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="md:col-span-2 bg-white/90 dark:bg-fitness-dark/80 shadow-fitness animate-fade-in">
          <CardHeader>
            <CardTitle className="text-fitness-blue">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex">
                <User className="w-4 h-4 text-fitness-green mt-3 mr-2" />
                <Input id="name" placeholder="Your name" value={profile.name || ''} onChange={e => handleChange('name', e.target.value)} aria-label="Full Name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex">
                <Mail className="w-4 h-4 text-fitness-blue mt-3 mr-2" />
                <Input id="email" type="email" placeholder="Your email" value={profile.email || ''} onChange={e => handleChange('email', e.target.value)} aria-label="Email" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex">
                <Lock className="w-4 h-4 text-fitness-orange mt-3 mr-2" />
                <Input id="password" type="password" placeholder="••••••••" disabled aria-label="Password (change in Auth0)" />
              </div>
              <span className="text-xs text-gray-500">Password changes are managed via Auth0.</span>
            </div>
          </CardContent>
        </Card>

        {/* Fitness Profile */}
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness animate-fade-in">
          <CardHeader>
            <CardTitle className="text-fitness-green">Fitness Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Current Weight (kg)</Label>
              <div className="flex">
                <Weight className="w-4 h-4 text-fitness-blue mt-3 mr-2" />
                <Input id="weight" type="number" placeholder="Weight" value={profile.preferences?.weight || ''} onChange={e => handlePrefChange('weight', e.target.value)} aria-label="Current Weight" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <div className="flex">
                <Ruler className="w-4 h-4 text-fitness-green mt-3 mr-2" />
                <Input id="height" type="number" placeholder="Height" value={profile.preferences?.height || ''} onChange={e => handlePrefChange('height', e.target.value)} aria-label="Height" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <div className="flex">
                <Target className="w-4 h-4 text-fitness-accent mt-3 mr-2" />
                <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitness-green" value={profile.preferences?.goal || ''} onChange={e => handlePrefChange('goal', e.target.value)} aria-label="Fitness Goal">
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="athletic_performance">Athletic Performance</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <div className="flex">
                <Activity className="w-4 h-4 text-fitness-blue mt-3 mr-2" />
                <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitness-blue" value={profile.preferences?.activity || ''} onChange={e => handlePrefChange('activity', e.target.value)} aria-label="Activity Level">
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="moderately_active">Moderately Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="md:col-span-3 bg-white/90 dark:bg-fitness-dark/80 shadow-fitness animate-fade-in">
          <CardHeader>
            <CardTitle className="text-fitness-accent">App Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2 text-fitness-green">Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded accent-fitness-green" checked={!!profile.preferences?.workoutReminders} onChange={e => handlePrefChange('workoutReminders', e.target.checked)} aria-label="Workout Reminders" />
                    <span>Workout Reminders</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded accent-fitness-blue" checked={!!profile.preferences?.mealReminders} onChange={e => handlePrefChange('mealReminders', e.target.checked)} aria-label="Meal Tracking Reminders" />
                    <span>Meal Tracking Reminders</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded accent-fitness-orange" checked={!!profile.preferences?.progressReminders} onChange={e => handlePrefChange('progressReminders', e.target.checked)} aria-label="Progress Updates" />
                    <span>Progress Updates</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2 text-fitness-blue">Units</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="weight-unit" value="kg" className="accent-fitness-green" checked={profile.preferences?.weightUnit === 'kg'} onChange={e => handlePrefChange('weightUnit', e.target.value)} aria-label="Kilograms (kg)" />
                    <span>Kilograms (kg)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="weight-unit" value="lbs" className="accent-fitness-blue" checked={profile.preferences?.weightUnit === 'lbs'} onChange={e => handlePrefChange('weightUnit', e.target.value)} aria-label="Pounds (lbs)" />
                    <span>Pounds (lbs)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <Button variant="outline" onClick={() => window.location.reload()} className="transition-transform duration-200 hover:scale-105">Cancel</Button>
              <Button className="bg-fitness-green hover:bg-fitness-blue text-white font-bold shadow-fitness transition-transform duration-200 hover:scale-105 disabled:opacity-60" onClick={handleSave} disabled={saving} aria-busy={saving} aria-label="Save Changes">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
            {success && <div className="text-green-600 font-semibold mt-2 animate-fade-in">Profile updated successfully!</div>}
            {error && <div className="text-red-500 font-semibold mt-2 animate-fade-in">{error}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}