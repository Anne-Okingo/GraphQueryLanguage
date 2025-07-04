function drawXPOverTime(transactions) {
  const svgNS = "http://www.w3.org/2000/svg";
  const width = 400, height = 200;
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.style.width = "100%";

  const points = transactions.map((tx, i) => ({
    x: i * (width / transactions.length),
    y: height - tx.amount / 100
  }));

  for (let i = 0; i < points.length - 1; i++) {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", points[i].x);
    line.setAttribute("y1", points[i].y);
    line.setAttribute("x2", points[i + 1].x);
    line.setAttribute("y2", points[i + 1].y);
    line.setAttribute("stroke", "blue");
    svg.appendChild(line);
  }

  document.getElementById("graph1").appendChild(svg);
}

async function drawPassFailRatio(userId) {
  const progressData = await queryGraphQL(`
    query ($userId: Int!) {
      progress(where: { userId: { _eq: $userId }}) {
        grade
      }
    }`, { userId });

  const pass = progressData.progress.filter(p => p.grade === 1).length;
  const fail = progressData.progress.filter(p => p.grade === 0).length;
  const total = pass + fail;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", 200);
  svg.setAttribute("height", 200);

  const circle1 = document.createElementNS(svg.namespaceURI, "circle");
  circle1.setAttribute("r", radius);
  circle1.setAttribute("cx", 100);
  circle1.setAttribute("cy", 100);
  circle1.setAttribute("fill", "none");
  circle1.setAttribute("stroke", "red");
  circle1.setAttribute("stroke-width", 20);
  svg.appendChild(circle1);

  const circle2 = document.createElementNS(svg.namespaceURI, "circle");
  circle2.setAttribute("r", radius);
  circle2.setAttribute("cx", 100);
  circle2.setAttribute("cy", 100);
  circle2.setAttribute("fill", "none");
  circle2.setAttribute("stroke", "green");
  circle2.setAttribute("stroke-width", 20);
  circle2.setAttribute("stroke-dasharray", `${(pass / total) * circumference} ${circumference}`);
  circle2.setAttribute("transform", "rotate(-90 100 100)");
  svg.appendChild(circle2);

  document.getElementById("graph2").appendChild(svg);
}
