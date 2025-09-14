/* =============================================
   ########### Import Utils ############
============================================= */
import {
  shuffleArray,
  createElement,
  formatViews,
  formatDate,
  notFoundMessage,
  removeSwiperControls,
  handleFailFetch,
  initNavbar,
  updateURLParams,
  scrollToArticlesTop,
  lazyLoading,
  AOSInit,
  renderPagination,
  populateCategoryFilter,
  loaderInit,
} from "./utils.js";
//==== Import theme
import { initTheme } from "./theme.js";
// =========== Import Utils Constants =======================
import {
  DATA_URL,
  topPostsContainer,
  postsPaginationContainer,
  categoriesContainer,
  articlesContainer,
  categoryFilter,
  categoryHeader,
  sortFilter,
} from "./utils.js";

/* =============================================
   ########### Global Config & Data ############
============================================= */
let allArticles = [];

/* =============================================
   ############### Initialize AOS ##############
============================================= */
AOSInit();

/* =============================================
   ############### Initialize Lazy Loading Images ##############
============================================= */
lazyLoading();

/* =============================================
   ################# Page Loader Init ####################
============================================= */
loaderInit();
/* =============================================
   ########## Home Page: Top Posts Section #############
============================================= */

// Display top posts in a Swiper carousel
// Select top 10 by views, shuffle, and show 6
function displayTopPosts() {
  if (!topPostsContainer) return;

  const selected = shuffleArray(
    [...allArticles].sort((a, b) => b.views - a.views).slice(0, 10)
  ).slice(0, 6);

  //   console.log("Selected Top Posts:", selected);

  topPostsContainer.innerHTML = "";

  if (selected.length === 0) {
    notFoundMessage(
      topPostsContainer,
      "No posts are available now. Please check back later."
    );
    removeSwiperControls();
    return;
  }

  selected.forEach((article) => {
    /* Create a wrapper element for image and placeholder */
    const imgWrapHtml = `
  <!-- Put a low-cost background placeholder via CSS and keep real image in data-src -->
  <div class="img-wrap">
    <img
      loading="lazy"
      class="lazy-img lazy-blur post-image"
      data-src="${article.image}"
      src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='7'></svg>"
      )}"
      alt="${article.title}"
      onerror="this.dataset.src='../assets/images/fallback.jpg'; this.onerror=null;"
    />
  </div>
`;

    const slide = createElement(
      "div",
      ["swiper-slide"],
      `
      <article class="post-card post__card">
        ${imgWrapHtml}
        <h3 class="post-title post__title">${article.title}</h3>
        <p class="post-excerpt post__description">${article.content.substring(
          0,
          100
        )}...</p>
        <p class="top-post-info">
                <span class="top-post-views"><i class="fa-solid fa-eye"></i> ${formatViews(
                  article.views
                )}</span>
                <span class="top-post-category">${article.category}</span>
        </p>
        <a href="single.php?id=${
          article.id
        }" class="read-more post__btn">Read More</a>
      </article>`
    );
    // const slide = createElement(
    //   "div",
    //   ["swiper-slide"],
    //   `
    //   <article class="post-card post__card">
    //     <img src="${article.image}" alt="${
    //     article.title
    //   }" class="post-image post__image" />
    //     <h3 class="post-title post__title">${article.title}</h3>
    //     <p class="post-excerpt post__description">${article.content.substring(
    //       0,
    //       100
    //     )}...</p>
    //     <p class="top-post-info">
    //             <span class="top-post-views"><i class="fa-solid fa-eye"></i> ${formatViews(
    //               article.views
    //             )}</span>
    //             <span class="top-post-category">${article.category}</span>
    //     </p>
    //     <a href="single.php?id=${
    //       article.id
    //     }" class="read-more post__btn">Read More</a>
    //   </article>`
    // );

    topPostsContainer.appendChild(slide);
  });

  // Initialize Swiper carousel
  // Check if Swiper is loaded
  if (typeof Swiper !== "undefined") {
    new Swiper(".mySwiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        // type: "bullets",         // Default is 'bullets'
        // type: "fraction",        // fraction pagination 3/16
        dynamicBullets: true, // dynamic bullets size
        dynamicMainBullets: 3, // show 3 main bullets
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

  // After rendering articles into articlesContainer
  if (window.observeLazyImages) window.observeLazyImages();
}

/* =============================================
   ######### Home Page: Categories Section #############
============================================= */

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
      `<a href="category.php?cat=${cat}" class="category-link">${cat}</a>`
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

  if (current > 3)
    paginationContainer.appendChild(
      createElement("span", ["pagination-dots"], "...")
    );

  for (
    let i = Math.max(2, current - 2);
    i <= Math.min(total - 1, current + 2);
    i++
  ) {
    createBtn(i, i, current === i);
  }

  if (current < total - 2)
    paginationContainer.appendChild(
      createElement("span", ["pagination-dots"], "...")
    );

  if (total > 1) createBtn(total, total, current === total);
  if (current < total) createBtn("»", current + 1);
}

// Main function to display categories with pagination
// 7 categories per page
function displayCategories(perPage = 7) {
  if (!categoriesContainer) return;
  const categories = [...new Set(allArticles.map((a) => a.category))];

  if (categories.length === 0) {
    notFoundMessage(
      categoriesContainer,
      "No categories available now. Please check back later."
    );
    return;
  }
  const totalPages = Math.ceil(categories.length / perPage);
  const currentPage = 1;

  renderCategoriesPage(categories, currentPage, perPage);
  renderCategoriesPagination(totalPages, currentPage, perPage, categories);
}

/* =============================================
   ########## Category Page ############
============================================= */

let currentPage = 1;
const perPage = 6;

// Display articles based on selected category and sort option
function displayArticles(category, sortBy) {
  const normalizedCategory = category.toLowerCase();
  let filtered =
    normalizedCategory === "all"
      ? allArticles
      : allArticles.filter((a) => a.category === category);

  if (sortBy === "Latest")
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sortBy === "Oldest")
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sortBy === "Most Viewed") filtered.sort((a, b) => b.views - a.views);

  if (categoryHeader) {
    categoryHeader.innerHTML =
      normalizedCategory === "all"
        ? `<h2 class="section-title">All Articles</h2>
                   <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">different Categories</span>.</p>`
        : `<h2 class="section-title">${category} Articles</h2>
                   <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">${category}</span>.</p>`;
  }

  if (filtered.length === 0) {
    // notFoundMessage(articlesContainer, `No articles found in " ${normalizedCategory === "all" ? "all categories" : "in" + category + "category"} ". Please check back later.`);
    notFoundMessage(
      articlesContainer,
      `No articles found in any category. Please check back later.`
    );
    postsPaginationContainer.innerHTML = "";
    return;
  } else {
    const totalPages = Math.ceil(filtered.length / perPage);
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const paginatedArticles = filtered.slice(start, end);

    articlesContainer.innerHTML = "";
    paginatedArticles.forEach((article) => {
      const imgWrapHtml = `
    <!-- Put a low-cost background placeholder via CSS and keep real image in data-src -->
    <div class="img-wrap">
        <img
        loading="lazy"
        class="lazy-img lazy-blur post-image"
        data-src="${article.image}"
        src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(
          "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='7'></svg>"
        )}"
        alt="${article.title}"
        onerror="this.dataset.src='../assets/images/fallback.jpg'; this.onerror=null;"
        />
    </div>
    `;
      const card = createElement(
        "article",
        ["post__card", "post-card"],
        `
            ${imgWrapHtml}
            <h3 class="post-title post__title">${article.title}</h3>
            <p class="post-category">#${article.category}</p>
            <p class="post-excerpt post__description">${article.content}</p>
            <p class="post-info">
                <span class="post-views"><i class="fa-solid fa-eye"></i> ${formatViews(
                  article.views
                )}</span>
                <span class="post-date">${formatDate(article.date)}</span>
            </p>
            <a href="single.php?id=${
              article.id
            }" class="read-more post__btn btn">Read More</a>
        `
      );
      articlesContainer.appendChild(card);
    });

    // =========== Rendering dynamic Pagination
    renderPagination(
      postsPaginationContainer,
      totalPages,
      currentPage,
      (page) => {
        currentPage = page;
        displayArticles(category, sortBy);
        scrollToArticlesTop();
      }
    );
  }

  // Ensure lazy images are observed after render
  if (window.observeLazyImages) window.observeLazyImages();

  // ⭐ NEW: Sync URL params
  updateURLParams({ cat: category, sort: sortBy, page: currentPage });
}

// Populate category filter dropdown with unique categories
// plus an "All" option
// function populateCategoryFilter() {
//   if (!categoryFilter) return;
//   const categories = [...new Set(allArticles.map((a) => a.category))];
//   categoryFilter.innerHTML = `<option value="All">All</option>`;
//   categories.forEach((cat) => {
//     const option = createElement("option", [], cat);
//     option.value = cat;
//     categoryFilter.appendChild(option);
//   });
// }

// ⭐ UPDATED: Init category page with URL sync
// Read URL params for category, sort, and page
// Set filters and display articles accordingly
// Add event listeners to filters to update articles and URL
// Scroll to top of articles on page/category/sort change
function initCategoryPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("cat") || "All";
  const sortParam = urlParams.get("sort") || "Most Viewed"; // default
  const pageParam = parseInt(urlParams.get("page")) || 1;

  categoryFilter.value = catParam;
  sortFilter.value = sortParam;
  currentPage = pageParam;

  displayArticles(catParam, sortParam);

  categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    const selected = categoryFilter.value;
    displayArticles(selected, sortFilter.value);
    // ✅ scroll up after category changes
    scrollToArticlesTop();
  });

  sortFilter.addEventListener("change", () => {
    currentPage = 1;
    displayArticles(categoryFilter.value, sortFilter.value);
    // ✅ scroll up after category changes
    scrollToArticlesTop();
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
    // Example: populate categories on load
    populateCategoryFilter(categoryFilter, allArticles);
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
    // console.log("Fetched Articles ERr:", allArticles);
    handleFailFetch();
  }
}

// Initialize navbar and fetch articles on DOMContentLoaded
// Ensures all DOM elements are ready before manipulation
document.addEventListener("DOMContentLoaded", async () => {
  // --- Safe init of optional functions (in case exports don't exist) ---
  try {
    if (typeof initNavbar === "function") await initNavbar();
  } catch (e) {
    /* ignore */
  }
  try {
    if (typeof initTheme === "function") initTheme();
  } catch (e) {
    /* ignore */
  }
  fetchArticles();
});
/* =============================================
   ############# End of Main JS ################
============================================= */
