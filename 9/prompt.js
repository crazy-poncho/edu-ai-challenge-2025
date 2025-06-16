const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const exampleFewShot = `
Service Description: "Spotify"
---
Brief History:
Founded in 2006 in Sweden, Spotify launched publicly in 2008 and revolutionized music streaming. Went public in 2018 via a direct listing on the NYSE.

Target Audience:
Music listeners globally, especially millennials and Gen Z.

Core Features:
- Unlimited music streaming
- Personalized playlists
- Podcast hosting
- Offline mode

Unique Selling Points:
- Industry-leading recommendation engine
- Freemium model
- Early podcast adoption

Business Model:
Freemium (ads) + Premium subscriptions.

Tech Stack Insights:
Uses Python, Java, Docker, Google Cloud, Kafka.

Perceived Strengths:
High personalization, large library, seamless UX.

Perceived Weaknesses:
Limited high-fidelity audio, royalties controversy.
---
`;

const SYSTEM_PROMPT = `You are a professional AI assistant who generates structured analysis reports from vague or known service names. Each report must be in markdown and include the following sections:
- Brief History
- Target Audience
- Core Features
- Unique Selling Points
- Business Model
- Tech Stack Insights
- Perceived Strengths
- Perceived Weaknesses`;

async function analyzeService(userInput, isServiceName) {
  const prompt = `${SYSTEM_PROMPT}\n\n${exampleFewShot}\n\nService Description: "${userInput}"\n---`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });

  return chat.choices[0].message.content;
}

module.exports = { analyzeService };
