/* Mein Tag in der Stadt — banco de práctica (determinista). v1.0.0
   Tipos: zu (zum/zur), mit (mit dem/der), wo / wohin (im, in der / in den, ins, in die),
   verb (conjugación y verbo en 2.º lugar), haus (nach Hause / zu Hause), cual (¿Cuál frase está bien?),
   hor (escucha y elige), orden (ordena la frase), story (ordena el relato).
   Regla de oro: cada pregunta tiene exactamente una opción correcta (las otras son incorrectas en alemán). */
(function (g) {
  'use strict';
  var D = g.RELATO_DATA, items = [];
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function fill(de, a) { return de.replace('___', a); }
  function startsBlank(de) { return de.indexOf('___') === 0; }
  function add(it) { items.push(it); }

  /* ---- 1. zum / zur ---- (s = frase con ___, n = lugar, src = de la hoja) */
  var ZU = [
    ['Ich gehe ___ Park.', 'Park', 1], ['Ich fahre mit dem Bus ___ Bäckerei.', 'Bäckerei', 1], ['Ich fahre mit dem Bus ___ Supermarkt.', 'Supermarkt', 1],
    ['Ich gehe ___ Schule.', 'Schule'], ['Wir fahren mit dem Auto ___ Bahnhof.', 'Bahnhof'], ['Mama geht ___ Post.', 'Post'],
    ['Ich fahre mit dem Fahrrad ___ Kino.', 'Kino'], ['Papa fährt mit dem Taxi ___ Bank.', 'Bank'], ['Wir gehen ___ Spielplatz.', 'Spielplatz'],
    ['Oma fährt mit der Straßenbahn ___ Markt.', 'Markt'], ['Ich gehe ___ Apotheke.', 'Apotheke'], ['Tom fährt mit dem Roller ___ Eisdiele.', 'Eisdiele'],
    ['Wir fahren mit der U-Bahn ___ Museum.', 'Museum'], ['Lena geht ___ Bibliothek.', 'Bibliothek'], ['Ich fahre mit dem Bus ___ Schwimmbad.', 'Schwimmbad'],
    ['Wir gehen ___ Bushaltestelle.', 'Bushaltestelle'], ['Papa fährt mit dem Auto ___ Krankenhaus.', 'Krankenhaus'], ['Ich gehe ___ Rathaus.', 'Rathaus'],
    ['Wir fahren mit dem Zug ___ Zoo.', 'Zoo']
  ];
  ZU.forEach(function (r, k) {
    var p = D.find(r[1]), a = D.zu(p);
    add({ id: 'zu-' + k, kind: 'mc', type: 'zu', topic: 'zu', grp: p.n, src: !!r[2], fast: true, pic: p.i,
      q: 'Completa: ¿zum, zur o zu?', de: r[0], o: ['zum', 'zur', 'zu'], a: a, say: fill(r[0], a),
      help: p.n + ' = ' + p.es + '. zum → palabras con der o das · zur → palabras con die.',
      e: '<b>' + p.g + ' ' + p.n + '</b> → <b>' + a + ' ' + p.n + '</b> (' + (a === 'zur' ? 'zu + der' : 'zu + dem') + '). 💡 der/das → zum · die → zur.' });
  });

  /* ---- 2. mit dem / mit der ---- */
  var MIT = [
    ['Nach dem Park fahre ich ___ Taxi in den Zoo.', 'Taxi', 1], ['Ich fahre ___ Bus zur Bäckerei.', 'Bus', 1], ['Ich fahre ___ Bus zum Supermarkt.', 'Bus', 1],
    ['Ich fahre ___ U-Bahn zur Schule.', 'U-Bahn'], ['Wir fahren ___ Auto zum Bahnhof.', 'Auto'], ['Oma fährt ___ Straßenbahn zum Markt.', 'Straßenbahn'],
    ['Tom fährt ___ Fahrrad zum Park.', 'Fahrrad'], ['Papa fährt ___ Zug zum Zoo.', 'Zug'], ['Lena fährt ___ Roller zur Eisdiele.', 'Roller'],
    ['Mama fährt ___ Taxi zur Post.', 'Taxi'], ['Wir fahren ___ U-Bahn zum Museum.', 'U-Bahn'], ['Ich fahre ___ Straßenbahn zur Bibliothek.', 'Straßenbahn'],
    ['Ich fahre ___ Fahrrad zum Kino.', 'Fahrrad']
  ];
  MIT.forEach(function (r, k) {
    var p = D.find(r[1]), a = D.mit(p);
    add({ id: 'mit-' + k, kind: 'mc', type: 'mit', topic: 'mit', grp: 'mit-' + k, src: !!r[2], fast: true, pic: p.i,
      q: 'Completa: ¿mit dem, mit der o mit das?', de: r[0], o: ['mit dem', 'mit der', 'mit das'], a: a, say: fill(r[0], a),
      help: p.n + ' = ' + p.es + '. Después de mit va dativo: der/das → dem · die → der.',
      e: '<b>' + p.g + ' ' + p.n + '</b> → <b>' + a + ' ' + p.n + '</b>. 💡 mit + Dativ: der/das → mit dem · die → mit der. «mit das» no existe.' });
  });

  /* ---- 3. Wo? (im / in der) y Wohin? (in den / ins / in die) ---- */
  var WO = [
    ['Ich spiele ___ Sandkasten.', 'Sandkasten', 1], ['___ Park spiele ich.', 'Park', 1], ['Ich sehe viele Tiere ___ Zoo.', 'Zoo'],
    ['Ich kaufe Brot ___ Bäckerei.', 'Bäckerei'], ['Wir sind ___ Supermarkt.', 'Supermarkt'], ['Ich schwimme ___ Schwimmbad.', 'Schwimmbad'],
    ['Ich lese ___ Bibliothek.', 'Bibliothek'], ['Wir sehen einen Film ___ Kino.', 'Kino'], ['Ich lerne ___ Schule.', 'Schule'],
    ['Mama kauft Medizin ___ Apotheke.', 'Apotheke'], ['Papa wartet ___ Bahnhof.', 'Bahnhof'], ['Die Bilder sind ___ Museum.', 'Museum']
  ];
  /* Opciones: nunca se ofrece la forma del mismo sustantivo que podría valer con otro sentido.
     Wo?: dativo correcto + el otro dativo + acusativos que no valen (con das no se ofrece «ins»).
     Wohin?: acusativo correcto + los otros acusativos + el dativo del OTRO género (nunca el dativo del mismo sustantivo). */
  var WO_O = { der: ['im', 'in der', 'in den', 'ins'], das: ['im', 'in der', 'in den', 'in die'], die: ['in der', 'im', 'in die', 'ins'] };
  var WOHIN_O = { der: ['in den', 'ins', 'in die', 'in der'], das: ['ins', 'in den', 'in die', 'in der'], die: ['in die', 'in den', 'ins', 'im'] };
  var IN_HELP = ' ¿Está quieto (Wo?) o va hacia allá (Wohin?)? Wo? → der/das: im · die: in der. Wohin? → der: in den · das: ins · die: in die.';
  WO.forEach(function (r, k) {
    var p = D.find(r[1]), a = D.wo(p), o = WO_O[p.g].slice();
    if (startsBlank(r[0])) { a = cap(a); o = o.map(cap); }
    add({ id: 'wo-' + k, kind: 'mc', type: 'wo', topic: 'in', grp: p.n, src: !!r[2], fast: true, pic: p.i,
      q: 'Completa la frase.', de: r[0], o: o, a: a, say: fill(r[0], a),
      help: p.n + ' = ' + p.es + '.' + IN_HELP,
      e: '<b>' + p.g + ' ' + p.n + '</b>. Aquí está quieto → Wo? → <b>' + a + ' ' + p.n + '</b>' + (p.g === 'die' ? '.' : ' (im = in + dem).') });
  });
  var WOHIN = [
    ['Ich fahre mit dem Taxi ___ Zoo.', 'Zoo', 1], ['Wir gehen ___ Kino.', 'Kino'], ['Ich gehe ___ Schule.', 'Schule'], ['Wir fahren ___ Park.', 'Park'],
    ['Ich gehe ___ Bäckerei.', 'Bäckerei'], ['Mama geht ___ Supermarkt.', 'Supermarkt'], ['Wir gehen ___ Schwimmbad.', 'Schwimmbad'],
    ['Lena geht ___ Bibliothek.', 'Bibliothek'], ['Wir gehen ___ Museum.', 'Museum'], ['Tom springt ___ Sandkasten.', 'Sandkasten']
  ];
  WOHIN.forEach(function (r, k) {
    var p = D.find(r[1]), a = D.wohin(p);
    add({ id: 'wohin-' + k, kind: 'mc', type: 'wohin', topic: 'in', grp: p.n, src: !!r[2], fast: true, pic: p.i,
      q: 'Completa la frase.', de: r[0], o: WOHIN_O[p.g].slice(), a: a, say: fill(r[0], a),
      help: p.n + ' = ' + p.es + '.' + IN_HELP,
      e: '<b>' + p.g + ' ' + p.n + '</b>. Aquí va hacia allá → Wohin? → <b>' + a + ' ' + p.n + '</b>' + (a === 'ins' ? ' (ins = in + das).' : '.') });
  });

  /* ---- 4. Verbos: conjugación y verbo en 2.º lugar ---- (frase, correcta, distractores) */
  var VERB = [
    ['Ich ___ zum Park.', 'gehe', ['geht', 'gehen'], 1], ['Im Park ___ ich im Sandkasten.', 'spiele', ['spielt', 'spielst'], 1],
    ['Nach dem Park ___ ich mit dem Taxi in den Zoo.', 'fahre', ['fährt', 'fahren'], 1], ['Ich ___ viele Tiere.', 'sehe', ['sieht', 'siehst'], 1],
    ['Ich ___ Brot und Kuchen.', 'kaufe', ['kauft', 'kaufen'], 1], ['Ich fahre mit dem Bus zum Supermarkt und ___ nach Hause.', 'gehe', ['geht', 'gehst'], 1],
    ['Tom ___ mit dem Bus zur Bäckerei.', 'fährt', ['fahre', 'fahren']], ['Wir ___ zum Park.', 'gehen', ['gehe', 'geht']],
    ['Du ___ mit dem Taxi zum Zoo.', 'fährst', ['fahre', 'fährt']], ['Lena ___ viele Tiere.', 'sieht', ['sehe', 'sehen']],
    ['Mama ___ Brot und Kuchen.', 'kauft', ['kaufe', 'kaufst']], ['Im Zoo ___ ich viele Tiere.', 'sehe', ['sieht', 'sehen']],
    ['In der Bäckerei ___ ich Brot.', 'kaufe', ['kauft', 'kaufst']], ['Ich ___ zu Fuß zur Schule.', 'gehe', ['fahre', 'gehst']],
    ['Wir ___ mit dem Bus zum Zoo.', 'fahren', ['fahre', 'fährt']], ['Am Abend ___ ich nach Hause.', 'gehe', ['geht', 'gehen']]
  ];
  VERB.forEach(function (r, k) {
    var a = r[1];
    add({ id: 'verb-' + k, kind: 'mc', type: 'verb', topic: 'satz', grp: 'verb-' + k, src: !!r[3], fast: true,
      q: '¿Qué forma del verbo va?', de: r[0], o: [a].concat(r[2]), a: a, say: fill(r[0], a),
      help: 'Mira quién lo hace: ich → -e · du → -st · er/sie (Tom, Lena, Mama) → -t · wir → -en. A pie → gehen; en un vehículo → fahren.',
      e: '✔ ' + fill(r[0], '<b>' + a + '</b>') + ' 💡 El verbo va en 2.º lugar y se conjuga según quién lo hace.' });
  });

  /* ---- 5. nach Hause / zu Hause ---- */
  var HAUS = [
    ['Ich fahre mit dem Bus zum Supermarkt und gehe ___.', 'nach Hause', 1], ['Ich gehe ___.', 'nach Hause'], ['Nach dem Zoo fahre ich ___.', 'nach Hause'],
    ['Am Abend bin ich ___.', 'zu Hause'], ['Mama ist ___.', 'zu Hause'], ['Wir spielen ___.', 'zu Hause'], ['Tom fährt mit dem Fahrrad ___.', 'nach Hause']
  ];
  HAUS.forEach(function (r, k) {
    add({ id: 'haus-' + k, kind: 'mc', type: 'haus', topic: 'satz', grp: 'haus-' + k, src: !!r[2], fast: true, pic: '🏠',
      q: '¿nach Hause o zu Hause?', de: r[0], o: ['nach Hause', 'zu Hause', 'zur Hause'], a: r[1], say: fill(r[0], r[1]),
      help: '¿Se va a casa (movimiento, Wohin?) o está en casa (Wo?)?',
      e: (r[1] === 'nach Hause' ? '<b>nach Hause</b> = a casa (voy hacia allá).' : '<b>zu Hause</b> = en casa (estoy allí).') + ' 💡 Se escribe Hause, con s. «zur Hause» no existe.' });
  });

  /* ---- 6. ¿Cuál frase está bien? (1 correcta + 2 con un error cada una) ---- */
  var CUAL = [
    ['zu', 'Ich gehe zum Park.', ['Ich gehe zur Park.', 'Ich gehe zu Park.'], 1, 'der Park → zum Park.'],
    ['in', 'Im Park spiele ich im Sandkasten.', ['Im Park ich spiele im Sandkasten.', 'Im Park spiele ich ins Sandkasten.'], 1, 'El verbo va en 2.º lugar (spiele ich). Wo? → im Sandkasten.'],
    ['mit', 'Nach dem Park fahre ich mit dem Taxi in den Zoo.', ['Nach dem Park fahre ich mit das Taxi in den Zoo.', 'Nach dem Park ich fahre mit dem Taxi in den Zoo.'], 1, 'mit dem Taxi (mit + Dativ). Verbo en 2.º lugar: fahre ich.'],
    ['satz', 'Ich sehe viele Tiere.', ['Ich sehen viele Tiere.', 'Ich sieht viele Tiere.'], 1, 'ich sehe.'],
    ['zu', 'Ich fahre mit dem Bus zur Bäckerei.', ['Ich fahre mit dem Bus zum Bäckerei.', 'Ich fahre mit der Bus zur Bäckerei.'], 1, 'die Bäckerei → zur Bäckerei · der Bus → mit dem Bus.'],
    ['satz', 'Ich kaufe Brot und Kuchen.', ['Ich kaufen Brot und Kuchen.', 'Ich kauft Brot und Kuchen.'], 1, 'ich kaufe.'],
    ['satz', 'Ich fahre mit dem Bus zum Supermarkt und gehe nach Hause.', ['Ich fahre mit dem Bus zur Supermarkt und gehe nach Hause.', 'Ich fahre mit dem Bus zum Supermarkt und gehe zu Hause.'], 1, 'der Supermarkt → zum Supermarkt · a casa → nach Hause.'],
    ['mit', 'Ich fahre mit der U-Bahn zur Schule.', ['Ich fahre mit dem U-Bahn zur Schule.', 'Ich fahre mit der U-Bahn zum Schule.'], 0, 'die U-Bahn → mit der U-Bahn · die Schule → zur Schule.'],
    ['zu', 'Wir gehen zum Kino.', ['Wir gehen zur Kino.', 'Wir gehen zu Kino.'], 0, 'das Kino → zum Kino.'],
    ['in', 'Wir gehen ins Kino.', ['Wir gehen in den Kino.', 'Wir gehen in die Kino.'], 0, 'das Kino, Wohin? → ins Kino.'],
    ['in', 'Ich lerne in der Schule.', ['Ich lerne im Schule.', 'Ich lerne ins Schule.'], 0, 'die Schule, Wo? → in der Schule.'],
    ['mit', 'Oma fährt mit der Straßenbahn zum Markt.', ['Oma fährt mit dem Straßenbahn zum Markt.', 'Oma fährt mit der Straßenbahn zur Markt.'], 0, 'die Straßenbahn → mit der · der Markt → zum Markt.'],
    ['satz', 'Im Zoo sehe ich viele Tiere.', ['Im Zoo ich sehe viele Tiere.', 'Im Zoo sehe ich viel Tiere.'], 0, 'Verbo en 2.º lugar: sehe ich. viele Tiere (plural).'],
    ['satz', 'Tom fährt mit dem Fahrrad nach Hause.', ['Tom fahre mit dem Fahrrad nach Hause.', 'Tom fährt mit das Fahrrad nach Hause.'], 0, 'Tom fährt · das Fahrrad → mit dem Fahrrad.']
  ];
  CUAL.forEach(function (r, k) {
    add({ id: 'cual-' + k, kind: 'mc', type: 'cual', topic: r[0], grp: 'cual-' + k, src: !!r[3], fast: false, stack: true,
      q: '¿Cuál frase está bien?', o: [r[1]].concat(r[2]), a: r[1], say: r[1],
      help: 'Revisa: zum/zur, mit dem/mit der, im/ins y el verbo en 2.º lugar. Solo una frase no tiene errores.',
      e: '✔ <b>' + r[1] + '</b> 💡 ' + r[4] });
  });

  /* ---- 7. Escucha y elige: las tres frases están bien; hay que oír cuál suena ---- */
  var HOR = [
    ['Ich fahre mit dem Bus zur Bäckerei.', ['Ich fahre mit dem Taxi zur Bäckerei.', 'Ich fahre mit dem Bus zum Supermarkt.']],
    ['Nach dem Park fahre ich mit dem Taxi in den Zoo.', ['Nach dem Park fahre ich mit dem Bus in den Zoo.', 'Nach dem Zoo fahre ich mit dem Taxi in den Park.']],
    ['Ich gehe zum Park.', ['Ich gehe zum Zoo.', 'Ich gehe zur Post.']],
    ['Im Park spiele ich im Sandkasten.', ['Im Park spiele ich Fußball.', 'Im Zoo sehe ich viele Tiere.']],
    ['Ich kaufe Brot und Kuchen.', ['Ich kaufe Brot und Milch.', 'Ich esse Brot und Kuchen.']],
    ['Ich fahre mit dem Bus zum Supermarkt und gehe nach Hause.', ['Ich fahre mit dem Bus zum Supermarkt und gehe zur Schule.', 'Ich fahre mit dem Auto zum Supermarkt und gehe nach Hause.']],
    ['Ich sehe viele Tiere.', ['Ich sehe viele Kinder.', 'Ich habe viele Tiere.']],
    ['Wir fahren mit der U-Bahn zum Museum.', ['Wir fahren mit der Straßenbahn zum Museum.', 'Wir fahren mit der U-Bahn zum Bahnhof.']]
  ];
  HOR.forEach(function (r, k) {
    add({ id: 'hor-' + k, kind: 'mc', type: 'hor', topic: 'satz', grp: 'hor-' + k, src: k < 7, fast: false, listen: true, stack: true,
      q: '🎧 Escucha y elige lo que oíste.', o: [r[0]].concat(r[1]), a: r[0], say: r[0],
      help: 'Se oye: «' + r[0] + '»', e: '✔ <b>' + r[0] + '</b>' });
  });

  /* ---- 8. Ordena la frase (fichas). acc = órdenes aceptados (todos correctos en alemán) ---- */
  var ORD = [
    [['Ich', 'gehe', 'zum Park'], null, 1],
    [['Im Park', 'spiele', 'ich', 'im Sandkasten'], null, 1],
    [['Nach dem Park', 'fahre', 'ich', 'mit dem Taxi', 'in den Zoo'], [['Nach dem Park', 'fahre', 'ich', 'in den Zoo', 'mit dem Taxi']], 1],
    [['Ich', 'sehe', 'viele', 'Tiere'], null, 1],
    [['Ich', 'fahre', 'mit dem Bus', 'zur Bäckerei'], [['Ich', 'fahre', 'zur Bäckerei', 'mit dem Bus']], 1],
    [['Ich', 'kaufe', 'Brot', 'und', 'Kuchen'], [['Ich', 'kaufe', 'Kuchen', 'und', 'Brot']], 1],
    [['Ich', 'fahre', 'mit dem Bus', 'zum Supermarkt', 'und', 'gehe', 'nach Hause'], [['Ich', 'fahre', 'zum Supermarkt', 'mit dem Bus', 'und', 'gehe', 'nach Hause']], 1],
    [['Im Zoo', 'sehe', 'ich', 'viele Tiere'], null],
    [['Nach dem Zoo', 'fahre', 'ich', 'nach Hause'], null],
    [['In der Bäckerei', 'kaufe', 'ich', 'Brot'], null]
  ];
  ORD.forEach(function (r, k) {
    var acc = [r[0]].concat(r[1] || []).map(function (x) { return x.join(' '); });
    add({ id: 'orden-' + k, kind: 'orden', type: 'orden', topic: 'satz', grp: 'orden-' + k, src: !!r[2], fast: false,
      q: 'Ordena la frase: toca las fichas en orden.', chunks: r[0], acc: acc, a: r[0], say: r[0].join(' ') + '.',
      help: 'La mayúscula indica el comienzo. El verbo va en 2.º lugar.',
      e: '✔ <b>' + r[0].join(' ') + '.</b>' + (r[1] ? ' (También vale: ' + r[1].map(function (x) { return x.join(' ') + '.'; }).join(' / ') + ')' : '') + ' 💡 Verbo en 2.º lugar.' });
  });

  /* ---- 9. Ordena el relato (dos partes; el orden se deduce del texto) ---- */
  var S = D.STORY.map(function (s) { return s.de; });
  add({ id: 'story-1', kind: 'orden', type: 'story', topic: 'satz', grp: 'story-1', src: true, fast: false, long: true,
    q: 'Ordena la 1.ª parte del relato.', chunks: S.slice(0, 4), acc: [S.slice(0, 4).join(' ')], a: S.slice(0, 4), say: S.slice(0, 4).join(' '),
    help: 'Primero va al parque; luego juega allí («Im Park»); «Nach dem Park» va al zoológico; en el zoológico ve animales.',
    e: S.slice(0, 4).map(function (x, i) { return (i + 1) + '. ' + x; }).join('<br>') });
  add({ id: 'story-2', kind: 'orden', type: 'story', topic: 'satz', grp: 'story-2', src: true, fast: false, long: true,
    q: 'Ordena la 2.ª parte del relato.', chunks: S.slice(4), acc: [S.slice(4).join(' ')], a: S.slice(4), say: S.slice(4).join(' '),
    help: 'Primero va a la panadería; allí compra pan y pastel; al final va al supermercado y a casa.',
    e: S.slice(4).map(function (x, i) { return (i + 5) + '. ' + x; }).join('<br>') });

  g.RELATO_BANK = { items: items };
})(typeof window !== 'undefined' ? window : globalThis);
