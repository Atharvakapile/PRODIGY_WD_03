const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart');
const playerXScoreDisplay = document.getElementById('playerXScore');
const playerOScoreDisplay = document.getElementById('playerOScore');
const aiScoreDisplay = document.getElementById('aiScore');
const multiplayerButton = document.getElementById('multiplayer');
const aiModeButton = document.getElementById('ai-mode');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let playerXScore = 0;
let playerOScore = 0;
let aiScore = 0;
let mode = ''; // Tracks whether multiplayer or AI is selected

/* Winning combinations */
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

/* Status messages */
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `It's a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusText.textContent = "Select a mode to start the game";

/* Handle cell click */
function handleCellClick(event) {
    if (!mode) return; // No mode selected yet

    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !isGameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();

    if (mode === 'ai' && currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    }
}

/* Update cell after a player move */
function updateCell(cell, index) {
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

/* Check if there's a winner or a draw */
function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = winningMessage();
        updateScore();
        isGameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusText.textContent = drawMessage();
        isGameActive = false;
        return;
    }

    switchPlayer();
}

/* AI makes a random move */
function aiMove() {
    let emptyCells = gameState.map((cell, index) => (cell === '' ? index : null)).filter(index => index !== null);

    if (emptyCells.length === 0) return;

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const aiCell = cells[randomIndex];
    updateCell(aiCell, randomIndex);
    checkResult();
}

/* Switch player */
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = currentPlayerTurn();
}

/* Update score */
function updateScore() {
    if (currentPlayer === 'X') {
        playerXScore++;
        playerXScoreDisplay.textContent = `Player X: ${playerXScore}`;
    } else if (mode === 'multiplayer') {
        playerOScore++;
        playerOScoreDisplay.textContent = `Player O: ${playerOScore}`;
    } else {
        aiScore++;
        aiScoreDisplay.textContent = `AI: ${aiScore}`;
    }
}

/* Restart the game */
function restartGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    statusText.textContent = currentPlayerTurn();
    cells.forEach(cell => cell.textContent = '');
}

/* Select Multiplayer Mode */
multiplayerButton.addEventListener('click', () => {
    mode = 'multiplayer';
    statusText.textContent = "Multiplayer mode selected. Player X's turn.";
    playerOScoreDisplay.classList.remove('hidden');
    aiScoreDisplay.classList.add('hidden');
    restartGame();
});

/* Select AI Mode */
aiModeButton.addEventListener('click', () => {
    mode = 'ai';
    statusText.textContent = "AI mode selected. Player X's turn.";
    playerOScoreDisplay.classList.add('hidden');
    aiScoreDisplay.classList.remove('hidden');
    restartGame();
});

/* Restart button functionality */
restartButton.addEventListener('click', restartGame);

/* Add click events to each cell */
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
