'use client';

import Link from 'next/link';
import { cn, getFighterRecord, getCardTypeLabel, formatTime, isLive as checkIsLive } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LiveIndicator } from '@/components/LiveIndicator';

interface FightCardFighter {
  id: number;
  firstName: string;
  lastName: string;
  nickname?: string | null;
  photoUrl?: string | null;
  recordWins: number;
  recordLosses: number;
  recordDraws: number;
  slug: string;
}

interface FightCardEvent {
  slug: string;
  startDate: Date | string;
  organization: {
    name: string;
  };
}

interface FightCardFight {
  id: number;
  status: string;
  scheduledTime?: Date | string | null;
  weightClass?: string | null;
  isTitleFight: boolean;
  cardType?: string | null;
  scheduledRounds: number;
  winnerId?: number | null;
  method?: string | null;
  roundEnded?: number | null;
  timeEnded?: string | null;
  fighter1: FightCardFighter;
  fighter2: FightCardFighter;
  event: FightCardEvent;
}

interface FightCardProps {
  fight: FightCardFight;
  showEvent?: boolean;
  className?: string;
}

export function FightCard({ fight, showEvent = false, className }: FightCardProps) {
  const isLive = fight.status === 'live' || checkIsLive(fight.scheduledTime || fight.event.startDate);
  const isCompleted = fight.status === 'completed';
  const isUpcoming = fight.status === 'scheduled';

  return (
    <Card 
      variant="glass" 
      padding="none" 
      className={cn(
        'overflow-hidden hover:border-zinc-700 transition-all duration-300',
        isLive && 'ring-2 ring-red-500/50',
        className
      )}
    >
      {/* Header */}
      <div className="bg-zinc-800/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showEvent && (
            <Link 
              href={`/evenement/${fight.event.slug}`}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {fight.event.organization.name}
            </Link>
          )}
          {fight.isTitleFight && <Badge variant="title">TITRE</Badge>}
          {fight.cardType && (
            <span className="text-xs text-zinc-500">{getCardTypeLabel(fight.cardType)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isLive && <LiveIndicator size="sm" />}
          {isUpcoming && <Badge variant="upcoming">À venir</Badge>}
          {isCompleted && <Badge variant="completed">Terminé</Badge>}
        </div>
      </div>

      {/* Fighters */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Fighter 1 */}
          <FighterInfo 
            fighter={fight.fighter1} 
            isWinner={fight.winnerId === fight.fighter1.id}
            isCompleted={isCompleted}
            align="left"
          />

          {/* VS */}
          <div className="flex flex-col items-center">
            <span className="text-zinc-500 font-bold text-lg">VS</span>
            {fight.weightClass && (
              <span className="text-xs text-zinc-500 mt-1">{fight.weightClass}</span>
            )}
            {fight.scheduledRounds && (
              <span className="text-xs text-zinc-600 mt-0.5">
                {fight.scheduledRounds} rounds
              </span>
            )}
          </div>

          {/* Fighter 2 */}
          <FighterInfo 
            fighter={fight.fighter2} 
            isWinner={fight.winnerId === fight.fighter2.id}
            isCompleted={isCompleted}
            align="right"
          />
        </div>

        {/* Result */}
        {isCompleted && fight.method && (
          <div className="mt-4 pt-3 border-t border-zinc-800 text-center">
            <span className="text-sm text-zinc-400">
              {fight.method}
              {fight.roundEnded && ` - R${fight.roundEnded}`}
              {fight.timeEnded && ` (${fight.timeEnded})`}
            </span>
          </div>
        )}

        {/* Time & Actions */}
        {isUpcoming && fight.scheduledTime && (
          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              🕐 {formatTime(fight.scheduledTime)}
            </span>
            <Button variant="outline" size="sm">
              Où regarder
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

interface FighterInfoProps {
  fighter: {
    id: number;
    firstName: string;
    lastName: string;
    nickname?: string | null;
    photoUrl?: string | null;
    recordWins: number;
    recordLosses: number;
    recordDraws: number;
    slug: string;
  };
  isWinner: boolean;
  isCompleted: boolean;
  align: 'left' | 'right';
}

function FighterInfo({ fighter, isWinner, isCompleted, align }: FighterInfoProps) {
  const record = getFighterRecord(fighter.recordWins, fighter.recordLosses, fighter.recordDraws);
  
  return (
    <div className={cn(
      'flex-1 flex flex-col gap-2',
      align === 'right' ? 'items-end text-right' : 'items-start text-left'
    )}>
      {/* Photo placeholder */}
      <div className={cn(
        'w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden',
        isCompleted && isWinner && 'ring-2 ring-green-500'
      )}>
        {fighter.photoUrl ? (
          <img 
            src={fighter.photoUrl} 
            alt={`${fighter.firstName} ${fighter.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl text-zinc-600">👤</span>
        )}
      </div>
      
      {/* Name */}
      <Link 
        href={`/fighter/${fighter.slug}`}
        className="hover:text-red-500 transition-colors"
      >
        <div className="font-semibold text-white text-sm sm:text-base">
          {fighter.firstName} {fighter.lastName}
        </div>
        {fighter.nickname && (
          <div className="text-xs text-zinc-500">&ldquo;{fighter.nickname}&rdquo;</div>
        )}
      </Link>
      
      {/* Record */}
      <div className="text-sm text-zinc-400">{record}</div>
      
      {/* Winner badge */}
      {isCompleted && isWinner && (
        <Badge variant="live" className="bg-green-600">VAINQUEUR</Badge>
      )}
    </div>
  );
}

export default FightCard;
