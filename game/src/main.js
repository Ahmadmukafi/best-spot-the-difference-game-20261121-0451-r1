// Boot and the one loop: input is read every frame, the world advances in fixed
// 1/60 s steps, and the renderer paints what is there. The game moves between
// four screens: title, play, scene clear and all clear.
//
// ?shot=cover|batik|sawah|win (with &seed=N) stages that scene instead of
// running the loop, paints it twice and sets window.__shotReady for a screenshot.
import { FIELD, STEP } from './config.js';
import { createWorld, SCREEN_ALL_CLEAR, SCREEN_PLAY, SCREEN_SCENE_CLEAR, SCREEN_TITLE } from './world.js';
import {
  ACTION_CONFIRM,
  ACTION_HINT,
  ACTION_NEXT,
  ACTION_RESTART,
  ACTION_SCENE_1,
  ACTION_SCENE_2,
  ACTION_SCENE_3,
  createInput,
} from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';
import { unlockSound } from './sound.js';

/** The longest frame the loop catches up on; a longer stall is dropped. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld();
const renderer = createRenderer(canvas);

/** The canvas is a fixed 1280x720 logical area scaled to the window. */
function fitCanvas() {
  const scale = Math.min(window.innerWidth / FIELD.width, window.innerHeight / FIELD.height);
  canvas.width = FIELD.width;
  canvas.height = FIELD.height;
  canvas.style.width = `${Math.floor(FIELD.width * scale)}px`;
  canvas.style.height = `${Math.floor(FIELD.height * scale)}px`;
}

function toLogical(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  return {
    x: ((clientX - rect.left) / rect.width) * FIELD.width,
    y: ((clientY - rect.top) / rect.height) * FIELD.height,
  };
}

function runShot(name) {
  fitCanvas();
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world.state, scene.screen);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  fitCanvas();
  window.addEventListener('resize', fitCanvas);
  const input = createInput(canvas, toLogical);
  let screen = SCREEN_TITLE;
  let accumulator = 0;
  let last = performance.now();

  // Screen readers (and anyone watching the page's text) hear the screen
  // changes and each find.
  function announce(message) {
    status.textContent = message;
  }

  function handleActions() {
    const actions = input.takeActions();
    if (actions) unlockSound();
    if (actions & ACTION_CONFIRM && (screen === SCREEN_TITLE || screen === SCREEN_ALL_CLEAR)) {
      world.startGame();
      screen = SCREEN_PLAY;
      announce('Bermain. Cari 7 perbedaan di tiap adegan.');
    } else if (actions & ACTION_HINT && screen === SCREEN_PLAY) {
      world.useHint();
    } else if (actions & ACTION_RESTART && (screen === SCREEN_PLAY || screen === SCREEN_ALL_CLEAR)) {
      world.restart();
      screen = SCREEN_PLAY;
      announce('Adegan diulang.');
    } else if (actions & ACTION_NEXT && screen === SCREEN_SCENE_CLEAR) {
      world.nextScene();
      screen = SCREEN_PLAY;
      announce('Adegan berikut.');
    } else if (actions & ACTION_SCENE_1 && screen !== SCREEN_TITLE) {
      world.startScene(0);
      screen = SCREEN_PLAY;
    } else if (actions & ACTION_SCENE_2 && screen !== SCREEN_TITLE) {
      world.startScene(1);
      screen = SCREEN_PLAY;
    } else if (actions & ACTION_SCENE_3 && screen !== SCREEN_TITLE) {
      world.startScene(2);
      screen = SCREEN_PLAY;
    }
    for (const point of input.takeClicks()) {
      unlockSound();
      if (screen === SCREEN_TITLE) {
        world.startGame();
        screen = SCREEN_PLAY;
        announce('Bermain. Cari 7 perbedaan di tiap adegan.');
      } else if (screen === SCREEN_SCENE_CLEAR) {
        world.nextScene();
        screen = SCREEN_PLAY;
      } else if (screen === SCREEN_ALL_CLEAR) {
        world.startGame();
        screen = SCREEN_PLAY;
      } else {
        world.click(point);
        screen = world.state.screen;
        if (world.state.screen === SCREEN_SCENE_CLEAR) announce('Adegan selesai! Tekan N untuk lanjut.');
        else if (world.state.screen === SCREEN_ALL_CLEAR) announce(`Menang! Skor akhir ${world.state.totalScore}.`);
        else announce(`Ditemukan ${world.state.found.size} dari 7.`);
      }
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    while (accumulator >= STEP) {
      world.step(STEP);
      accumulator -= STEP;
    }
    renderer.draw(world.state, screen);
  }

  // Leaving the tab pauses nothing (the clock is generous), but the title
  // screen is where a returning player lands.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) announce('Jeda: kembali kapan saja, waktumu tetap jalan.');
  });

  announce('Cari Perbedaannya. Klik atau tekan Spasi untuk mulai.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
