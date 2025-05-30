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

    // Function to handle the checkout process
    async function handleCheckout() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

        if (!user || !user.id) {
            alert('You must be logged in to checkout.');
            window.location.href = 'login.html'; // Redirect to login if not logged in
            return;
        }

        if (cartItems.length === 0) {
            // Display the alert message if cart is empty (using the existing HTML)
            const emptyCartAlert = document.getElementById('alert-additional-content-2');
            if (emptyCartAlert) {
                emptyCartAlert.style.display = 'block';
                 // Scroll to the alert message
                emptyCartAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            };
            return;
        }

        // Calculate total amount
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        try {
            // 1. Insert into orders table
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([
                    { user_id: user.id, total_amount: totalAmount, status: 'Pending' }
                ])
                .select(); // Select the inserted data to get the order ID

            if (orderError) {
                console.error('Error creating order:', orderError);
                alert('Error creating order. Please try again.');
                return;
            }

            const newOrderId = orderData[0].id;

            // 2. Insert into ordered table for each cart item
            const orderedItemsToInsert = cartItems.map(item => ({
                orders_id: newOrderId,
                product_id: item.id, 
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            }));

            const { error: orderedError } = await supabase
                .from('ordered')
                .insert(orderedItemsToInsert);

            if (orderedError) {
                console.error('Error creating ordered items:', orderedError);
                 //  delete the created order if ordered items fail
                alert('Error saving order details. Please contact support.');
                return;
            }

            // 3. Clear cart from sessionStorage
            sessionStorage.removeItem('cartItems');

            // 4. Redirect to order confirmation/history page
            alert('Order placed successfully!');
            // window.location.href = 'order_history.html'; // Redirect to an order history page (example)
             window.location.reload(); // For now, just reload to show empty cart

        } catch (error) {
            console.error('An unexpected error occurred during checkout:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    }

    // Add event listener to the checkout button
    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    } else {
         console.error('Checkout button not found!');
    }

    // Add event listener to the voucher button (placeholder for now)
    const voucherButton = document.getElementById('voucher-btn');
    if (voucherButton) {
        voucherButton.addEventListener('click', () => {
            // TODO: Implement voucher modal or logic
            alert('Voucher functionality not yet implemented.');
        });
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
            customerNameElement.textContent = 'Guest'; // default name if the user not logged in
            console.warn('User name not found in sessionStorage.', user);
        }

        renderCart();
    });
