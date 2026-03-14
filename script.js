// ─────────────────────────────────────────────
//  Dashboard Standard Logic
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    const main = document.getElementById('main');
    if (!main) return;

    // ── 1. Mark active Navbar tab ──
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-tabs a').forEach(link => {
        const href = link.getAttribute('href').split('#')[0];
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // ── 2. Apple-Style Reveal Animation ──
    const animatables = main.querySelectorAll('header, .sticky-banner, section, .hero-section, .stats-bar, .features-section, .events-section-wrapper, .hero, .features, .booking-container, .registration-card');

    main.classList.add('reveal-container');
    animatables.forEach(el => el.classList.add('reveal'));

    // Double-rAF ensures the browser has painted the initial opacity:0 state
    // before adding 'active', preventing the double-hop on tab navigation.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            main.classList.add('active');
        });
    });

    // ── 3. Theme toggle ──
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const themeSaved = localStorage.getItem('theme');
        if (themeSaved === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
        themeToggle.addEventListener('click', function () {
            const isLight = document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            this.textContent = isLight ? '☀️' : '🌙';
        });
    }

    // ── 4. Auth / profile system ──
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        const profileMenu = document.getElementById('profileMenu');
        const authModal = document.getElementById('authModal');
        const accountModal = document.getElementById('accountModal');
        const closeAuth = document.getElementById('closeAuth');
        const closeAccount = document.getElementById('closeAccount');
        const viewDetailsBtn = document.getElementById('viewDetailsBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const authTabBtns = document.querySelectorAll('.auth-tab-btn');
        const authForms = document.querySelectorAll('.auth-form');

        // Toggle profile menu
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (localStorage.getItem('isLoggedIn') === 'true') {
                profileMenu.classList.toggle('open');
            } else {
                authModal.classList.add('open');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (profileMenu) profileMenu.classList.remove('open');
        });

        // Auth Tabs
        authTabBtns.forEach(btn => {
            linkAuthTab(btn, authTabBtns, authForms);
        });

        // Close Modals
        if (closeAuth) closeAuth.onclick = () => authModal.classList.remove('open');
        if (closeAccount) closeAccount.onclick = () => accountModal.classList.remove('open');

        // Login Simulation
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', 'Demo User');
                localStorage.setItem('userEmail', document.getElementById('loginEmail').value);
                localStorage.setItem('memberSince', new Date().toLocaleDateString());
                location.reload();
            });
        }

        // Logout
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                localStorage.clear();
                location.reload();
            };
        }

        // View Details
        if (viewDetailsBtn) {
            viewDetailsBtn.onclick = () => {
                document.getElementById('detailsName').textContent = localStorage.getItem('userName');
                document.getElementById('detailsEmail').textContent = localStorage.getItem('userEmail');
                document.getElementById('detailsDate').textContent = localStorage.getItem('memberSince');
                accountModal.classList.add('open');
            };
        }

        // Restore Login State UI
        if (localStorage.getItem('isLoggedIn') === 'true') {
            profileBtn.innerHTML = '👤 Profile';
            const menuName = document.getElementById('profileMenuName');
            const menuEmail = document.getElementById('profileMenuEmail');
            if (menuName) menuName.textContent = localStorage.getItem('userName');
            if (menuEmail) menuEmail.textContent = localStorage.getItem('userEmail');
        }
    }
});

function linkAuthTab(btn, btns, forms) {
    btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId + 'Form').classList.add('active');
    });
}
