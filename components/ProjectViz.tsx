import type { VizKind } from "@/lib/data";

const O = "var(--accent)", T = "var(--accent2)", S = "var(--slate)", L = "var(--line-strong)";

/** Small animated charts, one per project. Marks use .draw/.grow/.growx/.pop/.fade, animated by <Motion/>. */
export default function ProjectViz({ kind }: { kind: VizKind }) {
  switch (kind) {
    case "roc":
      return (
        <svg className="viz" viewBox="0 0 320 160" role="img" aria-label="ROC curve bowing well above the chance diagonal, AUC 0.807">
          <path className="fade" d="M40 136 L40 16 M40 136 L290 136" stroke={L} fill="none" />
          <path className="fade" d="M40 136 L290 16" stroke={S} strokeDasharray="4 5" opacity=".6" fill="none" />
          <path className="fade" d="M40 136 C52 78 90 44 150 32 C205 22 250 18 290 16 L290 136 Z" fill={O} opacity=".1" />
          <path className="draw" pathLength={1} d="M40 136 C52 78 90 44 150 32 C205 22 250 18 290 16" stroke={O} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <text className="fade svg-mono" x="165" y="152" textAnchor="middle">false positive rate</text>
          <text className="fade svg-mono" x="214" y="72">chance</text>
          <text className="fade svg-big" x="170" y="106">AUC 0.807</text>
        </svg>
      );
    case "funnel":
      return (
        <svg className="viz" viewBox="0 0 320 160" role="img" aria-label="Funnel: of 100% of carts, 29.5% were purchased and 70.5% abandoned">
          <text className="fade svg-mono" x="20" y="30">carts created</text>
          <text className="fade svg-mono" x="300" y="30" textAnchor="end">100%</text>
          <rect className="growx" x="20" y="38" width="280" height="22" rx="4" fill={S} opacity=".55" />
          <text className="fade svg-mono" x="20" y="92">purchased</text>
          <text className="fade svg-mono" x="300" y="92" textAnchor="end">70.5% abandoned</text>
          <rect className="growx" x="20" y="100" width="82.6" height="22" rx="4" fill={T} />
          <rect className="growx" x="104.6" y="100" width="195.4" height="22" rx="4" fill={O} />
          <text className="fade svg-mono" x="20" y="142">29.5%</text>
          <text className="fade svg-mono" x="300" y="142" textAnchor="end">= ₹84.8k left in carts</text>
        </svg>
      );
    case "dashboard":
      return (
        <svg className="viz" viewBox="0 0 320 160" role="img" aria-label="Dashboard thumbnail with a bar chart, a trend line and KPI tiles">
          <rect className="fade" x="16" y="14" width="88" height="38" rx="6" fill="none" stroke={L} />
          <rect className="fade" x="116" y="14" width="88" height="38" rx="6" fill="none" stroke={L} />
          <rect className="fade" x="216" y="14" width="88" height="38" rx="6" fill="none" stroke={L} />
          <text className="fade svg-mono" x="26" y="38">intake</text>
          <text className="fade svg-mono" x="126" y="38">focus</text>
          <text className="fade svg-mono" x="226" y="38">sleep</text>
          {[30, 46, 38, 62, 54, 74, 66].map((h, i) => (
            <rect key={i} className="grow" x={20 + i * 19} y={146 - h} width="13" height={h} rx="3" fill={i === 5 ? O : S} opacity={i === 5 ? 1 : 0.55} />
          ))}
          <path className="fade" d="M170 146 L304 146" stroke={L} />
          <path className="draw" pathLength={1} d="M172 128 L194 112 L216 120 L238 92 L260 100 L282 76 L302 82" stroke={T} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {[[172, 128], [216, 120], [260, 100], [302, 82]].map(([x, y]) => (
            <circle key={x} className="pop" cx={x} cy={y} r="4" fill={T} stroke="var(--card)" strokeWidth="2" />
          ))}
        </svg>
      );
    case "radar":
      return (
        <svg className="viz" viewBox="0 0 320 160" role="img" aria-label="Threat radar sweeping across detected signals">
          {[24, 46, 68].map((r) => (
            <circle key={r} className="fade" cx="160" cy="80" r={r} fill="none" stroke={L} />
          ))}
          <path className="fade" d="M92 80 H228 M160 12 V148" stroke={L} />
          <g className="radar-sweep">
            <path d="M160 80 L228 80 A68 68 0 0 0 208 32 Z" fill={T} opacity=".14" />
            <line x1="160" y1="80" x2="228" y2="80" stroke={T} strokeWidth="2" />
          </g>
          <circle className="pop blip" cx="196" cy="52" r="4.5" fill={O} />
          <circle className="pop blip b2" cx="128" cy="104" r="4.5" fill={O} />
          <circle className="pop blip b3" cx="176" cy="122" r="4" fill={T} />
          <text className="fade svg-mono" x="244" y="56">2 threats</text>
          <text className="fade svg-mono" x="244" y="72">1 cleared</text>
        </svg>
      );
    case "agent":
      return (
        <svg className="viz" viewBox="0 0 320 160" role="img" aria-label="Agent pipeline: persona to Gemini to Playwright to a form being filled in">
          <path className="draw" pathLength={1} d="M48 50 H116 M160 50 H216" stroke={L} strokeWidth="2" fill="none" />
          <path className="flow" d="M48 50 H272" stroke={T} strokeWidth="2" fill="none" />
          {[["persona", 48], ["Gemini", 138], ["Playwright", 244]].map(([label, x], i) => (
            <g key={label as string} className="fade">
              <rect x={(x as number) - 36} y="34" width="72" height="32" rx="8" fill="var(--card)" stroke={i === 1 ? O : L} />
              <text x={x as number} y="54" textAnchor="middle" className="svg-mono" fill="var(--silver)">{label}</text>
            </g>
          ))}
          <path className="draw" pathLength={1} d="M244 66 V88" stroke={L} strokeWidth="2" fill="none" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect className="fade" x="60" y={92 + i * 20} width="224" height="13" rx="4" fill="none" stroke={L} />
              <rect className="growx" x="62" y={94 + i * 20} width={[150, 196, 112][i]} height="9" rx="3" fill={O} opacity={0.85 - i * 0.15} />
            </g>
          ))}
          <text className="fade svg-mono" x="20" y="102">name</text>
          <text className="fade svg-mono" x="20" y="122">email</text>
          <text className="fade svg-mono" x="20" y="142">role</text>
        </svg>
      );
    case "gauge":
      return (
        <svg className="viz" viewBox="0 0 320 160" role="img" aria-label="Speedometer-style gauge">
          <path className="fade" d="M70 130 A90 90 0 0 1 250 130" stroke={L} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path className="draw" pathLength={1} d="M70 130 A90 90 0 0 1 217.4 60.7" stroke={O} strokeWidth="10" fill="none" strokeLinecap="round" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = Math.PI + (Math.PI * i) / 8;
            const c = Math.cos(a), s = Math.sin(a);
            return (
              <line key={i} className="fade" x1={+(160 + c * 70).toFixed(1)} y1={+(130 + s * 70).toFixed(1)} x2={+(160 + c * 78).toFixed(1)} y2={+(130 + s * 78).toFixed(1)} stroke={S} />
            );
          })}
          <text className="fade svg-big" x="160" y="112" textAnchor="middle">₹ / km</text>
          <text className="fade svg-mono" x="160" y="132" textAnchor="middle">expenses · service · budget</text>
        </svg>
      );
    case "forecast":
      return (
        <svg className="viz" viewBox="0 0 320 160" role="img" aria-label="Line chart of past fuel prices continuing into a dashed forecast with an uncertainty band">
          <path className="fade" d="M24 140 H300" stroke={L} />
          <path className="fade" d="M190 20 V140" stroke={S} strokeDasharray="3 4" opacity=".6" />
          <path className="draw" pathLength={1} d="M24 112 L48 104 L72 110 L96 92 L120 96 L144 78 L168 84 L190 70" stroke={T} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path className="fade" d="M190 70 L300 22 L300 78 Z" fill={O} opacity=".14" />
          <path className="fade" d="M190 70 L300 50" stroke={O} strokeWidth="2" strokeDasharray="5 5" fill="none" />
          <circle className="pop" cx="190" cy="70" r="4.5" fill={T} stroke="var(--card)" strokeWidth="2" />
          <text className="fade svg-mono" x="182" y="32" textAnchor="end">actual</text>
          <text className="fade svg-mono" x="198" y="32">forecast</text>
        </svg>
      );
  }
}
