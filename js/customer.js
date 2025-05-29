


function displayCustomerName() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        const fullName = `${user.firstname} ${user.lastname}`;
        document.getElementById('CustomerName').textContent = fullName;
    }
    // Make sure to call this function when the page loads
}

function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    dropdownMenu.classList.toggle('hidden');
}

// Add this event listener at the end of the file
document.addEventListener('DOMContentLoaded', function() {
    displayCustomerName();
    document.getElementById('menuButton').addEventListener('click', toggleDropdown);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#menuButton')) {
            document.getElementById('dropdownMenu').classList.add('hidden');
        }
    });
});




function handleClick(category) {
    // Hide all category sections first
    const categoryContainer = document.getElementById('category-sections-container');
    const allSections = categoryContainer.getElementsByClassName('category-section');
    
    Array.from(allSections).forEach(section => {
        section.style.display = 'none';
    });

    // Show only the clicked category's section
    const sectionId = `${category.toLowerCase()}-products`;
    const targetSection = document.getElementById(sectionId).closest('.category-section');
    targetSection.style.display = 'block';
}



function fetchProducts(category) {
    $.ajax({
        url: '../php/assets/items/butang', // Adjust path based on your folder structure
        method: 'GET',
        data: { category: category },
        success: function(response) {
            try {
                const products = JSON.parse(response);
                displayProducts(products, category);
            } catch (error) {
                console.error('Error parsing products:', error);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching products:', error);
        }
    });
}

function displayProducts(products, category) {
    const productList = document.getElementById(`${category.toLowerCase()}-products`);
    productList.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(productItem);
    });

    const addToCartButtons = productList.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

function addToCart(productId) {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart.push(productId);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
}

function initializePage() {
    if (!checkSellerAccess()) return;

    const categories = ['Electronics', 'Clothing', 'Home'];
    categories.forEach(category => {
        fetchProducts(category);
    });

    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleClick(this.textContent);
        });
    });
}

document.addEventListener('DOMContentLoaded', initializePage);

