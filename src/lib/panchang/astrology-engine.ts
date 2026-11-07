/**
 * Vedic Astrology Engine: Complete 36 Guna Milan & Manglik Dosha Verification
 *
 * Implements:
 * 1. Ashta Koota 36-Point Compatibility System:
 *    - Varna (1 point)
 *    - Vashya (2 points)
 *    - Tara (3 points)
 *    - Yoni (4 points)
 *    - Graha Maitri (5 points)
 *    - Gana (6 points)
 *    - Bhakoot (7 points) with classical lord cancellations
 *    - Nadi (8 points) with classical exceptions
 * 2. Manglik (Kuja) Dosha Evaluation from Lagna, Moon, and Venus
 *    with traditional cancellations (own sign, exaltation, mutual dosha).
 */

export type MoonPositionInput = {
  nakshatraIndex: number; // 1 to 27 (1 = Ashwini, ..., 27 = Revati)
  pada: number; // 1 to 4
  rashiIndex: number; // 0 to 11 (0 = Aries/Mesha, ..., 11 = Pisces/Meena)
};

export type KootaScore = {
  name: string;
  nativeName: string;
  obtainedPoints: number;
  maxPoints: number;
  description: string;
  hasDosha: boolean;
  cancellationApplied?: string;
};

export type GunaMilanResult = {
  totalPoints: number;
  maxPoints: 36;
  percentage: number;
  verdict: "Exceptional" | "Good" | "Average" | "Not Recommended";
  verdictDescription: string;
  kootas: {
    varna: KootaScore;
    vashya: KootaScore;
    tara: KootaScore;
    yoni: KootaScore;
    grahaMaitri: KootaScore;
    gana: KootaScore;
    bhakoot: KootaScore;
    nadi: KootaScore;
  };
};

// 1. VARNA: Brahmin (4), Kshatriya (3), Vaishya (2), Shudra (1)
// Cancer(3), Scorpio(7), Pisces(11) = Brahmin
// Aries(0), Leo(4), Sagittarius(8) = Kshatriya
// Taurus(1), Virgo(5), Capricorn(9) = Vaishya
// Gemini(2), Libra(6), Aquarius(10) = Shudra
const RASHI_VARNA: Record<number, number> = {
  3: 4, 7: 4, 11: 4, // Brahmin
  0: 3, 4: 3, 8: 3,  // Kshatriya
  1: 2, 5: 2, 9: 2,  // Vaishya
  2: 1, 6: 1, 10: 1, // Shudra
};

// 2. VASHYA: Chatushpada(1), Manava(2), Jalachara(3), Vanachara(4), Keeta(5)
const RASHI_VASHYA: Record<number, number> = {
  0: 1, 1: 1, 8: 1, 9: 1, // Quadruped
  2: 2, 5: 2, 6: 2, 10: 2, // Human
  3: 3, 11: 3,             // Water
  4: 4,                     // Lion/Wild
  7: 5,                     // Insect
};

// 4. YONI: Animal associations for the 27 Nakshatras (1-indexed)
// 0: Horse, 1: Elephant, 2: Sheep, 3: Serpent, 4: Dog, 5: Cat, 6: Rat,
// 7: Cow, 8: Buffalo, 9: Tiger, 10: Hare, 11: Monkey, 12: Mongoose, 13: Lion
const NAKSHATRA_YONI: Record<number, number> = {
  1: 0, 24: 0, // Ashwini, Shatabhisha -> Horse
  2: 1, 27: 1, // Bharani, Revati -> Elephant
  3: 2, 8: 2,  // Krittika, Pushya -> Sheep
  4: 3, 5: 3,  // Rohini, Mrigashirsha -> Serpent
  6: 4, 19: 4, // Ardra, Mula -> Dog
  7: 5, 9: 5,  // Punarvasu, Ashlesha -> Cat
  10: 6, 11: 6,// Magha, Purva Phalguni -> Rat
  12: 7, 26: 7,// Uttara Phalguni, Uttara Bhadrapada -> Cow
  13: 8, 15: 8,// Hasta, Swati -> Buffalo
  14: 9, 16: 9,// Chitra, Vishakha -> Tiger
  17: 10, 18: 10, // Anuradha, Jyeshtha -> Deer/Hare
  20: 11, 22: 11, // Purva Ashadha, Shravana -> Monkey
  21: 12,      // Uttara Ashadha -> Mongoose
  23: 13, 25: 13, // Dhanishtha, Purva Bhadrapada -> Lion
};

// Classical Yoni Enmity pairs (Score = 0)
const YONI_ENEMIES: Array<[number, number]> = [
  [0, 8],  // Horse vs Buffalo
  [1, 13], // Elephant vs Lion
  [2, 11], // Sheep vs Monkey
  [3, 12], // Serpent vs Mongoose
  [4, 10], // Dog vs Deer/Hare
  [5, 6],  // Cat vs Rat
  [7, 9],  // Cow vs Tiger
];

// 5. GRAHA MAITRI: Ruling planetary lords of Rashis
// Sun(0), Moon(1), Mars(2), Mercury(3), Jupiter(4), Venus(5), Saturn(6)
const RASHI_LORD: Record<number, number> = {
  0: 2, // Aries -> Mars
  1: 5, // Taurus -> Venus
  2: 3, // Gemini -> Mercury
  3: 1, // Cancer -> Moon
  4: 0, // Leo -> Sun
  5: 3, // Virgo -> Mercury
  6: 5, // Libra -> Venus
  7: 2, // Scorpio -> Mars
  8: 4, // Sagittarius -> Jupiter
  9: 6, // Capricorn -> Saturn
  10: 6, // Aquarius -> Saturn
  11: 4, // Pisces -> Jupiter
};

// Natural Friendship: 1 = Friend, 0 = Neutral, -1 = Enemy
const PLANETARY_FRIENDSHIP: Record<number, Record<number, number>> = {
  0: { 0: 1, 1: 1, 2: 1, 3: 0, 4: 1, 5: -1, 6: -1 }, // Sun
  1: { 0: 1, 1: 1, 2: 0, 3: 1, 4: 0, 5: 0, 6: 0 },   // Moon
  2: { 0: 1, 1: 1, 2: 1, 3: -1, 4: 1, 5: 0, 6: 0 },  // Mars
  3: { 0: 1, 1: -1, 2: 0, 3: 1, 4: 0, 5: 1, 6: 0 },  // Mercury
  4: { 0: 1, 1: 1, 2: 1, 3: -1, 4: 1, 5: -1, 6: 0 }, // Jupiter
  5: { 0: -1, 1: -1, 2: 0, 3: 1, 4: 0, 5: 1, 6: 1 }, // Venus
  6: { 0: -1, 1: -1, 2: -1, 3: 1, 4: 0, 5: 1, 6: 1 }, // Saturn
};

// 6. GANA: 0 = Deva, 1 = Manushya, 2 = Rakshasa
const NAKSHATRA_GANA: Record<number, number> = {
  1: 0, 5: 0, 7: 0, 8: 0, 13: 0, 15: 0, 17: 0, 22: 0, 27: 0, // Deva
  2: 1, 4: 1, 6: 1, 11: 1, 12: 1, 20: 1, 21: 1, 25: 1, 26: 1, // Manushya
  3: 2, 9: 2, 10: 2, 14: 2, 16: 2, 18: 2, 19: 2, 23: 2, 24: 2, // Rakshasa
};

// 8. NADI: 0 = Adi (Vata), 1 = Madhya (Pitta), 2 = Antya (Kapha)
const NAKSHATRA_NADI: Record<number, number> = {
  1: 0, 6: 0, 7: 0, 12: 0, 13: 0, 18: 0, 19: 0, 24: 0, 25: 0, // Adi
  2: 1, 5: 1, 8: 1, 11: 1, 14: 1, 17: 1, 20: 1, 23: 1, 26: 1, // Madhya
  3: 2, 4: 2, 9: 2, 10: 2, 15: 2, 16: 2, 21: 2, 22: 2, 27: 2, // Antya
};

/**
 * Computes authentic 36-Point Ashta Koota Kundali Milan for marriage matching.
 *
 * @param bride Moon position of bride (Kanya)
 * @param groom Moon position of groom (Vara)
 */
export function calculateAshtaKootaMilan(
  bride: MoonPositionInput,
  groom: MoonPositionInput,
): GunaMilanResult {
  // 1. VARNA (1 Point)
  const bVarna = RASHI_VARNA[bride.rashiIndex] || 1;
  const gVarna = RASHI_VARNA[groom.rashiIndex] || 1;
  const varnaPoints = gVarna >= bVarna ? 1 : 0;
  const varnaScore: KootaScore = {
    name: "Varna Koota",
    nativeName: "वर्ण कूट (कार्य व सामाजिक स्वभाव)",
    obtainedPoints: varnaPoints,
    maxPoints: 1,
    description:
      varnaPoints === 1
        ? "Harmonious social and spiritual temperament."
        : "Varna disparity (Groom varna lower than bride).",
    hasDosha: varnaPoints === 0,
  };

  // 2. VASHYA (2 Points)
  const bVashya = RASHI_VASHYA[bride.rashiIndex] || 1;
  const gVashya = RASHI_VASHYA[groom.rashiIndex] || 1;
  let vashyaPoints = 0;
  if (bVashya === gVashya) vashyaPoints = 2;
  else if ((bVashya === 2 && gVashya === 1) || (bVashya === 1 && gVashya === 2)) vashyaPoints = 1;
  else if (bVashya === 4 || gVashya === 4) vashyaPoints = 0; // Lion incompatibility
  else vashyaPoints = 0.5;

  const vashyaScore: KootaScore = {
    name: "Vashya Koota",
    nativeName: "वश्य कूट (परस्पर आकर्षण व प्रभाव)",
    obtainedPoints: vashyaPoints,
    maxPoints: 2,
    description:
      vashyaPoints >= 1
        ? "Strong mutual attraction and power balance."
        : "Moderate or subdued magnetic affinity.",
    hasDosha: vashyaPoints === 0,
  };

  // 3. TARA (3 Points)
  let taraPoints = 0;
  let taraHasDosha = false;
  if (bride.nakshatraIndex === groom.nakshatraIndex) {
    // Classical Exception: "Eka Nakshatre Tara Dosho Na Vidyate" (Muhurta Chintamani)
    taraPoints = 3;
  } else {
    const t1 = ((groom.nakshatraIndex - bride.nakshatraIndex + 27) % 9) + 1;
    const t2 = ((bride.nakshatraIndex - groom.nakshatraIndex + 27) % 9) + 1;
    const isAuspicious = (t: number) => [2, 4, 6, 8, 9].includes(t);
    if (isAuspicious(t1) && isAuspicious(t2)) taraPoints = 3;
    else if (isAuspicious(t1) || isAuspicious(t2)) taraPoints = 1.5;
    else {
      taraPoints = 0;
      taraHasDosha = true;
    }
  }

  const taraScore: KootaScore = {
    name: "Tara Koota",
    nativeName: "तारा कूट (भाग्य, स्वास्थ्य व दीर्घायु)",
    obtainedPoints: taraPoints,
    maxPoints: 3,
    description:
      taraPoints === 3
        ? "Excellent mutual destiny and longevity alignment."
        : taraPoints === 1.5
        ? "Balanced destiny support with minor tara frictions."
        : "Tara Dosha present (Vipat, Pratyak, or Naidhana).",
    hasDosha: taraHasDosha,
  };

  // 4. YONI (4 Points)
  const bYoni = NAKSHATRA_YONI[bride.nakshatraIndex] ?? 0;
  const gYoni = NAKSHATRA_YONI[groom.nakshatraIndex] ?? 0;
  const isEnemyYoni = YONI_ENEMIES.some(
    ([y1, y2]) => (y1 === bYoni && y2 === gYoni) || (y1 === gYoni && y2 === bYoni),
  );
  let yoniPoints = 2; // neutral base
  if (bYoni === gYoni) yoniPoints = 4;
  else if (isEnemyYoni) yoniPoints = 0;
  else yoniPoints = 2; // neutral

  const yoniScore: KootaScore = {
    name: "Yoni Koota",
    nativeName: "योनि कूट (शारीरिक व जैविक अनुकूलता)",
    obtainedPoints: yoniPoints,
    maxPoints: 4,
    description:
      yoniPoints === 4
        ? "Perfect instinctual and biological compatibility."
        : isEnemyYoni
        ? "Yoni Vairya (Sworn natural animal enmity)."
        : "Neutral physical harmony.",
    hasDosha: isEnemyYoni,
  };

  // 5. GRAHA MAITRI (5 Points)
  const bLord = RASHI_LORD[bride.rashiIndex] ?? 0;
  const gLord = RASHI_LORD[groom.rashiIndex] ?? 0;
  let maitriPoints = 3;
  if (bLord === gLord) maitriPoints = 5;
  else {
    const f1 = PLANETARY_FRIENDSHIP[bLord]?.[gLord] ?? 0;
    const f2 = PLANETARY_FRIENDSHIP[gLord]?.[bLord] ?? 0;
    if (f1 === 1 && f2 === 1) maitriPoints = 5;
    else if ((f1 === 1 && f2 === 0) || (f1 === 0 && f2 === 1)) maitriPoints = 4;
    else if (f1 === 0 && f2 === 0) maitriPoints = 3;
    else if ((f1 === 1 && f2 === -1) || (f1 === -1 && f2 === 1)) maitriPoints = 1;
    else maitriPoints = 0; // mutual enemies
  }

  const maitriScore: KootaScore = {
    name: "Graha Maitri",
    nativeName: "ग्रहमैत्री कूट (मानसिक तालमेल व मित्रता)",
    obtainedPoints: maitriPoints,
    maxPoints: 5,
    description:
      maitriPoints >= 4
        ? "Warm mental companionship and deep mutual understanding."
        : maitriPoints >= 3
        ? "Average psychological friendship."
        : "Planetary enmity between Moon sign rulers.",
    hasDosha: maitriPoints === 0,
  };

  // 6. GANA (6 Points)
  const bGana = NAKSHATRA_GANA[bride.nakshatraIndex] ?? 1;
  const gGana = NAKSHATRA_GANA[groom.nakshatraIndex] ?? 1;
  let ganaPoints = 0;
  if (bGana === gGana) ganaPoints = 6;
  else if (bGana === 0 && gGana === 1) ganaPoints = 5;
  else if (bGana === 1 && gGana === 0) ganaPoints = 6;
  else if (bGana === 0 && gGana === 2) ganaPoints = 1;
  else if (bGana === 2 && gGana === 0) ganaPoints = 0;
  else ganaPoints = 0; // Manushya + Rakshasa

  const ganaScore: KootaScore = {
    name: "Gana Koota",
    nativeName: "गण कूट (स्वभाव, आचरण व जीवनशैली)",
    obtainedPoints: ganaPoints,
    maxPoints: 6,
    description:
      ganaPoints >= 5
        ? "Harmonious lifestyle and compatible behavioral temperament."
        : "Gana Dosha present (Deva/Manushya vs Rakshasa clash).",
    hasDosha: ganaPoints <= 1,
  };

  // 7. BHAKOOT (7 Points)
  const diff = ((groom.rashiIndex - bride.rashiIndex + 12) % 12) + 1;
  let bhakootPoints = 7;
  let bhakootDosha = false;
  let bhakootCancellation: string | undefined;

  // Inauspicious Bhakoot: 2/12 (Dwirdwadash), 6/8 (Shadashtaka), 5/9 (Navapancham)
  if ([2, 12, 6, 8, 5, 9].includes(diff)) {
    bhakootDosha = true;
    bhakootPoints = 0;

    // Classical Cancellation: Same ruling planetary lord
    if (bLord === gLord) {
      bhakootPoints = 7;
      bhakootDosha = false;
      bhakootCancellation = "Cancelled: Both Moon signs are ruled by the same planetary lord.";
    }
  }

  const bhakootScore: KootaScore = {
    name: "Bhakoot Koota",
    nativeName: "भकूट कूट (पारिवारિક સુખ, ભાવનાત્મક એકતા)",
    obtainedPoints: bhakootPoints,
    maxPoints: 7,
    description:
      bhakootPoints === 7
        ? "Emotional well-being, financial growth, and family prosperity."
        : `Bhakoot Dosha (${diff}/${14 - diff} disposition). May cause emotional distance.`,
    hasDosha: bhakootDosha,
    cancellationApplied: bhakootCancellation,
  };

  // 8. NADI (8 Points)
  const bNadi = NAKSHATRA_NADI[bride.nakshatraIndex] ?? 0;
  const gNadi = NAKSHATRA_NADI[groom.nakshatraIndex] ?? 0;
  let nadiPoints = 8;
  let nadiDosha = false;
  let nadiCancellation: string | undefined;

  if (bNadi === gNadi) {
    nadiDosha = true;
    nadiPoints = 0;

    // Classical Cancellation Rules (Muhurta Chintamani / Kala Madhava):
    // 1. Same Nakshatra but different Pada (Quarter)
    // 2. Same Nakshatra spanning two different Rashis across constellation border
    if (bride.nakshatraIndex === groom.nakshatraIndex) {
      if (bride.pada !== groom.pada) {
        nadiPoints = 8;
        nadiDosha = false;
        nadiCancellation = "Cancelled: Same birth star but different quarter (Pada).";
      } else if (bride.rashiIndex !== groom.rashiIndex) {
        nadiPoints = 8;
        nadiDosha = false;
        nadiCancellation = "Cancelled: Same birth star bridging across zodiac signs.";
      }
    }
  }

  const nadiScore: KootaScore = {
    name: "Nadi Koota",
    nativeName: "નાડી કૂટ (આનુવંશિકતા, સ્વાસ્થ્ય અને સંતતિ)",
    obtainedPoints: nadiPoints,
    maxPoints: 8,
    description:
      nadiPoints === 8
        ? "Genetic diversity, biological health, and progeny harmony."
        : "Nadi Dosha present (Same physiological constitution).",
    hasDosha: nadiDosha,
    cancellationApplied: nadiCancellation,
  };

  const totalPoints =
    varnaPoints +
    vashyaPoints +
    taraPoints +
    yoniPoints +
    maitriPoints +
    ganaPoints +
    bhakootPoints +
    nadiPoints;

  const percentage = Math.round((totalPoints / 36) * 100);

  let verdict: GunaMilanResult["verdict"] = "Not Recommended";
  let verdictDescription = "";
  if (totalPoints >= 28) {
    verdict = "Exceptional";
    verdictDescription = "Uttama (उत्कृष्ट मिलान) — Exceptional compatibility across all cosmic parameters.";
  } else if (totalPoints >= 21) {
    verdict = "Good";
    verdictDescription = "Madhyama (शुभ मिलान) — Very good partnership with strong mutual foundations.";
  } else if (totalPoints >= 18) {
    verdict = "Average";
    verdictDescription = "Sadharana (સામાન્ય / सामान्य) — Passable match; requires mutual understanding and remedy of any dosha.";
  } else {
    verdict = "Not Recommended";
    verdictDescription = "Adhama (અસ્વીકાર્ય / न्यून) — Low compatibility score (under 18 points); traditionally not recommended.";
  }

  return {
    totalPoints,
    maxPoints: 36,
    percentage,
    verdict,
    verdictDescription,
    kootas: {
      varna: varnaScore,
      vashya: vashyaScore,
      tara: taraScore,
      yoni: yoniScore,
      grahaMaitri: maitriScore,
      gana: ganaScore,
      bhakoot: bhakootScore,
      nadi: nadiScore,
    },
  };
}

export type ManglikEvaluation = {
  isManglik: boolean;
  intensity: "None" | "Low" | "Medium" | "High";
  housesCausingDosha: number[];
  cancellations: string[];
  summary: string;
};

/**
 * Evaluates Manglik (Kuja) Dosha based on traditional house positions:
 * Mars in 1st, 2nd (South), 4th, 7th, 8th, or 12th house.
 */
export function evaluateManglikDosha(
  marsHouseFromLagna: number, // 1 to 12
  marsHouseFromMoon: number,  // 1 to 12
  marsHouseFromVenus: number, // 1 to 12
  marsRashiIndex: number,     // 0 to 11 (Aries = 0, Scorpio = 7, Capricorn = 9)
  partnerIsManglik = false,
): ManglikEvaluation {
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const housesCausing: number[] = [];
  const cancellations: string[] = [];

  if (manglikHouses.includes(marsHouseFromLagna)) housesCausing.push(marsHouseFromLagna);
  if (manglikHouses.includes(marsHouseFromMoon)) housesCausing.push(marsHouseFromMoon);
  if (manglikHouses.includes(marsHouseFromVenus)) housesCausing.push(marsHouseFromVenus);

  const isInitiallyManglik = housesCausing.length > 0;

  // Traditional Cancellations:
  // 1. Mars in its own signs (Aries [0], Scorpio [7])
  if (marsRashiIndex === 0 || marsRashiIndex === 7) {
    cancellations.push("Mars in Swakshetra (Own sign Aries or Scorpio) neutralizes malefic impact.");
  }
  // 2. Mars in exaltation (Capricorn [9])
  if (marsRashiIndex === 9) {
    cancellations.push("Mars in Uchha (Exalted in Capricorn) removes Kuja Dosha.");
  }
  // 3. Mutual Manglik cancellation with partner
  if (partnerIsManglik) {
    cancellations.push("Partner also has Manglik Dosha, achieving mutual astrological equilibrium.");
  }

  const isCancelled = cancellations.length > 0;
  const isManglik = isInitiallyManglik && !isCancelled;

  let intensity: ManglikEvaluation["intensity"] = "None";
  if (isManglik) {
    if (housesCausing.length >= 3) intensity = "High";
    else if (housesCausing.length === 2) intensity = "Medium";
    else intensity = "Low";
  }

  const summary = !isInitiallyManglik
    ? "No Manglik Dosha detected. Mars occupies a benefic house."
    : isCancelled
    ? `Manglik Dosha cancelled: ${cancellations.join(" ")}`
    : `Manglik Dosha present (${intensity} intensity) due to Mars in house(s): ${[...new Set(housesCausing)].join(", ")}.`;

  return {
    isManglik,
    intensity,
    housesCausingDosha: [...new Set(housesCausing)],
    cancellations,
    summary,
  };
}
