import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MockTestQuestionsProps {
  test: any;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const MockTestQuestions = ({ test, onComplete, onBack }: MockTestQuestionsProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [timeRemaining, setTimeRemaining] = useState(test.duration * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const questions = [
    {
      id: 1,
      question: "What is 25% of 400?",
      options: ["75", "100", "125", "150"],
      correctAnswer: 1,
      category: "Mathematics"
    },
    {
      id: 2,
      question: "Which of the following is the capital of Odisha?",
      options: ["Cuttack", "Bhubaneswar", "Puri", "Berhampur"],
      correctAnswer: 1,
      category: "General Knowledge"
    },
    {
      id: 3,
      question: "What does 'CPU' stand for?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit", "Computer Processing Unit"],
      correctAnswer: 0,
      category: "Computer Knowledge"
    },
    {
      id: 4,
      question: "If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?",
      options: ["120 km", "130 km", "140 km", "150 km"],
      correctAnswer: 3,
      category: "Mathematics"
    },
    {
      id: 5,
      question: "Who is the current Prime Minister of India?",
      options: ["Rahul Gandhi", "Narendra Modi", "Amit Shah", "Yogi Adityanath"],
      correctAnswer: 1,
      category: "Current Affairs"
    },
    {
      id: 6,
      question: "What is the next number in the sequence: 2, 4, 8, 16, ?",
      options: ["24", "28", "32", "36"],
      correctAnswer: 2,
      category: "Reasoning"
    },
    {
      id: 7,
      question: "Which file extension is used for Microsoft Word documents?",
      options: [".txt", ".pdf", ".docx", ".xlsx"],
      correctAnswer: 2,
      category: "Computer Knowledge"
    },
    {
      id: 8,
      question: "In which year did India gain independence?",
      options: ["1945", "1946", "1947", "1948"],
      correctAnswer: 2,
      category: "General Knowledge"
    },
    {
      id: 9,
      question: "If 3x + 5 = 20, what is the value of x?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 2,
      category: "Mathematics"
    },
    {
      id: 10,
      question: "Which of the following is NOT a programming language?",
      options: ["Java", "Python", "HTML", "Adobe"],
      correctAnswer: 3,
      category: "Computer Knowledge"
    }
  ];

  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitTest();
    }
  }, [timeRemaining, isCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = () => {
    const score = calculateScore();
    setIsCompleted(true);
    
    toast({
      title: "Test Completed!",
      description: `You scored ${score}% on the ${test.title}`,
    });

    setTimeout(() => {
      onComplete(score);
    }, 3000);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(selectedAnswers).length;

  if (isCompleted) {
    const score = calculateScore();
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center border-2 border-green-300">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Test Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-green-600">{score}%</div>
            <p className="text-gray-600">
              You answered {Object.keys(selectedAnswers).length} out of {questions.length} questions
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                Great job! Your results have been saved and you'll be redirected shortly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="border-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{test.title}</h2>
            <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-red-600">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-xl">{formatTime(timeRemaining)}</span>
          </div>
          <div className="text-sm text-gray-600">
            Answered: {answeredQuestions}/{questions.length}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-2 border-blue-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">
              Q{currentQuestion + 1}. {currentQ.question}
            </CardTitle>
            <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
              {currentQ.category}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-4 text-left rounded-lg border-2 transition-all hover:bg-gray-50 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="border-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {currentQuestion === questions.length - 1 ? (
            <Button 
              onClick={handleSubmitTest}
              className="bg-green-600 hover:bg-green-700 border-2 border-green-400"
            >
              Submit Test
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 border-2 border-blue-400"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockTestQuestions;
