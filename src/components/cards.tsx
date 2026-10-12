"use client";

import { useState, type FormEvent } from "react";
import {
  CV_URL,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE,
  type Project,
  type Role,
  type StackCat,
  type Stat,
} from "@/lib/content";
import { useDict } from "@/lib/i18n";
import { Arrow, Counter, GlowRule, Magnetic, ModuleHeader, PulseDot, Scramble, Tag } from "./ui";
import ProjectReel from "./ProjectReel";

/* ---------------- identity ---------------- */

export function IdentityCard({ onHome }: { onHome?: () => void }) {
  const { IDENTITY, UI } = useDict();
  const Tag_ = onHome ? "button" : "div";
  const props = onHome ? { onClick: onHome, type: "button" as const, "aria-label": UI.identity.homeAria } : {};
  return (
    <Tag_
      {...props}
      className="group relative h-full w-full text-start flex flex-col p-[clamp(0.6rem,4cqh,1.5rem)] gap-[clamp(0.35rem,2.5cqh,0.75rem)]"
    >
      {onHome && (
        <span className="absolute top-[clamp(0.6rem,4cqh,1.5rem)] end-[clamp(0.6rem,4cqh,1.5rem)] font-mono uppercase tracking-[0.24em] text-dim opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[clamp(8px,1.9cqh,10px)]">
          {UI.identity.home} <Arrow>↖</Arrow>
        </span>
      )}
      <div className="min-w-0 shrink-0 flex flex-col gap-0.5">
        <span className="font-mono uppercase tracking-[0.28em] text-dim text-[clamp(8px,1.9cqh,10px)]">
          {UI.identity.portfolio}
        </span>
        <span className="font-mono uppercase tracking-[0.16em] text-mid leading-relaxed text-[clamp(8px,2.1cqh,11px)]">
          {IDENTITY.role}
        </span>
      </div>
      <div className="flex-1 min-h-0 flex items-center overflow-hidden">
        <h1
          dir="ltr"
          className="font-display text-fg leading-[0.86] tracking-tight text-[clamp(1.1rem,min(11cqw,26cqh),4rem)] @[420px]:text-[clamp(1.5rem,min(13cqw,19cqh),7rem)]"
        >
          <span className="inline @[420px]:block">{IDENTITY.first}</span>{" "}
          <span className="inline @[420px]:block @[420px]:text-transparent @[420px]:[-webkit-text-stroke:2px_var(--color-fg)]">
            {IDENTITY.last}
          </span>
        </h1>
      </div>
      <div className="shrink-0 flex flex-col gap-1.5">
        <p className="hidden @[420px]:block font-mono uppercase tracking-[0.14em] text-dim leading-relaxed text-[clamp(9px,2.2cqh,11px)]">
          {IDENTITY.tagline}
        </p>
        <div className="flex items-center gap-2">
          <PulseDot />
          <span className="font-mono uppercase tracking-[0.22em] text-mid text-[clamp(8px,2cqh,10px)]">
            <span className="@[420px]:hidden">{IDENTITY.availability.short}</span>
            <span className="hidden @[420px]:inline">{IDENTITY.availability.long}</span>
          </span>
        </div>
      </div>
    </Tag_>
  );
}

/* ---------------- index ---------------- */

export function StatusCard() {
  const { IDENTITY, UI } = useDict();
  return (
    <div className="h-full flex flex-col justify-between p-4 @[260px]:p-5">
      <ModuleHeader>{UI.status.label}</ModuleHeader>
      <div className="flex items-center gap-2.5">
        <PulseDot />
        <span className="font-display text-fg leading-none tracking-tight text-[clamp(1.1rem,min(14cqw,24cqh),2.5rem)]">
          {UI.status.value}
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim leading-relaxed">
        {IDENTITY.availability.note}
      </span>
    </div>
  );
}

export function StatsCard() {
  const { STATS, UI } = useDict();
  return (
    <div className="h-full flex flex-col justify-between p-4 @[300px]:p-5">
      <ModuleHeader>{UI.stats.label}</ModuleHeader>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${STATS.length}, minmax(0, 1fr))` }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="flex flex-col gap-1 min-w-0">
            <span className="font-display text-fg leading-none text-[clamp(1.1rem,min(9cqw,22cqh),3rem)]">
              <Counter to={s.value} suffix={s.suffix} delay={500 + 120 * i} />
            </span>
            <span className="cq-h80 font-mono text-[8px] @[300px]:text-[9px] uppercase tracking-[0.16em] text-dim leading-tight">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsDetailCard() {
  const { STATS_DETAIL, UI } = useDict();
  return (
    <div className="h-full flex flex-col p-4 @[420px]:p-6 gap-4 min-h-0">
      <ModuleHeader right={UI.stats.figures(STATS_DETAIL.length)}>{UI.stats.label}</ModuleHeader>
      <div className="stats-detail flex-1 min-h-0 grid gap-x-4 @[420px]:gap-x-6">
        {STATS_DETAIL.map((s: Stat, i: number) => (
          <div
            key={s.label}
            className="flex flex-col justify-end gap-2 border-t border-hairline pt-3 pb-1 min-h-0 min-w-0"
          >
            <span className="font-display text-fg leading-[0.85] tracking-tight text-[clamp(2.25rem,min(13cqw,17cqh),9rem)]">
              <Counter to={s.value} suffix={s.suffix ?? ""} delay={250 + 90 * i} />
            </span>
            <span className="font-mono text-[10px] @[420px]:text-[11px] uppercase tracking-[0.18em] text-fg truncate">
              {s.label}
            </span>
            <span className="font-mono text-[9px] @[420px]:text-[10px] uppercase tracking-[0.16em] text-dim truncate">
              {s.note}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LocationCard() {
  const { IDENTITY, UI } = useDict();
  return (
    <div className="h-full flex flex-col justify-between p-4 @[260px]:p-5 overflow-hidden">
      <ModuleHeader>{UI.location.label}</ModuleHeader>
      <div>
        <span className="font-display text-fg leading-[0.9] block tracking-tight text-[clamp(1.25rem,min(18cqw,26cqh),3.25rem)]">
          {UI.location.city}
        </span>
        <div className="cq-h100">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim mt-1.5 block">
            {IDENTITY.reach}
          </span>
        </div>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mid">{UI.location.note}</span>
    </div>
  );
}

export function LatestCard({ onGo }: { onGo: (tab: "work") => void }) {
  const { PROJECTS, UI } = useDict();
  const p = PROJECTS[0];
  return (
    <button
      onClick={() => onGo("work")}
      className="h-full w-full text-start flex flex-col justify-between p-4 @[300px]:p-5 group"
    >
      <ModuleHeader right={p.year}>{UI.latest.label}</ModuleHeader>
      <div className="min-w-0">
        <span className="font-display text-fg leading-[0.88] block tracking-tight whitespace-pre-line text-[clamp(1.1rem,min(11cqw,17cqh),2.5rem)]">
          {p.title}
        </span>
        <div className="cq-h100">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim mt-2 block truncate">
            {p.subtitle}
          </span>
        </div>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-mid group-hover:text-fg transition-colors flex items-center gap-2">
        {UI.latest.cta} <Arrow>→</Arrow>
      </span>
    </button>
  );
}

function RoleRow({ role }: { role: Role }) {
  return (
    <div className="group relative flex gap-3 min-h-0">
      <div className="flex flex-col items-center pt-[7px] shrink-0">
        <span
          className="block h-px bg-fg transition-all duration-300"
          style={{
            width: 8 + 7 * role.level,
            boxShadow: role.level === 3 ? "0 0 10px 1px rgb(var(--glow) / calc(0.6 * var(--glow-k)))" : "none",
            opacity: 0.35 + 0.22 * role.level,
          }}
        />
      </div>
      <div className="min-w-0 flex-1 border-b border-hairline pb-1.5 last:border-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[10px] @[420px]:text-[11px] uppercase tracking-[0.12em] text-fg truncate">
            {role.title}
            <span className="text-dim"> · {role.company}</span>
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim shrink-0">
            {role.from} — {role.to}
          </span>
        </div>
        <div className="role-blurb mt-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-dim leading-relaxed line-clamp-2">
            {role.blurb}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ExperienceCard({ onOpen }: { onOpen?: () => void }) {
  const { EMPLOYER, ROLES, UI } = useDict();
  const Tag_ = onOpen ? "button" : "div";
  return (
    <Tag_
      {...(onOpen ? { onClick: onOpen, type: "button" as const } : {})}
      className="group h-full w-full text-start flex flex-col p-4 @[420px]:p-5 gap-3 min-h-0"
    >
      <ModuleHeader right={EMPLOYER.span}>
        {UI.experience.label} — {EMPLOYER.tag}
      </ModuleHeader>
      <div className="flex-1 min-h-0 flex flex-col justify-between gap-1.5">
        {ROLES.filter((r) => r.featured).map((r) => (
          <RoleRow key={r.company + r.from} role={r} />
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="hidden @[420px]:flex flex-wrap gap-1.5">
          {["REACT NATIVE", "NEXT.JS", "NESTJS", "TYPESCRIPT", "C#"].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        {onOpen && (
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim group-hover:text-fg transition-colors flex items-center gap-2 shrink-0 ms-auto">
            {UI.expand} <Arrow>↗</Arrow>
          </span>
        )}
      </div>
    </Tag_>
  );
}

export function ExperienceDetailCard() {
  const { EMPLOYER, ROLES, UI } = useDict();
  return (
    <div className="h-full flex flex-col p-5 @[700px]:p-6 gap-4 min-h-0 overflow-y-auto">
      <ModuleHeader right={EMPLOYER.span}>
        {UI.experience.label} — {EMPLOYER.tag}
      </ModuleHeader>
      <div className="shrink-0">
        <h2 className="font-display text-fg leading-[0.86] tracking-tight text-[clamp(1.75rem,min(9cqw,14cqh),4.5rem)]">
          {EMPLOYER.name}
        </h2>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mid mt-2 leading-relaxed">
          {EMPLOYER.summary}
        </p>
      </div>
      <GlowRule />
      <div className="flex-1 min-h-0 flex flex-col justify-between gap-4 @[700px]:gap-5">
        {ROLES.map((r) => (
          <div key={r.company + r.from} className="flex gap-3 @[700px]:gap-4">
            <div className="flex flex-col items-center pt-2 shrink-0">
              <span
                className="block h-px bg-fg"
                style={{
                  width: 12 + 9 * r.level,
                  boxShadow:
                    r.level === 3 ? "0 0 10px 1px rgb(var(--glow) / calc(0.6 * var(--glow-k)))" : "none",
                  opacity: 0.35 + 0.22 * r.level,
                }}
              />
            </div>
            <div className="min-w-0 flex-1 border-b border-hairline pb-4 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="font-mono text-[12px] @[700px]:text-xs uppercase tracking-[0.12em] text-fg">
                  {r.title} <span className="text-mid">· {r.company}</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim shrink-0">
                  {r.from} — {r.to}
                  {r.months > 0 && ` · ${r.months} ${UI.experience.months}`} · {r.type}
                </span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-mid mt-2">{r.blurb}</p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {r.skills.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- work ---------------- */

export function WorkMetaCard() {
  const { UI, PROJECTS } = useDict();
  return (
    <div className="h-full flex flex-col justify-between p-4 @[260px]:p-5">
      <ModuleHeader>{UI.workMeta.label}</ModuleHeader>
      <div>
        <span className="font-display text-fg leading-none block text-[clamp(1.5rem,min(22cqw,26cqh),3.75rem)]">
          {String(PROJECTS.length).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim block mt-1">
          {UI.workMeta.line}
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mid leading-relaxed">
        {UI.workMeta.tags}
      </span>
    </div>
  );
}

export function CvCard() {
  const { UI } = useDict();
  return (
    <div className="h-full flex flex-col justify-between p-4 @[260px]:p-5">
      <ModuleHeader right="PDF">{UI.cv.label}</ModuleHeader>
      <div className="flex flex-col gap-2">
        <span className="font-display text-fg leading-[0.88] block tracking-tight text-[clamp(1.25rem,min(20cqw,20cqh),3rem)]">
          {UI.cv.top} <br className="cq-h160" />
          {UI.cv.bottom}
        </span>
        <span className="cq-h160 font-mono text-[10px] uppercase tracking-[0.16em] text-dim leading-relaxed">
          {UI.cv.contents}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <GlowRule />
        <Magnetic strength={0.25}>
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-mid hover:text-fg transition-colors flex items-center gap-2"
          >
            {UI.cv.download} <span aria-hidden>↓</span>
          </a>
        </Magnetic>
      </div>
    </div>
  );
}

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (num: string) => void }) {
  const { UI } = useDict();
  return (
    <button onClick={() => onOpen(project.num)} className="group h-full w-full text-start relative overflow-hidden">
      {project.images[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.images[0]}
          alt={project.title.replace("\n", " ")}
          className="absolute inset-0 w-full h-full object-cover object-top opacity-[0.22] blur-[5px] group-hover:opacity-45 group-hover:blur-[1px] group-hover:scale-[1.03] transition-all duration-700 ease-out"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-card via-card/70 to-card" />
      <span
        aria-hidden
        className="absolute font-display leading-none text-fg pointer-events-none select-none end-[-0.04em] bottom-[-0.14em] transition-opacity duration-700 group-hover:!opacity-[0.09]"
        style={{ fontSize: "clamp(5rem, 22cqw, 16rem)", opacity: 0.05 }}
      >
        {project.num}
      </span>
      <div className="relative h-full flex flex-col justify-between p-4 @[300px]:p-5">
        <ModuleHeader right={project.year}>
          {UI.project.label} — {project.num}
        </ModuleHeader>
        <h3 className="font-display text-fg leading-[0.86] tracking-tight whitespace-pre-line text-[clamp(1.35rem,min(11cqw,22cqh),4rem)]">
          {project.title}
        </h3>
        <div className="flex flex-col gap-2 min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mid truncate">{project.role}</span>
          <div className="hidden @[300px]:flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim group-hover:text-fg transition-colors flex items-center gap-2">
            {UI.expand} <Arrow>↗</Arrow>
          </span>
        </div>
      </div>
    </button>
  );
}

export function ProjectDetail({ num }: { num: string }) {
  const { PROJECTS, UI } = useDict();
  const p = PROJECTS.find((x) => x.num === num)!;
  return (
    <div className="h-full min-h-0 overflow-y-auto @[700px]:overflow-hidden flex flex-col @[700px]:flex-row">
      <div className="relative shrink-0 h-[45cqh] @[700px]:h-auto @[700px]:flex-1 @[700px]:min-h-0 min-w-0 border-b @[700px]:border-b-0 @[700px]:border-e border-hairline">
        <ProjectReel project={p} />
      </div>
      <div className="w-full @[700px]:w-[36%] shrink-0 flex flex-col gap-4 p-5 @[700px]:p-6 @[700px]:min-h-0 @[700px]:overflow-y-auto">
        <ModuleHeader right={p.year}>
          {UI.project.label} — {p.num}
        </ModuleHeader>
        <h2 className="font-display text-fg leading-[0.86] tracking-tight whitespace-pre-line text-4xl @[700px]:text-6xl">
          {p.title}
        </h2>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mid">{p.role}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim">{p.subtitle}</span>
        </div>
        <GlowRule />
        <div className="flex flex-col gap-3">
          {p.detail.map((d, i) => (
            <p key={i} className="font-mono text-[11px] leading-relaxed text-mid">
              {d}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 @[700px]:mt-auto pt-2">
          {p.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
        {p.links && p.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {p.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-mid border border-hairline px-4 py-2.5 hover:border-fg hover:text-fg transition-colors duration-150"
              >
                {l.label} <Arrow>↗</Arrow>
              </a>
            ))}
          </div>
        )}
        {p.url ? (
          <Magnetic strength={0.3}>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-fg border border-fg px-5 py-3 hover:bg-fg hover:text-bg transition-colors duration-150"
            >
              {p.linkLabel ?? UI.project.visit} <Arrow>→</Arrow>
            </a>
          </Magnetic>
        ) : (
          <span className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-dim border border-hairline px-5 py-3 self-start">
            {UI.project.offline}
          </span>
        )}
      </div>
    </div>
  );
}

export function DetailNav({
  num,
  onClose,
  onOpen,
}: {
  num: string;
  onClose: () => void;
  onOpen: (num: string) => void;
}) {
  const { PROJECTS, UI } = useDict();
  return (
    <div className="chrome h-full flex justify-between p-4 @[260px]:p-5 gap-3 min-h-0 min-w-0">
      <button
        onClick={onClose}
        className="font-mono text-[10px] uppercase tracking-[0.24em] text-mid hover:text-fg transition-colors flex items-center gap-2 self-center shrink-0"
      >
        <Arrow>←</Arrow> {UI.close} <span className="cq-h160 text-dim">{UI.esc}</span>
      </button>
      <div className="chrome-list flex-1 min-h-0 min-w-0 flex">
        {PROJECTS.map((p) => {
          const active = p.num === num;
          return (
            <button
              key={p.num}
              onClick={() => onOpen(p.num)}
              className="chrome-item text-start group flex flex-1 min-h-0 min-w-0 items-center gap-2 border-hairline"
            >
              <span className={`font-mono text-[10px] tracking-[0.2em] ${active ? "text-fg" : "text-dim"}`}>
                {p.num}
              </span>
              <span
                className={`cq-h160 font-mono text-[10px] uppercase tracking-[0.12em] truncate transition-colors ${
                  active ? "text-fg" : "text-dim group-hover:text-mid"
                }`}
              >
                {p.title.replace("\n", " ")}
              </span>
              {active && (
                <span
                  className="cq-h160 ms-auto w-4 h-px bg-fg shrink-0"
                  style={{ boxShadow: "0 0 8px 1px rgb(var(--glow) / calc(0.6 * var(--glow-k)))" }}
                />
              )}
            </button>
          );
        })}
      </div>
      <span className="cq-h160 font-mono text-[9px] uppercase tracking-[0.2em] text-dim leading-relaxed">
        ← → {UI.step}
      </span>
    </div>
  );
}

export function ZoomNav({
  label,
  title,
  meta,
  onClose,
}: {
  label: string;
  title: string;
  meta?: string;
  onClose: () => void;
}) {
  const { UI } = useDict();
  return (
    <div className="chrome h-full flex justify-between p-4 @[260px]:p-5 gap-3 min-h-0 min-w-0">
      <button
        onClick={onClose}
        className="font-mono text-[10px] uppercase tracking-[0.24em] text-mid hover:text-fg transition-colors flex items-center gap-2 self-center shrink-0"
      >
        <Arrow>←</Arrow> {UI.close} <span className="cq-h160 text-dim">{UI.esc}</span>
      </button>
      <div className="min-w-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-dim block truncate">{label}</span>
        <div className="cq-h160">
          <span className="font-display text-fg leading-[0.9] block tracking-tight mt-1 text-[clamp(1.25rem,min(18cqw,20cqh),3rem)]">
            {title}
          </span>
        </div>
      </div>
      <span className="cq-h160 font-mono text-[10px] uppercase tracking-[0.2em] text-dim leading-relaxed">
        {meta}
      </span>
    </div>
  );
}

/** Shown in place of a card's content when a swap squeezed it too small. */
export function CollapsedCard({ title, onOpen }: { title: string; onOpen: () => void }) {
  const { UI } = useDict();
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group h-full w-full text-start flex flex-col justify-between p-3 @[220px]:p-4 min-h-0 min-w-0 overflow-hidden"
    >
      <span className="font-display text-fg leading-[0.9] tracking-tight whitespace-pre-line text-[clamp(0.95rem,min(15cqw,30cqh),3.5rem)]">
        {title}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim group-hover:text-fg transition-colors self-end">
        <span className="cq-h100">{UI.expand} </span>
        <Arrow>↗</Arrow>
      </span>
    </button>
  );
}

/* ---------------- stack ---------------- */

export function TechCountCard() {
  const { STACK, TECH_COUNT, UI } = useDict();
  return (
    <div className="h-full flex flex-col justify-between p-4 @[260px]:p-5">
      <ModuleHeader>{UI.toolbox.label}</ModuleHeader>
      <div>
        <span className="font-display text-fg leading-none block text-[clamp(1.5rem,min(22cqw,26cqh),3.75rem)]">
          <Counter to={TECH_COUNT} delay={450} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim block mt-1">
          {UI.toolbox.technologies}
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mid leading-relaxed">
        {UI.toolbox.categories(STACK.length)}
      </span>
    </div>
  );
}

export function StackCatCard({ cat }: { cat: StackCat }) {
  return (
    <div className="h-full flex flex-col p-4 @[240px]:p-5 gap-3 min-h-0">
      <ModuleHeader right={String(cat.skills.length).padStart(2, "0")}>{cat.label}</ModuleHeader>
      <ul className="flex-1 min-h-0 flex flex-col">
        {cat.skills.map((s, i) => (
          <li
            key={s}
            className="flex-1 min-h-0 flex items-center justify-between gap-2 border-b border-hairline last:border-0 group"
          >
            <span
              dir="ltr"
              className="font-mono text-[11px] @[240px]:text-[12px] uppercase tracking-[0.12em] text-mid group-hover:text-fg transition-colors truncate"
            >
              {s}
            </span>
            <span className="font-mono text-[9px] tracking-[0.16em] text-dim shrink-0 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EducationCard({ onOpen }: { onOpen?: () => void }) {
  const { EDUCATION, CERTIFICATIONS, UI } = useDict();
  const issuers = [...new Set(CERTIFICATIONS.map((c) => c.issuer))].join(" · ");
  const Tag_ = onOpen ? "button" : "div";
  return (
    <Tag_
      {...(onOpen ? { onClick: onOpen, type: "button" as const } : {})}
      className="group h-full w-full text-start flex flex-col p-4 @[260px]:p-5 gap-3 min-h-0"
    >
      <ModuleHeader>{UI.education.label}</ModuleHeader>
      <div className="flex-1 min-h-0 flex flex-col [justify-content:safe_center] gap-4 overflow-hidden">
        {EDUCATION.map((e) => (
          <div key={e.short} className="border-b border-hairline pb-3">
            <span className="font-display text-fg leading-none block tracking-tight text-[clamp(1rem,min(15cqw,11cqh),1.875rem)]">
              {e.short}
            </span>
            <div className="cq-h160">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-mid block mt-1.5 leading-relaxed">
                {e.award}
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim block mt-1">{e.years}</span>
          </div>
        ))}
        <div>
          <span className="font-display text-fg leading-none block tracking-tight text-[clamp(1rem,min(15cqw,11cqh),1.875rem)]">
            {UI.certs.count(CERTIFICATIONS.length)}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim block mt-1">{issuers}</span>
        </div>
      </div>
      {onOpen && (
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim group-hover:text-fg transition-colors flex items-center gap-2 shrink-0 self-end">
          {UI.expand} <Arrow>↗</Arrow>
        </span>
      )}
    </Tag_>
  );
}

export function EducationDetailCard() {
  const { EDUCATION, CERTIFICATIONS, UI } = useDict();
  return (
    <div className="h-full flex flex-col p-5 @[700px]:p-6 gap-4 min-h-0 overflow-y-auto">
      <ModuleHeader right={UI.certs.count(CERTIFICATIONS.length)}>{UI.education.label}</ModuleHeader>
      <div className="grid grid-cols-1 @[700px]:grid-cols-2 gap-x-6 gap-y-3 shrink-0">
        {EDUCATION.map((e) => (
          <div key={e.short}>
            <span className="font-display text-fg leading-[0.9] block tracking-tight text-[clamp(1.5rem,5cqw,2.75rem)]">
              {e.short}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-mid block mt-2 leading-relaxed">
              {e.award}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim block mt-1">{e.years}</span>
          </div>
        ))}
      </div>
      <GlowRule />
      <ModuleHeader right={String(CERTIFICATIONS.length).padStart(2, "0")}>{UI.certs.label}</ModuleHeader>
      <ul className="flex-1 min-h-0 flex flex-col">
        {CERTIFICATIONS.map((c, i) => {
          const body = (
            <>
              <span className="font-mono text-[10px] tracking-[0.16em] text-dim shrink-0 tabular-nums w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-mono text-[12px] @[700px]:text-[13px] uppercase tracking-[0.12em] text-fg block @[700px]:truncate leading-snug">
                  {c.title}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mid block mt-0.5">
                  {c.note}
                  <span className="@[700px]:hidden text-dim">
                    {c.note ? " · " : ""}
                    {c.issuer} · {c.date}
                  </span>
                </span>
              </span>
              <span className="hidden @[700px]:inline font-mono text-[10px] uppercase tracking-[0.18em] text-dim shrink-0 text-end whitespace-nowrap">
                {c.issuer} · {c.date}
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] shrink-0 text-end whitespace-nowrap transition-colors @[700px]:min-w-[5.5rem] ${
                  c.url ? "text-dim group-hover:text-fg" : "invisible"
                }`}
              >
                <span className="hidden @[700px]:inline">{UI.certs.verify} </span>
                <Arrow>↗</Arrow>
              </span>
            </>
          );
          const cls = "group flex-1 min-h-[2.75rem] flex items-center gap-3 border-b border-hairline last:border-0 py-2";
          return (
            <li key={c.title} className="flex">
              {c.url ? (
                <a href={c.url} target="_blank" rel="noopener noreferrer" className={`${cls} w-full`}>
                  {body}
                </a>
              ) : (
                <div className={`${cls} w-full`}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------- contact ---------------- */

export function HeadlineCard() {
  const { IDENTITY, UI } = useDict();
  return (
    <div className="h-full flex flex-col justify-between p-4 @[300px]:p-6 overflow-hidden">
      <ModuleHeader>{UI.contact.label}</ModuleHeader>
      <h2 className="font-display text-fg leading-[0.82] tracking-tight text-[clamp(2rem,min(20cqw,26cqh),8rem)]">
        {UI.contact.headline[0]}
        <br />
        <span style={{ WebkitTextStroke: "2px var(--color-fg)", color: "transparent" }}>
          {UI.contact.headline[1]}
        </span>
      </h2>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim leading-relaxed">
        {IDENTITY.availability.long}
      </span>
    </div>
  );
}

export function EmailCard() {
  const { UI } = useDict();
  return (
    <div className="h-full flex flex-col justify-between p-4 @[400px]:p-5 gap-2 min-w-0">
      <ModuleHeader right={<span dir="ltr">{PHONE}</span>}>{UI.contact.direct}</ModuleHeader>
      <a
        href={`mailto:${EMAIL}`}
        className="font-mono text-[12px] @[400px]:text-sm uppercase tracking-[0.14em] text-fg hover:text-mid transition-colors flex items-center gap-3 min-w-0"
      >
        <span
          className="inline-block w-4 h-px bg-fg shrink-0"
          style={{ boxShadow: "0 0 8px 1px rgb(var(--glow) / calc(0.5 * var(--glow-k)))" }}
        />
        <span dir="ltr" className="min-w-0 truncate">
          <Scramble text={EMAIL.toUpperCase()} speed={5} />
        </span>
      </a>
      <GlowRule />
    </div>
  );
}

const FIELD =
  "bg-transparent border-0 border-b border-hairline text-fg font-mono text-[11px] uppercase tracking-[0.12em] py-2.5 outline-none w-full placeholder:text-dim focus:border-fg transition-colors duration-200";

// Set these in .env.local to deliver the form through EmailJS.
// Without them the form opens the visitor's mail app instead.
const EMAILJS = {
  service: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  template: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  key: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

export function FormCard() {
  const { UI } = useDict();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      if (EMAILJS.service && EMAILJS.template && EMAILJS.key) {
        const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: EMAILJS.service,
            template_id: EMAILJS.template,
            user_id: EMAILJS.key,
            template_params: { name, email, message, title: "Portfolio Contact" },
          }),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        const subject = encodeURIComponent(`Portfolio — ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
        window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      }
      setState("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setState("error");
    }
  };

  const busy = state === "sending";
  return (
    <div className="h-full flex flex-col p-4 @[400px]:p-6 gap-4 min-h-0">
      <ModuleHeader right={state === "sent" ? UI.contact.sentTag : UI.contact.formTag}>{UI.contact.form}</ModuleHeader>
      {state === "sent" ? (
        <div className="flex-1 flex flex-col justify-center gap-2">
          <span className="font-display text-fg leading-none tracking-tight text-[clamp(1.5rem,min(12cqw,18cqh),3rem)]">
            {UI.contact.received}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mid">{UI.contact.reply}</span>
        </div>
      ) : (
        <form onSubmit={submit} className="flex-1 min-h-0 flex flex-col gap-4 @[400px]:gap-5">
          <div className="grid grid-cols-1 @[320px]:grid-cols-2 gap-4 @[400px]:gap-5 shrink-0">
            <input
              placeholder={UI.contact.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={busy}
              className={FIELD}
            />
            <input
              type="email"
              dir={email ? "ltr" : undefined}
              placeholder={UI.contact.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
              className={FIELD}
            />
          </div>
          <textarea
            placeholder={UI.contact.message}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={busy}
            className={`${FIELD} resize-none flex-1 min-h-0`}
          />
          {state === "error" && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim shrink-0">
              {UI.contact.error}
            </span>
          )}
          <Magnetic strength={0.25} className="self-start shrink-0">
            <button
              type="submit"
              disabled={busy}
              className="font-mono text-[11px] uppercase tracking-[0.24em] border border-fg text-fg px-6 py-3 hover:bg-fg hover:text-bg transition-colors duration-150 disabled:opacity-40"
            >
              {busy ? (
                UI.contact.sending
              ) : (
                <>
                  {UI.contact.send} <Arrow>→</Arrow>
                </>
              )}
            </button>
          </Magnetic>
        </form>
      )}
    </div>
  );
}

export function SocialsCard() {
  const { UI } = useDict();
  const links = [
    { label: UI.contact.github, href: GITHUB_URL },
    { label: UI.contact.linkedin, href: LINKEDIN_URL },
    { label: `${UI.contact.cv} ↓`, href: CV_URL },
  ];
  return (
    <div className="h-full flex items-center justify-between @[220px]:justify-start gap-2 @[220px]:gap-5 px-3 @[300px]:px-5">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[9px] @[220px]:text-[10px] uppercase tracking-[0.14em] @[220px]:tracking-[0.24em] text-mid hover:text-fg transition-colors whitespace-nowrap"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}

export function FooterCard() {
  const { UI } = useDict();
  return (
    <div className="h-full flex items-center justify-between px-3 @[220px]:px-5 gap-3">
      <span dir="ltr" className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim whitespace-nowrap">
        {UI.contact.footer}
      </span>
      <span
        dir="ltr"
        className="hidden @[220px]:inline font-mono text-[9px] uppercase tracking-[0.2em] text-dim whitespace-nowrap"
      >
        {UI.contact.colophon}
      </span>
    </div>
  );
}
