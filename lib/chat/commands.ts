import { links } from "../data";
import { SITE_URL } from "../seo";

export type Action = { label: string; cmd: string };
export type CommandResult = { text: string; actions?: Action[] };

export const COMMANDS: { cmd: string; hint: string }[] = [
  { cmd: "/hire", hint: "Open a hiring email to Armaan, pre-written" },
  { cmd: "/resume", hint: "Download his resume (PDF)" },
  { cmd: "/share", hint: "Send the resume PDF via your mail or chat app" },
  { cmd: "/email", hint: "Write Armaan a blank email" },
  { cmd: "/goto projects", hint: "Jump to a section: projects, about, skills, lab, track, now, faq, contact" },
  { cmd: "/github", hint: "Open his GitHub" },
  { cmd: "/linkedin", hint: "Open his LinkedIn" },
  { cmd: "/clear", hint: "Clear this conversation" },
  { cmd: "/help", hint: "Show all commands" },
];

const SECTIONS: Record<string, string> = {
  projects: "projects", project: "projects", work: "projects", builds: "projects",
  about: "about", story: "about",
  skills: "skills", skill: "skills", mindmap: "skills", stack: "skills",
  lab: "lab", animations: "lab",
  track: "track", experience: "track", leadership: "track", hackathons: "track",
  now: "now", learning: "now",
  beyond: "beyond", hobbies: "beyond", garage: "beyond",
  certs: "certs", certifications: "certs", education: "certs",
  faq: "faq", questions: "faq",
  contact: "contact", pitstop: "contact",
  top: "top", home: "top",
};

const RESUME_URL = `${SITE_URL}${links.resume}`;
const RESUME_NAME = "Armaan_Mangaonkar_Resume.pdf";

const mailto = (to: string, subject: string, body: string) => {
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const HIRE_SUBJECT = "Opportunity for you: [Role] at [Company]";
export const HIRE_BODY = `Hi Armaan,

I came across your portfolio (${SITE_URL}) and would like to talk to you about a [Data Analyst] opportunity at [Company].

Role: [title, team]
Location: [city / remote]
Type: [full-time / internship]
Next step: [a quick call this week?]

I have your resume on file from your site: ${RESUME_URL}

Best regards,
[Your name]
[Your title, company, phone]`;

function downloadResume() {
  const a = document.createElement("a");
  a.href = links.resume;
  a.download = RESUME_NAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

let resumeFile: File | null = null;
/** Fetch the PDF ahead of time so sharing it later still counts as a direct user action. */
export async function preloadResume() {
  if (resumeFile) return;
  try {
    const blob = await (await fetch(links.resume)).blob();
    resumeFile = new File([blob], RESUME_NAME, { type: "application/pdf" });
  } catch {}
}

/** Share the real PDF through the OS share sheet (mail, WhatsApp, etc.). Returns false if unsupported. */
async function shareResume(): Promise<"shared" | "cancelled" | "unsupported"> {
  const data = {
    files: resumeFile ? [resumeFile] : [],
    title: "Armaan Mangaonkar – Data Analyst resume",
    text: `Resume of Armaan Mangaonkar, data analyst and aspiring data scientist from Mumbai. Portfolio: ${SITE_URL}`,
  };
  if (!resumeFile || !navigator.canShare?.(data)) return "unsupported";
  try { await navigator.share(data); return "shared"; }
  catch (e) { return (e as DOMException)?.name === "AbortError" ? "cancelled" : "unsupported"; }
}

const HIRE_ACTIONS: Action[] = [
  { label: "Open draft again", cmd: "/hire" },
  { label: "Share resume PDF", cmd: "/share" },
  { label: "Download resume", cmd: "/resume" },
];

// "Why should we hire him?" is a question to answer, not an instruction to act on
const ASKING = /^(why|should|what|how|is|does|when|where|who|which)\b/i;

/** Map free text to a command, so "send me his cv" works as well as "/resume". */
function detect(text: string): string | null {
  const t = text.toLowerCase().trim();
  if (t.startsWith("/")) return t;
  if (/\b(resume|cv)\b/.test(t) && /\b(download|get|send|share|give|email|mail|forward|grab|want|need|see|show|open|view|whatsapp)\b/.test(t))
    return /\b(email|mail|share|forward|whatsapp)\b|\bsend\b.*\bto\b/.test(t) ? "/share" : "/resume";
  if (/^(resume|cv)$/.test(t)) return "/resume";
  if (!ASKING.test(t)) {
    if (/\b(i|we)('d| would)? ?(want|like|wish|need|plan|am looking|are looking)( to)? (hire|recruit|interview)\b|^(hire|recruit)\b|let'?s hire|schedule (an? )?(interview|call)|send (him |armaan )?(an? )?(job )?offer|offer (him|armaan) (a|the) (job|role)/.test(t)) return "/hire";
    if (/^(email|mail|message|write( to)?|contact) (him|armaan)\b/.test(t)) return "/email";
    if (/\b(open|visit|go to|show)\b.*\bgithub\b/.test(t)) return "/github";
    if (/\b(open|visit|go to|show)\b.*\blinkedin\b/.test(t)) return "/linkedin";
    const nav = t.match(/\b(?:go to|take me to|show me|scroll to|jump to|navigate to|open)\b(?: the| his)? ([a-z ]+?)(?: section| page)?$/);
    if (nav) {
      const key = nav[1].trim().split(" ").find((w) => SECTIONS[w]);
      if (key) return `/goto ${key}`;
    }
  }
  return null;
}

/**
 * Runs a command if the text is one. Must be called synchronously from the user's click or key press
 * so downloads, mail drafts and new tabs are allowed by the browser.
 */
export function runCommand(text: string, post: (r: CommandResult) => void): CommandResult | "clear" | null {
  const cmd = detect(text);
  if (!cmd) return null;
  const [name, ...rest] = cmd.split(/\s+/);
  const arg = rest.join(" ");

  switch (name) {
    case "/help":
    case "/commands":
    case "/":
      return { text: "Here's what I can do. Type a command, or just say it in plain words (\"send me his CV\", \"take me to projects\", \"I want to hire him\"):\n\n" + COMMANDS.map((c) => `${c.cmd} — ${c.hint}`).join("\n") };
    case "/resume":
    case "/cv":
      downloadResume();
      return { text: "Downloading Armaan's resume (PDF) now.", actions: [{ label: "Share it instead", cmd: "/share" }, { label: "Hire Armaan", cmd: "/hire" }] };
    case "/hire":
      mailto(links.email, HIRE_SUBJECT, HIRE_BODY);
      return {
        text: `Opening an email draft to ${links.email} with a hiring template. Fill in the [brackets] and hit send.\n\nBrowsers can't attach a file to a draft, so the template links to his resume. To send the actual PDF, use “Share resume PDF”.`,
        actions: HIRE_ACTIONS,
      };
    case "/share":
      shareResume().then((r) => {
        if (r === "shared") post({ text: "Done. The resume PDF went out through the app you picked." });
        else if (r === "unsupported") {
          downloadResume();
          post({ text: "This browser can't hand a file to your mail app, so I've downloaded the PDF instead. Attach it to your email from your downloads folder.", actions: [{ label: "Open hiring draft", cmd: "/hire" }] });
        }
      });
      return { text: "Opening your share sheet with the resume PDF attached. Pick your mail or chat app." };
    case "/email":
    case "/contact":
      mailto(links.email, "Hello from your portfolio", "Hi Armaan,\n\n");
      return { text: `Opening a blank email to ${links.email}.`, actions: [{ label: "Use the hiring template", cmd: "/hire" }] };
    case "/github":
      window.open(links.github, "_blank", "noopener");
      return { text: "Opening github.com/armnJs in a new tab." };
    case "/linkedin":
      window.open(links.linkedin, "_blank", "noopener");
      return { text: "Opening Armaan's LinkedIn in a new tab." };
    case "/goto":
    case "/go": {
      const id = SECTIONS[arg.replace(/\s+/g, "")] ?? SECTIONS[arg.split(" ")[0]];
      if (!id) return { text: "I can jump to: projects, about, skills, lab, track, now, beyond, certs, faq or contact. Try “/goto projects”." };
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return { text: `Taking you to ${id === "top" ? "the top" : `the ${id} section`}.` };
    }
    case "/clear":
      return "clear";
    default:
      return { text: `I don't know “${name}”. Type /help to see what I can do.` };
  }
}
