import type { ToolCategoryId } from "@/data/tool-schema";
import { getCategoryMeta } from "@/data/tools";
import type { AppLocale } from "./config";

type Cat = { label: string; description: string };

const OVERRIDES: Partial<
  Record<Exclude<AppLocale, "en">, Record<ToolCategoryId, Cat>>
> = {
  de: {
    alarm: {
      label: "Wecker",
      description:
        "Online-Wecker mit Sound und optionalen Browser-Benachrichtigungen.",
    },
    timer: {
      label: "Timer",
      description:
        "Countdown mit voreingestellten Dauern für typische Aufgaben.",
    },
    stopwatch: {
      label: "Stoppuhr",
      description: "Zeit mit einer einfachen Stoppuhr messen.",
    },
    "world-clock": {
      label: "Weltzeit",
      description: "Aktuelle Uhrzeit in großen Städten weltweit.",
    },
    "date-calendar": {
      label: "Datum & Kalender",
      description: "Altersrechner, Datumsdifferenz, Werktage und Kalenderwerkzeuge.",
    },
    calculators: {
      label: "Rechner",
      description: "Prozentrechner, Einheitenumrechner und praktische Alltagshilfen.",
    },
    productivity: {
      label: "Produktivität",
      description: "Schlafzyklusrechner, Pomodoro-Fokus, Intervall-Timer und Routinehelfer.",
    },
    converters: {
      label: "Einheitenumrechner",
      description: "Flächen-, Volumen-, Druck-, Energie- und praktische Einheitenumrechner.",
    },
    finance: {
      label: "Finanzrechner",
      description: "Kredit-EMI-, Zinseszins-, Mehrwertsteuer-, Gewinn- und Sparzielrechner.",
    },
    text: {
      label: "Textwerkzeuge",
      description: "Wortzähler, Zeichenzähler, Groß-/Kleinschreibung und Text-Diff-Checker.",
    },
  },
  fr: {
    alarm: {
      label: "Réveil",
      description:
        "Réveil en ligne avec son et notifications navigateur optionnelles.",
    },
    timer: {
      label: "Minuteur",
      description: "Compte à rebours avec durées préréglées pour les tâches courantes.",
    },
    stopwatch: {
      label: "Chronomètre",
      description: "Mesurez le temps avec un chronomètre simple.",
    },
    "world-clock": {
      label: "Horloge mondiale",
      description: "Heure actuelle dans les grandes villes du monde.",
    },
    "date-calendar": {
      label: "Date et calendrier",
      description: "Calculateur d'âge, écart entre dates, jours ouvrés et outils calendrier.",
    },
    calculators: {
      label: "Calculatrices",
      description: "Calculateur de pourcentage, convertisseur d'unités et calculatrices utiles.",
    },
    productivity: {
      label: "Productivité",
      description: "Cycles de sommeil, minuteur Pomodoro, intervalles et planification.",
    },
    converters: {
      label: "Convertisseurs",
      description: "Convertisseur de surface, volume, pression, énergie et unités de mesure.",
    },
    finance: {
      label: "Calculatrices financières",
      description: "Calculateur de mensualité de prêt, intérêts composés, TVA, marge et épargne.",
    },
    text: {
      label: "Outils de texte",
      description: "Compteur de mots, de caractères, conversion de casse et comparateur de texte.",
    },
  },
  ja: {
    alarm: {
      label: "アラーム",
      description: "音と任意のブラウザ通知付きのオンラインアラーム。",
    },
    timer: {
      label: "タイマー",
      description: "よく使う作業向けのプリセット時間でカウントダウン。",
    },
    stopwatch: {
      label: "ストップウォッチ",
      description: "シンプルなストップウォッチで経過時間を計測。",
    },
    "world-clock": {
      label: "世界時計",
      description: "世界の主要都市の現在時刻を表示。",
    },
    "date-calendar": {
      label: "日付とカレンダー",
      description: "年齢計算、日数差、営業日計算、うるう年などの日付ツール。",
    },
    calculators: {
      label: "電卓・計算機",
      description: "パーセント計算、単位換算、基本電卓などの実用ツール。",
    },
    productivity: {
      label: "生産性ツール",
      description: "睡眠サイクル、ポモドーロタイマー、インターバル測定。",
    },
    converters: {
      label: "単位換算ツール",
      description: "面積、体積、圧力、エネルギー、データ容量などの単位を素早く換算。",
    },
    finance: {
      label: "金融・財務計算機",
      description: "ローン返済額（EMI）、複利計算、消費税・VAT、目標貯金計算。",
    },
    text: {
      label: "テキストツール",
      description: "文字数カウント、単語数、大文字小文字変換、差分比較ツール。",
    },
  },
  es: {
    alarm: {
      label: "Alarma",
      description:
        "Alarma en línea con sonido y notificaciones opcionales del navegador.",
    },
    timer: {
      label: "Temporizador",
      description: "Cuenta atrás con duraciones predefinidas para tareas habituales.",
    },
    stopwatch: {
      label: "Cronómetro",
      description: "Mide el tiempo con un cronómetro sencillo.",
    },
    "world-clock": {
      label: "Reloj mundial",
      description: "Hora actual en grandes ciudades del mundo.",
    },
    "date-calendar": {
      label: "Fecha y calendario",
      description: "Calculadora de edad, diferencia de fechas, días hábiles y más.",
    },
    calculators: {
      label: "Calculadoras",
      description: "Calculadora de porcentajes, conversión de unidades y operaciones.",
    },
    productivity: {
      label: "Productividad",
      description: "Calculadora de ciclos de sueño, Pomodoro, intervalos y rutinas.",
    },
    converters: {
      label: "Conversores",
      description: "Conversores de área, volumen, presión, energía, potencia y almacenamiento.",
    },
    finance: {
      label: "Calculadoras financieras",
      description: "Calculadora de préstamos EMI, interés compuesto, IVA, margen y ahorro.",
    },
    text: {
      label: "Herramientas de texto",
      description: "Contador de palabras, caracteres, conversor de mayúsculas y comparador de texto.",
    },
  },
  pt: {
    alarm: {
      label: "Alarme",
      description:
        "Alarme online com som e notificações opcionais do navegador.",
    },
    timer: {
      label: "Temporizador",
      description: "Contagem decrescente com durações predefinidas para tarefas comuns.",
    },
    stopwatch: {
      label: "Cronómetro",
      description: "Meça o tempo com um cronómetro simples.",
    },
    "world-clock": {
      label: "Relógio mundial",
      description: "Hora atual nas principais cidades do mundo.",
    },
    "date-calendar": {
      label: "Data e calendário",
      description: "Calculadora de idade, diferença de datas, dias úteis e calendário.",
    },
    calculators: {
      label: "Calculadoras",
      description: "Calculadora de percentagem, conversão de unidades e cálculos gerais.",
    },
    productivity: {
      label: "Produtividade",
      description: "Ciclos de sono, temporizador Pomodoro, treinos intervalados e foco.",
    },
    converters: {
      label: "Conversores",
      description: "Conversores de área, volume, pressão, energia, potência e grandezas.",
    },
    finance: {
      label: "Calculadoras financeiras",
      description: "Calculadora de empréstimo EMI, juros compostos, IVA, margem e metas de poupança.",
    },
    text: {
      label: "Ferramentas de texto",
      description: "Contador de palavras, caracteres, conversor de maiúsculas e comparador.",
    },
  },
  ar: {
    alarm: {
      label: "منبّه",
      description: "منبّه عبر المتصفح مع صوت وإشعارات اختيارية.",
    },
    timer: {
      label: "مؤقّت",
      description: "عدّ تنازلي بمدد جاهزة للمهام اليومية.",
    },
    stopwatch: {
      label: "ساعة توقيف",
      description: "قِس الوقت بساعة توقيف بسيطة.",
    },
    "world-clock": {
      label: "ساعة عالمية",
      description: "الوقت الحالي في كبرى المدن حول العالم.",
    },
    "date-calendar": {
      label: "التاريخ والتقويم",
      description: "حساب العمر وفارق الأيام وأيام العمل وأدوات التقويم.",
    },
    calculators: {
      label: "آلات حاسبة",
      description: "حاسبة النسبة المئوية ومحوّل الوحدات والعمليات الحسابية.",
    },
    productivity: {
      label: "الإنتاجية",
      description: "حساب دورات النوم ومؤقت بومودورو والفترات الزمنية.",
    },
    converters: {
      label: "محولات الوحدات",
      description: "محولات قياس المساحة والحجم والضغط والطاقة وسعة التخزين والوحدات.",
    },
    finance: {
      label: "حاسبات مالية",
      description: "حساب أقساط القروض والفوائد المركبة وضريبة القيمة المضافة ونقطة التعادل.",
    },
    text: {
      label: "أدوات النصوص",
      description: "عدّاد الكلمات والحروف، تحويل الأحرف الكبيرة والصغيرة ومقارنة النصوص.",
    },
  },
  hi: {
    alarm: {
      label: "अलार्म घड़ी",
      description: "ध्वनि और वैकल्पिक ब्राउज़र सूचनाओं के साथ ऑनलाइन अलार्म।",
    },
    timer: {
      label: "टाइमर",
      description: "सामान्य कामों के लिए पूर्वनिर्धारित अवधि के साथ उलटी गिनती।",
    },
    stopwatch: {
      label: "स्टॉपवॉच",
      description: "सरल स्टॉपवॉच के साथ समय मापें।",
    },
    "world-clock": {
      label: "विश्व घड़ी",
      description: "दुनिया के बड़े शहरों में वर्तमान समय देखें।",
    },
    "date-calendar": {
      label: "दिनांक और कैलेंडर",
      description: "आयु कैलकुलेटर, दो तिथियों के बीच अंतर, कार्य दिवस और कैलेंडर टूल्स।",
    },
    calculators: {
      label: "कैलकुलेटर",
      description: "प्रतिशत कैलकुलेटर, इकाई कनवर्टर और उपयोगी दैनिक कैलकुलेटर।",
    },
    productivity: {
      label: "उत्पादकता टूल्स",
      description: "नींद चक्र कैलकुलेटर, पोमोडोरो टाइमर, अंतराल टाइमर और दिनचर्या सहायक।",
    },
    converters: {
      label: "इकाई कनवर्टर",
      description: "क्षेत्रफल, आयतन, दबाव, ऊर्जा, शक्ति और डेटा भंडारण इकाइयों का सटीक रूपांतरण।",
    },
    finance: {
      label: "वित्तीय कैलकुलेटर",
      description: "ऋण ईएमआई, चक्रवृद्धि ब्याज, जीएसटी, वैट, लाभ मार्जिन और बचत लक्ष्य कैलकुलेटर।",
    },
    text: {
      label: "टेक्स्ट टूल्स",
      description: "शब्द काउंटर, वर्ण गणना, केस कनवर्टर, रिक्त स्थान हटाने वाले और टेक्स्ट तुलना टूल्स।",
    },
  },
  gu: {
    alarm: {
      label: "અલાર્મ ઘડિયાળ",
      description: "અવાજ અને વૈકલ્પિક બ્રાઉઝર નોટિફિકેશન સાથે ચોક્કસ ઓનલાઇન અલાર્મ.",
    },
    timer: {
      label: "ટાઈમર",
      description: "સામાન્ય કાર્યો માટે પૂર્વનિર્ધારિત સમય સાથે કાઉન્ટડાઉન ટાઈમર.",
    },
    stopwatch: {
      label: "સ્ટોપવોચ",
      description: "સરળ અને સચોટ સ્ટોપવોચ વડે લેપ અને સમય માપો.",
    },
    "world-clock": {
      label: "વિશ્વ ઘડિયાળ",
      description: "દુનિયાના મુખ્ય શહેરોમાં વર્તમાન સમય અને ટાઈમ ઝોન જુઓ.",
    },
    "date-calendar": {
      label: "તારીખ અને કેલેન્ડર",
      description: "ઉંમર કેલ્ક્યુલેટર, બે તારીખો વચ્ચેનો તફાવત, કાર્યકારી દિવસો અને કેલેન્ડર ટૂલ્સ.",
    },
    calculators: {
      label: "કેલ્ક્યુલેટર",
      description: "ટકાવારી કેલ્ક્યુલેટર, એકમ કન્વર્ટર અને દૈનિક ઉપયોગી ગણતરી સાધનો.",
    },
    productivity: {
      label: "ઉત્પાદકતા ટૂલ્સ",
      description: "ઊંઘ ચક્ર કેલ્ક્યુલેટર, પોમોડોરો ટાઈમર, ઈન્ટરવલ ટાઈમર અને દિનચર્યા સહાયક.",
    },
    converters: {
      label: "એકમ કન્વર્ટર",
      description: "ક્ષેત્રફળ, કદ, દબાણ, ઊર્જા, પાવર અને ડેટા સ્ટોરેજ એકમોનું સચોટ રૂપાંતરણ.",
    },
    finance: {
      label: "નાણાકીય કેલ્ક્યુલેટર",
      description: "લોન EMI, ચક્રવૃદ્ધિ વ્યાજ, GST, VAT, નફાનો માર્જિન અને બચત લક્ષ્ય કેલ્ક્યુલેટર.",
    },
    text: {
      label: "ટેક્સ્ટ ટૂલ્સ",
      description: "શબ્દ કાઉન્ટર, અક્ષર ગણતરી, કેસ કન્વર્ટર, સ્પેસ રીમુવર અને ટેક્સ્ટ તુલના ટૂલ્સ.",
    },
  },
};

export function getLocalizedCategoryMeta(
  locale: AppLocale,
  category: ToolCategoryId,
): { label: string; description: string } {
  const base = getCategoryMeta(category);
  if (locale === "en") {
    return { label: base.label, description: base.description };
  }
  const o = OVERRIDES[locale]?.[category];
  if (o) return o;
  return { label: base.label, description: base.description };
}
