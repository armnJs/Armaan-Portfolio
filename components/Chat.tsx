"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { knowledge } from "@/lib/knowledge";
import { lexicalScores } from "@/lib/chat/lexical";
import { COMMANDS, preloadResume, runCommand, type Action, type CommandResult } from "@/lib/chat/commands";
import { links } from "@/lib/data";

type Trace = { q: string; score: number }[];
type Msg = { from: "bot" | "user"; text: string; trace?: Trace; engine?: "semantic" | "lexical"; actions?: Action[] };
type Status = "idle" | "loading" | "ready" | "error";

const SUGGESTIONS = ["Why should we hire Armaan?", "Tell me about the churn model", "/resume", "/hire"];
const THRESHOLD = { semantic: 0.32, lexical: 0.1 };
const GREETING = /^(hi|hey|hello|yo|hola|namaste|sup|good (morning|evening|afternoon))\b/i;
const THANKS = /^(thanks|thank you|thx|cool|nice|great|ok|okay)\b/i;
const WELCOME: Msg = {
  from: "bot",
  text: "Hi, I'm a small AI model running entirely in your browser. Ask me anything about Armaan, or give me a job: type / to see commands like /resume and /hire.",
};

const linkify = (text: string) =>
  text.split(/(https?:\/\/[^\s,]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g).map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const url = part.replace(/[.)]$/, "");
      return <a key={i} href={url} target="_blank" rel="noreferrer">{url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>;
    }
    if (/@/.test(part) && /\./.test(part)) return <a key={i} href={`mailto:${part}`}>{part}</a>;
    return part;
  });

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const worker = useRef<Worker | null>(null);
  const pending = useRef(new Map<number, (s: Record<number, number> | null) => void>());
  const seq = useRef(0);
  const panel = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  // Boot the embedding engine the first time the chat is opened
  useEffect(() => {
    if (!open || worker.current) return;
    preloadResume();
    setStatus("loading");
    const w = new Worker(new URL("../lib/chat/engine.worker.ts", import.meta.url), { type: "module" });
    worker.current = w;
    w.onmessage = (e) => {
      const m = e.data;
      if (m.type === "progress") setProgress(m.progress);
      else if (m.type === "ready") setStatus("ready");
      else if (m.type === "result") { pending.current.get(m.id)?.(m.scores); pending.current.delete(m.id); }
      else if (m.type === "error") {
        if (m.id !== undefined) { pending.current.get(m.id)?.(null); pending.current.delete(m.id); }
        else setStatus("error");
      }
    };
    w.onerror = () => setStatus("error");
    const docs = knowledge.flatMap((k, owner) => [k.q, `${k.q} ${k.a}`, ...(k.alt ?? [])].map((text) => ({ owner, text })));
    w.postMessage({ type: "init", docs });
  }, [open]);

  useEffect(() => () => worker.current?.terminate(), []);

  // Ctrl/Cmd+K or "/" anywhere on the page opens the chat as a command line
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
        if (e.key === "/") setInput("/");
        setTimeout(() => field.current?.focus(), 60);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || !panel.current) return;
    field.current?.focus();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      gsap.fromTo(panel.current, { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.6)" });
  }, [open]);

  useEffect(() => {
    const el = log.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    const last = el.querySelector(".msg:last-child");
    if (last && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      gsap.fromTo(last, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
  }, [msgs, busy]);

  const ask = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      setInput("");

      // 1 · commands: run synchronously inside the click/keypress so the browser allows downloads and mail drafts
      const post = (r: CommandResult) => setMsgs((m) => [...m, { from: "bot", ...r }]);
      const result = runCommand(text, post);
      if (result === "clear") return setMsgs([WELCOME]);
      setMsgs((m) => [...m, { from: "user", text }]);
      if (result) return post(result);

      // 2 · small talk
      if (GREETING.test(text) && text.split(" ").length < 4)
        return post({ text: "Hey! Ask me about Armaan's projects, skills, hackathons or leadership, or type /help to see what I can do for you." });
      if (THANKS.test(text) && text.split(" ").length < 4)
        return post({ text: "Anytime. Anything else you'd like to know about Armaan?" });

      // 3 · retrieval over Armaan's fact sheet
      setBusy(true);
      let engine: "semantic" | "lexical" = "lexical";
      let scores: Record<number, number> | null = null;
      if (status === "ready" && worker.current) {
        const id = ++seq.current;
        scores = await new Promise((res) => {
          pending.current.set(id, res);
          worker.current!.postMessage({ type: "query", id, text });
        });
        if (scores) engine = "semantic";
      }
      if (!scores) scores = lexicalScores(text);

      const ranked = Object.entries(scores).map(([i, s]) => ({ i: +i, s })).sort((a, b) => b.s - a.s);
      const top = ranked[0];
      const trace = ranked.slice(0, 3).map((r) => ({ q: knowledge[r.i].q, score: Math.max(0, r.s) }));
      let answer: string;
      let actions: Action[] | undefined;
      if (!top || top.s < THRESHOLD[engine]) {
        answer = `I only know what's in Armaan's portfolio data, and I couldn't find a confident match for that. Try asking about his projects, skills or experience, or email him at ${links.email}.`;
        actions = [{ label: "Show commands", cmd: "/help" }];
      } else {
        const fact = knowledge[top.i];
        answer = fact.a;
        const second = ranked[1];
        if (engine === "semantic" && second && second.s > 0.55 && top.s - second.s < 0.06) answer += "\n\n" + knowledge[second.i].a;
        // offer the obvious next step for the answer just given
        if (fact.id === "role" || fact.id === "edge") actions = [{ label: "Hire Armaan", cmd: "/hire" }, { label: "Download resume", cmd: "/resume" }];
        else if (fact.id === "contact") actions = [{ label: "Email him", cmd: "/email" }, { label: "Download resume", cmd: "/resume" }];
        else if (fact.id === "projects") actions = [{ label: "Go to projects", cmd: "/goto projects" }];
        else if (fact.id === "skills") actions = [{ label: "Open the skills map", cmd: "/goto skills" }];
      }
      setMsgs((m) => [...m, { from: "bot", text: answer, trace, engine, actions }]);
      setBusy(false);
    },
    [busy, status],
  );

  const statusLabel =
    status === "ready" ? "semantic engine ready · MiniLM-L6 · on-device"
    : status === "loading" ? `loading embedding model… ${progress}% · keyword mode meanwhile`
    : status === "error" ? "model unavailable · keyword mode"
    : "on-device";
  const palette = input.startsWith("/") ? COMMANDS.filter((c) => c.cmd.startsWith(input.toLowerCase().split(" ")[0])) : [];

  return (
    <div className="chat">
      {open && (
        <div className="chat-panel" ref={panel} role="dialog" aria-label="Ask about Armaan">
          <header>
            <div>
              <b>Ask Armaan&apos;s data</b>
              <span className={`mono chat-status ${status}`}><i />{statusLabel}</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>
          {status === "loading" && <div className="chat-bar"><span style={{ width: `${progress}%` }} /></div>}
          <div className="chat-log" ref={log} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                <p>{linkify(m.text)}</p>
                {m.actions && (
                  <div className="msg-actions">
                    {m.actions.map((a) => <button key={a.cmd + a.label} onClick={() => ask(a.cmd)}>{a.label}</button>)}
                  </div>
                )}
                {m.trace && (
                  <details className="trace">
                    <summary className="mono">retrieval trace · {m.engine === "semantic" ? "cosine similarity" : "tf-idf"}</summary>
                    <ul>
                      {m.trace.map((t) => (
                        <li key={t.q}>
                          <span>{t.q}</span>
                          <i><b style={{ width: `${Math.min(100, t.score * 100)}%` }} /></i>
                          <em className="mono">{t.score.toFixed(2)}</em>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ))}
            {busy && <div className="msg bot typing"><p><i /><i /><i /></p></div>}
          </div>
          {palette.length > 0 ? (
            <ul className="chat-palette" aria-label="Commands">
              {palette.map((c) => (
                <li key={c.cmd}>
                  <button onClick={() => ask(c.cmd)}><b className="mono">{c.cmd}</b><span>{c.hint}</span></button>
                </li>
              ))}
            </ul>
          ) : (
            msgs.length < 3 && (
              <div className="chat-suggest">
                {SUGGESTIONS.map((s) => <button key={s} className={s.startsWith("/") ? "cmd" : ""} onClick={() => ask(s)}>{s}</button>)}
              </div>
            )
          )}
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }}>
            <input ref={field} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question, or type / for commands" aria-label="Your question or command" maxLength={300} />
            <button className="btn primary small" type="submit" disabled={busy || !input.trim()}>Send</button>
          </form>
          <p className="chat-foot mono">Runs locally with Transformers.js · nothing you type leaves your browser</p>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close chat" : "Ask a question about Armaan"}>
        <svg viewBox="0 0 48 24" aria-hidden="true">
          <path d="M2 12 C6 2 10 2 14 12 S22 22 26 12 S34 2 38 12 S44 20 46 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span>{open ? "Close" : "Ask my data"}</span>
        {!open && <kbd className="mono">/</kbd>}
      </button>
    </div>
  );
}
