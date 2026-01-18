import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Trophy, Flame, Medal } from 'lucide-react';

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

interface LeaderboardProps {
  currentUserStreak: number;
}

export function Leaderboard({ currentUserStreak }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-gray-500 font-semibold">#{rank}</span>;
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Top Streaks
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Longest current streaks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {mockLeaderboardData
              .sort((a, b) => b.streak - a.streak)
              .slice(0, 3)
              .map((user, idx) => (
                <div
                  key={user.id}
                  className={`text-center ${idx === 0 ? 'order-2' : idx === 1 ? 'order-1' : 'order-3'}`}
                >
                  <div className={`mb-2 ${idx === 0 ? 'scale-110' : ''}`}>
                    <Avatar className={`mx-auto mb-2 border-2 ${idx === 0 ? 'border-yellow-500' : idx === 1 ? 'border-gray-400' : 'border-amber-600'}`}>
                      <AvatarFallback className={
                        idx === 0 ? 'bg-yellow-500 text-black' :
                        idx === 1 ? 'bg-gray-400 text-black' :
                        'bg-amber-600 text-black'
                      }>
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-2xl mb-1">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </div>
                  </div>
                  <p className="text-sm font-semibold truncate text-white">{user.username}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <p className="text-xs text-zinc-300">{user.streak} days</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <CardTitle>Streak Leaderboard</CardTitle>
          </div>
          <CardDescription>Ranked by current streak</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockLeaderboardData
            .sort((a, b) => b.streak - a.streak)
            .map((user, idx) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  user.username === 'you'
                    ? 'bg-zinc-800 border-zinc-600'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <div className="w-8 flex justify-center">
                  {getRankIcon(idx + 1)}
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-zinc-700 text-white">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold flex items-center gap-2 text-white">
                    {user.username}
                    {user.username === 'you' && (
                      <Badge variant="secondary" className="text-xs bg-zinc-700 text-white">You</Badge>
                    )}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {user.totalDistance}km total
                  </p>
                </div>
                <div className="text-right flex items-center gap-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <p className="font-bold text-orange-500 text-lg">{user.streak}</p>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}