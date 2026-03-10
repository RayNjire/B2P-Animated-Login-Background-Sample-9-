(() => {
  const svgns = "http://www.w3.org/2000/svg";
  const originalGroup = document.getElementById("network-original");
  const nodesGroup = document.getElementById("nodes");

  if (!originalGroup || !nodesGroup) return;

  const polylines = Array.from(originalGroup.querySelectorAll("polyline"));
  if (!polylines.length) return;

  // Helper randoms
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  polylines.forEach((pl, i) => {
    // Ensure id for <use> references
    if (!pl.id) pl.id = `wirePath_${i}`;

    // Create wrapper group .wire and move the polyline into it
    const g = document.createElementNS(svgns, "g");
    g.setAttribute("class", "wire");
    originalGroup.insertBefore(g, pl);
    g.appendChild(pl);

    // Base class (original path stays as-is, just styled)
    pl.classList.add("baseLine");

    // Per-wire drift + flow variability
    g.style.setProperty("--dx", `${rand(-1.6, 1.6).toFixed(2)}px`);
    g.style.setProperty("--dy", `${rand(-1.2, 1.2).toFixed(2)}px`);
    g.style.setProperty("--driftDur", `${rand(18, 40).toFixed(1)}s`);
    g.style.setProperty("--driftDelay", `${rand(-18, 0).toFixed(1)}s`);

    // Glow clones
    const glowB = document.createElementNS(svgns, "use");
    glowB.setAttribute("href", `#${pl.id}`);
    glowB.setAttribute("class", "glowLine glowB");
    g.appendChild(glowB);

    const glowA = document.createElementNS(svgns, "use");
    glowA.setAttribute("href", `#${pl.id}`);
    glowA.setAttribute("class", "glowLine glowA");
    g.appendChild(glowA);

    // Flow clones (pulses)
    const flowA = document.createElementNS(svgns, "use");
    flowA.setAttribute("href", `#${pl.id}`);
    flowA.setAttribute("class", "flowLine flowA");
    g.appendChild(flowA);

    const flowB = document.createElementNS(svgns, "use");
    flowB.setAttribute("href", `#${pl.id}`);
    flowB.setAttribute("class", "flowLine flowB");
    g.appendChild(flowB);

    // Randomize dash “packet” sizes and speeds (per wire)
    g.style.setProperty("--dash", `${Math.floor(rand(8, 18))}`);
    g.style.setProperty("--gap", `${Math.floor(rand(50, 120))}`);
    g.style.setProperty("--flowDur", `${rand(3.4, 8.5).toFixed(2)}s`);
    g.style.setProperty("--flowDelay", `${rand(-8, 0).toFixed(2)}s`);

    g.style.setProperty("--dash2", `${Math.floor(rand(5, 12))}`);
    g.style.setProperty("--gap2", `${Math.floor(rand(90, 170))}`);
    g.style.setProperty("--flowDur2", `${rand(6.5, 14.0).toFixed(2)}s`);
    g.style.setProperty("--flowDelay2", `${rand(-10, 0).toFixed(2)}s`);

    // Generate occasional node flashes from vertices
    const pts = (pl.getAttribute("points") || "").trim();
    if (!pts) return;

    const list = pts
      .split(/\s+/)
      .map((p) => p.split(",").map(Number))
      .filter((a) => a.length === 2 && isFinite(a[0]) && isFinite(a[1]));
    const vertexStep = pick([2, 3, 4]);
    const probability = 0.45;

    for (let k = 0; k < list.length; k += vertexStep) {
      if (Math.random() > probability) continue;

      const [x, y] = list[k];
      const c = document.createElementNS(svgns, "circle");
      c.setAttribute("class", "node");
      c.setAttribute("cx", x);
      c.setAttribute("cy", y);
      c.setAttribute("r", rand(1.2, 2.2).toFixed(2));

      c.style.setProperty("--nodeDur", `${rand(2.8, 5.8).toFixed(2)}s`);
      c.style.setProperty("--nodeDelay", `${rand(-6, 0).toFixed(2)}s`);
      nodesGroup.appendChild(c);
    }
  });
})();