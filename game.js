const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// CSS toevoegen aan de head van het document
const style = document.createElement('style');
style.innerHTML = `
body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #333;
}

#gameContainer {
    width: 320px;
    height: 480px;
    background-image: url('achtergrond.jpg');
    background-size: cover;
    position: relative;
    border: 2px solid black;
}

#gameCanvas {
    background-color: transparent;
}
`;
document.head.appendChild(style);

let marioX = 50;
let marioY = 200;
let gravity = 0.4;
let velocity = 0;
const marioWidth = 40;
const marioHeight = 40;

const marioImg = new Image();
marioImg.src = "38e6f44dcde354f.png";

const pipeImg = new Image();
pipeImg.src = "images.png";

let pipeWidth = 60;
let pipeGap = 150;
let pipes = [];
let gameSpeed = 2;
let score = 0;
let gameRunning = false;

let imagesLoaded = 0;
[marioImg, pipeImg].forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 2) drawStartScreen();
    };
});

function createPipe() {
    const pipeY = Math.random() * (canvas.height - pipeGap);
    pipes.push({ x: canvas.width, y: pipeY });
}

function drawMario() {
    ctx.drawImage(marioImg, marioX, marioY, marioWidth, marioHeight);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.save();
        ctx.translate(pipe.x + pipeWidth / 2, pipe.y);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImg, -pipeWidth / 2, 0, pipeWidth, pipe.y);
        ctx.restore();

        ctx.drawImage(pipeImg, pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
    });
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function checkCollision() {
    for (let pipe of pipes) {
        if (
            marioX + marioWidth > pipe.x &&
            marioX < pipe.x + pipeWidth &&
            (marioY < pipe.y || marioY + marioHeight > pipe.y + pipeGap)
        ) return true;
    }
    return marioY < 0 || marioY + marioHeight > canvas.height;
}

function resetGame() {
    marioY = 200;
    velocity = 0;
    pipes = [];
    score = 0;
    gameSpeed = 2;
    pipeGap = 150;
    createPipe();
    drawStartScreen();
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    velocity += gravity;
    marioY += velocity;

    pipes.forEach(pipe => pipe.x -= gameSpeed);

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 160) createPipe();

    if (pipes[0].x < -pipeWidth) {
        pipes.shift();
        score++;
        if (score % 5 === 0) {
            gameSpeed += 0.5;
            pipeGap = Math.max(100, pipeGap - 10);
        }
    }

    drawMario();
    drawPipes();
    drawScore();

    if (checkCollision()) {
        gameRunning = false;
        alert("Game Over! Score: " + score);
        resetGame();
        return;
    }

    requestAnimationFrame(update);
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        pipes = [];
        createPipe();
        update();
    }
}

function drawStartScreen() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(canvas.width / 4 + 5, canvas.height / 3 + 5, canvas.width / 2, canvas.height / 3);
    ctx.fillStyle = "orange";
    ctx.fillRect(canvas.width / 4, canvas.height / 3, canvas.width / 2, canvas.height / 3);

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Tap or press Enter to play", canvas.width / 8, canvas.height / 2 + 20);
}

document.addEventListener("keydown", e => {
    if (e.code === "Space" && gameRunning) velocity = -7;
    else if (e.code === "Enter" && !gameRunning) startGame();
});
document.addEventListener("touchstart", () => {
    if (gameRunning) velocity = -7;
    else startGame();
});
