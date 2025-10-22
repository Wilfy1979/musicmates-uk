#!/usr/bin/env node

/**
 * hash_ideas.js - SHA-256 Hash Calculator for Ideas
 * 
 * This script computes the SHA-256 hash of a file or text input.
 * Use it to create cryptographic fingerprints of your creative ideas
 * for the ideas hash registry.
 * 
 * USAGE:
 * 
 *   # Hash a file:
 *   node hash_ideas.js your-idea.txt
 * 
 *   # Hash text from stdin:
 *   echo -n "Your idea text" | node hash_ideas.js
 * 
 *   # Interactive mode (paste text, then Ctrl+D):
 *   node hash_ideas.js
 * 
 * OUTPUT:
 *   Prints the SHA-256 hash in hexadecimal format
 * 
 * DEPENDENCIES:
 *   None - uses Node.js built-in 'crypto' module
 * 
 * EXAMPLE:
 *   $ node hash_ideas.js my-idea.md
 *   SHA-256: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
 * 
 * @author Music Mates UK
 * @license MIT
 */

const crypto = require('crypto');
const fs = require('fs');

/**
 * Compute SHA-256 hash of input data
 * @param {string|Buffer} data - The data to hash
 * @returns {string} Hexadecimal hash string
 */
function computeSHA256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Read from stdin and compute hash
 * @returns {Promise<string>} Hash of stdin data
 */
function hashStdin() {
    return new Promise((resolve, reject) => {
        const chunks = [];
        
        process.stdin.on('data', chunk => {
            chunks.push(chunk);
        });
        
        process.stdin.on('end', () => {
            const data = Buffer.concat(chunks);
            resolve(computeSHA256(data));
        });
        
        process.stdin.on('error', reject);
    });
}

/**
 * Read file and compute hash
 * @param {string} filepath - Path to file
 * @returns {Promise<string>} Hash of file contents
 */
function hashFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(computeSHA256(data));
            }
        });
    });
}

/**
 * Display usage information
 */
function showUsage() {
    console.log(`
Usage: node hash_ideas.js [FILE]

Compute SHA-256 hash of a file or stdin input.

Examples:
  node hash_ideas.js idea.txt          # Hash a file
  echo -n "text" | node hash_ideas.js  # Hash from stdin
  node hash_ideas.js                   # Interactive (Ctrl+D to finish)

Options:
  -h, --help                           # Show this help message

For the ideas registry:
  1. Write your idea in a file
  2. Run: node hash_ideas.js your-idea.txt
  3. Copy the hash to ideas_hashes.md
  4. Commit and push ideas_hashes.md
`);
}

/**
 * Main execution
 */
async function main() {
    const args = process.argv.slice(2);
    
    // Check for help flag
    if (args.includes('-h') || args.includes('--help')) {
        showUsage();
        process.exit(0);
    }
    
    try {
        let hash;
        
        if (args.length === 0) {
            // No arguments - read from stdin
            if (process.stdin.isTTY) {
                console.log('Enter text (press Ctrl+D when done):');
            }
            hash = await hashStdin();
        } else if (args.length === 1) {
            // One argument - treat as file path
            const filepath = args[0];
            
            // Check if file exists
            if (!fs.existsSync(filepath)) {
                console.error(`Error: File not found: ${filepath}`);
                process.exit(1);
            }
            
            hash = await hashFile(filepath);
            console.log(`File: ${filepath}`);
        } else {
            // Too many arguments
            console.error('Error: Too many arguments');
            showUsage();
            process.exit(1);
        }
        
        console.log(`SHA-256: ${hash}`);
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

// Export functions for testing
module.exports = {
    computeSHA256,
    hashFile,
    hashStdin
};
