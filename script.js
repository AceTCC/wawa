let score = 0;
let gameActive = true;
const directionsQueue = [];
const maxQueueSize = 5;
let progressBarDuration = 5000;
const minDuration = 1000;
const drainSpeedIncrement = 1000;

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

let highScore = localStorage.getItem('highScore') || 0;
highScoreDisplay.textContent = `High Score: ${highScore}`;

function getRandomDirection() {
    return Math.random() < 0.5 ? 'left' : 'right';
}

function setIndicator(direction) {
    indicator.textContent = direction === 'left' ? '←' : '→';
    document.body.style.backgroundColor = direction === 'left' ? '#ff6666' : '#66ff66';
    indicator.style.opacity = '0';
    setTimeout(() => {
        indicator.style.opacity = '1';
        indicator.style.animation = 'bounce 0.5s';
        setTimeout(() => {
            indicator.style.animation = '';
        }, 500);
    }, 250);
}

function startNewRound() {
    if (!gameActive) return;
    const newDirection = getRandomDirection();
    directionsQueue[0] = newDirection;
    setIndicator(newDirection);
    resetProgressBar();
}

function updateScore() {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    if (progressBarDuration > minDuration) {
        progressBarDuration -= drainSpeedIncrement;
    }
}

function endGame() {
    gameActive = false;
    instructions.textContent = `Game Over! Your Score: ${score}`;
    document.body.style.backgroundColor = '#f0f0f0';
    progressBar.style.width = '0%';
    clearInterval(progressBarInterval);
    restartButton.style.display = 'block';
    mainMenuButton.style.display = 'block';
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
        localStorage.setItem('highScore', highScore);
    }
}

function handleButtonClick(direction) {
    if (!gameActive) return;
    if (direction === directionsQueue[0]) {
        updateScore();
        startNewRound();
    } else {
        endGame();
    }
}

function handleKeyPress(event) {
    if (!gameActive) return;
    if (event.key.toLowerCase() === 'a') {
        handleButtonClick('left');
    } else if (event.key.toLowerCase() === 'd') {
        handleButtonClick('right');
    } else if (event.key === ' ' && !gameActive) {
        restartGame();
    }
}

function resetProgressBar() {
    progressBarWidth = 100;
    progressBar.style.width = `${progressBarWidth}%`;
    clearInterval(progressBarInterval);
    const currentDrainingRate = 100 / (progressBarDuration / 100);
    progressBarInterval = setInterval(() => {
        progressBarWidth -= currentDrainingRate;
        if (progressBarWidth <= 0) {
            progressBarWidth = 0;
            clearInterval(progressBarInterval);
            endGame();
        }
        progressBar.style.width = `${progressBarWidth}%`;
    }, 100);
}

function restartGame() {
    score = 0;
    progressBarDuration = 5000;
    scoreDisplay.textContent = `Score: ${score}`;
    instructions.textContent = 'Tap the indicated direction!';
    restartButton.style.display = 'none';
    mainMenuButton.style.display = 'none';
    gameActive = true;
    directionsQueue.length = 0;
    startNewRound();
}

function goToMainMenu() {
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
