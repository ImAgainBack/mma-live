import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { FightCard } from '@/components/FightCard';
import { AlertSubscribe } from '@/components/AlertSubscribe';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { generateFighterMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getFighter(slug: string) {
  try {
    return await prisma.fighter.findUnique({
      where: { slug },
      include: {
        fightsAsFighter1: {
          include: {
            fighter1: true,
            fighter2: true,
            winner: true,
            event: {
              include: {
                organization: true,
              },
            },
          },
          orderBy: {
            scheduledTime: 'desc',
          },
        },
        fightsAsFighter2: {
          include: {
            fighter1: true,
            fighter2: true,
            winner: true,
            event: {
              include: {
                organization: true,
              },
            },
          },
          orderBy: {
            scheduledTime: 'desc',
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
  const fighter = await getFighter(slug);
  
  if (!fighter) {
    return {
      title: 'Fighter non trouvé',
    };
  }

  return generateFighterMetadata(fighter);
}

export default async function FighterPage({ params }: PageProps) {
  const { slug } = await params;
  const fighter = await getFighter(slug);

  if (!fighter) {
    notFound();
  }

  // Combine all fights and sort by date
  const allFights = [
    ...fighter.fightsAsFighter1,
    ...fighter.fightsAsFighter2,
  ].sort((a, b) => {
    const dateA = a.scheduledTime ? new Date(a.scheduledTime).getTime() : 0;
    const dateB = b.scheduledTime ? new Date(b.scheduledTime).getTime() : 0;
    return dateB - dateA;
  });

  const upcomingFights = allFights.filter(f => f.status === 'scheduled');
  const pastFights = allFights.filter(f => f.status === 'completed');
  const nextFight = upcomingFights[0];

  const fullName = fighter.nickname
    ? `${fighter.firstName} "${fighter.nickname}" ${fighter.lastName}`
    : `${fighter.firstName} ${fighter.lastName}`;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-zinc-500 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li className="text-zinc-600">/</li>
              <li className="text-zinc-300">{fighter.firstName} {fighter.lastName}</li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Fighter Photo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border-4 border-zinc-700">
                {fighter.photoUrl ? (
                  <img
                    src={fighter.photoUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">👤</span>
                )}
              </div>
            </div>

            {/* Fighter Info */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {fighter.firstName} {fighter.lastName}
              </h1>
              {fighter.nickname && (
                <p className="text-xl text-zinc-400 mb-4">&ldquo;{fighter.nickname}&rdquo;</p>
              )}

              <div className="flex flex-wrap gap-3 mb-6">
                {fighter.weightClass && (
                  <Badge variant="default" className="text-sm">
                    {fighter.weightClass}
                  </Badge>
                )}
                {fighter.nationality && (
                  <Badge variant="default" className="text-sm">
                    🌍 {fighter.nationality}
                  </Badge>
                )}
              </div>

              {/* Record */}
              <div className="bg-zinc-800/50 rounded-xl p-4 inline-block">
                <div className="text-sm text-zinc-500 mb-1">Record</div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{fighter.recordWins}</div>
                    <div className="text-xs text-zinc-500">Victoires</div>
                  </div>
                  <div className="text-zinc-600">-</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{fighter.recordLosses}</div>
                    <div className="text-xs text-zinc-500">Défaites</div>
                  </div>
                  {fighter.recordDraws > 0 && (
                    <>
                      <div className="text-zinc-600">-</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-zinc-400">{fighter.recordDraws}</div>
                        <div className="text-xs text-zinc-500">Nuls</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Alert Button */}
            <div className="flex-shrink-0">
              <AlertSubscribe
                fighterId={fighter.id}
                fighterName={`${fighter.firstName} ${fighter.lastName}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Next Fight */}
      {nextFight && (
        <section className="py-12 bg-gradient-to-b from-red-950/20 to-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🥊</span>
              Prochain Combat
            </h2>
            <div className="max-w-2xl">
              <FightCard
                fight={{
                  ...nextFight,
                  event: {
                    ...nextFight.event,
                    organization: nextFight.event.organization,
                  },
                }}
                showEvent
              />
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Fights */}
      {upcomingFights.length > 1 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-white mb-6">
              Autres Combats Programmés
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {upcomingFights.slice(1).map((fight) => (
                <FightCard
                  key={fight.id}
                  fight={{
                    ...fight,
                    event: {
                      ...fight.event,
                      organization: fight.event.organization,
                    },
                  }}
                  showEvent
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fight History */}
      <section className="py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white mb-6">
            Historique des Combats
          </h2>

          {pastFights.length === 0 ? (
            <Card variant="bordered" padding="lg" className="text-center">
              <p className="text-zinc-500">
                Aucun combat passé enregistré pour ce combattant.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastFights.map((fight) => {
                const opponent = fight.fighter1Id === fighter.id ? fight.fighter2 : fight.fighter1;
                const isWin = fight.winnerId === fighter.id;
                const isLoss = fight.winnerId && fight.winnerId !== fighter.id;

                return (
                  <Card key={fight.id} variant="bordered" padding="md">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Result indicator */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            isWin
                              ? 'bg-green-500/20 text-green-500'
                              : isLoss
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-zinc-500/20 text-zinc-500'
                          }`}
                        >
                          {isWin ? 'W' : isLoss ? 'L' : 'D'}
                        </div>
                      </div>

                      {/* Fight info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-zinc-500">vs</span>
                          <Link
                            href={`/fighter/${opponent.slug}`}
                            className="font-medium text-white hover:text-red-500 transition-colors"
                          >
                            {opponent.firstName} {opponent.lastName}
                          </Link>
                        </div>
                        <div className="text-sm text-zinc-500">
                          <Link
                            href={`/evenement/${fight.event.slug}`}
                            className="hover:text-zinc-300 transition-colors"
                          >
                            {fight.event.name}
                          </Link>
                          {fight.scheduledTime && (
                            <span> • {formatDate(fight.scheduledTime)}</span>
                          )}
                        </div>
                      </div>

                      {/* Method */}
                      {fight.method && (
                        <div className="flex-shrink-0 text-right">
                          <div className="text-sm text-zinc-300">{fight.method}</div>
                          {fight.roundEnded && (
                            <div className="text-xs text-zinc-500">
                              Round {fight.roundEnded}
                              {fight.timeEnded && ` - ${fight.timeEnded}`}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
