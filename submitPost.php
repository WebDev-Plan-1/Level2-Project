<?php
require_once __DIR__ . '/php/auth_check.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="assets/images/logo-browser.png" type="image/x-icon">

    <title>Create Your Post - NileNotes</title>
    <meta name="description"
        content="NileNotes is a modern personal blog CMS inspired by Egyptian culture. Share your stories, explore diverse articles, and connect with a vibrant community." />
    <meta name="keywords" content="NileNotes, Blog, Posts, Technology, Travel, Health, Education" />
    <meta name="author" content="NileNotes - Personal Blog CMS" />

    <!-- Swiper / AOS / Fonts / Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Asimovian&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
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

    <!-- Main stylesheet (site-wide) -->
    <link rel="stylesheet" href="css/main.css" />
</head>

<body>

    <!-- Loader -->
    <div id="loader">
        <div class="spinner"></div>
    </div>

    <!-- THEME TOGGLE BUTTON (kept in html, styling in scss, behaviour in theme.js) -->
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode" aria-pressed="false"
        title="Toggle theme">
        <span class="theme-icon"></span>
    </button>

    <!-- Header / Nav (kept same markup, no inline styles) -->
    <header class="navbar sticky">
        <div class="container navbar-container">
            <div class="logo-box">
                <a href="index.html" class="logo-img navbar-logo">
                    <img src="assets/images/logo-browser.png" alt="Logo" loading="lazy" />
                </a>
                <a href="index.html" class="logo-text navbar-logo"><span class="logoSpan">Nile</span>Notes</a>
            </div>

            <nav class="nav-links" id="navLinks" aria-expanded="false">
                <!-- <a href="index.html" class="nav-link-item">Home</a>
                <a href="about-us.html" class="nav-link-item">About</a>
                <a href="category.php?cat=All" class="nav-link-item">Categories</a>
                <a href="submitPost.php" class="nav-link-item">Create a Post</a>
                <a href="contact.php" class="nav-link-item">Contact</a> -->
            </nav>

            <div class="nav-actions">
                <button class="search-toggle" aria-label="Open search"><i
                        class="fa-solid fa-magnifying-glass"></i></button>

                <form class="search-form" id="navbarSearchForm" role="search">
                    <div class="search-wrapper">
                        <input type="text" id="navbarSearchInput" class="search-input" placeholder="Search articles..."
                            aria-label="Search articles" />
                        <button type="button" class="clear-btn" aria-label="Clear search"><i
                                class="fa-solid fa-xmark"></i></button>
                        <small class="char-counter">0 / 50</small>
                    </div>
                    <button type="submit" class="search-submit">Search</button>
                </form>

                <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-controls="navLinks"
                    aria-expanded="false">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Main container -->
    <main class="submit-container" role="main">
        <h1 class="section-title">Submit a New Article</h1>
        <p class="lead">Fill the form below to add a new article. Required fields must be filled before submit.</p>

        <form id="postForm" action="php/submitPost.php" method="POST" enctype="multipart/form-data" novalidate>
            <!-- Title + Category -->
            <div class="form-row">
                <div class="form-col">
                    <label for="title">Title</label>
                    <input id="title" name="title" type="text" placeholder="Article title" required />
                    <div id="titleHelp" class="small">Max 7 words recommended.</div>
                    <div id="titleError" class="error hidden"></div>
                </div>

                <div class="form-col">
                    <label for="category">Category</label>
                    <select id="category" name="category" required>
                        <option value="">-- Select category --</option>
                        <option value="Add New Category">Add New Category</option>
                    </select>
                    <div id="categoryError" class="error hidden"></div>

                    <div id="newCategoryWrap" class="new-category hidden">
                        <input id="newCategory" name="newCategory" type="text" placeholder="Enter new category name" />
                        <div id="newCategoryError" class="error hidden"></div>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="content-row mt-16">
                <label for="content">Content</label>
                <textarea id="content" name="content" placeholder="Write your article..." required></textarea>
                <div id="contentError" class="error hidden"></div>
            </div>

            <!-- Image + Date -->
            <div class="form-row mt-12">
                <div class="form-col">
                    <label for="image">Feature Image</label>
                    <input id="image" name="image" type="file" accept="image/*" />
                    <div id="imageHelp" class="small">Allowed: JPG, JPEG, PNG, WEBP, GIF • Max 3 MB</div>
                    <div id="imageError" class="error hidden"></div>
                    <img id="imagePreview" class="preview-img hidden" alt="Image preview" />
                </div>

                <div class="form-col">
                    <label for="date">Publication Date</label>
                    <input id="date" name="date" type="date" required />
                    <div id="dateError" class="error hidden"></div>
                </div>
            </div>

            <!-- Actions -->
            <div class="form-actions">
                <button type="submit" id="submitBtn" class="btn">Post</button>
                <button type="button" id="resetBtn" class="btn secondary">Reset</button>
                <div id="formFeedback" class="form-feedback small"></div>
            </div>
        </form>
    </main>

    <!-- Footer (unchanged) -->
    <footer class="footer">
        <div class="container footer-container">
            <h2 class="footer-title">NileNotes - Personal Blog CMS</h2>
            <div class="footer-links">
                <a href="index.html" class="footer-link">Home</a>
                <a href="category.php?cat=All" class="footer-link">Categories</a>
                <a href="submitPost.php" class="footer-link">Create a Post</a>
                <a href="contact.php" class="footer-link">Contact</a>
            </div>
            <p class="footer-text">NileNotes is a personal blog CMS designed to share stories and articles on various
                topics. Join our community and start sharing your thoughts today!</p>
            <p class="footer-text">For inquiries, please contact us at <a
                    href="mailto:ahmed.hafez101112131415@gmail.com" class="footer-link">NileNotes@GMAIL</a></p>
            <div class="footer-bottom">
                <div class="footer-left">
                    <p class="footer-credit">Designed by <a href="https://ahmedhafezoffic.netlify.app/" target="_blank"
                            class="footer-link">Ahmed Hafez</a></p>
                    <p class="footer-social">Follow us on:
                        <a href="#" class="footer-link">Github</a> |
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

    <!-- vendor scripts -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/js/all.min.js"
        integrity="sha512-6BTOlkauINO65nLhXhthZMtepgJSghyimIalb+crKRPhvhmsCdnIuGcVbR5/aQY2A+260iC1OPy1oCdB6pSSwQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <!-- Page scripts (module) -->
    <script type="module" src="js/submitPost.js"></script>
</body>

</html>