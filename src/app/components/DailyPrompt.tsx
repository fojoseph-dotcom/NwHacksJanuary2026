import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Bell, Camera, Clock, MapPin, Flame } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Progress } from '@/app/components/ui/progress';

interface DailyPromptProps {
  onStartActivity: () => void;
  streak: number;
  todayCompleted: boolean;
}

export function DailyPrompt({ onStartActivity, streak, todayCompleted }: DailyPromptProps) {
  const [timeRemaining, setTimeRemaining] = useState('5:42:18');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20000); // 20 seconds for testing
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(23, 59, 59);
      
      const diff = deadline.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1000);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  useEffect(() => {
    setProgress((timeLeft / 20000) * 100);
  }, [timeLeft]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Countdown Timer */}
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <CardTitle>Today's Challenge</CardTitle>
            </div>
            {isActive && (
              <Badge variant="destructive" className="bg-red-600">
                <Clock className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
          <CardDescription>Complete before time runs out!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <div className="text-center">
              <p className="text-sm text-zinc-400 mb-2">Time Remaining</p>
              <div className="text-5xl font-bold tracking-tight mb-2 text-white">
                {formatTime(timeLeft)}
              </div>
              <Progress 
                value={progress} 
                className="h-2 mt-4"
              />
            </div>
          </div>

          {todayCompleted ? (
            <div className="text-center py-8">
              <div className="mb-4 text-6xl">🎉</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Great Work!</h3>
              <p className="text-zinc-400">You've completed today's challenge. Come back tomorrow!</p>
            </div>
          ) : (
            <>
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2 rounded-full">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Distance Goal</p>
                    <p className="text-2xl font-bold text-indigo-400">2.0 km</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2 rounded-full">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">+ Photo Verification</p>
                    <p className="text-sm text-zinc-400">Snap a pic during your workout</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => {
                  onStartActivity();
                  setIsActive(true);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg h-12"
              >
                Start Activity
              </Button>

              <p className="text-xs text-center text-zinc-500">
                Walking & Running available now • More categories coming soon
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Motivational Section */}
      {!todayCompleted && (
        <div className="relative rounded-lg overflow-hidden h-48">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758520706103-41d01f815640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwZml0bmVzc3xlbnwxfHx8fDE3Njg1NjE3OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Fitness motivation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <p className="text-white text-xl font-semibold text-center px-4">
              Don't break the streak!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}