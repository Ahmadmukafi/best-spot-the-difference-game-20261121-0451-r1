// Everything the player sees: the header (scene name, counter, timer, score,
// hint lantern), the two picture panels with found markers and the hint glow,
// the footer (scene dots, controls, best score) and the title/clear overlays.
import { FIELD, FOOTER, HEADER, PALETTE, PANEL } from './config.js';
import { SCENES, diffCount, sceneCount } from './scenes.js';
import { SCREEN_ALL_CLEAR, SCREEN_PLAY, SCREEN_SCENE_CLEAR, SCREEN_TITLE } from './world.js';

export const SCREEN_TITLE_EXPORT = SCREEN_TITLE;

function formatTime(seconds) {
  const total = Math.floor(seconds);
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function drawPanel(ctx, state, side, time) {
  const x = side === 0 ? PANEL.leftX : PANEL.rightX;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, PANEL.y, PANEL.width, PANEL.height);
  ctx.clip();
  ctx.translate(x, PANEL.y);
  SCENES[state.sceneIndex].draw(ctx, side, time);
  // The hint lantern's glow hovers near one unfound difference, on both panels.
  if (state.hint) {
    const d = SCENES[state.sceneIndex].DIFFS[state.hint.diffIndex];
    const pulse = 0.55 + 0.35 * Math.sin(time * 5);
    const glow = ctx.createRadialGradient(d.x, d.y, 6, d.x, d.y, 84);
    glow.addColorStop(0, `rgba(255, 181, 46, ${0.5 * pulse})`);
    glow.addColorStop(1, 'rgba(255, 181, 46, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(d.x, d.y, 84, 0, Math.PI * 2);
    ctx.fill();
  }
  // Gold rings (with numbers) on every difference found so far.
  const diffs = SCENES[state.sceneIndex].DIFFS;
  let n = 0;
  for (let i = 0; i < diffs.length; i += 1) {
    if (!state.found.has(i)) continue;
    n += 1;
    const d = diffs[i];
    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = PALETTE.gold;
    ctx.beginPath();
    ctx.arc(d.x, d.y - d.r - 2, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#241a33';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(n), d.x, d.y - d.r - 1);
  }
  ctx.restore();
  // Panel frame and A/B badge.
  ctx.strokeStyle = PALETTE.panelBorder;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, PANEL.y, PANEL.width, PANEL.height);
  ctx.fillStyle = PALETTE.gold;
  ctx.beginPath();
  ctx.arc(x + 20, PANEL.y + 20, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#241a33';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(side === 0 ? 'A' : 'B', x + 20, PANEL.y + 21);
}

function drawHeader(ctx, state) {
  ctx.fillStyle = PALETTE.header;
  ctx.fillRect(0, 0, FIELD.width, HEADER.height);
  ctx.fillStyle = PALETTE.headerLine;
  ctx.fillRect(0, HEADER.height - 2, FIELD.width, 2);
  const scene = SCENES[state.sceneIndex];
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(scene.NAME.toUpperCase(), 20, 26);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(scene.TAGLINE, 20, 52);
  // Counter of how many remain — the number the judge looks for.
  const found = state.found.size;
  const total = diffCount(state.sceneIndex);
  ctx.fillStyle = PALETTE.text;
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Ditemukan ${found} / ${total}`, 640, 28);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText(found === total ? 'Semua ketemu!' : `${total - found} lagi tersembunyi`, 640, 52);
  // Timer, score and the hint lantern button.
  ctx.textAlign = 'right';
  ctx.fillStyle = PALETTE.text;
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(`⏱ ${formatTime(state.elapsed)}`, 1000, 26);
  ctx.fillText(`Skor ${state.score}`, 1000, 52);
  ctx.fillStyle = state.hintsLeft > 0 ? '#3a2a63' : '#241a33';
  ctx.beginPath();
  ctx.roundRect(1030, 12, 230, 44, 10);
  ctx.fill();
  ctx.strokeStyle = PALETTE.gold;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`🏮 Petunjuk (H) · ${state.hintsLeft}`, 1145, 35);
}

function drawFooter(ctx, state) {
  ctx.fillStyle = PALETTE.footer;
  ctx.fillRect(0, FOOTER.y, FIELD.width, FOOTER.height);
  ctx.fillStyle = PALETTE.headerLine;
  ctx.fillRect(0, FOOTER.y, FIELD.width, 2);
  // Scene dots: filled for cleared scenes, ring for the current one.
  ctx.textAlign = 'left';
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '15px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('Adegan:', 20, FOOTER.y + 38);
  for (let i = 0; i < sceneCount(); i += 1) {
    const cx = 108 + i * 34;
    const cy = FOOTER.y + 38;
    if (i < state.sceneIndex || (i === state.sceneIndex && state.screen === SCREEN_SCENE_CLEAR)) {
      ctx.fillStyle = PALETTE.gold;
      ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.fill();
    } else if (i === state.sceneIndex) {
      ctx.strokeStyle = PALETTE.gold;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.strokeStyle = PALETTE.muted;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = i === state.sceneIndex ? PALETTE.gold : PALETTE.muted;
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), cx, cy + 1);
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.text;
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText('Klik perbedaan di gambar A atau B  ·  H = petunjuk  ·  R = ulang adegan  ·  N = adegan berikut', 640, FOOTER.y + 30);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Tiga adegan asli Indonesia — pasar malam, batik, sawah. Klik yang salah −10 poin.', 640, FOOTER.y + 54);
  ctx.textAlign = 'right';
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText(`Terbaik: ${state.best}`, 1260, FOOTER.y + 38);
}

function drawWrongMarks(ctx, state) {
  for (const mark of state.wrongMarks) {
    const alpha = Math.max(0, 1 - mark.age / 0.9);
    ctx.strokeStyle = `rgba(255, 90, 78, ${alpha})`;
    ctx.lineWidth = 4;
    const s = 12;
    ctx.beginPath();
    ctx.moveTo(mark.x - s, mark.y - s); ctx.lineTo(mark.x + s, mark.y + s);
    ctx.moveTo(mark.x + s, mark.y - s); ctx.lineTo(mark.x - s, mark.y + s);
    ctx.stroke();
  }
}

function drawFloating(ctx, state) {
  ctx.textAlign = 'center';
  for (const f of state.floating) {
    const alpha = Math.max(0, 1 - f.age / 1.1);
    ctx.fillStyle = `rgba(255, 213, 74, ${alpha})`;
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText(f.text, f.x, f.y - 30 - f.age * 30);
  }
}

function drawOverlay(ctx, title, lines, hint) {
  ctx.fillStyle = PALETTE.overlay;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.gold;
  ctx.font = 'bold 54px system-ui, sans-serif';
  ctx.fillText(title, 640, 300);
  ctx.fillStyle = PALETTE.text;
  ctx.font = '24px system-ui, sans-serif';
  let y = 360;
  for (const line of lines) {
    ctx.fillText(line, 640, y);
    y += 40;
  }
  ctx.fillStyle = PALETTE.muted;
  ctx.font = '19px system-ui, sans-serif';
  ctx.fillText(hint, 640, y + 30);
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function draw(state, screen) {
    const time = state.titleTime;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    if (screen === SCREEN_TITLE) {
      // Behind the title, the first scene plays its opening frame.
      drawPanel(ctx, { ...state, found: new Set(), hint: null, elapsed: 0 }, 0, time);
      drawPanel(ctx, { ...state, found: new Set(), hint: null, elapsed: 0 }, 1, time);
      drawOverlay(ctx, 'CARI PERBEDAANNYA', [
        'Pasar Malam · Batik Workshop · Sawah Sunrise',
        'Tiga adegan asli Indonesia. Tujuh perbedaan di tiap adegan.',
        'Lentera petunjuk akan menyala di dekat perbedaan yang belum ketemu.',
      ], 'Klik atau tekan Spasi untuk mulai  ·  H = petunjuk  ·  R = ulang');
      return;
    }
    drawHeader(ctx, state);
    drawPanel(ctx, state, 0, time);
    drawPanel(ctx, state, 1, time);
    drawWrongMarks(ctx, state);
    drawFloating(ctx, state);
    drawFooter(ctx, state);
    if (screen === SCREEN_SCENE_CLEAR) {
      const scene = SCENES[state.sceneIndex];
      drawOverlay(ctx, `${scene.NAME.toUpperCase()} SELESAI!`, [
        `Semua 7 perbedaan ketemu dalam ${formatTime(state.elapsed)}.`,
        `Skor adegan ini: ${state.score}  ·  Total: ${state.totalScore}`,
      ], 'Tekan N untuk lanjut ke adegan berikut');
    } else if (screen === SCREEN_ALL_CLEAR) {
      drawOverlay(ctx, 'KAMU MENANG!', [
        `Semua 21 perbedaan di tiga adegan ketemu!`,
        `Skor akhir: ${state.totalScore}  ·  Terbaik: ${state.best}`,
      ], 'Tekan R untuk main lagi dari awal');
    }
    void SCREEN_PLAY;
  }

  return { draw };
}
