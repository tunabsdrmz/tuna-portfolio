"use client";

import { AnimatePresence, animate, motion, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DICTS, type Dict } from "@/lib/content";
import { DictProvider, getLang, getServerLang, setLang, subscribeLang } from "@/lib/i18n";
import {
  DESKTOP,
  DETAIL_DESKTOP,
  DETAIL_MOBILE,
  FLIGHT_DESKTOP,
  FLIGHT_MOBILE,
  MOBILE,
  TABS,
  flightVector,
  gridArea,
  rankCards,
  zoomLayout,
  type Layout,
  type Placement,
  type TabId,
} from "@/lib/layouts";
import { armMotionRequest, useShake } from "@/lib/shake";
import Demo from "./Demo";
import Dock from "./Dock";
import Module, { captureRects } from "./Module";
import * as C from "./cards";
import { Cursor } from "./ui";

const Signature = dynamic(() => import("./Signature"), { ssr: false });

// Cards that never collapse to a title, whatever size a swap gives them.
const NEVER_COLLAPSE = ["signature", "footer"];

function titleFor(id: string, d: Dict) {
  if (id.startsWith("project-0"))
    return d.PROJECTS.find((p) => p.num === id.slice(-2))?.title ?? id;
  if (id.startsWith("cat-"))
    return d.STACK.find((c) => c.id === id.slice(4))?.label.replace(" & ", " &\n") ?? id;
  return d.MODULE_TITLES[id] ?? id.toUpperCase();
}

function useViewport() {
  const [v, setV] = useState({ portrait: false, touch: false, resolved: false });
  useLayoutEffect(() => {
    const p = window.matchMedia("(max-aspect-ratio: 4/5), (max-width: 767px) and (min-height: 541px)");
    const t = window.matchMedia("(pointer: coarse)");
    const update = () => setV({ portrait: p.matches, touch: t.matches, resolved: true });
    update();
    p.addEventListener("change", update);
    t.addEventListener("change", update);
    return () => {
      p.removeEventListener("change", update);
      t.removeEventListener("change", update);
    };
  }, []);
  return v;
}

function useReducedMotion() {
  const [r] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  return r;
}

const num = (v: unknown) =>
  typeof v === "number" ? v : v && typeof v === "object" && "value" in v ? Number((v as { value: number }).value) : 0;

type Metrics = { padL: number; padT: number; gapX: number; gapY: number; cellW: number; cellH: number };

export default function Stage({ initialTab = "index" }: { initialTab?: TabId }) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const [detail, setDetail] = useState<string | null>(null); // open project num
  const [busy, setBusy] = useState(true); // a transition is in flight
  const [booted, setBooted] = useState(false);
  const [intro, setIntro] = useState(true);
  const [zoom, setZoom] = useState<string | null>(null); // expanded card id
  const [swaps, setSwaps] = useState<Record<string, Layout>>({});
  const [resetCount, setResetCount] = useState(0);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);

  const { portrait, touch, resolved } = useViewport();
  const cols = portrait ? 4 : 12;
  const rows = portrait ? 12 : 8;
  const lang = useSyncExternalStore(subscribeLang, getLang, getServerLang);
  const dict = DICTS[lang];
  const flight = useMemo(() => (portrait ? FLIGHT_MOBILE : FLIGHT_DESKTOP), [portrait]);
  const reduced = useReducedMotion();

  const busyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const transition = useCallback(() => {
    setBusy(true);
    setIntro(false);
    clearTimeout(busyTimer.current);
    busyTimer.current = setTimeout(() => setBusy(false), reduced ? 200 : 950);
  }, [reduced]);

  useEffect(() => {
    if (!booted) return;
    busyTimer.current = setTimeout(() => setBusy(false), reduced ? 200 : 950);
    return () => clearTimeout(busyTimer.current);
  }, [booted, reduced]);

  // Let the boot outlines finish (sped up if hydration was slow), then swap in the app.
  useEffect(() => {
    if (!resolved) return;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      document.documentElement.dataset.booted = "1";
      document.getElementById("static-cv")?.setAttribute("hidden", "");
      setBooted(true);
    };
    const anims = document.querySelector(".boot")?.getAnimations({ subtree: true }) ?? [];
    if (anims.length === 0) return finish();
    const now = Math.max(...anims.map((a) => num(a.currentTime)));
    const left = Math.max(0, Math.max(...anims.map((a) => num(a.effect?.getComputedTiming().endTime))) - now);
    if (left === 0) return finish();
    const rate = Math.max(1, left / Math.max(300, 700 - now));
    anims.forEach((a) => (a.playbackRate = rate));
    const t = setTimeout(finish, Math.max(0, left / rate - 180));
    return () => {
      done = true;
      clearTimeout(t);
    };
  }, [resolved]);

  const go = useCallback(
    (id: TabId) => {
      if (id === tab && !detail && !zoom) return;
      transition();
      window.history.pushState(null, "", id === "index" ? "/" : `/${id}`);
      setTab(id);
      setDetail(null);
      setZoom(null);
    },
    [transition, tab, detail, zoom],
  );
  const openZoom = useCallback(
    (id: string) => {
      transition();
      setZoom(id);
    },
    [transition],
  );
  const closeZoom = useCallback(() => {
    transition();
    setZoom(null);
  }, [transition]);
  const openProject = useCallback(
    (n: string) => {
      transition();
      setDetail(n);
    },
    [transition],
  );
  const closeProject = useCallback(() => {
    transition();
    setDetail(null);
  }, [transition]);
  const stepProject = useCallback(
    (dir: number) => {
      if (!detail) return;
      const list = DICTS.en.PROJECTS;
      const i = list.findIndex((p) => p.num === detail);
      transition();
      setDetail(list[(i + dir + list.length) % list.length].num);
    },
    [transition, detail],
  );
  const toggleLang = useCallback(() => {
    transition();
    setLang(lang === "tr" ? "en" : "tr");
  }, [transition, lang]);

  useEffect(() => {
    const onPop = () => {
      setDetail(null);
      setZoom(null);
      const seg = window.location.pathname.replace(/^\/+|\/+$/g, "");
      setTab(TABS.find((t) => t.id === seg)?.id ?? "index");
      transition();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [transition]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA)$/.test(el.tagName)) return;
      if (e.key === "Escape" && zoom) {
        e.preventDefault();
        return closeZoom();
      }
      if (e.key === "Escape" && detail) {
        e.preventDefault();
        return closeProject();
      }
      if (detail) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          stepProject(1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          stepProject(-1);
        }
        return;
      }
      const t = TABS.find((x) => x.key === e.key);
      if (t) {
        e.preventDefault();
        return go(t.id);
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const i = TABS.findIndex((x) => x.id === tab);
        go(TABS[(i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tab, detail, zoom, go, closeProject, closeZoom, stepProject]);

  // Measure the grid so the identity card can glide between cells.
  const gridEl = useRef<HTMLDivElement | null>(null);
  const ro = useRef<ResizeObserver | null>(null);
  const metricsRef = useRef<Metrics | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const measure = useCallback(
    (el: HTMLDivElement) => {
      const cs = getComputedStyle(el);
      const gapX = parseFloat(cs.columnGap) || 0;
      const gapY = parseFloat(cs.rowGap) || 0;
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padT = parseFloat(cs.paddingTop) || 0;
      const w = el.clientWidth - padL - (parseFloat(cs.paddingRight) || 0);
      const h = el.clientHeight - padT - (parseFloat(cs.paddingBottom) || 0);
      if (w <= 0 || h <= 0) return;
      const m = { padL, padT, gapX, gapY, cellW: (w - gapX * (cols - 1)) / cols, cellH: (h - gapY * (rows - 1)) / rows };
      metricsRef.current = m;
      setMetrics(m);
    },
    [cols, rows],
  );
  const gridRef = useCallback(
    (el: HTMLDivElement | null) => {
      gridEl.current = el;
      ro.current?.disconnect();
      ro.current = null;
      if (!el) return;
      const obs = new ResizeObserver(() => measure(el));
      obs.observe(el);
      ro.current = obs;
      measure(el);
    },
    [measure],
  );

  const layoutKey = `${portrait ? "m" : "d"}:${tab}`;
  const base = portrait ? MOBILE[tab] : DESKTOP[tab];
  const layout: Layout = useMemo(
    () =>
      detail
        ? portrait
          ? DETAIL_MOBILE
          : DETAIL_DESKTOP
        : zoom
          ? zoomLayout(zoom, portrait)
          : (swaps[layoutKey] ?? base),
    [portrait, detail, zoom, swaps, layoutKey, base],
  );

  const swap = useCallback(
    (a: string, b: string) => {
      armMotionRequest();
      captureRects([a, b]);
      setSwaps((s) => {
        const cur = s[layoutKey] ?? base;
        return cur[a] && cur[b] ? { ...s, [layoutKey]: { ...cur, [a]: cur[b], [b]: cur[a] } } : s;
      });
    },
    [layoutKey, base],
  );

  const resetGrid = useCallback(() => {
    captureRects(Object.keys(layout).filter((id) => id !== "identity" && layout[id] !== base[id]));
    setSwaps((s) => {
      const next = { ...s };
      delete next[layoutKey];
      return next;
    });
  }, [layout, base, layoutKey]);

  const idle = !busy && !detail && !zoom;

  useShake(
    useCallback(() => {
      transition();
      setSwaps((s) => {
        if (!s[layoutKey]) return s;
        const next = { ...s };
        delete next[layoutKey];
        return next;
      });
      setResetCount((n) => n + 1);
      navigator.vibrate?.(40);
    }, [transition, layoutKey]),
    touch && idle,
  );

  // Rotating the phone mid-session counts as a transition.
  const lastPortrait = useRef<boolean | null>(null);
  useEffect(() => {
    if (!booted) return;
    if (lastPortrait.current !== null && lastPortrait.current !== portrait) transition();
    lastPortrait.current = portrait;
  }, [portrait, booted, transition]);

  const { entries, outward, inward, identityAt } = useMemo(() => {
    const all = Object.entries(layout) as [string, Placement][];
    const ranks = rankCards(all, flight);
    return {
      entries: all.filter(([id]) => id !== "identity"),
      outward: ranks.outward,
      inward: ranks.inward,
      identityAt: layout.identity,
    };
  }, [layout, flight]);

  // The identity card persists across pages and springs to its new cell.
  const idX = useMotionValue(0);
  const idY = useMotionValue(0);
  const idW = useMotionValue(0);
  const idH = useMotionValue(0);
  const idAnims = useRef<AnimationPlaybackControls[]>([]);
  const idLast = useRef<{ l: number; t: number; w: number; h: number } | null>(null);
  const idPrevPlacement = useRef<Placement | null>(null);
  useLayoutEffect(() => {
    const m = metricsRef.current ?? metrics;
    if (!m || !identityAt) return;
    const width = m.cellW * identityAt.col[1] + m.gapX * (identityAt.col[1] - 1);
    const rect = {
      l: m.padL + (m.cellW + m.gapX) * (identityAt.col[0] - 1),
      t: m.padT + (m.cellH + m.gapY) * (identityAt.row[0] - 1),
      w: width,
      h: m.cellH * identityAt.row[1] + m.gapY * (identityAt.row[1] - 1),
    };
    const last = idLast.current;
    if (last && last.l === rect.l && last.t === rect.t && last.w === rect.w && last.h === rect.h) return;
    idLast.current = rect;
    idAnims.current.forEach((a) => a.stop());
    idAnims.current = [];
    const pairs: [typeof idX, number][] = [
      [idX, rect.l],
      [idY, rect.t],
      [idW, rect.w],
      [idH, rect.h],
    ];
    const moved = idPrevPlacement.current !== null && idPrevPlacement.current !== identityAt;
    idPrevPlacement.current = identityAt;
    if (moved && !reduced)
      idAnims.current = pairs.map(([v, to]) =>
        animate(v, to, { type: "spring", stiffness: 200, damping: 28, mass: 0.8, delay: 0.2 }),
      );
    else pairs.forEach(([v, to]) => v.set(to));
  }, [metrics, identityAt, reduced, idX, idY, idW, idH]);

  const renderCard = (id: string): ReactNode => {
    if (id.startsWith("project-0")) {
      const p = dict.PROJECTS.find((x) => x.num === id.slice(-2))!;
      return <C.ProjectCard project={p} onOpen={openProject} />;
    }
    if (id.startsWith("cat-")) {
      const cat = dict.STACK.find((x) => x.id === id.slice(4))!;
      return <C.StackCatCard cat={cat} />;
    }
    switch (id) {
      case "status":
        return <C.StatusCard />;
      case "stats":
        return zoom === "stats" ? <C.StatsDetailCard /> : <C.StatsCard />;
      case "signature":
        return <Signature paused={busy && !intro} />;
      case "experience":
        return zoom === "experience" ? (
          <C.ExperienceDetailCard />
        ) : (
          <C.ExperienceCard onOpen={() => openZoom("experience")} />
        );
      case "location":
        return <C.LocationCard />;
      case "latest":
        return <C.LatestCard onGo={go} />;
      case "work-meta":
        return <C.WorkMetaCard />;
      case "cv":
        return <C.CvCard />;
      case "tech-count":
        return <C.TechCountCard />;
      case "education":
        return zoom === "education" ? (
          <C.EducationDetailCard />
        ) : (
          <C.EducationCard onOpen={() => openZoom("education")} />
        );
      case "headline":
        return <C.HeadlineCard />;
      case "email":
        return <C.EmailCard />;
      case "form":
        return <C.FormCard />;
      case "socials":
        return <C.SocialsCard />;
      case "footer":
        return <C.FooterCard />;
      case "project-detail":
        return detail && <C.ProjectDetail num={detail} />;
      case "detail-nav":
        return detail && <C.DetailNav num={detail} onClose={closeProject} onOpen={openProject} />;
      case "zoom-nav":
        return zoom === "experience" ? (
          <C.ZoomNav
            label={dict.UI.experience.label}
            title={dict.EMPLOYER.name}
            meta={`${dict.EMPLOYER.span} · ${dict.UI.roles(dict.ROLES.length)}`}
            onClose={closeZoom}
          />
        ) : zoom === "education" ? (
          <C.ZoomNav
            label={dict.UI.education.label}
            title={dict.UI.certs.title}
            meta={dict.UI.certs.count(dict.CERTIFICATIONS.length)}
            onClose={closeZoom}
          />
        ) : (
          <C.ZoomNav label={dict.UI.expanded} title={titleFor(zoom ?? "", dict).replace(/\n/g, " ")} onClose={closeZoom} />
        );
      default:
        return null;
    }
  };

  // A card squeezed below 80% of its home size in either axis shows just its title.
  const squeezed = (id: string, p: Placement) => {
    const home = base[id];
    if (detail || zoom || !home || NEVER_COLLAPSE.includes(id)) return false;
    return p.col[1] < 0.8 * home.col[1] || p.row[1] < 0.8 * home.row[1];
  };

  const mode = detail ? "o" : zoom ? "z" : "l";

  return (
    <DictProvider lang={lang}>
      <main className="fixed inset-0 bg-bg grid-bg">
        <Cursor />
        <div className="h-dvh w-full overflow-hidden">
          <div
            ref={gridRef}
            className="relative h-dvh w-full p-3 md:p-4 pb-[4.5rem] md:pb-[5.5rem] grid gap-2 md:gap-2.5"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
          >
            {resolved && booted && (
              <>
                {identityAt && (
                  <motion.div
                    style={
                      metrics
                        ? { position: "absolute", left: idX, top: idY, width: idW, height: idH }
                        : gridArea(identityAt)
                    }
                    className="module @container [container-type:size] z-10 min-h-0 min-w-0 hover:border-fg/35 hover:shadow-glow"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.28, delay: 0 }}
                      className="h-full w-full"
                    >
                      <C.IdentityCard onHome={() => go("index")} />
                    </motion.div>
                  </motion.div>
                )}
                <AnimatePresence mode="sync">
                  {entries.map(([id, p]) => (
                    <Module
                      key={`${id}:${portrait ? "m" : "d"}:${mode}:${resetCount}:${lang}`}
                      id={id}
                      placement={p}
                      throwable={{
                        enabled: idle,
                        target: hoverTarget === id,
                        onHover: setHoverTarget,
                        onFling: armMotionRequest,
                        onDrop: (target) => {
                          setHoverTarget(null);
                          if (target !== "identity") swap(id, target);
                        },
                      }}
                      custom={{
                        vector: flightVector(p, flight),
                        exitRank: outward[id] ?? 0,
                        enterRank: inward[id] ?? 0,
                        reduced,
                        intro,
                      }}
                    >
                      {squeezed(id, p) ? (
                        <C.CollapsedCard
                          title={titleFor(id, dict)}
                          onOpen={() => (id.startsWith("project-0") ? openProject(id.slice(-2)) : openZoom(id))}
                        />
                      ) : (
                        renderCard(id)
                      )}
                    </Module>
                  ))}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
        {resolved && booted && (
          <Demo ready={!detail && !zoom && !reduced} cards={entries} flight={flight} touch={touch} portrait={portrait} />
        )}
        <Dock
          tab={tab}
          onSelect={go}
          detailOpen={!!detail || !!zoom}
          onReset={!swaps[layoutKey] || detail || zoom ? undefined : resetGrid}
          onToggleLang={toggleLang}
        />
      </main>
    </DictProvider>
  );
}
