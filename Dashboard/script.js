// Menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

menuToggle.addEventListener('click', function() {
    sidebar.classList.toggle('show');
    menuToggle.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('show');
            menuToggle.classList.remove('active');
        }
    }
});

// Highlight active page in sidebar
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
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