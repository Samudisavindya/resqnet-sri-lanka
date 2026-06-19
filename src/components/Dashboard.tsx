import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from 'recharts';
import {
  Siren,
  Home,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../store';
import { PRIORITY_STYLES } from '../ui';
import type { Priority } from '../types';

const TARGET_PACKS = 5000;

export default function Dashboard() {
  const { incidents, requests, supplies } = useApp();

  const stats = useMemo(() => {
    const open = incidents.filter(
      (i) => i.status === 'Open' || i.status === 'Dispatching'
    ).length;
    const critical = incidents.filter(
      (i) => i.priority === 'Critical' && i.status !== 'Resolved'
    ).length;

    const families = incidents.reduce((acc, i) => {
      if (i.status === 'Resolved') return acc;
      const m = i.summary.match(/(\d+)\+?\s*famil/i);
      return acc + (m ? parseInt(m[1], 10) : 45);
    }, 0);

    const volunteers = 312 + critical * 14;
    const packsDist = Math.min(TARGET_PACKS, 3400 + open * 40);

    return { open, critical, families, volunteers, packsDist };
  }, [incidents]);

  const districtData = useMemo(() => {
    const map = new Map<string, number>();
    incidents
      .filter((i) => i.status !== 'Resolved')
      .forEach((i) => map.set(i.district, (map.get(i.district) || 0) + 1));
    return Array.from(map.entries())
      .map(([district, count]) => ({ district, count }))
      .sort((a, b) => b.count - a.count);
  }, [incidents]);

  const resourceData = useMemo(() => {
    const cats = ['Water Bottles', 'Rice', 'Milk Powder', 'Medical Kits', 'Tents', 'Dry Rations'];
    return cats.map((c) => {
      const demand = requests
        .filter((r) => r.resource === c)
        .reduce((s, r) => s + r.quantity, 0);
      const supply = supplies
        .filter((s) => s.resource === c)
        .reduce((s, r) => s + r.quantity, 0);
      const label = c.replace(' Bottles', '').replace(' Kits', '');
      return { category: label, demand, supply };
    });
  }, [requests, supplies]);

  const recentCritical = useMemo(
    () =>
      incidents
        .filter((i) => i.priority === 'Critical' && i.status !== 'Resolved')
        .slice(0, 4),
    [incidents]
  );

  const packPercent = Math.round((stats.packsDist / TARGET_PACKS) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Live Command Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time disaster relief coordination across Sri Lanka
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Live Feed</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active Emergencies"
          value={stats.open}
          sub={`${stats.critical} critical`}
          icon={Siren}
          accent="rose"
          pulse
        />
        <MetricCard
          label="Families Displaced"
          value={stats.families.toLocaleString()}
          sub="Cumulative estimate"
          icon={Home}
          accent="amber"
        />
        <MetricCard
          label="Active Volunteers"
          value={stats.volunteers.toLocaleString()}
          sub="On-ground teams"
          icon={Users}
          accent="sky"
        />
        <MetricCard
          label="Relief Packs"
          value={stats.packsDist.toLocaleString()}
          sub={`Target: ${TARGET_PACKS.toLocaleString()}`}
          icon={Package}
          accent="emerald"
          progress={packPercent}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <section className="lg:col-span-3 rounded-2xl border border-slate-800 bg-[#0b0f1a] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Resource Supply vs. Demand</h2>
              <p className="text-xs text-slate-500 mt-0.5">By category — units across all districts</p>
            </div>
            <Activity className="h-5 w-5 text-slate-500" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: '#1e293b' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(148,163,184,0.06)' }}
                  contentStyle={{
                    background: '#0b0f1a',
                    border: '1px solid #1e293b',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  iconType="circle"
                />
                <Bar dataKey="demand" name="Demand" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="supply" name="Supply" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0b0f1a] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Incidents by District</h2>
              <p className="text-xs text-slate-500 mt-0.5">Crisis intensity mapping</p>
            </div>
            <TrendingUp className="h-5 w-5 text-slate-500" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} layout="vertical" margin={{ left: 4, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="district"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={92}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(148,163,184,0.06)' }}
                  contentStyle={{
                    background: '#0b0f1a',
                    border: '1px solid #1e293b',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                />
                <Bar dataKey="count" name="Incidents" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {districtData.map((_, i) => {
                    const palette = ['#f43f5e', '#fb923c', '#f59e0b', '#38bdf8', '#14b8a6', '#a78bfa'];
                    return <Cell key={i} fill={palette[i % palette.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#0b0f1a] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <h2 className="text-base font-semibold text-white">Priority Dispatch Queue</h2>
            </div>
            <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300 border border-rose-500/25">
              {stats.critical} critical
            </span>
          </div>
          <div className="space-y-2.5">
            {recentCritical.length === 0 && (
              <p className="text-sm text-slate-500 py-8 text-center">No critical incidents active.</p>
            )}
            {recentCritical.map((inc) => (
              <div
                key={inc.id}
                className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3 hover:border-slate-700 transition-colors"
              >
                <span
                  className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg border ${PRIORITY_STYLES[inc.priority as Priority]}`}
                >
                  <Siren className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{inc.id}</span>
                    <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PRIORITY_STYLES[inc.priority as Priority]}`}>
                      {inc.priority}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 truncate mt-0.5">
                    {inc.location}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#0b0f1a] p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white">Supply Coverage</h2>
            <p className="text-xs text-slate-500 mt-0.5">Demand-met ratio by resource</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={resourceData} outerRadius={70}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Supply" dataKey="supply" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
                <Radar name="Demand" dataKey="demand" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.25} />
                <Tooltip
                  contentStyle={{
                    background: '#0b0f1a',
                    border: '1px solid #1e293b',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: 'rose' | 'amber' | 'sky' | 'emerald';
  pulse?: boolean;
  progress?: number;
}

function MetricCard({ label, value, sub, icon: Icon, accent, pulse, progress }: MetricCardProps) {
  const accentMap = {
    rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', glow: 'glow-rose', bar: 'bg-rose-500' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'glow-amber', bar: 'bg-amber-500' },
    sky: { text: 'text-sky-400', bg: 'bg-sky-500/10', glow: 'glow-sky', bar: 'bg-sky-400' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'glow-emerald', bar: 'bg-emerald-500' },
  }[accent];

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0b0f1a] p-5 ${accentMap.glow}`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white tabular-nums">{value}</span>
            {pulse && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{sub}</p>
        </div>
        <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl ${accentMap.bg}`}>
          <Icon className={`h-5 w-5 ${accentMap.text}`} />
        </div>
      </div>
      {typeof progress === 'number' && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-400">{progress}% of target</span>
            <span className={`font-semibold ${accentMap.text}`}>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full ${accentMap.bar} transition-all duration-700`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
