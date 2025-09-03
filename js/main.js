/* =============================================
   ########### Global Config & Data ############
============================================= */
// URL to fetch articles data
const DATA_URL = "data/articles.json";
let allArticles = [];

/* =============================================
   ################# Navbar ####################
============================================= */
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navLinkItems = document.querySelectorAll(".nav-links .nav-link-item");

// Set active nav link based on current URL
function setActiveNavLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    navLinkItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === currentPath);
    });
}

// Handle scroll behavior for nav links on small screens
function toggleNavScroll() {
    if (navLinks.classList.contains("active") && window.innerWidth <= 240) {
        document.body.style.overflow = "hidden";
        navLinks.style.overflowY = "scroll";
        navLinks.style.maxHeight = "80vh";
    } else {
        document.body.style.overflow = "";
        navLinks.style.overflowY = "";
        navLinks.style.maxHeight = "";
    }
}

// Initialize Navbar functionality
// including hamburger toggle and active link highlighting
// and preserving active state across reloads
// and responsive scroll handling
// and keyboard accessibility
// and localStorage usage
function initNavbar() {
    if (!hamburger) return;

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        toggleNavScroll();
    });

    hamburger.addEventListener("keydown", (e) => {
        if (["Enter", " "].includes(e.key)) {
            e.preventDefault();
            navLinks.classList.toggle("active");
        }
    });

    navLinkItems.forEach((item) =>
        item.addEventListener("click", () => {
            navLinkItems.forEach((i) => i.classList.remove("active"));
            item.classList.add("active");
            navLinks.classList.remove("active");
            localStorage.setItem("activeNav", item.getAttribute("href"));
            toggleNavScroll();
        })
    );

    const savedNav = localStorage.getItem("activeNav");
    if (savedNav) {
        navLinkItems.forEach((link) =>
            link.classList.toggle("active", link.getAttribute("href") === savedNav)
        );
    }

    window.addEventListener("resize", toggleNavScroll);
    setActiveNavLink();
}

/* =============================================
   ############### Initialize AOS ##############
============================================= */
// Initialize AOS (Animate On Scroll) library
AOS.init({ duration: 1200, mirror: false });

/* =============================================
   ############### Utilities ###################
============================================= */

// Shuffle an array randomly
function shuffleArray(array) {
    return array.sort(() => 0.5 - Math.random());
}

// Update URL parameters without reloading the page
function updateURLParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, "", url);
}

// Create an element with optional classes and inner HTML
function createElement(tag, classes = [], html = "") {
    const el = document.createElement(tag);
    if (classes.length) el.classList.add(...classes);
    if (html) el.innerHTML = html;
    return el;
}

// Format large numbers into readable strings (e.g., 1.2K, 3.4M)
function formatViews(num) {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        return num.toString();
    }
}

// Format date strings into a more readable format
// Example: "2025-01-05" -> "January 5, 2025"
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}


/* =============================================
   ########## Home Page: Top Posts #############
============================================= */
const topPostsContainer = document.querySelector("#top-posts-container");

// Display top posts in a Swiper carousel
// Select top 10 by views, shuffle, and show 6
function displayTopPosts() {
    if (!topPostsContainer) return;

    const selected = shuffleArray(
        [...allArticles].sort((a, b) => b.views - a.views).slice(0, 10)
    ).slice(0, 6);

    topPostsContainer.innerHTML = "";
    selected.forEach((article) => {
        const slide = createElement(
            "div",
            ["swiper-slide"],
            `
      <article class="post-card post__card">
        <img src="${article.image}" alt="${article.title}" class="post-image post__image" />
        <h3 class="post-title post__title">${article.title}</h3>
        <p class="post-excerpt post__description">${article.content.substring(0, 100)}...</p>
        <a href="single.html?id=${article.id}" class="read-more post__btn">Read More</a>
      </article>`
        );
        topPostsContainer.appendChild(slide);
    });

    // Initialize Swiper carousel
    // Check if Swiper is loaded
    if (typeof Swiper !== "undefined") {
        new Swiper(".mySwiper", {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                // type: "bullets",         // Default is 'bullets'
                // type: "fraction",        // fraction pagination 3/16
                dynamicBullets: true,       // dynamic bullets size
                dynamicMainBullets: 3,      // show 3 main bullets
            },
            breakpoints: {
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
        });
    } else {
        console.error("Swiper is not loaded.");
    }
}

/* =============================================
   ######### Home Page: Categories #############
============================================= */
const categoriesContainer = document.querySelector(
    ".categories-overview .categories-list"
);

// Display categories with pagination
// 7 categories per page
function renderCategoriesPage(categories, page, perPage) {
    const start = (page - 1) * perPage;
    const paginatedCats = categories.slice(start, start + perPage);

    categoriesContainer.innerHTML = "";
    paginatedCats.forEach((cat) => {
        const li = createElement(
            "li",
            ["category-item"],
            `<a href="category.html?cat=${cat}" class="category-link">${cat}</a>`
        );
        li.setAttribute("data-aos", "fade-right");
        li.setAttribute("data-aos-duration", "1000");
        categoriesContainer.appendChild(li);
    });
}

// Render pagination controls for categories
// with ellipses for large page sets, and previous/next buttons
function renderCategoriesPagination(total, current, perPage, categories) {
    const paginationContainer = document.querySelector(".categories-pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";

    // Helper to create pagination buttons
    // with active and disabled states
    function createBtn(label, page, isActive = false, isDisabled = false) {
        const btn = createElement("button", ["pagination-btn"], label);
        if (isActive) btn.classList.add("active");
        if (isDisabled) btn.disabled = true;
        if (!isDisabled && !isActive) {
            btn.addEventListener("click", () => {
                renderCategoriesPage(categories, page, perPage);
                renderCategoriesPagination(total, page, perPage, categories);
            });
        }
        paginationContainer.appendChild(btn);
    }

    if (current > 1) createBtn("«", current - 1);
    createBtn("1", 1, current === 1);

    if (current > 3) paginationContainer.appendChild(createElement("span", ["pagination-dots"], "..."));

    for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
        createBtn(i, i, current === i);
    }

    if (current < total - 2) paginationContainer.appendChild(createElement("span", ["pagination-dots"], "..."));

    if (total > 1) createBtn(total, total, current === total);
    if (current < total) createBtn("»", current + 1);
}

// Main function to display categories with pagination
// 7 categories per page
function displayCategories(perPage = 7) {
    if (!categoriesContainer) return;
    const categories = [...new Set(allArticles.map((a) => a.category))];
    const totalPages = Math.ceil(categories.length / perPage);
    const currentPage = 1;

    renderCategoriesPage(categories, currentPage, perPage);
    renderCategoriesPagination(totalPages, currentPage, perPage, categories);
}

/* =============================================
   ########## Category Page Articles ############
============================================= */
const articlesContainer = document.querySelector(".articles-list .posts");
const postsPaginationContainer = document.querySelector(".posts-pagination");
const categoryHeader = document.querySelector(".category-header");
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");
// Pagination state
let currentPage = 1;
const perPage = 6;

// Main display function with pagination
function displayArticles(category, sortBy) {
    const normalizedCategory = category.toLowerCase();
    let filtered =
        normalizedCategory === "all"
            ? allArticles
            : allArticles.filter((a) => a.category === category);

    // Sorting
    if (sortBy === "Latest") filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "Oldest") filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "Most Viewed") filtered.sort((a, b) => b.views - a.views);

    // Update category header
    if (categoryHeader) {
        categoryHeader.innerHTML =
            normalizedCategory === "all"
                ? `<h2 class="section-title">All Articles</h2>
                   <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">different Categories</span>.</p>`
                : `<h2 class="section-title">${category} Articles</h2>
                   <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">${category}</span>.</p>`;
    }

    // Handle no results
    if (filtered.length === 0) {
        articlesContainer.innerHTML = `<p class="not-found">No articles found in this category.</p>`;
        postsPaginationContainer.innerHTML = "";
        return;
    }

    // Pagination: calculate slice
    const totalPages = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const paginatedArticles = filtered.slice(start, end);

    // Render articles
    articlesContainer.innerHTML = "";
    paginatedArticles.forEach((article) => {
        const card = createElement(
            "article",
            ["post__card", "post-card"],
            `
            <img src="${article.image}" class="post-image post__image" alt="${article.title}" />
            <h3 class="post-title post__title">${article.title}</h3>
            <p class="post-category">#${article.category}</p>
            <p class="post-excerpt post__description">${article.content}</p>
            <p class="post-info">
                <span class="post-views"><i class="fa-solid fa-eye"></i> ${formatViews(article.views)}</span>
                <span class="post-date">${formatDate(article.date)}</span>
            </p>
            <a href="single.html?id=${article.id}" class="read-more post__btn btn">Read More</a>
        `
        );
        articlesContainer.appendChild(card);
    });

    // Render pagination bullets
    renderPostsPaginationButtons(totalPages, category, sortBy);
}

// Render pagination bullets for articles
// with active state and click handlers
// Called from displayArticles
function renderPostsPaginationButtons(totalPages, category, sortBy) {
    postsPaginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const bullet = document.createElement("button");
        bullet.classList.add("post-page-bullet");
        if (i === currentPage) bullet.classList.add("active");
        bullet.innerText = i;

        bullet.addEventListener("click", () => {
            currentPage = i;
            displayArticles(category, sortBy);
        });

        postsPaginationContainer.appendChild(bullet);
    }
}


// Populate category filter dropdown with unique categories
// Add "All" option at the top
// Called during category page initialization
function populateCategoryFilter() {
    if (!categoryFilter) return;
    const categories = [...new Set(allArticles.map((a) => a.category))];
    categoryFilter.innerHTML = `<option value="All">All</option>`;
    categories.forEach((cat) => {
        const option = createElement("option", [], cat);
        option.value = cat;
        categoryFilter.appendChild(option);
    });
}

// Initialize category page functionality
// Read category from URL parameters and set filters
// Add event listeners for category and sort filters
// Update URL parameters on category change
function initCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get("cat");

    if (catParam) {
        categoryFilter.value = catParam;
        displayArticles(catParam, sortFilter.value);
    } else {
        displayArticles("All", sortFilter.value);
    }

    categoryFilter.addEventListener("change", () => {
        currentPage = 1; // ✅ reset pagination
        const selected = categoryFilter.value;
        updateURLParam("cat", selected);
        displayArticles(selected, sortFilter.value);
    });

    sortFilter.addEventListener("change", () => {
        currentPage = 1; // ✅ reset pagination
        displayArticles(categoryFilter.value, sortFilter.value);
    });
}

/* =============================================
   ######## Initialize Per Page Features ########
============================================= */
// Initialize features based on page context
// Home page: top posts and categories
// Category page: category filter and articles
// Called after fetching articles data
function initPageFeatures() {
    if (topPostsContainer) displayTopPosts();
    if (categoriesContainer) displayCategories();
    if (articlesContainer) {
        populateCategoryFilter();
        initCategoryPage();
    }
}

/* =============================================
   ################ Init App ###################
============================================= */
// Fetch articles data and initialize page features
// Handle fetch errors gracefully
async function fetchArticles() {
    try {
        const res = await fetch(DATA_URL);
        allArticles = await res.json();
        initPageFeatures();
    } catch (err) {
        console.error("Error fetching articles:", err);
    }
}

// Initialize navbar and fetch articles on DOMContentLoaded
// Ensures all DOM elements are ready before manipulation
document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    fetchArticles();
});
/* =============================================
   ############# End of Main JS ################
============================================= */