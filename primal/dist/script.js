
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: 'blue',
    speed: 4,
    movingLeft: false,
    movingRight: false,
    currentDirection: 'right', // Added currentDirection property
};

const obstacles = [];
let score = 0;
let gameActive = true;

const playerFrames = {
    left: [
        'left_frame1.png',
        'left_frame2.png',
        'left_frame3.png',
        'left_frame4.png',
        'left_frame5.png',
        'left_frame6.png',
        'left_frame7.png',
        'left_frame8.png',
        'left_frame9.png',
        'left_frame10.png',
    ],
    right: [
        'right_frame1.png',
        'right_frame2.png',
        'right_frame3.png',
        'right_frame4.png',
        'right_frame5.png',
        'right_frame6.png',
        'right_frame7.png',
        'right_frame8.png',
        'right_frame9.png',
        'right_frame10.png',
    ],
};

let currentFrameIndex = 0;
const frameChangeInterval = 2 // Change this value to adjust animation speed

const frameImages = {
    left: playerFrames.left.map(frame => loadImage(frame)),
    right: playerFrames.right.map(frame => loadImage(frame)),
};

function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

let bottomPadding = 90;
let animationSpeed = 0.4;

function animatePlayer() {
    if (player.movingLeft) {
        player.currentDirection = 'left';
    } else if (player.movingRight) {
        player.currentDirection = 'right';
    }

    // Increment the frame counter with reduced speed
    currentFrameIndex = (currentFrameIndex + animationSpeed) % frameImages[player.currentDirection].length;

    // Clear only the area where the player was previously drawn
    const enlargedWidth = player.width * 2;
    const enlargedHeight = player.height * 4;
    ctx.clearRect(player.x, player.y - bottomPadding, enlargedWidth, enlargedHeight);

    // Draw the player
    ctx.drawImage(
        frameImages[player.currentDirection][Math.floor(currentFrameIndex)],
        player.x,
        player.y - bottomPadding,
        enlargedWidth,
        enlargedHeight
    );

    // Continue the animation loop only if moving
    if (player.movingLeft || player.movingRight) {
        requestAnimationFrame(animatePlayer);
    } else {
        // If not moving, reset the frame to the first frame
        currentFrameIndex = 0;
    }
}



function setCanvasSize() {
    if (!player.isMoving) { // Check if the player is not currently moving
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        player.width = canvas.width / 20;
        player.height = canvas.height / 20;
        player.x = canvas.width / 2 - player.width / 2;
        player.y = canvas.height - player.height;

        const obstacleSize = Math.min(canvas.width, canvas.height) / 20;

        for (const obstacle of obstacles) {
            obstacle.width = obstacleSize;
            obstacle.height = obstacleSize;
            obstacle.animationOffsetY = Math.random() * canvas.height; // Initialize animation offset
        }
    }
}


function drawPlayer() {
    const playerImage = document.getElementById('playerImage');
    const enlargedWidth = player.width * 2;
    const enlargedHeight = player.height * 4;

    // Draw the player with the current frame
    ctx.drawImage(playerImage, player.x, player.y - bottomPadding, enlargedWidth, enlargedHeight);
}

function updatePlayer() {
    // Reduce the player's speed by half
    const reducedSpeed = player.speed * 0.7;

    if (player.movingLeft) {
        player.x -= reducedSpeed;
    } else if (player.movingRight) {
        player.x += reducedSpeed;
    }

    // Ensure the player stays within the canvas boundaries
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));

    // Update hitbox position to center
    player.hitboxX = player.x + player.width / 3;  // Assuming you want to shift it to the right
    player.hitboxY = player.y + player.height / 3;  // Assuming you want to shift it down
}


function drawObstacles() {
    for (const obstacle of obstacles) {
        // Draw the obstacle with the current frame
        ctx.drawImage(
            obstacleFrameImages[currentObstacleFrameIndex],
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );

        // Increment the frame counter
        currentObstacleFrameIndex = (currentObstacleFrameIndex + 1) % obstacleFrameImages.length;
    }
}

// Assuming you have a GIF image named 'obstacle_animation.gif'
const obstacleFrames = [
    'obstacle_frame1.png',
    'obstacle_frame2.png',
    'obstacle_frame3.png',
    'obstacle_frame4.png',
    'obstacle_frame5.png',
    // ... add more frame filenames as needed
];

const obstacleFrameImages = obstacleFrames.map(frame => loadImage(frame));
let currentObstacleFrameIndex = 0;
const obstacleFrameChangeInterval = 2;

function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

function drawScore() {
    const scoreboardX = (canvas.width - 150) / 2;
    const scoreboardY = 10;
    const scoreboardWidth = 150;
    const scoreboardHeight = 40;
    const cornerRadius = 10;

    ctx.fillStyle = '#3498db';
    ctx.beginPath();
    ctx.moveTo(scoreboardX + cornerRadius, scoreboardY);
    ctx.arcTo(scoreboardX + scoreboardWidth, scoreboardY, scoreboardX + scoreboardWidth, scoreboardY + scoreboardHeight, cornerRadius);
    ctx.arcTo(scoreboardX + scoreboardWidth, scoreboardY + scoreboardHeight, scoreboardX, scoreboardY + scoreboardHeight, cornerRadius);
    ctx.arcTo(scoreboardX, scoreboardY + scoreboardHeight, scoreboardX, scoreboardY, cornerRadius);
    ctx.arcTo(scoreboardX, scoreboardY, scoreboardX + scoreboardWidth, scoreboardY, cornerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.font = `${Math.min(canvas.width, canvas.height) / 25}px Orbitron, sans-serif`;

    // Adjust the score text color and position
    ctx.fillStyle = '#ffcc00'; // Yellow color for the robot style
    const text = 'Score: ' + score;
    const textMetrics = ctx.measureText(text);
    const textX = scoreboardX + (scoreboardWidth - textMetrics.width) / 2;
    const textY = scoreboardY + scoreboardHeight / 2 + 10;
    ctx.fillText(text, textX, textY);
}


function drawGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreElement = document.getElementById('finalScore');
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'block';
    gameActive = false;

    gameOverScreen.style.backgroundColor = '#f1c175';
    gameOverScreen.style.border = '3px solid #2c3e50';
    gameOverScreen.style.padding = '10px';
    gameOverScreen.style.color = '#000';
    gameOverScreen.style.fontSize = '25px';
    gameOverScreen.style.fontFamily = "'Orbitron', sans-serif";

    gameOverScreen.style.position = 'fixed';
    gameOverScreen.style.top = '50%';
    gameOverScreen.style.left = '50%';
    gameOverScreen.style.transform = 'translate(-50%, -50%)';

    finalScoreElement.style.textAlign = 'center';
}

function checkCollision() {
    const playerX = player.x + player.width / 2;  // Center of the player
    const playerY = player.y - 100 + player.height / 2;  // Adjust the offset and center the player vertically
    const playerWidth = player.width;
    const playerHeight = player.height;

    for (const obstacle of obstacles) {
        const obstacleX = obstacle.x + obstacle.width / 2;  // Center of the obstacle
        const obstacleY = obstacle.y + obstacle.height / 2;  // Center of the obstacle
        const obstacleWidth = obstacle.width;
        const obstacleHeight = obstacle.height;

        if (
            playerX < obstacleX + obstacleWidth / 2 &&
            playerX + playerWidth / 2 > obstacleX - obstacleWidth / 2 &&
            playerY < obstacleY + obstacleHeight / 2 &&
            playerY + playerHeight / 2 > obstacleY - obstacleHeight / 2
        ) {
            drawGameOverScreen();
        }
    }
}



function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

function updateObstacles() {
    for (const obstacle of obstacles) {
        obstacle.y += Math.min(canvas.width, canvas.height) / 100;

        // Increment the obstacle frame counter
        obstacle.frameIndex = (obstacle.frameIndex + 1) % obstacleFrameImages.length;

        if (obstacle.y > canvas.height) {
            obstacles.shift();
            score++;
        }
    }

    // Adjust the obstacle spawn rate
    if (Math.random() < 0.01) {
        const obstacleSize = Math.min(canvas.width, canvas.height) / 10;

        // Calculate the center coordinates of the obstacle
        const obstacleX = Math.random() * (canvas.width - obstacleSize);
        const obstacleY = 0;

        const obstacle = {
            x: obstacleX + obstacleSize / 3, // Center of the obstacle
            y: obstacleY + obstacleSize / 3, // Center of the obstacle
            width: obstacleSize,
            height: obstacleSize,
            frameIndex: 0,
        };
        obstacles.push(obstacle);
    }
}


function resetGame() {
    player = {
        x: canvas.width / 2 - player.width / 2,
        y: canvas.height - player.height,
        width: canvas.width / 20,
        height: canvas.height / 20,
        color: 'blue',
        speed: 5,
        movingLeft: false,
        movingRight: false,
    };

    obstacles.length = 0;
    score = 0;
    gameActive = true;
    document.getElementById('gameOverScreen').style.display = 'none';
}

function restartGame() {
    resetGame();
    gameLoop();
}
function flipPlayer(left) {
    if (left) {
        player.flip = -1;  // Set a flip factor for left movement
    } else {
        player.flip = 1;   // Reset the flip factor for right movement
    }
}

function startMovingLeft(event) {
    event.preventDefault(); // Prevent the default touch event behavior
    if (gameActive) {
        player.movingLeft = true;
        player.movingRight = false;
        player.currentDirection = 'left';

        // Flip the player to the left
        flipPlayer(true);

        // Set the flag to indicate the player is moving
        player.isMoving = true;

        // Start the animation loop only when the left button is clicked
        animatePlayer();
    }
}

function startMovingRight(event) {
    event.preventDefault(); // Prevent the default touch event behavior
    if (gameActive) {
        player.movingRight = true;
        player.movingLeft = false;
        player.currentDirection = 'right';

        // Set the flag to indicate the player is moving
        player.isMoving = true;

        // Start the animation loop only when right button is clicked
        animatePlayer();
    }
}


function stopMoving(event) {
    event.preventDefault(); // Prevent the default touch event behavior
    player.movingLeft = false;
    player.movingRight = false;

    // If not moving, reset the frame to the first frame
    currentFrameIndex = 0;
}

function gameLoop() {
    if (!gameActive) {
        return;
    }

    // Update player and obstacles
    updatePlayer();
    updateObstacles();

    // Clear the entire canvas before drawing anything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player, obstacles, score, etc.
    drawPlayer();
    drawObstacles();
    drawScore();

    // Check for collision
    checkCollision();

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}


setCanvasSize();
window.addEventListener('resize', setCanvasSize);
document.getElementById('leftButton').addEventListener('touchstart', function(event) {
    event.preventDefault();
    startMovingLeft(event);
});

document.getElementById('leftButton').addEventListener('touchend', function(event) {
    event.preventDefault();
    stopMoving(event);
});

document.getElementById('rightButton').addEventListener('touchstart', function(event) {
    event.preventDefault();
    startMovingRight(event);
});

document.getElementById('rightButton').addEventListener('touchend', function(event) {
    event.preventDefault();
    stopMoving(event);
});


gameLoop();

