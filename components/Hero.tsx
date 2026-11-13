"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ClusterField from "./ClusterField";
import Waves from "./Waves";
import { heroMetrics, links, thriveWords } from "@/lib/data";

const TICKS = 41;
const START = 150; // degrees, gauge sweeps 240°
const SWEEP = 240;
const polar = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [150 + Math.cos(a) * r, 150 + Math.sin(a) * r].map((v) => +v.toFixed(2));
};
const arc = (from: number, to: number, r: number) => {
  const [x1, y1] = polar(from, r);
  const [x2, y2] = polar(to, r);
  return `M${x1} ${y1} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const typed = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        intro
          .from(".hero-line", { yPercent: 110, duration: 0.9, stagger: 0.1 })
          .from(".hero-fade", { opacity: 0, y: 18, duration: 0.7, stagger: 0.08 }, "-=0.5")
          .from(".gauge-tick", { opacity: 0, duration: 0.02, stagger: 0.018 }, 0.3)
          .from(".gauge-arc", { strokeDashoffset: 1, duration: 1.6, ease: "power2.inOut" }, 0.5)
          .from(".gauge-photo", { scale: 0.8, opacity: 0, duration: 0.9 }, 0.5);

        // hold the entrance until the page-load curtain has lifted
        const html = document.documentElement;
        const go = () => intro.play();
        if (html.classList.contains("intro-done") || html.classList.contains("no-intro")) go();
        else window.addEventListener("intro:done", go, { once: true });

        // typewriter
        const el = typed.current!;
        const tl = gsap.timeline({ repeat: -1, delay: 1 });
        thriveWords.forEach((word) => {
          const o = { n: 0 };
          const render = () => (el.textContent = word.slice(0, Math.round(o.n)));
          tl.to(o, { n: word.length, duration: word.length * 0.07, ease: "none", onUpdate: render })
            .to(o, { n: 0, duration: word.length * 0.035, ease: "none", onUpdate: render, delay: 1.5 })
            .to({}, { duration: 0.25 });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <header className="hero" ref={root} id="top">
      <ClusterField />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-fade">
            <span className="dot" /> Data Analyst · Data Scientist · AI Orchestrator
          </p>
          <h1>
            <span className="mask"><span className="hero-line">I&apos;m Armaan.</span></span>
            <span className="mask"><span className="hero-line dim">I thrive for</span></span>
            <span className="mask">
              <span className="hero-line accent">
                <span ref={typed}>{thriveWords[0]}</span>
                <i className="caret" />
              </span>
            </span>
          </h1>
          <p className="lede hero-fade">
            I turn messy, unstructured data into dashboards that drive action, then get on the mic and
            explain what it means. Data science student in Mumbai, quick to adapt, relentless once the
            vision is clear.
          </p>
          <div className="cta hero-fade">
            <a className="btn primary" href="#projects">See the builds</a>
            <a className="btn" href={links.resume} download>Download resume</a>
          </div>
        </div>

        <div className="gauge hero-fade">
          <svg viewBox="0 0 300 300" role="img" aria-label="Portrait of Armaan framed by a tachometer dial">
            {Array.from({ length: TICKS }, (_, i) => {
              const deg = START + (SWEEP * i) / (TICKS - 1);
              const major = i % 5 === 0;
              const [x1, y1] = polar(deg, major ? 126 : 132);
              const [x2, y2] = polar(deg, 142);
              return (
                <line
                  key={i}
                  className="gauge-tick"
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={i >= 34 ? "var(--accent)" : major ? "var(--silver)" : "var(--slate)"}
                  strokeWidth={major ? 2 : 1}
                  opacity={major ? 1 : 0.55}
                />
              );
            })}
            <path d={arc(START, START + SWEEP, 116)} fill="none" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
            <path
              className="gauge-arc draw"
              pathLength={1}
              d={arc(START, START + SWEEP * 0.86, 116)}
              fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"
            />
          </svg>
          <div className="gauge-photo">
            <Image src="/armaan.jpg" alt="Armaan looking out over a mountain valley" width={460} height={460} priority />
          </div>
          <p className="gauge-label">MUMBAI, IN · B.SC. DATA SCIENCE &apos;27</p>
        </div>
      </div>

      <Waves className="hero-waves" lines={6} height={200} />
      <div className="wrap">
        <dl className="metrics band-accent hero-fade">
          {heroMetrics.map((m) => (
            <div key={m.label}>
              <dd
                data-count={m.value}
                data-decimals={m.decimals}
                data-prefix={m.prefix}
                data-suffix={m.suffix}
              >
                {m.prefix}{m.value.toFixed(m.decimals)}{m.suffix}
              </dd>
              <dt>{m.label}<small>{m.sub}</small></dt>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
