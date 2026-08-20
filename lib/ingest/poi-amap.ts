type AmapPoi = {
  id: string;
  name: string;
  address?: string;
  type?: string;
  location?: string;
};

type AmapResponse = {
  pois?: AmapPoi[];
  status?: string;
  info?: string;
};

const SEARCH_KEYWORDS = ["亲子公园", "儿童博物馆", "亲子乐园", "动物园"];

function guessDistrict(address?: string) {
  if (!address) {
    return "上海";
  }

  const match = address.match(/(浦东|黄浦|徐汇|长宁|静安|普陀|虹口|杨浦|闵行|宝山|嘉定|松江|青浦|奉贤|金山|崇明)/);
  return match?.[1] ?? "上海";
}

export async function fetchAmapCandidates() {
  const apiKey = process.env.AMAP_API_KEY;
  if (!apiKey) {
    return {
      items: [] as Array<{
        externalId: string;
        title: string;
        summary: string;
        district: string;
        rawPayload: Record<string, unknown>;
      }>,
      skipped: true,
      reason: "未配置 AMAP_API_KEY",
    };
  }

  const items: Array<{
    externalId: string;
    title: string;
    summary: string;
    district: string;
    rawPayload: Record<string, unknown>;
  }> = [];

  for (const keyword of SEARCH_KEYWORDS) {
    const url = new URL("https://restapi.amap.com/v3/place/text");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("keywords", keyword);
    url.searchParams.set("city", "上海");
    url.searchParams.set("citylimit", "true");
    url.searchParams.set("offset", "5");
    url.searchParams.set("page", "1");

    const response = await fetch(url.toString());
    if (!response.ok) {
      continue;
    }

    const payload = (await response.json()) as AmapResponse;
    if (payload.status !== "1" || !payload.pois) {
      continue;
    }

    for (const poi of payload.pois) {
      items.push({
        externalId: poi.id,
        title: poi.name,
        summary: poi.address ?? "来自高德地图的候选地点，待人工补充玩法。",
        district: guessDistrict(poi.address),
        rawPayload: {
          keyword,
          address: poi.address,
          type: poi.type,
          location: poi.location,
        },
      });
    }
  }

  return {
    items,
    skipped: false,
    reason: null,
  };
}
