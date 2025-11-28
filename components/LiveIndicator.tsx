'use client';

import { cn } from '@/lib/utils';

interface LiveIndicatorProps {
  isLive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LiveIndicator({ isLive = true, size = 'md', className }: LiveIndicatorProps) {
  if (!isLive) return null;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 bg-red-600 text-white font-bold rounded-full',
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
          'px-4 py-1.5 text-base': size === 'lg',
        },
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      EN DIRECT
    </div>
  );
}

export default LiveIndicator;
