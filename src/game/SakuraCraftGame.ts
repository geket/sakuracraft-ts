/**
 * SakuraCraft Game Engine
 * A voxel-based browser game with cherry blossom aesthetics
 * 
 * TypeScript version with full type annotations
 */

import type {
  GameStats,
  GameSettings,
  SakuraCraftInitOptions,
  ISakuraCraftEngine
} from '../types';

import '../styles/game.css';

// Extend Document and HTMLElement interfaces for webkit fullscreen APIs
declare global {
  interface Document {
    webkitFullscreenElement?: Element;
    webkitExitFullscreen?: () => Promise<void>;
  }
  
  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
  }
}

// Game HTML template
const gameTemplate = `
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

/**
 * Inject the game HTML into the DOM
 */
function injectGameHTML(container: HTMLElement = document.body): void {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = gameTemplate;
  while (wrapper.firstChild) {
    container.appendChild(wrapper.firstChild);
  }
}

/**
 * The core game engine object with type annotations
 * Using 'any' for complex internal state to maintain compatibility
 */
export const minecraftGame: ISakuraCraftEngine & Record<string, any> = {
            canvas: null,
            ctx: null,
            isActive: false,
            isPaused: false,
            camera: { x: 0, y: 50, z: 0, rotX: 0, rotY: 0 },
            velocity: { x: 0, y: 0, z: 0 },
            world: {},
            keys: {},
            isJumping: false,
            gravity: -0.035,  // Stronger gravity for snappier jumps
            lastPos: { x: 0, z: 0 },
            pointerLocked: false,
            
            // Fluid state
            inWater: false,
            inLava: false,
            swimming: false,
            headSubmergedWater: false,
            headSubmergedLava: false,
            
            // Player dimensions - camera at waist/hip level
            playerEyeHeight: 1.2,  // How high camera is above feet
            playerHeight: 1.8,     // Total player height
            
            // Birds and mobs
            birds: [],
            pestBirds: [],
            blueBirds: [],
            fish: [],
            cats: [],
            creepers: [],
            
            // Items and inventory
            selectedSlot: 0,  // 0-8 for hotbar slots
            selectedBlock: 'grass',
            selectedItem: null,  // For non-block items like ak47
            
            // Inventory system
            inventory: {
                // Hotbar slots (9 slots)
                hotbar: [
                    { type: 'block', id: 'grass', count: 64 },
                    { type: 'block', id: 'dirt', count: 64 },
                    { type: 'block', id: 'stone', count: 64 },
                    { type: 'block', id: 'wood', count: 64 },
                    { type: 'block', id: 'brick', count: 64 },
                    { type: 'bucket', id: 'water_bucket', count: 5 },
                    { type: 'bucket', id: 'lava_bucket', count: 5 },
                    { type: 'weapon', id: 'ak47', count: 1, durability: 100, maxDurability: 100 },
                    null  // Empty slot
                ],
                // Main inventory (27 slots - 3 rows of 9)
                main: [
                    { type: 'block', id: 'leaves', count: 64 },
                    { type: 'block', id: 'sand', count: 64 },
                    null, null, null, null, null, null, null,
                    null, null, null, null, null, null, null, null, null,
                    null, null, null, null, null, null, null, null, null
                ],
                // Crafting result
                craftingResult: null
            },
            
            // Crafting recipes
            recipes: [
                { ingredients: [{ id: 'wood', count: 4 }], result: { type: 'block', id: 'wood', count: 16 }, name: 'Planks' },
                { ingredients: [{ id: 'stone', count: 8 }], result: { type: 'block', id: 'brick', count: 4 }, name: 'Bricks' },
                { ingredients: [{ id: 'sand', count: 4 }], result: { type: 'block', id: 'stone', count: 2 }, name: 'Sandstone' },
                { ingredients: [{ id: 'wood', count: 8 }], result: { type: 'block', id: 'chest', count: 1 }, name: 'Chest' }
            ],
            
            // Fluid blocks that need updating
            fluidUpdates: [],
            fluidLevels: {},  // Stores fluid level 1-8 at each position
            fluidUpdateTimer: 0,
            
            // Bird anger system
            birdPruneTimer: 0,
            
            // Weapon properties
            shootCooldown: 0,
            muzzleFlash: 0,
            particles: [],  // Bullet particles
            
            // UI state
            inventoryOpen: false,
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
                filter: 'none',
                renderDistance: 20,
                shadows: true,
                lighting: true,
                antialiasing: false,
                showFps: true,
                targetFps: 60
            },
            
            // FPS tracking
            fpsCounter: {
                frames: 0,
                lastTime: 0,
                fps: 0
            },
            
            // Simple 2D noise function (value noise with interpolation)
            noise2D: (function() {
                // Permutation table
                const perm: number[] = [];
                for (let i = 0; i < 512; i++) {
                    perm[i] = Math.floor(Math.random() * 256);
                }
                
                function fade(t: number): number { return t * t * t * (t * (t * 6 - 15) + 10); }
                function lerp(a: number, b: number, t: number): number { return a + t * (b - a); }
                function grad(hash: number, x: number, y: number): number {
                    const h = hash & 3;
                    const u = h < 2 ? x : y;
                    const v = h < 2 ? y : x;
                    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
                }
                
                return function(x: number, y: number): number {
                    const X = Math.floor(x) & 255;
                    const Y = Math.floor(y) & 255;
                    x -= Math.floor(x);
                    y -= Math.floor(y);
                    const u = fade(x);
                    const v = fade(y);
                    const A = perm[X] + Y;
                    const B = perm[X + 1] + Y;
                    return lerp(
                        lerp(grad(perm[A], x, y), grad(perm[B], x - 1, y), u),
                        lerp(grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1), u),
                        v
                    );
                };
            })(),
            
            // Fractal Brownian Motion for more natural terrain
            fbm(x: number, y: number, octaves = 4): number {
                let value = 0;
                let amplitude = 1;
                let frequency = 1;
                let maxValue = 0;
                
                for (let i = 0; i < octaves; i++) {
                    value += this.noise2D(x * frequency, y * frequency) * amplitude;
                    maxValue += amplitude;
                    amplitude *= 0.5;
                    frequency *= 2;
                }
                
                return value / maxValue;
            },
            
            blockColors: {
                grass: { top: '#7cba5f', side: '#8b6b4a', bottom: '#6b4423' },
                dirt: { top: '#8b6b4a', side: '#8b6b4a', bottom: '#8b6b4a' },
                stone: { top: '#888888', side: '#777777', bottom: '#666666' },
                wood: { top: '#a0825a', side: '#6b4423', bottom: '#6b4423' },
                leaves: { top: 'rgba(50, 180, 50, 0.85)', side: 'rgba(40, 160, 40, 0.85)', bottom: 'rgba(30, 140, 30, 0.85)', transparent: true }, // Beautiful transparent leaves
                appleLeaves: { top: 'rgba(50, 180, 50, 0.85)', side: 'rgba(40, 160, 40, 0.85)', bottom: 'rgba(30, 140, 30, 0.85)', transparent: true }, // Beautiful transparent apple leaves
                water: { top: 'rgba(74, 144, 217, 0.7)', side: 'rgba(58, 128, 201, 0.7)', bottom: 'rgba(42, 112, 185, 0.7)', transparent: true, animated: true },
                sand: { top: '#e6d9a0', side: '#d9cc93', bottom: '#ccbf86' },
                brick: { top: '#b35050', side: '#a04040', bottom: '#903030' },
                lava: { top: '#ff6600', side: '#ff4400', bottom: '#cc3300', animated: true },
                obsidian: { top: '#1a0a2e', side: '#140820', bottom: '#0a0410' },
                cherryWood: { top: '#c4a07a', side: '#8b5a5a', bottom: '#8b5a5a' },
                cherryLeaves: { top: 'rgba(255, 183, 197, 0.85)', side: 'rgba(255, 192, 203, 0.85)', bottom: 'rgba(255, 144, 165, 0.85)', transparent: true },
                chest: { top: '#8b6914', side: '#a0780a', bottom: '#705010' },
                ritualChest: { top: '#4a0080', side: '#6a00b0', bottom: '#300060' },
                buildingChest: { top: '#c0c0c0', side: '#a0a0a0', bottom: '#808080' },
                // Ritual Temple blocks
                ritualStone: { top: '#4a4a6a', side: '#3a3a5a', bottom: '#2a2a4a' },
                petalSocket: { top: '#ffb7c5', side: '#8b5a5a', bottom: '#5a3a3a' },
                ropeSocket: { top: '#8b7355', side: '#6b5a45', bottom: '#4b3a25' },
                charmSocket: { top: '#ffd700', side: '#daa520', bottom: '#b8860b' },
                plaqueSocket: { top: '#deb887', side: '#c4a07a', bottom: '#8b7355' },
                incenseSocket: { top: '#9370db', side: '#7b68ee', bottom: '#6a5acd' },
                // Filled socket blocks (glowing versions)
                petalSocketFilled: { top: '#ff69b4', side: '#ff1493', bottom: '#c71585' },
                ropeSocketFilled: { top: '#daa520', side: '#b8860b', bottom: '#8b6914' },
                charmSocketFilled: { top: '#fff700', side: '#ffd700', bottom: '#ffb700' },
                plaqueSocketFilled: { top: '#f4a460', side: '#d2691e', bottom: '#a0522d' },
                incenseSocketFilled: { top: '#da70d6', side: '#ba55d3', bottom: '#9932cc' },
                // Church blocks
                whiteBrick: { top: '#f0f0f0', side: '#e0e0e0', bottom: '#d0d0d0' },
                redBrick: { top: '#b35050', side: '#a04040', bottom: '#903030' },
                glowstone: { top: '#ffdd88', side: '#eebb66', bottom: '#ddaa44' }
            },
            
            // Item definitions with properties
            itemTypes: {
                // Building materials
                grass: { stackable: true, maxStack: 64 },
                dirt: { stackable: true, maxStack: 64 },
                stone: { stackable: true, maxStack: 64 },
                wood: { stackable: true, maxStack: 64 },
                leaves: { stackable: true, maxStack: 64 },
                appleLeaves: { stackable: true, maxStack: 64 },
                sand: { stackable: true, maxStack: 64 },
                brick: { stackable: true, maxStack: 64 },
                cherryWood: { stackable: true, maxStack: 64 },
                cherryLeaves: { stackable: true, maxStack: 64 },
                chest: { stackable: true, maxStack: 16 },
                obsidian: { stackable: true, maxStack: 64 },
                whiteBrick: { stackable: true, maxStack: 64 },
                redBrick: { stackable: true, maxStack: 64 },
                glowstone: { stackable: true, maxStack: 64 },
                ritualStone: { stackable: true, maxStack: 64 },
                // Consumables/Throwables
                apple: { stackable: true, maxStack: 64, throwable: true, description: 'Throw at birds to knock them away' },
                // Buckets
                water_bucket: { stackable: true, maxStack: 16 },
                lava_bucket: { stackable: true, maxStack: 16 },
                // Tools with durability
                ak47: { stackable: false, maxStack: 1, durability: 100, maxDurability: 100, description: 'Shoots bullets at birds' },
                seeds: { stackable: true, maxStack: 64, description: 'Calms angry birds temporarily' },
                berdger: { stackable: false, maxStack: 1, invincible: true, description: 'The legendary bird repellent - infinite uses!' },
                // Ritual items (Omamori charm components)
                sakuraPetal: { stackable: true, maxStack: 16, description: 'Sacred cherry blossom petal', ritual: true },
                shimenawa: { stackable: true, maxStack: 1, description: 'Sacred rope', ritual: true },
                omamori: { stackable: true, maxStack: 1, description: 'Protective charm base', ritual: true },
                ema: { stackable: true, maxStack: 1, description: 'Wooden wish plaque', ritual: true },
                incense: { stackable: true, maxStack: 1, description: 'Purifying incense', ritual: true }
            },
            
            // Fluids that player can pass through
            fluidBlocks: ['water', 'lava'],
            
            // Ritual system - Omamori Blessing (Japanese protective charm ritual)
            ritualItems: ['sakuraPetal', 'shimenawa', 'omamori', 'ema', 'incense'],
            ritualComplete: false,
            ritualBlessingActive: false,
            ritualBlessingTimer: 0,
            ritualFlight: false,
            ritualFlightTimer: 0,
            ritualBarrierActive: false,
            
            init() {
                // Lightweight init - just get canvas reference
                // World generation is deferred to start() to avoid lagging main site
                this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
                if (!this.canvas) {
                    throw new Error('Canvas element not found');
                }
                this.ctx = this.canvas.getContext('2d');
                if (!this.ctx) {
                    throw new Error('Could not get 2D context');
                }
                this.initialized = false;  // Track if world has been generated
                this.gameLoopId = null;    // Track animation frame for cleanup
                this.lastFrameTime = 0;    // For FPS limiting
            },
            
            // Full initialization - called only when game starts
            fullInit() {
                if (this.initialized) return;  // Don't regenerate if already done
                
                this.generateWorld();
                this.setupControls();
                this.setupMenus();
                this.setupDebugConsole();
                this.initialized = true;
                
                // Force initial hotbar render with multiple attempts for reliability
                this.updateHotbarDisplay();
                setTimeout(() => this.updateHotbarDisplay(), 50);
                setTimeout(() => this.updateHotbarDisplay(), 150);
                setTimeout(() => this.updateHotbarDisplay(), 300);
            },
            
            generateWorld() {
                this.world = {};
                this.fluidLevels = {};  // Clear fluid levels
                this.droppedItems = []; // Items on ground
                this.cherryTrees = [];  // Cherry blossom tree locations
                this.petalParticles = []; // Cherry blossom petals
                
                const worldSize = 50; // -50 to 50 = 101x101 blocks
                const waterLevel = 6;
                const baseHeight = 8;
                
                // Store world bounds for forcefield - ON the last block, not past it
                this.worldBounds = {
                    minX: -worldSize,
                    maxX: worldSize + 1,
                    minZ: -worldSize,
                    maxZ: worldSize + 1,
                    minY: 0,
                    maxY: 50
                };
                
                // Wind system for petals and birds
                this.wind = {
                    x: 0,
                    z: 0,
                    targetX: 0,
                    targetZ: 0,
                    gustTimer: 0,
                    strength: 0.02
                };
                
                // Building placements storage
                this.buildings = [];
                
                // Fluid simulation queue
                this.fluidQueue = [];
                
                // Pre-calculate height map for faster generation
                const heightMap: Record<string, number> = {};
                const biomeMap: Record<string, number> = {};
                
                // First pass: calculate heights
                for (let x = -worldSize; x <= worldSize; x++) {
                    for (let z = -worldSize; z <= worldSize; z++) {
                        const n1 = this.fbm(x * 0.03, z * 0.03, 2) * 10;
                        const n2 = this.fbm(x * 0.05 + 100, z * 0.05 + 100, 2) * 5;
                        
                        const distFromCenter = Math.sqrt(x * x + z * z) / worldSize;
                        const edgeFalloff = Math.max(0, 1 - distFromCenter * 0.5);
                        
                        let height = Math.floor(baseHeight + (n1 + n2) * edgeFalloff);
                        height = Math.max(1, Math.min(22, height));
                        
                        const key = `${x},${z}`;
                        heightMap[key] = height;
                        biomeMap[key] = this.noise2D(x * 0.03 + 500, z * 0.03 + 500);
                    }
                }
                
                // Second pass: generate blocks using cached heights
                for (let x = -worldSize; x <= worldSize; x++) {
                    for (let z = -worldSize; z <= worldSize; z++) {
                        const key = `${x},${z}`;
                        const height = heightMap[key];
                        const biomeNoise = biomeMap[key];
                        
                        const isBeach = height <= waterLevel + 1 && height >= waterLevel - 1;
                        const isDesert = biomeNoise > 0.3 && height > waterLevel + 2;
                        
                        // Generate column - only surface blocks for speed
                        // Just 3 layers of stone at bottom
                        for (let y = Math.max(0, height - 3); y < height - 1; y++) {
                            this.setBlock(x, y, z, 'stone');
                        }
                        
                        // Surface layers based on biome
                        if (isBeach || (height <= waterLevel)) {
                            this.setBlock(x, height - 1, z, 'sand');
                            this.setBlock(x, height, z, 'sand');
                        } else if (isDesert) {
                            this.setBlock(x, height - 1, z, 'sand');
                            this.setBlock(x, height, z, 'sand');
                        } else {
                            this.setBlock(x, height - 1, z, 'dirt');
                            this.setBlock(x, height, z, 'grass');
                        }
                        
                        // Water - source blocks at full level
                        if (height < waterLevel) {
                            for (let y = height + 1; y <= waterLevel; y++) {
                                this.setBlock(x, y, z, 'water');
                                this.setFluidLevel(x, y, z, 8);  // Full level for natural water
                            }
                        }
                    }
                }
                
                // Trees - separate pass, sparser
                for (let x = -worldSize; x <= worldSize; x += 2) { // Skip every other for speed
                    for (let z = -worldSize; z <= worldSize; z += 2) {
                        const key = `${x},${z}`;
                        const height = heightMap[key];
                        const biomeNoise = biomeMap[key];
                        const isBeach = height <= waterLevel + 1;
                        const isDesert = biomeNoise > 0.3;
                        
                        if (height > waterLevel + 1 && !isDesert && !isBeach) {
                            const treeNoise = this.noise2D(x * 0.4 + 300, z * 0.4 + 300);
                            if (treeNoise > 0.5 && Math.random() < 0.12) {
                                // 25% chance for cherry blossom tree
                                if (Math.random() < 0.25) {
                                    this.generateCherryTree(x, height + 1, z);
                                } else {
                                    this.generateTree(x, height + 1, z);
                                }
                            }
                        }
                    }
                }
                
                // Spawn ritual item chests (rare, ~5 in world)
                const ritualChestCount = 5;
                for (let i = 0; i < ritualChestCount; i++) {
                    const rx = Math.floor(Math.random() * worldSize * 2) - worldSize;
                    const rz = Math.floor(Math.random() * worldSize * 2) - worldSize;
                    const rKey = `${rx},${rz}`;
                    const rHeight = heightMap[rKey] || baseHeight;
                    if (rHeight > waterLevel) {
                        this.setBlock(rx, rHeight + 1, rz, 'ritualChest');
                        // Store chest contents
                        const ritualItem = this.ritualItems[i % this.ritualItems.length];
                        this.chestContents = this.chestContents || {};
                        this.chestContents[`${rx},${rHeight + 1},${rz}`] = [
                            { type: ritualItem, count: 1 }
                        ];
                    }
                }
                
                // Spawn seeds around the world (uncommon ground items)
                for (let i = 0; i < 30; i++) {
                    const sx = Math.floor(Math.random() * worldSize * 2) - worldSize;
                    const sz = Math.floor(Math.random() * worldSize * 2) - worldSize;
                    const sKey = `${sx},${sz}`;
                    const sHeight = heightMap[sKey] || baseHeight;
                    if (sHeight > waterLevel) {
                        this.droppedItems.push({
                            x: sx + 0.5,
                            y: sHeight + 1.2,
                            z: sz + 0.5,
                            type: 'seeds',
                            count: 1 + Math.floor(Math.random() * 3),
                            bobPhase: Math.random() * Math.PI * 2
                        });
                    }
                }
                
                // Spawn apples under apple trees
                if (this.appleTrees) {
                    for (const tree of this.appleTrees) {
                        // 50% chance of apples under each tree
                        if (Math.random() < 0.5) {
                            const appleCount = 1 + Math.floor(Math.random() * 3);
                            for (let i = 0; i < appleCount; i++) {
                                this.droppedItems.push({
                                    x: tree.x + (Math.random() - 0.5) * 4,
                                    y: tree.y - 3,
                                    z: tree.z + (Math.random() - 0.5) * 4,
                                    type: 'apple',
                                    count: 1,
                                    bobPhase: Math.random() * Math.PI * 2
                                });
                            }
                        }
                    }
                }
                
                // Generate buildings
                this.generateBuildings(worldSize);
                
                // Generate ONE Ritual Temple in a random far location
                let templeX, templeZ;
                do {
                    templeX = Math.floor(Math.random() * (worldSize - 20)) + 15;
                    templeZ = Math.floor(Math.random() * (worldSize - 20)) + 15;
                    if (Math.random() < 0.5) templeX = -templeX;
                    if (Math.random() < 0.5) templeZ = -templeZ;
                } while (Math.abs(templeX) < 20 || Math.abs(templeZ) < 20);
                
                const templeKey = `${templeX},${templeZ}`;
                const templeHeight = heightMap[templeKey] || baseHeight;
                this.generateRitualTemple(templeX, templeHeight + 1, templeZ);
                
                // Initialize birds
                this.initBirds();
                this.initPestBirds();
            },
            
            generateBuildings(worldSize: number) {
                // Building types
                const buildingTypes = ['church', 'house1', 'house2', 'house3', 'grocery', 'wcdonalds'];
                
                // Quadrant-based generation: 2-6 buildings per 25x25 area
                const quadrantSize = 25;
                let wcdonaldsPlaced = false;
                
                for (let qx = -Math.floor(worldSize / quadrantSize); qx <= Math.floor(worldSize / quadrantSize); qx++) {
                    for (let qz = -Math.floor(worldSize / quadrantSize); qz <= Math.floor(worldSize / quadrantSize); qz++) {
                        // Skip center quadrant (spawn area)
                        if (qx === 0 && qz === 0) continue;
                        
                        const minX = qx * quadrantSize;
                        const minZ = qz * quadrantSize;
                        
                        // 2-6 buildings per quadrant
                        const numBuildings = 2 + Math.floor(Math.random() * 5);
                        
                        for (let i = 0; i < numBuildings; i++) {
                            const bx = minX + 3 + Math.floor(Math.random() * (quadrantSize - 6));
                            const bz = minZ + 3 + Math.floor(Math.random() * (quadrantSize - 6));
                            
                            // Force WcDonald's if not placed yet and this is a good spot
                            if (!wcdonaldsPlaced && Math.random() < 0.3) {
                                if (this.tryPlaceBuilding(bx, bz, ['wcdonalds'])) {
                                    wcdonaldsPlaced = true;
                                    continue;
                                }
                            }
                            
                            this.tryPlaceBuilding(bx, bz, buildingTypes);
                        }
                    }
                }
                
                // Guarantee at least one WcDonald's if not placed
                if (!wcdonaldsPlaced) {
                    for (let attempts = 0; attempts < 50; attempts++) {
                        const bx = 25 + Math.floor(Math.random() * 20);
                        const bz = 25 + Math.floor(Math.random() * 20);
                        if (this.tryPlaceBuilding(bx, bz, ['wcdonalds'])) {
                            break;
                        }
                    }
                }
            },
            
            tryPlaceBuilding(x: number, z: number, buildingTypes: string[]) {
                const groundY = this.getHighestBlock(x, z);
                if (!groundY || groundY < 7) return false;
                
                const block = this.getBlock(x, groundY, z);
                if (block === 'water' || block === 'sand') return false;
                
                // Quick flatness check
                const h1 = this.getHighestBlock(x + 3, z) || groundY;
                const h2 = this.getHighestBlock(x - 3, z) || groundY;
                const h3 = this.getHighestBlock(x, z + 3) || groundY;
                const h4 = this.getHighestBlock(x, z - 3) || groundY;
                if (Math.max(Math.abs(h1 - groundY), Math.abs(h2 - groundY), Math.abs(h3 - groundY), Math.abs(h4 - groundY)) > 2) return false;
                
                // Check overlap
                for (const b of this.buildings) {
                    if (Math.sqrt((x - b.x) ** 2 + (z - b.z) ** 2) < 15) return false;
                }
                
                const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
                const baseY = groundY + 1;
                
                this.buildings.push({ x, z, type, y: baseY });
                
                switch (type) {
                    case 'church': this.generateChurch(x, baseY, z); break;
                    case 'house1': this.generateHouse1(x, baseY, z); break;
                    case 'house2': this.generateHouse2(x, baseY, z); break;
                    case 'house3': this.generateHouse3(x, baseY, z); break;
                    case 'grocery': this.generateGrocery(x, baseY, z); break;
                    case 'wcdonalds': this.generateWcDonalds(x, baseY, z); break;
                }
                return true;
            },
            
            // Ruined Church - tall with steeple and intact cross
            generateChurch(x: number, y: number, z: number) {
                const w = 7, d = 12, h = 8;
                const ruinFactor = 0.3; // 30% of blocks are missing
                
                // Floor
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        this.setBlock(x + dx, y - 1, z + dz, 'stone');
                    }
                }
                
                // Walls with random holes
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        for (let dy = 0; dy < h; dy++) {
                            const isWall = dx === 0 || dx === w - 1 || dz === 0 || dz === d - 1;
                            if (isWall && Math.random() > ruinFactor) {
                                // Door opening
                                if (dz === d - 1 && dx >= 2 && dx <= 4 && dy < 3) continue;
                                // Window openings
                                if ((dx === 0 || dx === w - 1) && dy >= 2 && dy <= 4 && (dz === 3 || dz === 8)) continue;
                                this.setBlock(x + dx, y + dy, z + dz, 'stone');
                            }
                        }
                    }
                }
                
                // Steeple (partially collapsed but supporting structure for cross)
                const steepleX = x + 3, steepleZ = z + 2;
                for (let dy = h; dy < h + 5; dy++) {
                    // Main pillar always intact to support cross
                    this.setBlock(steepleX, y + dy, steepleZ, 'stone');
                    if (dy < h + 3) {
                        // Side supports may be ruined
                        if (Math.random() > ruinFactor) {
                            this.setBlock(steepleX + 1, y + dy, steepleZ, 'stone');
                        }
                        if (Math.random() > ruinFactor) {
                            this.setBlock(steepleX - 1, y + dy, steepleZ, 'stone');
                        }
                    }
                }
                
                // CROSS - Always intact! (This identifies it as a church)
                const crossY = y + h + 5;
                // Vertical part of cross
                this.setBlock(steepleX, crossY, steepleZ, 'stone');
                this.setBlock(steepleX, crossY + 1, steepleZ, 'stone');
                this.setBlock(steepleX, crossY + 2, steepleZ, 'stone');
                // Horizontal part of cross
                this.setBlock(steepleX - 1, crossY + 1, steepleZ, 'stone');
                this.setBlock(steepleX + 1, crossY + 1, steepleZ, 'stone');
            },
            
            // Small cottage house
            generateHouse1(x: number, y: number, z: number) {
                const w = 5, d = 6, h = 4;
                const ruinFactor = 0.25;
                
                // Floor
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        this.setBlock(x + dx, y - 1, z + dz, 'wood');
                    }
                }
                
                // Walls (wood)
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        for (let dy = 0; dy < h; dy++) {
                            const isWall = dx === 0 || dx === w - 1 || dz === 0 || dz === d - 1;
                            if (isWall && Math.random() > ruinFactor) {
                                // Door
                                if (dz === d - 1 && dx === 2 && dy < 2) continue;
                                // Window
                                if (dx === 0 && dy === 1 && dz === 2) continue;
                                this.setBlock(x + dx, y + dy, z + dz, 'wood');
                            }
                        }
                    }
                }
                
                // Roof (leaves - like thatch)
                for (let dx = -1; dx <= w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        if (Math.random() > ruinFactor) {
                            this.setBlock(x + dx, y + h, z + dz, 'leaves');
                        }
                    }
                }
            },
            
            // Two-story house
            generateHouse2(x: number, y: number, z: number) {
                const w = 6, d = 7, h = 6;
                const ruinFactor = 0.3;
                
                // Foundation
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        this.setBlock(x + dx, y - 1, z + dz, 'stone');
                    }
                }
                
                // Brick walls
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        for (let dy = 0; dy < h; dy++) {
                            const isWall = dx === 0 || dx === w - 1 || dz === 0 || dz === d - 1;
                            if (isWall && Math.random() > ruinFactor) {
                                // Door
                                if (dz === d - 1 && dx >= 2 && dx <= 3 && dy < 2) continue;
                                // Windows
                                if ((dx === 0 || dx === w - 1) && (dy === 1 || dy === 4) && (dz === 2 || dz === 4)) continue;
                                this.setBlock(x + dx, y + dy, z + dz, 'brick');
                            }
                        }
                    }
                }
                
                // Floor between stories
                for (let dx = 1; dx < w - 1; dx++) {
                    for (let dz = 1; dz < d - 1; dz++) {
                        if (Math.random() > ruinFactor * 2) {
                            this.setBlock(x + dx, y + 3, z + dz, 'wood');
                        }
                    }
                }
            },
            
            // L-shaped house
            generateHouse3(x: number, y: number, z: number) {
                const ruinFactor = 0.35;
                
                // Main section
                for (let dx = 0; dx < 5; dx++) {
                    for (let dz = 0; dz < 8; dz++) {
                        this.setBlock(x + dx, y - 1, z + dz, 'stone');
                        for (let dy = 0; dy < 4; dy++) {
                            const isWall = dx === 0 || dx === 4 || dz === 0 || dz === 7;
                            if (isWall && Math.random() > ruinFactor) {
                                if (dz === 7 && dx === 2 && dy < 2) continue; // Door
                                this.setBlock(x + dx, y + dy, z + dz, 'brick');
                            }
                        }
                    }
                }
                
                // L extension
                for (let dx = 5; dx < 9; dx++) {
                    for (let dz = 0; dz < 5; dz++) {
                        this.setBlock(x + dx, y - 1, z + dz, 'stone');
                        for (let dy = 0; dy < 4; dy++) {
                            const isWall = dx === 8 || dz === 0 || dz === 4 || (dx === 5 && dz > 4);
                            if (isWall && Math.random() > ruinFactor) {
                                this.setBlock(x + dx, y + dy, z + dz, 'brick');
                            }
                        }
                    }
                }
            },
            
            // Abandoned grocery store
            generateGrocery(x: number, y: number, z: number) {
                const w = 10, d = 8, h = 4;
                const ruinFactor = 0.25;
                
                // Concrete floor
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        this.setBlock(x + dx, y - 1, z + dz, 'stone');
                    }
                }
                
                // Walls
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        for (let dy = 0; dy < h; dy++) {
                            const isWall = dx === 0 || dx === w - 1 || dz === 0 || dz === d - 1;
                            if (isWall && Math.random() > ruinFactor) {
                                // Wide entrance
                                if (dz === d - 1 && dx >= 3 && dx <= 6 && dy < 3) continue;
                                // Windows (front)
                                if (dz === d - 1 && (dx === 1 || dx === 8) && dy >= 1 && dy <= 2) continue;
                                this.setBlock(x + dx, y + dy, z + dz, 'stone');
                            }
                        }
                    }
                }
                
                // Shelving units (partial)
                for (let row = 0; row < 2; row++) {
                    for (let dz = 2; dz < 6; dz++) {
                        if (Math.random() > 0.4) {
                            this.setBlock(x + 3 + row * 3, y, z + dz, 'wood');
                            if (Math.random() > 0.5) {
                                this.setBlock(x + 3 + row * 3, y + 1, z + dz, 'wood');
                            }
                        }
                    }
                }
                
                // "GROCERY" sign (just some blocks on roof)
                for (let dx = 2; dx < 8; dx++) {
                    if (Math.random() > 0.3) {
                        this.setBlock(x + dx, y + h, z + d - 1, 'stone');
                    }
                }
            },
            
            // WcDonald's - the knockoff! (W instead of M, same colors)
            generateWcDonalds(x: number, y: number, z: number) {
                const w = 9, d = 9, h = 4;
                const ruinFactor = 0.2;
                
                // FIRST: Clear interior space (remove any terrain blocks inside building)
                for (let dx = 1; dx < w - 1; dx++) {
                    for (let dz = 1; dz < d - 1; dz++) {
                        for (let dy = 0; dy < h + 2; dy++) {
                            const existingBlock = this.getBlock(x + dx, y + dy, z + dz);
                            // Remove any solid non-air blocks inside
                            if (existingBlock && existingBlock !== 'water' && existingBlock !== 'lava') {
                                this.setBlock(x + dx, y + dy, z + dz, null);
                            }
                        }
                    }
                }
                
                // Red foundation/floor
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        this.setBlock(x + dx, y - 1, z + dz, 'brick'); // Red brick as red
                    }
                }
                
                // Walls (mix of brick and stone for that fast food look)
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        for (let dy = 0; dy < h; dy++) {
                            const isWall = dx === 0 || dx === w - 1 || dz === 0 || dz === d - 1;
                            if (isWall && Math.random() > ruinFactor) {
                                // Double door entrance
                                if (dz === d - 1 && dx >= 3 && dx <= 5 && dy < 3) continue;
                                // Drive-thru window
                                if (dx === w - 1 && dz >= 2 && dz <= 4 && dy === 1) continue;
                                // Use brick for bottom, stone for top
                                this.setBlock(x + dx, y + dy, z + dz, dy < 2 ? 'brick' : 'stone');
                            }
                        }
                    }
                }
                
                // The famous "W" arches (golden... well, sand-colored)
                // W shape using sand blocks (yellow-ish) - ALWAYS SOLID, no ruin
                const wX = x + 4;
                const wZ = z + d;
                const wY = y + h;
                
                // Build the W shape - guaranteed to always appear
                // Left vertical leg
                this.setBlock(wX - 2, wY, wZ, 'sand');
                this.setBlock(wX - 2, wY + 1, wZ, 'sand');
                this.setBlock(wX - 2, wY + 2, wZ, 'sand');
                this.setBlock(wX - 2, wY + 3, wZ, 'sand');
                
                // Left diagonal down to center
                this.setBlock(wX - 1, wY, wZ, 'sand');
                this.setBlock(wX - 1, wY + 1, wZ, 'sand');
                
                // Center bottom (the V dip)
                this.setBlock(wX, wY, wZ, 'sand');
                
                // Right diagonal up from center  
                this.setBlock(wX + 1, wY, wZ, 'sand');
                this.setBlock(wX + 1, wY + 1, wZ, 'sand');
                
                // Right vertical leg
                this.setBlock(wX + 2, wY, wZ, 'sand');
                this.setBlock(wX + 2, wY + 1, wZ, 'sand');
                this.setBlock(wX + 2, wY + 2, wZ, 'sand');
                this.setBlock(wX + 2, wY + 3, wZ, 'sand');
                
                // Counter inside
                for (let dx = 2; dx < 7; dx++) {
                    if (Math.random() > 0.3) {
                        this.setBlock(x + dx, y, z + 2, 'brick');
                    }
                }
                
                // Some tables (wood blocks)
                if (Math.random() > 0.4) this.setBlock(x + 2, y, z + 5, 'wood');
                if (Math.random() > 0.4) this.setBlock(x + 6, y, z + 5, 'wood');
                if (Math.random() > 0.4) this.setBlock(x + 4, y, z + 6, 'wood');
                
                // Special WcDonalds chest behind counter - may contain the legendary Berdger!
                this.setBlock(x + 4, y, z + 1, 'buildingChest');
                this.chestContents = this.chestContents || {};
                const chestKey = `${x + 4},${y},${z + 1}`;
                // 30% chance for berdger, otherwise seeds
                if (Math.random() < 0.3) {
                    this.chestContents[chestKey] = [{ type: 'berdger', count: 1 }];
                } else {
                    this.chestContents[chestKey] = [{ type: 'seeds', count: 3 + Math.floor(Math.random() * 5) }];
                }
            },
            
            getHighestBlock(x: number, z: number) {
                for (let y = 30; y >= 0; y--) {
                    if (this.getBlock(x, y, z)) return y;
                }
                return null;
            },
            
            initBirds() {
                this.birds = [];
                const numBirds = 12; // Good number for small world
                
                for (let i = 0; i < numBirds; i++) {
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
                }
            },
            
            // Initialize pest birds (small annoying birds that follow player)
            initPestBirds() {
                this.pestBirds = [];
                const numPests = 3;
                
                for (let i = 0; i < numPests; i++) {
                    this.pestBirds.push({
                        x: 0, y: 12, z: 0,
                        // Velocity for knockback
                        vx: 0, vy: 0, vz: 0,
                        // Target offset from player
                        targetOffsetX: 0,
                        targetOffsetY: 0,
                        targetOffsetZ: 0,
                        // Behavior state
                        state: 'circling', // 'circling', 'swooping', 'retreating', 'hovering', 'knockback'
                        stateTimer: Math.random() * 100,
                        // Movement
                        angle: (i / numPests) * Math.PI * 2, // Spread them out
                        circleRadius: 2 + Math.random(),
                        baseCircleRadius: 2 + Math.random(),
                        circleSpeed: 0.08 + Math.random() * 0.04,
                        swoopProgress: 0,
                        // Visual
                        wingPhase: Math.random() * Math.PI * 2,
                        size: 0.15 + Math.random() * 0.05, // Smaller than regular birds
                        chirpTimer: Math.random() * 60,
                        knockbackSpin: 0,
                        // Anger system - gets angrier when shot
                        anger: 0,           // 0-5 anger level
                        timesShot: 0,       // How many times this bird has been shot
                        spawnThreshold: 4 + Math.floor(Math.random() * 4)  // 4-7 shots to spawn reinforcements
                    });
                }
            },
            
            updatePestBirds() {
                const playerX = this.camera.x;
                const playerY = this.camera.y;
                const playerZ = this.camera.z;
                
                // Check for seed calming effect
                if (!this.seedCalmTimer) this.seedCalmTimer = 0;
                if (this.seedCalmTimer > 0) {
                    this.seedCalmTimer--;
                }
                const birdsCalmed = this.seedCalmTimer > 0;
                
                // Prune excess birds every ~30 seconds (1800 frames at 60fps)
                if (!this.birdPruneTimer) this.birdPruneTimer = 0;
                this.birdPruneTimer++;
                if (this.birdPruneTimer >= 1800) {
                    this.birdPruneTimer = 0;
                    if (this.pestBirds.length > 15) {
                        // Keep the 15 angriest birds
                        this.pestBirds.sort((a: any, b: any) => b.anger - a.anger);
                        this.pestBirds = this.pestBirds.slice(0, 15);
                    }
                }
                
                for (const pest of this.pestBirds) {
                    // Handle rage mode timer
                    if (pest.rageMode && pest.rageTimer) {
                        pest.rageTimer--;
                        if (pest.rageTimer <= 0) {
                            pest.rageMode = false;
                            pest.speed = 0.06; // Reset to normal speed
                        }
                    }
                    
                    // Rage mode makes birds more aggressive
                    
                    // Wind affects all bird movement
                    if (this.wind && pest.state !== 'knockback') {
                        pest.x += this.wind.x * 0.5;
                        pest.z += this.wind.z * 0.5;
                    }
                    
                    // If calmed by seeds, birds retreat and become passive
                    if (birdsCalmed && pest.state !== 'knockback') {
                        pest.state = 'retreating';
                        pest.stateTimer = Math.max(pest.stateTimer, 60);
                        pest.anger = Math.max(0, pest.anger - 0.01); // Slowly calm down
                    }
                    
                    pest.stateTimer--;
                    
                    // Anger affects wing flap speed
                    const angerWingBonus = pest.anger * 0.1;
                    pest.wingPhase += (pest.state === 'knockback' ? 0.8 : 0.5) + angerWingBonus;
                    pest.chirpTimer--;
                    
                    // Calculate anger-based multipliers
                    const angerSpeedMult = 1 + pest.anger * 0.3;      // Up to 2.5x faster at max anger
                    const angerRadiusMult = 1 - pest.anger * 0.1;    // Gets closer when angry (down to 0.5x)
                    const angerSwoopChance = 0.3 + pest.anger * 0.15; // Up to 0.9 swoop chance at max anger
                    
                    // Handle knockback state with physics including wall ricochet
                    if (pest.state === 'knockback') {
                        // Store previous position for collision detection
                        const prevX = pest.x, prevY = pest.y, prevZ = pest.z;
                        
                        // Apply velocity
                        pest.x += pest.vx;
                        pest.y += pest.vy;
                        pest.z += pest.vz;
                        
                        // WALL COLLISION AND RICOCHET
                        const birdBlock = this.getBlock(Math.floor(pest.x), Math.floor(pest.y), Math.floor(pest.z));
                        if (birdBlock && birdBlock !== 'water' && birdBlock !== 'lava') {
                            // Hit a block - check which face and ricochet
                            const isLeaves = birdBlock.includes('Leaves') || birdBlock.includes('leaves');
                            
                            if (isLeaves) {
                                // Leaves catch birds and slow them significantly
                                pest.vx *= 0.4;
                                pest.vy *= 0.4;
                                pest.vz *= 0.4;
                                pest.stateTimer = Math.min(pest.stateTimer, 90); // Stuck briefly
                                pest.caughtInLeaves = true;
                            } else {
                                // Solid block - ricochet with energy loss
                                const blockX = Math.floor(pest.x);
                                const blockY = Math.floor(pest.y);
                                const blockZ = Math.floor(pest.z);
                                
                                // Determine which face was hit and bounce
                                if (!this.getBlock(blockX, Math.floor(prevY), Math.floor(prevZ))) {
                                    pest.vx *= -0.7; // X wall hit
                                    pest.x = prevX;
                                } else if (!this.getBlock(Math.floor(prevX), blockY, Math.floor(prevZ))) {
                                    pest.vy *= -0.7; // Y wall/floor/ceiling hit
                                    pest.y = prevY;
                                } else if (!this.getBlock(Math.floor(prevX), Math.floor(prevY), blockZ)) {
                                    pest.vz *= -0.7; // Z wall hit
                                    pest.z = prevZ;
                                } else {
                                    // Corner - reverse all
                                    pest.vx *= -0.5;
                                    pest.vy *= -0.5;
                                    pest.vz *= -0.5;
                                    pest.x = prevX; pest.y = prevY; pest.z = prevZ;
                                }
                                
                                // Add ricochet particle
                                this.particles.push({
                                    x: pest.x, y: pest.y, z: pest.z,
                                    vx: (Math.random() - 0.5) * 0.1,
                                    vy: Math.random() * 0.1,
                                    vz: (Math.random() - 0.5) * 0.1,
                                    life: 20, type: 'spark', size: 2
                                });
                            }
                        }
                        
                        // If caught in leaves, slowly release
                        if (pest.caughtInLeaves) {
                            pest.vx *= 0.9;
                            pest.vy *= 0.9;
                            pest.vz *= 0.9;
                            pest.vy += 0.01; // Slowly float up out of tree
                            if (Math.abs(pest.vx) < 0.01 && Math.abs(pest.vz) < 0.01) {
                                pest.caughtInLeaves = false;
                            }
                        } else {
                            // Normal drag and gravity
                            pest.vx *= 0.95;
                            pest.vy *= 0.95;
                            pest.vy -= 0.01; // Gravity
                            pest.vz *= 0.95;
                        }
                        
                        // Spin animation
                        pest.knockbackSpin += 0.3;
                        
                        // Recover when velocity is low enough - angrier birds recover faster
                        const speed = Math.sqrt(pest.vx * pest.vx + pest.vy * pest.vy + pest.vz * pest.vz);
                        const recoveryThreshold = 0.05 + pest.anger * 0.02;
                        if (speed < recoveryThreshold || pest.stateTimer <= 0) {
                            // Getting shot makes the bird ANGRIER!
                            pest.anger = Math.min(5, pest.anger + 1);
                            pest.timesShot++;
                            
                            // Spawn reinforcements when threshold reached
                            if (pest.timesShot === pest.spawnThreshold && this.pestBirds.length < 15) {
                                const numToSpawn = 2 + Math.floor(Math.random() * 2); // 2-3 new birds
                                for (let i = 0; i < numToSpawn; i++) {
                                    const newAngle = Math.random() * Math.PI * 2;
                                    const newRadius = 3 + Math.random() * 2;
                                    this.pestBirds.push({
                                        x: this.camera.x + Math.cos(newAngle) * newRadius,
                                        y: this.camera.y + 1 + Math.random(),
                                        z: this.camera.z + Math.sin(newAngle) * newRadius,
                                        vx: 0, vy: 0, vz: 0,
                                        targetOffsetX: 0, targetOffsetY: 0, targetOffsetZ: 0,
                                        state: 'circling',
                                        stateTimer: 20 + Math.random() * 30,
                                        angle: newAngle,
                                        circleRadius: newRadius,
                                        baseCircleRadius: newRadius,
                                        circleSpeed: 0.06 + Math.random() * 0.04,
                                        swoopProgress: 0,
                                        wingPhase: Math.random() * Math.PI * 2,
                                        size: 0.2 + Math.random() * 0.05,
                                        chirpTimer: Math.random() * 60,
                                        knockbackSpin: 0,
                                        anger: 2 + Math.floor(Math.random() * 2), // Spawned already angry (2-3)
                                        timesShot: 0,
                                        spawnThreshold: 4 + Math.floor(Math.random() * 4)
                                    });
                                }
                            }
                            
                            pest.state = 'retreating';
                            pest.stateTimer = Math.max(30, 120 - pest.anger * 20); // Shorter retreat when angry
                            pest.circleRadius = (pest.baseCircleRadius + 4) * angerRadiusMult;
                            pest.vx = pest.vy = pest.vz = 0;
                            pest.knockbackSpin = 0;
                            pest.caughtInLeaves = false;
                        }
                        continue; // Skip normal movement
                    }
                    
                    // State machine for pest behavior
                    switch (pest.state) {
                        case 'circling':
                            // Circle around player's head - faster and closer when angry
                            pest.angle += pest.circleSpeed * angerSpeedMult;
                            pest.targetOffsetX = Math.cos(pest.angle) * pest.circleRadius * angerRadiusMult;
                            pest.targetOffsetZ = Math.sin(pest.angle) * pest.circleRadius * angerRadiusMult;
                            pest.targetOffsetY = 0.5 + Math.sin(pest.angle * 2) * 0.3;
                            
                            // Gradually return to base radius
                            pest.circleRadius += (pest.baseCircleRadius - pest.circleRadius) * 0.01;
                            
                            // Randomly decide to swoop - more likely when angry
                            if (pest.stateTimer <= 0) {
                                if (Math.random() < angerSwoopChance) {
                                    pest.state = 'swooping';
                                    pest.swoopProgress = 0;
                                    pest.stateTimer = 60;
                                } else if (Math.random() < 0.2) {
                                    pest.state = 'hovering';
                                    pest.stateTimer = Math.max(20, 40 - pest.anger * 5) + Math.random() * 40;
                                } else {
                                    pest.stateTimer = Math.max(15, 30 - pest.anger * 5) + Math.random() * 60;
                                }
                            }
                            break;
                            
                        case 'swooping':
                            // Dive at the player's face! Faster when angry
                            pest.swoopProgress += 0.05 * angerSpeedMult;
                            const swoopT = pest.swoopProgress;
                            
                            if (swoopT < 0.5) {
                                // Diving in
                                pest.targetOffsetX = Math.cos(pest.angle) * pest.circleRadius * (1 - swoopT * 2);
                                pest.targetOffsetZ = Math.sin(pest.angle) * pest.circleRadius * (1 - swoopT * 2);
                                pest.targetOffsetY = 0.5 - swoopT;
                            } else {
                                // Pulling away
                                const pullT = (swoopT - 0.5) * 2;
                                pest.targetOffsetX = Math.cos(pest.angle) * pest.circleRadius * pullT;
                                pest.targetOffsetZ = Math.sin(pest.angle) * pest.circleRadius * pullT;
                                pest.targetOffsetY = -0.5 + pullT;
                            }
                            
                            if (pest.swoopProgress >= 1) {
                                pest.state = 'retreating';
                                pest.stateTimer = 30;
                            }
                            break;
                            
                        case 'retreating':
                            // Back off temporarily
                            pest.angle += pest.circleSpeed * 0.5;
                            const retreatDist = pest.circleRadius + 2;
                            pest.targetOffsetX = Math.cos(pest.angle) * retreatDist;
                            pest.targetOffsetZ = Math.sin(pest.angle) * retreatDist;
                            pest.targetOffsetY = 1 + Math.sin(pest.angle * 3) * 0.2;
                            
                            // Gradually return to base radius
                            pest.circleRadius += (pest.baseCircleRadius - pest.circleRadius) * 0.02;
                            
                            if (pest.stateTimer <= 0) {
                                pest.state = 'circling';
                                pest.stateTimer = 60 + Math.random() * 60;
                            }
                            break;
                            
                        case 'hovering':
                            // Hover annoyingly in front of player's face
                            const hoverAngle = Math.sin(Date.now() * 0.01) * 0.3;
                            pest.targetOffsetX = Math.sin(this.camera.rotY + hoverAngle) * -1.5;
                            pest.targetOffsetZ = Math.cos(this.camera.rotY + hoverAngle) * -1.5;
                            pest.targetOffsetY = 0.2 + Math.sin(Date.now() * 0.02) * 0.1;
                            
                            if (pest.stateTimer <= 0) {
                                pest.state = 'circling';
                                pest.stateTimer = 80 + Math.random() * 40;
                            }
                            break;
                    }
                    
                    // Smoothly move toward target position with max speed cap
                    const targetX = playerX + pest.targetOffsetX;
                    const targetY = playerY + pest.targetOffsetY;
                    const targetZ = playerZ + pest.targetOffsetZ;
                    
                    const smoothing = pest.state === 'swooping' ? 0.15 : 0.08;
                    let dx = (targetX - pest.x) * smoothing;
                    let dy = (targetY - pest.y) * smoothing;
                    let dz = (targetZ - pest.z) * smoothing;
                    
                    // Cap maximum speed so player can outrun angry birds
                    // Player moves at ~0.1 per frame when running, birds max at 0.08
                    // Rage mode allows birds to match player speed temporarily
                    const baseMaxSpeed = 0.08;
                    const maxBirdSpeed = pest.rageMode ? 0.12 : baseMaxSpeed; // Rage birds can be faster!
                    const moveSpeed = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (moveSpeed > maxBirdSpeed) {
                        const scale = maxBirdSpeed / moveSpeed;
                        dx *= scale;
                        dy *= scale;
                        dz *= scale;
                    }
                    
                    pest.x += dx;
                    pest.y += dy;
                    pest.z += dz;
                }
            },
            
            updateBirds() {
                for (const bird of this.birds) {
                    // Handle swarm mode timer
                    if (bird.swarmMode && bird.swarmTimer) {
                        bird.swarmTimer--;
                        if (bird.swarmTimer <= 0) {
                            bird.swarmMode = false;
                        }
                    }
                    
                    // Swarm mode: birds converge on player
                    if (bird.swarmMode) {
                        // Move towards player
                        const dx = this.camera.x - bird.x;
                        const dy = this.camera.y - bird.y;
                        const dz = this.camera.z - bird.z;
                        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        
                        if (dist > 3) {
                            bird.x += (dx / dist) * 0.15;
                            bird.y += (dy / dist) * 0.1;
                            bird.z += (dz / dist) * 0.15;
                        } else {
                            // Circle close to player
                            bird.angle += 0.1;
                            bird.x = this.camera.x + Math.cos(bird.angle) * 3;
                            bird.z = this.camera.z + Math.sin(bird.angle) * 3;
                            bird.y = this.camera.y + Math.sin(bird.wobble) * 0.5;
                        }
                        
                        bird.wobble += bird.wobbleSpeed * 2;
                        bird.wingPhase += 0.5; // Faster flapping
                    } else {
                        // Normal flight pattern
                        // Circular flight pattern with wobble
                        bird.angle += bird.speed;
                        bird.wobble += bird.wobbleSpeed;
                        
                        // Center point slowly drifts
                        const centerX = Math.sin(bird.angle * 0.1) * 20;
                        const centerZ = Math.cos(bird.angle * 0.1) * 20;
                        
                        // Base position
                        let bx = centerX + Math.cos(bird.angle) * bird.radius;
                        let bz = centerZ + Math.sin(bird.angle) * bird.radius;
                        
                        // Wind affects bird position
                        if (this.wind) {
                            bx += this.wind.x * 15;
                            bz += this.wind.z * 15;
                        }
                        
                        bird.x = bx;
                        bird.z = bz;
                        bird.y = bird.baseY + Math.sin(bird.wobble) * 2;
                        
                        // Wing flapping
                        bird.wingPhase += 0.3;
                    }
                }
                
                // Also update pest birds
                this.updatePestBirds();
                
                // Update other mobs
                this.updateBlueBirds();
                this.updateFish();
                this.updateCats();
                this.updateCreepers();
                
                // Friendly birds can drop items
                this.updateFriendlyBirdDrops();
                
                // Update bird event timer
                this.updateBirdEventTimer();
            },
            
            // Blue birds - aggressive birds that knockback player
            updateBlueBirds() {
                if (!this.blueBirds) this.blueBirds = [];
                
                for (let i = this.blueBirds.length - 1; i >= 0; i--) {
                    const bird = this.blueBirds[i];
                    
                    bird.wingPhase += 0.6;
                    if (bird.attackCooldown > 0) bird.attackCooldown--;
                    
                    // Chase player aggressively
                    const dx = this.camera.x - bird.x;
                    const dy = this.camera.y - bird.y;
                    const dz = this.camera.z - bird.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    
                    if (dist > 1.5) {
                        // Move towards player
                        bird.vx += (dx / dist) * 0.02;
                        bird.vy += (dy / dist) * 0.015;
                        bird.vz += (dz / dist) * 0.02;
                    }
                    
                    // Apply velocity with drag
                    bird.x += bird.vx;
                    bird.y += bird.vy;
                    bird.z += bird.vz;
                    bird.vx *= 0.9;
                    bird.vy *= 0.9;
                    bird.vz *= 0.9;
                    
                    // Attack player - knockback
                    if (dist < 2 && bird.attackCooldown <= 0) {
                        // Knockback player slightly
                        this.velocity.x += (this.camera.x - bird.x) * 0.1;
                        this.velocity.y += 0.15;
                        this.velocity.z += (this.camera.z - bird.z) * 0.1;
                        bird.attackCooldown = 60; // 1 second cooldown
                    }
                    
                    // Despawn if too far
                    if (dist > 60) {
                        this.blueBirds.splice(i, 1);
                    }
                }
            },
            
            // Fish in water
            updateFish() {
                if (!this.fish) this.fish = [];
                
                for (let i = this.fish.length - 1; i >= 0; i--) {
                    const fish = this.fish[i];
                    fish.swimPhase += 0.15;
                    
                    // Swim in water
                    const block = this.getBlock(Math.floor(fish.x), Math.floor(fish.y), Math.floor(fish.z));
                    if (block !== 'water') {
                        // Not in water - try to find water
                        fish.vy -= 0.01; // Fall
                    } else {
                        // In water - swim around
                        fish.vx += (Math.random() - 0.5) * 0.01;
                        fish.vz += (Math.random() - 0.5) * 0.01;
                        fish.vy += (Math.random() - 0.5) * 0.005;
                    }
                    
                    fish.x += fish.vx;
                    fish.y += fish.vy;
                    fish.z += fish.vz;
                    fish.vx *= 0.95;
                    fish.vy *= 0.95;
                    fish.vz *= 0.95;
                    
                    // Limit speed
                    const speed = Math.sqrt(fish.vx * fish.vx + fish.vz * fish.vz);
                    if (speed > 0.08) {
                        fish.vx = (fish.vx / speed) * 0.08;
                        fish.vz = (fish.vz / speed) * 0.08;
                    }
                }
            },
            
            // Cats follow player
            updateCats() {
                if (!this.cats) this.cats = [];
                
                for (const cat of this.cats) {
                    cat.walkPhase += 0.1;
                    cat.meowTimer--;
                    
                    const dx = this.camera.x - cat.x;
                    const dz = this.camera.z - cat.z;
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    
                    // Follow player if too far
                    if (dist > cat.followDistance + 2) {
                        cat.state = 'following';
                        cat.vx += (dx / dist) * 0.01;
                        cat.vz += (dz / dist) * 0.01;
                    } else if (dist < cat.followDistance) {
                        cat.state = 'idle';
                    }
                    
                    // Apply movement with ground detection
                    cat.x += cat.vx;
                    cat.z += cat.vz;
                    cat.vx *= 0.85;
                    cat.vz *= 0.85;
                    
                    // Gravity and ground collision
                    cat.vy -= 0.02;
                    cat.y += cat.vy;
                    
                    const groundY = Math.floor(cat.y);
                    if (this.getBlock(Math.floor(cat.x), groundY, Math.floor(cat.z))) {
                        cat.y = groundY + 1;
                        cat.vy = 0;
                    }
                    
                    // Random meow
                    if (cat.meowTimer <= 0) {
                        cat.meowTimer = 200 + Math.random() * 400;
                        // Add meow particle/effect if desired
                    }
                }
            },
            
            // Creepers stalk and explode
            updateCreepers() {
                if (!this.creepers) this.creepers = [];
                
                for (let i = this.creepers.length - 1; i >= 0; i--) {
                    const creeper = this.creepers[i];
                    creeper.walkPhase += 0.08;
                    
                    const dx = this.camera.x - creeper.x;
                    const dz = this.camera.z - creeper.z;
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    
                    if (creeper.state === 'stalking') {
                        // Walk towards player slowly
                        if (dist > 2) {
                            creeper.vx += (dx / dist) * 0.003;
                            creeper.vz += (dz / dist) * 0.003;
                        } else {
                            // Close enough - start fuse!
                            creeper.state = 'fusing';
                            creeper.fuseTimer = 0;
                        }
                    } else if (creeper.state === 'fusing') {
                        creeper.fuseTimer++;
                        
                        // Flash warning
                        creeper.flashing = Math.floor(creeper.fuseTimer / 5) % 2 === 0;
                        
                        if (creeper.fuseTimer >= creeper.fuseMax) {
                            // EXPLODE!
                            this.creeperExplode(creeper);
                            this.creepers.splice(i, 1);
                            continue;
                        }
                        
                        // Player can escape
                        if (dist > 4) {
                            creeper.state = 'stalking';
                            creeper.fuseTimer = 0;
                        }
                    }
                    
                    // Apply movement
                    creeper.x += creeper.vx;
                    creeper.z += creeper.vz;
                    creeper.vx *= 0.9;
                    creeper.vz *= 0.9;
                    
                    // Gravity
                    creeper.vy -= 0.02;
                    creeper.y += creeper.vy;
                    
                    const groundY = Math.floor(creeper.y);
                    if (this.getBlock(Math.floor(creeper.x), groundY, Math.floor(creeper.z))) {
                        creeper.y = groundY + 1;
                        creeper.vy = 0;
                    }
                }
            },
            
            // Creeper explosion
            creeperExplode(creeper) {
                // Launch player
                const dx = this.camera.x - creeper.x;
                const dz = this.camera.z - creeper.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                if (dist < 6) {
                    const force = (6 - dist) / 6 * 1.5;
                    this.velocity.x += (dx / dist) * force;
                    this.velocity.y += 0.8;
                    this.velocity.z += (dz / dist) * force;
                }
                
                // Explosion particles
                for (let i = 0; i < 30; i++) {
                    this.particles.push({
                        x: creeper.x, y: creeper.y + 0.5, z: creeper.z,
                        vx: (Math.random() - 0.5) * 0.3,
                        vy: Math.random() * 0.3,
                        vz: (Math.random() - 0.5) * 0.3,
                        life: 30 + Math.random() * 20,
                        type: 'explosion',
                        size: 3 + Math.random() * 3
                    });
                }
                
                // Spawn blue bird horde!
                for (let i = 0; i < 5; i++) {
                    this.spawnBlueBird();
                }
                
                // Alert
                if (this.birdEvent) {
                    this.showBirdAlert('💥 CREEPER EXPLODED! Blue birds incoming! 💥');
                }
            },
            
            // Friendly birds drop items
            updateFriendlyBirdDrops() {
                if (!this.birdDropTimer) this.birdDropTimer = 0;
                this.birdDropTimer++;
                
                // Every ~10 seconds, chance for friendly bird to drop item
                if (this.birdDropTimer >= 600) {
                    this.birdDropTimer = 0;
                    
                    for (const bird of this.birds) {
                        // 30% chance per bird
                        if (Math.random() < 0.3) {
                            // Determine drop
                            const roll = Math.random();
                            let dropType = 'seeds';
                            let dropCount = 1 + Math.floor(Math.random() * 3);
                            
                            if (roll < 0.05) {
                                // 5% rare item
                                dropType = ['berdger', 'omamori', 'shimenawa'][Math.floor(Math.random() * 3)];
                                dropCount = 1;
                            } else if (roll < 0.2) {
                                // 15% apple
                                dropType = 'apple';
                                dropCount = 1 + Math.floor(Math.random() * 2);
                            }
                            
                            // Drop item near player
                            this.dropItem(
                                bird.x + (Math.random() - 0.5) * 2,
                                bird.y - 2,
                                bird.z + (Math.random() - 0.5) * 2,
                                dropType, dropCount
                            );
                            
                            // Only one drop per cycle
                            break;
                        }
                    }
                }
            },
            
            // Bird event timer system
            updateBirdEventTimer() {
                if (!this.birdEvent) return;
                
                const now = Date.now();
                const delta = now - this.birdEvent.lastUpdate;
                this.birdEvent.lastUpdate = now;
                this.birdEvent.timer -= delta;
                
                // Fade out alerts
                if (this.birdEvent.alertFade > 0) {
                    this.birdEvent.alertFade -= delta;
                    if (this.birdEvent.alertFade <= 0) {
                        this.birdEvent.alertMessage = null;
                    }
                }
                
                const timeLeft = this.birdEvent.timer;
                const nextEvent = this.birdEvent.events[this.birdEvent.currentEvent];
                
                // Show alerts at specific times
                if (timeLeft <= 5 * 60 * 1000 && timeLeft > 4 * 60 * 1000 && !this.birdEvent.alertShown.five) {
                    this.showBirdAlert(`⚠️ In 5 minutes, ${nextEvent.description} ⚠️`);
                    this.birdEvent.alertShown.five = true;
                }
                if (timeLeft <= 3 * 60 * 1000 && timeLeft > 2 * 60 * 1000 && !this.birdEvent.alertShown.three) {
                    this.showBirdAlert(`⚠️ In 3 minutes, ${nextEvent.description} ⚠️`);
                    this.birdEvent.alertShown.three = true;
                }
                if (timeLeft <= 1 * 60 * 1000 && timeLeft > 50 * 1000 && !this.birdEvent.alertShown.one) {
                    this.showBirdAlert(`⚠️ In 1 minute, ${nextEvent.description} ⚠️`);
                    this.birdEvent.alertShown.one = true;
                }
                if (timeLeft <= 30 * 1000 && timeLeft > 20 * 1000 && !this.birdEvent.alertShown.thirty) {
                    this.showBirdAlert(`⚠️ In 30 seconds, ${nextEvent.description.toUpperCase()} ⚠️`);
                    this.birdEvent.alertShown.thirty = true;
                }
                if (timeLeft <= 10 * 1000 && timeLeft > 5 * 1000 && !this.birdEvent.alertShown.ten) {
                    this.showBirdAlert(`🔥 In 10 seconds, ${nextEvent.description.toUpperCase()} 🔥`);
                    this.birdEvent.alertShown.ten = true;
                }
                
                // Trigger event when timer reaches 0
                if (timeLeft <= 0) {
                    this.triggerBirdEvent();
                }
            },
            
            showBirdAlert(message) {
                this.birdEvent.alertMessage = message;
                this.birdEvent.alertFade = 4000; // 4 seconds
            },
            
            triggerBirdEvent() {
                const event = this.birdEvent.events[this.birdEvent.currentEvent];
                this.showBirdAlert(`🐦 BIRD EVENT: ${event.name}! 🐦`);
                event.action();
                
                // Reset timer and move to next event
                this.birdEvent.timer = 5 * 60 * 1000; // Reset to 5 minutes
                this.birdEvent.currentEvent = (this.birdEvent.currentEvent + 1) % this.birdEvent.events.length;
                this.birdEvent.alertShown = { five: false, three: false, one: false, thirty: false, ten: false };
            },
            
            // Bird Event 1: Swarm - all birds converge on player
            triggerBirdSwarm() {
                // Make all decorative birds become aggressive for 30 seconds
                for (const bird of this.birds) {
                    bird.swarmMode = true;
                    bird.swarmTimer = 30 * 60; // 30 seconds at 60fps
                }
                // Also spawn extra pest birds
                for (let i = 0; i < 5; i++) {
                    this.spawnPestBird();
                }
            },
            
            // Bird Event 2: Rage - pest birds become faster and more aggressive
            triggerBirdRage() {
                // Boost all pest birds
                if (this.pestBirds) {
                    for (const bird of this.pestBirds) {
                        bird.rageMode = true;
                        bird.rageTimer = 45 * 60; // 45 seconds
                        bird.speed = (bird.speed || 0.06) * 1.5;
                    }
                }
                // Spawn some extra angry birds
                for (let i = 0; i < 3; i++) {
                    const bird = this.spawnPestBird();
                    if (bird) {
                        bird.rageMode = true;
                        bird.rageTimer = 45 * 60;
                    }
                }
            },
            
            // Bird Event 3: Multiply - spawn many birds everywhere
            triggerBirdMultiply() {
                // Spawn lots of pest birds at random locations around the player
                for (let i = 0; i < 10; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 10 + Math.random() * 20;
                    const bird = this.spawnPestBird();
                    if (bird) {
                        bird.x = this.camera.x + Math.cos(angle) * dist;
                        bird.z = this.camera.z + Math.sin(angle) * dist;
                        bird.y = this.camera.y + 5 + Math.random() * 10;
                    }
                }
            },
            
            // Bird Event 4: Creeper Invasion - spawn stalking creepers
            triggerCreeperInvasion() {
                this.showBirdAlert('💥 CREEPERS ARE STALKING YOU! 💥');
                // Spawn 2-4 creepers around the player
                const numCreepers = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < numCreepers; i++) {
                    this.spawnCreeper();
                }
            },
            
            spawnPestBird() {
                if (!this.pestBirds) this.pestBirds = [];
                const bird = {
                    x: this.camera.x + (Math.random() - 0.5) * 30,
                    y: this.camera.y + 10 + Math.random() * 10,
                    z: this.camera.z + (Math.random() - 0.5) * 30,
                    vx: 0, vy: 0, vz: 0,
                    state: 'hunting',
                    wingPhase: Math.random() * Math.PI * 2,
                    speed: 0.06,
                    angryTimer: 60 * 60 * 5 // 5 minutes
                };
                this.pestBirds.push(bird);
                return bird;
            },
            
            // Spawn blue bird (more aggressive, can knockback player)
            spawnBlueBird() {
                if (!this.blueBirds) this.blueBirds = [];
                const bird = {
                    x: this.camera.x + (Math.random() - 0.5) * 20,
                    y: this.camera.y + 5 + Math.random() * 8,
                    z: this.camera.z + (Math.random() - 0.5) * 20,
                    vx: 0, vy: 0, vz: 0,
                    state: 'aggressive',
                    wingPhase: Math.random() * Math.PI * 2,
                    speed: 0.1, // Faster than normal birds
                    attackCooldown: 0
                };
                this.blueBirds.push(bird);
                return bird;
            },
            
            // Spawn fish in water
            spawnFish() {
                if (!this.fish) this.fish = [];
                // Find water to spawn in
                let waterPos = null;
                for (let attempts = 0; attempts < 50; attempts++) {
                    const x = Math.floor(this.camera.x + (Math.random() - 0.5) * 40);
                    const z = Math.floor(this.camera.z + (Math.random() - 0.5) * 40);
                    for (let y = 20; y >= 0; y--) {
                        if (this.getBlock(x, y, z) === 'water') {
                            waterPos = { x: x + 0.5, y: y + 0.5, z: z + 0.5 };
                            break;
                        }
                    }
                    if (waterPos) break;
                }
                
                if (!waterPos) {
                    // Spawn near player in any case
                    waterPos = { 
                        x: this.camera.x + (Math.random() - 0.5) * 10, 
                        y: 7, 
                        z: this.camera.z + (Math.random() - 0.5) * 10 
                    };
                }
                
                const fish = {
                    x: waterPos.x, y: waterPos.y, z: waterPos.z,
                    vx: (Math.random() - 0.5) * 0.05,
                    vy: 0,
                    vz: (Math.random() - 0.5) * 0.05,
                    swimPhase: Math.random() * Math.PI * 2,
                    color: Math.random() > 0.5 ? '#ff6347' : '#ffd700', // Orange or gold
                    size: 0.3 + Math.random() * 0.2
                };
                this.fish.push(fish);
                return fish;
            },
            
            // Spawn cat that follows player
            spawnCat() {
                if (!this.cats) this.cats = [];
                const cat = {
                    x: this.camera.x + (Math.random() - 0.5) * 10,
                    y: this.camera.y - 1,
                    z: this.camera.z + (Math.random() - 0.5) * 10,
                    vx: 0, vy: 0, vz: 0,
                    state: 'idle',
                    walkPhase: 0,
                    color: ['#ffa500', '#808080', '#000000', '#ffffff'][Math.floor(Math.random() * 4)], // Orange, gray, black, white
                    meowTimer: Math.random() * 300 + 200,
                    followDistance: 3 + Math.random() * 2
                };
                this.cats.push(cat);
                return cat;
            },
            
            // Spawn creeper (explodes, spawns blue birds)
            spawnCreeper() {
                if (!this.creepers) this.creepers = [];
                const creeper = {
                    x: this.camera.x + (Math.random() > 0.5 ? 15 : -15) + (Math.random() - 0.5) * 10,
                    y: this.camera.y,
                    z: this.camera.z + (Math.random() > 0.5 ? 15 : -15) + (Math.random() - 0.5) * 10,
                    vx: 0, vy: 0, vz: 0,
                    state: 'stalking',
                    fuseTimer: 0,
                    fuseMax: 90, // 1.5 seconds fuse
                    walkPhase: 0,
                    health: 3
                };
                this.creepers.push(creeper);
                return creeper;
            },
            
            // Update survival HUD
            updateSurvivalHUD() {
                if (!this.survivalStats) return;
                
                const scoreEl = document.getElementById('scoreDisplay');
                const waveEl = document.getElementById('waveDisplay');
                const objEl = document.getElementById('objectiveDisplay');
                
                if (scoreEl) scoreEl.textContent = `Score: ${this.survivalStats.score}`;
                if (waveEl) waveEl.textContent = `Wave: ${this.survivalStats.wave}`;
                if (objEl && this.survivalStats.currentObjective) {
                    objEl.textContent = `Objective: ${this.survivalStats.currentObjective.text}`;
                }
            },
            
            // Generate Ritual Temple - only one per world
            generateRitualTemple(x: number, y: number, z: number) {
                const w = 11;
                const h = 8;
                const d = 11;
                
                // Mark temple location
                this.ritualTempleLocation = { x, y, z };
                
                // Clear space
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        for (let dy = 0; dy < h + 2; dy++) {
                            this.setBlock(x + dx, y + dy, z + dz, null);
                        }
                    }
                }
                
                // Floor
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        this.setBlock(x + dx, y, z + dz, 'ritualStone');
                    }
                }
                
                // Walls
                for (let dy = 1; dy < h; dy++) {
                    for (let dx = 0; dx < w; dx++) {
                        this.setBlock(x + dx, y + dy, z, 'ritualStone');
                        this.setBlock(x + dx, y + dy, z + d - 1, 'ritualStone');
                    }
                    for (let dz = 0; dz < d; dz++) {
                        this.setBlock(x, y + dy, z + dz, 'ritualStone');
                        this.setBlock(x + w - 1, y + dy, z + dz, 'ritualStone');
                    }
                }
                
                // Entrance
                this.setBlock(x + w/2|0, y + 1, z, null);
                this.setBlock(x + w/2|0, y + 2, z, null);
                this.setBlock(x + w/2|0, y + 3, z, null);
                
                // Ritual socket blocks in center (5 sockets for 5 ritual items)
                const cx = x + w/2|0;
                const cz = z + d/2|0;
                
                this.setBlock(cx, y + 1, cz, 'charmSocket');      // Center - Omamori
                this.setBlock(cx - 2, y + 1, cz, 'petalSocket');  // Left - Sakura Petal
                this.setBlock(cx + 2, y + 1, cz, 'ropeSocket');   // Right - Shimenawa
                this.setBlock(cx, y + 1, cz - 2, 'plaqueSocket'); // Back - Ema
                this.setBlock(cx, y + 1, cz + 2, 'incenseSocket'); // Front - Incense
                
                // Glowing pillars
                for (let dy = 1; dy <= 4; dy++) {
                    this.setBlock(x + 2, y + dy, z + 2, 'glowstone');
                    this.setBlock(x + w - 3, y + dy, z + 2, 'glowstone');
                    this.setBlock(x + 2, y + dy, z + d - 3, 'glowstone');
                    this.setBlock(x + w - 3, y + dy, z + d - 3, 'glowstone');
                }
            },
            
            // Generate apple tree with green leaves and chance to drop apples
            generateTree(x: number, y: number, z: number) {
                for (let h = 0; h < 4; h++) {
                    this.setBlock(x, y + h, z, 'wood');
                }
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dz = -2; dz <= 2; dz++) {
                        for (let dy = 3; dy <= 5; dy++) {
                            if (Math.abs(dx) + Math.abs(dz) + Math.abs(dy - 4) < 4) {
                                if (!(dx === 0 && dz === 0 && dy < 4)) {
                                    this.setBlock(x + dx, y + dy, z + dz, 'appleLeaves');
                                }
                            }
                        }
                    }
                }
                // Store apple tree for occasional apple drops
                if (!this.appleTrees) this.appleTrees = [];
                this.appleTrees.push({ x, y: y + 4, z });
            },
            
            // Generate cherry blossom tree (larger, more dramatic)
            generateCherryTree(x: number, y: number, z: number) {
                // Taller trunk with pink-tinted wood
                for (let h = 0; h < 6; h++) {
                    this.setBlock(x, y + h, z, 'cherryWood');
                }
                
                // Wider, more dramatic canopy
                for (let dx = -3; dx <= 3; dx++) {
                    for (let dz = -3; dz <= 3; dz++) {
                        for (let dy = 4; dy <= 8; dy++) {
                            const dist = Math.abs(dx) + Math.abs(dz) + Math.abs(dy - 6);
                            if (dist < 5 && Math.random() > 0.15) {
                                if (!(dx === 0 && dz === 0 && dy < 5)) {
                                    this.setBlock(x + dx, y + dy, z + dz, 'cherryLeaves');
                                }
                            }
                        }
                    }
                }
                
                // Store tree location for petal spawning
                this.cherryTrees.push({ x, y: y + 6, z });
            },
            
            setBlock(x: number, y: number, z: number, type: string) {
                const key = `${x},${y},${z}`;
                if (type === null) {
                    delete this.world[key];
                } else {
                    this.world[key] = type;
                }
            },
            
            getBlock(x: number, y: number, z: number) {
                return this.world[`${x},${y},${z}`] || null;
            },
            
            setupControls() {
                // Keyboard controls
                document.addEventListener('keydown', (e) => {
                    if (!this.isActive) return;
                    
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        
                        // If inventory is open, close it instead of pausing
                        if (this.inventoryOpen) {
                            this.toggleInventory();
                            return;
                        }
                        
                        if (this.isPaused) {
                            this.resume();
                        } else {
                            this.pause();
                        }
                        return;
                    }
                    
                    if (this.isPaused) return;
                    
                    this.keys[e.key.toLowerCase()] = true;
                    
                    // Hotbar selection (1-9)
                    const slotKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
                    const slotIdx = slotKeys.indexOf(e.key);
                    if (slotIdx !== -1) {
                        this.selectedSlot = slotIdx;
                        const slot = this.inventory.hotbar[slotIdx];
                        if (slot) {
                            if (slot.type === 'block') {
                                this.selectedBlock = slot.id;
                                this.selectedItem = null;
                            } else if (slot.type === 'weapon') {
                                this.selectedItem = slot.id;
                                this.selectedBlock = null;
                            }
                        }
                        this.updateHotbar();
                    }
                    
                    // Toggle inventory with E
                    if (e.key.toLowerCase() === 'e') {
                        this.toggleInventory();
                    }
                    
                    // Drop item with Q
                    if (e.key.toLowerCase() === 'q') {
                        this.dropHeldItem();
                    }
                    
                    // Check ritual with R
                    if (e.key.toLowerCase() === 'r') {
                        if (this.checkRitual()) {
                            console.log('Omamori Ritual Complete! Birds are blessed and calmed.');
                        }
                    }
                    
                    // Toggle debug console with backtick
                    if (e.key === '`' || e.key === '~') {
                        e.preventDefault();
                        this.toggleDebugConsole();
                        return;
                    }
                    
                    // Jump is handled in update() for continuous jumping while holding space
                    
                    e.preventDefault();
                });
                
                document.addEventListener('keyup', (e) => {
                    this.keys[e.key.toLowerCase()] = false;
                });
                
                // ===== POINTER LOCK CONTROLS (Industry Standard for Browser FPS) =====
                // Pointer Lock is the ONLY way to truly capture mouse across monitors
                
                this.pointerLocked = false;
                
                // Pointer lock state change handler
                document.addEventListener('pointerlockchange', () => {
                    this.pointerLocked = document.pointerLockElement === this.canvas;
                    
                    if (this.pointerLocked) {
                        // Successfully locked - hide overlay
                        document.getElementById('clickToPlay')!.classList.remove('active');
                    } else {
                        // Lock released (user pressed ESC or we exited)
                        // If game is active and not paused and inventory is NOT open
                        // and we didn't just close the inventory, pause
                        if (this.isActive && !this.isPaused && !this.inventoryOpen && !this.justClosedInventory) {
                            this.pause();
                        }
                    }
                });
                
                // Pointer lock error handler
                document.addEventListener('pointerlockerror', () => {
                    console.log('Pointer lock failed');
                    // Show the click overlay so user can try again
                    if (this.isActive && !this.isPaused) {
                        document.getElementById('clickToPlay')!.classList.add('active');
                    }
                });
                
                // Mouse button handler - works during pointer lock
                this.canvas.addEventListener('mousedown', (e) => {
                    if (!this.isActive || this.isPaused) return;
                    
                    // If inventory is open, handle inventory clicks
                    if (this.inventoryOpen) {
                        // TODO: Handle inventory slot clicks
                        return;
                    }
                    
                    // If not locked, any click should request pointer lock
                    if (!this.pointerLocked) {
                        this.canvas.requestPointerLock();
                        return;
                    }
                    
                    if (e.button === 0) {
                        // Left click - BREAK block
                        const hit = this.raycast();
                        if (hit && hit.hit) {
                            const blockType = this.getBlock(hit.hit.x, hit.hit.y, hit.hit.z);
                            
                            // Cannot break water or lava
                            if (blockType === 'water' || blockType === 'lava') {
                                return;
                            }
                            
                            // Helper to check if block is a chest
                            const isChest = (b) => b && (b === 'chest' || b === 'ritualChest' || b === 'buildingChest' || b.toLowerCase().includes('chest'));
                            
                            // Helper to check if block is a socket (indestructible)
                            const isSocket = (b) => b && b.includes('Socket');
                            if (isSocket(blockType)) {
                                return; // Can't break socket blocks
                            }
                            
                            this.setBlock(hit.hit.x, hit.hit.y, hit.hit.z, null);
                            this.stats.blocksBroken++;
                            
                            // Score for breaking blocks
                            if (this.survivalStats) {
                                this.survivalStats.score += 1;
                                this.updateSurvivalHUD();
                            }
                            
                            // Drop the block as an item (if it's a normal block, not chest)
                            if (blockType && !isChest(blockType)) {
                                // Special drops for certain blocks
                                if (blockType === 'appleLeaves') {
                                    // Apple leaves have chance to drop apple
                                    this.dropItem(hit.hit.x + 0.5, hit.hit.y + 0.5, hit.hit.z + 0.5, 'appleLeaves', 1);
                                    if (Math.random() < 0.15) {
                                        this.dropItem(hit.hit.x + 0.5, hit.hit.y + 0.5, hit.hit.z + 0.5, 'apple', 1);
                                    }
                                } else if (blockType === 'cherryLeaves') {
                                    // Cherry leaves have chance to drop sakura petals
                                    this.dropItem(hit.hit.x + 0.5, hit.hit.y + 0.5, hit.hit.z + 0.5, 'cherryLeaves', 1);
                                    if (Math.random() < 0.1) {
                                        this.dropItem(hit.hit.x + 0.5, hit.hit.y + 0.5, hit.hit.z + 0.5, 'sakuraPetal', 1);
                                    }
                                } else {
                                    this.dropItem(hit.hit.x + 0.5, hit.hit.y + 0.5, hit.hit.z + 0.5, blockType, 1);
                                }
                            } else if (isChest(blockType)) {
                                // Breaking a chest drops its contents
                                const chestKey = `${hit.hit.x},${hit.hit.y},${hit.hit.z}`;
                                const contents = this.chestContents && this.chestContents[chestKey];
                                if (contents && Array.isArray(contents)) {
                                    for (const item of contents) {
                                        if (item && item.type) {
                                            this.dropItem(hit.hit.x + 0.5, hit.hit.y + 0.5, hit.hit.z + 0.5, item.type, item.count || 1);
                                        }
                                    }
                                    delete this.chestContents[chestKey];
                                }
                                // Also drop the chest itself
                                this.dropItem(hit.hit.x + 0.5, hit.hit.y + 0.5, hit.hit.z + 0.5, 'chest', 1);
                            }
                        }
                    } else if (e.button === 2) {
                        // Right click - PLACE block, SHOOT, USE item, or interact
                        // First check for chest interaction
                        const hit = this.raycast();
                        if (hit && hit.hit) {
                            const hitBlock = this.getBlock(hit.hit.x, hit.hit.y, hit.hit.z);
                            // Check for any type of chest (case-insensitive)
                            if (hitBlock && (hitBlock === 'chest' || hitBlock === 'ritualChest' || hitBlock === 'buildingChest' || hitBlock.toLowerCase().includes('chest'))) {
                                this.openChest(hit.hit.x, hit.hit.y, hit.hit.z);
                                return;
                            }
                            
                            // Check for ritual socket blocks
                            if (hitBlock && hitBlock.includes('Socket')) {
                                this.interactWithSocket(hit.hit.x, hit.hit.y, hit.hit.z, hitBlock);
                                return;
                            }
                        }
                        
                        // Check held item
                        const heldSlot = this.inventory.hotbar[this.selectedSlot];
                        const heldId = heldSlot ? heldSlot.id : null;
                        
                        if (this.selectedItem === 'ak47') {
                            // Shoot the AK-47!
                            this.shootAK47();
                        } else if (heldId === 'berdger') {
                            // Shoot the Berdger! (infinite burgers)
                            this.shootBerdger();
                        } else if (heldId === 'apple') {
                            // Throw an apple at birds
                            this.throwApple();
                        } else if (heldId === 'seeds') {
                            // Use seeds to calm birds
                            this.useSeeds();
                        } else if (this.selectedItem === 'water_bucket' || this.selectedItem === 'lava_bucket') {
                            // Pour bucket
                            const hit = this.raycast();
                            if (hit && hit.place) {
                                const fluidType = this.selectedItem === 'water_bucket' ? 'water' : 'lava';
                                const placePos = hit.place;
                                
                                // Don't pour inside player
                                const px = Math.floor(this.camera.x);
                                const pz = Math.floor(this.camera.z);
                                const feetY = Math.floor(this.camera.y - this.playerEyeHeight);
                                const headY = Math.floor(this.camera.y - this.playerEyeHeight + this.playerHeight);
                                
                                let wouldCollide = false;
                                for (let checkY = feetY; checkY <= headY; checkY++) {
                                    if (px === placePos.x && checkY === placePos.y && pz === placePos.z) {
                                        wouldCollide = true;
                                        break;
                                    }
                                }
                                
                                if (!wouldCollide) {
                                    // Place source fluid block with full level (8)
                                    this.setBlock(placePos.x, placePos.y, placePos.z, fluidType);
                                    this.setFluidLevel(placePos.x, placePos.y, placePos.z, 8);
                                    
                                    // Add to fluid update queue for spreading
                                    this.fluidUpdates.push({
                                        x: placePos.x,
                                        y: placePos.y,
                                        z: placePos.z,
                                        type: fluidType,
                                        level: 8  // Source block has max level
                                    });
                                    
                                    // Consume bucket
                                    const slot = this.inventory.hotbar[this.selectedSlot];
                                    if (slot && slot.count > 1) {
                                        slot.count--;
                                    } else {
                                        this.inventory.hotbar[this.selectedSlot] = null;
                                        this.selectedItem = null;
                                    }
                                    this.updateHotbar();
                                }
                            }
                        } else if (this.selectedBlock) {
                            // Place block
                            const hit = this.raycast();
                            if (hit && hit.place) {
                                // Don't place block inside player
                                const px = Math.floor(this.camera.x);
                                const pz = Math.floor(this.camera.z);
                                const placePos = hit.place;
                                
                                // Check if placement would be inside player body
                                const feetY = Math.floor(this.camera.y - this.playerEyeHeight);
                                const headY = Math.floor(this.camera.y - this.playerEyeHeight + this.playerHeight);
                                
                                let wouldCollide = false;
                                for (let checkY = feetY; checkY <= headY; checkY++) {
                                    if (px === placePos.x && checkY === placePos.y && pz === placePos.z) {
                                        wouldCollide = true;
                                        break;
                                    }
                                }
                                
                                if (!wouldCollide) {
                                    this.setBlock(placePos.x, placePos.y, placePos.z, this.selectedBlock);
                                    this.stats.blocksPlaced++;
                                    
                                    // Consume block from inventory
                                    const slot = this.inventory.hotbar[this.selectedSlot];
                                    if (slot && slot.count > 0) {
                                        slot.count--;
                                        if (slot.count <= 0) {
                                            this.inventory.hotbar[this.selectedSlot] = null;
                                            this.selectedBlock = null;
                                        }
                                        this.updateHotbarDisplay();
                                    }
                                }
                            }
                        }
                    }
                });
                
                // Prevent context menu from appearing
                this.canvas.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                });
                
                // Scroll wheel - change hotbar selection
                this.canvas.addEventListener('wheel', (e) => {
                    if (!this.isActive || this.isPaused || this.inventoryOpen) return;
                    e.preventDefault();
                    
                    // Scroll down = next slot, scroll up = previous slot
                    if (e.deltaY > 0) {
                        this.selectedSlot = (this.selectedSlot + 1) % 9;
                    } else if (e.deltaY < 0) {
                        this.selectedSlot = (this.selectedSlot + 8) % 9; // +8 is same as -1 mod 9
                    }
                    
                    // Update selected item
                    const slot = this.inventory.hotbar[this.selectedSlot];
                    if (slot) {
                        if (slot.type === 'block') {
                            this.selectedBlock = slot.id;
                            this.selectedItem = null;
                        } else if (slot.type === 'weapon') {
                            this.selectedItem = slot.id;
                            this.selectedBlock = null;
                        } else if (slot.type === 'bucket') {
                            this.selectedItem = slot.id;
                            this.selectedBlock = null;
                        }
                    } else {
                        this.selectedBlock = null;
                        this.selectedItem = null;
                    }
                    this.updateHotbar();
                }, { passive: false });
                
                // Also catch wheel events on the game container to prevent page scroll
                const gameContainer = document.getElementById('minecraftGame');
                gameContainer.addEventListener('wheel', (e) => {
                    if (this.isActive) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, { passive: false });
                
                // Mouse movement - use movementX/Y deltas (works across screen boundaries)
                document.addEventListener('mousemove', (e) => {
                    if (!this.isActive || this.isPaused || !this.pointerLocked) return;
                    
                    // movementX/Y provide delta movement even across screen edges
                    this.camera.rotY -= e.movementX * 0.003;
                    this.camera.rotX = Math.max(-1.5, Math.min(1.5, this.camera.rotX + e.movementY * 0.003));
                });
                
                // Visibility change - pause when tab hidden
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden && this.isActive && !this.isPaused) {
                        this.pause();
                    }
                });
                
                // Window resize - update canvas if fullscreen
                window.addEventListener('resize', () => {
                    const isFs = document.fullscreenElement || document.webkitFullscreenElement;
                    if (isFs && this.isActive) {
                        this.canvas.width = window.innerWidth;
                        this.canvas.height = window.innerHeight;
                    }
                });
                
                // Hotbar clicks
                document.querySelectorAll('.hotbar-slot').forEach((slot, index) => {
                    slot.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.selectedSlot = index;
                        const invSlot = this.inventory.hotbar[index];
                        if (invSlot) {
                            if (invSlot.type === 'block') {
                                this.selectedBlock = invSlot.id;
                                this.selectedItem = null;
                            } else if (invSlot.type === 'weapon') {
                                this.selectedItem = invSlot.id;
                                this.selectedBlock = null;
                            }
                        }
                        this.updateHotbar();
                    });
                });
            },
            
            setupMenus() {
                // Resume button
                document.getElementById('btnResume')!.addEventListener('click', () => this.resume());
                
                // Fullscreen toggle button
                document.getElementById('btnFullscreen')!.addEventListener('click', (e) => {
                    e.preventDefault();
                    const container = document.getElementById('minecraftGame');
                    const isFs = document.fullscreenElement || document.webkitFullscreenElement;
                    
                    if (isFs) {
                        // Exit fullscreen
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                    } else {
                        // Enter fullscreen - must be in same click handler
                        if (container.requestFullscreen) {
                            container.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
                        } else if (container.webkitRequestFullscreen) {
                            container.webkitRequestFullscreen();
                        }
                    }
                    
                    // Resume game after toggling
                    this.resume();
                });
                
                // Update button text on fullscreen change
                document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
                document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButton());
                
                // Account button (disabled)
                document.getElementById('btnAccount')!.addEventListener('click', (e) => {
                    e.preventDefault();
                });
                
                // Stats button
                document.getElementById('btnStats')!.addEventListener('click', () => {
                    this.showSubmenu('menuStats');
                    this.updateStatsDisplay();
                });
                
                // Options button
                document.getElementById('btnOptions')!.addEventListener('click', () => {
                    this.showSubmenu('menuOptions');
                });
                
                // Quit button
                document.getElementById('btnQuit')!.addEventListener('click', () => this.stop());
                
                // Back buttons
                document.getElementById('statsBack')!.addEventListener('click', () => this.showSubmenu('menuMain'));
                document.getElementById('optionsBack')!.addEventListener('click', () => this.showSubmenu('menuMain'));
                
                // Options controls
                document.getElementById('optBrightness')!.addEventListener('input', (e) => {
                    this.settings.brightness = parseInt(e.target.value);
                    this.applyFilters();
                });
                
                document.getElementById('optFilter')!.addEventListener('change', (e) => {
                    this.settings.filter = e.target.value;
                    this.applyFilters();
                });
                
                document.getElementById('optRenderDist')!.addEventListener('change', (e) => {
                    this.settings.renderDistance = parseInt(e.target.value);
                });
                
                // Toggle switches
                ['optShadows', 'optLighting', 'optAA', 'optShowFps'].forEach(id => {
                    document.getElementById(id).addEventListener('click', (e) => {
                        const toggle = e.target;
                        const isOn = toggle.dataset.on === 'true';
                        toggle.dataset.on = (!isOn).toString();
                        toggle.classList.toggle('on', !isOn);
                        
                        if (id === 'optShadows') this.settings.shadows = !isOn;
                        if (id === 'optLighting') this.settings.lighting = !isOn;
                        if (id === 'optAA') {
                            this.settings.antialiasing = !isOn;
                            this.canvas.style.imageRendering = !isOn ? 'pixelated' : 'auto';
                        }
                        if (id === 'optShowFps') this.settings.showFps = !isOn;
                    });
                });
                
                // Target FPS slider
                document.getElementById('optTargetFps')!.addEventListener('input', (e) => {
                    const fps = parseInt(e.target.value);
                    this.settings.targetFps = fps;
                    document.getElementById('targetFpsValue')!.textContent = fps;
                });
            },
            
            showSubmenu(menuId) {
                document.querySelectorAll('.pause-submenu').forEach(m => m.classList.remove('active'));
                document.getElementById(menuId).classList.add('active');
            },
            
            updateStatsDisplay() {
                document.getElementById('statPlaced')!.textContent = this.stats.blocksPlaced;
                document.getElementById('statBroken')!.textContent = this.stats.blocksBroken;
                document.getElementById('statDistance')!.textContent = Math.floor(this.stats.distance) + 'm';
                document.getElementById('statJumps')!.textContent = this.stats.jumps;
                
                const elapsed = Math.floor((Date.now() - this.stats.startTime) / 1000);
                const mins = Math.floor(elapsed / 60);
                const secs = elapsed % 60;
                document.getElementById('statTime')!.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            },
            
            applyFilters() {
                let filter = `brightness(${this.settings.brightness}%)`;
                
                switch (this.settings.filter) {
                    case 'sepia':
                        filter += ' sepia(80%)';
                        break;
                    case 'grayscale':
                        filter += ' grayscale(100%)';
                        break;
                    case 'trippy':
                        filter += ' hue-rotate(' + (Date.now() % 3600) / 10 + 'deg) saturate(200%)';
                        break;
                }
                
                this.canvas.style.filter = filter;
            },
            
            updateHotbar() {
                const slots = document.querySelectorAll('.hotbar-slot');
                slots.forEach((slot, index) => {
                    const isSelected = index === this.selectedSlot;
                    slot.classList.toggle('selected', isSelected);
                });
            },
            
            // Update hotbar display with item counts and icons
            updateHotbarDisplay() {
                const slots = document.querySelectorAll('.hotbar-slot');
                slots.forEach((slot, index) => {
                    const item = this.inventory.hotbar[index];
                    const isSelected = index === this.selectedSlot;
                    slot.classList.toggle('selected', isSelected);
                    
                    // Set count attribute
                    if (item && item.count) {
                        slot.setAttribute('data-count', item.count);
                    } else {
                        slot.setAttribute('data-count', '');
                    }
                    
                    // Clear and redraw canvas
                    let canvas = slot.querySelector('canvas');
                    if (!canvas) {
                        canvas = document.createElement('canvas');
                        canvas.width = 32;
                        canvas.height = 32;
                        canvas.style.width = '100%';
                        canvas.style.height = '100%';
                        canvas.style.position = 'absolute';
                        canvas.style.top = '2px';
                        canvas.style.left = '2px';
                        slot.appendChild(canvas);
                    }
                    
                    if (item) {
                        this.drawMiniBlock(canvas, item.id);
                        
                        // Update durability bar if exists
                        let durBar = slot.querySelector('.durability-bar');
                        if (item.durability !== undefined && item.maxDurability) {
                            if (!durBar) {
                                durBar = document.createElement('div');
                                durBar.className = 'durability-bar';
                                durBar.innerHTML = '<div class="durability-fill"></div>';
                                slot.appendChild(durBar);
                            }
                            const fill = durBar.querySelector('.durability-fill');
                            const percent = (item.durability / item.maxDurability) * 100;
                            fill.style.width = percent + '%';
                            fill.style.backgroundColor = percent > 50 ? '#4a4' : percent > 25 ? '#aa4' : '#a44';
                            durBar.style.display = 'block';
                        } else if (durBar) {
                            durBar.style.display = 'none';
                        }
                    } else {
                        // Clear canvas for empty slot
                        const ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        // Hide durability bar
                        const durBar = slot.querySelector('.durability-bar');
                        if (durBar) durBar.style.display = 'none';
                    }
                });
            },
            
            // Shoot the AK-47
            shootAK47() {
                if (this.shootCooldown > 0) return;
                
                // Check durability and reduce it
                const slot = this.inventory.hotbar[this.selectedSlot];
                if (slot && slot.id === 'ak47') {
                    if (slot.durability !== undefined && slot.durability <= 0) {
                        // Gun is broken!
                        return;
                    }
                    // Reduce durability
                    if (slot.durability !== undefined) {
                        slot.durability--;
                        if (slot.durability <= 0) {
                            // Gun breaks
                            this.inventory.hotbar[this.selectedSlot] = null;
                            this.selectedItem = null;
                            this.showPickupNotification('ak47', -1); // Show break notification
                        }
                        this.updateHotbarDisplay();
                    }
                }
                
                this.shootCooldown = 8; // Frames between shots
                this.muzzleFlash = 5;   // Frames of muzzle flash
                
                // Get shoot direction
                const pitch = this.camera.rotX;
                const yaw = this.camera.rotY;
                const dirX = -Math.sin(yaw) * Math.cos(pitch);
                const dirY = -Math.sin(pitch);
                const dirZ = Math.cos(yaw) * Math.cos(pitch);
                
                // Create bullet particle
                const bulletSpeed = 2.5;
                const bullet = {
                    x: this.camera.x + dirX * 0.5,
                    y: this.camera.y + dirY * 0.5,
                    z: this.camera.z + dirZ * 0.5,
                    vx: dirX * bulletSpeed,
                    vy: dirY * bulletSpeed,
                    vz: dirZ * bulletSpeed,
                    life: 60,
                    type: 'bullet',
                    trail: []
                };
                this.particles.push(bullet);
                
                // Check for bird hits and apply velocity knockback
                const knockbackForce = 0.8;
                let hitBird = null;
                let hitDist = Infinity;
                
                // Check pest birds - find closest hit
                for (const pest of this.pestBirds) {
                    const dx = pest.x - this.camera.x;
                    const dy = pest.y - this.camera.y;
                    const dz = pest.z - this.camera.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    
                    if (dist < 15 && dist < hitDist) {
                        const birdDirX = dx / dist;
                        const birdDirY = dy / dist;
                        const birdDirZ = dz / dist;
                        const dot = dirX * birdDirX + dirY * birdDirY + dirZ * birdDirZ;
                        
                        if (dot > 0.9) {
                            hitBird = pest;
                            hitDist = dist;
                        }
                    }
                }
                
                // Apply knockback with velocity
                if (hitBird) {
                    // Set velocity for knockback animation
                    hitBird.vx = dirX * knockbackForce + (Math.random() - 0.5) * 0.2;
                    hitBird.vy = dirY * knockbackForce + 0.3 + Math.random() * 0.2; // Add upward force
                    hitBird.vz = dirZ * knockbackForce + (Math.random() - 0.5) * 0.2;
                    hitBird.state = 'knockback';
                    hitBird.stateTimer = 90;
                    
                    // Create ricochet particles
                    for (let i = 0; i < 8; i++) {
                        const ricochetSpeed = 0.15 + Math.random() * 0.2;
                        // Reflect direction with randomness
                        const rx = -dirX * 0.5 + (Math.random() - 0.5) * 1.5;
                        const ry = Math.random() * 0.8 + 0.2;
                        const rz = -dirZ * 0.5 + (Math.random() - 0.5) * 1.5;
                        const len = Math.sqrt(rx * rx + ry * ry + rz * rz);
                        
                        this.particles.push({
                            x: hitBird.x,
                            y: hitBird.y,
                            z: hitBird.z,
                            vx: (rx / len) * ricochetSpeed,
                            vy: (ry / len) * ricochetSpeed,
                            vz: (rz / len) * ricochetSpeed,
                            life: 25 + Math.random() * 20,
                            type: 'ricochet',
                            size: 2 + Math.random() * 3
                        });
                    }
                    
                    // Feather particles
                    for (let i = 0; i < 5; i++) {
                        this.particles.push({
                            x: hitBird.x + (Math.random() - 0.5) * 0.3,
                            y: hitBird.y + (Math.random() - 0.5) * 0.3,
                            z: hitBird.z + (Math.random() - 0.5) * 0.3,
                            vx: (Math.random() - 0.5) * 0.1,
                            vy: 0.05 + Math.random() * 0.05,
                            vz: (Math.random() - 0.5) * 0.1,
                            life: 40 + Math.random() * 30,
                            type: 'feather',
                            rotation: Math.random() * Math.PI * 2,
                            rotSpeed: (Math.random() - 0.5) * 0.3
                        });
                    }
                    
                    // Birds bounce player around when shot!
                    // Small random knockback to player
                    const playerKnockback = 0.08 + Math.random() * 0.05;
                    this.velocity.y += 0.05 + Math.random() * 0.03;  // Small upward bump
                    // Push player away from bird
                    const toBirdX = hitBird.x - this.camera.x;
                    const toBirdZ = hitBird.z - this.camera.z;
                    const toBirdDist = Math.sqrt(toBirdX * toBirdX + toBirdZ * toBirdZ);
                    if (toBirdDist > 0.1) {
                        // Push player in random direction with slight bias away from bird
                        this.camera.x -= (toBirdX / toBirdDist) * playerKnockback * 0.3 + (Math.random() - 0.5) * playerKnockback;
                        this.camera.z -= (toBirdZ / toBirdDist) * playerKnockback * 0.3 + (Math.random() - 0.5) * playerKnockback;
                    }
                    
                    // Special spawn chances!
                    const spawnRoll = Math.random();
                    let birdsToSpawn = 0;
                    
                    if (spawnRoll < 0.01) {
                        // 1/100 chance: SWARM! 20 birds spawn
                        birdsToSpawn = 20;
                    } else if (spawnRoll < 0.1) {
                        // 1/10 chance: 5 birds spawn
                        birdsToSpawn = 5;
                    }
                    
                    // Spawn the extra birds
                    for (let i = 0; i < birdsToSpawn; i++) {
                        const newAngle = Math.random() * Math.PI * 2;
                        const newRadius = 2 + Math.random() * 3;
                        this.pestBirds.push({
                            x: hitBird.x + Math.cos(newAngle) * newRadius,
                            y: hitBird.y + (Math.random() - 0.5) * 2,
                            z: hitBird.z + Math.sin(newAngle) * newRadius,
                            vx: 0, vy: 0, vz: 0,
                            targetOffsetX: 0, targetOffsetY: 0, targetOffsetZ: 0,
                            state: 'circling',
                            stateTimer: 10 + Math.random() * 20,
                            angle: newAngle,
                            circleRadius: newRadius,
                            baseCircleRadius: newRadius,
                            circleSpeed: 0.07 + Math.random() * 0.05,
                            swoopProgress: 0,
                            wingPhase: Math.random() * Math.PI * 2,
                            size: 0.15 + Math.random() * 0.08,
                            chirpTimer: Math.random() * 30,
                            knockbackSpin: 0,
                            anger: 1 + Math.floor(Math.random() * 3), // Spawned angry (1-3)
                            timesShot: 0,
                            spawnThreshold: 4 + Math.floor(Math.random() * 4)
                        });
                    }
                }
                
                // Check regular birds
                for (const bird of this.birds) {
                    const dx = bird.x - this.camera.x;
                    const dy = bird.y - this.camera.y;
                    const dz = bird.z - this.camera.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    
                    if (dist < 25) {
                        const birdDirX = dx / dist;
                        const birdDirY = dy / dist;
                        const birdDirZ = dz / dist;
                        const dot = dirX * birdDirX + dirY * birdDirY + dirZ * birdDirZ;
                        
                        if (dot > 0.85) {
                            // Knock away by modifying orbit
                            bird.radius += 8;
                            bird.baseY += 5;
                            
                            // Create some ricochet sparks
                            for (let i = 0; i < 5; i++) {
                                this.particles.push({
                                    x: bird.x,
                                    y: bird.y,
                                    z: bird.z,
                                    vx: (Math.random() - 0.5) * 0.3,
                                    vy: Math.random() * 0.2,
                                    vz: (Math.random() - 0.5) * 0.3,
                                    life: 20 + Math.random() * 15,
                                    type: 'ricochet',
                                    size: 2 + Math.random() * 2
                                });
                            }
                        }
                    }
                }
            },
            
            // Update particles
            updateParticles() {
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const p = this.particles[i];
                    p.life--;
                    
                    if (p.life <= 0) {
                        this.particles.splice(i, 1);
                        continue;
                    }
                    
                    // Update position
                    p.x += p.vx;
                    p.y += p.vy;
                    p.z += p.vz;
                    
                    if (p.type === 'bullet') {
                        // Store trail positions
                        p.trail.push({ x: p.x, y: p.y, z: p.z });
                        if (p.trail.length > 8) p.trail.shift();
                        
                        // Check for block collision
                        const bx = Math.floor(p.x);
                        const by = Math.floor(p.y);
                        const bz = Math.floor(p.z);
                        if (this.getBlock(bx, by, bz)) {
                            // Hit a block - create impact sparks
                            for (let j = 0; j < 6; j++) {
                                this.particles.push({
                                    x: p.x,
                                    y: p.y,
                                    z: p.z,
                                    vx: (Math.random() - 0.5) * 0.2,
                                    vy: Math.random() * 0.15,
                                    vz: (Math.random() - 0.5) * 0.2,
                                    life: 15 + Math.random() * 10,
                                    type: 'spark',
                                    size: 2 + Math.random() * 2
                                });
                            }
                            this.particles.splice(i, 1);
                        }
                    } else if (p.type === 'ricochet' || p.type === 'spark') {
                        p.vy -= 0.008; // Gravity
                        p.vx *= 0.97;
                        p.vz *= 0.97;
                    } else if (p.type === 'feather') {
                        p.vy -= 0.002; // Light gravity
                        p.vx *= 0.98;
                        p.vz *= 0.98;
                        p.rotation += p.rotSpeed;
                    } else if (p.type === 'burger') {
                        // Burger projectile - flies fast, affected slightly by gravity
                        p.vy -= 0.003;
                        // Check for bird collision
                        for (const pest of this.pestBirds) {
                            const dx = pest.x - p.x;
                            const dy = pest.y - p.y;
                            const dz = pest.z - p.z;
                            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                            if (dist < 1.5) {
                                // Hit! Send bird flying and enrage it
                                const knockForce = 2.5;
                                pest.vx = (p.vx * 0.5) + (dx / dist) * knockForce;
                                pest.vy = Math.abs(p.vy) + 0.5;
                                pest.vz = (p.vz * 0.5) + (dz / dist) * knockForce;
                                pest.state = 'knockback';
                                pest.stateTimer = 120;
                                pest.anger = Math.min(5, pest.anger + 2); // Extra anger from burgers!
                                p.life = 0; // Burger consumed
                                
                                // Burger splat particles
                                for (let j = 0; j < 8; j++) {
                                    this.particles.push({
                                        x: p.x, y: p.y, z: p.z,
                                        vx: (Math.random() - 0.5) * 0.3,
                                        vy: Math.random() * 0.2,
                                        vz: (Math.random() - 0.5) * 0.3,
                                        life: 20,
                                        type: 'burgerSplat',
                                        size: 3 + Math.random() * 3
                                    });
                                }
                            }
                        }
                    } else if (p.type === 'burgerSplat') {
                        p.vy -= 0.01;
                        p.vx *= 0.95;
                        p.vz *= 0.95;
                    } else if (p.type === 'apple') {
                        // Apple projectile - flies with arc, knocks birds away
                        p.vy += (p.gravity || -0.008);
                        // Check for bird collision
                        for (const pest of this.pestBirds) {
                            const dx = pest.x - p.x;
                            const dy = pest.y - p.y;
                            const dz = pest.z - p.z;
                            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                            if (dist < 1.5) {
                                // Hit! Send bird flying but DON'T enrage it
                                const knockForce = 3.0;
                                pest.vx = (p.vx * 0.5) + (dx / dist) * knockForce;
                                pest.vy = 0.8; // Pop up
                                pest.vz = (p.vz * 0.5) + (dz / dist) * knockForce;
                                pest.state = 'knockback';
                                pest.stateTimer = 180; // Longer stun
                                // Apples calm birds slightly
                                pest.anger = Math.max(0, pest.anger - 0.5);
                                p.life = 0;
                                
                                // Score for hitting bird
                                if (this.survivalStats) {
                                    this.survivalStats.score += 50;
                                    this.updateSurvivalHUD();
                                }
                                
                                // Apple splat particles
                                for (let j = 0; j < 6; j++) {
                                    this.particles.push({
                                        x: p.x, y: p.y, z: p.z,
                                        vx: (Math.random() - 0.5) * 0.3,
                                        vy: Math.random() * 0.2,
                                        vz: (Math.random() - 0.5) * 0.3,
                                        life: 15,
                                        type: 'appleSplat',
                                        size: 2 + Math.random() * 2
                                    });
                                }
                            }
                        }
                        // Check for decorative bird collision during swarm
                        for (const bird of this.birds) {
                            if (bird.swarmMode) {
                                const dx = bird.x - p.x;
                                const dy = bird.y - p.y;
                                const dz = bird.z - p.z;
                                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                                if (dist < 2) {
                                    bird.swarmMode = false;
                                    bird.swarmTimer = 0;
                                    p.life = 0;
                                    if (this.survivalStats) {
                                        this.survivalStats.score += 25;
                                        this.updateSurvivalHUD();
                                    }
                                }
                            }
                        }
                        // Hit ground
                        const groundY = this.getGroundHeightBelow(p.x, p.z, p.y + 10);
                        if (p.y <= groundY + 0.5) {
                            p.life = 0;
                        }
                    } else if (p.type === 'appleSplat') {
                        p.vy -= 0.015;
                        p.vx *= 0.9;
                        p.vz *= 0.9;
                    } else if (p.type === 'petal') {
                        // Cherry blossom petals - float and flutter with wind
                        p.vy -= 0.0008; // Very light gravity for graceful fall
                        p.vx += this.wind.x * 0.15;
                        p.vz += this.wind.z * 0.15;
                        p.vx *= 0.985;
                        p.vz *= 0.985;
                        p.rotation += p.rotSpeed + this.wind.x * 0.08;
                        p.flutter += p.flutterSpeed || 0.08;
                        
                        // More complex flutter pattern - both horizontal sway and tumbling
                        p.x += Math.sin(p.flutter) * 0.025;
                        p.y += Math.cos(p.flutter * 1.3) * 0.008; // Slight vertical bob
                        p.z += Math.cos(p.flutter * 0.7) * 0.015;
                        
                        // Hit ground - disappear
                        if (p.y < this.getGroundHeightBelow(p.x, p.z, p.y + 10) + 1) {
                            p.life = 0;
                        }
                    }
                }
            },
            
            // Wind system - creates natural gusts that affect petals and birds
            updateWind() {
                this.wind.gustTimer++;
                
                // Change wind direction occasionally (gusts)
                if (this.wind.gustTimer > 120 + Math.random() * 180) {
                    this.wind.gustTimer = 0;
                    // New target wind direction
                    const gustStrength = 0.01 + Math.random() * 0.04;
                    const gustAngle = Math.random() * Math.PI * 2;
                    this.wind.targetX = Math.cos(gustAngle) * gustStrength;
                    this.wind.targetZ = Math.sin(gustAngle) * gustStrength;
                }
                
                // Smoothly interpolate toward target
                this.wind.x += (this.wind.targetX - this.wind.x) * 0.02;
                this.wind.z += (this.wind.targetZ - this.wind.z) * 0.02;
                
                // Add small random turbulence
                this.wind.x += (Math.random() - 0.5) * 0.002;
                this.wind.z += (Math.random() - 0.5) * 0.002;
            },
            
            // Spawn cherry blossom petals near trees
            updatePetals() {
                if (!this.cherryTrees || this.cherryTrees.length === 0) return;
                
                // Count current petals
                const currentPetals = this.particles.filter(p => p.type === 'petal').length;
                const maxPetals = 150; // Performance cap
                
                // Spawn multiple petals per frame for dense shower effect
                const petalsToSpawn = Math.min(5, maxPetals - currentPetals); // Spawn up to 5 per frame
                
                for (let i = 0; i < petalsToSpawn; i++) {
                    // 60% chance per slot to actually spawn (creates natural variation)
                    if (Math.random() > 0.6) continue;
                    
                    // Pick a random cherry tree
                    const tree = this.cherryTrees[Math.floor(Math.random() * this.cherryTrees.length)];
                    const dist = Math.sqrt((tree.x - this.camera.x) ** 2 + (tree.z - this.camera.z) ** 2);
                    
                    // Spawn petals for trees within range, with falloff
                    const spawnRange = 40;
                    if (dist < spawnRange) {
                        // Higher spawn chance for closer trees
                        const spawnChance = 1 - (dist / spawnRange) * 0.5;
                        if (Math.random() < spawnChance) {
                            // Wider spawn area around tree canopy
                            const spreadX = (Math.random() - 0.5) * 10;
                            const spreadZ = (Math.random() - 0.5) * 10;
                            
                            // Also spawn some petals floating in the air (wind-carried)
                            const heightBonus = Math.random() < 0.3 ? Math.random() * 8 : 0;
                            
                            this.particles.push({
                                x: tree.x + spreadX,
                                y: tree.y + Math.random() * 3 + heightBonus,
                                z: tree.z + spreadZ,
                                vx: this.wind.x * 1.5 + (Math.random() - 0.5) * 0.03,
                                vy: -0.008 - Math.random() * 0.015, // Slower fall for more graceful effect
                                vz: this.wind.z * 1.5 + (Math.random() - 0.5) * 0.03,
                                life: 250 + Math.random() * 200, // Longer life
                                type: 'petal',
                                size: 2.5 + Math.random() * 2.5,
                                rotation: Math.random() * Math.PI * 2,
                                rotSpeed: (Math.random() - 0.5) * 0.15,
                                flutter: Math.random() * Math.PI * 2,
                                flutterSpeed: 0.05 + Math.random() * 0.05
                            });
                        }
                    }
                }
                
                // Also spawn ambient petals in the air around player (wind-blown)
                if (currentPetals < maxPetals * 0.8 && Math.random() < 0.3) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = 10 + Math.random() * 20;
                    this.particles.push({
                        x: this.camera.x + Math.cos(angle) * radius,
                        y: this.camera.y + 5 + Math.random() * 10,
                        z: this.camera.z + Math.sin(angle) * radius,
                        vx: this.wind.x * 2 + (Math.random() - 0.5) * 0.02,
                        vy: -0.005 - Math.random() * 0.01,
                        vz: this.wind.z * 2 + (Math.random() - 0.5) * 0.02,
                        life: 150 + Math.random() * 100,
                        type: 'petal',
                        size: 2 + Math.random() * 2,
                        rotation: Math.random() * Math.PI * 2,
                        rotSpeed: (Math.random() - 0.5) * 0.12,
                        flutter: Math.random() * Math.PI * 2,
                        flutterSpeed: 0.04 + Math.random() * 0.04
                    });
                }
            },
            
            // Drop an item on the ground
            dropItem(x: number, y: number, z: number, type: string, count: number) {
                if (!this.droppedItems) this.droppedItems = [];
                this.droppedItems.push({
                    x: x + (Math.random() - 0.5) * 0.3,
                    y: y,
                    z: z + (Math.random() - 0.5) * 0.3,
                    vy: 0.1 + Math.random() * 0.05,
                    type: type,
                    count: count,
                    bobPhase: Math.random() * Math.PI * 2,
                    pickupDelay: 30 // Frames before can be picked up
                });
            },
            
            // Update dropped items (physics and pickup)
            updateDroppedItems() {
                if (!this.droppedItems) return;
                
                for (let i = this.droppedItems.length - 1; i >= 0; i--) {
                    const item = this.droppedItems[i];
                    
                    // Pickup delay
                    if (item.pickupDelay > 0) item.pickupDelay--;
                    
                    // Physics
                    item.vy -= 0.015; // Gravity
                    item.y += item.vy;
                    
                    // Ground collision
                    const groundY = this.getGroundHeightBelow(item.x, item.z, item.y + 5) + 1.3;
                    if (item.y < groundY) {
                        item.y = groundY;
                        item.vy = 0;
                    }
                    
                    // Bobbing animation
                    item.bobPhase += 0.05;
                    
                    // Check pickup by player
                    if (item.pickupDelay <= 0) {
                        const dx = item.x - this.camera.x;
                        const dy = item.y - this.camera.y;
                        const dz = item.z - this.camera.z;
                        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        
                        if (dist < 2) {
                            // Try to add to inventory
                            if (this.addToInventory(item.type, item.count)) {
                                this.droppedItems.splice(i, 1);
                            }
                        }
                    }
                }
            },
            
            // Add item to inventory (hotbar first, then main inventory)
            addToInventory(type, count) {
                // Determine item category
                let itemType = 'block';  // Default
                if (type === 'ak47' || type === 'berdger') itemType = 'weapon';
                if (type === 'water_bucket' || type === 'lava_bucket') itemType = 'bucket';
                if (this.ritualItems && this.ritualItems.includes(type)) itemType = 'item';
                if (type === 'seeds' || type === 'apple') itemType = 'item';
                
                // Show pickup animation
                this.showPickupNotification(type, count);
                
                // Try to stack with existing items in hotbar first
                for (let i = 0; i < 9; i++) {
                    const slot = this.inventory.hotbar[i];
                    if (slot && (slot.id === type || slot.type === type) && slot.count < 64) {
                        const canAdd = Math.min(count, 64 - slot.count);
                        slot.count += canAdd;
                        count -= canAdd;
                        if (count <= 0) {
                            this.updateHotbarDisplay();
                            return true;
                        }
                    }
                }
                
                // Try to stack with existing items in main inventory
                for (let i = 0; i < 27; i++) {
                    const slot = this.inventory.main[i];
                    if (slot && (slot.id === type || slot.type === type) && slot.count < 64) {
                        const canAdd = Math.min(count, 64 - slot.count);
                        slot.count += canAdd;
                        count -= canAdd;
                        if (count <= 0) {
                            this.updateHotbarDisplay();
                            return true;
                        }
                    }
                }
                
                // Find empty slot in hotbar
                for (let i = 0; i < 9; i++) {
                    if (!this.inventory.hotbar[i]) {
                        const itemDef = this.itemTypes[type] || {};
                        this.inventory.hotbar[i] = { 
                            type: itemType, 
                            id: type, 
                            count,
                            durability: itemDef.durability,
                            maxDurability: itemDef.maxDurability
                        };
                        this.updateHotbarDisplay();
                        return true;
                    }
                }
                
                // Find empty slot in main inventory
                for (let i = 0; i < 27; i++) {
                    if (!this.inventory.main[i]) {
                        const itemDef = this.itemTypes[type] || {};
                        this.inventory.main[i] = { 
                            type: itemType, 
                            id: type, 
                            count,
                            durability: itemDef.durability,
                            maxDurability: itemDef.maxDurability
                        };
                        this.updateHotbarDisplay();
                        return true;
                    }
                }
                
                return false; // All inventory full
            },
            
            // Show pickup notification (uses batch queue for multiple pickups)
            showPickupNotification(type, count) {
                // Handle broken items immediately (don't batch)
                if (count < 0) {
                    const container = document.getElementById('pickupNotification');
                    if (!container) return;
                    
                    const itemNames = {
                        grass: 'Grass Block', dirt: 'Dirt', stone: 'Stone', wood: 'Wood',
                        appleLeaves: 'Apple Leaves', leaves: 'Leaves', sand: 'Sand', brick: 'Brick',
                        ak47: 'AK-47', water_bucket: 'Water Bucket', lava_bucket: 'Lava Bucket',
                        obsidian: 'Obsidian', cherryWood: 'Cherry Wood', cherryLeaves: 'Cherry Leaves',
                        chest: 'Chest', seeds: 'Seeds', berdger: 'The Berdger', apple: 'Apple',
                        sakuraPetal: 'Cherry Petal', shimenawa: 'Sacred Rope', omamori: 'Charm',
                        ema: 'Wish Plaque', incense: 'Incense', whiteBrick: 'White Brick',
                        redBrick: 'Red Brick', glowstone: 'Glowstone', ritualStone: 'Ritual Stone'
                    };
                    
                    const notification = document.createElement('div');
                    notification.className = 'pickup-item';
                    notification.style.borderColor = 'rgba(255, 50, 50, 0.8)';
                    notification.innerHTML = `
                        <span class="pickup-icon">💔</span>
                        <span style="color:#ff6666">${itemNames[type] || type} broke!</span>
                    `;
                    container.appendChild(notification);
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 2000);
                    return;
                }
                
                // Use batch queue for normal pickups
                this.queuePickupNotification(type, count);
            },
            
            // Draw a mini 3D block for inventory display
            drawMiniBlock(canvas: HTMLCanvasElement, type: string) {
                const ctx = canvas.getContext('2d');
                const colors = this.blockColors[type];
                const w = canvas.width;
                const h = canvas.height;
                
                ctx.clearRect(0, 0, w, h);
                
                const cx = w / 2;
                const cy = h / 2;
                const size = Math.min(w, h) * 0.35;
                
                // Special item rendering for non-blocks
                if (!colors) {
                    ctx.save();
                    ctx.translate(cx, cy);
                    
                    if (type === 'apple') {
                        // Red apple
                        ctx.fillStyle = '#dc143c';
                        ctx.beginPath();
                        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = 'rgba(255,255,255,0.3)';
                        ctx.beginPath();
                        ctx.arc(-size * 0.2, -size * 0.2, size * 0.25, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = '#654321';
                        ctx.fillRect(-1, -size * 0.8, 3, size * 0.3);
                        ctx.fillStyle = '#228b22';
                        ctx.beginPath();
                        ctx.ellipse(3, -size * 0.7, 4, 2, 0.3, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (type === 'seeds') {
                        ctx.fillStyle = '#daa520';
                        for (let i = 0; i < 5; i++) {
                            const angle = (i / 5) * Math.PI * 2;
                            const sx = Math.cos(angle) * size * 0.4;
                            const sy = Math.sin(angle) * size * 0.3;
                            ctx.beginPath();
                            ctx.ellipse(sx, sy, 3, 5, angle, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    } else if (type === 'ak47') {
                        ctx.fillStyle = '#333';
                        ctx.fillRect(-size * 0.6, -size * 0.1, size * 1.2, size * 0.25);
                        ctx.fillStyle = '#8b4513';
                        ctx.fillRect(-size * 0.3, size * 0.1, size * 0.4, size * 0.4);
                        ctx.fillStyle = '#222';
                        ctx.fillRect(size * 0.1, size * 0.1, size * 0.15, size * 0.35);
                    } else if (type === 'berdger') {
                        ctx.fillStyle = '#daa520';
                        ctx.beginPath();
                        ctx.ellipse(0, -size * 0.3, size * 0.5, size * 0.25, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = '#8b4513';
                        ctx.fillRect(-size * 0.4, -size * 0.15, size * 0.8, size * 0.2);
                        ctx.fillStyle = '#228b22';
                        ctx.fillRect(-size * 0.35, -size * 0.05, size * 0.7, size * 0.1);
                        ctx.fillStyle = '#daa520';
                        ctx.beginPath();
                        ctx.ellipse(0, size * 0.2, size * 0.55, size * 0.3, 0, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (type === 'water_bucket' || type === 'lava_bucket') {
                        ctx.fillStyle = '#888';
                        ctx.beginPath();
                        ctx.moveTo(-size * 0.4, -size * 0.3);
                        ctx.lineTo(size * 0.4, -size * 0.3);
                        ctx.lineTo(size * 0.3, size * 0.5);
                        ctx.lineTo(-size * 0.3, size * 0.5);
                        ctx.closePath();
                        ctx.fill();
                        ctx.fillStyle = type === 'water_bucket' ? '#4a90d9' : '#ff6600';
                        ctx.beginPath();
                        ctx.moveTo(-size * 0.3, -size * 0.1);
                        ctx.lineTo(size * 0.3, -size * 0.1);
                        ctx.lineTo(size * 0.25, size * 0.4);
                        ctx.lineTo(-size * 0.25, size * 0.4);
                        ctx.closePath();
                        ctx.fill();
                    } else if (type === 'sakuraPetal') {
                        ctx.fillStyle = '#ffb7c5';
                        ctx.beginPath();
                        ctx.ellipse(0, 0, size * 0.6, size * 0.3, 0.3, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (type === 'shimenawa') {
                        ctx.strokeStyle = '#daa520';
                        ctx.lineWidth = 4;
                        ctx.beginPath();
                        ctx.moveTo(-size * 0.5, 0);
                        ctx.quadraticCurveTo(0, -size * 0.4, size * 0.5, 0);
                        ctx.stroke();
                    } else if (type === 'omamori') {
                        ctx.fillStyle = '#cc0000';
                        ctx.fillRect(-size * 0.3, -size * 0.5, size * 0.6, size);
                        ctx.fillStyle = '#ffd700';
                        ctx.fillRect(-size * 0.25, -size * 0.35, size * 0.5, size * 0.15);
                    } else if (type === 'ema') {
                        ctx.fillStyle = '#deb887';
                        ctx.beginPath();
                        ctx.moveTo(0, -size * 0.5);
                        ctx.lineTo(size * 0.4, -size * 0.2);
                        ctx.lineTo(size * 0.4, size * 0.4);
                        ctx.lineTo(-size * 0.4, size * 0.4);
                        ctx.lineTo(-size * 0.4, -size * 0.2);
                        ctx.closePath();
                        ctx.fill();
                    } else if (type === 'incense') {
                        ctx.fillStyle = '#8b4513';
                        ctx.fillRect(-1, -size * 0.6, 3, size * 1.2);
                        ctx.fillStyle = '#ff6600';
                        ctx.beginPath();
                        ctx.arc(0.5, -size * 0.6, 3, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        // Unknown item - draw placeholder
                        ctx.fillStyle = '#888';
                        ctx.fillRect(-size * 0.4, -size * 0.4, size * 0.8, size * 0.8);
                        ctx.fillStyle = '#444';
                        ctx.font = '8px monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText('?', 0, 3);
                    }
                    ctx.restore();
                    return;
                }
                
                // Isometric 3D block drawing for blocks
                const blockSize = Math.min(w, h) * 0.25;
                
                // Handle rgba colors for transparent blocks like water
                let topColor = colors.top;
                let sideColor = colors.side;
                if (typeof topColor === 'string' && topColor.includes('rgba')) {
                    // Make opaque for icon display
                    topColor = topColor.replace(/[\d.]+\)$/, '1)');
                    sideColor = sideColor.replace(/[\d.]+\)$/, '1)');
                }
                
                // Top face (brightest)
                ctx.fillStyle = topColor;
                ctx.beginPath();
                ctx.moveTo(cx, cy - blockSize);
                ctx.lineTo(cx + blockSize, cy - blockSize/2);
                ctx.lineTo(cx, cy);
                ctx.lineTo(cx - blockSize, cy - blockSize/2);
                ctx.closePath();
                ctx.fill();
                
                // Left face (medium)
                ctx.fillStyle = sideColor;
                ctx.beginPath();
                ctx.moveTo(cx - blockSize, cy - blockSize/2);
                ctx.lineTo(cx, cy);
                ctx.lineTo(cx, cy + blockSize);
                ctx.lineTo(cx - blockSize, cy + blockSize/2);
                ctx.closePath();
                ctx.fill();
                
                // Right face (darkest)
                let rightColor;
                try {
                    rightColor = this.darkenColor(sideColor.replace(/rgba?\([^)]+\)/, '#888888'), 0.7);
                } catch(e) {
                    rightColor = this.darkenColor(sideColor, 0.7);
                }
                ctx.fillStyle = rightColor;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + blockSize, cy - blockSize/2);
                ctx.lineTo(cx + blockSize, cy + blockSize/2);
                ctx.lineTo(cx, cy + blockSize);
                ctx.closePath();
                ctx.fill();
                
                // Outline
                ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(cx, cy - size);
                ctx.lineTo(cx + size, cy - size/2);
                ctx.lineTo(cx + size, cy + size/2);
                ctx.lineTo(cx, cy + size);
                ctx.lineTo(cx - size, cy + size/2);
                ctx.lineTo(cx - size, cy - size/2);
                ctx.closePath();
                ctx.stroke();
            },
            
            // Draw 3D item for dropped items in the world
            drawDroppedItem3D(ctx, cx, cy, size, type, bobPhase) {
                const colors = this.blockColors[type];
                const rotation = (bobPhase || 0) * 0.5; // Slowly rotate
                
                ctx.save();
                ctx.translate(cx, cy);
                
                // Non-block items get special rendering
                if (!colors) {
                    // Special item rendering
                    if (type === 'apple') {
                        // Red apple
                        ctx.fillStyle = '#dc143c';
                        ctx.beginPath();
                        ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
                        ctx.fill();
                        // Highlight
                        ctx.fillStyle = 'rgba(255,255,255,0.3)';
                        ctx.beginPath();
                        ctx.arc(-size * 0.2, -size * 0.2, size * 0.3, 0, Math.PI * 2);
                        ctx.fill();
                        // Stem
                        ctx.fillStyle = '#654321';
                        ctx.fillRect(-1, -size * 0.9, 2, size * 0.3);
                        ctx.fillStyle = '#228b22';
                        ctx.beginPath();
                        ctx.ellipse(2, -size * 0.8, 3, 2, 0.3, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (type === 'seeds') {
                        // Wheat seeds
                        ctx.fillStyle = '#daa520';
                        for (let i = 0; i < 5; i++) {
                            const angle = (i / 5) * Math.PI * 2 + rotation;
                            const sx = Math.cos(angle) * size * 0.4;
                            const sy = Math.sin(angle) * size * 0.3;
                            ctx.beginPath();
                            ctx.ellipse(sx, sy, size * 0.2, size * 0.1, angle, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    } else if (type === 'ak47') {
                        // Gun silhouette
                        ctx.fillStyle = '#333';
                        ctx.fillRect(-size * 0.8, -size * 0.15, size * 1.6, size * 0.3);
                        ctx.fillRect(-size * 0.3, -size * 0.15, size * 0.15, size * 0.5);
                        ctx.fillRect(size * 0.3, -size * 0.4, size * 0.5, size * 0.25);
                    } else if (type === 'berdger') {
                        // Mini burger
                        ctx.fillStyle = '#D2691E';
                        ctx.beginPath();
                        ctx.ellipse(0, -size * 0.2, size * 0.7, size * 0.35, 0, Math.PI, 0);
                        ctx.fill();
                        ctx.fillStyle = '#654321';
                        ctx.fillRect(-size * 0.6, -size * 0.1, size * 1.2, size * 0.25);
                        ctx.fillStyle = '#228B22';
                        ctx.fillRect(-size * 0.55, size * 0.1, size * 1.1, size * 0.1);
                        ctx.fillStyle = '#DEB887';
                        ctx.beginPath();
                        ctx.ellipse(0, size * 0.25, size * 0.65, size * 0.3, 0, 0, Math.PI);
                        ctx.fill();
                    } else if (type === 'water_bucket' || type === 'lava_bucket') {
                        // Bucket
                        ctx.fillStyle = '#888';
                        ctx.beginPath();
                        ctx.moveTo(-size * 0.5, -size * 0.5);
                        ctx.lineTo(size * 0.5, -size * 0.5);
                        ctx.lineTo(size * 0.4, size * 0.5);
                        ctx.lineTo(-size * 0.4, size * 0.5);
                        ctx.closePath();
                        ctx.fill();
                        // Contents
                        ctx.fillStyle = type === 'water_bucket' ? '#4a90d9' : '#ff6600';
                        ctx.fillRect(-size * 0.35, -size * 0.3, size * 0.7, size * 0.6);
                        // Handle
                        ctx.strokeStyle = '#666';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(0, -size * 0.6, size * 0.4, Math.PI * 0.2, Math.PI * 0.8);
                        ctx.stroke();
                    } else if (type === 'sakuraPetal') {
                        // Pink petal
                        ctx.fillStyle = '#ffb7c5';
                        ctx.beginPath();
                        ctx.ellipse(0, 0, size * 0.6, size * 0.3, rotation, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (type === 'shimenawa') {
                        // Sacred rope
                        ctx.strokeStyle = '#daa520';
                        ctx.lineWidth = size * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(-size * 0.6, 0);
                        ctx.bezierCurveTo(-size * 0.3, -size * 0.4, size * 0.3, size * 0.4, size * 0.6, 0);
                        ctx.stroke();
                    } else if (type === 'omamori') {
                        // Charm
                        ctx.fillStyle = '#ff4444';
                        ctx.fillRect(-size * 0.3, -size * 0.5, size * 0.6, size * 0.8);
                        ctx.fillStyle = '#gold';
                        ctx.fillRect(-size * 0.2, -size * 0.4, size * 0.4, size * 0.15);
                    } else if (type === 'ema') {
                        // Wooden plaque
                        ctx.fillStyle = '#deb887';
                        ctx.beginPath();
                        ctx.moveTo(0, -size * 0.6);
                        ctx.lineTo(size * 0.5, -size * 0.2);
                        ctx.lineTo(size * 0.5, size * 0.5);
                        ctx.lineTo(-size * 0.5, size * 0.5);
                        ctx.lineTo(-size * 0.5, -size * 0.2);
                        ctx.closePath();
                        ctx.fill();
                    } else if (type === 'incense') {
                        // Incense stick
                        ctx.fillStyle = '#8b4513';
                        ctx.fillRect(-1, -size * 0.6, 2, size * 1.2);
                        ctx.fillStyle = '#ff6600';
                        ctx.beginPath();
                        ctx.arc(0, -size * 0.6, 3, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        // Default cube for unknown items
                        ctx.fillStyle = '#888';
                        ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
                    }
                    ctx.restore();
                    return;
                }
                
                // Block items - draw isometric cube
                const s = size * 0.8;
                
                // Top face
                ctx.fillStyle = colors.top;
                ctx.beginPath();
                ctx.moveTo(0, -s);
                ctx.lineTo(s, -s/2);
                ctx.lineTo(0, 0);
                ctx.lineTo(-s, -s/2);
                ctx.closePath();
                ctx.fill();
                
                // Left face
                ctx.fillStyle = colors.side;
                ctx.beginPath();
                ctx.moveTo(-s, -s/2);
                ctx.lineTo(0, 0);
                ctx.lineTo(0, s);
                ctx.lineTo(-s, s/2);
                ctx.closePath();
                ctx.fill();
                
                // Right face
                ctx.fillStyle = this.darkenColor(colors.side, 0.7);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(s, -s/2);
                ctx.lineTo(s, s/2);
                ctx.lineTo(0, s);
                ctx.closePath();
                ctx.fill();
                
                // Outline
                ctx.strokeStyle = 'rgba(0,0,0,0.4)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, -s);
                ctx.lineTo(s, -s/2);
                ctx.lineTo(s, s/2);
                ctx.lineTo(0, s);
                ctx.lineTo(-s, s/2);
                ctx.lineTo(-s, -s/2);
                ctx.closePath();
                ctx.stroke();
                
                ctx.restore();
            },
            
            // Use seeds to calm birds
            useSeeds() {
                const slot = this.inventory.hotbar[this.selectedSlot];
                if (slot && slot.id === 'seeds' && slot.count > 0) {
                    slot.count--;
                    if (slot.count <= 0) {
                        this.inventory.hotbar[this.selectedSlot] = null;
                        this.selectedItem = null;
                    }
                    this.updateHotbarDisplay();
                    
                    // Calm birds for 10 seconds (600 frames)
                    this.seedCalmTimer = 600;
                    
                    // Visual effect - toss seeds
                    for (let i = 0; i < 10; i++) {
                        this.particles.push({
                            x: this.camera.x + (Math.random() - 0.5) * 2,
                            y: this.camera.y - 0.5,
                            z: this.camera.z + (Math.random() - 0.5) * 2,
                            vx: (Math.random() - 0.5) * 0.2,
                            vy: 0.1 + Math.random() * 0.1,
                            vz: (Math.random() - 0.5) * 0.2,
                            life: 60,
                            type: 'spark',
                            size: 2
                        });
                    }
                    return true;
                }
                return false;
            },
            
            // Shoot the berdger (burger launcher)
            shootBerdger() {
                const slot = this.inventory.hotbar[this.selectedSlot];
                if (slot && slot.id === 'berdger') {
                    // Berdger has infinite ammo - it's invincible!
                    // Use the same direction calculation as raycast
                    const pitch = this.camera.rotX;
                    const yaw = this.camera.rotY;
                    const cosPitch = Math.cos(pitch);
                    const sinPitch = Math.sin(pitch);
                    
                    const dirX = -Math.sin(yaw) * cosPitch;
                    const dirY = -sinPitch;  // Fixed: now matches raycast
                    const dirZ = Math.cos(yaw) * cosPitch;
                    
                    // Rapid fire burgers!
                    this.particles.push({
                        x: this.camera.x + dirX * 0.5,
                        y: this.camera.y + dirY * 0.5,
                        z: this.camera.z + dirZ * 0.5,
                        vx: dirX * 0.8,
                        vy: dirY * 0.8,
                        vz: dirZ * 0.8,
                        life: 120,
                        type: 'burger',
                        size: 8,
                        trail: []
                    });
                    return true;
                }
                return false;
            },
            
            // Throw an apple at birds
            throwApple() {
                const slot = this.inventory.hotbar[this.selectedSlot];
                if (slot && slot.id === 'apple' && slot.count > 0) {
                    slot.count--;
                    if (slot.count <= 0) {
                        this.inventory.hotbar[this.selectedSlot] = null;
                        this.selectedItem = null;
                    }
                    this.updateHotbarDisplay();
                    
                    // Use the same direction as raycast
                    const pitch = this.camera.rotX;
                    const yaw = this.camera.rotY;
                    const cosPitch = Math.cos(pitch);
                    const sinPitch = Math.sin(pitch);
                    
                    const dirX = -Math.sin(yaw) * cosPitch;
                    const dirY = -sinPitch;
                    const dirZ = Math.cos(yaw) * cosPitch;
                    
                    // Throw apple
                    this.particles.push({
                        x: this.camera.x + dirX * 0.5,
                        y: this.camera.y + dirY * 0.5,
                        z: this.camera.z + dirZ * 0.5,
                        vx: dirX * 0.6,
                        vy: dirY * 0.6 + 0.1, // Slight arc
                        vz: dirZ * 0.6,
                        life: 180,
                        type: 'apple',
                        size: 6,
                        gravity: -0.008
                    });
                    return true;
                }
                return false;
            },
            
            // Check and complete ritual
            checkRitual() {
                if (this.ritualComplete) return;
                
                // Check if player has all ritual items
                const hasItems = {};
                for (const item of this.ritualItems) {
                    hasItems[item] = false;
                }
                
                for (let i = 0; i < 9; i++) {
                    const slot = this.inventory.hotbar[i];
                    if (slot && this.ritualItems.includes(slot.id)) {
                        hasItems[slot.id] = true;
                    }
                }
                
                const allPresent = this.ritualItems.every(item => hasItems[item]);
                
                if (allPresent) {
                    // Complete the Omamori ritual!
                    this.ritualComplete = true;
                    this.ritualBlessingActive = true;
                    this.ritualBlessingTimer = 36000; // 10 minutes at 60fps
                    
                    // Consume ritual items
                    for (let i = 0; i < 9; i++) {
                        const slot = this.inventory.hotbar[i];
                        if (slot && this.ritualItems.includes(slot.id)) {
                            this.inventory.hotbar[i] = null;
                        }
                    }
                    this.updateHotbarDisplay();
                    
                    // Reward: All birds become permanently calmed and friendly
                    for (const pest of this.pestBirds) {
                        pest.anger = 0;
                        pest.state = 'circling';
                    }
                    
                    // Grand visual effect
                    for (let i = 0; i < 50; i++) {
                        this.particles.push({
                            x: this.camera.x + (Math.random() - 0.5) * 8,
                            y: this.camera.y + Math.random() * 5,
                            z: this.camera.z + (Math.random() - 0.5) * 8,
                            vx: (Math.random() - 0.5) * 0.1,
                            vy: 0.05 + Math.random() * 0.1,
                            vz: (Math.random() - 0.5) * 0.1,
                            life: 120 + Math.random() * 60,
                            type: 'petal',
                            size: 4 + Math.random() * 3,
                            rotation: Math.random() * Math.PI * 2,
                            rotSpeed: (Math.random() - 0.5) * 0.2,
                            flutter: Math.random() * Math.PI * 2
                        });
                    }
                    
                    return true;
                }
                return false;
            },
            
            // Interact with ritual socket blocks
            interactWithSocket(x, y, z, socketType) {
                // Map socket types to required items
                const socketItemMap = {
                    'petalSocket': 'sakuraPetal',
                    'ropeSocket': 'shimenawa',
                    'charmSocket': 'omamori',
                    'plaqueSocket': 'ema',
                    'incenseSocket': 'incense'
                };
                
                // Map socket types to filled versions
                const filledSocketMap = {
                    'petalSocket': 'petalSocketFilled',
                    'ropeSocket': 'ropeSocketFilled',
                    'charmSocket': 'charmSocketFilled',
                    'plaqueSocket': 'plaqueSocketFilled',
                    'incenseSocket': 'incenseSocketFilled'
                };
                
                const requiredItem = socketItemMap[socketType];
                if (!requiredItem) return;
                
                // Check if already filled
                if (socketType.includes('Filled')) return;
                
                // Check if player has the required item
                const slot = this.inventory.hotbar[this.selectedSlot];
                if (slot && slot.id === requiredItem && slot.count > 0) {
                    // Place item on socket
                    slot.count--;
                    if (slot.count <= 0) {
                        this.inventory.hotbar[this.selectedSlot] = null;
                    }
                    this.updateHotbarDisplay();
                    
                    // Change block to filled version
                    this.setBlock(x, y, z, filledSocketMap[socketType]);
                    
                    // Track socket completion
                    if (!this.socketsFilled) this.socketsFilled = {};
                    this.socketsFilled[socketType] = true;
                    
                    // Visual effect
                    for (let i = 0; i < 20; i++) {
                        this.particles.push({
                            x: x + 0.5 + (Math.random() - 0.5) * 0.5,
                            y: y + 1 + Math.random() * 0.5,
                            z: z + 0.5 + (Math.random() - 0.5) * 0.5,
                            vx: (Math.random() - 0.5) * 0.1,
                            vy: 0.1 + Math.random() * 0.1,
                            vz: (Math.random() - 0.5) * 0.1,
                            life: 60 + Math.random() * 40,
                            type: 'spark',
                            size: 3 + Math.random() * 2
                        });
                    }
                    
                    // Check if all sockets are filled
                    const allSocketsFilled = Object.keys(socketItemMap).every(
                        socket => this.socketsFilled && this.socketsFilled[socket]
                    );
                    
                    if (allSocketsFilled && !this.ritualComplete) {
                        // COMPLETE THE TEMPLE RITUAL!
                        this.ritualComplete = true;
                        this.ritualBlessingActive = true;
                        this.ritualBlessingTimer = 60 * 60 * 10; // 10 minutes at 60fps
                        
                        // Trigger the creative reward
                        this.triggerRitualReward();
                        
                        // Calm all birds
                        if (this.pestBirds) {
                            for (const pest of this.pestBirds) {
                                pest.anger = 0;
                                pest.state = 'fleeing';
                                pest.stateTimer = 600;
                            }
                        }
                        
                        // Score bonus
                        if (this.survivalStats) {
                            this.survivalStats.score += 5000;
                            this.survivalStats.currentObjective = { text: 'Blessing active - birds flee!', type: 'complete' };
                            this.updateSurvivalHUD();
                        }
                        
                        // Grand visual effect
                        for (let i = 0; i < 100; i++) {
                            this.particles.push({
                                x: x + 0.5 + (Math.random() - 0.5) * 10,
                                y: y + Math.random() * 8,
                                z: z + 0.5 + (Math.random() - 0.5) * 10,
                                vx: (Math.random() - 0.5) * 0.15,
                                vy: 0.1 + Math.random() * 0.15,
                                vz: (Math.random() - 0.5) * 0.15,
                                life: 180 + Math.random() * 120,
                                type: 'petal',
                                size: 4 + Math.random() * 4,
                                rotation: Math.random() * Math.PI * 2,
                                rotSpeed: (Math.random() - 0.5) * 0.2,
                                flutter: Math.random() * Math.PI * 2
                            });
                        }
                    }
                }
            },
            
            // Open chest UI - simply take all items
            openChest(x: number, y: number, z: number) {
                if (!this.chestContents) this.chestContents = {};
                
                const chestKey = `${x},${y},${z}`;
                const contents = this.chestContents[chestKey];
                
                if (contents && Array.isArray(contents) && contents.length > 0) {
                    // Take all items from chest
                    for (const item of contents) {
                        if (!item) continue;
                        const itemType = item.type || item.id;
                        const itemCount = item.count || 1;
                        
                        if (itemType) {
                            if (!this.addToInventory(itemType, itemCount)) {
                                // Inventory full - drop item
                                this.dropItem(x + 0.5, y + 1.5, z + 0.5, itemType, itemCount);
                            }
                        }
                    }
                    // Empty the chest
                    this.chestContents[chestKey] = [];
                    this.updateHotbarDisplay();
                }
            },
            
            // Drop currently held item
            dropHeldItem() {
                const slot = this.inventory.hotbar[this.selectedSlot];
                if (slot && slot.count > 0) {
                    // Drop one item in front of player
                    const dirX = -Math.sin(this.camera.rotY);
                    const dirZ = Math.cos(this.camera.rotY);
                    const itemId = slot.id || slot.type;
                    this.dropItem(
                        this.camera.x + dirX * 1.5,
                        this.camera.y,
                        this.camera.z + dirZ * 1.5,
                        itemId,
                        1
                    );
                    
                    slot.count--;
                    if (slot.count <= 0) {
                        this.inventory.hotbar[this.selectedSlot] = null;
                        this.selectedItem = null;
                    }
                    this.updateHotbarDisplay();
                }
            },
            
            // Debug console system
            debugConsoleOpen: false,
            debugNoclip: false,
            debugGodMode: false,
            debugShowCoords: false,
            debugFly: false,
            debugMoveSpeed: null,
            
            toggleDebugConsole() {
                this.debugConsoleOpen = !this.debugConsoleOpen;
                const consoleEl = document.getElementById('debugConsole');
                if (consoleEl) {
                    consoleEl.classList.toggle('active', this.debugConsoleOpen);
                    if (this.debugConsoleOpen) {
                        const input = document.getElementById('debugInput');
                        if (input) {
                            setTimeout(() => input.focus(), 50);
                        }
                        this.debugLog('Debug console opened. Type "help" for commands.', 'info');
                    }
                }
            },
            
            setupDebugConsole() {
                const input = document.getElementById('debugInput');
                if (input) {
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            const cmd = input.value.trim();
                            if (cmd) {
                                this.executeDebugCommand(cmd);
                                input.value = '';
                            }
                        }
                        if (e.key === '`' || e.key === '~') {
                            e.preventDefault();
                            this.toggleDebugConsole();
                        }
                        e.stopPropagation();
                    });
                    input.addEventListener('keyup', (e) => e.stopPropagation());
                }
            },
            
            debugLog(msg, type = 'normal') {
                const output = document.getElementById('debugOutput');
                if (output) {
                    const div = document.createElement('div');
                    div.className = type;
                    div.textContent = `> ${msg}`;
                    output.appendChild(div);
                    output.scrollTop = output.scrollHeight;
                    
                    // Limit log size
                    while (output.children.length > 100) {
                        output.removeChild(output.firstChild);
                    }
                }
            },
            
            executeDebugCommand(cmd) {
                const parts = cmd.toLowerCase().split(' ');
                const command = parts[0];
                const args = parts.slice(1);
                
                this.debugLog(cmd, 'normal');
                
                switch (command) {
                    case 'help':
                        this.debugLog('Commands:', 'info');
                        this.debugLog('  noclip - Toggle flying through walls', 'info');
                        this.debugLog('  god - Toggle invincibility', 'info');
                        this.debugLog('  coords - Toggle coordinate display', 'info');
                        this.debugLog('  tp <x> <y> <z> - Teleport to position', 'info');
                        this.debugLog('  give <item> [count] - Give item', 'info');
                        this.debugLog('  spawn <mob> [count] - Spawn mobs', 'info');
                        this.debugLog('    mobs: bird, fish, cat, creeper, bluebird', 'info');
                        this.debugLog('  time <ms> - Set bird event timer', 'info');
                        this.debugLog('  kill - Kill all mobs', 'info');
                        this.debugLog('  clear - Clear console', 'info');
                        this.debugLog('  pos - Show current position', 'info');
                        this.debugLog('  fly - Toggle flight mode', 'info');
                        this.debugLog('  speed <value> - Set move speed', 'info');
                        this.debugLog('  ritual - Complete ritual instantly', 'info');
                        this.debugLog('  score <value> - Set score', 'info');
                        this.debugLog('  temple - Teleport to ritual temple', 'info');
                        break;
                        
                    case 'noclip':
                        this.debugNoclip = !this.debugNoclip;
                        this.debugLog(`Noclip: ${this.debugNoclip ? 'ON' : 'OFF'}`, this.debugNoclip ? 'success' : 'warn');
                        break;
                        
                    case 'god':
                        this.debugGodMode = !this.debugGodMode;
                        this.debugLog(`God mode: ${this.debugGodMode ? 'ON' : 'OFF'}`, this.debugGodMode ? 'success' : 'warn');
                        break;
                        
                    case 'coords':
                        this.debugShowCoords = !this.debugShowCoords;
                        this.debugLog(`Coords display: ${this.debugShowCoords ? 'ON' : 'OFF'}`, 'success');
                        break;
                        
                    case 'fly':
                        this.debugFly = !this.debugFly;
                        this.debugLog(`Fly mode: ${this.debugFly ? 'ON' : 'OFF'}`, this.debugFly ? 'success' : 'warn');
                        break;
                        
                    case 'tp':
                        if (args.length >= 3) {
                            const x = parseFloat(args[0]);
                            const y = parseFloat(args[1]);
                            const z = parseFloat(args[2]);
                            if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                                this.camera.x = x;
                                this.camera.y = y;
                                this.camera.z = z;
                                this.velocity = { x: 0, y: 0, z: 0 };
                                this.debugLog(`Teleported to ${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}`, 'success');
                            } else {
                                this.debugLog('Invalid coordinates', 'error');
                            }
                        } else {
                            this.debugLog('Usage: tp <x> <y> <z>', 'error');
                        }
                        break;
                        
                    case 'temple':
                        if (this.ritualTempleLocation) {
                            this.camera.x = this.ritualTempleLocation.x + 5;
                            this.camera.y = this.ritualTempleLocation.y + 3;
                            this.camera.z = this.ritualTempleLocation.z + 5;
                            this.velocity = { x: 0, y: 0, z: 0 };
                            this.debugLog('Teleported to Ritual Temple', 'success');
                        } else {
                            this.debugLog('Temple not found', 'error');
                        }
                        break;
                        
                    case 'pos':
                        this.debugLog(`Position: ${this.camera.x.toFixed(2)}, ${this.camera.y.toFixed(2)}, ${this.camera.z.toFixed(2)}`, 'info');
                        this.debugLog(`Rotation: ${(this.camera.rotX * 180 / Math.PI).toFixed(1)}°, ${(this.camera.rotY * 180 / Math.PI).toFixed(1)}°`, 'info');
                        break;
                        
                    case 'give':
                        if (args.length >= 1) {
                            const itemId = args[0];
                            const count = args.length >= 2 ? parseInt(args[1]) : 1;
                            if (this.blockColors[itemId] || this.itemTypes[itemId]) {
                                this.addToInventory(itemId, count);
                                this.debugLog(`Given ${count}x ${itemId}`, 'success');
                            } else {
                                this.debugLog(`Unknown item: ${itemId}`, 'error');
                                this.debugLog('Items: ' + Object.keys(this.itemTypes).slice(0, 10).join(', ') + '...', 'info');
                            }
                        } else {
                            this.debugLog('Usage: give <item> [count]', 'error');
                        }
                        break;
                        
                    case 'spawn':
                        const mobType = args[0];
                        const spawnCount = args.length >= 2 ? parseInt(args[1]) : 1;
                        const validMobs = ['bird', 'pest', 'fish', 'cat', 'creeper', 'bluebird'];
                        
                        if (mobType === 'bird' || mobType === 'pest') {
                            for (let i = 0; i < spawnCount; i++) this.spawnPestBird();
                            this.debugLog(`Spawned ${spawnCount} pest bird(s)`, 'success');
                        } else if (mobType === 'fish') {
                            for (let i = 0; i < spawnCount; i++) this.spawnFish();
                            this.debugLog(`Spawned ${spawnCount} fish`, 'success');
                        } else if (mobType === 'cat') {
                            for (let i = 0; i < spawnCount; i++) this.spawnCat();
                            this.debugLog(`Spawned ${spawnCount} cat(s)`, 'success');
                        } else if (mobType === 'creeper') {
                            for (let i = 0; i < spawnCount; i++) this.spawnCreeper();
                            this.debugLog(`Spawned ${spawnCount} creeper(s)`, 'success');
                        } else if (mobType === 'bluebird') {
                            for (let i = 0; i < spawnCount; i++) this.spawnBlueBird();
                            this.debugLog(`Spawned ${spawnCount} blue bird(s)`, 'success');
                        } else {
                            this.debugLog('Usage: spawn <mob> [count]', 'error');
                            this.debugLog('Mobs: ' + validMobs.join(', '), 'info');
                        }
                        break;
                        
                    case 'kill':
                        let totalKilled = 0;
                        totalKilled += this.pestBirds ? this.pestBirds.length : 0;
                        totalKilled += this.blueBirds ? this.blueBirds.length : 0;
                        totalKilled += this.creepers ? this.creepers.length : 0;
                        this.pestBirds = [];
                        this.blueBirds = [];
                        this.creepers = [];
                        this.debugLog(`Killed ${totalKilled} mobs`, 'success');
                        break;
                        
                    case 'time':
                        if (args.length >= 1) {
                            const time = parseInt(args[0]);
                            if (!isNaN(time) && this.birdEvent) {
                                this.birdEvent.timer = time;
                                this.debugLog(`Bird event timer set to ${time}ms`, 'success');
                            }
                        } else {
                            this.debugLog('Usage: time <ms>', 'error');
                        }
                        break;
                        
                    case 'clear':
                        const outputEl = document.getElementById('debugOutput');
                        if (outputEl) outputEl.innerHTML = '';
                        break;
                        
                    case 'speed':
                        if (args.length >= 1) {
                            this.debugMoveSpeed = parseFloat(args[0]);
                            this.debugLog(`Speed set to ${this.debugMoveSpeed}`, 'success');
                        } else {
                            this.debugLog('Usage: speed <value> (default: 0.12)', 'error');
                        }
                        break;
                        
                    case 'ritual':
                        this.ritualComplete = true;
                        this.ritualBlessingActive = true;
                        this.ritualBlessingTimer = 60 * 60 * 10;
                        this.socketsFilled = {
                            'petalSocket': true, 'ropeSocket': true, 'charmSocket': true,
                            'plaqueSocket': true, 'incenseSocket': true
                        };
                        this.triggerRitualReward();
                        this.debugLog('Ritual completed!', 'success');
                        break;
                        
                    case 'score':
                        if (args.length >= 1 && this.survivalStats) {
                            this.survivalStats.score = parseInt(args[0]);
                            this.updateSurvivalHUD();
                            this.debugLog(`Score set to ${this.survivalStats.score}`, 'success');
                        }
                        break;
                        
                    default:
                        this.debugLog(`Unknown command: ${command}`, 'error');
                }
            },
            
            // Ritual reward - creative bonus for completing the temple ritual
            triggerRitualReward() {
                // Show blessing effect
                if (this.birdEvent) {
                    this.showBirdAlert('🌸 DIVINE BLESSING ACTIVATED! 🌸');
                }
                
                // 1. Grant player ritual flight ability (separate from debug fly)
                this.ritualFlight = true;
                this.ritualFlightTimer = 60 * 60 * 2; // 2 minutes of flight
                
                // 2. Create protective barrier that repels birds
                this.ritualBarrierActive = true;
                
                // 3. Give player special items
                this.addToInventory('berdger', 1);
                this.addToInventory('apple', 32);
                
                // 4. Massive score bonus
                if (this.survivalStats) {
                    this.survivalStats.score += 10000;
                    this.survivalStats.wave++;
                    this.survivalStats.currentObjective = { text: '✨ Divine protection active!', type: 'blessed' };
                    this.updateSurvivalHUD();
                }
                
                // 5. All pest birds flee
                for (const pest of this.pestBirds) {
                    pest.state = 'fleeing';
                    pest.stateTimer = 1200; // 20 seconds flee
                    pest.anger = 0;
                }
                
                // 6. Spawn golden particles around player
                for (let i = 0; i < 100; i++) {
                    this.particles.push({
                        x: this.camera.x + (Math.random() - 0.5) * 10,
                        y: this.camera.y + Math.random() * 8 - 2,
                        z: this.camera.z + (Math.random() - 0.5) * 10,
                        vx: (Math.random() - 0.5) * 0.15,
                        vy: 0.1 + Math.random() * 0.2,
                        vz: (Math.random() - 0.5) * 0.15,
                        life: 200 + Math.random() * 100,
                        type: 'blessing',
                        size: 4 + Math.random() * 4
                    });
                }
            },
            
            // Batch pickup notification system
            pickupQueue: {},
            pickupTimer: null,
            
            queuePickupNotification(type, count) {
                if (!this.pickupQueue[type]) {
                    this.pickupQueue[type] = 0;
                }
                this.pickupQueue[type] += count;
                
                // Clear existing timer and set new one
                if (this.pickupTimer) {
                    clearTimeout(this.pickupTimer);
                }
                
                // Wait 500ms for more pickups before showing notification
                this.pickupTimer = setTimeout(() => {
                    this.flushPickupNotifications();
                }, 500);
            },
            
            flushPickupNotifications() {
                const container = document.getElementById('pickupNotification');
                if (!container) return;
                
                const itemNames = {
                    grass: 'Grass Block', dirt: 'Dirt', stone: 'Stone', wood: 'Wood',
                    appleLeaves: 'Apple Leaves', leaves: 'Leaves', sand: 'Sand', brick: 'Brick',
                    ak47: 'AK-47', water_bucket: 'Water Bucket', lava_bucket: 'Lava Bucket',
                    obsidian: 'Obsidian', cherryWood: 'Cherry Wood', cherryLeaves: 'Cherry Leaves',
                    chest: 'Chest', seeds: 'Seeds', berdger: 'The Berdger', apple: 'Apple',
                    sakuraPetal: 'Cherry Petal', shimenawa: 'Sacred Rope', omamori: 'Charm',
                    ema: 'Wish Plaque', incense: 'Incense', whiteBrick: 'White Brick',
                    redBrick: 'Red Brick', glowstone: 'Glowstone', ritualStone: 'Ritual Stone'
                };
                
                for (const [type, count] of Object.entries(this.pickupQueue)) {
                    if (count === 0) continue;
                    
                    const notification = document.createElement('div');
                    notification.className = 'pickup-item';
                    
                    // Create mini block canvas
                    const miniCanvas = document.createElement('canvas');
                    miniCanvas.width = 24;
                    miniCanvas.height = 24;
                    this.drawMiniBlock(miniCanvas, type);
                    
                    notification.innerHTML = `
                        <span class="pickup-icon"></span>
                        <span>+${count} ${itemNames[type] || type}</span>
                    `;
                    notification.querySelector('.pickup-icon')!.appendChild(miniCanvas);
                    
                    container.appendChild(notification);
                    
                    // Remove after animation
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 2000);
                }
                
                // Clear queue
                this.pickupQueue = {};
                this.pickupTimer = null;
            },
            
            // Fluid dynamics simulation - not yet implemented
            // Fluid dynamics simulation - spreads water/lava realistically
            // Set fluid level at position
            setFluidLevel(x, y, z, level) {
                const key = `${x},${y},${z}`;
                if (level <= 0) {
                    delete this.fluidLevels[key];
                } else {
                    this.fluidLevels[key] = Math.min(8, Math.max(1, level));
                }
            },
            
            getFluidLevel(x: number, y: number, z: number) {
                return this.fluidLevels[`${x},${y},${z}`] || 0;
            },
            
            updateFluids() {
                // Process fluid updates slowly for visible spreading effect
                if (!this.fluidUpdateTimer) this.fluidUpdateTimer = 0;
                this.fluidUpdateTimer++;
                if (this.fluidUpdateTimer < 8) return;  // Update every 8 frames (~7.5 updates/sec)
                this.fluidUpdateTimer = 0;
                
                // Process 1-2 fluid blocks per update cycle for gradual spread
                const maxUpdates = 2;
                let processed = 0;
                
                while (this.fluidUpdates.length > 0 && processed < maxUpdates) {
                    const fluid = this.fluidUpdates.shift();
                    processed++;
                    
                    // Skip if block is no longer fluid (was replaced by player)
                    const currentBlock = this.getBlock(fluid.x, fluid.y, fluid.z);
                    if (!currentBlock || !this.fluidBlocks.includes(currentBlock)) {
                        // Clean up fluid level if block was removed
                        this.setFluidLevel(fluid.x, fluid.y, fluid.z, 0);
                        continue;
                    }
                    
                    const currentLevel = fluid.level || 8;
                    
                    // Priority 1: Flow DOWN (gravity)
                    const belowBlock = this.getBlock(fluid.x, fluid.y - 1, fluid.z);
                    
                    // Check for water/lava interactions when flowing down
                    if (belowBlock === 'water' && fluid.type === 'lava') {
                        // Lava falling onto water = STONE
                        this.setBlock(fluid.x, fluid.y - 1, fluid.z, 'stone');
                        this.setFluidLevel(fluid.x, fluid.y - 1, fluid.z, 0);
                        continue;
                    } else if (belowBlock === 'lava' && fluid.type === 'water') {
                        // Water falling onto lava = OBSIDIAN
                        this.setBlock(fluid.x, fluid.y - 1, fluid.z, 'obsidian');
                        this.setFluidLevel(fluid.x, fluid.y - 1, fluid.z, 0);
                        continue;
                    }
                    
                    if (!belowBlock) {
                        // Empty space below - flow down with full level (falling fluid is full)
                        this.setBlock(fluid.x, fluid.y - 1, fluid.z, fluid.type);
                        this.setFluidLevel(fluid.x, fluid.y - 1, fluid.z, 8);
                        this.fluidUpdates.push({
                            x: fluid.x,
                            y: fluid.y - 1,
                            z: fluid.z,
                            type: fluid.type,
                            level: 8  // Falling fluid has full level
                        });
                        continue;  // Prioritize downward flow
                    }
                    
                    // Priority 2: Spread HORIZONTALLY (only if can't flow down)
                    // Horizontal spread decreases level by 1
                    const spreadLevel = currentLevel - 1;
                    if (spreadLevel <= 0) continue;  // Can't spread further
                    
                    if (belowBlock && !this.fluidBlocks.includes(belowBlock)) {
                        // Solid block below - spread horizontally
                        const directions = [
                            { x: 1, z: 0 },
                            { x: -1, z: 0 },
                            { x: 0, z: 1 },
                            { x: 0, z: -1 }
                        ];
                        
                        // Randomize spread direction for natural look
                        for (let i = directions.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [directions[i], directions[j]] = [directions[j], directions[i]];
                        }
                        
                        for (const dir of directions) {
                            const nx = fluid.x + dir.x;
                            const nz = fluid.z + dir.z;
                            const neighborBlock = this.getBlock(nx, fluid.y, nz);
                            const neighborLevel = this.getFluidLevel(nx, fluid.y, nz);
                            
                            // Water + Lava horizontal interaction
                            if (fluid.type === 'lava' && neighborBlock === 'water') {
                                // Lava touching water horizontally = stone (at neighbor)
                                this.setBlock(nx, fluid.y, nz, 'stone');
                                this.setFluidLevel(nx, fluid.y, nz, 0);
                                continue;
                            } else if (fluid.type === 'water' && neighborBlock === 'lava') {
                                // Water touching lava horizontally = stone (at neighbor) 
                                this.setBlock(nx, fluid.y, nz, 'stone');
                                this.setFluidLevel(nx, fluid.y, nz, 0);
                                continue;
                            }
                            
                            // Spread to empty spaces or lower-level same fluid
                            if (!neighborBlock) {
                                this.setBlock(nx, fluid.y, nz, fluid.type);
                                this.setFluidLevel(nx, fluid.y, nz, spreadLevel);
                                this.fluidUpdates.push({
                                    x: nx,
                                    y: fluid.y,
                                    z: nz,
                                    type: fluid.type,
                                    level: spreadLevel
                                });
                            } else if (neighborBlock === fluid.type && neighborLevel < spreadLevel) {
                                // Flow into lower-level same fluid
                                this.setFluidLevel(nx, fluid.y, nz, spreadLevel);
                                this.fluidUpdates.push({
                                    x: nx,
                                    y: fluid.y,
                                    z: nz,
                                    type: fluid.type,
                                    level: spreadLevel
                                });
                            }
                        }
                    }
                }
            },
            
            // Toggle inventory screen
            toggleInventory() {
                this.inventoryOpen = !this.inventoryOpen;
                const invScreen = document.getElementById('inventoryScreen');
                if (invScreen) {
                    invScreen.classList.toggle('active', this.inventoryOpen);
                }
                
                if (this.inventoryOpen) {
                    this.inventoryHeldItem = null; // Clear held item when opening
                    this.renderInventory();
                    // Release pointer lock but DON'T pause - game continues in background
                    if (document.pointerLockElement) {
                        document.exitPointerLock();
                    }
                } else {
                    this.inventoryHeldItem = null; // Clear held item when closing
                    // Set flag to prevent pause from pointer lock release
                    this.justClosedInventory = true;
                    setTimeout(() => { this.justClosedInventory = false; }, 100);
                    // Re-request pointer lock when closing inventory
                    if (!this.isPaused) {
                        this.canvas.requestPointerLock();
                    }
                }
            },
            
            // Render inventory UI
            renderInventory() {
                const invScreen = document.getElementById('inventoryScreen');
                if (!invScreen) return;
                
                // Helper to get readable item name
                const getItemName = (slot) => {
                    if (!slot) return '';
                    const id = slot.id || slot.type;
                    const names = {
                        grass: 'Grass Block', dirt: 'Dirt', stone: 'Stone', wood: 'Wood',
                        leaves: 'Leaves', water: 'Water', sand: 'Sand', brick: 'Brick',
                        ak47: 'AK-47', water_bucket: 'Water Bucket', lava_bucket: 'Lava Bucket',
                        lava: 'Lava', obsidian: 'Obsidian', cherryWood: 'Cherry Wood',
                        cherryLeaves: 'Cherry Leaves', chest: 'Chest',
                        ritualChest: 'Ritual Chest', buildingChest: 'Building Chest',
                        seeds: 'Seeds', berdger: 'The Berdger',
                        sakuraPetal: 'Sacred Cherry Petal', shimenawa: 'Sacred Rope',
                        omamori: 'Protective Charm', ema: 'Wooden Wish Plaque',
                        incense: 'Purifying Incense'
                    };
                    return names[id] || id;
                };
                
                let html = '<div class="inventory-container">';
                html += '<h2>Inventory</h2>';
                
                // Crafting section
                html += '<div class="crafting-section">';
                html += '<h3>Crafting</h3>';
                html += '<div class="recipe-list">';
                for (const recipe of this.recipes) {
                    const canCraft = this.canCraftRecipe(recipe);
                    html += `<div class="recipe ${canCraft ? 'craftable' : 'disabled'}" data-recipe="${recipe.name}">`;
                    html += `<span class="recipe-name">${recipe.name}</span>`;
                    html += `<span class="recipe-ingredients">`;
                    recipe.ingredients.forEach(ing => {
                        html += `${ing.count}x ${ing.id} `;
                    });
                    html += `</span>`;
                    html += `<span class="recipe-result">→ ${recipe.result.count}x ${recipe.result.id}</span>`;
                    if (canCraft) {
                        html += `<button class="craft-btn" onclick="minecraftGame.craftRecipe('${recipe.name}')">Craft</button>`;
                    }
                    html += '</div>';
                }
                html += '</div></div>';
                
                // Hotbar
                html += '<div class="inv-hotbar">';
                html += '<h3>Hotbar</h3>';
                html += '<div class="inv-slots" id="hotbarSlots">';
                this.inventory.hotbar.forEach((slot, i) => {
                    const emoji = this.getItemEmoji(slot);
                    const hasItem = slot && slot.count > 0;
                    const isHeld = this.inventoryHeldItem && this.inventoryHeldItem.source === 'hotbar' && this.inventoryHeldItem.index === i;
                    const tooltip = hasItem ? getItemName(slot) : '';
                    html += `<div class="inv-slot ${i === this.selectedSlot ? 'selected' : ''} ${hasItem ? 'has-item' : ''} ${isHeld ? 'held' : ''}" 
                        data-source="hotbar" data-index="${i}" ${tooltip ? `data-tooltip="${tooltip}"` : ''}
                        draggable="${hasItem}">${emoji}<span class="count">${slot ? slot.count : ''}</span></div>`;
                });
                html += '</div></div>';
                
                // Main inventory
                html += '<div class="inv-main">';
                html += '<h3>Storage</h3>';
                html += '<div class="inv-slots" id="storageSlots">';
                for (let i = 0; i < 27; i++) {
                    const slot = this.inventory.main[i];
                    const hasItem = slot && slot.count > 0;
                    const isHeld = this.inventoryHeldItem && this.inventoryHeldItem.source === 'main' && this.inventoryHeldItem.index === i;
                    if (slot) {
                        const emoji = this.getItemEmoji(slot);
                        const tooltip = getItemName(slot);
                        html += `<div class="inv-slot has-item ${isHeld ? 'held' : ''}" data-source="main" data-index="${i}" ${tooltip ? `data-tooltip="${tooltip}"` : ''} draggable="true">${emoji}<span class="count">${slot.count}</span></div>`;
                    } else {
                        html += `<div class="inv-slot empty" data-source="main" data-index="${i}" draggable="false"></div>`;
                    }
                }
                html += '</div></div>';
                
                html += '<p class="inv-hint">Click items to pick up/place | Drag also works | Press E or ESC to close</p>';
                html += '</div>';
                
                invScreen.innerHTML = html;
                
                // Setup drag and drop handlers
                this.setupInventoryDragDrop();
            },
            
            setupInventoryDragDrop() {
                const invScreen = document.getElementById('inventoryScreen');
                const slots = document.querySelectorAll('#inventoryScreen .inv-slot');
                
                // Track held item for click-to-move
                if (!this.inventoryHeldItem) this.inventoryHeldItem = null;
                
                // Prevent page scrolling when scrolling inside inventory
                const invContainer = invScreen.querySelector('.inventory-container');
                if (invContainer) {
                    invContainer.addEventListener('wheel', (e) => {
                        e.stopPropagation();
                        // Allow scrolling inside the container but prevent it from bubbling
                        const { scrollTop, scrollHeight, clientHeight } = invContainer;
                        const atTop = scrollTop === 0;
                        const atBottom = scrollTop + clientHeight >= scrollHeight;
                        
                        // Only prevent default if we're trying to scroll beyond bounds
                        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
                            e.preventDefault();
                        }
                    }, { passive: false });
                }
                
                // Prevent scroll on the inventory screen during drag operations
                invScreen.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
                
                invScreen.addEventListener('drop', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
                
                slots.forEach(slot => {
                    // Click to select/place items (more reliable than drag)
                    slot.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const source = slot.dataset.source;
                        const index = parseInt(slot.dataset.index);
                        const slotArray = source === 'hotbar' ? this.inventory.hotbar : this.inventory.main;
                        const clickedItem = slotArray[index];
                        
                        if (this.inventoryHeldItem) {
                            // Place held item in this slot (swap if occupied)
                            this.swapInventorySlots(
                                this.inventoryHeldItem.source,
                                this.inventoryHeldItem.index,
                                source,
                                index
                            );
                            this.inventoryHeldItem = null;
                            this.renderInventory();
                            this.updateHotbar();
                            this.updateHotbarDisplay();
                        } else if (clickedItem && clickedItem.count > 0) {
                            // Pick up this item
                            this.inventoryHeldItem = { source, index };
                            this.renderInventory();
                        }
                    });
                    
                    // Also support drag and drop
                    slot.addEventListener('dragstart', (e) => {
                        e.stopPropagation();
                        const source = slot.dataset.source;
                        const index = parseInt(slot.dataset.index);
                        this.draggedItem = { source, index };
                        slot.classList.add('dragging');
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setDragImage(slot, 20, 20);
                    });
                    
                    slot.addEventListener('dragend', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        slot.classList.remove('dragging');
                        this.draggedItem = null;
                    });
                    
                    slot.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.dataTransfer.dropEffect = 'move';
                        slot.classList.add('drag-over');
                    });
                    
                    slot.addEventListener('dragleave', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        slot.classList.remove('drag-over');
                    });
                    
                    slot.addEventListener('drop', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        slot.classList.remove('drag-over');
                        
                        if (!this.draggedItem) return;
                        
                        const targetSource = slot.dataset.source;
                        const targetIndex = parseInt(slot.dataset.index);
                        
                        // Store scroll position
                        const invContainer = document.querySelector('.inventory-container');
                        const scrollTop = invContainer ? invContainer.scrollTop : 0;
                        
                        // Swap items between source and target
                        this.swapInventorySlots(
                            this.draggedItem.source, 
                            this.draggedItem.index,
                            targetSource,
                            targetIndex
                        );
                        
                        this.draggedItem = null;
                        this.renderInventory();
                        this.updateHotbar();
                        this.updateHotbarDisplay();
                        
                        // Restore scroll position
                        const newContainer = document.querySelector('.inventory-container');
                        if (newContainer) {
                            newContainer.scrollTop = scrollTop;
                        }
                    });
                });
            },
            
            swapInventorySlots(srcType, srcIdx, destType, destIdx) {
                const srcArray = srcType === 'hotbar' ? this.inventory.hotbar : this.inventory.main;
                const destArray = destType === 'hotbar' ? this.inventory.hotbar : this.inventory.main;
                
                // Get items
                const srcItem = srcArray[srcIdx];
                const destItem = destArray[destIdx];
                
                // Swap
                srcArray[srcIdx] = destItem;
                destArray[destIdx] = srcItem;
                
                // Update selected block/item if hotbar changed
                if (srcType === 'hotbar' || destType === 'hotbar') {
                    const currentSlot = this.inventory.hotbar[this.selectedSlot];
                    if (currentSlot) {
                        if (currentSlot.type === 'block') {
                            this.selectedBlock = currentSlot.id;
                            this.selectedItem = null;
                        } else if (currentSlot.type === 'weapon') {
                            this.selectedItem = currentSlot.id;
                            this.selectedBlock = null;
                        }
                    } else {
                        this.selectedBlock = null;
                        this.selectedItem = null;
                    }
                }
            },
            
            getItemEmoji(slot) {
                if (!slot) return '';
                const id = slot.id || slot.type;
                const emojis = {
                    grass: '🌿', dirt: '🟫', stone: '🪨', wood: '🪵',
                    leaves: '🌸', water: '💧', sand: '🏖️', brick: '🧱',
                    ak47: '🔫', water_bucket: '🪣', lava_bucket: '🫧',
                    lava: '🔥', obsidian: '🟣', cherryWood: '🪵', cherryLeaves: '🌸',
                    chest: '📦', ritualChest: '📦', buildingChest: '📦',
                    seeds: '🌾', berdger: '🍔',
                    sakuraPetal: '🌸', shimenawa: '🪢', omamori: '🎀',
                    ema: '🪧', incense: '🕯️'
                };
                return emojis[id] || '❓';
            },
            
            canCraftRecipe(recipe) {
                for (const ingredient of recipe.ingredients) {
                    const total = this.countItem(ingredient.id);
                    if (total < ingredient.count) return false;
                }
                return true;
            },
            
            countItem(itemId) {
                let count = 0;
                for (const slot of this.inventory.hotbar) {
                    if (slot && slot.id === itemId) count += slot.count;
                }
                for (const slot of this.inventory.main) {
                    if (slot && slot.id === itemId) count += slot.count;
                }
                return count;
            },
            
            craftRecipe(recipeName) {
                const recipe = this.recipes.find(r => r.name === recipeName);
                if (!recipe || !this.canCraftRecipe(recipe)) return;
                
                // Remove ingredients
                for (const ingredient of recipe.ingredients) {
                    this.removeItem(ingredient.id, ingredient.count);
                }
                
                // Add result
                this.addItem(recipe.result);
                
                // Re-render inventory
                this.renderInventory();
            },
            
            removeItem(itemId, count) {
                let remaining = count;
                
                // Remove from hotbar first
                for (const slot of this.inventory.hotbar) {
                    if (slot && slot.id === itemId && remaining > 0) {
                        const remove = Math.min(slot.count, remaining);
                        slot.count -= remove;
                        remaining -= remove;
                    }
                }
                
                // Then from main inventory
                for (const slot of this.inventory.main) {
                    if (slot && slot.id === itemId && remaining > 0) {
                        const remove = Math.min(slot.count, remaining);
                        slot.count -= remove;
                        remaining -= remove;
                    }
                }
            },
            
            addItem(item) {
                // Try to stack with existing items first
                for (const slot of this.inventory.hotbar) {
                    if (slot && slot.id === item.id && slot.count < 64) {
                        const add = Math.min(64 - slot.count, item.count);
                        slot.count += add;
                        item.count -= add;
                        if (item.count <= 0) return;
                    }
                }
                
                for (const slot of this.inventory.main) {
                    if (slot && slot.id === item.id && slot.count < 64) {
                        const add = Math.min(64 - slot.count, item.count);
                        slot.count += add;
                        item.count -= add;
                        if (item.count <= 0) return;
                    }
                }
                
                // Find empty slot
                for (let i = 0; i < this.inventory.main.length; i++) {
                    if (!this.inventory.main[i]) {
                        this.inventory.main[i] = { ...item };
                        return;
                    }
                }
            },
            
            raycast() {
                // Calculate ray direction from camera angles
                // rotY = yaw (horizontal), rotX = pitch (vertical)
                const pitch = this.camera.rotX;
                const yaw = this.camera.rotY;
                
                const cosPitch = Math.cos(pitch);
                const sinPitch = Math.sin(pitch);
                const cosYaw = Math.cos(yaw);
                const sinYaw = Math.sin(yaw);
                
                // Direction vector (matches movement and projection)
                const dx = -sinYaw * cosPitch;
                const dy = -sinPitch;
                const dz = cosYaw * cosPitch;
                
                // Normalize direction (important for accurate distance calculation)
                const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
                const dirX = dx / len;
                const dirY = dy / len;
                const dirZ = dz / len;
                
                // Ray origin - start slightly in front of camera to avoid self-intersection
                const startOffset = 0.1;
                let x = this.camera.x + dirX * startOffset;
                let y = this.camera.y + dirY * startOffset;
                let z = this.camera.z + dirZ * startOffset;
                
                // Current voxel position
                let voxelX = Math.floor(x);
                let voxelY = Math.floor(y);
                let voxelZ = Math.floor(z);
                
                // Step direction (+1 or -1)
                const stepX = dirX >= 0 ? 1 : -1;
                const stepY = dirY >= 0 ? 1 : -1;
                const stepZ = dirZ >= 0 ? 1 : -1;
                
                // Distance between voxel boundaries along each axis
                const tDeltaX = Math.abs(1 / dirX);
                const tDeltaY = Math.abs(1 / dirY);
                const tDeltaZ = Math.abs(1 / dirZ);
                
                // Distance to first voxel boundary
                let tMaxX, tMaxY, tMaxZ;
                
                if (dirX > 0) {
                    tMaxX = (voxelX + 1 - x) / dirX;
                } else if (dirX < 0) {
                    tMaxX = (voxelX - x) / dirX;
                } else {
                    tMaxX = Infinity;
                }
                
                if (dirY > 0) {
                    tMaxY = (voxelY + 1 - y) / dirY;
                } else if (dirY < 0) {
                    tMaxY = (voxelY - y) / dirY;
                } else {
                    tMaxY = Infinity;
                }
                
                if (dirZ > 0) {
                    tMaxZ = (voxelZ + 1 - z) / dirZ;
                } else if (dirZ < 0) {
                    tMaxZ = (voxelZ - z) / dirZ;
                } else {
                    tMaxZ = Infinity;
                }
                
                // Track the face we entered from (for block placement)
                let enteredFace = null;
                
                // Maximum reach distance (in blocks)
                const maxDistance = 6;
                let t = 0;
                
                // Track last non-fluid entry face for proper placement
                let lastSolidFace = null;
                
                // Track if ray passed through water
                let throughWater = false;
                let throughLava = false;
                
                // DDA traversal loop
                for (let i = 0; i < 100; i++) { // safety limit
                    // Check current voxel for block
                    const block = this.getBlock(voxelX, voxelY, voxelZ);
                    if (block) {
                        // Skip fluid blocks - continue raycast through them
                        if (block === 'water' || block === 'lava') {
                            // Track which fluid we passed through
                            if (block === 'water') throughWater = true;
                            if (block === 'lava') throughLava = true;
                            // Don't update lastSolidFace, just continue
                        } else {
                            // Hit a solid block! Calculate placement position
                            let placePos = null;
                            // Use lastSolidFace if we came through fluids, otherwise use enteredFace
                            const placeFace = lastSolidFace || enteredFace;
                            if (placeFace) {
                                placePos = {
                                    x: voxelX + placeFace.x,
                                    y: voxelY + placeFace.y,
                                    z: voxelZ + placeFace.z
                                };
                            }
                            
                            return {
                                hit: { x: voxelX, y: voxelY, z: voxelZ },
                                place: placePos,
                                block: block,
                                throughWater: throughWater,
                                throughLava: throughLava
                            };
                        }
                    } else {
                        // Empty space - update lastSolidFace
                        lastSolidFace = enteredFace;
                    }
                    
                    // Step to next voxel (choose axis with smallest tMax)
                    if (tMaxX < tMaxY && tMaxX < tMaxZ) {
                        t = tMaxX;
                        if (t > maxDistance) break;
                        voxelX += stepX;
                        tMaxX += tDeltaX;
                        enteredFace = { x: -stepX, y: 0, z: 0 };
                    } else if (tMaxY < tMaxZ) {
                        t = tMaxY;
                        if (t > maxDistance) break;
                        voxelY += stepY;
                        tMaxY += tDeltaY;
                        enteredFace = { x: 0, y: -stepY, z: 0 };
                    } else {
                        t = tMaxZ;
                        if (t > maxDistance) break;
                        voxelZ += stepZ;
                        tMaxZ += tDeltaZ;
                        enteredFace = { x: 0, y: 0, z: -stepZ };
                    }
                }
                
                // No block hit within range
                return null;
            },
            
            update() {
                if (!this.isActive || this.isPaused) return;
                
                // Update weapon cooldowns
                if (this.shootCooldown > 0) this.shootCooldown--;
                if (this.muzzleFlash > 0) this.muzzleFlash--;
                
                // Update ritual flight timer (separate from debug fly)
                if (this.ritualFlightTimer > 0) {
                    this.ritualFlightTimer--;
                    if (this.ritualFlightTimer <= 0) {
                        this.ritualFlight = false;
                    }
                }
                
                const baseSpeed = this.debugMoveSpeed || 0.12;
                const canFly = this.debugNoclip || this.debugFly || this.ritualFlight;
                const speed = canFly ? baseSpeed * 2 : baseSpeed;
                // Forward direction matches camera view: (-sin(rotY), cos(rotY))
                const sin = Math.sin(this.camera.rotY);
                const cos = Math.cos(this.camera.rotY);
                
                // --- NOCLIP/FLY MODE ---
                if (this.debugNoclip || this.debugFly) {
                    let moveX = 0, moveY = 0, moveZ = 0;
                    
                    // Forward/backward (W/S) - includes vertical component when looking up/down
                    if (this.keys['w']) {
                        moveX -= sin * Math.cos(this.camera.rotX) * speed;
                        moveY -= Math.sin(this.camera.rotX) * speed;
                        moveZ += cos * Math.cos(this.camera.rotX) * speed;
                    }
                    if (this.keys['s']) {
                        moveX += sin * Math.cos(this.camera.rotX) * speed;
                        moveY += Math.sin(this.camera.rotX) * speed;
                        moveZ -= cos * Math.cos(this.camera.rotX) * speed;
                    }
                    // Strafe (A/D)
                    if (this.keys['a']) {
                        moveX -= cos * speed;
                        moveZ -= sin * speed;
                    }
                    if (this.keys['d']) {
                        moveX += cos * speed;
                        moveZ += sin * speed;
                    }
                    // Up/Down (Space/Shift)
                    if (this.keys[' ']) moveY += speed;
                    if (this.keys['shift']) moveY -= speed;
                    
                    // Apply movement (no collision in noclip, collision in debug fly)
                    if (this.debugNoclip) {
                        this.camera.x += moveX;
                        this.camera.y += moveY;
                        this.camera.z += moveZ;
                    } else {
                        // Debug fly mode still has collision
                        this.camera.x += moveX;
                        this.camera.y += moveY;
                        this.camera.z += moveZ;
                    }
                    
                    // Reset velocity
                    this.velocity = { x: 0, y: 0, z: 0 };
                    return; // Skip normal physics
                }
                
                // --- RITUAL FLIGHT MODE (with collision) ---
                if (this.ritualFlight) {
                    let moveX = 0, moveY = 0, moveZ = 0;
                    
                    // Horizontal movement
                    if (this.keys['w']) {
                        moveX -= sin * speed;
                        moveZ += cos * speed;
                    }
                    if (this.keys['s']) {
                        moveX += sin * speed;
                        moveZ -= cos * speed;
                    }
                    if (this.keys['a']) {
                        moveX -= cos * speed;
                        moveZ -= sin * speed;
                    }
                    if (this.keys['d']) {
                        moveX += cos * speed;
                        moveZ += sin * speed;
                    }
                    // Vertical flight controls
                    if (this.keys[' ']) moveY += speed;
                    if (this.keys['shift']) moveY -= speed;
                    
                    // Apply with simple collision check
                    const newX = this.camera.x + moveX;
                    const newY = this.camera.y + moveY;
                    const newZ = this.camera.z + moveZ;
                    
                    const feetY = Math.floor(newY - this.playerEyeHeight);
                    const headY = Math.floor(newY);
                    const px = Math.floor(newX);
                    const pz = Math.floor(newZ);
                    
                    let canMove = true;
                    for (let checkY = feetY; checkY <= headY; checkY++) {
                        const block = this.getBlock(px, checkY, pz);
                        if (block && !this.fluidBlocks.includes(block)) {
                            canMove = false;
                            break;
                        }
                    }
                    
                    if (canMove) {
                        this.camera.x = newX;
                        this.camera.y = newY;
                        this.camera.z = newZ;
                    }
                    
                    this.velocity = { x: 0, y: 0, z: 0 };
                    return; // Skip normal physics
                }
                
                // --- FLUID DETECTION ---
                const playerFeetY = this.camera.y - this.playerEyeHeight;
                const playerHeadY = playerFeetY + this.playerHeight;
                const px = Math.floor(this.camera.x);
                const pz = Math.floor(this.camera.z);
                
                // Check fluid at feet, waist, and head
                const feetBlock = this.getBlock(px, Math.floor(playerFeetY), pz);
                const waistBlock = this.getBlock(px, Math.floor(playerFeetY + 0.9), pz);
                const headBlock = this.getBlock(px, Math.floor(playerHeadY - 0.1), pz);
                
                const feetInWater = feetBlock === 'water';
                const feetInLava = feetBlock === 'lava';
                const waistInWater = waistBlock === 'water';
                const waistInLava = waistBlock === 'lava';
                const headInWater = headBlock === 'water';
                const headInLava = headBlock === 'lava';
                
                // Determine swimming state (in fluid at feet or waist level)
                const inWater = feetInWater || waistInWater;
                const inLava = feetInLava || waistInLava;
                const swimming = inWater || inLava;
                const submerged = headInWater || headInLava;
                
                // Store fluid state for rendering effects
                this.inWater = inWater || headInWater;
                this.inLava = inLava || headInLava;
                this.swimming = swimming;
                this.headSubmergedWater = headInWater;  // Only show blue overlay when head is underwater
                this.headSubmergedLava = headInLava;    // Only show lava overlay when head is in lava
                
                // Apply speed modifier when in fluid
                let speedMod = 1.0;
                if (inWater) speedMod = 0.65;  // Water slows to 65%
                if (inLava) speedMod = 0.35;   // Lava slows to 35%
                
                let moveX = 0;
                let moveZ = 0;
                const walkSpeed = baseSpeed;
                
                // Forward/backward (W/S)
                if (this.keys['w']) {
                    moveX -= sin * walkSpeed * speedMod;
                    moveZ += cos * walkSpeed * speedMod;
                }
                if (this.keys['s']) {
                    moveX += sin * walkSpeed * speedMod;
                    moveZ -= cos * walkSpeed * speedMod;
                }
                // Strafe left/right (A/D) - perpendicular to view
                if (this.keys['a']) {
                    moveX -= cos * walkSpeed * speedMod;
                    moveZ -= sin * walkSpeed * speedMod;
                }
                if (this.keys['d']) {
                    moveX += cos * walkSpeed * speedMod;
                    moveZ += sin * walkSpeed * speedMod;
                }
                
                // Track old position
                const oldX = this.camera.x;
                const oldZ = this.camera.z;
                
                // Improved collision detection with smaller steps and wall sliding
                const playerRadius = 0.25; // Slightly smaller for tighter spaces
                const playerHeight = 1.8;
                
                // First, check if we're currently stuck and need to escape
                if (this.collidesAt(this.camera.x, this.camera.y, this.camera.z, playerRadius, playerHeight)) {
                    // EMERGENCY UNSTUCK - aggressive push out
                    let escaped = false;
                    for (let pushDist = 0.1; pushDist <= 1.5 && !escaped; pushDist += 0.1) {
                        const escapeAngles = [0, 45, 90, 135, 180, 225, 270, 315];
                        for (const angle of escapeAngles) {
                            const rad = angle * Math.PI / 180;
                            const testX = this.camera.x + Math.cos(rad) * pushDist;
                            const testZ = this.camera.z + Math.sin(rad) * pushDist;
                            if (!this.collidesAt(testX, this.camera.y, testZ, playerRadius, playerHeight)) {
                                this.camera.x = testX;
                                this.camera.z = testZ;
                                escaped = true;
                                break;
                            }
                        }
                        // Also try pushing up
                        if (!escaped && !this.collidesAt(this.camera.x, this.camera.y + pushDist, this.camera.z, playerRadius, playerHeight)) {
                            this.camera.y += pushDist;
                            escaped = true;
                        }
                    }
                }
                
                // Try full movement first
                let finalX = this.camera.x;
                let finalZ = this.camera.z;
                
                // Step-based collision for smoother wall sliding
                const steps = 8; // More steps for smoother collision
                const stepX = moveX / steps;
                const stepZ = moveZ / steps;
                
                for (let i = 0; i < steps; i++) {
                    // Try X movement with slight margin
                    const testX = finalX + stepX;
                    if (!this.collidesAt(testX, this.camera.y, finalZ, playerRadius, playerHeight)) {
                        finalX = testX;
                    } else {
                        // Try to slide along the wall with reduced speed
                        const slideX = stepX * 0.5;
                        if (!this.collidesAt(finalX + slideX, this.camera.y, finalZ, playerRadius, playerHeight)) {
                            finalX += slideX;
                        }
                    }
                    
                    // Try Z movement with slight margin
                    const testZ = finalZ + stepZ;
                    if (!this.collidesAt(finalX, this.camera.y, testZ, playerRadius, playerHeight)) {
                        finalZ = testZ;
                    } else {
                        // Try to slide along the wall with reduced speed
                        const slideZ = stepZ * 0.5;
                        if (!this.collidesAt(finalX, this.camera.y, finalZ + slideZ, playerRadius, playerHeight)) {
                            finalZ += slideZ;
                        }
                    }
                }
                
                // Final safety check - if still stuck, try small adjustments
                if (this.collidesAt(finalX, this.camera.y, finalZ, playerRadius, playerHeight)) {
                    // Don't move at all if we'd get stuck
                    finalX = this.camera.x;
                    finalZ = this.camera.z;
                }
                
                this.camera.x = finalX;
                this.camera.z = finalZ;
                
                // Track distance
                const dx = this.camera.x - oldX;
                const dz = this.camera.z - oldZ;
                this.stats.distance += Math.sqrt(dx * dx + dz * dz);
                
                // --- GRAVITY / SWIMMING PHYSICS ---
                if (swimming) {
                    // SWIMMING MODE: Buoyancy and fluid drag
                    const buoyancy = inLava ? 0.008 : 0.012;  // Lava is denser, less buoyancy
                    const swimDrag = inLava ? 0.92 : 0.95;    // More drag in lava
                    
                    // Natural buoyancy pushes player up
                    this.velocity.y += buoyancy;
                    
                    // SPACE = swim up
                    if (this.keys[' ']) {
                        const swimUpSpeed = inLava ? 0.04 : 0.06;
                        this.velocity.y += swimUpSpeed;
                    }
                    
                    // SHIFT = swim down
                    if (this.keys['shift']) {
                        const swimDownSpeed = inLava ? 0.03 : 0.04;
                        this.velocity.y -= swimDownSpeed;
                    }
                    
                    // Clamp swim velocity
                    const maxSwimSpeed = inLava ? 0.12 : 0.15;
                    this.velocity.y = Math.max(-maxSwimSpeed, Math.min(maxSwimSpeed, this.velocity.y));
                    
                    // Apply drag (velocity decays over time in fluid)
                    this.velocity.y *= swimDrag;
                    
                    // Surface boost - when at surface and pressing space, jump out
                    if (!submerged && this.keys[' '] && this.velocity.y < 0.15) {
                        this.velocity.y = 0.2;
                    }
                } else {
                    // NORMAL MODE: Standard gravity
                    this.velocity.y += this.gravity;
                }
                
                const newY = this.camera.y + this.velocity.y;
                
                // Ground collision - camera is at hip/waist level (playerEyeHeight above ground)
                const groundY = this.getGroundHeightBelow(this.camera.x, this.camera.z, this.camera.y) + this.playerEyeHeight + 0.5;
                if (newY < groundY) {
                    this.camera.y = groundY;
                    this.velocity.y = 0;
                    this.isJumping = false;
                    
                    // Continuous jumping - if space is held and on ground, jump immediately
                    if (this.keys[' '] && !swimming) {
                        this.velocity.y = 0.28;
                        this.isJumping = true;
                        this.stats.jumps++;
                    }
                } else {
                    this.camera.y = newY;
                }
                
                // Ceiling collision
                const ceilingY = this.getCeilingAbove(this.camera.x, this.camera.z, this.camera.y);
                if (ceilingY !== null && this.camera.y > ceilingY - 0.5) {
                    this.camera.y = ceilingY - 0.5;
                    this.velocity.y = 0;
                }
                
                // World boundary forcefield - keep player inside
                if (this.worldBounds) {
                    const margin = 0.5;  // Keep player slightly inside boundary
                    const bounce = 0.3;  // Bounce back force
                    
                    if (this.camera.x < this.worldBounds.minX + margin) {
                        this.camera.x = this.worldBounds.minX + margin;
                        this.velocity.x = Math.abs(this.velocity.x || 0) * bounce;
                    }
                    if (this.camera.x > this.worldBounds.maxX - margin) {
                        this.camera.x = this.worldBounds.maxX - margin;
                        this.velocity.x = -Math.abs(this.velocity.x || 0) * bounce;
                    }
                    if (this.camera.z < this.worldBounds.minZ + margin) {
                        this.camera.z = this.worldBounds.minZ + margin;
                        this.velocity.z = Math.abs(this.velocity.z || 0) * bounce;
                    }
                    if (this.camera.z > this.worldBounds.maxZ - margin) {
                        this.camera.z = this.worldBounds.maxZ - margin;
                        this.velocity.z = -Math.abs(this.velocity.z || 0) * bounce;
                    }
                    // Prevent falling below world
                    if (this.camera.y < this.worldBounds.minY + this.playerEyeHeight) {
                        this.camera.y = this.worldBounds.minY + this.playerEyeHeight;
                        this.velocity.y = 0.15;  // Bounce up
                    }
                }
                
                // Trippy filter animation
                if (this.settings.filter === 'trippy') {
                    this.applyFilters();
                }
            },
            
            // Check if player would collide with blocks at position
            collidesAt(x, y, z, radius, height) {
                const feetY = y - this.playerEyeHeight; // Camera is at waist level
                // Check corners and center at multiple heights
                const checkPoints = [
                    { x: x - radius, z: z - radius },
                    { x: x + radius, z: z - radius },
                    { x: x - radius, z: z + radius },
                    { x: x + radius, z: z + radius },
                    { x: x, z: z }
                ];
                
                for (const point of checkPoints) {
                    const bx = Math.floor(point.x);
                    const bz = Math.floor(point.z);
                    // Check at feet, middle, and head level
                    for (let checkY = Math.floor(feetY); checkY < Math.floor(feetY + height); checkY++) {
                        const block = this.getBlock(bx, checkY, bz);
                        // Fluids don't block movement - player can walk/swim through them
                        if (block && !this.fluidBlocks.includes(block)) {
                            return true;
                        }
                    }
                }
                return false;
            },
            
            // Get ground height directly below player (not teleporting to trees)
            getGroundHeightBelow(x, z, currentY) {
                const bx = Math.floor(x);
                const bz = Math.floor(z);
                const startY = Math.floor(currentY - this.playerEyeHeight); // Start from feet level
                
                for (let y = startY; y >= 0; y--) {
                    const block = this.getBlock(bx, y, bz);
                    // Fluids don't count as ground - player sinks through them
                    if (block && !this.fluidBlocks.includes(block)) {
                        return y + 1;
                    }
                }
                return 0;
            },
            
            // Get ceiling above player
            getCeilingAbove(x, z, currentY) {
                const bx = Math.floor(x);
                const bz = Math.floor(z);
                const headY = Math.floor(currentY);
                
                for (let y = headY; y <= headY + 3; y++) {
                    const block = this.getBlock(bx, y, bz);
                    // Fluids don't count as ceiling
                    if (block && !this.fluidBlocks.includes(block)) {
                        return y;
                    }
                }
                return null;
            },
            
            render() {
                if (!this.isActive) return;
                
                const ctx = this.ctx!;
                const width = this.canvas.width;
                const height = this.canvas.height;
                
                // Sky gradient (cached when dimensions match)
                if (!this.cachedSky || this.cachedSky.w !== width || this.cachedSky.h !== height || this.cachedSky.lighting !== this.settings.lighting) {
                    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
                    if (this.settings.lighting) {
                        skyGrad.addColorStop(0, '#1a0a1a');
                        skyGrad.addColorStop(0.5, '#2d1f3d');
                        skyGrad.addColorStop(1, '#ffb7c5');
                    } else {
                        skyGrad.addColorStop(0, '#111');
                        skyGrad.addColorStop(1, '#333');
                    }
                    this.cachedSky = { grad: skyGrad, w: width, h: height, lighting: this.settings.lighting };
                }
                ctx.fillStyle = this.cachedSky.grad;
                ctx.fillRect(0, 0, width, height);
                
                // Cache camera values for this frame
                const camX = this.camera.x;
                const camY = this.camera.y;
                const camZ = this.camera.z;
                const cosY = Math.cos(-this.camera.rotY);
                const sinY = Math.sin(-this.camera.rotY);
                const cosX = Math.cos(-this.camera.rotX);
                const sinX = Math.sin(-this.camera.rotX);
                const halfW = width / 2;
                const halfH = height / 2;
                const fov = 400;
                const renderDist = this.settings.renderDistance;
                const renderDistSq = renderDist * renderDist;
                
                // Inline project function for speed
                const project = (x, y, z) => {
                    const dx = x - camX;
                    const dy = y - camY;
                    const dz = z - camZ;
                    const rx = dx * cosY - dz * sinY;
                    const rz = dx * sinY + dz * cosY;
                    const ry = dy * cosX - rz * sinX;
                    const finalZ = dy * sinX + rz * cosX;
                    if (finalZ <= 0.1) return null;
                    return { x: halfW + (rx / finalZ) * fov, y: halfH - (ry / finalZ) * fov, z: finalZ };
                };
                
                // Collect visible blocks with frustum culling
                const blocks = [];
                const camDirX = -Math.sin(this.camera.rotY);
                const camDirZ = Math.cos(this.camera.rotY);
                
                // Performance: Cache world keys if not changed
                const worldKeys = Object.keys(this.world);
                
                for (let i = 0; i < worldKeys.length; i++) {
                    const key = worldKeys[i];
                    const [x, y, z] = key.split(',').map(Number);
                    const dx = x + 0.5 - camX;
                    const dy = y + 0.5 - camY;
                    const dz = z + 0.5 - camZ;
                    const distSq = dx * dx + dy * dy + dz * dz;
                    
                    // Distance culling
                    if (distSq > renderDistSq) continue;
                    
                    // Basic frustum culling - skip blocks behind camera
                    const dot = dx * camDirX + dz * camDirZ;
                    if (dot < -3 && distSq > 16) continue; // Behind camera and not too close
                    
                    blocks.push({ x, y, z, dist: distSq, type: this.world[key] });
                }
                
                // Sort back-to-front (painter's algorithm)
                blocks.sort((a: any, b: any) => b.dist - a.dist);
                
                // Render blocks with face culling
                const getBlock = (x, y, z) => this.world[`${x},${y},${z}`];
                const isTransparent = (block) => !block || this.fluidBlocks.includes(block);
                const getFluidLevel = (x, y, z) => this.fluidLevels[`${x},${y},${z}`] || 8;
                const animTime = Date.now() * 0.002; // Animation time for flowing effect
                
                // Separate opaque and transparent blocks for proper rendering
                const opaqueBlocks = [];
                const transparentBlocks = [];
                
                for (let i = 0; i < blocks.length; i++) {
                    const block = blocks[i];
                    const colors = this.blockColors[block.type];
                    if (colors && colors.transparent) {
                        transparentBlocks.push(block);
                    } else {
                        opaqueBlocks.push(block);
                    }
                }
                
                // PROPER RENDERING ORDER for painter's algorithm:
                // 1. Sort transparent blocks back-to-front (furthest first)
                // 2. Sort opaque blocks back-to-front (furthest first) 
                // 3. Draw transparent blocks first (they're behind)
                // 4. Draw opaque blocks last (they overwrite and properly occlude)
                
                // ANGULAR OCCLUSION SYSTEM - check if block is visible from camera angle
                // Uses corner visibility testing for proper edge handling
                const isBlockOccluded = (x, y, z) => {
                    // Test 8 corners of the block plus center
                    const testPoints = [
                        [x + 0.5, y + 0.5, z + 0.5], // center
                        [x + 0.1, y + 0.1, z + 0.1], // corners with small inset
                        [x + 0.9, y + 0.1, z + 0.1],
                        [x + 0.1, y + 0.9, z + 0.1],
                        [x + 0.9, y + 0.9, z + 0.1],
                        [x + 0.1, y + 0.1, z + 0.9],
                        [x + 0.9, y + 0.1, z + 0.9],
                        [x + 0.1, y + 0.9, z + 0.9],
                        [x + 0.9, y + 0.9, z + 0.9],
                    ];
                    
                    // Block is visible if ANY corner/point is visible
                    for (const [px, py, pz] of testPoints) {
                        const dx = px - camX;
                        const dy = py - camY;
                        const dz = pz - camZ;
                        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        
                        let pointOccluded = false;
                        // Ray march with finer steps near camera and target
                        const steps = Math.min(8, Math.ceil(dist / 2));
                        for (let i = 1; i < steps; i++) {
                            const t = i / steps;
                            const checkX = Math.floor(camX + dx * t);
                            const checkY = Math.floor(camY + dy * t);
                            const checkZ = Math.floor(camZ + dz * t);
                            
                            // Skip if we're checking the target block itself
                            if (checkX === x && checkY === y && checkZ === z) continue;
                            
                            const checkBlock = getBlock(checkX, checkY, checkZ);
                            // Solid non-fluid, non-transparent block occludes
                            if (checkBlock && !this.fluidBlocks.includes(checkBlock)) {
                                // Check if this block type has transparency property
                                const blockColors = this.blockColors[checkBlock];
                                if (!blockColors || !blockColors.transparent) {
                                    pointOccluded = true;
                                    break;
                                }
                            }
                        }
                        
                        // If this point is visible, the block is visible
                        if (!pointOccluded) return false;
                    }
                    
                    // All points occluded = block is occluded
                    return true;
                };
                
                // Filter out occluded transparent blocks
                const visibleTransparent = transparentBlocks.filter(b => !isBlockOccluded(b.x, b.y, b.z));
                
                // Sort each group - furthest (largest dist) first
                visibleTransparent.sort((a: any, b: any) => b.dist - a.dist);
                opaqueBlocks.sort((a: any, b: any) => b.dist - a.dist);
                
                // CORRECT ORDER: Draw opaque blocks FIRST, then transparent blocks
                // This allows transparent blocks to see opaque blocks behind them
                const allBlocks = [...opaqueBlocks, ...visibleTransparent];
                
                for (let i = 0; i < allBlocks.length; i++) {
                    const block = allBlocks[i];
                    const { x, y, z, type } = block;
                    const colors = this.blockColors[type];
                    if (!colors) continue;
                    
                    const isFluid = this.fluidBlocks.includes(type);
                    const fluidLevel = isFluid ? getFluidLevel(x, y, z) : 8;
                    // Fluids should fill their block space properly - topY calculation
                    const topY = y + (fluidLevel / 8);
                    
                    // Check adjacent blocks
                    const adjTop = getBlock(x, y + 1, z);
                    const adjBottom = getBlock(x, y - 1, z);
                    const adjFront = getBlock(x, y, z + 1);
                    const adjBack = getBlock(x, y, z - 1);
                    const adjLeft = getBlock(x - 1, y, z);
                    const adjRight = getBlock(x + 1, y, z);
                    
                    let hasTop, hasBottom, hasFront, hasBack, hasLeft, hasRight;
                    
                    if (isFluid) {
                        // For fluids, show top if not covered by same fluid above
                        hasTop = !adjTop || adjTop !== type;
                        hasBottom = !adjBottom || !this.fluidBlocks.includes(adjBottom);
                        
                        // For sides, show face if:
                        // 1. No adjacent block, or
                        // 2. Adjacent is different type (including different fluid), or  
                        // 3. Adjacent is same fluid but at a LOWER level (we need to show our side above their top)
                        const myLevel = fluidLevel;
                        
                        const frontLevel = adjFront === type ? getFluidLevel(x, y, z + 1) : 0;
                        const backLevel = adjBack === type ? getFluidLevel(x, y, z - 1) : 0;
                        const leftLevel = adjLeft === type ? getFluidLevel(x - 1, y, z) : 0;
                        const rightLevel = adjRight === type ? getFluidLevel(x + 1, y, z) : 0;
                        
                        hasFront = !adjFront || (adjFront !== type) || (frontLevel < myLevel);
                        hasBack = !adjBack || (adjBack !== type) || (backLevel < myLevel);
                        hasLeft = !adjLeft || (adjLeft !== type) || (leftLevel < myLevel);
                        hasRight = !adjRight || (adjRight !== type) || (rightLevel < myLevel);
                    } else {
                        // Solid blocks: show face if adjacent is empty OR is transparent (fluid)
                        hasTop = isTransparent(adjTop);
                        hasBottom = isTransparent(adjBottom);
                        hasFront = isTransparent(adjFront);
                        hasBack = isTransparent(adjBack);
                        hasLeft = isTransparent(adjLeft);
                        hasRight = isTransparent(adjRight);
                    }
                    
                    // Skip fully hidden blocks
                    if (!hasTop && !hasBottom && !hasFront && !hasBack && !hasLeft && !hasRight) continue;
                    
                    // Define visible faces
                    const faces = [];
                    
                    // Front face (+Z)
                    if (hasFront) {
                        faces.push({ v: [[x, y, z+1], [x+1, y, z+1], [x+1, topY, z+1], [x, topY, z+1]], color: colors.side, dark: 1, isTop: false });
                    }
                    // Back face (-Z)
                    if (hasBack) {
                        faces.push({ v: [[x+1, y, z], [x, y, z], [x, topY, z], [x+1, topY, z]], color: colors.side, dark: 0.7, isTop: false });
                    }
                    // Top face (+Y)
                    if (hasTop) {
                        faces.push({ v: [[x, topY, z], [x+1, topY, z], [x+1, topY, z+1], [x, topY, z+1]], color: colors.top, dark: 1, isTop: true });
                    }
                    // Bottom face (-Y)
                    if (hasBottom) {
                        faces.push({ v: [[x, y, z+1], [x+1, y, z+1], [x+1, y, z], [x, y, z]], color: colors.bottom, dark: 0.7, isTop: false });
                    }
                    // Left face (-X)
                    if (hasLeft) {
                        faces.push({ v: [[x, y, z], [x, y, z+1], [x, topY, z+1], [x, topY, z]], color: colors.side, dark: 0.85, isTop: false });
                    }
                    // Right face (+X)
                    if (hasRight) {
                        faces.push({ v: [[x+1, y, z+1], [x+1, y, z], [x+1, topY, z], [x+1, topY, z+1]], color: colors.side, dark: 0.85, isTop: false });
                    }
                    
                    // Render visible faces
                    for (let f = 0; f < faces.length; f++) {
                        const face = faces[f];
                        const pts = [];
                        let valid = true;
                        
                        for (let v = 0; v < 4; v++) {
                            const p = project(face.v[v][0], face.v[v][1], face.v[v][2]);
                            if (!p) { valid = false; break; }
                            pts.push(p);
                        }
                        if (!valid || pts.length !== 4) continue;
                        
                        // Apply shadow and get base color
                        let fillColor = face.color;
                        if (this.settings.shadows && face.dark < 1) {
                            fillColor = this.darkenColor(face.color, face.dark);
                        }
                        
                        // Animated fluid rendering
                        if (isFluid && colors.animated) {
                            if (type === 'water') {
                                // ADVANCED WATER RENDERING with Screen-Space Reflections
                                // Implements simplified SSR, Fresnel, caustics, and player reflection
                                
                                const time = animTime;
                                
                                // Multi-octave Gerstner wave simulation
                                const wave1 = Math.sin(time + x * 0.7 + z * 0.5) * 0.4;
                                const wave2 = Math.sin(time * 0.8 - x * 0.3 + z * 0.7) * 0.3;
                                const wave3 = Math.sin(time * 1.3 + x * 0.5 - z * 0.3) * 0.2;
                                const combinedWave = (wave1 + wave2 + wave3) / 3 + 0.5;
                                
                                // Calculate view vector for Fresnel
                                const dx = x + 0.5 - camX;
                                const dy = y + 0.5 - camY;
                                const dz = z + 0.5 - camZ;
                                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                                
                                // Normal-based view angle
                                const viewDotNormal = Math.abs(dy / (dist || 1));
                                
                                // Schlick's Fresnel approximation
                                const F0 = 0.02; // Water's base reflectivity
                                const fresnel = F0 + (1 - F0) * Math.pow(1 - viewDotNormal, 5);
                                
                                // SCREEN-SPACE REFLECTION approximation
                                // Check if player would be reflected in this water block
                                let playerReflection = 0;
                                const playerDx = this.camera.x - (x + 0.5);
                                const playerDz = this.camera.z - (z + 0.5);
                                const playerDistToWater = Math.sqrt(playerDx * playerDx + playerDz * playerDz);
                                
                                // Player is reflected if close to water and water is below player
                                if (playerDistToWater < 5 && this.camera.y > y + 1) {
                                    // Reflection strength based on distance and angle
                                    const reflectStrengthDist = 1 - (playerDistToWater / 5);
                                    playerReflection = reflectStrengthDist * fresnel * 0.3;
                                }
                                
                                // Environment reflection sampling
                                const skyColors = [
                                    { r: 255, g: 183, b: 197 }, // Sunset pink
                                    { r: 255, g: 218, b: 185 }, // Peach
                                    { r: 135, g: 206, b: 235 }  // Sky blue
                                ];
                                const skyIndex = Math.min(2, Math.floor((1 - viewDotNormal) * 3));
                                const sky = skyColors[skyIndex];
                                
                                // Base water color with depth absorption
                                const depthFactor = Math.min(1, dist / 20);
                                const waterR = 30 + depthFactor * 15;
                                const waterG = 80 + depthFactor * 20;
                                const waterB = 160 - depthFactor * 30;
                                
                                // Player color for reflection (brown shirt tone)
                                const playerColor = { r: 100, g: 60, b: 40 };
                                
                                // Blend reflection and refraction based on Fresnel
                                const reflectStrength = Math.min(0.7, fresnel * 1.5);
                                let r = Math.floor(waterR * (1 - reflectStrength) + sky.r * reflectStrength);
                                let g = Math.floor(waterG * (1 - reflectStrength) + sky.g * reflectStrength);
                                let b = Math.floor(waterB * (1 - reflectStrength) + sky.b * reflectStrength);
                                
                                // Add player reflection tint
                                if (playerReflection > 0) {
                                    r = Math.floor(r * (1 - playerReflection) + playerColor.r * playerReflection);
                                    g = Math.floor(g * (1 - playerReflection) + playerColor.g * playerReflection);
                                    b = Math.floor(b * (1 - playerReflection) + playerColor.b * playerReflection);
                                }
                                
                                // Specular highlights (Blinn-Phong)
                                const sunDir = { x: 0.5, y: 0.8, z: 0.3 };
                                const viewDir = { x: dx/dist, y: dy/dist, z: dz/dist };
                                const halfVec = {
                                    x: sunDir.x + viewDir.x,
                                    y: sunDir.y + viewDir.y,
                                    z: sunDir.z + viewDir.z
                                };
                                const halfLen = Math.sqrt(halfVec.x*halfVec.x + halfVec.y*halfVec.y + halfVec.z*halfVec.z);
                                const specularBase = Math.max(0, halfVec.y / halfLen);
                                const specular = Math.pow(specularBase, 32) * combinedWave * 0.6;
                                
                                // Caustics effect
                                const caustic1 = Math.sin(time * 2 + x * 1.5) * Math.cos(time * 1.5 + z * 1.5);
                                const caustic2 = Math.sin(time * 1.7 - x * 1.2 + z * 0.8);
                                const caustics = (caustic1 * caustic2 + 1) * 0.1;
                                
                                // Final color with all effects
                                const brightness = 0.85 + combinedWave * 0.15 + specular + caustics;
                                const finalR = Math.min(255, Math.floor(r * brightness + specular * 200));
                                const finalG = Math.min(255, Math.floor(g * brightness + specular * 180));
                                const finalB = Math.min(255, Math.floor(b * brightness + specular * 150));
                                
                                // Dynamic transparency
                                const baseAlpha = 0.55;
                                const fresnelAlpha = fresnel * 0.35;
                                const alpha = Math.min(0.9, baseAlpha + fresnelAlpha);
                                
                                fillColor = `rgba(${finalR}, ${finalG}, ${finalB}, ${alpha})`;
                                
                            } else if (type === 'lava') {
                                // Animated lava with glowing/pulsing effect
                                const glowPhase = animTime * 1.5 + x * 0.3 + z * 0.3;
                                const glow = 0.8 + Math.sin(glowPhase) * 0.2;
                                const r = Math.floor(255 * glow);
                                const g = Math.floor((80 + Math.sin(glowPhase * 2) * 30) * glow);
                                const b = Math.floor(30 * (1 - glow * 0.5));
                                fillColor = `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${b})`;
                            }
                        }
                        
                        ctx.fillStyle = fillColor;
                        ctx.beginPath();
                        ctx.moveTo(pts[0].x, pts[0].y);
                        ctx.lineTo(pts[1].x, pts[1].y);
                        ctx.lineTo(pts[2].x, pts[2].y);
                        ctx.lineTo(pts[3].x, pts[3].y);
                        ctx.closePath();
                        ctx.fill();
                        
                        // Add subtle edge lines for better depth perception (not for fluids)
                        if (!isFluid) {
                            ctx.strokeStyle = this.darkenColor(fillColor, 0.7);
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
                
                // Render world boundary forcefield
                if (this.worldBounds) {
                    const bounds = this.worldBounds;
                    const time = Date.now() * 0.003;
                    
                    // Only render forcefield walls that are visible (within render distance)
                    const wallSegments = [];
                    const segmentSize = 5;  // Size of each forcefield segment
                    
                    // Check each boundary wall
                    const walls = [
                        { axis: 'x', value: bounds.minX, dir: 1 },   // West wall
                        { axis: 'x', value: bounds.maxX, dir: -1 },  // East wall
                        { axis: 'z', value: bounds.minZ, dir: 1 },   // North wall
                        { axis: 'z', value: bounds.maxZ, dir: -1 }   // South wall
                    ];
                    
                    for (const wall of walls) {
                        // Check if wall is within render distance
                        let distToWall;
                        if (wall.axis === 'x') {
                            distToWall = Math.abs(camX - wall.value);
                        } else {
                            distToWall = Math.abs(camZ - wall.value);
                        }
                        
                        if (distToWall > renderDist * 1.5) continue;  // Skip walls too far away
                        
                        // Generate forcefield segments for this wall
                        for (let y = bounds.minY; y < bounds.maxY; y += segmentSize) {
                            const perpStart = wall.axis === 'x' ? bounds.minZ : bounds.minX;
                            const perpEnd = wall.axis === 'x' ? bounds.maxZ : bounds.maxX;
                            
                            for (let p = perpStart; p < perpEnd; p += segmentSize) {
                                // Check if segment is within render distance
                                let segX, segZ;
                                if (wall.axis === 'x') {
                                    segX = wall.value;
                                    segZ = p + segmentSize / 2;
                                } else {
                                    segX = p + segmentSize / 2;
                                    segZ = wall.value;
                                }
                                
                                const segDist = Math.sqrt((segX - camX) ** 2 + (segZ - camZ) ** 2);
                                if (segDist > renderDist) continue;
                                
                                // Define quad corners
                                let corners;
                                const yTop = Math.min(y + segmentSize, bounds.maxY);
                                const pEnd = Math.min(p + segmentSize, perpEnd);
                                
                                if (wall.axis === 'x') {
                                    corners = [
                                        [wall.value, y, p],
                                        [wall.value, y, pEnd],
                                        [wall.value, yTop, pEnd],
                                        [wall.value, yTop, p]
                                    ];
                                } else {
                                    corners = [
                                        [p, y, wall.value],
                                        [pEnd, y, wall.value],
                                        [pEnd, yTop, wall.value],
                                        [p, yTop, wall.value]
                                    ];
                                }
                                
                                // Project corners
                                const pts = [];
                                let valid = true;
                                for (const c of corners) {
                                    const pt = project(c[0], c[1], c[2]);
                                    if (!pt) { valid = false; break; }
                                    pts.push(pt);
                                }
                                if (!valid || pts.length < 4) continue;
                                
                                // Calculate animated glow intensity
                                const gridPhase = ((p + y) * 0.2 + time) % (Math.PI * 2);
                                const alpha = 0.15 + 0.1 * Math.sin(gridPhase);
                                
                                // Draw forcefield panel with cyan/magenta energy effect
                                const hue = (time * 30 + p + y) % 360;
                                ctx.fillStyle = `hsla(${180 + Math.sin(time + p * 0.1) * 20}, 100%, 60%, ${alpha})`;
                                ctx.beginPath();
                                ctx.moveTo(pts[0].x, pts[0].y);
                                ctx.lineTo(pts[1].x, pts[1].y);
                                ctx.lineTo(pts[2].x, pts[2].y);
                                ctx.lineTo(pts[3].x, pts[3].y);
                                ctx.closePath();
                                ctx.fill();
                                
                                // Draw grid lines
                                ctx.strokeStyle = `hsla(180, 100%, 70%, ${alpha * 2})`;
                                ctx.lineWidth = 1;
                                ctx.stroke();
                            }
                        }
                    }
                    
                    // Bottom forcefield (floor at minY)
                    const bottomY = bounds.minY;
                    for (let x = bounds.minX; x < bounds.maxX; x += segmentSize) {
                        for (let z = bounds.minZ; z < bounds.maxZ; z += segmentSize) {
                            const segDist = Math.sqrt((x + segmentSize/2 - camX) ** 2 + (z + segmentSize/2 - camZ) ** 2);
                            if (segDist > renderDist) continue;
                            
                            const xEnd = Math.min(x + segmentSize, bounds.maxX);
                            const zEnd = Math.min(z + segmentSize, bounds.maxZ);
                            
                            const corners = [
                                [x, bottomY, z],
                                [xEnd, bottomY, z],
                                [xEnd, bottomY, zEnd],
                                [x, bottomY, zEnd]
                            ];
                            
                            const pts = [];
                            let valid = true;
                            for (const c of corners) {
                                const pt = project(c[0], c[1], c[2]);
                                if (!pt) { valid = false; break; }
                                pts.push(pt);
                            }
                            if (!valid || pts.length < 4) continue;
                            
                            const gridPhase = ((x + z) * 0.2 + time) % (Math.PI * 2);
                            const alpha = 0.1 + 0.08 * Math.sin(gridPhase);
                            
                            ctx.fillStyle = `hsla(${280 + Math.sin(time + x * 0.1) * 20}, 100%, 50%, ${alpha})`;
                            ctx.beginPath();
                            ctx.moveTo(pts[0].x, pts[0].y);
                            ctx.lineTo(pts[1].x, pts[1].y);
                            ctx.lineTo(pts[2].x, pts[2].y);
                            ctx.lineTo(pts[3].x, pts[3].y);
                            ctx.closePath();
                            ctx.fill();
                            
                            ctx.strokeStyle = `hsla(280, 100%, 60%, ${alpha * 2})`;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                }
                
                // Render birds
                for (const bird of this.birds) {
                    // Check if bird is in front of camera
                    const dx = bird.x - camX;
                    const dy = bird.y - camY;
                    const dz = bird.z - camZ;
                    const dot = dx * camDirX + dz * camDirZ;
                    if (dot < 0) continue; // Behind camera
                    
                    const distSq = dx * dx + dy * dy + dz * dz;
                    if (distSq > renderDistSq) continue; // Too far
                    
                    // Project bird center
                    const center = project(bird.x, bird.y, bird.z);
                    if (!center) continue;
                    
                    // Calculate screen size based on distance
                    const screenSize = (bird.size * fov) / center.z;
                    if (screenSize < 2) continue; // Too small to render
                    
                    // Wing flap animation
                    const wingAngle = Math.sin(bird.wingPhase) * 0.5;
                    
                    // Bird facing direction (tangent to circular path)
                    const facingAngle = bird.angle + Math.PI / 2;
                    
                    // Draw bird body (dark pink/magenta for sakura theme)
                    ctx.fillStyle = '#d85a8a';
                    ctx.beginPath();
                    ctx.ellipse(center.x, center.y, screenSize * 0.8, screenSize * 0.4, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw wings
                    ctx.fillStyle = '#ff9ec4';
                    const wingSpan = screenSize * 1.5;
                    const wingHeight = screenSize * 0.6 * (1 + wingAngle);
                    
                    // Left wing
                    ctx.beginPath();
                    ctx.moveTo(center.x, center.y);
                    ctx.quadraticCurveTo(
                        center.x - wingSpan * 0.5, center.y - wingHeight,
                        center.x - wingSpan, center.y + screenSize * 0.2
                    );
                    ctx.quadraticCurveTo(
                        center.x - wingSpan * 0.5, center.y + screenSize * 0.1,
                        center.x, center.y
                    );
                    ctx.fill();
                    
                    // Right wing
                    ctx.beginPath();
                    ctx.moveTo(center.x, center.y);
                    ctx.quadraticCurveTo(
                        center.x + wingSpan * 0.5, center.y - wingHeight,
                        center.x + wingSpan, center.y + screenSize * 0.2
                    );
                    ctx.quadraticCurveTo(
                        center.x + wingSpan * 0.5, center.y + screenSize * 0.1,
                        center.x, center.y
                    );
                    ctx.fill();
                    
                    // Draw head
                    ctx.fillStyle = '#d85a8a';
                    ctx.beginPath();
                    ctx.arc(center.x + screenSize * 0.6, center.y - screenSize * 0.1, screenSize * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Beak
                    ctx.fillStyle = '#ffaa00';
                    ctx.beginPath();
                    ctx.moveTo(center.x + screenSize * 0.9, center.y - screenSize * 0.1);
                    ctx.lineTo(center.x + screenSize * 1.2, center.y);
                    ctx.lineTo(center.x + screenSize * 0.9, center.y + screenSize * 0.1);
                    ctx.fill();
                }
                
                // Render pest birds (smaller, always close to player)
                for (const pest of this.pestBirds) {
                    // Project pest bird
                    const center = project(pest.x, pest.y, pest.z);
                    if (!center) continue;
                    
                    // Calculate screen size (these are smaller)
                    const screenSize = (pest.size * fov) / center.z;
                    if (screenSize < 1) continue;
                    
                    // Frantic wing flap - faster when angry
                    const wingAngle = Math.sin(pest.wingPhase) * 0.7;
                    
                    // Body color - gets redder with anger (0-5 anger levels)
                    const anger = pest.anger || 0;
                    const angerRed = Math.min(255, 107 + anger * 30); // 107 to 255
                    const angerGreen = Math.max(0, 68 - anger * 10);   // 68 to 18
                    const angerBlue = Math.max(0, 35 - anger * 7);     // 35 to 0
                    
                    const isSwooping = pest.state === 'swooping';
                    const bodyColor = anger > 0 
                        ? `rgb(${angerRed}, ${angerGreen}, ${angerBlue})`
                        : (isSwooping ? '#8b4513' : '#6b4423');
                    const wingColor = anger > 0
                        ? `rgb(${Math.min(255, angerRed + 30)}, ${angerGreen + 20}, ${angerBlue + 10})`
                        : (isSwooping ? '#a0522d' : '#8b7355');
                    
                    // Draw body (smaller, rounder - like a sparrow)
                    ctx.fillStyle = bodyColor;
                    ctx.beginPath();
                    ctx.ellipse(center.x, center.y, screenSize * 0.6, screenSize * 0.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Angry glow effect for high anger birds
                    if (anger >= 3) {
                        ctx.shadowColor = '#ff0000';
                        ctx.shadowBlur = anger * 3;
                    }
                    
                    // Draw frantic wings
                    ctx.fillStyle = wingColor;
                    const wingSpan = screenSize * 1.2;
                    const wingHeight = screenSize * 0.8 * (1 + wingAngle);
                    
                    // Left wing
                    ctx.beginPath();
                    ctx.moveTo(center.x, center.y);
                    ctx.quadraticCurveTo(
                        center.x - wingSpan * 0.4, center.y - wingHeight,
                        center.x - wingSpan, center.y
                    );
                    ctx.quadraticCurveTo(
                        center.x - wingSpan * 0.4, center.y + screenSize * 0.2,
                        center.x, center.y
                    );
                    ctx.fill();
                    
                    // Right wing
                    ctx.beginPath();
                    ctx.moveTo(center.x, center.y);
                    ctx.quadraticCurveTo(
                        center.x + wingSpan * 0.4, center.y - wingHeight,
                        center.x + wingSpan, center.y
                    );
                    ctx.quadraticCurveTo(
                        center.x + wingSpan * 0.4, center.y + screenSize * 0.2,
                        center.x, center.y
                    );
                    ctx.fill();
                    
                    // Head
                    ctx.fillStyle = bodyColor;
                    ctx.beginPath();
                    ctx.arc(center.x + screenSize * 0.4, center.y - screenSize * 0.15, screenSize * 0.25, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Beady eye
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc(center.x + screenSize * 0.45, center.y - screenSize * 0.2, screenSize * 0.08, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Small pointy beak
                    ctx.fillStyle = '#ff6600';
                    ctx.beginPath();
                    ctx.moveTo(center.x + screenSize * 0.6, center.y - screenSize * 0.15);
                    ctx.lineTo(center.x + screenSize * 0.85, center.y - screenSize * 0.1);
                    ctx.lineTo(center.x + screenSize * 0.6, center.y - screenSize * 0.05);
                    ctx.fill();
                    
                    // Tail feathers
                    ctx.fillStyle = wingColor;
                    ctx.beginPath();
                    ctx.moveTo(center.x - screenSize * 0.4, center.y);
                    ctx.lineTo(center.x - screenSize * 0.9, center.y - screenSize * 0.1);
                    ctx.lineTo(center.x - screenSize * 0.95, center.y + screenSize * 0.05);
                    ctx.lineTo(center.x - screenSize * 0.85, center.y + screenSize * 0.15);
                    ctx.lineTo(center.x - screenSize * 0.4, center.y + screenSize * 0.1);
                    ctx.fill();
                    
                    // Reset shadow
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = 'transparent';
                }
                
                // Render blue birds
                if (this.blueBirds) {
                    for (const bird of this.blueBirds) {
                        const center = project(bird.x, bird.y, bird.z);
                        if (!center) continue;
                        
                        const screenSize = Math.max(8, 25 / center.z);
                        const wingAngle = Math.sin(bird.wingPhase) * 0.6;
                        const wingHeight = screenSize * 0.5 * (1 + wingAngle);
                        
                        // Blue body
                        ctx.fillStyle = '#1e90ff';
                        ctx.beginPath();
                        ctx.ellipse(center.x, center.y, screenSize * 0.5, screenSize * 0.3, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Wings
                        ctx.fillStyle = '#00bfff';
                        const wingSpan = screenSize * 1.2;
                        ctx.beginPath();
                        ctx.moveTo(center.x, center.y);
                        ctx.quadraticCurveTo(center.x - wingSpan * 0.5, center.y - wingHeight, center.x - wingSpan, center.y);
                        ctx.quadraticCurveTo(center.x - wingSpan * 0.5, center.y + screenSize * 0.2, center.x, center.y);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(center.x, center.y);
                        ctx.quadraticCurveTo(center.x + wingSpan * 0.5, center.y - wingHeight, center.x + wingSpan, center.y);
                        ctx.quadraticCurveTo(center.x + wingSpan * 0.5, center.y + screenSize * 0.2, center.x, center.y);
                        ctx.fill();
                        
                        // Angry eye
                        ctx.fillStyle = '#ff0000';
                        ctx.beginPath();
                        ctx.arc(center.x + screenSize * 0.3, center.y - screenSize * 0.1, screenSize * 0.15, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                // Render fish
                if (this.fish) {
                    for (const fish of this.fish) {
                        const center = project(fish.x, fish.y, fish.z);
                        if (!center) continue;
                        
                        const screenSize = Math.max(4, fish.size * 30 / center.z);
                        const swimOffset = Math.sin(fish.swimPhase) * 0.2;
                        
                        ctx.save();
                        ctx.translate(center.x, center.y);
                        ctx.rotate(Math.atan2(fish.vz, fish.vx) + swimOffset);
                        
                        // Body
                        ctx.fillStyle = fish.color;
                        ctx.beginPath();
                        ctx.ellipse(0, 0, screenSize, screenSize * 0.4, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Tail
                        ctx.beginPath();
                        ctx.moveTo(-screenSize * 0.8, 0);
                        ctx.lineTo(-screenSize * 1.5, -screenSize * 0.4);
                        ctx.lineTo(-screenSize * 1.5, screenSize * 0.4);
                        ctx.closePath();
                        ctx.fill();
                        
                        // Eye
                        ctx.fillStyle = '#000';
                        ctx.beginPath();
                        ctx.arc(screenSize * 0.5, -screenSize * 0.1, screenSize * 0.15, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.restore();
                    }
                }
                
                // Render cats
                if (this.cats) {
                    for (const cat of this.cats) {
                        const center = project(cat.x, cat.y + 0.3, cat.z);
                        if (!center) continue;
                        
                        const screenSize = Math.max(10, 40 / center.z);
                        const walkBob = Math.sin(cat.walkPhase) * screenSize * 0.05;
                        
                        // Body
                        ctx.fillStyle = cat.color;
                        ctx.beginPath();
                        ctx.ellipse(center.x, center.y + walkBob, screenSize * 0.6, screenSize * 0.4, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Head
                        ctx.beginPath();
                        ctx.arc(center.x + screenSize * 0.5, center.y - screenSize * 0.2 + walkBob, screenSize * 0.35, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Ears
                        ctx.beginPath();
                        ctx.moveTo(center.x + screenSize * 0.3, center.y - screenSize * 0.5 + walkBob);
                        ctx.lineTo(center.x + screenSize * 0.4, center.y - screenSize * 0.2 + walkBob);
                        ctx.lineTo(center.x + screenSize * 0.5, center.y - screenSize * 0.5 + walkBob);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(center.x + screenSize * 0.6, center.y - screenSize * 0.5 + walkBob);
                        ctx.lineTo(center.x + screenSize * 0.7, center.y - screenSize * 0.2 + walkBob);
                        ctx.lineTo(center.x + screenSize * 0.5, center.y - screenSize * 0.5 + walkBob);
                        ctx.fill();
                        
                        // Eyes
                        ctx.fillStyle = '#00ff00';
                        ctx.beginPath();
                        ctx.ellipse(center.x + screenSize * 0.4, center.y - screenSize * 0.25 + walkBob, screenSize * 0.08, screenSize * 0.12, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.ellipse(center.x + screenSize * 0.6, center.y - screenSize * 0.25 + walkBob, screenSize * 0.08, screenSize * 0.12, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Tail
                        ctx.strokeStyle = cat.color;
                        ctx.lineWidth = screenSize * 0.1;
                        ctx.lineCap = 'round';
                        ctx.beginPath();
                        ctx.moveTo(center.x - screenSize * 0.5, center.y + walkBob);
                        ctx.quadraticCurveTo(center.x - screenSize * 0.8, center.y - screenSize * 0.3, center.x - screenSize * 0.7, center.y - screenSize * 0.5);
                        ctx.stroke();
                    }
                }
                
                // Render creepers
                if (this.creepers) {
                    for (const creeper of this.creepers) {
                        const center = project(creeper.x, creeper.y + 0.8, creeper.z);
                        if (!center) continue;
                        
                        const screenSize = Math.max(15, 50 / center.z);
                        
                        // Flash white when fusing
                        const bodyColor = (creeper.state === 'fusing' && creeper.flashing) ? '#ffffff' : '#00aa00';
                        
                        // Body (tall rectangle)
                        ctx.fillStyle = bodyColor;
                        ctx.fillRect(center.x - screenSize * 0.3, center.y - screenSize * 0.5, screenSize * 0.6, screenSize);
                        
                        // Head
                        ctx.fillRect(center.x - screenSize * 0.35, center.y - screenSize * 0.9, screenSize * 0.7, screenSize * 0.5);
                        
                        // Face (creepy)
                        ctx.fillStyle = '#000';
                        // Eyes
                        ctx.fillRect(center.x - screenSize * 0.25, center.y - screenSize * 0.8, screenSize * 0.15, screenSize * 0.15);
                        ctx.fillRect(center.x + screenSize * 0.1, center.y - screenSize * 0.8, screenSize * 0.15, screenSize * 0.15);
                        // Mouth (frown)
                        ctx.fillRect(center.x - screenSize * 0.2, center.y - screenSize * 0.55, screenSize * 0.1, screenSize * 0.15);
                        ctx.fillRect(center.x + screenSize * 0.1, center.y - screenSize * 0.55, screenSize * 0.1, screenSize * 0.15);
                        ctx.fillRect(center.x - screenSize * 0.1, center.y - screenSize * 0.5, screenSize * 0.2, screenSize * 0.1);
                        
                        // Legs
                        ctx.fillStyle = bodyColor;
                        ctx.fillRect(center.x - screenSize * 0.3, center.y + screenSize * 0.4, screenSize * 0.2, screenSize * 0.3);
                        ctx.fillRect(center.x + screenSize * 0.1, center.y + screenSize * 0.4, screenSize * 0.2, screenSize * 0.3);
                    }
                }
                
                // Render particles (only those in front of visible blocks)
                for (const p of this.particles) {
                    const center = project(p.x, p.y, p.z);
                    if (!center) continue;
                    
                    // Check if particle is behind a block using simple raycast
                    // Only check bullets since they're the main issue
                    if (p.type === 'bullet') {
                        const dx = p.x - this.camera.x;
                        const dy = p.y - this.camera.y;
                        const dz = p.z - this.camera.z;
                        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                        
                        // Simple occlusion check - sample a few points between camera and bullet
                        let occluded = false;
                        for (let t = 0.3; t < 0.95; t += 0.2) {
                            const checkX = this.camera.x + dx * t;
                            const checkY = this.camera.y + dy * t;
                            const checkZ = this.camera.z + dz * t;
                            const block = this.getBlock(Math.floor(checkX), Math.floor(checkY), Math.floor(checkZ));
                            if (block && !this.fluidBlocks.includes(block)) {
                                occluded = true;
                                break;
                            }
                        }
                        if (occluded) continue;
                        
                        // Bullet trail
                        if (p.trail.length > 1) {
                            ctx.strokeStyle = 'rgba(255, 200, 50, 0.8)';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            let started = false;
                            for (let i = 0; i < p.trail.length; i++) {
                                const tp = project(p.trail[i].x, p.trail[i].y, p.trail[i].z);
                                if (tp) {
                                    if (!started) {
                                        ctx.moveTo(tp.x, tp.y);
                                        started = true;
                                    } else {
                                        ctx.lineTo(tp.x, tp.y);
                                    }
                                }
                            }
                            if (started) {
                                ctx.lineTo(center.x, center.y);
                                ctx.stroke();
                            }
                        }
                        
                        // Bullet head
                        const bulletSize = Math.max(2, 8 / center.z);
                        ctx.fillStyle = '#ffcc00';
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, bulletSize, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (p.type === 'ricochet' || p.type === 'spark') {
                        const size = Math.max(1, (p.size || 3) * 20 / center.z);
                        const alpha = Math.min(1, p.life / 15);
                        ctx.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 50, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, size, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (p.type === 'blessing') {
                        // Divine blessing particles - golden with sparkle
                        const size = Math.max(2, (p.size || 4) * 20 / center.z);
                        const alpha = Math.min(1, p.life / 30);
                        const sparkle = Math.sin(p.life * 0.3) * 0.5 + 0.5;
                        
                        // Outer glow
                        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.3})`;
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, size * 2, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Inner core
                        ctx.fillStyle = `rgba(255, ${200 + sparkle * 55}, ${100 + sparkle * 155}, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, size, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Central bright spot
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * sparkle})`;
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, size * 0.3, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (p.type === 'explosion') {
                        // Creeper explosion particles - fiery orange/yellow
                        const size = Math.max(3, (p.size || 5) * 25 / center.z);
                        const alpha = Math.min(1, p.life / 20);
                        const flicker = Math.random() * 0.3 + 0.7;
                        
                        // Outer fire glow
                        ctx.fillStyle = `rgba(255, 100, 0, ${alpha * 0.4})`;
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, size * 1.5, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Inner fire core
                        ctx.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 0, ${alpha * flicker})`;
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, size, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Hot center
                        ctx.fillStyle = `rgba(255, 255, ${Math.random() * 100}, ${alpha * 0.8})`;
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, size * 0.4, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (p.type === 'feather') {
                        const size = Math.max(2, 15 / center.z);
                        const alpha = Math.min(1, p.life / 20);
                        ctx.save();
                        ctx.translate(center.x, center.y);
                        ctx.rotate(p.rotation);
                        ctx.fillStyle = `rgba(139, 90, 43, ${alpha})`;
                        ctx.beginPath();
                        ctx.ellipse(0, 0, size * 2, size * 0.5, 0, 0, Math.PI * 2);
                        ctx.fill();
                        // Feather spine
                        ctx.strokeStyle = `rgba(100, 60, 30, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(-size * 2, 0);
                        ctx.lineTo(size * 2, 0);
                        ctx.stroke();
                        ctx.restore();
                    } else if (p.type === 'petal') {
                        // Cherry blossom petal - pink and flutter
                        // Check occlusion - don't render petals behind walls
                        const dx = p.x - this.camera.x;
                        const dy = p.y - this.camera.y;
                        const dz = p.z - this.camera.z;
                        let occluded = false;
                        for (let t = 0.2; t < 0.9; t += 0.25) {
                            const checkX = this.camera.x + dx * t;
                            const checkY = this.camera.y + dy * t;
                            const checkZ = this.camera.z + dz * t;
                            const block = this.getBlock(Math.floor(checkX), Math.floor(checkY), Math.floor(checkZ));
                            if (block && !this.fluidBlocks.includes(block)) {
                                occluded = true;
                                break;
                            }
                        }
                        if (occluded) continue;
                        
                        const size = Math.max(2, (p.size || 4) * 15 / center.z);
                        const alpha = Math.min(1, p.life / 50);
                        ctx.save();
                        ctx.translate(center.x, center.y);
                        ctx.rotate(p.rotation);
                        // Petal shape
                        ctx.fillStyle = `rgba(255, 183, 197, ${alpha})`;
                        ctx.beginPath();
                        ctx.ellipse(0, 0, size * 1.5, size * 0.7, 0, 0, Math.PI * 2);
                        ctx.fill();
                        // Darker center
                        ctx.fillStyle = `rgba(255, 150, 170, ${alpha})`;
                        ctx.beginPath();
                        ctx.ellipse(0, 0, size * 0.5, size * 0.3, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    } else if (p.type === 'burger') {
                        // Burger projectile - draw a burger!
                        const size = Math.max(3, (p.size || 8) * 20 / center.z);
                        ctx.save();
                        ctx.translate(center.x, center.y);
                        // Bun top
                        ctx.fillStyle = '#D2691E';
                        ctx.beginPath();
                        ctx.ellipse(0, -size * 0.3, size, size * 0.5, 0, Math.PI, 0);
                        ctx.fill();
                        // Patty
                        ctx.fillStyle = '#654321';
                        ctx.fillRect(-size, -size * 0.2, size * 2, size * 0.4);
                        // Lettuce
                        ctx.fillStyle = '#228B22';
                        ctx.fillRect(-size * 0.9, size * 0.1, size * 1.8, size * 0.15);
                        // Bun bottom
                        ctx.fillStyle = '#DEB887';
                        ctx.beginPath();
                        ctx.ellipse(0, size * 0.3, size, size * 0.4, 0, 0, Math.PI);
                        ctx.fill();
                        ctx.restore();
                    } else if (p.type === 'burgerSplat') {
                        // Burger splatter
                        const size = Math.max(2, (p.size || 4) * 10 / center.z);
                        const alpha = Math.min(1, p.life / 10);
                        const colors = ['#D2691E', '#654321', '#228B22', '#FF6347'];
                        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)].replace(')', `, ${alpha})`).replace('rgb', 'rgba');
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, size, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (p.type === 'apple') {
                        // Apple projectile - draw a red apple
                        const size = Math.max(3, (p.size || 6) * 18 / center.z);
                        ctx.save();
                        ctx.translate(center.x, center.y);
                        // Apple body
                        ctx.fillStyle = '#dc143c';
                        ctx.beginPath();
                        ctx.arc(0, 0, size, 0, Math.PI * 2);
                        ctx.fill();
                        // Highlight
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        ctx.beginPath();
                        ctx.arc(-size * 0.3, -size * 0.3, size * 0.4, 0, Math.PI * 2);
                        ctx.fill();
                        // Stem
                        ctx.fillStyle = '#654321';
                        ctx.fillRect(-1, -size - 3, 2, 4);
                        // Leaf
                        ctx.fillStyle = '#228b22';
                        ctx.beginPath();
                        ctx.ellipse(3, -size - 1, 4, 2, 0.3, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    } else if (p.type === 'appleSplat') {
                        // Apple splatter
                        const size = Math.max(2, (p.size || 3) * 8 / center.z);
                        const alpha = Math.min(1, p.life / 10);
                        ctx.fillStyle = `rgba(220, 20, 60, ${alpha})`;
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                // Render dropped items (with distance culling and occlusion) - 3D block models
                if (this.droppedItems) {
                    const maxItemDistSq = 400; // 20 blocks squared - reduced for performance
                    for (const item of this.droppedItems) {
                        // Distance culling - skip items too far away
                        const dx = item.x - camX;
                        const dy = item.y - camY;
                        const dz = item.z - camZ;
                        const distSq = dx * dx + dy * dy + dz * dz;
                        if (distSq > maxItemDistSq) continue;
                        
                        // Occlusion check - don't render items through walls
                        let occluded = false;
                        const dist = Math.sqrt(distSq);
                        for (let t = 0.15; t < 0.9; t += 0.2) {
                            const checkX = camX + dx * t;
                            const checkY = camY + dy * t;
                            const checkZ = camZ + dz * t;
                            const block = this.getBlock(Math.floor(checkX), Math.floor(checkY), Math.floor(checkZ));
                            if (block && !this.fluidBlocks.includes(block)) {
                                occluded = true;
                                break;
                            }
                        }
                        if (occluded) continue;
                        
                        const bobOffset = Math.sin(item.bobPhase) * 0.1;
                        const center = project(item.x, item.y + bobOffset, item.z);
                        if (!center || center.z <= 0) continue;
                        
                        const baseSize = Math.max(6, 30 / center.z);
                        
                        // Draw 3D item based on type
                        this.drawDroppedItem3D(ctx, center.x, center.y, baseSize, item.type, item.bobPhase);
                        
                        // Count badge if more than 1
                        if (item.count > 1) {
                            ctx.font = `bold ${Math.max(8, baseSize * 0.5)}px monospace`;
                            ctx.fillStyle = '#fff';
                            ctx.strokeStyle = '#000';
                            ctx.lineWidth = 2;
                            ctx.textAlign = 'center';
                            ctx.strokeText(item.count.toString(), center.x + baseSize * 0.5, center.y + baseSize * 0.4);
                            ctx.fillText(item.count.toString(), center.x + baseSize * 0.5, center.y + baseSize * 0.4);
                        }
                    }
                }
                
                // Draw block highlight (targeted block wireframe)
                if (!this.isPaused && this.pointerLocked) {
                    const hit = this.raycast();
                    if (hit && hit.hit) {
                        const bx = hit.hit.x;
                        const by = hit.hit.y;
                        const bz = hit.hit.z;
                        
                        // Define all 8 corners of the block (slightly expanded for visibility)
                        const e = 0.005; // expansion amount
                        const corners = [
                            [bx - e, by - e, bz - e],
                            [bx + 1 + e, by - e, bz - e],
                            [bx + 1 + e, by + 1 + e, bz - e],
                            [bx - e, by + 1 + e, bz - e],
                            [bx - e, by - e, bz + 1 + e],
                            [bx + 1 + e, by - e, bz + 1 + e],
                            [bx + 1 + e, by + 1 + e, bz + 1 + e],
                            [bx - e, by + 1 + e, bz + 1 + e]
                        ];
                        
                        const projected = corners.map(c => project(c[0], c[1], c[2]));
                        
                        // Draw edges if all corners are visible
                        if (projected.every(p => p !== null)) {
                            // Change color based on what we're looking through
                            let strokeColor = 'rgba(0, 0, 0, 0.8)';
                            let lineWidth = 2;
                            
                            if (hit.throughWater) {
                                // Blue tint when looking through water
                                strokeColor = 'rgba(74, 144, 217, 0.7)';
                                lineWidth = 3;
                            } else if (hit.throughLava) {
                                // Orange tint when looking through lava
                                strokeColor = 'rgba(255, 100, 0, 0.7)';
                                lineWidth = 3;
                            }
                            
                            ctx.strokeStyle = strokeColor;
                            ctx.lineWidth = lineWidth;
                            
                            const edges = [
                                [0,1], [1,2], [2,3], [3,0], // back face
                                [4,5], [5,6], [6,7], [7,4], // front face
                                [0,4], [1,5], [2,6], [3,7]  // connecting edges
                            ];
                            
                            ctx.beginPath();
                            for (const [a, b] of edges) {
                                ctx.moveTo(projected[a].x, projected[a].y);
                                ctx.lineTo(projected[b].x, projected[b].y);
                            }
                            ctx.stroke();
                        }
                        
                        // Show tooltip for ritual socket blocks
                        const targetBlock = this.getBlock(bx, by, bz);
                        this.updateBlockTooltip(targetBlock);
                    } else {
                        this.updateBlockTooltip(null);
                    }
                }
                
                // Debug info display
                if (this.debugShowCoords) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    ctx.fillRect(width - 200, 10, 190, 80);
                    ctx.fillStyle = '#0f0';
                    ctx.font = '12px monospace';
                    ctx.textAlign = 'left';
                    ctx.fillText(`X: ${this.camera.x.toFixed(2)}`, width - 190, 28);
                    ctx.fillText(`Y: ${this.camera.y.toFixed(2)}`, width - 190, 43);
                    ctx.fillText(`Z: ${this.camera.z.toFixed(2)}`, width - 190, 58);
                    ctx.fillText(`Blocks: ${Object.keys(this.world).length}`, width - 190, 73);
                    ctx.fillText(`Birds: ${this.pestBirds.length}`, width - 190, 88);
                }
                
                // Player model (first person body when looking down)
                this.renderPlayerModel(ctx, halfW, halfH, width, height);
                
                // Crosshair
                if (!this.isPaused && this.pointerLocked) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(halfW - 10, halfH);
                    ctx.lineTo(halfW + 10, halfH);
                    ctx.moveTo(halfW, halfH - 10);
                    ctx.lineTo(halfW, halfH + 10);
                    ctx.stroke();
                }
                
                // Bird event alert
                if (this.birdEvent && this.birdEvent.alertMessage && this.birdEvent.alertFade > 0) {
                    const alpha = Math.min(1, this.birdEvent.alertFade / 1000);
                    const pulse = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
                    
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    
                    // Background box
                    ctx.fillStyle = `rgba(0, 0, 0, ${0.7 * pulse})`;
                    const alertWidth = Math.min(width * 0.8, 500);
                    const alertHeight = 60;
                    const alertX = (width - alertWidth) / 2;
                    const alertY = 80;
                    
                    ctx.fillRect(alertX, alertY, alertWidth, alertHeight);
                    
                    // Border
                    ctx.strokeStyle = `rgba(255, 100, 100, ${pulse})`;
                    ctx.lineWidth = 3;
                    ctx.strokeRect(alertX, alertY, alertWidth, alertHeight);
                    
                    // Text
                    ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
                    ctx.font = 'bold 20px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.birdEvent.alertMessage, width / 2, alertY + 38);
                    
                    ctx.restore();
                }
                
                // Bird event timer display (small, top right)
                if (this.birdEvent && !this.isPaused) {
                    const timeLeft = Math.max(0, this.birdEvent.timer);
                    const minutes = Math.floor(timeLeft / 60000);
                    const seconds = Math.floor((timeLeft % 60000) / 1000);
                    const timeStr = `🐦 ${minutes}:${seconds.toString().padStart(2, '0')}`;
                    
                    ctx.save();
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(width - 100, 10, 90, 25);
                    ctx.fillStyle = timeLeft < 60000 ? '#ff6666' : '#fff';
                    ctx.font = '14px monospace';
                    ctx.textAlign = 'right';
                    ctx.fillText(timeStr, width - 15, 28);
                    ctx.restore();
                }
                
                // Render AK-47 if selected - Traditional FPS horizontal gun
                if (this.selectedItem === 'ak47' && !this.isPaused) {
                    const s = Math.min(width, height) * 0.0055;
                    
                    // Position gun in lower right corner, pointing left toward center
                    const baseX = width * 0.75;
                    const baseY = height * 0.78;
                    
                    ctx.save();
                    ctx.translate(baseX, baseY);
                    ctx.rotate(-0.1); // Slight upward angle
                    
                    // === HAND (holding grip) ===
                    ctx.fillStyle = '#d4a574';  // Skin tone
                    ctx.beginPath();
                    ctx.ellipse(45 * s, 25 * s, 18 * s, 12 * s, 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    // Fingers wrapped around grip
                    ctx.fillStyle = '#c49a6c';
                    for (let i = 0; i < 4; i++) {
                        ctx.beginPath();
                        ctx.ellipse((35 + i * 7) * s, 35 * s, 4 * s, 8 * s, 0.2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    // Thumb
                    ctx.fillStyle = '#d4a574';
                    ctx.beginPath();
                    ctx.ellipse(30 * s, 15 * s, 6 * s, 10 * s, -0.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // === STOCK (right side, behind receiver) ===
                    ctx.fillStyle = '#5a3d2b';
                    ctx.beginPath();
                    ctx.moveTo(80 * s, -5 * s);
                    ctx.lineTo(160 * s, 0 * s);
                    ctx.lineTo(165 * s, 25 * s);
                    ctx.lineTo(155 * s, 30 * s);
                    ctx.lineTo(80 * s, 25 * s);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Stock wood grain
                    ctx.fillStyle = '#6b4d3b';
                    ctx.fillRect(100 * s, 2 * s, 50 * s, 8 * s);
                    ctx.fillRect(95 * s, 15 * s, 55 * s, 6 * s);
                    
                    // Stock butt plate
                    ctx.fillStyle = '#333';
                    ctx.fillRect(155 * s, -2 * s, 8 * s, 30 * s);
                    
                    // === RECEIVER (main body) ===
                    ctx.fillStyle = '#2a2a2a';
                    ctx.fillRect(-30 * s, -8 * s, 115 * s, 30 * s);
                    
                    // Receiver top cover
                    ctx.fillStyle = '#3a3a3a';
                    ctx.fillRect(-25 * s, -12 * s, 100 * s, 8 * s);
                    
                    // Ejection port
                    ctx.fillStyle = '#1a1a1a';
                    ctx.fillRect(15 * s, -6 * s, 25 * s, 12 * s);
                    
                    // === BARREL & HANDGUARD ===
                    ctx.fillStyle = '#1a1a1a';
                    ctx.fillRect(-140 * s, -4 * s, 115 * s, 14 * s);
                    
                    // Barrel
                    ctx.fillStyle = '#111';
                    ctx.fillRect(-180 * s, 0 * s, 45 * s, 8 * s);
                    
                    // Barrel hole
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.ellipse(-182 * s, 4 * s, 3 * s, 3 * s, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Gas tube
                    ctx.fillStyle = '#333';
                    ctx.fillRect(-130 * s, -10 * s, 100 * s, 5 * s);
                    
                    // Handguard ventilation holes
                    ctx.fillStyle = '#111';
                    for (let i = 0; i < 4; i++) {
                        ctx.beginPath();
                        ctx.ellipse((-120 + i * 22) * s, 3 * s, 6 * s, 3 * s, 0, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // === FRONT SIGHT ===
                    ctx.fillStyle = '#1a1a1a';
                    ctx.fillRect(-145 * s, -20 * s, 6 * s, 18 * s);
                    ctx.fillRect(-148 * s, -22 * s, 12 * s, 4 * s);
                    
                    // === REAR SIGHT ===
                    ctx.fillRect(-5 * s, -18 * s, 15 * s, 8 * s);
                    
                    // === MAGAZINE (curved) ===
                    ctx.fillStyle = '#333';
                    ctx.beginPath();
                    ctx.moveTo(10 * s, 22 * s);
                    ctx.lineTo(35 * s, 22 * s);
                    ctx.quadraticCurveTo(45 * s, 50 * s, 35 * s, 80 * s);
                    ctx.lineTo(15 * s, 85 * s);
                    ctx.quadraticCurveTo(5 * s, 55 * s, 10 * s, 22 * s);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Magazine ridges
                    ctx.strokeStyle = '#222';
                    ctx.lineWidth = 1.5 * s;
                    for (let i = 0; i < 4; i++) {
                        ctx.beginPath();
                        ctx.moveTo((12 + i * 2) * s, (35 + i * 12) * s);
                        ctx.lineTo((32 + i * 1) * s, (38 + i * 12) * s);
                        ctx.stroke();
                    }
                    
                    // === GRIP ===
                    ctx.fillStyle = '#5a3d2b';
                    ctx.beginPath();
                    ctx.moveTo(45 * s, 22 * s);
                    ctx.lineTo(65 * s, 22 * s);
                    ctx.lineTo(70 * s, 65 * s);
                    ctx.lineTo(45 * s, 70 * s);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Grip texture
                    ctx.fillStyle = '#4a2d1b';
                    for (let i = 0; i < 5; i++) {
                        ctx.fillRect(50 * s, (28 + i * 8) * s, 12 * s, 3 * s);
                    }
                    
                    // === TRIGGER GUARD ===
                    ctx.strokeStyle = '#2a2a2a';
                    ctx.lineWidth = 3 * s;
                    ctx.beginPath();
                    ctx.arc(25 * s, 35 * s, 15 * s, -0.8, 2.2);
                    ctx.stroke();
                    
                    // Trigger
                    ctx.fillStyle = '#222';
                    ctx.fillRect(22 * s, 28 * s, 4 * s, 12 * s);
                    
                    // === MUZZLE FLASH ===
                    if (this.muzzleFlash > 0) {
                        const flashSize = 25 + Math.random() * 20;
                        const flashX = -190 * s;
                        const flashY = 4 * s;
                        
                        // Outer glow
                        ctx.fillStyle = 'rgba(255, 100, 0, 0.5)';
                        ctx.beginPath();
                        ctx.arc(flashX, flashY, flashSize * s * 1.5, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Orange middle
                        ctx.fillStyle = 'rgba(255, 150, 0, 0.8)';
                        ctx.beginPath();
                        ctx.arc(flashX, flashY, flashSize * s, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Yellow core
                        ctx.fillStyle = '#ffff00';
                        ctx.beginPath();
                        ctx.arc(flashX, flashY, flashSize * s * 0.4, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Flash spikes pointing left (toward screen center)
                        ctx.strokeStyle = '#ffff88';
                        ctx.lineWidth = 2;
                        for (let i = 0; i < 6; i++) {
                            const angle = Math.PI + (Math.random() - 0.5) * 1.5;
                            const len = (20 + Math.random() * 35) * s;
                            ctx.beginPath();
                            ctx.moveTo(flashX, flashY);
                            ctx.lineTo(flashX + Math.cos(angle) * len, flashY + Math.sin(angle) * len);
                            ctx.stroke();
                        }
                    }
                    
                    ctx.restore();
                }
                
                // Fluid overlay effects - only when HEAD is submerged
                if (this.headSubmergedWater) {
                    // Blue tint when head is underwater
                    ctx.fillStyle = 'rgba(0, 100, 200, 0.25)';
                    ctx.fillRect(0, 0, width, height);
                }
                
                if (this.headSubmergedLava) {
                    // Intense orange/red overlay with animated flames
                    const time = Date.now() * 0.005;
                    
                    // Base lava tint
                    ctx.fillStyle = 'rgba(255, 80, 0, 0.4)';
                    ctx.fillRect(0, 0, width, height);
                    
                    // Animated flame edges
                    ctx.fillStyle = 'rgba(255, 50, 0, 0.6)';
                    
                    // Bottom flames
                    for (let i = 0; i < 12; i++) {
                        const x = (i / 12) * width;
                        const flameHeight = 60 + Math.sin(time + i * 0.8) * 30 + Math.sin(time * 1.5 + i) * 20;
                        ctx.beginPath();
                        ctx.moveTo(x - 30, height);
                        ctx.quadraticCurveTo(x, height - flameHeight, x + 30, height);
                        ctx.fill();
                    }
                    
                    // Top flames (dripping down)
                    ctx.fillStyle = 'rgba(255, 100, 0, 0.5)';
                    for (let i = 0; i < 8; i++) {
                        const x = (i / 8) * width + 40;
                        const flameHeight = 40 + Math.sin(time * 0.8 + i * 1.2) * 25;
                        ctx.beginPath();
                        ctx.moveTo(x - 25, 0);
                        ctx.quadraticCurveTo(x, flameHeight, x + 25, 0);
                        ctx.fill();
                    }
                    
                    // Side flames
                    ctx.fillStyle = 'rgba(255, 60, 0, 0.5)';
                    for (let i = 0; i < 6; i++) {
                        const y = (i / 6) * height;
                        const flameWidth = 40 + Math.sin(time + i) * 20;
                        // Left side
                        ctx.beginPath();
                        ctx.moveTo(0, y - 30);
                        ctx.quadraticCurveTo(flameWidth, y, 0, y + 30);
                        ctx.fill();
                        // Right side
                        ctx.beginPath();
                        ctx.moveTo(width, y - 30);
                        ctx.quadraticCurveTo(width - flameWidth, y, width, y + 30);
                        ctx.fill();
                    }
                    
                    // Vignette effect
                    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.7);
                    gradient.addColorStop(0, 'rgba(255, 50, 0, 0)');
                    gradient.addColorStop(0.7, 'rgba(255, 30, 0, 0.3)');
                    gradient.addColorStop(1, 'rgba(200, 0, 0, 0.6)');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, width, height);
                }
            },
            
            project(x: number, y: number, z: number) {
                const dx = x - this.camera.x;
                const dy = y - this.camera.y;
                const dz = z - this.camera.z;
                
                const cosY = Math.cos(-this.camera.rotY);
                const sinY = Math.sin(-this.camera.rotY);
                const rx = dx * cosY - dz * sinY;
                const rz = dx * sinY + dz * cosY;
                
                const cosX = Math.cos(-this.camera.rotX);
                const sinX = Math.sin(-this.camera.rotX);
                const ry = dy * cosX - rz * sinX;
                const finalZ = dy * sinX + rz * cosX;
                
                if (finalZ <= 0.1) return null;
                
                const fov = 400;
                const screenX = this.canvas.width / 2 + (rx / finalZ) * fov;
                const screenY = this.canvas.height / 2 - (ry / finalZ) * fov;
                
                return { x: screenX, y: screenY, z: finalZ };
            },
            
            // Update block tooltip display
            updateBlockTooltip(blockType) {
                const tooltip = document.getElementById('blockTooltip');
                if (!tooltip) return;
                
                const socketInfo = {
                    'petalSocket': { name: 'Petal Socket', item: 'Requires: Sakura Petal', desc: 'Place a cherry blossom petal here' },
                    'ropeSocket': { name: 'Rope Socket', item: 'Requires: Sacred Rope', desc: 'Place a shimenawa rope here' },
                    'charmSocket': { name: 'Charm Socket', item: 'Requires: Omamori', desc: 'Place the protective charm here' },
                    'plaqueSocket': { name: 'Plaque Socket', item: 'Requires: Wish Plaque', desc: 'Place a wooden ema here' },
                    'incenseSocket': { name: 'Incense Socket', item: 'Requires: Incense', desc: 'Place purifying incense here' },
                    'petalSocketFilled': { name: 'Petal Socket ✓', item: 'FILLED', desc: 'Cherry petal placed!' },
                    'ropeSocketFilled': { name: 'Rope Socket ✓', item: 'FILLED', desc: 'Sacred rope placed!' },
                    'charmSocketFilled': { name: 'Charm Socket ✓', item: 'FILLED', desc: 'Charm placed!' },
                    'plaqueSocketFilled': { name: 'Plaque Socket ✓', item: 'FILLED', desc: 'Wish plaque placed!' },
                    'incenseSocketFilled': { name: 'Incense Socket ✓', item: 'FILLED', desc: 'Incense placed!' }
                };
                
                const info = blockType ? socketInfo[blockType] : null;
                if (info) {
                    tooltip.classList.add('active');
                    tooltip.querySelector('.tooltip-title')!.textContent = info.name;
                    const isFilled = info.item === 'FILLED';
                    tooltip.querySelector('.tooltip-desc')!.innerHTML = 
                        `<span style="color:${isFilled ? '#4f4' : '#ffd700'}">${info.item}</span><br>${info.desc}`;
                } else {
                    tooltip.classList.remove('active');
                }
            },
            
            // Render player model (first-person body visible when looking down)
            renderPlayerModel(ctx, centerX, centerY, width, height) {
                // Only show body when looking down
                const lookDownAmount = Math.max(0, this.camera.rotX * 2); // 0 to 1 as player looks down
                if (lookDownAmount < 0.05) {
                    // Always show hands with held item even when not looking down
                    this.renderHeldItem(ctx, centerX, centerY, width, height);
                    return;
                }
                
                const alpha = Math.min(1, lookDownAmount);
                
                ctx.save();
                
                // Body position based on look angle
                const bodyY = height - 50 + (1 - lookDownAmount) * 200;
                
                // Draw the 3D body with shading
                this.drawPlayerBody3D(ctx, centerX, bodyY, alpha, lookDownAmount);
                
                ctx.restore();
                
                // Always render held item
                this.renderHeldItem(ctx, centerX, centerY, width, height);
            },
            
            // Render held item in first person
            renderHeldItem(ctx, centerX, centerY, width, height) {
                const slot = this.inventory.hotbar[this.selectedSlot];
                if (!slot) return;
                
                const itemId = slot.id;
                const bobOffset = Math.sin(Date.now() * 0.003) * 3;
                
                // Hand position (bottom right of screen)
                const handX = width - 120;
                const handY = height - 100 + bobOffset;
                const size = 60;
                
                ctx.save();
                ctx.translate(handX, handY);
                ctx.rotate(-0.2); // Slight tilt
                
                // Draw hand
                ctx.fillStyle = '#ffdab9'; // Skin tone
                ctx.beginPath();
                ctx.ellipse(0, 20, 25, 35, 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw item based on type
                const colors = this.blockColors[itemId];
                
                if (colors) {
                    // Block item - draw 3D cube
                    const s = size * 0.5;
                    ctx.translate(0, -10);
                    
                    // Top face
                    ctx.fillStyle = colors.top;
                    ctx.beginPath();
                    ctx.moveTo(0, -s);
                    ctx.lineTo(s, -s/2);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(-s, -s/2);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Left face
                    ctx.fillStyle = colors.side;
                    ctx.beginPath();
                    ctx.moveTo(-s, -s/2);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(0, s);
                    ctx.lineTo(-s, s/2);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Right face
                    ctx.fillStyle = this.darkenColor(colors.side, 0.7);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(s, -s/2);
                    ctx.lineTo(s, s/2);
                    ctx.lineTo(0, s);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Non-block item
                    if (itemId === 'ak47') {
                        ctx.fillStyle = '#333';
                        ctx.fillRect(-30, -20, 80, 15);
                        ctx.fillStyle = '#8b4513';
                        ctx.fillRect(-10, -5, 25, 25);
                        ctx.fillStyle = '#222';
                        ctx.fillRect(10, -5, 8, 20);
                    } else if (itemId === 'berdger') {
                        // Burger
                        ctx.fillStyle = '#daa520';
                        ctx.beginPath();
                        ctx.ellipse(0, -15, 25, 12, 0, Math.PI, 0);
                        ctx.fill();
                        ctx.fillStyle = '#8b4513';
                        ctx.fillRect(-22, -8, 44, 10);
                        ctx.fillStyle = '#228b22';
                        ctx.fillRect(-20, 0, 40, 5);
                        ctx.fillStyle = '#daa520';
                        ctx.beginPath();
                        ctx.ellipse(0, 10, 23, 10, 0, 0, Math.PI);
                        ctx.fill();
                    } else if (itemId === 'apple') {
                        ctx.fillStyle = '#dc143c';
                        ctx.beginPath();
                        ctx.arc(0, -5, 20, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = '#654321';
                        ctx.fillRect(-2, -30, 4, 10);
                        ctx.fillStyle = '#228b22';
                        ctx.beginPath();
                        ctx.ellipse(5, -28, 8, 4, 0.5, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (itemId === 'water_bucket' || itemId === 'lava_bucket') {
                        ctx.fillStyle = '#888';
                        ctx.beginPath();
                        ctx.moveTo(-20, -25);
                        ctx.lineTo(20, -25);
                        ctx.lineTo(15, 15);
                        ctx.lineTo(-15, 15);
                        ctx.closePath();
                        ctx.fill();
                        ctx.fillStyle = itemId === 'water_bucket' ? '#4a90d9' : '#ff6600';
                        ctx.fillRect(-15, -15, 30, 25);
                    } else if (itemId === 'seeds') {
                        ctx.fillStyle = '#daa520';
                        for (let i = 0; i < 5; i++) {
                            ctx.beginPath();
                            ctx.ellipse(Math.cos(i) * 10, Math.sin(i) * 8 - 10, 4, 6, i, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
                
                ctx.restore();
            },
            
            // Draw the player body in 3D style with shading
            drawPlayerBody3D(ctx, centerX, bodyY, alpha, lookAmount) {
                ctx.save();
                
                // 3D depth effect - darker on edges
                const edgeShade = 0.7;
                
                // Torso - cherry blossom pink themed with 3D shading
                const gradient = ctx.createLinearGradient(centerX - 50, bodyY, centerX + 50, bodyY);
                gradient.addColorStop(0, `rgba(180, 130, 150, ${alpha})`);
                gradient.addColorStop(0.3, `rgba(255, 183, 197, ${alpha})`);
                gradient.addColorStop(0.7, `rgba(255, 183, 197, ${alpha})`);
                gradient.addColorStop(1, `rgba(180, 130, 150, ${alpha})`);
                ctx.fillStyle = gradient;
                
                // Draw torso as trapezoid with rounded corners
                ctx.beginPath();
                ctx.moveTo(centerX - 35, bodyY + 5);
                ctx.lineTo(centerX + 35, bodyY + 5);
                ctx.quadraticCurveTo(centerX + 50, bodyY + 40, centerX + 45, bodyY + 80);
                ctx.lineTo(centerX - 45, bodyY + 80);
                ctx.quadraticCurveTo(centerX - 50, bodyY + 40, centerX - 35, bodyY + 5);
                ctx.closePath();
                ctx.fill();
                
                // Collar V-neck
                ctx.fillStyle = `rgba(255, 240, 245, ${alpha * 0.8})`;
                ctx.beginPath();
                ctx.moveTo(centerX - 20, bodyY + 5);
                ctx.lineTo(centerX, bodyY + 25);
                ctx.lineTo(centerX + 20, bodyY + 5);
                ctx.closePath();
                ctx.fill();
                
                // Arms with 3D shading
                const armGradient = ctx.createRadialGradient(centerX - 55, bodyY + 30, 0, centerX - 55, bodyY + 30, 30);
                armGradient.addColorStop(0, `rgba(255, 228, 205, ${alpha})`);
                armGradient.addColorStop(1, `rgba(220, 180, 160, ${alpha})`);
                ctx.fillStyle = armGradient;
                ctx.beginPath();
                ctx.ellipse(centerX - 52, bodyY + 35, 14, 28, -0.2, 0, Math.PI * 2);
                ctx.fill();
                
                const armGradient2 = ctx.createRadialGradient(centerX + 55, bodyY + 30, 0, centerX + 55, bodyY + 30, 30);
                armGradient2.addColorStop(0, `rgba(255, 228, 205, ${alpha})`);
                armGradient2.addColorStop(1, `rgba(220, 180, 160, ${alpha})`);
                ctx.fillStyle = armGradient2;
                ctx.beginPath();
                ctx.ellipse(centerX + 52, bodyY + 35, 14, 28, 0.2, 0, Math.PI * 2);
                ctx.fill();
                
                // Hands
                ctx.fillStyle = `rgba(255, 218, 195, ${alpha})`;
                ctx.beginPath();
                ctx.arc(centerX - 55, bodyY + 60, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX + 55, bodyY + 60, 12, 0, Math.PI * 2);
                ctx.fill();
                
                // Legs with jeans texture effect
                const jeansGradient = ctx.createLinearGradient(centerX - 40, bodyY + 75, centerX + 40, bodyY + 75);
                jeansGradient.addColorStop(0, `rgba(50, 70, 100, ${alpha})`);
                jeansGradient.addColorStop(0.3, `rgba(70, 90, 120, ${alpha})`);
                jeansGradient.addColorStop(0.7, `rgba(70, 90, 120, ${alpha})`);
                jeansGradient.addColorStop(1, `rgba(50, 70, 100, ${alpha})`);
                ctx.fillStyle = jeansGradient;
                
                // Left leg
                ctx.beginPath();
                ctx.roundRect(centerX - 38, bodyY + 78, 28, 55, 3);
                ctx.fill();
                
                // Right leg
                ctx.beginPath();
                ctx.roundRect(centerX + 10, bodyY + 78, 28, 55, 3);
                ctx.fill();
                
                // Boots with shine
                ctx.fillStyle = `rgba(100, 60, 30, ${alpha})`;
                ctx.beginPath();
                ctx.roundRect(centerX - 42, bodyY + 128, 35, 20, 4);
                ctx.fill();
                ctx.beginPath();
                ctx.roundRect(centerX + 7, bodyY + 128, 35, 20, 4);
                ctx.fill();
                
                // Boot shine
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
                ctx.beginPath();
                ctx.ellipse(centerX - 30, bodyY + 133, 8, 3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(centerX + 20, bodyY + 133, 8, 3, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            },
            
            darkenColor(hex, factor) {
                // Use cache to avoid repeated hex parsing
                const key = hex + factor;
                if (!this.colorCache) this.colorCache = {};
                if (this.colorCache[key]) return this.colorCache[key];
                
                const r = Math.floor(parseInt(hex.slice(1, 3), 16) * factor);
                const g = Math.floor(parseInt(hex.slice(3, 5), 16) * factor);
                const b = Math.floor(parseInt(hex.slice(5, 7), 16) * factor);
                const result = `rgb(${r},${g},${b})`;
                this.colorCache[key] = result;
                return result;
            },
            
            gameLoop(timestamp) {
                // Completely stop loop when game is inactive
                if (!this.isActive) {
                    this.gameLoopId = null;
                    return;
                }
                
                // Initialize lastFrameTime if needed
                if (!this.lastFrameTime) this.lastFrameTime = timestamp;
                
                // Calculate frame interval based on target FPS
                const targetInterval = 1000 / this.settings.targetFps;
                const elapsed = timestamp - this.lastFrameTime;
                
                // Only update if enough time has passed for target FPS
                if (elapsed >= targetInterval) {
                    this.lastFrameTime = timestamp - (elapsed % targetInterval);
                    
                    // Update FPS counter
                    this.fpsCounter.frames++;
                    if (timestamp - this.fpsCounter.lastTime >= 1000) {
                        this.fpsCounter.fps = this.fpsCounter.frames;
                        this.fpsCounter.frames = 0;
                        this.fpsCounter.lastTime = timestamp;
                        
                        // Update debug console FPS
                        const debugFps = document.getElementById('debugFps');
                        if (debugFps) {
                            debugFps.textContent = `${this.fpsCounter.fps} FPS`;
                        }
                    }
                    
                    // Only update physics if not paused
                    if (!this.isPaused) {
                        this.update();
                        this.updateBirds();
                        this.updateParticles();
                        this.updateFluids();  // Fluid spreading simulation
                        this.updateWind();    // Wind dynamics
                        this.updatePetals();  // Cherry blossom petals
                        this.updateDroppedItems();  // Ground items
                        this.render();
                        
                        // Render FPS counter
                        if (this.settings.showFps) {
                            this.ctx!.fillStyle = 'rgba(0, 0, 0, 0.5)';
                            this.ctx!.fillRect(this.canvas.width - 70, this.canvas.height - 25, 65, 20);
                            this.ctx!.fillStyle = '#00ff00';
                            this.ctx!.font = '12px monospace';
                            this.ctx!.textAlign = 'right';
                            this.ctx!.fillText(`${this.fpsCounter.fps} FPS`, this.canvas.width - 10, this.canvas.height - 10);
                            this.ctx!.textAlign = 'left';
                        }
                    }
                }
                
                // Store the ID so we can cancel it on stop
                this.gameLoopId = requestAnimationFrame((ts) => this.gameLoop(ts));
            },
            
            start() {
                // Initialize world on first start (deferred from page load)
                this.fullInit();
                
                this.isActive = true;
                this.isPaused = false;
                this.pointerLocked = false;
                this.stats = { blocksPlaced: 0, blocksBroken: 0, distance: 0, jumps: 0, startTime: Date.now() };
                document.getElementById('minecraftGame')!.classList.add('active');
                document.getElementById('pauseMenu')!.classList.remove('active');
                document.getElementById('gameUI')!.style.display = 'flex';
                
                // Find safe spawn location using a spiral search
                const findSafeSpawn = () => {
                    const preferredX = 0;
                    const preferredZ = -8;
                    
                    // Helper to check if a position is safe for spawning
                    const isSpawnSafe = (x, z) => {
                        // Find ground level
                        let groundY = null;
                        for (let checkY = 40; checkY >= 0; checkY--) {
                            const block = this.getBlock(x, checkY, z);
                            if (block && block !== 'water' && block !== 'lava') {
                                groundY = checkY;
                                break;
                            }
                        }
                        
                        if (groundY === null) return null; // No ground found
                        
                        const feetY = groundY + 1;
                        const bodyY = groundY + 2;
                        const headY = groundY + 3;
                        
                        // Check if there's space for the player (2 blocks of air above ground)
                        const feetBlock = this.getBlock(x, feetY, z);
                        const bodyBlock = this.getBlock(x, bodyY, z);
                        
                        // Both spaces must be empty or fluid (can spawn in water but not in solid)
                        const feetClear = !feetBlock || feetBlock === 'water' || feetBlock === 'lava';
                        const bodyClear = !bodyBlock || bodyBlock === 'water' || bodyBlock === 'lava';
                        
                        // Prefer spawning on dry land
                        const groundBlock = this.getBlock(x, groundY, z);
                        const isDryLand = groundBlock !== 'water' && groundBlock !== 'lava' && groundBlock !== 'sand';
                        
                        if (feetClear && bodyClear) {
                            return {
                                x: x,
                                y: feetY + this.playerEyeHeight,
                                z: z,
                                priority: isDryLand ? 1 : 2 // Prefer dry land
                            };
                        }
                        
                        return null;
                    };
                    
                    // Try preferred location first
                    let bestSpawn = isSpawnSafe(preferredX, preferredZ);
                    if (bestSpawn && bestSpawn.priority === 1) {
                        return bestSpawn;
                    }
                    
                    // Spiral search outward from preferred location
                    const maxRadius = 30;
                    for (let radius = 1; radius <= maxRadius; radius++) {
                        for (let dx = -radius; dx <= radius; dx++) {
                            for (let dz = -radius; dz <= radius; dz++) {
                                // Only check perimeter of current radius
                                if (Math.abs(dx) !== radius && Math.abs(dz) !== radius) continue;
                                
                                const spawn = isSpawnSafe(preferredX + dx, preferredZ + dz);
                                if (spawn) {
                                    if (spawn.priority === 1) {
                                        return spawn; // Found perfect spot
                                    }
                                    if (!bestSpawn || spawn.priority < bestSpawn.priority) {
                                        bestSpawn = spawn;
                                    }
                                }
                            }
                        }
                        
                        // If we found something decent, use it
                        if (bestSpawn && radius > 5) {
                            return bestSpawn;
                        }
                    }
                    
                    // Fallback - spawn high in the sky
                    return { x: 0, y: 30, z: 0 };
                };
                
                const spawnPos = findSafeSpawn();
                this.camera = { x: spawnPos.x + 0.5, y: spawnPos.y, z: spawnPos.z + 0.5, rotX: -0.3, rotY: 0 };
                this.canvas.style.filter = '';
                
                // Reset player state
                this.velocity = { x: 0, y: 0, z: 0 };
                this.isJumping = false;
                this.inWater = false;
                this.inLava = false;
                this.swimming = false;
                this.headSubmergedWater = false;
                this.headSubmergedLava = false;
                
                // Clear any lingering particles/fluids from previous session
                this.particles = [];
                this.fluidUpdates = [];
                
                // Initialize bird event system
                this.birdEvent = {
                    timer: 5 * 60 * 1000, // 5 minutes in ms
                    lastUpdate: Date.now(),
                    currentEvent: 0,
                    events: [
                        {
                            name: 'SWARM',
                            description: 'the birds will swarm!',
                            action: () => this.triggerBirdSwarm()
                        },
                        {
                            name: 'RAGE',
                            description: 'the birds will rage!',
                            action: () => this.triggerBirdRage()
                        },
                        {
                            name: 'MULTIPLY',
                            description: 'the birds will multiply!',
                            action: () => this.triggerBirdMultiply()
                        },
                        {
                            name: 'CREEPER INVASION',
                            description: 'creepers will stalk you!',
                            action: () => this.triggerCreeperInvasion()
                        }
                    ],
                    alertShown: { five: false, three: false, one: false, thirty: false, ten: false },
                    alertMessage: null,
                    alertFade: 0
                };
                
                // Initialize survival game stats
                this.survivalStats = {
                    score: 0,
                    wave: 1,
                    birdsDefeated: 0,
                    objectiveTimer: 0,
                    currentObjective: null,
                    objectives: [
                        { text: 'Survive the bird apocalypse!', type: 'survive' },
                        { text: 'Find the Ritual Temple', type: 'find_temple' },
                        { text: 'Collect 5 apples', type: 'collect', item: 'apple', count: 5 },
                        { text: 'Knock back 10 birds', type: 'knockback', count: 10 },
                        { text: 'Complete the Omamori ritual', type: 'ritual' }
                    ]
                };
                this.survivalStats.currentObjective = this.survivalStats.objectives[0];
                this.updateSurvivalHUD();
                
                // Hide main site animations to save GPU compositing
                const petalCanvas = document.getElementById('petalCanvas');
                if (petalCanvas) petalCanvas.style.display = 'none';
                
                // Hide flame particles container
                const flameParticles = document.getElementById('flameParticles');
                if (flameParticles) flameParticles.style.visibility = 'hidden';
                
                // Lock page scrolling while game is active
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                
                // Show click-to-play - user must click to lock pointer
                document.getElementById('clickToPlay')!.classList.add('active');
                
                // Start game loop (cancel any existing one first)
                if (this.gameLoopId) {
                    cancelAnimationFrame(this.gameLoopId);
                }
                
                // Force hotbar refresh with delay to ensure DOM is ready
                setTimeout(() => {
                    this.updateHotbarDisplay();
                    this.updateHotbar();
                }, 50);
                
                this.gameLoop();
            },
            
            pause() {
                if (!this.isActive) return;
                this.isPaused = true;
                document.getElementById('pauseMenu')!.classList.add('active');
                document.getElementById('gameUI')!.style.display = 'none';
                document.getElementById('clickToPlay')!.classList.remove('active');
                this.showSubmenu('menuMain');
                
                // Exit pointer lock if still locked
                if (document.pointerLockElement) {
                    document.exitPointerLock();
                }
            },
            
            resume() {
                this.isPaused = false;
                document.getElementById('pauseMenu')!.classList.remove('active');
                document.getElementById('gameUI')!.style.display = 'flex';
                
                // Must show click-to-play because we need a new user gesture to re-lock
                // (Browser security: can't re-lock immediately after ESC release)
                document.getElementById('clickToPlay')!.classList.add('active');
            },
            
            updateFullscreenButton() {
                const btn = document.getElementById('btnFullscreen');
                const isFs = document.fullscreenElement || document.webkitFullscreenElement;
                btn.textContent = isFs ? 'Windowed' : 'Fullscreen';
                
                // Update canvas size based on fullscreen state
                if (isFs) {
                    this.canvas.width = window.innerWidth;
                    this.canvas.height = window.innerHeight;
                } else {
                    this.canvas.width = 800;
                    this.canvas.height = 450;
                }
            },
            
            stop() {
                // Cancel any pending animation frame
                if (this.gameLoopId) {
                    cancelAnimationFrame(this.gameLoopId);
                    this.gameLoopId = null;
                }
                
                this.isActive = false;
                this.isPaused = false;
                this.pointerLocked = false;
                
                // Clear runtime resources to free memory
                this.particles = [];
                this.fluidUpdates = [];
                this.fluidUpdateTimer = 0;
                this.birdPruneTimer = 0;
                this.inWater = false;
                this.inLava = false;
                this.swimming = false;
                this.headSubmergedWater = false;
                this.headSubmergedLava = false;
                
                // Reset pest bird anger (calm down for next session)
                if (this.pestBirds) {
                    for (const pest of this.pestBirds) {
                        pest.anger = 0;
                        pest.timesShot = 0;
                        pest.state = 'circling';
                    }
                }
                
                // Reset canvas
                this.canvas.width = 800;
                this.canvas.height = 450;
                
                // Clear the canvas to free GPU memory
                this.ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Hide UI elements
                document.getElementById('minecraftGame')!.classList.remove('active');
                document.getElementById('pauseMenu')!.classList.remove('active');
                document.getElementById('clickToPlay')!.classList.remove('active');
                document.getElementById('inventoryScreen')!.classList.remove('active');
                this.inventoryOpen = false;
                this.canvas.style.filter = '';
                
                // Exit pointer lock
                if (document.pointerLockElement) {
                    document.exitPointerLock();
                }
                
                // Exit fullscreen if active
                if (document.fullscreenElement || document.webkitFullscreenElement) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
                
                // Reset key states to prevent stuck keys
                this.keys = {};
                
                // Unlock page scrolling
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                
                // Restore main site animations
                const petalCanvas = document.getElementById('petalCanvas');
                if (petalCanvas) petalCanvas.style.display = 'block';
                
                // Show flame particles container
                const flameParticles = document.getElementById('flameParticles');
                if (flameParticles) flameParticles.style.visibility = 'visible';
            }
};

/**
 * SakuraCraftGame Class
 * Provides a typed class-based interface to the game
 */
export class SakuraCraftGame {
  private _game: ISakuraCraftEngine & Record<string, any>;
  private _initialized: boolean;

  constructor() {
    this._game = minecraftGame;
    this._initialized = false;
  }

  /**
   * Initialize the game with options
   */
  init(options: SakuraCraftInitOptions = {}): this {
    // Inject HTML if not present
    if (!document.getElementById('minecraftGame')!) {
      let container: HTMLElement = document.body;
      if (options.container) {
        container = typeof options.container === 'string'
          ? (document.querySelector(options.container) as HTMLElement) || document.body
          : options.container;
      }
      injectGameHTML(container);
    }
    
    // Initialize the game engine
    this._game.init();
    this._initialized = true;
    
    // Setup trigger element
    if (options.trigger) {
      const triggerEl = typeof options.trigger === 'string'
        ? document.querySelector(options.trigger) as HTMLElement | null
        : options.trigger;
      if (triggerEl) {
        triggerEl.addEventListener('click', () => this.start());
        triggerEl.style.cursor = 'pointer';
      }
    }
    
    // Setup close button
    document.getElementById('closeMinecraft')!?.addEventListener('click', () => this.stop());
    
    // Setup click to play
    document.getElementById('clickToPlay')!?.addEventListener('click', () => {
      if (this._game.isActive && !this._game.isPaused && this._game.canvas) {
        this._game.canvas.requestPointerLock();
      }
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (this._game.isActive) this.stop();
    });
    
    return this;
  }

  /**
   * Start the game
   */
  start(): this {
    if (!this._initialized) {
      this.init();
    }
    this._game.start();
    return this;
  }

  /**
   * Stop the game
   */
  stop(): this {
    this._game.stop();
    return this;
  }

  /**
   * Pause the game
   */
  pause(): this {
    this._game.pause();
    return this;
  }

  /**
   * Resume the game
   */
  resume(): this {
    this._game.resume();
    return this;
  }

  /**
   * Get game stats
   */
  getStats(): GameStats {
    return { ...this._game.stats };
  }

  /**
   * Get game settings
   */
  get settings(): GameSettings {
    return this._game.settings;
  }

  /**
   * Update game settings
   */
  set settings(value: Partial<GameSettings>) {
    Object.assign(this._game.settings, value);
  }

  /**
   * Check if game is active
   */
  get isActive(): boolean {
    return this._game.isActive;
  }

  /**
   * Check if game is paused
   */
  get isPaused(): boolean {
    return this._game.isPaused;
  }

  /**
   * Get the underlying game engine for advanced usage
   */
  get engine(): ISakuraCraftEngine & Record<string, any> {
    return this._game;
  }
}

// Default export
export default SakuraCraftGame;
