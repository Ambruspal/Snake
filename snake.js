// canvas color: #caeec2
// Snake color: #14BD37
// Apple color: #FF0000

const hintsDiv = document.querySelector('.hint-holder');
const gameOverDiv = document.querySelector('.game-over');
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('.score');
const speedEl = document.querySelector('.speed');
const startGameButton = document.querySelector('.start');

const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

const box = 10;
const snake = [];
let timerId;
const apple = [];
let score = 0;
const speedList = [
    220, 160, 140, 120, 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28,
    26, 24, 22, 20, 18, 16, 14, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0.5, 0.4, 0.3, 0.2, 0.1,
];
let curIndex = 0;
let curSpeed = `${curIndex + 1}00`;

const directions = [
    [box, 0], // right
    [0, box], //down
    [-1 * box, 0], // left
    [0, -1 * box], // up
];

let actDirection = directions[0];

// --------------------------- Print Table -----------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    hintsDiv.style.display = 'block';
    ctx.fillStyle = '#caeec2';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
});
startGameButton.addEventListener('click', startGame);

function startGame() {
    const snakeBody = {
        widthP: box,
        heightP: 0,
    };
    snake.push(snakeBody);
    apple[0] = Math.floor((Math.random() * 250) / 10) * 10;
    apple[1] = Math.floor((Math.random() * 200) / 10) * 10;
    this.disabled = true;
    hintsDiv.style.display = 'none';
    printTable();
    timerId = setInterval(moveSnake, speedList[curIndex]);
    speedEl.textContent = curSpeed;
}

function printTable() {
    // Create table
    ctx.fillStyle = '#caeec2';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    // Create starting apple
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(apple[0], apple[1], box, box);
    // Create starting snake
    ctx.fillStyle = '#14BD37';
    snake.forEach(bodyPart => ctx.fillRect(bodyPart.widthP, bodyPart.heightP, box, box));
}

// -------------------------- Move snake -------------------------------

function moveSnake() {
    const headOfSnake = snake[snake.length - 1];
    const newHeadPosition = [headOfSnake.widthP + actDirection[0], headOfSnake.heightP + actDirection[1]];
    const newBodyPart = {
        widthP: newHeadPosition[0],
        heightP: newHeadPosition[1],
    };
    snake.push(newBodyPart);
    snake.shift(snake[0]);
    if (hasCollision()) {
        stopGame();
        showPopup();
        startGameButton.disabled = false;
        console.error('Game over!');
        return;
    }
    checkEating();
    printTable();
}

function stopGame() {
    clearInterval(timerId);
}

function showPopup() {
    gameOverDiv.style.display = 'flex';
    startGameButton.textContent = 'OK';
    startGameButton.removeEventListener('click', startGame);
    startGameButton.addEventListener('click', () => window.location.reload());
}

document.addEventListener('keydown', event => {
    event.preventDefault();
    const headOfSnake = snake[snake.length - 1];
    const secondBodyPart = snake[snake.length - 2];
    if (event.code === 'ArrowDown') {
        if (snake.length === 1 || headOfSnake.heightP + box !== secondBodyPart.heightP)
            actDirection = directions[1];
    } else if (event.code === 'ArrowRight') {
        if (snake.length === 1 || headOfSnake.widthP + box !== secondBodyPart.widthP)
            actDirection = directions[0];
    } else if (event.code === 'ArrowLeft') {
        if (snake.length === 1 || headOfSnake.widthP - box !== secondBodyPart.widthP)
            actDirection = directions[2];
    } else if (event.code === 'ArrowUp') {
        if (snake.length === 1 || headOfSnake.heightP - box !== secondBodyPart.heightP)
            actDirection = directions[3];
    }
});

// ---------------------------------------- Eating ----------------------------------

function checkEating() {
    const headOfSnake = snake[snake.length - 1];
    if (headOfSnake.widthP === apple[0] && headOfSnake.heightP === apple[1]) {
        const newBody = {
            widthP: apple[0],
            heightP: apple[1],
        };
        snake.unshift(newBody);
        apple[0] = Math.floor((Math.random() * 500) / 10) * 10;
        apple[1] = Math.floor((Math.random() * 400) / 10) * 10;
        changeScoreAndSpeed();
    }
}

function changeScoreAndSpeed() {
    scoreEl.textContent = ++score;
    curIndex++;
    curSpeed = `${curIndex + 1}00`;
    speedEl.textContent = curSpeed;
    clearInterval(timerId);
    timerId = setInterval(moveSnake, speedList[curIndex]);
}

// ------------------------------ Collision, Game Over! ------------------------------

function hasCollision() {
    const headOfSnake = snake[snake.length - 1];
    if (
        headOfSnake.widthP === canvasWidth ||
        headOfSnake.widthP === -10 ||
        headOfSnake.heightP === canvasHeight ||
        headOfSnake.heightP === -10 ||
        snake
        .slice(0, -1)
        .some(bodyPart => bodyPart.widthP === headOfSnake.widthP && bodyPart.heightP === headOfSnake.heightP)
    )
        return true;
}