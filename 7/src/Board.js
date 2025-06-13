import { Ship } from './Ship.js';

/**
 * Represents a game board in the Sea Battle game
 */
export class Board {
  static BOARD_SIZE = 10;
  static SHIP_LENGTH = 3;
  static WATER = '~';
  static SHIP = 'S';
  static HIT = 'X';
  static MISS = 'O';

  constructor(showShips = false) {
    this.size = Board.BOARD_SIZE;
    this.showShips = showShips; // Whether to show ships on the board (for player's own board)
    this.grid = this.createEmptyGrid();
    this.ships = [];
    this.guesses = new Set(); // Track all guesses made on this board
  }

  /**
   * Creates an empty grid filled with water symbols
   * @returns {Array<Array<string>>} - 2D array representing the board
   */
  createEmptyGrid() {
    return Array(this.size).fill(null).map(() => 
      Array(this.size).fill(Board.WATER)
    );
  }

  /**
   * Validates if coordinates are within board bounds
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {boolean} - True if coordinates are valid
   */
  isValidCoordinate(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Converts coordinate string to row/col numbers
   * @param {string} location - Location string like "34"
   * @returns {Object} - Object with row and col properties
   */
  parseLocation(location) {
    if (!location || location.length !== 2) {
      throw new Error('Invalid location format. Expected format: "34"');
    }
    
    const row = parseInt(location[0]);
    const col = parseInt(location[1]);
    
    if (isNaN(row) || isNaN(col)) {
      throw new Error('Invalid location format. Expected numeric coordinates.');
    }
    
    return { row, col };
  }

  /**
   * Converts row/col to location string
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {string} - Location string like "34"
   */
  formatLocation(row, col) {
    return `${row}${col}`;
  }

  /**
   * Places a ship randomly on the board
   * @param {number} shipLength - Length of the ship to place
   * @returns {Ship} - The placed ship
   */
  placeShipRandomly(shipLength = Board.SHIP_LENGTH) {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const { startRow, startCol } = this.getRandomStartPosition(orientation, shipLength);
      
      if (this.canPlaceShip(startRow, startCol, orientation, shipLength)) {
        const ship = this.createAndPlaceShip(startRow, startCol, orientation, shipLength);
        return ship;
      }
      
      attempts++;
    }
    
    throw new Error('Could not place ship after maximum attempts');
  }

  /**
   * Gets a random start position for ship placement
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @param {number} shipLength - Length of the ship
   * @returns {Object} - Object with startRow and startCol properties
   */
  getRandomStartPosition(orientation, shipLength) {
    if (orientation === 'horizontal') {
      return {
        startRow: Math.floor(Math.random() * this.size),
        startCol: Math.floor(Math.random() * (this.size - shipLength + 1))
      };
    } else {
      return {
        startRow: Math.floor(Math.random() * (this.size - shipLength + 1)),
        startCol: Math.floor(Math.random() * this.size)
      };
    }
  }

  /**
   * Checks if a ship can be placed at the given position
   * @param {number} startRow - Starting row
   * @param {number} startCol - Starting column
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @param {number} shipLength - Length of the ship
   * @returns {boolean} - True if ship can be placed
   */
  canPlaceShip(startRow, startCol, orientation, shipLength) {
    for (let i = 0; i < shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      
      if (!this.isValidCoordinate(row, col) || this.grid[row][col] !== Board.WATER) {
        return false;
      }
    }
    return true;
  }

  /**
   * Creates and places a ship on the board
   * @param {number} startRow - Starting row
   * @param {number} startCol - Starting column
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @param {number} shipLength - Length of the ship
   * @returns {Ship} - The created ship
   */
  createAndPlaceShip(startRow, startCol, orientation, shipLength) {
    const locations = [];
    
    for (let i = 0; i < shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      
      locations.push(this.formatLocation(row, col));
      // Always mark ship positions internally for collision detection
      this.grid[row][col] = Board.SHIP;
    }
    
    const ship = new Ship(locations, shipLength);
    this.ships.push(ship);
    return ship;
  }

  /**
   * Processes a guess at the given location
   * @param {string} location - Location string like "34"
   * @returns {Object} - Result of the guess {hit, sunk, alreadyGuessed, ship}
   */
  processGuess(location) {
    if (this.guesses.has(location)) {
      return { hit: false, sunk: false, alreadyGuessed: true, ship: null };
    }
    
    this.guesses.add(location);
    const { row, col } = this.parseLocation(location);
    
    // Check if any ship is hit
    for (const ship of this.ships) {
      if (ship.hasLocation(location)) {
        const wasHit = ship.hit(location);
        if (wasHit) {
          this.grid[row][col] = Board.HIT;
          return {
            hit: true,
            sunk: ship.isSunk(),
            alreadyGuessed: false,
            ship
          };
        }
      }
    }
    
    // Miss
    this.grid[row][col] = Board.MISS;
    return { hit: false, sunk: false, alreadyGuessed: false, ship: null };
  }

  /**
   * Gets the number of remaining (non-sunk) ships
   * @returns {number} - Number of ships still afloat
   */
  getRemainingShipCount() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }

  /**
   * Gets the current state of the board as a 2D array
   * @returns {Array<Array<string>>} - Copy of the current board state
   */
  getGrid() {
    if (this.showShips) {
      // Show ships if flag is set
      return this.grid.map(row => [...row]);
    } else {
      // Hide ships - replace ship positions with water for display
      return this.grid.map(row => 
        row.map(cell => cell === Board.SHIP ? Board.WATER : cell)
      );
    }
  }

  /**
   * Checks if a location has been guessed
   * @param {string} location - Location string like "34"
   * @returns {boolean} - True if location has been guessed
   */
  hasBeenGuessed(location) {
    return this.guesses.has(location);
  }

  /**
   * Gets all guessed locations
   * @returns {Array<string>} - Array of all guessed locations
   */
  getGuesses() {
    return Array.from(this.guesses);
  }
} 