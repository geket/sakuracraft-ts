var te = Object.defineProperty;
var ee = (t, e, s) => e in t ? te(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var Et = (t, e, s) => ee(t, typeof e != "symbol" ? e + "" : e, s);
const se = `
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
      <div class="hotbar-slot" data-item="ka69"></div>
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
function ie(t = document.body) {
  const e = document.createElement("div");
  for (e.innerHTML = se; e.firstChild; )
    t.appendChild(e.firstChild);
}
const oe = {
  canvas: null,
  ctx: null,
  isActive: !1,
  isPaused: !1,
  camera: { x: 0, y: 5, z: 0, rotX: 0, rotY: 0, sneaking: !1, normalHeight: 0.6, sneakHeight: 0.2 },
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
  // Dialogue and Quest System
  dialogueOpen: !1,
  currentDialogueNPC: null,
  journalOpen: !1,
  quests: [],
  // Active and completed quests
  questData: {
    // Gunsmith questline
    meet_gunsmith: {
      id: "meet_gunsmith",
      title: "The Mysterious Wizard",
      description: "A wandering gunsmith has appeared! Perhaps he knows something about the bird invasion?",
      objectives: ["Speak with the Gunsmith"],
      status: "active",
      // active, completed, failed
      stage: 0,
      // 0 = not started, 1 = in progress, 2 = completed
      reward: null
    },
    birds_origin: {
      id: "birds_origin",
      title: "Origin of the Feathered Menace",
      description: "The Gunsmith believes there's a source to this madness. Find clues about where these birds are coming from.",
      objectives: [
        "Survive 3 bird waves",
        "Collect 50 bird drops",
        "Return to the Gunsmith"
      ],
      status: "locked",
      // Not started yet
      stage: 0,
      progress: { waves: 0, drops: 0, returned: !1 },
      reward: "Ancient Map Fragment"
    }
  },
  // Gunsmith dialogue state
  gunsmithDialogueStage: 0,
  // Tracks conversation progress
  gunsmithMetBefore: !1,
  // Has player met them?
  // Items and inventory
  selectedSlot: 0,
  // 0-8 for hotbar slots
  selectedBlock: "grass",
  selectedItem: null,
  // For non-block items like ka69
  hotbarTooltip: { visible: !1, text: "", timestamp: 0 },
  // Tooltip when scrolling hotbar
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
      { type: "weapon", id: "ka69", count: 1, durability: 100, maxDurability: 100 },
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
    for (let i = 0; i < 512; i++)
      t[i] = Math.floor(Math.random() * 256);
    function e(i) {
      return i * i * i * (i * (i * 6 - 15) + 10);
    }
    function s(i, c, h) {
      return i + h * (c - i);
    }
    function o(i, c, h) {
      const d = i & 3, r = d < 2 ? c : h, m = d < 2 ? h : c;
      return (d & 1 ? -r : r) + (d & 2 ? -m : m);
    }
    return function(i, c) {
      const h = Math.floor(i) & 255, d = Math.floor(c) & 255;
      i -= Math.floor(i), c -= Math.floor(c);
      const r = e(i), m = e(c), b = t[h] + d, u = t[h + 1] + d;
      return s(
        s(o(t[b], i, c), o(t[u], i - 1, c), r),
        s(o(t[b + 1], i, c - 1), o(t[u + 1], i - 1, c - 1), r),
        m
      );
    };
  }(),
  // Fractal Brownian Motion for more natural terrain
  fbm(t, e, s = 4) {
    let o = 0, i = 1, c = 1, h = 0;
    for (let d = 0; d < s; d++)
      o += this.noise2D(t * c, e * c) * i, h += i, i *= 0.5, c *= 2;
    return o / h;
  },
  blockColors: {
    grass: { top: "#7cba5f", side: "#8b6b4a", bottom: "#6b4423", useTexture: !0, texture: "grass" },
    dirt: { top: "#8b6b4a", side: "#8b6b4a", bottom: "#8b6b4a", useTexture: !0, texture: "dirt" },
    stone: { top: "#888888", side: "#777777", bottom: "#666666" },
    wood: { top: "#a0825a", side: "#6b4423", bottom: "#6b4423", useTexture: !0, texture: "wood" },
    leaves: { top: "rgba(50, 180, 50, 0.85)", side: "rgba(40, 160, 40, 0.85)", bottom: "rgba(30, 140, 30, 0.85)", transparent: !0, useTexture: !0, texture: "leaves" },
    appleLeaves: { top: "rgba(50, 180, 50, 0.85)", side: "rgba(40, 160, 40, 0.85)", bottom: "rgba(30, 140, 30, 0.85)", transparent: !0, useTexture: !0, texture: "leaves" },
    water: { top: "rgba(74, 144, 217, 0.7)", side: "rgba(58, 128, 201, 0.7)", bottom: "rgba(42, 112, 185, 0.7)", transparent: !0, animated: !0 },
    sand: { top: "#e6d9a0", side: "#d9cc93", bottom: "#ccbf86" },
    brick: { top: "#b35050", side: "#a04040", bottom: "#903030", useTexture: !0, texture: "brick" },
    lava: { top: "#ff6600", side: "#ff4400", bottom: "#cc3300", animated: !0 },
    obsidian: { top: "#1a0a2e", side: "#140820", bottom: "#0a0410" },
    cherryWood: { top: "#c4a07a", side: "#8b5a5a", bottom: "#8b5a5a", useTexture: !0, texture: "wood" },
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
  // Texture cache for procedurally generated patterns
  textureCache: {},
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
    ka69: { stackable: !1, maxStack: 1, durability: 100, maxDurability: 100, description: "Shoots bullets at birds" },
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
    this.canvas = document.getElementById("gameCanvas"), this.ctx = this.canvas.getContext("2d", {
      alpha: !1,
      // No transparency = better performance
      desynchronized: !0
      // Hint for performance
    }), this.ctx.imageSmoothingEnabled = !0, this.ctx.imageSmoothingQuality = "high", this.initialized = !1, this.gameLoopId = null, this.lastFrameTime = 0;
  },
  // Full initialization - called only when game starts
  fullInit() {
    this.initialized || (this.generateWorld(), this.setupControls(), this.setupMenus(), this.setupDebugConsole(), this.initialized = !0, this.updateHotbarDisplay(), setTimeout(() => this.updateHotbarDisplay(), 50), setTimeout(() => this.updateHotbarDisplay(), 150), setTimeout(() => this.updateHotbarDisplay(), 300));
  },
  generateWorld() {
    this.world = {}, this.fluidLevels = {}, this.droppedItems = [], this.cherryTrees = [], this.petalParticles = [];
    const t = 50, e = 6, s = 8;
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
    const o = {}, i = {};
    for (let b = -t; b <= t; b++)
      for (let u = -t; u <= t; u++) {
        const f = this.fbm(b * 0.03, u * 0.03, 2) * 10, y = this.fbm(b * 0.05 + 100, u * 0.05 + 100, 2) * 5, k = Math.sqrt(b * b + u * u) / t, P = Math.max(0, 1 - k * 0.5);
        let T = Math.floor(s + (f + y) * P);
        T = Math.max(1, Math.min(22, T));
        const B = `${b},${u}`;
        o[B] = T, i[B] = this.noise2D(b * 0.03 + 500, u * 0.03 + 500);
      }
    for (let b = -t; b <= t; b++)
      for (let u = -t; u <= t; u++) {
        const f = `${b},${u}`, y = o[f], k = i[f], P = y <= e + 1 && y >= e - 1, T = k > 0.3 && y > e + 2;
        for (let B = Math.max(0, y - 3); B < y - 1; B++)
          this.setBlock(b, B, u, "stone");
        if (P || y <= e ? (this.setBlock(b, y - 1, u, "sand"), this.setBlock(b, y, u, "sand")) : T ? (this.setBlock(b, y - 1, u, "sand"), this.setBlock(b, y, u, "sand")) : (this.setBlock(b, y - 1, u, "dirt"), this.setBlock(b, y, u, "grass")), y < e)
          for (let B = y + 1; B <= e; B++)
            this.setBlock(b, B, u, "water"), this.setFluidLevel(b, B, u, 8);
      }
    for (let b = -t; b <= t; b += 2)
      for (let u = -t; u <= t; u += 2) {
        const f = `${b},${u}`, y = o[f], k = i[f], P = y <= e + 1, T = k > 0.3;
        if (y > e + 1 && !T && !P && this.noise2D(b * 0.4 + 300, u * 0.4 + 300) > 0.5 && Math.random() < 0.12) {
          const z = b - 2, $ = u - 2;
          this.worldBounds && z >= this.worldBounds.minX + 2 && z + 5 <= this.worldBounds.maxX - 2 && $ >= this.worldBounds.minZ + 2 && $ + 5 <= this.worldBounds.maxZ - 2 && !this.checkStructureCollision(z, y + 1, $, 5, 8, 5) && (Math.random() < 0.25 ? this.generateCherryTree(b, y + 1, u) : this.generateTree(b, y + 1, u));
        }
      }
    const c = 5;
    for (let b = 0; b < c; b++) {
      const u = Math.floor(Math.random() * t * 2) - t, f = Math.floor(Math.random() * t * 2) - t, y = `${u},${f}`, k = o[y] || s;
      if (k > e) {
        this.setBlock(u, k + 1, f, "ritualChest");
        const P = this.ritualItems[b % this.ritualItems.length];
        this.chestContents = this.chestContents || {}, this.chestContents[`${u},${k + 1},${f}`] = [
          { type: P, count: 1 }
        ];
      }
    }
    for (let b = 0; b < 30; b++) {
      const u = Math.floor(Math.random() * t * 2) - t, f = Math.floor(Math.random() * t * 2) - t, y = `${u},${f}`, k = o[y] || s;
      k > e && this.droppedItems.push({
        x: u + 0.5,
        y: k + 1.2,
        z: f + 0.5,
        type: "seeds",
        count: 1 + Math.floor(Math.random() * 3),
        bobPhase: Math.random() * Math.PI * 2
      });
    }
    if (this.appleTrees) {
      for (const b of this.appleTrees)
        if (Math.random() < 0.5) {
          const u = 1 + Math.floor(Math.random() * 3);
          for (let f = 0; f < u; f++)
            this.droppedItems.push({
              x: b.x + (Math.random() - 0.5) * 4,
              y: b.y - 3,
              z: b.z + (Math.random() - 0.5) * 4,
              type: "apple",
              count: 1,
              bobPhase: Math.random() * Math.PI * 2
            });
        }
    }
    this.generateBuildings(t);
    let h, d;
    do
      h = Math.floor(Math.random() * (t - 20)) + 15, d = Math.floor(Math.random() * (t - 20)) + 15, Math.random() < 0.5 && (h = -h), Math.random() < 0.5 && (d = -d);
    while (Math.abs(h) < 20 || Math.abs(d) < 20);
    const r = `${h},${d}`, m = o[r] || s;
    this.generateRitualTemple(h, m + 1, d), this.initBirds(), this.initPestBirds();
  },
  generateBuildings(t) {
    const e = ["church", "house1", "house2", "house3", "grocery", "wcdonalds"];
    let o = !1;
    for (let i = -Math.floor(t / 25); i <= Math.floor(t / 25); i++)
      for (let c = -Math.floor(t / 25); c <= Math.floor(t / 25); c++) {
        if (i === 0 && c === 0) continue;
        const h = i * 25, d = c * 25, r = 2 + Math.floor(Math.random() * 5);
        for (let m = 0; m < r; m++) {
          const b = h + 3 + Math.floor(Math.random() * 19), u = d + 3 + Math.floor(Math.random() * 19);
          if (!o && Math.random() < 0.3 && this.tryPlaceBuilding(b, u, ["wcdonalds"])) {
            o = !0;
            continue;
          }
          this.tryPlaceBuilding(b, u, e);
        }
      }
    if (!o)
      for (let i = 0; i < 50; i++) {
        const c = 25 + Math.floor(Math.random() * 20), h = 25 + Math.floor(Math.random() * 20);
        if (this.tryPlaceBuilding(c, h, ["wcdonalds"]))
          break;
      }
  },
  tryPlaceBuilding(t, e, s) {
    if (this.worldBounds) {
      const f = this.worldBounds;
      if (t < f.minX + 10 || t > f.maxX - 10 || e < f.minZ + 10 || e > f.maxZ - 10)
        return !1;
    }
    const o = this.getHighestBlock(t, e);
    if (!o || o < 7) return !1;
    const i = this.getBlock(t, o, e);
    if (i === "water" || i === "sand") return !1;
    const c = this.getHighestBlock(t + 3, e) || o, h = this.getHighestBlock(t - 3, e) || o, d = this.getHighestBlock(t, e + 3) || o, r = this.getHighestBlock(t, e - 3) || o;
    if (Math.max(Math.abs(c - o), Math.abs(h - o), Math.abs(d - o), Math.abs(r - o)) > 2) return !1;
    for (const u of this.buildings)
      if (Math.sqrt((t - u.x) ** 2 + (e - u.z) ** 2) < 15) return !1;
    const m = s[Math.floor(Math.random() * s.length)], b = o + 1;
    switch (this.buildings.push({ x: t, z: e, type: m, y: b }), m) {
      case "church":
        this.generateChurch(t, b, e);
        break;
      case "house1":
        this.generateHouse1(t, b, e);
        break;
      case "house2":
        this.generateHouse2(t, b, e);
        break;
      case "house3":
        this.generateHouse3(t, b, e);
        break;
      case "grocery":
        this.generateGrocery(t, b, e);
        break;
      case "wcdonalds":
        this.generateWcDonalds(t, b, e);
        break;
    }
    return !0;
  },
  // Ruined Church - tall with steeple and intact cross
  generateChurch(t, e, s) {
    for (let b = 0; b < 7; b++)
      for (let u = 0; u < 12; u++)
        this.setBlock(t + b, e - 1, s + u, "stone");
    for (let b = 0; b < 7; b++)
      for (let u = 0; u < 12; u++)
        for (let f = 0; f < 8; f++)
          if ((b === 0 || b === 6 || u === 0 || u === 11) && Math.random() > 0.3) {
            if (u === 11 && b >= 2 && b <= 4 && f < 3 || (b === 0 || b === 6) && f >= 2 && f <= 4 && (u === 3 || u === 8)) continue;
            this.setBlock(t + b, e + f, s + u, "stone");
          }
    const d = t + 3, r = s + 2;
    for (let b = 8; b < 13; b++)
      this.setBlock(d, e + b, r, "stone"), b < 11 && (Math.random() > 0.3 && this.setBlock(d + 1, e + b, r, "stone"), Math.random() > 0.3 && this.setBlock(d - 1, e + b, r, "stone"));
    const m = e + 8 + 5;
    this.setBlock(d, m, r, "stone"), this.setBlock(d, m + 1, r, "stone"), this.setBlock(d, m + 2, r, "stone"), this.setBlock(d - 1, m + 1, r, "stone"), this.setBlock(d + 1, m + 1, r, "stone");
  },
  // Small cottage house
  generateHouse1(t, e, s) {
    for (let d = 0; d < 5; d++)
      for (let r = 0; r < 6; r++)
        this.setBlock(t + d, e - 1, s + r, "wood");
    for (let d = 0; d < 5; d++)
      for (let r = 0; r < 6; r++)
        for (let m = 0; m < 4; m++)
          if ((d === 0 || d === 4 || r === 0 || r === 5) && Math.random() > 0.25) {
            if (r === 5 && d === 2 && m < 2 || d === 0 && m === 1 && r === 2) continue;
            this.setBlock(t + d, e + m, s + r, "wood");
          }
    for (let d = -1; d <= 5; d++)
      for (let r = 0; r < 6; r++)
        Math.random() > 0.25 && this.setBlock(t + d, e + 4, s + r, "leaves");
  },
  // Two-story house
  generateHouse2(t, e, s) {
    for (let d = 0; d < 6; d++)
      for (let r = 0; r < 7; r++)
        this.setBlock(t + d, e - 1, s + r, "stone");
    for (let d = 0; d < 6; d++)
      for (let r = 0; r < 7; r++)
        for (let m = 0; m < 6; m++)
          if ((d === 0 || d === 5 || r === 0 || r === 6) && Math.random() > 0.3) {
            if (r === 6 && d >= 2 && d <= 3 && m < 2 || (d === 0 || d === 5) && (m === 1 || m === 4) && (r === 2 || r === 4)) continue;
            this.setBlock(t + d, e + m, s + r, "brick");
          }
    for (let d = 1; d < 5; d++)
      for (let r = 1; r < 6; r++)
        Math.random() > 0.3 * 2 && this.setBlock(t + d, e + 3, s + r, "wood");
  },
  // L-shaped house
  generateHouse3(t, e, s) {
    for (let i = 0; i < 5; i++)
      for (let c = 0; c < 8; c++) {
        this.setBlock(t + i, e - 1, s + c, "stone");
        for (let h = 0; h < 4; h++)
          if ((i === 0 || i === 4 || c === 0 || c === 7) && Math.random() > 0.35) {
            if (c === 7 && i === 2 && h < 2) continue;
            this.setBlock(t + i, e + h, s + c, "brick");
          }
      }
    for (let i = 5; i < 9; i++)
      for (let c = 0; c < 5; c++) {
        this.setBlock(t + i, e - 1, s + c, "stone");
        for (let h = 0; h < 4; h++)
          (i === 8 || c === 0 || c === 4 || i === 5 && c > 4) && Math.random() > 0.35 && this.setBlock(t + i, e + h, s + c, "brick");
      }
  },
  // Abandoned grocery store
  generateGrocery(t, e, s) {
    for (let d = 0; d < 10; d++)
      for (let r = 0; r < 8; r++)
        this.setBlock(t + d, e - 1, s + r, "stone");
    for (let d = 0; d < 10; d++)
      for (let r = 0; r < 8; r++)
        for (let m = 0; m < 4; m++)
          if ((d === 0 || d === 9 || r === 0 || r === 7) && Math.random() > 0.25) {
            if (r === 7 && d >= 3 && d <= 6 && m < 3 || r === 7 && (d === 1 || d === 8) && m >= 1 && m <= 2) continue;
            this.setBlock(t + d, e + m, s + r, "stone");
          }
    for (let d = 0; d < 2; d++)
      for (let r = 2; r < 6; r++)
        Math.random() > 0.4 && (this.setBlock(t + 3 + d * 3, e, s + r, "wood"), Math.random() > 0.5 && this.setBlock(t + 3 + d * 3, e + 1, s + r, "wood"));
    for (let d = 2; d < 8; d++)
      Math.random() > 0.3 && this.setBlock(t + d, e + 4, s + 8 - 1, "stone");
  },
  // WcDonald's - the knockoff! (W instead of M, same colors)
  generateWcDonalds(t, e, s) {
    for (let u = 1; u < 8; u++)
      for (let f = 1; f < 8; f++)
        for (let y = 0; y < 6; y++) {
          const k = this.getBlock(t + u, e + y, s + f);
          k && k !== "water" && k !== "lava" && this.setBlock(t + u, e + y, s + f, null);
        }
    for (let u = 0; u < 9; u++)
      for (let f = 0; f < 9; f++)
        this.setBlock(t + u, e - 1, s + f, "brick");
    for (let u = 0; u < 9; u++)
      for (let f = 0; f < 9; f++)
        for (let y = 0; y < 4; y++)
          if ((u === 0 || u === 8 || f === 0 || f === 8) && Math.random() > 0.2) {
            if (f === 8 && u >= 3 && u <= 5 && y < 3 || u === 8 && f >= 2 && f <= 4 && y === 1) continue;
            this.setBlock(t + u, e + y, s + f, y < 2 ? "brick" : "stone");
          }
    const d = t + 4, r = s + 9, m = e + 4;
    this.setBlock(d - 2, m, r, "sand"), this.setBlock(d - 2, m + 1, r, "sand"), this.setBlock(d - 2, m + 2, r, "sand"), this.setBlock(d - 2, m + 3, r, "sand"), this.setBlock(d - 1, m, r, "sand"), this.setBlock(d - 1, m + 1, r, "sand"), this.setBlock(d, m, r, "sand"), this.setBlock(d + 1, m, r, "sand"), this.setBlock(d + 1, m + 1, r, "sand"), this.setBlock(d + 2, m, r, "sand"), this.setBlock(d + 2, m + 1, r, "sand"), this.setBlock(d + 2, m + 2, r, "sand"), this.setBlock(d + 2, m + 3, r, "sand");
    for (let u = 2; u < 7; u++)
      Math.random() > 0.3 && this.setBlock(t + u, e, s + 2, "brick");
    Math.random() > 0.4 && this.setBlock(t + 2, e, s + 5, "wood"), Math.random() > 0.4 && this.setBlock(t + 6, e, s + 5, "wood"), Math.random() > 0.4 && this.setBlock(t + 4, e, s + 6, "wood"), this.setBlock(t + 4, e, s + 1, "buildingChest"), this.chestContents = this.chestContents || {};
    const b = `${t + 4},${e},${s + 1}`;
    Math.random() < 0.3 ? this.chestContents[b] = [{ type: "berdger", count: 1 }] : this.chestContents[b] = [{ type: "seeds", count: 3 + Math.floor(Math.random() * 5) }];
  },
  getHighestBlock(t, e) {
    for (let s = 30; s >= 0; s--)
      if (this.getBlock(t, s, e)) return s;
    return null;
  },
  // Check if bird would collide with blocks
  checkBirdCollision(t, e, s, o = 0.5) {
    const i = Math.floor(t), c = Math.floor(e), h = Math.floor(s);
    for (let d = -1; d <= 1; d++)
      for (let r = -1; r <= 1; r++)
        for (let m = -1; m <= 1; m++) {
          const b = this.getBlock(i + d, c + r, h + m);
          if (b && b !== "water") {
            const u = i + d + 0.5, f = c + r + 0.5, y = h + m + 0.5;
            if (Math.sqrt(
              (t - u) ** 2 + (e - f) ** 2 + (s - y) ** 2
            ) < o + 0.7) return !0;
          }
        }
    return !1;
  },
  // Check if area is clear for structure placement
  checkStructureCollision(t, e, s, o, i, c) {
    for (let h = 0; h < o; h++)
      for (let d = 0; d < i; d++)
        for (let r = 0; r < c; r++)
          if (this.getBlock(t + h, e + d, s + r))
            return !0;
    return !1;
  },
  // Find nearest clear spot for structure
  findClearSpot(t, e, s, o, i = 20) {
    for (let h = 0; h < i; h++)
      for (let d = 0; d < Math.PI * 2; d += Math.PI / 8) {
        const r = Math.floor(t + Math.cos(d) * h), m = Math.floor(e + Math.sin(d) * h), b = this.getGroundHeight(r, m);
        if (!this.checkStructureCollision(r, b, m, s, 10, o))
          return { x: r, y: b, z: m };
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
    return this.camera.sneaking ? this.camera.sneakHeight || 0.2 : this.camera.normalHeight || 0.6;
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
    const t = this.camera.x, e = this.camera.y, s = this.camera.z;
    this.seedCalmTimer || (this.seedCalmTimer = 0), this.seedCalmTimer > 0 && this.seedCalmTimer--;
    const o = this.seedCalmTimer > 0;
    this.birdPruneTimer || (this.birdPruneTimer = 0), this.birdPruneTimer++, this.birdPruneTimer >= 1800 && (this.birdPruneTimer = 0, this.pestBirds.length > 15 && (this.pestBirds.sort((i, c) => c.anger - i.anger), this.pestBirds = this.pestBirds.slice(0, 15)));
    for (const i of this.pestBirds) {
      i.rageMode && i.rageTimer && (i.rageTimer--, i.rageTimer <= 0 && (i.rageMode = !1, i.speed = 0.06)), this.wind && i.state !== "knockback" && (i.x += this.wind.x * 0.5, i.z += this.wind.z * 0.5), o && i.state !== "knockback" && (i.state = "retreating", i.stateTimer = Math.max(i.stateTimer, 60), i.anger = Math.max(0, i.anger - 0.01)), i.stateTimer--;
      const c = i.anger * 0.1;
      i.wingPhase += (i.state === "knockback" ? 0.8 : 0.5) + c, i.chirpTimer--;
      const h = 1 + i.anger * 0.3, d = 1 - i.anger * 0.1, r = 0.3 + i.anger * 0.15;
      if (i.state === "knockback") {
        const z = i.x, $ = i.y, q = i.z;
        i.x += i.vx, i.y += i.vy, i.z += i.vz;
        const R = this.getBlock(Math.floor(i.x), Math.floor(i.y), Math.floor(i.z));
        if (R && R !== "water" && R !== "lava")
          if (R.includes("Leaves") || R.includes("leaves"))
            i.vx *= 0.4, i.vy *= 0.4, i.vz *= 0.4, i.stateTimer = Math.min(i.stateTimer, 90), i.caughtInLeaves = !0;
          else {
            const Z = Math.floor(i.x), V = Math.floor(i.y), A = Math.floor(i.z);
            this.getBlock(Z, Math.floor($), Math.floor(q)) ? this.getBlock(Math.floor(z), V, Math.floor(q)) ? this.getBlock(Math.floor(z), Math.floor($), A) ? (i.vx *= -0.5, i.vy *= -0.5, i.vz *= -0.5, i.x = z, i.y = $, i.z = q) : (i.vz *= -0.7, i.z = q) : (i.vy *= -0.7, i.y = $) : (i.vx *= -0.7, i.x = z), this.particles.push({
              x: i.x,
              y: i.y,
              z: i.z,
              vx: (Math.random() - 0.5) * 0.1,
              vy: Math.random() * 0.1,
              vz: (Math.random() - 0.5) * 0.1,
              life: 20,
              type: "spark",
              size: 2
            });
          }
        i.caughtInLeaves ? (i.vx *= 0.9, i.vy *= 0.9, i.vz *= 0.9, i.vy += 0.01, Math.abs(i.vx) < 0.01 && Math.abs(i.vz) < 0.01 && (i.caughtInLeaves = !1)) : (i.vx *= 0.95, i.vy *= 0.95, i.vy -= 0.01, i.vz *= 0.95), i.knockbackSpin += 0.3;
        const H = Math.sqrt(i.vx * i.vx + i.vy * i.vy + i.vz * i.vz), X = 0.05 + i.anger * 0.02;
        if (H < X || i.stateTimer <= 0) {
          if (i.anger = Math.min(5, i.anger + 1), i.timesShot++, i.timesShot === i.spawnThreshold && this.pestBirds.length < 15) {
            const N = 2 + Math.floor(Math.random() * 2);
            for (let Z = 0; Z < N; Z++) {
              const V = Math.random() * Math.PI * 2, A = 3 + Math.random() * 2;
              this.pestBirds.push({
                x: this.camera.x + Math.cos(V) * A,
                y: this.camera.y + 1 + Math.random(),
                z: this.camera.z + Math.sin(V) * A,
                vx: 0,
                vy: 0,
                vz: 0,
                targetOffsetX: 0,
                targetOffsetY: 0,
                targetOffsetZ: 0,
                state: "circling",
                stateTimer: 20 + Math.random() * 30,
                angle: V,
                circleRadius: A,
                baseCircleRadius: A,
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
          i.state = "retreating", i.stateTimer = Math.max(30, 120 - i.anger * 20), i.circleRadius = (i.baseCircleRadius + 4) * d, i.vx = i.vy = i.vz = 0, i.knockbackSpin = 0, i.caughtInLeaves = !1;
        }
        continue;
      }
      switch (i.state) {
        case "circling":
          i.angle += i.circleSpeed * h, i.targetOffsetX = Math.cos(i.angle) * i.circleRadius * d, i.targetOffsetZ = Math.sin(i.angle) * i.circleRadius * d, i.targetOffsetY = 0.5 + Math.sin(i.angle * 2) * 0.3, i.circleRadius += (i.baseCircleRadius - i.circleRadius) * 0.01, i.stateTimer <= 0 && (Math.random() < r ? (i.state = "swooping", i.swoopProgress = 0, i.stateTimer = 60) : Math.random() < 0.2 ? (i.state = "hovering", i.stateTimer = Math.max(20, 40 - i.anger * 5) + Math.random() * 40) : i.stateTimer = Math.max(15, 30 - i.anger * 5) + Math.random() * 60);
          break;
        case "swooping":
          i.swoopProgress += 0.05 * h;
          const z = i.swoopProgress;
          if (z < 0.5)
            i.targetOffsetX = Math.cos(i.angle) * i.circleRadius * (1 - z * 2), i.targetOffsetZ = Math.sin(i.angle) * i.circleRadius * (1 - z * 2), i.targetOffsetY = 0.5 - z;
          else {
            const R = (z - 0.5) * 2;
            i.targetOffsetX = Math.cos(i.angle) * i.circleRadius * R, i.targetOffsetZ = Math.sin(i.angle) * i.circleRadius * R, i.targetOffsetY = -0.5 + R;
          }
          i.swoopProgress >= 1 && (i.state = "retreating", i.stateTimer = 30);
          break;
        case "retreating":
          i.angle += i.circleSpeed * 0.5;
          const $ = i.circleRadius + 2;
          i.targetOffsetX = Math.cos(i.angle) * $, i.targetOffsetZ = Math.sin(i.angle) * $, i.targetOffsetY = 1 + Math.sin(i.angle * 3) * 0.2, i.circleRadius += (i.baseCircleRadius - i.circleRadius) * 0.02, i.stateTimer <= 0 && (i.state = "circling", i.stateTimer = 60 + Math.random() * 60);
          break;
        case "hovering":
          const q = Math.sin(Date.now() * 0.01) * 0.3;
          i.targetOffsetX = Math.sin(this.camera.rotY + q) * -1.5, i.targetOffsetZ = Math.cos(this.camera.rotY + q) * -1.5, i.targetOffsetY = 0.2 + Math.sin(Date.now() * 0.02) * 0.1, i.stateTimer <= 0 && (i.state = "circling", i.stateTimer = 80 + Math.random() * 40);
          break;
      }
      const m = t + i.targetOffsetX, b = e + i.targetOffsetY, u = s + i.targetOffsetZ, f = i.state === "swooping" ? 0.15 : 0.08;
      let y = (m - i.x) * f, k = (b - i.y) * f, P = (u - i.z) * f;
      const B = i.rageMode ? 0.12 : 0.08, E = Math.sqrt(y * y + k * k + P * P);
      if (E > B) {
        const z = B / E;
        y *= z, k *= z, P *= z;
      }
      i.x += y, i.y += k, i.z += P;
    }
  },
  updateBirds() {
    for (const t of this.birds)
      if (t.swarmMode && t.swarmTimer && (t.swarmTimer--, t.swarmTimer <= 0 && (t.swarmMode = !1)), t.swarmMode) {
        const e = this.camera.x - t.x, s = this.camera.y - t.y, o = this.camera.z - t.z, i = Math.sqrt(e * e + s * s + o * o);
        if (i > 3) {
          const c = t.x + e / i * 0.15, h = t.y + s / i * 0.1, d = t.z + o / i * 0.15;
          this.checkBirdCollision(c, t.y, t.z, 0.3) ? t.x += o / i * 0.1 : t.x = c, this.checkBirdCollision(t.x, h, t.z, 0.3) || (t.y = h), this.checkBirdCollision(t.x, t.y, d, 0.3) ? t.z += e / i * 0.1 : t.z = d;
        } else
          t.angle += 0.1, t.x = this.camera.x + Math.cos(t.angle) * 3, t.z = this.camera.z + Math.sin(t.angle) * 3, t.y = this.camera.y + Math.sin(t.wobble) * 0.5;
        t.wobble += t.wobbleSpeed * 2, t.wingPhase += 0.5;
      } else {
        t.angle += t.speed, t.wobble += t.wobbleSpeed;
        const e = Math.sin(t.angle * 0.1) * 20, s = Math.cos(t.angle * 0.1) * 20;
        let o = e + Math.cos(t.angle) * t.radius, i = s + Math.sin(t.angle) * t.radius;
        this.wind && (o += this.wind.x * 15, i += this.wind.z * 15), t.x = o, t.z = i, t.y = t.baseY + Math.sin(t.wobble) * 2, t.wingPhase += 0.3;
      }
    this.updatePestBirds(), this.updateBlueBirds(), this.updateFish(), this.updateCats(), this.updateRepairNPC(), this.updateCreepers(), this.updateFriendlyBirdDrops(), this.updateBirdEventTimer();
  },
  // Blue birds - aggressive birds that knockback player
  updateBlueBirds() {
    this.blueBirds || (this.blueBirds = []);
    for (let t = this.blueBirds.length - 1; t >= 0; t--) {
      const e = this.blueBirds[t];
      e.wingPhase += 0.6, e.attackCooldown > 0 && e.attackCooldown--;
      const s = this.camera.x - e.x, o = this.camera.y - e.y, i = this.camera.z - e.z, c = Math.sqrt(s * s + o * o + i * i);
      c > 1.5 && (e.vx += s / c * 0.02, e.vy += o / c * 0.015, e.vz += i / c * 0.02);
      const h = e.x + e.vx, d = e.y + e.vy, r = e.z + e.vz;
      this.checkBirdCollision(h, e.y, e.z, 0.3) ? e.vx *= -0.5 : e.x = h, this.checkBirdCollision(e.x, d, e.z, 0.3) ? e.vy *= -0.5 : e.y = d, this.checkBirdCollision(e.x, e.y, r, 0.3) ? e.vz *= -0.5 : e.z = r, e.vx *= 0.9, e.vy *= 0.9, e.vz *= 0.9, c < 2 && e.attackCooldown <= 0 && (this.velocity.x += (this.camera.x - e.x) * 0.1, this.velocity.y += 0.15, this.velocity.z += (this.camera.z - e.z) * 0.1, e.attackCooldown = 60), c > 60 && this.blueBirds.splice(t, 1);
    }
  },
  // Fish in water
  updateFish() {
    this.fish || (this.fish = []);
    for (let t = this.fish.length - 1; t >= 0; t--) {
      const e = this.fish[t];
      e.swimPhase += 0.15, this.getBlock(Math.floor(e.x), Math.floor(e.y), Math.floor(e.z)) !== "water" ? e.vy -= 0.01 : (e.vx += (Math.random() - 0.5) * 0.01, e.vz += (Math.random() - 0.5) * 0.01, e.vy += (Math.random() - 0.5) * 5e-3), e.x += e.vx, e.y += e.vy, e.z += e.vz, e.vx *= 0.95, e.vy *= 0.95, e.vz *= 0.95;
      const o = Math.sqrt(e.vx * e.vx + e.vz * e.vz);
      o > 0.08 && (e.vx = e.vx / o * 0.08, e.vz = e.vz / o * 0.08);
    }
  },
  // Cats follow player
  updateCats() {
    this.cats || (this.cats = []);
    for (const t of this.cats) {
      t.walkPhase += 0.1, t.meowTimer--;
      const e = this.camera.x - t.x, s = this.camera.z - t.z, o = Math.sqrt(e * e + s * s);
      o > t.followDistance + 2 ? (t.state = "following", t.vx += e / o * 0.01, t.vz += s / o * 0.01) : o < t.followDistance && (t.state = "idle"), t.x += t.vx, t.z += t.vz, t.vx *= 0.85, t.vz *= 0.85, t.vy -= 0.02, t.y += t.vy;
      const i = Math.floor(t.y);
      this.getBlock(Math.floor(t.x), i, Math.floor(t.z)) && (t.y = i + 1, t.vy = 0), t.meowTimer <= 0 && (t.meowTimer = 200 + Math.random() * 400);
    }
  },
  // Update wandering repair NPC
  spawnRepairNPC() {
    if (this.repairNPC || !this.worldBounds) return;
    const t = this.worldBounds, e = t.minX + 10, s = t.maxX - 10, o = t.minZ + 10, i = t.maxZ - 10;
    let c = 0, h = 0, d = 0, r = !1;
    const m = 100;
    for (let u = 0; u < m; u++) {
      const f = Math.random() * Math.PI * 2, y = 15 + Math.random() * 10;
      let k = this.camera.x + Math.cos(f) * y, P = this.camera.z + Math.sin(f) * y;
      k = Math.max(e, Math.min(s, k)), P = Math.max(o, Math.min(i, P));
      const T = Math.floor(k), B = Math.floor(P);
      for (let E = 25; E >= 1; E--) {
        const z = this.getBlock(T, E, B);
        if (z === "grass" || z === "sand") {
          const $ = !this.getBlock(T, E + 1, B), q = !this.getBlock(T, E + 2, B), R = !this.getBlock(T, E + 3, B);
          if ($ && q && R) {
            c = k, h = E + 1, d = P, r = !0;
            break;
          }
        }
      }
      if (r) break;
    }
    if (!r) {
      this.debugLog("⚠️ Failed to find valid spawn location for gunsmith after 100 attempts", "warn");
      return;
    }
    this.repairNPC = {
      x: c,
      y: h,
      // Actual validated ground level + 1
      z: d,
      vx: 0,
      vy: 0,
      vz: 0,
      onGround: !0,
      // Already on ground
      wanderTargetX: c,
      wanderTargetZ: d,
      nextWanderTime: Date.now() + 3e3,
      showPrompt: !1,
      lastSpoke: 0
    };
    const b = this.getBlock(Math.floor(c), Math.floor(h - 1), Math.floor(d));
    this.debugLog("✨ A wandering gunsmith has appeared!", "success"), this.debugLog(`Spawned at (${c.toFixed(1)}, ${h}, ${d.toFixed(1)}) on ${b}`, "info");
  },
  updateRepairNPC() {
    if (!this.repairNPC) {
      Math.random() < 0.01 && this.spawnRepairNPC();
      return;
    }
    const t = this.repairNPC;
    if (this.worldBounds) {
      const o = this.worldBounds, i = o.minX + 3, c = o.maxX - 3, h = o.minZ + 3, d = o.maxZ - 3;
      t.x = Math.max(i, Math.min(c, t.x)), t.z = Math.max(h, Math.min(d, t.z)), t.wanderTargetX && (t.wanderTargetX < i || t.wanderTargetX > c || t.wanderTargetZ < h || t.wanderTargetZ > d) && (t.wanderTargetX = null);
    }
    t.vy -= 0.03, t.y += t.vy;
    const e = this.getGroundHeightBelow(t.x, t.z, t.y);
    if (t.y <= e ? (t.y = e, t.vy = 0, t.onGround = !0) : t.onGround = !1, Date.now() > t.nextWanderTime || !t.wanderTargetX) {
      const o = Math.random() * Math.PI * 2, i = 5 + Math.random() * 10;
      t.wanderTargetX = t.x + Math.cos(o) * i, t.wanderTargetZ = t.z + Math.sin(o) * i, t.nextWanderTime = Date.now() + (3e3 + Math.random() * 4e3);
    }
    if (t.wanderTargetX !== null) {
      const o = t.wanderTargetX - t.x, i = t.wanderTargetZ - t.z, c = Math.sqrt(o * o + i * i);
      c > 0.5 ? (t.vx = o / c * 0.04, t.vz = i / c * 0.04) : (t.vx = 0, t.vz = 0, t.wanderTargetX = null);
    }
    t.x += t.vx, t.z += t.vz;
    const s = Math.sqrt(
      (t.x - this.camera.x) ** 2 + (t.z - this.camera.z) ** 2
    );
    t.showPrompt = s < 3, s > 60 && (this.repairNPC = null, this.debugLog("The repair NPC wandered away...", "info"));
  },
  // Creepers stalk and explode
  updateCreepers() {
    this.creepers || (this.creepers = []);
    for (let t = this.creepers.length - 1; t >= 0; t--) {
      const e = this.creepers[t];
      e.walkPhase += 0.08;
      const s = this.camera.x - e.x, o = this.camera.z - e.z, i = Math.sqrt(s * s + o * o);
      if (e.state === "stalking")
        i > 2 ? (e.vx += s / i * 3e-3, e.vz += o / i * 3e-3) : (e.state = "fusing", e.fuseTimer = 0);
      else if (e.state === "fusing") {
        if (e.fuseTimer++, e.flashing = Math.floor(e.fuseTimer / 5) % 2 === 0, e.fuseTimer >= e.fuseMax) {
          this.creeperExplode(e), this.creepers.splice(t, 1);
          continue;
        }
        i > 4 && (e.state = "stalking", e.fuseTimer = 0);
      }
      e.x += e.vx, e.z += e.vz, e.vx *= 0.9, e.vz *= 0.9, e.vy -= 0.02, e.y += e.vy;
      const c = Math.floor(e.y);
      this.getBlock(Math.floor(e.x), c, Math.floor(e.z)) && (e.y = c + 1, e.vy = 0);
    }
  },
  // Creeper explosion
  creeperExplode(t) {
    const e = this.camera.x - t.x, s = this.camera.z - t.z, o = Math.sqrt(e * e + s * s);
    if (o < 6) {
      const i = (6 - o) / 6 * 1.5;
      this.velocity.x += e / o * i, this.velocity.y += 0.8, this.velocity.z += s / o * i;
    }
    for (let i = 0; i < 30; i++)
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
    for (let i = 0; i < 5; i++)
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
          let s = "seeds", o = 1 + Math.floor(Math.random() * 3);
          e < 0.05 ? (s = ["berdger", "omamori", "shimenawa"][Math.floor(Math.random() * 3)], o = 1) : e < 0.2 && (s = "apple", o = 1 + Math.floor(Math.random() * 2)), this.dropItem(
            t.x + (Math.random() - 0.5) * 2,
            t.y - 2,
            t.z + (Math.random() - 0.5) * 2,
            s,
            o
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
    const s = this.birdEvent.timer, o = this.birdEvent.events[this.birdEvent.currentEvent];
    s <= 5 * 60 * 1e3 && s > 4 * 60 * 1e3 && !this.birdEvent.alertShown.five && (this.showBirdAlert(`⚠️ In 5 minutes, ${o.description} ⚠️`), this.birdEvent.alertShown.five = !0), s <= 3 * 60 * 1e3 && s > 2 * 60 * 1e3 && !this.birdEvent.alertShown.three && (this.showBirdAlert(`⚠️ In 3 minutes, ${o.description} ⚠️`), this.birdEvent.alertShown.three = !0), s <= 1 * 60 * 1e3 && s > 50 * 1e3 && !this.birdEvent.alertShown.one && (this.showBirdAlert(`⚠️ In 1 minute, ${o.description} ⚠️`), this.birdEvent.alertShown.one = !0), s <= 30 * 1e3 && s > 20 * 1e3 && !this.birdEvent.alertShown.thirty && (this.showBirdAlert(`⚠️ In 30 seconds, ${o.description.toUpperCase()} ⚠️`), this.birdEvent.alertShown.thirty = !0), s <= 10 * 1e3 && s > 5 * 1e3 && !this.birdEvent.alertShown.ten && (this.showBirdAlert(`🔥 In 10 seconds, ${o.description.toUpperCase()} 🔥`), this.birdEvent.alertShown.ten = !0), s <= 0 && this.triggerBirdEvent();
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
      const e = Math.random() * Math.PI * 2, s = 10 + Math.random() * 20, o = this.spawnPestBird();
      o && (o.x = this.camera.x + Math.cos(e) * s, o.z = this.camera.z + Math.sin(e) * s, o.y = this.camera.y + 5 + Math.random() * 10);
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
    for (let s = 0; s < 50; s++) {
      const o = Math.floor(this.camera.x + (Math.random() - 0.5) * 40), i = Math.floor(this.camera.z + (Math.random() - 0.5) * 40);
      for (let c = 20; c >= 0; c--)
        if (this.getBlock(o, c, i) === "water") {
          t = { x: o + 0.5, y: c + 0.5, z: i + 0.5 };
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
    const t = document.getElementById("scoreDisplay"), e = document.getElementById("waveDisplay"), s = document.getElementById("objectiveDisplay");
    t && (t.textContent = `Score: ${this.survivalStats.score}`), e && (e.textContent = `Wave: ${this.survivalStats.wave}`), s && this.survivalStats.currentObjective && (s.textContent = `Objective: ${this.survivalStats.currentObjective.text}`);
  },
  // Generate Ritual Temple - only one per world
  generateRitualTemple(t, e, s) {
    this.ritualTempleLocation = { x: t, y: e, z: s };
    for (let r = 0; r < 11; r++)
      for (let m = 0; m < 11; m++)
        for (let b = 0; b < 10; b++)
          this.setBlock(t + r, e + b, s + m, null);
    for (let r = 0; r < 11; r++)
      for (let m = 0; m < 11; m++)
        this.setBlock(t + r, e, s + m, "ritualStone");
    for (let r = 1; r < 8; r++) {
      for (let m = 0; m < 11; m++)
        this.setBlock(t + m, e + r, s, "ritualStone"), this.setBlock(t + m, e + r, s + 11 - 1, "ritualStone");
      for (let m = 0; m < 11; m++)
        this.setBlock(t, e + r, s + m, "ritualStone"), this.setBlock(t + 11 - 1, e + r, s + m, "ritualStone");
    }
    this.setBlock(t + 11 / 2 | 0, e + 1, s, null), this.setBlock(t + 11 / 2 | 0, e + 2, s, null), this.setBlock(t + 11 / 2 | 0, e + 3, s, null);
    const h = t + 11 / 2 | 0, d = s + 11 / 2 | 0;
    this.setBlock(h, e + 1, d, "charmSocket"), this.setBlock(h - 2, e + 1, d, "petalSocket"), this.setBlock(h + 2, e + 1, d, "ropeSocket"), this.setBlock(h, e + 1, d - 2, "plaqueSocket"), this.setBlock(h, e + 1, d + 2, "incenseSocket");
    for (let r = 1; r <= 4; r++)
      this.setBlock(t + 2, e + r, s + 2, "glowstone"), this.setBlock(t + 11 - 3, e + r, s + 2, "glowstone"), this.setBlock(t + 2, e + r, s + 11 - 3, "glowstone"), this.setBlock(t + 11 - 3, e + r, s + 11 - 3, "glowstone");
  },
  // Generate apple tree with green leaves and chance to drop apples
  generateTree(t, e, s) {
    for (let o = 0; o < 4; o++)
      this.setBlock(t, e + o, s, "wood");
    for (let o = -2; o <= 2; o++)
      for (let i = -2; i <= 2; i++)
        for (let c = 3; c <= 5; c++)
          Math.abs(o) + Math.abs(i) + Math.abs(c - 4) < 4 && (o === 0 && i === 0 && c < 4 || this.setBlock(t + o, e + c, s + i, "appleLeaves"));
    this.appleTrees || (this.appleTrees = []), this.appleTrees.push({ x: t, y: e + 4, z: s });
  },
  // Generate cherry blossom tree (larger, more dramatic)
  generateCherryTree(t, e, s) {
    for (let o = 0; o < 6; o++)
      this.setBlock(t, e + o, s, "cherryWood");
    for (let o = -3; o <= 3; o++)
      for (let i = -3; i <= 3; i++)
        for (let c = 4; c <= 8; c++)
          Math.abs(o) + Math.abs(i) + Math.abs(c - 6) < 5 && Math.random() > 0.15 && (o === 0 && i === 0 && c < 5 || this.setBlock(t + o, e + c, s + i, "cherryLeaves"));
    this.cherryTrees.push({ x: t, y: e + 6, z: s });
  },
  setBlock(t, e, s, o) {
    const i = `${t},${e},${s}`;
    o === null ? delete this.world[i] : this.world[i] = o;
  },
  getBlock(t, e, s) {
    return this.world[`${t},${e},${s}`] || null;
  },
  setupControls() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault(), this.toggleDebugConsole();
        return;
      }
      if (!this.isActive || this.debugConsoleOpen) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "w" && (e.preventDefault(), e.stopPropagation()), e.key === "Escape") {
        if (e.preventDefault(), this.dialogueOpen) {
          this.closeDialogue();
          return;
        }
        if (this.journalOpen) {
          this.toggleJournal();
          return;
        }
        if (this.inventoryOpen) {
          this.toggleInventory();
          return;
        }
        this.isPaused ? this.resume() : this.pause();
        return;
      }
      if (this.isPaused) return;
      this.keys[e.key.toLowerCase()] = !0;
      const o = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(e.key);
      if (o !== -1) {
        this.selectedSlot = o;
        const i = this.inventory.hotbar[o];
        i && (i.type === "block" ? (this.selectedBlock = i.id, this.selectedItem = null) : i.type === "weapon" && (this.selectedItem = i.id, this.selectedBlock = null)), this.updateHotbar();
      }
      if (e.key.toLowerCase() === "e") {
        if (this.repairNPC && Math.sqrt(
          (this.repairNPC.x - this.camera.x) ** 2 + (this.repairNPC.z - this.camera.z) ** 2
        ) < 3) {
          this.openDialogue("gunsmith");
          return;
        }
        this.toggleInventory();
      }
      e.key.toLowerCase() === "j" && !e.repeat && this.toggleJournal(), e.key.toLowerCase() === "c" && !e.repeat && this.toggleSneak(), e.key === "Control" && !e.repeat && (this.camera.sneaking || (this.toggleSneak(), this.camera.sneakingWithCtrl = !0)), e.key.toLowerCase() === "q" && this.dropHeldItem(), e.key.toLowerCase() === "r" && this.checkRitual() && console.log("Omamori Ritual Complete! Birds are blessed and calmed."), e.preventDefault();
    }), document.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = !1, e.key === "Control" && this.camera.sneakingWithCtrl && (this.camera.sneakingWithCtrl = !1, this.camera.sneaking && this.toggleSneak());
    }), this.pointerLocked = !1, document.addEventListener("pointerlockchange", () => {
      this.pointerLocked = document.pointerLockElement === this.canvas, this.pointerLocked ? document.getElementById("clickToPlay").classList.remove("active") : this.isActive && !this.isPaused && !this.inventoryOpen && !this.debugConsoleOpen && !this.dialogueOpen && !this.journalOpen && !this.justClosedInventory && this.pause();
    }), document.addEventListener("pointerlockerror", () => {
      console.log("Pointer lock failed"), this.isActive && !this.isPaused && document.getElementById("clickToPlay").classList.add("active");
    }), this.canvas.addEventListener("mousedown", (e) => {
      if (!(!this.isActive || this.isPaused) && !this.debugConsoleOpen && !this.inventoryOpen) {
        if (!this.pointerLocked) {
          this.canvas.requestPointerLock();
          return;
        }
        if (e.button === 0) {
          const s = this.raycast();
          if (s && s.hit) {
            const o = this.getBlock(s.hit.x, s.hit.y, s.hit.z);
            if (o === "water" || o === "lava")
              return;
            const i = (h) => h && (h === "chest" || h === "ritualChest" || h === "buildingChest" || h.toLowerCase().includes("chest"));
            if (((h) => h && h.includes("Socket"))(o))
              return;
            if (this.setBlock(s.hit.x, s.hit.y, s.hit.z, null), this.stats.blocksBroken++, this.survivalStats && (this.survivalStats.score += 1, this.updateSurvivalHUD()), o && !i(o))
              o === "appleLeaves" ? (this.dropItem(s.hit.x + 0.5, s.hit.y + 0.5, s.hit.z + 0.5, "appleLeaves", 1), Math.random() < 0.15 && this.dropItem(s.hit.x + 0.5, s.hit.y + 0.5, s.hit.z + 0.5, "apple", 1)) : o === "cherryLeaves" ? (this.dropItem(s.hit.x + 0.5, s.hit.y + 0.5, s.hit.z + 0.5, "cherryLeaves", 1), Math.random() < 0.1 && this.dropItem(s.hit.x + 0.5, s.hit.y + 0.5, s.hit.z + 0.5, "sakuraPetal", 1)) : this.dropItem(s.hit.x + 0.5, s.hit.y + 0.5, s.hit.z + 0.5, o, 1);
            else if (i(o)) {
              const h = `${s.hit.x},${s.hit.y},${s.hit.z}`, d = this.chestContents && this.chestContents[h];
              if (d && Array.isArray(d)) {
                for (const r of d)
                  r && r.type && this.dropItem(s.hit.x + 0.5, s.hit.y + 0.5, s.hit.z + 0.5, r.type, r.count || 1);
                delete this.chestContents[h];
              }
              this.dropItem(s.hit.x + 0.5, s.hit.y + 0.5, s.hit.z + 0.5, "chest", 1);
            }
          }
        } else if (e.button === 2) {
          const s = this.raycast();
          if (s && s.hit) {
            const c = this.getBlock(s.hit.x, s.hit.y, s.hit.z);
            if (c && (c === "chest" || c === "ritualChest" || c === "buildingChest" || c.toLowerCase().includes("chest"))) {
              this.openChest(s.hit.x, s.hit.y, s.hit.z);
              return;
            }
            if (c && c.includes("Socket")) {
              this.interactWithSocket(s.hit.x, s.hit.y, s.hit.z, c);
              return;
            }
          }
          const o = this.inventory.hotbar[this.selectedSlot], i = o ? o.id : null;
          if (this.selectedItem === "ka69")
            this.shootAK47();
          else if (i === "berdger")
            this.shootBerdger();
          else if (i === "apple")
            this.throwApple();
          else if (i === "seeds")
            this.useSeeds();
          else if (this.selectedItem === "water_bucket" || this.selectedItem === "lava_bucket") {
            const c = this.raycast();
            if (c && c.place) {
              const h = this.selectedItem === "water_bucket" ? "water" : "lava", d = c.place, r = Math.floor(this.camera.x), m = Math.floor(this.camera.z), b = Math.floor(this.camera.y - this.playerEyeHeight), u = Math.floor(this.camera.y - this.playerEyeHeight + this.playerHeight);
              let f = !1;
              for (let y = b; y <= u; y++)
                if (r === d.x && y === d.y && m === d.z) {
                  f = !0;
                  break;
                }
              if (!f) {
                this.setBlock(d.x, d.y, d.z, h), this.setFluidLevel(d.x, d.y, d.z, 8), this.fluidUpdates.push({
                  x: d.x,
                  y: d.y,
                  z: d.z,
                  type: h,
                  level: 8
                  // Source block has max level
                });
                const y = this.inventory.hotbar[this.selectedSlot];
                y && y.count > 1 ? y.count-- : (this.inventory.hotbar[this.selectedSlot] = null, this.selectedItem = null), this.updateHotbar();
              }
            }
          } else if (this.selectedBlock) {
            const c = this.raycast();
            if (c && c.place) {
              const h = c.place, d = this.getBlock(h.x, h.y, h.z);
              if (d && d !== "water" && d !== "lava")
                return;
              const r = Math.floor(this.camera.x), m = Math.floor(this.camera.z), b = Math.floor(this.camera.y - this.playerEyeHeight), u = Math.floor(this.camera.y - this.playerEyeHeight + this.playerHeight);
              let f = !1;
              for (let y = b; y <= u; y++)
                if (r === h.x && y === h.y && m === h.z) {
                  f = !0;
                  break;
                }
              if (!f) {
                this.setBlock(h.x, h.y, h.z, this.selectedBlock), this.stats.blocksPlaced++;
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
      if (!this.isActive || this.isPaused || this.inventoryOpen || this.debugConsoleOpen) return;
      e.preventDefault(), e.deltaY > 0 ? this.selectedSlot = (this.selectedSlot + 1) % 9 : e.deltaY < 0 && (this.selectedSlot = (this.selectedSlot + 8) % 9);
      const s = this.inventory.hotbar[this.selectedSlot];
      if (s) {
        s.type === "block" ? (this.selectedBlock = s.id, this.selectedItem = null) : s.type === "weapon" ? (this.selectedItem = s.id, this.selectedBlock = null) : s.type === "bucket" && (this.selectedItem = s.id, this.selectedBlock = null);
        const o = {
          grass: "Grass Block",
          dirt: "Dirt",
          stone: "Stone",
          wood: "Wood",
          leaves: "Leaves",
          water: "Water",
          sand: "Sand",
          brick: "Brick",
          ka69: "KA-69",
          water_bucket: "Water Bucket",
          lava_bucket: "Lava Bucket",
          seed: "Seed",
          berdger: "Berdger",
          cherry_wood: "Cherry Wood",
          cherry_leaves: "Cherry Leaves",
          glowstone: "Glowstone",
          ritual_item: "Omamori Charm",
          lava: "Lava",
          ice: "Ice"
        }, i = s.id || s.type, c = o[i] || i;
        this.hotbarTooltip.text = c, this.hotbarTooltip.visible = !0, this.hotbarTooltip.timestamp = Date.now(), setTimeout(() => {
          Date.now() - this.hotbarTooltip.timestamp >= 1500 && (this.hotbarTooltip.visible = !1);
        }, 1500);
      } else
        this.selectedBlock = null, this.selectedItem = null;
      this.updateHotbar();
    }, { passive: !1 }), document.getElementById("minecraftGame").addEventListener("wheel", (e) => {
      this.isActive && !this.debugConsoleOpen && !this.inventoryOpen && (e.preventDefault(), e.stopPropagation());
    }, { passive: !1 }), document.addEventListener("mousemove", (e) => {
      !this.isActive || this.isPaused || !this.pointerLocked || this.debugConsoleOpen || (this.camera.rotY -= e.movementX * 3e-3, this.camera.rotX = Math.max(-1.5, Math.min(1.5, this.camera.rotX + e.movementY * 3e-3)));
    }), document.addEventListener("visibilitychange", () => {
      document.hidden && this.isActive && !this.isPaused && this.pause();
    }), window.addEventListener("resize", () => {
      (document.fullscreenElement || document.webkitFullscreenElement) && this.isActive && (this.canvas.width = window.innerWidth, this.canvas.height = window.innerHeight);
    }), document.querySelectorAll(".hotbar-slot").forEach((e, s) => {
      e.addEventListener("click", (o) => {
        o.stopPropagation(), this.selectedSlot = s;
        const i = this.inventory.hotbar[s];
        i && (i.type === "block" ? (this.selectedBlock = i.id, this.selectedItem = null) : i.type === "weapon" && (this.selectedItem = i.id, this.selectedBlock = null)), this.updateHotbar();
      });
    });
  },
  setupMenus() {
    document.getElementById("btnResume").addEventListener("click", () => this.resume()), document.getElementById("btnFullscreen").addEventListener("click", (t) => {
      t.preventDefault();
      const e = document.getElementById("minecraftGame");
      document.fullscreenElement || document.webkitFullscreenElement ? document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen && document.webkitExitFullscreen() : e.requestFullscreen ? e.requestFullscreen().catch((o) => console.log("Fullscreen error:", o)) : e.webkitRequestFullscreen && e.webkitRequestFullscreen(), this.resume();
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
        const s = e.target, o = s.dataset.on === "true";
        s.dataset.on = (!o).toString(), s.classList.toggle("on", !o), t === "optShadows" && (this.settings.shadows = !o), t === "optLighting" && (this.settings.lighting = !o), t === "optAA" && (this.settings.antialiasing = !o, this.canvas.style.imageRendering = o ? "auto" : "pixelated"), t === "optShowFps" && (this.settings.showFps = !o);
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
    const t = Math.floor((Date.now() - this.stats.startTime) / 1e3), e = Math.floor(t / 60), s = t % 60;
    document.getElementById("statTime").textContent = `${e}:${s.toString().padStart(2, "0")}`;
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
    document.querySelectorAll(".hotbar-slot").forEach((e, s) => {
      const o = s === this.selectedSlot;
      e.classList.toggle("selected", o);
    });
  },
  // Update hotbar display with item counts and icons
  updateHotbarDisplay() {
    document.querySelectorAll(".hotbar-slot").forEach((e, s) => {
      const o = this.inventory.hotbar[s], i = s === this.selectedSlot;
      e.classList.toggle("selected", i), o && o.count ? e.setAttribute("data-count", o.count) : e.setAttribute("data-count", "");
      let c = e.querySelector("canvas");
      if (c || (c = document.createElement("canvas"), c.width = 32, c.height = 32, c.style.width = "100%", c.style.height = "100%", c.style.position = "absolute", c.style.top = "2px", c.style.left = "2px", e.appendChild(c)), o) {
        this.drawMiniBlock(c, o.id);
        let h = e.querySelector(".durability-bar");
        if (o.durability !== void 0 && o.maxDurability) {
          h || (h = document.createElement("div"), h.className = "durability-bar", h.innerHTML = '<div class="durability-fill"></div>', e.appendChild(h));
          const d = h.querySelector(".durability-fill"), r = o.durability / o.maxDurability * 100;
          d.style.width = r + "%", d.style.backgroundColor = r > 50 ? "#4a4" : r > 25 ? "#aa4" : "#a44", h.style.display = "block";
        } else h && (h.style.display = "none");
      } else {
        c.getContext("2d").clearRect(0, 0, c.width, c.height);
        const d = e.querySelector(".durability-bar");
        d && (d.style.display = "none");
      }
    });
  },
  // Shoot the KA-69
  shootAK47() {
    if (this.shootCooldown > 0) return;
    const t = this.inventory.hotbar[this.selectedSlot];
    if (t && t.id === "ka69") {
      if (t.durability !== void 0 && t.durability <= 0) {
        this.debugLog("KA-69 is broken! Find the Repair NPC to fix it (15 seeds)", "warn");
        return;
      }
      t.durability !== void 0 && (t.durability--, t.durability <= 0 && (t.durability = 0, this.debugLog("Your KA-69 broke! Find the Repair NPC (trade 15 seeds)", "error")), this.updateHotbarDisplay());
    }
    this.shootCooldown = 8, this.muzzleFlash = 5;
    const e = this.camera.rotX, s = this.camera.rotY, o = -Math.sin(s) * Math.cos(e), i = -Math.sin(e), c = Math.cos(s) * Math.cos(e), h = 2.5, d = {
      x: this.camera.x + o * 0.5,
      y: this.camera.y + i * 0.5,
      z: this.camera.z + c * 0.5,
      vx: o * h,
      vy: i * h,
      vz: c * h,
      life: 60,
      type: "bullet",
      trail: []
    };
    this.particles.push(d);
    const r = 0.8;
    let m = null, b = 1 / 0;
    for (const u of this.pestBirds) {
      const f = u.x - this.camera.x, y = u.y - this.camera.y, k = u.z - this.camera.z, P = Math.sqrt(f * f + y * y + k * k);
      if (P < 15 && P < b) {
        const T = f / P, B = y / P, E = k / P;
        o * T + i * B + c * E > 0.9 && (m = u, b = P);
      }
    }
    if (m) {
      m.vx = o * r + (Math.random() - 0.5) * 0.2, m.vy = i * r + 0.3 + Math.random() * 0.2, m.vz = c * r + (Math.random() - 0.5) * 0.2, m.state = "knockback", m.stateTimer = 90;
      for (let B = 0; B < 8; B++) {
        const E = 0.15 + Math.random() * 0.2, z = -o * 0.5 + (Math.random() - 0.5) * 1.5, $ = Math.random() * 0.8 + 0.2, q = -c * 0.5 + (Math.random() - 0.5) * 1.5, R = Math.sqrt(z * z + $ * $ + q * q);
        this.particles.push({
          x: m.x,
          y: m.y,
          z: m.z,
          vx: z / R * E,
          vy: $ / R * E,
          vz: q / R * E,
          life: 25 + Math.random() * 20,
          type: "ricochet",
          size: 2 + Math.random() * 3
        });
      }
      for (let B = 0; B < 5; B++)
        this.particles.push({
          x: m.x + (Math.random() - 0.5) * 0.3,
          y: m.y + (Math.random() - 0.5) * 0.3,
          z: m.z + (Math.random() - 0.5) * 0.3,
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
      const f = m.x - this.camera.x, y = m.z - this.camera.z, k = Math.sqrt(f * f + y * y);
      k > 0.1 && (this.camera.x -= f / k * u * 0.3 + (Math.random() - 0.5) * u, this.camera.z -= y / k * u * 0.3 + (Math.random() - 0.5) * u);
      const P = Math.random();
      let T = 0;
      P < 0.01 ? T = 20 : P < 0.1 && (T = 5);
      for (let B = 0; B < T; B++) {
        const E = Math.random() * Math.PI * 2, z = 2 + Math.random() * 3;
        this.pestBirds.push({
          x: m.x + Math.cos(E) * z,
          y: m.y + (Math.random() - 0.5) * 2,
          z: m.z + Math.sin(E) * z,
          vx: 0,
          vy: 0,
          vz: 0,
          targetOffsetX: 0,
          targetOffsetY: 0,
          targetOffsetZ: 0,
          state: "circling",
          stateTimer: 10 + Math.random() * 20,
          angle: E,
          circleRadius: z,
          baseCircleRadius: z,
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
      const f = u.x - this.camera.x, y = u.y - this.camera.y, k = u.z - this.camera.z, P = Math.sqrt(f * f + y * y + k * k);
      if (P < 25) {
        const T = f / P, B = y / P, E = k / P;
        if (o * T + i * B + c * E > 0.85) {
          u.radius += 8, u.baseY += 5;
          for (let $ = 0; $ < 5; $++)
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
        const s = Math.floor(e.x), o = Math.floor(e.y), i = Math.floor(e.z);
        if (this.getBlock(s, o, i)) {
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
        for (const s of this.pestBirds) {
          const o = s.x - e.x, i = s.y - e.y, c = s.z - e.z, h = Math.sqrt(o * o + i * i + c * c);
          if (h < 1.5) {
            s.vx = e.vx * 0.5 + o / h * 2.5, s.vy = Math.abs(e.vy) + 0.5, s.vz = e.vz * 0.5 + c / h * 2.5, s.state = "knockback", s.stateTimer = 120, s.anger = Math.min(5, s.anger + 2), e.life = 0;
            for (let r = 0; r < 8; r++)
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
        for (const o of this.pestBirds) {
          const i = o.x - e.x, c = o.y - e.y, h = o.z - e.z, d = Math.sqrt(i * i + c * c + h * h);
          if (d < 1.5) {
            o.vx = e.vx * 0.5 + i / d * 3, o.vy = 0.8, o.vz = e.vz * 0.5 + h / d * 3, o.state = "knockback", o.stateTimer = 180, o.anger = Math.max(0, o.anger - 0.5), e.life = 0, this.survivalStats && (this.survivalStats.score += 50, this.updateSurvivalHUD());
            for (let m = 0; m < 6; m++)
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
        for (const o of this.birds)
          if (o.swarmMode) {
            const i = o.x - e.x, c = o.y - e.y, h = o.z - e.z;
            Math.sqrt(i * i + c * c + h * h) < 2 && (o.swarmMode = !1, o.swarmTimer = 0, e.life = 0, this.survivalStats && (this.survivalStats.score += 25, this.updateSurvivalHUD()));
          }
        const s = this.getGroundHeightBelow(e.x, e.z, e.y + 10);
        e.y <= s + 0.5 && (e.life = 0);
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
    const t = this.particles.filter((o) => o.type === "petal").length, e = 150, s = Math.min(5, e - t);
    for (let o = 0; o < s; o++) {
      if (Math.random() > 0.6) continue;
      const i = this.cherryTrees[Math.floor(Math.random() * this.cherryTrees.length)], c = Math.sqrt((i.x - this.camera.x) ** 2 + (i.z - this.camera.z) ** 2), h = 40;
      if (c < h) {
        const d = 1 - c / h * 0.5;
        if (Math.random() < d) {
          const r = (Math.random() - 0.5) * 10, m = (Math.random() - 0.5) * 10, b = Math.random() < 0.3 ? Math.random() * 8 : 0;
          this.particles.push({
            x: i.x + r,
            y: i.y + Math.random() * 3 + b,
            z: i.z + m,
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
      const o = Math.random() * Math.PI * 2, i = 10 + Math.random() * 20;
      this.particles.push({
        x: this.camera.x + Math.cos(o) * i,
        y: this.camera.y + 5 + Math.random() * 10,
        z: this.camera.z + Math.sin(o) * i,
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
  dropItem(t, e, s, o, i) {
    this.droppedItems || (this.droppedItems = []), this.droppedItems.push({
      x: t + (Math.random() - 0.5) * 0.3,
      y: e,
      z: s + (Math.random() - 0.5) * 0.3,
      vy: 0.1 + Math.random() * 0.05,
      type: o,
      count: i,
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
        const s = this.getGroundHeightBelow(e.x, e.z, e.y + 5) + 1.3;
        if (e.y < s && (e.y = s, e.vy = 0), e.bobPhase += 0.05, e.pickupDelay <= 0) {
          const o = e.x - this.camera.x, i = e.y - this.camera.y, c = e.z - this.camera.z;
          Math.sqrt(o * o + i * i + c * c) < 2 && this.addToInventory(e.type, e.count) && this.droppedItems.splice(t, 1);
        }
      }
  },
  // Add item to inventory (hotbar first, then main inventory)
  addToInventory(t, e) {
    let s = "block";
    (t === "ka69" || t === "berdger") && (s = "weapon"), (t === "water_bucket" || t === "lava_bucket") && (s = "bucket"), this.ritualItems && this.ritualItems.includes(t) && (s = "item"), (t === "seeds" || t === "apple") && (s = "item"), this.showPickupNotification(t, e);
    for (let o = 0; o < 9; o++) {
      const i = this.inventory.hotbar[o];
      if (i && (i.id === t || i.type === t) && i.count < 64) {
        const c = Math.min(e, 64 - i.count);
        if (i.count += c, e -= c, e <= 0)
          return this.updateHotbarDisplay(), !0;
      }
    }
    for (let o = 0; o < 27; o++) {
      const i = this.inventory.main[o];
      if (i && (i.id === t || i.type === t) && i.count < 64) {
        const c = Math.min(e, 64 - i.count);
        if (i.count += c, e -= c, e <= 0)
          return this.updateHotbarDisplay(), !0;
      }
    }
    for (let o = 0; o < 9; o++)
      if (!this.inventory.hotbar[o]) {
        const i = this.itemTypes[t] || {};
        return this.inventory.hotbar[o] = {
          type: s,
          id: t,
          count: e,
          durability: i.durability,
          maxDurability: i.maxDurability
        }, this.updateHotbarDisplay(), !0;
      }
    for (let o = 0; o < 27; o++)
      if (!this.inventory.main[o]) {
        const i = this.itemTypes[t] || {};
        return this.inventory.main[o] = {
          type: s,
          id: t,
          count: e,
          durability: i.durability,
          maxDurability: i.maxDurability
        }, this.updateHotbarDisplay(), !0;
      }
    return !1;
  },
  // Show pickup notification (uses batch queue for multiple pickups)
  showPickupNotification(t, e) {
    if (e < 0) {
      const s = document.getElementById("pickupNotification");
      if (!s) return;
      const o = {
        grass: "Grass Block",
        dirt: "Dirt",
        stone: "Stone",
        wood: "Wood",
        appleLeaves: "Apple Leaves",
        leaves: "Leaves",
        sand: "Sand",
        brick: "Brick",
        ka69: "KA-69",
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
      }, i = document.createElement("div");
      i.className = "pickup-item", i.style.borderColor = "rgba(255, 50, 50, 0.8)", i.innerHTML = `
                        <span class="pickup-icon">💔</span>
                        <span style="color:#ff6666">${o[t] || t} broke!</span>
                    `, s.appendChild(i), setTimeout(() => {
        i.parentNode && i.parentNode.removeChild(i);
      }, 2e3);
      return;
    }
    this.queuePickupNotification(t, e);
  },
  // Draw a mini 3D block for inventory display
  drawMiniBlock(t, e) {
    const s = t.getContext("2d"), o = this.blockColors[e], i = t.width, c = t.height;
    s.clearRect(0, 0, i, c);
    const h = i / 2, d = c / 2, r = Math.min(i, c) * 0.35;
    if (!o) {
      if (s.save(), s.translate(h, d), e === "apple")
        s.fillStyle = "#dc143c", s.beginPath(), s.arc(0, 0, r * 0.7, 0, Math.PI * 2), s.fill(), s.fillStyle = "rgba(255,255,255,0.3)", s.beginPath(), s.arc(-r * 0.2, -r * 0.2, r * 0.25, 0, Math.PI * 2), s.fill(), s.fillStyle = "#654321", s.fillRect(-1, -r * 0.8, 3, r * 0.3), s.fillStyle = "#228b22", s.beginPath(), s.ellipse(3, -r * 0.7, 4, 2, 0.3, 0, Math.PI * 2), s.fill();
      else if (e === "seeds") {
        s.fillStyle = "#daa520";
        for (let y = 0; y < 5; y++) {
          const k = y / 5 * Math.PI * 2, P = Math.cos(k) * r * 0.4, T = Math.sin(k) * r * 0.3;
          s.beginPath(), s.ellipse(P, T, 3, 5, k, 0, Math.PI * 2), s.fill();
        }
      } else e === "ka69" ? (s.fillStyle = "#333", s.fillRect(-r * 0.6, -r * 0.1, r * 1.2, r * 0.25), s.fillStyle = "#8b4513", s.fillRect(-r * 0.3, r * 0.1, r * 0.4, r * 0.4), s.fillStyle = "#222", s.fillRect(r * 0.1, r * 0.1, r * 0.15, r * 0.35)) : e === "berdger" ? (s.fillStyle = "#daa520", s.beginPath(), s.ellipse(0, -r * 0.3, r * 0.5, r * 0.25, 0, 0, Math.PI * 2), s.fill(), s.fillStyle = "#8b4513", s.fillRect(-r * 0.4, -r * 0.15, r * 0.8, r * 0.2), s.fillStyle = "#228b22", s.fillRect(-r * 0.35, -r * 0.05, r * 0.7, r * 0.1), s.fillStyle = "#daa520", s.beginPath(), s.ellipse(0, r * 0.2, r * 0.55, r * 0.3, 0, 0, Math.PI * 2), s.fill()) : e === "water_bucket" || e === "lava_bucket" ? (s.fillStyle = "#888", s.beginPath(), s.moveTo(-r * 0.4, -r * 0.3), s.lineTo(r * 0.4, -r * 0.3), s.lineTo(r * 0.3, r * 0.5), s.lineTo(-r * 0.3, r * 0.5), s.closePath(), s.fill(), s.fillStyle = e === "water_bucket" ? "#4a90d9" : "#ff6600", s.beginPath(), s.moveTo(-r * 0.3, -r * 0.1), s.lineTo(r * 0.3, -r * 0.1), s.lineTo(r * 0.25, r * 0.4), s.lineTo(-r * 0.25, r * 0.4), s.closePath(), s.fill()) : e === "sakuraPetal" ? (s.fillStyle = "#ffb7c5", s.beginPath(), s.ellipse(0, 0, r * 0.6, r * 0.3, 0.3, 0, Math.PI * 2), s.fill()) : e === "shimenawa" ? (s.strokeStyle = "#daa520", s.lineWidth = 4, s.beginPath(), s.moveTo(-r * 0.5, 0), s.quadraticCurveTo(0, -r * 0.4, r * 0.5, 0), s.stroke()) : e === "omamori" ? (s.fillStyle = "#cc0000", s.fillRect(-r * 0.3, -r * 0.5, r * 0.6, r), s.fillStyle = "#ffd700", s.fillRect(-r * 0.25, -r * 0.35, r * 0.5, r * 0.15)) : e === "ema" ? (s.fillStyle = "#deb887", s.beginPath(), s.moveTo(0, -r * 0.5), s.lineTo(r * 0.4, -r * 0.2), s.lineTo(r * 0.4, r * 0.4), s.lineTo(-r * 0.4, r * 0.4), s.lineTo(-r * 0.4, -r * 0.2), s.closePath(), s.fill()) : e === "incense" ? (s.fillStyle = "#8b4513", s.fillRect(-1, -r * 0.6, 3, r * 1.2), s.fillStyle = "#ff6600", s.beginPath(), s.arc(0.5, -r * 0.6, 3, 0, Math.PI * 2), s.fill()) : (s.fillStyle = "#888", s.fillRect(-r * 0.4, -r * 0.4, r * 0.8, r * 0.8), s.fillStyle = "#444", s.font = "8px monospace", s.textAlign = "center", s.fillText("?", 0, 3));
      s.restore();
      return;
    }
    const m = Math.min(i, c) * 0.25;
    let b = o.top, u = o.side;
    typeof b == "string" && b.includes("rgba") && (b = b.replace(/[\d.]+\)$/, "1)"), u = u.replace(/[\d.]+\)$/, "1)")), s.fillStyle = b, s.beginPath(), s.moveTo(h, d - m), s.lineTo(h + m, d - m / 2), s.lineTo(h, d), s.lineTo(h - m, d - m / 2), s.closePath(), s.fill(), s.fillStyle = u, s.beginPath(), s.moveTo(h - m, d - m / 2), s.lineTo(h, d), s.lineTo(h, d + m), s.lineTo(h - m, d + m / 2), s.closePath(), s.fill();
    let f;
    try {
      f = this.darkenColor(u.replace(/rgba?\([^)]+\)/, "#888888"), 0.7);
    } catch {
      f = this.darkenColor(u, 0.7);
    }
    s.fillStyle = f, s.beginPath(), s.moveTo(h, d), s.lineTo(h + m, d - m / 2), s.lineTo(h + m, d + m / 2), s.lineTo(h, d + m), s.closePath(), s.fill(), s.strokeStyle = "rgba(0,0,0,0.3)", s.lineWidth = 0.5, s.beginPath(), s.moveTo(h, d - r), s.lineTo(h + r, d - r / 2), s.lineTo(h + r, d + r / 2), s.lineTo(h, d + r), s.lineTo(h - r, d + r / 2), s.lineTo(h - r, d - r / 2), s.closePath(), s.stroke();
  },
  // Draw 3D item for dropped items in the world
  drawDroppedItem3D(t, e, s, o, i, c) {
    const h = this.blockColors[i], d = (c || 0) * 0.5;
    if (t.save(), t.translate(e, s), !h) {
      if (i === "apple")
        t.fillStyle = "#dc143c", t.beginPath(), t.arc(0, 0, o * 0.8, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(255,255,255,0.3)", t.beginPath(), t.arc(-o * 0.2, -o * 0.2, o * 0.3, 0, Math.PI * 2), t.fill(), t.fillStyle = "#654321", t.fillRect(-1, -o * 0.9, 2, o * 0.3), t.fillStyle = "#228b22", t.beginPath(), t.ellipse(2, -o * 0.8, 3, 2, 0.3, 0, Math.PI * 2), t.fill();
      else if (i === "seeds") {
        t.fillStyle = "#daa520";
        for (let m = 0; m < 5; m++) {
          const b = m / 5 * Math.PI * 2 + d, u = Math.cos(b) * o * 0.4, f = Math.sin(b) * o * 0.3;
          t.beginPath(), t.ellipse(u, f, o * 0.2, o * 0.1, b, 0, Math.PI * 2), t.fill();
        }
      } else i === "ka69" ? (t.fillStyle = "#333", t.fillRect(-o * 0.8, -o * 0.15, o * 1.6, o * 0.3), t.fillRect(-o * 0.3, -o * 0.15, o * 0.15, o * 0.5), t.fillRect(o * 0.3, -o * 0.4, o * 0.5, o * 0.25)) : i === "berdger" ? (t.fillStyle = "#D2691E", t.beginPath(), t.ellipse(0, -o * 0.2, o * 0.7, o * 0.35, 0, Math.PI, 0), t.fill(), t.fillStyle = "#654321", t.fillRect(-o * 0.6, -o * 0.1, o * 1.2, o * 0.25), t.fillStyle = "#228B22", t.fillRect(-o * 0.55, o * 0.1, o * 1.1, o * 0.1), t.fillStyle = "#DEB887", t.beginPath(), t.ellipse(0, o * 0.25, o * 0.65, o * 0.3, 0, 0, Math.PI), t.fill()) : i === "water_bucket" || i === "lava_bucket" ? (t.fillStyle = "#888", t.beginPath(), t.moveTo(-o * 0.5, -o * 0.5), t.lineTo(o * 0.5, -o * 0.5), t.lineTo(o * 0.4, o * 0.5), t.lineTo(-o * 0.4, o * 0.5), t.closePath(), t.fill(), t.fillStyle = i === "water_bucket" ? "#4a90d9" : "#ff6600", t.fillRect(-o * 0.35, -o * 0.3, o * 0.7, o * 0.6), t.strokeStyle = "#666", t.lineWidth = 2, t.beginPath(), t.arc(0, -o * 0.6, o * 0.4, Math.PI * 0.2, Math.PI * 0.8), t.stroke()) : i === "sakuraPetal" ? (t.fillStyle = "#ffb7c5", t.beginPath(), t.ellipse(0, 0, o * 0.6, o * 0.3, d, 0, Math.PI * 2), t.fill()) : i === "shimenawa" ? (t.strokeStyle = "#daa520", t.lineWidth = o * 0.2, t.beginPath(), t.moveTo(-o * 0.6, 0), t.bezierCurveTo(-o * 0.3, -o * 0.4, o * 0.3, o * 0.4, o * 0.6, 0), t.stroke()) : i === "omamori" ? (t.fillStyle = "#ff4444", t.fillRect(-o * 0.3, -o * 0.5, o * 0.6, o * 0.8), t.fillStyle = "#gold", t.fillRect(-o * 0.2, -o * 0.4, o * 0.4, o * 0.15)) : i === "ema" ? (t.fillStyle = "#deb887", t.beginPath(), t.moveTo(0, -o * 0.6), t.lineTo(o * 0.5, -o * 0.2), t.lineTo(o * 0.5, o * 0.5), t.lineTo(-o * 0.5, o * 0.5), t.lineTo(-o * 0.5, -o * 0.2), t.closePath(), t.fill()) : i === "incense" ? (t.fillStyle = "#8b4513", t.fillRect(-1, -o * 0.6, 2, o * 1.2), t.fillStyle = "#ff6600", t.beginPath(), t.arc(0, -o * 0.6, 3, 0, Math.PI * 2), t.fill()) : (t.fillStyle = "#888", t.fillRect(-o * 0.5, -o * 0.5, o, o));
      t.restore();
      return;
    }
    const r = o * 0.8;
    t.fillStyle = h.top, t.beginPath(), t.moveTo(0, -r), t.lineTo(r, -r / 2), t.lineTo(0, 0), t.lineTo(-r, -r / 2), t.closePath(), t.fill(), t.fillStyle = h.side, t.beginPath(), t.moveTo(-r, -r / 2), t.lineTo(0, 0), t.lineTo(0, r), t.lineTo(-r, r / 2), t.closePath(), t.fill(), t.fillStyle = this.darkenColor(h.side, 0.7), t.beginPath(), t.moveTo(0, 0), t.lineTo(r, -r / 2), t.lineTo(r, r / 2), t.lineTo(0, r), t.closePath(), t.fill(), t.strokeStyle = "rgba(0,0,0,0.4)", t.lineWidth = 1, t.beginPath(), t.moveTo(0, -r), t.lineTo(r, -r / 2), t.lineTo(r, r / 2), t.lineTo(0, r), t.lineTo(-r, r / 2), t.lineTo(-r, -r / 2), t.closePath(), t.stroke(), t.restore();
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
      const e = this.camera.rotX, s = this.camera.rotY, o = Math.cos(e), i = Math.sin(e), c = -Math.sin(s) * o, h = -i, d = Math.cos(s) * o;
      return this.particles.push({
        x: this.camera.x + c * 0.5,
        y: this.camera.y + h * 0.5,
        z: this.camera.z + d * 0.5,
        vx: c * 0.8,
        vy: h * 0.8,
        vz: d * 0.8,
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
      const e = this.camera.rotX, s = this.camera.rotY, o = Math.cos(e), i = Math.sin(e), c = -Math.sin(s) * o, h = -i, d = Math.cos(s) * o;
      return this.particles.push({
        x: this.camera.x + c * 0.5,
        y: this.camera.y + h * 0.5,
        z: this.camera.z + d * 0.5,
        vx: c * 0.6,
        vy: h * 0.6 + 0.1,
        // Slight arc
        vz: d * 0.6,
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
    for (const s of this.ritualItems)
      t[s] = !1;
    for (let s = 0; s < 9; s++) {
      const o = this.inventory.hotbar[s];
      o && this.ritualItems.includes(o.id) && (t[o.id] = !0);
    }
    if (this.ritualItems.every((s) => t[s])) {
      this.ritualComplete = !0, this.ritualBlessingActive = !0, this.ritualBlessingTimer = 36e3;
      for (let s = 0; s < 9; s++) {
        const o = this.inventory.hotbar[s];
        o && this.ritualItems.includes(o.id) && (this.inventory.hotbar[s] = null);
      }
      this.updateHotbarDisplay();
      for (const s of this.pestBirds)
        s.anger = 0, s.state = "circling";
      for (let s = 0; s < 50; s++)
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
  interactWithSocket(t, e, s, o) {
    const i = {
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
    }, h = i[o];
    if (!h || o.includes("Filled")) return;
    const d = this.inventory.hotbar[this.selectedSlot];
    if (d && d.id === h && d.count > 0) {
      d.count--, d.count <= 0 && (this.inventory.hotbar[this.selectedSlot] = null), this.updateHotbarDisplay(), this.setBlock(t, e, s, c[o]), this.socketsFilled || (this.socketsFilled = {}), this.socketsFilled[o] = !0;
      for (let m = 0; m < 20; m++)
        this.particles.push({
          x: t + 0.5 + (Math.random() - 0.5) * 0.5,
          y: e + 1 + Math.random() * 0.5,
          z: s + 0.5 + (Math.random() - 0.5) * 0.5,
          vx: (Math.random() - 0.5) * 0.1,
          vy: 0.1 + Math.random() * 0.1,
          vz: (Math.random() - 0.5) * 0.1,
          life: 60 + Math.random() * 40,
          type: "spark",
          size: 3 + Math.random() * 2
        });
      if (Object.keys(i).every(
        (m) => this.socketsFilled && this.socketsFilled[m]
      ) && !this.ritualComplete) {
        if (this.ritualComplete = !0, this.ritualBlessingActive = !0, this.ritualBlessingTimer = 60 * 60 * 10, this.triggerRitualReward(), this.pestBirds)
          for (const m of this.pestBirds)
            m.anger = 0, m.state = "fleeing", m.stateTimer = 600;
        this.survivalStats && (this.survivalStats.score += 5e3, this.survivalStats.currentObjective = { text: "Blessing active - birds flee!", type: "complete" }, this.updateSurvivalHUD());
        for (let m = 0; m < 100; m++)
          this.particles.push({
            x: t + 0.5 + (Math.random() - 0.5) * 10,
            y: e + Math.random() * 8,
            z: s + 0.5 + (Math.random() - 0.5) * 10,
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
  openChest(t, e, s) {
    this.chestContents || (this.chestContents = {});
    const o = `${t},${e},${s}`, i = this.chestContents[o];
    if (i && Array.isArray(i) && i.length > 0) {
      for (const c of i) {
        if (!c) continue;
        const h = c.type || c.id, d = c.count || 1;
        h && (this.addToInventory(h, d) || this.dropItem(t + 0.5, e + 1.5, s + 0.5, h, d));
      }
      this.chestContents[o] = [], this.updateHotbarDisplay();
    }
  },
  // Drop currently held item
  dropHeldItem() {
    const t = this.inventory.hotbar[this.selectedSlot];
    if (t && t.count > 0) {
      const e = -Math.sin(this.camera.rotY), s = Math.cos(this.camera.rotY), o = t.id || t.type;
      this.dropItem(
        this.camera.x + e * 1.5,
        this.camera.y,
        this.camera.z + s * 1.5,
        o,
        1
      ), t.count--, t.count <= 0 && (this.inventory.hotbar[this.selectedSlot] = null, this.selectedItem = null), this.updateHotbarDisplay();
    }
  },
  // Debug console system
  debugConsoleOpen: !1,
  debugNoclip: !1,
  debugGodMode: !1,
  // Debug settings
  debugSettings: {
    showFPS: !1,
    showCoords: !1,
    showDepthOrder: !1,
    showFaceNormals: !1,
    showBoundingBoxes: !1,
    showRaycastVector: !1,
    showProjectionTest: !1,
    wireframeOnly: !1,
    disableFaceCulling: !1,
    showOverdraw: !1,
    highlightZFighting: !1,
    renderAlgorithm: "painter"
  },
  debugFly: !1,
  debugMoveSpeed: null,
  toggleDebugConsole() {
    this.debugConsoleOpen = !this.debugConsoleOpen;
    const t = document.getElementById("debugConsole"), e = document.getElementById("renderCanvas");
    if (console.log("[Console] Toggle debug console, now open:", this.debugConsoleOpen), console.log("[Console] isPaused:", this.isPaused), console.log("[Console] isActive:", this.isActive), t)
      if (this.debugConsoleOpen) {
        t.classList.add("active"), t.style.display = "flex", document.pointerLockElement && document.exitPointerLock(), this.pointerLocked = !1, e && e.blur();
        const s = document.getElementById("debugOutput"), o = document.getElementById("debugInput");
        this.debugLog('Debug console opened. Type "help" for commands.', "info"), setTimeout(() => {
          s && (s.scrollTop = s.scrollHeight), o && (o.focus(), o.select());
        }, 100);
      } else {
        t.classList.remove("active"), t.style.display = "none";
        const s = document.getElementById("debugSuggestions");
        s && s.classList.remove("active"), e && (e.focus(), setTimeout(() => {
          this.isActive && !this.isPaused && e.requestPointerLock();
        }, 100));
      }
  },
  setupDebugConsole() {
    console.log("[Autocomplete] Setting up debug console...");
    const t = document.getElementById("debugConsole");
    t && (t.classList.remove("active"), t.style.display = "none");
    const e = this;
    setTimeout(function() {
      console.log("[Autocomplete] setTimeout fired, calling setupDebugConsoleActual..."), e.setupDebugConsoleActual();
    }, 100);
  },
  setupDebugConsoleActual() {
    console.log("[Autocomplete] Setting up autocomplete (delayed)...");
    const t = document.getElementById("debugConsole"), e = document.getElementById("debugInput");
    let s = document.getElementById("debugSuggestions");
    if (console.log("[Autocomplete] Element check:"), console.log("  - debugConsole:", t), console.log("  - debugInput:", e), console.log("  - debugSuggestions:", s), !t || !e) {
      console.error("[Autocomplete] ERROR: Required elements not found! Cannot proceed.");
      return;
    }
    const o = t.querySelector(".debug-console-header");
    if (o) {
      let u = !1, f = 0, y = 0, k = 0, P = 0;
      const T = window.getComputedStyle(t);
      let B = parseInt(T.left) || 10, E = parseInt(T.top) || 50;
      o.addEventListener("mousedown", (A) => {
        A.target.id !== "debugFps" && (k = A.clientX - B, P = A.clientY - E, u = !0, o.style.cursor = "grabbing");
      });
      let z = !1, $ = "", q = 0, R = 0, H = 0, X = 0, N = 0, Z = 0;
      const V = (A) => {
        if (z) {
          A.preventDefault();
          let Y = q, F = R, _ = N, a = Z;
          const l = A.clientX - H, n = A.clientY - X;
          $.includes("e") ? Y = Math.max(300, q + l) : $.includes("w") && (Y = Math.max(300, q - l), _ = N + (q - Y)), $.includes("s") ? F = Math.max(200, R + n) : $.includes("n") && (F = Math.max(200, R - n), a = Z + (R - F)), t.style.width = `${Y}px`, t.style.maxHeight = `${F}px`, t.style.left = `${_}px`, t.style.top = `${a}px`, B = _, E = a;
        } else if (u) {
          A.preventDefault(), f = A.clientX - k, y = A.clientY - P, B = f, E = y;
          const Y = window.innerWidth - 100, F = window.innerHeight - 50, _ = Math.max(0, Math.min(f, Y)), a = Math.max(0, Math.min(y, F));
          t.style.left = `${_}px`, t.style.top = `${a}px`, B = _, E = a;
        } else {
          const Y = t.getBoundingClientRect(), F = 10, _ = A.clientY - Y.top < F, a = Y.bottom - A.clientY < F, l = A.clientX - Y.left < F, n = Y.right - A.clientX < F;
          _ && l || a && n ? t.style.cursor = "nwse-resize" : _ && n || a && l ? t.style.cursor = "nesw-resize" : _ || a ? t.style.cursor = "ns-resize" : l || n ? t.style.cursor = "ew-resize" : t.style.cursor = "default";
        }
      };
      t.addEventListener("mousedown", (A) => {
        if (A.target.closest(".debug-console-header")) return;
        const Y = t.getBoundingClientRect(), F = 10, _ = A.clientY - Y.top < F, a = Y.bottom - A.clientY < F, l = A.clientX - Y.left < F, n = Y.right - A.clientX < F;
        (_ || a || l || n) && (z = !0, $ = "", _ && ($ += "n"), a && ($ += "s"), l && ($ += "w"), n && ($ += "e"), H = A.clientX, X = A.clientY, q = Y.width, R = Y.height, N = Y.left, Z = Y.top, A.preventDefault());
      }), document.addEventListener("mousemove", V), document.addEventListener("mouseup", () => {
        u && (u = !1, o.style.cursor = "move"), z && (z = !1, t.style.cursor = "default");
      }), console.log("[Console] Made draggable and resizable!");
    }
    if (!s) {
      console.log("[Autocomplete] debugSuggestions not found, creating dynamically..."), s = document.createElement("div"), s.id = "debugSuggestions", s.className = "debug-console-suggestions";
      const u = e.parentElement;
      u && u.nextSibling ? t.insertBefore(s, u.nextSibling) : t.appendChild(s), console.log("[Autocomplete] Created debugSuggestions:", s);
    }
    console.log("[Autocomplete] All elements ready, proceeding with setup...");
    const i = [
      { name: "help", desc: "Show all available commands" },
      { name: "noclip", desc: "Toggle flying through walls" },
      { name: "god", desc: "Toggle invincibility" },
      { name: "coords", desc: "Toggle coordinate display" },
      { name: "tp", desc: "Teleport to position or landmark" },
      { name: "give", desc: "Give yourself items" },
      { name: "time", desc: "Set game time" },
      { name: "wave", desc: "Set wave number" },
      { name: "fly", desc: "Toggle fly mode" },
      { name: "speed", desc: "Set movement speed" },
      { name: "clear", desc: "Clear console output" },
      { name: "fps", desc: "Toggle FPS display" },
      { name: "render", desc: "Rendering debug: wireframe|depthorder|normals|bounds|raycast|projection|culling|overdraw|all|none" },
      { name: "algo", desc: "Set render algorithm: painter|zbuffer|bsp" }
    ];
    let c = -1, h = [];
    const d = document.getElementById("debugInput"), r = (u) => {
      const f = document.getElementById("debugSuggestions");
      if (console.log("[Autocomplete] Query:", u), console.log("[Autocomplete] suggestionsEl:", f), !f || !u) {
        f && f.classList.remove("active"), h = [], c = -1;
        return;
      }
      if (h = i.filter(
        (y) => y.name.toLowerCase().startsWith(u.toLowerCase())
      ), console.log("[Autocomplete] Current suggestions:", h), h.length === 0) {
        f.classList.remove("active");
        return;
      }
      f.innerHTML = "", h.forEach((y, k) => {
        const P = document.createElement("div");
        P.className = "debug-suggestion-item", k === c && P.classList.add("selected"), P.innerHTML = `<span class="suggestion-name">${y.name}</span><span class="suggestion-desc">${y.desc}</span>`, P.addEventListener("click", () => {
          d.value = y.name + " ", d.focus(), f.classList.remove("active"), h = [], c = -1;
        }), f.appendChild(P);
      }), console.log("[Autocomplete] Added active class, innerHTML:", f.innerHTML.substring(0, 100)), f.classList.add("active");
    }, m = (u) => {
      const f = document.getElementById("debugSuggestions");
      if (!f || h.length === 0) return;
      c = u, f.querySelectorAll(".debug-suggestion-item").forEach((k, P) => {
        P === c ? k.classList.add("selected") : k.classList.remove("selected");
      });
    }, b = () => {
      if (c >= 0 && c < h.length) {
        d.value = h[c].name + " ";
        const u = document.getElementById("debugSuggestions");
        u && u.classList.remove("active"), h = [], c = -1;
      }
    };
    if (d) {
      console.log("[Autocomplete] Input element found, attaching listeners"), console.log("[Autocomplete] Input element:", d);
      const u = document.getElementById("debugSuggestions");
      console.log("[Autocomplete] Suggestions element on setup:", u), d.addEventListener("input", (f) => {
        const y = d.value.trim().split(" ")[0];
        console.log("[Autocomplete] Input event fired, query:", y), r(y);
      }), d.addEventListener("keydown", (f) => {
        if (f.key === "ArrowDown")
          f.preventDefault(), h.length > 0 && (c = (c + 1) % h.length, m(c));
        else if (f.key === "ArrowUp")
          f.preventDefault(), h.length > 0 && (c = c <= 0 ? h.length - 1 : c - 1, m(c));
        else if (f.key === "Tab") {
          if (f.preventDefault(), h.length > 0) {
            c < 0 && (c = 0), f.shiftKey ? c = c <= 0 ? h.length - 1 : c - 1 : c = (c + 1) % h.length, d.value = h[c].name + " ";
            const y = document.getElementById("debugSuggestions");
            y && y.classList.remove("active"), h = [], c = -1, d.focus();
          }
        } else if (f.key === "Enter")
          if (f.preventDefault(), c >= 0)
            b();
          else {
            const y = d.value.trim();
            if (y) {
              this.executeDebugCommand(y), d.value = "";
              const k = document.getElementById("debugSuggestions");
              k && k.classList.remove("active"), h = [], c = -1;
            }
          }
        else if (f.key === "`" || f.key === "~")
          f.preventDefault(), this.toggleDebugConsole();
        else if (f.key === "Escape" && h.length > 0) {
          f.preventDefault();
          const y = document.getElementById("debugSuggestions");
          y && y.classList.remove("active"), h = [], c = -1;
        }
        f.stopPropagation();
      }), d.addEventListener("keyup", (f) => f.stopPropagation());
    }
  },
  debugLog(t, e = "normal") {
    const s = document.getElementById("debugOutput");
    if (s) {
      const o = document.createElement("div");
      for (o.className = e, o.textContent = `> ${t}`, s.appendChild(o), s.scrollTop = s.scrollHeight; s.children.length > 100; )
        s.removeChild(s.firstChild);
    }
  },
  executeDebugCommand(t) {
    const e = t.toLowerCase().split(" "), s = e[0], o = e.slice(1);
    switch (this.debugLog(t, "normal"), s) {
      case "help":
        this.debugLog("Commands:", "info"), this.debugLog("  noclip - Toggle flying through walls", "info"), this.debugLog("  god - Toggle invincibility", "info"), this.debugLog("  coords - Toggle coordinate display", "info"), this.debugLog("  tp <x> <y> <z> - Teleport to position", "info"), this.debugLog("  tp <landmark> - Teleport to landmark", "info"), this.debugLog("    landmarks: ritual, gunsmith, spawn", "info"), this.debugLog("  give <item> [count] - Give item", "info"), this.debugLog("  spawn <mob> [count] - Spawn mobs", "info"), this.debugLog("    mobs: bird, fish, cat, creeper, bluebird, gunsmith", "info"), this.debugLog("  time <ms> - Set bird event timer", "info"), this.debugLog("  kill - Kill all mobs", "info"), this.debugLog("  clear - Clear console", "info"), this.debugLog("  pos - Show current position", "info"), this.debugLog("  fly - Toggle flight mode", "info"), this.debugLog("  speed <value> - Set move speed", "info"), this.debugLog("  ritual - Complete ritual instantly", "info"), this.debugLog("  score <value> - Set score", "info"), this.debugLog("  algo <type> - Set render algorithm", "info"), this.debugLog("    painter|zbuffer|bsp", "info"), this.debugLog("", "info"), this.debugLog("Rendering Debug:", "info"), this.debugLog("  render <option> - Toggle render debug", "info"), this.debugLog("    wireframe - Wireframe-only mode", "info"), this.debugLog("    depthorder - Show depth sorting", "info"), this.debugLog("    normals - Show face normals", "info"), this.debugLog("    bounds - Show bounding boxes", "info"), this.debugLog("    raycast - Show raycast vector", "info"), this.debugLog("    projection - Test projection", "info"), this.debugLog("    culling - Disable face culling", "info"), this.debugLog("    overdraw - Show overdraw heatmap", "info"), this.debugLog("    all - Toggle all render debug", "info"), this.debugLog("    none - Turn all render debug OFF", "info");
        break;
      case "noclip":
        this.debugNoclip = !this.debugNoclip, this.debugLog(`Noclip: ${this.debugNoclip ? "ON" : "OFF"}`, this.debugNoclip ? "success" : "warn");
        break;
      case "god":
        this.debugGodMode = !this.debugGodMode, this.debugLog(`God mode: ${this.debugGodMode ? "ON" : "OFF"}`, this.debugGodMode ? "success" : "warn");
        break;
      case "coords":
        this.debugSettings.showCoords = !this.debugSettings.showCoords, this.debugLog(`Coords display: ${this.debugSettings.showCoords ? "ON" : "OFF"}`, "success");
        break;
      case "fly":
        this.debugFly = !this.debugFly, this.debugLog(`Fly mode: ${this.debugFly ? "ON" : "OFF"}`, this.debugFly ? "success" : "warn");
        break;
      case "tp":
        if (o.length >= 1) {
          const f = o[0].toLowerCase();
          if (f === "ritual" || f === "temple")
            this.ritualTempleLocation ? (this.camera.x = this.ritualTempleLocation.x + 5, this.camera.y = this.ritualTempleLocation.y + 3, this.camera.z = this.ritualTempleLocation.z + 5, this.velocity = { x: 0, y: 0, z: 0 }, this.debugLog("Teleported to Ritual Temple", "success")) : this.debugLog("Ritual temple not found", "error");
          else if (f === "gunsmith" || f === "npc" || f === "repair")
            this.repairNPC ? (this.camera.x = this.repairNPC.x, this.camera.y = this.repairNPC.y + 2, this.camera.z = this.repairNPC.z, this.velocity = { x: 0, y: 0, z: 0 }, this.debugLog("Teleported to Gunsmith NPC", "success")) : this.debugLog("Gunsmith NPC not found (not spawned yet)", "error");
          else if (f === "spawn" || f === "home")
            this.camera.x = 0, this.camera.y = 10, this.camera.z = 0, this.velocity = { x: 0, y: 0, z: 0 }, this.debugLog("Teleported to spawn", "success");
          else if (o.length >= 3) {
            const y = parseFloat(o[0]), k = parseFloat(o[1]), P = parseFloat(o[2]);
            !isNaN(y) && !isNaN(k) && !isNaN(P) ? (this.camera.x = y, this.camera.y = k, this.camera.z = P, this.velocity = { x: 0, y: 0, z: 0 }, this.debugLog(`Teleported to ${y.toFixed(1)}, ${k.toFixed(1)}, ${P.toFixed(1)}`, "success")) : this.debugLog("Invalid coordinates", "error");
          } else
            this.debugLog("Usage: tp <x> <y> <z> OR tp <landmark>", "error"), this.debugLog("Landmarks: ritual, gunsmith, spawn", "info");
        } else
          this.debugLog("Usage: tp <x> <y> <z> OR tp <landmark>", "error"), this.debugLog("Landmarks: ritual, gunsmith, spawn", "info");
        break;
      case "temple":
        this.ritualTempleLocation ? (this.camera.x = this.ritualTempleLocation.x + 5, this.camera.y = this.ritualTempleLocation.y + 3, this.camera.z = this.ritualTempleLocation.z + 5, this.velocity = { x: 0, y: 0, z: 0 }, this.debugLog("Teleported to Ritual Temple", "success")) : this.debugLog("Temple not found", "error");
        break;
      case "pos":
        this.debugLog(`Position: ${this.camera.x.toFixed(2)}, ${this.camera.y.toFixed(2)}, ${this.camera.z.toFixed(2)}`, "info"), this.debugLog(`Rotation: ${(this.camera.rotX * 180 / Math.PI).toFixed(1)}°, ${(this.camera.rotY * 180 / Math.PI).toFixed(1)}°`, "info");
        break;
      case "give":
        if (o.length >= 1) {
          const f = o[0], y = o.length >= 2 ? parseInt(o[1]) : 1;
          this.blockColors[f] || this.itemTypes[f] ? (this.addToInventory(f, y), this.debugLog(`Given ${y}x ${f}`, "success")) : (this.debugLog(`Unknown item: ${f}`, "error"), this.debugLog("Items: " + Object.keys(this.itemTypes).slice(0, 10).join(", ") + "...", "info"));
        } else
          this.debugLog("Usage: give <item> [count]", "error");
        break;
      case "spawn":
        const i = o[0], c = o.length >= 2 ? parseInt(o[1]) : 1, h = ["bird", "pest", "fish", "cat", "creeper", "bluebird", "gunsmith"];
        if (i === "bird" || i === "pest") {
          for (let f = 0; f < c; f++) this.spawnPestBird();
          this.debugLog(`Spawned ${c} pest bird(s)`, "success");
        } else if (i === "fish") {
          for (let f = 0; f < c; f++) this.spawnFish();
          this.debugLog(`Spawned ${c} fish`, "success");
        } else if (i === "cat") {
          for (let f = 0; f < c; f++) this.spawnCat();
          this.debugLog(`Spawned ${c} cat(s)`, "success");
        } else if (i === "creeper") {
          for (let f = 0; f < c; f++) this.spawnCreeper();
          this.debugLog(`Spawned ${c} creeper(s)`, "success");
        } else if (i === "bluebird") {
          for (let f = 0; f < c; f++) this.spawnBlueBird();
          this.debugLog(`Spawned ${c} blue bird(s)`, "success");
        } else i === "gunsmith" || i === "npc" || i === "repair" ? (this.spawnRepairNPC(), this.debugLog("Spawned gunsmith NPC", "success")) : (this.debugLog("Usage: spawn <mob> [count]", "error"), this.debugLog("Mobs: " + h.join(", "), "info"));
        break;
      case "kill":
        let d = 0;
        d += this.pestBirds ? this.pestBirds.length : 0, d += this.blueBirds ? this.blueBirds.length : 0, d += this.creepers ? this.creepers.length : 0, this.pestBirds = [], this.blueBirds = [], this.creepers = [], this.debugLog(`Killed ${d} mobs`, "success");
        break;
      case "time":
        if (o.length >= 1) {
          const f = parseInt(o[0]);
          !isNaN(f) && this.birdEvent && (this.birdEvent.timer = f, this.debugLog(`Bird event timer set to ${f}ms`, "success"));
        } else
          this.debugLog("Usage: time <ms>", "error");
        break;
      case "clear":
        const r = document.getElementById("debugOutput");
        r && (r.innerHTML = "");
        break;
      case "speed":
        o.length >= 1 ? (this.debugMoveSpeed = parseFloat(o[0]), this.debugLog(`Speed set to ${this.debugMoveSpeed}`, "success")) : this.debugLog("Usage: speed <value> (default: 0.12)", "error");
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
        o.length >= 1 && this.survivalStats && (this.survivalStats.score = parseInt(o[0]), this.updateSurvivalHUD(), this.debugLog(`Score set to ${this.survivalStats.score}`, "success"));
        break;
      case "render":
        const m = o[0] ? o[0].toLowerCase() : "";
        if (!m) {
          this.debugLog("Usage: render <option>", "error"), this.debugLog("Options: wireframe, depthorder, normals, bounds, raycast, projection, culling, overdraw, all, none", "info"), this.debugLog("Example: render wireframe", "info");
          break;
        }
        switch (m) {
          case "wireframe":
            this.debugSettings.wireframeOnly = !this.debugSettings.wireframeOnly, this.debugLog(`Wireframe mode: ${this.debugSettings.wireframeOnly ? "ON" : "OFF"}`, "success");
            break;
          case "depthorder":
            this.debugSettings.showDepthOrder = !this.debugSettings.showDepthOrder, this.debugLog(`Depth order display: ${this.debugSettings.showDepthOrder ? "ON" : "OFF"}`, "success");
            break;
          case "normals":
            this.debugSettings.showFaceNormals = !this.debugSettings.showFaceNormals, this.debugLog(`Face normals: ${this.debugSettings.showFaceNormals ? "ON" : "OFF"}`, "success");
            break;
          case "bounds":
            this.debugSettings.showBoundingBoxes = !this.debugSettings.showBoundingBoxes, this.debugLog(`Bounding boxes: ${this.debugSettings.showBoundingBoxes ? "ON" : "OFF"}`, "success");
            break;
          case "raycast":
            this.debugSettings.showRaycastVector = !this.debugSettings.showRaycastVector, this.debugLog(`Raycast vector: ${this.debugSettings.showRaycastVector ? "ON" : "OFF"}`, "success");
            break;
          case "projection":
            this.debugSettings.showProjectionTest = !this.debugSettings.showProjectionTest, this.debugLog(`Projection test: ${this.debugSettings.showProjectionTest ? "ON" : "OFF"}`, "success"), this.debugLog("A test point will be shown at camera center", "info");
            break;
          case "culling":
            this.debugSettings.disableFaceCulling = !this.debugSettings.disableFaceCulling, this.debugLog(`Face culling: ${this.debugSettings.disableFaceCulling ? "DISABLED" : "ENABLED"}`, this.debugSettings.disableFaceCulling ? "warn" : "success");
            break;
          case "overdraw":
            this.debugSettings.showOverdraw = !this.debugSettings.showOverdraw, this.debugLog(`Overdraw visualization: ${this.debugSettings.showOverdraw ? "ON" : "OFF"}`, "success");
            break;
          case "all":
            const f = !this.debugSettings.wireframeOnly;
            this.debugSettings.wireframeOnly = f, this.debugSettings.showDepthOrder = f, this.debugSettings.showFaceNormals = f, this.debugSettings.showBoundingBoxes = f, this.debugSettings.showRaycastVector = f, this.debugSettings.showProjectionTest = f, this.debugSettings.showOverdraw = f, this.debugLog(`All render debug: ${f ? "ON" : "OFF"}`, f ? "success" : "warn");
            break;
          case "none":
            this.debugSettings.wireframeOnly = !1, this.debugSettings.showDepthOrder = !1, this.debugSettings.showFaceNormals = !1, this.debugSettings.showBoundingBoxes = !1, this.debugSettings.showRaycastVector = !1, this.debugSettings.showProjectionTest = !1, this.debugSettings.showOverdraw = !1, this.debugSettings.disableFaceCulling = !1, this.debugLog("All render debug: OFF", "warn");
            break;
          default:
            this.debugLog(`Unknown render option: ${m}`, "error"), this.debugLog("Options: wireframe, depthorder, normals, bounds, raycast, projection, culling, overdraw, all, none", "info");
        }
        break;
      case "algo":
        const b = o[0] ? o[0].toLowerCase() : "";
        if (!b || !["painter", "zbuffer", "bsp"].includes(b)) {
          this.debugLog("Usage: algo <type>", "error"), this.debugLog("Types: painter, zbuffer, bsp", "info"), this.debugLog("  painter  - Classic painter's algorithm (sort back-to-front)", "info"), this.debugLog("  zbuffer  - Z-buffer simulation (sub-pixel depth precision)", "info"), this.debugLog("  bsp      - Binary Space Partitioning (spatial tree)", "info"), this.debugLog(`Current: ${this.debugSettings.renderAlgorithm}`, "info");
          break;
        }
        this.debugSettings.renderAlgorithm = b, this.debugLog(`Render algorithm: ${b.toUpperCase()}`, "success");
        const u = {
          painter: "Sorts blocks and faces by distance, renders back-to-front",
          zbuffer: "Enhanced depth sorting with sub-pixel precision",
          bsp: "Spatial tree traversal for optimal rendering order"
        };
        this.debugLog(u[b], "info");
        break;
      default:
        this.debugLog(`Unknown command: ${s}`, "error");
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
      ka69: "KA-69",
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
    for (const [s, o] of Object.entries(this.pickupQueue)) {
      if (o === 0) continue;
      const i = document.createElement("div");
      i.className = "pickup-item";
      const c = document.createElement("canvas");
      c.width = 24, c.height = 24, this.drawMiniBlock(c, s), i.innerHTML = `
                        <span class="pickup-icon"></span>
                        <span>+${o} ${e[s] || s}</span>
                    `, i.querySelector(".pickup-icon").appendChild(c), t.appendChild(i), setTimeout(() => {
        i.parentNode && i.parentNode.removeChild(i);
      }, 2e3);
    }
    this.pickupQueue = {}, this.pickupTimer = null;
  },
  // Fluid dynamics simulation - not yet implemented
  // Fluid dynamics simulation - spreads water/lava realistically
  // Set fluid level at position
  setFluidLevel(t, e, s, o) {
    const i = `${t},${e},${s}`;
    o <= 0 ? delete this.fluidLevels[i] : this.fluidLevels[i] = Math.min(8, Math.max(1, o));
  },
  getFluidLevel(t, e, s) {
    return this.fluidLevels[`${t},${e},${s}`] || 0;
  },
  updateFluids() {
    if (this.fluidUpdateTimer || (this.fluidUpdateTimer = 0), this.fluidUpdateTimer++, this.fluidUpdateTimer < 8) return;
    this.fluidUpdateTimer = 0;
    const t = 2;
    let e = 0;
    for (; this.fluidUpdates.length > 0 && e < t; ) {
      const s = this.fluidUpdates.shift();
      e++;
      const o = this.getBlock(s.x, s.y, s.z);
      if (!o || !this.fluidBlocks.includes(o)) {
        this.setFluidLevel(s.x, s.y, s.z, 0);
        continue;
      }
      const i = s.level || 8, c = this.getBlock(s.x, s.y - 1, s.z);
      if (c === "water" && s.type === "lava") {
        this.setBlock(s.x, s.y - 1, s.z, "stone"), this.setFluidLevel(s.x, s.y - 1, s.z, 0);
        continue;
      } else if (c === "lava" && s.type === "water") {
        this.setBlock(s.x, s.y - 1, s.z, "obsidian"), this.setFluidLevel(s.x, s.y - 1, s.z, 0);
        continue;
      }
      if (!c) {
        this.setBlock(s.x, s.y - 1, s.z, s.type), this.setFluidLevel(s.x, s.y - 1, s.z, 8), this.fluidUpdates.push({
          x: s.x,
          y: s.y - 1,
          z: s.z,
          type: s.type,
          level: 8
          // Falling fluid has full level
        });
        continue;
      }
      const h = i - 1;
      if (!(h <= 0) && c && !this.fluidBlocks.includes(c)) {
        const d = [
          { x: 1, z: 0 },
          { x: -1, z: 0 },
          { x: 0, z: 1 },
          { x: 0, z: -1 }
        ];
        for (let r = d.length - 1; r > 0; r--) {
          const m = Math.floor(Math.random() * (r + 1));
          [d[r], d[m]] = [d[m], d[r]];
        }
        for (const r of d) {
          const m = s.x + r.x, b = s.z + r.z, u = this.getBlock(m, s.y, b), f = this.getFluidLevel(m, s.y, b);
          if (s.type === "lava" && u === "water") {
            this.setBlock(m, s.y, b, "stone"), this.setFluidLevel(m, s.y, b, 0);
            continue;
          } else if (s.type === "water" && u === "lava") {
            this.setBlock(m, s.y, b, "stone"), this.setFluidLevel(m, s.y, b, 0);
            continue;
          }
          u ? u === s.type && f < h && (this.setFluidLevel(m, s.y, b, h), this.fluidUpdates.push({
            x: m,
            y: s.y,
            z: b,
            type: s.type,
            level: h
          })) : (this.setBlock(m, s.y, b, s.type), this.setFluidLevel(m, s.y, b, h), this.fluidUpdates.push({
            x: m,
            y: s.y,
            z: b,
            type: s.type,
            level: h
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
  // Attempt to repair KA-69 with NPC (costs 15 seeds)
  attemptRepair() {
    const t = this.getItemCount("seed"), e = 15;
    if (t < e) {
      this.debugLog(`Repair NPC: "Need ${e} seeds! You only have ${t}."`, "warn");
      return;
    }
    let s = !1;
    for (let o = 0; o < this.inventory.hotbar.length; o++) {
      const i = this.inventory.hotbar[o];
      if (i && i.id === "ka69" && i.durability !== void 0 && i.durability === 0) {
        i.durability = i.maxDurability || 100, s = !0, this.debugLog('✨ Repair NPC: "Your KA-69 is good as new!"', "success");
        break;
      }
    }
    if (!s)
      for (let o = 0; o < this.inventory.main.length; o++) {
        const i = this.inventory.main[o];
        if (i && i.id === "ka69" && i.durability !== void 0 && i.durability === 0) {
          i.durability = i.maxDurability || 100, s = !0, this.debugLog('✨ Repair NPC: "Your KA-69 is good as new!"', "success");
          break;
        }
      }
    s ? (this.removeItemFromInventory("seed", e), this.updateHotbarDisplay(), this.repairNPC && (this.repairNPC.lastSpoke = Date.now())) : this.debugLog(`Repair NPC: "You don't have a broken KA-69 to fix!"`, "warn");
  },
  // Open dialogue with NPC
  openDialogue(t) {
    t === "gunsmith" && (this.dialogueOpen = !0, this.currentDialogueNPC = "gunsmith", this.isPaused = !0, document.pointerLockElement && document.exitPointerLock(), this.gunsmithMetBefore || (this.gunsmithMetBefore = !0, this.questData.meet_gunsmith && (this.questData.meet_gunsmith.stage = 1, this.quests.push(this.questData.meet_gunsmith))), this.renderDialogue());
  },
  // Close dialogue
  closeDialogue() {
    this.dialogueOpen = !1, this.currentDialogueNPC = null, this.isPaused = !1;
    const t = document.getElementById("dialogueScreen");
    t && (t.style.display = "none");
    const e = document.getElementById("clickToPlay");
    e && e.classList.add("active");
  },
  // Toggle journal
  toggleJournal() {
    if (this.journalOpen = !this.journalOpen, this.journalOpen)
      this.isPaused = !0, document.pointerLockElement && document.exitPointerLock(), this.renderJournal();
    else {
      this.isPaused = !1;
      const t = document.getElementById("journalScreen");
      t && (t.style.display = "none");
      const e = document.getElementById("clickToPlay");
      e && e.classList.add("active");
    }
  },
  // Render dialogue UI
  renderDialogue() {
    let t = document.getElementById("dialogueScreen");
    if (t || (t = document.createElement("div"), t.id = "dialogueScreen", t.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 600px;
                        max-height: 500px;
                        background: rgba(30, 20, 40, 0.95);
                        border: 3px solid #8b7355;
                        border-radius: 8px;
                        padding: 25px;
                        color: #fff;
                        font-family: 'Courier New', monospace;
                        z-index: 9999;
                        overflow-y: auto;
                        box-shadow: 0 0 30px rgba(0,0,0,0.7);
                    `, document.body.appendChild(t)), t.style.display = "block", this.currentDialogueNPC === "gunsmith") {
      const e = this.gunsmithDialogueStage;
      let s = "🧙 Gunsmith Wizard", o = "", i = "";
      !this.gunsmithMetBefore || e === 0 ? o = `
                            <div style="margin-bottom: 20px;">
                                <h2 style="color: #ffd700; margin: 0 0 15px 0;">${s}</h2>
                                <p style="line-height: 1.6; font-size: 14px;">
                                    <em>*The wizard adjusts his pointed hat and grins*</em>
                                </p>
                                <p style="line-height: 1.6; font-size: 14px;">
                                    "Ah! A fellow survivor of the Great Feathering! Welcome, welcome!"
                                </p>
                                <p style="line-height: 1.6; font-size: 14px;">
                                    "You know, I've been debugging—er, I mean, <em>studying</em>—these birds for quite some time. 
                                    The patterns are fascinating! Aggressive spawning rates, coordinated attacks, 
                                    suspiciously optimized pathfinding..."
                                </p>
                                <p style="line-height: 1.6; font-size: 14px;">
                                    <em>*He pulls out a worn notebook covered in sketches and calculations*</em>
                                </p>
                                <p style="line-height: 1.6; font-size: 14px;">
                                    "Between you and me, I think there's a <strong>source</strong> to all this madness. 
                                    Something—or someone—is spawning these creatures at an unnaturally high rate. 
                                    It's almost as if someone set the spawn chance to 1.0 instead of 0.001!"
                                </p>
                                <p style="line-height: 1.6; font-size: 14px;">
                                    <em>*He chuckles nervously*</em>
                                </p>
                                <p style="line-height: 1.6; font-size: 14px;">
                                    "But where are my manners! I'm a traveling gunsmith—I can repair that KA-69 of yours. 
                                    And hey, if you're interested in actually <em>solving</em> this bird problem once and for all, 
                                    I could use someone with your... survival skills."
                                </p>
                            </div>
                        ` : o = `
                            <div style="margin-bottom: 20px;">
                                <h2 style="color: #ffd700; margin: 0 0 15px 0;">${s}</h2>
                                <p style="line-height: 1.6; font-size: 14px;">
                                    "Ah, back again! How's the bird-battling going?"
                                </p>
                                <p style="line-height: 1.6; font-size: 14px;">
                                    <em>*He peers at you with curious eyes*</em>
                                </p>
                                <p style="line-height: 1.6; font-size: 14px;">
                                    "I'm still working on tracking down the source of all these birds. 
                                    The more data we gather, the closer we get to the truth!"
                                </p>
                            </div>
                        `, i = `
                        <div style="border-top: 2px solid #8b7355; padding-top: 20px; margin-top: 20px;">
                            <div onclick="window.game.handleDialogueChoice('speak')" 
                                 style="padding: 12px; margin: 8px 0; background: rgba(139, 115, 85, 0.3); 
                                        border: 2px solid #8b7355; border-radius: 4px; cursor: pointer; 
                                        transition: all 0.2s;"
                                 onmouseover="this.style.background='rgba(139, 115, 85, 0.5)'"
                                 onmouseout="this.style.background='rgba(139, 115, 85, 0.3)'">
                                💬 <strong>Speak</strong> - "Tell me more about your quest"
                            </div>
                            
                            <div onclick="window.game.handleDialogueChoice('repair')" 
                                 style="padding: 12px; margin: 8px 0; background: rgba(65, 105, 225, 0.3); 
                                        border: 2px solid #4169e1; border-radius: 4px; cursor: pointer;
                                        transition: all 0.2s;"
                                 onmouseover="this.style.background='rgba(65, 105, 225, 0.5)'"
                                 onmouseout="this.style.background='rgba(65, 105, 225, 0.3)'">
                                🔧 <strong>Repair KA-69</strong> - Cost: 15 seeds
                            </div>
                            
                            <div onclick="window.game.handleDialogueChoice('exit')" 
                                 style="padding: 12px; margin: 8px 0; background: rgba(139, 0, 0, 0.3); 
                                        border: 2px solid #8b0000; border-radius: 4px; cursor: pointer;
                                        transition: all 0.2s;"
                                 onmouseover="this.style.background='rgba(139, 0, 0, 0.5)'"
                                 onmouseout="this.style.background='rgba(139, 0, 0, 0.3)'">
                                🚪 <strong>[Exit Dialogue]</strong>
                            </div>
                        </div>
                    `, t.innerHTML = o + i;
    }
  },
  // Handle dialogue choice
  handleDialogueChoice(t) {
    t === "speak" ? this.showQuestDialogue() : t === "repair" ? (this.attemptRepair(), setTimeout(() => {
      this.dialogueOpen && this.renderDialogue();
    }, 100)) : t === "exit" && this.closeDialogue();
  },
  // Show quest-related dialogue
  showQuestDialogue() {
    const t = document.getElementById("dialogueScreen");
    if (!t) return;
    let e = `
                    <div style="margin-bottom: 20px;">
                        <h2 style="color: #ffd700; margin: 0 0 15px 0;">🧙 Gunsmith Wizard</h2>
                        <p style="line-height: 1.6; font-size: 14px;">
                            "Excellent! I knew you had that collaborative spirit!"
                        </p>
                        <p style="line-height: 1.6; font-size: 14px;">
                            <em>*He spreads out a map with various markings*</em>
                        </p>
                        <p style="line-height: 1.6; font-size: 14px;">
                            "Here's what I'm thinking: These birds aren't just randomly spawning. 
                            There's <em>intelligence</em> behind this. Maybe a cursed artifact, maybe a rogue wizard, 
                            maybe even a bug in the fabric of reality itself—I've seen weirder things!"
                        </p>
                        <p style="line-height: 1.6; font-size: 14px;">
                            "What I need from you is <strong>data</strong>. Real field data. Survive some waves, 
                            gather drops from defeated birds, and come back to me. I'll analyze the samples and 
                            we'll piece together where they're coming from."
                        </p>
                        <p style="line-height: 1.6; font-size: 14px; color: #ffd700;">
                            <strong>QUEST UNLOCKED: Origin of the Feathered Menace</strong>
                        </p>
                        <p style="line-height: 1.6; font-size: 14px;">
                            📜 Survive 3 bird waves<br>
                            📦 Collect 50 bird drops<br>
                            🔄 Return to the Gunsmith
                        </p>
                        <p style="line-height: 1.6; font-size: 14px;">
                            "Press <strong>J</strong> to open your journal and track your progress. Good luck out there!"
                        </p>
                    </div>
                    
                    <div style="border-top: 2px solid #8b7355; padding-top: 20px; margin-top: 20px;">
                        <div onclick="window.game.handleDialogueChoice('exit')" 
                             style="padding: 12px; margin: 8px 0; background: rgba(65, 105, 225, 0.3); 
                                    border: 2px solid #4169e1; border-radius: 4px; cursor: pointer;
                                    transition: all 0.2s;"
                             onmouseover="this.style.background='rgba(65, 105, 225, 0.5)'"
                             onmouseout="this.style.background='rgba(65, 105, 225, 0.3)'">
                            ✓ <strong>Accept Quest</strong> - "Let's do this!"
                        </div>
                    </div>
                `;
    t.innerHTML = e, this.questData.birds_origin.status === "locked" && (this.questData.birds_origin.status = "active", this.questData.birds_origin.stage = 1, this.quests.push(this.questData.birds_origin)), this.questData.meet_gunsmith && (this.questData.meet_gunsmith.stage = 2, this.questData.meet_gunsmith.status = "completed");
  },
  // Render journal UI
  renderJournal() {
    let t = document.getElementById("journalScreen");
    t || (t = document.createElement("div"), t.id = "journalScreen", t.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 700px;
                        max-height: 600px;
                        background: rgba(40, 30, 20, 0.95);
                        border: 4px solid #8b7355;
                        border-radius: 8px;
                        padding: 30px;
                        color: #fff;
                        font-family: 'Courier New', monospace;
                        z-index: 9999;
                        overflow-y: auto;
                        box-shadow: 0 0 40px rgba(0,0,0,0.8);
                    `, document.body.appendChild(t)), t.style.display = "block";
    let e = `
                    <div style="border-bottom: 3px solid #8b7355; padding-bottom: 20px; margin-bottom: 20px;">
                        <h1 style="color: #ffd700; margin: 0; font-size: 28px;">📖 Quest Journal</h1>
                        <p style="color: #aaa; margin: 5px 0 0 0; font-size: 12px;">Press J to close</p>
                    </div>
                `;
    const s = this.quests.filter((i) => i.status === "active");
    s.length > 0 && (e += '<h2 style="color: #4169e1; margin: 20px 0 10px 0;">Active Quests</h2>', s.forEach((i) => {
      e += `
                            <div style="background: rgba(65, 105, 225, 0.2); border: 2px solid #4169e1; 
                                        border-radius: 6px; padding: 15px; margin: 10px 0;">
                                <h3 style="color: #ffd700; margin: 0 0 10px 0;">${i.title}</h3>
                                <p style="line-height: 1.5; margin: 8px 0;">${i.description}</p>
                                <div style="margin-top: 12px;">
                                    <strong style="color: #4169e1;">Objectives:</strong>
                                    <ul style="margin: 5px 0; padding-left: 20px;">
                                        ${i.objectives.map((c) => `<li>${c}</li>`).join("")}
                                    </ul>
                                </div>
                                ${i.progress ? `
                                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #4169e1;">
                                        <strong>Progress:</strong> 
                                        Waves: ${i.progress.waves}/3 | 
                                        Drops: ${i.progress.drops}/50
                                    </div>
                                ` : ""}
                            </div>
                        `;
    }));
    const o = this.quests.filter((i) => i.status === "completed");
    o.length > 0 && (e += '<h2 style="color: #228b22; margin: 30px 0 10px 0;">Completed Quests</h2>', o.forEach((i) => {
      e += `
                            <div style="background: rgba(34, 139, 34, 0.2); border: 2px solid #228b22; 
                                        border-radius: 6px; padding: 15px; margin: 10px 0; opacity: 0.7;">
                                <h3 style="color: #90ee90; margin: 0 0 10px 0;">✓ ${i.title}</h3>
                                <p style="line-height: 1.5; margin: 8px 0; font-size: 13px;">${i.description}</p>
                            </div>
                        `;
    })), this.quests.length === 0 && (e += `
                        <div style="text-align: center; padding: 40px; color: #888;">
                            <p style="font-size: 16px;">No quests yet...</p>
                            <p style="font-size: 13px;">Talk to NPCs to discover new quests!</p>
                        </div>
                    `), t.innerHTML = e;
  },
  // Render inventory UI
  renderInventory() {
    const t = document.getElementById("inventoryScreen");
    if (!t) return;
    const e = (o) => {
      if (!o) return "";
      const i = o.id || o.type;
      return {
        grass: "Grass Block",
        dirt: "Dirt",
        stone: "Stone",
        wood: "Wood",
        leaves: "Leaves",
        water: "Water",
        sand: "Sand",
        brick: "Brick",
        ka69: "KA-69",
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
      }[i] || i;
    };
    let s = '<div class="inventory-container">';
    s += "<h2>Inventory</h2>", s += '<div class="crafting-section">', s += "<h3>Crafting</h3>", s += '<div class="recipe-list">';
    for (const o of this.recipes) {
      const i = this.canCraftRecipe(o);
      s += `<div class="recipe ${i ? "craftable" : "disabled"}" data-recipe="${o.name}">`, s += `<span class="recipe-name">${o.name}</span>`, s += '<span class="recipe-ingredients">', o.ingredients.forEach((c) => {
        s += `${c.count}x ${c.id} `;
      }), s += "</span>", s += `<span class="recipe-result">→ ${o.result.count}x ${o.result.id}</span>`, i && (s += `<button class="craft-btn" onclick="minecraftGame.craftRecipe('${o.name}')">Craft</button>`), s += "</div>";
    }
    s += "</div></div>", s += '<div class="inv-hotbar">', s += "<h3>Hotbar</h3>", s += '<div class="inv-slots" id="hotbarSlots">', this.inventory.hotbar.forEach((o, i) => {
      const c = this.getItemEmoji(o), h = o && o.count > 0, d = this.inventoryHeldItem && this.inventoryHeldItem.source === "hotbar" && this.inventoryHeldItem.index === i, r = h ? e(o) : "";
      s += `<div class="inv-slot ${i === this.selectedSlot ? "selected" : ""} ${h ? "has-item" : ""} ${d ? "held" : ""}" 
                        data-source="hotbar" data-index="${i}" ${r ? `data-tooltip="${r}"` : ""}
                        draggable="${h}">${c}<span class="count">${o ? o.count : ""}</span></div>`;
    }), s += "</div></div>", s += '<div class="inv-main">', s += "<h3>Storage</h3>", s += '<div class="inv-slots" id="storageSlots">';
    for (let o = 0; o < 27; o++) {
      const i = this.inventory.main[o];
      i && i.count > 0;
      const c = this.inventoryHeldItem && this.inventoryHeldItem.source === "main" && this.inventoryHeldItem.index === o;
      if (i) {
        const h = this.getItemEmoji(i), d = e(i);
        s += `<div class="inv-slot has-item ${c ? "held" : ""}" data-source="main" data-index="${o}" ${d ? `data-tooltip="${d}"` : ""} draggable="true">${h}<span class="count">${i.count}</span></div>`;
      } else
        s += `<div class="inv-slot empty" data-source="main" data-index="${o}" draggable="false"></div>`;
    }
    s += "</div></div>", s += '<p class="inv-hint">Click items to pick up/place | Drag also works | Press E or ESC to close</p>', s += "</div>", t.innerHTML = s, this.setupInventoryDragDrop();
  },
  setupInventoryDragDrop() {
    const t = document.getElementById("inventoryScreen"), e = document.querySelectorAll("#inventoryScreen .inv-slot");
    this.inventoryHeldItem || (this.inventoryHeldItem = null);
    const s = t.querySelector(".inventory-container");
    s && s.addEventListener("wheel", (o) => {
      o.stopPropagation();
      const { scrollTop: i, scrollHeight: c, clientHeight: h } = s, d = i === 0, r = i + h >= c;
      (d && o.deltaY < 0 || r && o.deltaY > 0) && o.preventDefault();
    }, { passive: !1 }), t.addEventListener("dragover", (o) => {
      o.preventDefault(), o.stopPropagation();
    }), t.addEventListener("drop", (o) => {
      o.preventDefault(), o.stopPropagation();
    }), e.forEach((o) => {
      o.addEventListener("click", (i) => {
        i.preventDefault(), i.stopPropagation();
        const c = o.dataset.source, h = parseInt(o.dataset.index), r = (c === "hotbar" ? this.inventory.hotbar : this.inventory.main)[h];
        this.inventoryHeldItem ? (this.swapInventorySlots(
          this.inventoryHeldItem.source,
          this.inventoryHeldItem.index,
          c,
          h
        ), this.inventoryHeldItem = null, this.renderInventory(), this.updateHotbar(), this.updateHotbarDisplay()) : r && r.count > 0 && (this.inventoryHeldItem = { source: c, index: h }, this.renderInventory());
      }), o.addEventListener("dragstart", (i) => {
        i.stopPropagation();
        const c = o.dataset.source, h = parseInt(o.dataset.index);
        this.draggedItem = { source: c, index: h }, o.classList.add("dragging"), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setDragImage(o, 20, 20);
      }), o.addEventListener("dragend", (i) => {
        i.preventDefault(), i.stopPropagation(), o.classList.remove("dragging"), this.draggedItem = null;
      }), o.addEventListener("dragover", (i) => {
        i.preventDefault(), i.stopPropagation(), i.dataTransfer.dropEffect = "move", o.classList.add("drag-over");
      }), o.addEventListener("dragleave", (i) => {
        i.preventDefault(), i.stopPropagation(), o.classList.remove("drag-over");
      }), o.addEventListener("drop", (i) => {
        if (i.preventDefault(), i.stopPropagation(), o.classList.remove("drag-over"), !this.draggedItem) return;
        const c = o.dataset.source, h = parseInt(o.dataset.index), d = document.querySelector(".inventory-container"), r = d ? d.scrollTop : 0;
        this.swapInventorySlots(
          this.draggedItem.source,
          this.draggedItem.index,
          c,
          h
        ), this.draggedItem = null, this.renderInventory(), this.updateHotbar(), this.updateHotbarDisplay();
        const m = document.querySelector(".inventory-container");
        m && (m.scrollTop = r);
      });
    });
  },
  swapInventorySlots(t, e, s, o) {
    const i = t === "hotbar" ? this.inventory.hotbar : this.inventory.main, c = s === "hotbar" ? this.inventory.hotbar : this.inventory.main, h = i[e], d = c[o];
    if (i[e] = d, c[o] = h, t === "hotbar" || s === "hotbar") {
      const r = this.inventory.hotbar[this.selectedSlot];
      r ? r.type === "block" ? (this.selectedBlock = r.id, this.selectedItem = null) : r.type === "weapon" && (this.selectedItem = r.id, this.selectedBlock = null) : (this.selectedBlock = null, this.selectedItem = null);
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
      ka69: "🔫",
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
    for (const s of this.inventory.hotbar)
      s && s.id === t && (e += s.count);
    for (const s of this.inventory.main)
      s && s.id === t && (e += s.count);
    return e;
  },
  craftRecipe(t) {
    const e = this.recipes.find((s) => s.name === t);
    if (!(!e || !this.canCraftRecipe(e))) {
      for (const s of e.ingredients)
        this.removeItem(s.id, s.count);
      this.addItem(e.result), this.renderInventory();
    }
  },
  removeItem(t, e) {
    let s = e;
    for (const o of this.inventory.hotbar)
      if (o && o.id === t && s > 0) {
        const i = Math.min(o.count, s);
        o.count -= i, s -= i;
      }
    for (const o of this.inventory.main)
      if (o && o.id === t && s > 0) {
        const i = Math.min(o.count, s);
        o.count -= i, s -= i;
      }
  },
  addItem(t) {
    for (const e of this.inventory.hotbar)
      if (e && e.id === t.id && e.count < 64) {
        const s = Math.min(64 - e.count, t.count);
        if (e.count += s, t.count -= s, t.count <= 0) return;
      }
    for (const e of this.inventory.main)
      if (e && e.id === t.id && e.count < 64) {
        const s = Math.min(64 - e.count, t.count);
        if (e.count += s, t.count -= s, t.count <= 0) return;
      }
    for (let e = 0; e < this.inventory.main.length; e++)
      if (!this.inventory.main[e]) {
        this.inventory.main[e] = { ...t };
        return;
      }
  },
  raycast() {
    const t = -this.camera.rotX, e = -this.camera.rotY, s = Math.cos(t), o = Math.sin(t), i = Math.cos(e), h = Math.sin(e) * s, d = o, r = i * s, m = Math.sqrt(h * h + d * d + r * r), b = h / m, u = d / m, f = r / m;
    let y = this.camera.x, k = this.camera.y, P = this.camera.z, T = Math.floor(y), B = Math.floor(k), E = Math.floor(P);
    const z = b >= 0 ? 1 : -1, $ = u >= 0 ? 1 : -1, q = f >= 0 ? 1 : -1, R = Math.abs(1 / b), H = Math.abs(1 / u), X = Math.abs(1 / f);
    let N, Z, V;
    b > 0 ? N = (T + 1 - y) / b : b < 0 ? N = (T - y) / b : N = 1 / 0, u > 0 ? Z = (B + 1 - k) / u : u < 0 ? Z = (B - k) / u : Z = 1 / 0, f > 0 ? V = (E + 1 - P) / f : f < 0 ? V = (E - P) / f : V = 1 / 0;
    let A = null;
    const Y = 4;
    let F = 0, _ = null, a = !1, l = !1;
    for (let n = 0; n < 100; n++) {
      const g = this.getBlock(T, B, E);
      if (g)
        if (g === "water" || g === "lava")
          g === "water" && (a = !0), g === "lava" && (l = !0);
        else {
          let p = null;
          const x = _ || A;
          return x && (x.x !== 0 || x.y !== 0 || x.z !== 0) && (p = {
            x: T + x.x,
            y: B + x.y,
            z: E + x.z
          }), {
            hit: { x: T, y: B, z: E },
            place: p,
            block: g,
            throughWater: a,
            throughLava: l
          };
        }
      else
        _ = A;
      if (N < Z && N < V) {
        if (F = N, F > Y) break;
        T += z, N += R, A = { x: -z, y: 0, z: 0 };
      } else if (Z < V) {
        if (F = Z, F > Y) break;
        B += $, Z += H, A = { x: 0, y: -$, z: 0 };
      } else {
        if (F = V, F > Y) break;
        E += q, V += X, A = { x: 0, y: 0, z: -q };
      }
    }
    return null;
  },
  update() {
    if (!this.isActive || this.isPaused) return;
    this.shootCooldown > 0 && this.shootCooldown--, this.muzzleFlash > 0 && this.muzzleFlash--, this.ritualFlightTimer > 0 && (this.ritualFlightTimer--, this.ritualFlightTimer <= 0 && (this.ritualFlight = !1));
    const t = this.debugMoveSpeed || 0.12, s = this.debugNoclip || this.debugFly || this.ritualFlight ? t * 2 : t, o = Math.sin(this.camera.rotY), i = Math.cos(this.camera.rotY);
    if (this.debugNoclip || this.debugFly) {
      let M = 0, w = 0, I = 0;
      this.keys.w && (M -= o * Math.cos(this.camera.rotX) * s, w -= Math.sin(this.camera.rotX) * s, I += i * Math.cos(this.camera.rotX) * s), this.keys.s && (M += o * Math.cos(this.camera.rotX) * s, w += Math.sin(this.camera.rotX) * s, I -= i * Math.cos(this.camera.rotX) * s), this.keys.a && (M -= i * s, I -= o * s), this.keys.d && (M += i * s, I += o * s), this.keys[" "] && (w += s), this.keys.shift && (w -= s), this.debugNoclip ? (this.camera.x += M, this.camera.y += w, this.camera.z += I) : (this.camera.x += M, this.camera.y += w, this.camera.z += I), this.velocity = { x: 0, y: 0, z: 0 };
      return;
    }
    if (this.ritualFlight) {
      let M = 0, w = 0, I = 0;
      this.keys.w && (M -= o * s, I += i * s), this.keys.s && (M += o * s, I -= i * s), this.keys.a && (M -= i * s, I -= o * s), this.keys.d && (M += i * s, I += o * s), this.keys[" "] && (w += s), this.keys.shift && (w -= s);
      const D = this.camera.x + M, L = this.camera.y + w, Q = this.camera.z + I, j = Math.floor(L - this.playerEyeHeight), it = Math.floor(L), U = Math.floor(D), tt = Math.floor(Q);
      let J = !0;
      for (let O = j; O <= it; O++) {
        const et = this.getBlock(U, O, tt);
        if (et && !this.fluidBlocks.includes(et)) {
          J = !1;
          break;
        }
      }
      J && (this.camera.x = D, this.camera.y = L, this.camera.z = Q), this.velocity = { x: 0, y: 0, z: 0 };
      return;
    }
    const c = this.camera.y - this.playerEyeHeight, h = c + this.playerHeight, d = Math.floor(this.camera.x), r = Math.floor(this.camera.z), m = this.getBlock(d, Math.floor(c), r), b = this.getBlock(d, Math.floor(c + 0.9), r), u = this.getBlock(d, Math.floor(h - 0.1), r), f = m === "water", y = m === "lava", k = b === "water", P = b === "lava", T = u === "water", B = u === "lava", E = f || k, z = y || P, $ = E || z, q = T || B;
    this.inWater = E || T, this.inLava = z || B, this.swimming = $, this.headSubmergedWater = T, this.headSubmergedLava = B;
    let R = 1;
    E && (R = 0.65), z && (R = 0.35);
    let H = 0, X = 0;
    const N = t;
    this.keys.w && (H -= o * N * R, X += i * N * R), this.keys.s && (H += o * N * R, X -= i * N * R), this.keys.a && (H -= i * N * R, X -= o * N * R), this.keys.d && (H += i * N * R, X += o * N * R);
    const Z = this.camera.x, V = this.camera.z, A = 0.25, Y = 1.8;
    if (this.collidesAt(this.camera.x, this.camera.y, this.camera.z, A, Y)) {
      let M = !1;
      for (let w = 0.1; w <= 1.5 && !M; w += 0.1) {
        const I = [0, 45, 90, 135, 180, 225, 270, 315];
        for (const D of I) {
          const L = D * Math.PI / 180, Q = this.camera.x + Math.cos(L) * w, j = this.camera.z + Math.sin(L) * w;
          if (!this.collidesAt(Q, this.camera.y, j, A, Y)) {
            this.camera.x = Q, this.camera.z = j, M = !0;
            break;
          }
        }
        !M && !this.collidesAt(this.camera.x, this.camera.y + w, this.camera.z, A, Y) && (this.camera.y += w, M = !0);
      }
    }
    let F = this.camera.x, _ = this.camera.z;
    const a = 8, l = H / a, n = X / a;
    for (let M = 0; M < a; M++) {
      const w = F + l;
      if (!this.collidesAt(w, this.camera.y, _, A, Y))
        F = w;
      else {
        const D = l * 0.5;
        this.collidesAt(F + D, this.camera.y, _, A, Y) || (F += D);
      }
      const I = _ + n;
      if (!this.collidesAt(F, this.camera.y, I, A, Y))
        _ = I;
      else {
        const D = n * 0.5;
        this.collidesAt(F, this.camera.y, _ + D, A, Y) || (_ += D);
      }
    }
    this.collidesAt(F, this.camera.y, _, A, Y) && (F = this.camera.x, _ = this.camera.z), this.camera.x = F, this.camera.z = _;
    const g = this.camera.x - Z, p = this.camera.z - V;
    if (this.stats.distance += Math.sqrt(g * g + p * p), $) {
      const M = z ? 8e-3 : 0.012, w = z ? 0.92 : 0.95;
      if (this.velocity.y += M, this.keys[" "]) {
        const D = z ? 0.04 : 0.06;
        this.velocity.y += D;
      }
      if (this.keys.shift) {
        const D = z ? 0.03 : 0.04;
        this.velocity.y -= D;
      }
      const I = z ? 0.12 : 0.15;
      this.velocity.y = Math.max(-I, Math.min(I, this.velocity.y)), this.velocity.y *= w, !q && this.keys[" "] && this.velocity.y < 0.15 && (this.velocity.y = 0.2);
    } else
      this.velocity.y += this.gravity;
    const x = this.camera.y + this.velocity.y, v = this.getGroundHeightBelow(this.camera.x, this.camera.z, this.camera.y) + this.playerEyeHeight + 0.5;
    x < v ? (this.camera.y = v, this.velocity.y = 0, this.isJumping = !1, this.keys[" "] && !$ && (this.velocity.y = 0.28, this.isJumping = !0, this.stats.jumps++)) : this.camera.y = x;
    const S = this.getCeilingAbove(this.camera.x, this.camera.z, this.camera.y);
    S !== null && this.camera.y > S - 0.5 && (this.camera.y = S - 0.5, this.velocity.y = 0), this.worldBounds && (this.camera.x < this.worldBounds.minX + 0.5 && (this.camera.x = this.worldBounds.minX + 0.5, this.velocity.x = Math.abs(this.velocity.x || 0) * 0.3), this.camera.x > this.worldBounds.maxX - 0.5 && (this.camera.x = this.worldBounds.maxX - 0.5, this.velocity.x = -Math.abs(this.velocity.x || 0) * 0.3), this.camera.z < this.worldBounds.minZ + 0.5 && (this.camera.z = this.worldBounds.minZ + 0.5, this.velocity.z = Math.abs(this.velocity.z || 0) * 0.3), this.camera.z > this.worldBounds.maxZ - 0.5 && (this.camera.z = this.worldBounds.maxZ - 0.5, this.velocity.z = -Math.abs(this.velocity.z || 0) * 0.3), this.camera.y < this.worldBounds.minY + this.playerEyeHeight && (this.camera.y = this.worldBounds.minY + this.playerEyeHeight, this.velocity.y = 0.15)), this.settings.filter === "trippy" && this.applyFilters();
  },
  // Check if player would collide with blocks at position
  collidesAt(t, e, s, o, i) {
    const c = e - this.playerEyeHeight, h = [
      { x: t - o, z: s - o },
      { x: t + o, z: s - o },
      { x: t - o, z: s + o },
      { x: t + o, z: s + o },
      { x: t, z: s }
    ];
    for (const d of h) {
      const r = Math.floor(d.x), m = Math.floor(d.z);
      for (let b = Math.floor(c); b < Math.floor(c + i); b++) {
        const u = this.getBlock(r, b, m);
        if (u && !this.fluidBlocks.includes(u))
          return !0;
      }
    }
    return !1;
  },
  // Get ground height directly below player (not teleporting to trees)
  getGroundHeightBelow(t, e, s) {
    const o = Math.floor(t), i = Math.floor(e), c = Math.floor(s - this.playerEyeHeight);
    for (let h = c; h >= 0; h--) {
      const d = this.getBlock(o, h, i);
      if (d && !this.fluidBlocks.includes(d))
        return h + 1;
    }
    return 0;
  },
  // Get ground height at position (searches from top down)
  getGroundHeight(t, e) {
    const s = Math.floor(t), o = Math.floor(e);
    for (let i = 40; i >= 0; i--) {
      const c = this.getBlock(s, i, o);
      if (c && c !== "water" && c !== "lava")
        return i;
    }
    return 0;
  },
  // Get ceiling above player
  getCeilingAbove(t, e, s) {
    const o = Math.floor(t), i = Math.floor(e), c = Math.floor(s);
    for (let h = c; h <= c + 3; h++) {
      const d = this.getBlock(o, h, i);
      if (d && !this.fluidBlocks.includes(d))
        return h;
    }
    return null;
  },
  render() {
    if (!this.isActive) return;
    const t = this.ctx, e = this.canvas.width, s = this.canvas.height, o = this.camera.y + this.getEyeHeight();
    if (!this.cachedSky || this.cachedSky.w !== e || this.cachedSky.h !== s || this.cachedSky.lighting !== this.settings.lighting) {
      const a = t.createLinearGradient(0, 0, 0, s);
      this.settings.lighting ? (a.addColorStop(0, "#1a0a1a"), a.addColorStop(0.5, "#2d1f3d"), a.addColorStop(1, "#ffb7c5")) : (a.addColorStop(0, "#111"), a.addColorStop(1, "#333")), this.cachedSky = { grad: a, w: e, h: s, lighting: this.settings.lighting };
    }
    t.fillStyle = this.cachedSky.grad, t.fillRect(0, 0, e, s);
    const i = this.camera.x, c = o, h = this.camera.z, d = Math.cos(-this.camera.rotY), r = Math.sin(-this.camera.rotY), m = Math.cos(-this.camera.rotX), b = Math.sin(-this.camera.rotX), u = e / 2, f = s / 2, y = 400, k = this.settings.renderDistance, P = k * k, T = (a, l, n) => {
      const g = a - i, p = l - c, x = n - h, v = g * d - x * r, S = g * r + x * d, M = p * m - S * b, w = p * b + S * m;
      return w <= 0.1 ? null : { x: u + v / w * y, y: f - M / w * y, z: w };
    }, B = [], E = -Math.sin(this.camera.rotY), z = Math.cos(this.camera.rotY), $ = Object.keys(this.world);
    for (let a = 0; a < $.length; a++) {
      const l = $[a], [n, g, p] = l.split(",").map(Number), x = n + 0.5 - i, v = g + 0.5 - c, S = p + 0.5 - h, M = x * x + v * v + S * S;
      M > P || x * E + S * z < -3 && M > 16 || B.push({ x: n, y: g, z: p, dist: M, type: this.world[l] });
    }
    B.sort((a, l) => l.dist - a.dist);
    const q = (a, l, n) => this.world[`${a},${l},${n}`], R = (a) => {
      if (!a || this.fluidBlocks.includes(a)) return !0;
      const l = this.blockColors[a];
      return !!(l && l.transparent);
    }, H = (a, l) => l ? a === l : !1, X = (a, l, n) => this.fluidLevels[`${a},${l},${n}`] || 8, N = Date.now() * 2e-3, Z = [], V = [];
    for (let a = 0; a < B.length; a++) {
      const l = B[a], n = this.blockColors[l.type];
      n && n.transparent ? V.push(l) : Z.push(l);
    }
    const A = (a, l, n) => {
      const g = [
        [a + 0.5, l + 0.5, n + 0.5],
        // center
        [a + 0.1, l + 0.1, n + 0.1],
        // corners with small inset
        [a + 0.9, l + 0.1, n + 0.1],
        [a + 0.1, l + 0.9, n + 0.1],
        [a + 0.9, l + 0.9, n + 0.1],
        [a + 0.1, l + 0.1, n + 0.9],
        [a + 0.9, l + 0.1, n + 0.9],
        [a + 0.1, l + 0.9, n + 0.9],
        [a + 0.9, l + 0.9, n + 0.9]
      ];
      for (const [p, x, v] of g) {
        const S = p - i, M = x - c, w = v - h, I = Math.sqrt(S * S + M * M + w * w);
        let D = !1;
        const L = Math.min(8, Math.ceil(I / 2));
        for (let Q = 1; Q < L; Q++) {
          const j = Q / L, it = Math.floor(i + S * j), U = Math.floor(c + M * j), tt = Math.floor(h + w * j);
          if (it === a && U === l && tt === n) continue;
          const J = q(it, U, tt);
          if (J && !this.fluidBlocks.includes(J)) {
            const O = this.blockColors[J];
            if (!O || !O.transparent) {
              D = !0;
              break;
            }
          }
        }
        if (!D) return !1;
      }
      return !0;
    }, Y = V.filter((a) => !A(a.x, a.y, a.z));
    Y.sort((a, l) => l.dist - a.dist), Z.sort((a, l) => l.dist - a.dist);
    const F = [...Z, ...Y], _ = this.debugSettings.renderAlgorithm;
    if (_ === "painter")
      F.sort((a, l) => {
        const n = l.dist - a.dist;
        return Math.abs(n) > 1e-3 ? n : a.y !== l.y ? a.y - l.y : a.z !== l.z ? a.z - l.z : a.x !== l.x ? a.x - l.x : a.type.localeCompare(l.type);
      });
    else if (_ === "zbuffer")
      F.forEach((a) => {
        const { x: l, y: n, z: g } = a, p = [
          [l, n, g],
          [l + 1, n, g],
          [l, n + 1, g],
          [l + 1, n + 1, g],
          [l, n, g + 1],
          [l + 1, n, g + 1],
          [l, n + 1, g + 1],
          [l + 1, n + 1, g + 1]
        ];
        let x = 1 / 0;
        for (const [v, S, M] of p) {
          const w = v - i, I = S - c, D = M - h, L = w * w + I * I + D * D;
          L < x && (x = L);
        }
        a.minDist = x;
      }), F.sort((a, l) => {
        const n = (l.minDist || l.dist) - (a.minDist || a.dist);
        return Math.abs(n) > 1e-4 ? n : a.y !== l.y ? a.y - l.y : a.z !== l.z ? a.z - l.z : a.x !== l.x ? a.x - l.x : a.type.localeCompare(l.type);
      });
    else if (_ === "bsp") {
      const a = (p) => {
        if (p.length === 0) return null;
        if (p.length === 1) return { block: p[0], front: null, back: null };
        const x = Math.min(...p.map((O) => O.x)), v = Math.max(...p.map((O) => O.x)), S = Math.min(...p.map((O) => O.y)), M = Math.max(...p.map((O) => O.y)), w = Math.min(...p.map((O) => O.z)), I = Math.max(...p.map((O) => O.z)), D = v - x, L = M - S, Q = I - w;
        let j;
        D >= L && D >= Q ? j = "x" : L >= Q ? j = "y" : j = "z", p.sort((O, et) => O[j] - et[j]);
        const it = Math.floor(p.length / 2), U = p[it], tt = p.filter((O, et) => et < it), J = p.filter((O, et) => et > it);
        return {
          block: U,
          axis: j,
          value: U[j],
          front: a(tt),
          back: a(J)
        };
      }, l = (p, x) => {
        if (!p) return;
        if (!p.axis) {
          x.push(p.block);
          return;
        }
        (p.axis === "x" ? i : p.axis === "y" ? c : h) < p.value ? (l(p.back, x), x.push(p.block), l(p.front, x)) : (l(p.front, x), x.push(p.block), l(p.back, x));
      }, n = a(F.slice()), g = [];
      l(n, g), F.length = 0, F.push(...g);
    }
    for (let a = 0; a < F.length; a++) {
      const l = F[a], { x: n, y: g, z: p, type: x } = l, v = this.blockColors[x];
      if (!v) continue;
      t.lineWidth = 0, t.strokeStyle = "transparent";
      const S = this.fluidBlocks.includes(x), M = S ? X(n, g, p) : 8, w = g + M / 8, I = q(n, g + 1, p), D = q(n, g - 1, p), L = q(n, g, p + 1), Q = q(n, g, p - 1), j = q(n - 1, g, p), it = q(n + 1, g, p);
      let U, tt, J, O, et, rt;
      if (this.debugSettings.disableFaceCulling)
        U = tt = J = O = et = rt = !0;
      else if (S) {
        U = !I || I !== x, tt = !D || !this.fluidBlocks.includes(D);
        const W = M, G = L === x ? X(n, g, p + 1) : 0, C = Q === x ? X(n, g, p - 1) : 0, dt = j === x ? X(n - 1, g, p) : 0, st = it === x ? X(n + 1, g, p) : 0;
        J = !L || L !== x || G < W, O = !Q || Q !== x || C < W, et = !j || j !== x || dt < W, rt = !it || it !== x || st < W;
      } else
        this.blockColors[x] && this.blockColors[x].transparent ? (U = !H(x, I), tt = !H(x, D), J = !H(x, L), O = !H(x, Q), et = !H(x, j), rt = !H(x, it)) : (U = R(I), tt = R(D), J = R(L), O = R(Q), et = R(j), rt = R(it));
      if (!U && !tt && !J && !O && !et && !rt) continue;
      const lt = [];
      J && lt.push({ v: [[n, g, p + 1], [n + 1, g, p + 1], [n + 1, w, p + 1], [n, w, p + 1]], color: v.side, dark: 0.95, isTop: !1 }), O && lt.push({ v: [[n + 1, g, p], [n, g, p], [n, w, p], [n + 1, w, p]], color: v.side, dark: 0.75, isTop: !1 }), U && lt.push({ v: [[n, w, p], [n + 1, w, p], [n + 1, w, p + 1], [n, w, p + 1]], color: v.top, dark: 1, isTop: !0 }), tt && lt.push({ v: [[n, g, p + 1], [n + 1, g, p + 1], [n + 1, g, p], [n, g, p]], color: v.bottom, dark: 0.6, isTop: !1 }), et && lt.push({ v: [[n, g, p], [n, g, p + 1], [n, w, p + 1], [n, w, p]], color: v.side, dark: 0.85, isTop: !1 }), rt && lt.push({ v: [[n + 1, g, p + 1], [n + 1, g, p], [n + 1, w, p], [n + 1, w, p + 1]], color: v.side, dark: 0.9, isTop: !1 });
      const gt = lt.map((W) => {
        const G = (W.v[0][0] + W.v[1][0] + W.v[2][0] + W.v[3][0]) / 4, C = (W.v[0][1] + W.v[1][1] + W.v[2][1] + W.v[3][1]) / 4, dt = (W.v[0][2] + W.v[1][2] + W.v[2][2] + W.v[3][2]) / 4, st = G - i, ct = C - c, K = dt - h, ot = st * st + ct * ct + K * K;
        return { face: W, distSq: ot };
      });
      gt.sort((W, G) => G.distSq - W.distSq);
      for (let W = 0; W < gt.length; W++) {
        const { face: G } = gt[W], C = [];
        let dt = !0;
        for (let K = 0; K < 4; K++) {
          const ot = T(G.v[K][0], G.v[K][1], G.v[K][2]);
          if (!ot) {
            dt = !1;
            break;
          }
          C.push(ot);
        }
        if (!dt || C.length !== 4) continue;
        let st = G.color;
        if (this.settings.shadows && G.dark < 1 && (st = this.darkenColor(G.color, G.dark)), S && v.animated) {
          if (x === "water") {
            const K = N, ot = Math.sin(K + n * 0.7 + p * 0.5) * 0.4, at = Math.sin(K * 0.8 - n * 0.3 + p * 0.7) * 0.3, nt = Math.sin(K * 1.3 + n * 0.5 - p * 0.3) * 0.2, ft = (ot + at + nt) / 3 + 0.5, bt = n + 0.5 - i, ht = g + 0.5 - c, mt = p + 0.5 - h, ut = Math.sqrt(bt * bt + ht * ht + mt * mt), kt = Math.abs(ht / (ut || 1)), Ft = 0.02, wt = Ft + (1 - Ft) * Math.pow(1 - kt, 5);
            let pt = 0;
            const $t = this.camera.x - (n + 0.5), Rt = this.camera.z - (p + 0.5), At = Math.sqrt($t * $t + Rt * Rt);
            At < 5 && this.camera.y > g + 1 && (pt = (1 - At / 5) * wt * 0.3);
            const Ot = [
              { r: 255, g: 183, b: 197 },
              // Sunset pink
              { r: 255, g: 218, b: 185 },
              // Peach
              { r: 135, g: 206, b: 235 }
              // Sky blue
            ], Ht = Math.min(2, Math.floor((1 - kt) * 3)), St = Ot[Ht], xt = Math.min(1, ut / 20), qt = 30 + xt * 15, Wt = 80 + xt * 20, Yt = 160 - xt * 30, Tt = { r: 100, g: 60, b: 40 }, vt = Math.min(0.7, wt * 1.5);
            let Pt = Math.floor(qt * (1 - vt) + St.r * vt), Bt = Math.floor(Wt * (1 - vt) + St.g * vt), zt = Math.floor(Yt * (1 - vt) + St.b * vt);
            pt > 0 && (Pt = Math.floor(Pt * (1 - pt) + Tt.r * pt), Bt = Math.floor(Bt * (1 - pt) + Tt.g * pt), zt = Math.floor(zt * (1 - pt) + Tt.b * pt));
            const Ct = { x: 0.5, y: 0.8, z: 0.3 }, It = { x: bt / ut, y: ht / ut, z: mt / ut }, yt = {
              x: Ct.x + It.x,
              y: Ct.y + It.y,
              z: Ct.z + It.z
            }, Xt = Math.sqrt(yt.x * yt.x + yt.y * yt.y + yt.z * yt.z), Nt = Math.max(0, yt.y / Xt), Mt = Math.pow(Nt, 32) * ft * 0.6, Zt = Math.sin(K * 2 + n * 1.5) * Math.cos(K * 1.5 + p * 1.5), jt = Math.sin(K * 1.7 - n * 1.2 + p * 0.8), _t = (Zt * jt + 1) * 0.1, Lt = 0.85 + ft * 0.15 + Mt + _t, Gt = Math.min(255, Math.floor(Pt * Lt + Mt * 200)), Ut = Math.min(255, Math.floor(Bt * Lt + Mt * 180)), Kt = Math.min(255, Math.floor(zt * Lt + Mt * 150)), Qt = 0.55, Vt = wt * 0.35, Jt = Math.min(0.9, Qt + Vt);
            st = `rgba(${Gt}, ${Ut}, ${Kt}, ${Jt})`;
          } else if (x === "lava") {
            const K = N * 1.5 + n * 0.3 + p * 0.3, ot = 0.8 + Math.sin(K) * 0.2, at = Math.floor(255 * ot), nt = Math.floor((80 + Math.sin(K * 2) * 30) * ot), ft = Math.floor(30 * (1 - ot * 0.5));
            st = `rgb(${Math.min(255, at)}, ${Math.min(255, nt)}, ${ft})`;
          }
        }
        const ct = G.isTop ? "top" : "side";
        if (v.useTexture && v.texture && !S) {
          let K = st;
          if (this.settings.shadows && G.dark < 1) {
            if (st.startsWith("#"))
              K = this.darkenColor(st, G.dark);
            else if (st.startsWith("rgb")) {
              const ht = st.match(/\d+/g);
              if (ht) {
                const mt = Math.floor(parseInt(ht[0]) * G.dark), ut = Math.floor(parseInt(ht[1]) * G.dark), kt = Math.floor(parseInt(ht[2]) * G.dark);
                K = `rgb(${mt},${ut},${kt})`;
              }
            }
          }
          if (this.debugSettings.wireframeOnly) {
            t.strokeStyle = "rgba(255, 255, 255, 0.8)", t.lineWidth = 1.5, t.beginPath(), t.moveTo(C[0].x, C[0].y), t.lineTo(C[1].x, C[1].y), t.lineTo(C[2].x, C[2].y), t.lineTo(C[3].x, C[3].y), t.closePath(), t.stroke();
            continue;
          }
          t.fillStyle = K, t.beginPath(), t.moveTo(C[0].x, C[0].y), t.lineTo(C[1].x, C[1].y), t.lineTo(C[2].x, C[2].y), t.lineTo(C[3].x, C[3].y), t.fill();
          const ot = this.generateTexture(v.texture, K, ct);
          t.save(), t.beginPath(), t.moveTo(C[0].x, C[0].y), t.lineTo(C[1].x, C[1].y), t.lineTo(C[2].x, C[2].y), t.lineTo(C[3].x, C[3].y), t.closePath(), t.clip();
          const at = Math.min(C[0].x, C[1].x, C[2].x, C[3].x), nt = Math.max(C[0].x, C[1].x, C[2].x, C[3].x), ft = Math.min(C[0].y, C[1].y, C[2].y, C[3].y), bt = Math.max(C[0].y, C[1].y, C[2].y, C[3].y);
          t.globalCompositeOperation = "overlay", t.globalAlpha = 0.4, t.fillStyle = ot, t.fillRect(at - 5, ft - 5, nt - at + 10, bt - ft + 10), t.restore();
        } else
          t.fillStyle = st, t.beginPath(), t.moveTo(C[0].x, C[0].y), t.lineTo(C[1].x, C[1].y), t.lineTo(C[2].x, C[2].y), t.lineTo(C[3].x, C[3].y), t.fill();
      }
    }
    if (this.debugSettings.showRaycastVector) {
      const a = this.raycast();
      if (a) {
        const l = T(i, c, h), n = T(a.hit.x + 0.5, a.hit.y + 0.5, a.hit.z + 0.5);
        l && n && (t.strokeStyle = "rgba(255, 0, 0, 0.8)", t.lineWidth = 3, t.setLineDash([5, 5]), t.beginPath(), t.moveTo(l.x, l.y), t.lineTo(n.x, n.y), t.stroke(), t.setLineDash([]), t.fillStyle = "rgba(255, 0, 0, 0.9)", t.beginPath(), t.arc(n.x, n.y, 5, 0, Math.PI * 2), t.fill());
      }
    }
    if (this.debugSettings.showProjectionTest) {
      const a = u, l = f;
      t.strokeStyle = "rgba(0, 255, 0, 1)", t.lineWidth = 3, t.beginPath(), t.moveTo(a - 20, l), t.lineTo(a + 20, l), t.moveTo(a, l - 20), t.lineTo(a, l + 20), t.stroke(), t.fillStyle = "rgba(0, 255, 0, 1)", t.beginPath(), t.arc(a, l, 5, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(0, 255, 0, 1)", t.strokeStyle = "rgba(0, 0, 0, 0.8)", t.font = "bold 14px monospace", t.lineWidth = 3, t.strokeText("SCREEN CENTER", a + 25, l - 15), t.fillText("SCREEN CENTER", a + 25, l - 15);
    }
    if (this.debugSettings.showDepthOrder) {
      t.fillStyle = "rgba(255, 255, 255, 0.9)", t.strokeStyle = "rgba(0, 0, 0, 0.9)", t.font = "bold 14px monospace", t.lineWidth = 3;
      for (let a = 0; a < Math.min(F.length, 50); a++) {
        const l = F[a], n = T(l.x + 0.5, l.y + 0.5, l.z + 0.5);
        if (n) {
          const g = `#${a}`;
          t.strokeText(g, n.x - 15, n.y + 5), t.fillText(g, n.x - 15, n.y + 5);
        }
      }
    }
    if (this.debugSettings.showFaceNormals) {
      t.strokeStyle = "rgba(255, 255, 0, 0.8)", t.lineWidth = 2;
      for (let a = 0; a < Math.min(F.length, 20); a++) {
        const l = F[a], { x: n, y: g, z: p } = l, x = [
          { center: [n + 0.5, g + 1, p + 0.5], dir: [0, 1, 0], name: "Top" },
          { center: [n + 0.5, g, p + 0.5], dir: [0, -1, 0], name: "Bottom" },
          { center: [n + 0.5, g + 0.5, p + 1], dir: [0, 0, 1], name: "Front" },
          { center: [n + 0.5, g + 0.5, p], dir: [0, 0, -1], name: "Back" },
          { center: [n, g + 0.5, p + 0.5], dir: [-1, 0, 0], name: "Left" },
          { center: [n + 1, g + 0.5, p + 0.5], dir: [1, 0, 0], name: "Right" }
        ];
        for (const v of x) {
          const S = T(v.center[0], v.center[1], v.center[2]), M = T(
            v.center[0] + v.dir[0] * 0.5,
            v.center[1] + v.dir[1] * 0.5,
            v.center[2] + v.dir[2] * 0.5
          );
          if (S && M) {
            t.beginPath(), t.moveTo(S.x, S.y), t.lineTo(M.x, M.y), t.stroke();
            const w = Math.atan2(M.y - S.y, M.x - S.x);
            t.beginPath(), t.moveTo(M.x, M.y), t.lineTo(
              M.x - 8 * Math.cos(w - Math.PI / 6),
              M.y - 8 * Math.sin(w - Math.PI / 6)
            ), t.lineTo(
              M.x - 8 * Math.cos(w + Math.PI / 6),
              M.y - 8 * Math.sin(w + Math.PI / 6)
            ), t.lineTo(M.x, M.y), t.fill();
          }
        }
      }
    }
    if (this.debugSettings.showBoundingBoxes) {
      t.strokeStyle = "rgba(0, 255, 255, 0.6)", t.lineWidth = 1;
      for (let a = 0; a < Math.min(F.length, 30); a++) {
        const l = F[a], { x: n, y: g, z: p } = l, v = [
          [n, g, p],
          [n + 1, g, p],
          [n + 1, g + 1, p],
          [n, g + 1, p],
          [n, g, p + 1],
          [n + 1, g, p + 1],
          [n + 1, g + 1, p + 1],
          [n, g + 1, p + 1]
        ].map((S) => T(S[0], S[1], S[2])).filter((S) => S !== null);
        if (v.length === 8) {
          const S = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            // Back face
            [4, 5],
            [5, 6],
            [6, 7],
            [7, 4],
            // Front face
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7]
            // Connecting edges
          ];
          t.beginPath();
          for (const [M, w] of S)
            t.moveTo(v[M].x, v[M].y), t.lineTo(v[w].x, v[w].y);
          t.stroke();
        }
      }
    }
    if (this.debugSettings.showOverdraw) {
      t.fillStyle = "rgba(255, 255, 255, 0.9)", t.strokeStyle = "rgba(0, 0, 0, 0.9)", t.font = "bold 16px monospace", t.lineWidth = 3;
      const a = `OVERDRAW: ${F.length} blocks rendered`;
      t.strokeText(a, 10, 100), t.fillText(a, 10, 100);
    }
    if (this.worldBounds) {
      const a = this.worldBounds, l = Date.now() * 3e-3, n = 5, g = [
        { axis: "x", value: a.minX, dir: 1 },
        // West wall
        { axis: "x", value: a.maxX, dir: -1 },
        // East wall
        { axis: "z", value: a.minZ, dir: 1 },
        // North wall
        { axis: "z", value: a.maxZ, dir: -1 }
        // South wall
      ];
      for (const v of g) {
        let S;
        if (v.axis === "x" ? S = Math.abs(i - v.value) : S = Math.abs(h - v.value), S > k * 1.5) continue;
        const M = Math.max(a.minY, c - 10);
        for (let w = M; w < a.maxY; w += n) {
          const I = v.axis === "x" ? a.minZ : a.minX, D = v.axis === "x" ? a.maxZ : a.maxX;
          for (let L = I; L < D; L += n) {
            let Q, j;
            if (v.axis === "x" ? (Q = v.value, j = L + n / 2) : (Q = L + n / 2, j = v.value), Math.sqrt((Q - i) ** 2 + (j - h) ** 2) > k) continue;
            let U;
            const tt = Math.min(w + n, a.maxY), J = Math.min(L + n, D);
            v.axis === "x" ? U = [
              [v.value, w, L],
              [v.value, w, J],
              [v.value, tt, J],
              [v.value, tt, L]
            ] : U = [
              [L, w, v.value],
              [J, w, v.value],
              [J, tt, v.value],
              [L, tt, v.value]
            ];
            const O = [];
            let et = !0;
            for (const at of U) {
              const nt = T(at[0], at[1], at[2]);
              if (!nt) {
                et = !1;
                break;
              }
              O.push(nt);
            }
            if (!et || O.length < 4) continue;
            const rt = (U[0][0] + U[2][0]) / 2, lt = (U[0][1] + U[2][1]) / 2, gt = (U[0][2] + U[2][2]) / 2, W = rt - i, G = lt - c, C = gt - h, dt = Math.sqrt(W * W + G * G + C * C);
            let st = !1;
            const ct = Math.max(8, Math.floor(dt / 2));
            for (let at = 1; at < ct; at++) {
              const nt = at / ct, ft = Math.floor(i + W * nt), bt = Math.floor(c + G * nt), ht = Math.floor(h + C * nt), mt = this.world[`${ft},${bt},${ht}`];
              if (mt && !this.fluidBlocks.includes(mt)) {
                const ut = this.blockColors[mt];
                if (!ut || !ut.transparent) {
                  st = !0;
                  break;
                }
              }
            }
            if (st) continue;
            const K = ((L + w) * 0.2 + l) % (Math.PI * 2), ot = 0.15 + 0.1 * Math.sin(K);
            t.fillStyle = `hsla(${180 + Math.sin(l + L * 0.1) * 20}, 100%, 60%, ${ot})`, t.beginPath(), t.moveTo(O[0].x, O[0].y), t.lineTo(O[1].x, O[1].y), t.lineTo(O[2].x, O[2].y), t.lineTo(O[3].x, O[3].y), t.closePath(), t.fill(), t.strokeStyle = `hsla(180, 100%, 70%, ${ot * 2})`, t.lineWidth = 1, t.stroke();
          }
        }
      }
      const p = a.minY;
      if (c > p + 3)
        for (let v = a.minX; v < a.maxX; v += n)
          for (let S = a.minZ; S < a.maxZ; S += n) {
            if (Math.sqrt((v + n / 2 - i) ** 2 + (S + n / 2 - h) ** 2) > k) continue;
            const w = Math.min(v + n, a.maxX), I = Math.min(S + n, a.maxZ), D = [
              [v, p, S],
              [w, p, S],
              [w, p, I],
              [v, p, I]
            ], L = [];
            let Q = !0;
            for (const W of D) {
              const G = T(W[0], W[1], W[2]);
              if (!G) {
                Q = !1;
                break;
              }
              L.push(G);
            }
            if (!Q || L.length < 4) continue;
            const j = v + n / 2, it = S + n / 2, U = j - i, tt = p - c, J = it - h, O = Math.sqrt(U * U + tt * tt + J * J);
            let et = !1;
            const rt = Math.max(8, Math.floor(O / 2));
            for (let W = 1; W < rt; W++) {
              const G = W / rt, C = Math.floor(i + U * G), dt = Math.floor(c + tt * G), st = Math.floor(h + J * G), ct = this.world[`${C},${dt},${st}`];
              if (ct && !this.fluidBlocks.includes(ct)) {
                const K = this.blockColors[ct];
                if (!K || !K.transparent) {
                  et = !0;
                  break;
                }
              }
            }
            if (et) continue;
            const lt = ((v + S) * 0.2 + l) % (Math.PI * 2), gt = 0.1 + 0.08 * Math.sin(lt);
            t.fillStyle = `hsla(${280 + Math.sin(l + v * 0.1) * 20}, 100%, 50%, ${gt})`, t.beginPath(), t.moveTo(L[0].x, L[0].y), t.lineTo(L[1].x, L[1].y), t.lineTo(L[2].x, L[2].y), t.lineTo(L[3].x, L[3].y), t.closePath(), t.fill(), t.strokeStyle = `hsla(280, 100%, 60%, ${gt * 2})`, t.lineWidth = 1, t.stroke();
          }
    }
    for (const a of this.birds) {
      const l = a.x - i, n = a.y - c, g = a.z - h;
      if (l * E + g * z < 0 || l * l + n * n + g * g > P) continue;
      const v = T(a.x, a.y, a.z);
      if (!v) continue;
      const S = a.size * y / v.z;
      if (S < 2) continue;
      const M = Math.sin(a.wingPhase) * 0.5;
      a.angle + Math.PI / 2, t.fillStyle = "#d85a8a", t.beginPath(), t.ellipse(v.x, v.y, S * 0.8, S * 0.4, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ff9ec4";
      const w = S * 1.5, I = S * 0.6 * (1 + M);
      t.beginPath(), t.moveTo(v.x, v.y), t.quadraticCurveTo(
        v.x - w * 0.5,
        v.y - I,
        v.x - w,
        v.y + S * 0.2
      ), t.quadraticCurveTo(
        v.x - w * 0.5,
        v.y + S * 0.1,
        v.x,
        v.y
      ), t.fill(), t.beginPath(), t.moveTo(v.x, v.y), t.quadraticCurveTo(
        v.x + w * 0.5,
        v.y - I,
        v.x + w,
        v.y + S * 0.2
      ), t.quadraticCurveTo(
        v.x + w * 0.5,
        v.y + S * 0.1,
        v.x,
        v.y
      ), t.fill(), t.fillStyle = "#d85a8a", t.beginPath(), t.arc(v.x + S * 0.6, v.y - S * 0.1, S * 0.3, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ffaa00", t.beginPath(), t.moveTo(v.x + S * 0.9, v.y - S * 0.1), t.lineTo(v.x + S * 1.2, v.y), t.lineTo(v.x + S * 0.9, v.y + S * 0.1), t.fill();
    }
    for (const a of this.pestBirds) {
      const l = T(a.x, a.y, a.z);
      if (!l) continue;
      const n = a.size * y / l.z;
      if (n < 1) continue;
      const g = Math.sin(a.wingPhase) * 0.7, p = a.anger || 0, x = Math.min(255, 107 + p * 30), v = Math.max(0, 68 - p * 10), S = Math.max(0, 35 - p * 7), M = a.state === "swooping", w = p > 0 ? `rgb(${x}, ${v}, ${S})` : M ? "#8b4513" : "#6b4423", I = p > 0 ? `rgb(${Math.min(255, x + 30)}, ${v + 20}, ${S + 10})` : M ? "#a0522d" : "#8b7355";
      t.fillStyle = w, t.beginPath(), t.ellipse(l.x, l.y, n * 0.6, n * 0.5, 0, 0, Math.PI * 2), t.fill(), p >= 3 && (t.shadowColor = "#ff0000", t.shadowBlur = p * 3), t.fillStyle = I;
      const D = n * 1.2, L = n * 0.8 * (1 + g);
      t.beginPath(), t.moveTo(l.x, l.y), t.quadraticCurveTo(
        l.x - D * 0.4,
        l.y - L,
        l.x - D,
        l.y
      ), t.quadraticCurveTo(
        l.x - D * 0.4,
        l.y + n * 0.2,
        l.x,
        l.y
      ), t.fill(), t.beginPath(), t.moveTo(l.x, l.y), t.quadraticCurveTo(
        l.x + D * 0.4,
        l.y - L,
        l.x + D,
        l.y
      ), t.quadraticCurveTo(
        l.x + D * 0.4,
        l.y + n * 0.2,
        l.x,
        l.y
      ), t.fill(), t.fillStyle = w, t.beginPath(), t.arc(l.x + n * 0.4, l.y - n * 0.15, n * 0.25, 0, Math.PI * 2), t.fill(), t.fillStyle = "#000", t.beginPath(), t.arc(l.x + n * 0.45, l.y - n * 0.2, n * 0.08, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ff6600", t.beginPath(), t.moveTo(l.x + n * 0.6, l.y - n * 0.15), t.lineTo(l.x + n * 0.85, l.y - n * 0.1), t.lineTo(l.x + n * 0.6, l.y - n * 0.05), t.fill(), t.fillStyle = I, t.beginPath(), t.moveTo(l.x - n * 0.4, l.y), t.lineTo(l.x - n * 0.9, l.y - n * 0.1), t.lineTo(l.x - n * 0.95, l.y + n * 0.05), t.lineTo(l.x - n * 0.85, l.y + n * 0.15), t.lineTo(l.x - n * 0.4, l.y + n * 0.1), t.fill(), t.shadowBlur = 0, t.shadowColor = "transparent";
    }
    if (this.blueBirds)
      for (const a of this.blueBirds) {
        const l = T(a.x, a.y, a.z);
        if (!l) continue;
        const n = Math.max(8, 25 / l.z), g = Math.sin(a.wingPhase) * 0.6, p = n * 0.5 * (1 + g);
        t.fillStyle = "#1e90ff", t.beginPath(), t.ellipse(l.x, l.y, n * 0.5, n * 0.3, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = "#00bfff";
        const x = n * 1.2;
        t.beginPath(), t.moveTo(l.x, l.y), t.quadraticCurveTo(l.x - x * 0.5, l.y - p, l.x - x, l.y), t.quadraticCurveTo(l.x - x * 0.5, l.y + n * 0.2, l.x, l.y), t.fill(), t.beginPath(), t.moveTo(l.x, l.y), t.quadraticCurveTo(l.x + x * 0.5, l.y - p, l.x + x, l.y), t.quadraticCurveTo(l.x + x * 0.5, l.y + n * 0.2, l.x, l.y), t.fill(), t.fillStyle = "#ff0000", t.beginPath(), t.arc(l.x + n * 0.3, l.y - n * 0.1, n * 0.15, 0, Math.PI * 2), t.fill();
      }
    if (this.fish)
      for (const a of this.fish) {
        const l = T(a.x, a.y, a.z);
        if (!l) continue;
        const n = Math.max(4, a.size * 30 / l.z), g = Math.sin(a.swimPhase) * 0.2;
        t.save(), t.translate(l.x, l.y), t.rotate(Math.atan2(a.vz, a.vx) + g), t.fillStyle = a.color, t.beginPath(), t.ellipse(0, 0, n, n * 0.4, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.moveTo(-n * 0.8, 0), t.lineTo(-n * 1.5, -n * 0.4), t.lineTo(-n * 1.5, n * 0.4), t.closePath(), t.fill(), t.fillStyle = "#000", t.beginPath(), t.arc(n * 0.5, -n * 0.1, n * 0.15, 0, Math.PI * 2), t.fill(), t.restore();
      }
    if (this.cats)
      for (const a of this.cats) {
        const l = T(a.x, a.y + 0.3, a.z);
        if (!l) continue;
        const n = Math.max(10, 40 / l.z), g = Math.sin(a.walkPhase) * n * 0.05;
        t.fillStyle = a.color, t.beginPath(), t.ellipse(l.x, l.y + g, n * 0.6, n * 0.4, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.arc(l.x + n * 0.5, l.y - n * 0.2 + g, n * 0.35, 0, Math.PI * 2), t.fill(), t.beginPath(), t.moveTo(l.x + n * 0.3, l.y - n * 0.5 + g), t.lineTo(l.x + n * 0.4, l.y - n * 0.2 + g), t.lineTo(l.x + n * 0.5, l.y - n * 0.5 + g), t.fill(), t.beginPath(), t.moveTo(l.x + n * 0.6, l.y - n * 0.5 + g), t.lineTo(l.x + n * 0.7, l.y - n * 0.2 + g), t.lineTo(l.x + n * 0.5, l.y - n * 0.5 + g), t.fill(), t.fillStyle = "#00ff00", t.beginPath(), t.ellipse(l.x + n * 0.4, l.y - n * 0.25 + g, n * 0.08, n * 0.12, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.ellipse(l.x + n * 0.6, l.y - n * 0.25 + g, n * 0.08, n * 0.12, 0, 0, Math.PI * 2), t.fill(), t.strokeStyle = a.color, t.lineWidth = n * 0.1, t.lineCap = "round", t.beginPath(), t.moveTo(l.x - n * 0.5, l.y + g), t.quadraticCurveTo(l.x - n * 0.8, l.y - n * 0.3, l.x - n * 0.7, l.y - n * 0.5), t.stroke();
      }
    if (this.creepers)
      for (const a of this.creepers) {
        const l = T(a.x, a.y + 0.8, a.z);
        if (!l) continue;
        const n = Math.max(15, 50 / l.z), g = a.state === "fusing" && a.flashing ? "#ffffff" : "#00aa00";
        t.fillStyle = g, t.fillRect(l.x - n * 0.3, l.y - n * 0.5, n * 0.6, n), t.fillRect(l.x - n * 0.35, l.y - n * 0.9, n * 0.7, n * 0.5), t.fillStyle = "#000", t.fillRect(l.x - n * 0.25, l.y - n * 0.8, n * 0.15, n * 0.15), t.fillRect(l.x + n * 0.1, l.y - n * 0.8, n * 0.15, n * 0.15), t.fillRect(l.x - n * 0.2, l.y - n * 0.55, n * 0.1, n * 0.15), t.fillRect(l.x + n * 0.1, l.y - n * 0.55, n * 0.1, n * 0.15), t.fillRect(l.x - n * 0.1, l.y - n * 0.5, n * 0.2, n * 0.1), t.fillStyle = g, t.fillRect(l.x - n * 0.3, l.y + n * 0.4, n * 0.2, n * 0.3), t.fillRect(l.x + n * 0.1, l.y + n * 0.4, n * 0.2, n * 0.3);
      }
    if (this.repairNPC) {
      const a = this.repairNPC, l = T(a.x, a.y + 0.9, a.z);
      if (l) {
        const n = Math.max(20, 60 / l.z);
        t.fillStyle = "#4169e1", t.fillRect(l.x - n * 0.35, l.y - n * 0.3, n * 0.7, n * 0.8), t.fillStyle = "#d2b48c", t.beginPath(), t.arc(l.x, l.y - n * 0.6, n * 0.3, 0, Math.PI * 2), t.fill(), t.fillStyle = "#191970", t.beginPath(), t.moveTo(l.x - n * 0.35, l.y - n * 0.8), t.lineTo(l.x, l.y - n * 1.3), t.lineTo(l.x + n * 0.35, l.y - n * 0.8), t.closePath(), t.fill(), t.fillRect(l.x - n * 0.4, l.y - n * 0.85, n * 0.8, n * 0.1), t.fillStyle = "#ddd", t.beginPath(), t.moveTo(l.x - n * 0.2, l.y - n * 0.5), t.lineTo(l.x - n * 0.15, l.y - n * 0.2), t.lineTo(l.x + n * 0.15, l.y - n * 0.2), t.lineTo(l.x + n * 0.2, l.y - n * 0.5), t.closePath(), t.fill(), t.fillStyle = "#000", t.beginPath(), t.arc(l.x - n * 0.12, l.y - n * 0.65, n * 0.05, 0, Math.PI * 2), t.fill(), t.beginPath(), t.arc(l.x + n * 0.12, l.y - n * 0.65, n * 0.05, 0, Math.PI * 2), t.fill(), a.showPrompt && (t.fillStyle = "rgba(0, 0, 0, 0.7)", t.fillRect(l.x - 80, l.y - n - 40, 160, 30), t.fillStyle = "#ffd700", t.font = "14px Arial", t.textAlign = "center", t.fillText("[E] Talk to Gunsmith", l.x, l.y - n - 22));
      }
    }
    for (const a of this.particles) {
      const l = T(a.x, a.y, a.z);
      if (l) {
        if (a.type === "bullet") {
          const n = a.x - this.camera.x, g = a.y - this.camera.y, p = a.z - this.camera.z;
          let x = !1;
          for (let S = 0.3; S < 0.95; S += 0.2) {
            const M = this.camera.x + n * S, w = this.camera.y + g * S, I = this.camera.z + p * S, D = this.getBlock(Math.floor(M), Math.floor(w), Math.floor(I));
            if (D && !this.fluidBlocks.includes(D)) {
              x = !0;
              break;
            }
          }
          if (x) continue;
          if (a.trail.length > 1) {
            t.strokeStyle = "rgba(255, 200, 50, 0.8)", t.lineWidth = 2, t.beginPath();
            let S = !1;
            for (let M = 0; M < a.trail.length; M++) {
              const w = T(a.trail[M].x, a.trail[M].y, a.trail[M].z);
              w && (S ? t.lineTo(w.x, w.y) : (t.moveTo(w.x, w.y), S = !0));
            }
            S && (t.lineTo(l.x, l.y), t.stroke());
          }
          const v = Math.max(2, 8 / l.z);
          t.fillStyle = "#ffcc00", t.beginPath(), t.arc(l.x, l.y, v, 0, Math.PI * 2), t.fill();
        } else if (a.type === "ricochet" || a.type === "spark") {
          const n = Math.max(1, (a.size || 3) * 20 / l.z), g = Math.min(1, a.life / 15);
          t.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 50, ${g})`, t.beginPath(), t.arc(l.x, l.y, n, 0, Math.PI * 2), t.fill();
        } else if (a.type === "blessing") {
          const n = Math.max(2, (a.size || 4) * 20 / l.z), g = Math.min(1, a.life / 30), p = Math.sin(a.life * 0.3) * 0.5 + 0.5;
          t.fillStyle = `rgba(255, 215, 0, ${g * 0.3})`, t.beginPath(), t.arc(l.x, l.y, n * 2, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, ${200 + p * 55}, ${100 + p * 155}, ${g})`, t.beginPath(), t.arc(l.x, l.y, n, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 255, 255, ${g * p})`, t.beginPath(), t.arc(l.x, l.y, n * 0.3, 0, Math.PI * 2), t.fill();
        } else if (a.type === "explosion") {
          const n = Math.max(3, (a.size || 5) * 25 / l.z), g = Math.min(1, a.life / 20), p = Math.random() * 0.3 + 0.7;
          t.fillStyle = `rgba(255, 100, 0, ${g * 0.4})`, t.beginPath(), t.arc(l.x, l.y, n * 1.5, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 0, ${g * p})`, t.beginPath(), t.arc(l.x, l.y, n, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 255, ${Math.random() * 100}, ${g * 0.8})`, t.beginPath(), t.arc(l.x, l.y, n * 0.4, 0, Math.PI * 2), t.fill();
        } else if (a.type === "feather") {
          const n = Math.max(2, 15 / l.z), g = Math.min(1, a.life / 20);
          t.save(), t.translate(l.x, l.y), t.rotate(a.rotation), t.fillStyle = `rgba(139, 90, 43, ${g})`, t.beginPath(), t.ellipse(0, 0, n * 2, n * 0.5, 0, 0, Math.PI * 2), t.fill(), t.strokeStyle = `rgba(100, 60, 30, ${g})`, t.lineWidth = 1, t.beginPath(), t.moveTo(-n * 2, 0), t.lineTo(n * 2, 0), t.stroke(), t.restore();
        } else if (a.type === "petal") {
          const n = a.x - this.camera.x, g = a.y - this.camera.y, p = a.z - this.camera.z;
          let x = !1;
          for (let M = 0.2; M < 0.9; M += 0.25) {
            const w = this.camera.x + n * M, I = this.camera.y + g * M, D = this.camera.z + p * M, L = this.getBlock(Math.floor(w), Math.floor(I), Math.floor(D));
            if (L && !this.fluidBlocks.includes(L)) {
              x = !0;
              break;
            }
          }
          if (x) continue;
          const v = Math.max(2, (a.size || 4) * 15 / l.z), S = Math.min(1, a.life / 50);
          t.save(), t.translate(l.x, l.y), t.rotate(a.rotation), t.fillStyle = `rgba(255, 183, 197, ${S})`, t.beginPath(), t.ellipse(0, 0, v * 1.5, v * 0.7, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 150, 170, ${S})`, t.beginPath(), t.ellipse(0, 0, v * 0.5, v * 0.3, 0, 0, Math.PI * 2), t.fill(), t.restore();
        } else if (a.type === "burger") {
          const n = Math.max(3, (a.size || 8) * 20 / l.z);
          t.save(), t.translate(l.x, l.y), t.fillStyle = "#D2691E", t.beginPath(), t.ellipse(0, -n * 0.3, n, n * 0.5, 0, Math.PI, 0), t.fill(), t.fillStyle = "#654321", t.fillRect(-n, -n * 0.2, n * 2, n * 0.4), t.fillStyle = "#228B22", t.fillRect(-n * 0.9, n * 0.1, n * 1.8, n * 0.15), t.fillStyle = "#DEB887", t.beginPath(), t.ellipse(0, n * 0.3, n, n * 0.4, 0, 0, Math.PI), t.fill(), t.restore();
        } else if (a.type === "burgerSplat") {
          const n = Math.max(2, (a.size || 4) * 10 / l.z), g = Math.min(1, a.life / 10), p = ["#D2691E", "#654321", "#228B22", "#FF6347"];
          t.fillStyle = p[Math.floor(Math.random() * p.length)].replace(")", `, ${g})`).replace("rgb", "rgba"), t.beginPath(), t.arc(l.x, l.y, n, 0, Math.PI * 2), t.fill();
        } else if (a.type === "apple") {
          const n = Math.max(3, (a.size || 6) * 18 / l.z);
          t.save(), t.translate(l.x, l.y), t.fillStyle = "#dc143c", t.beginPath(), t.arc(0, 0, n, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(255, 255, 255, 0.3)", t.beginPath(), t.arc(-n * 0.3, -n * 0.3, n * 0.4, 0, Math.PI * 2), t.fill(), t.fillStyle = "#654321", t.fillRect(-1, -n - 3, 2, 4), t.fillStyle = "#228b22", t.beginPath(), t.ellipse(3, -n - 1, 4, 2, 0.3, 0, Math.PI * 2), t.fill(), t.restore();
        } else if (a.type === "appleSplat") {
          const n = Math.max(2, (a.size || 3) * 8 / l.z), g = Math.min(1, a.life / 10);
          t.fillStyle = `rgba(220, 20, 60, ${g})`, t.beginPath(), t.arc(l.x, l.y, n, 0, Math.PI * 2), t.fill();
        }
      }
    }
    if (this.droppedItems)
      for (const l of this.droppedItems) {
        const n = l.x - i, g = l.y - c, p = l.z - h;
        if (n * n + g * g + p * p > 400) continue;
        let v = !1;
        for (let I = 0.15; I < 0.9; I += 0.2) {
          const D = i + n * I, L = c + g * I, Q = h + p * I, j = this.getBlock(Math.floor(D), Math.floor(L), Math.floor(Q));
          if (j && !this.fluidBlocks.includes(j)) {
            v = !0;
            break;
          }
        }
        if (v) continue;
        const S = Math.sin(l.bobPhase) * 0.1, M = T(l.x, l.y + S, l.z);
        if (!M || M.z <= 0) continue;
        const w = Math.max(6, 30 / M.z);
        this.drawDroppedItem3D(t, M.x, M.y, w, l.type, l.bobPhase), l.count > 1 && (t.font = `bold ${Math.max(8, w * 0.5)}px monospace`, t.fillStyle = "#fff", t.strokeStyle = "#000", t.lineWidth = 2, t.textAlign = "center", t.strokeText(l.count.toString(), M.x + w * 0.5, M.y + w * 0.4), t.fillText(l.count.toString(), M.x + w * 0.5, M.y + w * 0.4));
      }
    if (!this.isPaused && this.pointerLocked) {
      const a = this.raycast();
      if (a && a.hit) {
        const l = a.hit.x, n = a.hit.y, g = a.hit.z, p = 5e-3, v = [
          [l - p, n - p, g - p],
          [l + 1 + p, n - p, g - p],
          [l + 1 + p, n + 1 + p, g - p],
          [l - p, n + 1 + p, g - p],
          [l - p, n - p, g + 1 + p],
          [l + 1 + p, n - p, g + 1 + p],
          [l + 1 + p, n + 1 + p, g + 1 + p],
          [l - p, n + 1 + p, g + 1 + p]
        ].map((M) => T(M[0], M[1], M[2]));
        if (v.every((M) => M !== null)) {
          let M = "rgba(0, 0, 0, 0.8)", w = 2;
          a.throughWater ? (M = "rgba(74, 144, 217, 0.7)", w = 3) : a.throughLava && (M = "rgba(255, 100, 0, 0.7)", w = 3), t.strokeStyle = M, t.lineWidth = w;
          const I = [
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
          for (const [D, L] of I)
            t.moveTo(v[D].x, v[D].y), t.lineTo(v[L].x, v[L].y);
          t.stroke();
        }
        const S = this.getBlock(l, n, g);
        this.updateBlockTooltip(S);
      } else
        this.updateBlockTooltip(null);
    }
    if (this.debugSettings.showCoords && (t.fillStyle = "rgba(0, 0, 0, 0.7)", t.fillRect(e - 200, 10, 190, 80), t.fillStyle = "#0f0", t.font = "12px monospace", t.textAlign = "left", t.fillText(`X: ${this.camera.x.toFixed(2)}`, e - 190, 28), t.fillText(`Y: ${this.camera.y.toFixed(2)}`, e - 190, 43), t.fillText(`Z: ${this.camera.z.toFixed(2)}`, e - 190, 58), t.fillText(`Blocks: ${Object.keys(this.world).length}`, e - 190, 73), t.fillText(`Birds: ${this.pestBirds.length}`, e - 190, 88)), this.renderPlayerModel(t, u, f, e, s), !this.isPaused && this.pointerLocked && (t.strokeStyle = "#fff", t.lineWidth = 2, t.beginPath(), t.moveTo(u - 10, f), t.lineTo(u + 10, f), t.moveTo(u, f - 10), t.lineTo(u, f + 10), t.stroke()), this.birdEvent && this.birdEvent.alertMessage && this.birdEvent.alertFade > 0) {
      const a = Math.min(1, this.birdEvent.alertFade / 1e3), l = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
      t.save(), t.globalAlpha = a, t.fillStyle = `rgba(0, 0, 0, ${0.7 * l})`;
      const n = Math.min(e * 0.8, 500), g = 60, p = (e - n) / 2, x = 80;
      t.fillRect(p, x, n, g), t.strokeStyle = `rgba(255, 100, 100, ${l})`, t.lineWidth = 3, t.strokeRect(p, x, n, g), t.fillStyle = `rgba(255, 255, 255, ${l})`, t.font = "bold 20px monospace", t.textAlign = "center", t.fillText(this.birdEvent.alertMessage, e / 2, x + 38), t.restore();
    }
    if (this.birdEvent && !this.isPaused) {
      const a = Math.max(0, this.birdEvent.timer), l = Math.floor(a / 6e4), n = Math.floor(a % 6e4 / 1e3), g = `🐦 ${l}:${n.toString().padStart(2, "0")}`;
      t.save(), t.fillStyle = "rgba(0, 0, 0, 0.5)", t.fillRect(e - 100, 10, 90, 25), t.fillStyle = a < 6e4 ? "#ff6666" : "#fff", t.font = "14px monospace", t.textAlign = "right", t.fillText(g, e - 15, 28), t.restore();
    }
    if (this.selectedItem === "ka69" && !this.isPaused) {
      const a = Math.min(e, s) * 55e-4, l = e * 0.75, n = s * 0.78;
      t.save(), t.translate(l, n), t.rotate(-0.1), t.fillStyle = "#d4a574", t.beginPath(), t.ellipse(45 * a, 25 * a, 18 * a, 12 * a, 0.3, 0, Math.PI * 2), t.fill(), t.fillStyle = "#c49a6c";
      for (let g = 0; g < 4; g++)
        t.beginPath(), t.ellipse((35 + g * 7) * a, 35 * a, 4 * a, 8 * a, 0.2, 0, Math.PI * 2), t.fill();
      t.fillStyle = "#d4a574", t.beginPath(), t.ellipse(30 * a, 15 * a, 6 * a, 10 * a, -0.5, 0, Math.PI * 2), t.fill(), t.fillStyle = "#5a3d2b", t.beginPath(), t.moveTo(80 * a, -5 * a), t.lineTo(160 * a, 0 * a), t.lineTo(165 * a, 25 * a), t.lineTo(155 * a, 30 * a), t.lineTo(80 * a, 25 * a), t.closePath(), t.fill(), t.fillStyle = "#6b4d3b", t.fillRect(100 * a, 2 * a, 50 * a, 8 * a), t.fillRect(95 * a, 15 * a, 55 * a, 6 * a), t.fillStyle = "#333", t.fillRect(155 * a, -2 * a, 8 * a, 30 * a), t.fillStyle = "#2a2a2a", t.fillRect(-30 * a, -8 * a, 115 * a, 30 * a), t.fillStyle = "#3a3a3a", t.fillRect(-25 * a, -12 * a, 100 * a, 8 * a), t.fillStyle = "#1a1a1a", t.fillRect(15 * a, -6 * a, 25 * a, 12 * a), t.fillStyle = "#1a1a1a", t.fillRect(-140 * a, -4 * a, 115 * a, 14 * a), t.fillStyle = "#111", t.fillRect(-180 * a, 0 * a, 45 * a, 8 * a), t.fillStyle = "#000", t.beginPath(), t.ellipse(-182 * a, 4 * a, 3 * a, 3 * a, 0, 0, Math.PI * 2), t.fill(), t.fillStyle = "#333", t.fillRect(-130 * a, -10 * a, 100 * a, 5 * a), t.fillStyle = "#111";
      for (let g = 0; g < 4; g++)
        t.beginPath(), t.ellipse((-120 + g * 22) * a, 3 * a, 6 * a, 3 * a, 0, 0, Math.PI * 2), t.fill();
      t.fillStyle = "#1a1a1a", t.fillRect(-145 * a, -20 * a, 6 * a, 18 * a), t.fillRect(-148 * a, -22 * a, 12 * a, 4 * a), t.fillRect(-5 * a, -18 * a, 15 * a, 8 * a), t.fillStyle = "#333", t.beginPath(), t.moveTo(10 * a, 22 * a), t.lineTo(35 * a, 22 * a), t.quadraticCurveTo(45 * a, 50 * a, 35 * a, 80 * a), t.lineTo(15 * a, 85 * a), t.quadraticCurveTo(5 * a, 55 * a, 10 * a, 22 * a), t.closePath(), t.fill(), t.strokeStyle = "#222", t.lineWidth = 1.5 * a;
      for (let g = 0; g < 4; g++)
        t.beginPath(), t.moveTo((12 + g * 2) * a, (35 + g * 12) * a), t.lineTo((32 + g * 1) * a, (38 + g * 12) * a), t.stroke();
      t.fillStyle = "#5a3d2b", t.beginPath(), t.moveTo(45 * a, 22 * a), t.lineTo(65 * a, 22 * a), t.lineTo(70 * a, 65 * a), t.lineTo(45 * a, 70 * a), t.closePath(), t.fill(), t.fillStyle = "#4a2d1b";
      for (let g = 0; g < 5; g++)
        t.fillRect(50 * a, (28 + g * 8) * a, 12 * a, 3 * a);
      if (t.strokeStyle = "#2a2a2a", t.lineWidth = 3 * a, t.beginPath(), t.arc(25 * a, 35 * a, 15 * a, -0.8, 2.2), t.stroke(), t.fillStyle = "#222", t.fillRect(22 * a, 28 * a, 4 * a, 12 * a), this.muzzleFlash > 0) {
        const g = 25 + Math.random() * 20, p = -190 * a, x = 4 * a;
        t.fillStyle = "rgba(255, 100, 0, 0.5)", t.beginPath(), t.arc(p, x, g * a * 1.5, 0, Math.PI * 2), t.fill(), t.fillStyle = "rgba(255, 150, 0, 0.8)", t.beginPath(), t.arc(p, x, g * a, 0, Math.PI * 2), t.fill(), t.fillStyle = "#ffff00", t.beginPath(), t.arc(p, x, g * a * 0.4, 0, Math.PI * 2), t.fill(), t.strokeStyle = "#ffff88", t.lineWidth = 2;
        for (let v = 0; v < 6; v++) {
          const S = Math.PI + (Math.random() - 0.5) * 1.5, M = (20 + Math.random() * 35) * a;
          t.beginPath(), t.moveTo(p, x), t.lineTo(p + Math.cos(S) * M, x + Math.sin(S) * M), t.stroke();
        }
      }
      t.restore();
    }
    if (this.hotbarTooltip.visible) {
      const a = Date.now() - this.hotbarTooltip.timestamp, l = 1e3, n = 500;
      let g = 1;
      if (a > l && (g = 1 - Math.min(1, (a - l) / n)), g > 0) {
        const x = 24 * (1 + Math.sin(a * 0.01) * 0.1), v = e / 2, S = s - 120;
        t.save(), t.textAlign = "center", t.textBaseline = "middle", t.shadowColor = "rgba(0, 0, 0, 0.8)", t.shadowBlur = 8, t.shadowOffsetX = 2, t.shadowOffsetY = 2, t.font = `bold ${x}px Arial`, t.fillStyle = `rgba(255, 255, 255, ${g})`, t.fillText(this.hotbarTooltip.text, v, S), t.restore();
      }
    }
    if (this.headSubmergedWater && (t.fillStyle = "rgba(0, 100, 200, 0.25)", t.fillRect(0, 0, e, s)), this.headSubmergedLava) {
      const a = Date.now() * 5e-3;
      t.fillStyle = "rgba(255, 80, 0, 0.4)", t.fillRect(0, 0, e, s), t.fillStyle = "rgba(255, 50, 0, 0.6)";
      for (let n = 0; n < 12; n++) {
        const g = n / 12 * e, p = 60 + Math.sin(a + n * 0.8) * 30 + Math.sin(a * 1.5 + n) * 20;
        t.beginPath(), t.moveTo(g - 30, s), t.quadraticCurveTo(g, s - p, g + 30, s), t.fill();
      }
      t.fillStyle = "rgba(255, 100, 0, 0.5)";
      for (let n = 0; n < 8; n++) {
        const g = n / 8 * e + 40, p = 40 + Math.sin(a * 0.8 + n * 1.2) * 25;
        t.beginPath(), t.moveTo(g - 25, 0), t.quadraticCurveTo(g, p, g + 25, 0), t.fill();
      }
      t.fillStyle = "rgba(255, 60, 0, 0.5)";
      for (let n = 0; n < 6; n++) {
        const g = n / 6 * s, p = 40 + Math.sin(a + n) * 20;
        t.beginPath(), t.moveTo(0, g - 30), t.quadraticCurveTo(p, g, 0, g + 30), t.fill(), t.beginPath(), t.moveTo(e, g - 30), t.quadraticCurveTo(e - p, g, e, g + 30), t.fill();
      }
      const l = t.createRadialGradient(e / 2, s / 2, 0, e / 2, s / 2, e * 0.7);
      l.addColorStop(0, "rgba(255, 50, 0, 0)"), l.addColorStop(0.7, "rgba(255, 30, 0, 0.3)"), l.addColorStop(1, "rgba(200, 0, 0, 0.6)"), t.fillStyle = l, t.fillRect(0, 0, e, s);
    }
  },
  project(t, e, s) {
    const o = t - this.camera.x, i = e - this.camera.y, c = s - this.camera.z, h = Math.cos(-this.camera.rotY), d = Math.sin(-this.camera.rotY), r = o * h - c * d, m = o * d + c * h, b = Math.cos(-this.camera.rotX), u = Math.sin(-this.camera.rotX), f = i * b - m * u, y = i * u + m * b;
    if (y <= 0.1) return null;
    const k = 400, P = this.canvas.width / 2 + r / y * k, T = this.canvas.height / 2 - f / y * k;
    return { x: P, y: T, z: y };
  },
  // Update block tooltip display
  updateBlockTooltip(t) {
    const e = document.getElementById("blockTooltip");
    if (!e) return;
    const o = t ? {
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
    if (o) {
      e.classList.add("active"), e.querySelector(".tooltip-title").textContent = o.name;
      const i = o.item === "FILLED";
      e.querySelector(".tooltip-desc").innerHTML = `<span style="color:${i ? "#4f4" : "#ffd700"}">${o.item}</span><br>${o.desc}`;
    } else
      e.classList.remove("active");
  },
  // Render player model (first-person body visible when looking down)
  renderPlayerModel(t, e, s, o, i) {
    const c = Math.max(0, this.camera.rotX * 2);
    if (c < 0.05) {
      this.renderHeldItem(t, e, s, o, i);
      return;
    }
    const h = Math.min(1, c);
    t.save();
    const d = i - 50 + (1 - c) * 200;
    this.drawPlayerBody3D(t, e, d, h, c), t.restore(), this.renderHeldItem(t, e, s, o, i);
  },
  // Render held item in first person
  renderHeldItem(t, e, s, o, i) {
    const c = this.inventory.hotbar[this.selectedSlot];
    if (!c) return;
    const h = c.id, d = Math.sin(Date.now() * 3e-3) * 3, r = o - 120, m = i - 100 + d, b = 60;
    t.save(), t.translate(r, m), t.rotate(-0.2), t.fillStyle = "#ffdab9", t.beginPath(), t.ellipse(0, 20, 25, 35, 0.3, 0, Math.PI * 2), t.fill();
    const u = this.blockColors[h];
    if (u) {
      const f = b * 0.5;
      t.translate(0, -10), t.fillStyle = u.top, t.beginPath(), t.moveTo(0, -f), t.lineTo(f, -f / 2), t.lineTo(0, 0), t.lineTo(-f, -f / 2), t.closePath(), t.fill(), t.fillStyle = u.side, t.beginPath(), t.moveTo(-f, -f / 2), t.lineTo(0, 0), t.lineTo(0, f), t.lineTo(-f, f / 2), t.closePath(), t.fill(), t.fillStyle = this.darkenColor(u.side, 0.7), t.beginPath(), t.moveTo(0, 0), t.lineTo(f, -f / 2), t.lineTo(f, f / 2), t.lineTo(0, f), t.closePath(), t.fill();
    } else if (h === "ka69")
      t.fillStyle = "#333", t.fillRect(-30, -20, 80, 15), t.fillStyle = "#8b4513", t.fillRect(-10, -5, 25, 25), t.fillStyle = "#222", t.fillRect(10, -5, 8, 20);
    else if (h === "berdger")
      t.fillStyle = "#daa520", t.beginPath(), t.ellipse(0, -15, 25, 12, 0, Math.PI, 0), t.fill(), t.fillStyle = "#8b4513", t.fillRect(-22, -8, 44, 10), t.fillStyle = "#228b22", t.fillRect(-20, 0, 40, 5), t.fillStyle = "#daa520", t.beginPath(), t.ellipse(0, 10, 23, 10, 0, 0, Math.PI), t.fill();
    else if (h === "apple")
      t.fillStyle = "#dc143c", t.beginPath(), t.arc(0, -5, 20, 0, Math.PI * 2), t.fill(), t.fillStyle = "#654321", t.fillRect(-2, -30, 4, 10), t.fillStyle = "#228b22", t.beginPath(), t.ellipse(5, -28, 8, 4, 0.5, 0, Math.PI * 2), t.fill();
    else if (h === "water_bucket" || h === "lava_bucket")
      t.fillStyle = "#888", t.beginPath(), t.moveTo(-20, -25), t.lineTo(20, -25), t.lineTo(15, 15), t.lineTo(-15, 15), t.closePath(), t.fill(), t.fillStyle = h === "water_bucket" ? "#4a90d9" : "#ff6600", t.fillRect(-15, -15, 30, 25);
    else if (h === "seeds") {
      t.fillStyle = "#daa520";
      for (let f = 0; f < 5; f++)
        t.beginPath(), t.ellipse(Math.cos(f) * 10, Math.sin(f) * 8 - 10, 4, 6, f, 0, Math.PI * 2), t.fill();
    }
    t.restore();
  },
  // Draw the player body in 3D style with shading
  drawPlayerBody3D(t, e, s, o, i) {
    t.save();
    const c = t.createLinearGradient(e - 50, s, e + 50, s);
    c.addColorStop(0, `rgba(180, 130, 150, ${o})`), c.addColorStop(0.3, `rgba(255, 183, 197, ${o})`), c.addColorStop(0.7, `rgba(255, 183, 197, ${o})`), c.addColorStop(1, `rgba(180, 130, 150, ${o})`), t.fillStyle = c, t.beginPath(), t.moveTo(e - 35, s + 5), t.lineTo(e + 35, s + 5), t.quadraticCurveTo(e + 50, s + 40, e + 45, s + 80), t.lineTo(e - 45, s + 80), t.quadraticCurveTo(e - 50, s + 40, e - 35, s + 5), t.closePath(), t.fill(), t.fillStyle = `rgba(255, 240, 245, ${o * 0.8})`, t.beginPath(), t.moveTo(e - 20, s + 5), t.lineTo(e, s + 25), t.lineTo(e + 20, s + 5), t.closePath(), t.fill();
    const h = t.createRadialGradient(e - 55, s + 30, 0, e - 55, s + 30, 30);
    h.addColorStop(0, `rgba(255, 228, 205, ${o})`), h.addColorStop(1, `rgba(220, 180, 160, ${o})`), t.fillStyle = h, t.beginPath(), t.ellipse(e - 52, s + 35, 14, 28, -0.2, 0, Math.PI * 2), t.fill();
    const d = t.createRadialGradient(e + 55, s + 30, 0, e + 55, s + 30, 30);
    d.addColorStop(0, `rgba(255, 228, 205, ${o})`), d.addColorStop(1, `rgba(220, 180, 160, ${o})`), t.fillStyle = d, t.beginPath(), t.ellipse(e + 52, s + 35, 14, 28, 0.2, 0, Math.PI * 2), t.fill(), t.fillStyle = `rgba(255, 218, 195, ${o})`, t.beginPath(), t.arc(e - 55, s + 60, 12, 0, Math.PI * 2), t.fill(), t.beginPath(), t.arc(e + 55, s + 60, 12, 0, Math.PI * 2), t.fill();
    const r = t.createLinearGradient(e - 40, s + 75, e + 40, s + 75);
    r.addColorStop(0, `rgba(50, 70, 100, ${o})`), r.addColorStop(0.3, `rgba(70, 90, 120, ${o})`), r.addColorStop(0.7, `rgba(70, 90, 120, ${o})`), r.addColorStop(1, `rgba(50, 70, 100, ${o})`), t.fillStyle = r, t.beginPath(), t.roundRect(e - 38, s + 78, 28, 55, 3), t.fill(), t.beginPath(), t.roundRect(e + 10, s + 78, 28, 55, 3), t.fill(), t.fillStyle = `rgba(100, 60, 30, ${o})`, t.beginPath(), t.roundRect(e - 42, s + 128, 35, 20, 4), t.fill(), t.beginPath(), t.roundRect(e + 7, s + 128, 35, 20, 4), t.fill(), t.fillStyle = `rgba(255, 255, 255, ${o * 0.2})`, t.beginPath(), t.ellipse(e - 30, s + 133, 8, 3, 0, 0, Math.PI * 2), t.fill(), t.beginPath(), t.ellipse(e + 20, s + 133, 8, 3, 0, 0, Math.PI * 2), t.fill(), t.restore();
  },
  // Procedural texture generation for realistic block appearance
  generateTexture(t, e, s) {
    const o = `${t}_${s}_${e}`;
    if (this.textureCache[o]) return this.textureCache[o];
    const i = 32, c = document.createElement("canvas");
    c.width = i, c.height = i;
    const h = c.getContext("2d"), r = ((u) => {
      if (u.startsWith("rgba")) {
        const P = u.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        return { r: parseInt(P[1]), g: parseInt(P[2]), b: parseInt(P[3]) };
      }
      const f = parseInt(u.slice(1, 3), 16), y = parseInt(u.slice(3, 5), 16), k = parseInt(u.slice(5, 7), 16);
      return { r: f, g: y, b: k };
    })(e), m = (u) => {
      const f = Math.sin(u) * 1e4;
      return f - Math.floor(f);
    };
    if (t === "grass") {
      for (let u = 0; u < i; u++)
        for (let f = 0; f < i; f++) {
          const y = f * 1e3 + u, k = m(y) * 0.3 - 0.15, P = Math.max(0, Math.min(255, r.r + r.r * k)), T = Math.max(0, Math.min(255, r.g + r.g * k)), B = Math.max(0, Math.min(255, r.b + r.b * k));
          h.fillStyle = `rgb(${Math.floor(P)},${Math.floor(T)},${Math.floor(B)})`, h.fillRect(f, u, 1, 1);
        }
      if (s === "top") {
        h.fillStyle = "rgba(90, 160, 70, 0.4)";
        for (let u = 0; u < 12; u++) {
          const f = Math.floor(m(u * 123) * i), y = Math.floor(m(u * 456) * i);
          h.fillRect(f, y, 2, 3);
        }
      }
    } else if (t === "dirt") {
      for (let u = 0; u < i; u++)
        for (let f = 0; f < i; f++) {
          const y = f * 1e3 + u, k = m(y) * 0.25 - 0.125, P = m(y + 999) * 0.15 - 0.075, T = k + P, B = Math.max(0, Math.min(255, r.r + r.r * T)), E = Math.max(0, Math.min(255, r.g + r.g * T)), z = Math.max(0, Math.min(255, r.b + r.b * T));
          h.fillStyle = `rgb(${Math.floor(B)},${Math.floor(E)},${Math.floor(z)})`, h.fillRect(f, u, 1, 1);
        }
      h.fillStyle = "rgba(100, 80, 60, 0.3)";
      for (let u = 0; u < 8; u++) {
        const f = Math.floor(m(u * 789) * i), y = Math.floor(m(u * 321) * i);
        h.fillRect(f, y, 2, 2);
      }
    } else if (t === "brick") {
      h.fillStyle = `rgb(${Math.floor(r.r * 0.6)},${Math.floor(r.g * 0.6)},${Math.floor(r.b * 0.6)})`, h.fillRect(0, 0, i, i);
      for (let k = 0; k < Math.ceil(i / 8); k++) {
        const P = k % 2 * 8;
        for (let T = -1; T < Math.ceil(i / 16) + 1; T++) {
          const B = T * 16 + P, E = k * 8, z = k * 100 + T, $ = m(z) * 0.15 - 0.075, q = Math.max(0, Math.min(255, r.r + r.r * $)), R = Math.max(0, Math.min(255, r.g + r.g * $)), H = Math.max(0, Math.min(255, r.b + r.b * $));
          h.fillStyle = `rgb(${Math.floor(q)},${Math.floor(R)},${Math.floor(H)})`, h.fillRect(B, E, 14, 6), h.fillStyle = `rgba(0,0,0,${m(z + 50) * 0.1})`, h.fillRect(B, E, 14, 6);
        }
      }
    } else if (t === "leaves") {
      for (let u = 0; u < i; u++)
        for (let f = 0; f < i; f++) {
          const y = f * 1e3 + u, k = m(y) * 0.4 - 0.2, P = Math.max(0, Math.min(255, r.r + r.r * k)), T = Math.max(0, Math.min(255, r.g + r.g * k)), B = Math.max(0, Math.min(255, r.b + r.b * k));
          h.fillStyle = `rgb(${Math.floor(P)},${Math.floor(T)},${Math.floor(B)})`, h.fillRect(f, u, 1, 1);
        }
      h.fillStyle = "rgba(0, 50, 0, 0.3)";
      for (let u = 0; u < 15; u++) {
        const f = Math.floor(m(u * 234) * i), y = Math.floor(m(u * 567) * i), k = 2 + Math.floor(m(u * 890) * 3), P = 2 + Math.floor(m(u * 345) * 3);
        h.fillRect(f, y, k, P);
      }
    } else if (t === "wood")
      if (s === "top") {
        for (let y = 0; y < i; y++)
          for (let k = 0; k < i; k++) {
            const P = k * 1e3 + y, T = m(P) * 0.15 - 0.075, B = Math.max(0, Math.min(255, r.r + r.r * T)), E = Math.max(0, Math.min(255, r.g + r.g * T)), z = Math.max(0, Math.min(255, r.b + r.b * T));
            h.fillStyle = `rgb(${Math.floor(B)},${Math.floor(E)},${Math.floor(z)})`, h.fillRect(k, y, 1, 1);
          }
        const u = i / 2, f = i / 2;
        for (let y = 1; y < 6; y++) {
          const k = y * 4 + m(y * 50) * 3;
          h.strokeStyle = `rgba(0, 0, 0, ${0.1 + m(y * 100) * 0.1})`, h.lineWidth = 0.5 + m(y * 200) * 1, h.beginPath(), h.arc(u, f, k, 0, Math.PI * 2), h.stroke();
        }
      } else {
        for (let u = 0; u < i; u++)
          for (let f = 0; f < i; f++) {
            const y = f * 10 + u * 1e3, k = m(y) * 0.2 - 0.1, P = Math.max(0, Math.min(255, r.r + r.r * k)), T = Math.max(0, Math.min(255, r.g + r.g * k)), B = Math.max(0, Math.min(255, r.b + r.b * k));
            h.fillStyle = `rgb(${Math.floor(P)},${Math.floor(T)},${Math.floor(B)})`, h.fillRect(f, u, 1, 1);
          }
        h.strokeStyle = "rgba(0, 0, 0, 0.15)", h.lineWidth = 1;
        for (let u = 0; u < 8; u++) {
          const f = Math.floor(m(u * 333) * i), y = m(u * 444) * 3;
          h.beginPath(), h.moveTo(f, 0);
          for (let k = 0; k < i; k += 2) {
            const P = Math.sin(k * 0.3 + u) * y;
            h.lineTo(f + P, k);
          }
          h.stroke();
        }
        h.fillStyle = "rgba(0, 0, 0, 0.2)";
        for (let u = 0; u < 3; u++)
          if (m(u * 555) > 0.7) {
            const f = Math.floor(m(u * 666) * i), y = Math.floor(m(u * 777) * i * 0.8);
            h.fillRect(y, f, 4, 1);
          }
      }
    const b = h.createPattern(c, "repeat");
    return this.textureCache[o] = b, b;
  },
  darkenColor(t, e) {
    const s = t + e;
    if (this.colorCache || (this.colorCache = {}), this.colorCache[s]) return this.colorCache[s];
    const o = Math.floor(parseInt(t.slice(1, 3), 16) * e), i = Math.floor(parseInt(t.slice(3, 5), 16) * e), c = Math.floor(parseInt(t.slice(5, 7), 16) * e), h = `rgb(${o},${i},${c})`;
    return this.colorCache[s] = h, h;
  },
  gameLoop(t) {
    if (!this.isActive) {
      this.gameLoopId = null;
      return;
    }
    this.lastFrameTime || (this.lastFrameTime = t);
    const e = 1e3 / this.settings.targetFps, s = t - this.lastFrameTime;
    if (s >= e) {
      if (this.lastFrameTime = t - s % e, this.fpsCounter.frames++, t - this.fpsCounter.lastTime >= 1e3) {
        this.fpsCounter.fps = this.fpsCounter.frames, this.fpsCounter.frames = 0, this.fpsCounter.lastTime = t;
        const o = document.getElementById("debugFps");
        o && (o.textContent = `${this.fpsCounter.fps} FPS`);
      }
      if (!this.isPaused) {
        this.update(), this.updateBirds(), this.updateParticles(), this.updateFluids(), this.updateWind(), this.updatePetals(), this.updateDroppedItems(), this.render(), this.settings.showFps && (this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)", this.ctx.fillRect(this.canvas.width - 70, this.canvas.height - 25, 65, 20), this.ctx.fillStyle = "#00ff00", this.ctx.font = "12px monospace", this.ctx.textAlign = "right", this.ctx.fillText(`${this.fpsCounter.fps} FPS`, this.canvas.width - 10, this.canvas.height - 10), this.ctx.textAlign = "left");
        const o = this.debugSettings.renderAlgorithm.toUpperCase(), i = {
          PAINTER: "#00ff00",
          ZBUFFER: "#00ffff",
          BSP: "#ff00ff"
        };
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)", this.ctx.fillRect(this.canvas.width - 90, 5, 85, 20), this.ctx.fillStyle = i[o] || "#ffffff", this.ctx.font = "bold 12px monospace", this.ctx.textAlign = "right", this.ctx.fillText(o, this.canvas.width - 10, 18), this.ctx.textAlign = "left";
      }
    }
    this.gameLoopId = requestAnimationFrame((o) => this.gameLoop(o));
  },
  start() {
    this.fullInit(), window.game = this, this.isActive = !0, this.isPaused = !1, this.pointerLocked = !1, this.stats = { blocksPlaced: 0, blocksBroken: 0, distance: 0, jumps: 0, startTime: Date.now() }, document.getElementById("minecraftGame").classList.add("active"), document.getElementById("pauseMenu").classList.remove("active"), document.getElementById("gameUI").style.display = "flex";
    const e = (() => {
      const h = (m, b) => {
        let u = null;
        for (let H = 40; H >= 0; H--) {
          const X = this.getBlock(m, H, b);
          if (X && X !== "water" && X !== "lava") {
            u = H;
            break;
          }
        }
        if (u === null) return null;
        let f = !1;
        for (let H = u + 1; H <= u + 10; H++) {
          const X = this.getBlock(m, H, b);
          if (X && X !== "water" && X !== "lava") {
            f = !0;
            break;
          }
        }
        if (f) return null;
        let y = !1;
        for (let H = -2; H <= 2; H++) {
          for (let X = -2; X <= 2; X++) {
            for (let N = 1; N <= 5; N++) {
              const Z = this.getBlock(m + H, u + N, b + X);
              if (Z && Z !== "water" && Z !== "lava") {
                y = !0;
                break;
              }
            }
            if (y) break;
          }
          if (y) break;
        }
        if (y)
          return null;
        const k = u + 1, P = u + 2, T = this.getBlock(m, k, b), B = this.getBlock(m, P, b), E = !T || T === "water" || T === "lava", z = !B || B === "water" || B === "lava", $ = this.getBlock(m, u, b), q = $ !== "water" && $ !== "lava" && $ !== "sand";
        let R = !0;
        for (let H = -1; H <= 1; H++) {
          for (let X = -1; X <= 1; X++) {
            if (H === 0 && X === 0) continue;
            let N = null;
            for (let Z = 40; Z >= 0; Z--) {
              const V = this.getBlock(m + H, Z, b + X);
              if (V && V !== "water" && V !== "lava") {
                N = Z;
                break;
              }
            }
            if (N === null || Math.abs(N - u) > 1) {
              R = !1;
              break;
            }
          }
          if (!R) break;
        }
        return E && z && R ? {
          x: m,
          y: k + this.playerEyeHeight,
          z: b,
          priority: q ? 1 : 2
          // Prefer dry land
        } : null;
      };
      let d = h(0, -8);
      if (d && d.priority === 1)
        return d;
      const r = 30;
      for (let m = 1; m <= r; m++) {
        for (let b = -m; b <= m; b++)
          for (let u = -m; u <= m; u++) {
            if (Math.abs(b) !== m && Math.abs(u) !== m) continue;
            const f = h(0 + b, -8 + u);
            if (f) {
              if (f.priority === 1)
                return f;
              (!d || f.priority < d.priority) && (d = f);
            }
          }
        if (d && m > 5)
          return d;
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
    const s = document.getElementById("petalCanvas");
    s && (s.style.display = "none");
    const o = document.getElementById("flameParticles");
    o && (o.style.visibility = "hidden"), document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", document.getElementById("clickToPlay").classList.add("active"), this.gameLoopId && cancelAnimationFrame(this.gameLoopId), setTimeout(() => {
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
      for (const s of this.pestBirds)
        s.anger = 0, s.timesShot = 0, s.state = "circling";
    this.canvas.width = 800, this.canvas.height = 450, this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height), document.getElementById("minecraftGame").classList.remove("active"), document.getElementById("pauseMenu").classList.remove("active"), document.getElementById("clickToPlay").classList.remove("active"), document.getElementById("inventoryScreen").classList.remove("active"), this.inventoryOpen = !1, this.canvas.style.filter = "", document.pointerLockElement && document.exitPointerLock(), (document.fullscreenElement || document.webkitFullscreenElement) && (document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen && document.webkitExitFullscreen()), this.keys = {}, document.body.style.overflow = "", document.documentElement.style.overflow = "";
    const t = document.getElementById("petalCanvas");
    t && (t.style.display = "block");
    const e = document.getElementById("flameParticles");
    e && (e.style.visibility = "visible");
  }
};
class Dt {
  constructor() {
    Et(this, "_game");
    Et(this, "_initialized");
    this._game = oe, this._initialized = !1;
  }
  /**
   * Initialize the game with options
   */
  init(e = {}) {
    var s, o;
    if (!document.getElementById("minecraftGame")) {
      let i = document.body;
      e.container && (i = typeof e.container == "string" ? document.querySelector(e.container) || document.body : e.container), ie(i);
    }
    if (this._game.init(), this._initialized = !0, e.trigger) {
      const i = typeof e.trigger == "string" ? document.querySelector(e.trigger) : e.trigger;
      i && (i.addEventListener("click", () => this.start()), i.style.cursor = "pointer");
    }
    return (s = document.getElementById("closeMinecraft")) == null || s.addEventListener("click", () => this.stop()), (o = document.getElementById("clickToPlay")) == null || o.addEventListener("click", () => {
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
  window.SakuraCraft = Dt, window.SakuraCraftGame = Dt;
  const t = document.currentScript;
  if (t != null && t.hasAttribute("data-auto-init")) {
    const e = t.getAttribute("data-trigger");
    document.addEventListener("DOMContentLoaded", () => {
      const s = new Dt();
      s.init({ trigger: e ?? void 0 }), window.sakuraCraft = s;
    });
  }
}
export {
  Dt as SakuraCraftGame,
  Dt as default,
  oe as minecraftGame
};
//# sourceMappingURL=sakuracraft.es.js.map
