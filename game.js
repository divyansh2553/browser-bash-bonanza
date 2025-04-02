// Game elements
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const finalScoreElement = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgainBtn');

// Game settings and state
let gameSettings = {
  easy: { ballSpeed: 4, paddleWidth: 100, blockRows: 3 },
  medium: { ballSpeed: 6, paddleWidth: 80, blockRows: 4 },
  hard: { ballSpeed: 8, paddleWidth: 60, blockRows: 5 }
};

let game = {
  width: 800,
  height: 550,
  difficulty: 'medium',
  score: 0,
  lives: 3,
  level: 1,
  running: false,
  blocks: [],
  blockColors: [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
    '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
    '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41'
  ]
};

// Game objects
const ball = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  radius: 10,
  speed: 0,
  color: '#FFFFFF'
};

const paddle = {
  x: 0,
  y: 0,
  width: 0,
  height: 15,
  dx: 0,
  speed: 8,
  color: '#00FFFF'
};

// Event listeners for difficulty selection
document.querySelectorAll('[data-difficulty]').forEach(button => {
  button.addEventListener('click', () => {
    game.difficulty = button.getAttribute('data-difficulty');
    startGame();
  });
});

// Play again button
playAgainBtn.addEventListener('click', () => {
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

// Mouse movement for paddle control
canvas.addEventListener('mousemove', (e) => {
  const relativeX = e.clientX - canvas.getBoundingClientRect().left;
  
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
    
    // Keep paddle within canvas bounds
    if (paddle.x < 0) {
      paddle.x = 0;
    } else if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  }
});

// Touch movement for mobile support
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const relativeX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
    
    if (paddle.x < 0) {
      paddle.x = 0;
    } else if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  }
}, { passive: false });

// Create blocks for the level
function createBlocks() {
  game.blocks = [];
  const settings = gameSettings[game.difficulty];
  const rows = settings.blockRows + Math.min(2, game.level - 1);
  const columns = 10;
  
  const blockWidth = game.width / columns;
  const blockHeight = 25;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      game.blocks.push({
        x: col * blockWidth,
        y: row * blockHeight + 50,
        width: blockWidth,
        height: blockHeight,
        color: game.blockColors[row % game.blockColors.length],
        strength: Math.min(3, Math.floor((row + game.level) / 3) + 1)
      });
    }
  }
}

// Initialize game
function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  
  // Set canvas dimensions
  canvas.width = game.width;
  canvas.height = game.height;
  
  // Initialize game state
  game.score = 0;
  game.lives = 3;
  game.level = 1;
  game.running = true;
  
  // Update display
  scoreElement.textContent = game.score;
  livesElement.textContent = game.lives;
  levelElement.textContent = game.level;
  
  // Initialize paddle based on difficulty
  const settings = gameSettings[game.difficulty];
  paddle.width = settings.paddleWidth;
  paddle.x = (canvas.width - paddle.width) / 2;
  paddle.y = canvas.height - paddle.height - 10;
  
  // Initialize ball
  resetBall();
  
  // Create blocks
  createBlocks();
  
  // Start game loop
  requestAnimationFrame(gameLoop);
}

// Reset ball position
function resetBall() {
  const settings = gameSettings[game.difficulty];
  ball.x = canvas.width / 2;
  ball.y = paddle.y - ball.radius;
  ball.speed = settings.ballSpeed;
  
  // Random angle, but not too horizontal
  let angle;
  do {
    angle = Math.random() * Math.PI * 0.7 - Math.PI * 0.35; // -0.35π to 0.35π
  } while (Math.abs(angle) < 0.2);
  
  ball.dx = ball.speed * Math.sin(angle);
  ball.dy = -ball.speed * Math.cos(angle);
}

// Draw the game objects
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw paddle
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  
  // Draw ball with gradient
  const gradient = ctx.createRadialGradient(
    ball.x, ball.y, 0,
    ball.x, ball.y, ball.radius
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(0, 150, 255, 0.8)');
  
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();
  
  // Draw blocks
  game.blocks.forEach(block => {
    const opacity = 0.5 + (block.strength * 0.25);
    ctx.fillStyle = block.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
    ctx.fillRect(block.x, block.y, block.width, block.height);
    
    // Draw block border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeRect(block.x, block.y, block.width, block.height);
    
    // Draw strength indicator
    if (block.strength > 1) {
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(block.strength, block.x + block.width/2, block.y + block.height/2 + 5);
    }
  });
}

// Update game logic
function update() {
  // Move the ball
  ball.x += ball.dx;
  ball.y += ball.dy;
  
  // Wall collision
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.dx = -ball.dx;
    playSound('wall');
  }
  
  // Ceiling collision
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    playSound('wall');
  }
  
  // Floor collision (lose life)
  if (ball.y + ball.radius > canvas.height) {
    game.lives--;
    livesElement.textContent = game.lives;
    
    if (game.lives <= 0) {
      gameOver();
    } else {
      resetBall();
    }
  }
  
  // Paddle collision
  if (ball.y + ball.radius > paddle.y && 
      ball.y - ball.radius < paddle.y + paddle.height && 
      ball.x > paddle.x && 
      ball.x < paddle.x + paddle.width) {
    
    // Calculate bounce angle based on where the ball hit the paddle
    const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    const angle = hitPoint * (Math.PI / 3); // -60 to 60 degrees
    
    ball.dy = -Math.abs(ball.dy);
    ball.dx = ball.speed * Math.sin(angle);
    
    playSound('paddle');
  }
  
  // Block collision
  for (let i = game.blocks.length - 1; i >= 0; i--) {
    const block = game.blocks[i];
    
    if (ball.x + ball.radius > block.x && 
        ball.x - ball.radius < block.x + block.width && 
        ball.y + ball.radius > block.y && 
        ball.y - ball.radius < block.y + block.height) {
      
      // Determine collision direction
      const ballBottom = ball.y + ball.radius;
      const ballTop = ball.y - ball.radius;
      const ballRight = ball.x + ball.radius;
      const ballLeft = ball.x - ball.radius;
      
      const blockBottom = block.y + block.height;
      const blockTop = block.y;
      const blockRight = block.x + block.width;
      const blockLeft = block.x;
      
      // Calculate overlap on each side
      const bottomOverlap = ballBottom - blockTop;
      const topOverlap = blockBottom - ballTop;
      const rightOverlap = ballRight - blockLeft;
      const leftOverlap = blockRight - ballLeft;
      
      // Find smallest overlap to determine collision direction
      const minOverlap = Math.min(bottomOverlap, topOverlap, rightOverlap, leftOverlap);
      
      if (minOverlap === bottomOverlap || minOverlap === topOverlap) {
        ball.dy = -ball.dy;
      } else {
        ball.dx = -ball.dx;
      }
      
      // Decrease block strength or remove
      block.strength--;
      
      if (block.strength <= 0) {
        game.blocks.splice(i, 1);
        game.score += 10 * game.level;
        scoreElement.textContent = game.score;
      }
      
      playSound('block');
      
      // Only process one collision per frame
      break;
    }
  }
  
  // Check for level completion
  if (game.blocks.length === 0) {
    game.level++;
    levelElement.textContent = game.level;
    
    // Increase ball speed with level
    ball.speed += 0.5;
    
    resetBall();
    createBlocks();
    
    // Show level up message
    showMessage(`Level ${game.level}!`, 1500);
  }
}

// Simple sound effects using Audio API
function playSound(type) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'paddle':
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 100);
        break;
      case 'block':
        oscillator.type = 'square';
        oscillator.frequency.value = 660;
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 60);
        break;
      case 'wall':
        oscillator.type = 'sine';
        oscillator.frequency.value = 220;
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 80);
        break;
    }
  } catch (e) {
    // Silent fail if audio not supported
    console.log("Audio not supported");
  }
}

// Show temporary message
function showMessage(text, duration) {
  const messageEl = document.createElement('div');
  messageEl.className = 'level-message';
  messageEl.textContent = text;
  messageEl.style.position = 'absolute';
  messageEl.style.top = '50%';
  messageEl.style.left = '50%';
  messageEl.style.transform = 'translate(-50%, -50%)';
  messageEl.style.color = 'white';
  messageEl.style.fontSize = '48px';
  messageEl.style.fontWeight = 'bold';
  messageEl.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.7)';
  messageEl.style.zIndex = '20';
  
  gameScreen.appendChild(messageEl);
  
  setTimeout(() => {
    messageEl.remove();
  }, duration);
}

// Game over
function gameOver() {
  game.running = false;
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  finalScoreElement.textContent = game.score;
}

// Game loop
function gameLoop() {
  if (game.running) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// Resize handler
window.addEventListener('resize', () => {
  // Maintain aspect ratio while fitting the screen
  const container = document.querySelector('.game-container');
  const maxWidth = Math.min(window.innerWidth - 20, 800);
  const maxHeight = Math.min(window.innerHeight - 20, 600);
  
  const aspectRatio = 800 / 600;
  
  let width, height;
  
  if (maxWidth / aspectRatio <= maxHeight) {
    width = maxWidth;
    height = maxWidth / aspectRatio;
  } else {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }
  
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
});

// Initialize resize on load
window.dispatchEvent(new Event('resize'));
