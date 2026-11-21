// The game's state: which scene, which differences are found, the clock, the
// score, the hint lantern and the screens. The world knows nothing about pixels
// except panel geometry from config.js.
import { BEST_KEY, CLICK_RADIUS, HINT, PANEL, SCORE } from './config.js';
import { SCENES, diffCount, sceneCount } from './scenes.js';
import { playClear, playFound, playHint, playWrong } from './sound.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_SCENE_CLEAR = 'sceneClear';
export const SCREEN_ALL_CLEAR = 'allClear';

export function createWorld() {
  const state = {
    screen: SCREEN_TITLE,
    sceneIndex: 0,
    found: new Set(),
    wrongMarks: [],
    floating: [],
    elapsed: 0,
    score: 0,
    totalScore: 0,
    hintsLeft: HINT.perScene,
    hint: null,
    best: 0,
    titleTime: 0,
  };

  function readBest() {
    try {
      return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
    } catch {
      return 0;
    }
  }

  function saveBest(value) {
    try {
      window.localStorage.setItem(BEST_KEY, String(value));
    } catch {
      // Storage can be off: the best score then lasts this visit only.
    }
  }

  state.best = readBest();

  function startScene(index) {
    state.sceneIndex = index;
    state.found = new Set();
    state.wrongMarks = [];
    state.floating = [];
    state.elapsed = 0;
    state.hintsLeft = HINT.perScene;
    state.hint = null;
    state.screen = SCREEN_PLAY;
  }

  function startGame() {
    state.totalScore = 0;
    state.score = 0;
    startScene(0);
  }

  function panelAt(x, y) {
    if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
    if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) {
      return { side: 0, x: x - PANEL.leftX, y: y - PANEL.y };
    }
    if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) {
      return { side: 1, x: x - PANEL.rightX, y: y - PANEL.y };
    }
    return null;
  }

  function nearestDiff(point) {
    const diffs = SCENES[state.sceneIndex].DIFFS;
    let bestIndex = -1;
    let bestDist = CLICK_RADIUS;
    for (let i = 0; i < diffs.length; i += 1) {
      if (state.found.has(i)) continue;
      const d = diffs[i];
      const dist = Math.hypot(point.x - d.x, point.y - d.y);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  function click(point) {
    if (state.screen !== SCREEN_PLAY) return;
    const panel = panelAt(point.x, point.y);
    if (!panel) return;
    const index = nearestDiff(panel);
    if (index >= 0) {
      state.found.add(index);
      state.score += SCORE.find;
      const d = SCENES[state.sceneIndex].DIFFS[index];
      state.floating.push({ x: panel.side === 0 ? PANEL.leftX + d.x : PANEL.rightX + d.x, y: PANEL.y + d.y, text: '+100', age: 0 });
      if (state.hint && state.hint.diffIndex === index) state.hint = null;
      playFound();
      if (state.found.size === diffCount(state.sceneIndex)) {
        const bonus = Math.min(SCORE.clearBonusCap, Math.max(0, SCORE.clearBonusCap - Math.floor(state.elapsed)) * SCORE.clearBonusPerSecond);
        state.score += bonus;
        state.totalScore += state.score;
        if (state.sceneIndex === sceneCount() - 1) {
          state.screen = SCREEN_ALL_CLEAR;
          if (state.totalScore > state.best) {
            state.best = state.totalScore;
            saveBest(state.best);
          }
        } else {
          state.screen = SCREEN_SCENE_CLEAR;
        }
        playClear();
      }
    } else {
      state.score = Math.max(0, state.score + SCORE.wrong);
      state.wrongMarks.push({ x: point.x, y: point.y, age: 0 });
      playWrong();
    }
  }

  function useHint() {
    if (state.screen !== SCREEN_PLAY) return;
    if (state.hintsLeft <= 0) return;
    const remaining = SCENES[state.sceneIndex].DIFFS.map((d, i) => i).filter((i) => !state.found.has(i));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    state.hint = { diffIndex: pick, age: 0 };
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score + SCORE.hint);
    playHint();
  }

  function nextScene() {
    if (state.screen === SCREEN_SCENE_CLEAR && state.sceneIndex < sceneCount() - 1) {
      startScene(state.sceneIndex + 1);
    }
  }

  function restart() {
    state.score = 0;
    startScene(state.sceneIndex);
  }

  function step(dt) {
    state.titleTime += dt;
    if (state.screen === SCREEN_PLAY) state.elapsed += dt;
    if (state.hint) {
      state.hint.age += dt;
      if (state.hint.age > HINT.glowSeconds) state.hint = null;
    }
    for (const mark of state.wrongMarks) mark.age += dt;
    state.wrongMarks = state.wrongMarks.filter((m) => m.age < 0.9);
    for (const f of state.floating) f.age += dt;
    state.floating = state.floating.filter((f) => f.age < 1.1);
  }

  return {
    state,
    startGame,
    startScene,
    click,
    useHint,
    nextScene,
    restart,
    step,
  };
}
