var c, ctx;

const drawGrid = draw => {
  if (draw) {
    ctx.save();
    ctx.translate(-cfg.cScreen.w / 2, -cfg.cScreen.h / 2);
    let scrw = cfg.cScreen.w;
    let scrh = cfg.cScreen.h;

    drawTapeMeasure();

    ctx.lineWidth = cfg.lineWidth / 2;
    for (
      let i = 1, j = 1;
      i < scrw;
      i += cfg.grid.unit[0], j += cfg.grid.unit[1]
    ) {
      line(Math.floor(i), 0, Math.floor(i), scrh);
      line(0, Math.floor(i), scrw, Math.floor(i));
    }
    ctx.lineWidth = cfg.lineWidth;
    ctx.restore();
  }
};

const drawTapeMeasure = () => {
  let scrw = cfg.cScreen.w;
  let scrh = cfg.cScreen.h;
  let iInc = Math.floor(cfg.grid.unit[0] / cfg.grid.seconds);
  let jInc = Math.floor(cfg.grid.unit[1] / cfg.grid.seconds);

  line(cfg.grid.width, cfg.grid.width, scrw - cfg.grid.width, cfg.grid.width);
  line(
    cfg.grid.width,
    cfg.grid.width + 5,
    scrw - cfg.grid.width,
    cfg.grid.width + 5
  );

  line(
    cfg.grid.width,
    scrh - cfg.grid.width,
    scrw - cfg.grid.width,
    scrh - cfg.grid.width
  );
  line(
    cfg.grid.width,
    scrh - cfg.grid.width - 5,
    scrw - cfg.grid.width,
    scrh - cfg.grid.width - 5
  );

  line(cfg.grid.width, cfg.grid.width, cfg.grid.width, scrh - cfg.grid.width);
  line(
    cfg.grid.width + 5,
    cfg.grid.width,
    cfg.grid.width + 5,
    scrh - cfg.grid.width
  );

  line(
    scrw - cfg.grid.width,
    cfg.grid.width,
    scrw - cfg.grid.width,
    scrh - cfg.grid.width
  );
  line(
    scrw - cfg.grid.width - 5,
    cfg.grid.width,
    scrw - cfg.grid.width - 5,
    scrh - cfg.grid.width
  );

  for (let i = cfg.grid.width; i < scrw - cfg.grid.width; i += iInc) {
    line(i, 0, i, cfg.grid.width);
    line(i, scrh, i, scrh - cfg.grid.width);
    if (i < scrh - cfg.grid.width) {
      line(0, i, cfg.grid.width, i);
      line(scrw - cfg.grid.width, i, scrw, i);
    }
  }
};

const renderNails = (radius, dotCount, squareSize) => {
  squareSize *= s.scale;
  radius *= s.scale;
  for (let i = 0; i < Math.PI * 2; i += Math.PI / dotCount) {
    let randomFactor =
      cfg.nodeSetup.seed[Math.floor((1000000 / (Math.PI * 2)) * i)];
    nail(
      0,
      0,
      Math.sqrt(randomFactor) * radius,
      i, //angle
      (squareSize * 2 - randomFactor) / 2, //squareSize
      (squareSize * 2 - randomFactor) / 3
    ); //spraySize
  }
};

const prepGlobe = i => {
  const thisGlobe = cfg.globeSetup.specs[Math.floor(i)];
  let ang = getAngleHash(thisGlobe.rotation);
  let ang2 = getAngleHash(Math.PI * 2 - thisGlobe.rotation);
  let cord = cfg.text.y[i * 2];
  let cord2 = cfg.text.y[i * 2 + 1];

  ctx.save();
  ctx.rotate(thisGlobe.rotation);
  line(0, -cfg.cScreen.edge, 0, -cfg.orbitals.maxRadius * s.scale);
  line(0, cfg.cScreen.edge, 0, cfg.orbitals.maxRadius * s.scale);

  ctx.save();
  ctx.translate(0, cord * s.scale);
  ctx.fillText(ang, 0, 0);
  ctx.restore();
  ctx.save();
  ctx.translate(0, -cord2 * s.scale);
  ctx.rotate(Math.PI);
  ctx.fillText(ang2, 0, 0);
  ctx.restore();
  globe(0, 0, i, thisGlobe.slices);
  ctx.restore();
};

const drawBackgroundElements = () => {
  ctx.save();
  ctx.lineWidth = cfg.lineWidth;

  drawGrid(cfg.grid.visible);

  for (let ring of cfg.orbitals.metrics) {
    arc(0, 0, ring.radius, ring.notch, ring.nodes);
  }
  // smaller off-center
  radArc(cfg.arc.angle[0], cfg.arc.distance.near[69], [30, 50, 60, 160], 0);
  radArc(cfg.arc.angle[0], cfg.arc.distance.near[69], [40, 140], 0);
  radArc(cfg.arc.angle[1], cfg.arc.distance.near[0], [15, 20, 25, 30], 0);

  let dist = cfg.arc.distance.near[1];
  ctx.save();
  ctx.rotate(cfg.arc.angle[100]);
  radArc(cfg.arc.angle[2], dist, [15], 0);
  ctx.restore();
  for (let u = 0; u < 5; u++) {
    let size = cfg.arc.size.small[u];
    radArc(cfg.arc.angle[2], dist, size, 0);
    if (cfg.coin[u]) radArc(cfg.arc.angle[2], dist, size + 5, 0);

    dist += cfg.arc.distance.step[0];
  }

  // big solid off-center
  ctx.save();
  for (let k = 0; k < 4; k++) {
    let dist = cfg.arc.distance.far[k];
    let rad = dist * 0.6 + cfg.arc.size.big[k];
    let border = cfg.arc.border[k];
    ctx.rotate(cfg.arc.angle[2 + k]);
    arc(0, dist, rad, k == 0 ? 360 : false);
    arc(0, dist, rad - border, false, k == 0 ? 0 : cfg.arc.node[k]);
    if (cfg.coin[10 + k]) {
      arc(0, dist, rad - border + 5);
      arc(0, dist, rad - 5);
    }
  }
  ctx.restore();
  // giant dashed off-center
  ctx.setLineDash([10, 15]);
  ctx.lineWidth = cfg.lineWidth * 2;
  ctx.save();
  for (let k = 0; k < 4; k++) {
    let dist = cfg.arc.distance.further[k];
    let rad = dist * 0.6 + cfg.arc.size.big[10 + k];
    ctx.rotate(cfg.arc.angle[20 + k]);
    arc(0, dist, rad);
  }
  ctx.restore();
  ctx.restore();
};

const globe = (x, y, rad, frag) => {
  rad *= s.scale;
  let step = Math.max(Math.floor(rad / frag), 1);
  let h = 1;
  for (let yOff = -rad + step / 2; yOff < rad; yOff += step) {
    let w = Math.sqrt((rad - yOff) * (rad + yOff));
    ctx.beginPath();
    let corr = yOff * 0.0638;
    ctx.ellipse(x, y + yOff - corr, w, w * 0.3678, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
};

const nail = (x, y, len, ang, squareSize, spray) => {
  let w = squareSize / 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.beginPath();
  let sL = len * 0.8;
  let mL = len - sL;
  line(sL, 0, len, 0);
  for (let i = 1; i < spray; i++) {
    line(len, i, sL + mL * (i / spray), 0);
    line(len, -i, sL + mL * (i / spray), 0);
  }
  ctx.stroke();
  ctx.fillRect(len, -w, 2 * w, 2 * w);
  ctx.restore();
};

const comet2 = cometObj => {
  comet(
    cometObj.viewAngle,
    cometObj.distance,
    cometObj.radius,
    cometObj.tailLength,
    cometObj.nudge,
    cometObj.progress,
    cometObj.speed
  );
};

const comet = (
  viewAngle,
  distance,
  radius,
  tailLength,
  nudge,
  progress,
  speed
) => {
  distance *= s.scale;
  radius *= s.scale;
  tailLength *= s.scale;
  const size = cfg.nodeSetup.baseSize * s.scale;
  const startAngle = Math.PI * 2 * progress;
  let section = tailLength / radius / nudge;
  const ndg = size / nudge;
  progress = 1 - progress;
  ctx.save();
  ctx.rotate(viewAngle);
  ctx.translate(distance, 0);
  ctx.rotate(startAngle);
  if (speed < 0) ctx.rotate(tailLength / radius);
  for (let i = 0; i < nudge; i++) {
    ctx.lineWidth =
      cfg.lineWidth * (speed > 0 ? size - i * ndg : i * ndg) * 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, radius, i * section, section + section * i);
    ctx.stroke();
  }
  if (speed < 0) ctx.rotate(tailLength / radius);
  ctx.translate(radius, 0);
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.restore();
};

const arc = (x, y, radius, notch, node) => {
  x *= s.scale;
  y *= s.scale;
  radius *= s.scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(cfg.arc.angle[60 + cfg.arcCounter]);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  if (notch) {
    let start = cfg.arc.rotation[cfg.arcCounter],
      frag = typeof notch == "number" ? notch : cfg.stripe[cfg.arcCounter],
      step = (Math.PI * 2) / frag;
    for (let ang = start, j = 0; ang < Math.PI * 2 + start; ang += step, j++) {
      let inner = j % 15 != 0 ? 10 * s.scale : 20 * s.scale;
      let outer = j % 60 != 0 ? 0 : 10 * s.scale;
      drawNotch(radius, ang, inner, outer);
    }
  }
  if (node > 0) {
    ctx.save();
    let start = cfg.arc.rotation[cfg.arcCounter + 50];
    let part = (Math.PI * 2) / node;
    ctx.rotate(start);
    let nodeSize = cfg.nodeSetup.baseSize * s.scale;
    for (let l = 0; l < node; l++) {
      ctx.fillRect(-nodeSize / 2, radius - nodeSize / 2, nodeSize, nodeSize);
      ctx.rotate(part);
    }
    ctx.restore();
  }
  ctx.restore();
  cfg.arcCounter++;
};

const radArc = (angle, distance, radius, node) => {
  ctx.save();
  ctx.rotate(angle);
  if (!Array.isArray(radius)) {
    radius = [radius];
  }
  for (let tempRad of radius) {
    arc(0, distance, tempRad, false, node);
  }
  ctx.restore();
};

const getAngleHash = N => {
  let x = Math.floor(N * (180 / Math.PI) * 100000) / 100000;
  let retval = "" + x;
  retval = retval.replace(/[\,\.]/g, "");
  retval = retval.substr(0, 5);
  return retval;
};

const line = (x1, y1, x2, y2) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

const drawNotch = (rad, ang, inner, outer) => {
  ctx.save();
  ctx.beginPath();
  ctx.rotate(ang);
  line(rad - inner, 0, rad + outer, 0);
  ctx.stroke();
  ctx.restore();
};

const clearScreen = () => {
  ctx.clearRect(0, 0, cfg.cScreen.w, cfg.cScreen.h);
};

const centerPivot = () => {
  ctx.translate(scr.w / 2, scr.h / 2);
};
