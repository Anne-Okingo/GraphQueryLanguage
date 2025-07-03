document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;
    const credentials = btoa(`${identifier}:${password}`);
  
    try {
      const res = await fetch("https://learn.zone01kisumu.ke/api/auth/signin", {
        method: "POST",
        headers: { Authorization: `Basic ${credentials}` },
      });
  
      if (!res.ok) throw new Error("Invalid credentials");
  
      const jwt = await res.text();
      localStorage.setItem("jwt", jwt);
      window.location.href = "profile.html";
    } catch (err) {
      document.getElementById("error").innerText = err.message;
    }
  });
  
  function logout() {
    localStorage.removeItem("jwt");
    window.location.href = "login.html";
  }
  