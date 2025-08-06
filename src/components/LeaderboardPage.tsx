import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Medal, Trophy, Star, ArrowLeft } from "lucide-react";
import { useQuizData, LeaderboardEntry } from "@/hooks/useQuizData";
import { useAuth } from "@/hooks/useAuth";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";

interface LeaderboardPageProps {
  onBack: () => void;
}

const LeaderboardPage = ({ onBack }: LeaderboardPageProps) => {
  const { getLeaderboard } = useQuizData();
  const { user } = useAuth();
  const [weeklyLeaders, setWeeklyLeaders] = useState<LeaderboardEntry[]>([]);
  const [monthlyLeaders, setMonthlyLeaders] = useState<LeaderboardEntry[]>([]);
  const [topChampions, setTopChampions] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboards = async () => {
      setLoading(true);
      const [weekly, monthly] = await Promise.all([
        getLeaderboard('weekly'),
        getLeaderboard('monthly')
      ]);
      
      // Get top 3 champions from weekly data
      setTopChampions(weekly.slice(0, 3));
      
      // Add current user if not in top rankings
      const ensureCurrentUser = (leaders: LeaderboardEntry[]) => {
        const currentUser = leaders.find(l => l.user_id === user?.id);
        if (!currentUser && user?.id) {
          // Add current user at the end with their actual stats or placeholder
          return [...leaders, {
            user_id: user.id,
            total_score: 0,
            global_rank: leaders.length + 1,
            display_name: 'You'
          }];
        }
        return leaders.map(l => ({
          ...l,
          display_name: l.user_id === user?.id ? 'You' : l.display_name
        }));
      };

      setWeeklyLeaders(ensureCurrentUser(weekly));
      setMonthlyLeaders(ensureCurrentUser(monthly));
      setLoading(false);
    };

    loadLeaderboards();
  }, [getLeaderboard, user?.id]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-amber-600";
    }
    return "bg-muted";
  };

  const LeaderboardList = ({ leaders }: { leaders: LeaderboardEntry[] }) => (
    <div className="space-y-3">
      {leaders.map((leader, index) => {
        const isCurrentUser = leader.display_name === 'You';
        const rank = leader.global_rank;
        return (
          <Card 
            key={leader.user_id}
            className={`p-4 border-0 shadow-quiz ${
              isCurrentUser 
                ? "bg-quiz-gradient text-white shadow-glow" 
                : "bg-card"
            }`}
          >
            <div className="flex items-center gap-4">
              <button className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-[0_4px_0] ${
                rank <= 3 
                  ? "bg-profile-gradient shadow-[0_4px_0_#084383]" 
                  : "bg-gray-gradient shadow-[0_4px_0_rgba(209,213,221,0.73)]"
              }`}>
                {rank <= 3 ? (
                  getRankIcon(rank)
                ) : (
                  <span>#{rank}</span>
                )}
              </button>
              
              <img 
                src={index % 2 === 0 ? avatar1 : avatar2} 
                alt={leader.display_name || 'User'}
                className="w-12 h-12 rounded-xl border-2 border-white shadow-md"
              />
              
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${isCurrentUser ? "text-black" : "text-foreground"}`}>
                  {leader.display_name}
                  {isCurrentUser && (
                    <Badge className="ml-2 bg-yellow-500 text-black">You</Badge>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  <Star className={`w-4 h-4 ${isCurrentUser ? "text-yellow-300" : "text-quiz-yellow"}`} />
                  <span className={`text-sm ${isCurrentUser ? "text-white/80" : "text-muted-foreground"}`}>
                    {leader.total_score.toLocaleString()} points
                  </span>
                </div>
              </div>
              
              {rank <= 3 && (
                <Trophy className={`w-6 h-6 ${
                  rank === 1 ? "text-yellow-500" : 
                  rank === 2 ? "text-gray-400" : "text-amber-600"
                }`} />
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );

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
        <h1 className="text-3xl font-bold font-fredoka text-center">Leaderboard</h1>
      </div>

      {/* Top 3 Podium */}
      <Card className="p-6 bg-card shadow-quiz border-0">
        <h2 className="text-xl font-bold text-foreground mb-4 text-center">Top Champions</h2>
        {topChampions.length > 0 ? (
          <div className="flex justify-center items-end gap-4">
            {/* 2nd Place */}
            {topChampions.length >= 2 && (
              <div className="text-center">
                <div className="relative">
                  <img src={avatar2} alt="2nd place" className="w-16 h-16 rounded-full border-4 border-gray-300 shadow-lg" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                </div>
                <p className="font-bold text-foreground mt-2">{topChampions[1].display_name}</p>
                <p className="text-sm text-muted-foreground">{topChampions[1].total_score.toLocaleString()} pts</p>
                <div className="w-20 h-16 bg-gray-300 rounded-t-lg mt-2"></div>
              </div>
            )}

            {/* 1st Place */}
            <div className="text-center">
              <div className="relative">
                <img src={avatar1} alt="1st place" className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-lg" />
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="font-bold text-foreground mt-2">{topChampions[0].display_name}</p>
              <p className="text-sm text-muted-foreground">{topChampions[0].total_score.toLocaleString()} pts</p>
              <div className="w-20 h-20 bg-yellow-400 rounded-t-lg mt-2"></div>
            </div>

            {/* 3rd Place */}
            {topChampions.length >= 3 && (
              <div className="text-center">
                <div className="relative">
                  <img src={avatar1} alt="3rd place" className="w-16 h-16 rounded-full border-4 border-amber-500 shadow-lg" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                </div>
                <p className="font-bold text-foreground mt-2">{topChampions[2].display_name}</p>
                <p className="text-sm text-muted-foreground">{topChampions[2].total_score.toLocaleString()} pts</p>
                <div className="w-20 h-12 bg-amber-500 rounded-t-lg mt-2"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No champions yet. Be the first!</p>
          </div>
        )}
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-white border-2 border-stroke rounded-xl p-1">
          <TabsTrigger value="weekly" className="font-bold data-[state=active]:bg-mejakia-gradient data-[state=active]:text-white data-[state=active]:shadow-none rounded-lg">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="font-bold data-[state=active]:bg-mejakia-gradient data-[state=active]:text-white data-[state=active]:shadow-none rounded-lg">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-4">
          <LeaderboardList leaders={weeklyLeaders} />
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-4">
          <LeaderboardList leaders={monthlyLeaders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderboardPage;