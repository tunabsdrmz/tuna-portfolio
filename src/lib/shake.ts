"use client";

import { useEffect, useRef, useState } from "react";

// Shake-to-reset on phones. iOS needs an explicit permission request that
// can only be made from a user gesture, so we ask on the first tap after
// the user has flung a card (or via the post-demo prompt).

type Permission = "unknown" | "unneeded" | "granted" | "denied";
type DME = typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> };

let permission: Permission | null = null;
const permissionListeners = new Set<() => void>();

export const motionSupported = () => window.isSecureContext && !!window.DeviceMotionEvent;

export function motionPermission(): Permission {
  return (permission ||= (window.DeviceMotionEvent as DME | undefined)?.requestPermission
    ? "unknown"
    : "unneeded");
}

let pending: Promise<boolean> | null = null;

export function requestMotion(): Promise<boolean> {
  if (motionPermission() !== "unknown") return Promise.resolve(permission !== "denied");
  return (pending ??= (async () => {
    try {
      const res = await (window.DeviceMotionEvent as DME).requestPermission!();
      permission = res === "granted" ? "granted" : "denied";
    } catch {
      armed = false;
      return false;
    } finally {
      pending = null;
    }
    permissionListeners.forEach((l) => l());
    return permission === "granted";
  })());
}

let armed = false;

/** Ask for motion permission on the next tap anywhere. */
export function armMotionRequest() {
  if (armed || motionPermission() !== "unknown") return;
  armed = true;
  setTimeout(() => {
    window.addEventListener("click", () => void requestMotion(), { once: true, capture: true });
  }, 0);
}

export function useShake(onShake: () => void, enabled: boolean) {
  const cb = useRef(onShake);
  useEffect(() => {
    cb.current = onShake;
  }, [onShake]);

  const [version, bump] = useState(0);
  useEffect(() => {
    const l = () => bump((n) => n + 1);
    permissionListeners.add(l);
    return () => {
      permissionListeners.delete(l);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !("DeviceMotionEvent" in window)) return;
    let spikes: number[] = [];
    let lastSpike = 0;
    let lastShake = 0;
    let prev: { x: number; y: number; z: number } | null = null;
    const onMotion = (e: DeviceMotionEvent) => {
      const now = performance.now();
      let force: number;
      const a = e.acceleration;
      if (a && a.x !== null && a.y !== null && a.z !== null) force = Math.hypot(a.x, a.y, a.z);
      else {
        const g = e.accelerationIncludingGravity;
        if (!g || g.x === null || g.y === null || g.z === null) return;
        const cur = { x: g.x, y: g.y, z: g.z };
        force = prev ? Math.hypot(cur.x - prev.x, cur.y - prev.y, cur.z - prev.z) : 0;
        prev = cur;
      }
      if (force < 12 || now - lastSpike < 80) return;
      lastSpike = now;
      spikes = [...spikes.filter((t) => now - t < 1000), now];
      if (spikes.length < 3 || now - lastShake < 1500) return;
      lastShake = now;
      spikes = [];
      cb.current();
    };
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [enabled, version]);
}
