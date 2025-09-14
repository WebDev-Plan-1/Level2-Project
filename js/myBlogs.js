// js/myblogs.js
import {
  initNavbar,
  lazyLoading,
  createElement,
  removeSwiperControls,
  formatViews,
  formatDate,
  loaderInit,
} from "./utils.js"; // adjust to your exports
import { initTheme } from "./theme.js";

/* =============================================
   ############### Initialize Lazy Loading Images ##############
============================================= */
lazyLoading();

/* =============================================
   ################# Page Loader Init ####################
============================================= */
loaderInit();

/* =============================================
   ############### Load My Blogs for current logged user ##############
============================================= */
let swiper; // global variable

async function checkSession() {
  try {
    const res = await fetch("php/check_session.php", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.ok ? json.user : null;
  } catch (err) {
    return null;
  }
}

function escapeHTML(s) {
  if (!s) return "";
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );
}

function createCard(post) {
  // const el = document.createElement("article");
  // el.className = "post-card";
  const imgWrapHtml = `
    <!-- Put a low-cost background placeholder via CSS and keep real image in data-src -->
    <div class="img-wrap">
        <img
        loading="lazy"
        class="lazy-img lazy-blur post-image"
        data-src="${post.image}"
        src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(
          "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='7'></svg>"
        )}"
        alt="${post.title}"
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
          <h3 class="post__title">${escapeHTML(post.title)}</h3>
          <p class="meta">
            <span class="post_category">#${escapeHTML(post.category)}</span>
            <span class="post_date"><i class="fa-solid fa-calendar-days"></i> ${escapeHTML(
              new Date(post.date).toDateString()
            )}</span>
            <span class="post_views"><i class="fa-solid fa-eye"></i> ${formatViews(
              post.views
            )}</span>
            </p>
            <p class="post__description">${escapeHTML(post.content).slice(
              0,
              150
            )}...</p>
            <div class="post-actions">
              <a class="btn" href="single.php?id=${post.id}">Read</a>
              <button class="btn danger delete-btn" data-id="${
                post.id
              }">Delete</button>
            </div>
        </article>`
  );

  // el.innerHTML = `
  //   ${imgWrapHtml}
  //   <h3 class="post__title">${escapeHTML(post.title)}</h3>
  //   <p class="meta">
  //   <span class="post_category">#${escapeHTML(post.category)}</span>
  //   <span class="post_date"><i class="fa-solid fa-calendar-days"></i> ${escapeHTML(
  //     post.date
  //   )}</span>
  //   <span class="post_views"><i class="fa-solid fa-eye"></i> ${
  //     post.views
  //   }</span>
  //   </p>
  //   <p class="post__description">${escapeHTML(post.content).slice(
  //     0,
  //     150
  //   )}...</p>
  //   <div class="post-actions">
  //     <a class="btn" href="single.php?id=${post.id}">Read</a>
  //     <button class="btn danger delete-btn" data-id="${post.id}">Delete</button>
  //   </div>
  // `;
  return slide;
}

async function loadMyBlogs() {
  // ensure navbar and theme init (optional)
  try {
    if (typeof initNavbar === "function") await initNavbar();
  } catch (e) {}
  try {
    if (typeof initTheme === "function") initTheme();
  } catch (e) {}

  const user = await checkSession();
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  const res = await fetch("data/articles.json", { cache: "no-store" });
  if (!res.ok) {
    document.getElementById("myBlogsContainer").textContent =
      "Unable to load posts.";
    return;
  }
  const posts = await res.json();

  const myPosts = posts.filter(
    (post) =>
      (post.authorId && Number(post.authorId) === Number(user.id)) ||
      (post.authorUsername &&
        String(post.authorUsername) === String(user.username))
  );

  const container = document.getElementById("myBlogsContainer");
  container.innerHTML = "";
  if (myPosts.length === 0) {
    document.getElementById("noPosts").classList.remove("hidden");
    removeSwiperControls();
    return;
  } else {
    document.getElementById("noPosts").classList.add("hidden");

    myPosts.forEach((post) => container.appendChild(createCard(post)));

    // Initialize Swiper carousel
    // Check if Swiper is loaded
    if (!swiper || typeof swiper !== "undefined") {
      swiper = new Swiper(".mySwiper", {
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
      swiper.update(); // refresh if already initialized
    }

    // delete handler
    container.addEventListener("click", async (ev) => {
      const btn = ev.target.closest(".delete-btn");
      if (!btn) return;
      const id = btn.dataset.id;
      if (!confirm("Delete this post?")) return;

      try {
        const fd = new FormData();
        fd.append("id", id);
        const r = await fetch("php/deleteUserPost.php", {
          method: "POST",
          body: fd,
          credentials: "same-origin",
        });
        const j = await r.json();
        if (!r.ok) {
          alert(j.message || "Failed to delete");
          return;
        }
        btn.closest("article").parentNode.remove();
        swiper.update();
      } catch (err) {
        console.error(err);
        alert("Network error");
      }
    });

    // Ensure lazy images are observed after render
    if (window.observeLazyImages) window.observeLazyImages();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadMyBlogs();
});
