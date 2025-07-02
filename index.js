let hunger = 0;
let personalFeeds = parseInt(localStorage.getItem("myFeeds") || "0");
const hungerLabel = document.getElementById("hunger-label");
const personalCounter = document.getElementById("personal-counter");
const counterDisplay = document.getElementById("feed-counter");

// Speech on load
window.addEventListener('DOMContentLoaded', () => {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance("Feeling HONGEEE?");
    speechSynthesis.speak(speech);
  }
});

// Timer
const startTime = new Date('2025-04-02T14:00:00').getTime();
const timerElement = document.getElementById("timer");
setInterval(() => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerElement.textContent = `Time Dancing: ${elapsed}s`;
}, 1000);

// Music button
document.getElementById('play-audio').addEventListener('click', () => {
  document.getElementById('bg-music').play();
});

// Global counter functions using YOUR BACKEND API
async function fetchInitialCounter() {
  try {
    const res = await fetch('https://hongeee.xyz//counter');
    const data = await res.json();
    counterDisplay.textContent = `Total Feeds: ${data.count}`;
  } catch (e) {
    counterDisplay.textContent = "Total Feeds: Error";
    console.error("Initial feed counter error:", e);
  }
}

async function updateFeedCounter() {
  try {
    const res = await fetch('http://localhost:3000/counter', {
      method: 'POST'
    });
    const data = await res.json();
    counterDisplay.textContent = `Total Feeds: ${data.count}`;
  } catch (e) {
    counterDisplay.textContent = "Total Feeds: Error";
    console.error("Feed counter error:", e);
  }
}

// Personal counter
function updatePersonalCounter() {
  personalCounter.textContent = `Your Feeds: ${personalFeeds}`;
}

// Hunger bar
function updateHungerDisplay() {
  hungerLabel.textContent = `Hunger: ${Math.round(hunger)}%`;
  document.getElementById("hunger-bar").style.width = hunger + "%";
}

// Emoji animation
function dropEmojis() {
  for (let i = 0; i < 30; i++) {
    const emoji = document.createElement("div");
    emoji.textContent = "🍗";
    emoji.style.position = "fixed";
    emoji.style.left = Math.random() * window.innerWidth + "px";
    emoji.style.top = Math.random() * window.innerHeight + "px";
    emoji.style.fontSize = "2rem";
    emoji.style.zIndex = "9999";
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1000);
  }
}

// Feed button click handler
document.getElementById("feed-button").addEventListener("click", () => {
  // Show fullscreen GIF
  document.getElementById("fullscreen-gif").style.display = "flex";
  setTimeout(() => {
    document.getElementById("fullscreen-gif").style.display = "none";
  }, 3000);

  // Emojis
  dropEmojis();

  // Update counters
  updateFeedCounter();
  personalFeeds += 1;
  localStorage.setItem("myFeeds", personalFeeds);
  updatePersonalCounter();

  // Update hunger
  hunger = Math.min(100, hunger + 100);
  updateHungerDisplay();
});

// Hunger decay
setInterval(() => {
  if (hunger > 0) {
    hunger = Math.max(0, hunger - 0.001);
    updateHungerDisplay();
  }
}, 100);

// Init on load
window.addEventListener("load", () => {
  fetchInitialCounter();
  updatePersonalCounter();
  updateHungerDisplay();
});
