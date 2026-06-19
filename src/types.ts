export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus = 'Open' | 'Dispatching' | 'Resolved';

export type IncidentCategory =
  | 'Rescue'
  | 'Food & Rations'
  | 'Medical Support'
  | 'Shelter'
  | 'Infrastructure'
  | 'Logistics';

export interface Incident {
  id: string;
  location: string;
  district: string;
  category: IncidentCategory;
  priority: Priority;
  reportedAt: string; // ISO timestamp
  status: IncidentStatus;
  summary: string;
  reporterName?: string;
  reporterContact?: string;
}

export type ResourceType =
  | 'Water Bottles'
  | 'Rice'
  | 'Milk Powder'
  | 'Dry Rations'
  | 'Medical Kits'
  | 'Tents'
  | 'Clothing'
  | 'Sanitary Packs'
  | 'Generators';

export interface ResourceRequest {
  id: string;
  incidentId: string;
  resource: ResourceType;
  quantity: number;
  district: string;
  location: string;
  priority: Priority;
  status: IncidentStatus;
}

export interface DonorSupply {
  id: string;
  donor: string;
  resource: ResourceType;
  quantity: number;
  district: string;
  location: string;
  contact: string;
  matched: boolean;
}

export interface MatchedPair {
  requestId: string;
  supplyId: string;
  ratio: string;
}
