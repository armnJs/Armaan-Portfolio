import { knowledge } from "../knowledge";

/** TF-IDF cosine fallback: answers instantly while the embedding model loads, or if it can't. */
const STOP = new Set(
  "a an the is are was were be been do does did has have had of in on at to for with and or but not his her him he she it its this that what which who whom how why where when why we us our can could would should i you me my your about tell armaan mangaonkar s".split(" "),
);
const tokens = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9₹.+ ]/g, " ").split(/\s+/)
    .map((t) => t.replace(/\.$/, "").replace(/(ies)$/, "y").replace(/([^s])s$/, "$1"))
    .filter((t) => t.length > 1 && !STOP.has(t));

const docs = knowledge.map((k) => tokens([k.q, ...(k.alt ?? []), k.a].join(" ")));
const heads = knowledge.map((k) => tokens([k.q, ...(k.alt ?? [])].join(" ")));
const df = new Map<string, number>();
docs.forEach((d) => new Set(d).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
const idf = (t: string) => Math.log(1 + docs.length / (1 + (df.get(t) ?? 0)));
const vec = (toks: string[]) => {
  const v = new Map<string, number>();
  toks.forEach((t) => v.set(t, (v.get(t) ?? 0) + idf(t)));
  return v;
};
const norm = (v: Map<string, number>) => Math.sqrt([...v.values()].reduce((s, x) => s + x * x, 0)) || 1;
const docVecs = docs.map(vec);
const docNorms = docVecs.map(norm);
const headVecs = heads.map(vec);
const headNorms = headVecs.map(norm);

export function lexicalScores(query: string): Record<number, number> {
  const q = vec(tokens(query));
  const qn = norm(q);
  const out: Record<number, number> = {};
  const cos = (d: Map<string, number>, dn: number) => {
    let s = 0;
    q.forEach((w, t) => { const x = d.get(t); if (x) s += w * x; });
    return s / (qn * dn);
  };
  // a match on the question and its phrasings counts for more than one buried in the answer text
  docVecs.forEach((d, i) => { out[i] = Math.max(cos(d, docNorms[i]), cos(headVecs[i], headNorms[i])); });
  return out;
}
