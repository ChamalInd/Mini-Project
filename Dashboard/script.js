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
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
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