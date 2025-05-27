function checkSellerAccess() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.usertype !== 'seller') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!checkSellerAccess()) return;

    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            // The checkSellerAccess() already ensures user exists and is a seller,
            // but keeping this check for robustness within the submit handler is fine.
            if (!user) {
                throw new Error('User not logged in');
            }

            const storeName = document.getElementById('storeName').value.trim();
            const storeLocation = document.getElementById('storeLocation').value.trim();
            const fileInput = document.getElementById('file_input');
            const file = fileInput.files[0];

            if (!storeName || !storeLocation || !file) {
                alert('Please fill in all fields and upload a profile image');
                return; // Stop execution if validation fails
            }

            // --- Image Upload ---
            const timestamp = Date.now();
            // Use user ID and timestamp for a unique filename
            const imageName = `${user.id}-${timestamp}-${file.name}`;
            const targetFolder = 'store_profiles'; // Define target folder for store profiles
            const targetPath = `./assets/${targetFolder}/${imageName}`; // Define target path

            const uploadFormData = new FormData();
            uploadFormData.append('image', file);
            uploadFormData.append('path', targetPath);

            // Use fetch to upload the image
            // Assuming 'php/upload.php' is the correct endpoint for general file uploads
            // based on the context provided (seller.js uses 'php/upload.php' for products)
            // If 'php/store.php' is specifically for store-related uploads, keep that.
            // Let's assume 'php/upload.php' is the general one.
            const uploadRes = await fetch('php/upload.php', {
                method: 'POST',
                body: uploadFormData
            });

            const uploadResult = await uploadRes.json();

            if (!uploadResult.success) {
                // Log the server response for debugging
                console.error('Image upload server response:', uploadResult);
                throw new Error(uploadResult.message || 'Image upload failed');
            }

            const imageUrl = uploadResult.data.path; 



            const { data, error: dbError } = await supabase.from('stores').insert([
                {
                    store_name: storeName,
                    location: storeLocation,
                    profile_store: imageUrl, // Save the uploaded image URL
                 
                }
            ]).select(); // Select the inserted data to confirm success

            if (dbError) {
                console.error('Supabase insertion error:', dbError);
                // Check if the error is still related to missing columns,
                // although removing seller_id should fix the specific error mentioned.
                throw new Error(dbError.message || 'Failed to create store in database');
            }

            // Assuming insertion was successful
            console.log('Store created successfully:', data);
            alert('Store setup complete!');
            // Redirect to seller dashboard or profile page
            window.location.href = 'seller.html';

        } catch (error) {
            console.error('❌ Error setting up store:', error);
            alert(`Failed to set up store: ${error.message}`);
        }
    });
});