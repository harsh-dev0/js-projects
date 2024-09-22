import { realDictionary } from './dictionary.js';

class WordleGame {
  constructor(dictionary) {
    this.dictionary = dictionary;
    this.state = {
      secret: this.getRandomWord(),
      grid: Array(6).fill().map(() => Array(5).fill('')),
      currentRow: 0,
      currentCol: 0,
    };
    this.gameContainer = document.getElementById('game');
  }

  getRandomWord() {
    return this.dictionary[Math.floor(Math.random() * this.dictionary.length)];
  }

  drawGrid() {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        this.drawBox(grid, i, j);
      }
    }

    this.gameContainer.appendChild(grid);
  }

  drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = letter;
    box.id = `box${row}${col}`;

    container.appendChild(box);
    return box;
  }

  updateGrid() {
    for (let i = 0; i < this.state.grid.length; i++) {
      for (let j = 0; j < this.state.grid[i].length; j++) {
        const box = document.getElementById(`box${i}${j}`);
        box.textContent = this.state.grid[i][j];
      }
    }
  }

  registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
      this.handleKeyInput(e.key);
    };
  }

  handleKeyInput(key) {
    if (key === 'Enter') {
      this.submitGuess();
    } else if (key === 'Backspace') {
      this.removeLetter();
    } else if (this.isLetter(key)) {
      this.addLetter(key);
    }

    this.updateGrid();
  }

  submitGuess() {
    if (this.state.currentCol === 5) {
      const word = this.getCurrentWord();
      if (this.isWordValid(word)) {
        this.revealWord(word);
        this.state.currentRow++;
        this.state.currentCol = 0;
      } else {
        this.showMessage('Not a valid word.');
      }
    }
  }

  getCurrentWord() {
    return this.state.grid[this.state.currentRow].join('');
  }

  isWordValid(word) {
    return this.dictionary.includes(word);
  }

  revealWord(guess) {
    const row = this.state.currentRow;
    const animation_duration = 500; // ms

    for (let i = 0; i < 5; i++) {
      const box = document.getElementById(`box${row}${i}`);
      const letter = box.textContent;
      const letterState = this.getLetterState(guess, letter, i);

      setTimeout(() => {
        box.classList.add(letterState, 'animated');
      }, ((i + 1) * animation_duration) / 2);

      box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }

    this.checkGameEnd(guess);
  }

  getLetterState(guess, letter, position) {
    if (letter === this.state.secret[position]) {
      return 'right';
    } else if (this.state.secret.includes(letter)) {
      return 'wrong';
    } else {
      return 'empty';
    }
  }

  checkGameEnd(guess) {
    const isWinner = this.state.secret === guess;
    const isGameOver = this.state.currentRow === 5;

    setTimeout(() => {
      if (isWinner) {
        this.showMessage('Congratulations!');
      } else if (isGameOver) {
        this.showMessage(`Better luck next time! The word was ${this.state.secret}.`);
      }
    }, 1500);
  }

  showMessage(message) {
    alert(message); // For simplicity, using alert. Consider creating a custom modal for better UX.
  }

  isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
  }

  addLetter(letter) {
    if (this.state.currentCol === 5) return;
    this.state.grid[this.state.currentRow][this.state.currentCol] = letter.toUpperCase();
    this.state.currentCol++;
  }

  removeLetter() {
    if (this.state.currentCol === 0) return;
    this.state.grid[this.state.currentRow][this.state.currentCol - 1] = '';
    this.state.currentCol--;
  }

  createVirtualKeyboard() {
    const keyboard = document.createElement('div');
    keyboard.className = 'virtual-keyboard';
    const keys = [
      'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
      'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
      'Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'
    ];

    keys.forEach(key => {
      const button = document.createElement('button');
      button.textContent = key;
      button.addEventListener('click', () => this.handleKeyInput(key));
      keyboard.appendChild(button);
    });

    document.body.appendChild(keyboard);
  }

  init() {
    this.drawGrid();
    this.registerKeyboardEvents();
    this.createVirtualKeyboard();
  }
}

// Initialize the game
const game = new WordleGame(realDictionary);
game.init();