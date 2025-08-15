import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Star, Trophy, Play, CheckCircle } from "lucide-react";
import { useQuizData } from "@/hooks/useQuizData";

// Tipe data Level
interface Level {
  id: string;
  name: string;
  status: "available" | "current" | "completed";
  points: number;
  correct_answers: number;
  total_questions: number;
  level_number: number;
}

interface CategoryLevelsPageProps {
  category: { id: string; name: string; icon: string };
  onBack: () => void;
  onStartLevel: (categoryId: string, levelId: string) => void;
}

const CategoryLevelsPage = ({
  category,
  onBack,
  onStartLevel,
}: CategoryLevelsPageProps) => {
  const { getLevelsForCategory, getUserLevelProgress } = useQuizData();
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLevels = async () => {
      try {
        setLoading(true);
        const [quizLevels, userProgress] = await Promise.all([
          getLevelsForCategory(category.id),
          getUserLevelProgress(category.id),
        ]);

        console.log("📌 quizLevels:", quizLevels);
        console.log("📌 userProgress:", userProgress);

        const levelsWithProgress: Level[] = quizLevels.map((level: any) => {
          const progress = userProgress.find(
            (p: any) => p.level_id === level.id
          );

          let status: Level["status"] = "available";
          if (progress) {
            if (
              progress.correct_answers >=
              (progress.total_questions || level.questions_count)
            ) {
              status = "completed";
            } else {
              status = "current";
            }
          }

          return {
            id: level.id,
            name: level.name,
            status,
            points: progress?.correct_answers ?? 0,
            correct_answers: progress?.correct_answers ?? 0,
            total_questions:
              progress?.total_questions ?? level.questions_count ?? 0,
            level_number: level.level_number,
          };
        });

        setLevels(levelsWithProgress);
      } catch (error) {
        console.error("Failed to load levels:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLevels();
  }, [category.id, getLevelsForCategory, getUserLevelProgress]);

  const totalScore = levels.reduce((sum, level) => sum + level.points, 0);
  const completedLevels = levels.filter(
    (level) => level.status === "completed"
  ).length;
  const progressPercentage =
    levels.length > 0 ? (completedLevels / levels.length) * 100 : 0;

  const getStatusIcon = (status: Level["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "current":
      case "available":
        return <Play className="w-6 h-6 text-white" />;
    }
  };

  const getLevelCardClass = (status: Level["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600 text-white shadow-quiz";
      case "current":
        return "bg-mejakia-primary hover:bg-mejakia-primary/90 text-white shadow-glow";
      case "available":
        return "bg-primary hover:bg-primary/90 text-white shadow-quiz";
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
          <p className="text-muted-foreground mt-2">
            Complete levels to earn points!
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="space-y-4">
        <Card className="p-6 bg-card border-2 border-stroke">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Score</p>
              <p className="text-4xl font-bold text-foreground">
                {totalScore.toLocaleString()} pts
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-xl font-bold text-foreground">
                {completedLevels}/{levels.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 border-2 border-stroke rounded-xl p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Progress</p>
              <p className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}%
              </p>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </Card>
      </div>

      {/* Levels Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Levels</h2>
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            <p className="col-span-2 text-center text-muted-foreground">
              Loading...
            </p>
          ) : (
            levels.map((level) => (
              <Card
                key={level.id}
                className={`p-4 cursor-pointer transition-all border-0 ${getLevelCardClass(
                  level.status
                )}`}
                onClick={() => onStartLevel(category.id, level.id)}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20">
                    {getStatusIcon(level.status)}
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{level.name}</h3>

                    {level.status === "completed" && (
                      <>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-300 fill-current" />
                          <p className="text-sm">+{level.points} pts</p>
                        </div>
                        <p className="text-sm text-green-300">
                          {level.correct_answers}/{level.total_questions} correct
                        </p>
                      </>
                    )}

                    {level.status === "current" && (
                      <p className="text-sm opacity-90 mt-1">▶️ Current</p>
                    )}

                    {level.status === "available" && (
                      <p className="text-sm opacity-90 mt-1">🔓 Available</p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
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
            <p className="text-sm text-muted-foreground">
              Complete 2 more levels to unlock Math Champion badge!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CategoryLevelsPage;
