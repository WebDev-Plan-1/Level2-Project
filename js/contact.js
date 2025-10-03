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
   ################# EmailJS Configuration ####################
============================================= */
const EMAILJS_USER = "YOUR_EMAILJS_USER_ID"; // replace
const EMAILJS_SERVICE = "YOUR_EMAILJS_SERVICE_ID"; // replace
const EMAILJS_TEMPLATE = "YOUR_EMAILJS_TEMPLATE_ID"; // replace
const TARGET_EMAIL = "ahmedhafezgames@gmail.com"; // where messages should go

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

  /* =============================================
         ################# Contact Form Handling ####################
    ============================================= */
  const form = document.getElementById("contactForm");
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const subjectEl = document.getElementById("subject");
  const messageEl = document.getElementById("message");
  const honeypot = document.getElementById("honeypot");
  const submitBtn = document.getElementById("contactSubmit");
  const resetBtn = document.getElementById("contactReset");
  const feedback = document.getElementById("contactFeedback");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const subjectError = document.getElementById("subjectError");
  const messageError = document.getElementById("messageError");

  function showErr(el, msg) {
    if (!el) return;
    el.textContent = msg || "";
    el.style.display = msg ? "block" : "none";
  }

  function clearErrs() {
    [nameError, emailError, subjectError, messageError].forEach((e) => {
      if (e) {
        e.textContent = "";
        e.style.display = "none";
      }
    });
  }

  // validation
  function validate() {
    clearErrs();
    let ok = true;
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();

    if (!name || name.length < 2) {
      showErr(nameError, "Please enter your name.");
      ok = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      showErr(emailError, "Enter a valid email.");
      ok = false;
    }
    if (!message || message.length < 10) {
      showErr(messageError, "Message is too short.");
      ok = false;
    }
    // honeypot must be empty
    if (honeypot && honeypot.value) {
      ok = false;
    }
    return ok;
  }

  // EmailJS init if available
  if (
    window.emailjs &&
    EMAILJS_USER &&
    EMAILJS_USER !== "YOUR_EMAILJS_USER_ID"
  ) {
    try {
      emailjs.init(EMAILJS_USER);
    } catch (err) {
      console.warn("EmailJS init failed", err);
    }
  }

  async function sendViaEmailJS(payload) {
    // payload: { from_name, from_email, subject, message, to_email }
    if (
      !window.emailjs ||
      !EMAILJS_SERVICE ||
      !EMAILJS_TEMPLATE ||
      EMAILJS_SERVICE === "YOUR_EMAILJS_SERVICE_ID"
    ) {
      throw new Error("EmailJS not configured");
    }
    return emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, payload);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    feedback.textContent = "";
    feedback.className = "form-feedback";

    if (!validate()) {
      feedback.textContent = "Please fix the errors and try again.";
      feedback.className = "form-feedback error";
      return;
    }

    // Build payload
    const payload = {
      from_name: nameEl.value.trim(),
      from_email: emailEl.value.trim(),
      subject: subjectEl.value.trim() || "(no subject)",
      message: messageEl.value.trim(),
      to_email: TARGET_EMAIL,
      via: "emailjs",
    };

    // UI lock
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      // Try EmailJS
      await sendViaEmailJS(payload);
      feedback.textContent =
        "Message sent — I'll reply as soon as I can. Thank you!";
      feedback.className = "form-feedback success";
      form.reset();
    } catch (err) {
      console.warn("EmailJS send failed:", err);

      // graceful fallback: try using mailto link (user action), or show instructions
      const mailto = `mailto:${encodeURIComponent(
        TARGET_EMAIL
      )}?subject=${encodeURIComponent(
        payload.subject
      )}&body=${encodeURIComponent(
        "From: " +
          payload.from_name +
          " <" +
          payload.from_email +
          ">\n\n" +
          payload.message
      )}`;
      feedback.innerHTML = `Automatic sending failed. <a href="${mailto}" rel="noopener" target="_blank">Click here to open your email client</a> or try again later.`;
      feedback.className = "form-feedback error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  }

  form.addEventListener("submit", handleSubmit);

  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    form.reset();
    clearErrs();
    feedback.textContent = "";
  });

  // Quick navigation for Read My Blogs CTA (redirects to myBlogs.php if logged in, else to auth)
  const readBlogsBtn = document.getElementById("readBlogsBtn");
  readBlogsBtn?.addEventListener("click", () => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      window.location.href = "category.php";
    } else {
      window.location.href = "auth.html";
    }
  });

  // small UX: hide feedback on input
  [nameEl, emailEl, subjectEl, messageEl].forEach((el) => {
    el.addEventListener("input", () => {
      feedback.textContent = "";
      feedback.className = "form-feedback";
    });
  });
});

/* =============================================
   ############# End of JS ################
============================================= */
