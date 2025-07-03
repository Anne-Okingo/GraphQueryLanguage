(async function () {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return window.location.href = "login.html";
  
    const userId = parseJWT(jwt).userId;
  
    const userData = await queryGraphQL(`{
      user {
        id
        login
      }
    }`);
  
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
  
    document.getElementById("userInfo").innerHTML = `
      <p><strong>Login:</strong> ${userData.user[0].login}</p>
      <p><strong>Total XP:</strong> ${xpData.transaction.reduce((acc, t) => acc + t.amount, 0)}</p>
    `;
  
    drawXPOverTime(xpData.transaction);
    drawPassFailRatio(userId);
  })();
  