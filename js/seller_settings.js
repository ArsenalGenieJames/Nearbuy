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
