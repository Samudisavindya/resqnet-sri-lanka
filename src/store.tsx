import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Incident, ResourceRequest, DonorSupply, MatchedPair, IncidentStatus } from './types';
import {
  fetchIncidents,
  insertIncident,
  updateIncidentStatusDb,
  fetchSupplies,
  insertSupply,
  setSupplyMatchedDb,
  clearAllSupplyMatchesDb,
} from './db';
import { INITIAL_INCIDENTS, INITIAL_SUPPLIES } from './mockData';

interface AppState {
  incidents: Incident[];
  requests: ResourceRequest[];
  supplies: DonorSupply[];
  matchedPairs: MatchedPair[];
  loading: boolean;
  loadError: string | null;
  addIncident: (incident: Incident) => Promise<void>;
  updateIncidentStatus: (id: string, status: IncidentStatus) => Promise<void>;
  addSupply: (supply: DonorSupply) => Promise<void>;
  runSmartMatch: () => Promise<number>;
  clearMatches: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

let idCounter = 2500;
const nextIncidentId = () => `SLR-${++idCounter}`;
export const generateIncidentId = nextIncidentId;

let supCounter = 300;
const nextSupId = () => `SUP-${++supCounter}`;

function deriveRequests(incidents: Incident[]): ResourceRequest[] {
  const out: ResourceRequest[] = [];
  let reqSeq = 100;
  for (const inc of incidents) {
    if (inc.status === 'Resolved') continue;
    let resource: ResourceRequest['resource'] | null = null;
    let quantity = 0;
    if (inc.category === 'Food & Rations') {
      resource = 'Rice';
      quantity = 200;
    } else if (inc.category === 'Medical Support') {
      resource = 'Medical Kits';
      quantity = 5;
    } else if (inc.category === 'Rescue') {
      resource = 'Water Bottles';
      quantity = 500;
    }
    if (resource) {
      out.push({
        id: `REQ-${++reqSeq}`,
        incidentId: inc.id,
        resource,
        quantity,
        district: inc.district,
        location: inc.location,
        priority: inc.priority,
        status: inc.status,
      });
    }
  }
  return out;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [supplies, setSupplies] = useState<DonorSupply[]>(INITIAL_SUPPLIES);
  const [matchedPairs, setMatchedPairs] = useState<MatchedPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [incs, sups] = await Promise.all([fetchIncidents(), fetchSupplies()]);
      setIncidents(incs);
      setSupplies(sups);
    } catch (err) {
      console.error('Failed to load from Supabase, using fallback seed:', err);
      setLoadError(
        err instanceof Error ? err.message : 'Could not reach the database.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const requests = useMemo(() => deriveRequests(incidents), [incidents]);

  const addIncident = useCallback(async (incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
    try {
      await insertIncident(incident);
    } catch (err) {
      console.error('Insert incident failed, rolling back:', err);
      setIncidents((prev) => prev.filter((i) => i.id !== incident.id));
      throw err;
    }
  }, []);

  const updateIncidentStatus = useCallback(async (id: string, status: IncidentStatus) => {
    const prev = incidents;
    setIncidents((cur) => cur.map((i) => (i.id === id ? { ...i, status } : i)));
    try {
      await updateIncidentStatusDb(id, status);
    } catch (err) {
      console.error('Update incident status failed, rolling back:', err);
      setIncidents(prev);
      throw err;
    }
  }, [incidents]);

  const addSupply = useCallback(async (supply: DonorSupply) => {
    const withId = { ...supply, id: supply.id || nextSupId() };
    setSupplies((prev) => [withId, ...prev]);
    try {
      await insertSupply(withId);
    } catch (err) {
      console.error('Insert supply failed, rolling back:', err);
      setSupplies((prev) => prev.filter((s) => s.id !== withId.id));
      throw err;
    }
  }, []);

  const runSmartMatch = useCallback(async () => {
    const openReqs = requests.filter((r) => r.status !== 'Resolved');
    const availSupplies = supplies.filter((s) => !s.matched);
    const pairs: MatchedPair[] = [];
    const matchedSupplyIds = new Set<string>();

    for (const req of openReqs) {
      const match = availSupplies.find(
        (s) => !matchedSupplyIds.has(s.id) && s.resource === req.resource
      );
      if (match) {
        const fulfilled = Math.min(match.quantity, req.quantity);
        pairs.push({
          requestId: req.id,
          supplyId: match.id,
          ratio: `${fulfilled}/${req.quantity}`,
        });
        matchedSupplyIds.add(match.id);
      }
    }

    setMatchedPairs(pairs);
    const ids = Array.from(matchedSupplyIds);
    setSupplies((prev) =>
      prev.map((s) => ({ ...s, matched: matchedSupplyIds.has(s.id) ? true : s.matched }))
    );
    try {
      await setSupplyMatchedDb(ids);
    } catch (err) {
      console.error('Persisting matches failed:', err);
    }
    return pairs.length;
  }, [requests, supplies]);

  const clearMatches = useCallback(async () => {
    setMatchedPairs([]);
    setSupplies((prev) => prev.map((s) => ({ ...s, matched: false })));
    try {
      await clearAllSupplyMatchesDb();
    } catch (err) {
      console.error('Clearing matches failed:', err);
    }
  }, []);

  const value = useMemo<AppState>(
    () => ({
      incidents,
      requests,
      supplies,
      matchedPairs,
      loading,
      loadError,
      addIncident,
      updateIncidentStatus,
      addSupply,
      runSmartMatch,
      clearMatches,
    }),
    [
      incidents,
      requests,
      supplies,
      matchedPairs,
      loading,
      loadError,
      addIncident,
      updateIncidentStatus,
      addSupply,
      runSmartMatch,
      clearMatches,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
