/*
# Seed ResQNet with realistic Sri Lankan mock data

1. Purpose
Populates `incidents` and `donor_supplies` with highly realistic operational data so
the command center looks 100% operational out of the box. Uses `ON CONFLICT (id)
DO UPDATE` so the seed is idempotent and safe to re-run.

2. Incidents
12 incidents across severely-affected Sri Lankan districts: Badulla, Nuwara Eliya,
Kandy, Polonnaruwa, Matale, Kurunegala. `reported_at` values are anchored to fixed
ISO timestamps relative to a known reference (within ~48h) rather than `now()` so
the dataset is stable across replays and refreshes.

3. Donor supplies
10 corporate donor supply records spanning Colombo, Kurunegala, Kandy, Gampaha,
Matale and Galle.
*/

-- Incidents
INSERT INTO incidents
  (id, location, district, category, priority, status, summary, reporter_name, reporter_contact, reported_at)
VALUES
  ('SLR-2401', 'Keerthi Bandara Mw, Haputale', 'Badulla', 'Rescue', 'Critical', 'Dispatching',
   'Landslide buried two homes; three families reported trapped. Mudflow blocking access road. Urgent earth-moving equipment required.',
   'Saman Jayasinghe', '071 234 5678', '2026-06-17T08:00:00Z'),
  ('SLR-2402', 'Glen Falls Estate, Ragala', 'Nuwara Eliya', 'Rescue', 'Critical', 'Open',
   'Water level rising rapidly at estate line houses. 40+ residents cut off by overflowing tributary. Boats and ropes needed immediately.',
   'K. Mahendran', '077 889 1023', '2026-06-17T12:00:00Z'),
  ('SLR-2403', 'Wattegama Junction, Kandy', 'Kandy', 'Medical Support', 'High', 'Dispatching',
   'Temporary shelter at temple reports 12 children with fever and 2 elderly with breathing difficulty. Need doctor, paracetamol, and inhalers.',
   'Priyanka Senanayake', '076 452 1190', '2026-06-17T15:00:00Z'),
  ('SLR-2404', 'Medirigiriya Town, Polonnaruwa', 'Polonnaruwa', 'Food & Rations', 'High', 'Open',
   'Floodwaters receding but 300+ families in 4 welfare camps have exhausted dry rations. Need rice, milk powder, and drinking water for 3 days.',
   'Anura Bandara', '075 661 4477', '2026-06-17T20:00:00Z'),
  ('SLR-2405', 'Ukuwela Town, Matale', 'Matale', 'Shelter', 'High', 'Open',
   '85 homes damaged by high winds. 220 families displaced, sheltered at Ukuwala MV. Tents and tarpaulins urgently required.',
   'Nimal Perera', '072 330 8845', '2026-06-18T01:00:00Z'),
  ('SLR-2406', 'Mawathagama, Kurunegala', 'Kurunegala', 'Infrastructure', 'Medium', 'Open',
   'Main access bridge submerged. Power lines down across 4 villages. Need portable generators and cable repair crew.',
   'Chamara Silva', '078 990 3321', '2026-06-18T05:00:00Z'),
  ('SLR-2407', 'Bandarawela Town, Badulla', 'Badulla', 'Food & Rations', 'Medium', 'Dispatching',
   'Welfare camp at Bandarawela UC requests 200 water bottles and infant formula. Supply chain to Nuwara Eliya disrupted.',
   'Dilani Ekanayake', '071 776 2200', '2026-06-18T09:00:00Z'),
  ('SLR-2408', 'Nawalapitiya, Kandy', 'Kandy', 'Medical Support', 'Critical', 'Open',
   'Rescue team reports pregnant woman trapped in upper floor of flooded home outside Nawalapitiya. Needs evacuation and obstetric care on arrival.',
   'Capt. R. Fernando', '077 551 0098', '2026-06-18T13:00:00Z'),
  ('SLR-2409', 'Talatuoya, Kandy', 'Kandy', 'Shelter', 'Low', 'Resolved',
   'Roof damage to 6 homes. Families relocated to neighbor homes. Tarpaulins delivered and assessed.',
   'Sunil Rathnayake', '074 228 6610', '2026-06-18T18:00:00Z'),
  ('SLR-2410', 'Hingurakgoda, Polonnaruwa', 'Polonnaruwa', 'Rescue', 'High', 'Dispatching',
   'Villagers cut off by breached tank bund. Boat rescue dispatched from Minneriya. 2 elderly await evacuation.',
   'G. Ranjith', '075 110 4422', '2026-06-18T23:00:00Z'),
  ('SLR-2411', 'Dikoya, Nuwara Eliya', 'Nuwara Eliya', 'Logistics', 'Medium', 'Open',
   'Access road to two estates blocked by fallen trees. Need chainsaw crew and fuel for clearing operations.',
   'Tharaka W.', '076 882 3315', '2026-06-19T02:00:00Z'),
  ('SLR-2412', 'Rambukkana, Kurunegala', 'Kurunegala', 'Food & Rations', 'Low', 'Resolved',
   'Request for 50 cooked meals fulfilled by local temple kitchen. Situation stable.',
   'Mangala D.', '078 220 1199', '2026-06-19T05:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  location = EXCLUDED.location,
  district = EXCLUDED.district,
  category = EXCLUDED.category,
  priority = EXCLUDED.priority,
  status = EXCLUDED.status,
  summary = EXCLUDED.summary,
  reporter_name = EXCLUDED.reporter_name,
  reporter_contact = EXCLUDED.reporter_contact,
  reported_at = EXCLUDED.reported_at;

-- Donor supplies
INSERT INTO donor_supplies
  (id, donor, resource, quantity, district, location, contact, matched)
VALUES
  ('SUP-201', 'Cargills (Ceylon) PLC', 'Water Bottles', 2000, 'Colombo', 'Kotahena Hub', '011 477 2000', false),
  ('SUP-202', 'Munchee / Ceylon Biscuits', 'Dry Rations', 500, 'Colombo', 'Pannipitiya Warehouse', '011 271 3000', false),
  ('SUP-203', 'Nestlé Lanka', 'Milk Powder', 400, 'Kurunegala', 'Kurunegala Plant', '037 222 8100', false),
  ('SUP-204', 'Abans PLC', 'Generators', 10, 'Colombo', 'Malabe Hub', '011 287 1100', false),
  ('SUP-205', 'Hemas Holdings', 'Medical Kits', 50, 'Gampaha', 'Wattala Depot', '011 294 7700', false),
  ('SUP-206', 'Dilmah / MJF Foundation', 'Rice', 800, 'Kandy', 'Pallekele Center', '081 244 8800', false),
  ('SUP-207', 'Hayleys Agriculture', 'Tents', 40, 'Matale', 'Dambulla Depot', '066 228 5500', false),
  ('SUP-208', 'John Keells Foundation', 'Sanitary Packs', 600, 'Colombo', 'JKH HQ', '011 269 9258', false),
  ('SUP-209', 'Aitken Spence', 'Clothing', 1000, 'Galle', 'Galle Port Warehouse', '091 224 6100', false),
  ('SUP-210', 'Litro Gas & Volunteers', 'Water Bottles', 800, 'Kurunegala', 'Kurunegala Town', '037 433 1100', false)
ON CONFLICT (id) DO UPDATE SET
  donor = EXCLUDED.donor,
  resource = EXCLUDED.resource,
  quantity = EXCLUDED.quantity,
  district = EXCLUDED.district,
  location = EXCLUDED.location,
  contact = EXCLUDED.contact,
  matched = EXCLUDED.matched;
