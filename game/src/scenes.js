// The three scenes in play order: the market is the easiest hunt, the sawah the
// hardest. Each scene module owns its art and its seven differences.
import * as market from './scene-market.js';
import * as batik from './scene-batik.js';
import * as sawah from './scene-sawah.js';

export const SCENES = [market, batik, sawah];

export function sceneCount() {
  return SCENES.length;
}

export function diffCount(sceneIndex) {
  return SCENES[sceneIndex].DIFFS.length;
}
