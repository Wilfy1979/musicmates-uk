// User Profile Data
let userProfile = null;
let currentMatches = [];
let likedProfiles = [];
let currentMatchIndex = 0;

// Sample Match Profiles
const sampleProfiles = [
    {
        id: 1,
        name: "Emma",
        age: 26,
        location: "London",
        genres: ["Rock", "Indie", "Alternative"],
        favoriteArtist: "Arctic Monkeys",
        bio: "Music festival enthusiast who loves discovering new bands. Looking for someone to share playlists and concert experiences with!",
        emoji: "🎸"
    },
    {
        id: 2,
        name: "James",
        age: 29,
        location: "Manchester",
        genres: ["Jazz", "Blues", "Soul"],
        favoriteArtist: "John Coltrane",
        bio: "Jazz pianist and vinyl collector. Let's grab coffee and talk about our favorite albums!",
        emoji: "🎹"
    },
    {
        id: 3,
        name: "Sophie",
        age: 24,
        location: "Birmingham",
        genres: ["Pop", "Electronic", "Dance"],
        favoriteArtist: "Dua Lipa",
        bio: "Dance floor lover and playlist curator. Always up for a night out or a cozy listening session.",
        emoji: "💃"
    },
    {
        id: 4,
        name: "Oliver",
        age: 31,
        location: "Bristol",
        genres: ["Folk", "Acoustic", "Indie"],
        favoriteArtist: "Ben Howard",
        bio: "Singer-songwriter who loves intimate gigs and acoustic sessions. Looking for someone who appreciates the beauty in simplicity.",
        emoji: "🎻"
    },
    {
        id: 5,
        name: "Lucy",
        age: 27,
        location: "Edinburgh",
        genres: ["Classical", "Opera", "Jazz"],
        favoriteArtist: "Ludovico Einaudi",
        bio: "Classical music lover and concert-goer. Seeking someone who enjoys symphony halls as much as I do.",
        emoji: "🎼"
    },
    {
        id: 6,
        name: "Tom",
        age: 28,
        location: "Leeds",
        genres: ["Hip Hop", "R&B", "Rap"],
        favoriteArtist: "Kendrick Lamar",
        bio: "Hip hop head and vinyl digger. Let's explore the underground music scene together!",
        emoji: "🎤"
    },
    {
        id: 7,
        name: "Sarah",
        age: 25,
        location: "Liverpool",
        genres: ["Rock", "Pop", "Alternative"],
        favoriteArtist: "The Beatles",
        bio: "Proud Liverpudlian with a love for classic rock. Let's take a magical mystery tour together!",
        emoji: "🎵"
    },
    {
        id: 8,
        name: "Daniel",
        age: 30,
        location: "Glasgow",
        genres: ["Electronic", "Techno", "House"],
        favoriteArtist: "Disclosure",
        bio: "DJ and electronic music producer. Looking for someone to dance through life with!",
        emoji: "🎧"
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user profile exists in localStorage
    const savedProfile = localStorage.getItem('musicMatesProfile');
    const savedMatches = localStorage.getItem('musicMatesMatches');
    const savedLiked = localStorage.getItem('musicMatesLiked');
    
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        document.getElementById('user-name').textContent = userProfile.name;
        showSection('matching');
    } else {
        showSection('onboarding');
    }
    
    if (savedMatches) {
        currentMatches = JSON.parse(savedMatches);
    } else {
        // Filter profiles based on shared genres (simple matching algorithm)
        currentMatches = [...sampleProfiles];
        shuffleArray(currentMatches);
    }
    
    if (savedLiked) {
        likedProfiles = JSON.parse(savedLiked);
        displayMatches();
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Display first match if available
    if (currentMatches.length > 0) {
        displayCurrentMatch();
    }
}

function setupEventListeners() {
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
    
    // Match action buttons
    const passBtn = document.getElementById('pass-btn');
    const likeBtn = document.getElementById('like-btn');
    const superLikeBtn = document.getElementById('super-like-btn');
    
    if (passBtn) passBtn.addEventListener('click', () => handleMatchAction('pass'));
    if (likeBtn) likeBtn.addEventListener('click', () => handleMatchAction('like'));
    if (superLikeBtn) superLikeBtn.addEventListener('click', () => handleMatchAction('super-like'));
    
    // Bottom navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            if (section === 'chat' && likedProfiles.length === 0) {
                alert('No matches yet! Keep swiping to find your perfect match.');
                return;
            }
            showSection(section);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Chat functionality
    const backToMatchesBtn = document.getElementById('back-to-matches');
    const sendMessageBtn = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');
    
    if (backToMatchesBtn) {
        backToMatchesBtn.addEventListener('click', () => showSection('matches-list'));
    }
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function handleProfileSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const location = document.getElementById('location').value;
    const genres = Array.from(document.querySelectorAll('input[name="genre"]:checked'))
        .map(checkbox => checkbox.value);
    const favoriteArtist = document.getElementById('favorite-artist').value;
    const bio = document.getElementById('bio').value;
    
    if (genres.length === 0) {
        alert('Please select at least one music genre!');
        return;
    }
    
    userProfile = {
        name,
        age: parseInt(age),
        location,
        genres,
        favoriteArtist,
        bio
    };
    
    // Save to localStorage
    localStorage.setItem('musicMatesProfile', JSON.stringify(userProfile));
    
    // Update user name in header
    document.getElementById('user-name').textContent = name;
    
    // Show matching section
    showSection('matching');
    
    // Activate first nav item
    document.querySelector('.nav-item[data-section="matching"]').classList.add('active');
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Special handling for matches list
    if (sectionId === 'matches-list') {
        displayMatches();
    }
}

function displayCurrentMatch() {
    if (currentMatchIndex >= currentMatches.length) {
        // No more matches
        document.getElementById('match-card').innerHTML = `
            <div class="match-info" style="text-align: center; padding: 3rem;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🎉 You've seen all profiles!</h3>
                <p>Check back later for new matches, or view your current matches.</p>
            </div>
        `;
        return;
    }
    
    const match = currentMatches[currentMatchIndex];
    const matchCard = document.getElementById('match-card');
    
    matchCard.innerHTML = `
        <div class="match-photo">${match.emoji}</div>
        <div class="match-info">
            <h3 class="match-name">${match.name}, ${match.age}</h3>
            <p class="match-details">📍 ${match.location}</p>
            <p class="match-details">🎵 Favorite: ${match.favoriteArtist}</p>
            <div class="match-genres">
                ${match.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
            </div>
            <p class="match-bio">${match.bio}</p>
        </div>
    `;
    
    // Remove animation classes
    matchCard.classList.remove('swipe-left', 'swipe-right');
}

function handleMatchAction(action) {
    if (currentMatchIndex >= currentMatches.length) {
        return;
    }
    
    const matchCard = document.getElementById('match-card');
    const currentMatch = currentMatches[currentMatchIndex];
    
    if (action === 'like' || action === 'super-like') {
        // Add to liked profiles
        likedProfiles.push({
            ...currentMatch,
            matchedAt: new Date().toISOString(),
            isSuperLike: action === 'super-like'
        });
        
        // Save to localStorage
        localStorage.setItem('musicMatesLiked', JSON.stringify(likedProfiles));
        
        // Animate swipe right
        matchCard.classList.add('swipe-right');
        
        // Show match notification
        if (action === 'super-like') {
            showMatchNotification(currentMatch, true);
        } else {
            showMatchNotification(currentMatch, false);
        }
    } else if (action === 'pass') {
        // Animate swipe left
        matchCard.classList.add('swipe-left');
    }
    
    // Move to next match after animation
    setTimeout(() => {
        currentMatchIndex++;
        displayCurrentMatch();
    }, 500);
}

function showMatchNotification(match, isSuperLike) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem 3rem;
        border-radius: 20px;
        box-shadow: 0 10px 50px rgba(0,0,0,0.3);
        text-align: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">
            ${isSuperLike ? '⭐' : '💕'}
        </div>
        <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">
            ${isSuperLike ? 'Super Like!' : "It's a Match!"}
        </h3>
        <p>You and ${match.name} both love ${match.genres[0]}!</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function displayMatches() {
    const matchesGrid = document.getElementById('matches-grid');
    
    if (likedProfiles.length === 0) {
        matchesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h3 style="color: #999; margin-bottom: 1rem;">No matches yet</h3>
                <p style="color: #666;">Start swiping to find your perfect match!</p>
            </div>
        `;
        return;
    }
    
    matchesGrid.innerHTML = likedProfiles.map(match => `
        <div class="match-item" onclick="openChat('${match.name}', ${match.id})">
            <div class="match-item-photo">${match.emoji}</div>
            <div class="match-item-info">
                <h4 class="match-item-name">${match.name}</h4>
                <p class="match-item-preview">${match.genres[0]} • ${match.location}</p>
            </div>
        </div>
    `).join('');
}

function openChat(userName, userId) {
    showSection('chat');
    
    // Update chat header
    document.getElementById('chat-user-name').textContent = userName;
    
    // Load existing messages or create welcome message
    const chatMessages = document.getElementById('chat-messages');
    const savedMessages = localStorage.getItem(`chat_${userId}`);
    
    if (savedMessages) {
        chatMessages.innerHTML = savedMessages;
    } else {
        chatMessages.innerHTML = `
            <div class="message message-received">
                <div>Hey! I saw we both love the same music taste! 🎵</div>
                <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `;
    }
    
    // Store current chat user
    chatMessages.dataset.userId = userId;
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chat-messages');
    const userId = chatMessages.dataset.userId;
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message message-sent';
    messageElement.innerHTML = `
        <div>${message}</div>
        <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    
    // Clear input
    input.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Save messages
    localStorage.setItem(`chat_${userId}`, chatMessages.innerHTML);
    
    // Simulate response after a delay
    setTimeout(() => {
        const responses = [
            "That's awesome! 😊",
            "I'd love to! When are you free?",
            "Have you heard their latest album?",
            "We should definitely go to a concert together!",
            "That sounds amazing! 🎵",
            "I'm so glad we matched!"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseElement = document.createElement('div');
        responseElement.className = 'message message-received';
        responseElement.innerHTML = `
            <div>${randomResponse}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        
        chatMessages.appendChild(responseElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Save messages
        localStorage.setItem(`chat_${userId}`, chatMessages.innerHTML);
    }, 1000 + Math.random() * 2000);
}

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Add keyboard navigation for matching
document.addEventListener('keydown', function(e) {
    const matchingSection = document.getElementById('matching');
    if (!matchingSection || !matchingSection.classList.contains('active')) {
        return;
    }
    
    if (e.key === 'ArrowLeft') {
        handleMatchAction('pass');
    } else if (e.key === 'ArrowRight') {
        handleMatchAction('like');
    } else if (e.key === 'ArrowUp') {
        handleMatchAction('super-like');
    }
});
