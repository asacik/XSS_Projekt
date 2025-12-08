from flask import Flask, request, render_template, make_response
from markupsafe import escape

app = Flask(__name__)

@app.route('/')
def index():
    search_query = escape(request.args.get('search', ''))
    search_results = ''
    if search_query:
        search_results = f'<div style="padding: 20px; background: white;"><strong>Suche (escaped):</strong> {search_query}</div>'

    reviewer = escape(request.args.get('reviewer', ''))
    review = escape(request.args.get('review', ''))
    review_display = ''
    if reviewer and review:
        review_display = f'<div style="padding: 20px; background: #f8f9fa;"><strong>{reviewer}</strong><p>{review}</p><small>Alle Eingaben wurden escaped</small></div>'

    response = make_response(render_template('index.html',
                         search_value=search_query,
                         search_results=search_results,
                         review_display=review_display))

    # Security Headers
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'

    # Sichere Cookies mit HttpOnly und SameSite setzen
    if not request.cookies.get('sessionId'):
        response.set_cookie('sessionId', 'abc123def456ghi789', httponly=True, secure=False, samesite='Lax')
        response.set_cookie('userPrefs', 'theme:dark;lang:de', httponly=True, secure=False, samesite='Lax')
        response.set_cookie('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', httponly=True, secure=False, samesite='Lax')
        response.set_cookie('userName', 'MaxMustermann', httponly=True, secure=False, samesite='Lax')
        response.set_cookie('userEmail', 'max.mustermann@example.de', httponly=True, secure=False, samesite='Lax')

    return response

@app.route('/cart')
def cart():
    voucher = escape(request.args.get('voucher', ''))
    voucher_result = ''
    if voucher:
        voucher_result = f'<div style="padding: 20px; background: #d4edda; margin-bottom: 20px;">Gutschein "{voucher}" wurde geprüft (escaped)</div>'

    response = make_response(render_template('cart.html', voucher_result=voucher_result))
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    return response

@app.route('/contact')
def contact():
    contact_name = escape(request.args.get('contact_name', ''))
    subject = escape(request.args.get('subject', ''))
    message = escape(request.args.get('message', ''))
    contact_confirm = ''
    if contact_name and subject and message:
        contact_confirm = f'<div style="padding: 20px; background: #d4edda; margin-bottom: 20px;">Danke {contact_name}! Ihre Nachricht "{subject}" wurde empfangen (escaped)</div>'

    response = make_response(render_template('contact.html', contact_confirm=contact_confirm))
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    return response

if __name__ == '__main__':
    print("Sicherer Server: http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)
