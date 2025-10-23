# Ideas landing (Wilfy1979 / musicmates-uk)

This folder/page provides a public, timestamped registry of ideas and a simple notarization workflow. It includes:

- index.html — public landing page showing full idea texts (you chose public full-text publication).
- ideas_hashes.md — public registry of SHA-256 hashes for each idea (update with computed hashes).
- hash_ideas.js — local Node script to compute SHA-256 hashes from plain text files.
- ideas_private_template.md — optional local template for private master copies (do NOT commit sensitive files you want to keep secret).

Important safety notes
- You chose to publish full idea texts publicly. Anything you put in index.html will be visible to everyone.
- Do NOT commit large binaries (MP4s) to the repository. Use embedded YouTube links instead.
- If you want to keep the idea text secret while proving prior authorship, choose the hashed-only workflow (not used here).

How to compute hashes locally (recommended)
1. Create a directory called `ideas_texts/`.
2. For each idea published on index.html, create a plain text file (UTF-8) with the exact same full text. Example:
   - ideas_texts/musicmates.txt
   - ideas_texts/remaster-series.txt
3. Run the Node script (requires Node.js):
   - node hash_ideas.js
   - The script prints lines like: `- musicmates | sha256: <hex>`
4. Copy the hex digest into `ideas_hashes.md` next to the corresponding title and date.
5. Commit and push the updated `ideas_hashes.md`. The commit SHA and timestamp combined with the published hash serve as evidence of prior authorship.

Optional notarization with OpenTimestamps (OTS)
OpenTimestamps provides an external timestamp anchored to Bitcoin. Steps (example):

1. Install OpenTimestamps client:
   - macOS (Homebrew): `brew install opentimestamps/opentimestamps/ots-client`
   - Other OS: see https://opentimestamps.org

2. Create a file containing the hex hash (or the idea text) locally:
   - echo -n "hex-or-text" > stamp_input.txt

3. Create an OTS timestamp:
   - If you stamp the raw idea text:
     - `ots stamp idea.txt`
     - This creates `idea.txt.ots`
   - If you stamp a hash:
     - `echo -n "<hex>" > idea-hash.txt`
     - `ots stamp idea-hash.txt`

4. To anchor immediately (attach to Bitcoin), use the calendar or delegated services described on the OTS docs. See https://opentimestamps.org for details.

5. Verification later:
   - `ots verify idea.txt` or `ots verify idea-hash.txt.ots`

Alternatives to OTS:
- Publish the hash in an immutable public place (e.g., a blockchain transaction or a public notarization service).
- Use trusted third-party timestamping services (OriginStamp, GuardTime, etc).

What I prepared for you
- A responsive index.html with:
  - A YouTube subscribe button linking to your channel: https://www.youtube.com/@RJM-Music1979?sub_confirmation=1
  - An embedded remaster player (the user-provided YouTube video has been embedded)
  - Public full idea texts and visible SHA-256 placeholders to be replaced with computed hashes
  - A "MusicMates — Coming soon" description of the project's potential.
- ideas_hashes.md with placeholders and instructions.
- ideas_private_template.md as a local master copy template.
- hash_ideas.js to compute SHA-256 hashes locally.
- Guidance above for notarization and verification.

Next steps
- Review the files in branch feature/ideas-landing and open a pull request when ready.
