import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X, Clock, ArrowRight, ArrowLeft, Trophy } from "lucide-react";
import { useQuizData } from "@/hooks/useQuizData";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getQuestionsByCategory, getQuestionsByLevel } from "@/data/questions";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizInterfaceProps {
  onQuizComplete: (score: number, totalQuestions: number) => void;
  onBack: () => void;
  categoryId?: string;
  levelId?: string;
}

const QuizInterface = ({ onQuizComplete, onBack, categoryId = "random", levelId }: QuizInterfaceProps) => {
  const { user } = useAuth();
  const { saveCategoryProgress } = useQuizData();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSaving, setIsSaving] = useState(false);

  // Get questions based on level or category
  const getQuestions = (): Question[] => {
    if (levelId) {
      // Level-specific questions (5 questions per level)
      const levelNumber = parseInt(levelId.split('-')[1]) || 1;
      return getQuestionsByLevel(categoryId, levelNumber) as Question[];
    } else {
      // Category-wide questions (random 5 from all levels)
      const allQuestions = getQuestionsByCategory(categoryId) as Question[];
      // Shuffle and take 5 random questions
      return allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);
    }
  };

  const questions = getQuestions();

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
    
    if (answerIndex === currentQ.correctAnswer) {
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
      // Quiz completed - save progress to database
      if (user) {
        setIsSaving(true);
        try {
          await saveCategoryProgress(categoryId, score);
          toast.success(`Quiz selesai! Skor Anda: ${score}/${questions.length}`);
        } catch (error) {
          toast.error("Gagal menyimpan progress");
          console.error("Error saving progress:", error);
        } finally {
          setIsSaving(false);
        }
      }
      onQuizComplete(score, questions.length);
    }
  };

  const getOptionStyle = (index: number) => {
    if (!showFeedback) {
      return selectedAnswer === index 
        ? "bg-primary text-primary-foreground" 
        : "bg-card hover:bg-muted";
    }
    
    if (index === currentQ.correctAnswer) {
      return "bg-success text-success-foreground";
    } else if (index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer) {
      return "bg-destructive text-destructive-foreground";
    }
    return "bg-muted";
  };

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
          <h1 className="text-2xl font-bold text-foreground font-fredoka">Kategori {categoryId}</h1>
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
          {currentQ.question}
        </h2>
        
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
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
                    {index === currentQ.correctAnswer && (
                      <Check className="w-6 h-6 text-green-600" />
                    )}
                    {index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer && (
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
            disabled={isSaving}
            className="w-full max-w-xs"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              isSaving ? "Menyimpan..." : "Finish Quiz"
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