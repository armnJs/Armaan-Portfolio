import { ImageResponse } from "next/og";

export const alt = "Armaan Mangaonkar — Data Analyst & Data Scientist in Mumbai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const stats = [["₹84.8k", "revenue leak diagnosed"], ["0.807", "ROC-AUC churn model"], ["115+", "players hosted live"]];

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0B0D13", color: "#F4F6FA", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#94A3B8" }}>DATA ANALYST · DATA SCIENTIST · AI ORCHESTRATOR</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, letterSpacing: -4 }}>Armaan Mangaonkar</div>
          <div style={{ display: "flex", fontSize: 40, color: "#00F2FE", marginTop: 8 }}>Messy data in. Decisions out.</div>
        </div>
        <div style={{ display: "flex", gap: 56 }}>
          {stats.map(([v, l]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", borderTop: "4px solid #8B7CFF", paddingTop: 16 }}>
              <div style={{ display: "flex", fontSize: 54, fontWeight: 700 }}>{v}</div>
              <div style={{ display: "flex", fontSize: 24, color: "#94A3B8" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
