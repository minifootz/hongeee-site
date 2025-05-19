// Feed me button click event
document.getElementById("feed-button").addEventListener("click", function() {
    let gif = document.getElementById("fullscreen-gif");
    gif.style.display = "flex"; // Show the full-screen GIF

    // Hide the GIF after 3 seconds
    setTimeout(() => {
        gif.style.display = "none"; // Hide the GIF after it plays
    }, 3000); // 3 seconds
});

// Timer Logic
// Timer Logic\
const startTime = new Date('2025-04-02T14:00:00').getTime(); // Set the start time to 2pm on April 2nd, 2025
const timerElement = document.getElementById("timer");

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds
    timerElement.textContent = `Time Dancing: ${elapsedTime}s`; // Update the timer display
}

setInterval(updateTimer, 1000); // Update the timer every second

document.getElementById('play-audio').addEventListener('click', function() {
    const audio = document.getElementById('bg-music');
    audio.play(); // Play audio when the button is clicked
});
