import { useState } from 'react'; // ADD THIS
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Trophy, Flame, Medal, X } from 'lucide-react';
// IMPORT DIALOG COMPONENTS
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';

interface LeaderboardUser {
  id: number;
  username: string;
  streak: number;
  totalDistance: number;
  rank: number;
}

const mockLeaderboardData: LeaderboardUser[] = [
  { id: 1, username: 'sarah_runs', streak: 23, totalDistance: 187.5, rank: 1 },
  { id: 2, username: 'mike_walker', streak: 18, totalDistance: 165.2, rank: 2 },
  { id: 3, username: 'alex_fit', streak: 15, totalDistance: 142.8, rank: 3 },
  { id: 4, username: 'emma_steps', streak: 12, totalDistance: 128.4, rank: 4 },
  { id: 5, username: 'you', streak: 7, totalDistance: 98.6, rank: 5 },
  { id: 6, username: 'john_active', streak: 9, totalDistance: 89.3, rank: 6 },
  { id: 7, username: 'lisa_jogs', streak: 6, totalDistance: 76.5, rank: 7 },
];

export function Leaderboard({ currentUserStreak }: { currentUserStreak: number }) {
  // 1. ADD STATE TO TRACK SELECTED USER
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-gray-500 font-semibold">#{rank}</span>;
    }
  };

  const getInitials = (username: string) => username.substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Top 3 Podium (Clickable) */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Top Streaks
          </CardTitle>
          <CardDescription className="text-zinc-400">Longest current streaks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {mockLeaderboardData
              .sort((a, b) => b.streak - a.streak)
              .slice(0, 3)
              .map((user, idx) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)} // CLICK TO OPEN
                  className={`text-center cursor-pointer hover:opacity-80 transition ${idx === 0 ? 'order-2' : idx === 1 ? 'order-1' : 'order-3'}`}
                >
                  <div className={`mb-2 ${idx === 0 ? 'scale-110' : ''}`}>
                    <Avatar className={`mx-auto mb-2 border-2 ${idx === 0 ? 'border-yellow-500' : idx === 1 ? 'border-gray-400' : 'border-amber-600'}`}>
                      <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                    <div className="text-2xl mb-1">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                  </div>
                  <p className="text-sm font-semibold truncate text-white">{user.username}</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard List (Clickable) */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-white">Streak Leaderboard</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockLeaderboardData.map((user, idx) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)} // CLICK TO OPEN
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition active:scale-95 ${
                user.username === 'you' ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="w-8 flex justify-center">{getRankIcon(idx + 1)}</div>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-zinc-700 text-white">{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-white">{user.username}</p>
                <p className="text-sm text-zinc-400">{user.totalDistance}km</p>
              </div>
              <div className="text-right flex items-center gap-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <p className="font-bold text-orange-500 text-lg">{user.streak}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 2. THE ACCOUNT POP-UP (DIALOG) */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm rounded-3xl">
          <DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <Avatar className="w-24 h-24 border-4 border-orange-500">
                <AvatarFallback className="text-2xl bg-zinc-800">
                  {selectedUser ? getInitials(selectedUser.username) : ''}
                </AvatarFallback>
              </Avatar>
              <DialogTitle className="text-2xl font-black">
                {selectedUser?.username}
              </DialogTitle>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-orange-500 font-bold text-xl">{selectedUser?.streak}</p>
                  <p className="text-xs text-zinc-500 uppercase">Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-xl">{selectedUser?.totalDistance}</p>
                  <p className="text-xs text-zinc-500 uppercase">KM</p>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          {/* PHOTO GRID IDEA */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-zinc-800 rounded-xl overflow-hidden relative border border-zinc-700">
                <img 
                  src={`https://picsum.photos/seed/${selectedUser?.id}${i}/300`} 
                  alt="Activity" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}