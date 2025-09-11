// js/auth.js
/* NEW: Auth frontend (signup + login) module
   - validations: 2-word name, username pattern, allowed/valid email, password rules
   - uniqueness check against data/users.json (client-side pre-check)
   - submits to server endpoints php/signup.php and php/login.php
*/

import { initNavbar } from "./utils.js"; // if present (ok if not exported; will throw if not available)
import { initTheme } from "./theme.js";

(async function () {
  // --- Safe init of optional functions (in case exports don't exist) ---
  try {
    if (typeof initNavbar === "function") initNavbar();
  } catch (e) {
    /* ignore */
  }
  try {
    if (typeof initTheme === "function") initTheme();
  } catch (e) {
    /* ignore */
  }

  // DOM
  const showLogin = document.getElementById("showLogin");
  const showSignup = document.getElementById("showSignup");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  // signup fields
  const fullName = document.getElementById("fullName");
  const nameError = document.getElementById("nameError");
  const signupUsername = document.getElementById("signupUsername");
  const usernameError = document.getElementById("usernameError");
  const signupEmail = document.getElementById("signupEmail");
  const emailError = document.getElementById("emailError");
  const signupPassword = document.getElementById("signupPassword");
  const passwordError = document.getElementById("passwordError");
  const signupConfirm = document.getElementById("signupConfirm");
  const confirmError = document.getElementById("confirmError");
  const signupFeedback = document.getElementById("signupFeedback");
  const signupSubmit = document.getElementById("signupSubmit");

  // login fields
  const loginUser = document.getElementById("loginUser");
  const loginPassword = document.getElementById("loginPassword");
  const loginFeedback = document.getElementById("loginFeedback");
  const loginSubmit = document.getElementById("loginSubmit");

  // Config / validation
  const USERNAME_RE = /^[a-z0-9_]{3,30}$/; // lowercase, digits, underscore
  const WORD_CHAR_LIMIT = 15;
  const NAME_PARTS = 2;
  //   const TITLE_WORD_LIMIT = 5; // not used here, but keep consistent
  const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // min8, uppercase, lowercase, digit

  // allowed provider domains (these are accepted regardless). Other valid domains are allowed too.
  const ALLOWED_PROVIDER_DOMAINS = [
    "gmail.com",
    "googlemail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "microsoft.com",
  ];

  // Toggle forms
  showLogin.addEventListener("click", () => {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    showLogin.classList.add("active");
    showSignup.classList.remove("active");
  });
  showSignup.addEventListener("click", () => {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    showSignup.classList.add("active");
    showLogin.classList.remove("active");
  });

  // ---------------- validation helpers ----------------
  function showErr(el, msg) {
    el.textContent = msg || "";
    el.style.display = msg ? "block" : "none";
  }
  function hideErr(el) {
    el.textContent = "";
    el.style.display = "none";
  }

  function validateName() {
    const v = (fullName.value || "").trim();
    if (!v) {
      showErr(nameError, "Full name is required (First & Last).");
      return false;
    }
    // split into words
    const parts = v.split(/\s+/).filter(Boolean);
    if (parts.length !== NAME_PARTS) {
      showErr(nameError, "Please enter First and Last name only.");
      return false;
    }
    for (const p of parts) {
      if (p.length > WORD_CHAR_LIMIT) {
        showErr(nameError, `Each name must be ≤ ${WORD_CHAR_LIMIT} chars.`);
        return false;
      }
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/.test(p)) {
        showErr(nameError, "Name may contain letters, - or ' only.");
        return false;
      }
    }
    hideErr(nameError);
    return true;
  }

  function validateUsername() {
    const v = (signupUsername.value || "").trim();
    if (!v) {
      showErr(usernameError, "Username is required.");
      return false;
    }
    if (!USERNAME_RE.test(v)) {
      showErr(
        usernameError,
        "Use lowercase letters, numbers and underscore, 3-30 chars."
      );
      return false;
    }
    hideErr(usernameError);
    return true;
  }

  function validateEmail() {
    const v = (signupEmail.value || "").trim().toLowerCase();
    if (!v) {
      showErr(emailError, "Email is required.");
      return false;
    }
    // basic format check
    const okFormat = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (!okFormat) {
      showErr(emailError, "Enter a valid email address.");
      return false;
    }
    // allow known providers OR any well-formed domain
    const domain = v.split("@")[1] || "";
    if (ALLOWED_PROVIDER_DOMAINS.includes(domain)) {
      hideErr(emailError);
      return true;
    }
    // allow other corporate/real domains (very basic test)
    const domainParts = domain.split(".");
    if (domainParts.length < 2 || domainParts.some((p) => p.length === 0)) {
      showErr(emailError, "Email domain seems invalid.");
      return false;
    }
    hideErr(emailError);
    return true;
  }

  function validatePassword() {
    const v = signupPassword.value || "";
    if (!v) {
      showErr(passwordError, "Password is required.");
      return false;
    }
    if (!PASSWORD_RE.test(v)) {
      showErr(
        passwordError,
        "Password must be ≥8 chars and include uppercase, lowercase and a number."
      );
      return false;
    }
    hideErr(passwordError);
    return true;
  }

  function validateConfirm() {
    const a = signupPassword.value || "";
    const b = signupConfirm.value || "";
    if (a !== b) {
      showErr(confirmError, "Passwords are not matched.");
      return false;
    }
    hideErr(confirmError);
    return true;
  }

  // fetch users.json and check duplicates (client-side pre-check)
  async function fetchUsers() {
    try {
      const res = await fetch("data/users.json", { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return data;
    } catch (e) {
      return [];
    }
  }

  async function isUniqueUsername(username) {
    const users = await fetchUsers();
    return !users.some(
      (u) => (u.username || "").toLowerCase() === username.toLowerCase()
    );
  }
  async function isUniqueEmail(email) {
    const users = await fetchUsers();
    return !users.some(
      (u) => (u.email || "").toLowerCase() === email.toLowerCase()
    );
  }

  // live validation events
  fullName.addEventListener("input", validateName);
  signupUsername.addEventListener("input", validateUsername);
  signupEmail.addEventListener("input", validateEmail);
  signupPassword.addEventListener("input", validatePassword);
  signupConfirm.addEventListener("input", validateConfirm);

  // --------- SIGNUP submit ---------
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupFeedback.textContent = "";

    const okName = validateName();
    const okUser = validateUsername();
    const okEmail = validateEmail();
    const okPass = validatePassword();
    const okConfirm = validateConfirm();

    if (!okName || !okUser || !okEmail || !okPass || !okConfirm) {
      signupFeedback.textContent = "Please fix the errors above.";
      signupFeedback.className = "form-feedback error";
      return;
    }

    // UNIQUE checks
    signupSubmit.disabled = true;
    signupSubmit.textContent = "Checking...";

    const usernameVal = signupUsername.value.trim();
    const emailVal = signupEmail.value.trim().toLowerCase();

    const [uniqueUser, uniqueEmail] = await Promise.all([
      isUniqueUsername(usernameVal),
      isUniqueEmail(emailVal),
    ]);

    if (!uniqueUser) {
      signupSubmit.disabled = false;
      signupSubmit.textContent = "Create account";
      showErr(usernameError, "Username already taken.");
      signupFeedback.textContent = "Please fix the errors above.";
      signupFeedback.className = "form-feedback error";
      return;
    }
    if (!uniqueEmail) {
      signupSubmit.disabled = false;
      signupSubmit.textContent = "Create account";
      showErr(emailError, "Email already registered.");
      signupFeedback.textContent = "Please fix the errors above.";
      signupFeedback.className = "form-feedback error";
      return;
    }

    // build payload and send to server
    const payload = new FormData();
    payload.append("fullname", fullName.value.trim());
    payload.append("username", usernameVal);
    payload.append("email", emailVal);
    payload.append("password", signupPassword.value);

    signupSubmit.textContent = "Submitting...";
    try {
      const res = await fetch("php/signup.php", {
        method: "POST",
        body: payload,
      });

      const json = await res
        .json()
        .catch(() => ({ ok: false, message: "Invalid server response" }));

      if (!res.ok) {
        signupFeedback.textContent = json.message || "Signup failed.";
        signupFeedback.className = "form-feedback error";
        signupSubmit.disabled = false;
        signupSubmit.textContent = "Create account";
        return;
      }

      // ✅ Save current user in localStorage from the parsed JSON response
      if (json && json.user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: json.user.id,
            username: json.user.username,
            email: json.user.email,
            fullname: json.user.fullname || json.user.fullName || "",
          })
        );
      } else {
        console.warn("Signup: server did not return user object", json);
      }

      // success — server should set session; redirect to protected area
      signupFeedback.textContent = "Account created. Redirecting...";
      signupFeedback.className = "form-feedback success";
      // localStorage.setItem("currentUser", fullName.value.trim());
      // small delay to allow session cookie to be set
      setTimeout(() => {
        window.location.href = "index.html";
      }, 700);
    } catch (err) {
      signupFeedback.textContent = "Network error. Try again.";
      signupFeedback.className = "form-feedback error";
      console.error(err);
      signupSubmit.disabled = false;
      signupSubmit.textContent = "Create account";
    }
  });

  // --------- LOGIN submit ---------
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginFeedback.textContent = "";

    const userVal = (loginUser.value || "").trim();
    const passVal = (loginPassword.value || "").trim();
    if (!userVal) {
      document.getElementById("loginUserError").textContent =
        "Username or email required.";
      return;
    } else {
      document.getElementById("loginUserError").textContent = "";
    }
    if (!passVal) {
      document.getElementById("loginPasswordError").textContent =
        "Password required.";
      return;
    } else {
      document.getElementById("loginPasswordError").textContent = "";
    }

    loginSubmit.disabled = true;
    loginSubmit.textContent = "Signing in...";

    try {
      const payload = new FormData();
      payload.append("identifier", userVal);
      payload.append("password", passVal);

      const res = await fetch("php/login.php", {
        method: "POST",
        body: payload,
      });
      const json = await res
        .json()
        .catch(() => ({ ok: false, message: "Invalid server response" }));

      if (!res.ok) {
        loginFeedback.textContent = json.message || "Login failed.";
        loginFeedback.className = "form-feedback error";
        loginSubmit.disabled = false;
        loginSubmit.textContent = "Login";
        return;
      }

      // ✅ Save current user in localStorage from parsed JSON response
      if (json && json.user) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: json.user.id,
            username: json.user.username,
            email: json.user.email,
            fullname: json.user.fullname || json.user.fullName || "",
          })
        );
      } else {
        console.warn("Login: server did not return user object", json);
      }

      loginFeedback.textContent = "Logged in. Redirecting...";
      loginFeedback.className = "form-feedback success";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    } catch (err) {
      console.error(err);
      loginFeedback.textContent = "Network error.";
      loginFeedback.className = "form-feedback error";
      loginSubmit.disabled = false;
      loginSubmit.textContent = "Login";
    }
  });
})();
