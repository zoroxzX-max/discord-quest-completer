// Game Quests Database
const gamesDatabase = {
    fortnite: [
        { id: 1, name: "10 Eliminations", reward: 500, difficulty: "Medium" },
        { id: 2, name: "Search 7 Chests", reward: 300, difficulty: "Easy" },
        { id: 3, name: "Deal 500 Damage", reward: 400, difficulty: "Medium" },
        { id: 4, name: "Visit 3 Locations", reward: 250, difficulty: "Easy" },
        { id: 5, name: "Win 1 Match", reward: 1000, difficulty: "Hard" }
    ],
    valorant: [
        { id: 1, name: "Get 20 Kills", reward: 600, difficulty: "Hard" },
        { id: 2, name: "Plant 5 Spikes", reward: 400, difficulty: "Medium" },
        { id: 3, name: "Defuse 3 Spikes", reward: 400, difficulty: "Medium" },
        { id: 4, name: "Win 5 Rounds", reward: 300, difficulty: "Easy" },
        { id: 5, name: "Get Headshots (10)", reward: 500, difficulty: "Hard" }
    ],
    minecraft: [
        { id: 1, name: "Mine 64 Blocks", reward: 200, difficulty: "Easy" },
        { id: 2, name: "Craft Iron Pickaxe", reward: 300, difficulty: "Easy" },
        { id: 3, name: "Find Diamond", reward: 800, difficulty: "Hard" },
        { id: 4, name: "Build a House", reward: 500, difficulty: "Medium" },
        { id: 5, name: "Defeat Ender Dragon", reward: 2000, difficulty: "Hard" }
    ],
    roblox: [
        { id: 1, name: "Complete 3 Games", reward: 400, difficulty: "Easy" },
        { id: 2, name: "Collect 100 Coins", reward: 300, difficulty: "Easy" },
        { id: 3, name: "Reach Level 10", reward: 600, difficulty: "Medium" },
        { id: 4, name: "Unlock 5 Badges", reward: 500, difficulty: "Medium" },
        { id: 5, name: "Buy Premium Item", reward: 1000, difficulty: "Hard" }
    ],
    cod: [
        { id: 1, name: "Get 25 Kills", reward: 700, difficulty: "Hard" },
        { id: 2, name: "Win 3 Matches", reward: 500, difficulty: "Medium" },
        { id: 3, name: "Plant 5 Bombs", reward: 400, difficulty: "Medium" },
        { id: 4, name: "Get 10 Headshots", reward: 600, difficulty: "Hard" },
        { id: 5, name: "Reach Level 30", reward: 800, difficulty: "Hard" }
    ],
    apex: [
        { id: 1, name: "Get 15 Kills", reward: 600, difficulty: "Hard" },
        { id: 2, name: "Revive 5 Teammates", reward: 400, difficulty: "Medium" },
        { id: 3, name: "Deal 1000 Damage", reward: 500, difficulty: "Medium" },
        { id: 4, name: "Win 2 Matches", reward: 1000, difficulty: "Hard" },
        { id: 5, name: "Get 5 Knockdowns", reward: 450, difficulty: "Medium" }
    ]
};

// Global State
let currentUser = null;
let selectedGame = null;
let completedQuests = [];
let autoCompleteEnabled = true;

// Discord Login Simulation
document.getElementById('discordLogin').addEventListener('click', () => {
    // Simulate Discord OAuth
    const userName = "Discord User #" + Math.floor(Math.random() * 9999);
    currentUser = {
        name: userName,
        avatar: "🎮",
        id: Math.random().toString(36).substr(2, 9)
    };

    // Update UI
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('userName').textContent = `✅ Logged in as: ${currentUser.name}`;
    document.getElementById('discordLogin').disabled = true;

    showNotification(`Welcome ${currentUser.name}! 🎮`);
});

// Logout
document.getElementById('logout').addEventListener('click', () => {
    currentUser = null;
    selectedGame = null;
    completedQuests = [];
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('discordLogin').disabled = false;
    document.getElementById('questList').innerHTML = '<p style="text-align:center; color:#999;">कोई quest नहीं। एक game चुनो!</p>';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressText').textContent = '0/0 Quests Complete';
    showNotification('Logged out! 👋');
});

// Game Selection
document.querySelectorAll('.game-option').forEach(option => {
    option.addEventListener('click', function() {
        if (!currentUser) {
            showNotification('पहले Discord से login करो! 🔗');
            return;
        }

        // Remove previous selection
        document.querySelectorAll('.game-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');

        selectedGame = this.dataset.game;
        completedQuests = [];
        loadQuests(selectedGame);
        showNotification(`${selectedGame.toUpperCase()} चुना गया! 🎮`);
    });
});

// Load Quests
function loadQuests(game) {
    const quests = gamesDatabase[game];
    const questList = document.getElementById('questList');
    questList.innerHTML = '';

    quests.forEach(quest => {
        const questItem = document.createElement('div');
        questItem.className = 'quest-item';
        questItem.innerHTML = `
            <div class="quest-info">
                <h3>${quest.name}</h3>
                <p>⭐ Reward: ${quest.reward} XP | Difficulty: ${quest.difficulty}</p>
            </div>
            <span class="quest-status pending" id="status-${quest.id}">Pending</span>
        `;
        questItem.addEventListener('click', () => completeQuest(quest.id, questItem));
        questList.appendChild(questItem);
    });

    updateProgress();
}

// Complete Single Quest
function completeQuest(questId, element) {
    if (!completedQuests.includes(questId)) {
        completedQuests.push(questId);
        element.classList.add('completed');
        
        const status = element.querySelector('.quest-status');
        status.textContent = 'Completed ✅';
        status.classList.remove('pending');
        status.classList.add('completed');

        showNotification('Quest Complete! 🎉');
        updateProgress();
    }
}

// Complete All Quests
document.getElementById('completeAllBtn').addEventListener('click', () => {
    if (!selectedGame) {
        showNotification('पहले एक game चुनो! 🎮');
        return;
    }

    if (!autoCompleteEnabled) {
        showNotification('Auto-Complete disabled है! ⚙️');
        return;
    }

    const quests = gamesDatabase[selectedGame];
    quests.forEach(quest => {
        if (!completedQuests.includes(quest.id)) {
            const element = document.getElementById(`status-${quest.id}`).closest('.quest-item');
            completeQuest(quest.id, element);
        }
    });

    showNotification('सभी Quests Complete! 🏆');
});

// Auto-Complete Toggle
document.getElementById('autoComplete').addEventListener('change', (e) => {
    autoCompleteEnabled = e.target.checked;
    const message = autoCompleteEnabled ? 'Auto-Complete Enable ✅' : 'Auto-Complete Disable ❌';
    showNotification(message);
});

// Notification Toggle
document.getElementById('notification').addEventListener('change', (e) => {
    const message = e.target.checked ? 'Notifications ON 🔔' : 'Notifications OFF 🔇';
    showNotification(message);
});

// Update Progress
function updateProgress() {
    const quests = selectedGame ? gamesDatabase[selectedGame] : [];
    const total = quests.length;
    const completed = completedQuests.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `${completed}/${total} Quests Complete`;

    if (percentage === 100 && total > 0) {
        showNotification('सभी Quests Complete! 🏆🎊');
    }
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auto-save Progress to LocalStorage
setInterval(() => {
    if (currentUser && selectedGame) {
        const progress = {
            user: currentUser.name,
            game: selectedGame,
            completed: completedQuests,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('questProgress', JSON.stringify(progress));
    }
}, 5000);

// Load saved progress on startup
window.addEventListener('load', () => {
    const saved = localStorage.getItem('questProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        console.log('📊 Saved Progress:', progress);
    }
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        showNotification('Progress Saved! 💾');
    }
});

console.log('🎮 Discord Quest Completer Loaded!');
console.log('Available Games:', Object.keys(gamesDatabase));
