(async function () {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) return window.location.href = "login.html";
  const userInfo = parseJWT(jwt);
  const userId = userInfo.userId || userInfo.id || userInfo.sub;
  if (!userId) return window.location.href = "login.html";

  // Show loading state
  document.getElementById("userInfo").innerHTML = '<p>Loading...</p>';
  document.getElementById("stats").innerHTML = '';
  document.getElementById("skills").innerHTML = '';
  document.getElementById("avatar").innerHTML = '';

  try {
    // Fetch user info
    const userData = await queryGraphQL(`
      query GetUser($userId: Int!) {
        user(where: { id: { _eq: $userId } }) {
          id
          login
        }
      }
    `, { userId: Number(userId) });
    if (!userData || !userData.user || !userData.user[0]) throw new Error('User data not found. Please log in again.');
    const login = userData.user[0].login;

    // Avatar: use first letter of login
    document.getElementById("avatar").textContent = login ? login[0].toUpperCase() : '?';

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
    const totalXP = xpData && xpData.transaction ? xpData.transaction.reduce((acc, t) => acc + t.amount, 0) : 0;

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
    const auditCount = auditData && auditData.transaction ? auditData.transaction.length : 0;

    // Fetch grades
    const gradesData = await queryGraphQL(`
      query GetGrades($userId: Int!) {
        progress(where: { userId: { _eq: $userId } }) {
          grade
          path
        }
      }
    `, { userId: Number(userId) });
    const grades = gradesData && gradesData.progress ? gradesData.progress : [];
    const passCount = grades.filter(g => g.grade === 1).length;
    const failCount = grades.filter(g => g.grade === 0).length;

    // XP by project
    const xpByProject = {};
    if (xpData && xpData.transaction) {
      xpData.transaction.forEach(tx => {
        const project = tx.path.split('/')[2] || 'Unknown';
        xpByProject[project] = (xpByProject[project] || 0) + tx.amount;
      });
    }

    // Skills (if available)
    let skillsHtml = '';
    if (userData.user[0].skills) {
      skillsHtml = `<span>Skills: ${userData.user[0].skills.join(', ')}</span>`;
    }
    document.getElementById("skills").innerHTML = skillsHtml;

    // User info
    document.getElementById("userInfo").innerHTML = `<h3>${login}</h3>`;

    // Stat cards
    document.getElementById("stats").innerHTML = `
      <div class="stat-card"><div class="stat-label">Total XP</div><div class="stat-value">${totalXP}</div></div>
      <div class="stat-card"><div class="stat-label">Audits</div><div class="stat-value">${auditCount}</div></div>
      <div class="stat-card"><div class="stat-label">Pass</div><div class="stat-value" style="color:var(--success)">${passCount}</div></div>
      <div class="stat-card"><div class="stat-label">Fail</div><div class="stat-value" style="color:var(--danger)">${failCount}</div></div>
    `;

    // Draw SVG graphs
    if (xpData && xpData.transaction) drawXPOverTime(xpData.transaction, "graph1");
    if (xpByProject && Object.keys(xpByProject).length > 0) drawXPByProject(xpByProject, "graph2");
    if (grades.length > 0) drawPassFailPie(passCount, failCount, "graph3");
  } catch (err) {
    document.getElementById("userInfo").innerHTML = `<p style='color:red;'>Failed to load profile: ${err.message}</p>`;
    document.getElementById("stats").innerHTML = '';
    document.getElementById("skills").innerHTML = '';
    document.getElementById("avatar").innerHTML = '';
  }
})();

function logout() {
  localStorage.removeItem('jwt');
  window.location.href = 'login.html';
}