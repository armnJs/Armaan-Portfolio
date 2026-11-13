"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { skillGroups } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const SHORT: Record<string, string> = {
  "SQL (T-SQL, PostgreSQL)": "SQL", "HTML5 / CSS3": "HTML / CSS", "Advanced Excel": "Excel", "Data wrangling": "Wrangling",
  "Feature engineering": "Feature eng.", "Classification models": "Classification", "Data storytelling": "Storytelling",
  "Gemini AI SDK": "Gemini SDK", "Google Apps Script": "Apps Script", "AI coding agents": "AI agents",
  "Live shoutcasting": "Shoutcasting", "Event management": "Event mgmt", "Stakeholder coordination": "Stakeholders",
  "Team leadership": "Team lead", "n8n (learning)": "n8n",
};
const COLORS = ["var(--accent)", "var(--accent2)", "var(--silver)"];
const W = 1000, H = 640, CX = 500, CY = 320, HUB_R = 185;
const r1 = (v: number) => Math.round(v * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;

const hubs = skillGroups.map((g, i) => {
  const a = i * 60 - 120;
  const x = r1(CX + Math.cos(rad(a)) * HUB_R), y = r1(CY + Math.sin(rad(a)) * HUB_R);
  const n = g.items.length;
  const step = Math.min(24, 124 / (n - 1));
  const leaves = g.items.map((item, k) => {
    const la = a + (k - (n - 1) / 2) * step;
    const lr = 104 + (k % 2) * 46;
    const c = Math.cos(rad(la)), s = Math.sin(rad(la));
    return {
      label: SHORT[item] ?? item,
      x: r1(x + c * lr), y: r1(y + s * lr),
      tx: r1(x + c * (lr + 13)), ty: r1(y + s * (lr + 13) + 5),
      anchor: (c > 0.3 ? "start" : c < -0.3 ? "end" : "middle") as "start" | "end" | "middle",
    };
  });
  const fx = x + Math.cos(rad(a)) * 60, fy = y + Math.sin(rad(a)) * 60;
  return { name: g.name, items: g.items, x, y, color: COLORS[i % 3], leaves, focus: `${r1(fx - 290)} ${r1(fy - 185.6)} 580 371.2` };
});

// threads between related skills in different webs
const find = (label: string) => {
  for (const h of hubs) for (const l of h.leaves) if (l.label === label) return l;
  throw new Error(label);
};
const cross = [
  ["Pandas", "Wrangling"], ["Scikit-learn", "Classification"], ["SQL", "SSMS"], ["Seaborn", "EDA"],
  ["Power BI", "Storytelling"], ["Gemini SDK", "AI agents"], ["Public speaking", "Storytelling"], ["Playwright", "Apps Script"],
].map(([a, b]) => {
  const p = find(a), q = find(b);
  const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
  return `M${p.x} ${p.y} Q${r1(mx + (CX - mx) * 0.45)} ${r1(my + (CY - my) * 0.45)} ${q.x} ${q.y}`;
});
const total = hubs.reduce((s, h) => s + h.leaves.length, 0);

/** Scroll-scrubbed mind map: the camera flies to each skill web in turn, then pulls back to show how they connect. */
export default function Mindmap() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      const cats = q(".mm-cat") as unknown as HTMLElement[];
      const setActive = (i: number) => {
        cats.forEach((c, k) => c.classList.toggle("on", i === 99 || k === i));
        root.current!.dataset.stage = i === 99 ? "all" : i < 0 ? "intro" : "focus";
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const svg = q("svg")[0];
        gsap.set(q(".mm-hub, .mm-leaf, .mm-core"), { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(q(".mm-hublabel, .mm-label"), { opacity: 0 });
        gsap.set(q(".mm-link, .mm-spoke, .mm-cross"), { strokeDashoffset: 1 });
        setActive(-1);

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.to(q(".mm-core"), { scale: 1, duration: 0.4, ease: "back.out(2)" })
          .to(q(".mm-spoke"), { strokeDashoffset: 0, duration: 0.5, stagger: 0.05 }, 0.2)
          .to(q(".mm-hub"), { scale: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.05 }, 0.4)
          .to(q(".mm-hublabel"), { opacity: 1, duration: 0.3, stagger: 0.05 }, 0.5);

        const marks: number[] = [];
        hubs.forEach((h, i) => {
          const at = 1.2 + i * 2;
          marks.push(at + 0.3);
          tl.to(svg, { attr: { viewBox: h.focus }, duration: 0.9, ease: "power2.inOut" }, at)
            .to(q(`.mm-link.g${i}`), { strokeDashoffset: 0, duration: 0.5, stagger: 0.06 }, at + 0.5)
            .to(q(`.mm-leaf.g${i}`), { scale: 1, duration: 0.35, ease: "back.out(2.4)", stagger: 0.06 }, at + 0.7)
            .to(q(`.mm-label.g${i}`), { opacity: 1, duration: 0.3, stagger: 0.06 }, at + 0.8);
          // names belong to the web in focus only, so neighbouring webs never crowd each other
          if (i > 0) tl.to(q(`.mm-label.g${i - 1}`), { opacity: 0, duration: 0.3 }, at);
        });
        const end = 1.2 + hubs.length * 2;
        tl.to(svg, { attr: { viewBox: `0 0 ${W} ${H}` }, duration: 1, ease: "power2.inOut" }, end)
          .to(q(".mm-label"), { opacity: 0, duration: 0.4 }, end)
          .to(q(".mm-cross"), { strokeDashoffset: 0, duration: 0.8, stagger: 0.08 }, end + 0.6)
          .to({}, { duration: 0.6 });

        // follow the playhead (not the scrollbar) so the side panel stays in step with the smoothed scrub
        tl.eventCallback("onUpdate", () => {
          const t = tl.time();
          if (t >= end + 0.3) return setActive(99);
          let idx = -1;
          marks.forEach((m, k) => { if (t >= m) idx = k; });
          setActive(idx);
        });

        ScrollTrigger.create({ animation: tl, trigger: root.current, start: "center center", end: "+=1800", pin: true, scrub: 0.7 });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => setActive(99));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div className="mm" ref={root} data-stage="all">
      <div className="mm-side">
        <p className="mono mm-count">{hubs.length} webs · {total} skills · scroll to explore</p>
        <ol>
          {hubs.map((h, i) => (
            <li key={h.name} className="mm-cat on">
              <strong><i style={{ background: h.color }} />{h.name}</strong>
              <ul className="mm-items">{h.items.map((s) => <li key={s}>{s}</li>)}</ul>
            </li>
          ))}
        </ol>
      </div>
      <div className="mm-stage">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Mind map of Armaan's skills: ${hubs.map((h) => `${h.name} (${h.items.join(", ")})`).join("; ")}`}>
          {cross.map((d, i) => <path key={i} className="mm-cross" pathLength={1} d={d} />)}
          {hubs.map((h, i) => (
            <g key={h.name}>
              <path className="mm-spoke" pathLength={1} d={`M${CX} ${CY} L${h.x} ${h.y}`} stroke={h.color} />
              {h.leaves.map((l) => <path key={l.label} className={`mm-link g${i}`} pathLength={1} d={`M${h.x} ${h.y} L${l.x} ${l.y}`} stroke={h.color} />)}
              {h.leaves.map((l) => <circle key={l.label} className={`mm-leaf g${i}`} cx={l.x} cy={l.y} r="6" fill={h.color} />)}
              {h.leaves.map((l) => <text key={l.label} className={`mm-label g${i}`} x={l.tx} y={l.ty} textAnchor={l.anchor}>{l.label}</text>)}
              <circle className="mm-hub" cx={h.x} cy={h.y} r="17" fill="var(--card)" stroke={h.color} strokeWidth="3" />
              <text className="mm-hublabel" x={h.x} y={h.y + (h.y < CY ? -27 : 39)} textAnchor="middle">{h.name}</text>
            </g>
          ))}
          <g className="mm-core">
            <circle cx={CX} cy={CY} r="46" fill="var(--card)" stroke="var(--silver)" strokeWidth="2" />
            <text x={CX} y={CY + 6} textAnchor="middle" className="mm-coretext">Armaan</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
