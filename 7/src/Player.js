import { Board } from './Board.js';

/**
 * Represents a human player in the Sea Battle game
 */
export class Player {
  constructor(name = 'Player') {
    this.name = name;
    this.board = new Board(true); // Show ships on player's own board
    this.opponentBoard = new Board(false); // Don't show ships on opponent's board
    this.numShips = 3;
    this.setupBoard();
  }

  /**
   * Sets up the player's board with ships
   */
  setupBoard() {
    for (let i = 0; i < this.numShips; i++) {
      this.board.placeShipRandomly();
    }
  }

  /**
   * Makes a guess at the opponent's board
   * @param {string} location - Location string like "34"
   * @returns {Object} - Result of the guess
   */
  makeGuess(location) {
    try {
      // Validate the location format
      if (!this.isValidGuessFormat(location)) {
        return {
          success: false,
          error: 'Invalid input format. Please enter exactly two digits (e.g., 00, 34, 98).'
        };
      }

      // Parse and validate coordinates
      const { row, col } = this.opponentBoard.parseLocation(location);
      
      if (!this.opponentBoard.isValidCoordinate(row, col)) {
        return {
          success: false,
          error: `Invalid coordinates. Please enter values between 0 and ${Board.BOARD_SIZE - 1}.`
        };
      }

      // Check if already guessed
      if (this.opponentBoard.hasBeenGuessed(location)) {
        return {
          success: false,
          error: 'You already guessed that location!'
        };
      }

      // Record the guess on the opponent board display
      this.opponentBoard.guesses.add(location);
      
      return {
        success: true,
        location,
        coordinates: { row, col }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validates the format of a guess
   * @param {string} guess - The guess string
   * @returns {boolean} - True if format is valid
   */
  isValidGuessFormat(guess) {
    return !!(guess && 
             guess.length === 2 && 
             /^\d{2}$/.test(guess));
  }

  /**
   * Processes an incoming attack on this player's board
   * @param {string} location - Location string like "34"
   * @returns {Object} - Result of the attack
   */
  receiveAttack(location) {
    return this.board.processGuess(location);
  }

  /**
   * Updates the opponent board display after an attack
   * @param {string} location - Location string like "34"
   * @param {boolean} hit - Whether the attack was a hit
   */
  updateOpponentBoard(location, hit) {
    const { row, col } = this.opponentBoard.parseLocation(location);
    this.opponentBoard.grid[row][col] = hit ? Board.HIT : Board.MISS;
  }

  /**
   * Gets the number of remaining ships
   * @returns {number} - Number of ships still afloat
   */
  getRemainingShips() {
    return this.board.getRemainingShipCount();
  }

  /**
   * Checks if the player has lost (all ships sunk)
   * @returns {boolean} - True if player has lost
   */
  hasLost() {
    return this.getRemainingShips() === 0;
  }

  /**
   * Gets the player's board for display
   * @returns {Array<Array<string>>} - 2D array of the player's board
   */
  getBoard() {
    return this.board.getGrid();
  }

  /**
   * Gets the opponent board for display
   * @returns {Array<Array<string>>} - 2D array of the opponent board view
   */
  getOpponentBoard() {
    return this.opponentBoard.getGrid();
  }

  /**
   * Gets player statistics
   * @returns {Object} - Object containing player stats
   */
  getStats() {
    return {
      name: this.name,
      remainingShips: this.getRemainingShips(),
      totalGuesses: this.opponentBoard.getGuesses().length,
      hasLost: this.hasLost()
    };
  }
} 