const form = document.getElementById("login-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password-login").value;

    try {
        // First check the users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError) throw userError;

        // If user exists and password matches
        if (userData && userData.password === password) {
            // Store user data in sessionStorage
            sessionStorage.setItem('user', JSON.stringify({
                id: userData.id,
                email: userData.email,
                usertype: userData.usertype,
                firstname: userData.firstname,
                lastname: userData.lastname
            }));

            // Redirect based on user type
            switch (userData.usertype) {
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
        } else {
            alert("❌ Invalid email or password. Please try again.");
        }

    } catch (error) {
        console.error('Login error:', error);
        if (error.message.includes("No rows found")) {
            alert("❌ Invalid email or password. Please try again.");
        } else {
            alert('Error logging in: ' + error.message);
        }
    }
});