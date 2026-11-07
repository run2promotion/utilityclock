"use client";

import {
  calculateAshtaKootaMilan,
  evaluateManglikDosha,
  type GunaMilanResult,
  type ManglikEvaluation,
} from "@/lib/panchang/astrology-engine";
import { NAKSHATRA_NAMES } from "@/lib/panchang/panchang-engine";
import {
  CheckCircle2,
  Info,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

const RASHI_LIST = [
  "Mesha (Aries / मेष)",
  "Vrishabha (Taurus / वृषभ)",
  "Mithuna (Gemini / मिथुन)",
  "Karka (Cancer / कर्क)",
  "Simha (Leo / सिंह)",
  "Kanya (Virgo / कन्या)",
  "Tula (Libra / तुला)",
  "Vrishchika (Scorpio / वृश्चिक)",
  "Dhanu (Sagittarius / धनु)",
  "Makara (Capricorn / मकर)",
  "Kumbha (Aquarius / कुंभ)",
  "Meena (Pisces / मीन)",
];

export function AstrologyExperience() {
  const [activeTab, setActiveTab] = useState<"guna-milan" | "manglik">("guna-milan");

  // Guna Milan State
  const [brideNak, setBrideNak] = useState<number>(1); // Ashwini
  const [bridePada, setBridePada] = useState<number>(1);
  const [brideRashi, setBrideRashi] = useState<number>(0); // Aries

  const [groomNak, setGroomNak] = useState<number>(4); // Rohini
  const [groomPada, setGroomPada] = useState<number>(2);
  const [groomRashi, setGroomRashi] = useState<number>(1); // Taurus

  // Manglik State
  const [marsLagnaHouse, setMarsLagnaHouse] = useState<number>(1);
  const [marsMoonHouse, setMarsMoonHouse] = useState<number>(4);
  const [marsVenusHouse, setMarsVenusHouse] = useState<number>(7);
  const [marsRashi, setMarsRashi] = useState<number>(0); // Aries
  const [partnerManglik, setPartnerManglik] = useState<boolean>(false);

  // Compute 36 Guna Milan
  const gunaResult: GunaMilanResult = useMemo(() => {
    return calculateAshtaKootaMilan(
      { nakshatraIndex: brideNak, pada: bridePada, rashiIndex: brideRashi },
      { nakshatraIndex: groomNak, pada: groomPada, rashiIndex: groomRashi },
    );
  }, [brideNak, bridePada, brideRashi, groomNak, groomPada, groomRashi]);

  // Compute Manglik
  const manglikResult: ManglikEvaluation = useMemo(() => {
    return evaluateManglikDosha(
      marsLagnaHouse,
      marsMoonHouse,
      marsVenusHouse,
      marsRashi,
      partnerManglik,
    );
  }, [marsLagnaHouse, marsMoonHouse, marsVenusHouse, marsRashi, partnerManglik]);

  return (
    <div className="w-full space-y-8">
      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("guna-milan")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "guna-milan"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>36 Guna Milan (Kundali Matching)</span>
        </button>

        <button
          onClick={() => setActiveTab("manglik")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "manglik"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Manglik Dosha Evaluator</span>
        </button>
      </div>

      {activeTab === "guna-milan" ? (
        <div className="space-y-6">
          {/* Input Selectors */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Bride Parameters */}
            <div className="rounded-2xl border border-pink-500/30 bg-pink-500/5 p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 block">
                Bride (Kanya / कन्या) Moon Position
              </span>

              <div>
                <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Birth Star (Nakshatra):
                </label>
                <select
                  value={brideNak}
                  onChange={(e) => setBrideNak(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {NAKSHATRA_NAMES.map((name, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}. {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                    Pada (Quarter):
                  </label>
                  <select
                    value={bridePada}
                    onChange={(e) => setBridePada(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {[1, 2, 3, 4].map((p) => (
                      <option key={p} value={p}>
                        Pada {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                    Moon Sign (Rashi):
                  </label>
                  <select
                    value={brideRashi}
                    onChange={(e) => setBrideRashi(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {RASHI_LIST.map((name, i) => (
                      <option key={i} value={i}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Groom Parameters */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                Groom (Vara / वर) Moon Position
              </span>

              <div>
                <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Birth Star (Nakshatra):
                </label>
                <select
                  value={groomNak}
                  onChange={(e) => setGroomNak(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {NAKSHATRA_NAMES.map((name, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}. {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                    Pada (Quarter):
                  </label>
                  <select
                    value={groomPada}
                    onChange={(e) => setGroomPada(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {[1, 2, 3, 4].map((p) => (
                      <option key={p} value={p}>
                        Pada {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                    Moon Sign (Rashi):
                  </label>
                  <select
                    value={groomRashi}
                    onChange={(e) => setGroomRashi(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {RASHI_LIST.map((name, i) => (
                      <option key={i} value={i}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Result Score Banner */}
          <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Ashta Koota Compatibility Score
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-50">
                  {gunaResult.totalPoints}
                </span>
                <span className="text-xl font-bold text-zinc-400">/ 36 Gunas</span>
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {gunaResult.percentage}% Match
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 max-w-xl">
                {gunaResult.verdictDescription}
              </p>
            </div>

            <div className="shrink-0 text-center rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Marital Threshold
              </span>
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 block mt-1">
                ≥ 18 Points Acceptable
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {gunaResult.totalPoints >= 18 ? "✓ Meets Criteria" : "✗ Below Threshold"}
              </span>
            </div>
          </div>

          {/* 8 Kootas Detailed Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted text-muted-foreground border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="p-3">Koota (कूट)</th>
                  <th className="p-3">Obtained / Max</th>
                  <th className="p-3">Constitutional Meaning</th>
                  <th className="p-3">Dosha / Exception Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {Object.values(gunaResult.kootas).map((k, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">
                      {k.name}
                      <span className="block text-[11px] font-normal text-zinc-400">{k.nativeName}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {k.obtainedPoints} / {k.maxPoints}
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-300 max-w-xs">{k.description}</td>
                    <td className="p-3">
                      {k.cancellationApplied ? (
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {k.cancellationApplied}
                        </span>
                      ) : k.hasDosha ? (
                        <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                          Dosha Present (0 pts)
                        </span>
                      ) : (
                        <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          Harmonious
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Manglik Dosha Evaluator Tab */
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              Mars (Mangala) House Positions in Birth Chart
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Mars from Lagna (Ascendant):
                </label>
                <select
                  value={marsLagnaHouse}
                  onChange={(e) => setMarsLagnaHouse(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                    <option key={h} value={h}>
                      House {h} { [1, 2, 4, 7, 8, 12].includes(h) ? "(Manglik House)" : "" }
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Mars from Chandra (Moon Lagna):
                </label>
                <select
                  value={marsMoonHouse}
                  onChange={(e) => setMarsMoonHouse(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                    <option key={h} value={h}>
                      House {h} { [1, 2, 4, 7, 8, 12].includes(h) ? "(Manglik House)" : "" }
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Mars from Shukra (Venus Lagna):
                </label>
                <select
                  value={marsVenusHouse}
                  onChange={(e) => setMarsVenusHouse(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                    <option key={h} value={h}>
                      House {h} { [1, 2, 4, 7, 8, 12].includes(h) ? "(Manglik House)" : "" }
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Mars Zodiac Sign (Rashi):
                </label>
                <select
                  value={marsRashi}
                  onChange={(e) => setMarsRashi(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {RASHI_LIST.map((name, i) => (
                    <option key={i} value={i}>
                      {name} { i === 0 || i === 7 ? "(Own Sign)" : i === 9 ? "(Exalted)" : "" }
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={partnerManglik}
                  onChange={(e) => setPartnerManglik(e.target.checked)}
                  className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Partner is also Manglik (Achieves mutual equilibrium cancellation)</span>
              </label>
            </div>
          </div>

          {/* Manglik Verdict Card */}
          <div
            className={`rounded-2xl border p-6 ${
              manglikResult.isManglik
                ? "border-red-500/30 bg-red-500/5 text-red-950 dark:text-red-200"
                : "border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              {manglikResult.isManglik ? (
                <>
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  <span>Manglik Dosha Detected ({manglikResult.intensity} Intensity)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>No Active Manglik Dosha</span>
                </>
              )}
            </div>

            <p className="mt-2 text-xs leading-relaxed opacity-90">
              {manglikResult.summary}
            </p>

            {manglikResult.cancellations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
                <strong>Classical Cancellations Applied:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  {manglikResult.cancellations.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Honest Scientific / Astrological Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40">
        <Info className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Astronomical Precision Note:</strong> UtilityClock computes Guna Milan and Manglik positions using
          the classical Ashta Koota algorithm and Lahiri Ayanamsa. In Vedic astrology, matrimonial alignment should be
          analyzed alongside Dasha Sandhi and planetary strengths (Shadbala). Advanced division charts (D9 Navamsha) are
          provided for educational exploration.
        </p>
      </div>
    </div>
  );
}
