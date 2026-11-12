/* Mein Tag in der Stadt — contenido. v1.0.1
   Fuente: hoja de la clase «relato del día en la ciudad» (7 frases), corregida (ver README).
   Vocabulario extra: lugares y medios de transporte de «In der Stadt unterwegs». */
(function (g) {
  'use strict';
  /* El relato de la hoja, ya corregido. de = alemán, es = ayuda en español */
  var STORY = [
    { de: 'Ich gehe zum Park.', es: 'Voy al parque.', i: '🌳' },
    { de: 'Im Park spiele ich im Sandkasten.', es: 'En el parque juego en el arenero.', i: '🏖️' },
    { de: 'Nach dem Park fahre ich mit dem Taxi in den Zoo.', es: 'Después del parque voy en taxi al zoológico.', i: '🚕' },
    { de: 'Ich sehe viele Tiere.', es: 'Veo muchos animales.', i: '🦁' },
    { de: 'Ich fahre mit dem Bus zur Bäckerei.', es: 'Voy en bus a la panadería.', i: '🚌' },
    { de: 'Ich kaufe Brot und Kuchen.', es: 'Compro pan y pastel.', i: '🍞' },
    { de: 'Ich fahre mit dem Bus zum Supermarkt und gehe nach Hause.', es: 'Voy en bus al supermercado y me voy a casa.', i: '🏠' }
  ];
  /* Lugares (g = género en Nominativ, verificado con la app In der Stadt unterwegs / Duden) */
  var PLACES = [
    { n: 'Park', g: 'der', i: '🌳', es: 'el parque' },
    { n: 'Sandkasten', g: 'der', i: '🏖️', es: 'el arenero (caja de arena)' },
    { n: 'Zoo', g: 'der', i: '🦁', es: 'el zoológico' },
    { n: 'Supermarkt', g: 'der', i: '🛒', es: 'el supermercado' },
    { n: 'Bahnhof', g: 'der', i: '🚉', es: 'la estación de tren' },
    { n: 'Spielplatz', g: 'der', i: '🤸', es: 'el parque de juegos' },
    { n: 'Markt', g: 'der', i: '🧺', es: 'el mercado' },
    { n: 'Bäckerei', g: 'die', i: '🥐', es: 'la panadería' },
    { n: 'Schule', g: 'die', i: '🏫', es: 'la escuela' },
    { n: 'Post', g: 'die', i: '🏤', es: 'el correo' },
    { n: 'Bank', g: 'die', i: '🏦', es: 'el banco' },
    { n: 'Apotheke', g: 'die', i: '💊', es: 'la farmacia' },
    { n: 'Eisdiele', g: 'die', i: '🍦', es: 'la heladería' },
    { n: 'Bibliothek', g: 'die', i: '📚', es: 'la biblioteca' },
    { n: 'Bushaltestelle', g: 'die', i: '🚏', es: 'la parada de bus' },
    { n: 'Kino', g: 'das', i: '🎬', es: 'el cine' },
    { n: 'Museum', g: 'das', i: '🖼️', es: 'el museo' },
    { n: 'Schwimmbad', g: 'das', i: '🏊', es: 'la piscina' },
    { n: 'Krankenhaus', g: 'das', i: '🏥', es: 'el hospital' },
    { n: 'Rathaus', g: 'das', i: '🏛️', es: 'la alcaldía' }
  ];
  var VEHICLES = [
    { n: 'Bus', g: 'der', i: '🚌', es: 'el bus' },
    { n: 'Taxi', g: 'das', i: '🚕', es: 'el taxi' },
    { n: 'Zug', g: 'der', i: '🚆', es: 'el tren' },
    { n: 'Auto', g: 'das', i: '🚗', es: 'el carro' },
    { n: 'Fahrrad', g: 'das', i: '🚲', es: 'la bicicleta' },
    { n: 'Roller', g: 'der', i: '🛴', es: 'la patineta de pie (con manubrio)' },
    { n: 'U-Bahn', g: 'die', i: '🚇', es: 'el metro' },
    { n: 'Straßenbahn', g: 'die', i: '🚋', es: 'el tranvía' }
  ];
  /* Tarjetas de Estudiar por tema. f = frente, b = ejemplo alemán (HTML), es = ayuda, say = texto para la voz */
  var CARDS = {
    zu: [
      { f: 'zu + Dativ', b: '<b>der</b> → zu + dem = <b>zum</b><br><b>das</b> → zu + dem = <b>zum</b><br><b>die</b> → zu + der = <b>zur</b>', es: '¿A dónde voy? Después de zu siempre va dativo: zum / zur. (Con «in» es distinto: mira la tarjeta Wo? / Wohin?)', say: 'zum, zum, zur' },
      { f: '🌳 der Park → zum Park', b: 'Ich gehe <b>zum</b> Park.', es: 'Voy al parque.', say: 'Ich gehe zum Park.' },
      { f: '🛒 der Supermarkt → zum Supermarkt', b: 'Ich fahre mit dem Bus <b>zum</b> Supermarkt.', es: 'Voy en bus al supermercado.', say: 'Ich fahre mit dem Bus zum Supermarkt.' },
      { f: '🥐 die Bäckerei → zur Bäckerei', b: 'Ich fahre mit dem Bus <b>zur</b> Bäckerei.', es: 'Voy en bus a la panadería.', say: 'Ich fahre mit dem Bus zur Bäckerei.' },
      { f: '🎬 das Kino → zum Kino', b: 'Wir gehen <b>zum</b> Kino.', es: 'Vamos al cine.', say: 'Wir gehen zum Kino.' },
      { f: '🏫 die Schule → zur Schule', b: 'Ich gehe <b>zur</b> Schule.', es: 'Voy a la escuela.', say: 'Ich gehe zur Schule.' }
    ],
    mit: [
      { f: 'mit + Dativ', b: '<b>der</b> Bus → mit <b>dem</b> Bus<br><b>das</b> Taxi → mit <b>dem</b> Taxi<br><b>die</b> U-Bahn → mit <b>der</b> U-Bahn', es: '¿Cómo voy? Después de mit siempre va dativo. ¡Nunca «mit das»!', say: 'mit dem Bus, mit dem Taxi, mit der U-Bahn' },
      { f: '🚕 mit dem Taxi', b: 'Ich fahre <b>mit dem</b> Taxi in den Zoo.', es: 'Voy en taxi al zoológico. Ojo: hace falta «dem» (mit dem Taxi).', say: 'Ich fahre mit dem Taxi in den Zoo.' },
      { f: '🚌 mit dem Bus', b: 'Ich fahre <b>mit dem</b> Bus zur Bäckerei.', es: 'Voy en bus a la panadería.', say: 'Ich fahre mit dem Bus zur Bäckerei.' },
      { f: '🚗 mit dem Auto · 🚲 mit dem Fahrrad', b: 'Papa fährt <b>mit dem</b> Auto.<br>Tom fährt <b>mit dem</b> Fahrrad.', es: 'en carro · en bicicleta', say: 'Papa fährt mit dem Auto. Tom fährt mit dem Fahrrad.' },
      { f: '🚇 mit der U-Bahn · 🚋 mit der Straßenbahn', b: 'Wir fahren <b>mit der</b> U-Bahn.<br>Oma fährt <b>mit der</b> Straßenbahn.', es: 'en metro · en tranvía', say: 'Wir fahren mit der U-Bahn. Oma fährt mit der Straßenbahn.' },
      { f: '🚶 gehen · 🚌 fahren', b: 'Ich <b>gehe</b> zum Park. (zu Fuß)<br>Ich <b>fahre</b> mit dem Bus.', es: 'gehen = a pie. fahren = en un vehículo.', say: 'Ich gehe zum Park. Ich fahre mit dem Bus.' }
    ],
    in: [
      { f: '📍 Wo? → im / in der', b: 'Ich spiele <b>im</b> Sandkasten.<br>Ich lerne <b>in der</b> Schule.', es: '¿Dónde estoy? (quieto) → dativo. im = in + dem.', say: 'Ich spiele im Sandkasten. Ich lerne in der Schule.' },
      { f: '➡️ Wohin? → in den / ins / in die', b: 'Ich fahre <b>in den</b> Zoo.<br>Wir gehen <b>ins</b> Kino.<br>Ich gehe <b>in die</b> Schule.', es: '¿A dónde voy? (me muevo) → con «in» va acusativo: in den / ins / in die. ins = in + das. Ojo: con «zu» siempre es zum / zur. Las dos frases están bien: Ich gehe zum Park · Ich gehe in den Park.', say: 'Ich fahre in den Zoo. Wir gehen ins Kino. Ich gehe in die Schule.' },
      { f: '🏖️ im Park · im Sandkasten', b: '<b>Im</b> Park spiele ich <b>im</b> Sandkasten.', es: 'En el parque juego en el arenero. Se escribe «im» (o «in dem», separado). «indem» junto es otra palabra.', say: 'Im Park spiele ich im Sandkasten.' },
      { f: '🦁 der Zoo → in den Zoo', b: 'Ich fahre mit dem Taxi <b>in den</b> Zoo.<br>Im Zoo sehe ich viele Tiere.', es: 'Voy al zoológico (Wohin?) · En el zoológico veo animales (Wo?).', say: 'Ich fahre mit dem Taxi in den Zoo. Im Zoo sehe ich viele Tiere.' },
      { f: '📋 Tabla', b: 'der → Wo? <b>im</b> · Wohin? <b>in den</b><br>das → Wo? <b>im</b> · Wohin? <b>ins</b><br>die → Wo? <b>in der</b> · Wohin? <b>in die</b>', es: 'Memoriza la tabla.', say: 'im, in den. im, ins. in der, in die.' }
    ],
    satz: [
      { f: '2️⃣ El verbo va en 2.º lugar', b: 'Ich <b>spiele</b> im Sandkasten.<br>Im Park <b>spiele</b> ich im Sandkasten.<br>Nach dem Park <b>fahre</b> ich in den Zoo.', es: 'Si la frase empieza con «Im Park» o «Nach dem Park», el verbo va segundo y «ich» va después.', say: 'Ich spiele im Sandkasten. Im Park spiele ich im Sandkasten. Nach dem Park fahre ich in den Zoo.' },
      { f: '🏠 nach Hause · zu Hause', b: 'Ich gehe <b>nach Hause</b>. (Wohin?)<br>Ich bin <b>zu Hause</b>. (Wo?)', es: 'nach Hause = a casa (voy) · zu Hause = en casa (estoy). Se escribe con s: Hause.', say: 'Ich gehe nach Hause. Ich bin zu Hause.' },
      { f: '⏭️ nach dem Park', b: '<b>Nach dem</b> Park fahre ich in den Zoo.', es: 'nach dem … = después del … (nach + dativo).', say: 'Nach dem Park fahre ich in den Zoo.' },
      { f: '🙋 ich: gehe · fahre · spiele', b: 'ich gehe · ich fahre · ich spiele<br>ich sehe · ich kaufe', es: 'Con «ich» el verbo termina en -e.', say: 'ich gehe, ich fahre, ich spiele, ich sehe, ich kaufe' },
      { f: '👦 er / sie: geht · fährt · sieht', b: 'Tom geht · Tom <b>fährt</b> · Tom spielt<br>Lena <b>sieht</b> · Lena kauft', es: 'Con er/sie/Tom/Lena termina en -t. ¡Ojo! fahren → fährt, sehen → sieht.', say: 'Tom geht. Tom fährt. Tom spielt. Lena sieht. Lena kauft.' },
      { f: '🍞 Ich kaufe Brot und Kuchen', b: 'das Brot · der Kuchen<br>Ich sehe viele Tiere.', es: 'el pan · el pastel · Veo muchos animales.', say: 'das Brot, der Kuchen. Ich kaufe Brot und Kuchen. Ich sehe viele Tiere.' }
    ]
  };
  /* Para escribir bien (neutral: lo que se corrigió al pasar la hoja en limpio) */
  var WRITE = [
    { de: 'im Sandkasten', es: '«im» (= in dem). «indem» junto es otra palabra.' },
    { de: 'nach Hause', es: 'con s: Hause.' },
    { de: 'der Zoo', es: 'sustantivo: solo la primera letra mayúscula.' },
    { de: 'mit dem Taxi', es: 'después de mit va el artículo: mit dem.' }
  ];
  var D = { STORY: STORY, PLACES: PLACES, VEHICLES: VEHICLES, CARDS: CARDS, WRITE: WRITE, VERSION: '1.0.1' };
  D.find = function (n) { var L = PLACES.concat(VEHICLES); for (var i = 0; i < L.length; i++) if (L[i].n === n) return L[i]; return null; };
  D.zu = function (p) { return p.g === 'die' ? 'zur' : 'zum'; };
  D.mit = function (p) { return p.g === 'die' ? 'mit der' : 'mit dem'; };
  D.wo = function (p) { return p.g === 'die' ? 'in der' : 'im'; };
  D.wohin = function (p) { return { der: 'in den', das: 'ins', die: 'in die' }[p.g]; };
  g.RELATO_DATA = D;
})(typeof window !== 'undefined' ? window : globalThis);
