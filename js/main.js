/* =============================================
   ########### Global Config & Data ############
============================================= */
const DATA_URL = "/data/articles.json";
let allArticles = [];

/* =============================================
   ################# Navbar ####################
============================================= */
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navLinkItems = document.querySelectorAll(".nav-links .nav-link-item");

function setActiveNavLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    navLinkItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === currentPath);
    });
}

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
AOS.init({ duration: 1200, mirror: false });

/* =============================================
   ############### Utilities ###################
============================================= */
function shuffleArray(array) {
    return array.sort(() => 0.5 - Math.random());
}

function updateURLParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, "", url);
}

function createElement(tag, classes = [], html = "") {
    const el = document.createElement(tag);
    if (classes.length) el.classList.add(...classes);
    if (html) el.innerHTML = html;
    return el;
}

/* =============================================
   ########## Home Page: Top Posts #############
============================================= */
const topPostsContainer = document.querySelector("#top-posts-container");

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

    if (typeof Swiper !== "undefined") {
        new Swiper(".mySwiper", {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3,
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

function renderCategoriesPagination(total, current, perPage, categories) {
    const paginationContainer = document.querySelector(".categories-pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = "";

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
const categoryHeader = document.querySelector(".category-header");
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");

function displayArticles(category, sortBy) {
    const normalizedCategory = category.toLowerCase();
    let filtered =
        normalizedCategory === "all"
            ? allArticles
            : allArticles.filter((a) => a.category === category);

    if (sortBy === "Latest") filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "Oldest") filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "Most Viewed") filtered.sort((a, b) => b.views - a.views);

    if (categoryHeader) {
        categoryHeader.innerHTML =
            normalizedCategory === "all"
                ? `<h2 class="section-title">All Articles</h2>
           <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">different Categories</span>.</p>`
                : `<h2 class="section-title">${category} Articles</h2>
           <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">${category}</span>.</p>`;
    }

    articlesContainer.innerHTML = "";
    if (filtered.length > 0) {
        filtered.forEach((article) => {
            const card = createElement(
                "article",
                ["post__card", "post-card"],
                `
        <img src="${article.image}" class="post-image post__image" alt="${article.title}" />
        <h3 class="post-title post__title">${article.title}</h3>
        <p class="post-excerpt post__description">${article.content}</p>
        <a href="single.html?id=${article.id}" class="read-more post__btn btn">Read More</a>
      `
            );
            articlesContainer.appendChild(card);
        });
    } else {
        articlesContainer.innerHTML = `<p class="not-found">No articles found in this category.</p>`;
    }
}

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
        const selected = categoryFilter.value;
        updateURLParam("cat", selected);
        displayArticles(selected, sortFilter.value);
    });

    sortFilter.addEventListener("change", () => {
        displayArticles(categoryFilter.value, sortFilter.value);
    });
}

/* =============================================
   ######## Initialize Per Page Features ########
============================================= */
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
async function fetchArticles() {
    try {
        const res = await fetch(DATA_URL);
        allArticles = await res.json();
        initPageFeatures();
    } catch (err) {
        console.error("Error fetching articles:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    fetchArticles();
});
/* =============================================
   ############# End of Main JS ################
============================================= */