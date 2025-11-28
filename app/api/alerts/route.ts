import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, telegramChatId, fighterId, eventId, alertType, minutesBefore } = body;

    // Validation
    if (!alertType || !['email', 'telegram', 'push'].includes(alertType)) {
      return NextResponse.json(
        { error: 'Invalid alert type' },
        { status: 400 }
      );
    }

    if (alertType === 'email') {
      if (!email || !emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Valid email is required for email alerts' },
          { status: 400 }
        );
      }
    }

    if (!fighterId && !eventId) {
      return NextResponse.json(
        { error: 'Either fighterId or eventId is required' },
        { status: 400 }
      );
    }

    // Verify fighter or event exists
    if (fighterId) {
      const fighter = await prisma.fighter.findUnique({ where: { id: fighterId } });
      if (!fighter) {
        return NextResponse.json(
          { error: 'Fighter not found' },
          { status: 404 }
        );
      }
    }

    if (eventId) {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }
    }

    // Create alert
    const alert = await prisma.userAlert.create({
      data: {
        email: alertType === 'email' ? email : null,
        telegramChatId: alertType === 'telegram' ? telegramChatId : null,
        fighterId: fighterId || null,
        eventId: eventId || null,
        alertType,
        minutesBefore: minutesBefore || 30,
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const alerts = await prisma.userAlert.findMany({
      where: { email },
      include: {
        fighter: true,
        event: {
          include: {
            organization: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
