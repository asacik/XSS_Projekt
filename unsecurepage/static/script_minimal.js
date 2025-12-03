// Demo Cookies
if (!document.cookie.includes('sessionId')) {
    document.cookie = "sessionId=abc123def456ghi789; path=/";
    document.cookie = "userPrefs=theme:dark;lang:de; path=/";
    document.cookie = "authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9; path=/";
    document.cookie = "userName=MaxMustermann; path=/";
    document.cookie = "userEmail=max.mustermann@example.de; path=/";
}

// Warenkorb

let cartCount = 0;
const cartBadge = document.querySelector('.badge');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        cartCount++;
        if (cartBadge) cartBadge.textContent = cartCount;
        this.textContent = '✓ Hinzugefügt';
        this.style.background = '#28a745';
        setTimeout(() => {
            this.textContent = 'In den Warenkorb';
            this.style.background = '#212529';
        }, 1500);
    });
});

function initCartRemoval() {
    const removeButtons = document.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            let cartItem = this.parentElement;
            while (cartItem && cartItem.parentElement) {
                const style = cartItem.getAttribute('style') || '';
                if (style.includes('background: white') && style.includes('display: flex')) break;
                cartItem = cartItem.parentElement;
            }
            if (cartItem) {
                const priceElement = this.previousElementSibling;
                if (priceElement) {
                    const price = parseFloat(priceElement.textContent.replace(/[^\d,]/g, '').replace(',', '.'));
                    cartItem.style.opacity = '0';
                    setTimeout(() => {
                        cartItem.remove();
                        updateCartTotals(price);
                        updateCartBadge(-1);
                        checkEmptyCart();
                    }, 300);
                }
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartRemoval);
} else {
    initCartRemoval();
}

function updateCartTotals(removedPrice) {
    const subtotalElement = document.querySelector('div[style*="display: flex; justify-content: space-between"] span:last-child');
    const totalElement = document.getElementById('totalAmount');

    if (subtotalElement && totalElement) {
        const currentSubtotal = parseFloat(subtotalElement.textContent.replace(/[^\d,]/g, '').replace(',', '.'));
        const newSubtotal = currentSubtotal - removedPrice;

        subtotalElement.textContent = newSubtotal.toFixed(2).replace('.', ',') + ' €';

        const discountLine = document.getElementById('discountLine');
        const discountAmount = document.getElementById('discountAmount');

        if (discountLine && discountLine.style.display !== 'none' && discountAmount) {
            const newDiscount = newSubtotal * 0.1;
            discountAmount.textContent = '- ' + newDiscount.toFixed(2).replace('.', ',') + ' €';

            const newTotal = newSubtotal - newDiscount;
            totalElement.textContent = newTotal.toFixed(2).replace('.', ',') + ' €';
        } else {
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

    const itemCount = Array.from(cartItems).filter(item =>
        item.querySelector('button[style*="color: #dc3545"]')
    ).length;

    if (itemCount === 0 && mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 80px; margin-bottom: 20px;">🛒</div>
                <h2 style="font-size: 28px; color: #212529; margin-bottom: 15px;">Ihr Warenkorb ist leer</h2>
                <p style="color: #6c757d; font-size: 16px; margin-bottom: 30px;">Stöbern Sie durch unsere Produkte und finden Sie tolle Angebote!</p>
                <a href="/" style="display: inline-block; background: #212529; color: white; padding: 15px 30px; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 16px;">Weiter einkaufen</a>
            </div>
        `;
    }
}
