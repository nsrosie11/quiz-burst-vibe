import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X, Clock, ArrowRight } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizInterfaceProps {
  onQuizComplete: (score: number, totalQuestions: number) => void;
  onBack: () => void;
}

const QuizInterface = ({ onQuizComplete, onBack }: QuizInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "Who wrote Romeo and Juliet?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3
    }
  ];

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
    
    if (index === currentQ.correctAnswer) {
      return "bg-success text-success-foreground";
    } else if (index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer) {
      return "bg-destructive text-destructive-foreground";
    }
    return "bg-muted";
  };

  return (
    <div className="min-h-screen bg-quiz-bg-gradient p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <div className="flex items-center gap-2 text-foreground">
          <Clock className="w-5 h-5" />
          <span className="text-lg font-bold">{timeLeft}s</span>
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
      <Card className="p-6 bg-card shadow-quiz border-0">
        <h2 className="text-2xl font-bold text-foreground mb-6">
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
                <span className="text-lg">{option}</span>
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
            variant="quiz" 
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
        <Card className="p-3 bg-card shadow-quiz border-0">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-foreground">{score}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizInterface;