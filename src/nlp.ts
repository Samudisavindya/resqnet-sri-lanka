import type { IncidentCategory, Priority } from './types';

interface Rule {
  category: IncidentCategory;
  priority: Priority;
  keywords: string[];
}

const RULES: Rule[] = [
  {
    category: 'Rescue',
    priority: 'Critical',
    keywords: [
      'trapped', 'landslide', 'flood', 'water rising', 'roof', 'rescue',
      'danger', 'drowning', 'swept away', 'buried', 'collapse', 'stuck',
      'නායයෑමක්', 'ගිලිලා', 'ගංවතුර', 'සලකුණු', 'අවදානම',
    ],
  },
  {
    category: 'Medical Support',
    priority: 'High',
    keywords: [
      'injury', 'medicine', 'hospital', 'doctor', 'fever', 'bleeding',
      'sick', 'illness', 'fracture', 'wound', 'ambulance',
      'බේත්', 'තනාල', 'රෝහල', 'උණ', 'තුවාල',
    ],
  },
  {
    category: 'Food & Rations',
    priority: 'High',
    keywords: [
      'hungry', 'food', 'rations', 'water bottle', 'milk powder', 'rice',
      'meals', 'starving', 'dry rations', 'no water', 'drinking water',
      'කන්න', 'හාල්', 'කෑම', 'බෝතල් වතුර', 'කිරි පවුඩර්',
    ],
  },
];

export interface ParseResult {
  category: IncidentCategory;
  priority: Priority;
  matchedKeywords: string[];
  matchedRule: string | null;
}

export function parseSituation(text: string): ParseResult {
  const lower = text.toLowerCase();
  let matchedKeywords: string[] = [];

  let best: Rule | null = null;
  for (const rule of RULES) {
    const hits = rule.keywords.filter((k) => lower.includes(k.toLowerCase()));
    if (hits.length > 0 && hits.length >= matchedKeywords.length) {
      matchedKeywords = hits;
      best = rule;
    }
  }

  if (best) {
    return {
      category: best.category,
      priority: best.priority,
      matchedKeywords,
      matchedRule: best.category,
    };
  }

  return {
    category: 'Logistics',
    priority: 'Medium',
    matchedKeywords: [],
    matchedRule: null,
  };
}
