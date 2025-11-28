import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = 'fr-FR'): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string, locale: string = 'fr-FR'): string {
  const d = new Date(date);
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: Date | string, locale: string = 'fr-FR'): string {
  return `${formatDate(date, locale)} à ${formatTime(date, locale)}`;
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    return 'Terminé';
  }

  if (diffMins < 60) {
    return `Dans ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  }

  if (diffHours < 24) {
    return `Dans ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  }

  return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function getFighterRecord(wins: number, losses: number, draws: number): string {
  if (draws > 0) {
    return `${wins}-${losses}-${draws}`;
  }
  return `${wins}-${losses}`;
}

export function getCardTypeLabel(cardType: string | null): string {
  const labels: Record<string, string> = {
    main_event: 'Main Event',
    co_main: 'Co-Main Event',
    main_card: 'Main Card',
    prelims: 'Préliminaires',
    early_prelims: 'Early Prelims',
  };
  return cardType ? labels[cardType] || cardType : '';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    upcoming: 'À venir',
    live: 'En direct',
    completed: 'Terminé',
    scheduled: 'Programmé',
    cancelled: 'Annulé',
  };
  return labels[status] || status;
}

export function isLive(startDate: Date | string, endDate?: Date | string | null): boolean {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 5 * 60 * 60 * 1000); // Default 5 hours
  return now >= start && now <= end;
}

export function isUpcoming(startDate: Date | string): boolean {
  const now = new Date();
  const start = new Date(startDate);
  return start > now;
}

export function isToday(date: Date | string): boolean {
  const now = new Date();
  const target = new Date(date);
  return (
    now.getDate() === target.getDate() &&
    now.getMonth() === target.getMonth() &&
    now.getFullYear() === target.getFullYear()
  );
}

export function isTomorrow(date: Date | string): boolean {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const target = new Date(date);
  return (
    tomorrow.getDate() === target.getDate() &&
    tomorrow.getMonth() === target.getMonth() &&
    tomorrow.getFullYear() === target.getFullYear()
  );
}
