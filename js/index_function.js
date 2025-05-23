function handleClick(category) {
    // Get all category sections
    const categorySections = document.querySelectorAll('.category-section');
    
    // Hide all sections first
    categorySections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected category section
    const selectedSection = Array.from(categorySections).find(section => 
        section.querySelector('h1').textContent.includes(`Local ${category}`)
    );
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

// Add jQuery-like contains function if not using jQuery
if (!document.querySelector(':contains')) {
    Element.prototype.matches = Element.prototype.matches || Element.prototype.msMatchesSelector;
    HTMLElement.prototype.contains = function(text) {
        return this.textContent.includes(text);
    };
}

// Initialize by showing only the first category section and hiding others
document.addEventListener('DOMContentLoaded', function() {
    const categorySections = document.querySelectorAll('.category-section');
    categorySections.forEach((section, index) => {
        section.style.display = index === 0 ? 'block' : 'none';
    });
});

let currentProductName = '';
let currentProductPrice = 0;
let currentQuantity = 1;

// Get price from the productPrices array
const productPrices = [
  { name: "Inabal Weaving", price: 1500.00 },
  { name: "Wooden Mortar", price: 800.00 },
  { name: "Luna Shell Necklace", price: 950.00 },
  { name: "Sol Necklace", price: 399.00 },
  { name: "Higaonon Hat", price: 600.00 },
  { name: "Salapid Abaca Rope", price: 100.00 },
  { name: "Fire Rope", price: 50.00 },
  { name: "Bolo", price: 2000.00 },
  { name: "Letchon De Bayug", price: 550.00 },
  { name: "Beef Halang Halang", price: 80.00 },
  { name: "Suka Pinakurat", price: 121.00 },
  { name: "Pater & Palapa", price: 35.00 },
  { name: "Lechon In Box", price: 850.00 },
  { name: "Palapa", price: 50.00 },
  { name: "Kuning", price: 30.00 },
  { name: "Piyapara Manok", price: 350.00 }
];

// Open popup
function addToOrder(productName) {
  try {
    console.log('Adding to order:', productName);
    
    currentProductName = productName;
    currentQuantity = 1;

    const priceObj = productPrices.find(p => p.name === productName);
    currentProductPrice = priceObj ? priceObj.price : 0;

    const popupName = document.getElementById('popupProductName');
    const popupPrice = document.getElementById('popupProductPrice');
    const quantityElement = document.getElementById('quantity');
    const popup = document.getElementById('popupModal');

    if (!popupName || !popupPrice || !quantityElement || !popup) {
      console.error('Required elements not found:', {
        popupName: !!popupName,
        popupPrice: !!popupPrice,
        quantityElement: !!quantityElement,
        popup: !!popup
      });
      return;
    }

    // Update the popup content
    popupName.textContent = productName;
    popupPrice.textContent = `₱${currentProductPrice.toFixed(2)}`;
    quantityElement.textContent = currentQuantity;

    // Show the popup
    popup.style.display = 'flex';
    popup.classList.remove('hidden');
    
    console.log('Popup should be visible now');
    console.log('Popup element:', popup);
    console.log('Popup display style:', popup.style.display);
    console.log('Popup classes:', popup.classList);
  } catch (error) {
    console.error('Error in addToOrder:', error);
  }
}

// Close popup
function closePopup() {
  const popup = document.getElementById('popupModal');
  if (popup) {
    popup.style.display = 'none';
    popup.classList.add('hidden');
  }
}

// Increase quantity
function increaseQuantity() {
  currentQuantity++;
  document.getElementById('quantity').textContent = currentQuantity;
}

// Decrease quantity
function decreaseQuantity() {
  if (currentQuantity > 1) {
    currentQuantity--;
    document.getElementById('quantity').textContent = currentQuantity;
  }
}

// Confirm add to order
function confirmAddToOrder() {
  alert(`${currentQuantity}x ${currentProductName} added to your order! Total: ₱${(currentQuantity * currentProductPrice).toFixed(2)}`);
  updateCartCount(currentQuantity);
  closePopup();
}

// Update cart icon count
function updateCartCount(amount) {
  const cartIcon = document.getElementById('cart-icons');
  let currentCount = parseInt(cartIcon.textContent) || 0;
  cartIcon.textContent = currentCount + amount;
}

