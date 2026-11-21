// Scene 2 — BATIK WORKSHOP: a warm room where cloth dries on a line, wax pots
// steam, dye jars glow and a canting waits on the table. Same contract as the
// other scenes: `side` 0 is the left panel, 1 the right panel.
import { circle, lantern, rr } from './art.js';

export const NAME = 'Batik Workshop';
export const TAGLINE = 'Ruang batik — canting, malam, dan kain dijemur.';

export const DIFFS = [
  { x: 430, y: 382, r: 28, label: 'pewarna' },
  { x: 225, y: 245, r: 32, label: 'motif' },
  { x: 200, y: 332, r: 28, label: 'canting' },
  { x: 330, y: 262, r: 28, label: 'uap' },
  { x: 512, y: 92, r: 32, label: 'jendela' },
  { x: 150, y: 182, r: 26, label: 'cap' },
  { x: 480, y: 472, r: 24, label: 'benang' },
];

function drawRoom(ctx) {
  const wall = ctx.createLinearGradient(0, 0, 0, 560);
  wall.addColorStop(0, '#c89a68');
  wall.addColorStop(1, '#a9764a');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, 600, 560);
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(0, 430, 600, 130);
  ctx.fillStyle = '#7a4a28';
  for (let y = 452; y < 560; y += 26) ctx.fillRect(0, y, 600, 3);
  // Window on the right
  ctx.fillStyle = '#f5efe0';
  rr(ctx, 462, 40, 110, 130, 8); ctx.fill();
  ctx.fillStyle = '#7ec8e3';
  rr(ctx, 470, 48, 94, 114, 6); ctx.fill();
  ctx.strokeStyle = '#f5efe0';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(517, 48); ctx.lineTo(517, 162);
  ctx.moveTo(470, 105); ctx.lineTo(564, 105);
  ctx.stroke();
}

function drawWindowSky(ctx, side) {
  if (side === 0) {
    circle(ctx, 512, 92, 22, '#ffd54a');
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(512 + Math.cos(a) * 28, 92 + Math.sin(a) * 28);
      ctx.lineTo(512 + Math.cos(a) * 38, 92 + Math.sin(a) * 38);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = '#ffffff';
    circle(ctx, 500, 88, 16, '#ffffff');
    circle(ctx, 518, 80, 14, '#ffffff');
    circle(ctx, 530, 92, 13, '#ffffff');
    ctx.fillRect(492, 88, 46, 12);
  }
}

function drawClothesline(ctx, side) {
  ctx.strokeStyle = '#5b3a1e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, 190); ctx.lineTo(440, 190);
  ctx.stroke();
  // Cloth 1: parang diagonal stripes
  ctx.fillStyle = '#7a2d1e';
  ctx.fillRect(60, 190, 90, 110);
  ctx.strokeStyle = '#e8c96a';
  ctx.lineWidth = 4;
  for (let i = -2; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(60 + i * 26, 300);
    ctx.lineTo(86 + i * 26, 190);
    ctx.stroke();
  }
  // Cloth 2: kawung — circles on the left, diamonds on the right
  ctx.fillStyle = '#1e4a6b';
  ctx.fillRect(170, 190, 110, 110);
  ctx.fillStyle = '#e8c96a';
  if (side === 0) {
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 3; c += 1) circle(ctx, 196 + c * 30, 216 + r * 30, 11, '#e8c96a');
    }
  } else {
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 3; c += 1) {
        const cx = 196 + c * 30;
        const cy = 216 + r * 30;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 12); ctx.lineTo(cx + 12, cy); ctx.lineTo(cx, cy + 12); ctx.lineTo(cx - 12, cy);
        ctx.closePath(); ctx.fill();
      }
    }
  }
  // Cloth 3: mega mendung clouds
  ctx.fillStyle = '#2f6b4f';
  ctx.fillRect(300, 190, 110, 110);
  ctx.fillStyle = '#a8d8ea';
  for (let i = 0; i < 3; i += 1) {
    const cy = 216 + i * 30;
    ctx.beginPath();
    ctx.arc(330, cy, 16, Math.PI, 0);
    ctx.arc(356, cy, 12, Math.PI, 0);
    ctx.arc(382, cy, 16, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(314, cy, 84, 8);
  }
}

function drawCapStamp(ctx, side) {
  // A copper cap stamp hanging on the wall
  ctx.strokeStyle = '#5b3a1e';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(150, 60); ctx.lineTo(150, 130); ctx.stroke();
  ctx.fillStyle = '#b87333';
  circle(ctx, 150, 182, 34, '#b87333');
  ctx.fillStyle = '#7a4a21';
  circle(ctx, 150, 182, 26, '#7a4a21');
  ctx.fillStyle = '#e8c96a';
  if (side === 0) {
    // Four-point star
    ctx.beginPath();
    ctx.moveTo(150, 162); ctx.lineTo(156, 176); ctx.lineTo(170, 182);
    ctx.lineTo(156, 188); ctx.lineTo(150, 202); ctx.lineTo(144, 188);
    ctx.lineTo(130, 182); ctx.lineTo(144, 176);
    ctx.closePath(); ctx.fill();
  } else {
    // Five petals
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.ellipse(150 + Math.cos(a) * 12, 182 + Math.sin(a) * 12, 7, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    circle(ctx, 150, 182, 5, '#b87333');
  }
}

function drawTable(ctx, side) {
  // Work table
  ctx.fillStyle = '#6b4423';
  rr(ctx, 120, 330, 360, 26, 6); ctx.fill();
  ctx.fillStyle = '#5b3517';
  ctx.fillRect(140, 356, 14, 74);
  ctx.fillRect(446, 356, 14, 74);
  // Wax pot with steam (steam only on the left)
  ctx.fillStyle = '#3a3a44';
  ctx.beginPath();
  ctx.moveTo(300, 300); ctx.lineTo(360, 300); ctx.lineTo(352, 332); ctx.lineTo(308, 332);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e8c96a';
  ctx.fillRect(318, 292, 24, 10);
  if (side === 0) {
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(330, 288);
    ctx.quadraticCurveTo(322, 272, 334, 258);
    ctx.quadraticCurveTo(342, 246, 332, 234);
    ctx.stroke();
  }
  // Canting tools: two on the left, three on the right
  const cantings = side === 0 ? [180, 210] : [170, 200, 230];
  for (const cx of cantings) {
    ctx.strokeStyle = '#b87333';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(cx, 330); ctx.lineTo(cx + 14, 306); ctx.stroke();
    circle(ctx, cx + 16, 304, 5, '#b87333');
  }
  // Dye jars on the floor: indigo, brown, and the middle one blue/green
  const jars = [
    { x: 380, c: '#1e3a6b' },
    { x: 430, c: side === 0 ? '#1e3a6b' : '#27ae60' },
    { x: 480, c: '#6b4423' },
  ];
  for (const j of jars) {
    ctx.fillStyle = j.c;
    rr(ctx, j.x - 18, 352, 36, 48, 8); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(j.x - 12, 358, 6, 36);
  }
  // Basket of folded cloth
  ctx.fillStyle = '#a9764a';
  ctx.beginPath();
  ctx.moveTo(60, 420); ctx.lineTo(140, 420); ctx.lineTo(132, 470); ctx.lineTo(68, 470);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#7a2d1e';
  rr(ctx, 68, 404, 64, 18, 6); ctx.fill();
  ctx.fillStyle = '#1e4a6b';
  rr(ctx, 72, 388, 56, 16, 6); ctx.fill();
  // Thread spool: red on the left, yellow on the right
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(472, 452, 16, 40);
  ctx.fillStyle = side === 0 ? '#c0392b' : '#f1c40f';
  ctx.fillRect(466, 458, 28, 28);
  ctx.fillStyle = '#f5efe0';
  ctx.fillRect(466, 452, 28, 6);
  ctx.fillRect(466, 486, 28, 6);
  // Hanging lantern for warmth
  lantern(ctx, 560, 240, 16, '#e74c3c', true);
}

export function draw(ctx, side, t) {
  drawRoom(ctx);
  drawWindowSky(ctx, side);
  drawClothesline(ctx, side);
  drawCapStamp(ctx, side);
  drawTable(ctx, side);
  void t;
}
