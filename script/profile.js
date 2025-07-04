(async function () {
    const jwt = localStorage.getItem("jwt");
    console.log("JWT:", jwt);

    if (!jwt){
      console.warn("No JWT found, redirecting to login...")
      return window.location.href = "login.html";
    } 
  
    const userInfo = parseJWT(jwt);
  console.log("Parsed JWT:", userInfo);

  const userId = userInfo.userId;
  if (!userId) {
    console.error("User ID not found in JWT, redirecting to login...");
    return window.location.href = "login.html";
  }

  
    // Show loading state
    document.getElementById("userInfo").innerHTML = '<p>Loading...</p>';
  
    try {
        // Fetch user info
        const userData = await queryGraphQL(`{
          user {
            id
            login
          }
        }`);
  
        // Defensive check for userData.user
        if (!userData || !userData.user || !userData.user[0]) {
          throw new Error('User data not found. Please log in again.');
        }
  
        // Fetch XP transactions
        const xpData = await queryGraphQL(`
          query GetXP($userId: Int!) {
            transaction(where: {
              userId: { _eq: $userId },
              type: { _eq: "xp" }
            }) {
              amount
              createdAt
              path
            }
          }`, { userId });
  
        // Fetch audit transactions
        const auditData = await queryGraphQL(`
          query GetAudits($userId: Int!) {
            transaction(where: {
              userId: { _eq: $userId },
              type: { _eq: "audit" }
            }) {
              id
            }
          }`, { userId });
  
        // Display user info
        document.getElementById("userInfo").innerHTML = `
          <p><strong>Login:</strong> ${userData.user[0].login}</p>
          <p><strong>Total XP:</strong> ${xpData && xpData.transaction ? xpData.transaction.reduce((acc, t) => acc + t.amount, 0) : 0}</p>
          <p><strong>Audit Count:</strong> ${auditData && auditData.transaction ? auditData.transaction.length : 0}</p>
        `;
  
        // Draw SVG graphs
        if (xpData && xpData.transaction) drawXPOverTime(xpData.transaction);
        if (userId) drawPassFailRatio(userId);
    } catch (err) {
        document.getElementById("userInfo").innerHTML = `<p style='color:red;'>Failed to load profile: ${err.message}</p>`;
    }
})();

// Logout function for button in profile.html
function logout() {
  localStorage.removeItem('jwt');
  window.location.href = 'login.html';
}
  