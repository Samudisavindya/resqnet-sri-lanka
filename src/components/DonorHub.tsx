import { useMemo, useState } from 'react';
import {
  Zap,
  PackageOpen,
  HandHeart,
  Building2,
  MapPin,
  Phone,
  Plus,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../store';
import { useToast } from '../toast';
import { PRIORITY_STYLES } from '../ui';
import { DISTRICTS } from '../mockData';
import type { DonorSupply, ResourceType } from '../types';

const RESOURCES: ResourceType[] = [
  'Water Bottles',
  'Rice',
  'Milk Powder',
  'Dry Rations',
  'Medical Kits',
  'Tents',
  'Clothing',
  'Sanitary Packs',
  'Generators',
];

export default function DonorHub() {
  const { requests, supplies, matchedPairs, runSmartMatch, clearMatches, addSupply } = useApp();
  const { notify } = useToast();
  const [matching, setMatching] = useState(false);

  const openRequests = useMemo(
    () => requests.filter((r) => r.status !== 'Resolved'),
    [requests]
  );

  const matchedSupplies = useMemo(
    () => new Set(matchedPairs.map((p) => p.supplyId)),
    [matchedPairs]
  );

  const matchedRequests = useMemo(
    () => new Set(matchedPairs.map((p) => p.requestId)),
    [matchedPairs]
  );

  const handleMatch = async () => {
    setMatching(true);
    try {
      const n = await runSmartMatch();
      if (n > 0) {
        notify('success', `${n} smart matches made`, 'Donor supplies matched to critical requests. Review highlighted pairs.');
      } else {
        notify('info', 'No new matches', 'All compatible supplies are already matched or no overlap exists.');
      }
    } catch {
      notify('error', 'Match failed', 'Could not persist matches. Please retry.');
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Donor Hub</h1>
          <p className="text-sm text-slate-400 mt-1">
            Matching supply availability with localized demand
          </p>
        </div>
        <div className="flex items-center gap-2">
          {matchedPairs.length > 0 && (
            <button
              onClick={() => { void clearMatches(); }}
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:border-slate-600 hover:text-white transition"
            >
              Clear Matches
            </button>
          )}
          <button
            onClick={handleMatch}
            disabled={matching}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-amber-900/30 transition-all hover:brightness-110 disabled:opacity-50"
          >
            {matching ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" /> Matching...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" /> Smart Match
              </>
            )}
          </button>
        </div>
      </header>

      {matchedPairs.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <p className="text-sm text-emerald-200">
            <strong>{matchedPairs.length}</strong> supply-demand pairs matched. Highlighted below with fulfillment ratios.
          </p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-[#0b0f1a] flex flex-col">
          <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/15 text-rose-300">
                <PackageOpen className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Active Resource Requests</h2>
                <p className="text-[11px] text-slate-500">Extracted from open incidents</p>
              </div>
            </div>
            <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300">
              {openRequests.length}
            </span>
          </header>
          <div className="flex-1 overflow-y-auto scrollbar-slim p-3 space-y-2.5 max-h-[640px]">
            {openRequests.map((req) => {
              const isMatched = matchedRequests.has(req.id);
              const pair = matchedPairs.find((p) => p.requestId === req.id);
              return (
                <div
                  key={req.id}
                  className={`rounded-xl border p-3.5 transition-all ${
                    isMatched
                      ? 'border-emerald-500/40 bg-emerald-500/5 glow-emerald'
                      : 'border-slate-800 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Layers className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span className="text-sm font-medium text-slate-200 truncate">
                        {req.resource}
                      </span>
                    </div>
                    <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${PRIORITY_STYLES[req.priority]}`}>
                      {req.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
                    <MapPin className="h-3 w-3" />
                    {req.location}, {req.district}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Need: <span className="font-semibold text-rose-300">{req.quantity.toLocaleString()}</span>
                    </span>
                    {pair && (
                      <span className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        <ArrowRight className="h-3 w-3" /> {pair.ratio} covered
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {openRequests.length === 0 && (
              <p className="text-sm text-slate-500 py-12 text-center">No open resource requests.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#0b0f1a] flex flex-col">
          <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <HandHeart className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Available Donor Supplies</h2>
                <p className="text-[11px] text-slate-500">Logged by corporations & donors</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
              {supplies.length}
            </span>
          </header>
          <div className="flex-1 overflow-y-auto scrollbar-slim p-3 space-y-2.5 max-h-[560px]">
            {supplies.map((sup) => {
              const isMatched = matchedSupplies.has(sup.id);
              return (
                <div
                  key={sup.id}
                  className={`rounded-xl border p-3.5 transition-all ${
                    isMatched
                      ? 'border-emerald-500/40 bg-emerald-500/5 glow-emerald'
                      : 'border-slate-800 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Building2 className="h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span className="text-sm font-medium text-slate-200 truncate">
                        {sup.resource}
                      </span>
                    </div>
                    <span className="font-semibold text-emerald-300 text-sm">
                      {sup.quantity.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
                    <MapPin className="h-3 w-3" />
                    {sup.location}, {sup.district}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">{sup.donor}</span>
                    <span className="font-mono flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {sup.contact}
                    </span>
                  </div>
                  {isMatched && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Matched to request
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <AddSupplyForm onAdd={addSupply} />
        </section>
      </div>
    </div>
  );
}

function AddSupplyForm({ onAdd }: { onAdd: (s: DonorSupply) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [donor, setDonor] = useState('');
  const [resource, setResource] = useState('');
  const [qty, setQty] = useState('');
  const [district, setDistrict] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [saving, setSaving] = useState(false);
  const { notify } = useToast();

  const reset = () => {
    setDonor('');
    setResource('');
    setQty('');
    setDistrict('');
    setLocation('');
    setContact('');
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseInt(qty, 10);
    if (!donor || !resource || !qty || !district) {
      notify('error', 'Missing fields', 'Donor, resource, quantity, and district are required.');
      return;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      notify('error', 'Invalid quantity', 'Quantity must be a positive number.');
      return;
    }
    setSaving(true);
    try {
      await onAdd({
        id: '',
        donor,
        resource: resource as ResourceType,
        quantity,
        district,
        location: location || district,
        contact: contact || '—',
        matched: false,
      });
      notify('success', 'Supply logged', `${quantity.toLocaleString()} × ${resource} saved to donor inventory.`);
      reset();
    } catch {
      notify('error', 'Save failed', 'The supply could not be stored. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <div className="border-t border-slate-800 p-3">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 py-2.5 text-xs font-semibold text-slate-300 hover:border-slate-600 hover:text-white transition"
        >
          <Plus className="h-4 w-4" /> Log New Supply
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border-t border-slate-800 p-4 space-y-3 animate-slide-up">
      <input value={donor} onChange={(e) => setDonor(e.target.value)} placeholder="Donor / organization" className="dh-input" />
      <div className="grid grid-cols-2 gap-2">
        <select value={resource} onChange={(e) => setResource(e.target.value)} className={`dh-input ${resource ? 'text-slate-200' : 'text-slate-500'}`}>
          <option value="">Resource...</option>
          {RESOURCES.map((r) => (
            <option key={r} value={r} className="bg-slate-900">{r}</option>
          ))}
        </select>
        <input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Quantity" type="number" min="1" className="dh-input" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className={`dh-input ${district ? 'text-slate-200' : 'text-slate-500'}`}>
          <option value="">District...</option>
          {[...DISTRICTS].map((d) => (
            <option key={d} value={d} className="bg-slate-900">{d}</option>
          ))}
        </select>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="dh-input" />
      </div>
      <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact" className="dh-input font-mono" />
      <div className="flex gap-2">
        <button type="button" onClick={reset} disabled={saving} className="flex-1 rounded-lg border border-slate-700 bg-slate-900/40 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-emerald-500/90 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
          {saving ? 'Saving...' : 'Add Supply'}
        </button>
      </div>
      <style>{`
        .dh-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(30 41 59);
          background: rgb(2 6 23 / 0.6);
          padding: 0.5rem 0.625rem;
          font-size: 0.8125rem;
          color: rgb(226 232 240);
        }
        .dh-input::placeholder { color: rgb(71 85 105); }
        .dh-input:focus { outline: none; border-color: rgb(71 85 105); }
      `}</style>
    </form>
  );
}
