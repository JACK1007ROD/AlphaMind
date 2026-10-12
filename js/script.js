/* ============================================================
   ALPHA MIND CHALLENGE — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── SCROLL PROGRESS BAR ──────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  // ── NAVBAR ───────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // Hamburger toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active nav link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href.endsWith(currentPage) || (currentPage === 'index.html' && href === '../index.html') || (currentPage === '' && href === '../index.html'))) {
      a.classList.add('active');
    }
  });

  // ── COUNTDOWN ────────────────────────────────────────────
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const targetDate = new Date('2025-08-22T09:00:00').getTime();

    function updateCountdown() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        document.getElementById('cd-days').textContent = '00';
        document.getElementById('cd-hours').textContent = '00';
        document.getElementById('cd-mins').textContent = '00';
        document.getElementById('cd-secs').textContent = '00';
        return;
      }

      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const secs  = Math.floor((diff % 60000) / 1000);

      document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
      document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
      document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ── PARTICLE CANVAS ──────────────────────────────────────
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -Math.random() * 0.5 - 0.15;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.7 ? '#C1121F' : '#C9CDD3';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.0015;
        if (this.alpha <= 0 || this.y < -10) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Spawn particles
    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    }
    animate();

    // Pause when not visible
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) cancelAnimationFrame(animId);
      else animate();
    });
    observer.observe(canvas);
  }

  // ── SCROLL REVEAL ────────────────────────────────────────
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObs.observe(el));
  }

  // ── MASONRY GALLERY LIGHTBOX ─────────────────────────────
  const masonryItems = document.querySelectorAll('.masonry-item');
  if (masonryItems.length) {
    // Create lightbox
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `
      <div id="lb-overlay"></div>
      <div id="lb-content">
        <button id="lb-close">✕</button>
        <button id="lb-prev">❮</button>
        <img id="lb-img" src="" alt="">
        <button id="lb-next">❯</button>
      </div>`;
    lb.style.cssText = `display:none;position:fixed;inset:0;z-index:9000;align-items:center;justify-content:center;`;
    document.body.appendChild(lb);

    const lbStyle = document.createElement('style');
    lbStyle.textContent = `
      #lb-overlay{position:absolute;inset:0;background:rgba(0,0,0,.92);}
      #lb-content{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;max-width:90vw;}
      #lb-img{max-height:80vh;max-width:80vw;border:1px solid #C1121F;box-shadow:0 0 40px rgba(193,18,31,.4);}
      #lb-close{position:fixed;top:1.5rem;right:1.5rem;background:none;border:1px solid #C1121F;color:#fff;width:38px;height:38px;cursor:pointer;font-size:1rem;}
      #lb-prev,#lb-next{background:rgba(193,18,31,.2);border:1px solid rgba(193,18,31,.5);color:#fff;width:42px;height:42px;cursor:pointer;font-size:1.1rem;flex-shrink:0;}
      #lb-prev:hover,#lb-next:hover{background:rgba(193,18,31,.5);}`;
    document.head.appendChild(lbStyle);

    let currentIdx = 0;
    const imgs = Array.from(masonryItems).map(i => i.querySelector('img')?.src).filter(Boolean);

    function openLB(idx) {
      currentIdx = idx;
      document.getElementById('lb-img').src = imgs[idx];
      lb.style.display = 'flex';
    }

    masonryItems.forEach((item, i) => {
      if (item.querySelector('img')) item.addEventListener('click', () => openLB(i));
    });

    document.getElementById('lb-close').addEventListener('click', () => lb.style.display = 'none');
    document.getElementById('lb-overlay').addEventListener('click', () => lb.style.display = 'none');
    document.getElementById('lb-prev').addEventListener('click', () => openLB((currentIdx - 1 + imgs.length) % imgs.length));
    document.getElementById('lb-next').addEventListener('click', () => openLB((currentIdx + 1) % imgs.length));
    document.addEventListener('keydown', e => {
      if (lb.style.display !== 'none') {
        if (e.key === 'Escape') lb.style.display = 'none';
        if (e.key === 'ArrowLeft') openLB((currentIdx - 1 + imgs.length) % imgs.length);
        if (e.key === 'ArrowRight') openLB((currentIdx + 1) % imgs.length);
      }
    });
  }

  // ── INSCRIPTION FORM VALIDATION ──────────────────────────
  const form = document.getElementById('inscripcion-form');
  if (form) {
    const rules = {
      nombre:    v => v.trim().length >= 2,
      apellido:  v => v.trim().length >= 2,
      correo:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      telefono:  v => /^\+?[\d\s\-]{7,15}$/.test(v),
      ciudad:    v => v.trim().length >= 2,
      edad:      v => { const n = parseInt(v); return n >= 14 && n <= 70; },
      categoria: v => v !== '',
    };

    function validate(field) {
      const rule = rules[field.name];
      const errEl = field.closest('.form-group')?.querySelector('.form-error');
      if (!rule) return true;
      const valid = rule(field.value);
      field.style.borderColor = valid ? '' : 'var(--rojo-brillante)';
      if (errEl) errEl.classList.toggle('visible', !valid);
      return valid;
    }

    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => validate(field));
      field.addEventListener('input', () => {
        if (field.style.borderColor) validate(field);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = form.querySelectorAll('input[name], select[name], textarea[name]');
      let allValid = true;
      fields.forEach(f => { if (!validate(f)) allValid = false; });

      if (allValid) {
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = '✓ ENVIADO — PRÓXIMAMENTE HABILITADO';
        btn.style.background = 'rgba(212,175,55,.3)';
        btn.style.color = 'var(--dorado)';
        btn.disabled = true;
      }
    });
  }

  // ── DOCUMENT DOWNLOAD PLACEHOLDER ────────────────────────
  document.querySelectorAll('.doc-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const card = btn.closest('.doc-card');
      const title = card?.querySelector('.doc-title')?.textContent || 'Documento';
      alert(`"${title}" estará disponible próximamente.\n\nPara más información escríbenos a info@alphamindchallenge.com`);
    });
  });

  // ── SMOOTH ANCHOR SCROLL ─────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 8 : 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

});


/* ============================================================
   ALPHA MIND CHALLENGE v2 — script.js
   Heurísticas Nielsen aplicadas en JS:
   #1 Visibilidad del estado, #3 Control/libertad,
   #5 Prevención de errores, #9 Mensajes de error claros
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── H1: VISIBILIDAD — Barra de progreso de scroll ──────────
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  // ── H1: VISIBILIDAD — Navbar scroll ────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── H3: CONTROL — Hamburger con estado aria explícito ───────
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      // H1: Visibilidad — bloquear scroll de fondo cuando menú abierto
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Cerrar al hacer clic en enlace
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // H3: Control — cerrar con Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // ── H4: CONSISTENCIA — Active nav link ─────────────────────
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // ── H1: VISIBILIDAD — Contador regresivo ───────────────────
  const countdown = document.getElementById('countdown');
  if (countdown) {
    const target = new Date('2025-08-22T09:00:00').getTime();

    const pad = n => String(n).padStart(2,'0');

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.textContent = '00';
        });
        return;
      }
      const d = document.getElementById('cd-days');
      const h = document.getElementById('cd-hours');
      const m = document.getElementById('cd-mins');
      const s = document.getElementById('cd-secs');
      if (d) d.textContent = pad(Math.floor(diff / 86400000));
      if (h) h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      if (m) m.textContent = pad(Math.floor((diff % 3600000) / 60000));
      if (s) s.textContent = pad(Math.floor((diff % 60000) / 1000));
    };

    tick();
    setInterval(tick, 1000);
  }

  // ── SCROLL REVEAL — IntersectionObserver ───────────────────
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  }

  // ── SMOOTH ANCHOR ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = (navbar?.offsetHeight || 70) + 8;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // ── H6: RECONOCER — Lightbox galería ───────────────────────
  const mItems = document.querySelectorAll('.m-item[data-src], .gallery-3col .g-item[data-src]');
  if (mItems.length) {
    // Crear lightbox
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Vista de imagen');
    lb.innerHTML = `
      <div id="lb-bg"></div>
      <div id="lb-inner">
        <button id="lb-close" aria-label="Cerrar">✕</button>
        <button id="lb-prev" aria-label="Anterior">❮</button>
        <img id="lb-img" src="" alt="Galería Alpha Mind">
        <button id="lb-next" aria-label="Siguiente">❯</button>
      </div>`;

    const st = document.createElement('style');
    st.textContent = `
      #lightbox{display:none;position:fixed;inset:0;z-index:9500;align-items:center;justify-content:center;}
      #lightbox.open{display:flex;}
      #lb-bg{position:absolute;inset:0;background:rgba(0,0,0,.88);}
      #lb-inner{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;max-width:90vw;}
      #lb-img{max-height:82vh;max-width:78vw;border:1px solid rgba(193,18,31,.4);border-radius:2px;box-shadow:0 8px 40px rgba(0,0,0,.7);}
      #lb-close{position:fixed;top:1.2rem;right:1.2rem;background:rgba(17,19,24,.9);border:1px solid rgba(193,18,31,.4);color:#e8eaf0;width:40px;height:40px;border-radius:2px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;}
      #lb-close:hover,#lb-prev:hover,#lb-next:hover{background:rgba(193,18,31,.6);}
      #lb-prev,#lb-next{background:rgba(17,19,24,.8);border:1px solid rgba(255,255,255,.1);color:#e8eaf0;width:44px;height:44px;border-radius:2px;cursor:pointer;font-size:1.1rem;flex-shrink:0;display:flex;align-items:center;justify-content:center;}`;
    document.head.appendChild(st);
    document.body.appendChild(lb);

    const imgs = Array.from(mItems).map(i => i.dataset.src).filter(Boolean);
    let idx = 0;

    const open = i => {
      idx = i;
      document.getElementById('lb-img').src = imgs[idx];
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.getElementById('lb-close').focus();
    };
    const close = () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    };

    mItems.forEach((item, i) => item.addEventListener('click', () => open(i)));
    document.getElementById('lb-bg').addEventListener('click', close);
    document.getElementById('lb-close').addEventListener('click', close);
    document.getElementById('lb-prev').addEventListener('click', () => open((idx - 1 + imgs.length) % imgs.length));
    document.getElementById('lb-next').addEventListener('click', () => open((idx + 1) % imgs.length));
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open((idx - 1 + imgs.length) % imgs.length);
      if (e.key === 'ArrowRight') open((idx + 1) % imgs.length);
    });
  }

  // ── H5/H9: PREVENCIÓN y MENSAJES CLAROS — Validación form ──
  const form = document.getElementById('inscripcion-form');
  if (form) {

    // Mensajes de error en lenguaje natural (H9: Mensajes claros)
    const errorMsg = {
      nombre:    'Ingresa tu nombre (mínimo 2 caracteres)',
      apellido:  'Ingresa tu apellido (mínimo 2 caracteres)',
      correo:    'Ingresa un correo válido, por ejemplo: tu@correo.com',
      telefono:  'Ingresa un número de teléfono válido',
      ciudad:    'Ingresa el nombre de tu ciudad',
      edad:      'La edad debe estar entre 14 y 70 años',
      categoria: 'Elige una categoría para continuar',
    };

    // H5: Prevención — reglas de validación
    const rules = {
      nombre:    v => v.trim().length >= 2,
      apellido:  v => v.trim().length >= 2,
      correo:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      telefono:  v => /^\+?[\d\s\-]{7,15}$/.test(v.trim()),
      ciudad:    v => v.trim().length >= 2,
      edad:      v => { const n = +v; return Number.isInteger(n) && n >= 14 && n <= 70; },
      categoria: v => v !== '',
    };

    const validate = field => {
      const rule = rules[field.name];
      if (!rule) return true;
      const ok = rule(field.value);
      const errEl = field.parentElement.querySelector('.form-error');

      // H1: Visibilidad — estado del campo siempre visible
      field.classList.toggle('invalid', !ok);
      if (errEl) {
        errEl.textContent = ok ? '' : (errorMsg[field.name] || 'Campo inválido');
        errEl.classList.toggle('show', !ok);
      }
      // H5: Prevención — aria-invalid para lectores de pantalla
      field.setAttribute('aria-invalid', !ok);
      return ok;
    };

    // Validar al perder foco (no al teclear — reduce ansiedad cognitiva)
    form.querySelectorAll('input, select, textarea').forEach(f => {
      f.addEventListener('blur', () => validate(f));
      f.addEventListener('input', () => {
        if (f.classList.contains('invalid')) validate(f); // corregir en tiempo real
      });
    });

    // Contador textarea
    const textarea = form.querySelector('textarea[name="comentarios"]');
    const counter  = form.querySelector('.char-count');
    if (textarea && counter) {
      textarea.addEventListener('input', () => {
        counter.textContent = `${textarea.value.length} / 500`;
      });
    }

    // Submit
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = form.querySelectorAll('input[name], select[name]');
      let allOk = true;
      fields.forEach(f => { if (!validate(f)) allOk = false; });

      if (!allOk) {
        // H9: Guiar al primer error
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Éxito — H1: Visibilidad del estado
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = '✓ Solicitud enviada correctamente';
        submitBtn.style.background = 'rgba(201,162,39,.2)';
        submitBtn.style.color = 'var(--gold)';
        submitBtn.style.border = '1px solid var(--gold)';
        submitBtn.disabled = true;
      }

      // Mensaje de confirmación visible
      const notice = document.createElement('p');
      notice.textContent = 'Pronto nos comunicaremos contigo para confirmar tu inscripción.';
      notice.style.cssText = 'margin-top:1rem;font-size:.88rem;color:var(--text-secondary);text-align:center;';
      submitBtn?.parentElement?.appendChild(notice);
    });
  }

  // ── H2: MUNDO REAL — Documentos, alerta contextual ─────────
  document.querySelectorAll('.doc-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      if (btn.getAttribute('href') === '#') {
        e.preventDefault();
        const title = btn.closest('.doc-card')?.querySelector('.doc-title')?.textContent || 'Documento';
        // H9: Mensaje claro con solución alternativa
        alert(`"${title}" estará disponible próximamente.\nPara más información: info@alphamindchallenge.com`);
      }
    });
  });

  // ── H3: CONTROL — Pausar carruseles al hacer hover ─────────
  document.querySelectorAll('.testimonios-track, .sponsors-track').forEach(track => {
    const parent = track.parentElement;
    parent.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    parent.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  });

  // ── H7: FLEXIBILIDAD — Filtros de galería ──────────────────
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.removeAttribute('aria-pressed');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    });
  });

});