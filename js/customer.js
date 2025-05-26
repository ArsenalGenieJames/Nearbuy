// First, define the correct access check function
function checkCustomerAccess() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.usertype !== 'customer') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Product Data (Butang)
const butangProducts = [
    {
        imgSrc: './assets/butang/Inabal Weaving',
        title: 'Inabal Weaving',
        size: 'Approx. 1m x 2m',
        description: 'Traditional handwoven fabric made using backstrap looms.',
        price: '₱1,500'
    },
    {
        imgSrc: './assets/butang/Bangkaso.webp',
        title: 'Bangkaso (Wooden Mortar)',
        size: 'Approximately 13 cm in height',
        description: 'Traditional wooden mortar for pounding rice and corn.',
        price: '₱800'
    },
    {
        imgSrc: './assets/butang/Bangkaso.webp',
        title: 'Luna Shell Necklace',
        size: 'Hypoallergenic Stainless Steel shell',
        description: 'A necklace featuring a shell pendant, embodying natural elegance.',
        price: '₱950.00'
    },
    {
        imgSrc: './assets/butang/Bangkaso.webp',
        title: 'Sol (Sun) de Luna (Moon) Necklace',
        size: 'Sterling Gold',
        description: 'A necklace featuring a shell pendant, embodying natural elegance.',
        price: '₱399.00'
    },
    {
        imgSrc: './assets/butang/Bangkaso.webp',
        title: 'Panika (Higaonon Hat)',
        size: 'Approximately 13 cm in height',
        description: 'Traditional wooden mortar for pounding rice and corn.',
        price: '₱600'
    },
    {
        imgSrc: './assets/butang/Bangkaso.webp',
        title: 'Salapid (Abaca Rope/Twine)',
        size: 'Per meter length of rope',
        description: 'Traditional hand-braided rope for farming and crafts.',
        price: '₱100'
    },
    {
        imgSrc: './assets/butang/Bangkaso.webp',
        title: 'Lubid nga Kalayo (Fire Rope/Kindling)',
        size: 'Rope made from dried bark, grass, or coconut husk',
        description: 'Traditional wooden mortar for pounding rice and corn.',
        price: '₱50'
    },
    {
        imgSrc: './assets/butang/Bangkaso.webp',
        title: 'Bolo',
        size: 'Handcrafted blade with bone/wood handle',
        description: 'Handcrafted blade used in farming, hunting, and ceremonial rites. Made by Lumad blacksmiths, with wooden or bone handles.',
        price: '₱2,000'
    }
];

// Product Data (Pagkaon)
const pagkaonProducts = [
    {
        imgSrc: './assets/pagkaon/letchons.jpg',
        title: 'Letchon De Bayug',
        size: 'Per Kilo',
        description: 'Iligan\'s famous roasted pig known for its tender meat, crispy skin, and unique lemongrass-infused marinade.',
        price: '₱550.00'
    },
    {
        imgSrc: './assets/pagkaon/beef.jpg',
        title: 'Beef Halang Halang',
        size: '',
        description: 'Spicy Filipino beef stew cooked with coconut milk, chili, and aromatic spices rich, creamy, and boldly flavored.',
        price: '₱80.00'
    },
    {
        imgSrc: './assets/pagkaon/sukapinakurat.jpg',
        title: 'Suka Pinakurat',
        size: '750mL',
        description: 'Spiced vinegar perfect for grilled dishes.',
        price: '₱121.00'
    },
    {
        imgSrc: './assets/pagkaon/pater.jpg',
        title: 'Pater & Palapa',
        size: '',
        description: 'Rice topped with seasoned meat, wrapped in banana leaf, often served with Palapa, a spicy Maranao condiment made from chili, ginger, and coconut.',
        price: '₱35.00'
    },
    {
        imgSrc: './assets/pagkaon/letchobox.jpg',
        title: 'Lechon In Box',
        size: '',
        description: 'A convenient serving of crispy roasted pork packed neatly in a box—perfect for takeout or small gatherings.',
        price: '₱850.00'
    },
    {
        imgSrc: './assets/pagkaon/Palapa.jfif',
        title: 'Palapa',
        size: '',
        description: 'A sweet and spicy Maranao condiment made from chili, ginger, shallots, and toasted coconut, often used to flavor rice and native dishes.',
        price: '₱50.00'
    },
    {
        imgSrc: './assets/pagkaon/kuning.jpeg',
        title: 'Kuning',
        size: '',
        description: 'Yellow rice cooked with turmeric and coconut milk, served during feasts and weddings.',
        price: '₱30.00'
    },
    {
        imgSrc: './assets/pagkaon/Palapa.jfif',
        title: 'Piyapara Manok',
        size: '',
        description: 'Maranao chicken dish simmered in coconut milk with turmeric, palapa, and spices for a rich, creamy flavor.',
        price: '₱350.00'
    }
];

// Function to render a single product card
function renderProductCard(product) {
    return `
        <div class="card bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="product-details.html">
                <img src="${product.imgSrc}" alt="${product.title}" class="w-full h-48 object-cover">
            </a>
            <div class="p-4">
                <h2 class="text-lg font-semibold">${product.title}</h2>
                <small class="text-gray-500">${product.size}</small>
                <p class="text-gray-600">${product.description}</p>
                <div class="flex items-center justify-between mt-2">
                    <p class="text-yellow-500 font-bold">${product.price}</p>
                    <div class="bg-[#CC2119] p-2 rounded-full w-10 h-10 flex justify-center items-center cart-btn">
                        <button onclick='openProductPopup(${JSON.stringify(product)})' class="cursor-pointer">
                            <i class="fa-solid fa-cart-shopping" style="color: #F6CD13;"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to render all products
function renderProducts() {
    const butangContainer = document.getElementById('butang-products');
    const pagkaonContainer = document.getElementById('pagkaon-products');

    if (butangContainer) {
        butangContainer.innerHTML = butangProducts.map(renderProductCard).join('');
    }

    if (pagkaonContainer) {
        pagkaonContainer.innerHTML = pagkaonProducts.map(renderProductCard).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!checkCustomerAccess()) return;

    // Set customer name
    const user = JSON.parse(sessionStorage.getItem('user'));
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

// Add error handling for the session storage
try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('User data:', user); // For debugging
} catch (error) {
    console.error('Error parsing user data:', error);
}

// Function to open the product popup modal
function openProductPopup(product) {
    const modal = document.getElementById('popupModal');
    const productImage = document.getElementById('popupProductImage');
    const productName = document.getElementById('popupProductName');
    const productPrice = document.getElementById('popupProductPrice');
    const quantitySpan = document.getElementById('quantity');

    if (modal && productImage && productName && productPrice && quantitySpan) {
        // Store current product details in the modal for later use in confirmAddToOrder
        modal.dataset.productTitle = product.title;
        modal.dataset.productPrice = product.price;
        modal.dataset.productImgSrc = product.imgSrc; // Storing image src too if needed elsewhere

        productImage.src = product.imgSrc;
        productName.textContent = product.title;
        productPrice.textContent = product.price;
        quantitySpan.textContent = '1'; // Default quantity is 1

        modal.style.display = 'flex'; // Show the modal
    }
}

// Function to close the product popup modal
function closePopup() {
    const modal = document.getElementById('popupModal');
    if (modal) {
        modal.style.display = 'none'; // Hide the modal
    }
}

// Function to increase the quantity in the modal
function increaseQuantity() {
    const quantitySpan = document.getElementById('quantity');
    if (quantitySpan) {
        let quantity = parseInt(quantitySpan.textContent);
        quantitySpan.textContent = quantity + 1;
    }
}

// Function to decrease the quantity in the modal
function decreaseQuantity() {
    const quantitySpan = document.getElementById('quantity');
    if (quantitySpan) {
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 1) {
            quantitySpan.textContent = quantity - 1;
        }
    }
}

// Function to confirm adding the product with the selected quantity to the order
// This replaces the original addToOrder logic that was directly on the button
function confirmAddToOrder() {
    const modal = document.getElementById('popupModal');
    const quantitySpan = document.getElementById('quantity');

    if (modal && quantitySpan) {
        const productTitle = modal.dataset.productTitle;
        const productPriceText = modal.dataset.productPrice; // e.g., '₱1,500'
        const productImgSrc = modal.dataset.productImgSrc; // Get image source
        const quantity = parseInt(quantitySpan.textContent);

        // Parse the price string (remove currency symbol and comma if present)
        const price = parseFloat(productPriceText.replace(/[₱,]/g, ''));

        // Get existing cart items from sessionStorage
        let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

        // Check if the product is already in the cart
        const existingItemIndex = cartItems.findIndex(item => item.title === productTitle);

        if (existingItemIndex > -1) {
            // If exists, update quantity
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            // If not exists, add as new item
            cartItems.push({
                title: productTitle,
                price: price,
                imgSrc: productImgSrc,
                quantity: quantity
            });
        }

        // Save updated cart items to sessionStorage
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Close the modal
        closePopup();

        // Redirect to cart.html
        window.location.href = 'cart.html';
    }
}



