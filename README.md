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

### 3. tunnelmole installieren (für Angreifer-Simulation)
```bash
npm install -g tunnelmole
```

## Projekt starten

Du brauchst **3 Terminals**:

### Terminal 1: Unsichere Website (REFLECTED XSS)
```bash
cd unsecurepage
python server.py
```
Server läuft auf: **`http://localhost:5000`** 

### Terminal 2: Sichere Website (mit Schutz)
```bash
cd securepage
python server_secure.py
```
Server läuft auf: **`http://localhost:5001`** 
### Terminal 3: Angreifer-Server mit tunnelmole
```bash
# Schritt 1: Python HTTP-Server starten
python -m http.server 8000

# Schritt 2: In einem neuen Terminal - tunnelmole starten
tmole 8000
```

**tunnelmole** erstellt eine öffentliche URL (z.B. `https://xyz.tunnelmole.net`), die zu deinem lokalen Server tunnelt. Diese URL verwendest du in deinen XSS-Payloads, um gestohlene Daten zu empfangen.

Im Terminal siehst du dann alle eingehenden Requests mit gestohlenen Cookies und Tastatureingaben!

### Browser öffnen
- **Unsichere Website:** `http://localhost:5000/` (XSS funktioniert!)
- **Sichere Website:** `http://localhost:5001/` (XSS wird blockiert!)
