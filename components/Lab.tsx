"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const A = "var(--accent)", B = "var(--accent2)", H = "var(--silver)", L = "var(--line-strong)", S = "var(--slate)";
const r1 = (v: number) => Math.round(v * 10) / 10;
function seeded(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = seeded(11);

/* 1 · gradient descent on L(x) = ((x-190)/160)² */
const loss = (x: number) => ((x - 190) / 160) ** 2;
const gy = (x: number) => r1(150 - 115 * loss(x));
const gdCurve = Array.from({ length: 26 }, (_, i) => 30 + i * 10).map((x, i) => `${i ? "L" : "M"}${x} ${gy(x)}`).join(" ");
const gdSteps = [40];
for (let i = 0; i < 8; i++) gdSteps.push(r1(gdSteps[i] - 0.36 * (gdSteps[i] - 190)));

/* 2 · least-squares regression */
const pts = Array.from({ length: 14 }, (_, i) => ({ x: 34 + i * 18, y: r1(146 - i * 7.2 + (rng() - 0.5) * 38) }));
const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
const my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
const slope = pts.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) / pts.reduce((s, p) => s + (p.x - mx) ** 2, 0);
const sst = pts.reduce((s, p) => s + (p.y - my) ** 2, 0);
const r2 = (m: number, c: number) => Math.max(0, 1 - pts.reduce((s, p) => s + (p.y - (c + m * p.x)) ** 2, 0) / sst);
const R2_FINAL = r2(slope, my - slope * mx);

/* 3 · decision tree */
const nodes = [
  { x: 150, y: 28, p: -1 }, { x: 82, y: 82, p: 0 }, { x: 218, y: 82, p: 0 },
  { x: 46, y: 140, p: 1 }, { x: 118, y: 140, p: 1 }, { x: 182, y: 140, p: 2 }, { x: 254, y: 140, p: 2 },
];
const leafFill = [A, B, B, A];

/* 4 · sampling distribution */
const bell = Array.from({ length: 17 }, (_, i) => r1(112 * Math.exp(-(((i - 8) / 3.4) ** 2))));
const kde = bell.map((h, i) => `${i ? "L" : "M"}${27 + i * 15.4} ${r1(150 - h)}`).join(" ");

/* 5 · neural net */
const layers = [3, 4, 4, 2].map((n, li) => Array.from({ length: n }, (_, k) => ({ x: 48 + li * 68, y: r1(90 + (k - (n - 1) / 2) * 34) })));
const edges = layers.slice(0, -1).flatMap((layer, li) => layer.flatMap((a) => layers[li + 1].map((b) => ({ li, a, b }))));

const TILES = [
  { k: "gd", t: "Gradient descent", d: "Step downhill until the loss stops falling." },
  { k: "reg", t: "Linear regression", d: "Fit the line, shrink the residuals, watch R² climb." },
  { k: "tree", t: "Decision tree", d: "One of the splits-on-splits behind the churn Random Forest." },
  { k: "dist", t: "Sampling distribution", d: "EDA starts with the shape of the data." },
  { k: "nn", t: "Neural network", d: "A forward pass, layer by layer. Deep learning is next on my list." },
  { k: "sig", t: "Signal decomposition", d: "One messy wave, three clean frequencies: the idea behind my engine-behaviour build." },
] as const;

export default function Lab() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const when = (k: string) => ({ trigger: q(`.lab-${k}`)[0], start: "top 92%", end: "bottom 8%", toggleActions: "play pause resume pause" });

        // 1 gradient descent
        const ball = q(".gd-ball")[0], lossT = q(".gd-loss")[0], epochT = q(".gd-epoch")[0], trail = q(".gd-trail");
        const gd = gsap.timeline({ repeat: -1, repeatDelay: 1.4, scrollTrigger: when("gd") });
        gd.set(trail, { opacity: 0 }).set(ball, { attr: { cx: gdSteps[0], cy: gy(gdSteps[0]) } });
        gdSteps.forEach((x, i) => {
          gd.to(ball, { attr: { cx: x, cy: gy(x) }, duration: i ? 0.5 : 0.01, ease: "power2.out" })
            .call(() => { lossT.textContent = `loss ${loss(x).toFixed(3)}`; epochT.textContent = `epoch ${i}`; })
            .to(trail[i], { opacity: 0.55, duration: 0.15 }, "<")
            .to({}, { duration: 0.18 });
        });

        // 2 regression
        const line = q(".reg-line")[0], res = q(".reg-res"), r2T = q(".reg-r2")[0];
        const fit = { m: 0, c: my };
        const render = () => {
          gsap.set(line, { attr: { y1: fit.c + fit.m * 20, y2: fit.c + fit.m * 280 } });
          res.forEach((el, i) => el.setAttribute("y2", String(fit.c + fit.m * pts[i].x)));
          r2T.textContent = `R² ${r2(fit.m, fit.c).toFixed(2)}`;
        };
        gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1.6, scrollTrigger: when("reg") })
          .fromTo(fit, { m: 0.25, c: my - 0.25 * mx }, { m: slope, c: my - slope * mx, duration: 2.2, ease: "elastic.out(1, 0.55)", onUpdate: render });

        // 3 tree
        const tEdges = q(".tree-e"), tNodes = q(".tree-n"), sample = q(".tree-s")[0];
        const tree = gsap.timeline({ repeat: -1, repeatDelay: 1, scrollTrigger: when("tree") });
        tree.set(tEdges, { strokeDashoffset: 1 }).set(tNodes, { scale: 0, transformOrigin: "50% 50%" }).set(sample, { opacity: 0 })
          .to(tNodes[0], { scale: 1, duration: 0.3, ease: "back.out(2)" })
          .to(tEdges.slice(0, 2), { strokeDashoffset: 0, duration: 0.45, stagger: 0.1 })
          .to(tNodes.slice(1, 3), { scale: 1, duration: 0.3, ease: "back.out(2)", stagger: 0.1 }, "-=0.2")
          .to(tEdges.slice(2), { strokeDashoffset: 0, duration: 0.45, stagger: 0.07 })
          .to(tNodes.slice(3), { scale: 1, duration: 0.3, ease: "back.out(2)", stagger: 0.07 }, "-=0.25")
          .set(sample, { opacity: 1, attr: { cx: 150, cy: 28 } })
          .to(sample, { attr: { cx: 218, cy: 82 }, duration: 0.6, ease: "power2.inOut" })
          .to(sample, { attr: { cx: 182, cy: 140 }, duration: 0.6, ease: "power2.inOut" })
          .to(tNodes[5], { scale: 1.5, duration: 0.25, yoyo: true, repeat: 3 })
          .to({}, { duration: 0.8 });

        // 4 distribution: bars resample around the bell forever
        gsap.to(q(".dist-bar"), {
          scaleY: () => gsap.utils.random(0.68, 1.18),
          transformOrigin: "50% 100%",
          duration: 0.9,
          ease: "sine.inOut",
          stagger: { each: 0.03, from: "center" },
          repeat: -1,
          repeatRefresh: true,
          scrollTrigger: when("dist"),
        });

        // 5 neural net forward pass
        const nn = gsap.timeline({ repeat: -1, repeatDelay: 0.6, scrollTrigger: when("nn") });
        nn.to(q(".nn-l0"), { fill: A, scale: 1.3, transformOrigin: "50% 50%", duration: 0.25, stagger: 0.05, yoyo: true, repeat: 1 });
        [0, 1, 2].forEach((li) => {
          nn.to(q(`.nn-e${li}`), { stroke: li % 2 ? B : A, opacity: 0.9, duration: 0.3, stagger: { each: 0.012, from: "random" } })
            .to(q(`.nn-l${li + 1}`), { fill: li === 2 ? H : A, scale: 1.3, transformOrigin: "50% 50%", duration: 0.25, stagger: 0.05, yoyo: true, repeat: 1 }, "-=0.1")
            .to(q(`.nn-e${li}`), { stroke: L, opacity: 0.5, duration: 0.4 }, "-=0.2");
        });

        // 6 signal = sum of three sines, redrawn every frame while visible
        const sig = q(".sig-path")[0], parts = q(".sig-part"), bars = q(".sig-bar");
        const comp = [{ a: 20, f: 0.03, s: 2 }, { a: 11, f: 0.075, s: -3.1 }, { a: 6, f: 0.16, s: 5.3 }];
        let live = false;
        const tick = (t: number) => {
          if (!live) return;
          let d = "";
          const pd = ["", "", ""];
          for (let x = 16; x <= 284; x += 4) {
            let y = 0;
            comp.forEach((c, i) => {
              const v = c.a * Math.sin(x * c.f + t * c.s);
              y += v;
              pd[i] += `${x === 16 ? "M" : "L"}${x} ${(128 + i * 16 + v * 0.3).toFixed(1)}`;
            });
            d += `${x === 16 ? "M" : "L"}${x} ${(54 + y).toFixed(1)}`;
          }
          sig.setAttribute("d", d);
          parts.forEach((p, i) => p.setAttribute("d", pd[i]));
          bars.forEach((b, i) => gsap.set(b, { scaleX: 0.8 + 0.2 * Math.sin(t * 3 + i * 2), transformOrigin: "0% 50%" }));
        };
        gsap.ticker.add(tick);
        const st = ScrollTrigger.create({ trigger: q(".lab-sig")[0], start: "top 95%", end: "bottom 5%", onToggle: (s) => (live = s.isActive) });
        return () => { gsap.ticker.remove(tick); st.kill(); };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const viz = (k: string) => {
    switch (k) {
      case "gd":
        return (
          <svg viewBox="0 0 300 180" role="img" aria-label="A ball stepping down a loss curve to its minimum">
            <path d={gdCurve} fill="none" stroke={B} strokeWidth="2" />
            {gdSteps.map((x, i) => <circle key={i} className="gd-trail" cx={x} cy={gy(x)} r="3" fill={A} opacity=".5" />)}
            <circle className="gd-ball" cx={gdSteps[8]} cy={gy(gdSteps[8])} r="7" fill={H} stroke="var(--card)" strokeWidth="2" />
            <text className="gd-loss svg-mono" x="150" y="24" textAnchor="middle">loss {loss(gdSteps[8]).toFixed(3)}</text>
            <text className="gd-epoch svg-mono" x="150" y="172" textAnchor="middle">epoch 8</text>
          </svg>
        );
      case "reg":
        return (
          <svg viewBox="0 0 300 180" role="img" aria-label="A regression line settling through a cloud of points">
            <path d="M16 160 H288 M16 160 V14" stroke={L} fill="none" />
            {pts.map((p, i) => <line key={i} className="reg-res" x1={p.x} y1={p.y} x2={p.x} y2={r1(my - slope * mx + slope * p.x)} stroke={B} strokeWidth="1.5" opacity=".7" />)}
            <line className="reg-line" x1="20" x2="280" y1={r1(my - slope * mx + slope * 20)} y2={r1(my - slope * mx + slope * 280)} stroke={A} strokeWidth="2.5" strokeLinecap="round" />
            {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4.5" fill="var(--silver)" stroke="var(--card)" strokeWidth="2" />)}
            <text className="reg-r2 svg-big" x="28" y="34">R² {R2_FINAL.toFixed(2)}</text>
          </svg>
        );
      case "tree":
        return (
          <svg viewBox="0 0 300 180" role="img" aria-label="A decision tree growing and classifying a sample">
            {nodes.slice(1).map((n, i) => (
              <path key={i} className="tree-e" pathLength={1} strokeDasharray="1" d={`M${nodes[n.p].x} ${nodes[n.p].y} L${n.x} ${n.y}`} stroke={S} strokeWidth="1.5" fill="none" />
            ))}
            {nodes.map((n, i) => (
              <circle key={i} className="tree-n" cx={n.x} cy={n.y} r={i < 3 ? 11 : 9} fill={i < 3 ? "var(--card)" : leafFill[i - 3]} stroke={i < 3 ? "var(--silver)" : "var(--card)"} strokeWidth="2" />
            ))}
            <circle className="tree-s" cx="182" cy="140" r="5" fill={H} />
            <text className="svg-mono" x="46" y="166" textAnchor="middle">stay</text>
            <text className="svg-mono" x="118" y="166" textAnchor="middle">churn</text>
            <text className="svg-mono" x="182" y="166" textAnchor="middle">churn</text>
            <text className="svg-mono" x="254" y="166" textAnchor="middle">stay</text>
          </svg>
        );
      case "dist":
        return (
          <svg viewBox="0 0 300 180" role="img" aria-label="A histogram resampling around a bell curve">
            <path d="M16 151 H288" stroke={L} />
            {bell.map((h, i) => <rect key={i} className="dist-bar" x={21 + i * 15.4} y={150 - h} width="12.4" height={Math.max(h, 2)} rx="3" fill={B} opacity=".75" />)}
            <path d={kde} fill="none" stroke={A} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <text className="svg-mono" x="150" y="172" textAnchor="middle">μ</text>
          </svg>
        );
      case "nn":
        return (
          <svg viewBox="0 0 300 180" role="img" aria-label="Signals flowing forward through a small neural network">
            {edges.map((e, i) => <line key={i} className={`nn-e${e.li}`} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} stroke={L} strokeWidth="1" opacity=".5" />)}
            {layers.map((layer, li) => layer.map((n, k) => <circle key={`${li}-${k}`} className={`nn-l${li}`} cx={n.x} cy={n.y} r="8" fill="var(--card)" stroke="var(--silver)" strokeWidth="1.5" />))}
            <text className="svg-mono" x="48" y="172" textAnchor="middle">input</text>
            <text className="svg-mono" x="150" y="172" textAnchor="middle">hidden</text>
            <text className="svg-mono" x="252" y="172" textAnchor="middle">output</text>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 300 180" role="img" aria-label="A composite wave above the three sine waves it is made of">
            <path className="sig-path" d="M16 54 H284" fill="none" stroke={A} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 100 H284" stroke={L} strokeDasharray="3 5" />
            {[B, "var(--silver)", H].map((c, i) => (
              <g key={i}>
                <path className="sig-part" d={`M16 ${128 + i * 16} H200`} fill="none" stroke={c} strokeWidth="1.5" opacity=".9" />
              </g>
            ))}
            <text className="svg-mono" x="16" y="18">signal</text>
            <text className="svg-mono" x="16" y="114">= f₁ + f₂ + f₃</text>
          </svg>
        );
    }
  };

  return (
    <div className="lab" ref={root}>
      {TILES.map((t, i) => (
        <article key={t.k} className={`lab-tile lab-${t.k}`} data-reveal>
          <div className="lab-viz">{viz(t.k)}</div>
          <p className="mono kicker"><span>{String(i + 1).padStart(2, "0")}</span> live</p>
          <h3>{t.t}</h3>
          <p>{t.d}</p>
        </article>
      ))}
    </div>
  );
}
