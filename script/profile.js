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
          type: { _eq: "xp" },
           eventId: {_eq: 75},
        }) {
          amount
          createdAt
          path
        }
      }`, { userId: Number(userId) });
    const totalXP = xpData && xpData.transaction ? xpData.transaction.reduce((acc, t) => acc + t.amount, 0) : 0;
    const totalXP_MB = (totalXP / 1000000).toFixed(2);

    // Calculate XP earned in the last 30 days
    const now = new Date();
    const last30DaysXP = xpData && xpData.transaction ? xpData.transaction.filter(tx => {
      const txDate = new Date(tx.createdAt);
      return (now - txDate) / (1000 * 60 * 60 * 24) <= 30;
    }).reduce((acc, t) => acc + t.amount, 0) : 0;
    const last30DaysXP_MB = (last30DaysXP / 1048576).toFixed(2);

    // Fetch audit transactions
  // Fetch audit XP (up/down transactions)
const auditXPData = await queryGraphQL(`
  query GetAuditXP($userId: Int!) {
    transaction(
      where: {
        userId: { _eq: $userId }
        type: { _in: ["up", "down"] }
      }
    ) {
      type
      amount
    }
  }
`, { userId: Number(userId) });


const audits = auditXPData?.transaction || [];
const upAudits = audits.filter(a => a.type === 'up').reduce((sum, a) => sum + a.amount, 0);
const downAudits = audits.filter(a => a.type === 'down').reduce((sum, a) => sum + Math.abs(a.amount), 0);
const auditRatio = downAudits > 0 ? (upAudits / downAudits).toFixed(1) : upAudits.toFixed(1);


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
      <div class="stat-card"><div class="stat-label">Total XP</div><div class="stat-value">${totalXP_MB} MB</div></div>
      <div class="stat-card"><div class="stat-label">XP (Last 30d)</div><div class="stat-value">${last30DaysXP_MB} MB</div></div>
      <div class="stat-card"><div class="stat-label">Audits</div><div class="stat-value">${auditRatio}</div></div>
      <div class="stat-card"><div class="stat-label">Pass</div><div class="stat-value" style="color:var(--success)">${passCount}</div></div>
      <div class="stat-card"><div class="stat-label">Fail</div><div class="stat-value" style="color:var(--danger)">${failCount}</div></div>
    `;

    // XP by project
    const xpByProject = {};
    if (xpData && xpData.transaction) {
      xpData.transaction.forEach(tx => {
        const parts = tx.path.split('/');
        const project = parts[3] || 'Unknown'; // Adjust if needed
        xpByProject[project] = (xpByProject[project] || 0) + tx.amount;
      });
    }

    // Draw Chart.js graphs
    if (xpData && xpData.transaction) drawXPOverTime(xpData.transaction, "xpOverTimeChart");
    if (Object.keys(xpByProject).length > 0) drawXPByProject(xpByProject, "xpByProjectChart");
    if (grades.length > 0) drawPassFailPie(passCount, failCount, "passFailChart");
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