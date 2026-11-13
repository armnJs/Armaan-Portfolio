import { links } from "./data";

/**
 * Single source of truth for everything the site says about Armaan in Q&A form.
 * Feeds: the local chatbot (retrieval), the visible FAQ, FAQPage JSON-LD and /llms.txt.
 */
export type Fact = { id: string; q: string; alt?: string[]; a: string; faq?: boolean };

export const knowledge: Fact[] = [
  {
    id: "who",
    q: "Who is Armaan Mangaonkar?",
    alt: ["tell me about armaan", "introduce yourself", "about him", "summary", "bio"],
    a: "Armaan Mangaonkar is a data analyst and aspiring data scientist from Goregaon, Mumbai. He is studying B.Sc. Data Science at M.L. Dahanukar College (2024–2027) and builds churn models, BI dashboards, AI agents and full-stack analytics apps. In his own words, he turns messy, unstructured data into dashboards that drive action.",
    faq: true,
  },
  {
    id: "role",
    q: "What role is Armaan looking for?",
    alt: ["is he available for hire", "open to work", "internship", "job", "hiring", "career goals", "where does he see himself"],
    a: "Armaan is looking for a Data Analyst role or internship right now, ideally at a big tech company or MNC, a gaming or esports company, or an automotive company. Long term he is aiming for Senior Data Scientist. His dream companies are Google, Mahindra and Deloitte.",
    faq: true,
  },
  {
    id: "skills",
    q: "What are Armaan's technical skills?",
    alt: ["tech stack", "tools", "programming languages", "what does he know", "python sql power bi"],
    a: "Core stack: Python (Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn), SQL (T-SQL, PostgreSQL), Power BI, Tableau and Advanced Excel. For building he uses FastAPI, Flask, Next.js, the Google Gemini AI SDK, Playwright and WebSockets. On the analytics side: EDA, data wrangling, feature engineering, classification models and churn analysis.",
    faq: true,
  },
  {
    id: "churn",
    q: "What is the Customer Churn ML Pipeline project?",
    alt: ["churn model", "machine learning project", "random forest", "roc auc", "recall", "retention"],
    a: "An end-to-end machine learning pipeline on 2,500 customer records that predicts who is about to leave. Armaan compared Logistic Regression, Decision Tree and Random Forest, handled class imbalance with balanced class weights, and the Random Forest reached 0.807 ROC-AUC and 74.7% recall. Key findings: monthly-contract customers churn at about 38% versus 10% on annual plans, and customers with more than 4 support calls carry 3x the churn risk. Code: https://github.com/armnJs/Customer-churn-analysis",
    faq: true,
  },
  {
    id: "clinkt",
    q: "What did Armaan build at VibeHack for Clinkt?",
    alt: ["revenue recovery", "onlybugs", "cart abandonment", "84.8k", "e-commerce analytics", "hackathon project"],
    a: "At VibeHack, with Team OnlyBugs, Armaan ran a root-cause investigation into an e-commerce storefront called Clinkt across 1,100+ product-days. He traced ₹84.8k of lost revenue to a 70.5% cart abandonment rate and 60.7% sub-optimal stock days, then built a demand-signal reorder-point model, a category re-weighting matrix and a live revenue recovery simulator. Live: https://only-bugs-clinkt-repo.vercel.app/",
    faq: true,
  },
  {
    id: "caffeine",
    q: "What is the Caffeine Intake dashboard project?",
    alt: ["first project", "favourite project", "proudest project", "tableau dashboard", "streamlit"],
    a: "Caffeine Intake was Armaan's first data project and is still the one he is proudest of. He cleaned multi-demographic caffeine data with Pandas and Excel and built interactive dashboards relating daily intake to focus levels and sleep quality. Code: https://github.com/armnJs/Caffiene-Intake-Dashboard",
  },
  {
    id: "sentinel",
    q: "What is Sentinel Guard AI?",
    alt: ["cybersecurity project", "tln hackathon", "phishing", "threat radar", "gemini security agent"],
    a: "Sentinel Guard AI is a zero-trust cyber threat radar and phishing defence prototype Armaan built for the TLN Cybersecurity Challenge. It includes a SOC console, a deepfake voice scam analyzer, a brand impersonation inspector, an HTTP security header auditor, a 52-scenario Phish Hunt sandbox, a Suricata/YARA playbook generator and an embedded Gemini security agent. Live: https://sentinel-guard-ai-delta.vercel.app/",
  },
  {
    id: "formfiller",
    q: "What is the Autonomous AI Form Filler Agent?",
    alt: ["ai agent", "agentic ai", "playwright automation", "coolest automation", "what has he automated"],
    a: "It is an AI web-automation agent built with FastAPI, Playwright, the Gemini AI SDK and WebSockets. It parses dynamic web forms and fills each field from a user persona. Armaan's definition of agentic AI: not a bot that chats, but one that actually gets your work done. He also automates workflows with Google Apps Script.",
  },
  {
    id: "revvheadz",
    q: "What is Revvheadz / VirtualGarage?",
    alt: ["vehicle project", "car project", "garage app", "expense tracker", "automotive project"],
    a: "Revvheadz (originally VirtualGarage) is a virtual twin of your real-world garage: it tracks vehicle expenses, maintenance cycles and budget breakdowns. Armaan plans to scale it with predictive maintenance and vehicle telemetry analytics. Live: https://revvheadz.vercel.app/",
  },
  {
    id: "petrolradar",
    q: "What is PetrolRadar?",
    alt: ["fuel price prediction", "fuel station tracker", "next.js postgres project", "forecasting project"],
    a: "PetrolRadar is a full-stack fuel station tracker with CSV ingestion and fuel price and demand prediction. It combines a Next.js and TypeScript front end, a PostgreSQL schema and Python predictive modelling scripts. Live: https://petrol-radar.vercel.app/",
  },
  {
    id: "projects",
    q: "What projects has Armaan built?",
    alt: ["list projects", "portfolio projects", "show me his work", "best projects", "what has he made"],
    a: "Seven featured builds: the Customer Churn ML Pipeline (0.807 ROC-AUC), Clinkt Revenue Recovery (₹84.8k leak diagnosed at VibeHack), Caffeine Intake Dashboards, Sentinel Guard AI (TLN Cybersecurity Challenge), the Autonomous AI Form Filler Agent, Revvheadz / VirtualGarage and PetrolRadar. Ask about any one of them for details.",
  },
  {
    id: "hackathons",
    q: "Which hackathons has Armaan competed in?",
    alt: ["competitions", "vibehack", "tln", "hackathon experience"],
    a: "Two so far: VibeHack with Team OnlyBugs, where he diagnosed ₹84.8k of lost revenue for Clinkt, and the TLN Cybersecurity Challenge, where he built and deployed Sentinel Guard AI. Hackathons and deadlines are his second-favourite way to learn, right after building projects.",
  },
  {
    id: "leadership",
    q: "What leadership experience does Armaan have?",
    alt: ["nexus arena", "esports tournament", "shoutcasting", "rotaract", "public speaking", "event organizer", "team lead"],
    a: "Armaan conceptualized and organized Nexus Arena, a college BGMI esports tournament with 24 squads and 20 solo players (115+ players), and shoutcast it live. He is Director of Administration at the Rotaract Club of ML Dahanukar, where he improved operational efficiency by 35%. He was also Technical Lead for 80+ participants at Social Sutra and Security Lead for 200+ attendees at GlamNGlitz.",
    faq: true,
  },
  {
    id: "education",
    q: "Where does Armaan study?",
    alt: ["education", "college", "degree", "cgpa", "university", "qualification"],
    a: "Armaan is pursuing a B.Sc. in Data Science at M.L. Dahanukar College, Mumbai (2024–2027), with a CGPA of 7.4 / 10.",
  },
  {
    id: "certs",
    q: "What certifications does Armaan have?",
    alt: ["certificates", "courses", "forage", "tata", "deloitte"],
    a: "GenAI Powered Data Analytics from Tata Group (Forage, June 2026) and the Data Analytics Job Simulation from Deloitte Australia (Forage, May 2026). He is preparing for the Power BI PL-300 certification.",
  },
  {
    id: "learning",
    q: "What is Armaan learning right now?",
    alt: ["currently learning", "next skills", "deep learning", "pl-300", "roadmap", "n8n rag"],
    a: "Right now: advanced Python data visualization (Plotly, Seaborn) and Power BI PL-300 prep. Next up: deep learning with PyTorch or TensorFlow, advanced SQL and data engineering, and deeper statistics. He is also exploring RAG, LLM implementation and n8n.",
  },
  {
    id: "edge",
    q: "Why should a company hire Armaan?",
    alt: ["what makes him different", "usp", "strengths", "why him", "unique"],
    a: "Three things: he learns and adapts fast when the stack or the project phase changes; he ships live apps rather than notebooks (analytics plus full-stack); and he leads, having run a 115-player esports tournament and a club's administration. He can present the numbers, not just crunch them.",
    faq: true,
  },
  {
    id: "process",
    q: "How does Armaan approach a data project?",
    alt: ["workflow", "process", "how does he work", "what does he enjoy", "eda", "data cleaning"],
    a: "Wrangle, explore, visualise, decide. His favourite parts, in order, are cleaning and wrangling messy data, EDA to find the “aha” pattern, and building dashboards. He learned to keep systems focused after over-engineering an offline file converter and rebuilding it from scratch.",
  },
  {
    id: "personality",
    q: "What is Armaan like as a person?",
    alt: ["personality", "mbti", "entj", "work style", "character", "three words"],
    a: "ENTJ (Commander). In three words: learner, explorer, adaptable. Friends would say helper, healthy competitor and good team player. He is a night owl who locks in at 3 AM, thinks big-picture and logic-first, prefers team energy, and would rather ship it and fix it later. One word for his future: relentless.",
  },
  {
    id: "interests",
    q: "What does Armaan do outside of data?",
    alt: ["hobbies", "interests", "cars", "bikes", "gaming", "free time", "dream car", "music", "coffee"],
    a: "Driving and riding come first: he drives a Maruti Suzuki SX4, and dreams of a BMW M340i, a Toyota Fortuner and a KTM 390 Duke. He also plays racing games and BGMI, hits the gym, runs on coffee and phonk, and rewatches Ford v Ferrari and Initial D. If he weren't in tech he'd be a test driver or an esports caster.",
  },
  {
    id: "domains",
    q: "Which data domains interest Armaan most?",
    alt: ["industry", "automotive data", "esports analytics", "what kind of data", "next project", "engine analysis"],
    a: "Automotive and mobility data first, then sports and esports analytics, healthcare and nutrition, and business or product analytics. The next project he wants to build is dynamic vehicle engine behaviour analysis.",
  },
  {
    id: "ai",
    q: "How does Armaan use AI?",
    alt: ["ai tools", "chatgpt", "claude", "gemini", "ai orchestrator", "view on ai"],
    a: "He calls himself an AI orchestrator: he uses ChatGPT, Claude and Gemini, coding agents like Cursor and Claude Code, and the Google Gemini SDK in his own builds. His view is that AI is a super-tool that makes him far faster, that it still needs human judgment, and that it will change every job, so he wants to be ahead of it.",
  },
  {
    id: "contact",
    q: "How can I contact Armaan?",
    alt: ["email", "linkedin", "github", "reach out", "get in touch", "resume", "cv", "download resume"],
    a: `Email ${links.email}, LinkedIn ${links.linkedin}, GitHub ${links.github}. His resume can be downloaded from the Pit Stop section at the bottom of this page.`,
    faq: true,
  },
  {
    id: "location",
    q: "Where is Armaan based?",
    alt: ["location", "city", "country", "mumbai", "remote", "relocate"],
    a: "Armaan is based in Goregaon, Mumbai, Maharashtra, India.",
  },
  {
    id: "bot",
    q: "How does this chatbot work?",
    alt: ["are you an ai", "what model", "is this chatgpt", "is my data sent anywhere", "is anything I type uploaded to a server", "do you store my messages", "privacy", "how do you work"],
    a: "This assistant runs entirely in your browser. It uses Transformers.js to load a small sentence-embedding model (all-MiniLM-L6-v2), turns your question into a vector and retrieves the closest fact about Armaan by cosine similarity. Nothing you type leaves your device, and it only answers from Armaan's own data.",
  },
];

export const faqs = knowledge.filter((k) => k.faq);
