"use client";

import type { Project } from "@/lib/content";
import { useDict } from "@/lib/i18n";

const marquee = {
  animationName: "marquee-y",
  animationDuration: "var(--reel-speed)",
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
} as const;

/**
 * Endless vertical scroll of the project's screenshots. Drop images into
 * /public/images/work and list them in `images` in content.ts. Until then a
 * typographic reel stands in so the panel is never empty.
 */
export default function ProjectReel({ project }: { project: Project }) {
  const { UI } = useDict();
  const alt = project.title.replace("\n", " ");
  const imgs = project.images;
  const count = imgs.length || project.detail.length;

  return (
    <div className="group/reel relative h-full w-full overflow-hidden bg-bg [--reel-speed:48s] @[900px]:[--reel-speed:40s]">
      <div className="flex flex-col w-full motion-reduce:animate-none" style={marquee}>
        {imgs.length > 0
          ? [...imgs, ...imgs].map((src, i) => (
              <div key={`${src}-${i}`} className="w-full shrink-0 border-b border-hairline">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={i < imgs.length ? `${alt} — view ${i + 1}` : ""}
                  aria-hidden={i >= imgs.length}
                  className="block w-full h-auto"
                />
              </div>
            ))
          : [0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex flex-col w-full">
                {project.detail.map((line, i) => (
                  <div
                    key={i}
                    className="relative w-full shrink-0 aspect-[16/10] border-b border-hairline grid-bg overflow-hidden flex flex-col justify-between p-6 @[700px]:p-10"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
                      {project.num} / {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-display leading-[0.85] tracking-tight whitespace-pre-line text-transparent text-[clamp(2.5rem,10cqw,7rem)]"
                      style={{ WebkitTextStroke: "1px var(--color-mid)" }}
                    >
                      {project.title}
                    </span>
                    <div className="flex flex-col gap-3 max-w-[38rem]">
                      <p className="font-mono text-[11px] @[700px]:text-xs leading-relaxed text-mid bg-bg/70">{line}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.map((s) => (
                          <span
                            key={s}
                            className="font-mono text-[10px] uppercase tracking-[0.16em] border border-hairline text-dim px-2 py-1 bg-bg/70"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-card to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card to-transparent" />
      <span className="pointer-events-none absolute bottom-3 end-4 font-mono text-[9px] uppercase tracking-[0.22em] text-dim">
        {String(count).padStart(2, "0")} {UI.project.views}
      </span>
    </div>
  );
}
