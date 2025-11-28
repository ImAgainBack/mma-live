'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AlertSubscribeProps {
  eventId?: number;
  fighterId?: number;
  eventName?: string;
  fighterName?: string;
  className?: string;
}

export function AlertSubscribe({ 
  eventId, 
  fighterId, 
  eventName, 
  fighterName,
  className 
}: AlertSubscribeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [minutesBefore, setMinutesBefore] = useState(30);
  const [alertType, setAlertType] = useState<'email' | 'telegram'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: alertType === 'email' ? email : null,
          eventId,
          fighterId,
          alertType,
          minutesBefore,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'alerte');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setEmail('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = eventName 
    ? `Alerte pour ${eventName}` 
    : fighterName 
    ? `Alerte pour ${fighterName}` 
    : 'Créer une alerte';

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        🔔 Recevoir une alerte
      </Button>
    );
  }

  return (
    <div className={cn('bg-zinc-900 border border-zinc-800 rounded-lg p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">{title}</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-zinc-500 hover:text-zinc-300"
        >
          ✕
        </button>
      </div>

      {success ? (
        <div className="text-center py-4">
          <span className="text-2xl">✅</span>
          <p className="text-green-500 mt-2">Alerte créée avec succès !</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Alert Type */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Type d&apos;alerte</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAlertType('email')}
                className={cn(
                  'flex-1 py-2 px-3 rounded text-sm transition-colors',
                  alertType === 'email'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                )}
              >
                📧 Email
              </button>
              <button
                type="button"
                onClick={() => setAlertType('telegram')}
                className={cn(
                  'flex-1 py-2 px-3 rounded text-sm transition-colors',
                  alertType === 'telegram'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                )}
              >
                📱 Telegram
              </button>
            </div>
          </div>

          {/* Email Input */}
          {alertType === 'email' && (
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Telegram notice */}
          {alertType === 'telegram' && (
            <div className="bg-zinc-800 rounded-lg p-3 text-sm text-zinc-400">
              <p>Pour recevoir des alertes Telegram :</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Ouvrez @MMALiveBot sur Telegram</li>
                <li>Envoyez /start</li>
                <li>Copiez votre ID de chat</li>
              </ol>
            </div>
          )}

          {/* Minutes Before */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              M&apos;alerter avant le combat
            </label>
            <select
              value={minutesBefore}
              onChange={(e) => setMinutesBefore(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={180}>3 heures</option>
              <option value={1440}>1 jour</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
          >
            Créer l&apos;alerte
          </Button>
        </form>
      )}
    </div>
  );
}

export default AlertSubscribe;
