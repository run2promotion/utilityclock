"use client";

import {
  Banknote,
  Building2,
  Calculator,
  Check,
  Copy,
  DollarSign,
  HelpCircle,
  Landmark,
  Layers,
  Percent,
  PiggyBank,
  Receipt,
  RotateCcw,
  Scale,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

export type FinanceToolSlug =
  | "loan-emi-calculator"
  | "compound-interest-calculator"
  | "simple-interest-calculator"
  | "gst-calculator"
  | "vat-calculator"
  | "discount-calculator"
  | "profit-margin-calculator"
  | "markup-calculator"
  | "break-even-calculator"
  | "savings-goal-calculator";

type FinanceToolsProps = {
  activeSlug?: FinanceToolSlug | string;
  embedOnly?: boolean;
};

const CURRENCIES = [
  { symbol: "$", code: "USD", name: "US Dollar ($)" },
  { symbol: "€", code: "EUR", name: "Euro (€)" },
  { symbol: "£", code: "GBP", name: "British Pound (£)" },
  { symbol: "₹", code: "INR", name: "Indian Rupee (₹)" },
  { symbol: "¥", code: "JPY", name: "Japanese Yen / Chinese Yuan (¥)" },
  { symbol: "A$", code: "AUD", name: "Australian Dollar (A$)" },
  { symbol: "C$", code: "CAD", name: "Canadian Dollar (C$)" },
  { symbol: "CHF", code: "CHF", name: "Swiss Franc (CHF)" },
  { symbol: "kr", code: "SEK", name: "Scandinavian Krona (kr)" },
  { symbol: "R$", code: "BRL", name: "Brazilian Real (R$)" },
  { symbol: "₩", code: "KRW", name: "South Korean Won (₩)" },
  { symbol: "AED", code: "AED", name: "UAE Dirham (AED)" },
];

export function FinanceTools({ activeSlug, embedOnly = false }: FinanceToolsProps) {
  const initialTab: FinanceToolSlug =
    activeSlug &&
    [
      "loan-emi-calculator",
      "compound-interest-calculator",
      "simple-interest-calculator",
      "gst-calculator",
      "vat-calculator",
      "discount-calculator",
      "profit-margin-calculator",
      "markup-calculator",
      "break-even-calculator",
      "savings-goal-calculator",
    ].includes(activeSlug)
      ? (activeSlug as FinanceToolSlug)
      : "loan-emi-calculator";

  const [currentTool, setCurrentTool] = useState<FinanceToolSlug>(initialTab);
  const [currency, setCurrency] = useState("$");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const baseInputId = useId();

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const formatMoney = useCallback(
    (num: number, maximumFractionDigits = 2) => {
      if (!isFinite(num) || isNaN(num)) return "0.00";
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: maximumFractionDigits > 0 ? 2 : 0,
        maximumFractionDigits,
      }).format(num);
    },
    [],
  );

  // -------------------------------------------------------------
  // 1. Loan EMI Calculator State
  // -------------------------------------------------------------
  const [emiPrincipal, setEmiPrincipal] = useState(250000);
  const [emiAnnualRate, setEmiAnnualRate] = useState(6.5);
  const [emiTenureValue, setEmiTenureValue] = useState(15);
  const [emiTenureUnit, setEmiTenureUnit] = useState<"years" | "months">("years");
  const [showAmortization, setShowAmortization] = useState(false);

  const emiCalculation = useMemo(() => {
    const P = Math.max(0, Number(emiPrincipal) || 0);
    const annualRate = Math.max(0, Number(emiAnnualRate) || 0);
    const totalMonths =
      emiTenureUnit === "years"
        ? Math.max(1, Math.round((Number(emiTenureValue) || 1) * 12))
        : Math.max(1, Math.round(Number(emiTenureValue) || 1));

    if (P <= 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0, totalMonths, schedule: [] };
    }

    if (annualRate <= 0) {
      const emi = P / totalMonths;
      return {
        emi,
        totalPayment: P,
        totalInterest: 0,
        totalMonths,
        schedule: [],
      };
    }

    const r = annualRate / 12 / 100;
    const numerator = P * r * Math.pow(1 + r, totalMonths);
    const denominator = Math.pow(1 + r, totalMonths) - 1;
    const emi = denominator === 0 ? 0 : numerator / denominator;
    const totalPayment = emi * totalMonths;
    const totalInterest = Math.max(0, totalPayment - P);

    // Generate yearly amortization breakdown
    const schedule: Array<{
      year: number;
      principalPaid: number;
      interestPaid: number;
      closingBalance: number;
    }> = [];

    let balance = P;
    let currentYearPrincipal = 0;
    let currentYearInterest = 0;

    for (let m = 1; m <= totalMonths; m++) {
      const interestForMonth = balance * r;
      const principalForMonth = Math.min(balance, emi - interestForMonth);
      balance = Math.max(0, balance - principalForMonth);

      currentYearPrincipal += principalForMonth;
      currentYearInterest += interestForMonth;

      if (m % 12 === 0 || m === totalMonths) {
        schedule.push({
          year: Math.ceil(m / 12),
          principalPaid: currentYearPrincipal,
          interestPaid: currentYearInterest,
          closingBalance: balance,
        });
        currentYearPrincipal = 0;
        currentYearInterest = 0;
      }
    }

    return { emi, totalPayment, totalInterest, totalMonths, schedule };
  }, [emiPrincipal, emiAnnualRate, emiTenureValue, emiTenureUnit]);

  // -------------------------------------------------------------
  // 2. Compound Interest Calculator State
  // -------------------------------------------------------------
  const [ciPrincipal, setCiPrincipal] = useState(10000);
  const [ciAnnualRate, setCiAnnualRate] = useState(7);
  const [ciYears, setCiYears] = useState(10);
  const [ciFrequency, setCiFrequency] = useState<number>(12); // compounding per year
  const [ciMonthlyDeposit, setCiMonthlyDeposit] = useState(200);

  const ciCalculation = useMemo(() => {
    const P = Math.max(0, Number(ciPrincipal) || 0);
    const r = Math.max(0, Number(ciAnnualRate) || 0) / 100;
    const t = Math.max(1, Math.min(100, Math.round(Number(ciYears) || 1)));
    const n = Math.max(1, Number(ciFrequency) || 1);
    const pmt = Math.max(0, Number(ciMonthlyDeposit) || 0);

    const yearlyData: Array<{
      year: number;
      totalDeposited: number;
      interestEarned: number;
      balance: number;
    }> = [];

    let currentBalance = P;
    let totalDeposits = P;

    for (let y = 1; y <= t; y++) {
      for (let m = 1; m <= 12; m++) {
        currentBalance += pmt;
        totalDeposits += pmt;
        // Monthly effective interest rate adjusted for compounding frequency n
        const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;
        currentBalance += currentBalance * monthlyRate;
      }

      yearlyData.push({
        year: y,
        totalDeposited: totalDeposits,
        interestEarned: Math.max(0, currentBalance - totalDeposits),
        balance: currentBalance,
      });
    }

    const futureValue = currentBalance;
    const totalInterest = Math.max(0, futureValue - totalDeposits);

    return { futureValue, totalDeposits, totalInterest, yearlyData };
  }, [ciPrincipal, ciAnnualRate, ciYears, ciFrequency, ciMonthlyDeposit]);

  // -------------------------------------------------------------
  // 3. Simple Interest Calculator State
  // -------------------------------------------------------------
  const [siPrincipal, setSiPrincipal] = useState(5000);
  const [siRate, setSiRate] = useState(5);
  const [siTimeValue, setSiTimeValue] = useState(3);
  const [siTimeUnit, setSiTimeUnit] = useState<"years" | "months" | "days">("years");

  const siCalculation = useMemo(() => {
    const P = Math.max(0, Number(siPrincipal) || 0);
    const R = Math.max(0, Number(siRate) || 0);
    const rawTime = Math.max(0, Number(siTimeValue) || 0);

    let years = rawTime;
    if (siTimeUnit === "months") years = rawTime / 12;
    if (siTimeUnit === "days") years = rawTime / 365;

    const interest = (P * R * years) / 100;
    const totalAmount = P + interest;
    const dailyInterest = years > 0 ? interest / (years * 365) : 0;
    const monthlyInterest = years > 0 ? interest / (years * 12) : 0;
    const yearlyInterest = (P * R) / 100;

    return { interest, totalAmount, dailyInterest, monthlyInterest, yearlyInterest };
  }, [siPrincipal, siRate, siTimeValue, siTimeUnit]);

  // -------------------------------------------------------------
  // 4. GST Calculator State
  // -------------------------------------------------------------
  const [gstAmount, setGstAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [gstMode, setGstMode] = useState<"add" | "remove">("add");

  const gstCalculation = useMemo(() => {
    const amt = Math.max(0, Number(gstAmount) || 0);
    const rate = Math.max(0, Number(gstRate) || 0);

    if (gstMode === "add") {
      const netAmount = amt;
      const taxAmount = (netAmount * rate) / 100;
      const totalAmount = netAmount + taxAmount;
      const cgst = taxAmount / 2;
      const sgst = taxAmount / 2;
      return { netAmount, taxAmount, totalAmount, cgst, sgst };
    } else {
      const totalAmount = amt;
      const netAmount = totalAmount / (1 + rate / 100);
      const taxAmount = totalAmount - netAmount;
      const cgst = taxAmount / 2;
      const sgst = taxAmount / 2;
      return { netAmount, taxAmount, totalAmount, cgst, sgst };
    }
  }, [gstAmount, gstRate, gstMode]);

  // -------------------------------------------------------------
  // 5. VAT Calculator State
  // -------------------------------------------------------------
  const [vatAmount, setVatAmount] = useState(500);
  const [vatRate, setVatRate] = useState(20);
  const [vatMode, setVatMode] = useState<"add" | "remove">("add");

  const vatCalculation = useMemo(() => {
    const amt = Math.max(0, Number(vatAmount) || 0);
    const rate = Math.max(0, Number(vatRate) || 0);

    if (vatMode === "add") {
      const net = amt;
      const vat = (net * rate) / 100;
      const gross = net + vat;
      return { net, vat, gross };
    } else {
      const gross = amt;
      const net = gross / (1 + rate / 100);
      const vat = gross - net;
      return { net, vat, gross };
    }
  }, [vatAmount, vatRate, vatMode]);

  // -------------------------------------------------------------
  // 6. Discount Calculator State
  // -------------------------------------------------------------
  const [discountOriginal, setDiscountOriginal] = useState(150);
  const [discountPercent, setDiscountPercent] = useState(25);
  const [discountSecondary, setDiscountSecondary] = useState(10);
  const [discountTaxRate, setDiscountTaxRate] = useState(8);

  const discountCalculation = useMemo(() => {
    const orig = Math.max(0, Number(discountOriginal) || 0);
    const d1 = Math.max(0, Math.min(100, Number(discountPercent) || 0));
    const d2 = Math.max(0, Math.min(100, Number(discountSecondary) || 0));
    const tax = Math.max(0, Number(discountTaxRate) || 0);

    const firstDiscountAmount = orig * (d1 / 100);
    const priceAfterFirst = orig - firstDiscountAmount;

    const secondDiscountAmount = priceAfterFirst * (d2 / 100);
    const priceAfterDiscounts = priceAfterFirst - secondDiscountAmount;

    const totalSavings = firstDiscountAmount + secondDiscountAmount;
    const taxAmount = (priceAfterDiscounts * tax) / 100;
    const finalPrice = priceAfterDiscounts + taxAmount;
    const totalSavingsPercent = orig > 0 ? (totalSavings / orig) * 100 : 0;

    return {
      priceAfterDiscounts,
      totalSavings,
      totalSavingsPercent,
      taxAmount,
      finalPrice,
    };
  }, [discountOriginal, discountPercent, discountSecondary, discountTaxRate]);

  // -------------------------------------------------------------
  // 7. Profit Margin Calculator State
  // -------------------------------------------------------------
  const [marginCost, setMarginCost] = useState(60);
  const [marginRevenue, setMarginRevenue] = useState(100);

  const marginCalculation = useMemo(() => {
    const cost = Math.max(0, Number(marginCost) || 0);
    const rev = Math.max(0, Number(marginRevenue) || 0);
    const profit = rev - cost;
    const margin = rev > 0 ? (profit / rev) * 100 : 0;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;
    return { cost, rev, profit, margin, markup };
  }, [marginCost, marginRevenue]);

  // -------------------------------------------------------------
  // 8. Markup Calculator State
  // -------------------------------------------------------------
  const [markupCost, setMarkupCost] = useState(80);
  const [markupPercent, setMarkupPercent] = useState(40);

  const markupCalculation = useMemo(() => {
    const cost = Math.max(0, Number(markupCost) || 0);
    const markup = Math.max(0, Number(markupPercent) || 0);
    const markupAmount = (cost * markup) / 100;
    const sellingPrice = cost + markupAmount;
    const profitMargin = sellingPrice > 0 ? (markupAmount / sellingPrice) * 100 : 0;
    return { cost, markup, markupAmount, sellingPrice, profitMargin };
  }, [markupCost, markupPercent]);

  // -------------------------------------------------------------
  // 9. Break-Even Calculator State
  // -------------------------------------------------------------
  const [beFixedCost, setBeFixedCost] = useState(12000);
  const [beVariableCost, setBeVariableCost] = useState(25);
  const [beSalePrice, setBeSalePrice] = useState(65);
  const [beTargetProfit, setBeTargetProfit] = useState(5000);

  const beCalculation = useMemo(() => {
    const fixed = Math.max(0, Number(beFixedCost) || 0);
    const variable = Math.max(0, Number(beVariableCost) || 0);
    const price = Math.max(0, Number(beSalePrice) || 0);
    const target = Math.max(0, Number(beTargetProfit) || 0);

    const contributionMargin = price - variable;
    const cmRatio = price > 0 ? (contributionMargin / price) * 100 : 0;

    if (contributionMargin <= 0) {
      return {
        contributionMargin: 0,
        cmRatio: 0,
        breakEvenUnits: Infinity,
        breakEvenRevenue: Infinity,
        targetUnits: Infinity,
        isValid: false,
      };
    }

    const breakEvenUnits = Math.ceil(fixed / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * price;
    const targetUnits = Math.ceil((fixed + target) / contributionMargin);
    const targetRevenue = targetUnits * price;

    return {
      contributionMargin,
      cmRatio,
      breakEvenUnits,
      breakEvenRevenue,
      targetUnits,
      targetRevenue,
      isValid: true,
    };
  }, [beFixedCost, beVariableCost, beSalePrice, beTargetProfit]);

  // -------------------------------------------------------------
  // 10. Savings Goal Calculator State
  // -------------------------------------------------------------
  const [sgTargetAmount, setSgTargetAmount] = useState(50000);
  const [sgInitialBalance, setSgInitialBalance] = useState(5000);
  const [sgTimeValue, setSgTimeValue] = useState(5);
  const [sgTimeUnit, setSgTimeUnit] = useState<"years" | "months">("years");
  const [sgAnnualRate, setSgAnnualRate] = useState(6);

  const sgCalculation = useMemo(() => {
    const target = Math.max(0, Number(sgTargetAmount) || 0);
    const initial = Math.max(0, Number(sgInitialBalance) || 0);
    const r = Math.max(0, Number(sgAnnualRate) || 0) / 100 / 12;
    const totalMonths =
      sgTimeUnit === "years"
        ? Math.max(1, Math.round((Number(sgTimeValue) || 1) * 12))
        : Math.max(1, Math.round(Number(sgTimeValue) || 1));

    if (target <= initial) {
      return {
        monthlyDeposit: 0,
        totalContributed: 0,
        totalInterest: 0,
        futureInitialValue: initial,
        alreadyReached: true,
      };
    }

    const futureInitialValue = initial * Math.pow(1 + r, totalMonths);
    const remainingToSave = target - futureInitialValue;

    if (remainingToSave <= 0) {
      return {
        monthlyDeposit: 0,
        totalContributed: 0,
        totalInterest: target - initial,
        futureInitialValue,
        alreadyReached: true,
      };
    }

    let monthlyDeposit = 0;
    if (r === 0) {
      monthlyDeposit = remainingToSave / totalMonths;
    } else {
      const factor = (Math.pow(1 + r, totalMonths) - 1) / r;
      monthlyDeposit = remainingToSave / factor;
    }

    const totalContributed = initial + monthlyDeposit * totalMonths;
    const totalInterest = Math.max(0, target - totalContributed);

    return {
      monthlyDeposit,
      totalContributed,
      totalInterest,
      futureInitialValue,
      alreadyReached: false,
    };
  }, [sgTargetAmount, sgInitialBalance, sgTimeValue, sgTimeUnit, sgAnnualRate]);

  // Available Tools Navigation Array
  const toolsList: Array<{
    id: FinanceToolSlug;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    desc: string;
  }> = [
    {
      id: "loan-emi-calculator",
      name: "Loan EMI",
      icon: Banknote,
      desc: "Monthly EMI and interest amortisation schedule.",
    },
    {
      id: "compound-interest-calculator",
      name: "Compound Interest",
      icon: TrendingUp,
      desc: "Calculate long-term wealth growth with monthly deposits.",
    },
    {
      id: "simple-interest-calculator",
      name: "Simple Interest",
      icon: Percent,
      desc: "Calculate simple interest across days, months or years.",
    },
    {
      id: "gst-calculator",
      name: "GST Calculator",
      icon: Receipt,
      desc: "Add or remove GST with CGST and SGST splits.",
    },
    {
      id: "vat-calculator",
      name: "VAT Calculator",
      icon: Scale,
      desc: "Add VAT to net price or extract VAT from gross total.",
    },
    {
      id: "discount-calculator",
      name: "Discount & Sale",
      icon: TrendingDown,
      desc: "Final checkout price, stacked coupon savings and tax.",
    },
    {
      id: "profit-margin-calculator",
      name: "Profit Margin",
      icon: DollarSign,
      desc: "Gross profit, profit margin % and markup comparison.",
    },
    {
      id: "markup-calculator",
      name: "Markup Calculator",
      icon: Calculator,
      desc: "Set retail selling prices based on target cost markup.",
    },
    {
      id: "break-even-calculator",
      name: "Break-Even Point",
      icon: Building2,
      desc: "Units and revenue required to cover fixed/variable costs.",
    },
    {
      id: "savings-goal-calculator",
      name: "Savings Goal",
      icon: PiggyBank,
      desc: "Required monthly savings to hit target by deadline.",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header controls: Tool tabs and Currency display selector */}
      {!embedOnly && (
        <div className="bg-card border rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Landmark className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Financial Calculators
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Accurate mathematical tools for loans, interest, sales tax, margins, and savings.
              </p>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor={`${baseInputId}-currency`} className="text-xs font-medium text-muted-foreground">
                Currency:
              </label>
              <select
                id={`${baseInputId}-currency`}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-background border rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.symbol}>
                    {c.symbol} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tool Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-2 border-t">
            {toolsList.map((tItem) => {
              const Icon = tItem.icon;
              const isActive = currentTool === tItem.id;
              return (
                <button
                  key={tItem.id}
                  onClick={() => setCurrentTool(tItem.id)}
                  className={`flex flex-col items-center text-center p-2 rounded-xl transition-all text-xs font-medium ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-muted/40 hover:bg-muted text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 mb-1 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                  <span className="truncate w-full">{tItem.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Tool Content Container */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        {/* ========================================================================= */}
        {/* TOOL 1: Loan EMI Calculator */}
        {/* ========================================================================= */}
        {currentTool === "loan-emi-calculator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-emerald-500" />
                  Loan EMI Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Equated Monthly Installment (EMI) with principal vs interest breakdown.
                </p>
              </div>
              <button
                onClick={() => {
                  setEmiPrincipal(250000);
                  setEmiAnnualRate(6.5);
                  setEmiTenureValue(15);
                  setEmiTenureUnit("years");
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Loan Amount ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={emiPrincipal}
                  onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={emiAnnualRate}
                  onChange={(e) => setEmiAnnualRate(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Loan Tenure
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max={emiTenureUnit === "years" ? 40 : 480}
                    value={emiTenureValue}
                    onChange={(e) => setEmiTenureValue(Number(e.target.value))}
                    className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    value={emiTenureUnit}
                    onChange={(e) => setEmiTenureUnit(e.target.value as "years" | "months")}
                    className="bg-background border rounded-xl px-2.5 py-2 text-xs font-semibold"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/40 border">
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Monthly EMI</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {currency}
                  {formatMoney(emiCalculation.emi)}
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${currency}${formatMoney(emiCalculation.emi)}`,
                      "loan-emi",
                    )
                  }
                  className="mt-2 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {copiedKey === "loan-emi" ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copiedKey === "loan-emi" ? "Copied" : "Copy EMI"}
                </button>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Total Interest Payable</span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {currency}
                  {formatMoney(emiCalculation.totalInterest)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  {emiCalculation.totalPayment > 0
                    ? `${((emiCalculation.totalInterest / emiCalculation.totalPayment) * 100).toFixed(1)}% of total repayment`
                    : "0%"}
                </span>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Total Payment (Principal + Int)</span>
                <span className="text-xl font-bold text-foreground">
                  {currency}
                  {formatMoney(emiCalculation.totalPayment)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Over {emiCalculation.totalMonths} months
                </span>
              </div>
            </div>

            {/* Progress ratio */}
            {emiCalculation.totalPayment > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Principal: {currency}{formatMoney(emiPrincipal)}</span>
                  <span>Interest: {currency}{formatMoney(emiCalculation.totalInterest)}</span>
                </div>
                <div className="h-3 w-full bg-amber-500/30 rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${(emiPrincipal / emiCalculation.totalPayment) * 100}%`,
                    }}
                    className="h-full bg-emerald-500"
                    title="Principal"
                  />
                  <div
                    style={{
                      width: `${(emiCalculation.totalInterest / emiCalculation.totalPayment) * 100}%`,
                    }}
                    className="h-full bg-amber-500"
                    title="Interest"
                  />
                </div>
              </div>
            )}

            {/* Amortization schedule toggle */}
            {emiCalculation.schedule.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Layers className="h-3.5 w-3.5" />
                  {showAmortization ? "Hide Annual Amortization Table" : "Show Annual Amortization Table"}
                </button>

                {showAmortization && (
                  <div className="mt-3 overflow-x-auto border rounded-xl max-h-72">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-muted text-muted-foreground sticky top-0">
                        <tr>
                          <th className="p-2.5">Year</th>
                          <th className="p-2.5">Principal Paid</th>
                          <th className="p-2.5">Interest Paid</th>
                          <th className="p-2.5">Ending Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {emiCalculation.schedule.map((item) => (
                          <tr key={item.year} className="hover:bg-muted/30">
                            <td className="p-2.5 font-bold">Year {item.year}</td>
                            <td className="p-2.5">{currency}{formatMoney(item.principalPaid)}</td>
                            <td className="p-2.5 text-amber-600 dark:text-amber-400">
                              {currency}{formatMoney(item.interestPaid)}
                            </td>
                            <td className="p-2.5 font-medium">{currency}{formatMoney(item.closingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground block">Formula Explanation</span>
              <p>
                EMI formula:{" "}
                <code className="font-mono bg-muted px-1 py-0.5 rounded">
                  E = P × r × (1 + r)^n / ((1 + r)^n - 1)
                </code>
                , where <code className="font-mono">P</code> is the principal, <code className="font-mono">r</code> is the monthly interest rate (<code className="font-mono">annual rate / 12 / 100</code>), and <code className="font-mono">n</code> is the total number of monthly payments.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 2: Compound Interest Calculator */}
        {/* ========================================================================= */}
        {currentTool === "compound-interest-calculator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Compound Interest Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Simulate wealth compounding with periodic additions and compounding frequencies.
                </p>
              </div>
              <button
                onClick={() => {
                  setCiPrincipal(10000);
                  setCiAnnualRate(7);
                  setCiYears(10);
                  setCiFrequency(12);
                  setCiMonthlyDeposit(200);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Initial Investment ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={ciPrincipal}
                  onChange={(e) => setCiPrincipal(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Monthly Contribution ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={ciMonthlyDeposit}
                  onChange={(e) => setCiMonthlyDeposit(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Estimated Annual Return (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.25"
                  value={ciAnnualRate}
                  onChange={(e) => setCiAnnualRate(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Investment Horizon (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={ciYears}
                  onChange={(e) => setCiYears(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Compounding Frequency
                </label>
                <select
                  value={ciFrequency}
                  onChange={(e) => setCiFrequency(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="1">Annually (1/year)</option>
                  <option value="2">Semi-Annually (2/year)</option>
                  <option value="4">Quarterly (4/year)</option>
                  <option value="12">Monthly (12/year)</option>
                  <option value="365">Daily (365/year)</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/40 border">
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Future Value</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {currency}
                  {formatMoney(ciCalculation.futureValue)}
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${currency}${formatMoney(ciCalculation.futureValue)}`,
                      "compound-fv",
                    )
                  }
                  className="mt-2 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {copiedKey === "compound-fv" ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copiedKey === "compound-fv" ? "Copied" : "Copy Future Value"}
                </button>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Total Deposits</span>
                <span className="text-xl font-bold text-foreground">
                  {currency}
                  {formatMoney(ciCalculation.totalDeposits)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Principal + All Monthly Additions
                </span>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Total Compound Growth</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {currency}
                  {formatMoney(ciCalculation.totalInterest)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Pure Interest Earned
                </span>
              </div>
            </div>

            {/* Yearly Growth Progression Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Yearly Growth Progression
              </h4>
              <div className="overflow-x-auto border rounded-xl max-h-60">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-muted text-muted-foreground sticky top-0">
                    <tr>
                      <th className="p-2">Year</th>
                      <th className="p-2">Total Contributed</th>
                      <th className="p-2">Total Interest</th>
                      <th className="p-2">Year-End Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ciCalculation.yearlyData.map((d) => (
                      <tr key={d.year} className="hover:bg-muted/30">
                        <td className="p-2 font-semibold">Year {d.year}</td>
                        <td className="p-2">{currency}{formatMoney(d.totalDeposited)}</td>
                        <td className="p-2 text-emerald-600 dark:text-emerald-400">
                          {currency}{formatMoney(d.interestEarned)}
                        </td>
                        <td className="p-2 font-bold">{currency}{formatMoney(d.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 3: Simple Interest Calculator */}
        {/* ========================================================================= */}
        {currentTool === "simple-interest-calculator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Percent className="h-5 w-5 text-emerald-500" />
                  Simple Interest Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Linear interest calculation across specified days, months, or years.
                </p>
              </div>
              <button
                onClick={() => {
                  setSiPrincipal(5000);
                  setSiRate(5);
                  setSiTimeValue(3);
                  setSiTimeUnit("years");
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Principal Amount ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={siPrincipal}
                  onChange={(e) => setSiPrincipal(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={siRate}
                  onChange={(e) => setSiRate(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Duration / Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={siTimeValue}
                    onChange={(e) => setSiTimeValue(Number(e.target.value))}
                    className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    value={siTimeUnit}
                    onChange={(e) => setSiTimeUnit(e.target.value as "years" | "months" | "days")}
                    className="bg-background border rounded-xl px-2.5 py-2 text-xs font-semibold"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border">
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Total Simple Interest</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {currency}
                  {formatMoney(siCalculation.interest)}
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${currency}${formatMoney(siCalculation.interest)}`,
                      "si-interest",
                    )
                  }
                  className="mt-2 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {copiedKey === "si-interest" ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copiedKey === "si-interest" ? "Copied" : "Copy Interest"}
                </button>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Total Amount (Principal + Interest)</span>
                <span className="text-2xl font-black text-foreground">
                  {currency}
                  {formatMoney(siCalculation.totalAmount)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-muted/30 border">
                <span className="text-muted-foreground block">Interest / Day</span>
                <span className="font-semibold">{currency}{formatMoney(siCalculation.dailyInterest, 3)}</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/30 border">
                <span className="text-muted-foreground block">Interest / Month</span>
                <span className="font-semibold">{currency}{formatMoney(siCalculation.monthlyInterest)}</span>
              </div>
              <div className="p-2 rounded-lg bg-muted/30 border">
                <span className="text-muted-foreground block">Interest / Year</span>
                <span className="font-semibold">{currency}{formatMoney(siCalculation.yearlyInterest)}</span>
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground">
              <span className="font-semibold text-foreground block">Formula</span>
              <code>Interest = (Principal × Rate × Time in years) / 100</code>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 4: GST Calculator */}
        {/* ========================================================================= */}
        {currentTool === "gst-calculator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-emerald-500" />
                  GST Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Add GST to base price or extract GST from gross invoices with CGST / SGST split.
                </p>
              </div>
              <button
                onClick={() => {
                  setGstAmount(1000);
                  setGstRate(18);
                  setGstMode("add");
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-xl">
              <button
                onClick={() => setGstMode("add")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  gstMode === "add"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                GST Exclusive (Add GST)
              </button>
              <button
                onClick={() => setGstMode("remove")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  gstMode === "remove"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                GST Inclusive (Extract GST)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {gstMode === "add" ? "Net / Base Amount" : "Gross Total Amount"} ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={gstAmount}
                  onChange={(e) => setGstAmount(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  GST Rate (%)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {/* Preset quick buttons */}
                  {[5, 12, 18, 28].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setGstRate(preset)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                        gstRate === preset
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Breakdown card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/40 rounded-xl border">
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Net Base Price</span>
                <span className="text-xl font-bold">{currency}{formatMoney(gstCalculation.netAmount)}</span>
              </div>
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Total GST ({gstRate}%)</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {currency}{formatMoney(gstCalculation.taxAmount)}
                </span>
              </div>
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Gross Final Invoice</span>
                <span className="text-2xl font-black text-foreground">
                  {currency}{formatMoney(gstCalculation.totalAmount)}
                </span>
              </div>
            </div>

            {/* Split CGST / SGST */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg border bg-card">
                <span className="text-muted-foreground block">CGST ({(gstRate / 2).toFixed(1)}%)</span>
                <span className="font-semibold text-foreground">{currency}{formatMoney(gstCalculation.cgst)}</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-card">
                <span className="text-muted-foreground block">SGST / UTGST ({(gstRate / 2).toFixed(1)}%)</span>
                <span className="font-semibold text-foreground">{currency}{formatMoney(gstCalculation.sgst)}</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-card col-span-2 sm:col-span-1">
                <span className="text-muted-foreground block">IGST (Inter-state {gstRate}%)</span>
                <span className="font-semibold text-foreground">{currency}{formatMoney(gstCalculation.taxAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 5: VAT Calculator */}
        {/* ========================================================================= */}
        {currentTool === "vat-calculator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Scale className="h-5 w-5 text-emerald-500" />
                  Value Added Tax (VAT) Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Calculate Net price, VAT tax amount, and Gross final total for any jurisdiction.
                </p>
              </div>
              <button
                onClick={() => {
                  setVatAmount(500);
                  setVatRate(20);
                  setVatMode("add");
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-xl">
              <button
                onClick={() => setVatMode("add")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  vatMode === "add"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Add VAT (Net to Gross)
              </button>
              <button
                onClick={() => setVatMode("remove")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  vatMode === "remove"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Extract VAT (Gross to Net)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {vatMode === "add" ? "Net (Pre-tax) Amount" : "Gross (Inclusive) Amount"} ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={vatAmount}
                  onChange={(e) => setVatAmount(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  VAT Rate (%)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {[5, 10, 15, 20].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setVatRate(preset)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                        vatRate === preset
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/40 rounded-xl border">
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Net Price</span>
                <span className="text-xl font-bold">{currency}{formatMoney(vatCalculation.net)}</span>
              </div>
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">VAT Amount ({vatRate}%)</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {currency}{formatMoney(vatCalculation.vat)}
                </span>
              </div>
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Gross Total Price</span>
                <span className="text-2xl font-black text-foreground">
                  {currency}{formatMoney(vatCalculation.gross)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 6: Discount Calculator */}
        {/* ========================================================================= */}
        {currentTool === "discount-calculator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-emerald-500" />
                  Discount & Sale Price Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Calculate markdown sales price, stacked promotion discounts, and sales tax.
                </p>
              </div>
              <button
                onClick={() => {
                  setDiscountOriginal(150);
                  setDiscountPercent(25);
                  setDiscountSecondary(10);
                  setDiscountTaxRate(8);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Original Tag Price ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={discountOriginal}
                  onChange={(e) => setDiscountOriginal(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Primary Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Extra Coupon / Off (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountSecondary}
                  onChange={(e) => setDiscountSecondary(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Sales Tax (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountTaxRate}
                  onChange={(e) => setDiscountTaxRate(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/40 rounded-xl border">
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Final Checkout Price</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {currency}{formatMoney(discountCalculation.finalPrice)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Incl. {currency}{formatMoney(discountCalculation.taxAmount)} tax
                </span>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Total Money Saved</span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {currency}{formatMoney(discountCalculation.totalSavings)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  ({discountCalculation.totalSavingsPercent.toFixed(1)}% effective discount)
                </span>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Price Before Tax</span>
                <span className="text-xl font-bold text-foreground">
                  {currency}{formatMoney(discountCalculation.priceAfterDiscounts)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  After stacked promotions
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 7: Profit Margin Calculator */}
        {/* ========================================================================= */}
        {currentTool === "profit-margin-calculator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                  Profit Margin Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Determine Gross Profit, Margin %, and Markup % from Cost and Selling Price.
                </p>
              </div>
              <button
                onClick={() => {
                  setMarginCost(60);
                  setMarginRevenue(100);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Cost of Goods Sold (COGS) ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={marginCost}
                  onChange={(e) => setMarginCost(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Revenue / Selling Price ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={marginRevenue}
                  onChange={(e) => setMarginRevenue(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/40 rounded-xl border">
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Gross Profit</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {currency}{formatMoney(marginCalculation.profit)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Revenue minus Cost
                </span>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Gross Profit Margin</span>
                <span className="text-2xl font-black text-foreground">
                  {marginCalculation.margin.toFixed(2)}%
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Profit as % of Revenue
                </span>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Markup</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {marginCalculation.markup.toFixed(2)}%
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Profit as % of Cost
                </span>
              </div>
            </div>

            {/* Margin vs Markup Explanation Card */}
            <div className="p-3.5 bg-muted/30 rounded-xl text-xs space-y-1.5 border">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-emerald-500" />
                Difference Between Margin and Markup
              </span>
              <p className="text-muted-foreground">
                <strong>Profit Margin</strong> is the percentage of the selling price that is profit:{" "}
                <code className="font-mono">Margin % = (Profit / Revenue) × 100</code>.
              </p>
              <p className="text-muted-foreground">
                <strong>Markup</strong> is the percentage added on top of your original cost to reach the selling price:{" "}
                <code className="font-mono">Markup % = (Profit / Cost) × 100</code>.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 8: Markup Calculator */}
        {/* ========================================================================= */}
        {currentTool === "markup-calculator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-emerald-500" />
                  Markup Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Set retail prices by applying a target markup percentage to product cost.
                </p>
              </div>
              <button
                onClick={() => {
                  setMarkupCost(80);
                  setMarkupPercent(40);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Cost Price ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={markupCost}
                  onChange={(e) => setMarkupCost(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Target Markup (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/40 rounded-xl border">
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Recommended Selling Price</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {currency}{formatMoney(markupCalculation.sellingPrice)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Cost + Markup amount
                </span>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Dollar Profit / Markup</span>
                <span className="text-xl font-bold text-foreground">
                  {currency}{formatMoney(markupCalculation.markupAmount)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Net gain per item sold
                </span>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Equivalent Profit Margin</span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {markupCalculation.profitMargin.toFixed(2)}%
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Margin from {markupPercent}% markup
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 9: Break-Even Calculator */}
        {/* ========================================================================= */}
        {currentTool === "break-even-calculator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                  Break-Even Point Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Calculate the exact sales volume needed to cover overhead and hit profit goals.
                </p>
              </div>
              <button
                onClick={() => {
                  setBeFixedCost(12000);
                  setBeVariableCost(25);
                  setBeSalePrice(65);
                  setBeTargetProfit(5000);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Total Fixed Costs ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={beFixedCost}
                  onChange={(e) => setBeFixedCost(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Variable Cost / Unit ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={beVariableCost}
                  onChange={(e) => setBeVariableCost(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Selling Price / Unit ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={beSalePrice}
                  onChange={(e) => setBeSalePrice(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Target Profit ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={beTargetProfit}
                  onChange={(e) => setBeTargetProfit(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {!beCalculation.isValid ? (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                Selling price per unit must be greater than variable cost per unit to generate a positive contribution margin.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted/40 rounded-xl border">
                <div className="p-3 bg-card rounded-lg border">
                  <span className="text-xs text-muted-foreground block">Break-Even Units</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {formatMoney(beCalculation.breakEvenUnits, 0)} units
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    Zero loss, zero profit
                  </span>
                </div>

                <div className="p-3 bg-card rounded-lg border">
                  <span className="text-xs text-muted-foreground block">Break-Even Revenue</span>
                  <span className="text-xl font-bold text-foreground">
                    {currency}{formatMoney(beCalculation.breakEvenRevenue)}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    Required turnover
                  </span>
                </div>

                <div className="p-3 bg-card rounded-lg border">
                  <span className="text-xs text-muted-foreground block">Unit Contribution Margin</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {currency}{formatMoney(beCalculation.contributionMargin)}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    ({beCalculation.cmRatio.toFixed(1)}% CM ratio)
                  </span>
                </div>

                <div className="p-3 bg-card rounded-lg border">
                  <span className="text-xs text-muted-foreground block">Target Profit Volume</span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {formatMoney(beCalculation.targetUnits, 0)} units
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    To make {currency}{formatMoney(beTargetProfit)} profit
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 10: Savings Goal Calculator */}
        {/* ========================================================================= */}
        {currentTool === "savings-goal-calculator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-emerald-500" />
                  Savings Goal & Target Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Determine exact monthly savings needed to reach your target by a set deadline.
                </p>
              </div>
              <button
                onClick={() => {
                  setSgTargetAmount(50000);
                  setSgInitialBalance(5000);
                  setSgTimeValue(5);
                  setSgTimeUnit("years");
                  setSgAnnualRate(6);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Target Goal ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={sgTargetAmount}
                  onChange={(e) => setSgTargetAmount(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Current Starting Balance ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={sgInitialBalance}
                  onChange={(e) => setSgInitialBalance(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Time Horizon
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={sgTimeValue}
                    onChange={(e) => setSgTimeValue(Number(e.target.value))}
                    className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    value={sgTimeUnit}
                    onChange={(e) => setSgTimeUnit(e.target.value as "years" | "months")}
                    className="bg-background border rounded-xl px-2 py-2 text-xs font-semibold"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Expected Return (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={sgAnnualRate}
                  onChange={(e) => setSgAnnualRate(Number(e.target.value))}
                  className="w-full bg-background border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/40 rounded-xl border">
              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Required Monthly Savings</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {currency}{formatMoney(sgCalculation.monthlyDeposit)}
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${currency}${formatMoney(sgCalculation.monthlyDeposit)}`,
                      "sg-monthly",
                    )
                  }
                  className="mt-2 text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {copiedKey === "sg-monthly" ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copiedKey === "sg-monthly" ? "Copied" : "Copy Target"}
                </button>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Total Out-of-Pocket</span>
                <span className="text-xl font-bold text-foreground">
                  {currency}{formatMoney(sgCalculation.totalContributed)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Starting funds + monthly contributions
                </span>
              </div>

              <div className="p-3 bg-card rounded-lg border">
                <span className="text-xs text-muted-foreground block">Interest Earned</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {currency}{formatMoney(sgCalculation.totalInterest)}
                </span>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Compound growth toward goal
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Regulatory & Advisory Disclaimer */}
        <div className="pt-4 border-t flex items-start gap-2.5 text-xs text-muted-foreground">
          <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p>
            <strong>Educational & Estimation Disclaimer:</strong> All calculations, loan amortizations, and compound interest projections are provided solely for illustrative and informational purposes. Real-world financial figures will vary based on specific lending agreements, compound schedules, tax regulations, and fees. Nothing on this website constitutes legal, accounting, tax, or investment advice.
          </p>
        </div>
      </div>
    </div>
  );
}
