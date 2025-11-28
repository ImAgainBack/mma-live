import Link from 'next/link';
import { prisma } from '@/lib/db';
import { EventCard } from '@/components/EventCard';
import { FightCard } from '@/components/FightCard';
import { CountdownTimer } from '@/components/CountdownTimer';
import { LiveIndicator } from '@/components/LiveIndicator';
import { Button } from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Combats MMA en Direct - Où Regarder en Streaming Légal',
  description: 'Retrouvez tous les combats MMA diffusés en direct légalement. UFC, Bellator, ONE, PFL - horaires, liens streaming et calendrier complet.',
};

async function getLiveEvents() {
  try {
    return await prisma.event.findMany({
      where: {
        status: 'live',
      },
      include: {
        organization: true,
        fights: {
          include: {
            fighter1: true,
            fighter2: true,
          },
          orderBy: {
            scheduledTime: 'asc',
          },
        },
      },
    });
  } catch {
    return [];
  }
}

async function getUpcomingEvents() {
  try {
    return await prisma.event.findMany({
      where: {
        status: 'upcoming',
        startDate: {
          gte: new Date(),
        },
      },
      include: {
        organization: true,
        fights: {
          include: {
            fighter1: true,
            fighter2: true,
          },
          orderBy: {
            scheduledTime: 'asc',
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 10,
    });
  } catch {
    return [];
  }
}

async function getOrganizations() {
  try {
    return await prisma.organization.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const [liveEvents, upcomingEvents, organizations] = await Promise.all([
    getLiveEvents(),
    getUpcomingEvents(),
    getOrganizations(),
  ]);

  const nextEvent = upcomingEvents[0];
  const todayEvents = upcomingEvents.filter((event) => {
    const today = new Date();
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Combats MMA en Direct
              <span className="block text-red-500">Où Regarder en Streaming Légal</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Tous les combats MMA en direct, au même endroit. Fini de chercher où regarder l&apos;UFC, 
              Bellator ou ONE Championship. On te dit quand ça commence et comment regarder légalement.
            </p>
          </div>

          {/* Next Event Countdown */}
          {nextEvent && (
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-sm text-zinc-400">Prochain événement</span>
                <span className="text-sm font-medium text-white">{nextEvent.organization.name}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
                {nextEvent.name}
              </h2>
              <p className="text-zinc-500 text-center mb-6">
                {nextEvent.venue && `${nextEvent.venue}, `}
                {nextEvent.city && `${nextEvent.city}, `}
                {nextEvent.country}
              </p>
              <CountdownTimer targetDate={nextEvent.startDate} className="justify-center" />
              <div className="mt-6 flex justify-center">
                <Link href={`/evenement/${nextEvent.slug}`}>
                  <Button variant="primary" size="lg">
                    Voir les détails
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Organizations Filter Pills */}
      <section className="bg-zinc-950 py-6 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/">
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 text-white">
                Toutes
              </span>
            </Link>
            {organizations.map((org) => (
              <Link key={org.id} href={`/?org=${org.slug}`}>
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                  {org.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Events Section */}
      {liveEvents.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-red-950/20 to-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <LiveIndicator size="lg" />
              <h2 className="text-2xl font-bold text-white">EN DIRECT MAINTENANT</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {liveEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tonight's Events */}
      {todayEvents.length > 0 && (
        <section className="py-12 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">🌙</span>
              <h2 className="text-2xl font-bold text-white">CE SOIR</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {todayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section className="py-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <h2 className="text-2xl font-bold text-white">Prochains Événements</h2>
            </div>
            <Link href="/calendrier">
              <Button variant="ghost" size="sm">
                Voir tout →
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.slice(0, 6).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Event Fights Preview */}
      {upcomingEvents.length > 0 && upcomingEvents.some(e => e.fights.length > 0) && (
        <section className="py-12 bg-zinc-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">🥊</span>
              <h2 className="text-2xl font-bold text-white">Main Events à Venir</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {upcomingEvents
                .flatMap((event) =>
                  event.fights
                    .filter((fight) => fight.cardType === 'main_event')
                    .map((fight) => ({
                      ...fight,
                      event: {
                        ...event,
                        organization: event.organization,
                      },
                    }))
                )
                .slice(0, 4)
                .map((fight) => (
                  <FightCard key={fight.id} fight={fight} showEvent />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Us Section */}
      <section className="py-16 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            Pourquoi MMA Live ?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-600/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">📺</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Streaming 100% Légal
              </h3>
              <p className="text-zinc-400 text-sm">
                Tous les liens vers les diffuseurs officiels. RMC Sport, L&apos;Équipe, UFC Fight Pass - on te guide vers les bonnes sources.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-600/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🕐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Horaires Locaux
              </h3>
              <p className="text-zinc-400 text-sm">
                Fini les calculs de décalage horaire. On affiche automatiquement les heures de ta zone pour ne jamais rater un combat.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-600/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🔔</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Alertes Personnalisées
              </h3>
              <p className="text-zinc-400 text-sm">
                Reçois une notification avant chaque combat de ton fighter préféré. Email ou Telegram, à toi de choisir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
