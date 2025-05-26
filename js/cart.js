let cartCount = 0; // Initialize cart count

document.addEventListener('DOMContentLoaded', () => {
    if (!checkCustomerAccess()) return;

    // Set customer name
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('User object from sessionStorage:', user); // Log the user object
    const customerNameElement = document.getElementById('customerName');
    if (customerNameElement && user) {
        customerNameElement.textContent = `${user.firstname} ${user.lastname}`;
    }

    // Setup dropdown menu
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    menuButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    // Render products on page load
    renderProducts();
});
    
    
    
    // Add this at the beginning of cart.js
    function checkCustomerAccess() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user || user.usertype !== 'customer') {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Define renderCart function
    function renderCart() {
        const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        const cartItemsTableBody = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const cartIconCountElement = document.getElementById('cart-icons');

        // Ensure the necessary elements exist before proceeding
        if (!cartItemsTableBody || !cartTotalElement || !cartIconCountElement) {
            console.error('Cart display elements not found!');
            return; // Stop if essential elements are missing
        }

        // Clear existing table rows
        cartItemsTableBody.innerHTML = '';

        let total = 0;
        let itemCount = 0;

        if (cartItems.length === 0) {
            // Display a message if the cart is empty
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                    Your cart is empty.
                </td>
            `;
            cartItemsTableBody.appendChild(emptyRow);
        } else {
            cartItems.forEach(item => {
                const row = document.createElement('tr');
                row.classList.add('bg-white', 'border-b', 'dark:bg-gray-800', 'dark:border-gray-700'); // Add some basic styling classes

                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                itemCount += item.quantity;

                row.innerHTML = `
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        ${item.title}
                    </th>
                    <td class="px-6 py-4">
                        ${item.quantity}
                    </td>
                    <td class="px-6 py-4">
                        ₱${item.price.toFixed(2)}
                    </td>
                    <td class="px-6 py-4">
                        ₱${itemTotal.toFixed(2)}
                    </td>
                `;

                cartItemsTableBody.appendChild(row);
            });
        }

        // Update total price
        cartTotalElement.textContent = `₱${total.toFixed(2)}`;

        // Update cart icon count in header
        cartIconCountElement.textContent = itemCount;
    }

    // Modify your DOMContentLoaded event listener
    document.addEventListener('DOMContentLoaded', function() {
        // Check access first
        if (!checkCustomerAccess()) return;

        // Set customer name
        const user = JSON.parse(sessionStorage.getItem('user'));
        console.log('User object from sessionStorage:', user); // Log the user object
        const customerNameElement = document.getElementById('customerName');
        if (customerNameElement && user && user.firstname && user.lastname) {
            customerNameElement.textContent = `${user.firstname} ${user.lastname}`;
        } else if (customerNameElement) {
            customerNameElement.textContent = 'Guest'; // Set a default if name is not available
            console.warn('User name not found in sessionStorage.', user);
        }

        // Render cart items on page load
        renderCart();
    });
