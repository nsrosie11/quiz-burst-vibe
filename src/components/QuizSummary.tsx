import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, CheckCircle, XCircle, Share2, RotateCcw, Star, TrendingUp, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuizData } from "@/hooks/useQuizData";
import { useEffect, useState } from "react";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";

interface QuizSummaryProps {
  score: number;
  totalQuestions: number;
  categoryId: string;
  currentLevelId: string;
  onPlayAgain: () => void;
  onBackToHome: () => void;
  onNextLevel: (nextLevelId: string) => void;
}

const QuizSummary = ({ 
  score, 
  totalQuestions, 
  categoryId, 
  currentLevelId, 
  onPlayAgain, 
  onBackToHome,
  onNextLevel
}: QuizSummaryProps) => {
  const { toast } = useToast();
  const { getLevelsForCategory, getUserLevelProgress } = useQuizData();
  const [nextLevelId, setNextLevelId] = useState<string | null>(null);

  const percentage = Math.round((score / totalQuestions) * 100);
  const pointsEarned = score * 50;

  const getPerformanceLevel = () => {
    if (percentage >= 90) return { level: "Excellent!", color: "text-green-600", emoji: "🏆" };
    if (percentage >= 70) return { level: "Great!", color: "text-blue-600", emoji: "⭐" };
    if (percentage >= 50) return { level: "Good!", color: "text-yellow-600", emoji: "👍" };
    return { level: "Keep trying!", color: "text-orange-600", emoji: "💪" };
  };

  const performance = getPerformanceLevel();

  // Generate dynamic ranking with random scores
  const generateDynamicRanking = () => {
    const playerNames = ["Alex Chen", "Sarah Quinn", "Mike Johnson", "Emma Wilson", "David Brown", "Lisa Park", "Tom Anderson"];
    const randomPlayers = playerNames
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map(name => ({
        name,
        score: Math.floor(Math.random() * 5) + 1, // Random score 1-5
        avatar: Math.random() > 0.5 ? avatar1 : avatar2,
        isCurrentUser: false
      }));

    // Add current user
    randomPlayers.push({
      name: "You",
      score: score,
      avatar: avatar1,
      isCurrentUser: true
    });

    // Sort by score descending
    return randomPlayers.sort((a, b) => b.score - a.score);
  };

  const otherPlayers = generateDynamicRanking();
  const userRank = otherPlayers.findIndex(player => player.isCurrentUser) + 1;

  const handleShare = () => {
    toast({
      title: "Share your score!",
      description: `I scored ${score}/${totalQuestions} (${percentage}%) on Quiz Burst! 🎯`,
    });
  };

  // Check if there's a next level available
  useEffect(() => {
    const fetchNextLevel = async () => {
      if (!currentLevelId) return; // Only for level-based quizzes
      
      const levels = await getLevelsForCategory(categoryId);
      const currentLevel = levels.find(l => l.id === currentLevelId);
      if (!currentLevel) return;

      // Find next level by level number
      const nextLevel = levels.find(l => l.level_number === currentLevel.level_number + 1);
      if (nextLevel) {
        setNextLevelId(nextLevel.id);
      }
    };

    fetchNextLevel();
  }, [categoryId, currentLevelId]);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-8">
        <h1 className="text-3xl font-fredoka font-semibold text-foreground mb-2">Quiz Complete!</h1>
        <p className="text-lg font-nunito text-muted-foreground">Here's how you did</p>
      </div>

      {/* Main Score Card */}
      <Card className="p-8 bg-mejakia-gradient text-white text-center">
        <div className="space-y-4">
          <div className="text-6xl">{performance.emoji}</div>
          <h2 className="text-2xl font-fredoka font-semibold">{performance.level}</h2>
          <div className="text-5xl font-nunito font-bold">{score}/{totalQuestions}</div>
          <p className="text-xl font-nunito opacity-90">{percentage}% Correct</p>
          <Badge className="bg-white text-mejakia-primary text-lg px-4 py-2 font-nunito font-bold">
            +{pointsEarned} Points
          </Badge>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-card shadow-quiz border-0 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{score}</p>
          <p className="text-sm text-muted-foreground">Correct</p>
        </Card>
        
        <Card className="p-4 bg-card shadow-quiz border-0 text-center">
          <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalQuestions - score}</p>
          <p className="text-sm text-muted-foreground">Wrong</p>
        </Card>
        
        <Card className="p-4 bg-card shadow-quiz border-0 text-center">
          <Target className="w-8 h-8 text-quiz-purple mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{percentage}%</p>
          <p className="text-sm text-muted-foreground">Accuracy</p>
        </Card>
      </div>

      {/* Ranking Card */}
      <Card className="p-6 bg-card shadow-quiz border-0">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-quiz-purple" />
          <h3 className="text-xl font-bold text-foreground">Your Ranking</h3>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-quiz-purple rounded-full flex items-center justify-center">
              <span className="text-white font-bold">#{userRank}</span>
            </div>
            <div>
              <p className="font-bold text-foreground">You placed {userRank}{userRank === 1 ? 'st' : userRank === 2 ? 'nd' : userRank === 3 ? 'rd' : 'th'}</p>
              <p className="text-sm text-muted-foreground">Out of {otherPlayers.length} players</p>
            </div>
          </div>
          {userRank <= 3 && (
            <Trophy className={`w-8 h-8 ${
              userRank === 1 ? "text-yellow-500" : 
              userRank === 2 ? "text-gray-400" : "text-amber-600"
            }`} />
          )}
        </div>

        {/* Mini leaderboard */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground mb-3">This Round Results:</p>
          {otherPlayers.slice(0, 5).map((player, index) => (
            <div 
              key={player.name}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                player.isCurrentUser ? "bg-quiz-purple/10 border-2 border-quiz-purple" : ""
              }`}
            >
              <span className="w-6 text-center font-bold text-sm text-muted-foreground">
                #{index + 1}
              </span>
              <img 
                src={player.avatar} 
                alt={player.name}
                className="w-8 h-8 rounded-full"
              />
              <span className={`flex-1 ${player.isCurrentUser ? "font-bold text-quiz-purple" : "text-foreground"}`}>
                {player.name}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-quiz-yellow" />
                <span className="font-bold text-foreground">{player.score}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {nextLevelId && currentLevelId ? (
          <Button 
            variant="mejakia" 
            size="lg" 
            className="w-full"
            onClick={() => onNextLevel(nextLevelId)}
          >
            <ArrowRight className="w-5 h-5" />
            ⏭️ Next Level
          </Button>
        ) : (
          <Button 
            variant="mejakia" 
            size="lg" 
            className="w-full"
            onClick={onPlayAgain}
          >
            <RotateCcw className="w-5 h-5" />
            🔁 Play Again
          </Button>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            Share Score
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg"
            onClick={onBackToHome}
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizSummary;
