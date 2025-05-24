// Global variables
let orders = [];
let quantity = 1;
let selectedProduct = null;
let cartCount = 0;

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cart-icons').textContent = cartCount;
});

// Product prices array
const productPrices = [
    { name: "Inabal Weaving", price: 1500.00 },
    { name: "Wooden Mortar", price: 800.00 },
    { name: "Luna Shell Necklace", price: 950.00 },
    { name: "Sol Necklace", price: 399.00 },
    { name: "Higaonon Hat", price: 600.00 },
    { name: "Salapid Abaca Rope", price: 100.00 },
    { name: "Fire Rope", price: 50.00 },
    { name: "Bolo", price: 2000.00 },
    { name: "Letchon De Bayug", price: 550.00 },
    { name: "Beef Halang Halang", price: 80.00 },
    { name: "Suka Pinakurat", price: 121.00 },
    { name: "Pater & Palapa", price: 35.00 },
    { name: "Lechon In Box", price: 850.00 },
    { name: "Palapa", price: 50.00 },
    { name: "Kuning", price: 30.00 },
    { name: "Piyapara Manok", price: 350.00 }
];

// Search products
function searchProducts(event) {
    event.preventDefault();
    const searchInput = document.getElementById('default-search').value.toLowerCase();
    const allProductCards = document.querySelectorAll('.card');
    
    allProductCards.forEach(card => {
        const productName = card.querySelector('h2').textContent.toLowerCase();
        const productDescription = card.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchInput) || productDescription.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add event listener to search form
document.querySelector('form').addEventListener('submit', searchProducts);

// Initialize category sections
function initializeCategorySections() {
    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach((section, index) => {
        section.style.display = index === 0 ? 'block' : 'none';
    });
}

// Handle category click
function handleClick(category) {
    console.log('Category clicked:', category);
    const categorySections = document.querySelectorAll('.category-section');
    const carousel = document.querySelector('.container.mx-auto.px-4'); // Select the carousel container
    
    // Hide all category sections first
    categorySections.forEach(section => {
        section.style.display = 'none';
    });
    
    if (category === 'cart') {
        // Hide the carousel when showing cart
        if (carousel) {
            carousel.style.display = 'none';
        }
        
        // Show the cart section
        const cartSection = document.getElementById('cart-container');
        if (cartSection) {
            cartSection.style.display = 'block';
        }
    } else {
        // Show the carousel for other categories
        if (carousel) {
            carousel.style.display = 'block';
        }
        
        // Show the selected category section
        const selectedSection = Array.from(categorySections).find(section => {
            const heading = section.querySelector('h1');
            return heading && heading.textContent.includes(`Local ${category}`);
        });
        
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }
    }
}


// Open popup
function openPopup(productName, productPrice) {
    selectedProduct = { name: productName, price: productPrice };
    quantity = 1;
    
    // Find the product card and get its image
    const productCards = document.querySelectorAll('.card');
    let productImage = '';
    
    for (const card of productCards) {
        const title = card.querySelector('h2');
        if (title && title.textContent === productName) {
            const img = card.querySelector('img');
            if (img) {
                productImage = img.src;
                break;
            }
        }
    }
    
    document.getElementById('popupProductName').textContent = productName;
    document.getElementById('popupProductPrice').textContent = `₱${productPrice.toFixed(2)}`;
    document.getElementById('quantity').textContent = quantity;
    document.getElementById('popupProductImage').src = productImage;
    document.getElementById('popupModal').style.display = 'flex';
}

// Close popup
function closePopup() {
    document.getElementById('popupModal').style.display = 'none';
}

// Increase quantity
function increaseQuantity() {
    quantity++;
    document.getElementById('quantity').textContent = quantity;
}

// Decrease quantity
function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantity').textContent = quantity;
    }
}

// Confirm add to order
function confirmAddToOrder() {
    for (let i = 0; i < quantity; i++) {
        orders.push(selectedProduct);
    }
    cartCount += quantity;
    document.getElementById('cart-icons').textContent = cartCount;
    alert(`${selectedProduct.name} (x${quantity}) added to Orders`);
    renderOrders();
    closePopup();
}

// Render orders
function renderOrders() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    const orderSummary = {};

    // Group orders by product name
    orders.forEach(order => {
        if (orderSummary[order.name]) {
            orderSummary[order.name].quantity++;
            orderSummary[order.name].total = orderSummary[order.name].price * orderSummary[order.name].quantity;
        } else {
            orderSummary[order.name] = {
                price: order.price,
                quantity: 1,
                total: order.price
            };
        }
    });

    let grandTotal = 0;

    // Create table rows for each product
    Object.keys(orderSummary).forEach(productName => {
        const { price, quantity, total } = orderSummary[productName];
        const row = document.createElement('tr');
        row.className = 'bg-white border-b dark:bg-gray-800 dark:border-gray-700';
        
        row.innerHTML = `
            <td class="px-6 py-4 text-white">${productName}</td>
            <td class="px-6 py-4 text-white">${quantity}</td>
            <td class="px-6 py-4 text-white">₱${price.toFixed(2)}</td>
            <td class="px-6 py-4 text-white">₱${total.toFixed(2)}</td>
        `;
        
        cartItems.appendChild(row);
        grandTotal += total;
    });

    // Update total in cart
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        cartTotal.textContent = `₱${grandTotal.toFixed(2)}`;
    }

    // Show/hide empty cart alert
    const alertElement = document.getElementById('alert-additional-content-2');
    if (alertElement) {
        alertElement.style.display = orders.length === 0 ? 'block' : 'none';
    }
}


// Decrease order quantity
function decreaseOrderQuantity(productName) {
    const orderIndex = orders.findIndex(order => order.name === productName);
    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1);
        cartCount--;
        document.getElementById('cart-icons').textContent = cartCount;
        renderOrders();
    }
}

// Increase order quantity
function increaseOrderQuantity(productName) {
    const product = productPrices.find(item => item.name === productName);
    if (product) {
        orders.push(product);
        cartCount++;
        document.getElementById('cart-icons').textContent = cartCount;
        renderOrders();
    }
}

// Remove order
function removeOrder(productName) {
    const removedCount = orders.filter(order => order.name === productName).length;
    orders = orders.filter(order => order.name !== productName);
    cartCount -= removedCount;
    document.getElementById('cart-icons').textContent = cartCount;
    renderOrders();
}

// Add to order
function addToOrder(productName) {
    const product = productPrices.find(item => item.name === productName);
    if (product) {
        openPopup(productName, product.price);
    } else {
        alert("Product not found!");
    }
}

// Update cart count
function updateCartCount(amount) {
    cartCount += amount;
    const cartIcon = document.getElementById('cart-icons');
    if (cartIcon) {
        cartIcon.textContent = cartCount;
    }
}