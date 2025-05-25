// Simple seller data store and update logic for users table

document.addEventListener('DOMContentLoaded', function () {
    // Only allow sellers
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.usertype !== 'seller') {
        window.location.href = 'login.html';
        return;
    }

    // Show seller name
    const sellerNameEl = document.getElementById('sellerName');
    if (sellerNameEl) {
        sellerNameEl.textContent = (user.firstname || '') + ' ' + (user.lastname || '');
    }

    // Dropdown menu logic for seller menu
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (menuButton && dropdownMenu) {
        // Toggle dropdown on button click
        menuButton.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', function (e) {
            // Only close if dropdown is open and click is outside menuButton and dropdownMenu
            if (!dropdownMenu.classList.contains('hidden')) {
                if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.add('hidden');
                }
            }
        });
    }

    // Load seller info into form
    if (document.getElementById('firstname')) document.getElementById('firstname').value = user.firstname || '';
    if (document.getElementById('lastname')) document.getElementById('lastname').value = user.lastname || '';
    if (document.getElementById('email')) document.getElementById('email').value = user.email || '';
    if (document.getElementById('phone_number')) document.getElementById('phone_number').value = user.phone_number || '';
    if (document.getElementById('address')) document.getElementById('address').value = user.address || '';
    if (user.profile_picture && document.getElementById('profilePreview')) {
        document.getElementById('profilePreview').src = user.profile_picture;
    }

    // Profile picture preview
    const profileInput = document.getElementById('profile_picture');
    if (profileInput) {
        profileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                document.getElementById('profilePreview').src = URL.createObjectURL(file);
            }
        });
    }

    // Save seller settings
    const sellerSettingsForm = document.getElementById('sellerSettingsForm');
    if (sellerSettingsForm) {
        sellerSettingsForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form values
            const firstname = document.getElementById('firstname').value.trim();
            const lastname = document.getElementById('lastname').value.trim();
            const phone_number = document.getElementById('phone_number').value.trim();
            const address = document.getElementById('address') ? document.getElementById('address').value.trim() : '';
            const password = document.getElementById('password') ? document.getElementById('password').value : '';
            let profile_picture_url = user.profile_picture || ''; // Renamed variable for clarity

            // Handle profile picture upload if changed
            const fileInput = document.getElementById('profile_picture');
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}_${Date.now()}.${fileExt}`;

                // Upload to Supabase Storage (assumes supabase is initialized)
                const { data, error: uploadError } = await supabase.storage // Renamed error to uploadError
                    .from('profile-pictures')
                    .upload(fileName, file, { upsert: true });

                if (!uploadError) {
                    // Get the public URL of the uploaded file
                    const { data: { publicUrl }, error: urlError } = supabase.storage.from('profile-pictures').getPublicUrl(fileName);

                    if (urlError) {
                         console.error('Supabase public URL error:', urlError);
                         showErrorModal('Failed to get public URL for profile picture: ' + (urlError.message || 'Unknown URL error'));
                         return;
                    }

                    profile_picture_url = publicUrl; // Use the public URL
                } else {
                    console.error('Supabase upload error:', uploadError); // Log the error
                    showErrorModal('Failed to upload profile picture: ' + (uploadError.message || 'Unknown error')); // Show the actual error message
                    return; // Stop if upload fails
                }

                // For simplicity, just use a fake URL (in real app, upload to storage)
                // profile_picture = URL.createObjectURL(file); // Removed temporary URL creation
            }

            // Prepare update object
            const updateObj = {
                firstname,
                lastname,
                phone_number,
                address,
                profile_picture: profile_picture_url // Use the uploaded URL or existing one
            };
            if (password && password.trim().length > 0) {
                // Note: You should ideally hash passwords server-side
                updateObj.password = password;
            }

            // Update user in Supabase
            const { error: updateError } = await supabase
                .from('users')
                .update(updateObj)
                .eq('id', user.id);

            if (updateError) {
                console.error('Supabase update error:', updateError); // Log the update error
                showErrorModal('Failed to update settings: ' + (updateError.message || 'Unknown update error')); // Show update error
                return; // Stop if update fails
            }


            // Update sessionStorage (do not store password)
            const updatedUser = {
                ...user,
                firstname,
                lastname,
                phone_number,
                address,
                profile_picture: profile_picture_url
            };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));

            // Show success modal if exists
            if (document.getElementById('successModal')) {
                document.getElementById('successMessage').textContent = 'Profile updated successfully!'; // Update success message
                document.getElementById('successModal').classList.remove('hidden');
            }
        });
    }
});

// Simple modal close functions
function closeSuccessModal() {
    if (document.getElementById('successModal')) {
        document.getElementById('successModal').classList.add('hidden');
    }
}
function showErrorModal(message) {
    if (document.getElementById('errorMessage')) {
        document.getElementById('errorMessage').textContent = message;
    }
    if (document.getElementById('errorModal')) {
        document.getElementById('errorModal').classList.remove('hidden');
    }
}
function closeErrorModal() {
    if (document.getElementById('errorModal')) {
        document.getElementById('errorModal').classList.add('hidden');
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const storeSettingsForm = document.getElementById('storeSettingsForm');
    const profileStoreInput = document.getElementById('profile_store');
    const storeProfilePreview = document.getElementById('storeProfilePreview');
    const storeNameInput = document.getElementById('store_name');
    const locationInput = document.getElementById('location');
    const ratingsSpan = document.getElementById('ratings'); // Assuming ratings is display only

    // Check if the user is logged in and is a seller
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.usertype !== 'seller') {
        // Redirect or show an error if not a seller
        console.error('User is not logged in or not a seller.');
        // Optionally redirect to login or dashboard
        // window.location.href = 'login.html';
        return;
    }

    // --- Load existing store settings ---
    // This function loads the store data from Supabase and populates the form fields.
    // It also fetches the public URL for the profile picture from Supabase Storage.
    async function loadStoreSettings(sellerId) {
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('seller_id', sellerId) // Assuming 'seller_id' column exists in 'stores' table
            .single(); // Assuming one store per seller

        if (error && error.code !== 'PGRST116') { // PGRST116 means "no rows found"
            console.error('Error loading store settings:', error);
            showErrorModal('Failed to load store settings.');
            return null;
        }

        if (data) {
            // Populate the form fields
            storeNameInput.value = data.store_name || '';
            locationInput.value = data.location || '';
            ratingsSpan.textContent = data.ratings ? parseFloat(data.ratings).toFixed(2) : 'N/A'; // Format ratings

            // Set profile picture preview from Supabase Storage
            if (data.profile_store) {
                 // profile_store stores the path within the storage bucket
                 const { data: publicUrlData } = supabase.storage.from('store-profiles').getPublicUrl(data.profile_store);
                 if (publicUrlData && publicUrlData.publicUrl) {
                     storeProfilePreview.src = publicUrlData.publicUrl;
                 } else {
                     console.warn('Could not get public URL for store profile:', data.profile_store);
                     storeProfilePreview.src = './assets/img/nearbuy_primary_logo.png'; // Fallback
                 }
            } else {
                 storeProfilePreview.src = './assets/img/nearbuy_primary_logo.png'; // Default placeholder
            }
            return data; // Return loaded data
        } else {
             // No store found for this seller, form will remain empty
             console.log('No existing store settings found for this seller.');
             ratingsSpan.textContent = 'N/A'; // Set default for ratings
             return null; // Indicate no data was loaded
        }
    }

    // Load settings when the page loads
    // existingStoreData will hold the data if a store record exists, or null otherwise.
    let existingStoreData = await loadStoreSettings(user.id); // Pass seller's user ID

    // --- Profile picture preview ---
    // This event listener updates the image preview when a new file is selected.
    // If no file is selected, it reverts the preview to the currently saved image or default.
    profileStoreInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                storeProfilePreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        } else {
            // If no file is selected, revert to the current saved image or default
            if (existingStoreData && existingStoreData.profile_store) {
                 const { data: publicUrlData } = supabase.storage.from('store-profiles').getPublicUrl(existingStoreData.profile_store);
                 if (publicUrlData && publicUrlData.publicUrl) {
                     storeProfilePreview.src = publicUrlData.publicUrl;
                 } else {
                     storeProfilePreview.src = './assets/img/nearbuy_primary_logo.png'; // Fallback
                 }
            } else {
                 storeProfilePreview.src = './assets/img/nearbuy_primary_logo.png'; // Default
            }
        }
    });

    // --- Form submission handler ---
    // This handles the saving of store settings, including image upload and database update/insert.
    storeSettingsForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const storeName = storeNameInput.value.trim();
        const location = locationInput.value.trim();
        const profileFile = profileStoreInput.files[0];

        if (!storeName || !location) {
            showErrorModal('Store Name and Location are required.');
            return;
        }

        // Start with the existing profile_store path from the loaded data
        let profileStorePathToSave = existingStoreData ? existingStoreData.profile_store : null;

        // 1. Handle Profile Picture Upload (if a new file is selected)
        if (profileFile) {
            const fileExt = profileFile.name.split('.').pop();
            // Create a unique filename using user ID and timestamp
            const fileName = `${user.id}_store_profile_${Date.now()}.${fileExt}`;
            // Define the path within the Supabase Storage bucket
            const filePath = `public/${fileName}`;

            // Use Supabase Storage for upload
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('store-profiles') // Ensure you have a bucket named 'store-profiles'
                .upload(filePath, profileFile, {
                    cacheControl: '3600', // Cache for 1 hour
                    upsert: false // Do not overwrite if a file with the same path exists (unlikely with timestamp)
                });

            if (uploadError) {
                console.error('Supabase Storage upload error:', uploadError);
                showErrorModal('Failed to upload store profile picture: ' + (uploadError.message || 'Unknown upload error'));
                return; // Stop if upload fails
            }

            // If upload is successful, update the path to be saved in the database
            profileStorePathToSave = uploadData.path; // This is the path within the bucket
            console.log('Profile picture uploaded successfully:', profileStorePathToSave);

             // Optional: Delete the old profile picture from storage if it exists and is different
             // This prevents orphaned files in storage.
             if (existingStoreData && existingStoreData.profile_store && existingStoreData.profile_store !== profileStorePathToSave) {
                 const { error: deleteError } = await supabase.storage
                     .from('store-profiles')
                     .remove([existingStoreData.profile_store]); // Pass the old path to remove
                 if (deleteError) {
                     console.warn('Failed to delete old profile picture:', deleteError);
                     // Continue with the update even if old file deletion fails
                 } else {
                     console.log('Old profile picture deleted successfully.');
                 }
             }

        } else {
             // No new file selected, keep the existing profile_store path or null
             console.log('No new profile picture selected. Keeping existing.');
        }


        // 2. Update or Insert Store Data in Supabase
        // Prepare the data object to be saved in the 'stores' table.
        const storeDataToSave = {
            store_name: storeName,
            location: location,
            profile_store: profileStorePathToSave, // Save the path within the bucket
            // ratings is not updated via this form, so it's not included here.
        };

        let dbError = null;
        let dbData = null;

        if (existingStoreData) {
            // If existing data was loaded, update the existing store record.
            console.log('Attempting to update store settings...');
            const { data, error } = await supabase
                .from('stores')
                .update(storeDataToSave)
                .eq('seller_id', user.id) // Update the record for this specific seller
                .select() // Select the updated row to get the latest data
                .single(); // Expecting one row to be updated

            dbData = data;
            dbError = error;

        } else {
            // If no existing data was found, insert a new store record.
            console.log('Attempting to insert new store settings...');
            const { data, error } = await supabase
                .from('stores')
                .insert({
                    ...storeDataToSave,
                    seller_id: user.id // Link the new store to the seller
                })
                .select() // Select the inserted row
                .single(); // Expecting one row to be inserted

            dbData = data;
            dbError = error;
        }

        if (dbError) {
            console.error('Supabase DB operation error:', dbError);
            showErrorModal('Failed to save store settings: ' + (dbError.message || 'Unknown database error'));
            return; // Stop if DB operation fails
        }

        console.log('Store settings saved successfully:', dbData);

        // Reload store settings after saving to update the preview and the existingData variable
        // This ensures the form and preview reflect the saved state, including the new image path.
        existingStoreData = await loadStoreSettings(user.id);

        // Show success modal if it exists in the HTML
        if (document.getElementById('successModal')) {
            document.getElementById('successMessage').textContent = 'Store settings updated successfully!';
            document.getElementById('successModal').classList.remove('hidden');
        }
    });
});
