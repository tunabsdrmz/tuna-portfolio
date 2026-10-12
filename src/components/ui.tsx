"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Small mono label row at the top of every card. */
export function ModuleHeader({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 shrink-0 min-w-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] @[220px]:tracking-[0.28em] text-dim truncate min-w-0">
        {children}
      </span>
      {right ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] @[220px]:tracking-[0.22em] text-dim shrink-0">
          {right}
        </span>
      ) : null}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      dir="ltr"
      className="font-mono text-[10px] uppercase tracking-[0.16em] border border-hairline text-mid px-2 py-1 whitespace-nowrap transition-colors duration-200 hover:border-fg hover:text-fg"
    >
      {children}
    </span>
  );
}

export function GlowRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full h-px shrink-0 ${className}`}
      style={{
        background:
          "linear-gradient(to right, transparent, var(--color-fg) 18%, var(--color-fg) 82%, transparent)",
        boxShadow:
          "0 0 18px 3px rgb(var(--glow) / calc(0.28 * var(--glow-k))), 0 0 55px 8px rgb(var(--glow) / calc(0.08 * var(--glow-k)))",
      }}
    />
  );
}

export function PulseDot() {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full bg-fg shrink-0"
      style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
    />
  );
}

export function Arrow({ children }: { children: string }) {
  return (
    <span aria-hidden className="inline-block rtl:-scale-x-100">
      {children}
    </span>
  );
}

/** Wrapper that drifts toward the pointer while hovered. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const step = () => {
    const el = ref.current;
    if (!el) return;
    const { x, y } = target.current;
    pos.current.x += (x - pos.current.x) * 0.12;
    pos.current.y += (y - pos.current.y) * 0.12;
    el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
    if (Math.abs(x - pos.current.x) > 0.05 || Math.abs(y - pos.current.y) > 0.05)
      raf.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "inline-block", width: "fit-content", willChange: "transform" }}
      onPointerMove={(e) => {
        if (!ref.current || e.pointerType === "touch") return;
        const r = ref.current.getBoundingClientRect();
        target.current = {
          x: (e.clientX - r.left - r.width / 2) * strength,
          y: (e.clientY - r.top - r.height / 2) * strength,
        };
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(step);
      }}
      onPointerLeave={() => {
        target.current = { x: 0, y: 0 };
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(step);
      }}
    >
      {children}
    </div>
  );
}

/** Counts up from 0 with an ease-out cubic. */
export function Counter({ to, suffix = "", delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const [n, setN] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    let start = 0;
    const tick = (t: number) => {
      start ||= t;
      const p = Math.min(1, (t - start) / 1300);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => {
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [to, delay]);
  return (
    <span dir="ltr">
      {n}
      {suffix}
    </span>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

/** Text that scrambles and resolves left-to-right on hover. */
export function Scramble({ text, className, speed = 6 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const progress = useRef(0);

  const run = () => {
    cancelAnimationFrame(raf.current);
    progress.current = 0;
    const tick = () => {
      if (!ref.current) return;
      const done = progress.current;
      ref.current.textContent = text
        .split("")
        .map((ch, i) =>
          ch === " " ? " " : i < done ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        )
        .join("");
      if (done < text.length) {
        progress.current += 1 / speed;
        raf.current = requestAnimationFrame(tick);
      } else ref.current.textContent = text;
    };
    tick();
  };

  const stop = () => {
    cancelAnimationFrame(raf.current);
    if (ref.current) ref.current.textContent = text;
  };

  return (
    <span ref={ref} className={className} onMouseEnter={run} onMouseLeave={stop}>
      {text}
    </span>
  );
}

/** Dot + trailing ring that replace the system cursor on fine pointers. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let mx = -100,
      my = -100,
      rx = -100,
      ry = -100,
      raf = 0,
      shown = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
      if (dot.current) dot.current.style.transform = `translate(${mx - 2}px,${my - 2}px)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.09;
      ry += (my - ry) * 0.09;
      if (ring.current) ring.current.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const hit = (e.target as Element | null)?.closest?.(
        "a,button,[data-cursor='grow'],input,textarea",
      );
      const el = ring.current;
      if (!el) return;
      if (hit) {
        el.style.width = "52px";
        el.style.height = "52px";
        el.style.borderColor = "var(--color-fg)";
        el.style.boxShadow = "var(--shadow-glow-sm)";
      } else {
        el.style.width = "36px";
        el.style.height = "36px";
        el.style.borderColor = "var(--color-dim)";
        el.style.boxShadow = "none";
      }
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="hidden md:block fixed top-0 left-0 w-1 h-1 bg-fg rounded-full pointer-events-none"
        style={{ zIndex: 9999, opacity: 0 }}
      />
      <div
        ref={ring}
        className="hidden md:block fixed top-0 left-0 rounded-full border border-dim pointer-events-none"
        style={{
          zIndex: 9999,
          width: 36,
          height: 36,
          opacity: 0,
          transition: "width .25s ease, height .25s ease, border-color .25s ease, box-shadow .25s ease",
        }}
      />
    </>
  );
}
