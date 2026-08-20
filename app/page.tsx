import Link from "next/link";

const highlights = [
  "基础信息只填一次，以后不用重复录入",
  "每天只问一句：今天想怎么带娃",
  "一次抽 3 张卡，快速定下周末安排",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff1f2_0%,#fff7ed_35%,#fffdf8_100%)] px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-rose-500 shadow-sm">
              上海周边遛娃灵感抽卡器
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                周末不知道带娃去哪？
                <br />
                让系统帮你抽出今天最合适的 3 个选择。
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                孩子的年龄和你们的出行习惯会记住；每次抽卡只问今天想出门、在家还是放电，
                从上海周边地点、居家手工和亲子运动里，快速给出 3 个可执行选项。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/ask"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5"
              >
                今天带娃抽什么
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-300"
              >
                基础设置
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/70 bg-white/80 px-4 py-4 text-sm leading-6 text-slate-600 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/80 bg-white/90 p-6 shadow-xl shadow-orange-100/60">
            <div className="rounded-[28px] bg-slate-900 p-5 text-white">
              <div className="text-sm text-orange-200">模拟对话</div>
              <div className="mt-3 space-y-3">
                <div className="max-w-xs rounded-3xl rounded-bl-md bg-white/10 px-4 py-3 text-sm">
                  今天想出门还是在家玩？
                </div>
                <div className="ml-auto max-w-[220px] rounded-3xl rounded-br-md bg-rose-300 px-4 py-3 text-sm font-medium text-slate-950">
                  想出去转转，但别太折腾。
                </div>
                <div className="max-w-xs rounded-3xl rounded-bl-md bg-white/10 px-4 py-3 text-sm">
                  那我给你抽 3 张适合上海周边低龄家庭的卡。
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["滨江慢走", "自然馆", "客厅障碍赛"].map((card, index) => (
                <div
                  key={card}
                  className="rounded-[28px] bg-[linear-gradient(180deg,#fff7ed_0%,#ffe4e6_100%)] px-4 py-6 text-center shadow-sm"
                >
                  <div className="text-xs font-medium text-rose-500">第 {index + 1} 张</div>
                  <div className="mt-3 text-lg font-bold text-slate-900">{card}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-[36px] border border-orange-100 bg-white px-6 py-6 shadow-sm sm:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-rose-500">1. 记住你们家</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              年龄段、节奏、出行半径只设置一次，存在本机。
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-rose-500">2. 今天怎么带</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              每次只选出门、居家或放电，可选填时长。
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-rose-500">3. 越用越准</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              通过“喜欢 / 不适合 / 已去过”，下次推荐会更贴近你家。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
