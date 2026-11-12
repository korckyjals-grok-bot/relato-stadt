/* Mein Tag in der Stadt — interfaz. v1.0.1 */
(function () {
  'use strict';
  var D = window.RELATO_DATA, B = window.RELATO_BANK, E = window.RELATO_ENGINE, SP = window.RelatoSpeech;
  var $ = function (id) { return document.getElementById(id); };
  /* La etiqueta solo dice el tipo de actividad: nunca la respuesta */
  var TYPE = { zu: '🎯 zum / zur', mit: '🚌 mit dem / mit der', wo: '📍 Wo? oder ➡️ Wohin?', wohin: '📍 Wo? oder ➡️ Wohin?', verb: '🧩 El verbo', haus: '🏠 nach Hause / zu Hause',
    cual: '✅ ¿Cuál está bien?', hor: '🎧 Escucha y elige', orden: '🧩 Ordena la frase', story: '📜 Ordena el relato' };
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function show(id) { ['home', 'study', 'play', 'sum'].forEach(function (x) { $(x).classList.toggle('hid', x !== id); }); window.scrollTo(0, 0); }
  function store() { try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return localStorage; } catch (e) { var m = {}; return { getItem: function (k) { return k in m ? m[k] : null; }, setItem: function (k, v) { m[k] = String(v); }, removeItem: function (k) { delete m[k]; } }; } }
  var ST = store();
  function toast(t) { var d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2600); }
  var NOVOICE = '🔇 Este navegador no tiene voz en alemán. Toca 🆘 Ayuda para leer la frase.';
  function speak(text) {
    try {
      /* speech.js espera a que carguen las voces; solo usa voz alemana (de), nunca inglesa */
      if (!SP) { toast(NOVOICE); return; }
      SP.speak(String(text), {
        rate: 0.85,
        onNoVoice: function () { toast(NOVOICE); },
        onError: function (e) { var c = e && (e.error || e.message); if (c === 'interrupted' || c === 'canceled') return; toast('🔇 No se pudo reproducir el audio. Toca 🆘 Ayuda para leer la frase.'); }
      });
    } catch (e) { toast('🔇 No se pudo reproducir el audio.'); }
  }
  function stopSpeak() { try { SP && SP.cancel(); } catch (e) {} }
  function revealAbove(el, bar) {
    try {
      if (!el || el.classList.contains('hid')) return;
      var h = bar && bar.classList.contains('stick') ? bar.offsetHeight : 0;
      var r = el.getBoundingClientRect(), limit = window.innerHeight - h - 12;
      if (r.bottom > limit) {
        var dy = r.bottom - limit, top = $('msg').getBoundingClientRect().top;
        if (el.id === 'exp' && top - dy < 8) dy = Math.max(0, top - 8);
        window.scrollBy(0, dy);
      }
    } catch (e) {}
  }
  function drawCk() { var c = E.getChecks(ST); document.querySelectorAll('.chk').forEach(function (e) { e.classList.toggle('no', c.indexOf(e.dataset.t) < 0); }); }
  function home() { stopTimer(); stopSpeak(); chal = false; drawCk(); $('best').textContent = ST.getItem(E.BK) || 0; document.querySelectorAll('.nm').forEach(function (e) { e.textContent = window.NM(); }); show('home'); }
  document.querySelectorAll('[data-home]').forEach(function (b) { b.onclick = home; });

  /* ---------------- ESTUDIAR ---------------- */
  var STABS = [['story', '📜 Relato'], ['zu', '🎯 zum/zur'], ['mit', '🚌 mit'], ['in', '📍 im/in den'], ['satz', '🧩 Frases']];
  var TITLES = { story: '📜 Mein Tag in der Stadt', zu: '🎯 zum / zur', mit: '🚌 mit dem / mit der', in: '📍 Wo? / Wohin?', satz: '🧩 Frases' };
  var stTab = 'story', stHelp = false;
  function showStudy() { drawStudy(); show('study'); }
  function drawStudy() {
    $('stTabs').innerHTML = STABS.map(function (t) { return '<button class="btn ' + (t[0] === stTab ? 'g' : 'gray') + '" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('');
    $('stTabs').querySelectorAll('button').forEach(function (b) { b.onclick = function () { stTab = b.dataset.tab; stopSpeak(); drawStudy(); }; });
    $('stTitle').textContent = TITLES[stTab];
    var html = '';
    if (stTab === 'story') {
      html = D.STORY.map(function (s, i) {
        return '<div class="storyl"><span class="n">' + (i + 1) + '</span><span class="em" aria-hidden="true">' + s.i + '</span><span class="tx" lang="de">' + esc(s.de) +
          (stHelp ? '<span class="es" lang="es">' + esc(s.es) + '</span>' : '') + '</span><button class="say" data-say="' + esc(s.de) + '" aria-label="Escuchar">🔊</button></div>';
      }).join('') + '<div class="write">✏️ <b>Para escribir bien:</b><ul>' + D.WRITE.map(function (w) { return '<li><b lang="de">' + esc(w.de) + '</b> · ' + esc(w.es) + '</li>'; }).join('') + '</ul></div>';
    } else {
      html = D.CARDS[stTab].map(function (c, i) {
        return '<div class="tipc"><h3 lang="de">' + c.f + '</h3><div class="de" lang="de">' + c.b + '</div>' + (stHelp ? '<p class="es">' + c.es + '</p>' : '') +
          '<button class="say" data-card="' + i + '" aria-label="Escuchar">🔊 Escuchar</button></div>';
      }).join('');
    }
    $('stBody').innerHTML = html;
    $('stBody').querySelectorAll('[data-say]').forEach(function (b) { b.onclick = function () { speak(b.dataset.say); }; });
    $('stBody').querySelectorAll('[data-card]').forEach(function (b) { b.onclick = function () { speak(D.CARDS[stTab][+b.dataset.card].say); }; });
    $('stHelp').textContent = stHelp ? '🙈 Ocultar ayuda' : '🆘 Ayuda';
  }
  $('stHelp').onclick = function () { stHelp = !stHelp; drawStudy(); };
  $('stSayAll').onclick = function () {
    if (stTab === 'story') { speak(D.STORY.map(function (s) { return s.de; }).join(' ')); return; }
    speak(D.CARDS[stTab].map(function (c) { return c.say; }).join('. '));
  };
  $('bStudy').onclick = showStudy;

  /* ---------------- PRACTICAR / DESAFÍO ---------------- */
  var cur = null, score = 0, streak = 0, done = 0, missed = [], answered = false, chal = false, timer = null, left = 0, chalT = [], repeatQ = [], picker = null;
  function sel() { var s = [].slice.call(document.querySelectorAll('#topics input:checked')).map(function (i) { return i.value; }); return s.length ? s : E.TOPICS.slice(); }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function begin(topics, isChal) {
    score = 0; streak = 0; done = 0; missed = []; chal = isChal; finished = false;
    picker = E.makePicker(E.pool(B.items, topics, isChal));
    $('sc').textContent = 0; $('st').textContent = 0; show('play'); stopTimer();
    $('bHelp').classList.toggle('hid', isChal);
    if (chal) {
      left = 60; $('tm').classList.remove('hid'); $('tm').textContent = '⏱️ 60';
      timer = setInterval(function () { left--; $('tm').textContent = '⏱️ ' + left; if (left <= 0) finish(); }, 1000);
    } else $('tm').classList.add('hid');
    next();
  }
  /* La frase con hueco: el hueco está vacío (no muestra letras ni colores de la respuesta) */
  function drawSen(filled) {
    var parts = String(cur.de).split('___');
    $('sen').innerHTML = esc(parts[0]) + (filled ? '<span class="gap ok">' + esc(cur.a) + '</span>' : '<span class="gap" aria-label="hueco">&nbsp;</span>') + esc(parts[1] || '');
  }
  function next() {
    stopSpeak();
    cur = repeatQ.length ? repeatQ.shift() : picker();
    answered = false;
    $('tg').textContent = TYPE[cur.type];
    $('qt').textContent = cur.q;
    $('pic').textContent = cur.pic || ''; $('pic').classList.toggle('hid', !cur.pic);
    if (cur.de) drawSen(false); else $('sen').innerHTML = ''; $('sen').classList.toggle('hid', !cur.de);
    $('listen').classList.toggle('hid', !cur.listen);
    $('cnt').textContent = 'Preguntas: ' + done;
    $('opts').innerHTML = ''; $('opts').className = ''; $('ordBox').innerHTML = ''; $('ordBox').classList.add('hid');
    $('msg').textContent = ''; $('exp').classList.add('hid'); $('nx').classList.add('hid'); $('pAct').classList.remove('stick');
    $('pHelp').classList.add('hid'); $('pHelp').textContent = '🆘 ' + (cur.help || '');
    $('bHelp').textContent = '🆘 Ayuda';
    if (cur.kind === 'orden') return drawOrd();
    var shown = E.optionsFor(cur), short = cur.o.every(function (o) { return o.length <= 8; });
    $('opts').className = cur.stack ? 'stack' : (short ? (shown.length === 4 ? 'two' : 'three') : '');
    shown.forEach(function (o) {
      var b = document.createElement('button'); b.className = 'btn opt'; b.textContent = o; b.lang = 'de'; b.dataset.v = o;
      b.onclick = function () { answer(o, b); }; $('opts').appendChild(b);
    });
    if (cur.listen) speak(cur.say);
  }
  /* Ordenar: toca las fichas en orden; toca una ficha de la línea para devolverla. Al poner todas se revisa. */
  function drawOrd() {
    var box = $('ordBox'); box.classList.remove('hid');
    var L = cur.long ? ' long' : '';
    var chunks = E.shuffleChunks(cur), placed = [];
    box.innerHTML = '<div class="line' + L + '" id="ordLine"><span class="ph">Toca las fichas en orden 👇</span></div><div class="chips' + L + '" id="ordChips"></div><button class="btn gray" id="ordReset">↩️ Borrar</button>';
    var line = $('ordLine'), pool = $('ordChips');
    chunks.forEach(function (c, i) {
      var b = document.createElement('button'); b.className = 'chip'; b.lang = 'de'; b.textContent = c; b.dataset.i = i;
      b.onclick = function () {
        if (answered) return;
        if (b.parentNode === pool) { placed.push(b); line.appendChild(b); }
        else { placed.splice(placed.indexOf(b), 1); pool.appendChild(b); }
        refresh();
        if (placed.length === chunks.length) answer(placed.map(function (x) { return x.textContent; }), null);
      };
      pool.appendChild(b);
    });
    function refresh() { line.querySelector('.ph').classList.toggle('hid', placed.length > 0); pool.classList.toggle('hid', !pool.children.length); }
    $('ordReset').onclick = function () { if (answered) return; placed.slice().forEach(function (x) { pool.appendChild(x); }); placed = []; refresh(); };
  }
  var GOOD = ['¡Muy bien! 🎉', '¡Excelente! ⭐', '¡Correcto! 👏', '¡Lo hiciste genial! 🚀', '¡Súper! 💪', 'Sehr gut! 🇩🇪'];
  function answer(given, el) {
    if (answered) return; answered = true; done++;
    var ok = E.isRight(cur, given), right = E.rightOf(cur);
    if (cur.kind === 'orden') {
      $('ordLine').classList.add(ok ? 'ok' : 'bad'); $('ordReset').classList.add('hid');
      $('ordLine').querySelectorAll('.chip').forEach(function (c) { c.disabled = true; });
    } else {
      [].forEach.call($('opts').children, function (x) { x.disabled = true; if (x.dataset.v === right) x.classList.add('ok'); else if (x !== el) x.classList.add('dim'); });
      if (cur.de) drawSen(true);
    }
    if (ok) { score++; streak++; $('msg').textContent = rnd(GOOD) + (streak >= 3 ? ' ¡Racha de ' + streak + '! 🔥' : ''); }
    else { if (el) el.classList.add('bad'); streak = 0; missed.push(cur); $('msg').textContent = '¡Casi! Mira la respuesta correcta 💡'; }
    $('sc').textContent = score; $('st').textContent = streak; $('cnt').textContent = 'Preguntas: ' + done;
    if (chal) { setTimeout(function () { if (chal && left > 0) next(); }, ok ? 600 : 1800); return; }
    $('exp').innerHTML = 'ℹ️ ' + cur.e + (cur.say ? ' <button class="say" id="expSay" aria-label="Escuchar">🔊 Escuchar</button>' : '');
    if ($('expSay')) $('expSay').onclick = function () { speak(cur.say); };
    $('exp').classList.remove('hid'); $('nx').classList.remove('hid'); $('pAct').classList.add('stick');
    revealAbove($('exp'), $('pAct'));
  }
  var lock = 0;
  $('nx').onclick = function () { if (Date.now() - lock < 400) return; lock = Date.now(); next(); };
  $('bHelp').onclick = function () { var h = $('pHelp'); h.classList.toggle('hid'); $('bHelp').textContent = h.classList.contains('hid') ? '🆘 Ayuda' : '🙈 Ocultar ayuda'; revealAbove(h, $('pAct')); };
  $('listen').onclick = function () { if (cur) speak(cur.say); };
  function rightText(q) {
    if (q.kind === 'orden') return '<span lang="de">' + esc(q.type === 'story' ? q.a.join(' ') : q.a.join(' ') + '.') + '</span>';
    return '<span lang="de">' + esc(q.de ? q.de.replace('___', q.a) : q.a) + '</span>';
  }
  /* v1.0.1 (N7): finish() es idempotente: una segunda llamada (temporizador + Terminar) no sobrescribe el mensaje de marca verde o récord */
  var finished = true;
  function finish() {
    if (finished) return; finished = true;
    stopTimer(); stopSpeak(); var wasChal = chal; chal = false; var t = '¡Buen trabajo, ' + window.NM() + '! 🌟';
    if (wasChal) {
      var res = E.applyChallenge(ST, chalT, score, done);
      if (res.record) t = '🏆 ¡Nuevo récord: ' + score + '!';
      if (res.granted) { drawCk(); t = '✅ ¡Marca verde! ' + score + ' sin errores. ¡Bravo, ' + window.NM() + '!'; }
    }
    $('sumT').textContent = t; $('sumP').textContent = 'Respondiste bien ' + score + ' de ' + done + ' preguntas.' + (wasChal && !E.qualifies(score, done) ? ' Para la marca verde: 13 o más y sin errores.' : '');
    $('sumL').innerHTML = missed.length ? '<h3>Para repasar:</h3><ul>' + missed.map(function (q) { return '<li><b>' + esc(q.q) + '</b><br>✔️ ' + rightText(q) + '</li>'; }).join('') + '</ul>' : '<p>¡No tuviste errores! 🎉</p>';
    $('rep').classList.toggle('hid', !missed.length); show('sum');
  }
  $('bFinish').onclick = finish;
  $('bPractice').onclick = function () { repeatQ = []; begin(sel(), false); };
  $('bChal').onclick = function () { repeatQ = []; chalT = E.TOPICS.slice(); begin(chalT, true); };
  $('rep').onclick = function () { repeatQ = missed.slice(); begin(E.TOPICS.slice(), false); };

  /* ---------------- INICIO ---------------- */
  drawCk(); $('best').textContent = ST.getItem(E.BK) || 0;
  /* Gancho de pruebas: solo existe con ?test=1 en la URL (apagado por defecto) */
  var TEST = false; try { TEST = new URLSearchParams(location.search).get('test') === '1'; } catch (e) {}
  if (TEST) window.__TEST__ = function () {
    return { cur: cur, score: score, done: done, chal: chal, left: left, missed: missed, finish: finish, CK: E.CK, BK: E.BK, getCk: function () { return E.getChecks(ST); },
      setScore: function (s, d) { score = s; done = d; $('sc').textContent = s; $('cnt').textContent = 'Preguntas: ' + d; },
      items: B.items, force: function (id) { var it = B.items.filter(function (x) { return x.id === id; })[0]; if (it) { repeatQ = [it]; next(); } return !!it; } };
  };
})();
