export const milestones = [
  {
    threshold: 4000,
    followers: "4,000",
    budget: 40,
    spot: "Musubi Square",
    item: "Sushi Taco Spread",
    address: "2626 W La Palma Ave, Anaheim, CA 92801",
    vibe: "Wagyu Feta Taco $9 · Soft Shell Crab $7 · Spam Trio $7 · Bulgogi Bowl $14",
    emoji: "🍣",
    total: "$37",
  },
  {
    threshold: 5000,
    followers: "5,000",
    budget: 50,
    spot: "Tacos Los Cholos",
    item: "Prime Tacos + Cholo Pizza",
    address: "821 S State College Blvd, Anaheim, CA 92806",
    vibe: "LA Taco Madness Champs — Filet Mignon tacos $7.50ea + Cholo Pizza $28",
    emoji: "🌮",
    total: "$50",
  },
  {
    threshold: 6000,
    followers: "6,000",
    budget: 60,
    spot: "Anaheim Packing House",
    item: "Food Hall Crawl — 4 Vendors",
    address: "440 S Anaheim Blvd, Anaheim, CA 92805",
    vibe: "Anti-Gravity Noodles · Soul Food · 18 Folds Dim Sum · Popgelato",
    emoji: "🍜",
    total: "$58",
  },
  {
    threshold: 7000,
    followers: "7,000",
    budget: 70,
    spot: "Sona Fusion Kitchen",
    item: "Vietnamese-Peruvian Fusion Feast",
    address: "2054 S Euclid St, Anaheim, CA 92802",
    vibe: "Truffle Fries · Lomo Saltado · Shrimp Wontons · Pho · Garlic Noodles",
    emoji: "🔥",
    total: "$67",
  },
  {
    threshold: 8000,
    followers: "8,000",
    budget: 80,
    spot: "Khan Saab",
    item: "Michelin Bib Gourmand Dinner",
    address: "1 S Lemon St, Fullerton, CA 92832",
    vibe: "Pani Puri · Smoked Beef Kebab · Lamb Chops · Naan · Biryani",
    emoji: "👑",
    total: "$80",
  },
  {
    threshold: 9000,
    followers: "9,000",
    budget: 90,
    spot: "Heritage 71 BBQ",
    item: "Texas BBQ Meat Feast",
    address: "3451 E Miraloma Ave, Anaheim, CA 92806",
    vibe: "½lb Brisket · 3 Ribs · Pulled Pork · Mac & Cheese · Truffle Fries",
    emoji: "🥩",
    total: "$88",
  },
  {
    threshold: 10000,
    followers: "10,000",
    budget: 100,
    spot: "The Wooden Pearl",
    item: "Surf & Turf Celebration",
    address: "440 S Anaheim Blvd, Anaheim, CA 92805",
    vibe: "Premium steak, fresh seafood & craft cocktails",
    emoji: "🥂",
    total: "$100",
  },
];

export const TOTAL_BUDGET = milestones.reduce((sum, m) => sum + m.budget, 0);

export function getMilestoneStatus(milestone, liveFollowers) {
  if (!liveFollowers || liveFollowers === 0) return "locked";

  if (liveFollowers >= milestone.threshold) {
    return "filmed";
  }

  const firstUnreached = milestones.find(m => liveFollowers < m.threshold);

  if (firstUnreached && firstUnreached.threshold === milestone.threshold) {
    return "next";
  }

  return "locked";
}

export function getFilmedCount(liveFollowers) {
  if (!liveFollowers) return 0;
  return milestones.filter(m => liveFollowers >= m.threshold).length;
}

export function getSpentSoFar(liveFollowers) {
  if (!liveFollowers) return 0;
  return milestones
    .filter(m => liveFollowers >= m.threshold)
    .reduce((sum, m) => sum + m.budget, 0);
}

export function getNextMilestone(liveFollowers) {
  if (!liveFollowers) return milestones[0];
  return milestones.find(m => liveFollowers < m.threshold) || null;
}

export function getProgressToNext(liveFollowers) {
  if (!liveFollowers) return 0;
  const next = getNextMilestone(liveFollowers);
  if (!next) return 100; // all complete
  const prevThreshold = milestones
    .filter(m => m.threshold < next.threshold)
    .pop()?.threshold || 0;
  return Math.min(100, ((liveFollowers - prevThreshold) / (next.threshold - prevThreshold)) * 100);
}
