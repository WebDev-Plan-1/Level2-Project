# 📌 NileNotes -- Personal Blog CMS (WebDev Plan1 - Level 2)
A multi-page web app to manage and display blog posts with category filtering, article submission, and JSON data handling, styled using CSS/SASS, with light PHP backend processing.

---

## **🎯 Project Goals**
- Learn and apply **SASS** for styling and CSS architecture.
- Use **FlexBox / Grid System** for responsive UI components.
- Apply **JavaScript ES6 basics** (arrow functions, template literals, destructuring, modules, etc..).
- Handle **JSON data** for storing and loading blog posts.
- Build a **category filter & sort** system.
- Show cards inside **trendy sliders** using "Swiper.JS" library.
- Apply different types of **dynamic Pagination**.
- Apply **lazy loading** by creating a single **IntersectionObserver instance** for performance.
- Apply **Skeleton & Blur** styling for images till loading them in viewport.
- Ensure **active navbar item** while switching per pages from URL query string.
- Build a **single article page** with related-category recommendations.
- Create a **blog submission form** and process it with **PHP**.
- Apply **Dark/Light mode** switching.
- Ensure **fully responsive design** across all devices & browsers.
- Write **clear code with comments for every line**.
- Follow **OOP & SOLID principles** where applicable.
- Enhance **SEO, Accessibility, and Performance**.

---

## **🛠 Tools & Technologies**
- **HTML5**
- **CSS3/SASS (SCSS syntax)**
- **JavaScript (ES6)**
- **JSON**
- **PHP (Basic)**
- **Bootstrap 5 (If needed)**
- **Version Control (Git & GitHub)**
- **VS Code Extensions:**
  - Live Server
  - Prettier
  - SASS Compiler
  - Auto Rename Tag
  - JavaScript (ES6) snippets

---

## Main Features

* Homepage

  * Display random featured articles in a trendy slider.

  * Categories section.

  * Dynamic Pagination.

* Category Page

  * Display articles under a selected category.
  
  * Filtering & Sorting system.

  * Responsive flex Box layout.

  * Dynamic Pagination.

* Single Post Page

  * Display every single article information.

  * Related articles section at the bottom.

* Contact Page

  * Contact form.

  * Submit data via PHP (no database, just processing).

* Blog Submission Page

  * Form to add a new blog post.

  * Save data to JSON file (database simulation).

* Instant search bar for articles.

* Dark/Light Mode

* Lazy loading & Skeleton/Blur for images

* Save preferences in localStorage.

* SEO Optimization

* Responsive Design

---

## **📂 Project Structure**

Level2-Project/
│
├── assets/
│ ├── images/
│ └── icons/
│ └── fonts/
├── css/
│ ├── main.css
│ └── main.css.map
├── js/
│ ├── main.js
│ ├── data.json
│ ├── modules/
│ | ├── utils.js
├── scss/
│ |── abstracts/
│ | ├── _variables.scss
│ │ ├── _mixins.scss
│ │ ├── _bootstrap.scss
│ |── base/
│ │ ├── _layout.scss
│ │ ├── _components.scss
│ └── main.scss
├── php/
│ ├── submit.php
│
├── index.html
├── category.php
├── single.html
├── contact.html
└── README.md

---

## **📅 Work Phases**

### **Phase 1 – Setup & Environment**
1. Install Node.js, npm, and SASS Compiler.
2. Create project folder & Git repository.
3. Link GitHub remote repository.
4. Install Bootstrap via CDN or npm.
5. Setup SCSS file structure.

---

### **Phase 2 – Design & Layout**
1. Create Navbar (Bootstrap + custom SCSS).
2. Create Hero Section for the homepage.
3. Build Blogs Layout (FlexBox cards).
4. Style components using **SASS variables, mixins, nesting**.
5. Implement Dark/Light mode toggle.

---

### **Phase 3 – Data Handling**
1. Create a `data.json` file with dummy blog posts.
2. Use **fetch API** to load posts dynamically.
3. Implement **category filter** using ES6.
4. Build single post page loading data dynamically.

---

### **Phase 4 – Form & PHP Integration**
1. Create **"Submit New Post"** form (HTML + Bootstrap).
2. Handle form submission with **PHP** (store in JSON for now).
3. Validate inputs with JavaScript before sending.
4. Show success/error messages dynamically.

---

### **Phase 5 – Optimization**
1. Ensure **accessibility** (ARIA labels, alt text, contrast).
2. Optimize **SEO** (meta tags, structured data).
3. Minify CSS & JS.
4. Add responsive testing across devices.

---

### **Phase 6 – Deployment**
1. Deploy on **GitHub Pages** (Frontend only).
2. For PHP testing, deploy on **000webhost** or **InfinityFree**.
3. Verify functionality & fix bugs.

---

## **💡 Extra Recommended Features**
- Search bar for articles.
- Pagination for posts.
- "Featured Posts" carousel on homepage.
- Save dark/light mode preference in `localStorage`.

---

## **✅ Common Criteria for All Projects**
- Multi-page web app.
- Dark/Light mode.
- OOP & SOLID principles (if applicable).
- Code maintainability & reusability.
- Advanced SEO, Accessibility, and Performance.
- Fully responsive on all devices & browsers.
- Code readability with **comments above every line**.
- Skills & tools distributed based on project needs.

---
