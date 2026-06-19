import type { Incident, DonorSupply } from './types';

const now = Date.now();
const hrs = (h: number) => new Date(now - h * 3600_000).toISOString();

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'SLR-2401',
    location: 'Keerthi Bandara Mw, Haputale',
    district: 'Badulla',
    category: 'Rescue',
    priority: 'Critical',
    reportedAt: hrs(2),
    status: 'Dispatching',
    summary:
      'Landslide buried two homes; three families reported trapped. Mudflow blocking access road. Urgent earth-moving equipment required.',
    reporterName: 'Saman Jayasinghe',
    reporterContact: '071 234 5678',
  },
  {
    id: 'SLR-2402',
    location: 'Glen Falls Estate, Ragala',
    district: 'Nuwara Eliya',
    category: 'Rescue',
    priority: 'Critical',
    reportedAt: hrs(6),
    status: 'Open',
    summary:
      'Water level rising rapidly at estate line houses. 40+ residents cut off by overflowing tributary. Boats and ropes needed immediately.',
    reporterName: 'K. Mahendran',
    reporterContact: '077 889 1023',
  },
  {
    id: 'SLR-2403',
    location: 'Wattegama Junction, Kandy',
    district: 'Kandy',
    category: 'Medical Support',
    priority: 'High',
    reportedAt: hrs(9),
    status: 'Dispatching',
    summary:
      'Temporary shelter at temple reports 12 children with fever and 2 elderly with breathing difficulty. Need doctor, paracetamol, and inhalers.',
    reporterName: 'Priyanka Senanayake',
    reporterContact: '076 452 1190',
  },
  {
    id: 'SLR-2404',
    location: 'Medirigiriya Town, Polonnaruwa',
    district: 'Polonnaruwa',
    category: 'Food & Rations',
    priority: 'High',
    reportedAt: hrs(14),
    status: 'Open',
    summary:
      'Floodwaters receding but 300+ families in 4 welfare camps have exhausted dry rations. Need rice, milk powder, and drinking water for 3 days.',
    reporterName: 'Anura Bandara',
    reporterContact: '075 661 4477',
  },
  {
    id: 'SLR-2405',
    location: 'Ukuwela Town, Matale',
    district: 'Matale',
    category: 'Shelter',
    priority: 'High',
    reportedAt: hrs(18),
    status: 'Open',
    summary:
      '85 homes damaged by high winds. 220 families displaced, sheltered at Ukuwala MV. Tents and tarpaulins urgently required.',
    reporterName: 'Nimal Perera',
    reporterContact: '072 330 8845',
  },
  {
    id: 'SLR-2406',
    location: 'Mawathagama, Kurunegala',
    district: 'Kurunegala',
    category: 'Infrastructure',
    priority: 'Medium',
    reportedAt: hrs(22),
    status: 'Open',
    summary:
      'Main access bridge submerged. Power lines down across 4 villages. Need portable generators and cable repair crew.',
    reporterName: 'Chamara Silva',
    reporterContact: '078 990 3321',
  },
  {
    id: 'SLR-2407',
    location: 'Bandarawela Town, Badulla',
    district: 'Badulla',
    category: 'Food & Rations',
    priority: 'Medium',
    reportedAt: hrs(27),
    status: 'Dispatching',
    summary:
      'Welfare camp at Bandarawela UC requests 200 water bottles and infant formula. Supply chain to Nuwara Eliya disrupted.',
    reporterName: 'Dilani Ekanayake',
    reporterContact: '071 776 2200',
  },
  {
    id: 'SLR-2408',
    location: 'Nawalapitiya, Kandy',
    district: 'Kandy',
    category: 'Medical Support',
    priority: 'Critical',
    reportedAt: hrs(31),
    status: 'Open',
    summary:
      'Rescue team reports pregnant woman trapped in upper floor of flooded home outside Nawalapitiya. Needs evacuation and obstetric care on arrival.',
    reporterName: 'Capt. R. Fernando',
    reporterContact: '077 551 0098',
  },
  {
    id: 'SLR-2409',
    location: 'Talatuoya, Kandy',
    district: 'Kandy',
    category: 'Shelter',
    priority: 'Low',
    reportedAt: hrs(36),
    status: 'Resolved',
    summary:
      'Roof damage to 6 homes. Families relocated to neighbor homes. Tarpaulins delivered and assessed.',
    reporterName: 'Sunil Rathnayake',
    reporterContact: '074 228 6610',
  },
  {
    id: 'SLR-2410',
    location: 'Hingurakgoda, Polonnaruwa',
    district: 'Polonnaruwa',
    category: 'Rescue',
    priority: 'High',
    reportedAt: hrs(39),
    status: 'Dispatching',
    summary:
      'Villagers cut off by breached tank bund. Boat rescue dispatched from Minneriya. 2 elderly await evacuation.',
    reporterName: 'G. Ranjith',
    reporterContact: '075 110 4422',
  },
  {
    id: 'SLR-2411',
    location: 'Dikoya, Nuwara Eliya',
    district: 'Nuwara Eliya',
    category: 'Logistics',
    priority: 'Medium',
    reportedAt: hrs(44),
    status: 'Open',
    summary:
      'Access road to two estates blocked by fallen trees. Need chainsaw crew and fuel for clearing operations.',
    reporterName: 'Tharaka W.',
    reporterContact: '076 882 3315',
  },
  {
    id: 'SLR-2412',
    location: 'Rambukkana, Kurunegala',
    district: 'Kurunegala',
    category: 'Food & Rations',
    priority: 'Low',
    reportedAt: hrs(47),
    status: 'Resolved',
    summary:
      'Request for 50 cooked meals fulfilled by local temple kitchen. Situation stable.',
    reporterName: 'Mangala D.',
    reporterContact: '078 220 1199',
  },
];

export const INITIAL_SUPPLIES: DonorSupply[] = [
  { id: 'SUP-201', donor: 'Cargills (Ceylon) PLC', resource: 'Water Bottles', quantity: 2000, district: 'Colombo', location: 'Kotahena Hub', contact: '011 477 2000', matched: false },
  { id: 'SUP-202', donor: 'Munchee / Ceylon Biscuits', resource: 'Dry Rations', quantity: 500, district: 'Colombo', location: 'Pannipitiya Warehouse', contact: '011 271 3000', matched: false },
  { id: 'SUP-203', donor: 'Nestlé Lanka', resource: 'Milk Powder', quantity: 400, district: 'Kurunegala', location: 'Kurunegala Plant', contact: '037 222 8100', matched: false },
  { id: 'SUP-204', donor: 'Abans PLC', resource: 'Generators', quantity: 10, district: 'Colombo', location: 'Malabe Hub', contact: '011 287 1100', matched: false },
  { id: 'SUP-205', donor: 'Hemas Holdings', resource: 'Medical Kits', quantity: 50, district: 'Gampaha', location: 'Wattala Depot', contact: '011 294 7700', matched: false },
  { id: 'SUP-206', donor: 'Dilmah / MJF Foundation', resource: 'Rice', quantity: 800, district: 'Kandy', location: 'Pallekele Center', contact: '081 244 8800', matched: false },
  { id: 'SUP-207', donor: 'Hayleys Agriculture', resource: 'Tents', quantity: 40, district: 'Matale', location: 'Dambulla Depot', contact: '066 228 5500', matched: false },
  { id: 'SUP-208', donor: 'John Keells Foundation', resource: 'Sanitary Packs', quantity: 600, district: 'Colombo', location: 'JKH HQ', contact: '011 269 9258', matched: false },
  { id: 'SUP-209', donor: 'Aitken Spence', resource: 'Clothing', quantity: 1000, district: 'Galle', location: 'Galle Port Warehouse', contact: '091 224 6100', matched: false },
  { id: 'SUP-210', donor: 'Litro Gas & Volunteers', resource: 'Water Bottles', quantity: 800, district: 'Kurunegala', location: 'Kurunegala Town', contact: '037 433 1100', matched: false },
];

export const DISTRICTS = [
  'Colombo', 'Kandy', 'Galle', 'Gampaha', 'Kurunegala', 'Matale',
  'Badulla', 'Nuwara Eliya', 'Polonnaruwa', 'Ratnapura', 'Anuradhapura',
  'Jaffna', 'Batticaloa', 'Trincomalee', 'Matara', 'Kegalle', 'Monaragala',
  'Hambantota', 'Kalutara', 'Puttalam', 'Vavuniya', 'Mannar', 'Mullaitivu', 'Kilinochchi', 'Ampara',
] as const;


