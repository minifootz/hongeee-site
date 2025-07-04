const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://hongeee.xyz";

let hunger = parseFloat(localStorage.getItem("hunger")) || 0;
let personalFeeds = parseInt(localStorage.getItem("myFeeds") || "0");

const hungerLabel = document.getElementById("hunger-label");
const personalCounter = document.getElementById("personal-counter");
const counterDisplay = document.getElementById("feed-counter");
const feedButton = document.getElementById("feed-button");
const fullscreenGif = document.getElementById("fullscreen-gif");
const hungerBar = document.getElementById("hunger-bar");

// Speech synthesis on load
window.addEventListener("DOMContentLoaded", () => {
  if ("speechSynthesis" in window) {
    const speech = new SpeechSynthesisUtterance("Feeling HONGEEE?");
    speechSynthesis.speak(speech);
  }
});

// Timer since start
const startTime = new Date("2025-04-02T14:00:00").getTime();
const timerElement = document.getElementById("timer");
setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerElement.textContent = `Time Dancing: ${elapsed}s`;
}, 1000);

// Music play button
document.getElementById("play-audio").addEventListener("click", () => {
  document.getElementById("bg-music").play();
});


// Fetch total feeds from server
async function fetchInitialCounter() {
  try {
    const res = await fetch(`${API_BASE}/Feed_Num`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    counterDisplay.textContent = `Total Feeds: ${data.Feed_Num}`; // <-- CHANGED
  } catch (e) {
    counterDisplay.textContent = "Total Feeds: Server error";
    console.error("Initial feed counter error:", e);
  }
}

// Increment total feeds
async function updateFeedCounter() {
  try {
    const res = await fetch(`${API_BASE}/Feed_Num`, { method: "POST" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    counterDisplay.textContent = `Total Feeds: ${data.Feed_Num}`; // <-- CHANGED
  } catch (e) {
    counterDisplay.textContent = "Total Feeds: Server error";
    console.error("Feed counter error:", e);
  }
}

// Update your personal feed counter
function updatePersonalCounter() {
  personalCounter.textContent = `Your Feeds: ${personalFeeds}`;
}

// Update hunger bar and label
function updateHungerDisplay() {
  hungerLabel.textContent = `Hunger: ${Math.round(hunger)}%`;
  hungerBar.style.width = `${Math.min(hunger, 100)}%`;
}

// Emoji animation
function dropEmojis() {
  for (let i = 0; i < 30; i++) {
    const emoji = document.createElement("div");
    emoji.textContent = "🍗";
    emoji.style.position = "fixed";
    emoji.style.left = `${Math.random() * window.innerWidth}px`;
    emoji.style.top = `${Math.random() * window.innerHeight}px`;
    emoji.style.fontSize = "2rem";
    emoji.style.zIndex = "9999";
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1000);
  }
}

// Feed button click handler
feedButton.addEventListener("click", async () => {
  // Disable button to prevent spamming
  feedButton.disabled = true;

  // Show fullscreen GIF
  fullscreenGif.style.display = "flex";
  setTimeout(() => {
    fullscreenGif.style.display = "none";
  }, 3000);

  // Emojis
  dropEmojis();

  // Update backend counter
  await updateFeedCounter();

  // Update personal counter
  personalFeeds += 1;
  localStorage.setItem("myFeeds", personalFeeds);
  updatePersonalCounter();

  // Update hunger
  hunger = Math.min(100, hunger + 25);
  updateHungerDisplay();
  localStorage.setItem("hunger", hunger);

  // Re-enable button
  feedButton.disabled = false;
});

// Hunger decay every 100ms for smoother animation
setInterval(() => {
  if (hunger > 0) {
    hunger = Math.max(0, hunger - 0.1);
    localStorage.setItem("hunger", hunger);
    updateHungerDisplay();
  }
}, 100);

// Initialize
window.addEventListener("load", () => {
  fetchInitialCounter();
  updatePersonalCounter();
  updateHungerDisplay();
});
