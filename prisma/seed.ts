import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.userFavorite.deleteMany();
  await prisma.userAlert.deleteMany();
  await prisma.eventBroadcast.deleteMany();
  await prisma.fight.deleteMany();
  await prisma.event.deleteMany();
  await prisma.fighter.deleteMany();
  await prisma.broadcaster.deleteMany();
  await prisma.organization.deleteMany();

  // Create Organizations
  console.log('Creating organizations...');
  const organizations = await Promise.all([
    prisma.organization.create({
      data: {
        name: 'UFC',
        slug: 'ufc',
        logoUrl: '/logos/ufc.png',
        websiteUrl: 'https://www.ufc.com',
      },
    }),
    prisma.organization.create({
      data: {
        name: 'Bellator',
        slug: 'bellator',
        logoUrl: '/logos/bellator.png',
        websiteUrl: 'https://www.bellator.com',
      },
    }),
    prisma.organization.create({
      data: {
        name: 'ONE Championship',
        slug: 'one-championship',
        logoUrl: '/logos/one.png',
        websiteUrl: 'https://www.onefc.com',
      },
    }),
    prisma.organization.create({
      data: {
        name: 'PFL',
        slug: 'pfl',
        logoUrl: '/logos/pfl.png',
        websiteUrl: 'https://www.pflmma.com',
      },
    }),
    prisma.organization.create({
      data: {
        name: 'Cage Warriors',
        slug: 'cage-warriors',
        logoUrl: '/logos/cw.png',
        websiteUrl: 'https://www.cagewarriors.com',
      },
    }),
  ]);

  const [ufc, bellator, one, pfl, cw] = organizations;

  // Create Broadcasters
  console.log('Creating broadcasters...');
  const broadcasters = await Promise.all([
    prisma.broadcaster.create({
      data: {
        name: 'RMC Sport',
        slug: 'rmc-sport',
        logoUrl: '/logos/rmc-sport.png',
        websiteUrl: 'https://rmcsport.bfmtv.com',
        isFree: false,
        countries: ['France', 'Belgium', 'Switzerland'],
      },
    }),
    prisma.broadcaster.create({
      data: {
        name: "La Chaîne L'Équipe",
        slug: 'lequipe',
        logoUrl: '/logos/lequipe.png',
        websiteUrl: 'https://www.lequipe.fr/tv',
        isFree: true,
        countries: ['France'],
      },
    }),
    prisma.broadcaster.create({
      data: {
        name: 'UFC Fight Pass',
        slug: 'ufc-fight-pass',
        logoUrl: '/logos/fight-pass.png',
        websiteUrl: 'https://www.ufc.com/fight-pass',
        isFree: false,
        countries: ['Worldwide'],
      },
    }),
  ]);

  const [rmcSport, lequipe, fightPass] = broadcasters;

  // Create Fighters
  console.log('Creating fighters...');
  const fighters = await Promise.all([
    // UFC Fighters
    prisma.fighter.create({
      data: {
        firstName: 'Islam',
        lastName: 'Makhachev',
        nickname: 'The Eagle 2.0',
        slug: 'islam-makhachev',
        weightClass: 'Lightweight',
        nationality: 'Russia',
        recordWins: 26,
        recordLosses: 1,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Alexander',
        lastName: 'Volkanovski',
        nickname: 'The Great',
        slug: 'alexander-volkanovski',
        weightClass: 'Featherweight',
        nationality: 'Australia',
        recordWins: 26,
        recordLosses: 3,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Leon',
        lastName: 'Edwards',
        nickname: 'Rocky',
        slug: 'leon-edwards',
        weightClass: 'Welterweight',
        nationality: 'United Kingdom',
        recordWins: 22,
        recordLosses: 3,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Colby',
        lastName: 'Covington',
        nickname: 'Chaos',
        slug: 'colby-covington',
        weightClass: 'Welterweight',
        nationality: 'United States',
        recordWins: 17,
        recordLosses: 4,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Jon',
        lastName: 'Jones',
        nickname: 'Bones',
        slug: 'jon-jones',
        weightClass: 'Heavyweight',
        nationality: 'United States',
        recordWins: 27,
        recordLosses: 1,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Stipe',
        lastName: 'Miocic',
        nickname: '',
        slug: 'stipe-miocic',
        weightClass: 'Heavyweight',
        nationality: 'United States',
        recordWins: 20,
        recordLosses: 4,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Alex',
        lastName: 'Pereira',
        nickname: 'Poatan',
        slug: 'alex-pereira',
        weightClass: 'Light Heavyweight',
        nationality: 'Brazil',
        recordWins: 11,
        recordLosses: 2,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Jamahal',
        lastName: 'Hill',
        nickname: 'Sweet Dreams',
        slug: 'jamahal-hill',
        weightClass: 'Light Heavyweight',
        nationality: 'United States',
        recordWins: 12,
        recordLosses: 2,
        recordDraws: 0,
      },
    }),
    // Bellator Fighters
    prisma.fighter.create({
      data: {
        firstName: 'Patricio',
        lastName: 'Freire',
        nickname: 'Pitbull',
        slug: 'patricio-freire',
        weightClass: 'Featherweight',
        nationality: 'Brazil',
        recordWins: 35,
        recordLosses: 6,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'A.J.',
        lastName: 'McKee',
        nickname: 'Mercenary',
        slug: 'aj-mckee',
        weightClass: 'Featherweight',
        nationality: 'United States',
        recordWins: 22,
        recordLosses: 1,
        recordDraws: 0,
      },
    }),
    // ONE Fighters
    prisma.fighter.create({
      data: {
        firstName: 'Demetrious',
        lastName: 'Johnson',
        nickname: 'Mighty Mouse',
        slug: 'demetrious-johnson',
        weightClass: 'Flyweight',
        nationality: 'United States',
        recordWins: 30,
        recordLosses: 4,
        recordDraws: 1,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Adriano',
        lastName: 'Moraes',
        nickname: 'Mikinho',
        slug: 'adriano-moraes',
        weightClass: 'Flyweight',
        nationality: 'Brazil',
        recordWins: 21,
        recordLosses: 5,
        recordDraws: 0,
      },
    }),
    // PFL Fighters
    prisma.fighter.create({
      data: {
        firstName: 'Kayla',
        lastName: 'Harrison',
        nickname: '',
        slug: 'kayla-harrison',
        weightClass: 'Lightweight',
        nationality: 'United States',
        recordWins: 17,
        recordLosses: 1,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Larissa',
        lastName: 'Pacheco',
        nickname: '',
        slug: 'larissa-pacheco',
        weightClass: 'Lightweight',
        nationality: 'Brazil',
        recordWins: 23,
        recordLosses: 4,
        recordDraws: 0,
      },
    }),
    // More fighters for variety
    prisma.fighter.create({
      data: {
        firstName: 'Charles',
        lastName: 'Oliveira',
        nickname: 'Do Bronx',
        slug: 'charles-oliveira',
        weightClass: 'Lightweight',
        nationality: 'Brazil',
        recordWins: 34,
        recordLosses: 10,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Dustin',
        lastName: 'Poirier',
        nickname: 'The Diamond',
        slug: 'dustin-poirier',
        weightClass: 'Lightweight',
        nationality: 'United States',
        recordWins: 30,
        recordLosses: 8,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Ciryl',
        lastName: 'Gane',
        nickname: 'Bon Gamin',
        slug: 'ciryl-gane',
        weightClass: 'Heavyweight',
        nationality: 'France',
        recordWins: 12,
        recordLosses: 2,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Benoît',
        lastName: 'Saint Denis',
        nickname: 'God of War',
        slug: 'benoit-saint-denis',
        weightClass: 'Lightweight',
        nationality: 'France',
        recordWins: 13,
        recordLosses: 2,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Nassourdine',
        lastName: 'Imavov',
        nickname: 'The Sniper',
        slug: 'nassourdine-imavov',
        weightClass: 'Middleweight',
        nationality: 'France',
        recordWins: 14,
        recordLosses: 4,
        recordDraws: 0,
      },
    }),
    prisma.fighter.create({
      data: {
        firstName: 'Fares',
        lastName: 'Ziam',
        nickname: '',
        slug: 'fares-ziam',
        weightClass: 'Lightweight',
        nationality: 'France',
        recordWins: 14,
        recordLosses: 4,
        recordDraws: 0,
      },
    }),
  ]);

  // Create Events
  console.log('Creating events...');
  const now = new Date();
  
  // Helper function to create dates
  const addDays = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(22, 0, 0, 0); // 22:00 start time
    return date;
  };

  const events = await Promise.all([
    // UFC Events
    prisma.event.create({
      data: {
        organizationId: ufc.id,
        name: 'UFC 310',
        slug: 'ufc-310',
        venue: 'T-Mobile Arena',
        city: 'Las Vegas',
        country: 'USA',
        startDate: addDays(7),
        status: 'upcoming',
      },
    }),
    prisma.event.create({
      data: {
        organizationId: ufc.id,
        name: 'UFC Fight Night: Paris',
        slug: 'ufc-fight-night-paris',
        venue: 'Accor Arena',
        city: 'Paris',
        country: 'France',
        startDate: addDays(14),
        status: 'upcoming',
      },
    }),
    prisma.event.create({
      data: {
        organizationId: ufc.id,
        name: 'UFC 311',
        slug: 'ufc-311',
        venue: 'Madison Square Garden',
        city: 'New York',
        country: 'USA',
        startDate: addDays(21),
        status: 'upcoming',
      },
    }),
    prisma.event.create({
      data: {
        organizationId: ufc.id,
        name: 'UFC 312',
        slug: 'ufc-312',
        venue: 'Qudos Bank Arena',
        city: 'Sydney',
        country: 'Australia',
        startDate: addDays(35),
        status: 'upcoming',
      },
    }),
    // Bellator Events
    prisma.event.create({
      data: {
        organizationId: bellator.id,
        name: 'Bellator Paris',
        slug: 'bellator-paris',
        venue: 'Accor Arena',
        city: 'Paris',
        country: 'France',
        startDate: addDays(10),
        status: 'upcoming',
      },
    }),
    prisma.event.create({
      data: {
        organizationId: bellator.id,
        name: 'Bellator 305',
        slug: 'bellator-305',
        venue: 'SSE Arena',
        city: 'London',
        country: 'UK',
        startDate: addDays(28),
        status: 'upcoming',
      },
    }),
    // ONE Events
    prisma.event.create({
      data: {
        organizationId: one.id,
        name: 'ONE Championship 168',
        slug: 'one-168',
        venue: 'Impact Arena',
        city: 'Bangkok',
        country: 'Thailand',
        startDate: addDays(5),
        status: 'upcoming',
      },
    }),
    prisma.event.create({
      data: {
        organizationId: one.id,
        name: 'ONE Championship 169',
        slug: 'one-169',
        venue: 'Singapore Indoor Stadium',
        city: 'Singapore',
        country: 'Singapore',
        startDate: addDays(19),
        status: 'upcoming',
      },
    }),
    // PFL Events
    prisma.event.create({
      data: {
        organizationId: pfl.id,
        name: 'PFL World Championship',
        slug: 'pfl-world-championship',
        venue: 'Hulu Theater',
        city: 'New York',
        country: 'USA',
        startDate: addDays(12),
        status: 'upcoming',
      },
    }),
    // Cage Warriors
    prisma.event.create({
      data: {
        organizationId: cw.id,
        name: 'Cage Warriors 170',
        slug: 'cage-warriors-170',
        venue: 'BEC Arena',
        city: 'Belfast',
        country: 'UK',
        startDate: addDays(17),
        status: 'upcoming',
      },
    }),
  ]);

  // Create Fights
  console.log('Creating fights...');
  const [ufc310, ufcParis, ufc311, ufc312, bellatorParis, bellator305, one168, one169, pflChamp, cw170] = events;

  await Promise.all([
    // UFC 310 Fights
    prisma.fight.create({
      data: {
        eventId: ufc310.id,
        fighter1Id: fighters[4].id, // Jon Jones
        fighter2Id: fighters[5].id, // Stipe Miocic
        weightClass: 'Heavyweight',
        isTitleFight: true,
        cardType: 'main_event',
        scheduledRounds: 5,
        scheduledTime: ufc310.startDate,
        status: 'scheduled',
      },
    }),
    prisma.fight.create({
      data: {
        eventId: ufc310.id,
        fighter1Id: fighters[6].id, // Alex Pereira
        fighter2Id: fighters[7].id, // Jamahal Hill
        weightClass: 'Light Heavyweight',
        isTitleFight: true,
        cardType: 'co_main',
        scheduledRounds: 5,
        scheduledTime: new Date(ufc310.startDate.getTime() - 60 * 60 * 1000),
        status: 'scheduled',
      },
    }),
    prisma.fight.create({
      data: {
        eventId: ufc310.id,
        fighter1Id: fighters[14].id, // Charles Oliveira
        fighter2Id: fighters[15].id, // Dustin Poirier
        weightClass: 'Lightweight',
        isTitleFight: false,
        cardType: 'main_card',
        scheduledRounds: 3,
        scheduledTime: new Date(ufc310.startDate.getTime() - 2 * 60 * 60 * 1000),
        status: 'scheduled',
      },
    }),
    
    // UFC Paris Fights
    prisma.fight.create({
      data: {
        eventId: ufcParis.id,
        fighter1Id: fighters[16].id, // Ciryl Gane
        fighter2Id: fighters[5].id, // Stipe Miocic (example)
        weightClass: 'Heavyweight',
        isTitleFight: false,
        cardType: 'main_event',
        scheduledRounds: 5,
        scheduledTime: ufcParis.startDate,
        status: 'scheduled',
      },
    }),
    prisma.fight.create({
      data: {
        eventId: ufcParis.id,
        fighter1Id: fighters[17].id, // Benoît Saint Denis
        fighter2Id: fighters[19].id, // Fares Ziam
        weightClass: 'Lightweight',
        isTitleFight: false,
        cardType: 'co_main',
        scheduledRounds: 3,
        scheduledTime: new Date(ufcParis.startDate.getTime() - 60 * 60 * 1000),
        status: 'scheduled',
      },
    }),
    prisma.fight.create({
      data: {
        eventId: ufcParis.id,
        fighter1Id: fighters[18].id, // Nassourdine Imavov
        fighter2Id: fighters[3].id, // Colby Covington (example)
        weightClass: 'Middleweight',
        isTitleFight: false,
        cardType: 'main_card',
        scheduledRounds: 3,
        scheduledTime: new Date(ufcParis.startDate.getTime() - 2 * 60 * 60 * 1000),
        status: 'scheduled',
      },
    }),

    // UFC 311 Fights
    prisma.fight.create({
      data: {
        eventId: ufc311.id,
        fighter1Id: fighters[0].id, // Islam Makhachev
        fighter2Id: fighters[14].id, // Charles Oliveira
        weightClass: 'Lightweight',
        isTitleFight: true,
        cardType: 'main_event',
        scheduledRounds: 5,
        scheduledTime: ufc311.startDate,
        status: 'scheduled',
      },
    }),
    prisma.fight.create({
      data: {
        eventId: ufc311.id,
        fighter1Id: fighters[2].id, // Leon Edwards
        fighter2Id: fighters[3].id, // Colby Covington
        weightClass: 'Welterweight',
        isTitleFight: true,
        cardType: 'co_main',
        scheduledRounds: 5,
        scheduledTime: new Date(ufc311.startDate.getTime() - 60 * 60 * 1000),
        status: 'scheduled',
      },
    }),

    // Bellator Paris
    prisma.fight.create({
      data: {
        eventId: bellatorParis.id,
        fighter1Id: fighters[8].id, // Patricio Freire
        fighter2Id: fighters[9].id, // AJ McKee
        weightClass: 'Featherweight',
        isTitleFight: true,
        cardType: 'main_event',
        scheduledRounds: 5,
        scheduledTime: bellatorParis.startDate,
        status: 'scheduled',
      },
    }),

    // ONE 168
    prisma.fight.create({
      data: {
        eventId: one168.id,
        fighter1Id: fighters[10].id, // Demetrious Johnson
        fighter2Id: fighters[11].id, // Adriano Moraes
        weightClass: 'Flyweight',
        isTitleFight: true,
        cardType: 'main_event',
        scheduledRounds: 5,
        scheduledTime: one168.startDate,
        status: 'scheduled',
      },
    }),

    // PFL World Championship
    prisma.fight.create({
      data: {
        eventId: pflChamp.id,
        fighter1Id: fighters[12].id, // Kayla Harrison
        fighter2Id: fighters[13].id, // Larissa Pacheco
        weightClass: 'Lightweight',
        isTitleFight: true,
        cardType: 'main_event',
        scheduledRounds: 5,
        scheduledTime: pflChamp.startDate,
        status: 'scheduled',
      },
    }),
  ]);

  // Create Event Broadcasts
  console.log('Creating event broadcasts...');
  await Promise.all([
    // UFC 310 broadcasts
    prisma.eventBroadcast.create({
      data: {
        eventId: ufc310.id,
        broadcasterId: rmcSport.id,
        streamUrl: 'https://rmcsport.bfmtv.com/live',
        cardType: 'main_card',
        region: 'France',
        isPpv: true,
        price: 24.99,
      },
    }),
    prisma.eventBroadcast.create({
      data: {
        eventId: ufc310.id,
        broadcasterId: fightPass.id,
        streamUrl: 'https://www.ufc.com/fight-pass',
        cardType: 'prelims',
        region: 'Worldwide',
        isPpv: false,
      },
    }),
    // UFC Paris broadcasts
    prisma.eventBroadcast.create({
      data: {
        eventId: ufcParis.id,
        broadcasterId: rmcSport.id,
        streamUrl: 'https://rmcsport.bfmtv.com/live',
        cardType: 'main_card',
        region: 'France',
        isPpv: false,
      },
    }),
    prisma.eventBroadcast.create({
      data: {
        eventId: ufcParis.id,
        broadcasterId: lequipe.id,
        streamUrl: 'https://www.lequipe.fr/tv',
        cardType: 'prelims',
        region: 'France',
        isPpv: false,
      },
    }),
    // Bellator Paris broadcasts
    prisma.eventBroadcast.create({
      data: {
        eventId: bellatorParis.id,
        broadcasterId: lequipe.id,
        streamUrl: 'https://www.lequipe.fr/tv',
        cardType: 'main_card',
        region: 'France',
        isPpv: false,
      },
    }),
    // ONE 168 broadcasts
    prisma.eventBroadcast.create({
      data: {
        eventId: one168.id,
        broadcasterId: fightPass.id,
        streamUrl: 'https://watch.onefc.com',
        cardType: 'main_card',
        region: 'Worldwide',
        isPpv: false,
      },
    }),
    // PFL broadcasts
    prisma.eventBroadcast.create({
      data: {
        eventId: pflChamp.id,
        broadcasterId: fightPass.id,
        streamUrl: 'https://www.pflmma.com/watch',
        cardType: 'main_card',
        region: 'Worldwide',
        isPpv: true,
        price: 19.99,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
