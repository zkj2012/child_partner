import type { ReactNode } from "react";

import { Adult, At, Backdrop, Cloud, Kid, Sun } from "@/components/stories/kit";

const dad = "#1e3a5f";
const mom = "#f472b6";
const crew = "#7dd3fc";

function Mom({
  mood = "smile",
  pose = "stand",
}: {
  mood?: "smile" | "sad" | "oh";
  pose?: "stand" | "sit";
}) {
  return <Adult shirt={mom} mood={mood} pose={pose} hat="bun" />;
}

function Dad({
  mood = "smile",
  pose = "stand",
  hold = false,
}: {
  mood?: "smile" | "sad" | "oh";
  pose?: "stand" | "sit";
  hold?: boolean;
}) {
  return (
    <g>
      <Adult shirt={dad} mood={mood} pose={pose} />
      {hold ? <rect x="18" y={pose === "sit" ? -40 : -78} width="46" height="14" rx="7" fill="#fdc89a" /> : null}
    </g>
  );
}

function Attendant() {
  return (
    <g>
      <Adult shirt={crew} hat="cap" />
      <rect x="-8" y="-78" width="16" height="22" rx="4" fill="#fb7185" />
    </g>
  );
}

function Jet() {
  return (
    <g>
      <polygon points="78,-14 118,-42 86,-14" fill="#e2e8f0" />
      <rect x="-120" y="-16" width="214" height="32" rx="16" fill="#f8fafc" stroke="#bfdbfe" strokeWidth="3" />
      <polygon points="-16,10 36,10 14,38 -6,38" fill="#93c5fd" />
      {[-78, -48, -18, 12].map((x) => (
        <circle key={x} cx={x} cy="0" r="4.5" fill="#38bdf8" />
      ))}
      <ellipse cx="-92" cy="18" rx="16" ry="7" fill="#cbd5e1" />
    </g>
  );
}

function Suitcase() {
  return (
    <g>
      <rect x="-18" y="-30" width="36" height="28" rx="6" fill="#f59e0b" />
      <rect x="-10" y="-40" width="20" height="12" rx="4" fill="#d97706" />
    </g>
  );
}

function Cabin({
  sky = "#bae6fd",
  bump = false,
  children,
}: {
  sky?: string;
  bump?: boolean;
  children?: ReactNode;
}) {
  return (
    <Backdrop top="#e0f2fe" bottom="#f8fafc">
      <g className={bump ? "story-bump" : undefined}>
        <rect x="0" y="248" width="800" height="212" fill="#e2e8f0" />
        <rect x="0" y="248" width="800" height="16" fill="#94a3b8" />
        <ellipse cx="150" cy="132" rx="58" ry="38" fill={sky} stroke="#94a3b8" strokeWidth="8" />
        <ellipse cx="400" cy="132" rx="58" ry="38" fill={sky} stroke="#94a3b8" strokeWidth="8" />
        <ellipse cx="650" cy="132" rx="58" ry="38" fill={sky} stroke="#94a3b8" strokeWidth="8" />
        <rect x="150" y="292" width="78" height="96" rx="18" fill="#2563eb" />
        <rect x="360" y="292" width="78" height="96" rx="18" fill="#2563eb" />
        <rect x="570" y="292" width="78" height="96" rx="18" fill="#2563eb" />
        {children}
      </g>
    </Backdrop>
  );
}

function Belt() {
  return <path d="M-24 -28 Q0 -12 24 -28" stroke="#0f172a" strokeWidth="6" fill="none" strokeLinecap="round" />;
}

function SeatedFamily({
  kidMood = "smile",
  dadMood = "smile",
  momMood = "smile",
  kidArm = "down",
  belt = true,
}: {
  kidMood?: "smile" | "sad" | "oh";
  dadMood?: "smile" | "sad" | "oh";
  momMood?: "smile" | "sad" | "oh";
  kidArm?: "down" | "out";
  belt?: boolean;
}) {
  return (
    <>
      <At x={190} y={430}>
        <g transform="scale(0.78)">
          <Mom mood={momMood} pose="sit" />
        </g>
      </At>
      <At x={400} y={430}>
        <g transform="scale(0.82)">
          <Dad mood={dadMood} pose="sit" />
        </g>
      </At>
      <At x={610} y={445}>
        <g transform="scale(0.78)">
          <Kid mood={kidMood} pose="sit" arm={kidArm} />
          {belt ? <Belt /> : null}
        </g>
      </At>
    </>
  );
}

function PlaneTrip() {
  return (
    <Backdrop top="#dbeafe" bottom="#bbf7d0">
      <Sun x={680} y={78} />
      <Cloud x={180} y={90} />
      <Cloud x={420} y={64} scale={0.8} />
      <rect x="0" y="300" width="800" height="160" fill="#86efac" />
      <At x={250} y={118} motion="story-drift">
        <g transform="scale(0.72)">
          <Jet />
        </g>
      </At>
      <At x={250} y={430} motion="story-bob">
        <Kid />
      </At>
      <At x={390} y={430}>
        <Dad />
      </At>
      <At x={560} y={430}>
        <g transform="scale(0.92)">
          <Mom />
        </g>
      </At>
      <At x={680} y={430}>
        <Suitcase />
      </At>
    </Backdrop>
  );
}

function PlaneAirport() {
  return (
    <Backdrop top="#e0f2fe" bottom="#f8fafc">
      <rect x="70" y="48" width="420" height="230" rx="28" fill="#bae6fd" />
      <rect x="90" y="70" width="380" height="190" rx="18" fill="#e0f2fe" />
      <rect x="0" y="300" width="800" height="160" fill="#e2e8f0" />
      <At x={280} y={180}>
        <g transform="scale(0.7)">
          <Jet />
        </g>
      </At>
      <At x={560} y={430}>
        <Kid mood="oh" />
      </At>
      <At x={680} y={430}>
        <Dad />
      </At>
      <At x={120} y={445}>
        <Suitcase />
      </At>
    </Backdrop>
  );
}

function PlaneBoard() {
  return (
    <Cabin>
      <At x={250} y={430} motion="story-bob">
        <Kid mood="oh" />
      </At>
      <At x={400} y={430}>
        <Dad />
      </At>
      <At x={560} y={430}>
        <g transform="scale(0.92)">
          <Mom />
        </g>
      </At>
    </Cabin>
  );
}

function PlaneSeat() {
  return (
    <Cabin>
      <At x={190} y={430}>
        <g transform="scale(0.78)">
          <Mom pose="sit" />
        </g>
      </At>
      <At x={400} y={430}>
        <g transform="scale(0.82)">
          <Dad pose="sit" />
        </g>
      </At>
      <At x={610} y={430} motion="story-bob">
        <g transform="scale(0.82)">
          <Kid mood="oh" />
        </g>
      </At>
    </Cabin>
  );
}

function PlaneBelt() {
  return (
    <Cabin>
      <SeatedFamily />
    </Cabin>
  );
}

function PlaneFly() {
  return (
    <Cabin sky="#7dd3fc">
      <Sun x={650} y={78} />
      <SeatedFamily kidMood="oh" />
    </Cabin>
  );
}

function PlaneCloud() {
  return (
    <Cabin sky="#f8fafc">
      <Cloud x={150} y={132} scale={0.7} />
      <Cloud x={400} y={120} scale={0.85} />
      <Cloud x={650} y={136} scale={0.7} />
      <SeatedFamily kidArm="out" />
    </Cabin>
  );
}

function PlaneStill() {
  return (
    <Cabin>
      <SeatedFamily />
    </Cabin>
  );
}

function PlaneBump() {
  return (
    <Cabin bump>
      <SeatedFamily kidMood="oh" kidArm="out" />
    </Cabin>
  );
}

function PlaneCrew() {
  return (
    <Cabin>
      <SeatedFamily />
      <At x={740} y={400}>
        <g transform="scale(0.72)">
          <Attendant />
        </g>
      </At>
      <At x={700} y={360}>
        <g transform="scale(0.34)">
          <Jet />
        </g>
      </At>
    </Cabin>
  );
}

function PlaneGift() {
  return (
    <Cabin>
      <SeatedFamily kidArm="out" />
      <At x={700} y={400}>
        <g transform="scale(0.68)">
          <Attendant />
        </g>
      </At>
      <At x={660} y={390} motion="story-bob">
        <g transform="scale(0.36)">
          <Jet />
        </g>
      </At>
    </Cabin>
  );
}

function PlaneStand() {
  return (
    <Cabin>
      <At x={190} y={430}>
        <g transform="scale(0.78)">
          <Mom mood="oh" pose="sit" />
        </g>
      </At>
      <At x={400} y={430}>
        <g transform="scale(0.82)">
          <Dad mood="oh" pose="sit" />
        </g>
      </At>
      <At x={610} y={390} motion="story-bob">
        <g transform="scale(0.78)">
          <Kid />
        </g>
      </At>
      <path d="M560 400 Q590 392 620 404" stroke="#0f172a" strokeWidth="6" fill="none" strokeLinecap="round" />
    </Cabin>
  );
}

function PlaneShake() {
  return (
    <Cabin bump>
      <At x={190} y={430}>
        <g transform="scale(0.78)">
          <Mom mood="oh" pose="sit" />
        </g>
      </At>
      <At x={430} y={430}>
        <g transform="scale(0.82)">
          <Dad mood="oh" pose="sit" hold />
        </g>
      </At>
      <At x={610} y={390}>
        <g transform="scale(0.78)">
          <Kid mood="oh" />
        </g>
      </At>
    </Cabin>
  );
}

function PlaneHold() {
  return (
    <Cabin bump>
      <At x={190} y={430}>
        <g transform="scale(0.78)">
          <Mom pose="sit" />
        </g>
      </At>
      <At x={430} y={430}>
        <g transform="scale(0.82)">
          <Dad pose="sit" hold />
        </g>
      </At>
      <At x={590} y={445}>
        <g transform="scale(0.78)">
          <Kid mood="oh" pose="sit" />
          <Belt />
        </g>
      </At>
    </Cabin>
  );
}

export const planeDrawers = {
  "plane-trip": PlaneTrip,
  "plane-airport": PlaneAirport,
  "plane-board": PlaneBoard,
  "plane-seat": PlaneSeat,
  "plane-belt": PlaneBelt,
  "plane-fly": PlaneFly,
  "plane-cloud": PlaneCloud,
  "plane-still": PlaneStill,
  "plane-bump": PlaneBump,
  "plane-crew": PlaneCrew,
  "plane-gift": PlaneGift,
  "plane-stand": PlaneStand,
  "plane-shake": PlaneShake,
  "plane-hold": PlaneHold,
};
