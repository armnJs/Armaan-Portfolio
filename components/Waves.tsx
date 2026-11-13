"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const STROKES = ["var(--accent2)", "var(--accent)", "var(--slate)"];
const W = 1440;

/** Layered sine waves that drift continuously and swell with scroll speed. Used as section dividers. */
export default function Waves({ lines = 4, height = 120, className = "" }: { lines?: number; height?: number; className?: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current!;
    const paths = Array.from(el.querySelectorAll("path"));
    const mid = height / 2;
    let boost = 0, lastY = window.scrollY;

    const draw = (t: number) => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      boost += (Math.min(dy / 40, 1.4) - boost) * 0.08;
      paths.forEach((p, i) => {
        const amp = (height * 0.16 + i * 2.5) * (1 + boost);
        const f1 = 0.0042 + i * 0.0011, f2 = 0.011 + i * 0.002;
        const s1 = 0.7 + i * 0.22, s2 = 1.3 - i * 0.15;
        let d = "";
        for (let x = 0; x <= W; x += 24) {
          const y = mid + amp * Math.sin(x * f1 + t * s1 + i * 1.3) + amp * 0.35 * Math.sin(x * f2 - t * s2 + i);
          d += (x ? "L" : "M") + x + " " + y.toFixed(1);
        }
        p.setAttribute("d", d);
      });
    };

    draw(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let on = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !on) { gsap.ticker.add(draw); on = true; }
      else if (!entry.isIntersecting && on) { gsap.ticker.remove(draw); on = false; }
    });
    io.observe(el);
    return () => { io.disconnect(); gsap.ticker.remove(draw); };
  }, [height]);

  return (
    <svg ref={svg} className={`waves ${className}`} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" aria-hidden="true" style={{ height }}>
      {Array.from({ length: lines }, (_, i) => (
        <path key={i} fill="none" stroke={STROKES[i % 3]} strokeWidth={i === 1 ? 2 : 1.2} opacity={0.75 - i * 0.12} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
