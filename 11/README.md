# Whisper-GPT Transcriber

An intelligent audio transcription application that uses OpenAI's Whisper API to transcribe audio files and GPT-4 to provide summaries and analysis of the transcriptions.

## Features

- 🎙️ **Audio Transcription**: Convert audio files to text using OpenAI's Whisper-1 model
- 📝 **Smart Summarization**: Generate concise summaries of transcribed content using GPT-4
- 📊 **Content Analysis**: Analyze transcriptions for word count, speaking speed, and frequently mentioned topics
- 💾 **Organized Output**: Save all results in timestamped files in the `outputs` directory

## Prerequisites

### Node.js Version
This application requires **Node.js version 22.15.0** as specified in the `.nvmrc` file.

#### Using NVM (Node Version Manager)
If you have NVM installed, you can automatically use the correct Node.js version:

```bash
# Install and use the required Node.js version
nvm install 22.15.0
nvm use 22.15.0
```

#### Manual Installation
If you don't have NVM, download and install Node.js 22.15.0 from the [official Node.js website](https://nodejs.org/).

### OpenAI API Key
You'll need an OpenAI API key with access to:
- Whisper API (for transcription)
- GPT-4 API (for summarization and analysis)

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd 11
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

1. **Start the application**:
   ```bash
   node transctibe.js
   ```

2. **Follow the prompts**:
   - The application will ask you to enter the path to your audio file
   - You can use absolute paths or relative paths from the current directory
   - Example: `CAR0004.mp3` (if the file is in the same directory)

3. **Wait for processing**:
   - The application will transcribe your audio file
   - Generate a summary of the transcription
   - Perform content analysis
   - Save all results to the `outputs` folder

## Supported Audio Formats

The application supports various audio formats that are compatible with OpenAI's Whisper API, including:
- MP3
- WAV
- M4A
- FLAC
- And other common audio formats

## Output Files

The application generates three types of output files in the `outputs` directory:

### 1. Transcription (`transcription_[timestamp].md`)
- Raw text transcription of the audio file
- Generated using OpenAI's Whisper-1 model

### 2. Summary (`summary_[timestamp].md`)
- Concise summary of the transcribed content
- Generated using GPT-4 for clarity and brevity

### 3. Analysis (`analysis_[timestamp].json`)
- JSON file containing:
  - `word_count`: Total number of words in the transcription
  - `speaking_speed_wpm`: Estimated speaking speed in words per minute
  - `frequently_mentioned_topics`: Array of topics and their mention counts

#### Example Analysis Output:
```json
{
  "word_count": 450,
  "speaking_speed_wpm": 150,
  "frequently_mentioned_topics": [
    { "topic": "technology", "mentions": 12 },
    { "topic": "innovation", "mentions": 8 },
    { "topic": "development", "mentions": 6 }
  ]
}
```

## Dependencies

- **axios**: ^1.10.0 - HTTP client for API requests
- **dotenv**: ^16.5.0 - Environment variable management
- **fs**: ^0.0.1-security - File system operations
- **openai**: ^5.5.1 - OpenAI API client
- **path**: ^0.12.7 - File path utilities
- **readline-sync**: ^1.4.10 - Interactive command line input

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## Error Handling

The application includes basic error handling for:
- Invalid file paths
- Missing audio files
- API request failures

## Example Usage

```bash
$ node transctibe.js
🎙️  Welcome to the Whisper-GPT Transcriber
Enter path to audio file: CAR0004.mp3
📤 Transcribing audio...
✅ Saved transcription_1703123456789.md
🧠 Summarizing...
✅ Saved summary_1703123456789.md
📊 Analyzing...
✅ Saved analysis_1703123456789.json
✅ All done! Files are in the 'outputs' folder.
```

## Troubleshooting

### Common Issues

1. **"File does not exist" error**:
   - Verify the file path is correct
   - Ensure the audio file exists in the specified location

2. **OpenAI API errors**:
   - Check that your API key is valid and has sufficient credits
   - Ensure your API key has access to Whisper and GPT-4 models

3. **Node.js version issues**:
   - Verify you're using Node.js 22.15.0: `node --version`
   - Use `nvm use 22.15.0` if you have NVM installed

### Support

If you encounter issues:
1. Check that all dependencies are installed: `npm list`
2. Verify your `.env` file contains the correct API key
3. Ensure your audio file is in a supported format
4. Check the console output for specific error messages

## License

ISC License
