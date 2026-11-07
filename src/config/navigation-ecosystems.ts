import type { AppLocale } from "@/i18n/config";

export type EcosystemId =
  | "general-tools"
  | "hindu-calendar"
  | "gujarati-calendar"
  | "panchang"
  | "festivals"
  | "devotional"
  | "astrology"
  | "love-tools";

export type NavItem = {
  id: string;
  label: Record<AppLocale, string>;
  href: string;
  badge?: string;
};

export type EcosystemConfig = {
  id: EcosystemId;
  name: Record<AppLocale, string>;
  tagline: Record<AppLocale, string>;
  accentColor: string; // Tailwind color class
  badgeBg: string;
  primaryPath: string;
  secondaryNav: NavItem[];
  footerSections: {
    title: Record<AppLocale, string>;
    links: { label: Record<AppLocale, string>; href: string }[];
  }[];
  relatedEcosystems: EcosystemId[];
};

/**
 * Ecosystem configurations for dynamic navigation, secondary sub-bars,
 * contextual footers, and internal linking engines.
 */
export const ECOSYSTEMS: Record<EcosystemId, EcosystemConfig> = {
  "general-tools": {
    id: "general-tools",
    name: {
      en: "General Tools & Clocks",
      de: "Allgemeine Werkzeuge & Uhren",
      fr: "Outils généraux et Horloges",
      ja: "一般ツールと時計",
      es: "Herramientas Generales y Relojes",
      pt: "Ferramentas Gerais e Relógios",
      ar: "الأدوات العامة والساعات",
      hi: "सामान्य टूल्स और घड़ियाँ", gu: "સામાન્ય ટૂલ્સ અને ઘડિયાળો",
    },
    tagline: {
      en: "Precise browser-based clocks, countdowns, financial calculators, and unit converters.",
      de: "Präzise Browser-Uhren, Countdowns, Finanzrechner und Einheitenumrechner.",
      fr: "Horloges précises, compteurs, calculatrices financières et convertisseurs.",
      ja: "高精度なブラウザ時計、カウントダウン、金融計算機、単位変換ツール。",
      es: "Relojes precisos, temporizadores, calculadoras financieras y conversores.",
      pt: "Relógios precisos, cronômetros, calculadoras financeiras e conversores.",
      ar: "ساعات متصفح دقيقة، مؤقتات تنازلية، حاسبات مالية ومحولات وحدات.",
      hi: "सटीक ऑनलाइन घड़ियाँ, काउंटडाउन, वित्तीय कैलकुलेटर और इकाई कनवर्टर।", gu: "ચોક્કસ ઓનલાઇન ઘડિયાળો, કાઉન્ટડાઉન, નાણાકીય કેલ્ક્યુલેટર અને એકમ કન્વર્ટર.",
    },
    accentColor: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    primaryPath: "",
    secondaryNav: [
      { id: "alarm", label: { en: "Alarm", de: "Wecker", fr: "Alarme", ja: "アラーム", es: "Alarma", pt: "Alarme", ar: "المنبه", hi: "अलार्म", gu: "અલાર્મ" }, href: "/alarm" },
      { id: "timer", label: { en: "Timer", de: "Timer", fr: "Minuteur", ja: "タイマー", es: "Temporizador", pt: "Temporizador", ar: "المؤقت", hi: "टाइमर", gu: "ટાઈમર" }, href: "/timer" },
      { id: "stopwatch", label: { en: "Stopwatch", de: "Stoppuhr", fr: "Chronomètre", ja: "ストップウォッチ", es: "Cronómetro", pt: "Cronômetro", ar: "ساعة الإيقاف", hi: "स्टॉपवॉच", gu: "સ્ટોપવોચ" }, href: "/stopwatch" },
      { id: "world-clock", label: { en: "World Clock", de: "Weltzeit", fr: "Horloge Mondiale", ja: "世界時計", es: "Reloj Mundial", pt: "Relógio Mundial", ar: "الساعة العالمية", hi: "विश्व घड़ी", gu: "વિશ્વ ઘડિયાળ" }, href: "/world-clock" },
      { id: "date-calendar", label: { en: "Date & Calendar", de: "Datum & Kalender", fr: "Date & Calendrier", ja: "日付とカレンダー", es: "Fecha y Calendario", pt: "Data e Calendário", ar: "التاريخ والتقويم", hi: "तारीख व कैलेंडर", gu: "તારીખ અને કેલેન્ડર" }, href: "/date-calendar" },
      { id: "calculators", label: { en: "Calculators", de: "Rechner", fr: "Calculatrices", ja: "計算機", es: "Calculadoras", pt: "Calculadoras", ar: "الحاسبات", hi: "कैलकुलेटर", gu: "કેલ્ક્યુલેટર" }, href: "/calculators" },
      { id: "productivity", label: { en: "Productivity", de: "Produktivität", fr: "Productivité", ja: "生産性", es: "Productividad", pt: "Produtividade", ar: "الإنتاجية", hi: "उत्पादकता", gu: "ઉત્પાદકતા" }, href: "/productivity" },
      { id: "converters", label: { en: "Converters", de: "Umrechner", fr: "Convertisseurs", ja: "単位変換", es: "Conversores", pt: "Conversores", ar: "المحولات", hi: "इकाई कनवर्टर", gu: "એકમ કન્વર્ટર" }, href: "/converters" },
      { id: "finance", label: { en: "Finance", de: "Finanzen", fr: "Finance", ja: "金融計算", es: "Finanzas", pt: "Finanças", ar: "المالية", hi: "फाइनेंस कैलकुलेटर", gu: "ફાઇનાન્સ કેલ્ક્યુલેટર" }, href: "/finance" },
      { id: "text", label: { en: "Text Tools", de: "Textwerkzeuge", fr: "Outils de texte", ja: "テキストツール", es: "Herramientas de Texto", pt: "Ferramentas de Texto", ar: "أدوات النصوص", hi: "टेक्स्ट टूल्स", gu: "ટેક્સ્ટ ટૂલ્સ" }, href: "/text" },
    ],
    footerSections: [
      {
        title: { en: "Clocks & Timing", de: "Uhren & Zeit", fr: "Horloges & Temps", ja: "時計とタイミング", es: "Relojes y Tiempos", pt: "Relógios e Tempo", ar: "الساعات والتوقيت", hi: "घड़ियाँ और टाइमिंग", gu: "ઘડિયાળ અને ટાઈમિંગ" },
        links: [
          { label: { en: "Online Alarm Clock", de: "Online Wecker", fr: "Réveil en ligne", ja: "オンラインアラーム", es: "Alarma Online", pt: "Alarme Online", ar: "منبه أونلاين", hi: "ऑनलाइन अलार्म घड़ी", gu: "ઓનલાઇન અલાર્મ ઘડિયાળ" }, href: "/alarm" },
          { label: { en: "Countdown Timer", de: "Countdown Timer", fr: "Compte à rebours", ja: "カウントダウンタイマー", es: "Temporizador", pt: "Temporizador", ar: "مؤقت العد التنازلي", hi: "काउंटडाउन टाइमर", gu: "કાઉન્ટડાઉન ટાઈમર" }, href: "/timer" },
          { label: { en: "Precision Stopwatch", de: "Präzisions-Stoppuhr", fr: "Chronomètre précis", ja: "精密ストップウォッチ", es: "Cronómetro de Precisión", pt: "Cronômetro Preciso", ar: "ساعة إيقاف دقيقة", hi: "सटीक स्टॉपवॉच", gu: "ચોક્કસ સ્ટોપવોચ" }, href: "/stopwatch" },
          { label: { en: "World Clock Hub", de: "Weltzeituhr", fr: "Horloge mondiale", ja: "世界時計ハブ", es: "Reloj Mundial", pt: "Relógio Mundial", ar: "مركز الساعة العالمية", hi: "विश्व घड़ी हब", gu: "વિશ્વ ઘડિયાળ હબ" }, href: "/world-clock" },
        ],
      },
      {
        title: { en: "Calculators & Math", de: "Rechner & Mathe", fr: "Calculatrices", ja: "計算機と数学", es: "Calculadoras", pt: "Calculadoras", ar: "الحاسبات والرياضيات", hi: "कैलकुलेटर और गणित", gu: "કેલ્ક્યુલેટર અને ગણિત" },
        links: [
          { label: { en: "Percentage Calculator", de: "Prozentrechner", fr: "Calculateur de pourcentage", ja: "パーセント計算機", es: "Calculadora de Porcentajes", pt: "Calculadora de Porcentagem", ar: "حاسبة النسبة المئوية", hi: "प्रतिशत कैलकुलेटर", gu: "ટકાવારી કેલ્ક્યુલેટર" }, href: "/calculators/percentage-calculator" },
          { label: { en: "Age Calculator", de: "Altersrechner", fr: "Calculateur d'âge", ja: "年齢計算機", es: "Calculadora de Edad", pt: "Calculadora de Idade", ar: "حاسبة العمر", hi: "आयु कैलकुलेटर", gu: "ઉંમર કેલ્ક્યુલેટર" }, href: "/date-calendar/age-calculator" },
          { label: { en: "Business Days Calculator", de: "Arbeitstage-Rechner", fr: "Jours ouvrés", ja: "営業日計算機", es: "Días Laborables", pt: "Dias Úteis", ar: "حاسبة أيام العمل", hi: "कार्य दिवस कैलकुलेटर", gu: "કાર્યકારી દિવસો કેલ્ક્યુલેટર" }, href: "/date-calendar/business-days-calculator" },
          { label: { en: "Loan EMI Calculator", de: "Kreditrechner", fr: "Calculateur de prêt", ja: "ローンEMI計算機", es: "Calculadora de Préstamos", pt: "Calculadora de Empréstimo", ar: "حاسبة أقساط القروض", hi: "ऋण ईएमआई कैलकुलेटर", gu: "લોન EMI કેલ્ક્યુલેટર" }, href: "/finance/loan-emi-calculator" },
        ],
      },
      {
        title: { en: "Converters & Content", de: "Umrechner & Inhalt", fr: "Convertisseurs & Contenu", ja: "変換とコンテンツ", es: "Conversores y Contenido", pt: "Conversores e Conteúdo", ar: "المحولات والمحتوى", hi: "कन्वर्टर और कंटेंट", gu: "કન્વર્ટર અને કન્ટેન્ટ" },
        links: [
          { label: { en: "Area Converter", de: "Flächenumrechner", fr: "Convertisseur de surface", ja: "面積変換", es: "Conversor de Área", pt: "Conversor de Área", ar: "محول المساحة", hi: "क्षेत्रफल कनवर्टर", gu: "ક્ષેત્રફળ કન્વર્ટર" }, href: "/converters/area-converter" },
          { label: { en: "Data Storage Converter", de: "Datenspeicher", fr: "Stockage de données", ja: "データ容量変換", es: "Conversor de Almacenamiento", pt: "Armazenamento de Dados", ar: "محول سعة التخزين", hi: "डेटा स्टोरेज कनवर्टर", gu: "ડેટા સ્ટોરેજ કન્વર્ટર" }, href: "/converters/data-storage-converter" },
          { label: { en: "Word Counter Online", de: "Wortzähler", fr: "Compteur de mots", ja: "文字数カウント", es: "Contador de Palabras", pt: "Contador de Palavras", ar: "عداد الكلمات", hi: "शब्द काउंटर", gu: "શબ્દ કાઉન્ટર" }, href: "/text/word-counter" },
          { label: { en: "Text Diff Checker", de: "Textvergleich", fr: "Comparateur de texte", ja: "テキスト差分チェッカー", es: "Comparador de Texto", pt: "Comparador de Texto", ar: "فاحص الفروق النصية", hi: "टेक्स्ट तुलना टूल", gu: "ટેક્સ્ટ તુલના ટૂલ" }, href: "/text/text-diff-checker" },
        ],
      },
    ],
    relatedEcosystems: ["hindu-calendar", "panchang", "festivals", "love-tools"],
  },

  "hindu-calendar": {
    id: "hindu-calendar",
    name: {
      en: "Hindu Calendar",
      de: "Hindukalender",
      fr: "Calendrier hindou",
      ja: "ヒンドゥー暦",
      es: "Calendario Hindú",
      pt: "Calendário Hindu",
      ar: "التقويم الهندوسي",
      hi: "हिन्दू पंचांग व कैलेंडर", gu: "હિન્દુ પંચાંગ અને કેલેન્ડર",
    },
    tagline: {
      en: "Traditional Hindu lunisolar calendar with Vikram Samvat, Tithi, Vrat, and festival dates.",
      de: "Traditioneller lunisolarer Hindukalender mit Vikram Samvat, Tithi, Vrat und Feiertagen.",
      fr: "Calendrier luni-solaire traditionnel avec Vikram Samvat, Tithi, Vrat et fêtes.",
      ja: "ヴィクラム暦、ティティ、ヴラト、祭礼日程を網羅した伝統的ヒンドゥー太陰太陽暦。",
      es: "Calendario lunisolar tradicional con Vikram Samvat, Tithi, Vrat y festividades.",
      pt: "Calendário lunissolar tradicional com Vikram Samvat, Tithi, Vrat e festivais.",
      ar: "التقويم الهندوسي القمري الشمسي التقليدي مع تواريخ تيتي، فرات، والأعياد.",
      hi: "विक्रम संवत, तिथि, व्रत, पर्व और त्योहारों की सटीक जानकारी वाला प्रामाणिक हिन्दू कैलेंडर।", gu: "વિક્રમ સંવત, તિથિ, વ્રત, પર્વ અને તહેવારો સાથે પરંપરાગત હિન્દુ કેલેન્ડર.",
    },
    accentColor: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    primaryPath: "/calendar/hindu-calendar",
    secondaryNav: [
      { id: "overview", label: { en: "Hindu Calendar", de: "Hindukalender", fr: "Calendrier hindou", ja: "ヒンドゥー暦", es: "Calendario Hindú", pt: "Calendário Hindu", ar: "التقويم الهندوسي", hi: "हिन्दू कैलेंडर", gu: "હિન્દુ કેલેન્ડર" }, href: "/calendar/hindu-calendar" },
      { id: "monthly", label: { en: "Monthly Calendar", de: "Monatskalender", fr: "Calendrier mensuel", ja: "月別カレンダー", es: "Calendario Mensual", pt: "Calendário Mensal", ar: "التقويم الشهري", hi: "मासिक पंचांग", gu: "માસિક પંચાંગ" }, href: "/calendar/hindu-calendar#monthly" },
      { id: "yearly", label: { en: "Yearly Calendar", de: "Jahreskalender", fr: "Calendrier annuel", ja: "年間カレンダー", es: "Calendario Anual", pt: "Calendário Anual", ar: "التقويم السنوي", hi: "वार्षिक कैलेंडर", gu: "વાર્ષિક કેલેન્ડર" }, href: "/calendar/hindu-calendar#yearly" },
      { id: "today", label: { en: "Today", de: "Heute", fr: "Aujourd'hui", ja: "今日", es: "Hoy", pt: "Hoje", ar: "اليوم", hi: "आज का पंचांग", gu: "આજનું પંચાંગ" }, href: "/panchang#today" },
      { id: "panchang", label: { en: "Panchang", de: "Panchang", fr: "Panchang", ja: "パンチャング", es: "Panchang", pt: "Panchang", ar: "بانتشانغ", hi: "पंचांग", gu: "પંચાંગ" }, href: "/panchang" },
      { id: "tithi", label: { en: "Tithi", de: "Tithi", fr: "Tithi", ja: "ティティ", es: "Tithi", pt: "Tithi", ar: "تيتي", hi: "तिथि", gu: "તિથિ" }, href: "/panchang#tithi" },
      { id: "festivals", label: { en: "Festivals", de: "Feste", fr: "Festivals", ja: "祭り", es: "Festivales", pt: "Festivais", ar: "المهرجانات", hi: "त्योहार", gu: "તહેવારો" }, href: "/festivals#hindu" },
      { id: "vrat", label: { en: "Vrat & Upvas", de: "Vrat", fr: "Jeûnes Vrat", ja: "ヴラト（断食）", es: "Vrat y Ayunos", pt: "Vrat e Jejuns", ar: "أيام الصيام", hi: "व्रत व उपवास", gu: "વ્રત અને ઉપવાસ" }, href: "/calendar/hindu-calendar#vrat" },
      { id: "muhurat", label: { en: "Muhurat", de: "Muhurat", fr: "Muhurat", ja: "ムフラト吉時", es: "Muhurat", pt: "Muhurat", ar: "المواقيت الميمونة", hi: "शुभ मुहूर्त", gu: "શુભ મુહૂર્ત" }, href: "/panchang#muhurat" },
    ],
    footerSections: [
      {
        title: { en: "Calendar Years", de: "Kalenderjahre", fr: "Années civiles", ja: "暦年", es: "Años del Calendario", pt: "Anos do Calendário", ar: "سنوات التقويم", hi: "कैलेंडर वर्ष", gu: "કેલેન્ડર વર્ષ" },
        links: [
          { label: { en: "Hindu Calendar 2026", de: "Hindukalender 2026", fr: "Calendrier hindou 2026", ja: "ヒンドゥー暦 2026", es: "Calendario Hindú 2026", pt: "Calendário Hindu 2026", ar: "التقويم الهندوسي 2026", hi: "हिन्दू कैलेंडर 2026", gu: "હિન્દુ કેલેન્ડર 2026" }, href: "/calendar/hindu-calendar" },
          { label: { en: "Hindu Calendar 2027", de: "Hindukalender 2027", fr: "Calendrier hindou 2027", ja: "ヒンドゥー暦 2027", es: "Calendario Hindú 2027", pt: "Calendário Hindu 2027", ar: "التقويم الهندوسي 2027", hi: "हिन्दू कैलेंडर 2027", gu: "હિન્દુ કેલેન્ડર 2027" }, href: "/calendar/hindu-calendar-2027" },
          { label: { en: "Vikram Samvat 2082–2083", de: "Vikram Samvat 2082–2083", fr: "Vikram Samvat 2082–2083", ja: "ヴィクラム暦 2082–2083", es: "Vikram Samvat 2082–2083", pt: "Vikram Samvat 2082–2083", ar: "فيكرام سامفات 2082–2083", hi: "विक्रम संवत 2082–2083", gu: "વિક્રમ સંવત 2082–2083" }, href: "/calendar/hindu-calendar" },
          { label: { en: "Vikram Samvat 2083–2084", de: "Vikram Samvat 2083–2084", fr: "Vikram Samvat 2083–2084", ja: "ヴィクラム暦 2083–2084", es: "Vikram Samvat 2083–2084", pt: "Vikram Samvat 2083–2084", ar: "فيكرام سامفات 2083–2084", hi: "विक्रम संवत 2083–2084", gu: "વિક્રમ સંવત 2083–2084" }, href: "/calendar/hindu-calendar-2027" },
        ],
      },
      {
        title: { en: "Sacred Observances", de: "Heilige Feste", fr: "Fêtes sacrées", ja: "宗教儀礼", es: "Celebraciones Sagradas", pt: "Celebrações Sagradas", ar: "المناسبات المقدسة", hi: "पवित्र व्रत एवं उपवास", gu: "પવિત્ર વ્રત અને ઉપવાસ" },
        links: [
          { label: { en: "Ekadashi 2027 Dates", de: "Ekadashi 2027 Termine", fr: "Dates d'Ekadashi 2027", ja: "エーカーダシー2027年", es: "Fechas de Ekadashi 2027", pt: "Datas de Ekadashi 2027", ar: "تواريخ إيكاداشي 2027", hi: "एकादशी 2027 तिथियाँ", gu: "એકાદશી 2027 તારીખો" }, href: "/calendar/ekadashi-2027" },
          { label: { en: "Purnima 2027 Dates", de: "Purnima 2027 Termine", fr: "Dates de Purnima 2027", ja: "満月2027年日程", es: "Fechas de Purnima 2027", pt: "Datas de Purnima 2027", ar: "تواريخ بورنيما 2027", hi: "पूर्णिमा 2027 तिथियाँ", gu: "પૂર્ણિમા 2027 તારીખો" }, href: "/calendar/purnima-2027" },
          { label: { en: "Amavasya 2027 Dates", de: "Amavasya 2027 Termine", fr: "Dates d'Amavasya 2027", ja: "新月2027年日程", es: "Fechas de Amavasya 2027", pt: "Datas de Amavasya 2027", ar: "تواريخ أمافاسيا 2027", hi: "अमावस्या 2027 तिथियाँ", gu: "અમાવસ્યા 2027 તારીખો" }, href: "/calendar/amavasya-2027" },
        ],
      },
      {
        title: { en: "Regional Calendars", de: "Regionale Kalender", fr: "Calendriers régionaux", ja: "地域別カレンダー", es: "Calendarios Regionales", pt: "Calendários Regionais", ar: "التقاويم الإقليمية", hi: "क्षेत्रीय पंचांग", gu: "પ્રાદેશિક પંચાંગ" },
        links: [
          { label: { en: "Gujarati Calendar 2027", de: "Gujarati-Kalender 2027", fr: "Calendrier gujarati 2027", ja: "グジャラート暦 2027", es: "Calendario Gujarati 2027", pt: "Calendário Gujarati 2027", ar: "التقويم الغوجاراتي 2027", hi: "गुजराती कैलेंडर 2027", gu: "ગુજરાતી કેલેન્ડર 2027" }, href: "/calendar/gujarati-calendar-2027" },
          { label: { en: "Panchang & Muhurat", de: "Panchang & Muhurat", fr: "Panchang & Muhurat", ja: "パンチャングとムフラト", es: "Panchang y Muhurat", pt: "Panchang e Muhurat", ar: "البانتشانغ والمواقيت", hi: "दैनिक पंचांग व मुहूर्त", gu: "દૈનિક પંચાંગ અને મુહૂર્ત" }, href: "/panchang" },
          { label: { en: "Major Hindu Festivals", de: "Hindu-Feste", fr: "Grandes fêtes hindoues", ja: "主要ヒンドゥー祭礼", es: "Festivales Hindúes", pt: "Festivais Hindus", ar: "المهرجانات الهندوسية", hi: "प्रमुख हिन्दू त्योहार", gu: "મુખ્ય હિન્દુ તહેવારો" }, href: "/festivals/hindu-festivals-2027" },
        ],
      },
    ],
    relatedEcosystems: ["gujarati-calendar", "panchang", "festivals", "devotional", "astrology"],
  },

  "gujarati-calendar": {
    id: "gujarati-calendar",
    name: {
      en: "Gujarati Calendar",
      de: "Gujarati-Kalender",
      fr: "Calendrier gujarati",
      ja: "グジャラート暦",
      es: "Calendario Gujarati",
      pt: "Calendário Gujarati",
      ar: "التقويم الغوجاراتي",
      hi: "गुजराती कैलेंडर (ગુજરાતી પંચાંગ)", gu: "ગુજરાતી કેલેન્ડર (ગુજરાતી પંચાંગ)",
    },
    tagline: {
      en: "Authentic Gujarati Vikram Samvat calendar with Choghadiya, Tithi, Gujarati months, and regional festivals.",
      de: "Authentischer Gujarati Vikram Samvat Kalender mit Choghadiya, Tithi und Festen.",
      fr: "Calendrier Gujarati Vikram Samvat avec Choghadiya, Tithi et fêtes traditionnelles.",
      ja: "チョガディヤ、ティティ、グジャラート月名、伝統祭礼を掲載した本格グジャラート暦。",
      es: "Auténtico calendario Gujarati Vikram Samvat con Choghadiya, Tithi y festividades.",
      pt: "Autêntico calendário Gujarati Vikram Samvat com Choghadiya, Tithi e festivais.",
      ar: "التقويم الغوجاراتي الأصيل مع الشوغاديا وتيتي والمهرجانات الإقليمية.",
      hi: "ચોઘડિયા, તિથિ, ગુજરાતી મહિના અને વ્રત-તહેવારો સાથે પ્રામાણિક ગુજરાતી કેલેન્ડર।", gu: "ચોઘડિયા, તિથિ, ગુજરાતી મહિના અને વ્રત-તહેવારો સાથે પ્રામાણિક ગુજરાતી કેલેન્ડર.",
    },
    accentColor: "text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
    primaryPath: "/calendar/gujarati-calendar",
    secondaryNav: [
      { id: "overview", label: { en: "Gujarati Calendar", de: "Gujarati-Kalender", fr: "Calendrier gujarati", ja: "グジャラート暦", es: "Calendario Gujarati", pt: "Calendário Gujarati", ar: "التقويم الغوجاراتي", hi: "ગુજરાતી કેલેન્ડર", gu: "ગુજરાતી કેલેન્ડર" }, href: "/calendar/gujarati-calendar" },
      { id: "gujarati-2027", label: { en: "Gujarati 2027", de: "Gujarati 2027", fr: "Gujarati 2027", ja: "グジャラート2027", es: "Gujarati 2027", pt: "Gujarati 2027", ar: "غوجاراتي 2027", hi: "गुजराती 2027", gu: "ગુજરાતી 2027" }, href: "/calendar/gujarati-calendar-2027" },
      { id: "months", label: { en: "Gujarati Months", de: "Gujarati-Monate", fr: "Mois gujaratis", ja: "グジャラート月名", es: "Meses Gujaratis", pt: "Meses Gujaratis", ar: "الشهور الغوجاراتية", hi: "ગુજરાતી મહિના", gu: "ગુજરાતી મહિના" }, href: "/calendar/gujarati-calendar#months" },
      { id: "panchang", label: { en: "Gujarati Panchang", de: "Gujarati-Panchang", fr: "Panchang gujarati", ja: "グジャラート・パンチャング", es: "Panchang Gujarati", pt: "Panchang Gujarati", ar: "بانتشانغ غوجاراتي", hi: "ગુજરાતી પંચાંગ", gu: "ગુજરાતી પંચાંગ" }, href: "/panchang#gujarati" },
      { id: "festivals", label: { en: "Gujarati Festivals", de: "Gujarati-Feste", fr: "Fêtes gujaraties", ja: "グジャラート祭礼", es: "Festividades Gujaratis", pt: "Festivais Gujaratis", ar: "المهرجانات الغوجاراتية", hi: "ગુજરાતી તહેવારો", gu: "ગુજરાતી તહેવારો" }, href: "/festivals/gujarati-festivals-2027" },
      { id: "vrat", label: { en: "Gujarati Vrat", de: "Gujarati-Vrat", fr: "Vrat gujaratis", ja: "グジャラート断食日", es: "Vrat Gujarati", pt: "Vrat Gujarati", ar: "صيام غوجاراتي", hi: "ગુજરાતી વ્રત કથા", gu: "ગુજરાતી વ્રત કથા" }, href: "/calendar/gujarati-calendar#vrat" },
    ],
    footerSections: [
      {
        title: { en: "Gujarati Months (મહિના)", de: "Gujarati-Monate", fr: "Mois gujaratis", ja: "グジャラート暦の月", es: "Meses Gujaratis", pt: "Meses Gujaratis", ar: "الأشهر الغوجاراتية", hi: "ગુજરાતી મહિના (Months)", gu: "ગુજરાતી મહિના (Months)" },
        links: [
          { label: { en: "Kartak & Magshar", de: "Kartak & Magshar", fr: "Kartak & Magshar", ja: "カルタク＆マグシャル", es: "Kartak y Magshar", pt: "Kartak e Magshar", ar: "كارتاك وماغشار", hi: "કારતક અને માગશર", gu: "કારતક અને માગશર" }, href: "/calendar/gujarati-calendar#kartak" },
          { label: { en: "Maha & Fagun", de: "Maha & Fagun", fr: "Maha & Fagun", ja: "マハ＆ファグン", es: "Maha y Fagun", pt: "Maha e Fagun", ar: "ماها وفاغون", hi: "મહા અને ફાગણ", gu: "મહા અને ફાગણ" }, href: "/calendar/gujarati-calendar#fagun" },
          { label: { en: "Shravan & Bhadarvo", de: "Shravan & Bhadarvo", fr: "Shravan & Bhadarvo", ja: "シュラヴァン＆バーダルヴォ", es: "Shravan y Bhadarvo", pt: "Shravan e Bhadarvo", ar: "شرافان وبهادارفو", hi: "શ્રાવણ અને ભાદરવો", gu: "શ્રાવણ અને ભાદરવો" }, href: "/calendar/gujarati-calendar#shravan" },
        ],
      },
      {
        title: { en: "Festivals & Auspicious Days", de: "Feste & Glückstage", fr: "Fêtes et jours fastes", ja: "祝祭日と吉日", es: "Festivales y Días Auspiciosos", pt: "Festivais e Dias Auspiciosos", ar: "المهرجانات والأيام المباركة", hi: "મુખ્ય પર્વ અને તહેવારો", gu: "મુખ્ય પર્વ અને તહેવારો" },
        links: [
          { label: { en: "Bestu Varas (New Year)", de: "Bestu Varas", fr: "Bestu Varas (Nouvel An)", ja: "ベスツ・ヴァラス（正月）", es: "Bestu Varas (Año Nuevo)", pt: "Bestu Varas (Ano Novo)", ar: "بيستو فاراس (رأس السنة)", hi: "બેસતું વર્ષ (નૂતન વર્ષ)", gu: "બેસતું વર્ષ (નૂતન વર્ષ)" }, href: "/festivals#bestu-varas" },
          { label: { en: "Labh Pancham & Dev Diwali", de: "Labh Pancham", fr: "Labh Pancham", ja: "ラーブ・パンチャム", es: "Labh Pancham", pt: "Labh Pancham", ar: "لابه بانشام", hi: "લાભ પાંચમ અને દેવ દિવાળી", gu: "લાભ પાંચમ અને દેવ દિવાળી" }, href: "/festivals#labh-pancham" },
          { label: { en: "Uttarayan & Makar Sankranti", de: "Uttarayan", fr: "Uttarayan", ja: "ウッタラヤン", es: "Uttarayan", pt: "Uttarayan", ar: "أوتارايان", hi: "ઉત્તરાયણ પતંગોત્સવ", gu: "ઉત્તરાયણ પતંગોત્સવ" }, href: "/festivals#uttarayan" },
        ],
      },
      {
        title: { en: "Choghadiya & Muhurat", de: "Choghadiya & Muhurat", fr: "Choghadiya & Muhurat", ja: "チョガディヤと吉時", es: "Choghadiya y Muhurat", pt: "Choghadiya e Muhurat", ar: "الشوغاديا والمواقيت", hi: "ચોઘડિયા અને મુહૂર્ત", gu: "ચોઘડિયા અને મુહૂર્ત" },
        links: [
          { label: { en: "Day & Night Choghadiya", de: "Tag & Nacht Choghadiya", fr: "Choghadiya Jour et Nuit", ja: "昼夜チョガディヤ", es: "Choghadiya de Día y Noche", pt: "Choghadiya Dia e Noite", ar: "شوغاديا النهار والليل", hi: "દિવસ અને રાત્રિના ચોઘડિયા", gu: "દિવસ અને રાત્રિના ચોઘડિયા" }, href: "/panchang#choghadiya" },
          { label: { en: "Amrit, Shubh, Labh Timings", de: "Gute Zeiten", fr: "Heures propices", ja: "吉兆時間帯", es: "Horarios Propicios", pt: "Horários Propícios", ar: "أوقات البركة", hi: "અમૃત, શુભ અને લાભ મુહૂર્ત", gu: "અમૃત, શુભ અને લાભ મુહૂર્ત" }, href: "/panchang#choghadiya-auspicious" },
          { label: { en: "Full Hindu Calendar", de: "Vollständiger Hindukalender", fr: "Calendrier hindou complet", ja: "完全ヒンドゥー暦", es: "Calendario Hindú Completo", pt: "Calendário Hindu Completo", ar: "التقويم الهندوسي الكامل", hi: "સંપૂર્ણ હિન્દુ પંચાંગ", gu: "સંપૂર્ણ હિન્દુ પંચાંગ" }, href: "/calendar/hindu-calendar" },
        ],
      },
    ],
    relatedEcosystems: ["hindu-calendar", "panchang", "festivals", "devotional"],
  },

  panchang: {
    id: "panchang",
    name: {
      en: "Daily Vedic Panchang",
      de: "Tägliches Panchang",
      fr: "Panchang védique quotidien",
      ja: "ヴェーダ・パンチャング",
      es: "Panchang Védico Diario",
      pt: "Panchang Védico Diário",
      ar: "البانتشانغ الفيدي اليومي",
      hi: "दैनिक वैदिक पंचांग", gu: "દૈનિક વૈદિક પંચાંગ",
    },
    tagline: {
      en: "Real-time Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, and Choghadiya calculations based on solar-lunar positions.",
      de: "Echtzeit-Berechnungen für Tithi, Nakshatra, Yoga, Karana, Rahu Kaal und Choghadiya.",
      fr: "Calculs en direct de Tithi, Nakshatra, Yoga, Karana, Rahu Kaal et Choghadiya.",
      ja: "太陽と月の運行に基づくティティ、ナクシャトラ、ヨガ、カラナ、ラーフ・カール、チョガディヤのリアルタイム計算。",
      es: "Cálculos en tiempo real de Tithi, Nakshatra, Yoga, Karana, Rahu Kaal y Choghadiya.",
      pt: "Cálculos em tempo real de Tithi, Nakshatra, Yoga, Karana, Rahu Kaal e Choghadiya.",
      ar: "حسابات دقيقة وفورية لتيتي، ناكشاترا، يوغا، كارانا، راهو كال، وشوغاديا.",
      hi: "सूर्य-चंद्रमा की स्थिति पर आधारित प्रामाणिक तिथि, नक्षत्र, योग, करण, राहुकाल और चौघड़िया।", gu: "સૂર્ય-ચંદ્રની સ્થિતિ પર આધારિત પ્રમાણિક તિથિ, નક્ષત્ર, યોગ, કરણ, રાહુકાળ અને ચોઘડિયા.",
    },
    accentColor: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
    primaryPath: "/panchang",
    secondaryNav: [
      { id: "today", label: { en: "Today's Panchang", de: "Heutiges Panchang", fr: "Panchang du jour", ja: "今日のパンチャング", es: "Panchang de Hoy", pt: "Panchang de Hoje", ar: "بانتشانغ اليوم", hi: "आज का पंचांग", gu: "આજનું પંચાંગ" }, href: "/panchang" },
      { id: "tithi", label: { en: "Tithi", de: "Tithi", fr: "Tithi", ja: "ティティ", es: "Tithi", pt: "Tithi", ar: "تيتي", hi: "तिथि", gu: "તિથિ" }, href: "/panchang#tithi" },
      { id: "nakshatra", label: { en: "Nakshatra", de: "Nakshatra", fr: "Nakshatra", ja: "ナクシャトラ", es: "Nakshatra", pt: "Nakshatra", ar: "ناكشاترا", hi: "नक्षत्र", gu: "નક્ષત્ર" }, href: "/panchang#nakshatra" },
      { id: "yoga", label: { en: "Yoga", de: "Yoga", fr: "Yoga", ja: "ヨーガ", es: "Yoga", pt: "Yoga", ar: "يوغا", hi: "योग", gu: "યોગ" }, href: "/panchang#yoga" },
      { id: "karana", label: { en: "Karana", de: "Karana", fr: "Karana", ja: "カラナ", es: "Karana", pt: "Karana", ar: "كارانا", hi: "करण", gu: "કરણ" }, href: "/panchang#karana" },
      { id: "rahu-kaal", label: { en: "Rahu Kaal", de: "Rahu Kaal", fr: "Rahu Kaal", ja: "ラーフ・カール", es: "Rahu Kaal", pt: "Rahu Kaal", ar: "راهو كال", hi: "राहुकाल", gu: "રાહુકાળ" }, href: "/panchang#rahu-kaal" },
      { id: "choghadiya", label: { en: "Choghadiya", de: "Choghadiya", fr: "Choghadiya", ja: "チョガディヤ", es: "Choghadiya", pt: "Choghadiya", ar: "شوغاديا", hi: "चौघड़िया", gu: "ચોઘડિયા" }, href: "/panchang#choghadiya" },
      { id: "sun-moon", label: { en: "Sunrise & Sunset", de: "Sonne & Mond", fr: "Soleil et Lune", ja: "日の出・日の入り", es: "Amanecer y Atardecer", pt: "Nascer e Pôr do Sol", ar: "الشروق والغروب", hi: "सूर्योदय व सूर्यास्त", gu: "સૂર્યોદય અને સૂર્યાસ્ત" }, href: "/panchang#sun-moon" },
    ],
    footerSections: [
      {
        title: { en: "Pancha Anga (5 Limbs)", de: "Pancha Anga", fr: "Pancha Anga (5 membres)", ja: "パンチャ・アンガ（5大要素）", es: "Pancha Anga (5 Elementos)", pt: "Pancha Anga (5 Elementos)", ar: "أركان البانتشانغ الخمسة", hi: "पंचांग के पंच-अंग", gu: "પંચાંગના પાંચ અંગ" },
        links: [
          { label: { en: "Tithi (Lunar Day)", de: "Tithi", fr: "Tithi (Jour lunaire)", ja: "ティティ（月日）", es: "Tithi (Día Lunar)", pt: "Tithi (Dia Lunar)", ar: "تيتي (اليوم القمري)", hi: "तिथि विवरण", gu: "તિથિ વિગત" }, href: "/panchang#tithi" },
          { label: { en: "Vara (Solar Weekday)", de: "Vara", fr: "Vara (Jour de la semaine)", ja: "ヴァーラ（曜日）", es: "Vara (Día Solar)", pt: "Vara (Dia Solar)", ar: "فارا (يوم الأسبوع)", hi: "वार व नक्षत्र", gu: "વાર અને નક્ષત્ર" }, href: "/panchang#vara" },
          { label: { en: "27 Nakshatras & Padas", de: "27 Nakshatras", fr: "27 Nakshatras", ja: "27ナクシャトラ", es: "27 Nakshatras", pt: "27 Nakshatras", ar: "27 ناكشاترا", hi: "27 नक्षत्र व चरण", gu: "27 નક્ષત્ર અને ચરણ" }, href: "/panchang#nakshatra" },
        ],
      },
      {
        title: { en: "Auspicious & Inauspicious Muhurat", de: "Muhurat Zeiten", fr: "Moments fastes et néfastes", ja: "吉凶時間帯", es: "Muhurats Propicios e Infaustos", pt: "Muhurats Propícios e Infaustos", ar: "المواقيت الصالحة وغير الصالحة", hi: "शुभ व अशुभ मुहूर्त", gu: "શુભ અને અશુભ મુહૂર્ત" },
        links: [
          { label: { en: "Abhijit Muhurat", de: "Abhijit Muhurat", fr: "Abhijit Muhurat", ja: "アビジット・ムフラト", es: "Abhijit Muhurat", pt: "Abhijit Muhurat", ar: "أبهيجيت موهورات", hi: "अभिजीत मुहूर्त", gu: "અભિજીત મુહૂર્ત" }, href: "/panchang#abhijit" },
          { label: { en: "Rahu Kaal & Yamaganda", de: "Rahu Kaal & Yamaganda", fr: "Rahu Kaal & Yamaganda", ja: "ラーフ・カール＆ヤマガンダ", es: "Rahu Kaal y Yamaganda", pt: "Rahu Kaal e Yamaganda", ar: "راهو كال وياماغاندا", hi: "राहुकाल और यमगण्ड", gu: "રાહુકાળ અને યમગંડ" }, href: "/panchang#rahu-kaal" },
          { label: { en: "Brahma Muhurta Timings", de: "Brahma Muhurta", fr: "Brahma Muhurta", ja: "ブラフマ・ムフルタ", es: "Brahma Muhurta", pt: "Brahma Muhurta", ar: "براهما موهورتا", hi: "ब्रह्म मुहूर्त समय", gu: "બ્રહ્મ મુહૂર્ત સમય" }, href: "/panchang#brahma" },
        ],
      },
      {
        title: { en: "Solar & Lunar Ephemeris", de: "Ephemeriden", fr: "Éphémérides solaires et lunaires", ja: "天文暦", es: "Efemérides Solares y Lunares", pt: "Efemérides Solares e Lunares", ar: "التقويم الفلكي الشمسي والقمري", hi: "सूर्य व चंद्र स्थिति", gu: "સૂર્ય અને ચંદ્ર સ્થિતિ" },
        links: [
          { label: { en: "Sunrise, Sunset, Moonrise", de: "Sonne & Mond Zeiten", fr: "Horaires Soleil & Lune", ja: "日出・日没・月の出", es: "Salida y Puesta de Sol y Luna", pt: "Horários de Sol e Lua", ar: "أوقات الشروق والغروب", hi: "सूर्योदय, सूर्यास्त व चंद्रोदय", gu: "સૂર્યોદય, સૂર્યાસ્ત અને ચંદ્રોદય" }, href: "/panchang#sun-moon" },
          { label: { en: "Sun & Moon Zodiac Signs", de: "Tierkreiszeichen", fr: "Signes zodiacaux", ja: "太陽と月の星座", es: "Signos Solares y Lunares", pt: "Signos Solares e Lunares", ar: "الأبراج الشمسية والقمرية", hi: "सूर्य व चंद्र राशि", gu: "સૂર્ય અને ચંદ્ર રાશિ" }, href: "/panchang#zodiac-signs" },
          { label: { en: "Comprehensive Hindu Calendar", de: "Hindukalender", fr: "Calendrier hindou", ja: "ヒンドゥー暦全体", es: "Calendario Hindú", pt: "Calendário Hindu", ar: "التقويم الهندوسي", hi: "संपूर्ण हिन्दू पंचांग", gu: "संपूर्ण हिन्दू पंचांग" }, href: "/calendar/hindu-calendar" },
        ],
      },
    ],
    relatedEcosystems: ["hindu-calendar", "gujarati-calendar", "festivals", "astrology"],
  },

  festivals: {
    id: "festivals",
    name: {
      en: "Global & Sacred Festivals",
      de: "Weltweite & Heilige Feste",
      fr: "Fêtes sacrées et mondiales",
      ja: "世界の祝祭日・宗教祭礼",
      es: "Festivales Sagrados y Globales",
      pt: "Festivais Sagrados e Globais",
      ar: "المهرجانات المقدسة والعالمية",
      hi: "त्योहार, पर्व एवं राष्ट्रीय अवकाश", gu: "त्योहार, पर्व एवं राष्ट्रीय अवकाश",
    },
    tagline: {
      en: "Comprehensive festival dates, rituals, history, and countdowns across major world religions and cultures.",
      de: "Umfassende Festdaten, Rituale und Countdowns für die großen Weltreligionen.",
      fr: "Dates des fêtes, rituels, histoire et décomptes pour les grandes religions et cultures.",
      ja: "世界の主要宗教や文化における祝祭日、儀礼、歴史、カウントダウンの包括的ガイド。",
      es: "Fechas completas de festividades, rituales, historia y cuentas regresivas mundiales.",
      pt: "Datas completas de festivais, rituais, história e contagens regressivas mundiais.",
      ar: "دليل شامل لمواعيد المهرجانات، الطقوس، والعد التنازلي لمختلف الثقافات والأديان.",
      hi: "हिन्दू, जैन, सिख, बौद्ध और अंतरराष्ट्रीय त्योहारों की तिथियाँ, पूजा विधि व उलटी गिनती।", gu: "हिन्दू, जैन, सिख, बौद्ध और अंतरराष्ट्रीय त्योहारों की तिथियाँ, पूजा विधि व उलटी गिनती।",
    },
    accentColor: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    primaryPath: "/festivals",
    secondaryNav: [
      { id: "all", label: { en: "All Festivals", de: "Alle Feste", fr: "Toutes les fêtes", ja: "全祭礼一覧", es: "Todos los Festivales", pt: "Todos os Festivais", ar: "جميع المهرجانات", hi: "सभी त्योहार", gu: "બધા તહેવારો" }, href: "/festivals" },
      { id: "hindu-2027", label: { en: "Hindu 2027", de: "Hindu 2027", fr: "Hindou 2027", ja: "ヒンドゥー2027", es: "Hindú 2027", pt: "Hindu 2027", ar: "هندوسي 2027", hi: "हिन्दू त्योहार 2027", gu: "હિન્દુ તહેવારો 2027" }, href: "/festivals/hindu-festivals-2027" },
      { id: "gujarati-2027", label: { en: "Gujarati 2027", de: "Gujarati 2027", fr: "Gujarati 2027", ja: "グジャラート2027", es: "Gujarati 2027", pt: "Gujarati 2027", ar: "غوجاراتي 2027", hi: "गुजराती त्योहार 2027", gu: "ગુજરાતી તહેવારો 2027" }, href: "/festivals/gujarati-festivals-2027" },
      { id: "hindu", label: { en: "Hindu Festivals", de: "Hindu-Feste", fr: "Fêtes hindoues", ja: "ヒンドゥー教の祭り", es: "Festivales Hindúes", pt: "Festivais Hindus", ar: "الأعياد الهندوسية", hi: "हिन्दू त्योहार", gu: "हिन्दू त्योहार" }, href: "/festivals#hindu" },
      { id: "jain", label: { en: "Jain Festivals", de: "Jain-Feste", fr: "Fêtes jaïnes", ja: "ジャイナ教の祭り", es: "Festivales Jainistas", pt: "Festivais Jainistas", ar: "الأعياد الجاينية", hi: "जैन पर्व", gu: "જૈન તહેવારો" }, href: "/festivals#jain" },
      { id: "sikh", label: { en: "Sikh Festivals", de: "Sikh-Feste", fr: "Fêtes sikhes", ja: "シーク教の祭り", es: "Festivales Sijs", pt: "Festivais Sikhs", ar: "الأعياد السيخية", hi: "सिख त्योहार", gu: "सिख त्योहार" }, href: "/festivals#sikh" },
      { id: "buddhist", label: { en: "Buddhist Festivals", de: "Buddhistische Feste", fr: "Fêtes bouddhistes", ja: "仏教の祝祭日", es: "Festivales Budistas", pt: "Festivais Budistas", ar: "الأعياد البوذية", hi: "बौद्ध पर्व", gu: "બૌદ્ધ તહેવારો" }, href: "/festivals#buddhist" },
      { id: "regional", label: { en: "Regional Festivals", de: "Regionale Feste", fr: "Fêtes régionales", ja: "地域別の祝祭日", es: "Festivales Regionales", pt: "Festivais Regionais", ar: "المهرجانات الإقليمية", hi: "क्षेत्रीय उत्सव", gu: "क्षेत्रीय उत्सव" }, href: "/festivals#regional" },
      { id: "upcoming", label: { en: "Upcoming Holidays", de: "Kommende Feiertage", fr: "Jours fériés à venir", ja: "今後の祝祭日", es: "Próximos Festivos", pt: "Próximos Feriados", ar: "العطلات القادمة", hi: "आगामी अवकाश", gu: "आगामी अवकाश" }, href: "/holidays" },
    ],
    footerSections: [
      {
        title: { en: "Major Hindu Celebrations", de: "Große Hindu-Feste", fr: "Grandes fêtes hindoues", ja: "ヒンドゥー教の祭礼", es: "Grandes Fiestas Hindúes", pt: "Grandes Festas Hindus", ar: "أهم الأعياد الهندوسية", hi: "प्रमुख सनातन पर्व", gu: "प्रमुख सनातन पर्व" },
        links: [
          { label: { en: "Diwali & Lakshmi Puja", de: "Diwali & Lakshmi Puja", fr: "Diwali & Lakshmi Puja", ja: "ディワリ（光の祭典）", es: "Diwali y Lakshmi Puja", pt: "Diwali e Lakshmi Puja", ar: "ديوالي ولاكشمي بوجا", hi: "दीपावली व लक्ष्मी पूजन", gu: "दीपावली व लक्ष्मी पूजन" }, href: "/festivals#diwali" },
          { label: { en: "Holi & Holika Dahan", de: "Holi", fr: "Holi & Holika Dahan", ja: "ホーリー祭", es: "Holi y Holika Dahan", pt: "Holi e Holika Dahan", ar: "هولي وهوليكا داهان", hi: "होली व होलिका दहन", gu: "હોળી અને હોલિકા દહન" }, href: "/festivals#holi" },
          { label: { en: "Navratri & Durga Puja", de: "Navratri", fr: "Navratri & Durga Puja", ja: "ナヴラトリ（女神の祭典）", es: "Navratri y Durga Puja", pt: "Navratri e Durga Puja", ar: "نافراتري ودورغا بوجا", hi: "नवरात्रि व दुर्गा पूजा", gu: "नवरात्रि व दुर्गा पूजा" }, href: "/festivals#navratri" },
          { label: { en: "Maha Shivratri", de: "Maha Shivratri", fr: "Maha Shivratri", ja: "マハー・シヴァラトリ", es: "Maha Shivratri", pt: "Maha Shivratri", ar: "ماها شيفاراتري", hi: "महाशिवरात्रि", gu: "महाशिवरात्रि" }, href: "/festivals#shivratri" },
        ],
      },
      {
        title: { en: "Dharmic & Pan-Indian Festivals", de: "Dharmische Feste", fr: "Fêtes dharmiques", ja: "諸宗派の祝祭日", es: "Festivales Dhármicos", pt: "Festivais Dhármicos", ar: "المهرجانات الدارمية", hi: "जैन, सिख व बौद्ध पर्व", gu: "जैन, सिख व बौद्ध पर्व" },
        links: [
          { label: { en: "Paryushan Parva & Samvatsari", de: "Paryushan", fr: "Paryushan & Samvatsari", ja: "パルユーシャナ（赦しの祭典）", es: "Paryushan y Samvatsari", pt: "Paryushan e Samvatsari", ar: "باريوشان وسامفاتساري", hi: "पर्युषण पर्व व संवत्सरी", gu: "पर्युषण पर्व व संवत्सरी" }, href: "/festivals#paryushan" },
          { label: { en: "Guru Nanak Jayanti & Vaisakhi", de: "Guru Nanak Jayanti", fr: "Guru Nanak Jayanti", ja: "グル・ナーナク生誕祭", es: "Guru Nanak Jayanti", pt: "Guru Nanak Jayanti", ar: "غورو ناناك جايانتي", hi: "गुरु नानक जयंती व बैसाखी", gu: "गुरु नानक जयंती व बैसाखी" }, href: "/festivals#gurpurab" },
          { label: { en: "Buddha Purnima (Vesak)", de: "Buddha Purnima", fr: "Buddha Purnima (Vesak)", ja: "花まつり（ウェーサーカ祭）", es: "Buddha Purnima", pt: "Buddha Purnima", ar: "بوذا بورنيما", hi: "बुद्ध पूर्णिमा", gu: "બુદ્ધ પૂર્ણિમા" }, href: "/festivals#buddha-purnima" },
        ],
      },
      {
        title: { en: "International Holidays", de: "Internationale Feiertage", fr: "Jours fériés internationaux", ja: "国際的な祝祭日", es: "Festivos Internacionales", pt: "Feriados Internacionais", ar: "العطلات الدولية", hi: "अंतरराष्ट्रीय अवकाश", gu: "अंतरराष्ट्रीय अवकाश" },
        links: [
          { label: { en: "New Year's Day Countdown", de: "Neujahrs-Countdown", fr: "Décompte du Nouvel An", ja: "元日カウントダウン", es: "Cuenta Regresiva de Año Nuevo", pt: "Contagem de Ano Novo", ar: "العد التنازلي لرأس السنة", hi: "नववर्ष काउंटडाउन", gu: "नववर्ष काउंटडाउन" }, href: "/timer/new-years-day-usa" },
          { label: { en: "Christmas Countdown", de: "Weihnachts-Countdown", fr: "Décompte de Noël", ja: "クリスマスカウントダウン", es: "Cuenta Regresiva de Navidad", pt: "Contagem de Natal", ar: "العد التنازلي لعيد الميلاد", hi: "क्रिसमस काउंटडाउन", gu: "क्रिसमस काउंटडाउन" }, href: "/timer/christmas-day-usa" },
          { label: { en: "All Public Holidays", de: "Alle Feiertage", fr: "Tous les jours fériés", ja: "全祝祭日カレンダー", es: "Todos los Días Festivos", pt: "Todos os Feriados Públicos", ar: "جميع العطلات الرسمية", hi: "सार्वजनिक अवकाश सूची", gu: "सार्वजनिक अवकाश सूची" }, href: "/holidays" },
        ],
      },
    ],
    relatedEcosystems: ["hindu-calendar", "gujarati-calendar", "panchang", "devotional"],
  },

  devotional: {
    id: "devotional",
    name: {
      en: "Devotional & Spiritual Library",
      de: "Andacht & Spirituelle Bibliothek",
      fr: "Bibliothèque dévotionnelle",
      ja: "祈りと信仰のライブラリ",
      es: "Biblioteca Devocional y Espiritual",
      pt: "Biblioteca Devocional e Espiritual",
      ar: "المكتبة الروحية والتعبدية",
      hi: "भक्ति व आध्यात्मिक संग्रह", gu: "भक्ति व आध्यात्मिक संग्रह",
    },
    tagline: {
      en: "Sacred Aartis, Chalisas, Vedic Mantras, Stotras, Vrat Kathas, and Puja Vidhi guides.",
      de: "Heilige Aartis, Chalisas, vedische Mantras, Stotras und Puja-Anleitungen.",
      fr: "Aartis sacrés, Chalisas, Mantras védiques, Stotras et guides de Puja Vidhi.",
      ja: "聖なるアールティー、チャーリーサー、マントラ、ストートラ、プージャー作法を網羅。",
      es: "Aartis sagrados, Chalisas, Mantras védicos, Stotras y guías de Puja Vidhi.",
      pt: "Aartis sagrados, Chalisas, Mantras védicos, Stotras e guias de Puja Vidhi.",
      ar: "مكتبة روحية تضم الأرتي، تشاليسا، المانترا الفيدية، والصلوات المقدسة.",
      hi: "प्रामाणिक आरती, चालीसा, वैदिक मंत्र, स्तोत्र, व्रत कथा और पूजन विधि संग्रह।", gu: "प्रामाणिक आरती, चालीसा, वैदिक मंत्र, स्तोत्र, व्रत कथा और पूजन विधि संग्रह।",
    },
    accentColor: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    primaryPath: "/devotional",
    secondaryNav: [
      { id: "aarti", label: { en: "Aarti", de: "Aarti", fr: "Aarti", ja: "アールティー", es: "Aarti", pt: "Aarti", ar: "أرتي", hi: "आरती", gu: "આરતી" }, href: "/devotional#aarti" },
      { id: "chalisa", label: { en: "Chalisa", de: "Chalisa", fr: "Chalisa", ja: "チャーリーサー", es: "Chalisa", pt: "Chalisa", ar: "تشاليسا", hi: "चालीसा", gu: "ચાલીસા" }, href: "/devotional#chalisa" },
      { id: "mantra", label: { en: "Mantra", de: "Mantra", fr: "Mantra", ja: "マントラ", es: "Mantra", pt: "Mantra", ar: "مانترا", hi: "वैदिक मंत्र", gu: "વૈદિક મંત્ર" }, href: "/devotional#mantra" },
      { id: "stotra", label: { en: "Stotra", de: "Stotra", fr: "Stotra", ja: "ストートラ讃歌", es: "Stotra", pt: "Stotra", ar: "ستوترا", hi: "स्तोत्र", gu: "સ્તોત્ર" }, href: "/devotional#stotra" },
      { id: "bhajan", label: { en: "Bhajan", de: "Bhajan", fr: "Bhajan", ja: "バジャン賛歌", es: "Bhajan", pt: "Bhajan", ar: "بهاجان", hi: "भजन", gu: "ભજન" }, href: "/devotional#bhajan" },
      { id: "vrat-katha", label: { en: "Vrat Katha", de: "Vrat Katha", fr: "Vrat Katha", ja: "断食説話（ヴラト・カター）", es: "Vrat Katha", pt: "Vrat Katha", ar: "قصص الصيام", hi: "व्रत कथा", gu: "વ્રત કથા" }, href: "/devotional#vrat-katha" },
      { id: "puja-vidhi", label: { en: "Puja Vidhi", de: "Puja Vidhi", fr: "Puja Vidhi", ja: "プージャー作法", es: "Puja Vidhi", pt: "Puja Vidhi", ar: "طقوس بوجا", hi: "पूजन विधि", gu: "પૂજન વિધિ" }, href: "/devotional#puja-vidhi" },
      { id: "temples", label: { en: "Temples", de: "Tempel", fr: "Temples", ja: "寺院", es: "Templos", pt: "Templos", ar: "المعابد", hi: "प्रसिद्ध मंदिर", gu: "પ્રસિદ્ધ મંદિરો" }, href: "/devotional#temples" },
      { id: "pilgrimage", label: { en: "Pilgrimage", de: "Pilgerreisen", fr: "Pèlerinages", ja: "巡礼地", es: "Peregrinaciones", pt: "Peregrinações", ar: "أماكن الحج", hi: "तीर्थ यात्रा", gu: "તીર્થ યાત્રા" }, href: "/devotional#pilgrimage" },
    ],
    footerSections: [
      {
        title: { en: "Popular Chalisas & Aartis", de: "Chalisas & Aartis", fr: "Chalisas et Aartis populaires", ja: "祈りの讃歌", es: "Chalisas y Aartis Populares", pt: "Chalisas e Aartis Populares", ar: "أشهر الأرتي والتشاليسا", hi: "प्रमुख आरती व चालीसा", gu: "प्रमुख आरती व चालीसा" },
        links: [
          { label: { en: "Shri Hanuman Chalisa", de: "Hanuman Chalisa", fr: "Shri Hanuman Chalisa", ja: "ハヌマーン・チャーリーサー", es: "Shri Hanuman Chalisa", pt: "Shri Hanuman Chalisa", ar: "هانومان تشاليسا", hi: "श्री हनुमान चालीसा", gu: "શ્રી હનુમાન ચાલીસા" }, href: "/devotional#hanuman-chalisa" },
          { label: { en: "Shiv Chalisa & Aarti", de: "Shiv Chalisa", fr: "Shiv Chalisa et Aarti", ja: "シヴァ神チャーリーサー", es: "Shiv Chalisa y Aarti", pt: "Shiv Chalisa e Aarti", ar: "شيف تشاليسا", hi: "श्री शिव चालीसा व आरती", gu: "श्री शिव चालीसा व आरती" }, href: "/devotional#shiv-chalisa" },
          { label: { en: "Lakshmi Aarti (Om Jai Lakshmi Mata)", de: "Lakshmi Aarti", fr: "Lakshmi Aarti", ja: "ラクシュミー・アールティー", es: "Lakshmi Aarti", pt: "Lakshmi Aarti", ar: "لاكشمي أرتي", hi: "श्री लक्ष्मी जी की आरती", gu: "श्री लक्ष्मी जी की आरती" }, href: "/devotional#lakshmi-aarti" },
        ],
      },
      {
        title: { en: "Vedic Mantras & Stotras", de: "Mantras & Stotras", fr: "Mantras védiques et Stotras", ja: "マントラと讃歌", es: "Mantras Védicos y Stotras", pt: "Mantras Védicos e Stotras", ar: "المانترا والستوترا الفيدية", hi: "मंत्र एवं स्तोत्र", gu: "मंत्र एवं स्तोत्र" },
        links: [
          { label: { en: "Gayatri Mantra", de: "Gayatri Mantra", fr: "Gayatri Mantra", ja: "ガーヤトリー・マントラ", es: "Gayatri Mantra", pt: "Gayatri Mantra", ar: "غاياتري مانترا", hi: "गायत्री महामंत्र", gu: "गायत्री महामंत्र" }, href: "/devotional#gayatri-mantra" },
          { label: { en: "Maha Mrityunjaya Mantra", de: "Maha Mrityunjaya", fr: "Maha Mrityunjaya Mantra", ja: "マハー・ムリティユンジャヤ", es: "Maha Mrityunjaya", pt: "Maha Mrityunjaya", ar: "ماها مريتيونجايا", hi: "महामृत्युंजय मंत्र", gu: "महामृत्युंजय मंत्र" }, href: "/devotional#mrityunjaya" },
          { label: { en: "Shree Suktam & Kanakadhara", de: "Shree Suktam", fr: "Shree Suktam", ja: "シュリー・スークタム", es: "Shree Suktam", pt: "Shree Suktam", ar: "شري سوكتام", hi: "श्री सूक्तम् व कनकधारा", gu: "श्री सूक्तम् व कनकधारा" }, href: "/devotional#shree-suktam" },
        ],
      },
      {
        title: { en: "Puja Vidhi & Kathas", de: "Puja Anleitungen", fr: "Guides de Puja et Kathas", ja: "プージャーと説話", es: "Guías de Puja y Kathas", pt: "Guias de Puja e Kathas", ar: "طقوس بوجا والقصص", hi: "पूजन विधि व कथा", gu: "पूजन विधि व कथा" },
        links: [
          { label: { en: "Satyanarayan Vrat Katha", de: "Satyanarayan Katha", fr: "Satyanarayan Katha", ja: "サティヤナーラーヤン説話", es: "Satyanarayan Vrat Katha", pt: "Satyanarayan Vrat Katha", ar: "ساتيانارايان كاثا", hi: "सत्यनारायण व्रत कथा", gu: "સત્યનારાયણ વ્રત કથા" }, href: "/devotional#satyanarayan" },
          { label: { en: "Diwali Lakshmi Puja Vidhi", de: "Diwali Puja", fr: "Lakshmi Puja Vidhi", ja: "ディワリ礼拝作法", es: "Diwali Lakshmi Puja", pt: "Diwali Lakshmi Puja", ar: "طقوس بوجا ديوالي", hi: "दीपावली लक्ष्मी पूजा विधि", gu: "दीपावली लक्ष्मी पूजा विधि" }, href: "/devotional#lakshmi-puja-vidhi" },
          { label: { en: "Daily Vedic Panchang", de: "Tägliches Panchang", fr: "Panchang quotidien", ja: "日々のパンチャング", es: "Panchang Diario", pt: "Panchang Diário", ar: "البانتشانغ اليومي", hi: "दैनिक पंचांग व मुहूर्त", gu: "દૈનિક પંચાંગ અને મુહૂર્ત" }, href: "/panchang" },
        ],
      },
    ],
    relatedEcosystems: ["hindu-calendar", "festivals", "panchang"],
  },

  astrology: {
    id: "astrology",
    name: {
      en: "Vedic Astrology & Kundali",
      de: "Vedische Astrologie & Kundali",
      fr: "Astrologie védique & Kundali",
      ja: "ヴェーダ占星術・クンダリー",
      es: "Astrología Védica y Kundali",
      pt: "Astrologia Védica e Kundali",
      ar: "التنجيم الفيدي والكوندالي",
      hi: "वैदिक ज्योतिष व कुंडली", gu: "વૈદિક જ્યોતિષ અને કુંડળી",
    },
    tagline: {
      en: "Planetary positions, Kundali birth chart, 36-point Guna Milan matching, and Manglik Dosha analysis.",
      de: "Planetenpositionen, Geburtshoroskope, 36-Punkte Guna Milan und Dosha-Analyse.",
      fr: "Positions planétaires, thème natal Kundali, compatibilité Guna Milan 36 points et doshas.",
      ja: "天体配置、出生図クンダリー、36点満点グナ・ミーラン相性診断、ドーシャ分析。",
      es: "Posiciones planetarias, carta natal Kundali, compatibilidad Guna Milan y análisis de doshas.",
      pt: "Posições planetárias, mapa natal Kundali, compatibilidade Guna Milan e análise de doshas.",
      ar: "المواقع الكوكبية، مخطط الولادة كوندالي، توافق غونا ميلان وتحليل الدوشا.",
      hi: "ग्रह स्थिति, जन्म कुंडली, 36 गुण मिलान, मांगलिक दोष विश्लेषण और दैनिक राशिफल।", gu: "ग्रह स्थिति, जन्म कुंडली, 36 गुण मिलान, मांगलिक दोष विश्लेषण और दैनिक राशिफल।",
    },
    accentColor: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    primaryPath: "/astrology",
    secondaryNav: [
      { id: "kundali", label: { en: "Kundali", de: "Kundali", fr: "Kundali", ja: "クンダリー出生図", es: "Kundali", pt: "Kundali", ar: "كوندالي", hi: "जन्म कुंडली", gu: "જન્મ કુંડળી" }, href: "/astrology#kundali" },
      { id: "matching", label: { en: "Kundali Matching", de: "Kundali-Matching", fr: "Compatibilité Kundali", ja: "クンダリー相性", es: "Emparejamiento Kundali", pt: "Correspondência Kundali", ar: "توافق كوندالي", hi: "कुंडली मिलान", gu: "કુંડળી મિલન" }, href: "/astrology#kundali-matching" },
      { id: "guna-milan", label: { en: "36 Guna Milan", de: "36 Guna Milan", fr: "36 Guna Milan", ja: "36グナ・ミーラン", es: "36 Guna Milan", pt: "36 Guna Milan", ar: "36 غونا ميلان", hi: "36 गुण मिलान", gu: "36 ગુણ મિલન" }, href: "/astrology#guna-milan" },
      { id: "rashi", label: { en: "Rashi (Zodiac)", de: "Rashi (Tierkreis)", fr: "Rashi (Zodiaque)", ja: "ラーシ（星座）", es: "Rashi (Zodíaco)", pt: "Rashi (Zodíaco)", ar: "راشي (الأبراج)", hi: "राशि फल", gu: "રાશિફળ" }, href: "/astrology#rashi" },
      { id: "nakshatra", label: { en: "Nakshatra", de: "Nakshatra", fr: "Nakshatra", ja: "ナクシャトラ", es: "Nakshatra", pt: "Nakshatra", ar: "ناكشاترا", hi: "नक्षत्र फल", gu: "નક્ષત્ર ફળ" }, href: "/astrology#nakshatra" },
      { id: "manglik", label: { en: "Manglik Dosha", de: "Manglik Dosha", fr: "Dosha Manglik", ja: "マングリク・ドーシャ", es: "Manglik Dosha", pt: "Manglik Dosha", ar: "مانغليك دوشا", hi: "मांगलिक दोष", gu: "માંગલિક દોષ" }, href: "/astrology#manglik-dosha" },
      { id: "rashifal", label: { en: "Rashifal", de: "Horoskop", fr: "Horoscope", ja: "運勢占い", es: "Horóscopo", pt: "Horóscopo", ar: "الطالع اليومي", hi: "दैनिक राशिफल", gu: "દૈનિક રાશિફળ" }, href: "/astrology#rashifal" },
    ],
    footerSections: [
      {
        title: { en: "12 Zodiac Rashis", de: "12 Sternzeichen", fr: "12 Signes Rashi", ja: "12星座（ラーシ）", es: "12 Signos del Zodíaco", pt: "12 Signos do Zodíaco", ar: "الأبراج الاثنا عشر", hi: "द्वादश राशियाँ (12 Rashis)", gu: "દ્વાદશ રાશિઓ (12 Rashis)" },
        links: [
          { label: { en: "Mesha, Vrishabha, Mithuna", de: "Widder, Stier, Zwillinge", fr: "Bélier, Taureau, Gémeaux", ja: "牡羊座・牡牛座・双子座", es: "Aries, Tauro, Géminis", pt: "Áries, Touro, Gêmeos", ar: "الحمل، الثور، الجوزاء", hi: "मेष, वृषभ, मिथुन", gu: "મેષ, વૃષભ, મિથુન" }, href: "/astrology#mesha" },
          { label: { en: "Karka, Simha, Kanya", de: "Krebs, Löwe, Jungfrau", fr: "Cancer, Lion, Vierge", ja: "蟹座・獅子座・乙女座", es: "Cáncer, Leo, Virgo", pt: "Câncer, Leão, Virgem", ar: "السرطان، الأسد، العذراء", hi: "कर्क, सिंह, कन्या", gu: "કર્ક, સિંહ, કન્યા" }, href: "/astrology#simha" },
          { label: { en: "Tula, Vrishchika, Dhanu", de: "Waage, Skorpion, Schütze", fr: "Balance, Scorpion, Sagittaire", ja: "天秤座・蠍座・射手座", es: "Libra, Escorpio, Sagitario", pt: "Libra, Escorpião, Sagitário", ar: "الميزان، العقرب، القوس", hi: "तुला, वृश्चिक, धनु", gu: "તુલા, વૃશ્ચિક, ધન" }, href: "/astrology#tula" },
          { label: { en: "Makara, Kumbha, Meena", de: "Steinbock, Wassermann, Fische", fr: "Capricorne, Verseau, Poissons", ja: "山羊座・水瓶座・魚座", es: "Capricornio, Acuario, Piscis", pt: "Capricórnio, Aquário, Peixes", ar: "الجدي، الدلو، الحوت", hi: "मकर, कुंभ, मीन", gu: "મકર, કુંભ, મીન" }, href: "/astrology#meena" },
        ],
      },
      {
        title: { en: "Compatibility & Milan", de: "Kompatibilität", fr: "Compatibilité et Milan", ja: "相性診断と分析", es: "Compatibilidad y Milan", pt: "Compatibilidade e Milan", ar: "التوافق والميلان", hi: "गुण मिलान व संबंध", gu: "ગુણ મિલન અને સંબંધ" },
        links: [
          { label: { en: "36 Ashta Koota Guna Milan", de: "Ashta Koota Milan", fr: "Ashta Koota Guna Milan", ja: "アシュタ・クータ36点法", es: "Ashta Koota Guna Milan", pt: "Ashta Koota Guna Milan", ar: "أشتا كوتا غونا ميلان", hi: "अष्टकूट 36 गुण मिलान", gu: "અષ્ટકૂટ 36 ગુણ મિલન" }, href: "/astrology#guna-milan" },
          { label: { en: "Nadi & Bhakoot Dosha", de: "Nadi & Bhakoot", fr: "Nadi et Bhakoot Dosha", ja: "ナーディー＆バクート", es: "Nadi y Bhakoot Dosha", pt: "Nadi e Bhakoot Dosha", ar: "نادي وبهاكوت دوشا", hi: "नाड़ी व भकूट दोष", gu: "નાડી અને ભકૂટ દોષ" }, href: "/astrology#nadi-dosha" },
          { label: { en: "Love & Relationship Calculator", de: "Liebesrechner", fr: "Calculateur d'amour", ja: "恋愛相性計算機", es: "Calculadora de Amor", pt: "Calculadora do Amor", ar: "حاسبة الحب والعلاقات", hi: "लव कम्पैटिबिलिटी टूल", gu: "લવ કમ્પેટિબિલિટી ટૂલ" }, href: "/love-tools" },
        ],
      },
      {
        title: { en: "Planetary Transits & Ephemeris", de: "Planetentransite", fr: "Transits planétaires", ja: "惑星運行と天文暦", es: "Tránsitos Planetarios", pt: "Trânsitos Planetários", ar: "حركة الكواكب والأفلاك", hi: "ग्रह गोचर व पंचांग", gu: "ગ્રહ ગોચર અને પંચાંગ" },
        links: [
          { label: { en: "Today's Vedic Panchang", de: "Heutiges Panchang", fr: "Panchang du jour", ja: "今日のパンチャング", es: "Panchang de Hoy", pt: "Panchang de Hoje", ar: "بانتشانغ اليوم", hi: "आज का दैनिक पंचांग", gu: "આજનું દૈનિક પંચાંગ" }, href: "/panchang" },
          { label: { en: "Sade Sati & Shani Transits", de: "Sade Sati", fr: "Sade Sati & Saturne", ja: "サーデー・サティ（土星期）", es: "Sade Sati y Tránsitos", pt: "Sade Sati e Saturno", ar: "سادي ساتي وزحل", hi: "साढ़े साती व शनि गोचर", gu: "શનિની સાડાસાતી વિશ્લેષણ" }, href: "/astrology#sade-sati" },
          { label: { en: "Hindu Calendar Hub", de: "Hindukalender", fr: "Calendrier hindou", ja: "ヒンドゥー暦ハブ", es: "Calendario Hindú", pt: "Calendário Hindu", ar: "التقويم الهندوسي", hi: "हिन्दू कैलेंडर मुख्य पृष्ठ", gu: "હિન્દુ કેલેન્ડર મુખ્ય પૃષ્ઠ" }, href: "/calendar/hindu-calendar" },
        ],
      },
    ],
    relatedEcosystems: ["hindu-calendar", "panchang", "love-tools", "festivals"],
  },

  "love-tools": {
    id: "love-tools",
    name: {
      en: "Love & Relationship Calculators",
      de: "Liebes- & Beziehungsrechner",
      fr: "Calculateurs d'amour et de couple",
      ja: "恋愛・相性診断ツール",
      es: "Calculadoras de Amor y Relaciones",
      pt: "Calculadoras do Amor e Relações",
      ar: "حاسبات الحب والتوافق العاطفي",
      hi: "लव व रिलेशनशिप टूल्स", gu: "લવ અને રિલેશનશિપ ટૂલ્સ",
    },
    tagline: {
      en: "Playful and engaging relationship tools: Name Love Match, FLAMES game, Zodiac compatibility, and Numerology.",
      de: "Unterhaltsame Beziehungstools: Liebesrechner, FLAMES, Tierkreiskompatibilität und Numerologie.",
      fr: "Outils de couple ludiques: test d'amour, jeu FLAMES, compatibilité zodiacale et numérologie.",
      ja: "名前占い、FLAMESゲーム、星座相性、数秘術による楽しく奥深い恋愛診断ツール群。",
      es: "Herramientas divertidas de pareja: Test de Amor, juego FLAMES, compatibilidad del zodiaco y numerología.",
      pt: "Ferramentas divertidas de relacionamento: Teste do Amor, jogo FLAMES, compatibilidade e numerologia.",
      ar: "أدوات ممتعة للعلاقات: مقياس الحب، لعبة فليمز، توافق الأبراج وعلم الأرقام.",
      hi: "लव कैलकुलेटर, FLAMES गेम, राशि अनुकूलता और न्यूमरोलॉजी से जानें रिश्ते की गहराई।", gu: "લવ કેલ્ક્યુલેટર, FLAMES ગેમ, રાશિ સુસંગતતા અને અંકશાસ્ત્ર વડે સંબંધની ઊંડાણ જાણો.",
    },
    accentColor: "text-pink-600 dark:text-pink-400",
    badgeBg: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20",
    primaryPath: "/love-tools",
    secondaryNav: [
      { id: "love-calculator", label: { en: "Love Calculator", de: "Liebesrechner", fr: "Calculateur d'amour", ja: "愛の計算機", es: "Calculadora de Amor", pt: "Calculadora do Amor", ar: "حاسبة الحب", hi: "लव कैलकुलेटर", gu: "લવ કેલ્ક્યુલેટર" }, href: "/love-tools#love-calculator" },
      { id: "flames", label: { en: "FLAMES Game", de: "FLAMES Spiel", fr: "Jeu FLAMES", ja: "FLAMESゲーム", es: "Juego FLAMES", pt: "Jogo FLAMES", ar: "لعبة فليمز", hi: "FLAMES गेम", gu: "FLAMES ગેમ" }, href: "/love-tools#flames" },
      { id: "friendship", label: { en: "Friendship Calculator", de: "Freundschaftsrechner", fr: "Calculateur d'amitié", ja: "友情度診断", es: "Calculadora de Amistad", pt: "Calculadora da Amizade", ar: "حاسبة الصداقة", hi: "मित्रता कैलकुलेटर", gu: "મિત્રતા કેલ્ક્યુલેટર" }, href: "/love-tools#friendship-calculator" },
      { id: "zodiac-compatibility", label: { en: "Zodiac Compatibility", de: "Sternzeichen-Kompatibilität", fr: "Compatibilité zodiacale", ja: "星座相性診断", es: "Compatibilidad del Zodíaco", pt: "Compatibilidade do Zodíaco", ar: "توافق الأبراج", hi: "राशि अनुकूलता", gu: "રાશિ સુસંગતતા" }, href: "/love-tools#zodiac-compatibility" },
      { id: "numerology", label: { en: "Numerology Match", de: "Numerologie-Match", fr: "Numérologie de couple", ja: "数秘術相性", es: "Numerología de Pareja", pt: "Numerologia do Amor", ar: "توافق الأرقام", hi: "अंकज्योतिष मिलान", gu: "અંકશાસ્ત્ર મિલન" }, href: "/love-tools#numerology" },
    ],
    footerSections: [
      {
        title: { en: "Relationship Games", de: "Beziehungsspiele", fr: "Jeux de couple", ja: "恋愛ゲーム・テスト", es: "Juegos de Relaciones", pt: "Jogos de Relacionamento", ar: "ألعاب العلاقات", hi: "मनोरंजक प्रेम खेल", gu: "મનોરંજક પ્રેમ રમતો" },
        links: [
          { label: { en: "True Love Calculator", de: "Echter Liebesrechner", fr: "Vrai test d'amour", ja: "トゥルーラブ計算機", es: "Calculadora de Amor Verdadero", pt: "Calculadora de Amor Verdadeiro", ar: "مقياس الحب الحقيقي", hi: "सच्चा प्रेम कैलकुलेटर", gu: "સાચો પ્રેમ કેલ્ક્યુલેટર" }, href: "/love-tools#love-calculator" },
          { label: { en: "FLAMES Name Match", de: "FLAMES Namenstest", fr: "Test de prénoms FLAMES", ja: "FLAMES名前診断", es: "Test de Nombres FLAMES", pt: "Teste de Nomes FLAMES", ar: "مطابقة أسماء فليمز", hi: "FLAMES नाम मिलान", gu: "FLAMES નામ મિલન" }, href: "/love-tools#flames" },
          { label: { en: "Best Friends Test", de: "Bester-Freunde-Test", fr: "Test du meilleur ami", ja: "親友度チェッカー", es: "Test de Mejores Amigos", pt: "Teste de Melhores Amigos", ar: "اختبار الصداقة الحقيقية", hi: "बेस्ट फ्रेंड टेस्ट", gu: "બેસ્ટ ફ્રેન્ડ ટેસ્ટ" }, href: "/love-tools#friendship-calculator" },
        ],
      },
      {
        title: { en: "Zodiac & Elements", de: "Sternzeichen & Elemente", fr: "Zodiaque et éléments", ja: "星座と4大元素", es: "Zodíaco y Elementos", pt: "Zodíaco e Elementos", ar: "الأبراج والعناصر", hi: "राशि व पंचतत्व", gu: "રાશિ અને તત્વો" },
        links: [
          { label: { en: "Fire & Air Sign Harmony", de: "Feuer & Luft", fr: "Feu et Air", ja: "火と風の星座相性", es: "Signos de Fuego y Aire", pt: "Signos de Fogo e Ar", ar: "توافق النار والهواء", hi: "अग्नि व वायु राशि मेल", gu: "અગ્નિ અને વાયુ રાશિ મેલ" }, href: "/love-tools#fire-air" },
          { label: { en: "Earth & Water Sign Harmony", de: "Erde & Wasser", fr: "Terre et Eau", ja: "地と水の星座相性", es: "Signos de Tierra y Agua", pt: "Signos de Terra e Água", ar: "توافق الأرض والماء", hi: "पृथ्वी व जल राशि मेल", gu: "પૃથ્વી અને જળ રાશિ મેલ" }, href: "/love-tools#earth-water" },
          { label: { en: "Vedic Kundali Milan", de: "Kundali Milan", fr: "Kundali Milan védique", ja: "ヴェーダ占星術相性", es: "Kundali Milan Védico", pt: "Kundali Milan Védico", ar: "كوندالي ميلان الفيدي", hi: "वैदिक 36 गुण मिलान", gu: "વૈદિક 36 ગુણ મિલન" }, href: "/astrology#guna-milan" },
        ],
      },
      {
        title: { en: "Numerology & Energy", de: "Numerologie", fr: "Numérologie", ja: "数秘術と運命数", es: "Numerología", pt: "Numerologia", ar: "علم الأرقام والطاقة", hi: "अंकशास्त्र व मूलांक", gu: "અંકશાસ્ત્ર અને ઉર્જા" },
        links: [
          { label: { en: "Life Path Compatibility", de: "Lebensweg-Kompatibilität", fr: "Chemin de vie", ja: "ライフパスナンバー相性", es: "Compatibilidad del Camino de Vida", pt: "Caminho de Vida", ar: "توافق مسار الحياة", hi: "मूलांक व भाग्यांक मिलान", gu: "મૂળાંક અને ભાગ્યાંક મિલન" }, href: "/love-tools#numerology" },
          { label: { en: "Astrology Birth Charts", de: "Geburtshoroskope", fr: "Thèmes astraux", ja: "出生図ホロスコープ", es: "Cartas Astrales", pt: "Mapas Astrais", ar: "مخططات الولادة الفلكية", hi: "जन्म कुंडली विश्लेषण", gu: "જન્મ કુંડળી વિશ્લેષણ" }, href: "/astrology" },
          { label: { en: "General Utilities", de: "Allgemeine Werkzeuge", fr: "Outils généraux", ja: "一般実用ツール", es: "Herramientas Generales", pt: "Ferramentas Gerais", ar: "الأدوات العامة", hi: "अन्य उपयोगी टूल्स", gu: "અન્ય ઉપયોગી ટૂલ્સ" }, href: "/" },
        ],
      },
    ],
    relatedEcosystems: ["astrology", "general-tools", "festivals"],
  },
};

/**
 * Detects the current product ecosystem based on the URL pathname.
 */
export function detectEcosystem(pathname: string): EcosystemId {
  const clean = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  const segments = clean.split("/").filter(Boolean);
  // remove locale segment if present
  const route = segments.length > 1 ? segments.slice(1).join("/") : segments[0] || "";

  if (route.startsWith("calendar/gujarati-calendar") || route.startsWith("gujarati-calendar")) return "gujarati-calendar";
  if (route.startsWith("calendar/hindu-calendar") || route.startsWith("hindu-calendar")) return "hindu-calendar";
  if (route === "calendar" || route.startsWith("calendar/")) return "hindu-calendar";
  if (route.startsWith("panchang")) return "panchang";
  if (route.startsWith("festivals") || route.startsWith("holidays")) return "festivals";
  if (route.startsWith("devotional")) return "devotional";
  if (route.startsWith("astrology")) return "astrology";
  if (route.startsWith("love-tools") || route.startsWith("love")) return "love-tools";

  // General tools categories: alarm, timer, stopwatch, world-clock, date-calendar, calculators, productivity, converters, finance, text
  return "general-tools";
}

/**
 * Returns structured cross-niche relationship bridges for internal linking.
 */
export type CrossNicheBridge = {
  anchorTitle: Record<AppLocale, string>;
  categoryTag: Record<AppLocale, string>;
  description: Record<AppLocale, string>;
  href: string;
};

export const CROSS_NICHE_RELATIONSHIPS: Record<string, CrossNicheBridge[]> = {
  diwali: [
    {
      anchorTitle: { en: "Hindu Calendar (Kartik Month)", de: "Hindukalender (Kartik)", fr: "Calendrier hindou (Kartik)", ja: "ヒンドゥー暦（カルティク月）", es: "Calendario Hindú (Kartik)", pt: "Calendário Hindu (Kartik)", ar: "التقويم الهندوسي (شهر كارتيك)", hi: "हिन्दू पंचांग (कार्तिक मास)", gu: "હિન્દુ પંચાંગ (કારતક માસ)" },
      categoryTag: { en: "Calendar Date", de: "Datum", fr: "Date", ja: "暦日", es: "Fecha", pt: "Data", ar: "التاريخ", hi: "कैलेंडर तिथि", gu: "કેલેન્ડર તિથિ" },
      description: { en: "Observe the lunar Amavasya phase of Kartik month according to Vikram Samvat.", de: "Beobachten Sie die Amavasya-Mondphase.", fr: "Observer la phase d'Amavasya du mois de Kartik.", ja: "ヴィクラム暦カルティク月の新月（アマヴァスヤ）の日程。", es: "Observar la fase de Amavasya del mes de Kartik.", pt: "Observar a fase de Amavasya do mês de Kartik.", ar: "مراقبة طور المحاق القمري لشهر كارتيك.", hi: "कार्तिक मास की दर्श अमावस्या की सही खगोलीय तिथि देखें।", gu: "કારતક માસની દર્શ અમાસની સચોટ ખગોળીય તિથિ જુઓ." },
      href: "/calendar/hindu-calendar#diwali-date",
    },
    {
      anchorTitle: { en: "Diwali Lakshmi Puja Vidhi", de: "Lakshmi Puja Vidhi", fr: "Lakshmi Puja Vidhi", ja: "ラクシュミー・プージャー作法", es: "Puja Vidhi de Lakshmi", pt: "Puja Vidhi de Lakshmi", ar: "طقوس لاكشمي بوجا", hi: "दीपावली लक्ष्मी पूजन विधि", gu: "દિવાળી લક્ષ્મી પૂજન વિધિ" },
      categoryTag: { en: "Puja Vidhi", de: "Ritual", fr: "Rituel", ja: "礼拝作法", es: "Ritual", pt: "Ritual", ar: "الطقوس", hi: "पूजा विधि", gu: "પૂજા વિધિ" },
      description: { en: "Step-by-step authentic rituals, samagri list, and pradosh kaal muhurat for Lakshmi puja.", de: "Schritt-für-Schritt Ritual.", fr: "Rituels pas à pas pour Lakshmi puja.", ja: "プラドーシャ吉時におけるラクシュミー女神の礼拝手順。", es: "Ritual paso a paso para la puja de Lakshmi.", pt: "Ritual passo a passo para a puja de Lakshmi.", ar: "خطوات طقوس بوجا لاكشمي وقائمة المستلزمات.", hi: "प्रदोष काल एवं स्थिर लग्न में महालक्ष्मी पूजन की सम्पूर्ण प्रामाणिक विधि।", gu: "પ્રદોષ કાળ અને સ્થિર લગ્નમાં મહાલક્ષ્મી પૂજનની સંપૂર્ણ પ્રામાણિક વિધિ." },
      href: "/devotional#lakshmi-puja-vidhi",
    },
    {
      anchorTitle: { en: "Shri Lakshmi Aarti", de: "Lakshmi Aarti", fr: "Lakshmi Aarti", ja: "ラクシュミー・アールティー讃歌", es: "Aarti de Lakshmi", pt: "Aarti de Lakshmi", ar: "لاكشمي أرتي", hi: "श्री महालक्ष्मी जी की आरती", gu: "શ્રી મહાલક્ષ્મી માતાની આરતી" },
      categoryTag: { en: "Aarti", de: "Aarti", fr: "Aarti", ja: "アールティー", es: "Aarti", pt: "Aarti", ar: "أرتي", hi: "आरती", gu: "આરતી" },
      description: { en: "Om Jai Lakshmi Mata devotional lyrics, translation, and recitation guide.", de: "Om Jai Lakshmi Mata.", fr: "Paroles et chant de Om Jai Lakshmi Mata.", ja: "「オーム・ジャイ・ラクシュミー・マータ」のサンスクリット歌詞と解説。", es: "Letra de Om Jai Lakshmi Mata.", pt: "Letra de Om Jai Lakshmi Mata.", ar: "كلمات أوم جاي لاكشمي ماتا.", hi: "ॐ जय लक्ष्मी माता - शुद्ध पाठ, अर्थ एवं संध्या आरती।", gu: "ઓમ જય લક્ષ્મી માતા - શુદ્ધ પાઠ, અર્થ અને સંધ્યા આરતી." },
      href: "/devotional#lakshmi-aarti",
    },
    {
      anchorTitle: { en: "Upcoming Winter Festivals", de: "Kommende Winterfeste", fr: "Fêtes d'hiver à venir", ja: "冬の祝祭日一覧", es: "Próximas Fiestas de Invierno", pt: "Próximos Festivais de Inverno", ar: "مهرجانات الشتاء القادمة", hi: "आगामी शीतकालीन पर्व", gu: "આગામી શિયાળુ પર્વ" },
      categoryTag: { en: "Festivals", de: "Feste", fr: "Festivals", ja: "祝祭日", es: "Festivales", pt: "Festivais", ar: "المهرجانات", hi: "त्योहार", gu: "તહેવારો" },
      description: { en: "Govardhan Puja, Bhai Dooj, Chhath Puja, and Tulsi Vivah countdowns.", de: "Festdaten.", fr: "Govardhan Puja, Bhai Dooj et Chhath Puja.", ja: "ゴーヴァルダン・プージャーやバイ・ドゥージの日程。", es: "Govardhan Puja y Bhai Dooj.", pt: "Govardhan Puja e Bhai Dooj.", ar: "مواعيد غوفاردهان بوجا وبهاي دوج.", hi: "गोवर्धन पूजा, भाई दूज, छठ पूजा और तुलसी विवाह की तिथियाँ।", gu: "ગોવર્ધન પૂજા, ભાઈબીજ, છઠ પૂજા અને તુલસી વિવાહની તારીખો." },
      href: "/festivals#upcoming",
    },
  ],
  panchang: [
    {
      anchorTitle: { en: "Tithi & Lunar Day Calculator", de: "Tithi Rechner", fr: "Calculateur de Tithi", ja: "ティティ月日計算機", es: "Calculadora de Tithi", pt: "Calculadora de Tithi", ar: "حاسبة تيتي القمرية", hi: "तिथि व चंद्र दिवस", gu: "તિથિ અને ચંદ્ર દિવસ" },
      categoryTag: { en: "Pancha Anga", de: "Panchang", fr: "Panchang", ja: "要素", es: "Panchang", pt: "Panchang", ar: "بانتشانغ", hi: "पंचांग अंग", gu: "પંચાંગ અંગ" },
      description: { en: "Exact beginning and ending moments of Pratipada to Purnima/Amavasya.", de: "Mondphasen.", fr: "Moments exacts du début et de la fin de la Tithi.", ja: "プラティパダーから満月・新月までの正確な開始・終了時刻。", es: "Momentos exactos de la Tithi.", pt: "Momentos exatos da Tithi.", ar: "المواعيد الدقيقة لبداية ونهاية التيتي.", hi: "प्रतिपदा से पूर्णिमा/अमावस्या तक तिथि के प्रारंभ व समाप्ति का सूक्ष्म समय।", gu: "એકમથી પૂનમ/અમાસ સુધી તિથિના પ્રારંભ અને સમાપ્તિનો ચોક્કસ સમય." },
      href: "/panchang#tithi",
    },
    {
      anchorTitle: { en: "27 Nakshatras & Planetary Lords", de: "27 Nakshatras", fr: "27 Nakshatras et seigneurs", ja: "27ナクシャトラと支配星", es: "27 Nakshatras", pt: "27 Nakshatras", ar: "27 ناكشاترا والكواكب", hi: "27 नक्षत्र एवं ग्रह स्वामी", gu: "27 નક્ષત્ર અને ગ્રહ સ્વામી" },
      categoryTag: { en: "Constellations", de: "Sterne", fr: "Constellations", ja: "月宿", es: "Constelaciones", pt: "Constelações", ar: "المنازل القمرية", hi: "नक्षत्र चक्र", gu: "નક્ષત્ર ચક્ર" },
      description: { en: "Explore Ashwini through Revati, their ruling deities, padas, and auspicious activities.", de: "Nakshatra Analyse.", fr: "Explorer les 27 Nakshatras d'Ashwini à Revati.", ja: "アシュヴィニーからレーヴァティーまでの27宿と神格・吉事。", es: "Explora los 27 Nakshatras.", pt: "Explorar os 27 Nakshatras.", ar: "استكشف منازل القمر من أشويني إلى ريفاتي.", hi: "अश्विनी से रेवती तक 27 नक्षत्रों का प्रभाव, देवता और शुभ कार्य।", gu: "અશ્વિનીથી રેવતી સુધી 27 નક્ષત્રોનો પ્રભાવ, દેવતા અને શુભ કાર્ય." },
      href: "/astrology#nakshatra",
    },
    {
      anchorTitle: { en: "Hindu Calendar Month View", de: "Monatskalender", fr: "Vue mensuelle du calendrier", ja: "月別カレンダー表示", es: "Vista Mensual del Calendario", pt: "Visão Mensal do Calendário", ar: "عرض الشهر في التقويم", hi: "मासिक हिन्दू पंचांग दृश्य", gu: "માસિક હિન્દુ પંચાંગ દૃશ્ય" },
      categoryTag: { en: "Calendar", de: "Kalender", fr: "Calendrier", ja: "暦", es: "Calendario", pt: "Calendário", ar: "التقويم", hi: "कैलेंडर", gu: "કેલેન્ડર" },
      description: { en: "Comprehensive grid showing Paksha, Ekadashi, Pradosh, and monthly festivals.", de: "Monatsübersicht.", fr: "Grille mensuelle avec Paksha et jeûnes.", ja: "シュクラ・パクラ、クリシュナ・パクラの各日と祝祭日の月間グリッド。", es: "Cuadrícula con Paksha y festivos.", pt: "Grade mensal com Paksha e festivais.", ar: "جدول شهري يوضح الباكشا والأعياد.", hi: "शुक्ल व कृष्ण पक्ष, एकादशी, प्रदोष और मासिक त्योहारों का संपूर्ण चक्र।", gu: "શુક્લ અને કૃષ્ણ પક્ષ, એકાદશી, પ્રદોષ અને માસિક તહેવારોનું સંપૂર્ણ ચક્ર." },
      href: "/calendar/hindu-calendar",
    },
  ],
  "love-tools": [
    {
      anchorTitle: { en: "Zodiac Signs Elemental Compatibility", de: "Tierkreis-Kompatibilität", fr: "Compatibilité des éléments du zodiaque", ja: "星座のエレメント相性", es: "Compatibilidad Elemental del Zodíaco", pt: "Compatibilidade Elemental", ar: "توافق عناصر الأبراج", hi: "राशि व तत्व अनुकूलता", gu: "રાશિ અને તત્વ સુસંગતતા" },
      categoryTag: { en: "Astrology", de: "Astrologie", fr: "Astrologie", ja: "占星術", es: "Astrología", pt: "Astrologia", ar: "التنجيم", hi: "ज्योतिष", gu: "જ્યોતિષ" },
      description: { en: "Compare Fire, Earth, Air, and Water temperament blends for romantic longevity.", de: "Elemente-Analyse.", fr: "Harmonie des tempéraments Feu, Terre, Air et Eau.", ja: "火・地・風・水の4大エレメントの調和と恋愛の長期的相性。", es: "Compara el temperamento de los elementos.", pt: "Harmonia dos elementos no amor.", ar: "مقارنة طبائع النار والأرض والهواء والماء في العلاقات.", hi: "अग्नि, पृथ्वी, वायु और जल तत्व के आधार पर स्वभाव व प्रेम का मिलान।", gu: "અગ્નિ, પૃથ્વી, વાયુ અને જળ તત્વના આધારે સ્વભાવ અને પ્રેમનો મેળ." },
      href: "/love-tools#zodiac-compatibility",
    },
    {
      anchorTitle: { en: "Vedic 36 Guna Milan Matching", de: "36 Guna Milan", fr: "36 Guna Milan védique", ja: "ヴェーダ36点法グナ・ミーラン", es: "36 Guna Milan Védico", pt: "36 Guna Milan Védico", ar: "36 غونا ميلان الفيدي", hi: "वैदिक 36 गुण मिलान", gu: "વૈદિક 36 ગુણ મિલન" },
      categoryTag: { en: "Kundali Milan", de: "Kundali", fr: "Kundali", ja: "クンダリー", es: "Kundali", pt: "Kundali", ar: "كوندالي", hi: "विवाह मिलान", gu: "વિવાહ મિલન" },
      description: { en: "Deep Ashta Koota marital compatibility analysis based on Moon constellations.", de: "Ehekompatibilität.", fr: "Analyse Ashta Koota de compatibilité matrimoniale.", ja: "月のナクシャトラに基づく伝統的なアシュタ・クータ婚姻相性診断。", es: "Análisis matrimonial profundo Ashta Koota.", pt: "Análise Ashta Koota de compatibilidade.", ar: "تحليل توافق الزواج العميق استناداً إلى القمر.", hi: "वर-वधू के चंद्र नक्षत्र पर आधारित अष्टकूट मेलापक एवं दोष परिहार।", gu: "વર-કન્યાના ચંદ્ર નક્ષત્ર આધારિત અષ્ટકૂટ મેળાપક અને દોષ પરિહાર." },
      href: "/astrology#guna-milan",
    },
    {
      anchorTitle: { en: "Life Path Numerology Match", de: "Lebensweg-Numerologie", fr: "Numérologie du chemin de vie", ja: "運命数（ライフパス）相性", es: "Numerología del Camino de Vida", pt: "Numerologia do Caminho de Vida", ar: "توافق مسار الحياة الرقمي", hi: "मूलांक अंकशास्त्र मिलान", gu: "મૂળાંક અંકશાસ્ત્ર મિલન" },
      categoryTag: { en: "Numerology", de: "Numerologie", fr: "Numérologie", ja: "数秘術", es: "Numerología", pt: "Numerologia", ar: "علم الأرقام", hi: "अंकज्योतिष", gu: "અંકશાસ્ત્ર" },
      description: { en: "Discover how birth date vibration numbers interact in companionship and marriage.", de: "Zahlenschwingungen.", fr: "Découvrez comment les vibrations des dates de naissance s'accordent.", ja: "誕生日の数字が持つエネルギーと2人の波長の一致度を測定。", es: "Vibraciones numéricas de nacimiento.", pt: "Vibrações numéricas de nascimento.", ar: "اكتشف طاقة أرقام تاريخ الميلاد في التوافق العاطفي.", hi: "जन्म तिथि के मूलांकों की ऊर्जा और दांपत्य जीवन में उनकी अनुकूलता।", gu: "જન્મ તારીખના મૂળાંકની ઊર્જા અને દાંપત્ય જીવનમાં સુસંગતતા." },
      href: "/love-tools#numerology",
    },
  ],
};
