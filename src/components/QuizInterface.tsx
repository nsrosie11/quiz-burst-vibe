import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X, Clock, ArrowRight, ArrowLeft, Trophy } from "lucide-react";
import { useQuizData } from "@/hooks/useQuizData";
import { useAuth } from "@/hooks/useAuth";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number;
}

interface QuizInterfaceProps {
  onQuizComplete: (score: number, totalQuestions: number) => void;
  onBack: () => void;
  categoryId?: string;
  levelId?: string;
}

const QuizInterface = ({ onQuizComplete, onBack, categoryId, levelId }: QuizInterfaceProps) => {
  const { getQuizQuestions, completeLevel } = useQuizData();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions from database
  useEffect(() => {
    const loadQuestions = async () => {
      if (!categoryId || !levelId) {
        setError("Kategori atau level tidak valid");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Loading questions for category:", categoryId, "level:", levelId);
        const fetchedQuestions = await getQuizQuestions(categoryId, levelId);
        console.log("Fetched questions:", fetchedQuestions);
        
        if (!fetchedQuestions || fetchedQuestions.length === 0) {
          setError("Soal tidak ditemukan untuk kategori ini");
          setLoading(false);
          return;
        }

        setQuestions(fetchedQuestions);
        setError(null);
      } catch (err) {
        console.error("Error loading questions:", err);
        setError("Gagal memuat soal, coba lagi nanti");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [categoryId, levelId, getQuizQuestions]);

  const currentQ = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const options = currentQ ? [currentQ.option_a, currentQ.option_b, currentQ.option_c, currentQ.option_d] : [];

  useEffect(() => {
    if (timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleAnswer(-1); // Time's up
    }
  }, [timeLeft, showFeedback]);

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    if (answerIndex === currentQ.correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(30);
    } else {
      // Save progress to database before completing
      if (levelId && user) {
        const finalScore = selectedAnswer === currentQ.correct_answer ? score + 1 : score;
        const pointsEarned = Math.round((finalScore / questions.length) * 100); // Convert to points out of 100
        
        try {
          await completeLevel(levelId, pointsEarned);
          console.log("Level completed, points saved:", pointsEarned);
        } catch (error) {
          console.error("Error saving level completion:", error);
        }
        
        onQuizComplete(finalScore, questions.length);
      } else {
        onQuizComplete(score, questions.length);
      }
    }
  };

  const getOptionStyle = (index: number) => {
    if (!showFeedback) {
      return selectedAnswer === index 
        ? "bg-primary text-primary-foreground" 
        : "bg-card hover:bg-muted";
    }
    
    if (index === currentQ.correct_answer) {
      return "bg-success text-success-foreground";
    } else if (index === selectedAnswer && selectedAnswer !== currentQ.correct_answer) {
      return "bg-destructive text-destructive-foreground";
    }
    return "bg-muted";
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="p-8 bg-card text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground">Loading questions...</p>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="p-8 bg-card text-center">
          <X className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Oops!</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onBack} variant="outline">
            Kembali
          </Button>
        </Card>
      </div>
    );
  }

  // Show no questions state
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="p-8 bg-card text-center">
          <Trophy className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Soal Belum Tersedia</h2>
          <p className="text-muted-foreground mb-4">Soal untuk kategori ini belum tersedia. Coba lagi nanti!</p>
          <Button onClick={onBack} variant="outline">
            Kembali
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
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
          <h1 className="text-2xl font-bold text-foreground font-fredoka">Quiz Level</h1>
          <div className="flex justify-center items-center gap-2 text-foreground mt-2">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-nunito font-bold">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Question */}
      <Card className="p-6 bg-card">
        <h2 className="text-2xl font-fredoka font-semibold text-foreground mb-6">
          {currentQ.question_text}
        </h2>
        
        <div className="space-y-3">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full p-4 h-auto text-left justify-start text-wrap ${getOptionStyle(index)} border-2 border-transparent hover:border-primary transition-all`}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-nunito">{option}</span>
                {showFeedback && (
                  <>
                    {index === currentQ.correct_answer && (
                      <Check className="w-6 h-6 text-green-600" />
                    )}
                    {index === selectedAnswer && selectedAnswer !== currentQ.correct_answer && (
                      <X className="w-6 h-6 text-red-600" />
                    )}
                  </>
                )}
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Next Button */}
      {showFeedback && (
        <div className="flex justify-center">
          <Button 
            variant="mejakia" 
            size="lg" 
            onClick={handleNext}
            className="w-full max-w-xs"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              "Finish Quiz"
            )}
          </Button>
        </div>
      )}

      {/* Score Display */}
      <div className="fixed bottom-4 left-4">
        <Card className="p-3 bg-card">
          <div className="text-center">
            <p className="text-sm font-nunito text-muted-foreground">Score</p>
            <p className="text-2xl font-nunito font-bold text-foreground">{score}</p>
          </div>
        </Card>
      </div>

      {/* Next Award Display */}
      <div className="fixed bottom-4 right-4">
        <Card className="p-3 bg-card">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            <div>
              <p className="text-xs font-nunito text-muted-foreground">Next Reward</p>
              <p className="text-sm font-nunito font-bold text-foreground">Complete 2 more levels to unlock Math Champion badge!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizInterface;