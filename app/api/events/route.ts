import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const organizationId = searchParams.get('organizationId');
    const limit = searchParams.get('limit');

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (organizationId) {
      where.organizationId = parseInt(organizationId, 10);
    }

    const events = await prisma.event.findMany({
      where,
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
        broadcasts: {
          include: {
            broadcaster: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
