
// Assume 'allProducts' is a global variable or accessible variable holding the full list of products fetched initially.
// This variable should be populated when the page loads, likely by fetching from Supabase.
// Example: let allProducts = []; // Initialize globally
// Example: async function loadAllProducts() { ... fetch from Supabase ... allProducts = data; renderProducts(allProducts); }

// Function to filter and display products based on search input
function searchProducts() {
    // Get the search query from the input field
    const searchInput = document.getElementById('default-search');
    const query = searchInput.value.toLowerCase().trim();

    // Get the container where products are displayed
    const productsContainer = document.getElementById('products-container'); // Assuming this is the ID of the container

    // Ensure allProducts is available. If not, maybe fetch or use hardcoded data as fallback.
    // For this function, we assume allProducts exists and contains the full list.
    // If using hardcoded data, you might need to combine butangProducts and pagkaonProducts here.
    // Example fallback if allProducts is not populated (less ideal for dynamic data):
    // const productsToSearch = window.allProducts || [...butangProducts.map((p, i) => transformHardcodedProduct(p, i, 'butang')), ...pagkaonProducts.map((p, i) => transformHardcodedProduct(p, i, 'pagkaon'))];
    // However, the best approach is to ensure allProducts is loaded from Supabase.

    // Use the globally available allProducts array
    const productsToSearch = window.allProducts || []; // Use window.allProducts if available, fallback to empty array

    // Filter products based on the query
    const filteredProducts = productsToSearch.filter(product => {
        // Check if product_name or description includes the query (case-insensitive)
        const nameMatch = product.product_name && product.product_name.toLowerCase().includes(query);
        const descriptionMatch = product.description && product.description.toLowerCase().includes(query);
        // You could add other fields like size or product_type if desired
        // const sizeMatch = product.size && product.size.toLowerCase().includes(query);

        return nameMatch || descriptionMatch; // || sizeMatch;
    });

    // Clear the current product display
    if (productsContainer) {
        productsContainer.innerHTML = '';

        // Render the filtered products
        if (filteredProducts.length > 0) {
            filteredProducts.forEach(product => {
                productsContainer.innerHTML += renderProductCard(product);
            });
        } else {
            // Display a message if no products are found
            productsContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full">No products found matching your search.</p>';
        }
    } else {
        console.error('Products container element not found.');
    }
}

// Add an event listener to the search input field
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('default-search');
    if (searchInput) {
        // Trigger search on input change (as the user types)
        searchInput.addEventListener('input', searchProducts);

        // Optional: Trigger search on pressing Enter key (if it's inside a form, prevent default submit)
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission if it's in a form
                searchProducts();
            }
        });
    } else {
        console.warn('Search input element with ID "default-search" not found.');
    }

    // IMPORTANT: Ensure that the 'allProducts' variable is populated with data
    // from Supabase (or other source) *before* the user starts searching.
    // This typically happens during the initial page load.
    // You will need to add the product loading logic elsewhere in this file,
    // which fetches products and stores them in `window.allProducts` and
    // calls `renderProducts(window.allProducts)` initially.
});


// NOTE: The `renderProducts` function (which iterates through an array and
// calls `renderProductCard` for each item) and the initial data loading logic
// (fetching from Supabase and populating `window.allProducts`) are assumed
// to exist elsewhere in this file or will be added.
// This search function relies on `window.allProducts` being available.








// Assume butangProducts and pagkaonProducts arrays (in the format provided in the prompt) are defined globally or accessible here.

// Helper function to transform hardcoded data format to match Supabase data format
// This function is still needed to ensure hardcoded data matches the expected structure
// for rendering and popup functions, even if the render function changes.
function transformHardcodedProduct(product, index) {
    // Generate a simple unique ID for fallback data
    const id = `${product.title.replace(/\s+/g, '-').toLowerCase()}-${index}`;
    // Parse price string (e.g., '₱1,500') into a number
    const price = parseFloat(product.price.replace('₱', '').replace(',', ''));

    return {
        id: id, // Add a dummy ID for consistency
        image_url: product.imgSrc, // Map imgSrc to image_url
        product_name: product.title, // Map title to product_name
        price: price, // Convert price string to number
        product_type: product.type, // Assuming type will be added when calling transform
        // Add other fields if needed by renderProducts or showProductPopup
        description: product.description,
        size: product.size
    };
}

// New function to render a single product card HTML string
// This function uses the structure and classes provided in the prompt.
// It expects product properties matching the Supabase/transformed format (image_url, product_name, price, size, description).
function renderProductCard(product) {
    // Ensure product.price is a number before calling toFixed
    const priceDisplay = typeof product.price === 'number' ? `₱${product.price.toFixed(2)}` : 'Price N/A';

    // Use product properties from the Supabase/transformed format
    return `
        <div class="card bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="product-details.html?id=${product.id}"> <!-- Added product ID to link -->
                <img src="${product.image_url}" alt="${product.product_name}" class="w-full h-48 object-cover">
            </a>
            <div class="p-4">
                <h2 class="text-lg font-semibold">${product.product_name}</h2>
                <small class="text-gray-500">${product.size || ''}</small> <!-- Handle potential missing size -->
                <p class="text-gray-600">${product.description || ''}</p> <!-- Handle potential missing description -->
                <div class="flex items-center justify-between mt-2">
                    <p class="text-yellow-500 font-bold">${priceDisplay}</p> <!-- Use formatted price -->
                    <div class="bg-[#CC2119] p-2 rounded-full w-10 h-10 flex justify-center items-center cart-btn">
                        <button onclick='showProductPopup(${encodeURIComponent(JSON.stringify(product))})' class="cursor-pointer"> <!-- Changed to showProductPopup and encoded JSON -->
                            <i class="fa-solid fa-cart-shopping" style="color: #F6CD13;"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}


document.addEventListener('DOMContentLoaded', async () => {
    let butangData = [];
    let pagkaonData = [];

    // Attempt to fetch 'Butang' products from Supabase
    const fetchedButang = await fetchProductsByType('Butang');

    if (fetchedButang && fetchedButang.length > 0) {
        console.log('Fetched Butang products from Supabase.');
        butangData = fetchedButang;
    } else {
        console.warn('Failed to fetch Butang products from Supabase or no data found. Using hardcoded data.');
        // Use hardcoded data as fallback, transforming the format
        // Ensure the hardcoded butangProducts array is accessible here
        if (typeof butangProducts !== 'undefined' && butangProducts.length > 0) {
             butangData = butangProducts.map((p, index) => transformHardcodedProduct({...p, type: 'Butang'}, index));
        } else {
             console.error('Hardcoded butangProducts array not found or is empty.');
        }
    }

    // Render 'Butang' products
    renderProducts(butangData, 'butang-products');

    // Attempt to fetch 'Pagkaon' products from Supabase
    const fetchedPagkaon = await fetchProductsByType('Pagkaon');

    if (fetchedPagkaon && fetchedPagkaon.length > 0) {
        console.log('Fetched Pagkaon products from Supabase.');
        pagkaonData = fetchedPagkaon;
    } else {
        console.warn('Failed to fetch Pagkaon products from Supabase or no data found. Using hardcoded data.');
        // Use hardcoded data as fallback, transforming the format
        // Ensure the hardcoded pagkaonProducts array is accessible here
         if (typeof pagkaonProducts !== 'undefined' && pagkaonProducts.length > 0) {
            pagkaonData = pagkaonProducts.map((p, index) => transformHardcodedProduct({...p, type: 'Pagkaon'}, index));
         } else {
            console.error('Hardcoded pagkaonProducts array not found or is empty.');
         }
    }

    // Render 'Pagkaon' products
    renderProducts(pagkaonData, 'pagkaon-products');
});

async function fetchProductsByType(type) {
    // Ensure supabase client is initialized and accessible
    if (typeof supabase === 'undefined') {
        console.error('Supabase client is not initialized.');
        return null; // Indicate failure
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_type', type);

    if (error) {
      console.error(`Error fetching ${type} products:`, error);
      return null; // Indicate failure
    }

    return data;
}

// Modified renderProducts function to use renderProductCard
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container element with ID "${containerId}" not found.`);
        return;
    }
    container.innerHTML = ''; // Clear existing content

    if (!products || products.length === 0) {
        container.innerHTML = '<p class="text-gray-600">No products available in this category.</p>';
        return;
    }

    // Generate HTML for all cards and set innerHTML once
    const cardsHtml = products.map(product => renderProductCard(product)).join('');
    container.innerHTML = cardsHtml;

    // The previous implementation appended elements one by one.
    // This new approach builds the HTML string first, which is often more performant.
    // If you need to attach event listeners directly to elements (instead of using onclick attributes),
    // you would need to create elements and append them, then add listeners.
    // However, the provided renderProductCard uses onclick, so setting innerHTML is fine.
}

// showProductPopup function remains the same as it's called by the onclick in renderProductCard
function showProductPopup(productJson) {
    const product = JSON.parse(decodeURIComponent(productJson));

    document.getElementById('popupProductImage').src = product.image_url;
    document.getElementById('popupProductName').textContent = product.product_name;
    // Ensure product.price is a number before calling toFixed
    const priceDisplay = typeof product.price === 'number' ? `₱${product.price.toFixed(2)}` : 'Price N/A';
    document.getElementById('popupProductPrice').textContent = priceDisplay;
    document.getElementById('quantity').textContent = '1'; // Reset quantity to 1

    // Store product info in a global variable for ordering
    window.currentProduct = product;
    document.getElementById('popupModal').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popupModal').style.display = 'none';
}

function increaseQuantity() {
    const quantityEl = document.getElementById('quantity');
    let qty = parseInt(quantityEl.textContent);
    qty++;
    quantityEl.textContent = qty;
}

function decreaseQuantity() {
    const quantityEl = document.getElementById('quantity');
    let qty = parseInt(quantityEl.textContent);
    if (qty > 1) {
      qty--;
      quantityEl.textContent = qty;
    }
}

async function confirmAddToOrder() {
    const qty = parseInt(document.getElementById('quantity').textContent);
    const product = window.currentProduct;

    if (!product) {
        console.error('No product selected for order.');
        alert('Please select a product first.');
        return;
    }

    // Ensure product.price is a number before calculation
    const price = typeof product.price === 'number' ? product.price : 0;
    const subtotal = qty * price;

    // --- Add to Cart Logic ---
    // Get existing cart items from sessionStorage
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

    // Check if the product is already in the cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        // If item exists, update quantity and subtotal
        cartItems[existingItemIndex].quantity += qty;
        cartItems[existingItemIndex].subtotal = cartItems[existingItemIndex].quantity * price; // Recalculate subtotal
    } else {
        // If item does not exist, add it to the cart
        cartItems.push({
            id: product.id,
            title: product.product_name, // Use product_name for title
            price: price, // Use the numeric price
            quantity: qty,
            subtotal: subtotal,
            image_url: product.image_url // Include image URL if needed in cart display
        });
    }

    // Save updated cart items back to sessionStorage
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update cart icon count (assuming an element with id 'cart-icons' exists)
    const cartIconCountElement = document.getElementById('cart-icons');
    if (cartIconCountElement) {
        const totalItemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartIconCountElement.textContent = totalItemsInCart;
    } else {
        console.warn('Element with id "cart-icons" not found. Cannot update cart count display.');
    }


    console.log('Cart updated:', cartItems);
    alert(`Added ${qty} x ${product.product_name} to your cart.`);
    closePopup();

    // OPTIONAL: Replace this with logic to actually insert into Supabase 'orders' or 'ordered' table
    // console.log('Added to order:', {
    //   product_id: product.id,
    //   name: product.product_name,
    //   quantity: qty,
    //   subtotal: subtotal,
    // });
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