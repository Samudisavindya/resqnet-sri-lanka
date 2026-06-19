import { LayoutDashboard, Siren, FileWarning, PackageOpen, ShieldAlert } from 'lucide-react';
import type { Tab } from './Sidebar';

const NAV = [
  { tab: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
  { tab: 'incidents' as Tab, label: 'Incidents', icon: Siren },
  { tab: 'report' as Tab, label: 'Report', icon: FileWarning },
  { tab: 'donor' as Tab, label: 'Donor Hub', icon: PackageOpen },
];

export default function MobileNav({
  active,
  onNavigate,
}: {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}) {
  return (
    <>
      <header className="md:hidden sticky top-0 z-40 flex items-center gap-3 border-b border-slate-800/80 bg-[#080b14]/95 backdrop-blur-xl px-4 py-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-rose-600 to-orange-600 shadow-lg shadow-rose-900/40">
          <ShieldAlert className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight text-white">ResQNet Sri Lanka</p>
          <p className="text-[10px] text-slate-400">ශ්‍රී ලංකා ආපදා සහන පද්ධතිය</p>
        </div>
      </header>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-800/80 bg-[#080b14]/95 backdrop-blur-xl flex">
        {NAV.map((item) => {
          const isActive = active === item.tab;
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
                isActive ? 'text-rose-300' : 'text-slate-500'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.2]' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
