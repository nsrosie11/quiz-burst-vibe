import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import HomePage from "@/components/HomePage";
import QuizInterface from "@/components/QuizInterface";
import LeaderboardPage from "@/components/LeaderboardPage";
import QuizSummary from "@/components/QuizSummary";

type AppState = "home" | "quiz" | "leaderboard" | "summary";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>("home");
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const handleStartQuiz = (mode: string, category?: string) => {
    console.log(`Starting ${mode} quiz`, category ? `in ${category} category` : "");
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

  return (
    <div className="relative">
      <HomePage onStartQuiz={handleStartQuiz} />
      
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
