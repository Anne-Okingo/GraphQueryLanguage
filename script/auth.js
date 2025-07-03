document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;
    const errorElem = document.getElementById("error");
    errorElem.textContent = "";
  
    // Prepare Basic Auth header, btoa- binary to Ascii that encodes a string into Base64 format.
    const credentials = btoa(`${identifier}:${password}`);
  
    try {
      const response = await fetch("https://learn.zone01kisumu.ke/api/auth/signin", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
  
      const jwt = await response.text();
      // Store the JWT in localStorage for later GraphQL calls
      localStorage.setItem("jwt", jwt);
      window.location.href = "profile.html";
    } catch (err) {
     // On error, display the error message in the <p id="error"> element
      errorElem.textContent = err.message || "Login failed";
    }
  });
  
  function logout() {
    localStorage.removeItem("jwt");
    window.location.href = "login.html";
  }
  