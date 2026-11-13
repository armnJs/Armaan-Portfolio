import { links, projects, skillGroups } from "./data";
import { faqs } from "./knowledge";

export const SITE_URL = "https://armaan-mangaonkar.vercel.app";
export const SITE_NAME = "Armaan Mangaonkar";
export const SITE_TITLE = "Armaan Mangaonkar | Data Analyst & Data Scientist in Mumbai";
export const SITE_DESCRIPTION =
  "Armaan Mangaonkar is a Mumbai-based data analyst and aspiring data scientist. Churn ML (0.807 ROC-AUC), ₹84.8k revenue-leak analytics, AI agents, Power BI and Python dashboards. Open to Data Analyst roles and internships.";

/** schema.org graph: lets search engines and AI answer engines read the page as structured facts. */
export function jsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Armaan Mangaonkar",
    alternateName: ["Armaan Shafiq Mangaonkar", "armnJs"],
    url: SITE_URL,
    image: `${SITE_URL}/armaan.jpg`,
    email: `mailto:${links.email}`,
    jobTitle: "Data Analyst",
    description: SITE_DESCRIPTION,
    address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressRegion: "Maharashtra", addressCountry: "IN" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "M.L. Dahanukar College", address: "Mumbai, India" },
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", name: "GenAI Powered Data Analytics", recognizedBy: { "@type": "Organization", name: "Tata Group (Forage)" } },
      { "@type": "EducationalOccupationalCredential", name: "Data Analytics Job Simulation", recognizedBy: { "@type": "Organization", name: "Deloitte Australia (Forage)" } },
    ],
    knowsAbout: skillGroups.slice(0, 5).flatMap((g) => g.items),
    seeks: { "@type": "Demand", name: "Data Analyst role or internship" },
    sameAs: [links.github, links.linkedin],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, description: SITE_DESCRIPTION, inLanguage: "en-IN", publisher: { "@id": person["@id"] } },
      { "@type": "ProfilePage", "@id": `${SITE_URL}/#profile`, url: SITE_URL, name: SITE_TITLE, isPartOf: { "@id": `${SITE_URL}/#website` }, mainEntity: { "@id": person["@id"] }, about: { "@id": person["@id"] } },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#projects`,
        name: "Featured data science and analytics projects by Armaan Mangaonkar",
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": p.github ? "SoftwareSourceCode" : "CreativeWork",
            name: p.title,
            description: `${p.problem} ${p.approach} ${p.result}`,
            author: { "@id": person["@id"] },
            keywords: [...p.stack, ...p.tags].join(", "),
            ...(p.github ? { codeRepository: p.github } : {}),
            ...(p.live ? { url: p.live } : p.github ? { url: p.github } : {}),
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}
