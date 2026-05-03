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
