"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/useToast';

interface Profile {
  preferences?: {
    workoutReminders?: boolean;
    weeklyWorkoutReminders?: boolean;
    mealReminders?: boolean;
    waterReminders?: boolean;
    progressReminders?: boolean;
    goalReminders?: boolean;
    profileVisibility?: string;
    shareProgress?: boolean;
    shareWorkouts?: boolean;
    theme?: string;
    weightUnit?: string;
    heightUnit?: string;
  };
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        toast({ title: 'Error', description: err.message || 'Failed to load profile', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: profile?.preferences || {},
        }),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast({ title: 'Success', description: 'Settings saved successfully!' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setProfile((prev: Profile | null) => {
      if (!prev) return prev;
      return { ...prev, preferences: { ...prev.preferences, [field]: value } };
    });
  };

  if (loading) return <div className="p-8 text-center text-lg text-fitness-blue animate-pulse">Loading settings...</div>;
  if (!profile) return <div className="p-8 text-center text-lg text-red-500">Failed to load profile</div>;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="w-full rounded-xl bg-gradient-to-r from-fitness-green to-fitness-blue p-6 flex items-center justify-between shadow-fitness mb-4">
        <div className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-8 h-8 text-fitness-orange" />
          Settings
        </div>
        <div className="text-lg text-white font-semibold hidden md:block">
          Customize your experience
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Data
          </TabsTrigger>
        </TabsList>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness">
            <CardHeader>
              <CardTitle className="text-fitness-green">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-fitness-blue">Workout Reminders</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded accent-fitness-green" 
                      checked={!!profile.preferences?.workoutReminders}
                      onChange={e => handleChange('workoutReminders', e.target.checked)}
                    />
                    <span>Daily workout reminders</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded accent-fitness-blue" 
                      checked={!!profile.preferences?.weeklyWorkoutReminders}
                      onChange={e => handleChange('weeklyWorkoutReminders', e.target.checked)}
                    />
                    <span>Weekly workout summaries</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-fitness-blue">Nutrition Tracking</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded accent-fitness-orange" 
                      checked={!!profile.preferences?.mealReminders}
                      onChange={e => handleChange('mealReminders', e.target.checked)}
                    />
                    <span>Meal tracking reminders</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded accent-fitness-accent" 
                      checked={!!profile.preferences?.waterReminders}
                      onChange={e => handleChange('waterReminders', e.target.checked)}
                    />
                    <span>Water intake reminders</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-fitness-blue">Progress Updates</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded accent-fitness-green" 
                      checked={!!profile.preferences?.progressReminders}
                      onChange={e => handleChange('progressReminders', e.target.checked)}
                    />
                    <span>Weekly progress reports</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded accent-fitness-blue" 
                      checked={!!profile.preferences?.goalReminders}
                      onChange={e => handleChange('goalReminders', e.target.checked)}
                    />
                    <span>Goal milestone notifications</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness">
            <CardHeader>
              <CardTitle className="text-fitness-green">Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-fitness-blue">Profile Visibility</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      name="profile-visibility" 
                      value="public" 
                      className="accent-fitness-green"
                      checked={profile.preferences?.profileVisibility === 'public'}
                      onChange={e => handleChange('profileVisibility', e.target.value)}
                    />
                    <span>Public - Anyone can see my profile</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      name="profile-visibility" 
                      value="friends" 
                      className="accent-fitness-blue"
                      checked={profile.preferences?.profileVisibility === 'friends'}
                      onChange={e => handleChange('profileVisibility', e.target.value)}
                    />
                    <span>Friends only - Only connected users can see my profile</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      name="profile-visibility" 
                      value="private" 
                      className="accent-fitness-orange"
                      checked={profile.preferences?.profileVisibility === 'private'}
                      onChange={e => handleChange('profileVisibility', e.target.value)}
                    />
                    <span>Private - Only I can see my profile</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-fitness-blue">Data Sharing</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded accent-fitness-green" 
                      checked={!!profile.preferences?.shareProgress}
                      onChange={e => handleChange('shareProgress', e.target.checked)}
                    />
                    <span>Share progress with trainers</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="rounded accent-fitness-blue" 
                      checked={!!profile.preferences?.shareWorkouts}
                      onChange={e => handleChange('shareWorkouts', e.target.checked)}
                    />
                    <span>Share workout achievements</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness">
            <CardHeader>
              <CardTitle className="text-fitness-green">Appearance & Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-fitness-blue">Theme</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      name="theme" 
                      value="light" 
                      className="accent-fitness-green"
                      checked={profile.preferences?.theme === 'light'}
                      onChange={e => handleChange('theme', e.target.value)}
                    />
                    <span>Light mode</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      name="theme" 
                      value="dark" 
                      className="accent-fitness-blue"
                      checked={profile.preferences?.theme === 'dark'}
                      onChange={e => handleChange('theme', e.target.value)}
                    />
                    <span>Dark mode</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      name="theme" 
                      value="system" 
                      className="accent-fitness-orange"
                      checked={profile.preferences?.theme === 'system'}
                      onChange={e => handleChange('theme', e.target.value)}
                    />
                    <span>System default</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-fitness-blue">Units</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight-unit">Weight Unit</Label>
                    <Select 
                      value={profile.preferences?.weightUnit || 'kg'} 
                      onValueChange={(value) => handleChange('weightUnit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="height-unit">Height Unit</Label>
                    <Select 
                      value={profile.preferences?.heightUnit || 'cm'} 
                      onValueChange={(value) => handleChange('heightUnit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">Centimeters (cm)</SelectItem>
                        <SelectItem value="ft">Feet & Inches (ft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data">
          <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness">
            <CardHeader>
              <CardTitle className="text-fitness-green">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-fitness-blue">Export Data</h3>
                <p className="text-sm text-gray-600">Download all your fitness data as a JSON file</p>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export My Data
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-fitness-blue">Import Data</h3>
                <p className="text-sm text-gray-600">Import fitness data from another source</p>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import Data
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-red-600">Danger Zone</h3>
                <p className="text-sm text-gray-600">Permanently delete all your data. This action cannot be undone.</p>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-fitness-green hover:bg-fitness-blue text-white font-bold shadow-fitness"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
} 