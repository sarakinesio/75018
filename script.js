// Navigation burger
const navToggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#menu');
if (navToggle && menu){
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    menu.dataset.open = (!expanded).toString();
  });
}

// Copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// Cookie banner
(function(){
  const banner = document.querySelector('.cookie-banner');
  if(!banner) return;
  const key = 'cookie-consent';
  const saved = localStorage.getItem(key);
  if(!saved) banner.hidden = false;
  banner.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-cookie]');
    if(!btn) return;
    localStorage.setItem(key, btn.dataset.cookie);
    banner.hidden = true;
  });
})();

// Simple slider (hero & reviews) — autoplay + dots
document.querySelectorAll('.slider').forEach(initSlider);
function initSlider(slider){
  const track = slider.querySelector('.slides');
  const slides = Array.from(track.children);
  const dotsWrap = slider.querySelector('.dots');
  let idx = 0;
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Aller à la diapositive ' + (i+1));
    b.addEventListener('click', ()=> go(i, true));
    dotsWrap.appendChild(b);
  });
  function go(i, user=false){
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx*100}%)`;
    dotsWrap.querySelectorAll('button').forEach((d, di)=> d.setAttribute('aria-current', di===idx));
    if(user){ reset(); }
  }
  let timer; function reset(){ clearInterval(timer); timer = setInterval(()=> go(idx+1), 5000); }
  go(0); reset();
}

// ---- Google Reviews integration (optional) ----
// Si vous avez un widget tiers (ex. Elfsight) ou utilisez l'API Places, poussez les avis
// dans window.GOOGLE_REVIEWS = [{rating:5, text:'...', author:'...'}, ...];
// Le code ci-dessous remplacera le contenu par les avis reçus.
(function(){
  const data = window.GOOGLE_REVIEWS;
  if(!data || !Array.isArray(data) || !data.length) return;
  const wrap = document.querySelector('#avis .reviews .slides');
  if(!wrap) return;
  wrap.innerHTML='';
  data.slice(0,8).forEach(r => {
    const fig = document.createElement('figure');
    fig.className = 'review';
    const stars = '★★★★★'.slice(0, Math.max(0, Math.min(5, r.rating))) // up to 5
    fig.innerHTML = `<div class="stars" aria-label="${r.rating} étoiles">${'★★★★★'.slice(0, r.rating)}</div>
                     <blockquote>${r.text}</blockquote>
                     <figcaption>— ${r.author || 'Client·e Google'}</figcaption>`;
    wrap.appendChild(fig);
  });
})();


// Reveal au scroll pour .reveal
(function(){
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.style.animationPlayState = 'running';
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  els.forEach(el=>{
    el.style.animationPlayState = 'paused';
    io.observe(el);
  });
})();

/* Parallax doux pour les pétales lavande */
(function(){
  const L = document.querySelector('.petals-left');
  const R = document.querySelector('.petals-right');
  if(!L && !R) return;
  const petals = [...document.querySelectorAll('.petal')];
  const base = petals.map(()=> ({y: Math.random()*40 - 20, r: Math.random()*30 - 15}));
  const onScroll = () => {
    const t = window.scrollY || 0;
    petals.forEach((p, i)=>{
      const y = base[i].y + t * (0.05 + (i%3)*0.02);
      const r = base[i].r + t * (0.02 + (i%2)*0.01);
      p.style.transform = `translateY(${y}px) rotate(${r}deg)`;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
})();

/* Reveal au scroll (si pas déjà présent) */
(function(){
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.style.animation = 'revealIn .6s cubic-bezier(.2,.7,.2,1) both';
        e.target.style.animationDelay = getComputedStyle(e.target).getPropertyValue('--delay') || '0ms';
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  els.forEach(el=> io.observe(el));
})();


/* Parallax doux pour les lavandes 2D */
(function(){
  const L = document.querySelector('.sprigs-left');
  const R = document.querySelector('.sprigs-right');
  if(!L && !R) return;
  const sprigs = [...document.querySelectorAll('.sprig')];
  const base = sprigs.map(()=> ({y: Math.random()*40 - 20, r: Math.random()*10 - 5, s: 0.96 + Math.random()*0.12}));
  const onScroll = () => {
    const t = window.scrollY || 0;
    sprigs.forEach((el, i)=>{
      const y = base[i].y + t * (0.05 + (i%3)*0.02);
      const r = base[i].r + t * (0.015 + (i%2)*0.008);
      el.style.transform = `translateY(${y}px) rotate(${r}deg) scale(${base[i].s})`;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
})();

/* Slider générique (gère aussi les avis par groupes de 3) */
document.querySelectorAll('.slider').forEach((slider)=>{
  const track = slider.querySelector('.slides');
  if (!track) return;

  // Si c'est le carrousel d'avis, on slide .slide (groupes de 3).
  // Sinon, on slide chaque enfant (images, etc.)
  const panels = slider.classList.contains('reviews')
    ? track.querySelectorAll('.slide')
    : track.children;

  // Mise en page pour le slide horizontal
  track.style.display = 'flex';
  track.style.transition = 'transform .6s ease';
  Array.from(panels).forEach(el => { el.style.flex = '0 0 100%'; });

  const dotsEl = slider.querySelector('.dots');
  if (dotsEl) dotsEl.innerHTML = '';

  let index = 0;
  const total = panels.length;

  function go(n){
    index = (n + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    if (dotsEl){
      Array.from(dotsEl.children).forEach((d,i)=>{
        if (i === index) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
    }
  }

  // Dots
  if (dotsEl){
    for (let i = 0; i < total; i++){
      const b = document.createElement('button');
      b.type = 'button';
      if (i === 0) b.setAttribute('aria-current','true');
      b.addEventListener('click', () => go(i));
      dotsEl.appendChild(b);
    }
  }

  // Auto défilement (pause au survol)
  let timer = setInterval(()=> go(index + 1), 6000);
  slider.addEventListener('mouseenter', ()=> clearInterval(timer));
  slider.addEventListener('mouseleave', ()=> timer = setInterval(()=> go(index + 1), 6000));

  // Init
  go(0);
});

// Toggle Calendly: Kinésiologie / Détox
(function(){
  const container = document.querySelector('#rdv');
  if (!container) return;

  const buttons = container.querySelectorAll('.cal-switch-btn');
  const kine = container.querySelector('#cal-kine');
  const detox = container.querySelector('#cal-detox');

  if (!buttons.length || !kine || !detox) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.cal; // "kine" ou "detox"

      // état visuel des boutons
      buttons.forEach(b => b.classList.toggle('is-active', b === btn));
      buttons.forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));

      // afficher/masquer les panneaux
      const showKine = (target === 'kine');
      kine.hidden = !showKine;
      detox.hidden = showKine;

      // remonter au début du widget après switch (optionnel)
      const card = btn.closest('.card');
      if (card) card.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
})();
