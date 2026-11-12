/* Mein Tag in der Stadt — lógica pura (sin DOM): puntaje, marca verde, selección sin repetir. v1.0.0 */
(function (g) {
  'use strict';
  var CK = 'aleman_check_relato', BK = 'relato_best', TOPICS = ['zu', 'mit', 'in', 'satz'];
  function qualifies(score, done) { return score >= 13 && done === score; }
  function getChecks(st) { try { var v = JSON.parse(st.getItem(CK) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  /* Guarda récord y marcas. Devuelve {record, granted, checks} */
  function applyChallenge(st, topics, score, done) {
    var out = { record: false, granted: false, checks: getChecks(st) };
    var best = +(st.getItem(BK) || 0);
    if (score > best) { st.setItem(BK, String(score)); out.record = true; }
    if (qualifies(score, done)) {
      (topics || []).forEach(function (t) { if (TOPICS.indexOf(t) >= 0 && out.checks.indexOf(t) < 0) out.checks.push(t); });
      st.setItem(CK, JSON.stringify(out.checks));
      out.granted = true;
    }
    return out;
  }
  /* El Desafío usa SIEMPRE las preguntas rápidas de los 4 temas (los filtros no lo afectan; nunca queda con una sola respuesta posible).
     Practicar: solo los temas marcados. */
  function pool(items, topics, chal) {
    if (chal) return items.filter(function (it) { return it.kind === 'mc' && it.fast === true; });
    return items.filter(function (it) { return topics.indexOf(it.topic) >= 0; });
  }
  function key(given) { return Array.isArray(given) ? given.join(' ') : given; }
  function rightOf(it) { return it.kind === 'orden' ? it.a.join(' ') : it.a; }
  function isRight(it, given) {
    if (it.kind === 'orden') return it.acc.indexOf(key(given)) >= 0;
    return given === it.a;
  }
  /* Elige al azar evitando los últimos N ids y el mismo grupo (palabra/frase) dos veces seguidas */
  function makePicker(list, rng, recentN) {
    rng = rng || Math.random;
    var recent = [], lastG = null;
    var N = Math.min(recentN == null ? 12 : recentN, Math.max(0, list.length - 1));
    return function () {
      var cand = list.filter(function (x) { return recent.indexOf(x.id) < 0 && x.grp !== lastG; });
      if (!cand.length) cand = list.filter(function (x) { return x.grp !== lastG; });
      if (!cand.length) cand = list.slice();
      var pick = cand[Math.floor(rng() * cand.length)];
      recent.push(pick.id); if (recent.length > N) recent.shift();
      lastG = pick.grp;
      return pick;
    };
  }
  function shuffle(a, rng) { rng = rng || Math.random; a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  /* Mezcla las fichas sin dejarlas en un orden ya correcto (eso regalaría la respuesta) */
  function shuffleChunks(it, rng) {
    var s, tries = 0;
    do { s = shuffle(it.chunks, rng); tries++; } while (it.acc.indexOf(s.join(' ')) >= 0 && tries < 50);
    return s;
  }
  g.RELATO_ENGINE = { CK: CK, BK: BK, TOPICS: TOPICS, qualifies: qualifies, getChecks: getChecks, applyChallenge: applyChallenge, pool: pool, isRight: isRight, rightOf: rightOf, makePicker: makePicker, shuffle: shuffle, shuffleChunks: shuffleChunks };
})(typeof window !== 'undefined' ? window : globalThis);
