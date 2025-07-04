const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;
    const errorElem = document.getElementById("error");
    errorElem.textContent = "";

    const credentials = btoa(`${identifier}:${password}`);
    try {
      const response = await fetch("https://learn.zone01kisumu.ke/api/auth/signin", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Invalid credentials");

      const jwt = await response.text();
      localStorage.setItem("jwt", jwt);
      window.location.href = "profile.html";
    } catch (err) {
      errorElem.textContent = err.message || "Login failed";
    }
  });
}