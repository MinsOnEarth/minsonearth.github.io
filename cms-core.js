/* Public content renderer — no credentials or private information. */
(() => {
  'use strict';
  const initial = {version: 1, fields: {}, projects: [], publications: [], profileImage: '', cvPdf: '', demo: {}, links: {}};
  let model = structuredClone(initial);
  const clean = (value) => typeof value === 'string' ? value : '';
  // Preserve only basic inline formatting so CMS content cannot execute HTML or JS.
  function safeInline(input) {
    const tmp = document.createElement('template');
    tmp.innerHTML = clean(input);
    const allow = new Set(['EM', 'STRONG', 'B', 'I', 'BR', 'SPAN']);
    function scrub(node) {
      if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
      const out = document.createDocumentFragment();
      if (node.nodeType !== Node.ELEMENT_NODE) return out;
      const safe = allow.has(node.tagName);
      const element = safe ? document.createElement(node.tagName.toLowerCase()) : out;
      if (safe && node.tagName === 'SPAN') {
        const cls=(node.getAttribute('class')||'').split(/\s+/).filter(v=>['edition-dot','kicker-line','status-dash','signature-rule','portrait-dot'].includes(v));
        if(cls.length)element.className=cls.join(' ');
      }
      if (node.tagName === 'BR') return element;
      node.childNodes.forEach(child => element.appendChild(scrub(child)));
      if (['DIV', 'P'].includes(node.tagName)) element.appendChild(document.createElement('br'));
      return element;
    }
    const host = document.createElement('div');
    tmp.content.childNodes.forEach(child => host.appendChild(scrub(child)));
    return host.innerHTML;
  }
  function safeLink(value) {
    try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch (_) { return ''; }
  }
  function appendText(parent, tag, content, className) {
    const n = document.createElement(tag); n.textContent = String(content || '');
    if (className) n.className = className;
    parent.appendChild(n); return n;
  }
  function renderAdded() {
    const projects = document.getElementById('cmsAddedProjects');
    if (projects) {
      projects.replaceChildren();
      (model.projects || []).forEach((item, i) => {
        if (!item || !item.title) return;
        const row = appendText(projects, 'div', '', 'project-list-item cms-extra-project');
        appendText(row, 'div', String(i + 4).padStart(2,'0'), 'project-list-number');
        const body = appendText(row, 'div', '');
        appendText(body,'div',item.year || 'PROJECT','project-year');
        appendText(body,'h3',item.title);
        appendText(body,'p',item.summary || '');
        if(safeLink(item.url)) { const a=appendText(body,'a','VIEW PROJECT ↗','cms-added-link');a.href=safeLink(item.url);a.target='_blank';a.rel='noopener noreferrer'; }
      });
    }
    const pubs = document.getElementById('cmsAddedPublications');
    if (pubs) {
      pubs.replaceChildren();
      (model.publications || []).forEach(item => {
        if (!item || !item.title) return;
        const row = appendText(pubs,'article','','cms-publication-card');
        appendText(row,'div',[item.status||'PUBLICATION',item.year||''].filter(Boolean).join('  ·  '),'cms-pub-meta');
        appendText(row,'h3',item.title);
        appendText(row,'p',item.citation || '');
        if (safeLink(item.url)) { const a = appendText(row,'a','VIEW PAPER / LINK ↗','cms-added-link');a.href=safeLink(item.url);a.target='_blank';a.rel='noopener noreferrer'; }
      });
    }
  }
  function safeLocalAsset(path, type) {
    const val = clean(path);
    return type === 'image' ? (/^assets\/profile\.(jpg|jpeg|png|webp)$/i.test(val) ? val : '') : (/^assets\/cv\.pdf$/i.test(val) ? val : '');
  }
  function apply(next) {
    const safe = next && typeof next === 'object' ? next : {};
    model = {
      version:1,fields: safe.fields && typeof safe.fields === 'object' ? {...safe.fields}: {},
      projects: Array.isArray(safe.projects)?safe.projects:[],
      publications:Array.isArray(safe.publications)?safe.publications:[],
      profileImage: safeLocalAsset(safe.profileImage,'image'),
      cvPdf: safeLocalAsset(safe.cvPdf,'cv'),
      demo: (safe.demo && typeof safe.demo === 'object' && !Array.isArray(safe.demo)) ? {...safe.demo} : {},
      links: (safe.links && typeof safe.links === 'object' && !Array.isArray(safe.links)) ? {...safe.links} : {}
    };
    document.querySelectorAll('[data-cms-key]').forEach(el => {
      const value = model.fields[el.dataset.cmsKey];
      if(typeof value === 'string') el.innerHTML = safeInline(value);
    });
    const photo = document.querySelector('.portrait-placeholder');
    if (photo) {
      const prev = photo.querySelector('.cms-profile-image');
      if(prev)prev.remove();
      photo.classList.toggle('cms-has-image',Boolean(model.profileImage));
      if(model.profileImage){const img=document.createElement('img');img.src=model.profileImage;img.alt='Portrait of Minseo Kim';img.className='cms-profile-image';photo.appendChild(img);}
    }
    document.querySelectorAll('[data-cms-href]').forEach(a=>{
      const proposed=safeLink(model.links[a.dataset.cmsHref]);
      if(proposed)a.href=proposed;
    });
    const email = document.querySelector('.email-address');
    if (email) {
      const value=email.textContent.trim();
      if (/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value)) {
        const link=document.querySelector('.big-email');if(link)link.href=`mailto:${value}`;
      }
    }
    const cv=document.querySelector('a[href="cv.html"], a[data-cms-cv-link]');
    if(cv){cv.href=model.cvPdf||'cv.html';cv.dataset.cmsCvLink='true';}
    const cvEmail=document.querySelector('header a[href^="mailto:"]');
    if(cvEmail && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(cvEmail.textContent.trim()))cvEmail.href='mailto:'+cvEmail.textContent.trim();
    renderAdded();
    document.dispatchEvent(new CustomEvent('cms:updated',{detail:model}));
  }
  const ready = (async () => {
    try {
      const response=await fetch('./content.json',{cache:'no-store'});
      if(response.ok)apply(await response.json());
      else apply(initial);
    } catch (e) {apply(initial);console.info('CMS content unavailable; displaying the built-in website text.');}
    return model;
  })();
  window.researchCMS={ready,apply,get:()=>structuredClone(model),safeInline};
})();
