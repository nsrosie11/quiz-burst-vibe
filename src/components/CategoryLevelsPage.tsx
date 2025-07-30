import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Star, Trophy, Lock, Play, CheckCircle } from "lucide-react";

interface Level {
  id: number;
  name: string;
  status: 'done' | 'current' | 'locked';
  points: number;
  maxPoints: number;
}

interface CategoryLevelsPageProps {
  category: {
    id: string;
    name: string;
    icon: string;
  };
  onBack: () => void;
  onStartLevel: (categoryId: string, levelId: number) => void;
}

const CategoryLevelsPage = ({ category, onBack, onStartLevel }: CategoryLevelsPageProps) => {
  // Mock data for levels
  const levels: Level[] = [
    { id: 1, name: "Level 1", status: 'done', points: 100, maxPoints: 100 },
    { id: 2, name: "Level 2", status: 'done', points: 85, maxPoints: 100 },
    { id: 3, name: "Level 3", status: 'done', points: 95, maxPoints: 100 },
    { id: 4, name: "Level 4", status: 'current', points: 0, maxPoints: 100 },
    { id: 5, name: "Level 5", status: 'locked', points: 0, maxPoints: 100 },
    { id: 6, name: "Level 6", status: 'locked', points: 0, maxPoints: 100 },
    { id: 7, name: "Level 7", status: 'locked', points: 0, maxPoints: 100 },
    { id: 8, name: "Level 8", status: 'locked', points: 0, maxPoints: 100 },
  ];

  const totalScore = levels.reduce((sum, level) => sum + level.points, 0);
  const completedLevels = levels.filter(level => level.status === 'done').length;
  const progressPercentage = (completedLevels / levels.length) * 100;

  const getStatusIcon = (status: Level['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'current':
        return <Play className="w-6 h-6 text-white" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getLevelCardClass = (status: Level['status']) => {
    switch (status) {
      case 'done':
        return "bg-green-500 hover:bg-green-600 text-white shadow-quiz";
      case 'current':
        return "bg-quiz-yellow hover:bg-quiz-yellow/90 text-quiz-yellow-foreground shadow-glow";
      case 'locked':
        return "bg-gray-200 text-gray-400 cursor-not-allowed";
    }
  };

  return (
    <div className="min-h-screen bg-quiz-bg-gradient p-4 space-y-6">
      {/* Header */}
      <div className="pt-8 relative">
        <Button 
          variant="back" 
          size="icon" 
          onClick={onBack}
          className="absolute left-0 top-8 w-10 h-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2 font-fredoka">
            {category.icon} Kategori {category.name}
          </h1>
          <p className="text-muted-foreground mt-2">Complete levels to earn points!</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="space-y-4">
        <Card className="p-6 bg-card border-2 border-stroke">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Score</p>
              <p className="text-4xl font-bold text-foreground">{totalScore.toLocaleString()} pts</p>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-quiz-yellow" />
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold text-foreground">{completedLevels}/{levels.length}</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2 border-2 border-stroke rounded-xl p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Progress</p>
              <p className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</p>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </Card>
      </div>

      {/* Levels Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Levels</h2>
        <div className="grid grid-cols-2 gap-4">
          {levels.map((level, index) => (
            <Card 
              key={level.id}
              className={`p-4 cursor-pointer transition-all border-0 ${getLevelCardClass(level.status)}`}
              onClick={() => level.status !== 'locked' && onStartLevel(category.id, level.id)}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20">
                  {getStatusIcon(level.status)}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg">{level.name}</h3>
                  {level.status === 'done' && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      <p className="text-sm">+{level.points} pts</p>
                    </div>
                  )}
                  {level.status === 'current' && (
                    <p className="text-sm opacity-90 mt-1">Start now!</p>
                  )}
                  {level.status === 'locked' && (
                    <p className="text-xs mt-1">Complete Level {index} first</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievement Section */}
      <Card className="p-6 bg-card border-2 border-stroke">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-quiz-purple rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Next Reward</h3>
            <p className="text-sm text-muted-foreground">Complete 2 more levels to unlock Math Champion badge!</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CategoryLevelsPage;