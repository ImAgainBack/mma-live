'use client';

import Link from 'next/link';
import { cn, formatDate, formatTime, isLive, isToday } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LiveIndicator } from '@/components/LiveIndicator';
import type { Event, Organization, Fight, Fighter } from '@/types';

interface EventCardProps {
  event: Event & {
    organization: Organization;
    fights?: (Fight & {
      fighter1: Fighter;
      fighter2: Fighter;
    })[];
  };
  variant?: 'default' | 'compact';
  className?: string;
}

export function EventCard({ event, variant = 'default', className }: EventCardProps) {
  const eventIsLive = event.status === 'live' || isLive(event.startDate, event.endDate);
  const eventIsToday = isToday(event.startDate);
  
  const mainEvent = event.fights?.find(f => f.cardType === 'main_event');
  const totalFights = event.fights?.length || 0;

  if (variant === 'compact') {
    return (
      <Link href={`/evenement/${event.slug}`}>
        <Card 
          variant="bordered" 
          padding="sm"
          className={cn(
            'hover:bg-zinc-800/50 transition-all cursor-pointer',
            eventIsLive && 'ring-2 ring-red-500/50',
            className
          )}
        >
          <div className="flex items-center gap-3">
            {/* Organization logo */}
            <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
              {event.organization.logoUrl ? (
                <img 
                  src={event.organization.logoUrl} 
                  alt={event.organization.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <span className="text-xs font-bold text-zinc-500">
                  {event.organization.name.slice(0, 3)}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white truncate">{event.name}</span>
                {eventIsLive && <LiveIndicator size="sm" />}
              </div>
              <div className="text-xs text-zinc-500">
                {formatDate(event.startDate)} • {formatTime(event.startDate)}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/evenement/${event.slug}`}>
      <Card 
        variant="glass" 
        padding="none"
        className={cn(
          'overflow-hidden hover:border-zinc-700 transition-all cursor-pointer group',
          eventIsLive && 'ring-2 ring-red-500/50',
          className
        )}
      >
        {/* Header with poster/gradient */}
        <div className="relative h-32 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
          {event.posterUrl && (
            <img 
              src={event.posterUrl} 
              alt={event.name}
              className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
            />
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {eventIsLive && <LiveIndicator size="sm" />}
            {eventIsToday && !eventIsLive && <Badge variant="upcoming">CE SOIR</Badge>}
          </div>
          
          {/* Organization badge */}
          <div className="absolute top-3 right-3">
            <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1">
              <span className="text-xs font-bold text-white">
                {event.organization.name}
              </span>
            </div>
          </div>
          
          {/* Event name overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 p-4">
            <h3 className="font-bold text-white text-lg truncate">{event.name}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Date & Location */}
          <div className="flex flex-col gap-1 mb-3">
            <div className="text-sm text-zinc-300">
              📅 {formatDate(event.startDate)} à {formatTime(event.startDate)}
            </div>
            {(event.venue || event.city) && (
              <div className="text-sm text-zinc-500">
                📍 {[event.venue, event.city, event.country].filter(Boolean).join(', ')}
              </div>
            )}
          </div>

          {/* Main Event */}
          {mainEvent && mainEvent.fighter1 && mainEvent.fighter2 && (
            <div className="bg-zinc-800/50 rounded-lg p-3 mb-3">
              <div className="text-xs text-zinc-500 mb-1">MAIN EVENT</div>
              <div className="text-sm font-medium text-white">
                {mainEvent.fighter1.firstName} {mainEvent.fighter1.lastName}
                <span className="text-zinc-500 mx-2">vs</span>
                {mainEvent.fighter2.firstName} {mainEvent.fighter2.lastName}
              </div>
              {mainEvent.isTitleFight && (
                <Badge variant="title" className="mt-2">Combat pour le titre</Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            <span className="text-xs text-zinc-500">
              {totalFights} combat{totalFights > 1 ? 's' : ''}
            </span>
            <span className="text-xs text-red-500 group-hover:text-red-400 transition-colors">
              Voir les détails →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default EventCard;
