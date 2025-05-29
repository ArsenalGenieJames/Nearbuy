const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const phoneNumber = document.getElementById('phonenumber').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const userType = document.getElementById('userType').value;

    try {
        // Sign up user with Supabase Auth
        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;

        // Insert user data into users table
        const { error: userError } = await supabase
            .from('users')
            .insert([
                {
                    email,
                    password,
                    firstname: firstName,
                    lastname: lastName,
                    phone_number: phoneNumber,
                    address,
                    usertype: userType
                }
            ]);

        if (userError) throw userError;

        alert('Registration successful! Welcome to NearBuy!');
        switch (userType) {
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
                alert("Unknown user type!");
        }

    } catch (error) {
        console.error('Registration error:', error);
        if (error.message.includes("Email not confirmed")) {
            alert("📧 Please check your email and click the confirmation link first.");
        } else {
            alert('Error during registration: ' + error.message);
        }
    }
}); 
