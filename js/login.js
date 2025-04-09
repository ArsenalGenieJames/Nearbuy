const form = document.getElementById("login-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phoneNumber = document.getElementById("phonenumber").value;
    const password = document.getElementById("password-login").value;

    const { data, error } = await client.auth.signInWithPassword({
        phone: phoneNumber,
        password,
    });

    if (error) {
        console.error("Login error:", error.message);
        alert("❌ " + error.message);
        return;
    }

    const { user } = data;

  
    switch (user.userType) {
        case "admin":
            window.location.href = "admin.html";
            break;
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
});