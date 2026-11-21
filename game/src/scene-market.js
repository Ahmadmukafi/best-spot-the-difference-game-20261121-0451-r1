// Scene 1 — PASAR MALAM, an Indonesian night market after dusk: string lights,
// a satay cart, a lantern stall and a balloon seller under a crescent moon.
// `side` 0 draws the left panel, 1 the right panel; the seven differences are
// the only things that change between them.
import { bulbString, circle, lantern, rr, star } from './art.js';

export const NAME = 'Pasar Malam';
export const TAGLINE = 'Pasar malam di bawah bulan sabit — cari 7 perbedaan!';

export const DIFFS = [
  { x: 90, y: 80, r: 42, label: 'bulan' },
  { x: 310, y: 272, r: 28, label: 'lampion' },
  { x: 500, y: 118, r: 42, label: 'balon' },
  { x: 120, y: 302, r: 32, label: 'sate' },
  { x: 330, y: 482, r: 32, label: 'kucing' },
  { x: 125, y: 238, r: 28, label: 'harga' },
  { x: 300, y: 55, r: 20, label: 'lampu' },
];

function drawSky(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#171233');
  sky.addColorStop(0.55, '#3b1f5e');
  sky.addColorStop(1, '#7a2d5e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 420);
  star(ctx, 200, 60, 4, 4, '#ffe9a8');
  star(ctx, 430, 40, 3, 4, '#ffe9a8');
  star(ctx, 520, 90, 3, 4, '#ffe9a8');
  star(ctx, 40, 130, 3, 4, '#ffe9a8');
  star(ctx, 280, 30, 2.5, 4, '#ffe9a8');
  star(ctx, 570, 150, 2.5, 4, '#ffe9a8');
}

function drawMoon(ctx, side) {
  if (side === 0) {
    circle(ctx, 90, 80, 34, '#ffe9a8');
    circle(ctx, 102, 72, 30, '#3b1f5e');
  } else {
    circle(ctx, 90, 80, 34, '#ffe9a8');
    ctx.fillStyle = 'rgba(210, 170, 90, 0.5)';
    circle(ctx, 78, 72, 6, 'rgba(210, 170, 90, 0.5)');
    circle(ctx, 100, 92, 4, 'rgba(210, 170, 90, 0.5)');
  }
}

function drawGround(ctx) {
  ctx.fillStyle = '#241a33';
  ctx.fillRect(0, 420, 600, 140);
  ctx.fillStyle = '#2e2142';
  for (let x = 10; x < 600; x += 46) {
    for (let y = 436; y < 556; y += 30) {
      ctx.fillRect(x + ((y / 30) % 2) * 20, y, 26, 4);
    }
  }
}

function drawSatayCart(ctx, side) {
  // Awning
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(30, 210); ctx.lineTo(220, 210); ctx.lineTo(210, 240); ctx.lineTo(40, 240);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f5efe0';
  for (let x = 55; x < 210; x += 36) ctx.fillRect(x, 210, 18, 30);
  // Cart body
  ctx.fillStyle = '#7a4a21';
  rr(ctx, 44, 300, 160, 90, 8); ctx.fill();
  ctx.fillStyle = '#5b3517';
  rr(ctx, 44, 300, 160, 18, 8); ctx.fill();
  // Grill with skewers
  ctx.fillStyle = '#3a3a44';
  ctx.fillRect(60, 282, 128, 20);
  const skewers = side === 0 ? 3 : 2;
  for (let i = 0; i < skewers; i += 1) {
    ctx.strokeStyle = '#d8cfc0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(72 + i * 42, 292); ctx.lineTo(112 + i * 42, 292);
    ctx.stroke();
    ctx.fillStyle = '#c97b2e';
    for (let k = 0; k < 3; k += 1) circle(ctx, 80 + i * 42 + k * 12, 292, 5, '#c97b2e');
  }
  // Smoke
  ctx.strokeStyle = 'rgba(220, 220, 220, 0.5)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(120, 272);
  ctx.quadraticCurveTo(110, 250, 126, 232);
  ctx.quadraticCurveTo(138, 218, 128, 204);
  ctx.stroke();
  // Wheels
  circle(ctx, 70, 396, 16, '#2b2b2b');
  circle(ctx, 178, 396, 16, '#2b2b2b');
  // Price sign: 10K on the left, 15K on the right
  ctx.fillStyle = '#f5efe0';
  rr(ctx, 84, 222, 84, 34, 6); ctx.fill();
  ctx.fillStyle = '#c0392b';
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(side === 0 ? 'SATE 10K' : 'SATE 15K', 126, 240);
}

function drawLanternStall(ctx, side) {
  // Stall frame and roof
  ctx.fillStyle = '#8e2f4f';
  ctx.beginPath();
  ctx.moveTo(236, 210); ctx.lineTo(386, 210); ctx.lineTo(376, 240); ctx.lineTo(246, 240);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5b1f33';
  ctx.fillRect(242, 240, 8, 150);
  ctx.fillRect(368, 240, 8, 150);
  // Hanging lanterns; the middle one is red on the left, green on the right
  const colors = ['#e74c3c', '#f39c12', '#e74c3c', '#f39c12', '#e74c3c'];
  for (let i = 0; i < 5; i += 1) {
    const lx = 258 + i * 26;
    ctx.strokeStyle = '#2c2140';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(lx, 240); ctx.lineTo(lx, 258); ctx.stroke();
    let color = colors[i];
    if (i === 2 && side === 1) color = '#27ae60';
    lantern(ctx, lx, 272, 13, color, true);
  }
  // Table with lanterns for sale
  ctx.fillStyle = '#7a4a21';
  rr(ctx, 246, 330, 130, 60, 8); ctx.fill();
  lantern(ctx, 272, 322, 12, '#e74c3c', true);
  lantern(ctx, 306, 322, 12, '#f39c12', true);
  lantern(ctx, 340, 322, 12, '#e74c3c', true);
  ctx.fillStyle = '#f5efe0';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LENTERA', 311, 382);
}

function drawBalloonStall(ctx, side) {
  // Stand and crate of oranges
  ctx.fillStyle = '#7a4a21';
  rr(ctx, 428, 380, 140, 60, 8); ctx.fill();
  for (let i = 0; i < 6; i += 1) {
    circle(ctx, 448 + (i % 3) * 24, 396 + Math.floor(i / 3) * 18, 9, '#f39c12');
  }
  ctx.fillStyle = '#2f7d32';
  ctx.fillRect(448, 388, 10, 5);
  // Balloon bunch: five on the left, four on the right
  const balloons = [
    { x: 470, y: 110, c: '#e74c3c' },
    { x: 500, y: 92, c: '#f39c12' },
    { x: 530, y: 112, c: '#3498db' },
    { x: 486, y: 140, c: '#9b59b6' },
    { x: 516, y: 142, c: '#27ae60' },
  ];
  const shown = side === 0 ? balloons : balloons.slice(0, 4);
  ctx.strokeStyle = '#d8cfc0';
  ctx.lineWidth = 1.5;
  for (const b of shown) {
    ctx.beginPath(); ctx.moveTo(b.x, b.y + 18); ctx.lineTo(500, 300); ctx.stroke();
  }
  for (const b of shown) {
    ctx.fillStyle = b.c;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, 17, 21, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(b.x - 6, b.y - 8, 4, 7, -0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f5efe0';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BALON', 498, 432);
}

function drawCat(ctx, side) {
  if (side === 1) return;
  ctx.fillStyle = '#171226';
  ctx.beginPath();
  ctx.ellipse(330, 500, 22, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, 330, 472, 13, '#171226');
  ctx.beginPath();
  ctx.moveTo(320, 462); ctx.lineTo(318, 448); ctx.lineTo(328, 458);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(340, 462); ctx.lineTo(342, 448); ctx.lineTo(332, 458);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#171226';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(350, 506);
  ctx.quadraticCurveTo(372, 500, 366, 478);
  ctx.stroke();
  ctx.fillStyle = '#ffd54a';
  circle(ctx, 325, 470, 2, '#ffd54a');
  circle(ctx, 335, 470, 2, '#ffd54a');
}

export function draw(ctx, side, t) {
  drawSky(ctx);
  drawMoon(ctx, side);
  drawGround(ctx);
  drawSatayCart(ctx, side);
  drawLanternStall(ctx, side);
  drawBalloonStall(ctx, side);
  drawCat(ctx, side);
  // String lights across the top; bulb 7 (index 6) is dark on the right panel
  bulbString(ctx, 0, 34, 600, 34, 13, 26, side === 1 ? new Set([6]) : new Set());
  void t;
}
