let score = 0;
let gameActive = true;

const instructions = document.getElementById('instructions');
const scoreDisplay = document.getElementById('score');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

function getRandomDirection() {
    return Math.random() < 0.5 ? 'left' : 'right';
}

function updateScore() {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
}

function endGame() {
    gameActive = false;
    instructions.textContent = `Game Over! Your Score: ${score}`;
}

function handleButtonClick(direction) {
    if (!gameActive) return;

    if (direction === getRandomDirection()) {
        updateScore();
    } else {
        endGame();
    }
}

leftButton.addEventListener('click', () => handleButtonClick('left'));
rightButton.addEventListener('click', () => handleButtonClick('right'));
