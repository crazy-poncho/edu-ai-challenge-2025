# AI-Powered Product Filter

An intelligent product filtering application that uses OpenAI GPT-4 to understand natural language queries and filter products based on user preferences.

## Features

- Natural language product search (e.g., "I want fitness items under $30 with good ratings")
- AI-powered query understanding using OpenAI GPT-4
- Interactive command-line interface
- Intelligent product filtering based on price, rating, category, and stock status

## Prerequisites

- **Node.js**: This application requires Node.js version **22.15.0** (as specified in `.nvmrc`)
- **OpenAI API Key**: You'll need a valid OpenAI API key to use this application

## Setup Instructions

### 1. Install Node.js

Make sure you have Node.js version 22.15.0 installed. You can use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to manage Node.js versions:

```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc

# Install and use the required Node.js version
nvm install 22.15.0
nvm use 22.15.0
```

Alternatively, if you already have nvm installed and there's a `.nvmrc` file in the project:

```bash
nvm use
```

### 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root directory:

```bash
touch .env
```

Add your OpenAI API key to the `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**To get an OpenAI API key:**
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

**Important:** Never commit your `.env` file to version control. Make sure it's listed in your `.gitignore` file.

## Running the Application

Once you've completed the setup, you can run the application:

```bash
node main.js
```

The application will start and prompt you with:
```
What are you looking for?
```

## Usage Examples

Here are some example queries you can try:

### Example 1: Fitness Equipment
```
What are you looking for? I want a fitness item under $30 with at least 4-star rating
```

**Expected Output:**
```
Filtered Products:

1. Resistance Bands - $14.99, Rating: 4.1, In Stock
2. Foam Roller - $24.99, Rating: 4.5, In Stock
3. Jump Rope - $9.99, Rating: 4, In Stock
4. Ab Roller - $19.99, Rating: 4.2, In Stock
```

### Example 2: Electronics
```
What are you looking for? Show me electronics under $150 that are in stock
```

**Expected Output:**
```
Filtered Products:

1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Bluetooth Speaker - $49.99, Rating: 4.4, In Stock
3. Gaming Mouse - $59.99, Rating: 4.3, In Stock
4. External Hard Drive - $89.99, Rating: 4.4, In Stock
5. Portable Charger - $29.99, Rating: 4.2, In Stock
```

## How It Works

1. **User Input**: The application prompts you to describe what you're looking for in natural language
2. **AI Processing**: Your query is sent to OpenAI GPT-4, which understands the intent and extracts filtering criteria
3. **Product Filtering**: The AI applies the extracted filters to the product database
4. **Results Display**: Matching products are displayed with their details (name, price, rating, stock status)

## Dependencies

- **dotenv** (^16.5.0): Environment variable management
- **openai** (^5.5.1): OpenAI API client
- **readline-sync** (^1.4.10): Synchronous user input handling

## Project Structure

```
├── main.js           # Main application entry point
├── openai.js         # OpenAI client configuration
├── products.js       # Product database
├── functions.js      # Function definitions for OpenAI
├── package.json      # Project dependencies and metadata
├── .nvmrc           # Node.js version specification
├── .env             # Environment variables (create this)
└── README.md        # This file
```

## Troubleshooting

### Common Issues

1. **Node.js Version Error**
   - Make sure you're using Node.js version 22.15.0
   - Use `node --version` to check your current version
   - Use `nvm use 22.15.0` to switch to the correct version

2. **OpenAI API Key Issues**
   - Verify your API key is correct in the `.env` file
   - Ensure you have sufficient credits in your OpenAI account
   - Check that your API key has the necessary permissions

3. **Module Not Found Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that you're in the correct project directory

4. **Permission Errors**
   - On macOS/Linux, you might need to run: `chmod +x main.js`

### Getting Help

If you encounter issues:
1. Check the error message carefully
2. Verify all setup steps were completed
3. Ensure your OpenAI API key is valid and has sufficient credits
4. Make sure you're using the correct Node.js version

## License

ISC License
