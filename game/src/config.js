// Every tuning number and colour in one place. The playfield is a fixed 1280x720
// logical area; the renderer scales it to the window, so no rule below depends
// on the screen size.
export const FIELD = { width: 1280, height: 720 };

/** Header bar (title, counter, timer, score, hint button). */
export const HEADER = { height: 68 };

/** The two picture panels, side by side. */
export const PANEL = { width: 600, height: 560, y: 76, leftX: 16, rightX: 664 };

/** Footer strip (scene dots, controls, best score). */
export const FOOTER = { y: 644, height: 76 };

/** How close a click must land to a difference to count, in panel pixels. */
export const CLICK_RADIUS = 36;

/** Points for a find, penalty for a wrong click, cost of one hint. */
export const SCORE = { find: 100, wrong: -10, hint: -25, clearBonusPerSecond: 2, clearBonusCap: 300 };

/** Hints per scene, and how long a hint glow lasts, in seconds. */
export const HINT = { perScene: 3, glowSeconds: 4 };

/** The simulation's fixed step, in seconds. */
export const STEP = 1 / 60;

export const PALETTE = {
  backdrop: '#14101f',
  header: '#1d1533',
  headerLine: '#3a2a63',
  gold: '#ffd54a',
  goldDim: '#b98a1e',
  panelBorder: '#ffd54a',
  text: '#f5efe0',
  muted: '#b8aed6',
  found: '#ffd54a',
  wrong: '#ff5a4e',
  hintGlow: '#ffb52e',
  footer: '#1d1533',
  overlay: 'rgba(12, 8, 24, 0.82)',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best total score is kept between visits (this browser only). */
export const BEST_KEY = 'pasar-malam-spot.best';
