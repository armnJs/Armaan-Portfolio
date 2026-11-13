"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Site-wide scroll choreography: reveals, counters, chart draw-ins, rev bar. */
export default function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Rev bar = scroll progress
      gsap.to(".revbar span", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      // Generic reveals
      gsap.set("[data-reveal]", { opacity: 0, y: 28 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });

      // Headings roll in letter by letter, as a travelling wave
      gsap.utils.toArray<HTMLElement>(".sec-head h2").forEach((h) => {
        const split = new SplitText(h, { type: "words,chars" });
        gsap.from(split.chars, {
          yPercent: 130,
          rotate: 10,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.8)",
          stagger: 0.028,
          scrollTrigger: { trigger: h, start: "top 88%", once: true },
        });
      });

      // Cards lean toward the cursor
      if (window.matchMedia("(hover: hover)").matches) gsap.utils.toArray<HTMLElement>(".card, .lab-tile, .gear").forEach((el) => {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
        gsap.set(el, { transformPerspective: 900 });
        el.addEventListener("pointermove", (e) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 5);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 5);
        });
        el.addEventListener("pointerleave", () => { rx(0); ry(0); });
      });

      // Floating hero dial
      gsap.to(".gauge", { y: -12, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // Section heading rule
      gsap.utils.toArray<HTMLElement>(".sec-head .rule").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      // Number counters
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count || "0");
        const dec = parseInt(el.dataset.decimals || "0", 10);
        const pre = el.dataset.prefix || "";
        const suf = el.dataset.suffix || "";
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onStart: () => (el.textContent = pre + (0).toFixed(dec) + suf),
          onUpdate: () => (el.textContent = pre + o.v.toFixed(dec) + suf),
        });
      });

      // Chart draw-ins: any .viz animates its marks when it enters
      gsap.utils.toArray<SVGElement>(".viz").forEach((viz) => {
        const q = gsap.utils.selector(viz);
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: viz, start: "top 85%", once: true },
        });
        const fade = q(".fade"), growx = q(".growx"), grow = q(".grow"), draw = q(".draw"), pop = q(".pop");
        if (fade.length) tl.from(fade, { opacity: 0, duration: 0.5, stagger: 0.05 }, 0);
        if (growx.length) tl.from(growx, { scaleX: 0, transformOrigin: "0% 50%", duration: 0.9, stagger: 0.12 }, 0.1);
        if (grow.length) tl.from(grow, { scaleY: 0, transformOrigin: "50% 100%", duration: 0.7, stagger: 0.06 }, 0.1);
        if (draw.length) tl.from(draw, { strokeDashoffset: 1, duration: 1.4, ease: "power2.inOut", stagger: 0.2 }, 0.2);
        if (pop.length)
          tl.from(pop, { scale: 0, transformOrigin: "50% 50%", duration: 0.4, ease: "back.out(2)", stagger: { each: 0.012, from: "start" } }, 0.3);
      });

      // Chips cascade
      gsap.utils.toArray<HTMLElement>(".chips").forEach((group) => {
        gsap.from(group.children, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
          scrollTrigger: { trigger: group, start: "top 90%", once: true },
        });
      });
    });

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => mm.revert();
  });

  return (
    <div className="revbar" aria-hidden="true">
      <span />
    </div>
  );
}
