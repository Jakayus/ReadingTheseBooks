# Future Features

## Series Carousel Card

**Idea:** When a book belongs to a series, instead of one card per book (which spams the grid) or a single combined card (which loses per-book detail), use a single card slot containing a horizontal carousel of book "slides" the user can flip through.

**Why deferred:** Doing this well needs real design + engineering effort (smooth UX, mobile swipe, keyboard arrows, focus management, fade animation parity with the rest of the grid, accessibility, `prefers-reduced-motion`). Not worth tacking onto a routine batch of book additions.

**Approach to consider:**
- CSS `scroll-snap` for the horizontal track so it works without JS on mobile.
- Prev/next buttons (+ arrow-key support) for desktop.
- Each slide: cover, title, status badge, In Brief / Premise, Joel's Quick Comments.
- Dot indicator or "Book X of Y" label below the track.
- Series-level header above the carousel: series title, author, overall status / tier, series-wide premise.
- Honor `prefers-reduced-motion`.

**Stay in scope:** Plain HTML / CSS / JS, no frameworks, no build step — matches the rest of the site.

**Trigger to revisit:** A series with 3+ books on the site. Currently The Murderbot Diaries (7 books) is consolidated into a single non-carousel card in `fiction.html` as a placeholder — replace that card with the carousel when built.

---

## Data-Driven Books (`books.json`)

**Current state:** Books are authored as plain `<article class="book-card">` HTML in `fiction.html` / `nonfiction.html`. Ordering is no longer manual — `script.js` sorts each grid on load (by status, then tier within Finished) and assigns the `delay-N` animation classes. So the HTML is the source of truth and the source order is kept correct by hand only as a no-JS / SEO fallback.

**Idea (deferred):** Move book data into a single `books.json` and render cards from it. This was floated as the books grow. Holding off on purpose:

- **SEO + no-JS.** This is a GitHub Pages site with a custom domain (`CNAME`) and real `<meta description>`s. Client-side fetch-and-render hides every book from crawlers and no-JS visitors until JS runs, plus a blank flash on load. Real regression for a content site.
- **No build step allowed.** `CLAUDE.md` bans build steps/frameworks, so the "generate HTML from JSON at build time" version (which would keep SEO) is out unless that rule changes.
- **Workflow friction.** The `new-book` skill and questionnaire edit HTML directly; a JSON model is a parallel data path to maintain.

For ~15 books the runtime sort in `script.js` already solves the real pain (consistent ordering, no manual delay renumbering) with none of these downsides.

**Trigger to revisit:** the catalog gets large enough that hand-editing HTML is painful (rough line: 40+ books), OR a feature lands that genuinely wants a data layer — search, tag/format/tier filtering, a "currently reading" widget reused across pages, or stats. At that point the right shape is most likely **`books.json` + a tiny generator script that writes the static HTML** (keeps SEO, no client-render), and lifting `CLAUDE.md`'s no-build-step rule for that one script. Pure client-side render is the fallback only if SEO stops mattering.
