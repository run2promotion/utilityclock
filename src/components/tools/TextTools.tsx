"use client";

import {
  AlignLeft,
  ArrowDownAZ,
  ArrowRightLeft,
  ArrowUpAZ,
  CaseSensitive,
  Check,
  Clock,
  Copy,
  FileSpreadsheet,
  FileText,
  Filter,
  Glasses,
  Hash,
  ListOrdered,
  Lock,
  RotateCcw,
  Scissors,
  Shuffle,
  Type,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export type TextToolSlug =
  | "word-counter"
  | "character-counter"
  | "case-converter"
  | "remove-duplicate-lines"
  | "text-sorter"
  | "text-reverser"
  | "whitespace-remover"
  | "line-break-remover"
  | "lorem-ipsum-generator"
  | "text-diff-checker";

type TextToolsProps = {
  activeSlug?: TextToolSlug | string;
  embedOnly?: boolean;
};

// Unicode flip dictionary for text reverser upside-down mode
const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ",
  k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ",
  u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "𐐒", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I", J: "ſ",
  K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ό", R: "ᴚ", S: "S", T: "⊥",
  U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ",
  "8": "8", "9": "6",
  ".": "˙", ",": "‘", ";": "؛", "!": "¡", "?": "¿", "'": ",", "\"": "„",
  "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
  "<": ">", ">": "<", "&": "⅋", "_": "‾",
};

// Standard Latin vocabulary for Lorem Ipsum generator
const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed",
  "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua",
  "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris",
  "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in",
  "reprehenderit", "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur",
  "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "curabitur", "pretium",
  "tincidunt", "lacus", "sollicitudin", "placerat", "ante", "blandit", "suscipit", "vulputate",
  "fringilla", "semper", "tellus", "feugiat", "dictum", "turpis", "fermentum", "congue",
  "praesent", "interdum", "mauris", "eleifend", "libero", "accumsan", "pellentesque",
];

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. Online web utilities provide fast, secure, and client-side processing without transmitting sensitive documents to external remote servers. Modern browser APIs enable high performance mathematical and algorithmic operations directly on local hardware.`;

export function TextTools({ activeSlug, embedOnly = false }: TextToolsProps) {
  const initialTab: TextToolSlug =
    activeSlug &&
    [
      "word-counter",
      "character-counter",
      "case-converter",
      "remove-duplicate-lines",
      "text-sorter",
      "text-reverser",
      "whitespace-remover",
      "line-break-remover",
      "lorem-ipsum-generator",
      "text-diff-checker",
    ].includes(activeSlug)
      ? (activeSlug as TextToolSlug)
      : "word-counter";

  const [currentTool, setCurrentTool] = useState<TextToolSlug>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  // -------------------------------------------------------------
  // 1. Word Counter State
  // -------------------------------------------------------------
  const [wcInput, setWcInput] = useState(SAMPLE_TEXT);

  const wcStats = useMemo(() => {
    const text = wcInput.trim();
    if (!text) {
      return {
        words: 0,
        characters: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        keywordDensity: [],
      };
    }

    const words = text.match(/\b[\w'-]+\b/g) || [];
    const characters = wcInput.length;
    const charsNoSpaces = wcInput.replace(/\s+/g, "").length;
    const sentences = (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (text ? 1 : 0);
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    const readingTimeMinutes = Math.ceil(words.length / 200); // 200 wpm standard
    const speakingTimeMinutes = Math.ceil(words.length / 130); // 130 wpm standard

    // Frequency count
    const stopWords = new Set([
      "the", "and", "a", "an", "in", "to", "of", "is", "for", "on", "it", "with", "as", "at", "by", "this", "that", "from", "or", "are", "be",
    ]);
    const wordCounts: Record<string, number> = {};
    words.forEach((w) => {
      const lower = w.toLowerCase();
      if (lower.length > 2 && !stopWords.has(lower)) {
        wordCounts[lower] = (wordCounts[lower] || 0) + 1;
      }
    });

    const keywordDensity = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / words.length) * 100).toFixed(1),
      }));

    return {
      words: words.length,
      characters,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      keywordDensity,
    };
  }, [wcInput]);

  // -------------------------------------------------------------
  // 2. Character Counter State
  // -------------------------------------------------------------
  const [ccInput, setCcInput] = useState(SAMPLE_TEXT);

  const ccStats = useMemo(() => {
    const totalChars = ccInput.length;
    const charsNoSpaces = ccInput.replace(/\s+/g, "").length;
    const words = (ccInput.trim().match(/\b[\w'-]+\b/g) || []).length;
    const lines = ccInput ? ccInput.split("\n").length : 0;

    const limits = [
      { name: "X (Twitter) Post", limit: 280, count: totalChars },
      { name: "SMS Segment", limit: 160, count: totalChars },
      { name: "Google SEO Title", limit: 60, count: totalChars },
      { name: "Google Meta Description", limit: 160, count: totalChars },
      { name: "Instagram Bio", limit: 150, count: totalChars },
      { name: "LinkedIn Post", limit: 3000, count: totalChars },
    ];

    return { totalChars, charsNoSpaces, words, lines, limits };
  }, [ccInput]);

  // -------------------------------------------------------------
  // 3. Case Converter State
  // -------------------------------------------------------------
  const [caseInput, setCaseInput] = useState("Transform your text case effortlessly with zero server lag.");

  const caseTransforms = useMemo(() => {
    const text = caseInput;

    const toTitleCase = (str: string) =>
      str.replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

    const toSentenceCase = (str: string) =>
      str
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    const cleanTokens = text
      .replace(/[^\w\s-]/g, "")
      .trim()
      .split(/[\s_-]+/)
      .filter(Boolean);

    const camelCase = cleanTokens
      .map((tok, i) =>
        i === 0
          ? tok.toLowerCase()
          : tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase(),
      )
      .join("");

    const pascalCase = cleanTokens
      .map((tok) => tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase())
      .join("");

    const snakeCase = cleanTokens.map((tok) => tok.toLowerCase()).join("_");
    const kebabCase = cleanTokens.map((tok) => tok.toLowerCase()).join("-");
    const constantCase = cleanTokens.map((tok) => tok.toUpperCase()).join("_");

    const alternatingCase = text
      .split("")
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join("");

    const inverseCase = text
      .split("")
      .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
      .join("");

    return [
      { name: "UPPERCASE", value: text.toUpperCase() },
      { name: "lowercase", value: text.toLowerCase() },
      { name: "Title Case", value: toTitleCase(text) },
      { name: "Sentence case", value: toSentenceCase(text) },
      { name: "camelCase", value: camelCase },
      { name: "PascalCase", value: pascalCase },
      { name: "snake_case", value: snakeCase },
      { name: "kebab-case", value: kebabCase },
      { name: "CONSTANT_CASE", value: constantCase },
      { name: "aLtErNaTiNg", value: alternatingCase },
      { name: "InVeRsE cAsE", value: inverseCase },
    ];
  }, [caseInput]);

  // -------------------------------------------------------------
  // 4. Remove Duplicate Lines State
  // -------------------------------------------------------------
  const [dupInput, setDupInput] = useState(
    "Apple\nBanana\nOrange\nApple\nGrape\nBanana\nMango\napple",
  );
  const [dupCaseSensitive, setDupCaseSensitive] = useState(false);
  const [dupTrimWhitespace, setDupTrimWhitespace] = useState(true);
  const [dupRemoveEmpty, setDupRemoveEmpty] = useState(true);

  const dupResult = useMemo(() => {
    const rawLines = dupInput.split("\n");
    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of rawLines) {
      const processed = dupTrimWhitespace ? line.trim() : line;
      if (dupRemoveEmpty && processed === "") continue;

      const compareKey = dupCaseSensitive ? processed : processed.toLowerCase();
      if (!seen.has(compareKey)) {
        seen.add(compareKey);
        uniqueLines.push(processed);
      }
    }

    return {
      output: uniqueLines.join("\n"),
      originalCount: rawLines.length,
      uniqueCount: uniqueLines.length,
      removedCount: rawLines.length - uniqueLines.length,
    };
  }, [dupInput, dupCaseSensitive, dupTrimWhitespace, dupRemoveEmpty]);

  // -------------------------------------------------------------
  // 5. Text Sorter State
  // -------------------------------------------------------------
  const [sortInput, setSortInput] = useState(
    "Zebra\nApple\n100 items\n20 items\nElephant\nBanana\n2 items\nDog",
  );
  const [sortMode, setSortMode] = useState<"az" | "za" | "lengthAsc" | "lengthDesc" | "natural" | "shuffle">("az");
  const [sortIgnoreCase, setSortIgnoreCase] = useState(true);

  const sortedOutput = useMemo(() => {
    let lines = sortInput.split("\n").filter((l) => l.trim().length > 0);

    if (sortMode === "az") {
      lines.sort((a, b) =>
        sortIgnoreCase
          ? a.toLowerCase().localeCompare(b.toLowerCase())
          : a.localeCompare(b),
      );
    } else if (sortMode === "za") {
      lines.sort((a, b) =>
        sortIgnoreCase
          ? b.toLowerCase().localeCompare(a.toLowerCase())
          : b.localeCompare(a),
      );
    } else if (sortMode === "natural") {
      lines.sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: sortIgnoreCase ? "base" : "variant" }),
      );
    } else if (sortMode === "lengthAsc") {
      lines.sort((a, b) => a.length - b.length || a.localeCompare(b));
    } else if (sortMode === "lengthDesc") {
      lines.sort((a, b) => b.length - a.length || a.localeCompare(b));
    } else if (sortMode === "shuffle") {
      // Deterministic Fisher-Yates or simple shuffle
      const copy = [...lines];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      lines = copy;
    }

    return lines.join("\n");
  }, [sortInput, sortMode, sortIgnoreCase]);

  // -------------------------------------------------------------
  // 6. Text Reverser State
  // -------------------------------------------------------------
  const [revInput, setRevInput] = useState("Hello World! UtilityClock runs fast.");
  const [revMode, setRevMode] = useState<"text" | "words" | "lettersInWord" | "upsideDown">("text");

  const reversedOutput = useMemo(() => {
    if (!revInput) return "";

    if (revMode === "text") {
      return revInput.split("").reverse().join("");
    } else if (revMode === "words") {
      return revInput.split(/\s+/).reverse().join(" ");
    } else if (revMode === "lettersInWord") {
      return revInput
        .split(" ")
        .map((w) => w.split("").reverse().join(""))
        .join(" ");
    } else if (revMode === "upsideDown") {
      return revInput
        .split("")
        .reverse()
        .map((c) => UPSIDE_DOWN_MAP[c] || c)
        .join("");
    }
    return revInput;
  }, [revInput, revMode]);

  // -------------------------------------------------------------
  // 7. Whitespace Remover State
  // -------------------------------------------------------------
  const [wsInput, setWsInput] = useState(
    "   Too    many      spaces     in   this     document.\n\n   Leading    and   trailing    tabs.\t\t",
  );
  const [wsCollapseSpaces, setWsCollapseSpaces] = useState(true);
  const [wsTrimLines, setWsTrimLines] = useState(true);
  const [wsRemoveAllSpaces, setWsRemoveAllSpaces] = useState(false);
  const [wsRemoveEmptyLines, setWsRemoveEmptyLines] = useState(true);

  const wsCleanedOutput = useMemo(() => {
    const text = wsInput;
    if (wsRemoveAllSpaces) {
      return text.replace(/\s+/g, "");
    }

    let lines = text.split("\n");
    if (wsTrimLines) {
      lines = lines.map((l) => l.trim());
    }
    if (wsCollapseSpaces) {
      lines = lines.map((l) => l.replace(/[ \t]+/g, " "));
    }
    if (wsRemoveEmptyLines) {
      lines = lines.filter((l) => l.length > 0);
    }
    return lines.join("\n");
  }, [wsInput, wsCollapseSpaces, wsTrimLines, wsRemoveAllSpaces, wsRemoveEmptyLines]);

  // -------------------------------------------------------------
  // 8. Line Break Remover State
  // -------------------------------------------------------------
  const [lbInput, setLbInput] = useState(
    "First line of thought.\nSecond line follows immediately.\nThird line completes paragraph.\n\nNew section begins here.",
  );
  const [lbDelimiter, setLbDelimiter] = useState<"space" | "comma" | "semicolon" | "custom">("space");
  const [lbCustomDelimiter, setLbCustomDelimiter] = useState(" | ");
  const [lbPreserveParagraphs, setLbPreserveParagraphs] = useState(true);

  const lbCleanedOutput = useMemo(() => {
    if (!lbInput) return "";

    let separator = " ";
    if (lbDelimiter === "comma") separator = ", ";
    if (lbDelimiter === "semicolon") separator = "; ";
    if (lbDelimiter === "custom") separator = lbCustomDelimiter;

    if (lbPreserveParagraphs) {
      const paragraphs = lbInput.split(/\n\s*\n/);
      return paragraphs
        .map((p) => p.split(/\n+/).map((line) => line.trim()).filter(Boolean).join(separator))
        .join("\n\n");
    } else {
      return lbInput
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join(separator);
    }
  }, [lbInput, lbDelimiter, lbCustomDelimiter, lbPreserveParagraphs]);

  // -------------------------------------------------------------
  // 9. Lorem Ipsum Generator State
  // -------------------------------------------------------------
  const [loremCount, setLoremCount] = useState(3);
  const [loremType, setLoremType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [loremStartWithDefault, setLoremStartWithDefault] = useState(true);
  const [loremWrapHtml, setLoremWrapHtml] = useState(false);

  const loremOutput = useMemo(() => {
    const generateSentence = (wordCount: number, isFirst: boolean) => {
      const words: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        const randIdx = Math.floor(Math.random() * LOREM_WORDS.length);
        words.push(LOREM_WORDS[randIdx]);
      }
      if (isFirst && loremStartWithDefault) {
        words[0] = "lorem";
        if (words.length > 1) words[1] = "ipsum";
        if (words.length > 2) words[2] = "dolor";
        if (words.length > 3) words[3] = "sit";
        if (words.length > 4) words[4] = "amet";
      }
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      return words.join(" ") + ".";
    };

    const count = Math.max(1, Math.min(50, Number(loremCount) || 1));

    if (loremType === "words") {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        const randIdx = Math.floor(Math.random() * LOREM_WORDS.length);
        words.push(LOREM_WORDS[randIdx]);
      }
      if (loremStartWithDefault && words.length > 0) {
        words[0] = "lorem";
        if (words.length > 1) words[1] = "ipsum";
      }
      const raw = words.join(" ");
      return loremWrapHtml ? `<p>${raw}</p>` : raw;
    }

    if (loremType === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(10 + Math.floor(Math.random() * 8), i === 0));
      }
      const raw = sentences.join(" ");
      return loremWrapHtml ? `<p>${raw}</p>` : raw;
    }

    // Paragraphs
    const paragraphs: string[] = [];
    for (let p = 0; p < count; p++) {
      const sentenceCount = 4 + Math.floor(Math.random() * 3);
      const sentences: string[] = [];
      for (let s = 0; s < sentenceCount; s++) {
        sentences.push(generateSentence(10 + Math.floor(Math.random() * 8), p === 0 && s === 0));
      }
      const paragraphText = sentences.join(" ");
      paragraphs.push(loremWrapHtml ? `<p>${paragraphText}</p>` : paragraphText);
    }

    return paragraphs.join("\n\n");
  }, [loremCount, loremType, loremStartWithDefault, loremWrapHtml]);

  // -------------------------------------------------------------
  // 10. Text Diff Checker State
  // -------------------------------------------------------------
  const [diffOriginal, setDiffOriginal] = useState(
    "UtilityClock provides fast client-side time utilities.\nAll processing happens locally.\nSupports 8 languages.",
  );
  const [diffModified, setDiffModified] = useState(
    "UtilityClock provides ultra-fast client-side utilities.\nAll processing happens locally inside the browser.\nSupports 8 languages and dark mode.",
  );

  const diffAnalysis = useMemo(() => {
    const origLines = diffOriginal.split("\n");
    const modLines = diffModified.split("\n");

    const maxLen = Math.max(origLines.length, modLines.length);
    const rows: Array<{
      lineNum: number;
      orig: string | null;
      mod: string | null;
      status: "same" | "changed" | "added" | "removed";
    }> = [];

    let addedCount = 0;
    let removedCount = 0;
    let changedCount = 0;

    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[i] !== undefined ? origLines[i] : null;
      const mod = modLines[i] !== undefined ? modLines[i] : null;

      if (orig === null && mod !== null) {
        rows.push({ lineNum: i + 1, orig: null, mod, status: "added" });
        addedCount++;
      } else if (orig !== null && mod === null) {
        rows.push({ lineNum: i + 1, orig, mod: null, status: "removed" });
        removedCount++;
      } else if (orig === mod) {
        rows.push({ lineNum: i + 1, orig, mod, status: "same" });
      } else {
        rows.push({ lineNum: i + 1, orig, mod, status: "changed" });
        changedCount++;
      }
    }

    return { rows, addedCount, removedCount, changedCount };
  }, [diffOriginal, diffModified]);

  // Tools Navigation Array
  const toolsList: Array<{
    id: TextToolSlug;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    desc: string;
  }> = [
    {
      id: "word-counter",
      name: "Word Counter",
      icon: Type,
      desc: "Live words, characters, sentences, and reading time.",
    },
    {
      id: "character-counter",
      name: "Character Counter",
      icon: Hash,
      desc: "Track Twitter, SMS, and SEO meta limits.",
    },
    {
      id: "case-converter",
      name: "Case Converter",
      icon: CaseSensitive,
      desc: "UPPER, lower, Title Case, camelCase, snake_case.",
    },
    {
      id: "remove-duplicate-lines",
      name: "Duplicate Lines",
      icon: Filter,
      desc: "Remove repeated rows and duplicate list entries.",
    },
    {
      id: "text-sorter",
      name: "Text Sorter",
      icon: ListOrdered,
      desc: "Alphabetical, numerical, or length-based sorting.",
    },
    {
      id: "text-reverser",
      name: "Text Reverser",
      icon: ArrowRightLeft,
      desc: "Reverse text, invert word order, or flip upside down.",
    },
    {
      id: "whitespace-remover",
      name: "Whitespace Cleaner",
      icon: Scissors,
      desc: "Strip redundant spaces, tabs, and trailing blanks.",
    },
    {
      id: "line-break-remover",
      name: "Line Break Remover",
      icon: AlignLeft,
      desc: "Flatten multi-line text into a single paragraph or CSV.",
    },
    {
      id: "lorem-ipsum-generator",
      name: "Lorem Ipsum",
      icon: FileText,
      desc: "Generate dummy placeholder text and HTML paragraphs.",
    },
    {
      id: "text-diff-checker",
      name: "Diff Checker",
      icon: FileSpreadsheet,
      desc: "Compare two text versions with side-by-side highlighting.",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header controls: Tool tabs */}
      {!embedOnly && (
        <div className="bg-card border rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Text & Content Utilities
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fast, 100% private in-browser text formatting, counting, sorting, and cleaning tools.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
              <Lock className="h-3 w-3" />
              <span>100% Client-Side Privacy</span>
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
                      ? "bg-indigo-600 text-white shadow-sm"
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

      {/* Main Content Card */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        {/* ========================================================================= */}
        {/* TOOL 1: Word Counter */}
        {/* ========================================================================= */}
        {currentTool === "word-counter" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Type className="h-5 w-5 text-indigo-500" />
                  Live Word & Text Counter
                </h3>
                <p className="text-xs text-muted-foreground">
                  Real-time word, character, sentence, and paragraph analytics.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWcInput(SAMPLE_TEXT)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Load Sample
                </button>
                <button
                  onClick={() => setWcInput("")}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Clear
                </button>
              </div>
            </div>

            <textarea
              rows={7}
              value={wcInput}
              onChange={(e) => setWcInput(e.target.value)}
              placeholder="Paste or write your text here..."
              className="w-full bg-background border rounded-xl p-3.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-muted/40 border rounded-xl text-center">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block">
                  {wcStats.words}
                </span>
                <span className="text-xs text-muted-foreground font-medium">Words</span>
              </div>
              <div className="p-3 bg-muted/40 border rounded-xl text-center">
                <span className="text-2xl font-black text-foreground block">
                  {wcStats.characters}
                </span>
                <span className="text-xs text-muted-foreground font-medium">Characters</span>
              </div>
              <div className="p-3 bg-muted/40 border rounded-xl text-center">
                <span className="text-2xl font-black text-foreground block">
                  {wcStats.sentences}
                </span>
                <span className="text-xs text-muted-foreground font-medium">Sentences</span>
              </div>
              <div className="p-3 bg-muted/40 border rounded-xl text-center">
                <span className="text-2xl font-black text-foreground block">
                  {wcStats.paragraphs}
                </span>
                <span className="text-xs text-muted-foreground font-medium">Paragraphs</span>
              </div>
            </div>

            {/* Detail stats & reading time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl border bg-card flex items-center gap-3">
                <Clock className="h-5 w-5 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-muted-foreground block">Reading Time</span>
                  <span className="font-bold text-foreground">
                    ~{wcStats.readingTimeMinutes} min ({wcStats.words} words at 200 wpm)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-card flex items-center gap-3">
                <Glasses className="h-5 w-5 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-muted-foreground block">Speaking Time</span>
                  <span className="font-bold text-foreground">
                    ~{wcStats.speakingTimeMinutes} min (at 130 wpm)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-card flex items-center gap-3">
                <Hash className="h-5 w-5 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-muted-foreground block">Chars (no spaces)</span>
                  <span className="font-bold text-foreground">{wcStats.charsNoSpaces}</span>
                </div>
              </div>
            </div>

            {/* Keyword Density */}
            {wcStats.keywordDensity.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Top Keyword Density
                </h4>
                <div className="flex flex-wrap gap-2">
                  {wcStats.keywordDensity.map((kw) => (
                    <span
                      key={kw.word}
                      className="px-2.5 py-1 bg-muted rounded-lg text-xs font-medium text-foreground flex items-center gap-1.5"
                    >
                      <span className="font-semibold">{kw.word}</span>
                      <span className="text-muted-foreground">
                        {kw.count}× ({kw.percent}%)
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 2: Character Counter */}
        {/* ========================================================================= */}
        {currentTool === "character-counter" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Hash className="h-5 w-5 text-indigo-500" />
                  Character Counter & Platform Limits
                </h3>
                <p className="text-xs text-muted-foreground">
                  Track character count with social media and SEO limit indicators.
                </p>
              </div>
              <button
                onClick={() => setCcInput("")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>

            <textarea
              rows={6}
              value={ccInput}
              onChange={(e) => setCcInput(e.target.value)}
              placeholder="Type or paste text to inspect character count..."
              className="w-full bg-background border rounded-xl p-3.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-card border rounded-xl text-center">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block">
                  {ccStats.totalChars}
                </span>
                <span className="text-xs text-muted-foreground">Total Characters</span>
              </div>
              <div className="p-3 bg-card border rounded-xl text-center">
                <span className="text-2xl font-black text-foreground block">
                  {ccStats.charsNoSpaces}
                </span>
                <span className="text-xs text-muted-foreground">Without Spaces</span>
              </div>
              <div className="p-3 bg-card border rounded-xl text-center">
                <span className="text-2xl font-black text-foreground block">
                  {ccStats.words}
                </span>
                <span className="text-xs text-muted-foreground">Words</span>
              </div>
              <div className="p-3 bg-card border rounded-xl text-center">
                <span className="text-2xl font-black text-foreground block">
                  {ccStats.lines}
                </span>
                <span className="text-xs text-muted-foreground">Lines</span>
              </div>
            </div>

            {/* Social limits */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Platform Limit Checkers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ccStats.limits.map((lim) => {
                  const percent = Math.min(100, Math.round((lim.count / lim.limit) * 100));
                  const isOver = lim.count > lim.limit;
                  return (
                    <div key={lim.name} className="p-3 bg-muted/30 border rounded-xl space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-foreground">{lim.name}</span>
                        <span className={isOver ? "text-destructive font-bold" : "text-muted-foreground"}>
                          {lim.count} / {lim.limit} {isOver && `(+${lim.count - lim.limit})`}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full ${isOver ? "bg-destructive" : percent > 85 ? "bg-amber-500" : "bg-indigo-600"}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 3: Case Converter */}
        {/* ========================================================================= */}
        {currentTool === "case-converter" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CaseSensitive className="h-5 w-5 text-indigo-500" />
                  Case Converter
                </h3>
                <p className="text-xs text-muted-foreground">
                  Transform text between UPPERCASE, lowercase, Title Case, camelCase, and snake_case.
                </p>
              </div>
              <button
                onClick={() => setCaseInput("")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>

            <textarea
              rows={4}
              value={caseInput}
              onChange={(e) => setCaseInput(e.target.value)}
              placeholder="Enter text to convert case..."
              className="w-full bg-background border rounded-xl p-3.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseTransforms.map((tr) => (
                <div key={tr.name} className="p-3 bg-card border rounded-xl flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-muted-foreground block">{tr.name}</span>
                    <span className="text-sm font-mono text-foreground truncate block">{tr.value || "—"}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(tr.value, `case-${tr.name}`)}
                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all shrink-0"
                    title="Copy this case"
                  >
                    {copiedKey === `case-${tr.name}` ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 4: Remove Duplicate Lines */}
        {/* ========================================================================= */}
        {currentTool === "remove-duplicate-lines" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Filter className="h-5 w-5 text-indigo-500" />
                  Remove Duplicate Lines
                </h3>
                <p className="text-xs text-muted-foreground">
                  Clean up lists by eliminating repeated rows with case and whitespace filters.
                </p>
              </div>
              <button
                onClick={() => setDupInput("")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dupCaseSensitive}
                  onChange={(e) => setDupCaseSensitive(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Case Sensitive</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dupTrimWhitespace}
                  onChange={(e) => setDupTrimWhitespace(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Trim Whitespace</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dupRemoveEmpty}
                  onChange={(e) => setDupRemoveEmpty(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remove Empty Lines</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Original Text ({dupResult.originalCount} lines)
                </label>
                <textarea
                  rows={8}
                  value={dupInput}
                  onChange={(e) => setDupInput(e.target.value)}
                  className="w-full bg-background border rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-muted-foreground">
                    Unique Cleaned Lines ({dupResult.uniqueCount} lines, {dupResult.removedCount} duplicates removed)
                  </label>
                  <button
                    onClick={() => handleCopy(dupResult.output, "dup-out")}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === "dup-out" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copiedKey === "dup-out" ? "Copied" : "Copy Result"}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={dupResult.output}
                  className="w-full bg-muted/40 border rounded-xl p-3 text-sm font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 5: Text Sorter */}
        {/* ========================================================================= */}
        {currentTool === "text-sorter" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ListOrdered className="h-5 w-5 text-indigo-500" />
                  Text & List Sorter
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sort lists alphabetically, numerically, by length, or randomly shuffle.
                </p>
              </div>
              <button
                onClick={() => setSortInput("")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>

            {/* Sort mode buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setSortMode("az")}
                className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 ${
                  sortMode === "az" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card hover:bg-muted"
                }`}
              >
                <ArrowDownAZ className="h-3.5 w-3.5" /> A → Z
              </button>
              <button
                onClick={() => setSortMode("za")}
                className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 ${
                  sortMode === "za" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card hover:bg-muted"
                }`}
              >
                <ArrowUpAZ className="h-3.5 w-3.5" /> Z → A
              </button>
              <button
                onClick={() => setSortMode("natural")}
                className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 ${
                  sortMode === "natural" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card hover:bg-muted"
                }`}
              >
                1, 2, 10 (Natural)
              </button>
              <button
                onClick={() => setSortMode("lengthAsc")}
                className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 ${
                  sortMode === "lengthAsc" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card hover:bg-muted"
                }`}
              >
                Shortest First
              </button>
              <button
                onClick={() => setSortMode("lengthDesc")}
                className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 ${
                  sortMode === "lengthDesc" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card hover:bg-muted"
                }`}
              >
                Longest First
              </button>
              <button
                onClick={() => setSortMode("shuffle")}
                className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 ${
                  sortMode === "shuffle" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card hover:bg-muted"
                }`}
              >
                <Shuffle className="h-3.5 w-3.5" /> Shuffle
              </button>
              <label className="flex items-center gap-1.5 px-2 py-1 cursor-pointer text-muted-foreground select-none">
                <input
                  type="checkbox"
                  checked={sortIgnoreCase}
                  onChange={(e) => setSortIgnoreCase(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Ignore Case</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Original List</label>
                <textarea
                  rows={8}
                  value={sortInput}
                  onChange={(e) => setSortInput(e.target.value)}
                  className="w-full bg-background border rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-muted-foreground">Sorted List</label>
                  <button
                    onClick={() => handleCopy(sortedOutput, "sort-out")}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === "sort-out" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copiedKey === "sort-out" ? "Copied" : "Copy Sorted"}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={sortedOutput}
                  className="w-full bg-muted/40 border rounded-xl p-3 text-sm font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 6: Text Reverser */}
        {/* ========================================================================= */}
        {currentTool === "text-reverser" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-indigo-500" />
                  Text & String Reverser
                </h3>
                <p className="text-xs text-muted-foreground">
                  Invert full string characters, flip words, or generate upside-down text.
                </p>
              </div>
              <button
                onClick={() => setRevInput("")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>

            {/* Reverse Mode selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setRevMode("text")}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  revMode === "text" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card hover:bg-muted"
                }`}
              >
                Reverse Entire Text
              </button>
              <button
                onClick={() => setRevMode("words")}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  revMode === "words" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card hover:bg-muted"
                }`}
              >
                Reverse Word Order
              </button>
              <button
                onClick={() => setRevMode("lettersInWord")}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  revMode === "lettersInWord" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card hover:bg-muted"
                }`}
              >
                Reverse Letters in Words
              </button>
              <button
                onClick={() => setRevMode("upsideDown")}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  revMode === "upsideDown" ? "bg-indigo-600 text-white border-indigo-600" : "bg-card hover:bg-muted"
                }`}
              >
                Upside Down (Flip)
              </button>
            </div>

            <textarea
              rows={4}
              value={revInput}
              onChange={(e) => setRevInput(e.target.value)}
              placeholder="Enter text to reverse..."
              className="w-full bg-background border rounded-xl p-3.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-muted-foreground">Transformed Result</label>
                <button
                  onClick={() => handleCopy(reversedOutput, "rev-out")}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  {copiedKey === "rev-out" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  {copiedKey === "rev-out" ? "Copied" : "Copy Output"}
                </button>
              </div>
              <textarea
                readOnly
                rows={4}
                value={reversedOutput}
                className="w-full bg-muted/40 border rounded-xl p-3.5 text-sm font-mono focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 7: Whitespace Remover */}
        {/* ========================================================================= */}
        {currentTool === "whitespace-remover" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-indigo-500" />
                  Whitespace Remover & Cleaner
                </h3>
                <p className="text-xs text-muted-foreground">
                  Strip consecutive redundant spaces, trim margins, and clean up tab indents.
                </p>
              </div>
              <button
                onClick={() => setWsInput("")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wsCollapseSpaces}
                  onChange={(e) => setWsCollapseSpaces(e.target.checked)}
                  disabled={wsRemoveAllSpaces}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Collapse Consecutive Spaces</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wsTrimLines}
                  onChange={(e) => setWsTrimLines(e.target.checked)}
                  disabled={wsRemoveAllSpaces}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Trim Line Margins</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wsRemoveEmptyLines}
                  onChange={(e) => setWsRemoveEmptyLines(e.target.checked)}
                  disabled={wsRemoveAllSpaces}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remove Empty Lines</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-amber-600 dark:text-amber-400 font-medium">
                <input
                  type="checkbox"
                  checked={wsRemoveAllSpaces}
                  onChange={(e) => setWsRemoveAllSpaces(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Remove ALL Spaces Completely</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Source Text</label>
                <textarea
                  rows={8}
                  value={wsInput}
                  onChange={(e) => setWsInput(e.target.value)}
                  className="w-full bg-background border rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-muted-foreground">Cleaned Text</label>
                  <button
                    onClick={() => handleCopy(wsCleanedOutput, "ws-out")}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === "ws-out" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copiedKey === "ws-out" ? "Copied" : "Copy Cleaned"}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={wsCleanedOutput}
                  className="w-full bg-muted/40 border rounded-xl p-3 text-sm font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 8: Line Break Remover */}
        {/* ========================================================================= */}
        {currentTool === "line-break-remover" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <AlignLeft className="h-5 w-5 text-indigo-500" />
                  Line Break Remover & Flattener
                </h3>
                <p className="text-xs text-muted-foreground">
                  Convert multi-line text into a continuous paragraph, comma-separated list, or custom delimited string.
                </p>
              </div>
              <button
                onClick={() => setLbInput("")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="font-medium text-foreground">Replace Breaks With:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="lbDelim"
                  checked={lbDelimiter === "space"}
                  onChange={() => setLbDelimiter("space")}
                />
                <span>Single Space</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="lbDelim"
                  checked={lbDelimiter === "comma"}
                  onChange={() => setLbDelimiter("comma")}
                />
                <span>Comma (, )</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="lbDelim"
                  checked={lbDelimiter === "semicolon"}
                  onChange={() => setLbDelimiter("semicolon")}
                />
                <span>Semicolon (; )</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="lbDelim"
                  checked={lbDelimiter === "custom"}
                  onChange={() => setLbDelimiter("custom")}
                />
                <span>Custom Delimiter</span>
              </label>
              {lbDelimiter === "custom" && (
                <input
                  type="text"
                  value={lbCustomDelimiter}
                  onChange={(e) => setLbCustomDelimiter(e.target.value)}
                  className="bg-background border rounded px-2 py-0.5 text-xs font-mono w-20"
                />
              )}
            </div>

            <div className="text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lbPreserveParagraphs}
                  onChange={(e) => setLbPreserveParagraphs(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Preserve Paragraphs (Keep Double Line Breaks)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Original Multi-line Text</label>
                <textarea
                  rows={8}
                  value={lbInput}
                  onChange={(e) => setLbInput(e.target.value)}
                  className="w-full bg-background border rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-muted-foreground">Flattened Output</label>
                  <button
                    onClick={() => handleCopy(lbCleanedOutput, "lb-out")}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === "lb-out" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copiedKey === "lb-out" ? "Copied" : "Copy Flattened"}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={lbCleanedOutput}
                  className="w-full bg-muted/40 border rounded-xl p-3 text-sm font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 9: Lorem Ipsum Generator */}
        {/* ========================================================================= */}
        {currentTool === "lorem-ipsum-generator" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  Lorem Ipsum Generator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Generate placeholder dummy text by paragraphs, sentences, or word counts.
                </p>
              </div>
              <button
                onClick={() => handleCopy(loremOutput, "lorem-copy")}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {copiedKey === "lorem-copy" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {copiedKey === "lorem-copy" ? "Copied" : "Copy Generated Text"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-xl border">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Count</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={loremCount}
                  onChange={(e) => setLoremCount(Number(e.target.value))}
                  className="w-full bg-background border rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Unit</label>
                <select
                  value={loremType}
                  onChange={(e) => setLoremType(e.target.value as "paragraphs" | "sentences" | "words")}
                  className="w-full bg-background border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="paragraphs">Paragraphs</option>
                  <option value="sentences">Sentences</option>
                  <option value="words">Words</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loremStartWithDefault}
                    onChange={(e) => setLoremStartWithDefault(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Start with &quot;Lorem ipsum...&quot;</span>
                </label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loremWrapHtml}
                    onChange={(e) => setLoremWrapHtml(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Wrap in &lt;p&gt; tags</span>
                </label>
              </div>
            </div>

            <textarea
              readOnly
              rows={8}
              value={loremOutput}
              className="w-full bg-background border rounded-xl p-3.5 text-sm font-normal focus:outline-none"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOL 10: Text Diff Checker */}
        {/* ========================================================================= */}
        {currentTool === "text-diff-checker" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-indigo-500" />
                  Text Diff & Comparison Checker
                </h3>
                <p className="text-xs text-muted-foreground">
                  Compare two text versions side-by-side with visual row addition and modification indicators.
                </p>
              </div>
              <button
                onClick={() => {
                  setDiffOriginal("");
                  setDiffModified("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
            </div>

            {/* Inputs side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Original Text (Version A)</label>
                <textarea
                  rows={6}
                  value={diffOriginal}
                  onChange={(e) => setDiffOriginal(e.target.value)}
                  className="w-full bg-background border rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Modified Text (Version B)</label>
                <textarea
                  rows={6}
                  value={diffModified}
                  onChange={(e) => setDiffModified(e.target.value)}
                  className="w-full bg-background border rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Diff Summary Badge */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="text-muted-foreground">Changes detected:</span>
              <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                +{diffAnalysis.addedCount} Added
              </span>
              <span className="text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                -{diffAnalysis.removedCount} Removed
              </span>
              <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                ~{diffAnalysis.changedCount} Modified
              </span>
            </div>

            {/* Side by side diff table */}
            <div className="border rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead className="bg-muted text-muted-foreground sticky top-0">
                  <tr>
                    <th className="p-2 w-10 text-center">#</th>
                    <th className="p-2 w-1/2 text-left">Version A (Original)</th>
                    <th className="p-2 w-1/2 text-left">Version B (Modified)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {diffAnalysis.rows.map((row) => {
                    const isChanged = row.status === "changed";
                    const isAdded = row.status === "added";
                    const isRemoved = row.status === "removed";

                    return (
                      <tr
                        key={row.lineNum}
                        className={
                          isAdded
                            ? "bg-emerald-500/10"
                            : isRemoved
                            ? "bg-destructive/10"
                            : isChanged
                            ? "bg-amber-500/10"
                            : "hover:bg-muted/20"
                        }
                      >
                        <td className="p-2 text-center text-muted-foreground select-none">
                          {row.lineNum}
                        </td>
                        <td className="p-2 text-foreground break-all">
                          {row.orig !== null ? (
                            <span className={isRemoved ? "text-destructive line-through" : ""}>
                              {row.orig || " "}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">—</span>
                          )}
                        </td>
                        <td className="p-2 text-foreground break-all">
                          {row.mod !== null ? (
                            <span className={isAdded ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}>
                              {row.mod || " "}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
