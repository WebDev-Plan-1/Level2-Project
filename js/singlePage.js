/* =============================================
   ########### Import Utils ############
============================================= */
import {
  formatViews,
  notFoundMessage,
  removeSwiperControls,
  initNavbar,
  lazyLoading,
  AOSInit,
  formatContentDisplay,
} from "./utils.js";
//==== Import theme
import { initTheme } from "./theme.js";
// =========== Import Constants =======================
import {
  articleId,
  titleEl,
  heroImgContainer,
  dateEl,
  categoryEl,
  viewsEl,
  contentEl,
  readMoreBtn,
  relatedContainer,
} from "./utils.js";

/* =============================================
   ########### Global Config & Data ############
============================================= */
let fullContent = "";
let isExpanded = false;

/* =============================================
   ############### Initialize Lazy Loading Images ##############
============================================= */
lazyLoading();

/* =============================================
   ############### Initialize AOS ##############
============================================= */
AOSInit();

/* =============================================
   ############### Fetching & Show Articles ##############
============================================= */
fetch("data/articles.json")
  .then((res) => res.json())
  .then((data) => {
    const article = data.find((a) => a.id === articleId);
    if (!article) {
      document.querySelector(
        "main"
      ).innerHTML = `<p class="not-found">Article not found</p>`;
      return;
    }

    // ====== Put a low-cost background placeholder via CSS and keep real image in data-src
    const singleImgWrapHtml = `
    <div>
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
    // Fill content
    titleEl.textContent = article.title;
    heroImgContainer.innerHTML = singleImgWrapHtml;
    dateEl.innerHTML = `<i class="fa-solid fa-calendar"></i> ${new Date(
      article.date
    ).toDateString()}`;
    categoryEl.textContent = "#" + article.category;
    viewsEl.innerHTML = `<i class="fa-solid fa-eye"></i> ${formatViews(
      article.views
    )}`;

    // Slice content
    fullContent = article.content;
    contentEl.innerHTML = `<i class="fa-solid fa-quote-left"></i> ${
      fullContent.slice(0, 200) + "..."
    } <i class="fa-solid fa-quote-right"></i>`;

    // Read more toggle
    readMoreBtn.addEventListener("click", () => {
      if (isExpanded) {
        contentEl.innerHTML = `<i class="fa-solid fa-quote-left"></i> ${
          fullContent.slice(0, 200) + "..."
        } <i class="fa-solid fa-quote-right"></i>`;
        readMoreBtn.textContent = "Read More";
      } else {
        contentEl.innerHTML = `<i class="fa-solid fa-quote-left"></i> ${formatContentDisplay(
          fullContent
        )} <i class="fa-solid fa-quote-right"></i>`;
        readMoreBtn.textContent = "Show Less";
      }
      isExpanded = !isExpanded;
    });

    // =========== Related articles by category
    const related = data.filter(
      (a) => a.category === article.category && a.id !== article.id
    );

    if (related.length === 0) {
      notFoundMessage(
        relatedContainer,
        "Related articles for this category will be available soon. You can check other articles and categories."
      );
      relatedContainer.parentNode.parentNode.classList.add("empty-section");
      document.querySelector(".check-more-art").classList.add("active");
      removeSwiperControls();
    } else {
      related.forEach((rel) => {
        relatedContainer.parentNode.parentNode.classList.remove(
          "empty-section"
        );
        document.querySelector(".check-more-art").classList.remove("active");
        const relImgWrapHtml = `
          <div class="img-wrap">
            <img
              loading="lazy"
              class="lazy-img lazy-blur post-image"
              data-src="${rel.image}"
              src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='7'></svg>"
              )}"
              alt="${rel.title}"
              onerror="this.dataset.src='../assets/images/fallback.jpg'; this.onerror=null;"
            />
          </div>
        `;

        const card = document.createElement("div");
        card.classList.add("swiper-slide");
        card.innerHTML = `
          <div class="article-card">
            ${relImgWrapHtml}
            <h3>${rel.title}</h3>
            <p>${rel.content.slice(0, 100)}...</p>
            <a href="single.php?id=${rel.id}" class="btn">Read More</a>
          </div>
        `;
        relatedContainer.appendChild(card);
      });

      // Initialize Swiper carousel
      if (typeof Swiper !== "undefined") {
        new Swiper(".related-swiper", {
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

    // ✅ Always ensure lazy loading runs, even if no related articles
    if (window.observeLazyImages) window.observeLazyImages();
  });

// ================== //
// Initialize navbar and fetch articles on DOMContentLoaded
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
