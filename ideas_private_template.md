# Private Idea Template

**⚠️ IMPORTANT: Do NOT commit this file to a public repository!**

Keep this file on your local machine, in a private repository, or in encrypted storage.

---

## Idea Information

**Title/Label:** [Give your idea a short descriptive name]

**Date:** [YYYY-MM-DD]

**Category:** [e.g., Music, App, Business, Invention, etc.]

---

## Full Idea Description

[Write your complete idea here. Be as detailed as you like. This is your private record.]

[Include all relevant details, sketches, plans, or concepts that you want to preserve.]

[This text will be hashed to create a cryptographic fingerprint.]

---

## Computing the Hash

To create a verifiable proof of this idea:

### Method 1: Using the Node.js Script

```bash
# Save this file, then run:
node hash_ideas.js this-file.md

# Copy the SHA-256 hash output
```

### Method 2: Using OpenSSL (Command Line)

```bash
# For a file:
openssl dgst -sha256 this-file.md

# For text directly:
echo -n "Your exact idea text" | openssl dgst -sha256
```

### Method 3: Online Tool (Less Secure)

Visit: https://emn178.github.io/online-tools/sha256.html
- Paste your text
- Copy the hash
- ⚠️ Only use trusted tools for sensitive ideas

---

## Recording the Hash

1. Copy the SHA-256 hash from above
2. Open `ideas_hashes.md` in the public repository
3. Add a new entry with:
   - Your idea's title/label
   - Today's date
   - The SHA-256 hash
4. Commit and push `ideas_hashes.md`
5. **DO NOT commit this private file!**

---

## Verification Process

Later, to prove you had this idea at the recorded date:

1. Show this original file (kept private until now)
2. Compute its hash using the same method
3. Compare to the hash in the public `ideas_hashes.md` registry
4. Show the Git commit timestamp of `ideas_hashes.md`

The matching hash proves the content hasn't changed since the commit date.

---

## Example Entry for ideas_hashes.md

After computing your hash, add an entry like this:

```markdown
| My Brilliant Idea | 2025-10-22 | abc123def456... |
```

---

## Additional Protection (Optional)

### OpenTimestamps

For blockchain-backed proof:

```bash
# Install OTS client
pip install opentimestamps-client

# Create a timestamp proof
ots stamp ideas_hashes.md

# This creates ideas_hashes.md.ots - commit this too!
```

### Copyright Notice

You may want to add a copyright notice to your idea:

```
Copyright © [Year] [Your Name]. All Rights Reserved.
```

Note: In most countries, copyright is automatic upon creation. Registration may provide additional benefits. Consult a legal professional for advice.

---

## Storage Recommendations

- Keep this file in a **private Git repository** (GitHub/GitLab private repo)
- Store encrypted backups (use GPG, VeraCrypt, or cloud encryption)
- Consider printing and storing physical copies in a safe location
- Multiple backups in different locations reduce risk of loss

---

## Template Notes

- Replace all `[bracketed]` placeholders with your actual content
- Be thorough - more detail provides better documentation
- Date everything accurately
- Keep multiple versions if your idea evolves over time
- Each version can have its own hash entry in the public registry

---

**Remember:** The hash in the public registry is proof you had this idea. Keep this full text secure until you're ready to reveal it!
