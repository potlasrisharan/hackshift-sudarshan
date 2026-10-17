/**
 * AyuSetu HER — Algorithm A3: Personalized Wellness Ranker
 * Clinician-reviewed wellness catalog with safety contraindication filtering
 * and evidence-graded prioritization for Indian lifestyle context.
 */

export interface WellnessCatalogItem {
  id: string;
  category: "nutrition" | "yoga_movement" | "sleep_circadian" | "stress_somatic";
  title: string;
  description: string;
  evidenceGrade: "A" | "B" | "C"; // A: Strong clinical trial, B: Moderate evidence, C: Traditional practice
  evidenceSource: string;
  contraindications: string[];
  dietaryTags: string[];
  disclaimer?: string;
  utilityWeight: number;
}

export interface WellnessUserContext {
  dietPreference?: "vegetarian" | "vegan" | "eggetarian" | "non_vegetarian" | "non-vegetarian";
  allergies?: string[];
  mobilityRestrictions?: string[];
  activeRedFlags?: boolean;
  hasPelvicPain?: boolean;
  hasPcosFeatures?: boolean;
  hasFatigue?: boolean;
  currentCyclePhase?: string;
  hasPelvicPainFeatures?: boolean;
  hasHeavyBleedingFeatures?: boolean;
  acuteSafetyRedFlag?: boolean;
}

const WELLNESS_CATALOG: WellnessCatalogItem[] = [
  {
    id: "nutr-01-besan-chilla",
    category: "nutrition",
    title: "High-Protein Besan & Sprouted Moong Chilla",
    description: "Low-glycemic complex carbohydrate breakfast rich in plant protein and prebiotic fiber to steady insulin response.",
    evidenceGrade: "A",
    evidenceSource: "American Diabetes Association & ICMR Guidelines for Glycemic Index Management",
    contraindications: ["chickpea_allergy"],
    dietaryTags: ["vegetarian", "vegan"],
    utilityWeight: 88,
  },
  {
    id: "nutr-02-curd-seed-cycle",
    category: "nutrition",
    title: "Probiotic Curd with Flax & Pumpkin Seeds",
    description: "Provides gut microbiome probiotics and essential lignans / zinc for natural endocrine co-factor support.",
    evidenceGrade: "B",
    evidenceSource: "Nutrients Journal: Dietary Phytoestrogens and Metabolic Health",
    contraindications: ["dairy_allergy"],
    dietaryTags: ["vegetarian"],
    utilityWeight: 82,
  },
  {
    id: "nutr-03-iron-greens",
    category: "nutrition",
    title: "Iron-Rich Palak & Methi Dal with Lemon Juice",
    description: "Non-heme plant iron paired with vitamin C (ascorbic acid) to maximize non-heme bioavailability and combat menstrual fatigue.",
    evidenceGrade: "A",
    evidenceSource: "WHO Nutritional Anemia Clinical Guidelines",
    contraindications: [],
    dietaryTags: ["vegetarian", "vegan"],
    utilityWeight: 90,
  },
  {
    id: "yoga-01-supta-baddha",
    category: "yoga_movement",
    title: "Supta Baddha Konasana (Reclined Bound Angle Pose)",
    description: "Gentle restorative pelvic opening with bolster support to ease pelvic congestion and downregulate sympathetic tension.",
    evidenceGrade: "B",
    evidenceSource: "Journal of Alternative and Complementary Medicine: Restorative Yoga for Pelvic Comfort",
    contraindications: ["recent_groin_injury"],
    dietaryTags: [],
    disclaimer: "Gentle restorative support for pelvic relaxation; not an evidence-proven medical cure for endometriosis or PCOS.",
    utilityWeight: 85,
  },
  {
    id: "yoga-02-cat-cow",
    category: "yoga_movement",
    title: "Marjaryasana-Bitilasana (Cat-Cow Dynamic Breath)",
    description: "Spinal mobilization synchronized with deep diaphragmatic breath to relieve lumbosacral tension during menses.",
    evidenceGrade: "B",
    evidenceSource: "International Journal of Yoga Therapy",
    contraindications: ["acute_spinal_herniation"],
    dietaryTags: [],
    disclaimer: "Movement support to relieve muscular stiffness; consult your physician if pain persists.",
    utilityWeight: 80,
  },
  {
    id: "sleep-01-morning-light",
    category: "sleep_circadian",
    title: "Morning 15-Minute Solar Retinal Exposure",
    description: "Direct morning sunlight anchors the master circadian clock (suprachiasmatic nucleus), optimizing evening melatonin secretion.",
    evidenceGrade: "A",
    evidenceSource: "Cell / Nature Neuroscience Circadian Entrainment Reviews",
    contraindications: [],
    dietaryTags: [],
    utilityWeight: 92,
  },
  {
    id: "stress-01-nadi-shodhana",
    category: "stress_somatic",
    title: "Nadi Shodhana Pranayama (Alternate Nostril Breath)",
    description: "Slow 1:1 or 1:2 paced breathwork stimulating vagal afferent tone and reducing salivary cortisol spikes.",
    evidenceGrade: "A",
    evidenceSource: "Frontiers in Human Neuroscience: Autonomic Vagal Modulation by Paced Breathing",
    contraindications: ["acute_respiratory_distress"],
    dietaryTags: [],
    utilityWeight: 89,
  },
];

export function herWellnessRanker(context: WellnessUserContext): WellnessCatalogItem[] {
  // If active urgent safety red flags exist, suppress wellness tips to prioritize emergency care
  if (context.activeRedFlags) {
    return [];
  }

  const userAllergies = new Set(context.allergies ?? []);
  const userRestrictions = new Set(context.mobilityRestrictions ?? []);

  // Filter against contraindications and dietary preferences
  const safeItems = WELLNESS_CATALOG.filter((item) => {
    // Check contraindications
    for (const c of item.contraindications) {
      if (userAllergies.has(c) || userRestrictions.has(c)) {
        return false;
      }
    }

    // Check strict dietary preference
    if (context.dietPreference === "vegan" && item.category === "nutrition") {
      if (!item.dietaryTags.includes("vegan")) return false;
    }

    return true;
  });

  // Calculate tailored utility scores
  const ranked = safeItems.map((item) => {
    let score = item.utilityWeight;

    // Boost evidence grade A
    if (item.evidenceGrade === "A") score += 10;
    // Boost relevance for PCOS features
    if (context.hasPcosFeatures && (item.id.includes("chilla") || item.id.includes("seed"))) score += 15;
    // Boost pelvic comfort
    if (context.hasPelvicPain && (item.id.includes("supta") || item.id.includes("cat-cow"))) score += 20;
    // Boost iron for fatigue
    if (context.hasFatigue && item.id.includes("iron")) score += 18;

    return { ...item, calculatedUtility: score };
  });

  ranked.sort((a, b) => b.calculatedUtility - a.calculatedUtility);

  return ranked.slice(0, 5);
}
