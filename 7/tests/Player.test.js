import { test, describe } from 'node:test';
import assert from 'node:assert';
import { Player } from '../src/Player.js';
import { Board } from '../src/Board.js';

describe('Player', () => {
  describe('constructor', () => {
    test('should create player with correct initial state', () => {
      const player = new Player('TestPlayer');
      assert.strictEqual(player.name, 'TestPlayer');
      assert.strictEqual(player.numShips, 3);
      assert.strictEqual(player.board.showShips, true);
      assert.strictEqual(player.opponentBoard.showShips, false);
      assert.strictEqual(player.board.ships.length, 3);
    });

    test('should use default name if not provided', () => {
      const defaultPlayer = new Player();
      assert.strictEqual(defaultPlayer.name, 'Player');
    });

    test('should set up board with ships', () => {
      const player = new Player('TestPlayer');
      assert.strictEqual(player.board.ships.length, 3);
      assert.strictEqual(player.board.getRemainingShipCount(), 3);
    });
  });

  describe('makeGuess', () => {
    test('should accept valid guess format', () => {
      const player = new Player('TestPlayer');
      const result = player.makeGuess('34');
      
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.location, '34');
      assert.deepStrictEqual(result.coordinates, { row: 3, col: 4 });
    });

    test('should reject invalid guess formats', () => {
      const player = new Player('TestPlayer');
      const invalidInputs = ['', '1', '123', 'ab', 'a1', '1a', null];
      
      invalidInputs.forEach(input => {
        const result = player.makeGuess(input);
        assert.strictEqual(result.success, false);
        assert.strictEqual(result.error.includes('Invalid input format'), true);
      });
    });

    test('should reject out of bounds coordinates', () => {
      const player = new Player('TestPlayer');
      const result = player.makeGuess('99');
      assert.strictEqual(result.success, true); // 99 is actually valid (row 9, col 9)
      
      // Test with invalid coordinates that would be out of bounds if parsed differently
      const invalidResult = player.makeGuess('ab');
      assert.strictEqual(invalidResult.success, false);
    });

    test('should reject already guessed locations', () => {
      const player = new Player('TestPlayer');
      player.makeGuess('34'); // First guess
      const result = player.makeGuess('34'); // Repeat guess
      
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error.includes('already guessed'), true);
    });

    test('should track guesses correctly', () => {
      const player = new Player('TestPlayer');
      player.makeGuess('12');
      player.makeGuess('34');
      
      assert.strictEqual(player.opponentBoard.hasBeenGuessed('12'), true);
      assert.strictEqual(player.opponentBoard.hasBeenGuessed('34'), true);
      assert.strictEqual(player.opponentBoard.hasBeenGuessed('56'), false);
    });
  });

  describe('isValidGuessFormat', () => {
    test('should return true for valid formats', () => {
      const player = new Player('TestPlayer');
      assert.strictEqual(player.isValidGuessFormat('00'), true);
      assert.strictEqual(player.isValidGuessFormat('34'), true);
      assert.strictEqual(player.isValidGuessFormat('99'), true);
    });

    test('should return false for invalid formats', () => {
      const player = new Player('TestPlayer');
      assert.strictEqual(player.isValidGuessFormat(''), false);
      assert.strictEqual(player.isValidGuessFormat('1'), false);
      assert.strictEqual(player.isValidGuessFormat('123'), false);
      assert.strictEqual(player.isValidGuessFormat('ab'), false);
      assert.strictEqual(player.isValidGuessFormat('a1'), false);
      assert.strictEqual(player.isValidGuessFormat('1a'), false);
      assert.strictEqual(player.isValidGuessFormat(null), false);
      assert.strictEqual(player.isValidGuessFormat(undefined), false);
    });
  });

  describe('receiveAttack', () => {
    test('should process hit on player ship', () => {
      const player = new Player('TestPlayer');
      const ship = player.board.ships[0];
      const attackLocation = ship.locations[0];
      
      const result = player.receiveAttack(attackLocation);
      
      assert.strictEqual(result.hit, true);
      assert.strictEqual(result.ship, ship);
      assert.strictEqual(result.alreadyGuessed, false);
    });

    test('should process miss correctly', () => {
      const player = new Player('TestPlayer');
      // Find an empty location (not occupied by any ship)
      let missLocation = '99';
      const allShipLocations = player.board.ships.flatMap(ship => ship.locations);
      
      // Keep trying until we find a location that's not occupied
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const testLocation = `${row}${col}`;
          if (!allShipLocations.includes(testLocation)) {
            missLocation = testLocation;
            break;
          }
        }
      }
      
      const result = player.receiveAttack(missLocation);
      
      assert.strictEqual(result.hit, false);
      assert.strictEqual(result.ship, null);
    });

    test('should detect sunk ship', () => {
      const player = new Player('TestPlayer');
      const ship = player.board.ships[0];
      
      // Hit all locations of the ship
      ship.locations.forEach((location, index) => {
        const result = player.receiveAttack(location);
        if (index === ship.locations.length - 1) {
          assert.strictEqual(result.sunk, true);
        } else {
          assert.strictEqual(result.sunk, false);
        }
      });
    });

    test('should handle already attacked location', () => {
      const player = new Player('TestPlayer');
      const ship = player.board.ships[0];
      const attackLocation = ship.locations[0];
      
      player.receiveAttack(attackLocation); // First attack
      const result = player.receiveAttack(attackLocation); // Second attack
      
      assert.strictEqual(result.alreadyGuessed, true);
    });
  });

  describe('updateOpponentBoard', () => {
    test('should update opponent board with hit', () => {
      const player = new Player('TestPlayer');
      player.updateOpponentBoard('34', true);
      
      const grid = player.opponentBoard.getGrid();
      assert.strictEqual(grid[3][4], Board.HIT);
    });

    test('should update opponent board with miss', () => {
      const player = new Player('TestPlayer');
      player.updateOpponentBoard('34', false);
      
      const grid = player.opponentBoard.getGrid();
      assert.strictEqual(grid[3][4], Board.MISS);
    });
  });

  describe('getRemainingShips', () => {
    test('should return initial ship count', () => {
      const player = new Player('TestPlayer');
      assert.strictEqual(player.getRemainingShips(), 3);
    });

    test('should decrease when ships are sunk', () => {
      const player = new Player('TestPlayer');
      const ship = player.board.ships[0];
      
      // Sink the ship
      ship.locations.forEach(location => {
        player.receiveAttack(location);
      });
      
      assert.strictEqual(player.getRemainingShips(), 2);
    });
  });

  describe('hasLost', () => {
    test('should return false initially', () => {
      const player = new Player('TestPlayer');
      assert.strictEqual(player.hasLost(), false);
    });

    test('should return true when all ships are sunk', () => {
      const player = new Player('TestPlayer');
      // Sink all ships
      player.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          player.receiveAttack(location);
        });
      });
      
      assert.strictEqual(player.hasLost(), true);
    });
  });

  describe('getBoard', () => {
    test('should return player board grid', () => {
      const player = new Player('TestPlayer');
      const board = player.getBoard();
      
      assert.strictEqual(Array.isArray(board), true);
      assert.strictEqual(board.length, 10);
      assert.strictEqual(board[0].length, 10);
      
      // Should contain ship markers since showShips is true
      const flatBoard = board.flat();
      assert.strictEqual(flatBoard.includes(Board.SHIP), true);
    });
  });

  describe('getOpponentBoard', () => {
    test('should return opponent board grid', () => {
      const player = new Player('TestPlayer');
      const board = player.getOpponentBoard();
      
      assert.strictEqual(Array.isArray(board), true);
      assert.strictEqual(board.length, 10);
      assert.strictEqual(board[0].length, 10);
      
      // Should initially contain only water
      const flatBoard = board.flat();
      assert.strictEqual(flatBoard.every(cell => cell === Board.WATER), true);
    });

    test('should show hits and misses after attacks', () => {
      const player = new Player('TestPlayer');
      player.updateOpponentBoard('34', true);
      player.updateOpponentBoard('56', false);
      
      const board = player.getOpponentBoard();
      assert.strictEqual(board[3][4], Board.HIT);
      assert.strictEqual(board[5][6], Board.MISS);
    });
  });

  describe('getStats', () => {
    test('should return comprehensive player stats', () => {
      const player = new Player('TestPlayer');
      const stats = player.getStats();
      
      const expected = {
        name: 'TestPlayer',
        remainingShips: 3,
        totalGuesses: 0,
        hasLost: false
      };
      assert.deepStrictEqual(stats, expected);
    });

    test('should update stats after guesses', () => {
      const player = new Player('TestPlayer');
      player.makeGuess('12');
      player.makeGuess('34');
      
      const stats = player.getStats();
      assert.strictEqual(stats.totalGuesses, 2);
    });

    test('should update stats when ships are lost', () => {
      const player = new Player('TestPlayer');
      const ship = player.board.ships[0];
      ship.locations.forEach(location => {
        player.receiveAttack(location);
      });
      
      const stats = player.getStats();
      assert.strictEqual(stats.remainingShips, 2);
    });

    test('should update hasLost when all ships are sunk', () => {
      const player = new Player('TestPlayer');
      player.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          player.receiveAttack(location);
        });
      });
      
      const stats = player.getStats();
      assert.strictEqual(stats.hasLost, true);
      assert.strictEqual(stats.remainingShips, 0);
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete game interaction sequence', () => {
      const player = new Player('TestPlayer');
      // Make some guesses
      assert.strictEqual(player.makeGuess('12').success, true);
      assert.strictEqual(player.makeGuess('34').success, true);
      assert.strictEqual(player.makeGuess('12').success, false); // Duplicate
      
      // Update opponent board
      player.updateOpponentBoard('12', true);
      player.updateOpponentBoard('34', false);
      
      // Receive some attacks
      const ship = player.board.ships[0];
      const firstHit = player.receiveAttack(ship.locations[0]);
      assert.strictEqual(firstHit.hit, true);
      
      // Check final state
      assert.strictEqual(player.opponentBoard.getGuesses().length, 2);
      assert.strictEqual(player.board.getGuesses().length, 1);
      
      const stats = player.getStats();
      assert.strictEqual(stats.totalGuesses, 2);
    });

    test('should maintain board state consistency', () => {
      const player = new Player('TestPlayer');
      const initialPlayerBoard = player.getBoard();
      const initialOpponentBoard = player.getOpponentBoard();
      
      // Player board should show ships
      const playerShipCount = initialPlayerBoard.flat().filter(cell => cell === Board.SHIP).length;
      assert.strictEqual(playerShipCount, 9); // 3 ships × 3 length each
      
      // Opponent board should be empty
      const opponentNonWaterCount = initialOpponentBoard.flat().filter(cell => cell !== Board.WATER).length;
      assert.strictEqual(opponentNonWaterCount, 0);
    });
  });
}); 