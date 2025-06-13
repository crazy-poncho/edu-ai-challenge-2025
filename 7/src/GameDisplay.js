import { Board } from './Board.js';

/**
 * Handles all display and console output for the Sea Battle game
 */
export class GameDisplay {
  /**
   * Prints both player and opponent boards side by side
   * @param {Array<Array<string>>} opponentBoard - The opponent's board view
   * @param {Array<Array<string>>} playerBoard - The player's board
   */
  static printBoards(opponentBoard, playerBoard) {
    console.log('\n   OPPONENT BOARD              YOUR BOARD');
    
    // Print column headers
    let header = '  ';
    for (let h = 0; h < Board.BOARD_SIZE; h++) {
      header += h + ' ';
    }
    console.log(header + '     ' + header);

    // Print each row
    for (let i = 0; i < Board.BOARD_SIZE; i++) {
      let rowStr = i + ' ';

      // Opponent board row
      for (let j = 0; j < Board.BOARD_SIZE; j++) {
        rowStr += opponentBoard[i][j] + ' ';
      }
      
      rowStr += '    ' + i + ' ';

      // Player board row
      for (let j = 0; j < Board.BOARD_SIZE; j++) {
        rowStr += playerBoard[i][j] + ' ';
      }
      
      console.log(rowStr);
    }
    console.log('');
  }

  /**
   * Prints a single board with title
   * @param {Array<Array<string>>} board - The board to display
   * @param {string} title - Title for the board
   */
  static printSingleBoard(board, title = 'Board') {
    console.log(`\n${title}:`);
    
    // Print column headers
    let header = '  ';
    for (let h = 0; h < Board.BOARD_SIZE; h++) {
      header += h + ' ';
    }
    console.log(header);

    // Print each row
    for (let i = 0; i < Board.BOARD_SIZE; i++) {
      let rowStr = i + ' ';
      for (let j = 0; j < Board.BOARD_SIZE; j++) {
        rowStr += board[i][j] + ' ';
      }
      console.log(rowStr);
    }
    console.log('');
  }

  /**
   * Prints the game welcome message
   */
  static printWelcome() {
    console.log('\nWelcome to Battleship!');
    console.log('Try to sink the computer\'s battleships before it sinks all of yours.');
    console.log('Enter coordinates as two digits (e.g., 00, 34, 98)');
    console.log('~ = water, S = ship, X = hit, O = miss\n');
  }

  /**
   * Prints game setup messages
   */
  static printSetupComplete() {
    console.log('Ships placed. Let\'s play!\n');
  }

  /**
   * Prints AI turn messages
   */
  static printAITurn() {
    console.log('\n--- CPU\'s Turn ---');
  }

  /**
   * Prints attack result messages
   * @param {string} attacker - Name of the attacker ("PLAYER" or "CPU")
   * @param {string} location - Location of the attack
   * @param {boolean} hit - Whether the attack was a hit
   * @param {boolean} sunk - Whether a ship was sunk
   */
  static printAttackResult(attacker, location, hit, sunk = false) {
    if (hit) {
      console.log(`${attacker} HIT${location ? ` at ${location}` : ''}.`);
      if (sunk) {
        console.log(`${attacker} sunk a battleship!`);
      }
    } else {
      console.log(`${attacker} MISS${location ? ` at ${location}` : ''}.`);
    }
  }

  /**
   * Prints error messages
   * @param {string} message - Error message to display
   */
  static printError(message) {
    console.log(`Error: ${message}`);
  }

  /**
   * Prints game over message
   * @param {string} winner - Name of the winner
   * @param {boolean} playerWon - Whether the human player won
   */
  static printGameOver(winner, playerWon = false) {
    console.log('\nGame Over!');
    if (playerWon) {
      console.log(`${winner} wins! You sunk all the computer's battleships!`);
    } else {
      console.log(`${winner} wins! All your battleships have been sunk!`);
    }
  }

  /**
   * Prints current game statistics
   * @param {Object} playerStats - Player statistics
   * @param {Object} aiStats - AI statistics
   */
  static printGameStats(playerStats, aiStats) {
    console.log(`\nPlayer ships remaining: ${playerStats.remainingShips}`);
    console.log(`Computer ships remaining: ${aiStats.remainingShips}`);
  }

  /**
   * Prints a prompt for user input
   * @param {string} message - Prompt message
   */
  static printPrompt(message = 'Enter your guess (e.g., 00): ') {
    return message;
  }
} 