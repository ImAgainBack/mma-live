'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CalendarExportProps {
  eventId: number;
  eventName: string;
  eventDate: Date | string;
  venue?: string | null;
  city?: string | null;
  country?: string | null;
  className?: string;
}

export function CalendarExport({
  eventId,
  eventName,
  eventDate,
  venue,
  city,
  country,
  className,
}: CalendarExportProps) {
  const location = [venue, city, country].filter(Boolean).join(', ');
  
  const handleGoogleCalendar = () => {
    const startDate = new Date(eventDate);
    const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // 5 hours duration
    
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d{3}/g, '');
    };
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventName,
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: `Regardez ${eventName} en direct sur MMA Live`,
      location: location || '',
    });
    
    window.open(
      `https://calendar.google.com/calendar/render?${params.toString()}`,
      '_blank'
    );
  };

  const handleICalDownload = async () => {
    try {
      const response = await fetch(`/api/calendar/${eventId}`);
      if (!response.ok) throw new Error('Erreur lors de la génération du fichier');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eventName.toLowerCase().replace(/\s+/g, '-')}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading calendar:', error);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleGoogleCalendar}
        className="gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3zM9 18H6v-3h3v3zm0-5H6v-3h3v3zm5 5h-3v-3h3v3zm0-5h-3v-3h3v3zm5 5h-3v-3h3v3zm0-5h-3v-3h3v3zm0-5H5V6h14v2z"/>
        </svg>
        Google Calendar
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleICalDownload}
        className="gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Télécharger iCal
      </Button>
    </div>
  );
}

export default CalendarExport;
