
// Variables Start Here
// Select DOM elements
const hamburger = document.querySelector('.hamburger');
const navLinkItems = document.querySelectorAll('.nav-links .nav-link-item');
const navLinks = document.querySelector('.nav-links');
/* ============================================= */

// Functions Start Here
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

// Toggle body scroll based on nav state and screen width
function toggleNavScroll() {
    if (navLinks.classList.contains('active') && window.innerWidth <= 240) {
        // document.body.scroll = 'no';
        document.body.style.overflow = 'hidden';
        navLinks.style.overflowY = 'scroll';
        navLinks.style.maxHeight = '80vh';
    } else {
        // document.body.scroll = 'yes';
        document.body.style.overflow = '';
        navLinks.style.overflowY = '';
        navLinks.style.maxHeight = '';
    }
}
/* ============================================= */

// Event Listeners Start Here
// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Toggle navigation links on hamburger click
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // toggleNavScroll();
    });

    // Adjust scroll behavior on window resize
    window.addEventListener('resize', toggleNavScroll);

    setActiveNavLink();

    navLinkItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinkItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            navLinks.classList.remove('active');
            // Store the active link in localStorage
            localStorage.setItem('activeNav', item.getAttribute('href'));
            toggleNavScroll();
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

/* ============================================= */
// Initialize AOS (Animate On Scroll)

AOS.init({
    duration: 1200, // Animation duration in milliseconds
    //once: true, // Whether animation should happen only once
    mirror: false, // Whether elements should animate when scrolled past
});

/* ============================================= */