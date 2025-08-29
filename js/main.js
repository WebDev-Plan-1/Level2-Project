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

    navLinkItems.forEach((link) => {
        // Remove active class from all links
        link.classList.remove("active");
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
        // toggleNavScroll();
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

/* ============================================= */
// Category Page Script
// -----------------------------
// Handles loading articles, filtering, and sorting for category.html
// -----------------------------

// 1. Select the container where articles will be displayed
const articlesContainer = document.querySelector(".articles-list .posts");

// 2. Select the filter dropdown for category switching
const categoryFilter = document.querySelector("#category-filter");

// 3. Select the sorting dropdown
const sortFilter = document.querySelector("#sort-filter");

// 4. Store articles data globally after loading JSON
let allArticles = [];

// 5. Load articles from JSON file when page loads
fetch("/js/articles.json")
    .then((response) => response.json()) // Convert JSON file to JS object
    .then((data) => {
        allArticles = data; // Save articles in global variable

        // Get category name from URL (example: category.html?category=Technology)
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCategory = urlParams.get("category");

        // Show articles (filtered if category provided)
        displayArticles(selectedCategory || "All");
    }).catch((error) => console.error("Error loading articles:", error));

// -----------------------------
// Function: Display articles in the DOM
// -----------------------------
function displayArticles(category, sortOption = "Latest") {
    // Step 1: Filter articles by category
    let filteredArticles =
        category === "All" || !category
            ? allArticles
            : allArticles.filter((article) => article.category === category);

    // Step 2: Sort articles based on sortOption
    if (sortOption === "Latest") {
        filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "Oldest") {
        filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === "Most Viewed") {
        filteredArticles.sort((a, b) => b.views - a.views);
    }

    // Step 3: Clear old articles before rendering
    articlesContainer.innerHTML = "";

    // Step 4: Render each article dynamically
    filteredArticles.forEach((article) => {
        const card = document.createElement("article");
        card.classList.add("post__card", "post-card");

        card.innerHTML = `
      <img src="${article.image}" class="post-image post__image" alt="${article.title}">
      <h3 class="post-title post__title">${article.title}</h3>
      <p class="post-excerpt post__description">${article.content.substring(0, 120)}...</p>
      <a href="single.html?id=${article.id}" class="read-more post__btn btn">Read More</a>
    `;

        articlesContainer.appendChild(card);
    });
}

// -----------------------------
// Event: Change category filter
// -----------------------------
if (categoryFilter) {
    categoryFilter.addEventListener("change", (e) => {
        const selectedCategory = e.target.value;
        const sortOption = sortFilter ? sortFilter.value : "Latest";
        displayArticles(selectedCategory, sortOption);
    });
}

// -----------------------------
// Event: Change sort filter
// -----------------------------
if (sortFilter) {
    sortFilter.addEventListener("change", (e) => {
        const selectedCategory = categoryFilter ? categoryFilter.value : "All";
        const sortOption = e.target.value;
        displayArticles(selectedCategory, sortOption);
    });
}
