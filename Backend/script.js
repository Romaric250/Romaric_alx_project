document.addEventListener('DOMContentLoaded', () => {
    const burgerContainer = document.getElementById('burger-container');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const addToCartButton = document.getElementById('add-to-cart');
    const cartItems = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout');

    let burgers = [];

    // Fetch burgers from the API
    fetch('/api/burgers')
        .then(response => response.json())
        .then(data => {
            burgers = data;
            displayBurgers();
        });

    // Display burgers on the page
    function displayBurgers() {
        burgerContainer.innerHTML = '';
        burgers.forEach(burger => {
            const burgerCard = document.createElement('div');
            burgerCard.classList.add('burger-card');
            burgerCard.innerHTML = `
                <h3>${burger.name}</h3>
                <p>Price: $${burger.price.toFixed(2)}</p>
                <p>Stock: ${burger.stock}</p>
                <button class="view-details" data-id="${burger.id}">View Details</button>
            `;
            burgerContainer.appendChild(burgerCard);
        });
    }

    // Open the modal and display burger details
    function openModal(burgerId) {
        const burger = burgers.find(burger => burger.id === burgerId);
        document.getElementById('burger-name').textContent = burger.name;
        document.getElementById('burger-details').textContent = `Price: $${burger.price.toFixed(2)} | Stock: ${burger.stock}`;
        modal.style.display = 'block';
    }

    // Close the modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Add burger to cart
    addToCartButton.addEventListener('click', () => {
        const burgerId = parseInt(document.querySelector('.view-details').getAttribute('data-id'));
        const quantity = parseInt(document.getElementById('quantity').value);

        if (quantity <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        const order = {
            burger_id: burgerId,
            quantity: quantity
        };

        fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                modal.style.display = 'none';
                fetch('/api/burgers')
                    .then(response => response.json())
                    .then(data => {
                        burgers = data;
                        displayBurgers();
                    });
            });
    });

    // View burger details and open the modal
    burgerContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('view-details')) {
            const burgerId = parseInt(event.target.getAttribute('data-id'));
            openModal(burgerId);
        }
    });

    // Display cart items
    function displayCartItems() {
        cartItems.innerHTML = '';
        burgers.forEach(burger => {
            if (burger.cartQuantity > 0) {
                const cartItem = document.createElement('li');
                cartItem.textContent = `${burger.name} x ${burger.cartQuantity}`;
                cartItems.appendChild(cartItem);
            }
        });
    }

    // Checkout
    checkoutButton.addEventListener('click', () => {
        const cart = burgers.filter(burger => burger.cartQuantity > 0);
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        alert('Thank you for your order!');
        burgers.forEach(burger => burger.cartQuantity = 0);
        displayCartItems();
    });
});