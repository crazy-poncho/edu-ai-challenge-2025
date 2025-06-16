# 🧠 Service Analyzer AI (Node.js CLI App)

This intelligent CLI tool uses OpenAI's GPT-4.1-mini to generate comprehensive markdown reports for any service or company. Simply provide a service name (like "Spotify" or "Uber") or a detailed service description, and get a structured analysis report covering history, target audience, features, business model, tech stack, and more.

## ✨ Features

- 🎯 **Smart Input Detection**: Automatically determines if your input is a service name or detailed description
- 📊 **Structured Reports**: Generates consistent markdown reports with 8 key sections
- 🚀 **AI-Powered**: Leverages OpenAI's latest GPT-4.1-mini model for accurate analysis
- 💻 **Simple CLI Interface**: Easy-to-use command line interface
- 📝 **Console Output**: Results printed directly to your terminal

## 🔧 Prerequisites

Before running this app, you'll need:

1. **Node.js** (version specified in `.nvmrc` file: 22.15.0)
2. **OpenAI API Key** (from OpenAI platform)

## 📦 Installation

### Step 1: Install Node.js (if you don't have it)

#### Option A: Using Node Version Manager (NVM) - Recommended
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc

# Navigate to the project directory first
cd path/to/service-analyzer-ai

# Install and use the Node.js version specified in .nvmrc
nvm install
nvm use
```

#### Option B: Direct Download
1. Visit [nodejs.org](https://nodejs.org/)
2. Download version 22.15.0 (as specified in `.nvmrc`)
3. Follow the installation instructions for your operating system

#### Option C: Using Package Managers
```bash
# macOS (using Homebrew)
brew install node@22

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows (using Chocolatey) - use exact version from .nvmrc
choco install nodejs --version=22.15.0
```

### Step 2: Clone and Setup the Project

```bash
# Navigate to the project directory
cd path/to/service-analyzer-ai

# Install dependencies
npm install
```

### Step 3: Configure Environment Variables

1. Create a `.env` file in the project root:
```bash
touch .env
```

2. Add your OpenAI API key to the `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

**📝 How to get an OpenAI API Key:**
1. Visit [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

## 🚀 Usage

### Running the Application

```bash
node index.js
```

### Interactive Usage

1. **Start the app** - Run the command above
2. **Enter your input** - Type either:
   - A service name (e.g., "Spotify", "Netflix", "Airbnb")
   - A detailed service description (e.g., "A music streaming service with personalized playlists")
3. **Wait for analysis** - The AI will process your input
4. **View results** - The markdown report will be displayed in your terminal

### Example Session

```
🔍 Welcome to Service Analyzer AI

Enter a service name or a raw service description:
> Spotify

🧠 Analyzing... Please wait...

## Brief History
Founded in 2006 in Sweden, Spotify launched publicly in 2008 and revolutionized music streaming...

## Target Audience
Music listeners globally, especially millennials and Gen Z...

[Complete structured report continues...]

✅ Report printed to console
```

## 📊 Report Structure

Each generated report includes these sections:

- **Brief History** - Company background and founding story
- **Target Audience** - Primary user demographics and segments
- **Core Features** - Main product/service capabilities
- **Unique Selling Points** - What sets the service apart
- **Business Model** - Revenue streams and monetization strategy
- **Tech Stack Insights** - Technologies likely used
- **Perceived Strengths** - Competitive advantages
- **Perceived Weaknesses** - Challenges and limitations

## 🔍 Examples

### Input Types That Work Well:

**Service Names:**
- "Uber"
- "Amazon Prime"
- "TikTok"
- "Slack"

**Service Descriptions:**
- "A cloud storage service for teams"
- "Social media platform for professionals"
- "Food delivery app with real-time tracking"

## 🛠️ Troubleshooting

### Common Issues

**❌ "OpenAI API Key not found"**
- Ensure your `.env` file exists and contains `OPENAI_API_KEY=your_key`
- Verify the API key is valid and has sufficient credits

**❌ "Module not found"**
- Run `npm install` to install dependencies
- Ensure you're in the correct project directory

**❌ "Node.js version issues"**
- Check your Node.js version: `node --version`
- Install Node.js 22.15.0 (as specified in `.nvmrc`)
- If using NVM: `nvm use` to switch to the correct version

**❌ "Network/API errors"**
- Check your internet connection
- Verify your OpenAI API key has available credits
- Try again after a few moments

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify dependencies are installed
npm list --depth=0
```

## 📁 Project Structure

```
service-analyzer-ai/
├── index.js           # Main application entry point
├── prompt.js          # OpenAI integration and prompts
├── utils.js           # Utility functions
├── package.json       # Dependencies and metadata
├── .nvmrc            # Node.js version specification
├── .env              # Environment variables (create this)
├── sample_outputs.md # Example generated reports
└── README.md         # This file
```

## 🔒 Security Notes

- Never commit your `.env` file or API keys to version control
- Keep your OpenAI API key secure and don't share it
- Monitor your OpenAI usage and costs

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Ensure your OpenAI API key is valid and has credits

## 📄 License

ISC License - Feel free to use and modify as needed.

---

**Ready to analyze services?** Run `node index.js` and start exploring! 🚀

