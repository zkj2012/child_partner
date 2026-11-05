import type { ReactNode } from "react";

import { Adult, At, Backdrop, Bubble, Cloud, HoldPair, Kid, Sun, Tag, Train } from "@/components/stories/kit";

function PlatformBand() {
  return (
    <>
      <rect x="0" y="248" width="800" height="212" fill="#e2e8f0" />
      <rect x="0" y="248" width="800" height="16" fill="#facc15" />
      <line
        x1="18"
        y1="256"
        x2="782"
        y2="256"
        stroke="#0f172a"
        strokeWidth="4"
        strokeDasharray="16 14"
      />
    </>
  );
}

function StationSky({ lights = false, children }: { lights?: boolean; children?: ReactNode }) {
  return (
    <Backdrop top="#dbeafe" bottom="#f8fafc">
      <Sun x={72} y={68} />
      <Cloud x={210} y={58} />
      <Cloud x={520} y={84} scale={0.8} />
      <ellipse cx="760" cy="168" rx="108" ry="90" fill="#0f172a" />
      {lights ? (
        <>
          <circle cx="724" cy="162" r="8" fill="#fde68a" className="story-blink" />
          <circle cx="762" cy="162" r="8" fill="#fde68a" className="story-blink" />
        </>
      ) : null}
      <rect x="0" y="196" width="800" height="8" fill="#64748b" />
      <rect x="0" y="222" width="800" height="8" fill="#64748b" />
      <PlatformBand />
      {children}
    </Backdrop>
  );
}

function City() {
  return (
    <g>
      {[0, 320].map((shift) => (
        <g key={shift} transform={`translate(${shift} 0)`}>
          <rect x="0" y="70" width="48" height="110" rx="4" fill="#93c5fd" />
          <rect x="58" y="36" width="44" height="144" rx="4" fill="#bfdbfe" />
          <rect x="112" y="86" width="40" height="94" rx="4" fill="#fde68a" />
          <rect x="162" y="48" width="52" height="132" rx="4" fill="#fda4af" />
          <rect x="226" y="146" width="70" height="26" rx="6" fill="#ef4444" />
          <circle cx="244" cy="172" r="6" fill="#0f172a" />
          <circle cx="278" cy="172" r="6" fill="#0f172a" />
        </g>
      ))}
    </g>
  );
}

function WindowView({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <>
      <clipPath id="story-window" clipPathUnits="userSpaceOnUse">
        <rect x={x} y={y} width={width} height={height} rx="18" />
      </clipPath>
      <g clipPath="url(#story-window)">
        <rect x={x} y={y} width={width} height={height} fill="#bae6fd" />
        <g transform={`translate(${x} ${y + height - 180})`}>
          <g className="story-scroll">
            <City />
          </g>
        </g>
      </g>
      <rect x={x} y={y} width={width} height={height} rx="18" fill="none" stroke="#0f172a" strokeWidth="6" />
    </>
  );
}

function Carriage({ children }: { children: ReactNode }) {
  return (
    <>
      <rect width="800" height="460" fill="#f8fafc" />
      <rect x="0" y="318" width="800" height="142" fill="#94a3b8" />
      <rect x="0" y="318" width="800" height="10" fill="#64748b" />
      {children}
    </>
  );
}

function Seat({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="108" height="78" rx="14" fill="#fb923c" />
      <rect width="108" height="16" rx="8" fill="#ea580c" />
    </g>
  );
}

function Pole({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y="36" width="10" height="290" rx="5" fill="#cbd5e1" />
      <circle cx={x + 5} cy="34" r="16" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="4" />
    </g>
  );
}

function MetroMorning() {
  return (
    <Backdrop top="#dbeafe" bottom="#ecfccb">
      <Sun x={78} y={72} />
      <Cloud x={240} y={64} />
      <Cloud x={430} y={96} scale={0.7} />
      <rect x="0" y="340" width="800" height="120" fill="#86efac" />
      <At x={48} y={268}>
        <path d="M-10 48 L70 -16 L150 48" fill="#fb7185" />
        <rect width="140" height="96" y="48" rx="8" fill="#fff7ed" />
        <rect x="18" y="68" width="24" height="22" rx="3" fill="#bae6fd" />
        <rect x="96" y="68" width="24" height="22" rx="3" fill="#bae6fd" />
        <rect x="56" y="92" width="26" height="52" rx="4" fill="#fdba74" />
      </At>
      <g transform="translate(500 214)">
        <rect width="176" height="150" rx="18" fill="#0f172a" />
        <text x="88" y="68" textAnchor="middle" fontSize="40" fontWeight="800" fill="#ffffff">
          地铁
        </text>
        <text x="88" y="108" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fde68a">
          Subway
        </text>
      </g>
      <At x={560} y={150} motion="story-peek">
        <g transform="scale(0.48)">
          <Train />
        </g>
      </At>
      <At x={250} y={438}>
        <Adult />
      </At>
      <At x={360} y={438} motion="story-bob">
        <Kid />
      </At>
    </Backdrop>
  );
}

function MetroPlatform() {
  return (
    <StationSky>
      <Tag x={24} y={28}>
        站台
      </Tag>
      <At x={300} y={438}>
        <Adult />
      </At>
      <At x={200} y={438} motion="story-bob">
        <Kid />
      </At>
    </StationSky>
  );
}

function MetroWalk() {
  return (
    <StationSky>
      <Tag x={620} y={276}>
        黄线
      </Tag>
      <At x={180} y={438}>
        <Adult />
      </At>
      <At x={330} y={438} motion="story-bob">
        <Kid />
      </At>
    </StationSky>
  );
}

function MetroWind() {
  return (
    <StationSky>
      {[0, 1, 2, 3].map((item) => (
        <line
          key={item}
          x1="80"
          y1={78 + item * 22}
          x2="210"
          y2={78 + item * 22}
          className="story-wind"
          style={{ animationDelay: `${item * 0.18}s` }}
        />
      ))}
      <At x={8} y={18}>
        <g transform="scale(0.58)">
          <Train />
        </g>
      </At>
      <Tag x={620} y={28} tone="dark">
        站台
      </Tag>
      <path
        d="M230 400 Q310 330 390 250"
        stroke="#fdc89a"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <At x={180} y={438}>
        <Adult />
      </At>
      <At x={420} y={228} motion="story-bob">
        <Kid mood="oh" />
      </At>
      <At x={520} y={150} motion="story-hat">
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#fb7185" />
        <rect x="-12" y="-16" width="24" height="14" rx="4" fill="#fb7185" />
      </At>
    </StationSky>
  );
}

function MetroSafe() {
  return (
    <StationSky>
      <At x={80} y={64} motion="story-train">
        <g transform="scale(0.78)">
          <Train open />
        </g>
      </At>
      <Tag x={600} y={276}>
        黄线
      </Tag>
      <At x={150} y={438}>
        <Adult />
      </At>
      <At x={280} y={438} motion="story-bob">
        <Kid />
      </At>
    </StationSky>
  );
}

function MetroSeat() {
  return (
    <Carriage>
      <WindowView x={520} y={48} width={230} height={180} />
      <Pole x={230} />
      <Seat x={330} y={300} />
      <At x={90} y={430}>
        <Adult />
      </At>
      <At x={180} y={430}>
        <Kid />
      </At>
      <At x={500} y={430}>
        <Adult shirt="#c4b5fd" hat="bun" />
      </At>
    </Carriage>
  );
}

function MetroSit() {
  return (
    <Carriage>
      <WindowView x={430} y={40} width={320} height={210} />
      <Seat x={80} y={300} />
      <At x={134} y={372}>
        <Kid pose="sit" />
      </At>
      <At x={280} y={430}>
        <Adult />
      </At>
      <Tag x={40} y={28}>
        座位
      </Tag>
    </Carriage>
  );
}

function MetroThanks() {
  return (
    <Carriage>
      <WindowView x={500} y={48} width={250} height={180} />
      <Pole x={300} />
      <Seat x={80} y={300} />
      <At x={134} y={372}>
        <Adult shirt="#c4b5fd" hat="bun" pose="sit" />
      </At>
      <Bubble x={40} y={150} text="谢谢" />
      <At x={250} y={430} motion="story-bob">
        <Kid />
      </At>
      <Tag x={620} y={250}>
        让座
      </Tag>
    </Carriage>
  );
}

function MetroCarry() {
  return (
    <Backdrop top="#e0f2fe" bottom="#f8fafc">
      <rect x="0" y="300" width="800" height="160" fill="#e2e8f0" />
      <rect x="210" y="146" width="70" height="164" rx="14" fill="#0f172a" />
      <rect x="520" y="146" width="70" height="164" rx="14" fill="#0f172a" />
      <rect x="222" y="170" width="46" height="28" rx="6" fill="#fde68a" />
      <g className="story-gate-l">
        <rect x="318" y="206" width="18" height="94" rx="6" fill="#fb7185" />
      </g>
      <g className="story-gate-r">
        <rect x="464" y="206" width="18" height="94" rx="6" fill="#fb7185" />
      </g>
      <Tag x={348} y={92}>
        闸机
      </Tag>
      <At x={120} y={438}>
        <HoldPair />
      </At>
    </Backdrop>
  );
}

function MetroTunnel() {
  return (
    <StationSky lights>
      <Tag x={24} y={28} tone="dark">
        列车
      </Tag>
      <At x={250} y={438}>
        <HoldPair />
      </At>
    </StationSky>
  );
}

function MetroLook() {
  return (
    <Carriage>
      <rect x="36" y="28" width="330" height="150" rx="20" fill="#0f172a" />
      <text x="201" y="78" textAnchor="middle" fontSize="28" fontWeight="800" fill="#ffffff">
        线路图
      </text>
      <text x="201" y="118" textAnchor="middle" fontSize="18" fill="#7dd3fc">
        Route map
      </text>
      <WindowView x={400} y={28} width={360} height={170} />
      <Tag x={430} y={210}>
        窗户
      </Tag>
      <At x={360} y={438}>
        <HoldPair />
      </At>
    </Carriage>
  );
}

function MetroMap() {
  return (
    <Carriage>
      <rect x="50" y="24" width="700" height="176" rx="24" fill="#0f172a" />
      <text x="400" y="64" textAnchor="middle" fontSize="24" fontWeight="800" fill="#ffffff">
        线路图
      </text>
      <line x1="120" y1="108" x2="680" y2="108" stroke="#38bdf8" strokeWidth="6" />
      {[
        [150, "家"],
        [300, "学校"],
        [450, "商店"],
      ].map(([x, label]) => (
        <g key={label}>
          <circle cx={x as number} cy="108" r="9" fill="#ffffff" />
          <text x={x as number} y="146" textAnchor="middle" fontSize="16" fill="#e2e8f0">
            {label}
          </text>
        </g>
      ))}
      <circle cx="610" cy="108" r="12" fill="#facc15" className="story-blink" />
      <text x="610" y="146" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fde68a">
        公园
      </text>
      <text x="610" y="84" textAnchor="middle" fontSize="14" fill="#fde68a">
        下一站
      </text>
      <At x={230} y={438}>
        <HoldPair />
      </At>
    </Carriage>
  );
}

function MetroWindow() {
  return (
    <Carriage>
      <WindowView x={250} y={28} width={510} height={250} />
      <Tag x={36} y={36}>
        窗户
      </Tag>
      <At x={130} y={438}>
        <HoldPair />
      </At>
    </Carriage>
  );
}

export const metroDrawers = {
  "metro-morning": MetroMorning,
  "metro-platform": MetroPlatform,
  "metro-walk": MetroWalk,
  "metro-wind": MetroWind,
  "metro-safe": MetroSafe,
  "metro-seat": MetroSeat,
  "metro-sit": MetroSit,
  "metro-thanks": MetroThanks,
  "metro-carry": MetroCarry,
  "metro-tunnel": MetroTunnel,
  "metro-look": MetroLook,
  "metro-map": MetroMap,
  "metro-window": MetroWindow,
};
