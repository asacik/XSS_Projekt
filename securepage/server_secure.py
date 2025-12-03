from flask import Flask, request, render_template, escape, make_response

app = Flask(__name__)

@app.route('/')
def index():
    search_query = escape(request.args.get('search', ''))
    search_results = ''
    if search_query:
        search_results = f'<div style="padding: 20px; background: white;"><strong>Suche (escaped):</strong> {search_query}</div>'

    promo = escape(request.args.get('promo', ''))
    promo_banner = ''
    if promo:
        promo_banner = f'<div style="background: #d4edda; padding: 15px;">Promo (escaped): {promo}</div>'

    error = escape(request.args.get('error', ''))
    error_display = ''
    if error:
        error_display = f'<div style="padding: 20px; background: #fff3cd;">Fehler (escaped): {error}</div>'

    reviewer = escape(request.args.get('reviewer', ''))
    review = escape(request.args.get('review', ''))
    review_display = ''
    if reviewer and review:
        review_display = f'<div style="padding: 20px; background: #f8f9fa;"><strong>{reviewer}</strong><p>{review}</p><small>Alle Eingaben wurden escaped</small></div>'

    response = make_response(render_template('index.html',
                         search_value=search_query,
                         search_results=search_results,
                         promo_banner=promo_banner,
                         error_display=error_display,
                         review_display=review_display))

    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'

    return response

if __name__ == '__main__':
    print("Sicherer Server: http://localhost:6000")
    app.run(debug=True, host='0.0.0.0', port=6000)
