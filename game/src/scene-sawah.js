// Scene 3 — SAWAH SUNRISE: terraced rice fields at dawn, a farmer, a buffalo,
// kites overhead and a palm by the stream. Same contract as the other scenes:
// `side` 0 is the left panel, 1 the right panel.
import { buffalo, circle, farmer, kite, palm, rr } from './art.js';

export const NAME = 'Sawah Sunrise';
export const TAGLINE = 'Sawah di kala fajar — petani dan kerbau.';

export const DIFFS = [
  { x: 120, y: 120, r: 32, label: 'layang-layang' },
  { x: 430, y: 385, r: 30, label: 'tanduk' },
  { x: 150, y: 350, r: 28, label: 'topi' },
  { x: 480, y: 110, r: 42, label: 'matahari' },
  { x: 250, y: 70, r: 32, label: 'burung' },
  { x: 70, y: 192, r: 26, label: 'kelapa' },
  { x: 320, y: 502, r: 26, label: 'ikan' },
];

function drawSky(ctx, side) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#ff9a56');
  sky.addColorStop(0.5, '#ffb6a3');
  sky.addColorStop(1, '#ffe3c2');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 300);
  // Sun with rays: eight on the left, four on the right
  circle(ctx, 480, 110, 34, '#ffd54a');
  ctx.strokeStyle = '#f39c12';
  ctx.lineWidth = 4;
  const rays = side === 0 ? 8 : 4;
  for (let i = 0; i < rays; i += 1) {
    const a = (i / rays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(480 + Math.cos(a) * 42, 110 + Math.sin(a) * 42);
    ctx.lineTo(480 + Math.cos(a) * 56, 110 + Math.sin(a) * 56);
    ctx.stroke();
  }
  // Birds: three on the left, two on the right
  const birds = side === 0 ? [[220, 60], [260, 78], [300, 58]] : [[220, 60], [300, 58]];
  ctx.strokeStyle = '#5b4636';
  ctx.lineWidth = 3;
  for (const [bx, by] of birds) {
    ctx.beginPath();
    ctx.moveTo(bx - 10, by);
    ctx.quadraticCurveTo(bx - 4, by - 8, bx, by);
    ctx.quadraticCurveTo(bx + 4, by - 8, bx + 10, by);
    ctx.stroke();
  }
}

function drawTerraces(ctx) {
  // Distant hills
  ctx.fillStyle = '#a8c686';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(150, 220, 320, 292);
  ctx.quadraticCurveTo(460, 240, 600, 296);
  ctx.lineTo(600, 330); ctx.lineTo(0, 330);
  ctx.closePath(); ctx.fill();
  // Terrace bands
  const bands = [
    { y: 330, h: 70, c: '#7fb069' },
    { y: 400, h: 70, c: '#5d9b4a' },
    { y: 470, h: 90, c: '#4a8a3d' },
  ];
  for (const b of bands) {
    ctx.fillStyle = b.c;
    ctx.beginPath();
    ctx.moveTo(0, b.y);
    ctx.quadraticCurveTo(200, b.y - 26, 400, b.y);
    ctx.quadraticCurveTo(520, b.y, 600, b.y - 10);
    ctx.lineTo(600, b.y + b.h);
    ctx.lineTo(0, b.y + b.h);
    ctx.closePath(); ctx.fill();
    // Rice shoots
    ctx.strokeStyle = 'rgba(255, 255, 220, 0.55)';
    ctx.lineWidth = 2;
    for (let x = 24; x < 600; x += 44) {
      const yy = b.y + 34 + ((x / 44) % 2) * 12;
      ctx.beginPath();
      ctx.moveTo(x, yy); ctx.lineTo(x - 5, yy - 12);
      ctx.moveTo(x, yy); ctx.lineTo(x + 5, yy - 12);
      ctx.stroke();
    }
  }
  // Irrigation stream, lower right
  ctx.fillStyle = '#6ec6e8';
  ctx.beginPath();
  ctx.moveTo(240, 470);
  ctx.quadraticCurveTo(330, 500, 420, 520);
  ctx.quadraticCurveTo(500, 536, 600, 528);
  ctx.lineTo(600, 560);
  ctx.lineTo(280, 560);
  ctx.quadraticCurveTo(260, 520, 240, 470);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 510);
  ctx.quadraticCurveTo(380, 522, 470, 528);
  ctx.stroke();
}

function drawPalmAndKites(ctx, side) {
  palm(ctx, 60, 330, 150, side === 0 ? 3 : 2);
  // Kites: the big one is red on the left, blue on the right
  kite(ctx, 120, 120, 26, side === 0 ? '#e74c3c' : '#3498db');
  kite(ctx, 330, 90, 18, '#f39c12');
}

function drawFish(ctx, side) {
  if (side === 1) return;
  ctx.fillStyle = '#e67e22';
  ctx.beginPath();
  ctx.ellipse(320, 502, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(334, 502); ctx.lineTo(346, 494); ctx.lineTo(346, 510);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2b2b2b';
  circle(ctx, 312, 500, 2, '#2b2b2b');
}

export function draw(ctx, side, t) {
  drawSky(ctx, side);
  drawTerraces(ctx);
  drawPalmAndKites(ctx, side);
  farmer(ctx, 150, 420, 1.1, side === 0);
  buffalo(ctx, 400, 430, 1, 1, side === 0);
  drawFish(ctx, side);
  // A small scarecrow on the far terrace
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(540, 330, 5, 44);
  ctx.fillStyle = '#c0392b';
  rr(ctx, 524, 332, 38, 22, 6); ctx.fill();
  ctx.fillStyle = '#e8c96a';
  circle(ctx, 543, 322, 10, '#e8c96a');
  void t;
}
