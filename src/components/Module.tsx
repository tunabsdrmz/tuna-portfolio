"use client";

import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  type AnimationPlaybackControls,
  type PanInfo,
  type Transition,
  type Variants,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gridArea, type Placement } from "@/lib/layouts";

export type CardCustom = {
  vector: { x: number; y: number; rotate: number };
  exitRank: number;
  enterRank: number;
  reduced: boolean;
  intro: boolean;
};

export const cardVariants: Variants = {
  reveal: ({ reduced }: CardCustom) =>
    reduced ? { opacity: 0 } : { opacity: 0, scale: 0.985, y: 4, x: 0, rotate: 0 },
  enter: ({ vector, reduced }: CardCustom) =>
    reduced ? { opacity: 0 } : { opacity: 0, x: vector.x, y: vector.y, scale: 0.94, rotate: vector.rotate },
  settled: ({ enterRank, reduced, intro }: CardCustom) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: reduced
      ? { duration: 0.2, delay: 0 }
      : intro
        ? {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.6,
            delay: 0.025 * enterRank,
            opacity: { duration: 0.2, delay: 0.025 * enterRank },
          }
        : {
            type: "spring",
            stiffness: 220,
            damping: 26,
            mass: 0.9,
            delay: 0.2 + 0.045 * enterRank,
            opacity: { duration: 0.28, delay: 0.2 + 0.045 * enterRank },
          },
  }),
  exit: ({ vector, exitRank, reduced }: CardCustom) =>
    reduced
      ? { opacity: 0, transition: { duration: 0.15 } }
      : {
          opacity: 0,
          x: vector.x,
          y: vector.y,
          scale: 0.92,
          rotate: vector.rotate,
          transition: {
            duration: 0.42,
            delay: 0.035 * exitRank,
            ease: [0.5, 0, 0.75, 0],
            opacity: { duration: 0.25, delay: 0.035 * exitRank + 0.17 },
          },
        },
};

/* ---------- swap morph: remember where cards were before a re-layout ---------- */

type Rect = { x: number; y: number; w: number; h: number };
const pendingMorph = new Map<string, Rect>();

const centerOf = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

export function captureRects(ids: string[]) {
  for (const id of ids) {
    const el = document.querySelector<HTMLElement>(`[data-module="${id}"]`);
    const parent = el?.offsetParent;
    if (!el || !parent) continue;
    const p = parent.getBoundingClientRect();
    const c = centerOf(el);
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    pendingMorph.set(id, { x: c.x - p.left - w / 2, y: c.y - p.top - h / 2, w, h });
  }
}

/* ---------- z-order + fling return pacing ---------- */

let zCounter = 0;
const nextZ = () => 30 + (zCounter = (zCounter + 1) % 1000);

// Flung cards come back one after another, never all at once.
let lastReturn = 0;
function waitForReturnSlot() {
  return new Promise<void>((resolve) => {
    const now = performance.now();
    const at = Math.max(now + 420, lastReturn + 220);
    lastReturn = at;
    setTimeout(resolve, at - now);
  });
}

export const IMPACT_EVENT = "grid:impact";
type Impact = { x: number; y: number; strength: number; source: string };

function cardUnder(point: { x: number; y: number }, self: string) {
  for (const el of document.elementsFromPoint(point.x, point.y)) {
    const id = (el.closest?.("[data-module]") as HTMLElement | null)?.dataset.module;
    if (id && id !== self) return id;
  }
  return null;
}

export type Throwable = {
  enabled: boolean;
  target: boolean;
  onHover: (id: string | null) => void;
  onFling?: () => void;
  onDrop: (id: string) => void;
};

export default function Module({
  id,
  placement,
  custom,
  children,
  padded = true,
  throwable,
}: {
  id: string;
  placement: Placement;
  custom: CardCustom;
  children: ReactNode;
  padded?: boolean;
  throwable?: Throwable;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  const controls = useDragControls();
  const [z, setZ] = useState<number | null>(null);
  const lift = (on: boolean) => setZ(on ? nextZ() : null);
  const dragged = useRef(false);
  const flight = useRef<null | "out" | "away" | "back">(null);

  // Impact nudge lives on the CSS `translate`/`rotate` props so it composes
  // with the drag transform instead of fighting it.
  const ix = useMotionValue(0);
  const iy = useMotionValue(0);
  const ir = useMotionValue(0);
  useEffect(() => {
    const apply = () => {
      const el = ref.current;
      if (!el) return;
      const a = ix.get(),
        b = iy.get(),
        r = ir.get();
      el.style.translate = a || b ? `${a}px ${b}px` : "";
      el.style.rotate = r ? `${r}deg` : "";
    };
    const subs = [ix, iy, ir].map((v) => v.on("change", apply));
    return () => subs.forEach((u) => u());
  }, [ix, iy, ir]);

  const reduced = custom.reduced;

  // Morph from the pre-swap rect to the new grid cell.
  const morph = useRef<AnimationPlaybackControls | null>(null);
  useLayoutEffect(() => {
    const from = pendingMorph.get(id);
    const el = ref.current;
    if (!from || !el) return;
    pendingMorph.delete(id);
    morph.current?.stop();
    const s = el.style;
    const clear = () => {
      s.position = s.left = s.top = s.width = s.height = "";
      delete el.dataset.morphing;
    };
    clear();
    x.stop();
    y.stop();
    x.set(0);
    y.set(0);
    const settle = { type: "spring", stiffness: 260, damping: 30 } as const;
    animate(rotate, 0, settle);
    animate(scale, 1, settle);
    if (reduced) return;
    const to = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
    const frame = (t: number) => {
      s.left = `${(from.x - to.x) * (1 - t)}px`;
      s.top = `${(from.y - to.y) * (1 - t)}px`;
      s.width = `${from.w + (to.w - from.w) * t}px`;
      s.height = `${from.h + (to.h - from.h) * t}px`;
    };
    s.position = "absolute";
    el.dataset.morphing = "1";
    frame(0);
    morph.current = animate(0, 1, {
      type: "spring",
      stiffness: 170,
      damping: 24,
      mass: 1,
      onUpdate: frame,
      onComplete: clear,
    });
    return () => {
      morph.current?.stop();
      clear();
    };
  }, [id, placement, reduced, x, y, rotate, scale]);

  // Get shoved when a thrown card lands nearby.
  const enabled = !!throwable?.enabled;
  useEffect(() => {
    if (reduced) return;
    const onImpact = (e: Event) => {
      const { x: px, y: py, strength, source } = (e as CustomEvent<Impact>).detail;
      const el = ref.current;
      if (!el || source === id || dragged.current || !enabled) return;
      if (flight.current === "out" || flight.current === "away") return;
      const c = centerOf(el);
      const dx = c.x - px,
        dy = c.y - py;
      const d = Math.hypot(dx, dy) || 1;
      const f = strength * Math.max(0, 1 - d / 900);
      if (f < 1) return;
      const t: Transition = { duration: 0.8, times: [0, 0.3, 1], ease: ["easeOut", "easeInOut"], delay: d / 2200 };
      animate(ix, [ix.get(), (dx / d) * f, 0], t);
      animate(iy, [iy.get(), (dy / d) * f, 0], t);
      animate(ir, [ir.get(), (dx / d) * f * 0.12, 0], t);
    };
    window.addEventListener(IMPACT_EVENT, onImpact);
    return () => window.removeEventListener(IMPACT_EVENT, onImpact);
  }, [id, reduced, enabled, ix, iy, ir]);

  const springBack = () => {
    const s = { type: "spring", stiffness: 300, damping: 24 } as const;
    animate(x, 0, s);
    animate(y, 0, s);
    animate(rotate, 0, s);
    animate(scale, 1, s).then(() => lift(false));
  };

  const fling = async (v: { x: number; y: number }, speed: number) => {
    flight.current = "out";
    const dir = { x: v.x / speed, y: v.y / speed };
    const reach = 1.1 * Math.hypot(window.innerWidth, window.innerHeight);
    const spin = Math.sign(v.x || 1) * Math.min(540, 160 + speed / 12);
    const out = { duration: 0.55, ease: [0.15, 0.6, 0.35, 1] } as const;
    await Promise.all([
      animate(x, x.get() + dir.x * reach, out),
      animate(y, y.get() + dir.y * reach, out),
      animate(rotate, rotate.get() + spin, out),
    ]);
    flight.current = "away";
    await waitForReturnSlot();
    flight.current = "back";
    setZ(nextZ());
    rotate.set(14 * Math.sign(dir.x || 1));
    const back = { type: "spring", stiffness: 120, damping: 20, mass: 1 } as const;
    const landing = Promise.all([
      animate(x, 0, back),
      animate(y, 0, back),
      animate(rotate, 0, back),
      animate(scale, 1, back),
    ]);
    setTimeout(() => {
      const el = ref.current;
      if (!el)
        return;
      window.dispatchEvent(
        new CustomEvent<Impact>(IMPACT_EVENT, { detail: { ...centerOf(el), strength: 18, source: id } }),
      );
    }, 480);
    await landing;
    flight.current = null;
    lift(false);
  };

  return (
    <motion.div
      ref={ref}
      data-module={id}
      custom={custom}
      variants={cardVariants}
      initial={custom.intro ? "reveal" : "enter"}
      animate="settled"
      exit="exit"
      drag={enabled}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      onPointerDown={(e) => {
        if (!throwable?.enabled || flight.current) return;
        if ((e.target as Element).closest("input,textarea,select,[contenteditable]")) return;
        dragged.current = false;
        e.preventDefault();
        controls.start(e);
      }}
      onDragStart={() => {
        dragged.current = true;
        lift(true);
        x.stop();
        y.stop();
        animate(scale, 1.04, { type: "spring", stiffness: 400, damping: 25 });
      }}
      onDrag={(_, info: PanInfo) => {
        const tilt = Math.max(-9, Math.min(9, info.velocity.x / 140));
        rotate.set(rotate.get() + (tilt - rotate.get()) * 0.18);
        throwable?.onHover(cardUnder(info.point, id));
      }}
      onDragEnd={(_, info: PanInfo) => {
        throwable?.onHover(null);
        setTimeout(() => {
          dragged.current = false;
        }, 0);
        const speed = Math.hypot(info.velocity.x, info.velocity.y);
        if (speed > 1100 && !reduced) {
          throwable?.onFling?.();
          fling(info.velocity, speed);
          return;
        }
        const target = cardUnder(info.point, id);
        if (target) {
          throwable?.onDrop(target);
          animate(scale, 1, { type: "spring", stiffness: 300, damping: 24 });
          // The swap morph restarts the scale spring, so don't wait on it.
          setTimeout(() => lift(false), 450);
          return;
        }
        springBack();
      }}
      onClickCapture={(e) => {
        if (dragged.current) {
          dragged.current = false;
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      style={{
        ...gridArea(placement),
        x,
        y,
        scale,
        rotate,
        willChange: "transform, opacity",
        zIndex: z ?? undefined,
        touchAction: enabled ? "none" : undefined,
      }}
      className={`module @container [container-type:size] min-h-0 min-w-0 hover:border-fg/35 hover:shadow-glow ${
        z !== null ? "!border-fg/60 shadow-glow-lg" : ""
      } ${throwable?.target ? "!border-fg shadow-glow-lg" : ""} ${padded ? "" : "p-0"}`}
    >
      {children}
    </motion.div>
  );
}
