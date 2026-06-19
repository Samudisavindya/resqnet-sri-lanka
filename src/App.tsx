import { useState } from 'react';
import { AppProvider, useApp } from './store';
import { ToastProvider } from './toast';
import Sidebar, { type Tab } from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import IncidentsFeed from './components/IncidentsFeed';
import ReportEmergency from './components/ReportEmergency';
import DonorHub from './components/DonorHub';
import { Loader2, AlertTriangle } from 'lucide-react';

function Shell() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const { loading, loadError } = useApp();

  return (
    <div className="min-h-screen grid-bg">
      <Sidebar active={tab} onNavigate={setTab} />
      <MobileNav active={tab} onNavigate={setTab} />
      <main className="md:pl-72 min-h-screen pb-24 md:pb-8">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-slate-500" />
              <p className="text-sm text-slate-500">Loading live data from command center…</p>
            </div>
          ) : (
            <>
              {loadError && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 animate-fade-in">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                  <p className="text-sm text-amber-200">
                    Showing cached sample data — live database sync is unavailable{loadError ? ` (${loadError})` : ''}. Entries made now may not persist across refresh until the connection is restored.
                  </p>
                </div>
              )}
              {tab === 'dashboard' && <Dashboard />}
              {tab === 'incidents' && <IncidentsFeed />}
              {tab === 'report' && <ReportEmergency />}
              {tab === 'donor' && <DonorHub />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <Shell />
      </AppProvider>
    </ToastProvider>
  );
}
