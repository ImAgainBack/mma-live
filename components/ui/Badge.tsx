'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'live' | 'upcoming' | 'completed' | 'title' | 'ppv';
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-zinc-700 text-zinc-200': variant === 'default',
          'bg-red-600 text-white animate-pulse': variant === 'live',
          'bg-orange-500 text-white': variant === 'upcoming',
          'bg-zinc-600 text-zinc-300': variant === 'completed',
          'bg-yellow-500 text-black font-bold': variant === 'title',
          'bg-purple-600 text-white': variant === 'ppv',
        },
        className
      )}
    >
      {variant === 'live' && (
        <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-ping" />
      )}
      {children}
    </span>
  );
}

export default Badge;
