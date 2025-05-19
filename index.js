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


window.addEventListener('DOMContentLoaded', (event) => {
    // Ensure speech synthesis is supported
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance("Feeling HONGEEE?");
        speechSynthesis.speak(speech); // Speak the message

        // Optionally handle when speech ends
        speech.onend = function(event) {
            console.log("Speech has finished.");
        };
    } else {
        console.log("Speech synthesis is not supported in this browser.");
    }
});
