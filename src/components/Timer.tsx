import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  onTimeUp: () => void;
  setTimeRemaining: (time: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ timeRemaining, onTimeUp, setTimeRemaining }) => {
  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + (timeRemaining * 1000);

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

      if (remaining <= 0) {
        clearInterval(timer);
        onTimeUp();
        setTimeRemaining(0);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Only run once when component mounts

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="flex items-center gap-2 text-xl font-semibold">
      <Clock className="w-6 h-6" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};