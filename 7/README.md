## How to run

### Prerequisites

This game requires **Node.js v22.15.0** (as specified in `.nvmrc`).

#### If you don't have Node.js installed:

**Option 1: Download from Official Website**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download Node.js v22.15.0 or the latest LTS version
3. Follow the installation instructions for your operating system

**Option 2: Using Package Managers**

**macOS (using Homebrew):**
```bash
brew install node@22
```

**Windows (using Chocolatey):**
```bash
choco install nodejs --version=22.15.0
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Option 3: Using NVM (Node Version Manager) - Recommended**

**Install NVM:**
```bash
# macOS/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Restart your terminal or run: source ~/.bashrc

# Windows - use nvm-windows
# Download from: https://github.com/coreybutler/nvm-windows
```

**Use the exact version from .nvmrc:**
```bash
nvm install 22.15.0
nvm use 22.15.0
# Or simply use: nvm use (will read from .nvmrc)
```

### Running the Game

1. **Clone or download the project**
2. **Navigate to the project directory:**
   ```bash
   cd path/to/sea-battle-game
   ```

3. **Verify Node.js version (optional but recommended):**
   ```bash
   node --version
   # Should show v22.15.0 or compatible version
   ```

4. **Start the game:**
   ```bash
   npm start
   ```

5. **Run tests (optional):**
   ```bash
   npm test
   
   # Or run tests in watch mode
   npm run test:watch
   ```

