import React from 'react';
import { Question } from '../types';

interface QuizQuestionProps {
  question: Question;
  currentAnswer: string | undefined;
  onAnswer: (answer: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  currentAnswer,
  onAnswer,
}) => {
  const allAnswers = [...question.incorrect_answers, question.correct_answer]
    .sort(() => Math.random() - 0.5);

  return (
    <div className="space-y-6">
      <h2 
        className="text-xl font-semibold"
        dangerouslySetInnerHTML={{ __html: question.question }}
      />
      <div className="space-y-3">
        {allAnswers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswer(answer)}
            className={`
              w-full p-4 text-left rounded-lg border transition-all
              ${
                currentAnswer === answer
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }
            `}
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        ))}
      </div>
    </div>
  );
};