'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Activity, 
  Plus,
  Trophy,
  Award,
  BarChart3
} from 'lucide-react';
import { useAuth0 } from '@/hooks/useAuth0';

interface ProgressMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  date: string;
  category: 'weight' | 'measurements' | 'strength' | 'endurance';
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  category: string;
  status: 'active' | 'completed' | 'overdue';
}

const SAMPLE_METRICS: ProgressMetric[] = [
  { id: '1', name: 'Weight', value: 75.5, unit: 'kg', target: 70, date: '2024-01-15', category: 'weight' },
  { id: '2', name: 'Chest', value: 95, unit: 'cm', target: 100, date: '2024-01-15', category: 'measurements' },
  { id: '3', name: 'Bench Press', value: 80, unit: 'kg', target: 100, date: '2024-01-15', category: 'strength' },
  { id: '4', name: '5K Time', value: 25, unit: 'min', target: 20, date: '2024-01-15', category: 'endurance' },
];

const SAMPLE_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Lose 10kg',
    description: 'Reach target weight through diet and exercise',
    targetValue: 70,
    currentValue: 75.5,
    unit: 'kg',
    deadline: '2024-06-01',
    category: 'weight',
    status: 'active'
  },
  {
    id: '2',
    title: 'Bench Press 100kg',
    description: 'Increase bench press strength',
    targetValue: 100,
    currentValue: 80,
    unit: 'kg',
    deadline: '2024-05-01',
    category: 'strength',
    status: 'active'
  },
  {
    id: '3',
    title: 'Run 5K in 20 minutes',
    description: 'Improve running endurance and speed',
    targetValue: 20,
    currentValue: 25,
    unit: 'min',
    deadline: '2024-04-01',
    category: 'endurance',
    status: 'overdue'
  }
];

export default function ProgressDashboard() {
  const { user } = useAuth0();
  const [metrics, setMetrics] = useState<ProgressMetric[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newMetric, setNewMetric] = useState({
    name: '',
    value: 0,
    unit: '',
    target: 0,
    category: 'weight' as const
  });
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: 0,
    unit: '',
    deadline: '',
    category: 'weight'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [goalLoading, setGoalLoading] = useState(true);
  const [goalError, setGoalError] = useState<string | null>(null);
  const [goalSaving, setGoalSaving] = useState(false);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/progress/metrics');
        if (!res.ok) throw new Error('Failed to fetch metrics');
        const data = await res.json();
        setMetrics(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  useEffect(() => {
    async function fetchGoals() {
      setGoalLoading(true);
      setGoalError(null);
      try {
        const res = await fetch('/api/goals');
        if (!res.ok) throw new Error('Failed to fetch goals');
        const data = await res.json();
        setGoals(data);
      } catch (err: any) {
        setGoalError(err.message || 'Failed to load goals');
      } finally {
        setGoalLoading(false);
      }
    }
    fetchGoals();
  }, []);

  const addMetric = async () => {
    if (!user || !newMetric.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/progress/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMetric)
      });
      if (!res.ok) throw new Error('Failed to add metric');
      const saved = await res.json();
      setMetrics((prev) => [...prev, saved]);
      setNewMetric({ name: '', value: 0, unit: '', target: 0, category: 'weight' });
      setShowAddMetric(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add metric');
    } finally {
      setSaving(false);
    }
  };

  const addGoal = async () => {
    if (!user || !newGoal.title.trim()) return;
    setGoalSaving(true);
    setGoalError(null);
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });
      if (!res.ok) throw new Error('Failed to add goal');
      const saved = await res.json();
      setGoals((prev) => [...prev, saved]);
      setNewGoal({ title: '', description: '', targetValue: 0, unit: '', deadline: '', category: 'weight' });
      setShowAddGoal(false);
    } catch (err: any) {
      setGoalError(err.message || 'Failed to add goal');
    } finally {
      setGoalSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-lg text-fitness-blue animate-pulse">Loading progress metrics...</div>;
  if (error) return <div className="p-6 text-center text-lg text-red-500">{error}</div>;
  if (!metrics.length) return <div className="p-6 text-center text-lg text-gray-500">No progress metrics found.</div>;
  if (goalLoading) return <div className="p-6 text-center text-lg text-fitness-blue animate-pulse">Loading goals...</div>;
  if (goalError) return <div className="p-6 text-center text-lg text-red-500">{goalError}</div>;
  if (!goals.length) return <div className="p-6 text-center text-lg text-gray-500">No goals found.</div>;

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'weight', label: 'Weight' },
    { value: 'measurements', label: 'Measurements' },
    { value: 'strength', label: 'Strength' },
    { value: 'endurance', label: 'Endurance' }
  ];

  const filteredMetrics = metrics.filter(metric => 
    selectedCategory === 'all' || metric.category === selectedCategory
  );

  const filteredGoals = goals.filter(goal => 
    selectedCategory === 'all' || goal.category === selectedCategory
  );

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-fitness-green';
      case 'overdue': return 'text-fitness-orange';
      default: return 'text-fitness-blue';
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-fitness-blue" />
              <div>
                <p className="text-sm text-fitness-dark dark:text-fitness-light">Total Metrics</p>
                <p className="text-2xl font-bold text-fitness-blue">{metrics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-fitness-green" />
              <div>
                <p className="text-sm text-fitness-dark dark:text-fitness-light">Active Goals</p>
                <p className="text-2xl font-bold text-fitness-green">{goals.filter(g => g.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-fitness-accent" />
              <div>
                <p className="text-sm text-fitness-dark dark:text-fitness-light">Completed Goals</p>
                <p className="text-2xl font-bold text-fitness-accent">{goals.filter(g => g.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness border-0">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-8 h-8 text-fitness-orange" />
              <div>
                <p className="text-sm text-fitness-dark dark:text-fitness-light">Overdue Goals</p>
                <p className="text-2xl font-bold text-fitness-orange">{goals.filter(g => g.status === 'overdue').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Table */}
      <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness border-0">
        <CardHeader>
          <CardTitle className="text-fitness-green">Progress Metrics</CardTitle>
          <CardDescription className="text-fitness-dark dark:text-fitness-light">Track your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-fitness-blue">
                  <th className="px-4 py-2 text-left">Metric</th>
                  <th className="px-4 py-2 text-left">Value</th>
                  <th className="px-4 py-2 text-left">Target</th>
                  <th className="px-4 py-2 text-left">Progress</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map(metric => (
                  <tr key={metric.id} className="border-b last:border-0">
                    <td className="px-4 py-2 font-semibold text-fitness-dark dark:text-fitness-light">{metric.name}</td>
                    <td className="px-4 py-2">{metric.value} {metric.unit}</td>
                    <td className="px-4 py-2">{metric.target} {metric.unit}</td>
                    <td className="px-4 py-2 w-48">
                      <Progress value={getProgressPercentage(metric.value, metric.target)} className="h-2 bg-fitness-green/10" />
                    </td>
                    <td className="px-4 py-2 text-xs text-fitness-accent">{metric.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Goals Table */}
      <Card className="bg-white/90 dark:bg-fitness-dark/80 shadow-fitness border-0">
        <CardHeader>
          <CardTitle className="text-fitness-blue">Goals</CardTitle>
          <CardDescription className="text-fitness-dark dark:text-fitness-light">Stay motivated and on track</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-fitness-green">
                  <th className="px-4 py-2 text-left">Goal</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Progress</th>
                  <th className="px-4 py-2 text-left">Deadline</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {goals.map(goal => (
                  <tr key={goal.id} className="border-b last:border-0">
                    <td className="px-4 py-2 font-semibold text-fitness-dark dark:text-fitness-light">{goal.title}</td>
                    <td className="px-4 py-2">{goal.description}</td>
                    <td className="px-4 py-2 w-48">
                      <Progress value={getProgressPercentage(goal.currentValue, goal.targetValue)} className="h-2 bg-fitness-accent/10" />
                    </td>
                    <td className="px-4 py-2 text-xs text-fitness-blue">{goal.deadline}</td>
                    <td className={`px-4 py-2 font-bold ${getGoalStatusColor(goal.status)}`}>{goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 