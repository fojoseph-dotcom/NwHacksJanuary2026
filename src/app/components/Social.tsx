import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { 
  UserPlus, 
  Users, 
  Bell, 
  Search, 
  Check, 
  X, 
  Flame,
  TrendingUp,
  Calendar,
  Trophy
} from 'lucide-react';
import { toast } from 'sonner';

interface Friend {
  id: string;
  username: string;
  streak: number;
  totalDistance: number;
  lastActive: string;
  recentActivity?: {
    type: 'walking' | 'running';
    distance: number;
    date: string;
  };
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface SocialProps {
  currentUsername: string;
  currentStreak: number;
}

// Mock data - in production, this would come from a backend/storage API
const mockFriends: Friend[] = [
  {
    id: '1',
    username: 'sarah_runs',
    streak: 23,
    totalDistance: 187.5,
    lastActive: '2 hours ago',
    recentActivity: {
      type: 'running',
      distance: 3.2,
      date: '2026-01-17'
    }
  },
  {
    id: '2',
    username: 'mike_walker',
    streak: 18,
    totalDistance: 165.2,
    lastActive: '5 hours ago',
    recentActivity: {
      type: 'walking',
      distance: 2.5,
      date: '2026-01-17'
    }
  },
  {
    id: '3',
    username: 'alex_fit',
    streak: 15,
    totalDistance: 142.8,
    lastActive: '1 day ago',
  }
];

const mockPendingRequests: FriendRequest[] = [
  {
    id: '1',
    fromUserId: '101',
    fromUsername: 'emma_steps',
    toUserId: 'you',
    status: 'pending',
    createdAt: '2026-01-16'
  },
  {
    id: '2',
    fromUserId: '102',
    fromUsername: 'john_active',
    toUserId: 'you',
    status: 'pending',
    createdAt: '2026-01-15'
  }
];

export function Social({ currentUsername, currentStreak }: SocialProps) {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>(mockPendingRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API search delay
    setTimeout(() => {
      // Mock search results - in production, this would be an API call
      const mockResults = [
        'lisa_jogs',
        'kevin_fitness',
        'rachel_runs'
      ].filter(user => 
        user.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !friends.find(f => f.username === user) &&
        user !== currentUsername
      );
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const sendFriendRequest = (username: string) => {
    toast.success(`Friend request sent to ${username}!`);
    setSearchResults(searchResults.filter(u => u !== username));
  };

  const acceptRequest = (requestId: string, username: string) => {
    // Add to friends list
    const newFriend: Friend = {
      id: Date.now().toString(),
      username: username,
      streak: Math.floor(Math.random() * 20),
      totalDistance: Math.floor(Math.random() * 150),
      lastActive: 'Just now'
    };
    setFriends([...friends, newFriend]);
    
    // Remove from pending requests
    setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
    toast.success(`You're now friends with ${username}!`);
  };

  const rejectRequest = (requestId: string, username: string) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
    toast.info(`Friend request from ${username} declined`);
  };

  const removeFriend = (friendId: string, username: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
    toast.info(`Removed ${username} from friends`);
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 border-0">
        <CardContent className="pt-6">
          <div className="text-center text-white">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-90" />
            <h2 className="text-3xl font-bold mb-1">{friends.length}</h2>
            <p className="text-indigo-100">Active Friends</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Friends</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2 relative">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Requests</span>
            {pendingRequests.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </TabsTrigger>
        </TabsList>

        {/* Friends List */}
        <TabsContent value="friends" className="space-y-4 mt-4">
          {friends.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                <h3 className="text-lg font-semibold mb-2 text-white">No friends yet</h3>
                <p className="text-zinc-400 mb-4">
                  Add friends to compare streaks and motivate each other!
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friends
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Friends Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Friends Leaderboard
                  </CardTitle>
                  <CardDescription>Ranked by current streak</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[...friends]
                    .sort((a, b) => b.streak - a.streak)
                    .map((friend, idx) => (
                      <div
                        key={friend.id}
                        className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
                      >
                        <div className="w-6 text-center font-bold text-zinc-500">
                          #{idx + 1}
                        </div>
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-zinc-700 text-white">
                            {getInitials(friend.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{friend.username}</p>
                          <p className="text-sm text-zinc-400">
                            {friend.totalDistance.toFixed(1)}km total
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="w-5 h-5 text-orange-500" />
                          <p className="font-bold text-orange-500 text-lg">{friend.streak}</p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>What your friends are up to</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {friends
                    .filter(f => f.recentActivity)
                    .map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-indigo-600 text-white">
                            {getInitials(friend.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-white">
                            {friend.username}
                          </p>
                          <p className="text-sm text-zinc-400">
                            {friend.recentActivity?.type === 'running' ? '🏃‍♂️' : '🚶‍♂️'}{' '}
                            Completed {friend.recentActivity?.distance}km {friend.recentActivity?.type}
                          </p>
                          <p className="text-xs text-zinc-500">{friend.lastActive}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-600 text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Done
                        </Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* All Friends List */}
              <Card>
                <CardHeader>
                  <CardTitle>All Friends ({friends.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-zinc-700 text-white">
                          {getInitials(friend.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{friend.username}</p>
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            {friend.streak} days
                          </span>
                          <span>•</span>
                          <span>{friend.lastActive}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFriend(friend.id, friend.username)}
                        className="text-zinc-400 hover:text-red-500"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Friend Requests */}
        <TabsContent value="requests" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Pending Requests
              </CardTitle>
              <CardDescription>
                {pendingRequests.length} pending friend request{pendingRequests.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                  <p className="text-zinc-400">No pending requests</p>
                </div>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {getInitials(request.fromUsername)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{request.fromUsername}</p>
                      <p className="text-sm text-zinc-400">
                        Sent {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => acceptRequest(request.id, request.fromUsername)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectRequest(request.id, request.fromUsername)}
                        className="border-zinc-700"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Friends */}
        <TabsContent value="add" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find Friends
              </CardTitle>
              <CardDescription>Search by username to add friends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Search Results:</p>
                  {searchResults.map((username) => (
                    <div
                      key={username}
                      className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-zinc-700 text-white">
                          {getInitials(username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{username}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => sendFriendRequest(username)}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suggested Friends */}
          <Card>
            <CardHeader>
              <CardTitle>Suggested Friends</CardTitle>
              <CardDescription>People you might know</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {['tom_fitness', 'jenny_runs', 'mark_active'].map((username) => (
                <div
                  key={username}
                  className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-zinc-700 text-white">
                      {getInitials(username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{username}</p>
                    <p className="text-xs text-zinc-400">Popular in your area</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sendFriendRequest(username)}
                    className="border-zinc-700"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}