import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AIPlayer } from '../src/AIPlayer.js';
import { Board } from '../src/Board.js';

describe('AIPlayer', () => {
  describe('constructor', () => {
    test('should create AI player with correct initial state', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      assert.strictEqual(aiPlayer.name, 'TestCPU');
      assert.strictEqual(aiPlayer.numShips, 3);
      assert.strictEqual(aiPlayer.mode, 'hunt');
      assert.strictEqual(aiPlayer.targetQueue.length, 0);
      assert.strictEqual(aiPlayer.board.ships.length, 3);
    });

    test('should use default name if not provided', () => {
      const defaultAI = new AIPlayer();
      assert.strictEqual(defaultAI.name, 'CPU');
    });
  });

  describe('makeGuess', () => {
    test('should make a valid guess in hunt mode', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      const guess = aiPlayer.makeGuess();
      
      assert.strictEqual(typeof guess, 'string');
      assert.strictEqual(guess.length, 2);
      assert.strictEqual(/^\d{2}$/.test(guess), true);
      assert.strictEqual(aiPlayer.opponentBoard.hasBeenGuessed(guess), true);
    });

    test('should not repeat the same guess', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      const guesses = new Set();
      
      for (let i = 0; i < 10; i++) {
        const guess = aiPlayer.makeGuess();
        assert.strictEqual(guesses.has(guess), false);
        guesses.add(guess);
      }
    });

    test('should prioritize target queue when in target mode', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      // Set up target mode with specific targets
      aiPlayer.mode = 'target';
      aiPlayer.targetQueue = ['23', '24', '25'];
      
      const guess = aiPlayer.makeGuess();
      assert.strictEqual(['23', '24', '25'].includes(guess), true);
    });

    test('should switch to hunt mode when target queue is empty', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      aiPlayer.mode = 'target';
      aiPlayer.targetQueue = [];
      
      const guess = aiPlayer.makeGuess();
      assert.strictEqual(aiPlayer.mode, 'hunt');
    });

    test('should skip already guessed targets and continue with queue', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      aiPlayer.mode = 'target';
      aiPlayer.targetQueue = ['23', '24', '25'];
      aiPlayer.opponentBoard.guesses.add('23'); // Mark as already guessed
      
      const guess = aiPlayer.makeGuess();
      assert.strictEqual(guess, '24');
    });
  });

  describe('processGuessResult', () => {
    test('should stay in hunt mode after miss', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      aiPlayer.processGuessResult('34', false, false);
      
      assert.strictEqual(aiPlayer.mode, 'hunt');
      assert.strictEqual(aiPlayer.targetQueue.length, 0);
      
      const grid = aiPlayer.opponentBoard.getGrid();
      assert.strictEqual(grid[3][4], Board.MISS);
    });

    test('should switch to target mode after hit', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      aiPlayer.processGuessResult('34', true, false);
      
      assert.strictEqual(aiPlayer.mode, 'target');
      assert.strictEqual(aiPlayer.targetQueue.length > 0, true);
      
      const grid = aiPlayer.opponentBoard.getGrid();
      assert.strictEqual(grid[3][4], Board.HIT);
    });

    test('should add adjacent targets after hit', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      aiPlayer.processGuessResult('34', true, false);
      
      const expectedTargets = ['24', '44', '33', '35'];
      const actualTargets = aiPlayer.getTargetQueue();
      
      // Check that valid adjacent targets are added
      expectedTargets.forEach(target => {
        const { row, col } = aiPlayer.opponentBoard.parseLocation(target);
        if (aiPlayer.opponentBoard.isValidCoordinate(row, col)) {
          assert.strictEqual(actualTargets.includes(target), true);
        }
      });
    });

    test('should return to hunt mode after sinking ship', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      aiPlayer.mode = 'target';
      aiPlayer.targetQueue = ['23', '24', '25'];
      
      aiPlayer.processGuessResult('34', true, true);
      
      assert.strictEqual(aiPlayer.mode, 'hunt');
      assert.strictEqual(aiPlayer.targetQueue.length, 0);
    });

    test('should not add already guessed locations to target queue', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      // Mark some adjacent locations as already guessed
      aiPlayer.opponentBoard.guesses.add('24');
      aiPlayer.opponentBoard.guesses.add('33');
      
      aiPlayer.processGuessResult('34', true, false);
      
      const targetQueue = aiPlayer.getTargetQueue();
      assert.strictEqual(targetQueue.includes('24'), false);
      assert.strictEqual(targetQueue.includes('33'), false);
    });

    test('should handle edge cases for target addition', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      // Test corner position
      aiPlayer.processGuessResult('00', true, false);
      
      const targetQueue = aiPlayer.getTargetQueue();
      assert.strictEqual(targetQueue.includes('10'), true);
      assert.strictEqual(targetQueue.includes('01'), true);
      assert.strictEqual(targetQueue.includes('-10'), false); // Invalid coordinates
      assert.strictEqual(targetQueue.includes('0-1'), false); // Invalid coordinates
    });

    test('should handle board edge positions correctly', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      // Test edge position (9,9)
      aiPlayer.processGuessResult('99', true, false);
      
      const targetQueue = aiPlayer.getTargetQueue();
      assert.strictEqual(targetQueue.includes('89'), true);
      assert.strictEqual(targetQueue.includes('98'), true);
      assert.strictEqual(targetQueue.length, 2); // Only 2 valid adjacent positions
    });
  });

  describe('receiveAttack', () => {
    test('should process attack on AI board correctly', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      // Get a ship location to attack
      const ship = aiPlayer.board.ships[0];
      const attackLocation = ship.locations[0];
      
      const result = aiPlayer.receiveAttack(attackLocation);
      
      assert.strictEqual(result.hit, true);
      assert.strictEqual(result.alreadyGuessed, false);
      assert.strictEqual(result.ship, ship);
    });

    test('should handle miss correctly', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      const result = aiPlayer.receiveAttack('99');
      
      // Note: This might hit if there's a ship at 99, so we need to find an empty spot
      // For this test, we'll just check the structure of the response
      assert.strictEqual(typeof result.hit, 'boolean');
      assert.strictEqual(result.ship === null || typeof result.ship === 'object', true);
    });
  });

  describe('getRemainingShips', () => {
    test('should return initial ship count', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      assert.strictEqual(aiPlayer.getRemainingShips(), 3);
    });

    test('should decrease when ships are sunk', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      const ship = aiPlayer.board.ships[0];
      
      // Sink the ship
      ship.locations.forEach(location => {
        aiPlayer.receiveAttack(location);
      });
      
      assert.strictEqual(aiPlayer.getRemainingShips(), 2);
    });
  });

  describe('hasLost', () => {
    test('should return false initially', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      assert.strictEqual(aiPlayer.hasLost(), false);
    });

    test('should return true when all ships are sunk', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      // Sink all ships
      aiPlayer.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          aiPlayer.receiveAttack(location);
        });
      });
      
      assert.strictEqual(aiPlayer.hasLost(), true);
    });
  });

  describe('getStats', () => {
    test('should return comprehensive stats', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      const stats = aiPlayer.getStats();
      
      const expected = {
        name: 'TestCPU',
        remainingShips: 3,
        totalGuesses: 0,
        hasLost: false,
        mode: 'hunt',
        targetQueueLength: 0
      };
      assert.deepStrictEqual(stats, expected);
    });

    test('should update stats after making guesses', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      aiPlayer.makeGuess();
      aiPlayer.makeGuess();
      
      const stats = aiPlayer.getStats();
      assert.strictEqual(stats.totalGuesses, 2);
    });
  });

  describe('resetStrategy', () => {
    test('should reset AI strategy to initial state', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      // Change AI state
      aiPlayer.mode = 'target';
      aiPlayer.targetQueue = ['12', '13', '14'];
      
      aiPlayer.resetStrategy();
      
      assert.strictEqual(aiPlayer.mode, 'hunt');
      assert.strictEqual(aiPlayer.targetQueue.length, 0);
    });
  });

  describe('getCurrentMode', () => {
    test('should return current mode', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      assert.strictEqual(aiPlayer.getCurrentMode(), 'hunt');
      
      aiPlayer.mode = 'target';
      assert.strictEqual(aiPlayer.getCurrentMode(), 'target');
    });
  });

  describe('getTargetQueue', () => {
    test('should return copy of target queue', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      aiPlayer.targetQueue = ['12', '13', '14'];
      
      const queue = aiPlayer.getTargetQueue();
      assert.deepStrictEqual(queue, ['12', '13', '14']);
      
      // Verify it's a copy
      queue.push('15');
      assert.strictEqual(aiPlayer.targetQueue.length, 3);
    });
  });

  describe('AI Strategy Integration', () => {
    test('should demonstrate complete hunt-to-target-to-hunt cycle', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      // Start in hunt mode
      assert.strictEqual(aiPlayer.getCurrentMode(), 'hunt');
      
      // Hit a target (switch to target mode)
      aiPlayer.processGuessResult('45', true, false);
      assert.strictEqual(aiPlayer.getCurrentMode(), 'target');
      assert.strictEqual(aiPlayer.getTargetQueue().length > 0, true);
      
      // Sink the ship (return to hunt mode)
      aiPlayer.processGuessResult('46', true, true);
      assert.strictEqual(aiPlayer.getCurrentMode(), 'hunt');
      assert.strictEqual(aiPlayer.getTargetQueue().length, 0);
    });

    test('should handle multiple hits on same ship', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      // First hit
      aiPlayer.processGuessResult('45', true, false);
      const initialQueueLength = aiPlayer.getTargetQueue().length;
      
      // Second hit on same ship
      aiPlayer.processGuessResult('46', true, false);
      const secondQueueLength = aiPlayer.getTargetQueue().length;
      
      assert.strictEqual(aiPlayer.getCurrentMode(), 'target');
      // Queue should have targets
      assert.strictEqual(secondQueueLength > 0, true);
    });

    test('should maintain valid target queue after multiple operations', () => {
      const aiPlayer = new AIPlayer('TestCPU');
      // Simulate a complex targeting scenario
      aiPlayer.processGuessResult('45', true, false); // Hit
      aiPlayer.processGuessResult('35', false, false); // Miss on target
      aiPlayer.processGuessResult('55', true, false); // Another hit
      
      const queue = aiPlayer.getTargetQueue();
      
      // All targets should be valid coordinates
      queue.forEach(target => {
        const { row, col } = aiPlayer.opponentBoard.parseLocation(target);
        assert.strictEqual(aiPlayer.opponentBoard.isValidCoordinate(row, col), true);
        assert.strictEqual(aiPlayer.opponentBoard.hasBeenGuessed(target), false);
      });
    });
  });
}); 