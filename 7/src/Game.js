import readline from 'readline';
import { Player } from './Player.js';
import { AIPlayer } from './AIPlayer.js';
import { GameDisplay } from './GameDisplay.js';

/**
 * Main game controller for the Sea Battle game
 * Coordinates all game logic and manages game flow
 */
export class Game {
  constructor() {
    this.player = new Player('Player');
    this.aiPlayer = new AIPlayer('Computer');
    this.gameRunning = false;
    this.rl = null;
  }

  /**
   * Initializes the game
   */
  async init() {
    this.setupReadline();
    GameDisplay.printWelcome();
    GameDisplay.printSetupComplete();
  }

  /**
   * Sets up the readline interface for user input
   */
  setupReadline() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Starts the main game loop
   */
  async start() {
    this.gameRunning = true;
    await this.gameLoop();
  }

  /**
   * Main game loop - handles turn-based gameplay
   */
  async gameLoop() {
    while (this.gameRunning) {
      // Check for game over conditions
      if (this.checkGameOver()) {
        break;
      }

      // Display current game state
      this.displayGameState();

      // Player's turn
      const playerTurnResult = await this.handlePlayerTurn();
      if (!playerTurnResult) {
        continue; // Invalid input, retry
      }

      // Check for game over after player's turn
      if (this.checkGameOver()) {
        break;
      }

      // AI's turn
      await this.handleAITurn();
    }

    this.endGame();
  }

  /**
   * Displays the current game state (boards only)
   */
  displayGameState() {
    GameDisplay.printBoards(
      this.player.getOpponentBoard(),
      this.player.getBoard()
    );
  }

  /**
   * Handles a player's turn
   * @returns {Promise<boolean>} - True if turn was successful, false if retry needed
   */
  async handlePlayerTurn() {
    return new Promise((resolve) => {
      const prompt = GameDisplay.printPrompt();
      
      this.rl.question(prompt, (answer) => {
        const guessResult = this.player.makeGuess(answer);
        
        if (!guessResult.success) {
          GameDisplay.printError(guessResult.error);
          resolve(false); // Retry needed
          return;
        }

        // Process the attack on AI's board
        const attackResult = this.aiPlayer.receiveAttack(guessResult.location);
        
        // Update player's view of opponent board
        this.player.updateOpponentBoard(guessResult.location, attackResult.hit);
        
        // Display attack result
        GameDisplay.printAttackResult(
          'PLAYER',
          null, // Don't show location for player attacks
          attackResult.hit,
          attackResult.sunk
        );

        resolve(true);
      });
    });
  }

  /**
   * Handles the AI's turn
   */
  async handleAITurn() {
    const aiGuess = this.aiPlayer.makeGuess();
    
    GameDisplay.printAITurn();
    
    // Process the AI's attack on player's board
    const attackResult = this.player.receiveAttack(aiGuess);
    
    // Update AI's strategy based on the result
    this.aiPlayer.processGuessResult(aiGuess, attackResult.hit, attackResult.sunk);
    
    // Display attack result
    GameDisplay.printAttackResult(
      'CPU',
      aiGuess,
      attackResult.hit,
      attackResult.sunk
    );
  }

  /**
   * Checks if the game is over
   * @returns {boolean} - True if game is over
   */
  checkGameOver() {
    const playerLost = this.player.hasLost();
    const aiLost = this.aiPlayer.hasLost();

    if (playerLost || aiLost) {
      this.gameRunning = false;
      
      if (playerLost) {
        this.displayGameState();
        GameDisplay.printGameOver(this.aiPlayer.name, false);
      } else {
        this.displayGameState();
        GameDisplay.printGameOver(this.player.name, true);
      }
      
      return true;
    }

    return false;
  }

  /**
   * Ends the game and cleans up resources
   */
  endGame() {
    if (this.rl) {
      this.rl.close();
    }
    this.gameRunning = false;
  }

  /**
   * Utility method to add delays
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} - Promise that resolves after the delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Gets the current game state
   * @returns {Object} - Object containing current game state
   */
  getGameState() {
    return {
      gameRunning: this.gameRunning,
      player: this.player.getStats(),
      aiPlayer: this.aiPlayer.getStats(),
      winner: this.getWinner()
    };
  }

  /**
   * Gets the winner of the game
   * @returns {string|null} - Name of winner or null if game ongoing
   */
  getWinner() {
    if (this.player.hasLost()) {
      return this.aiPlayer.name;
    } else if (this.aiPlayer.hasLost()) {
      return this.player.name;
    }
    return null;
  }

  /**
   * Resets the game to initial state
   */
  reset() {
    if (this.rl) {
      this.rl.close();
    }
    
    this.player = new Player('Player');
    this.aiPlayer = new AIPlayer('Computer');
    this.gameRunning = false;
    this.rl = null;
  }

  /**
   * Gets game statistics for both players
   * @returns {Object} - Object containing game statistics
   */
  getGameStats() {
    return {
      player: this.player.getStats(),
      aiPlayer: this.aiPlayer.getStats(),
      gameState: this.getGameState()
    };
  }
} 