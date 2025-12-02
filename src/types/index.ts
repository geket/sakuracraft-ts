/**
 * SakuraCraft Type Definitions
 */

// Vector types
export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// Camera
export interface Camera extends Vector3 {
  rotX: number;
  rotY: number;
}

// Block colors
export interface BlockColor {
  top: string;
  side: string;
  bottom: string;
  transparent?: boolean;
  animated?: boolean;
}

export type BlockType = 
  | 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves' | 'appleLeaves'
  | 'water' | 'sand' | 'brick' | 'lava' | 'obsidian'
  | 'cherryWood' | 'cherryLeaves' | 'chest' | 'ritualChest' | 'buildingChest'
  | 'ritualStone' | 'petalSocket' | 'ropeSocket' | 'charmSocket' | 'plaqueSocket' | 'incenseSocket'
  | 'petalSocketFilled' | 'ropeSocketFilled' | 'charmSocketFilled' | 'plaqueSocketFilled' | 'incenseSocketFilled';

// Items
export type ItemType = 
  | 'block' | 'bucket' | 'weapon' | 'tool' | 'consumable';

export interface InventoryItem {
  type: ItemType;
  id: string;
  count: number;
  durability?: number;
  maxDurability?: number;
}

export interface ItemProperties {
  stackable: boolean;
  maxStack: number;
  durability?: number;
  maxDurability?: number;
  throwable?: boolean;
  description?: string;
  ritual?: boolean;
  invincible?: boolean;
}

// Inventory
export interface Inventory {
  hotbar: (InventoryItem | null)[];
  main: (InventoryItem | null)[];
  craftingResult: InventoryItem | null;
}

// Recipe
export interface RecipeIngredient {
  id: string;
  count: number;
}

export interface Recipe {
  ingredients: RecipeIngredient[];
  result: InventoryItem;
  name: string;
}

// Stats
export interface GameStats {
  blocksPlaced: number;
  blocksBroken: number;
  distance: number;
  jumps: number;
  startTime: number;
}

// Settings
export interface GameSettings {
  brightness: number;
  filter: 'none' | 'sepia' | 'grayscale' | 'trippy';
  renderDistance: number;
  shadows: boolean;
  lighting: boolean;
  antialiasing: boolean;
  showFps: boolean;
  targetFps: number;
}

// FPS Counter
export interface FPSCounter {
  frames: number;
  lastTime: number;
  fps: number;
}

// Mobs
export interface BaseMob {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export interface Bird extends BaseMob {
  phase: number;
  circleRadius: number;
  circleSpeed: number;
  circleOffset: number;
  bobPhase: number;
  color: string;
  wingPhase: number;
}

export interface PestBird extends Bird {
  state: 'circling' | 'attacking' | 'fleeing';
  anger: number;
  timesShot: number;
  targetPlayer: boolean;
  diveSpeed: number;
  spawnThreshold: number;
}

export interface Fish extends BaseMob {
  swimPhase: number;
  direction: number;
  speed: number;
}

export interface Cat extends BaseMob {
  state: 'idle' | 'walking' | 'sitting';
  color: string;
  direction: number;
  actionTimer: number;
}

export interface Creeper extends BaseMob {
  state: 'idle' | 'stalking' | 'fleeing';
  targetPlayer: boolean;
  fuseTimer: number;
  direction: number;
}

// Particles
export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type?: string;
}

// Dropped Items
export interface DroppedItem {
  x: number;
  y: number;
  z: number;
  vy: number;
  type: string;
  count: number;
  bobPhase: number;
  age: number;
}

// World bounds
export interface WorldBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

// Wind
export interface Wind {
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  gustTimer: number;
  strength: number;
}

// Bird Event
export interface BirdEvent {
  active: boolean;
  timer: number;
  intensity: number;
  type: string | null;
  events: Array<{
    name: string;
    description: string;
    action: () => void;
  }>;
  alertShown: {
    five: boolean;
    three: boolean;
    one: boolean;
    thirty: boolean;
    ten: boolean;
  };
  alertMessage: string | null;
  alertFade: number;
}

// Survival Stats
export interface SurvivalStats {
  score: number;
  wave: number;
  birdsDefeated: number;
  objectiveTimer: number;
  currentObjective: SurvivalObjective | null;
  objectives: SurvivalObjective[];
}

export interface SurvivalObjective {
  text: string;
  type: 'survive' | 'find_temple' | 'collect' | 'knockback' | 'ritual';
  item?: string;
  count?: number;
}

// Init options
export interface SakuraCraftInitOptions {
  container?: HTMLElement | string;
  trigger?: HTMLElement | string;
}

// Game Engine Interface
export interface ISakuraCraftEngine {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  isActive: boolean;
  isPaused: boolean;
  camera: Camera;
  velocity: Vector3;
  world: Record<string, BlockType>;
  keys: Record<string, boolean>;
  inventory: Inventory;
  stats: GameStats;
  settings: GameSettings;
  
  init(): void;
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
}
