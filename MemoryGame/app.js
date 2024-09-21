const gameBoard = document.querySelector('.game-board');
let flippedCards = [];
let moves = 0;
const movesCounter = document.getElementById('moves');
const modal = document.getElementById('winModal');
const finalMoves = document.getElementById('finalMoves');
const playAgainBtn = document.getElementById('playAgain');

// Array of cards
const cardsArray = [
    '🍎', '🍎',
    '🍌', '🍌',
    '🍇', '🍇',
    '🍉', '🍉',
    '🍒', '🍒',
    '🍍', '🍍',
    '🍓', '🍓',
    '🍑', '🍑'
];

// Function to shuffle the cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Shuffle the cards at the start
shuffle(cardsArray);

function createCards() {
    gameBoard.innerHTML = ''; // Clear the game board
    cardsArray.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;  // Store the value of the card for matching
        cardElement.innerHTML = ''; // Hide the card value initially
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

createCards();

// Flip card function
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.innerHTML = this.dataset.value;  // Show the card value
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
}

// Function to check if two flipped cards match
function checkForMatch() {
    moves++;
    movesCounter.innerText = moves;

    const [firstCard, secondCard] = flippedCards;
    if (firstCard.dataset.value === secondCard.dataset.value) {
        flippedCards = [];
        checkGameWin();  // Check if the game is won after a match
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            firstCard.innerHTML = '';
            secondCard.classList.remove('flipped');
            secondCard.innerHTML = '';
            flippedCards = [];
        }, 1000);
    }
}

// Function to check if all cards are matched
function checkGameWin() {
    const allFlippedCards = document.querySelectorAll('.flipped');
    if (allFlippedCards.length === cardsArray.length) {
        setTimeout(() => {
            // Display the modal
            finalMoves.innerText = moves;
            modal.style.display = 'flex';
            document.body.classList.add('celebrating'); // Add the celebration background
        }, 500);
    }
}

// Reset the game when play again is clicked
playAgainBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.classList.remove('celebrating'); // Remove the celebration background
    resetGame();
});

// Reset the game function
function resetGame() {
    moves = 0;
    movesCounter.innerText = moves;
    flippedCards = [];
    shuffle(cardsArray);
    createCards();
}
