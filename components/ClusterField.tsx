"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cssVar, rgbTriplet } from "@/lib/theme";

const K = 3;
const N = 150;
const pal = { colors: ["0,242,254", "139,124,255", "226,232,240"], slate: "148,163,184" };

type P = { x: number; y: number; c: number; ph: number };

/** Hero backdrop: a live k-means run. Points scatter, centroids iterate to convergence, repeat. */
export default function ClusterField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rnd = Math.random;
    const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
    const clamp = (v: number) => Math.min(0.97, Math.max(0.03, v));

    const loadPal = () => {
      pal.colors = [cssVar("--accent"), cssVar("--accent2"), cssVar("--silver")].map(rgbTriplet);
      pal.slate = rgbTriplet(cssVar("--slate"));
    };
    loadPal();
    const mo = new MutationObserver(() => { loadPal(); if (reduced) draw(0); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pts: P[] = Array.from({ length: N }, () => ({ x: rnd(), y: rnd(), c: 0, ph: rnd() * 6.283 }));
    const cents = Array.from({ length: K }, () => ({ x: 0.5, y: 0.5 }));
    const st = { mix: 0, pull: 0, link: 0, cent: 0 };

    const scatter = () => {
      const blobs = Array.from({ length: K }, () => ({ x: 0.18 + rnd() * 0.64, y: 0.2 + rnd() * 0.6 }));
      return pts.map((_, i) => {
        if (i % 6 === 0) return { x: clamp(rnd()), y: clamp(rnd()) };
        const b = blobs[i % K];
        return { x: clamp(b.x + gauss() * 0.13), y: clamp(b.y + gauss() * 0.16) };
      });
    };
    const assign = () =>
      pts.forEach((p) => {
        let best = 0, bd = Infinity;
        cents.forEach((c, k) => {
          const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
          if (d < bd) { bd = d; best = k; }
        });
        p.c = best;
      });
    const means = () =>
      cents.map((c, k) => {
        const mine = pts.filter((p) => p.c === k);
        if (!mine.length) return { x: c.x, y: c.y };
        return { x: mine.reduce((s, p) => s + p.x, 0) / mine.length, y: mine.reduce((s, p) => s + p.y, 0) / mine.length };
      });
    const hud = (t: string) => { if (hudRef.current) hudRef.current.textContent = t; };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const pos = pts.map((p) => {
        const c = cents[p.c];
        const f = st.pull * 0.28;
        return {
          x: (p.x + (c.x - p.x) * f) * w + Math.sin(time * 0.9 + p.ph) * 5,
          y: (p.y + (c.y - p.y) * f) * h + Math.cos(time * 0.7 + p.ph) * 5,
        };
      });
      if (st.link > 0.01) {
        ctx.lineWidth = 1;
        pts.forEach((p, i) => {
          const c = cents[p.c];
          ctx.strokeStyle = `rgba(${pal.colors[p.c]},${0.09 * st.link})`;
          ctx.beginPath();
          ctx.moveTo(pos[i].x, pos[i].y);
          ctx.lineTo(c.x * w, c.y * h);
          ctx.stroke();
        });
      }
      pts.forEach((p, i) => {
        ctx.fillStyle = `rgba(${pal.slate},${0.5 * (1 - st.mix)})`;
        ctx.beginPath();
        ctx.arc(pos[i].x, pos[i].y, 2.4, 0, 6.283);
        ctx.fill();
        if (st.mix > 0.01) {
          ctx.fillStyle = `rgba(${pal.colors[p.c]},${0.85 * st.mix})`;
          ctx.beginPath();
          ctx.arc(pos[i].x, pos[i].y, 2.6, 0, 6.283);
          ctx.fill();
        }
      });
      if (st.cent > 0.01) {
        cents.forEach((c, k) => {
          const x = c.x * w, y = c.y * h;
          ctx.strokeStyle = `rgba(${pal.colors[k]},${st.cent})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, 11, 0, 6.283);
          ctx.moveTo(x - 17, y); ctx.lineTo(x + 17, y);
          ctx.moveTo(x, y - 17); ctx.lineTo(x, y + 17);
          ctx.stroke();
        });
      }
    };

    if (reduced) {
      draw(0);
      hud("scatter · n=150");
      return () => { mo.disconnect(); window.removeEventListener("resize", resize); };
    }

    let tl: gsap.core.Timeline | null = null;
    let alive = true;
    const cycle = () => {
      if (!alive) return;
      const target = scatter();
      tl = gsap.timeline({ onComplete: cycle });
      tl.to(st, { mix: 0, pull: 0, link: 0, cent: 0, duration: 0.8, ease: "power2.inOut" });
      tl.call(() => hud("loading raw points · n=150"));
      pts.forEach((p, i) => tl!.to(p, { x: target[i].x, y: target[i].y, duration: 1.6, ease: "power3.inOut" }, 0.7));
      tl.call(() => {
        cents.forEach((c) => { const s = pts[Math.floor(rnd() * N)]; c.x = s.x; c.y = s.y; });
        assign();
        hud("k-means · k=3 · init centroids");
      });
      tl.to(st, { mix: 1, link: 1, cent: 1, duration: 0.8 });
      for (let it = 1; it <= 4; it++) {
        tl.call(() => {
          const m = means();
          hud(`k-means · k=3 · iter 0${it}`);
          cents.forEach((c, k) =>
            gsap.to(c, { x: m[k].x, y: m[k].y, duration: 0.7, ease: "power2.inOut", onComplete: k === K - 1 ? assign : undefined }),
          );
        });
        tl.to({}, { duration: 1.05 });
      }
      tl.call(() => hud("k-means · converged ✓"));
      tl.to(st, { pull: 1, duration: 1.2, ease: "power2.inOut" });
      tl.to({}, { duration: 2.4 });
    };
    cycle();

    const tick = (time: number) => draw(time);
    gsap.ticker.add(tick);

    return () => {
      alive = false;
      tl?.kill();
      gsap.killTweensOf(cents);
      gsap.ticker.remove(tick);
      mo.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="cluster" aria-hidden="true">
      <canvas ref={canvasRef} />
      <span className="cluster-hud" ref={hudRef} />
    </div>
  );
}
