'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getUserTimezone, TIMEZONES } from '@/lib/timezone';

interface TimezoneDisplayProps {
  date: Date | string;
  className?: string;
  showSelector?: boolean;
}

export function TimezoneDisplay({ date, className, showSelector = false }: TimezoneDisplayProps) {
  const [timezone, setTimezone] = useState<string>('Europe/Paris');
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    setTimezone(getUserTimezone());
  }, []);

  useEffect(() => {
    const d = new Date(date);
    const formatted = d.toLocaleString('fr-FR', {
      timeZone: timezone,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    setFormattedTime(formatted);
  }, [date, timezone]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-zinc-300 text-sm">
        <span className="text-zinc-500">📅</span> {formattedTime}
      </div>
      {showSelector && (
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-1.5 focus:ring-red-500 focus:border-red-500"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default TimezoneDisplay;
