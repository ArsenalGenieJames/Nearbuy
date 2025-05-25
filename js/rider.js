// Check if user is logged in and is a rider
function checkRiderAccess() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.usertype !== 'rider') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize drawer navigation
document.addEventListener('DOMContentLoaded', () => {
    if (!checkRiderAccess()) return;

    // Set rider name
    const user = JSON.parse(sessionStorage.getItem('user'));
    const riderNameElement = document.getElementById('riderName');
    if (riderNameElement) {
        riderNameElement.textContent = `${user.firstname} ${user.lastname}`;
    }

    // Initialize Flowbite drawer
    const drawerOptions = {
        placement: 'right',
        backdrop: true,
        bodyScrolling: false,
        edge: false,
        edgeOffset: '',
        onHide: () => {
            console.log('drawer is hidden');
        },
        onShow: () => {
            console.log('drawer is shown');
        },
    };

    // Add click event listeners for navigation items
    document.querySelectorAll('#drawer-navigation a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.closest('a').querySelector('span').textContent.toLowerCase();
            handleNavigation(section);
        });
    });
});

// Handle navigation
function handleNavigation(section) {
    // Hide all sections first
    document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
    
    // Show the selected section
    const sectionElement = document.getElementById(`${section}Section`);
    if (sectionElement) {
        sectionElement.classList.remove('hidden');
    }

    // Close the drawer
    const drawer = document.getElementById('drawer-navigation');
    if (drawer) {
        drawer.classList.add('translate-x-full');
    }
}

// Load deliveries
async function loadDeliveries() {
    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) throw new Error('Not logged in');

        const { data: deliveries, error } = await supabase
            .from('deliveries')
            .select(`
                *,
                orders (
                    id,
                    total_amount,
                    status
                ),
                users!seller_id (
                    firstname,
                    lastname
                )
            `)
            .eq('rider_id', user.id)
            .order('assigned_at', { ascending: false });

        if (error) throw error;

        updateDeliveriesTable(deliveries);
    } catch (error) {
        console.error('Error loading deliveries:', error);
        alert('Failed to load deliveries: ' + error.message);
    }
}

// Update deliveries table
function updateDeliveriesTable(deliveries) {
    const tableBody = document.getElementById('deliveriesTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = deliveries.length ? deliveries.map(delivery => `
        <tr class="hover:bg-gray-50">
            <td class="p-3">#${delivery.orders.id}</td>
            <td class="p-3">${delivery.users.firstname} ${delivery.users.lastname}</td>
            <td class="p-3">
                <span class="px-2 py-1 rounded-full text-sm ${getStatusClass(delivery.status)}">
                    ${delivery.status}
                </span>
            </td>
        </tr>
    `).join('') : `
        <tr>
            <td colspan="3" class="p-4 text-center text-gray-500">
                No deliveries found
            </td>
        </tr>
    `;
}

// Helper function to get status class
function getStatusClass(status) {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'in_progress':
            return 'bg-blue-100 text-blue-800';
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

// Update delivery status
async function updateDeliveryStatus(deliveryId, newStatus) {
    try {
        const { error } = await supabase
            .from('deliveries')
            .update({ status: newStatus })
            .eq('id', deliveryId);

        if (error) throw error;

        showSuccessModal('Delivery status updated successfully!');
        loadDeliveries(); // Refresh the deliveries list
    } catch (error) {
        console.error('Error updating delivery status:', error);
        alert('Failed to update delivery status: ' + error.message);
    }
}

// Success Modal Functions
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const messageElement = document.getElementById('successMessage');
    if (modal && messageElement) {
        messageElement.textContent = message;
        modal.classList.remove('hidden');
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Load initial data
document.addEventListener('DOMContentLoaded', () => {
    loadDeliveries();
});
