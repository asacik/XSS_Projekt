const urlParams = new URLSearchParams(window.location.search);

// Setze Demo-Cookies für XSS-Demonstration
// Diese Cookies simulieren eine echte Anwendung mit Session-Daten
if (!document.cookie.includes('sessionId')) {
    // Session Cookie (würde normalerweise vom Server gesetzt)
    document.cookie = "sessionId=abc123def456ghi789; path=/";

    // User Preferences Cookie
    document.cookie = "userPrefs=theme:dark;lang:de; path=/";

    // Auth Token (Demo - in Realität würde dieser httpOnly sein)
    document.cookie = "authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9; path=/";

    // Shopping Cart Cookie
    document.cookie = "cartItems=3; path=/";

    // User Info Cookie
    document.cookie = "userName=MaxMustermann; path=/";
    document.cookie = "userEmail=max.mustermann@example.de; path=/";
}

// SICHERHEITSLÜCKE 1: Search Query
const searchQuery = urlParams.get('search');
if (searchQuery) {
    const searchResultsDiv = document.getElementById('searchResults');
    if (searchResultsDiv) {
        searchResultsDiv.innerHTML =
            '<div style="max-width: 1200px; margin: 20px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">' +
            '<div style="margin-bottom: 15px;"><strong style="font-size: 18px; color: #212529;">Suchergebnisse für:</strong> <span style="color: #667eea; font-size: 18px; font-weight: 600;">' + searchQuery + '</span></div>' +
            '<div style="padding: 40px; text-align: center; color: #6c757d; background: #f8f9fa; border-radius: 4px;">' +
            '<div style="font-size: 48px; margin-bottom: 15px;">🔍</div>' +
            '<p style="font-size: 16px; margin: 0;">Leider wurden keine passenden Produkte gefunden. Bitte versuchen Sie es mit anderen Suchbegriffen.</p>' +
            '</div>' +
            '</div>';
        searchResultsDiv.style.display = 'block';
    }

    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput) {
        searchInput.value = searchQuery;
    }
}

// SICHERHEITSLÜCKE 2: Promo Banner
const promo = urlParams.get('promo');
if (promo) {
    const promoDiv = document.getElementById('promoBanner');
    if (promoDiv) {
        promoDiv.innerHTML =
            '<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px; text-align: center;">' +
            '🎉 Promotion aktiv: ' + promo + ' - Jetzt von exklusiven Rabatten profitieren!' +
            '</div>';
        promoDiv.style.display = 'block';
    }
}

// SICHERHEITSLÜCKE 3: Error Message
const error = urlParams.get('error');
if (error) {
    const errorDiv = document.getElementById('errorDisplay');
    if (errorDiv) {
        errorDiv.innerHTML =
            '<div style="max-width: 1200px; margin: 20px auto; padding: 20px; background: #fff3cd; border-left: 5px solid #ffc107; border-radius: 4px;">' +
            '<strong style="color: #856404;">⚠️ Fehler:</strong> ' + error +
            '</div>';
        errorDiv.style.display = 'block';
    }
}

// SICHERHEITSLÜCKE 4: Filter Display
const filter = urlParams.get('filter');
if (filter) {
    const filterDiv = document.getElementById('filterDisplay');
    if (filterDiv) {
        filterDiv.innerHTML =
            '<div style="max-width: 1200px; margin: 20px auto; padding: 15px; background: #e7f3ff; border-left: 5px solid #2196F3; border-radius: 4px;">' +
            '<strong>🔍 Aktiver Filter:</strong> ' + filter + ' ' +
            '<a href="index.html" style="margin-left: 15px; color: #dc3545; text-decoration: none; font-weight: 600;">✕ Filter entfernen</a>' +
            '</div>';
        filterDiv.style.display = 'block';
    }
}

// SICHERHEITSLÜCKE 5: Product Review Display
const reviewer = urlParams.get('reviewer');
const review = urlParams.get('review');
if (reviewer && review) {
    const reviewDiv = document.getElementById('reviewDisplay');
    if (reviewDiv) {
        reviewDiv.innerHTML =
            '<div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #28a745;">' +
            '<div style="display: flex; align-items: center; margin-bottom: 10px;">' +
            '<div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; margin-right: 15px;">👤</div>' +
            '<div><strong style="font-size: 18px;">' + reviewer + '</strong><br><span style="color: #ffc107;">★★★★★</span></div>' +
            '</div>' +
            '<p style="margin: 15px 0 0 0; color: #333; line-height: 1.6;">' + review + '</p>' +
            '<div style="margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 4px; color: #155724;">' +
            '✓ Vielen Dank für Ihre Bewertung! Sie hilft anderen Kunden bei der Kaufentscheidung.' +
            '</div>' +
            '</div>';
        reviewDiv.style.display = 'block';
    }
}

// SICHERHEITSLÜCKE 6: Contact Form Confirmation
const contactName = urlParams.get('contact_name');
const subject = urlParams.get('subject');
const message = urlParams.get('message');
if (contactName && subject && message) {
    const contactConfirmDiv = document.getElementById('contactConfirm');
    if (contactConfirmDiv) {
        contactConfirmDiv.innerHTML =
            '<div style="padding: 20px; background: #d4edda; border-radius: 4px; border-left: 4px solid #28a745; margin-top: 20px;">' +
            '<strong style="color: #155724;">✓ Nachricht erfolgreich gesendet!</strong><br>' +
            '<p style="margin: 10px 0 0 0; color: #155724;">Hallo ' + contactName + ', vielen Dank für Ihre Nachricht zum Thema "' + subject + '".<br>' +
            'Unser Team wird sich in Kürze bei Ihnen melden.</p>' +
            '</div>';
        contactConfirmDiv.style.display = 'block';
    }
}

// SICHERHEITSLÜCKE 7: Voucher/Discount Code (for cart.html)
const voucher = urlParams.get('voucher');
if (voucher) {
    const voucherResultDiv = document.getElementById('voucherResult');
    if (voucherResultDiv) {
        voucherResultDiv.innerHTML =
            '<div style="padding: 15px; background: #d4edda; border-radius: 4px; border-left: 4px solid #28a745;">' +
            '<strong style="color: #155724;">✓ Gutscheincode angewendet!</strong><br>' +
            '<p style="margin: 10px 0 0 0; color: #155724; font-size: 14px;">Code: <strong>' + voucher + '</strong><br>' +
            'Sie erhalten 10% Rabatt auf Ihre Bestellung!</p>' +
            '</div>';
        voucherResultDiv.style.display = 'block';

        // Update discount and total
        const discountLine = document.getElementById('discountLine');
        const discountAmount = document.getElementById('discountAmount');
        const totalAmount = document.getElementById('totalAmount');

        if (discountLine && discountAmount && totalAmount) {
            discountLine.style.display = 'block';
            discountAmount.textContent = '- 186,70 €';
            totalAmount.textContent = '1.680,30 €';
        }
    }
}

// Shopping Cart Funktionalität
let cartCount = 0;
const cartBadge = document.querySelector('.badge');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        cartCount++;
        cartBadge.textContent = cartCount;

        // Visual Feedback
        this.textContent = '✓ Hinzugefügt';
        this.style.background = '#28a745';

        setTimeout(() => {
            this.textContent = 'In den Warenkorb';
            this.style.background = '#212529';
        }, 1500);
    });
});

// Cart Item Removal Funktionalität (für cart.html)
function initCartRemoval() {
    const removeButtons = document.querySelectorAll('.remove-item-btn');

    console.log('Found remove buttons:', removeButtons.length);

    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Entfernen button clicked!');

            // Finde das übergeordnete Item-Container-Element
            let cartItem = this.parentElement;
            while (cartItem && cartItem.parentElement) {
                const style = cartItem.getAttribute('style') || '';
                if (style.includes('background: white') && style.includes('display: flex')) {
                    break;
                }
                cartItem = cartItem.parentElement;
            }

            console.log('Found cart item:', cartItem);

            if (cartItem) {
                // Hole den Preis - das ist das Geschwister-Element des Buttons
                const priceElement = this.previousElementSibling;

                console.log('Found price element:', priceElement);

                if (priceElement) {
                    const priceText = priceElement.textContent.trim();
                    const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));

                    console.log('Price:', price);

                    // Animiere das Entfernen
                    cartItem.style.transition = 'opacity 0.3s, transform 0.3s';
                    cartItem.style.opacity = '0';
                    cartItem.style.transform = 'translateX(-20px)';

                    setTimeout(() => {
                        cartItem.remove();

                        // Update die Zwischensumme und Gesamtsumme
                        updateCartTotals(price);

                        // Update den Cart Badge
                        updateCartBadge(-1);

                        // Prüfe ob der Warenkorb leer ist
                        checkEmptyCart();
                    }, 300);
                } else {
                    console.error('Could not find price element');
                }
            } else {
                console.error('Could not find cart item');
            }
        });
    });
}

// Initialisiere Cart Removal wenn DOM geladen ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartRemoval);
} else {
    initCartRemoval();
}

function updateCartTotals(removedPrice) {
    const subtotalElement = document.querySelector('div[style*="display: flex; justify-content: space-between"] span:last-child');
    const totalElement = document.getElementById('totalAmount');

    if (subtotalElement && totalElement) {
        // Hole aktuelle Zwischensumme
        const currentSubtotal = parseFloat(subtotalElement.textContent.replace(/[^\d,]/g, '').replace(',', '.'));
        const newSubtotal = currentSubtotal - removedPrice;

        // Update Zwischensumme
        subtotalElement.textContent = newSubtotal.toFixed(2).replace('.', ',') + ' €';

        // Prüfe ob ein Rabatt aktiv ist
        const discountLine = document.getElementById('discountLine');
        const discountAmount = document.getElementById('discountAmount');

        if (discountLine && discountLine.style.display !== 'none' && discountAmount) {
            // Berechne neuen Rabatt (10%)
            const newDiscount = newSubtotal * 0.1;
            discountAmount.textContent = '- ' + newDiscount.toFixed(2).replace('.', ',') + ' €';

            // Update Gesamtsumme mit Rabatt
            const newTotal = newSubtotal - newDiscount;
            totalElement.textContent = newTotal.toFixed(2).replace('.', ',') + ' €';
        } else {
            // Update Gesamtsumme ohne Rabatt
            totalElement.textContent = newSubtotal.toFixed(2).replace('.', ',') + ' €';
        }
    }
}

function updateCartBadge(change) {
    const badge = document.querySelector('.badge');
    if (badge) {
        const currentCount = parseInt(badge.textContent) || 0;
        const newCount = Math.max(0, currentCount + change);
        badge.textContent = newCount;
    }
}

function checkEmptyCart() {
    const cartItems = document.querySelectorAll('div[style*="background: white"][style*="display: flex"]');
    const mainContent = document.querySelector('.main-content');

    // Zähle nur Warenkorb-Items (nicht die Bestellübersicht)
    const itemCount = Array.from(cartItems).filter(item =>
        item.querySelector('button[style*="color: #dc3545"]')
    ).length;

    if (itemCount === 0 && mainContent) {
        // Zeige "Warenkorb ist leer" Nachricht
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 80px; margin-bottom: 20px;">🛒</div>
                <h2 style="font-size: 28px; color: #212529; margin-bottom: 15px;">Ihr Warenkorb ist leer</h2>
                <p style="color: #6c757d; font-size: 16px; margin-bottom: 30px;">Stöbern Sie durch unsere Produkte und finden Sie tolle Angebote!</p>
                <a href="index.html" style="display: inline-block; background: #212529; color: white; padding: 15px 30px; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 16px;">Weiter einkaufen</a>
            </div>
        `;
    }
}
