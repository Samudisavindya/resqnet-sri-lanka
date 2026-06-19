import type { Priority, IncidentStatus, IncidentCategory } from './types';

export const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  High: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Medium: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Low: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

export const STATUS_STYLES: Record<IncidentStatus, string> = {
  Open: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  Dispatching: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Resolved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

export const CATEGORY_STYLES: Record<IncidentCategory, string> = {
  Rescue: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
  'Food & Rations': 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  'Medical Support': 'bg-sky-500/10 text-sky-300 border-sky-500/25',
  Shelter: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
  Infrastructure: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
  Logistics: 'bg-slate-500/10 text-slate-300 border-slate-500/25',
};

export const PRIORITY_GLOW: Record<Priority, string> = {
  Critical: 'glow-rose',
  High: 'glow-amber',
  Medium: 'glow-sky',
  Low: '',
};

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h >= 1) return `${h}h ${m}m ago`;
  if (m >= 1) return `${m}m ago`;
  return 'just now';
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
