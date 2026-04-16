# ReadingTheseBooks — Claude Code Instructions

This repo is a static website (plain HTML/CSS/JS) that publishes some of the books Joel is reading. Each book is an `<article class="book-card">` block in `fiction.html` or `nonfiction.html`.

---

## Adding a New Book

When the user says anything like **"enter new book, start questionnaire"**, **"add a new book"**, **"new book entry"**, or **"let's add a book"**, run through the questionnaire below **one question at a time**, waiting for each answer before asking the next. Do not batch the questions.

### Questionnaire (ask in this order)

1. What is the **title** of the book?
2. Who is the **author**?
3. Is this **fiction or non-fiction**? (determines which page it goes on)
4. What is the **status**?
   - `Currently Reading` — in progress
   - `Finished` — completed
   - `Up Next` — queued, haven't started yet
5. What **format**? (Ebook / Audiobook / Physical)
6. Optional **tier**? (must-read / great / good — or skip)
   - Usually only meaningful for Finished books. If the user says "skip" or "none", omit the tier.
7. **Synopsis** — short summary of what the book is about. The user can type one out, paste from somewhere, or say "skip for now".
8. **What I Like** — what kept them reading or what stuck with them. Same options: type, paste, or "skip for now".

### After collecting answers

1. **Open the right file** — `fiction.html` for fiction, `nonfiction.html` for non-fiction.

2. **Build the new card block** using this template, substituting answers:

   ```html
   <article class="book-card fade-up">
     <div class="book-card-head">
       <div class="book-title-block">
         <h2 class="book-title">[Title]</h2>
         <p class="book-author">by [Author]</p>
         <p class="book-meta">[Format] · <span class="tier">[tier]</span></p>
       </div>
       <span class="status [status-class]">[Status Label]</span>
     </div>
     [body — see below]
   </article>
   ```

3. **Status class + label mapping**:
   | User answer | Class | Label |
   |---|---|---|
   | Currently Reading | `status-reading` | `Currently Reading` |
   | Finished | `status-finished` | `Finished` |
   | Up Next | `status-queued` | `Up Next` |

4. **Meta line**:
   - With tier: `<p class="book-meta">Ebook · <span class="tier">must-read</span></p>`
   - Without tier: `<p class="book-meta">Ebook</p>`

5. **Card body** depends on what the user provided:
   - **Both synopsis and "what I like" skipped** → use a single coming-soon line:
     ```html
     <p class="book-coming-soon">Notes coming soon.</p>
     ```
     (For `Up Next` books, prefer: `<p class="book-coming-soon">On deck — I'll add notes once I start it.</p>`)
   - **Synopsis provided, "what I like" skipped** → render synopsis, then "what I like" with placeholder:
     ```html
     <div class="book-section">
       <h4>Synopsis</h4>
       <p>[synopsis text]</p>
     </div>
     <div class="book-section">
       <h4>What I Like</h4>
       <p class="book-placeholder">Adding my notes here soon.</p>
     </div>
     ```
   - **Both provided** → render both `<div class="book-section">` blocks fully.
   - **"What I Like" provided as a list** → use `<ul class="bullet-list"><li>...</li></ul>` instead of `<p>`.

6. **Insert the card** in the grid (`<div class="grid">`) at the correct position based on status order:
   - All `Currently Reading` cards first
   - Then all `Finished` cards
   - Then all `Up Next` cards
   - Within the same status group, append at the end.

7. **Re-number `delay-N` classes** so the first four cards in the grid have `fade-up`, `fade-up delay-1`, `fade-up delay-2`, `fade-up delay-3`. Cards 5+ keep just `fade-up` (no delay class). This keeps the staggered entrance animation tidy.

8. **Confirm** with the user — show them the snippet you inserted and ask if they want anything tweaked before they commit.

---

## Status / Format / Tier Reference

**Status options** — `status-reading` (Currently Reading), `status-finished` (Finished), `status-queued` (Up Next).

**Format options** — `Ebook`, `Audiobook`, `Physical`. Capitalize the first letter.

**Tier options** (optional, sage-green styled) — `must-read`, `great`, `good`. Lowercase. Skip the entire `<span class="tier">` (and the `· ` separator) if no tier.

---

## Updating an Existing Book

If the user wants to change a book's status, add notes, or update a synopsis, locate the `<article class="book-card">` block in the right file, edit it in place, and re-sort the grid if status changed (Currently Reading → Finished → Up Next order).

---

## File Conventions

- All book cards live inline in `fiction.html` or `nonfiction.html` — there is no separate data file.
- Shared styling is in `styles.css`. The minimal mobile-nav JS is in `script.js`.
- The HTML comment template at the top of each grid is the source of truth for the card structure — keep it in sync if the card schema ever changes.
- Don't introduce frameworks, build steps, or dependencies. Plain HTML/CSS/JS only.
