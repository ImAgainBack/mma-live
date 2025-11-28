// SEO utilities for MMA Live

import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: 'MMA Live - Combats MMA en Direct | Streaming Légal',
    template: '%s | MMA Live',
  },
  description:
    'Retrouvez tous les combats MMA diffusés en direct légalement. UFC, Bellator, ONE, PFL - horaires, liens streaming et calendrier complet.',
  keywords: [
    'MMA',
    'UFC',
    'Bellator',
    'ONE Championship',
    'PFL',
    'combat',
    'streaming',
    'direct',
    'live',
    'horaires',
    'calendrier',
  ],
  authors: [{ name: 'MMA Live' }],
  creator: 'MMA Live',
  publisher: 'MMA Live',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'MMA Live',
    title: 'MMA Live - Combats MMA en Direct | Streaming Légal',
    description:
      'Retrouvez tous les combats MMA diffusés en direct légalement. UFC, Bellator, ONE, PFL - horaires, liens streaming et calendrier complet.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MMA Live - Combats MMA en Direct | Streaming Légal',
    description:
      'Retrouvez tous les combats MMA diffusés en direct légalement. UFC, Bellator, ONE, PFL - horaires, liens streaming et calendrier complet.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export function generateEventMetadata(event: {
  name: string;
  startDate: Date | string;
  venue?: string | null;
  city?: string | null;
  country?: string | null;
  organization?: { name: string };
  fights?: { fighter1?: { firstName: string; lastName: string }; fighter2?: { firstName: string; lastName: string }; cardType?: string | null }[];
}): Metadata {
  const mainEvent = event.fights?.find(f => f.cardType === 'main_event');
  const mainEventStr = mainEvent
    ? `${mainEvent.fighter1?.firstName} ${mainEvent.fighter1?.lastName} vs ${mainEvent.fighter2?.firstName} ${mainEvent.fighter2?.lastName}`
    : '';

  const title = `${event.name} en Direct - Où Regarder le Combat Ce Soir`;
  const description = `${event.name} en direct : horaires français, carte complète et liens pour regarder légalement.${
    mainEventStr ? ` Main event: ${mainEventStr}.` : ''
  }`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function generateFighterMetadata(fighter: {
  firstName: string;
  lastName: string;
  nickname?: string | null;
  weightClass?: string | null;
  nationality?: string | null;
  recordWins: number;
  recordLosses: number;
  recordDraws: number;
}): Metadata {
  const fullName = fighter.nickname
    ? `${fighter.firstName} "${fighter.nickname}" ${fighter.lastName}`
    : `${fighter.firstName} ${fighter.lastName}`;
  
  const record = fighter.recordDraws > 0
    ? `${fighter.recordWins}-${fighter.recordLosses}-${fighter.recordDraws}`
    : `${fighter.recordWins}-${fighter.recordLosses}`;

  const title = `${fullName} - Profil et Combats MMA`;
  const description = `Découvrez le profil de ${fullName}. Record: ${record}.${
    fighter.weightClass ? ` Catégorie: ${fighter.weightClass}.` : ''
  }${fighter.nationality ? ` Nationalité: ${fighter.nationality}.` : ''} Prochain combat et historique.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export function generateEventSnippet(event: {
  name: string;
  startDate: Date | string;
  venue?: string | null;
  city?: string | null;
  country?: string | null;
  fights?: { fighter1?: { firstName: string; lastName: string }; fighter2?: { firstName: string; lastName: string }; cardType?: string | null }[];
}): string {
  const date = new Date(event.startDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  const time = new Date(event.startDate).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const location = [event.venue, event.city, event.country].filter(Boolean).join(', ');
  const mainEvent = event.fights?.find(f => f.cardType === 'main_event');
  const mainEventStr = mainEvent
    ? `${mainEvent.fighter1?.firstName} ${mainEvent.fighter1?.lastName} vs ${mainEvent.fighter2?.firstName} ${mainEvent.fighter2?.lastName}`
    : '';

  return `📺 ${event.name} - ${date}
🕐 Main Card : ${time}
📍 ${location || 'Lieu à confirmer'}${mainEventStr ? `
🎯 Main Event : ${mainEventStr}` : ''}`;
}
