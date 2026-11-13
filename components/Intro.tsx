"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cssVar } from "@/lib/theme";

function seeded(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (v: number) => Math.round(v * 10) / 10;
const rng = seeded(23);
const BARS = [3, 4, 5, 6, 8, 10]; // 36 dots
const dots = Array.from({ length: 36 }, (_, i) => ({
  sx: r1(40 + rng() * 520), sy: r1(30 + rng() * 200), sr: r1(3 + rng() * 5),
  gx: 140 + (i % 9) * 40, gy: 70 + Math.floor(i / 9) * 40,
  tx: r1(70 + i * 10.5), ty: r1(212 - i * 3.5 + (rng() - 0.5) * 44),
  bx: 0, by: 0,
}));
{
  let c = 0, r = 0;
  dots.forEach((d) => { d.bx = 175 + c * 50; d.by = 226 - r * 17; if (++r >= BARS[c]) { r = 0; c++; } });
}

const STEPS = [
  ["Collect", "Everything starts as raw, messy data."],
  ["Clean", "Fix it, fill it, line it up."],
  ["Explore", "Look for the pattern hiding inside."],
  ["Model", "Teach a model to predict what comes next."],
  ["Decide", "Turn the answer into a decision."],
];

/** First-visit curtain: data science in five beats, then it lifts to reveal the site. */
export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const finish = () => {
      html.classList.add("intro-done");
      window.dispatchEvent(new Event("intro:done"));
      try { sessionStorage.setItem("intro", "1"); } catch {}
      setGone(true);
    };
    if (html.classList.contains("no-intro")) { finish(); return; }

    const el = root.current!;
    const q = gsap.utils.selector(el);
    const ds = q(".in-dot");
    const cSlate = cssVar("--slate"), cViolet = cssVar("--accent2"), cAccent = cssVar("--accent");
    const steps = q(".in-step") as unknown as HTMLElement[];
    const caption = q(".in-caption")[0];
    const show = (i: number) => {
      steps.forEach((s, k) => s.classList.toggle("on", k <= i));
      caption.textContent = STEPS[i][1];
      gsap.fromTo(caption, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 });
    };

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: finish });
    tl.call(show, [0])
      .from(ds, { attr: { cy: -20 }, opacity: 0, duration: 0.55, ease: "bounce.out", stagger: { each: 0.012, from: "random" } })
      .call(show, [1], 0.95)
      .to(ds, { attr: { cx: (i: number) => dots[i].gx, cy: (i: number) => dots[i].gy, r: 6 }, fill: cSlate, duration: 0.5, stagger: 0.006 }, 0.95)
      .call(show, [2], 1.8)
      .to(ds, { attr: { cx: (i: number) => dots[i].tx, cy: (i: number) => dots[i].ty, r: 4.5 }, fill: cViolet, duration: 0.5, stagger: 0.006 }, 1.8)
      .to(q(".in-trend"), { strokeDashoffset: 0, duration: 0.4 }, 2.2)
      .call(show, [3], 2.7)
      .to(q(".in-band"), { opacity: 0.18, duration: 0.3 }, 2.7)
      .to(q(".in-forecast"), { opacity: 1, duration: 0.3 }, 2.7)
      .to(q(".in-pred"), { scale: 1, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(3)" }, 2.9)
      .call(show, [4], 3.6)
      .to(q(".in-trend, .in-band, .in-forecast, .in-pred"), { opacity: 0, duration: 0.2 }, 3.6)
      .to(ds, { attr: { cx: (i: number) => dots[i].bx, cy: (i: number) => dots[i].by, r: 7 }, fill: cAccent, duration: 0.5, stagger: 0.006 }, 3.6)
      .to(q(".in-check"), { opacity: 1, scale: 1, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(3)" }, 4.15)
      .addLabel("exit", 4.75)
      .to(q(".in-body"), { opacity: 0, y: -30, duration: 0.3, ease: "power2.in" }, "exit")
      .to(el, { yPercent: -125, duration: 0.85, ease: "power4.inOut" }, "exit+=0.15");

    const skip = () => { if (tl.time() < tl.labels.exit) tl.seek("exit"); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip(); };
    el.addEventListener("click", skip);
    window.addEventListener("keydown", onKey);
    return () => { tl.kill(); el.removeEventListener("click", skip); window.removeEventListener("keydown", onKey); };
  }, []);

  if (gone) return null;

  return (
    <div className="intro" ref={root} role="presentation">
      <div className="in-body">
        <p className="mono in-title">DATA SCIENCE, IN FIVE SECONDS</p>
        <svg viewBox="0 0 600 260" aria-hidden="true">
          <path className="in-band" d="M448 62 L560 6 L560 76 Z" fill="var(--accent)" opacity="0" />
          <path className="in-trend" pathLength={1} d="M66 214 L448 86" stroke="var(--silver)" strokeWidth="2" strokeDasharray="1" strokeDashoffset="1" fill="none" />
          <path className="in-forecast" d="M448 86 L560 48" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="6 6" fill="none" opacity="0" />
          <circle className="in-pred" cx="560" cy="48" r="8" fill="var(--accent)" style={{ transform: "scale(0)" }} />
          {dots.map((d, i) => (
            <circle key={i} className="in-dot" cx={d.sx} cy={d.sy} r={d.sr} fill={["var(--slate)", "var(--silver)", "var(--accent2)", "var(--accent)"][i % 4]} />
          ))}
          <g className="in-check" opacity="0" style={{ transform: "scale(0.6)" }}>
            <circle cx="500" cy="60" r="24" fill="var(--accent)" />
            <path d="M489 60 L497 68 L512 52" stroke="var(--on-accent)" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
        <ol className="in-steps">
          {STEPS.map(([name], i) => (
            <li key={name} className="in-step"><span className="mono">0{i + 1}</span>{name}</li>
          ))}
        </ol>
        <p className="in-caption">{STEPS[0][1]}</p>
      </div>
      <button className="in-skip mono" type="button">Skip ↵</button>
      <svg className="in-edge" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 H1440 V40 C1200 130 960 -10 720 60 S240 130 0 50 Z" />
      </svg>
    </div>
  );
}
