// Menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

menuToggle.addEventListener('click', function() {
    const isOpen = sidebar.classList.toggle('show');
    menuToggle.classList.toggle('active');
    // shift main content to align with sidebar
    main.style.marginLeft = isOpen ? '250px' : '0';
    // remember state
    localStorage.setItem('sidebarOpen', isOpen);
});

// Close sidebar when clicking outside on mobile (and update alignment/state)
document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('show');
            menuToggle.classList.remove('active');
            main.style.marginLeft = '0';
            localStorage.setItem('sidebarOpen', false);
        }
    }
});

// Highlight active page in sidebar
// also restore sidebar state from previous visit
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    sidebarLinks.forEach(link => {
        // mark active link
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
        // prevent reload if clicking the same page link repeatedly
        link.addEventListener('click', function(e) {
            if (link.getAttribute('href') === currentPage) {
                e.preventDefault();
            }
        });
    });

    // restore open/closed status
    const saved = localStorage.getItem('sidebarOpen');
    if (saved === 'true') {
        sidebar.classList.add('show');
        menuToggle.classList.add('active');
        main.style.marginLeft = '250px';
    } else {
        // ensure alignment
        main.style.marginLeft = '0';
    }

    // theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const themeSaved = localStorage.getItem('theme');
        if (themeSaved === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.textContent = '☀️ Light Mode';
        }
        themeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('light-theme')) {
                document.body.classList.remove('light-theme');
                localStorage.setItem('theme', 'dark');
                this.textContent = '🌙 Dark Mode';
            } else {
                document.body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
                this.textContent = '☀️ Light Mode';
            }
        });
    }
});

// Add fade-in animation for sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Trigger animation after a short delay
    setTimeout(() => {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }, 100);
});

// Add hover effects for cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.news-item, .portal-item, .resource-item, .stress-item, .overview-item');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// button functionality wrapped in DOMContentLoaded
// also attach sticky-banner behavior
document.addEventListener('DOMContentLoaded', function() {
        const logoutBtn = document.getElementById('logoutBtn');
        const profileBtn = document.getElementById('profileBtn');
        const profileMenu = document.getElementById('profileMenu');
        const authModal = document.getElementById('authModal');
        const accountModal = document.getElementById('accountModal');
        const closeAuth = document.getElementById('closeAuth');
        const closeAccount = document.getElementById('closeAccount');
        const viewDetailsBtn = document.getElementById('viewDetailsBtn');
        const logoutOption = document.getElementById('logoutBtn');
        const authTabBtns = document.querySelectorAll('.auth-tab-btn');
        const authForms = document.querySelectorAll('.auth-form');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        // Only initialize auth/profile system if on home page (where elements exist)
        if (!profileBtn) {
            return; // Exit if profile button doesn't exist
        }
        const headerEl = document.querySelector('header');
        const firstSection = document.querySelector('main section');
        if (headerEl && firstSection) {
            const title = firstSection.querySelector('h2');
            if (title) {
                const wrapper = document.createElement('div');
                wrapper.className = 'sticky-banner';
                headerEl.parentNode.insertBefore(wrapper, headerEl);
                wrapper.appendChild(headerEl);
                wrapper.appendChild(title);
            }
        }

        // Check if user is already logged in
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            profileBtn.textContent = `👤 ${user.name}`;
            updateProfileMenu(user);
        }

        // Update profile menu with user info
        function updateProfileMenu(user) {
            document.getElementById('profileMenuName').textContent = user.name;
            document.getElementById('profileMenuEmail').textContent = user.email;
        }

        // Profile button click - toggle menu or open auth modal
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (loggedInUser) {
                // Show profile menu if logged in
                profileMenu.classList.toggle('open');
            } else {
                // Show auth modal if not logged in
                authModal.classList.add('open');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!profileMenu.contains(event.target) && event.target !== profileBtn) {
                profileMenu.classList.remove('open');
            }
        });

        // View account details
        viewDetailsBtn.addEventListener('click', function() {
            const user = JSON.parse(localStorage.getItem('loggedInUser'));
            document.getElementById('detailsName').textContent = user.name;
            document.getElementById('detailsEmail').textContent = user.email;
            document.getElementById('detailsDate').textContent = new Date().toLocaleDateString();
            profileMenu.classList.remove('open');
            accountModal.classList.add('open');
        });

        // Logout from menu
        logoutOption.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('loggedInUser');
                profileBtn.textContent = '👤 Login';
                profileMenu.classList.remove('open');
                location.reload();
            }
        });

        // Close auth modal
        closeAuth.addEventListener('click', function() {
            authModal.classList.remove('open');
        });

        // Close account modal
        closeAccount.addEventListener('click', function() {
            accountModal.classList.remove('open');
        });

        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === authModal) {
                authModal.classList.remove('open');
            }
            if (event.target === accountModal) {
                accountModal.classList.remove('open');
            }
        });

        // Tab switching
        authTabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all tabs and forms
                authTabBtns.forEach(b => b.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));

                // Add active class to clicked tab
                this.classList.add('active');
                const tabName = this.getAttribute('data-tab');
                document.getElementById(tabName + 'Form').classList.add('active');
            });
        });

        // Login form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Get all registered users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Login successful
                localStorage.setItem('loggedInUser', JSON.stringify({ name: user.name, email: user.email }));
                profileBtn.textContent = `👤 ${user.name}`;
                updateProfileMenu(user);
                authModal.classList.remove('open');
                loginForm.reset();
                alert('Login successful!');
            } else {
                alert('Invalid email or password');
            }
        });

        // Signup form submission
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirm').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // Get existing users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

            // Check if email already exists
            if (users.find(u => u.email === email)) {
                alert('Email already registered');
                return;
            }

            // Add new user
            users.push({ name, email, password });
            localStorage.setItem('registeredUsers', JSON.stringify(users));

            // Auto login
            localStorage.setItem('loggedInUser', JSON.stringify({ name, email }));
            profileBtn.textContent = `👤 ${name}`;
            updateProfileMenu({ name, email });
            authModal.classList.remove('open');
            signupForm.reset();
            alert('Account created successfully!');
        });
    });

// FAQ accordion toggle
document.addEventListener('DOMContentLoaded', function() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(btn => {
        btn.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.classList.toggle('open');
            // optionally close others
            if (isOpen) {
                questions.forEach(other => {
                    if (other !== this) {
                        other.nextElementSibling.classList.remove('open');
                    }
                });
            }
        });
    });
});

