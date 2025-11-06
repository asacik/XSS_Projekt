# XSS_Projekt

## ⚠️ WARNUNG
Diese Anwendung enthält absichtlich Sicherheitslücken und darf **NUR** in kontrollierten Umgebungen für Bildungszwecke verwendet werden. Niemals auf öffentlichen Servern deployen!

## Was ist in diesem Repo?
Eine vulnerable Webanwendung zur Demonstration von Reflected Cross-Site Scripting (XSS) Angriffen für Live-Hacking-Demos und IT-Sicherheitsschulungen.

Das Repo enthält eine einfache HTML-Seite mit Suchfunktion, die Benutzereingaben unsicher verarbeitet und direkt im Browser reflektiert.

## Projekt starten

1. Repository klonen:
```bash
git clone <repository-url>
cd reflected-xss-demo
```

2. Python-Webserver starten:
```bash
python3 -m http.server 8000
```

3. Browser öffnen und zu `http://localhost:8000` navigieren
