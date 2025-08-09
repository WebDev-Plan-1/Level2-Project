
// Toggle navigation menu on mobile
// This script toggles the visibility of the navigation links when the hamburger icon is clicked
// It also allows toggling with the keyboard for accessibility
// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.nav-links .hamburger');
    const navLinks = document.querySelector('.nav-links ul');

    // Toggle the 'active' class on the nav links when the hamburger is clicked
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Optional: enable toggle with keyboard (Enter key)
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navLinks.classList.toggle('active');
        }
    });
});