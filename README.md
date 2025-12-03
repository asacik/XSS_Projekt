# XSS Projekt - Reflected XSS Demonstration

##  WARNUNG
Diese Anwendung enthält **absichtlich Sicherheitslücken** und darf **NUR** in kontrollierten Umgebungen für Bildungszwecke verwendet werden.

##  Über das Projekt

Dieses Projekt demonstriert **Reflected XSS-Angriffe** anhand einer verwundbaren E-Commerce-Website und zeigt Schutzmaßnahmen.

**Komponenten:**
- **unsecurepage/** - Vulnerable Website mit 7 Reflected XSS-Lücken (Flask Server)
- **securepage/** - Sichere Implementierung mit Input-Sanitization + CSP (Flask Server)
- **AttServ/** - Attacker-Server zum Abfangen gestohlener Daten (Node.js)

##  Installation

### 1. Repository klonen
```bash
git clone https://github.com/asacik/XSS_Projekt.git
cd XSS_Projekt
```

### 2. Python Abhängigkeiten installieren
```bash
pip install -r requirements.txt
```

### 3. Node.js Abhängigkeiten installieren (für Attacker-Server)
```bash
cd AttServ
npm install
cd ..
```

## Projekt starten

Du brauchst **mindestens 2 Terminals** (optional 3 mit Attacker-Server):

### Terminal 1: Unsichere Website (REFLECTED XSS)
```bash
cd unsecurepage
python server.py
```
Server läuft auf: **`http://localhost:5000`** ⚠️ VERWUNDBAR

### Terminal 2: Sichere Website (mit Schutz)
```bash
cd securepage
python server_secure.py
```
Server läuft auf: **`http://localhost:6000`** ✅ GESCHÜTZT

### Terminal 3 (Optional): Attacker-Server
```bash
cd AttServ
npm start
```
Server läuft auf: **`http://localhost:3000`**
Zeigt gestohlene Cookies und Tastatureingaben im Terminal an.

### Browser öffnen
- **Unsichere Website:** `http://localhost:5000/` (XSS funktioniert!)
- **Sichere Website:** `http://localhost:6000/` (XSS wird blockiert!)
- **Vergleich:** Teste denselben Payload auf beiden Seiten!


## 📚 XSS-Schwachstellen

Die unsicure Website hat **7 verschiedene XSS-Angriffsvektoren:**

1. Search Query (`?search=`)
2. Promo Banner (`?promo=`)
3. Error Display (`?error=`)
4. Filter (`?filter=`)
5. Review (`?reviewer=&review=`)
6. Contact Form (`?contact_name=&subject=&message=`)
7. Voucher Code (`?voucher=`)

Alle Payloads sind in `payloads.md` dokumentiert

## ⚠️ Rechtlicher Hinweis

Dieses Projekt dient **ausschließlich Bildungszwecken**.

Das Ausnutzen von XSS-Schwachstellen ohne Erlaubnis ist **illegal**.
