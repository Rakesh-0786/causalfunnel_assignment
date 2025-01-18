import React, { useState, useEffect } from 'react';
import { EmailForm } from './components/EmailForm';
import { Timer } from './components/Timer';
import { QuestionNavigation } from './components/QuestionNavigation';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizReport } from './components/QuizReport';
import { Question, QuizState } from './types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const QUIZ_TIME = 30 * 60; // 30 minutes in seconds

function App() {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    answers: {},
    visitedQuestions: new Set([0]),
    timeRemaining: QUIZ_TIME,
    email: '',
    isComplete: false,
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://opentdb.com/api.php?amount=15');
      const data = await response.json();
      
      if (data.response_code === 0) {
        setQuizState(prev => ({
          ...prev,
          questions: data.results,
        }));
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (email: string) => {
    setQuizState(prev => ({
      ...prev,
      email,
    }));
    await fetchQuestions();
  };

  const handleAnswer = (answer: string) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion]: answer,
      },
    }));
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestion(index);
    setQuizState(prev => ({
      ...prev,
      visitedQuestions: new Set([...prev.visitedQuestions, index]),
    }));
  };

  const handleTimeUp = () => {
    setQuizState(prev => ({
      ...prev,
      isComplete: true,
    }));
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentQuestion - 1 : currentQuestion + 1;
    if (newIndex >= 0 && newIndex < quizState.questions.length) {
      handleQuestionSelect(newIndex);
    }
  };

  if (!quizState.email) {
    return <EmailForm onSubmit={handleEmailSubmit} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading quiz questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (quizState.isComplete) {
    return (
      <QuizReport
        questions={quizState.questions}
        userAnswers={quizState.answers}
        email={quizState.email}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">Quiz</h1>
          <Timer
            timeRemaining={quizState.timeRemaining}
            onTimeUp={handleTimeUp}
            setTimeRemaining={(time) => setQuizState(prev => ({ ...prev, timeRemaining: time }))}
          />
        </div>

        <QuestionNavigation
          totalQuestions={quizState.questions.length}
          currentQuestion={currentQuestion}
          visitedQuestions={quizState.visitedQuestions}
          answeredQuestions={quizState.answers}
          onQuestionSelect={handleQuestionSelect}
        />

        <div className="bg-white p-6 rounded-lg shadow-md">
          {quizState.questions[currentQuestion] && (
            <QuizQuestion
              question={quizState.questions[currentQuestion]}
              currentAnswer={quizState.answers[currentQuestion]}
              onAnswer={handleAnswer}
            />
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => handleNavigate('prev')}
            disabled={currentQuestion === 0}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => handleNavigate('next')}
            disabled={currentQuestion === quizState.questions.length - 1}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              ${
                currentQuestion === quizState.questions.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }
            `}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;