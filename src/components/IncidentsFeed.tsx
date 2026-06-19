import { useMemo, useState } from 'react';
import { Search, ChevronDown, MapPin, Clock, Filter, RefreshCw } from 'lucide-react';
import { useApp } from '../store';
import {
  PRIORITY_STYLES,
  STATUS_STYLES,
  CATEGORY_STYLES,
  timeAgo,
  formatTimestamp,
} from '../ui';
import type { Priority, IncidentStatus, Incident } from '../types';

const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES: IncidentStatus[] = ['Open', 'Dispatching', 'Resolved'];

export default function IncidentsFeed() {
  const { incidents, updateIncidentStatus } = useApp();
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState<Priority | 'All'>('All');
  const [status, setStatus] = useState<IncidentStatus | 'All'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return incidents.filter((i) => {
      if (priority !== 'All' && i.priority !== priority) return false;
      if (status !== 'All' && i.status !== status) return false;
      if (!q) return true;
      return (
        i.id.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    });
  }, [incidents, query, priority, status]);

  const counts = useMemo(
    () => ({
      total: incidents.length,
      open: incidents.filter((i) => i.status === 'Open').length,
      dispatching: incidents.filter((i) => i.status === 'Dispatching').length,
      resolved: incidents.filter((i) => i.status === 'Resolved').length,
    }),
    [incidents]
  );

  const toggleRow = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">Incidents Feed</h1>
        <p className="text-sm text-slate-400 mt-1">
          {counts.total} logged · {counts.open} open · {counts.dispatching} dispatching · {counts.resolved} resolved
        </p>
      </header>

      <div className="rounded-2xl border border-slate-800 bg-[#0b0f1a] p-4 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, location, district, or summary..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-700/40 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <Filter className="h-3.5 w-3.5" /> Priority
          </span>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={priority === 'All'} onClick={() => setPriority('All')}>
              All
            </FilterChip>
            {PRIORITIES.map((p) => (
              <FilterChip key={p} active={priority === p} onClick={() => setPriority(p)}>
                {p}
              </FilterChip>
            ))}
          </div>

          <span className="ml-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <RefreshCw className="h-3.5 w-3.5" /> Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={status === 'All'} onClick={() => setStatus('All')}>
              All
            </FilterChip>
            {STATUSES.map((s) => (
              <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>
                {s}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0b0f1a]">
        <div className="overflow-x-auto scrollbar-slim">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-semibold">Incident ID</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Reported</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc) => (
                <IncidentRow
                  key={inc.id}
                  inc={inc}
                  expanded={expandedId === inc.id}
                  onToggle={() => toggleRow(inc.id)}
                  onStatusChange={(s) => { void updateIncidentStatus(inc.id, s); return Promise.resolve(); }}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                    No incidents match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'bg-slate-700/80 text-white'
          : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function IncidentRow({
  inc,
  expanded,
  onToggle,
  onStatusChange,
}: {
  inc: Incident;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (s: IncidentStatus) => Promise<void>;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="cursor-pointer border-b border-slate-800/60 transition-colors hover:bg-slate-900/40"
      >
        <td className="px-5 py-3.5">
          <span className="font-mono text-xs text-sky-300">{inc.id}</span>
        </td>
        <td className="px-5 py-3.5">
          <div className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
            <div className="min-w-0">
              <p className="text-sm text-slate-200 font-medium truncate max-w-[200px]">{inc.location}</p>
              <p className="text-[11px] text-slate-500">{inc.district}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-3.5">
          <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium ${CATEGORY_STYLES[inc.category]}`}>
            {inc.category}
          </span>
        </td>
        <td className="px-5 py-3.5">
          <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLES[inc.priority]}`}>
            {inc.priority}
          </span>
        </td>
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            {timeAgo(inc.reportedAt)}
          </div>
        </td>
        <td className="px-5 py-3.5">
          <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[inc.status]}`}>
            {inc.status}
          </span>
        </td>
        <td className="px-5 py-3.5 text-right">
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </td>
      </tr>
      {expanded && (
        <tr className="animate-fade-in bg-slate-950/50">
          <td colSpan={7} className="px-5 py-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2 space-y-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Situation Details</p>
                  <p className="text-sm leading-relaxed text-slate-300">{inc.summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-500">Reporter</p>
                    <p className="text-slate-300 mt-0.5">{inc.reporterName || 'Anonymous'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Contact</p>
                    <p className="text-slate-300 mt-0.5 font-mono">{inc.reporterContact || '—'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Reported at</p>
                    <p className="text-slate-300 mt-0.5">{formatTimestamp(inc.reportedAt)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">District</p>
                    <p className="text-slate-300 mt-0.5">{inc.district}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">Update Status</p>
                <div className="flex flex-col gap-1.5">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(s);
                      }}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all text-left ${
                        inc.status === s
                          ? STATUS_STYLES[s] + ' ring-1 ring-white/10'
                          : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
