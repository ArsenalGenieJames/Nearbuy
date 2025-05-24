// Add this at the beginning of seller.js
async function checkSellerAccess() {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
            window.location.href = '/login.html';
            return;
        }

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('usertype')
            .eq('email', session.user.email)
            .single();

        if (userError || !user || user.usertype !== 'seller') {
            window.location.href = '/index.html';
            return;
        }

        return true;
    } catch (error) {
        console.error('Access check failed:', error);
        window.location.href = '/login.html';
        return false;
    }
}

// Call checkSellerAccess when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const hasAccess = await checkSellerAccess();
    if (!hasAccess) return;
});


// seller name automatic display 
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const { data: user, error } = await supabase
            .from('users')
            .select('firstname, lastname')
            .eq('email', session.user.email)
            .single();
            
        if (error) throw error;
        
        const sellerNameElement = document.getElementById('sellerName');
        sellerNameElement.textContent = `${user.firstname} ${user.lastname}`;
    } catch (error) {
        console.error('Error fetching seller name:', error);
    }
});






//drop down menu script 

 document.getElementById('menuButton').addEventListener('click', function() {
            document.getElementById('dropdownMenu').classList.toggle('hidden');
        });


// close the dropdown menu when clicking outside of it (mao ni katong tuplokon nimo ang add poroducts etc. na function)

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

        // Set Add Products as default active section
        window.onload = function() {
            handleClick('AddProducts');
        };






// Add Product Form Submission Script
    document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addProductForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
    // 🔐 Check user session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session) throw new Error('User not logged in');

    // 🧠 Grab input values
    const productName = form.querySelector('input[name="productName"]').value.trim();
    const size = form.querySelector('input[name="size"]').value.trim();
    const price = parseFloat(form.querySelector('input[name="price"]').value);
    const quantity = parseInt(form.querySelector('input[name="quantity"]').value, 10);
    const weight = parseFloat(form.querySelector('input[name="weight"]').value);
    const productType = form.querySelector('select[name="productType"]').value;
    const description = form.querySelector('textarea[name="description"]').value.trim();
    const imageFile = document.getElementById('file_input').files[0];

    // 🗂️ Create image path
    const timestamp = Date.now();
    const targetFolder = productType.toLowerCase() === 'butang' ? 'butang' : 'pagkaon';
    const imageName = `${timestamp}-${imageFile.name}`;
    const targetPath = `D:/xampp/htdocs/Nearbuy/assets/items/${targetFolder}/${imageName}`;

    // 📤 Upload image to backend
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('path', targetPath);

    const uploadRes = await fetch('php/upload.php', {
      method: 'POST',
      body: formData
    });

    if (!uploadRes.ok) throw new Error('Image upload failed.');

    const imageUrl = `/assets/items/${targetFolder}/${imageName}`;

    // 💾 Save product in Supabase
    const { error: dbError } = await supabase.from('products').insert([
      {
        product_name: productName,
        product_type: productType,
        description,
        price,
        size,
        quantity,
        weight,
        image_url: imageUrl
      }
    ]);

    if (dbError) throw dbError;

    alert('✅ Product added successfully!');
    form.reset();
    document.getElementById('productImage').src = './assets/img/nearbuy_primary_logo.png';

    } catch (error) {
    console.error('❌ Error:', error);
    alert(`Failed to add product: ${error.message}`);
    }
  });
});
