document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {

        await supabase.auth.signOut();
        

        localStorage.clear();
        sessionStorage.clear();


        window.location.href = '../index.html';
      } catch (err) {
        console.error(" Logout error:", err.message);
        alert("Something went wrong logging out.");
      }
    });
  } else {
    console.warn(" logoutBtn not found in DOM.");
  }
});
