/* =============================================
   ########### Import Utils ############
============================================= */
import {
  initNavbar,
  lazyLoading,
  AOSInit,
  scrollToArticlesTop,
  renderPagination,
  sortFilter,
} from "./utils.js";
// ===== Import Theme
import { initTheme } from "./theme.js";

/* =============================================
   ############### Initialize Lazy Loading Images ##############
============================================= */
lazyLoading();

/* =============================================
   ############### Initialize AOS ##############
============================================= */
AOSInit();

// ================== //
// Initialize navbar and fetch articles on DOMContentLoaded
// Ensures all DOM elements are ready before manipulation
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initTheme();
});

/* =============================================
   ############### Search Results Functionality ##############
============================================= */
const resultsContainer = document.getElementById("resultsContainer");
const searchSummary = document.getElementById("searchSummary");
const searchPagination = document.getElementById("searchPagination");

let currentPage = 1;
const postsPerPage = 4;
let filteredResults = [];

// 1. Get query from URL
function getQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("query")?.trim().toLowerCase() || "";
}

// 2. Fetch and filter articles
async function filterArticles(query) {
  try {
    const res = await fetch("data/articles.json");
    const articles = await res.json();

    return articles.filter((article) =>
      [article.title, article.content, article.category, article.date]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  } catch (error) {
    console.error("Error loading articles:", error);
    return [];
  }
}

// 3. Render Results
function renderResults(sortBy) {
  resultsContainer.innerHTML = "";

  if (sortBy === "Latest")
    filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sortBy === "Oldest")
    filteredResults.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sortBy === "Most Viewed")
    filteredResults.sort((a, b) => b.views - a.views);

  if (filteredResults.length === 0) {
    resultsContainer.innerHTML = `<p class="not-found">No results found.</p>`;
    searchSummary.textContent = "";
    searchPagination.innerHTML = "";
    return;
  } else {
    const totalPages = Math.ceil(filteredResults.length / postsPerPage);
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const pageResults = filteredResults.slice(start, end);

    pageResults.forEach((article) => {
      const resImgWrapHtml = `
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
      onerror="this.dataset.src='assets/images/logo.png'; this.onerror=null;"
    />
  </div>
`;
      const card = document.createElement("div");
      card.classList.add("article-card");
      card.innerHTML = `
      ${resImgWrapHtml}
      <h2>${article.title}</h2>
      <p class="post-category">#${article.category}</p>
      <p class="post-content">${article.content.substring(0, 100)}...</p>
      <a href="single.html?id=${article.id}" class="read-more btn">Read More</a>
    `;
      resultsContainer.appendChild(card);
    });

    // =========== Rendering dynamic Pagination
    renderPagination(searchPagination, totalPages, currentPage, (page) => {
      currentPage = page;
      renderResults(sortBy);
      scrollToArticlesTop();
    });
  }
  // After rendering articles into articlesContainer
  if (window.observeLazyImages) window.observeLazyImages();
}

//======= Sort
function initSortPosts() {
  const urlParams = new URLSearchParams(window.location.search);
  const sortParam = urlParams.get("sort") || "Latest"; // default
  const pageParam = parseInt(urlParams.get("page")) || 1;

  sortFilter.value = sortParam;
  currentPage = pageParam;

  renderResults(sortParam);

  sortFilter.addEventListener("change", () => {
    currentPage = 1;
    renderResults(sortFilter.value);
    // ✅ scroll up after category changes
    scrollToArticlesTop();
  });
}
// 4. Init

(async function initSearch() {
  const query = getQuery();
  if (!query) {
    resultsContainer.innerHTML = `<p class="not-found">Please enter a search term.</p>`;
    return;
  }

  filteredResults = await filterArticles(query);
  searchSummary.textContent = `${filteredResults.length} result(s) found for "${query}"`;
  //   renderResults();
  initSortPosts();
})();

/* =============================================
   ############# End of SearchPosts JS ################
============================================= */
