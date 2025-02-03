// src/app/profile/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, Mail, Lock, Weight, Ruler, 
  Target, Activity 
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex">
                <User className="w-4 h-4 text-muted-foreground mt-3 mr-2" />
                <Input id="name" placeholder="Your name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex">
                <Mail className="w-4 h-4 text-muted-foreground mt-3 mr-2" />
                <Input id="email" type="email" placeholder="Your email" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex">
                <Lock className="w-4 h-4 text-muted-foreground mt-3 mr-2" />
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fitness Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Fitness Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Current Weight (kg)</Label>
              <div className="flex">
                <Weight className="w-4 h-4 text-muted-foreground mt-3 mr-2" />
                <Input id="weight" type="number" placeholder="Weight" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <div className="flex">
                <Ruler className="w-4 h-4 text-muted-foreground mt-3 mr-2" />
                <Input id="height" type="number" placeholder="Height" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <div className="flex">
                <Target className="w-4 h-4 text-muted-foreground mt-3 mr-2" />
                <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                <Activity className="w-4 h-4 text-muted-foreground mt-3 mr-2" />
                <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Workout Reminders</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Meal Tracking Reminders</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Progress Updates</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Units</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="weight-unit" value="kg" />
                    <span>Kilograms (kg)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="weight-unit" value="lbs" />
                    <span>Pounds (lbs)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}