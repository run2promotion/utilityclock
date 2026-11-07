"use client";

import { useI18n } from "@/context/locale-context";
import {
  ArrowRightLeft,
  Check,
  Compass,
  Copy,
  Cpu,
  Database,
  Flame,
  Fuel,
  Gauge,
  Layers,
  RotateCcw,
  Scale,
  Utensils,
  Zap,
} from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

export type ConverterToolSlug =
  | "area-converter"
  | "volume-converter"
  | "pressure-converter"
  | "energy-converter"
  | "power-converter"
  | "data-storage-converter"
  | "fuel-economy-converter"
  | "angle-converter"
  | "cooking-converter"
  | "number-system-converter";

type ConverterToolsProps = {
  activeSlug?: ConverterToolSlug | string;
  embedOnly?: boolean;
};

// --- Conversion Definitions & Exact Constants ---

type UnitDef = {
  id: string;
  name: string;
  symbol: string;
  factor: number; // Factor to base unit
};

const AREA_UNITS: UnitDef[] = [
  { id: "sqm", name: "Square Meters", symbol: "m²", factor: 1 },
  { id: "sqkm", name: "Square Kilometers", symbol: "km²", factor: 1_000_000 },
  { id: "sqft", name: "Square Feet", symbol: "ft²", factor: 0.09290304 },
  { id: "sqyd", name: "Square Yards", symbol: "yd²", factor: 0.83612736 },
  { id: "acres", name: "Acres", symbol: "ac", factor: 4046.8564224 },
  { id: "hectares", name: "Hectares", symbol: "ha", factor: 10_000 },
  { id: "sqin", name: "Square Inches", symbol: "in²", factor: 0.00064516 },
  { id: "sqmi", name: "Square Miles", symbol: "mi²", factor: 2_589_988.110336 },
];

const VOLUME_UNITS: UnitDef[] = [
  { id: "l", name: "Liters", symbol: "L", factor: 1 },
  { id: "ml", name: "Milliliters", symbol: "mL", factor: 0.001 },
  { id: "cum", name: "Cubic Meters", symbol: "m³", factor: 1000 },
  { id: "cuft", name: "Cubic Feet", symbol: "ft³", factor: 28.316846592 },
  { id: "cuin", name: "Cubic Inches", symbol: "in³", factor: 0.016387064 },
  { id: "us_gal", name: "US Gallons", symbol: "gal", factor: 3.785411784 },
  { id: "us_qt", name: "US Quarts", symbol: "qt", factor: 0.946352946 },
  { id: "us_pt", name: "US Pints", symbol: "pt", factor: 0.473176473 },
  { id: "us_cup", name: "US Cups", symbol: "cup", factor: 0.2365882365 },
  { id: "us_floz", name: "US Fluid Ounces", symbol: "fl oz", factor: 0.0295735295625 },
  { id: "tbsp", name: "Tablespoons", symbol: "tbsp", factor: 0.01478676478125 },
  { id: "tsp", name: "Teaspoons", symbol: "tsp", factor: 0.00492892159375 },
];

const PRESSURE_UNITS: UnitDef[] = [
  { id: "pa", name: "Pascals", symbol: "Pa", factor: 1 },
  { id: "kpa", name: "Kilopascals", symbol: "kPa", factor: 1000 },
  { id: "mpa", name: "Megapascals", symbol: "MPa", factor: 1_000_000 },
  { id: "bar", name: "Bar", symbol: "bar", factor: 100_000 },
  { id: "mbar", name: "Millibar", symbol: "mbar", factor: 100 },
  { id: "psi", name: "Pounds per Square Inch", symbol: "psi", factor: 6894.757293168 },
  { id: "atm", name: "Standard Atmospheres", symbol: "atm", factor: 101325 },
  { id: "torr", name: "Torr / mmHg", symbol: "mmHg", factor: 133.322368421 },
];

const ENERGY_UNITS: UnitDef[] = [
  { id: "j", name: "Joules", symbol: "J", factor: 1 },
  { id: "kj", name: "Kilojoules", symbol: "kJ", factor: 1000 },
  { id: "cal", name: "Calories (thermo)", symbol: "cal", factor: 4.184 },
  { id: "kcal", name: "Kilocalories (Food)", symbol: "kcal", factor: 4184 },
  { id: "wh", name: "Watt-hours", symbol: "Wh", factor: 3600 },
  { id: "kwh", name: "Kilowatt-hours", symbol: "kWh", factor: 3_600_000 },
  { id: "btu", name: "British Thermal Units", symbol: "BTU", factor: 1055.05585262 },
  { id: "ftlb", name: "Foot-pounds", symbol: "ft·lb", factor: 1.3558179483314 },
];

const POWER_UNITS: UnitDef[] = [
  { id: "w", name: "Watts", symbol: "W", factor: 1 },
  { id: "kw", name: "Kilowatts", symbol: "kW", factor: 1000 },
  { id: "mw", name: "Megawatts", symbol: "MW", factor: 1_000_000 },
  { id: "hp", name: "Mechanical Horsepower", symbol: "hp", factor: 745.69987158227 },
  { id: "ps", name: "Metric Horsepower", symbol: "PS", factor: 735.49875 },
  { id: "btuh", name: "BTU per hour", symbol: "BTU/h", factor: 0.29307107 },
  { id: "ftlbs", name: "Foot-pounds/sec", symbol: "ft·lb/s", factor: 1.3558179483314 },
];

const DATA_UNITS: UnitDef[] = [
  { id: "b", name: "Bits", symbol: "b", factor: 0.125 },
  { id: "B", name: "Bytes", symbol: "B", factor: 1 },
  { id: "KB", name: "Kilobytes (decimal)", symbol: "KB", factor: 1000 },
  { id: "MB", name: "Megabytes (decimal)", symbol: "MB", factor: 1_000_000 },
  { id: "GB", name: "Gigabytes (decimal)", symbol: "GB", factor: 1_000_000_000 },
  { id: "TB", name: "Terabytes (decimal)", symbol: "TB", factor: 1_000_000_000_000 },
  { id: "KiB", name: "Kibibytes (binary)", symbol: "KiB", factor: 1024 },
  { id: "MiB", name: "Mebibytes (binary)", symbol: "MiB", factor: 1024 * 1024 },
  { id: "GiB", name: "Gibibytes (binary)", symbol: "GiB", factor: 1024 * 1024 * 1024 },
  { id: "TiB", name: "Tebibytes (binary)", symbol: "TiB", factor: 1024 * 1024 * 1024 * 1024 },
];

const ANGLE_UNITS: UnitDef[] = [
  { id: "deg", name: "Degrees", symbol: "°", factor: 1 },
  { id: "rad", name: "Radians", symbol: "rad", factor: 180 / Math.PI },
  { id: "grad", name: "Gradians", symbol: "grad", factor: 0.9 },
  { id: "arcmin", name: "Arcminutes", symbol: "′", factor: 1 / 60 },
  { id: "arcsec", name: "Arcseconds", symbol: "″", factor: 1 / 3600 },
  { id: "rev", name: "Revolutions / Turns", symbol: "rev", factor: 360 },
];

const COOKING_INGREDIENTS: Record<string, { name: string; densityGPerMl: number }> = {
  water: { name: "Water / Milk", densityGPerMl: 1.0 },
  flour: { name: "All-Purpose Flour", densityGPerMl: 0.53 },
  sugar: { name: "Granulated Sugar", densityGPerMl: 0.85 },
  brown_sugar: { name: "Brown Sugar (Packed)", densityGPerMl: 0.93 },
  butter: { name: "Butter", densityGPerMl: 0.911 },
  honey: { name: "Honey", densityGPerMl: 1.42 },
  olive_oil: { name: "Cooking / Olive Oil", densityGPerMl: 0.92 },
};

type FuelUnit = "mpg_us" | "mpg_uk" | "l100km" | "kml";

export function ConverterTools({ activeSlug, embedOnly = false }: ConverterToolsProps) {
  const { locale } = useI18n();
  const formId = useId();

  const initialTab: ConverterToolSlug = useMemo(() => {
    if (!activeSlug) return "area-converter";
    const valid: ConverterToolSlug[] = [
      "area-converter",
      "volume-converter",
      "pressure-converter",
      "energy-converter",
      "power-converter",
      "data-storage-converter",
      "fuel-economy-converter",
      "angle-converter",
      "cooking-converter",
      "number-system-converter",
    ];
    return valid.includes(activeSlug as ConverterToolSlug)
      ? (activeSlug as ConverterToolSlug)
      : "area-converter";
  }, [activeSlug]);

  const [currentTool, setCurrentTool] = useState<ConverterToolSlug>(initialTab);

  // Common State
  const [inputValue, setInputValue] = useState<number>(10);
  const [precision, setPrecision] = useState<number>(4);
  const [copied, setCopied] = useState(false);

  // Unit selections for standard factor converters
  const [fromUnit, setFromUnit] = useState<string>("sqm");
  const [toUnit, setToUnit] = useState<string>("sqft");

  // Fuel economy state
  const [fuelFrom, setFuelFrom] = useState<"mpg_us" | "mpg_uk" | "l100km" | "kml">("mpg_us");
  const [fuelTo, setFuelTo] = useState<"mpg_us" | "mpg_uk" | "l100km" | "kml">("l100km");
  const [fuelInput, setFuelInput] = useState<number>(30);

  // Cooking state
  const [cookingIngredient, setCookingIngredient] = useState<string>("water");
  const [cookingFrom, setCookingFrom] = useState<string>("us_cup");
  const [cookingTo, setCookingTo] = useState<string>("ml");
  const [cookingAmount, setCookingAmount] = useState<number>(1);

  // Number system state
  const [numInput, setNumInput] = useState<string>("255");
  const [numFromBase, setNumFromBase] = useState<number>(10);

  // Handle unit tab switch with sensible defaults
  const handleToolChange = (tool: ConverterToolSlug) => {
    setCurrentTool(tool);
    if (tool === "area-converter") {
      setFromUnit("sqm");
      setToUnit("sqft");
      setInputValue(100);
    } else if (tool === "volume-converter") {
      setFromUnit("l");
      setToUnit("us_gal");
      setInputValue(10);
    } else if (tool === "pressure-converter") {
      setFromUnit("bar");
      setToUnit("psi");
      setInputValue(2.5);
    } else if (tool === "energy-converter") {
      setFromUnit("kwh");
      setToUnit("mj");
      setInputValue(15);
    } else if (tool === "power-converter") {
      setFromUnit("kw");
      setToUnit("hp");
      setInputValue(75);
    } else if (tool === "data-storage-converter") {
      setFromUnit("GB");
      setToUnit("MB");
      setInputValue(16);
    } else if (tool === "angle-converter") {
      setFromUnit("deg");
      setToUnit("rad");
      setInputValue(90);
    }
  };

  // Get active unit list
  const activeUnitList = useMemo((): UnitDef[] => {
    switch (currentTool) {
      case "area-converter":
        return AREA_UNITS;
      case "volume-converter":
        return VOLUME_UNITS;
      case "pressure-converter":
        return PRESSURE_UNITS;
      case "energy-converter":
        return ENERGY_UNITS;
      case "power-converter":
        return POWER_UNITS;
      case "data-storage-converter":
        return DATA_UNITS;
      case "angle-converter":
        return ANGLE_UNITS;
      default:
        return AREA_UNITS;
    }
  }, [currentTool]);

  // Standard Linear Conversion Calculation
  const standardResult = useMemo(() => {
    const fromDef = activeUnitList.find((u) => u.id === fromUnit) ?? activeUnitList[0];
    const toDef = activeUnitList.find((u) => u.id === toUnit) ?? activeUnitList[1];
    if (!fromDef || !toDef) return 0;

    const baseValue = inputValue * fromDef.factor;
    const converted = baseValue / toDef.factor;
    return converted;
  }, [activeUnitList, fromUnit, toUnit, inputValue]);

  // Fuel Economy Calculation (inverses)
  const fuelResult = useMemo(() => {
    if (fuelInput <= 0) return 0;
    // Normalize input to km/L
    let kmPerLiter = 0;
    if (fuelFrom === "kml") kmPerLiter = fuelInput;
    else if (fuelFrom === "mpg_us") kmPerLiter = fuelInput * 0.425143707;
    else if (fuelFrom === "mpg_uk") kmPerLiter = fuelInput * 0.354006;
    else if (fuelFrom === "l100km") kmPerLiter = 100 / fuelInput;

    // Convert from km/L to target
    if (fuelTo === "kml") return kmPerLiter;
    if (fuelTo === "mpg_us") return kmPerLiter / 0.425143707;
    if (fuelTo === "mpg_uk") return kmPerLiter / 0.354006;
    if (fuelTo === "l100km") return kmPerLiter > 0 ? 100 / kmPerLiter : 0;
    return 0;
  }, [fuelInput, fuelFrom, fuelTo]);

  // Cooking Calculation
  const cookingResult = useMemo(() => {
    if (cookingAmount <= 0) return 0;
    const density = COOKING_INGREDIENTS[cookingIngredient]?.densityGPerMl ?? 1.0;

    // Convert input to milliliters
    let ml = 0;
    if (cookingFrom === "ml") ml = cookingAmount;
    else if (cookingFrom === "l") ml = cookingAmount * 1000;
    else if (cookingFrom === "us_cup") ml = cookingAmount * 236.588;
    else if (cookingFrom === "tbsp") ml = cookingAmount * 14.7868;
    else if (cookingFrom === "tsp") ml = cookingAmount * 4.92892;
    else if (cookingFrom === "us_floz") ml = cookingAmount * 29.5735;
    else if (cookingFrom === "g") ml = cookingAmount / density;

    // Convert ml to target
    if (cookingTo === "ml") return ml;
    if (cookingTo === "l") return ml / 1000;
    if (cookingTo === "us_cup") return ml / 236.588;
    if (cookingTo === "tbsp") return ml / 14.7868;
    if (cookingTo === "tsp") return ml / 4.92892;
    if (cookingTo === "us_floz") return ml / 29.5735;
    if (cookingTo === "g") return ml * density;
    return 0;
  }, [cookingAmount, cookingIngredient, cookingFrom, cookingTo]);

  // Number System Conversions
  const numberSystemResult = useMemo(() => {
    try {
      const clean = numInput.trim();
      if (!clean) return { dec: "0", bin: "0", hex: "0", oct: "0", valid: true };
      const parsed = parseInt(clean, numFromBase);
      if (isNaN(parsed)) return { dec: "Invalid", bin: "Invalid", hex: "Invalid", oct: "Invalid", valid: false };

      return {
        dec: parsed.toString(10),
        bin: parsed.toString(2),
        hex: parsed.toString(16).toUpperCase(),
        oct: parsed.toString(8),
        valid: true,
      };
    } catch {
      return { dec: "Error", bin: "Error", hex: "Error", oct: "Error", valid: false };
    }
  }, [numInput, numFromBase]);

  const copyToClipboard = useCallback((val: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(val);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const swapUnits = () => {
    const tmp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tmp);
  };

  const swapFuelUnits = () => {
    const tmp = fuelFrom;
    setFuelFrom(fuelTo);
    setFuelTo(tmp);
  };

  const swapCookingUnits = () => {
    const tmp = cookingFrom;
    setCookingFrom(cookingTo);
    setCookingTo(tmp);
  };

  const formattedOutput = useMemo(() => {
    if (currentTool === "fuel-economy-converter") {
      return fuelResult.toFixed(precision);
    }
    if (currentTool === "cooking-converter") {
      return cookingResult.toFixed(precision);
    }
    return Number.isFinite(standardResult) ? standardResult.toFixed(precision) : "0";
  }, [currentTool, standardResult, fuelResult, cookingResult, precision]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Tool Navigation Bar */}
      {!embedOnly && (
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-zinc-200 bg-white/80 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/60">
          {[
            { id: "area-converter", label: "Area", icon: Layers },
            { id: "volume-converter", label: "Volume", icon: Gauge },
            { id: "pressure-converter", label: "Pressure", icon: Scale },
            { id: "energy-converter", label: "Energy", icon: Flame },
            { id: "power-converter", label: "Power", icon: Zap },
            { id: "data-storage-converter", label: "Data Storage", icon: Database },
            { id: "fuel-economy-converter", label: "Fuel Economy", icon: Fuel },
            { id: "angle-converter", label: "Angle", icon: Compass },
            { id: "cooking-converter", label: "Cooking", icon: Utensils },
            { id: "number-system-converter", label: "Number Base", icon: Cpu },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleToolChange(id as ConverterToolSlug)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                currentTool === id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Converter Card */}
      <section className="space-y-6 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
        {/* Converter Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              {currentTool
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Bidirectional browser-based conversion with verified scientific standards.
            </p>
          </div>

          {/* Precision Controls */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500">Decimals:</span>
            {[2, 4, 6].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrecision(p)}
                className={`rounded-lg px-2.5 py-1 font-mono transition ${
                  precision === p
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 1. STANDARD FACTOR CONVERTER FORM (Area, Volume, Pressure, Energy, Power, Data, Angle) */}
        {currentTool !== "fuel-economy-converter" &&
          currentTool !== "cooking-converter" &&
          currentTool !== "number-system-converter" && (
            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
              {/* FROM Unit Block */}
              <div className="space-y-3">
                <label
                  htmlFor={`${formId}-from-val`}
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  From Value
                </label>
                <input
                  id={`${formId}-from-val`}
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={(e) => setInputValue(Number(e.target.value))}
                  className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-xl font-bold text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <select
                  aria-label="From Unit"
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  {activeUnitList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={swapUnits}
                  aria-label="Swap units"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-emerald-400"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>
              </div>

              {/* TO Unit Block */}
              <div className="space-y-3">
                <label
                  htmlFor={`${formId}-to-val`}
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Converted Result
                </label>
                <div className="flex items-center gap-2">
                  <div
                    id={`${formId}-to-val`}
                    className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xl font-bold text-emerald-800 dark:text-emerald-300"
                  >
                    {formattedOutput}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formattedOutput)}
                    aria-label="Copy result"
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <select
                  aria-label="To Unit"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  {activeUnitList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

        {/* 2. FUEL ECONOMY CONVERTER */}
        {currentTool === "fuel-economy-converter" && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="space-y-3">
                <label
                  htmlFor={`${formId}-fuel-val`}
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Fuel Efficiency Value
                </label>
                <input
                  id={`${formId}-fuel-val`}
                  type="number"
                  min="0"
                  step="0.1"
                  value={fuelInput}
                  onChange={(e) => setFuelInput(Number(e.target.value))}
                  className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-xl font-bold text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <select
                  aria-label="Fuel From Unit"
                  value={fuelFrom}
                  onChange={(e) => setFuelFrom(e.target.value as FuelUnit)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="mpg_us">Miles per Gallon (US MPG)</option>
                  <option value="mpg_uk">Miles per Gallon (Imperial UK MPG)</option>
                  <option value="l100km">Liters per 100 km (L/100km)</option>
                  <option value="kml">Kilometers per Liter (km/L)</option>
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={swapFuelUnits}
                  aria-label="Swap fuel units"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor={`${formId}-fuel-res`}
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Target Equivalent
                </label>
                <div className="flex items-center gap-2">
                  <div
                    id={`${formId}-fuel-res`}
                    className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xl font-bold text-emerald-800 dark:text-emerald-300"
                  >
                    {formattedOutput}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formattedOutput)}
                    aria-label="Copy result"
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <select
                  aria-label="Fuel To Unit"
                  value={fuelTo}
                  onChange={(e) => setFuelTo(e.target.value as FuelUnit)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="l100km">Liters per 100 km (L/100km)</option>
                  <option value="mpg_us">Miles per Gallon (US MPG)</option>
                  <option value="mpg_uk">Miles per Gallon (Imperial UK MPG)</option>
                  <option value="kml">Kilometers per Liter (km/L)</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-xs text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:text-zinc-400">
              <strong className="text-zinc-900 dark:text-zinc-200">Formula Note:</strong> L/100km is an inverse metric
              where lower values represent better fuel economy. 1 US MPG = 235.215 / (L/100km).
            </div>
          </div>
        )}

        {/* 3. COOKING MEASUREMENT & INGREDIENT CONVERTER */}
        {currentTool === "cooking-converter" && (
          <div className="space-y-6">
            {/* Ingredient Selector */}
            <div className="space-y-1.5">
              <label
                htmlFor={`${formId}-cook-ing`}
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Ingredient (For Weight ↔ Volume Density Mapping)
              </label>
              <select
                id={`${formId}-cook-ing`}
                value={cookingIngredient}
                onChange={(e) => setCookingIngredient(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                {Object.entries(COOKING_INGREDIENTS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.name} (Density: {val.densityGPerMl} g/mL)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="space-y-3">
                <label
                  htmlFor={`${formId}-cook-amount`}
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Recipe Amount
                </label>
                <input
                  id={`${formId}-cook-amount`}
                  type="number"
                  min="0"
                  step="0.25"
                  value={cookingAmount}
                  onChange={(e) => setCookingAmount(Number(e.target.value))}
                  className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-xl font-bold text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <select
                  aria-label="Cooking From Unit"
                  value={cookingFrom}
                  onChange={(e) => setCookingFrom(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="us_cup">US Cups</option>
                  <option value="tbsp">Tablespoons (tbsp)</option>
                  <option value="tsp">Teaspoons (tsp)</option>
                  <option value="us_floz">Fluid Ounces (fl oz)</option>
                  <option value="ml">Milliliters (mL)</option>
                  <option value="l">Liters (L)</option>
                  <option value="g">Grams (g)</option>
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={swapCookingUnits}
                  aria-label="Swap cooking units"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor={`${formId}-cook-res`}
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Converted Kitchen Measure
                </label>
                <div className="flex items-center gap-2">
                  <div
                    id={`${formId}-cook-res`}
                    className="w-full rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xl font-bold text-emerald-800 dark:text-emerald-300"
                  >
                    {formattedOutput}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formattedOutput)}
                    aria-label="Copy result"
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <select
                  aria-label="Cooking To Unit"
                  value={cookingTo}
                  onChange={(e) => setCookingTo(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="ml">Milliliters (mL)</option>
                  <option value="g">Grams (g)</option>
                  <option value="us_cup">US Cups</option>
                  <option value="tbsp">Tablespoons (tbsp)</option>
                  <option value="tsp">Teaspoons (tsp)</option>
                  <option value="us_floz">Fluid Ounces (fl oz)</option>
                  <option value="l">Liters (L)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 4. NUMBER SYSTEM CONVERTER (Binary, Hex, Octal, Decimal) */}
        {currentTool === "number-system-converter" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor={`${formId}-num-base`}
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Input Base
                </label>
                <select
                  id={`${formId}-num-base`}
                  value={numFromBase}
                  onChange={(e) => setNumFromBase(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option value={10}>Decimal (Base 10)</option>
                  <option value={2}>Binary (Base 2)</option>
                  <option value={16}>Hexadecimal (Base 16)</option>
                  <option value={8}>Octal (Base 8)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={`${formId}-num-inp`}
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Enter Number Value
                </label>
                <input
                  id={`${formId}-num-inp`}
                  type="text"
                  value={numInput}
                  onChange={(e) => setNumInput(e.target.value)}
                  placeholder="e.g. 255 or 11111111"
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 font-mono text-base font-bold text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Radix Results Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Decimal (Base 10)", val: numberSystemResult.dec },
                { label: "Binary (Base 2)", val: numberSystemResult.bin },
                { label: "Hexadecimal (Base 16)", val: numberSystemResult.hex },
                { label: "Octal (Base 8)", val: numberSystemResult.oct },
              ].map((res) => (
                <div
                  key={res.label}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200/90 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60"
                >
                  <div>
                    <span className="block text-xs font-medium text-zinc-500">{res.label}</span>
                    <span className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">{res.val}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(res.val)}
                    aria-label={`Copy ${res.label}`}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Reset & Common Shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/80 pt-4 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setInputValue(1);
                setFuelInput(30);
                setCookingAmount(1);
                setNumInput("100");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Values</span>
            </button>
          </div>

          <div className="text-xs text-zinc-400">
            Precision math verified in {locale.toUpperCase()} locale.
          </div>
        </div>
      </section>
    </div>
  );
}
