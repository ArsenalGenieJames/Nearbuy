// Check if the user has an account and is one of the allowed types (seller, customer, rider)
function checkUserAccess() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const allowedUserTypes = ['seller', 'customer', 'rider'];

    if (!user || !allowedUserTypes.includes(user.usertype)) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
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

    // Hide the checkout modal whenever a category is clicked
    // Assuming checkoutModal is a globally accessible DOM element variable
    if (typeof checkoutModal !== 'undefined' && checkoutModal) {
        checkoutModal.style.display = 'none';
    }

    // Assuming cartSection is a globally accessible DOM element variable
    const cartSectionElement = typeof cartSection !== 'undefined' ? cartSection : null;

    if (category === 'cart') {
        // Hide the carousel when showing cart
        if (carousel) {
            carousel.style.display = 'none';
        }

        // Show the cart section
        if (cartSectionElement) {
            cartSectionElement.style.display = 'block';
        }
    } else {
        // Show the carousel for other categories
        if (carousel) {
            carousel.style.display = 'block';
        }

        // Find and show the selected category section
        // Ensure it's not the cart section itself, even if it has the class
        // Use strict equality check for the heading text content to ensure only the exact category is matched
        const selectedSection = Array.from(categorySections).find(section => {
            const heading = section.querySelector('h1');
            // Check if the section has an h1 and its text is exactly "Local [CategoryName]"
            // Also ensure it's not the cart section itself by ID
            return heading && heading.textContent.trim() === `Local ${category}` && section.id !== 'cart-container';
        });

        if (selectedSection) {
            selectedSection.style.display = 'block';
        } else {
            // Optional: Handle case where no matching category section is found
            console.warn(`No section found for category: ${category}`);
        }
    }
}



















// Variable to hold the Supabase subscription
let productsSubscription = null;

async function fetchAndRenderProducts() {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        users:users!products_seller_id_fkey(usertype)
      `)
      // Assuming you want to display all products added by users with usertype 'seller'
      // If you need to filter by a specific seller or other criteria, adjust this query.
      .eq('users.usertype', 'seller');

    if (error) {
      console.error('Error fetching products:', error);
      // Optionally show an error message to the user
      return;
    }

    // Before rendering, generate public URLs for images using Supabase Storage
    // This is a more reliable way to get image URLs compared to string manipulation
    const productsWithPublicUrls = products.map(product => {
        let publicImageUrl = '/assets/img/placeholder.png'; // Default placeholder

        if (product.image_url) {
            // Assuming your product images are stored in a bucket named 'product-images'
            // and the image_url column stores the path within that bucket (e.g., 'public/image.jpg')
            const { data } = supabase.storage.from('product-images').getPublicUrl(product.image_url);
            if (data && data.publicUrl) {
                publicImageUrl = data.publicUrl;
            } else {
                console.warn(`Could not get public URL for image path: ${product.image_url}`);
            }
        }
        return {
            ...product,
            publicImageUrl: publicImageUrl // Add the public URL to the product object
        };
    });


    renderProductsByType(productsWithPublicUrls, 'butang');
    renderProductsByType(productsWithPublicUrls, 'pagkaon');
  }

  function renderProductsByType(products, type) {
    const container = document.getElementById(`${type}-products`);
    // Ensure container exists before trying to update its content
    if (!container) {
        console.error(`Container element with id '${type}-products' not found.`);
        return;
    }

    const filtered = products.filter(p => p.product_type === type);

    container.innerHTML = filtered.map(product => {

        // Use the pre-generated publicImageUrl
        const imageUrl = product.publicImageUrl;

        return `
          <div class="card bg-white shadow-lg rounded-lg overflow-hidden">
            <a href="product-details.html-${product.id}"> <!-- Added unique ID to link -->
              <img src="${imageUrl}" alt="${product.product_name}" class="w-full h-48 object-cover">
            </a>
            <div class="p-4">
              <h2 class="text-lg font-semibold">${product.product_name}</h2>
              <small class="text-gray-500">${product.size || ''}</small>
              <p class="text-gray-600">${product.description}</p>
              <div class="flex items-center justify-between mt-2">
                <p class="text-yellow-500 font-bold">₱${product.price}</p>
                <div class="bg-[#CC2119] p-2 rounded-full w-10 h-10 flex justify-center items-center cart-btn">
                  <!-- Pass product ID or relevant info to addToOrder -->
                  <button onclick="addToOrder('${product.id}')" class="cursor-pointer">
                    <i class="fa-solid fa-cart-shopping" style="color: #F6CD13;"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
    }).join('');
  }

  // Function to set up Supabase Realtime subscription
  function setupRealtimeSubscription() {
      // If a subscription already exists, remove it first to avoid duplicates
      if (productsSubscription) {
          // Supabase v2+ uses removeChannel
          if (typeof productsSubscription.removeChannel === 'function') {
              supabase.removeChannel(productsSubscription);
          } else { // Supabase v1 compatibility
              supabase.removeSubscription(productsSubscription);
          }
      }

      // Subscribe to changes in the 'products' table
      // Listen for INSERT, UPDATE, and DELETE to keep the list fully in sync
      productsSubscription = supabase
          .from('products')
          .on('*', payload => { // Listen for all changes (INSERT, UPDATE, DELETE)
              console.log('Change in products table:', payload);
              // When a change occurs, re-fetch and re-render the list
              fetchAndRenderProducts();
          })
          .subscribe();

      console.log('Supabase Realtime subscription for products set up.');
  }

  // Fetch and render products initially when the page loads
  // Also set up the realtime subscription
  document.addEventListener('DOMContentLoaded', () => {
      if (!checkUserAccess()) return; // Ensure user is allowed before fetching

      fetchAndRenderProducts();
      setupRealtimeSubscription();
  });

  

  async function fetchAndRenderProducts() {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        users:users!products_seller_id_fkey(usertype)
      `)
      .eq('users.usertype', 'seller');
  
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
  
    // ✅ Async map to get public URLs
    const productsWithPublicUrls = await Promise.all(products.map(async (product) => {
      let publicImageUrl = '/assets/img/placeholder.png';
  
      if (product.image_url) {
        const { data, error } = supabase
          .storage
          .from('product-images') // make sure this is your bucket name
          .getPublicUrl(product.image_url);
  
        if (data?.publicUrl) {
          publicImageUrl = data.publicUrl;
        } else {
          console.warn(`Could not get public URL for image path: ${product.image_url}`, error);
        }
      }
  
      return { ...product, publicImageUrl };
    }));
  
    renderProductsByType(productsWithPublicUrls, 'butang');
    renderProductsByType(productsWithPublicUrls, 'pagkaon');
  }
  