<?php
require_once __DIR__ . '/php/auth_check.php';
?>

<!doctype html>
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
    <title>My Blogs - NileNotes</title>
    <meta name="description"
        content="NileNotes is a modern personal blog CMS inspired by Egyptian culture. Share your stories, explore diverse articles, and connect with a vibrant community. Discover technology, travel, health, education, and more on NileNotes." />
    <meta name="keywords"
        content="NileNotes, Blog, Blogs, blog, Posts, books, Nature, development, writing, reading, social" />
    <meta name="author" content="NileNotes - Personal Blog CMS" />
    <!-- Swiper CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <!-- AOS Scroll Animation -->
    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
    <!-- Link to fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Asimovian&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

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

    <!-- your header/navbar markup (same as other pages) -->
    <main class="container mainContainer">
        <h1 class="section-title">
            <?php

            $user_fullname = $_SESSION['user']['fullname'];
            // Split fullname into words (by space) and take the first one
            $first_name = explode(" ", trim($user_fullname))[0];
            echo $first_name;
            ?>'s Blogs</h1>
        <p class="small">Here You Can Find Articles You Have Created.</p>

        <!-- Articles will be loaded here -->
        <section class="posts-list">
            <div class="swiper mySwiper">
                <div id="myBlogsContainer" class="swiper-wrapper" aria-live="polite">
                    <!-- Articles will be dynamically inserted here -->
                </div>
                <!-- Controls -->
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </section>
        <!-- <div id="myBlogsContainer" class="posts-grid"></div> -->
        <p id="noPosts" class="hidden">You haven't published any posts yet.</p>
    </main>

    <!-- Footer section -->
    <footer class="footer">
        <div class="container footer-container">
            <h2 class="footer-title">NileNotes - Personal Blog CMS</h2>
            <div class="footer-links">
                <a href="index.html" class="footer-link">Home</a>
                <a href="category.php?cat=All" class="footer-link">Categories</a>
                <a href="submitPost.php" class="footer-link">Create a
                    Post</a>
                <a href="contact.php" class="footer-link">Contact</a>
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
                        <a href="" class="footer-link">Github</a> |
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

    <!-- Swiper JS -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <!-- AOS Scroll Animation JS -->
    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
    <!-- Font Awesome JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/js/all.min.js"
        integrity="sha512-6BTOlkauINO65nLhXhthZMtepgJSghyimIalb+crKRPhvhmsCdnIuGcVbR5/aQY2A+260iC1OPy1oCdB6pSSwQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <!-- Link to main JavaScript file -->
    <script type="module" src="js/myBlogs.js"></script>
</body>

</html>