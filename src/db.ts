import { supabase } from './supabaseClient';
import type { Incident, DonorSupply, Priority, IncidentStatus, IncidentCategory } from './types';

interface IncidentRow {
  id: string;
  location: string;
  district: string;
  category: string;
  priority: string;
  status: string;
  summary: string;
  reporter_name: string | null;
  reporter_contact: string | null;
  reported_at: string;
}

interface SupplyRow {
  id: string;
  donor: string;
  resource: string;
  quantity: number;
  district: string;
  location: string;
  contact: string;
  matched: boolean;
}

const toIncident = (r: IncidentRow): Incident => ({
  id: r.id,
  location: r.location,
  district: r.district,
  category: r.category as IncidentCategory,
  priority: r.priority as Priority,
  status: r.status as IncidentStatus,
  summary: r.summary,
  reporterName: r.reporter_name ?? undefined,
  reporterContact: r.reporter_contact ?? undefined,
  reportedAt: r.reported_at,
});

const toSupply = (r: SupplyRow): DonorSupply => ({
  id: r.id,
  donor: r.donor,
  resource: r.resource as DonorSupply['resource'],
  quantity: r.quantity,
  district: r.district,
  location: r.location,
  contact: r.contact,
  matched: r.matched,
});

export async function fetchIncidents(): Promise<Incident[]> {
  const { data, error } = await supabase
    .from('incidents')
    .select('id, location, district, category, priority, status, summary, reporter_name, reporter_contact, reported_at')
    .order('reported_at', { ascending: false });
  if (error) throw error;
  return (data as IncidentRow[]).map(toIncident);
}

export async function insertIncident(inc: Incident): Promise<void> {
  const row = {
    id: inc.id,
    location: inc.location,
    district: inc.district,
    category: inc.category,
    priority: inc.priority,
    status: inc.status,
    summary: inc.summary,
    reporter_name: inc.reporterName ?? null,
    reporter_contact: inc.reporterContact ?? null,
    reported_at: inc.reportedAt,
  };
  const { error } = await supabase.from('incidents').insert(row);
  if (error) throw error;
}

export async function updateIncidentStatusDb(id: string, status: IncidentStatus): Promise<void> {
  const { error } = await supabase
    .from('incidents')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function fetchSupplies(): Promise<DonorSupply[]> {
  const { data, error } = await supabase
    .from('donor_supplies')
    .select('id, donor, resource, quantity, district, location, contact, matched')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as SupplyRow[]).map(toSupply);
}

export async function insertSupply(sup: DonorSupply): Promise<void> {
  const row = {
    id: sup.id,
    donor: sup.donor,
    resource: sup.resource,
    quantity: sup.quantity,
    district: sup.district,
    location: sup.location,
    contact: sup.contact,
    matched: sup.matched,
  };
  const { error } = await supabase.from('donor_supplies').insert(row);
  if (error) throw error;
}

export async function setSupplyMatchedDb(supplyIds: string[]): Promise<void> {
  if (supplyIds.length === 0) return;
  const { error } = await supabase
    .from('donor_supplies')
    .update({ matched: true })
    .in('id', supplyIds);
  if (error) throw error;
}

export async function clearAllSupplyMatchesDb(): Promise<void> {
  const { error } = await supabase
    .from('donor_supplies')
    .update({ matched: false })
    .eq('matched', true);
  if (error) throw error;
}
