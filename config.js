var s = {
  scale: 1.6,
  moonAngle: Math.PI * 2 * Math.random()
};

var cfg = {
  fps: 40,
  gridDensity: 15,
  speed: 1,
  font: { size: 8 * s.scale, type: "Consolas" },
  lineWidth: 0.5 * (s.scale / 2),
  cScreen: {},
  color: {
    stroke: "rgba(255,255,255,0.2)",
    fill: "rgba(255,255,255,0.5)",
    blue: "rgb(19,59,94)",
    green: "rgb(61,115,99)"
  },
  globeSetup: {
    size: 220,
    forSet: [30, 10, 10],
    specs: []
  },
  nodeSetup: {
    seed: [],
    baseSize: 6,
    groups: [
      {
        size: 30,
        nodeCount: 40,
        nodeSize: 2,
        scale: 1,
        minScale: 0.9,
        maxScale: 1.27,
        growth: 0.0006,
        rotation: 0,
        spin: Math.PI / 9000,
        isGrowing: true
      },
      {
        size: 40,
        nodeCount: 50,
        nodeSize: 3,
        scale: 1.2,
        minScale: 0.92,
        maxScale: 1.37,
        growth: 0.0005,
        rotation: Math.PI / 3,
        spin: -Math.PI / 10000,
        isGrowing: false
      },
      {
        size: 45,
        nodeCount: 320,
        nodeSize: 4,
        scale: 1,
        minScale: 0.94,
        maxScale: 1.29,
        growth: 0.0008,
        rotation: 0,
        spin: Math.PI / 7000,
        isGrowing: true
      },
      {
        size: 50,
        nodeCount: 360,
        nodeSize: 4,
        scale: 1.1,
        minScale: 0.8,
        maxScale: 1.1,
        growth: 0.0003,
        rotation: Math.PI / 2,
        spin: -Math.PI / 12000,
        isGrowing: false
      }
    ]
  },
  orbitals: {
    metrics: [
      { radius: 155, notch: 0, nodes: 0 },
      { radius: 200, notch: 180, nodes: 0 },
      { radius: 205, notch: 0, nodes: 0 },
      { radius: 300, notch: 60, nodes: 0 },
      { radius: 302, notch: 0, nodes: 0 },
      { radius: 305, notch: 0, nodes: 3 },
      { radius: 310, notch: 0, nodes: 1 },
      { radius: 315, notch: 0, nodes: 1 },
      { radius: 320, notch: 0, nodes: 1 },
      { radius: 325, notch: 0, nodes: 1 },
      { radius: 335, notch: 0, nodes: 0 },
      { radius: 337, notch: 0, nodes: 0 },
      { radius: 339, notch: 0, nodes: 0 }
    ],
    maxRadius: 0
  },
  comet: [
    {
      viewAngle: (Math.PI * 3) / 5,
      spin: -Math.PI * 0.00025,
      distance: 7200,
      radius: 7500,
      tailLength: 200,
      nudge: 13,
      progress: 0.9,
      speed: 0.0015
    },
    {
      viewAngle: Math.PI * 1.25,
      spin: Math.PI * 0.00033,
      distance: 3600,
      radius: 3900,
      tailLength: 250,
      nudge: 6,
      progress: 0.05,
      speed: -0.001
    },
    // orbital mooned moon
    {
      viewAngle: s.moonAngle,
      spin: Math.PI * 0.00015,
      distance: 335,
      radius: 100,
      tailLength: 800,
      nudge: 32,
      progress: 0.05,
      speed: -0.0005
    },
    {
      viewAngle: s.moonAngle,
      spin: Math.PI * 0.00015,
      distance: 337,
      radius: 2,
      tailLength: 120,
      nudge: 16,
      progress: 0.62,
      speed: 0
    }
  ],
  arc: {
    arcCounter: 0,
    angle: [],
    distance: {
      step: [],
      near: [],
      far: [],
      further: []
    },
    border: [],
    node: [],
    size: {
      small: [],
      big: []
    },
    rotation: []
  },
  text: { y: [] },
  coin: [],
  rnd: [],
  nailSeed: [],
  grid: {
    visible: true,
    dash: [0],
    width: 25,
    resolution: 16,
    seconds: 20,
    unit: [100, 100]
  }
};

const setScreen = elemId => {
  c = document.getElementById(elemId);
  cfg.cScreen = {};
  cfg.cScreen["w"] = c.getAttribute("width");
  cfg.cScreen["h"] = c.getAttribute("height");
  cfg.cScreen["width"] = c.getAttribute("width");
  cfg.cScreen["height"] = c.getAttribute("height");
  cfg.cScreen["edge"] = Math.max(cfg.cScreen.h, cfg.cScreen.w) * 2;
  cfg.grid.unit = [
    cfg.cScreen.w / cfg.grid.resolution,
    cfg.cScreen.h / cfg.grid.resolution
  ];
};

const prepRandomSeeds = () => {
  //"tűk" véletlen seedjei
  cfg.nodeSetup.seed = Array.from({ length: 1000000 }, () => Math.random() * 8);

  cfg.globeSetup.specs = Array.from({ length: 10000 }, (n, i) => {
    return {
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.PI / 36000) * (5 - 10 * Math.random()),
      slices: 20,
      spinner: () => {
        this.rotation += this.spin;
      }
    };
  });
  cfg.coin = Array.from({ length: 10000 }, () => Math.random() > 0.5);
  // coordTxt-k magasság seedjei
  cfg.text.y = Array.from({ length: 10000 }, () =>
    Math.floor(400 + Math.random() * 200)
  );
  // arc-ok látőszög seedje
  cfg.arc.angle = Array.from(
    { length: 200 },
    () => Math.PI * Math.random() * 2
  );
  cfg.arc.rotation = Array.from(
    { length: 200 },
    () => Math.PI * Math.random() * 2
  );
  // arc-ok távolság seedje
  cfg.arc.distance.step = Array.from(
    { length: 200 },
    () => 10 + Math.floor(Math.random() * 7) * 2
  );

  cfg.arc.distance.near = Array.from(
    { length: 200 },
    () => 300 + Math.floor(Math.random() * 7) * 20
  );

  cfg.arc.distance.far = Array.from({ length: 200 }, () =>
    Math.floor(500 + Math.random() * 13 * 30)
  );

  cfg.arc.distance.further = Array.from({ length: 200 }, () =>
    Math.floor(600 + Math.random() * 13 * 60)
  );

  cfg.arc.size.small = Array.from(
    { length: 200 },
    () => Math.floor(2 + Math.random() * 6) * 2
  );

  cfg.arc.size.big = Array.from(
    { length: 200 },
    () => 60 + Math.floor(Math.random() * 7) * 60
  );

  cfg.arc.border = Array.from(
    { length: 200 },
    () => 3 + Math.floor(Math.random() * 6)
  );

  cfg.arc.node = Array.from(
    { length: 1200 },
    () => 1 + Math.floor(Math.random() * 3)
  );

  cfg.rnd = Array.from({ length: 1000 }, () => Math.random());

  cfg["stripe"] = Array.from(
    { length: 200 },
    () => 4 + Math.floor(Math.random() * 8)
  );
};
