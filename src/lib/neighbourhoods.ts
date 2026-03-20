export interface Neighbourhood {
  slug: string;
  name: string;
  city: string;
  region: string;
  tagline: string;
  description: string;
  heroImage: string;
  cardImage: string;
  avgPrice: string;
  priceRange: string;
  population: string;
  transitScore: number;
  walkScore: number;
  highlights: string[];
  lifestyle: string[];
  schools: { name: string; type: string; rating: string }[];
  transit: string[];
  pros: string[];
  stats: { label: string; value: string }[];
}

export const neighbourhoods: Neighbourhood[] = [
  {
    slug: "brampton",
    name: "Brampton",
    city: "Brampton",
    region: "Peel Region",
    tagline: "The Flower City — Family-Friendly & Culturally Vibrant",
    description:
      "Brampton is one of Canada's fastest-growing cities, known for its incredible cultural diversity, family-friendly communities, and expanding transit network. From sprawling parks and conservation areas to modern shopping centres and a thriving downtown, Brampton offers a high quality of life at relatively affordable prices compared to Toronto.",
    heroImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=800&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    avgPrice: "$950,000",
    priceRange: "$650K – $1.8M",
    population: "660,000+",
    transitScore: 68,
    walkScore: 52,
    highlights: [
      "One of Canada's fastest-growing cities",
      "Excellent GO Train and Züm BRT network",
      "Over 4,000 acres of parkland and trails",
      "Diverse cultural communities and festivals",
      "Strong resale value and investment potential",
    ],
    lifestyle: ["Families", "First-Time Buyers", "Investors", "Multicultural Communities"],
    schools: [
      { name: "Heart Lake Secondary School", type: "Public High School", rating: "8/10" },
      { name: "St. Edmund Campion Secondary", type: "Catholic High School", rating: "8.5/10" },
      { name: "Brampton Christian School", type: "Private", rating: "9/10" },
    ],
    transit: [
      "GO Train – Brampton Station (Kitchener Line)",
      "Züm Rapid Bus Transit on Main corridors",
      "Brampton Transit city-wide bus network",
      "Highway 410, 407, 401 access",
    ],
    pros: [
      "More affordable than Mississauga or Toronto",
      "Large, new-build detached homes available",
      "Strong South Asian and Caribbean communities",
      "Growing job market and commercial development",
    ],
    stats: [
      { label: "Avg. Home Price", value: "$950,000" },
      { label: "Population", value: "660,000+" },
      { label: "Avg. Days on Market", value: "18 days" },
      { label: "Price Growth (1yr)", value: "+4.2%" },
    ],
  },
  {
    slug: "mississauga",
    name: "Mississauga",
    city: "Mississauga",
    region: "Peel Region",
    tagline: "Ontario's Urban Gem on Lake Ontario",
    description:
      "Mississauga is Ontario's third-largest city, offering a dynamic urban lifestyle with a stunning Lake Ontario waterfront, a vibrant city centre, and excellent schools. Port Credit, Streetsville, and Lakeview are among the most sought-after neighbourhoods. With world-class amenities, diverse dining, and close proximity to Toronto and Pearson Airport, Mississauga is ideal for professionals and families alike.",
    heroImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&h=800&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop",
    avgPrice: "$1,100,000",
    priceRange: "$550K – $3M+",
    population: "720,000+",
    transitScore: 72,
    walkScore: 61,
    highlights: [
      "Stunning Lake Ontario waterfront in Port Credit",
      "Home to Square One — one of Canada's largest malls",
      "Minutes from Pearson International Airport",
      "Vibrant restaurant and arts scene",
      "Strong condo and luxury home market",
    ],
    lifestyle: ["Professionals", "Luxury Buyers", "Families", "Condo Seekers"],
    schools: [
      { name: "Cawthra Park Secondary School", type: "Public High School (Arts Focus)", rating: "9/10" },
      { name: "Streetsville Secondary School", type: "Public High School", rating: "8.5/10" },
      { name: "Mentor College", type: "Private", rating: "9.5/10" },
    ],
    transit: [
      "GO Train – Port Credit, Clarkson, Cooksville stations",
      "MiWay city-wide bus service",
      "LRT Hurontario line (under construction)",
      "Highway 403, 401, QEW access",
    ],
    pros: [
      "Established luxury and waterfront neighbourhoods",
      "Excellent employment base (head offices nearby)",
      "Vibrant Port Credit village lifestyle",
      "Strong long-term appreciation history",
    ],
    stats: [
      { label: "Avg. Home Price", value: "$1,100,000" },
      { label: "Population", value: "720,000+" },
      { label: "Avg. Days on Market", value: "15 days" },
      { label: "Price Growth (1yr)", value: "+5.1%" },
    ],
  },
  {
    slug: "milton",
    name: "Milton",
    city: "Milton",
    region: "Halton Region",
    tagline: "Canada's Fastest Growing Town — Nature Meets Neighbourhood",
    description:
      "Milton sits at the foot of the Niagara Escarpment, offering residents a unique blend of natural beauty and modern suburban living. With Rattlesnake Point, Crawford Lake, and hundreds of kilometres of trails in the backyard, Milton is a haven for outdoor lovers. The town has grown rapidly while maintaining its small-town charm and excellent schools.",
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=800&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    avgPrice: "$1,050,000",
    priceRange: "$700K – $2M",
    population: "140,000+",
    transitScore: 45,
    walkScore: 38,
    highlights: [
      "Niagara Escarpment UNESCO World Biosphere Reserve",
      "Top-ranked schools in Halton Region",
      "Rapid growth with new master-planned communities",
      "Safe, family-oriented neighbourhoods",
      "Excellent GO Train service to downtown Toronto",
    ],
    lifestyle: ["Families", "Nature Lovers", "Young Professionals", "Upsizing Buyers"],
    schools: [
      { name: "Milton District Secondary School", type: "Public High School", rating: "8/10" },
      { name: "Bishop Reding Catholic Secondary", type: "Catholic High School", rating: "9/10" },
      { name: "Craig Kielburger Secondary School", type: "Public High School", rating: "8.5/10" },
    ],
    transit: [
      "GO Train – Milton Station (Milton Line, express to Union)",
      "Milton Transit local bus service",
      "Highway 401 and 407 ETR access",
    ],
    pros: [
      "Newer homes with modern layouts and finishes",
      "Excellent school ratings across the board",
      "Lower crime rates than regional average",
      "Great value relative to Mississauga",
    ],
    stats: [
      { label: "Avg. Home Price", value: "$1,050,000" },
      { label: "Population", value: "140,000+" },
      { label: "Avg. Days on Market", value: "14 days" },
      { label: "Price Growth (1yr)", value: "+6.3%" },
    ],
  },
  {
    slug: "caledon",
    name: "Caledon",
    city: "Caledon",
    region: "Peel Region",
    tagline: "Rural Luxury — Estates, Equestrian & Escarpment Living",
    description:
      "Caledon is Peel Region's rural gem, covering a vast area of rolling hills, conservation lands, and charming villages like Belfountain, Terra Cotta, and Inglewood. It attracts buyers seeking larger lots, privacy, and a connection to nature — without sacrificing proximity to the GTA. Luxury estates, equestrian properties, and executive homes are hallmarks of the Caledon market.",
    heroImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=800&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
    avgPrice: "$1,350,000",
    priceRange: "$800K – $5M+",
    population: "75,000+",
    transitScore: 22,
    walkScore: 18,
    highlights: [
      "Sprawling estate and equestrian properties",
      "Protected Greenbelt and Niagara Escarpment lands",
      "Charming historic villages",
      "Exceptional privacy and lot sizes",
      "Growing infrastructure with new Highway 413 planned",
    ],
    lifestyle: ["Luxury Buyers", "Equestrian Enthusiasts", "Nature Lovers", "Retirees"],
    schools: [
      { name: "Mayfield Secondary School", type: "Public High School (Arts)", rating: "9/10" },
      { name: "Cardinal Ambrozic Catholic Secondary", type: "Catholic High School", rating: "8.5/10" },
    ],
    transit: [
      "Car-dependent — Highway 410 and 50 access",
      "Limited Brampton Transit connection at south border",
      "Close to Brampton GO for Toronto commuters",
    ],
    pros: [
      "Large lot sizes and privacy unmatched in GTA",
      "Horse properties and hobby farms available",
      "Strong luxury market with consistent appreciation",
      "Peaceful rural lifestyle 30 min from Brampton",
    ],
    stats: [
      { label: "Avg. Home Price", value: "$1,350,000" },
      { label: "Population", value: "75,000+" },
      { label: "Avg. Days on Market", value: "25 days" },
      { label: "Price Growth (1yr)", value: "+3.8%" },
    ],
  },
  {
    slug: "georgetown",
    name: "Georgetown",
    city: "Georgetown",
    region: "Halton Hills",
    tagline: "Historic Charm with Small-Town Warmth",
    description:
      "Georgetown is the urban centre of Halton Hills, blending a vibrant historic downtown with established residential neighbourhoods and newer subdivisions. The Credit River runs through the town, offering scenic trails and parks. Georgetown residents enjoy a tight-knit community feel, excellent schools, and easy GO Train access to Toronto — making it ideal for families and commuters.",
    heroImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&h=800&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop",
    avgPrice: "$1,025,000",
    priceRange: "$700K – $2M",
    population: "42,000+",
    transitScore: 38,
    walkScore: 44,
    highlights: [
      "Charming historic downtown with boutique shops",
      "Credit River trails and conservation areas",
      "Strong sense of community and local events",
      "Direct GO Train service to Union Station",
      "Mix of detached, semi-detached and townhomes",
    ],
    lifestyle: ["Families", "Commuters", "Retirees", "First-Time Buyers"],
    schools: [
      { name: "Georgetown District High School", type: "Public High School", rating: "8/10" },
      { name: "Christ the King Catholic Secondary", type: "Catholic High School", rating: "8/10" },
    ],
    transit: [
      "GO Train – Georgetown Station (Kitchener Line)",
      "Halton Hills Transit local bus",
      "Highway 7 and 401 access via Trafalgar Rd",
    ],
    pros: [
      "More affordable than Burlington or Oakville",
      "Quiet, safe neighbourhoods ideal for families",
      "Active downtown with restaurants and events",
      "Strong appreciation potential as GTA expands west",
    ],
    stats: [
      { label: "Avg. Home Price", value: "$1,025,000" },
      { label: "Population", value: "42,000+" },
      { label: "Avg. Days on Market", value: "17 days" },
      { label: "Price Growth (1yr)", value: "+4.9%" },
    ],
  },
  {
    slug: "bolton",
    name: "Bolton",
    city: "Bolton",
    region: "Caledon",
    tagline: "Small Town Feel with Big GTA Convenience",
    description:
      "Bolton is a welcoming community in the south of Caledon, offering a relaxed small-town atmosphere with excellent access to Highway 427 and the 400 series highways. It's known for its tight-knit community, local shops and restaurants along King Street, and a range of housing from affordable townhomes to executive detached homes — all with more space than you'd find in the city.",
    heroImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1920&h=800&fit=crop",
    cardImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
    avgPrice: "$1,000,000",
    priceRange: "$700K – $1.8M",
    population: "27,000+",
    transitScore: 28,
    walkScore: 35,
    highlights: [
      "Friendly, close-knit community atmosphere",
      "More space and larger lots than urban GTA",
      "Local shops, restaurants on King Street",
      "Easy access to Hwy 427, 400, and 50",
      "Growing new development with modern homes",
    ],
    lifestyle: ["Families", "Commuters", "Upsizing Buyers", "Retirees"],
    schools: [
      { name: "Bolton C. W. Jefferys C.I.", type: "Public High School", rating: "7.5/10" },
      { name: "St. Michael Catholic Secondary", type: "Catholic High School", rating: "8/10" },
    ],
    transit: [
      "Car-dependent — Hwy 427 and 50 commuter routes",
      "Zum Route 40 to Brampton Transit connections",
      "Close to Brampton GO stations for Toronto",
    ],
    pros: [
      "Great value for lot size compared to Brampton",
      "Peaceful residential streets with parks",
      "Strong community events and local culture",
      "Upside potential as Caledon grows",
    ],
    stats: [
      { label: "Avg. Home Price", value: "$1,000,000" },
      { label: "Population", value: "27,000+" },
      { label: "Avg. Days on Market", value: "21 days" },
      { label: "Price Growth (1yr)", value: "+3.5%" },
    ],
  },
];

export function getNeighbourhood(slug: string) {
  return neighbourhoods.find((n) => n.slug === slug) ?? null;
}
