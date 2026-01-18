import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Flame, MapPin, Calendar, TrendingUp, LogOut, Award, Target } from 'lucide-react';

interface Activity {
  id: number;
  date: string;
  type: 'walking' | 'running';
  distance: number;
  photoUrl: string;
}

interface ProfileProps {
  username: string;
  streak: number;
  activities: Activity[];
  goal: number;
  onLogout: () => void;
}

export function Profile({ username, streak, activities, goal: initialGoal = 0, onLogout }: ProfileProps) {
  const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
  const [goal, setGoal] = useState(initialGoal); //Can now call setGoal(new_value) to set a new goal
  const totalActivities = activities.length;
  const weeklyDistance = activities
    .filter(activity => {
      const activityDate = new Date(activity.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate >= weekAgo;
    })
    .reduce((sum, activity) => sum + activity.distance, 0);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-indigo-600 text-white text-2xl">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{username}</h2>
              <p className="text-gray-500">Member since Jan 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-orange-500">{streak}</p>
              <p className="text-xs text-zinc-400">Day Streak</p>
            </div>
            <div className="text-center p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-400">{totalDistance.toFixed(1)}</p>
              <p className="text-xs text-zinc-400">Total km</p>
            </div>
            <div className="text-center p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
              <Calendar className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-400">{totalActivities}</p>
              <p className="text-xs text-zinc-400">Activities</p>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>This Week</CardTitle>
          <CardDescription>Your weekly performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-indigo-400" />
              <div>
                <p className="font-semibold text-white">Weekly Distance</p>
                <p className="text-sm text-zinc-400">Last 7 days</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-indigo-400">{weeklyDistance.toFixed(1)}km</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <p className="font-semibold text-white">Completion Rate</p>
                <p className="text-sm text-zinc-400">This week</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-400">100%</p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
              <div className="text-3xl mb-1">🔥</div>
              <p className="text-xs font-semibold text-white">7 Day Streak</p>
            </div>
            <div className="text-center p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
              <div className="text-3xl mb-1">💯</div>
              <p className="text-xs font-semibold text-white">Perfect Week</p>
            </div>
            <div className="text-center p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
              <div className="text-3xl mb-1">🏃</div>
              <p className="text-xs font-semibold text-white">First Run</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-rows-2 gap-2">
            <div className="text-center p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
            <p className="text-center font-bold text-white">Current goal: {goal}.0 (Km)</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                 <button onClick={() => {
                      setGoal((goal + 5))}}
                      >Increase goal by 5.0</button>
                </div>
                <div className="text-center p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                  <button onClick={() => {
                      if (goal > 5 + initialGoal) {
                          setGoal(goal - 5);
                     } else {
                          setGoal(initialGoal)
                      }
                  }}>Decrease goal by 5.0</button>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your latest workouts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-center text-zinc-400 py-8">
              No activities yet. Complete your first challenge!
            </p>
          ) : (
            activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                <img
                  src={activity.photoUrl}
                  alt="Activity"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold flex items-center gap-2 text-white">
                    {activity.type === 'running' ? '🏃‍♂️' : '🚶‍♂️'}
                    {activity.type === 'running' ? 'Running' : 'Walking'}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {activity.distance.toFixed(1)}km • {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-600 text-white">
                  Complete
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}