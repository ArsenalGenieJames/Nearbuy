document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        // Supabase logout
        await supabase.auth.signOut();
        
        // Clear storage
        localStorage.clear();
        sessionStorage.clear();

        // Redirect
        window.location.href = '../index.html';
      } catch (err) {
        console.error("❌ Logout error:", err.message);
        alert("Something went wrong logging out.");
      }
    });
  } else {
    console.warn("🚨 logoutBtn not found in DOM.");
  }
});
