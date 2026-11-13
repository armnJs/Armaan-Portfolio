"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const W = 1440;
const H = 120;
const LAYERS = [
  { y: 0.38, amp: 0.13, f1: 0.0046, f2: 0.0105, s1: 0.55, s2: 1.1, ph: 0.8 },   // back
  { y: 0.58, amp: 0.15, f1: 0.0039, f2: 0.0092, s1: 0.8, s2: 1.4, ph: 2.6 },    // front, the band's own colour
];

const wave = (i: number, t: number, boost: number) => {
  const l = LAYERS[i];
  const amp = H * l.amp * (1 + boost);
  let d = "";
  for (let x = 0; x <= W; x += 24) {
    const y = H * l.y + amp * Math.sin(x * l.f1 + t * l.s1 + l.ph) + amp * 0.4 * Math.sin(x * l.f2 - t * l.s2);
    d += (x ? "L" : "M") + x + " " + y.toFixed(1);
  }
  return d + `L${W} ${H}L0 ${H}Z`;
};

/**
 * The top edge of a colour band: a pair of flat, filled waves that drift and swell with scroll speed.
 * `from` is the colour of the band above, painted behind the waves. The front wave takes this band's colour.
 */
export default function WaveEdge({ from = "var(--c-base)" }: { from?: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current!;
    const paths = Array.from(el.querySelectorAll("path"));
    let boost = 0, lastY = window.scrollY;
    const draw = (t: number) => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      boost += (Math.min(dy / 45, 1.2) - boost) * 0.08;
      paths.forEach((p, i) => p.setAttribute("d", wave(i, t, boost)));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let on = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { gsap.ticker.add(draw); on = true; }
      else if (!e.isIntersecting && on) { gsap.ticker.remove(draw); on = false; }
    });
    io.observe(el);
    return () => { io.disconnect(); gsap.ticker.remove(draw); };
  }, []);

  return (
    <svg ref={svg} className="wave-edge" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <rect width={W} height={H} fill={from} />
      <path d={wave(0, 0, 0)} fill="var(--edge-back)" />
      <path d={wave(1, 0, 0)} fill="var(--bg)" />
    </svg>
  );
}
