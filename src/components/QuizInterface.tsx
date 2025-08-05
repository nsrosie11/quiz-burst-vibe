import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X, Clock, ArrowRight, ArrowLeft, Trophy } from "lucide-react";
import { useQuizData } from "@/hooks/useQuizData";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizInterfaceProps {
  onQuizComplete: (score: number, totalQuestions: number) => void;
  onBack: () => void;
  category?: string;
}

const QuizInterface = ({ onQuizComplete, onBack, category = "random" }: QuizInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getQuizQuestions } = useQuizData();

  // Fetch questions from database
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dbQuestions = await getQuizQuestions(category);
        
        if (dbQuestions.length === 0) {
          setError("Soal tidak tersedia untuk kategori ini, coba lagi nanti");
          return;
        }
        
        setQuestions(dbQuestions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError("Gagal memuat soal, coba lagi nanti");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category, getQuizQuestions]);

  const currentQ = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Timer effect - must be declared before any early returns
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

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(30);
    } else {
      onQuizComplete(score, questions.length);
    }
  };

  const getOptionStyle = (index: number) => {
    if (!showFeedback) {
      return selectedAnswer === index 
        ? "bg-primary text-primary-foreground" 
        : "bg-card hover:bg-muted";
    }
    
    if (currentQ && index === currentQ.correctAnswer) {
      return "bg-success text-success-foreground";
    } else if (index === selectedAnswer && currentQ && selectedAnswer !== currentQ.correctAnswer) {
      return "bg-destructive text-destructive-foreground";
    }
    return "bg-muted";
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-fredoka text-foreground">Memuat soal...</h2>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-fredoka text-foreground">{error}</h2>
          <Button onClick={onBack} variant="outline">Kembali</Button>
        </div>
      </div>
    );
  }

  // Handle no questions state
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-fredoka text-foreground">Soal tidak tersedia</h2>
          <Button onClick={onBack} variant="outline">Kembali</Button>
        </div>
      </div>
    );
  }

  // Handle invalid current question
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-fredoka text-foreground">Error loading question</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
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
          <h1 className="text-2xl font-bold text-foreground font-fredoka">Kategori {category}</h1>
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