"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cssVar } from "@/lib/theme";
import { useTheme } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger);

// Seeded RNG so server and client render the same "messy" data.
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (v: number) => Math.round(v * 10) / 10;

const rng = mulberry32(7);
const N = 72;
const MESSY_FILL = ["var(--slate)", "var(--accent)", "var(--accent2)", "var(--silver)"];
const BAR_HEIGHTS = [6, 8, 9, 11, 12, 14]; // 60 valid rows
const BAR_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

let valid = 0;
const dots = Array.from({ length: N }, (_, i) => {
  const isNull = (i + Math.floor(i / 12)) % 6 === 5;
  const d = {
    isNull,
    j: isNull ? -1 : valid++,
    mx: r1(60 + rng() * 880), my: r1(40 + rng() * 340), mr: r1(3 + rng() * 7),
    fill: MESSY_FILL[Math.floor(rng() * 4)], op: r1(0.35 + rng() * 0.55),
    gx: 225 + (i % 12) * 50, gy: 85 + Math.floor(i / 12) * 50,
    sx: 0, sy: 0, bx: 0, by: 0,
  };
  return d;
});
// scatter + bar targets for valid rows
{
  let col = 0, row = 0;
  dots.filter((d) => !d.isNull).forEach((d) => {
    const t = d.j / 59;
    d.sx = r1(120 + t * 760);
    d.sy = r1(340 - t * 240 + (rng() - 0.5) * 90);
    d.bx = 250 + col * 100;
    d.by = 368 - row * 21;
    if (++row >= BAR_HEIGHTS[col]) { row = 0; col++; }
  });
}

const STEPS = [
  { n: "01", t: "Wrangle", d: "Messy rows in. Nulls, dupes and odd formats out." },
  { n: "02", t: "Explore", d: "EDA until the “aha” pattern shows itself." },
  { n: "03", t: "Visualise", d: "Shape it into a dashboard people can read." },
  { n: "04", t: "Decide", d: "Hand over a number someone can act on." },
];

/** Scroll-scrubbed: 72 messy records become a clean table, a correlation, then a bar chart. */
export default function Pipeline() {
  const root = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      const els = q(".pdot") as unknown as SVGCircleElement[];
      const steps = q(".pstep") as unknown as HTMLElement[];
      const setStep = (i: number) => steps.forEach((s, k) => s.classList.toggle("on", k === i));

      const cSlate = cssVar("--slate"), cViolet = cssVar("--accent2"), cAccent = cssVar("--accent");
      const build = () => {
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        dots.forEach((d, i) => {
          tl.to(els[i], { attr: { cx: d.gx, cy: d.gy, r: 7 }, fill: cSlate, fillOpacity: 0.9, duration: 1 }, i * 0.004);
          if (d.isNull) tl.to(els[i], { opacity: 0, attr: { r: 0 }, duration: 0.35 }, 0.95);
          else {
            tl.to(els[i], { attr: { cx: d.sx, cy: d.sy, r: 5 }, fill: cViolet, duration: 1 }, 1.5 + d.j * 0.004);
            tl.to(els[i], { attr: { cx: d.bx, cy: d.by, r: 8 }, fill: cAccent, duration: 1 }, 3 + d.j * 0.004);
          }
        });
        tl.to(q(".p-null"), { opacity: 0, duration: 0.3 }, 0.6)
          .fromTo(q(".p-trend"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6 }, 2.2)
          .fromTo(q(".p-r"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.5)
          .to(q(".p-trend, .p-r"), { opacity: 0, duration: 0.3 }, 3)
          .fromTo(q(".p-axis"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 3.7)
          .fromTo(q(".p-kpi"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 4)
          .to({}, { duration: 0.5 });
        return tl;
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = build();
        ScrollTrigger.create({
          animation: tl,
          trigger: root.current,
          start: "center center",
          end: "+=1900",
          pin: true,
          anticipatePin: 1,
          refreshPriority: 2, // measured before the Skills pin below it, so spacing stacks correctly
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            setStep(p < 0.3 ? 0 : p < 0.62 ? 1 : p < 0.84 ? 2 : 3);
          },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        build().progress(1);
        setStep(3);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [theme], revertOnUpdate: true },
  );

  return (
    <div className="pipe" ref={root}>
      <ol className="psteps">
        {STEPS.map((s, i) => (
          <li key={s.n} className={`pstep${i === 0 ? " on" : ""}`}>
            <span className="mono">{s.n}</span>
            <strong>{s.t}</strong>
            <p>{s.d}</p>
          </li>
        ))}
      </ol>
      <div className="pstage">
        <svg viewBox="0 0 1000 420" role="img" aria-label="Animation: scattered raw data points are cleaned into a grid, arranged into a correlation plot, then stacked into a bar chart">
          <g className="p-axis" opacity="0">
            <line x1="200" y1="382" x2="800" y2="382" stroke="var(--line-strong)" />
            {BAR_LABELS.map((l, k) => (
              <text key={l} x={250 + k * 100} y="404" textAnchor="middle" className="svg-mono">{l}</text>
            ))}
          </g>
          <path className="p-trend" pathLength={1} d="M110 345 L890 95" stroke="var(--silver)" strokeWidth="2" strokeDasharray="1" strokeDashoffset="1" fill="none" />
          <text className="p-r svg-mono" x="880" y="80" textAnchor="end" opacity="0">trend found</text>
          <text className="p-null svg-mono" x="60" y="30">raw.csv · 72 rows · 12 nulls</text>
          {dots.map((d, i) => (
            <circle
              key={i}
              className="pdot"
              cx={d.mx} cy={d.my} r={d.mr}
              fill={d.isNull ? "var(--card)" : d.fill}
              fillOpacity={d.isNull ? 1 : d.op}
              stroke={d.isNull ? "var(--slate)" : "var(--card)"}
              strokeWidth={d.isNull ? 1.5 : 2}
              strokeDasharray={d.isNull ? "3 3" : undefined}
            />
          ))}
          <g className="p-kpi" opacity="0">
            <text x="205" y="76" className="svg-kpi">+133%</text>
            <text x="205" y="102" className="svg-mono">Jan → Jun growth</text>
          </g>
        </svg>
        <p className="pcaption mono">Illustrative data · scroll to run the pipeline</p>
      </div>
    </div>
  );
}
