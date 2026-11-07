"use client";

import {
  ArrowRightLeft,
  Calculator,
  Percent,
} from "lucide-react";
import { useMemo, useState } from "react";

export type CalculatorToolSlug =
  | "percentage-calculator"
  | "basic-calculator"
  | "unit-converter"
  | "temperature-converter"
  | "speed-converter"
  | "distance-converter";

type CalculatorToolsProps = {
  activeSlug?: CalculatorToolSlug | string;
  embedOnly?: boolean;
};

export function CalculatorTools({ activeSlug, embedOnly = false }: CalculatorToolsProps) {
  const initialTab: CalculatorToolSlug =
    activeSlug &&
    [
      "percentage-calculator",
      "basic-calculator",
      "unit-converter",
      "temperature-converter",
      "speed-converter",
      "distance-converter",
    ].includes(activeSlug)
      ? (activeSlug as CalculatorToolSlug)
      : "percentage-calculator";

  const [currentTool, setCurrentTool] = useState<CalculatorToolSlug>(initialTab);

  // 1. Percentage Calculator State
  // Type A: What is X% of Y?
  const [percentA, setPercentA] = useState(15);
  const [totalA, setTotalA] = useState(120);
  // Type B: X is what % of Y?
  const [partB, setPartB] = useState(25);
  const [totalB, setTotalB] = useState(200);
  // Type C: % change from X to Y?
  const [fromC, setFromC] = useState(80);
  const [toC, setToC] = useState(100);

  // 2. Basic Calculator State
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // 3. Unit Converter State
  const [unitCategory, setUnitCategory] = useState<"length" | "temperature" | "speed" | "weight">("length");
  const [unitInputValue, setUnitInputValue] = useState(100);
  const [unitFrom, setUnitFrom] = useState("meters");
  const [unitTo, setUnitTo] = useState("feet");

  // --- 1. Percentage Calculations ---
  const resultA = (percentA / 100) * totalA;
  const resultB = totalB !== 0 ? (partB / totalB) * 100 : 0;
  const resultC = fromC !== 0 ? ((toC - fromC) / Math.abs(fromC)) * 100 : 0;

  // --- 2. Basic Calculator Operations ---
  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setCalcDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === "0" ? digit : calcDisplay + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setCalcDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!calcDisplay.includes(".")) {
      setCalcDisplay(calcDisplay + ".");
    }
  };

  const clearAll = () => {
    setCalcDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOp: string) => {
    const inputValue = parseFloat(calcDisplay);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const current = prevValue || 0;
      let calculated = current;
      if (operator === "+") calculated = current + inputValue;
      else if (operator === "-") calculated = current - inputValue;
      else if (operator === "×") calculated = current * inputValue;
      else if (operator === "÷") calculated = inputValue !== 0 ? current / inputValue : 0;
      else if (operator === "%") calculated = current * (inputValue / 100);

      setCalcDisplay(String(Number(calculated.toFixed(8))));
      setPrevValue(calculated);
    }

    setWaitingForOperand(true);
    setOperator(nextOp);
  };

  // --- 3. Unit Converter Conversions ---
  const convertedResult = useMemo(() => {
    const val = unitInputValue;

    // Length (base = meters)
    if (unitCategory === "length") {
      const toMeters: Record<string, number> = {
        meters: 1,
        kilometers: 1000,
        centimeters: 0.01,
        millimeters: 0.001,
        miles: 1609.344,
        yards: 0.9144,
        feet: 0.3048,
        inches: 0.0254,
      };
      const inMeters = val * (toMeters[unitFrom] ?? 1);
      const out = inMeters / (toMeters[unitTo] ?? 1);
      return out;
    }

    // Speed (base = km/h)
    if (unitCategory === "speed") {
      const toKmh: Record<string, number> = {
        kmh: 1,
        mph: 1.60934,
        ms: 3.6,
        knots: 1.852,
      };
      const inKmh = val * (toKmh[unitFrom] ?? 1);
      return inKmh / (toKmh[unitTo] ?? 1);
    }

    // Weight (base = grams)
    if (unitCategory === "weight") {
      const toGrams: Record<string, number> = {
        grams: 1,
        kilograms: 1000,
        pounds: 453.59237,
        ounces: 28.3495,
      };
      const inGrams = val * (toGrams[unitFrom] ?? 1);
      return inGrams / (toGrams[unitTo] ?? 1);
    }

    // Temperature
    if (unitCategory === "temperature") {
      let celsius = val;
      if (unitFrom === "fahrenheit") celsius = ((val - 32) * 5) / 9;
      else if (unitFrom === "kelvin") celsius = val - 273.15;

      if (unitTo === "celsius") return celsius;
      if (unitTo === "fahrenheit") return (celsius * 9) / 5 + 32;
      if (unitTo === "kelvin") return celsius + 273.15;
    }

    return val;
  }, [unitInputValue, unitCategory, unitFrom, unitTo]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Tool Selector Tabs */}
      {!embedOnly && (
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-zinc-200 bg-white/80 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/60">
          {[
            { id: "percentage-calculator", label: "Percentage Calculator", icon: Percent },
            { id: "basic-calculator", label: "Basic Calculator", icon: Calculator },
            { id: "unit-converter", label: "Unit Converter", icon: ArrowRightLeft },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentTool(id as CalculatorToolSlug)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                currentTool === id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* 1. Percentage Calculator */}
      {currentTool === "percentage-calculator" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Percentage Calculator
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Calculate discounts, percentages, fractional ratios, and percentage increase or decrease.
            </p>
          </div>

          <div className="space-y-4">
            {/* Formula 1: What is X% of Y? */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                <span>What is</span>
                <input
                  type="number"
                  value={percentA}
                  onChange={(e) => setPercentA(Number(e.target.value))}
                  className="w-20 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-center font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <span>% of</span>
                <input
                  type="number"
                  value={totalA}
                  onChange={(e) => setTotalA(Number(e.target.value))}
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-center font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <span>?</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {Number(resultA.toFixed(4))}
                </span>
              </div>
            </div>

            {/* Formula 2: X is what % of Y? */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                <input
                  type="number"
                  value={partB}
                  onChange={(e) => setPartB(Number(e.target.value))}
                  className="w-20 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-center font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <span>is what % of</span>
                <input
                  type="number"
                  value={totalB}
                  onChange={(e) => setTotalB(Number(e.target.value))}
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-center font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <span>?</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {Number(resultB.toFixed(2))}%
                </span>
              </div>
            </div>

            {/* Formula 3: % Change from X to Y */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                <span>Percentage change from</span>
                <input
                  type="number"
                  value={fromC}
                  onChange={(e) => setFromC(Number(e.target.value))}
                  className="w-20 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-center font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <span>to</span>
                <input
                  type="number"
                  value={toC}
                  onChange={(e) => setToC(Number(e.target.value))}
                  className="w-20 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-center font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                <span>?</span>
              </div>
              <div className="text-right">
                <span
                  className={`font-mono text-2xl font-extrabold ${
                    resultC > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : resultC < 0
                        ? "text-red-500"
                        : "text-zinc-500"
                  }`}
                >
                  {resultC > 0 ? `+${resultC.toFixed(2)}%` : `${resultC.toFixed(2)}%`}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Basic Calculator */}
      {currentTool === "basic-calculator" && (
        <section className="mx-auto max-w-sm space-y-4 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Calculator</span>
            <span className="text-[11px] font-mono text-zinc-400">
              {operator ? `${prevValue} ${operator}` : ""}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-300 bg-zinc-50 p-4 text-right dark:border-zinc-700 dark:bg-zinc-950">
            <span className="font-mono text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              {calcDisplay}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="col-span-2 rounded-xl bg-zinc-200 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              AC
            </button>
            <button
              type="button"
              onClick={() => performOperation("%")}
              className="rounded-xl bg-zinc-200 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              %
            </button>
            <button
              type="button"
              onClick={() => performOperation("÷")}
              className="rounded-xl bg-emerald-600/20 py-3 text-base font-bold text-emerald-700 hover:bg-emerald-600/30 dark:text-emerald-400"
            >
              ÷
            </button>

            {["7", "8", "9"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => inputDigit(d)}
                className="rounded-xl border border-zinc-200 bg-white py-3 font-mono text-lg font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                {d}
              </button>
            ))}
            <button
              type="button"
              onClick={() => performOperation("×")}
              className="rounded-xl bg-emerald-600/20 py-3 text-base font-bold text-emerald-700 hover:bg-emerald-600/30 dark:text-emerald-400"
            >
              ×
            </button>

            {["4", "5", "6"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => inputDigit(d)}
                className="rounded-xl border border-zinc-200 bg-white py-3 font-mono text-lg font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                {d}
              </button>
            ))}
            <button
              type="button"
              onClick={() => performOperation("-")}
              className="rounded-xl bg-emerald-600/20 py-3 text-base font-bold text-emerald-700 hover:bg-emerald-600/30 dark:text-emerald-400"
            >
              −
            </button>

            {["1", "2", "3"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => inputDigit(d)}
                className="rounded-xl border border-zinc-200 bg-white py-3 font-mono text-lg font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                {d}
              </button>
            ))}
            <button
              type="button"
              onClick={() => performOperation("+")}
              className="rounded-xl bg-emerald-600/20 py-3 text-base font-bold text-emerald-700 hover:bg-emerald-600/30 dark:text-emerald-400"
            >
              +
            </button>

            <button
              type="button"
              onClick={() => inputDigit("0")}
              className="col-span-2 rounded-xl border border-zinc-200 bg-white py-3 font-mono text-lg font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              0
            </button>
            <button
              type="button"
              onClick={inputDecimal}
              className="rounded-xl border border-zinc-200 bg-white py-3 font-mono text-lg font-bold text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              .
            </button>
            <button
              type="button"
              onClick={() => performOperation("=")}
              className="rounded-xl bg-emerald-600 py-3 text-lg font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500"
            >
              =
            </button>
          </div>
        </section>
      )}

      {/* 3. Unit Converter */}
      {(currentTool === "unit-converter" ||
        currentTool === "temperature-converter" ||
        currentTool === "speed-converter" ||
        currentTool === "distance-converter") && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Unit Converter
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Convert length, speed, temperature, and weight across metric and imperial systems.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "length", label: "Length & Distance" },
                { id: "temperature", label: "Temperature" },
                { id: "speed", label: "Speed" },
                { id: "weight", label: "Weight & Mass" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setUnitCategory(id);
                  if (id === "length") {
                    setUnitFrom("meters");
                    setUnitTo("feet");
                  } else if (id === "temperature") {
                    setUnitFrom("celsius");
                    setUnitTo("fahrenheit");
                  } else if (id === "speed") {
                    setUnitFrom("kmh");
                    setUnitTo("mph");
                  } else if (id === "weight") {
                    setUnitFrom("kilograms");
                    setUnitTo("pounds");
                  }
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  unitCategory === id
                    ? "bg-emerald-600 text-white"
                    : "border border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Value
              <input
                type="number"
                value={unitInputValue}
                onChange={(e) => setUnitInputValue(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              From
              <select
                value={unitFrom}
                onChange={(e) => setUnitFrom(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {unitCategory === "length" && (
                  <>
                    <option value="meters">Meters (m)</option>
                    <option value="kilometers">Kilometers (km)</option>
                    <option value="centimeters">Centimeters (cm)</option>
                    <option value="miles">Miles (mi)</option>
                    <option value="yards">Yards (yd)</option>
                    <option value="feet">Feet (ft)</option>
                    <option value="inches">Inches (in)</option>
                  </>
                )}
                {unitCategory === "temperature" && (
                  <>
                    <option value="celsius">Celsius (°C)</option>
                    <option value="fahrenheit">Fahrenheit (°F)</option>
                    <option value="kelvin">Kelvin (K)</option>
                  </>
                )}
                {unitCategory === "speed" && (
                  <>
                    <option value="kmh">Kilometers per hour (km/h)</option>
                    <option value="mph">Miles per hour (mph)</option>
                    <option value="ms">Meters per second (m/s)</option>
                    <option value="knots">Knots (kn)</option>
                  </>
                )}
                {unitCategory === "weight" && (
                  <>
                    <option value="kilograms">Kilograms (kg)</option>
                    <option value="grams">Grams (g)</option>
                    <option value="pounds">Pounds (lbs)</option>
                    <option value="ounces">Ounces (oz)</option>
                  </>
                )}
              </select>
            </label>

            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              To
              <select
                value={unitTo}
                onChange={(e) => setUnitTo(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {unitCategory === "length" && (
                  <>
                    <option value="feet">Feet (ft)</option>
                    <option value="meters">Meters (m)</option>
                    <option value="kilometers">Kilometers (km)</option>
                    <option value="miles">Miles (mi)</option>
                    <option value="yards">Yards (yd)</option>
                    <option value="inches">Inches (in)</option>
                  </>
                )}
                {unitCategory === "temperature" && (
                  <>
                    <option value="fahrenheit">Fahrenheit (°F)</option>
                    <option value="celsius">Celsius (°C)</option>
                    <option value="kelvin">Kelvin (K)</option>
                  </>
                )}
                {unitCategory === "speed" && (
                  <>
                    <option value="mph">Miles per hour (mph)</option>
                    <option value="kmh">Kilometers per hour (km/h)</option>
                    <option value="ms">Meters per second (m/s)</option>
                    <option value="knots">Knots (kn)</option>
                  </>
                )}
                {unitCategory === "weight" && (
                  <>
                    <option value="pounds">Pounds (lbs)</option>
                    <option value="kilograms">Kilograms (kg)</option>
                    <option value="grams">Grams (g)</option>
                    <option value="ounces">Ounces (oz)</option>
                  </>
                )}
              </select>
            </label>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Conversion Result
            </span>
            <p className="mt-2 font-mono text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 sm:text-5xl">
              {Number(convertedResult.toFixed(4))}
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {unitInputValue} {unitFrom} = <strong>{Number(convertedResult.toFixed(4))} {unitTo}</strong>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
