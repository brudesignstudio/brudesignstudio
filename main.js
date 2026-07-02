/* Bru Design Studio — main.js v4 · cinematic · 3D · signature motion */
(function () {
  'use strict';

  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;

  /* ── mobile menu ── */
  const navBtn = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');
  if (navBtn && navMenu) {
    navBtn.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navBtn.setAttribute('aria-expanded', open);
      navBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navBtn.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ── nav glass on scroll ── */
  const nav = document.getElementById('nav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

  /* ── reveal (fallback) ── */
  const io = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { threshold: 0.14 }
  );
  window.bruReveal = function (root) {
    (root || document).querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
  };

  /* Lenis removed — native scroll feels better on this site */

  /* ── GSAP + ScrollTrigger ── */
  if (!prefersReduced && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('fx');

    /* Take over .reveal with GSAP — skip elements with their own targeted animations */
    const skipReveal = new Set([...document.querySelectorAll('.plan, .cap, .step, .flip .row, .blog-grid .post-card')]);
    const revealEl = el => gsap.to(el, {
      opacity: 1, y: 0, duration: 0.95, ease: 'power2.out',
      onComplete: () => { el.classList.add('in'); gsap.set(el, { clearProps: 'all' }); }
    });
    document.querySelectorAll('.reveal').forEach(el => {
      if (skipReveal.has(el)) return;
      gsap.set(el, { opacity: 0, y: 28 });
      ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: () => revealEl(el),
      });
    });

    /* Word-splitter — wraps each word (and whole <em>s) in overflow-mask
       spans so text can rise in. Shared by the hero, page heroes, and
       section headings. */
    function splitWords(el) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      let n;
      while ((n = walker.nextNode())) textNodes.push(n);

      textNodes.forEach(tn => {
        /* Skip text inside <em> — the whole <em> is wrapped as one unit below */
        if (tn.parentElement && tn.parentElement.tagName === 'EM') return;
        const words = tn.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        words.forEach(w => {
          if (/^\s+$/.test(w)) {
            frag.appendChild(document.createTextNode(w));
          } else if (w) {
            const outer = document.createElement('span');
            outer.className = 'hw-wrap';
            const inner = document.createElement('span');
            inner.className = 'hw';
            inner.textContent = w;
            outer.appendChild(inner);
            frag.appendChild(outer);
          }
        });
        tn.parentNode.replaceChild(frag, tn);
      });

      /* Wrap each <em> as a single mask unit, preserving gradient-text styling */
      el.querySelectorAll('em').forEach(em => {
        if (em.closest('.hw')) return;
        const outer = document.createElement('span');
        outer.className = 'hw-wrap';
        const inner = document.createElement('span');
        inner.className = 'hw';
        em.parentNode.insertBefore(outer, em);
        outer.appendChild(inner);
        inner.appendChild(em);
      });
    }

    /* Hero entrance — split h1 words */
    (function heroAnim() {
      const h1 = document.querySelector('.hero h1');
      if (!h1) return;
      splitWords(h1);

      const tl = gsap.timeline({ delay: 0.1 });
      tl.from('.hero h1 .hw', { y: '108%', duration: 0.88, stagger: 0.065, ease: 'power3.out' })
        .from('.hero .tag', { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' }, 0.05)
        .from('.hero-sub', { opacity: 0, y: 20, duration: 0.75, ease: 'power2.out' }, 0.42)
        .from('.hero-actions > *', { opacity: 0, y: 16, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, 0.62)
        .from('.hero-meta > div', { opacity: 0, y: 12, duration: 0.55, stagger: 0.09, ease: 'power2.out' }, 0.82)
        .from('.stage', { opacity: 0, x: 40, duration: 1.1, ease: 'power3.out' }, 0.18);
    })();

    /* Page heroes (about / blog / contact / privacy) — same word rise on load */
    (function pageHeroAnim() {
      const hero = document.querySelector('.page-hero');
      if (!hero) return;
      const h1 = hero.querySelector('h1');
      const tl = gsap.timeline({ delay: 0.1 });
      if (h1) {
        splitWords(h1);
        tl.from(h1.querySelectorAll('.hw'), { y: '108%', duration: 0.85, stagger: 0.06, ease: 'power3.out' });
      }
      const rest = hero.querySelectorAll(':scope > *:not(h1)');
      if (rest.length) tl.from(rest, { opacity: 0, y: 18, duration: 0.6, stagger: 0.09, ease: 'power2.out' }, 0.3);
    })();

    /* Section headings — words rise in as they scroll into view */
    document.querySelectorAll('.sec-head h2, .closer h2, .belief .pull').forEach(h => {
      splitWords(h);
      const words = h.querySelectorAll('.hw');
      if (!words.length) return;
      gsap.from(words, {
        y: '112%', duration: 0.8, stagger: 0.05, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true }
      });
    });

    /* Parallax orbs tied to scroll */
    gsap.to('.orbs .o1', { scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 }, y: -130, ease: 'none' });
    gsap.to('.orbs .o2', { scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 }, y: 100, ease: 'none' });
    gsap.to('.orbs .o3', { scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 }, y: -70, ease: 'none' });

    /* Helper: animate in + lock visible via .in class */
    const lockIn = (sel) => document.querySelectorAll(sel).forEach(el => {
      el.classList.add('in'); gsap.set(el, { clearProps: 'all' });
    });

    /* Capability cards — 3D rotate-in. The cards are built by an inline
       script that runs after main.js, so bind once the DOM is complete. */
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.querySelector('.cap')) return;
      /* neutralize the .reveal base-hide so the tween's end state is visible */
      gsap.set('.cap', { opacity: 1, y: 0 });
      gsap.from('.cap', {
        scrollTrigger: { trigger: '.cap-grid', start: 'top 84%', once: true },
        opacity: 0, rotationY: 28, transformOrigin: 'left center',
        stagger: 0.08, duration: 0.85, ease: 'power3.out',
        onComplete: () => lockIn('.cap')
      });
    });

    /* Steps */
    if (document.querySelector('.step')) {
      gsap.set('.step', { opacity: 1, y: 0 });
      gsap.from('.step', {
        scrollTrigger: { trigger: '.steps', start: 'top 82%', once: true },
        opacity: 0, y: 44, stagger: 0.14, duration: 0.85, ease: 'power2.out',
        onComplete: () => lockIn('.step')
      });
      /* connector line draws across once the steps arrive */
      const steps = document.querySelector('.steps');
      if (steps) ScrollTrigger.create({
        trigger: steps, start: 'top 80%', once: true,
        onEnter: () => steps.classList.add('drawn')
      });
    }

    /* Service plans — staggered reveal, all three identical size (no scale) */
    if (document.querySelector('.plan')) {
      gsap.set('.plan', { opacity: 1, y: 0 });
      gsap.from('.plan', {
        scrollTrigger: { trigger: '.svc-grid', start: 'top 82%', once: true },
        opacity: 0, y: 54, stagger: 0.12, duration: 0.9, ease: 'power3.out',
        onComplete: () => lockIn('.plan')
      });
    }

    /* Old-way → Bru-way rows: slide in from opposite sides, arrow pops */
    document.querySelectorAll('.flip .row').forEach(row => {
      const from = row.querySelector('.from'), ar = row.querySelector('.ar'), to = row.querySelector('.to');
      if (!from || !ar || !to) return;
      gsap.set(row, { opacity: 1, y: 0 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: row, start: 'top 90%', once: true },
        onComplete: () => { row.classList.add('in'); gsap.set([row, from, ar, to], { clearProps: 'all' }); }
      });
      tl.from(from, { x: -38, opacity: 0, duration: 0.6, ease: 'power2.out' })
        .from(ar, { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2.2)' }, 0.15)
        .from(to, { x: 38, opacity: 0, duration: 0.6, ease: 'power2.out' }, 0.25);
    });

    /* Blog grid — cards cascade in together */
    (function blogCards() {
      const cards = document.querySelectorAll('.blog-grid .post-card');
      if (!cards.length) return;
      gsap.set(cards, { opacity: 1, y: 0 });
      gsap.from(cards, {
        scrollTrigger: { trigger: '.blog-grid', start: 'top 86%', once: true },
        opacity: 0, y: 34, stagger: 0.08, duration: 0.7, ease: 'power2.out',
        onComplete: () => lockIn('.blog-grid .post-card')
      });
    })();

    /* FAQ items cascade in (built by an inline script, so wait for DOM) */
    document.addEventListener('DOMContentLoaded', () => {
      const qas = document.querySelectorAll('.faq .qa');
      if (!qas.length) return;
      gsap.from(qas, {
        scrollTrigger: { trigger: '.faq', start: 'top 85%', once: true },
        opacity: 0, y: 26, stagger: 0.09, duration: 0.6, ease: 'power2.out', clearProps: 'all'
      });
    });

    /* Bulldog watermark drifts slower than the page (depth) */
    document.querySelectorAll('.problem .wm-dog').forEach(el => {
      gsap.to(el, {
        y: -70, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });

    /* Showcase text columns float gently against their mockups (desktop) */
    if (matchMedia('(min-width: 901px)').matches) {
      document.querySelectorAll('.showcase-case .sec-head, .showcase-case .belief-text, .work .ctext').forEach(el => {
        gsap.fromTo(el, { y: 26 }, {
          y: -26, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
        });
      });
    }

  } else {
    window.bruReveal();
  }

  /* ── Three.js hero ambient scene ── */
  (function initThree() {
    if (!window.THREE || prefersReduced) return;
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) { return; }

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 2, 0.1, 50);
    camera.position.z = 6;

    /* Warm lights */
    scene.add(new THREE.AmbientLight(0xf7ead0, 0.8));
    const dLight = new THREE.DirectionalLight(0xc7a17a, 1.5);
    dLight.position.set(4, 6, 5);
    scene.add(dLight);

    /* Central wireframe icosahedron */
    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 1),
      new THREE.MeshStandardMaterial({ color: 0xc7a17a, wireframe: true, transparent: true, opacity: 0.28 })
    );
    ico.position.set(2.8, 0.3, -0.6);
    scene.add(ico);

    /* Smaller floating wireframe shapes */
    const configs = [
      { G: THREE.OctahedronGeometry,   args: [0.40],    pos: [-2.6, 1.5,  0.6],  op: 0.26 },
      { G: THREE.TetrahedronGeometry,  args: [0.34],    pos: [ 1.1, 2.1,  1.0],  op: 0.20 },
      { G: THREE.IcosahedronGeometry,  args: [0.29, 0], pos: [-1.3,-1.9,  0.9],  op: 0.22 },
      { G: THREE.OctahedronGeometry,   args: [0.24],    pos: [ 3.6,-1.6,  0.4],  op: 0.18 },
      { G: THREE.TetrahedronGeometry,  args: [0.44],    pos: [-3.1,-0.9, -0.4],  op: 0.16 },
      { G: THREE.IcosahedronGeometry,  args: [0.36, 0], pos: [ 0.6,-2.6, -0.7],  op: 0.20 },
    ];
    const small = configs.map(c => {
      const m = new THREE.Mesh(
        new c.G(...c.args),
        new THREE.MeshStandardMaterial({ color: 0xc7a17a, wireframe: true, transparent: true, opacity: c.op })
      );
      m.position.set(...c.pos);
      m.userData.rx = (Math.random() - 0.5) * 0.013;
      m.userData.ry = (Math.random() - 0.5) * 0.019;
      m.userData.fo = Math.random() * Math.PI * 2;
      scene.add(m);
      return m;
    });

    /* Ambient particle field */
    const N = 180;
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pts = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xc7a17a, size: 0.042, transparent: true, opacity: 0.5 }));
    scene.add(pts);

    /* Resize handler */
    const heroEl = canvas.parentElement;
    function onResize() {
      const w = heroEl.offsetWidth, h = Math.max(heroEl.offsetHeight, 400);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    onResize();
    window.addEventListener('resize', onResize, { passive: true });

    /* Mouse parallax */
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
      mx = (e.clientX / innerWidth  - 0.5) * 2;
      my = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });

    /* Render loop */
    let t = 0;
    (function loop() {
      requestAnimationFrame(loop);
      t += 0.008;
      ico.rotation.x += 0.004;
      ico.rotation.y += 0.006;
      small.forEach(m => {
        m.rotation.x += m.userData.rx;
        m.rotation.y += m.userData.ry;
        m.position.y += Math.sin(t * 0.8 + m.userData.fo) * 0.0016;
      });
      pts.rotation.y += 0.00042;
      pts.rotation.x += 0.00011;
      camera.position.x += (mx * 0.38 - camera.position.x) * 0.038;
      camera.position.y += (-my * 0.24 - camera.position.y) * 0.038;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    })();
  })();

  /* ── Custom cursor ── */
  (function initCursor() {
    if (isTouch) return;
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mx = -200, my = -200, rx = -200, ry = -200;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    }, { passive: true });

    (function loop() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();

    const hoverSel = 'a, button, [data-magnetic], label, summary, .cap, .plan';
    document.querySelectorAll(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hov'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
    });
  })();

  /* ── Magnetic buttons ── */
  (function initMagnetic() {
    if (isTouch || prefersReduced) return;
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
        const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
        el.style.transform = `translate(${dx}px,${dy}px) translateY(-2px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  })();

  /* ── Capability card 3D tilt ── */
  document.addEventListener('DOMContentLoaded', function initCardTilt() {
    if (isTouch || prefersReduced) return;
    document.querySelectorAll('.cap').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientY - r.top  - r.height / 2) / r.height;
        const y = (e.clientX - r.left - r.width  / 2) / r.width;
        el.style.transform = `perspective(700px) rotateX(${(-x * 9).toFixed(2)}deg) rotateY(${(y * 9).toFixed(2)}deg) translateZ(6px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  });

  /* ── Scroll progress bar (all pages) ── */
  (function initProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('span');
    bar.appendChild(fill);
    document.body.appendChild(bar);
    let ticking = false;
    function update() {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      fill.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  /* ── Count-up numbers (dashboard demo KPIs, gym counter) ── */
  window.bruCountUp = function (el) {
    if (el.dataset.counting === '1') return;
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const dec = parseInt(el.dataset.dec || '0', 10);
    const fmt = v => dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
    if (prefersReduced) { el.textContent = fmt(target); return; }
    el.dataset.counting = '1';
    const dur = 1300, t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(tick);
      else el.dataset.counting = '';
    })(t0);
  };

  /* ── Live "washes this week" ticker (car wash demo) ── */
  (function initLiveCount() {
    const el = document.querySelector('[data-live-count]');
    if (!el) return;
    let n = parseInt(el.dataset.liveCount, 10) || 0;
    const render = () => { el.textContent = n.toLocaleString('en-US'); };
    render();
    if (prefersReduced) return;
    let visible = false;
    new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; }), { threshold: 0.2 }).observe(el);
    setInterval(() => { if (visible && !document.hidden) { n++; render(); } }, 3800);
  })();

  /* ── Showcase mockup frames: 3D tilt on hover ── */
  (function initFrameTilt() {
    if (isTouch || prefersReduced) return;
    document.querySelectorAll('.case .frame').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientY - r.top - r.height / 2) / r.height;
        const y = (e.clientX - r.left - r.width / 2) / r.width;
        el.style.transform = `perspective(1100px) rotateX(${(-x * 4).toFixed(2)}deg) rotateY(${(y * 5).toFixed(2)}deg)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  })();

  /* ── Marquee band: skews with scroll velocity ── */
  (function initMarqueeSkew() {
    if (prefersReduced || !window.gsap || !window.ScrollTrigger) return;
    const band = document.querySelector('.marquee-band');
    if (!band) return;
    const clamp = gsap.utils.clamp(-6, 6);
    const proxy = { skew: 0 };
    ScrollTrigger.create({
      onUpdate: self => {
        const skew = clamp(self.getVelocity() / -350);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0, duration: 0.7, ease: 'power3', overwrite: true,
            onUpdate: () => { band.style.transform = `skewX(${proxy.skew.toFixed(2)}deg)`; }
          });
        }
      }
    });
  })();

  /* ── Signature plan 3D tilt + glow ── */
  (function initSigTilt() {
    if (isTouch || prefersReduced) return;
    const sig = document.querySelector('.plan.signature');
    if (!sig) return;
    sig.addEventListener('mousemove', e => {
      const r = sig.getBoundingClientRect();
      const x = (e.clientY - r.top  - r.height / 2) / r.height;
      const y = (e.clientX - r.left - r.width  / 2) / r.width;
      sig.style.transform = `perspective(900px) rotateX(${(-x * 11).toFixed(2)}deg) rotateY(${(y * 11).toFixed(2)}deg) translateZ(10px) scale(1.04)`;
    });
    sig.addEventListener('mouseleave', () => { sig.style.transform = ''; });
  })();

})();
