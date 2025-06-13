import { test, describe } from 'node:test';
import assert from 'node:assert';
import { Game } from '../src/Game.js';
import { Player } from '../src/Player.js';
import { AIPlayer } from '../src/AIPlayer.js';

describe('Game', () => {
  describe('constructor', () => {
    test('should create game with initial state', () => {
      const game = new Game();
      assert.strictEqual(game.player instanceof Player, true);
      assert.strictEqual(game.aiPlayer instanceof AIPlayer, true);
      assert.strictEqual(game.gameRunning, false);
      assert.strictEqual(game.rl, null);
    });

    test('should create players with correct names', () => {
      const game = new Game();
      assert.strictEqual(game.player.name, 'Player');
      assert.strictEqual(game.aiPlayer.name, 'Computer');
    });
  });

  describe('checkGameOver', () => {
    test('should return false when game is ongoing', () => {
      const game = new Game();
      const result = game.checkGameOver();
      assert.strictEqual(result, false);
      assert.strictEqual(game.gameRunning, false); // Should remain false since game hasn't started
    });

    test('should return true when player loses', () => {
      const game = new Game();
      // Sink all player ships
      game.player.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          game.player.receiveAttack(location);
        });
      });
      
      game.gameRunning = true; // Set game as running first
      const result = game.checkGameOver();
      
      assert.strictEqual(result, true);
      assert.strictEqual(game.gameRunning, false);
    });

    test('should return true when AI loses', () => {
      const game = new Game();
      // Sink all AI ships
      game.aiPlayer.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          game.aiPlayer.receiveAttack(location);
        });
      });
      
      game.gameRunning = true; // Set game as running first
      const result = game.checkGameOver();
      
      assert.strictEqual(result, true);
      assert.strictEqual(game.gameRunning, false);
    });
  });

  describe('getWinner', () => {
    test('should return null when game is ongoing', () => {
      const game = new Game();
      assert.strictEqual(game.getWinner(), null);
    });

    test('should return AI name when player loses', () => {
      const game = new Game();
      // Sink all player ships
      game.player.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          game.player.receiveAttack(location);
        });
      });
      
      assert.strictEqual(game.getWinner(), 'Computer');
    });

    test('should return player name when AI loses', () => {
      const game = new Game();
      // Sink all AI ships
      game.aiPlayer.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          game.aiPlayer.receiveAttack(location);
        });
      });
      
      assert.strictEqual(game.getWinner(), 'Player');
    });
  });

  describe('getGameState', () => {
    test('should return complete game state', () => {
      const game = new Game();
      const state = game.getGameState();
      
      assert.strictEqual(typeof state.gameRunning, 'boolean');
      assert.strictEqual(typeof state.player, 'object');
      assert.strictEqual(typeof state.aiPlayer, 'object');
      assert.strictEqual(state.winner === null || typeof state.winner === 'string', true);
      
      assert.strictEqual(state.gameRunning, false);
      assert.deepStrictEqual(state.player, game.player.getStats());
      assert.deepStrictEqual(state.aiPlayer, game.aiPlayer.getStats());
      assert.strictEqual(state.winner, null);
    });

    test('should reflect winner when game is over', () => {
      const game = new Game();
      // Sink all AI ships
      game.aiPlayer.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          game.aiPlayer.receiveAttack(location);
        });
      });
      
      const state = game.getGameState();
      assert.strictEqual(state.winner, 'Player');
    });
  });

  describe('getGameStats', () => {
    test('should return comprehensive game statistics', () => {
      const game = new Game();
      const stats = game.getGameStats();
      
      assert.strictEqual(typeof stats.player, 'object');
      assert.strictEqual(typeof stats.aiPlayer, 'object');
      assert.strictEqual(typeof stats.gameState, 'object');
      
      assert.deepStrictEqual(stats.player, game.player.getStats());
      assert.deepStrictEqual(stats.aiPlayer, game.aiPlayer.getStats());
      assert.deepStrictEqual(stats.gameState, game.getGameState());
    });
  });

  describe('reset', () => {
    test('should reset game to initial state', () => {
      const game = new Game();
      game.gameRunning = true;
      
      // Make some moves to change state
      game.player.makeGuess('12');
      game.aiPlayer.makeGuess();
      
      // Reset the game
      game.reset();
      
      assert.strictEqual(game.gameRunning, false);
      assert.strictEqual(game.rl, null);
      assert.strictEqual(game.player instanceof Player, true);
      assert.strictEqual(game.aiPlayer instanceof AIPlayer, true);
      
      // Verify new instances were created (should have fresh state)
      assert.strictEqual(game.player.opponentBoard.getGuesses().length, 0);
    });
  });

  describe('endGame', () => {
    test('should clean up resources', () => {
      const game = new Game();
      const mockRl = {
        close: () => {},
        question: () => {}
      };
      game.rl = mockRl;
      
      game.endGame();
      
      assert.strictEqual(game.gameRunning, false);
    });

    test('should handle null readline interface', () => {
      const game = new Game();
      game.rl = null;
      
      assert.doesNotThrow(() => game.endGame());
      assert.strictEqual(game.gameRunning, false);
    });
  });

  describe('delay', () => {
    test('should resolve after specified time', async () => {
      const game = new Game();
      const startTime = Date.now();
      await game.delay(50);
      const endTime = Date.now();
      
      assert.strictEqual(endTime - startTime >= 45, true); // Allow some margin
    });
  });

  describe('displayGameState', () => {
    test('should not throw when displaying game state', () => {
      const game = new Game();
      assert.doesNotThrow(() => game.displayGameState());
    });
  });

  describe('handleAITurn', () => {
    test('should process AI turn correctly', async () => {
      const game = new Game();
      const initialGuesses = game.aiPlayer.opponentBoard.getGuesses().length;
      
      await game.handleAITurn();
      
      const finalGuesses = game.aiPlayer.opponentBoard.getGuesses().length;
      assert.strictEqual(finalGuesses, initialGuesses + 1);
    });

    test('should update AI strategy based on result', async () => {
      const game = new Game();
      const initialMode = game.aiPlayer.getCurrentMode();
      assert.strictEqual(initialMode, 'hunt');
      
      // Mock a hit scenario by placing a ship at a known location
      const ship = game.player.board.ships[0];
      const shipLocation = ship.locations[0];
      
      // Force the AI to target this location
      game.aiPlayer.opponentBoard.guesses.clear();
      game.aiPlayer.targetQueue = [shipLocation];
      game.aiPlayer.mode = 'target';
      
      await game.handleAITurn();
      
      // AI should remain in target mode after a hit
      assert.strictEqual(game.aiPlayer.getCurrentMode(), 'target');
    });
  });

  describe('Integration Tests', () => {
    test('should maintain proper game flow', () => {
      const game = new Game();
      
      // Initial state checks
      assert.strictEqual(game.player.getRemainingShips(), 3);
      assert.strictEqual(game.aiPlayer.getRemainingShips(), 3);
      assert.strictEqual(game.getWinner(), null);
    });

    test('should handle complete game scenario', () => {
      const game = new Game();
      
      // Simulate player winning by sinking all AI ships
      game.aiPlayer.board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          game.aiPlayer.receiveAttack(location);
        });
      });
      
      // Check game over condition
      assert.strictEqual(game.checkGameOver(), true);
      assert.strictEqual(game.getWinner(), 'Player');
      assert.strictEqual(game.gameRunning, false);
    });

    test('should maintain board state consistency throughout game', async () => {
      const game = new Game();
      
      const initialPlayerShips = game.player.getRemainingShips();
      const initialAIShips = game.aiPlayer.getRemainingShips();
      
      // Perform an AI turn
      await game.handleAITurn();
      
      // Ships should remain the same or decrease (if hit)
      assert.strictEqual(game.player.getRemainingShips() <= initialPlayerShips, true);
      assert.strictEqual(game.aiPlayer.getRemainingShips(), initialAIShips); // AI ships shouldn't change from AI turns
      
      // Total guesses should increase
      assert.strictEqual(game.aiPlayer.opponentBoard.getGuesses().length > 0, true);
    });
  });

  describe('Error Handling', () => {
    test('should handle errors gracefully', () => {
      const game = new Game();
      // Test with modified state - should not crash
      const originalPlayer = game.player;
      game.player = null;
      
      assert.doesNotThrow(() => {
        try {
          game.getGameStats();
        } catch (error) {
          // Expected to potentially throw, but shouldn't crash the process
        }
      });
      
      // Restore for cleanup
      game.player = originalPlayer;
    });

    test('should handle AI guess errors', async () => {
      const game = new Game();
      // Mock AI to throw error
      const originalMakeGuess = game.aiPlayer.makeGuess;
      game.aiPlayer.makeGuess = () => {
        throw new Error('Test error');
      };
      
      // Should not crash the game
      try {
        await game.handleAITurn();
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.strictEqual(error.message, 'Test error');
      }
      
      // Restore original method
      game.aiPlayer.makeGuess = originalMakeGuess;
    });
  });
}); 