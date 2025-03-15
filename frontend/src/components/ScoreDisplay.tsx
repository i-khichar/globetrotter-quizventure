
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Trophy, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ScoreDisplay: React.FC = () => {
  const { score, streak } = useGame();

  // Milestone is set at every 100 points
  const currentMilestone = Math.floor(score / 100) * 100;
  const nextMilestone = currentMilestone + 100;
  const progress = ((score - currentMilestone) / (nextMilestone - currentMilestone)) * 100;

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg p-4 flex flex-col space-y-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="font-medium text-gray-700">Score</span>
        </div>
        <span className="text-2xl font-bold text-primary">{score}</span>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{currentMilestone}</span>
          <span>{nextMilestone}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {streak > 0 && (
        <div className="flex items-center justify-between mt-2 bg-amber-50 border border-amber-100 rounded-md p-2">
          <div className="flex items-center">
            <Flame className="w-4 h-4 text-amber-500 mr-1.5" />
            <span className="text-sm font-medium text-amber-700">Streak</span>
          </div>
          <div className="flex items-center">
            <span className="text-amber-700 font-bold">{streak}×</span>
            {streak > 1 && (
              <span className="text-xs bg-amber-200 text-amber-800 rounded px-1 ml-1.5">
                +{(streak - 1) * 2} bonus
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
