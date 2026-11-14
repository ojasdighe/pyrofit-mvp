export interface WeatherResult {
  temperature_c: number;
  humidity_pct: number;
  apparent_temperature_c: number;
  wet_bulb_c: number;
  wind_speed_kmh: number;
  city_name: string;
}

// Geocode city → lat/lon
// GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json
export async function geocodeCity(
  cityName: string
): Promise<{ lat: number; lon: number; name: string } | null> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.results?.length) return null;
    const r = data.results[0];
    return { lat: r.latitude, lon: r.longitude, name: r.name };
  } catch {
    return null;
  }
}

// Fetch current weather
// GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&forecast_days=1
export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  cityName: string
): Promise<WeatherResult | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const c = data?.current;
    if (!c) return null;

    const temperature_c: number = c.temperature_2m;
    const humidity_pct: number = c.relative_humidity_2m;
    const apparent_temperature_c: number = c.apparent_temperature;
    const wind_speed_kmh: number = c.wind_speed_10m;

    // Stull 2011 wet-bulb formula
    const T = temperature_c;
    const RH = humidity_pct;
    const wet_bulb_raw =
      T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
      Math.atan(T + RH) -
      Math.atan(RH - 1.676331) +
      0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
      4.686035;
    const wet_bulb_c = Math.round(wet_bulb_raw * 10) / 10;

    return {
      temperature_c,
      humidity_pct,
      apparent_temperature_c,
      wet_bulb_c,
      wind_speed_kmh,
      city_name: cityName,
    };
  } catch {
    return null;
  }
}

export async function fetchWeatherByCity(cityName: string): Promise<WeatherResult | null> {
  const geo = await geocodeCity(cityName);
  if (!geo) return null;
  return fetchCurrentWeather(geo.lat, geo.lon, geo.name);
}
