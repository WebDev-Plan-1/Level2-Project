/* =============================================
   ############### Utilities ###################
============================================= */
/* =============================================
   ########### Global Config & Data ############
============================================= */

//============= Home & Category Pages constants ============ //
// URL to fetch articles data
export const DATA_URL = "data/articles.json";
let allArticles = [];

// Function to fetch JSON data from the server (articles.json)
export async function fetchArticlesData() {
  const res = await fetch(DATA_URL);
  if (!res.ok) return [];
  return await res.json();
}
// featured posts section Container -- Home Page
export const topPostsContainer = document.querySelector("#top-posts-container");
// categories section -- Home Page
export const categoriesContainer = document.querySelector(
  ".categories-overview .categories-list"
);
// Articles section -- Categories Page
export const articlesContainer = document.querySelector(
  ".articles-list .posts"
);
// Pagination Container -- Categories Page
export const postsPaginationContainer =
  document.querySelector(".posts-pagination");
// Articles section Header -- Categories Page
export const categoryHeader = document.querySelector(".category-header");
// Articles section Filter Category -- Categories Page
export const categoryFilter = document.querySelector("#category-filter");
// Articles section Sorting -- Categories Page
export const sortFilter = document.querySelector("#sort-filter");

//============= Single Page constants ============ //

// Extract article ID from URL (ex: single.php?id=3)
export const urlParams = new URLSearchParams(window.location.search);
export const articleId = parseInt(urlParams.get("id"));

// Containers
export const titleEl = document.querySelector(".article-title");
// export const heroImg = document.querySelector("#article-hero-img");
export const heroImgContainer = document.querySelector(".article-hero");
export const dateEl = document.querySelector(".article-date");
export const categoryEl = document.querySelector(".article-category");
export const viewsEl = document.querySelector(".article-views");
export const contentEl = document.querySelector("#article-text");
export const readMoreBtn = document.querySelector("#read-more-btn");
export const relatedContainer = document.querySelector(
  "#related-articles-container"
);
/* =============================================
   ################# Navbar ####################
============================================= */
//============= Navbar constants ============ //

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navLinkItems = document.querySelectorAll(".nav-links .nav-link-item");
// ================= Handle navbar Search Bar
const searchToggle = document.querySelector(".search-toggle");
const searchForm = document.getElementById("navbarSearchForm");
const searchInput = document.getElementById("navbarSearchInput");
const counter = document.querySelector(".char-counter");
const clearBtn = document.querySelector(".clear-btn");

// ================= ⭐ UPDATED: Set active nav link based on current URL (ignoring query string)
function setActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinkItems.forEach((link) => {
    const linkPath = link.getAttribute("href").split("?")[0]; // ⭐ strip query string
    link.classList.toggle("active", linkPath === currentPath);
  });
}
// ================= Handle scroll behavior for nav links on small screens
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

function initSearchBar() {
  if (!searchToggle || !searchForm || !searchInput) return;

  // Toggle Search form
  searchToggle.addEventListener("click", () => {
    if (navLinks.classList.contains("active")) {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    }
    searchForm.classList.toggle("active");
    searchToggle.classList.toggle("active");
    if (searchForm.classList.contains("active")) {
      searchInput.focus();
    }
  });

  // ============ Limit Search input size with validation
  const limit = 50;
  searchInput.addEventListener("input", () => {
    // ======= Show clear button on typing only
    clearBtn.style.display = searchInput.value ? "block" : "none";
    // ======= Counting characters
    counter.textContent = `${searchInput.value.length} / ${limit}`;
    if (searchInput.value.length > limit) {
      counter.textContent = `${searchInput.value.length - 1} / ${limit}`;
      searchInput.value = searchInput.value.slice(0, limit); // cut extra chars
      alert(`Maximum ${limit} characters allowed`); // alert if characters exceeded
    }
  });

  // ======== Clear Input
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.style.display = "none";
    counter.textContent = `${searchInput.value.length} / ${limit}`;
    searchInput.focus();
  });
  // ============ Search on Submit
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();

    if (!query) return;

    // Save the keywork in local storage or in a query string parameter
    window.location.href = `searchPosts.php?query=${encodeURIComponent(query)}`;
  });
}

function isAuthenticated() {
  return !!localStorage.getItem("currentUser");
}

function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

function logoutUser() {
  // Call server to clear PHP session
  fetch("php/logout.php", {
    method: "POST",
    credentials: "same-origin",
  }).finally(() => {
    // Always clear client-side data
    localStorage.removeItem("currentUser");
    window.location.href = "auth.html";
  });
}

function renderNavbar() {
  const navLinks = document.getElementById("navLinks");
  const navActions = document.querySelector(".nav-actions");

  navLinks.innerHTML = ""; // Delete Old
  navActions.querySelectorAll(".auth-control")?.forEach((el) => el.remove()); // Delete Old Buttons

  if (!isAuthenticated()) {
    // ------- Before Login -------
    navLinks.innerHTML = `
      <a href="index.html" class="nav-link-item">Home</a>
      <a href="about.html" class="nav-link-item">About</a>
    `;

    // SignUp/Login link
    const loginLink = document.createElement("a");
    loginLink.href = "auth.html";
    loginLink.className = "nav-link-item auth-control";
    loginLink.textContent = "Sign Up / Login";
    navLinks.appendChild(loginLink);
  } else {
    // ------- After Login -------
    const user = getCurrentUser();

    navLinks.innerHTML = `
      <a href="index.html" class="nav-link-item">Home</a>
      <a href="about.html" class="nav-link-item">About</a>
      <a href="category.php?cat=All" class="nav-link-item">Categories</a>
      <a href="myBlogs.php" class="nav-link-item">My Blogs</a>
      <a href="submitPost.php" class="nav-link-item">Create a Post</a>
      <a href="contact.php" class="nav-link-item">Contact Us</a>
    `;

    // Dropdown with logout
    const userMenu = document.createElement("div");
    userMenu.className = "auth-control user-dropdown";
    // Use fullname if present, fall back to fullName or username
    const displayName =
      (user && (user.fullname || user.fullName || user.username)) || "User";
    userMenu.innerHTML = `
      <button class="user-btn">${displayName} ▾</button>
      <div class="dropdown-menu">
        <button id="logoutBtn">Logout</button>
      </div>
    `;
    navLinks.appendChild(userMenu);

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
      logoutUser();
    });
  }
}

// async function syncSessionWithLocalStorage() {
//   try {
//     const res = await fetch("php/check_session.php", {
//       method: "GET",
//       credentials: "include", // ⭐ ensures cookies (PHPSESSID) are sent
//       headers: { "Cache-Control": "no-cache" },
//     });
//     const data = await res.json();

//     if (data.ok && data.user) {
//       // ✅ backend session exists
//       localStorage.setItem("currentUser", JSON.stringify(data.user));
//     } else {
//       // ❌ backend session missing
//       localStorage.removeItem("currentUser");
//     }
//   } catch (err) {
//     console.error("Session check failed:", err);
//     localStorage.removeItem("currentUser");
//   }
// }

// =====================================================

// Sync server session to localStorage (call at init)
async function syncServerSessionToLocal() {
  try {
    const res = await fetch("php/check_session.php", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!res.ok) {
      localStorage.removeItem("currentUser");
      return null;
    }
    const data = await res.json();
    if (data.ok && data.user) {
      // Normalize keys: id, username, email, fullname
      const user = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        fullname: data.user.fullname ?? data.user.fullName ?? "",
      };
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } else {
      localStorage.removeItem("currentUser");
      return null;
    }
  } catch (err) {
    // network error: keep any existing local storage (do not overwrite)
    console.error("Session check failed:", err);
    return null;
  }
}

// Initialize Navbar functionality
// including hamburger toggle and active link highlighting
// and preserving active state across reloads, and responsive scroll handling
// and keyboard accessibility, and localStorage usage
export async function initNavbar() {
  if (!hamburger) return;

  hamburger.addEventListener("click", () => {
    if (
      searchForm.classList.contains("active") &&
      searchToggle.classList.contains("active")
    ) {
      searchForm.classList.toggle("active");
      searchToggle.classList.toggle("active");
    }
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");

    // update aria-expanded for accessibility
    const expanded = hamburger.classList.contains("active");
    hamburger.setAttribute("aria-expanded", expanded);
    navLinks.setAttribute("aria-expanded", expanded);
    //======= ToggleNav Scroll
    toggleNavScroll();
  });

  hamburger.addEventListener("keydown", (e) => {
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
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

  document.addEventListener("click", function (e) {
    // ====== Close Search form
    if (
      searchForm.classList.contains("active") &&
      !searchForm.contains(e.target) &&
      searchToggle.classList.contains("active") &&
      !searchToggle.contains(e.target)
    ) {
      searchForm.classList.toggle("active");
      searchToggle.classList.toggle("active");
    }

    // ======= Close Nav List and Hamburger
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      hamburger.classList.contains("active") &&
      !hamburger.contains(e.target)
    ) {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    }
  });

  const savedNav = localStorage.getItem("activeNav");
  if (savedNav) {
    navLinkItems.forEach((link) => {
      const linkPath = link.getAttribute("href").split("?")[0]; // ⭐ ignore query
      link.classList.toggle("active", linkPath === savedNav);
    });
  }

  window.addEventListener("resize", toggleNavScroll);
  setActiveNavLink();
  initSearchBar();

  // ⭐ sync PHP session with localStorage
  // await syncSessionWithLocalStorage();
  // renderNavbar(); // now always correct

  // NEW: sync server session and then render navbar
  await syncServerSessionToLocal().finally(() => {
    renderNavbar();
  });
}
/* =============================================
   ################# lazy-loader.js 
   (or inside main.js) ####################
============================================= */

export function lazyLoading() {
  /* Check if IntersectionObserver is supported */
  if ("IntersectionObserver" in window) {
    /* Create a single IntersectionObserver instance for performance */
    /* This observer will call the callback when image enters viewport */
    const lazyObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          /* If the observed element is intersecting (visible) */
          if (entry.isIntersecting) {
            const img = entry.target;
            /* Stop observing this image */
            observer.unobserve(img);

            /* If data-src exists, set it to src to start loading */
            if (img.dataset && img.dataset.src) {
              img.src = img.dataset.src;
            } else {
              img.src = "../assets/images/fallback.jpg";
            }

            /* When image loaded, remove blur class and add loaded class */
            img.addEventListener("load", () => {
              img.classList.remove("lazy-blur"); // remove the blur/filter
              img.classList.add("lazy-loaded"); // mark as loaded
              img.style.opacity = ""; // show fully
            });

            /* If image failed to load, fallback to placeholder */
            img.addEventListener("error", () => {
              img.src = "assets/images/fallback.jpg";
              img.classList.remove("lazy-blur");
            });
          }
        });
      },
      {
        /* rootMargin to start loading earlier (preload) */
        rootMargin: "200px 0px",
        threshold: 0.01,
      }
    );

    /* export function to observe all lazy images on page (call after render) */
    function observeLazyImages() {
      const lazyImages = document.querySelectorAll("img.lazy-img");
      lazyImages.forEach((img) => {
        /* set initial styles to avoid flash */
        img.style.opacity = "0";
        img.style.transition = "filter 400ms ease, opacity 400ms ease";
        lazyObserver.observe(img);
      });
    }

    /* Expose observeLazyImages to global so you can call it after render */
    window.observeLazyImages = observeLazyImages;
  } else {
    /* Fallback: no IntersectionObserver - load all images immediately */
    function observeLazyImages() {
      const lazyImages = document.querySelectorAll("img.lazy-img");
      lazyImages.forEach((img) => {
        if (img.dataset && img.dataset.src) {
          img.src = img.dataset.src;
        }
        img.classList.remove("lazy-blur");
        img.classList.add("lazy-loaded");
        img.style.opacity = "";
      });
    }
    window.observeLazyImages = observeLazyImages;
  }
}

/* =============================================
   ################# Utils Shared Functions ####################
============================================= */

// ⭐ UPDATED: Update URL params (support multiple keys at once)
// without reloading the page
export function updateURLParams(params) {
  const url = new URL(window.location);
  Object.keys(params).forEach((key) => {
    url.searchParams.set(key, params[key]);
  });
  window.history.pushState({}, "", url);
}

// Create an element with optional classes and inner HTML
export function createElement(tag, classes = [], html = "") {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (html) el.innerHTML = html;
  return el;
}

// Shuffle an array randomly
export function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Format view counts into human-readable strings
// e.g., 1500 -> 1.5K, 2000000 -> 2M
export function formatViews(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num.toString();
  }
}

// Format date strings into a more readable format
// e.g., "2023-08-15" -> "August 15, 2023"
export function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// Smoothly scroll the page to the top of the articles area (or header if present)
export function scrollToArticlesTop() {
  if (!articlesContainer) return;
  const target = categoryHeader || articlesContainer;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Display a not found message in the given container
// Used when no articles match the selected category
export function notFoundMessage(container, message) {
  if (!container) return;
  container.innerHTML = `<p class="not-found">${message}</p>`;
}

// Handle fetch failure gracefully
// Display fallback messages in all sections
// and clear filters and pagination
export function handleFailFetch() {
  if (categoryHeader) {
    categoryHeader.innerHTML = `<h2 class="section-title">All Articles</h2>
            <p class="section-title-desc">Latest updates and articles about <span class="cat-desc">different Categories</span>.</p>`;
  }
  if (categoryFilter)
    categoryFilter.innerHTML = `<option value="All">All</option>`;
  if (sortFilter)
    sortFilter.innerHTML = `<option value="Latest">Latest</option>`;
  if (postsPaginationContainer) postsPaginationContainer.innerHTML = "";
  //   [articlesContainer, categoriesContainer, topPostsContainer].forEach((el) =>
  //     el.classList.add("empty-section")
  //   );
  if (articlesContainer)
    articlesContainer.parentNode.classList.add("empty-section");
  if (categoriesContainer)
    categoriesContainer.parentNode.classList.add("empty-section");
  if (topPostsContainer)
    topPostsContainer.parentNode.parentNode.classList.add("empty-section");
  notFoundMessage(
    articlesContainer,
    "Articles will be shown here soon. Please check back later."
  );
  removeSwiperControls();
  notFoundMessage(
    categoriesContainer,
    "Categories will be available soon. Please check back later."
  );
  notFoundMessage(
    topPostsContainer,
    "Featured articles will be Ready soon. STAY TUNED."
  );
  return;
}

// Remove Swiper controls if they exist
// Used when there are no slides to show
export function removeSwiperControls() {
  const nextBtn = document.querySelector(".swiper-button-next");
  const prevBtn = document.querySelector(".swiper-button-prev");
  const pagination = document.querySelector(".swiper-pagination");

  [nextBtn, prevBtn, pagination].forEach((el) => {
    if (el) el.remove();
  });
  // const swiperContainer = document.querySelector(".swiper");
  // if (swiperContainer) swiperContainer.style.display = "none";
}

// Initialize AOS (Animate On Scroll) library
export function AOSInit() {
  AOS.init({ duration: 1200, mirror: false });
}

// ====================== Format Content of the Article
// extra break line every 4 lines
export function formatContentDisplay(text) {
  const lines = text.split(/\r?\n/);
  let formatted = "";
  lines.forEach((line, index) => {
    formatted += line + "<br>";
    if ((index + 1) % 4 === 0) {
      formatted += "<br>"; // extra break line every 4 lines
    }
  });
  return formatted;
}

/* =============================================
   ################# Dynamic Number Pagination Buttons ####################
============================================= */
/**
 * Render dynamic pagination buttons
 * @param {HTMLElement} container - The container element for pagination buttons
 * @param {number} totalPages - Total number of pages
 * @param {number} currentPage - Current active page
 * @param {function} onPageChange - Callback to handle page change
 */
export function renderPagination(
  container,
  totalPages,
  currentPage,
  onPageChange
) {
  container.innerHTML = "";

  if (totalPages <= 5) {
    // Show all pages if small number
    for (let i = 1; i <= totalPages; i++) {
      createPageButton(container, i, currentPage, onPageChange);
    }
  } else {
    // Always show first page
    createPageButton(container, 1, currentPage, onPageChange);

    if (currentPage > 3) {
      addEllipsis(container);
    }

    // Show pages around currentPage
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      createPageButton(container, i, currentPage, onPageChange);
    }

    if (currentPage < totalPages - 2) {
      addEllipsis(container);
    }

    // Always show last page
    createPageButton(container, totalPages, currentPage, onPageChange);
  }
}

// Create individual page button
function createPageButton(container, page, currentPage, onPageChange) {
  const bullet = document.createElement("button");
  bullet.classList.add("post-page-bullet");
  if (page === currentPage) bullet.classList.add("active");
  bullet.innerText = page;

  bullet.addEventListener("click", () => onPageChange(page));

  container.appendChild(bullet);
}

// Add ellipsis (...)
function addEllipsis(container) {
  const span = document.createElement("span");
  span.innerText = "...";
  span.classList.add("ellipsis");
  container.appendChild(span);
}

/**
 * Populate category filter dropdown
 * @param {HTMLElement} selectEl - The select element
 * @param {Array} articles - Array of articles
 */
export function populateCategoryFilter(selectEl, articles) {
  if (!selectEl) return;
  const categories = [...new Set(articles.map((a) => a.category))];
  // Append categories alphabetically
  categories.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
  selectEl.innerHTML = `<option value="All">All</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.innerText = cat;
    selectEl.appendChild(option);
  });
}

/* =============================================
   ############# End of Utils JS ################
============================================= */
