// Music Mates UK - Main JavaScript

// Sample profile data
const profiles = [
    {
        id: 1,
        name: "Sarah",
        age: 28,
        city: "London",
        distance: 5,
        bands: ["Arctic Monkeys", "The 1975"],
        genres: ["Indie", "Rock"],
        lastGig: "Arctic Monkeys at The O2",
        photo: "https://via.placeholder.com/400x500?text=Sarah"
    },
    {
        id: 2,
        name: "Mike",
        age: 32,
        city: "Manchester",
        distance: 3,
        bands: ["Oasis", "The Stone Roses"],
        genres: ["Rock", "Britpop"],
        lastGig: "Liam Gallagher at Etihad Stadium",
        photo: "https://via.placeholder.com/400x500?text=Mike"
    },
    {
        id: 3,
        name: "Emma",
        age: 25,
        city: "Birmingham",
        distance: 8,
        bands: ["Ed Sheeran", "Coldplay"],
        genres: ["Pop", "Alternative"],
        lastGig: "Ed Sheeran at Villa Park",
        photo: "https://via.placeholder.com/400x500?text=Emma"
    },
    {
        id: 4,
        name: "James",
        age: 30,
        city: "Bristol",
        distance: 12,
        bands: ["Massive Attack", "Portishead"],
        genres: ["Electronic", "Trip Hop"],
        lastGig: "Massive Attack at Bristol Arena",
        photo: "https://via.placeholder.com/400x500?text=James"
    }
];

let currentProfileIndex = 0;
let matches = [];

// Initialize the app
function initApp() {
    // Check if user data exists
    const userData = localStorage.getItem('signupData');
    if (userData) {
        console.log('User is signed in:', JSON.parse(userData));
    }

    // Load matches from localStorage
    const savedMatches = localStorage.getItem('matches');
    if (savedMatches) {
        matches = JSON.parse(savedMatches);
    }

    // Display first profile
    displayProfile();
    displayMatches();
}

// Display current profile
function displayProfile() {
    if (currentProfileIndex >= profiles.length) {
        document.getElementById('profile-container').innerHTML = '<h2>No more profiles to show!</h2>';
        return;
    }

    const profile = profiles[currentProfileIndex];
    const container = document.getElementById('profile-container');
    
    container.innerHTML = `
        <div class="profile-card">
            <img src="${profile.photo}" alt="${profile.name}'s profile photo">
            <h2 id="name">${profile.name}, ${profile.age}</h2>
            <p id="age-city">${profile.city}</p>
            <p id="distance">Distance: ${profile.distance} miles</p>
            <p id="bands">Shared Bands: <span style="color: yellow;">${profile.bands.join(', ')}</span></p>
            <p id="genre-badge">Genres: ${profile.genres.join(', ')}</p>
            <p id="last-gig">Last Gig: ${profile.lastGig}</p>
            <div class="buttons">
                <button class="button" onclick="passProfile()">Pass</button>
                <button class="button" onclick="likeProfile()">Like ❤️</button>
            </div>
        </div>
    `;
}

// Like profile function
function likeProfile() {
    const profile = profiles[currentProfileIndex];
    matches.push(profile);
    localStorage.setItem('matches', JSON.stringify(matches));
    
    // Show notification
    showNotification(`You liked ${profile.name}!`);
    
    // Move to next profile
    currentProfileIndex++;
    displayProfile();
    displayMatches();
}

// Pass profile function
function passProfile() {
    const profile = profiles[currentProfileIndex];
    showNotification(`Passed on ${profile.name}`);
    
    currentProfileIndex++;
    displayProfile();
}

// Display matches
function displayMatches() {
    const matchesList = document.getElementById('matches-list');
    if (!matchesList) return;
    
    if (matches.length === 0) {
        matchesList.innerHTML = '<p style="color: yellow;">No matches yet. Start liking profiles!</p>';
        return;
    }
    
    matchesList.innerHTML = matches.map(match => `
        <div class="match-card">
            <img src="${match.photo}" alt="${match.name}">
            <h3>${match.name}</h3>
            <p>${match.city}</p>
        </div>
    `).join('');
}

// Show notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: yellow;
            color: black;
            padding: 15px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Hide after 2 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
