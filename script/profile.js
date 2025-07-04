(async function () {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) return window.location.href = "login.html";

  const userInfo = parseJWT(jwt);
  const userId = userInfo.userId || userInfo.id || userInfo.sub;
  if (!userId) return window.location.href = "login.html";

  console.log("Parsed JWT:", userInfo);
  console.log("Extracted userId:", userId);



  document.getElementById("userInfo").innerHTML = '<p>Loading...</p>';

  try {
    const userData = await queryGraphQL(`
      query GetUser($userId: Int!) {
        user(where: { id: { _eq: $userId } }) {
          id
          login
        }
      }`, { userId: Number(userId) });
  
    if (!userData || !userData.user || !Array.isArray(userData.user) || userData.user.length === 0) {
      console.error("Invalid userData response:", userData);
      throw new Error("User not found or invalid response.");
    }
  
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
  
    const auditData = await queryGraphQL(`
      query GetAudits($userId: Int!) {
        transaction(where: {
          userId: { _eq: $userId },
          type: { _eq: "audit" }
        }) {
          id
        }
      }`, { userId: Number(userId) });
  
    document.getElementById("userInfo").innerHTML = `
      <p><strong>Login:</strong> ${userData.user[0].login}</p>
      <p><strong>Total XP:</strong> ${xpData.transaction.reduce((acc, t) => acc + t.amount, 0)}</p>
      <p><strong>Audit Count:</strong> ${auditData.transaction.length}</p>
    `;
  
    drawXPOverTime(xpData.transaction);
    drawPassFailRatio(Number(userId));
  
  } catch (err) {
    console.error("Profile load error:", err);
    document.getElementById("userInfo").innerHTML = `<p style='color:red;'>Failed to load profile: ${err.message}</p>`;
  }
  
})();

function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "login.html";
}