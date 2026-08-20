const SHANGHAI = { latitude: 31.2304, longitude: 121.4737 };

type WeatherCondition = "sunny" | "cloudy" | "rainy";

function mapWeatherCode(code: number): WeatherCondition {
  if (code === 0) {
    return "sunny";
  }

  if ([1, 2, 3, 45, 48].includes(code)) {
    return "cloudy";
  }

  return "rainy";
}

export async function fetchShanghaiWeather() {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(SHANGHAI.latitude));
  url.searchParams.set("longitude", String(SHANGHAI.longitude));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("timezone", "Asia/Shanghai");

  const response = await fetch(url.toString(), {
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`天气接口返回 ${response.status}`);
  }

  const payload = (await response.json()) as {
    current?: {
      temperature_2m?: number;
      weather_code?: number;
    };
  };

  const code = payload.current?.weather_code ?? 3;

  return {
    city: "上海",
    condition: mapWeatherCode(code),
    tempC: payload.current?.temperature_2m ?? null,
  };
}

export type WeatherFetchResult = Awaited<ReturnType<typeof fetchShanghaiWeather>>;
