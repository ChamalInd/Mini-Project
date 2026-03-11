document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    // Student data (mock data for demo)
    const mockStudents = [
        {
            id: 1,
            name: 'Alex Johnson',
            age: 20,
            major: 'Computer Science',
            year: 'Junior',
            interests: 'Programming, gaming, hiking',
            bio: 'CS major looking for study partners and fun activities!',
            lookingFor: 'study-partner'
        },
        {
            id: 2,
            name: 'Sarah Chen',
            age: 19,
            major: 'Biology',
            year: 'Sophomore',
            interests: 'Reading, yoga, coffee shops',
            bio: 'Pre-med student who loves learning and meeting new people.',
            lookingFor: 'friendship'
        },
        {
            id: 3,
            name: 'Mike Rodriguez',
            age: 21,
            major: 'Business',
            year: 'Senior',
            interests: 'Sports, music, entrepreneurship',
            bio: 'Business major planning to start my own company someday.',
            lookingFor: 'both'
        },
        {
            id: 4,
            name: 'Emma Davis',
            age: 18,
            major: 'Psychology',
            year: 'Freshman',
            interests: 'Art, volunteering, baking',
            bio: 'New to college and excited to make friends!',
            lookingFor: 'friendship'
        },
        {
            id: 5,
            name: 'Jordan Kim',
            age: 22,
            major: 'Engineering',
            year: 'Senior',
            interests: 'Rock climbing, coding, photography',
            bio: 'Engineering student with a passion for adventure.',
            lookingFor: 'dating'
        }
    ];

    let currentUser = null;
    let currentStudentIndex = 0;
    let matches = [];
    let conversations = {};

    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    // Login Handler
    function handleLogin(e) {
        e.preventDefault();
        const studentId = document.getElementById('student-id').value.trim();

        // For demo purposes, allow anyone to login
        // In a real app, you'd verify the student ID
        currentUser = {
            id: Date.now(), // Generate a unique ID
            studentId: studentId || 'guest',
            name: '',
            age: '',
            major: '',
            year: '',
            interests: '',
            bio: '',
            lookingFor: 'study-partner'
        };

        // Load user data from localStorage if exists
        loadUserData();

        loginContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');

        // Show profile section first for new users
        if (!currentUser.name) {
            switchSection('profile');
        } else {
            switchSection('discover');
            loadNextStudent();
        }
    }

    // Logout Handler
    function handleLogout() {
        saveUserData();
        currentUser = null;
        matches = [];
        conversations = {};
        currentStudentIndex = 0;

        appContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }

    // Section Switching
    function switchSection(sectionName) {
        sections.forEach(section => section.classList.remove('active'));
        navBtns.forEach(btn => btn.classList.remove('active'));

        document.getElementById(`${sectionName}-section`).classList.add('active');
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        if (sectionName === 'discover') {
            loadNextStudent();
        } else if (sectionName === 'matches') {
            displayMatches();
        } else if (sectionName === 'messages') {
            displayConversations();
        }
    }

    // Profile Management
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        currentUser.name = document.getElementById('name').value;
        currentUser.age = document.getElementById('age').value;
        currentUser.major = document.getElementById('major').value;
        currentUser.year = document.getElementById('year').value;
        currentUser.interests = document.getElementById('interests').value;
        currentUser.bio = document.getElementById('bio').value;
        currentUser.lookingFor = document.getElementById('looking-for').value;

        saveUserData();
        alert('Profile saved successfully!');
        switchSection('discover');
    });

    // Load profile data into form
    function loadProfileData() {
        if (currentUser) {
            document.getElementById('name').value = currentUser.name || '';
            document.getElementById('age').value = currentUser.age || '';
            document.getElementById('major').value = currentUser.major || '';
            document.getElementById('year').value = currentUser.year || '';
            document.getElementById('interests').value = currentUser.interests || '';
            document.getElementById('bio').value = currentUser.bio || '';
            document.getElementById('looking-for').value = currentUser.lookingFor || 'study-partner';
        }
    }

    // Discover Students
    function loadNextStudent() {
        const studentCard = document.getElementById('student-card');
        const noMoreCards = document.getElementById('no-more-cards');

        if (currentStudentIndex >= mockStudents.length) {
            studentCard.classList.add('hidden');
            noMoreCards.classList.remove('hidden');
            return;
        }

        const student = mockStudents[currentStudentIndex];
        const studentInfo = document.getElementById('student-info');

        studentInfo.innerHTML = `
            <h3>${student.name}, ${student.age}</h3>
            <p><strong>Major:</strong> ${student.major}</p>
            <p><strong>Year:</strong> ${student.year}</p>
            <p><strong>Interests:</strong> ${student.interests}</p>
            <p><strong>Bio:</strong> ${student.bio}</p>
            <p><strong>Looking for:</strong> ${student.lookingFor.replace('-', ' ')}</p>
        `;

        studentCard.classList.remove('hidden');
        noMoreCards.classList.add('hidden');
    }

    // Like/Pass buttons
    document.getElementById('like-btn').addEventListener('click', () => handleSwipe('like'));
    document.getElementById('pass-btn').addEventListener('click', () => handleSwipe('pass'));

    function handleSwipe(action) {
        const student = mockStudents[currentStudentIndex];

        if (action === 'like') {
            // Check if it's a match (mock logic - in real app, check server)
            const isMatch = Math.random() > 0.5; // 50% chance for demo
            if (isMatch) {
                matches.push(student);
                alert(`It's a match! You and ${student.name} liked each other!`);
                saveMatches();
            }
        }

        currentStudentIndex++;
        loadNextStudent();
    }

    // Matches Display
    function displayMatches() {
        const matchesList = document.getElementById('matches-list');
        matchesList.innerHTML = '';

        if (matches.length === 0) {
            matchesList.innerHTML = '<p>No matches yet. Keep swiping!</p>';
            return;
        }

        matches.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            matchCard.innerHTML = `
                <div>
                    <h4>${match.name}, ${match.age}</h4>
                    <p>${match.major} - ${match.year}</p>
                </div>
                <button onclick="startConversation(${match.id})">Message</button>
            `;
            matchesList.appendChild(matchCard);
        });
    }

    // Messages
    function displayConversations() {
        const conversationsList = document.getElementById('conversations-list');
        conversationsList.innerHTML = '';

        if (Object.keys(conversations).length === 0) {
            conversationsList.innerHTML = '<p>No conversations yet. Match with someone to start chatting!</p>';
            return;
        }

        Object.keys(conversations).forEach(studentId => {
            const student = mockStudents.find(s => s.id == studentId);
            const conversation = conversations[studentId];
            const lastMessage = conversation[conversation.length - 1];

            const conversationItem = document.createElement('div');
            conversationItem.className = 'conversation-item';
            conversationItem.onclick = () => openChat(studentId);
            conversationItem.innerHTML = `
                <h4>${student.name}</h4>
                <p>${lastMessage ? lastMessage.text : 'Start a conversation!'}</p>
            `;
            conversationsList.appendChild(conversationItem);
        });
    }

    // Start conversation
    window.startConversation = function(studentId) {
        if (!conversations[studentId]) {
            conversations[studentId] = [];
        }
        openChat(studentId);
        switchSection('messages');
    };

    // Open chat
    function openChat(studentId) {
        const student = mockStudents.find(s => s.id == studentId);
        const chatContainer = document.getElementById('chat-container');
        const chatHeader = document.getElementById('chat-header');
        const chatMessages = document.getElementById('chat-messages');

        chatHeader.innerHTML = `<h3>Chat with ${student.name}</h3>`;
        chatContainer.classList.remove('hidden');

        // Load messages
        chatMessages.innerHTML = '';
        if (conversations[studentId]) {
            conversations[studentId].forEach(message => {
                displayMessage(message);
            });
        }

        // Set up message sending
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-btn');

        sendBtn.onclick = function() {
            const text = messageInput.value.trim();
            if (text) {
                const message = {
                    text: text,
                    sender: 'user',
                    timestamp: new Date()
                };
                conversations[studentId].push(message);
                displayMessage(message);
                messageInput.value = '';

                // Mock reply
                setTimeout(() => {
                    const replies = [
                        "Hey! Nice to match with you!",
                        "What are you studying?",
                        "Want to study together sometime?",
                        "That sounds interesting!",
                        "I'm in the library right now.",
                        "What's your favorite subject?"
                    ];
                    const reply = {
                        text: replies[Math.floor(Math.random() * replies.length)],
                        sender: 'other',
                        timestamp: new Date()
                    };
                    conversations[studentId].push(reply);
                    displayMessage(reply);
                    saveConversations();
                }, 1000 + Math.random() * 2000);
            }
        };

        messageInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        };
    }

    function displayMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender === 'user' ? 'sent' : 'received'}`;
        messageDiv.textContent = message.text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Data persistence
    function saveUserData() {
        if (currentUser) {
            localStorage.setItem('campusConnect_user', JSON.stringify(currentUser));
        }
    }

    function loadUserData() {
        const saved = localStorage.getItem('campusConnect_user');
        if (saved) {
            currentUser = JSON.parse(saved);
            loadProfileData();
        }
    }

    function saveMatches() {
        localStorage.setItem('campusConnect_matches', JSON.stringify(matches));
    }

    function loadMatches() {
        const saved = localStorage.getItem('campusConnect_matches');
        if (saved) {
            matches = JSON.parse(saved);
        }
    }

    function saveConversations() {
        localStorage.setItem('campusConnect_conversations', JSON.stringify(conversations));
    }

    function loadConversations() {
        const saved = localStorage.getItem('campusConnect_conversations');
        if (saved) {
            conversations = JSON.parse(saved);
        }
    }

    // Initialize
    loadMatches();
    loadConversations();
});