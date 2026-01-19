// ===== CONFIG =====
const API_BASE = "https://fancy-scene-1c4e.jackdonlevy.workers.dev"; // Cloudflare Worker KV URL

// ===== STATE =====
let hunger = parseFloat(localStorage.getItem("hunger")) || 0;
let personalFeeds = parseInt(localStorage.getItem("myFeeds") || "0");

// ===== DOM ELEMENTS =====
const hungerLabel = document.getElementById("hunger-label");
const personalCounter = document.getElementById("personal-counter");
const counterDisplay = document.getElementById("feed-counter");
const feedButton = document.getElementById("feed-button");
const fullscreenGif = document.getElementById("fullscreen-gif");
const hungerBar = document.getElementById("hunger-bar");
const timerElement = document.getElementById("timer");
const playAudioBtn = document.getElementById("play-audio");
const bgMusic = document.getElementById("bg-music");

// ===== SPEECH SYNTHESIS =====
window.addEventListener("DOMContentLoaded", () => {
  if ("speechSynthesis" in window) {
    const speech = new SpeechSynthesisUtterance("Feeling HONGEEE?");
    speechSynthesis.speak(speech);
  }
});

// ===== TIMER =====
const startTime = new Date("2025-04-02T14:00:00").getTime();
if (timerElement) {
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = `Time Dancing: ${elapsed}s`;
  }, 1000);
}

// ===== AUDIO PLAY BUTTON =====
if (playAudioBtn && bgMusic) {
  playAudioBtn.addEventListener("click", () => {
    bgMusic.play();
  });
}

// ===== KV GLOBAL COUNTER =====
async function fetchTotalFeeds() {
  try {
    const res = await fetch(`${API_BASE}/get`);
    const data = await res.json();
    if (counterDisplay) counterDisplay.textContent = `Total Feeds: ${data.count}`;
  } catch (err) {
    console.error("Error fetching total feeds:", err);
    if (counterDisplay) counterDisplay.textContent = "Total Feeds: Error";
  }
}

async function incrementTotalFeeds() {
  try {
    const res = await fetch(`${API_BASE}/inc`, { method: "POST" });
    const data = await res.json();
    if (counterDisplay) counterDisplay.textContent = `Total Feeds: ${data.count}`;
  } catch (err) {
    console.error("Error incrementing total feeds:", err);
    if (counterDisplay) counterDisplay.textContent = "Total Feeds: Error";
  }
}

// ===== PERSONAL COUNTER =====
function updatePersonalCounter() {
  if (personalCounter) personalCounter.textContent = `Your Feeds: ${personalFeeds}`;
}

// ===== HUNGER BAR =====
function updateHungerDisplay() {
  if (hungerLabel) hungerLabel.textContent = `Hunger: ${Math.round(hunger)}%`;
  if (hungerBar) hungerBar.style.width = `${Math.min(hunger, 100)}%`;
}

// ===== EMOJI ANIMATION =====
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

// ===== FEED BUTTON =====
if (feedButton && fullscreenGif) {
  feedButton.addEventListener("click", async () => {
    feedButton.disabled = true;

    // Show fullscreen GIF
    fullscreenGif.style.display = "flex";
    setTimeout(() => (fullscreenGif.style.display = "none"), 3000);

    // Drop emojis
    dropEmojis();

    // Update global feed counter
    await incrementTotalFeeds();

    // Update personal feed counter
    personalFeeds++;
    localStorage.setItem("myFeeds", personalFeeds);
    updatePersonalCounter();

    // Update hunger
    hunger = Math.min(100, hunger + 25);
    localStorage.setItem("hunger", hunger);
    updateHungerDisplay();

    feedButton.disabled = false;
  });
}

// ===== HUNGER DECAY =====
setInterval(() => {
  if (hunger > 0) {
    hunger = Math.max(0, hunger - 0.1);
    localStorage.setItem("hunger", hunger);
    updateHungerDisplay();
  }
}, 100);

// ===== INITIALIZE =====
window.addEventListener("load", () => {
  fetchTotalFeeds();
  updatePersonalCounter();
  updateHungerDisplay();
});
