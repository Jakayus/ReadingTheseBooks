(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----------------------------------------------------------------
  // Book grid ordering (single source of truth for card order)
  // Cards are authored as plain HTML; this pass keeps them sorted so
  // you never have to hand-place a card or renumber delay-N classes.
  //   1. by status group  2. within "Finished", by tier
  // Sort is stable, so cards with the same key keep their source order.
  // ----------------------------------------------------------------
  const STATUS_ORDER = {
    'status-reading': 0,
    'status-ongoing-learning': 1,
    'status-ongoing-workbook': 2,
    'status-finished': 3,
    'status-queued': 4,
  };
  const TIER_ORDER = { 'must-read': 0, 'great': 1, 'good': 2 };
  const FINISHED = STATUS_ORDER['status-finished'];

  const rank = (card) => {
    const statusEl = card.querySelector('.status');
    const statusClass = statusEl
      ? [...statusEl.classList].find((c) => c in STATUS_ORDER)
      : undefined;
    const status = statusClass !== undefined ? STATUS_ORDER[statusClass] : 99;
    // Tier only orders within Finished — it's not meaningful elsewhere.
    const tierText = card.querySelector('.book-meta .tier')?.textContent.trim();
    const tier = status === FINISHED && tierText in TIER_ORDER
      ? TIER_ORDER[tierText]
      : (status === FINISHED ? 3 : 0);
    return [status, tier];
  };

  document.querySelectorAll('.grid').forEach((grid) => {
    const cards = [...grid.querySelectorAll(':scope > .book-card')];
    if (cards.length === 0) return; // not a book grid (e.g. landing page)

    cards
      .map((card, i) => ({ card, i, key: rank(card) }))
      .sort((a, b) => a.key[0] - b.key[0] || a.key[1] - b.key[1] || a.i - b.i)
      .forEach(({ card }, index) => {
        grid.appendChild(card); // reorders in place
        card.classList.remove('delay-1', 'delay-2', 'delay-3', 'delay-4');
        if (index >= 1 && index <= 3) card.classList.add(`delay-${index}`);
      });
  });
})();
