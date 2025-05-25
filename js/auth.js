// Authentication related functions
const auth = {
    // Check if user is authenticated
    async checkAuth() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!session) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Sign out user
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
            return false;
        }
        window.location.href = 'login.html';
        return true;
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error getting user:', error);
            return null;
        }
        return user;
    }
};

// Function to check if user is logged in
function isLoggedIn() {
    const user = sessionStorage.getItem('user');
    return user !== null;
}

// Function to get current user data
function getCurrentUser() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Function to check if user is of specific type
function isUserType(type) {
    const user = getCurrentUser();
    return user && user.usertype === type;
}

// Function to redirect to login if not authenticated
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Function to logout
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
} 