import type { ReactNode } from "react";

import { Adult, At, Backdrop, Kid } from "@/components/stories/kit";

const dad = "#1e3a5f";
const mom = "#f472b6";

function Room({ children }: { children?: ReactNode }) {
  return (
    <Backdrop top="#fff7ed" bottom="#ffe4e6">
      <rect x="48" y="78" width="150" height="110" rx="18" fill="#bae6fd" />
      <rect x="118" y="78" width="8" height="110" fill="#ffffff" opacity="0.8" />
      <rect x="48" y="128" width="150" height="8" fill="#ffffff" opacity="0.8" />
      <rect x="0" y="286" width="800" height="174" fill="#fed7aa" />
      <rect x="0" y="286" width="800" height="14" fill="#fdba74" />
      {children}
    </Backdrop>
  );
}

function Blocks({ fallen = false }: { fallen?: boolean }) {
  if (fallen) {
    return (
      <g>
        <rect x="0" y="8" width="40" height="28" rx="6" fill="#fb7185" transform="rotate(-16 20 22)" />
        <rect x="52" y="12" width="40" height="28" rx="6" fill="#38bdf8" transform="rotate(14 72 26)" />
        <rect x="24" y="-28" width="40" height="28" rx="6" fill="#fbbf24" transform="rotate(-8 44 -14)" />
      </g>
    );
  }

  return (
    <g>
      <rect x="0" y="0" width="48" height="28" rx="6" fill="#fb7185" />
      <rect x="6" y="-32" width="36" height="28" rx="6" fill="#38bdf8" />
      <rect x="12" y="-64" width="24" height="28" rx="6" fill="#fbbf24" />
    </g>
  );
}

function Ambulance() {
  return (
    <g>
      <rect x="-118" y="-58" width="236" height="64" rx="18" fill="#f8fafc" stroke="#fb7185" strokeWidth="4" />
      <path d="M-28 -58 L-10 -92 H36 L54 -58" fill="#ffe4e6" stroke="#fb7185" strokeWidth="4" />
      <rect x="-2" y="-84" width="28" height="18" rx="4" fill="#fff1f2" />
      <rect x="62" y="-46" width="34" height="10" rx="3" fill="#e11d48" />
      <rect x="74" y="-58" width="10" height="34" rx="3" fill="#e11d48" />
      <circle cx="8" cy="-108" r="8" fill="#ef4444" className="story-blink" />
      <circle cx="-62" cy="10" r="16" fill="#0f172a" />
      <circle cx="-62" cy="10" r="5" fill="#fecdd3" />
      <circle cx="70" cy="10" r="16" fill="#0f172a" />
      <circle cx="70" cy="10" r="5" fill="#fecdd3" />
    </g>
  );
}

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
      {hold ? <rect x="-6" y={pose === "sit" ? -48 : -78} width="52" height="14" rx="7" fill="#fdc89a" /> : null}
    </g>
  );
}

function FeelPlay() {
  return (
    <Room>
      <At x={300} y={390} motion="story-bob">
        <Blocks />
      </At>
      <At x={160} y={430}>
        <Kid />
      </At>
      <At x={500} y={430}>
        <Dad />
      </At>
      <At x={660} y={430}>
        <g transform="scale(0.92)">
          <Mom />
        </g>
      </At>
    </Room>
  );
}

function FeelListen() {
  return (
    <Room>
      <At x={150} y={400}>
        <Blocks fallen />
      </At>
      <At x={340} y={430} motion="story-bob">
        <Kid mood="oh" />
      </At>
      <At x={500} y={455}>
        <Dad pose="sit" />
      </At>
      <At x={660} y={455}>
        <g transform="scale(0.92)">
          <Mom pose="sit" />
        </g>
      </At>
    </Room>
  );
}

function FeelHurt() {
  return (
    <Room>
      <At x={140} y={400}>
        <Blocks fallen />
      </At>
      <At x={300} y={430}>
        <Kid mood="sad" />
      </At>
      <At x={480} y={430}>
        <Dad mood="oh" pose="sit" hold />
      </At>
      <At x={660} y={430}>
        <g transform="scale(0.92)">
          <Mom mood="oh" />
        </g>
      </At>
    </Room>
  );
}

function FeelRide() {
  return (
    <Backdrop top="#e0f2fe" bottom="#e2e8f0">
      <g className="story-drift">
        <rect x="30" y="130" width="70" height="130" rx="8" fill="#fde68a" />
        <rect x="130" y="90" width="86" height="170" rx="8" fill="#bfdbfe" />
        <rect x="250" y="150" width="54" height="110" rx="8" fill="#fecdd3" />
      </g>
      <rect x="0" y="300" width="800" height="160" fill="#94a3b8" />
      <rect x="0" y="368" width="800" height="8" fill="#fde68a" />
      <At x={520} y={395}>
        <g transform="scale(0.78)">
          <Ambulance />
        </g>
      </At>
      <At x={250} y={430}>
        <g transform="scale(0.62)">
          <Dad mood="oh" pose="sit" hold />
        </g>
      </At>
      <At x={150} y={445}>
        <g transform="scale(0.55)">
          <Kid mood="sad" />
        </g>
      </At>
    </Backdrop>
  );
}

function FeelFall() {
  return (
    <Room>
      <At x={250} y={390}>
        <Blocks fallen />
      </At>
      <At x={430} y={430} motion="story-bob">
        <Kid mood="sad" />
      </At>
      <At x={620} y={430}>
        <Dad />
      </At>
      <At x={150} y={430}>
        <g transform="scale(0.92)">
          <Mom />
        </g>
      </At>
    </Room>
  );
}

function FeelChoose() {
  return (
    <Room>
      <At x={360} y={390}>
        <Blocks fallen />
      </At>
      <At x={250} y={430} motion="story-bob">
        <Kid mood="sad" />
      </At>
      <At x={520} y={430}>
        <Dad />
      </At>
      <At x={680} y={430}>
        <g transform="scale(0.92)">
          <Mom />
        </g>
      </At>
    </Room>
  );
}

function FeelTell() {
  return (
    <Room>
      <At x={180} y={400}>
        <Blocks fallen />
      </At>
      <At x={360} y={430} motion="story-bob">
        <Kid mood="oh" />
      </At>
      <At x={530} y={430}>
        <Dad />
      </At>
      <At x={690} y={430}>
        <g transform="scale(0.92)">
          <Mom />
        </g>
      </At>
    </Room>
  );
}

function FeelHug() {
  return (
    <Room>
      <At x={300} y={430}>
        <Dad />
      </At>
      <At x={250} y={455} motion="story-bob">
        <g transform="scale(0.78)">
          <Kid />
        </g>
      </At>
      <At x={470} y={430}>
        <Mom />
      </At>
    </Room>
  );
}

function FeelBuild() {
  return (
    <Room>
      <At x={300} y={400} motion="story-bob">
        <Blocks />
      </At>
      <At x={180} y={430}>
        <Kid />
      </At>
      <At x={460} y={430}>
        <Dad />
      </At>
      <At x={640} y={430}>
        <g transform="scale(0.92)">
          <Mom />
        </g>
      </At>
    </Room>
  );
}

function FeelHit() {
  return (
    <Room>
      <At x={140} y={400}>
        <Blocks fallen />
      </At>
      <At x={300} y={430}>
        <Kid mood="oh" arm="out" />
      </At>
      <At x={470} y={430}>
        <Dad mood="oh" hold />
      </At>
      <At x={660} y={430}>
        <g transform="scale(0.92)">
          <Mom mood="oh" />
        </g>
      </At>
    </Room>
  );
}

function FeelAmbulance() {
  return (
    <Backdrop top="#e0f2fe" bottom="#ecfccb">
      <circle cx="92" cy="72" r="26" fill="#fde68a" />
      <rect x="0" y="300" width="800" height="160" fill="#86efac" />
      <rect x="0" y="300" width="800" height="14" fill="#4ade80" />
      <At x={230} y={400} motion="story-drive">
        <g transform="scale(0.82)">
          <Ambulance />
        </g>
      </At>
      <At x={560} y={430}>
        <Dad mood="oh" pose="sit" hold />
      </At>
      <At x={700} y={430}>
        <g transform="scale(0.88)">
          <Mom mood="oh" />
        </g>
      </At>
      <At x={450} y={445}>
        <g transform="scale(0.72)">
          <Kid mood="sad" />
        </g>
      </At>
    </Backdrop>
  );
}

function FeelHospital() {
  return (
    <Backdrop top="#eff6ff" bottom="#f8fafc">
      <rect x="0" y="300" width="800" height="160" fill="#e2e8f0" />
      <rect x="470" y="250" width="210" height="28" rx="10" fill="#ffffff" />
      <rect x="500" y="188" width="150" height="70" rx="16" fill="#ffffff" />
      <At x={250} y={430}>
        <Adult shirt="#7dd3fc" hat="cap" />
      </At>
      <At x={470} y={400}>
        <Dad mood="oh" pose="sit" hold />
      </At>
      <At x={660} y={430}>
        <Kid mood="sad" />
      </At>
    </Backdrop>
  );
}

function FeelSorry() {
  return (
    <Backdrop top="#eff6ff" bottom="#f8fafc">
      <rect x="0" y="300" width="800" height="160" fill="#e2e8f0" />
      <rect x="80" y="250" width="210" height="28" rx="10" fill="#ffffff" />
      <At x={150} y={400}>
        <Dad mood="smile" pose="sit" />
      </At>
      <At x={360} y={430} motion="story-bob">
        <Kid mood="oh" />
      </At>
      <At x={560} y={430}>
        <g transform="scale(0.9)">
          <Mom />
        </g>
      </At>
      <At x={700} y={430}>
        <g transform="scale(0.82)">
          <Adult shirt="#7dd3fc" hat="cap" />
        </g>
      </At>
    </Backdrop>
  );
}

export const feelDrawers = {
  "feel-play": FeelPlay,
  "feel-fall": FeelFall,
  "feel-choose": FeelChoose,
  "feel-tell": FeelTell,
  "feel-listen": FeelListen,
  "feel-hug": FeelHug,
  "feel-build": FeelBuild,
  "feel-hit": FeelHit,
  "feel-hurt": FeelHurt,
  "feel-ambulance": FeelAmbulance,
  "feel-ride": FeelRide,
  "feel-hospital": FeelHospital,
  "feel-sorry": FeelSorry,
};
