// Variables Start Here
// Select DOM elements
const hamburger = document.querySelector(".hamburger");
const navLinkItems = document.querySelectorAll(".nav-links .nav-link-item");
const navLinks = document.querySelector(".nav-links");
/* ============================================= */

// Functions Start Here
// Highlight the active link based on current URL
function setActiveNavLink() {
    const currentPath = window.location.pathname.split("/").pop();
    // console.log("Current Path:", currentPath); // Debugging line

    navLinkItems.forEach((link) => {
        // Remove active class from all links
        link.classList.remove("active");
        // console.log("Current Link:", link.getAttribute("href")); // Debugging line
        // Add active class if href matches current path
        if (
            link.getAttribute("href") === currentPath ||
            (link.getAttribute("href") === "index.html" && currentPath === "")
        ) {
            link.classList.add("active");
        }
    });
}

// Toggle body scroll based on nav state and screen width
function toggleNavScroll() {
    if (navLinks.classList.contains("active") && window.innerWidth <= 240) {
        // document.body.scroll = 'no';
        document.body.style.overflow = "hidden";
        navLinks.style.overflowY = "scroll";
        navLinks.style.maxHeight = "80vh";
    } else {
        // document.body.scroll = 'yes';
        document.body.style.overflow = "";
        navLinks.style.overflowY = "";
        navLinks.style.maxHeight = "";
    }
}
/* ============================================= */

// Event Listeners Start Here
// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Toggle navigation links on hamburger click
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        toggleNavScroll();
    });

    // Adjust scroll behavior on window resize
    window.addEventListener("resize", toggleNavScroll);

    setActiveNavLink();

    navLinkItems.forEach((item) => {
        item.addEventListener("click", () => {
            navLinkItems.forEach((i) => i.classList.remove("active"));
            item.classList.add("active");
            navLinks.classList.remove("active");
            // Store the active link in localStorage
            localStorage.setItem("activeNav", item.getAttribute("href"));
            toggleNavScroll();
        });
    });

    // Restore active link from localStorage if available
    const savedNav = localStorage.getItem("activeNav");
    if (savedNav) {
        navLinkItems.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === savedNav) {
                link.classList.add("active");
            }
        });
    }

    // Optional: enable toggle with keyboard (Enter key)
    hamburger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navLinks.classList.toggle("active");
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

// ================================
// Category Page Script (main.js)
// ================================

// Path to articles data JSON file
const dataUrl = "/js/articles.json";

// Select DOM elements
const articlesContainer = document.querySelector(".articles-list .posts");
const categoryHeader = document.querySelector(".category-header"); // Section header (title)
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");

// Global variable to store all articles
let allArticles = [];

// -------------------------------
// 1. Fetch Articles from JSON File
// -------------------------------
async function fetchArticles() {
    try {
        const response = await fetch(dataUrl); // Load JSON file
        allArticles = await response.json();   // Convert response to JS object
        initCategoryPage(); // Initialize page once data is ready
    } catch (error) {
        console.error("Error fetching articles:", error);
    }
}

// -------------------------------
// 2. Initialize Category Page
// -------------------------------
function initCategoryPage() {
    // Get category from URL parameter (?cat=Technology)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("cat");

    // If a category is in URL, set filter to it, otherwise default "All"
    if (categoryParam) {
        categoryFilter.value = categoryParam;
        displayArticles(categoryParam, sortFilter.value);
    } else {
        displayArticles("All", sortFilter.value);
    }

    // Event: Change category filter
    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;
        updateURL(selectedCategory); // <-- Update URL
        displayArticles(selectedCategory, sortFilter.value);
    });

    // Event: Change sort filter
    sortFilter.addEventListener("change", () => {
        displayArticles(categoryFilter.value, sortFilter.value);
    });
}

// -------------------------------
// 3. Display Articles by Filter + Sort
// -------------------------------
function displayArticles(category, sortBy) {
    // Normalize category value (make "All" case-insensitive)
    const normalizedCategory = category.toLowerCase();

    // 1. Filter by category
    let filteredArticles =
        normalizedCategory === "all"
            ? allArticles
            : allArticles.filter(article => article.category === category);

    // 2. Sort articles based on selected option
    if (sortBy === "Latest") {
        filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "Oldest") {
        filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "Most Viewed") {
        filteredArticles.sort((a, b) => b.views - a.views);
    }

    // 3. Update category header text dynamically
    if (categoryHeader) {
        categoryHeader.textContent =
            normalizedCategory === "all"
                ? "All Articles"
                : `${category} Articles`;

        categoryHeader.innerHTML = normalizedCategory === "all"
            ? `
        <h2 class="section-title">All Articles</h2>
        <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">different Categories</span>.</p>`
            : `
        <h2 class="section-title">${category} Articles</h2>
        <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">${category}</span>.</p>
      `;

    }

    // 4. Clear container before adding new posts
    articlesContainer.innerHTML = "";

    // 5. Render each article as a card
    if (filteredArticles.length > 0) {
        filteredArticles.forEach(article => {
            const card = document.createElement("article");
            card.classList.add("post__card", "post-card");

            card.innerHTML = `
        <img src="${article.image}" class="post-image post__image" alt="${article.title}" />
        <h3 class="post-title post__title">${article.title}</h3>
        <p class="post-excerpt post__description">${article.content}</p>
        <a href="single.html?id=${article.id}" class="read-more post__btn btn">Read More</a>
      `;

            articlesContainer.appendChild(card);
        });
    } else {
        articlesContainer.innerHTML = `<p class="not-found">No articles found in this category.</p>`;
    }
}

// -------------------------------
// 4. Update URL Without Reload
// -------------------------------
function updateURL(category) {
    const url = new URL(window.location);
    url.searchParams.set("cat", category);
    window.history.pushState({}, "", url); // Update URL without reload
}

// -------------------------------
// 5. Run Fetch on Page Load
// -------------------------------
if (document.body.contains(articlesContainer)) {
    fetchArticles();
}
// ================================
