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
  MessageCircle, 
  Share2, 
  BookOpen, 
  Calendar,
  MapPin,
  Star,
  Plus,
  Search,
  Filter,
  Send,
  Heart,
  Bookmark,
  ExternalLink
} from 'lucide-react';

interface Trainer {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  isOnline: boolean;
  profileImage?: string;
  bio: string;
  certifications: string[];
  hourlyRate: number;
  connectionStatus: 'connected' | 'pending' | 'none';
}

interface Post {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerImage?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  tags: string[];
  type: 'workout' | 'nutrition' | 'motivation' | 'education' | 'achievement';
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'nutrition' | 'education' | 'template';
  author: string;
  authorId: string;
  downloads: number;
  rating: number;
  tags: string[];
  fileUrl?: string;
  isPublic: boolean;
  createdAt: string;
}

export default function TrainerNetworking() {
  const [network, setNetwork] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]); // TODO: Integrate with backend
  const [resources, setResources] = useState<Resource[]>([]); // TODO: Integrate with backend

  useEffect(() => {
    async function fetchNetwork() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/trainers/network?trainerId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch network');
        const data = await res.json();
        setNetwork(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load network');
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchNetwork();
  }, [userId]);

  const connectTrainer = async (targetTrainerId: string) => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/trainers/network`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainerId: userId, targetTrainerId })
      });
      if (!response.ok) throw new Error('Failed to connect with trainer');
      setNetwork((prev) => prev.map(t => t.id === targetTrainerId ? { ...t, isConnected: true } : t));
    } catch (err: any) {
      setError(err.message || 'Failed to connect with trainer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-lg text-fitness-blue animate-pulse">Loading network...</div>;
  if (error) return <div className="p-6 text-center text-lg text-red-500">{error}</div>;
  if (!network.length) return <div className="p-6 text-center text-lg text-gray-500">No trainers found in your network.</div>;

  const specialties = [
    'all', 'Strength Training', 'Weight Loss', 'Cardio Fitness', 'Functional Fitness',
    'Nutrition', 'Sports Performance', 'Rehabilitation', 'Yoga', 'Pilates',
    'CrossFit', 'Bodybuilding', 'Senior Fitness', 'Pre/Post Natal'
  ];

  const filteredTrainers = network.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trainer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || trainer.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const addPost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      trainerId: userId || '',
      trainerName: userId || 'You',
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Just now',
      tags: [],
      type: 'motivation'
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setShowNewPost(false);
  };

  const likePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const connectWithTrainer = (trainerId: string) => {
    setNetwork((prev) => prev.map(t => t.id === trainerId ? { ...t, connectionStatus: 'pending' } : t));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-fitness-blue/10 via-fitness-green/10 to-fitness-accent/10 shadow-fitness border-0 animate-slide-down">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-fitness-blue drop-shadow-sm">Trainer Networking</CardTitle>
          <CardDescription className="text-fitness-dark dark:text-fitness-light">Connect and collaborate with other trainers</CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Connections</p>
                <p className="text-2xl font-bold">
                  {network.filter(t => t.connectionStatus === 'connected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share2 className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Resources Shared</p>
                <p className="text-2xl font-bold">{resources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Resources Downloaded</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Community Feed</CardTitle>
                <Button onClick={() => setShowNewPost(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Share Post
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{post.trainerName}</h4>
                        <span className="text-sm text-gray-500">{post.timestamp}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          post.type === 'workout' ? 'bg-blue-100 text-blue-800' :
                          post.type === 'nutrition' ? 'bg-green-100 text-green-800' :
                          post.type === 'motivation' ? 'bg-purple-100 text-purple-800' :
                          post.type === 'education' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {post.type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button 
                          onClick={() => likePost(post.id)}
                          className="flex items-center space-x-1 hover:text-red-500"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="w-4 h-4" />
                          <span>{post.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Trainers</CardTitle>
              <CardDescription>Connect with other fitness professionals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search trainers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty === 'all' ? 'All Specialties' : specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrainers.map((trainer) => (
                  <Card key={trainer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{trainer.name}</h4>
                            {trainer.isOnline && (
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {trainer.location}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{trainer.rating}</span>
                            <span className="text-xs text-gray-500">({trainer.totalReviews})</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {trainer.experience} years exp • ${trainer.hourlyRate}/hr
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {trainer.specialties.slice(0, 2).map((specialty) => (
                              <span key={specialty} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        {trainer.connectionStatus === 'none' && (
                          <Button 
                            size="sm" 
                            onClick={() => connectWithTrainer(trainer.id)}
                            className="flex-1"
                          >
                            Connect
                          </Button>
                        )}
                        {trainer.connectionStatus === 'pending' && (
                          <Button size="sm" variant="outline" className="flex-1" disabled>
                            Pending
                          </Button>
                        )}
                        {trainer.connectionStatus === 'connected' && (
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Library</CardTitle>
              <CardDescription>Share and discover training resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{resource.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            resource.type === 'workout' ? 'bg-blue-100 text-blue-800' :
                            resource.type === 'nutrition' ? 'bg-green-100 text-green-800' :
                            resource.type === 'education' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {resource.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>By {resource.author}</span>
                          <span>{resource.downloads} downloads</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            <span>{resource.rating}</span>
                          </div>
                          <span>{resource.createdAt}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Bookmark className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="p-6 bg-white rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Share with Community</h3>
            <div className="space-y-4">
              <div>
                <Label>What's on your mind?</Label>
                <textarea
                  className="w-full p-3 border rounded-md resize-none"
                  rows={4}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your fitness insights, tips, or achievements..."
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={addPost} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
                <Button variant="outline" onClick={() => setShowNewPost(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 