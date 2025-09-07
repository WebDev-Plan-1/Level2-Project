// file: js/theme.js

// Key used to store theme choice in localStorage
const THEME_KEY = "site-theme";

// Select the theme toggle button element by ID
const themeToggleBtn = document.getElementById("theme-toggle");

// Select the inner icon span so we can change the icon if needed
const themeIcon = themeToggleBtn
  ? themeToggleBtn.querySelector(".theme-icon")
  : null;

// ================================
// Apply theme to <html> element
// ================================
function applyTheme(theme) {
  // Apply theme on <html> using data-theme attribute
  document.documentElement.setAttribute("data-theme", theme);

  // Update aria state
  if (themeToggleBtn)
    themeToggleBtn.setAttribute("aria-pressed", theme === "dark");

  // Save preference
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.warn("Could not save theme to localStorage", e);
  }

  // Update icon
  if (themeIcon) {
    themeIcon.innerHTML =
      theme === "dark"
        ? `<i class="fa-solid fa-sun"></i>` // Sun icon when dark
        : `<i class="fa-solid fa-moon"></i>`; // Moon icon when light
  }
}

// ================================
// Detect preferred theme
// ================================
function getPreferredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch (e) {
    // ignore
  }
  // ✅ Default = dark (not light!)
  return "dark";
}

// ================================
// Toggle theme
// ================================
function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
}

// ================================
// Init theme
// ================================
export function initTheme() {
  const initial = getPreferredTheme();
  applyTheme(initial);

  if (themeToggleBtn) {
    // Click toggle
    themeToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleTheme();
    });

    // Keyboard toggle
    themeToggleBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTheme();
      }
    });
  }
}
