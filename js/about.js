// js/myblogs.js
import { initNavbar, lazyLoading, loaderInit } from "./utils.js"; // adjust to your exports
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
   ################# Swiper Slider Init ####################
============================================= */
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

/* =============================================
   ################# Navbar & Theme Init on DOMContentLoaded ####################
============================================= */
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
});

/* =============================================
   ############# End of JS ################
============================================= */
