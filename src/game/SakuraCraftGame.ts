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
    
    <!-- World Generation Loading Screen -->
    <div class="loading-screen active" id="loadingScreen">
      <div class="loading-content">
        <div class="loading-title">🌸 Generating World 🌸</div>
        <div class="loading-phase" id="loadingPhase">Initializing...</div>
        <div class="loading-bar-container">
          <div class="loading-bar" id="loadingBar"></div>
        </div>
        <div class="loading-percent" id="loadingPercent">0%</div>
        <div class="loading-details" id="loadingDetails"></div>
        <div class="loading-biome-preview" id="biomePreview">
          <div class="biome-icon" id="biomeIcon">🌲</div>
          <div class="biome-name" id="biomeName">Forest</div>
        </div>
        <div class="loading-tips" id="loadingTips">
          <div class="tip-text">💡 Tip: Press E to open your inventory</div>
        </div>
      </div>
    </div>
    
    <!-- Click to Play Overlay (required for pointer lock) -->
    <div class="click-to-play" id="clickToPlay">
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
            <span>Tree Style</span>
            <select class="option-select" id="optTreeStyle">
              <option value="simple" selected>Simple (Fast)</option>
              <option value="transparent">Fancy</option>
              <option value="bushy">Fancy + Wind</option>
            </select>
          </div>
          <div class="option-row">
            <span>Texture Mode</span>
            <select class="option-select" id="optTextureMode">
              <option value="fixed" selected>Fixed (Stable)</option>
              <option value="trippy">Trippy (Chowder)</option>
              <option value="vacuum">Trippy (Vacuum)</option>
            </select>
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
    
    <!-- Container Screen (Chests, Barrels, etc) -->
    <div class="container-screen" id="containerScreen">
      <div class="container-ui">
        <div class="container-header">
          <span class="container-title" id="containerTitle">Chest</span>
          <button class="container-close" id="containerClose">✕</button>
        </div>
        <div class="container-content">
          <div class="container-slots" id="containerSlots">
            <!-- Container slots populated by JS -->
          </div>
          <div class="container-divider"></div>
          <div class="player-inventory-mini">
            <div class="inventory-label">Your Inventory</div>
            <div class="player-slots" id="playerSlotsInContainer">
              <!-- Player inventory slots populated by JS -->
            </div>
          </div>
        </div>
      </div>
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
            camera: { x: 0, y: 5, z: 0, rotX: 0, rotY: 0, sneaking: false, normalHeight: 0.6, sneakHeight: 0.2 },
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
            lastSwimTime: 0,  // Track when we last exited water for smooth transitions
            swimDebugInfo: null,  // Debug info for swimming system
            
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
            
            // Dialogue and Quest System
            dialogueOpen: false,
            currentDialogueNPC: null,
            journalOpen: false,
            quests: [],  // Active and completed quests
            questData: {
                // Gunsmith questline
                'meet_gunsmith': {
                    id: 'meet_gunsmith',
                    title: 'The Mysterious Wizard',
                    description: 'A wandering gunsmith has appeared! Perhaps he knows something about the bird invasion?',
                    objectives: ['Speak with the Gunsmith'],
                    status: 'active',  // active, completed, failed
                    stage: 0,  // 0 = not started, 1 = in progress, 2 = completed
                    reward: null
                },
                'birds_origin': {
                    id: 'birds_origin',
                    title: 'Origin of the Feathered Menace',
                    description: 'The Gunsmith believes there\'s a source to this madness. Find clues about where these birds are coming from.',
                    objectives: [
                        'Survive 3 bird waves',
                        'Collect 50 bird drops',
                        'Return to the Gunsmith'
                    ],
                    status: 'locked',  // Not started yet
                    stage: 0,
                    progress: { waves: 0, drops: 0, returned: false },
                    reward: 'Ancient Map Fragment'
                }
            },
            
            // Gunsmith dialogue state
            gunsmithDialogueStage: 0,  // Tracks conversation progress
            gunsmithMetBefore: false,  // Has player met them?
            
            // Items and inventory
            selectedSlot: 0,  // 0-8 for hotbar slots
            selectedBlock: 'grass',
            selectedItem: null,  // For non-block items like ka69
            hotbarTooltip: { visible: false, text: '', timestamp: 0 },  // Tooltip when scrolling hotbar
            
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
                    { type: 'weapon', id: 'ka69', count: 1, durability: 100, maxDurability: 100 },
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
                { ingredients: [{ id: 'wood', count: 8 }], result: { type: 'block', id: 'chest', count: 1 }, name: 'Chest' },
                { ingredients: [{ id: 'wood', count: 6 }], result: { type: 'block', id: 'barrel', count: 1 }, name: 'Barrel' },
                { ingredients: [{ id: 'wood', count: 4 }], result: { type: 'block', id: 'crate', count: 1 }, name: 'Crate' },
                { ingredients: [{ id: 'stone', count: 8 }, { id: 'deepslate', count: 4 }], result: { type: 'block', id: 'furnace', count: 1 }, name: 'Furnace' },
                { ingredients: [{ id: 'moonstone', count: 2 }, { id: 'stone', count: 4 }], result: { type: 'block', id: 'alchemyTable', count: 1 }, name: 'Alchemy Table' },
                { ingredients: [{ id: 'glowstone', count: 4 }], result: { type: 'block', id: 'glowstone', count: 8 }, name: 'Refined Glowstone' },
                { ingredients: [{ id: 'sakuraite', count: 4 }, { id: 'wood', count: 8 }], result: { type: 'block', id: 'storageShrine', count: 1 }, name: 'Storage Shrine' }
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
            
            // Container UI state
            containerOpen: false,
            openContainerPos: null as { x: number, y: number, z: number } | null,
            openContainerType: null as string | null,
            containerSlots: 27, // Default chest size
            
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
                targetFps: 60,
                treeStyle: 'simple' as 'simple' | 'transparent' | 'bushy',
                textureMode: 'fixed' as 'fixed' | 'trippy' | 'vacuum'  // fixed = stationary, trippy = moves with scene, vacuum = current glitchy effect
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
                const perm = [];
                for (let i = 0; i < 512; i++) {
                    perm[i] = Math.floor(Math.random() * 256);
                }
                
                function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
                function lerp(a, b, t) { return a + t * (b - a); }
                function grad(hash, x, y) {
                    const h = hash & 3;
                    const u = h < 2 ? x : y;
                    const v = h < 2 ? y : x;
                    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
                }
                
                return function(x, y) {
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
            fbm(x, y, octaves = 4) {
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
                grass: { top: '#7cba5f', side: '#8b6b4a', bottom: '#6b4423', useTexture: true, texture: 'grass' },
                dirt: { top: '#8b6b4a', side: '#8b6b4a', bottom: '#8b6b4a', useTexture: true, texture: 'dirt' },
                stone: { top: '#888888', side: '#777777', bottom: '#666666' },
                wood: { top: '#a0825a', side: '#6b4423', bottom: '#6b4423', useTexture: true, texture: 'wood' },
                leaves: { top: '#32b432', side: '#28a028', bottom: '#1e8c1e', transparent: false, useTexture: true, texture: 'leaves' },
                appleLeaves: { top: '#32b432', side: '#28a028', bottom: '#1e8c1e', transparent: false, useTexture: true, texture: 'leaves' },
                water: { top: 'rgba(74, 144, 217, 0.7)', side: 'rgba(58, 128, 201, 0.7)', bottom: 'rgba(42, 112, 185, 0.7)', transparent: true, animated: true, useTexture: true, texture: 'water' },
                sand: { top: '#e6d9a0', side: '#d9cc93', bottom: '#ccbf86' },
                brick: { top: '#b35050', side: '#a04040', bottom: '#903030', useTexture: true, texture: 'brick' },
                lava: { top: '#ff6600', side: '#ff4400', bottom: '#cc3300', animated: true, useTexture: true, texture: 'lava' },
                obsidian: { top: '#1a0a2e', side: '#140820', bottom: '#0a0410' },
                cherryWood: { top: '#c4a07a', side: '#8b5a5a', bottom: '#8b5a5a', useTexture: true, texture: 'wood' },
                cherryLeaves: { top: '#ffb7c5', side: '#ffc0cb', bottom: '#ff90a5', transparent: false, useTexture: true, texture: 'sakuraLeaves' },
                chest: { top: '#8b6914', side: '#a0780a', bottom: '#705010' },
                ritualChest: { top: '#daa520', side: '#cd853f', bottom: '#8b4513' }, // Golden mystical chest
                buildingChest: { top: '#a0825a', side: '#8b6914', bottom: '#705010' }, // Wooden chest
                // Underground blocks
                bedrock: { top: '#1a1a1a', side: '#0f0f0f', bottom: '#050505' },
                deepslate: { top: '#3a3a3a', side: '#2a2a2a', bottom: '#1a1a1a' },
                mossyStone: { top: '#6a8866', side: '#5a7856', bottom: '#4a6846' },
                // Unique Ores (Japanese/Fantasy themed)
                sakuraite: { top: '#ff69b4', side: '#ff1493', bottom: '#c71585', glow: true }, // Pink crystal
                moonstone: { top: '#e6e6fa', side: '#d8bfd8', bottom: '#dda0dd', glow: true }, // Lunar ore
                jadite: { top: '#00a86b', side: '#009060', bottom: '#007850' }, // Jade ore
                crimsonite: { top: '#dc143c', side: '#b22222', bottom: '#8b0000' }, // Volcanic ore
                voidstone: { top: '#2d1b4e', side: '#1a0d2e', bottom: '#0d0617', glow: true }, // Rare dark ore
                spirite: { top: '#87ceeb', side: '#6bb3d9', bottom: '#4f98c7' }, // Spirit essence
                // Dungeon blocks
                dungeonBrick: { top: '#4a4a5a', side: '#3a3a4a', bottom: '#2a2a3a' },
                dungeonMossy: { top: '#4a5a4a', side: '#3a4a3a', bottom: '#2a3a2a' },
                dungeonChest: { top: '#8b4513', side: '#a0522d', bottom: '#654321' },
                spikeTrap: { top: '#5a5a5a', side: '#4a4a4a', bottom: '#3a3a3a' },
                // Container blocks
                barrel: { top: '#8b6914', side: '#a0780a', bottom: '#8b6914' },
                crate: { top: '#c4a07a', side: '#a08060', bottom: '#806040' },
                furnace: { top: '#555555', side: '#666666', bottom: '#444444' },
                furnaceActive: { top: '#555555', side: '#886644', bottom: '#444444' },
                alchemyTable: { top: '#4a3a3a', side: '#3a2a2a', bottom: '#2a1a1a' }, // Dark wood table
                storageShrine: { top: '#ffd700', side: '#daa520', bottom: '#b8860b' },
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
                glowstone: { top: '#ffdd88', side: '#eebb66', bottom: '#ddaa44' },
                // Furniture blocks
                table: { top: '#a0825a', side: '#6b4423', bottom: '#5a3a1a', useTexture: true, texture: 'wood' },
                chair: { top: '#8b6914', side: '#705010', bottom: '#5a400a' },
                bed: { top: '#c04040', side: '#a03030', bottom: '#802020' },
                bedPillow: { top: '#f0f0f0', side: '#e0e0e0', bottom: '#d0d0d0' },
                cashRegister: { top: '#404040', side: '#303030', bottom: '#202020' },
                stool: { top: '#c04040', side: '#a03030', bottom: '#802020' },
                counter: { top: '#e0e0e0', side: '#c0c0c0', bottom: '#a0a0a0' },
                lamp: { top: '#ffee88', side: '#ffdd66', bottom: '#eebb44' },
                bookshelf: { top: '#6b4423', side: '#8b6914', bottom: '#5a3a1a' },
                plant: { top: '#32b432', side: '#28a028', bottom: '#1e8c1e' },
                sink: { top: '#d0d0d0', side: '#b0b0b0', bottom: '#909090' },
                stove: { top: '#404040', side: '#303030', bottom: '#ff4400' },
                fridge: { top: '#e0e0e0', side: '#d0d0d0', bottom: '#c0c0c0' }
            },
            
            // Texture cache for procedurally generated patterns
            textureCache: {},
            
            // Custom block models for non-cube blocks
            // Values: [offsetX, offsetY, offsetZ, scaleX, scaleY, scaleZ]
            // Default full block is [0, 0, 0, 1, 1, 1]
            blockModels: {
                // Furniture - smaller/offset shapes
                table: [0.1, 0, 0.1, 0.8, 0.5, 0.8],           // Flat top table
                chair: [0.15, 0, 0.15, 0.7, 0.6, 0.7],         // Small chair
                stool: [0.2, 0, 0.2, 0.6, 0.5, 0.6],           // Small stool
                bed: [0.05, 0, 0.05, 0.9, 0.4, 0.9],           // Low bed
                bedPillow: [0.25, 0.4, 0.25, 0.5, 0.25, 0.5],  // Pillow on bed
                counter: [0, 0, 0, 1, 0.6, 1],                 // Counter height
                cashRegister: [0.2, 0, 0.2, 0.6, 0.5, 0.6],    // Small register
                lamp: [0.35, 0, 0.35, 0.3, 0.7, 0.3],          // Tall thin lamp
                plant: [0.3, 0, 0.3, 0.4, 0.6, 0.4],           // Potted plant
                sink: [0.1, 0, 0.1, 0.8, 0.5, 0.8],            // Sink basin
                stove: [0, 0, 0, 1, 0.6, 1],                   // Stove
                fridge: [0.05, 0, 0.05, 0.9, 1, 0.9],          // Tall fridge
                bookshelf: [0, 0, 0, 1, 1, 0.8],               // Flat back
                
                // Containers - slightly smaller than full blocks
                chest: [0.1, 0, 0.1, 0.8, 0.7, 0.8],
                ritualChest: [0.1, 0, 0.1, 0.8, 0.7, 0.8],
                buildingChest: [0.1, 0, 0.1, 0.8, 0.7, 0.8],
                dungeonChest: [0.1, 0, 0.1, 0.8, 0.7, 0.8],
                barrel: [0.1, 0, 0.1, 0.8, 0.9, 0.8],
                crate: [0.05, 0, 0.05, 0.9, 0.8, 0.9],
                furnace: [0, 0, 0, 1, 0.9, 1],
                alchemyTable: [0, 0, 0, 1, 0.7, 1],
                storageShrine: [0.15, 0, 0.15, 0.7, 0.8, 0.7]
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
                lava: { stackable: false, maxStack: 1 },
                water: { stackable: false, maxStack: 1 },
                // Underground blocks
                deepslate: { stackable: true, maxStack: 64 },
                mossyStone: { stackable: true, maxStack: 64 },
                dungeonBrick: { stackable: true, maxStack: 64 },
                dungeonMossy: { stackable: true, maxStack: 64 },
                // Container blocks
                barrel: { stackable: true, maxStack: 16, description: 'Wooden storage barrel' },
                crate: { stackable: true, maxStack: 16, description: 'Sturdy storage crate' },
                furnace: { stackable: true, maxStack: 16, description: 'Smelt ores into ingots' },
                alchemyTable: { stackable: true, maxStack: 8, description: 'Brew mysterious potions' },
                storageShrine: { stackable: true, maxStack: 4, description: 'Sacred storage with extra capacity' },
                dungeonChest: { stackable: true, maxStack: 8, description: 'Ancient treasure chest' },
                ritualChest: { stackable: true, maxStack: 8, description: 'Mystical chest' },
                buildingChest: { stackable: true, maxStack: 16, description: 'Standard storage chest' },
                // Ores (valuable!)
                sakuraite: { stackable: true, maxStack: 64, description: 'Rare pink crystal ore - glows faintly' },
                moonstone: { stackable: true, maxStack: 64, description: 'Lunar ore that shimmers in darkness' },
                jadite: { stackable: true, maxStack: 64, description: 'Precious jade ore from deep caverns' },
                crimsonite: { stackable: true, maxStack: 64, description: 'Volcanic ore pulsing with heat' },
                voidstone: { stackable: true, maxStack: 64, description: 'Mysterious ore from the deepest depths' },
                spirite: { stackable: true, maxStack: 64, description: 'Crystallized spirit essence' },
                // Consumables/Throwables
                apple: { stackable: true, maxStack: 64, throwable: true, description: 'Throw at birds to knock them away' },
                // Buckets
                water_bucket: { stackable: true, maxStack: 16 },
                lava_bucket: { stackable: true, maxStack: 16 },
                // Tools with durability
                ka69: { stackable: false, maxStack: 1, durability: 100, maxDurability: 100, description: 'Shoots bullets at birds' },
                seeds: { stackable: true, maxStack: 64, description: 'Calms angry birds temporarily' },
                berdger: { stackable: false, maxStack: 1, invincible: true, description: 'The legendary bird repellent - infinite uses!' },
                // Ritual items (Omamori charm components)
                sakuraPetal: { stackable: true, maxStack: 16, description: 'Sacred cherry blossom petal', ritual: true },
                shimenawa: { stackable: true, maxStack: 1, description: 'Sacred rope', ritual: true },
                omamori: { stackable: true, maxStack: 1, description: 'Protective charm base', ritual: true },
                ema: { stackable: true, maxStack: 1, description: 'Wooden wish plaque', ritual: true },
                incense: { stackable: true, maxStack: 1, description: 'Purifying incense', ritual: true },
                // Furniture blocks
                table: { stackable: true, maxStack: 16, description: 'Wooden dining table' },
                chair: { stackable: true, maxStack: 16, description: 'Comfortable chair' },
                bed: { stackable: true, maxStack: 8, description: 'Cozy bed for resting' },
                bedPillow: { stackable: true, maxStack: 8, description: 'Soft pillow' },
                cashRegister: { stackable: true, maxStack: 8, description: 'Store cash register' },
                stool: { stackable: true, maxStack: 16, description: 'Simple stool' },
                counter: { stackable: true, maxStack: 16, description: 'Kitchen counter' },
                lamp: { stackable: true, maxStack: 16, description: 'Light source' },
                bookshelf: { stackable: true, maxStack: 8, description: 'Filled with books' },
                plant: { stackable: true, maxStack: 16, description: 'Decorative plant' },
                sink: { stackable: true, maxStack: 8, description: 'Kitchen sink' },
                stove: { stackable: true, maxStack: 8, description: 'Cooking stove' },
                fridge: { stackable: true, maxStack: 8, description: 'Refrigerator' }
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
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d', {
                    alpha: false,  // No transparency = better performance
                    desynchronized: true  // Hint for performance
                });
                
                // RENDERING QUALITY IMPROVEMENTS
                // Enable anti-aliasing and high-quality rendering
                this.ctx.imageSmoothingEnabled = true;
                this.ctx.imageSmoothingQuality = 'high';
                
                this.initialized = false;  // Track if world has been generated
                this.gameLoopId = null;    // Track animation frame for cleanup
                this.lastFrameTime = 0;    // For FPS limiting
            },
            
            // Full initialization - called only when game starts
            async fullInit() {
                if (this.initialized) return;  // Don't regenerate if already done
                
                await this.generateWorld();
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
            
            // ═══════════════════════════════════════════════════════════════════════════
            // ASYNC WORLD GENERATION WITH BIOME SYSTEM
            // ═══════════════════════════════════════════════════════════════════════════
            
            async generateWorld() {
                this.world = {};
                this.fluidLevels = {};
                this.droppedItems = [];
                this.cherryTrees = [];
                this.petalParticles = [];
                this.buildings = [];
                this.structureQueue = [];
                this.biomeMap = {};
                this.biomeRegions = [];
                
                const worldSize = 150; // 3x larger: -150 to 150 = 301x301 blocks
                const waterLevel = 6;
                const baseHeight = 8;
                
                // Store world bounds
                this.worldBounds = {
                    minX: -worldSize,
                    maxX: worldSize + 1,
                    minZ: -worldSize,
                    maxZ: worldSize + 1,
                    minY: 0,
                    maxY: 60
                };
                
                // Wind system
                this.wind = {
                    x: 0, z: 0,
                    targetX: 0, targetZ: 0,
                    gustTimer: 0,
                    strength: 0.02
                };
                
                // Loading tips
                const tips = [
                    "💡 Tip: Press E to open your inventory",
                    "💡 Tip: Hold SHIFT to sneak and not fall off edges",
                    "💡 Tip: Collect ritual items to complete the Omamori blessing",
                    "💡 Tip: Watch out for pest birds - they attack!",
                    "💡 Tip: Find the WcDonald's for a tasty Berdger",
                    "💡 Tip: Cherry trees drop sakura petals in the wind",
                    "💡 Tip: Press ` (backtick) to open debug console",
                    "💡 Tip: Different biomes have unique terrain features",
                    "💡 Tip: Mountains have the best views!",
                    "💡 Tip: Explore to find hidden ritual chests"
                ];
                
                // Biome definitions
                const biomeTypes = {
                    plains: { icon: '🌾', name: 'Plains', color: '#7cba5f', treeChance: 0.05, heightMod: 0 },
                    forest: { icon: '🌲', name: 'Forest', color: '#2d5a27', treeChance: 0.35, heightMod: 2 },
                    sakuraForest: { icon: '🌸', name: 'Sakura Forest', color: '#ffb7c5', treeChance: 0.40, heightMod: 1 },
                    desert: { icon: '🏜️', name: 'Desert', color: '#e6d9a0', treeChance: 0, heightMod: -1 },
                    mountains: { icon: '⛰️', name: 'Mountains', color: '#888888', treeChance: 0.08, heightMod: 12 },
                    ocean: { icon: '🌊', name: 'Ocean', color: '#4a90d9', treeChance: 0, heightMod: -8 }
                };
                
                // Update loading UI helper
                const tipsEl = document.getElementById('loadingTips');
                let tipIndex = Math.floor(Math.random() * tips.length);
                
                // Set initial random tip immediately
                if (tipsEl) {
                    tipsEl.innerHTML = `<div class="tip-text">${tips[tipIndex]}</div>`;
                }
                
                // Start tip rotation timer (every 3 seconds)
                const tipTimer = setInterval(() => {
                    if (tipsEl) {
                        tipIndex = (tipIndex + 1) % tips.length;
                        tipsEl.innerHTML = `<div class="tip-text">${tips[tipIndex]}</div>`;
                    }
                }, 3000);
                
                const updateLoading = (phase, percent, details = '', biomeIcon = '🌍', biomeName = 'World') => {
                    const phaseEl = document.getElementById('loadingPhase');
                    const barEl = document.getElementById('loadingBar');
                    const percentEl = document.getElementById('loadingPercent');
                    const detailsEl = document.getElementById('loadingDetails');
                    const biomeIconEl = document.getElementById('biomeIcon');
                    const biomeNameEl = document.getElementById('biomeName');
                    
                    if (phaseEl) phaseEl.textContent = phase;
                    if (barEl) barEl.style.width = percent + '%';
                    if (percentEl) percentEl.textContent = Math.floor(percent) + '%';
                    if (detailsEl) detailsEl.textContent = details;
                    if (biomeIconEl) biomeIconEl.textContent = biomeIcon;
                    if (biomeNameEl) biomeNameEl.textContent = biomeName;
                };
                
                // Allow UI to update
                const yieldToUI = () => new Promise(resolve => setTimeout(resolve, 0));
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 1: Generate Biome Regions using Voronoi-like approach
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Generating Biomes...', 0, 'Creating biome seeds', '🌍', 'World');
                await yieldToUI();
                
                // Create biome seed points - guarantee at least one of each type
                const biomeSeeds = [];
                const biomeTypeList = Object.keys(biomeTypes);
                
                // Place guaranteed biomes in different quadrants
                const quadrants = [
                    { x: -worldSize * 0.6, z: -worldSize * 0.6 },
                    { x: worldSize * 0.6, z: -worldSize * 0.6 },
                    { x: -worldSize * 0.6, z: worldSize * 0.6 },
                    { x: worldSize * 0.6, z: worldSize * 0.6 },
                    { x: 0, z: -worldSize * 0.7 },
                    { x: 0, z: worldSize * 0.7 }
                ];
                
                // Guarantee one of each biome
                biomeTypeList.forEach((type, i) => {
                    const q = quadrants[i % quadrants.length];
                    biomeSeeds.push({
                        x: q.x + (Math.random() - 0.5) * 40,
                        z: q.z + (Math.random() - 0.5) * 40,
                        type: type
                    });
                });
                
                // Add more random biome seeds for variety
                const additionalSeeds = 25;
                for (let i = 0; i < additionalSeeds; i++) {
                    biomeSeeds.push({
                        x: (Math.random() - 0.5) * worldSize * 1.8,
                        z: (Math.random() - 0.5) * worldSize * 1.8,
                        type: biomeTypeList[Math.floor(Math.random() * biomeTypeList.length)]
                    });
                }
                
                // Make spawn area (center) always plains
                biomeSeeds.push({ x: 0, z: 0, type: 'plains' });
                
                this.biomeSeeds = biomeSeeds;
                
                // Function to get biome at any position (Voronoi)
                const getBiomeAt = (x, z) => {
                    let closestDist = Infinity;
                    let closestBiome = 'plains';
                    
                    for (const seed of biomeSeeds) {
                        const dx = x - seed.x;
                        const dz = z - seed.z;
                        // Add noise to distance for more organic borders
                        const noise = this.noise2D(x * 0.02 + seed.x, z * 0.02 + seed.z) * 20;
                        const dist = Math.sqrt(dx * dx + dz * dz) + noise;
                        
                        if (dist < closestDist) {
                            closestDist = dist;
                            closestBiome = seed.type;
                        }
                    }
                    
                    return closestBiome;
                };
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 2: Generate Height Map
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Generating Terrain...', 5, 'Calculating height map', '⛰️', 'Mountains');
                await yieldToUI();
                
                const heightMap = {};
                const biomeCache = {};
                let processedBlocks = 0;
                const totalBlocks = (worldSize * 2 + 1) * (worldSize * 2 + 1);
                
                for (let x = -worldSize; x <= worldSize; x++) {
                    for (let z = -worldSize; z <= worldSize; z++) {
                        const key = `${x},${z}`;
                        
                        // Get biome for this position
                        const biome = getBiomeAt(x, z);
                        biomeCache[key] = biome;
                        const biomeData = biomeTypes[biome];
                        
                        // Base terrain noise
                        const n1 = this.fbm(x * 0.02, z * 0.02, 3) * 8;
                        const n2 = this.fbm(x * 0.05 + 100, z * 0.05 + 100, 2) * 4;
                        
                        // Mountain-specific high peaks
                        let mountainBonus = 0;
                        if (biome === 'mountains') {
                            mountainBonus = Math.abs(this.fbm(x * 0.03, z * 0.03, 4)) * 15;
                        }
                        
                        // Ocean depth
                        let oceanDepth = 0;
                        if (biome === 'ocean') {
                            oceanDepth = -Math.abs(this.fbm(x * 0.04, z * 0.04, 2)) * 4;
                        }
                        
                        // Edge falloff
                        const distFromCenter = Math.sqrt(x * x + z * z) / worldSize;
                        const edgeFalloff = Math.max(0, 1 - Math.pow(distFromCenter, 2) * 0.3);
                        
                        let height = Math.floor(baseHeight + (n1 + n2 + biomeData.heightMod + mountainBonus + oceanDepth) * edgeFalloff);
                        height = Math.max(1, Math.min(35, height));
                        
                        heightMap[key] = height;
                    }
                    
                    // Update progress every few columns
                    if (x % 20 === 0) {
                        const progress = 5 + ((x + worldSize) / (worldSize * 2)) * 25;
                        updateLoading('Generating Terrain...', progress, `Column ${x + worldSize} of ${worldSize * 2}`, '🗺️', 'Terrain');
                        await yieldToUI();
                    }
                }
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 3: Place Terrain Blocks (Full Underground)
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Placing Blocks...', 30, 'Building terrain', '🧱', 'Terrain');
                await yieldToUI();
                
                // 3D noise function for caves
                const caveNoise3D = (x, y, z, scale = 0.08) => {
                    // Combine multiple octaves for organic cave shapes
                    const n1 = this.noise2D(x * scale + y * 0.5, z * scale) * 0.6;
                    const n2 = this.noise2D(y * scale * 0.7, x * scale + z * 0.3) * 0.3;
                    const n3 = this.noise2D(z * scale + x * 0.2, y * scale * 0.5) * 0.1;
                    return n1 + n2 + n3;
                };
                
                // Worm cave carver - creates tunnel-like caves
                const wormNoise = (x, y, z) => {
                    const wx = this.noise2D(x * 0.04, z * 0.04) * 10;
                    const wz = this.noise2D(x * 0.04 + 100, z * 0.04 + 100) * 10;
                    const tunnelY = 8 + this.noise2D(x * 0.02, z * 0.02) * 6;
                    const distFromTunnel = Math.sqrt((y - tunnelY) ** 2 + (Math.sin(x * 0.1 + wx) * 3) ** 2);
                    return distFromTunnel < 2.5 + this.noise2D(x * 0.1, z * 0.1) * 1.5;
                };
                
                // Ore generation rules
                const oreTypes = [
                    { type: 'jadite', minY: 5, maxY: 25, chance: 0.008, veinSize: 3 },
                    { type: 'spirite', minY: 8, maxY: 30, chance: 0.006, veinSize: 4 },
                    { type: 'crimsonite', minY: 2, maxY: 15, chance: 0.005, veinSize: 3 },
                    { type: 'moonstone', minY: 10, maxY: 35, chance: 0.004, veinSize: 2 },
                    { type: 'sakuraite', minY: 5, maxY: 20, chance: 0.003, veinSize: 2 },
                    { type: 'voidstone', minY: 1, maxY: 8, chance: 0.001, veinSize: 1 }
                ];
                
                // Track ore veins to place
                const oreVeins = [];
                
                for (let x = -worldSize; x <= worldSize; x++) {
                    for (let z = -worldSize; z <= worldSize; z++) {
                        const key = `${x},${z}`;
                        const surfaceHeight = heightMap[key];
                        const biome = biomeCache[key];
                        const isBeach = surfaceHeight <= waterLevel + 1 && surfaceHeight >= waterLevel - 1;
                        
                        // Generate from bedrock (y=0) to surface
                        for (let y = 0; y <= surfaceHeight; y++) {
                            // Check if this should be a cave
                            const caveValue = caveNoise3D(x, y, z);
                            const isWormCave = y > 3 && y < surfaceHeight - 4 && wormNoise(x, y, z);
                            const isCave = (caveValue > 0.35 && y > 2 && y < surfaceHeight - 3) || isWormCave;
                            
                            // Don't carve caves too close to surface or in ocean floor
                            if (isCave && biome !== 'ocean') {
                                continue; // Leave as air (cave)
                            }
                            
                            let blockType;
                            
                            if (y === 0) {
                                // Bedrock layer (unbreakable)
                                blockType = 'bedrock';
                            } else if (y <= 2 && Math.random() < 0.7) {
                                // Mixed bedrock layer
                                blockType = 'bedrock';
                            } else if (y < 6) {
                                // Thin deep stone layer (reduced from y<12)
                                blockType = 'deepslate';
                            } else if (y < surfaceHeight - 3) {
                                // Regular stone with occasional mossy
                                if (this.noise2D(x * 0.3, z * 0.3 + y * 0.2) > 0.6) {
                                    blockType = 'mossyStone';
                                } else {
                                    blockType = 'stone';
                                }
                            } else if (y < surfaceHeight) {
                                // Sub-surface layers
                                if (biome === 'ocean' || biome === 'desert' || isBeach) {
                                    blockType = 'sand';
                                } else if (biome === 'mountains' && surfaceHeight > 20) {
                                    blockType = 'stone';
                                } else {
                                    blockType = y === surfaceHeight - 1 ? 'dirt' : 'stone';
                                }
                            } else {
                                // Surface block
                                if (biome === 'ocean' || surfaceHeight < waterLevel) {
                                    blockType = 'sand';
                                } else if (biome === 'desert' || isBeach) {
                                    blockType = 'sand';
                                } else if (biome === 'mountains' && surfaceHeight > 20) {
                                    blockType = 'stone';
                                } else {
                                    blockType = 'grass';
                                }
                            }
                            
                            this.setBlock(x, y, z, blockType);
                            
                            // Check for ore generation (in stone/deepslate only)
                            if ((blockType === 'stone' || blockType === 'deepslate') && y > 0 && y < surfaceHeight - 2) {
                                for (const ore of oreTypes) {
                                    if (y >= ore.minY && y <= ore.maxY && Math.random() < ore.chance) {
                                        oreVeins.push({ x, y, z, type: ore.type, size: ore.veinSize });
                                    }
                                }
                            }
                        }
                        
                        // Water generation - fill from surface to water level
                        if (surfaceHeight < waterLevel) {
                            for (let y = surfaceHeight + 1; y <= waterLevel; y++) {
                                this.setBlock(x, y, z, 'water');
                                this.setFluidLevel(x, y, z, 8);
                            }
                        }
                    }
                    
                    // Update progress
                    if (x % 25 === 0) {
                        const progress = 30 + ((x + worldSize) / (worldSize * 2)) * 20;
                        updateLoading('Carving Caves...', progress, `Column ${x + worldSize}`, '⛏️', 'Underground');
                        await yieldToUI();
                    }
                }
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 3.5: Place Ore Veins
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Generating Ores...', 50, `Placing ${oreVeins.length} ore veins`, '💎', 'Ores');
                await yieldToUI();
                
                for (const vein of oreVeins) {
                    // Place vein in a small cluster
                    for (let i = 0; i < vein.size; i++) {
                        const ox = vein.x + Math.floor(Math.random() * 3) - 1;
                        const oy = vein.y + Math.floor(Math.random() * 3) - 1;
                        const oz = vein.z + Math.floor(Math.random() * 3) - 1;
                        const existing = this.getBlock(ox, oy, oz);
                        if (existing === 'stone' || existing === 'deepslate') {
                            this.setBlock(ox, oy, oz, vein.type);
                        }
                    }
                }
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 3.6: Generate Underground Dungeons
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Building Dungeons...', 55, 'Creating treasure rooms', '🏛️', 'Dungeons');
                await yieldToUI();
                
                const dungeonCount = Math.floor(worldSize / 15); // Scale with world size
                const dungeons = [];
                
                for (let d = 0; d < dungeonCount; d++) {
                    const dx = Math.floor(Math.random() * worldSize * 1.5) - worldSize * 0.75;
                    const dz = Math.floor(Math.random() * worldSize * 1.5) - worldSize * 0.75;
                    const dy = 5 + Math.floor(Math.random() * 15); // Underground level
                    
                    // Check if location is valid (underground)
                    const surfaceKey = `${Math.floor(dx)},${Math.floor(dz)}`;
                    const surfaceY = heightMap[surfaceKey];
                    if (!surfaceY || dy >= surfaceY - 5) continue;
                    
                    // Room dimensions
                    const roomW = 5 + Math.floor(Math.random() * 4);
                    const roomH = 4 + Math.floor(Math.random() * 2);
                    const roomD = 5 + Math.floor(Math.random() * 4);
                    
                    // Carve out room
                    for (let rx = 0; rx < roomW; rx++) {
                        for (let ry = 0; ry < roomH; ry++) {
                            for (let rz = 0; rz < roomD; rz++) {
                                const bx = Math.floor(dx) + rx;
                                const by = dy + ry;
                                const bz = Math.floor(dz) + rz;
                                
                                // Floor
                                if (ry === 0) {
                                    this.setBlock(bx, by, bz, Math.random() < 0.3 ? 'dungeonMossy' : 'dungeonBrick');
                                }
                                // Walls
                                else if (rx === 0 || rx === roomW - 1 || rz === 0 || rz === roomD - 1) {
                                    if (ry < roomH - 1) {
                                        this.setBlock(bx, by, bz, Math.random() < 0.2 ? 'dungeonMossy' : 'dungeonBrick');
                                    }
                                }
                                // Ceiling
                                else if (ry === roomH - 1) {
                                    this.setBlock(bx, by, bz, 'dungeonBrick');
                                }
                                // Interior - clear it out
                                else {
                                    const existing = this.getBlock(bx, by, bz);
                                    if (existing && existing !== 'water' && existing !== 'lava') {
                                        // Remove block to create empty space
                                        delete this.world[`${bx},${by},${bz}`];
                                    }
                                }
                            }
                        }
                    }
                    
                    // Place treasure chest in center
                    const chestX = Math.floor(dx) + Math.floor(roomW / 2);
                    const chestY = dy + 1;
                    const chestZ = Math.floor(dz) + Math.floor(roomD / 2);
                    this.setBlock(chestX, chestY, chestZ, 'dungeonChest');
                    
                    // Stock the chest with random loot
                    const lootTable = [
                        { type: 'sakuraite', count: 2 + Math.floor(Math.random() * 4) },
                        { type: 'moonstone', count: 1 + Math.floor(Math.random() * 3) },
                        { type: 'jadite', count: 3 + Math.floor(Math.random() * 5) },
                        { type: 'apple', count: 5 + Math.floor(Math.random() * 5) },
                        { type: 'glowstone', count: 4 + Math.floor(Math.random() * 8) },
                        { type: 'crimsonite', count: 1 + Math.floor(Math.random() * 3) },
                        { type: 'voidstone', count: 1 + Math.floor(Math.random() * 2) },
                        { type: 'spirite', count: 2 + Math.floor(Math.random() * 4) }
                    ];
                    
                    this.chestContents = this.chestContents || {};
                    const chestLoot = [];
                    const lootCount = 2 + Math.floor(Math.random() * 3);
                    for (let l = 0; l < lootCount; l++) {
                        const loot = lootTable[Math.floor(Math.random() * lootTable.length)];
                        chestLoot.push({ type: loot.type, count: loot.count });
                    }
                    this.chestContents[`${chestX},${chestY},${chestZ}`] = chestLoot;
                    
                    // Randomly add other containers to larger dungeons
                    if (roomW >= 7 && Math.random() < 0.6) {
                        // Add a barrel in a corner
                        const barrelX = Math.floor(dx) + 1;
                        const barrelZ = Math.floor(dz) + 1;
                        this.setBlock(barrelX, dy + 1, barrelZ, 'barrel');
                        this.chestContents[`${barrelX},${dy + 1},${barrelZ}`] = [
                            { type: 'apple', count: 3 + Math.floor(Math.random() * 5) }
                        ];
                    }
                    
                    if (roomW >= 6 && Math.random() < 0.4) {
                        // Add furnace (abandoned, with items inside)
                        const furnaceX = Math.floor(dx) + roomW - 2;
                        const furnaceZ = Math.floor(dz) + 1;
                        this.setBlock(furnaceX, dy + 1, furnaceZ, 'furnace');
                        this.chestContents[`${furnaceX},${dy + 1},${furnaceZ}`] = [
                            { type: Math.random() < 0.5 ? 'crimsonite' : 'deepslate', count: 1 + Math.floor(Math.random() * 3) }
                        ];
                    }
                    
                    if (Math.random() < 0.2) {
                        // Rare: Add alchemy table
                        const alchX = Math.floor(dx) + Math.floor(roomW / 2) - 1;
                        const alchZ = Math.floor(dz) + roomD - 2;
                        this.setBlock(alchX, dy + 1, alchZ, 'alchemyTable');
                        this.chestContents[`${alchX},${dy + 1},${alchZ}`] = [
                            { type: 'moonstone', count: 1 },
                            { type: 'spirite', count: 2 }
                        ];
                    }
                    
                    // Add glowstone for light
                    this.setBlock(Math.floor(dx) + 1, dy + roomH - 1, Math.floor(dz) + 1, 'glowstone');
                    this.setBlock(Math.floor(dx) + roomW - 2, dy + roomH - 1, Math.floor(dz) + roomD - 2, 'glowstone');
                    
                    dungeons.push({ x: dx, y: dy, z: dz });
                }
                
                console.log(`Generated ${dungeons.length} dungeons, ${oreVeins.length} ore veins`);
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 4: Generate Buildings FIRST (before trees)
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Constructing Buildings...', 60, 'Planning structures', '🏠', 'Village');
                await yieldToUI();
                
                const buildingTypes = ['church', 'house1', 'house2', 'house3', 'grocery', 'wcdonalds'];
                const quadrantSize = 25; // Smaller quadrants = more building areas
                let buildingsPlaced = 0;
                let wcdonaldsCount = 0;
                const maxWcDonalds = 4; // Allow multiple WcDonalds
                
                // Store building bounds for tree collision
                const buildingBounds = [];
                
                for (let qx = -Math.floor(worldSize / quadrantSize); qx <= Math.floor(worldSize / quadrantSize); qx++) {
                    for (let qz = -Math.floor(worldSize / quadrantSize); qz <= Math.floor(worldSize / quadrantSize); qz++) {
                        // Skip center quadrant (spawn area)
                        if (Math.abs(qx) <= 1 && Math.abs(qz) <= 1) continue;
                        
                        const minX = qx * quadrantSize;
                        const minZ = qz * quadrantSize;
                        
                        // Check biome - only build in plains/forest/sakuraForest
                        const centerBiome = getBiomeAt(minX + quadrantSize / 2, minZ + quadrantSize / 2);
                        if (centerBiome === 'ocean' || centerBiome === 'mountains') continue;
                        
                        // More buildings per quadrant (2-5)
                        const numBuildings = 2 + Math.floor(Math.random() * 4);
                        
                        for (let i = 0; i < numBuildings; i++) {
                            const bx = minX + 5 + Math.floor(Math.random() * (quadrantSize - 12));
                            const bz = minZ + 5 + Math.floor(Math.random() * (quadrantSize - 12));
                            
                            // WcDonald's spawning - more frequent
                            if (wcdonaldsCount < maxWcDonalds && Math.random() < 0.15) {
                                if (this.tryPlaceBuilding(bx, bz, ['wcdonalds'], heightMap)) {
                                    wcdonaldsCount++;
                                    buildingsPlaced++;
                                    // Store building bounds (WcDonalds is larger)
                                    buildingBounds.push({ x: bx - 2, z: bz - 2, w: 20, d: 18 });
                                    continue;
                                }
                            }
                            
                            if (this.tryPlaceBuilding(bx, bz, buildingTypes, heightMap)) {
                                buildingsPlaced++;
                                // Store building bounds
                                buildingBounds.push({ x: bx - 2, z: bz - 2, w: 14, d: 14 });
                            }
                        }
                    }
                    
                    const progress = 60 + ((qx + Math.floor(worldSize / quadrantSize)) / (Math.floor(worldSize / quadrantSize) * 2)) * 10;
                    updateLoading('Constructing Buildings...', progress, `${buildingsPlaced} structures built`, '🏗️', 'Construction');
                    await yieldToUI();
                }
                
                // Guarantee at least 2 WcDonald's
                while (wcdonaldsCount < 2) {
                    for (let attempts = 0; attempts < 50; attempts++) {
                        const bx = 40 + Math.floor(Math.random() * 80) * (Math.random() < 0.5 ? 1 : -1);
                        const bz = 40 + Math.floor(Math.random() * 80) * (Math.random() < 0.5 ? 1 : -1);
                        if (this.tryPlaceBuilding(bx, bz, ['wcdonalds'], heightMap)) {
                            wcdonaldsCount++;
                            buildingBounds.push({ x: bx - 2, z: bz - 2, w: 20, d: 18 });
                            break;
                        }
                    }
                    if (wcdonaldsCount < 2) break; // Avoid infinite loop
                }
                
                console.log(`Generated ${buildingsPlaced} buildings, ${wcdonaldsCount} WcDonalds`);
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 5: Generate Trees AFTER buildings (with collision check)
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Planting Trees...', 72, 'Growing forests', '🌲', 'Forest');
                await yieldToUI();
                
                let treesPlanted = 0;
                const treePositions = [];
                
                // Helper to check if position is near a building
                const isNearBuilding = (x, z, radius = 8) => {
                    for (const b of buildingBounds) {
                        if (x >= b.x - radius && x <= b.x + b.w + radius &&
                            z >= b.z - radius && z <= b.z + b.d + radius) {
                            return true;
                        }
                    }
                    return false;
                };
                
                for (let x = -worldSize; x <= worldSize; x += 3) {
                    for (let z = -worldSize; z <= worldSize; z += 3) {
                        const key = `${x},${z}`;
                        const height = heightMap[key];
                        const biome = biomeCache[key];
                        const biomeData = biomeTypes[biome];
                        
                        if (height > waterLevel + 1 && biomeData.treeChance > 0) {
                            const treeNoise = this.noise2D(x * 0.3 + 300, z * 0.3 + 300);
                            
                            if (treeNoise > 0.3 && Math.random() < biomeData.treeChance) {
                                const treeSize = 5;
                                const treeX = x - 2;
                                const treeZ = z - 2;
                                
                                const inBounds = treeX >= this.worldBounds.minX + 2 &&
                                    treeX + treeSize <= this.worldBounds.maxX - 2 &&
                                    treeZ >= this.worldBounds.minZ + 2 &&
                                    treeZ + treeSize <= this.worldBounds.maxZ - 2;
                                
                                // Check NOT near any building AND no structure collision
                                if (inBounds && !isNearBuilding(x, z) && !this.checkStructureCollision(treeX, height + 1, treeZ, treeSize, 8, treeSize)) {
                                    treePositions.push({ x, z, height, biome });
                                    
                                    if (biome === 'sakuraForest') {
                                        this.generateCherryTree(x, height + 1, z);
                                    } else if (biome === 'forest' && Math.random() < 0.15) {
                                        this.generateCherryTree(x, height + 1, z);
                                    } else {
                                        // Regular or apple tree
                                        if (Math.random() < 0.2) {
                                            this.generateTree(x, height + 1, z, true); // Apple tree
                                        } else {
                                            this.generateTree(x, height + 1, z);
                                        }
                                    }
                                    treesPlanted++;
                                }
                            }
                        }
                    }
                    
                    if (x % 30 === 0) {
                        const biomeData = biomeTypes[biomeCache[`${x},0`] || 'plains'];
                        const progress = 72 + ((x + worldSize) / (worldSize * 2)) * 12;
                        updateLoading('Planting Trees...', progress, `${treesPlanted} trees planted`, biomeData.icon, biomeData.name);
                        await yieldToUI();
                    }
                }
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 6: Special Structures
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Adding Special Locations...', 85, 'Placing ritual temple', '⛩️', 'Temple');
                await yieldToUI();
                
                // Ritual Temple
                let templeX, templeZ;
                do {
                    templeX = Math.floor(Math.random() * (worldSize - 30)) + 20;
                    templeZ = Math.floor(Math.random() * (worldSize - 30)) + 20;
                    if (Math.random() < 0.5) templeX = -templeX;
                    if (Math.random() < 0.5) templeZ = -templeZ;
                } while (Math.abs(templeX) < 30 || Math.abs(templeZ) < 30);
                
                const templeKey = `${templeX},${templeZ}`;
                const templeHeight = heightMap[templeKey] || baseHeight;
                this.generateRitualTemple(templeX, templeHeight + 1, templeZ);
                
                // Ritual Chests
                updateLoading('Hiding Treasures...', 88, 'Placing ritual chests', '📦', 'Treasures');
                await yieldToUI();
                
                const ritualChestCount = 8;
                for (let i = 0; i < ritualChestCount; i++) {
                    const rx = Math.floor(Math.random() * worldSize * 2) - worldSize;
                    const rz = Math.floor(Math.random() * worldSize * 2) - worldSize;
                    const rKey = `${rx},${rz}`;
                    const rHeight = heightMap[rKey] || baseHeight;
                    if (rHeight > waterLevel) {
                        this.setBlock(rx, rHeight + 1, rz, 'ritualChest');
                        const ritualItem = this.ritualItems[i % this.ritualItems.length];
                        this.chestContents = this.chestContents || {};
                        
                        // Build loot array with ritual item + random extras
                        const loot = [{ type: ritualItem, count: 1 }];
                        
                        // 1% chance for legendary Berdger!
                        if (Math.random() < 0.01) {
                            loot.push({ type: 'berdger', count: 1 });
                        }
                        
                        // Random bonus items
                        const bonusItems = [
                            { type: 'seeds', count: 2 + Math.floor(Math.random() * 4) },
                            { type: 'apple', count: 1 + Math.floor(Math.random() * 3) },
                            { type: 'jadite', count: 1 + Math.floor(Math.random() * 2) },
                            { type: 'sakuraite', count: 1 },
                            { type: 'moonstone', count: 1 },
                            { type: 'glowstone', count: 2 + Math.floor(Math.random() * 3) }
                        ];
                        
                        // Add 1-3 random bonus items
                        const bonusCount = 1 + Math.floor(Math.random() * 3);
                        for (let b = 0; b < bonusCount; b++) {
                            const bonus = bonusItems[Math.floor(Math.random() * bonusItems.length)];
                            loot.push({ type: bonus.type, count: bonus.count });
                        }
                        
                        this.chestContents[`${rx},${rHeight + 1},${rz}`] = loot;
                    }
                }
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 7: Spawn Items
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Scattering Items...', 92, 'Dropping seeds and apples', '🍎', 'Items');
                await yieldToUI();
                
                // Seeds
                for (let i = 0; i < 60; i++) {
                    const sx = Math.floor(Math.random() * worldSize * 2) - worldSize;
                    const sz = Math.floor(Math.random() * worldSize * 2) - worldSize;
                    const sKey = `${sx},${sz}`;
                    const sHeight = heightMap[sKey] || baseHeight;
                    if (sHeight > waterLevel) {
                        this.droppedItems.push({
                            x: sx + 0.5,
                            y: sHeight + 1.2,
                            z: sz + 0.5,
                            vy: 0,
                            type: 'seeds',
                            count: 1 + Math.floor(Math.random() * 3),
                            bobPhase: Math.random() * Math.PI * 2,
                            pickupDelay: 0,
                            age: 0
                        });
                    }
                }
                
                // Apples under apple trees
                if (this.appleTrees) {
                    for (const tree of this.appleTrees) {
                        if (Math.random() < 0.5) {
                            const appleCount = 1 + Math.floor(Math.random() * 3);
                            for (let i = 0; i < appleCount; i++) {
                                this.droppedItems.push({
                                    x: tree.x + (Math.random() - 0.5) * 4,
                                    y: tree.y - 3,
                                    z: tree.z + (Math.random() - 0.5) * 4,
                                    vy: 0,
                                    type: 'apple',
                                    count: 1,
                                    bobPhase: Math.random() * Math.PI * 2,
                                    pickupDelay: 0,
                                    age: 0
                                });
                            }
                        }
                    }
                }
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 8: Initialize Entities
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Spawning Wildlife...', 96, 'Releasing birds and fish', '🐦', 'Wildlife');
                await yieldToUI();
                
                this.initBirds();
                this.initPestBirds();
                
                // ════════════════════════════════════════════════════════════════════════
                // PHASE 9: Finalize
                // ════════════════════════════════════════════════════════════════════════
                updateLoading('Finalizing World...', 99, 'Almost ready!', '✨', 'Complete');
                await yieldToUI();
                
                // Store biome data for debug/minimap
                this.worldBiomes = biomeCache;
                this.worldHeights = heightMap;
                
                // Count biomes for stats
                const biomeCounts: Record<string, number> = {};
                for (const biome of Object.values(biomeCache) as string[]) {
                    biomeCounts[biome] = (biomeCounts[biome] || 0) + 1;
                }
                console.log('Biome distribution:', biomeCounts);
                console.log(`World generated: ${Object.keys(this.world).length} blocks, ${treesPlanted} trees, ${buildingsPlaced} buildings`);
                
                // Complete!
                updateLoading('World Ready!', 100, 'Click to play!', '🌸', 'SakuraCraft');
                clearInterval(tipTimer); // Stop tip rotation
                await yieldToUI();
                
                // Hide loading screen, show click to play
                setTimeout(() => {
                    const loadingScreen = document.getElementById('loadingScreen');
                    const clickToPlay = document.getElementById('clickToPlay');
                    if (loadingScreen) loadingScreen.classList.remove('active');
                    if (clickToPlay) clickToPlay.classList.add('active');
                }, 500);
            },
            
            tryPlaceBuilding(x, z, buildingTypes, heightMap = null) {
                // Check world bounds - don't spawn near forcefield
                if (this.worldBounds) {
                    const buffer = 10;
                    const bounds = this.worldBounds;
                    if (x < bounds.minX + buffer || x > bounds.maxX - buffer ||
                        z < bounds.minZ + buffer || z > bounds.maxZ - buffer) {
                        return false;
                    }
                }
                
                // Use heightMap if provided, otherwise fall back to getHighestBlock
                const groundY = heightMap ? (heightMap[`${x},${z}`] || this.getHighestBlock(x, z)) : this.getHighestBlock(x, z);
                if (!groundY || groundY < 7) return false;
                
                const block = this.getBlock(x, groundY, z);
                if (block === 'water' || block === 'sand') return false;
                
                // Quick flatness check
                const h1 = heightMap ? (heightMap[`${x+3},${z}`] || groundY) : (this.getHighestBlock(x + 3, z) || groundY);
                const h2 = heightMap ? (heightMap[`${x-3},${z}`] || groundY) : (this.getHighestBlock(x - 3, z) || groundY);
                const h3 = heightMap ? (heightMap[`${x},${z+3}`] || groundY) : (this.getHighestBlock(x, z + 3) || groundY);
                const h4 = heightMap ? (heightMap[`${x},${z-3}`] || groundY) : (this.getHighestBlock(x, z - 3) || groundY);
                if (Math.max(Math.abs(h1 - groundY), Math.abs(h2 - groundY), Math.abs(h3 - groundY), Math.abs(h4 - groundY)) > 3) return false;
                
                // Check overlap with other buildings
                for (const b of this.buildings) {
                    if (Math.sqrt((x - b.x) ** 2 + (z - b.z) ** 2) < 18) return false;
                }
                
                // Check for existing structures (trees, other blocks) in build area
                const buildWidth = 10, buildHeight = 12, buildDepth = 10;
                if (this.checkStructureCollision(x - 1, groundY, z - 1, buildWidth, buildHeight, buildDepth)) {
                    return false;
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
            generateChurch(x, y, z) {
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
            generateHouse1(x, y, z) {
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
                
                // Interior furniture
                // Bed in corner
                this.setBlock(x + 1, y, z + 1, 'bed');
                this.setBlock(x + 1, y, z + 2, 'bedPillow');
                
                // Small table with chair
                this.setBlock(x + 3, y, z + 2, 'table');
                this.setBlock(x + 3, y, z + 3, 'chair');
                
                // Lamp on table
                this.setBlock(x + 3, y + 1, z + 2, 'lamp');
                
                // Add storage containers inside
                if (Math.random() < 0.7) {
                    // Barrel in corner
                    this.setBlock(x + 1, y, z + 4, 'barrel');
                    this.chestContents = this.chestContents || {};
                    this.chestContents[`${x + 1},${y},${z + 4}`] = [
                        { type: 'apple', count: 2 + Math.floor(Math.random() * 4) }
                    ];
                }
                if (Math.random() < 0.5) {
                    // Crate on other side
                    this.setBlock(x + 3, y, z + 1, 'crate');
                    this.chestContents = this.chestContents || {};
                    this.chestContents[`${x + 3},${y},${z + 1}`] = [
                        { type: 'wood', count: 4 + Math.floor(Math.random() * 8) },
                        { type: 'seeds', count: 1 + Math.floor(Math.random() * 3) }
                    ];
                }
            },
            
            // Two-story house
            generateHouse2(x, y, z) {
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
            generateHouse3(x, y, z) {
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
            generateGrocery(x, y, z) {
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
            // Now with two variants: Drive-Thru and Dine-In
            generateWcDonalds(x, y, z) {
                // Randomly choose variant
                if (Math.random() < 0.5) {
                    this.generateWcDonaldsDriveThru(x, y, z);
                } else {
                    this.generateWcDonaldsDineIn(x, y, z);
                }
            },
            
            // WcDonald's Drive-Thru - larger with wraparound drive-thru lane
            generateWcDonaldsDriveThru(x, y, z) {
                const w = 12, d = 10, h = 5;
                const ruinFactor = 0.1;
                
                // Clear interior
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        for (let dy = 0; dy < h + 5; dy++) {
                            const existing = this.getBlock(x + dx, y + dy, z + dz);
                            if (existing && existing !== 'water' && existing !== 'lava') {
                                this.setBlock(x + dx, y + dy, z + dz, null);
                            }
                        }
                    }
                }
                
                // Wraparound drive-thru lane (stone road)
                // Front entrance/driveway
                for (let dx = -3; dx < w + 3; dx++) {
                    this.setBlock(x + dx, y - 1, z + d + 1, 'stone');
                    this.setBlock(x + dx, y - 1, z + d + 2, 'stone');
                }
                // Right side lane
                for (let dz = -3; dz < d + 3; dz++) {
                    this.setBlock(x + w + 1, y - 1, z + dz, 'stone');
                    this.setBlock(x + w + 2, y - 1, z + dz, 'stone');
                }
                // Back lane
                for (let dx = -3; dx < w + 3; dx++) {
                    this.setBlock(x + dx, y - 1, z - 2, 'stone');
                    this.setBlock(x + dx, y - 1, z - 1, 'stone');
                }
                // Left side exit
                for (let dz = -3; dz < d + 3; dz++) {
                    this.setBlock(x - 2, y - 1, z + dz, 'stone');
                    this.setBlock(x - 1, y - 1, z + dz, 'stone');
                }
                
                // Crosswalk stripes at front entrance
                for (let dx = 2; dx < w - 2; dx += 2) {
                    this.setBlock(x + dx, y - 1, z + d + 1, 'whiteBrick');
                    this.setBlock(x + dx, y - 1, z + d + 2, 'whiteBrick');
                }
                
                // Building foundation - red/white tile floor
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        this.setBlock(x + dx, y - 1, z + dz, (dx + dz) % 2 === 0 ? 'whiteBrick' : 'redBrick');
                    }
                }
                
                // Walls
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        for (let dy = 0; dy < h; dy++) {
                            const isWall = dx === 0 || dx === w - 1 || dz === 0 || dz === d - 1;
                            if (isWall && Math.random() > ruinFactor) {
                                // Front entrance (double doors)
                                if (dz === d - 1 && dx >= 4 && dx <= 6 && dy < 3) continue;
                                // Windows on front
                                if (dz === d - 1 && (dx === 1 || dx === 2 || dx === 9 || dx === 10) && dy >= 1 && dy <= 2) continue;
                                // Drive-thru window on right side
                                if (dx === w - 1 && dz >= 3 && dz <= 5 && dy >= 1 && dy <= 2) continue;
                                
                                // Color scheme: red bottom, cream top
                                this.setBlock(x + dx, y + dy, z + dz, dy < 2 ? 'redBrick' : 'whiteBrick');
                            }
                        }
                    }
                }
                
                // Flat roof
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        this.setBlock(x + dx, y + h, z + dz, 'redBrick');
                    }
                }
                
                // Drive-thru menu board (on right side approach)
                this.setBlock(x + w + 1, y, z + 7, 'wood');
                this.setBlock(x + w + 1, y + 1, z + 7, 'wood');
                this.setBlock(x + w + 1, y + 2, z + 7, 'obsidian'); // Screen
                this.setBlock(x + w + 1, y + 3, z + 7, 'obsidian');
                
                // Drive-thru order speaker
                this.setBlock(x + w + 1, y, z + 5, 'stone');
                this.setBlock(x + w + 1, y + 1, z + 5, 'cashRegister');
                
                // THE FAMOUS "W" ARCHES - Proper W shape (golden arches inverted)
                const wX = x + w / 2;
                const wZ = z + d;
                const wY = y + h;
                
                // Left arch of W (upside down U)
                this.setBlock(wX - 3, wY + 0, wZ, 'sand');
                this.setBlock(wX - 3, wY + 1, wZ, 'sand');
                this.setBlock(wX - 3, wY + 2, wZ, 'sand');
                this.setBlock(wX - 3, wY + 3, wZ, 'sand');
                this.setBlock(wX - 2, wY + 3, wZ, 'sand');
                this.setBlock(wX - 2, wY + 4, wZ, 'sand');
                this.setBlock(wX - 1, wY + 4, wZ, 'sand');
                this.setBlock(wX - 1, wY + 3, wZ, 'sand');
                this.setBlock(wX - 1, wY + 2, wZ, 'sand');
                this.setBlock(wX - 1, wY + 1, wZ, 'sand');
                
                // Middle dip of W
                this.setBlock(wX, wY + 0, wZ, 'sand');
                this.setBlock(wX, wY + 1, wZ, 'sand');
                
                // Right arch of W (upside down U)
                this.setBlock(wX + 1, wY + 1, wZ, 'sand');
                this.setBlock(wX + 1, wY + 2, wZ, 'sand');
                this.setBlock(wX + 1, wY + 3, wZ, 'sand');
                this.setBlock(wX + 1, wY + 4, wZ, 'sand');
                this.setBlock(wX + 2, wY + 4, wZ, 'sand');
                this.setBlock(wX + 2, wY + 3, wZ, 'sand');
                this.setBlock(wX + 3, wY + 3, wZ, 'sand');
                this.setBlock(wX + 3, wY + 2, wZ, 'sand');
                this.setBlock(wX + 3, wY + 1, wZ, 'sand');
                this.setBlock(wX + 3, wY + 0, wZ, 'sand');
                
                // Interior - service counter with cash registers
                for (let dx = 1; dx < 8; dx++) {
                    this.setBlock(x + dx, y, z + 2, 'counter');
                    if (dx % 2 === 0) {
                        this.setBlock(x + dx, y + 1, z + 2, 'cashRegister');
                    }
                }
                
                // Kitchen area behind counter
                for (let dx = 1; dx < 4; dx++) {
                    this.setBlock(x + dx, y, z + 1, 'stove');
                }
                for (let dx = 4; dx < 8; dx++) {
                    this.setBlock(x + dx, y, z + 1, 'counter');
                }
                this.setBlock(x + 8, y, z + 1, 'fridge');
                this.setBlock(x + 8, y + 1, z + 1, 'fridge');
                
                // Seating area - booths with tables and stools
                for (let booth = 0; booth < 2; booth++) {
                    const bx = 2 + booth * 4;
                    const bz = 6 + booth * 2;
                    this.setBlock(x + bx, y, z + bz, 'stool');
                    this.setBlock(x + bx + 1, y, z + bz, 'table');
                    this.setBlock(x + bx + 2, y, z + bz, 'stool');
                }
                
                // Glowstone lighting and lamps
                this.setBlock(x + 2, y + h - 1, z + 4, 'glowstone');
                this.setBlock(x + 6, y + h - 1, z + 8, 'glowstone');
                this.setBlock(x + 3, y + 1, z + 6, 'lamp');
                
                // Treasure chest behind counter
                this.setBlock(x + 4, y, z + 1, 'buildingChest');
                this.chestContents = this.chestContents || {};
                const chestKey = `${x + 4},${y},${z + 1}`;
                if (Math.random() < 0.35) {
                    this.chestContents[chestKey] = [{ type: 'berdger', count: 1 }];
                } else {
                    this.chestContents[chestKey] = [
                        { type: 'apple', count: 5 + Math.floor(Math.random() * 5) },
                        { type: 'seeds', count: 2 + Math.floor(Math.random() * 4) }
                    ];
                }
                
                // Extra barrel in kitchen
                this.setBlock(x + 7, y, z + 1, 'barrel');
                this.chestContents[`${x + 7},${y},${z + 1}`] = [
                    { type: 'apple', count: 8 + Math.floor(Math.random() * 8) }
                ];
            },
            
            // WcDonald's Dine-In - larger restaurant with more seating
            generateWcDonaldsDineIn(x, y, z) {
                const w = 16, d = 14, h = 6;
                const ruinFactor = 0.12;
                
                // Clear interior
                for (let dx = 1; dx < w - 1; dx++) {
                    for (let dz = 1; dz < d - 1; dz++) {
                        for (let dy = 0; dy < h + 3; dy++) {
                            const existing = this.getBlock(x + dx, y + dy, z + dz);
                            if (existing && existing !== 'water' && existing !== 'lava') {
                                this.setBlock(x + dx, y + dy, z + dz, null);
                            }
                        }
                    }
                }
                
                // Foundation
                for (let dx = -1; dx < w + 1; dx++) {
                    for (let dz = -1; dz < d + 1; dz++) {
                        this.setBlock(x + dx, y - 1, z + dz, 'brick');
                    }
                }
                
                // Checkered floor
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        this.setBlock(x + dx, y - 1, z + dz, (dx + dz) % 2 === 0 ? 'whiteBrick' : 'redBrick');
                    }
                }
                
                // Walls
                for (let dx = 0; dx < w; dx++) {
                    for (let dz = 0; dz < d; dz++) {
                        for (let dy = 0; dy < h; dy++) {
                            const isWall = dx === 0 || dx === w - 1 || dz === 0 || dz === d - 1;
                            if (isWall && Math.random() > ruinFactor) {
                                // Grand entrance
                                if (dz === d - 1 && dx >= 5 && dx <= 10 && dy < 4) continue;
                                // Large windows
                                if (dz === d - 1 && (dx <= 3 || dx >= 12) && dy >= 1 && dy <= 3) continue;
                                if (dx === 0 && dz >= 3 && dz <= 10 && dy >= 1 && dy <= 3) continue;
                                if (dx === w - 1 && dz >= 3 && dz <= 10 && dy >= 1 && dy <= 3) continue;
                                
                                this.setBlock(x + dx, y + dy, z + dz, dy < 3 ? 'brick' : 'whiteBrick');
                            }
                        }
                    }
                }
                
                // Roof with skylights
                for (let dx = -1; dx < w + 1; dx++) {
                    for (let dz = -1; dz < d + 1; dz++) {
                        if (Math.random() > ruinFactor * 0.3) {
                            // Skylights in center
                            if ((dx === 7 || dx === 8) && (dz === 6 || dz === 7)) {
                                this.setBlock(x + dx, y + h, z + dz, 'glowstone');
                            } else {
                                this.setBlock(x + dx, y + h, z + dz, 'brick');
                            }
                        }
                    }
                }
                
                // Giant W arches on front - PROPER W SHAPE
                const wX = x + 8;
                const wZ = z + d;
                const wY = y + h;
                
                // Left arch of W (upside down U shape)
                this.setBlock(wX - 4, wY + 0, wZ, 'sand');
                this.setBlock(wX - 4, wY + 1, wZ, 'sand');
                this.setBlock(wX - 4, wY + 2, wZ, 'sand');
                this.setBlock(wX - 4, wY + 3, wZ, 'sand');
                this.setBlock(wX - 4, wY + 4, wZ, 'sand');
                this.setBlock(wX - 3, wY + 4, wZ, 'sand');
                this.setBlock(wX - 3, wY + 5, wZ, 'sand');
                this.setBlock(wX - 2, wY + 5, wZ, 'sand');
                this.setBlock(wX - 2, wY + 4, wZ, 'sand');
                this.setBlock(wX - 2, wY + 3, wZ, 'sand');
                this.setBlock(wX - 2, wY + 2, wZ, 'sand');
                this.setBlock(wX - 2, wY + 1, wZ, 'sand');
                
                // Middle dip of W
                this.setBlock(wX - 1, wY + 0, wZ, 'sand');
                this.setBlock(wX, wY + 0, wZ, 'sand');
                this.setBlock(wX, wY + 1, wZ, 'sand');
                this.setBlock(wX + 1, wY + 0, wZ, 'sand');
                
                // Right arch of W (upside down U shape)
                this.setBlock(wX + 2, wY + 1, wZ, 'sand');
                this.setBlock(wX + 2, wY + 2, wZ, 'sand');
                this.setBlock(wX + 2, wY + 3, wZ, 'sand');
                this.setBlock(wX + 2, wY + 4, wZ, 'sand');
                this.setBlock(wX + 2, wY + 5, wZ, 'sand');
                this.setBlock(wX + 3, wY + 5, wZ, 'sand');
                this.setBlock(wX + 3, wY + 4, wZ, 'sand');
                this.setBlock(wX + 4, wY + 4, wZ, 'sand');
                this.setBlock(wX + 4, wY + 3, wZ, 'sand');
                this.setBlock(wX + 4, wY + 2, wZ, 'sand');
                this.setBlock(wX + 4, wY + 1, wZ, 'sand');
                this.setBlock(wX + 4, wY + 0, wZ, 'sand');
                
                // Long service counter with cash registers
                for (let dx = 2; dx < 14; dx++) {
                    this.setBlock(x + dx, y, z + 2, 'counter');
                    if (dx % 3 === 0) {
                        this.setBlock(x + dx, y + 1, z + 2, 'cashRegister');
                    }
                }
                
                // Kitchen behind counter (stoves, counters, fridge)
                for (let dx = 2; dx < 7; dx++) {
                    this.setBlock(x + dx, y, z + 1, 'stove');
                }
                for (let dx = 7; dx < 12; dx++) {
                    this.setBlock(x + dx, y, z + 1, 'counter');
                }
                this.setBlock(x + 12, y, z + 1, 'fridge');
                this.setBlock(x + 12, y + 1, z + 1, 'fridge');
                this.setBlock(x + 13, y, z + 1, 'fridge');
                this.setBlock(x + 13, y + 1, z + 1, 'fridge');
                
                // Sink station
                this.setBlock(x + 2, y, z + 1, 'sink');
                
                // Multiple booth sections with tables and stools
                for (let section = 0; section < 3; section++) {
                    for (let row = 0; row < 2; row++) {
                        const bx = 2 + section * 4;
                        const bz = 5 + row * 3;
                        this.setBlock(x + bx, y, z + bz, 'stool');
                        this.setBlock(x + bx + 1, y, z + bz, 'table');
                        this.setBlock(x + bx + 2, y, z + bz, 'stool');
                        // Table lamps
                        if (row === 0) {
                            this.setBlock(x + bx + 1, y + 1, z + bz, 'lamp');
                        }
                    }
                }
                
                // Play area in corner (kids section!) with decorative plants
                this.setBlock(x + 13, y, z + 5, 'plant');
                this.setBlock(x + 13, y + 1, z + 5, 'cherryLeaves');
                this.setBlock(x + 14, y, z + 6, 'plant');
                this.setBlock(x + 13, y, z + 7, 'chair');
                this.setBlock(x + 14, y, z + 7, 'table');
                this.setBlock(x + 13, y + 1, z + 8, 'cherryLeaves');
                
                // Lighting
                for (let lx = 3; lx < w - 2; lx += 4) {
                    for (let lz = 4; lz < d - 2; lz += 4) {
                        this.setBlock(x + lx, y + h - 1, z + lz, 'glowstone');
                    }
                }
                
                // Main treasure chest
                this.setBlock(x + 7, y, z + 1, 'buildingChest');
                this.chestContents = this.chestContents || {};
                const chestKey = `${x + 7},${y},${z + 1}`;
                if (Math.random() < 0.4) {
                    this.chestContents[chestKey] = [
                        { type: 'berdger', count: 1 },
                        { type: 'apple', count: 3 }
                    ];
                } else {
                    this.chestContents[chestKey] = [
                        { type: 'apple', count: 10 + Math.floor(Math.random() * 10) },
                        { type: 'seeds', count: 5 + Math.floor(Math.random() * 5) }
                    ];
                }
                
                // Storage room barrels
                this.setBlock(x + 1, y, z + 1, 'barrel');
                this.chestContents[`${x + 1},${y},${z + 1}`] = [
                    { type: 'apple', count: 12 }
                ];
                this.setBlock(x + 14, y, z + 1, 'crate');
                this.chestContents[`${x + 14},${y},${z + 1}`] = [
                    { type: 'wood', count: 8 },
                    { type: 'brick', count: 4 }
                ];
            },
            
            getHighestBlock(x, z) {
                for (let y = 30; y >= 0; y--) {
                    if (this.getBlock(x, y, z)) return y;
                }
                return null;
            },
            

            
            // Check if bird would collide with blocks
            checkBirdCollision(x, y, z, radius = 0.5) {
                // Check blocks around bird position
                const bx = Math.floor(x);
                const by = Math.floor(y);
                const bz = Math.floor(z);
                
                // Check 3x3x3 area around bird
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dz = -1; dz <= 1; dz++) {
                            const block = this.getBlock(bx + dx, by + dy, bz + dz);
                            // getBlock returns undefined for air, so check if block exists and is solid
                            if (block && block !== 'water') {
                                // Calculate distance to block center
                                const blockX = bx + dx + 0.5;
                                const blockY = by + dy + 0.5;
                                const blockZ = bz + dz + 0.5;
                                const dist = Math.sqrt(
                                    (x - blockX) ** 2 + 
                                    (y - blockY) ** 2 + 
                                    (z - blockZ) ** 2
                                );
                                if (dist < radius + 0.7) return true; // Collision
                            }
                        }
                    }
                }
                return false; // No collision
            },
            
            // Check if area is clear for structure placement
            checkStructureCollision(x, y, z, width, height, depth) {
                // Blocks that don't count as collision (natural/terrain blocks)
                const ignoredBlocks = [
                    'grass', 'dirt', 'sand', 'stone', 'leaves', 'cherryLeaves', 'appleLeaves',
                    'wood', 'cherryWood', 'water', 'lava', 'mossyStone', 'deepslate',
                    'snow', 'ice', 'flowers'
                ];
                
                // Check if this area overlaps with any existing structures
                let structureBlockCount = 0;
                for (let dx = 0; dx < width; dx++) {
                    for (let dy = 0; dy < height; dy++) {
                        for (let dz = 0; dz < depth; dz++) {
                            const block = this.getBlock(x + dx, y + dy, z + dz);
                            // Only count as collision if it's a structure block (not natural)
                            if (block && !ignoredBlocks.includes(block)) {
                                structureBlockCount++;
                                // Allow small overlap but not major
                                if (structureBlockCount > 5) {
                                    return true; // Collision detected
                                }
                            }
                        }
                    }
                }
                return false; // Area is clear enough
            },
            
            // Find nearest clear spot for structure
            findClearSpot(centerX, centerZ, width, depth, searchRadius = 20) {
                // Try to find a clear spot near the center
                for (let radius = 0; radius < searchRadius; radius++) {
                    // Try positions in a circle around center
                    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
                        const testX = Math.floor(centerX + Math.cos(angle) * radius);
                        const testZ = Math.floor(centerZ + Math.sin(angle) * radius);
                        const groundY = this.getGroundHeight(testX, testZ);
                        
                        // Check if this spot is clear
                        if (!this.checkStructureCollision(testX, groundY, testZ, width, 10, depth)) {
                            return { x: testX, y: groundY, z: testZ };
                        }
                    }
                }
                
                // Fallback: return original position
                const groundY = this.getGroundHeight(centerX, centerZ);
                return { x: centerX, y: groundY, z: centerZ };
            },

            
            // Toggle sneak mode
            toggleSneak() {
                this.camera.sneaking = !this.camera.sneaking;
                console.log('Sneaking:', this.camera.sneaking);
            },
            
            // Get current eye height based on sneak state
            getEyeHeight() {
                if (!this.camera.sneaking) {
                    return this.camera.normalHeight || 0.6; // Use camera property
                }
                return this.camera.sneakHeight || 0.2; // Use camera property
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
                        this.pestBirds.sort((a, b) => b.anger - a.anger);
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
                            // Try to move, but check for collisions
                            const newX = bird.x + (dx / dist) * 0.15;
                            const newY = bird.y + (dy / dist) * 0.1;
                            const newZ = bird.z + (dz / dist) * 0.15;
                            
                            // Move in X if no collision
                            if (!this.checkBirdCollision(newX, bird.y, bird.z, 0.3)) {
                                bird.x = newX;
                            } else {
                                // Try going around - move perpendicular
                                bird.x += (dz / dist) * 0.1; // Move sideways
                            }
                            
                            // Move in Y if no collision
                            if (!this.checkBirdCollision(bird.x, newY, bird.z, 0.3)) {
                                bird.y = newY;
                            }
                            
                            // Move in Z if no collision
                            if (!this.checkBirdCollision(bird.x, bird.y, newZ, 0.3)) {
                                bird.z = newZ;
                            } else {
                                // Try going around - move perpendicular
                                bird.z += (dx / dist) * 0.1; // Move sideways
                            }
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
                this.updateRepairNPC();
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
                    
                    // Apply velocity with drag - check collisions
                    const newX = bird.x + bird.vx;
                    const newY = bird.y + bird.vy;
                    const newZ = bird.z + bird.vz;
                    
                    if (!this.checkBirdCollision(newX, bird.y, bird.z, 0.3)) {
                        bird.x = newX;
                    } else {
                        bird.vx *= -0.5; // Bounce off walls
                    }
                    
                    if (!this.checkBirdCollision(bird.x, newY, bird.z, 0.3)) {
                        bird.y = newY;
                    } else {
                        bird.vy *= -0.5; // Bounce off ceiling/floor
                    }
                    
                    if (!this.checkBirdCollision(bird.x, bird.y, newZ, 0.3)) {
                        bird.z = newZ;
                    } else {
                        bird.vz *= -0.5; // Bounce off walls
                    }
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
            
            // Update wandering repair NPC
            spawnRepairNPC() {
                if (this.repairNPC) return; // Only one NPC at a time
                
                if (!this.worldBounds) return;
                
                // Spawn within safe bounds (10 blocks from forcefield to avoid edge)
                const bounds = this.worldBounds;
                const safeMinX = bounds.minX + 10;
                const safeMaxX = bounds.maxX - 10;
                const safeMinZ = bounds.minZ + 10;
                const safeMaxZ = bounds.maxZ - 10;
                
                this.debugLog('🔍 Attempting to spawn Gunsmith Wizard...', 'info');
                this.debugLog(`  Player at: (${this.camera.x.toFixed(1)}, ${this.camera.y.toFixed(1)}, ${this.camera.z.toFixed(1)})`, 'info');
                this.debugLog(`  Safe bounds: X[${safeMinX.toFixed(0)}, ${safeMaxX.toFixed(0)}] Z[${safeMinZ.toFixed(0)}, ${safeMaxZ.toFixed(0)}]`, 'info');
                
                // Find valid spawn location with proper surface block
                let spawnX = 0, spawnY = 0, spawnZ = 0;
                let foundValidSpawn = false;
                const maxAttempts = 100; // Try many times to find valid spot
                let spawnAttemptLog = [];
                
                for (let attempts = 0; attempts < maxAttempts; attempts++) {
                    // Try random position 15-25 blocks from player
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 15 + Math.random() * 10;
                    let testX = this.camera.x + Math.cos(angle) * dist;
                    let testZ = this.camera.z + Math.sin(angle) * dist;
                    
                    // Clamp to safe bounds
                    testX = Math.max(safeMinX, Math.min(safeMaxX, testX));
                    testZ = Math.max(safeMinZ, Math.min(safeMaxZ, testZ));
                    
                    const bx = Math.floor(testX);
                    const bz = Math.floor(testZ);
                    
                    // Search downward from Y=25 to find valid surface
                    for (let y = 25; y >= 1; y--) {
                        const blockType = this.getBlock(bx, y, bz);
                        
                        // MUST be grass or sand - nothing else is valid!
                        if (blockType === 'grass' || blockType === 'sand') {
                            // Check that there's air above (3 blocks clearance)
                            const air1 = !this.getBlock(bx, y + 1, bz);
                            const air2 = !this.getBlock(bx, y + 2, bz);
                            const air3 = !this.getBlock(bx, y + 3, bz);
                            
                            if (air1 && air2 && air3) {
                                // Found perfect spot! Spawn standing on this block
                                spawnX = testX;
                                spawnY = y + 1; // Stand on top of the grass/sand block
                                spawnZ = testZ;
                                foundValidSpawn = true;
                                
                                // Log first 5 attempts for debugging
                                if (attempts < 5) {
                                    spawnAttemptLog.push(`  Attempt ${attempts}: Found valid at (${bx}, ${y+1}, ${bz}) on ${blockType}`);
                                }
                                break;
                            } else {
                                if (attempts < 5) {
                                    spawnAttemptLog.push(`  Attempt ${attempts}: (${bx}, ${y}, ${bz}) ${blockType} - blocked above: ${!air1 ? 'Y+1' : ''} ${!air2 ? 'Y+2' : ''} ${!air3 ? 'Y+3' : ''}`);
                                }
                            }
                        }
                    }
                    
                    if (foundValidSpawn) break; // Success!
                    
                    // Log failures for first 5 attempts
                    if (attempts < 5 && !foundValidSpawn) {
                        const blockAt10 = this.getBlock(bx, 10, bz) || 'air';
                        const blockAt9 = this.getBlock(bx, 9, bz) || 'air';
                        spawnAttemptLog.push(`  Attempt ${attempts}: (${bx}, ?, ${bz}) - no grass/sand found (Y=10: ${blockAt10}, Y=9: ${blockAt9})`);
                    }
                }
                
                // Log attempt details
                for (const log of spawnAttemptLog) {
                    this.debugLog(log, 'info');
                }
                
                if (!foundValidSpawn) {
                    this.debugLog('⚠️ Failed to find valid spawn location for gunsmith after 100 attempts', 'warn');
                    return;
                }
                
                // Spawn at the validated position (not Y=30!)
                this.repairNPC = {
                    x: spawnX,
                    y: spawnY, // Actual validated ground level + 1
                    z: spawnZ,
                    vx: 0,
                    vy: 0,
                    vz: 0,
                    onGround: true, // Already on ground
                    wanderTargetX: spawnX,
                    wanderTargetZ: spawnZ,
                    nextWanderTime: Date.now() + 3000,
                    showPrompt: false,
                    lastSpoke: 0
                };
                
                const blockBelow = this.getBlock(Math.floor(spawnX), Math.floor(spawnY - 1), Math.floor(spawnZ));
                const blockAt = this.getBlock(Math.floor(spawnX), Math.floor(spawnY), Math.floor(spawnZ));
                
                this.debugLog('✨ Gunsmith Wizard spawned!', 'success');
                this.debugLog(`  Position: (${spawnX.toFixed(2)}, ${spawnY}, ${spawnZ.toFixed(2)})`, 'success');
                this.debugLog(`  Standing on: ${blockBelow || 'air'} at Y=${spawnY - 1}`, 'success');
                this.debugLog(`  Block at feet: ${blockAt || 'air (correct)'}`, blockAt ? 'warn' : 'success');
                
                // Verify ground height function agrees
                const groundCheck = this.getGroundHeightBelow(spawnX, spawnZ, spawnY + 5);
                if (groundCheck !== spawnY) {
                    this.debugLog(`  ⚠️ getGroundHeightBelow disagrees! Returns ${groundCheck}, expected ${spawnY}`, 'warn');
                }
            },
            
            updateRepairNPC() {
                if (!this.repairNPC) {
                    // Spawn NPC occasionally (1% chance per update if none exists)
                    // Spawns after wave 0 (immediately available)
                    if (Math.random() < 0.01) {
                        this.spawnRepairNPC();
                    }
                    return;
                }
                
                const npc = this.repairNPC;
                
                // Keep NPC within safe bounds
                if (this.worldBounds) {
                    const bounds = this.worldBounds;
                    const safeMinX = bounds.minX + 3;
                    const safeMaxX = bounds.maxX - 3;
                    const safeMinZ = bounds.minZ + 3;
                    const safeMaxZ = bounds.maxZ - 3;
                    
                    // Clamp position
                    npc.x = Math.max(safeMinX, Math.min(safeMaxX, npc.x));
                    npc.z = Math.max(safeMinZ, Math.min(safeMaxZ, npc.z));
                    
                    // If wander target is outside bounds, pick a new one
                    if (npc.wanderTargetX && (
                        npc.wanderTargetX < safeMinX || npc.wanderTargetX > safeMaxX ||
                        npc.wanderTargetZ < safeMinZ || npc.wanderTargetZ > safeMaxZ
                    )) {
                        npc.wanderTargetX = null; // Force new target
                    }
                }
                
                // Gravity
                npc.vy -= 0.03;
                npc.y += npc.vy;
                
                // Ground collision - NPC Y is at feet level, so pass eyeHeight=0
                const groundY = this.getGroundHeightBelow(npc.x, npc.z, npc.y, 0);
                if (npc.y <= groundY) {
                    // Log if NPC teleported significantly (fell through ground)
                    if (npc.lastLoggedY !== undefined && Math.abs(groundY - npc.lastLoggedY) > 2) {
                        this.debugLog(`⚠️ Gunsmith Y changed significantly: ${npc.lastLoggedY} → ${groundY}`, 'warn');
                        const blockBelow = this.getBlock(Math.floor(npc.x), groundY - 1, Math.floor(npc.z));
                        this.debugLog(`  Now standing on: ${blockBelow || 'nothing'} at Y=${groundY - 1}`, 'warn');
                    }
                    npc.lastLoggedY = groundY;
                    npc.y = groundY;
                    npc.vy = 0;
                    npc.onGround = true;
                } else {
                    npc.onGround = false;
                }
                
                // Wandering behavior
                if (Date.now() > npc.nextWanderTime || !npc.wanderTargetX) {
                    // Pick new random target nearby - but verify it has ground
                    let validTarget = false;
                    for (let attempt = 0; attempt < 10; attempt++) {
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 3 + Math.random() * 6; // Shorter range to stay safe
                        const testX = npc.x + Math.cos(angle) * dist;
                        const testZ = npc.z + Math.sin(angle) * dist;
                        
                        // Check if there's solid ground at target
                        const groundY = this.getGroundHeight(testX, testZ);
                        if (groundY > 0) { // Has valid ground
                            npc.wanderTargetX = testX;
                            npc.wanderTargetZ = testZ;
                            validTarget = true;
                            break;
                        }
                    }
                    if (!validTarget) {
                        // Stay in place if no valid target found
                        npc.wanderTargetX = npc.x;
                        npc.wanderTargetZ = npc.z;
                    }
                    npc.nextWanderTime = Date.now() + (3000 + Math.random() * 4000);
                }
                
                // Move toward wander target - but check each step
                if (npc.wanderTargetX !== null) {
                    const dx = npc.wanderTargetX - npc.x;
                    const dz = npc.wanderTargetZ - npc.z;
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    
                    if (dist > 0.5) {
                        const speed = 0.04;
                        const nextVx = (dx / dist) * speed;
                        const nextVz = (dz / dist) * speed;
                        
                        // Check if next position has valid ground
                        const nextX = npc.x + nextVx;
                        const nextZ = npc.z + nextVz;
                        const nextGroundY = this.getGroundHeight(nextX, nextZ);
                        
                        if (nextGroundY > 0 && Math.abs(nextGroundY - npc.y) < 3) {
                            // Safe to move
                            npc.vx = nextVx;
                            npc.vz = nextVz;
                        } else {
                            // Would fall into void - stop and pick new target
                            npc.vx = 0;
                            npc.vz = 0;
                            npc.wanderTargetX = null;
                        }
                    } else {
                        npc.vx = 0;
                        npc.vz = 0;
                        npc.wanderTargetX = null; // Reached target
                    }
                }
                
                // Apply movement
                npc.x += npc.vx;
                npc.z += npc.vz;
                
                // Safety: If NPC fell into void, respawn it near player
                if (npc.y < 0) {
                    this.debugLog('⚠️ Gunsmith fell into void! Respawning...', 'warn');
                    this.repairNPC = null;
                    // Will respawn naturally via updateRepairNPC
                }
                
                // Check for player interaction distance
                const distToPlayer = Math.sqrt(
                    (npc.x - this.camera.x) ** 2 + 
                    (npc.z - this.camera.z) ** 2
                );
                
                // Only show prompt if close AND cursor is over the NPC
                let isLookingAtNPC = false;
                if (distToPlayer < 4) {
                    // Calculate look direction from camera
                    const lookDirX = -Math.sin(this.camera.rotY) * Math.cos(this.camera.rotX);
                    const lookDirY = Math.sin(this.camera.rotX);
                    const lookDirZ = Math.cos(this.camera.rotY) * Math.cos(this.camera.rotX);
                    
                    // Calculate direction to NPC center (at head height)
                    const npcHeadY = npc.y + 1.5;
                    const toNpcX = npc.x - this.camera.x;
                    const toNpcY = npcHeadY - this.camera.y;
                    const toNpcZ = npc.z - this.camera.z;
                    const toNpcDist = Math.sqrt(toNpcX * toNpcX + toNpcY * toNpcY + toNpcZ * toNpcZ);
                    
                    if (toNpcDist > 0.1) {
                        const toNpcNormX = toNpcX / toNpcDist;
                        const toNpcNormY = toNpcY / toNpcDist;
                        const toNpcNormZ = toNpcZ / toNpcDist;
                        
                        // Dot product to check if looking at NPC
                        const dot = lookDirX * toNpcNormX + lookDirY * toNpcNormY + lookDirZ * toNpcNormZ;
                        
                        // Need to be looking quite precisely at NPC (within ~15 degrees)
                        isLookingAtNPC = dot > 0.96;
                    }
                }
                
                npc.showPrompt = isLookingAtNPC;
                
                // Despawn if too far from player
                if (distToPlayer > 60) {
                    this.repairNPC = null;
                    this.debugLog('The repair NPC wandered away...', 'info');
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
            generateRitualTemple(x, y, z) {
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
            generateTree(x, y, z) {
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
            generateCherryTree(x, y, z) {
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
            
            setBlock(x, y, z, type) {
                const key = `${x},${y},${z}`;
                if (type === null) {
                    delete this.world[key];
                } else {
                    this.world[key] = type;
                }
            },
            
            getBlock(x, y, z) {
                return this.world[`${x},${y},${z}`] || null;
            },
            
            setupControls() {
                // Keyboard controls
                document.addEventListener('keydown', (e) => {
                    // Debug console accessible even when paused/inactive
                    if (e.key === '`' || e.key === '~') {
                        e.preventDefault();
                        this.toggleDebugConsole();
                        return;
                    }
                    
                    if (!this.isActive) return;
                    
                    // Block all game input when debug console is open
                    if (this.debugConsoleOpen) return;
                    
                    // CRITICAL: Prevent Ctrl+W from closing tab (standard for browser games)
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
                        e.preventDefault();
                        e.stopPropagation();
                        // W key still registered for movement below
                    }
                    
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        
                        // Priority order: dialogue > journal > container > inventory > pause
                        if (this.dialogueOpen) {
                            this.closeDialogue();
                            return;
                        }
                        
                        if (this.journalOpen) {
                            this.toggleJournal();
                            return;
                        }
                        
                        // If container is open, close it
                        if (this.containerOpen) {
                            this.closeContainer();
                            return;
                        }
                        
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
                    
                    // J key - toggle journal (works even when journal is open)
                    if (e.key.toLowerCase() === 'j' && !e.repeat) {
                        this.toggleJournal();
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
                    
                    // E key - Check for NPC interaction first (only if looking at NPC), then inventory
                    if (e.key.toLowerCase() === 'e') {
                        // Check if near AND looking at repair NPC
                        if (this.repairNPC) {
                            const distToNPC = Math.sqrt(
                                (this.repairNPC.x - this.camera.x) ** 2 + 
                                (this.repairNPC.z - this.camera.z) ** 2
                            );
                            
                            // Check if player is actually looking at the NPC
                            if (distToNPC < 4) {
                                // Calculate direction player is looking
                                const lookDirX = -Math.sin(this.camera.rotY);
                                const lookDirZ = Math.cos(this.camera.rotY);
                                
                                // Calculate direction to NPC
                                const toNpcX = this.repairNPC.x - this.camera.x;
                                const toNpcZ = this.repairNPC.z - this.camera.z;
                                const toNpcDist = Math.sqrt(toNpcX * toNpcX + toNpcZ * toNpcZ);
                                const toNpcNormX = toNpcX / toNpcDist;
                                const toNpcNormZ = toNpcZ / toNpcDist;
                                
                                // Dot product to check if facing NPC (cos of angle)
                                const dot = lookDirX * toNpcNormX + lookDirZ * toNpcNormZ;
                                
                                // Only open dialogue if looking roughly at NPC (within ~60 degrees)
                                if (dot > 0.5) {
                                    this.openDialogue('gunsmith');
                                    return; // Don't open inventory
                                }
                            }
                        }
                        
                        // Normal inventory toggle
                        this.toggleInventory();
                    }
                    
                    // Toggle sneak with C
                    if (e.key.toLowerCase() === 'c' && !e.repeat) {
                        this.toggleSneak();
                    }
                    
                    // Hold to sneak with Ctrl
                    if (e.key === 'Control' && !e.repeat) {
                        if (!this.camera.sneaking) {
                            this.toggleSneak();
                            this.camera.sneakingWithCtrl = true; // Track that we enabled via Ctrl
                        }
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
                    

                    
                    // Jump is handled in update() for continuous jumping while holding space
                    
                    e.preventDefault();
                });
                
                document.addEventListener('keyup', (e) => {
                    this.keys[e.key.toLowerCase()] = false;
                    
                    // Release Ctrl sneak
                    if (e.key === 'Control' && this.camera.sneakingWithCtrl) {
                        this.camera.sneakingWithCtrl = false;
                        if (this.camera.sneaking) {
                            this.toggleSneak(); // Turn off sneak
                        }
                    }
                });
                
                // ===== POINTER LOCK CONTROLS (Industry Standard for Browser FPS) =====
                // Pointer Lock is the ONLY way to truly capture mouse across monitors
                
                this.pointerLocked = false;
                
                // Pointer lock state change handler
                document.addEventListener('pointerlockchange', () => {
                    this.pointerLocked = document.pointerLockElement === this.canvas;
                    
                    if (this.pointerLocked) {
                        // Successfully locked - hide overlay
                        document.getElementById('clickToPlay').classList.remove('active');
                    } else {
                        // Lock released (user pressed ESC or we exited)
                        // If game is active and not paused and no UI is open
                        // and we didn't just close the inventory, pause
                        if (this.isActive && !this.isPaused && !this.inventoryOpen && !this.containerOpen && !this.debugConsoleOpen && !this.dialogueOpen && !this.journalOpen && !this.justClosedInventory) {
                            this.pause();
                        }
                    }
                });
                
                // Pointer lock error handler
                document.addEventListener('pointerlockerror', () => {
                    console.log('Pointer lock failed');
                    // Show the click overlay so user can try again
                    if (this.isActive && !this.isPaused) {
                        document.getElementById('clickToPlay').classList.add('active');
                    }
                });
                
                // Mouse button handler - works during pointer lock
                this.canvas.addEventListener('mousedown', (e) => {
                    if (!this.isActive || this.isPaused) return;
                    
                    // Don't break/place blocks while debug console is open
                    if (this.debugConsoleOpen) return;
                    
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
                                // Blocks that don't drop anything
                                const noDropBlocks = ['bedrock'];
                                if (noDropBlocks.includes(blockType)) {
                                    // Don't drop, and don't break bedrock
                                    this.setBlock(hit.hit.x, hit.hit.y, hit.hit.z, blockType);
                                    return;
                                }
                                
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
                                } else if (blockType === 'leaves') {
                                    // Regular leaves sometimes drop sticks or seeds
                                    this.dropItem(hit.hit.x + 0.5, hit.hit.y + 0.5, hit.hit.z + 0.5, 'leaves', 1);
                                    if (Math.random() < 0.08) {
                                        this.dropItem(hit.hit.x + 0.5, hit.hit.y + 0.5, hit.hit.z + 0.5, 'seeds', 1);
                                    }
                                } else {
                                    // All other blocks drop themselves
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
                        // First check for container/chest interaction
                        const hit = this.raycast();
                        if (hit && hit.hit) {
                            const hitBlock = this.getBlock(hit.hit.x, hit.hit.y, hit.hit.z);
                            
                            // List of all container types
                            const containerTypes = [
                                'chest', 'ritualChest', 'buildingChest', 'dungeonChest',
                                'barrel', 'crate', 'furnace', 'furnaceActive',
                                'alchemyTable', 'storageShrine'
                            ];
                            
                            // Check for any container type
                            if (hitBlock && (containerTypes.includes(hitBlock) || hitBlock.toLowerCase().includes('chest'))) {
                                this.openContainer(hit.hit.x, hit.hit.y, hit.hit.z, hitBlock);
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
                        
                        if (this.selectedItem === 'ka69') {
                            // Shoot the KA-69!
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
                                    this.updateHotbarDisplay();
                                }
                            }
                        } else if (this.selectedBlock) {
                            // Place block
                            const hit = this.raycast();
                            if (hit && hit.place) {
                                const placePos = hit.place;
                                
                                // CRITICAL: Check what's at the placement position
                                const existingBlock = this.getBlock(placePos.x, placePos.y, placePos.z);
                                
                                // Only allow placement if position is air, water, or lava
                                // NEVER replace solid blocks!
                                if (existingBlock && existingBlock !== 'water' && existingBlock !== 'lava') {
                                    // There's a solid block here - cannot place!
                                    return;
                                }
                                
                                // Don't place block inside player
                                const px = Math.floor(this.camera.x);
                                const pz = Math.floor(this.camera.z);
                                
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
                
                // Prevent context menu from appearing (except when debug console is open)
                document.getElementById('minecraftGame').addEventListener('contextmenu', (e) => {
                    if (!this.debugConsoleOpen) {
                        e.preventDefault();
                    }
                });
                
                // Scroll wheel - change hotbar selection
                this.canvas.addEventListener('wheel', (e) => {
                    if (!this.isActive || this.isPaused || this.inventoryOpen || this.debugConsoleOpen) return;
                    e.preventDefault();
                    
                    // Scroll down = next slot, scroll up = previous slot
                    if ((e as WheelEvent).deltaY > 0) {
                        this.selectedSlot = (this.selectedSlot + 1) % 9;
                    } else if ((e as WheelEvent).deltaY < 0) {
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
                        
                        // Show hotbar tooltip
                        const itemNames = {
                            grass: 'Grass Block', dirt: 'Dirt', stone: 'Stone', wood: 'Wood',
                            leaves: 'Leaves', water: 'Water', sand: 'Sand', brick: 'Brick',
                            ka69: 'KA-69', water_bucket: 'Water Bucket', lava_bucket: 'Lava Bucket',
                            seed: 'Seed', berdger: 'Berdger', cherry_wood: 'Cherry Wood',
                            cherry_leaves: 'Cherry Leaves', glowstone: 'Burgerstone', 
                            ritual_item: 'Omamori Charm', lava: 'Lava', ice: 'Ice'
                        };
                        const itemId = slot.id || slot.type;
                        const itemName = itemNames[itemId] || itemId;
                        this.hotbarTooltip.text = itemName;
                        this.hotbarTooltip.visible = true;
                        this.hotbarTooltip.timestamp = Date.now();
                        
                        // Auto-hide after 1.5 seconds
                        setTimeout(() => {
                            if (Date.now() - this.hotbarTooltip.timestamp >= 1500) {
                                this.hotbarTooltip.visible = false;
                            }
                        }, 1500);
                    } else {
                        this.selectedBlock = null;
                        this.selectedItem = null;
                    }
                    this.updateHotbar();
                }, { passive: false });
                
                // Also catch wheel events on the game container to prevent page scroll
                const gameContainer = document.getElementById('minecraftGame');
                gameContainer.addEventListener('wheel', (e) => {
                    // Allow scrolling when console or inventory is open
                    if (this.isActive && !this.debugConsoleOpen && !this.inventoryOpen) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, { passive: false });
                
                // Mouse movement - use movementX/Y deltas (works across screen boundaries)
                document.addEventListener('mousemove', (e) => {
                    if (!this.isActive || this.isPaused || !this.pointerLocked || this.debugConsoleOpen) return;
                    
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
                
                // Window resize - DON'T change canvas resolution in fullscreen
                // Instead, let CSS handle scaling for consistent performance
                window.addEventListener('resize', () => {
                    // Canvas stays at base resolution (800x500)
                    // CSS will scale it to fill the screen
                });
                
                // Handle fullscreen changes
                const handleFullscreenChange = () => {
                    const isFs = document.fullscreenElement || document.webkitFullscreenElement;
                    const canvas = this.canvas as HTMLCanvasElement;
                    
                    if (isFs) {
                        // Fullscreen: Use CSS to scale canvas, keep internal resolution
                        canvas.style.width = '100vw';
                        canvas.style.height = '100vh';
                        canvas.style.objectFit = 'contain';
                    } else {
                        // Windowed: Reset to normal size
                        canvas.style.width = '';
                        canvas.style.height = '';
                        canvas.style.objectFit = '';
                    }
                    
                    this.updateFullscreenButton();
                };
                
                document.addEventListener('fullscreenchange', handleFullscreenChange);
                document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
                
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
                document.getElementById('btnResume').addEventListener('click', () => this.resume());
                
                // Fullscreen toggle button
                document.getElementById('btnFullscreen').addEventListener('click', (e) => {
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
                
                // Account button (disabled)
                document.getElementById('btnAccount').addEventListener('click', (e) => {
                    e.preventDefault();
                });
                
                // Stats button
                document.getElementById('btnStats').addEventListener('click', () => {
                    this.showSubmenu('menuStats');
                    this.updateStatsDisplay();
                });
                
                // Options button
                document.getElementById('btnOptions').addEventListener('click', () => {
                    this.showSubmenu('menuOptions');
                });
                
                // Quit button
                document.getElementById('btnQuit').addEventListener('click', () => this.stop());
                
                // Back buttons
                document.getElementById('statsBack').addEventListener('click', () => this.showSubmenu('menuMain'));
                document.getElementById('optionsBack').addEventListener('click', () => this.showSubmenu('menuMain'));
                
                // Options controls
                document.getElementById('optBrightness').addEventListener('input', (e) => {
                    this.settings.brightness = parseInt((e.target as HTMLInputElement).value);
                    this.applyFilters();
                });
                
                document.getElementById('optFilter').addEventListener('change', (e) => {
                    this.settings.filter = (e.target as HTMLInputElement).value;
                    this.applyFilters();
                });
                
                document.getElementById('optRenderDist').addEventListener('change', (e) => {
                    this.settings.renderDistance = parseInt((e.target as HTMLInputElement).value);
                });
                
                document.getElementById('optTreeStyle').addEventListener('change', (e) => {
                    this.settings.treeStyle = (e.target as HTMLSelectElement).value as 'simple' | 'transparent' | 'bushy';
                });
                
                document.getElementById('optTextureMode').addEventListener('change', (e) => {
                    this.settings.textureMode = (e.target as HTMLSelectElement).value as 'fixed' | 'trippy' | 'vacuum';
                });
                
                // Toggle switches
                ['optShadows', 'optLighting', 'optAA', 'optShowFps'].forEach(id => {
                    document.getElementById(id).addEventListener('click', (e) => {
                        const toggle = e.target;
                        const isOn = (toggle as HTMLElement).dataset.on === 'true';
                        (toggle as HTMLElement).dataset.on = (!isOn).toString();
                        (toggle as HTMLElement).classList.toggle('on', !isOn);
                        
                        if (id === 'optShadows') this.settings.shadows = !isOn;
                        if (id === 'optLighting') this.settings.lighting = !isOn;
                        if (id === 'optAA') {
                            this.settings.antialiasing = !isOn;
                            (this.canvas as HTMLCanvasElement).style.imageRendering = !isOn ? 'pixelated' : 'auto';
                        }
                        if (id === 'optShowFps') this.settings.showFps = !isOn;
                    });
                });
                
                // Target FPS slider
                document.getElementById('optTargetFps').addEventListener('input', (e) => {
                    const fps = parseInt((e.target as HTMLInputElement).value);
                    this.settings.targetFps = fps;
                    document.getElementById('targetFpsValue').textContent = String(fps);
                });
            },
            
            showSubmenu(menuId) {
                document.querySelectorAll('.pause-submenu').forEach(m => m.classList.remove('active'));
                document.getElementById(menuId).classList.add('active');
            },
            
            updateStatsDisplay() {
                document.getElementById('statPlaced').textContent = this.stats.blocksPlaced;
                document.getElementById('statBroken').textContent = this.stats.blocksBroken;
                document.getElementById('statDistance').textContent = String(Math.floor(this.stats.distance)) + 'm';
                document.getElementById('statJumps').textContent = this.stats.jumps;
                
                const elapsed = Math.floor((Date.now() - this.stats.startTime) / 1000);
                const mins = Math.floor(elapsed / 60);
                const secs = elapsed % 60;
                document.getElementById('statTime').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
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
                
                (this.canvas as HTMLElement).style.filter = filter;
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
                        (canvas as HTMLCanvasElement).width = 32;
                        (canvas as HTMLCanvasElement).height = 32;
                        (canvas as HTMLElement).style.width = '100%';
                        (canvas as HTMLElement).style.height = '100%';
                        (canvas as HTMLElement).style.position = 'absolute';
                        (canvas as HTMLElement).style.top = '2px';
                        (canvas as HTMLElement).style.left = '2px';
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
                            (fill as HTMLElement).style.width = percent + '%';
                            (fill as HTMLElement).style.backgroundColor = percent > 50 ? '#4a4' : percent > 25 ? '#aa4' : '#a44';
                            (durBar as HTMLElement).style.display = 'block';
                        } else if (durBar) {
                            (durBar as HTMLElement).style.display = 'none';
                        }
                    } else {
                        // Clear canvas for empty slot
                        const ctx = (canvas as HTMLCanvasElement).getContext('2d');
                        ctx.clearRect(0, 0, (canvas as HTMLCanvasElement).width, (canvas as HTMLCanvasElement).height);
                        // Hide durability bar
                        const durBar = slot.querySelector('.durability-bar');
                        if (durBar) (durBar as HTMLElement).style.display = 'none';
                    }
                });
            },
            
            // Shoot the KA-69
            shootAK47() {
                if (this.shootCooldown > 0) return;
                
                // Check durability and reduce it
                const slot = this.inventory.hotbar[this.selectedSlot];
                if (slot && slot.id === 'ka69') {
                    if (slot.durability !== undefined && slot.durability <= 0) {
                        // Gun is broken - can't shoot!
                        this.debugLog('KA-69 is broken! Find the Repair NPC to fix it (15 seeds)', 'warn');
                        return;
                    }
                    // Reduce durability
                    if (slot.durability !== undefined) {
                        slot.durability--;
                        if (slot.durability <= 0) {
                            // Gun breaks but stays in inventory
                            slot.durability = 0; // Set to exactly 0
                            this.debugLog('Your KA-69 broke! Find the Repair NPC (trade 15 seeds)', 'error');
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
            dropItem(x, y, z, type, count) {
                if (!this.droppedItems) this.droppedItems = [];
                this.droppedItems.push({
                    x: x + (Math.random() - 0.5) * 0.3,
                    y: y,
                    z: z + (Math.random() - 0.5) * 0.3,
                    vy: 0.1 + Math.random() * 0.05,
                    type: type,
                    count: count,
                    bobPhase: Math.random() * Math.PI * 2,
                    pickupDelay: 30, // Frames before can be picked up
                    age: 0
                });
            },
            
            // Update dropped items (physics and pickup)
            updateDroppedItems() {
                if (!this.droppedItems) return;
                
                for (let i = this.droppedItems.length - 1; i >= 0; i--) {
                    const item = this.droppedItems[i];
                    
                    // Pickup delay
                    if (item.pickupDelay > 0) item.pickupDelay--;
                    
                    // Check what blocks the item is in/on
                    const bx = Math.floor(item.x);
                    const by = Math.floor(item.y);
                    const bz = Math.floor(item.z);
                    
                    // Check the block directly under the item's base
                    // Items rest at y = blockTop + 0.3, so check block at floor(y - 0.5)
                    const byBelow = Math.floor(item.y - 0.5);
                    
                    const blockAt = this.getBlock(bx, by, bz);
                    const blockBelow = this.getBlock(bx, byBelow, bz);
                    const blockAbove1 = this.getBlock(bx, by + 1, bz);
                    const blockAbove2 = this.getBlock(bx, by + 2, bz);
                    const blockAbove3 = this.getBlock(bx, by + 3, bz);
                    
                    const inWater = blockAt === 'water';
                    const inLava = blockAt === 'lava';
                    const waterAbove = blockAbove1 === 'water' || blockAbove2 === 'water' || blockAbove3 === 'water';
                    const lavaAbove = blockAbove1 === 'lava' || blockAbove2 === 'lava' || blockAbove3 === 'lava';
                    const inFluid = inWater || inLava || waterAbove || lavaAbove;
                    const waterBelow = blockBelow === 'water';
                    const solidBelow = blockBelow && !this.fluidBlocks.includes(blockBelow);
                    
                    // Initialize properties if missing
                    if (item.vy === undefined) item.vy = 0;
                    if (item.bobPhase === undefined) item.bobPhase = Math.random() * Math.PI * 2;
                    if (item.resting === undefined) item.resting = false;
                    
                    // Update bob phase (always runs for smooth animation)
                    item.bobPhase += 0.06;
                    
                    if (inFluid) {
                        // IN FLUID - Float to surface
                        item.resting = false;
                        const buoyancy = (inLava || lavaAbove) ? 0.03 : 0.06;
                        const drag = (inLava || lavaAbove) ? 0.82 : 0.85;
                        
                        item.vy += buoyancy;
                        item.vy *= drag;
                        item.vy = Math.max(-0.05, Math.min(0.20, item.vy));
                        
                        // Find water surface
                        let surfaceY = by + 1;
                        for (let checkY = by; checkY < by + 10; checkY++) {
                            const checkBlock = this.getBlock(bx, checkY, bz);
                            if (checkBlock !== 'water' && checkBlock !== 'lava') {
                                surfaceY = checkY - 0.1;
                                break;
                            }
                        }
                        
                        if (item.y > surfaceY - 0.5 && item.vy > 0) {
                            item.vy *= 0.6;
                        }
                        
                        if (item.y >= surfaceY - 0.3 && item.y <= surfaceY + 0.3 && Math.abs(item.vy) < 0.08) {
                            item.y = surfaceY;
                            item.vy = 0;
                        } else {
                            item.y += item.vy;
                        }
                        
                    } else if (waterBelow && !solidBelow) {
                        // Above water - float on surface
                        item.resting = false;
                        const surfaceY = byBelow + 1.4;
                        
                        if (item.y < surfaceY) {
                            item.vy += 0.02;
                        } else {
                            item.vy -= 0.005;
                        }
                        item.vy *= 0.88;
                        
                        if (Math.abs(item.y - surfaceY) < 0.1 && Math.abs(item.vy) < 0.02) {
                            item.y = surfaceY;
                            item.vy = 0;
                        } else {
                            item.y += item.vy;
                        }
                        
                    } else if (item.resting) {
                        // RESTING ON GROUND - Minecraft-style
                        // Just stay at rest position, bobbing is visual only (in render code)
                        item.vy = 0;
                        
                        // Check if we should stop resting (block removed, etc)
                        if (!solidBelow) {
                            item.resting = false;
                        }
                        
                    } else {
                        // FALLING - Standard gravity
                        item.vy -= 0.025;  // Gravity
                        item.vy *= 0.98;   // Air resistance
                        item.vy = Math.max(-0.5, item.vy);  // Terminal velocity
                        
                        item.y += item.vy;
                        
                        // Ground collision
                        if (solidBelow) {
                            const groundTop = byBelow + 1 + 0.3;  // Block top + small offset
                            if (item.y <= groundTop) {
                                // Land on ground - start resting
                                item.y = groundTop;
                                item.vy = 0;
                                item.resting = true;
                            }
                        } else if (item.y < 1) {
                            // World floor
                            item.y = 1;
                            item.vy = 0;
                            item.resting = true;
                        }
                    }
                    
                    // Check pickup by player
                    if (item.pickupDelay <= 0) {
                        const dx = item.x - this.camera.x;
                        const dy = item.y - this.camera.y;
                        const dz = item.z - this.camera.z;
                        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        
                        if (dist < 2) {
                            if (this.addToInventory(item.type, item.count)) {
                                this.droppedItems.splice(i, 1);
                                continue;
                            }
                        }
                    }
                    
                    // Remove items that have been around too long (5 minutes)
                    item.age = (item.age || 0) + 1;
                    if (item.age > 60 * 60 * 5) {
                        this.droppedItems.splice(i, 1);
                    }
                }
            },
            
            // Add item to inventory (hotbar first, then main inventory)
            addToInventory(type, count) {
                // Determine item category
                let itemType = 'block';  // Default
                if (type === 'ka69' || type === 'berdger') itemType = 'weapon';
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
                        ka69: 'KA-69', water_bucket: 'Water Bucket', lava_bucket: 'Lava Bucket',
                        obsidian: 'Obsidian', cherryWood: 'Cherry Wood', cherryLeaves: 'Cherry Leaves',
                        chest: 'Chest', seeds: 'Seeds', berdger: 'The Berdger', apple: 'Apple',
                        sakuraPetal: 'Cherry Petal', shimenawa: 'Sacred Rope', omamori: 'Charm',
                        ema: 'Wish Plaque', incense: 'Incense', whiteBrick: 'White Brick',
                        redBrick: 'Red Brick', glowstone: 'Burgerstone', ritualStone: 'Ritual Stone',
                        table: 'Table', chair: 'Chair', bed: 'Bed', bedPillow: 'Pillow',
                        cashRegister: 'Cash Register', stool: 'Stool', counter: 'Counter',
                        lamp: 'Lamp', bookshelf: 'Bookshelf', plant: 'Plant',
                        sink: 'Sink', stove: 'Stove', fridge: 'Fridge'
                    };
                    
                    const notification = document.createElement('div');
                    notification.className = 'pickup-item';
                    (notification as HTMLElement).style.borderColor = 'rgba(255, 50, 50, 0.8)';
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
            drawMiniBlock(canvas, type) {
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
                    } else if (type === 'ka69') {
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
                    } else if (type === 'ka69') {
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
            // ═══════════════════════════════════════════════════════════════════════════
            // CONTAINER UI SYSTEM
            // ═══════════════════════════════════════════════════════════════════════════
            
            openChest(x, y, z) {
                this.openContainer(x, y, z, 'chest');
            },
            
            openContainer(x, y, z, type) {
                if (!this.chestContents) this.chestContents = {};
                
                const containerKey = `${x},${y},${z}`;
                
                // Initialize container if empty
                if (!this.chestContents[containerKey]) {
                    this.chestContents[containerKey] = [];
                }
                
                // Determine container properties
                const containerInfo = {
                    chest: { name: '📦 Chest', slots: 27 },
                    dungeonChest: { name: '🏛️ Dungeon Chest', slots: 27 },
                    ritualChest: { name: '⛩️ Ritual Chest', slots: 9 },
                    buildingChest: { name: '🏠 Storage Chest', slots: 27 },
                    barrel: { name: '🛢️ Barrel', slots: 27 },
                    crate: { name: '📦 Crate', slots: 18 },
                    furnace: { name: '🔥 Furnace', slots: 3 },
                    alchemyTable: { name: '⚗️ Alchemy Table', slots: 5 },
                    storageShrine: { name: '✨ Storage Shrine', slots: 54 }
                };
                
                const info = containerInfo[type] || containerInfo.chest;
                
                this.openContainerPos = { x, y, z };
                this.openContainerType = type;
                this.containerSlots = info.slots;
                this.containerOpen = true;
                
                // Release pointer lock
                if (document.pointerLockElement) {
                    document.exitPointerLock();
                }
                
                this.renderContainerUI(info.name, containerKey);
            },
            
            renderContainerUI(title, containerKey) {
                const screen = document.getElementById('containerScreen');
                const titleEl = document.getElementById('containerTitle');
                const slotsEl = document.getElementById('containerSlots');
                const playerSlotsEl = document.getElementById('playerSlotsInContainer');
                
                if (!screen || !slotsEl || !playerSlotsEl) return;
                
                titleEl.textContent = title;
                
                const contents = this.chestContents[containerKey] || [];
                
                // Item name helper
                const getItemName = (id) => {
                    const names = {
                        grass: 'Grass', dirt: 'Dirt', stone: 'Stone', wood: 'Wood',
                        leaves: 'Leaves', water: 'Water', sand: 'Sand', brick: 'Brick',
                        ka69: 'KA-69', water_bucket: 'Water Bucket', lava_bucket: 'Lava Bucket',
                        lava: 'Lava', obsidian: 'Obsidian', cherryWood: 'Cherry Wood',
                        cherryLeaves: 'Cherry Leaves', chest: 'Chest', seeds: 'Seeds',
                        berdger: 'The Berdger', apple: 'Apple', sakuraPetal: 'Cherry Petal',
                        shimenawa: 'Sacred Rope', omamori: 'Charm', ema: 'Wish Plaque',
                        incense: 'Incense', sakuraite: 'Sakuraite', moonstone: 'Moonstone',
                        jadite: 'Jadite', crimsonite: 'Crimsonite', voidstone: 'Voidstone',
                        spirite: 'Spirite', glowstone: 'Burgerstone', whiteBrick: 'White Brick',
                        redBrick: 'Red Brick', table: 'Table', chair: 'Chair', bed: 'Bed',
                        counter: 'Counter', stool: 'Stool', cashRegister: 'Cash Register',
                        lamp: 'Lamp', fridge: 'Fridge', stove: 'Stove', sink: 'Sink',
                        plant: 'Plant', bookshelf: 'Bookshelf', barrel: 'Barrel', crate: 'Crate'
                    };
                    return names[id] || id;
                };
                
                // Render container slots
                let containerHTML = '';
                for (let i = 0; i < this.containerSlots; i++) {
                    const item = contents[i];
                    const hasItem = item && item.type;
                    const emoji = hasItem ? this.getItemEmoji({ id: item.type }) : '';
                    const count = hasItem && item.count > 1 ? item.count : '';
                    const tooltip = hasItem ? getItemName(item.type) : '';
                    
                    containerHTML += `
                        <div class="container-slot ${hasItem ? 'has-item' : ''}" 
                             data-slot="${i}" data-source="container"
                             ${tooltip ? `data-tooltip="${tooltip}"` : ''}>
                            ${hasItem ? `<span class="slot-icon">${emoji}</span>` : ''}
                            ${count ? `<span class="slot-count">${count}</span>` : ''}
                        </div>
                    `;
                }
                slotsEl.innerHTML = containerHTML;
                
                // Render player inventory slots
                let playerHTML = '';
                
                // Hotbar
                for (let i = 0; i < 9; i++) {
                    const slot = this.inventory.hotbar[i];
                    const hasItem = slot && slot.id;
                    const emoji = hasItem ? this.getItemEmoji(slot) : '';
                    const count = hasItem && slot.count > 1 ? slot.count : '';
                    const tooltip = hasItem ? getItemName(slot.id) : '';
                    
                    playerHTML += `
                        <div class="container-slot ${hasItem ? 'has-item' : ''}" 
                             data-slot="${i}" data-source="hotbar"
                             ${tooltip ? `data-tooltip="${tooltip}"` : ''}>
                            ${hasItem ? `<span class="slot-icon">${emoji}</span>` : ''}
                            ${count ? `<span class="slot-count">${count}</span>` : ''}
                        </div>
                    `;
                }
                
                // Main inventory
                for (let i = 0; i < 27; i++) {
                    const slot = this.inventory.main[i];
                    const hasItem = slot && slot.id;
                    const emoji = hasItem ? this.getItemEmoji(slot) : '';
                    const count = hasItem && slot.count > 1 ? slot.count : '';
                    const tooltip = hasItem ? getItemName(slot.id) : '';
                    
                    playerHTML += `
                        <div class="container-slot ${hasItem ? 'has-item' : ''}" 
                             data-slot="${i}" data-source="main"
                             ${tooltip ? `data-tooltip="${tooltip}"` : ''}>
                            ${hasItem ? `<span class="slot-icon">${emoji}</span>` : ''}
                            ${count ? `<span class="slot-count">${count}</span>` : ''}
                        </div>
                    `;
                }
                playerSlotsEl.innerHTML = playerHTML;
                
                // Add click handlers
                this.setupContainerSlotHandlers(containerKey);
                
                screen.classList.add('active');
            },
            
            setupContainerSlotHandlers(containerKey) {
                const slots = document.querySelectorAll('.container-slot');
                
                slots.forEach(slot => {
                    slot.addEventListener('click', (e) => {
                        const slotIndex = parseInt((e.currentTarget as HTMLElement).dataset.slot);
                        const source = (e.currentTarget as HTMLElement).dataset.source;
                        
                        this.handleContainerSlotClick(slotIndex, source, containerKey);
                    });
                    
                    slot.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        const slotIndex = parseInt((e.currentTarget as HTMLElement).dataset.slot);
                        const source = (e.currentTarget as HTMLElement).dataset.source;
                        
                        // Right click - transfer half stack
                        this.handleContainerSlotClick(slotIndex, source, containerKey, true);
                    });
                });
                
                // Close button
                const closeBtn = document.getElementById('containerClose');
                if (closeBtn) {
                    closeBtn.onclick = () => this.closeContainer();
                }
            },
            
            handleContainerSlotClick(slotIndex, source, containerKey, halfStack = false) {
                const contents = this.chestContents[containerKey] || [];
                
                if (this.draggedItem) {
                    // Placing item
                    if (source === 'container') {
                        // Place into container
                        const existingItem = contents[slotIndex];
                        
                        if (!existingItem || !existingItem.type) {
                            // Empty slot - place item
                            contents[slotIndex] = { ...this.draggedItem };
                            this.draggedItem = null;
                        } else if (existingItem.type === this.draggedItem.type) {
                            // Same type - stack
                            const maxStack = this.itemTypes[existingItem.type]?.maxStack || 64;
                            const canAdd = maxStack - existingItem.count;
                            const toAdd = Math.min(canAdd, this.draggedItem.count);
                            existingItem.count += toAdd;
                            this.draggedItem.count -= toAdd;
                            if (this.draggedItem.count <= 0) this.draggedItem = null;
                        } else {
                            // Swap
                            contents[slotIndex] = { ...this.draggedItem };
                            this.draggedItem = { ...existingItem };
                        }
                    } else {
                        // Place into player inventory
                        const invArray = source === 'hotbar' ? this.inventory.hotbar : this.inventory.main;
                        const existingItem = invArray[slotIndex];
                        
                        if (!existingItem || !existingItem.id) {
                            // Empty slot
                            invArray[slotIndex] = { 
                                type: 'block', 
                                id: this.draggedItem.type, 
                                count: this.draggedItem.count 
                            };
                            this.draggedItem = null;
                        } else if (existingItem.id === this.draggedItem.type) {
                            // Stack
                            const maxStack = this.itemTypes[existingItem.id]?.maxStack || 64;
                            const canAdd = maxStack - existingItem.count;
                            const toAdd = Math.min(canAdd, this.draggedItem.count);
                            existingItem.count += toAdd;
                            this.draggedItem.count -= toAdd;
                            if (this.draggedItem.count <= 0) this.draggedItem = null;
                        } else {
                            // Swap
                            const temp = { type: existingItem.id, count: existingItem.count };
                            invArray[slotIndex] = { 
                                type: 'block', 
                                id: this.draggedItem.type, 
                                count: this.draggedItem.count 
                            };
                            this.draggedItem = temp;
                        }
                    }
                } else {
                    // Picking up item
                    if (source === 'container') {
                        const item = contents[slotIndex];
                        if (item && item.type) {
                            if (halfStack && item.count > 1) {
                                const half = Math.ceil(item.count / 2);
                                this.draggedItem = { type: item.type, count: half };
                                item.count -= half;
                            } else {
                                this.draggedItem = { ...item };
                                contents[slotIndex] = null;
                            }
                        }
                    } else {
                        const invArray = source === 'hotbar' ? this.inventory.hotbar : this.inventory.main;
                        const item = invArray[slotIndex];
                        if (item && item.id) {
                            if (halfStack && item.count > 1) {
                                const half = Math.ceil(item.count / 2);
                                this.draggedItem = { type: item.id, count: half };
                                item.count -= half;
                            } else {
                                this.draggedItem = { type: item.id, count: item.count };
                                invArray[slotIndex] = null;
                            }
                        }
                    }
                }
                
                // Update display
                this.chestContents[containerKey] = contents;
                this.renderContainerUI(
                    document.getElementById('containerTitle').textContent, 
                    containerKey
                );
                this.updateHotbarDisplay();
                
                // Update cursor
                this.updateDragCursor();
            },
            
            updateDragCursor() {
                let ghost = document.getElementById('dragGhost');
                
                if (this.draggedItem) {
                    if (!ghost) {
                        ghost = document.createElement('div');
                        ghost.id = 'dragGhost';
                        ghost.className = 'drag-ghost';
                        document.body.appendChild(ghost);
                        
                        // Add single persistent mouse tracking
                        document.addEventListener('mousemove', (e) => {
                            const g = document.getElementById('dragGhost');
                            if (g && g.style.display !== 'none') {
                                g.style.left = e.clientX + 'px';
                                g.style.top = e.clientY + 'px';
                            }
                        });
                    }
                    
                    ghost.innerHTML = `<span class="ghost-icon">${this.getItemEmoji({ id: this.draggedItem.type })}</span>`;
                    if (this.draggedItem.count > 1) {
                        ghost.innerHTML += `<span class="ghost-count">${this.draggedItem.count}</span>`;
                    }
                    ghost.style.display = 'block';
                } else if (ghost) {
                    ghost.style.display = 'none';
                }
            },
            
            closeContainer() {
                // Drop any held item back into world
                if (this.draggedItem) {
                    this.dropItem(
                        this.camera.x, 
                        this.camera.y, 
                        this.camera.z,
                        this.draggedItem.type,
                        this.draggedItem.count
                    );
                    this.draggedItem = null;
                }
                
                this.containerOpen = false;
                this.openContainerPos = null;
                this.openContainerType = null;
                
                // Hide ghost
                const ghost = document.getElementById('dragGhost');
                if (ghost) ghost.style.display = 'none';
                
                // Hide screen
                const screen = document.getElementById('containerScreen');
                if (screen) screen.classList.remove('active');
                
                this.updateHotbarDisplay();
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
            // Debug settings
            debugSettings: {
                showFPS: false,
                showCoords: false,
                showDepthOrder: false,
                showFaceNormals: false,
                showBoundingBoxes: false,
                showRaycastVector: false,
                showProjectionTest: false,
                wireframeOnly: false,
                disableFaceCulling: false,
                showOverdraw: false,
                highlightZFighting: false,
                showTargetInfo: false,
                renderAlgorithm: 'painter' as 'painter' | 'zbuffer' | 'bsp',
                // NEW: Tree/foliage diagnostics
                showTreeDiag: false,
                highlightBlockType: null as string | null,
                showFaceOrder: false,
                showDistanceHeatmap: false,
                pauseRendering: false,
                capturedFrame: null as any[] | null,
                showRenderStats: false,
                // Near-plane debugging
                showNearPlaneClipping: false,
                // Furniture/custom model debugging
                showBlockModels: false,
                // Camera angle debugging
                showCameraAngle: false,
                // Swimming debug
                showSwimDebug: false,
                // Console logging for swim debugging
                swimConsoleLog: false
            },
            debugFly: false,
            debugMoveSpeed: null,
            
            toggleDebugConsole() {
                this.debugConsoleOpen = !this.debugConsoleOpen;
                const consoleEl = document.getElementById('debugConsole');
                const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
                
                console.log('[Console] Toggle debug console, now open:', this.debugConsoleOpen);
                console.log('[Console] isPaused:', this.isPaused);
                console.log('[Console] isActive:', this.isActive);
                
                if (consoleEl) {
                    if (this.debugConsoleOpen) {
                        // Open console
                        consoleEl.classList.add('active');
                        consoleEl.style.display = 'flex';
                        
                        // Exit pointer lock (unlock cursor)
                        if (document.pointerLockElement) {
                            document.exitPointerLock();
                        }
                        this.pointerLocked = false;
                        
                        // Blur game canvas to lose focus
                        if (canvas) {
                            canvas.blur();
                        }
                        
                        // Scroll output to bottom when opening (longer timeout for reliability)
                        const output = document.getElementById('debugOutput');
                        const input = document.getElementById('debugInput') as HTMLInputElement;
                        
                        // Log welcome message first
                        this.debugLog('Debug console opened. Type "help" for commands.', 'info');
                        
                        // Then scroll and focus with enough delay
                        setTimeout(() => {
                            if (output) {
                                output.scrollTop = output.scrollHeight;
                            }
                            if (input) {
                                input.focus();
                                input.select(); // Select any text for immediate typing
                            }
                        }, 100); // Increased from 50ms to 100ms
                        
                    } else {
                        // Close console
                        consoleEl.classList.remove('active');
                        consoleEl.style.display = 'none';
                        
                        // Hide suggestions
                        const suggestions = document.getElementById('debugSuggestions');
                        if (suggestions) {
                            suggestions.classList.remove('active');
                        }
                        
                        // Return focus to game canvas
                        if (canvas) {
                            canvas.focus();
                            
                            // Request pointer lock after a short delay
                            setTimeout(() => {
                                if (this.isActive && !this.isPaused) {
                                    canvas.requestPointerLock();
                                }
                            }, 100);
                        }
                    }
                }
            },
            
            setupDebugConsole() {
                console.log('[Autocomplete] Setting up debug console...');
                
                // Ensure console is hidden on initialization
                const consoleEl = document.getElementById('debugConsole');
                if (consoleEl) {
                    consoleEl.classList.remove('active');
                    consoleEl.style.display = 'none';
                }
                
                // Store reference to this for setTimeout
                const self = this;
                
                // Wait a bit to ensure HTML is fully loaded
                setTimeout(function() {
                    console.log('[Autocomplete] setTimeout fired, calling setupDebugConsoleActual...');
                    self.setupDebugConsoleActual();
                }, 100);
            },
            
            setupDebugConsoleActual() {
                console.log('[Autocomplete] Setting up autocomplete (delayed)...');
                
                // Verify critical elements exist
                const debugConsole = document.getElementById('debugConsole');
                const debugInput = document.getElementById('debugInput') as HTMLInputElement;
                let debugSuggestions = document.getElementById('debugSuggestions');
                
                console.log('[Autocomplete] Element check:');
                console.log('  - debugConsole:', debugConsole);
                console.log('  - debugInput:', debugInput);
                console.log('  - debugSuggestions:', debugSuggestions);
                
                if (!debugConsole || !debugInput) {
                    console.error('[Autocomplete] ERROR: Required elements not found! Cannot proceed.');
                    return;
                }
                
                // ═══════════════════════════════════════════════════════════
                // MAKE CONSOLE DRAGGABLE AND RESIZABLE
                // ═══════════════════════════════════════════════════════════
                const header = debugConsole.querySelector('.debug-console-header') as HTMLElement;
                if (header) {
                    // DRAGGING
                    let isDragging = false;
                    let currentX = 0;
                    let currentY = 0;
                    let initialX = 0;
                    let initialY = 0;
                    
                    // Initialize offsets from current CSS position
                    const computedStyle = window.getComputedStyle(debugConsole);
                    let xOffset = parseInt(computedStyle.left) || 10;
                    let yOffset = parseInt(computedStyle.top) || 50;
                    
                    header.addEventListener('mousedown', (e) => {
                        // Don't drag if clicking on FPS counter or other interactive elements
                        if ((e.target as HTMLElement).id === 'debugFps') return;
                        
                        initialX = e.clientX - xOffset;
                        initialY = e.clientY - yOffset;
                        isDragging = true;
                        header.style.cursor = 'grabbing';
                    });
                    
                    // RESIZING
                    let isResizing = false;
                    let resizeEdge = '';
                    let startWidth = 0;
                    let startHeight = 0;
                    let startX = 0;
                    let startY = 0;
                    let startLeft = 0;
                    let startTop = 0;
                    
                    const handleMouseMove = (e: MouseEvent) => {
                        if (isResizing) {
                            e.preventDefault();
                            
                            let newWidth = startWidth;
                            let newHeight = startHeight;
                            let newLeft = startLeft;
                            let newTop = startTop;
                            
                            const dx = e.clientX - startX;
                            const dy = e.clientY - startY;
                            
                            // Handle horizontal resizing
                            if (resizeEdge.includes('e')) {
                                newWidth = Math.max(300, startWidth + dx);
                            } else if (resizeEdge.includes('w')) {
                                newWidth = Math.max(300, startWidth - dx);
                                newLeft = startLeft + (startWidth - newWidth);
                            }
                            
                            // Handle vertical resizing
                            if (resizeEdge.includes('s')) {
                                newHeight = Math.max(200, startHeight + dy);
                            } else if (resizeEdge.includes('n')) {
                                newHeight = Math.max(200, startHeight - dy);
                                newTop = startTop + (startHeight - newHeight);
                            }
                            
                            debugConsole.style.width = `${newWidth}px`;
                            debugConsole.style.maxHeight = `${newHeight}px`;
                            debugConsole.style.left = `${newLeft}px`;
                            debugConsole.style.top = `${newTop}px`;
                            
                            // Update drag offsets
                            xOffset = newLeft;
                            yOffset = newTop;
                        } else if (isDragging) {
                            e.preventDefault();
                            currentX = e.clientX - initialX;
                            currentY = e.clientY - initialY;
                            xOffset = currentX;
                            yOffset = currentY;
                            
                            // Keep console within viewport bounds
                            const maxX = window.innerWidth - 100;
                            const maxY = window.innerHeight - 50;
                            const clampedX = Math.max(0, Math.min(currentX, maxX));
                            const clampedY = Math.max(0, Math.min(currentY, maxY));
                            
                            debugConsole.style.left = `${clampedX}px`;
                            debugConsole.style.top = `${clampedY}px`;
                            
                            xOffset = clampedX;
                            yOffset = clampedY;
                        } else {
                            // Update cursor based on position
                            const rect = debugConsole.getBoundingClientRect();
                            const edge = 10; // pixels from edge to trigger resize
                            
                            const atTop = e.clientY - rect.top < edge;
                            const atBottom = rect.bottom - e.clientY < edge;
                            const atLeft = e.clientX - rect.left < edge;
                            const atRight = rect.right - e.clientX < edge;
                            
                            if ((atTop && atLeft) || (atBottom && atRight)) {
                                debugConsole.style.cursor = 'nwse-resize';
                            } else if ((atTop && atRight) || (atBottom && atLeft)) {
                                debugConsole.style.cursor = 'nesw-resize';
                            } else if (atTop || atBottom) {
                                debugConsole.style.cursor = 'ns-resize';
                            } else if (atLeft || atRight) {
                                debugConsole.style.cursor = 'ew-resize';
                            } else {
                                debugConsole.style.cursor = 'default';
                            }
                        }
                    };
                    
                    debugConsole.addEventListener('mousedown', (e) => {
                        // Don't resize if clicking header (that's for dragging)
                        if ((e.target as HTMLElement).closest('.debug-console-header')) return;
                        
                        const rect = debugConsole.getBoundingClientRect();
                        const edge = 10;
                        
                        const atTop = e.clientY - rect.top < edge;
                        const atBottom = rect.bottom - e.clientY < edge;
                        const atLeft = e.clientX - rect.left < edge;
                        const atRight = rect.right - e.clientX < edge;
                        
                        if (atTop || atBottom || atLeft || atRight) {
                            isResizing = true;
                            resizeEdge = '';
                            if (atTop) resizeEdge += 'n';
                            if (atBottom) resizeEdge += 's';
                            if (atLeft) resizeEdge += 'w';
                            if (atRight) resizeEdge += 'e';
                            
                            startX = e.clientX;
                            startY = e.clientY;
                            startWidth = rect.width;
                            startHeight = rect.height;
                            startLeft = rect.left;
                            startTop = rect.top;
                            
                            e.preventDefault();
                        }
                    });
                    
                    document.addEventListener('mousemove', handleMouseMove);
                    
                    document.addEventListener('mouseup', () => {
                        if (isDragging) {
                            isDragging = false;
                            header.style.cursor = 'move';
                        }
                        if (isResizing) {
                            isResizing = false;
                            debugConsole.style.cursor = 'default';
                        }
                    });
                    
                    console.log('[Console] Made draggable and resizable!');
                }
                // ═══════════════════════════════════════════════════════════
                // END DRAGGABLE & RESIZABLE
                // ═══════════════════════════════════════════════════════════
                
                // If debugSuggestions doesn't exist, create it dynamically
                if (!debugSuggestions) {
                    console.log('[Autocomplete] debugSuggestions not found, creating dynamically...');
                    debugSuggestions = document.createElement('div');
                    debugSuggestions.id = 'debugSuggestions';
                    debugSuggestions.className = 'debug-console-suggestions';
                    
                    // Insert after the input element's parent
                    const inputContainer = debugInput.parentElement;
                    if (inputContainer && inputContainer.nextSibling) {
                        debugConsole.insertBefore(debugSuggestions, inputContainer.nextSibling);
                    } else {
                        debugConsole.appendChild(debugSuggestions);
                    }
                    console.log('[Autocomplete] Created debugSuggestions:', debugSuggestions);
                }
                
                console.log('[Autocomplete] All elements ready, proceeding with setup...');
                
                // Available commands with descriptions
                const commands = [
                    { name: 'help', desc: 'Show all available commands' },
                    { name: 'noclip', desc: 'Toggle flying through walls' },
                    { name: 'god', desc: 'Toggle invincibility' },
                    { name: 'coords', desc: 'Toggle coordinate display' },
                    { name: 'tp', desc: 'Teleport to position or landmark' },
                    { name: 'give', desc: 'Give yourself items' },
                    { name: 'time', desc: 'Set game time' },
                    { name: 'wave', desc: 'Set wave number' },
                    { name: 'fly', desc: 'Toggle fly mode' },
                    { name: 'speed', desc: 'Set movement speed' },
                    { name: 'clear', desc: 'Clear console output' },
                    { name: 'fps', desc: 'Toggle FPS display' },
                    { name: 'render', desc: 'Rendering debug: wireframe|depthorder|normals|bounds|raycast|projection|culling|overdraw|all|none' },
                    { name: 'algo', desc: 'Set render algorithm: painter|zbuffer|bsp' }
                ];
                
                let selectedSuggestionIndex = -1;
                let currentSuggestions: typeof commands = [];
                
                const input = document.getElementById('debugInput') as HTMLInputElement;
                
                const showSuggestions = (query: string) => {
                    // Query element fresh each time to ensure it exists
                    const suggestionsEl = document.getElementById('debugSuggestions');
                    
                    console.log('[Autocomplete] Query:', query);
                    console.log('[Autocomplete] suggestionsEl:', suggestionsEl);
                    
                    if (!suggestionsEl || !query) {
                        if (suggestionsEl) suggestionsEl.classList.remove('active');
                        currentSuggestions = [];
                        selectedSuggestionIndex = -1;
                        return;
                    }
                    
                    // Filter commands
                    currentSuggestions = commands.filter(cmd => 
                        cmd.name.toLowerCase().startsWith(query.toLowerCase())
                    );
                    
                    console.log('[Autocomplete] Current suggestions:', currentSuggestions);
                    
                    if (currentSuggestions.length === 0) {
                        suggestionsEl.classList.remove('active');
                        return;
                    }
                    
                    // Render suggestions
                    suggestionsEl.innerHTML = '';
                    currentSuggestions.forEach((cmd, index) => {
                        const item = document.createElement('div');
                        item.className = 'debug-suggestion-item';
                        if (index === selectedSuggestionIndex) {
                            item.classList.add('selected');
                        }
                        item.innerHTML = `<span class="suggestion-name">${cmd.name}</span><span class="suggestion-desc">${cmd.desc}</span>`;
                        
                        // Click to select
                        item.addEventListener('click', () => {
                            input.value = cmd.name + ' ';
                            input.focus();
                            suggestionsEl.classList.remove('active');
                            currentSuggestions = [];
                            selectedSuggestionIndex = -1;
                        });
                        
                        suggestionsEl.appendChild(item);
                    });
                    
                    console.log('[Autocomplete] Added active class, innerHTML:', suggestionsEl.innerHTML.substring(0, 100));
                    suggestionsEl.classList.add('active');
                };
                
                const selectSuggestion = (index: number) => {
                    const suggestionsEl = document.getElementById('debugSuggestions');
                    if (!suggestionsEl || currentSuggestions.length === 0) return;
                    
                    // Update selection
                    selectedSuggestionIndex = index;
                    
                    // Update UI
                    const items = suggestionsEl.querySelectorAll('.debug-suggestion-item');
                    items.forEach((item, i) => {
                        if (i === selectedSuggestionIndex) {
                            item.classList.add('selected');
                        } else {
                            item.classList.remove('selected');
                        }
                    });
                };
                
                const applySuggestion = () => {
                    if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < currentSuggestions.length) {
                        input.value = currentSuggestions[selectedSuggestionIndex].name + ' ';
                        const suggestionsEl = document.getElementById('debugSuggestions');
                        if (suggestionsEl) {
                            suggestionsEl.classList.remove('active');
                        }
                        currentSuggestions = [];
                        selectedSuggestionIndex = -1;
                    }
                };
                
                if (input) {
                    console.log('[Autocomplete] Input element found, attaching listeners');
                    console.log('[Autocomplete] Input element:', input);
                    
                    const testSuggestions = document.getElementById('debugSuggestions');
                    console.log('[Autocomplete] Suggestions element on setup:', testSuggestions);
                    
                    // Input event for live suggestions
                    input.addEventListener('input', (e) => {
                        const query = input.value.trim().split(' ')[0];
                        console.log('[Autocomplete] Input event fired, query:', query);
                        showSuggestions(query);
                    });
                    
                    input.addEventListener('keydown', (e) => {
                        // Arrow key navigation
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            if (currentSuggestions.length > 0) {
                                selectedSuggestionIndex = (selectedSuggestionIndex + 1) % currentSuggestions.length;
                                selectSuggestion(selectedSuggestionIndex);
                            }
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            if (currentSuggestions.length > 0) {
                                selectedSuggestionIndex = selectedSuggestionIndex <= 0 
                                    ? currentSuggestions.length - 1 
                                    : selectedSuggestionIndex - 1;
                                selectSuggestion(selectedSuggestionIndex);
                            }
                        } else if (e.key === 'Tab') {
                            // Tab to apply suggestion immediately
                            e.preventDefault();
                            if (currentSuggestions.length > 0) {
                                // If nothing selected, select first
                                if (selectedSuggestionIndex < 0) {
                                    selectedSuggestionIndex = 0;
                                }
                                
                                if (e.shiftKey) {
                                    // Shift+Tab cycles backwards
                                    selectedSuggestionIndex = selectedSuggestionIndex <= 0 
                                        ? currentSuggestions.length - 1 
                                        : selectedSuggestionIndex - 1;
                                } else {
                                    // Tab cycles forward
                                    selectedSuggestionIndex = (selectedSuggestionIndex + 1) % currentSuggestions.length;
                                }
                                
                                // Apply the selected suggestion
                                input.value = currentSuggestions[selectedSuggestionIndex].name + ' ';
                                const suggestionsEl = document.getElementById('debugSuggestions');
                                if (suggestionsEl) {
                                    suggestionsEl.classList.remove('active');
                                }
                                currentSuggestions = [];
                                selectedSuggestionIndex = -1;
                                input.focus();
                            }
                        } else if (e.key === 'Enter') {
                            e.preventDefault();
                            
                            // If suggestion selected, apply it
                            if (selectedSuggestionIndex >= 0) {
                                applySuggestion();
                            } else {
                                // Execute command
                                const cmd = input.value.trim();
                                if (cmd) {
                                    this.executeDebugCommand(cmd);
                                    input.value = '';
                                    const suggestionsEl = document.getElementById('debugSuggestions');
                                    if (suggestionsEl) {
                                        suggestionsEl.classList.remove('active');
                                    }
                                    currentSuggestions = [];
                                    selectedSuggestionIndex = -1;
                                }
                            }
                        } else if (e.key === '`' || e.key === '~') {
                            e.preventDefault();
                            this.toggleDebugConsole();
                        } else if (e.key === 'Escape') {
                            // Escape closes suggestions or console
                            if (currentSuggestions.length > 0) {
                                e.preventDefault();
                                const suggestionsEl = document.getElementById('debugSuggestions');
                                if (suggestionsEl) {
                                    suggestionsEl.classList.remove('active');
                                }
                                currentSuggestions = [];
                                selectedSuggestionIndex = -1;
                            }
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
                        this.debugLog('  tp <landmark> - Teleport to landmark', 'info');
                        this.debugLog('    landmarks: ritual, gunsmith, spawn', 'info');
                        this.debugLog('  give <item> [count] - Give item', 'info');
                        this.debugLog('  spawn <mob> [count] - Spawn mobs', 'info');
                        this.debugLog('    mobs: bird, fish, cat, creeper, bluebird, gunsmith', 'info');
                        this.debugLog('  time <ms> - Set bird event timer', 'info');
                        this.debugLog('  kill - Kill all mobs', 'info');
                        this.debugLog('  clear - Clear console', 'info');
                        this.debugLog('  pos - Show current position', 'info');
                        this.debugLog('  fly - Toggle flight mode', 'info');
                        this.debugLog('  speed <value> - Set move speed', 'info');
                        this.debugLog('  ritual - Complete ritual instantly', 'info');
                        this.debugLog('  score <value> - Set score', 'info');
                        this.debugLog('  algo <type> - Set render algorithm', 'info');
                        this.debugLog('    painter|zbuffer|bsp', 'info');
                        this.debugLog('', 'info');
                        this.debugLog('Rendering Debug:', 'info');
                        this.debugLog('  render <option> - Toggle render debug', 'info');
                        this.debugLog('    wireframe - Wireframe-only mode', 'info');
                        this.debugLog('    depthorder - Show depth sorting', 'info');
                        this.debugLog('    normals - Show face normals', 'info');
                        this.debugLog('    bounds - Show bounding boxes', 'info');
                        this.debugLog('    raycast - Show raycast vector', 'info');
                        this.debugLog('    projection - Test projection', 'info');
                        this.debugLog('    culling - Disable face culling', 'info');
                        this.debugLog('    overdraw - Show overdraw heatmap', 'info');
                        this.debugLog('    targetinfo - Raycast vs render diagnostic', 'info');
                        this.debugLog('    treediag - Tree/foliage flicker diagnostic', 'info');
                        this.debugLog('    faceorder - Show face render order', 'info');
                        this.debugLog('    heatmap - Distance-based heatmap', 'info');
                        this.debugLog('    stats - Show render statistics', 'info');
                        this.debugLog('    highlight <type> - Highlight block type', 'info');
                        this.debugLog('    pause - Pause/capture render frame', 'info');
                        this.debugLog('    all - Toggle all render debug', 'info');
                        this.debugLog('    none - Turn all render debug OFF', 'info');
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
                        this.debugSettings.showCoords = !this.debugSettings.showCoords;
                        this.debugLog(`Coords display: ${this.debugSettings.showCoords ? 'ON' : 'OFF'}`, 'success');
                        break;
                        
                    case 'fly':
                        this.debugFly = !this.debugFly;
                        this.debugLog(`Fly mode: ${this.debugFly ? 'ON' : 'OFF'}`, this.debugFly ? 'success' : 'warn');
                        break;
                        
                    case 'tp':
                        if (args.length >= 1) {
                            // Check if first argument is a landmark
                            const landmark = args[0].toLowerCase();
                            
                            if (landmark === 'ritual' || landmark === 'temple') {
                                // Teleport to ritual temple
                                if (this.ritualTempleLocation) {
                                    this.camera.x = this.ritualTempleLocation.x + 5;
                                    this.camera.y = this.ritualTempleLocation.y + 3;
                                    this.camera.z = this.ritualTempleLocation.z + 5;
                                    this.velocity = { x: 0, y: 0, z: 0 };
                                    this.debugLog('Teleported to Ritual Temple', 'success');
                                } else {
                                    this.debugLog('Ritual temple not found', 'error');
                                }
                            } else if (landmark === 'gunsmith' || landmark === 'npc' || landmark === 'repair') {
                                // Teleport to repair NPC
                                if (this.repairNPC) {
                                    this.camera.x = this.repairNPC.x;
                                    this.camera.y = this.repairNPC.y + 2;
                                    this.camera.z = this.repairNPC.z;
                                    this.velocity = { x: 0, y: 0, z: 0 };
                                    this.debugLog('Teleported to Gunsmith NPC', 'success');
                                } else {
                                    this.debugLog('Gunsmith NPC not found (not spawned yet)', 'error');
                                }
                            } else if (landmark === 'spawn' || landmark === 'home') {
                                // Teleport to spawn
                                this.camera.x = 0;
                                this.camera.y = 10;
                                this.camera.z = 0;
                                this.velocity = { x: 0, y: 0, z: 0 };
                                this.debugLog('Teleported to spawn', 'success');
                            } else if (args.length >= 3) {
                                // Numeric coordinates
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
                                this.debugLog('Usage: tp <x> <y> <z> OR tp <landmark>', 'error');
                                this.debugLog('Landmarks: ritual, gunsmith, spawn', 'info');
                            }
                        } else {
                            this.debugLog('Usage: tp <x> <y> <z> OR tp <landmark>', 'error');
                            this.debugLog('Landmarks: ritual, gunsmith, spawn', 'info');
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
                        const validMobs = ['bird', 'pest', 'fish', 'cat', 'creeper', 'bluebird', 'gunsmith'];
                        
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
                        } else if (mobType === 'gunsmith' || mobType === 'npc' || mobType === 'repair') {
                            this.spawnRepairNPC();
                            this.debugLog('Spawned gunsmith NPC', 'success');
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
                        
                    // Rendering debug commands
                    case 'render':
                        const subcommand = args[0] ? args[0].toLowerCase() : '';
                        
                        if (!subcommand) {
                            this.debugLog('Usage: render <option>', 'error');
                            this.debugLog('Options: wireframe, depthorder, normals, bounds, raycast, projection, culling, overdraw, all, none', 'info');
                            this.debugLog('Example: render wireframe', 'info');
                            break;
                        }
                        
                        switch (subcommand) {
                            case 'wireframe':
                                this.debugSettings.wireframeOnly = !this.debugSettings.wireframeOnly;
                                this.debugLog(`Wireframe mode: ${this.debugSettings.wireframeOnly ? 'ON' : 'OFF'}`, 'success');
                                break;
                                
                            case 'depthorder':
                                this.debugSettings.showDepthOrder = !this.debugSettings.showDepthOrder;
                                this.debugLog(`Depth order display: ${this.debugSettings.showDepthOrder ? 'ON' : 'OFF'}`, 'success');
                                break;
                                
                            case 'normals':
                                this.debugSettings.showFaceNormals = !this.debugSettings.showFaceNormals;
                                this.debugLog(`Face normals: ${this.debugSettings.showFaceNormals ? 'ON' : 'OFF'}`, 'success');
                                break;
                                
                            case 'bounds':
                                this.debugSettings.showBoundingBoxes = !this.debugSettings.showBoundingBoxes;
                                this.debugLog(`Bounding boxes: ${this.debugSettings.showBoundingBoxes ? 'ON' : 'OFF'}`, 'success');
                                break;
                                
                            case 'raycast':
                                this.debugSettings.showRaycastVector = !this.debugSettings.showRaycastVector;
                                this.debugLog(`Raycast vector: ${this.debugSettings.showRaycastVector ? 'ON' : 'OFF'}`, 'success');
                                break;
                                
                            case 'projection':
                                this.debugSettings.showProjectionTest = !this.debugSettings.showProjectionTest;
                                this.debugLog(`Projection test: ${this.debugSettings.showProjectionTest ? 'ON' : 'OFF'}`, 'success');
                                this.debugLog('A test point will be shown at camera center', 'info');
                                break;
                                
                            case 'culling':
                                this.debugSettings.disableFaceCulling = !this.debugSettings.disableFaceCulling;
                                this.debugLog(`Face culling: ${this.debugSettings.disableFaceCulling ? 'DISABLED' : 'ENABLED'}`, this.debugSettings.disableFaceCulling ? 'warn' : 'success');
                                break;
                                
                            case 'overdraw':
                                this.debugSettings.showOverdraw = !this.debugSettings.showOverdraw;
                                this.debugLog(`Overdraw visualization: ${this.debugSettings.showOverdraw ? 'ON' : 'OFF'}`, 'success');
                                break;
                                
                            case 'targetinfo':
                                this.debugSettings.showTargetInfo = !this.debugSettings.showTargetInfo;
                                this.debugLog(`Target info: ${this.debugSettings.showTargetInfo ? 'ON' : 'OFF'}`, 'success');
                                if (this.debugSettings.showTargetInfo) {
                                    this.debugLog('Shows raycast hit position, world data, and render status', 'info');
                                }
                                break;
                            
                            case 'treediag':
                                this.debugSettings.showTreeDiag = !this.debugSettings.showTreeDiag;
                                this.debugLog(`Tree diagnostic: ${this.debugSettings.showTreeDiag ? 'ON' : 'OFF'}`, 'success');
                                if (this.debugSettings.showTreeDiag) {
                                    this.debugLog('Shows leaf/foliage render analysis', 'info');
                                    this.debugLog('- Red outline: Potential Z-fighting', 'info');
                                    this.debugLog('- Numbers: Render order within group', 'info');
                                }
                                break;
                            
                            case 'faceorder':
                                this.debugSettings.showFaceOrder = !this.debugSettings.showFaceOrder;
                                this.debugLog(`Face order display: ${this.debugSettings.showFaceOrder ? 'ON' : 'OFF'}`, 'success');
                                if (this.debugSettings.showFaceOrder) {
                                    this.debugLog('Shows render order of individual faces', 'info');
                                }
                                break;
                            
                            case 'heatmap':
                                this.debugSettings.showDistanceHeatmap = !this.debugSettings.showDistanceHeatmap;
                                this.debugLog(`Distance heatmap: ${this.debugSettings.showDistanceHeatmap ? 'ON' : 'OFF'}`, 'success');
                                if (this.debugSettings.showDistanceHeatmap) {
                                    this.debugLog('Colors blocks by distance (red=close, blue=far)', 'info');
                                }
                                break;
                            
                            case 'stats':
                                this.debugSettings.showRenderStats = !this.debugSettings.showRenderStats;
                                this.debugLog(`Render stats: ${this.debugSettings.showRenderStats ? 'ON' : 'OFF'}`, 'success');
                                break;
                            
                            case 'highlight':
                                if (args[0]) {
                                    const blockType = args[0].toLowerCase();
                                    if (this.debugSettings.highlightBlockType === blockType) {
                                        this.debugSettings.highlightBlockType = null;
                                        this.debugLog(`Highlight OFF`, 'warn');
                                    } else {
                                        this.debugSettings.highlightBlockType = blockType;
                                        this.debugLog(`Highlighting: ${blockType}`, 'success');
                                    }
                                } else {
                                    this.debugSettings.highlightBlockType = null;
                                    this.debugLog('Usage: render highlight <block_type>', 'info');
                                    this.debugLog('Example: render highlight leaves', 'info');
                                    this.debugLog('Common types: leaves, wood, grass, stone, sand', 'info');
                                }
                                break;
                            
                            case 'pause':
                                this.debugSettings.pauseRendering = !this.debugSettings.pauseRendering;
                                if (this.debugSettings.pauseRendering) {
                                    this.debugLog('Render PAUSED - frame captured', 'warn');
                                    this.debugLog('Use "render pause" again to resume', 'info');
                                } else {
                                    this.debugSettings.capturedFrame = null;
                                    this.debugLog('Render RESUMED', 'success');
                                }
                                break;
                            
                            case 'nearplane':
                                this.debugSettings.showNearPlaneClipping = !this.debugSettings.showNearPlaneClipping;
                                this.debugLog(`Near-plane clipping debug: ${this.debugSettings.showNearPlaneClipping ? 'ON' : 'OFF'}`, 'success');
                                if (this.debugSettings.showNearPlaneClipping) {
                                    this.debugLog('Shows faces with clamped vertices (prevents see-through)', 'info');
                                    this.debugLog('Green outline = normal, Red = clamped vertex', 'info');
                                }
                                break;
                            
                            case 'blockmodels':
                            case 'models':
                                this.debugSettings.showBlockModels = !this.debugSettings.showBlockModels;
                                this.debugLog(`Block models debug: ${this.debugSettings.showBlockModels ? 'ON' : 'OFF'}`, 'success');
                                if (this.debugSettings.showBlockModels) {
                                    this.debugLog('Shows custom block model bounds for furniture/containers', 'info');
                                    const modelBlocks = Object.keys(this.blockModels || {});
                                    this.debugLog(`Blocks with custom models: ${modelBlocks.join(', ')}`, 'info');
                                }
                                break;
                            
                            case 'angle':
                            case 'camera':
                                this.debugSettings.showCameraAngle = !this.debugSettings.showCameraAngle;
                                this.debugLog(`Camera angle debug: ${this.debugSettings.showCameraAngle ? 'ON' : 'OFF'}`, 'success');
                                if (this.debugSettings.showCameraAngle) {
                                    this.debugLog('Shows camera rotation angles and look direction', 'info');
                                }
                                break;
                            
                            case 'swim':
                            case 'swimming':
                                this.debugSettings.showSwimDebug = !this.debugSettings.showSwimDebug;
                                this.debugLog(`Swimming debug: ${this.debugSettings.showSwimDebug ? 'ON' : 'OFF'}`, 'success');
                                if (this.debugSettings.showSwimDebug) {
                                    this.debugLog('Shows swimming state, physics branch, and velocities', 'info');
                                    this.debugLog('Key insight: BRANCH shows which physics code is running', 'info');
                                }
                                break;
                            
                            case 'swimlog':
                                this.debugSettings.swimConsoleLog = !this.debugSettings.swimConsoleLog;
                                this.debugLog(`Swim console logging: ${this.debugSettings.swimConsoleLog ? 'ON' : 'OFF'}`, 'success');
                                if (this.debugSettings.swimConsoleLog) {
                                    this.debugLog('Check browser console (F12) for frame-by-frame swim data', 'info');
                                }
                                break;
                                
                            case 'all':
                                const newState = !this.debugSettings.wireframeOnly;
                                this.debugSettings.wireframeOnly = newState;
                                this.debugSettings.showDepthOrder = newState;
                                this.debugSettings.showFaceNormals = newState;
                                this.debugSettings.showBoundingBoxes = newState;
                                this.debugSettings.showRaycastVector = newState;
                                this.debugSettings.showProjectionTest = newState;
                                this.debugSettings.showOverdraw = newState;
                                this.debugSettings.showTargetInfo = newState;
                                this.debugLog(`All render debug: ${newState ? 'ON' : 'OFF'}`, newState ? 'success' : 'warn');
                                break;
                                
                            case 'none':
                                // Turn everything off
                                this.debugSettings.wireframeOnly = false;
                                this.debugSettings.showDepthOrder = false;
                                this.debugSettings.showFaceNormals = false;
                                this.debugSettings.showBoundingBoxes = false;
                                this.debugSettings.showRaycastVector = false;
                                this.debugSettings.showProjectionTest = false;
                                this.debugSettings.showOverdraw = false;
                                this.debugSettings.disableFaceCulling = false;
                                this.debugSettings.showTargetInfo = false;
                                this.debugSettings.showTreeDiag = false;
                                this.debugSettings.showFaceOrder = false;
                                this.debugSettings.showDistanceHeatmap = false;
                                this.debugSettings.showRenderStats = false;
                                this.debugSettings.highlightBlockType = null;
                                this.debugSettings.pauseRendering = false;
                                this.debugSettings.capturedFrame = null;
                                this.debugSettings.showNearPlaneClipping = false;
                                this.debugSettings.showBlockModels = false;
                                this.debugSettings.showCameraAngle = false;
                                this.debugSettings.showSwimDebug = false;
                                this.debugSettings.swimConsoleLog = false;
                                this.debugLog('All render debug: OFF', 'warn');
                                break;
                                
                            default:
                                this.debugLog(`Unknown render option: ${subcommand}`, 'error');
                                this.debugLog('Options: wireframe, depthorder, normals, bounds, raycast, projection, culling, overdraw, targetinfo, treediag, faceorder, heatmap, stats, highlight, pause, nearplane, blockmodels, angle, swim, swimlog, all, none', 'info');
                        }
                        break;
                        
                    case 'algo':
                        // Top-level algorithm selection command
                        const algoType = args[0] ? args[0].toLowerCase() : '';
                        if (!algoType || !['painter', 'zbuffer', 'bsp'].includes(algoType)) {
                            this.debugLog('Usage: algo <type>', 'error');
                            this.debugLog('Types: painter, zbuffer, bsp', 'info');
                            this.debugLog('  painter  - Classic painter\'s algorithm (sort back-to-front)', 'info');
                            this.debugLog('  zbuffer  - Z-buffer simulation (sub-pixel depth precision)', 'info');
                            this.debugLog('  bsp      - Binary Space Partitioning (spatial tree)', 'info');
                            this.debugLog(`Current: ${this.debugSettings.renderAlgorithm}`, 'info');
                            break;
                        }
                        this.debugSettings.renderAlgorithm = algoType as 'painter' | 'zbuffer' | 'bsp';
                        this.debugLog(`Render algorithm: ${algoType.toUpperCase()}`, 'success');
                        
                        // Show algorithm description
                        const descriptions = {
                            painter: 'Sorts blocks and faces by distance, renders back-to-front',
                            zbuffer: 'Enhanced depth sorting with sub-pixel precision',
                            bsp: 'Spatial tree traversal for optimal rendering order'
                        };
                        this.debugLog(descriptions[algoType], 'info');
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
                    ka69: 'KA-69', water_bucket: 'Water Bucket', lava_bucket: 'Lava Bucket',
                    obsidian: 'Obsidian', cherryWood: 'Cherry Wood', cherryLeaves: 'Cherry Leaves',
                    chest: 'Chest', seeds: 'Seeds', berdger: 'The Berdger', apple: 'Apple',
                    sakuraPetal: 'Cherry Petal', shimenawa: 'Sacred Rope', omamori: 'Charm',
                    ema: 'Wish Plaque', incense: 'Incense', whiteBrick: 'White Brick',
                    redBrick: 'Red Brick', glowstone: 'Burgerstone', ritualStone: 'Ritual Stone'
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
                    notification.querySelector('.pickup-icon').appendChild(miniCanvas);
                    
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
            
            getFluidLevel(x, y, z) {
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
                    this.updateInventoryHeldCursor(); // Hide the ghost
                    // Set flag to prevent pause from pointer lock release
                    this.justClosedInventory = true;
                    setTimeout(() => { this.justClosedInventory = false; }, 100);
                    // Re-request pointer lock when closing inventory
                    if (!this.isPaused) {
                        this.canvas.requestPointerLock();
                    }
                }
            },
            
            // Attempt to repair KA-69 with NPC (costs 15 seeds)
            attemptRepair() {
                // Check if player has seeds
                const seedCount = this.getItemCount('seed');
                const REPAIR_COST = 15;
                
                if (seedCount < REPAIR_COST) {
                    this.debugLog(`Repair NPC: "Need ${REPAIR_COST} seeds! You only have ${seedCount}."`, 'warn');
                    return;
                }
                
                // Find broken KA-69 in inventory
                let repairedSomething = false;
                
                // Check hotbar
                for (let i = 0; i < this.inventory.hotbar.length; i++) {
                    const slot = this.inventory.hotbar[i];
                    if (slot && slot.id === 'ka69' && slot.durability !== undefined && slot.durability === 0) {
                        // Repair it!
                        slot.durability = slot.maxDurability || 100;
                        repairedSomething = true;
                        this.debugLog('✨ Repair NPC: "Your KA-69 is good as new!"', 'success');
                        break;
                    }
                }
                
                // Check main inventory if not found in hotbar
                if (!repairedSomething) {
                    for (let i = 0; i < this.inventory.main.length; i++) {
                        const slot = this.inventory.main[i];
                        if (slot && slot.id === 'ka69' && slot.durability !== undefined && slot.durability === 0) {
                            // Repair it!
                            slot.durability = slot.maxDurability || 100;
                            repairedSomething = true;
                            this.debugLog('✨ Repair NPC: "Your KA-69 is good as new!"', 'success');
                            break;
                        }
                    }
                }
                
                if (repairedSomething) {
                    // Remove seeds
                    this.removeItemFromInventory('seed', REPAIR_COST);
                    this.updateHotbarDisplay();
                    
                    // Make NPC speak
                    if (this.repairNPC) {
                        this.repairNPC.lastSpoke = Date.now();
                    }
                } else {
                    this.debugLog('Repair NPC: "You don\'t have a broken KA-69 to fix!"', 'warn');
                }
            },
            
            // Open dialogue with NPC
            openDialogue(npcType) {
                if (npcType === 'gunsmith') {
                    this.dialogueOpen = true;
                    this.currentDialogueNPC = 'gunsmith';
                    this.isPaused = true;
                    
                    // Release pointer lock so player can click dialogue options
                    if (document.pointerLockElement) {
                        document.exitPointerLock();
                    }
                    
                    // Mark as met
                    if (!this.gunsmithMetBefore) {
                        this.gunsmithMetBefore = true;
                        // Activate first quest
                        if (this.questData['meet_gunsmith']) {
                            this.questData['meet_gunsmith'].stage = 1;
                            this.quests.push(this.questData['meet_gunsmith']);
                        }
                    }
                    
                    this.renderDialogue();
                }
            },
            
            // Close dialogue
            closeDialogue() {
                this.dialogueOpen = false;
                this.currentDialogueNPC = null;
                this.isPaused = false;
                
                const dialogue = document.getElementById('dialogueScreen');
                if (dialogue) dialogue.style.display = 'none';
                
                // Don't auto-request pointer lock - browser blocks it for security
                // Show click-to-play overlay instead
                const clickToPlay = document.getElementById('clickToPlay');
                if (clickToPlay) {
                    clickToPlay.classList.add('active');
                }
            },
            
            // Toggle journal
            toggleJournal() {
                this.journalOpen = !this.journalOpen;
                
                if (this.journalOpen) {
                    this.isPaused = true;
                    
                    // Release pointer lock
                    if (document.pointerLockElement) {
                        document.exitPointerLock();
                    }
                    
                    this.renderJournal();
                } else {
                    this.isPaused = false;
                    const journal = document.getElementById('journalScreen');
                    if (journal) journal.style.display = 'none';
                    
                    // Show click-to-play overlay instead of auto-requesting pointer lock
                    const clickToPlay = document.getElementById('clickToPlay');
                    if (clickToPlay) {
                        clickToPlay.classList.add('active');
                    }
                }
            },
            
            // Render dialogue UI
            renderDialogue() {
                // Remove old dialogue if it exists (ensures fresh styles)
                let dialogueHTML = document.getElementById('dialogueScreen');
                if (dialogueHTML) {
                    dialogueHTML.remove();
                }
                
                // Create dialogue screen element
                dialogueHTML = document.createElement('div');
                dialogueHTML.id = 'dialogueScreen';
                dialogueHTML.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: min(92vw, 500px);
                    background: rgba(30, 20, 40, 0.97);
                    border: 3px solid #8b7355;
                    border-radius: 8px;
                    color: #fff;
                    font-family: 'Courier New', monospace;
                    z-index: 9999;
                    box-shadow: 0 0 30px rgba(0,0,0,0.7);
                    overflow: hidden;
                `;
                // Append to game container, not body, so it appears above the canvas
                const gameContainer = document.getElementById('minecraftGame');
                (gameContainer || document.body).appendChild(dialogueHTML);
                
                // Add scrollbar styles (only once)
                if (!document.getElementById('dialogueStyles')) {
                    const style = document.createElement('style');
                    style.id = 'dialogueStyles';
                    style.textContent = `
                        #dialogueScreen .dialogue-content::-webkit-scrollbar { width: 8px; }
                        #dialogueScreen .dialogue-content::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 4px; }
                        #dialogueScreen .dialogue-content::-webkit-scrollbar-thumb { background: #8b7355; border-radius: 4px; }
                        #dialogueScreen .dialogue-content::-webkit-scrollbar-thumb:hover { background: #a08060; }
                    `;
                    document.head.appendChild(style);
                }
                
                // Gunsmith dialogue
                if (this.currentDialogueNPC === 'gunsmith') {
                    const stage = this.gunsmithDialogueStage;
                    let npcName = '🧙 Gunsmith Wizard';
                    let dialogueText = '';
                    
                    // First meeting
                    if (!this.gunsmithMetBefore || stage === 0) {
                        dialogueText = `
                            <p><em>*The wizard adjusts his pointed hat and grins*</em></p>
                            <p>"Ah! A fellow survivor of the Great Feathering! Welcome!"</p>
                            <p>"I've been studying these birds for quite some time. Aggressive spawning, 
                            coordinated attacks, suspiciously optimized pathfinding..."</p>
                            <p><em>*He pulls out a worn notebook*</em></p>
                            <p>"I think there's a <strong>source</strong> to all this. Something is spawning 
                            these creatures at an unnaturally high rate!"</p>
                            <p>"I'm a traveling gunsmith—I can repair your KA-69. And if you want to 
                            <em>solve</em> this bird problem, I could use your help."</p>
                        `;
                    } else {
                        dialogueText = `
                            <p>"Ah, back again! How's the bird-battling going?"</p>
                            <p><em>*He peers at you with curious eyes*</em></p>
                            <p>"I'm still working on tracking down the source of all these birds. 
                            The more data we gather, the closer we get to the truth!"</p>
                        `;
                    }
                    
                    // Calculate max scroll height based on viewport
                    const maxScrollHeight = Math.min(window.innerHeight * 0.4, 200);
                    
                    dialogueHTML.innerHTML = `
                        <!-- Header -->
                        <div style="padding: 12px 16px; border-bottom: 2px solid #8b7355; background: rgba(20, 15, 30, 0.5);">
                            <h2 style="color: #ffd700; margin: 0; font-size: 15px;">${npcName}</h2>
                        </div>
                        
                        <!-- Scrollable Content - explicit max-height -->
                        <div class="dialogue-content" style="max-height: ${maxScrollHeight}px; overflow-y: scroll; padding: 12px 16px; font-size: 12px; line-height: 1.5;">
                            ${dialogueText}
                        </div>
                        
                        <!-- Fixed Options -->
                        <div style="padding: 10px 16px; border-top: 2px solid #8b7355; background: rgba(20, 15, 30, 0.5);">
                            <div onclick="window.game.handleDialogueChoice('speak')" 
                                 style="padding: 8px 10px; margin: 4px 0; background: rgba(139, 115, 85, 0.3); 
                                        border: 2px solid #8b7355; border-radius: 4px; cursor: pointer; 
                                        transition: all 0.2s; font-size: 11px;"
                                 onmouseover="this.style.background='rgba(139, 115, 85, 0.5)'"
                                 onmouseout="this.style.background='rgba(139, 115, 85, 0.3)'">
                                💬 <strong>Speak</strong> - "Tell me about your quest"
                            </div>
                            <div onclick="window.game.handleDialogueChoice('repair')" 
                                 style="padding: 8px 10px; margin: 4px 0; background: rgba(65, 105, 225, 0.3); 
                                        border: 2px solid #4169e1; border-radius: 4px; cursor: pointer;
                                        transition: all 0.2s; font-size: 11px;"
                                 onmouseover="this.style.background='rgba(65, 105, 225, 0.5)'"
                                 onmouseout="this.style.background='rgba(65, 105, 225, 0.3)'">
                                🔧 <strong>Repair KA-69</strong> - 15 seeds
                            </div>
                            <div onclick="window.game.handleDialogueChoice('exit')" 
                                 style="padding: 8px 10px; margin: 4px 0; background: rgba(139, 0, 0, 0.3); 
                                        border: 2px solid #8b0000; border-radius: 4px; cursor: pointer;
                                        transition: all 0.2s; font-size: 11px;"
                                 onmouseover="this.style.background='rgba(139, 0, 0, 0.5)'"
                                 onmouseout="this.style.background='rgba(139, 0, 0, 0.3)'">
                                🚪 <strong>Exit</strong>
                            </div>
                        </div>
                    `;
                    
                    // Style paragraphs
                    dialogueHTML.querySelectorAll('.dialogue-content p').forEach(p => {
                        (p as HTMLElement).style.margin = '6px 0';
                    });
                    
                    // Add wheel event listener to ensure scrolling works
                    const contentDiv = dialogueHTML.querySelector('.dialogue-content') as HTMLElement;
                    if (contentDiv) {
                        contentDiv.addEventListener('wheel', (e) => {
                            e.stopPropagation();
                            contentDiv.scrollTop += e.deltaY;
                        }, { passive: true });
                    }
                }
            },
            
            // Handle dialogue choice
            handleDialogueChoice(choice) {
                if (choice === 'speak') {
                    // Quest dialogue
                    this.showQuestDialogue();
                } else if (choice === 'repair') {
                    // Repair function
                    this.attemptRepair();
                    // Update dialogue to show result
                    setTimeout(() => {
                        if (this.dialogueOpen) {
                            this.renderDialogue();
                        }
                    }, 100);
                } else if (choice === 'exit') {
                    this.closeDialogue();
                }
            },
            
            // Show quest-related dialogue
            showQuestDialogue() {
                const dialogueHTML = document.getElementById('dialogueScreen');
                if (!dialogueHTML) return;
                
                // Calculate max scroll height based on viewport
                const maxScrollHeight = Math.min(window.innerHeight * 0.4, 200);
                
                dialogueHTML.innerHTML = `
                    <!-- Header -->
                    <div style="padding: 12px 16px; border-bottom: 2px solid #8b7355; background: rgba(20, 15, 30, 0.5);">
                        <h2 style="color: #ffd700; margin: 0; font-size: 15px;">🧙 Gunsmith Wizard</h2>
                    </div>
                    
                    <!-- Scrollable Content - explicit max-height -->
                    <div class="dialogue-content" style="max-height: ${maxScrollHeight}px; overflow-y: scroll; padding: 12px 16px; font-size: 12px; line-height: 1.5;">
                        <p>"Excellent! I knew you had that collaborative spirit!"</p>
                        <p><em>*He spreads out a map with various markings*</em></p>
                        <p>"These birds aren't randomly spawning. There's <em>intelligence</em> behind this. 
                        Maybe a cursed artifact, maybe a rogue wizard!"</p>
                        <p>"I need <strong>data</strong>. Survive some waves, gather drops from defeated birds, 
                        and come back to me."</p>
                        <div style="background: rgba(255, 215, 0, 0.15); border: 1px solid #ffd700; border-radius: 4px; padding: 10px; margin: 10px 0;">
                            <p style="color: #ffd700; margin: 0 0 6px 0;">
                                <strong>📜 QUEST: Origin of the Feathered Menace</strong>
                            </p>
                            <p style="margin: 3px 0; color: #ccc;">• Survive 3 bird waves</p>
                            <p style="margin: 3px 0; color: #ccc;">• Collect 50 bird drops</p>
                            <p style="margin: 3px 0; color: #ccc;">• Return to the Gunsmith</p>
                        </div>
                        <p style="color: #aaa;">Press <strong>J</strong> to open your journal.</p>
                    </div>
                    
                    <!-- Fixed Options -->
                    <div style="padding: 10px 16px; border-top: 2px solid #8b7355; background: rgba(20, 15, 30, 0.5);">
                        <div onclick="window.game.handleDialogueChoice('exit')" 
                             style="padding: 8px 10px; margin: 4px 0; background: rgba(65, 105, 225, 0.3); 
                                    border: 2px solid #4169e1; border-radius: 4px; cursor: pointer;
                                    transition: all 0.2s; font-size: 11px;"
                             onmouseover="this.style.background='rgba(65, 105, 225, 0.5)'"
                             onmouseout="this.style.background='rgba(65, 105, 225, 0.3)'">
                            ✓ <strong>Accept Quest</strong>
                        </div>
                    </div>
                `;
                
                // Style paragraphs
                dialogueHTML.querySelectorAll('.dialogue-content > p').forEach(p => {
                    (p as HTMLElement).style.margin = '6px 0';
                });
                
                // Add wheel event listener to ensure scrolling works
                const contentDiv = dialogueHTML.querySelector('.dialogue-content') as HTMLElement;
                if (contentDiv) {
                    contentDiv.addEventListener('wheel', (e) => {
                        e.stopPropagation();
                        contentDiv.scrollTop += e.deltaY;
                    }, { passive: true });
                }
                
                // Unlock the quest
                if (this.questData['birds_origin'].status === 'locked') {
                    this.questData['birds_origin'].status = 'active';
                    this.questData['birds_origin'].stage = 1;
                    this.quests.push(this.questData['birds_origin']);
                }
                
                // Mark first quest as completed
                if (this.questData['meet_gunsmith']) {
                    this.questData['meet_gunsmith'].stage = 2;
                    this.questData['meet_gunsmith'].status = 'completed';
                }
            },
            
            // Render journal UI
            renderJournal() {
                let journalHTML = document.getElementById('journalScreen');
                if (!journalHTML) {
                    // Create journal screen element
                    journalHTML = document.createElement('div');
                    journalHTML.id = 'journalScreen';
                    journalHTML.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: min(90%, 600px);
                        max-height: 80%;
                        background: rgba(40, 30, 20, 0.97);
                        border: 4px solid #8b7355;
                        border-radius: 8px;
                        padding: 20px;
                        color: #fff;
                        font-family: 'Courier New', monospace;
                        z-index: 9999;
                        overflow-y: auto;
                        box-shadow: 0 0 40px rgba(0,0,0,0.8);
                    `;
                    // Append to game container, not body, so it appears above the canvas
                    const gameContainer = document.getElementById('minecraftGame');
                    (gameContainer || document.body).appendChild(journalHTML);
                }
                
                journalHTML.style.display = 'block';
                
                let html = `
                    <div style="border-bottom: 2px solid #8b7355; padding-bottom: 12px; margin-bottom: 15px;">
                        <h1 style="color: #ffd700; margin: 0; font-size: 22px;">📖 Quest Journal</h1>
                        <p style="color: #aaa; margin: 4px 0 0 0; font-size: 11px;">Press J to close</p>
                    </div>
                `;
                
                // Active quests
                const activeQuests = this.quests.filter(q => q.status === 'active');
                if (activeQuests.length > 0) {
                    html += `<h2 style="color: #4169e1; margin: 15px 0 8px 0; font-size: 16px;">Active Quests</h2>`;
                    activeQuests.forEach(quest => {
                        html += `
                            <div style="background: rgba(65, 105, 225, 0.2); border: 2px solid #4169e1; 
                                        border-radius: 6px; padding: 12px; margin: 8px 0;">
                                <h3 style="color: #ffd700; margin: 0 0 8px 0; font-size: 14px;">${quest.title}</h3>
                                <p style="line-height: 1.4; margin: 6px 0; font-size: 12px;">${quest.description}</p>
                                <div style="margin-top: 10px;">
                                    <strong style="color: #4169e1; font-size: 12px;">Objectives:</strong>
                                    <ul style="margin: 4px 0; padding-left: 18px; font-size: 12px;">
                                        ${quest.objectives.map(obj => `<li style="margin: 2px 0;">${obj}</li>`).join('')}
                                    </ul>
                                </div>
                                ${quest.progress ? `
                                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #4169e1; font-size: 12px;">
                                        <strong>Progress:</strong> 
                                        Waves: ${quest.progress.waves}/3 | 
                                        Drops: ${quest.progress.drops}/50
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    });
                }
                
                // Completed quests
                const completedQuests = this.quests.filter(q => q.status === 'completed');
                if (completedQuests.length > 0) {
                    html += `<h2 style="color: #228b22; margin: 20px 0 8px 0; font-size: 16px;">Completed Quests</h2>`;
                    completedQuests.forEach(quest => {
                        html += `
                            <div style="background: rgba(34, 139, 34, 0.2); border: 2px solid #228b22; 
                                        border-radius: 6px; padding: 12px; margin: 8px 0; opacity: 0.7;">
                                <h3 style="color: #90ee90; margin: 0 0 6px 0; font-size: 14px;">✓ ${quest.title}</h3>
                                <p style="line-height: 1.4; margin: 6px 0; font-size: 11px;">${quest.description}</p>
                            </div>
                        `;
                    });
                }
                
                if (this.quests.length === 0) {
                    html += `
                        <div style="text-align: center; padding: 30px; color: #888;">
                            <p style="font-size: 14px;">No quests yet...</p>
                            <p style="font-size: 12px;">Talk to NPCs to discover new quests!</p>
                        </div>
                    `;
                }
                
                journalHTML.innerHTML = html;
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
                        ka69: 'KA-69', water_bucket: 'Water Bucket', lava_bucket: 'Lava Bucket',
                        lava: 'Lava', obsidian: 'Obsidian', cherryWood: 'Cherry Wood',
                        cherryLeaves: 'Cherry Leaves', chest: 'Chest',
                        ritualChest: 'Ritual Chest', buildingChest: 'Building Chest',
                        dungeonChest: 'Dungeon Chest',
                        seeds: 'Seeds', berdger: 'The Berdger',
                        sakuraPetal: 'Sacred Cherry Petal', shimenawa: 'Sacred Rope',
                        omamori: 'Protective Charm', ema: 'Wooden Wish Plaque',
                        incense: 'Purifying Incense',
                        // Underground
                        bedrock: 'Bedrock', deepslate: 'Deepslate', mossyStone: 'Mossy Stone',
                        dungeonBrick: 'Dungeon Brick', dungeonMossy: 'Mossy Dungeon Brick',
                        // Ores
                        sakuraite: 'Sakuraite Ore', moonstone: 'Moonstone Ore',
                        jadite: 'Jadite Ore', crimsonite: 'Crimsonite Ore',
                        voidstone: 'Voidstone Ore', spirite: 'Spirite Ore',
                        // Containers
                        barrel: 'Storage Barrel', crate: 'Wooden Crate',
                        furnace: 'Furnace', alchemyTable: 'Alchemy Table',
                        storageShrine: 'Storage Shrine',
                        // Other
                        whiteBrick: 'White Brick', redBrick: 'Red Brick',
                        glowstone: 'Burgerstone', ritualStone: 'Ritual Stone',
                        appleLeaves: 'Apple Tree Leaves'
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
                        if ((atTop && (e as WheelEvent).deltaY < 0) || (atBottom && (e as WheelEvent).deltaY > 0)) {
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
                        
                        const source = (slot as HTMLElement).dataset.source;
                        const index = parseInt((slot as HTMLElement).dataset.index);
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
                            this.updateInventoryHeldCursor();
                            this.renderInventory();
                            this.updateHotbar();
                            this.updateHotbarDisplay();
                        } else if (clickedItem && clickedItem.count > 0) {
                            // Pick up this item
                            this.inventoryHeldItem = { source, index };
                            this.updateInventoryHeldCursor();
                            this.renderInventory();
                        }
                    });
                    
                    // Also support drag and drop
                    slot.addEventListener('dragstart', (e) => {
                        e.stopPropagation();
                        const source = (slot as HTMLElement).dataset.source;
                        const index = parseInt((slot as HTMLElement).dataset.index);
                        this.draggedItem = { source, index };
                        slot.classList.add('dragging');
                        (e as DragEvent).dataTransfer.effectAllowed = 'move';
                        (e as DragEvent).dataTransfer.setDragImage(slot, 20, 20);
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
                        (e as DragEvent).dataTransfer.dropEffect = 'move';
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
                        
                        const targetSource = (slot as HTMLElement).dataset.source;
                        const targetIndex = parseInt((slot as HTMLElement).dataset.index);
                        
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
            
            updateInventoryHeldCursor() {
                let ghost = document.getElementById('invHeldGhost');
                
                if (this.inventoryHeldItem) {
                    const { source, index } = this.inventoryHeldItem;
                    const slotArray = source === 'hotbar' ? this.inventory.hotbar : this.inventory.main;
                    const item = slotArray[index];
                    
                    if (item && item.count > 0) {
                        if (!ghost) {
                            ghost = document.createElement('div');
                            ghost.id = 'invHeldGhost';
                            ghost.className = 'inv-held-ghost';
                            document.body.appendChild(ghost);
                            
                            // Add persistent mouse tracking
                            document.addEventListener('mousemove', (e) => {
                                const g = document.getElementById('invHeldGhost');
                                if (g && g.style.display !== 'none') {
                                    g.style.left = e.clientX + 'px';
                                    g.style.top = e.clientY + 'px';
                                }
                            });
                        }
                        
                        ghost.innerHTML = `<span class="ghost-icon">${this.getItemEmoji(item)}</span>`;
                        if (item.count > 1) {
                            ghost.innerHTML += `<span class="ghost-count">${item.count}</span>`;
                        }
                        ghost.style.display = 'block';
                    } else {
                        if (ghost) ghost.style.display = 'none';
                    }
                } else {
                    if (ghost) ghost.style.display = 'none';
                }
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
                    ka69: '🔫', water_bucket: '🪣', lava_bucket: '🫧',
                    lava: '🔥', obsidian: '🟣', cherryWood: '🪵', cherryLeaves: '🌸',
                    chest: '📦', ritualChest: '📦', buildingChest: '📦', dungeonChest: '📦',
                    seeds: '🌾', berdger: '🍔',
                    sakuraPetal: '🌸', shimenawa: '🪢', omamori: '🎀',
                    ema: '🪧', incense: '🕯️',
                    // Underground blocks
                    bedrock: '⬛', deepslate: '🪨', mossyStone: '🪨',
                    dungeonBrick: '🧱', dungeonMossy: '🧱',
                    // Ores
                    sakuraite: '💎', moonstone: '🌙', jadite: '💚',
                    crimsonite: '❤️', voidstone: '🖤', spirite: '💠',
                    // Containers
                    barrel: '🛢️', crate: '📦', furnace: '🔥',
                    alchemyTable: '⚗️', storageShrine: '⛩️',
                    // Other
                    whiteBrick: '🧱', redBrick: '🧱', glowstone: '💡',
                    ritualStone: '🪨', appleLeaves: '🍃',
                    // Furniture
                    table: '🪑', chair: '🪑', bed: '🛏️', bedPillow: '🛏️',
                    cashRegister: '🧾', stool: '🪑', counter: '🗄️',
                    lamp: '💡', bookshelf: '📚', plant: '🌿',
                    sink: '🚰', stove: '🔥', fridge: '🧊'
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
                // CRITICAL: Must use NEGATIVE angles to match projection coordinate system!
                // Projection uses -rotX and -rotY, so raycast must too
                const pitch = -this.camera.rotX;
                const yaw = -this.camera.rotY;
                
                const cosPitch = Math.cos(pitch);
                const sinPitch = Math.sin(pitch);
                const cosYaw = Math.cos(yaw);
                const sinYaw = Math.sin(yaw);
                
                // Direction vector in projection's coordinate system
                // This MUST produce the ray that goes through screen center
                const dx = sinYaw * cosPitch;
                const dy = sinPitch;
                const dz = cosYaw * cosPitch;
                
                // Normalize direction (important for accurate distance calculation)
                const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
                const dirX = dx / len;
                const dirY = dy / len;
                const dirZ = dz / len;
                
                // Ray origin - start from camera eye position (must match projection!)
                const x = this.camera.x;
                const y = this.camera.y + this.getEyeHeight();  // CRITICAL: Must include eye height to match projection!
                const z = this.camera.z;
                
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
                
                // Maximum reach distance - 4 blocks (Minecraft-like)
                const maxDistance = 4;
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
                            if (block === 'water') throughWater = true;
                            if (block === 'lava') throughLava = true;
                        } else {
                            // Hit a solid block! Calculate placement position
                            let placePos = null;
                            // Use enteredFace directly - this is the face we crossed to enter THIS block
                            // lastSolidFace is only needed when passing through fluids
                            const placeFace = (throughWater || throughLava) ? (lastSolidFace || enteredFace) : enteredFace;
                            if (placeFace && (placeFace.x !== 0 || placeFace.y !== 0 || placeFace.z !== 0)) {
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
                                throughLava: throughLava,
                                hitT: t,
                                enteredFace: placeFace,  // The face we entered from
                                lastSolidFace: lastSolidFace,
                                rawEnteredFace: enteredFace,
                                debugTMax: { x: tMaxX, y: tMaxY, z: tMaxZ },
                                debugStep: { x: stepX, y: stepY, z: stepZ }
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
                const belowFeetBlock = this.getBlock(px, Math.floor(playerFeetY) - 1, pz);
                
                // Simple fluid detection - ONLY when body part is INSIDE fluid block
                const feetInWater = feetBlock === 'water';
                const feetInLava = feetBlock === 'lava';
                const waistInWater = waistBlock === 'water';
                const waistInLava = waistBlock === 'lava';
                const headInWater = headBlock === 'water';
                const headInLava = headBlock === 'lava';
                const belowFeetInWater = belowFeetBlock === 'water';
                const belowFeetInLava = belowFeetBlock === 'lava';
                
                // Swimming = feet or waist are INSIDE a fluid block
                const inWater = feetInWater || waistInWater;
                const inLava = feetInLava || waistInLava;
                const swimming = inWater || inLava;
                const submerged = headInWater || headInLava;
                
                // Surface floating ONLY when:
                // 1. Waist is in water (deep enough to float)
                // 2. Head is NOT in water (above surface)
                // 3. Player has upward or near-zero velocity (not actively falling in)
                // This prevents floating from triggering when entering water from above
                const stableAtSurface = waistInWater && !headInWater && this.velocity.y > -0.02;
                const atFluidSurface = stableAtSurface && !this.keys['shift'];
                
                // Store fluid state for rendering effects
                this.inWater = inWater || headInWater;
                this.inLava = inLava || headInLava;
                this.swimming = swimming;
                this.headSubmergedWater = headInWater;
                this.headSubmergedLava = headInLava;
                
                // DEBUG: Store swim debug info for display
                this.swimDebugInfo = {
                    feetBlock: feetBlock || 'air',
                    waistBlock: waistBlock || 'air', 
                    headBlock: headBlock || 'air',
                    belowFeetBlock: belowFeetBlock || 'air',
                    feetInWater, waistInWater, headInWater,
                    inWater, swimming, submerged,
                    stableAtSurface, atFluidSurface,
                    velocityY: this.velocity.y,
                    playerFeetY,
                    physicsBranch: 'none'  // Will be set by physics code
                };
                
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
                    // MINECRAFT-STYLE SWIMMING:
                    // - At surface (stable): FLOAT by default
                    // - Underwater or entering: SINK, SPACE to swim up
                    
                    const isLava = inLava;
                    const swimDrag = isLava ? 0.90 : 0.92;
                    const maxSwimSpeed = isLava ? 0.10 : 0.14;
                    
                    if (atFluidSurface) {
                        // === STABLE AT SURFACE - FLOAT ===
                        // Only triggers when waist in water, head out, velocity stable
                        if (this.swimDebugInfo) this.swimDebugInfo.physicsBranch = 'FLOAT';
                        
                        const equilibriumForce = 0.002;
                        const heavyDamping = 0.75;
                        
                        if (this.velocity.y < -0.002) {
                            this.velocity.y += equilibriumForce * 4;
                        } else if (this.velocity.y > 0.002) {
                            this.velocity.y -= equilibriumForce * 3;
                        }
                        
                        this.velocity.y *= heavyDamping;
                        this.velocity.y = Math.max(-0.006, Math.min(0.006, this.velocity.y));
                        
                        // SPACE at surface = jump out of water
                        if (this.keys[' ']) {
                            this.velocity.y = 0.22;
                            if (this.swimDebugInfo) this.swimDebugInfo.physicsBranch = 'JUMP';
                        }
                        
                    } else {
                        // === UNDERWATER / ENTERING / DIVING - SINK ===
                        if (this.swimDebugInfo) this.swimDebugInfo.physicsBranch = 'SINK';
                        
                        const sinkSpeed = isLava ? 0.010 : 0.014;
                        const swimUpForce = isLava ? 0.032 : 0.048;
                        const swimDownForce = isLava ? 0.018 : 0.028;
                        
                        // Sink by default
                        this.velocity.y -= sinkSpeed;
                        
                        // SPACE = swim up
                        if (this.keys[' ']) {
                            this.velocity.y += swimUpForce;
                            if (this.swimDebugInfo) this.swimDebugInfo.physicsBranch = 'SWIM_UP';
                        }
                        
                        // SHIFT = swim down faster
                        if (this.keys['shift']) {
                            this.velocity.y -= swimDownForce;
                            if (this.swimDebugInfo) this.swimDebugInfo.physicsBranch = 'DIVE';
                        }
                        
                        // Apply drag
                        this.velocity.y *= swimDrag;
                        
                        // Clamp velocity
                        this.velocity.y = Math.max(-maxSwimSpeed, Math.min(maxSwimSpeed, this.velocity.y));
                    }
                    
                } else {
                    // NORMAL MODE: Standard gravity
                    if (this.swimDebugInfo) this.swimDebugInfo.physicsBranch = 'GRAVITY';
                    this.velocity.y += this.gravity;
                }
                
                // Console logging for swim debugging
                if (this.debugSettings.swimConsoleLog && this.swimDebugInfo && this.swimming) {
                    console.log(`[SWIM] branch=${this.swimDebugInfo.physicsBranch} velY=${this.velocity.y.toFixed(4)} waist=${this.swimDebugInfo.waistInWater} head=${this.swimDebugInfo.headInWater} stable=${this.swimDebugInfo.stableAtSurface} atSurf=${this.swimDebugInfo.atFluidSurface}`);
                }
                
                const newY = this.camera.y + this.velocity.y;
                
                // Ground collision - camera is at hip/waist level (playerEyeHeight above ground)
                const groundY = this.getGroundHeightBelow(this.camera.x, this.camera.z, this.camera.y) + this.playerEyeHeight + 0.5;
                
                if (swimming) {
                    // SWIMMING: Only prevent falling through solid ground, but don't "land"
                    // Player should sink/swim in water, not stand on underwater ground
                    if (newY < groundY) {
                        // Hit solid ground under the water - stop sinking but stay in swim mode
                        this.camera.y = groundY;
                        this.velocity.y = Math.max(0, this.velocity.y); // Only allow upward movement
                    } else {
                        this.camera.y = newY;
                    }
                    // Player is never "on ground" while swimming - no jumping allowed
                    this.isJumping = true; // Prevents ground-based jumping
                } else if (newY < groundY) {
                    // NORMAL: Land on ground
                    this.camera.y = groundY;
                    this.velocity.y = 0;
                    this.isJumping = false;
                    
                    // Jump cooldown system - prevent spam jumping
                    const now = Date.now();
                    const jumpCooldown = 350; // 350ms between jumps
                    if (!this.lastJumpTime) this.lastJumpTime = 0;
                    
                    // Continuous jumping - if space is held and on ground, jump (with cooldown)
                    if (this.keys[' '] && (now - this.lastJumpTime > jumpCooldown)) {
                        this.velocity.y = 0.28;
                        this.isJumping = true;
                        this.stats.jumps++;
                        this.lastJumpTime = now;
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
            getGroundHeightBelow(x, z, currentY, eyeHeight = null) {
                const bx = Math.floor(x);
                const bz = Math.floor(z);
                // Use provided eyeHeight, or default to playerEyeHeight for player calls
                const adjustedEyeHeight = eyeHeight !== null ? eyeHeight : this.playerEyeHeight;
                const startY = Math.floor(currentY - adjustedEyeHeight); // Start from feet level
                
                for (let y = startY; y >= 0; y--) {
                    const block = this.getBlock(bx, y, bz);
                    // Fluids don't count as ground - player sinks through them
                    if (block && !this.fluidBlocks.includes(block)) {
                        return y + 1;
                    }
                }
                return 0;
            },
            
            // Get ground height at position (searches from top down)
            getGroundHeight(x, z) {
                const bx = Math.floor(x);
                const bz = Math.floor(z);
                
                // Search from reasonable max height down to bedrock
                for (let y = 40; y >= 0; y--) {
                    const block = this.getBlock(bx, y, bz);
                    // Found solid ground (not air, water, or lava)
                    if (block && block !== 'water' && block !== 'lava') {
                        return y;
                    }
                }
                return 0; // Fallback to bedrock level
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
                
                const ctx = this.ctx;
                const width = this.canvas.width;
                const height = this.canvas.height;
                
                // Calculate eye height for sneaking
                const renderCamY = this.camera.y + this.getEyeHeight();
                
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
                const camY = renderCamY; // Use adjusted height for sneaking
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
                // Near plane distance - smaller value = can get closer to blocks
                const nearPlane = 0.05; // Reduced from 0.1 for closer viewing
                
                const project = (x, y, z) => {
                    const dx = x - camX;
                    const dy = y - camY;
                    const dz = z - camZ;
                    const rx = dx * cosY - dz * sinY;
                    const rz = dx * sinY + dz * cosY;
                    const ry = dy * cosX - rz * sinX;
                    const finalZ = dy * sinX + rz * cosX;
                    
                    // Clamp to near plane instead of returning null
                    // This prevents faces from disappearing when partially behind camera
                    if (finalZ <= nearPlane) {
                        // For extremely close/behind vertices, clamp and scale to near plane
                        const clampedZ = nearPlane;
                        const scale = clampedZ / Math.max(finalZ, 0.001);
                        return { 
                            x: halfW + (rx * scale / clampedZ) * fov, 
                            y: halfH - (ry * scale / clampedZ) * fov, 
                            z: clampedZ,
                            clamped: true 
                        };
                    }
                    return { x: halfW + (rx / finalZ) * fov, y: halfH - (ry / finalZ) * fov, z: finalZ };
                };
                
                // Collect visible blocks with frustum culling
                const blocks = [];
                const camDirX = -Math.sin(this.camera.rotY);
                const camDirZ = Math.cos(this.camera.rotY);
                
                // OPTIMIZATION: Only iterate over blocks within render distance
                // Instead of checking all world blocks, iterate a fixed volume around camera
                const camBlockX = Math.floor(camX);
                const camBlockY = Math.floor(camY);
                const camBlockZ = Math.floor(camZ);
                const rd = Math.ceil(renderDist);
                
                for (let x = camBlockX - rd; x <= camBlockX + rd; x++) {
                    for (let z = camBlockZ - rd; z <= camBlockZ + rd; z++) {
                        // Quick horizontal distance check
                        const hdx = x + 0.5 - camX;
                        const hdz = z + 0.5 - camZ;
                        const hDistSq = hdx * hdx + hdz * hdz;
                        if (hDistSq > renderDistSq) continue;
                        
                        // Frustum culling - skip columns behind camera
                        const dot = hdx * camDirX + hdz * camDirZ;
                        if (dot < -3 && hDistSq > 16) continue;
                        
                        // Check vertical range
                        for (let y = Math.max(0, camBlockY - rd); y <= Math.min(60, camBlockY + rd); y++) {
                            const key = `${x},${y},${z}`;
                            const type = this.world[key];
                            if (!type) continue;
                            
                            const dy = y + 0.5 - camY;
                            const distSq = hDistSq + dy * dy;
                            
                            if (distSq > renderDistSq) continue;
                            
                            blocks.push({ x, y, z, dist: distSq, type });
                        }
                    }
                }
                
                // Sort back-to-front (painter's algorithm)
                blocks.sort((a, b) => b.dist - a.dist);
                
                // Render blocks with face culling
                const getBlock = (x, y, z) => this.world[`${x},${y},${z}`];
                
                // Check if a face should be rendered - includes transparent solid blocks
                const isTransparent = (block) => {
                    if (!block) return true; // No block = show face
                    if (this.fluidBlocks.includes(block)) return true; // Fluid = transparent
                    // Check if block has transparency property (leaves, glass, etc.)
                    const blockProps = this.blockColors[block];
                    if (blockProps && blockProps.transparent) return true;
                    return false; // Solid opaque block
                };
                
                // For transparent blocks, check if adjacent is OPAQUE (only hide if can't see through)
                const shouldHideFaceTransparent = (adjacentType) => {
                    if (!adjacentType) return false; // No adjacent = show face
                    // Hide face only if adjacent block is OPAQUE (can't see through it anyway)
                    const adjProps = this.blockColors[adjacentType];
                    if (adjProps && adjProps.transparent) return false; // Adjacent is transparent = show face
                    if (this.fluidBlocks.includes(adjacentType)) return false; // Adjacent is fluid = show face
                    return true; // Adjacent is opaque = hide face
                };
                
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
                visibleTransparent.sort((a, b) => b.dist - a.dist);
                opaqueBlocks.sort((a, b) => b.dist - a.dist);
                
                // PROPER RENDERING ORDER for canvas 2D rendering:
                // Sort ALL blocks by distance (back-to-front) and draw in that order
                // This prevents transparent blocks from rendering through walls incorrectly
                const allBlocks = [...opaqueBlocks, ...visibleTransparent];
                
                // ═══════════════════════════════════════════════════════════
                // RENDERING ALGORITHM SELECTION
                // ═══════════════════════════════════════════════════════════
                // Three algorithms available: painter, zbuffer, bsp
                const algorithm = this.debugSettings.renderAlgorithm;
                
                if (algorithm === 'painter') {
                    // ═══════════════════════════════════════════════════════════
                    // PAINTER'S ALGORITHM (Classic)
                    // ═══════════════════════════════════════════════════════════
                    // Sort blocks by distance, then sort faces within each block
                    // Simple and effective for most voxel scenes
                    
                    // INDUSTRY-STANDARD STABLE SORT to prevent Z-fighting
                    allBlocks.sort((a, b) => {
                        const distDiff = b.dist - a.dist;
                        
                        // Primary sort by distance
                        if (Math.abs(distDiff) > 0.001) {
                            return distDiff;
                        }
                        
                        // Multi-level tiebreaking for stability
                        if (a.y !== b.y) return a.y - b.y;
                        if (a.z !== b.z) return a.z - b.z;
                        if (a.x !== b.x) return a.x - b.x;
                        return a.type.localeCompare(b.type);
                    });
                    
                } else if (algorithm === 'zbuffer') {
                    // ═══════════════════════════════════════════════════════════
                    // Z-BUFFER SIMULATION (Enhanced Precision)
                    // ═══════════════════════════════════════════════════════════
                    // Simulates Z-buffer by sorting with higher precision
                    // Uses block corners for more accurate depth calculation
                    
                    // Calculate min depth for each block (closest corner to camera)
                    allBlocks.forEach(block => {
                        const { x, y, z } = block;
                        
                        // Check all 8 corners of the block
                        const corners = [
                            [x, y, z], [x+1, y, z], [x, y+1, z], [x+1, y+1, z],
                            [x, y, z+1], [x+1, y, z+1], [x, y+1, z+1], [x+1, y+1, z+1]
                        ];
                        
                        let minDist = Infinity;
                        for (const [cx, cy, cz] of corners) {
                            const dx = cx - camX;
                            const dy = cy - camY;
                            const dz = cz - camZ;
                            const dist = dx * dx + dy * dy + dz * dz;
                            if (dist < minDist) minDist = dist;
                        }
                        
                        block.minDist = minDist;
                    });
                    
                    // Sort by closest point (simulates per-pixel depth testing)
                    allBlocks.sort((a, b) => {
                        const distDiff = (b.minDist || b.dist) - (a.minDist || a.dist);
                        
                        // Higher precision threshold for Z-buffer
                        if (Math.abs(distDiff) > 0.0001) {
                            return distDiff;
                        }
                        
                        // Tiebreaking
                        if (a.y !== b.y) return a.y - b.y;
                        if (a.z !== b.z) return a.z - b.z;
                        if (a.x !== b.x) return a.x - b.x;
                        return a.type.localeCompare(b.type);
                    });
                    
                } else if (algorithm === 'bsp') {
                    // ═══════════════════════════════════════════════════════════
                    // BINARY SPACE PARTITIONING (Spatial Tree)
                    // ═══════════════════════════════════════════════════════════
                    // Uses spatial tree structure for optimal rendering order
                    // Automatically handles arbitrary camera positions
                    
                    // Build simple BSP tree using axis-aligned planes
                    const buildBSPTree = (blocks: any[]): any => {
                        if (blocks.length === 0) return null;
                        if (blocks.length === 1) return { block: blocks[0], front: null, back: null };
                        
                        // Find median along longest axis
                        const minX = Math.min(...blocks.map(b => b.x));
                        const maxX = Math.max(...blocks.map(b => b.x));
                        const minY = Math.min(...blocks.map(b => b.y));
                        const maxY = Math.max(...blocks.map(b => b.y));
                        const minZ = Math.min(...blocks.map(b => b.z));
                        const maxZ = Math.max(...blocks.map(b => b.z));
                        
                        const rangeX = maxX - minX;
                        const rangeY = maxY - minY;
                        const rangeZ = maxZ - minZ;
                        
                        // Split along longest axis
                        let axis: 'x' | 'y' | 'z';
                        if (rangeX >= rangeY && rangeX >= rangeZ) axis = 'x';
                        else if (rangeY >= rangeZ) axis = 'y';
                        else axis = 'z';
                        
                        // Sort and split
                        blocks.sort((a, b) => a[axis] - b[axis]);
                        const mid = Math.floor(blocks.length / 2);
                        const pivot = blocks[mid];
                        
                        const front = blocks.filter((b, i) => i < mid);
                        const back = blocks.filter((b, i) => i > mid);
                        
                        return {
                            block: pivot,
                            axis,
                            value: pivot[axis],
                            front: buildBSPTree(front),
                            back: buildBSPTree(back)
                        };
                    };
                    
                    // Traverse BSP tree based on camera position
                    const traverseBSP = (node: any, result: any[]): void => {
                        if (!node) return;
                        
                        if (!node.axis) {
                            // Leaf node
                            result.push(node.block);
                            return;
                        }
                        
                        // Determine which side of splitting plane camera is on
                        const camPos = node.axis === 'x' ? camX : (node.axis === 'y' ? camY : camZ);
                        const isInFront = camPos < node.value;
                        
                        if (isInFront) {
                            // Camera in front: render back first, then front
                            traverseBSP(node.back, result);
                            result.push(node.block);
                            traverseBSP(node.front, result);
                        } else {
                            // Camera in back: render front first, then back
                            traverseBSP(node.front, result);
                            result.push(node.block);
                            traverseBSP(node.back, result);
                        }
                    };
                    
                    // Build and traverse tree
                    const bspTree = buildBSPTree(allBlocks.slice());
                    const sortedBlocks: any[] = [];
                    traverseBSP(bspTree, sortedBlocks);
                    
                    // Replace allBlocks with BSP-sorted order
                    allBlocks.length = 0;
                    allBlocks.push(...sortedBlocks);
                }
                // ═══════════════════════════════════════════════════════════
                // END ALGORITHM SELECTION
                // ═══════════════════════════════════════════════════════════
                
                for (let i = 0; i < allBlocks.length; i++) {
                    const block = allBlocks[i];
                    const { x, y, z, type } = block;
                    const colors = this.blockColors[type];
                    if (!colors) continue;
                    
                    // CRITICAL: Disable stroking entirely for block faces
                    // This prevents any accidental edge rendering
                    ctx.lineWidth = 0;
                    ctx.strokeStyle = 'transparent';
                    
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
                    
                    // Check if this block has a custom model (smaller than full block)
                    const hasCustomModel = this.blockModels && this.blockModels[type];
                    
                    // DEBUG: Disable face culling - show all faces
                    if (this.debugSettings.disableFaceCulling) {
                        hasTop = hasBottom = hasFront = hasBack = hasLeft = hasRight = true;
                    } else if (hasCustomModel) {
                        // Custom model blocks (furniture, containers) - ALWAYS show all faces
                        // They don't fill the full block space so faces should never be culled
                        hasTop = hasBottom = hasFront = hasBack = hasLeft = hasRight = true;
                    } else if (isFluid) {
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
                        // Solid blocks: check if block has transparency
                        const blockIsTransparent = this.blockColors[type] && this.blockColors[type].transparent;
                        // Check if this is a leaf in fancy mode (show internal faces but stay opaque)
                        const isLeafType = type === 'leaves' || type === 'appleLeaves' || type === 'cherryLeaves';
                        const leafFancyMode = isLeafType && (this.settings.treeStyle === 'transparent' || this.settings.treeStyle === 'bushy');
                        
                        if (blockIsTransparent) {
                            // Actually transparent blocks (water, glass) - only hide if adjacent is OPAQUE
                            hasTop = !shouldHideFaceTransparent(adjTop);
                            hasBottom = !shouldHideFaceTransparent(adjBottom);
                            hasFront = !shouldHideFaceTransparent(adjFront);
                            hasBack = !shouldHideFaceTransparent(adjBack);
                            hasLeft = !shouldHideFaceTransparent(adjLeft);
                            hasRight = !shouldHideFaceTransparent(adjRight);
                        } else if (leafFancyMode) {
                            // Fancy leaves: show face unless adjacent is an OPAQUE non-leaf block
                            // This renders internal leaf faces for depth, like Minecraft fancy mode
                            const shouldShowFancyLeafFace = (adjType) => {
                                if (!adjType) return true; // Air = show
                                // Hide only if adjacent to opaque non-leaf solid
                                const adjIsLeaf = adjType === 'leaves' || adjType === 'appleLeaves' || adjType === 'cherryLeaves';
                                if (adjIsLeaf) return true; // Adjacent leaf = show face for depth
                                const adjProps = this.blockColors[adjType];
                                if (adjProps && adjProps.transparent) return true; // Transparent = show
                                if (this.fluidBlocks.includes(adjType)) return true; // Fluid = show
                                return false; // Opaque solid = hide
                            };
                            hasTop = shouldShowFancyLeafFace(adjTop);
                            hasBottom = shouldShowFancyLeafFace(adjBottom);
                            hasFront = shouldShowFancyLeafFace(adjFront);
                            hasBack = shouldShowFancyLeafFace(adjBack);
                            hasLeft = shouldShowFancyLeafFace(adjLeft);
                            hasRight = shouldShowFancyLeafFace(adjRight);
                        } else {
                            // Opaque solid blocks: show face if adjacent is empty OR transparent
                            hasTop = isTransparent(adjTop);
                            hasBottom = isTransparent(adjBottom);
                            hasFront = isTransparent(adjFront);
                            hasBack = isTransparent(adjBack);
                            hasLeft = isTransparent(adjLeft);
                            hasRight = isTransparent(adjRight);
                        }
                    }
                    
                    // Skip fully hidden blocks
                    if (!hasTop && !hasBottom && !hasFront && !hasBack && !hasLeft && !hasRight) continue;
                    
                    // Check if this is a leaf block for special rendering
                    const isLeafBlock = type === 'leaves' || type === 'appleLeaves' || type === 'cherryLeaves';
                    const treeStyle = this.settings.treeStyle;
                    
                    // Fancy leaves are OPAQUE but show internal faces (like Minecraft)
                    const leafFancyMode = isLeafBlock && (treeStyle === 'transparent' || treeStyle === 'bushy');
                    
                    // Get block model (custom dimensions for non-cube blocks)
                    const model = this.blockModels[type];
                    // Model format: [offsetX, offsetY, offsetZ, scaleX, scaleY, scaleZ]
                    const ox = model ? model[0] : 0;
                    const oy = model ? model[1] : 0;
                    const oz = model ? model[2] : 0;
                    const sx = model ? model[3] : 1;
                    const sy = model ? model[4] : 1;
                    const sz = model ? model[5] : 1;
                    
                    // Calculate block bounds with model
                    const x0 = x + ox;
                    const y0 = y + oy;
                    const z0 = z + oz;
                    const x1 = x + ox + sx;
                    const y1 = y + oy + sy;
                    const z1 = z + oz + sz;
                    
                    // Define visible faces
                    const faces = [];
                    
                    // For transparent blocks (NOT fancy leaves), use uniform shading
                    const isActuallyTransparent = colors && colors.transparent;
                    const uniformDark = 0.95;
                    const frontDark = isActuallyTransparent ? uniformDark : 0.95;
                    const backDark = isActuallyTransparent ? uniformDark : 0.75;
                    const topDark = 1.0;
                    const bottomDark = isActuallyTransparent ? uniformDark : 0.6;
                    const leftDark = isActuallyTransparent ? uniformDark : 0.85;
                    const rightDark = isActuallyTransparent ? uniformDark : 0.9;
                    
                    // Use normal face colors (fancy leaves stay opaque with normal shading)
                    const sideColor = colors.side;
                    const topColor = colors.top;
                    const bottomColor = colors.bottom;
                    
                    // Wind animation for bushy leaves
                    let windOffsetX = 0, windOffsetZ = 0, windOffsetY = 0;
                    if (isLeafBlock && treeStyle === 'bushy') {
                        const windTime = Date.now() * 0.001;
                        // Multi-frequency wind for natural movement
                        const windSpeed1 = Math.sin(windTime * 1.5 + x * 0.3 + z * 0.5) * 0.08;
                        const windSpeed2 = Math.sin(windTime * 2.3 + x * 0.7 - z * 0.2) * 0.05;
                        const windSpeed3 = Math.cos(windTime * 1.8 - x * 0.4 + z * 0.6) * 0.03;
                        windOffsetX = windSpeed1 + windSpeed2;
                        windOffsetZ = windSpeed2 + windSpeed3;
                        windOffsetY = Math.abs(windSpeed1) * 0.3; // Slight vertical bob
                    }
                    
                    // Apply wind offset to vertex positions for leaves
                    const applyWind = (vx, vy, vz) => {
                        if (!isLeafBlock || treeStyle !== 'bushy') return [vx, vy, vz];
                        // Only move top vertices for rustling effect
                        const isTopVertex = vy > y + 0.5;
                        if (isTopVertex) {
                            return [vx + windOffsetX, vy + windOffsetY, vz + windOffsetZ];
                        }
                        return [vx, vy, vz];
                    };
                    
                    // Apply model to topY (for leaves with reduced height)
                    const modelTopY = model ? y1 : topY;
                    const modelBottomY = model ? y0 : y;
                    
                    // Front face (+Z) - use model bounds
                    if (hasFront) {
                        const v = [[x0, modelBottomY, z1], [x1, modelBottomY, z1], [x1, modelTopY, z1], [x0, modelTopY, z1]].map(([vx, vy, vz]) => applyWind(vx, vy, vz));
                        faces.push({ v, color: sideColor, dark: frontDark, isTop: false, isLeaf: isLeafBlock });
                    }
                    // Back face (-Z)
                    if (hasBack) {
                        const v = [[x1, modelBottomY, z0], [x0, modelBottomY, z0], [x0, modelTopY, z0], [x1, modelTopY, z0]].map(([vx, vy, vz]) => applyWind(vx, vy, vz));
                        faces.push({ v, color: sideColor, dark: backDark, isTop: false, isLeaf: isLeafBlock });
                    }
                    // Top face (+Y)
                    if (hasTop) {
                        const v = [[x0, modelTopY, z0], [x1, modelTopY, z0], [x1, modelTopY, z1], [x0, modelTopY, z1]].map(([vx, vy, vz]) => applyWind(vx, vy, vz));
                        faces.push({ v, color: topColor, dark: topDark, isTop: true, isLeaf: isLeafBlock });
                    }
                    // Bottom face (-Y)
                    if (hasBottom) {
                        const v = [[x0, modelBottomY, z1], [x1, modelBottomY, z1], [x1, modelBottomY, z0], [x0, modelBottomY, z0]].map(([vx, vy, vz]) => applyWind(vx, vy, vz));
                        faces.push({ v, color: bottomColor, dark: bottomDark, isTop: false, isLeaf: isLeafBlock });
                    }
                    // Left face (-X)
                    if (hasLeft) {
                        const v = [[x0, modelBottomY, z0], [x0, modelBottomY, z1], [x0, modelTopY, z1], [x0, modelTopY, z0]].map(([vx, vy, vz]) => applyWind(vx, vy, vz));
                        faces.push({ v, color: sideColor, dark: leftDark, isTop: false, isLeaf: isLeafBlock });
                    }
                    // Right face (+X)
                    if (hasRight) {
                        const v = [[x1, modelBottomY, z1], [x1, modelBottomY, z0], [x1, modelTopY, z0], [x1, modelTopY, z1]].map(([vx, vy, vz]) => applyWind(vx, vy, vz));
                        faces.push({ v, color: sideColor, dark: rightDark, isTop: false, isLeaf: isLeafBlock });
                    }
                    
                    // Render visible faces
                    // CRITICAL: Sort faces by distance from camera (back-to-front)
                    // This ensures correct rendering from ANY viewing angle
                    const facesWithDist = faces.map(face => {
                        // Calculate center of face
                        const centerX = (face.v[0][0] + face.v[1][0] + face.v[2][0] + face.v[3][0]) / 4;
                        const centerY = (face.v[0][1] + face.v[1][1] + face.v[2][1] + face.v[3][1]) / 4;
                        const centerZ = (face.v[0][2] + face.v[1][2] + face.v[2][2] + face.v[3][2]) / 4;
                        
                        // Distance from camera to face center
                        const dx = centerX - camX;
                        const dy = centerY - camY;
                        const dz = centerZ - camZ;
                        const distSq = dx * dx + dy * dy + dz * dz;
                        
                        return { face, distSq };
                    });
                    
                    // Sort far to near (painter's algorithm)
                    facesWithDist.sort((a, b) => b.distSq - a.distSq);
                    
                    for (let f = 0; f < facesWithDist.length; f++) {
                        const { face } = facesWithDist[f];
                        const pts = [];
                        let clampedCount = 0;
                        
                        for (let v = 0; v < 4; v++) {
                            const p = project(face.v[v][0], face.v[v][1], face.v[v][2]);
                            pts.push(p);
                            if (p.clamped) clampedCount++;
                        }
                        
                        // CRITICAL FIX: If ALL vertices are clamped (face entirely behind camera), skip it
                        // This prevents screen-filling polygons when looking up/down
                        if (clampedCount >= 4) continue;
                        
                        // Track if any vertices were clamped (for debug visualization)
                        const hasClampedVertex = clampedCount > 0;
                        
                        if (pts.length !== 4) continue;
                        
                        // Apply shadow and get base color
                        let fillColor = face.color;
                        if (this.settings.shadows && face.dark < 1) {
                            fillColor = this.darkenColor(face.color, face.dark);
                        }
                        
                        // Apply transparency to fancy leaves
                        if (face.isLeaf && (this.settings.treeStyle === 'transparent' || this.settings.treeStyle === 'bushy')) {
                            // darkenColor returns rgb(r,g,b) format, convert to rgba
                            if (fillColor.startsWith('rgb(')) {
                                fillColor = fillColor.replace('rgb(', 'rgba(').replace(')', ', 0.75)');
                            } else if (fillColor.startsWith('#')) {
                                const r = parseInt(fillColor.slice(1, 3), 16);
                                const g = parseInt(fillColor.slice(3, 5), 16);
                                const b = parseInt(fillColor.slice(5, 7), 16);
                                fillColor = `rgba(${r}, ${g}, ${b}, 0.75)`;
                            }
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
                        
                        // TEXTURE RENDERING with proper blend modes to avoid over-darkening
                        // Determine which face type this is for texture selection
                        const faceType = face.isTop ? 'top' : 'side';
                        
                        // Check if this block uses textures
                        if (colors.useTexture && colors.texture && !isFluid) {
                            // Apply shadow darkening to the base color BEFORE filling
                            let baseFillColor = fillColor;
                            if (this.settings.shadows && face.dark < 1) {
                                // Parse and darken the base color
                                if (fillColor.startsWith('#')) {
                                    baseFillColor = this.darkenColor(fillColor, face.dark);
                                } else if (fillColor.startsWith('rgb')) {
                                    // For rgb colors, extract and darken
                                    const match = fillColor.match(/\d+/g);
                                    if (match) {
                                        const r = Math.floor(parseInt(match[0]) * face.dark);
                                        const g = Math.floor(parseInt(match[1]) * face.dark);
                                        const b = Math.floor(parseInt(match[2]) * face.dark);
                                        baseFillColor = `rgb(${r},${g},${b})`;
                                    }
                                }
                            }
                            
                            // DEBUG: Wireframe-only mode - skip fills
                            if (this.debugSettings.wireframeOnly) {
                                // Only draw wireframe
                                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.moveTo(pts[0].x, pts[0].y);
                                ctx.lineTo(pts[1].x, pts[1].y);
                                ctx.lineTo(pts[2].x, pts[2].y);
                                ctx.lineTo(pts[3].x, pts[3].y);
                                ctx.closePath();
                                ctx.stroke();
                                continue; // Skip fill rendering
                            }
                            
                            // STEP 1: Fill the polygon with darkened base color (provides solid base)
                            // Apply transparency to fancy leaves
                            if (face.isLeaf && (this.settings.treeStyle === 'transparent' || this.settings.treeStyle === 'bushy')) {
                                if (baseFillColor.startsWith('rgb(')) {
                                    baseFillColor = baseFillColor.replace('rgb(', 'rgba(').replace(')', ', 0.75)');
                                } else if (baseFillColor.startsWith('#')) {
                                    const r = parseInt(baseFillColor.slice(1, 3), 16);
                                    const g = parseInt(baseFillColor.slice(3, 5), 16);
                                    const b = parseInt(baseFillColor.slice(5, 7), 16);
                                    baseFillColor = `rgba(${r}, ${g}, ${b}, 0.75)`;
                                }
                            }
                            ctx.fillStyle = baseFillColor;
                            ctx.beginPath();
                            ctx.moveTo(pts[0].x, pts[0].y);
                            ctx.lineTo(pts[1].x, pts[1].y);
                            ctx.lineTo(pts[2].x, pts[2].y);
                            ctx.lineTo(pts[3].x, pts[3].y);
                            // REMOVED closePath() - causes visible edge artifacts on external faces
                            ctx.fill();
                            
                            // STEP 2: Generate or get cached texture pattern
                            const texture = this.generateTexture(colors.texture, baseFillColor, faceType);
                            
                            // STEP 3: Apply texture overlay with proper blending
                            ctx.save();
                            
                            // Create clipping path for this face
                            ctx.beginPath();
                            ctx.moveTo(pts[0].x, pts[0].y);
                            ctx.lineTo(pts[1].x, pts[1].y);
                            ctx.lineTo(pts[2].x, pts[2].y);
                            ctx.lineTo(pts[3].x, pts[3].y);
                            ctx.closePath();
                            ctx.clip();
                            
                            // Calculate bounding box for texture fill
                            const minX = Math.min(pts[0].x, pts[1].x, pts[2].x, pts[3].x);
                            const maxX = Math.max(pts[0].x, pts[1].x, pts[2].x, pts[3].x);
                            const minY = Math.min(pts[0].y, pts[1].y, pts[2].y, pts[3].y);
                            const maxY = Math.max(pts[0].y, pts[1].y, pts[2].y, pts[3].y);
                            
                            // Apply texture with OVERLAY blend for detail without over-darkening
                            ctx.globalCompositeOperation = 'overlay';
                            ctx.globalAlpha = 0.4; // Subtle texture overlay
                            
                            if (this.settings.textureMode === 'fixed') {
                                // TRUE FIXED MODE: Texture clipped to face and anchored to block world position
                                // This mode makes textures stay in place relative to blocks
                                ctx.save();
                                
                                // Clip to face polygon
                                ctx.beginPath();
                                ctx.moveTo(pts[0].x, pts[0].y);
                                ctx.lineTo(pts[1].x, pts[1].y);
                                ctx.lineTo(pts[2].x, pts[2].y);
                                ctx.lineTo(pts[3].x, pts[3].y);
                                ctx.closePath();
                                ctx.clip();
                                
                                // Use block world coordinates to create stable texture offset
                                const pattern = texture as CanvasPattern;
                                if (pattern && pattern.setTransform) {
                                    // Hash the block position for stable texture placement
                                    const textureSize = 32;
                                    const worldOffsetX = (block.x * textureSize * 0.5) % textureSize;
                                    const worldOffsetY = ((block.y + block.z) * textureSize * 0.5) % textureSize;
                                    const matrix = new DOMMatrix();
                                    matrix.translateSelf(worldOffsetX, worldOffsetY);
                                    pattern.setTransform(matrix);
                                }
                                
                                ctx.fillStyle = texture;
                                ctx.fillRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);
                                ctx.restore();
                            } else if (this.settings.textureMode === 'vacuum') {
                                // VACUUM MODE: Creates the cool glitchy vacuum effect
                                // Texture anchored to face center (creates stretching illusion)
                                const faceCenterX = (pts[0].x + pts[1].x + pts[2].x + pts[3].x) / 4;
                                const faceCenterY = (pts[0].y + pts[1].y + pts[2].y + pts[3].y) / 4;
                                
                                ctx.save();
                                
                                const pattern = texture as CanvasPattern;
                                if (pattern && pattern.setTransform) {
                                    const matrix = new DOMMatrix();
                                    matrix.translateSelf(faceCenterX, faceCenterY);
                                    pattern.setTransform(matrix);
                                }
                                
                                ctx.fillStyle = texture;
                                ctx.fillRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);
                                ctx.restore();
                            } else {
                                // TRIPPY MODE: Texture moves with screen (Chowder style)
                                ctx.fillStyle = texture;
                                ctx.fillRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);
                            }
                            
                            ctx.restore();
                            
                            // STEP 4: Add edge lines for depth perception (only for special cases)
                            // REMOVED: Edge lines on all faces caused "hollow block" appearance
                            // Solid blocks don't need edge lines - the texture provides depth
                        } else {
                            // Standard solid color rendering
                            ctx.fillStyle = fillColor;
                            ctx.beginPath();
                            ctx.moveTo(pts[0].x, pts[0].y);
                            ctx.lineTo(pts[1].x, pts[1].y);
                            ctx.lineTo(pts[2].x, pts[2].y);
                            ctx.lineTo(pts[3].x, pts[3].y);
                            // REMOVED closePath() - causes visible edge artifacts on external faces
                            ctx.fill();
                            
                            // REMOVED: Edge lines caused "hollow block" appearance
                            // Solid blocks look better without edge lines
                        }
                        
                        // DEBUG: Near-plane clipping visualization
                        if (this.debugSettings.showNearPlaneClipping && hasClampedVertex) {
                            ctx.strokeStyle = '#ff0000';
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(pts[0].x, pts[0].y);
                            ctx.lineTo(pts[1].x, pts[1].y);
                            ctx.lineTo(pts[2].x, pts[2].y);
                            ctx.lineTo(pts[3].x, pts[3].y);
                            ctx.closePath();
                            ctx.stroke();
                        }
                        
                        // DEBUG: Block model bounds visualization
                        if (this.debugSettings.showBlockModels && this.blockModels[type]) {
                            ctx.strokeStyle = '#00ffff';
                            ctx.lineWidth = 2;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(pts[0].x, pts[0].y);
                            ctx.lineTo(pts[1].x, pts[1].y);
                            ctx.lineTo(pts[2].x, pts[2].y);
                            ctx.lineTo(pts[3].x, pts[3].y);
                            ctx.closePath();
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }
                    }
                }
                
                // ═══════════════════════════════════════════════════════════
                // DEBUG VISUALIZATIONS (Phase 2)
                // ═══════════════════════════════════════════════════════════
                
                // 1. RAYCAST VECTOR - Show where raycast is pointing
                if (this.debugSettings.showRaycastVector) {
                    const hit = this.raycast();
                    if (hit) {
                        // Draw line from camera to hit point
                        const startProj = project(camX, camY, camZ);
                        const endProj = project(hit.hit.x + 0.5, hit.hit.y + 0.5, hit.hit.z + 0.5);
                        
                        if (startProj && endProj) {
                            ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                            ctx.lineWidth = 3;
                            ctx.setLineDash([5, 5]);
                            ctx.beginPath();
                            ctx.moveTo(startProj.x, startProj.y);
                            ctx.lineTo(endProj.x, endProj.y);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            
                            // Draw dot at hit point
                            ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
                            ctx.beginPath();
                            ctx.arc(endProj.x, endProj.y, 5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
                
                // 2. PROJECTION TEST - Show marker at screen center
                if (this.debugSettings.showProjectionTest) {
                    // Draw crosshair marker at exact screen center
                    // This is where the projection SHOULD be aiming
                    const centerX = halfW;
                    const centerY = halfH;
                    
                    // Large visible crosshair
                    ctx.strokeStyle = 'rgba(0, 255, 0, 1)';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(centerX - 20, centerY);
                    ctx.lineTo(centerX + 20, centerY);
                    ctx.moveTo(centerX, centerY - 20);
                    ctx.lineTo(centerX, centerY + 20);
                    ctx.stroke();
                    
                    // Center dot
                    ctx.fillStyle = 'rgba(0, 255, 0, 1)';
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Label
                    ctx.fillStyle = 'rgba(0, 255, 0, 1)';
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.font = 'bold 14px monospace';
                    ctx.lineWidth = 3;
                    ctx.strokeText('SCREEN CENTER', centerX + 25, centerY - 15);
                    ctx.fillText('SCREEN CENTER', centerX + 25, centerY - 15);
                }
                
                // 3. DEPTH ORDER - Show render order numbers
                if (this.debugSettings.showDepthOrder) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
                    ctx.font = 'bold 14px monospace';
                    ctx.lineWidth = 3;
                    
                    for (let i = 0; i < Math.min(allBlocks.length, 50); i++) {
                        const block = allBlocks[i];
                        const centerProj = project(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                        if (centerProj) {
                            const text = `#${i}`;
                            ctx.strokeText(text, centerProj.x - 15, centerProj.y + 5);
                            ctx.fillText(text, centerProj.x - 15, centerProj.y + 5);
                        }
                    }
                }
                
                // 4. FACE NORMALS - Show normal vectors
                if (this.debugSettings.showFaceNormals) {
                    ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
                    ctx.lineWidth = 2;
                    
                    for (let i = 0; i < Math.min(allBlocks.length, 20); i++) {
                        const block = allBlocks[i];
                        const { x, y, z } = block;
                        
                        // Draw normals for each visible face
                        const normals = [
                            { center: [x + 0.5, y + 1, z + 0.5], dir: [0, 1, 0], name: 'Top' },
                            { center: [x + 0.5, y, z + 0.5], dir: [0, -1, 0], name: 'Bottom' },
                            { center: [x + 0.5, y + 0.5, z + 1], dir: [0, 0, 1], name: 'Front' },
                            { center: [x + 0.5, y + 0.5, z], dir: [0, 0, -1], name: 'Back' },
                            { center: [x, y + 0.5, z + 0.5], dir: [-1, 0, 0], name: 'Left' },
                            { center: [x + 1, y + 0.5, z + 0.5], dir: [1, 0, 0], name: 'Right' }
                        ];
                        
                        for (const normal of normals) {
                            const startProj = project(normal.center[0], normal.center[1], normal.center[2]);
                            const endProj = project(
                                normal.center[0] + normal.dir[0] * 0.5,
                                normal.center[1] + normal.dir[1] * 0.5,
                                normal.center[2] + normal.dir[2] * 0.5
                            );
                            
                            if (startProj && endProj) {
                                ctx.beginPath();
                                ctx.moveTo(startProj.x, startProj.y);
                                ctx.lineTo(endProj.x, endProj.y);
                                ctx.stroke();
                                
                                // Arrow head
                                const angle = Math.atan2(endProj.y - startProj.y, endProj.x - startProj.x);
                                ctx.beginPath();
                                ctx.moveTo(endProj.x, endProj.y);
                                ctx.lineTo(
                                    endProj.x - 8 * Math.cos(angle - Math.PI / 6),
                                    endProj.y - 8 * Math.sin(angle - Math.PI / 6)
                                );
                                ctx.lineTo(
                                    endProj.x - 8 * Math.cos(angle + Math.PI / 6),
                                    endProj.y - 8 * Math.sin(angle + Math.PI / 6)
                                );
                                ctx.lineTo(endProj.x, endProj.y);
                                ctx.fill();
                            }
                        }
                    }
                }
                
                // 5. BOUNDING BOXES - Show block bounds
                if (this.debugSettings.showBoundingBoxes) {
                    ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
                    ctx.lineWidth = 1;
                    
                    for (let i = 0; i < Math.min(allBlocks.length, 30); i++) {
                        const block = allBlocks[i];
                        const { x, y, z } = block;
                        
                        // Define 8 corners
                        const corners = [
                            [x, y, z], [x+1, y, z], [x+1, y+1, z], [x, y+1, z],
                            [x, y, z+1], [x+1, y, z+1], [x+1, y+1, z+1], [x, y+1, z+1]
                        ];
                        
                        const projected = corners.map(c => project(c[0], c[1], c[2])).filter(p => p !== null);
                        
                        if (projected.length === 8) {
                            // Draw box edges
                            const edges = [
                                [0,1], [1,2], [2,3], [3,0], // Back face
                                [4,5], [5,6], [6,7], [7,4], // Front face
                                [0,4], [1,5], [2,6], [3,7]  // Connecting edges
                            ];
                            
                            ctx.beginPath();
                            for (const [a, b] of edges) {
                                ctx.moveTo(projected[a].x, projected[a].y);
                                ctx.lineTo(projected[b].x, projected[b].y);
                            }
                            ctx.stroke();
                        }
                    }
                }
                
                // 6. OVERDRAW HEATMAP - Track pixel draw counts
                if (this.debugSettings.showOverdraw) {
                    // This is complex - for now show a simple indicator
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
                    ctx.font = 'bold 16px monospace';
                    ctx.lineWidth = 3;
                    const text = `OVERDRAW: ${allBlocks.length} blocks rendered`;
                    ctx.strokeText(text, 10, 100);
                    ctx.fillText(text, 10, 100);
                }
                
                // 7. TARGET INFO - Diagnostic for raycast vs render discrepancies
                if (this.debugSettings.showTargetInfo) {
                    const hit = this.raycast();
                    const infoX = 10;
                    let infoY = 130;
                    const lineHeight = 18;
                    
                    ctx.font = 'bold 14px monospace';
                    ctx.lineWidth = 3;
                    
                    // Background panel
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                    ctx.fillRect(5, 115, 650, hit ? 850 : 60);
                    
                    // Title
                    ctx.fillStyle = '#ff69b4';
                    ctx.fillText('=== TARGET DIAGNOSTIC ===', infoX, infoY);
                    infoY += lineHeight + 5;
                    
                    if (hit && hit.hit) {
                        const hx = hit.hit.x;
                        const hy = hit.hit.y;
                        const hz = hit.hit.z;
                        const worldKey = `${hx},${hy},${hz}`;
                        const worldBlock = this.world[worldKey];
                        
                        // Camera position for debugging
                        ctx.fillStyle = '#fff';
                        ctx.fillText(`Camera: (${camX.toFixed(1)}, ${camY.toFixed(1)}, ${camZ.toFixed(1)})`, infoX, infoY);
                        infoY += lineHeight;
                        
                        // First voxel (where DDA starts)
                        const startVoxelX = Math.floor(camX);
                        const startVoxelY = Math.floor(camY);
                        const startVoxelZ = Math.floor(camZ);
                        const startVoxelBlock = this.world[`${startVoxelX},${startVoxelY},${startVoxelZ}`];
                        ctx.fillStyle = startVoxelBlock ? '#f55' : '#0f0';
                        ctx.fillText(`Start Voxel: (${startVoxelX}, ${startVoxelY}, ${startVoxelZ}) = ${startVoxelBlock || 'air'}`, infoX, infoY);
                        infoY += lineHeight;
                        
                        // Raycast hit position
                        ctx.fillStyle = '#0ff';
                        ctx.fillText(`Raycast Hit: (${hx}, ${hy}, ${hz})${hit.hitT ? ` at t=${hit.hitT.toFixed(2)}` : ''}`, infoX, infoY);
                        infoY += lineHeight;
                        
                        // What raycast reports
                        ctx.fillStyle = '#ff0';
                        ctx.fillText(`Raycast Block: "${hit.block || 'null'}"`, infoX, infoY);
                        infoY += lineHeight;
                        
                        // PLACEMENT INFO - Show where block would be placed
                        ctx.fillStyle = '#f0f';
                        ctx.fillText('=== PLACEMENT INFO ===', infoX, infoY);
                        infoY += lineHeight;
                        
                        if (hit.place) {
                            ctx.fillStyle = '#0ff';
                            ctx.fillText(`Place Position: (${hit.place.x}, ${hit.place.y}, ${hit.place.z})`, infoX, infoY);
                            infoY += lineHeight;
                            
                            // Calculate which face was hit based on place vs hit difference
                            const faceDiffX = hit.place.x - hx;
                            const faceDiffY = hit.place.y - hy;
                            const faceDiffZ = hit.place.z - hz;
                            
                            let faceName = 'Unknown';
                            if (faceDiffX === 1) faceName = '+X (Right)';
                            else if (faceDiffX === -1) faceName = '-X (Left)';
                            else if (faceDiffY === 1) faceName = '+Y (Top)';
                            else if (faceDiffY === -1) faceName = '-Y (Bottom)';
                            else if (faceDiffZ === 1) faceName = '+Z (Front)';
                            else if (faceDiffZ === -1) faceName = '-Z (Back)';
                            
                            ctx.fillStyle = '#ff0';
                            ctx.fillText(`Entry Face: ${faceName} (diff: ${faceDiffX},${faceDiffY},${faceDiffZ})`, infoX, infoY);
                            infoY += lineHeight;
                            
                            // Show raw face detection data
                            if (hit.enteredFace) {
                                ctx.fillStyle = '#aaa';
                                ctx.fillText(`enteredFace: (${hit.enteredFace.x}, ${hit.enteredFace.y}, ${hit.enteredFace.z})`, infoX, infoY);
                                infoY += lineHeight;
                            }
                            if (hit.lastSolidFace) {
                                ctx.fillText(`lastSolidFace: (${hit.lastSolidFace.x}, ${hit.lastSolidFace.y}, ${hit.lastSolidFace.z})`, infoX, infoY);
                                infoY += lineHeight;
                            }
                            if (hit.rawEnteredFace) {
                                ctx.fillText(`rawEnteredFace: (${hit.rawEnteredFace.x}, ${hit.rawEnteredFace.y}, ${hit.rawEnteredFace.z})`, infoX, infoY);
                                infoY += lineHeight;
                            }
                            if (hit.debugTMax) {
                                ctx.fillText(`tMax at hit: X=${hit.debugTMax.x.toFixed(2)} Y=${hit.debugTMax.y.toFixed(2)} Z=${hit.debugTMax.z.toFixed(2)}`, infoX, infoY);
                                infoY += lineHeight;
                            }
                            if (hit.debugStep) {
                                ctx.fillText(`Step dirs: X=${hit.debugStep.x} Y=${hit.debugStep.y} Z=${hit.debugStep.z}`, infoX, infoY);
                                infoY += lineHeight;
                            }
                            
                            // Show placement preview - draw wireframe at place position
                            const placeCorners = [
                                [hit.place.x, hit.place.y, hit.place.z],
                                [hit.place.x + 1, hit.place.y, hit.place.z],
                                [hit.place.x + 1, hit.place.y + 1, hit.place.z],
                                [hit.place.x, hit.place.y + 1, hit.place.z],
                                [hit.place.x, hit.place.y, hit.place.z + 1],
                                [hit.place.x + 1, hit.place.y, hit.place.z + 1],
                                [hit.place.x + 1, hit.place.y + 1, hit.place.z + 1],
                                [hit.place.x, hit.place.y + 1, hit.place.z + 1]
                            ];
                            const placeProjected = placeCorners.map(c => project(c[0], c[1], c[2]));
                            
                            if (placeProjected.every(p => p !== null)) {
                                // Draw green wireframe where block would be placed
                                ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([5, 5]);
                                const edges = [
                                    [0,1], [1,2], [2,3], [3,0],
                                    [4,5], [5,6], [6,7], [7,4],
                                    [0,4], [1,5], [2,6], [3,7]
                                ];
                                ctx.beginPath();
                                for (const [a, b] of edges) {
                                    ctx.moveTo(placeProjected[a].x, placeProjected[a].y);
                                    ctx.lineTo(placeProjected[b].x, placeProjected[b].y);
                                }
                                ctx.stroke();
                                ctx.setLineDash([]);
                                
                                // Label the placement preview
                                const placeCenterProj = project(hit.place.x + 0.5, hit.place.y + 0.5, hit.place.z + 0.5);
                                if (placeCenterProj) {
                                    ctx.fillStyle = '#0f0';
                                    ctx.font = 'bold 12px monospace';
                                    ctx.fillText('PLACE', placeCenterProj.x + 15, placeCenterProj.y);
                                    ctx.font = 'bold 14px monospace';
                                }
                            }
                        } else {
                            ctx.fillStyle = '#f55';
                            ctx.fillText('Place Position: null (no entry face)', infoX, infoY);
                            infoY += lineHeight;
                        }
                        
                        ctx.fillStyle = '#f0f';
                        ctx.fillText('======================', infoX, infoY);
                        infoY += lineHeight;
                        
                        // What world data contains
                        ctx.fillStyle = worldBlock ? '#0f0' : '#f55';
                        ctx.fillText(`World Data: "${worldBlock || 'EMPTY'}"`, infoX, infoY);
                        infoY += lineHeight;
                        
                        // Check if block is in render list
                        const inRenderList = allBlocks.some(b => b.x === hx && b.y === hy && b.z === hz);
                        ctx.fillStyle = inRenderList ? '#0f0' : '#f55';
                        ctx.fillText(`In Render List: ${inRenderList ? 'YES' : 'NO'}`, infoX, infoY);
                        infoY += lineHeight;
                        
                        // Distance check
                        const dx = hx + 0.5 - camX;
                        const dy = hy + 0.5 - camY;
                        const dz = hz + 0.5 - camZ;
                        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        const renderDist = Math.sqrt(renderDistSq);
                        ctx.fillStyle = dist <= renderDist ? '#0f0' : '#f55';
                        ctx.fillText(`Distance: ${dist.toFixed(1)} (max: ${renderDist.toFixed(0)})`, infoX, infoY);
                        infoY += lineHeight;
                        
                        // Frustum check (behind camera)
                        const camDirXCheck = -Math.sin(this.camera.rotY);
                        const camDirZCheck = Math.cos(this.camera.rotY);
                        const dot = dx * camDirXCheck + dz * camDirZCheck;
                        const behindCamera = dot < -3 && (dist * dist) > 16;
                        ctx.fillStyle = behindCamera ? '#f55' : '#0f0';
                        ctx.fillText(`Frustum: ${behindCamera ? 'CULLED (behind cam)' : 'VISIBLE'}`, infoX, infoY);
                        infoY += lineHeight;
                        
                        // FACE CULLING ANALYSIS - Check which faces would render
                        if (worldBlock) {
                            const adjTop = getBlock(hx, hy + 1, hz);
                            const adjBottom = getBlock(hx, hy - 1, hz);
                            const adjFront = getBlock(hx, hy, hz + 1);
                            const adjBack = getBlock(hx, hy, hz - 1);
                            const adjLeft = getBlock(hx - 1, hy, hz);
                            const adjRight = getBlock(hx + 1, hy, hz);
                            
                            const isCurrentTransparent = this.blockColors[worldBlock] && this.blockColors[worldBlock].transparent;
                            const isFluid = this.fluidBlocks.includes(worldBlock);
                            
                            let hasTop, hasBottom, hasFront, hasBack, hasLeft, hasRight;
                            
                            if (isFluid) {
                                hasTop = !adjTop || adjTop !== worldBlock;
                                hasBottom = !adjBottom || !this.fluidBlocks.includes(adjBottom);
                                hasFront = !adjFront || adjFront !== worldBlock;
                                hasBack = !adjBack || adjBack !== worldBlock;
                                hasLeft = !adjLeft || adjLeft !== worldBlock;
                                hasRight = !adjRight || adjRight !== worldBlock;
                            } else if (isCurrentTransparent) {
                                hasTop = adjTop !== worldBlock;
                                hasBottom = adjBottom !== worldBlock;
                                hasFront = adjFront !== worldBlock;
                                hasBack = adjBack !== worldBlock;
                                hasLeft = adjLeft !== worldBlock;
                                hasRight = adjRight !== worldBlock;
                            } else {
                                const isTransparentBlock = (block) => {
                                    if (!block) return true;
                                    if (this.fluidBlocks.includes(block)) return true;
                                    const props = this.blockColors[block];
                                    return props && props.transparent;
                                };
                                hasTop = isTransparentBlock(adjTop);
                                hasBottom = isTransparentBlock(adjBottom);
                                hasFront = isTransparentBlock(adjFront);
                                hasBack = isTransparentBlock(adjBack);
                                hasLeft = isTransparentBlock(adjLeft);
                                hasRight = isTransparentBlock(adjRight);
                            }
                            
                            const visibleFaces = [hasTop, hasBottom, hasFront, hasBack, hasLeft, hasRight].filter(Boolean).length;
                            ctx.fillStyle = visibleFaces > 0 ? '#0f0' : '#f55';
                            ctx.fillText(`Visible Faces: ${visibleFaces}/6`, infoX, infoY);
                            infoY += lineHeight;
                            
                            // Show face details
                            const faceStr = [
                                hasTop ? 'T' : '-',
                                hasBottom ? 'B' : '-', 
                                hasFront ? 'F' : '-',
                                hasBack ? 'K' : '-',
                                hasLeft ? 'L' : '-',
                                hasRight ? 'R' : '-'
                            ].join(' ');
                            ctx.fillStyle = '#888';
                            ctx.fillText(`Faces [T B F K L R]: ${faceStr}`, infoX, infoY);
                            infoY += lineHeight;
                            
                            // Show adjacent blocks  
                            ctx.font = '12px monospace';
                            ctx.fillText(`Adj: T:${adjTop||'air'} B:${adjBottom||'air'} F:${adjFront||'air'}`, infoX, infoY);
                            infoY += 14;
                            ctx.fillText(`     K:${adjBack||'air'} L:${adjLeft||'air'} R:${adjRight||'air'}`, infoX, infoY);
                            infoY += lineHeight;
                            ctx.font = 'bold 14px monospace';
                            
                            if (visibleFaces === 0) {
                                ctx.fillStyle = '#f00';
                                ctx.fillText('⚠ ALL FACES CULLED - block invisible!', infoX, infoY);
                                infoY += lineHeight;
                            }
                            
                            // PROJECT CENTER - Show where block center projects to screen
                            const blockCenterProj = project(hx + 0.5, hy + 0.5, hz + 0.5);
                            if (blockCenterProj) {
                                // Draw a cyan circle where the block center SHOULD appear
                                ctx.strokeStyle = '#0ff';
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.arc(blockCenterProj.x, blockCenterProj.y, 15, 0, Math.PI * 2);
                                ctx.stroke();
                                
                                // Draw crosshair at projected center
                                ctx.beginPath();
                                ctx.moveTo(blockCenterProj.x - 20, blockCenterProj.y);
                                ctx.lineTo(blockCenterProj.x + 20, blockCenterProj.y);
                                ctx.moveTo(blockCenterProj.x, blockCenterProj.y - 20);
                                ctx.lineTo(blockCenterProj.x, blockCenterProj.y + 20);
                                ctx.stroke();
                                
                                // Label
                                ctx.fillStyle = '#0ff';
                                ctx.font = 'bold 12px monospace';
                                ctx.fillText('PROJECTED', blockCenterProj.x + 20, blockCenterProj.y - 5);
                                ctx.fillText(`Z=${blockCenterProj.z.toFixed(2)}`, blockCenterProj.x + 20, blockCenterProj.y + 10);
                                ctx.font = 'bold 14px monospace';
                                
                                // Show projection coordinates in panel
                                ctx.fillStyle = '#0ff';
                                ctx.fillText(`Proj Center: (${blockCenterProj.x.toFixed(0)}, ${blockCenterProj.y.toFixed(0)}) z=${blockCenterProj.z.toFixed(2)}`, infoX, infoY);
                                infoY += lineHeight;
                            } else {
                                ctx.fillStyle = '#f55';
                                ctx.fillText('⚠ Block center fails projection (z <= 0.1)!', infoX, infoY);
                                infoY += lineHeight;
                            }
                            
                            // Check if any corner projects successfully
                            const corners = [
                                [hx, hy, hz], [hx+1, hy, hz], [hx, hy+1, hz], [hx, hy, hz+1],
                                [hx+1, hy+1, hz], [hx+1, hy, hz+1], [hx, hy+1, hz+1], [hx+1, hy+1, hz+1]
                            ];
                            const projectedCorners = corners.map(c => project(c[0], c[1], c[2]));
                            const validCorners = projectedCorners.filter(p => p !== null).length;
                            ctx.fillStyle = validCorners === 8 ? '#0f0' : (validCorners > 0 ? '#ff0' : '#f55');
                            ctx.fillText(`Projected Corners: ${validCorners}/8`, infoX, infoY);
                            infoY += lineHeight;
                            
                            // RAYCAST DIRECTION TEST - Where does the ray direction point in screen space?
                            // Calculate a point 2 units along the raycast direction
                            const pitch = -this.camera.rotX;
                            const yaw = -this.camera.rotY;
                            const cosPitch = Math.cos(pitch);
                            const sinPitch = Math.sin(pitch);
                            const cosYaw = Math.cos(yaw);
                            const sinYaw = Math.sin(yaw);
                            const rayDirX = sinYaw * cosPitch;
                            const rayDirY = sinPitch;
                            const rayDirZ = cosYaw * cosPitch;
                            
                            // Project a point 3 units along the ray
                            const rayTestX = camX + rayDirX * 3;
                            const rayTestY = camY + rayDirY * 3;
                            const rayTestZ = camZ + rayDirZ * 3;
                            const rayTestProj = project(rayTestX, rayTestY, rayTestZ);
                            
                            if (rayTestProj) {
                                // Draw GREEN marker where raycast direction points in screen space
                                ctx.strokeStyle = '#0f0';
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.moveTo(rayTestProj.x - 15, rayTestProj.y - 15);
                                ctx.lineTo(rayTestProj.x + 15, rayTestProj.y + 15);
                                ctx.moveTo(rayTestProj.x + 15, rayTestProj.y - 15);
                                ctx.lineTo(rayTestProj.x - 15, rayTestProj.y + 15);
                                ctx.stroke();
                                ctx.fillStyle = '#0f0';
                                ctx.font = 'bold 12px monospace';
                                ctx.fillText('RAY DIR', rayTestProj.x + 20, rayTestProj.y);
                                ctx.font = 'bold 14px monospace';
                                
                                // Show distance from screen center
                                const screenCenterX = halfW;
                                const screenCenterY = halfH;
                                const rayOffsetX = rayTestProj.x - screenCenterX;
                                const rayOffsetY = rayTestProj.y - screenCenterY;
                                ctx.fillStyle = Math.abs(rayOffsetX) < 10 && Math.abs(rayOffsetY) < 10 ? '#0f0' : '#f55';
                                ctx.fillText(`Ray→Screen offset: (${rayOffsetX.toFixed(0)}, ${rayOffsetY.toFixed(0)})`, infoX, infoY);
                                infoY += lineHeight;
                                
                                // Draw the ACTUAL RAY PATH from camera to hit block
                                // This shows if the raycast is following the correct direction
                                const hitCenterX = hx + 0.5;
                                const hitCenterY = hy + 0.5;
                                const hitCenterZ = hz + 0.5;
                                const hitProj = project(hitCenterX, hitCenterY, hitCenterZ);
                                
                                if (hitProj) {
                                    // Draw dotted line from screen center to where hit block actually is
                                    ctx.strokeStyle = '#ff0';
                                    ctx.lineWidth = 2;
                                    ctx.setLineDash([5, 5]);
                                    ctx.beginPath();
                                    ctx.moveTo(halfW, halfH);  // Screen center (where we're aiming)
                                    ctx.lineTo(hitProj.x, hitProj.y);  // Where hit block is
                                    ctx.stroke();
                                    ctx.setLineDash([]);
                                    
                                    // Calculate angular deviation
                                    const devX = hitProj.x - halfW;
                                    const devY = hitProj.y - halfH;
                                    const devDist = Math.sqrt(devX * devX + devY * devY);
                                    
                                    ctx.fillStyle = devDist < 50 ? '#0f0' : '#f55';
                                    ctx.fillText(`Hit deviation: ${devDist.toFixed(0)}px from center`, infoX, infoY);
                                    infoY += lineHeight;
                                    
                                    if (devDist > 50) {
                                        ctx.fillStyle = '#f00';
                                        ctx.fillText('⚠ DDA BUG: Hit block not on ray path!', infoX, infoY);
                                        infoY += lineHeight;
                                        
                                        // Show DDA direction info
                                        ctx.fillStyle = '#ff0';
                                        ctx.font = '12px monospace';
                                        ctx.fillText(`Ray dir: (${rayDirX.toFixed(4)}, ${rayDirY.toFixed(4)}, ${rayDirZ.toFixed(4)})`, infoX, infoY);
                                        infoY += 14;
                                        
                                        // Calculate where the ray SHOULD hit at the same distance
                                        const hitDist = Math.sqrt((hx+0.5-camX)**2 + (hy+0.5-camY)**2 + (hz+0.5-camZ)**2);
                                        const expectedX = camX + rayDirX * hitDist;
                                        const expectedY = camY + rayDirY * hitDist;
                                        const expectedZ = camZ + rayDirZ * hitDist;
                                        ctx.fillText(`Expected at dist ${hitDist.toFixed(1)}: (${expectedX.toFixed(1)}, ${expectedY.toFixed(1)}, ${expectedZ.toFixed(1)})`, infoX, infoY);
                                        infoY += 14;
                                        
                                        // Check what block is at the expected location
                                        const expectedVoxelX = Math.floor(expectedX);
                                        const expectedVoxelY = Math.floor(expectedY);
                                        const expectedVoxelZ = Math.floor(expectedZ);
                                        const expectedBlock = this.world[`${expectedVoxelX},${expectedVoxelY},${expectedVoxelZ}`] || 'air';
                                        ctx.fillText(`Expected voxel [${expectedVoxelX},${expectedVoxelY},${expectedVoxelZ}] = ${expectedBlock}`, infoX, infoY);
                                        infoY += 14;
                                        
                                        ctx.fillText(`Actual hit: (${hx+0.5}, ${hy+0.5}, ${hz+0.5})`, infoX, infoY);
                                        infoY += 14;
                                        
                                        // Show the angular error
                                        const toHitX = (hx+0.5) - camX;
                                        const toHitY = (hy+0.5) - camY;
                                        const toHitZ = (hz+0.5) - camZ;
                                        const toHitLen = Math.sqrt(toHitX*toHitX + toHitY*toHitY + toHitZ*toHitZ);
                                        const dotProduct = (rayDirX*(toHitX/toHitLen) + rayDirY*(toHitY/toHitLen) + rayDirZ*(toHitZ/toHitLen));
                                        const angleDeg = Math.acos(Math.min(1, Math.max(-1, dotProduct))) * 180 / Math.PI;
                                        ctx.fillStyle = '#f55';
                                        ctx.fillText(`Angular error: ${angleDeg.toFixed(1)}° off ray direction`, infoX, infoY);
                                        infoY += lineHeight;
                                        ctx.font = 'bold 14px monospace';
                                        
                                        // Trace first few ray march steps
                                        ctx.fillStyle = '#aaa';
                                        ctx.font = '11px monospace';
                                        
                                        // Use actual debug steps from raycast if available
                                        if (hit.debugSteps && hit.debugSteps.length > 0) {
                                            ctx.fillStyle = '#0ff';
                                            ctx.fillText('ACTUAL RAYCAST STEPS:', infoX, infoY);
                                            infoY += 14;
                                            ctx.fillStyle = '#aaa';
                                            for (let si = 0; si < Math.min(hit.debugSteps.length, 8); si++) {
                                                const step = hit.debugSteps[si];
                                                ctx.fillText(`t=${step.t.toFixed(1)}: (${step.px.toFixed(1)},${step.py.toFixed(1)},${step.pz.toFixed(1)}) → [${step.voxelX},${step.voxelY},${step.voxelZ}] = ${step.block}`, infoX, infoY);
                                                infoY += 12;
                                            }
                                            
                                            // Show the actual direction used
                                            if (hit.debugDir) {
                                                ctx.fillStyle = '#f0f';
                                                ctx.fillText(`ACTUAL dir: (${hit.debugDir.x.toFixed(4)}, ${hit.debugDir.y.toFixed(4)}, ${hit.debugDir.z.toFixed(4)})`, infoX, infoY);
                                                infoY += 14;
                                            }
                                            if (hit.debugOrigin) {
                                                ctx.fillStyle = '#f0f';
                                                ctx.fillText(`ACTUAL origin: (${hit.debugOrigin.x.toFixed(2)}, ${hit.debugOrigin.y.toFixed(2)}, ${hit.debugOrigin.z.toFixed(2)})`, infoX, infoY);
                                                infoY += 14;
                                                
                                                // Check if origin matches camera
                                                const originDiffX = Math.abs(hit.debugOrigin.x - camX);
                                                const originDiffY = Math.abs(hit.debugOrigin.y - camY);
                                                const originDiffZ = Math.abs(hit.debugOrigin.z - camZ);
                                                if (originDiffX > 0.01 || originDiffY > 0.01 || originDiffZ > 0.01) {
                                                    ctx.fillStyle = '#f00';
                                                    ctx.fillText(`⚠ ORIGIN MISMATCH! Diff: (${originDiffX.toFixed(2)}, ${originDiffY.toFixed(2)}, ${originDiffZ.toFixed(2)})`, infoX, infoY);
                                                    infoY += 14;
                                                }
                                            }
                                        } else {
                                            const traceSteps = 5;
                                            for (let step = 1; step <= traceSteps; step++) {
                                                const traceT = step * 0.8; // Check at 0.8, 1.6, 2.4, 3.2, 4.0
                                                const tracePx = camX + rayDirX * traceT;
                                                const tracePy = camY + rayDirY * traceT;
                                                const tracePz = camZ + rayDirZ * traceT;
                                                const traceVoxelX = Math.floor(tracePx);
                                                const traceVoxelY = Math.floor(tracePy);
                                                const traceVoxelZ = Math.floor(tracePz);
                                                const traceBlock = this.world[`${traceVoxelX},${traceVoxelY},${traceVoxelZ}`] || 'air';
                                                ctx.fillText(`t=${traceT.toFixed(1)}: (${tracePx.toFixed(1)},${tracePy.toFixed(1)},${tracePz.toFixed(1)}) → [${traceVoxelX},${traceVoxelY},${traceVoxelZ}] = ${traceBlock}`, infoX, infoY);
                                                infoY += 12;
                                            }
                                        }
                                        ctx.font = 'bold 14px monospace';
                                    }
                                }
                            }
                        }
                        
                        // MISMATCH DETECTION
                        if (hit.block && !worldBlock) {
                            ctx.fillStyle = '#f00';
                            ctx.fillText('⚠ GHOST BLOCK: raycast sees block not in world!', infoX, infoY);
                            infoY += lineHeight;
                        } else if (!inRenderList && worldBlock) {
                            ctx.fillStyle = '#ff0';
                            ctx.fillText('⚠ CULLED: block exists but not rendering', infoX, infoY);
                            infoY += lineHeight;
                        }
                        
                        // Transparent block check
                        if (worldBlock) {
                            const blockProps = this.blockColors[worldBlock];
                            if (blockProps && blockProps.transparent) {
                                ctx.fillStyle = '#ff0';
                                ctx.fillText(`Note: "${worldBlock}" is transparent`, infoX, infoY);
                            }
                        }
                    } else {
                        ctx.fillStyle = '#888';
                        ctx.fillText('No raycast hit (air or out of range)', infoX, infoY);
                    }
                }
                
                // 8. TREE/FOLIAGE DIAGNOSTIC - Analyze flickering/Z-fighting on leaves
                if (this.debugSettings.showTreeDiag) {
                    // Find all leaf/foliage blocks
                    const foliageBlocks = allBlocks.filter(b => 
                        b.type === 'leaves' || b.type === 'sakura_leaves' || 
                        b.type === 'cherry_leaves' || b.type.includes('leaf')
                    );
                    
                    // Group by distance buckets to find potential Z-fighting
                    const distBuckets: {[key: number]: {block: any, idx: number}[]} = {};
                    foliageBlocks.forEach((block, idx) => {
                        const bucketKey = Math.floor(block.dist * 100) / 100; // Round to 2 decimals
                        if (!distBuckets[bucketKey]) distBuckets[bucketKey] = [];
                        distBuckets[bucketKey].push({ block, idx });
                    });
                    
                    // Find buckets with multiple blocks (potential Z-fighting)
                    const zFightingGroups = Object.entries(distBuckets).filter(([_, blocks]) => (blocks as any[]).length > 1);
                    
                    // Draw diagnostic overlay on foliage
                    foliageBlocks.forEach((block, idx) => {
                        const centerProj = project(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                        if (!centerProj) return;
                        
                        // Check if this block is in a Z-fighting group
                        const bucketKey = Math.floor(block.dist * 100) / 100;
                        const isZFighting = distBuckets[bucketKey] && distBuckets[bucketKey].length > 1;
                        
                        // Draw outline
                        if (isZFighting) {
                            // Red dashed outline for potential Z-fighting
                            ctx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
                            ctx.lineWidth = 3;
                            ctx.setLineDash([4, 4]);
                            ctx.strokeRect(centerProj.x - 15, centerProj.y - 15, 30, 30);
                            ctx.setLineDash([]);
                        }
                        
                        // Show render order number
                        ctx.fillStyle = isZFighting ? '#f00' : '#0f0';
                        ctx.font = 'bold 10px monospace';
                        ctx.fillText(`${idx}`, centerProj.x - 5, centerProj.y + 3);
                    });
                    
                    // Draw info panel
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                    ctx.fillRect(this.canvas.width - 260, 80, 250, 140);
                    
                    ctx.fillStyle = '#ff69b4';
                    ctx.font = 'bold 14px monospace';
                    ctx.fillText('🌳 TREE DIAGNOSTIC', this.canvas.width - 250, 100);
                    
                    ctx.fillStyle = '#fff';
                    ctx.font = '12px monospace';
                    ctx.fillText(`Foliage blocks: ${foliageBlocks.length}`, this.canvas.width - 250, 120);
                    ctx.fillText(`Z-fighting groups: ${zFightingGroups.length}`, this.canvas.width - 250, 135);
                    
                    if (zFightingGroups.length > 0) {
                        ctx.fillStyle = '#f55';
                        ctx.fillText(`⚠ ${zFightingGroups.reduce((sum, [_, b]) => sum + (b as any[]).length, 0)} blocks at risk`, this.canvas.width - 250, 150);
                        ctx.fillStyle = '#888';
                        ctx.fillText('Red boxes = same distance', this.canvas.width - 250, 165);
                    } else {
                        ctx.fillStyle = '#0f0';
                        ctx.fillText('✓ No Z-fighting detected', this.canvas.width - 250, 150);
                    }
                    
                    ctx.fillStyle = '#888';
                    ctx.fillText(`Algo: ${this.debugSettings.renderAlgorithm}`, this.canvas.width - 250, 180);
                    ctx.fillText('Numbers = render order', this.canvas.width - 250, 195);
                }
                
                // 9. DISTANCE HEATMAP - Color blocks by distance
                if (this.debugSettings.showDistanceHeatmap) {
                    const maxDist = Math.max(...allBlocks.map(b => b.dist), 1);
                    const minDist = Math.min(...allBlocks.map(b => b.dist), 0);
                    
                    allBlocks.forEach((block, idx) => {
                        const centerProj = project(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                        if (!centerProj) return;
                        
                        // Normalize distance to 0-1
                        const normalized = (block.dist - minDist) / (maxDist - minDist);
                        
                        // Red (close) to Blue (far) gradient
                        const r = Math.floor(255 * (1 - normalized));
                        const b = Math.floor(255 * normalized);
                        const g = Math.floor(100 * (1 - Math.abs(normalized - 0.5) * 2));
                        
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
                        ctx.fillRect(centerProj.x - 8, centerProj.y - 8, 16, 16);
                    });
                    
                    // Draw legend
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                    ctx.fillRect(this.canvas.width - 150, 80, 140, 60);
                    ctx.font = 'bold 12px monospace';
                    ctx.fillStyle = '#f00';
                    ctx.fillText('■ Close', this.canvas.width - 140, 100);
                    ctx.fillStyle = '#00f';
                    ctx.fillText('■ Far', this.canvas.width - 140, 120);
                    ctx.fillStyle = '#888';
                    ctx.fillText(`Range: ${minDist.toFixed(1)}-${maxDist.toFixed(1)}`, this.canvas.width - 140, 135);
                }
                
                // 10. HIGHLIGHT BLOCK TYPE - Outline specific block types
                if (this.debugSettings.highlightBlockType) {
                    const targetType = this.debugSettings.highlightBlockType;
                    const matchingBlocks = allBlocks.filter(b => 
                        b.type.toLowerCase().includes(targetType.toLowerCase())
                    );
                    
                    matchingBlocks.forEach(block => {
                        const centerProj = project(block.x + 0.5, block.y + 0.5, block.z + 0.5);
                        if (!centerProj) return;
                        
                        ctx.strokeStyle = '#ff0';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(centerProj.x - 12, centerProj.y - 12, 24, 24);
                    });
                    
                    // Info panel
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                    ctx.fillRect(10, this.canvas.height - 60, 200, 50);
                    ctx.fillStyle = '#ff0';
                    ctx.font = 'bold 12px monospace';
                    ctx.fillText(`Highlighting: ${targetType}`, 20, this.canvas.height - 40);
                    ctx.fillStyle = '#fff';
                    ctx.fillText(`Found: ${matchingBlocks.length} blocks`, 20, this.canvas.height - 22);
                }
                
                // 11. RENDER STATS - Comprehensive performance panel
                if (this.debugSettings.showRenderStats) {
                    // Count blocks by type
                    const typeCounts: {[key: string]: number} = {};
                    allBlocks.forEach(b => {
                        typeCounts[b.type] = (typeCounts[b.type] || 0) + 1;
                    });
                    
                    // Sort by count
                    const sortedTypes = Object.entries(typeCounts)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .slice(0, 10);
                    
                    // Calculate distances
                    const avgDist = allBlocks.reduce((s, b) => s + b.dist, 0) / allBlocks.length || 0;
                    const minDist = Math.min(...allBlocks.map(b => b.dist));
                    const maxDist = Math.max(...allBlocks.map(b => b.dist));
                    
                    // Draw panel
                    const panelHeight = 180 + sortedTypes.length * 15;
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                    ctx.fillRect(this.canvas.width - 220, 80, 210, panelHeight);
                    
                    let y = 100;
                    ctx.fillStyle = '#ff69b4';
                    ctx.font = 'bold 14px monospace';
                    ctx.fillText('📊 RENDER STATS', this.canvas.width - 210, y);
                    y += 20;
                    
                    ctx.fillStyle = '#fff';
                    ctx.font = '11px monospace';
                    ctx.fillText(`Total Blocks: ${allBlocks.length}`, this.canvas.width - 210, y); y += 15;
                    ctx.fillText(`Algorithm: ${this.debugSettings.renderAlgorithm}`, this.canvas.width - 210, y); y += 15;
                    ctx.fillText(`Dist Range: ${minDist.toFixed(1)} - ${maxDist.toFixed(1)}`, this.canvas.width - 210, y); y += 15;
                    ctx.fillText(`Avg Dist: ${avgDist.toFixed(1)}`, this.canvas.width - 210, y); y += 20;
                    
                    ctx.fillStyle = '#888';
                    ctx.fillText('Top Block Types:', this.canvas.width - 210, y); y += 15;
                    
                    sortedTypes.forEach(([type, count]) => {
                        const pct = ((count as number) / allBlocks.length * 100).toFixed(0);
                        ctx.fillStyle = type.includes('leaves') ? '#f55' : '#0f0';
                        ctx.fillText(`  ${type}: ${count} (${pct}%)`, this.canvas.width - 210, y);
                        y += 15;
                    });
                    
                    // Foliage specific stats
                    const foliageCount = allBlocks.filter(b => 
                        b.type.includes('leaves') || b.type.includes('leaf')
                    ).length;
                    y += 10;
                    ctx.fillStyle = foliageCount > 50 ? '#f55' : '#0f0';
                    ctx.fillText(`Foliage: ${foliageCount} (${(foliageCount/allBlocks.length*100).toFixed(0)}%)`, this.canvas.width - 210, y);
                }
                
                // Camera angle debug visualization
                if (this.debugSettings.showCameraAngle) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    ctx.fillRect(10, 100, 280, 150);
                    ctx.strokeStyle = '#0ff';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(10, 100, 280, 150);
                    
                    ctx.font = 'bold 14px monospace';
                    ctx.fillStyle = '#0ff';
                    ctx.fillText('CAMERA ANGLES', 20, 120);
                    
                    ctx.font = '12px monospace';
                    ctx.fillStyle = '#fff';
                    
                    // Convert radians to degrees
                    const rotXDeg = (this.camera.rotX * 180 / Math.PI).toFixed(2);
                    const rotYDeg = (this.camera.rotY * 180 / Math.PI).toFixed(2);
                    
                    ctx.fillText(`Pitch (rotX): ${rotXDeg}° (${this.camera.rotX.toFixed(4)} rad)`, 20, 140);
                    ctx.fillText(`Yaw (rotY): ${rotYDeg}° (${this.camera.rotY.toFixed(4)} rad)`, 20, 158);
                    
                    // Look direction vector
                    const lookDirX = -Math.sin(this.camera.rotY) * Math.cos(this.camera.rotX);
                    const lookDirY = Math.sin(this.camera.rotX);
                    const lookDirZ = Math.cos(this.camera.rotY) * Math.cos(this.camera.rotX);
                    
                    ctx.fillText(`Look Dir: (${lookDirX.toFixed(3)}, ${lookDirY.toFixed(3)}, ${lookDirZ.toFixed(3)})`, 20, 176);
                    
                    // Trig values used in projection
                    const cosX = Math.cos(this.camera.rotX);
                    const sinX = Math.sin(this.camera.rotX);
                    const cosY = Math.cos(this.camera.rotY);
                    const sinY = Math.sin(this.camera.rotY);
                    
                    ctx.fillText(`cos(X): ${cosX.toFixed(4)}, sin(X): ${sinX.toFixed(4)}`, 20, 194);
                    ctx.fillText(`cos(Y): ${cosY.toFixed(4)}, sin(Y): ${sinY.toFixed(4)}`, 20, 212);
                    
                    // Looking direction indicator
                    const lookingUp = this.camera.rotX > 0.5;
                    const lookingDown = this.camera.rotX < -0.5;
                    ctx.fillStyle = (lookingUp || lookingDown) ? '#ff0' : '#0f0';
                    ctx.fillText(`Direction: ${lookingUp ? '⬆️ UP' : lookingDown ? '⬇️ DOWN' : '➡️ LEVEL'}`, 20, 230);
                }
                
                // Swimming debug visualization
                if (this.debugSettings.showSwimDebug) {
                    ctx.fillStyle = 'rgba(0, 0, 80, 0.92)';
                    ctx.fillRect(10, 260, 340, 260);
                    ctx.strokeStyle = '#0af';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(10, 260, 340, 260);
                    
                    ctx.font = 'bold 14px monospace';
                    ctx.fillStyle = '#0af';
                    ctx.fillText('🏊 SWIM DEBUG', 20, 280);
                    
                    const dbg = this.swimDebugInfo;
                    if (dbg) {
                        ctx.font = '10px monospace';
                        
                        // Blocks
                        const drawBlock = (label, block, y) => {
                            ctx.fillStyle = block === 'water' ? '#0ff' : block === 'lava' ? '#f80' : '#666';
                            ctx.fillText(`${label}: ${block}`, 20, y);
                        };
                        drawBlock('Head', dbg.headBlock, 298);
                        drawBlock('Waist', dbg.waistBlock, 312);
                        drawBlock('Feet', dbg.feetBlock, 326);
                        drawBlock('Below', dbg.belowFeetBlock, 340);
                        
                        // Flags
                        ctx.fillStyle = '#fff';
                        ctx.fillText(`feetInWater: ${dbg.feetInWater}`, 150, 312);
                        ctx.fillText(`waistInWater: ${dbg.waistInWater}`, 150, 326);
                        ctx.fillText(`headInWater: ${dbg.headInWater}`, 150, 340);
                        
                        // States
                        ctx.font = 'bold 11px monospace';
                        ctx.fillStyle = dbg.swimming ? '#0f0' : '#f00';
                        ctx.fillText(`swimming: ${dbg.swimming}`, 20, 358);
                        ctx.fillStyle = dbg.submerged ? '#08f' : '#666';
                        ctx.fillText(`submerged: ${dbg.submerged}`, 150, 358);
                        
                        ctx.fillStyle = dbg.stableAtSurface ? '#ff0' : '#666';
                        ctx.fillText(`stableAtSurface: ${dbg.stableAtSurface}`, 20, 374);
                        ctx.fillStyle = dbg.atFluidSurface ? '#0ff' : '#666';
                        ctx.fillText(`atFluidSurface: ${dbg.atFluidSurface}`, 180, 374);
                        
                        // Physics branch - THE KEY INFO
                        ctx.font = 'bold 14px monospace';
                        const branchColors = {
                            'FLOAT': '#0ff', 'SINK': '#f55', 'SWIM_UP': '#0f0',
                            'DIVE': '#f80', 'JUMP': '#ff0', 'GRAVITY': '#888', 'none': '#444'
                        };
                        ctx.fillStyle = branchColors[dbg.physicsBranch] || '#fff';
                        ctx.fillText(`BRANCH: ${dbg.physicsBranch}`, 20, 398);
                        
                        // Velocity
                        ctx.font = '11px monospace';
                        ctx.fillStyle = dbg.velocityY > 0.001 ? '#0f0' : dbg.velocityY < -0.001 ? '#f55' : '#ff0';
                        ctx.fillText(`velocityY: ${dbg.velocityY.toFixed(5)} ${dbg.velocityY > 0 ? '↑' : dbg.velocityY < 0 ? '↓' : '—'}`, 20, 418);
                        
                        // Position
                        ctx.fillStyle = '#aaa';
                        ctx.fillText(`feetY: ${dbg.playerFeetY.toFixed(3)}`, 180, 418);
                        
                        // Ground
                        const groundY = this.getGroundHeightBelow(this.camera.x, this.camera.z, this.camera.y);
                        ctx.fillStyle = '#888';
                        ctx.fillText(`ground: Y=${groundY}`, 20, 436);
                        
                        // Keys
                        ctx.fillStyle = this.keys[' '] ? '#0f0' : '#444';
                        ctx.fillText(`[SPACE]`, 20, 456);
                        ctx.fillStyle = this.keys['shift'] ? '#f80' : '#444';
                        ctx.fillText(`[SHIFT]`, 90, 456);
                        
                        // Water entry conditions
                        ctx.fillStyle = '#888';
                        ctx.font = '9px monospace';
                        ctx.fillText(`Float requires: waistInWater && !headInWater && velY>-0.02`, 20, 476);
                        ctx.fillText(`Current velY check: ${this.velocity.y > -0.02 ? 'PASS' : 'FAIL'} (${this.velocity.y.toFixed(3)} > -0.02)`, 20, 490);
                        
                        // Diagnosis
                        ctx.font = 'bold 10px monospace';
                        if (!dbg.swimming) {
                            ctx.fillStyle = '#888';
                            ctx.fillText('Not in water', 20, 508);
                        } else if (dbg.physicsBranch === 'FLOAT') {
                            ctx.fillStyle = '#0ff';
                            ctx.fillText('⚠️ FLOATING - this prevents sinking!', 20, 508);
                        } else if (dbg.physicsBranch === 'SINK') {
                            ctx.fillStyle = '#0f0';
                            ctx.fillText('✓ Sinking correctly', 20, 508);
                        }
                    } else {
                        ctx.fillStyle = '#f00';
                        ctx.fillText('No swim debug info (not in update loop)', 20, 300);
                    }
                }
                
                // ═══════════════════════════════════════════════════════════
                // END DEBUG VISUALIZATIONS
                // ═══════════════════════════════════════════════════════════
                
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
                        
                        // Generate forcefield segments for this wall - skip segments way below player
                        const minRenderY = Math.max(bounds.minY, camY - 10); // Don't render too far below player
                        for (let y = minRenderY; y < bounds.maxY; y += segmentSize) {
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
                                
                                // OCCLUSION CHECK: Don't render if behind solid blocks
                                // Raycast from camera to segment center
                                const segCenterX = (corners[0][0] + corners[2][0]) / 2;
                                const segCenterY = (corners[0][1] + corners[2][1]) / 2;
                                const segCenterZ = (corners[0][2] + corners[2][2]) / 2;
                                
                                const dx = segCenterX - camX;
                                const dy = segCenterY - camY;
                                const dz = segCenterZ - camZ;
                                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                                
                                // Check points along ray for solid blocks
                                let occluded = false;
                                const steps = Math.max(8, Math.floor(dist / 2));
                                for (let i = 1; i < steps; i++) {
                                    const t = i / steps;
                                    const checkX = Math.floor(camX + dx * t);
                                    const checkY = Math.floor(camY + dy * t);
                                    const checkZ = Math.floor(camZ + dz * t);
                                    
                                    const checkBlock = this.world[`${checkX},${checkY},${checkZ}`];
                                    if (checkBlock && !this.fluidBlocks.includes(checkBlock)) {
                                        // Check if it's a transparent block
                                        const blockProps = this.blockColors[checkBlock];
                                        if (!blockProps || !blockProps.transparent) {
                                            // Solid opaque block occludes
                                            occluded = true;
                                            break;
                                        }
                                    }
                                }
                                
                                if (occluded) continue; // Skip this forcefield segment
                                
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
                    
                    // Bottom forcefield (floor at minY) - only if player can see it
                    const bottomY = bounds.minY;
                    const canSeeFloor = camY > bottomY + 3; // Player must be above floor to see it
                    
                    if (canSeeFloor) {
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
                            
                            // OCCLUSION CHECK: Don't render floor if player has blocks below them
                            const segCenterX = x + segmentSize / 2;
                            const segCenterZ = z + segmentSize / 2;
                            
                            const dx = segCenterX - camX;
                            const dy = bottomY - camY;
                            const dz = segCenterZ - camZ;
                            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                            
                            // Raycast from camera to floor segment
                            let occluded = false;
                            const steps = Math.max(8, Math.floor(dist / 2));
                            for (let i = 1; i < steps; i++) {
                                const t = i / steps;
                                const checkX = Math.floor(camX + dx * t);
                                const checkY = Math.floor(camY + dy * t);
                                const checkZ = Math.floor(camZ + dz * t);
                                
                                const checkBlock = this.world[`${checkX},${checkY},${checkZ}`];
                                if (checkBlock && !this.fluidBlocks.includes(checkBlock)) {
                                    const blockProps = this.blockColors[checkBlock];
                                    if (!blockProps || !blockProps.transparent) {
                                        // Solid block blocks view of floor
                                        occluded = true;
                                        break;
                                    }
                                }
                            }
                            
                            if (occluded) continue; // Skip this floor segment
                            
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
                    } // End canSeeFloor check
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
                
                // Render Repair NPC (wise man)
                if (this.repairNPC) {
                    const npc = this.repairNPC;
                    const center = project(npc.x, npc.y + 1.2, npc.z);
                    if (center) {
                        // Use same perspective formula as blocks (fov / distance)
                        // NPC is about 2 blocks tall, scale accordingly
                        const npcWorldHeight = 2.0;
                        const screenSize = (npcWorldHeight * fov) / center.z;
                        
                        // Clamp to reasonable screen bounds (not too small when far, not too huge when close)
                        const clampedSize = Math.min(400, Math.max(20, screenSize));
                        
                        // Body - blue robes
                        ctx.fillStyle = '#4169e1';
                        ctx.fillRect(center.x - clampedSize * 0.175, center.y - clampedSize * 0.15, clampedSize * 0.35, clampedSize * 0.4);
                        
                        // Head - tan/beige
                        ctx.fillStyle = '#d2b48c';
                        ctx.beginPath();
                        ctx.arc(center.x, center.y - clampedSize * 0.3, clampedSize * 0.15, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Wizard hat - dark blue
                        ctx.fillStyle = '#191970';
                        ctx.beginPath();
                        ctx.moveTo(center.x - clampedSize * 0.175, center.y - clampedSize * 0.4);
                        ctx.lineTo(center.x, center.y - clampedSize * 0.65);
                        ctx.lineTo(center.x + clampedSize * 0.175, center.y - clampedSize * 0.4);
                        ctx.closePath();
                        ctx.fill();
                        
                        // Hat brim
                        ctx.fillRect(center.x - clampedSize * 0.2, center.y - clampedSize * 0.425, clampedSize * 0.4, clampedSize * 0.05);
                        
                        // Beard - white/gray
                        ctx.fillStyle = '#ddd';
                        ctx.beginPath();
                        ctx.moveTo(center.x - clampedSize * 0.1, center.y - clampedSize * 0.25);
                        ctx.lineTo(center.x - clampedSize * 0.075, center.y - clampedSize * 0.1);
                        ctx.lineTo(center.x + clampedSize * 0.075, center.y - clampedSize * 0.1);
                        ctx.lineTo(center.x + clampedSize * 0.1, center.y - clampedSize * 0.25);
                        ctx.closePath();
                        ctx.fill();
                        
                        // Eyes - wise expression
                        ctx.fillStyle = '#000';
                        ctx.beginPath();
                        ctx.arc(center.x - clampedSize * 0.06, center.y - clampedSize * 0.325, clampedSize * 0.025, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(center.x + clampedSize * 0.06, center.y - clampedSize * 0.325, clampedSize * 0.025, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Interaction prompt if close
                        if (npc.showPrompt) {
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                            ctx.fillRect(center.x - 80, center.y - clampedSize * 0.5 - 40, 160, 30);
                            ctx.fillStyle = '#ffd700';
                            ctx.font = '14px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('[E] Talk to Gunsmith', center.x, center.y - clampedSize * 0.5 - 22);
                        }
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
                        
                        // Minecraft-style gentle bob - slower and smoother
                        const bobOffset = Math.sin(item.bobPhase * 0.8) * 0.08;
                        const center = project(item.x, item.y + bobOffset + 0.15, item.z);
                        if (!center || center.z <= 0) continue;
                        
                        const baseSize = Math.max(6, 30 / center.z);
                        
                        // Draw 3D item based on type (rotation is based on bobPhase)
                        this.drawDroppedItem3D(ctx, center.x, center.y, baseSize, item.type, item.bobPhase * 0.5);
                        
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
                // Only shows if block is within reach (4 blocks)
                if (!this.isPaused && this.pointerLocked) {
                    const hit = this.raycast();
                    if (hit && hit.hit) {
                        // Show wireframe around the block you're POINTING at
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
                        
                        // DEBUG: Store wireframe center for comparison
                        if (this.debugSettings.showTargetInfo && projected.every(p => p !== null)) {
                            const wireframeCenterX = projected.reduce((sum, p) => sum + p.x, 0) / 8;
                            const wireframeCenterY = projected.reduce((sum, p) => sum + p.y, 0) / 8;
                            // Draw a MAGENTA marker where wireframe center actually is
                            ctx.strokeStyle = '#f0f';
                            ctx.lineWidth = 4;
                            ctx.beginPath();
                            ctx.arc(wireframeCenterX, wireframeCenterY, 25, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.fillStyle = '#f0f';
                            ctx.font = 'bold 12px monospace';
                            ctx.fillText('WIREFRAME', wireframeCenterX + 30, wireframeCenterY - 5);
                            ctx.fillText(`(${bx},${by},${bz})`, wireframeCenterX + 30, wireframeCenterY + 10);
                        }
                        
                        // Draw edges if all corners are visible
                        if (projected.every(p => p !== null)) {
                            // Simple black wireframe
                            let strokeColor = 'rgba(0, 0, 0, 0.8)';
                            let lineWidth = 2;
                            
                            // Color variation when looking through fluids
                            if (hit.throughWater) {
                                strokeColor = 'rgba(74, 144, 217, 0.7)';
                                lineWidth = 3;
                            } else if (hit.throughLava) {
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
                        
                        // Show tooltip for targeted block
                        const targetBlock = this.getBlock(bx, by, bz);
                        this.updateBlockTooltip(targetBlock);
                    } else {
                        // No hit within reach - hide tooltip
                        this.updateBlockTooltip(null);
                    }
                }
                
                // Debug info display
                if (this.debugSettings.showCoords) {
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
                
                // Render KA-69 if selected - Traditional FPS horizontal gun
                if (this.selectedItem === 'ka69' && !this.isPaused) {
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
                
                // Render hotbar tooltip (pulsing name when scrolling)
                if (this.hotbarTooltip.visible) {
                    const age = Date.now() - this.hotbarTooltip.timestamp;
                    const fadeStart = 1000; // Start fading after 1 second
                    const fadeDuration = 500; // Fade over 0.5 seconds
                    
                    let alpha = 1;
                    if (age > fadeStart) {
                        alpha = 1 - Math.min(1, (age - fadeStart) / fadeDuration);
                    }
                    
                    if (alpha > 0) {
                        // Pulse effect
                        const pulse = 1 + Math.sin(age * 0.01) * 0.1;
                        const fontSize = 24 * pulse;
                        
                        // Position above hotbar center
                        const tooltipX = width / 2;
                        const tooltipY = height - 120;
                        
                        ctx.save();
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        // Shadow for readability
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                        ctx.shadowBlur = 8;
                        ctx.shadowOffsetX = 2;
                        ctx.shadowOffsetY = 2;
                        
                        // Text with fade
                        ctx.font = `bold ${fontSize}px Arial`;
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.fillText(this.hotbarTooltip.text, tooltipX, tooltipY);
                        
                        ctx.restore();
                    }
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
            
            project(x, y, z) {
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
                    tooltip.querySelector('.tooltip-title').textContent = info.name;
                    const isFilled = info.item === 'FILLED';
                    tooltip.querySelector('.tooltip-desc').innerHTML = 
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
                    if (itemId === 'ka69') {
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
            
            
            // Procedural texture generation for realistic block appearance
            generateTexture(type, baseColor, face) {
                const key = `${type}_${face}_${baseColor}`;
                if (this.textureCache[key]) return this.textureCache[key];
                
                // Create offscreen canvas for texture
                const size = 32; // Texture resolution
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                
                // Parse base color
                const parseColor = (color) => {
                    if (color.startsWith('rgba')) {
                        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                        return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
                    }
                    const r = parseInt(color.slice(1, 3), 16);
                    const g = parseInt(color.slice(3, 5), 16);
                    const b = parseInt(color.slice(5, 7), 16);
                    return { r, g, b };
                };
                
                const base = parseColor(baseColor);
                
                // Seeded random for consistency
                const random = (seed) => {
                    const x = Math.sin(seed) * 10000;
                    return x - Math.floor(x);
                };
                
                if (type === 'grass') {
                    // Grass texture with organic variation
                    for (let y = 0; y < size; y++) {
                        for (let x = 0; x < size; x++) {
                            const seed = x * 1000 + y;
                            const noise = random(seed) * 0.3 - 0.15; // ±15% variation
                            const r = Math.max(0, Math.min(255, base.r + base.r * noise));
                            const g = Math.max(0, Math.min(255, base.g + base.g * noise));
                            const b = Math.max(0, Math.min(255, base.b + base.b * noise));
                            ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                    
                    // Add grass blades on top face
                    if (face === 'top') {
                        ctx.fillStyle = 'rgba(90, 160, 70, 0.4)';
                        for (let i = 0; i < 12; i++) {
                            const x = Math.floor(random(i * 123) * size);
                            const y = Math.floor(random(i * 456) * size);
                            ctx.fillRect(x, y, 2, 3);
                        }
                    }
                } else if (type === 'dirt') {
                    // Dirt texture with clumpy noise
                    for (let y = 0; y < size; y++) {
                        for (let x = 0; x < size; x++) {
                            const seed = x * 1000 + y;
                            const noise1 = random(seed) * 0.25 - 0.125;
                            const noise2 = random(seed + 999) * 0.15 - 0.075;
                            const combined = noise1 + noise2;
                            const r = Math.max(0, Math.min(255, base.r + base.r * combined));
                            const g = Math.max(0, Math.min(255, base.g + base.g * combined));
                            const b = Math.max(0, Math.min(255, base.b + base.b * combined));
                            ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                    
                    // Add small pebbles
                    ctx.fillStyle = 'rgba(100, 80, 60, 0.3)';
                    for (let i = 0; i < 8; i++) {
                        const x = Math.floor(random(i * 789) * size);
                        const y = Math.floor(random(i * 321) * size);
                        ctx.fillRect(x, y, 2, 2);
                    }
                } else if (type === 'brick') {
                    // Brick pattern with mortar
                    const brickH = 8;
                    const brickW = 16;
                    const mortarSize = 2;
                    
                    // Mortar (darker background)
                    ctx.fillStyle = `rgb(${Math.floor(base.r * 0.6)},${Math.floor(base.g * 0.6)},${Math.floor(base.b * 0.6)})`;
                    ctx.fillRect(0, 0, size, size);
                    
                    // Draw bricks in pattern
                    for (let row = 0; row < Math.ceil(size / brickH); row++) {
                        const offset = (row % 2) * (brickW / 2);
                        for (let col = -1; col < Math.ceil(size / brickW) + 1; col++) {
                            const bx = col * brickW + offset;
                            const by = row * brickH;
                            
                            // Each brick has slight variation
                            const seed = row * 100 + col;
                            const noise = random(seed) * 0.15 - 0.075;
                            const r = Math.max(0, Math.min(255, base.r + base.r * noise));
                            const g = Math.max(0, Math.min(255, base.g + base.g * noise));
                            const b = Math.max(0, Math.min(255, base.b + base.b * noise));
                            ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
                            ctx.fillRect(bx, by, brickW - mortarSize, brickH - mortarSize);
                            
                            // Add texture to brick
                            ctx.fillStyle = `rgba(0,0,0,${random(seed + 50) * 0.1})`;
                            ctx.fillRect(bx, by, brickW - mortarSize, brickH - mortarSize);
                        }
                    }
                } else if (type === 'leaves') {
                    // Leaves texture with organic patterns
                    for (let y = 0; y < size; y++) {
                        for (let x = 0; x < size; x++) {
                            const seed = x * 1000 + y;
                            const noise = random(seed) * 0.4 - 0.2; // More variation for leaves
                            const r = Math.max(0, Math.min(255, base.r + base.r * noise));
                            const g = Math.max(0, Math.min(255, base.g + base.g * noise));
                            const b = Math.max(0, Math.min(255, base.b + base.b * noise));
                            ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                    
                    // Add darker veins/gaps between leaves
                    ctx.fillStyle = 'rgba(0, 50, 0, 0.3)';
                    for (let i = 0; i < 15; i++) {
                        const x = Math.floor(random(i * 234) * size);
                        const y = Math.floor(random(i * 567) * size);
                        const w = 2 + Math.floor(random(i * 890) * 3);
                        const h = 2 + Math.floor(random(i * 345) * 3);
                        ctx.fillRect(x, y, w, h);
                    }
                } else if (type === 'sakuraLeaves') {
                    // Sakura leaves texture - pink with petal-like patterns
                    for (let y = 0; y < size; y++) {
                        for (let x = 0; x < size; x++) {
                            const seed = x * 1000 + y;
                            const noise = random(seed) * 0.35 - 0.175;
                            const r = Math.max(0, Math.min(255, base.r + base.r * noise));
                            const g = Math.max(0, Math.min(255, base.g + base.g * noise));
                            const b = Math.max(0, Math.min(255, base.b + base.b * noise));
                            ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                    
                    // Add petal shapes - small ellipses scattered
                    for (let i = 0; i < 12; i++) {
                        const px = Math.floor(random(i * 111) * size);
                        const py = Math.floor(random(i * 222) * size);
                        const petalSize = 2 + Math.floor(random(i * 333) * 3);
                        
                        // Lighter pink petal highlight
                        ctx.fillStyle = 'rgba(255, 220, 230, 0.5)';
                        ctx.beginPath();
                        ctx.ellipse(px, py, petalSize, petalSize * 0.6, random(i * 444) * Math.PI, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Add darker gaps between petals
                    ctx.fillStyle = 'rgba(180, 100, 120, 0.4)';
                    for (let i = 0; i < 10; i++) {
                        const x = Math.floor(random(i * 555) * size);
                        const y = Math.floor(random(i * 666) * size);
                        const w = 1 + Math.floor(random(i * 777) * 2);
                        const h = 1 + Math.floor(random(i * 888) * 2);
                        ctx.fillRect(x, y, w, h);
                    }
                    
                    // Add occasional white highlight (blossom centers)
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    for (let i = 0; i < 5; i++) {
                        const x = Math.floor(random(i * 999) * size);
                        const y = Math.floor(random(i * 1111) * size);
                        ctx.fillRect(x, y, 1, 1);
                    }
                } else if (type === 'water') {
                    // Water texture - bubbly like cool seltzer water
                    // Base ripple pattern
                    for (let y = 0; y < size; y++) {
                        for (let x = 0; x < size; x++) {
                            const seed = x * 1000 + y;
                            // Wave-like noise pattern
                            const wave = Math.sin((x + random(seed) * 5) * 0.4) * 0.15;
                            const ripple = Math.cos((y + random(seed + 500) * 5) * 0.3) * 0.1;
                            const noise = (wave + ripple) + random(seed) * 0.2 - 0.1;
                            const r = Math.max(0, Math.min(255, base.r + base.r * noise));
                            const g = Math.max(0, Math.min(255, base.g + base.g * noise));
                            const b = Math.max(0, Math.min(255, base.b + base.b * noise));
                            ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                    
                    // Add bubbles - seltzer effect
                    for (let i = 0; i < 25; i++) {
                        const bx = Math.floor(random(i * 123) * size);
                        const by = Math.floor(random(i * 456) * size);
                        const bubbleSize = 1 + Math.floor(random(i * 789) * 2);
                        
                        // Light bubble highlight
                        ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
                        ctx.beginPath();
                        ctx.arc(bx, by, bubbleSize, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Tiny bright center
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.fillRect(bx, by, 1, 1);
                    }
                    
                    // Light caustic patterns
                    ctx.fillStyle = 'rgba(150, 220, 255, 0.25)';
                    for (let i = 0; i < 8; i++) {
                        const cx = Math.floor(random(i * 321) * size);
                        const cy = Math.floor(random(i * 654) * size);
                        const cw = 3 + Math.floor(random(i * 987) * 4);
                        ctx.fillRect(cx, cy, cw, 1);
                    }
                } else if (type === 'lava') {
                    // Lava texture - hot like bubbling soup
                    // Base molten pattern with hot spots
                    for (let y = 0; y < size; y++) {
                        for (let x = 0; x < size; x++) {
                            const seed = x * 1000 + y;
                            // Swirling heat pattern
                            const swirl = Math.sin((x * 0.3 + y * 0.2) + random(seed) * 3) * 0.2;
                            const bubble = random(seed + 100) > 0.85 ? 0.3 : 0;
                            const noise = swirl + bubble + random(seed) * 0.15 - 0.075;
                            
                            // Vary between orange and yellow for heat
                            const heatBoost = random(seed + 200) > 0.7 ? 30 : 0;
                            const r = Math.max(0, Math.min(255, base.r + base.r * noise + heatBoost));
                            const g = Math.max(0, Math.min(255, base.g + base.g * noise + heatBoost * 0.8));
                            const b = Math.max(0, Math.min(255, base.b + base.b * noise));
                            ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                    
                    // Add hot bubbling spots
                    for (let i = 0; i < 12; i++) {
                        const bx = Math.floor(random(i * 111) * size);
                        const by = Math.floor(random(i * 222) * size);
                        const spotSize = 2 + Math.floor(random(i * 333) * 3);
                        
                        // Bright yellow-orange center (hot spot)
                        ctx.fillStyle = 'rgba(255, 200, 50, 0.7)';
                        ctx.beginPath();
                        ctx.arc(bx, by, spotSize, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // White-hot core
                        ctx.fillStyle = 'rgba(255, 255, 200, 0.9)';
                        ctx.fillRect(bx - 1, by - 1, 2, 2);
                    }
                    
                    // Dark cooling crust veins
                    ctx.strokeStyle = 'rgba(80, 20, 0, 0.4)';
                    ctx.lineWidth = 1;
                    for (let i = 0; i < 6; i++) {
                        const sx = Math.floor(random(i * 444) * size);
                        const sy = Math.floor(random(i * 555) * size);
                        ctx.beginPath();
                        ctx.moveTo(sx, sy);
                        ctx.lineTo(sx + random(i * 666) * 8 - 4, sy + random(i * 777) * 6);
                        ctx.stroke();
                    }
                } else if (type === 'wood') {
                    // Wood texture with grain and rings
                    if (face === 'top') {
                        // TOP FACE: Tree rings (circular pattern)
                        // Fill with base wood color
                        for (let y = 0; y < size; y++) {
                            for (let x = 0; x < size; x++) {
                                const seed = x * 1000 + y;
                                const noise = random(seed) * 0.15 - 0.075;
                                const r = Math.max(0, Math.min(255, base.r + base.r * noise));
                                const g = Math.max(0, Math.min(255, base.g + base.g * noise));
                                const b = Math.max(0, Math.min(255, base.b + base.b * noise));
                                ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
                                ctx.fillRect(x, y, 1, 1);
                            }
                        }
                        
                        // Add tree rings (concentric circles from center)
                        const centerX = size / 2;
                        const centerY = size / 2;
                        for (let ring = 1; ring < 6; ring++) {
                            const radius = ring * 4 + random(ring * 50) * 3;
                            ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 + random(ring * 100) * 0.1})`;
                            ctx.lineWidth = 0.5 + random(ring * 200) * 1;
                            ctx.beginPath();
                            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                            ctx.stroke();
                        }
                    } else {
                        // SIDE FACES: Vertical bark texture (wood grain)
                        for (let y = 0; y < size; y++) {
                            for (let x = 0; x < size; x++) {
                                const seed = x * 10 + y * 1000; // Emphasize vertical variation
                                const noise = random(seed) * 0.2 - 0.1;
                                const r = Math.max(0, Math.min(255, base.r + base.r * noise));
                                const g = Math.max(0, Math.min(255, base.g + base.g * noise));
                                const b = Math.max(0, Math.min(255, base.b + base.b * noise));
                                ctx.fillStyle = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
                                ctx.fillRect(x, y, 1, 1);
                            }
                        }
                        
                        // Add vertical grain lines (darker streaks)
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
                        ctx.lineWidth = 1;
                        for (let i = 0; i < 8; i++) {
                            const x = Math.floor(random(i * 333) * size);
                            const waveOffset = random(i * 444) * 3;
                            ctx.beginPath();
                            ctx.moveTo(x, 0);
                            for (let y = 0; y < size; y += 2) {
                                const wave = Math.sin(y * 0.3 + i) * waveOffset;
                                ctx.lineTo(x + wave, y);
                            }
                            ctx.stroke();
                        }
                        
                        // Add horizontal cracks/knots occasionally
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                        for (let i = 0; i < 3; i++) {
                            if (random(i * 555) > 0.7) {
                                const y = Math.floor(random(i * 666) * size);
                                const x = Math.floor(random(i * 777) * size * 0.8);
                                ctx.fillRect(x, y, 4, 1);
                            }
                        }
                    }
                }
                
                // Create pattern from canvas
                const pattern = ctx.createPattern(canvas, 'repeat');
                this.textureCache[key] = pattern;
                return pattern;
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
                            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                            this.ctx.fillRect(this.canvas.width - 70, this.canvas.height - 25, 65, 20);
                            this.ctx.fillStyle = '#00ff00';
                            this.ctx.font = '12px monospace';
                            this.ctx.textAlign = 'right';
                            this.ctx.fillText(`${this.fpsCounter.fps} FPS`, this.canvas.width - 10, this.canvas.height - 10);
                            this.ctx.textAlign = 'left';
                        }
                        
                        // Display active rendering algorithm (top-right, always visible)
                        const algoName = this.debugSettings.renderAlgorithm.toUpperCase();
                        const algoColors = {
                            PAINTER: '#00ff00',
                            ZBUFFER: '#00ffff',
                            BSP: '#ff00ff'
                        };
                        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                        this.ctx.fillRect(this.canvas.width - 90, 5, 85, 20);
                        this.ctx.fillStyle = algoColors[algoName] || '#ffffff';
                        this.ctx.font = 'bold 12px monospace';
                        this.ctx.textAlign = 'right';
                        this.ctx.fillText(algoName, this.canvas.width - 10, 18);
                        this.ctx.textAlign = 'left';
                    }
                }
                
                // Store the ID so we can cancel it on stop
                this.gameLoopId = requestAnimationFrame((ts) => this.gameLoop(ts));
            },
            
            async start() {
                // Show loading screen and game container first
                document.getElementById('minecraftGame').classList.add('active');
                document.getElementById('loadingScreen').classList.add('active');
                document.getElementById('clickToPlay').classList.remove('active');
                
                // Initialize world (async - loading screen updates during this)
                await this.fullInit();
                
                // Expose game instance for dialogue onclick handlers
                (window as any).game = this;
                
                this.isActive = true;
                this.isPaused = false;
                this.pointerLocked = false;
                this.stats = { blocksPlaced: 0, blocksBroken: 0, distance: 0, jumps: 0, startTime: Date.now() };
                document.getElementById('pauseMenu').classList.remove('active');
                document.getElementById('gameUI').style.display = 'flex';
                
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
                        
                        // Check if there are blocks ABOVE ground (buildings, trees)
                        // Scan upward to make sure player is truly outside
                        let hasRoof = false;
                        for (let checkY = groundY + 1; checkY <= groundY + 10; checkY++) {
                            const block = this.getBlock(x, checkY, z);
                            if (block && block !== 'water' && block !== 'lava') {
                                hasRoof = true;
                                break; // Found structure above
                            }
                        }
                        
                        // Reject if there's a roof/structure above
                        if (hasRoof) return null;
                        
                        // Check surrounding area for structures (avoid spawning next to buildings)
                        let nearStructure = false;
                        for (let dx = -2; dx <= 2; dx++) {
                            for (let dz = -2; dz <= 2; dz++) {
                                // Check if there are tall structures nearby
                                for (let dy = 1; dy <= 5; dy++) {
                                    const block = this.getBlock(x + dx, groundY + dy, z + dz);
                                    if (block && block !== 'water' && block !== 'lava') {
                                        nearStructure = true;
                                        break;
                                    }
                                }
                                if (nearStructure) break;
                            }
                            if (nearStructure) break;
                        }
                        
                        // Prefer open areas away from structures
                        if (nearStructure) {
                            return null; // Skip this location
                        }
                        
                        const feetY = groundY + 1;
                        const bodyY = groundY + 2;
                        
                        // Check if there's space for the player (2 blocks of air above ground)
                        const feetBlock = this.getBlock(x, feetY, z);
                        const bodyBlock = this.getBlock(x, bodyY, z);
                        
                        // Both spaces must be empty or fluid (can spawn in water but not in solid)
                        const feetClear = !feetBlock || feetBlock === 'water' || feetBlock === 'lava';
                        const bodyClear = !bodyBlock || bodyBlock === 'water' || bodyBlock === 'lava';
                        
                        // Check for flat ground (prefer stable, flat terrain)
                        const groundBlock = this.getBlock(x, groundY, z);
                        const isDryLand = groundBlock !== 'water' && groundBlock !== 'lava' && groundBlock !== 'sand';
                        
                        // Check if ground is reasonably flat (check adjacent blocks)
                        let isFlat = true;
                        for (let dx = -1; dx <= 1; dx++) {
                            for (let dz = -1; dz <= 1; dz++) {
                                if (dx === 0 && dz === 0) continue;
                                
                                // Find ground at adjacent position (inline logic)
                                let adjGroundY = null;
                                for (let checkY = 40; checkY >= 0; checkY--) {
                                    const adjBlock = this.getBlock(x + dx, checkY, z + dz);
                                    if (adjBlock && adjBlock !== 'water' && adjBlock !== 'lava') {
                                        adjGroundY = checkY;
                                        break;
                                    }
                                }
                                
                                // If can't find adjacent ground or too steep, not flat
                                if (adjGroundY === null || Math.abs(adjGroundY - groundY) > 1) {
                                    isFlat = false; // Too steep/uneven or no ground
                                    break;
                                }
                            }
                            if (!isFlat) break;
                        }
                        
                        if (feetClear && bodyClear && isFlat) {
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
                (this.canvas as HTMLElement).style.filter = '';
                
                // Reset player state
                this.velocity = { x: 0, y: 0, z: 0 };
                this.isJumping = false;
                this.inWater = false;
                this.inLava = false;
                this.swimming = false;
                this.lastSwimTime = 0;
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
                if (petalCanvas) (petalCanvas as HTMLElement).style.display = 'none';
                
                // Hide flame particles container
                const flameParticles = document.getElementById('flameParticles');
                if (flameParticles) (flameParticles as HTMLElement).style.visibility = 'hidden';
                
                // Lock page scrolling while game is active
                (document.body as HTMLElement).style.overflow = 'hidden';
                (document.documentElement as HTMLElement).style.overflow = 'hidden';
                
                // Show click-to-play - user must click to lock pointer
                document.getElementById('clickToPlay').classList.add('active');
                
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
                document.getElementById('pauseMenu').classList.add('active');
                document.getElementById('gameUI').style.display = 'none';
                document.getElementById('clickToPlay').classList.remove('active');
                this.showSubmenu('menuMain');
                
                // Exit pointer lock if still locked
                if (document.pointerLockElement) {
                    document.exitPointerLock();
                }
            },
            
            resume() {
                this.isPaused = false;
                document.getElementById('pauseMenu').classList.remove('active');
                document.getElementById('gameUI').style.display = 'flex';
                
                // Must show click-to-play because we need a new user gesture to re-lock
                // (Browser security: can't re-lock immediately after ESC release)
                document.getElementById('clickToPlay').classList.add('active');
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
                this.lastSwimTime = 0;
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
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Hide UI elements
                document.getElementById('minecraftGame').classList.remove('active');
                document.getElementById('pauseMenu').classList.remove('active');
                document.getElementById('clickToPlay').classList.remove('active');
                document.getElementById('inventoryScreen').classList.remove('active');
                this.inventoryOpen = false;
                (this.canvas as HTMLElement).style.filter = '';
                
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
                (document.body as HTMLElement).style.overflow = '';
                (document.documentElement as HTMLElement).style.overflow = '';
                
                // Restore main site animations
                const petalCanvas = document.getElementById('petalCanvas');
                if (petalCanvas) (petalCanvas as HTMLElement).style.display = 'block';
                
                // Show flame particles container
                const flameParticles = document.getElementById('flameParticles');
                if (flameParticles) (flameParticles as HTMLElement).style.visibility = 'visible';
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
    if (!document.getElementById('minecraftGame')) {
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
        (triggerEl as HTMLElement).style.cursor = 'pointer';
      }
    }
    
    // Setup close button
    document.getElementById('closeMinecraft')?.addEventListener('click', () => this.stop());
    
    // Setup click to play
    document.getElementById('clickToPlay')?.addEventListener('click', () => {
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
