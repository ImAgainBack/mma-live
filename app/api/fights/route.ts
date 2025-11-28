import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const cardType = searchParams.get('cardType');
    const limit = searchParams.get('limit');

    const where: Record<string, unknown> = {};

    if (eventId) {
      where.eventId = parseInt(eventId, 10);
    }

    if (status) {
      where.status = status;
    }

    if (cardType) {
      where.cardType = cardType;
    }

    const fights = await prisma.fight.findMany({
      where,
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
        scheduledTime: 'asc',
      },
      take: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json(fights);
  } catch (error) {
    console.error('Error fetching fights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fights' },
      { status: 500 }
    );
  }
}
