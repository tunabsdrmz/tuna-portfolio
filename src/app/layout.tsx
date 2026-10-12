import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import { DICTS } from "@/lib/content";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-jetbrains-mono" });
const display = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-barlow-condensed",
});

const { IDENTITY } = DICTS.en;

export const metadata: Metadata = {
  title: `${IDENTITY.name.replace(/\b(\w)(\w*)/g, (_, a, b) => a + b.toLowerCase())} — Software Engineer`,
  description:
    "Software engineer in Ankara building production web, mobile and backend apps with React, Next.js, React Native, TypeScript, Node.js and NestJS. Open to new roles.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0a",
};

// Runs before paint: picks language + theme so the first frame is right.
const INIT = `(function(){try{var h=document.documentElement,q=new URLSearchParams(location.search);var l=q.get("lang");l=l==="tr"||l==="en"?l:localStorage.getItem("tb:lang");if(l!=="tr"&&l!=="en")l=String((navigator.languages&&navigator.languages[0])||navigator.language||"").toLowerCase().split("-")[0]==="tr"?"tr":"en";h.lang=l;var t=q.get("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";if(t==="light"){h.dataset.theme="light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#f3f3f1")}}catch(e){}})()`;

const BOOT_D: [string, string, number][] = [
  ["1 / span 5", "1 / span 4", 780],
  ["6 / span 3", "1 / span 2", 520],
  ["9 / span 4", "1 / span 2", 1560],
  ["6 / span 7", "3 / span 3", 0],
  ["1 / span 5", "5 / span 4", 1040],
  ["6 / span 3", "6 / span 3", 260],
  ["9 / span 4", "6 / span 3", 1300],
];
const BOOT_M: [string, string, number][] = [
  ["1 / span 4", "1 / span 2", 1040],
  ["1 / span 4", "3 / span 2", 260],
  ["1 / span 4", "5 / span 4", 0],
  ["1 / span 2", "9 / span 2", 520],
  ["3 / span 2", "9 / span 2", 780],
  ["1 / span 2", "11 / span 2", 1300],
  ["3 / span 2", "11 / span 2", 1560],
];

function StaticCV() {
  const d = DICTS.en;
  return (
    <article id="static-cv" className="static-cv" lang="en">
      <h1>{d.IDENTITY.name}</h1>
      <p>{d.IDENTITY.role}</p>
      <p>{d.IDENTITY.tagline}</p>
      <section>
        <h2>Experience</h2>
        {d.ROLES.map((r) => (
          <section key={r.company + r.from}>
            <h3>
              {r.title} — {r.company}
            </h3>
            <p>
              {r.type} · {r.from} — {r.to}
            </p>
            <p>{r.blurb}</p>
          </section>
        ))}
      </section>
      <section>
        <h2>Work</h2>
        {d.PROJECTS.map((p) => (
          <section key={p.num}>
            <h3>{p.title.replace("\n", " ")}</h3>
            {p.detail.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </section>
        ))}
      </section>
      <section>
        <h2>Certifications</h2>
        <ul>
          {d.CERTIFICATIONS.map((c) => (
            <li key={c.title}>
              {c.title} — {c.issuer}, {c.date}
              {c.note ? ` (${c.note})` : ""}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Stack</h2>
        {d.STACK.map((c) => (
          <p key={c.id}>
            {c.label}: {c.skills.join(", ")}
          </p>
        ))}
      </section>
    </article>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT }} />
      </head>
      <body>
        <StaticCV />
        <div className="boot" aria-hidden="true">
          {BOOT_D.map(([c, r, d], i) => (
            <svg
              key={`d${i}`}
              className="boot-box boot-d"
              style={{ gridColumn: c, gridRow: r, ["--d" as string]: `${d}ms` }}
            >
              <rect className="boot-line" x="0" y="0" width="100%" height="100%" pathLength="100" />
            </svg>
          ))}
          {BOOT_M.map(([c, r, d], i) => (
            <svg
              key={`m${i}`}
              className="boot-box boot-m"
              style={{ gridColumn: c, gridRow: r, ["--d" as string]: `${d}ms` }}
            >
              <rect className="boot-line" x="0" y="0" width="100%" height="100%" pathLength="100" />
            </svg>
          ))}
        </div>
        {children}
      </body>
    </html>
  );
}
