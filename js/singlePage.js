// Extract article ID from URL (ex: single.html?id=3)
const urlParams = new URLSearchParams(window.location.search);
const articleId = parseInt(urlParams.get("id"));

// Containers
const titleEl = document.querySelector(".article-title");
const heroImg = document.querySelector("#article-hero-img");
const dateEl = document.querySelector(".article-date");
const categoryEl = document.querySelector(".article-category");
const viewsEl = document.querySelector(".article-views");
const contentEl = document.querySelector("#article-text");
const readMoreBtn = document.querySelector("#read-more-btn");
const relatedContainer = document.querySelector("#related-articles-container");

let fullContent = "";
let isExpanded = false;

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
          }

          /* When image loaded, remove blur class and add loaded class */
          img.addEventListener("load", () => {
            img.classList.remove("lazy-blur"); // remove the blur/filter
            img.classList.add("lazy-loaded"); // mark as loaded
            img.style.opacity = ""; // show fully
          });

          /* If image failed to load, fallback to placeholder */
          img.addEventListener("error", () => {
            img.src = "assets/images/logo.png";
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

  /* Function to observe all lazy images on page (call after render) */
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

// Display a not found message in the given container
// Used when no articles match the selected category
function notFoundMessage(container, message) {
  if (!container) return;
  container.innerHTML = `<p class="not-found">${message}</p>`;
}

// Remove Swiper controls if they exist
// Used when there are no slides to show
function removeSwiperControls() {
  const nextBtn = document.querySelector(".swiper-button-next");
  const prevBtn = document.querySelector(".swiper-button-prev");
  const pagination = document.querySelector(".swiper-pagination");

  [nextBtn, prevBtn, pagination].forEach((el) => {
    if (el) el.remove();
  });
  // const swiperContainer = document.querySelector(".swiper");
  // if (swiperContainer) swiperContainer.style.display = "none";
}
// fetching data
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

    // Fill content
    titleEl.textContent = article.title;
    heroImg.src = article.image;
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
        contentEl.innerHTML = `<i class="fa-solid fa-quote-left"></i> ${fullContent} <i class="fa-solid fa-quote-right"></i>`;
        readMoreBtn.textContent = "Show Less";
      }
      isExpanded = !isExpanded;
    });

    // Related articles by category
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

      return;
    }

    related.forEach((rel) => {
      relatedContainer.parentNode.parentNode.classList.remove("empty-section");
      document.querySelector(".check-more-art").classList.remove("active");
      /* Create a wrapper element for image and placeholder */
      const relImgWrapHtml = `
  <!-- Put a low-cost background placeholder via CSS and keep real image in data-src -->
  <div class="img-wrap">
    <img
      loading="lazy"
      class="lazy-img lazy-blur post-image"
      data-src="${rel.image}"
      src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='7'></svg>"
      )}"
      alt="${rel.title}"
      onerror="this.dataset.src='assets/images/logo.png'; this.onerror=null;"
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
          <a href="single.html?id=${rel.id}" class="btn">Read More</a>
        </div>
      `;
      relatedContainer.appendChild(card);
    });

    // Initialize Swiper carousel
    // Check if Swiper is loaded
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
  });

// Views formatter
function formatViews(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M views";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K views";
  return num + " views";
}
