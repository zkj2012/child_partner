import type { ReactNode } from "react";

import {
  Adult,
  At,
  Backdrop,
  Bubble,
  Cloud,
  Kid,
  Lawn,
  PoliceCar,
  Sun,
  Tag,
  ToyCar,
  Tree,
} from "@/components/stories/kit";

function Yard({ children }: { children?: ReactNode }) {
  return (
    <Backdrop top="#e0f2fe" bottom="#fef9c3">
      <Sun x={86} y={68} />
      <Cloud x={250} y={60} />
      <Cloud x={460} y={88} scale={0.75} />
      <At x={720} y={318}>
        <g transform="scale(0.82)">
          <Tree />
        </g>
      </At>
      <Lawn />
      {children}
    </Backdrop>
  );
}

function Block({ x, y, fill }: { x: number; y: number; fill: string }) {
  return <rect x={x} y={y} width="36" height="28" rx="6" fill={fill} />;
}

function ToyYard() {
  return (
    <Yard>
      <At x={200} y={430} motion="story-bob">
        <Kid />
      </At>
      <At x={330} y={430}>
        <ToyCar />
      </At>
      <At x={690} y={430}>
        <g transform="scale(0.72)">
          <Kid shirt="#34d399" />
        </g>
      </At>
      <Tag x={250} y={236}>
        玩具
      </Tag>
    </Yard>
  );
}

function ToyAsk() {
  return (
    <Yard>
      <At x={180} y={430}>
        <Kid />
      </At>
      <At x={330} y={430}>
        <ToyCar />
      </At>
      <At x={500} y={430} motion="story-bob">
        <Kid shirt="#34d399" />
      </At>
      <Bubble x={470} y={250} text="我想玩" />
    </Yard>
  );
}

function ToyShare() {
  return (
    <Yard>
      <At x={180} y={430}>
        <Kid />
      </At>
      <At x={400} y={430} motion="story-peek">
        <ToyCar />
      </At>
      <At x={560} y={430} motion="story-bob">
        <Kid shirt="#34d399" />
      </At>
      <Tag x={330} y={240}>
        分享
      </Tag>
    </Yard>
  );
}

function ToyChoice() {
  return (
    <Yard>
      <At x={170} y={430}>
        <Kid />
      </At>
      <At x={400} y={430}>
        <ToyCar />
      </At>
      <At x={590} y={430}>
        <Kid shirt="#34d399" />
      </At>
    </Yard>
  );
}

function ToyTurns() {
  return (
    <Yard>
      <g transform="translate(250 168)">
        {["1", "2", "3"].map((num, index) => (
          <g key={num} transform={`translate(${index * 78} 0)`}>
            <circle cx="24" cy="24" r="24" fill="#ffffff" />
            <text x="24" y="32" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0f172a">
              {num}
            </text>
          </g>
        ))}
      </g>
      <At x={160} y={430}>
        <Kid />
      </At>
      <At x={400} y={430} motion="story-along">
        <ToyCar moving />
      </At>
      <At x={620} y={430}>
        <Kid shirt="#34d399" />
      </At>
      <Tag x={36} y={36}>
        轮流
      </Tag>
    </Yard>
  );
}

function ToyRoad() {
  return (
    <Yard>
      <Block x={70} y={330} fill="#f59e0b" />
      <Block x={112} y={330} fill="#38bdf8" />
      <Block x={154} y={330} fill="#a78bfa" />
      <rect x="70" y="368" width="640" height="34" rx="8" fill="#94a3b8" />
      <line x1="90" y1="385" x2="690" y2="385" stroke="#fde68a" strokeWidth="4" strokeDasharray="16 12" />
      <At x={180} y={400} motion="story-along">
        <ToyCar moving />
      </At>
      <At x={120} y={430}>
        <Kid />
      </At>
      <At x={620} y={430} motion="story-bob">
        <Kid shirt="#34d399" />
      </At>
      <Tag x={360} y={300}>
        马路
      </Tag>
    </Yard>
  );
}

function ToyCry() {
  return (
    <Yard>
      <At x={250} y={430}>
        <Kid mood="oh" />
      </At>
      <At x={390} y={430}>
        <ToyCar />
      </At>
      <At x={560} y={430}>
        <Kid shirt="#34d399" mood="sad" pose="sit" />
      </At>
    </Yard>
  );
}

function ToyPolice() {
  return (
    <Yard>
      <rect x="0" y="392" width="800" height="68" fill="#cbd5e1" />
      <At x={130} y={438}>
        <Kid shirt="#34d399" mood="sad" pose="sit" />
      </At>
      <At x={300} y={430}>
        <Kid mood="oh" />
      </At>
      <At x={430} y={430}>
        <ToyCar />
      </At>
      <At x={640} y={404} motion="story-drive">
        <PoliceCar lights moving />
      </At>
      <At x={530} y={430} motion="story-officer">
        <Adult shirt="#2563eb" hat="cap" />
      </At>
    </Yard>
  );
}

function ToySorry() {
  return (
    <Yard>
      <At x={180} y={430}>
        <Kid />
      </At>
      <Bubble x={120} y={230} text="对不起" />
      <At x={360} y={430}>
        <Kid shirt="#34d399" mood="sad" />
      </At>
      <At x={560} y={430}>
        <Adult shirt="#2563eb" hat="cap" />
      </At>
      <At x={700} y={400}>
        <g transform="scale(0.72)">
          <PoliceCar lights />
        </g>
      </At>
    </Yard>
  );
}

function ToyMend() {
  return (
    <Yard>
      <At x={180} y={430}>
        <Kid />
      </At>
      <At x={360} y={430} motion="story-peek">
        <ToyCar moving />
      </At>
      <At x={520} y={430} motion="story-bob">
        <Kid shirt="#34d399" />
      </At>
      <At x={680} y={400} motion="story-leave">
        <g transform="scale(0.7)">
          <PoliceCar lights={false} moving />
        </g>
      </At>
      <Tag x={36} y={36}>
        和好
      </Tag>
    </Yard>
  );
}

function ToyBye() {
  return (
    <Yard>
      <At x={160} y={430}>
        <Kid mood="oh" />
      </At>
      <At x={300} y={430}>
        <ToyCar />
      </At>
      <At x={540} y={430} motion="story-walkoff">
        <g transform="scale(0.78)">
          <Kid shirt="#34d399" mood="sad" />
        </g>
      </At>
      <At x={760} y={400} motion="story-leave">
        <g transform="scale(0.7)">
          <PoliceCar lights={false} />
        </g>
      </At>
    </Yard>
  );
}

export const toyDrawers = {
  "toy-yard": ToyYard,
  "toy-ask": ToyAsk,
  "toy-share": ToyShare,
  "toy-choice": ToyChoice,
  "toy-turns": ToyTurns,
  "toy-road": ToyRoad,
  "toy-cry": ToyCry,
  "toy-police": ToyPolice,
  "toy-sorry": ToySorry,
  "toy-mend": ToyMend,
  "toy-bye": ToyBye,
};
