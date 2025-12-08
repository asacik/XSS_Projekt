from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def index():
    search_query = request.args.get('search', '')
    search_results = ''
    if search_query:
        search_results = f'<div style="max-width: 1200px; margin: 20px auto; padding: 20px; background: white;"><strong>Suchergebnisse:</strong> {search_query}</div>'

    reviewer = request.args.get('reviewer', '')
    review = request.args.get('review', '')
    review_display = ''
    if reviewer and review:
        review_display = f'<div style="background: #f8f9fa; padding: 25px;"><strong>{reviewer}</strong><p>{review}</p></div>'

    return render_template('index.html',
                         search_value=search_query,
                         search_results=search_results,
                         review_display=review_display)

@app.route('/contact')
def contact():
    contact_name = request.args.get('contact_name', '')
    subject = request.args.get('subject', '')
    message = request.args.get('message', '')
    contact_confirm = ''

    if contact_name and subject and message:
        contact_confirm = f'<div style="padding: 20px; background: #d4edda;">Nachricht gesendet! Hallo {contact_name}, danke fuer "{subject}"</div>'

    return render_template('contact.html', contact_confirm=contact_confirm)

@app.route('/cart')
def cart():
    voucher = request.args.get('voucher', '')
    voucher_result = ''

    if voucher:
        voucher_result = f'<div style="padding: 15px; background: #d4edda;">Gutschein: {voucher} angewendet!</div>'

    return render_template('cart.html', voucher_result=voucher_result)

if __name__ == '__main__':
    print("Server: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
