import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { IncidentsFeed } from './components/IncidentsFeed';
import { ReportEmergency } from './components/ReportEmergency';
import { DonorHub } from './components/DonorHub';
import { Incident, DonorSupply, DashboardStats, DistrictData, ResourceData } from './lib/types';
import {
  mockIncidents,
  mockDonorSupplies,
  mockDashboardStats,
  mockDistrictData,
  mockResourceData
} from './lib/mockData';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // State for incidents and donor supplies with mock data initialization
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [donorSupplies, setDonorSupplies] = useState<DonorSupply[]>(mockDonorSupplies);

  // Stats calculated from current data
  const stats: DashboardStats = {
    activeEmergencies: incidents.filter(i => i.status === 'Open' || i.status === 'Dispatching').length,
    familiesDisplaced: mockDashboardStats.familiesDisplaced,
    activeVolunteers: mockDashboardStats.activeVolunteers,
    reliefPacksDistributed: mockDashboardStats.reliefPacksDistributed,
    reliefPacksTarget: mockDashboardStats.reliefPacksTarget
  };

  const districtData: DistrictData[] = mockDistrictData;
  const resourceData: ResourceData[] = mockResourceData;

  // Handle new incident submission
  const handleNewIncident = (incident: Omit<Incident, 'id' | 'reported_at'>) => {
    const newIncident: Incident = {
      ...incident,
      id: `INC-${Date.now().toString().slice(-8)}`,
      reported_at: new Date().toISOString()
    };
    setIncidents(prev => [newIncident, ...prev]);
  };

  // Handle new donor supply submission
  const handleNewSupply = (supply: Omit<DonorSupply, 'id' | 'created_at' | 'matched'>) => {
    const newSupply: DonorSupply = {
      ...supply,
      id: `DON-${Date.now().toString().slice(-8)}`,
      matched: false,
      created_at: new Date().toISOString()
    };
    setDonorSupplies(prev => [newSupply, ...prev]);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Render authenticated app
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            incidents={incidents}
            stats={stats}
            districtData={districtData}
            resourceData={resourceData}
          />
        );
      case 'incidents':
        return (
          <IncidentsFeed
            incidents={incidents}
            onSelectIncident={(incident) => console.log('Selected:', incident)}
          />
        );
      case 'report':
        return (
          <ReportEmergency onSubmit={handleNewIncident} />
        );
      case 'donor':
        return (
          <DonorHub
            incidents={incidents}
            donorSupplies={donorSupplies}
            onAddSupply={handleNewSupply}
          />
        );
      default:
        return <Dashboard incidents={incidents} stats={stats} districtData={districtData} resourceData={resourceData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="ml-64 min-h-screen">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
