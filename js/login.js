const form = document.getElementById("login-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password-login").value;

    try {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Get user type from the users table
        const { data, error: userError } = await supabase
            .from('users')
            .select('usertype')
            .eq('email', email)
            .single();

        if (userError) throw userError;

        // Redirect based on user type
        switch (data.usertype) {
            case "customer": 
                window.location.href = "customer.html";
                break;
            case "rider":
                window.location.href = "rider.html";
                break;
            case "seller":
                window.location.href = "seller.html";
                break;
            default:
                alert("❌ Unknown user type!");
        }

    } catch (error) {
        alert('Error logging in: ' + error.message);
        console.error('Login error:', error);
    }
});