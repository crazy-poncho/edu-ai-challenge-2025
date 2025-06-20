require("dotenv").config();
const fs = require("fs");
const path = require("path");
const readline = require("readline-sync");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeAudio(filePath) {
  const audio = fs.createReadStream(filePath);

  const transcript = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file: audio,
    response_format: "text",
  });

  return transcript;
}

async function summarizeText(text) {
  const prompt = `Summarize the following transcript in a clear and concise manner:\n\n"${text}"`;

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content.trim();
}

async function analyzeText(text) {
  const prompt = `Analyze the following transcript and return a JSON object with:
1. total word count,
2. estimated speaking speed (words per minute),
3. top 3+ most frequently mentioned topics and their counts.
Respond in the following JSON format:
{
  "word_count": NUMBER,
  "speaking_speed_wpm": NUMBER,
  "frequently_mentioned_topics": [
    { "topic": "TOPIC", "mentions": NUMBER }
  ]
}\n\nTranscript:\n${text}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const jsonMatch = res.choices[0].message.content.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
}

function saveToFile(filename, content) {
  fs.writeFileSync(path.join("outputs", filename), content, "utf-8");
  console.log(`✅ Saved ${filename}`);
}

async function main() {
  console.log("🎙️  Welcome to the Whisper-GPT Transcriber");

  const file = readline.question("Enter path to audio file: ").trim();

  if (!fs.existsSync(file)) {
    console.error("❌ File does not exist.");
    return;
  }

  if (!fs.existsSync("outputs")) fs.mkdirSync("outputs");

  console.log("📤 Transcribing audio...");
  const transcript = await transcribeAudio(file);
  const timestamp = Date.now();

  const transcriptionFilename = `transcription_${timestamp}.md`;
  const summaryFilename = `summary_${timestamp}.md`;
  const analysisFilename = `analysis_${timestamp}.json`;

  saveToFile(transcriptionFilename, transcript);

  console.log("🧠 Summarizing...");
  const summary = await summarizeText(transcript);
  saveToFile(summaryFilename, summary);

  console.log("📊 Analyzing...");
  const analysis = await analyzeText(transcript);
  saveToFile(analysisFilename, JSON.stringify(analysis, null, 2));

  console.log("✅ All done! Files are in the 'outputs' folder.");
}

main();
