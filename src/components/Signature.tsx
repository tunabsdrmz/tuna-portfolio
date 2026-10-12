"use client";

import { useEffect, useRef } from "react";

const COLS = 30;
const ROWS = 12;
// Arrow drawn in unit space, pointing along +x: shaft + two barbs.
const SEGMENTS: [[number, number], [number, number]][] = [
  [
    [-0.5, 0],
    [0.42, 0],
  ],
  [
    [0.42, 0],
    [0.1, 0.24],
  ],
  [
    [0.42, 0],
    [0.1, -0.24],
  ],
];

/**
 * A 30×12 field of arrows that turn to face the pointer and swell near it.
 * When the pointer has never moved, a slow orbit drives them instead.
 */
export default function Signature({ paused = false }: { paused?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pointer = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const angles = new Float32Array(COLS * ROWS);
    let w = 0,
      h = 0,
      dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (pausedRef.current || w === 0 || h === 0) return;
      const t = (now - start) / 1000;
      const cellW = w / COLS;
      const cellH = h / ROWS;
      const size = 0.82 * Math.min(cellW, cellH);

      // Work in a centred, y-up space (like the original orthographic camera).
      const rect = canvas.getBoundingClientRect();
      let tx: number, ty: number;
      if (rect.width > 0 && pointer.x > -9998) {
        tx = ((pointer.x - rect.left) / rect.width - 0.5) * w;
        ty = -((pointer.y - rect.top) / rect.height - 0.5) * h;
      } else {
        tx = Math.cos(0.4 * t) * w * 0.3;
        ty = Math.sin(0.4 * t) * h * 0.3;
      }

      ctx.setTransform(dpr, 0, 0, -dpr, (w / 2) * dpr, (h / 2) * dpr);
      ctx.clearRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = getComputedStyle(canvas).color;
      ctx.lineWidth = 1 / dpr;
      ctx.beginPath();
      // Wobble scale is tuned in the original's world units (1 unit = 60px).
      const u = 60;
      for (let row = 0; row < ROWS; row++) {
        const cy = (row + 0.5) * cellH - h / 2;
        for (let col = 0; col < COLS; col++) {
          const cx = (col + 0.5) * cellW - w / 2;
          const i = row * COLS + col;
          const dx = tx - cx;
          const dy = ty - cy;
          let delta =
            Math.atan2(dy, cx === tx && cy === ty ? 1e-4 : dx) +
            0.1 * Math.sin(0.7 * t + (0.35 * cx) / u + (0.3 * cy) / u) -
            angles[i];
          while (delta > Math.PI) delta -= 2 * Math.PI;
          while (delta < -Math.PI) delta += 2 * Math.PI;
          angles[i] += 0.14 * delta;
          const a = angles[i];
          const dist = Math.hypot(dx, dy) / u;
          const len = size * (1 + 0.55 * Math.exp(-(dist * dist) / ((0.09 * w) / u)));
          const ca = Math.cos(a) * len;
          const sa = Math.sin(a) * len;
          for (const [[x1, y1], [x2, y2]] of SEGMENTS) {
            ctx.moveTo(cx + x1 * ca - y1 * sa, cy + x1 * sa + y1 * ca);
            ctx.lineTo(cx + x2 * ca - y2 * sa, cy + x2 * sa + y2 * ca);
          }
        }
      }
      ctx.stroke();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full text-fg" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 72% 78% at 50% 50%, transparent 40%, var(--color-card) 100%)",
        }}
      />
    </div>
  );
}
