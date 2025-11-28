import Link from 'next/link';
import { prisma } from '@/lib/db';
import { EventCard } from '@/components/EventCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Organisations MMA - UFC, Bellator, ONE, PFL',
  description: 'Toutes les organisations de MMA : UFC, Bellator, ONE Championship, PFL et plus. Prochains événements et combats à venir.',
};

async function getOrganizationsWithEvents() {
  try {
    return await prisma.organization.findMany({
      include: {
        events: {
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
                cardType: 'main_event',
              },
            },
          },
          orderBy: {
            startDate: 'asc',
          },
          take: 3,
        },
        _count: {
          select: {
            events: {
              where: {
                startDate: {
                  gte: new Date(),
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  } catch {
    return [];
  }
}

export default async function OrganizationsPage() {
  const organizations = await getOrganizationsWithEvents();

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <section className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Organisations MMA
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Découvrez toutes les organisations de MMA et leurs prochains événements. 
            UFC, Bellator, ONE Championship, PFL - suivez vos organisations préférées.
          </p>
        </div>
      </section>

      {/* Organizations List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {organizations.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">🥊</span>
              <h2 className="text-xl font-medium text-white mb-2">
                Aucune organisation trouvée
              </h2>
              <p className="text-zinc-500">
                Les organisations seront affichées ici une fois ajoutées.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {organizations.map((org) => (
                <div 
                  key={org.id} 
                  id={org.slug}
                  className="scroll-mt-24"
                >
                  <Card variant="bordered" padding="lg">
                    {/* Organization Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
                      <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        {org.logoUrl ? (
                          <img
                            src={org.logoUrl}
                            alt={org.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-zinc-500">
                            {org.name.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white">{org.name}</h2>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-zinc-500">
                            {org._count.events} événement{org._count.events !== 1 ? 's' : ''} à venir
                          </span>
                          {org.websiteUrl && (
                            <a
                              href={org.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-red-500 hover:text-red-400 transition-colors"
                            >
                              Site officiel →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Events */}
                    {org.events.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Prochains Événements
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {org.events.map((event) => (
                            <EventCard key={event.id} event={event} variant="compact" />
                          ))}
                        </div>
                        
                        {org._count.events > 3 && (
                          <div className="mt-4 text-center">
                            <Link href={`/calendrier?org=${org.slug}`}>
                              <Button variant="ghost" size="sm">
                                Voir tous les événements {org.name} →
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-zinc-500">
                          Aucun événement à venir pour le moment.
                        </p>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-zinc-900/30 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert prose-zinc max-w-none">
            <h2 className="text-xl font-bold text-white mb-4">
              Les Grandes Organisations de MMA
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-zinc-400">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">UFC</h3>
                <p className="text-sm">
                  L&apos;Ultimate Fighting Championship (UFC) est la plus grande organisation de MMA au monde. 
                  Fondée en 1993, l&apos;UFC organise des événements dans le monde entier et rassemble les meilleurs 
                  combattants de la planète.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Bellator</h3>
                <p className="text-sm">
                  Bellator MMA est la deuxième plus grande organisation américaine de MMA. 
                  Connue pour ses tournois Grand Prix, Bellator offre des combats de haut niveau 
                  et accueille de nombreux anciens champions UFC.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">ONE Championship</h3>
                <p className="text-sm">
                  ONE Championship est la plus grande organisation de sports de combat en Asie. 
                  En plus du MMA, ONE propose également du kickboxing, du Muay Thai et des 
                  événements de soumission grappling.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">PFL</h3>
                <p className="text-sm">
                  La Professional Fighters League se distingue par son format de saison régulière 
                  et de playoffs, avec des championnats dans chaque catégorie de poids et des 
                  prix d&apos;un million de dollars pour les vainqueurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
