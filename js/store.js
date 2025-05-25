
function handleClick(category) {
    console.log('Category clicked:', category);
    const categorySections = document.querySelectorAll('.category-section');
    const carousel = document.querySelector('.container.mx-auto.px-4'); // Select the carousel container
    
    // Hide all category sections first
    categorySections.forEach(section => {
        section.style.display = 'none';
    });
    
    if (category === 'cart') {
        // Hide the carousel when showing cart
        if (carousel) {
            carousel.style.display = 'none';
        }
        
        // Show the cart section
        const cartSection = document.getElementById('cart-container');
        if (cartSection) {
            cartSection.style.display = 'block';
        }
    } else {
        // Show the carousel for other categories
        if (carousel) {
            carousel.style.display = 'block';
        }
        
        // Show the selected category section
        const selectedSection = Array.from(categorySections).find(section => {
            const heading = section.querySelector('h1');
            return heading && heading.textContent.includes(`Local ${category}`);
        });
        
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }
    }
}
