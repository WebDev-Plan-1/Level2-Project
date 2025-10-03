<?php
require_once __DIR__ . '/php/auth_check.php';
?>

<!DOCTYPE html>
<!-- Define document type as HTML5 -->
<html lang="en">

<head>
    <!-- Set character encoding to UTF-8 -->
    <meta charset="UTF-8" />
    <!-- Set viewport for responsive design on all devices -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Favicon -->
    <link rel="icon" href="assets/images/logo-browser.png" type="image/x-icon">
    <!-- Page Title and Meta Tags -->
    <!-- Set the page title shown on browser tab -->
    <title>Contact Us - NileNotes</title>
    <meta name="description"
        content="NileNotes is a modern personal blog CMS inspired by Egyptian culture. Share your stories, explore diverse articles, and connect with a vibrant community. Discover technology, travel, health, education, and more on NileNotes." />
    <meta name="keywords"
        content="NileNotes, Blog, Blogs, blog, Posts, books, Nature, development, writing, reading, social" />
    <meta name="author" content="NileNotes - Personal Blog CMS" />
    <!-- Swiper CSS -->
    <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" /> -->
    <!-- AOS Scroll Animation -->
    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <!-- Link to fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Asimovian&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
    <!-- ============= PREVENT FART (Flash of Incorrect Theme) =============== -->
    <script>
        (function() {
            try {
                const saved = localStorage.getItem("site-theme");
                if (saved === "dark" || saved === "light") {
                    document.documentElement.setAttribute("data-theme", saved);
                } else {
                    // ✅ Default = dark
                    document.documentElement.setAttribute("data-theme", "dark");
                    localStorage.setItem("site-theme", "dark");
                }
            } catch (e) {
                document.documentElement.setAttribute("data-theme", "dark");
            }
        })();
    </script>
    <!-- Main style -->
    <link rel="stylesheet" href="css/main.css" />
</head>

<body>

    <!-- Spinner Loader -->
    <!-- <div id="loader">
        <div class="spinner"></div>
    </div> -->

    <!-- Logo-Branded Loader -->
    <div id="loader">
        <div class="loader-content">
            <img src="assets/images/logo-browser.png" alt="My Blog Logo" class="loader-logo">
            <p class="loader-text">Loading...</p>
        </div>
    </div>

    <!-- THEME TOGGLE BUTTON: place this near end of body -->
    <!-- This button is fixed to the middle-right of the viewport -->
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode" aria-pressed="false"
        title="Toggle theme">
        <!-- Icon inside the button (will be updated by JS) -->
        <span class="theme-icon"></span>
    </button>

    <!-- Header >> Nav -->
    <header class="navbar sticky">
        <div class="container navbar-container">
            <!-- Logo -->
            <div class="logo-box">
                <a href="index.html" class="logo-img navbar-logo">
                    <img src="assets/images/logo-browser.png" alt="Logo" loading="lazy" />
                </a>
                <a href="index.html" class="logo-text navbar-logo">
                    <span class="logoSpan">Nile</span>Notes
                </a>
            </div>

            <!-- Navigation Links -->
            <nav class="nav-links" id="navLinks" aria-expanded="false">
                <!-- <a href="index.html" class="nav-link-item">Home</a>
                <a href="about-us.html" class="nav-link-item">About</a>
                <a href="category.php?cat=All" class="nav-link-item">Categories</a>
                <a href="submitPost.php" class="nav-link-item">Create a Post</a>
                <a href="contact.php" class="nav-link-item">Contact</a> -->
            </nav>

            <!-- Right-side controls -->
            <div class="nav-actions">
                <!-- Search Toggle -->
                <button class="search-toggle" aria-label="Open search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>

                <!-- Hidden Search Form -->
                <form class="search-form" id="navbarSearchForm" role="search">
                    <div class="search-wrapper">
                        <input type="text" id="navbarSearchInput" class="search-input" placeholder="Search articles..."
                            aria-label="Search articles" />
                        <button type="button" class="clear-btn" aria-label="Clear search">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        <small class="char-counter">0 / 50</small>
                    </div>
                    <button type="submit" class="search-submit">
                        <!-- <i class="fa-solid fa-arrow-right"></i> -->
                        Search
                    </button>
                </form>

                <!-- Hamburger -->
                <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-controls="navLinks"
                    aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Main content -->
    <main class="contact-page container" id="main" role="main">
        <section class="contact-hero">
            <div class="hero-left">
                <h1 class="section-title">Get in touch with Ahmed Hafez</h1>
                <p class="lead">
                    I’m available for freelance work, collaboration, or to answer questions about NileNotes.
                    Send a message using the form or use the contact details — I’ll reply as soon as I can.
                </p>

                <div class="cta-row">
                    <button id="readBlogsBtn" class="readBlogsBtn">Read My Blogs</button>
                    <a class="backHomeBtn" href="index.html">Back to Home</a>
                </div>
            </div>

            <div class="hero-right">
                <div class="info-grid">
                    <div class="info-card">
                        <i class="fa-solid fa-envelope"></i>
                        <h4>Email</h4>
                        <a href="mailto:ahmedhafezgames@gmail.com">ahmedhafezgames@gmail.com</a>
                    </div>
                    <div class="info-card">
                        <i class="fa-solid fa-map-marker-alt"></i>
                        <h4>Location</h4>
                        <p>Mansoura, Egypt</p>
                    </div>
                    <div class="info-card">
                        <i class="fa-brands fa-github"></i>
                        <h4>GitHub</h4>
                        <a href="https://github.com/AhmedHafez7-Eng" id="githubLink" rel="noopener"
                            target="_blank">AhmedHafez7-Eng</a>
                    </div>
                    <div class="info-card">
                        <i class="fa-brands fa-linkedin"></i>
                        <h4>LinkedIn</h4>
                        <a href="https://www.linkedin.com/in/ahmedhafez247/" id="linkedinLink" rel="noopener"
                            target="_blank">ahmedhafez247</a>
                    </div>
                </div>
            </div>
        </section>

        <section class="contact-form-section" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" class="section-title">Send me a message</h2>

            <form id="contactForm" class="contact-form" novalidate>
                <!-- honeypot to stop simple bots -->
                <input type="text" name="company" id="honeypot" autocomplete="off" tabindex="-1" class="honeypot" />

                <div class="row">
                    <div class="col">
                        <label for="name">Name <span aria-hidden="true">*</span></label>
                        <input id="name" name="name" type="text" required minlength="2" maxlength="80"
                            placeholder="Your full name" />
                        <div class="field-error" id="nameError" aria-live="polite"></div>
                    </div>

                    <div class="col">
                        <label for="email">Email <span aria-hidden="true">*</span></label>
                        <input id="email" name="email" type="email" required placeholder="your@email.com" />
                        <div class="field-error" id="emailError" aria-live="polite"></div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-full">
                        <label for="subject">Subject</label>
                        <input id="subject" name="subject" type="text" maxlength="120"
                            placeholder="Subject (optional)" />
                        <div class="field-error" id="subjectError" aria-live="polite"></div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-full">
                        <label for="message">Message <span aria-hidden="true">*</span></label>
                        <textarea id="message" name="message" rows="8" required minlength="10"
                            placeholder="Write your message..."></textarea>
                        <div class="field-error" id="messageError" aria-live="polite"></div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" id="contactSubmit" class="btn">Send Message</button>
                    <button type="button" id="contactReset" class="btn ghost">Reset</button>
                    <div id="contactFeedback" class="form-feedback" aria-live="polite"></div>
                </div>

                <!-- optional: list of which service used (for dev) -->
                <input type="hidden" name="via" value="emailjs" />
            </form>
        </section>

        <section class="map-section" aria-label="Location map">
            <h2 class="section-title">Where I am</h2>
            <div class="map-wrap">
                <!-- simple embed pointing to Mansoura (works without API key) -->
                <iframe
                    src="https://maps.google.com/maps?q=Mansoura%2C%20Egypt&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                    loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                    aria-label="Map showing Mansoura, Egypt"></iframe>
            </div>
        </section>
    </main>

    <!-- Footer section -->
    <footer class="footer">
        <div class="container footer-container">
            <h2 class="footer-title">NileNotes - Personal Blog CMS</h2>
            <div class="footer-links">
                <a href="index.html" class="footer-link">Home</a>
                <a href="about.html" class="footer-link">About</a>
                <a href="contact.php" class="footer-link">Contact Us</a>
            </div>
            <p class="footer-text">NileNotes is a personal blog CMS
                designed to share stories and articles on various
                topics. <br>Join our community and start sharing your thoughts today!</p>
            <p class="footer-text">For inquiries, please contact us at <a
                    href="mailto:ahmed.hafez101112131415@gmail.com" class="footer-link">NileNotes@GMAIL</a>

            </p>
            <div class="footer-bottom">
                <div class="footer-left">
                    <p class="footer-credit">Designed by <a href="https://ahmedhafezoffic.netlify.app/" target="_blank"
                            class="footer-link">Ahmed
                            Hafez</a></p>
                    <p class="footer-social">Follow us on:
                        <a href="https://github.com/AhmedHafez7-Eng" class="footer-link">Github</a> |
                        <a href="https://www.linkedin.com/in/ahmedhafez247/" class="footer-link">LinkedIn</a> |
                        <a href="https://www.facebook.com/profile.php?id=100005116839262"
                            class="footer-link">Facebook</a> |
                        <a href="https://www.instagram.com/ahmedhafez247/" class="footer-link">Instagram</a>
                    </p>
                </div>

                <div class="footer-right">
                    <p class="footer-text">Powered by <a href="index.html" class="footer-link">NileNotes</a></p>
                    <p class="footer-text">© 2025 Personal Blog CMS. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>


    <!-- AOS Scroll Animation JS -->
    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
    <!-- Font Awesome JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/js/all.min.js"
        integrity="sha512-6BTOlkauINO65nLhXhthZMtepgJSghyimIalb+crKRPhvhmsCdnIuGcVbR5/aQY2A+260iC1OPy1oCdB6pSSwQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <!-- EmailJS SDK (only required if you use EmailJS) -->
    <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
    <!-- Link to main JavaScript file -->
    <script type="module" src="js/contact.js"></script>
</body>

</html>