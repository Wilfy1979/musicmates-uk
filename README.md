# 🎵 Music Mates UK 🎵

Welcome to Music Mates UK - A music-themed dating and social platform connecting people through their shared love of music!

## 🎸 About

Music Mates UK is a web-based platform designed to bring music lovers together. Whether you're looking for concert buddies, romantic connections, or just friends who share your musical taste, Music Mates UK helps you connect with like-minded people in your area.

## ✨ Features

- **User Profiles**: Create detailed profiles with your favorite bands, genres, and recent gig experiences
- **Dating App Interface**: Swipe-style matching system to connect with other music lovers
- **Gig Discovery**: Browse and express interest in upcoming concerts and live music events
- **Location-Based**: Find matches in major UK cities including London, Manchester, Birmingham, Glasgow, and more
- **Music Preferences**: Connect based on shared favorite bands and music genres
- **Admin Tools**: Special creator/admin profile management

## 📁 Project Structure

- `index.html` - Main landing page with information about Music Mates UK
- `signup.html` - Comprehensive user registration form
- `app.html` - Interactive dating app with profile browsing and matching
- `gigs.html` - Upcoming gigs and concerts listing
- `ideas.html` - Ideas landing page with hash registry
- `ideas_hashes.md` - Public registry of hashed creative ideas
- `ideas_private_template.md` - Template for storing private idea texts
- `hash_ideas.js` - SHA-256 hash calculator utility
- `admin/profile-creator.html` - Admin interface for creator profiles
- `styles.css` - Main stylesheet with consistent branding
- `script.js` - JavaScript functionality for the dating app
- `The Open - Elevation.mp4` - Promotional video content

## 🚀 Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Navigate to the Sign Up page to create your profile
4. Fill in your details including:
   - Name, age, and location
   - Favorite bands (top 5)
   - Preferred music genres
   - Recent gig experiences
   - What you're looking for (friends, dating, concert buddies, etc.)
5. Browse profiles in the App section
6. Check out upcoming gigs in your area

## 💡 Ideas & Hash Registry - Proof of Prior Existence

The **Ideas** section (`ideas.html`) provides a way to create timestamped, cryptographic proof of your creative ideas, concepts, and works using SHA-256 hashing combined with Git commit timestamps.

### How It Works

This approach uses a **public registry** (`ideas_hashes.md`) that contains:
- Idea labels/titles
- ISO 8601 dates (YYYY-MM-DD)
- SHA-256 hashes of the full idea text

By committing the registry to GitHub, the **Git commit timestamp** combined with the **cryptographic hash** creates verifiable proof that you possessed the idea at that specific time.

### Why This Method?

1. **Cryptographically Secure**: SHA-256 hashes are one-way - you can't reverse-engineer the original text from the hash
2. **Timestamped**: Git commits are permanently timestamped and publicly visible on GitHub
3. **Private Until Revealed**: You keep the full idea text private; only the hash is public
4. **Verifiable**: Anyone can verify that your full text matches the hash when you choose to reveal it
5. **Free & Open**: No paid services required - uses standard tools (Git, OpenSSL, Node.js)

### Step-by-Step Guide

#### 1. Write Your Idea

Create a new file based on `ideas_private_template.md`:

```bash
cp ideas_private_template.md my-private-idea.md
```

**⚠️ IMPORTANT**: Keep this file LOCAL. Do NOT commit it to the public repository unless you want to make it public.

Edit the file and write your complete idea with all details.

#### 2. Compute the SHA-256 Hash

Use one of these methods:

**Method A: Using the Node.js Script (Recommended)**

```bash
node hash_ideas.js my-private-idea.md
```

**Method B: Using OpenSSL**

```bash
# For a file:
openssl dgst -sha256 my-private-idea.md

# For text directly (careful with trailing newlines):
echo -n "Your exact idea text" | openssl dgst -sha256
```

**Method C: Online Tool** (use with caution for sensitive ideas)

Visit: https://emn178.github.io/online-tools/sha256.html

#### 3. Add Hash to Public Registry

Open `ideas_hashes.md` and add a new entry:

```markdown
| My Brilliant Idea | 2025-10-22 | abc123def456... |
```

Replace with:
- Your idea's label (can be vague or specific - your choice)
- Today's date in YYYY-MM-DD format
- The SHA-256 hash you just computed

#### 4. Commit and Push

```bash
git add ideas_hashes.md
git commit -m "Add hash for new idea: [your label]"
git push
```

The GitHub commit now timestamps your hash publicly!

#### 5. Verify Later

When you're ready to prove you had the idea:

1. Reveal your original private file
2. Compute its hash using the same method
3. Compare to the hash in `ideas_hashes.md`
4. Show the Git commit history to prove the timestamp

If the hashes match, it proves the content hasn't changed since the commit date.

### Enhanced Notarization with OpenTimestamps (Optional)

For even stronger proof, you can anchor your hash to the **Bitcoin blockchain** using OpenTimestamps:

#### Install OpenTimestamps

```bash
pip install opentimestamps-client
```

#### Create Timestamp Proof

```bash
# Timestamp the registry file
ots stamp ideas_hashes.md

# This creates ideas_hashes.md.ots
# Commit both files:
git add ideas_hashes.md ideas_hashes.md.ots
git commit -m "Add idea with OTS proof"
git push
```

#### Verify Timestamp

```bash
# Verify the timestamp proof
ots verify ideas_hashes.md.ots

# This checks:
# 1. The file hash matches
# 2. The Bitcoin blockchain transaction exists
# 3. The timestamp is valid
```

The `.ots` file contains a cryptographic proof that your hash existed at a specific Bitcoin block time.

### Usage Examples

**Example 1: Hash a File**

```bash
$ node hash_ideas.js my-song-idea.txt
File: my-song-idea.txt
SHA-256: 5c495ff78f5ddf387b3c9d690bf9cf00e3ef1f3c79d6d80331390084d7d79ce8
```

**Example 2: Hash from Stdin**

```bash
$ echo -n "My innovative app concept" | node hash_ideas.js
SHA-256: a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8
```

**Example 3: Interactive Mode**

```bash
$ node hash_ideas.js
Enter text (press Ctrl+D when done):
This is my creative idea that I want to protect.
[Ctrl+D]
SHA-256: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b
```

### Important Notes

**Copyright Considerations**

- Copyright protection is **automatic** in most countries upon creation of original work
- This hash registry provides **evidence of prior creation** but is not a substitute for formal copyright registration
- For music, consider also registering with:
  - **US**: US Copyright Office (copyright.gov)
  - **UK**: UK Copyright Service or UKIPO
  - **Performance Rights**: PRS for Music, ASCAP, BMI, etc.

**Best Practices**

1. **Don't commit large binary files** (like MP4s) to Git - use YouTube links instead
2. **Keep private files secure** - use encrypted storage, private repos, or offline backups
3. **Be consistent** - always use the exact same text when computing hashes
4. **Watch for newlines** - text editors may add trailing newlines that change the hash
5. **Document everything** - keep notes about what each hash represents

**Video Placeholder**

The `ideas.html` page includes a YouTube video embed with placeholder `VIDEO_ID`. Replace it with your actual remaster video:

```html
<!-- Replace VIDEO_ID with your actual YouTube video ID -->
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" ...>
```

To find your video ID: If your video URL is `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`.

### Resources

- [OpenTimestamps](https://opentimestamps.org/) - Bitcoin blockchain timestamping
- [SHA-256 Online Calculator](https://emn178.github.io/online-tools/sha256.html)
- [US Copyright Office](https://www.copyright.gov/)
- [UK Copyright Service](https://www.copyrightservice.co.uk/)
- [PRS for Music](https://www.prsformusic.com/) - UK music copyright
- [Git Documentation](https://git-scm.com/doc) - Understanding Git commits

## 🎨 Design

Music Mates UK features a distinctive black and yellow color scheme that represents the energy and vibrancy of the music scene. The interface is designed to be:
- Clean and modern
- Easy to navigate
- Mobile-responsive
- Focused on the music experience

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage API for data persistence
- Responsive design principles

## 🌍 Supported Cities

- London
- Manchester
- Birmingham
- Glasgow
- Liverpool
- Edinburgh
- Cardiff
- Belfast
- Bristol
- Leeds
- Sheffield
- Newcastle

## 🎵 Music Genres Supported

Rock, Pop, Indie, Metal, Jazz, Classical, Electronic, Hip Hop, Country, Punk, Alternative, Blues, Reggae, Soul, Folk

## 📱 Browser Compatibility

Works on all modern browsers:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

## 🔮 Future Enhancements

- Backend integration with database
- Real-time messaging
- Spotify/Apple Music integration
- Advanced matching algorithms
- Event ticketing integration
- Mobile app versions
- User photo uploads
- Video chat for virtual concerts

## 📄 License

Copyright © 2025 Music Mates UK. All rights reserved.

## 👥 Contributing

This is a template repository. Feel free to fork and customize for your own music-themed social platform!

---

**Find your perfect music match today! 🎸💕**
