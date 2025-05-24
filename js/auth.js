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