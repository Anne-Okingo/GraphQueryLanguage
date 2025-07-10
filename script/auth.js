
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const identifier = document.getElementById("identifier").value.trim();
    const password = document.getElementById("password").value;
    const errorElem = document.getElementById("error");
    errorElem.textContent = "";

    if (!identifier || !password) {
      errorElem.textContent = "Please enter both username/email and password.";
      return;
    }

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
        const errorText = await response.text();
        throw new Error(errorText || "Invalid credentials");
      }

      let jwt = await response.text();
      jwt = jwt.replace(/^"|"$/g, "");
      localStorage.setItem("jwt", jwt);

      window.location.href = "profile.html";
    } catch (err) {
      console.error("Login error:", err);
      errorElem.textContent = err.message || "Login failed. Please try again.";
    }
  });
}

const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');
if (togglePassword && passwordInput && eyeIcon) {
  togglePassword.addEventListener('click', function () {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.textContent = isPassword ? '🙈' : '👁️';
    togglePassword.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
}
