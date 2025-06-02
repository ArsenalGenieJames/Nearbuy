

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
            let profile_picture_url = user.profile_picture || '';

            // Handle profile picture upload if changed
            const fileInput = document.getElementById('profile_picture');
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}_${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('profile-pictures')
                    .upload(fileName, file, { upsert: true });
    
                if (!uploadError) {
                    const { data: { publicUrl }, error: urlError } = supabase.storage.from('profile-pictures').getPublicUrl(fileName);

                    if (urlError) {
                         console.error('Supabase public URL error:', urlError);
                         showErrorModal('Failed to get public URL for profile picture: ' + (urlError.message || 'Unknown URL error'));
                         return;
                    }

                    profile_picture_url = publicUrl;
                } else {
                    console.error('Supabase upload error:', uploadError);
                    showErrorModal('Failed to upload profile picture: ' + (uploadError.message || 'Unknown error'));
                    return;
                }
            }

            // Prepare update object
            const updateObj = {
                firstname,
                lastname,
                phone_number,
                address,
                profile_picture: profile_picture_url
            };
            if (password && password.trim().length > 0) {
                updateObj.password = password;
            }

            // Update user in Supabase
            const { error: updateError } = await supabase
                .from('users')
                .update(updateObj)
                .eq('id', user.id);

            if (updateError) {
                console.error('Supabase update error:', updateError);
                showErrorModal('Failed to update settings: ' + (updateError.message || 'Unknown update error'));
                return;
            }

            // Update sessionStorage
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
                document.getElementById('successMessage').textContent = 'Profile updated successfully!';
                document.getElementById('successModal').classList.remove('hidden');
            }
        });
    }




    

    // --- Store Settings Logic ---
    const storeSettingsForm = document.getElementById('storeSettingsForm');
    const storeProfileInput = document.getElementById('profile_store');
    const storeProfilePreview = document.getElementById('storeProfilePreview');
    const storeNameInput = document.getElementById('store_name');
    const storeLocationInput = document.getElementById('location');
    const storeRatingsSpan = document.getElementById('ratings'); // For display

    const STORE_PROFILE_BUCKET = 'store-profiles'; // ASSUMPTION: Change if your bucket name is different

    // Function to load existing store settings
    async function loadStoreSettings() {
        if (!user || !user.id) return;

        const { data, error } = await supabase
            .from('stores')
            .select('store_name, location, ratings, profile_store')
            .eq('user_id', user.id)
            .single(); // Assuming one store per user for settings

        if (error && error.code !== 'PGRST116') { // PGRST116: 'single' row not found, which is fine if no store yet
            console.error('Error loading store settings:', error);
            showErrorModal('Failed to load store settings: ' + (error.message || 'Unknown error'));
            return;
        }

        if (data) {
            if (storeNameInput) storeNameInput.value = data.store_name || '';
            if (storeLocationInput) storeLocationInput.value = data.location || '';
            if (storeRatingsSpan) storeRatingsSpan.textContent = data.ratings || 'N/A'; // Display ratings
            if (storeProfilePreview && data.profile_store) {
                storeProfilePreview.src = data.profile_store;
            }
        } else {
            // No existing store settings, clear fields or set defaults if needed
            if (storeNameInput) storeNameInput.value = '';
            if (storeLocationInput) storeLocationInput.value = '';
            if (storeRatingsSpan) storeRatingsSpan.textContent = 'N/A';
            if (storeProfilePreview) storeProfilePreview.src = './assets/img/nearbuy_primary_logo.png'; // Default image
        }
    }

    // Store profile picture preview
    if (storeProfileInput && storeProfilePreview) {
        storeProfileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                storeProfilePreview.src = URL.createObjectURL(file);
            }
        });
    }

    // Save store settings
    if (storeSettingsForm) {
        storeSettingsForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (!user || !user.id) {
                showErrorModal('User not logged in.');
                return;
            }

            const store_name = storeNameInput ? storeNameInput.value.trim() : '';
            const location = storeLocationInput ? storeLocationInput.value.trim() : '';
            let profile_store_url = storeProfilePreview ? storeProfilePreview.src : ''; // Keep existing if not changed

            // Handle store profile picture upload if a new file is selected
            if (storeProfileInput && storeProfileInput.files.length > 0) {
                const file = storeProfileInput.files[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`; // Unique filename for store profile

                const { error: uploadError } = await supabase.storage
                    .from(STORE_PROFILE_BUCKET)
                    .upload(fileName, file, { upsert: true });

                if (uploadError) {
                    console.error('Supabase store profile upload error:', uploadError);
                    showErrorModal('Failed to upload store profile: ' + (uploadError.message || 'Unknown error'));
                    return;
                }

                const { data: { publicUrl }, error: urlError } = supabase.storage
                    .from(STORE_PROFILE_BUCKET)
                    .getPublicUrl(fileName);

                if (urlError) {
                    console.error('Supabase store profile public URL error:', urlError);
                    showErrorModal('Failed to get public URL for store profile: ' + (urlError.message || 'Unknown URL error'));
                    return;
                }
                profile_store_url = publicUrl;
            } else if (profile_store_url.startsWith('blob:')) {
                const { data: currentStore, error: currentStoreError } = await supabase
                    .from('stores')
                    .select('profile_store')
                    .eq('user_id', user.id)
                    .single();
                if (currentStore && !currentStoreError) {
                    profile_store_url = currentStore.profile_store;
                } else {
                     profile_store_url = './assets/img/nearbuy_primary_logo.png'; 
                }
            }


            const storeData = {
                user_id: user.id,
                store_name,
                location,
                profile_store: profile_store_url,
            };
            const { error: upsertError } = await supabase
                .from('stores')
                .upsert(storeData, { onConflict: 'user_id' }); // Ensure user_id has a UNIQUE constraint in your 'stores' table

            if (upsertError) {
                console.error('Supabase store upsert error:', upsertError);
                showErrorModal('Failed to save store settings: ' + (upsertError.message || 'Unknown error'));
                return;
            }

            // Show success
            if (document.getElementById('successModal')) {
                document.getElementById('successMessage').textContent = 'Store settings saved successfully!';
                document.getElementById('successModal').classList.remove('hidden');
            }
            loadStoreSettings(); // Reload to show updated data (like new image URL if it was default)
        });
    }

    // Load initial store settings when the page is ready
    loadStoreSettings();

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
