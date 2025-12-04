var Qt = Object.defineProperty;
var Jt = (t, e, i) => e in t ? Qt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var It = (t, e, i) => Jt(t, typeof e != "symbol" ? e + "" : e, i);
const Vt = `
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
function te(t = document.body) {
  const e = document.createElement("div");
  for (e.innerHTML = Vt; e.firstChild; )
    t.appendChild(e.firstChild);
}
const ee = {
  canvas: null,
  ctx: null,
  isActive: !1,
  isPaused: !1,
  camera: { x: 0, y: 5, z: 0, rotX: 0, rotY: 0, sneaking: !1, normalHeight: 1.6, sneakHeight: 1.2 },
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
    function i(s, c, d) {
      return s + d * (c - s);
    }
    function a(s, c, d) {
      const r = s & 3, o = r < 2 ? c : d, f = r < 2 ? d : c;
      return (r & 1 ? -o : o) + (r & 2 ? -f : f);
    }
    return function(s, c) {
      const d = Math.floor(s) & 255, r = Math.floor(c) & 255;
      s -= Math.floor(s), c -= Math.floor(c);
      const o = e(s), f = e(c), m = t[d] + r, u = t[d + 1] + r;
      return i(
        i(a(t[m], s, c), a(t[u], s - 1, c), o),
        i(a(t[m + 1], s, c - 1), a(t[u + 1], s - 1, c - 1), o),
        f
      );
    };
  }(),
  // Fractal Brownian Motion for more natural terrain
  fbm(t, e, i = 4) {
    let a = 0, s = 1, c = 1, d = 0;
    for (let r = 0; r < i; r++)
      a += this.noise2D(t * c, e * c) * s, d += s, s *= 0.5, c *= 2;
    return a / d;
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
        const y = this.fbm(m * 0.03, u * 0.03, 2) * 10, b = this.fbm(m * 0.05 + 100, u * 0.05 + 100, 2) * 5, B = Math.sqrt(m * m + u * u) / t, C = Math.max(0, 1 - B * 0.5);
        let L = Math.floor(i + (y + b) * C);
        L = Math.max(1, Math.min(22, L));
        const z = `${m},${u}`;
        a[z] = L, s[z] = this.noise2D(m * 0.03 + 500, u * 0.03 + 500);
      }
    for (let m = -t; m <= t; m++)
      for (let u = -t; u <= t; u++) {
        const y = `${m},${u}`, b = a[y], B = s[y], C = b <= e + 1 && b >= e - 1, L = B > 0.3 && b > e + 2;
        for (let z = Math.max(0, b - 3); z < b - 1; z++)
          this.setBlock(m, z, u, "stone");
        if (C || b <= e ? (this.setBlock(m, b - 1, u, "sand"), this.setBlock(m, b, u, "sand")) : L ? (this.setBlock(m, b - 1, u, "sand"), this.setBlock(m, b, u, "sand")) : (this.setBlock(m, b - 1, u, "dirt"), this.setBlock(m, b, u, "grass")), b < e)
          for (let z = b + 1; z <= e; z++)
            this.setBlock(m, z, u, "water"), this.setFluidLevel(m, z, u, 8);
      }
    for (let m = -t; m <= t; m += 2)
      for (let u = -t; u <= t; u += 2) {
        const y = `${m},${u}`, b = a[y], B = s[y], C = b <= e + 1, L = B > 0.3;
        if (b > e + 1 && !L && !C && this.noise2D(m * 0.4 + 300, u * 0.4 + 300) > 0.5 && Math.random() < 0.12) {
          const T = m - 2, D = u - 2;
          this.worldBounds && T >= this.worldBounds.minX + 2 && T + 5 <= this.worldBounds.maxX - 2 && D >= this.worldBounds.minZ + 2 && D + 5 <= this.worldBounds.maxZ - 2 && !this.checkStructureCollision(T, b + 1, D, 5, 8, 5) && (Math.random() < 0.25 ? this.generateCherryTree(m, b + 1, u) : this.generateTree(m, b + 1, u));
        }
      }
    const c = 5;
    for (let m = 0; m < c; m++) {
      const u = Math.floor(Math.random() * t * 2) - t, y = Math.floor(Math.random() * t * 2) - t, b = `${u},${y}`, B = a[b] || i;
      if (B > e) {
        this.setBlock(u, B + 1, y, "ritualChest");
        const C = this.ritualItems[m % this.ritualItems.length];
        this.chestContents = this.chestContents || {}, this.chestContents[`${u},${B + 1},${y}`] = [
          { type: C, count: 1 }
        ];
      }
    }
    for (let m = 0; m < 30; m++) {
      const u = Math.floor(Math.random() * t * 2) - t, y = Math.floor(Math.random() * t * 2) - t, b = `${u},${y}`, B = a[b] || i;
      B > e && this.droppedItems.push({
        x: u + 0.5,
        y: B + 1.2,
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
    let d, r;
    do
      d = Math.floor(Math.random() * (t - 20)) + 15, r = Math.floor(Math.random() * (t - 20)) + 15, Math.random() < 0.5 && (d = -d), Math.random() < 0.5 && (r = -r);
    while (Math.abs(d) < 20 || Math.abs(r) < 20);
    const o = `${d},${r}`, f = a[o] || i;
    this.generateRitualTemple(d, f + 1, r), this.initBirds(), this.initPestBirds();
  },
  generateBuildings(t) {
    const e = ["church", "house1", "house2", "house3", "grocery", "wcdonalds"];
    let a = !1;
    for (let s = -Math.floor(t / 25); s <= Math.floor(t / 25); s++)
      for (let c = -Math.floor(t / 25); c <= Math.floor(t / 25); c++) {
        if (s === 0 && c === 0) continue;
        const d = s * 25, r = c * 25, o = 2 + Math.floor(Math.random() * 5);
        for (let f = 0; f < o; f++) {
          const m = d + 3 + Math.floor(Math.random() * 19), u = r + 3 + Math.floor(Math.random() * 19);
          if (!a && Math.random() < 0.3 && this.tryPlaceBuilding(m, u, ["wcdonalds"])) {
            a = !0;
            continue;
          }
          this.tryPlaceBuilding(m, u, e);
        }
      }
    if (!a)
      for (let s = 0; s < 50; s++) {
        const c = 25 + Math.floor(Math.random() * 20), d = 25 + Math.floor(Math.random() * 20);
        if (this.tryPlaceBuilding(c, d, ["wcdonalds"]))
          break;
      }
  },
  tryPlaceBuilding(t, e, i) {
    const a = this.getHighestBlock(t, e);
    if (!a || a < 7) return !1;
    const s = this.getBlock(t, a, e);
    if (s === "water" || s === "sand") return !1;
    const c = this.getHighestBlock(t + 3, e) || a, d = this.getHighestBlock(t - 3, e) || a, r = this.getHighestBlock(t, e + 3) || a, o = this.getHighestBlock(t, e - 3) || a;
    if (Math.max(Math.abs(c - a), Math.abs(d - a), Math.abs(r - a), Math.abs(o - a)) > 2) return !1;
    for (const u of this.buildings)
      if (Math.sqrt((t - u.x) ** 2 + (e - u.z) ** 2) < 15) return !1;
    const f = i[Math.floor(Math.random() * i.length)], m = a + 1;
    switch (this.buildings.push({ x: t, z: e, type: f, y: m }), f) {
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
    const r = t + 3, o = i + 2;
    for (let m = 8; m < 13; m++)
      this.setBlock(r, e + m, o, "stone"), m < 11 && (Math.random() > 0.3 && this.setBlock(r + 1, e + m, o, "stone"), Math.random() > 0.3 && this.setBlock(r - 1, e + m, o, "stone"));
    const f = e + 8 + 5;
    this.setBlock(r, f, o, "stone"), this.setBlock(r, f + 1, o, "stone"), this.setBlock(r, f + 2, o, "stone"), this.setBlock(r - 1, f + 1, o, "stone"), this.setBlock(r + 1, f + 1, o, "stone");
  },
  // Small cottage house
  generateHouse1(t, e, i) {
    for (let r = 0; r < 5; r++)
      for (let o = 0; o < 6; o++)
        this.setBlock(t + r, e - 1, i + o, "wood");
    for (let r = 0; r < 5; r++)
      for (let o = 0; o < 6; o++)
        for (let f = 0; f < 4; f++)
          if ((r === 0 || r === 4 || o === 0 || o === 5) && Math.random() > 0.25) {
            if (o === 5 && r === 2 && f < 2 || r === 0 && f === 1 && o === 2) continue;
            this.setBlock(t + r, e + f, i + o, "wood");
          }
    for (let r = -1; r <= 5; r++)
      for (let o = 0; o < 6; o++)
        Math.random() > 0.25 && this.setBlock(t + r, e + 4, i + o, "leaves");
  },
  // Two-story house
  generateHouse2(t, e, i) {
    for (let r = 0; r < 6; r++)
      for (let o = 0; o < 7; o++)
        this.setBlock(t + r, e - 1, i + o, "stone");
    for (let r = 0; r < 6; r++)
      for (let o = 0; o < 7; o++)
        for (let f = 0; f < 6; f++)
          if ((r === 0 || r === 5 || o === 0 || o === 6) && Math.random() > 0.3) {
            if (o === 6 && r >= 2 && r <= 3 && f < 2 || (r === 0 || r === 5) && (f === 1 || f === 4) && (o === 2 || o === 4)) continue;
            this.setBlock(t + r, e + f, i + o, "brick");
          }
    for (let r = 1; r < 5; r++)
      for (let o = 1; o < 6; o++)
        Math.random() > 0.3 * 2 && this.setBlock(t + r, e + 3, i + o, "wood");
  },
  // L-shaped house
  generateHouse3(t, e, i) {
    for (let s = 0; s < 5; s++)
      for (let c = 0; c < 8; c++) {
        this.setBlock(t + s, e - 1, i + c, "stone");
        for (let d = 0; d < 4; d++)
          if ((s === 0 || s === 4 || c === 0 || c === 7) && Math.random() > 0.35) {
            if (c === 7 && s === 2 && d < 2) continue;
            this.setBlock(t + s, e + d, i + c, "brick");
          }
      }
    for (let s = 5; s < 9; s++)
      for (let c = 0; c < 5; c++) {
        this.setBlock(t + s, e - 1, i + c, "stone");
        for (let d = 0; d < 4; d++)
          (s === 8 || c === 0 || c === 4 || s === 5 && c > 4) && Math.random() > 0.35 && this.setBlock(t + s, e + d, i + c, "brick");
      }
  },
  // Abandoned grocery store
  generateGrocery(t, e, i) {
    for (let r = 0; r < 10; r++)
      for (let o = 0; o < 8; o++)
        this.setBlock(t + r, e - 1, i + o, "stone");
    for (let r = 0; r < 10; r++)
      for (let o = 0; o < 8; o++)
        for (let f = 0; f < 4; f++)
          if ((r === 0 || r === 9 || o === 0 || o === 7) && Math.random() > 0.25) {
            if (o === 7 && r >= 3 && r <= 6 && f < 3 || o === 7 && (r === 1 || r === 8) && f >= 1 && f <= 2) continue;
            this.setBlock(t + r, e + f, i + o, "stone");
          }
    for (let r = 0; r < 2; r++)
      for (let o = 2; o < 6; o++)
        Math.random() > 0.4 && (this.setBlock(t + 3 + r * 3, e, i + o, "wood"), Math.random() > 0.5 && this.setBlock(t + 3 + r * 3, e + 1, i + o, "wood"));
    for (let r = 2; r < 8; r++)
      Math.random() > 0.3 && this.setBlock(t + r, e + 4, i + 8 - 1, "stone");
  },
  // WcDonald's - the knockoff! (W instead of M, same colors)
  generateWcDonalds(t, e, i) {
    for (let u = 1; u < 8; u++)
      for (let y = 1; y < 8; y++)
        for (let b = 0; b < 6; b++) {
          const B = this.getBlock(t + u, e + b, i + y);
          B && B !== "water" && B !== "lava" && this.setBlock(t + u, e + b, i + y, null);
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
    const r = t + 4, o = i + 9, f = e + 4;
    this.setBlock(r - 2, f, o, "sand"), this.setBlock(r - 2, f + 1, o, "sand"), this.setBlock(r - 2, f + 2, o, "sand"), this.setBlock(r - 2, f + 3, o, "sand"), this.setBlock(r - 1, f, o, "sand"), this.setBlock(r - 1, f + 1, o, "sand"), this.setBlock(r, f, o, "sand"), this.setBlock(r + 1, f, o, "sand"), this.setBlock(r + 1, f + 1, o, "sand"), this.setBlock(r + 2, f, o, "sand"), this.setBlock(r + 2, f + 1, o, "sand"), this.setBlock(r + 2, f + 2, o, "sand"), this.setBlock(r + 2, f + 3, o, "sand");
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
  // Check if bird would collide with blocks
  checkBirdCollision(t, e, i, a = 0.5) {
    const s = Math.floor(t), c = Math.floor(e), d = Math.floor(i);
    for (let r = -1; r <= 1; r++)
      for (let o = -1; o <= 1; o++)
        for (let f = -1; f <= 1; f++) {
          const m = this.getBlock(s + r, c + o, d + f);
          if (m && m !== "water") {
            const u = s + r + 0.5, y = c + o + 0.5, b = d + f + 0.5;
            if (Math.sqrt(
              (t - u) ** 2 + (e - y) ** 2 + (i - b) ** 2
            ) < a + 0.7) return !0;
          }
        }
    return !1;
  },
  // Check if area is clear for structure placement
  checkStructureCollision(t, e, i, a, s, c) {
    for (let d = 0; d < a; d++)
      for (let r = 0; r < s; r++)
        for (let o = 0; o < c; o++)
          if (this.getBlock(t + d, e + r, i + o))
            return !0;
    return !1;
  },
  // Find nearest clear spot for structure
  findClearSpot(t, e, i, a, s = 20) {
    for (let d = 0; d < s; d++)
      for (let r = 0; r < Math.PI * 2; r += Math.PI / 8) {
        const o = Math.floor(t + Math.cos(r) * d), f = Math.floor(e + Math.sin(r) * d), m = this.getGroundHeight(o, f);
        if (!this.checkStructureCollision(o, m, f, i, 10, a))
          return { x: o, y: m, z: f };
      }
    const c = this.getGroundHeight(t, e);
    return { x: t, y: c, z: e };
  },
  // Toggle sneak mode
  toggleSneak() {
    this.camera.sneaking = !this.camera.sneaking, console.log("Sneaking:", this.camera.sneaking);
  },
  // Get current eye height based on sneak state
  getEyeHeight() {
    return this.camera.sneaking ? 1.3 : 1.6;
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
      const d = 1 + s.anger * 0.3, r = 1 - s.anger * 0.1, o = 0.3 + s.anger * 0.15;
      if (s.state === "knockback") {
        const T = s.x, D = s.y, $ = s.z;
        s.x += s.vx, s.y += s.vy, s.z += s.vz;
        const E = this.getBlock(Math.floor(s.x), Math.floor(s.y), Math.floor(s.z));
        if (E && E !== "water" && E !== "lava")
          if (E.includes("Leaves") || E.includes("leaves"))
            s.vx *= 0.4, s.vy *= 0.4, s.vz *= 0.4, s.stateTimer = Math.min(s.stateTimer, 90), s.caughtInLeaves = !0;
          else {
            const W = Math.floor(s.x), Y = Math.floor(s.y), R = Math.floor(s.z);
            this.getBlock(W, Math.floor(D), Math.floor($)) ? this.getBlock(Math.floor(T), Y, Math.floor($)) ? this.getBlock(Math.floor(T), Math.floor(D), R) ? (s.vx *= -0.5, s.vy *= -0.5, s.vz *= -0.5, s.x = T, s.y = D, s.z = $) : (s.vz *= -0.7, s.z = $) : (s.vy *= -0.7, s.y = D) : (s.vx *= -0.7, s.x = T), this.particles.push({
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
        const G = Math.sqrt(s.vx * s.vx + s.vy * s.vy + s.vz * s.vz), K = 0.05 + s.anger * 0.02;
        if (G < K || s.stateTimer <= 0) {
          if (s.anger = Math.min(5, s.anger + 1), s.timesShot++, s.timesShot === s.spawnThreshold && this.pestBirds.length < 15) {
            const _ = 2 + Math.floor(Math.random() * 2);
            for (let W = 0; W < _; W++) {
              const Y = Math.random() * Math.PI * 2, R = 3 + Math.random() * 2;
              this.pestBirds.push({
                x: this.camera.x + Math.cos(Y) * R,
                y: this.camera.y + 1 + Math.random(),
                z: this.camera.z + Math.sin(Y) * R,
                vx: 0,
                vy: 0,
                vz: 0,
                targetOffsetX: 0,
                targetOffsetY: 0,
                targetOffsetZ: 0,
                state: "circling",
                stateTimer: 20 + Math.random() * 30,
                angle: Y,
                circleRadius: R,
                baseCircleRadius: R,
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
          s.state = "retreating", s.stateTimer = Math.max(30, 120 - s.anger * 20), s.circleRadius = (s.baseCircleRadius + 4) * r, s.vx = s.vy = s.vz = 0, s.knockbackSpin = 0, s.caughtInLeaves = !1;
        }
        continue;
      }
      switch (s.state) {
        case "circling":
          s.angle += s.circleSpeed * d, s.targetOffsetX = Math.cos(s.angle) * s.circleRadius * r, s.targetOffsetZ = Math.sin(s.angle) * s.circleRadius * r, s.targetOffsetY = 0.5 + Math.sin(s.angle * 2) * 0.3, s.circleRadius += (s.baseCircleRadius - s.circleRadius) * 0.01, s.stateTimer <= 0 && (Math.random() < o ? (s.state = "swooping", s.swoopProgress = 0, s.stateTimer = 60) : Math.random() < 0.2 ? (s.state = "hovering", s.stateTimer = Math.max(20, 40 - s.anger * 5) + Math.random() * 40) : s.stateTimer = Math.max(15, 30 - s.anger * 5) + Math.random() * 60);
          break;
        case "swooping":
          s.swoopProgress += 0.05 * d;
          const T = s.swoopProgress;
          if (T < 0.5)
            s.targetOffsetX = Math.cos(s.angle) * s.circleRadius * (1 - T * 2), s.targetOffsetZ = Math.sin(s.angle) * s.circleRadius * (1 - T * 2), s.targetOffsetY = 0.5 - T;
          else {
            const E = (T - 0.5) * 2;
            s.targetOffsetX = Math.cos(s.angle) * s.circleRadius * E, s.targetOffsetZ = Math.sin(s.angle) * s.circleRadius * E, s.targetOffsetY = -0.5 + E;
          }
          s.swoopProgress >= 1 && (s.state = "retreating", s.stateTimer = 30);
          break;
        case "retreating":
          s.angle += s.circleSpeed * 0.5;
          const D = s.circleRadius + 2;
          s.targetOffsetX = Math.cos(s.angle) * D, s.targetOffsetZ = Math.sin(s.angle) * D, s.targetOffsetY = 1 + Math.sin(s.angle * 3) * 0.2, s.circleRadius += (s.baseCircleRadius - s.circleRadius) * 0.02, s.stateTimer <= 0 && (s.state = "circling", s.stateTimer = 60 + Math.random() * 60);
          break;
        case "hovering":
          const $ = Math.sin(Date.now() * 0.01) * 0.3;
          s.targetOffsetX = Math.sin(this.camera.rotY + $) * -1.5, s.targetOffsetZ = Math.cos(this.camera.rotY + $) * -1.5, s.targetOffsetY = 0.2 + Math.sin(Date.now() * 0.02) * 0.1, s.stateTimer <= 0 && (s.state = "circling", s.stateTimer = 80 + Math.random() * 40);
          break;
      }
      const f = t + s.targetOffsetX, m = e + s.targetOffsetY, u = i + s.targetOffsetZ, y = s.state === "swooping" ? 0.15 : 0.08;
      let b = (f - s.x) * y, B = (m - s.y) * y, C = (u - s.z) * y;
      const z = s.rageMode ? 0.12 : 0.08, F = Math.sqrt(b * b + B * B + C * C);
      if (F > z) {
        const T = z / F;
        b *= T, B *= T, C *= T;
      }
      s.x += b, s.y += B, s.z += C;
    }
  },
  updateBirds() {
    for (const t of this.birds)
      if (t.swarmMode && t.swarmTimer && (t.swarmTimer--, t.swarmTimer <= 0 && (t.swarmMode = !1)), t.swarmMode) {
        const e = this.camera.x - t.x, i = this.camera.y - t.y, a = this.camera.z - t.z, s = Math.sqrt(e * e + i * i + a * a);
        if (s > 3) {
          const c = t.x + e / s * 0.15, d = t.y + i / s * 0.1, r = t.z + a / s * 0.15;
          this.checkBirdCollision(c, t.y, t.z, 0.3) ? t.x += a / s * 0.1 : t.x = c, this.checkBirdCollision(t.x, d, t.z, 0.3) || (t.y = d), this.checkBirdCollision(t.x, t.y, r, 0.3) ? t.z += e / s * 0.1 : t.z = r;
        } else
          t.angle += 0.1, t.x = this.camera.x + Math.cos(t.angle) * 3, t.z = this.camera.z + Math.sin(t.angle) * 3, t.y = this.camera.y + Math.sin(t.wobble) * 0.5;
        t.wobble += t.wobbleSpeed * 2, t.wingPhase += 0.5;
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
      c > 1.5 && (e.vx += i / c * 0.02, e.vy += a / c * 0.015, e.vz += s / c * 0.02);
      const d = e.x + e.vx, r = e.y + e.vy, o = e.z + e.vz;
      this.checkBirdCollision(d, e.y, e.z, 0.3) ? e.vx *= -0.5 : e.x = d, this.checkBirdCollision(e.x, r, e.z, 0.3) ? e.vy *= -0.5 : e.y = r, this.checkBirdCollision(e.x, e.y, o, 0.3) ? e.vz *= -0.5 : e.z = o, e.vx *= 0.9, e.vy *= 0.9, e.vz *= 0.9, c < 2 && e.attackCooldown <= 0 && (this.velocity.x += (this.camera.x - e.x) * 0.1, this.velocity.y += 0.15, this.velocity.z += (this.camera.z - e.z) * 0.1, e.attackCooldown = 60), c > 60 && this.blueBirds.splice(t, 1);
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
    for (let o = 0; o < 11; o++)
      for (let f = 0; f < 11; f++)
        for (let m = 0; m < 10; m++)
          this.setBlock(t + o, e + m, i + f, null);
    for (let o = 0; o < 11; o++)
      for (let f = 0; f < 11; f++)
        this.setBlock(t + o, e, i + f, "ritualStone");
    for (let o = 1; o < 8; o++) {
      for (let f = 0; f < 11; f++)
        this.setBlock(t + f, e + o, i, "ritualStone"), this.setBlock(t + f, e + o, i + 11 - 1, "ritualStone");
      for (let f = 0; f < 11; f++)
        this.setBlock(t, e + o, i + f, "ritualStone"), this.setBlock(t + 11 - 1, e + o, i + f, "ritualStone");
    }
    this.setBlock(t + 11 / 2 | 0, e + 1, i, null), this.setBlock(t + 11 / 2 | 0, e + 2, i, null), this.setBlock(t + 11 / 2 | 0, e + 3, i, null);
    const d = t + 11 / 2 | 0, r = i + 11 / 2 | 0;
    this.setBlock(d, e + 1, r, "charmSocket"), this.setBlock(d - 2, e + 1, r, "petalSocket"), this.setBlock(d + 2, e + 1, r, "ropeSocket"), this.setBlock(d, e + 1, r - 2, "plaqueSocket"), this.setBlock(d, e + 1, r + 2, "incenseSocket");
    for (let o = 1; o <= 4; o++)
      this.setBlock(t + 2, e + o, i + 2, "glowstone"), this.setBlock(t + 11 - 3, e + o, i + 2, "glowstone"), this.setBlock(t + 2, e + o, i + 11 - 3, "glowstone"), this.setBlock(t + 11 - 3, e + o, i + 11 - 3, "glowstone");
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
      if (e.key.toLowerCase() === "e" && this.toggleInventory(), e.key.toLowerCase() === "c" && !e.repeat && this.toggleSneak(), e.key === "Control" && !e.repeat && (this.camera.sneaking || (this.toggleSneak(), this.camera.sneakingWithCtrl = !0)), e.key.toLowerCase() === "q" && this.dropHeldItem(), e.key.toLowerCase() === "r" && this.checkRitual() && console.log("Omamori Ritual Complete! Birds are blessed and calmed."), e.key === "`" || e.key === "~") {
        e.preventDefault(), this.toggleDebugConsole();
        return;
      }
      e.preventDefault();
    }), document.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = !1, e.key === "Control" && this.camera.sneakingWithCtrl && (this.camera.sneakingWithCtrl = !1, this.camera.sneaking && this.toggleSneak());
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
            const s = (d) => d && (d === "chest" || d === "ritualChest" || d === "buildingChest" || d.toLowerCase().includes("chest"));
            if (((d) => d && d.includes("Socket"))(a))
              return;
            if (this.setBlock(i.hit.x, i.hit.y, i.hit.z, null), this.stats.blocksBroken++, this.survivalStats && (this.survivalStats.score += 1, this.updateSurvivalHUD()), a && !s(a))
              a === "appleLeaves" ? (this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, "appleLeaves", 1), Math.random() < 0.15 && this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, "apple", 1)) : a === "cherryLeaves" ? (this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, "cherryLeaves", 1), Math.random() < 0.1 && this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, "sakuraPetal", 1)) : this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, a, 1);
            else if (s(a)) {
              const d = `${i.hit.x},${i.hit.y},${i.hit.z}`, r = this.chestContents && this.chestContents[d];
              if (r && Array.isArray(r)) {
                for (const o of r)
                  o && o.type && this.dropItem(i.hit.x + 0.5, i.hit.y + 0.5, i.hit.z + 0.5, o.type, o.count || 1);
                delete this.chestContents[d];
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
              const d = this.selectedItem === "water_bucket" ? "water" : "lava", r = c.place, o = Math.floor(this.camera.x), f = Math.floor(this.camera.z), m = Math.floor(this.camera.y - this.playerEyeHeight), u = Math.floor(this.camera.y - this.playerEyeHeight + this.playerHeight);
              let y = !1;
              for (let b = m; b <= u; b++)
                if (o === r.x && b === r.y && f === r.z) {
                  y = !0;
                  break;
                }
              if (!y) {
                this.setBlock(r.x, r.y, r.z, d), this.setFluidLevel(r.x, r.y, r.z, 8), this.fluidUpdates.push({
                  x: r.x,
                  y: r.y,
                  z: r.z,
                  type: d,
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
              const d = Math.floor(this.camera.x), r = Math.floor(this.camera.z), o = c.place, f = Math.floor(this.camera.y - this.playerEyeHeight), m = Math.floor(this.camera.y - this.playerEyeHeight + this.playerHeight);
              let u = !1;
              for (let y = f; y <= m; y++)
                if (d === o.x && y === o.y && r === o.z) {
                  u = !0;
                  break;
                }
              if (!u) {
                this.setBlock(o.x, o.y, o.z, this.selectedBlock), this.stats.blocksPlaced++;
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
        let d = e.querySelector(".durability-bar");
        if (a.durability !== void 0 && a.maxDurability) {
          d || (d = document.createElement("div"), d.className = "durability-bar", d.innerHTML = '<div class="durability-fill"></div>', e.appendChild(d));
          const r = d.querySelector(".durability-fill"), o = a.durability / a.maxDurability * 100;
          r.style.width = o + "%", r.style.backgroundColor = o > 50 ? "#4a4" : o > 25 ? "#aa4" : "#a44", d.style.display = "block";
        } else d && (d.style.display = "none");
      } else {
        c.getContext("2d").clearRect(0, 0, c.width, c.height);
        const r = e.querySelector(".durability-bar");
        r && (r.style.display = "none");
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
    const e = this.camera.rotX, i = this.camera.rotY, a = -Math.sin(i) * Math.cos(e), s = -Math.sin(e), c = Math.cos(i) * Math.cos(e), d = 2.5, r = {
      x: this.camera.x + a * 0.5,
      y: this.camera.y + s * 0.5,
      z: this.camera.z + c * 0.5,
      vx: a * d,
      vy: s * d,
      vz: c * d,
      life: 60,
      type: "bullet",
      trail: []
    };
    this.particles.push(r);
    const o = 0.8;
    let f = null, m = 1 / 0;
    for (const u of this.pestBirds) {
      const y = u.x - this.camera.x, b = u.y - this.camera.y, B = u.z - this.camera.z, C = Math.sqrt(y * y + b * b + B * B);
      if (C < 15 && C < m) {
        const L = y / C, z = b / C, F = B / C;
        a * L + s * z + c * F > 0.9 && (f = u, m = C);
      }
    }
    if (f) {
      f.vx = a * o + (Math.random() - 0.5) * 0.2, f.vy = s * o + 0.3 + Math.random() * 0.2, f.vz = c * o + (Math.random() - 0.5) * 0.2, f.state = "knockback", f.stateTimer = 90;
      for (let z = 0; z < 8; z++) {
        const F = 0.15 + Math.random() * 0.2, T = -a * 0.5 + (Math.random() - 0.5) * 1.5, D = Math.random() * 0.8 + 0.2, $ = -c * 0.5 + (Math.random() - 0.5) * 1.5, E = Math.sqrt(T * T + D * D + $ * $);
        this.particles.push({
          x: f.x,
          y: f.y,
          z: f.z,
          vx: T / E * F,
          vy: D / E * F,
          vz: $ / E * F,
          life: 25 + Math.random() * 20,
          type: "ricochet",
          size: 2 + Math.random() * 3
        });
      }
      for (let z = 0; z < 5; z++)
        this.particles.push({
          x: f.x + (Math.random() - 0.5) * 0.3,
          y: f.y + (Math.random() - 0.5) * 0.3,
          z: f.z + (Math.random() - 0.5) * 0.3,
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
      const y = f.x - this.camera.x, b = f.z - this.camera.z, B = Math.sqrt(y * y + b * b);
      B > 0.1 && (this.camera.x -= y / B * u * 0.3 + (Math.random() - 0.5) * u, this.camera.z -= b / B * u * 0.3 + (Math.random() - 0.5) * u);
      const C = Math.random();
      let L = 0;
      C < 0.01 ? L = 20 : C < 0.1 && (L = 5);
      for (let z = 0; z < L; z++) {
        const F = Math.random() * Math.PI * 2, T = 2 + Math.random() * 3;
        this.pestBirds.push({
          x: f.x + Math.cos(F) * T,
          y: f.y + (Math.random() - 0.5) * 2,
          z: f.z + Math.sin(F) * T,
          vx: 0,
          vy: 0,
          vz: 0,
          targetOffsetX: 0,
          targetOffsetY: 0,
          targetOffsetZ: 0,
          state: "circling",
          stateTimer: 10 + Math.random() * 20,
          angle: F,
          circleRadius: T,
          baseCircleRadius: T,
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
      const y = u.x - this.camera.x, b = u.y - this.camera.y, B = u.z - this.camera.z, C = Math.sqrt(y * y + b * b + B * B);
      if (C < 25) {
        const L = y / C, z = b / C, F = B / C;
        if (a * L + s * z + c * F > 0.85) {
          u.radius += 8, u.baseY += 5;
          for (let D = 0; D < 5; D++)
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
          const a = i.x - e.x, s = i.y - e.y, c = i.z - e.z, d = Math.sqrt(a * a + s * s + c * c);
          if (d < 1.5) {
            i.vx = e.vx * 0.5 + a / d * 2.5, i.vy = Math.abs(e.vy) + 0.5, i.vz = e.vz * 0.5 + c / d * 2.5, i.state = "knockback", i.stateTimer = 120, i.anger = Math.min(5, i.anger + 2), e.life = 0;
            for (let o = 0; o < 8; o++)
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
          const s = a.x - e.x, c = a.y - e.y, d = a.z - e.z, r = Math.sqrt(s * s + c * c + d * d);
          if (r < 1.5) {
            a.vx = e.vx * 0.5 + s / r * 3, a.vy = 0.8, a.vz = e.vz * 0.5 + d / r * 3, a.state = "knockback", a.stateTimer = 180, a.anger = Math.max(0, a.anger - 0.5), e.life = 0, this.survivalStats && (this.survivalStats.score += 50, this.updateSurvivalHUD());
            for (let f = 0; f < 6; f++)
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
            const s = a.x - e.x, c = a.y - e.y, d = a.z - e.z;
            Math.sqrt(s * s + c * c + d * d) < 2 && (a.swarmMode = !1, a.swarmTimer = 0, e.life = 0, this.survivalStats && (this.survivalStats.score += 25, this.updateSurvivalHUD()));
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
      const s = this.cherryTrees[Math.floor(Math.random() * this.cherryTrees.length)], c = Math.sqrt((s.x - this.camera.x) ** 2 + (s.z - this.camera.z) ** 2), d = 40;
      if (c < d) {
        const r = 1 - c / d * 0.5;
        if (Math.random() < r) {
          const o = (Math.random() - 0.5) * 10, f = (Math.random() - 0.5) * 10, m = Math.random() < 0.3 ? Math.random() * 8 : 0;
          this.particles.push({
            x: s.x + o,
            y: s.y + Math.random() * 3 + m,
            z: s.z + f,
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
    const d = s / 2, r = c / 2, o = Math.min(s, c) * 0.35;
    if (!a) {
      if (i.save(), i.translate(d, r), e === "apple")
        i.fillStyle = "#dc143c", i.beginPath(), i.arc(0, 0, o * 0.7, 0, Math.PI * 2), i.fill(), i.fillStyle = "rgba(255,255,255,0.3)", i.beginPath(), i.arc(-o * 0.2, -o * 0.2, o * 0.25, 0, Math.PI * 2), i.fill(), i.fillStyle = "#654321", i.fillRect(-1, -o * 0.8, 3, o * 0.3), i.fillStyle = "#228b22", i.beginPath(), i.ellipse(3, -o * 0.7, 4, 2, 0.3, 0, Math.PI * 2), i.fill();
      else if (e === "seeds") {
        i.fillStyle = "#daa520";
        for (let b = 0; b < 5; b++) {
          const B = b / 5 * Math.PI * 2, C = Math.cos(B) * o * 0.4, L = Math.sin(B) * o * 0.3;
          i.beginPath(), i.ellipse(C, L, 3, 5, B, 0, Math.PI * 2), i.fill();
        }
      } else e === "ak47" ? (i.fillStyle = "#333", i.fillRect(-o * 0.6, -o * 0.1, o * 1.2, o * 0.25), i.fillStyle = "#8b4513", i.fillRect(-o * 0.3, o * 0.1, o * 0.4, o * 0.4), i.fillStyle = "#222", i.fillRect(o * 0.1, o * 0.1, o * 0.15, o * 0.35)) : e === "berdger" ? (i.fillStyle = "#daa520", i.beginPath(), i.ellipse(0, -o * 0.3, o * 0.5, o * 0.25, 0, 0, Math.PI * 2), i.fill(), i.fillStyle = "#8b4513", i.fillRect(-o * 0.4, -o * 0.15, o * 0.8, o * 0.2), i.fillStyle = "#228b22", i.fillRect(-o * 0.35, -o * 0.05, o * 0.7, o * 0.1), i.fillStyle = "#daa520", i.beginPath(), i.ellipse(0, o * 0.2, o * 0.55, o * 0.3, 0, 0, Math.PI * 2), i.fill()) : e === "water_bucket" || e === "lava_bucket" ? (i.fillStyle = "#888", i.beginPath(), i.moveTo(-o * 0.4, -o * 0.3), i.lineTo(o * 0.4, -o * 0.3), i.lineTo(o * 0.3, o * 0.5), i.lineTo(-o * 0.3, o * 0.5), i.closePath(), i.fill(), i.fillStyle = e === "water_bucket" ? "#4a90d9" : "#ff6600", i.beginPath(), i.moveTo(-o * 0.3, -o * 0.1), i.lineTo(o * 0.3, -o * 0.1), i.lineTo(o * 0.25, o * 0.4), i.lineTo(-o * 0.25, o * 0.4), i.closePath(), i.fill()) : e === "sakuraPetal" ? (i.fillStyle = "#ffb7c5", i.beginPath(), i.ellipse(0, 0, o * 0.6, o * 0.3, 0.3, 0, Math.PI * 2), i.fill()) : e === "shimenawa" ? (i.strokeStyle = "#daa520", i.lineWidth = 4, i.beginPath(), i.moveTo(-o * 0.5, 0), i.quadraticCurveTo(0, -o * 0.4, o * 0.5, 0), i.stroke()) : e === "omamori" ? (i.fillStyle = "#cc0000", i.fillRect(-o * 0.3, -o * 0.5, o * 0.6, o), i.fillStyle = "#ffd700", i.fillRect(-o * 0.25, -o * 0.35, o * 0.5, o * 0.15)) : e === "ema" ? (i.fillStyle = "#deb887", i.beginPath(), i.moveTo(0, -o * 0.5), i.lineTo(o * 0.4, -o * 0.2), i.lineTo(o * 0.4, o * 0.4), i.lineTo(-o * 0.4, o * 0.4), i.lineTo(-o * 0.4, -o * 0.2), i.closePath(), i.fill()) : e === "incense" ? (i.fillStyle = "#8b4513", i.fillRect(-1, -o * 0.6, 3, o * 1.2), i.fillStyle = "#ff6600", i.beginPath(), i.arc(0.5, -o * 0.6, 3, 0, Math.PI * 2), i.fill()) : (i.fillStyle = "#888", i.fillRect(-o * 0.4, -o * 0.4, o * 0.8, o * 0.8), i.fillStyle = "#444", i.font = "8px monospace", i.textAlign = "center", i.fillText("?", 0, 3));
      i.restore();
      return;
    }
    const f = Math.min(s, c) * 0.25;
    let m = a.top, u = a.side;
    typeof m == "string" && m.includes("rgba") && (m = m.replace(/[\d.]+\)$/, "1)"), u = u.replace(/[\d.]+\)$/, "1)")), i.fillStyle = m, i.beginPath(), i.moveTo(d, r - f), i.lineTo(d + f, r - f / 2), i.lineTo(d, r), i.lineTo(d - f, r - f / 2), i.closePath(), i.fill(), i.fillStyle = u, i.beginPath(), i.moveTo(d - f, r - f / 2), i.lineTo(d, r), i.lineTo(d, r + f), i.lineTo(d - f, r + f / 2), i.closePath(), i.fill();
    let y;
    try {
      y = this.darkenColor(u.replace(/rgba?\([^)]+\)/, "#888888"), 0.7);
    } catch {
      y = this.darkenColor(u, 0.7);
    }
    i.fillStyle = y, i.beginPath(), i.moveTo(d, r), i.lineTo(d + f, r - f / 2), i.lineTo(d + f, r + f / 2), i.lineTo(d, r + f), i.closePath(), i.fill(), i.strokeStyle = "rgba(0,0,0,0.3)", i.lineWidth = 0.5, i.beginPath(), i.moveTo(d, r - o), i.lineTo(d + o, r - o / 2), i.lineTo(d + o, r + o / 2), i.lineTo(d, r + o), i.lineTo(d - o, r + o / 2), i.lineTo(d - o, r - o / 2), i.closePath(), i.stroke();
  },
  // Draw 3D item for dropped items in the world
  drawDroppedItem3D(t, e, i, a, s, c) {
    const d = this.blockColors[s], r = (c || 0) * 0.5;
    if (t.save(), t.translate(e, i), !d) {
      if (s === "apple")
        t.fillStyle = "#dc143c", t.beginPath(), t.arc(0, 0, a * 0.8, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(255,255,255,0.3)", t.beginPath(), t.arc(-a * 0.2, -a * 0.2, a * 0.3, 0, Math.PI * 2), t.fill(), t.fillStyle = "#654321", t.fillRect(-1, -a * 0.9, 2, a * 0.3), t.fillStyle = "#228b22", t.beginPath(), t.ellipse(2, -a * 0.8, 3, 2, 0.3, 0, Math.PI * 2), t.fill();
      else if (s === "seeds") {
        t.fillStyle = "#daa520";
        for (let f = 0; f < 5; f++) {
          const m = f / 5 * Math.PI * 2 + r, u = Math.cos(m) * a * 0.4, y = Math.sin(m) * a * 0.3;
          t.beginPath(), t.ellipse(u, y, a * 0.2, a * 0.1, m, 0, Math.PI * 2), t.fill();
        }
      } else s === "ak47" ? (t.fillStyle = "#333", t.fillRect(-a * 0.8, -a * 0.15, a * 1.6, a * 0.3), t.fillRect(-a * 0.3, -a * 0.15, a * 0.15, a * 0.5), t.fillRect(a * 0.3, -a * 0.4, a * 0.5, a * 0.25)) : s === "berdger" ? (t.fillStyle = "#D2691E", t.beginPath(), t.ellipse(0, -a * 0.2, a * 0.7, a * 0.35, 0, Math.PI, 0), t.fill(), t.fillStyle = "#654321", t.fillRect(-a * 0.6, -a * 0.1, a * 1.2, a * 0.25), t.fillStyle = "#228B22", t.fillRect(-a * 0.55, a * 0.1, a * 1.1, a * 0.1), t.fillStyle = "#DEB887", t.beginPath(), t.ellipse(0, a * 0.25, a * 0.65, a * 0.3, 0, 0, Math.PI), t.fill()) : s === "water_bucket" || s === "lava_bucket" ? (t.fillStyle = "#888", t.beginPath(), t.moveTo(-a * 0.5, -a * 0.5), t.lineTo(a * 0.5, -a * 0.5), t.lineTo(a * 0.4, a * 0.5), t.lineTo(-a * 0.4, a * 0.5), t.closePath(), t.fill(), t.fillStyle = s === "water_bucket" ? "#4a90d9" : "#ff6600", t.fillRect(-a * 0.35, -a * 0.3, a * 0.7, a * 0.6), t.strokeStyle = "#666", t.lineWidth = 2, t.beginPath(), t.arc(0, -a * 0.6, a * 0.4, Math.PI * 0.2, Math.PI * 0.8), t.stroke()) : s === "sakuraPetal" ? (t.fillStyle = "#ffb7c5", t.beginPath(), t.ellipse(0, 0, a * 0.6, a * 0.3, r, 0, Math.PI * 2), t.fill()) : s === "shimenawa" ? (t.strokeStyle = "#daa520", t.lineWidth = a * 0.2, t.beginPath(), t.moveTo(-a * 0.6, 0), t.bezierCurveTo(-a * 0.3, -a * 0.4, a * 0.3, a * 0.4, a * 0.6, 0), t.stroke()) : s === "omamori" ? (t.fillStyle = "#ff4444", t.fillRect(-a * 0.3, -a * 0.5, a * 0.6, a * 0.8), t.fillStyle = "#gold", t.fillRect(-a * 0.2, -a * 0.4, a * 0.4, a * 0.15)) : s === "ema" ? (t.fillStyle = "#deb887", t.beginPath(), t.moveTo(0, -a * 0.6), t.lineTo(a * 0.5, -a * 0.2), t.lineTo(a * 0.5, a * 0.5), t.lineTo(-a * 0.5, a * 0.5), t.lineTo(-a * 0.5, -a * 0.2), t.closePath(), t.fill()) : s === "incense" ? (t.fillStyle = "#8b4513", t.fillRect(-1, -a * 0.6, 2, a * 1.2), t.fillStyle = "#ff6600", t.beginPath(), t.arc(0, -a * 0.6, 3, 0, Math.PI * 2), t.fill()) : (t.fillStyle = "#888", t.fillRect(-a * 0.5, -a * 0.5, a, a));
      t.restore();
      return;
    }
    const o = a * 0.8;
    t.fillStyle = d.top, t.beginPath(), t.moveTo(0, -o), t.lineTo(o, -o / 2), t.lineTo(0, 0), t.lineTo(-o, -o / 2), t.closePath(), t.fill(), t.fillStyle = d.side, t.beginPath(), t.moveTo(-o, -o / 2), t.lineTo(0, 0), t.lineTo(0, o), t.lineTo(-o, o / 2), t.closePath(), t.fill(), t.fillStyle = this.darkenColor(d.side, 0.7), t.beginPath(), t.moveTo(0, 0), t.lineTo(o, -o / 2), t.lineTo(o, o / 2), t.lineTo(0, o), t.closePath(), t.fill(), t.strokeStyle = "rgba(0,0,0,0.4)", t.lineWidth = 1, t.beginPath(), t.moveTo(0, -o), t.lineTo(o, -o / 2), t.lineTo(o, o / 2), t.lineTo(0, o), t.lineTo(-o, o / 2), t.lineTo(-o, -o / 2), t.closePath(), t.stroke(), t.restore();
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
      const e = this.camera.rotX, i = this.camera.rotY, a = Math.cos(e), s = Math.sin(e), c = -Math.sin(i) * a, d = -s, r = Math.cos(i) * a;
      return this.particles.push({
        x: this.camera.x + c * 0.5,
        y: this.camera.y + d * 0.5,
        z: this.camera.z + r * 0.5,
        vx: c * 0.8,
        vy: d * 0.8,
        vz: r * 0.8,
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
      const e = this.camera.rotX, i = this.camera.rotY, a = Math.cos(e), s = Math.sin(e), c = -Math.sin(i) * a, d = -s, r = Math.cos(i) * a;
      return this.particles.push({
        x: this.camera.x + c * 0.5,
        y: this.camera.y + d * 0.5,
        z: this.camera.z + r * 0.5,
        vx: c * 0.6,
        vy: d * 0.6 + 0.1,
        // Slight arc
        vz: r * 0.6,
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
    }, d = s[a];
    if (!d || a.includes("Filled")) return;
    const r = this.inventory.hotbar[this.selectedSlot];
    if (r && r.id === d && r.count > 0) {
      r.count--, r.count <= 0 && (this.inventory.hotbar[this.selectedSlot] = null), this.updateHotbarDisplay(), this.setBlock(t, e, i, c[a]), this.socketsFilled || (this.socketsFilled = {}), this.socketsFilled[a] = !0;
      for (let f = 0; f < 20; f++)
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
        (f) => this.socketsFilled && this.socketsFilled[f]
      ) && !this.ritualComplete) {
        if (this.ritualComplete = !0, this.ritualBlessingActive = !0, this.ritualBlessingTimer = 60 * 60 * 10, this.triggerRitualReward(), this.pestBirds)
          for (const f of this.pestBirds)
            f.anger = 0, f.state = "fleeing", f.stateTimer = 600;
        this.survivalStats && (this.survivalStats.score += 5e3, this.survivalStats.currentObjective = { text: "Blessing active - birds flee!", type: "complete" }, this.updateSurvivalHUD());
        for (let f = 0; f < 100; f++)
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
        const d = c.type || c.id, r = c.count || 1;
        d && (this.addToInventory(d, r) || this.dropItem(t + 0.5, e + 1.5, i + 0.5, d, r));
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
          const f = parseFloat(a[0]), m = parseFloat(a[1]), u = parseFloat(a[2]);
          !isNaN(f) && !isNaN(m) && !isNaN(u) ? (this.camera.x = f, this.camera.y = m, this.camera.z = u, this.velocity = { x: 0, y: 0, z: 0 }, this.debugLog(`Teleported to ${f.toFixed(1)}, ${m.toFixed(1)}, ${u.toFixed(1)}`, "success")) : this.debugLog("Invalid coordinates", "error");
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
          const f = a[0], m = a.length >= 2 ? parseInt(a[1]) : 1;
          this.blockColors[f] || this.itemTypes[f] ? (this.addToInventory(f, m), this.debugLog(`Given ${m}x ${f}`, "success")) : (this.debugLog(`Unknown item: ${f}`, "error"), this.debugLog("Items: " + Object.keys(this.itemTypes).slice(0, 10).join(", ") + "...", "info"));
        } else
          this.debugLog("Usage: give <item> [count]", "error");
        break;
      case "spawn":
        const s = a[0], c = a.length >= 2 ? parseInt(a[1]) : 1, d = ["bird", "pest", "fish", "cat", "creeper", "bluebird"];
        if (s === "bird" || s === "pest") {
          for (let f = 0; f < c; f++) this.spawnPestBird();
          this.debugLog(`Spawned ${c} pest bird(s)`, "success");
        } else if (s === "fish") {
          for (let f = 0; f < c; f++) this.spawnFish();
          this.debugLog(`Spawned ${c} fish`, "success");
        } else if (s === "cat") {
          for (let f = 0; f < c; f++) this.spawnCat();
          this.debugLog(`Spawned ${c} cat(s)`, "success");
        } else if (s === "creeper") {
          for (let f = 0; f < c; f++) this.spawnCreeper();
          this.debugLog(`Spawned ${c} creeper(s)`, "success");
        } else if (s === "bluebird") {
          for (let f = 0; f < c; f++) this.spawnBlueBird();
          this.debugLog(`Spawned ${c} blue bird(s)`, "success");
        } else
          this.debugLog("Usage: spawn <mob> [count]", "error"), this.debugLog("Mobs: " + d.join(", "), "info");
        break;
      case "kill":
        let r = 0;
        r += this.pestBirds ? this.pestBirds.length : 0, r += this.blueBirds ? this.blueBirds.length : 0, r += this.creepers ? this.creepers.length : 0, this.pestBirds = [], this.blueBirds = [], this.creepers = [], this.debugLog(`Killed ${r} mobs`, "success");
        break;
      case "time":
        if (a.length >= 1) {
          const f = parseInt(a[0]);
          !isNaN(f) && this.birdEvent && (this.birdEvent.timer = f, this.debugLog(`Bird event timer set to ${f}ms`, "success"));
        } else
          this.debugLog("Usage: time <ms>", "error");
        break;
      case "clear":
        const o = document.getElementById("debugOutput");
        o && (o.innerHTML = "");
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
      const d = s - 1;
      if (!(d <= 0) && c && !this.fluidBlocks.includes(c)) {
        const r = [
          { x: 1, z: 0 },
          { x: -1, z: 0 },
          { x: 0, z: 1 },
          { x: 0, z: -1 }
        ];
        for (let o = r.length - 1; o > 0; o--) {
          const f = Math.floor(Math.random() * (o + 1));
          [r[o], r[f]] = [r[f], r[o]];
        }
        for (const o of r) {
          const f = i.x + o.x, m = i.z + o.z, u = this.getBlock(f, i.y, m), y = this.getFluidLevel(f, i.y, m);
          if (i.type === "lava" && u === "water") {
            this.setBlock(f, i.y, m, "stone"), this.setFluidLevel(f, i.y, m, 0);
            continue;
          } else if (i.type === "water" && u === "lava") {
            this.setBlock(f, i.y, m, "stone"), this.setFluidLevel(f, i.y, m, 0);
            continue;
          }
          u ? u === i.type && y < d && (this.setFluidLevel(f, i.y, m, d), this.fluidUpdates.push({
            x: f,
            y: i.y,
            z: m,
            type: i.type,
            level: d
          })) : (this.setBlock(f, i.y, m, i.type), this.setFluidLevel(f, i.y, m, d), this.fluidUpdates.push({
            x: f,
            y: i.y,
            z: m,
            type: i.type,
            level: d
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
      const c = this.getItemEmoji(a), d = a && a.count > 0, r = this.inventoryHeldItem && this.inventoryHeldItem.source === "hotbar" && this.inventoryHeldItem.index === s, o = d ? e(a) : "";
      i += `<div class="inv-slot ${s === this.selectedSlot ? "selected" : ""} ${d ? "has-item" : ""} ${r ? "held" : ""}" 
                        data-source="hotbar" data-index="${s}" ${o ? `data-tooltip="${o}"` : ""}
                        draggable="${d}">${c}<span class="count">${a ? a.count : ""}</span></div>`;
    }), i += "</div></div>", i += '<div class="inv-main">', i += "<h3>Storage</h3>", i += '<div class="inv-slots" id="storageSlots">';
    for (let a = 0; a < 27; a++) {
      const s = this.inventory.main[a];
      s && s.count > 0;
      const c = this.inventoryHeldItem && this.inventoryHeldItem.source === "main" && this.inventoryHeldItem.index === a;
      if (s) {
        const d = this.getItemEmoji(s), r = e(s);
        i += `<div class="inv-slot has-item ${c ? "held" : ""}" data-source="main" data-index="${a}" ${r ? `data-tooltip="${r}"` : ""} draggable="true">${d}<span class="count">${s.count}</span></div>`;
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
      const { scrollTop: s, scrollHeight: c, clientHeight: d } = i, r = s === 0, o = s + d >= c;
      (r && a.deltaY < 0 || o && a.deltaY > 0) && a.preventDefault();
    }, { passive: !1 }), t.addEventListener("dragover", (a) => {
      a.preventDefault(), a.stopPropagation();
    }), t.addEventListener("drop", (a) => {
      a.preventDefault(), a.stopPropagation();
    }), e.forEach((a) => {
      a.addEventListener("click", (s) => {
        s.preventDefault(), s.stopPropagation();
        const c = a.dataset.source, d = parseInt(a.dataset.index), o = (c === "hotbar" ? this.inventory.hotbar : this.inventory.main)[d];
        this.inventoryHeldItem ? (this.swapInventorySlots(
          this.inventoryHeldItem.source,
          this.inventoryHeldItem.index,
          c,
          d
        ), this.inventoryHeldItem = null, this.renderInventory(), this.updateHotbar(), this.updateHotbarDisplay()) : o && o.count > 0 && (this.inventoryHeldItem = { source: c, index: d }, this.renderInventory());
      }), a.addEventListener("dragstart", (s) => {
        s.stopPropagation();
        const c = a.dataset.source, d = parseInt(a.dataset.index);
        this.draggedItem = { source: c, index: d }, a.classList.add("dragging"), s.dataTransfer.effectAllowed = "move", s.dataTransfer.setDragImage(a, 20, 20);
      }), a.addEventListener("dragend", (s) => {
        s.preventDefault(), s.stopPropagation(), a.classList.remove("dragging"), this.draggedItem = null;
      }), a.addEventListener("dragover", (s) => {
        s.preventDefault(), s.stopPropagation(), s.dataTransfer.dropEffect = "move", a.classList.add("drag-over");
      }), a.addEventListener("dragleave", (s) => {
        s.preventDefault(), s.stopPropagation(), a.classList.remove("drag-over");
      }), a.addEventListener("drop", (s) => {
        if (s.preventDefault(), s.stopPropagation(), a.classList.remove("drag-over"), !this.draggedItem) return;
        const c = a.dataset.source, d = parseInt(a.dataset.index), r = document.querySelector(".inventory-container"), o = r ? r.scrollTop : 0;
        this.swapInventorySlots(
          this.draggedItem.source,
          this.draggedItem.index,
          c,
          d
        ), this.draggedItem = null, this.renderInventory(), this.updateHotbar(), this.updateHotbarDisplay();
        const f = document.querySelector(".inventory-container");
        f && (f.scrollTop = o);
      });
    });
  },
  swapInventorySlots(t, e, i, a) {
    const s = t === "hotbar" ? this.inventory.hotbar : this.inventory.main, c = i === "hotbar" ? this.inventory.hotbar : this.inventory.main, d = s[e], r = c[a];
    if (s[e] = r, c[a] = d, t === "hotbar" || i === "hotbar") {
      const o = this.inventory.hotbar[this.selectedSlot];
      o ? o.type === "block" ? (this.selectedBlock = o.id, this.selectedItem = null) : o.type === "weapon" && (this.selectedItem = o.id, this.selectedBlock = null) : (this.selectedBlock = null, this.selectedItem = null);
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
    const t = this.camera.rotX, e = this.camera.rotY, i = Math.cos(t), a = Math.sin(t), s = Math.cos(e), d = -Math.sin(e) * i, r = -a, o = s * i, f = Math.sqrt(d * d + r * r + o * o), m = d / f, u = r / f, y = o / f, b = 0.1;
    let B = this.camera.x + m * b, C = this.camera.y + u * b, L = this.camera.z + y * b, z = Math.floor(B), F = Math.floor(C), T = Math.floor(L);
    const D = m >= 0 ? 1 : -1, $ = u >= 0 ? 1 : -1, E = y >= 0 ? 1 : -1, G = Math.abs(1 / m), K = Math.abs(1 / u), _ = Math.abs(1 / y);
    let W, Y, R;
    m > 0 ? W = (z + 1 - B) / m : m < 0 ? W = (z - B) / m : W = 1 / 0, u > 0 ? Y = (F + 1 - C) / u : u < 0 ? Y = (F - C) / u : Y = 1 / 0, y > 0 ? R = (T + 1 - L) / y : y < 0 ? R = (T - L) / y : R = 1 / 0;
    let Z = null;
    const j = 6;
    let n = 0, h = null, l = !1, p = !1;
    for (let g = 0; g < 100; g++) {
      const S = this.getBlock(z, F, T);
      if (S)
        if (S === "water" || S === "lava")
          S === "water" && (l = !0), S === "lava" && (p = !0);
        else {
          let v = null;
          const M = h || Z;
          return M && (v = {
            x: z + M.x,
            y: F + M.y,
            z: T + M.z
          }), {
            hit: { x: z, y: F, z: T },
            place: v,
            block: S,
            throughWater: l,
            throughLava: p
          };
        }
      else
        h = Z;
      if (W < Y && W < R) {
        if (n = W, n > j) break;
        z += D, W += G, Z = { x: -D, y: 0, z: 0 };
      } else if (Y < R) {
        if (n = Y, n > j) break;
        F += $, Y += K, Z = { x: 0, y: -$, z: 0 };
      } else {
        if (n = R, n > j) break;
        T += E, R += _, Z = { x: 0, y: 0, z: -E };
      }
    }
    return null;
  },
  update() {
    if (!this.isActive || this.isPaused) return;
    this.shootCooldown > 0 && this.shootCooldown--, this.muzzleFlash > 0 && this.muzzleFlash--, this.ritualFlightTimer > 0 && (this.ritualFlightTimer--, this.ritualFlightTimer <= 0 && (this.ritualFlight = !1));
    const t = this.debugMoveSpeed || 0.12, i = this.debugNoclip || this.debugFly || this.ritualFlight ? t * 2 : t, a = Math.sin(this.camera.rotY), s = Math.cos(this.camera.rotY);
    if (this.debugNoclip || this.debugFly) {
      let k = 0, x = 0, I = 0;
      this.keys.w && (k -= a * Math.cos(this.camera.rotX) * i, x -= Math.sin(this.camera.rotX) * i, I += s * Math.cos(this.camera.rotX) * i), this.keys.s && (k += a * Math.cos(this.camera.rotX) * i, x += Math.sin(this.camera.rotX) * i, I -= s * Math.cos(this.camera.rotX) * i), this.keys.a && (k -= s * i, I -= a * i), this.keys.d && (k += s * i, I += a * i), this.keys[" "] && (x += i), this.keys.shift && (x -= i), this.debugNoclip ? (this.camera.x += k, this.camera.y += x, this.camera.z += I) : (this.camera.x += k, this.camera.y += x, this.camera.z += I), this.velocity = { x: 0, y: 0, z: 0 };
      return;
    }
    if (this.ritualFlight) {
      let k = 0, x = 0, I = 0;
      this.keys.w && (k -= a * i, I += s * i), this.keys.s && (k += a * i, I -= s * i), this.keys.a && (k -= s * i, I -= a * i), this.keys.d && (k += s * i, I += a * i), this.keys[" "] && (x += i), this.keys.shift && (x -= i);
      const P = this.camera.x + k, H = this.camera.y + x, q = this.camera.z + I, N = Math.floor(H - this.playerEyeHeight), O = Math.floor(H), X = Math.floor(P), U = Math.floor(q);
      let A = !0;
      for (let V = N; V <= O; V++) {
        const st = this.getBlock(X, V, U);
        if (st && !this.fluidBlocks.includes(st)) {
          A = !1;
          break;
        }
      }
      A && (this.camera.x = P, this.camera.y = H, this.camera.z = q), this.velocity = { x: 0, y: 0, z: 0 };
      return;
    }
    const c = this.camera.y - this.playerEyeHeight, d = c + this.playerHeight, r = Math.floor(this.camera.x), o = Math.floor(this.camera.z), f = this.getBlock(r, Math.floor(c), o), m = this.getBlock(r, Math.floor(c + 0.9), o), u = this.getBlock(r, Math.floor(d - 0.1), o), y = f === "water", b = f === "lava", B = m === "water", C = m === "lava", L = u === "water", z = u === "lava", F = y || B, T = b || C, D = F || T, $ = L || z;
    this.inWater = F || L, this.inLava = T || z, this.swimming = D, this.headSubmergedWater = L, this.headSubmergedLava = z;
    let E = 1;
    F && (E = 0.65), T && (E = 0.35);
    let G = 0, K = 0;
    const _ = t;
    this.keys.w && (G -= a * _ * E, K += s * _ * E), this.keys.s && (G += a * _ * E, K -= s * _ * E), this.keys.a && (G -= s * _ * E, K -= a * _ * E), this.keys.d && (G += s * _ * E, K += a * _ * E);
    const W = this.camera.x, Y = this.camera.z, R = 0.25, Z = 1.8;
    if (this.collidesAt(this.camera.x, this.camera.y, this.camera.z, R, Z)) {
      let k = !1;
      for (let x = 0.1; x <= 1.5 && !k; x += 0.1) {
        const I = [0, 45, 90, 135, 180, 225, 270, 315];
        for (const P of I) {
          const H = P * Math.PI / 180, q = this.camera.x + Math.cos(H) * x, N = this.camera.z + Math.sin(H) * x;
          if (!this.collidesAt(q, this.camera.y, N, R, Z)) {
            this.camera.x = q, this.camera.z = N, k = !0;
            break;
          }
        }
        !k && !this.collidesAt(this.camera.x, this.camera.y + x, this.camera.z, R, Z) && (this.camera.y += x, k = !0);
      }
    }
    let j = this.camera.x, n = this.camera.z;
    const h = 8, l = G / h, p = K / h;
    for (let k = 0; k < h; k++) {
      const x = j + l;
      if (!this.collidesAt(x, this.camera.y, n, R, Z))
        j = x;
      else {
        const P = l * 0.5;
        this.collidesAt(j + P, this.camera.y, n, R, Z) || (j += P);
      }
      const I = n + p;
      if (!this.collidesAt(j, this.camera.y, I, R, Z))
        n = I;
      else {
        const P = p * 0.5;
        this.collidesAt(j, this.camera.y, n + P, R, Z) || (n += P);
      }
    }
    this.collidesAt(j, this.camera.y, n, R, Z) && (j = this.camera.x, n = this.camera.z), this.camera.x = j, this.camera.z = n;
    const g = this.camera.x - W, S = this.camera.z - Y;
    if (this.stats.distance += Math.sqrt(g * g + S * S), D) {
      const k = T ? 8e-3 : 0.012, x = T ? 0.92 : 0.95;
      if (this.velocity.y += k, this.keys[" "]) {
        const P = T ? 0.04 : 0.06;
        this.velocity.y += P;
      }
      if (this.keys.shift) {
        const P = T ? 0.03 : 0.04;
        this.velocity.y -= P;
      }
      const I = T ? 0.12 : 0.15;
      this.velocity.y = Math.max(-I, Math.min(I, this.velocity.y)), this.velocity.y *= x, !$ && this.keys[" "] && this.velocity.y < 0.15 && (this.velocity.y = 0.2);
    } else
      this.velocity.y += this.gravity;
    const v = this.camera.y + this.velocity.y, M = this.getGroundHeightBelow(this.camera.x, this.camera.z, this.camera.y) + this.playerEyeHeight + 0.5;
    v < M ? (this.camera.y = M, this.velocity.y = 0, this.isJumping = !1, this.keys[" "] && !D && (this.velocity.y = 0.28, this.isJumping = !0, this.stats.jumps++)) : this.camera.y = v;
    const w = this.getCeilingAbove(this.camera.x, this.camera.z, this.camera.y);
    w !== null && this.camera.y > w - 0.5 && (this.camera.y = w - 0.5, this.velocity.y = 0), this.worldBounds && (this.camera.x < this.worldBounds.minX + 0.5 && (this.camera.x = this.worldBounds.minX + 0.5, this.velocity.x = Math.abs(this.velocity.x || 0) * 0.3), this.camera.x > this.worldBounds.maxX - 0.5 && (this.camera.x = this.worldBounds.maxX - 0.5, this.velocity.x = -Math.abs(this.velocity.x || 0) * 0.3), this.camera.z < this.worldBounds.minZ + 0.5 && (this.camera.z = this.worldBounds.minZ + 0.5, this.velocity.z = Math.abs(this.velocity.z || 0) * 0.3), this.camera.z > this.worldBounds.maxZ - 0.5 && (this.camera.z = this.worldBounds.maxZ - 0.5, this.velocity.z = -Math.abs(this.velocity.z || 0) * 0.3), this.camera.y < this.worldBounds.minY + this.playerEyeHeight && (this.camera.y = this.worldBounds.minY + this.playerEyeHeight, this.velocity.y = 0.15)), this.settings.filter === "trippy" && this.applyFilters();
  },
  // Check if player would collide with blocks at position
  collidesAt(t, e, i, a, s) {
    const c = e - this.playerEyeHeight, d = [
      { x: t - a, z: i - a },
      { x: t + a, z: i - a },
      { x: t - a, z: i + a },
      { x: t + a, z: i + a },
      { x: t, z: i }
    ];
    for (const r of d) {
      const o = Math.floor(r.x), f = Math.floor(r.z);
      for (let m = Math.floor(c); m < Math.floor(c + s); m++) {
        const u = this.getBlock(o, m, f);
        if (u && !this.fluidBlocks.includes(u))
          return !0;
      }
    }
    return !1;
  },
  // Get ground height directly below player (not teleporting to trees)
  getGroundHeightBelow(t, e, i) {
    const a = Math.floor(t), s = Math.floor(e), c = Math.floor(i - this.playerEyeHeight);
    for (let d = c; d >= 0; d--) {
      const r = this.getBlock(a, d, s);
      if (r && !this.fluidBlocks.includes(r))
        return d + 1;
    }
    return 0;
  },
  // Get ceiling above player
  getCeilingAbove(t, e, i) {
    const a = Math.floor(t), s = Math.floor(e), c = Math.floor(i);
    for (let d = c; d <= c + 3; d++) {
      const r = this.getBlock(a, d, s);
      if (r && !this.fluidBlocks.includes(r))
        return d;
    }
    return null;
  },
  render() {
    if (!this.isActive) return;
    const t = this.ctx, e = this.canvas.width, i = this.canvas.height, a = this.camera.y + this.getEyeHeight();
    if (!this.cachedSky || this.cachedSky.w !== e || this.cachedSky.h !== i || this.cachedSky.lighting !== this.settings.lighting) {
      const n = t.createLinearGradient(0, 0, 0, i);
      this.settings.lighting ? (n.addColorStop(0, "#1a0a1a"), n.addColorStop(0.5, "#2d1f3d"), n.addColorStop(1, "#ffb7c5")) : (n.addColorStop(0, "#111"), n.addColorStop(1, "#333")), this.cachedSky = { grad: n, w: e, h: i, lighting: this.settings.lighting };
    }
    t.fillStyle = this.cachedSky.grad, t.fillRect(0, 0, e, i);
    const s = this.camera.x, c = a, d = this.camera.z, r = Math.cos(-this.camera.rotY), o = Math.sin(-this.camera.rotY), f = Math.cos(-this.camera.rotX), m = Math.sin(-this.camera.rotX), u = e / 2, y = i / 2, b = 400, B = this.settings.renderDistance, C = B * B, L = (n, h, l) => {
      const p = n - s, g = h - c, S = l - d, v = p * r - S * o, M = p * o + S * r, w = g * f - M * m, k = g * m + M * f;
      return k <= 0.1 ? null : { x: u + v / k * b, y: y - w / k * b, z: k };
    }, z = [], F = -Math.sin(this.camera.rotY), T = Math.cos(this.camera.rotY), D = Object.keys(this.world);
    for (let n = 0; n < D.length; n++) {
      const h = D[n], [l, p, g] = h.split(",").map(Number), S = l + 0.5 - s, v = p + 0.5 - c, M = g + 0.5 - d, w = S * S + v * v + M * M;
      w > C || S * F + M * T < -3 && w > 16 || z.push({ x: l, y: p, z: g, dist: w, type: this.world[h] });
    }
    z.sort((n, h) => h.dist - n.dist);
    const $ = (n, h, l) => this.world[`${n},${h},${l}`], E = (n) => {
      if (!n || this.fluidBlocks.includes(n)) return !0;
      const h = this.blockColors[n];
      return !!(h && h.transparent);
    }, G = (n, h) => h ? n === h : !1, K = (n, h, l) => this.fluidLevels[`${n},${h},${l}`] || 8, _ = Date.now() * 2e-3, W = [], Y = [];
    for (let n = 0; n < z.length; n++) {
      const h = z[n], l = this.blockColors[h.type];
      l && l.transparent ? Y.push(h) : W.push(h);
    }
    const R = (n, h, l) => {
      const p = [
        [n + 0.5, h + 0.5, l + 0.5],
        // center
        [n + 0.1, h + 0.1, l + 0.1],
        // corners with small inset
        [n + 0.9, h + 0.1, l + 0.1],
        [n + 0.1, h + 0.9, l + 0.1],
        [n + 0.9, h + 0.9, l + 0.1],
        [n + 0.1, h + 0.1, l + 0.9],
        [n + 0.9, h + 0.1, l + 0.9],
        [n + 0.1, h + 0.9, l + 0.9],
        [n + 0.9, h + 0.9, l + 0.9]
      ];
      for (const [g, S, v] of p) {
        const M = g - s, w = S - c, k = v - d, x = Math.sqrt(M * M + w * w + k * k);
        let I = !1;
        const P = Math.min(8, Math.ceil(x / 2));
        for (let H = 1; H < P; H++) {
          const q = H / P, N = Math.floor(s + M * q), O = Math.floor(c + w * q), X = Math.floor(d + k * q);
          if (N === n && O === h && X === l) continue;
          const U = $(N, O, X);
          if (U && !this.fluidBlocks.includes(U)) {
            const A = this.blockColors[U];
            if (!A || !A.transparent) {
              I = !0;
              break;
            }
          }
        }
        if (!I) return !1;
      }
      return !0;
    }, Z = Y.filter((n) => !R(n.x, n.y, n.z));
    Z.sort((n, h) => h.dist - n.dist), W.sort((n, h) => h.dist - n.dist);
    const j = [...W, ...Z];
    for (let n = 0; n < j.length; n++) {
      const h = j[n], { x: l, y: p, z: g, type: S } = h, v = this.blockColors[S];
      if (!v) continue;
      const M = this.fluidBlocks.includes(S), w = M ? K(l, p, g) : 8, k = p + w / 8, x = $(l, p + 1, g), I = $(l, p - 1, g), P = $(l, p, g + 1), H = $(l, p, g - 1), q = $(l - 1, p, g), N = $(l + 1, p, g);
      let O, X, U, A, V, st;
      if (M) {
        O = !x || x !== S, X = !I || !this.fluidBlocks.includes(I);
        const J = w, tt = P === S ? K(l, p, g + 1) : 0, et = H === S ? K(l, p, g - 1) : 0, ht = q === S ? K(l - 1, p, g) : 0, nt = N === S ? K(l + 1, p, g) : 0;
        U = !P || P !== S || tt < J, A = !H || H !== S || et < J, V = !q || q !== S || ht < J, st = !N || N !== S || nt < J;
      } else
        this.blockColors[S] && this.blockColors[S].transparent ? (O = !G(S, x), X = !G(S, I), U = !G(S, P), A = !G(S, H), V = !G(S, q), st = !G(S, N)) : (O = E(x), X = E(I), U = E(P), A = E(H), V = E(q), st = E(N));
      if (!O && !X && !U && !A && !V && !st) continue;
      const it = [];
      U && it.push({ v: [[l, p, g + 1], [l + 1, p, g + 1], [l + 1, k, g + 1], [l, k, g + 1]], color: v.side, dark: 1, isTop: !1 }), A && it.push({ v: [[l + 1, p, g], [l, p, g], [l, k, g], [l + 1, k, g]], color: v.side, dark: 0.7, isTop: !1 }), O && it.push({ v: [[l, k, g], [l + 1, k, g], [l + 1, k, g + 1], [l, k, g + 1]], color: v.top, dark: 1, isTop: !0 }), X && it.push({ v: [[l, p, g + 1], [l + 1, p, g + 1], [l + 1, p, g], [l, p, g]], color: v.bottom, dark: 0.7, isTop: !1 }), V && it.push({ v: [[l, p, g], [l, p, g + 1], [l, k, g + 1], [l, k, g]], color: v.side, dark: 0.85, isTop: !1 }), st && it.push({ v: [[l + 1, p, g + 1], [l + 1, p, g], [l + 1, k, g], [l + 1, k, g + 1]], color: v.side, dark: 0.85, isTop: !1 });
      for (let J = 0; J < it.length; J++) {
        const tt = it[J], et = [];
        let ht = !0;
        for (let Q = 0; Q < 4; Q++) {
          const at = L(tt.v[Q][0], tt.v[Q][1], tt.v[Q][2]);
          if (!at) {
            ht = !1;
            break;
          }
          et.push(at);
        }
        if (!ht || et.length !== 4) continue;
        let nt = tt.color;
        if (this.settings.shadows && tt.dark < 1 && (nt = this.darkenColor(tt.color, tt.dark)), M && v.animated) {
          if (S === "water") {
            const Q = _, at = Math.sin(Q + l * 0.7 + g * 0.5) * 0.4, mt = Math.sin(Q * 0.8 - l * 0.3 + g * 0.7) * 0.3, pt = Math.sin(Q * 1.3 + l * 0.5 - g * 0.3) * 0.2, dt = (at + mt + pt) / 3 + 0.5, gt = l + 0.5 - s, ft = p + 0.5 - c, yt = g + 0.5 - d, ct = Math.sqrt(gt * gt + ft * ft + yt * yt), Ct = Math.abs(ft / (ct || 1)), Lt = 0.02, vt = Lt + (1 - Lt) * Math.pow(1 - Ct, 5);
            let ot = 0;
            const Et = this.camera.x - (l + 0.5), Ft = this.camera.z - (g + 0.5), Dt = Math.sqrt(Et * Et + Ft * Ft);
            Dt < 5 && this.camera.y > p + 1 && (ot = (1 - Dt / 5) * vt * 0.3);
            const $t = [
              { r: 255, g: 183, b: 197 },
              // Sunset pink
              { r: 255, g: 218, b: 185 },
              // Peach
              { r: 135, g: 206, b: 235 }
              // Sky blue
            ], Rt = Math.min(2, Math.floor((1 - Ct) * 3)), bt = $t[Rt], kt = Math.min(1, ct / 20), Ht = 30 + kt * 15, qt = 80 + kt * 20, At = 160 - kt * 30, Mt = { r: 100, g: 60, b: 40 }, rt = Math.min(0.7, vt * 1.5);
            let St = Math.floor(Ht * (1 - rt) + bt.r * rt), wt = Math.floor(qt * (1 - rt) + bt.g * rt), Bt = Math.floor(At * (1 - rt) + bt.b * rt);
            ot > 0 && (St = Math.floor(St * (1 - ot) + Mt.r * ot), wt = Math.floor(wt * (1 - ot) + Mt.g * ot), Bt = Math.floor(Bt * (1 - ot) + Mt.b * ot));
            const Pt = { x: 0.5, y: 0.8, z: 0.3 }, xt = { x: gt / ct, y: ft / ct, z: yt / ct }, lt = {
              x: Pt.x + xt.x,
              y: Pt.y + xt.y,
              z: Pt.z + xt.z
            }, Wt = Math.sqrt(lt.x * lt.x + lt.y * lt.y + lt.z * lt.z), Yt = Math.max(0, lt.y / Wt), ut = Math.pow(Yt, 32) * dt * 0.6, Ot = Math.sin(Q * 2 + l * 1.5) * Math.cos(Q * 1.5 + g * 1.5), Xt = Math.sin(Q * 1.7 - l * 1.2 + g * 0.8), Zt = (Ot * Xt + 1) * 0.1, Tt = 0.85 + dt * 0.15 + ut + Zt, Nt = Math.min(255, Math.floor(St * Tt + ut * 200)), Gt = Math.min(255, Math.floor(wt * Tt + ut * 180)), _t = Math.min(255, Math.floor(Bt * Tt + ut * 150)), jt = 0.55, Ut = vt * 0.35, Kt = Math.min(0.9, jt + Ut);
            nt = `rgba(${Nt}, ${Gt}, ${_t}, ${Kt})`;
          } else if (S === "lava") {
            const Q = _ * 1.5 + l * 0.3 + g * 0.3, at = 0.8 + Math.sin(Q) * 0.2, mt = Math.floor(255 * at), pt = Math.floor((80 + Math.sin(Q * 2) * 30) * at), dt = Math.floor(30 * (1 - at * 0.5));
            nt = `rgb(${Math.min(255, mt)}, ${Math.min(255, pt)}, ${dt})`;
          }
        }
        t.fillStyle = nt, t.beginPath(), t.moveTo(et[0].x, et[0].y), t.lineTo(et[1].x, et[1].y), t.lineTo(et[2].x, et[2].y), t.lineTo(et[3].x, et[3].y), t.closePath(), t.fill(), M || (t.strokeStyle = this.darkenColor(nt, 0.7), t.lineWidth = 0.5, t.stroke());
      }
    }
    if (this.worldBounds) {
      const n = this.worldBounds, h = Date.now() * 3e-3, l = 5, p = [
        { axis: "x", value: n.minX, dir: 1 },
        // West wall
        { axis: "x", value: n.maxX, dir: -1 },
        // East wall
        { axis: "z", value: n.minZ, dir: 1 },
        // North wall
        { axis: "z", value: n.maxZ, dir: -1 }
        // South wall
      ];
      for (const v of p) {
        let M;
        if (v.axis === "x" ? M = Math.abs(s - v.value) : M = Math.abs(d - v.value), M > B * 1.5) continue;
        const w = Math.max(n.minY, c - 10);
        for (let k = w; k < n.maxY; k += l) {
          const x = v.axis === "x" ? n.minZ : n.minX, I = v.axis === "x" ? n.maxZ : n.maxX;
          for (let P = x; P < I; P += l) {
            let H, q;
            if (v.axis === "x" ? (H = v.value, q = P + l / 2) : (H = P + l / 2, q = v.value), Math.sqrt((H - s) ** 2 + (q - d) ** 2) > B) continue;
            let O;
            const X = Math.min(k + l, n.maxY), U = Math.min(P + l, I);
            v.axis === "x" ? O = [
              [v.value, k, P],
              [v.value, k, U],
              [v.value, X, U],
              [v.value, X, P]
            ] : O = [
              [P, k, v.value],
              [U, k, v.value],
              [U, X, v.value],
              [P, X, v.value]
            ];
            const A = [];
            let V = !0;
            for (const J of O) {
              const tt = L(J[0], J[1], J[2]);
              if (!tt) {
                V = !1;
                break;
              }
              A.push(tt);
            }
            if (!V || A.length < 4) continue;
            const st = ((P + k) * 0.2 + h) % (Math.PI * 2), it = 0.15 + 0.1 * Math.sin(st);
            t.fillStyle = `hsla(${180 + Math.sin(h + P * 0.1) * 20}, 100%, 60%, ${it})`, t.beginPath(), t.moveTo(A[0].x, A[0].y), t.lineTo(A[1].x, A[1].y), t.lineTo(A[2].x, A[2].y), t.lineTo(A[3].x, A[3].y), t.closePath(), t.fill(), t.strokeStyle = `hsla(180, 100%, 70%, ${it * 2})`, t.lineWidth = 1, t.stroke();
          }
        }
      }
      const g = n.minY;
      if (c > g + 3)
        for (let v = n.minX; v < n.maxX; v += l)
          for (let M = n.minZ; M < n.maxZ; M += l) {
            if (Math.sqrt((v + l / 2 - s) ** 2 + (M + l / 2 - d) ** 2) > B) continue;
            const k = Math.min(v + l, n.maxX), x = Math.min(M + l, n.maxZ), I = [
              [v, g, M],
              [k, g, M],
              [k, g, x],
              [v, g, x]
            ], P = [];
            let H = !0;
            for (const O of I) {
              const X = L(O[0], O[1], O[2]);
              if (!X) {
                H = !1;
                break;
              }
              P.push(X);
            }
            if (!H || P.length < 4) continue;
            const q = ((v + M) * 0.2 + h) % (Math.PI * 2), N = 0.1 + 0.08 * Math.sin(q);
            t.fillStyle = `hsla(${280 + Math.sin(h + v * 0.1) * 20}, 100%, 50%, ${N})`, t.beginPath(), t.moveTo(P[0].x, P[0].y), t.lineTo(P[1].x, P[1].y), t.lineTo(P[2].x, P[2].y), t.lineTo(P[3].x, P[3].y), t.closePath(), t.fill(), t.strokeStyle = `hsla(280, 100%, 60%, ${N * 2})`, t.lineWidth = 1, t.stroke();
          }
    }
    for (const n of this.birds) {
      const h = n.x - s, l = n.y - c, p = n.z - d;
      if (h * F + p * T < 0 || h * h + l * l + p * p > C) continue;
      const v = L(n.x, n.y, n.z);
      if (!v) continue;
      const M = n.size * b / v.z;
      if (M < 2) continue;
      const w = Math.sin(n.wingPhase) * 0.5;
      n.angle + Math.PI / 2, t.fillStyle = "#d85a8a", t.beginPath(), t.ellipse(v.x, v.y, M * 0.8, M * 0.4, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ff9ec4";
      const k = M * 1.5, x = M * 0.6 * (1 + w);
      t.beginPath(), t.moveTo(v.x, v.y), t.quadraticCurveTo(
        v.x - k * 0.5,
        v.y - x,
        v.x - k,
        v.y + M * 0.2
      ), t.quadraticCurveTo(
        v.x - k * 0.5,
        v.y + M * 0.1,
        v.x,
        v.y
      ), t.fill(), t.beginPath(), t.moveTo(v.x, v.y), t.quadraticCurveTo(
        v.x + k * 0.5,
        v.y - x,
        v.x + k,
        v.y + M * 0.2
      ), t.quadraticCurveTo(
        v.x + k * 0.5,
        v.y + M * 0.1,
        v.x,
        v.y
      ), t.fill(), t.fillStyle = "#d85a8a", t.beginPath(), t.arc(v.x + M * 0.6, v.y - M * 0.1, M * 0.3, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ffaa00", t.beginPath(), t.moveTo(v.x + M * 0.9, v.y - M * 0.1), t.lineTo(v.x + M * 1.2, v.y), t.lineTo(v.x + M * 0.9, v.y + M * 0.1), t.fill();
    }
    for (const n of this.pestBirds) {
      const h = L(n.x, n.y, n.z);
      if (!h) continue;
      const l = n.size * b / h.z;
      if (l < 1) continue;
      const p = Math.sin(n.wingPhase) * 0.7, g = n.anger || 0, S = Math.min(255, 107 + g * 30), v = Math.max(0, 68 - g * 10), M = Math.max(0, 35 - g * 7), w = n.state === "swooping", k = g > 0 ? `rgb(${S}, ${v}, ${M})` : w ? "#8b4513" : "#6b4423", x = g > 0 ? `rgb(${Math.min(255, S + 30)}, ${v + 20}, ${M + 10})` : w ? "#a0522d" : "#8b7355";
      t.fillStyle = k, t.beginPath(), t.ellipse(h.x, h.y, l * 0.6, l * 0.5, 0, 0, Math.PI * 2), t.fill(), g >= 3 && (t.shadowColor = "#ff0000", t.shadowBlur = g * 3), t.fillStyle = x;
      const I = l * 1.2, P = l * 0.8 * (1 + p);
      t.beginPath(), t.moveTo(h.x, h.y), t.quadraticCurveTo(
        h.x - I * 0.4,
        h.y - P,
        h.x - I,
        h.y
      ), t.quadraticCurveTo(
        h.x - I * 0.4,
        h.y + l * 0.2,
        h.x,
        h.y
      ), t.fill(), t.beginPath(), t.moveTo(h.x, h.y), t.quadraticCurveTo(
        h.x + I * 0.4,
        h.y - P,
        h.x + I,
        h.y
      ), t.quadraticCurveTo(
        h.x + I * 0.4,
        h.y + l * 0.2,
        h.x,
        h.y
      ), t.fill(), t.fillStyle = k, t.beginPath(), t.arc(h.x + l * 0.4, h.y - l * 0.15, l * 0.25, 0, Math.PI * 2), t.fill(), t.fillStyle = "#000", t.beginPath(), t.arc(h.x + l * 0.45, h.y - l * 0.2, l * 0.08, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ff6600", t.beginPath(), t.moveTo(h.x + l * 0.6, h.y - l * 0.15), t.lineTo(h.x + l * 0.85, h.y - l * 0.1), t.lineTo(h.x + l * 0.6, h.y - l * 0.05), t.fill(), t.fillStyle = x, t.beginPath(), t.moveTo(h.x - l * 0.4, h.y), t.lineTo(h.x - l * 0.9, h.y - l * 0.1), t.lineTo(h.x - l * 0.95, h.y + l * 0.05), t.lineTo(h.x - l * 0.85, h.y + l * 0.15), t.lineTo(h.x - l * 0.4, h.y + l * 0.1), t.fill(), t.shadowBlur = 0, t.shadowColor = "transparent";
    }
    if (this.blueBirds)
      for (const n of this.blueBirds) {
        const h = L(n.x, n.y, n.z);
        if (!h) continue;
        const l = Math.max(8, 25 / h.z), p = Math.sin(n.wingPhase) * 0.6, g = l * 0.5 * (1 + p);
        t.fillStyle = "#1e90ff", t.beginPath(), t.ellipse(h.x, h.y, l * 0.5, l * 0.3, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = "#00bfff";
        const S = l * 1.2;
        t.beginPath(), t.moveTo(h.x, h.y), t.quadraticCurveTo(h.x - S * 0.5, h.y - g, h.x - S, h.y), t.quadraticCurveTo(h.x - S * 0.5, h.y + l * 0.2, h.x, h.y), t.fill(), t.beginPath(), t.moveTo(h.x, h.y), t.quadraticCurveTo(h.x + S * 0.5, h.y - g, h.x + S, h.y), t.quadraticCurveTo(h.x + S * 0.5, h.y + l * 0.2, h.x, h.y), t.fill(), t.fillStyle = "#ff0000", t.beginPath(), t.arc(h.x + l * 0.3, h.y - l * 0.1, l * 0.15, 0, Math.PI * 2), t.fill();
      }
    if (this.fish)
      for (const n of this.fish) {
        const h = L(n.x, n.y, n.z);
        if (!h) continue;
        const l = Math.max(4, n.size * 30 / h.z), p = Math.sin(n.swimPhase) * 0.2;
        t.save(), t.translate(h.x, h.y), t.rotate(Math.atan2(n.vz, n.vx) + p), t.fillStyle = n.color, t.beginPath(), t.ellipse(0, 0, l, l * 0.4, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.moveTo(-l * 0.8, 0), t.lineTo(-l * 1.5, -l * 0.4), t.lineTo(-l * 1.5, l * 0.4), t.closePath(), t.fill(), t.fillStyle = "#000", t.beginPath(), t.arc(l * 0.5, -l * 0.1, l * 0.15, 0, Math.PI * 2), t.fill(), t.restore();
      }
    if (this.cats)
      for (const n of this.cats) {
        const h = L(n.x, n.y + 0.3, n.z);
        if (!h) continue;
        const l = Math.max(10, 40 / h.z), p = Math.sin(n.walkPhase) * l * 0.05;
        t.fillStyle = n.color, t.beginPath(), t.ellipse(h.x, h.y + p, l * 0.6, l * 0.4, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.arc(h.x + l * 0.5, h.y - l * 0.2 + p, l * 0.35, 0, Math.PI * 2), t.fill(), t.beginPath(), t.moveTo(h.x + l * 0.3, h.y - l * 0.5 + p), t.lineTo(h.x + l * 0.4, h.y - l * 0.2 + p), t.lineTo(h.x + l * 0.5, h.y - l * 0.5 + p), t.fill(), t.beginPath(), t.moveTo(h.x + l * 0.6, h.y - l * 0.5 + p), t.lineTo(h.x + l * 0.7, h.y - l * 0.2 + p), t.lineTo(h.x + l * 0.5, h.y - l * 0.5 + p), t.fill(), t.fillStyle = "#00ff00", t.beginPath(), t.ellipse(h.x + l * 0.4, h.y - l * 0.25 + p, l * 0.08, l * 0.12, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.ellipse(h.x + l * 0.6, h.y - l * 0.25 + p, l * 0.08, l * 0.12, 0, 0, Math.PI * 2), t.fill(), t.strokeStyle = n.color, t.lineWidth = l * 0.1, t.lineCap = "round", t.beginPath(), t.moveTo(h.x - l * 0.5, h.y + p), t.quadraticCurveTo(h.x - l * 0.8, h.y - l * 0.3, h.x - l * 0.7, h.y - l * 0.5), t.stroke();
      }
    if (this.creepers)
      for (const n of this.creepers) {
        const h = L(n.x, n.y + 0.8, n.z);
        if (!h) continue;
        const l = Math.max(15, 50 / h.z), p = n.state === "fusing" && n.flashing ? "#ffffff" : "#00aa00";
        t.fillStyle = p, t.fillRect(h.x - l * 0.3, h.y - l * 0.5, l * 0.6, l), t.fillRect(h.x - l * 0.35, h.y - l * 0.9, l * 0.7, l * 0.5), t.fillStyle = "#000", t.fillRect(h.x - l * 0.25, h.y - l * 0.8, l * 0.15, l * 0.15), t.fillRect(h.x + l * 0.1, h.y - l * 0.8, l * 0.15, l * 0.15), t.fillRect(h.x - l * 0.2, h.y - l * 0.55, l * 0.1, l * 0.15), t.fillRect(h.x + l * 0.1, h.y - l * 0.55, l * 0.1, l * 0.15), t.fillRect(h.x - l * 0.1, h.y - l * 0.5, l * 0.2, l * 0.1), t.fillStyle = p, t.fillRect(h.x - l * 0.3, h.y + l * 0.4, l * 0.2, l * 0.3), t.fillRect(h.x + l * 0.1, h.y + l * 0.4, l * 0.2, l * 0.3);
      }
    for (const n of this.particles) {
      const h = L(n.x, n.y, n.z);
      if (h) {
        if (n.type === "bullet") {
          const l = n.x - this.camera.x, p = n.y - this.camera.y, g = n.z - this.camera.z;
          let S = !1;
          for (let M = 0.3; M < 0.95; M += 0.2) {
            const w = this.camera.x + l * M, k = this.camera.y + p * M, x = this.camera.z + g * M, I = this.getBlock(Math.floor(w), Math.floor(k), Math.floor(x));
            if (I && !this.fluidBlocks.includes(I)) {
              S = !0;
              break;
            }
          }
          if (S) continue;
          if (n.trail.length > 1) {
            t.strokeStyle = "rgba(255, 200, 50, 0.8)", t.lineWidth = 2, t.beginPath();
            let M = !1;
            for (let w = 0; w < n.trail.length; w++) {
              const k = L(n.trail[w].x, n.trail[w].y, n.trail[w].z);
              k && (M ? t.lineTo(k.x, k.y) : (t.moveTo(k.x, k.y), M = !0));
            }
            M && (t.lineTo(h.x, h.y), t.stroke());
          }
          const v = Math.max(2, 8 / h.z);
          t.fillStyle = "#ffcc00", t.beginPath(), t.arc(h.x, h.y, v, 0, Math.PI * 2), t.fill();
        } else if (n.type === "ricochet" || n.type === "spark") {
          const l = Math.max(1, (n.size || 3) * 20 / h.z), p = Math.min(1, n.life / 15);
          t.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 50, ${p})`, t.beginPath(), t.arc(h.x, h.y, l, 0, Math.PI * 2), t.fill();
        } else if (n.type === "blessing") {
          const l = Math.max(2, (n.size || 4) * 20 / h.z), p = Math.min(1, n.life / 30), g = Math.sin(n.life * 0.3) * 0.5 + 0.5;
          t.fillStyle = `rgba(255, 215, 0, ${p * 0.3})`, t.beginPath(), t.arc(h.x, h.y, l * 2, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, ${200 + g * 55}, ${100 + g * 155}, ${p})`, t.beginPath(), t.arc(h.x, h.y, l, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 255, 255, ${p * g})`, t.beginPath(), t.arc(h.x, h.y, l * 0.3, 0, Math.PI * 2), t.fill();
        } else if (n.type === "explosion") {
          const l = Math.max(3, (n.size || 5) * 25 / h.z), p = Math.min(1, n.life / 20), g = Math.random() * 0.3 + 0.7;
          t.fillStyle = `rgba(255, 100, 0, ${p * 0.4})`, t.beginPath(), t.arc(h.x, h.y, l * 1.5, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 0, ${p * g})`, t.beginPath(), t.arc(h.x, h.y, l, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 255, ${Math.random() * 100}, ${p * 0.8})`, t.beginPath(), t.arc(h.x, h.y, l * 0.4, 0, Math.PI * 2), t.fill();
        } else if (n.type === "feather") {
          const l = Math.max(2, 15 / h.z), p = Math.min(1, n.life / 20);
          t.save(), t.translate(h.x, h.y), t.rotate(n.rotation), t.fillStyle = `rgba(139, 90, 43, ${p})`, t.beginPath(), t.ellipse(0, 0, l * 2, l * 0.5, 0, 0, Math.PI * 2), t.fill(), t.strokeStyle = `rgba(100, 60, 30, ${p})`, t.lineWidth = 1, t.beginPath(), t.moveTo(-l * 2, 0), t.lineTo(l * 2, 0), t.stroke(), t.restore();
        } else if (n.type === "petal") {
          const l = n.x - this.camera.x, p = n.y - this.camera.y, g = n.z - this.camera.z;
          let S = !1;
          for (let w = 0.2; w < 0.9; w += 0.25) {
            const k = this.camera.x + l * w, x = this.camera.y + p * w, I = this.camera.z + g * w, P = this.getBlock(Math.floor(k), Math.floor(x), Math.floor(I));
            if (P && !this.fluidBlocks.includes(P)) {
              S = !0;
              break;
            }
          }
          if (S) continue;
          const v = Math.max(2, (n.size || 4) * 15 / h.z), M = Math.min(1, n.life / 50);
          t.save(), t.translate(h.x, h.y), t.rotate(n.rotation), t.fillStyle = `rgba(255, 183, 197, ${M})`, t.beginPath(), t.ellipse(0, 0, v * 1.5, v * 0.7, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 150, 170, ${M})`, t.beginPath(), t.ellipse(0, 0, v * 0.5, v * 0.3, 0, 0, Math.PI * 2), t.fill(), t.restore();
        } else if (n.type === "burger") {
          const l = Math.max(3, (n.size || 8) * 20 / h.z);
          t.save(), t.translate(h.x, h.y), t.fillStyle = "#D2691E", t.beginPath(), t.ellipse(0, -l * 0.3, l, l * 0.5, 0, Math.PI, 0), t.fill(), t.fillStyle = "#654321", t.fillRect(-l, -l * 0.2, l * 2, l * 0.4), t.fillStyle = "#228B22", t.fillRect(-l * 0.9, l * 0.1, l * 1.8, l * 0.15), t.fillStyle = "#DEB887", t.beginPath(), t.ellipse(0, l * 0.3, l, l * 0.4, 0, 0, Math.PI), t.fill(), t.restore();
        } else if (n.type === "burgerSplat") {
          const l = Math.max(2, (n.size || 4) * 10 / h.z), p = Math.min(1, n.life / 10), g = ["#D2691E", "#654321", "#228B22", "#FF6347"];
          t.fillStyle = g[Math.floor(Math.random() * g.length)].replace(")", `, ${p})`).replace("rgb", "rgba"), t.beginPath(), t.arc(h.x, h.y, l, 0, Math.PI * 2), t.fill();
        } else if (n.type === "apple") {
          const l = Math.max(3, (n.size || 6) * 18 / h.z);
          t.save(), t.translate(h.x, h.y), t.fillStyle = "#dc143c", t.beginPath(), t.arc(0, 0, l, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(255, 255, 255, 0.3)", t.beginPath(), t.arc(-l * 0.3, -l * 0.3, l * 0.4, 0, Math.PI * 2), t.fill(), t.fillStyle = "#654321", t.fillRect(-1, -l - 3, 2, 4), t.fillStyle = "#228b22", t.beginPath(), t.ellipse(3, -l - 1, 4, 2, 0.3, 0, Math.PI * 2), t.fill(), t.restore();
        } else if (n.type === "appleSplat") {
          const l = Math.max(2, (n.size || 3) * 8 / h.z), p = Math.min(1, n.life / 10);
          t.fillStyle = `rgba(220, 20, 60, ${p})`, t.beginPath(), t.arc(h.x, h.y, l, 0, Math.PI * 2), t.fill();
        }
      }
    }
    if (this.droppedItems)
      for (const h of this.droppedItems) {
        const l = h.x - s, p = h.y - c, g = h.z - d;
        if (l * l + p * p + g * g > 400) continue;
        let v = !1;
        for (let x = 0.15; x < 0.9; x += 0.2) {
          const I = s + l * x, P = c + p * x, H = d + g * x, q = this.getBlock(Math.floor(I), Math.floor(P), Math.floor(H));
          if (q && !this.fluidBlocks.includes(q)) {
            v = !0;
            break;
          }
        }
        if (v) continue;
        const M = Math.sin(h.bobPhase) * 0.1, w = L(h.x, h.y + M, h.z);
        if (!w || w.z <= 0) continue;
        const k = Math.max(6, 30 / w.z);
        this.drawDroppedItem3D(t, w.x, w.y, k, h.type, h.bobPhase), h.count > 1 && (t.font = `bold ${Math.max(8, k * 0.5)}px monospace`, t.fillStyle = "#fff", t.strokeStyle = "#000", t.lineWidth = 2, t.textAlign = "center", t.strokeText(h.count.toString(), w.x + k * 0.5, w.y + k * 0.4), t.fillText(h.count.toString(), w.x + k * 0.5, w.y + k * 0.4));
      }
    if (!this.isPaused && this.pointerLocked) {
      const n = this.raycast();
      if (n && n.hit) {
        const h = n.hit.x, l = n.hit.y, p = n.hit.z, g = 5e-3, v = [
          [h - g, l - g, p - g],
          [h + 1 + g, l - g, p - g],
          [h + 1 + g, l + 1 + g, p - g],
          [h - g, l + 1 + g, p - g],
          [h - g, l - g, p + 1 + g],
          [h + 1 + g, l - g, p + 1 + g],
          [h + 1 + g, l + 1 + g, p + 1 + g],
          [h - g, l + 1 + g, p + 1 + g]
        ].map((w) => L(w[0], w[1], w[2]));
        if (v.every((w) => w !== null)) {
          let w = "rgba(0, 0, 0, 0.8)", k = 2;
          n.throughWater ? (w = "rgba(74, 144, 217, 0.7)", k = 3) : n.throughLava && (w = "rgba(255, 100, 0, 0.7)", k = 3), t.strokeStyle = w, t.lineWidth = k;
          const x = [
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
          for (const [I, P] of x)
            t.moveTo(v[I].x, v[I].y), t.lineTo(v[P].x, v[P].y);
          t.stroke();
        }
        const M = this.getBlock(h, l, p);
        this.updateBlockTooltip(M);
      } else
        this.updateBlockTooltip(null);
    }
    if (this.debugShowCoords && (t.fillStyle = "rgba(0, 0, 0, 0.7)", t.fillRect(e - 200, 10, 190, 80), t.fillStyle = "#0f0", t.font = "12px monospace", t.textAlign = "left", t.fillText(`X: ${this.camera.x.toFixed(2)}`, e - 190, 28), t.fillText(`Y: ${this.camera.y.toFixed(2)}`, e - 190, 43), t.fillText(`Z: ${this.camera.z.toFixed(2)}`, e - 190, 58), t.fillText(`Blocks: ${Object.keys(this.world).length}`, e - 190, 73), t.fillText(`Birds: ${this.pestBirds.length}`, e - 190, 88)), this.renderPlayerModel(t, u, y, e, i), !this.isPaused && this.pointerLocked && (t.strokeStyle = "#fff", t.lineWidth = 2, t.beginPath(), t.moveTo(u - 10, y), t.lineTo(u + 10, y), t.moveTo(u, y - 10), t.lineTo(u, y + 10), t.stroke()), this.birdEvent && this.birdEvent.alertMessage && this.birdEvent.alertFade > 0) {
      const n = Math.min(1, this.birdEvent.alertFade / 1e3), h = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
      t.save(), t.globalAlpha = n, t.fillStyle = `rgba(0, 0, 0, ${0.7 * h})`;
      const l = Math.min(e * 0.8, 500), p = 60, g = (e - l) / 2, S = 80;
      t.fillRect(g, S, l, p), t.strokeStyle = `rgba(255, 100, 100, ${h})`, t.lineWidth = 3, t.strokeRect(g, S, l, p), t.fillStyle = `rgba(255, 255, 255, ${h})`, t.font = "bold 20px monospace", t.textAlign = "center", t.fillText(this.birdEvent.alertMessage, e / 2, S + 38), t.restore();
    }
    if (this.birdEvent && !this.isPaused) {
      const n = Math.max(0, this.birdEvent.timer), h = Math.floor(n / 6e4), l = Math.floor(n % 6e4 / 1e3), p = `🐦 ${h}:${l.toString().padStart(2, "0")}`;
      t.save(), t.fillStyle = "rgba(0, 0, 0, 0.5)", t.fillRect(e - 100, 10, 90, 25), t.fillStyle = n < 6e4 ? "#ff6666" : "#fff", t.font = "14px monospace", t.textAlign = "right", t.fillText(p, e - 15, 28), t.restore();
    }
    if (this.selectedItem === "ak47" && !this.isPaused) {
      const n = Math.min(e, i) * 55e-4, h = e * 0.75, l = i * 0.78;
      t.save(), t.translate(h, l), t.rotate(-0.1), t.fillStyle = "#d4a574", t.beginPath(), t.ellipse(45 * n, 25 * n, 18 * n, 12 * n, 0.3, 0, Math.PI * 2), t.fill(), t.fillStyle = "#c49a6c";
      for (let p = 0; p < 4; p++)
        t.beginPath(), t.ellipse((35 + p * 7) * n, 35 * n, 4 * n, 8 * n, 0.2, 0, Math.PI * 2), t.fill();
      t.fillStyle = "#d4a574", t.beginPath(), t.ellipse(30 * n, 15 * n, 6 * n, 10 * n, -0.5, 0, Math.PI * 2), t.fill(), t.fillStyle = "#5a3d2b", t.beginPath(), t.moveTo(80 * n, -5 * n), t.lineTo(160 * n, 0 * n), t.lineTo(165 * n, 25 * n), t.lineTo(155 * n, 30 * n), t.lineTo(80 * n, 25 * n), t.closePath(), t.fill(), t.fillStyle = "#6b4d3b", t.fillRect(100 * n, 2 * n, 50 * n, 8 * n), t.fillRect(95 * n, 15 * n, 55 * n, 6 * n), t.fillStyle = "#333", t.fillRect(155 * n, -2 * n, 8 * n, 30 * n), t.fillStyle = "#2a2a2a", t.fillRect(-30 * n, -8 * n, 115 * n, 30 * n), t.fillStyle = "#3a3a3a", t.fillRect(-25 * n, -12 * n, 100 * n, 8 * n), t.fillStyle = "#1a1a1a", t.fillRect(15 * n, -6 * n, 25 * n, 12 * n), t.fillStyle = "#1a1a1a", t.fillRect(-140 * n, -4 * n, 115 * n, 14 * n), t.fillStyle = "#111", t.fillRect(-180 * n, 0 * n, 45 * n, 8 * n), t.fillStyle = "#000", t.beginPath(), t.ellipse(-182 * n, 4 * n, 3 * n, 3 * n, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = "#333", t.fillRect(-130 * n, -10 * n, 100 * n, 5 * n), t.fillStyle = "#111";
      for (let p = 0; p < 4; p++)
        t.beginPath(), t.ellipse((-120 + p * 22) * n, 3 * n, 6 * n, 3 * n, 0, 0, Math.PI * 2), t.fill();
      t.fillStyle = "#1a1a1a", t.fillRect(-145 * n, -20 * n, 6 * n, 18 * n), t.fillRect(-148 * n, -22 * n, 12 * n, 4 * n), t.fillRect(-5 * n, -18 * n, 15 * n, 8 * n), t.fillStyle = "#333", t.beginPath(), t.moveTo(10 * n, 22 * n), t.lineTo(35 * n, 22 * n), t.quadraticCurveTo(45 * n, 50 * n, 35 * n, 80 * n), t.lineTo(15 * n, 85 * n), t.quadraticCurveTo(5 * n, 55 * n, 10 * n, 22 * n), t.closePath(), t.fill(), t.strokeStyle = "#222", t.lineWidth = 1.5 * n;
      for (let p = 0; p < 4; p++)
        t.beginPath(), t.moveTo((12 + p * 2) * n, (35 + p * 12) * n), t.lineTo((32 + p * 1) * n, (38 + p * 12) * n), t.stroke();
      t.fillStyle = "#5a3d2b", t.beginPath(), t.moveTo(45 * n, 22 * n), t.lineTo(65 * n, 22 * n), t.lineTo(70 * n, 65 * n), t.lineTo(45 * n, 70 * n), t.closePath(), t.fill(), t.fillStyle = "#4a2d1b";
      for (let p = 0; p < 5; p++)
        t.fillRect(50 * n, (28 + p * 8) * n, 12 * n, 3 * n);
      if (t.strokeStyle = "#2a2a2a", t.lineWidth = 3 * n, t.beginPath(), t.arc(25 * n, 35 * n, 15 * n, -0.8, 2.2), t.stroke(), t.fillStyle = "#222", t.fillRect(22 * n, 28 * n, 4 * n, 12 * n), this.muzzleFlash > 0) {
        const p = 25 + Math.random() * 20, g = -190 * n, S = 4 * n;
        t.fillStyle = "rgba(255, 100, 0, 0.5)", t.beginPath(), t.arc(g, S, p * n * 1.5, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(255, 150, 0, 0.8)", t.beginPath(), t.arc(g, S, p * n, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ffff00", t.beginPath(), t.arc(g, S, p * n * 0.4, 0, Math.PI * 2), t.fill(), t.strokeStyle = "#ffff88", t.lineWidth = 2;
        for (let v = 0; v < 6; v++) {
          const M = Math.PI + (Math.random() - 0.5) * 1.5, w = (20 + Math.random() * 35) * n;
          t.beginPath(), t.moveTo(g, S), t.lineTo(g + Math.cos(M) * w, S + Math.sin(M) * w), t.stroke();
        }
      }
      t.restore();
    }
    if (this.headSubmergedWater && (t.fillStyle = "rgba(0, 100, 200, 0.25)", t.fillRect(0, 0, e, i)), this.headSubmergedLava) {
      const n = Date.now() * 5e-3;
      t.fillStyle = "rgba(255, 80, 0, 0.4)", t.fillRect(0, 0, e, i), t.fillStyle = "rgba(255, 50, 0, 0.6)";
      for (let l = 0; l < 12; l++) {
        const p = l / 12 * e, g = 60 + Math.sin(n + l * 0.8) * 30 + Math.sin(n * 1.5 + l) * 20;
        t.beginPath(), t.moveTo(p - 30, i), t.quadraticCurveTo(p, i - g, p + 30, i), t.fill();
      }
      t.fillStyle = "rgba(255, 100, 0, 0.5)";
      for (let l = 0; l < 8; l++) {
        const p = l / 8 * e + 40, g = 40 + Math.sin(n * 0.8 + l * 1.2) * 25;
        t.beginPath(), t.moveTo(p - 25, 0), t.quadraticCurveTo(p, g, p + 25, 0), t.fill();
      }
      t.fillStyle = "rgba(255, 60, 0, 0.5)";
      for (let l = 0; l < 6; l++) {
        const p = l / 6 * i, g = 40 + Math.sin(n + l) * 20;
        t.beginPath(), t.moveTo(0, p - 30), t.quadraticCurveTo(g, p, 0, p + 30), t.fill(), t.beginPath(), t.moveTo(e, p - 30), t.quadraticCurveTo(e - g, p, e, p + 30), t.fill();
      }
      const h = t.createRadialGradient(e / 2, i / 2, 0, e / 2, i / 2, e * 0.7);
      h.addColorStop(0, "rgba(255, 50, 0, 0)"), h.addColorStop(0.7, "rgba(255, 30, 0, 0.3)"), h.addColorStop(1, "rgba(200, 0, 0, 0.6)"), t.fillStyle = h, t.fillRect(0, 0, e, i);
    }
  },
  project(t, e, i) {
    const a = t - this.camera.x, s = e - this.camera.y, c = i - this.camera.z, d = Math.cos(-this.camera.rotY), r = Math.sin(-this.camera.rotY), o = a * d - c * r, f = a * r + c * d, m = Math.cos(-this.camera.rotX), u = Math.sin(-this.camera.rotX), y = s * m - f * u, b = s * u + f * m;
    if (b <= 0.1) return null;
    const B = 400, C = this.canvas.width / 2 + o / b * B, L = this.canvas.height / 2 - y / b * B;
    return { x: C, y: L, z: b };
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
    const d = Math.min(1, c);
    t.save();
    const r = s - 50 + (1 - c) * 200;
    this.drawPlayerBody3D(t, e, r, d, c), t.restore(), this.renderHeldItem(t, e, i, a, s);
  },
  // Render held item in first person
  renderHeldItem(t, e, i, a, s) {
    const c = this.inventory.hotbar[this.selectedSlot];
    if (!c) return;
    const d = c.id, r = Math.sin(Date.now() * 3e-3) * 3, o = a - 120, f = s - 100 + r, m = 60;
    t.save(), t.translate(o, f), t.rotate(-0.2), t.fillStyle = "#ffdab9", t.beginPath(), t.ellipse(0, 20, 25, 35, 0.3, 0, Math.PI * 2), t.fill();
    const u = this.blockColors[d];
    if (u) {
      const y = m * 0.5;
      t.translate(0, -10), t.fillStyle = u.top, t.beginPath(), t.moveTo(0, -y), t.lineTo(y, -y / 2), t.lineTo(0, 0), t.lineTo(-y, -y / 2), t.closePath(), t.fill(), t.fillStyle = u.side, t.beginPath(), t.moveTo(-y, -y / 2), t.lineTo(0, 0), t.lineTo(0, y), t.lineTo(-y, y / 2), t.closePath(), t.fill(), t.fillStyle = this.darkenColor(u.side, 0.7), t.beginPath(), t.moveTo(0, 0), t.lineTo(y, -y / 2), t.lineTo(y, y / 2), t.lineTo(0, y), t.closePath(), t.fill();
    } else if (d === "ak47")
      t.fillStyle = "#333", t.fillRect(-30, -20, 80, 15), t.fillStyle = "#8b4513", t.fillRect(-10, -5, 25, 25), t.fillStyle = "#222", t.fillRect(10, -5, 8, 20);
    else if (d === "berdger")
      t.fillStyle = "#daa520", t.beginPath(), t.ellipse(0, -15, 25, 12, 0, Math.PI, 0), t.fill(), t.fillStyle = "#8b4513", t.fillRect(-22, -8, 44, 10), t.fillStyle = "#228b22", t.fillRect(-20, 0, 40, 5), t.fillStyle = "#daa520", t.beginPath(), t.ellipse(0, 10, 23, 10, 0, 0, Math.PI), t.fill();
    else if (d === "apple")
      t.fillStyle = "#dc143c", t.beginPath(), t.arc(0, -5, 20, 0, Math.PI * 2), t.fill(), t.fillStyle = "#654321", t.fillRect(-2, -30, 4, 10), t.fillStyle = "#228b22", t.beginPath(), t.ellipse(5, -28, 8, 4, 0.5, 0, Math.PI * 2), t.fill();
    else if (d === "water_bucket" || d === "lava_bucket")
      t.fillStyle = "#888", t.beginPath(), t.moveTo(-20, -25), t.lineTo(20, -25), t.lineTo(15, 15), t.lineTo(-15, 15), t.closePath(), t.fill(), t.fillStyle = d === "water_bucket" ? "#4a90d9" : "#ff6600", t.fillRect(-15, -15, 30, 25);
    else if (d === "seeds") {
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
    const d = t.createRadialGradient(e - 55, i + 30, 0, e - 55, i + 30, 30);
    d.addColorStop(0, `rgba(255, 228, 205, ${a})`), d.addColorStop(1, `rgba(220, 180, 160, ${a})`), t.fillStyle = d, t.beginPath(), t.ellipse(e - 52, i + 35, 14, 28, -0.2, 0, Math.PI * 2), t.fill();
    const r = t.createRadialGradient(e + 55, i + 30, 0, e + 55, i + 30, 30);
    r.addColorStop(0, `rgba(255, 228, 205, ${a})`), r.addColorStop(1, `rgba(220, 180, 160, ${a})`), t.fillStyle = r, t.beginPath(), t.ellipse(e + 52, i + 35, 14, 28, 0.2, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 218, 195, ${a})`, t.beginPath(), t.arc(e - 55, i + 60, 12, 0, Math.PI * 2), t.fill(), t.beginPath(), t.arc(e + 55, i + 60, 12, 0, Math.PI * 2), t.fill();
    const o = t.createLinearGradient(e - 40, i + 75, e + 40, i + 75);
    o.addColorStop(0, `rgba(50, 70, 100, ${a})`), o.addColorStop(0.3, `rgba(70, 90, 120, ${a})`), o.addColorStop(0.7, `rgba(70, 90, 120, ${a})`), o.addColorStop(1, `rgba(50, 70, 100, ${a})`), t.fillStyle = o, t.beginPath(), t.roundRect(e - 38, i + 78, 28, 55, 3), t.fill(), t.beginPath(), t.roundRect(e + 10, i + 78, 28, 55, 3), t.fill(), t.fillStyle = `rgba(100, 60, 30, ${a})`, t.beginPath(), t.roundRect(e - 42, i + 128, 35, 20, 4), t.fill(), t.beginPath(), t.roundRect(e + 7, i + 128, 35, 20, 4), t.fill(), t.fillStyle = `rgba(255, 255, 255, ${a * 0.2})`, t.beginPath(), t.ellipse(e - 30, i + 133, 8, 3, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.ellipse(e + 20, i + 133, 8, 3, 0, 0, Math.PI * 2), t.fill(), t.restore();
  },
  darkenColor(t, e) {
    const i = t + e;
    if (this.colorCache || (this.colorCache = {}), this.colorCache[i]) return this.colorCache[i];
    const a = Math.floor(parseInt(t.slice(1, 3), 16) * e), s = Math.floor(parseInt(t.slice(3, 5), 16) * e), c = Math.floor(parseInt(t.slice(5, 7), 16) * e), d = `rgb(${a},${s},${c})`;
    return this.colorCache[i] = d, d;
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
      const d = (f, m) => {
        let u = null;
        for (let D = 40; D >= 0; D--) {
          const $ = this.getBlock(f, D, m);
          if ($ && $ !== "water" && $ !== "lava") {
            u = D;
            break;
          }
        }
        if (u === null) return null;
        const y = u + 1, b = u + 2, B = this.getBlock(f, y, m), C = this.getBlock(f, b, m), L = !B || B === "water" || B === "lava", z = !C || C === "water" || C === "lava", F = this.getBlock(f, u, m), T = F !== "water" && F !== "lava" && F !== "sand";
        return L && z ? {
          x: f,
          y: y + this.playerEyeHeight,
          z: m,
          priority: T ? 1 : 2
          // Prefer dry land
        } : null;
      };
      let r = d(0, -8);
      if (r && r.priority === 1)
        return r;
      const o = 30;
      for (let f = 1; f <= o; f++) {
        for (let m = -f; m <= f; m++)
          for (let u = -f; u <= f; u++) {
            if (Math.abs(m) !== f && Math.abs(u) !== f) continue;
            const y = d(0 + m, -8 + u);
            if (y) {
              if (y.priority === 1)
                return y;
              (!r || y.priority < r.priority) && (r = y);
            }
          }
        if (r && f > 5)
          return r;
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
class zt {
  constructor() {
    It(this, "_game");
    It(this, "_initialized");
    this._game = ee, this._initialized = !1;
  }
  /**
   * Initialize the game with options
   */
  init(e = {}) {
    var i, a;
    if (!document.getElementById("minecraftGame")) {
      let s = document.body;
      e.container && (s = typeof e.container == "string" ? document.querySelector(e.container) || document.body : e.container), te(s);
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
  window.SakuraCraft = zt, window.SakuraCraftGame = zt;
  const t = document.currentScript;
  if (t != null && t.hasAttribute("data-auto-init")) {
    const e = t.getAttribute("data-trigger");
    document.addEventListener("DOMContentLoaded", () => {
      const i = new zt();
      i.init({ trigger: e ?? void 0 }), window.sakuraCraft = i;
    });
  }
}
export {
  zt as SakuraCraftGame,
  zt as default,
  ee as minecraftGame
};
//# sourceMappingURL=sakuracraft.es.js.map
