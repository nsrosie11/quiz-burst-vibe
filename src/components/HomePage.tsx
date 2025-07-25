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

      {/* Game Modes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Mode</h2>
        <div className="space-y-3">
          <Button 
            variant="quiz" 
            size="quiz" 
            className="w-full justify-between"
            onClick={() => onStartQuiz('solo')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Solo Mode</p>
                <p className="text-sm opacity-90">Practice on your own</p>
              </div>
            </div>
            <Badge className="bg-quiz-yellow text-quiz-yellow-foreground">New</Badge>
          </Button>

          <Button 
            variant="secondary" 
            size="quiz" 
            className="w-full justify-between"
            onClick={() => onStartQuiz('multiplayer')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-quiz-purple rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Multiplayer</p>
                <p className="text-sm text-muted-foreground">Play with friends</p>
              </div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            size="quiz" 
            className="w-full justify-between"
            onClick={() => onStartQuiz('1v1')}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-quiz-pink rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">1v1 Mode</p>
                <p className="text-sm text-muted-foreground">Challenge a player</p>
              </div>
            </div>
          </Button>
        </div>
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