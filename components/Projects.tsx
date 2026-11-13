"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Tag } from "@/lib/data";
import ProjectViz from "./ProjectViz";

const FILTERS: ("All" | Tag)[] = ["All", "ML", "BI", "AI", "Web"];

export default function Projects() {
  const [filter, setFilter] = useState<"All" | Tag>("All");
  const grid = useRef<HTMLDivElement>(null);

  const pick = (f: "All" | Tag) => {
    if (f === filter) return;
    setFilter(f);
    requestAnimationFrame(() => {
      const shown = grid.current!.querySelectorAll(".card:not(.hide)");
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        gsap.fromTo(shown, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out", overwrite: true });
      ScrollTrigger.refresh();
    });
  };

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects by type" data-reveal>
        {FILTERS.map((f) => (
          <button key={f} className={f === filter ? "on" : ""} aria-pressed={f === filter} onClick={() => pick(f)}>
            {f}
            <span>{f === "All" ? projects.length : projects.filter((p) => p.tags.includes(f)).length}</span>
          </button>
        ))}
      </div>

      <div className="cards" ref={grid}>
        {projects.map((p, i) => {
          const hidden = filter !== "All" && !p.tags.includes(filter);
          return (
            <article key={p.id} className={`card${p.wide ? " wide" : ""}${hidden ? " hide" : ""}`} data-reveal>
              <div className="card-viz">
                <ProjectViz kind={p.viz} />
              </div>
              <div className="card-body">
                <p className="mono kicker">
                  <span>{String(i + 1).padStart(2, "0")}</span> {p.kicker}
                </p>
                <h3>{p.title}</h3>
                <p className="stat">
                  <b>{p.stat.value}</b> {p.stat.label}
                </p>
                <dl className="par">
                  <dt>Problem</dt><dd>{p.problem}</dd>
                  <dt>Approach</dt><dd>{p.approach}</dd>
                  <dt>Result</dt><dd>{p.result}</dd>
                </dl>
                <ul className="tags">
                  {p.stack.map((s) => <li key={s}>{s}</li>)}
                </ul>
                <div className="card-links">
                  {p.live && <a href={p.live} target="_blank" rel="noreferrer">Live demo ↗</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                  {!p.live && !p.github && <span>Private build · ask me for a walkthrough</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
