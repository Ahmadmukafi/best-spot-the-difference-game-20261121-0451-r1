// Keyboard and mouse input, read once a frame. Clicks arrive as logical
// coordinates; keys arrive as named actions the world consumes.
export const ACTION_CONFIRM = 1;
export const ACTION_HINT = 2;
export const ACTION_RESTART = 4;
export const ACTION_NEXT = 8;
export const ACTION_SCENE_1 = 16;
export const ACTION_SCENE_2 = 32;
export const ACTION_SCENE_3 = 64;

export function createInput(canvas, toLogical) {
  let actions = 0;
  const clicks = [];

  function keyToAction(key) {
    const k = key.toLowerCase();
    if (k === ' ' || k === 'enter') return ACTION_CONFIRM;
    if (k === 'h') return ACTION_HINT;
    if (k === 'r') return ACTION_RESTART;
    if (k === 'n') return ACTION_NEXT;
    if (k === '1') return ACTION_SCENE_1;
    if (k === '2') return ACTION_SCENE_2;
    if (k === '3') return ACTION_SCENE_3;
    return 0;
  }

  window.addEventListener('keydown', (event) => {
    const action = keyToAction(event.key);
    if (action) {
      actions |= action;
      event.preventDefault();
    }
  });

  canvas.addEventListener('pointerdown', (event) => {
    const point = toLogical(event.clientX, event.clientY);
    if (point) clicks.push(point);
  });

  return {
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
    takeClicks() {
      return clicks.splice(0, clicks.length);
    },
  };
}
