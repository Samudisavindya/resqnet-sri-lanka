import { LayoutDashboard, Siren, FileWarning, PackageOpen, ShieldAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Tab = 'dashboard' | 'incidents' | 'report' | 'donor';

interface NavItem {
  tab: Tab;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { tab: 'dashboard', label: 'Dashboard', sublabel: 'Live Command Center', icon: LayoutDashboard },
  { tab: 'incidents', label: 'Incidents Feed', sublabel: 'Active crisis log', icon: Siren },
  { tab: 'report', label: 'Report Emergency', sublabel: 'Public intake', icon: FileWarning },
  { tab: 'donor', label: 'Donor Hub', sublabel: 'Supply & demand', icon: PackageOpen },
];

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-800/80 bg-[#080b14]/95 backdrop-blur-xl md:flex">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800/80">
        <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-rose-600 to-orange-600 shadow-lg shadow-rose-900/40">
          <ShieldAlert className="h-6 w-6 text-white" />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3">
            <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping-slow" />
            <span className="absolute inset-0 rounded-full bg-rose-500" />
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold leading-tight text-white">ResQNet</h1>
          <p className="text-[11px] leading-tight text-slate-400">Sri Lanka Relief OS</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const isActive = active === item.tab;
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              className={`group relative w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all duration-200 ${
                isActive
                  ? 'bg-slate-800/70 text-white'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-rose-500 to-orange-500" />
              )}
              <span
                className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${
                  isActive ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="flex flex-col min-w-0">
                <span className="text-sm font-semibold leading-tight">{item.label}</span>
                <span className="text-[11px] leading-tight text-slate-500">{item.sublabel}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800/80">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">System Live</span>
          </div>
          <p className="text-[11px] leading-snug text-slate-500">
            NDRSC coordination grid online. Updates streaming from field teams across 6 districts.
          </p>
        </div>
      </div>
    </aside>
  );
}
