import { faqs } from "@/lib/knowledge";
import { beyond, certs, links, nowItems, raceLog, skillGroups, specSheet } from "@/lib/data";
import ContactForm from "./ContactForm";

export function Head({ n, kicker, title }: { n: string; kicker: string; title: React.ReactNode }) {
  return (
    <div className="sec-head">
      <p className="mono"><b>{n}</b> / {kicker}</p>
      <h2>{title}</h2>
      <span className="rule" />
    </div>
  );
}

export function About() {
  return (
    <div className="about-grid">
      <div className="about-copy" data-reveal>
        <p className="big">
          A data scientist who can actually <em>present</em>, and who adapts fast when the project changes phase.
        </p>
        <p>
          I got into data science out of plain curiosity: I wanted to see how things work under the hood. I still learn
          the same way, by building, breaking and rebuilding, usually against a hackathon deadline.
        </p>
        <p>
          My favourite part is the bit most people skip: cleaning and wrangling messy data until the pattern shows
          itself. Then I ship it as something live, a dashboard or an app, not a notebook that never leaves my laptop.
        </p>
        <p>
          The lesson that stuck: I once over-engineered an offline file converter so badly that I scrapped it and
          rebuilt it from scratch. V2 does exactly what it&apos;s for. Systems should stay focused on their purpose.
        </p>
        <ul className="edge">
          <li><b>Analytics + full-stack</b>I ship live apps, not just notebooks.</li>
          <li><b>Tech + leadership</b>I&apos;ve run a 115-player tournament and a club&apos;s admin.</li>
          <li><b>Adapts fast</b>New stack, new phase, useful within days.</li>
        </ul>
      </div>
      <aside className="spec" data-reveal>
        <p className="mono spec-title">SPEC SHEET · ARMAAN M.</p>
        <dl>
          {specSheet.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <p className="spec-foot">
          <b>Looking for</b> a Data Analyst role or internship.<br />
          <b>Headed for</b> Senior Data Scientist, ideally around automotive, mobility or esports data.
        </p>
      </aside>
    </div>
  );
}

export function Skills() {
  return (
    <div className="gears">
      {skillGroups.map((g) => (
        <div className="gear" key={g.name} data-reveal>
          <p className="mono gear-n">GEAR {g.gear}</p>
          <h3>{g.name}</h3>
          <ul className="chips">
            {g.items.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Track() {
  // 24 squads of 4 + 20 solos = 116 players, one dot each
  const squads = Array.from({ length: 24 }, (_, i) => ({ x: 14 + (i % 12) * 42, y: 26 + Math.floor(i / 12) * 40, i }));
  return (
    <>
      <div className="track-grid">
        <ol className="log">
          {raceLog.map((r) => (
            <li key={r.title} data-reveal>
              <span className="mono when">{r.when}</span>
              <h3>{r.title} <small>{r.role}</small></h3>
              <p>{r.text}</p>
            </li>
          ))}
        </ol>

        <div className="lead">
          <article className="panel" data-reveal>
            <p className="mono kicker">NEXUS ARENA · BGMI ESPORTS · 2025</p>
            <h3>Organizer, host and live shoutcaster</h3>
            <svg className="viz unit" viewBox="0 0 520 150" role="img" aria-label="Unit chart: 24 squads of four players and 20 solo players, 116 players in total">
              {squads.map((s) => (
                <g key={s.i}>
                  <title>{`Squad ${s.i + 1} · 4 players`}</title>
                  {[0, 1, 2, 3].map((k) => (
                    <circle key={k} className="pop" cx={s.x + (k % 2) * 13} cy={s.y + Math.floor(k / 2) * 13} r="5" fill="var(--accent)" />
                  ))}
                </g>
              ))}
              {Array.from({ length: 20 }, (_, i) => (
                <circle key={i} className="pop" cx={14 + i * 25.2} cy={124} r="5" fill="var(--accent2)">
                  <title>{`Solo player ${i + 1}`}</title>
                </circle>
              ))}
            </svg>
            <ul className="legend mono">
              <li><i style={{ background: "var(--accent)" }} />24 squads · 96 players</li>
              <li><i style={{ background: "var(--accent2)" }} />20 solo players</li>
            </ul>
            <p>
              I conceptualized the tournament, ran it end to end and called the matches live on the mic for{" "}
              <b>115+ players</b>. Best training I&apos;ve had in handling chaos under pressure.
            </p>
          </article>

          <article className="panel ringed" data-reveal>
            <svg className="viz ring" viewBox="0 0 120 120" role="img" aria-label="35 percent efficiency improvement">
              <circle cx="60" cy="60" r="40" fill="none" stroke="var(--line-strong)" strokeWidth="8" />
              <path className="draw" pathLength={1} d="M60 20 A40 40 0 0 1 92.4 83.5" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" />
              <text x="60" y="67" textAnchor="middle" className="svg-big">35%</text>
            </svg>
            <div>
              <p className="mono kicker">ROTARACT CLUB OF ML DAHANUKAR · AUG 2025 → NOW</p>
              <h3>Director of Administration</h3>
              <p>
                I run admin operations, asset allocation and data tracking, and rebuilt the documentation and
                communication workflows for a <b>35% gain</b> in operational efficiency.
              </p>
            </div>
          </article>

          <div className="tiles" data-reveal>
            <div><b data-count="200" data-suffix="+">200+</b><span>attendees kept safe as Security Lead, GlamNGlitz</span></div>
            <div><b data-count="80" data-suffix="+">80+</b><span>participants supported as Tech Lead, Social Sutra</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Now() {
  return (
    <div className="now-grid">
      <ul className="board">
        {nowItems.map((n) => (
          <li key={n.title} data-reveal>
            <span className={`mono status ${n.status.toLowerCase()}`}>{n.status}</span>
            <b>{n.title}</b>
            <span className="note">{n.note}</span>
          </li>
        ))}
      </ul>
      <aside className="panel next" data-reveal>
        <p className="mono kicker">NEXT BUILD</p>
        <h3>Dynamic vehicle engine behaviour analysis</h3>
        <p>
          The plan: take Revvheadz from expense tracking to real telemetry, with predictive maintenance on top.
          Cars and data in one project is the whole point.
        </p>
        <svg className="viz wave" viewBox="0 0 300 70" aria-hidden="true">
          <path className="draw" pathLength={1} d="M0 50 C20 50 24 18 40 18 S60 54 78 54 S96 10 116 10 S138 46 156 46 S176 24 194 24 S214 58 232 58 S254 14 272 14 S292 34 300 34" fill="none" stroke="var(--accent2)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </aside>
    </div>
  );
}

export function Beyond() {
  return (
    <>
      <div className="beyond">
        {beyond.map((b, i) => (
          <article className="panel" key={b.title} data-reveal>
            <p className="mono kicker">BAY {String(i + 1).padStart(2, "0")}</p>
            <h3>{b.title}</h3>
            <dl>
              {b.lines.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </article>
        ))}
      </div>
      <p className="aside-line" data-reveal>
        If I weren&apos;t in tech I&apos;d be a <b>test driver</b> or an <b>esports caster</b>. Bikes for traffic, cars for
        long drives, both with purpose.
      </p>
    </>
  );
}

export function Certs() {
  return (
    <ul className="certs">
      {certs.map((c) => (
        <li key={c.title} data-reveal>
          <span className="mono">{c.when}</span>
          <div>
            <h3>{c.title}</h3>
            <p><b>{c.org}</b> · {c.note}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Faq() {
  return (
    <div className="faq">
      {faqs.map((f, i) => (
        <details key={f.id} open={i === 0} data-reveal>
          <summary><h3>{f.q}</h3></summary>
          <p>{f.a}</p>
        </details>
      ))}
      <p className="faq-more" data-reveal>
        Something else? Hit <b>Ask my data</b> in the corner: a small AI model answers from this same fact sheet,
        entirely in your browser.
      </p>
    </div>
  );
}

export function Contact() {
  return (
    <div className="contact-grid">
      <div data-reveal>
        <p className="big">Hiring a data analyst who can build it <em>and</em> present it? Pull in.</p>
        <ul className="contact-links">
          <li><span className="mono">EMAIL</span><a href={`mailto:${links.email}`}>{links.email}</a></li>
          <li><span className="mono">LINKEDIN</span><a href={links.linkedin} target="_blank" rel="noreferrer">in/armaan-mangaonkar ↗</a></li>
          <li><span className="mono">GITHUB</span><a href={links.github} target="_blank" rel="noreferrer">armnJs ↗</a></li>
        </ul>
        <div className="cta">
          <a className="btn primary" href={links.resume} download>Resume (combined)</a>
          <a className="btn" href={links.resumeDA} download>Resume (Data Analyst)</a>
        </div>
      </div>
      <div className="panel" data-reveal>
        <ContactForm />
      </div>
    </div>
  );
}
