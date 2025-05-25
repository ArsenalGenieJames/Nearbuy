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
            let profile_picture = user.profile_picture || '';

            // Simple profile picture upload (optional, skip if not changed)
            const fileInput = document.getElementById('profile_picture');
            if (fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                // For simplicity, just use a fake URL (in real app, upload to storage)
                profile_picture = URL.createObjectURL(file);
            }

            // Prepare update object
            const updateObj = {
                firstname,
                lastname,
                phone_number,
                address,
                profile_picture
            };
            if (password && password.trim().length > 0) {
                updateObj.password = password;
            }

            // Update user in Supabase (simple, no error handling)
            await supabase
                .from('users')
                .update(updateObj)
                .eq('id', user.id);

            // Update sessionStorage (do not store password)
            const updatedUser = {
                ...user,
                firstname,
                lastname,
                phone_number,
                address,
                profile_picture
            };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));

            // Show success modal if exists
            if (document.getElementById('successModal')) {
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
