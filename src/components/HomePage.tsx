import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Zap, Calculator, BookOpen, Dumbbell, Shuffle, Star, Crown } from "lucide-react";
import avatar1 from "@/assets/avatar-1.png";

interface HomePageProps {
  onStartQuiz: (mode: string, category?: string) => void;
}

const HomePage = ({ onStartQuiz }: HomePageProps) => {
  const categories = [
    { id: "random", name: "Random", icon: Shuffle, color: "bg-quiz-purple" },
    { id: "math", name: "Math", icon: Calculator, color: "bg-quiz-yellow" },
    { id: "history", name: "History", icon: BookOpen, color: "bg-quiz-pink" },
    { id: "sports", name: "Sports", icon: Dumbbell, color: "bg-quiz-purple" },
    { id: "science", name: "Science", icon: Zap, color: "bg-quiz-yellow" },
    { id: "general", name: "General", icon: Star, color: "bg-quiz-pink" }
  ];

  return (
    <div className="min-h-screen bg-quiz-bg-gradient p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <div className="flex items-center gap-3">
          <img src={avatar1} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-quiz" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Hello, Player!</h1>
            <p className="text-sm text-muted-foreground">Ready for a quiz?</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-quiz-yellow" />
          <span className="text-lg font-bold text-foreground">Gold</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-card shadow-quiz border-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-quiz-purple rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1,247</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card shadow-quiz border-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-quiz-pink rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">#15</p>
              <p className="text-sm text-muted-foreground">Global Rank</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Recommendation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-quiz-yellow" />
          <h2 className="text-2xl font-bold text-foreground">Rekomendasi Hari Ini</h2>
        </div>
        
        <Card className="p-6 bg-gradient-to-br from-quiz-purple to-quiz-pink border-0 shadow-quiz">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-quiz-yellow rounded-2xl flex items-center justify-center shadow-quiz flex-shrink-0">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-white font-semibold text-lg">Kerjain Matematika yuk!</p>
                <p className="text-white/80 text-sm">Lagi banyak yang main kategori ini hari ini. Kesempatan bagus buat naik rank! 🚀</p>
              </div>
              <Button 
                variant="quiz"
                className="bg-quiz-yellow hover:bg-quiz-yellow/90 text-quiz-yellow-foreground font-bold"
                onClick={() => onStartQuiz('solo', 'math')}
              >
                Mulai Sekarang
              </Button>
            </div>
          </div>
        </Card>

      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="p-4 cursor-pointer hover:scale-105 transition-transform border-0 shadow-quiz"
              onClick={() => onStartQuiz('solo', category.id)}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center shadow-quiz`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-foreground">{category.name}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;