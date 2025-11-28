import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params;
    const id = parseInt(eventId, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id },
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
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Generate iCal content
    const mainEvent = event.fights[0];
    const mainEventStr = mainEvent
      ? `${mainEvent.fighter1.firstName} ${mainEvent.fighter1.lastName} vs ${mainEvent.fighter2.firstName} ${mainEvent.fighter2.lastName}`
      : '';

    const startDate = new Date(event.startDate);
    const endDate = event.endDate
      ? new Date(event.endDate)
      : new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // Default 5 hours

    const formatICalDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const location = [event.venue, event.city, event.country].filter(Boolean).join(', ');
    
    const description = `${event.organization.name} - ${event.name}${
      mainEventStr ? `\\nMain Event: ${mainEventStr}` : ''
    }\\n\\nPlus d'infos sur MMA Live`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MMA Live//Event Calendar//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${formatICalDate(startDate)}
DTEND:${formatICalDate(endDate)}
DTSTAMP:${formatICalDate(new Date())}
UID:event-${event.id}@mmalive.com
SUMMARY:${event.name}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${event.slug}.ics"`,
      },
    });
  } catch (error) {
    console.error('Error generating calendar:', error);
    return NextResponse.json(
      { error: 'Failed to generate calendar' },
      { status: 500 }
    );
  }
}
