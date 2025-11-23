# XSS Projekt

## WARNUNG
Diese Anwendung enthält absichtlich Sicherheitslücken und darf **NUR** in kontrollierten Umgebungen für Bildungszwecke verwendet werden.

## Installation

1. Repository klonen:
```bash
git clone https://github.com/asacik/XSS_Projekt.git
cd XSS_Projekt
```

2. Node.js Abhängigkeiten installieren:
```bash
cd AttServ
npm install
```

## Projekt starten

1. Attacker-Server starten:
```bash
cd AttServ
npm start
```

2. In einem neuen Terminal, Webserver starten:
```bash
python -m http.server 8000
```

3. Browser öffnen:
- Shop: `http://localhost:8000/unsecurepage`
- Dashboard: `http://localhost:3000/dashboard`
