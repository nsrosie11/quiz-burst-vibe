import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "./AuthPage";
import HomePage from "@/components/HomePage";
import QuizInterface from "@/components/QuizInterface";
import LeaderboardPage from "@/components/LeaderboardPage";
import QuizSummary from "@/components/QuizSummary";
import CategoryLevelsPage from "@/components/CategoryLevelsPage";

type AppState = "home" | "quiz" | "leaderboard" | "summary" | "categoryLevels";

const Index = () => {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppState>("home");
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string, icon: string} | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>("random");

  if (loading) {
    return (
      <div className="min-h-screen bg-quiz-bg-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-quiz-purple rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <p className="text-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => setCurrentScreen("home")} />;
  }

  const handleStartQuiz = (mode: string, category?: string) => {
    if (category && mode === 'solo') {
      // Navigate to category levels page
      const categoryData = getCategoryData(category);
      setSelectedCategory(categoryData);
      setCurrentCategory(category);
      setCurrentScreen("categoryLevels");
    } else {
      console.log(`Starting ${mode} quiz`, category ? `in ${category} category` : "");
      setCurrentCategory(category || "random");
      setCurrentScreen("quiz");
    }
  };

  const getCategoryData = (categoryId: string) => {
    const categories = {
      random: { id: "random", name: "Random", icon: "🎲" },
      math: { id: "math", name: "Math", icon: "📐" },
      history: { id: "history", name: "History", icon: "📚" },
      sports: { id: "sports", name: "Sports", icon: "⚽" },
      science: { id: "science", name: "Science", icon: "🧪" },
      general: { id: "general", name: "General", icon: "⭐" }
    };
    return categories[categoryId as keyof typeof categories] || categories.random;
  };

  const handleStartLevel = (categoryId: string, levelId: number) => {
    console.log(`Starting level ${levelId} in ${categoryId} category`);
    setCurrentCategory(categoryId);
    setCurrentScreen("quiz");
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizScore(score);
    setTotalQuestions(total);
    setCurrentScreen("summary");
  };

  const handlePlayAgain = () => {
    setCurrentScreen("quiz");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
  };

  const handleShowLeaderboard = () => {
    setCurrentScreen("leaderboard");
  };

  if (currentScreen === "quiz") {
    return (
      <QuizInterface 
        onQuizComplete={handleQuizComplete}
        onBack={handleBackToHome}
        category={currentCategory}
      />
    );
  }

  if (currentScreen === "leaderboard") {
    return (
      <LeaderboardPage onBack={handleBackToHome} />
    );
  }

  if (currentScreen === "summary") {
    return (
      <QuizSummary 
        score={quizScore}
        totalQuestions={totalQuestions}
        onPlayAgain={handlePlayAgain}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (currentScreen === "categoryLevels" && selectedCategory) {
    return (
      <CategoryLevelsPage 
        category={selectedCategory}
        onBack={handleBackToHome}
        onStartLevel={handleStartLevel}
      />
    );
  }

  return (
    <div className="relative">
      <HomePage onStartQuiz={handleStartQuiz} userName={profile?.display_name || user?.email?.split('@')[0] || "Player"} />
      
      {/* Floating Leaderboard Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="quiz" 
          size="icon"
          className="w-16 h-16 rounded-full shadow-glow"
          onClick={handleShowLeaderboard}
        >
          <Trophy className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
