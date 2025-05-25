// Add this at the beginning of seller.js
function checkSellerAccess() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.usertype !== 'seller') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Call checkSellerAccess when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (!checkSellerAccess()) return;
    
    // Set seller name
    const user = JSON.parse(sessionStorage.getItem('user'));
    const sellerNameElement = document.getElementById('sellerName');
    sellerNameElement.textContent = `${user.firstname} ${user.lastname}`;
    
    // Set Add Products as default active section
    handleClick('AddProducts');
});

//drop down menu script 
document.getElementById('menuButton').addEventListener('click', function() {
    document.getElementById('dropdownMenu').classList.toggle('hidden');
});

// close the dropdown menu when clicking outside of it
function handleClick(section) {
    // Hide all sections first
    document.querySelectorAll('.category-section').forEach(el => el.classList.add('hidden'));
    
    // Show the clicked section
    let sectionElement;
    switch(section) {
        case 'AddProducts':
            sectionElement = 'addProductsForm';
            break;
        case 'ViewProducts':
            sectionElement = 'viewProductsSection';
            loadProducts(); // Load products when viewing products section
            break;
        case 'ViewOrders':
            sectionElement = 'viewOrdersSection';
            break;
        case 'ViewCustomers':
            sectionElement = 'viewCustomersSection';
            break;
        case 'ViewFeedback':
            sectionElement = 'viewFeedbackSection';
            break;
        case 'ViewVouchers':
            sectionElement = 'viewVouchersSection';
            break;
    }
    
    if (sectionElement) {
        document.getElementById(sectionElement).classList.remove('hidden');
    }
}

// Add Product Form Submission Script
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addProductForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // Get current user from session
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (!user) throw new Error('User not logged in');

            // Grab input values
            const productName = form.querySelector('input[name="productName"]').value.trim();
            const size = form.querySelector('input[name="size"]').value.trim();
            const price = parseFloat(form.querySelector('input[name="price"]').value);
            const quantity = parseInt(form.querySelector('input[name="quantity"]').value, 10);
            const weight = parseFloat(form.querySelector('input[name="weight"]').value);
            const productType = form.querySelector('select[name="productType"]').value;
            const description = form.querySelector('textarea[name="description"]').value.trim();
            const imageFile = document.getElementById('file_input').files[0];

            if (!imageFile) {
                throw new Error('Please select an image');
            }

            // Create image path
            const timestamp = Date.now();
            const targetFolder = productType.toLowerCase() === 'butang' ? 'butang' : 'pagkaon';
            const imageName = `${timestamp}-${imageFile.name}`;
            const imageUrl = `./assets/items/${targetFolder}/${imageName}`;
            const targetPath = `./assets/items/${targetFolder}/${imageName}`;

            // Upload image to backend
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('path', targetPath);

            const uploadRes = await fetch('php/upload.php', {
                method: 'POST',
                body: formData
            });

            const uploadResult = await uploadRes.json();
            
            if (!uploadResult.success) {
                throw new Error(uploadResult.message || 'Image upload failed');
            }

            // Save product in Supabase
            const { error: dbError } = await supabase.from('products').insert([
                {
                    product_name: productName,
                    product_type: productType,
                    description,
                    price,
                    size,
                    quantity,
                    weight,
                    image_url: imageUrl,
                    seller_id: user.id
                }
            ]);

            if (dbError) throw dbError;

            showSuccessModal('Product added successfully!');
            form.reset();
            document.getElementById('productImage').src = './assets/img/nearbuy_primary_logo.png';

        } catch (error) {
            console.error('❌ Error:', error);
            alert(`Failed to add product: ${error.message}`);
        }
    });
});

// Pagination variables
let currentPage = 1;
const productsPerPage = 10;
let totalProducts = 0;

// Search functionality
async function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!searchTerm) {
        loadProducts(currentPage); // Reset to normal view if search is empty
        return;
    }

    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) throw new Error('Not logged in');

        // Get all products for the seller
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('seller_id', user.id);

        if (error) throw error;

        // Filter products based on search term
        const filteredProducts = products.filter(product => 
            product.product_name?.toLowerCase().includes(searchTerm) ||
            product.product_type?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm)
        );

        // Update total products count for pagination
        totalProducts = filteredProducts.length;

        // Calculate pagination
        const from = (currentPage - 1) * productsPerPage;
        const to = from + productsPerPage - 1;

        // Get paginated results
        const paginatedProducts = filteredProducts.slice(from, to + 1);

        // Update the table
        updateProductTable(paginatedProducts);
        updatePaginationControls(currentPage);

    } catch (error) {
        console.error('Error searching products:', error);
        alert('Failed to search products: ' + error.message);
    }
}

// Helper function to update product table
function updateProductTable(products) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (products.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p class="text-lg font-medium">No Products Found</p>
                    <p class="text-sm">Try adjusting your search terms or add new products.</p>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">
                <span class="font-medium">${product.product_name || 'Unnamed Product'}</span>
            </td>
            <td class="px-4 py-2">
                <span class="font-medium text-green-600">₱${product.price?.toFixed(2) || '0.00'}</span>
            </td>
            <td class="px-4 py-2">
                <span class="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    ${product.size || 'N/A'}
                </span>
            </td>
            <td class="px-4 py-2">
                <span class="px-2 py-1 ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full text-sm">
                    ${product.quantity || 0} in stock
                </span>
            </td>
            <td class="px-4 py-2">
                <span class="text-gray-600">
                    ${product.weight ? `${product.weight} kg` : 'N/A'}
                </span>
            </td>
            <td class="px-4 py-2">
                <span class="px-2 py-1 ${product.product_type === 'pagkaon' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'} rounded-full text-sm">
                    ${product.product_type || 'Uncategorized'}
                </span>
            </td>
            <td class="px-4 py-2">
                <span class="text-gray-600 line-clamp-2">
                    ${product.description || 'No description available'}
                </span>
            </td>
            <td class="px-4 py-2">
                <div class="flex space-x-2">
                    <button onclick="editProduct('${product.id}')" 
                            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors">
                        <i class="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button onclick="deleteProduct('${product.id}')" 
                            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                        <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update loadProducts function to use updateProductTable
async function loadProducts(page = 1) {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) throw new Error('Not logged in');

        // Get total count of products
        const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', user.id);

        if (countError) throw countError;
        totalProducts = count;

        // Calculate pagination
        const from = (page - 1) * productsPerPage;
        const to = from + productsPerPage - 1;

        // Get paginated products
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('seller_id', user.id)
            .range(from, to);

        if (error) throw error;

        // Update the table
        updateProductTable(products);
        updatePaginationControls(page);

    } catch (error) {
        console.error('Error loading products:', error);
        alert('Failed to load products: ' + error.message);
    }
}

// Update pagination controls
function updatePaginationControls(currentPage) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const paginationContainer = document.getElementById('paginationControls');
    
    if (!paginationContainer) {
        console.error('Pagination container not found');
        return;
    }

    // If there are no products, show a message
    if (totalProducts === 0) {
        paginationContainer.innerHTML = `
            <div class="text-center text-gray-500 py-4">
                No products found. Add your first product using the "Add Products" section.
            </div>
        `;
        return;
    }

    let paginationHTML = `
        <button onclick="loadProducts(${currentPage - 1})" 
                class="px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}"
                ${currentPage === 1 ? 'disabled' : ''}>
            Previous
        </button>
        <span class="text-gray-700">Page ${currentPage} of ${totalPages}</span>
        <button onclick="loadProducts(${currentPage + 1})" 
                class="px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}"
                ${currentPage === totalPages ? 'disabled' : ''}>
            Next
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Edit Product Functions
async function editProduct(productId) {
    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error) throw error;

        // Fill the form with product data
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.product_name;
        document.getElementById('editPrice').value = product.price;
        document.getElementById('editSize').value = product.size;
        document.getElementById('editQuantity').value = product.quantity;
        document.getElementById('editWeight').value = product.weight;
        document.getElementById('editProductType').value = product.product_type;
        document.getElementById('editDescription').value = product.description;

        // Display current product image
        const imagePreview = document.getElementById('productImage');
        if (product.image_url) {
            imagePreview.src = product.image_url;
            imagePreview.alt = product.product_name;
        } else {
            imagePreview.src = './assets/img/nearbuy_primary_logo.png';
            imagePreview.alt = 'Default product image';
        }

        // Show the modal
        document.getElementById('editProductModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading product:', error);
        alert('Failed to load product: ' + error.message);
    }
}

function closeEditModal() {
    document.getElementById('editProductModal').classList.add('hidden');
    document.getElementById('editProductForm').reset();
    document.getElementById('productImage').src = './assets/img/nearbuy_primary_logo.png';
}

// Handle edit form submission
document.getElementById('editProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const productId = document.getElementById('editProductId').value;
        const fileInput = document.getElementById('file_input');
        const updatedProduct = {
            product_name: document.getElementById('editProductName').value,
            price: parseFloat(document.getElementById('editPrice').value),
            size: document.getElementById('editSize').value,
            quantity: parseInt(document.getElementById('editQuantity').value),
            weight: parseFloat(document.getElementById('editWeight').value),
            product_type: document.getElementById('editProductType').value,
            description: document.getElementById('editDescription').value
        };

        // Handle image upload if a new file was selected
        if (fileInput.files && fileInput.files[0]) {
            const imageFile = fileInput.files[0];
            const timestamp = Date.now();
            const targetFolder = updatedProduct.product_type.toLowerCase() === 'butang' ? 'butang' : 'pagkaon';
            const imageName = `${timestamp}-${imageFile.name}`;
            const imageUrl = `./assets/items/${targetFolder}/${imageName}`;
            const targetPath = `./assets/items/${targetFolder}/${imageName}`;

            // Upload image to backend
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('path', targetPath);

            const uploadRes = await fetch('php/upload.php', {
                method: 'POST',
                body: formData
            });

            const uploadResult = await uploadRes.json();
            
            if (!uploadResult.success) {
                throw new Error(uploadResult.message || 'Image upload failed');
            }

            updatedProduct.image_url = imageUrl;
        }

        const { error } = await supabase
            .from('products')
            .update(updatedProduct)
            .eq('id', productId);

        if (error) throw error;

        alert('Product updated successfully!');
        closeEditModal();
        loadProducts(); // Refresh the product list
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product: ' + error.message);
    }
});

// Delete Product Functions
let productToDelete = null;

function deleteProduct(productId) {
    productToDelete = productId;
    document.getElementById('deleteConfirmModal').classList.remove('hidden');
}

function closeDeleteModal() {
    document.getElementById('deleteConfirmModal').classList.add('hidden');
    productToDelete = null;
}

// Success Modal Functions
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hidden');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');
}

async function confirmDelete() {
    if (!productToDelete) return;

    try {
        // First, get the product to check if it has an image
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('image_url')
            .eq('id', productToDelete)
            .single();

        if (fetchError) throw fetchError;

        // Delete the product from the database
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', productToDelete);

        if (deleteError) throw deleteError;

        // If the product had an image, try to delete it from storage
        if (product && product.image_url) {
            const imagePath = product.image_url.split('/').pop();
            if (imagePath) {
                try {
                    await supabase.storage
                        .from('products')
                        .remove([`product-images/${imagePath}`]);
                } catch (storageError) {
                    console.error('Error deleting image:', storageError);
                    // Continue even if image deletion fails
                }
            }
        }

        closeDeleteModal();
        showSuccessModal('Product deleted successfully!');
        loadProducts(); // Refresh the product list
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product: ' + error.message);
    }
}

// Add event listener for search input
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
});


// Variables for order pagination
let ordersPerPage = 10;
let totalOrders = 0;

// Function to update order pagination controls
function updateOrderPaginationControls(currentPage) {
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    const controls = document.getElementById('orderPaginationControls');
    controls.innerHTML = '';

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&larr; Previous';
    prevButton.className = `px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`;
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => loadOrders(currentPage - 1);
    controls.appendChild(prevButton);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = `px-3 py-1 rounded ${currentPage === i ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        pageButton.onclick = () => loadOrders(i);
        controls.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next &rarr;';
    nextButton.className = `px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`;
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => loadOrders(currentPage + 1);
    controls.appendChild(nextButton);
}

// Function to update order table
async function updateOrderTable(orders) {
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = '';

    if (orders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="8" class="px-4 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p class="text-lg font-medium">No Orders Found</p>
                    <p class="text-sm">No orders have been placed yet.</p>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
        return;
    }

    for (const order of orders) {
        // Get customer details
        const { data: customer } = await supabase
            .from('users')
            .select('firstname, lastname')
            .eq('id', order.user_id)
            .single();

        // Get ordered products
        const { data: orderedProducts } = await supabase
            .from('ordered')
            .select('*, products(product_name)')
            .eq('orders_id', order.id);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">#${order.id}</td>
            <td class="px-4 py-2">${customer ? `${customer.firstname} ${customer.lastname}` : 'Unknown'}</td>
            <td class="px-4 py-2">
                ${orderedProducts?.map(op => `${op.products?.product_name} (x${op.quantity})`).join(', ') || 'N/A'}
            </td>
            <td class="px-4 py-2">₱${order.total_amount?.toFixed(2) || '0.00'}</td>
            <td class="px-4 py-2">${order.payment_method || 'N/A'}</td>
            <td class="px-4 py-2">
                <span class="px-2 py-1 rounded-full text-sm ${getStatusClass(order.status)}">
                    ${order.status || 'Unknown'}
                </span>
            </td>
            <td class="px-4 py-2">${new Date(order.order_date).toLocaleDateString()}</td>
            <td class="px-4 py-2">
                <button onclick="updateOrderStatus('${order.id}')" 
                        class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors">
                    Update Status
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    }
}

// Helper function to get status class
function getStatusClass(status) {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// Function to load orders
async function loadOrders(page = 1) {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) throw new Error('Not logged in');

        // Get total count of orders
        const { count, error: countError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', user.id);

        if (countError) throw countError;
        totalOrders = count;

        // Calculate pagination
        const from = (page - 1) * ordersPerPage;
        const to = from + ordersPerPage - 1;

        // Get paginated orders
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('seller_id', user.id)
            .range(from, to)
            .order('order_date', { ascending: false });

        if (error) throw error;

        // Update the table and pagination
        await updateOrderTable(orders);
        updateOrderPaginationControls(page);

    } catch (error) {
        console.error('Error loading orders:', error);
        alert('Failed to load orders: ' + error.message);
    }
}

// Function to update order status
async function updateOrderStatus(orderId) {
    const newStatus = prompt('Enter new status (pending/processing/completed/cancelled):');
    if (!newStatus) return;

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
        alert('Invalid status. Please use: pending, processing, completed, or cancelled');
        return;
    }

    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus.toLowerCase() })
            .eq('id', orderId);

        if (error) throw error;

        alert('Order status updated successfully!');
        loadOrders(); // Refresh the orders list
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status: ' + error.message);
    }
}


// Variables for feedback pagination
let feedbackPerPage = 10;
let totalStoreFeedback = 0;
let totalProductFeedback = 0;

// Function to load feedback
async function loadFeedback(page = 1) {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) throw new Error('User not found');

        // Calculate pagination range
        const from = (page - 1) * feedbackPerPage;
        const to = from + feedbackPerPage - 1;

        // Get store feedback count
        const { count: storeFeedbackCount, error: countError } = await supabase
            .from('feedback')
            .select('*', { count: 'exact' })
            .eq('entity_id', user.id);

        if (countError) throw countError;
        totalStoreFeedback = storeFeedbackCount;

        // Get product feedback count
        const { data: products } = await supabase
            .from('products')
            .select('id')
            .eq('seller_id', user.id);

        const productIds = products.map(p => p.id);

        const { count: productFeedbackCount, error: productCountError } = await supabase
            .from('feedback')
            .select('*', { count: 'exact' })
            .in('entity_id', productIds);

        if (productCountError) throw productCountError;
        totalProductFeedback = productFeedbackCount;

        // Get paginated store feedback
        const { data: storeFeedback, error: storeFeedbackError } = await supabase
            .from('feedback')
            .select('*')
            .eq('entity_id', user.id)
            .range(from, to)
            .order('created_at', { ascending: false });

        if (storeFeedbackError) throw storeFeedbackError;

        // Get paginated product feedback
        const { data: productFeedback, error: productFeedbackError } = await supabase
            .from('feedback')
            .select('*, products(product_name)')
            .in('entity_id', productIds)
            .range(from, to)
            .order('created_at', { ascending: false });

        if (productFeedbackError) throw productFeedbackError;

        updateFeedbackTables(storeFeedback, productFeedback);
        updateFeedbackPaginationControls(page);

    } catch (error) {
        console.error('Error loading feedback:', error);
        alert('Failed to load feedback: ' + error.message);
    }
}

// Function to update feedback tables
function updateFeedbackTables(storeFeedback, productFeedback) {
    const storeFeedbackBody = document.getElementById('storeFeedbackTableBody');
    const productFeedbackBody = document.getElementById('productFeedbackTableBody');

    // Update store feedback table
    storeFeedbackBody.innerHTML = storeFeedback.length ? storeFeedback.map(feedback => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-2">${feedback.firstname} ${feedback.lastname}</td>
            <td class="px-4 py-2">
                <img src="${feedback.profile_picture || '../assets/default-profile.png'}" 
                     alt="Profile" class="w-10 h-10 rounded-full">
            </td>
            <td class="px-4 py-2">${'⭐'.repeat(feedback.rate)}</td>
            <td class="px-4 py-2">${feedback.statement}</td>
            <td class="px-4 py-2">${new Date(feedback.created_at).toLocaleDateString()}</td>
        </tr>
    `).join('') : `
        <tr>
            <td colspan="5" class="px-4 py-4 text-center text-gray-500">No store feedback available</td>
        </tr>
    `;

    // Update product feedback table
    productFeedbackBody.innerHTML = productFeedback.length ? productFeedback.map(feedback => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-2">${feedback.products.product_name}</td>
            <td class="px-4 py-2">${feedback.firstname} ${feedback.lastname}</td>
            <td class="px-4 py-2">
                <img src="${feedback.profile_picture || '../assets/default-profile.png'}" 
                     alt="Profile" class="w-10 h-10 rounded-full">
            </td>
            <td class="px-4 py-2">${'⭐'.repeat(feedback.rate)}</td>
            <td class="px-4 py-2">${feedback.statement}</td>
            <td class="px-4 py-2">${new Date(feedback.created_at).toLocaleDateString()}</td>
        </tr>
    `).join('') : `
        <tr>
            <td colspan="6" class="px-4 py-4 text-center text-gray-500">No product feedback available</td>
        </tr>
    `;
}

// Function to update feedback pagination controls
function updateFeedbackPaginationControls(currentPage) {
    const totalPages = Math.ceil(Math.max(totalStoreFeedback, totalProductFeedback) / feedbackPerPage);
    const controls = document.getElementById('feedbackPaginationControls');
    controls.innerHTML = '';

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&larr; Previous';
    prevButton.className = `px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`;
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => loadFeedback(currentPage - 1);
    controls.appendChild(prevButton);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = `px-3 py-1 rounded ${currentPage === i ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        pageButton.onclick = () => loadFeedback(i);
        controls.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next &rarr;';
    nextButton.className = `px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`;
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => loadFeedback(currentPage + 1);
    controls.appendChild(nextButton);
}
