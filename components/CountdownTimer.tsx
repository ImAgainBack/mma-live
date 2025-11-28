'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: Date | string;
  onComplete?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ 
  targetDate, 
  onComplete, 
  className,
  variant = 'default' 
}: CountdownTimerProps) {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        setIsComplete(true);
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, onComplete]);

  if (isComplete) {
    return (
      <div className={cn('text-red-500 font-bold animate-pulse', className)}>
        EN DIRECT MAINTENANT!
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('text-zinc-300 font-mono text-sm', className)}>
        {timeLeft.days > 0 && `${timeLeft.days}j `}
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-2 sm:gap-4', className)}>
      <TimeBlock value={timeLeft.days} label="Jours" />
      <TimeBlock value={timeLeft.hours} label="Heures" />
      <TimeBlock value={timeLeft.minutes} label="Minutes" />
      <TimeBlock value={timeLeft.seconds} label="Secondes" />
    </div>
  );
}

interface TimeBlockProps {
  value: number;
  label: string;
}

function TimeBlock({ value, label }: TimeBlockProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-zinc-800 rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-w-[50px] sm:min-w-[70px]">
        <span className="text-xl sm:text-3xl font-bold text-white font-mono">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-zinc-500 mt-1">{label}</span>
    </div>
  );
}

export default CountdownTimer;
