
// Game elements
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameBoard = document.getElementById('game-board');
const movesElement = document.getElementById('moves');
const timerElement = document.getElementById('timer');
const finalTimeElement = document.getElementById('finalTime');
const finalMovesElement = document.getElementById('finalMoves');
const starRatingElement = document.getElementById('starRating');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

// Game settings
const difficulties = {
  easy: { cols: 4, rows: 3 },
  medium: { cols: 4, rows: 4 },
  hard: { cols: 5, rows: 4 }
};

// Game state
let game = {
  difficulty: 'medium',
  moves: 0,
  startTime: null,
  timerInterval: null,
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  totalPairs: 0,
  isLocked: false
};

// Card symbols (emojis)
const symbols = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🐧', '🐦', '🦄', '🦉', '🦋', '🐙', '🦑', '🦐'
];

// Event listeners for difficulty selection
document.querySelectorAll('[data-difficulty]').forEach(button => {
  button.addEventListener('click', () => {
    game.difficulty = button.getAttribute('data-difficulty');
    startGame();
  });
});

// Restart button
restartBtn.addEventListener('click', () => {
  resetGame();
  startGame();
});

// Play again button
playAgainBtn.addEventListener('click', () => {
  gameOverScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

// Initialize game
function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  
  resetGame();
  createBoard();
  game.startTime = Date.now();
  game.timerInterval = setInterval(updateTimer, 1000);
}

// Reset game state
function resetGame() {
  game.moves = 0;
  game.flippedCards = [];
  game.matchedPairs = 0;
  game.isLocked = false;
  
  if (game.timerInterval) {
    clearInterval(game.timerInterval);
  }
  
  movesElement.textContent = '0';
  timerElement.textContent = '00:00';
}

// Create the game board
function createBoard() {
  gameBoard.innerHTML = '';
  
  const { rows, cols } = difficulties[game.difficulty];
  const totalCards = rows * cols;
  
  // Make sure we have an even number of cards
  if (totalCards % 2 !== 0) {
    totalCards--;
  }
  
  game.totalPairs = totalCards / 2;
  
  // Set up the grid
  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  
  // Create pairs of cards
  const cardSymbols = [];
  for (let i = 0; i < game.totalPairs; i++) {
    const symbol = symbols[i];
    cardSymbols.push(symbol, symbol);
  }
  
  // Shuffle the cards
  shuffleArray(cardSymbols);
  
  // Create card elements
  for (let i = 0; i < totalCards; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.cardIndex = i;
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = cardSymbols[i];
    
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    
    card.addEventListener('click', () => flipCard(card, i, cardSymbols[i]));
    
    gameBoard.appendChild(card);
  }
}

// Flip a card
function flipCard(card, index, symbol) {
  // Return if the card is already flipped or matched, or the board is locked
  if (game.isLocked || 
      card.classList.contains('flipped') || 
      card.classList.contains('matched')) {
    return;
  }
  
  // Flip the card
  card.classList.add('flipped');
  
  // Add card to flipped cards
  game.flippedCards.push({ card, index, symbol });
  
  // If we have 2 flipped cards, check for a match
  if (game.flippedCards.length === 2) {
    game.moves++;
    movesElement.textContent = game.moves;
    
    // Lock the board while checking
    game.isLocked = true;
    
    const [card1, card2] = game.flippedCards;
    
    // Check if cards match
    if (card1.symbol === card2.symbol) {
      handleMatch(card1.card, card2.card);
    } else {
      handleMismatch(card1.card, card2.card);
    }
  }
}

// Handle matching cards
function handleMatch(card1, card2) {
  card1.classList.add('matched');
  card2.classList.add('matched');
  
  playSound('match');
  
  game.matchedPairs++;
  game.flippedCards = [];
  game.isLocked = false;
  
  // Check if game is complete
  if (game.matchedPairs === game.totalPairs) {
    gameComplete();
  }
}

// Handle mismatched cards
function handleMismatch(card1, card2) {
  playSound('mismatch');
  
  // Flip cards back after a delay
  setTimeout(() => {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    
    game.flippedCards = [];
    game.isLocked = false;
  }, 1000);
}

// Game complete
function gameComplete() {
  clearInterval(game.timerInterval);
  
  const endTime = Date.now();
  const gameTime = Math.floor((endTime - game.startTime) / 1000);
  
  // Show game over screen after a delay
  setTimeout(() => {
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    
    finalTimeElement.textContent = formatTime(gameTime);
    finalMovesElement.textContent = game.moves;
    
    // Calculate star rating
    const maxMoves = {
      easy: 18,
      medium: 30,
      hard: 45
    };
    
    const perfectMoves = game.totalPairs;
    const maxAllowedMoves = maxMoves[game.difficulty];
    let stars = '';
    
    if (game.moves <= perfectMoves + 2) {
      stars = '⭐⭐⭐';
    } else if (game.moves <= maxAllowedMoves * 0.6) {
      stars = '⭐⭐';
    } else {
      stars = '⭐';
    }
    
    starRatingElement.textContent = stars;
    
    playSound('complete');
  }, 500);
}

// Update timer
function updateTimer() {
  const currentTime = Math.floor((Date.now() - game.startTime) / 1000);
  timerElement.textContent = formatTime(currentTime);
}

// Format time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Simple sound effects
function playSound(type) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'match':
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);
        break;
      case 'mismatch':
        oscillator.type = 'triangle';
        oscillator.frequency.value = 220;
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 160);
        break;
      case 'complete':
        playMelody();
        break;
    }
  } catch (e) {
    // Silent fail if audio not supported
    console.log("Audio not supported");
  }
}

// Play a victory melody
function playMelody() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [261.63, 329.63, 392, 523.25]; // C4, E4, G4, C5
    const duration = 200;
    
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.1;
      
      const startTime = audioContext.currentTime + (index * duration / 1000);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration / 1000);
    });
  } catch (e) {
    console.log("Audio not supported");
  }
}

// Resize handler
window.addEventListener('resize', () => {
  adjustCardSize();
});

// Adjust card size based on container size
function adjustCardSize() {
  const { cols, rows } = difficulties[game.difficulty];
  const cards = document.querySelectorAll('.card');
  
  if (cards.length === 0) return;
  
  const boardWidth = gameBoard.clientWidth;
  const boardHeight = gameBoard.clientHeight;
  
  const cardWidth = (boardWidth / cols) - 10; // Account for gap
  const cardHeight = (boardHeight / rows) - 10; // Account for gap
  
  cards.forEach(card => {
    card.style.width = `${cardWidth}px`;
    card.style.height = `${cardHeight}px`;
  });
}

// Initialize resize on load
window.addEventListener('load', () => {
  window.dispatchEvent(new Event('resize'));
});
