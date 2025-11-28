import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { FightCard } from '@/components/FightCard';
import { CalendarExport } from '@/components/CalendarExport';
import { AlertSubscribe } from '@/components/AlertSubscribe';
import { CountdownTimer } from '@/components/CountdownTimer';
import { LiveIndicator } from '@/components/LiveIndicator';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatTime, isLive, isUpcoming, getCardTypeLabel } from '@/lib/utils';
import { generateEventMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string) {
  try {
    return await prisma.event.findUnique({
      where: { slug },
      include: {
        organization: true,
        fights: {
          include: {
            fighter1: true,
            fighter2: true,
            winner: true,
          },
          orderBy: [
            { cardType: 'asc' },
            { scheduledTime: 'desc' },
          ],
        },
        broadcasts: {
          include: {
            broadcaster: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  
  if (!event) {
    return {
      title: 'Événement non trouvé',
    };
  }

  return generateEventMetadata(event);
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const eventIsLive = event.status === 'live' || isLive(event.startDate, event.endDate);
  const eventIsUpcoming = event.status === 'upcoming' || isUpcoming(event.startDate);
  
  // Group fights by card type
  const mainEvent = event.fights.filter(f => f.cardType === 'main_event');
  const coMain = event.fights.filter(f => f.cardType === 'co_main');
  const mainCard = event.fights.filter(f => f.cardType === 'main_card');
  const prelims = event.fights.filter(f => f.cardType === 'prelims');
  const earlyPrelims = event.fights.filter(f => f.cardType === 'early_prelims');

  const fightGroups = [
    { title: 'Main Event', fights: mainEvent },
    { title: 'Co-Main Event', fights: coMain },
    { title: 'Main Card', fights: mainCard },
    { title: 'Préliminaires', fights: prelims },
    { title: 'Early Prelims', fights: earlyPrelims },
  ].filter(group => group.fights.length > 0);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <section className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 py-12 sm:py-16">
        {event.posterUrl && (
          <div 
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.posterUrl})` }}
          />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-zinc-500 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li className="text-zinc-600">/</li>
              <li>
                <Link href="/calendrier" className="text-zinc-500 hover:text-white transition-colors">
                  Calendrier
                </Link>
              </li>
              <li className="text-zinc-600">/</li>
              <li className="text-zinc-300">{event.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Event Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
                  {event.organization.name}
                </span>
                {eventIsLive && <LiveIndicator />}
                {eventIsUpcoming && <Badge variant="upcoming">À venir</Badge>}
                {event.status === 'completed' && <Badge variant="completed">Terminé</Badge>}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {event.name}
              </h1>
              
              <div className="space-y-2 text-zinc-400">
                <p className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{formatDate(event.startDate)}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>{formatTime(event.startDate)} (heure locale)</span>
                </p>
                {(event.venue || event.city) && (
                  <p className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{[event.venue, event.city, event.country].filter(Boolean).join(', ')}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Countdown / Actions */}
            <div className="lg:text-right">
              {eventIsUpcoming && (
                <div className="mb-6">
                  <p className="text-sm text-zinc-500 mb-2">Commence dans</p>
                  <CountdownTimer targetDate={event.startDate} variant="compact" />
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <CalendarExport
                  eventId={event.id}
                  eventName={event.name}
                  eventDate={event.startDate}
                  venue={event.venue}
                  city={event.city}
                  country={event.country}
                />
                <AlertSubscribe eventId={event.id} eventName={event.name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Broadcasters */}
      {event.broadcasts.length > 0 && (
        <section className="py-8 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              📺 Où regarder en streaming légal
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {event.broadcasts.map((broadcast) => (
                <div
                  key={broadcast.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    {broadcast.broadcaster.logoUrl ? (
                      <img
                        src={broadcast.broadcaster.logoUrl}
                        alt={broadcast.broadcaster.name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <span className="text-xl">📺</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {broadcast.broadcaster.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      {broadcast.broadcaster.isFree ? (
                        <span className="text-green-500">Gratuit</span>
                      ) : broadcast.isPpv ? (
                        <span className="text-yellow-500">
                          PPV {broadcast.price && `- ${broadcast.price}€`}
                        </span>
                      ) : (
                        <span className="text-zinc-500">Abonnement requis</span>
                      )}
                      {broadcast.cardType && (
                        <span className="text-zinc-600">• {getCardTypeLabel(broadcast.cardType)}</span>
                      )}
                    </div>
                  </div>
                  {broadcast.streamUrl && (
                    <a
                      href={broadcast.streamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                    >
                      <Button variant="primary" size="sm">
                        Regarder
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fight Card */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Carte Complète {event.name}
          </h2>
          <p className="text-zinc-500 mb-8">
            Main Card et Préliminaires - {event.fights.length} combat{event.fights.length > 1 ? 's' : ''}
          </p>

          <div className="space-y-10">
            {fightGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-500 rounded"></span>
                  {group.title}
                </h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {group.fights.map((fight) => (
                    <FightCard
                      key={fight.id}
                      fight={{
                        ...fight,
                        event: {
                          ...event,
                          organization: event.organization,
                        },
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-zinc-900/30 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Horaires {event.name} en France (Heure Française)
          </h2>
          <div className="prose prose-invert prose-zinc max-w-none">
            <p className="text-zinc-400">
              {event.name} se déroulera le {formatDate(event.startDate)} à {formatTime(event.startDate)} (heure française).
              {event.venue && ` L'événement aura lieu ${event.venue}`}
              {event.city && ` à ${event.city}`}
              {event.country && `, ${event.country}`}.
            </p>
            {mainEvent.length > 0 && (
              <p className="text-zinc-400">
                Le Main Event opposera {mainEvent[0].fighter1.firstName} {mainEvent[0].fighter1.lastName} à {mainEvent[0].fighter2.firstName} {mainEvent[0].fighter2.lastName}
                {mainEvent[0].isTitleFight && ' dans un combat pour le titre'}.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
