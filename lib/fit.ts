/*
  Role-Fit engine. Fully local and deterministic: no network, nothing leaves the browser.
  1. Read the JD → find every skill it asks for, weigh each by frequency and "must / nice-to-have" wording.
  2. Compare against the profile map below (levels + evidence taken from the real projects / resume).
  3. Score coverage, adjust for seniority, and bucket the result.
*/

export type Level = 0 | 1 | 2 | 3; // 0 none · 1 learning/adjacent · 2 working · 3 strong, shipped

type Skill = { id: string; label: string; level: Level; evidence: string; terms: string[]; family: Family[] };
type Family = "analyst" | "bi" | "ml" | "ai" | "web" | "eng" | "lead";

/* Profile map. `evidence` is what gets shown back to the recruiter, so it must stay true. */
const SKILLS: Skill[] = [
  { id: "python", label: "Python", level: 3, family: ["analyst", "ml", "ai", "eng"], terms: ["python"], evidence: "Primary language across the churn pipeline, Form Filler agent and PetrolRadar models" },
  { id: "pandas", label: "Pandas / NumPy", level: 3, family: ["analyst", "ml"], terms: ["pandas", "numpy", "data manipulation", "data wrangling", "data cleaning", "data cleansing", "data preparation"], evidence: "Cleaned 2,500 churn records and 1,100+ product-days of Clinkt logs" },
  { id: "sql", label: "SQL", level: 2, family: ["analyst", "bi", "eng"], terms: ["sql", "t-sql", "tsql", "postgresql", "postgres", "mysql", "ssms", "relational database", "queries"], evidence: "T-SQL and PostgreSQL; designed the PetrolRadar schema with CSV ingestion" },
  { id: "excel", label: "Advanced Excel", level: 3, family: ["analyst", "bi"], terms: ["excel", "spreadsheet", "spreadsheets", "pivot table", "pivot tables", "vlookup", "xlookup", "google sheets"], evidence: "Advanced Excel plus openpyxl-generated workbooks" },
  { id: "powerbi", label: "Power BI", level: 2, family: ["bi", "analyst"], terms: ["power bi", "powerbi", "dax", "power query"], evidence: "Working knowledge, actively preparing for PL-300" },
  { id: "tableau", label: "Tableau", level: 2, family: ["bi", "analyst"], terms: ["tableau", "looker", "qlik", "metabase", "bi tools", "bi tool", "business intelligence"], evidence: "Built the Caffeine Intake interactive dashboards" },
  { id: "dashboards", label: "Dashboards & data viz", level: 3, family: ["bi", "analyst"], terms: ["dashboard", "dashboards", "data visualization", "data visualisation", "data viz", "visualization", "visualisation", "matplotlib", "seaborn", "plotly", "chart.js", "reporting"], evidence: "Caffeine dashboards, Clinkt revenue simulator, Sentinel Guard console" },
  { id: "eda", label: "EDA & insight generation", level: 3, family: ["analyst", "ml"], terms: ["eda", "exploratory data analysis", "exploratory analysis", "insights", "insight", "root cause", "root-cause", "data analysis", "analyze data", "analyse data", "analytical"], evidence: "Traced ₹84.8k revenue leak to 70.5% cart abandonment through root-cause funnel analysis" },
  { id: "storytelling", label: "Data storytelling", level: 3, family: ["analyst", "bi", "lead"], terms: ["storytelling", "data storytelling", "present findings", "communicate insights", "stakeholder communication", "executive summary", "presentations"], evidence: "Deloitte job-simulation executive storytelling; live shoutcasting and pitching" },
  { id: "ml", label: "Machine learning", level: 3, family: ["ml", "ai"], terms: ["machine learning", "scikit-learn", "sklearn", "classification", "random forest", "predictive model", "predictive modeling", "predictive modelling", "supervised", "regression", "model training", "ml models"], evidence: "Churn pipeline: Random Forest at 0.807 ROC-AUC and 74.7% recall" },
  { id: "featureeng", label: "Feature engineering", level: 2, family: ["ml"], terms: ["feature engineering", "feature selection", "class imbalance", "model evaluation", "cross-validation", "hyperparameter"], evidence: "Balanced class weights and model comparison in the churn pipeline" },
  { id: "stats", label: "Statistics", level: 2, family: ["analyst", "ml"], terms: ["statistics", "statistical", "hypothesis testing", "a/b test", "a/b testing", "ab testing", "probability", "correlation"], evidence: "Applied in churn risk analysis; deepening it as a current priority" },
  { id: "forecasting", label: "Forecasting", level: 2, family: ["ml", "analyst"], terms: ["forecasting", "forecast", "time series", "time-series", "demand prediction", "demand planning"], evidence: "PetrolRadar price and demand prediction scripts" },
  { id: "genai", label: "GenAI / LLM apps", level: 3, family: ["ai"], terms: ["generative ai", "genai", "gen ai", "llm", "llms", "large language model", "large language models", "gemini", "openai", "chatgpt", "prompt engineering", "prompting", "claude"], evidence: "Gemini-powered Sentinel Guard agent and Form Filler; Tata GenAI analytics certificate" },
  { id: "agents", label: "AI agents & automation", level: 3, family: ["ai", "eng"], terms: ["ai agent", "ai agents", "agentic", "agents", "autonomous agent", "workflow automation", "automation", "automate", "automated", "playwright", "selenium", "rpa", "apps script"], evidence: "Playwright + Gemini form-filling agent; Apps Script workflows" },
  { id: "rag", label: "RAG / vector search", level: 1, family: ["ai"], terms: ["rag", "retrieval augmented", "retrieval-augmented", "vector database", "vector db", "embeddings", "pinecone", "chroma", "langchain", "llamaindex"], evidence: "Exploring now; this portfolio's own chat runs local embeddings (Transformers.js)" },
  { id: "n8n", label: "n8n / orchestration", level: 1, family: ["ai", "eng"], terms: ["n8n", "zapier", "make.com", "airflow", "orchestration"], evidence: "Learning n8n" },
  { id: "dl", label: "Deep learning", level: 1, family: ["ml", "ai"], terms: ["deep learning", "pytorch", "tensorflow", "keras", "neural network", "neural networks", "nlp", "computer vision", "transformers"], evidence: "Next on the learning path (PyTorch / TensorFlow)" },
  { id: "fastapi", label: "FastAPI / Flask", level: 3, family: ["eng", "web", "ai"], terms: ["fastapi", "flask", "django", "rest api", "rest apis", "api development", "backend", "websocket", "websockets"], evidence: "FastAPI + WebSocket streaming backend for the Form Filler agent" },
  { id: "js", label: "JavaScript / TypeScript", level: 3, family: ["web", "eng"], terms: ["javascript", "typescript", "node.js", "nodejs", "node"], evidence: "Sentinel Guard AI, Revvheadz (TypeScript), PetrolRadar" },
  { id: "react", label: "React / Next.js", level: 3, family: ["web", "eng"], terms: ["react", "react.js", "reactjs", "next.js", "nextjs", "frontend", "front-end", "front end"], evidence: "Revvheadz (React) and PetrolRadar (Next.js); this portfolio is Next.js" },
  { id: "html", label: "HTML / CSS", level: 3, family: ["web"], terms: ["html", "html5", "css", "css3", "responsive design", "tailwind"], evidence: "Hand-built UIs across every web project" },
  { id: "git", label: "Git / GitHub", level: 3, family: ["eng", "web"], terms: ["git", "github", "version control", "gitlab", "ci/cd"], evidence: "All projects shipped through GitHub and Vercel" },
  { id: "deploy", label: "Deployment (Vercel)", level: 2, family: ["eng", "web"], terms: ["vercel", "deployment", "deploy", "deployed", "hosting", "netlify"], evidence: "Four projects live on Vercel" },
  { id: "datapipe", label: "Data pipelines / ETL", level: 2, family: ["eng", "analyst"], terms: ["etl", "elt", "data pipeline", "data pipelines", "pipeline", "pipelines", "data ingestion", "data engineering", "data modeling", "data modelling"], evidence: "End-to-end churn pipeline; CSV ingestion into PostgreSQL in PetrolRadar" },
  { id: "cloud", label: "Cloud (AWS / Azure / GCP)", level: 0, family: ["eng"], terms: ["aws", "azure", "gcp", "google cloud", "cloud", "snowflake", "bigquery", "redshift", "databricks", "spark", "pyspark", "hadoop", "kafka", "dbt"], evidence: "" },
  { id: "docker", label: "Docker / Kubernetes", level: 0, family: ["eng"], terms: ["docker", "kubernetes", "k8s", "terraform", "mlops", "mlflow"], evidence: "" },
  { id: "r", label: "R", level: 0, family: ["analyst"], terms: ["r programming", "r language", "rstudio", "r/python", "python/r", "r, python", "python, r"], evidence: "" },
  { id: "sas", label: "SAS / SPSS", level: 0, family: ["analyst"], terms: ["sas", "spss", "stata", "matlab"], evidence: "" },
  { id: "leadership", label: "Leadership & coordination", level: 3, family: ["lead"], terms: ["leadership", "team lead", "lead a team", "stakeholder", "stakeholders", "project management", "coordination", "cross-functional", "mentoring", "event management", "ownership", "initiative"], evidence: "Led Rotaract admin (35% ops efficiency gain) and a 115+ player live esports event" },
  { id: "comms", label: "Communication & public speaking", level: 3, family: ["lead", "analyst"], terms: ["communication", "communication skills", "public speaking", "presentation skills", "verbal", "written communication", "collaborat", "teamwork", "team player"], evidence: "Live shoutcaster and pitch speaker at hackathons" },
  { id: "learn", label: "Fast learner / adaptable", level: 3, family: ["lead"], terms: ["fast learner", "quick learner", "adaptable", "adaptability", "self-starter", "self starter", "curious", "curiosity", "fast-paced", "fast paced", "problem solving", "problem-solving"], evidence: "Shipped two hackathon builds inside their windows (VibeHack, TLN)" },
  { id: "cyber", label: "Security awareness", level: 2, family: ["ai", "eng"], terms: ["cybersecurity", "security", "soc", "threat", "phishing", "siem"], evidence: "Sentinel Guard AI: zero-trust threat radar, Suricata/YARA playbooks" },
];

const FAMILIES: Record<string, { label: string; terms: string[]; fam: Family; prior: number }> = {
  analyst: { label: "Data Analyst", terms: ["data analyst", "business analyst", "analytics", "insights analyst", "reporting analyst", "decision analyst"], fam: "analyst", prior: 0 },
  bi: { label: "BI / Dashboard", terms: ["bi developer", "bi analyst", "power bi", "tableau", "business intelligence"], fam: "bi", prior: 0 },
  ml: { label: "Data Science / ML", terms: ["data scientist", "machine learning engineer", "ml engineer", "data science", "applied scientist"], fam: "ml", prior: -4 },
  ai: { label: "AI / Automation", terms: ["ai engineer", "automation engineer", "llm", "generative ai", "agent", "prompt engineer", "ai developer"], fam: "ai", prior: 2 },
  web: { label: "Web / Full-stack", terms: ["frontend", "front-end", "full stack", "full-stack", "web developer", "software engineer", "react developer"], fam: "web", prior: -2 },
  eng: { label: "Data / Backend Engineering", terms: ["data engineer", "backend", "back-end", "platform engineer", "devops"], fam: "eng", prior: -8 },
};

export type Hit = { label: string; evidence: string; level: Level; weight: number; mentions: number; required: boolean };
export type FitResult = {
  score: number; // 0-100
  verdict: string;
  roleGuess: string;
  summary: string;
  strong: Hit[];
  adjacent: Hit[];
  lowPriority: (Hit & { why: string })[];
  matched: number;
  asked: number;
  notes: string[];
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const re = (t: string) => new RegExp(`(?<![a-z0-9+#])${esc(t)}(?![a-z0-9+#])`, "g");
const REQ = /(must|required|requirement|essential|mandatory|proficien|strong|expert|hands-on|experience (in|with)|responsib|you will|you'll|minimum|qualifications)/;
const NICE = /(preferred|nice to have|nice-to-have|bonus|plus\b|good to have|familiarity|exposure|desirable|an advantage|a plus|optional|would be great)/;

export function analyse(jdRaw: string): FitResult | null {
  const jd = jdRaw.toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
  if (jd.split(" ").length < 12) return null;

  // sentence-level context so "preferred: Spark" doesn't weigh like "must know SQL"
  const sentences = jdRaw.toLowerCase().split(/[\n.;•·]|\s-\s|(?<=\s)\*\s/).map((s) => s.trim()).filter(Boolean);
  const nthTop = Math.max(6, Math.floor(sentences.length * 0.35));
  const hits: (Hit & { id: string; skill: Skill })[] = [];

  for (const sk of SKILLS) {
    let mentions = 0, req = 0, nice = 0, early = 0;
    sentences.forEach((s, i) => {
      let m = 0;
      for (const t of sk.terms) m += (s.match(re(t)) || []).length;
      if (!m) return;
      mentions += m;
      if (NICE.test(s)) nice++; else if (REQ.test(s)) req++;
      if (i < nthTop) early++;
    });
    if (!mentions) continue;
    let w = 1 + Math.min(mentions - 1, 3) * 0.45 + (req ? 0.9 : 0) + (early ? 0.25 : 0);
    if (nice && !req) w = Math.max(0.35, w * 0.45);
    hits.push({ id: sk.id, skill: sk, label: sk.label, evidence: sk.evidence, level: sk.level, weight: w, mentions, required: req > 0 && !nice });
  }

  if (!hits.length) return null;

  const total = hits.reduce((a, h) => a + h.weight, 0);
  const got = hits.reduce((a, h) => a + h.weight * (h.level / 3), 0);
  let cover = got / total; // 0..1

  // which role is this JD, and how natural a fit is it
  const fam = Object.values(FAMILIES)
    .map((f) => ({ f, n: f.terms.reduce((a, t) => a + (jd.match(re(t)) || []).length, 0) }))
    .sort((a, b) => b.n - a.n)[0];
  const role = fam && fam.n ? fam.f : null;

  let score = cover * 100;
  const notes: string[] = [];

  // seniority: a 5+ years ask is a stretch for a student; entry-level wording is the sweet spot
  const yrs = [...jd.matchAll(/(\d{1,2})\s*\+?\s*(?:-\s*\d{1,2}\s*)?(?:years|yrs)/g)].map((m) => +m[1]);
  const maxYrs = yrs.length ? Math.max(...yrs) : 0;
  const entry = /(intern|fresher|entry[- ]level|graduate|junior|trainee|associate|0-?\s?[12] years|apprentice)/.test(jd);
  if (entry) { score += 6; notes.push("Entry-level wording detected: right in the target window."); }
  else if (maxYrs >= 5) { score -= 16; notes.push(`The JD asks for ${maxYrs}+ years; that part would be a stretch, so the score is dampened.`); }
  else if (maxYrs >= 3) { score -= 8; notes.push(`The JD asks for ${maxYrs}+ years of experience; the projects partly offset it, but it's honest to flag.`); }

  if (role) score += role.prior;
  if (role && role.prior <= -4) notes.push(`${role.label} roles lean on depth Armaan is still building (deep learning, statistics), so they sit lower than analyst or AI-automation roles.`);

  // a thin JD can't justify a high-confidence number
  if (hits.length < 4) { score = Math.min(score, 72); notes.push("Few recognisable skills in this JD; paste the full description for a sharper read."); }

  score = Math.round(Math.max(8, Math.min(94, score)));

  const strong = hits.filter((h) => h.level === 3).sort((a, b) => b.weight - a.weight).slice(0, 8);
  const adjacent = hits.filter((h) => h.level === 1 || h.level === 2).sort((a, b) => b.weight - a.weight).slice(0, 8);

  const lowPriority = hits
    .filter((h) => h.level === 0 || (h.level === 1 && !h.required))
    .sort((a, b) => a.weight - b.weight)
    .slice(0, 8)
    .map((h) => {
      const learning = h.level === 1;
      const why = learning
        ? "Already on the learning path; a ramp-up item, not a blocker."
        : h.required
          ? "Named as a requirement but off the current path; strong adjacent tools (Python, SQL) shorten the ramp."
          : h.mentions === 1
            ? "Mentioned once and not framed as core to the role."
            : "Secondary to what the role is built around.";
      return { label: h.label, evidence: h.evidence, level: h.level, weight: h.weight, mentions: h.mentions, required: h.required, why };
    });

  const verdict = score >= 78 ? "Strong fit" : score >= 62 ? "Good fit" : score >= 45 ? "Partial fit" : "Stretch";
  const roleGuess = role ? role.label : "General technical role";
  const top = strong.slice(0, 3).map((h) => h.label).join(", ");
  const summary =
    score >= 62
      ? `The core of this ${roleGuess.toLowerCase()} JD lands on ground that's already shipped: ${top || "the main tools"} are all backed by live projects.`
      : score >= 45
        ? `Roughly half of what this JD weighs most is covered${top ? ` (${top})` : ""}; the rest is learnable on the job with adjacent skills.`
        : `Only a slice of this JD overlaps today${top ? ` (${top})` : ""}. Worth a conversation if the team values fast learning over a perfect checklist.`;

  return {
    score, verdict, roleGuess, summary, strong, adjacent, lowPriority,
    matched: hits.filter((h) => h.level >= 2).length, asked: hits.length, notes,
  };
}
