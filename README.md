# XSS Projekt - Reflected XSS Demonstration

##  WARNUNG
Diese Anwendung enthält **absichtlich Sicherheitslücken** und darf **NUR** in kontrollierten Umgebungen für Bildungszwecke verwendet werden.

##  Über das Projekt

Dieses Projekt demonstriert **Reflected XSS-Angriffe** anhand einer verwundbaren E-Commerce-Website und zeigt Schutzmaßnahmen.

Eine ausführliche **Schritt-für-Schritt Anleitung** findest du in der Datei [SBS_Projekt.pdf](SBS_Projekt.pdf).

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
Server läuft auf: **`http://localhost:5001`** ✅ GESCHÜTZT

### Terminal 3 (Optional): Attacker-Server
```bash
cd AttServ
npm start
```
Server läuft auf: **`http://localhost:3000`**
Zeigt gestohlene Cookies und Tastatureingaben im Terminal an.

### Browser öffnen
- **Unsichere Website:** `http://localhost:5000/` (XSS funktioniert!)
- **Sichere Website:** `http://localhost:5001/` (XSS wird blockiert!)
- **Vergleich:** Teste denselben Payload auf beiden Seiten!

