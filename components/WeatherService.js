// components/weatherService.js
export async function fetchWeather(city) {
  const API_KEY = "d3d43d7c52fc42b9bf2133532262905";
  const BASE_URL = "https://api.weatherapi.com/v1/current.json";

  try {
    const res = await fetch(`${BASE_URL}?key=${API_KEY}&q=${city}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Weather API error:", err);
    return null;
  }
}
