// Grid placements. `col: [start, span]`, `row: [start, span]`.
export type Placement = { col: [number, number]; row: [number, number] };
export type Layout = Record<string, Placement>;
export type TabId = "index" | "work" | "stack" | "contact";

export const TABS: { id: TabId; key: string }[] = [
  { id: "index", key: "1" },
  { id: "work", key: "2" },
  { id: "stack", key: "3" },
  { id: "contact", key: "4" },
];

// Desktop: 12 × 8
export const DESKTOP: Record<TabId, Layout> = {
  index: {
    identity: { col: [1, 5], row: [1, 4] },
    status: { col: [6, 3], row: [1, 2] },
    stats: { col: [9, 4], row: [1, 2] },
    signature: { col: [6, 7], row: [3, 3] },
    experience: { col: [1, 5], row: [5, 4] },
    location: { col: [6, 3], row: [6, 3] },
    latest: { col: [9, 4], row: [6, 3] },
  },
  work: {
    identity: { col: [1, 3], row: [1, 2] },
    "work-meta": { col: [1, 3], row: [3, 2] },
    "project-01": { col: [4, 5], row: [1, 4] },
    "project-02": { col: [9, 4], row: [1, 4] },
    cv: { col: [1, 3], row: [5, 4] },
    "project-03": { col: [4, 5], row: [5, 4] },
    "project-04": { col: [9, 4], row: [5, 4] },
  },
  stack: {
    identity: { col: [1, 3], row: [1, 2] },
    "tech-count": { col: [1, 3], row: [3, 2] },
    education: { col: [1, 3], row: [5, 4] },
    "cat-languages": { col: [4, 3], row: [1, 3] },
    "cat-frontend": { col: [4, 3], row: [4, 5] },
    "cat-backend": { col: [7, 3], row: [1, 8] },
    "cat-tools": { col: [10, 3], row: [1, 5] },
    "cat-databases": { col: [10, 3], row: [6, 3] },
  },
  contact: {
    identity: { col: [1, 4], row: [1, 3] },
    email: { col: [5, 8], row: [1, 2] },
    form: { col: [5, 8], row: [3, 5] },
    headline: { col: [1, 4], row: [4, 5] },
    socials: { col: [5, 5], row: [8, 1] },
    footer: { col: [10, 3], row: [8, 1] },
  },
};

// Portrait / phone: 4 × 12
export const MOBILE: Record<TabId, Layout> = {
  index: {
    identity: { col: [1, 4], row: [1, 2] },
    stats: { col: [1, 4], row: [3, 2] },
    experience: { col: [1, 4], row: [5, 4] },
    signature: { col: [1, 2], row: [9, 2] },
    latest: { col: [3, 2], row: [9, 2] },
    status: { col: [1, 2], row: [11, 2] },
    location: { col: [3, 2], row: [11, 2] },
  },
  work: {
    identity: { col: [1, 4], row: [1, 2] },
    "work-meta": { col: [1, 4], row: [3, 2] },
    "project-01": { col: [1, 2], row: [5, 3] },
    "project-02": { col: [3, 2], row: [5, 3] },
    "project-03": { col: [1, 2], row: [8, 3] },
    "project-04": { col: [3, 2], row: [8, 3] },
    cv: { col: [1, 4], row: [11, 2] },
  },
  stack: {
    identity: { col: [1, 4], row: [1, 2] },
    "tech-count": { col: [1, 2], row: [3, 2] },
    "cat-databases": { col: [3, 2], row: [3, 2] },
    "cat-languages": { col: [1, 2], row: [5, 2] },
    "cat-backend": { col: [1, 2], row: [7, 4] },
    "cat-frontend": { col: [3, 2], row: [5, 3] },
    "cat-tools": { col: [3, 2], row: [8, 3] },
    education: { col: [1, 4], row: [11, 2] },
  },
  contact: {
    identity: { col: [1, 4], row: [1, 2] },
    headline: { col: [1, 4], row: [3, 3] },
    email: { col: [1, 4], row: [6, 2] },
    form: { col: [1, 4], row: [8, 4] },
    socials: { col: [1, 2], row: [12, 1] },
    footer: { col: [3, 2], row: [12, 1] },
  },
};

export const DETAIL_DESKTOP: Layout = {
  identity: { col: [1, 3], row: [1, 2] },
  "detail-nav": { col: [1, 3], row: [3, 6] },
  "project-detail": { col: [4, 9], row: [1, 8] },
};

export const DETAIL_MOBILE: Layout = {
  identity: { col: [1, 4], row: [1, 2] },
  "project-detail": { col: [1, 4], row: [3, 9] },
  "detail-nav": { col: [1, 4], row: [12, 1] },
};

export const zoomLayout = (id: string, portrait: boolean): Layout =>
  portrait
    ? {
        identity: { col: [1, 4], row: [1, 2] },
        [id]: { col: [1, 4], row: [3, 9] },
        "zoom-nav": { col: [1, 4], row: [12, 1] },
      }
    : {
        identity: { col: [1, 3], row: [1, 2] },
        "zoom-nav": { col: [1, 3], row: [3, 6] },
        [id]: { col: [4, 9], row: [1, 8] },
      };

export function gridArea(p: Placement) {
  return {
    gridColumn: `${p.col[0]} / span ${p.col[1]}`,
    gridRow: `${p.row[0]} / span ${p.row[1]}`,
  };
}

export type Flight = { cols: number; rows: number; travelX: number; travelY: number; rtl?: boolean };
export const FLIGHT_DESKTOP: Flight = { cols: 12, rows: 8, travelX: 1400, travelY: 1000 };
export const FLIGHT_MOBILE: Flight = { cols: 4, rows: 12, travelX: 560, travelY: 900 };

// Each card flies in/out along the nearest 45° direction from the grid centre.
export function flightVector(p: Placement, f: Flight = FLIGHT_DESKTOP) {
  const cx = (p.col[0] - 1 + p.col[1] / 2) / f.cols;
  const cy = (p.row[0] - 1 + p.row[1] / 2) / f.rows;
  const dx = (f.rtl ? 1 - cx : cx) - 0.5;
  const dy = cy - 0.5;
  const radius = Math.hypot(dx, dy);
  const angle =
    radius < 0.01 ? Math.PI / 2 : (Math.PI / 4) * Math.round(Math.atan2(dy, dx) / (Math.PI / 4));
  return {
    x: Math.cos(angle) * f.travelX,
    y: Math.sin(angle) * f.travelY,
    rotate: Math.cos(angle) >= 0 ? 3 : -3,
    radius,
  };
}

export function rankCards(entries: [string, Placement][], f: Flight = FLIGHT_DESKTOP) {
  const items = entries.map(([id, p]) => ({ id, r: flightVector(p, f).radius }));
  const inward: Record<string, number> = {};
  [...items].sort((a, b) => a.r - b.r).forEach((e, i) => (inward[e.id] = i));
  const outward: Record<string, number> = {};
  [...items].sort((a, b) => b.r - a.r).forEach((e, i) => (outward[e.id] = i));
  return { outward, inward };
}
