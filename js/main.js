/* ============================================= */
/* ############### Navbar Script ################ */
/* ============================================= */

// Highlight the active nav link
function setActiveNavLink() {
    const currentPath = window.location.pathname.split("/").pop();
    navLinkItems.forEach((link) => {
        link.classList.remove("active");
        if (
            link.getAttribute("href") === currentPath ||
            (link.getAttribute("href") === "index.html" && currentPath === "")
        ) {
            link.classList.add("active");
        }
    });
}

// Toggle nav scroll lock for small screens
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

// Navbar DOM elements
const hamburger = document.querySelector(".hamburger");
const navLinkItems = document.querySelectorAll(".nav-links .nav-link-item");
const navLinks = document.querySelector(".nav-links");

// Navbar events
document.addEventListener("DOMContentLoaded", () => {
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            toggleNavScroll();
        });
        hamburger.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navLinks.classList.toggle("active");
            }
        });
    }

    window.addEventListener("resize", toggleNavScroll);

    setActiveNavLink();

    navLinkItems.forEach((item) => {
        item.addEventListener("click", () => {
            navLinkItems.forEach((i) => i.classList.remove("active"));
            item.classList.add("active");
            navLinks.classList.remove("active");
            localStorage.setItem("activeNav", item.getAttribute("href"));
            toggleNavScroll();
        });
    });

    const savedNav = localStorage.getItem("activeNav");
    if (savedNav) {
        navLinkItems.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === savedNav) {
                link.classList.add("active");
            }
        });
    }
});

/* ============================================= */
/* ############### Initialize AOS ############### */
/* ============================================= */
AOS.init({
    duration: 1200,
    mirror: false,
});

/* ============================================= */
/* ######## Global Data: Fetch Articles ######## */
/* ============================================= */

const dataUrl = "/js/articles.json";
let allArticles = [];

async function fetchArticles() {
    try {
        const response = await fetch(dataUrl);
        allArticles = await response.json();
        initPageFeatures(); // Once data is ready
    } catch (error) {
        console.error("Error fetching articles:", error);
    }
}

/* ============================================= */
/* ######## Home Page Functions (index.html) #### */
/* ============================================= */

const topPostsContainer = document.querySelector("#top-posts-container");
const categoriesContainer = document.querySelector(".categories-overview .categories-list");

// Show 6 random posts from top viewed
function displayTopPosts() {
    if (!topPostsContainer) return;

    let sorted = [...allArticles].sort((a, b) => b.views - a.views);
    let topCandidates = sorted.slice(0, 10);
    let shuffled = topCandidates.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 6);

    topPostsContainer.innerHTML = "";

    selected.forEach(article => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `
          <article class="post-card post__card">
            <img src="${article.image}" alt="${article.title}" class="post-image post__image" />
            <h3 class="post-title post__title">${article.title}</h3>
            <p class="post-excerpt post__description">${article.content.substring(0, 100)}...</p>
            <a href="single.html?id=${article.id}" class="read-more post__btn">Read More</a>
          </article>
        `;
        topPostsContainer.appendChild(slide);
    });

    if (typeof Swiper !== "undefined") {
        new Swiper(".mySwiper", {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                // type: "bullets"         // Default Bullets
                // type: "fraction",        // Shows Pagination as 1/16
                // type: "progressbar"  // Shows Pagination as a progress bar
                dynamicBullets: true,    //  Makes bullets larger based on active slide
                dynamicMainBullets: 3,   //  Number of larger bullets to show
            },
            breakpoints: {
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    } else {
        console.error("Swiper is not loaded. Please check script includes.");
    }
}

// Show distinct categories dynamically with pagination
function displayCategories(perPage = 7) {
    if (!categoriesContainer) return;

    let categories = [...new Set(allArticles.map(article => article.category))];
    let currentPage = 1;
    const totalPages = Math.ceil(categories.length / perPage);

    // Render categories for specific page
    function renderPage(page) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedCats = categories.slice(start, end);

        categoriesContainer.innerHTML = "";

        paginatedCats.forEach(cat => {
            const li = document.createElement("li");
            li.classList.add("category-item");
            li.setAttribute("data-aos", "fade-right");
            li.setAttribute("data-aos-duration", "1000");
            li.innerHTML = `<a href="category.html?cat=${cat}" class="category-link">${cat}</a>`;
            categoriesContainer.appendChild(li);
        });

        renderPaginationControls(totalPages, page);
    }

    // Render pagination buttons with ellipsis
    function renderPaginationControls(total, current) {
        const paginationContainer = document.querySelector(".categories-pagination");
        if (!paginationContainer) return;

        paginationContainer.innerHTML = "";

        // Helper: Create button
        function createBtn(label, page, isActive = false, isDisabled = false) {
            const btn = document.createElement("button");
            btn.textContent = label;
            btn.classList.add("pagination-btn");

            if (isActive) btn.classList.add("active");
            if (isDisabled) btn.disabled = true;

            if (!isDisabled && !isActive) {
                btn.addEventListener("click", () => {
                    renderPage(page);
                });
            }

            paginationContainer.appendChild(btn);
        }

        // Always show first page
        if (current > 1) createBtn("«", current - 1); // Prev button
        createBtn("1", 1, current === 1);

        // Ellipsis before current range
        if (current > 3) {
            const dots = document.createElement("span");
            dots.textContent = "...";
            dots.classList.add("pagination-dots");
            paginationContainer.appendChild(dots);
        }

        // Pages around current
        for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
            createBtn(i, i, current === i);
        }

        // Ellipsis after current range
        if (current < total - 2) {
            const dots = document.createElement("span");
            dots.textContent = "...";
            dots.classList.add("pagination-dots");
            paginationContainer.appendChild(dots);
        }

        // Always show last page
        if (total > 1) createBtn(total, total, current === total);
        if (current < total) createBtn("»", current + 1); // Next button
    }


    // First render
    renderPage(currentPage);
}

/* ============================================= */
/* ######## Category Page Functions ############ */
/* ============================================= */

const articlesContainer = document.querySelector(".articles-list .posts");
const categoryHeader = document.querySelector(".category-header");
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");

// Init category page
function initCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("cat");

    if (categoryParam) {
        categoryFilter.value = categoryParam;
        displayArticles(categoryParam, sortFilter.value);
    } else {
        displayArticles("All", sortFilter.value);
    }

    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;
        updateURL(selectedCategory);
        displayArticles(selectedCategory, sortFilter.value);
    });

    sortFilter.addEventListener("change", () => {
        displayArticles(categoryFilter.value, sortFilter.value);
    });
}

// Render articles
function displayArticles(category, sortBy) {
    const normalizedCategory = category.toLowerCase();

    let filteredArticles =
        normalizedCategory === "all"
            ? allArticles
            : allArticles.filter(article => article.category === category);

    // Sort
    if (sortBy === "Latest") {
        filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "Oldest") {
        filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "Most Viewed") {
        filteredArticles.sort((a, b) => b.views - a.views);
    }

    // Update header
    if (categoryHeader) {
        categoryHeader.innerHTML =
            normalizedCategory === "all"
                ? `
          <h2 class="section-title">All Articles</h2>
          <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">different Categories</span>.</p>`
                : `
          <h2 class="section-title">${category} Articles</h2>
          <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">${category}</span>.</p>`;
    }

    // Render
    articlesContainer.innerHTML = "";
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

// Update URL param
function updateURL(category) {
    const url = new URL(window.location);
    url.searchParams.set("cat", category);
    window.history.pushState({}, "", url);
}

// Populate category filter dynamically
function populateCategoryFilter() {
    if (!categoryFilter) return;

    let categories = [...new Set(allArticles.map(article => article.category))];
    categoryFilter.innerHTML = `<option value="All">All</option>`;

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

/* ============================================= */
/* ######## Initialize Features Per Page ######## */
/* ============================================= */

function initPageFeatures() {
    if (topPostsContainer) displayTopPosts();
    if (categoriesContainer) displayCategories();
    if (articlesContainer) {
        populateCategoryFilter();
        initCategoryPage();
    }
}

/* ============================================= */
/* ######## Run Fetch on Page Load ############## */
/* ============================================= */
fetchArticles();

/* ============================================= */
/* ################# End Script ################# */
/* ============================================= */