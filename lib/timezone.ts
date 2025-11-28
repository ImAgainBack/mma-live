// Timezone utilities for MMA Live

export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Europe/Paris';
  }
}

export function convertToUserTimezone(date: Date | string, timezone?: string): Date {
  const d = new Date(date);
  if (!timezone) {
    return d;
  }
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(d);
  const dateMap: Record<string, string> = {};
  parts.forEach(part => {
    dateMap[part.type] = part.value;
  });
  
  return new Date(
    `${dateMap.year}-${dateMap.month}-${dateMap.day}T${dateMap.hour}:${dateMap.minute}:${dateMap.second}`
  );
}

export function formatInTimezone(
  date: Date | string, 
  timezone: string = 'Europe/Paris',
  format: 'time' | 'date' | 'datetime' = 'datetime'
): string {
  const d = new Date(date);
  
  const baseOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
  };
  
  if (format === 'time') {
    return d.toLocaleTimeString('fr-FR', {
      ...baseOptions,
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  if (format === 'date') {
    return d.toLocaleDateString('fr-FR', {
      ...baseOptions,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return d.toLocaleString('fr-FR', {
    ...baseOptions,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const TIMEZONES = [
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/London', label: 'Londres (GMT/BST)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Singapore', label: 'Singapour (SGT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
] as const;

export function getTimezoneOffset(timezone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    return offsetPart?.value || '';
  } catch {
    return '';
  }
}
