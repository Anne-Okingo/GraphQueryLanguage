function drawXPOverTime(transactions, targetId = "xpOverTimeChart") {
  if (!transactions || transactions.length === 0) return;
  // Sort by date
  const sorted = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  let total = 0;
  const labels = sorted.map(tx => new Date(tx.createdAt).toLocaleDateString());
  const data = sorted.map(tx => {
    total += tx.amount;
    return (total / 1048576).toFixed(2); // MB
  });
  const ctx = document.getElementById(targetId).getContext('2d');
  if (window.xpOverTimeChartInstance) window.xpOverTimeChartInstance.destroy();
  window.xpOverTimeChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Cumulative XP (MB)',
        data,
        fill: true,
        borderColor: '#2d8cf0',
        backgroundColor: 'rgba(45,140,240,0.1)',
        pointBackgroundColor: '#2d8cf0',
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: { title: { display: true, text: 'Date' } },
        y: { title: { display: true, text: 'XP (MB)' }, beginAtZero: true }
      }
    }
  });
}

function drawXPByProject(xpByProject, targetId = "xpByProjectChart") {
  if (!xpByProject || Object.keys(xpByProject).length === 0) return;
  const labels = Object.keys(xpByProject);
  const data = labels.map(project => (xpByProject[project] / 1048576).toFixed(2)); // MB
  const ctx = document.getElementById(targetId).getContext('2d');
  if (window.xpByProjectChartInstance) window.xpByProjectChartInstance.destroy();
  window.xpByProjectChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'XP (MB)',
        data,
        backgroundColor: '#f7b731',
        borderRadius: 8,
        maxBarThickness: 32,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: { title: { display: true, text: 'XP (MB)' }, beginAtZero: true },
        y: { title: { display: true, text: 'Project' } }
      }
    }
  });
}

function drawProjectStatusPie(pass, fail, targetId = "passFailChart") {
  const ctx = document.getElementById(targetId).getContext('2d');
  if (window.passFailChartInstance) window.passFailChartInstance.destroy();
  window.passFailChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['completed', 'Opened'],
      datasets: [{
        data: [pass, fail],
        backgroundColor: ['#27ae60', '#e74c3c'],
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true }
      },
      cutout: '60%',
    }
  });
}

function drawSortedXPBar(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const maxMB = Math.max(...data.map(d => parseFloat(d.mb)));

  const barsHtml = data.map(d => {
    const width = (parseFloat(d.mb) / maxMB) * 100;
    return `
      <div style="margin-bottom:8px;">
        <div style="font-size:14px; margin-bottom:4px;">${d.project} (${d.mb} MB)</div>
        <div style="background:#eee; border-radius:4px;">
          <div style="background:#007bff; height:20px; width:${width}%; border-radius:4px;"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <h4 style="margin-top:20px;">XP by Project (Sorted)</h4>
    ${barsHtml}
  `;
}
