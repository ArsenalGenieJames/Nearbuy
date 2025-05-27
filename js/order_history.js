// First, define the correct access check function (copied from other files)
function checkCustomerAccess() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.usertype !== 'customer') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Function to fetch and display customer orders
async function fetchAndDisplayOrders() {
    const ordersContainer = document.getElementById('orders-container');
    if (!ordersContainer) {
        console.error('Orders container not found!');
        return;
    }

    // Clear previous content
    ordersContainer.innerHTML = '';

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.id) {
        ordersContainer.innerHTML = '<p class="text-center text-gray-600">Please log in to view your order history.</p>';
        return;
    }

    try {
        // Fetch orders for the logged-in user
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select(`
                id,
                total_amount,
                status,
                order_date,
                ordered (
                    quantity,
                    subtotal,
                    product: products (
                        product_name,
                        image_url,
                        price // Include price from products for display consistency if needed
                    )
                )
            `)
            .eq('user_id', user.id)
            .order('order_date', { ascending: false });

        if (ordersError) {
            console.error('Error fetching orders:', ordersError);
            ordersContainer.innerHTML = '<p class="text-center text-red-600">Error loading orders. Please try again.</p>';
            return;
        }

        if (!orders || orders.length === 0) {
            ordersContainer.innerHTML = '<p class="text-center text-gray-600">You have no orders yet.</p>';
            return;
        }

        // Render orders
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'p-6', 'mb-6');

            const orderDate = new Date(order.order_date).toLocaleDateString();

            orderElement.innerHTML = `
                <h2 class="text-xl font-semibold mb-4">Order #${order.id} - <span class="font-normal text-gray-600">${orderDate}</span></h2>
                <div class="space-y-4">
                    ${order.ordered.map(item => `
                        <div class="flex items-center border-b pb-4">
                            <img src="${item.product.image_url}" alt="${item.product.product_name}" class="w-16 h-16 object-cover rounded mr-4">
                            <div class="flex-1">
                                <h3 class="text-lg font-medium">${item.product.product_name}</h3>
                                <p class="text-gray-600">Quantity: ${item.quantity}</p>
                                <p class="text-gray-600">Subtotal: ₱${item.subtotal.toFixed(2)}</p>
                            </div>
                            <!-- Add Feedback button here later -->
                             <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onclick="openFeedbackModal(${item.product.id})">Leave Feedback</button>
                        </div>
                    `).join('')}
                </div>
                <div class="text-right mt-4">
                    <p class="text-lg font-bold">Total: ₱${order.total_amount.toFixed(2)}</p>
                    <p class="text-gray-700">Status: ${order.status}</p>
                </div>
            `;

            ordersContainer.appendChild(orderElement);
        });

    } catch (error) {
        console.error('An unexpected error occurred while fetching orders:', error);
        ordersContainer.innerHTML = '<p class="text-center text-red-600">An error occurred. Please try again.</p>';
    }
}

// Function to update cart icon count in the header (optional, but good for consistency)
function updateCartIconCount() {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const cartIconCountElement = document.getElementById('cart-icons');
    if (cartIconCountElement) {
        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartIconCountElement.textContent = itemCount;
    }
}

// Function to display customer name in the header
function displayCustomerName() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const customerNameElement = document.getElementById('customerName');
    if (customerNameElement && user && user.firstname && user.lastname) {
        customerNameElement.textContent = `${user.firstname} ${user.lastname}`;
    } else if (customerNameElement) {
         customerNameElement.textContent = 'Guest'; // Set a default if name is not available
    }
}

// Placeholder for opening feedback modal
function openFeedbackModal(productId) {
    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackProductIdInput = document.getElementById('feedbackProductId');

    if (feedbackModal && feedbackProductIdInput) {
        feedbackProductIdInput.value = productId; // Store the product ID
        feedbackModal.style.display = 'flex'; // Show the modal
    }
}

// Function to close the feedback modal
function closeFeedbackModal() {
    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackForm = document.getElementById('feedbackForm');

    if (feedbackModal && feedbackForm) {
        feedbackForm.reset(); // Reset the form fields
        feedbackModal.style.display = 'none'; // Hide the modal
    }
}

// Function to handle feedback form submission
async function handleFeedbackSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.id) {
        alert('You must be logged in to submit feedback.');
        return;
    }

    const feedbackProductId = document.getElementById('feedbackProductId').value;
    const rating = document.getElementById('rating').value;
    const statement = document.getElementById('statement').value;

    // Get user's name and profile picture from sessionStorage if available
    const firstname = user.firstname || null;
    const lastname = user.lastname || null;
    const profile_picture = user.profile_picture || null; // Assuming profile_picture is stored in user object

    if (!feedbackProductId || !rating || !statement) {
        alert('Please fill out all feedback fields.');
        return;
    }

    try {
        const { error } = await supabase
            .from('feedback')
            .insert([
                {
                    user_id: user.id,
                    entity_id: parseInt(feedbackProductId), // Store product ID as entity_id
                    firstname: firstname,
                    lastname: lastname,
                    profile_picture: profile_picture,
                    statement: statement,
                    rate: parseInt(rating)
                }
            ]);

        if (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback. Please try again.');
        } else {
            alert('Feedback submitted successfully!');
            closeFeedbackModal(); // Close modal on success
            // Optionally, refresh the order history or update the UI to show feedback submitted
        }

    } catch (error) {
        console.error('An unexpected error occurred during feedback submission:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    if (!checkCustomerAccess()) return; // Ensure user is logged in

    displayCustomerName(); // Display customer name
    updateCartIconCount(); // Update cart icon
    fetchAndDisplayOrders(); // Fetch and display orders

    // Add event listener for the feedback form submission
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    } else {
        console.error('Feedback form not found!');
    }
}); 