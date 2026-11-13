"use client";

import { useEffect, useState } from "react";
import { links } from "@/lib/data";

type Repo = { name: string; html_url: string; language: string | null; pushed_at: string; fork: boolean };
type State = { repos: number; followers: number; recent: Repo[] } | null;

const SKIP = new Set(["automation", "armnJs"]);

export default function GithubStats() {
  const [data, setData] = useState<State>(null);

  useEffect(() => {
    let on = true;
    Promise.all([
      fetch("https://api.github.com/users/armnJs").then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch("https://api.github.com/users/armnJs/repos?sort=pushed&per_page=12").then((r) => (r.ok ? r.json() : Promise.reject())),
    ])
      .then(([u, repos]: [{ public_repos: number; followers: number }, Repo[]]) => {
        if (on)
          setData({
            repos: u.public_repos,
            followers: u.followers,
            recent: repos.filter((r) => !r.fork && !SKIP.has(r.name)).slice(0, 4),
          });
      })
      .catch(() => {});
    return () => { on = false; };
  }, []);

  return (
    <aside className="gh" data-reveal>
      <p className="mono gh-title">
        <i className="live" /> LIVE TELEMETRY · github.com/armnJs
      </p>
      <div className="gh-row">
        <div className="gh-num"><b>{data ? data.repos : "–"}</b><span>public repos</span></div>
        <div className="gh-num"><b>{data ? data.followers : "–"}</b><span>followers</span></div>
        <ul className="gh-recent">
          {data
            ? data.recent.map((r) => (
                <li key={r.name}>
                  <a href={r.html_url} target="_blank" rel="noreferrer">{r.name}</a>
                  <span>
                    {r.language ?? "—"} · pushed {new Date(r.pushed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </li>
              ))
            : <li><span>Fetching latest pushes…</span></li>}
        </ul>
        <a className="btn small" href={links.github} target="_blank" rel="noreferrer">Open GitHub ↗</a>
      </div>
    </aside>
  );
}
