/**
 * SakuraCraft - A voxel-based browser game with cherry blossom aesthetics
 * 
 * @module SakuraCraft
 * @example
 * // ES Module usage
 * import SakuraCraft from 'sakuracraft';
 * const game = new SakuraCraft();
 * game.init({ trigger: '#playButton' });
 */

import { SakuraCraftGame, minecraftGame } from './game/SakuraCraftGame';

// Re-export types
export type * from './types';

// Export the game class and raw engine
export { SakuraCraftGame, minecraftGame };

// Default export is the class
export default SakuraCraftGame;

// Auto-expose to window in browser context
declare global {
  interface Window {
    SakuraCraft: typeof SakuraCraftGame;
    SakuraCraftGame: typeof SakuraCraftGame;
    sakuraCraft?: SakuraCraftGame;
  }
}

if (typeof window !== 'undefined') {
  window.SakuraCraft = SakuraCraftGame;
  window.SakuraCraftGame = SakuraCraftGame;
  
  // Auto-initialize if script has data-auto-init attribute
  const currentScript = document.currentScript as HTMLScriptElement | null;
  if (currentScript?.hasAttribute('data-auto-init')) {
    const trigger = currentScript.getAttribute('data-trigger');
    document.addEventListener('DOMContentLoaded', () => {
      const game = new SakuraCraftGame();
      game.init({ trigger: trigger ?? undefined });
      window.sakuraCraft = game;
    });
  }
}
