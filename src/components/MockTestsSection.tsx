import React, { useState } from 'react';
import { Clock, HelpCircle, Award, Target, Play, RotateCcw, CheckCircle, X, FileText, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import MockTestQuestions from './MockTestQuestions';
import StudyMaterialsSection from './StudyMaterialsSection';

const MockTestsSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTest, setSelectedTest] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const { user } = useAuth();

  const isPremium = user?.subscriptionTier && user.subscriptionTier !== 'Basic';

  const categories = ['All', 'General Aptitude', 'English', 'Computer Skills', 'Current Affairs', 'Reasoning'];
  
  const tests = [
    {
      id: 1,
      title: 'General Aptitude Test 1',
      description: 'Basic arithmetic, reasoning, and logical thinking',
      duration: 60,
      questions: 50,
      difficulty: 'Easy',
      status: 'completed',
      score: 85,
      category: 'General Aptitude',
      color: 'bg-blue-100',
      isPremium: false
    },
    {
      id: 2,
      title: 'English Comprehension',
      description: 'Grammar, vocabulary, and reading comprehension',
      duration: 45,
      questions: 40,
      difficulty: 'Medium',
      status: 'completed', 
      score: 78,
      category: 'English',
      color: 'bg-blue-100',
      isPremium: false
    },
    {
      id: 3,
      title: 'Computer Awareness',
      description: 'Basic computer knowledge and digital literacy',
      duration: 30,
      questions: 30,
      difficulty: 'Easy',
      status: 'available',
      score: null,
      category: 'Computer Skills',
      color: 'bg-blue-100',
      isPremium: true
    },
    {
      id: 4,
      title: 'Current Affairs',
      description: 'Recent events and general knowledge',
      duration: 40,
      questions: 35,
      difficulty: 'Medium',
      status: 'available',
      score: null,
      category: 'Current Affairs',
      color: 'bg-blue-100',
      isPremium: true
    },
    {
      id: 5,
      title: 'Advanced Reasoning',
      description: 'Complex logical reasoning and problem solving',
      duration: 50,
      questions: 45,
      difficulty: 'Hard',
      status: 'available',
      score: null,
      category: 'Reasoning',
      color: 'bg-blue-100',
      isPremium: true
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredTests = tests.filter(test => 
    activeCategory === 'all' || test.category.toLowerCase().includes(activeCategory.toLowerCase())
  );

  const handleStartTest = (test) => {
    if (test.isPremium && !isPremium) {
      return;
    }
    setSelectedTest(test);
    setIsTestStarted(true);
  };

  const handleRetakeTest = (test) => {
    if (test.isPremium && !isPremium) {
      return;
    }
    setSelectedTest(test);
    setIsTestStarted(true);
  };

  const handleTestComplete = (score) => {
    setIsTestStarted(false);
    setSelectedTest(null);
    // Here you would typically update the test status and score
  };

  if (isTestStarted && selectedTest) {
    return (
      <MockTestQuestions 
        test={selectedTest}
        onComplete={handleTestComplete}
        onBack={() => setIsTestStarted(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mock Tests & Study Materials</h2>
          <p className="text-gray-600">Practice tests and study resources to improve your skills</p>
          {!isPremium && (
            <p className="text-sm text-orange-600 mt-1">
              🔒 Upgrade to Premium to access all mock tests and study materials
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Tests taken: 2 / {tests.length}</p>
          <Progress value={(2 / tests.length) * 100} className="w-32 mt-1" />
        </div>
      </div>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tests" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Mock Tests</span>
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Study Materials</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category.toLowerCase() ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.toLowerCase())}
                className={`border-2 ${
                  activeCategory === category.toLowerCase() 
                    ? "bg-gray-800 text-white border-gray-600" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Tests Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className={`w-12 h-12 ${test.color} rounded-lg flex items-center justify-center`}>
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={`${getDifficultyColor(test.difficulty)} border`}>
                        {test.difficulty}
                      </Badge>
                      {test.isPremium && (
                        <Badge className="bg-orange-100 text-orange-700 border border-orange-300 text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {test.duration} min
                    </div>
                    <div className="flex items-center">
                      <HelpCircle className="w-4 h-4 mr-1" />
                      {test.questions} Qs
                    </div>
                    {test.score && (
                      <div className="flex items-center text-green-600">
                        <Award className="w-4 h-4 mr-1" />
                        {test.score}%
                      </div>
                    )}
                  </div>

                  {test.status === 'completed' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Completed</span>
                        <span className="text-green-600 font-medium">Score: {test.score}%</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-2"
                        onClick={() => handleRetakeTest(test)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake
                      </Button>
                    </div>
                  ) : test.isPremium && !isPremium ? (
                    <div className="space-y-2">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-400" disabled>
                        <X className="w-4 h-4 mr-2" />
                        Premium Required
                      </Button>
                      <p className="text-xs text-orange-600 text-center">
                        Upgrade to access this test
                      </p>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-gray-800 hover:bg-gray-900 border-2 border-gray-600"
                      onClick={() => handleStartTest(test)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Test
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <StudyMaterialsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MockTestsSection;