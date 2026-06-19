/*
# ResQNet Sri Lanka — core schema

1. Overview
This migration creates the two persistent tables backing the ResQNet disaster
relief command center: `incidents` and `donor_supplies`. The app is single-tenant
(no sign-in); every visitor shares the same operational view of the data, so
policies are intentionally public for both anon and authenticated roles.

2. New Tables
- `incidents`
  - `id`            text PRIMARY KEY (e.g. "SLR-2401"); application-assigned
  - `location`      text NOT NULL (specific neighborhood / landmark)
  - `district`      text NOT NULL (Sri Lankan district name)
  - `category`      text NOT NULL (Rescue, Food & Rations, Medical Support, Shelter, Infrastructure, Logistics)
  - `priority`      text NOT NULL (Critical, High, Medium, Low)
  - `status`        text NOT NULL DEFAULT 'Open' (Open, Dispatching, Resolved)
  - `summary`       text NOT NULL (situation details reported by submitter)
  - `reporter_name` text (nullable)
  - `reporter_contact` text (nullable)
  - `reported_at`   timestamptz NOT NULL DEFAULT now()
  - `created_at`    timestamptz NOT NULL DEFAULT now() (DB insert time)

- `donor_supplies`
  - `id`        text PRIMARY KEY (e.g. "SUP-201"); application-assigned
  - `donor`     text NOT NULL (organization / individual)
  - `resource`  text NOT NULL (Water Bottles, Rice, Milk Powder, Dry Rations, Medical Kits, Tents, Clothing, Sanitary Packs, Generators)
  - `quantity`  integer NOT NULL DEFAULT 0 CHECK (quantity >= 0)
  - `district`  text NOT NULL
  - `location`  text NOT NULL
  - `contact`   text NOT NULL DEFAULT '—'
  - `matched`   boolean NOT NULL DEFAULT false
  - `created_at` timestamptz NOT NULL DEFAULT now()

3. Indexes
- `incidents_status_priority_idx` on (status, priority) — powers the active-emergency
  counts and dispatch queue on the dashboard.
- `incidents_district_idx` on (district) — powers the "incidents by district" chart.
- `donor_supplies_resource_idx` on (resource) — powers Smart Match lookups.
- `donor_supplies_matched_idx` on (matched) — filters available (unmatched) supplies.

4. Security
- RLS ENABLED on both tables.
- Four CRUD policies each (SELECT/INSERT/UPDATE/DELETE) scoped to `anon, authenticated`
  with `USING (true)` / `WITH CHECK (true)` because the data is intentionally public
  and shared across all visitors of this single-tenant command center.
*/

-- ---------- incidents ----------
CREATE TABLE IF NOT EXISTS incidents (
  id text PRIMARY KEY,
  location text NOT NULL,
  district text NOT NULL,
  category text NOT NULL,
  priority text NOT NULL,
  status text NOT NULL DEFAULT 'Open',
  summary text NOT NULL,
  reporter_name text,
  reporter_contact text,
  reported_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS incidents_status_priority_idx
  ON incidents (status, priority);
CREATE INDEX IF NOT EXISTS incidents_district_idx
  ON incidents (district);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_incidents" ON incidents;
CREATE POLICY "public_select_incidents"
  ON incidents FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_incidents" ON incidents;
CREATE POLICY "public_insert_incidents"
  ON incidents FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_incidents" ON incidents;
CREATE POLICY "public_update_incidents"
  ON incidents FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_incidents" ON incidents;
CREATE POLICY "public_delete_incidents"
  ON incidents FOR DELETE
  TO anon, authenticated USING (true);

-- ---------- donor_supplies ----------
CREATE TABLE IF NOT EXISTS donor_supplies (
  id text PRIMARY KEY,
  donor text NOT NULL,
  resource text NOT NULL,
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  district text NOT NULL,
  location text NOT NULL,
  contact text NOT NULL DEFAULT '—',
  matched boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS donor_supplies_resource_idx
  ON donor_supplies (resource);
CREATE INDEX IF NOT EXISTS donor_supplies_matched_idx
  ON donor_supplies (matched);

ALTER TABLE donor_supplies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_supplies" ON donor_supplies;
CREATE POLICY "public_select_supplies"
  ON donor_supplies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_supplies" ON donor_supplies;
CREATE POLICY "public_insert_supplies"
  ON donor_supplies FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_supplies" ON donor_supplies;
CREATE POLICY "public_update_supplies"
  ON donor_supplies FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_supplies" ON donor_supplies;
CREATE POLICY "public_delete_supplies"
  ON donor_supplies FOR DELETE
  TO anon, authenticated USING (true);
