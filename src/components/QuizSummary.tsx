import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Share2, RotateCcw, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuizData } from "@/hooks/useQuizData";
import { useAuth } from "@/hooks/useAuth";
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

interface RankingPlayer {
  name: string;
  score: number;
  avatar: string;
  isCurrentUser: boolean;
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
  const { getLevelsForCategory, getLeaderboard } = useQuizData();
  const { user } = useAuth();

  const [nextLevelId, setNextLevelId] = useState<string | null>(null);
  const [rankings, setRankings] = useState<RankingPlayer[]>([]);
  const [playerPosition, setPlayerPosition] = useState<string>("");

  const percentage = Math.round((score / totalQuestions) * 100);
  const pointsEarned = score * 50;

  const getOrdinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  useEffect(() => {
    const loadRankings = async () => {
      const leaderboardData = await getLeaderboard();
      
      const transformedRankings: RankingPlayer[] = leaderboardData.map(entry => ({
        name: entry.display_name || "Anonymous Player",
        score: entry.total_score,
        avatar: Math.random() > 0.5 ? avatar1 : avatar2,
        isCurrentUser: entry.user_id === user?.id
      }));

      setRankings(transformedRankings);

      const position = leaderboardData.findIndex(entry => entry.user_id === user?.id) + 1;
      const totalPlayers = leaderboardData.length;
      if (position > 0) {
        setPlayerPosition(`You placed ${position}${getOrdinalSuffix(position)} out of ${totalPlayers} players`);
      }
    };

    const fetchNextLevel = async () => {
      if (!currentLevelId) return;
      
      const levels = await getLevelsForCategory(categoryId);
      const currentLevel = levels.find(l => l.id === currentLevelId);
      if (!currentLevel) return;

      const nextLevel = levels.find(l => l.level_number === currentLevel.level_number + 1);
      if (nextLevel) {
        setNextLevelId(nextLevel.id);
      }
    };

    loadRankings();
    fetchNextLevel();
  }, [categoryId, currentLevelId, user?.id]);

  const getPerformanceLevel = () => {
    if (percentage >= 90) return { level: "Excellent!", color: "text-green-600", emoji: "🏆" };
    if (percentage >= 70) return { level: "Great!", color: "text-blue-600", emoji: "⭐" };
    if (percentage >= 50) return { level: "Good!", color: "text-yellow-600", emoji: "👍" };
    return { level: "Keep trying!", color: "text-orange-600", emoji: "💪" };
  };

  const performance = getPerformanceLevel();

  const handleShare = () => {
    toast({
      title: "Share your score!",
      description: `I scored ${score}/${totalQuestions} (${percentage}%) on Quiz Burst! 🎯`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{performance.emoji} {performance.level}</h1>
        <p className="text-xl mb-4">You scored <span className={performance.color}>{score}/{totalQuestions}</span></p>
        {playerPosition && <p className="text-lg text-muted-foreground">{playerPosition}</p>}
      </div>

      <Card className="p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Performance Summary</h2>
            <p className="text-muted-foreground">Points earned: {pointsEarned}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold mb-1">{percentage}%</div>
            <Badge variant="outline" className="text-xs">{performance.level}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          {rankings.map((player, index) => (
            <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${player.isCurrentUser ? 'bg-primary/10' : 'bg-secondary/10'}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={player.avatar} alt="" className="w-10 h-10 rounded-full" />
                  {index < 3 && <Trophy className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />}
                </div>
                <div>
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-sm text-muted-foreground">#{index + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{player.score}</p>
                <p className="text-sm text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={onPlayAgain} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" /> Play Again
        </Button>
        <Button variant="outline" onClick={handleShare} className="flex-1">
          <Share2 className="w-4 h-4 mr-2" /> Share Score
        </Button>
        {nextLevelId ? (
          <Button onClick={() => onNextLevel(nextLevelId)} className="flex-1">
            Next Level <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={onBackToHome} className="flex-1">
            Back to Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizSummary;
