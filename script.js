const tick = () => {
  cfg.arcCounter = 0;
  clearScreen();
  ctx.save();
  centerPivot();

  ctx.save();
  drawBackgroundElements();
  for (
    let i = cfg.globeSetup.forSet[0], n = cfg.globeSetup.forSet[1];
    i < cfg.globeSetup.size;
    i += n, n += cfg.globeSetup.forSet[2]
  ) {
    prepGlobe(i);
  }
  ctx.restore();

  for (let node of cfg.nodeSetup.groups) {
    ctx.save();
    ctx.rotate(node.rotation);
    renderNails(node.size * node.scale, node.nodeCount, node.nodeSize);
    ctx.restore();
    node.scale *= node.isGrowing
      ? 1 + node.growth * cfg.speed
      : 1 - node.growth * cfg.speed;
    if (node.scale < node.minScale || node.scale > node.maxScale) {
      node.isGrowing = !node.isGrowing;
    }
    node.rotation += node.spin;
  }
  ctx.save();
  cfg.comet.forEach(comet => comet2(comet));
  ctx.lineWidth = cfg.lineWidth;
  ctx.restore();
  ctx.restore();
  adjustSeeds();
};

var runStats = () => {
  cfg.orbitals.maxRadius = Math.max(...cfg.orbitals.metrics.map(e => e.radius));
};

const adjustSeeds = () => {
  cfg.arc.angle.forEach((v, i, arr) => {
    if (i > 0)
      arr[i] +=
        cfg.rnd[i] * (Math.PI / 16000) * (cfg.coin[i] ? 1 : -1) * cfg.speed;
  });
  cfg.globeSetup.specs.forEach(v => (v.rotation += v.spin * cfg.speed));
  cfg.comet.forEach(cmt => {
    cmt.progress -= cmt.speed;
    if (cmt.progress < 0) cmt.progress = 1;
    if (cmt.progress > 1) cmt.progress = 0;
    cmt.viewAngle += cmt.spin;
  });
};

var setupCanvas = () => {
  setScreen("canvas");
  ctx = c.getContext("2d");
  ctx.font = `${cfg.font.size}px ${cfg.font.type}`;
  scr = { w: c.width, h: c.height };
  ctx.lineWidth = cfg.lineWidth;
  ctx.strokeStyle = cfg.color.stroke;
  ctx.fillStyle = cfg.color.fill;
};

window.addEventListener("DOMContentLoaded", () => {
  prepRandomSeeds();
  runStats();
  setupCanvas();
  let innerCont = document.getElementById("innerContainer");
  let virtualHeight = cfg.cScreen.h * (screen.availWidth / cfg.cScreen.w);
  let scrollPos = (Math.abs(screen.availHeight - virtualHeight) / 2) | 0;
  console.log(scrollPos);
  innerCont.scrollTo(0, scrollPos);

  tick();
  /*setInterval(() => {
    requestAnimationFrame(tick);
  }, 1000 / cfg.fps);*/
});
