import { prisma } from '@/lib/db';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendrier MMA - Tous les Événements à Venir',
  description: 'Calendrier complet des événements MMA. UFC, Bellator, ONE Championship, PFL - dates, lieux et cartes complètes.',
};

async function getEventsByMonth() {
  try {
    const events = await prisma.event.findMany({
      where: {
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
          where: {
            cardType: {
              in: ['main_event', 'co_main'],
            },
          },
          orderBy: {
            scheduledTime: 'asc',
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    // Group events by month
    const grouped: Record<string, typeof events> = {};
    events.forEach((event) => {
      const date = new Date(event.startDate);
      const monthLabel = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthLabel]) {
        grouped[monthLabel] = [];
      }
      grouped[monthLabel].push(event);
    });

    return grouped;
  } catch {
    return {};
  }
}

export default async function CalendarPage() {
  const eventsByMonth = await getEventsByMonth();
  const months = Object.keys(eventsByMonth);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Calendrier des Événements MMA
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Retrouvez tous les événements MMA à venir. Main events, lieux, horaires - 
            tout pour planifier vos soirées combat.
          </p>
        </div>
      </section>

      {/* Calendar View */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {months.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📅</span>
              <h2 className="text-xl font-medium text-white mb-2">
                Aucun événement à venir
              </h2>
              <p className="text-zinc-500">
                Les prochains événements seront affichés ici dès qu&apos;ils seront annoncés.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {months.map((month) => (
                <div key={month}>
                  <h2 className="text-xl font-bold text-white mb-6 capitalize flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {month}
                  </h2>
                  
                  <div className="space-y-4">
                    {eventsByMonth[month].map((event) => {
                      const mainEvent = event.fights.find(f => f.cardType === 'main_event');
                      const coMain = event.fights.find(f => f.cardType === 'co_main');
                      
                      return (
                        <div 
                          key={event.id}
                          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6 hover:border-zinc-700 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Date */}
                            <div className="flex-shrink-0 w-20 text-center">
                              <div className="bg-zinc-800 rounded-lg p-2">
                                <div className="text-2xl font-bold text-white">
                                  {new Date(event.startDate).getDate()}
                                </div>
                                <div className="text-xs text-zinc-500 uppercase">
                                  {new Date(event.startDate).toLocaleDateString('fr-FR', { weekday: 'short' })}
                                </div>
                              </div>
                            </div>
                            
                            {/* Event Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                                  {event.organization.name}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-white truncate">
                                <a 
                                  href={`/evenement/${event.slug}`}
                                  className="hover:text-red-500 transition-colors"
                                >
                                  {event.name}
                                </a>
                              </h3>
                              <p className="text-sm text-zinc-500">
                                📍 {[event.venue, event.city, event.country].filter(Boolean).join(', ')}
                              </p>
                            </div>
                            
                            {/* Main Event */}
                            {mainEvent && (
                              <div className="flex-shrink-0 bg-zinc-800/50 rounded-lg p-3 min-w-0">
                                <div className="text-xs text-zinc-500 mb-1">MAIN EVENT</div>
                                <div className="text-sm text-white font-medium">
                                  {mainEvent.fighter1.firstName} {mainEvent.fighter1.lastName}
                                  <span className="text-zinc-500 mx-1">vs</span>
                                  {mainEvent.fighter2.firstName} {mainEvent.fighter2.lastName}
                                </div>
                                {mainEvent.isTitleFight && (
                                  <span className="text-xs text-yellow-500 mt-1 inline-block">
                                    🏆 Combat pour le titre
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Time */}
                            <div className="flex-shrink-0 text-right">
                              <div className="text-lg font-mono text-white">
                                {new Date(event.startDate).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                              <div className="text-xs text-zinc-500">
                                Heure locale
                              </div>
                            </div>
                          </div>
                          
                          {/* Co-Main */}
                          {coMain && (
                            <div className="mt-3 pt-3 border-t border-zinc-800">
                              <span className="text-xs text-zinc-500">CO-MAIN: </span>
                              <span className="text-sm text-zinc-300">
                                {coMain.fighter1.firstName} {coMain.fighter1.lastName} vs {coMain.fighter2.firstName} {coMain.fighter2.lastName}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
