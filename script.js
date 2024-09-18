let score = 0;
let gameActive = true;
const directionsQueue = [];
const maxQueueSize = 5;
let progressBarDuration = 5000; // Initial duration of progress bar draining in milliseconds
const minDuration = 1000; // Minimum duration for progress bar draining
const refillAmount = 20; // Amount the bar refills with each correct press (in %)
const drainSpeedIncrement = 500; // Speed increment for the progress bar draining (in milliseconds)

const instructions = document.getElementById('instructions');
const indicator = document.getElementById('indicator');
const progressBar = document.getElementById('progress-bar');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const restartButton = document.getElementById('restartButton');
const mainMenuButton = document.getElementById('mainMenuButton');
const mainMenuSmallButton = document.getElementById('mainMenuSmallButton');

let progressBarInterval;
let progressBarWidth = 100;
let currentDrainingRate;

// Get high score from localStorage, default to 0 if not found
let highScore = localStorage.getItem('highScore') || 0;
highScoreDisplay.textContent = `High Score: ${highScore}`;

function getRandomDirection() {
    return Math.random() < 0.5 ? 'left' : 'right';
}

function setIndicator(direction) {
    // Change background color based on the direction
    if (direction === 'left') {
        document.body.style.backgroundColor = '#ff6666'; // Red for left
        indicator.textContent = '←';
    } else {
        document.body.style.backgroundColor = '#66ff66'; // Green for right
        indicator.textContent = '→';
    }

    // Add bounce animation and smooth fade transition
    indicator.style.opacity = '0'; // Fade out
    setTimeout(() => {
        indicator.style.opacity = '1'; // Fade in
        indicator.style.animation = 'bounce 0.5s'; // Bounce animation
        setTimeout(() => {
            indicator.style.animation = ''; // Reset animation
        }, 500); // Duration of bounce animation
    }, 250); // Duration of fade out transition
}

function startNewRound() {
    if (!gameActive) return;

    const newDirection = getRandomDirection();
    directionsQueue[0] = newDirection; // Replace the current direction
    setIndicator(newDirection);
    resetProgressBar();
}

function updateScore() {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    // Adjust progress bar draining rate and refill amount
    if (progressBarDuration > minDuration) {
        progressBarDuration -= drainSpeedIncrement;
    }
}

function endGame() {
    gameActive = false;
    instructions.textContent = `Game Over! Your Score: ${score}`;
    document.body.style.backgroundColor = '#f0f0f0'; // Reset background color
    progressBar.style.width = '0%'; // Reset progress bar width
    clearInterval(progressBarInterval); // Clear the progress bar interval
    restartButton.style.display = 'block'; // Show the restart button
    mainMenuButton.style.display = 'block'; // Show the main menu button

    // Check if current score is higher than the high score
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
        localStorage.setItem('highScore', highScore); // Save new high score
    }
}

function handleButtonClick(direction) {
    if (!gameActive) return;

    if (direction === directionsQueue[0]) {
        updateScore();
        startNewRound(); // Start a new round with a new direction
    } else {
        endGame();
    }
}

function handleKeyPress(event) {
    if (!gameActive) return;

    if (event.key === 'a' || event.key === 'A') {
        handleButtonClick('left');
    } else if (event.key === 'd' || event.key === 'D') {
        handleButtonClick('right');
    } else if (event.key === ' ' && !gameActive) { // Space bar pressed and game is not active
        restartGame();
    }
}

function resetProgressBar() {
    progressBarWidth = 100;
    progressBar.style.width = progressBarWidth + '%';
    clearInterval(progressBarInterval); // Clear any existing interval
    currentDrainingRate = 100 / (progressBarDuration / 100); // Calculate the rate of draining
    progressBarInterval = setInterval(() => {
        progressBarWidth -= currentDrainingRate;
        if (progressBarWidth <= 0) {
            progressBarWidth = 0;
            clearInterval(progressBarInterval);
            endGame(); // End the game if the progress bar is drained
        }
        progressBar.style.width = progressBarWidth + '%';
    }, 100);
}

function restartGame() {
    score = 0;
    progressBarDuration = 5000; // Reset the progress bar duration
    scoreDisplay.textContent = `Score: ${score}`;
    instructions.textContent = 'Tap the indicated direction!';
    restartButton.style.display = 'none'; // Hide the restart button
    mainMenuButton.style.display = 'none'; // Hide the main menu button
    gameActive = true;
    directionsQueue.length = 0; // Clear the direction queue
    startNewRound(); // Start a new game round
}

function goToMainMenu() {
    // Implement the functionality for going to the main menu
    // For example, redirect to another page:
    window.location.href = 'index.html'; // Adjust the URL to your main menu page
}

leftButton.addEventListener('click', () => handleButtonClick('left'));
rightButton.addEventListener('click', () => handleButtonClick('right'));
document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', restartGame);
mainMenuButton.addEventListener('click', goToMainMenu);
mainMenuSmallButton.addEventListener('click', goToMainMenu);

// Start the game with an initial direction
startNewRound();
