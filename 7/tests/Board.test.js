import { test, describe } from 'node:test';
import assert from 'node:assert';
import { Board } from '../src/Board.js';

describe('Board', () => {
  describe('constructor', () => {
    test('should create a board with correct size and initial state', () => {
      const board = new Board();
      assert.strictEqual(board.size, 10);
      assert.strictEqual(board.showShips, false);
      assert.strictEqual(board.ships.length, 0);
      assert.strictEqual(board.guesses.size, 0);
    });

    test('should create board with showShips flag', () => {
      const playerBoard = new Board(true);
      assert.strictEqual(playerBoard.showShips, true);
    });

    test('should initialize grid with water symbols', () => {
      const board = new Board();
      const grid = board.getGrid();
      assert.strictEqual(grid.length, 10);
      assert.strictEqual(grid[0].length, 10);
      assert.strictEqual(grid[0][0], Board.WATER);
      assert.strictEqual(grid[9][9], Board.WATER);
    });
  });

  describe('isValidCoordinate', () => {
    test('should return true for valid coordinates', () => {
      const board = new Board();
      assert.strictEqual(board.isValidCoordinate(0, 0), true);
      assert.strictEqual(board.isValidCoordinate(5, 5), true);
      assert.strictEqual(board.isValidCoordinate(9, 9), true);
    });

    test('should return false for invalid coordinates', () => {
      const board = new Board();
      assert.strictEqual(board.isValidCoordinate(-1, 0), false);
      assert.strictEqual(board.isValidCoordinate(0, -1), false);
      assert.strictEqual(board.isValidCoordinate(10, 0), false);
      assert.strictEqual(board.isValidCoordinate(0, 10), false);
      assert.strictEqual(board.isValidCoordinate(10, 10), false);
    });
  });

  describe('parseLocation', () => {
    test('should parse valid location strings', () => {
      const board = new Board();
      assert.deepStrictEqual(board.parseLocation('00'), { row: 0, col: 0 });
      assert.deepStrictEqual(board.parseLocation('34'), { row: 3, col: 4 });
      assert.deepStrictEqual(board.parseLocation('99'), { row: 9, col: 9 });
    });

    test('should throw error for invalid location format', () => {
      const board = new Board();
      const invalidInputs = ['', '1', '123', 'ab', null];
      
      invalidInputs.forEach(input => {
        assert.throws(() => board.parseLocation(input), /Invalid location format/);
      });
    });
  });

  describe('formatLocation', () => {
    test('should format coordinates to location string', () => {
      const board = new Board();
      assert.strictEqual(board.formatLocation(0, 0), '00');
      assert.strictEqual(board.formatLocation(3, 4), '34');
      assert.strictEqual(board.formatLocation(9, 9), '99');
    });
  });

  describe('canPlaceShip', () => {
    test('should allow placement in empty area', () => {
      const board = new Board();
      assert.strictEqual(board.canPlaceShip(0, 0, 'horizontal', 3), true);
      assert.strictEqual(board.canPlaceShip(0, 0, 'vertical', 3), true);
    });

    test('should not allow placement outside bounds', () => {
      const board = new Board();
      assert.strictEqual(board.canPlaceShip(0, 8, 'horizontal', 3), false);
      assert.strictEqual(board.canPlaceShip(8, 0, 'vertical', 3), false);
      assert.strictEqual(board.canPlaceShip(9, 9, 'horizontal', 3), false);
      assert.strictEqual(board.canPlaceShip(9, 9, 'vertical', 3), false);
    });

    test('should not allow placement over existing ship', () => {
      const board = new Board();
      // Place a ship first
      board.createAndPlaceShip(0, 0, 'horizontal', 3);
      
      // Try to place overlapping ships
      assert.strictEqual(board.canPlaceShip(0, 0, 'horizontal', 3), false);
      assert.strictEqual(board.canPlaceShip(0, 1, 'vertical', 3), false);
    });
  });

  describe('createAndPlaceShip', () => {
    test('should create and place horizontal ship', () => {
      const board = new Board();
      const ship = board.createAndPlaceShip(2, 3, 'horizontal', 3);
      
      assert.deepStrictEqual(ship.locations, ['23', '24', '25']);
      assert.strictEqual(board.ships.includes(ship), true);
    });

    test('should create and place vertical ship', () => {
      const board = new Board();
      const ship = board.createAndPlaceShip(2, 3, 'vertical', 3);
      
      assert.deepStrictEqual(ship.locations, ['23', '33', '43']);
      assert.strictEqual(board.ships.includes(ship), true);
    });

    test('should mark grid positions when showShips is true', () => {
      const playerBoard = new Board(true);
      const ship = playerBoard.createAndPlaceShip(0, 0, 'horizontal', 3);
      
      const grid = playerBoard.getGrid();
      assert.strictEqual(grid[0][0], Board.SHIP);
      assert.strictEqual(grid[0][1], Board.SHIP);
      assert.strictEqual(grid[0][2], Board.SHIP);
    });

    test('should not mark grid positions when showShips is false', () => {
      const board = new Board();
      const ship = board.createAndPlaceShip(0, 0, 'horizontal', 3);
      
      const grid = board.getGrid();
      assert.strictEqual(grid[0][0], Board.WATER);
      assert.strictEqual(grid[0][1], Board.WATER);
      assert.strictEqual(grid[0][2], Board.WATER);
    });
  });

  describe('placeShipRandomly', () => {
    test('should place ship successfully', () => {
      const board = new Board();
      const ship = board.placeShipRandomly(3);
      
      assert.notStrictEqual(ship, undefined);
      assert.strictEqual(ship.locations.length, 3);
      assert.strictEqual(board.ships.includes(ship), true);
    });

    test('should place multiple ships without collision', () => {
      const board = new Board();
      const ship1 = board.placeShipRandomly(3);
      const ship2 = board.placeShipRandomly(3);
      const ship3 = board.placeShipRandomly(3);
      
      assert.strictEqual(board.ships.length, 3);
      
      // Check no overlapping locations
      const allLocations = [
        ...ship1.locations,
        ...ship2.locations,
        ...ship3.locations
      ];
      const uniqueLocations = new Set(allLocations);
      assert.strictEqual(uniqueLocations.size, allLocations.length);
    });
  });

  describe('processGuess', () => {
    test('should process hit correctly', () => {
      const board = new Board();
      const ship = board.createAndPlaceShip(0, 0, 'horizontal', 3);
      
      const result = board.processGuess('00');
      
      assert.strictEqual(result.hit, true);
      assert.strictEqual(result.sunk, false);
      assert.strictEqual(result.alreadyGuessed, false);
      assert.strictEqual(result.ship, ship);
      
      const grid = board.getGrid();
      assert.strictEqual(grid[0][0], Board.HIT);
    });

    test('should process miss correctly', () => {
      const board = new Board();
      board.createAndPlaceShip(0, 0, 'horizontal', 3);
      
      const result = board.processGuess('99');
      
      assert.strictEqual(result.hit, false);
      assert.strictEqual(result.sunk, false);
      assert.strictEqual(result.alreadyGuessed, false);
      assert.strictEqual(result.ship, null);
      
      const grid = board.getGrid();
      assert.strictEqual(grid[9][9], Board.MISS);
    });

    test('should detect sunk ship', () => {
      const board = new Board();
      const ship = board.createAndPlaceShip(0, 0, 'horizontal', 3);
      
      board.processGuess('00');
      board.processGuess('01');
      const result = board.processGuess('02');
      
      assert.strictEqual(result.hit, true);
      assert.strictEqual(result.sunk, true);
      assert.strictEqual(result.ship, ship);
    });

    test('should handle already guessed location', () => {
      const board = new Board();
      board.createAndPlaceShip(0, 0, 'horizontal', 3);
      
      board.processGuess('00');
      const result = board.processGuess('00');
      
      assert.strictEqual(result.hit, false);
      assert.strictEqual(result.sunk, false);
      assert.strictEqual(result.alreadyGuessed, true);
      assert.strictEqual(result.ship, null);
    });

    test('should track guesses', () => {
      const board = new Board();
      board.processGuess('00');
      board.processGuess('11');
      
      assert.strictEqual(board.hasBeenGuessed('00'), true);
      assert.strictEqual(board.hasBeenGuessed('11'), true);
      assert.strictEqual(board.hasBeenGuessed('22'), false);
    });
  });

  describe('getRemainingShipCount', () => {
    test('should return correct count for unsunk ships', () => {
      const board = new Board();
      board.createAndPlaceShip(0, 0, 'horizontal', 3);
      board.createAndPlaceShip(2, 0, 'horizontal', 3);
      
      assert.strictEqual(board.getRemainingShipCount(), 2);
    });

    test('should return correct count after sinking ships', () => {
      const board = new Board();
      const ship1 = board.createAndPlaceShip(0, 0, 'horizontal', 3);
      const ship2 = board.createAndPlaceShip(2, 0, 'horizontal', 3);
      
      // Sink first ship
      board.processGuess('00');
      board.processGuess('01');
      board.processGuess('02');
      
      assert.strictEqual(board.getRemainingShipCount(), 1);
    });

    test('should return 0 when all ships are sunk', () => {
      const board = new Board();
      const ship = board.createAndPlaceShip(0, 0, 'horizontal', 3);
      
      board.processGuess('00');
      board.processGuess('01');
      board.processGuess('02');
      
      assert.strictEqual(board.getRemainingShipCount(), 0);
    });
  });

  describe('getGrid', () => {
    test('should return a copy of the grid', () => {
      const board = new Board();
      const grid = board.getGrid();
      grid[0][0] = 'X';
      
      const originalGrid = board.getGrid();
      assert.strictEqual(originalGrid[0][0], Board.WATER);
    });
  });

  describe('getGuesses', () => {
    test('should return array of all guesses', () => {
      const board = new Board();
      board.processGuess('00');
      board.processGuess('11');
      
      const guesses = board.getGuesses();
      assert.strictEqual(guesses.includes('00'), true);
      assert.strictEqual(guesses.includes('11'), true);
      assert.strictEqual(guesses.length, 2);
    });
  });
}); 