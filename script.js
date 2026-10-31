(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const R = (a, b) => a + Math.random() * (b - a);
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches, small = innerWidth < 700;
  const make = (cls, css, parent) => { const e = document.createElement('i'); e.className = cls; e.style.cssText = css; parent.append(e); return e; };
  const cols = ['#B83D5A', '#F18BA4', '#FFD3DC', '#8f2a45'], pick = () => cols[Math.floor(R(0, cols.length))];

  /* ---------- scene system ---------- */
  const scenes = $$('.scene'); let cur = -1;
  scenes.forEach(s => $$('.rv', s).forEach((e, i) => e.style.setProperty('--i', i)));
  function go(n) {
    if (n === cur) return;
    const first = cur < 0;
    scenes[cur]?.classList.remove('on');
    scenes[n].classList.add('on');
    $('.wrap', scenes[n]).scrollTop = 0;
    cur = n; document.body.dataset.s = n;
    if (!first) setTimeout(() => { const h = $('h1,h2', scenes[n]); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }, 1300);
  }
  $$('[data-go]').forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));

  /* ---------- ambience visuals ---------- */
  $$('.sk').forEach(el => { for (let i = 0, n = rm ? 25 : small ? 40 : 70; i < n; i++) make('st', `left:${R(0, 100)}%;top:${R(0, 100)}%;--z:${R(1, 2.4)}px;--d:${R(2, 6)}s;animation-delay:${-R(0, 6)}s`, el); });
  $$('.gl').forEach(el => { if (!rm) for (let i = 0; i < 18; i++) make('gp', `left:${R(0, 100)}%;--s:${R(2, 5)}px;--t:${R(10, 20)}s;--x:${R(-8, 8)}vw;animation-delay:${-R(0, 20)}s`, el); });
  if (!rm) {
    for (let i = 0, n = small ? 14 : 24; i < n; i++) make('petal', `left:${R(0, 100)}%;--s:${R(9, 20)}px;--t:${R(12, 22)}s;--x:${R(-20, 20)}vw;--c:${pick()};animation-delay:${-R(0, 22)}s`, $('#fall'));
    const ops = $('#ops');
    for (let i = 0, n = small ? 40 : 70; i < n; i++) {
      const y = Math.pow(Math.random(), 1.4); // more petals toward the horizon
      make('op', `top:${56 + y * 42}%;left:${R(-8, 100)}%;--s:${(4 + y * 15).toFixed(1)}px;--t:${(R(55, 95) - y * 30).toFixed(0)}s;--x:${R(18, 40)}vw;--c:${pick()};animation-delay:${-R(0, 90)}s`, ops);
    }
    const s2 = $('#s2'), rips = $('#rips'); let last = 0;
    const rip = e => { if (e.clientY < innerHeight * .55) return; const r = make('rip', `left:${e.clientX}px;top:${e.clientY}px`, rips); r.onanimationend = () => r.remove(); };
    s2.addEventListener('pointerdown', rip);
    s2.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      ops.style.transform = `translate(${(e.clientX / innerWidth - .5) * -22}px,${(e.clientY / innerHeight - .5) * -8}px)`;
      if (e.timeStamp - last > 160) { last = e.timeStamp; rip(e); }
    });
  }

  /* ---------- gate ---------- */
  // Playful entrance, not security: the secret is visible in this file.
  const SECRET = 'pino', norm = v => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); // accepte « Pino », « ma Pino Pino », « cher pino »…
  $('#gate').addEventListener('submit', e => {
    e.preventDefault();
    const err = $('#err');
    if (norm($('#nick').value).includes(SECRET)) { err.textContent = ''; go(1); return; }
    err.textContent = "Pas tout à fait, douce âme. Pense au petit surnom qui veut dire « ma douce petite ». 🌷";
    err.classList.remove('pop'); void err.offsetWidth; err.classList.add('pop');
  });
  $('#hintBtn').addEventListener('click', e => {
    const h = $('#hint'); h.hidden = false; h.classList.add('pop'); e.target.setAttribute('aria-expanded', 'true');
  });

  /* ---------- garden letters (nothing is stored or sent) ---------- */
  const Q = [
    ['Le lieu', 'Si tu pouvais passer une soirée paisible n’importe où dans le monde, avec un ciel parfait et nulle part ailleurs où être, où ton cœur t’emmènerait-il ?'],
    ['La conversation', 'De quoi pourrais-tu parler pendant des heures sans jamais t’ennuyer — et regretter de ne pas avoir plus de temps pour en parler ?'],
    ['Le cœur', 'Selon toi, qu’est-ce qui fait qu’une personne se sent vraiment aimée : les mots qu’elle entend, les petites choses dont on se souvient, ou la façon dont on est présent pour elle ?']
  ];
  const L = $('#letter'); let opener;
  $$('.rb').forEach(b => b.addEventListener('click', () => {
    const q = Q[+b.dataset.k]; opener = b;
    $('#lt').textContent = q[0]; $('#lq').textContent = q[1]; $('#lrose').style.color = b.dataset.c;
    L.hidden = false; $('#lx').focus();
  }));
  const closeL = () => { if (L.hidden) return; L.hidden = true; opener?.focus(); };
  $('#lx').addEventListener('click', closeL);
  L.addEventListener('click', e => { if (e.target === L) closeL(); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') closeL();
    if (e.key === 'Tab' && !L.hidden) { e.preventDefault(); $('#lx').focus(); }
  });

  /* ---------- chocolate ---------- */
  const g = $('#gift');
  g.addEventListener('click', () => {
    const o = g.classList.toggle('open'); g.setAttribute('aria-pressed', o);
    if (o) $('#s4').classList.add('opened');
  });

  /* ---------- generated ambience (Web Audio; original, not the song) ---------- */
  const sb = $('#snd'); let ac, master, on = false, userOff = false, timer;
  const PENT = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 739.99];
  function build() {
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return false;
    ac = new C(); master = ac.createGain(); master.gain.value = 0;
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
    master.connect(lp); lp.connect(ac.destination);
    [146.83, 220, 293.66, 369.99].forEach((f, i) => { // slow breathing pad
      const o = ac.createOscillator(), g = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain();
      o.frequency.value = f; o.detune.value = (i - 1.5) * 4; g.gain.value = .05;
      l.frequency.value = .05 + i * .03; lg.gain.value = .025;
      l.connect(lg); lg.connect(g.gain); o.connect(g); g.connect(master); o.start(); l.start();
    });
    const len = ac.sampleRate * 4, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0); let k = 0;
    for (let i = 0; i < len; i++) { k = (k + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = k * 3.5; } // brown noise
    const n = ac.createBufferSource(); n.buffer = buf; n.loop = true;
    const nf = ac.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 420;
    const ng = ac.createGain(); ng.gain.value = .5;
    const sw = ac.createOscillator(), sg = ac.createGain(); sw.frequency.value = .09; sg.gain.value = .3; // wave swell
    sw.connect(sg); sg.connect(ng.gain); n.connect(nf); nf.connect(ng); ng.connect(master); n.start(); sw.start();
    return true;
  }
  function note() {
    if (!on) return;
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.frequency.value = PENT[Math.floor(R(0, PENT.length))];
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09, t + .7); g.gain.exponentialRampToValueAtTime(.001, t + 5);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 5.2);
    timer = setTimeout(note, R(3500, 7500));
  }
  sb.addEventListener('click', () => {
    try {
      if (!on) {
        if (!ac && !build()) { sb.textContent = 'Ambiance indisponible'; sb.disabled = true; return; }
        ac.resume(); on = true; master.gain.setTargetAtTime(.35, ac.currentTime, 1.2); note();
      } else {
        on = false; userOff = true; clearTimeout(timer); master.gain.setTargetAtTime(0, ac.currentTime, .4);
        setTimeout(() => { if (!on) ac.suspend(); }, 2200);
      }
      sb.setAttribute('aria-pressed', on); sb.textContent = on ? 'Ambiance activée ♫' : 'Ambiance sonore ♫';
    } catch (e) { sb.textContent = 'Ambiance indisponible'; sb.disabled = true; }
  });

  // Les navigateurs interdisent le son avant un premier geste : la musique démarre dès sa première touche (dont « Ouvrir mon petit monde »).
  const auto = e => {
    if (e.target.closest && e.target.closest('#snd')) return;
    if (!on && !userOff) sb.click();
    removeEventListener('click', auto); removeEventListener('keydown', auto);
  };
  addEventListener('click', auto); addEventListener('keydown', auto);

  requestAnimationFrame(() => go(0));
})();
