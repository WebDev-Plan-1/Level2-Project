// js/submit.js
// All comments are above blocks/lines (in English) per project rules.
/* =============================================
   ########### Import Utils ############
============================================= */
import { initNavbar, AOSInit, fetchArticlesData } from "./utils.js";
//==== Import theme
import { initTheme } from "./theme.js";
/* =============================================
   ############### Initialize AOS ##############
============================================= */
AOSInit();
/* =============================================
   ############### Utility functions ##############
============================================= */
// Function to fetch JSON data from the server (articles.json)
// async function fetchArticlesData() {
//   const res = await fetch("/level2-project/data/articles.json");
//   if (!res.ok) return [];
//   return await res.json();
// }
/* -------------------------
   DOM references
   ------------------------- */
const form = document.getElementById("postForm");
const titleEl = document.getElementById("title");
const titleError = document.getElementById("titleError");
const categoryEl = document.getElementById("category");
const categoryError = document.getElementById("categoryError");
const newCategoryWrap = document.getElementById("newCategoryWrap");
const newCategoryEl = document.getElementById("newCategory");
const newCategoryError = document.getElementById("newCategoryError");
const contentEl = document.getElementById("content");
const contentError = document.getElementById("contentError");
const imageEl = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");
const imageError = document.getElementById("imageError");
const dateEl = document.getElementById("date");
const dateError = document.getElementById("dateError");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const feedback = document.getElementById("formFeedback");

/* -------------------------
   Config
   ------------------------- */
// Allowed image extensions set (lowercase)
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif"];
// Max image size in bytes (3 MB)
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
// Title words limit
const TITLE_WORD_LIMIT = 5;
// Word Characters limit
const WORD_CHAR_LIMIT = 20; // per word
// Title words limit
const CAT_WORD_LIMIT = 2;
// Basic profanity list (extend as needed)
const PROFANITY = ["Fuck", "Sex", "Shit"]; // replace with your list

/* -------------------------
   Populate category select on load
   ------------------------- */
async function initCategories() {
  const articles = await fetchArticlesData();
  const categories = [
    ...new Set(articles.map((a) => a.category).filter(Boolean)),
  ];
  // Clear existing non-initial options except Add New Category placeholder
  // Remove existing options except the default and the Add New placeholder
  // (we assume the HTML already contains "Add New Category" option)
  // Remove any dynamically added categories first
  Array.from(categoryEl.options).forEach((opt) => {
    if (opt.value !== "" && opt.value !== "Add New Category") {
      opt.remove();
    }
  });
  // Append categories alphabetically
  categories.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryEl.appendChild(option);
  });
}

/* -------------------------
   Helper: show / hide element
   ------------------------- */
function show(el) {
  el.classList.remove("hidden");
}
function hide(el) {
  el.classList.add("hidden");
}

/* -------------------------
   Title validation (word count)
   ------------------------- */
function validateTitle() {
  const value = titleEl.value.trim();
  const words = value ? value.split(/\s+/) : [];

  if (!value) {
    titleError.textContent = "Title is required.";
    show(titleError);
    return false;
  }
  if (words.length > TITLE_WORD_LIMIT) {
    titleError.textContent = `Title must be at most ${TITLE_WORD_LIMIT} words. Currently ${words.length}.`;
    show(titleError);
    return false;
  }
  for (const word of words) {
    if (word.length > WORD_CHAR_LIMIT) {
      titleError.textContent = `Each word must be at most ${WORD_CHAR_LIMIT} characters. Problem with: "${word}".`;
      show(titleError);
      return false;
    }
  }
  hide(titleError);
  return true;
}

/* -------------------------
   New Category toggle
   ------------------------- */
function onCategoryChange() {
  if (categoryEl.value === "Add New Category") {
    show(newCategoryWrap);
    newCategoryEl.required = true;
  } else {
    hide(newCategoryWrap);
    newCategoryEl.required = false;
    newCategoryError.textContent = "";
    hide(newCategoryError);
  }
}

async function validateNewCategory() {
  const value = newCategoryEl.value.trim();
  if (!value) {
    newCategoryError.textContent = "Please enter the new category name.";
    show(newCategoryError);
    return false;
  }

  const words = value.split(/\s+/);
  if (words.length > CAT_WORD_LIMIT) {
    newCategoryError.textContent = `New category must be at most ${CAT_WORD_LIMIT} words.`;
    show(newCategoryError);
    return false;
  }
  for (const word of words) {
    if (word.length > WORD_CHAR_LIMIT) {
      newCategoryError.textContent = `Each word in category must be at most ${WORD_CHAR_LIMIT} characters. Problem with: "${word}".`;
      show(newCategoryError);
      return false;
    }
  }

  // Check duplicates against existing categories
  const articles = await fetchArticlesData();
  const categories = [
    ...new Set(articles.map((a) => a.category.toLowerCase()).filter(Boolean)),
  ];

  if (categories.includes(value.toLowerCase())) {
    newCategoryError.textContent =
      "This category already exists. Please choose another.";
    show(newCategoryError);
    return false;
  }

  hide(newCategoryError);
  return true;
}

/* -------------------------
   Validate content for profanity (client-side) and optionally format
   ------------------------- */
function validateContent() {
  // use raw value (do not trim here — we need newlines)
  const raw = contentEl.value;
  if (!raw || raw.trim() === "") {
    contentError.textContent = "Content cannot be empty.";
    show(contentError);
    return false;
  }

  // Simple profanity check (case-insensitive)
  const lower = raw.toLowerCase();
  for (const bad of PROFANITY) {
    if (lower.includes(bad.toLowerCase())) {
      contentError.textContent =
        "Your content contains forbidden language. Please remove it.";
      show(contentError);
      return false;
    }
  }

  hide(contentError);
  return true;
}

/* -------------------------
   Image handling & validation
   ------------------------- */
function validateImage(file) {
  if (!file) return { ok: true };
  // check size
  if (file.size > MAX_IMAGE_SIZE) {
    return { ok: false, message: "Image is too large (max 3MB)." };
  }
  // check extension
  const ext = file.name.split(".").pop().toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    return { ok: false, message: "Unsupported image type." };
  }
  return { ok: true };
}

// Create preview for chosen image
imageEl.addEventListener("change", () => {
  imageError.textContent = "";
  hide(imageError);
  const file = imageEl.files[0];
  if (!file) {
    imagePreview.src = "";
    hide(imagePreview);
    return;
  }
  const validation = validateImage(file);
  if (!validation.ok) {
    imageError.textContent = validation.message;
    show(imageError);
    imageEl.value = "";
    imagePreview.src = "";
    hide(imagePreview);
    return;
  }
  // show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    show(imagePreview);
  };
  reader.readAsDataURL(file);
});

/* -------------------------
   Date default to today
   ------------------------- */
function setTodayDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  dateEl.value = `${yyyy}-${mm}-${dd}`;
}

/* -------------------------
   Reset handler
   ------------------------- */
resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  form.reset();
  hide(imagePreview);
  hide(titleError);
  hide(contentError);
  hide(imageError);
  hide(newCategoryError);
  hide(categoryError);
  feedback.textContent = "";
  setTodayDate();
});

/* -------------------------
   Form submit handler (AJAX-ish using fetch)
   ------------------------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validate fields
  const validTitle = validateTitle();
  const validContent = validateContent();
  const categoryValue = categoryEl.value;
  let validCategory = true;
  if (!categoryValue) {
    categoryError.textContent = "Please choose a category or add a new one.";
    show(categoryError);
    validCategory = false;
  } else if (categoryValue === "Add New Category") {
    validCategory = await validateNewCategory();
  } else {
    hide(categoryError);
  }

  // Validate image
  const file = imageEl.files[0];
  const imgValidation = validateImage(file);
  if (!imgValidation.ok) {
    imageError.textContent = imgValidation.message;
    show(imageError);
  } else {
    hide(imageError);
  }

  if (!validTitle || !validContent || !validCategory || !imgValidation.ok) {
    feedback.textContent = "Please fix the highlighted errors.";
    feedback.className = "error";
    return;
  }

  // Build FormData
  const fd = new FormData();
  fd.append("title", titleEl.value.trim());
  fd.append("category", categoryValue);
  fd.append("newCategory", newCategoryEl.value.trim());
  fd.append("content", contentEl.value.trim());
  fd.append("date", dateEl.value);
  if (file) fd.append("image", file);

  // Disable submit button while processing
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    // Post to server endpoint
    const res = await fetch(form.action, {
      method: "POST",
      body: fd,
    });

    const json = await res.json();

    if (!res.ok) {
      // Server-side validation error
      feedback.textContent = json.message || "Failed to submit article.";
      feedback.className = "error";
    } else {
      // Success: show message and optionally redirect
      feedback.textContent = "Article submitted successfully!";
      feedback.className = "success";
      // Optionally redirect to the new article page:
      // window.location.href = `single.html?id=${json.id}`;
      form.reset();
      hide(imagePreview);
      setTodayDate();
      // refresh categories select to include any newly added category
      await initCategories();
    }
  } catch (err) {
    console.error(err);
    feedback.textContent = "Network error. Try again.";
    feedback.className = "error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Post";
  }
});

/* -------------------------
   Event listeners & init
   ------------------------- */
categoryEl.addEventListener("change", onCategoryChange);
newCategoryEl.addEventListener("input", () => {
  if (newCategoryEl.value.trim()) hide(newCategoryError);
});
titleEl.addEventListener("input", () => {
  // live title validation but don't spam alerts
  validateTitle();
});
// live profanity check while typing (no formatting)
contentEl.addEventListener("input", () => {
  validateContent();
});

/* -------------------------
   Initialize on load
   ------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  await initCategories();
  setTodayDate();
  initNavbar();
  initTheme();
});

// ================== //
// Initialize navbar and fetch articles on DOMContentLoaded
// document.addEventListener("DOMContentLoaded", () => {
//   initNavbar();
//   initTheme();
// });
