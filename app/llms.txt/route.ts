import { links, projects, skillGroups } from "@/lib/data";
import { knowledge } from "@/lib/knowledge";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** /llms.txt — a plain-markdown fact sheet for AI answer engines, generated from the same data as the site. */
export function GET() {
  const body = [
    "# Armaan Mangaonkar",
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `- Website: ${SITE_URL}`,
    `- GitHub: ${links.github}`,
    `- LinkedIn: ${links.linkedin}`,
    `- Email: ${links.email}`,
    `- Resume (PDF): ${SITE_URL}${links.resume}`,
    "- Location: Mumbai, Maharashtra, India",
    "",
    "## Projects",
    "",
    ...projects.map(
      (p) =>
        `- **${p.title}** (${p.stack.join(", ")}): ${p.problem} ${p.approach} ${p.result}${p.live ? ` Live: ${p.live}` : ""}${p.github ? ` Code: ${p.github}` : ""}`,
    ),
    "",
    "## Skills",
    "",
    ...skillGroups.map((g) => `- ${g.name}: ${g.items.join(", ")}`),
    "",
    "## Questions and answers",
    "",
    ...knowledge.filter((k) => k.id !== "bot").flatMap((k) => [`### ${k.q}`, "", k.a, ""]),
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
