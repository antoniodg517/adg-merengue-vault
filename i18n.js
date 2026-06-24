(function () {
  var LANGS = ['en', 'it', 'es', 'de'];
  var DEF = 'en';
  var cur = (localStorage.getItem('mv_lang') || '').toLowerCase();
  if (LANGS.indexOf(cur) === -1) cur = DEF;

  var T = {
    en: {
      'nav.home': 'HOME', 'nav.collection': 'COLLECTION', 'nav.forsale': 'FOR SALE',
      'nav.sold': 'SOLD', 'nav.cta': 'BUY · SELL · TRADE',
      'nav.navigation': 'Navigation', 'nav.tagline': 'THE WHITE SIDE OF FOOTBALL',
      'lb.obverse': 'Front · Obverse', 'lb.reverse': 'Back · Reverse',
      'lb.noback': 'Back not available', 'lb.subject': 'Subject',
      'lb.parallel': 'Parallel', 'lb.grade': 'Grade',
      'lb.serial': 'Serial', 'lb.fieldnotes': 'Field Notes',
      'lb.enquire': 'Enquire — Instagram DM', 'lb.buy': '◎ Buy — Instagram DM',
      'lb.sold_tag': '★ Went to another collector',
      'contact.title': 'Contact Me', 'contact.or': 'or write to me',
      'contact.namePh': 'Your name', 'contact.emailPh': 'Your email',
      'contact.cardPh': '— Card of interest (optional) —', 'contact.msgPh': 'Message…',
      'contact.send': '✉ Send message', 'contact.sending': 'SENDING…',
      'contact.sent': '✓ Message sent! I\'ll reply soon.',
      'contact.errEmail': 'Enter a valid email address.',
      'contact.errMsg': 'Please write a message.', 'contact.errFail': 'Send failed.',
      'coll.kicker': 'Private Vault', 'coll.title': 'THE COLLECTION',
      'coll.searchPh': 'Search by player, set, variant, numbering, grade…',
      'coll.teams': 'TEAMS', 'coll.all': 'All', 'coll.other': 'OTHER',
      'coll.noCards': 'No cards found', 'coll.noCardsBody': 'No cards match this filter.',
      'coll.totalFmt': '{n} cards',
      'fs.kicker': 'Available Now', 'fs.title': 'FOR SALE',
      'fs.desc': 'Pieces available for private sale. Contact me on Instagram for any offer.',
      'fs.searchPh': 'Search by player, team, set, variant, numbering, grade…',
      'fs.available': 'Available', 'fs.buy': '◎ Buy — Instagram DM',
      'fs.noCards': 'No cards for sale', 'fs.noCardsBody': 'Available cards will appear here.',
      'fs.totalFmt': '{n} for sale', 'fs.priceLabel': 'Price',
      'sold.kicker': 'Hall of Fame', 'sold.title': 'SOLD',
      'sold.desc': 'A small selection of cards that went to other collectors.',
      'sold.searchPh': 'Search by player, team, set, variant, numbering, grade…',
      'sold.soldBadge': 'Sold', 'sold.soldTag': '★ Went to another collector',
      'sold.noCards': 'No sold cards', 'sold.noCardsBody': 'Sold cards will appear here.',
      'sold.totalFmt': '{n} sold',
      'home.scrollcue': '[ Scroll to Enter ]',
      'home.s1.kicker': 'Real Madrid · Sports Cards · Private Collection',
      'home.s1.body': 'A private vault of meticulously curated Real Madrid sports cards. Every slab, a piece of Madridista heritage.',
      'home.s2.title': 'In Numbers',
      'home.s2.stat0': 'Slabs in the Vault', 'home.s2.stat1': 'PSA 10 Gem-Mint',
      'home.s2.stat2': 'One of Ones', 'home.s2.stat3': 'At PSA',
      'home.s2.footer': 'Every number, authenticated & graded',
      'home.s3.kicker': 'The Collection', 'home.s3.title': 'The Hall of Grails',
      'home.s3.cap': 'Hover to lift · tap to inspect · 4 pieces',
      'home.s3.capMobile': 'Tap to inspect · 4 pieces',
      'home.s4.kicker': 'The Starting XI', 'home.s4.title': 'My<br>Top XI',
      'home.s4.desc': 'The best of the collection, lined up',
      'home.s4.hint': 'Hover to lift · click to inspect.',
      'home.s4.hintMobile': 'Tap a card to inspect it.',
      'home.s4.comingsoon': 'Coming<br>Soon',
      'home.s5.kicker': 'Enter the Vault', 'home.s5.title': 'Choose<br>Your Way In',
      'home.s5.body': 'Four doors into the white side of football.',
      'home.s5.c1desc': 'Every slab in the vault, fully catalogued.',
      'home.s5.c2desc': 'Available pieces, private offers.',
      'home.s5.c3desc': 'The grails that found new homes.',
      'home.s5.c4desc': 'Deal direct — DM the vault on Instagram.',
    },
    it: {
      'nav.home': 'HOME', 'nav.collection': 'COLLEZIONE', 'nav.forsale': 'IN VENDITA',
      'nav.sold': 'VENDUTE', 'nav.cta': 'COMPRA · VENDI · SCAMBIA',
      'nav.navigation': 'Navigazione', 'nav.tagline': 'THE WHITE SIDE OF FOOTBALL',
      'lb.obverse': 'Fronte · Obverse', 'lb.reverse': 'Retro · Reverse',
      'lb.noback': 'Retro non disponibile', 'lb.subject': 'Soggetto',
      'lb.parallel': 'Parallelo', 'lb.grade': 'Grade',
      'lb.serial': 'Numerazione', 'lb.fieldnotes': 'Note',
      'lb.enquire': 'Richiedi info — Instagram DM', 'lb.buy': '◎ Acquista — Instagram DM',
      'lb.sold_tag': '★ Andata da un altro collezionista',
      'contact.title': 'Contattami', 'contact.or': 'oppure scrivimi',
      'contact.namePh': 'Il tuo nome', 'contact.emailPh': 'La tua email',
      'contact.cardPh': '— Carta di interesse (opzionale) —', 'contact.msgPh': 'Messaggio…',
      'contact.send': '✉ Invia messaggio', 'contact.sending': 'INVIO…',
      'contact.sent': '✓ Messaggio inviato! Ti risponderò presto.',
      'contact.errEmail': 'Inserisci un indirizzo email valido.',
      'contact.errMsg': 'Scrivi un messaggio.', 'contact.errFail': 'Invio fallito.',
      'coll.kicker': 'Collezione Privata', 'coll.title': 'LA COLLEZIONE',
      'coll.searchPh': 'Cerca per giocatore, set, variante, numerazione, grade…',
      'coll.teams': 'SQUADRE', 'coll.all': 'Tutte', 'coll.other': 'ALTRO',
      'coll.noCards': 'Nessuna carta trovata', 'coll.noCardsBody': 'Nessuna carta corrisponde a questo filtro.',
      'coll.totalFmt': '{n} carte',
      'fs.kicker': 'Disponibile Ora', 'fs.title': 'IN VENDITA',
      'fs.desc': 'Pezzi disponibili a trattativa privata. Contattami su Instagram per qualsiasi offerta.',
      'fs.searchPh': 'Cerca per giocatore, squadra, set, variante, numerazione, grade…',
      'fs.available': 'Disponibile', 'fs.buy': '◎ Acquista — Instagram DM',
      'fs.noCards': 'Nessuna carta in vendita', 'fs.noCardsBody': 'Le carte disponibili appariranno qui.',
      'fs.totalFmt': '{n} in vendita', 'fs.priceLabel': 'Prezzo',
      'sold.kicker': 'Hall of Fame', 'sold.title': 'VENDUTE',
      'sold.desc': 'Solo una piccola parte delle carte che sono andate ad altri collezionisti.',
      'sold.searchPh': 'Cerca per giocatore, squadra, set, variante, numerazione, grade…',
      'sold.soldBadge': 'Venduta', 'sold.soldTag': '★ Andata da un altro collezionista',
      'sold.noCards': 'Nessuna carta venduta', 'sold.noCardsBody': 'Le carte vendute appariranno qui.',
      'sold.totalFmt': '{n} vendute',
      'home.scrollcue': '[ Scorri per Entrare ]',
      'home.s1.kicker': 'Real Madrid · Cards Sportive · Collezione Privata',
      'home.s1.body': 'Un vault privato di carte Real Madrid meticolosamente curate. Ogni slab, un pezzo di storia madridista.',
      'home.s2.title': 'In Numeri',
      'home.s2.stat0': 'Slab nel Vault', 'home.s2.stat1': 'PSA 10 Gem-Mint',
      'home.s2.stat2': 'Unici al Mondo', 'home.s2.stat3': 'Dal Grader',
      'home.s2.footer': 'Ogni numero, autenticato e gradato',
      'home.s3.kicker': 'La Collezione', 'home.s3.title': 'Hall of Grails',
      'home.s3.cap': 'Passa il mouse · tocca per ispezionare · 4 pezzi',
      'home.s3.capMobile': 'Tocca per ispezionare · 4 pezzi',
      'home.s4.kicker': 'L\'XI Titolare', 'home.s4.title': 'La Mia<br>Top XI',
      'home.s4.desc': 'Il meglio della collezione, schierato',
      'home.s4.hint': 'Passa il mouse per sollevare · clicca per ispezionare.',
      'home.s4.hintMobile': 'Tocca una carta per ispezionarla.',
      'home.s4.comingsoon': 'Prossima<br>Carta',
      'home.s5.kicker': 'Entra nel Vault', 'home.s5.title': 'Scegli<br>Dove Entrare',
      'home.s5.body': 'Quattro porte nel lato bianco del calcio.',
      'home.s5.c1desc': 'Ogni slab nel vault, completamente catalogato.',
      'home.s5.c2desc': 'Pezzi disponibili, offerte private.',
      'home.s5.c3desc': 'I grail che hanno trovato nuova casa.',
      'home.s5.c4desc': 'Contatto diretto — DM il vault su Instagram.',
    },
    es: {
      'nav.home': 'INICIO', 'nav.collection': 'COLECCIÓN', 'nav.forsale': 'EN VENTA',
      'nav.sold': 'VENDIDAS', 'nav.cta': 'COMPRA · VENDE · CAMBIA',
      'nav.navigation': 'Navegación', 'nav.tagline': 'THE WHITE SIDE OF FOOTBALL',
      'lb.obverse': 'Frente · Obverse', 'lb.reverse': 'Reverso · Reverse',
      'lb.noback': 'Reverso no disponible', 'lb.subject': 'Sujeto',
      'lb.parallel': 'Paralelo', 'lb.grade': 'Grade',
      'lb.serial': 'Numeración', 'lb.fieldnotes': 'Notas de Campo',
      'lb.enquire': 'Consultar — Instagram DM', 'lb.buy': '◎ Comprar — Instagram DM',
      'lb.sold_tag': '★ Fue a otro coleccionista',
      'contact.title': 'Contáctame', 'contact.or': 'o escríbeme',
      'contact.namePh': 'Tu nombre', 'contact.emailPh': 'Tu email',
      'contact.cardPh': '— Carta de interés (opcional) —', 'contact.msgPh': 'Mensaje…',
      'contact.send': '✉ Enviar mensaje', 'contact.sending': 'ENVIANDO…',
      'contact.sent': '✓ ¡Mensaje enviado! Te responderé pronto.',
      'contact.errEmail': 'Introduce una dirección de email válida.',
      'contact.errMsg': 'Por favor escribe un mensaje.', 'contact.errFail': 'Envío fallido.',
      'coll.kicker': 'Colección Privada', 'coll.title': 'LA COLECCIÓN',
      'coll.searchPh': 'Buscar por jugador, set, variante, numeración, grado…',
      'coll.teams': 'EQUIPOS', 'coll.all': 'Todos', 'coll.other': 'OTROS',
      'coll.noCards': 'No hay cartas', 'coll.noCardsBody': 'Ninguna carta coincide con este filtro.',
      'coll.totalFmt': '{n} cartas',
      'fs.kicker': 'Disponible Ahora', 'fs.title': 'EN VENTA',
      'fs.desc': 'Piezas disponibles por oferta privada. Contáctame en Instagram para cualquier oferta.',
      'fs.searchPh': 'Buscar por jugador, equipo, set, variante, numeración, grado…',
      'fs.available': 'Disponible', 'fs.buy': '◎ Comprar — Instagram DM',
      'fs.noCards': 'No hay cartas en venta', 'fs.noCardsBody': 'Las cartas disponibles aparecerán aquí.',
      'fs.totalFmt': '{n} en venta', 'fs.priceLabel': 'Precio',
      'sold.kicker': 'Hall of Fame', 'sold.title': 'VENDIDAS',
      'sold.desc': 'Una pequeña selección de cartas que fueron a otros coleccionistas.',
      'sold.searchPh': 'Buscar por jugador, equipo, set, variante, numeración, grado…',
      'sold.soldBadge': 'Vendida', 'sold.soldTag': '★ Fue a otro coleccionista',
      'sold.noCards': 'No hay cartas vendidas', 'sold.noCardsBody': 'Las cartas vendidas aparecerán aquí.',
      'sold.totalFmt': '{n} vendidas',
      'home.scrollcue': '[ Desplázate para Entrar ]',
      'home.s1.kicker': 'Real Madrid · Cards Deportivas · Colección Privada',
      'home.s1.body': 'Un vault privado de cartas del Real Madrid meticulosamente curadas. Cada slab, una pieza del patrimonio madridista.',
      'home.s2.title': 'En Números',
      'home.s2.stat0': 'Slabs en el Vault', 'home.s2.stat1': 'PSA 10 Gem-Mint',
      'home.s2.stat2': 'Únicos en el Mundo', 'home.s2.stat3': 'En el Gradador',
      'home.s2.footer': 'Cada número, autenticado y gradado',
      'home.s3.kicker': 'La Colección', 'home.s3.title': 'Hall de los Grails',
      'home.s3.cap': 'Pasa el ratón · toca para inspeccionar · 4 piezas',
      'home.s3.capMobile': 'Toca para inspeccionar · 4 piezas',
      'home.s4.kicker': 'El XI Inicial', 'home.s4.title': 'Mi<br>Top XI',
      'home.s4.desc': 'Lo mejor de la colección, alineado',
      'home.s4.hint': 'Pasa el ratón para levantar · clic para inspeccionar.',
      'home.s4.hintMobile': 'Toca una carta para inspeccionarla.',
      'home.s4.comingsoon': 'Próxima<br>Carta',
      'home.s5.kicker': 'Entra al Vault', 'home.s5.title': 'Elige<br>Tu Entrada',
      'home.s5.body': 'Cuatro puertas al lado blanco del fútbol.',
      'home.s5.c1desc': 'Cada slab en el vault, completamente catalogado.',
      'home.s5.c2desc': 'Piezas disponibles, ofertas privadas.',
      'home.s5.c3desc': 'Los grails que encontraron nuevo hogar.',
      'home.s5.c4desc': 'Contacto directo — DM el vault en Instagram.',
    },
    de: {
      'nav.home': 'START', 'nav.collection': 'SAMMLUNG', 'nav.forsale': 'ZU VERKAUFEN',
      'nav.sold': 'VERKAUFT', 'nav.cta': 'KAUFEN · VERKAUFEN · TAUSCHEN',
      'nav.navigation': 'Navigation', 'nav.tagline': 'THE WHITE SIDE OF FOOTBALL',
      'lb.obverse': 'Vorderseite · Obverse', 'lb.reverse': 'Rückseite · Reverse',
      'lb.noback': 'Rückseite nicht verfügbar', 'lb.subject': 'Subjekt',
      'lb.parallel': 'Parallel', 'lb.grade': 'Grade',
      'lb.serial': 'Nummerierung', 'lb.fieldnotes': 'Notizen',
      'lb.enquire': 'Anfragen — Instagram DM', 'lb.buy': '◎ Kaufen — Instagram DM',
      'lb.sold_tag': '★ Zu einem anderen Sammler',
      'contact.title': 'Kontakt', 'contact.or': 'oder schreib mir',
      'contact.namePh': 'Dein Name', 'contact.emailPh': 'Deine E-Mail',
      'contact.cardPh': '— Karte von Interesse (optional) —', 'contact.msgPh': 'Nachricht…',
      'contact.send': '✉ Nachricht senden', 'contact.sending': 'SENDEN…',
      'contact.sent': '✓ Nachricht gesendet! Ich antworte bald.',
      'contact.errEmail': 'Bitte gib eine gültige E-Mail-Adresse ein.',
      'contact.errMsg': 'Bitte schreib eine Nachricht.', 'contact.errFail': 'Senden fehlgeschlagen.',
      'coll.kicker': 'Privatsammlung', 'coll.title': 'DIE SAMMLUNG',
      'coll.searchPh': 'Suche nach Spieler, Set, Variante, Nummerierung, Grade…',
      'coll.teams': 'TEAMS', 'coll.all': 'Alle', 'coll.other': 'ANDERE',
      'coll.noCards': 'Keine Karten gefunden', 'coll.noCardsBody': 'Keine Karten entsprechen diesem Filter.',
      'coll.totalFmt': '{n} Karten',
      'fs.kicker': 'Jetzt Verfügbar', 'fs.title': 'ZU VERKAUFEN',
      'fs.desc': 'Verfügbare Stücke per privatem Angebot. Kontaktiere mich auf Instagram.',
      'fs.searchPh': 'Suche nach Spieler, Team, Set, Variante, Nummerierung, Grade…',
      'fs.available': 'Verfügbar', 'fs.buy': '◎ Kaufen — Instagram DM',
      'fs.noCards': 'Keine Karten zum Verkauf', 'fs.noCardsBody': 'Verfügbare Karten erscheinen hier.',
      'fs.totalFmt': '{n} zum Verkauf', 'fs.priceLabel': 'Preis',
      'sold.kicker': 'Hall of Fame', 'sold.title': 'VERKAUFT',
      'sold.desc': 'Eine kleine Auswahl an Karten, die zu anderen Sammlern gingen.',
      'sold.searchPh': 'Suche nach Spieler, Team, Set, Variante, Nummerierung, Grade…',
      'sold.soldBadge': 'Verkauft', 'sold.soldTag': '★ Zu einem anderen Sammler',
      'sold.noCards': 'Keine verkauften Karten', 'sold.noCardsBody': 'Verkaufte Karten erscheinen hier.',
      'sold.totalFmt': '{n} verkauft',
      'home.scrollcue': '[ Scrollen zum Eintreten ]',
      'home.s1.kicker': 'Real Madrid · Sportkarten · Privatsammlung',
      'home.s1.body': 'Ein privates Vault mit sorgfältig kuratierten Real-Madrid-Sportkarten. Jeder Slab, ein Stück Madridista-Erbe.',
      'home.s2.title': 'In Zahlen',
      'home.s2.stat0': 'Slabs im Vault', 'home.s2.stat1': 'PSA 10 Gem-Mint',
      'home.s2.stat2': 'Einzige der Welt', 'home.s2.stat3': 'Beim Grader',
      'home.s2.footer': 'Jede Zahl, authentifiziert & bewertet',
      'home.s3.kicker': 'Die Sammlung', 'home.s3.title': 'Hall der Grails',
      'home.s3.cap': 'Maus drüber · tippen zum Inspizieren · 4 Stücke',
      'home.s3.capMobile': 'Tippen zum Inspizieren · 4 Stücke',
      'home.s4.kicker': 'Das Startelf', 'home.s4.title': 'Mein<br>Top XI',
      'home.s4.desc': 'Das Beste der Sammlung, aufgestellt',
      'home.s4.hint': 'Maus drüber zum Heben · klicken zum Inspizieren.',
      'home.s4.hintMobile': 'Tippe eine Karte zum Inspizieren.',
      'home.s4.comingsoon': 'Kommt<br>Bald',
      'home.s5.kicker': 'Das Vault Betreten', 'home.s5.title': 'Wähle<br>Deinen Weg',
      'home.s5.body': 'Vier Türen zur weißen Seite des Fußballs.',
      'home.s5.c1desc': 'Jeder Slab im Vault, vollständig katalogisiert.',
      'home.s5.c2desc': 'Verfügbare Stücke, private Angebote.',
      'home.s5.c3desc': 'Die Grails, die ein neues Zuhause fanden.',
      'home.s5.c4desc': 'Direktkontakt — DM das Vault auf Instagram.',
    },
  };

  window.MV_LANG = cur;
  window.MV_T = function (k) {
    var v = (T[cur] || T[DEF])[k];
    if (v === undefined) v = (T[DEF] || {})[k];
    return v !== undefined ? v : k;
  };
  window.MV_setLang = function (l) {
    if (LANGS.indexOf(l) !== -1) { localStorage.setItem('mv_lang', l); location.reload(); }
  };

  function applyI18n(root) {
    var nodes = (root || document).querySelectorAll('[data-i18n],[data-i18n-html]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute('data-i18n') || el.getAttribute('data-i18n-html');
      var attr = el.getAttribute('data-i18n-attr');
      var isHtml = el.hasAttribute('data-i18n-html');
      var val = window.MV_T(key);
      if (typeof val !== 'string') continue;
      if (attr) { el.setAttribute(attr, val); }
      else if (isHtml) { el.innerHTML = val; }
      else { el.textContent = val; }
    }
  }

  var obs = new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var added = muts[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        var n = added[j];
        if (n.nodeType !== 1) continue;
        if (n.hasAttribute && (n.hasAttribute('data-i18n') || n.hasAttribute('data-i18n-html'))) applyI18n(n.parentNode || n);
        if (n.querySelectorAll && n.querySelectorAll('[data-i18n],[data-i18n-html]').length) applyI18n(n);
      }
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    applyI18n(document);
    // Override mobile ::after CSS content strings
    var css = '@media(max-width:760px){' +
      '#s5cap::after{content:"' + window.MV_T('home.s3.capMobile').replace(/"/g, '\\"') + '"!important;}' +
      '#s7hint::after{content:"' + window.MV_T('home.s4.hintMobile').replace(/"/g, '\\"') + '"!important;}' +
    '}';
    var s = document.createElement('style');
    s.id = 'mv-i18n-css';
    s.textContent = css;
    document.head.appendChild(s);
    obs.observe(document.body, { childList: true, subtree: true });
  });
})();
