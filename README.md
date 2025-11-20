# Reflected XSS Projekt

## WARNUNG
Diese Anwendung enthält absichtlich Sicherheitslücken und darf **NUR** in kontrollierten Umgebungen für Bildungszwecke verwendet werden. Niemals auf öffentlichen Servern deployen!

## Was ist in diesem Repo?
Eine vulnerable Webanwendung zur Demonstration von Reflected Cross-Site Scripting (XSS), zur Vorführung.

Das Repo enthält eine HTML Webpage, die einen Online-Shop demonstireren soll, auf diesem Online-Shop sind mehrere Sicherheitslücken für einen XSS Angriff, möglich.

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

3. NodeJS Webserver Starten: 
```bash 
cd AttServ 
npm start
```

4. Browser öffnen und zu `http://localhost:8000` navigieren
4.1 bei zu ´http://localhost:8000/unsecurepage´ navigieren

5. Browser öffnen und zu ´http://localhost:3000´ navigieren 
5.1 bei zu ´http://localhost:3000/dashboard´ navigieren
