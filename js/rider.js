document.addEventListener('DOMContentLoaded', () => {
    const drawer = document.getElementById('drawer');
    const drawerOpenBtn = document.getElementById('drawer-open');
    const drawerCloseBtn = document.getElementById('drawer-close');
    const drawerOverlay = document.getElementById('drawer-overlay');

    function openDrawer() {
        drawer.classList.remove('translate-x-full');
        drawer.classList.add('translate-x-0');
        drawerOverlay.classList.remove('hidden');
        drawerOverlay.classList.add('block');
    }

    function closeDrawer() {
        drawer.classList.remove('translate-x-0');
        drawer.classList.add('translate-x-full');
        drawerOverlay.classList.remove('block');
        drawerOverlay.classList.add('hidden');
    }

    if (drawerOpenBtn) {
        drawerOpenBtn.addEventListener('click', openDrawer);
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const orders = [
        {
            customerName: "Genie James Arsenal",
            customerLocation: "Suka Pinalami",
            customerAddress: "Location Address",
            customerProfileImg: "https://via.placeholder.com/50"
        },
        {
            customerName: "Joana Talitod",
            customerLocation: "Saray Iligan City",
            customerAddress: "123 Main St",
            customerProfileImg: "https://via.placeholder.com/50"
        },
        {
            customerName: "Bob Johnson",
            customerLocation: "Purok Dos",
            customerAddress: "456 Oak Ave",
            customerProfileImg: "https://via.placeholder.com/50"
        },
         {
            customerName: "Charlie Brown",
            customerLocation: "District Three",
            customerAddress: "789 Pine Ln",
            customerProfileImg: "https://via.placeholder.com/50"
        },
        {
            customerName: "David Green",
            customerLocation: "Sector Four",
            customerAddress: "101 Maple Rd",
            customerProfileImg: "https://via.placeholder.com/50"
        },
        {
            customerName: "Eve Adams",
            customerLocation: "Zone Five",
            customerAddress: "202 Birch Blvd",
            customerProfileImg: "https://via.placeholder.com/50"
        },
        {
            customerName: "Frank White",
            customerLocation: "Area Six",
            customerAddress: "303 Cedar Ct",
            customerProfileImg: "https://via.placeholder.com/50"
        },
        {
            customerName: "Grace Black",
            customerLocation: "Block Seven",
            customerAddress: "404 Elm St",
            customerProfileImg: "https://via.placeholder.com/50"
        },
        {
            customerName: "Henry Blue",
            customerLocation: "Phase Eight",
            customerAddress: "505 Pine Ave",
            customerProfileImg: "https://via.placeholder.com/50"
        },
        {
            customerName: "Ivy Red",
            customerLocation: "Section Nine",
            customerAddress: "606 Oak Ln",
            customerProfileImg: "https://via.placeholder.com/50"
        }
    ];

    const ordersListDiv = document.getElementById('orders-list');

    function renderOrders(ordersArray) {
        ordersListDiv.innerHTML = ''; 

        if (ordersArray.length === 0) {
            ordersListDiv.innerHTML = '<p class="text-center text-gray-500">No orders found.</p>';
            return;
        }

        ordersArray.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('flex', 'flex-col', 'sm:flex-row', 'items-start', 'sm:items-center', 'justify-between', 'border-b', 'border-gray-200', 'py-4');

            orderElement.innerHTML = `
                <div class="flex items-center mb-2 sm:mb-0">
                    <img src="${order.customerProfileImg}" alt="Customer Profile" class="w-12 h-12 rounded-full mr-4 object-cover">
                    <div>
                        <p class="text-lg font-semibold">${order.customerName}</p>
                        <p class="text-gray-600">${order.customerLocation}</p>
                        <p class="text-gray-700">${order.customerAddress}</p>
                    </div>
                </div>
                <!-- Add action buttons here if needed, e.g., Accept/Reject -->
                <!--
                <div class="flex space-x-2">
                    <button class="bg-green-500 text-white px-4 py-2 rounded">Accept</button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
                </div>
                -->
            `;

            ordersListDiv.appendChild(orderElement);
        });
    }


    renderOrders(orders);

  
    const searchInput = document.getElementById('order-search'); 
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            const filteredOrders = orders.filter(order =>
                order.customerName.toLowerCase().includes(searchTerm) ||
                order.customerLocation.toLowerCase().includes(searchTerm) ||
                order.customerAddress.toLowerCase().includes(searchTerm)
             
            );
            renderOrders(filteredOrders);
        });
    }
});
