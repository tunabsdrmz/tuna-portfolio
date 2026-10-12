// All copy for the site lives here. `en` is the source of truth; `tr`
// overrides only the strings that change between languages.

export type Lang = "en" | "tr";

export const EMAIL = "tunabosdurmaz2002@gmail.com";
export const PHONE = "+90 543 578 92 02";
export const CV_URL = "/docs/Tuna-Bosdurmaz-CV.pdf";
export const GITHUB_URL = "https://github.com/tunabsdrmz";
export const LINKEDIN_URL = "https://www.linkedin.com/in/tuna-bo%C5%9Fdurmaz";

export type Stat = { value: number; suffix?: string; label: string; note?: string };

export type Role = {
  title: string;
  company: string;
  type: string;
  from: string;
  to: string;
  months: number;
  level: number; // 0–3, drives the length/glow of the timeline tick
  featured?: boolean; // shown on the compact index card
  blurb: string;
  skills: string[];
};

export type Project = {
  num: string;
  title: string;
  subtitle: string;
  role: string;
  year: string;
  url: string | null;
  linkLabel?: string;
  links?: { label: string; href: string }[]; // extra buttons, e.g. App Store
  images: string[];
  stack: string[];
  detail: string[];
};

export type StackCat = { id: string; label: string; skills: string[] };

export type Certification = {
  title: string;
  issuer: string;
  date: string;
  note?: string;
  url?: string;
};

export type Education = {
  school: string;
  short: string;
  place: string;
  award: string;
  years: string;
};

const ROLES_EN: Role[] = [
  {
    title: "SENIOR SOFTWARE ENGINEER",
    company: "PREPTEST",
    type: "FULL-TIME",
    from: "MAR 2025",
    to: "MAR 2026",
    months: 13,
    level: 3,
    featured: true,
    blurb:
      "Shipped four production apps — two web, two mobile — in a 3-person team, including PrepTest, an AI-powered exam-prep platform serving 10,000+ users across SAT, IMAT, CENT-S, Bocconi and IELTS. Co-developed Langium, a TÜBİTAK-funded English-learning platform, and delivered auth, push notifications and integrations end-to-end.",
    skills: ["REACT", "REACT NATIVE", "NEXT.JS", "NESTJS", "TYPESCRIPT"],
  },
  {
    title: "MID SOFTWARE ENGINEER",
    company: "E-ADAM / IYZADS",
    type: "FULL-TIME",
    from: "SEP 2023",
    to: "SEP 2024",
    months: 13,
    level: 2,
    featured: true,
    blurb:
      "Built an AI-powered ad platform that runs Google, Meta and TikTok Ads from one product — AI ad-copy, audience targeting, budget recommendations and centralized reporting across the SaaS app, mobile app and an animated marketing site I built solo.",
    skills: ["REACT", "REACT NATIVE", "NEXT.JS", "NODE.JS"],
  },
  {
    title: "JUNIOR SOFTWARE ENGINEER",
    company: "WINNOWPRO",
    type: "CONTRACT · REMOTE",
    from: "FEB 2023",
    to: "JUN 2023",
    months: 5,
    level: 1,
    featured: true,
    blurb:
      "Independently built the full cross-platform app for a US vehicle marketplace — customer, agent and admin flows, AI chatbot conversations and real-time Socket.IO messaging — and shipped it to the App Store and Google Play.",
    skills: ["REACT NATIVE", "SOCKET.IO", "TYPESCRIPT"],
  },
  {
    title: "JUNIOR SOFTWARE ENGINEER",
    company: "SOFTWAREHOUSE TECH",
    type: "CONTRACT",
    from: "APR 2023",
    to: "JUN 2023",
    months: 3,
    level: 1,
    blurb:
      "Built portfolio management, wallet flows, financial dashboards and interactive market charts for a React Native stock-trading app.",
    skills: ["REACT NATIVE", "TYPESCRIPT"],
  },
  {
    title: "JUNIOR SOFTWARE ENGINEER",
    company: "KARMA",
    type: "CONTRACT",
    from: "AUG 2022",
    to: "DEC 2022",
    months: 5,
    level: 1,
    blurb:
      "Real-time messaging, profiles, matching and horoscope-based compatibility for a dating app live on the app stores.",
    skills: ["REACT NATIVE", "REDUX", "SOCKET.IO"],
  },
  {
    title: "INDEPENDENT SOFTWARE ENGINEER",
    company: "FREELANCE",
    type: "PART-TIME",
    from: "SEP 2021",
    to: "PRESENT",
    months: 0,
    level: 2,
    featured: true,
    blurb:
      "Paid web, mobile and full-stack work for startups and individual clients — new features, third-party integrations and production fixes, delivered on agreed timelines.",
    skills: ["REACT", "NEXT.JS", "REACT NATIVE", "NODE.JS"],
  },
  {
    title: "SOFTWARE DEVELOPMENT INTERN",
    company: "HALKBANK",
    type: "INTERNSHIP",
    from: "SEP 2019",
    to: "JUN 2020",
    months: 10,
    level: 0,
    blurb:
      "First exposure to enterprise software — internal C# development, debugging and database tasks, code reviews and production support.",
    skills: ["C#", "SQL"],
  },
];

const PROJECTS_EN: Project[] = [
  {
    num: "01",
    title: "PREP\nTEST",
    subtitle: "AI EXAM PREP / WEB + MOBILE",
    role: "SENIOR SOFTWARE ENGINEER",
    year: "2025—26",
    url: "https://prep-test.com/tr",
    links: [{ label: "APP STORE", href: "https://apps.apple.com/tr/app/preptest-your-college-buddy/id6752116448" }],
    images: ["/images/work/preptest-01.webp", "/images/work/preptest-02.webp", "/images/work/preptest-03.webp"],
    stack: ["NEXT.JS", "REACT NATIVE", "NESTJS", "TYPESCRIPT"],
    detail: [
      "AI-powered international exam-preparation platform serving more than 10,000 users — SAT, IMAT, CENT-S, Bocconi, IELTS and more.",
      "Adaptive study paths, AI-generated questions, full exam simulations and detailed performance reporting across web and mobile.",
      "Built alongside Langium, a TÜBİTAK-funded English-learning platform with IELTS prep and proficiency-based practice flows.",
    ],
  },
  {
    num: "02",
    title: "IYZ\nADS",
    subtitle: "AI AD PLATFORM / SAAS + MOBILE",
    role: "MID SOFTWARE ENGINEER",
    year: "2023—24",
    url: "https://iyzads.com/tr",
    links: [{ label: "APP STORE", href: "https://apps.apple.com/tr/app/iyzads-ai-reklam-y%C3%B6netimi/id6768684898?l=tr" }],
    images: ["/images/work/iyzads-01.webp", "/images/work/iyzads-02.webp", "/images/work/iyzads-03.webp"],
    stack: ["REACT", "NEXT.JS", "REACT NATIVE", "NODE.JS"],
    detail: [
      "One product to run Google Ads, Meta Ads and TikTok Ads — create, manage and optimize campaigns from web or mobile.",
      "AI-assisted ad copy, audience targeting, budget recommendations, automation and centralized analytics on top of the ad-platform APIs.",
      "Built the promotional site solo: custom animations, Lottie performance work, lazy loading and a fully responsive UI.",
    ],
  },
  {
    num: "03",
    title: "GIGA CHAD\nWALLET",
    subtitle: "CRYPTO PORTFOLIO / SOLANA",
    role: "PERSONAL PROJECT",
    year: "2026",
    url: "https://github.com/tunabsdrmz/giga-chad-wallet",
    linkLabel: "VIEW ON GITHUB",
    images: ["/images/work/chadwallet-01.webp", "/images/work/chadwallet-02.webp"],
    stack: ["NEXT.JS", "SUPABASE", "PRIVY", "SOLANA"],
    detail: [
      "Cryptocurrency portfolio app with secure authentication, live market data, responsive asset views and Solana wallet functionality.",
      "Privy authentication, Supabase-backed data flows and reusable UI built with Next.js, Tailwind CSS and shadcn/ui.",
    ],
  },
  {
    num: "04",
    title: "AI INTERVIEW\nPREP",
    subtitle: "BACKEND / AI EVALUATION",
    role: "PERSONAL PROJECT",
    year: "2026",
    url: "https://github.com/tunabsdrmz/ai-powered-interview-preparation-platform",
    linkLabel: "VIEW ON GITHUB",
    images: ["/images/work/interview-01.webp", "/images/work/interview-02.webp", "/images/work/interview-03.webp"],
    stack: ["NESTJS", "POSTGRESQL", "REDIS", "BULLMQ"],
    detail: [
      "Modular backend for AI-assisted mock interviews — sessions, questions, answers, reports, caching, queues and AI evaluation.",
      "JWT + Passport auth, TypeORM persistence, Redis caching, BullMQ background jobs, Swagger docs and Groq Llama 3 answer scoring.",
      "Unit, integration and end-to-end test patterns over a layered, maintainable architecture.",
    ],
  },
];

const STACK_EN: StackCat[] = [
  {
    id: "languages",
    label: "LANGUAGES",
    skills: ["TYPESCRIPT", "C#", "GO", "PYTHON", "SQL"],
  },
  {
    id: "frontend",
    label: "FRONTEND & MOBILE",
    skills: [
      "REACT",
      "NEXT.JS",
      "REACT NATIVE",
      "EXPO",
      "TAILWIND CSS",
      "REDUX TOOLKIT",
      "TANSTACK QUERY",
      "FRAMER MOTION",
    ],
  },
  {
    id: "backend",
    label: "BACKEND",
    skills: [
      "NODE.JS",
      "NESTJS",
      "EXPRESS",
      "SOCKET.IO",
      "GIN",
      "CHI",
      "ECHO",
      ".NET",
      "ASP.NET CORE",
      "ENTITY FRAMEWORK",
      "FASTAPI",
      "DJANGO",
      "FLASK",
    ],
  },
  {
    id: "tools",
    label: "TOOLS & PLATFORMS",
    skills: [
      "DOCKER",
      "GITHUB ACTIONS",
      "FIREBASE",
      "JEST",
      "CYPRESS",
      "SWAGGER",
      "POSTMAN",
      "TYPEORM",
      "RABBITMQ",
      "APP STORE CONNECT",
      "GOOGLE PLAY CONSOLE",
    ],
  },
  {
    id: "databases",
    label: "DATA",
    skills: ["POSTGRESQL", "MONGODB", "REDIS", "SUPABASE"],
  },
];

const SKILLJAR = "https://verify.skilljar.com/c/";

const CERTS_EN: Certification[] = [
  { title: "REACT", issuer: "TESTGORILLA", date: "SEP 2026", note: "99TH PERCENTILE" },
  { title: "NEXT.JS", issuer: "TESTGORILLA", date: "SEP 2026", note: "99TH PERCENTILE" },
  { title: "CODING: INTERMEDIATE ALGORITHMS", issuer: "TESTGORILLA", date: "SEP 2026", note: "90TH PERCENTILE" },
  { title: "BUILDING WITH THE CLAUDE API", issuer: "ANTHROPIC", date: "AUG 2026", url: SKILLJAR + "m8m9csrscczs" },
  { title: "MODEL CONTEXT PROTOCOL: ADVANCED TOPICS", issuer: "ANTHROPIC", date: "AUG 2026", url: SKILLJAR + "2xp55hxo9p9w" },
  { title: "INTRODUCTION TO MODEL CONTEXT PROTOCOL", issuer: "ANTHROPIC", date: "AUG 2026", url: SKILLJAR + "wenr9uafh42d" },
  { title: "INTRODUCTION TO CLAUDE COWORK", issuer: "ANTHROPIC", date: "AUG 2026", url: SKILLJAR + "xnr5co7q7bk2" },
  { title: "CLAUDE PLATFORM 101", issuer: "ANTHROPIC", date: "AUG 2026", url: SKILLJAR + "wpa9bjpv6sh4" },
  { title: "CLAUDE 101", issuer: "ANTHROPIC", date: "JUL 2026", url: SKILLJAR + "we3f3h6p9h4a" },
  { title: "AI FLUENCY FOR STUDENTS", issuer: "ANTHROPIC", date: "JUL 2026", url: SKILLJAR + "vdnj6jh2qk5y" },
];

const TR_MONTH: Record<string, string> = { JUL: "TEM", AUG: "AĞU", SEP: "EYL" };

const TECH_COUNT = STACK_EN.reduce((n, c) => n + c.skills.length, 0);

const STATS_EN: Stat[] = [
  { value: 5, suffix: "+", label: "YEARS SHIPPING" },
  { value: 10, suffix: "K+", label: "USERS REACHED" },
];

const en = {
  IDENTITY: {
    first: "TUNA",
    last: "BOSDURMAZ.",
    name: "TUNA BOSDURMAZ",
    role: "SOFTWARE ENGINEER / FULL-STACK & MOBILE",
    tagline: "WEB, MOBILE AND BACKEND — SHIPPED TO PRODUCTION.",
    location: "ANKARA, TURKEY",
    reach: "ANKARA → WORLDWIDE",
    availability: {
      short: "OPEN TO WORK",
      long: "AVAILABLE FOR NEW ROLES",
      note: "FULL-TIME · FREELANCE · REMOTE",
    },
  },
  STATS: STATS_EN,
  STATS_DETAIL: [
    { ...STATS_EN[0], note: "REACT, NEXT.JS, NODE.JS" },
    { ...STATS_EN[1], note: "ON PREPTEST ALONE" },
    { value: ROLES_EN.length, label: "ROLES", note: "INTERN → SENIOR" },
    { value: 5, label: "INDUSTRIES", note: "EDTECH · ADTECH · FINTECH · AUTO · SOCIAL" },
    { value: 4, label: "APPS SHIPPED", note: "LIVE ON APP STORE & GOOGLE PLAY" },
    { value: TECH_COUNT, label: "TECHNOLOGIES", note: `ACROSS ${STACK_EN.length} CATEGORIES` },
  ] as Stat[],
  MODULE_TITLES: {
    status: "STATUS",
    stats: "BY THE\nNUMBERS",
    experience: "EXPERIENCE",
    location: "BASED",
    latest: "MOST\nRECENT",
    "work-meta": "SELECTED\nWORK",
    cv: "2026 CV",
    "tech-count": "TOOLBOX",
    education: "EDUCATION",
    headline: "CONTACT",
    email: "DIRECT",
    form: "SEND A\nMESSAGE",
    socials: "ELSEWHERE",
  } as Record<string, string>,
  EMPLOYER: {
    name: "SOFTWARE ENGINEER",
    tag: "5+ YRS",
    span: "2019 — PRESENT",
    summary:
      "WEB, MOBILE AND BACKEND ACROSS EDTECH, ADTECH, FINTECH, AUTOMOTIVE AND SOCIAL MEDIA.",
  },
  ROLES: ROLES_EN,
  PROJECTS: PROJECTS_EN,
  STACK: STACK_EN,
  TECH_COUNT,
  EDUCATION: [
    {
      school: "ANADOLU UNIVERSITY",
      short: "ANADOLU UNIVERSITY",
      place: "TURKEY",
      award: "ASSOCIATE DEGREE — COMPUTER PROGRAMMING",
      years: "2022 — 2025",
    },
    {
      school: "LANGUAGES",
      short: "LANGUAGES",
      place: "",
      award: "ENGLISH — PROFESSIONAL WORKING · TURKISH — NATIVE",
      years: "EN · TR",
    },
  ] as Education[],
  CERTIFICATIONS: CERTS_EN,
  UI: {
    identity: { portfolio: "PORTFOLIO — 2026", home: "INDEX", homeAria: "Go to index" },
    status: { label: "STATUS", value: "OPEN" },
    stats: { label: "BY THE NUMBERS", figures: (n: number) => `${n} FIGURES` },
    location: { label: "BASED", city: "ANKARA", note: "GMT+3 · REMOTE-READY" },
    latest: { label: "MOST RECENT", cta: "ALL WORK" },
    experience: { label: "EXPERIENCE", months: "MOS" },
    workMeta: {
      label: "SELECTED",
      line: "PROJECTS · 2023—2026",
      tags: "AI · SAAS · MOBILE · WEB3 · BACKEND",
    },
    cv: {
      label: "CURRICULUM VITAE",
      top: "2026",
      bottom: "CV",
      contents: "EXPERIENCE · STACK · EDUCATION",
      download: "DOWNLOAD",
    },
    project: {
      label: "WORK",
      archivedView: "ARCHIVED — VIEW",
      views: "VIEWS",
      visit: "VISIT SITE",
      offline: "PRIVATE PLATFORM — LINK ON REQUEST",
    },
    toolbox: {
      label: "TOOLBOX",
      technologies: "TECHNOLOGIES",
      categories: (n: number) => `${n} CATEGORIES`,
    },
    education: { label: "EDUCATION" },
    certs: {
      label: "CERTIFICATIONS",
      title: "CREDENTIALS",
      count: (n: number) => `${n} CERTIFICATIONS`,
      verify: "VERIFY",
    },
    contact: {
      label: "CONTACT",
      headline: ["LET'S", "WORK."],
      direct: "DIRECT",
      form: "SEND A MESSAGE",
      formTag: "FORM",
      sentTag: "SENT",
      received: "RECEIVED.",
      reply: "I'LL BE IN TOUCH SHORTLY.",
      name: "YOUR NAME",
      email: "YOUR EMAIL",
      message: "YOUR MESSAGE",
      error: "SOMETHING WENT WRONG — EMAIL ME DIRECTLY.",
      sending: "SENDING...",
      send: "SEND MESSAGE",
      github: "GITHUB",
      linkedin: "LINKEDIN",
      cv: "CV",
      footer: "© 2026 TunaBosdurmaz",
      colophon: "· NEXT.JS",
    },
    expand: "EXPAND",
    close: "CLOSE",
    esc: "ESC",
    step: "TO STEP THROUGH",
    expanded: "EXPANDED",
    roles: (n: number) => `${n} ROLES`,
    tabs: { index: "INDEX", work: "WORK", stack: "STACK", contact: "CONTACT" } as Record<
      string,
      string
    >,
    dock: {
      hints: "DRAG · FLING · 1—4 · ← → · ESC",
      reset: "RESET GRID",
      resetAria: "Put the cards back",
      lang: "TR",
      langAria: "Türkçeye geç",
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode",
    },
    demo: {
      tabsPhone: "TAP A TAB TO SWITCH PAGE",
      tabsDesktop: "TABS SWITCH PAGE · OR PRESS 1–4",
      open: "TAP A CARD TO OPEN IT",
      swap: "DRAG ONTO ANOTHER TO SWAP",
      fling: "FLING TO THROW",
      shake: "SHAKE TO RESET",
      shakeOffer: "SHAKE YOUR PHONE TO RESET THE GRID",
      shakeEnable: "ENABLE",
      shakeLater: "NOT NOW",
      skip: "SKIP DEMO",
      skipAria: "Close the demonstration",
    },
  },
};

export type Dict = typeof en;

const tr: Dict = {
  ...en,
  IDENTITY: {
    ...en.IDENTITY,
    role: "YAZILIM MÜHENDİSİ / FULL-STACK & MOBİL",
    tagline: "WEB, MOBİL VE BACKEND — CANLIYA ALINMIŞ ÜRÜNLER.",
    location: "ANKARA, TÜRKİYE",
    reach: "ANKARA → DÜNYA",
    availability: {
      short: "İŞE AÇIK",
      long: "YENİ ROLLERE AÇIK",
      note: "TAM ZAMANLI · FREELANCE · UZAKTAN",
    },
  },
  STATS: [
    { ...en.STATS[0], label: "YILLIK DENEYİM" },
    { ...en.STATS[1], label: "KULLANICIYA ULAŞTI" },
  ],
  STATS_DETAIL: [
    { ...en.STATS_DETAIL[0], label: "YILLIK DENEYİM", note: "REACT · NEXT.JS · NODE.JS" },
    { ...en.STATS_DETAIL[1], label: "KULLANICI", note: "SADECE PREPTEST'TE" },
    { ...en.STATS_DETAIL[2], label: "ROL", note: "STAJYERDEN → SENIOR'A" },
    { ...en.STATS_DETAIL[3], label: "SEKTÖR", note: "EĞİTİM · REKLAM · FİNANS · OTOMOTİV · SOSYAL" },
    { ...en.STATS_DETAIL[4], label: "YAYINLANAN UYGULAMA", note: "APP STORE & GOOGLE PLAY'DE" },
    { ...en.STATS_DETAIL[5], label: "TEKNOLOJİ", note: `${en.STACK.length} KATEGORİDE` },
  ],
  MODULE_TITLES: {
    status: "DURUM",
    stats: "RAKAMLARLA",
    experience: "DENEYİM",
    location: "KONUM",
    latest: "EN\nGÜNCEL",
    "work-meta": "SEÇİLMİŞ\nİŞLER",
    cv: "2026 CV",
    "tech-count": "ARAÇLAR",
    education: "EĞİTİM",
    headline: "İLETİŞİM",
    email: "DOĞRUDAN",
    form: "MESAJ\nGÖNDER",
    socials: "BAĞLANTILAR",
  },
  EMPLOYER: {
    name: "YAZILIM MÜHENDİSİ",
    tag: "5+ YIL",
    span: "2019 — GÜNÜMÜZ",
    summary:
      "EĞİTİM, REKLAM, FİNANS, OTOMOTİV VE SOSYAL MEDYADA WEB, MOBİL VE BACKEND.",
  },
  ROLES: [
    {
      ...ROLES_EN[0],
      title: "SENIOR YAZILIM MÜHENDİSİ",
      type: "TAM ZAMANLI",
      from: "MAR 2025",
      to: "MAR 2026",
      blurb:
        "3 kişilik ekipte ikisi web, ikisi mobil dört canlı uygulama geliştirdim; aralarında SAT, IMAT, CENT-S, Bocconi ve IELTS için 10.000+ kullanıcıya hizmet veren yapay zekâ destekli sınav hazırlık platformu PrepTest var. TÜBİTAK destekli İngilizce öğrenme platformu Langium'u birlikte geliştirdim; kimlik doğrulama, push bildirimleri ve entegrasyonları uçtan uca teslim ettim.",
    },
    {
      ...ROLES_EN[1],
      title: "MID YAZILIM MÜHENDİSİ",
      type: "TAM ZAMANLI",
      from: "EYL 2023",
      to: "EYL 2024",
      blurb:
        "Google, Meta ve TikTok reklamlarını tek üründen yöneten yapay zekâ destekli reklam platformu — AI reklam metni, hedef kitle, bütçe önerileri ve merkezi raporlama; SaaS uygulaması, mobil uygulama ve tek başıma geliştirdiğim animasyonlu tanıtım sitesi.",
    },
    {
      ...ROLES_EN[2],
      title: "JUNIOR YAZILIM MÜHENDİSİ",
      type: "SÖZLEŞMELİ · UZAKTAN",
      from: "ŞUB 2023",
      to: "HAZ 2023",
      blurb:
        "ABD merkezli bir araç pazaryeri için cross-platform mobil uygulamanın tamamını tek başıma geliştirdim — müşteri, temsilci ve yönetici akışları, AI sohbet botu ve Socket.IO ile gerçek zamanlı mesajlaşma — ve App Store ile Google Play'de yayınladım.",
    },
    {
      ...ROLES_EN[3],
      title: "JUNIOR YAZILIM MÜHENDİSİ",
      type: "SÖZLEŞMELİ",
      from: "NİS 2023",
      to: "HAZ 2023",
      blurb:
        "React Native yatırım ve hisse alım-satım uygulaması için portföy yönetimi, cüzdan, finansal paneller ve etkileşimli piyasa grafikleri.",
    },
    {
      ...ROLES_EN[4],
      title: "JUNIOR YAZILIM MÜHENDİSİ",
      type: "SÖZLEŞMELİ",
      from: "AĞU 2022",
      to: "ARA 2022",
      blurb:
        "Mağazalarda yayında olan bir tanışma uygulaması için gerçek zamanlı mesajlaşma, profil, eşleşme ve burç uyumu özellikleri.",
    },
    {
      ...ROLES_EN[5],
      title: "BAĞIMSIZ YAZILIM MÜHENDİSİ",
      type: "YARI ZAMANLI",
      from: "EYL 2021",
      to: "GÜNÜMÜZ",
      blurb:
        "Girişimler ve bireysel müşteriler için ücretli web, mobil ve full-stack geliştirme — yeni özellikler, üçüncü parti entegrasyonlar ve canlı ortam düzeltmeleri.",
    },
    {
      ...ROLES_EN[6],
      title: "YAZILIM GELİŞTİRME STAJYERİ",
      type: "STAJ",
      from: "EYL 2019",
      to: "HAZ 2020",
      blurb:
        "Kurumsal yazılımla ilk tanışma — dahili C# geliştirme, hata ayıklama ve veritabanı görevleri, kod incelemeleri ve canlı destek.",
    },
  ],
  PROJECTS: [
    {
      ...PROJECTS_EN[0],
      subtitle: "AI SINAV HAZIRLIK / WEB + MOBİL",
      role: "SENIOR YAZILIM MÜHENDİSİ",
      detail: [
        "SAT, IMAT, CENT-S, Bocconi, IELTS ve daha fazlası için 10.000'den fazla kullanıcıya hizmet veren yapay zekâ destekli uluslararası sınav hazırlık platformu.",
        "Web ve mobilde uyarlanabilir çalışma yolları, AI ile üretilen sorular, tam sınav simülasyonları ve detaylı performans raporları.",
        "TÜBİTAK destekli, IELTS hazırlığı ve seviye bazlı pratik akışları sunan İngilizce öğrenme platformu Langium ile birlikte geliştirildi.",
      ],
    },
    {
      ...PROJECTS_EN[1],
      subtitle: "AI REKLAM PLATFORMU / SAAS + MOBİL",
      role: "MID YAZILIM MÜHENDİSİ",
      detail: [
        "Google Ads, Meta Ads ve TikTok Ads'i tek üründen yönetin — kampanyaları web ya da mobilden oluşturun, yönetin, optimize edin.",
        "Reklam platformu API'leri üzerine AI destekli reklam metni, hedef kitle, bütçe önerileri, otomasyon ve merkezi analitik.",
        "Tanıtım sitesini tek başıma geliştirdim: özel animasyonlar, Lottie performans iyileştirmeleri, lazy loading ve tamamen responsive arayüz.",
      ],
    },
    {
      ...PROJECTS_EN[2],
      subtitle: "KRİPTO PORTFÖY / SOLANA",
      role: "KİŞİSEL PROJE",
      linkLabel: "GITHUB'DA GÖR",
      detail: [
        "Güvenli kimlik doğrulama, canlı piyasa verisi, responsive varlık görünümleri ve Solana cüzdan özellikleri olan kripto portföy uygulaması.",
        "Privy kimlik doğrulama, Supabase veri akışları ve Next.js, Tailwind CSS ve shadcn/ui ile yeniden kullanılabilir arayüz.",
      ],
    },
    {
      ...PROJECTS_EN[3],
      subtitle: "BACKEND / AI DEĞERLENDİRME",
      role: "KİŞİSEL PROJE",
      linkLabel: "GITHUB'DA GÖR",
      detail: [
        "AI destekli mülakat provaları için modüler backend — oturumlar, sorular, cevaplar, raporlar, önbellek, kuyruklar ve AI değerlendirme.",
        "JWT + Passport kimlik doğrulama, TypeORM, Redis önbellek, BullMQ arka plan işleri, Swagger ve Groq Llama 3 ile cevap puanlama.",
        "Katmanlı, sürdürülebilir mimari üzerinde unit, entegrasyon ve uçtan uca test kalıpları.",
      ],
    },
  ],
  STACK: [
    { ...STACK_EN[0], label: "DİLLER" },
    { ...STACK_EN[1], label: "FRONTEND & MOBİL" },
    { ...STACK_EN[2], label: "BACKEND" },
    { ...STACK_EN[3], label: "ARAÇLAR & PLATFORMLAR" },
    { ...STACK_EN[4], label: "VERİ" },
  ],
  EDUCATION: [
    {
      ...en.EDUCATION[0],
      school: "ANADOLU ÜNİVERSİTESİ",
      short: "ANADOLU ÜNİVERSİTESİ",
      place: "TÜRKİYE",
      award: "ÖN LİSANS — BİLGİSAYAR PROGRAMCILIĞI",
    },
    {
      ...en.EDUCATION[1],
      school: "DİLLER",
      short: "DİLLER",
      award: "İNGİLİZCE — PROFESYONEL · TÜRKÇE — ANA DİL",
    },
  ],
  CERTIFICATIONS: CERTS_EN.map((c) => ({
    ...c,
    date: c.date.replace(/^[A-Z]+/, (m) => TR_MONTH[m] ?? m),
    note: c.note?.replace(/(\d+)TH PERCENTILE/, "YÜZDELİK DİLİM $1"),
  })),
  UI: {
    identity: { portfolio: "PORTFOLYO — 2026", home: "ANA SAYFA", homeAria: "Ana sayfaya git" },
    status: { label: "DURUM", value: "AÇIK" },
    stats: { label: "RAKAMLARLA", figures: (n: number) => `${n} VERİ` },
    location: { label: "KONUM", city: "ANKARA", note: "GMT+3 · UZAKTAN ÇALIŞMAYA HAZIR" },
    latest: { label: "EN GÜNCEL", cta: "TÜM İŞLER" },
    experience: { label: "DENEYİM", months: "AY" },
    workMeta: {
      label: "SEÇİLMİŞ",
      line: "PROJE · 2023—2026",
      tags: "AI · SAAS · MOBİL · WEB3 · BACKEND",
    },
    cv: {
      label: "ÖZGEÇMİŞ",
      top: "2026",
      bottom: "CV",
      contents: "DENEYİM · ARAÇLAR · EĞİTİM",
      download: "İNDİR",
    },
    project: {
      label: "İŞ",
      archivedView: "ARŞİV — GÖR",
      views: "GÖRÜNÜM",
      visit: "SİTEYİ ZİYARET ET",
      offline: "ÖZEL PLATFORM — LİNK TALEP ÜZERİNE",
    },
    toolbox: {
      label: "ARAÇLAR",
      technologies: "TEKNOLOJİ",
      categories: (n: number) => `${n} KATEGORİ`,
    },
    education: { label: "EĞİTİM" },
    certs: {
      label: "SERTİFİKALAR",
      title: "SERTİFİKALAR",
      count: (n: number) => `${n} SERTİFİKA`,
      verify: "DOĞRULA",
    },
    contact: {
      label: "İLETİŞİM",
      headline: ["BİRLİKTE", "ÇALIŞALIM."],
      direct: "DOĞRUDAN",
      form: "MESAJ GÖNDER",
      formTag: "FORM",
      sentTag: "GÖNDERİLDİ",
      received: "ALINDI.",
      reply: "EN KISA SÜREDE DÖNÜŞ YAPACAĞIM.",
      name: "ADINIZ",
      email: "E-POSTANIZ",
      message: "MESAJINIZ",
      error: "BİR ŞEYLER TERS GİTTİ — BANA DOĞRUDAN YAZIN.",
      sending: "GÖNDERİLİYOR...",
      send: "MESAJI GÖNDER",
      github: "GITHUB",
      linkedin: "LINKEDIN",
      cv: "CV",
      footer: "© 2026 TunaBosdurmaz",
      colophon: "· NEXT.JS",
    },
    expand: "AÇ",
    close: "KAPAT",
    esc: "ESC",
    step: "İLE GEZİN",
    expanded: "GENİŞLETİLDİ",
    roles: (n: number) => `${n} ROL`,
    tabs: { index: "ANA SAYFA", work: "İŞLER", stack: "ARAÇLAR", contact: "İLETİŞİM" },
    dock: {
      hints: "SÜRÜKLE · FIRLAT · 1—4 · ← → · ESC",
      reset: "IZGARAYI SIFIRLA",
      resetAria: "Kartları yerine koy",
      lang: "EN",
      langAria: "Switch to English",
      toLight: "Açık temaya geç",
      toDark: "Koyu temaya geç",
    },
    demo: {
      tabsPhone: "SAYFA DEĞİŞTİRMEK İÇİN SEKMEYE DOKUN",
      tabsDesktop: "SEKMELER SAYFA DEĞİŞTİRİR · YA DA 1–4'E BAS",
      open: "AÇMAK İÇİN KARTA DOKUN",
      swap: "YER DEĞİŞTİRMEK İÇİN BAŞKA KARTIN ÜSTÜNE SÜRÜKLE",
      fling: "FIRLATMAK İÇİN HIZLICA AT",
      shake: "SIFIRLAMAK İÇİN SALLA",
      shakeOffer: "IZGARAYI SIFIRLAMAK İÇİN TELEFONU SALLA",
      shakeEnable: "ETKİNLEŞTİR",
      shakeLater: "ŞİMDİ DEĞİL",
      skip: "DEMOYU GEÇ",
      skipAria: "Tanıtımı kapat",
    },
  },
};

export const DICTS: Record<Lang, Dict> = { en, tr };
