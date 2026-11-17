import { TYPE_LABEL } from "../lib/format";

const GREEN = "var(--brand)";
const SOFT = "#cfe5d8";

/* Friendly line illustrations, one per property type. */
export default function Plan({ type }) {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label={`${TYPE_LABEL[type]} illustration`}>
      <g stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {type === "land" && (
          <>
            <rect x="20" y="158" width="280" height="22" rx="11" fill="#dce9e2" stroke="none" />
            <path d="M40 169H280" strokeDasharray="12 10" strokeWidth="2" strokeOpacity=".45" fill="none" />
            <polygon points="60,138 100,56 250,44 282,126" fill={SOFT} />
            <polygon points="82,128 110,70 236,60 260,118" fill="none" strokeDasharray="6 7" strokeOpacity=".55" strokeWidth="2" />
            <path d="M138 106V92M208 98V86" fill="none" />
            <circle cx="138" cy="82" r="14" fill={GREEN} />
            <circle cx="208" cy="76" r="11" fill={GREEN} />
            {[[60, 138], [100, 56], [250, 44], [282, 126]].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#fff" />
            ))}
          </>
        )}
        {type === "building" && (
          <>
            <path d="M30 172H290" fill="none" />
            <rect x="72" y="84" width="60" height="88" rx="5" fill={SOFT} />
            <rect x="120" y="30" width="110" height="142" rx="6" fill="#fff" />
            {[0, 1, 2].flatMap((c) => [0, 1, 2].map((r) => (
              <rect key={`${c}-${r}`} x={138 + c * 30} y={46 + r * 30} width="16" height="18" rx="2" fill={SOFT} strokeWidth="2" />
            )))}
            <rect x="162" y="136" width="26" height="36" rx="3" fill={GREEN} />
            {[0, 1].map((r) => <rect key={r} x="86" y={100 + r * 34} width="14" height="16" rx="2" fill="#fff" strokeWidth="2" />)}
            <path d="M250 172V150" fill="none" />
            <circle cx="250" cy="138" r="14" fill={GREEN} />
          </>
        )}
        {type === "rental" && (
          <>
            <path d="M30 172H290" fill="none" />
            <rect x="96" y="92" width="130" height="80" rx="4" fill="#fff" />
            <polygon points="82,96 161,36 240,96" fill={GREEN} />
            <rect x="196" y="48" width="14" height="30" fill={SOFT} />
            <rect x="148" y="122" width="26" height="50" rx="3" fill={SOFT} />
            <rect x="110" y="110" width="26" height="24" rx="2" fill={SOFT} strokeWidth="2" />
            <rect x="188" y="110" width="26" height="24" rx="2" fill={SOFT} strokeWidth="2" />
            <path d="M262 172V152M60 172V156" fill="none" />
            <circle cx="262" cy="140" r="13" fill={GREEN} />
            <circle cx="60" cy="146" r="10" fill={GREEN} />
          </>
        )}
      </g>
    </svg>
  );
}