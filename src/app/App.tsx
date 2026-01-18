import { useState } from 'react';
import { LoginScreen } from '@/app/components/LoginScreen';
import { DailyPrompt } from '@/app/components/DailyPrompt';
import { ActivityRecorder } from '@/app/components/ActivityRecorder';
import { Leaderboard } from '@/app/components/Leaderboard';
import { Profile } from '@/app/components/Profile';
import { Social } from '@/app/components/Social';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Home, Trophy, User, Footprints, Users } from 'lucide-react';
import { Toaster } from '@/app/components/ui/sonner';
import { Badge } from '@/app/components/ui/badge';
import { Flame } from 'lucide-react';

interface Activity {
  id: number;
  date: string;
  type: 'walking' | 'running';
  distance: number;
  photoUrl: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'recording'>('home');
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      date: '2026-01-10',
      type: 'running',
      distance: 2.5,
      photoUrl: 'https://images.unsplash.com/photo-1709133636649-7cb8959ddcb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwam9nZ2luZ3xlbnwxfHx8fDE3Njg2ODYwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      date: '2026-01-11',
      type: 'walking',
      distance: 3.2,
      photoUrl: 'https://images.unsplash.com/photo-1741676516502-69250deb38ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGV4ZXJjaXNlfGVufDF8fHx8MTc2ODY4NjAzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      date: '2026-01-12',
      type: 'running',
      distance: 2.8,
      photoUrl: 'https://images.unsplash.com/photo-1758520706103-41d01f815640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwZml0bmVzc3xlbnwxfHx8fDE3Njg1NjE3OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      date: '2026-01-13',
      type: 'walking',
      distance: 2.1,
      photoUrl: 'https://images.unsplash.com/photo-1709133636649-7cb8959ddcb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwam9nZ2luZ3xlbnwxfHx8fDE3Njg2ODYwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 5,
      date: '2026-01-14',
      type: 'running',
      distance: 4.0,
      photoUrl: 'https://images.unsplash.com/photo-1741676516502-69250deb38ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGV4ZXJjaXNlfGVufDF8fHx8MTc2ODY4NjAzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      date: '2026-01-15',
      type: 'walking',
      distance: 2.2,
      photoUrl: 'https://images.unsplash.com/photo-1758520706103-41d01f815640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwZml0bmVzc3xlbnwxfHx8fDE3Njg1NjE3OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 7,
      date: '2026-01-16',
      type: 'running',
      distance: 3.5,
      photoUrl: 'https://images.unsplash.com/photo-1709133636649-7cb8959ddcb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwam9nZ2luZ3xlbnwxfHx8fDE3Njg2ODYwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ]);
  const [streak, setStreak] = useState(7);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setCurrentView('home');
    setActiveTab('home');
  };

  const handleStartActivity = () => {
    setCurrentView('recording');
  };

  const handleCancelActivity = () => {
    setCurrentView('home');
  };

  const handleCompleteActivity = (distance: number, photoUrl: string, activityType: string) => {
    const newActivity: Activity = {
      id: activities.length + 1,
      date: new Date().toISOString(),
      type: activityType as 'walking' | 'running',
      distance,
      photoUrl,
    };

    setActivities([newActivity, ...activities]);
    setStreak(streak + 1);
    setTodayCompleted(true);
    setCurrentView('home');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Toaster />
      
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">SnapFit</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-zinc-800 border border-zinc-700">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-white">{streak} day streak</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {currentView === 'recording' ? (
          <ActivityRecorder
            onComplete={handleCompleteActivity}
            onCancel={handleCancelActivity}
            targetDistance={2.0}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Board</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <DailyPrompt
                onStartActivity={handleStartActivity}
                streak={streak}
                todayCompleted={todayCompleted}
              />
            </TabsContent>

            <TabsContent value="social">
              <Social
                currentUsername={username}
                currentStreak={streak}
              />
            </TabsContent>

            <TabsContent value="leaderboard">
              <Leaderboard currentUserStreak={streak} />
            </TabsContent>

            <TabsContent value="profile">
              <Profile
                username={username}
                streak={streak}
                activities={activities}
                onLogout={handleLogout}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Info Banner */}
      {currentView === 'home' && !todayCompleted && (
        <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 text-center text-sm">
          <p>⚡ Daily challenge resets at midnight • Don't break your streak!</p>
        </div>
      )}
    </div>
  );
}