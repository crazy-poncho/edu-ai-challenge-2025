# Sea Battle Game - Modernized

A modernized and refactored version of the classic Sea Battle (Battleship) game, faithfully recreating the original gameplay while using modern ES6+ JavaScript standards with comprehensive testing.

## 🚀 Features

- **Modern JavaScript (ES6+)**: Uses classes, modules, arrow functions, async/await, and other modern features
- **Modular Architecture**: Clean separation of concerns with dedicated classes for different responsibilities
- **Faithful Gameplay**: Maintains exact original game behavior and mechanics
- **Intelligent AI Opponent**: Implements hunt and target modes for strategic gameplay
- **Comprehensive Testing**: 60%+ test coverage with Node.js built-in test runner
- **Zero Dependencies**: No external testing frameworks required
- **Type-Safe**: Clear interfaces and JSDoc documentation
- **Error Handling**: Robust input validation and error management

## 🏗️ Architecture

The game follows a modular architecture with clear separation of concerns:

```
src/
├── Ship.js          # Ship entity with hit detection logic
├── Board.js         # Game board management and ship placement
├── Player.js        # Human player logic and input validation
├── AIPlayer.js      # AI opponent with strategic behavior
├── GameDisplay.js   # Console output and formatting
├── Game.js          # Main game controller and flow management
└── index.js         # Entry point and application bootstrap
```

### Key Classes

- **Ship**: Encapsulates ship behavior, hit detection, and status tracking
- **Board**: Manages the 10x10 game grid, ship placement, and attack processing
- **Player**: Handles human player interactions and input validation
- **AIPlayer**: Implements intelligent AI with hunt/target strategy modes
- **GameDisplay**: Manages console output and display formatting
- **Game**: Main controller coordinating game flow and turn management

## 🎮 How to Play

### Installation

```bash
# No dependencies to install for core functionality!

# Run the game
npm start

# Run tests (requires Node.js 18+ for built-in test runner)
npm test

# Run tests in watch mode
npm run test:watch
```

### Requirements

- **Node.js 18+** (for built-in test runner support)
- No external dependencies required for the game itself

### Game Rules

1. **Board Setup**: 10x10 grid with 3 ships of length 3 each
2. **Input Format**: Enter coordinates as two digits (e.g., "00", "34", "98")
3. **Objective**: Sink all enemy ships before they sink yours
4. **AI Behavior**: 
   - **Hunt Mode**: Random targeting to find ships
   - **Target Mode**: Systematic targeting of adjacent cells after hits

### Game Symbols

- `~` = Water
- `S` = Your ship
- `X` = Hit
- `O` = Miss

## 🧪 Testing

The project includes comprehensive unit tests using Node.js built-in test runner:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The test suite covers:

- **Ship Logic**: Hit detection, sinking logic, status tracking
- **Board Management**: Ship placement, attack processing, boundary validation
- **Player Interactions**: Input validation, guess formatting, attack handling
- **AI Strategy**: Hunt/target modes, adjacent targeting, strategy switching
- **Game Flow**: Turn management, win conditions, state management
- **Integration**: End-to-end gameplay scenarios

**Target coverage: 60%+ across all core modules**

### Testing Approach

- Uses **Node.js built-in test runner** (no external dependencies)
- Native `assert` module for assertions
- Comprehensive test suites for each class
- Integration tests for game flow
- Error handling and edge case coverage

## 🔧 Development

### Code Style

- ES6+ modules with import/export
- Class-based architecture
- Async/await for asynchronous operations
- JSDoc documentation for all public methods
- Consistent error handling patterns
- Faithful recreation of original game behavior

### Error Handling

- Input validation with descriptive error messages
- Graceful handling of edge cases
- Proper resource cleanup
- Comprehensive error boundaries

### Dependencies

- **Runtime**: Zero dependencies
- **Testing**: Uses Node.js built-in test runner (Node.js 18+)
- **No external packages** required for core functionality

## 📊 Modernization Changes

### From Original Code

1. **Code Structure**:
   - Converted from ES5 to ES6+ syntax
   - Eliminated global variables
   - Implemented proper module system
   - Added async/await patterns

2. **Architecture**:
   - Created clear class hierarchy
   - Separated concerns into logical modules
   - Implemented proper encapsulation
   - Added comprehensive error handling

3. **Code Quality**:
   - Added comprehensive test suite using Node.js built-in runner
   - Implemented consistent naming conventions
   - Added JSDoc documentation
   - Improved code readability and maintainability
   - Zero external dependencies

4. **Gameplay Preservation**:
   - Maintained exact original game mechanics
   - Preserved AI hunt/target behavior
   - Kept original input/output patterns
   - Ensured faithful user experience

## 🚀 Game Mechanics

### AI Strategy

The AI opponent implements two distinct modes exactly as in the original:

1. **Hunt Mode**: 
   - Random coordinate selection
   - Used when no active targets exist
   - Efficient coverage of the board

2. **Target Mode**:
   - Activated after hitting a ship
   - Systematically targets adjacent cells
   - Returns to hunt mode after sinking ship

### Ship Placement

- Ships are placed randomly at game start
- Collision detection prevents overlapping
- Both horizontal and vertical orientations
- Boundary validation ensures ships fit within grid

### Turn Management

- Turn-based gameplay matching original
- Input validation before processing
- Clear feedback for all actions
- Graceful error recovery

## 🔮 Core Requirements Met

✅ **10x10 grid**  
✅ **Turn-based coordinate input (e.g., 00, 34)**  
✅ **Standard Battleship hit/miss/sunk logic**  
✅ **CPU opponent's 'hunt' and 'target' modes**  
✅ **Modern ES6+ JavaScript**  
✅ **60%+ test coverage with Node.js built-in test runner**  
✅ **Modular architecture**  
✅ **Faithful gameplay recreation**  
✅ **Zero external dependencies**  
