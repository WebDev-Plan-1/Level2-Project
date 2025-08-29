// Highlight the active link based on current URL
function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop();

    navLinkItems.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        // Add active class if href matches current path
        if (link.getAttribute('href') === currentPath || (link.getAttribute('href') === 'index.html' && currentPath === '')) {
            link.classList.add('active');
        }
    });
}

const hamburger = document.querySelector('.hamburger');
const navLinkItems = document.querySelectorAll('.nav-links .nav-link-item');
// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Toggle navigation links on hamburger click
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    setActiveNavLink();

    navLinkItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinkItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            navLinks.classList.remove('active');
            // Store the active link in localStorage
            localStorage.setItem('activeNav', item.getAttribute('href'));
        });
    });

    // Restore active link from localStorage if available
    const savedNav = localStorage.getItem('activeNav');
    if (savedNav) {
        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === savedNav) {
                link.classList.add('active');
            }
        });
    }

    // Optional: enable toggle with keyboard (Enter key)
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navLinks.classList.toggle('active');
        }
    });
});