// Type definitions for the MMA Live application

export interface Organization {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  createdAt: Date;
}

export interface Event {
  id: number;
  organizationId: number;
  name: string;
  slug: string;
  venue: string | null;
  city: string | null;
  country: string | null;
  startDate: Date;
  endDate: Date | null;
  posterUrl: string | null;
  status: string;
  createdAt: Date;
  organization?: Organization;
  fights?: Fight[];
  broadcasts?: EventBroadcast[];
}

export interface Fighter {
  id: number;
  firstName: string;
  lastName: string;
  nickname: string | null;
  slug: string;
  weightClass: string | null;
  nationality: string | null;
  recordWins: number;
  recordLosses: number;
  recordDraws: number;
  photoUrl: string | null;
  createdAt: Date;
}

export interface Fight {
  id: number;
  eventId: number;
  fighter1Id: number;
  fighter2Id: number;
  weightClass: string | null;
  isTitleFight: boolean;
  cardType: string | null;
  scheduledRounds: number;
  scheduledTime: Date | null;
  status: string;
  winnerId: number | null;
  method: string | null;
  roundEnded: number | null;
  timeEnded: string | null;
  createdAt: Date;
  event?: Event;
  fighter1?: Fighter;
  fighter2?: Fighter;
  winner?: Fighter | null;
}

export interface Broadcaster {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  isFree: boolean;
  countries: string[];
  createdAt: Date;
}

export interface EventBroadcast {
  id: number;
  eventId: number;
  broadcasterId: number;
  streamUrl: string | null;
  cardType: string | null;
  region: string | null;
  isPpv: boolean;
  price: number | null;
  event?: Event;
  broadcaster?: Broadcaster;
}

export interface UserAlert {
  id: number;
  email: string | null;
  telegramChatId: string | null;
  fighterId: number | null;
  eventId: number | null;
  alertType: 'email' | 'telegram' | 'push' | null;
  minutesBefore: number;
  createdAt: Date;
}

export interface UserFavorite {
  id: number;
  userSessionId: string;
  fighterId: number | null;
  organizationId: number | null;
  createdAt: Date;
}

// Extended types for UI components
export interface FightWithDetails extends Fight {
  fighter1: Fighter;
  fighter2: Fighter;
  event: Event & {
    organization: Organization;
  };
}

export interface EventWithDetails extends Event {
  organization: Organization;
  fights: (Fight & {
    fighter1: Fighter;
    fighter2: Fighter;
  })[];
  broadcasts: (EventBroadcast & {
    broadcaster: Broadcaster;
  })[];
}

// Filter types
export interface EventFilters {
  organizationId?: number;
  status?: 'upcoming' | 'live' | 'completed';
  startDate?: Date;
  endDate?: Date;
}

export interface FightFilters {
  eventId?: number;
  cardType?: string;
  isTitleFight?: boolean;
  status?: string;
}
