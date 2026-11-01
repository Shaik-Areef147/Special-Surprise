/* =====================================================================
   BIRTHDAY SURPRISE  -  app.js
   - scales the 1280x720 stage to any screen
   - slide router (hash based, so the browser Back button works)
   - synthesized sounds (no audio files needed) + optional music
   - confetti, candle blowing, typewriter letter
   ===================================================================== */
(() => {
  'use strict';

  const cfg = JSON.parse(document.getElementById('cfg').textContent);
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const stage  = $('#stage');
  const slides = $$('.slide');
  const byId   = Object.fromEntries(slides.map(s => [s.dataset.slide, s]));
  const FIRST  = 'intro';

  /* ---------------------------------------------------------------
     1. Fit the stage to the screen
     --------------------------------------------------------------- */
  function fit() {
    const W = window.innerWidth, H = window.innerHeight;
    const portrait = cfg.rotate && H > W * 1.05;          // phone held upright
    const s   = portrait ? Math.min(H / 1280, W / 720) : Math.min(W / 1280, H / 720);
    const rot = portrait ? 90 : 0;
    stage.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`;
  }
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', () => setTimeout(fit, 150));
  fit();

  /* ---------------------------------------------------------------
     2. Timers that are cancelled whenever we change slide
     --------------------------------------------------------------- */
  let timers = [];
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  /* ---------------------------------------------------------------
     3. Sound (Web Audio, generated in code) + optional music
     --------------------------------------------------------------- */
  const Sound = (() => {
    let ctx = null, master = null, muted = false, music = null, started = false;
    const btn = $('#mute');

    function ensure() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 0.5;
        master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    }

    function startMusic() {
      if (started || !cfg.music) return;
      started = true;
      music = new Audio(cfg.music);
      music.loop = true; music.volume = 0.45; music.muted = muted;
      music.play().catch(() => { started = false; });
    }

    function tone(freq, t0, dur, type = 'sine', vol = 0.3) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t0);
      g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + dur);
      o.connect(g); g.connect(master);
      o.start(ctx.currentTime + t0); o.stop(ctx.currentTime + t0 + dur + 0.05);
    }

    function noise(dur, f0, f1, vol) {
      const len = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const flt = ctx.createBiquadFilter(); flt.type = 'lowpass';
      flt.frequency.setValueAtTime(f0, ctx.currentTime);
      flt.frequency.exponentialRampToValueAtTime(f1, ctx.currentTime + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      src.connect(flt); flt.connect(g); g.connect(master); src.start();
    }

    const api = {
      unlock() { if (ensure()) startMusic(); },
      tap()   { if (ensure()) { tone(660, 0, .12, 'triangle', .22); tone(990, .06, .14, 'triangle', .16); } },
      blow()  { if (ensure()) noise(1.0, 3200, 300, .55); },
      pop()   { if (ensure()) { noise(.18, 6000, 800, .5); tone(520, 0, .2, 'square', .08); } },
      chime() { if (ensure()) [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * .11, .7, 'sine', .22)); },
      toggle() {
        muted = !muted;
        if (master) master.gain.value = muted ? 0 : 0.5;
        if (music) music.muted = muted;
        btn.classList.toggle('off', muted);
        btn.innerHTML = muted ? '&#128263;' : '&#128266;';
      },
    };
    btn.addEventListener('click', e => { e.stopPropagation(); api.unlock(); api.toggle(); });
    return api;
  })();

  // browsers only allow sound after a user gesture
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, () => Sound.unlock(), { once: false, passive: true }));

  /* ---------------------------------------------------------------
     4. Confetti
     --------------------------------------------------------------- */
  const Confetti = (() => {
    const canvas = $('#confetti'), g = canvas.getContext('2d');
    const colors = ['#6fa3dc', '#2c5aa0', '#bcd8f6', '#f4c95d', '#ff9fc0', '#ffffff', '#14336b', '#8fd0b5'];
    let ps = [], raf = 0, rainUntil = 0;
    const rnd = (a, b) => a + Math.random() * (b - a);

    function spawn(x, y, vx, vy) {
      ps.push({ x, y, vx, vy, w: rnd(7, 14), h: rnd(4, 8), r: rnd(0, 6.3), vr: rnd(-.3, .3),
                c: colors[(Math.random() * colors.length) | 0], life: 0, max: rnd(150, 260) });
    }
    function loop() {
      g.clearRect(0, 0, 1280, 720);
      if (performance.now() < rainUntil && Math.random() < .8) {
        for (let i = 0; i < 3; i++) spawn(rnd(0, 1280), -10, rnd(-1, 1), rnd(2, 4.5));
      }
      ps = ps.filter(p => p.life < p.max && p.y < 760);
      for (const p of ps) {
        p.vy += .22; p.vx *= .992; p.vy *= .992;
        p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r);
        g.globalAlpha = Math.min(1, (p.max - p.life) / 40);
        g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        g.restore();
      }
      if (ps.length || performance.now() < rainUntil) raf = requestAnimationFrame(loop);
      else { raf = 0; g.clearRect(0, 0, 1280, 720); }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    return {
      burst(n = 150, x = 640, y = 420) {
        for (let i = 0; i < n; i++) {
          const a = rnd(0, 6.283), s = rnd(4, 13);
          spawn(x, y, Math.cos(a) * s, Math.sin(a) * s - 8);
        }
        kick();
      },
      rain(ms = 3500) { rainUntil = performance.now() + ms; kick(); },
      clear() { ps = []; rainUntil = 0; },
    };
  })();

  /* ---------------------------------------------------------------
     5. Slide hooks (what happens when a slide appears)
     --------------------------------------------------------------- */
  const visited = new Set();
  let candlesDone = false;

  const hooks = {
    candles() {
      candlesDone = false;
      $('#cake').classList.remove('out');
      $('#cakeHint').style.visibility = 'visible';
    },
    yay() {
      Sound.chime();
      Confetti.burst(160, 640, 300);
      Confetti.rain(4000);
    },
    gifts() {
      $$('.gift').forEach(b => b.classList.toggle('visited', visited.has(b.dataset.gift)));
    },
    letter() {
      visited.add('letter');
      Sound.chime();
      typeLetter();
    },
    flowers() {
      visited.add('flowers');
      Sound.chime();
      later(() => Confetti.burst(70, 900, 360), 500);
    },
    journal() {
      visited.add('journal');
      Sound.chime();
      later(() => Confetti.burst(70, 640, 360), 500);
    },
  };

  /* candle blowing */
  function blowOut() {
    if (candlesDone || current !== 'candles') return;
    candlesDone = true;
    $('#cake').classList.add('out');
    $('#cakeHint').style.visibility = 'hidden';
    Sound.blow();
    later(() => { Sound.pop(); Confetti.burst(150, 640, 360); }, 750);
    later(() => navigate('yay'), 2700);
  }
  $('#cake').addEventListener('click', blowOut);

  /* typewriter letter */
  function typeLetter() {
    const box = $('#letterText');
    box.innerHTML = '';
    box.scrollTop = 0;
    const parts = cfg.letter;
    const els = parts.map(p => {
      const e = document.createElement('p');
      e.className = p.cls || '';
      box.appendChild(e);
      return e;
    });
    let pi = 0, ci = 0;
    const finish = () => {
      clearTimers();
      parts.forEach((p, i) => { els[i].textContent = p.text; els[i].classList.remove('typing'); });
    };
    (function step() {
      if (pi >= parts.length) { els[els.length - 1].classList.remove('typing'); return; }
      const txt = parts[pi].text;
      els.forEach(e => e.classList.remove('typing'));
      els[pi].classList.add('typing');
      if (ci < txt.length) {
        els[pi].textContent = txt.slice(0, ++ci);
        box.scrollTop = box.scrollHeight;
        later(step, 14 + Math.random() * 16);
      } else {
        pi++; ci = 0;
        later(step, 320);
      }
    })();
    box.onclick = finish;            // tap the letter to show everything at once
  }

  /* ---------------------------------------------------------------
     6. Router
     --------------------------------------------------------------- */
  let current = null;

  function show(id) {
    if (!byId[id]) id = FIRST;
    if (id === current) return;
    clearTimers();
    Confetti.clear();
    if (current) byId[current].classList.remove('active');
    current = id;
    const el = byId[id];
    el.classList.remove('active');
    void el.offsetWidth;                 // restart the CSS animations
    el.classList.add('active');
    if (hooks[id]) hooks[id](el);
  }

  const fromHash = () => (location.hash.replace(/^#\/?/, '') || FIRST);

  function navigate(id) {
    if (fromHash() === id) show(id);
    else location.hash = '#/' + id;      // triggers 'hashchange' -> show()
  }
  window.addEventListener('hashchange', () => show(fromHash()));

  // delegated clicks for anything with data-go="slide-id"
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-go]');
    if (!t) return;
    Sound.tap();
    navigate(t.dataset.go);
  });
  // keyboard support for the non-button intro slide
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const t = e.target.closest && e.target.closest('[data-go]');
    if (t && t.tagName !== 'BUTTON') { e.preventDefault(); Sound.tap(); navigate(t.dataset.go); }
  });

  // always start from the very first slide on a fresh visit
  if (!byId[fromHash()] || fromHash() !== FIRST) history.replaceState(null, '', '#/' + FIRST);
  show(FIRST);
})();
