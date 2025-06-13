# TypeGuard Validation Library - Setup Guide

## Prerequisites

This library requires Node.js version specified in the `.nvmrc` file (currently 22.15.0) or higher.

## Installation & Setup

### Option 1: If you already have Node.js installed

1. Check the required Node.js version:
   ```bash
   cat .nvmrc
   ```

2. Check your current Node.js version:
   ```bash
   node --version
   ```

3. If you have Node.js version matching or higher than specified in `.nvmrc`, you can run the library directly:
   ```bash
   node schema.js
   ```

4. To run the tests:
   ```bash
   node schema.test.js
   ```

### Option 2: If you don't have Node.js installed

#### For macOS users:

1. **Install Node.js using Homebrew** (recommended):
   ```bash
   # Install Homebrew if you don't have it
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Check required version
   REQUIRED_VERSION=$(cat .nvmrc)
   
   # Install Node.js (use the major version from .nvmrc)
   brew install node@$(cat .nvmrc | cut -d. -f1)
   ```

2. **Alternative: Download from official website**:
   - Check required version: `cat .nvmrc`
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the version matching your `.nvmrc` file
   - Run the installer

#### For Windows users:

1. **Using Chocolatey** (recommended):
   ```powershell
   # Install Chocolatey if you don't have it
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   
   # Check required version
   $REQUIRED_VERSION = Get-Content .nvmrc
   
   # Install Node.js with the version from .nvmrc
   choco install nodejs --version=$REQUIRED_VERSION
   ```

2. **Alternative: Download from official website**:
   - Check required version: `type .nvmrc` (Command Prompt) or `Get-Content .nvmrc` (PowerShell)
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the Windows installer for the version in your `.nvmrc` file
   - Run the installer

#### For Linux users:

1. **Using NodeSource repository**:
   ```bash
   # Check required version
   REQUIRED_VERSION=$(cat .nvmrc)
   MAJOR_VERSION=$(cat .nvmrc | cut -d. -f1)
   
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_${MAJOR_VERSION}.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # CentOS/RHEL/Fedora
   curl -fsSL https://rpm.nodesource.com/setup_${MAJOR_VERSION}.x | sudo bash -
   sudo yum install -y nodejs
   ```

2. **Using package manager** (may not have exact version):
   ```bash
   # Check required version first
   cat .nvmrc
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nodejs npm
   
   # CentOS/RHEL
   sudo yum install nodejs npm
   
   # Arch Linux
   sudo pacman -S nodejs npm
   
   # Verify installed version matches requirement
   node --version
   ```

#### Using Node Version Manager (nvm) - All platforms (Recommended):

1. **Install nvm**:
   ```bash
   # macOS/Linux
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Windows (use nvm-windows)
   # Download from: https://github.com/coreybutler/nvm-windows/releases
   ```

2. **Install and use the correct Node.js version from .nvmrc**:
   ```bash
   # Restart your terminal or run:
   source ~/.bashrc
   
   # Install the version specified in .nvmrc
   nvm install
   nvm use
   
   # Or explicitly:
   # nvm install $(cat .nvmrc)
   # nvm use $(cat .nvmrc)
   
   # Verify installation
   node --version
   ```

## Running the Application

```bash
# Navigate to the project directory
cd 8

# Run the main library file
node schema.js

# Run the test suite
node schema.test.js

# Generate test report file
node --test --experimental-test-coverage --test-coverage-include=schema.js > test_report.txt
```
