// Assuming createClient is globally available (e.g., from supabase-js CDN or js/supabase.js)
const supabaseUrl = 'https://wonzwuuvesyyantdcali.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvbnp3dXV2ZXN5eWFudGRjYWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNzYyMzYsImV4cCI6MjA2MzY1MjIzNn0.Cz5pC32qhDPAsGPYiZskWKN8p9fi1Zj3f2jmlr-JRJU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Check if the user has an account and is one of the allowed types (seller, customer, rider)
function checkUserAccess() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const allowedUserTypes = ['seller', 'customer', 'rider'];

    if (!user || !allowedUserTypes.includes(user.usertype)) {
        window.location.href = 'login.html'; // Redirect
        return false; // Indicate access denied / redirect initiated
    }
    return true; // Indicate access granted
}

// Display user name in header
function displayUserName() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userNameElement = document.getElementById('sellerName'); // Note: ID is 'sellerName'

    if (userNameElement) {
        userNameElement.textContent = user ? `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'User' : 'User';
        userNameElement.classList.add('text-black', 'uppercase');
    }
}

// Toggle dropdown menu
function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu) {
        dropdownMenu.classList.toggle('hidden');
    }
}

// Fetches and displays store information if the user is a seller
async function displayStoreInfo() {
    const user = JSON.parse(sessionStorage.getItem('user'));

    // Ensure user exists and is a seller before proceeding
    if (!user || user.usertype !== 'seller') {
        console.log('User is not a seller or not logged in. Store info not displayed.');
        return;
    }

    try {
        const { data: storeData, error } = await supabase
            .from('stores')
            .select('store_name, profile_store')
            .eq('user_id', user.id)
            .single();

        if (error) {
            console.error('Supabase error fetching store info:', error.message);
            return;
        }

        // console.log('Fetched store data:', storeData); // Optional: for debugging

        const storeNameEl = document.getElementById('store_name');
        const profileImageEl = document.getElementById('storeProfileImage');

        if (storeNameEl) {
            storeNameEl.textContent = storeData?.store_name || 'Unnamed Store';
        } else {
            console.warn("Element with ID 'store_name' not found.");
        }

        if (profileImageEl) {
            profileImageEl.src = storeData?.profile_store || './assets/img/nearbuy_primary_logo.png';
        } else {
            console.warn("Element with ID 'storeProfileImage' not found.");
        }
    } catch (err) {
        console.error('Unexpected error in displayStoreInfo:', err);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // First, check user access. If it fails, it will redirect and return false.
    if (!checkUserAccess()) {
        return; // Stop further execution if user access check fails
    }

    // User is authenticated and authorized at this point
    displayUserName();
    displayStoreInfo(); // Call to display store info for sellers

    // Assume these functions are defined elsewhere in the project
    if (typeof fetchAndRenderProducts === 'function') {
        fetchAndRenderProducts();
    } else {
        console.warn('fetchAndRenderProducts function is not defined.');
    }

    if (typeof setupRealtimeSubscription === 'function') {
        setupRealtimeSubscription();
    } else {
        console.warn('setupRealtimeSubscription function is not defined.');
    }

    // Setup for closing dropdown when clicking outside
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (menuButton && dropdownMenu) {
        document.addEventListener('click', (event) => {
            // If the click is outside the button and outside the menu, hide the menu
            if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
    } else {
        if (!menuButton) console.warn("Dropdown menu button ('menuButton') not found.");
        if (!dropdownMenu) console.warn("Dropdown menu ('dropdownMenu') not found.");
    }
});




async function displayStoreProducts() {
  let user;
  try {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (e) {
    console.error("Error parsing user data from sessionStorage:", e);
    // Optionally, redirect to login or show an error message to the user
    return;
  }

  // Make sure the user is logged in and is a seller
  if (!user || user.usertype !== 'seller') {
    console.log("User is not a seller or not logged in, or user data is invalid.");
    return;
  }

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id);

    if (error) throw error;

    // Get containers
    const butangContainer = document.getElementById('butang-products');
    const pagkaonContainer = document.getElementById('pagkaon-products');

    // Ensure containers exist
    if (!butangContainer || !pagkaonContainer) {
      console.error("Product containers not found in the DOM.");
      return;
    }

    // Clear old content
    butangContainer.innerHTML = '';
    pagkaonContainer.innerHTML = '';

    let butangHTML = '';
    let pagkaonHTML = '';

    // Loop through all products and build HTML strings
    products.forEach(product => {
      // Basic sanitization for alt text and display text (more robust sanitization is recommended)
      const productName = product.product_name ? String(product.product_name).replace(/[<>"'&]/g, '') : 'Unnamed Product';
      const productDescription = product.description ? String(product.description).replace(/[<>"'&]/g, '') : 'No description';
      const imageUrl = product.image_url ? String(product.image_url) : 'placeholder.jpg'; // Provide a fallback image

      const productCard = `
        <div class="bg-white rounded-lg shadow-md p-4">
          <img src="${imageUrl}" alt="${productName}" class="w-full h-48 object-cover rounded-md mb-2">
          <h2 class="text-lg font-bold">${productName}</h2>
          <p class="text-sm text-gray-600 mb-2">${productDescription}</p>
          <p class="text-yellow-600 font-bold">₱${parseFloat(product.price).toFixed(2)}</p>
        </div>
      `;

      // Sort product into the right section
      if (product.product_type === 'butang') {
        butangHTML += productCard;
      } else if (product.product_type === 'pagkaon') {
        pagkaonHTML += productCard;
      }
    });

    // Set innerHTML once for each container
    if (butangHTML) {
      butangContainer.innerHTML = butangHTML;
    }
    if (pagkaonHTML) {
      pagkaonContainer.innerHTML = pagkaonHTML;
    }

  } catch (err) {
    console.error('Error fetching or displaying products:', err);
  }
}

// Auto-run after page loads
document.addEventListener('DOMContentLoaded', () => {
  // It's good practice to ensure checkUserAccess is defined and handles its own errors
  if (typeof checkUserAccess === 'function' && checkUserAccess()) {
    displayStoreProducts();
  } else if (typeof checkUserAccess !== 'function') {
    console.error('checkUserAccess function is not defined.');
  }
  // If checkUserAccess() returns false, it should ideally handle user feedback itself.
});

