// The screenshot scenes behind ?shot=cover|batik|sawah|win. Each one sets the
// real world to a fixed mid-play state — a scene, a few differences already
// found with their gold rings, several still unfound, the counter and the timer
// showing — then paints it twice and sets window.__shotReady for a screenshot.
// Nothing here is a mock: every frame is the game's own render of its own state.
import { SCREEN_PLAY, SCREEN_SCENE_CLEAR } from './world.js';

/** Found sets the cover shots show, chosen so the rings frame the scene. */
const FOUND = {
  cover: [0, 2, 4],
  batik: [1, 5],
  sawah: [0, 3, 4, 6],
};

export function stageShot(name, world) {
  const state = world.state;
  if (name === 'batik') {
    world.startScene(1);
    for (const i of FOUND.batik) state.found.add(i);
    state.score = 200;
    state.elapsed = 74;
    state.hintsLeft = 2;
    return { screen: SCREEN_PLAY };
  }
  if (name === 'sawah') {
    world.startScene(2);
    for (const i of FOUND.sawah) state.found.add(i);
    state.score = 400;
    state.elapsed = 131;
    state.hintsLeft = 1;
    return { screen: SCREEN_PLAY };
  }
  if (name === 'win') {
    world.startScene(0);
    for (let i = 0; i < 7; i += 1) state.found.add(i);
    state.score = 880;
    state.totalScore = 880;
    state.elapsed = 96;
    state.screen = SCREEN_SCENE_CLEAR;
    return { screen: SCREEN_SCENE_CLEAR };
  }
  // cover: the night market, three found, the hint lantern glowing near an
  // unfound difference, four still hidden.
  world.startScene(0);
  for (const i of FOUND.cover) state.found.add(i);
  state.score = 290;
  state.elapsed = 47;
  state.hintsLeft = 2;
  state.hint = { diffIndex: 1, age: 1.2 };
  return { screen: SCREEN_PLAY };
}
