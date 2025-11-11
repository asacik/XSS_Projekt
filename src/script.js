 const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery) {
            // SICHERHEITSLÜCKE: Direkte Einfügung von Benutzereingaben ins DOM
            document.getElementById('searchResults').innerHTML = 
                '<div class="results-header">Suchergebnisse für: <span class="search-term">' + 
                searchQuery + 
                '</span></div>' +
                '<div class="no-results">Leider wurden keine passenden Produkte gefunden. Bitte versuchen Sie es mit anderen Suchbegriffen.</div>';
            
            // Suchfeld mit Suchanfrage befüllen
            document.querySelector('input[name="search"]').value = searchQuery;
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
