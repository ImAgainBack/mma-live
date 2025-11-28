'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Organization } from '@/types';

interface FilterBarProps {
  organizations?: Organization[];
  selectedOrganization?: number | null;
  onOrganizationChange?: (id: number | null) => void;
  selectedCardType?: string | null;
  onCardTypeChange?: (type: string | null) => void;
  selectedStatus?: string | null;
  onStatusChange?: (status: string | null) => void;
  showTitleFightOnly?: boolean;
  onTitleFightChange?: (value: boolean) => void;
  className?: string;
}

const CARD_TYPES = [
  { value: null, label: 'Tous' },
  { value: 'main_event', label: 'Main Event' },
  { value: 'co_main', label: 'Co-Main' },
  { value: 'main_card', label: 'Main Card' },
  { value: 'prelims', label: 'Préliminaires' },
];

const STATUSES = [
  { value: null, label: 'Tous' },
  { value: 'live', label: 'En direct' },
  { value: 'upcoming', label: 'À venir' },
  { value: 'completed', label: 'Terminé' },
];

export function FilterBar({
  organizations = [],
  selectedOrganization,
  onOrganizationChange,
  selectedCardType,
  onCardTypeChange,
  selectedStatus,
  onStatusChange,
  showTitleFightOnly = false,
  onTitleFightChange,
  className,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Organization Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onOrganizationChange?.(null)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedOrganization === null
              ? 'bg-red-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          )}
        >
          Toutes
        </button>
        {organizations.map((org) => (
          <button
            key={org.id}
            onClick={() => onOrganizationChange?.(org.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedOrganization === org.id
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            )}
          >
            {org.name}
          </button>
        ))}
      </div>

      {/* More Filters Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
      >
        {isExpanded ? '▼' : '▶'} Plus de filtres
      </button>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="bg-zinc-900/50 rounded-lg p-4 space-y-4">
          {/* Card Type */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Type de carte</label>
            <div className="flex flex-wrap gap-2">
              {CARD_TYPES.map((type) => (
                <button
                  key={type.value || 'all'}
                  onClick={() => onCardTypeChange?.(type.value)}
                  className={cn(
                    'px-3 py-1.5 rounded text-xs font-medium transition-colors',
                    selectedCardType === type.value
                      ? 'bg-zinc-700 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Statut</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                <button
                  key={status.value || 'all'}
                  onClick={() => onStatusChange?.(status.value)}
                  className={cn(
                    'px-3 py-1.5 rounded text-xs font-medium transition-colors',
                    selectedStatus === status.value
                      ? 'bg-zinc-700 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  )}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title Fight Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="titleFight"
              checked={showTitleFightOnly}
              onChange={(e) => onTitleFightChange?.(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-500 focus:ring-offset-zinc-900"
            />
            <label htmlFor="titleFight" className="text-sm text-zinc-300">
              Combats pour le titre uniquement
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterBar;
