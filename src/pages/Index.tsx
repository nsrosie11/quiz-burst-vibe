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
import ProfileDropdown from "@/components/ProfileDropdown";
import ProfileEditForm from "@/components/ProfileEditForm";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import DeviceListPage from "@/components/DeviceListPage";

type AppState = "home" | "quiz" | "leaderboard" | "summary" | "categoryLevels" | "profileEdit" | "passwordChange" | "deviceList";

const Index = () => {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppState>("home");
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string, icon: string} | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>("random");
  const [selectedLevelId, setSelectedLevelId] = useState<string>("");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-mejakia-gradient rounded-xl flex items-center justify-center mx-auto animate-pulse">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <p className="text-foreground font-nunito">Memuat...</p>
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

  const handleStartLevel = (categoryId: string, levelId: string) => {
    console.log(`Starting level ${levelId} in ${categoryId} category`);
    setCurrentCategory(categoryId);
    setSelectedLevelId(levelId);
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

  const handleProfileEdit = () => {
    setCurrentScreen("profileEdit");
  };

  const handlePasswordChange = () => {
    setCurrentScreen("passwordChange");
  };

  const handleDeviceList = () => {
    setCurrentScreen("deviceList");
  };

  if (currentScreen === "quiz") {
    return (
      <QuizInterface 
        onQuizComplete={handleQuizComplete}
        onBack={handleBackToHome}
        categoryId={currentCategory}
        levelId={selectedLevelId}
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
        categoryId={currentCategory}
        currentLevelId={selectedLevelId}
        onPlayAgain={handlePlayAgain}
        onBackToHome={handleBackToHome}
        onNextLevel={(nextLevelId) => {
          setSelectedLevelId(nextLevelId);
          setCurrentScreen("quiz");
        }}
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

  if (currentScreen === "profileEdit") {
    return <ProfileEditForm onBack={handleBackToHome} />;
  }

  if (currentScreen === "passwordChange") {
    return <PasswordChangeForm onBack={handleBackToHome} />;
  }

  if (currentScreen === "deviceList") {
    return <DeviceListPage onBack={handleBackToHome} />;
  }

  return (
    <div className="relative">
      {/* Header with Logo and Profile */}
      <div className="flex justify-between items-center p-6 bg-background border-b border-stroke">
        <img 
          src="/lovable-uploads/0c79faf1-9632-4a1f-9cc8-4d93c7d5c0e4.png" 
          alt="MejaKita" 
          className="h-6"
        />
        <ProfileDropdown 
          onProfileEdit={handleProfileEdit}
          onPasswordChange={handlePasswordChange}
          onDeviceList={handleDeviceList}
        />
      </div>

      <HomePage onStartQuiz={handleStartQuiz} userName={profile?.display_name || user?.email?.split('@')[0] || "Player"} />
      
      {/* Floating Leaderboard Image */}
      <button
        onClick={handleShowLeaderboard}
        className="fixed bottom-6 right-6 w-22 h-14 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none z-50"
      >
        <img src="/lovable-uploads/a1515326-a2f5-41ef-9358-eedee1e91640.png" alt="Trophy" className="w-24 h-17" />
      </button>
    </div>
  );
};

export default Index;
