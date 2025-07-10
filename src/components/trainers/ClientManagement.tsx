'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Clock,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useAuth0 } from '@/hooks/useAuth0';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  joinDate: string;
  lastSession: string;
  totalSessions: number;
  status: 'active' | 'inactive' | 'pending';
  goals: string[];
  progress: ClientProgress;
  nextSession?: string;
  notes: string;
}

interface ClientProgress {
  weight: number;
  weightGoal: number;
  bodyFat: number;
  bodyFatGoal: number;
  strength: {
    benchPress: number;
    squat: number;
    deadlift: number;
  };
  measurements: {
    chest: number;
    waist: number;
    arms: number;
    legs: number;
  };
}

interface Session {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: 'strength' | 'cardio' | 'flexibility' | 'nutrition' | 'assessment';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  exercises: SessionExercise[];
}

interface SessionExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

const SAMPLE_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2024-01-15',
    lastSession: '2024-01-20',
    totalSessions: 12,
    status: 'active',
    goals: ['Weight Loss', 'Strength Building', 'Improve Endurance'],
    progress: {
      weight: 68,
      weightGoal: 65,
      bodyFat: 22,
      bodyFatGoal: 18,
      strength: {
        benchPress: 45,
        squat: 60,
        deadlift: 80
      },
      measurements: {
        chest: 88,
        waist: 72,
        arms: 28,
        legs: 52
      }
    },
    nextSession: '2024-01-25',
    notes: 'Great progress on weight loss goal. Focus on strength training this week.'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1 (555) 234-5678',
    joinDate: '2023-11-10',
    lastSession: '2024-01-18',
    totalSessions: 25,
    status: 'active',
    goals: ['Muscle Building', 'Increase Strength'],
    progress: {
      weight: 75,
      weightGoal: 80,
      bodyFat: 15,
      bodyFatGoal: 12,
      strength: {
        benchPress: 80,
        squat: 100,
        deadlift: 120
      },
      measurements: {
        chest: 95,
        waist: 78,
        arms: 32,
        legs: 58
      }
    },
    nextSession: '2024-01-26',
    notes: 'Excellent strength gains. Ready to increase weights on compound movements.'
  }
];

const SAMPLE_SESSIONS: Session[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Sarah Johnson',
    date: '2024-01-25',
    time: '09:00',
    duration: 60,
    type: 'strength',
    status: 'scheduled',
    notes: 'Focus on upper body strength and core stability',
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 8, weight: 40 },
      { name: 'Push-ups', sets: 3, reps: 12 },
      { name: 'Plank', sets: 3, reps: 0 }
    ]
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Mike Chen',
    date: '2024-01-26',
    time: '10:00',
    duration: 75,
    type: 'strength',
    status: 'scheduled',
    notes: 'Heavy compound movements, focus on form',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 6, weight: 110 },
      { name: 'Squats', sets: 4, reps: 8, weight: 90 },
      { name: 'Pull-ups', sets: 3, reps: 8 }
    ]
  }
];

export default function ClientManagement() {
  const { user } = useAuth0();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(SAMPLE_SESSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddSession, setShowAddSession] = useState(false);
  const [newSession, setNewSession] = useState({
    clientId: '',
    date: '',
    time: '',
    duration: 60,
    type: 'strength' as Session['type'],
    notes: ''
  });

  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/trainers/clients?trainerId=${user?.id}`);
        if (!res.ok) throw new Error('Failed to fetch clients');
        const data = await res.json();
        setClients(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load clients');
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) fetchClients();
  }, [user?.id]);

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/trainers/clients`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainerId: user?.id, clientId, ...updates })
      });
      if (!response.ok) throw new Error('Failed to update client');
      setClients((prev) => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
    } catch (err: any) {
      setError(err.message || 'Failed to update client');
    } finally {
      setSaving(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todaySessions = sessions.filter(session => 
    session.date === new Date().toISOString().split('T')[0]
  );

  const upcomingSessions = sessions.filter(session => 
    session.date > new Date().toISOString().split('T')[0]
  ).slice(0, 5);

  const addSession = () => {
    if (!newSession.clientId || !newSession.date || !newSession.time) return;

    const client = clients.find(c => c.id === newSession.clientId);
    if (!client) return;

    const session: Session = {
      id: Date.now().toString(),
      clientId: newSession.clientId,
      clientName: client.name,
      date: newSession.date,
      time: newSession.time,
      duration: newSession.duration,
      type: newSession.type,
      status: 'scheduled',
      notes: newSession.notes,
      exercises: []
    };

    setSessions([...sessions, session]);
    setNewSession({
      clientId: '',
      date: '',
      time: '',
      duration: 60,
      type: 'strength',
      notes: ''
    });
    setShowAddSession(false);
  };

  const updateSessionStatus = (sessionId: string, status: Session['status']) => {
    setSessions(sessions.map(session => 
      session.id === sessionId ? { ...session, status } : session
    ));
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  if (loading) return <div className="p-6 text-center text-lg text-fitness-blue animate-pulse">Loading clients...</div>;
  if (error) return <div className="p-6 text-center text-lg text-red-500">{error}</div>;
  if (!clients.length) return <div className="p-6 text-center text-lg text-gray-500">No clients found.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-fitness-blue/10 via-fitness-green/10 to-fitness-accent/10 shadow-fitness border-0 animate-slide-down">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-fitness-blue drop-shadow-sm">Client Management</CardTitle>
          <CardDescription className="text-fitness-dark dark:text-fitness-light">Manage your clients and track their progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="clients" className="space-y-6">
            <TabsList>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="clients" className="space-y-6">
              <Card className="bg-gradient-to-br from-fitness-blue/10 via-fitness-green/10 to-fitness-accent/10 shadow-fitness border-0 animate-slide-down">
                <CardHeader>
                  <CardTitle className="text-2xl font-extrabold text-fitness-blue drop-shadow-sm">Client Management</CardTitle>
                  <CardDescription className="text-fitness-dark dark:text-fitness-light">Manage your clients and track their progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {filteredClients.map((client) => (
                      <Card key={client.id} className="cursor-pointer hover:bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-gray-400" />
                              </div>
                              <div>
                                <h4 className="font-medium">{client.name}</h4>
                                <p className="text-sm text-gray-600">{client.email}</p>
                                <p className="text-xs text-gray-500">
                                  {client.totalSessions} sessions • Joined {client.joinDate}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                client.status === 'active' ? 'bg-green-100 text-green-800' :
                                client.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {client.status}
                              </span>
                              {client.nextSession && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Next: {client.nextSession}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Weight Progress</p>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{client.progress.weight}kg</span>
                                <span className="text-xs text-gray-500">/ {client.progress.weightGoal}kg</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${getProgressPercentage(client.progress.weight, client.progress.weightGoal)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Body Fat</p>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{client.progress.bodyFat}%</span>
                                <span className="text-xs text-gray-500">/ {client.progress.bodyFatGoal}%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Session Management</CardTitle>
                      <CardDescription>Schedule and manage training sessions</CardDescription>
                    </div>
                    <Button onClick={() => setShowAddSession(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Session
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{session.clientName}</h4>
                            <p className="text-sm text-gray-600">
                              {session.date} at {session.time} • {session.duration} min
                            </p>
                            <p className="text-xs text-gray-500 capitalize">{session.type} training</p>
                            {session.notes && (
                              <p className="text-sm text-gray-600 mt-1">{session.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              session.status === 'no-show' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {session.status}
                            </span>
                            <Select 
                              value={session.status} 
                              onValueChange={(value: Session['status']) => updateSessionStatus(session.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="no-show">No Show</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {todaySessions.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No sessions scheduled for today</p>
                    ) : (
                      <div className="space-y-3">
                        {todaySessions.map((session) => (
                          <div key={session.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{session.clientName}</h4>
                                <p className="text-sm text-gray-600">{session.time} • {session.duration} min</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {session.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingSessions.map((session) => (
                        <div key={session.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{session.clientName}</h4>
                              <p className="text-sm text-gray-600">{session.date} at {session.time}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Add Session Modal */}
          {showAddSession && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <Card className="p-6 bg-white rounded-lg w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Schedule New Session</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Client</Label>
                    <Select value={newSession.clientId} onValueChange={(value) => setNewSession({...newSession, clientId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.filter(c => c.status === 'active').map(client => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newSession.date}
                        onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={newSession.time}
                        onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Duration (min)</Label>
                      <Input
                        type="number"
                        value={newSession.duration}
                        onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={newSession.type} onValueChange={(value: any) => setNewSession({...newSession, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strength">Strength</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="flexibility">Flexibility</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="assessment">Assessment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Notes</Label>
                    <textarea
                      className="w-full p-3 border rounded-md resize-none"
                      rows={3}
                      value={newSession.notes}
                      onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                      placeholder="Session notes..."
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={addSession} className="flex-1">Schedule Session</Button>
                    <Button variant="outline" onClick={() => setShowAddSession(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 