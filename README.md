# 🌸 SakuraCraft (TypeScript)

A voxel-based browser game with cherry blossom aesthetics, built with TypeScript and Canvas.

## TypeScript Benefits

- **Full Type Safety**: Catch errors at compile time, not runtime
- **IntelliSense Support**: Rich autocomplete and inline documentation in your IDE
- **Self-Documenting**: Types serve as documentation for the API
- **Refactoring Support**: Safely rename and restructure code
- **Better Developer Experience**: Confidence when working with the game API

## Features

- **Procedural World Generation**: Explore a unique world with hills, water bodies, trees, and structures
- **Building System**: Place and break blocks including grass, dirt, stone, wood, bricks, and more
- **Inventory & Crafting**: Manage items across hotbar and inventory slots
- **Survival Elements**: Defend against pest birds, collect ritual items, complete the Omamori blessing
- **Graphics Options**: Adjust brightness, color filters, render distance, shadows, and more
- **Cherry Blossom Theme**: Beautiful pink trees with falling petal particles

## Installation

```bash
npm install sakuracraft
```

## Usage

### TypeScript / ES Modules

```typescript
import SakuraCraft from 'sakuracraft';
import type { GameSettings, GameStats } from 'sakuracraft';

// Create game instance with full type support
const game = new SakuraCraft();

// Initialize with typed options
game.init({
  container: document.body,
  trigger: '#playButton'
});

// Access typed settings
const settings: GameSettings = game.settings;
console.log(settings.renderDistance); // TypeScript knows this is a number

// Get typed stats
const stats: GameStats = game.getStats();
console.log(stats.blocksPlaced);

// Start the game
game.start();
```

### Script Tag

```html
<script src="sakuracraft.umd.js"></script>
<script>
  const game = new SakuraCraft();
  game.init({ trigger: '#playButton' });
</script>
```

## Type Definitions

The package includes comprehensive type definitions:

```typescript
// Core types
interface GameSettings {
  brightness: number;
  filter: 'none' | 'sepia' | 'grayscale' | 'trippy';
  renderDistance: number;
  shadows: boolean;
  lighting: boolean;
  antialiasing: boolean;
  showFps: boolean;
  targetFps: number;
}

interface GameStats {
  blocksPlaced: number;
  blocksBroken: number;
  distance: number;
  jumps: number;
  startTime: number;
}

interface SakuraCraftInitOptions {
  container?: HTMLElement | string;
  trigger?: HTMLElement | string;
}

// And many more...
```

## API

### SakuraCraft Class

```typescript
class SakuraCraftGame {
  // Initialize with options
  init(options?: SakuraCraftInitOptions): this;
  
  // Game control
  start(): this;
  stop(): this;
  pause(): this;
  resume(): this;
  
  // Properties
  readonly isActive: boolean;
  readonly isPaused: boolean;
  settings: GameSettings;
  
  // Methods
  getStats(): GameStats;
  
  // Advanced access
  readonly engine: ISakuraCraftEngine;
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Lint code
npm run lint
```

## Project Structure

```
sakuracraft/
├── src/
│   ├── index.ts              # Main entry point
│   ├── types/
│   │   └── index.ts          # Type definitions
│   ├── game/
│   │   └── SakuraCraftGame.ts  # Core game engine
│   ├── styles/
│   │   └── game.css          # Game styles
│   └── templates/
│       └── game.html         # Game HTML structure
├── dist/                     # Build output
├── index.html               # Development demo
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Comparison: JavaScript vs TypeScript Version

| Feature | JavaScript | TypeScript |
|---------|------------|------------|
| Type Safety | ❌ Runtime errors | ✅ Compile-time checks |
| IntelliSense | Limited | Full support |
| Documentation | Manual | Self-documenting |
| Bundle Size | Smaller | Slightly larger |
| Build Time | Faster | Slightly slower |
| Learning Curve | Lower | Higher |

Choose TypeScript if you:
- Work on larger projects
- Want better IDE support
- Value type safety
- Need self-documenting code

Choose JavaScript if you:
- Want simpler setup
- Have smaller bundle size requirements
- Are prototyping quickly
- Prefer less tooling

## License

MIT

## Credits

Built with ❤️, 🌸, and TypeScript
