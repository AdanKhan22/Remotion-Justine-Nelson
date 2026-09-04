import {loadFont} from '@remotion/google-fonts/PlayfairDisplay';
import * as THREE from 'three';

export const {fontFamily: brandSerifFont} = loadFont('normal', {
  weights: ['400', '700', '900'],
  subsets: ['latin'],
});

export const BRAND_COLORS = {
  white: '#FFFFFF',
  blushPink: '#F4DADE',
  coral: '#FF5D3C',
  iceBlue: '#C1E1E6',
  lilac: '#EDA2E2',
  deepNavy: '#23406F',
  canvasBg: '#EEF2F6',
  stateDefault: '#FFFFFF',
  stateBorder: 'rgba(35, 64, 111, 0.32)',
};

export const WATER_MASK_URL =
  'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png';
export const US_TOPO_JSON =
  'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

export const US_LAT = 39.8283;
export const US_LNG = -98.5795;
export const GLOBE_RADIUS = 2;

export const CAMERA_PRESETS = {
  fullUS: {zoom: 1.0, txFactor: 0, tyFactor: 0, origin: '50% 50%'},
  virginia: {zoom: 1.65, txFactor: -0.28, tyFactor: 0.02, origin: '78% 47%'},
  colorado: {zoom: 2.2, txFactor: 0.12, tyFactor: -0.02, origin: '38% 48%'},
  maryland: {zoom: 2.3, txFactor: -0.36, tyFactor: -0.02, origin: '79% 42%'},
  iowa: {zoom: 2.2, txFactor: -0.05, tyFactor: -0.05, origin: '55% 40%'},
  michigan: {zoom: 2.2, txFactor: -0.15, tyFactor: -0.1, origin: '65% 35%'},
  california: {zoom: 2.2, txFactor: 0.28, tyFactor: 0.01, origin: '18% 48%'},
  kansas: {zoom: 2.2, txFactor: 0.02, tyFactor: -0.02, origin: '48% 48%'},
  oregon: {zoom: 2.2, txFactor: 0.28, tyFactor: -0.18, origin: '15% 25%'},
  nebraska: {zoom: 2.2, txFactor: 0.02, tyFactor: -0.06, origin: '46% 42%'},
  illinois: {zoom: 2.2, txFactor: -0.12, tyFactor: -0.05, origin: '60% 42%'},
};

export interface LocationItem {
  id: string;
  city: string;
  state: string;
  cost: string;
  kidsCount: string;
  kidsAge: string;
  coords: [number, number];
  sender: string;
  dmSnippet: string;
  cardOffsetX: number;
  cardOffsetY: number;
}

// Complete verified dataset matching transcript order (16 items)
export const LOCATIONS: Record<string, LocationItem> = {
  // 1. DM Read Aloud: Norfolk, VA
  norfolk: {
    id: 'norfolk',
    city: 'Norfolk',
    state: 'Virginia',
    cost: '$1,285',
    kidsCount: '1 Child',
    kidsAge: '4 yrs old',
    coords: [-76.2859, 36.8508],
    sender: '@Jennifer',
    dmSnippet: 'Not sure how people can have multiple children needing care.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 2. DM Read Aloud: Littleton, CO
  littleton: {
    id: 'littleton',
    city: 'Littleton',
    state: 'Colorado',
    cost: '$1,460',
    kidsCount: '1 Child',
    kidsAge: '3 yrs old',
    coords: [-105.0178, 39.6133],
    sender: '@Lara',
    dmSnippet: 'Montessori Mon-Thu. Grandparents watch her on Fridays.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 3. DM Read Aloud: Rockville, MD
  rockville: {
    id: 'rockville',
    city: 'Rockville',
    state: 'Maryland',
    cost: '$1,720',
    kidsCount: '1 Child',
    kidsAge: '2.5 yrs old',
    coords: [-77.1528, 39.084],
    sender: '@Jyosna',
    dmSnippet: 'Literally more than many people’s mortgages or incomes.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 4. DM Read Aloud: Iowa (Statewide)
  iowa: {
    id: 'iowa',
    city: 'Des Moines',
    state: 'Iowa',
    cost: '$2,600',
    kidsCount: '2 Kids',
    kidsAge: '3yo & 6 mos',
    coords: [-93.6091, 41.6005],
    sender: '@Jordan',
    dmSnippet: 'All extra money goes right into daycare. Depressing as heck.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 5. DM Read Aloud: Grand Rapids, MI
  grandrapids: {
    id: 'grandrapids',
    city: 'Grand Rapids',
    state: 'Michigan',
    cost: '$2,800',
    kidsCount: '2 Kids',
    kidsAge: '2yo & 4 mos',
    coords: [-85.6681, 42.9634],
    sender: '@Michaela',
    dmSnippet: 'We love the center but man it hurts my wallet to pay that.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 6. TikTok Clip: California Nurse
  california_nurse: {
    id: 'california_nurse',
    city: 'Central Valley',
    state: 'California',
    cost: '$2,700',
    kidsCount: '2 Kids',
    kidsAge: '3.5yo & 21 mos',
    coords: [-119.4179, 36.7783],
    sender: '@Nurse (TikTok)',
    dmSnippet: 'Subtracting daycare after taxes feels like working at McDonald’s.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 7. Personal Anecdote: Host's San Diego Nanny
  sandiego_host: {
    id: 'sandiego_host',
    city: 'San Diego',
    state: 'California',
    cost: '$3,040',
    kidsCount: '1 Child',
    kidsAge: 'Infant',
    coords: [-117.1611, 32.7157],
    sender: '@Host (San Diego)',
    dmSnippet: 'Paid $760/week for a nanny when my first daughter was born.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 8. Personal Anecdote: Host's LA Preschool
  losangeles_host: {
    id: 'losangeles_host',
    city: 'Los Angeles',
    state: 'California',
    cost: '$2,000',
    kidsCount: '1 Child',
    kidsAge: 'Preschool age',
    coords: [-118.2437, 34.0522],
    sender: '@Host (LA)',
    dmSnippet: 'Put daughter into preschool in LA at $2,000/month.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 9. DM Read Aloud: Los Angeles, CA (Margaret)
  losangeles_margaret: {
    id: 'losangeles_margaret',
    city: 'Los Angeles',
    state: 'California',
    cost: '$1,700',
    kidsCount: '1 Child',
    kidsAge: '3 yrs old',
    coords: [-118.2437, 34.0522],
    sender: '@Margaret',
    dmSnippet: 'This is only for part time (M-F) from 9 to 1.',
    cardOffsetX: 52,
    cardOffsetY: -120,
  },

  // 10. DM Read Aloud: San Diego, CA (Lauren)
  sandiego_lauren: {
    id: 'sandiego_lauren',
    city: 'San Diego',
    state: 'California',
    cost: '$2,560',
    kidsCount: '2 Kids',
    kidsAge: '3yo & 7 mos',
    coords: [-117.1611, 32.7157],
    sender: '@Lauren',
    dmSnippet: '$32/hr nanny. The expense is crushing us.',
    cardOffsetX: 52,
    cardOffsetY: 15,
  },

  // 11. DM Read Aloud: Bay Area, CA (Joanna)
  bayarea: {
    id: 'bayarea',
    city: 'Bay Area / SF',
    state: 'California',
    cost: '$2,600',
    kidsCount: '1 Child',
    kidsAge: '6 months',
    coords: [-122.4194, 37.7749],
    sender: '@Joanna',
    dmSnippet: '$2.6k/mo minimum at daycare or $30-$35/hr for a nanny.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 12. DM Read Aloud: Charlottesville, VA (Hannah)
  charlottesville: {
    id: 'charlottesville',
    city: 'Charlottesville',
    state: 'Virginia',
    cost: '$3,000',
    kidsCount: '2 Kids',
    kidsAge: '3yo & 4 mos',
    coords: [-78.4767, 38.0293],
    sender: '@Hannah',
    dmSnippet: 'Entire take-home pay goes to daycare. Need a new job.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 13. DM Read Aloud: Overland Park, KS (Becca)
  overlandpark: {
    id: 'overlandpark',
    city: 'Overland Park',
    state: 'Kansas',
    cost: '$3,700',
    kidsCount: '2 Kids',
    kidsAge: '14 mos & 5yo',
    coords: [-94.6708, 38.9822],
    sender: '@Becca',
    dmSnippet: '$785/wk for a toddler and pre-K. It’s outrageous.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 14. DM Read Aloud: Portland, OR (Adam)
  portland: {
    id: 'portland',
    city: 'Portland',
    state: 'Oregon',
    cost: '$4,000',
    kidsCount: '2 Kids',
    kidsAge: '1yo & 3yo',
    coords: [-122.6784, 45.5152],
    sender: '@Adam',
    dmSnippet: 'Left teaching job because take-home was barely over daycare.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 15. DM Read Aloud: Omaha, NE (Kaelin)
  omaha: {
    id: 'omaha',
    city: 'Omaha',
    state: 'Nebraska',
    cost: '$4,730',
    kidsCount: '3 Kids',
    kidsAge: '4, 3, 4 mos',
    coords: [-95.9345, 41.2565],
    sender: '@Kaelin',
    dmSnippet: 'Includes founding family and two sibling discounts.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },

  // 16. DM Read Aloud: Chicago, IL (KV)
  chicago: {
    id: 'chicago',
    city: 'Chicago',
    state: 'Illinois',
    cost: '$6,000',
    kidsCount: '2 Kids',
    kidsAge: '2yo & 4yo',
    coords: [-87.6298, 41.8781],
    sender: '@KV',
    dmSnippet: 'Over $6,000 monthly with 3 part-time nannies. Work 16h days.',
    cardOffsetX: 52,
    cardOffsetY: -125,
  },
};

export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}