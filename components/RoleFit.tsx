"use client";

import { useState } from "react";
import { analyse, type FitResult, type Hit } from "@/lib/fit";

const SAMPLE = `Junior Data Analyst (Fresher welcome)

We're looking for a Data Analyst to turn messy business data into decisions.

Requirements:
- Strong SQL and Python (Pandas) for data cleaning and exploratory analysis
- Hands-on experience building dashboards in Power BI or Tableau
- Ability to communicate insights and present findings to stakeholders
- Basic statistics and A/B testing knowledge

Nice to have: exposure to Snowflake or Azure, familiarity with Docker.`;

function Meter({ score }: { score: number }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <svg className="fit-meter" viewBox="0 0 120 120" role="img" aria-label={`${score} percent role compatibility`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--line-strong)" strokeWidth="9" />
      <circle
        cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(.2,.8,.2,1)" }}
      />
      <text x="60" y="64" textAnchor="middle" className="fit-score">{score}%</text>
      <text x="60" y="82" textAnchor="middle" className="fit-sub">compatibility</text>
    </svg>
  );
}

function Col({ title, tone, note, items }: { title: string; tone: string; note: string; items: (Hit & { why?: string })[] }) {
  return (
    <div className={`panel fit-col ${tone}`}>
      <h3>{title}</h3>
      <p className="fit-note">{note}</p>
      {items.length === 0 ? (
        <p className="fit-empty">Nothing in this bucket for this JD.</p>
      ) : (
        <ul>
          {items.map((h) => (
            <li key={h.label}>
              <strong>{h.label}{h.required && <span className="fit-req mono">asked as core</span>}</strong>
              <span>{h.why ?? h.evidence}</span>
              {h.why && h.evidence && <em>{h.evidence}</em>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RoleFit() {
  const [jd, setJd] = useState("");
  const [res, setRes] = useState<FitResult | null>(null);
  const [tried, setTried] = useState(false);

  const run = (text = jd) => {
    setTried(true);
    setRes(analyse(text));
  };

  return (
    <div className="fit">
      <div className="panel fit-in">
        <label htmlFor="jd" className="mono fit-label">PASTE A JOB DESCRIPTION</label>
        <textarea
          id="jd"
          rows={9}
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here. It's analysed in your browser; nothing is sent anywhere."
        />
        <div className="fit-actions">
          <button type="button" className="btn primary" onClick={() => run()} disabled={!jd.trim()}>Analyse fit</button>
          <button type="button" className="btn" onClick={() => { setJd(SAMPLE); run(SAMPLE); }}>Try a sample JD</button>
          {(jd || res) && <button type="button" className="btn" onClick={() => { setJd(""); setRes(null); setTried(false); }}>Clear</button>}
        </div>
        {tried && !res && <p className="fit-empty" role="status">Couldn&apos;t find enough recognisable skills. Paste the full description, not just the title.</p>}
      </div>

      {res && (
        <div className="fit-out" aria-live="polite">
          <div className="panel fit-top">
            <Meter score={res.score} />
            <div>
              <p className="mono fit-verdict">{res.verdict} · reads as {res.roleGuess}</p>
              <p className="fit-summary">{res.summary}</p>
              <p className="mono fit-count">{res.matched} of {res.asked} skills the JD names are covered at working level or better</p>
              {res.notes.map((n) => <p key={n} className="fit-flag">{n}</p>)}
            </div>
          </div>

          <div className="fit-cols">
            <Col title="Strong for this role" tone="good" note="Shipped, evidenced, and weighted heavily by the JD." items={res.strong} />
            <Col title="Transferable" tone="mid" note="Working-level or adjacent: close enough to be productive fast." items={res.adjacent} />
            <Col title="Low priority" tone="low" note="Not a weakness: secondary to this role, or already on the roadmap." items={res.lowPriority} />
          </div>
          <p className="fit-foot mono">Estimate from keyword weighting against the resume and projects. A conversation beats a score.</p>
        </div>
      )}
    </div>
  );
}
