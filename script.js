const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Game variables
let ship = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 20 };
let bullets = [];
let enemies = [];
let enemyRows = 3;
let enemyColumns = 7;
let isGameOver = false;

// Create enemies
for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyColumns; col++) {
        enemies.push({
            x: col * 80 + 50,
            y: row * 50 + 30,
            width: 40,
            height: 20,
            isAlive: true
        });
    }
}

// Draw ship
function drawShip() {
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = "#ff0000";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Draw enemies
function drawEnemies() {
    ctx.fillStyle = "#ffffff";
    enemies.forEach(enemy => {
        if (enemy.isAlive) {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
}

// Update bullets
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        // Remove bullet if it goes out of bounds
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }

        // Check collision with enemies
        enemies.forEach(enemy => {
            if (
                enemy.isAlive &&
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemy.isAlive = false;
                bullets.splice(index, 1);
            }
        });
    });
}

// Check for win condition
function checkWin() {
    if (enemies.every(enemy => !enemy.isAlive)) {
        isGameOver = true;
        document.getElementById("win-message").style.display = "block";
        cancelAnimationFrame(gameLoop);
    }
}

// Update game
function updateGame() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawShip();
    drawBullets();
    drawEnemies();

    updateBullets();
    checkWin();
}

// Move ship
document.addEventListener("keydown", event => {
    if (event.code === "ArrowLeft" && ship.x > 0) {
        ship.x -= 15;
    }
    if (event.code === "ArrowRight" && ship.x < canvas.width - ship.width) {
        ship.x += 15;
    }
    if (event.code === "Space") {
        bullets.push({ x: ship.x + ship.width / 2 - 2, y: ship.y, width: 4, height: 10, speed: 5 });
    }
});

// Touch Controls
document.getElementById("left-btn").addEventListener("click", () => {
    if (ship.x > 0) ship.x -= 15;
});

document.getElementById("right-btn").addEventListener("click", () => {
    if (ship.x < canvas.width - ship.width) ship.x += 15;
});

document.getElementById("fire-btn").addEventListener("click", () => {
    bullets.push({ x: ship.x + ship.width / 2 - 2, y: ship.y, width: 4, height: 10, speed: 5 });
});

// Game loop
function gameLoop() {
    updateGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();
