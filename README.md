# 🌸 SakuraCraft

A voxel-based browser game with cherry blossom aesthetics, built with TypeScript, Canvas, and polished rendering algorithms.

**Live Demo:** https://geket.github.io/games/sakuracraft/

## ✨ Key Features

### 🎨 Advanced Rendering
- **Polished Painter's Algorithm**: Optimized depth-sorting for proper transparency and layering
- **Fancy Leaf Rendering**: Minecraft-style "fancy" graphics with internal face rendering and wind animation
- **Real-time Debugging**: Visual debugging tools for rendering pipeline inspection (`render treediag`, `render heatmap`)
- **Performance Monitoring**: Built-in FPS counter and performance metrics
- **Advanced Graphics Options**: Brightness, color filters, render distance, shadows, lighting, antialiasing, tree style presets

### 🌍 Biome System (NEW!)
- **6 Unique Biomes**: Plains, Forest, Sakura Forest, Desert, Mountains, Ocean
- **Voronoi-based Generation**: Organic biome boundaries with noise-based blending
- **Guaranteed Variety**: At least one of each biome type per world
- **Biome-specific Features**: Different tree densities, terrain heights, and surface blocks

### 🏗️ World Generation
- **Async Incremental Loading**: Smooth world generation with animated loading screen
- **Large World Support**: 301x301 block worlds (3x larger than original)
- **Structure Collision Prevention**: Trees and buildings never overlap
- **Progress Visualization**: Fun loading screen with tips, biome previews, and progress bars

### 🎮 Core Gameplay
- **Procedural World Generation**: Unique worlds with varied terrain, water bodies, trees, and structures
- **Building System**: Place and break multiple block types
- **Inventory & Crafting**: Manage items across hotbar and inventory slots
- **Survival Elements**: Defend against pest birds, collect ritual items, complete the Omamori blessing
- **NPC System**: Gunsmith (sells KA-69, repairs weapons), dialogue system with quests

### 🌸 Aesthetic Features
- **Cherry Blossom Theme**: Beautiful pink sakura trees in dedicated biomes
- **Falling Petal Particles**: Atmospheric particle effects
- **Wind Animation**: Leaves rustle in the wind (Fancy + Wind mode)
- **Japanese-Inspired Design**: Authentic aesthetic with cultural elements

## 🚀 Quick Start

### Development

```bash
# Clone the repository
git clone https://github.com/geket/sakuracraft-ts.git
cd sakuracraft-ts

# Install dependencies
npm install

# Start development server
npm run dev
# Game runs at http://localhost:3000
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Type check without building
npm run type-check
```

### Deployment

```bash
# Push to main branch triggers automatic deployment
git push origin main

# GitHub Actions automatically:
# 1. Builds the game
# 2. Deploys to GitHub Pages
# 3. Live at https://geket.github.io/games/sakuracraft/
```

## 🎯 Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| SPACE | Jump / Swim up |
| SHIFT | Sneak / Swim down |
| LEFT CLICK | Break block |
| RIGHT CLICK | Place block / Use |
| E | Open inventory |
| Q | Drop item |
| R | Ritual menu |
| SCROLL | Change hotbar slot |
| ` (backtick) | Debug console |
| ESC | Pause menu |

## ⚙️ Graphics Settings

Access via ESC → Options:

| Setting | Options |
|---------|---------|
| **Brightness** | 50-150% |
| **Color Filter** | Normal, Sepia, B&W, Trippy |
| **Render Distance** | Near, Medium, Far, Ultra |
| **Shadows** | On/Off |
| **Enhanced Lighting** | On/Off |
| **Anti-Aliasing** | On/Off |
| **Tree Style** | Simple (Fast), Fancy, Fancy + Wind |
| **Target FPS** | 15-240 |

### Tree Style Modes

- **Simple (Fast)**: Opaque leaves, best performance
- **Fancy**: Internal leaf faces rendered for depth (like Minecraft)
- **Fancy + Wind**: Fancy mode + animated wind rustling effect

## 🏗️ Project Structure

```
sakuracraft-ts/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD automation
├── src/
│   ├── main.ts                 # Entry point
│   ├── index.ts                # Game initialization
│   ├── game/
│   │   └── SakuraCraftGame.ts  # Main game engine (11,000+ lines)
│   ├── styles/
│   │   └── game.css            # Game styling
│   └── types/
│       └── index.ts            # TypeScript definitions
├── dist/                       # Production build output
├── index.html                  # Entry HTML
├── package.json
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite bundler config
└── README.md
```

## 📊 Performance

### Bundle Size

| Build | Size (Gzipped) |
|-------|----------------|
| Main JS | ~55 KB |
| CSS | ~3.6 KB |
| Total | ~60 KB |

### Runtime Performance

- 🎯 Target: 60 FPS
- ⚡ Average: 55-60 FPS
- 📊 Memory: ~50-100 MB
- 🌍 World Size: 301x301 blocks

## 🗺️ Roadmap

### Phase 1: Core ✅
- [x] TypeScript setup with relaxed/strict modes
- [x] Polished painter's algorithm
- [x] Debug rendering tools
- [x] CI/CD automation
- [x] Optimized bundling

### Phase 2: World Generation ✅
- [x] Biome system (6 biomes)
- [x] Async incremental world generation
- [x] Loading screen with progress
- [x] Structure collision prevention
- [x] Larger world support (3x)

### Phase 3: Rendering ✅
- [x] Fancy leaf rendering (Minecraft-style)
- [x] Wind animation for leaves
- [x] Tree style presets in settings
- [x] Transparent block rendering fixes
- [x] Face culling optimization

### Phase 4: Gameplay ✅
- [x] NPC system (Gunsmith)
- [x] Dialogue & quest UI
- [x] Weapon durability system
- [x] Repair mechanics
- [x] Ground collision fixes

### Phase 5: Enhancement 🚧
- [ ] More biomes (Swamp, Tundra, Jungle)
- [ ] Day/night cycle
- [ ] Weather system
- [ ] More NPC types
- [ ] Multiplayer support (WebRTC)
- [ ] Mobile/touch controls

### Phase 6: Content 📋
- [ ] More block types
- [ ] Extended crafting recipes
- [ ] Dungeons & caves
- [ ] Boss encounters
- [ ] Achievement system

### Phase 7: Polish 🎨
- [ ] Shader effects
- [ ] Advanced particles
- [ ] Sound system
- [ ] Music integration
- [ ] Localization

## 🔧 Debug Commands

Open debug console with ` (backtick):

```
help              - Show all commands
tp <x> <y> <z>    - Teleport to coordinates
give <item> [n]   - Give item
spawn <mob>       - Spawn entity
time <set/add>    - Control time
render <mode>     - Switch render mode (painter/zbuffer/bsp)
render treediag   - Tree diagnostic overlay
render heatmap    - Performance heatmap
render stats      - Rendering statistics
biome             - Show current biome
pos               - Show current position
```

## 🛠️ Technical Highlights

### Biome Generation
- Voronoi-based region assignment with noise-smoothed boundaries
- Guaranteed placement of all biome types via quadrant seeding
- Height modifiers per biome (mountains: +12, ocean: -8)
- Biome-aware tree and structure spawning

### Async World Generation
- Non-blocking generation with `async/await`
- UI updates via `setTimeout(resolve, 0)` yielding
- Progress tracking across 9 generation phases
- Animated loading screen with tips

### Leaf Rendering
- "Fancy" mode renders internal faces between adjacent leaves
- Proper face culling: hide only when adjacent to opaque blocks
- Wind animation via multi-frequency sine wave vertex displacement
- Configurable transparency (75% alpha in fancy modes)

### Structure Placement
- AABB collision detection before placement
- Buildings check for existing blocks (trees) before spawning
- Trees check for existing structures before spawning
- Incremental placement with UI feedback

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update documentation if needed
5. Submit a pull request

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Credits

**Built with:**
- TypeScript - Type-safe JavaScript
- Vite - Fast build tool
- Canvas API - 2D rendering
- GitHub Actions - CI/CD automation

**Inspired by:**
- Minecraft - Block-based gameplay & graphics modes
- Japanese aesthetics - Cherry blossom theme
- Retro pixel art - Visual style

**Special Thanks:**
- Claude (Anthropic) - Development assistance
- The open source community

---

Built with ❤️, 🌸, and TypeScript

**Play now:** https://geket.github.io/games/sakuracraft/