import React from 'react';
import { Check, Eye } from 'lucide-react';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  visitedQuestions: Set<number>;
  answeredQuestions: Record<number, string>;
  onQuestionSelect: (index: number) => void;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  totalQuestions,
  currentQuestion,
  visitedQuestions,
  answeredQuestions,
  onQuestionSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-md">
      {Array.from({ length: totalQuestions }, (_, i) => (
        <button
          key={i}
          onClick={() => onQuestionSelect(i)}
          className={`
            relative w-10 h-10 flex items-center justify-center rounded-lg
            ${currentQuestion === i ? 'ring-2 ring-blue-500' : ''}
            ${
              visitedQuestions.has(i)
                ? 'bg-gray-100'
                : 'bg-white'
            }
            hover:bg-gray-100 transition-colors
          `}
        >
          <span className="text-sm font-medium">{i + 1}</span>
          {answeredQuestions[i] && (
            <Check className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
          )}
          {visitedQuestions.has(i) && !answeredQuestions[i] && (
            <Eye className="absolute -top-1 -right-1 w-4 h-4 text-blue-500" />
          )}
        </button>
      ))}
    </div>
  );
};