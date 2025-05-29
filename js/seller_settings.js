

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
