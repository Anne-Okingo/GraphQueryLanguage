(async function () {
  //stores the jwt in a local storage for later use
    const jwt = localStorage.getItem("jwt");
    console.log("JWT:", jwt);

    if (!jwt){
      console.warn("No JWT found, redirecting to login...")
      return window.location.href = "login.html";
    } 
  
    const userInfo = parseJWT(jwt);
  console.log("Parsed JWT:", userInfo);

  // Use the correct field for user ID from JWT
  const userId = userInfo.userId || userInfo.id || userInfo.sub;
  if (!userId) {
    console.error("User ID not found in JWT, redirecting to login...");
     return window.location.href = "login.html";
  }

  
    // Show loading state
    document.getElementById("userInfo").innerHTML = '<p>Loading...</p>';
  
    try {
        // Fetch user info using userId
        const userData = await queryGraphQL(`
          query GetUser($userId: Int!) {
            user(where: { id: { _eq: $userId } }) {
              id
              login
            }
          }
        `, { userId: Number(userId) });
  
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
          }`, { userId: Number(userId) });
  
        // Fetch audit transactions
        const auditData = await queryGraphQL(`
          query GetAudits($userId: Int!) {
            transaction(where: {
              userId: { _eq: $userId },
              type: { _eq: "audit" }
            }) {
              id
            }
          }`, { userId: Number(userId) });
  
        // Display user info
        document.getElementById("userInfo").innerHTML = `
          <p><strong>Login:</strong> ${userData.user[0].login}</p>
          <p><strong>Total XP:</strong> ${xpData && xpData.transaction ? xpData.transaction.reduce((acc, t) => acc + t.amount, 0) : 0}</p>
          <p><strong>Audit Count:</strong> ${auditData && auditData.transaction ? auditData.transaction.length : 0}</p>
        `;
  
        // Draw SVG graphs
        if (xpData && xpData.transaction) drawXPOverTime(xpData.transaction);
        if (userId) drawPassFailRatio(Number(userId));
    } catch (err) {
        document.getElementById("userInfo").innerHTML = `<p style='color:red;'>Failed to load profile: ${err.message}</p>`;
    }
})();

// Logout function for button in profile.html
function logout() {
  localStorage.removeItem('jwt');
  window.location.href = 'login.html';
}
  