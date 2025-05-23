        // Add click event to the "Select Address" text
        document.querySelector('.select-address').addEventListener('click', function() {
            document.getElementById('address-list-modal').classList.remove('hidden');
        });

        function closeAddressModal() {
            document.getElementById('address-list-modal').classList.add('hidden');
        }

        // Close modal when clicking outside
        document.getElementById('address-list-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeAddressModal();
            }
        });

        // Prevent closing when clicking inside modal
        document.querySelector('#address-list-modal > div').addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Add click event to the "Select Voucher" text
        document.querySelector('.text-right').addEventListener('click', function() {
            document.getElementById('voucher-list-modal').classList.remove('hidden');
        });

        function closeVoucherModal() {
            document.getElementById('voucher-list-modal').classList.add('hidden');
        }

        // Close modal when clicking outside
        document.getElementById('voucher-list-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeVoucherModal();
            }
        });

        // Prevent closing when clicking inside modal
        document.querySelector('#voucher-list-modal > div').addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Check if cart is empty before checkout
        document.getElementById('checkout-btn').addEventListener('click', function() {
            const cartItems = document.querySelectorAll('#cart-items tr');
            if (cartItems.length === 0) {
                // Show alert and ensure it's visible
                const alertElement = document.getElementById('alert-additional-content-2');
                alertElement.style.display = 'block';
                alertElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                document.getElementById('cart-container').style.display = 'none';
                document.getElementById('checkout-modal').style.display = 'block';
            }
        });

// Load cart data from localStorage
let orders = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count in header
    document.getElementById('cart-icons').textContent = cartCount;
    
    // Render cart items
    renderCart();
});

// Render cart items
function renderCart() {
    const cartTable = document.getElementById('cartTable');
    if (!cartTable) return;
    
    const tbody = cartTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    const orderSummary = {};
    let total = 0;

    // Group items by name and calculate quantities
    orders.forEach(order => {
        if (orderSummary[order.name]) {
            orderSummary[order.name].quantity++;
        } else {
            orderSummary[order.name] = { price: order.price, quantity: 1 };
        }
    });

    // Create table rows for each item
    Object.keys(orderSummary).forEach(productName => {
        const { price, quantity } = orderSummary[productName];
        const row = document.createElement('tr');
        const itemTotal = price * quantity;
        total += itemTotal;

        row.innerHTML = `
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="w-16 h-16 mr-4">
                        <img src="${getProductImage(productName)}" alt="${productName}" class="w-full h-full object-cover rounded-lg">
                    </div>
                    <div>
                        <div class="font-semibold">${productName}</div>
                        <div class="text-sm text-gray-500">₱${price.toFixed(2)} each</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                    <button onclick="decreaseQuantity('${productName}')" class="bg-gray-200 px-2 py-1 rounded-lg">-</button>
                    <span>${quantity}</span>
                    <button onclick="increaseQuantity('${productName}')" class="bg-gray-200 px-2 py-1 rounded-lg">+</button>
                </div>
            </td>
            <td class="px-6 py-4">₱${itemTotal.toFixed(2)}</td>
            <td class="px-6 py-4">
                <button onclick="removeItem('${productName}')" class="text-red-500 hover:underline">Remove</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Update total
    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
        totalElement.textContent = `₱${total.toFixed(2)}`;
    }
}

// Get product image
function getProductImage(productName) {
    // This is a placeholder - you should implement proper image handling
    return './assets/img/products.jpg';
}

// Decrease item quantity
function decreaseQuantity(productName) {
    const orderIndex = orders.findIndex(order => order.name === productName);
    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1);
        cartCount--;
        updateStorage();
        renderCart();
    }
}

// Increase item quantity
function increaseQuantity(productName) {
    const product = orders.find(order => order.name === productName);
    if (product) {
        orders.push(product);
        cartCount++;
        updateStorage();
        renderCart();
    }
}

// Remove item
function removeItem(productName) {
    const removedCount = orders.filter(order => order.name === productName).length;
    orders = orders.filter(order => order.name !== productName);
    cartCount -= removedCount;
    updateStorage();
    renderCart();
}

// Update localStorage
function updateStorage() {
    localStorage.setItem('cart', JSON.stringify(orders));
    localStorage.setItem('cartCount', cartCount);
    document.getElementById('cart-icons').textContent = cartCount;
}

// Clear cart
function clearCart() {
    orders = [];
    cartCount = 0;
    updateStorage();
    renderCart();
}

// Checkout
function checkout() {
    if (orders.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Here you would typically redirect to a checkout page or show a checkout modal
    alert('Proceeding to checkout...');
    // clearCart(); // Uncomment if you want to clear the cart after checkout
}