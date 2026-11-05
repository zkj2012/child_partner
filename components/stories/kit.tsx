import type { ReactNode } from "react";

type Mood = "smile" | "sad" | "oh";
type Pose = "stand" | "sit";

export function At({
  x,
  y,
  motion,
  children,
}: {
  x: number;
  y: number;
  motion?: string;
  children: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {motion ? <g className={motion}>{children}</g> : children}
    </g>
  );
}

export function Backdrop({
  top,
  bottom,
  children,
}: {
  top: string;
  bottom: string;
  children?: ReactNode;
}) {
  return (
    <>
      <defs>
        <linearGradient id="story-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#story-bg)" />
      {children}
    </>
  );
}

export function Sun({ x, y }: { x: number; y: number }) {
  return (
    <At x={x} y={y}>
      <g className="story-spin-slow">
        <circle r="26" fill="#fde68a" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="-3"
            y="-46"
            width="6"
            height="14"
            rx="3"
            fill="#fde68a"
            transform={`rotate(${deg})`}
          />
        ))}
      </g>
    </At>
  );
}

export function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="story-drift">
        <ellipse cx="0" cy="0" rx="34" ry="16" fill="#ffffff" />
        <ellipse cx="-24" cy="6" rx="20" ry="13" fill="#ffffff" />
        <ellipse cx="26" cy="6" rx="22" ry="13" fill="#ffffff" />
      </g>
    </g>
  );
}

function Face({ cx, cy, mood }: { cx: number; cy: number; mood: Mood }) {
  const mouth =
    mood === "sad"
      ? `M${cx - 7} ${cy + 12} Q${cx} ${cy + 6} ${cx + 7} ${cy + 12}`
      : `M${cx - 7} ${cy + 8} Q${cx} ${cy + 15} ${cx + 7} ${cy + 8}`;

  return (
    <>
      <circle cx={cx - 7} cy={cy} r="2.4" fill="#1e293b" />
      <circle cx={cx + 7} cy={cy} r="2.4" fill="#1e293b" />
      {mood === "sad" ? (
        <g className="story-tear">
          <circle cx={cx - 11} cy={cy + 8} r="3" fill="#38bdf8" />
          <circle cx={cx + 12} cy={cy + 6} r="2.5" fill="#38bdf8" />
        </g>
      ) : (
        <>
          <circle cx={cx - 15} cy={cy + 6} r="3.4" fill="#fda4af" opacity="0.9" />
          <circle cx={cx + 15} cy={cy + 6} r="3.4" fill="#fda4af" opacity="0.9" />
        </>
      )}
      {mood === "oh" ? (
        <ellipse cx={cx} cy={cy + 11} rx="4" ry="5" fill="#1e293b" />
      ) : (
        <path d={mouth} stroke="#1e293b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      )}
    </>
  );
}

export function Kid({
  shirt = "#fb7185",
  mood = "smile",
  pose = "stand",
  arm = "down",
}: {
  shirt?: string;
  mood?: Mood;
  pose?: Pose;
  arm?: "down" | "out";
}) {
  const headY = pose === "sit" ? -58 : -96;

  return (
    <g>
      <ellipse cx="0" cy="4" rx="26" ry="8" fill="#0f172a" opacity="0.08" />
      {pose === "stand" ? (
        <>
          <rect x="-12" y="-34" width="10" height="32" rx="5" fill="#334155" />
          <rect x="2" y="-34" width="10" height="32" rx="5" fill="#334155" />
          <rect x="-18" y="-74" width="36" height="44" rx="14" fill={shirt} />
          <rect x="-30" y="-68" width="14" height="26" rx="7" fill="#fdc89a" />
          {arm === "out" ? (
            <rect x="14" y="-62" width="34" height="14" rx="7" fill="#fdc89a" />
          ) : (
            <rect x="16" y="-68" width="14" height="26" rx="7" fill="#fdc89a" />
          )}
        </>
      ) : (
        <>
          <rect x="-22" y="-44" width="44" height="40" rx="14" fill={shirt} />
          <rect x="-34" y="-36" width="14" height="20" rx="7" fill="#fdc89a" />
          <rect x="20" y="-36" width="14" height="20" rx="7" fill="#fdc89a" />
        </>
      )}
      <circle cx="0" cy={headY} r="22" fill="#fdc89a" />
      <ellipse cx="0" cy={headY - 12} rx="18" ry="10" fill="#3f3a36" />
      <Face cx={0} cy={headY + 2} mood={mood} />
    </g>
  );
}

export function Adult({
  shirt = "#1e293b",
  mood = "smile",
  pose = "stand",
  hat = "none",
}: {
  shirt?: string;
  mood?: Mood;
  pose?: Pose;
  hat?: "none" | "cap" | "bun";
}) {
  const headY = pose === "sit" ? -72 : -118;

  return (
    <g>
      <ellipse cx="0" cy="4" rx="32" ry="8" fill="#0f172a" opacity="0.08" />
      {pose === "stand" ? (
        <>
          <rect x="-14" y="-42" width="12" height="40" rx="6" fill="#334155" />
          <rect x="2" y="-42" width="12" height="40" rx="6" fill="#334155" />
          <rect x="-24" y="-100" width="48" height="64" rx="18" fill={shirt} />
          <rect x="-40" y="-92" width="16" height="32" rx="8" fill="#fdc89a" />
          <rect x="24" y="-92" width="16" height="32" rx="8" fill="#fdc89a" />
        </>
      ) : (
        <>
          <rect x="-28" y="-56" width="56" height="52" rx="16" fill={shirt} />
          <rect x="-42" y="-46" width="16" height="24" rx="8" fill="#fdc89a" />
          <rect x="26" y="-46" width="16" height="24" rx="8" fill="#fdc89a" />
        </>
      )}
      <circle cx="0" cy={headY} r="24" fill="#fdc89a" />
      <ellipse cx="0" cy={headY - 14} rx="20" ry="11" fill="#3f3a36" />
      <Face cx={0} cy={headY + 2} mood={mood} />
      {hat === "cap" ? (
        <g>
          <rect x="-16" y={headY - 30} width="32" height="14" rx="4" fill="#1e3a8a" />
          <rect x="-28" y={headY - 20} width="56" height="8" rx="3" fill="#1d4ed8" />
        </g>
      ) : null}
      {hat === "bun" ? <circle cx="0" cy={headY - 30} r="9" fill="#3f3a36" /> : null}
    </g>
  );
}

export function HoldPair() {
  return (
    <g>
      <Adult />
      <g transform="translate(-20 -6) scale(0.62)">
        <Kid />
      </g>
    </g>
  );
}

export function ToyCar({ moving = false }: { moving?: boolean }) {
  const wheel = moving ? "story-wheel" : undefined;

  return (
    <g>
      <rect x="-50" y="-34" width="100" height="32" rx="12" fill="#ef4444" />
      <path d="M-16 -34 L-4 -52 H26 L38 -34" fill="#fca5a5" />
      <rect x="0" y="-48" width="24" height="12" rx="3" fill="#fff7ed" />
      <g className={wheel}>
        <circle cx="-28" cy="0" r="10" fill="#0f172a" />
        <circle cx="-28" cy="0" r="3.5" fill="#fde68a" />
      </g>
      <g className={wheel}>
        <circle cx="30" cy="0" r="10" fill="#0f172a" />
        <circle cx="30" cy="0" r="3.5" fill="#fde68a" />
      </g>
    </g>
  );
}

export function PoliceCar({
  lights = true,
  moving = false,
}: {
  lights?: boolean;
  moving?: boolean;
}) {
  const wheel = moving ? "story-wheel" : undefined;

  return (
    <g>
      <rect x="-96" y="-48" width="192" height="46" rx="14" fill="#f8fafc" stroke="#1d4ed8" strokeWidth="4" />
      <path d="M-42 -48 L-24 -76 H40 L58 -48" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="4" />
      <rect x="-14" y="-70" width="36" height="16" rx="3" fill="#eff6ff" />
      <rect x="-12" y="-90" width="32" height="12" rx="3" fill="#0f172a" />
      <circle
        cx="-4"
        cy="-84"
        r="5"
        fill={lights ? "#ef4444" : "#94a3b8"}
        className={lights ? "story-siren-a" : undefined}
      />
      <circle
        cx="10"
        cy="-84"
        r="5"
        fill={lights ? "#3b82f6" : "#94a3b8"}
        className={lights ? "story-siren-b" : undefined}
      />
      <text x="0" y="-20" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1d4ed8">
        警察
      </text>
      <g className={wheel}>
        <circle cx="-54" cy="2" r="13" fill="#0f172a" />
        <circle cx="-54" cy="2" r="4" fill="#e2e8f0" />
      </g>
      <g className={wheel}>
        <circle cx="58" cy="2" r="13" fill="#0f172a" />
        <circle cx="58" cy="2" r="4" fill="#e2e8f0" />
      </g>
    </g>
  );
}

export function Train({ open = false }: { open?: boolean }) {
  return (
    <g>
      <rect x="78" y="40" width="300" height="104" rx="28" fill="#0f172a" />
      <rect x="0" y="56" width="96" height="76" rx="20" fill="#1e293b" />
      <circle cx="24" cy="86" r="8" fill="#fde68a" className="story-blink" />
      <rect x="108" y="58" width="70" height="42" rx="8" fill="#bae6fd" />
      <rect x="190" y="58" width="70" height="42" rx="8" fill="#bae6fd" />
      <rect x="286" y="54" width="58" height="90" rx="8" fill={open ? "#020617" : "#e2e8f0"} />
      <circle cx="48" cy="150" r="14" fill="#334155" />
      <circle cx="150" cy="150" r="14" fill="#334155" />
      <circle cx="250" cy="150" r="14" fill="#334155" />
      <circle cx="340" cy="150" r="14" fill="#334155" />
    </g>
  );
}

export function Tag({
  x,
  y,
  children,
  tone = "light",
}: {
  x: number;
  y: number;
  children: string;
  tone?: "light" | "dark";
}) {
  const width = children.length * 24 + 36;
  const dark = tone === "dark";

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height="40" rx="20" fill={dark ? "#0f172a" : "#ffffff"} />
      <text
        x={width / 2}
        y="27"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill={dark ? "#ffffff" : "#0f172a"}
      >
        {children}
      </text>
    </g>
  );
}

export function Bubble({ x, y, text }: { x: number; y: number; text: string }) {
  const width = text.length * 26 + 36;

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height="46" rx="16" fill="#ffffff" />
      <path d="M28 44 L46 44 L34 60 Z" fill="#ffffff" />
      <text x={width / 2} y="31" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0f172a">
        {text}
      </text>
    </g>
  );
}

export function Tree() {
  return (
    <g>
      <rect x="-8" y="-70" width="16" height="70" rx="4" fill="#a16207" />
      <circle cx="0" cy="-92" r="32" fill="#16a34a" />
      <circle cx="-22" cy="-74" r="20" fill="#22c55e" />
      <circle cx="22" cy="-72" r="20" fill="#22c55e" />
    </g>
  );
}

export function Lawn() {
  return (
    <g>
      <rect x="0" y="300" width="800" height="160" fill="#86efac" />
      <rect x="0" y="300" width="800" height="16" fill="#4ade80" />
    </g>
  );
}
