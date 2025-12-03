# Unterschied: Sicherer vs. Unsicherer Server

## Übersicht

Dieses Dokument erklärt die technischen Unterschiede zwischen dem unsicheren Server (Port 5000) und dem sicheren Server (Port 6000).

---

## 🔴 UNSICHERER Server (unsecurepage/server.py)

### Problem 1: Kein Input Escaping

**Code Zeile 10 (unsicher):**
```python
search_results = f'<div>...{search_query}</div>'
```

**Was passiert:**
- User Input wird **DIREKT** in HTML eingefügt
- Keine Validierung, kein Escaping
- XSS-Code wird 1:1 ins HTML geschrieben

**Beispiel:**
```
Input vom User:  <img src=x onerror="alert('XSS')">
Output im HTML:  <div>...<img src=x onerror="alert('XSS')"></div>
                              ↑ wird als HTML ausgeführt!
```

### Problem 2: Jinja2 `|safe` Filter

**In den Templates (z.B. index.html Zeile 51-54):**
```html
{{ search_results|safe }}
{{ promo_banner|safe }}
{{ error_display|safe }}
{{ review_display|safe }}
```

**Was bedeutet `|safe`?**
- Sagt Jinja2: "Vertraue diesem HTML, escape es NICHT"
- Dadurch wird der XSS-Code direkt gerendert
- Browser führt den JavaScript-Code aus

### Angriffs-Flow (unsicher):

1. **Angreifer sendet:** `http://localhost:5000/?search=<img src=x onerror="alert(1)">`
2. **server.py Zeile 10:** `search_results = f'<div>...<img src=x onerror="alert(1)"></div>'`
3. **Template erhält:** HTML-String mit XSS-Payload
4. **Template rendert:** `{{ search_results|safe }}` → KEIN Escaping
5. **Browser führt aus:** `onerror="alert(1)"` ❌ **XSS erfolgreich!**

---

## 🟢 SICHERER Server (securepage/server_secure.py)

### Schutz 1: Input Escaping mit `escape()`

**Code Zeile 7 (sicher):**
```python
from flask import escape

search_query = escape(request.args.get('search', ''))
```

**Was macht `escape()`?**

Konvertiert gefährliche HTML-Zeichen in sichere HTML-Entities:

| Zeichen | Wird zu | Bedeutung |
|---------|---------|-----------|
| `<` | `&lt;` | Less than |
| `>` | `&gt;` | Greater than |
| `"` | `&quot;` | Quote |
| `'` | `&#x27;` | Apostrophe |
| `&` | `&amp;` | Ampersand |

**Beispiel-Transformation:**
```
Input vom User:
<img src=x onerror="alert('XSS')">

Nach escape():
&lt;img src=x onerror=&quot;alert('XSS')&quot;&gt;

Anzeige im Browser (als TEXT, nicht CODE):
<img src=x onerror="alert('XSS')">
```

### Schutz 2: Content Security Policy (CSP)

**Code Zeilen 35-37:**
```python
response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
response.headers['X-Content-Type-Options'] = 'nosniff'
response.headers['X-Frame-Options'] = 'DENY'
```

**Was macht CSP?**

- **`default-src 'self'`**: Nur Ressourcen von gleicher Domain laden
- **`script-src 'self'`**: JavaScript nur von eigener Domain (nicht inline!)
- **`style-src 'self' 'unsafe-inline'`**: CSS von eigener Domain + inline styles

**Selbst WENN ein XSS-Payload durchkommt:**
```html
<img src=x onerror="alert(1)">
```
- Browser blockiert `onerror` weil es inline JavaScript ist
- CSP verhindert die Ausführung
- Browser Console zeigt: **"Refused to execute inline event handler"**

### Schutz 3: Zusätzliche Security Headers

**`X-Content-Type-Options: nosniff`**
- Verhindert MIME-Type Sniffing
- Browser interpretiert Dateien nur als angegebenen Content-Type
- Schutz vor falscher Interpretation von Dateien

**`X-Frame-Options: DENY`**
- Verhindert Clickjacking-Angriffe
- Seite kann nicht in `<iframe>` eingebettet werden
- Schutz vor UI-Redressing

---

## 📊 Direkter Code-Vergleich

### Unsicherer Server (server.py)

```python
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # PROBLEM: Kein Escaping!
    search_query = request.args.get('search', '')

    # PROBLEM: User Input direkt in HTML!
    if search_query:
        search_results = f'<div>Suchergebnisse: {search_query}</div>'

    # PROBLEM: Template verwendet |safe Filter
    return render_template('index.html',
                         search_results=search_results)
```

**Template (index.html):**
```html
{{ search_results|safe }}
<!-- |safe = Kein Escaping, XSS möglich! -->
```

---

### Sicherer Server (server_secure.py)

```python
from flask import Flask, request, render_template, escape, make_response

app = Flask(__name__)

@app.route('/')
def index():
    # LÖSUNG 1: Escaping!
    search_query = escape(request.args.get('search', ''))

    # User Input ist jetzt sicher (HTML Entities)
    if search_query:
        search_results = f'<div>Suche (escaped): {search_query}</div>'

    response = make_response(render_template('index.html',
                         search_results=search_results))

    # LÖSUNG 2: CSP Header!
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self';"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'

    return response
```

**Template (index.html):**
```html
{{ search_results|safe }}
<!-- |safe ist OK, weil Input bereits escaped ist -->
```

---

## 🧪 Praktischer Test-Vergleich

### Test-Payload:
```html
<img src=x onerror="alert('XSS')">
```

### Unsicherer Server (localhost:5000)

**URL:**
```
http://localhost:5000/?search=<img src=x onerror="alert('XSS')">
```

**HTTP Response (in Burp Suite sichtbar):**
```html
<div style="...">
    <strong>Suchergebnisse:</strong> <img src=x onerror="alert('XSS')">
</div>
```

**Was passiert:**
- ✅ XSS-Payload ist RAW im HTML
- ✅ Browser führt JavaScript aus
- ✅ Alert-Box erscheint
- ❌ **Angriff erfolgreich!**

---

### Sicherer Server (localhost:6000)

**URL:**
```
http://localhost:6000/?search=<img src=x onerror="alert('XSS')">
```

**HTTP Response (in Burp Suite sichtbar):**
```html
<div style="...">
    <strong>Suche (escaped):</strong> &lt;img src=x onerror=&quot;alert('XSS')&quot;&gt;
</div>
```

**Was passiert:**
- ✅ XSS-Payload ist ESCAPED (HTML Entities)
- ✅ Browser zeigt es als TEXT an
- ❌ JavaScript wird NICHT ausgeführt
- ❌ Keine Alert-Box
- ✅ **Angriff blockiert!**

**Im Browser sieht der User:**
```
Suche (escaped): <img src=x onerror="alert('XSS')">
```
(Als normaler Text, nicht als funktionierender HTML-Code)

---

## 🔍 Technische Details

### Warum `escape()` funktioniert

**Beispiel 1: Script-Tag**

```python
# Unsicher
search_query = "<script>alert(1)</script>"
search_results = f'<div>{search_query}</div>'
# Resultat: <div><script>alert(1)</script></div>
# Browser führt Script aus! ❌

# Sicher
search_query = escape("<script>alert(1)</script>")
# search_query ist jetzt: "&lt;script&gt;alert(1)&lt;/script&gt;"
search_results = f'<div>{search_query}</div>'
# Resultat: <div>&lt;script&gt;alert(1)&lt;/script&gt;</div>
# Browser zeigt: <script>alert(1)</script> als Text ✅
```

**Beispiel 2: IMG mit onerror**

```python
# Unsicher
search_query = '<img src=x onerror="alert(1)">'
search_results = f'<div>{search_query}</div>'
# Resultat: <div><img src=x onerror="alert(1)"></div>
# Browser lädt Bild, schlägt fehl, führt onerror aus! ❌

# Sicher
search_query = escape('<img src=x onerror="alert(1)">')
# search_query ist jetzt: "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"
search_results = f'<div>{search_query}</div>'
# Resultat: <div>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</div>
# Browser zeigt: <img src=x onerror="alert(1)"> als Text ✅
```

---

### Warum CSP zusätzlich wichtig ist (Defense in Depth)

**Szenario: Entwickler vergisst `escape()` an einer Stelle**

```python
# Fehler: Vergessen zu escapen!
user_input = request.args.get('test', '')
output = f'<div>{user_input}</div>'
```

**Ohne CSP:**
- XSS-Payload wird ausgeführt
- Cookies werden gestohlen
- Komplette Übernahme möglich

**Mit CSP:**
```
Content-Security-Policy: script-src 'self'
```
- Inline JavaScript wird blockiert
- `onerror`, `onclick` etc. funktionieren nicht
- Browser blockt die Ausführung
- Schaden wird minimiert

**Das nennt man "Defense in Depth" (Verteidigung in der Tiefe):**
- Mehrere Schutzschichten
- Wenn eine versagt, greifen andere
- Best Practice in der Sicherheit

---

## 📋 Übersichtstabelle

| Aspekt | Unsicher (Port 5000) | Sicher (Port 6000) |
|--------|---------------------|-------------------|
| **Input Escaping** | ❌ Kein `escape()` | ✅ `escape()` auf allen Inputs |
| **HTML Injection** | ✅ Möglich durch direkte String-Interpolation | ❌ Verhindert durch HTML Entities |
| **Template Filter** | `{{ var\|safe }}` ohne Escaping | `{{ var\|safe }}` mit bereits escaped Input |
| **CSP Header** | ❌ Nicht vorhanden | ✅ Strenge Policy |
| **X-Content-Type** | ❌ Nicht gesetzt | ✅ `nosniff` |
| **X-Frame-Options** | ❌ Nicht gesetzt | ✅ `DENY` |
| **XSS möglich?** | ✅ JA - Alle 7 Vektoren | ❌ NEIN - Komplett blockiert |
| **Cookie-Diebstahl** | ✅ Möglich mit `fetch()` | ❌ Blockiert durch CSP |
| **Inline Scripts** | ✅ Werden ausgeführt | ❌ Blockiert durch CSP |
| **Security Level** | 🔴 Kritisch verwundbar | 🟢 Gut geschützt |

---

## 🎯 Alle 7 XSS-Vektoren im Vergleich

### Vector 1: Search Parameter

**Unsicher:**
```python
search_query = request.args.get('search', '')
search_results = f'<div>{search_query}</div>'
```
**Payload:** `/?search=<img src=x onerror=alert(1)>`
**Resultat:** ❌ XSS funktioniert

**Sicher:**
```python
search_query = escape(request.args.get('search', ''))
search_results = f'<div>{search_query}</div>'
```
**Payload:** `/?search=<img src=x onerror=alert(1)>`
**Resultat:** ✅ Escaped, nur Text

---

### Vector 2: Promo Parameter

**Unsicher:**
```python
promo = request.args.get('promo', '')
promo_banner = f'<div>Promotion: {promo}</div>'
```
**Payload:** `/?promo=<svg onload=alert(1)>`
**Resultat:** ❌ XSS funktioniert

**Sicher:**
```python
promo = escape(request.args.get('promo', ''))
promo_banner = f'<div>Promo (escaped): {promo}</div>'
```
**Payload:** `/?promo=<svg onload=alert(1)>`
**Resultat:** ✅ Escaped, nur Text

---

### Vector 3: Error Parameter

**Unsicher:**
```python
error = request.args.get('error', '')
error_display = f'<div>Fehler: {error}</div>'
```
**Payload:** `/?error=<details open ontoggle=alert(1)>`
**Resultat:** ❌ XSS funktioniert

**Sicher:**
```python
error = escape(request.args.get('error', ''))
error_display = f'<div>Fehler (escaped): {error}</div>'
```
**Payload:** `/?error=<details open ontoggle=alert(1)>`
**Resultat:** ✅ Escaped, nur Text

---

### Vector 4: Filter Parameter

**Unsicher:**
```python
filter_param = request.args.get('filter', '')
filter_display = f'<div>Filter: {filter_param}</div>'
```
**Payload:** `/?filter=<input autofocus onfocus=alert(1)>`
**Resultat:** ❌ XSS funktioniert

**Sicher:**
```python
filter_param = escape(request.args.get('filter', ''))
filter_display = f'<div>Filter (escaped): {filter_param}</div>'
```
**Payload:** `/?filter=<input autofocus onfocus=alert(1)>`
**Resultat:** ✅ Escaped, nur Text

---

### Vector 5: Review Parameter

**Unsicher:**
```python
review = request.args.get('review', '')
review_display = f'<div><p>{review}</p></div>'
```
**Payload:** `/?review=<iframe src=javascript:alert(1)>`
**Resultat:** ❌ XSS funktioniert

**Sicher:**
```python
review = escape(request.args.get('review', ''))
review_display = f'<div><p>{review}</p></div>'
```
**Payload:** `/?review=<iframe src=javascript:alert(1)>`
**Resultat:** ✅ Escaped, nur Text

---

### Vector 6: Contact Message Parameter

**Unsicher:**
```python
message = request.args.get('message', '')
contact_confirm = f'<div>Nachricht: {message}</div>'
```
**Payload:** `/contact?message=<body onload=alert(1)>`
**Resultat:** ❌ XSS funktioniert

**Sicher:**
```python
message = escape(request.args.get('message', ''))
contact_confirm = f'<div>Nachricht (escaped): {message}</div>'
```
**Payload:** `/contact?message=<body onload=alert(1)>`
**Resultat:** ✅ Escaped, nur Text

---

### Vector 7: Voucher Parameter

**Unsicher:**
```python
voucher = request.args.get('voucher', '')
voucher_result = f'<div>Gutschein: {voucher} angewendet!</div>'
```
**Payload:** `/cart?voucher=<marquee onstart=alert(1)>`
**Resultat:** ❌ XSS funktioniert

**Sicher:**
```python
voucher = escape(request.args.get('voucher', ''))
voucher_result = f'<div>Gutschein (escaped): {voucher} angewendet!</div>'
```
**Payload:** `/cart?voucher=<marquee onstart=alert(1)>`
**Resultat:** ✅ Escaped, nur Text

---

## 🛡️ Best Practices für sichere Web-Entwicklung

### 1. IMMER User Input escapen
```python
# FALSCH
user_input = request.args.get('data', '')
output = f'<div>{user_input}</div>'

# RICHTIG
user_input = escape(request.args.get('data', ''))
output = f'<div>{user_input}</div>'
```

### 2. Niemals `|safe` mit User Input verwenden
```html
<!-- FALSCH -->
{{ user_input|safe }}

<!-- RICHTIG -->
{{ user_input }}
```

### 3. Content Security Policy implementieren
```python
response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self';"
```

### 4. Security Headers setzen
```python
response.headers['X-Content-Type-Options'] = 'nosniff'
response.headers['X-Frame-Options'] = 'DENY'
response.headers['X-XSS-Protection'] = '1; mode=block'
```

### 5. Defense in Depth
- Mehrere Schutzschichten verwenden
- Input Validation + Output Encoding + CSP
- Wenn eine Schicht versagt, greifen andere

---

## 💡 Zusammenfassung

### Der unsichere Server ist verwundbar weil:

1. ❌ **Kein Input Escaping:** User Input wird direkt in HTML eingefügt
2. ❌ **Template `|safe` Filter:** Verhindert automatisches Escaping von Jinja2
3. ❌ **Keine CSP:** Browser hat keine Richtlinien für erlaubte Scripts
4. ❌ **Keine Security Headers:** Keine zusätzlichen Schutzmaßnahmen
5. ❌ **String Interpolation:** F-Strings mit unvalidiertem Input

**Resultat:** 7 XSS-Vektoren, alle voll ausnutzbar

---

### Der sichere Server ist geschützt weil:

1. ✅ **Input Escaping mit `escape()`:** HTML-Zeichen → HTML-Entities
2. ✅ **Content Security Policy:** Blockiert inline JavaScript
3. ✅ **Security Headers:** X-Content-Type-Options, X-Frame-Options
4. ✅ **Defense in Depth:** Mehrere Schutzschichten
5. ✅ **Best Practices:** Korrekte Verwendung von Flask Security Features

**Resultat:** Alle XSS-Angriffe blockiert, keine erfolgreiche Exploitation möglich

---

## 🔑 Key Takeaway

**Der Hauptunterschied ist eine einzige Zeile Code:**

```python
# Unsicher
user_input = request.args.get('param', '')

# Sicher
user_input = escape(request.args.get('param', ''))
```

**Plus die CSP-Header:**

```python
response.headers['Content-Security-Policy'] = "script-src 'self';"
```

Diese zwei Mechanismen machen den kompletten Unterschied zwischen **verwundbar** und **sicher**!
