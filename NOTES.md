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
