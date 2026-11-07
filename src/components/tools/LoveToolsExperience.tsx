"use client";

import { Flame, Heart, RotateCcw, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";

export function LoveToolsExperience() {
  const [activeTab, setActiveTab] = useState<"love" | "flames" | "friendship">("love");

  // 1. Love Calculator State
  const [name1, setName1] = useState("Alex");
  const [name2, setName2] = useState("Jordan");

  // 2. FLAMES State
  const [fName1, setFName1] = useState("Romeo");
  const [fName2, setFName2] = useState("Juliet");

  // 3. Friendship Calculator State
  const [frName1, setFrName1] = useState("Sam");
  const [frName2, setFrName2] = useState("Taylor");

  // Deterministic name hash score algorithm
  const loveScore = useMemo(() => {
    const s1 = name1.trim().toLowerCase();
    const s2 = name2.trim().toLowerCase();
    if (!s1 || !s2) return 0;

    let hash = 0;
    const combined = `${s1}+${s2}`;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    // Normalize to 65% - 99% range for positive fun UX
    return 65 + (Math.abs(hash) % 35);
  }, [name1, name2]);

  // FLAMES Calculation
  const flamesResult = useMemo(() => {
    const s1 = fName1.trim().toLowerCase().replace(/[^a-z]/g, "");
    const s2 = fName2.trim().toLowerCase().replace(/[^a-z]/g, "");
    if (!s1 || !s2) return null;

    // Eliminate common characters
    const a1 = s1.split("");
    const a2 = s2.split("");

    for (let i = 0; i < a1.length; i++) {
      const idx = a2.indexOf(a1[i]);
      if (idx !== -1) {
        a1.splice(i, 1);
        a2.splice(idx, 1);
        i--;
      }
    }

    const count = a1.length + a2.length;
    if (count === 0) {
      return { letter: "F", name: "Friends", desc: "Soul companions with unbreakable affinity!" };
    }

    const flames = [
      { letter: "F", name: "Friends", desc: "True companions with an enduring lifelong bond." },
      { letter: "L", name: "Lovers", desc: "Passionate romance, deep affection, and magnetic chemistry!" },
      { letter: "A", name: "Affection", desc: "Tender mutual care, respect, and emotional warmth." },
      { letter: "M", name: "Marriage", desc: "Harmonious partnership, destined for lifelong vows." },
      { letter: "E", name: "Enemies", desc: "Fiery banter and rival sparks that keep life interesting!" },
      { letter: "S", name: "Siblings", desc: "Unconditional protective camaraderie and shared mischief." },
    ];

    const current = [...flames];
    let index = 0;
    while (current.length > 1) {
      index = (index + count - 1) % current.length;
      current.splice(index, 1);
    }

    return current[0];
  }, [fName1, fName2]);

  // Friendship Score
  const friendScore = useMemo(() => {
    const s1 = frName1.trim().toLowerCase();
    const s2 = frName2.trim().toLowerCase();
    if (!s1 || !s2) return 0;

    let hash = 0;
    const combined = `${s1}&friend&${s2}`;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    return 70 + (Math.abs(hash) % 30);
  }, [frName1, frName2]);

  return (
    <div className="w-full space-y-6">
      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("love")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "love"
              ? "bg-pink-600 text-white shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Heart className="h-4 w-4" />
          <span>Love Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab("flames")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "flames"
              ? "bg-pink-600 text-white shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>FLAMES Game</span>
        </button>

        <button
          onClick={() => setActiveTab("friendship")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "friendship"
              ? "bg-pink-600 text-white shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Friendship Test</span>
        </button>
      </div>

      {/* Tool 1: Love Calculator */}
      {activeTab === "love" && (
        <div className="rounded-2xl border border-zinc-200/90 bg-card p-6 shadow-sm dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                True Love Compatibility Calculator
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter two names to calculate romantic resonance and love potential.
              </p>
            </div>
            <button
              onClick={() => {
                setName1("");
                setName2("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Your Name</label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full bg-background border rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Partner&apos;s Name</label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="e.g. Jordan"
                className="w-full bg-background border rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border border-pink-500/20 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
              Love Match Score
            </span>
            <div className="text-5xl font-black text-pink-600 dark:text-pink-400">
              {loveScore}%
            </div>
            <p className="text-sm font-medium text-foreground max-w-md mx-auto">
              {loveScore > 85
                ? "✨ Outstanding Compatibility! Your energies align with extraordinary emotional depth and lasting mutual appreciation."
                : "💖 Sweet & Promising Chemistry! With honest communication and shared adventures, your connection will flourish beautifully."}
            </p>
          </div>
        </div>
      )}

      {/* Tool 2: FLAMES Game */}
      {activeTab === "flames" && (
        <div className="rounded-2xl border border-zinc-200/90 bg-card p-6 shadow-sm dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Flame className="h-5 w-5 text-pink-500" />
                FLAMES Relationship Test
              </h3>
              <p className="text-xs text-muted-foreground">
                Classic name elimination game: Friends, Lovers, Affection, Marriage, Enemies, Siblings.
              </p>
            </div>
            <button
              onClick={() => {
                setFName1("");
                setFName2("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">First Name</label>
              <input
                type="text"
                value={fName1}
                onChange={(e) => setFName1(e.target.value)}
                placeholder="First person"
                className="w-full bg-background border rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Second Name</label>
              <input
                type="text"
                value={fName2}
                onChange={(e) => setFName2(e.target.value)}
                placeholder="Second person"
                className="w-full bg-background border rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {flamesResult && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border border-pink-500/20 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                FLAMES Outcome
              </span>
              <div className="text-3xl font-black text-pink-600 dark:text-pink-400">
                {flamesResult.name} ({flamesResult.letter})
              </div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {flamesResult.desc}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tool 3: Friendship Calculator */}
      {activeTab === "friendship" && (
        <div className="rounded-2xl border border-zinc-200/90 bg-card p-6 shadow-sm dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-pink-500" />
                Best Friends Loyalty Calculator
              </h3>
              <p className="text-xs text-muted-foreground">
                Determine companionship synergy and mutual trust rating between close friends.
              </p>
            </div>
            <button
              onClick={() => {
                setFrName1("");
                setFrName2("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Friend 1</label>
              <input
                type="text"
                value={frName1}
                onChange={(e) => setFrName1(e.target.value)}
                placeholder="Name"
                className="w-full bg-background border rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Friend 2</label>
              <input
                type="text"
                value={frName2}
                onChange={(e) => setFrName2(e.target.value)}
                placeholder="Name"
                className="w-full bg-background border rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent border border-pink-500/20 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
              Friendship Affinity Score
            </span>
            <div className="text-5xl font-black text-pink-600 dark:text-pink-400">
              {friendScore}%
            </div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              A steadfast bond built on shared laughter, reliable support, and genuine companionship!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
