"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
  type Transition,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDict } from "@/lib/i18n";
import { flightVector, rankCards, type Flight, type Placement } from "@/lib/layouts";
import { motionPermission, motionSupported, requestMotion } from "@/lib/shake";

type Rect = { x: number; y: number; w: number; h: number };

const rectOf = (id: string): Rect | null => {
  const el = document.querySelector(`[data-module="${id}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
};
const center = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

type Ghost = Record<"x" | "y" | "w" | "h" | "r" | "o", MotionValue<number>>;

function useGhost(): Ghost {
  return {
    x: useMotionValue(0),
    y: useMotionValue(0),
    w: useMotionValue(0),
    h: useMotionValue(0),
    r: useMotionValue(0),
    o: useMotionValue(0),
  };
}

/** A translucent outline standing in for a card while the demo "moves" it. */
function GhostBox({ g }: { g: Ghost }) {
  return (
    <motion.div
      className="absolute left-0 top-0 border border-mid/40 bg-mid/[0.05]"
      style={{ x: g.x, y: g.y, width: g.w, height: g.h, rotate: g.r, opacity: g.o }}
    />
  );
}

class Stopped extends Error {}

/**
 * First-visit walkthrough: a glowing hand taps the tabs, opens a card, drags
 * one card onto another and flings a third — all with ghosts, so the real
 * grid never changes. Any real interaction (or SKIP) stops it.
 */
export default function Demo({
  ready,
  cards,
  flight,
  touch = false,
  portrait = false,
}: {
  ready: boolean;
  cards: [string, Placement][];
  flight: Flight;
  touch?: boolean;
  portrait?: boolean;
}) {
  const { UI } = useDict();
  const [visible, setVisible] = useState(false);
  const started = useRef(false);
  const running = useRef(false);
  const [rerun, setRerun] = useState(0);
  const startDelay = useRef(500);
  const stopRef = useRef<((silent?: boolean) => void) | null>(null);

  const hx = useMotionValue(0);
  const hy = useMotionValue(0);
  const handO = useMotionValue(0);
  const handS = useMotionValue(1);
  const handR = useMotionValue(0);
  const tapO = useMotionValue(0);
  const tapS = useMotionValue(0.6);
  const labelO = useMotionValue(0);
  const [label, setLabel] = useState("");
  const [labelAbove, setLabelAbove] = useState(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const labelW = useMotionValue(0);
  const labelX = useTransform([hx, labelW], ([x, w]: number[]) => {
    const vw = window.innerWidth;
    return Math.min(Math.max(x + 28 + w <= vw - 8 ? x + 28 : x - 28 - w, 8), Math.max(8, vw - 8 - w));
  });
  useLayoutEffect(() => {
    if (labelRef.current) labelW.set(labelRef.current.offsetWidth);
  });

  const phoneO = useMotionValue(0);
  const phoneR = useMotionValue(0);
  const gridO = useMotionValue(0);
  const gridX = useMotionValue(0);
  const [shakeBoxes, setShakeBoxes] = useState<Rect[]>([]);
  const [offerShake, setOfferShake] = useState(false);

  const g1 = useGhost();
  const g2 = useGhost();
  const g3 = useGhost();

  // Stop as soon as the grid is no longer in its idle state.
  useEffect(() => {
    if (!ready) stopRef.current?.();
  }, [ready]);

  // Restart from the top when orientation or language changes mid-demo.
  const env = useRef({ portrait, UI });
  useEffect(() => {
    if (env.current.portrait === portrait && env.current.UI === UI) return;
    env.current = { portrait, UI };
    if (running.current) {
      stopRef.current?.(true);
      started.current = false;
      startDelay.current = 1100;
      setRerun((n) => n + 1);
    }
  }, [portrait, UI]);

  useEffect(() => {
    if (!ready || started.current) return;
    started.current = true;
    running.current = true;
    let stopped = false;
    const anims: AnimationPlaybackControls[] = [];
    const track = <T extends AnimationPlaybackControls>(a: T) => (anims.push(a), a);
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const check = () => {
      if (stopped) throw new Stopped();
    };
    const stop = (silent = false) => {
      if (stopped) return;
      stopped = true;
      running.current = false;
      if (!silent && touch && motionSupported() && motionPermission() === "unknown") setOfferShake(true);
      anims.forEach((a) => a.stop());
      Promise.all(
        [handO, labelO, phoneO, gridO, g1.o, g2.o, g3.o].map((v) => animate(v, 0, { duration: 0.25 })),
      ).then(() => setVisible(false));
    };
    stopRef.current = stop;

    const place = (g: Ghost, r: Rect) => {
      g.x.set(r.x);
      g.y.set(r.y);
      g.w.set(r.w);
      g.h.set(r.h);
      g.r.set(0);
    };
    const morphTo = (g: Ghost, r: Rect, t: Transition) =>
      Promise.all([
        track(animate(g.x, r.x, t)),
        track(animate(g.y, r.y, t)),
        track(animate(g.w, r.w, t)),
        track(animate(g.h, r.h, t)),
      ]);
    const moveHand = (p: { x: number; y: number }, t: Transition) =>
      Promise.all([track(animate(hx, p.x, t)), track(animate(hy, p.y, t))]);

    (async () => {
      await wait(startDelay.current);
      check();
      const { inward, outward } = rankCards(cards, flight);
      const byInward = [...cards].sort(([a], [b]) => inward[a] - inward[b]);
      const dragId = byInward[0]?.[0];
      const dragRect = dragId && rectOf(dragId);
      if (!dragId || !dragRect) return stop();
      const dragC = center(dragRect);
      const swapWith = byInward
        .slice(1)
        .map(([id]) => ({ id, r: rectOf(id) }))
        .filter((e): e is { id: string; r: Rect } => !!e.r)
        .sort(
          (a, b) =>
            Math.hypot(center(a.r).x - dragC.x, center(a.r).y - dragC.y) -
            Math.hypot(center(b.r).x - dragC.x, center(b.r).y - dragC.y),
        )[0];
      const flingCard = [...cards]
        .filter(([id]) => id !== dragId && id !== swapWith?.id)
        .sort(([a], [b]) => outward[a] - outward[b])[0];
      if (!swapWith || !flingCard) return stop();
      const swapRect = swapWith.r;
      const flingRect = rectOf(flingCard[0]);
      if (!flingRect) return stop();

      setVisible(true);
      const glide: Transition = { duration: 0.8, ease: [0.45, 0, 0.2, 1] };
      const enter = async (p: { x: number; y: number }) => {
        hx.set(window.innerWidth / 2);
        hy.set(window.innerHeight / 2);
        await track(animate(handO, 1, { duration: 0.35 }));
        check();
        await wait(380);
        check();
        await moveHand(p, { duration: 0.95, ease: [0.45, 0, 0.2, 1] });
        check();
      };
      const ripple = () =>
        Promise.all([
          track(animate(tapO, [0, 1, 0], { duration: 0.65, times: [0, 0.18, 1], ease: "easeOut" })),
          track(animate(tapS, [0.5, 1.7], { duration: 0.65, ease: "easeOut" })),
        ]);
      const tap = () =>
        Promise.all([
          ripple(),
          track(animate(handR, [0, 10, 0], { duration: 0.34, ease: "easeInOut" })),
          track(animate(handS, [1, 0.84, 1], { duration: 0.3, ease: "easeInOut" })),
        ]);
      const press = () =>
        Promise.all([
          ripple(),
          track(animate(handR, 10, { duration: 0.16, ease: "easeOut" })),
          track(animate(handS, 0.84, { duration: 0.14 })),
        ]);
      const release = (d = 0.16) =>
        Promise.all([
          track(animate(handR, 0, { duration: d, ease: "easeOut" })),
          track(animate(handS, 1, { duration: d })),
        ]);
      const say = (text: string, above = false) => {
        setLabelAbove(above);
        setLabel(text);
      };

      // 1 — tabs
      const tabs = [...document.querySelectorAll("nav button[data-tab]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - 4, y: r.top + 2, w: r.width + 8, h: r.height - 4 };
      });
      if (tabs.length) {
        await enter(center(tabs[0]));
        place(g1, tabs[0]);
        say(touch ? UI.demo.tabsPhone : UI.demo.tabsDesktop, true);
        await Promise.all([
          track(animate(g1.o, 1, { duration: 0.2 })),
          track(animate(labelO, 1, { duration: 0.3 })),
          tap(),
        ]);
        check();
        await wait(200);
        check();
        const hop: Transition = { duration: 0.42, ease: [0.45, 0, 0.2, 1] };
        for (const t of tabs.slice(1)) {
          await Promise.all([moveHand(center(t), hop), morphTo(g1, t, hop)]);
          check();
          await tap();
          check();
        }
        await wait(350);
        check();
        await Promise.all([
          track(animate(g1.o, 0, { duration: 0.25 })),
          track(animate(labelO, 0, { duration: 0.2 })),
        ]);
        check();
      }

      // 2 — open a card (ghost grows to cover the grid, then shrinks back)
      const openId = cards.find(([id]) => id === "experience" || id.startsWith("project-"))?.[0];
      const openRect = openId && rectOf(openId);
      const all = [...document.querySelectorAll("[data-module]")].map((el) => el.getBoundingClientRect());
      if (openRect && all.length) {
        const bounds = {
          x: Math.min(...all.map((r) => r.left)),
          y: Math.min(...all.map((r) => r.top)),
          w: Math.max(...all.map((r) => r.right)) - Math.min(...all.map((r) => r.left)),
          h: Math.max(...all.map((r) => r.bottom)) - Math.min(...all.map((r) => r.top)),
        };
        if (handO.get() < 0.5) await enter(center(openRect));
        else {
          await moveHand(center(openRect), glide);
          check();
        }
        say(UI.demo.open);
        place(g2, openRect);
        await Promise.all([
          tap(),
          track(animate(labelO, 1, { duration: 0.3 })),
          track(animate(g2.o, 1, { duration: 0.2 })),
        ]);
        check();
        const spring: Transition = { type: "spring", stiffness: 170, damping: 24 };
        await morphTo(g2, bounds, spring);
        check();
        await wait(550);
        check();
        await morphTo(g2, openRect, spring);
        check();
        await Promise.all([
          track(animate(g2.o, 0, { duration: 0.25 })),
          track(animate(labelO, 0, { duration: 0.2 })),
        ]);
        check();
      }

      // 3 — drag one card onto its neighbour to swap
      const grab = { x: dragC.x, y: dragC.y + 0.1 * dragRect.h };
      if (handO.get() < 0.5) await enter(grab);
      else {
        await moveHand(grab, glide);
        check();
      }
      say(UI.demo.swap);
      place(g1, dragRect);
      await Promise.all([
        press(),
        track(animate(g1.o, 1, { duration: 0.2 })),
        track(animate(labelO, 1, { duration: 0.3 })),
      ]);
      check();
      const off = { x: hx.get() - dragRect.x, y: hy.get() - dragRect.y };
      const dest = center(swapRect);
      const carry: Transition = { duration: 1, ease: [0.45, 0, 0.2, 1] };
      const tilt = 4 * Math.sign(dest.x - dragC.x);
      await Promise.all([
        moveHand(dest, carry),
        track(animate(g1.x, dest.x - off.x, carry)),
        track(animate(g1.y, dest.y - off.y, carry)),
        track(animate(g1.r, [0, tilt, 0], carry)),
      ]);
      check();
      place(g2, swapRect);
      const snap: Transition = { type: "spring", stiffness: 240, damping: 26 };
      await Promise.all([
        release(),
        track(animate(g2.o, 1, { duration: 0.15 })),
        morphTo(g1, swapRect, snap),
        morphTo(g2, dragRect, snap),
      ]);
      check();
      await wait(350);
      check();
      await Promise.all([
        track(animate(g1.o, 0, { duration: 0.35 })),
        track(animate(g2.o, 0, { duration: 0.35 })),
        track(animate(labelO, 0, { duration: 0.2 })),
      ]);
      check();

      // 4 — fling a card off-screen; it boomerangs back
      const fc = center(flingRect);
      await moveHand(fc, glide);
      check();
      say(UI.demo.fling);
      place(g3, flingRect);
      await Promise.all([
        press(),
        track(animate(g3.o, 1, { duration: 0.15 })),
        track(animate(labelO, 1, { duration: 0.25 })),
      ]);
      check();
      await wait(550);
      check();
      const v = portrait
        ? { x: 0.3 * Math.sign(window.innerWidth / 2 - fc.x), y: -1 }
        : flightVector(flingCard[1], flight);
      const len = Math.hypot(v.x, v.y) || 1;
      const dir = { x: v.x / len, y: v.y / len };
      const reach = Math.hypot(window.innerWidth, window.innerHeight);
      const out: Transition = { duration: portrait ? 0.75 : 0.5, ease: [0.15, 0.6, 0.35, 1] };
      await Promise.all([
        moveHand({ x: fc.x + 90 * dir.x, y: fc.y + 90 * dir.y }, { duration: 0.16, ease: "easeOut" }),
        release(),
        track(animate(g3.x, flingRect.x + dir.x * reach, out)),
        track(animate(g3.y, flingRect.y + dir.y * reach, out)),
        track(animate(g3.r, 320 * Math.sign(dir.x || 1), out)),
      ]);
      check();
      await wait(380);
      check();
      g3.r.set(14 * Math.sign(dir.x || 1));
      const back: Transition = { type: "spring", stiffness: 120, damping: 20 };
      await Promise.all([
        track(animate(g3.x, flingRect.x, back)),
        track(animate(g3.y, flingRect.y, back)),
        track(animate(g3.r, 0, back)),
      ]);
      check();
      await wait(300);
      check();

      // 5 — phones only: shake to reset
      if (touch && motionSupported()) {
        setShakeBoxes(cards.map(([id]) => rectOf(id)).filter((r): r is Rect => !!r));
        setLabel("");
        await Promise.all([
          track(animate(handO, 0, { duration: 0.25 })),
          track(animate(phoneO, 1, { duration: 0.3 })),
          track(animate(gridO, 1, { duration: 0.3 })),
        ]);
        check();
        const wobble: Transition = { duration: 0.75, ease: "easeInOut" };
        for (let i = 0; i < 2; i++) {
          await Promise.all([
            track(animate(phoneR, [0, -16, 16, -16, 16, -8, 0], wobble)),
            track(animate(gridX, [0, -7, 7, -7, 7, -3, 0], wobble)),
          ]);
          check();
          await wait(260);
          check();
        }
        await wait(500);
        check();
      }
      stop();
    })().catch(() => {});
  }, [ready, rerun]); // eslint-disable-line react-hooks/exhaustive-deps

  const offer = (
    <AnimatePresence>
      {offerShake && (
        <motion.div
          key="shake-offer"
          role="dialog"
          aria-label={UI.demo.shakeOffer}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-4 bottom-[4.5rem] z-[56] mx-auto max-w-xs flex flex-col items-center gap-3 px-4 py-3.5 border border-fg/50 bg-bg/90 backdrop-blur-sm text-fg shadow-glow-sm"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-center [text-shadow:0_0_8px_rgb(var(--glow)/calc(0.45*var(--glow-k)))]">
            {UI.demo.shakeOffer}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setOfferShake(false);
                void requestMotion();
              }}
              className="font-mono text-[10px] uppercase tracking-[0.22em] px-3 py-2 border border-fg text-fg shadow-glow-sm"
            >
              {UI.demo.shakeEnable}
            </button>
            <button
              type="button"
              onClick={() => setOfferShake(false)}
              className="font-mono text-[10px] uppercase tracking-[0.22em] px-3 py-2 border border-transparent text-mid"
            >
              {UI.demo.shakeLater}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!visible) return offer;

  return (
    <>
      {offer}
      <div className="fixed inset-0 z-[55] pointer-events-none">
        <motion.button
          type="button"
          onClick={() => stopRef.current?.()}
          aria-label={UI.demo.skipAria}
          className="pointer-events-auto absolute top-3 right-3 md:top-4 md:right-4 z-10 flex items-center gap-2 px-3 py-2 border border-fg/50 bg-bg/80 backdrop-blur-sm text-fg shadow-glow-sm hover:border-fg hover:shadow-glow transition-[border-color,box-shadow] duration-300 [text-shadow:0_0_8px_rgb(var(--glow)/calc(0.5*var(--glow-k)))]"
          style={{ opacity: handO }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.22em]">{UI.demo.skip}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" />
          </svg>
        </motion.button>
        <div aria-hidden>
          <motion.div className="absolute inset-0" style={{ x: gridX, opacity: gridO }}>
            {shakeBoxes.map((r, i) => (
              <div
                key={i}
                className="absolute border border-mid/40 bg-mid/[0.05]"
                style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
              />
            ))}
          </motion.div>
          <motion.div
            className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
            style={{ opacity: phoneO }}
          >
            <motion.svg
              width="46"
              height="76"
              viewBox="0 0 46 76"
              fill="none"
              className="text-mid/70 [filter:drop-shadow(0_0_8px_rgb(var(--glow)/calc(0.3*var(--glow-k))))]"
              style={{ rotate: phoneR }}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <rect x="2" y="2" width="42" height="72" rx="8" />
              <path d="M18 8h10" />
              <circle cx="23" cy="66" r="2.5" />
            </motion.svg>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-fg/90 whitespace-nowrap px-2.5 py-1.5 bg-bg/85 [text-shadow:0_0_8px_rgb(var(--glow)/calc(0.45*var(--glow-k)))]">
              {UI.demo.shake}
            </span>
          </motion.div>
          <GhostBox g={g1} />
          <GhostBox g={g2} />
          <GhostBox g={g3} />
          <motion.div className="absolute left-0 top-0" style={{ x: hx, y: hy, opacity: handO }}>
            <motion.span
              className="absolute -left-7 -top-7 w-14 h-14 rounded-full pointer-events-none"
              style={{
                opacity: tapO,
                scale: tapS,
                background:
                  "radial-gradient(circle, rgb(var(--glow) / calc(0.55 * var(--glow-k))) 0%, rgb(var(--glow) / calc(0.18 * var(--glow-k))) 42%, transparent 70%)",
              }}
            />
            <motion.svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              className="text-fg/85 -translate-x-[13px] -translate-y-[3px] origin-[13px_3px] [filter:drop-shadow(0_0_4px_rgb(var(--glow)/calc(0.75*var(--glow-k))))_drop-shadow(0_0_14px_rgb(var(--glow)/calc(0.35*var(--glow-k))))]"
              style={{ scale: handS, rotate: handR }}
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 14a8 8 0 0 1-8 8" />
              <path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
              <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" />
              <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" />
              <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </motion.svg>
          </motion.div>
          <motion.div className="absolute left-0 top-0" style={{ x: labelX, y: hy, opacity: labelO }}>
            <span
              ref={labelRef}
              className={`absolute left-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.24em] text-fg/90 px-1.5 py-0.5 bg-bg/60 [text-shadow:0_0_8px_rgb(var(--glow)/calc(0.45*var(--glow-k)))] ${
                labelAbove ? "-top-14" : "top-11"
              }`}
            >
              {label}
            </span>
          </motion.div>
        </div>
      </div>
    </>
  );
}
