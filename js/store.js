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



// Display user name in header
function displayUserName() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userNameElement = document.getElementById('sellerName');
    
    if (userNameElement) {
        userNameElement.textContent = user ? `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'User' : 'User';
        userNameElement.classList.add('text-black', 'uppercase');
    }
}

// Toggle dropdown menu
function toggleDropdown() {
    document.getElementById('dropdownMenu').classList.toggle('hidden');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!checkUserAccess()) return;
    
    displayUserName();
    fetchAndRenderProducts();
    setupRealtimeSubscription();

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('dropdownMenu');
        const button = document.getElementById('menuButton');
        
        if (!button.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });
});










async function displayStoreInfo() {
    const user = JSON.parse(sessionStorage.getItem('user'));

    // Only proceed if user is a seller
    if (!user || user.usertype !== 'seller') {
        console.log("User is not a seller");
        return;
    }

    try {
        // Fetch store data
        const { data: storeData, error } = await supabase
            .from('stores')
            .select('store_name, ratings, profile_store, location, rating_count')
            .eq('user_id', user.id)
            .single();

        // Update DOM with store data
        const elements = {
            store_name: storeData?.store_name || 'Unnamed Store',
            store_rating_value: storeData?.ratings?.toFixed(2) || '0.00',
            storeProfileImage: storeData?.profile_store || './assets/img/nearbuy_primary_logo.png',
            location: storeData?.location || 'Location not specified',
            store_rating_count: `(${storeData?.rating_count || 0} ratings)`
        };

        // Update each element
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'storeProfileImage') {
                    element.src = value;
                } else {
                    element.textContent = value;
                }
            }
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (checkUserAccess()) {
        displayStoreInfo();
    }
});

































