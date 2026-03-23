const KEY_WEATHER = "f3d95f5922d88d6363a5b3fbfc9a9189";

const monitorOutput = document.getElementById("signalConsole");
const weatherBox = document.getElementById("weatherOutput");
const cityInput = document.getElementById("citySearchInput");

const logEvent = (text, type) => {
  const line = document.createElement("div");
  line.className = `signal-line signal-${type}`;
  const now = new Date().toLocaleTimeString();
  line.innerHTML = `<span>[${now}]</span> ${text}`;
  monitorOutput.appendChild(line);
  monitorOutput.scrollTop = monitorOutput.scrollHeight;
};

function updateHistoryView() {
  const historyList = document.getElementById("historyList");
  const clearBtn = document.getElementById("clearHistoryBtn");
  const data = JSON.parse(localStorage.getItem("sky_cache")) || [];
  
  historyList.innerHTML = "";
  clearBtn.style.display = data.length > 0 ? "inline-block" : "none";

  data.forEach(name => {
    const chip = document.createElement("span");
    chip.className = "history-chip";
    chip.innerText = name;
    chip.onclick = () => runFetch(name); 
    historyList.appendChild(chip);
  });
}

const storeCity = (name) => {
  let stack = JSON.parse(localStorage.getItem("sky_cache")) || [];
  stack = stack.filter(item => item.toLowerCase() !== name.toLowerCase());
  stack.unshift(name);
  localStorage.setItem("sky_cache", JSON.stringify(stack.slice(0, 8)));
};

async function runFetch(cityName) {
  const query = cityName || cityInput.value.trim();
  if (!query) return;

  weatherBox.innerHTML = "Searching...";
  monitorOutput.innerHTML = ""; 

  logEvent("SYNC: Started", "sync");
  Promise.resolve().then(() => logEvent("MICRO: Promise", "micro"));
  setTimeout(() => logEvent("MACRO: Timeout", "macro"), 0);

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${KEY_WEATHER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const json = await response.json();
    
    weatherBox.innerHTML = `
      <div class="result-header">${json.name}</div>
      <div class="result-temp">${Math.round(json.main.temp)}°C</div>
      <div class="result-grid">
        <div>Sky: ${json.weather[0].main}</div>
        <div>Wind: ${json.wind.speed}m/s</div>
      </div>
    `;

    storeCity(query);
    updateHistoryView();
  } catch (err) {
    weatherBox.innerHTML = err.message;
  }
}

document.getElementById("btnSearch").onclick = () => runFetch();
cityInput.onkeypress = (e) => { if (e.key === "Enter") runFetch(); };
window.clearStorage = () => { localStorage.removeItem("sky_cache"); updateHistoryView(); };
window.onload = updateHistoryView;