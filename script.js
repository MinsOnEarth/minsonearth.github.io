(function () {
  'use strict';
  const chapterNames = ['Cover', 'A Little About Me', 'Research Questions', 'Selected Projects', 'Writing & Work', 'Field Notes', 'Stay in Touch'];
  const sections = [...document.querySelectorAll('.chapter')];
  const tocItems = [...document.querySelectorAll('.toc-item')];
  const pageDots = [...document.querySelectorAll('.page-dot')];
  const navPrev = document.getElementById('prevChapter');
  const navNext = document.getElementById('nextChapter');
  const shell = document.getElementById('bookShell');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarScrim = document.getElementById('sidebarScrim');
  const bookmarkButton = document.getElementById('bookmarkButton');
  const resumeButton = document.getElementById('resumeButton');
  const toast = document.getElementById('toast');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let animationLock = false;
  let toastTimeout;

  function toastMessage(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
  }
  function getBookmark() {
    try {
      const value = localStorage.getItem('minseoResearchBookmark');
      return value === null ? null : Number(value);
    } catch (_) { return null; }
  }
  function setBookmark(value) {
    try { localStorage.setItem('minseoResearchBookmark', String(value)); return true; } catch (_) { return false; }
  }
  function closeMenu() {
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open table of contents');
  }
  function updateBookmarkUI() {
    const bookmarked = getBookmark();
    const hasBookmark = Number.isInteger(bookmarked) && bookmarked >= 0 && bookmarked < sections.length;
    resumeButton.hidden = !hasBookmark;
    bookmarkButton.textContent = bookmarked === current ? '✓' : '＋';
    bookmarkButton.setAttribute('aria-label', bookmarked === current ? 'Current chapter bookmarked' : 'Bookmark this chapter');
    bookmarkButton.title = bookmarked === current ? 'Current chapter bookmarked' : 'Bookmark this chapter';
    if (hasBookmark) resumeButton.textContent = `↳ Return to ${chapterNames[bookmarked]}`;
  }
  function updateControls() {
    navPrev.disabled = current === 0;
    navNext.disabled = current === sections.length - 1;
    document.getElementById('prevLabel').textContent = current ? chapterNames[current - 1] : '—';
    document.getElementById('nextLabel').textContent = current < sections.length - 1 ? chapterNames[current + 1] : 'The End';
    document.getElementById('chapterCounter').textContent = `${String(current).padStart(2,'0')} / 06  ·  ${chapterNames[current].toUpperCase()}`;
    document.getElementById('readingProgress').style.width = `${((current + 1) / sections.length) * 100}%`;
    tocItems.forEach((item) => {
      const selected = Number(item.dataset.chapter) === current;
      item.classList.toggle('active', selected);
      if (selected) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
    });
    pageDots.forEach((dot) => {
      const selected = Number(dot.dataset.go) === current;
      dot.classList.toggle('active', selected);
      if (selected) dot.setAttribute('aria-current', 'page'); else dot.removeAttribute('aria-current');
    });
    updateBookmarkUI();
  }
  function showPage(index, options = {}) {
    if (index < 0 || index >= sections.length || index === current || animationLock) return;
    const previous = current;
    current = index;
    closeMenu();
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    const duration = prefersReduced.matches ? 0 : 260;
    animationLock = true;
    shell.classList.add('turning');
    shell.classList.toggle('turn-backward', current < previous);
    window.setTimeout(() => {
      sections[previous].classList.remove('is-current');
      sections[previous].hidden = true;
      sections[current].hidden = false;
      sections[current].classList.add('is-current');
      updateControls();
      if (options.updateUrl !== false) history.replaceState(null, '', `#chapter-${current}`);
      shell.classList.remove('turning');
      window.setTimeout(() => { animationLock = false; }, Math.min(duration, 160));
      if (isMobile) document.querySelector('.workspace-meta').scrollIntoView({behavior: prefersReduced.matches ? 'instant' : 'smooth', block:'start'});
    }, Math.round(duration * .55));
  }
  tocItems.forEach(button => button.addEventListener('click', () => showPage(Number(button.dataset.chapter))));
  document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showPage(Number(button.dataset.go))));
  navPrev.addEventListener('click', () => showPage(current - 1));
  navNext.addEventListener('click', () => showPage(current + 1));
  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); showPage(current + 1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); showPage(current - 1); }
    else if (event.key === 'Escape') closeMenu();
  });
  menuToggle.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close table of contents' : 'Open table of contents');
  });
  sidebarScrim.addEventListener('click', closeMenu);
  bookmarkButton.addEventListener('click', () => {
    const stored = setBookmark(current);
    updateBookmarkUI();
    toastMessage(stored ? `Bookmarked: ${chapterNames[current]}` : 'Bookmarks are disabled by your browser');
  });
  resumeButton.addEventListener('click', () => {
    const bookmark = getBookmark();
    if (Number.isInteger(bookmark)) { showPage(bookmark); closeMenu(); }
  });
  const readerMode = document.getElementById('readerMode');
  readerMode.addEventListener('click', () => {
    const active = document.body.classList.toggle('focus-mode');
    readerMode.setAttribute('aria-pressed', String(active));
    readerMode.title = active ? 'Exit focus reading mode' : 'Focus reading mode';
    closeMenu();
    toastMessage(active ? 'Focus reading mode on' : 'Focus reading mode off');
  });

  const advisorButtons = [...document.querySelectorAll('[data-advisor]')];
  const cueButtons = [...document.querySelectorAll('[data-cue]')];
  let advisor = 'ai'; let cue = 'off';
  function renderDemo() {
    document.getElementById('chatAdvisor').textContent = advisor === 'ai' ? 'AI health advisor' : 'Human doctor';
    let text = 'Thanks for explaining. Could you tell me when the discomfort started and how often it occurs?';
    if (cue === 'on') text = 'You mentioned being 25 and spending much of your day seated. When did the upper abdominal discomfort begin, and how often do you feel it?';
    document.getElementById('chatMessage').textContent = text;
    advisorButtons.forEach(button => { const selected = button.dataset.advisor === advisor; button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected)); });
    cueButtons.forEach(button => { const selected = button.dataset.cue === cue; button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected)); });
  }
  advisorButtons.forEach(button => button.addEventListener('click', () => { advisor = button.dataset.advisor; renderDemo(); }));
  cueButtons.forEach(button => button.addEventListener('click', () => { cue = button.dataset.cue; renderDemo(); }));

  document.querySelectorAll('[data-expand]').forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    document.getElementById(`expand-${button.dataset.expand}`).hidden = open;
    button.querySelector('span').textContent = open ? '＋' : '−';
  }));
  document.querySelectorAll('.accordion-head').forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    document.getElementById(button.getAttribute('aria-controls')).hidden = open;
    button.querySelector('.accordion-symbol').textContent = open ? '＋' : '−';
  }));
  let startX = null;
  shell.addEventListener('touchstart', (event) => { if (event.touches.length === 1) startX = event.touches[0].clientX; }, {passive: true});
  shell.addEventListener('touchend', (event) => {
    if (startX === null || event.changedTouches.length !== 1) return;
    const diff = event.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(diff) > 100 && !event.target.closest('button, a, .demo-panel, .accordion')) showPage(current + (diff < 0 ? 1 : -1));
  }, {passive: true});
  const matched = location.hash.match(/^#chapter-([0-6])$/);
  if (matched) {
    current = Number(matched[1]);
    sections.forEach((section, index) => { section.hidden = index !== current; section.classList.toggle('is-current', index === current); });
  }
  updateControls();
})();
