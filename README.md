# XSS Projekt - Reflected XSS Demonstration

##  WARNUNG
Diese Anwendung enthält **absichtlich Sicherheitslücken** und darf **NUR** in kontrollierten Umgebungen für Bildungszwecke verwendet werden.

##  Über das Projekt

Dieses Projekt demonstriert **Reflected XSS-Angriffe** anhand einer verwundbaren E-Commerce-Website.

**Komponenten:**
- **unsecurepage/** - Vulnerable Website mit 9 XSS-Lücken
- **securepage/** - Sichere Implementierung mit CSP
- **AttServ/** - Attacker-Server (Terminal-basiert)

##  Installation

### 1. Repository klonen
```bash
git clone https://github.com/asacik/XSS_Projekt.git
cd XSS_Projekt
```

### 2. Node.js Abhängigkeiten installieren
```bash
cd AttServ
npm install
```

## Projekt starten

### 1. Attacker-Server starten (Terminal 1)
```bash
cd AttServ
npm start
```

Der Server zeigt gestohlene Cookies und Tastatureingaben direkt im Terminal an.

### 2. Webserver starten (Terminal 2)
```bash
python -m http.server 8000
```

### 3. Browser öffnen
- **Unsichere Website:** `http://localhost:8000/unsecurepage/`
- **Sichere Website:** `http://localhost:8000/securepage/`


## 📚 XSS-Schwachstellen

Die unsicure Website hat **9 verschiedene XSS-Angriffsvektoren:**

1. Search Query (`?search=`)
2. Username (`?username=`)
3. Promo Banner (`?promo=`)
4. Error Display (`?error=`)
5. Filter (`?filter=`)
6. Review (`?reviewer=&review=`)
7. Email (`?email=`)
8. Contact Form (`?contact_name=&subject=&message=`)
9. Voucher Code (`?voucher=`)

Alle Payloads sind in `payloads.md` dokumentiert

## ⚠️ Rechtlicher Hinweis

Dieses Projekt dient **ausschließlich Bildungszwecken**.

Das Ausnutzen von XSS-Schwachstellen ohne Erlaubnis ist **illegal**.
