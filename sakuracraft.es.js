var Ut = Object.defineProperty;
var Kt = (t, e, i) => e in t ? Ut(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var Tt = (t, e, i) => Kt(t, typeof e != "symbol" ? e + "" : e, i);
const Qt = `
<!-- SakuraCraft Game HTML Template -->
<!-- This file is inserted into the DOM when the game initializes -->

<div class="minecraft-overlay" id="minecraftGame">
  <div class="minecraft-title">🌸 SakuraCraft 🌸</div>
  <div class="minecraft-container">
    <button class="minecraft-close" id="closeMinecraft">✕ Close</button>
    <canvas id="gameCanvas" class="minecraft-canvas" width="800" height="500"></canvas>
    
    <!-- Click to Play Overlay (required for pointer lock) -->
    <div class="click-to-play active" id="clickToPlay">
      <div class="click-to-play-text">🎮 Click to Play</div>
      <div class="click-to-play-hint">Mouse will be captured • Press ESC to pause</div>
    </div>
    
    <!-- Pause Menu -->
    <div class="pause-menu" id="pauseMenu">
      <!-- Main Menu -->
      <div class="pause-submenu active" id="menuMain">
        <div class="pause-title">⏸ Paused</div>
        <div class="pause-buttons">
          <button class="pause-btn resume" id="btnResume">Resume</button>
          <button class="pause-btn fullscreen" id="btnFullscreen">Fullscreen</button>
          <button class="pause-btn disabled" id="btnAccount">Sign In</button>
          <button class="pause-btn" id="btnStats">Stats</button>
          <button class="pause-btn" id="btnOptions">Options</button>
          <button class="pause-btn quit" id="btnQuit">Quit Game</button>
        </div>
      </div>
      
      <!-- Stats Menu -->
      <div class="pause-submenu" id="menuStats">
        <div class="submenu-title">📊 Statistics</div>
        <div class="submenu-content">
          <div class="stat-row">
            <span>Blocks Placed</span>
            <span class="stat-value" id="statPlaced">0</span>
          </div>
          <div class="stat-row">
            <span>Blocks Broken</span>
            <span class="stat-value" id="statBroken">0</span>
          </div>
          <div class="stat-row">
            <span>Distance Walked</span>
            <span class="stat-value" id="statDistance">0m</span>
          </div>
          <div class="stat-row">
            <span>Jumps</span>
            <span class="stat-value" id="statJumps">0</span>
          </div>
          <div class="stat-row">
            <span>Play Time</span>
            <span class="stat-value" id="statTime">0:00</span>
          </div>
        </div>
        <button class="back-btn" id="statsBack">← Back</button>
      </div>
      
      <!-- Options Menu -->
      <div class="pause-submenu" id="menuOptions">
        <div class="submenu-title">⚙️ Options</div>
        <div class="submenu-content">
          <div class="option-row">
            <span>Brightness</span>
            <input type="range" class="option-slider" id="optBrightness" min="50" max="150" value="100">
          </div>
          <div class="option-row">
            <span>Color Filter</span>
            <select class="option-select" id="optFilter">
              <option value="none">Normal</option>
              <option value="sepia">Sepia</option>
              <option value="grayscale">Black & White</option>
              <option value="trippy">Trippy Hyperbolic</option>
            </select>
          </div>
          <div class="option-row">
            <span>Render Distance</span>
            <select class="option-select" id="optRenderDist">
              <option value="12">Near (Fast)</option>
              <option value="18">Medium</option>
              <option value="25" selected>Far</option>
              <option value="35">Ultra</option>
            </select>
          </div>
          <div class="option-row">
            <span>Shadows</span>
            <div class="option-toggle on" id="optShadows" data-on="true"></div>
          </div>
          <div class="option-row">
            <span>Enhanced Lighting</span>
            <div class="option-toggle on" id="optLighting" data-on="true"></div>
          </div>
          <div class="option-row">
            <span>Anti-Aliasing</span>
            <div class="option-toggle" id="optAA" data-on="false"></div>
          </div>
          <div class="option-row">
            <span>Show FPS</span>
            <div class="option-toggle on" id="optShowFps" data-on="true"></div>
          </div>
          <div class="option-row">
            <span>Target FPS: <span id="targetFpsValue">60</span></span>
            <input type="range" min="15" max="240" value="60" class="option-slider" id="optTargetFps">
          </div>
        </div>
        <button class="back-btn" id="optionsBack">← Back</button>
      </div>
    </div>
    
    <!-- Inventory Screen -->
    <div class="inventory-screen" id="inventoryScreen">
      <!-- Content populated by JavaScript -->
    </div>
    
    <div class="minecraft-ui" id="gameUI">
      <div class="hotbar-slot selected" data-block="grass"></div>
      <div class="hotbar-slot" data-block="dirt"></div>
      <div class="hotbar-slot" data-block="stone"></div>
      <div class="hotbar-slot" data-block="wood"></div>
      <div class="hotbar-slot" data-block="brick"></div>
      <div class="hotbar-slot" data-item="water_bucket"></div>
      <div class="hotbar-slot" data-item="lava_bucket"></div>
      <div class="hotbar-slot" data-item="ak47"></div>
      <div class="hotbar-slot" data-empty="true"></div>
    </div>
    <div class="pickup-notification" id="pickupNotification"></div>
    
    <!-- Survival HUD -->
    <div id="survivalHUD" style="position:absolute;top:10px;left:10px;color:#fff;font-family:monospace;font-size:14px;text-shadow:1px 1px 2px #000;pointer-events:none;">
      <div id="scoreDisplay">Score: 0</div>
      <div id="waveDisplay">Wave: 1</div>
      <div id="objectiveDisplay"></div>
    </div>
    
    <!-- Debug Console -->
    <div class="debug-console" id="debugConsole">
      <div class="debug-console-header">
        <span>Debug Console (\` to toggle)</span>
        <span id="debugFps">0 FPS</span>
      </div>
      <div class="debug-console-output" id="debugOutput"></div>
      <div class="debug-console-input">
        <span>&gt;</span>
        <input type="text" id="debugInput" placeholder="Type command...">
      </div>
    </div>
    
    <!-- Block Tooltip -->
    <div class="block-tooltip" id="blockTooltip">
      <div class="tooltip-title"></div>
      <div class="tooltip-desc"></div>
    </div>
  </div>
  <div class="minecraft-instructions">
    WASD move | SPACE jump/swim | SHIFT swim down | Q drop | R ritual | SCROLL hotbar | LEFT break | RIGHT use/place | E inventory | \` debug
  </div>
</div>
`;
function Jt(t = document.body) {
  const e = document.createElement("div");
  for (e.innerHTML = Qt; e.firstChild; )
    t.appendChild(e.firstChild);
}
const Vt = {
  canvas: null,
  ctx: null,
  isActive: !1,
  isPaused: !1,
  camera: { x: 0, y: 50, z: 0, rotX: 0, rotY: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  world: {},
  keys: {},
  isJumping: !1,
  gravity: -0.035,
  // Stronger gravity for snappier jumps
  lastPos: { x: 0, z: 0 },
  pointerLocked: !1,
  // Fluid state
  inWater: !1,
  inLava: !1,
  swimming: !1,
  headSubmergedWater: !1,
  headSubmergedLava: !1,
  // Player dimensions - camera at waist/hip level
  playerEyeHeight: 1.2,
  // How high camera is above feet
  playerHeight: 1.8,
  // Total player height
  // Birds and mobs
  birds: [],
  pestBirds: [],
  blueBirds: [],
  fish: [],
  cats: [],
  creepers: [],
  // Items and inventory
  selectedSlot: 0,
  // 0-8 for hotbar slots
  selectedBlock: "grass",
  selectedItem: null,
  // For non-block items like ak47
  // Inventory system
  inventory: {
    // Hotbar slots (9 slots)
    hotbar: [
      { type: "block", id: "grass", count: 64 },
      { type: "block", id: "dirt", count: 64 },
      { type: "block", id: "stone", count: 64 },
      { type: "block", id: "wood", count: 64 },
      { type: "block", id: "brick", count: 64 },
      { type: "bucket", id: "water_bucket", count: 5 },
      { type: "bucket", id: "lava_bucket", count: 5 },
      { type: "weapon", id: "ak47", count: 1, durability: 100, maxDurability: 100 },
      null
      // Empty slot
    ],
    // Main inventory (27 slots - 3 rows of 9)
    main: [
      { type: "block", id: "leaves", count: 64 },
      { type: "block", id: "sand", count: 64 },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    // Crafting result
    craftingResult: null
  },
  // Crafting recipes
  recipes: [
    { ingredients: [{ id: "wood", count: 4 }], result: { type: "block", id: "wood", count: 16 }, name: "Planks" },
    { ingredients: [{ id: "stone", count: 8 }], result: { type: "block", id: "brick", count: 4 }, name: "Bricks" },
    { ingredients: [{ id: "sand", count: 4 }], result: { type: "block", id: "stone", count: 2 }, name: "Sandstone" },
    { ingredients: [{ id: "wood", count: 8 }], result: { type: "block", id: "chest", count: 1 }, name: "Chest" }
  ],
  // Fluid blocks that need updating
  fluidUpdates: [],
  fluidLevels: {},
  // Stores fluid level 1-8 at each position
  fluidUpdateTimer: 0,
  // Bird anger system
  birdPruneTimer: 0,
  // Weapon properties
  shootCooldown: 0,
  muzzleFlash: 0,
  particles: [],
  // Bullet particles
  // UI state
  inventoryOpen: !1,
  draggedItem: null,
  dragSource: null,
  // Stats
  stats: {
    blocksPlaced: 0,
    blocksBroken: 0,
    distance: 0,
    jumps: 0,
    startTime: 0
  },
  // Graphics settings
  settings: {
    brightness: 100,
    filter: "none",
    renderDistance: 20,
    shadows: !0,
    lighting: !0,
    antialiasing: !1,
    showFps: !0,
    targetFps: 60
  },
  // FPS tracking
  fpsCounter: {
    frames: 0,
    lastTime: 0,
    fps: 0
  },
  // Simple 2D noise function (value noise with interpolation)
  noise2D: function() {
    const t = [];
    for (let s = 0; s < 512; s++)
      t[s] = Math.floor(Math.random() * 256);
    function e(s) {
      return s * s * s * (s * (s * 6 - 15) + 10);
    }
    function i(s, c, f) {
      return s + f * (c - s);
    }
    function a(s, c, f) {
      const h = s & 3, n = h < 2 ? c : f, d = h < 2 ? f : c;
      return (h & 1 ? -n : n) + (h & 2 ? -d : d);
    }
    return function(s, c) {
      const f = Math.floor(s) & 255, h = Math.floor(c) & 255;
      s -= Math.floor(s), c -= Math.floor(c);
      const n = e(s), d = e(c), m = t[f] + h, u = t[f + 1] + h;
      return i(
        i(a(t[m], s, c), a(t[u], s - 1, c), n),
        i(a(t[m + 1], s, c - 1), a(t[u + 1], s - 1, c - 1), n),
        d
      );
    };
  }(),
  // Fractal Brownian Motion for more natural terrain
  fbm(t, e, i = 4) {
    let a = 0, s = 1, c = 1, f = 0;
    for (let h = 0; h < i; h++)
      a += this.noise2D(t * c, e * c) * s, f += s, s *= 0.5, c *= 2;
    return a / f;
  },
  blockColors: {
    grass: { top: "#7cba5f", side: "#8b6b4a", bottom: "#6b4423" },
    dirt: { top: "#8b6b4a", side: "#8b6b4a", bottom: "#8b6b4a" },
    stone: { top: "#888888", side: "#777777", bottom: "#666666" },
    wood: { top: "#a0825a", side: "#6b4423", bottom: "#6b4423" },
    leaves: { top: "rgba(50, 180, 50, 0.85)", side: "rgba(40, 160, 40, 0.85)", bottom: "rgba(30, 140, 30, 0.85)", transparent: !0 },
    // Beautiful transparent leaves
    appleLeaves: { top: "rgba(50, 180, 50, 0.85)", side: "rgba(40, 160, 40, 0.85)", bottom: "rgba(30, 140, 30, 0.85)", transparent: !0 },
    // Beautiful transparent apple leaves
    water: { top: "rgba(74, 144, 217, 0.7)", side: "rgba(58, 128, 201, 0.7)", bottom: "rgba(42, 112, 185, 0.7)", transparent: !0, animated: !0 },
    sand: { top: "#e6d9a0", side: "#d9cc93", bottom: "#ccbf86" },
    brick: { top: "#b35050", side: "#a04040", bottom: "#903030" },
    lava: { top: "#ff6600", side: "#ff4400", bottom: "#cc3300", animated: !0 },
    obsidian: { top: "#1a0a2e", side: "#140820", bottom: "#0a0410" },
    cherryWood: { top: "#c4a07a", side: "#8b5a5a", bottom: "#8b5a5a" },
    cherryLeaves: { top: "rgba(255, 183, 197, 0.85)", side: "rgba(255, 192, 203, 0.85)", bottom: "rgba(255, 144, 165, 0.85)", transparent: !0 },
    chest: { top: "#8b6914", side: "#a0780a", bottom: "#705010" },
    ritualChest: { top: "#4a0080", side: "#6a00b0", bottom: "#300060" },
    buildingChest: { top: "#c0c0c0", side: "#a0a0a0", bottom: "#808080" },
    // Ritual Temple blocks
    ritualStone: { top: "#4a4a6a", side: "#3a3a5a", bottom: "#2a2a4a" },
    petalSocket: { top: "#ffb7c5", side: "#8b5a5a", bottom: "#5a3a3a" },
    ropeSocket: { top: "#8b7355", side: "#6b5a45", bottom: "#4b3a25" },
    charmSocket: { top: "#ffd700", side: "#daa520", bottom: "#b8860b" },
    plaqueSocket: { top: "#deb887", side: "#c4a07a", bottom: "#8b7355" },
    incenseSocket: { top: "#9370db", side: "#7b68ee", bottom: "#6a5acd" },
    // Filled socket blocks (glowing versions)
    petalSocketFilled: { top: "#ff69b4", side: "#ff1493", bottom: "#c71585" },
    ropeSocketFilled: { top: "#daa520", side: "#b8860b", bottom: "#8b6914" },
    charmSocketFilled: { top: "#fff700", side: "#ffd700", bottom: "#ffb700" },
    plaqueSocketFilled: { top: "#f4a460", side: "#d2691e", bottom: "#a0522d" },
    incenseSocketFilled: { top: "#da70d6", side: "#ba55d3", bottom: "#9932cc" },
    // Church blocks
    whiteBrick: { top: "#f0f0f0", side: "#e0e0e0", bottom: "#d0d0d0" },
    redBrick: { top: "#b35050", side: "#a04040", bottom: "#903030" },
    glowstone: { top: "#ffdd88", side: "#eebb66", bottom: "#ddaa44" }
  },
  // Item definitions with properties
  itemTypes: {
    // Building materials
    grass: { stackable: !0, maxStack: 64 },
    dirt: { stackable: !0, maxStack: 64 },
    stone: { stackable: !0, maxStack: 64 },
    wood: { stackable: !0, maxStack: 64 },
    leaves: { stackable: !0, maxStack: 64 },
    appleLeaves: { stackable: !0, maxStack: 64 },
    sand: { stackable: !0, maxStack: 64 },
    brick: { stackable: !0, maxStack: 64 },
    cherryWood: { stackable: !0, maxStack: 64 },
    cherryLeaves: { stackable: !0, maxStack: 64 },
    chest: { stackable: !0, maxStack: 16 },
    obsidian: { stackable: !0, maxStack: 64 },
    whiteBrick: { stackable: !0, maxStack: 64 },
    redBrick: { stackable: !0, maxStack: 64 },
    glowstone: { stackable: !0, maxStack: 64 },
    ritualStone: { stackable: !0, maxStack: 64 },
    // Consumables/Throwables
    apple: { stackable: !0, maxStack: 64, throwable: !0, description: "Throw at birds to knock them away" },
    // Buckets
    water_bucket: { stackable: !0, maxStack: 16 },
    lava_bucket: { stackable: !0, maxStack: 16 },
    // Tools with durability
    ak47: { stackable: !1, maxStack: 1, durability: 100, maxDurability: 100, description: "Shoots bullets at birds" },
    seeds: { stackable: !0, maxStack: 64, description: "Calms angry birds temporarily" },
    berdger: { stackable: !1, maxStack: 1, invincible: !0, description: "The legendary bird repellent - infinite uses!" },
    // Ritual items (Omamori charm components)
    sakuraPetal: { stackable: !0, maxStack: 16, description: "Sacred cherry blossom petal", ritual: !0 },
    shimenawa: { stackable: !0, maxStack: 1, description: "Sacred rope", ritual: !0 },
    omamori: { stackable: !0, maxStack: 1, description: "Protective charm base", ritual: !0 },
    ema: { stackable: !0, maxStack: 1, description: "Wooden wish plaque", ritual: !0 },
    incense: { stackable: !0, maxStack: 1, description: "Purifying incense", ritual: !0 }
  },
  // Fluids that player can pass through
  fluidBlocks: ["water", "lava"],
  // Ritual system - Omamori Blessing (Japanese protective charm ritual)
  ritualItems: ["sakuraPetal", "shimenawa", "omamori", "ema", "incense"],
  ritualComplete: !1,
  ritualBlessingActive: !1,
  ritualBlessingTimer: 0,
  ritualFlight: !1,
  ritualFlightTimer: 0,
  ritualBarrierActive: !1,
  init() {
    this.canvas = document.getElementById("gameCanvas"), this.ctx = this.canvas.getContext("2d"), this.initialized = !1, this.gameLoopId = null, this.lastFrameTime = 0;
  },
  // Full initialization - called only when game starts
  fullInit() {
    this.initialized || (this.generateWorld(), this.setupControls(), this.setupMenus(), this.setupDebugConsole(), this.initialized = !0, this.updateHotbarDisplay(), setTimeout(() => this.updateHotbarDisplay(), 50), setTimeout(() => this.updateHotbarDisplay(), 150), setTimeout(() => this.updateHotbarDisplay(), 300));
  },
  generateWorld() {
    this.world = {}, this.fluidLevels = {}, this.droppedItems = [], this.cherryTrees = [], this.petalParticles = [];
    const t = 50, e = 6, i = 8;
    this.worldBounds = {
      minX: -t,
      maxX: t + 1,
      minZ: -t,
      maxZ: t + 1,
      minY: 0,
      maxY: 50
    }, this.wind = {
      x: 0,
      z: 0,
      targetX: 0,
      targetZ: 0,
      gustTimer: 0,
      strength: 0.02
    }, this.buildings = [], this.fluidQueue = [];
    const a = {}, s = {};
    for (let m = -t; m <= t; m++)
      for (let u = -t; u <= t; u++) {
        const y = this.fbm(m * 0.03, u * 0.03, 2) * 10, b = this.fbm(m * 0.05 + 100, u * 0.05 + 100, 2) * 5, T = Math.sqrt(m * m + u * u) / t, P = Math.max(0, 1 - T * 0.5);
        let L = Math.floor(i + (y + b) * P);
        L = Math.max(1, Math.min(22, L));
        const z = `${m},${u}`;
        a[z] = L, s[z] = this.noise2D(m * 0.03 + 500, u * 0.03 + 500);
      }
    for (let m = -t; m <= t; m++)
      for (let u = -t; u <= t; u++) {
        const y = `${m},${u}`, b = a[y], T = s[y], P = b <= e + 1 && b >= e - 1, L = T > 0.3 && b > e + 2;
        for (let z = Math.max(0, b - 3); z < b - 1; z++)
          this.setBlock(m, z, u, "stone");
        if (P || b <= e ? (this.setBlock(m, b - 1, u, "sand"), this.setBlock(m, b, u, "sand")) : L ? (this.setBlock(m, b - 1, u, "sand"), this.setBlock(m, b, u, "sand")) : (this.setBlock(m, b - 1, u, "dirt"), this.setBlock(m, b, u, "grass")), b < e)
          for (let z = b + 1; z <= e; z++)
            this.setBlock(m, z, u, "water"), this.setFluidLevel(m, z, u, 8);
      }
    for (let m = -t; m <= t; m += 2)
      for (let u = -t; u <= t; u += 2) {
        const y = `${m},${u}`, b = a[y], T = s[y], P = b <= e + 1, L = T > 0.3;
        b > e + 1 && !L && !P && this.noise2D(m * 0.4 + 300, u * 0.4 + 300) > 0.5 && Math.random() < 0.12 && (Math.random() < 0.25 ? this.generateCherryTree(m, b + 1, u) : this.generateTree(m, b + 1, u));
      }
    const c = 5;
    for (let m = 0; m < c; m++) {
      const u = Math.floor(Math.random() * t * 2) - t, y = Math.floor(Math.random() * t * 2) - t, b = `${u},${y}`, T = a[b] || i;
      if (T > e) {
        this.setBlock(u, T + 1, y, "ritualChest");
        const P = this.ritualItems[m % this.ritualItems.length];
        this.chestContents = this.chestContents || {}, this.chestContents[`${u},${T + 1},${y}`] = [
          { type: P, count: 1 }
        ];
      }
    }
    for (let m = 0; m < 30; m++) {
      const u = Math.floor(Math.random() * t * 2) - t, y = Math.floor(Math.random() * t * 2) - t, b = `${u},${y}`, T = a[b] || i;
      T > e && this.droppedItems.push({
        x: u + 0.5,
        y: T + 1.2,
        z: y + 0.5,
        type: "seeds",
        count: 1 + Math.floor(Math.random() * 3),
        bobPhase: Math.random() * Math.PI * 2
      });
    }
    if (this.appleTrees) {
      for (const m of this.appleTrees)
        if (Math.random() < 0.5) {
          const u = 1 + Math.floor(Math.random() * 3);
          for (let y = 0; y < u; y++)
            this.droppedItems.push({
              x: m.x + (Math.random() - 0.5) * 4,
              y: m.y - 3,
              z: m.z + (Math.random() - 0.5) * 4,
              type: "apple",
              count: 1,
              bobPhase: Math.random() * Math.PI * 2
            });
        }
    }
    this.generateBuildings(t);
    let f, h;
    do
      f = Math.floor(Math.random() * (t - 20)) + 15, h = Math.floor(Math.random() * (t - 20)) + 15, Math.random() < 0.5 && (f = -f), Math.random() < 0.5 && (h = -h);
    while (Math.abs(f) < 20 || Math.abs(h) < 20);
    const n = `${f},${h}`, d = a[n] || i;
    this.generateRitualTemple(f, d + 1, h), this.initBirds(), this.initPestBirds();
  },
  generateBuildings(t) {
    const e = ["church", "house1", "house2", "house3", "grocery", "wcdonalds"];
    let a = !1;
    for (let s = -Math.floor(t / 25); s <= Math.floor(t / 25); s++)
      for (let c = -Math.floor(t / 25); c <= Math.floor(t / 25); c++) {
        if (s === 0 && c === 0) continue;
        const f = s * 25, h = c * 25, n = 2 + Math.floor(Math.random() * 5);
        for (let d = 0; d < n; d++) {
          const m = f + 3 + Math.floor(Math.random() * 19), u = h + 3 + Math.floor(Math.random() * 19);
          if (!a && Math.random() < 0.3 && this.tryPlaceBuilding(m, u, ["wcdonalds"])) {
            a = !0;
            continue;
          }
          this.tryPlaceBuilding(m, u, e);
        }
      }
    if (!a)
      for (let s = 0; s < 50; s++) {
        const c = 25 + Math.floor(Math.random() * 20), f = 25 + Math.floor(Math.random() * 20);
        if (this.tryPlaceBuilding(c, f, ["wcdonalds"]))
          break;
      }
  },
  tryPlaceBuilding(t, e, i) {
    const a = this.getHighestBlock(t, e);
    if (!a || a < 7) return !1;
    const s = this.getBlock(t, a, e);
    if (s === "water" || s === "sand") return !1;
    const c = this.getHighestBlock(t + 3, e) || a, f = this.getHighestBlock(t - 3, e) || a, h = this.getHighestBlock(t, e + 3) || a, n = this.getHighestBlock(t, e - 3) || a;
    if (Math.max(Math.abs(c - a), Math.abs(f - a), Math.abs(h - a), Math.abs(n - a)) > 2) return !1;
    for (const u of this.buildings)
      if (Math.sqrt((t - u.x) ** 2 + (e - u.z) ** 2) < 15) return !1;
    const d = i[Math.floor(Math.random() * i.length)], m = a + 1;
    switch (this.buildings.push({ x: t, z: e, type: d, y: m }), d) {
      case "church":
        this.generateChurch(t, m, e);
        break;
      case "house1":
        this.generateHouse1(t, m, e);
        break;
      case "house2":
        this.generateHouse2(t, m, e);
        break;
      case "house3":
        this.generateHouse3(t, m, e);
        break;
      case "grocery":
        this.generateGrocery(t, m, e);
        break;
      case "wcdonalds":
        this.generateWcDonalds(t, m, e);
        break;
    }
    return !0;
  },
  // Ruined Church - tall with steeple and intact cross
  generateChurch(t, e, i) {
    for (let m = 0; m < 7; m++)
      for (let u = 0; u < 12; u++)
        this.setBlock(t + m, e - 1, i + u, "stone");
    for (let m = 0; m < 7; m++)
      for (let u = 0; u < 12; u++)
        for (let y = 0; y < 8; y++)
          if ((m === 0 || m === 6 || u === 0 || u === 11) && Math.random() > 0.3) {
            if (u === 11 && m >= 2 && m <= 4 && y < 3 || (m === 0 || m === 6) && y >= 2 && y <= 4 && (u === 3 || u === 8)) continue;
            this.setBlock(t + m, e + y, i + u, "stone");
          }
    const h = t + 3, n = i + 2;
    for (let m = 8; m < 13; m++)
      this.setBlock(h, e + m, n, "stone"), m < 11 && (Math.random() > 0.3 && this.setBlock(h + 1, e + m, n, "stone"), Math.random() > 0.3 && this.setBlock(h - 1, e + m, n, "stone"));
    const d = e + 8 + 5;
    this.setBlock(h, d, n, "stone"), this.setBlock(h, d + 1, n, "stone"), this.setBlock(h, d + 2, n, "stone"), this.setBlock(h - 1, d + 1, n, "stone"), this.setBlock(h + 1, d + 1, n, "stone");
  },
  // Small cottage house
  generateHouse1(t, e, i) {
    for (let h = 0; h < 5; h++)
      for (let n = 0; n < 6; n++)
        this.setBlock(t + h, e - 1, i + n, "wood");
    for (let h = 0; h < 5; h++)
      for (let n = 0; n < 6; n++)
        for (let d = 0; d < 4; d++)
          if ((h === 0 || h === 4 || n === 0 || n === 5) && Math.random() > 0.25) {
            if (n === 5 && h === 2 && d < 2 || h === 0 && d === 1 && n === 2) continue;
            this.setBlock(t + h, e + d, i + n, "wood");
          }
    for (let h = -1; h <= 5; h++)
      for (let n = 0; n < 6; n++)
        Math.random() > 0.25 && this.setBlock(t + h, e + 4, i + n, "leaves");
  },
  // Two-story house
  generateHouse2(t, e, i) {
    for (let h = 0; h < 6; h++)
      for (let n = 0; n < 7; n++)
        this.setBlock(t + h, e - 1, i + n, "stone");
    for (let h = 0; h < 6; h++)
      for (let n = 0; n < 7; n++)
        for (let d = 0; d < 6; d++)
          if ((h === 0 || h === 5 || n === 0 || n === 6) && Math.random() > 0.3) {
            if (n === 6 && h >= 2 && h <= 3 && d < 2 || (h === 0 || h === 5) && (d === 1 || d === 4) && (n === 2 || n === 4)) continue;
            this.setBlock(t + h, e + d, i + n, "brick");
          }
    for (let h = 1; h < 5; h++)
      for (let n = 1; n < 6; n++)
        Math.random() > 0.3 * 2 && this.setBlock(t + h, e + 3, i + n, "wood");
  },
  // L-shaped house
  generateHouse3(t, e, i) {
    for (let s = 0; s < 5; s++)
      for (let c = 0; c < 8; c++) {
        this.setBlock(t + s, e - 1, i + c, "stone");
        for (let f = 0; f < 4; f++)
          if ((s === 0 || s === 4 || c === 0 || c === 7) && Math.random() > 0.35) {
            if (c === 7 && s === 2 && f < 2) continue;
            this.setBlock(t + s, e + f, i + c, "brick");
          }
      }
    for (let s = 5; s < 9; s++)
      for (let c = 0; c < 5; c++) {
        this.setBlock(t + s, e - 1, i + c, "stone");
        for (let f = 0; f < 4; f++)
          (s === 8 || c === 0 || c === 4 || s === 5 && c > 4) && Math.random() > 0.35 && this.setBlock(t + s, e + f, i + c, "brick");
      }
  },
  // Abandoned grocery store
  generateGrocery(t, e, i) {
    for (let h = 0; h < 10; h++)
      for (let n = 0; n < 8; n++)
        this.setBlock(t + h, e - 1, i + n, "stone");
    for (let h = 0; h < 10; h++)
      for (let n = 0; n < 8; n++)
        for (let d = 0; d < 4; d++)
          if ((h === 0 || h === 9 || n === 0 || n === 7) && Math.random() > 0.25) {
            if (n === 7 && h >= 3 && h <= 6 && d < 3 || n === 7 && (h === 1 || h === 8) && d >= 1 && d <= 2) continue;
            this.setBlock(t + h, e + d, i + n, "stone");
          }
    for (let h = 0; h < 2; h++)
      for (let n = 2; n < 6; n++)
        Math.random() > 0.4 && (this.setBlock(t + 3 + h * 3, e, i + n, "wood"), Math.random() > 0.5 && this.setBlock(t + 3 + h * 3, e + 1, i + n, "wood"));
    for (let h = 2; h < 8; h++)
      Math.random() > 0.3 && this.setBlock(t + h, e + 4, i + 8 - 1, "stone");
  },
  // WcDonald's - the knockoff! (W instead of M, same colors)
  generateWcDonalds(t, e, i) {
    for (let u = 1; u < 8; u++)
      for (let y = 1; y < 8; y++)
        for (let b = 0; b < 6; b++) {
          const T = this.getBlock(t + u, e + b, i + y);
          T && T !== "water" && T !== "lava" && this.setBlock(t + u, e + b, i + y, null);
        }
    for (let u = 0; u < 9; u++)
      for (let y = 0; y < 9; y++)
        this.setBlock(t + u, e - 1, i + y, "brick");
    for (let u = 0; u < 9; u++)
      for (let y = 0; y < 9; y++)
        for (let b = 0; b < 4; b++)
          if ((u === 0 || u === 8 || y === 0 || y === 8) && Math.random() > 0.2) {
            if (y === 8 && u >= 3 && u <= 5 && b < 3 || u === 8 && y >= 2 && y <= 4 && b === 1) continue;
            this.setBlock(t + u, e + b, i + y, b < 2 ? "brick" : "stone");
          }
    const h = t + 4, n = i + 9, d = e + 4;
    this.setBlock(h - 2, d, n, "sand"), this.setBlock(h - 2, d + 1, n, "sand"), this.setBlock(h - 2, d + 2, n, "sand"), this.setBlock(h - 2, d + 3, n, "sand"), this.setBlock(h - 1, d, n, "sand"), this.setBlock(h - 1, d + 1, n, "sand"), this.setBlock(h, d, n, "sand"), this.setBlock(h + 1, d, n, "sand"), this.setBlock(h + 1, d + 1, n, "sand"), this.setBlock(h + 2, d, n, "sand"), this.setBlock(h + 2, d + 1, n, "sand"), this.setBlock(h + 2, d + 2, n, "sand"), this.setBlock(h + 2, d + 3, n, "sand");
    for (let u = 2; u < 7; u++)
      Math.random() > 0.3 && this.setBlock(t + u, e, i + 2, "brick");
    Math.random() > 0.4 && this.setBlock(t + 2, e, i + 5, "wood"), Math.random() > 0.4 && this.setBlock(t + 6, e, i + 5, "wood"), Math.random() > 0.4 && this.setBlock(t + 4, e, i + 6, "wood"), this.setBlock(t + 4, e, i + 1, "buildingChest"), this.chestContents = this.chestContents || {};
    const m = `${t + 4},${e},${i + 1}`;
    Math.random() < 0.3 ? this.chestContents[m] = [{ type: "berdger", count: 1 }] : this.chestContents[m] = [{ type: "seeds", count: 3 + Math.floor(Math.random() * 5) }];
  },
  getHighestBlock(t, e) {
    for (let i = 30; i >= 0; i--)
      if (this.getBlock(t, i, e)) return i;
    return null;
  },
  initBirds() {
    this.birds = [];
    const t = 12;
    for (let e = 0; e < t; e++)
      this.birds.push({
        x: (Math.random() - 0.5) * 80,
        y: 15 + Math.random() * 10,
        z: (Math.random() - 0.5) * 80,
        // Movement pattern
        baseY: 15 + Math.random() * 10,
        angle: Math.random() * Math.PI * 2,
        radius: 5 + Math.random() * 15,
        speed: 0.01 + Math.random() * 0.02,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.05,
        // Visual
        wingPhase: Math.random() * Math.PI * 2,
        size: 0.3 + Math.random() * 0.2
      });
  },
  // Initialize pest birds (small annoying birds that follow player)
  initPestBirds() {
    this.pestBirds = [];
    const t = 3;
    for (let e = 0; e < t; e++)
      this.pestBirds.push({
        x: 0,
        y: 12,
        z: 0,
        // Velocity for knockback
        vx: 0,
        vy: 0,
        vz: 0,
        // Target offset from player
        targetOffsetX: 0,
        targetOffsetY: 0,
        targetOffsetZ: 0,
        // Behavior state
        state: "circling",
        // 'circling', 'swooping', 'retreating', 'hovering', 'knockback'
        stateTimer: Math.random() * 100,
        // Movement
        angle: e / t * Math.PI * 2,
        // Spread them out
        circleRadius: 2 + Math.random(),
        baseCircleRadius: 2 + Math.random(),
        circleSpeed: 0.08 + Math.random() * 0.04,
        swoopProgress: 0,
        // Visual
        wingPhase: Math.random() * Math.PI * 2,
        size: 0.15 + Math.random() * 0.05,
        // Smaller than regular birds
        chirpTimer: Math.random() * 60,
        knockbackSpin: 0,
        // Anger system - gets angrier when shot
        anger: 0,
        // 0-5 anger level
        timesShot: 0,
        // How many times this bird has been shot
        spawnThreshold: 4 + Math.floor(Math.random() * 4)
        // 4-7 shots to spawn reinforcements
      });
  },
  updatePestBirds() {
    const t = this.camera.x, e = this.camera.y, i = this.camera.z;
    this.seedCalmTimer || (this.seedCalmTimer = 0), this.seedCalmTimer > 0 && this.seedCalmTimer--;
    const a = this.seedCalmTimer > 0;
    this.birdPruneTimer || (this.birdPruneTimer = 0), this.birdPruneTimer++, this.birdPruneTimer >= 1800 && (this.birdPruneTimer = 0, this.pestBirds.length > 15 && (this.pestBirds.sort((s, c) => c.anger - s.anger), this.pestBirds = this.pestBirds.slice(0, 15)));
    for (const s of this.pestBirds) {
      s.rageMode && s.rageTimer && (s.rageTimer--, s.rageTimer <= 0 && (s.rageMode = !1, s.speed = 0.06)), this.wind && s.state !== "knockback" && (s.x += this.wind.x * 0.5, s.z += this.wind.z * 0.5), a && s.state !== "knockback" && (s.state = "retreating", s.stateTimer = Math.max(s.stateTimer, 60), s.anger = Math.max(0, s.anger - 0.01)), s.stateTimer--;
      const c = s.anger * 0.1;
      s.wingPhase += (s.state === "knockback" ? 0.8 : 0.5) + c, s.chirpTimer--;
      const f = 1 + s.anger * 0.3, h = 1 - s.anger * 0.1, n = 0.3 + s.anger * 0.15;
      if (s.state === "knockback") {
        const I = s.x, E = s.y, H = s.z;
        s.x += s.vx, s.y += s.vy, s.z += s.vz;
        const D = this.getBlock(Math.floor(s.x), Math.floor(s.y), Math.floor(s.z));
        if (D && D !== "water" && D !== "lava")
          if (D.includes("Leaves") || D.includes("leaves"))
            s.vx *= 0.4, s.vy *= 0.4, s.vz *= 0.4, s.stateTimer = Math.min(s.stateTimer, 90), s.caughtInLeaves = !0;
          else {
            const Z = Math.floor(s.x), Y = Math.floor(s.y), q = Math.floor(s.z);
            this.getBlock(Z, Math.floor(E), Math.floor(H)) ? this.getBlock(Math.floor(I), Y, Math.floor(H)) ? this.getBlock(Math.floor(I), Math.floor(E), q) ? (s.vx *= -0.5, s.vy *= -0.5, s.vz *= -0.5, s.x = I, s.y = E, s.z = H) : (s.vz *= -0.7, s.z = H) : (s.vy *= -0.7, s.y = E) : (s.vx *= -0.7, s.x = I), this.particles.push({
              x: s.x,
              y: s.y,
              z: s.z,
              vx: (Math.random() - 0.5) * 0.1,
              vy: Math.random() * 0.1,
              vz: (Math.random() - 0.5) * 0.1,
              life: 20,
              type: "spark",
              size: 2
            });
          }
        s.caughtInLeaves ? (s.vx *= 0.9, s.vy *= 0.9, s.vz *= 0.9, s.vy += 0.01, Math.abs(s.vx) < 0.01 && Math.abs(s.vz) < 0.01 && (s.caughtInLeaves = !1)) : (s.vx *= 0.95, s.vy *= 0.95, s.vy -= 0.01, s.vz *= 0.95), s.knockbackSpin += 0.3;
        const U = Math.sqrt(s.vx * s.vx + s.vy * s.vy + s.vz * s.vz), _ = 0.05 + s.anger * 0.02;
        if (U < _ || s.stateTimer <= 0) {
          if (s.anger = Math.min(5, s.anger + 1), s.timesShot++, s.timesShot === s.spawnThreshold && this.pestBirds.length < 15) {
            const X = 2 + Math.floor(Math.random() * 2);
            for (let Z = 0; Z < X; Z++) {
              const Y = Math.random() * Math.PI * 2, q = 3 + Math.random() * 2;
              this.pestBirds.push({
                x: this.camera.x + Math.cos(Y) * q,
                y: this.camera.y + 1 + Math.random(),
                z: this.camera.z + Math.sin(Y) * q,
                vx: 0,
                vy: 0,
                vz: 0,
                targetOffsetX: 0,
                targetOffsetY: 0,
                targetOffsetZ: 0,
                state: "circling",
                stateTimer: 20 + Math.random() * 30,
                angle: Y,
                circleRadius: q,
                baseCircleRadius: q,
                circleSpeed: 0.06 + Math.random() * 0.04,
                swoopProgress: 0,
                wingPhase: Math.random() * Math.PI * 2,
                size: 0.2 + Math.random() * 0.05,
                chirpTimer: Math.random() * 60,
                knockbackSpin: 0,
                anger: 2 + Math.floor(Math.random() * 2),
                // Spawned already angry (2-3)
                timesShot: 0,
                spawnThreshold: 4 + Math.floor(Math.random() * 4)
              });
            }
          }
          s.state = "retreating", s.stateTimer = Math.max(30, 120 - s.anger * 20), s.circleRadius = (s.baseCircleRadius + 4) * h, s.vx = s.vy = s.vz = 0, s.knockbackSpin = 0, s.caughtInLeaves = !1;
        }
        continue;
      }
      switch (s.state) {
        case "circling":
          s.angle += s.circleSpeed * f, s.targetOffsetX = Math.cos(s.angle) * s.circleRadius * h, s.targetOffsetZ = Math.sin(s.angle) * s.circleRadius * h, s.targetOffsetY = 0.5 + Math.sin(s.angle * 2) * 0.3, s.circleRadius += (s.baseCircleRadius - s.circleRadius) * 0.01, s.stateTimer <= 0 && (Math.random() < n ? (s.state = "swooping", s.swoopProgress = 0, s.stateTimer = 60) : Math.random() < 0.2 ? (s.state = "hovering", s.stateTimer = Math.max(20, 40 - s.anger * 5) + Math.random() * 40) : s.stateTimer = Math.max(15, 30 - s.anger * 5) + Math.random() * 60);
          break;
        case "swooping":
          s.swoopProgress += 0.05 * f;
          const I = s.swoopProgress;
          if (I < 0.5)
            s.targetOffsetX = Math.cos(s.angle) * s.circleRadius * (1 - I * 2), s.targetOffsetZ = Math.sin(s.angle) * s.circleRadius * (1 - I * 2), s.targetOffsetY = 0.5 - I;
          else {
            const D = (I - 0.5) * 2;
            s.targetOffsetX = Math.cos(s.angle) * s.circleRadius * D, s.targetOffsetZ = Math.sin(s.angle) * s.circleRadius * D, s.targetOffsetY = -0.5 + D;
          }
          s.swoopProgress >= 1 && (s.state = "retreating", s.stateTimer = 30);
          break;
        case "retreating":
          s.angle += s.circleSpeed * 0.5;
          const E = s.circleRadius + 2;
          s.targetOffsetX = Math.cos(s.angle) * E, s.targetOffsetZ = Math.sin(s.angle) * E, s.targetOffsetY = 1 + Math.sin(s.angle * 3) * 0.2, s.circleRadius += (s.baseCircleRadius - s.circleRadius) * 0.02, s.stateTimer <= 0 && (s.state = "circling", s.stateTimer = 60 + Math.random() * 60);
          break;
        case "hovering":
          const H = Math.sin(Date.now() * 0.01) * 0.3;
          s.targetOffsetX = Math.sin(this.camera.rotY + H) * -1.5, s.targetOffsetZ = Math.cos(this.camera.rotY + H) * -1.5, s.targetOffsetY = 0.2 + Math.sin(Date.now() * 0.02) * 0.1, s.stateTimer <= 0 && (s.state = "circling", s.stateTimer = 80 + Math.random() * 40);
          break;
      }
      const d = t + s.targetOffsetX, m = e + s.targetOffsetY, u = i + s.targetOffsetZ, y = s.state === "swooping" ? 0.15 : 0.08;
      let b = (d - s.x) * y, T = (m - s.y) * y, P = (u - s.z) * y;
      const z = s.rageMode ? 0.12 : 0.08, R = Math.sqrt(b * b + T * T + P * P);
      if (R > z) {
        const I = z / R;
        b *= I, T *= I, P *= I;
      }
      s.x += b, s.y += T, s.z += P;
    }
  },
  updateBirds() {
    for (const t of this.birds)
      if (t.swarmMode && t.swarmTimer && (t.swarmTimer--, t.swarmTimer <= 0 && (t.swarmMode = !1)), t.swarmMode) {
        const e = this.camera.x - t.x, i = this.camera.y - t.y, a = this.camera.z - t.z, s = Math.sqrt(e * e + i * i + a * a);
        s > 3 ? (t.x += e / s * 0.15, t.y += i / s * 0.1, t.z += a / s * 0.15) : (t.angle += 0.1, t.x = this.camera.x + Math.cos(t.angle) * 3, t.z = this.camera.z + Math.sin(t.angle) * 3, t.y = this.camera.y + Math.sin(t.wobble) * 0.5), t.wobble += t.wobbleSpeed * 2, t.wingPhase += 0.5;
      } else {
        t.angle += t.speed, t.wobble += t.wobbleSpeed;
        const e = Math.sin(t.angle * 0.1) * 20, i = Math.cos(t.angle * 0.1) * 20;
        let a = e + Math.cos(t.angle) * t.radius, s = i + Math.sin(t.angle) * t.radius;
        this.wind && (a += this.wind.x * 15, s += this.wind.z * 15), t.x = a, t.z = s, t.y = t.baseY + Math.sin(t.wobble) * 2, t.wingPhase += 0.3;
      }
    this.updatePestBirds(), this.updateBlueBirds(), this.updateFish(), this.updateCats(), this.updateCreepers(), this.updateFriendlyBirdDrops(), this.updateBirdEventTimer();
  },
  // Blue birds - aggressive birds that knockback player
  updateBlueBirds() {
    this.blueBirds || (this.blueBirds = []);
    for (let t = this.blueBirds.length - 1; t >= 0; t--) {
      const e = this.blueBirds[t];
      e.wingPhase += 0.6, e.attackCooldown > 0 && e.attackCooldown--;
      const i = this.camera.x - e.x, a = this.camera.y - e.y, s = this.camera.z - e.z, c = Math.sqrt(i * i + a * a + s * s);
      c > 1.5 && (e.vx += i / c * 0.02, e.vy += a / c * 0.015, e.vz += s / c * 0.02), e.x += e.vx, e.y += e.vy, e.z += e.vz, e.vx *= 0.9, e.vy *= 0.9, e.vz *= 0.9, c < 2 && e.attackCooldown <= 0 && (this.velocity.x += (this.camera.x - e.x) * 0.1, this.velocity.y += 0.15, this.velocity.z += (this.camera.z - e.z) * 0.1, e.attackCooldown = 60), c > 60 && this.blueBirds.splice(t, 1);
    }
  },
  // Fish in water
  updateFish() {
    this.fish || (this.fish = []);
    for (let t = this.fish.length - 1; t >= 0; t--) {
      const e = this.fish[t];
      e.swimPhase += 0.15, this.getBlock(Math.floor(e.x), Math.floor(e.y), Math.floor(e.z)) !== "water" ? e.vy -= 0.01 : (e.vx += (Math.random() - 0.5) * 0.01, e.vz += (Math.random() - 0.5) * 0.01, e.vy += (Math.random() - 0.5) * 5e-3), e.x += e.vx, e.y += e.vy, e.z += e.vz, e.vx *= 0.95, e.vy *= 0.95, e.vz *= 0.95;
      const a = Math.sqrt(e.vx * e.vx + e.vz * e.vz);
      a > 0.08 && (e.vx = e.vx / a * 0.08, e.vz = e.vz / a * 0.08);
    }
  },
  // Cats follow player
  updateCats() {
    this.cats || (this.cats = []);
    for (const t of this.cats) {
      t.walkPhase += 0.1, t.meowTimer--;
      const e = this.camera.x - t.x, i = this.camera.z - t.z, a = Math.sqrt(e * e + i * i);
      a > t.followDistance + 2 ? (t.state = "following", t.vx += e / a * 0.01, t.vz += i / a * 0.01) : a < t.followDistance && (t.state = "idle"), t.x += t.vx, t.z += t.vz, t.vx *= 0.85, t.vz *= 0.85, t.vy -= 0.02, t.y += t.vy;
      const s = Math.floor(t.y);
      this.getBlock(Math.floor(t.x), s, Math.floor(t.z)) && (t.y = s + 1, t.vy = 0), t.meowTimer <= 0 && (t.meowTimer = 200 + Math.random() * 400);
    }
  },
  // Creepers stalk and explode
  updateCreepers() {
    this.creepers || (this.creepers = []);
    for (let t = this.creepers.length - 1; t >= 0; t--) {
      const e = this.creepers[t];
      e.walkPhase += 0.08;
      const i = this.camera.x - e.x, a = this.camera.z - e.z, s = Math.sqrt(i * i + a * a);
      if (e.state === "stalking")
        s > 2 ? (e.vx += i / s * 3e-3, e.vz += a / s * 3e-3) : (e.state = "fusing", e.fuseTimer = 0);
      else if (e.state === "fusing") {
        if (e.fuseTimer++, e.flashing = Math.floor(e.fuseTimer / 5) % 2 === 0, e.fuseTimer >= e.fuseMax) {
          this.creeperExplode(e), this.creepers.splice(t, 1);
          continue;
        }
        s > 4 && (e.state = "stalking", e.fuseTimer = 0);
      }
      e.x += e.vx, e.z += e.vz, e.vx *= 0.9, e.vz *= 0.9, e.vy -= 0.02, e.y += e.vy;
      const c = Math.floor(e.y);
      this.getBlock(Math.floor(e.x), c, Math.floor(e.z)) && (e.y = c + 1, e.vy = 0);
    }
  },
  // Creeper explosion
  creeperExplode(t) {
    const e = this.camera.x - t.x, i = this.camera.z - t.z, a = Math.sqrt(e * e + i * i);
    if (a < 6) {
      const s = (6 - a) / 6 * 1.5;
      this.velocity.x += e / a * s, this.velocity.y += 0.8, this.velocity.z += i / a * s;
    }
    for (let s = 0; s < 30; s++)
      this.particles.push({
        x: t.x,
        y: t.y + 0.5,
        z: t.z,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        life: 30 + Math.random() * 20,
        type: "explosion",
        size: 3 + Math.random() * 3
      });
    for (let s = 0; s < 5; s++)
      this.spawnBlueBird();
    this.birdEvent && this.showBirdAlert("💥 CREEPER EXPLODED! Blue birds incoming! 💥");
  },
  // Friendly birds drop items
  updateFriendlyBirdDrops() {
    if (this.birdDropTimer || (this.birdDropTimer = 0), this.birdDropTimer++, this.birdDropTimer >= 600) {
      this.birdDropTimer = 0;
      for (const t of this.birds)
        if (Math.random() < 0.3) {
          const e = Math.random();
          let i = "seeds", a = 1 + Math.floor(Math.random() * 3);
          e < 0.05 ? (i = ["berdger", "omamori", "shimenawa"][Math.floor(Math.random() * 3)], a = 1) : e < 0.2 && (i = "apple", a = 1 + Math.floor(Math.random() * 2)), this.dropItem(
            t.x + (Math.random() - 0.5) * 2,
            t.y - 2,
            t.z + (Math.random() - 0.5) * 2,
            i,
            a
          );
          break;
        }
    }
  },
  // Bird event timer system
  updateBirdEventTimer() {
    if (!this.birdEvent) return;
    const t = Date.now(), e = t - this.birdEvent.lastUpdate;
    this.birdEvent.lastUpdate = t, this.birdEvent.timer -= e, this.birdEvent.alertFade > 0 && (this.birdEvent.alertFade -= e, this.birdEvent.alertFade <= 0 && (this.birdEvent.alertMessage = null));
    const i = this.birdEvent.timer, a = this.birdEvent.events[this.birdEvent.currentEvent];
    i <= 5 * 60 * 1e3 && i > 4 * 60 * 1e3 && !this.birdEvent.alertShown.five && (this.showBirdAlert(`⚠️ In 5 minutes, ${a.description} ⚠️`), this.birdEvent.alertShown.five = !0), i <= 3 * 60 * 1e3 && i > 2 * 60 * 1e3 && !this.birdEvent.alertShown.three && (this.showBirdAlert(`⚠️ In 3 minutes, ${a.description} ⚠️`), this.birdEvent.alertShown.three = !0), i <= 1 * 60 * 1e3 && i > 50 * 1e3 && !this.birdEvent.alertShown.one && (this.showBirdAlert(`⚠️ In 1 minute, ${a.description} ⚠️`), this.birdEvent.alertShown.one = !0), i <= 30 * 1e3 && i > 20 * 1e3 && !this.birdEvent.alertShown.thirty && (this.showBirdAlert(`⚠️ In 30 seconds, ${a.description.toUpperCase()} ⚠️`), this.birdEvent.alertShown.thirty = !0), i <= 10 * 1e3 && i > 5 * 1e3 && !this.birdEvent.alertShown.ten && (this.showBirdAlert(`🔥 In 10 seconds, ${a.description.toUpperCase()} 🔥`), this.birdEvent.alertShown.ten = !0), i <= 0 && this.triggerBirdEvent();
  },
  showBirdAlert(t) {
    this.birdEvent.alertMessage = t, this.birdEvent.alertFade = 4e3;
  },
  triggerBirdEvent() {
    const t = this.birdEvent.events[this.birdEvent.currentEvent];
    this.showBirdAlert(`🐦 BIRD EVENT: ${t.name}! 🐦`), t.action(), this.birdEvent.timer = 5 * 60 * 1e3, this.birdEvent.currentEvent = (this.birdEvent.currentEvent + 1) % this.birdEvent.events.length, this.birdEvent.alertShown = { five: !1, three: !1, one: !1, thirty: !1, ten: !1 };
  },
  // Bird Event 1: Swarm - all birds converge on player
  triggerBirdSwarm() {
    for (const t of this.birds)
      t.swarmMode = !0, t.swarmTimer = 30 * 60;
    for (let t = 0; t < 5; t++)
      this.spawnPestBird();
  },
  // Bird Event 2: Rage - pest birds become faster and more aggressive
  triggerBirdRage() {
    if (this.pestBirds)
      for (const t of this.pestBirds)
        t.rageMode = !0, t.rageTimer = 45 * 60, t.speed = (t.speed || 0.06) * 1.5;
    for (let t = 0; t < 3; t++) {
      const e = this.spawnPestBird();
      e && (e.rageMode = !0, e.rageTimer = 45 * 60);
    }
  },
  // Bird Event 3: Multiply - spawn many birds everywhere
  triggerBirdMultiply() {
    for (let t = 0; t < 10; t++) {
      const e = Math.random() * Math.PI * 2, i = 10 + Math.random() * 20, a = this.spawnPestBird();
      a && (a.x = this.camera.x + Math.cos(e) * i, a.z = this.camera.z + Math.sin(e) * i, a.y = this.camera.y + 5 + Math.random() * 10);
    }
  },
  // Bird Event 4: Creeper Invasion - spawn stalking creepers
  triggerCreeperInvasion() {
    this.showBirdAlert("💥 CREEPERS ARE STALKING YOU! 💥");
    const t = 2 + Math.floor(Math.random() * 3);
    for (let e = 0; e < t; e++)
      this.spawnCreeper();
  },
  spawnPestBird() {
    this.pestBirds || (this.pestBirds = []);
    const t = {
      x: this.camera.x + (Math.random() - 0.5) * 30,
      y: this.camera.y + 10 + Math.random() * 10,
      z: this.camera.z + (Math.random() - 0.5) * 30,
      vx: 0,
      vy: 0,
      vz: 0,
      state: "hunting",
      wingPhase: Math.random() * Math.PI * 2,
      speed: 0.06,
      angryTimer: 60 * 60 * 5
      // 5 minutes
    };
    return this.pestBirds.push(t), t;
  },
  // Spawn blue bird (more aggressive, can knockback player)
  spawnBlueBird() {
    this.blueBirds || (this.blueBirds = []);
    const t = {
      x: this.camera.x + (Math.random() - 0.5) * 20,
      y: this.camera.y + 5 + Math.random() * 8,
      z: this.camera.z + (Math.random() - 0.5) * 20,
      vx: 0,
      vy: 0,
      vz: 0,
      state: "aggressive",
      wingPhase: Math.random() * Math.PI * 2,
      speed: 0.1,
      // Faster than normal birds
      attackCooldown: 0
    };
    return this.blueBirds.push(t), t;
  },
  // Spawn fish in water
  spawnFish() {
    this.fish || (this.fish = []);
    let t = null;
    for (let i = 0; i < 50; i++) {
      const a = Math.floor(this.camera.x + (Math.random() - 0.5) * 40), s = Math.floor(this.camera.z + (Math.random() - 0.5) * 40);
      for (let c = 20; c >= 0; c--)
        if (this.getBlock(a, c, s) === "water") {
          t = { x: a + 0.5, y: c + 0.5, z: s + 0.5 };
          break;
        }
      if (t) break;
    }
    t || (t = {
      x: this.camera.x + (Math.random() - 0.5) * 10,
      y: 7,
      z: this.camera.z + (Math.random() - 0.5) * 10
    });
    const e = {
      x: t.x,
      y: t.y,
      z: t.z,
      vx: (Math.random() - 0.5) * 0.05,
      vy: 0,
      vz: (Math.random() - 0.5) * 0.05,
      swimPhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? "#ff6347" : "#ffd700",
      // Orange or gold
      size: 0.3 + Math.random() * 0.2
    };
    return this.fish.push(e), e;
  },
  // Spawn cat that follows player
  spawnCat() {
    this.cats || (this.cats = []);
    const t = {
      x: this.camera.x + (Math.random() - 0.5) * 10,
      y: this.camera.y - 1,
      z: this.camera.z + (Math.random() - 0.5) * 10,
      vx: 0,
      vy: 0,
      vz: 0,
      state: "idle",
      walkPhase: 0,
      color: ["#ffa500", "#808080", "#000000", "#ffffff"][Math.floor(Math.random() * 4)],
      // Orange, gray, black, white
      meowTimer: Math.random() * 300 + 200,
      followDistance: 3 + Math.random() * 2
    };
    return this.cats.push(t), t;
  },
  // Spawn creeper (explodes, spawns blue birds)
  spawnCreeper() {
    this.creepers || (this.creepers = []);
    const t = {
      x: this.camera.x + (Math.random() > 0.5 ? 15 : -15) + (Math.random() - 0.5) * 10,
      y: this.camera.y,
      z: this.camera.z + (Math.random() > 0.5 ? 15 : -15) + (Math.random() - 0.5) * 10,
      vx: 0,
      vy: 0,
      vz: 0,
      state: "stalking",
      fuseTimer: 0,
      fuseMax: 90,
      // 1.5 seconds fuse
      walkPhase: 0,
      health: 3
    };
    return this.creepers.push(t), t;
  },
  // Update survival HUD
  updateSurvivalHUD() {
    if (!this.survivalStats) return;
    const t = document.getElementById("scoreDisplay"), e = document.getElementById("waveDisplay"), i = document.getElementById("objectiveDisplay");
    t && (t.textContent = `Score: ${this.survivalStats.score}`), e && (e.textContent = `Wave: ${this.survivalStats.wave}`), i && this.survivalStats.currentObjective && (i.textContent = `Objective: ${this.survivalStats.currentObjective.text}`);
  },
  // Generate Ritual Temple - only one per world
  generateRitualTemple(t, e, i) {
    this.ritualTempleLocation = { x: t, y: e, z: i };
    for (let n = 0; n < 11; n++)
      for (let d = 0; d < 11; d++)
        for (let m = 0; m < 10; m++)
          this.setBlock(t + n, e + m, i + d, null);
    for (let n = 0; n < 11; n++)
      for (let d = 0; d < 11; d++)
        this.setBlock(t + n, e, i + d, "ritualStone");
    for (let n = 1; n < 8; n++) {
      for (let d = 0; d < 11; d++)
        this.setBlock(t + d, e + n, i, "ritualStone"), this.setBlock(t + d, e + n, i + 11 - 1, "ritualStone");
      for (let d = 0; d < 11; d++)
        this.setBlock(t, e + n, i + d, "ritualStone"), this.setBlock(t + 11 - 1, e + n, i + d, "ritualStone");
    }
    this.setBlock(t + 11 / 2 | 0, e + 1, i, null), this.setBlock(t + 11 / 2 | 0, e + 2, i, null), this.setBlock(t + 11 / 2 | 0, e + 3, i, null);
    const f = t + 11 / 2 | 0, h = i + 11 / 2 | 0;
    this.setBlock(f, e + 1, h, "charmSocket"), this.setBlock(f - 2, e + 1, h, "petalSocket"), this.setBlock(f + 2, e + 1, h, "ropeSocket"), this.setBlock(f, e + 1, h - 2, "plaqueSocket"), this.setBlock(f, e + 1, h + 2, "incenseSocket");
    for (let n = 1; n <= 4; n++)
      this.setBlock(t + 2, e + n, i + 2, "glowstone"), this.setBlock(t + 11 - 3, e + n, i + 2, "glowstone"), this.setBlock(t + 2, e + n, i + 11 - 3, "glowstone"), this.setBlock(t + 11 - 3, e + n, i + 11 - 3, "glowstone");
  },
  // Generate apple tree with green leaves and chance to drop apples
  generateTree(t, e, i) {
    for (let a = 0; a < 4; a++)
      this.setBlock(t, e + a, i, "wood");
    for (let a = -2; a <= 2; a++)
      for (let s = -2; s <= 2; s++)
        for (let c = 3; c <= 5; c++)
          Math.abs(a) + Math.abs(s) + Math.abs(c - 4) < 4 && (a === 0 && s === 0 && c < 4 || this.setBlock(t + a, e + c, i + s, "appleLeaves"));
    this.appleTrees || (this.appleTrees = []), this.appleTrees.push({ x: t, y: e + 4, z: i });
  },
  // Generate cherry blossom tree (larger, more dramatic)
  generateCherryTree(t, e, i) {
    for (let a = 0; a < 6; a++)
      this.setBlock(t, e + a, i, "cherryWood");
    for (let a = -3; a <= 3; a++)
      for (let s = -3; s <= 3; s++)
        for (let c = 4; c <= 8; c++)
          Math.abs(a) + Math.abs(s) + Math.abs(c - 6) < 5 && Math.random() > 0.15 && (a === 0 && s === 0 && c < 5 || this.setBlock(t + a, e + c, i + s, "cherryLeaves"));
    this.cherryTrees.push({ x: t, y: e + 6, z: i });
  },
  setBlock(t, e, i, a) {
    const s = `${t},${e},${i}`;
    a === null ? delete this.world[s] : this.world[s] = a;
  },
  getBlock(t, e, i) {
    return this.world[`${t},${e},${i}`] || null;
  },
  setupControls() {
    document.addEventListener("keydown", (e) => {
      if (!this.isActive) return;
      if (e.key === "Escape") {
        if (e.preventDefault(), this.inventoryOpen) {
          this.toggleInventory();
          return;
        }
        this.isPaused ? this.resume() : this.pause();
        return;
      }
      if (this.isPaused) return;
      this.keys[e.key.toLowerCase()] = !0;
      const a = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(e.key);
      if (a !== -1) {
        this.selectedSlot = a;
        const s = this.inventory.hotbar[a];
        s && (s.type === "block" ? (this.selectedBlock = s.id, this.selectedItem = null) : s.type === "weapon" && (this.selectedItem = s.id, this.selectedBlock = null)), this.updateHotbar();
      }
      if (e.key.toLowerCase() === "e" && this.toggleInventory(), e.key.toLowerCase() === "q" && this.dropHeldItem(), e.key.toLowerCase() === "r" && this.checkRitual() && console.log("Omamori Ritual Complete! Birds are blessed and calmed."), e.key === "`" || e.key === "~") {
        e.preventDefault(), this.toggleDebugConsole();
        return;
      }
      e.preventDefault();
    }), document.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = !1;
    }), this.pointerLocked = !1, document.addEventListener("pointerlockchange", () => {
      this.pointerLocked = document.pointerLockElement === this.canvas, this.pointerLocked ? document.getElementById("clickToPlay").classList.remove("active") : this.isActive && !this.isPaused && !this.inventoryOpen && !this.justClosedInventory && this.pause();
    }), document.addEventListener("pointerlockerror", () => {
      console.log("Pointer lock failed"), this.isActive && !this.isPaused && document.getElementById("clickToPlay").classList.add("active");
    }), this.canvas.addEventListener("mousedown", (e) => {
      if (!(!this.isActive || this.isPaused) && !this.inventoryOpen) {
        if (!this.pointerLocked) {
          this.canvas.requestPointerLock();
          return;
        }
        if (e.button === 0) {
          const i = this.raycast();
          if (i && i.hit) {
            const a = this.getBlock(i.hit.x, i.hit.y, i.hit.z);
            if (a === "water" || a === "lava")
              return;
            const s = (f) => f && (f === "chest" || f === "ritualChest" || f === "buildingChest" || f.toLowerCase().includes("chest"));
            if (((f) => f && f.includes("Socket"))(a))
              return;
            if (this.setBlock(i.hit.x, i.hit.y, i.hit.z, null), this.stats.blocksBroken++, this.survivalStats && (this.survivalStats.score += 1, this.updateSurvivalHUD()), a && !s(a))
              a === "appleLeaves" ? (this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, "appleLeaves", 1), Math.random() < 0.15 && this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, "apple", 1)) : a === "cherryLeaves" ? (this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, "cherryLeaves", 1), Math.random() < 0.1 && this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, "sakuraPetal", 1)) : this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, a, 1);
            else if (s(a)) {
              const f = `${i.hit.x},${i.hit.y},${i.hit.z}`, h = this.chestContents && this.chestContents[f];
              if (h && Array.isArray(h)) {
                for (const n of h)
                  n && n.type && this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, n.type, n.count || 1);
                delete this.chestContents[f];
              }
              this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, "chest", 1);
            }
          }
        } else if (e.button === 2) {
          const i = this.raycast();
          if (i && i.hit) {
            const c = this.getBlock(i.hit.x, i.hit.y, i.hit.z);
            if (c && (c === "chest" || c === "ritualChest" || c === "buildingChest" || c.toLowerCase().includes("chest"))) {
              this.openChest(i.hit.x, i.hit.y, i.hit.z);
              return;
            }
            if (c && c.includes("Socket")) {
              this.interactWithSocket(i.hit.x, i.hit.y, i.hit.z, c);
              return;
            }
          }
          const a = this.inventory.hotbar[this.selectedSlot], s = a ? a.id : null;
          if (this.selectedItem === "ak47")
            this.shootAK47();
          else if (s === "berdger")
            this.shootBerdger();
          else if (s === "apple")
            this.throwApple();
          else if (s === "seeds")
            this.useSeeds();
          else if (this.selectedItem === "water_bucket" || this.selectedItem === "lava_bucket") {
            const c = this.raycast();
            if (c && c.place) {
              const f = this.selectedItem === "water_bucket" ? "water" : "lava", h = c.place, n = Math.floor(this.camera.x), d = Math.floor(this.camera.z), m = Math.floor(this.camera.y - this.playerEyeHeight), u = Math.floor(this.camera.y - this.playerEyeHeight + this.playerHeight);
              let y = !1;
              for (let b = m; b <= u; b++)
                if (n === h.x && b === h.y && d === h.z) {
                  y = !0;
                  break;
                }
              if (!y) {
                this.setBlock(h.x, h.y, h.z, f), this.setFluidLevel(h.x, h.y, h.z, 8), this.fluidUpdates.push({
                  x: h.x,
                  y: h.y,
                  z: h.z,
                  type: f,
                  level: 8
                  // Source block has max level
                });
                const b = this.inventory.hotbar[this.selectedSlot];
                b && b.count > 1 ? b.count-- : (this.inventory.hotbar[this.selectedSlot] = null, this.selectedItem = null), this.updateHotbar();
              }
            }
          } else if (this.selectedBlock) {
            const c = this.raycast();
            if (c && c.place) {
              const f = Math.floor(this.camera.x), h = Math.floor(this.camera.z), n = c.place, d = Math.floor(this.camera.y - this.playerEyeHeight), m = Math.floor(this.camera.y - this.playerEyeHeight + this.playerHeight);
              let u = !1;
              for (let y = d; y <= m; y++)
                if (f === n.x && y === n.y && h === n.z) {
                  u = !0;
                  break;
                }
              if (!u) {
                this.setBlock(n.x, n.y, n.z, this.selectedBlock), this.stats.blocksPlaced++;
                const y = this.inventory.hotbar[this.selectedSlot];
                y && y.count > 0 && (y.count--, y.count <= 0 && (this.inventory.hotbar[this.selectedSlot] = null, this.selectedBlock = null), this.updateHotbarDisplay());
              }
            }
          }
        }
      }
    }), this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    }), this.canvas.addEventListener("wheel", (e) => {
      if (!this.isActive || this.isPaused || this.inventoryOpen) return;
      e.preventDefault(), e.deltaY > 0 ? this.selectedSlot = (this.selectedSlot + 1) % 9 : e.deltaY < 0 && (this.selectedSlot = (this.selectedSlot + 8) % 9);
      const i = this.inventory.hotbar[this.selectedSlot];
      i ? i.type === "block" ? (this.selectedBlock = i.id, this.selectedItem = null) : i.type === "weapon" ? (this.selectedItem = i.id, this.selectedBlock = null) : i.type === "bucket" && (this.selectedItem = i.id, this.selectedBlock = null) : (this.selectedBlock = null, this.selectedItem = null), this.updateHotbar();
    }, { passive: !1 }), document.getElementById("minecraftGame").addEventListener("wheel", (e) => {
      this.isActive && (e.preventDefault(), e.stopPropagation());
    }, { passive: !1 }), document.addEventListener("mousemove", (e) => {
      !this.isActive || this.isPaused || !this.pointerLocked || (this.camera.rotY -= e.movementX * 3e-3, this.camera.rotX = Math.max(-1.5, Math.min(1.5, this.camera.rotX + e.movementY * 3e-3)));
    }), document.addEventListener("visibilitychange", () => {
      document.hidden && this.isActive && !this.isPaused && this.pause();
    }), window.addEventListener("resize", () => {
      (document.fullscreenElement || document.webkitFullscreenElement) && this.isActive && (this.canvas.width = window.innerWidth, this.canvas.height = window.innerHeight);
    }), document.querySelectorAll(".hotbar-slot").forEach((e, i) => {
      e.addEventListener("click", (a) => {
        a.stopPropagation(), this.selectedSlot = i;
        const s = this.inventory.hotbar[i];
        s && (s.type === "block" ? (this.selectedBlock = s.id, this.selectedItem = null) : s.type === "weapon" && (this.selectedItem = s.id, this.selectedBlock = null)), this.updateHotbar();
      });
    });
  },
  setupMenus() {
    document.getElementById("btnResume").addEventListener("click", () => this.resume()), document.getElementById("btnFullscreen").addEventListener("click", (t) => {
      t.preventDefault();
      const e = document.getElementById("minecraftGame");
      document.fullscreenElement || document.webkitFullscreenElement ? document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen && document.webkitExitFullscreen() : e.requestFullscreen ? e.requestFullscreen().catch((a) => console.log("Fullscreen error:", a)) : e.webkitRequestFullscreen && e.webkitRequestFullscreen(), this.resume();
    }), document.addEventListener("fullscreenchange", () => this.updateFullscreenButton()), document.addEventListener("webkitfullscreenchange", () => this.updateFullscreenButton()), document.getElementById("btnAccount").addEventListener("click", (t) => {
      t.preventDefault();
    }), document.getElementById("btnStats").addEventListener("click", () => {
      this.showSubmenu("menuStats"), this.updateStatsDisplay();
    }), document.getElementById("btnOptions").addEventListener("click", () => {
      this.showSubmenu("menuOptions");
    }), document.getElementById("btnQuit").addEventListener("click", () => this.stop()), document.getElementById("statsBack").addEventListener("click", () => this.showSubmenu("menuMain")), document.getElementById("optionsBack").addEventListener("click", () => this.showSubmenu("menuMain")), document.getElementById("optBrightness").addEventListener("input", (t) => {
      this.settings.brightness = parseInt(t.target.value), this.applyFilters();
    }), document.getElementById("optFilter").addEventListener("change", (t) => {
      this.settings.filter = t.target.value, this.applyFilters();
    }), document.getElementById("optRenderDist").addEventListener("change", (t) => {
      this.settings.renderDistance = parseInt(t.target.value);
    }), ["optShadows", "optLighting", "optAA", "optShowFps"].forEach((t) => {
      document.getElementById(t).addEventListener("click", (e) => {
        const i = e.target, a = i.dataset.on === "true";
        i.dataset.on = (!a).toString(), i.classList.toggle("on", !a), t === "optShadows" && (this.settings.shadows = !a), t === "optLighting" && (this.settings.lighting = !a), t === "optAA" && (this.settings.antialiasing = !a, this.canvas.style.imageRendering = a ? "auto" : "pixelated"), t === "optShowFps" && (this.settings.showFps = !a);
      });
    }), document.getElementById("optTargetFps").addEventListener("input", (t) => {
      const e = parseInt(t.target.value);
      this.settings.targetFps = e, document.getElementById("targetFpsValue").textContent = String(e);
    });
  },
  showSubmenu(t) {
    document.querySelectorAll(".pause-submenu").forEach((e) => e.classList.remove("active")), document.getElementById(t).classList.add("active");
  },
  updateStatsDisplay() {
    document.getElementById("statPlaced").textContent = this.stats.blocksPlaced, document.getElementById("statBroken").textContent = this.stats.blocksBroken, document.getElementById("statDistance").textContent = String(Math.floor(this.stats.distance)) + "m", document.getElementById("statJumps").textContent = this.stats.jumps;
    const t = Math.floor((Date.now() - this.stats.startTime) / 1e3), e = Math.floor(t / 60), i = t % 60;
    document.getElementById("statTime").textContent = `${e}:${i.toString().padStart(2, "0")}`;
  },
  applyFilters() {
    let t = `brightness(${this.settings.brightness}%)`;
    switch (this.settings.filter) {
      case "sepia":
        t += " sepia(80%)";
        break;
      case "grayscale":
        t += " grayscale(100%)";
        break;
      case "trippy":
        t += " hue-rotate(" + Date.now() % 3600 / 10 + "deg) saturate(200%)";
        break;
    }
    this.canvas.style.filter = t;
  },
  updateHotbar() {
    document.querySelectorAll(".hotbar-slot").forEach((e, i) => {
      const a = i === this.selectedSlot;
      e.classList.toggle("selected", a);
    });
  },
  // Update hotbar display with item counts and icons
  updateHotbarDisplay() {
    document.querySelectorAll(".hotbar-slot").forEach((e, i) => {
      const a = this.inventory.hotbar[i], s = i === this.selectedSlot;
      e.classList.toggle("selected", s), a && a.count ? e.setAttribute("data-count", a.count) : e.setAttribute("data-count", "");
      let c = e.querySelector("canvas");
      if (c || (c = document.createElement("canvas"), c.width = 32, c.height = 32, c.style.width = "100%", c.style.height = "100%", c.style.position = "absolute", c.style.top = "2px", c.style.left = "2px", e.appendChild(c)), a) {
        this.drawMiniBlock(c, a.id);
        let f = e.querySelector(".durability-bar");
        if (a.durability !== void 0 && a.maxDurability) {
          f || (f = document.createElement("div"), f.className = "durability-bar", f.innerHTML = '<div class="durability-fill"></div>', e.appendChild(f));
          const h = f.querySelector(".durability-fill"), n = a.durability / a.maxDurability * 100;
          h.style.width = n + "%", h.style.backgroundColor = n > 50 ? "#4a4" : n > 25 ? "#aa4" : "#a44", f.style.display = "block";
        } else f && (f.style.display = "none");
      } else {
        c.getContext("2d").clearRect(0, 0, c.width, c.height);
        const h = e.querySelector(".durability-bar");
        h && (h.style.display = "none");
      }
    });
  },
  // Shoot the AK-47
  shootAK47() {
    if (this.shootCooldown > 0) return;
    const t = this.inventory.hotbar[this.selectedSlot];
    if (t && t.id === "ak47") {
      if (t.durability !== void 0 && t.durability <= 0)
        return;
      t.durability !== void 0 && (t.durability--, t.durability <= 0 && (this.inventory.hotbar[this.selectedSlot] = null, this.selectedItem = null, this.showPickupNotification("ak47", -1)), this.updateHotbarDisplay());
    }
    this.shootCooldown = 8, this.muzzleFlash = 5;
    const e = this.camera.rotX, i = this.camera.rotY, a = -Math.sin(i) * Math.cos(e), s = -Math.sin(e), c = Math.cos(i) * Math.cos(e), f = 2.5, h = {
      x: this.camera.x + a * 0.5,
      y: this.camera.y + s * 0.5,
      z: this.camera.z + c * 0.5,
      vx: a * f,
      vy: s * f,
      vz: c * f,
      life: 60,
      type: "bullet",
      trail: []
    };
    this.particles.push(h);
    const n = 0.8;
    let d = null, m = 1 / 0;
    for (const u of this.pestBirds) {
      const y = u.x - this.camera.x, b = u.y - this.camera.y, T = u.z - this.camera.z, P = Math.sqrt(y * y + b * b + T * T);
      if (P < 15 && P < m) {
        const L = y / P, z = b / P, R = T / P;
        a * L + s * z + c * R > 0.9 && (d = u, m = P);
      }
    }
    if (d) {
      d.vx = a * n + (Math.random() - 0.5) * 0.2, d.vy = s * n + 0.3 + Math.random() * 0.2, d.vz = c * n + (Math.random() - 0.5) * 0.2, d.state = "knockback", d.stateTimer = 90;
      for (let z = 0; z < 8; z++) {
        const R = 0.15 + Math.random() * 0.2, I = -a * 0.5 + (Math.random() - 0.5) * 1.5, E = Math.random() * 0.8 + 0.2, H = -c * 0.5 + (Math.random() - 0.5) * 1.5, D = Math.sqrt(I * I + E * E + H * H);
        this.particles.push({
          x: d.x,
          y: d.y,
          z: d.z,
          vx: I / D * R,
          vy: E / D * R,
          vz: H / D * R,
          life: 25 + Math.random() * 20,
          type: "ricochet",
          size: 2 + Math.random() * 3
        });
      }
      for (let z = 0; z < 5; z++)
        this.particles.push({
          x: d.x + (Math.random() - 0.5) * 0.3,
          y: d.y + (Math.random() - 0.5) * 0.3,
          z: d.z + (Math.random() - 0.5) * 0.3,
          vx: (Math.random() - 0.5) * 0.1,
          vy: 0.05 + Math.random() * 0.05,
          vz: (Math.random() - 0.5) * 0.1,
          life: 40 + Math.random() * 30,
          type: "feather",
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.3
        });
      const u = 0.08 + Math.random() * 0.05;
      this.velocity.y += 0.05 + Math.random() * 0.03;
      const y = d.x - this.camera.x, b = d.z - this.camera.z, T = Math.sqrt(y * y + b * b);
      T > 0.1 && (this.camera.x -= y / T * u * 0.3 + (Math.random() - 0.5) * u, this.camera.z -= b / T * u * 0.3 + (Math.random() - 0.5) * u);
      const P = Math.random();
      let L = 0;
      P < 0.01 ? L = 20 : P < 0.1 && (L = 5);
      for (let z = 0; z < L; z++) {
        const R = Math.random() * Math.PI * 2, I = 2 + Math.random() * 3;
        this.pestBirds.push({
          x: d.x + Math.cos(R) * I,
          y: d.y + (Math.random() - 0.5) * 2,
          z: d.z + Math.sin(R) * I,
          vx: 0,
          vy: 0,
          vz: 0,
          targetOffsetX: 0,
          targetOffsetY: 0,
          targetOffsetZ: 0,
          state: "circling",
          stateTimer: 10 + Math.random() * 20,
          angle: R,
          circleRadius: I,
          baseCircleRadius: I,
          circleSpeed: 0.07 + Math.random() * 0.05,
          swoopProgress: 0,
          wingPhase: Math.random() * Math.PI * 2,
          size: 0.15 + Math.random() * 0.08,
          chirpTimer: Math.random() * 30,
          knockbackSpin: 0,
          anger: 1 + Math.floor(Math.random() * 3),
          // Spawned angry (1-3)
          timesShot: 0,
          spawnThreshold: 4 + Math.floor(Math.random() * 4)
        });
      }
    }
    for (const u of this.birds) {
      const y = u.x - this.camera.x, b = u.y - this.camera.y, T = u.z - this.camera.z, P = Math.sqrt(y * y + b * b + T * T);
      if (P < 25) {
        const L = y / P, z = b / P, R = T / P;
        if (a * L + s * z + c * R > 0.85) {
          u.radius += 8, u.baseY += 5;
          for (let E = 0; E < 5; E++)
            this.particles.push({
              x: u.x,
              y: u.y,
              z: u.z,
              vx: (Math.random() - 0.5) * 0.3,
              vy: Math.random() * 0.2,
              vz: (Math.random() - 0.5) * 0.3,
              life: 20 + Math.random() * 15,
              type: "ricochet",
              size: 2 + Math.random() * 2
            });
        }
      }
    }
  },
  // Update particles
  updateParticles() {
    for (let t = this.particles.length - 1; t >= 0; t--) {
      const e = this.particles[t];
      if (e.life--, e.life <= 0) {
        this.particles.splice(t, 1);
        continue;
      }
      if (e.x += e.vx, e.y += e.vy, e.z += e.vz, e.type === "bullet") {
        e.trail.push({ x: e.x, y: e.y, z: e.z }), e.trail.length > 8 && e.trail.shift();
        const i = Math.floor(e.x), a = Math.floor(e.y), s = Math.floor(e.z);
        if (this.getBlock(i, a, s)) {
          for (let c = 0; c < 6; c++)
            this.particles.push({
              x: e.x,
              y: e.y,
              z: e.z,
              vx: (Math.random() - 0.5) * 0.2,
              vy: Math.random() * 0.15,
              vz: (Math.random() - 0.5) * 0.2,
              life: 15 + Math.random() * 10,
              type: "spark",
              size: 2 + Math.random() * 2
            });
          this.particles.splice(t, 1);
        }
      } else if (e.type === "ricochet" || e.type === "spark")
        e.vy -= 8e-3, e.vx *= 0.97, e.vz *= 0.97;
      else if (e.type === "feather")
        e.vy -= 2e-3, e.vx *= 0.98, e.vz *= 0.98, e.rotation += e.rotSpeed;
      else if (e.type === "burger") {
        e.vy -= 3e-3;
        for (const i of this.pestBirds) {
          const a = i.x - e.x, s = i.y - e.y, c = i.z - e.z, f = Math.sqrt(a * a + s * s + c * c);
          if (f < 1.5) {
            i.vx = e.vx * 0.5 + a / f * 2.5, i.vy = Math.abs(e.vy) + 0.5, i.vz = e.vz * 0.5 + c / f * 2.5, i.state = "knockback", i.stateTimer = 120, i.anger = Math.min(5, i.anger + 2), e.life = 0;
            for (let n = 0; n < 8; n++)
              this.particles.push({
                x: e.x,
                y: e.y,
                z: e.z,
                vx: (Math.random() - 0.5) * 0.3,
                vy: Math.random() * 0.2,
                vz: (Math.random() - 0.5) * 0.3,
                life: 20,
                type: "burgerSplat",
                size: 3 + Math.random() * 3
              });
          }
        }
      } else if (e.type === "burgerSplat")
        e.vy -= 0.01, e.vx *= 0.95, e.vz *= 0.95;
      else if (e.type === "apple") {
        e.vy += e.gravity || -8e-3;
        for (const a of this.pestBirds) {
          const s = a.x - e.x, c = a.y - e.y, f = a.z - e.z, h = Math.sqrt(s * s + c * c + f * f);
          if (h < 1.5) {
            a.vx = e.vx * 0.5 + s / h * 3, a.vy = 0.8, a.vz = e.vz * 0.5 + f / h * 3, a.state = "knockback", a.stateTimer = 180, a.anger = Math.max(0, a.anger - 0.5), e.life = 0, this.survivalStats && (this.survivalStats.score += 50, this.updateSurvivalHUD());
            for (let d = 0; d < 6; d++)
              this.particles.push({
                x: e.x,
                y: e.y,
                z: e.z,
                vx: (Math.random() - 0.5) * 0.3,
                vy: Math.random() * 0.2,
                vz: (Math.random() - 0.5) * 0.3,
                life: 15,
                type: "appleSplat",
                size: 2 + Math.random() * 2
              });
          }
        }
        for (const a of this.birds)
          if (a.swarmMode) {
            const s = a.x - e.x, c = a.y - e.y, f = a.z - e.z;
            Math.sqrt(s * s + c * c + f * f) < 2 && (a.swarmMode = !1, a.swarmTimer = 0, e.life = 0, this.survivalStats && (this.survivalStats.score += 25, this.updateSurvivalHUD()));
          }
        const i = this.getGroundHeightBelow(e.x, e.z, e.y + 10);
        e.y <= i + 0.5 && (e.life = 0);
      } else e.type === "appleSplat" ? (e.vy -= 0.015, e.vx *= 0.9, e.vz *= 0.9) : e.type === "petal" && (e.vy -= 8e-4, e.vx += this.wind.x * 0.15, e.vz += this.wind.z * 0.15, e.vx *= 0.985, e.vz *= 0.985, e.rotation += e.rotSpeed + this.wind.x * 0.08, e.flutter += e.flutterSpeed || 0.08, e.x += Math.sin(e.flutter) * 0.025, e.y += Math.cos(e.flutter * 1.3) * 8e-3, e.z += Math.cos(e.flutter * 0.7) * 0.015, e.y < this.getGroundHeightBelow(e.x, e.z, e.y + 10) + 1 && (e.life = 0));
    }
  },
  // Wind system - creates natural gusts that affect petals and birds
  updateWind() {
    if (this.wind.gustTimer++, this.wind.gustTimer > 120 + Math.random() * 180) {
      this.wind.gustTimer = 0;
      const t = 0.01 + Math.random() * 0.04, e = Math.random() * Math.PI * 2;
      this.wind.targetX = Math.cos(e) * t, this.wind.targetZ = Math.sin(e) * t;
    }
    this.wind.x += (this.wind.targetX - this.wind.x) * 0.02, this.wind.z += (this.wind.targetZ - this.wind.z) * 0.02, this.wind.x += (Math.random() - 0.5) * 2e-3, this.wind.z += (Math.random() - 0.5) * 2e-3;
  },
  // Spawn cherry blossom petals near trees
  updatePetals() {
    if (!this.cherryTrees || this.cherryTrees.length === 0) return;
    const t = this.particles.filter((a) => a.type === "petal").length, e = 150, i = Math.min(5, e - t);
    for (let a = 0; a < i; a++) {
      if (Math.random() > 0.6) continue;
      const s = this.cherryTrees[Math.floor(Math.random() * this.cherryTrees.length)], c = Math.sqrt((s.x - this.camera.x) ** 2 + (s.z - this.camera.z) ** 2), f = 40;
      if (c < f) {
        const h = 1 - c / f * 0.5;
        if (Math.random() < h) {
          const n = (Math.random() - 0.5) * 10, d = (Math.random() - 0.5) * 10, m = Math.random() < 0.3 ? Math.random() * 8 : 0;
          this.particles.push({
            x: s.x + n,
            y: s.y + Math.random() * 3 + m,
            z: s.z + d,
            vx: this.wind.x * 1.5 + (Math.random() - 0.5) * 0.03,
            vy: -8e-3 - Math.random() * 0.015,
            // Slower fall for more graceful effect
            vz: this.wind.z * 1.5 + (Math.random() - 0.5) * 0.03,
            life: 250 + Math.random() * 200,
            // Longer life
            type: "petal",
            size: 2.5 + Math.random() * 2.5,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.15,
            flutter: Math.random() * Math.PI * 2,
            flutterSpeed: 0.05 + Math.random() * 0.05
          });
        }
      }
    }
    if (t < e * 0.8 && Math.random() < 0.3) {
      const a = Math.random() * Math.PI * 2, s = 10 + Math.random() * 20;
      this.particles.push({
        x: this.camera.x + Math.cos(a) * s,
        y: this.camera.y + 5 + Math.random() * 10,
        z: this.camera.z + Math.sin(a) * s,
        vx: this.wind.x * 2 + (Math.random() - 0.5) * 0.02,
        vy: -5e-3 - Math.random() * 0.01,
        vz: this.wind.z * 2 + (Math.random() - 0.5) * 0.02,
        life: 150 + Math.random() * 100,
        type: "petal",
        size: 2 + Math.random() * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.12,
        flutter: Math.random() * Math.PI * 2,
        flutterSpeed: 0.04 + Math.random() * 0.04
      });
    }
  },
  // Drop an item on the ground
  dropItem(t, e, i, a, s) {
    this.droppedItems || (this.droppedItems = []), this.droppedItems.push({
      x: t + (Math.random() - 0.5) * 0.3,
      y: e,
      z: i + (Math.random() - 0.5) * 0.3,
      vy: 0.1 + Math.random() * 0.05,
      type: a,
      count: s,
      bobPhase: Math.random() * Math.PI * 2,
      pickupDelay: 30
      // Frames before can be picked up
    });
  },
  // Update dropped items (physics and pickup)
  updateDroppedItems() {
    if (this.droppedItems)
      for (let t = this.droppedItems.length - 1; t >= 0; t--) {
        const e = this.droppedItems[t];
        e.pickupDelay > 0 && e.pickupDelay--, e.vy -= 0.015, e.y += e.vy;
        const i = this.getGroundHeightBelow(e.x, e.z, e.y + 5) + 1.3;
        if (e.y < i && (e.y = i, e.vy = 0), e.bobPhase += 0.05, e.pickupDelay <= 0) {
          const a = e.x - this.camera.x, s = e.y - this.camera.y, c = e.z - this.camera.z;
          Math.sqrt(a * a + s * s + c * c) < 2 && this.addToInventory(e.type, e.count) && this.droppedItems.splice(t, 1);
        }
      }
  },
  // Add item to inventory (hotbar first, then main inventory)
  addToInventory(t, e) {
    let i = "block";
    (t === "ak47" || t === "berdger") && (i = "weapon"), (t === "water_bucket" || t === "lava_bucket") && (i = "bucket"), this.ritualItems && this.ritualItems.includes(t) && (i = "item"), (t === "seeds" || t === "apple") && (i = "item"), this.showPickupNotification(t, e);
    for (let a = 0; a < 9; a++) {
      const s = this.inventory.hotbar[a];
      if (s && (s.id === t || s.type === t) && s.count < 64) {
        const c = Math.min(e, 64 - s.count);
        if (s.count += c, e -= c, e <= 0)
          return this.updateHotbarDisplay(), !0;
      }
    }
    for (let a = 0; a < 27; a++) {
      const s = this.inventory.main[a];
      if (s && (s.id === t || s.type === t) && s.count < 64) {
        const c = Math.min(e, 64 - s.count);
        if (s.count += c, e -= c, e <= 0)
          return this.updateHotbarDisplay(), !0;
      }
    }
    for (let a = 0; a < 9; a++)
      if (!this.inventory.hotbar[a]) {
        const s = this.itemTypes[t] || {};
        return this.inventory.hotbar[a] = {
          type: i,
          id: t,
          count: e,
          durability: s.durability,
          maxDurability: s.maxDurability
        }, this.updateHotbarDisplay(), !0;
      }
    for (let a = 0; a < 27; a++)
      if (!this.inventory.main[a]) {
        const s = this.itemTypes[t] || {};
        return this.inventory.main[a] = {
          type: i,
          id: t,
          count: e,
          durability: s.durability,
          maxDurability: s.maxDurability
        }, this.updateHotbarDisplay(), !0;
      }
    return !1;
  },
  // Show pickup notification (uses batch queue for multiple pickups)
  showPickupNotification(t, e) {
    if (e < 0) {
      const i = document.getElementById("pickupNotification");
      if (!i) return;
      const a = {
        grass: "Grass Block",
        dirt: "Dirt",
        stone: "Stone",
        wood: "Wood",
        appleLeaves: "Apple Leaves",
        leaves: "Leaves",
        sand: "Sand",
        brick: "Brick",
        ak47: "AK-47",
        water_bucket: "Water Bucket",
        lava_bucket: "Lava Bucket",
        obsidian: "Obsidian",
        cherryWood: "Cherry Wood",
        cherryLeaves: "Cherry Leaves",
        chest: "Chest",
        seeds: "Seeds",
        berdger: "The Berdger",
        apple: "Apple",
        sakuraPetal: "Cherry Petal",
        shimenawa: "Sacred Rope",
        omamori: "Charm",
        ema: "Wish Plaque",
        incense: "Incense",
        whiteBrick: "White Brick",
        redBrick: "Red Brick",
        glowstone: "Glowstone",
        ritualStone: "Ritual Stone"
      }, s = document.createElement("div");
      s.className = "pickup-item", s.style.borderColor = "rgba(255, 50, 50, 0.8)", s.innerHTML = `
                        <span class="pickup-icon">💔</span>
                        <span style="color:#ff6666">${a[t] || t} broke!</span>
                    `, i.appendChild(s), setTimeout(() => {
        s.parentNode && s.parentNode.removeChild(s);
      }, 2e3);
      return;
    }
    this.queuePickupNotification(t, e);
  },
  // Draw a mini 3D block for inventory display
  drawMiniBlock(t, e) {
    const i = t.getContext("2d"), a = this.blockColors[e], s = t.width, c = t.height;
    i.clearRect(0, 0, s, c);
    const f = s / 2, h = c / 2, n = Math.min(s, c) * 0.35;
    if (!a) {
      if (i.save(), i.translate(f, h), e === "apple")
        i.fillStyle = "#dc143c", i.beginPath(), i.arc(0, 0, n * 0.7, 0, Math.PI * 2), i.fill(), i.fillStyle = "rgba(255,255,255,0.3)", i.beginPath(), i.arc(-n * 0.2, -n * 0.2, n * 0.25, 0, Math.PI * 2), i.fill(), i.fillStyle = "#654321", i.fillRect(-1, -n * 0.8, 3, n * 0.3), i.fillStyle = "#228b22", i.beginPath(), i.ellipse(3, -n * 0.7, 4, 2, 0.3, 0, Math.PI * 2), i.fill();
      else if (e === "seeds") {
        i.fillStyle = "#daa520";
        for (let b = 0; b < 5; b++) {
          const T = b / 5 * Math.PI * 2, P = Math.cos(T) * n * 0.4, L = Math.sin(T) * n * 0.3;
          i.beginPath(), i.ellipse(P, L, 3, 5, T, 0, Math.PI * 2), i.fill();
        }
      } else e === "ak47" ? (i.fillStyle = "#333", i.fillRect(-n * 0.6, -n * 0.1, n * 1.2, n * 0.25), i.fillStyle = "#8b4513", i.fillRect(-n * 0.3, n * 0.1, n * 0.4, n * 0.4), i.fillStyle = "#222", i.fillRect(n * 0.1, n * 0.1, n * 0.15, n * 0.35)) : e === "berdger" ? (i.fillStyle = "#daa520", i.beginPath(), i.ellipse(0, -n * 0.3, n * 0.5, n * 0.25, 0, 0, Math.PI * 2), i.fill(), i.fillStyle = "#8b4513", i.fillRect(-n * 0.4, -n * 0.15, n * 0.8, n * 0.2), i.fillStyle = "#228b22", i.fillRect(-n * 0.35, -n * 0.05, n * 0.7, n * 0.1), i.fillStyle = "#daa520", i.beginPath(), i.ellipse(0, n * 0.2, n * 0.55, n * 0.3, 0, 0, Math.PI * 2), i.fill()) : e === "water_bucket" || e === "lava_bucket" ? (i.fillStyle = "#888", i.beginPath(), i.moveTo(-n * 0.4, -n * 0.3), i.lineTo(n * 0.4, -n * 0.3), i.lineTo(n * 0.3, n * 0.5), i.lineTo(-n * 0.3, n * 0.5), i.closePath(), i.fill(), i.fillStyle = e === "water_bucket" ? "#4a90d9" : "#ff6600", i.beginPath(), i.moveTo(-n * 0.3, -n * 0.1), i.lineTo(n * 0.3, -n * 0.1), i.lineTo(n * 0.25, n * 0.4), i.lineTo(-n * 0.25, n * 0.4), i.closePath(), i.fill()) : e === "sakuraPetal" ? (i.fillStyle = "#ffb7c5", i.beginPath(), i.ellipse(0, 0, n * 0.6, n * 0.3, 0.3, 0, Math.PI * 2), i.fill()) : e === "shimenawa" ? (i.strokeStyle = "#daa520", i.lineWidth = 4, i.beginPath(), i.moveTo(-n * 0.5, 0), i.quadraticCurveTo(0, -n * 0.4, n * 0.5, 0), i.stroke()) : e === "omamori" ? (i.fillStyle = "#cc0000", i.fillRect(-n * 0.3, -n * 0.5, n * 0.6, n), i.fillStyle = "#ffd700", i.fillRect(-n * 0.25, -n * 0.35, n * 0.5, n * 0.15)) : e === "ema" ? (i.fillStyle = "#deb887", i.beginPath(), i.moveTo(0, -n * 0.5), i.lineTo(n * 0.4, -n * 0.2), i.lineTo(n * 0.4, n * 0.4), i.lineTo(-n * 0.4, n * 0.4), i.lineTo(-n * 0.4, -n * 0.2), i.closePath(), i.fill()) : e === "incense" ? (i.fillStyle = "#8b4513", i.fillRect(-1, -n * 0.6, 3, n * 1.2), i.fillStyle = "#ff6600", i.beginPath(), i.arc(0.5, -n * 0.6, 3, 0, Math.PI * 2), i.fill()) : (i.fillStyle = "#888", i.fillRect(-n * 0.4, -n * 0.4, n * 0.8, n * 0.8), i.fillStyle = "#444", i.font = "8px monospace", i.textAlign = "center", i.fillText("?", 0, 3));
      i.restore();
      return;
    }
    const d = Math.min(s, c) * 0.25;
    let m = a.top, u = a.side;
    typeof m == "string" && m.includes("rgba") && (m = m.replace(/[\d.]+\)$/, "1)"), u = u.replace(/[\d.]+\)$/, "1)")), i.fillStyle = m, i.beginPath(), i.moveTo(f, h - d), i.lineTo(f + d, h - d / 2), i.lineTo(f, h), i.lineTo(f - d, h - d / 2), i.closePath(), i.fill(), i.fillStyle = u, i.beginPath(), i.moveTo(f - d, h - d / 2), i.lineTo(f, h), i.lineTo(f, h + d), i.lineTo(f - d, h + d / 2), i.closePath(), i.fill();
    let y;
    try {
      y = this.darkenColor(u.replace(/rgba?\([^)]+\)/, "#888888"), 0.7);
    } catch {
      y = this.darkenColor(u, 0.7);
    }
    i.fillStyle = y, i.beginPath(), i.moveTo(f, h), i.lineTo(f + d, h - d / 2), i.lineTo(f + d, h + d / 2), i.lineTo(f, h + d), i.closePath(), i.fill(), i.strokeStyle = "rgba(0,0,0,0.3)", i.lineWidth = 0.5, i.beginPath(), i.moveTo(f, h - n), i.lineTo(f + n, h - n / 2), i.lineTo(f + n, h + n / 2), i.lineTo(f, h + n), i.lineTo(f - n, h + n / 2), i.lineTo(f - n, h - n / 2), i.closePath(), i.stroke();
  },
  // Draw 3D item for dropped items in the world
  drawDroppedItem3D(t, e, i, a, s, c) {
    const f = this.blockColors[s], h = (c || 0) * 0.5;
    if (t.save(), t.translate(e, i), !f) {
      if (s === "apple")
        t.fillStyle = "#dc143c", t.beginPath(), t.arc(0, 0, a * 0.8, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(255,255,255,0.3)", t.beginPath(), t.arc(-a * 0.2, -a * 0.2, a * 0.3, 0, Math.PI * 2), t.fill(), t.fillStyle = "#654321", t.fillRect(-1, -a * 0.9, 2, a * 0.3), t.fillStyle = "#228b22", t.beginPath(), t.ellipse(2, -a * 0.8, 3, 2, 0.3, 0, Math.PI * 2), t.fill();
      else if (s === "seeds") {
        t.fillStyle = "#daa520";
        for (let d = 0; d < 5; d++) {
          const m = d / 5 * Math.PI * 2 + h, u = Math.cos(m) * a * 0.4, y = Math.sin(m) * a * 0.3;
          t.beginPath(), t.ellipse(u, y, a * 0.2, a * 0.1, m, 0, Math.PI * 2), t.fill();
        }
      } else s === "ak47" ? (t.fillStyle = "#333", t.fillRect(-a * 0.8, -a * 0.15, a * 1.6, a * 0.3), t.fillRect(-a * 0.3, -a * 0.15, a * 0.15, a * 0.5), t.fillRect(a * 0.3, -a * 0.4, a * 0.5, a * 0.25)) : s === "berdger" ? (t.fillStyle = "#D2691E", t.beginPath(), t.ellipse(0, -a * 0.2, a * 0.7, a * 0.35, 0, Math.PI, 0), t.fill(), t.fillStyle = "#654321", t.fillRect(-a * 0.6, -a * 0.1, a * 1.2, a * 0.25), t.fillStyle = "#228B22", t.fillRect(-a * 0.55, a * 0.1, a * 1.1, a * 0.1), t.fillStyle = "#DEB887", t.beginPath(), t.ellipse(0, a * 0.25, a * 0.65, a * 0.3, 0, 0, Math.PI), t.fill()) : s === "water_bucket" || s === "lava_bucket" ? (t.fillStyle = "#888", t.beginPath(), t.moveTo(-a * 0.5, -a * 0.5), t.lineTo(a * 0.5, -a * 0.5), t.lineTo(a * 0.4, a * 0.5), t.lineTo(-a * 0.4, a * 0.5), t.closePath(), t.fill(), t.fillStyle = s === "water_bucket" ? "#4a90d9" : "#ff6600", t.fillRect(-a * 0.35, -a * 0.3, a * 0.7, a * 0.6), t.strokeStyle = "#666", t.lineWidth = 2, t.beginPath(), t.arc(0, -a * 0.6, a * 0.4, Math.PI * 0.2, Math.PI * 0.8), t.stroke()) : s === "sakuraPetal" ? (t.fillStyle = "#ffb7c5", t.beginPath(), t.ellipse(0, 0, a * 0.6, a * 0.3, h, 0, Math.PI * 2), t.fill()) : s === "shimenawa" ? (t.strokeStyle = "#daa520", t.lineWidth = a * 0.2, t.beginPath(), t.moveTo(-a * 0.6, 0), t.bezierCurveTo(-a * 0.3, -a * 0.4, a * 0.3, a * 0.4, a * 0.6, 0), t.stroke()) : s === "omamori" ? (t.fillStyle = "#ff4444", t.fillRect(-a * 0.3, -a * 0.5, a * 0.6, a * 0.8), t.fillStyle = "#gold", t.fillRect(-a * 0.2, -a * 0.4, a * 0.4, a * 0.15)) : s === "ema" ? (t.fillStyle = "#deb887", t.beginPath(), t.moveTo(0, -a * 0.6), t.lineTo(a * 0.5, -a * 0.2), t.lineTo(a * 0.5, a * 0.5), t.lineTo(-a * 0.5, a * 0.5), t.lineTo(-a * 0.5, -a * 0.2), t.closePath(), t.fill()) : s === "incense" ? (t.fillStyle = "#8b4513", t.fillRect(-1, -a * 0.6, 2, a * 1.2), t.fillStyle = "#ff6600", t.beginPath(), t.arc(0, -a * 0.6, 3, 0, Math.PI * 2), t.fill()) : (t.fillStyle = "#888", t.fillRect(-a * 0.5, -a * 0.5, a, a));
      t.restore();
      return;
    }
    const n = a * 0.8;
    t.fillStyle = f.top, t.beginPath(), t.moveTo(0, -n), t.lineTo(n, -n / 2), t.lineTo(0, 0), t.lineTo(-n, -n / 2), t.closePath(), t.fill(), t.fillStyle = f.side, t.beginPath(), t.moveTo(-n, -n / 2), t.lineTo(0, 0), t.lineTo(0, n), t.lineTo(-n, n / 2), t.closePath(), t.fill(), t.fillStyle = this.darkenColor(f.side, 0.7), t.beginPath(), t.moveTo(0, 0), t.lineTo(n, -n / 2), t.lineTo(n, n / 2), t.lineTo(0, n), t.closePath(), t.fill(), t.strokeStyle = "rgba(0,0,0,0.4)", t.lineWidth = 1, t.beginPath(), t.moveTo(0, -n), t.lineTo(n, -n / 2), t.lineTo(n, n / 2), t.lineTo(0, n), t.lineTo(-n, n / 2), t.lineTo(-n, -n / 2), t.closePath(), t.stroke(), t.restore();
  },
  // Use seeds to calm birds
  useSeeds() {
    const t = this.inventory.hotbar[this.selectedSlot];
    if (t && t.id === "seeds" && t.count > 0) {
      t.count--, t.count <= 0 && (this.inventory.hotbar[this.selectedSlot] = null, this.selectedItem = null), this.updateHotbarDisplay(), this.seedCalmTimer = 600;
      for (let e = 0; e < 10; e++)
        this.particles.push({
          x: this.camera.x + (Math.random() - 0.5) * 2,
          y: this.camera.y - 0.5,
          z: this.camera.z + (Math.random() - 0.5) * 2,
          vx: (Math.random() - 0.5) * 0.2,
          vy: 0.1 + Math.random() * 0.1,
          vz: (Math.random() - 0.5) * 0.2,
          life: 60,
          type: "spark",
          size: 2
        });
      return !0;
    }
    return !1;
  },
  // Shoot the berdger (burger launcher)
  shootBerdger() {
    const t = this.inventory.hotbar[this.selectedSlot];
    if (t && t.id === "berdger") {
      const e = this.camera.rotX, i = this.camera.rotY, a = Math.cos(e), s = Math.sin(e), c = -Math.sin(i) * a, f = -s, h = Math.cos(i) * a;
      return this.particles.push({
        x: this.camera.x + c * 0.5,
        y: this.camera.y + f * 0.5,
        z: this.camera.z + h * 0.5,
        vx: c * 0.8,
        vy: f * 0.8,
        vz: h * 0.8,
        life: 120,
        type: "burger",
        size: 8,
        trail: []
      }), !0;
    }
    return !1;
  },
  // Throw an apple at birds
  throwApple() {
    const t = this.inventory.hotbar[this.selectedSlot];
    if (t && t.id === "apple" && t.count > 0) {
      t.count--, t.count <= 0 && (this.inventory.hotbar[this.selectedSlot] = null, this.selectedItem = null), this.updateHotbarDisplay();
      const e = this.camera.rotX, i = this.camera.rotY, a = Math.cos(e), s = Math.sin(e), c = -Math.sin(i) * a, f = -s, h = Math.cos(i) * a;
      return this.particles.push({
        x: this.camera.x + c * 0.5,
        y: this.camera.y + f * 0.5,
        z: this.camera.z + h * 0.5,
        vx: c * 0.6,
        vy: f * 0.6 + 0.1,
        // Slight arc
        vz: h * 0.6,
        life: 180,
        type: "apple",
        size: 6,
        gravity: -8e-3
      }), !0;
    }
    return !1;
  },
  // Check and complete ritual
  checkRitual() {
    if (this.ritualComplete) return;
    const t = {};
    for (const i of this.ritualItems)
      t[i] = !1;
    for (let i = 0; i < 9; i++) {
      const a = this.inventory.hotbar[i];
      a && this.ritualItems.includes(a.id) && (t[a.id] = !0);
    }
    if (this.ritualItems.every((i) => t[i])) {
      this.ritualComplete = !0, this.ritualBlessingActive = !0, this.ritualBlessingTimer = 36e3;
      for (let i = 0; i < 9; i++) {
        const a = this.inventory.hotbar[i];
        a && this.ritualItems.includes(a.id) && (this.inventory.hotbar[i] = null);
      }
      this.updateHotbarDisplay();
      for (const i of this.pestBirds)
        i.anger = 0, i.state = "circling";
      for (let i = 0; i < 50; i++)
        this.particles.push({
          x: this.camera.x + (Math.random() - 0.5) * 8,
          y: this.camera.y + Math.random() * 5,
          z: this.camera.z + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.1,
          vy: 0.05 + Math.random() * 0.1,
          vz: (Math.random() - 0.5) * 0.1,
          life: 120 + Math.random() * 60,
          type: "petal",
          size: 4 + Math.random() * 3,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          flutter: Math.random() * Math.PI * 2
        });
      return !0;
    }
    return !1;
  },
  // Interact with ritual socket blocks
  interactWithSocket(t, e, i, a) {
    const s = {
      petalSocket: "sakuraPetal",
      ropeSocket: "shimenawa",
      charmSocket: "omamori",
      plaqueSocket: "ema",
      incenseSocket: "incense"
    }, c = {
      petalSocket: "petalSocketFilled",
      ropeSocket: "ropeSocketFilled",
      charmSocket: "charmSocketFilled",
      plaqueSocket: "plaqueSocketFilled",
      incenseSocket: "incenseSocketFilled"
    }, f = s[a];
    if (!f || a.includes("Filled")) return;
    const h = this.inventory.hotbar[this.selectedSlot];
    if (h && h.id === f && h.count > 0) {
      h.count--, h.count <= 0 && (this.inventory.hotbar[this.selectedSlot] = null), this.updateHotbarDisplay(), this.setBlock(t, e, i, c[a]), this.socketsFilled || (this.socketsFilled = {}), this.socketsFilled[a] = !0;
      for (let d = 0; d < 20; d++)
        this.particles.push({
          x: t + 0.5 + (Math.random() - 0.5) * 0.5,
          y: e + 1 + Math.random() * 0.5,
          z: i + 0.5 + (Math.random() - 0.5) * 0.5,
          vx: (Math.random() - 0.5) * 0.1,
          vy: 0.1 + Math.random() * 0.1,
          vz: (Math.random() - 0.5) * 0.1,
          life: 60 + Math.random() * 40,
          type: "spark",
          size: 3 + Math.random() * 2
        });
      if (Object.keys(s).every(
        (d) => this.socketsFilled && this.socketsFilled[d]
      ) && !this.ritualComplete) {
        if (this.ritualComplete = !0, this.ritualBlessingActive = !0, this.ritualBlessingTimer = 60 * 60 * 10, this.triggerRitualReward(), this.pestBirds)
          for (const d of this.pestBirds)
            d.anger = 0, d.state = "fleeing", d.stateTimer = 600;
        this.survivalStats && (this.survivalStats.score += 5e3, this.survivalStats.currentObjective = { text: "Blessing active - birds flee!", type: "complete" }, this.updateSurvivalHUD());
        for (let d = 0; d < 100; d++)
          this.particles.push({
            x: t + 0.5 + (Math.random() - 0.5) * 10,
            y: e + Math.random() * 8,
            z: i + 0.5 + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 0.15,
            vy: 0.1 + Math.random() * 0.15,
            vz: (Math.random() - 0.5) * 0.15,
            life: 180 + Math.random() * 120,
            type: "petal",
            size: 4 + Math.random() * 4,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.2,
            flutter: Math.random() * Math.PI * 2
          });
      }
    }
  },
  // Open chest UI - simply take all items
  openChest(t, e, i) {
    this.chestContents || (this.chestContents = {});
    const a = `${t},${e},${i}`, s = this.chestContents[a];
    if (s && Array.isArray(s) && s.length > 0) {
      for (const c of s) {
        if (!c) continue;
        const f = c.type || c.id, h = c.count || 1;
        f && (this.addToInventory(f, h) || this.dropItem(t + 0.5, e + 1.5, i + 0.5, f, h));
      }
      this.chestContents[a] = [], this.updateHotbarDisplay();
    }
  },
  // Drop currently held item
  dropHeldItem() {
    const t = this.inventory.hotbar[this.selectedSlot];
    if (t && t.count > 0) {
      const e = -Math.sin(this.camera.rotY), i = Math.cos(this.camera.rotY), a = t.id || t.type;
      this.dropItem(
        this.camera.x + e * 1.5,
        this.camera.y,
        this.camera.z + i * 1.5,
        a,
        1
      ), t.count--, t.count <= 0 && (this.inventory.hotbar[this.selectedSlot] = null, this.selectedItem = null), this.updateHotbarDisplay();
    }
  },
  // Debug console system
  debugConsoleOpen: !1,
  debugNoclip: !1,
  debugGodMode: !1,
  debugShowCoords: !1,
  debugFly: !1,
  debugMoveSpeed: null,
  toggleDebugConsole() {
    this.debugConsoleOpen = !this.debugConsoleOpen;
    const t = document.getElementById("debugConsole");
    if (t && (t.classList.toggle("active", this.debugConsoleOpen), this.debugConsoleOpen)) {
      const e = document.getElementById("debugInput");
      e && setTimeout(() => e.focus(), 50), this.debugLog('Debug console opened. Type "help" for commands.', "info");
    }
  },
  setupDebugConsole() {
    const t = document.getElementById("debugInput");
    t && (t.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const i = t.value.trim();
        i && (this.executeDebugCommand(i), t.value = "");
      }
      (e.key === "`" || e.key === "~") && (e.preventDefault(), this.toggleDebugConsole()), e.stopPropagation();
    }), t.addEventListener("keyup", (e) => e.stopPropagation()));
  },
  debugLog(t, e = "normal") {
    const i = document.getElementById("debugOutput");
    if (i) {
      const a = document.createElement("div");
      for (a.className = e, a.textContent = `> ${t}`, i.appendChild(a), i.scrollTop = i.scrollHeight; i.children.length > 100; )
        i.removeChild(i.firstChild);
    }
  },
  executeDebugCommand(t) {
    const e = t.toLowerCase().split(" "), i = e[0], a = e.slice(1);
    switch (this.debugLog(t, "normal"), i) {
      case "help":
        this.debugLog("Commands:", "info"), this.debugLog("  noclip - Toggle flying through walls", "info"), this.debugLog("  god - Toggle invincibility", "info"), this.debugLog("  coords - Toggle coordinate display", "info"), this.debugLog("  tp <x> <y> <z> - Teleport to position", "info"), this.debugLog("  give <item> [count] - Give item", "info"), this.debugLog("  spawn <mob> [count] - Spawn mobs", "info"), this.debugLog("    mobs: bird, fish, cat, creeper, bluebird", "info"), this.debugLog("  time <ms> - Set bird event timer", "info"), this.debugLog("  kill - Kill all mobs", "info"), this.debugLog("  clear - Clear console", "info"), this.debugLog("  pos - Show current position", "info"), this.debugLog("  fly - Toggle flight mode", "info"), this.debugLog("  speed <value> - Set move speed", "info"), this.debugLog("  ritual - Complete ritual instantly", "info"), this.debugLog("  score <value> - Set score", "info"), this.debugLog("  temple - Teleport to ritual temple", "info");
        break;
      case "noclip":
        this.debugNoclip = !this.debugNoclip, this.debugLog(`Noclip: ${this.debugNoclip ? "ON" : "OFF"}`, this.debugNoclip ? "success" : "warn");
        break;
      case "god":
        this.debugGodMode = !this.debugGodMode, this.debugLog(`God mode: ${this.debugGodMode ? "ON" : "OFF"}`, this.debugGodMode ? "success" : "warn");
        break;
      case "coords":
        this.debugShowCoords = !this.debugShowCoords, this.debugLog(`Coords display: ${this.debugShowCoords ? "ON" : "OFF"}`, "success");
        break;
      case "fly":
        this.debugFly = !this.debugFly, this.debugLog(`Fly mode: ${this.debugFly ? "ON" : "OFF"}`, this.debugFly ? "success" : "warn");
        break;
      case "tp":
        if (a.length >= 3) {
          const d = parseFloat(a[0]), m = parseFloat(a[1]), u = parseFloat(a[2]);
          !isNaN(d) && !isNaN(m) && !isNaN(u) ? (this.camera.x = d, this.camera.y = m, this.camera.z = u, this.velocity = { x: 0, y: 0, z: 0 }, this.debugLog(`Teleported to ${d.toFixed(1)}, ${m.toFixed(1)}, ${u.toFixed(1)}`, "success")) : this.debugLog("Invalid coordinates", "error");
        } else
          this.debugLog("Usage: tp <x> <y> <z>", "error");
        break;
      case "temple":
        this.ritualTempleLocation ? (this.camera.x = this.ritualTempleLocation.x + 5, this.camera.y = this.ritualTempleLocation.y + 3, this.camera.z = this.ritualTempleLocation.z + 5, this.velocity = { x: 0, y: 0, z: 0 }, this.debugLog("Teleported to Ritual Temple", "success")) : this.debugLog("Temple not found", "error");
        break;
      case "pos":
        this.debugLog(`Position: ${this.camera.x.toFixed(2)}, ${this.camera.y.toFixed(2)}, ${this.camera.z.toFixed(2)}`, "info"), this.debugLog(`Rotation: ${(this.camera.rotX * 180 / Math.PI).toFixed(1)}°, ${(this.camera.rotY * 180 / Math.PI).toFixed(1)}°`, "info");
        break;
      case "give":
        if (a.length >= 1) {
          const d = a[0], m = a.length >= 2 ? parseInt(a[1]) : 1;
          this.blockColors[d] || this.itemTypes[d] ? (this.addToInventory(d, m), this.debugLog(`Given ${m}x ${d}`, "success")) : (this.debugLog(`Unknown item: ${d}`, "error"), this.debugLog("Items: " + Object.keys(this.itemTypes).slice(0, 10).join(", ") + "...", "info"));
        } else
          this.debugLog("Usage: give <item> [count]", "error");
        break;
      case "spawn":
        const s = a[0], c = a.length >= 2 ? parseInt(a[1]) : 1, f = ["bird", "pest", "fish", "cat", "creeper", "bluebird"];
        if (s === "bird" || s === "pest") {
          for (let d = 0; d < c; d++) this.spawnPestBird();
          this.debugLog(`Spawned ${c} pest bird(s)`, "success");
        } else if (s === "fish") {
          for (let d = 0; d < c; d++) this.spawnFish();
          this.debugLog(`Spawned ${c} fish`, "success");
        } else if (s === "cat") {
          for (let d = 0; d < c; d++) this.spawnCat();
          this.debugLog(`Spawned ${c} cat(s)`, "success");
        } else if (s === "creeper") {
          for (let d = 0; d < c; d++) this.spawnCreeper();
          this.debugLog(`Spawned ${c} creeper(s)`, "success");
        } else if (s === "bluebird") {
          for (let d = 0; d < c; d++) this.spawnBlueBird();
          this.debugLog(`Spawned ${c} blue bird(s)`, "success");
        } else
          this.debugLog("Usage: spawn <mob> [count]", "error"), this.debugLog("Mobs: " + f.join(", "), "info");
        break;
      case "kill":
        let h = 0;
        h += this.pestBirds ? this.pestBirds.length : 0, h += this.blueBirds ? this.blueBirds.length : 0, h += this.creepers ? this.creepers.length : 0, this.pestBirds = [], this.blueBirds = [], this.creepers = [], this.debugLog(`Killed ${h} mobs`, "success");
        break;
      case "time":
        if (a.length >= 1) {
          const d = parseInt(a[0]);
          !isNaN(d) && this.birdEvent && (this.birdEvent.timer = d, this.debugLog(`Bird event timer set to ${d}ms`, "success"));
        } else
          this.debugLog("Usage: time <ms>", "error");
        break;
      case "clear":
        const n = document.getElementById("debugOutput");
        n && (n.innerHTML = "");
        break;
      case "speed":
        a.length >= 1 ? (this.debugMoveSpeed = parseFloat(a[0]), this.debugLog(`Speed set to ${this.debugMoveSpeed}`, "success")) : this.debugLog("Usage: speed <value> (default: 0.12)", "error");
        break;
      case "ritual":
        this.ritualComplete = !0, this.ritualBlessingActive = !0, this.ritualBlessingTimer = 60 * 60 * 10, this.socketsFilled = {
          petalSocket: !0,
          ropeSocket: !0,
          charmSocket: !0,
          plaqueSocket: !0,
          incenseSocket: !0
        }, this.triggerRitualReward(), this.debugLog("Ritual completed!", "success");
        break;
      case "score":
        a.length >= 1 && this.survivalStats && (this.survivalStats.score = parseInt(a[0]), this.updateSurvivalHUD(), this.debugLog(`Score set to ${this.survivalStats.score}`, "success"));
        break;
      default:
        this.debugLog(`Unknown command: ${i}`, "error");
    }
  },
  // Ritual reward - creative bonus for completing the temple ritual
  triggerRitualReward() {
    this.birdEvent && this.showBirdAlert("🌸 DIVINE BLESSING ACTIVATED! 🌸"), this.ritualFlight = !0, this.ritualFlightTimer = 60 * 60 * 2, this.ritualBarrierActive = !0, this.addToInventory("berdger", 1), this.addToInventory("apple", 32), this.survivalStats && (this.survivalStats.score += 1e4, this.survivalStats.wave++, this.survivalStats.currentObjective = { text: "✨ Divine protection active!", type: "blessed" }, this.updateSurvivalHUD());
    for (const t of this.pestBirds)
      t.state = "fleeing", t.stateTimer = 1200, t.anger = 0;
    for (let t = 0; t < 100; t++)
      this.particles.push({
        x: this.camera.x + (Math.random() - 0.5) * 10,
        y: this.camera.y + Math.random() * 8 - 2,
        z: this.camera.z + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.15,
        vy: 0.1 + Math.random() * 0.2,
        vz: (Math.random() - 0.5) * 0.15,
        life: 200 + Math.random() * 100,
        type: "blessing",
        size: 4 + Math.random() * 4
      });
  },
  // Batch pickup notification system
  pickupQueue: {},
  pickupTimer: null,
  queuePickupNotification(t, e) {
    this.pickupQueue[t] || (this.pickupQueue[t] = 0), this.pickupQueue[t] += e, this.pickupTimer && clearTimeout(this.pickupTimer), this.pickupTimer = setTimeout(() => {
      this.flushPickupNotifications();
    }, 500);
  },
  flushPickupNotifications() {
    const t = document.getElementById("pickupNotification");
    if (!t) return;
    const e = {
      grass: "Grass Block",
      dirt: "Dirt",
      stone: "Stone",
      wood: "Wood",
      appleLeaves: "Apple Leaves",
      leaves: "Leaves",
      sand: "Sand",
      brick: "Brick",
      ak47: "AK-47",
      water_bucket: "Water Bucket",
      lava_bucket: "Lava Bucket",
      obsidian: "Obsidian",
      cherryWood: "Cherry Wood",
      cherryLeaves: "Cherry Leaves",
      chest: "Chest",
      seeds: "Seeds",
      berdger: "The Berdger",
      apple: "Apple",
      sakuraPetal: "Cherry Petal",
      shimenawa: "Sacred Rope",
      omamori: "Charm",
      ema: "Wish Plaque",
      incense: "Incense",
      whiteBrick: "White Brick",
      redBrick: "Red Brick",
      glowstone: "Glowstone",
      ritualStone: "Ritual Stone"
    };
    for (const [i, a] of Object.entries(this.pickupQueue)) {
      if (a === 0) continue;
      const s = document.createElement("div");
      s.className = "pickup-item";
      const c = document.createElement("canvas");
      c.width = 24, c.height = 24, this.drawMiniBlock(c, i), s.innerHTML = `
                        <span class="pickup-icon"></span>
                        <span>+${a} ${e[i] || i}</span>
                    `, s.querySelector(".pickup-icon").appendChild(c), t.appendChild(s), setTimeout(() => {
        s.parentNode && s.parentNode.removeChild(s);
      }, 2e3);
    }
    this.pickupQueue = {}, this.pickupTimer = null;
  },
  // Fluid dynamics simulation - not yet implemented
  // Fluid dynamics simulation - spreads water/lava realistically
  // Set fluid level at position
  setFluidLevel(t, e, i, a) {
    const s = `${t},${e},${i}`;
    a <= 0 ? delete this.fluidLevels[s] : this.fluidLevels[s] = Math.min(8, Math.max(1, a));
  },
  getFluidLevel(t, e, i) {
    return this.fluidLevels[`${t},${e},${i}`] || 0;
  },
  updateFluids() {
    if (this.fluidUpdateTimer || (this.fluidUpdateTimer = 0), this.fluidUpdateTimer++, this.fluidUpdateTimer < 8) return;
    this.fluidUpdateTimer = 0;
    const t = 2;
    let e = 0;
    for (; this.fluidUpdates.length > 0 && e < t; ) {
      const i = this.fluidUpdates.shift();
      e++;
      const a = this.getBlock(i.x, i.y, i.z);
      if (!a || !this.fluidBlocks.includes(a)) {
        this.setFluidLevel(i.x, i.y, i.z, 0);
        continue;
      }
      const s = i.level || 8, c = this.getBlock(i.x, i.y - 1, i.z);
      if (c === "water" && i.type === "lava") {
        this.setBlock(i.x, i.y - 1, i.z, "stone"), this.setFluidLevel(i.x, i.y - 1, i.z, 0);
        continue;
      } else if (c === "lava" && i.type === "water") {
        this.setBlock(i.x, i.y - 1, i.z, "obsidian"), this.setFluidLevel(i.x, i.y - 1, i.z, 0);
        continue;
      }
      if (!c) {
        this.setBlock(i.x, i.y - 1, i.z, i.type), this.setFluidLevel(i.x, i.y - 1, i.z, 8), this.fluidUpdates.push({
          x: i.x,
          y: i.y - 1,
          z: i.z,
          type: i.type,
          level: 8
          // Falling fluid has full level
        });
        continue;
      }
      const f = s - 1;
      if (!(f <= 0) && c && !this.fluidBlocks.includes(c)) {
        const h = [
          { x: 1, z: 0 },
          { x: -1, z: 0 },
          { x: 0, z: 1 },
          { x: 0, z: -1 }
        ];
        for (let n = h.length - 1; n > 0; n--) {
          const d = Math.floor(Math.random() * (n + 1));
          [h[n], h[d]] = [h[d], h[n]];
        }
        for (const n of h) {
          const d = i.x + n.x, m = i.z + n.z, u = this.getBlock(d, i.y, m), y = this.getFluidLevel(d, i.y, m);
          if (i.type === "lava" && u === "water") {
            this.setBlock(d, i.y, m, "stone"), this.setFluidLevel(d, i.y, m, 0);
            continue;
          } else if (i.type === "water" && u === "lava") {
            this.setBlock(d, i.y, m, "stone"), this.setFluidLevel(d, i.y, m, 0);
            continue;
          }
          u ? u === i.type && y < f && (this.setFluidLevel(d, i.y, m, f), this.fluidUpdates.push({
            x: d,
            y: i.y,
            z: m,
            type: i.type,
            level: f
          })) : (this.setBlock(d, i.y, m, i.type), this.setFluidLevel(d, i.y, m, f), this.fluidUpdates.push({
            x: d,
            y: i.y,
            z: m,
            type: i.type,
            level: f
          }));
        }
      }
    }
  },
  // Toggle inventory screen
  toggleInventory() {
    this.inventoryOpen = !this.inventoryOpen;
    const t = document.getElementById("inventoryScreen");
    t && t.classList.toggle("active", this.inventoryOpen), this.inventoryOpen ? (this.inventoryHeldItem = null, this.renderInventory(), document.pointerLockElement && document.exitPointerLock()) : (this.inventoryHeldItem = null, this.justClosedInventory = !0, setTimeout(() => {
      this.justClosedInventory = !1;
    }, 100), this.isPaused || this.canvas.requestPointerLock());
  },
  // Render inventory UI
  renderInventory() {
    const t = document.getElementById("inventoryScreen");
    if (!t) return;
    const e = (a) => {
      if (!a) return "";
      const s = a.id || a.type;
      return {
        grass: "Grass Block",
        dirt: "Dirt",
        stone: "Stone",
        wood: "Wood",
        leaves: "Leaves",
        water: "Water",
        sand: "Sand",
        brick: "Brick",
        ak47: "AK-47",
        water_bucket: "Water Bucket",
        lava_bucket: "Lava Bucket",
        lava: "Lava",
        obsidian: "Obsidian",
        cherryWood: "Cherry Wood",
        cherryLeaves: "Cherry Leaves",
        chest: "Chest",
        ritualChest: "Ritual Chest",
        buildingChest: "Building Chest",
        seeds: "Seeds",
        berdger: "The Berdger",
        sakuraPetal: "Sacred Cherry Petal",
        shimenawa: "Sacred Rope",
        omamori: "Protective Charm",
        ema: "Wooden Wish Plaque",
        incense: "Purifying Incense"
      }[s] || s;
    };
    let i = '<div class="inventory-container">';
    i += "<h2>Inventory</h2>", i += '<div class="crafting-section">', i += "<h3>Crafting</h3>", i += '<div class="recipe-list">';
    for (const a of this.recipes) {
      const s = this.canCraftRecipe(a);
      i += `<div class="recipe ${s ? "craftable" : "disabled"}" data-recipe="${a.name}">`, i += `<span class="recipe-name">${a.name}</span>`, i += '<span class="recipe-ingredients">', a.ingredients.forEach((c) => {
        i += `${c.count}x ${c.id} `;
      }), i += "</span>", i += `<span class="recipe-result">→ ${a.result.count}x ${a.result.id}</span>`, s && (i += `<button class="craft-btn" onclick="minecraftGame.craftRecipe('${a.name}')">Craft</button>`), i += "</div>";
    }
    i += "</div></div>", i += '<div class="inv-hotbar">', i += "<h3>Hotbar</h3>", i += '<div class="inv-slots" id="hotbarSlots">', this.inventory.hotbar.forEach((a, s) => {
      const c = this.getItemEmoji(a), f = a && a.count > 0, h = this.inventoryHeldItem && this.inventoryHeldItem.source === "hotbar" && this.inventoryHeldItem.index === s, n = f ? e(a) : "";
      i += `<div class="inv-slot ${s === this.selectedSlot ? "selected" : ""} ${f ? "has-item" : ""} ${h ? "held" : ""}" 
                        data-source="hotbar" data-index="${s}" ${n ? `data-tooltip="${n}"` : ""}
                        draggable="${f}">${c}<span class="count">${a ? a.count : ""}</span></div>`;
    }), i += "</div></div>", i += '<div class="inv-main">', i += "<h3>Storage</h3>", i += '<div class="inv-slots" id="storageSlots">';
    for (let a = 0; a < 27; a++) {
      const s = this.inventory.main[a];
      s && s.count > 0;
      const c = this.inventoryHeldItem && this.inventoryHeldItem.source === "main" && this.inventoryHeldItem.index === a;
      if (s) {
        const f = this.getItemEmoji(s), h = e(s);
        i += `<div class="inv-slot has-item ${c ? "held" : ""}" data-source="main" data-index="${a}" ${h ? `data-tooltip="${h}"` : ""} draggable="true">${f}<span class="count">${s.count}</span></div>`;
      } else
        i += `<div class="inv-slot empty" data-source="main" data-index="${a}" draggable="false"></div>`;
    }
    i += "</div></div>", i += '<p class="inv-hint">Click items to pick up/place | Drag also works | Press E or ESC to close</p>', i += "</div>", t.innerHTML = i, this.setupInventoryDragDrop();
  },
  setupInventoryDragDrop() {
    const t = document.getElementById("inventoryScreen"), e = document.querySelectorAll("#inventoryScreen .inv-slot");
    this.inventoryHeldItem || (this.inventoryHeldItem = null);
    const i = t.querySelector(".inventory-container");
    i && i.addEventListener("wheel", (a) => {
      a.stopPropagation();
      const { scrollTop: s, scrollHeight: c, clientHeight: f } = i, h = s === 0, n = s + f >= c;
      (h && a.deltaY < 0 || n && a.deltaY > 0) && a.preventDefault();
    }, { passive: !1 }), t.addEventListener("dragover", (a) => {
      a.preventDefault(), a.stopPropagation();
    }), t.addEventListener("drop", (a) => {
      a.preventDefault(), a.stopPropagation();
    }), e.forEach((a) => {
      a.addEventListener("click", (s) => {
        s.preventDefault(), s.stopPropagation();
        const c = a.dataset.source, f = parseInt(a.dataset.index), n = (c === "hotbar" ? this.inventory.hotbar : this.inventory.main)[f];
        this.inventoryHeldItem ? (this.swapInventorySlots(
          this.inventoryHeldItem.source,
          this.inventoryHeldItem.index,
          c,
          f
        ), this.inventoryHeldItem = null, this.renderInventory(), this.updateHotbar(), this.updateHotbarDisplay()) : n && n.count > 0 && (this.inventoryHeldItem = { source: c, index: f }, this.renderInventory());
      }), a.addEventListener("dragstart", (s) => {
        s.stopPropagation();
        const c = a.dataset.source, f = parseInt(a.dataset.index);
        this.draggedItem = { source: c, index: f }, a.classList.add("dragging"), s.dataTransfer.effectAllowed = "move", s.dataTransfer.setDragImage(a, 20, 20);
      }), a.addEventListener("dragend", (s) => {
        s.preventDefault(), s.stopPropagation(), a.classList.remove("dragging"), this.draggedItem = null;
      }), a.addEventListener("dragover", (s) => {
        s.preventDefault(), s.stopPropagation(), s.dataTransfer.dropEffect = "move", a.classList.add("drag-over");
      }), a.addEventListener("dragleave", (s) => {
        s.preventDefault(), s.stopPropagation(), a.classList.remove("drag-over");
      }), a.addEventListener("drop", (s) => {
        if (s.preventDefault(), s.stopPropagation(), a.classList.remove("drag-over"), !this.draggedItem) return;
        const c = a.dataset.source, f = parseInt(a.dataset.index), h = document.querySelector(".inventory-container"), n = h ? h.scrollTop : 0;
        this.swapInventorySlots(
          this.draggedItem.source,
          this.draggedItem.index,
          c,
          f
        ), this.draggedItem = null, this.renderInventory(), this.updateHotbar(), this.updateHotbarDisplay();
        const d = document.querySelector(".inventory-container");
        d && (d.scrollTop = n);
      });
    });
  },
  swapInventorySlots(t, e, i, a) {
    const s = t === "hotbar" ? this.inventory.hotbar : this.inventory.main, c = i === "hotbar" ? this.inventory.hotbar : this.inventory.main, f = s[e], h = c[a];
    if (s[e] = h, c[a] = f, t === "hotbar" || i === "hotbar") {
      const n = this.inventory.hotbar[this.selectedSlot];
      n ? n.type === "block" ? (this.selectedBlock = n.id, this.selectedItem = null) : n.type === "weapon" && (this.selectedItem = n.id, this.selectedBlock = null) : (this.selectedBlock = null, this.selectedItem = null);
    }
  },
  getItemEmoji(t) {
    if (!t) return "";
    const e = t.id || t.type;
    return {
      grass: "🌿",
      dirt: "🟫",
      stone: "🪨",
      wood: "🪵",
      leaves: "🌸",
      water: "💧",
      sand: "🏖️",
      brick: "🧱",
      ak47: "🔫",
      water_bucket: "🪣",
      lava_bucket: "🫧",
      lava: "🔥",
      obsidian: "🟣",
      cherryWood: "🪵",
      cherryLeaves: "🌸",
      chest: "📦",
      ritualChest: "📦",
      buildingChest: "📦",
      seeds: "🌾",
      berdger: "🍔",
      sakuraPetal: "🌸",
      shimenawa: "🪢",
      omamori: "🎀",
      ema: "🪧",
      incense: "🕯️"
    }[e] || "❓";
  },
  canCraftRecipe(t) {
    for (const e of t.ingredients)
      if (this.countItem(e.id) < e.count) return !1;
    return !0;
  },
  countItem(t) {
    let e = 0;
    for (const i of this.inventory.hotbar)
      i && i.id === t && (e += i.count);
    for (const i of this.inventory.main)
      i && i.id === t && (e += i.count);
    return e;
  },
  craftRecipe(t) {
    const e = this.recipes.find((i) => i.name === t);
    if (!(!e || !this.canCraftRecipe(e))) {
      for (const i of e.ingredients)
        this.removeItem(i.id, i.count);
      this.addItem(e.result), this.renderInventory();
    }
  },
  removeItem(t, e) {
    let i = e;
    for (const a of this.inventory.hotbar)
      if (a && a.id === t && i > 0) {
        const s = Math.min(a.count, i);
        a.count -= s, i -= s;
      }
    for (const a of this.inventory.main)
      if (a && a.id === t && i > 0) {
        const s = Math.min(a.count, i);
        a.count -= s, i -= s;
      }
  },
  addItem(t) {
    for (const e of this.inventory.hotbar)
      if (e && e.id === t.id && e.count < 64) {
        const i = Math.min(64 - e.count, t.count);
        if (e.count += i, t.count -= i, t.count <= 0) return;
      }
    for (const e of this.inventory.main)
      if (e && e.id === t.id && e.count < 64) {
        const i = Math.min(64 - e.count, t.count);
        if (e.count += i, t.count -= i, t.count <= 0) return;
      }
    for (let e = 0; e < this.inventory.main.length; e++)
      if (!this.inventory.main[e]) {
        this.inventory.main[e] = { ...t };
        return;
      }
  },
  raycast() {
    const t = this.camera.rotX, e = this.camera.rotY, i = Math.cos(t), a = Math.sin(t), s = Math.cos(e), f = -Math.sin(e) * i, h = -a, n = s * i, d = Math.sqrt(f * f + h * h + n * n), m = f / d, u = h / d, y = n / d, b = 0.1;
    let T = this.camera.x + m * b, P = this.camera.y + u * b, L = this.camera.z + y * b, z = Math.floor(T), R = Math.floor(P), I = Math.floor(L);
    const E = m >= 0 ? 1 : -1, H = u >= 0 ? 1 : -1, D = y >= 0 ? 1 : -1, U = Math.abs(1 / m), _ = Math.abs(1 / u), X = Math.abs(1 / y);
    let Z, Y, q;
    m > 0 ? Z = (z + 1 - T) / m : m < 0 ? Z = (z - T) / m : Z = 1 / 0, u > 0 ? Y = (R + 1 - P) / u : u < 0 ? Y = (R - P) / u : Y = 1 / 0, y > 0 ? q = (I + 1 - L) / y : y < 0 ? q = (I - L) / y : q = 1 / 0;
    let o = null;
    const r = 6;
    let l = 0, p = null, g = !1, k = !1;
    for (let v = 0; v < 100; v++) {
      const M = this.getBlock(z, R, I);
      if (M)
        if (M === "water" || M === "lava")
          M === "water" && (g = !0), M === "lava" && (k = !0);
        else {
          let w = null;
          const S = p || o;
          return S && (w = {
            x: z + S.x,
            y: R + S.y,
            z: I + S.z
          }), {
            hit: { x: z, y: R, z: I },
            place: w,
            block: M,
            throughWater: g,
            throughLava: k
          };
        }
      else
        p = o;
      if (Z < Y && Z < q) {
        if (l = Z, l > r) break;
        z += E, Z += U, o = { x: -E, y: 0, z: 0 };
      } else if (Y < q) {
        if (l = Y, l > r) break;
        R += H, Y += _, o = { x: 0, y: -H, z: 0 };
      } else {
        if (l = q, l > r) break;
        I += D, q += X, o = { x: 0, y: 0, z: -D };
      }
    }
    return null;
  },
  update() {
    if (!this.isActive || this.isPaused) return;
    this.shootCooldown > 0 && this.shootCooldown--, this.muzzleFlash > 0 && this.muzzleFlash--, this.ritualFlightTimer > 0 && (this.ritualFlightTimer--, this.ritualFlightTimer <= 0 && (this.ritualFlight = !1));
    const t = this.debugMoveSpeed || 0.12, i = this.debugNoclip || this.debugFly || this.ritualFlight ? t * 2 : t, a = Math.sin(this.camera.rotY), s = Math.cos(this.camera.rotY);
    if (this.debugNoclip || this.debugFly) {
      let B = 0, x = 0, F = 0;
      this.keys.w && (B -= a * Math.cos(this.camera.rotX) * i, x -= Math.sin(this.camera.rotX) * i, F += s * Math.cos(this.camera.rotX) * i), this.keys.s && (B += a * Math.cos(this.camera.rotX) * i, x += Math.sin(this.camera.rotX) * i, F -= s * Math.cos(this.camera.rotX) * i), this.keys.a && (B -= s * i, F -= a * i), this.keys.d && (B += s * i, F += a * i), this.keys[" "] && (x += i), this.keys.shift && (x -= i), this.debugNoclip ? (this.camera.x += B, this.camera.y += x, this.camera.z += F) : (this.camera.x += B, this.camera.y += x, this.camera.z += F), this.velocity = { x: 0, y: 0, z: 0 };
      return;
    }
    if (this.ritualFlight) {
      let B = 0, x = 0, F = 0;
      this.keys.w && (B -= a * i, F += s * i), this.keys.s && (B += a * i, F -= s * i), this.keys.a && (B -= s * i, F -= a * i), this.keys.d && (B += s * i, F += a * i), this.keys[" "] && (x += i), this.keys.shift && (x -= i);
      const $ = this.camera.x + B, A = this.camera.y + x, O = this.camera.z + F, W = Math.floor(A - this.playerEyeHeight), G = Math.floor(A), Q = Math.floor($), tt = Math.floor(O);
      let J = !0;
      for (let N = W; N <= G; N++) {
        const V = this.getBlock(Q, N, tt);
        if (V && !this.fluidBlocks.includes(V)) {
          J = !1;
          break;
        }
      }
      J && (this.camera.x = $, this.camera.y = A, this.camera.z = O), this.velocity = { x: 0, y: 0, z: 0 };
      return;
    }
    const c = this.camera.y - this.playerEyeHeight, f = c + this.playerHeight, h = Math.floor(this.camera.x), n = Math.floor(this.camera.z), d = this.getBlock(h, Math.floor(c), n), m = this.getBlock(h, Math.floor(c + 0.9), n), u = this.getBlock(h, Math.floor(f - 0.1), n), y = d === "water", b = d === "lava", T = m === "water", P = m === "lava", L = u === "water", z = u === "lava", R = y || T, I = b || P, E = R || I, H = L || z;
    this.inWater = R || L, this.inLava = I || z, this.swimming = E, this.headSubmergedWater = L, this.headSubmergedLava = z;
    let D = 1;
    R && (D = 0.65), I && (D = 0.35);
    let U = 0, _ = 0;
    const X = t;
    this.keys.w && (U -= a * X * D, _ += s * X * D), this.keys.s && (U += a * X * D, _ -= s * X * D), this.keys.a && (U -= s * X * D, _ -= a * X * D), this.keys.d && (U += s * X * D, _ += a * X * D);
    const Z = this.camera.x, Y = this.camera.z, q = 0.25, o = 1.8;
    if (this.collidesAt(this.camera.x, this.camera.y, this.camera.z, q, o)) {
      let B = !1;
      for (let x = 0.1; x <= 1.5 && !B; x += 0.1) {
        const F = [0, 45, 90, 135, 180, 225, 270, 315];
        for (const $ of F) {
          const A = $ * Math.PI / 180, O = this.camera.x + Math.cos(A) * x, W = this.camera.z + Math.sin(A) * x;
          if (!this.collidesAt(O, this.camera.y, W, q, o)) {
            this.camera.x = O, this.camera.z = W, B = !0;
            break;
          }
        }
        !B && !this.collidesAt(this.camera.x, this.camera.y + x, this.camera.z, q, o) && (this.camera.y += x, B = !0);
      }
    }
    let r = this.camera.x, l = this.camera.z;
    const p = 8, g = U / p, k = _ / p;
    for (let B = 0; B < p; B++) {
      const x = r + g;
      if (!this.collidesAt(x, this.camera.y, l, q, o))
        r = x;
      else {
        const $ = g * 0.5;
        this.collidesAt(r + $, this.camera.y, l, q, o) || (r += $);
      }
      const F = l + k;
      if (!this.collidesAt(r, this.camera.y, F, q, o))
        l = F;
      else {
        const $ = k * 0.5;
        this.collidesAt(r, this.camera.y, l + $, q, o) || (l += $);
      }
    }
    this.collidesAt(r, this.camera.y, l, q, o) && (r = this.camera.x, l = this.camera.z), this.camera.x = r, this.camera.z = l;
    const v = this.camera.x - Z, M = this.camera.z - Y;
    if (this.stats.distance += Math.sqrt(v * v + M * M), E) {
      const B = I ? 8e-3 : 0.012, x = I ? 0.92 : 0.95;
      if (this.velocity.y += B, this.keys[" "]) {
        const $ = I ? 0.04 : 0.06;
        this.velocity.y += $;
      }
      if (this.keys.shift) {
        const $ = I ? 0.03 : 0.04;
        this.velocity.y -= $;
      }
      const F = I ? 0.12 : 0.15;
      this.velocity.y = Math.max(-F, Math.min(F, this.velocity.y)), this.velocity.y *= x, !H && this.keys[" "] && this.velocity.y < 0.15 && (this.velocity.y = 0.2);
    } else
      this.velocity.y += this.gravity;
    const w = this.camera.y + this.velocity.y, S = this.getGroundHeightBelow(this.camera.x, this.camera.z, this.camera.y) + this.playerEyeHeight + 0.5;
    w < S ? (this.camera.y = S, this.velocity.y = 0, this.isJumping = !1, this.keys[" "] && !E && (this.velocity.y = 0.28, this.isJumping = !0, this.stats.jumps++)) : this.camera.y = w;
    const C = this.getCeilingAbove(this.camera.x, this.camera.z, this.camera.y);
    C !== null && this.camera.y > C - 0.5 && (this.camera.y = C - 0.5, this.velocity.y = 0), this.worldBounds && (this.camera.x < this.worldBounds.minX + 0.5 && (this.camera.x = this.worldBounds.minX + 0.5, this.velocity.x = Math.abs(this.velocity.x || 0) * 0.3), this.camera.x > this.worldBounds.maxX - 0.5 && (this.camera.x = this.worldBounds.maxX - 0.5, this.velocity.x = -Math.abs(this.velocity.x || 0) * 0.3), this.camera.z < this.worldBounds.minZ + 0.5 && (this.camera.z = this.worldBounds.minZ + 0.5, this.velocity.z = Math.abs(this.velocity.z || 0) * 0.3), this.camera.z > this.worldBounds.maxZ - 0.5 && (this.camera.z = this.worldBounds.maxZ - 0.5, this.velocity.z = -Math.abs(this.velocity.z || 0) * 0.3), this.camera.y < this.worldBounds.minY + this.playerEyeHeight && (this.camera.y = this.worldBounds.minY + this.playerEyeHeight, this.velocity.y = 0.15)), this.settings.filter === "trippy" && this.applyFilters();
  },
  // Check if player would collide with blocks at position
  collidesAt(t, e, i, a, s) {
    const c = e - this.playerEyeHeight, f = [
      { x: t - a, z: i - a },
      { x: t + a, z: i - a },
      { x: t - a, z: i + a },
      { x: t + a, z: i + a },
      { x: t, z: i }
    ];
    for (const h of f) {
      const n = Math.floor(h.x), d = Math.floor(h.z);
      for (let m = Math.floor(c); m < Math.floor(c + s); m++) {
        const u = this.getBlock(n, m, d);
        if (u && !this.fluidBlocks.includes(u))
          return !0;
      }
    }
    return !1;
  },
  // Get ground height directly below player (not teleporting to trees)
  getGroundHeightBelow(t, e, i) {
    const a = Math.floor(t), s = Math.floor(e), c = Math.floor(i - this.playerEyeHeight);
    for (let f = c; f >= 0; f--) {
      const h = this.getBlock(a, f, s);
      if (h && !this.fluidBlocks.includes(h))
        return f + 1;
    }
    return 0;
  },
  // Get ceiling above player
  getCeilingAbove(t, e, i) {
    const a = Math.floor(t), s = Math.floor(e), c = Math.floor(i);
    for (let f = c; f <= c + 3; f++) {
      const h = this.getBlock(a, f, s);
      if (h && !this.fluidBlocks.includes(h))
        return f;
    }
    return null;
  },
  render() {
    if (!this.isActive) return;
    const t = this.ctx, e = this.canvas.width, i = this.canvas.height;
    if (!this.cachedSky || this.cachedSky.w !== e || this.cachedSky.h !== i || this.cachedSky.lighting !== this.settings.lighting) {
      const o = t.createLinearGradient(0, 0, 0, i);
      this.settings.lighting ? (o.addColorStop(0, "#1a0a1a"), o.addColorStop(0.5, "#2d1f3d"), o.addColorStop(1, "#ffb7c5")) : (o.addColorStop(0, "#111"), o.addColorStop(1, "#333")), this.cachedSky = { grad: o, w: e, h: i, lighting: this.settings.lighting };
    }
    t.fillStyle = this.cachedSky.grad, t.fillRect(0, 0, e, i);
    const a = this.camera.x, s = this.camera.y, c = this.camera.z, f = Math.cos(-this.camera.rotY), h = Math.sin(-this.camera.rotY), n = Math.cos(-this.camera.rotX), d = Math.sin(-this.camera.rotX), m = e / 2, u = i / 2, y = 400, b = this.settings.renderDistance, T = b * b, P = (o, r, l) => {
      const p = o - a, g = r - s, k = l - c, v = p * f - k * h, M = p * h + k * f, w = g * n - M * d, S = g * d + M * n;
      return S <= 0.1 ? null : { x: m + v / S * y, y: u - w / S * y, z: S };
    }, L = [], z = -Math.sin(this.camera.rotY), R = Math.cos(this.camera.rotY), I = Object.keys(this.world);
    for (let o = 0; o < I.length; o++) {
      const r = I[o], [l, p, g] = r.split(",").map(Number), k = l + 0.5 - a, v = p + 0.5 - s, M = g + 0.5 - c, w = k * k + v * v + M * M;
      w > T || k * z + M * R < -3 && w > 16 || L.push({ x: l, y: p, z: g, dist: w, type: this.world[r] });
    }
    L.sort((o, r) => r.dist - o.dist);
    const E = (o, r, l) => this.world[`${o},${r},${l}`], H = (o) => !o || this.fluidBlocks.includes(o), D = (o, r, l) => this.fluidLevels[`${o},${r},${l}`] || 8, U = Date.now() * 2e-3, _ = [], X = [];
    for (let o = 0; o < L.length; o++) {
      const r = L[o], l = this.blockColors[r.type];
      l && l.transparent ? X.push(r) : _.push(r);
    }
    const Z = (o, r, l) => {
      const p = [
        [o + 0.5, r + 0.5, l + 0.5],
        // center
        [o + 0.1, r + 0.1, l + 0.1],
        // corners with small inset
        [o + 0.9, r + 0.1, l + 0.1],
        [o + 0.1, r + 0.9, l + 0.1],
        [o + 0.9, r + 0.9, l + 0.1],
        [o + 0.1, r + 0.1, l + 0.9],
        [o + 0.9, r + 0.1, l + 0.9],
        [o + 0.1, r + 0.9, l + 0.9],
        [o + 0.9, r + 0.9, l + 0.9]
      ];
      for (const [g, k, v] of p) {
        const M = g - a, w = k - s, S = v - c, C = Math.sqrt(M * M + w * w + S * S);
        let B = !1;
        const x = Math.min(8, Math.ceil(C / 2));
        for (let F = 1; F < x; F++) {
          const $ = F / x, A = Math.floor(a + M * $), O = Math.floor(s + w * $), W = Math.floor(c + S * $);
          if (A === o && O === r && W === l) continue;
          const G = E(A, O, W);
          if (G && !this.fluidBlocks.includes(G)) {
            const Q = this.blockColors[G];
            if (!Q || !Q.transparent) {
              B = !0;
              break;
            }
          }
        }
        if (!B) return !1;
      }
      return !0;
    }, Y = X.filter((o) => !Z(o.x, o.y, o.z));
    Y.sort((o, r) => r.dist - o.dist), _.sort((o, r) => r.dist - o.dist);
    const q = [..._, ...Y];
    for (let o = 0; o < q.length; o++) {
      const r = q[o], { x: l, y: p, z: g, type: k } = r, v = this.blockColors[k];
      if (!v) continue;
      const M = this.fluidBlocks.includes(k), w = M ? D(l, p, g) : 8, S = p + w / 8, C = E(l, p + 1, g), B = E(l, p - 1, g), x = E(l, p, g + 1), F = E(l, p, g - 1), $ = E(l - 1, p, g), A = E(l + 1, p, g);
      let O, W, G, Q, tt, J;
      if (M) {
        O = !C || C !== k, W = !B || !this.fluidBlocks.includes(B);
        const V = w, et = x === k ? D(l, p, g + 1) : 0, K = F === k ? D(l, p, g - 1) : 0, rt = $ === k ? D(l - 1, p, g) : 0, at = A === k ? D(l + 1, p, g) : 0;
        G = !x || x !== k || et < V, Q = !F || F !== k || K < V, tt = !$ || $ !== k || rt < V, J = !A || A !== k || at < V;
      } else
        O = H(C), W = H(B), G = H(x), Q = H(F), tt = H($), J = H(A);
      if (!O && !W && !G && !Q && !tt && !J) continue;
      const N = [];
      G && N.push({ v: [[l, p, g + 1], [l + 1, p, g + 1], [l + 1, S, g + 1], [l, S, g + 1]], color: v.side, dark: 1, isTop: !1 }), Q && N.push({ v: [[l + 1, p, g], [l, p, g], [l, S, g], [l + 1, S, g]], color: v.side, dark: 0.7, isTop: !1 }), O && N.push({ v: [[l, S, g], [l + 1, S, g], [l + 1, S, g + 1], [l, S, g + 1]], color: v.top, dark: 1, isTop: !0 }), W && N.push({ v: [[l, p, g + 1], [l + 1, p, g + 1], [l + 1, p, g], [l, p, g]], color: v.bottom, dark: 0.7, isTop: !1 }), tt && N.push({ v: [[l, p, g], [l, p, g + 1], [l, S, g + 1], [l, S, g]], color: v.side, dark: 0.85, isTop: !1 }), J && N.push({ v: [[l + 1, p, g + 1], [l + 1, p, g], [l + 1, S, g], [l + 1, S, g + 1]], color: v.side, dark: 0.85, isTop: !1 });
      for (let V = 0; V < N.length; V++) {
        const et = N[V], K = [];
        let rt = !0;
        for (let j = 0; j < 4; j++) {
          const it = P(et.v[j][0], et.v[j][1], et.v[j][2]);
          if (!it) {
            rt = !1;
            break;
          }
          K.push(it);
        }
        if (!rt || K.length !== 4) continue;
        let at = et.color;
        if (this.settings.shadows && et.dark < 1 && (at = this.darkenColor(et.color, et.dark)), M && v.animated) {
          if (k === "water") {
            const j = U, it = Math.sin(j + l * 0.7 + g * 0.5) * 0.4, ft = Math.sin(j * 0.8 - l * 0.3 + g * 0.7) * 0.3, ut = Math.sin(j * 1.3 + l * 0.5 - g * 0.3) * 0.2, ct = (it + ft + ut) / 3 + 0.5, mt = l + 0.5 - a, ht = p + 0.5 - s, pt = g + 0.5 - c, lt = Math.sqrt(mt * mt + ht * ht + pt * pt), It = Math.abs(ht / (lt || 1)), zt = 0.02, gt = zt + (1 - zt) * Math.pow(1 - It, 5);
            let st = 0;
            const Ct = this.camera.x - (l + 0.5), Lt = this.camera.z - (g + 0.5), Et = Math.sqrt(Ct * Ct + Lt * Lt);
            Et < 5 && this.camera.y > p + 1 && (st = (1 - Et / 5) * gt * 0.3);
            const Ft = [
              { r: 255, g: 183, b: 197 },
              // Sunset pink
              { r: 255, g: 218, b: 185 },
              // Peach
              { r: 135, g: 206, b: 235 }
              // Sky blue
            ], Dt = Math.min(2, Math.floor((1 - It) * 3)), yt = Ft[Dt], vt = Math.min(1, lt / 20), $t = 30 + vt * 15, Rt = 80 + vt * 20, Ht = 160 - vt * 30, bt = { r: 100, g: 60, b: 40 }, nt = Math.min(0.7, gt * 1.5);
            let kt = Math.floor($t * (1 - nt) + yt.r * nt), Mt = Math.floor(Rt * (1 - nt) + yt.g * nt), St = Math.floor(Ht * (1 - nt) + yt.b * nt);
            st > 0 && (kt = Math.floor(kt * (1 - st) + bt.r * st), Mt = Math.floor(Mt * (1 - st) + bt.g * st), St = Math.floor(St * (1 - st) + bt.b * st));
            const wt = { x: 0.5, y: 0.8, z: 0.3 }, Bt = { x: mt / lt, y: ht / lt, z: pt / lt }, ot = {
              x: wt.x + Bt.x,
              y: wt.y + Bt.y,
              z: wt.z + Bt.z
            }, qt = Math.sqrt(ot.x * ot.x + ot.y * ot.y + ot.z * ot.z), At = Math.max(0, ot.y / qt), dt = Math.pow(At, 32) * ct * 0.6, Wt = Math.sin(j * 2 + l * 1.5) * Math.cos(j * 1.5 + g * 1.5), Ot = Math.sin(j * 1.7 - l * 1.2 + g * 0.8), Yt = (Wt * Ot + 1) * 0.1, Pt = 0.85 + ct * 0.15 + dt + Yt, Xt = Math.min(255, Math.floor(kt * Pt + dt * 200)), Zt = Math.min(255, Math.floor(Mt * Pt + dt * 180)), Nt = Math.min(255, Math.floor(St * Pt + dt * 150)), jt = 0.55, _t = gt * 0.35, Gt = Math.min(0.9, jt + _t);
            at = `rgba(${Xt}, ${Zt}, ${Nt}, ${Gt})`;
          } else if (k === "lava") {
            const j = U * 1.5 + l * 0.3 + g * 0.3, it = 0.8 + Math.sin(j) * 0.2, ft = Math.floor(255 * it), ut = Math.floor((80 + Math.sin(j * 2) * 30) * it), ct = Math.floor(30 * (1 - it * 0.5));
            at = `rgb(${Math.min(255, ft)}, ${Math.min(255, ut)}, ${ct})`;
          }
        }
        t.fillStyle = at, t.beginPath(), t.moveTo(K[0].x, K[0].y), t.lineTo(K[1].x, K[1].y), t.lineTo(K[2].x, K[2].y), t.lineTo(K[3].x, K[3].y), t.closePath(), t.fill(), M || (t.strokeStyle = this.darkenColor(at, 0.7), t.lineWidth = 0.5, t.stroke());
      }
    }
    if (this.worldBounds) {
      const o = this.worldBounds, r = Date.now() * 3e-3, l = 5, p = [
        { axis: "x", value: o.minX, dir: 1 },
        // West wall
        { axis: "x", value: o.maxX, dir: -1 },
        // East wall
        { axis: "z", value: o.minZ, dir: 1 },
        // North wall
        { axis: "z", value: o.maxZ, dir: -1 }
        // South wall
      ];
      for (const k of p) {
        let v;
        if (k.axis === "x" ? v = Math.abs(a - k.value) : v = Math.abs(c - k.value), !(v > b * 1.5))
          for (let M = o.minY; M < o.maxY; M += l) {
            const w = k.axis === "x" ? o.minZ : o.minX, S = k.axis === "x" ? o.maxZ : o.maxX;
            for (let C = w; C < S; C += l) {
              let B, x;
              if (k.axis === "x" ? (B = k.value, x = C + l / 2) : (B = C + l / 2, x = k.value), Math.sqrt((B - a) ** 2 + (x - c) ** 2) > b) continue;
              let $;
              const A = Math.min(M + l, o.maxY), O = Math.min(C + l, S);
              k.axis === "x" ? $ = [
                [k.value, M, C],
                [k.value, M, O],
                [k.value, A, O],
                [k.value, A, C]
              ] : $ = [
                [C, M, k.value],
                [O, M, k.value],
                [O, A, k.value],
                [C, A, k.value]
              ];
              const W = [];
              let G = !0;
              for (const J of $) {
                const N = P(J[0], J[1], J[2]);
                if (!N) {
                  G = !1;
                  break;
                }
                W.push(N);
              }
              if (!G || W.length < 4) continue;
              const Q = ((C + M) * 0.2 + r) % (Math.PI * 2), tt = 0.15 + 0.1 * Math.sin(Q);
              t.fillStyle = `hsla(${180 + Math.sin(r + C * 0.1) * 20}, 100%, 60%, ${tt})`, t.beginPath(), t.moveTo(W[0].x, W[0].y), t.lineTo(W[1].x, W[1].y), t.lineTo(W[2].x, W[2].y), t.lineTo(W[3].x, W[3].y), t.closePath(), t.fill(), t.strokeStyle = `hsla(180, 100%, 70%, ${tt * 2})`, t.lineWidth = 1, t.stroke();
            }
          }
      }
      const g = o.minY;
      for (let k = o.minX; k < o.maxX; k += l)
        for (let v = o.minZ; v < o.maxZ; v += l) {
          if (Math.sqrt((k + l / 2 - a) ** 2 + (v + l / 2 - c) ** 2) > b) continue;
          const w = Math.min(k + l, o.maxX), S = Math.min(v + l, o.maxZ), C = [
            [k, g, v],
            [w, g, v],
            [w, g, S],
            [k, g, S]
          ], B = [];
          let x = !0;
          for (const A of C) {
            const O = P(A[0], A[1], A[2]);
            if (!O) {
              x = !1;
              break;
            }
            B.push(O);
          }
          if (!x || B.length < 4) continue;
          const F = ((k + v) * 0.2 + r) % (Math.PI * 2), $ = 0.1 + 0.08 * Math.sin(F);
          t.fillStyle = `hsla(${280 + Math.sin(r + k * 0.1) * 20}, 100%, 50%, ${$})`, t.beginPath(), t.moveTo(B[0].x, B[0].y), t.lineTo(B[1].x, B[1].y), t.lineTo(B[2].x, B[2].y), t.lineTo(B[3].x, B[3].y), t.closePath(), t.fill(), t.strokeStyle = `hsla(280, 100%, 60%, ${$ * 2})`, t.lineWidth = 1, t.stroke();
        }
    }
    for (const o of this.birds) {
      const r = o.x - a, l = o.y - s, p = o.z - c;
      if (r * z + p * R < 0 || r * r + l * l + p * p > T) continue;
      const v = P(o.x, o.y, o.z);
      if (!v) continue;
      const M = o.size * y / v.z;
      if (M < 2) continue;
      const w = Math.sin(o.wingPhase) * 0.5;
      o.angle + Math.PI / 2, t.fillStyle = "#d85a8a", t.beginPath(), t.ellipse(v.x, v.y, M * 0.8, M * 0.4, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ff9ec4";
      const S = M * 1.5, C = M * 0.6 * (1 + w);
      t.beginPath(), t.moveTo(v.x, v.y), t.quadraticCurveTo(
        v.x - S * 0.5,
        v.y - C,
        v.x - S,
        v.y + M * 0.2
      ), t.quadraticCurveTo(
        v.x - S * 0.5,
        v.y + M * 0.1,
        v.x,
        v.y
      ), t.fill(), t.beginPath(), t.moveTo(v.x, v.y), t.quadraticCurveTo(
        v.x + S * 0.5,
        v.y - C,
        v.x + S,
        v.y + M * 0.2
      ), t.quadraticCurveTo(
        v.x + S * 0.5,
        v.y + M * 0.1,
        v.x,
        v.y
      ), t.fill(), t.fillStyle = "#d85a8a", t.beginPath(), t.arc(v.x + M * 0.6, v.y - M * 0.1, M * 0.3, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ffaa00", t.beginPath(), t.moveTo(v.x + M * 0.9, v.y - M * 0.1), t.lineTo(v.x + M * 1.2, v.y), t.lineTo(v.x + M * 0.9, v.y + M * 0.1), t.fill();
    }
    for (const o of this.pestBirds) {
      const r = P(o.x, o.y, o.z);
      if (!r) continue;
      const l = o.size * y / r.z;
      if (l < 1) continue;
      const p = Math.sin(o.wingPhase) * 0.7, g = o.anger || 0, k = Math.min(255, 107 + g * 30), v = Math.max(0, 68 - g * 10), M = Math.max(0, 35 - g * 7), w = o.state === "swooping", S = g > 0 ? `rgb(${k}, ${v}, ${M})` : w ? "#8b4513" : "#6b4423", C = g > 0 ? `rgb(${Math.min(255, k + 30)}, ${v + 20}, ${M + 10})` : w ? "#a0522d" : "#8b7355";
      t.fillStyle = S, t.beginPath(), t.ellipse(r.x, r.y, l * 0.6, l * 0.5, 0, 0, Math.PI * 2), t.fill(), g >= 3 && (t.shadowColor = "#ff0000", t.shadowBlur = g * 3), t.fillStyle = C;
      const B = l * 1.2, x = l * 0.8 * (1 + p);
      t.beginPath(), t.moveTo(r.x, r.y), t.quadraticCurveTo(
        r.x - B * 0.4,
        r.y - x,
        r.x - B,
        r.y
      ), t.quadraticCurveTo(
        r.x - B * 0.4,
        r.y + l * 0.2,
        r.x,
        r.y
      ), t.fill(), t.beginPath(), t.moveTo(r.x, r.y), t.quadraticCurveTo(
        r.x + B * 0.4,
        r.y - x,
        r.x + B,
        r.y
      ), t.quadraticCurveTo(
        r.x + B * 0.4,
        r.y + l * 0.2,
        r.x,
        r.y
      ), t.fill(), t.fillStyle = S, t.beginPath(), t.arc(r.x + l * 0.4, r.y - l * 0.15, l * 0.25, 0, Math.PI * 2), t.fill(), t.fillStyle = "#000", t.beginPath(), t.arc(r.x + l * 0.45, r.y - l * 0.2, l * 0.08, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ff6600", t.beginPath(), t.moveTo(r.x + l * 0.6, r.y - l * 0.15), t.lineTo(r.x + l * 0.85, r.y - l * 0.1), t.lineTo(r.x + l * 0.6, r.y - l * 0.05), t.fill(), t.fillStyle = C, t.beginPath(), t.moveTo(r.x - l * 0.4, r.y), t.lineTo(r.x - l * 0.9, r.y - l * 0.1), t.lineTo(r.x - l * 0.95, r.y + l * 0.05), t.lineTo(r.x - l * 0.85, r.y + l * 0.15), t.lineTo(r.x - l * 0.4, r.y + l * 0.1), t.fill(), t.shadowBlur = 0, t.shadowColor = "transparent";
    }
    if (this.blueBirds)
      for (const o of this.blueBirds) {
        const r = P(o.x, o.y, o.z);
        if (!r) continue;
        const l = Math.max(8, 25 / r.z), p = Math.sin(o.wingPhase) * 0.6, g = l * 0.5 * (1 + p);
        t.fillStyle = "#1e90ff", t.beginPath(), t.ellipse(r.x, r.y, l * 0.5, l * 0.3, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = "#00bfff";
        const k = l * 1.2;
        t.beginPath(), t.moveTo(r.x, r.y), t.quadraticCurveTo(r.x - k * 0.5, r.y - g, r.x - k, r.y), t.quadraticCurveTo(r.x - k * 0.5, r.y + l * 0.2, r.x, r.y), t.fill(), t.beginPath(), t.moveTo(r.x, r.y), t.quadraticCurveTo(r.x + k * 0.5, r.y - g, r.x + k, r.y), t.quadraticCurveTo(r.x + k * 0.5, r.y + l * 0.2, r.x, r.y), t.fill(), t.fillStyle = "#ff0000", t.beginPath(), t.arc(r.x + l * 0.3, r.y - l * 0.1, l * 0.15, 0, Math.PI * 2), t.fill();
      }
    if (this.fish)
      for (const o of this.fish) {
        const r = P(o.x, o.y, o.z);
        if (!r) continue;
        const l = Math.max(4, o.size * 30 / r.z), p = Math.sin(o.swimPhase) * 0.2;
        t.save(), t.translate(r.x, r.y), t.rotate(Math.atan2(o.vz, o.vx) + p), t.fillStyle = o.color, t.beginPath(), t.ellipse(0, 0, l, l * 0.4, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.moveTo(-l * 0.8, 0), t.lineTo(-l * 1.5, -l * 0.4), t.lineTo(-l * 1.5, l * 0.4), t.closePath(), t.fill(), t.fillStyle = "#000", t.beginPath(), t.arc(l * 0.5, -l * 0.1, l * 0.15, 0, Math.PI * 2), t.fill(), t.restore();
      }
    if (this.cats)
      for (const o of this.cats) {
        const r = P(o.x, o.y + 0.3, o.z);
        if (!r) continue;
        const l = Math.max(10, 40 / r.z), p = Math.sin(o.walkPhase) * l * 0.05;
        t.fillStyle = o.color, t.beginPath(), t.ellipse(r.x, r.y + p, l * 0.6, l * 0.4, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.arc(r.x + l * 0.5, r.y - l * 0.2 + p, l * 0.35, 0, Math.PI * 2), t.fill(), t.beginPath(), t.moveTo(r.x + l * 0.3, r.y - l * 0.5 + p), t.lineTo(r.x + l * 0.4, r.y - l * 0.2 + p), t.lineTo(r.x + l * 0.5, r.y - l * 0.5 + p), t.fill(), t.beginPath(), t.moveTo(r.x + l * 0.6, r.y - l * 0.5 + p), t.lineTo(r.x + l * 0.7, r.y - l * 0.2 + p), t.lineTo(r.x + l * 0.5, r.y - l * 0.5 + p), t.fill(), t.fillStyle = "#00ff00", t.beginPath(), t.ellipse(r.x + l * 0.4, r.y - l * 0.25 + p, l * 0.08, l * 0.12, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.ellipse(r.x + l * 0.6, r.y - l * 0.25 + p, l * 0.08, l * 0.12, 0, 0, Math.PI * 2), t.fill(), t.strokeStyle = o.color, t.lineWidth = l * 0.1, t.lineCap = "round", t.beginPath(), t.moveTo(r.x - l * 0.5, r.y + p), t.quadraticCurveTo(r.x - l * 0.8, r.y - l * 0.3, r.x - l * 0.7, r.y - l * 0.5), t.stroke();
      }
    if (this.creepers)
      for (const o of this.creepers) {
        const r = P(o.x, o.y + 0.8, o.z);
        if (!r) continue;
        const l = Math.max(15, 50 / r.z), p = o.state === "fusing" && o.flashing ? "#ffffff" : "#00aa00";
        t.fillStyle = p, t.fillRect(r.x - l * 0.3, r.y - l * 0.5, l * 0.6, l), t.fillRect(r.x - l * 0.35, r.y - l * 0.9, l * 0.7, l * 0.5), t.fillStyle = "#000", t.fillRect(r.x - l * 0.25, r.y - l * 0.8, l * 0.15, l * 0.15), t.fillRect(r.x + l * 0.1, r.y - l * 0.8, l * 0.15, l * 0.15), t.fillRect(r.x - l * 0.2, r.y - l * 0.55, l * 0.1, l * 0.15), t.fillRect(r.x + l * 0.1, r.y - l * 0.55, l * 0.1, l * 0.15), t.fillRect(r.x - l * 0.1, r.y - l * 0.5, l * 0.2, l * 0.1), t.fillStyle = p, t.fillRect(r.x - l * 0.3, r.y + l * 0.4, l * 0.2, l * 0.3), t.fillRect(r.x + l * 0.1, r.y + l * 0.4, l * 0.2, l * 0.3);
      }
    for (const o of this.particles) {
      const r = P(o.x, o.y, o.z);
      if (r) {
        if (o.type === "bullet") {
          const l = o.x - this.camera.x, p = o.y - this.camera.y, g = o.z - this.camera.z;
          let k = !1;
          for (let M = 0.3; M < 0.95; M += 0.2) {
            const w = this.camera.x + l * M, S = this.camera.y + p * M, C = this.camera.z + g * M, B = this.getBlock(Math.floor(w), Math.floor(S), Math.floor(C));
            if (B && !this.fluidBlocks.includes(B)) {
              k = !0;
              break;
            }
          }
          if (k) continue;
          if (o.trail.length > 1) {
            t.strokeStyle = "rgba(255, 200, 50, 0.8)", t.lineWidth = 2, t.beginPath();
            let M = !1;
            for (let w = 0; w < o.trail.length; w++) {
              const S = P(o.trail[w].x, o.trail[w].y, o.trail[w].z);
              S && (M ? t.lineTo(S.x, S.y) : (t.moveTo(S.x, S.y), M = !0));
            }
            M && (t.lineTo(r.x, r.y), t.stroke());
          }
          const v = Math.max(2, 8 / r.z);
          t.fillStyle = "#ffcc00", t.beginPath(), t.arc(r.x, r.y, v, 0, Math.PI * 2), t.fill();
        } else if (o.type === "ricochet" || o.type === "spark") {
          const l = Math.max(1, (o.size || 3) * 20 / r.z), p = Math.min(1, o.life / 15);
          t.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 50, ${p})`, t.beginPath(), t.arc(r.x, r.y, l, 0, Math.PI * 2), t.fill();
        } else if (o.type === "blessing") {
          const l = Math.max(2, (o.size || 4) * 20 / r.z), p = Math.min(1, o.life / 30), g = Math.sin(o.life * 0.3) * 0.5 + 0.5;
          t.fillStyle = `rgba(255, 215, 0, ${p * 0.3})`, t.beginPath(), t.arc(r.x, r.y, l * 2, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, ${200 + g * 55}, ${100 + g * 155}, ${p})`, t.beginPath(), t.arc(r.x, r.y, l, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 255, 255, ${p * g})`, t.beginPath(), t.arc(r.x, r.y, l * 0.3, 0, Math.PI * 2), t.fill();
        } else if (o.type === "explosion") {
          const l = Math.max(3, (o.size || 5) * 25 / r.z), p = Math.min(1, o.life / 20), g = Math.random() * 0.3 + 0.7;
          t.fillStyle = `rgba(255, 100, 0, ${p * 0.4})`, t.beginPath(), t.arc(r.x, r.y, l * 1.5, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 0, ${p * g})`, t.beginPath(), t.arc(r.x, r.y, l, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 255, ${Math.random() * 100}, ${p * 0.8})`, t.beginPath(), t.arc(r.x, r.y, l * 0.4, 0, Math.PI * 2), t.fill();
        } else if (o.type === "feather") {
          const l = Math.max(2, 15 / r.z), p = Math.min(1, o.life / 20);
          t.save(), t.translate(r.x, r.y), t.rotate(o.rotation), t.fillStyle = `rgba(139, 90, 43, ${p})`, t.beginPath(), t.ellipse(0, 0, l * 2, l * 0.5, 0, 0, Math.PI * 2), t.fill(), t.strokeStyle = `rgba(100, 60, 30, ${p})`, t.lineWidth = 1, t.beginPath(), t.moveTo(-l * 2, 0), t.lineTo(l * 2, 0), t.stroke(), t.restore();
        } else if (o.type === "petal") {
          const l = o.x - this.camera.x, p = o.y - this.camera.y, g = o.z - this.camera.z;
          let k = !1;
          for (let w = 0.2; w < 0.9; w += 0.25) {
            const S = this.camera.x + l * w, C = this.camera.y + p * w, B = this.camera.z + g * w, x = this.getBlock(Math.floor(S), Math.floor(C), Math.floor(B));
            if (x && !this.fluidBlocks.includes(x)) {
              k = !0;
              break;
            }
          }
          if (k) continue;
          const v = Math.max(2, (o.size || 4) * 15 / r.z), M = Math.min(1, o.life / 50);
          t.save(), t.translate(r.x, r.y), t.rotate(o.rotation), t.fillStyle = `rgba(255, 183, 197, ${M})`, t.beginPath(), t.ellipse(0, 0, v * 1.5, v * 0.7, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 150, 170, ${M})`, t.beginPath(), t.ellipse(0, 0, v * 0.5, v * 0.3, 0, 0, Math.PI * 2), t.fill(), t.restore();
        } else if (o.type === "burger") {
          const l = Math.max(3, (o.size || 8) * 20 / r.z);
          t.save(), t.translate(r.x, r.y), t.fillStyle = "#D2691E", t.beginPath(), t.ellipse(0, -l * 0.3, l, l * 0.5, 0, Math.PI, 0), t.fill(), t.fillStyle = "#654321", t.fillRect(-l, -l * 0.2, l * 2, l * 0.4), t.fillStyle = "#228B22", t.fillRect(-l * 0.9, l * 0.1, l * 1.8, l * 0.15), t.fillStyle = "#DEB887", t.beginPath(), t.ellipse(0, l * 0.3, l, l * 0.4, 0, 0, Math.PI), t.fill(), t.restore();
        } else if (o.type === "burgerSplat") {
          const l = Math.max(2, (o.size || 4) * 10 / r.z), p = Math.min(1, o.life / 10), g = ["#D2691E", "#654321", "#228B22", "#FF6347"];
          t.fillStyle = g[Math.floor(Math.random() * g.length)].replace(")", `, ${p})`).replace("rgb", "rgba"), t.beginPath(), t.arc(r.x, r.y, l, 0, Math.PI * 2), t.fill();
        } else if (o.type === "apple") {
          const l = Math.max(3, (o.size || 6) * 18 / r.z);
          t.save(), t.translate(r.x, r.y), t.fillStyle = "#dc143c", t.beginPath(), t.arc(0, 0, l, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(255, 255, 255, 0.3)", t.beginPath(), t.arc(-l * 0.3, -l * 0.3, l * 0.4, 0, Math.PI * 2), t.fill(), t.fillStyle = "#654321", t.fillRect(-1, -l - 3, 2, 4), t.fillStyle = "#228b22", t.beginPath(), t.ellipse(3, -l - 1, 4, 2, 0.3, 0, Math.PI * 2), t.fill(), t.restore();
        } else if (o.type === "appleSplat") {
          const l = Math.max(2, (o.size || 3) * 8 / r.z), p = Math.min(1, o.life / 10);
          t.fillStyle = `rgba(220, 20, 60, ${p})`, t.beginPath(), t.arc(r.x, r.y, l, 0, Math.PI * 2), t.fill();
        }
      }
    }
    if (this.droppedItems)
      for (const r of this.droppedItems) {
        const l = r.x - a, p = r.y - s, g = r.z - c;
        if (l * l + p * p + g * g > 400) continue;
        let v = !1;
        for (let C = 0.15; C < 0.9; C += 0.2) {
          const B = a + l * C, x = s + p * C, F = c + g * C, $ = this.getBlock(Math.floor(B), Math.floor(x), Math.floor(F));
          if ($ && !this.fluidBlocks.includes($)) {
            v = !0;
            break;
          }
        }
        if (v) continue;
        const M = Math.sin(r.bobPhase) * 0.1, w = P(r.x, r.y + M, r.z);
        if (!w || w.z <= 0) continue;
        const S = Math.max(6, 30 / w.z);
        this.drawDroppedItem3D(t, w.x, w.y, S, r.type, r.bobPhase), r.count > 1 && (t.font = `bold ${Math.max(8, S * 0.5)}px monospace`, t.fillStyle = "#fff", t.strokeStyle = "#000", t.lineWidth = 2, t.textAlign = "center", t.strokeText(r.count.toString(), w.x + S * 0.5, w.y + S * 0.4), t.fillText(r.count.toString(), w.x + S * 0.5, w.y + S * 0.4));
      }
    if (!this.isPaused && this.pointerLocked) {
      const o = this.raycast();
      if (o && o.hit) {
        const r = o.hit.x, l = o.hit.y, p = o.hit.z, g = 5e-3, v = [
          [r - g, l - g, p - g],
          [r + 1 + g, l - g, p - g],
          [r + 1 + g, l + 1 + g, p - g],
          [r - g, l + 1 + g, p - g],
          [r - g, l - g, p + 1 + g],
          [r + 1 + g, l - g, p + 1 + g],
          [r + 1 + g, l + 1 + g, p + 1 + g],
          [r - g, l + 1 + g, p + 1 + g]
        ].map((w) => P(w[0], w[1], w[2]));
        if (v.every((w) => w !== null)) {
          let w = "rgba(0, 0, 0, 0.8)", S = 2;
          o.throughWater ? (w = "rgba(74, 144, 217, 0.7)", S = 3) : o.throughLava && (w = "rgba(255, 100, 0, 0.7)", S = 3), t.strokeStyle = w, t.lineWidth = S;
          const C = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            // back face
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4],
            // front face
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
            // connecting edges
          ];
          t.beginPath();
          for (const [B, x] of C)
            t.moveTo(v[B].x, v[B].y), t.lineTo(v[x].x, v[x].y);
          t.stroke();
        }
        const M = this.getBlock(r, l, p);
        this.updateBlockTooltip(M);
      } else
        this.updateBlockTooltip(null);
    }
    if (this.debugShowCoords && (t.fillStyle = "rgba(0, 0, 0, 0.7)", t.fillRect(e - 200, 10, 190, 80), t.fillStyle = "#0f0", t.font = "12px monospace", t.textAlign = "left", t.fillText(`X: ${this.camera.x.toFixed(2)}`, e - 190, 28), t.fillText(`Y: ${this.camera.y.toFixed(2)}`, e - 190, 43), t.fillText(`Z: ${this.camera.z.toFixed(2)}`, e - 190, 58), t.fillText(`Blocks: ${Object.keys(this.world).length}`, e - 190, 73), t.fillText(`Birds: ${this.pestBirds.length}`, e - 190, 88)), this.renderPlayerModel(t, m, u, e, i), !this.isPaused && this.pointerLocked && (t.strokeStyle = "#fff", t.lineWidth = 2, t.beginPath(), t.moveTo(m - 10, u), t.lineTo(m + 10, u), t.moveTo(m, u - 10), t.lineTo(m, u + 10), t.stroke()), this.birdEvent && this.birdEvent.alertMessage && this.birdEvent.alertFade > 0) {
      const o = Math.min(1, this.birdEvent.alertFade / 1e3), r = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
      t.save(), t.globalAlpha = o, t.fillStyle = `rgba(0, 0, 0, ${0.7 * r})`;
      const l = Math.min(e * 0.8, 500), p = 60, g = (e - l) / 2, k = 80;
      t.fillRect(g, k, l, p), t.strokeStyle = `rgba(255, 100, 100, ${r})`, t.lineWidth = 3, t.strokeRect(g, k, l, p), t.fillStyle = `rgba(255, 255, 255, ${r})`, t.font = "bold 20px monospace", t.textAlign = "center", t.fillText(this.birdEvent.alertMessage, e / 2, k + 38), t.restore();
    }
    if (this.birdEvent && !this.isPaused) {
      const o = Math.max(0, this.birdEvent.timer), r = Math.floor(o / 6e4), l = Math.floor(o % 6e4 / 1e3), p = `🐦 ${r}:${l.toString().padStart(2, "0")}`;
      t.save(), t.fillStyle = "rgba(0, 0, 0, 0.5)", t.fillRect(e - 100, 10, 90, 25), t.fillStyle = o < 6e4 ? "#ff6666" : "#fff", t.font = "14px monospace", t.textAlign = "right", t.fillText(p, e - 15, 28), t.restore();
    }
    if (this.selectedItem === "ak47" && !this.isPaused) {
      const o = Math.min(e, i) * 55e-4, r = e * 0.75, l = i * 0.78;
      t.save(), t.translate(r, l), t.rotate(-0.1), t.fillStyle = "#d4a574", t.beginPath(), t.ellipse(45 * o, 25 * o, 18 * o, 12 * o, 0.3, 0, Math.PI * 2), t.fill(), t.fillStyle = "#c49a6c";
      for (let p = 0; p < 4; p++)
        t.beginPath(), t.ellipse((35 + p * 7) * o, 35 * o, 4 * o, 8 * o, 0.2, 0, Math.PI * 2), t.fill();
      t.fillStyle = "#d4a574", t.beginPath(), t.ellipse(30 * o, 15 * o, 6 * o, 10 * o, -0.5, 0, Math.PI * 2), t.fill(), t.fillStyle = "#5a3d2b", t.beginPath(), t.moveTo(80 * o, -5 * o), t.lineTo(160 * o, 0 * o), t.lineTo(165 * o, 25 * o), t.lineTo(155 * o, 30 * o), t.lineTo(80 * o, 25 * o), t.closePath(), t.fill(), t.fillStyle = "#6b4d3b", t.fillRect(100 * o, 2 * o, 50 * o, 8 * o), t.fillRect(95 * o, 15 * o, 55 * o, 6 * o), t.fillStyle = "#333", t.fillRect(155 * o, -2 * o, 8 * o, 30 * o), t.fillStyle = "#2a2a2a", t.fillRect(-30 * o, -8 * o, 115 * o, 30 * o), t.fillStyle = "#3a3a3a", t.fillRect(-25 * o, -12 * o, 100 * o, 8 * o), t.fillStyle = "#1a1a1a", t.fillRect(15 * o, -6 * o, 25 * o, 12 * o), t.fillStyle = "#1a1a1a", t.fillRect(-140 * o, -4 * o, 115 * o, 14 * o), t.fillStyle = "#111", t.fillRect(-180 * o, 0 * o, 45 * o, 8 * o), t.fillStyle = "#000", t.beginPath(), t.ellipse(-182 * o, 4 * o, 3 * o, 3 * o, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = "#333", t.fillRect(-130 * o, -10 * o, 100 * o, 5 * o), t.fillStyle = "#111";
      for (let p = 0; p < 4; p++)
        t.beginPath(), t.ellipse((-120 + p * 22) * o, 3 * o, 6 * o, 3 * o, 0, 0, Math.PI * 2), t.fill();
      t.fillStyle = "#1a1a1a", t.fillRect(-145 * o, -20 * o, 6 * o, 18 * o), t.fillRect(-148 * o, -22 * o, 12 * o, 4 * o), t.fillRect(-5 * o, -18 * o, 15 * o, 8 * o), t.fillStyle = "#333", t.beginPath(), t.moveTo(10 * o, 22 * o), t.lineTo(35 * o, 22 * o), t.quadraticCurveTo(45 * o, 50 * o, 35 * o, 80 * o), t.lineTo(15 * o, 85 * o), t.quadraticCurveTo(5 * o, 55 * o, 10 * o, 22 * o), t.closePath(), t.fill(), t.strokeStyle = "#222", t.lineWidth = 1.5 * o;
      for (let p = 0; p < 4; p++)
        t.beginPath(), t.moveTo((12 + p * 2) * o, (35 + p * 12) * o), t.lineTo((32 + p * 1) * o, (38 + p * 12) * o), t.stroke();
      t.fillStyle = "#5a3d2b", t.beginPath(), t.moveTo(45 * o, 22 * o), t.lineTo(65 * o, 22 * o), t.lineTo(70 * o, 65 * o), t.lineTo(45 * o, 70 * o), t.closePath(), t.fill(), t.fillStyle = "#4a2d1b";
      for (let p = 0; p < 5; p++)
        t.fillRect(50 * o, (28 + p * 8) * o, 12 * o, 3 * o);
      if (t.strokeStyle = "#2a2a2a", t.lineWidth = 3 * o, t.beginPath(), t.arc(25 * o, 35 * o, 15 * o, -0.8, 2.2), t.stroke(), t.fillStyle = "#222", t.fillRect(22 * o, 28 * o, 4 * o, 12 * o), this.muzzleFlash > 0) {
        const p = 25 + Math.random() * 20, g = -190 * o, k = 4 * o;
        t.fillStyle = "rgba(255, 100, 0, 0.5)", t.beginPath(), t.arc(g, k, p * o * 1.5, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(255, 150, 0, 0.8)", t.beginPath(), t.arc(g, k, p * o, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ffff00", t.beginPath(), t.arc(g, k, p * o * 0.4, 0, Math.PI * 2), t.fill(), t.strokeStyle = "#ffff88", t.lineWidth = 2;
        for (let v = 0; v < 6; v++) {
          const M = Math.PI + (Math.random() - 0.5) * 1.5, w = (20 + Math.random() * 35) * o;
          t.beginPath(), t.moveTo(g, k), t.lineTo(g + Math.cos(M) * w, k + Math.sin(M) * w), t.stroke();
        }
      }
      t.restore();
    }
    if (this.headSubmergedWater && (t.fillStyle = "rgba(0, 100, 200, 0.25)", t.fillRect(0, 0, e, i)), this.headSubmergedLava) {
      const o = Date.now() * 5e-3;
      t.fillStyle = "rgba(255, 80, 0, 0.4)", t.fillRect(0, 0, e, i), t.fillStyle = "rgba(255, 50, 0, 0.6)";
      for (let l = 0; l < 12; l++) {
        const p = l / 12 * e, g = 60 + Math.sin(o + l * 0.8) * 30 + Math.sin(o * 1.5 + l) * 20;
        t.beginPath(), t.moveTo(p - 30, i), t.quadraticCurveTo(p, i - g, p + 30, i), t.fill();
      }
      t.fillStyle = "rgba(255, 100, 0, 0.5)";
      for (let l = 0; l < 8; l++) {
        const p = l / 8 * e + 40, g = 40 + Math.sin(o * 0.8 + l * 1.2) * 25;
        t.beginPath(), t.moveTo(p - 25, 0), t.quadraticCurveTo(p, g, p + 25, 0), t.fill();
      }
      t.fillStyle = "rgba(255, 60, 0, 0.5)";
      for (let l = 0; l < 6; l++) {
        const p = l / 6 * i, g = 40 + Math.sin(o + l) * 20;
        t.beginPath(), t.moveTo(0, p - 30), t.quadraticCurveTo(g, p, 0, p + 30), t.fill(), t.beginPath(), t.moveTo(e, p - 30), t.quadraticCurveTo(e - g, p, e, p + 30), t.fill();
      }
      const r = t.createRadialGradient(e / 2, i / 2, 0, e / 2, i / 2, e * 0.7);
      r.addColorStop(0, "rgba(255, 50, 0, 0)"), r.addColorStop(0.7, "rgba(255, 30, 0, 0.3)"), r.addColorStop(1, "rgba(200, 0, 0, 0.6)"), t.fillStyle = r, t.fillRect(0, 0, e, i);
    }
  },
  project(t, e, i) {
    const a = t - this.camera.x, s = e - this.camera.y, c = i - this.camera.z, f = Math.cos(-this.camera.rotY), h = Math.sin(-this.camera.rotY), n = a * f - c * h, d = a * h + c * f, m = Math.cos(-this.camera.rotX), u = Math.sin(-this.camera.rotX), y = s * m - d * u, b = s * u + d * m;
    if (b <= 0.1) return null;
    const T = 400, P = this.canvas.width / 2 + n / b * T, L = this.canvas.height / 2 - y / b * T;
    return { x: P, y: L, z: b };
  },
  // Update block tooltip display
  updateBlockTooltip(t) {
    const e = document.getElementById("blockTooltip");
    if (!e) return;
    const a = t ? {
      petalSocket: { name: "Petal Socket", item: "Requires: Sakura Petal", desc: "Place a cherry blossom petal here" },
      ropeSocket: { name: "Rope Socket", item: "Requires: Sacred Rope", desc: "Place a shimenawa rope here" },
      charmSocket: { name: "Charm Socket", item: "Requires: Omamori", desc: "Place the protective charm here" },
      plaqueSocket: { name: "Plaque Socket", item: "Requires: Wish Plaque", desc: "Place a wooden ema here" },
      incenseSocket: { name: "Incense Socket", item: "Requires: Incense", desc: "Place purifying incense here" },
      petalSocketFilled: { name: "Petal Socket ✓", item: "FILLED", desc: "Cherry petal placed!" },
      ropeSocketFilled: { name: "Rope Socket ✓", item: "FILLED", desc: "Sacred rope placed!" },
      charmSocketFilled: { name: "Charm Socket ✓", item: "FILLED", desc: "Charm placed!" },
      plaqueSocketFilled: { name: "Plaque Socket ✓", item: "FILLED", desc: "Wish plaque placed!" },
      incenseSocketFilled: { name: "Incense Socket ✓", item: "FILLED", desc: "Incense placed!" }
    }[t] : null;
    if (a) {
      e.classList.add("active"), e.querySelector(".tooltip-title").textContent = a.name;
      const s = a.item === "FILLED";
      e.querySelector(".tooltip-desc").innerHTML = `<span style="color:${s ? "#4f4" : "#ffd700"}">${a.item}</span><br>${a.desc}`;
    } else
      e.classList.remove("active");
  },
  // Render player model (first-person body visible when looking down)
  renderPlayerModel(t, e, i, a, s) {
    const c = Math.max(0, this.camera.rotX * 2);
    if (c < 0.05) {
      this.renderHeldItem(t, e, i, a, s);
      return;
    }
    const f = Math.min(1, c);
    t.save();
    const h = s - 50 + (1 - c) * 200;
    this.drawPlayerBody3D(t, e, h, f, c), t.restore(), this.renderHeldItem(t, e, i, a, s);
  },
  // Render held item in first person
  renderHeldItem(t, e, i, a, s) {
    const c = this.inventory.hotbar[this.selectedSlot];
    if (!c) return;
    const f = c.id, h = Math.sin(Date.now() * 3e-3) * 3, n = a - 120, d = s - 100 + h, m = 60;
    t.save(), t.translate(n, d), t.rotate(-0.2), t.fillStyle = "#ffdab9", t.beginPath(), t.ellipse(0, 20, 25, 35, 0.3, 0, Math.PI * 2), t.fill();
    const u = this.blockColors[f];
    if (u) {
      const y = m * 0.5;
      t.translate(0, -10), t.fillStyle = u.top, t.beginPath(), t.moveTo(0, -y), t.lineTo(y, -y / 2), t.lineTo(0, 0), t.lineTo(-y, -y / 2), t.closePath(), t.fill(), t.fillStyle = u.side, t.beginPath(), t.moveTo(-y, -y / 2), t.lineTo(0, 0), t.lineTo(0, y), t.lineTo(-y, y / 2), t.closePath(), t.fill(), t.fillStyle = this.darkenColor(u.side, 0.7), t.beginPath(), t.moveTo(0, 0), t.lineTo(y, -y / 2), t.lineTo(y, y / 2), t.lineTo(0, y), t.closePath(), t.fill();
    } else if (f === "ak47")
      t.fillStyle = "#333", t.fillRect(-30, -20, 80, 15), t.fillStyle = "#8b4513", t.fillRect(-10, -5, 25, 25), t.fillStyle = "#222", t.fillRect(10, -5, 8, 20);
    else if (f === "berdger")
      t.fillStyle = "#daa520", t.beginPath(), t.ellipse(0, -15, 25, 12, 0, Math.PI, 0), t.fill(), t.fillStyle = "#8b4513", t.fillRect(-22, -8, 44, 10), t.fillStyle = "#228b22", t.fillRect(-20, 0, 40, 5), t.fillStyle = "#daa520", t.beginPath(), t.ellipse(0, 10, 23, 10, 0, 0, Math.PI), t.fill();
    else if (f === "apple")
      t.fillStyle = "#dc143c", t.beginPath(), t.arc(0, -5, 20, 0, Math.PI * 2), t.fill(), t.fillStyle = "#654321", t.fillRect(-2, -30, 4, 10), t.fillStyle = "#228b22", t.beginPath(), t.ellipse(5, -28, 8, 4, 0.5, 0, Math.PI * 2), t.fill();
    else if (f === "water_bucket" || f === "lava_bucket")
      t.fillStyle = "#888", t.beginPath(), t.moveTo(-20, -25), t.lineTo(20, -25), t.lineTo(15, 15), t.lineTo(-15, 15), t.closePath(), t.fill(), t.fillStyle = f === "water_bucket" ? "#4a90d9" : "#ff6600", t.fillRect(-15, -15, 30, 25);
    else if (f === "seeds") {
      t.fillStyle = "#daa520";
      for (let y = 0; y < 5; y++)
        t.beginPath(), t.ellipse(Math.cos(y) * 10, Math.sin(y) * 8 - 10, 4, 6, y, 0, Math.PI * 2), t.fill();
    }
    t.restore();
  },
  // Draw the player body in 3D style with shading
  drawPlayerBody3D(t, e, i, a, s) {
    t.save();
    const c = t.createLinearGradient(e - 50, i, e + 50, i);
    c.addColorStop(0, `rgba(180, 130, 150, ${a})`), c.addColorStop(0.3, `rgba(255, 183, 197, ${a})`), c.addColorStop(0.7, `rgba(255, 183, 197, ${a})`), c.addColorStop(1, `rgba(180, 130, 150, ${a})`), t.fillStyle = c, t.beginPath(), t.moveTo(e - 35, i + 5), t.lineTo(e + 35, i + 5), t.quadraticCurveTo(e + 50, i + 40, e + 45, i + 80), t.lineTo(e - 45, i + 80), t.quadraticCurveTo(e - 50, i + 40, e - 35, i + 5), t.closePath(), t.fill(), t.fillStyle = `rgba(255, 240, 245, ${a * 0.8})`, t.beginPath(), t.moveTo(e - 20, i + 5), t.lineTo(e, i + 25), t.lineTo(e + 20, i + 5), t.closePath(), t.fill();
    const f = t.createRadialGradient(e - 55, i + 30, 0, e - 55, i + 30, 30);
    f.addColorStop(0, `rgba(255, 228, 205, ${a})`), f.addColorStop(1, `rgba(220, 180, 160, ${a})`), t.fillStyle = f, t.beginPath(), t.ellipse(e - 52, i + 35, 14, 28, -0.2, 0, Math.PI * 2), t.fill();
    const h = t.createRadialGradient(e + 55, i + 30, 0, e + 55, i + 30, 30);
    h.addColorStop(0, `rgba(255, 228, 205, ${a})`), h.addColorStop(1, `rgba(220, 180, 160, ${a})`), t.fillStyle = h, t.beginPath(), t.ellipse(e + 52, i + 35, 14, 28, 0.2, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 218, 195, ${a})`, t.beginPath(), t.arc(e - 55, i + 60, 12, 0, Math.PI * 2), t.fill(), t.beginPath(), t.arc(e + 55, i + 60, 12, 0, Math.PI * 2), t.fill();
    const n = t.createLinearGradient(e - 40, i + 75, e + 40, i + 75);
    n.addColorStop(0, `rgba(50, 70, 100, ${a})`), n.addColorStop(0.3, `rgba(70, 90, 120, ${a})`), n.addColorStop(0.7, `rgba(70, 90, 120, ${a})`), n.addColorStop(1, `rgba(50, 70, 100, ${a})`), t.fillStyle = n, t.beginPath(), t.roundRect(e - 38, i + 78, 28, 55, 3), t.fill(), t.beginPath(), t.roundRect(e + 10, i + 78, 28, 55, 3), t.fill(), t.fillStyle = `rgba(100, 60, 30, ${a})`, t.beginPath(), t.roundRect(e - 42, i + 128, 35, 20, 4), t.fill(), t.beginPath(), t.roundRect(e + 7, i + 128, 35, 20, 4), t.fill(), t.fillStyle = `rgba(255, 255, 255, ${a * 0.2})`, t.beginPath(), t.ellipse(e - 30, i + 133, 8, 3, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.ellipse(e + 20, i + 133, 8, 3, 0, 0, Math.PI * 2), t.fill(), t.restore();
  },
  darkenColor(t, e) {
    const i = t + e;
    if (this.colorCache || (this.colorCache = {}), this.colorCache[i]) return this.colorCache[i];
    const a = Math.floor(parseInt(t.slice(1, 3), 16) * e), s = Math.floor(parseInt(t.slice(3, 5), 16) * e), c = Math.floor(parseInt(t.slice(5, 7), 16) * e), f = `rgb(${a},${s},${c})`;
    return this.colorCache[i] = f, f;
  },
  gameLoop(t) {
    if (!this.isActive) {
      this.gameLoopId = null;
      return;
    }
    this.lastFrameTime || (this.lastFrameTime = t);
    const e = 1e3 / this.settings.targetFps, i = t - this.lastFrameTime;
    if (i >= e) {
      if (this.lastFrameTime = t - i % e, this.fpsCounter.frames++, t - this.fpsCounter.lastTime >= 1e3) {
        this.fpsCounter.fps = this.fpsCounter.frames, this.fpsCounter.frames = 0, this.fpsCounter.lastTime = t;
        const a = document.getElementById("debugFps");
        a && (a.textContent = `${this.fpsCounter.fps} FPS`);
      }
      this.isPaused || (this.update(), this.updateBirds(), this.updateParticles(), this.updateFluids(), this.updateWind(), this.updatePetals(), this.updateDroppedItems(), this.render(), this.settings.showFps && (this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)", this.ctx.fillRect(this.canvas.width - 70, this.canvas.height - 25, 65, 20), this.ctx.fillStyle = "#00ff00", this.ctx.font = "12px monospace", this.ctx.textAlign = "right", this.ctx.fillText(`${this.fpsCounter.fps} FPS`, this.canvas.width - 10, this.canvas.height - 10), this.ctx.textAlign = "left"));
    }
    this.gameLoopId = requestAnimationFrame((a) => this.gameLoop(a));
  },
  start() {
    this.fullInit(), this.isActive = !0, this.isPaused = !1, this.pointerLocked = !1, this.stats = { blocksPlaced: 0, blocksBroken: 0, distance: 0, jumps: 0, startTime: Date.now() }, document.getElementById("minecraftGame").classList.add("active"), document.getElementById("pauseMenu").classList.remove("active"), document.getElementById("gameUI").style.display = "flex";
    const e = (() => {
      const f = (d, m) => {
        let u = null;
        for (let E = 40; E >= 0; E--) {
          const H = this.getBlock(d, E, m);
          if (H && H !== "water" && H !== "lava") {
            u = E;
            break;
          }
        }
        if (u === null) return null;
        const y = u + 1, b = u + 2, T = this.getBlock(d, y, m), P = this.getBlock(d, b, m), L = !T || T === "water" || T === "lava", z = !P || P === "water" || P === "lava", R = this.getBlock(d, u, m), I = R !== "water" && R !== "lava" && R !== "sand";
        return L && z ? {
          x: d,
          y: y + this.playerEyeHeight,
          z: m,
          priority: I ? 1 : 2
          // Prefer dry land
        } : null;
      };
      let h = f(0, -8);
      if (h && h.priority === 1)
        return h;
      const n = 30;
      for (let d = 1; d <= n; d++) {
        for (let m = -d; m <= d; m++)
          for (let u = -d; u <= d; u++) {
            if (Math.abs(m) !== d && Math.abs(u) !== d) continue;
            const y = f(0 + m, -8 + u);
            if (y) {
              if (y.priority === 1)
                return y;
              (!h || y.priority < h.priority) && (h = y);
            }
          }
        if (h && d > 5)
          return h;
      }
      return { x: 0, y: 30, z: 0 };
    })();
    this.camera = { x: e.x + 0.5, y: e.y, z: e.z + 0.5, rotX: -0.3, rotY: 0 }, this.canvas.style.filter = "", this.velocity = { x: 0, y: 0, z: 0 }, this.isJumping = !1, this.inWater = !1, this.inLava = !1, this.swimming = !1, this.headSubmergedWater = !1, this.headSubmergedLava = !1, this.particles = [], this.fluidUpdates = [], this.birdEvent = {
      timer: 5 * 60 * 1e3,
      // 5 minutes in ms
      lastUpdate: Date.now(),
      currentEvent: 0,
      events: [
        {
          name: "SWARM",
          description: "the birds will swarm!",
          action: () => this.triggerBirdSwarm()
        },
        {
          name: "RAGE",
          description: "the birds will rage!",
          action: () => this.triggerBirdRage()
        },
        {
          name: "MULTIPLY",
          description: "the birds will multiply!",
          action: () => this.triggerBirdMultiply()
        },
        {
          name: "CREEPER INVASION",
          description: "creepers will stalk you!",
          action: () => this.triggerCreeperInvasion()
        }
      ],
      alertShown: { five: !1, three: !1, one: !1, thirty: !1, ten: !1 },
      alertMessage: null,
      alertFade: 0
    }, this.survivalStats = {
      score: 0,
      wave: 1,
      birdsDefeated: 0,
      objectiveTimer: 0,
      currentObjective: null,
      objectives: [
        { text: "Survive the bird apocalypse!", type: "survive" },
        { text: "Find the Ritual Temple", type: "find_temple" },
        { text: "Collect 5 apples", type: "collect", item: "apple", count: 5 },
        { text: "Knock back 10 birds", type: "knockback", count: 10 },
        { text: "Complete the Omamori ritual", type: "ritual" }
      ]
    }, this.survivalStats.currentObjective = this.survivalStats.objectives[0], this.updateSurvivalHUD();
    const i = document.getElementById("petalCanvas");
    i && (i.style.display = "none");
    const a = document.getElementById("flameParticles");
    a && (a.style.visibility = "hidden"), document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", document.getElementById("clickToPlay").classList.add("active"), this.gameLoopId && cancelAnimationFrame(this.gameLoopId), setTimeout(() => {
      this.updateHotbarDisplay(), this.updateHotbar();
    }, 50), this.gameLoop();
  },
  pause() {
    this.isActive && (this.isPaused = !0, document.getElementById("pauseMenu").classList.add("active"), document.getElementById("gameUI").style.display = "none", document.getElementById("clickToPlay").classList.remove("active"), this.showSubmenu("menuMain"), document.pointerLockElement && document.exitPointerLock());
  },
  resume() {
    this.isPaused = !1, document.getElementById("pauseMenu").classList.remove("active"), document.getElementById("gameUI").style.display = "flex", document.getElementById("clickToPlay").classList.add("active");
  },
  updateFullscreenButton() {
    const t = document.getElementById("btnFullscreen"), e = document.fullscreenElement || document.webkitFullscreenElement;
    t.textContent = e ? "Windowed" : "Fullscreen", e ? (this.canvas.width = window.innerWidth, this.canvas.height = window.innerHeight) : (this.canvas.width = 800, this.canvas.height = 450);
  },
  stop() {
    if (this.gameLoopId && (cancelAnimationFrame(this.gameLoopId), this.gameLoopId = null), this.isActive = !1, this.isPaused = !1, this.pointerLocked = !1, this.particles = [], this.fluidUpdates = [], this.fluidUpdateTimer = 0, this.birdPruneTimer = 0, this.inWater = !1, this.inLava = !1, this.swimming = !1, this.headSubmergedWater = !1, this.headSubmergedLava = !1, this.pestBirds)
      for (const i of this.pestBirds)
        i.anger = 0, i.timesShot = 0, i.state = "circling";
    this.canvas.width = 800, this.canvas.height = 450, this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height), document.getElementById("minecraftGame").classList.remove("active"), document.getElementById("pauseMenu").classList.remove("active"), document.getElementById("clickToPlay").classList.remove("active"), document.getElementById("inventoryScreen").classList.remove("active"), this.inventoryOpen = !1, this.canvas.style.filter = "", document.pointerLockElement && document.exitPointerLock(), (document.fullscreenElement || document.webkitFullscreenElement) && (document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen && document.webkitExitFullscreen()), this.keys = {}, document.body.style.overflow = "", document.documentElement.style.overflow = "";
    const t = document.getElementById("petalCanvas");
    t && (t.style.display = "block");
    const e = document.getElementById("flameParticles");
    e && (e.style.visibility = "visible");
  }
};
class xt {
  constructor() {
    Tt(this, "_game");
    Tt(this, "_initialized");
    this._game = Vt, this._initialized = !1;
  }
  /**
   * Initialize the game with options
   */
  init(e = {}) {
    var i, a;
    if (!document.getElementById("minecraftGame")) {
      let s = document.body;
      e.container && (s = typeof e.container == "string" ? document.querySelector(e.container) || document.body : e.container), Jt(s);
    }
    if (this._game.init(), this._initialized = !0, e.trigger) {
      const s = typeof e.trigger == "string" ? document.querySelector(e.trigger) : e.trigger;
      s && (s.addEventListener("click", () => this.start()), s.style.cursor = "pointer");
    }
    return (i = document.getElementById("closeMinecraft")) == null || i.addEventListener("click", () => this.stop()), (a = document.getElementById("clickToPlay")) == null || a.addEventListener("click", () => {
      this._game.isActive && !this._game.isPaused && this._game.canvas && this._game.canvas.requestPointerLock();
    }), window.addEventListener("beforeunload", () => {
      this._game.isActive && this.stop();
    }), this;
  }
  /**
   * Start the game
   */
  start() {
    return this._initialized || this.init(), this._game.start(), this;
  }
  /**
   * Stop the game
   */
  stop() {
    return this._game.stop(), this;
  }
  /**
   * Pause the game
   */
  pause() {
    return this._game.pause(), this;
  }
  /**
   * Resume the game
   */
  resume() {
    return this._game.resume(), this;
  }
  /**
   * Get game stats
   */
  getStats() {
    return { ...this._game.stats };
  }
  /**
   * Get game settings
   */
  get settings() {
    return this._game.settings;
  }
  /**
   * Update game settings
   */
  set settings(e) {
    Object.assign(this._game.settings, e);
  }
  /**
   * Check if game is active
   */
  get isActive() {
    return this._game.isActive;
  }
  /**
   * Check if game is paused
   */
  get isPaused() {
    return this._game.isPaused;
  }
  /**
   * Get the underlying game engine for advanced usage
   */
  get engine() {
    return this._game;
  }
}
if (typeof window < "u") {
  window.SakuraCraft = xt, window.SakuraCraftGame = xt;
  const t = document.currentScript;
  if (t != null && t.hasAttribute("data-auto-init")) {
    const e = t.getAttribute("data-trigger");
    document.addEventListener("DOMContentLoaded", () => {
      const i = new xt();
      i.init({ trigger: e ?? void 0 }), window.sakuraCraft = i;
    });
  }
}
export {
  xt as SakuraCraftGame,
  xt as default,
  Vt as minecraftGame
};
//# sourceMappingURL=sakuracraft.es.js.map
