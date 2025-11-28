'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ className, children, variant = 'default', padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300',
        {
          'bg-zinc-900': variant === 'default',
          'bg-zinc-900/50 backdrop-blur-sm border border-zinc-800': variant === 'glass',
          'bg-zinc-900 border border-zinc-800': variant === 'bordered',
        },
        {
          'p-0': padding === 'none',
          'p-3': padding === 'sm',
          'p-4': padding === 'md',
          'p-6': padding === 'lg',
        },
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-zinc-800', className)}>
      {children}
    </div>
  );
}

export default Card;
