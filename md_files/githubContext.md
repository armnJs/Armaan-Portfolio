# GitHub Portfolio Summary: Armaan Mangaonkar (`armnJs`)

* **GitHub Profile:** [github.com/armnJs](https://github.com/armnJs)
* **Live Portfolio:** [armaan-mangaonkar.vercel.app](https://armaan-mangaonkar.vercel.app/)
* **Focus Areas:** Full-Stack Web Development, Data Science & Machine Learning, Cybersecurity Prototypes, and Automation/Desktop Tooling.

---

## Repository Index & Quick Overview

| Repository | Live Demo | Domain | Primary Tech Stack |
| :--- | :--- | :--- | :--- |
| **[automation](https://github.com/armnJs/automation)** | — | DevOps / GitHub Automation | Python (Stdlib), GitHub Actions, Shell/Batch |
| **[Revvheadz](https://github.com/armnJs/Revvheadz)** | [revvheadz.vercel.app](https://revvheadz.vercel.app/) | Full-Stack Web / Automotive | TypeScript, React, Node.js, Vercel |
| **[Customer-churn-analysis](https://github.com/armnJs/Customer-churn-analysis)** | — | Data Science & ML | Python, Jupyter, Scikit-Learn, Pandas, Seaborn |
| **[Essential-Tool](https://github.com/armnJs/Essential-Tool)** *(OmniConvert V2)* | [essential-tool.vercel.app](https://essential-tool.vercel.app/) | Desktop & Serverless Utility | Python, FastAPI, Mangum, Vanilla JS/CSS, Docker |
| **[sentinel-guard-ai](https://github.com/armnJs/sentinel-guard-ai)** | [sentinel-guard-ai-delta.vercel.app](https://sentinel-guard-ai-delta.vercel.app/) | Cybersecurity & AI | JavaScript (ES6+), HTML5/CSS3, Chart.js, Gemini API |
| **[Essential-Tool-V1](https://github.com/armnJs/Essential-Tool-V1)** *(OmniConvert V1)* | — | Local Desktop Utility | Python, FastAPI, Uvicorn, HTML5/CSS3/JS |
| **[OnlyBugs-clinkt-repo](https://github.com/armnJs/OnlyBugs-clinkt-repo)** | [only-bugs-clinkt-repo.vercel.app](https://only-bugs-clinkt-repo.vercel.app/) | E-Commerce Analytics & BI | Python (`pandas`, `openpyxl`), HTML/CSS/JS, Chart.js |
| **[petrolRadar](https://github.com/armnJs/petrolRadar)** | [petrol-radar.vercel.app](https://petrol-radar.vercel.app/) | Full-Stack Web & Analytics | Next.js, TypeScript, PostgreSQL (PLpgSQL), Python |
| **[Armaan-Portfolio](https://github.com/armnJs/Armaan-Portfolio)** | [armaan-mangaonkar.vercel.app](https://armaan-mangaonkar.vercel.app/) | Personal Portfolio | JavaScript, HTML/CSS |
| **[Caffiene-Intake-Dashboard](https://github.com/armnJs/Caffiene-Intake-Dashboard)** | — | Data Visualization | Python, Streamlit, Pandas, Seaborn, Matplotlib |
| **[starter-ds-template](https://github.com/armnJs/starter-ds-template)** | — | Data Science Boilerplate | Project Scaffolding / DS Workflow |
| **[armnJs](https://github.com/armnJs/armnJs)** | — | Profile Configuration | Markdown / GitHub Profile Config |
| **[build-your-own-x](https://github.com/armnJs/build-your-own-x)** *(Fork)* | — | Systems Learning Resource | Forked from `codecrafters-io/build-your-own-x` |

---

## Detailed Project Breakdown

### 1. [automation](https://github.com/armnJs/automation)
* **What it does:** A zero-dependency GitHub contribution graph automation and backfill engine (`5,664+` commits). Runs scheduled daily workflows via GitHub Actions at 09:00 AM IST, supports historical date backfilling (`src/backfill_engine.py`), and logs structured JSON/text telemetry.
* **Tech Stack:** Python (98.2%, standard library only), GitHub Actions YAML, Shell/Batch (`run_local.sh`, `run_local.bat`).

### 2. [Revvheadz](https://github.com/armnJs/Revvheadz)
* **What it does:** *"Virtual variant of your real world garage"* — A full-stack interactive personal garage web application featuring an ignition start overlay (`IgnitionOverlay.tsx`) and separated `client/` and `server/` modules.
* **Tech Stack:** TypeScript (53.8%), HTML (39.1%), JavaScript (6.3%), React/TSX, Vercel.

### 3. [Customer-churn-analysis](https://github.com/armnJs/Customer-churn-analysis)
* **What it does:** End-to-end ML pipeline analyzing 2,500 customer records to predict attrition and define a 3-tier retention intervention strategy. Evaluates Logistic Regression, Decision Tree, and a champion Random Forest model (**74.7% Recall**, **0.807 ROC-AUC**).
* **Tech Stack:** Jupyter Notebook (97%), Python (3%), Scikit-Learn, Pandas, NumPy, Matplotlib, Seaborn, `nbconvert`.

### 4. [Essential-Tool](https://github.com/armnJs/Essential-Tool) *(OmniConvert V2)*
* **What it does:** Cross-platform universal file converter supporting documents (PDF, DOCX, XLSX, IPYNB), images (PNG, WEBP, SVG, ICO), structured data (JSON, YAML, XML, SQL), audio/TTS, and archives (ZIP, TAR). Runs both as a 1-click local desktop app (`OmniConvert.exe`) and a cloud/serverless web app.
* **Tech Stack:** Python (56.5%), JavaScript (20.9%), HTML/CSS (20.1%), FastAPI, Mangum (AWS Lambda/Vercel adapter), Docker, Render.

### 5. [sentinel-guard-ai](https://github.com/armnJs/sentinel-guard-ai)
* **What it does:** Enterprise zero-trust cyber threat radar and phishing defense prototype built for the *TLN Cybersecurity Challenge 2026*. Includes an Enterprise SOC Console, Deepfake Voice Scam Analyzer, Visual DOM Brand Impersonation Inspector, 52-scenario Phish Hunt Sandbox, HTTP Security Header Auditor, Suricata/YARA playbook generator, and an embedded Gemini AI security agent.
* **Tech Stack:** JavaScript (41.9%), CSS (37.4%), HTML (20.7%), Chart.js, Google Gemini 1.5/2.0 REST API.

### 6. [Essential-Tool-V1](https://github.com/armnJs/Essential-Tool-V1) *(OmniConvert V1)*
* **What it does:** Original privacy-first local file converter running on `localhost:8000` with an iLovePDF-inspired glassmorphic UI, 140-scenario automated test suite, and an invisible zero-width steganographic provenance framework (`verify_ownership.py`).
* **Tech Stack:** Python (60.9%), HTML (19.8%), CSS (12.7%), JavaScript (6.6%), FastAPI, Uvicorn.

### 7. [OnlyBugs-clinkt-repo](https://github.com/armnJs/OnlyBugs-clinkt-repo)
* **What it does:** Root-cause business intelligence investigation and re-engineered storefront prototype for **Clinkt**, diagnosing ₹84,857 in lost revenue caused by 70.5% cart abandonment and 60.7% sub-optimal stock days. Includes a live Revenue Recovery Simulator, re-engineered e-commerce UI (`clinkt-ui.html`), 14 Excel exports, PDF findings report, and 16:9 PowerPoint deck.
* **Tech Stack:** Python (`pandas`, `numpy`, `openpyxl`), HTML5, CSS3, JavaScript, Chart.js, Vercel.

### 8. [petrolRadar](https://github.com/armnJs/petrolRadar)
* **What it does:** Full-stack fuel station tracking, CSV ingestion, and fuel price/demand prediction web application combining a Next.js frontend, PostgreSQL database schema, and Python predictive modeling scripts.
* **Tech Stack:** TypeScript (77.2%), Python (9.9%), HTML/CSS (7.9%), PostgreSQL / PLpgSQL (3.6%), Next.js (App Router), PostCSS/Tailwind.

### 9. [Caffiene-Intake-Dashboard](https://github.com/armnJs/Caffiene-Intake-Dashboard)
* **What it does:** Interactive data analytics dashboard visualizing correlations between daily caffeine consumption, cognitive focus levels, and sleep quality, accompanied by a PDF dashboard export.
* **Tech Stack:** Python (100%), Streamlit, Pandas, Seaborn, Matplotlib.

### 10. Supporting & Configuration Repositories
* **[Armaan-Portfolio](https://github.com/armnJs/Armaan-Portfolio):** Personal developer portfolio source code (JavaScript, HTML/CSS).
* **[starter-ds-template](https://github.com/armnJs/starter-ds-template):** Reusable boilerplate directory structure for Data Science projects.
* **[armnJs](https://github.com/armnJs/armnJs):** GitHub profile README and configuration files.
* **[build-your-own-x](https://github.com/armnJs/build-your-own-x):** Forked educational repository for recreating core software technologies from scratch.