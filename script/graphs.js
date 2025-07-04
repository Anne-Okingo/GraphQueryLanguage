function drawXPOverTime(transactions, targetId = "graph1") {
  const svgNS = "http://www.w3.org/2000/svg";
  const width = 500, height = 200, padding = 40;
  if (!transactions || transactions.length === 0) return;
  // Sort by date
  const sorted = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  // Cumulative XP
  let total = 0;
  const points = sorted.map((tx, i) => {
    total += tx.amount;
    return {
      x: padding + i * ((width - 2 * padding) / (sorted.length - 1)),
      y: height - padding - (total / Math.max(...sorted.map((t, idx) => sorted.slice(0, idx + 1).reduce((acc, t) => acc + t.amount, 0))) * (height - 2 * padding)),
      label: new Date(tx.createdAt).toLocaleDateString(),
      value: total
    };
  });
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  // Area under line
  let areaPath = `M${points[0].x},${height - padding}`;
  points.forEach(p => areaPath += ` L${p.x},${p.y}`);
  areaPath += ` L${points[points.length - 1].x},${height - padding} Z`;
  const area = document.createElementNS(svgNS, "path");
  area.setAttribute("d", areaPath);
  area.setAttribute("fill", "#2d8cf033");
  svg.appendChild(area);
  // Line
  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) path += ` L${points[i].x},${points[i].y}`;
  const line = document.createElementNS(svgNS, "path");
  line.setAttribute("d", path);
  line.setAttribute("stroke", "#2d8cf0");
  line.setAttribute("stroke-width", 3);
  line.setAttribute("fill", "none");
  svg.appendChild(line);
  // Dots
  points.forEach(p => {
    const dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx", p.x);
    dot.setAttribute("cy", p.y);
    dot.setAttribute("r", 4);
    dot.setAttribute("fill", "#2d8cf0");
    svg.appendChild(dot);
  });
  // Axes
  const xAxis = document.createElementNS(svgNS, "line");
  xAxis.setAttribute("x1", padding);
  xAxis.setAttribute("y1", height - padding);
  xAxis.setAttribute("x2", width - padding);
  xAxis.setAttribute("y2", height - padding);
  xAxis.setAttribute("stroke", "#bbb");
  xAxis.setAttribute("stroke-width", 2);
  svg.appendChild(xAxis);
  const yAxis = document.createElementNS(svgNS, "line");
  yAxis.setAttribute("x1", padding);
  yAxis.setAttribute("y1", padding);
  yAxis.setAttribute("x2", padding);
  yAxis.setAttribute("y2", height - padding);
  yAxis.setAttribute("stroke", "#bbb");
  yAxis.setAttribute("stroke-width", 2);
  svg.appendChild(yAxis);
  // Labels (first, last)
  [0, points.length - 1].forEach(i => {
    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", points[i].x);
    label.setAttribute("y", height - padding + 18);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "12");
    label.setAttribute("fill", "#888");
    label.textContent = points[i].label;
    svg.appendChild(label);
  });
  document.getElementById(targetId).innerHTML = '';
  document.getElementById(targetId).appendChild(svg);
}

function drawXPByProject(xpByProject, targetId = "graph2") {
  const svgNS = "http://www.w3.org/2000/svg";
  const width = 500, height = 220, padding = 50;
  const projects = Object.keys(xpByProject);
  if (!projects.length) return;
  const maxXP = Math.max(...Object.values(xpByProject));
  const barWidth = (width - 2 * padding) / projects.length * 0.7;
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  projects.forEach((project, i) => {
    const x = padding + i * ((width - 2 * padding) / projects.length) + 10;
    const barHeight = (xpByProject[project] / maxXP) * (height - 2 * padding);
    const y = height - padding - barHeight;
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("fill", "#f7b731");
    svg.appendChild(rect);
    // XP label
    const xpLabel = document.createElementNS(svgNS, "text");
    xpLabel.setAttribute("x", x + barWidth / 2);
    xpLabel.setAttribute("y", y - 8);
    xpLabel.setAttribute("text-anchor", "middle");
    xpLabel.setAttribute("font-size", "12");
    xpLabel.setAttribute("fill", "#888");
    xpLabel.textContent = xpByProject[project];
    svg.appendChild(xpLabel);
    // Project label
    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", x + barWidth / 2);
    label.setAttribute("y", height - padding + 18);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "12");
    label.setAttribute("fill", "#888");
    label.textContent = project;
    svg.appendChild(label);
  });
  // Axes
  const xAxis = document.createElementNS(svgNS, "line");
  xAxis.setAttribute("x1", padding);
  xAxis.setAttribute("y1", height - padding);
  xAxis.setAttribute("x2", width - padding);
  xAxis.setAttribute("y2", height - padding);
  xAxis.setAttribute("stroke", "#bbb");
  xAxis.setAttribute("stroke-width", 2);
  svg.appendChild(xAxis);
  const yAxis = document.createElementNS(svgNS, "line");
  yAxis.setAttribute("x1", padding);
  yAxis.setAttribute("y1", padding);
  yAxis.setAttribute("x2", padding);
  yAxis.setAttribute("y2", height - padding);
  yAxis.setAttribute("stroke", "#bbb");
  yAxis.setAttribute("stroke-width", 2);
  svg.appendChild(yAxis);
  document.getElementById(targetId).innerHTML = '';
  document.getElementById(targetId).appendChild(svg);
}

function drawPassFailPie(pass, fail, targetId = "graph3") {
  const svgNS = "http://www.w3.org/2000/svg";
  const width = 220, height = 220, radius = 80;
  const total = pass + fail;
  if (total === 0) return;
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  // Pie slices
  const passAngle = (pass / total) * 2 * Math.PI;
  const failAngle = (fail / total) * 2 * Math.PI;
  // Pass slice
  const x1 = width / 2 + radius * Math.cos(-Math.PI / 2);
  const y1 = height / 2 + radius * Math.sin(-Math.PI / 2);
  const x2 = width / 2 + radius * Math.cos(passAngle - Math.PI / 2);
  const y2 = height / 2 + radius * Math.sin(passAngle - Math.PI / 2);
  const largeArc = pass / total > 0.5 ? 1 : 0;
  const passPath = `M${width / 2},${height / 2} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
  const passSlice = document.createElementNS(svgNS, "path");
  passSlice.setAttribute("d", passPath);
  passSlice.setAttribute("fill", "#27ae60");
  svg.appendChild(passSlice);
  // Fail slice
  const x3 = width / 2 + radius * Math.cos(passAngle - Math.PI / 2);
  const y3 = height / 2 + radius * Math.sin(passAngle - Math.PI / 2);
  const x4 = width / 2 + radius * Math.cos(2 * Math.PI - Math.PI / 2);
  const y4 = height / 2 + radius * Math.sin(2 * Math.PI - Math.PI / 2);
  const largeArc2 = fail / total > 0.5 ? 1 : 0;
  const failPath = `M${width / 2},${height / 2} L${x3},${y3} A${radius},${radius} 0 ${largeArc2} 1 ${x4},${y4} Z`;
  const failSlice = document.createElementNS(svgNS, "path");
  failSlice.setAttribute("d", failPath);
  failSlice.setAttribute("fill", "#e74c3c");
  svg.appendChild(failSlice);
  // Center circle for donut effect
  const center = document.createElementNS(svgNS, "circle");
  center.setAttribute("cx", width / 2);
  center.setAttribute("cy", height / 2);
  center.setAttribute("r", radius * 0.55);
  center.setAttribute("fill", "#fff");
  svg.appendChild(center);
  // Labels
  const passLabel = document.createElementNS(svgNS, "text");
  passLabel.setAttribute("x", width / 2);
  passLabel.setAttribute("y", height / 2 - 10);
  passLabel.setAttribute("text-anchor", "middle");
  passLabel.setAttribute("font-size", "1.2em");
  passLabel.setAttribute("fill", "#27ae60");
  passLabel.textContent = `Pass: ${pass}`;
  svg.appendChild(passLabel);
  const failLabel = document.createElementNS(svgNS, "text");
  failLabel.setAttribute("x", width / 2);
  failLabel.setAttribute("y", height / 2 + 24);
  failLabel.setAttribute("text-anchor", "middle");
  failLabel.setAttribute("font-size", "1.2em");
  failLabel.setAttribute("fill", "#e74c3c");
  failLabel.textContent = `Fail: ${fail}`;
  svg.appendChild(failLabel);
  document.getElementById(targetId).innerHTML = '';
  document.getElementById(targetId).appendChild(svg);
}
