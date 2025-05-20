import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircleCheck, Flame, Award, Zap, Trophy, Calendar, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Badge types with their criteria
const BADGES = [
  { 
    id: 'streak_3', 
    name: 'Quick Learner', 
    icon: <Flame className="h-4 w-4 text-orange-500" />, 
    description: '3-day streak',
    criteria: 'streakCount >= 3'
  },
  { 
    id: 'streak_7', 
    name: 'Consistent', 
    icon: <Flame className="h-4 w-4 text-orange-500" />, 
    description: '7-day streak',
    criteria: 'streakCount >= 7'
  },
  { 
    id: 'points_100', 
    name: 'Centurion', 
    icon: <Award className="h-4 w-4 text-purple-500" />, 
    description: '100 points earned',
    criteria: 'points >= 100'
  },
  { 
    id: 'points_500', 
    name: 'Expert', 
    icon: <Award className="h-4 w-4 text-blue-500" />, 
    description: '500 points earned',
    criteria: 'points >= 500'
  },
  { 
    id: 'completed_5', 
    name: 'Trailblazer', 
    icon: <Zap className="h-4 w-4 text-yellow-500" />, 
    description: 'Completed 5 topics',
    criteria: 'completedTopics >= 5'
  },
  { 
    id: 'completed_10', 
    name: 'Salesforce Ranger', 
    icon: <Trophy className="h-4 w-4 text-green-500" />, 
    description: 'Completed 10 topics',
    criteria: 'completedTopics >= 10'
  },
];

const GameProgress: React.FC = () => {
  const [progress, setProgress] = useState({
    points: 320,
    streakCount: 4,
    completedTopics: 3,
    nextLevelThreshold: 500,
    currentLevel: 3,
    weeklyGoalCompleted: 60, // percentage completed
    dailyActivityDone: true
  });
  
  const [showNewBadge, setShowNewBadge] = useState<string | null>(null);
  const [showMilestone, setShowMilestone] = useState(false);
  
  // Calculate earned badges based on progress
  const earnedBadges = BADGES.filter(badge => {
    // Convert the criteria string to an actual boolean check
    const criteriaCheck = new Function('streakCount', 'points', 'completedTopics', 
      `return ${badge.criteria};`);
    return criteriaCheck(progress.streakCount, progress.points, progress.completedTopics);
  });
  
  // Demo: Show a newly earned badge notification on first render
  useEffect(() => {
    // Simulate earning a new badge after 3 seconds
    const timer = setTimeout(() => {
      setShowNewBadge('streak_3');
      toast.success('New badge earned: Quick Learner!');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Demo: Show milestone reached notification
  useEffect(() => {
    // Simulate reaching a milestone after 8 seconds
    const timer = setTimeout(() => {
      setShowMilestone(true);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update streak if user performs daily activity
  const claimDailyStreak = () => {
    if (!progress.dailyActivityDone) return;
    
    setProgress(prev => ({
      ...prev,
      streakCount: prev.streakCount + 1,
      points: prev.points + 25,
      dailyActivityDone: false
    }));
    
    toast.success('Streak extended! +25 points');
  };
  
  return (
    <Card className="relative overflow-hidden border-primary/20">
      {/* Celebration overlay for milestones */}
      {showMilestone && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 flex flex-col items-center justify-center z-10 backdrop-blur-sm"
          onClick={() => setShowMilestone(false)}
        >
          <div className="text-center bg-card p-6 rounded-lg shadow-xl border border-primary/20 animate-in fade-in-0 slide-in-from-bottom-10 duration-500">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">You're on fire!</h3>
            <p className="text-sm text-muted-foreground mb-4">You've maintained a streak for 4 days 🔥</p>
            <Button variant="default" onClick={() => setShowMilestone(false)}>
              Continue Learning
            </Button>
          </div>
        </div>
      )}
    
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Your Progress
          </span>
          <Badge variant="outline" className="text-primary border-primary/20 font-normal">
            Level {progress.currentLevel}
          </Badge>
        </CardTitle>
        <CardDescription>
          Keep learning to earn points and badges
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Points and Level Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{progress.points} points</span>
            <span className="text-muted-foreground">{progress.nextLevelThreshold} points for level {progress.currentLevel + 1}</span>
          </div>
          <Progress value={(progress.points / progress.nextLevelThreshold) * 100} className="h-2" />
        </div>
        
        {/* Learning Streak */}
        <div className="border border-border rounded-lg p-3 bg-background/50">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Learning Streak</span>
            </div>
            <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-none">
              {progress.streakCount} days
            </Badge>
          </div>
          
          <div className="flex gap-1.5 mb-3">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex-1 h-2 rounded-full",
                  i < progress.streakCount ? "bg-orange-500" : "bg-muted"
                )}
              />
            ))}
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" /> 
              {progress.dailyActivityDone ? "Daily activity completed" : "Come back tomorrow"}
            </span>
            <Button 
              size="sm" 
              variant={progress.dailyActivityDone ? "outline" : "secondary"} 
              className={progress.dailyActivityDone ? "border-dashed" : "opacity-50 cursor-not-allowed"}
              onClick={claimDailyStreak}
              disabled={!progress.dailyActivityDone}
            >
              <CircleCheck className="h-4 w-4 mr-1" />
              {progress.dailyActivityDone ? "Claim" : "Claimed"}
            </Button>
          </div>
        </div>
        
        {/* Weekly Goal */}
        <div className="border border-border rounded-lg p-3 bg-background/50">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Weekly Goal</span>
            </div>
            <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none">
              {progress.weeklyGoalCompleted}% complete
            </Badge>
          </div>
          <Progress value={progress.weeklyGoalCompleted} className="h-2" />
        </div>
        
        {/* Earned Badges */}
        <div>
          <h4 className="text-sm font-medium mb-2">Earned Badges ({earnedBadges.length}/{BADGES.length})</h4>
          <div className="flex flex-wrap gap-2">
            {BADGES.map(badge => {
              const isEarned = earnedBadges.some(earned => earned.id === badge.id);
              const isNewlyEarned = badge.id === showNewBadge;
              
              return (
                <div 
                  key={badge.id}
                  className={cn(
                    "relative border rounded-full p-1.5 transition-all duration-300",
                    isEarned 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-muted/30 border-border opacity-50 grayscale",
                    isNewlyEarned && "ring-2 ring-primary ring-offset-2 animate-pulse"
                  )}
                  title={`${badge.name}: ${badge.description}`}
                >
                  <div className="h-7 w-7 flex items-center justify-center">
                    {badge.icon}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameProgress;
