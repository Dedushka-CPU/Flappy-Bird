// Настройки игры
const gameContainer = document.querySelector('.game-container');
const bird = document.querySelector('.bird');
const startScreen = document.querySelector('.start-screen');
const gameOverScreen = document.querySelector('.game-over');
const scoreDisplay = document.querySelector('.score');

const gravity = 0.5; // Сила гравитации
const jumpStrength = -8; // Сила прыжка
const pipeWidth = 60; // Ширина препятствий
const pipeGap = 150; // Разрыв между верхним и нижним препятствием
const pipeSpeed = 3; // Скорость движения препятствий
const spawnRate = 8000; // Частота появления препятствий (мс)

let pipes = []; // Массив для препятствий
let birdVelocity = 0; // Скорость падения птицы
let birdY = gameContainer.clientHeight / 2; // Начальная высота птицы
let gameRunning = false;
let score = 0;

document.addEventListener("keydown", startGame);

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        startScreen.style.display = "none";
        gameOverScreen.style.display = "none";
        score = 0;
        scoreDisplay.textContent = score;
        birdY = gameContainer.clientHeight / 2;
        birdVelocity = 0;
        pipes.forEach(pipe => {
            pipe.top.remove();
            pipe.bottom.remove();
        });
        pipes = [];
        gameLoop();
        setInterval(createPipe, spawnRate);
    }
}


document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && gameRunning) {
        birdVelocity = jumpStrength;
    }
});


function createPipe() {
    if (!gameRunning) return;
    
    const maxPipeHeight = gameContainer.clientHeight - pipeGap - 100;
    const holePosition = Math.floor(Math.random() * (maxPipeHeight - 50)) + 50;

    const pipeTop = document.createElement("div");
    pipeTop.classList.add("pipe-top");
    pipeTop.style.height = `${holePosition}px`;
    pipeTop.style.left = `${gameContainer.clientWidth}px`;

    const pipeBottom = document.createElement("div");
    pipeBottom.classList.add("pipe");
    pipeBottom.style.height = `${gameContainer.clientHeight - holePosition - pipeGap}px`;
    pipeBottom.style.left = `${gameContainer.clientWidth}px`;

    gameContainer.appendChild(pipeTop);
    gameContainer.appendChild(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom, passed: false });
}


function gameLoop() {
    if (!gameRunning) return;

    birdVelocity += gravity;
    birdY += birdVelocity;
    bird.style.top = `${birdY}px`;

    if (birdY <= 0 || birdY + bird.clientHeight >= gameContainer.clientHeight) {
        endGame();
        return;
    }

    pipes.forEach((pipe, index) => {
        let currentLeft = parseFloat(pipe.top.style.left);

        if (currentLeft + pipeWidth < 0) {
            pipe.top.remove();
            pipe.bottom.remove();
            pipes.splice(index, 1);
        } else {
            pipe.top.style.left = `${currentLeft - pipeSpeed}px`;
            pipe.bottom.style.left = `${currentLeft - pipeSpeed}px`;
        }

        if (
            (birdY < parseFloat(pipe.top.style.height) ||
            birdY + bird.clientHeight > gameContainer.clientHeight - parseFloat(pipe.bottom.style.height)) &&
            currentLeft < bird.offsetLeft + bird.clientWidth &&
            currentLeft + pipeWidth > bird.offsetLeft
        ) {
            endGame();
        }

        if (!pipe.passed && currentLeft + pipeWidth < bird.offsetLeft) {
            pipe.passed = true;
            score++;
            scoreDisplay.textContent = score;
        }
    });

    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    gameOverScreen.style.display = "flex";
}

document.addEventListener("keydown", function (e) {
    if (e.code === "KeyR") {
        startGame();
    }
});
