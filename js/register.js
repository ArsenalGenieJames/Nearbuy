const form = document.getElementById("signup-form")

form.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const phonenumber = document.getElementById("phonenumber").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email-signup").value;
    const password = document.getElementById("password-signup").value;
    const usertype = document.getElementById("userType").value;
  
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      console.error("Sign up error:", error.message);
      alert("❌ " + error.message);
      return;
    }
  
    const { user } = data;
  
    const { error: insertError } = await client.from("users").insert([
      {
        auth_id: user.id,
        email,
        password,
        re_password: password,
        firstname,
        lastname,
        phone_number: phonenumber,
        address,
        usertype, 
        created_at: new Date().toISOString(),
      },
    ]);
  
    if (insertError) {
      console.error("Insert error:", insertError.message);
      alert("❌ " + insertError.message);
      return;
    }
  
    alert("✅ Signup successful!");
  });