import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Medal, Trophy, Star } from "lucide-react";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";

interface LeaderboardPageProps {
  onBack: () => void;
}

const LeaderboardPage = ({ onBack }: LeaderboardPageProps) => {
  const weeklyLeaders = [
    { rank: 1, name: "Alex Champion", score: 2847, avatar: avatar1, isCurrentUser: false },
    { rank: 2, name: "Sarah Quiz", score: 2654, avatar: avatar2, isCurrentUser: false },
    { rank: 3, name: "Mike Brain", score: 2341, avatar: avatar1, isCurrentUser: false },
    { rank: 4, name: "Emma Smart", score: 2156, avatar: avatar2, isCurrentUser: false },
    { rank: 5, name: "You", score: 1847, avatar: avatar1, isCurrentUser: true },
    { rank: 6, name: "John Quick", score: 1723, avatar: avatar2, isCurrentUser: false },
    { rank: 7, name: "Lisa Bright", score: 1654, avatar: avatar1, isCurrentUser: false },
    { rank: 8, name: "Tom Fast", score: 1587, avatar: avatar2, isCurrentUser: false },
  ];

  const monthlyLeaders = [
    { rank: 1, name: "Sarah Quiz", score: 8947, avatar: avatar2, isCurrentUser: false },
    { rank: 2, name: "Alex Champion", score: 8654, avatar: avatar1, isCurrentUser: false },
    { rank: 3, name: "Mike Brain", score: 7841, avatar: avatar1, isCurrentUser: false },
    { rank: 4, name: "Emma Smart", score: 7456, avatar: avatar2, isCurrentUser: false },
    { rank: 5, name: "Lisa Bright", score: 6954, avatar: avatar1, isCurrentUser: false },
    { rank: 6, name: "John Quick", score: 6723, avatar: avatar2, isCurrentUser: false },
    { rank: 7, name: "You", score: 6247, avatar: avatar1, isCurrentUser: true },
    { rank: 8, name: "Tom Fast", score: 5987, avatar: avatar2, isCurrentUser: false },
  ];

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

  const LeaderboardList = ({ leaders }: { leaders: typeof weeklyLeaders }) => (
    <div className="space-y-3">
      {leaders.map((leader, index) => (
        <Card 
          key={leader.rank}
          className={`p-4 border-0 shadow-quiz ${
            leader.isCurrentUser 
              ? "bg-quiz-gradient text-white shadow-glow" 
              : "bg-card"
          }`}
        >
          <div className="flex items-center gap-4">
            <button className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-[0_4px_0] ${
              leader.rank <= 3 
                ? "bg-profile-gradient shadow-[0_4px_0_#084383]" 
                : "bg-gray-gradient shadow-[0_4px_0_rgba(209,213,221,0.73)]"
            }`}>
              {leader.rank <= 3 ? (
                getRankIcon(leader.rank)
              ) : (
                <span>#{leader.rank}</span>
              )}
            </button>
            
            <img 
              src={leader.avatar} 
              alt={leader.name}
              className="w-12 h-12 rounded-xl border-2 border-white shadow-md"
            />
            
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${leader.isCurrentUser ? "text-white" : "text-foreground"}`}>
                {leader.name}
                {leader.isCurrentUser && (
                  <Badge className="ml-2 bg-quiz-yellow text-quiz-yellow-foreground">You</Badge>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${leader.isCurrentUser ? "text-yellow-300" : "text-quiz-yellow"}`} />
                <span className={`text-sm ${leader.isCurrentUser ? "text-white/80" : "text-muted-foreground"}`}>
                  {leader.score.toLocaleString()} points
                </span>
              </div>
            </div>
            
            {leader.rank <= 3 && (
              <Trophy className={`w-6 h-6 ${
                leader.rank === 1 ? "text-yellow-500" : 
                leader.rank === 2 ? "text-gray-400" : "text-amber-600"
              }`} />
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-quiz-bg-gradient p-4 space-y-6">
      {/* Header */}
      <div className="pt-8">
        <h1 className="text-3xl font-bold font-fredoka text-center">Leaderboard</h1>
      </div>

      {/* Top 3 Podium */}
      <Card className="p-6 bg-card shadow-quiz border-0">
        <h2 className="text-xl font-bold text-foreground mb-4 text-center">Top Champions</h2>
        <div className="flex justify-center items-end gap-4">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="relative">
              <img src={avatar2} alt="2nd place" className="w-16 h-16 rounded-full border-4 border-gray-300 shadow-lg" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
            </div>
            <p className="font-bold text-foreground mt-2">Sarah</p>
            <p className="text-sm text-muted-foreground">2,654 pts</p>
            <div className="w-20 h-16 bg-gray-300 rounded-t-lg mt-2"></div>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="relative">
              <img src={avatar1} alt="1st place" className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-lg" />
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="font-bold text-foreground mt-2">Alex</p>
            <p className="text-sm text-muted-foreground">2,847 pts</p>
            <div className="w-20 h-20 bg-yellow-400 rounded-t-lg mt-2"></div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="relative">
              <img src={avatar1} alt="3rd place" className="w-16 h-16 rounded-full border-4 border-amber-500 shadow-lg" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
            </div>
            <p className="font-bold text-foreground mt-2">Mike</p>
            <p className="text-sm text-muted-foreground">2,341 pts</p>
            <div className="w-20 h-12 bg-amber-500 rounded-t-lg mt-2"></div>
          </div>
        </div>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-card border-2 border-stroke rounded-xl">
          <TabsTrigger value="weekly" className="font-bold">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="font-bold">Monthly</TabsTrigger>
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