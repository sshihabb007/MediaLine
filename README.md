# 📸 MediaLine — Photography Gallery

A clean, responsive, and feature-rich personal photo gallery web application built with **HTML**, **Vanilla JavaScript**, **TailwindCSS**, and **PHP (XAMPP)**. MediaLine lets you drop images into a folder and instantly browse them in a beautiful, dark-mode-enabled gallery — complete with lightbox, zoom, keyboard navigation, date filtering, and adaptive grid controls.

> ⚠️ **Image Disclaimer:** All images displayed in this gallery are collected from Google Images and are used for demonstration/personal purposes only. They remain the property of their respective owners.

---

## 🌟 Features Overview

| Feature | Description |
|---|---|
| 🖼️ Masonry Gallery | Responsive multi-column photo grid |
| 🔍 Lightbox Viewer | Full-screen photo viewer with zoom |
| ⌨️ Keyboard Navigation | Arrow keys + Escape to control lightbox |
| 🌙 Dark / Light Mode | Toggle with persistent preference |
| 📅 Date Filtering | Filter by specific date or time range |
| 🔢 Grid Column Slider | Adjust columns from 1 to 10 dynamically |
| ♻️ Auto Thumbnail Gen | PHP auto-generates 250px thumbnails for faster loads |
| 🗂️ Date Grouping | Photos grouped by upload date |
| 🔄 Sort Controls | Sort newest, oldest, or by time range |

---

## 🗂️ Project Structure

```
MediaLine/
├── index.html          # Main gallery UI (HTML + TailwindCSS)
├── generate.php        # PHP script: scans UPLOAD/, creates thumbs, writes photos.json
├── photos.json         # Auto-generated manifest of all photos
├── js/
│   └── script.js       # All gallery logic (rendering, lightbox, filters, keyboard)
└── UPLOAD/
    ├── .gitkeep        # Keeps empty folder tracked by Git
    ├── thumbs/         # Auto-generated 250px thumbnail cache (created by generate.php)
    └── (your images)   # Drop .jpg / .jpeg / .png / .webp files here
```

---

## ⚙️ How It Works

### 1. `generate.php` — Backend Scanner & Thumbnail Generator

When accessed from **localhost**, this PHP script runs automatically on every page load:

1. **Scans** the `UPLOAD/` directory for image files (`.jpg`, `.jpeg`, `.png`, `.webp`).
2. **Generates thumbnails** at 250px width using PHP's GD library (only if not already cached in `UPLOAD/thumbs/`).
   - JPG/JPEG → saved at 60% quality
   - PNG → saved with compression level 8, with alpha transparency support
   - WebP → saved at 60% quality
3. **Writes `photos.json`** — a sorted JSON manifest containing:
   - `url` — path to the full-resolution image
   - `thumb_url` — path to the thumbnail (falls back to full image if thumb fails)
   - `timestamp` — file modification time (`filemtime`) used for sorting
4. Photos are **sorted by timestamp descending** (newest first) before writing JSON.

> On a **static/production host** (e.g. GitHub Pages), `generate.php` won't run. You must pre-generate and commit `photos.json` before deploying.

---

### 2. `index.html` — Gallery Shell

The HTML file defines the overall page layout using **TailwindCSS CDN** with dark-mode class strategy:

- **Sticky Navbar**: Contains the site title, photo count badge, grid slider, sort dropdown, date picker, and theme toggle.
- **Gallery Container** (`#gallery`): The dynamic photo grid rendered by JavaScript.
- **Lightbox Component** (`#lightbox`): A fixed full-screen overlay with:
  - Close button (`#closeLightbox`)
  - Previous button (calls `changePhoto_sshihabb007(-1, event)`)
  - Next button (calls `changePhoto_sshihabb007(1, event)`)
  - High-res image display (`#lightboxImg`) with zoom support

CSS custom rules handle lightbox visibility transitions (`opacity`) and zoom transform (`scale(2)`).

---

### 3. `js/script.js` — Core Gallery Logic

All interactivity is handled in a single script file. Functions and variables are namespaced with the `_sshihabb007` suffix to avoid global conflicts.

#### 🔹 Section 1 — Initialization (`initGallery_sshihabb007`)

```js
async function initGallery_sshihabb007()
```

- On localhost: silently fires `generate.php` to refresh `photos.json` and thumbnails.
- Fetches `photos.json` with a cache-busting timestamp query (`?t=Date.now()`).
- Stores all photos in `allPhotos_sshihabb007[]`.
- Calls `renderGallery_sshihabb007()` to build the DOM.

---

#### 🔹 Section 2 — Render Logic (`renderGallery_sshihabb007`)

```js
function renderGallery_sshihabb007()
```

Handles the full pipeline: filter → sort → group → render.

**Filtering:**
- If a specific date is selected via the date picker, photos are filtered to match that exact calendar date (derived from `timestamp`).
- Otherwise, applies the sort dropdown time range:
  - `today` — last 24 hours
  - `1week` — last 7 days
  - `1month` — last 30 days
  - `2months` — last 60 days
  - `3months` — last 90 days

**Sorting:**
- `oldest` — ascending by timestamp
- All other values — descending by timestamp (newest first)

**Grouping:**
- Photos are grouped by their formatted date string (e.g. `"May 10, 2026"`).
- Each group renders a date header with photo count and a masonry grid below it.

**Gallery Grid:**
- Each photo renders as a `<div>` with a lazy-loaded `<img>` tag.
- Clicking any photo calls `openLightbox_sshihabb007(index)` where `index` is its position in `filteredPhotos_sshihabb007[]`.
- Thumbnails are used for grid display; full-res images load in the lightbox.
- `onerror` fallback: if the thumbnail fails to load, the full image is used instead.
- Hover effect: subtle `scale(1.1)` + brightness dimming via CSS group transitions.

---

#### 🔹 Section 3 — Grid Column Slider

```js
columnSlider_sshihabb007.addEventListener('input', ...)
```

- Range input from **1 to 10** columns.
- Maps each value to a responsive TailwindCSS `columns-*` class combination (e.g. `columns-3 sm:columns-4 md:columns-5 lg:columns-6`).
- Updates all `.gallery-group` elements instantly without re-rendering the full gallery.
- Also adjusts bottom margin of photo cards (`mb-1` for dense grids ≥8, `mb-2 md:mb-4` otherwise).

---

#### 🔹 Section 4 — Sort & Date Filter Controls

```js
sortFilter_sshihabb007.addEventListener('change', ...)
dateFilter_sshihabb007.addEventListener('change', ...)
```

- Changing the sort dropdown clears any active date picker value, then re-renders.
- Selecting a specific date resets sort to `newest` as a fallback, then re-renders.
- Both controls trigger a full `renderGallery_sshihabb007()` call.

---

#### 🔹 Section 5 — Lightbox & Zoom (`openLightbox_sshihabb007`, `changePhoto_sshihabb007`)

```js
window.openLightbox_sshihabb007 = function(index)
window.changePhoto_sshihabb007 = function(direction, event)
```

**Opening:**
- Sets `currentLightboxIndex_sshihabb007` to the clicked photo's index.
- Encodes the full-res URL (handles spaces/special characters via `encodeURIComponent`).
- Adds `.active` class to `#lightbox` (triggers CSS opacity transition to show it).
- Resets zoom state on every open.

**Navigating:**
- `changePhoto_sshihabb007(1, event)` → next photo; wraps to index `0` at the end.
- `changePhoto_sshihabb007(-1, event)` → previous photo; wraps to last photo from the start.
- `event.stopPropagation()` prevents the click from bubbling up and closing the lightbox.

**Closing:**
- Clicking the `#lightbox` backdrop or the `×` close button removes `.active`.

**Zoom:**
- Clicking the image in the lightbox toggles the `.zoomed` class (`scale(2)`, `cursor: zoom-out`).
- Moving the mouse over the zoomed image dynamically shifts `transform-origin` to follow the cursor, creating a smooth pan effect.
- Moving the mouse away resets the origin to `center center`.

---

#### 🔹 Section 6 — Theme Toggle

```js
themeToggle_sshihabb007.onclick = () => { ... }
```

- Toggles the `dark` class on `<html>`.
- Persists preference to `localStorage` under the key `"theme"`.
- On page load: if `localStorage.theme === 'light'`, the `dark` class is removed (page starts in dark mode by default since `<html class="dark">` is set in HTML).

---

#### 🔹 Section 7 — Keyboard Navigation

```js
document.addEventListener('keydown', (e) => { ... })
```

Active **only when the lightbox is open** (`#lightbox` has `.active` class):

| Key | Action |
|-----|--------|
| `→` ArrowRight | Navigate to the **next** photo (loops back to first) |
| `←` ArrowLeft | Navigate to the **previous** photo (loops to last) |
| `Escape` | **Close** the lightbox and reset zoom |

`e.preventDefault()` is called on arrow keys to prevent the page from scrolling while navigating.

---

## 🚀 Getting Started (Localhost with XAMPP)

1. Clone or download this repository into your XAMPP `htdocs` folder:
   ```
   d:\xampp\htdocs\media\
   ```

2. Drop your images (`.jpg`, `.jpeg`, `.png`, `.webp`) into the `UPLOAD/` folder.

3. Start Apache in XAMPP and open:
   ```
   http://localhost/media/
   ```

4. On first load, `generate.php` auto-runs, creates thumbnails, and writes `photos.json`. The gallery renders instantly.

---

## 🌐 Deploying to GitHub Pages / Static Host

Since `generate.php` won't execute on a static host:

1. Run `generate.php` locally on XAMPP first to generate `photos.json` and `UPLOAD/thumbs/`.
2. Commit and push `photos.json` and the `UPLOAD/` folder (with images and thumbs) to GitHub.
3. Enable **GitHub Pages** from the repository `Settings → Pages`.

> The JavaScript reads `photos.json` directly as a static file — no PHP needed at runtime.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic layout |
| TailwindCSS (CDN) | Utility-first responsive styling |
| Vanilla JavaScript (ES6+) | All gallery interactivity and logic |
| PHP 7+ / GD Library | Thumbnail generation and JSON manifest creation |
| XAMPP | Local development server |

---

## 📄 License

This project is for **personal and educational use only**.  
All sample images displayed in the gallery are sourced from **Google Images** and belong to their respective copyright owners. They are not distributed or claimed as original works.

---

*Made with ❤️ by [@sshihabb007](https://github.com/sshihabb007)*
