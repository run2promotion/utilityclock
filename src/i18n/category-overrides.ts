import type { ToolCategoryId } from "@/data/tool-schema";
import { getCategoryMeta } from "@/data/tools";
import type { AppLocale } from "./config";

type Cat = {
  label: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
};

const OVERRIDES: Partial<
  Record<Exclude<AppLocale, "en">, Record<ToolCategoryId, Cat>>
> = {
  de: {
    alarm: {
      label: "Wecker",
      description:
        "Online-Wecker mit Sound und optionalen Browser-Benachrichtigungen.",
      seoTitle: "Online-Wecker - Wecker mit lautem Ton & Schlummerfunktion",
      seoDescription:
        "Kostenloser Online-Wecker mit lautem Weckton, sanften Wecktönen, Schlummerfunktion und Audio-Alarm. Tab im Browser geöffnet lassen für pünktliches Wecken.",
    },
    timer: {
      label: "Timer",
      description:
        "Countdown mit voreingestellten Dauern für typische Aufgaben.",
      seoTitle: "Online-Timer - Kostenloser Vollbild-Countdown mit Ton",
      seoDescription:
        "Kostenloser Online-Countdown-Timer mit akustischem Alarm, visuellem Ring und frei einstellbaren Minuten oder Sekunden. Mit ablenkungsfreiem Vollbildmodus im Browser.",
    },
    stopwatch: {
      label: "Stoppuhr",
      description: "Zeit mit einer einfachen Stoppuhr messen.",
      seoTitle: "Online-Stoppuhr - Rundenzeit-Timer mit Millisekunden",
      seoDescription:
        "Präzise Online-Stoppuhr mit Millisekunden, Rundenzeiten, Zwischenzeiten und Vollbildmodus für Sport, Training und Studium.",
    },
    "world-clock": {
      label: "Weltzeit",
      description: "Aktuelle Uhrzeit in großen Städten weltweit.",
      seoTitle: "Weltzeit - Aktuelle Uhrzeit in Städten weltweit",
      seoDescription:
        "Genaue Uhrzeiten, Zeitzonen, UTC-Offsets und Sommerzeit aller wichtigen Städte weltweit vergleichen und im Blick behalten.",
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
      seoTitle: "Réveil en ligne - Alarme gratuite avec son fort et répétition",
      seoDescription:
        "Réveil en ligne gratuit avec sonneries puissantes, répétition (snooze) et alertes sonores. Gardez l'onglet ouvert pour être réveillé à l'heure.",
    },
    timer: {
      label: "Minuteur",
      description: "Compte à rebours avec durées préréglées pour les tâches courantes.",
      seoTitle: "Minuteur en ligne - Compte à rebours plein écran avec sonnerie",
      seoDescription:
        "Minuteur compte à rebours gratuit avec sonnerie d'alarme, anneau visuel et durées personnalisables. Mode plein écran disponible dans votre navigateur.",
    },
    stopwatch: {
      label: "Chronomètre",
      description: "Mesurez le temps avec un chronomètre simple.",
      seoTitle: "Chronomètre en ligne - Chronomètre précis avec temps au tour",
      seoDescription:
        "Chronomètre en ligne gratuit avec précision à la milliseconde, tours de piste et affichage plein écran pour le sport et l'étude.",
    },
    "world-clock": {
      label: "Horloge mondiale",
      description: "Heure actuelle dans les grandes villes du monde.",
      seoTitle: "Horloge mondiale - Heure locale exacte dans le monde entier",
      seoDescription:
        "Consultez l'heure actuelle, les fuseaux horaires, les décalages UTC et l'heure d'été des grandes villes du monde en direct.",
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
      seoTitle: "オンライン目覚まし時計 - 音が鳴る無料アラーム（スヌーズ付き）",
      seoDescription:
        "大きな音とスヌーズ機能を備えた無料のオンライン目覚まし時計。時間通りに鳴らすためブラウザのタブを開いたままご使用ください。",
    },
    timer: {
      label: "タイマー",
      description: "よく使う作業向けのプリセット時間でカウントダウン。",
      seoTitle: "オンラインタイマー - 音付き無料全画面カウントダウン",
      seoDescription:
        "大きなアラーム音と進捗リング表示を備えた無料のオンラインカウントダウンタイマー。ブラウザの全画面表示に対応。",
    },
    stopwatch: {
      label: "ストップウォッチ",
      description: "シンプルなストップウォッチで経過時間を計測。",
      seoTitle: "オンラインストップウォッチ - ミリ秒・ラップ計測対応",
      seoDescription:
        "1/1000秒単位のミリ秒計測とラップタイム記録に対応した無料のオンラインストップウォッチ。スポーツや勉強に最適。",
    },
    "world-clock": {
      label: "世界時計",
      description: "世界の主要都市の現在時刻を表示。",
      seoTitle: "世界時計 - 世界主要都市の現在時刻とタイムゾーン",
      seoDescription:
        "世界各都市の正確な現地時間、タイムゾーン、時差、サマータイム情報をリアルタイムで確認・比較できます。",
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
      seoTitle: "Despertador online - Alarma con sonido fuerte y función snooze",
      seoDescription:
        "Alarma despertador online gratis con sonido fuerte, avisos sonoros y opción de posponer. Mantén la pestaña del navegador abierta para sonar a tiempo.",
    },
    timer: {
      label: "Temporizador",
      description: "Cuenta atrás con duraciones predefinidas para tareas habituales.",
      seoTitle: "Temporizador online - Cuenta atrás a pantalla completa con sonido",
      seoDescription:
        "Temporizador gratuito con alarma sonora fuerte, anillo visual y minutos o segundos personalizables. Modo pantalla completa disponible en el navegador.",
    },
    stopwatch: {
      label: "Cronómetro",
      description: "Mide el tiempo con un cronómetro sencillo.",
      seoTitle: "Cronómetro online - Medidor de tiempo con milisegundos y vueltas",
      seoDescription:
        "Cronómetro online de alta precisión con milisegundos, registro de vueltas y modo pantalla completa para entrenamientos y estudio.",
    },
    "world-clock": {
      label: "Reloj mundial",
      description: "Hora actual en grandes ciudades del mundo.",
      seoTitle: "Reloj mundial - Hora local exacta en ciudades de todo el mundo",
      seoDescription:
        "Consulta la hora actual en tiempo real, husos horarios, desfase UTC y cambios de horario en las principales ciudades del mundo.",
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
      seoTitle: "Despertador online - Alarme com som alto e modo soneca",
      seoDescription:
        "Despertador online grátis com toque sonoro alto, modo soneca e alertas de áudio. Mantenha a aba do navegador aberta para despertar na hora certa.",
    },
    timer: {
      label: "Temporizador",
      description: "Contagem decrescente com durações predefinidas para tarefas comuns.",
      seoTitle: "Temporizador online - Contagem decrescente em tela cheia com som",
      seoDescription:
        "Temporizador gratuito com alarme sonoro, anel visual de progresso e minutos personalizados. Modo tela cheia disponível no navegador.",
    },
    stopwatch: {
      label: "Cronómetro",
      description: "Meça o tempo com um cronómetro simples.",
      seoTitle: "Cronômetro online - Cronômetro de precisão com voltas e milissegundos",
      seoDescription:
        "Cronômetro online gratuito com precisão de milissegundos, registro de voltas e tela cheia para treinos, estudos e esportes.",
    },
    "world-clock": {
      label: "Relógio mundial",
      description: "Hora atual nas principais cidades do mundo.",
      seoTitle: "Relógio mundial - Hora local exata em cidades do mundo todo",
      seoDescription:
        "Verifique a hora certa em tempo real, fusos horários, offset UTC e horário de verão nas principais capitais e cidades do mundo.",
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
      seoTitle: "منبه إلكتروني - ضبط المنبه عبر الإنترنت بصوت قوي وغفوة",
      seoDescription:
        "منبه مجاني عبر الإنترنت بنغمات تنبيه قوية وخاصية الغفوة وتنبيهات صوتية. احرص على إبقاء علامة تبويب المتصفح مفتوحة لتنبيهك في الوقت المحدد.",
    },
    timer: {
      label: "مؤقّت",
      description: "عدّ تنازلي بمدد جاهزة للمهام اليومية.",
      seoTitle: "مؤقت تنازلي - عد تنازلي بملء الشاشة مع منبه صوتي",
      seoDescription:
        "مؤقت تنازلي مجاني عبر الإنترنت بصوت تنبيه قوي وحلقة مرئية وإمكانية ضبط الدقائق والثواني. مع وضع ملء الشاشة في المتصفح.",
    },
    stopwatch: {
      label: "ساعة توقيف",
      description: "قِس الوقت بساعة توقيف بسيطة.",
      seoTitle: "ساعة إيقاف أونلاين - قياس الوقت بدقة الأجزاء من الثانية والدورات",
      seoDescription:
        "ساعة إيقاف دقيقة عبر الإنترنت بالأجزاء من الثانية مع تسجيل الدورات ووضع ملء الشاشة للتمارين والدراسة.",
    },
    "world-clock": {
      label: "ساعة عالمية",
      description: "الوقت الحالي في كبرى المدن حول العالم.",
      seoTitle: "ساعة العالم - التوقيت المحلي الحالي في مدن العالم",
      seoDescription:
        "اعرف الوقت الحالي وفروق التوقيت والمناطق الزمنية لجميع مدن وعواصم العالم بدقة وتحديث فوري.",
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
      seoTitle: "ऑनलाइन अलार्म क्लॉक - तेज़ आवाज़ और स्नूज़ के साथ अलार्म सेट करें",
      seoDescription:
        "मुफ़्त ऑनलाइन अलार्म घड़ी तेज़ आवाज़, स्नूज़ विकल्प और ऑडियो अलर्ट के साथ। सही समय पर बजने के लिए ब्राउज़र टैब को खुला रखें।",
    },
    timer: {
      label: "टाइमर",
      description: "सामान्य कामों के लिए पूर्वनिर्धारित अवधि के साथ उलटी गिनती।",
      seoTitle: "ऑनलाइन टाइमर - ध्वनि के साथ फ़ुलस्क्रीन काउंटडाउन टाइमर",
      seoDescription:
        "तेज़ अलार्म ध्वनि और विज़ुअल प्रोग्रेस रिंग के साथ मुफ़्त ऑनलाइन काउंटडाउन टाइमर। ब्राउज़र में फ़ुलस्क्रीन मोड की सुविधा उपलब्ध।",
    },
    stopwatch: {
      label: "स्टॉपवॉच",
      description: "सरल स्टॉपवॉच के साथ समय मापें।",
      seoTitle: "ऑनलाइन स्टॉपवॉच - मिलीसेकंड और लैप टाइमर",
      seoDescription:
        "सटीक मिलीसेकंड, लैप रिकॉर्डिंग और फ़ुलस्क्रीन डिस्प्ले के साथ मुफ़्त ऑनलाइन स्टॉपवॉच। पढ़ाई और वर्कआउट के लिए उपयोगी।",
    },
    "world-clock": {
      label: "विश्व घड़ी",
      description: "दुनिया के बड़े शहरों में वर्तमान समय देखें।",
      seoTitle: "विश्व घड़ी - दुनिया के सभी प्रमुख शहरों का वर्तमान समय",
      seoDescription:
        "विश्व के प्रमुख शहरों का लाइव स्थानीय समय, टाइमज़ोन, UTC ऑफ़सेट और दिन-रात का समय आसानी से देखें और तुलना करें।",
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
      seoTitle: "ઓનલાઇન એલાર્મ ક્લોક - મોટા અવાજ અને સ્નૂઝ સાથે એલાર્મ સેટ કરો",
      seoDescription:
        "મોટા અવાજ, સ્નૂઝ વિકલ્પ અને ઓડિયો એલર્ટ સાથે મફત ઓનલાઇન એલાર્મ ઘડિયાળ. સમયસર વાગવા માટે બ્રાઉઝર ટેબ ચાલુ રાખો.",
    },
    timer: {
      label: "ટાઈમર",
      description: "સામાન્ય કાર્યો માટે પૂર્વનિર્ધારિત સમય સાથે કાઉન્ટડાઉન ટાઈમર.",
      seoTitle: "ઓનલાઇન ટાઈમર - અવાજ સાથે ફુલસ્ક્રીન કાઉન્ટડાઉન ટાઈમર",
      seoDescription:
        "મોટા એલાર્મ અવાજ અને વિઝ્યુઅલ પ્રોગ્રેસ રિંગ સાથે મફત ઓનલાઇન કાઉન્ટડાઉન ટાઈમર. બ્રાઉઝરમાં ફુલસ્ક્રીન મોડ ઉપલબ્ધ.",
    },
    stopwatch: {
      label: "સ્ટોપવોચ",
      description: "સરળ અને સચોટ સ્ટોપવોચ વડે લેપ અને સમય માપો.",
      seoTitle: "ઓનલાઇન સ્ટોપવોચ - મિલિસેકન્ડ અને લેપ ટાઈમર",
      seoDescription:
        "મિલિસેકન્ડની ચોકસાઈ, લેપ ટાઈમ રેકોર્ડિંગ અને ફુલસ્ક્રીન મોડ સાથે મફત ઓનલાઇન સ્ટોપવોચ. રમતગમત અને અભ્યાસ માટે ઉત્તમ.",
    },
    "world-clock": {
      label: "વિશ્વ ઘડિયાળ",
      description: "દુનિયાના મુખ્ય શહેરોમાં વર્તમાન સમય અને ટાઈમ ઝોન જુઓ.",
      seoTitle: "વિશ્વ ઘડિયાળ - વિશ્વના મુખ્ય શહેરોનો વર્તમાન સમય",
      seoDescription:
        "દુનિયાભરના મુખ્ય શહેરોનો ચોક્કસ લાઈવ સમય, ટાઇમઝોન, UTC ઑફસેટ અને ડેલાઇટ સેવિંગ માહિતી સરળતાથી જુઓ.",
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
): { label: string; description: string; seoTitle?: string; seoDescription?: string } {
  const base = getCategoryMeta(category);
  if (locale === "en") {
    return {
      label: base.label,
      description: base.description,
      seoTitle: base.seoTitle,
      seoDescription: base.seoDescription,
    };
  }
  const o = OVERRIDES[locale]?.[category];
  if (o) return o;
  return {
    label: base.label,
    description: base.description,
    seoTitle: base.seoTitle,
    seoDescription: base.seoDescription,
  };
}
