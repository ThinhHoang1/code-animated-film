// Nét vẽ tay: bút lông có lực nhấn, run tay nhẹ, "sôi nét" 8 hình/giây; tô phẳng; chữ viết tay.
export const W = 1920, H = 1080;
export const MUC = "#25201e";            // mực
export const GIAY = "#fbf9f4";           // giấy
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, u) => a + (b - a) * u;
export const eio = (u) => { u = clamp(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
export const eout = (u) => 1 - Math.pow(1 - clamp(u), 3);
export const back = (u) => { u = clamp(u); const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
export const pha = (u, a, b) => clamp((u - a) / (b - a));
export function rng(seed) { let s = seed >>> 0; s = Math.imul(s ^ (s >>> 16), 0x45d9f3b); s = Math.imul(s ^ (s >>> 16), 0x45d9f3b); s = (s ^ (s >>> 16)) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

/* nhịp vẽ tay: tư thế đổi 12 hình/giây ("on twos"), nét sôi 8 hình/giây */
let SOI = 0;
export function datKhung(t) { SOI = Math.floor(t * 8) % 3; }
export const T12 = (t) => Math.floor(t * 12) / 12;

function hash(i) { let x = Math.imul((i | 0) ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; }
export function on(x, seed = 0) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i * 131 + seed * 977), hash((i + 1) * 131 + seed * 977), u) * 2 - 1; }

/* lấy mẫu path SVG ("M… C… Z", chỉ dùng lệnh tuyệt đối) thành dãy điểm — làm một lần, nhớ lại */
let svg = null; const kho = new Map();
export function mau(d, buoc = 3) {
  let r = kho.get(d); if (r) return r;
  if (!svg) { svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("width", "0"); svg.setAttribute("height", "0"); svg.style.position = "absolute"; document.body.appendChild(svg); }
  r = [];
  for (const sub of d.split(/(?=M)/)) {
    const s = sub.trim(); if (!s) continue;
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", s); svg.appendChild(p);
    const L = p.getTotalLength(), n = Math.max(2, Math.ceil(L / buoc)), pts = [];
    for (let i = 0; i <= n; i++) { const q = p.getPointAtLength((L * i) / n); pts.push([q.x, q.y]); }
    svg.removeChild(p); r.push({ pts, kin: /Z\s*$/i.test(s) });
  }
  kho.set(d, r); return r;
}
const p2 = new Map();
export const P = (d) => { let p = p2.get(d); if (!p) { p = new Path2D(d); p2.set(d, p); } return p; };

/* một nét mực theo dãy điểm: đầu đuôi vuốt nhọn, lực nhấn thay đổi, run tay theo pháp tuyến */
export function netPts(ctx, pts, o = {}) {
  let n = pts.length; if (n < 2) return;
  { // chia nhỏ đoạn dài (nét 2 điểm…) để vuốt nhọn chỉ ở hai đầu, run tay đều cả nét
    let dai = false; for (let i = 1; i < n; i++) if (Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) > 14) { dai = true; break; }
    if (dai) { const q = [pts[0]]; for (let i = 1; i < n; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], k = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 8)); for (let j = 1; j <= k; j++) q.push([x0 + (x1 - x0) * j / k, y0 + (y1 - y0) * j / k]); } pts = q; n = q.length; }
  }
  const m = ctx.getTransform(), sx = Math.hypot(m.a, m.b) || 1;
  const w = (o.w ?? 5.5) / Math.pow(sx, o.bu ?? 0.55), run = (o.run ?? 1.5) / sx;
  const seed = (o.seed ?? 7) + (o.soi === false ? 0 : SOI * 17);
  if (o.kin) {   // nét khép: bắt đầu lệch một chút, vẽ vòng quá đầu như tay người
    const k0 = Math.floor(hash(seed * 3 + n) * n), du = Math.max(2, Math.floor(n * 0.07)), q = [];
    for (let i = 0; i <= n + du; i++) q.push(pts[(k0 + i) % n]);
    pts = q; n = q.length;
  }
  const s = [0]; for (let i = 1; i < n; i++) s[i] = s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const L = s[n - 1] || 1, dau = o.dau ?? (o.kin ? 0.06 : 0.16), Lpx = L * sx;
  const vuot = Math.min(dau, 40 / Math.max(40, Lpx) + dau * 0.4);
  const T = [], B = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
    const nx = -ty, ny = tx, u = s[i] / L, spx = s[i] * sx;
    const tp = 0.12 + 0.88 * Math.pow(clamp(Math.min(u, 1 - u) / vuot), 0.75);
    const wi = w * 0.5 * tp * (1 + (o.nhan ?? 0.3) * on(spx / 80, seed + 3)) * (o.wf ? o.wf(u) : 1);
    const j = run * on(spx / 50, seed);
    const x = pts[i][0] + nx * j, y = pts[i][1] + ny * j;
    T.push(x + nx * wi, y + ny * wi); B.push(x - nx * wi, y - ny * wi);
  }
  ctx.beginPath(); ctx.moveTo(T[0], T[1]);
  for (let i = 2; i < T.length; i += 2) ctx.lineTo(T[i], T[i + 1]);
  for (let i = B.length - 2; i >= 0; i -= 2) ctx.lineTo(B[i], B[i + 1]);
  ctx.closePath(); ctx.fillStyle = o.mau ?? MUC; if (o.alpha != null) { ctx.save(); ctx.globalAlpha *= o.alpha; ctx.fill(); ctx.restore(); } else ctx.fill();
}
/* nét theo path SVG */
export function net(ctx, d, o = {}) { let k = 0; for (const sp of mau(d, o.buoc ?? 3)) netPts(ctx, sp.pts, { ...o, kin: o.kin ?? sp.kin, seed: (o.seed ?? 7) + k++ * 5 }); }
/* tô phẳng */
export function to(ctx, d, fill) { ctx.fillStyle = fill; ctx.fill(typeof d === "string" ? P(d) : d); }
export function toPts(ctx, pts, fill) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
/* tô + viền mực */
export function ve(ctx, d, fill, o = {}) { if (fill) to(ctx, d, fill); if (o.w !== 0) net(ctx, d, o); }
export function vePts(ctx, pts, fill, o = {}) { if (fill) toPts(ctx, pts, fill); if (o.w !== 0) netPts(ctx, pts, { kin: true, ...o }); }
/* bóng đổ phẳng bên trong một khối (cel shading một tông) */
export function bong(ctx, dKhoi, dBong, mauBong) { ctx.save(); ctx.clip(typeof dKhoi === "string" ? P(dKhoi) : dKhoi); to(ctx, dBong, mauBong); ctx.restore(); }

export function rect(x, y, w, h, r = 0) { r = Math.min(r, w / 2, h / 2); return `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`; }
export function elip(cx, cy, rx, ry) { const k = 0.5523; return `M${cx - rx},${cy} C${cx - rx},${cy - ry * k} ${cx - rx * k},${cy - ry} ${cx},${cy - ry} C${cx + rx * k},${cy - ry} ${cx + rx},${cy - ry * k} ${cx + rx},${cy} C${cx + rx},${cy + ry * k} ${cx + rx * k},${cy + ry} ${cx},${cy + ry} C${cx - rx * k},${cy + ry} ${cx - rx},${cy + ry * k} ${cx - rx},${cy} Z`; }
export function elipPts(cx, cy, rx, ry, n = 40, a0 = 0) { const r = []; for (let i = 0; i < n; i++) { const a = a0 + (i / n) * Math.PI * 2; r.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return r; }
export function duong(x1, y1, x2, y2) { return `M${x1},${y1} L${x2},${y2}`; }

/* nền giấy */
export function giay(ctx, mau = GIAY) { ctx.fillStyle = mau; ctx.fillRect(0, 0, W, H); }

/* chữ viết tay: từng chữ cái nghiêng/nhấp nhô nhẹ, đậm bằng viền cùng màu */
export function viet(ctx, s, x, y, o = {}) {
  const size = o.size ?? 84, font = `${size}px "${o.font ?? "Patrick Hand"}"`, seed = (o.seed ?? 11) + (o.soi === false ? 0 : SOI * 7);
  const u = o.u ?? 1; if (u <= 0) return;
  ctx.save(); ctx.font = font; ctx.textBaseline = "alphabetic";
  const ch = [...s], ws = ch.map((c) => ctx.measureText(c).width), tr = o.gian ?? size * 0.02;
  const tong = ws.reduce((a, b) => a + b, 0) + tr * (ch.length - 1);
  let x0 = o.can === "left" ? x : o.can === "right" ? x - tong : x - tong / 2;
  const sc = o.pop === false ? 1 : back(u);
  ctx.translate(x0 + tong / 2, y - size * 0.35); ctx.rotate(o.xoay ?? 0); ctx.scale(sc, sc); ctx.translate(-tong / 2, size * 0.35);
  ctx.fillStyle = o.mau ?? MUC; ctx.strokeStyle = o.mau ?? MUC; ctx.lineWidth = size * (o.dam ?? 0.022); ctx.lineJoin = "round";
  if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  let cx = 0;
  ch.forEach((c, i) => {
    ctx.save(); ctx.translate(cx + ws[i] / 2, on(i * 1.37, seed) * size * 0.035); ctx.rotate(on(i * 2.1 + 5, seed) * 0.05);
    if (o.nen) { ctx.lineWidth = size * 0.22; ctx.strokeStyle = o.nen; ctx.strokeText(c, -ws[i] / 2, 0); ctx.strokeStyle = o.mau ?? MUC; ctx.lineWidth = size * (o.dam ?? 0.022); }
    ctx.strokeText(c, -ws[i] / 2, 0); ctx.fillText(c, -ws[i] / 2, 0); ctx.restore();
    cx += ws[i] + tr;
  });
  ctx.restore();
  return tong;
}
export function doRong(ctx, s, size = 84, font = "Patrick Hand") { ctx.save(); ctx.font = `${size}px "${font}"`; const w = [...s].reduce((a, c) => a + ctx.measureText(c).width + size * 0.02, 0); ctx.restore(); return w; }

/* ── ký hiệu cảm xúc kiểu truyện tranh ── */
export function moHoi(ctx, x, y, k = 1, xoay = 0.3) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, "M0,-34 C8,-16 20,-2 20,12 C20,26 10,34 0,34 C-10,34 -20,26 -20,12 C-20,-2 -8,-16 0,-34 Z", "#a9dcf5", { w: 4 });
  to(ctx, elip(-7, 12, 4, 7), "#fff"); ctx.restore();
}
export function gan(ctx, x, y, k = 1, mau = "#e2453c") {   // gân tức
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.rotate(i * Math.PI / 2); net(ctx, "M8,-26 C10,-12 12,-10 26,-8", { w: 7, mau, seed: 40 + i }); ctx.restore(); }
  ctx.restore();
}
export function sao(ctx, x, y, r = 30, t = 0, mau = "#ffd23e") {   // lấp lánh 4 cánh
  const s = r * (0.8 + 0.2 * Math.sin(t * 9)); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3) * 0.2);
  const d = `M0,${-s} C${s * 0.12},${-s * 0.12} ${s * 0.12},${-s * 0.12} ${s},0 C${s * 0.12},${s * 0.12} ${s * 0.12},${s * 0.12} 0,${s} C${-s * 0.12},${s * 0.12} ${-s * 0.12},${s * 0.12} ${-s},0 C${-s * 0.12},${-s * 0.12} ${-s * 0.12},${-s * 0.12} 0,${-s} Z`;
  to(ctx, d, mau); net(ctx, d, { w: 3.5, kin: true }); ctx.restore();
}
export function tiaNhan(ctx, x, y, r0, r1, n = 8, o = {}) {   // vạch nhấn toả quanh một điểm
  for (let i = 0; i < n; i++) { const a = (o.a0 ?? -Math.PI / 2) + (i - (n - 1) / 2) * (o.goc ?? 0.32); netPts(ctx, [[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], { w: o.w ?? 6, seed: 60 + i, mau: o.mau }); }
}
export function rung(ctx, x, y, r, n = 2, mau = MUC) {   // vạch rung (( ))
  for (const sgn of [-1, 1]) for (let i = 0; i < n; i++) { const rr = r + i * 22; const pts = []; for (let k = 0; k <= 10; k++) { const a = -0.5 + k * 0.1; pts.push([x + sgn * Math.cos(a) * rr, y + Math.sin(a) * rr]); } netPts(ctx, pts, { w: 5, seed: 80 + i + sgn, mau }); }
}
export function dauHoi(ctx, x, y, size = 110, u = 1, mau = MUC) { viet(ctx, "?", x, y, { size, u, mau, font: "Patrick Hand", dam: 0.09 }); }
export function vanLanh(ctx, x, y, w, t) {   // hơi lạnh: sóng lượn bốc lên
  for (let i = 0; i < 3; i++) { const pts = []; for (let k = 0; k <= 14; k++) { const v = k / 14; pts.push([x + (i - 1) * w * 0.35 + Math.sin(v * 7 + t * 4 + i) * 10, y - v * 90]); } netPts(ctx, pts, { w: 4.5, seed: 90 + i, mau: "#7cc3e8" }); }
}
export function khoi(ctx, x, y, r, t, mau = "#e9e6df") {   // khói / bụi phồng
  const rr = rng(5); for (let i = 0; i < 5; i++) { const a = i * 1.3 + t, d = elip(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.4, r * (0.5 + rr() * 0.3), r * (0.45 + rr() * 0.25)); ve(ctx, d, mau, { w: 4 }); }
}
