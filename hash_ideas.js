// Simple Node script to compute SHA-256 hashes for idea texts.
// Usage:
// 1) Put each idea's full text into a separate file under ideas_texts/ (e.g. ideas_texts/musicmates.txt)
// 2) Run: node hash_ideas.js
// 3) The script prints the hex hashes you can paste into ideas_hashes.md
//
// Note: This script is local-only and does not touch the network.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const textsDir = path.join(__dirname, 'ideas_texts');

if (!fs.existsSync(textsDir)) {
  console.error('Create an ideas_texts/ directory and add plain .txt files, one per idea (e.g. musicmates.txt).');
  process.exit(1);
}

const files = fs.readdirSync(textsDir).filter(f => f.endsWith('.txt'));

if (files.length === 0) {
  console.error('No .txt files found in ideas_texts/. Add your idea text files and run again.');
  process.exit(1);
}

console.log('Found files:', files.join(', '));
console.log('Computing SHA-256 hashes...\n');

files.forEach(file => {
  const full = fs.readFileSync(path.join(textsDir, file), 'utf8');
  // Normalize line endings and trim trailing whitespace to ensure the hash is deterministic:
  const normalized = full.replace(/\r\n/g, '\n').trim();
  const hash = crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
  console.log(`- ${file.replace('.txt','')} | sha256: ${hash}`);
});
