/**
 * AyuSetu HER — Algorithm A3: Personalized Wellness Ranker
 * Clinician-reviewed wellness catalog with safety contraindication filtering
 * and evidence-graded prioritization for Indian lifestyle context.
 */

export interface WellnessCatalogItem {
  id: string;
  category:
    | "nutrition"
    | "yoga_movement"
    | "sleep_circadian"
    | "stress_somatic";
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
  dietPreference?:
    | "vegetarian"
    | "vegan"
    | "eggetarian"
    | "non_vegetarian"
    | "non-vegetarian";
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
  /** Known patient-reported or screening-derived issues, normalized where possible. */
  healthConditions?: string[];
  /** Optional focused feed for a dedicated feature screen. */
  categoryFocus?: WellnessCatalogItem["category"];
  isPregnantOrLactating?: boolean;
}

const WELLNESS_CATALOG: WellnessCatalogItem[] = [
  {
    id: "nutr-01-besan-chilla",
    category: "nutrition",
    title: "High-Protein Besan & Sprouted Moong Chilla",
    description:
      "Low-glycemic complex carbohydrate breakfast rich in plant protein and prebiotic fiber to steady insulin response.",
    evidenceGrade: "A",
    evidenceSource:
      "American Diabetes Association & ICMR Guidelines for Glycemic Index Management",
    contraindications: ["chickpea_allergy"],
    dietaryTags: ["vegetarian", "vegan"],
    utilityWeight: 88,
  },
  {
    id: "nutr-02-curd-seed-cycle",
    category: "nutrition",
    title: "Probiotic Curd with Flax & Pumpkin Seeds",
    description:
      "Provides gut microbiome probiotics and essential lignans / zinc for natural endocrine co-factor support.",
    evidenceGrade: "B",
    evidenceSource:
      "Nutrients Journal: Dietary Phytoestrogens and Metabolic Health",
    contraindications: ["dairy_allergy"],
    dietaryTags: ["vegetarian"],
    utilityWeight: 82,
  },
  {
    id: "nutr-03-iron-greens",
    category: "nutrition",
    title: "Iron-Rich Palak & Methi Dal with Lemon Juice",
    description:
      "Non-heme plant iron paired with vitamin C (ascorbic acid) to maximize non-heme bioavailability and combat menstrual fatigue.",
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
    description:
      "Gentle restorative pelvic opening with bolster support to ease pelvic congestion and downregulate sympathetic tension.",
    evidenceGrade: "B",
    evidenceSource:
      "Journal of Alternative and Complementary Medicine: Restorative Yoga for Pelvic Comfort",
    contraindications: ["recent_groin_injury"],
    dietaryTags: [],
    disclaimer:
      "Gentle restorative support for pelvic relaxation; not an evidence-proven medical cure for endometriosis or PCOS.",
    utilityWeight: 85,
  },
  {
    id: "yoga-02-cat-cow",
    category: "yoga_movement",
    title: "Marjaryasana-Bitilasana (Cat-Cow Dynamic Breath)",
    description:
      "Spinal mobilization synchronized with deep diaphragmatic breath to relieve lumbosacral tension during menses.",
    evidenceGrade: "B",
    evidenceSource: "International Journal of Yoga Therapy",
    contraindications: ["acute_spinal_herniation"],
    dietaryTags: [],
    disclaimer:
      "Movement support to relieve muscular stiffness; consult your physician if pain persists.",
    utilityWeight: 80,
  },
  {
    id: "yoga-03-seated-cat-cow",
    category: "yoga_movement",
    title: "Chair-Supported Cat-Cow",
    description:
      "A small, seated spinal movement paired with comfortable breathing. Keep the range easy and stop if it increases discomfort.",
    evidenceGrade: "C",
    evidenceSource:
      "Traditional gentle mobility practice; use only within comfortable range",
    contraindications: ["acute_spinal_injury", "movement_restricted"],
    dietaryTags: [],
    disclaimer:
      "A gentle movement option, not treatment. Choose a supported position and follow any clinician restrictions.",
    utilityWeight: 74,
  },
  {
    id: "yoga-04-supported-rest",
    category: "yoga_movement",
    title: "Supported Side-Lying Rest",
    description:
      "Rest on your side with pillows supporting the head and knees; use slow, unforced breathing for a few minutes.",
    evidenceGrade: "C",
    evidenceSource: "Traditional restorative practice; comfort-led positioning",
    contraindications: ["unable_to_transfer_safely"],
    dietaryTags: [],
    disclaimer:
      "Comfort practice only. Skip if lying on your side is uncomfortable or difficult to do safely.",
    utilityWeight: 76,
  },
  {
    id: "yoga-05-chair-mountain",
    category: "yoga_movement",
    title: "Seated Mountain with Shoulder Rolls",
    description:
      "Sit with back support, lengthen gently through the spine, and make a few slow shoulder rolls without forcing the range.",
    evidenceGrade: "C",
    evidenceSource:
      "Traditional gentle mobility practice; use only within comfortable range",
    contraindications: ["acute_shoulder_injury", "movement_restricted"],
    dietaryTags: [],
    disclaimer:
      "A low-effort mobility option, not treatment. Stop if symptoms worsen.",
    utilityWeight: 73,
  },
  {
    id: "yoga-06-restorative-breath",
    category: "yoga_movement",
    title: "Restorative Breathing Pause",
    description:
      "Choose a comfortable seated or reclined position and breathe naturally, with a slightly longer exhale only if it feels easy.",
    evidenceGrade: "C",
    evidenceSource:
      "Traditional restorative breathing practice; no forced breath holds",
    contraindications: ["acute_respiratory_distress"],
    dietaryTags: [],
    disclaimer:
      "Keep breathing natural. Do not hold your breath; stop and seek care for new or severe breathlessness.",
    utilityWeight: 78,
  },
  {
    id: "yoga-07-balasana",
    category: "yoga_movement",
    title: "Balasana (Child's Pose)",
    description:
      "Restorative resting posture with knees wide, forehead on mat or cushion, and long smooth breaths to release spinal and pelvic tension.",
    evidenceGrade: "A",
    evidenceSource:
      "Harvard Health Publishing: Yoga for Chronic Pelvic Pain & Stress",
    contraindications: ["severe_knee_injury", "third_trimester_pregnancy_flat"],
    dietaryTags: [],
    disclaimer:
      "Gentle restorative decompression. Use cushions beneath hips or forehead if knees or neck feel compressed.",
    utilityWeight: 84,
  },
  {
    id: "yoga-08-viparita-karani",
    category: "yoga_movement",
    title: "Viparita Karani (Legs-Up-The-Wall Pose)",
    description:
      "Passive inversion elevating the legs against a wall to facilitate venous and lymphatic return, soothe heavy legs, and balance autonomic tone.",
    evidenceGrade: "B",
    evidenceSource:
      "Journal of Clinical & Diagnostic Research: Inverted Yoga Postures & Venous Return",
    contraindications: [
      "glaucoma",
      "uncontrolled_hypertension",
      "menstruation_heavy_flow_day1",
    ],
    dietaryTags: [],
    disclaimer:
      "Restorative circulation booster. Lower legs immediately if experiencing tingling or discomfort.",
    utilityWeight: 86,
  },
  {
    id: "yoga-09-setu-bandhasana",
    category: "yoga_movement",
    title: "Setu Bandhasana (Supported Bridge Pose)",
    description:
      "Gentle sacral support using a block under the pelvis. Opens chest and hip flexors while resting parasympathetic nervous system.",
    evidenceGrade: "B",
    evidenceSource:
      "International Journal of Yoga: Hatha Yoga Effects on Lumbopelvic Pain",
    contraindications: ["acute_neck_injury", "severe_lumbar_disc_herniation"],
    dietaryTags: [],
    disclaimer:
      "Keep head and neck still while in bridge. Use low or medium block height for restorative benefit.",
    utilityWeight: 82,
  },
  {
    id: "yoga-10-bhujangasana",
    category: "yoga_movement",
    title: "Bhujangasana (Gentle Cobra Pose)",
    description:
      "Low prone extension strengthening the erector spinae and opening the anterior thoracic cage without compressing the lumbar spine.",
    evidenceGrade: "B",
    evidenceSource: "Complementary Therapies in Clinical Practice",
    contraindications: [
      "active_abdominal_surgery",
      "pregnancy_second_third_trimester",
    ],
    dietaryTags: [],
    disclaimer:
      "Keep elbows bent and shoulders relaxed away from ears. Avoid pressing high if lower back feels pinched.",
    utilityWeight: 79,
  },
  {
    id: "yoga-11-vrikshasana",
    category: "yoga_movement",
    title: "Vrikshasana (Tree Pose with Wall Support)",
    description:
      "Standing unilateral balance grounding through the sole of the standing foot to stimulate proprioception, ankle stability, and mental focus.",
    evidenceGrade: "B",
    evidenceSource:
      "Gait & Posture: Proprioceptive Training via Asana Practice",
    contraindications: ["severe_vertigo", "acute_ankle_sprain"],
    dietaryTags: [],
    disclaimer:
      "Place foot on calf or inner thigh, never directly on the knee joint. Use a wall for hand support when needed.",
    utilityWeight: 81,
  },
  {
    id: "yoga-12-ardha-matsyendrasana",
    category: "yoga_movement",
    title: "Ardha Matsyendrasana (Gentle Seated Spinal Twist)",
    description:
      "Gentle seated rotational mobility that compresses and releases abdominal viscera, stimulating digestive agni and thoracic spinal rotation.",
    evidenceGrade: "B",
    evidenceSource: "Journal of Bodywork and Movement Therapies",
    contraindications: ["acute_disc_herniation", "pregnancy_deep_twist"],
    dietaryTags: [],
    disclaimer:
      "Twist from the upper back and ribs, not by forcing the lumbar spine. Stop if any sharp nerve pain occurs.",
    utilityWeight: 80,
  },
  {
    id: "yoga-13-janu-sirsasana",
    category: "yoga_movement",
    title: "Janu Sirsasana (Head-to-Knee Forward Bend with Strap)",
    description:
      "One-legged seated forward fold with pelvis anchored. Gently stretches hamstrings and calms mental agitation without straining the lower back.",
    evidenceGrade: "C",
    evidenceSource:
      "Yoga & Science in Health: Hamstring Flexibility and Autonomic Response",
    contraindications: ["hamstring_tear", "sacroiliac_joint_instability"],
    dietaryTags: [],
    disclaimer:
      "Maintain length through the spine rather than rounding the upper back to touch the foot.",
    utilityWeight: 77,
  },
  {
    id: "yoga-14-paschimottanasana",
    category: "yoga_movement",
    title: "Paschimottanasana (Supported Seated Forward Bend)",
    description:
      "Restorative seated fold over bolsters or pillows. Cools excess Pitta and calms Vata nervous agitation.",
    evidenceGrade: "B",
    evidenceSource: "Ayurvedic Yoga Therapy: Pitta & Vata Pacifying Modalities",
    contraindications: ["acute_sciatica", "lumbar_herniation"],
    dietaryTags: [],
    disclaimer:
      "Support thighs and abdomen with folded blankets to avoid straining the hamstrings or lumbar ligaments.",
    utilityWeight: 79,
  },
  {
    id: "yoga-15-trikonasana",
    category: "yoga_movement",
    title: "Utthita Trikonasana (Triangle Pose with Block)",
    description:
      "Lateral trunk extension that lengthens the obliques, strengthens the hip abductors, and expands chest breathing volume.",
    evidenceGrade: "B",
    evidenceSource: "Journal of Physical Therapy Science",
    contraindications: ["migraine_acute", "cervical_spondylosis_unsupported"],
    dietaryTags: [],
    disclaimer:
      "Rest the lower hand on a yoga block or shin. Keep gaze straight ahead if turning neck upwards causes tension.",
    utilityWeight: 82,
  },
  {
    id: "yoga-16-virabhadrasana-ii",
    category: "yoga_movement",
    title: "Virabhadrasana II (Warrior II Pose)",
    description:
      "Wide-legged lateral stance building quadriceps and pelvic floor endurance while enhancing postural grounding and diaphragmatic control.",
    evidenceGrade: "A",
    evidenceSource: "Medicine & Science in Sports & Exercise",
    contraindications: [
      "acute_hip_bursitis",
      "uncontrolled_hypertension_extended_holds",
    ],
    dietaryTags: [],
    disclaimer:
      "Ensure front knee tracks over the second toe and does not buckle inward past the ankle.",
    utilityWeight: 83,
  },
  {
    id: "yoga-17-shavasana",
    category: "yoga_movement",
    title: "Shavasana (Supported Corpse Pose with Bolster)",
    description:
      "Deep conscious physiological decompression lying supine with bolsters under knees and eye pillow. Lowers cortisol and heart rate variability recovery.",
    evidenceGrade: "A",
    evidenceSource:
      "Annals of the New York Academy of Sciences: The Neurobiology of Yogic Relaxation",
    contraindications: ["third_trimester_supine_hypotensive_syndrome"],
    dietaryTags: [],
    disclaimer:
      "For third trimester pregnancy or severe acid reflux, modify into left side-lying restorative pose.",
    utilityWeight: 87,
  },
  {
    id: "yoga-18-ananda-balasana",
    category: "yoga_movement",
    title: "Ananda Balasana (Happy Baby Pose)",
    description:
      "Supine hip and groin mobilizer gently decompressing the sacrum and relaxing hypertonic pelvic floor musculature.",
    evidenceGrade: "B",
    evidenceSource:
      "International Urogynecology Journal: Pelvic Floor Muscle Relaxation in Yoga",
    contraindications: [
      "acute_groin_strain",
      "second_third_trimester_pregnancy",
    ],
    dietaryTags: [],
    disclaimer:
      "Hold shins or backs of thighs if reaching the feet causes neck strain or lifts the tailbone off the floor.",
    utilityWeight: 81,
  },
  {
    id: "yoga-19-nadi-shodhana",
    category: "yoga_movement",
    title: "Nadi Shodhana (Alternate Nostril Pranayama)",
    description:
      "Slow, unforced alternate nostril breathing without breath retention. Proven to rebalance parasympathetic tone and reduce sympathetic arousal.",
    evidenceGrade: "A",
    evidenceSource:
      "Frontiers in Neuroscience: Autonomic Regulation via Unilateral Nostril Breathing",
    contraindications: ["deviated_septum_complete_obstruction"],
    dietaryTags: [],
    disclaimer:
      "Perform smoothly without forceful breath holding. Keep facial muscles relaxed throughout.",
    utilityWeight: 88,
  },
  {
    id: "yoga-20-bhramari",
    category: "yoga_movement",
    title: "Bhramari Pranayama (Humming Bee Breath)",
    description:
      "Gentle low-frequency hum during exhalation with fingers lightly over ears. Enhances endogenous nasal nitric oxide release and induces vagal activation.",
    evidenceGrade: "A",
    evidenceSource:
      "American Journal of Respiratory and Critical Care Medicine: Nitric Oxide & Bhramari",
    contraindications: ["acute_severe_otitis_media"],
    dietaryTags: [],
    disclaimer:
      "Comfortable pitch only. Do not press inward into ear canal; light tragus contact is sufficient.",
    utilityWeight: 86,
  },
  {
    id: "yoga-21-sheetali",
    category: "yoga_movement",
    title: "Sheetali Pranayama (Cooling Breath)",
    description:
      "Inhaling through rolled tongue or teeth (Sitkari) and exhaling slowly through the nose to soothe hot flashes and heat irritability.",
    evidenceGrade: "B",
    evidenceSource:
      "International Journal of Yoga: Thermoregulatory and Cardiorespiratory Effects",
    contraindications: [
      "severe_respiratory_infection",
      "chronic_bronchitis_in_cold_weather",
    ],
    dietaryTags: [],
    disclaimer:
      "If unable to roll tongue, practice Sitkari (teeth lightly touching, tongue behind upper front teeth).",
    utilityWeight: 80,
  },
  {
    id: "yoga-22-chair-pigeon",
    category: "yoga_movement",
    title: "Seated Chair Pigeon (Figure Four Stretch)",
    description:
      "Chair-supported outer hip and piriformis stretch ideal for desk workers and those with limited floor mobility to alleviate sciatica.",
    evidenceGrade: "B",
    evidenceSource:
      "Spine Journal: Piriformis Stretching & Lumbosacral Mobility",
    contraindications: [
      "acute_hip_replacement_precautions",
      "severe_knee_torsion",
    ],
    dietaryTags: [],
    disclaimer:
      "Keep ankle flexed to protect knee ligament integrity. Sit tall and hinge forward only from hips.",
    utilityWeight: 82,
  },
  {
    id: "yoga-23-surya-namaskar",
    category: "yoga_movement",
    title: "Surya Namaskar (Slow Restorative Sun Salutations)",
    description:
      "Gentle 3-cycle breath-linked flow connecting Mountain, Gentle Crescent Lunges, and Cobra to lubricate major joints and stimulate circulation.",
    evidenceGrade: "A",
    evidenceSource:
      "Journal of Bodywork and Movement Therapies: Cardiovascular and Joint Benefits of Surya Namaskar",
    contraindications: [
      "uncontrolled_hypertension",
      "acute_lumbar_radiculopathy",
    ],
    dietaryTags: [],
    disclaimer:
      "Move at a calm, conversational pace. Step rather than jump, and drop knees to mat during transitions.",
    utilityWeight: 85,
  },
  {
    id: "sleep-01-morning-light",
    category: "sleep_circadian",
    title: "Morning 15-Minute Solar Retinal Exposure",
    description:
      "Direct morning sunlight anchors the master circadian clock (suprachiasmatic nucleus), optimizing evening melatonin secretion.",
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
    description:
      "Slow 1:1 or 1:2 paced breathwork stimulating vagal afferent tone and reducing salivary cortisol spikes.",
    evidenceGrade: "A",
    evidenceSource:
      "Frontiers in Human Neuroscience: Autonomic Vagal Modulation by Paced Breathing",
    contraindications: ["acute_respiratory_distress"],
    dietaryTags: [],
    utilityWeight: 89,
  },
];

export function herWellnessRanker(
  context: WellnessUserContext,
): WellnessCatalogItem[] {
  // If active urgent safety red flags exist, suppress wellness tips to prioritize emergency care
  if (context.activeRedFlags || context.acuteSafetyRedFlag) {
    return [];
  }

  const userAllergies = new Set(context.allergies ?? []);
  const userRestrictions = new Set(
    (context.mobilityRestrictions ?? []).map((restriction) =>
      restriction
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_"),
    ),
  );
  const normalizedConditions = new Set(
    (context.healthConditions ?? []).map((condition) =>
      condition
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_"),
    ),
  );
  if (context.hasPelvicPain || context.hasPelvicPainFeatures) {
    normalizedConditions.add("pelvic_pain");
  }
  if (context.hasPcosFeatures) normalizedConditions.add("pcos");
  if (context.hasHeavyBleedingFeatures)
    normalizedConditions.add("heavy_bleeding");
  if (context.hasFatigue) normalizedConditions.add("fatigue");

  // Filter against contraindications and dietary preferences
  const safeItems = WELLNESS_CATALOG.filter((item) => {
    if (context.categoryFocus && item.category !== context.categoryFocus)
      return false;
    // Movement options have not been reviewed as a prenatal or postpartum plan.
    // Keep them out of that context until clinician-reviewed variants exist.
    if (item.category === "yoga_movement" && context.isPregnantOrLactating)
      return false;

    // Check contraindications
    for (const c of item.contraindications) {
      if (userAllergies.has(c) || userRestrictions.has(c)) {
        return false;
      }
      if (normalizedConditions.has(c)) return false;
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
    if (
      context.hasPcosFeatures &&
      (item.id.includes("chilla") || item.id.includes("seed"))
    )
      score += 15;
    // Boost pelvic comfort
    if (
      context.hasPelvicPain &&
      (item.id.includes("supta") || item.id.includes("cat-cow"))
    )
      score += 20;
    if (
      (context.hasPelvicPain || context.hasPelvicPainFeatures) &&
      [
        "yoga-01-supta-baddha",
        "yoga-04-supported-rest",
        "yoga-06-restorative-breath",
      ].includes(item.id)
    )
      score += 14;
    if (
      (context.hasHeavyBleedingFeatures || context.hasFatigue) &&
      ["yoga-04-supported-rest", "yoga-06-restorative-breath"].includes(item.id)
    )
      score += 12;
    if (
      userRestrictions.size > 0 &&
      ["yoga-04-supported-rest", "yoga-06-restorative-breath"].includes(item.id)
    )
      score += 8;
    // Boost iron for fatigue
    if (context.hasFatigue && item.id.includes("iron")) score += 18;

    const reasons: string[] = [];
    if (context.hasPcosFeatures && item.id.includes("chilla"))
      reasons.push("PCOS-related screening features");
    if (
      (context.hasPelvicPain || context.hasPelvicPainFeatures) &&
      [
        "yoga-01-supta-baddha",
        "yoga-04-supported-rest",
        "yoga-06-restorative-breath",
      ].includes(item.id)
    )
      reasons.push("your recent pelvic discomfort");
    if (
      (context.hasHeavyBleedingFeatures || context.hasFatigue) &&
      item.id.includes("iron")
    )
      reasons.push("fatigue or heavy-bleeding screening flags");
    if (
      (context.hasHeavyBleedingFeatures || context.hasFatigue) &&
      [
        "yoga-04-supported-rest",
        "yoga-06-restorative-breath",
        "yoga-07-balasana",
        "yoga-08-viparita-karani",
        "yoga-17-shavasana",
      ].includes(item.id)
    )
      reasons.push(
        "a lower-effort option based on your recent health information",
      );
    return {
      ...item,
      ...(reasons.length > 0
        ? { rationale: `Prioritized for ${reasons.join(" and ")}.` }
        : {}),
      calculatedUtility: score,
    };
  });

  ranked.sort((a, b) => b.calculatedUtility - a.calculatedUtility);

  return ranked.slice(0, context.categoryFocus === "yoga_movement" ? 25 : 5);
}
