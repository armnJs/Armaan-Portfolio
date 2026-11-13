"use client";

import { useEffect, useRef, useState } from "react";
import { links } from "@/lib/data";
import { setTheme, syncMeta, useTheme } from "@/lib/theme";

const ITEMS = [
  ["Projects", "#projects"], ["About", "#about"], ["Skills", "#skills"], ["Lab", "#lab"],
  ["Track record", "#track"], ["Now", "#now"], ["Pit stop", "#contact"],
];

function ThemeToggle() {
  const theme = useTheme();
  const btn = useRef<HTMLButtonElement>(null);
  const next = theme === "dark" ? "light" : "dark";

  // keep the browser UI colour (mobile address bar) in step with the theme on first paint
  useEffect(() => syncMeta(theme), [theme]);

  return (
    <button
      ref={btn}
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      onClick={() => {
        const r = btn.current!.getBoundingClientRect();
        setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <g className="sun">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </g>
        <path className="moon" d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
    </button>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => innerWidth > 860 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);

  return (
    <nav className={`nav${open ? " open" : ""}`} aria-label="Main">
      <div className="wrap nav-in">
        <a className="logo" href="#top" onClick={() => setOpen(false)}>armaan<span>.</span>data</a>
        <ul className="nav-links" id="nav-links">
          {ITEMS.map(([label, href]) => (
            <li key={href}><a href={href} onClick={() => setOpen(false)}>{label}</a></li>
          ))}
          <li className="nav-resume-m"><a className="btn primary" href={links.resume} download>Download resume</a></li>
        </ul>
        <div className="nav-tools">
          <ThemeToggle />
          <a className="btn small primary nav-resume" href={links.resume} download>Resume</a>
          <button
            type="button"
            className="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
