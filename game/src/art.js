// Shared vector-drawing helpers every scene uses. Everything is drawn with code:
// no image, font or sound file is ever loaded, so the game plays fully offline.
export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

export function star(ctx, x, y, r, points, fill) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

/** A paper lantern: glowing ellipse body with ribs, a cap and a tassel. */
export function lantern(ctx, x, y, s, color, lit) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 1.15);
  if (lit) {
    const glow = ctx.createRadialGradient(0, 0, s * 0.2, 0, 0, s * 1.6);
    glow.addColorStop(0, 'rgba(255, 190, 80, 0.55)');
    glow.addColorStop(1, 'rgba(255, 190, 80, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, s * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = Math.max(1, s * 0.07);
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.ellipse(0, 0, s * (1 - Math.abs(i) * 0.18), s, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#7a4a12';
  ctx.fillRect(-s * 0.3, -s * 1.25, s * 0.6, s * 0.3);
  ctx.fillStyle = '#e8b23a';
  ctx.fillRect(-s * 0.12, s * 1.05, s * 0.24, s * 0.55);
  ctx.restore();
}

/**
 * A sagging string of bulbs between two points. `lit` is a Set of bulb indexes
 * that are dark (a difference can switch one off).
 */
export function bulbString(ctx, x1, y1, x2, y2, count, sag, dark) {
  ctx.strokeStyle = '#2c2140';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo((x1 + x2) / 2, Math.max(y1, y2) + sag, x2, y2);
  ctx.stroke();
  const colors = ['#ffd54a', '#ff8a65', '#7ee081', '#6ec6ff', '#ff6ec7'];
  for (let i = 0; i < count; i += 1) {
    const t = (i + 0.5) / count;
    const bx = x1 + (x2 - x1) * t;
    const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (Math.max(y1, y2) + sag) + t * t * y2;
    const isDark = dark && dark.has(i);
    if (!isDark) {
      const glow = ctx.createRadialGradient(bx, by + 8, 1, bx, by + 8, 14);
      glow.addColorStop(0, 'rgba(255, 220, 120, 0.8)');
      glow.addColorStop(1, 'rgba(255, 220, 120, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(bx, by + 8, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    circle(ctx, bx, by + 8, 5, isDark ? '#3a3348' : colors[i % colors.length]);
  }
}

/** A diamond kite with a tail of little bows. */
export function kite(ctx, x, y, s, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.8, 0);
  ctx.lineTo(0, s);
  ctx.lineTo(-s * 0.8, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -s); ctx.lineTo(0, s);
  ctx.moveTo(-s * 0.8, 0); ctx.lineTo(s * 0.8, 0);
  ctx.stroke();
  ctx.strokeStyle = '#5b4636';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.quadraticCurveTo(s * 0.5, s * 2.2, -s * 0.2, s * 3.4);
  ctx.stroke();
  ctx.fillStyle = '#fff';
  for (let i = 1; i <= 3; i += 1) {
    const ty = s + i * s * 0.8;
    ctx.fillRect(-4, ty - 3, 8, 6);
  }
  ctx.restore();
}

/** A simple palm tree: curved trunk, five fronds, coconuts. */
export function palm(ctx, x, y, h, coconutCount) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(18, -h * 0.5, 8, -h);
  ctx.stroke();
  ctx.strokeStyle = '#2f7d32';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  const topX = 8;
  const topY = -h;
  for (let i = 0; i < 5; i += 1) {
    const a = -Math.PI * (0.15 + i * 0.175);
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(topX + Math.cos(a) * 40, topY + Math.sin(a) * 34 - 18, topX + Math.cos(a) * 62, topY + Math.sin(a) * 52 + 14);
    ctx.stroke();
  }
  ctx.fillStyle = '#7a5230';
  for (let i = 0; i < coconutCount; i += 1) {
    circle(ctx, topX - 8 + i * 11, topY + 12, 6, '#7a5230');
  }
  ctx.restore();
}

/** A water buffalo, side view, facing `dir` (1 right, -1 left). */
export function buffalo(ctx, x, y, s, dir, horns) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir * s, s);
  ctx.fillStyle = '#4a4a55';
  rr(ctx, -52, -34, 104, 46, 18);
  ctx.fill();
  circle(ctx, 48, -30, 22, '#4a4a55');
  ctx.fillStyle = '#3a3a44';
  ctx.beginPath();
  ctx.moveTo(58, -46);
  ctx.lineTo(72, -38);
  ctx.lineTo(58, -32);
  ctx.closePath();
  ctx.fill();
  if (horns) {
    ctx.strokeStyle = '#d8cfc0';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(44, -48);
    ctx.quadraticCurveTo(30, -62, 14, -52);
    ctx.stroke();
  }
  ctx.fillStyle = '#2e2e38';
  ctx.fillRect(-48, 8, 12, 26);
  ctx.fillRect(-12, 8, 12, 26);
  ctx.fillRect(22, 8, 12, 26);
  ctx.fillRect(38, 8, 12, 26);
  ctx.strokeStyle = '#3a3a44';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-52, -10);
  ctx.quadraticCurveTo(-66, 6, -58, 22);
  ctx.stroke();
  ctx.restore();
}

/** A farmer in a conical straw hat, seen from the side. */
export function farmer(ctx, x, y, s, hat) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#2e6b4f';
  rr(ctx, -16, -34, 32, 40, 10);
  ctx.fill();
  circle(ctx, 0, -46, 13, '#e8b98a');
  if (hat) {
    ctx.fillStyle = '#e8c96a';
    ctx.beginPath();
    ctx.moveTo(-24, -52);
    ctx.quadraticCurveTo(0, -84, 24, -52);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b89a3e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-24, -52);
    ctx.quadraticCurveTo(0, -84, 24, -52);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#2b2b2b';
    ctx.beginPath();
    ctx.arc(0, -50, 13, Math.PI, 0);
    ctx.fill();
  }
  ctx.fillStyle = '#3a3a44';
  ctx.fillRect(-13, 4, 9, 30);
  ctx.fillRect(5, 4, 9, 30);
  ctx.restore();
}
