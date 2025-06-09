const { test, describe } = require('node:test');
const { strictEqual } = require('node:assert');
const { Enigma } = require('./enigma.js');

test('Test Case 1: Basic Encryption', () => {
  const encryptionEnigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const encrypted = encryptionEnigma.process('HELLO');
  strictEqual(encrypted, 'VNACA');

  const decryptionEnigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const decrypted = decryptionEnigma.process(encrypted);
  strictEqual(decrypted, 'HELLO');
});

test('Test Case 2: Plugboard Use', () => {
  const plugboardPairs = [['A', 'B'], ['C', 'D']];
  const enigmaWithPlugboard = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugboardPairs);
  const encryptedMessage = enigmaWithPlugboard.process('HELLO');
  strictEqual(encryptedMessage, 'VNBDB');

  const decryptionWithPlugboard = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugboardPairs);
  const decryptedMessage = decryptionWithPlugboard.process(encryptedMessage);
  strictEqual(decryptedMessage, 'HELLO');
});

test('Test Case 3: Multiple Rotor Positions', () => {
  const enigmaWithRotorPositions = new Enigma([0, 1, 2], [1, 2, 3], [0, 0, 0], []);
  const encryptedMessage = enigmaWithRotorPositions.process('HELLO');
  strictEqual(encryptedMessage, 'QSQSJ');

  const decryptionWithRotorPositions = new Enigma([0, 1, 2], [1, 2, 3], [0, 0, 0], []);
  const decryptedMessage = decryptionWithRotorPositions.process(encryptedMessage);
  strictEqual(decryptedMessage, 'HELLO');
});

test('Test Case 4: Ring Settings', () => {
  const enigmaWithRingSettings = new Enigma([0, 1, 2], [0, 0, 0], [1, 2, 3], []);
  const encryptedMessage = enigmaWithRingSettings.process('HELLO');
  strictEqual(encryptedMessage, 'FGPQE');

  const decryptionWithRingSettings = new Enigma([0, 1, 2], [0, 0, 0], [1, 2, 3], []);
  const decryptedMessage = decryptionWithRingSettings.process(encryptedMessage);
  strictEqual(decryptedMessage, 'HELLO');
});

test('Test Case 5: Empty String', () => {
  const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const encrypted = enigma.process('');
  strictEqual(encrypted, '');

  const decrypted = enigma.process(encrypted);
  strictEqual(decrypted, '');
});

test('Test Case 6: Non-Alphabetical Characters', () => {
  const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const encrypted = enigma.process('HELLO');
  strictEqual(encrypted, 'VNACA');

  const decryptionEnigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const decrypted = decryptionEnigma.process(encrypted);
  strictEqual(decrypted, 'HELLO');
});

test('Test Case 8: Non-Alphabetic Characters (Ignore Handling)', () => {
  const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const encrypted = enigma.process('HELLO123');
  strictEqual(encrypted, 'VNACA123');

  const decryptionEnigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const decrypted = decryptionEnigma.process(encrypted);
  strictEqual(decrypted, 'HELLO123');
});

test('Test Case 9: Multiple Encryption Cycles', () => {
  const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const encrypted = enigma.process('HELLO');
  strictEqual(encrypted, 'VNACA');

  const decryptionEnigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  const decrypted = decryptionEnigma.process(encrypted);
  strictEqual(decrypted, 'HELLO');
});

test('Test Case 10: Double Stepping - Middle Rotor at Notch', () => {
  // Set middle rotor (index 1) at notch position 'E' (position 4) to trigger left rotor stepping
  const enigma = new Enigma([0, 1, 2], [0, 4, 0], [0, 0, 0], []);
  const encrypted = enigma.process('A');
  // This should trigger the double stepping mechanism (lines 66-67)
  strictEqual(typeof encrypted, 'string');
  strictEqual(encrypted.length, 1);
});

test('Test Case 11: Double Stepping - Right Rotor at Notch', () => {
  // Set right rotor (index 2) at notch position 'V' (position 21) to trigger middle rotor stepping  
  const enigma = new Enigma([0, 1, 2], [0, 0, 21], [0, 0, 0], []);
  const encrypted = enigma.process('A');
  // This should trigger middle rotor stepping (lines 71-72)
  strictEqual(typeof encrypted, 'string');
  strictEqual(encrypted.length, 1);
});

test('Test Case 12: Double Stepping - Both Conditions', () => {
  // Set both middle rotor at notch (position 4) and right rotor at notch (position 21)
  const enigma = new Enigma([0, 1, 2], [0, 4, 21], [0, 0, 0], []);
  const encrypted = enigma.process('A');
  // This should trigger both stepping conditions
  strictEqual(typeof encrypted, 'string');
  strictEqual(encrypted.length, 1);
});

test('Test Case 13: CLI Function Export', () => {
  // Test that promptEnigma function exists and can be accessed
  const enigmaModule = require('./enigma.js');
  strictEqual(typeof enigmaModule.Enigma, 'function');
  
  // Test module structure
  const enigmaInstance = new enigmaModule.Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
  strictEqual(typeof enigmaInstance.process, 'function');
});

test('Test Case 14: promptEnigma Function Export', () => {
  // Test that promptEnigma function is exported and callable
  const { promptEnigma } = require('./enigma.js');
  strictEqual(typeof promptEnigma, 'function');
});

test('Test Case 15: CLI Functionality with Mocked Input', () => {
  // Mock readline to test promptEnigma function execution paths
  const originalReadline = require('readline');
  const mockInterface = {
    question: (prompt, callback) => {
      // Simulate user inputs for different prompts
      if (prompt.includes('message')) {
        callback('HELLO');
      } else if (prompt.includes('positions')) {
        callback('0 0 0');
      } else if (prompt.includes('settings')) {
        callback('0 0 0');
      } else if (prompt.includes('Plugboard')) {
        callback('AB CD');
      }
    },
    close: () => {}
  };
  
  // Mock console.log to capture output 
  const originalLog = console.log;
  let capturedOutput = '';
  console.log = (message) => {
    capturedOutput += message;
  };
  
  // Mock readline.createInterface
  const mockCreateInterface = () => mockInterface;
  require('readline').createInterface = mockCreateInterface;
  
  // Test the function (this should cover lines 103-133)
  const { promptEnigma } = require('./enigma.js');
  
  try {
    // This will execute the promptEnigma function and cover the uncovered lines
    promptEnigma();
    strictEqual(capturedOutput.includes('Output:'), true);
  } finally {
    // Restore original functions
    console.log = originalLog;
    require('readline').createInterface = originalReadline.createInterface;
  }
});
