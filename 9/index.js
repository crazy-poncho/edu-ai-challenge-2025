require('dotenv').config();
const readline = require('readline');
const { analyzeService } = require('./prompt');
const { isProbablyServiceName } = require('./utils');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔍 Welcome to Service Analyzer AI\n');

rl.question('Enter a service name or a raw service description:\n> ', async (input) => {
  const isServiceName = isProbablyServiceName(input);

  console.log('\n🧠 Analyzing... Please wait...\n');

  try {
    const markdownReport = await analyzeService(input, isServiceName);

    // Print to console
    console.log(markdownReport);
    console.log('\n✅ Report printed to console');
  } catch (err) {
    console.error('❌ Error generating report:', err.message);
  }

  rl.close();
});
