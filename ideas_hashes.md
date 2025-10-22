# Ideas Hash Registry

This is a **public registry** of creative ideas, concepts, and works. Each entry includes:
- A label/title for the idea
- An ISO 8601 date (YYYY-MM-DD)
- A SHA-256 hash of the full text

By committing this registry to GitHub with timestamps, you create **proof of prior existence** for your ideas.

## How It Works

1. Write your full idea in a private file (use `ideas_private_template.md` as a template)
2. Compute the SHA-256 hash of your idea text using `hash_ideas.js` or `openssl`
3. Add an entry below with the idea label, date, and hash
4. Commit and push this file to GitHub
5. The Git commit timestamp + hash provides proof you had this idea at that time

## Public Registry

Replace the examples below with your actual ideas:

| Idea Label | Date | SHA-256 Hash |
|------------|------|--------------|
| Example Idea #1 | 2025-01-15 | a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2 |
| Example Idea #2 | 2025-02-20 | f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1 |
| Example Idea #3 | 2025-03-10 | 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3 |

## Instructions

### Adding a New Entry

1. Create your idea document (keep it private if desired)
2. Compute its hash:
   ```bash
   # Using the provided Node.js script:
   node hash_ideas.js your-idea.txt
   
   # Or using OpenSSL:
   openssl dgst -sha256 your-idea.txt
   
   # Or from clipboard/text:
   echo -n "Your idea text here" | openssl dgst -sha256
   ```
3. Add a new row to the table above with:
   - A descriptive label (no need to reveal the full idea)
   - Today's date in YYYY-MM-DD format
   - The SHA-256 hash
4. Commit and push this file

### Verifying an Entry

Anyone can verify that a hash matches the full text:

```bash
# Using Node.js script:
node hash_ideas.js original-idea.txt

# Using OpenSSL:
openssl dgst -sha256 original-idea.txt

# Compare the output to the hash in this registry
```

## Additional Notarization (Optional)

For stronger proof, you can use **OpenTimestamps** to create a cryptographic proof linked to the Bitcoin blockchain:

```bash
# Install OpenTimestamps client (requires Python)
pip install opentimestamps-client

# Create timestamp proof for this registry file
ots stamp ideas_hashes.md

# This creates ideas_hashes.md.ots
# Commit both files to preserve the proof

# Verify the timestamp later:
ots verify ideas_hashes.md.ots
```

## Notes

- **Do not commit your full idea text** to this public repo unless you want it to be public
- Keep full texts in a private location (local files, private repo, encrypted storage)
- The hash registry + Git commit timestamp is sufficient for proof of prior existence
- You can reveal the full text later and prove it matches the hash
- For legal purposes, consult an intellectual property attorney about copyright and patent protection

## Resources

- [OpenTimestamps](https://opentimestamps.org/) - Bitcoin blockchain timestamping
- [SHA-256 Hash Calculator](https://emn178.github.io/online-tools/sha256.html) - Online tool
- [Copyright Basics (US)](https://www.copyright.gov/circs/circ01.pdf) - US Copyright Office
- [UK Copyright Service](https://www.copyrightservice.co.uk/) - UK Copyright guidance
