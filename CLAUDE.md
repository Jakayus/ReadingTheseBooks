# ReadingTheseBooks — Claude Code Instructions

This repo is a static website (plain HTML/CSS/JS) that publishes some of the books Joel is reading. Each book is an `<article class="book-card">` block in `fiction.html` or `nonfiction.html`.

---

## Adding a New Book

When the user says anything like **"enter new book, start questionnaire"**, **"add a new book"**, **"new book entry"**, or **"let's add a book"**, run through the questionnaire below **one question at a time**, waiting for each answer before asking the next. Do not batch the questions unless the user explicitly opts into batching (e.g., adding a series of books with shared answers).

### Questionnaire (ask in this order)

1. What is the **title** of the book?
2. Who is the **author**?
3. Is this **fiction or non-fiction**? (determines which page it goes on)
4. What is the **status**?
   - `Currently Reading` — in progress
   - `Finished` — completed
   - `Up Next` — queued, haven't started yet
   - `Ongoing Learning` — reference / how-to book read over a long stretch
   - `Ongoing Workbook` — workbook worked through over time
5. What **format**? (Ebook / Audiobook / Physical)
6. Optional **tier**? (must-read / great / good — or skip)
   - Usually only meaningful for Finished books. If the user says "skip" or "none", omit the tier.
7. **Short description** — a couple of sentences on what the book is about. Renders as **In Brief** on non-fiction cards or **Premise** on fiction cards. The user can type one out, paste from somewhere, say `lookup` for a web / Open Library suggestion, or `skip for now`.
8. **Joel's Quick Comments** — the user's personal take (the one idea that stuck with them, or pace / feel / what worked / what didn't). Type, paste, list, or `skip for now`. For Currently Reading books, use the placeholder line instead (see Card body below).

### Cover lookup (automatic, after the questionnaire)

After all answers are collected, look up the book to get a cover URL:

1. Try `https://openlibrary.org/search.json?title={title}&author={author}&limit=1` (URL-encode the title and author).
2. From `docs[0]`:
   - If `cover_i` exists → cover URL = `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg?default=false`
   - Else if `isbn[0]` exists → cover URL = `https://covers.openlibrary.org/b/isbn/{isbn[0]}-M.jpg?default=false`
   - Else → set src directly to the Unsplash placeholder: `https://images.unsplash.com/photo-1568667256531-7d5ac92eaa7a?w=400&auto=format&fit=crop&q=80`
3. Optionally surface to the user (only if the user skipped the relevant questionnaire field):
   - `docs[0].isbn[0]` as a possible ISBN.
   - `docs[0].first_sentence[0]` or, by fetching `https://openlibrary.org{docs[0].key}.json`, the `description` field as a **synopsis suggestion** they can accept, edit, or skip.

The `?default=false` is important — it makes Open Library return 404 for missing covers instead of a 1×1 transparent gif, which lets the `onerror` handler in the `<img>` tag swap in the placeholder cleanly.

**Sandbox fallback:** Some execution environments block direct calls to `openlibrary.org` from `curl` / `WebFetch`. If the search API isn't reachable, use `WebSearch` to find a publisher / Goodreads / Amazon blurb and grab the ISBN from those results, then build the cover URL by ISBN as above. The browser fetches the cover at page render time, so the URL itself works fine even when the JSON API is blocked from this side.

### After collecting answers

1. **Open the right file** — `fiction.html` for fiction, `nonfiction.html` for non-fiction.

2. **Build the new card block** using this template, substituting answers:

   ```html
   <article class="book-card fade-up">
     <div class="book-card-head">
       <img class="book-cover"
            src="[cover URL from lookup step]"
            alt="Cover of [Title] by [Author]"
            loading="lazy"
            onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1568667256531-7d5ac92eaa7a?w=400&amp;auto=format&amp;fit=crop&amp;q=80';">
       <div class="book-title-block">
         <h2 class="book-title">[Title]</h2>
         <p class="book-author">by [Author]</p>
         <p class="book-meta">[Format] · <span class="tier">[tier]</span></p>
       </div>
       <span class="status [status-class]">[Status Label]</span>
     </div>
     [body — see step 5]
   </article>
   ```

   If the cover lookup pointed straight at the Unsplash placeholder (no Open Library hit), drop the `onerror` attribute — there's nothing to fall back to. Otherwise always include it.

3. **Status class + label mapping**:
   | User answer | Class | Label |
   |---|---|---|
   | Currently Reading | `status-reading` | `Currently Reading` |
   | Finished | `status-finished` | `Finished` |
   | Up Next | `status-queued` | `Up Next` |
   | Ongoing Learning | `status-ongoing-learning` | `Ongoing Learning` |
   | Ongoing Workbook | `status-ongoing-workbook` | `Ongoing Workbook` |

4. **Meta line**:
   - With tier: `<p class="book-meta">Ebook · <span class="tier">must-read</span></p>`
   - Without tier: `<p class="book-meta">Ebook</p>`

5. **Card body** — fiction uses **Premise** + **Joel's Quick Comments**; non-fiction uses **In Brief** + **Joel's Quick Comments** (note: non-fiction's "In Brief" section adds the `book-section--brief` modifier class for muted styling).

   **Fiction body template:**
   ```html
   <div class="book-section">
     <h4>Premise</h4>
     <p>[short description]</p>
   </div>
   <div class="book-section">
     <h4>Joel's Quick Comments</h4>
     <p>[Joel's take]</p>
   </div>
   ```

   **Non-fiction body template:**
   ```html
   <div class="book-section book-section--brief">
     <h4>In Brief</h4>
     <p>[short description]</p>
   </div>
   <div class="book-section">
     <h4>Joel's Quick Comments</h4>
     <p>[Joel's take]</p>
   </div>
   ```

   **Variants depending on what's provided:**
   - **Currently Reading** → fill In Brief / Premise normally, but use a `book-placeholder` line in Joel's Quick Comments:
     - Non-fiction: `<p class="book-placeholder">Adding my thoughts once I'm done.</p>`
     - Fiction: `<p class="book-placeholder">Still reading — comments coming once I'm done.</p>`
   - **Up Next, both fields skipped** → use a single coming-soon line in place of the body sections: `<p class="book-coming-soon">On deck — I'll add notes once I start it.</p>`
   - **Both fields skipped (other statuses)** → `<p class="book-coming-soon">Notes coming soon.</p>`
   - **Both provided** → render both `<div class="book-section">` blocks fully.
   - **Joel's Quick Comments as a list** → use `<ul class="bullet-list"><li>...</li></ul>` instead of `<p>`.

6. **Insert the card** in the grid (`<div class="grid">`) at the correct position based on status order:
   - `Currently Reading` first
   - then `Ongoing Learning`
   - then `Ongoing Workbook`
   - then `Finished`
   - then `Up Next`
   - Within `Finished`, order by **tier**: `must-read` → `great` → `good` → untiered. Within any other status group, append at the end.

   **Ordering is enforced at runtime by `script.js`.** On page load it sorts the cards in each `.grid` by status (then by tier within Finished) and reassigns the `delay-N` classes, so a card pasted in the wrong spot will still render in the right place. Still author the card in the correct position anyway, so the HTML source stays correct for no-JS visitors and search crawlers.

7. **`delay-N` classes are assigned automatically** by `script.js` (first card none, next three get `delay-1`/`delay-2`/`delay-3`, the rest none), so there's no need to renumber by hand. Just give every new card the base `fade-up` class and the sort pass handles the rest.

8. **Confirm** with the user — show them the snippet you inserted and ask if they want anything tweaked before they commit.

---

## Style Notes (Joel's preferences)

- **No em dashes (`—`)** in "In Brief", "Premise", or "Joel's Quick Comments" prose. Use commas, "but", parentheses, or two shorter sentences instead. (Existing cards that use them are fine; just don't introduce new ones.)
- Keep "In Brief" tight — one or two sentences is the house style.

---

## Status / Format / Tier Reference

**Status options:**
| Class | Label | When to use |
|---|---|---|
| `status-reading` | Currently Reading | Actively reading |
| `status-finished` | Finished | Completed |
| `status-queued` | Up Next | Queued, not started |
| `status-ongoing-learning` | Ongoing Learning | Reference / how-to book worked through over a long stretch |
| `status-ongoing-workbook` | Ongoing Workbook | Workbook worked through over time |

**Format options** — `Ebook`, `Audiobook`, `Physical`. Capitalize the first letter.

**Tier options** (optional, sage-green styled) — `must-read`, `great`, `good`. Lowercase. Skip the entire `<span class="tier">` (and the `· ` separator) if no tier.

---

## Updating an Existing Book

If the user wants to change a book's status, add notes, or update a short description, locate the `<article class="book-card">` block in the right file and edit it in place. If the status or tier changed, move the block to the right spot for source correctness (see the order in step 6), but you don't have to be exact or touch `delay-N` classes — `script.js` re-sorts the grid and reassigns the delays on load.

---

## Series of Books

If the user adds multiple books from the same series, default to **consolidating them into a single card** (one entry for the whole series) rather than spamming the grid with one card per book. Pattern:

- Title: `[Series Name] (Series)` (e.g., `The Murderbot Diaries (Series)`)
- Cover: use the first book's cover
- Status: reflect the most-active state — `Currently Reading` if any are in progress, otherwise `Finished`
- Tier: the user's overall take on the series, or skip if mid-read
- Premise / In Brief: a series-level description, with the individual book titles listed in a second `<p>` inside the same section
- Joel's Quick Comments: a combined comment; mention which book the user is currently on if applicable

A nicer future approach (a horizontal carousel of per-book "slides" within a single card slot) is documented in `NOTES.md` — revisit when there's a second series on the site or when there's bandwidth to do it justice.

---

## File Conventions

- All book cards live inline in `fiction.html` or `nonfiction.html` — there is no separate data file.
- Shared styling is in `styles.css`. The minimal mobile-nav JS is in `script.js`.
- The HTML comment template at the top of each grid is the source of truth for the card structure — keep it in sync if the card schema ever changes.
- Don't introduce frameworks, build steps, or dependencies. Plain HTML/CSS/JS only.
- Deferred / future features go in `NOTES.md`.
