import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { Camera, Check, Upload, X, Lock, Play, Pause, Square, MapPin, Timer, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface ActivityRecorderProps {
  onComplete: (distance: number, photoUrl: string, activityType: string) => void;
  onCancel: () => void;
  targetDistance: number;
}

type TrackingState = 'idle' | 'tracking' | 'paused' | 'finished';

export function ActivityRecorder({ onComplete, onCancel, targetDistance }: ActivityRecorderProps) {
  const [activityType, setActivityType] = useState<'walking' | 'running' | null>(null);
  const [trackingState, setTrackingState] = useState<TrackingState>('idle');
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trackingIntervalRef = useRef<number | null>(null);
  const timeIntervalRef = useRef<number | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!activityType) {
      toast.error('Please select an activity type');
      return;
    }
    
    if (distance < targetDistance) {
      toast.error(`You need to complete at least ${targetDistance}km`);
      return;
    }

    if (!photo) {
      toast.error('Please upload a photo of your workout');
      return;
    }

    toast.success('Activity completed! 🎉');
    onComplete(distance, photo, activityType);
  };

  const startTracking = () => {
    setTrackingState('tracking');
    toast.success('GPS tracking started');
    
    // Simulate GPS distance tracking
    // In production, this would use Geolocation API
    const speed = activityType === 'running' ? 0.002 : 0.001; // km per second
    trackingIntervalRef.current = window.setInterval(() => {
      setDistance((prev) => {
        const newDistance = prev + speed;
        return Math.round(newDistance * 100) / 100; // Round to 2 decimals
      });
    }, 100);
    
    // Track elapsed time
    timeIntervalRef.current = window.setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const pauseTracking = () => {
    setTrackingState('paused');
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
  };

  const resumeTracking = () => {
    setTrackingState('tracking');
    const speed = activityType === 'running' ? 0.002 : 0.001;
    trackingIntervalRef.current = window.setInterval(() => {
      setDistance((prev) => {
        const newDistance = prev + speed;
        return Math.round(newDistance * 100) / 100;
      });
    }, 100);
    
    timeIntervalRef.current = window.setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTracking = () => {
    setTrackingState('finished');
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = Math.min((distance / targetDistance) * 100, 100);
  const pace = elapsedTime > 0 && distance > 0 ? (elapsedTime / 60) / distance : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Record Activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            {trackingState === 'idle' ? 'Select your activity type' : `Complete ${targetDistance}km and upload a photo`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activity Type Selection */}
          {!activityType && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold">Select Activity Type</span>
              </div>
              
              {/* Available Categories */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-24 text-lg flex-col gap-2 hover:bg-indigo-50 hover:border-indigo-300"
                  onClick={() => setActivityType('walking')}
                >
                  <span className="text-3xl">🚶‍♂️</span>
                  <span>Walking</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 text-lg flex-col gap-2 hover:bg-indigo-50 hover:border-indigo-300"
                  onClick={() => setActivityType('running')}
                >
                  <span className="text-3xl">🏃‍♂️</span>
                  <span>Running</span>
                </Button>
              </div>

              {/* Coming Soon Categories */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Coming Soon</span>
                  <Badge variant="secondary" className="text-xs">Future Release</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 text-base flex-col gap-1 opacity-50 cursor-not-allowed relative"
                    disabled
                  >
                    <Lock className="w-3 h-3 absolute top-2 right-2 text-gray-400" />
                    <span className="text-2xl">🏊‍♂️</span>
                    <span>Swimming</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 text-base flex-col gap-1 opacity-50 cursor-not-allowed relative"
                    disabled
                  >
                    <Lock className="w-3 h-3 absolute top-2 right-2 text-gray-400" />
                    <span className="text-2xl">🚴‍♂️</span>
                    <span>Cycling</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 text-base flex-col gap-1 opacity-50 cursor-not-allowed relative"
                    disabled
                  >
                    <Lock className="w-3 h-3 absolute top-2 right-2 text-gray-400" />
                    <span className="text-2xl">💪</span>
                    <span>Strength</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 text-base flex-col gap-1 opacity-50 cursor-not-allowed relative"
                    disabled
                  >
                    <Lock className="w-3 h-3 absolute top-2 right-2 text-gray-400" />
                    <span className="text-2xl">🧘‍♀️</span>
                    <span>Yoga</span>
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center pt-1">
                  Swimming, Cycling, Strength & Yoga tracking in development
                </p>
              </div>
            </div>
          )}

          {/* Tracking Interface */}
          {activityType && trackingState !== 'finished' && (
            <>
              {/* Activity Type Badge */}
              <div className="flex items-center justify-between">
                <Badge className="text-sm px-3 py-1">
                  {activityType === 'running' ? '🏃‍♂️' : '🚶‍♂️'} {activityType === 'running' ? 'Running' : 'Walking'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  GPS Tracking {trackingState === 'tracking' ? '🟢' : '⏸️'}
                </Badge>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Goal Progress</span>
                  <span className="font-semibold">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                {distance >= targetDistance && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Distance goal achieved!
                  </p>
                )}
              </div>

              {/* Main Stats Display */}
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-zinc-400 mb-1">Distance Tracked</p>
                  <p className="text-5xl font-bold text-indigo-400">{distance.toFixed(2)}</p>
                  <p className="text-xl text-zinc-500">km</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-zinc-400 mb-1">
                      <Timer className="w-4 h-4" />
                      <p className="text-xs">Time</p>
                    </div>
                    <p className="text-xl font-semibold text-white">{formatTime(elapsedTime)}</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-zinc-400 mb-1">
                      <MapPin className="w-4 h-4" />
                      <p className="text-xs">Pace</p>
                    </div>
                    <p className="text-xl font-semibold text-white">{pace > 0 ? pace.toFixed(1) : '0.0'}</p>
                    <p className="text-xs text-zinc-500">min/km</p>
                  </div>
                </div>
              </div>

              {/* Tracking Controls */}
              <div className="grid grid-cols-2 gap-3">
                {trackingState === 'idle' && (
                  <Button
                    onClick={startTracking}
                    className="col-span-2 bg-green-600 hover:bg-green-700 h-14 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Tracking
                  </Button>
                )}
                
                {trackingState === 'tracking' && (
                  <>
                    <Button
                      onClick={pauseTracking}
                      variant="outline"
                      className="h-14 text-lg border-2"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                    <Button
                      onClick={stopTracking}
                      className="bg-red-600 hover:bg-red-700 h-14 text-lg"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Stop
                    </Button>
                  </>
                )}

                {trackingState === 'paused' && (
                  <>
                    <Button
                      onClick={resumeTracking}
                      className="bg-green-600 hover:bg-green-700 h-14 text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </Button>
                    <Button
                      onClick={stopTracking}
                      className="bg-red-600 hover:bg-red-700 h-14 text-lg"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Finish
                    </Button>
                  </>
                )}
              </div>

              <p className="text-xs text-center text-gray-500">
                Using GPS location API to track your movement
              </p>
            </>
          )}

          {/* Photo Upload & Submit (after finishing tracking) */}
          {activityType && trackingState === 'finished' && (
            <>
              {/* Final Stats */}
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <p className="text-sm text-zinc-400 mb-2">Activity Summary</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500">Distance</p>
                    <p className="text-xl font-bold text-indigo-400">{distance.toFixed(2)} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Time</p>
                    <p className="text-xl font-bold text-indigo-400">{formatTime(elapsedTime)}</p>
                  </div>
                </div>
                {distance >= targetDistance ? (
                  <Badge className="mt-2 bg-green-600">
                    <Check className="w-3 h-3 mr-1" />
                    Goal Completed
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="mt-2">
                    {(targetDistance - distance).toFixed(2)}km short of goal
                  </Badge>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold">Workout Verification Photo</span>
                  {photo && <Check className="w-4 h-4 text-green-600" />}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {!photo ? (
                  <Button
                    variant="outline"
                    className="w-full h-32 border-dashed border-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Take a photo of your workout</p>
                      <p className="text-xs text-gray-400 mt-1">Required for verification</p>
                    </div>
                  </Button>
                ) : (
                  <div className="relative">
                    <img
                      src={photo}
                      alt="Workout"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Change Photo
                    </Button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg"
                disabled={!photo || distance < targetDistance}
              >
                {distance >= targetDistance ? 'Complete Activity' : 'Need More Distance'}
              </Button>

              {/* Restart Button */}
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setActivityType(null);
                  setTrackingState('idle');
                  setDistance(0);
                  setElapsedTime(0);
                  setPhoto(null);
                }}
              >
                Start New Activity
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}