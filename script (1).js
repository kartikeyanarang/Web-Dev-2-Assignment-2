const KEY_WEATHER = "f3d95f5922d88d6363a5b3fbfc9a9189";

async function runFetch(cityName) {
  const query = cityName || cityInput.value.trim();
  if (!query) return;

  weatherBox.innerHTML = "Searching...";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${KEY_WEATHER}`;
    
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Error fetching weather");
    }

    weatherBox.innerHTML = `
      <div>${json.name}</div>
      <div>${Math.round(json.main.temp)}°C</div>
      <div>${json.weather[0].main}</div>
    `;
  } catch (err) {
    weatherBox.innerHTML = err.message;
  }
}
