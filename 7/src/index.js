import { Game } from './Game.js';

/**
 * Main entry point for the Sea Battle game
 */
async function main() {
  try {
    const game = new Game();
    await game.init();
    await game.start();
    
    console.log('\nThanks for playing!');
    process.exit(0);
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nGame interrupted. Thanks for playing!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nGame terminated. Thanks for playing!');
  process.exit(0);
});

// Start the game
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 