import { Board } from './Board.js';

/**
 * Represents an AI player in the Sea Battle game
 * Implements hunt and target modes for intelligent gameplay
 */
export class AIPlayer {
  constructor(name = 'CPU') {
    this.name = name;
    this.board = new Board(false); // Don't show AI's ships
    this.opponentBoard = new Board(false); // Track opponent board state
    this.numShips = 3;
    this.mode = 'hunt'; // 'hunt' or 'target'
    this.targetQueue = []; // Queue of locations to target after a hit
    this.setupBoard();
  }

  /**
   * Sets up the AI player's board with ships
   */
  setupBoard() {
    for (let i = 0; i < this.numShips; i++) {
      this.board.placeShipRandomly();
    }
  }

  /**
   * Makes a strategic guess based on current mode
   * @returns {string} - Location string like "34"
   */
  makeGuess() {
    let location;
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      if (this.mode === 'target' && this.targetQueue.length > 0) {
        location = this.targetQueue.shift();
        
        // Skip if already guessed
        if (this.opponentBoard.hasBeenGuessed(location)) {
          if (this.targetQueue.length === 0) {
            this.mode = 'hunt';
          }
          attempts++;
          continue;
        }
      } else {
        this.mode = 'hunt';
        location = this.generateHuntGuess();
        
        // Skip if already guessed
        if (this.opponentBoard.hasBeenGuessed(location)) {
          attempts++;
          continue;
        }
      }

      // Record the guess
      this.opponentBoard.guesses.add(location);
      return location;
    }

    throw new Error('AI could not generate a valid guess');
  }

  /**
   * Generates a random guess for hunt mode
   * @returns {string} - Location string like "34"
   */
  generateHuntGuess() {
    const row = Math.floor(Math.random() * Board.BOARD_SIZE);
    const col = Math.floor(Math.random() * Board.BOARD_SIZE);
    return this.opponentBoard.formatLocation(row, col);
  }

  /**
   * Processes the result of the AI's guess and updates strategy
   * @param {string} location - The location that was guessed
   * @param {boolean} hit - Whether the guess was a hit
   * @param {boolean} sunk - Whether a ship was sunk
   */
  processGuessResult(location, hit, sunk) {
    const { row, col } = this.opponentBoard.parseLocation(location);
    
    // Update the AI's view of the opponent board
    this.opponentBoard.grid[row][col] = hit ? Board.HIT : Board.MISS;

    if (hit) {
      if (sunk) {
        // Ship was sunk, go back to hunt mode
        this.mode = 'hunt';
        this.targetQueue = [];
      } else {
        // Hit but not sunk, switch to target mode
        this.mode = 'target';
        this.addAdjacentTargets(row, col);
      }
    } else {
      // Miss - if we're in target mode and have no more targets, go back to hunt
      if (this.mode === 'target' && this.targetQueue.length === 0) {
        this.mode = 'hunt';
      }
    }
  }

  /**
   * Adds adjacent locations to target queue after a hit
   * @param {number} row - Row of the hit
   * @param {number} col - Column of the hit
   */
  addAdjacentTargets(row, col) {
    const adjacentPositions = [
      { r: row - 1, c: col }, // Up
      { r: row + 1, c: col }, // Down
      { r: row, c: col - 1 }, // Left
      { r: row, c: col + 1 }  // Right
    ];

    for (const pos of adjacentPositions) {
      if (this.opponentBoard.isValidCoordinate(pos.r, pos.c)) {
        const locationStr = this.opponentBoard.formatLocation(pos.r, pos.c);
        
        // Only add if not already guessed and not already in queue
        if (!this.opponentBoard.hasBeenGuessed(locationStr) && 
            !this.targetQueue.includes(locationStr)) {
          this.targetQueue.push(locationStr);
        }
      }
    }
  }

  /**
   * Processes an incoming attack on this AI player's board
   * @param {string} location - Location string like "34"
   * @returns {Object} - Result of the attack
   */
  receiveAttack(location) {
    return this.board.processGuess(location);
  }

  /**
   * Gets the number of remaining ships
   * @returns {number} - Number of ships still afloat
   */
  getRemainingShips() {
    return this.board.getRemainingShipCount();
  }

  /**
   * Checks if the AI player has lost (all ships sunk)
   * @returns {boolean} - True if AI player has lost
   */
  hasLost() {
    return this.getRemainingShips() === 0;
  }

  /**
   * Gets the AI player's board for display (usually hidden)
   * @returns {Array<Array<string>>} - 2D array of the AI's board
   */
  getBoard() {
    return this.board.getGrid();
  }

  /**
   * Gets the AI's view of the opponent board
   * @returns {Array<Array<string>>} - 2D array of the opponent board view
   */
  getOpponentBoard() {
    return this.opponentBoard.getGrid();
  }

  /**
   * Gets AI player statistics and current state
   * @returns {Object} - Object containing AI stats
   */
  getStats() {
    return {
      name: this.name,
      remainingShips: this.getRemainingShips(),
      totalGuesses: this.opponentBoard.getGuesses().length,
      hasLost: this.hasLost(),
      mode: this.mode,
      targetQueueLength: this.targetQueue.length
    };
  }

  /**
   * Resets the AI's strategy state (useful for testing)
   */
  resetStrategy() {
    this.mode = 'hunt';
    this.targetQueue = [];
  }

  /**
   * Gets the current mode of the AI
   * @returns {string} - Current mode ('hunt' or 'target')
   */
  getCurrentMode() {
    return this.mode;
  }

  /**
   * Gets the current target queue (for debugging/testing)
   * @returns {Array<string>} - Array of target locations
   */
  getTargetQueue() {
    return [...this.targetQueue];
  }
} 