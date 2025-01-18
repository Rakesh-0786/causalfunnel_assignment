import React from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizReportProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  email: string;
}

export const QuizReport: React.FC<QuizReportProps> = ({
  questions,
  userAnswers,
  email,
}) => {
  const score = questions.reduce((acc, question, index) => {
    return acc + (userAnswers[index] === question.correct_answer ? 1 : 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center">Quiz Results</h1>
        <div className="text-center">
          <p className="text-gray-600">Email: {email}</p>
          <p className="text-xl font-semibold mt-2">
            Score: {score} out of {questions.length}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correct_answer;

          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex items-start gap-4">
                <span className="font-semibold text-gray-600">Q{index + 1}.</span>
                <div className="flex-1">
                  <p 
                    className="text-lg font-medium mb-4"
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  />
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Your Answer:</span>
                      <span 
                        className={`flex-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                        dangerouslySetInnerHTML={{ __html: userAnswer || 'Not answered' }}
                      />
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    
                    {!isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Correct Answer:</span>
                        <span 
                          className="flex-1 text-green-600"
                          dangerouslySetInnerHTML={{ __html: question.correct_answer }}
                        />
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};