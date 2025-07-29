import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Zap, Calculator, BookOpen, Dumbbell, Shuffle, Star, Crown, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import avatar1 from "@/assets/avatar-1.png";

interface HomePageProps {
  onStartQuiz: (mode: string, category?: string) => void;
  userName: string;
}

const HomePage = ({ onStartQuiz, userName }: HomePageProps) => {
  const { signOut } = useAuth();
  const categories = [
    { id: "random", name: "Random", icon: Shuffle, color: "bg-quiz-purple" },
    { id: "math", name: "Math", icon: Calculator, color: "bg-quiz-yellow" },
    { id: "history", name: "History", icon: BookOpen, color: "bg-quiz-pink" },
    { id: "sports", name: "Sports", icon: Dumbbell, color: "bg-quiz-purple" },
    { id: "science", name: "Science", icon: Zap, color: "bg-quiz-yellow" },
    { id: "general", name: "General", icon: Star, color: "bg-quiz-pink" }
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <div className="flex items-center gap-3">
          <img src="/lovable-uploads/0c79faf1-9632-4a1f-9cc8-4d93c7d5c0e4.png" alt="MejaKita Logo" className="w-10 h-10" />
          <img src={avatar1} alt="Avatar" className="w-12 h-12 rounded-xl border-2 border-border" />
          <div>
            <h1 className="text-xl font-fredoka font-semibold text-foreground">Hello, {userName}!</h1>
            <p className="text-sm text-muted-foreground font-nunito">Ready for a quiz?</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-mejakia-primary" />
            <span className="text-lg font-nunito font-bold text-foreground">Gold</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="w-10 h-10 rounded-xl hover:bg-accent"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 text-foreground" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-card">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-mejakia-gradient rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-nunito font-bold text-foreground">1,247</p>
              <p className="text-sm font-nunito text-muted-foreground">Total Points</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-mejakia-gradient rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-nunito font-bold text-foreground">#15</p>
              <p className="text-sm font-nunito text-muted-foreground">Global Rank</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Recommendation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-mejakia-primary" />
          <h2 className="text-2xl font-fredoka font-semibold text-foreground">Rekomendasi Hari Ini</h2>
        </div>
        
        <Card className="p-6 bg-mejakia-gradient">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-white font-nunito font-semibold text-lg">Kerjain Matematika yuk!</p>
                <p className="text-white/80 font-nunito text-sm">Lagi banyak yang main kategori ini hari ini. Kesempatan bagus buat naik rank! 🚀</p>
              </div>
              <Button 
                variant="default"
                className="bg-white text-mejakia-primary hover:bg-white/90 font-bold shadow-none border-2 border-white"
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
        <h2 className="text-2xl font-fredoka font-semibold text-foreground">Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="p-4 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onStartQuiz('solo', category.id)}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-mejakia-gradient rounded-xl flex items-center justify-center">
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-nunito font-bold text-foreground">{category.name}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;