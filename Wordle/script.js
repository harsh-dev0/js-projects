import { testDictionary, realDictionary } from './dictionary.js';

const dictionary = realDictionary;
const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array.from({ length: 6 }, () => Array(5).fill('')),
  currentRow: 0,
  currentCol: 0,
};

function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;
  container.appendChild(box);
}

function registerKeyboardEvents() {
  // Using both keyboard events and an input field for mobile compatibility
  document.body.onkeydown = (e) => {
    handleKeyInput(e.key);
    updateGrid();
  };

  const hiddenInput = document.getElementById('hiddenInput');
  hiddenInput.addEventListener('input', (e) => {
    handleKeyInput(e.target.value);
    e.target.value = ''; // Clear input after processing
  });

  // Focus on the hidden input for mobile keyboard
  hiddenInput.focus();
}

function handleKeyInput(key) {
  if (key === 'Enter') {
    if (state.currentCol === 5) {
      const word = getCurrentWord();
      if (isWordValid(word)) {
        revealWord(word);
        state.currentRow++;
        state.currentCol = 0;
      } else {
        alert('Not a valid word.');
      }
    }
  } else if (key === 'Backspace') {
    removeLetter();
  } else if (isLetter(key)) {
    addLetter(key);
  }
}

function getCurrentWord() {
  return state.grid[state.currentRow].join('');
}

function isWordValid(word) {
  return dictionary.includes(word);
}

function getNumOfOccurrencesInWord(word, letter) {
  return word.split(letter).length - 1;
}

function getPositionOfOccurrence(word, letter, position) {
  return word.slice(0, position + 1).split(letter).length - 1;
}

function revealWord(guess) {
  const row = state.currentRow;
  const animationDuration = 500; // ms

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(state.secret, letter);
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
    const letterPosition = getPositionOfOccurrence(guess, letter, i);

    setTimeout(() => {
      if (numOfOccurrencesGuess > numOfOccurrencesSecret && letterPosition > numOfOccurrencesSecret) {
        box.classList.add('empty');
      } else {
        if (letter === state.secret[i]) {
          box.classList.add('right');
        } else if (state.secret.includes(letter)) {
          box.classList.add('wrong');
        } else {
          box.classList.add('empty');
        }
      }
    }, (i + 1) * animationDuration / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animationDuration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      alert('Congratulations!');
    } else if (isGameOver) {
      alert(`Better luck next time! The word was ${state.secret}.`);
    }
  }, 3 * animationDuration);
}

function isLetter(key) {
  return key.length === 1 && /^[a-z]$/i.test(key);
}

function addLetter(letter) {
  if (state.currentCol < 5) {
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
  }
}

function removeLetter() {
  if (state.currentCol > 0) {
    state.currentCol--;
    state.grid[state.currentRow][state.currentCol] = '';
  }
}

function startup() {
  const game = document.getElementById('game');
  drawGrid(game);

  // Create and focus the hidden input field for mobile
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'text';
  hiddenInput.id = 'hiddenInput';
  hiddenInput.style.position = 'absolute';
  hiddenInput.style.opacity = '0';
  document.body.appendChild(hiddenInput);
  hiddenInput.focus();

  registerKeyboardEvents();
}

startup();
