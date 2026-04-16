# Reading These Books

A public, plain-HTML reading log — what I'm reading, what I've finished, and how I find books worth reading.

Built as a small static site so it's trivial to host on GitHub Pages and easy to update by hand whenever I pick up or finish a book.

## Pages

- **`index.html`** — landing page with links to the three sections
- **`fiction.html`** — fiction I'm reading or have read
- **`nonfiction.html`** — non-fiction I'm reading or have read
- **`tips.html`** — how I find, choose, and get books

## Tech

Plain HTML, CSS, and a small bit of JavaScript. No frameworks, no build step, no dependencies. The site uses [Inter](https://fonts.google.com/specimen/Inter) and [Fraunces](https://fonts.google.com/specimen/Fraunces) from Google Fonts.

```
ReadingTheseBooks/
├── index.html
├── fiction.html
├── nonfiction.html
├── tips.html
├── styles.css
├── script.js
└── README.md
```

## Adding a book

Open `fiction.html` or `nonfiction.html`. Near the top of the book grid you'll find an HTML comment with a copy-paste template — duplicate that `<article class="book-card">` block, then fill in the fields:

- **Title** and **author**
- **Meta line** — format (`Ebook` / `Audiobook` / `Physical`) and an optional tier (e.g. `must-read`, `great`)
- **Status badge** — one of:
  - `status-reading` → `Currently Reading`
  - `status-finished` → `Finished`
  - `status-queued` → `Up Next`
- **Synopsis** — a short, spoiler-light summary
- **What I Like** — what kept you reading, or what's stuck with you since

If a book doesn't have notes yet, drop in `<p class="book-coming-soon">Notes coming soon.</p>` instead of the synopsis/what-I-like sections.

Commit, push, and the site updates.

## Running locally

Just open any of the HTML files in a browser:

```sh
open index.html
```

Or, if you want a real local server (recommended for clean relative paths):

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Hosting

This repo is built to be served by [GitHub Pages](https://pages.github.com/). Enable Pages in the repo settings (Settings → Pages → Source: `main` branch, `/` root) and the site will be live at `https://<username>.github.io/ReadingTheseBooks/`.
