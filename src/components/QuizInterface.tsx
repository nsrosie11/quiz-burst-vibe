import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X, Clock, ArrowRight, ArrowLeft, Trophy } from "lucide-react";

interface Question {
  id: number;
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

  const getQuestionsByCategory = (cat: string): Question[] => {
    const questionBank = {
      math: [
        {
          id: 1,
          question: "Berapakah hasil dari 15 × 8?",
          options: ["120", "125", "115", "130"],
          correctAnswer: 0
        },
        {
          id: 2,
          question: "Jika x + 12 = 20, maka x = ?",
          options: ["6", "8", "10", "12"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "Berapakah akar kuadrat dari 144?",
          options: ["10", "11", "12", "13"],
          correctAnswer: 2
        },
        {
          id: 4,
          question: "Hasil dari 3² + 4² = ?",
          options: ["25", "24", "26", "23"],
          correctAnswer: 0
        },
        {
          id: 5,
          question: "Berapa persen dari 25% × 80?",
          options: ["15", "20", "25", "30"],
          correctAnswer: 1
        }
      ],
      history: [
        {
          id: 1,
          question: "Siapa proklamator kemerdekaan Indonesia?",
          options: ["Soekarno-Hatta", "Soeharto", "Habibie", "Megawati"],
          correctAnswer: 0
        },
        {
          id: 2,
          question: "Kapan Indonesia merdeka?",
          options: ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "15 Agustus 1945"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "Siapa nama pahlawan wanita dari Aceh?",
          options: ["Kartini", "Cut Nyak Dien", "Dewi Sartika", "Martha Christina Tiahahu"],
          correctAnswer: 1
        },
        {
          id: 4,
          question: "Kerajaan Majapahit terletak di provinsi?",
          options: ["Jawa Tengah", "Jawa Barat", "Jawa Timur", "Yogyakarta"],
          correctAnswer: 2
        },
        {
          id: 5,
          question: "Siapa presiden pertama Indonesia?",
          options: ["Soeharto", "Soekarno", "Habibie", "Megawati"],
          correctAnswer: 1
        }
      ],
      sports: [
        {
          id: 1,
          question: "Berapa pemain dalam satu tim sepak bola?",
          options: ["10", "11", "12", "9"],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Olahraga bulu tangkis berasal dari negara?",
          options: ["Indonesia", "China", "Inggris", "India"],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "Siapa atlet bulutangkis Indonesia yang paling terkenal?",
          options: ["Taufik Hidayat", "Susi Susanti", "Liem Swie King", "Semua benar"],
          correctAnswer: 3
        },
        {
          id: 4,
          question: "Berapa set maksimal dalam pertandingan tenis?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 2
        },
        {
          id: 5,
          question: "Olimpiade modern pertama diadakan di?",
          options: ["Paris", "London", "Athena", "Roma"],
          correctAnswer: 2
        }
      ],
      science: [
        {
          id: 1,
          question: "Apa rumus kimia air?",
          options: ["H2O", "CO2", "O2", "H2SO4"],
          correctAnswer: 0
        },
        {
          id: 2,
          question: "Planet terdekat dengan matahari adalah?",
          options: ["Venus", "Merkurius", "Bumi", "Mars"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "Organ terbesar dalam tubuh manusia adalah?",
          options: ["Hati", "Paru-paru", "Kulit", "Ginjal"],
          correctAnswer: 2
        },
        {
          id: 4,
          question: "Siapa penemu listrik?",
          options: ["Thomas Edison", "Benjamin Franklin", "Nikola Tesla", "Michael Faraday"],
          correctAnswer: 1
        },
        {
          id: 5,
          question: "Proses fotosintesis terjadi di bagian?",
          options: ["Akar", "Batang", "Daun", "Bunga"],
          correctAnswer: 2
        }
      ],
      general: [
        {
          id: 1,
          question: "Ibu kota Indonesia adalah?",
          options: ["Surabaya", "Jakarta", "Bandung", "Medan"],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Hewan terbesar di dunia adalah?",
          options: ["Gajah", "Paus Biru", "Jerapah", "Hiu"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "Berapa benua di dunia?",
          options: ["5", "6", "7", "8"],
          correctAnswer: 2
        },
        {
          id: 4,
          question: "Mata uang Indonesia adalah?",
          options: ["Ringgit", "Rupiah", "Dong", "Baht"],
          correctAnswer: 1
        },
        {
          id: 5,
          question: "Negara dengan populasi terbesar di dunia?",
          options: ["India", "China", "Amerika", "Indonesia"],
          correctAnswer: 1
        }
      ],
      random: [
        {
          id: 1,
          question: "Berapakah hasil dari 12 + 8?",
          options: ["18", "20", "22", "24"],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Siapa presiden pertama Indonesia?",
          options: ["Soeharto", "Soekarno", "Habibie", "Megawati"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: "Berapa pemain dalam tim basket?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 1
        },
        {
          id: 4,
          question: "Apa rumus kimia garam?",
          options: ["NaCl", "H2O", "CO2", "O2"],
          correctAnswer: 0
        },
        {
          id: 5,
          question: "Negara terkecil di dunia adalah?",
          options: ["Monaco", "Vatikan", "San Marino", "Liechtenstein"],
          correctAnswer: 1
        }
      ]
    };
    
    return questionBank[cat as keyof typeof questionBank] || questionBank.random;
  };

  const questions = getQuestionsByCategory(category);

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
          <div className="text-center flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            <div>
              <p className="text-xs font-nunito text-muted-foreground">Next Award</p>
              <p className="text-sm font-nunito font-bold text-foreground">+50 pts</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizInterface;