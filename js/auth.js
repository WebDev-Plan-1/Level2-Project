import { initNavbar, loaderInit } from "./utils.js";
import { initTheme } from "./theme.js";

// ---------- Safe Initialization ----------
function safeInit(fn) {
  if (typeof fn === "function") {
    try {
      fn();
    } catch (e) {
      console.error("Init error:", e);
    }
  }
}

// ---------- Helpers ----------
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function setError(el, msg = "") {
  el.textContent = msg;
  el.style.display = msg ? "block" : "none";
}

function setFeedback(el, message, type = "error") {
  el.textContent = message;
  el.className = `form-feedback ${type}`;
}

function saveUserToLocal(user) {
  if (!user) return;
  const data = {
    id: user.id,
    username: user.username,
    email: user.email,
    fullname: user.fullname || user.fullName || "",
  };
  localStorage.setItem("currentUser", JSON.stringify(data));
}

async function fetchUsers() {
  try {
    const res = await fetch("data/users.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error("Error fetching users.json:", e);
    return [];
  }
}

// ---------- Validation ----------
function validateEmail(email) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return false;
  return /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(domain);
}

function validatePassword(pass) {
  return pass.length >= 6;
}

// ---------- Button Texts ----------
const BTN_TEXT = {
  signup: {
    normal: "Create account",
    checking: "Checking...",
    submitting: "Submitting...",
  },
  login: {
    normal: "Login",
    signing: "Signing in...",
  },
};

// ---------- Sign Up Handler ----------
async function handleSignupSubmit(form, feedbackEl) {
  const username = form.querySelector("#signupUsername").value.trim();
  const email = form.querySelector("#signupEmail").value.trim();
  const password = form.querySelector("#signupPassword").value.trim();
  const confirmPass = form.querySelector("#signupConfirmPassword").value.trim();
  const fullname = form.querySelector("#signupFullName").value.trim();

  const usernameErr = form.querySelector("#signupUsernameError");
  const emailErr = form.querySelector("#signupEmailError");
  const passErr = form.querySelector("#signupPasswordError");
  const confirmErr = form.querySelector("#signupConfirmPasswordError");
  const btn = form.querySelector("button[type='submit']");

  // Reset errors
  [usernameErr, emailErr, passErr, confirmErr].forEach((el) => setError(el));

  if (!username) return setError(usernameErr, "Username is required");
  if (!validateEmail(email)) return setError(emailErr, "Invalid email address");
  if (!validatePassword(password))
    return setError(passErr, "Password must be at least 6 characters");
  if (password !== confirmPass)
    return setError(confirmErr, "Passwords do not match");

  btn.textContent = BTN_TEXT.signup.checking;
  const users = await fetchUsers();

  const uniqueUser = !users.some(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  const uniqueEmail = !users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!uniqueUser) {
    btn.textContent = BTN_TEXT.signup.normal;
    return setError(usernameErr, "Username already exists");
  }
  if (!uniqueEmail) {
    btn.textContent = BTN_TEXT.signup.normal;
    return setError(emailErr, "Email already registered");
  }

  btn.textContent = BTN_TEXT.signup.submitting;
  try {
    const res = await fetch("php/signup.php", {
      method: "POST",
      body: new FormData(form),
    });
    const data = await res.json();

    if (data.success) {
      setFeedback(feedbackEl, "Account created successfully!", "success");
      saveUserToLocal({
        id: data.user_id,
        username,
        email,
        fullname,
      });
      await delay(500);
      window.location.href = "index.html";
    } else {
      setFeedback(feedbackEl, data.message || "Signup failed");
    }
  } catch {
    setFeedback(feedbackEl, "Network error. Please try again.");
  } finally {
    btn.textContent = BTN_TEXT.signup.normal;
  }
}

// ---------- Login Handler ----------
async function handleLoginSubmit(form, feedbackEl) {
  const username = form.querySelector("#loginUsername").value.trim();
  const password = form.querySelector("#loginPassword").value.trim();
  const usernameErr = form.querySelector("#loginUsernameError");
  const passErr = form.querySelector("#loginPasswordError");
  const btn = form.querySelector("button[type='submit']");

  [usernameErr, passErr].forEach((el) => setError(el));

  if (!username) return setError(usernameErr, "Username is required");
  if (!password) return setError(passErr, "Password is required");

  btn.textContent = BTN_TEXT.login.signing;
  try {
    const res = await fetch("php/login.php", {
      method: "POST",
      body: new FormData(form),
    });
    const data = await res.json();

    if (data.success) {
      setFeedback(feedbackEl, "Login successful!", "success");
      saveUserToLocal({
        id: data.user_id,
        username: data.username,
        email: data.email,
        fullname: data.fullname,
      });
      await delay(500);
      window.location.href = "index.html";
    } else {
      setFeedback(feedbackEl, data.message || "Invalid credentials");
    }
  } catch {
    setFeedback(feedbackEl, "Network error. Please try again.");
  } finally {
    btn.textContent = BTN_TEXT.login.normal;
  }
}

// ---------- Init Forms ----------
function initForms() {
  const signupForm = document.querySelector("#signupForm");
  const loginForm = document.querySelector("#loginForm");
  const signupFeedback = document.querySelector("#signupFeedback");
  const loginFeedback = document.querySelector("#loginFeedback");

  if (signupForm)
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSignupSubmit(signupForm, signupFeedback);
    });

  if (loginForm)
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleLoginSubmit(loginForm, loginFeedback);
    });
}

// ---------- Init ----------
(async function initAuth() {
  loaderInit();
  safeInit(initNavbar);
  safeInit(initTheme);
  initForms();
})();
