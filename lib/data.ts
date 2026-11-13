export const links = {
  email: "armaanshaikh0706@gmail.com",
  github: "https://github.com/armnJs",
  linkedin: "https://linkedin.com/in/armaan-mangaonkar",
  resume: "/resume/Armaan_Mangaonkar_Resume.pdf",
  resumeDA: "/resume/Armaan_Mangaonkar_DA_Resume.pdf",
};

export const thriveWords = ["Automation", "Insights", "Problem Solving", "Efficiency"];

export const heroMetrics = [
  { value: 84.8, decimals: 1, prefix: "₹", suffix: "k", label: "revenue leak diagnosed", sub: "Clinkt · VibeHack" },
  { value: 0.807, decimals: 3, prefix: "", suffix: "", label: "ROC-AUC", sub: "Churn Random Forest" },
  { value: 115, decimals: 0, prefix: "", suffix: "+", label: "players hosted live", sub: "Nexus Arena esports" },
  { value: 35, decimals: 0, prefix: "", suffix: "%", label: "ops efficiency gain", sub: "Rotaract admin" },
];

export type Tag = "ML" | "BI" | "AI" | "Web";
export type VizKind = "roc" | "funnel" | "dashboard" | "radar" | "agent" | "gauge" | "forecast";

export type Project = {
  id: string;
  title: string;
  kicker: string;
  tags: Tag[];
  viz: VizKind;
  stat: { value: string; label: string };
  problem: string;
  approach: string;
  result: string;
  stack: string[];
  github?: string;
  live?: string;
  wide?: boolean;
};

export const projects: Project[] = [
  {
    id: "churn",
    title: "Customer Churn ML Pipeline",
    kicker: "Machine learning · Retention",
    tags: ["ML"],
    viz: "roc",
    stat: { value: "0.807", label: "ROC-AUC" },
    problem: "2,500 customer records, and nobody could say who was about to leave or why.",
    approach:
      "End-to-end pipeline comparing Logistic Regression, Decision Tree and Random Forest, with class imbalance handled through balanced class weights.",
    result:
      "Random Forest reached 74.7% recall. Monthly-contract customers churn at ~38% vs 10% on annual plans, and 4+ support calls means 3x the risk. That became a 3-tier retention plan.",
    stack: ["Python", "Scikit-learn", "Pandas", "Seaborn", "Jupyter"],
    github: "https://github.com/armnJs/Customer-churn-analysis",
    wide: true,
  },
  {
    id: "clinkt",
    title: "Clinkt Revenue Recovery",
    kicker: "VibeHack · Team OnlyBugs",
    tags: ["BI", "Web"],
    viz: "funnel",
    stat: { value: "₹84.8k", label: "lost revenue traced" },
    problem: "An e-commerce storefront was bleeding revenue and the cause was buried in 1,100+ product-days of logs.",
    approach:
      "Root-cause funnel investigation, a demand-signal reorder-point model and a category re-weighting matrix, shipped with a live revenue recovery simulator.",
    result:
      "Traced the leak to 70.5% cart abandonment and 60.7% sub-optimal stock days, then rebuilt the storefront UI around the fix.",
    stack: ["Python", "Pandas", "Chart.js", "openpyxl", "Vercel"],
    github: "https://github.com/armnJs/OnlyBugs-clinkt-repo",
    live: "https://only-bugs-clinkt-repo.vercel.app/",
    wide: true,
  },
  {
    id: "caffeine",
    title: "Caffeine Intake Dashboards",
    kicker: "Where it all started",
    tags: ["BI"],
    viz: "dashboard",
    stat: { value: "#1", label: "foundational project" },
    problem: "Multi-demographic caffeine data that was too messy to say anything about focus or sleep.",
    approach: "Cleaned and reshaped it with Pandas and Excel, then built interactive dashboards on top.",
    result:
      "Dashboards relating daily intake to focus levels and sleep quality. My first project, and still the one I'm proudest of.",
    stack: ["Python", "Pandas", "Streamlit", "Tableau", "Seaborn"],
    github: "https://github.com/armnJs/Caffiene-Intake-Dashboard",
    wide: true,
  },
  {
    id: "sentinel",
    title: "Sentinel Guard AI",
    kicker: "TLN Cybersecurity Challenge",
    tags: ["AI", "Web"],
    viz: "radar",
    stat: { value: "52", label: "phishing scenarios" },
    problem: "Phishing and impersonation attacks move faster than a human SOC analyst can triage.",
    approach:
      "A zero-trust threat radar: SOC console, deepfake voice scam analyzer, brand impersonation inspector, header auditor and an embedded Gemini security agent.",
    result: "Deployed live on Vercel with a 52-scenario Phish Hunt sandbox and a Suricata/YARA playbook generator.",
    stack: ["JavaScript", "Chart.js", "Gemini API", "Vercel"],
    github: "https://github.com/armnJs/sentinel-guard-ai",
    live: "https://sentinel-guard-ai-delta.vercel.app/",
  },
  {
    id: "formfiller",
    title: "Autonomous AI Form Filler",
    kicker: "Agentic AI",
    tags: ["AI"],
    viz: "agent",
    stat: { value: "0", label: "fields typed by hand" },
    problem: "Filling the same dynamic web forms over and over is work a machine should do.",
    approach:
      "A FastAPI + Playwright agent that parses live forms and uses Gemini to answer each field from a user persona, streaming progress over WebSockets.",
    result: "An agent that doesn't just chat. It reads the page, decides, and gets the work done.",
    stack: ["Python", "FastAPI", "Gemini SDK", "Playwright", "WebSockets"],
  },
  {
    id: "revvheadz",
    title: "Revvheadz / VirtualGarage",
    kicker: "Automotive · Passion build",
    tags: ["Web"],
    viz: "gauge",
    stat: { value: "<50ms", label: "local state updates" },
    problem: "Vehicle expenses, service cycles and budgets live in scattered notes and memory.",
    approach:
      "A virtual twin of your real garage: expense tracking, maintenance cycles and budget breakdowns, complete with an ignition start overlay.",
    result: "Live now. Next on the roadmap: predictive maintenance and vehicle telemetry analytics.",
    stack: ["TypeScript", "React", "Node.js", "Vercel"],
    github: "https://github.com/armnJs/Revvheadz",
    live: "https://revvheadz.vercel.app/",
  },
  {
    id: "petrolradar",
    title: "PetrolRadar",
    kicker: "Mobility · Forecasting",
    tags: ["Web", "ML"],
    viz: "forecast",
    stat: { value: "3", label: "layers: web, SQL, models" },
    problem: "Fuel station data arrives as raw CSVs with no way to see where prices and demand are heading.",
    approach:
      "Next.js front end over a PostgreSQL schema with CSV ingestion, plus Python scripts for price and demand prediction.",
    result: "A full-stack station tracker that turns uploads into forecasts.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Python"],
    github: "https://github.com/armnJs/petrolRadar",
    live: "https://petrol-radar.vercel.app/",
  },
];

export const skillGroups = [
  { gear: "1", name: "Languages", items: ["Python", "Pandas", "NumPy", "Scikit-learn", "SQL (T-SQL, PostgreSQL)", "JavaScript", "HTML5 / CSS3"] },
  { gear: "2", name: "Data & BI", items: ["Power BI", "Tableau", "Advanced Excel", "SSMS", "Jupyter", "Matplotlib", "Seaborn"] },
  { gear: "3", name: "Analytics & DS", items: ["EDA", "Data wrangling", "Feature engineering", "Classification models", "Churn analysis", "Data storytelling"] },
  { gear: "4", name: "Frameworks & AI", items: ["FastAPI", "Flask", "Next.js", "Gemini AI SDK", "Playwright", "WebSockets"] },
  { gear: "5", name: "Automation & workflow", items: ["Google Apps Script", "AI coding agents", "Git / GitHub", "n8n (learning)"] },
  { gear: "6", name: "Leadership", items: ["Public speaking", "Live shoutcasting", "Event management", "Team leadership", "Stakeholder coordination"] },
];

export const raceLog = [
  {
    when: "Sep 2026",
    title: "VibeHack",
    role: "Team OnlyBugs",
    text: "Diagnosed ₹84.8k in lost revenue for Clinkt and shipped a live revenue recovery simulator with a re-engineered storefront.",
  },
  {
    when: "Sep 2026",
    title: "TLN Cybersecurity Challenge",
    role: "Sentinel Guard AI",
    text: "Built and deployed an enterprise threat radar with an embedded Gemini security agent inside the hackathon window.",
  },
  {
    when: "2025 → now",
    title: "Autonomous AI Form Filler",
    role: "Agent build",
    text: "FastAPI + Playwright + Gemini agent that parses dynamic web forms and fills them from persona context.",
  },
  {
    when: "Ongoing",
    title: "Apps Script automations",
    role: "Workflow",
    text: "Google Apps Script workflows that take the repetitive admin out of club and event operations.",
  },
];

export const nowItems = [
  { status: "NOW", title: "Advanced data viz in Python", note: "Plotly, Seaborn and interactive charting" },
  { status: "NOW", title: "Power BI PL-300", note: "Certification prep" },
  { status: "NEXT", title: "Deep Learning", note: "PyTorch / TensorFlow" },
  { status: "NEXT", title: "Advanced SQL & data engineering", note: "Beyond analyst-grade queries" },
  { status: "NEXT", title: "Statistics depth", note: "The maths under the models" },
  { status: "EXPLORING", title: "RAG, LLM implementation & n8n", note: "AI engineering and orchestration" },
];

export const certs = [
  { org: "Tata Group · Forage", title: "GenAI Powered Data Analytics", when: "Jun 2026", note: "GenAI workflows for data cleaning, EDA and insight generation." },
  { org: "Deloitte Australia · Forage", title: "Data Analytics Job Simulation", when: "May 2026", note: "Dataset quality auditing, dashboard design and executive data storytelling." },
  { org: "M.L. Dahanukar College", title: "B.Sc. Data Science", when: "2024 – 2027", note: "CGPA 7.4 / 10 · Mumbai" },
  { org: "Workshops", title: "AI Tools · Trade Smart (Market Analysis)", when: "Weekly", note: "Discipline workshops alongside the degree." },
];

export const specSheet = [
  ["Type", "ENTJ · Commander"],
  ["Mode", "Night owl, locked in at 3 AM"],
  ["Thinking", "Big picture, logic first"],
  ["Team role", "Captain who also builds it"],
  ["Shipping", "Ship it, fix later"],
  ["Driven by", "Curiosity and building cool stuff"],
  ["One word", "Relentless"],
];

export const beyond = [
  {
    icon: "wheel",
    title: "The garage",
    lines: [
      ["Daily", "Maruti Suzuki SX4"],
      ["Dream car", "BMW M340i / Fortuner"],
      ["Dream bike", "KTM 390 Duke"],
      ["Best road", "Any open highway"],
    ],
  },
  {
    icon: "mic",
    title: "The mic",
    lines: [
      ["Plays", "Racing games, BGMI"],
      ["Role", "Shoutcaster & organizer"],
      ["Dream combo", "Esports analytics"],
      ["Thrives on", "Chaos under pressure"],
    ],
  },
  {
    icon: "fuel",
    title: "The fuel",
    lines: [
      ["Drink", "Coffee, obviously"],
      ["Playlist", "Phonk / synthwave"],
      ["Watchlist", "Ford v Ferrari, Initial D"],
      ["Off-screen", "Gym, walks, friends"],
    ],
  },
];
