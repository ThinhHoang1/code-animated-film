// Đồ dùng chung cho mọi cảnh: tiện ích thời gian/camera, bối cảnh lặp lại, màn hình điện thoại (gọi, Zalo, Threads, sao kê), lọ ruốc, thẻ chương.
import { W, H, MUC, GIAY, giay, viet, doRong, ve, vePts, net, netPts, to, toPts, bong, elip, rect, moHoi, gan, sao, tiaNhan, rung, vanLanh, dauHoi,
  T12, clamp, lerp, eio, eout, back, pha, on, rng } from "./but.js";
import { veNV, banTay, DA } from "./nv.js";
import * as D from "./do.js";

/* ── thời gian theo chữ ── */
export const m = (c, i) => c.moc[i]?.s ?? 99;                         // giây bắt đầu chữ thứ i của câu
const chuan = (s) => s.toLowerCase().normalize("NFC").replace(/[^\p{L}\p{N}]/gu, "");
export function mc(c, chu, lan = 1) {                                 // giây bắt đầu lần thứ `lan` chữ `chu` xuất hiện (không thấy → 99)
  const q = chuan(chu); let k = 0; for (const w of c.moc) if (chuan(w.w).startsWith(q) && ++k === lan) return w.s; return 99;
}
export const vao = (tl, t0, d = 0.22) => clamp((tl - t0) / d);
export function cam(ctx, x, y, z) { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-x, -y); }
export function lac(ctx, tl, t0, a = 16, d = 0.3) { const u = tl - t0; if (u < 0 || u > d) return; const k = (1 - u / d) * a; ctx.translate(on(tl * 40, 1) * k, on(tl * 40, 2) * k); }
export function chop(ctx, tl, t0, a = 0.8) { const u = tl - t0; if (u < 0 || u > 0.35) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(255,255,255,${(a * (1 - u / 0.35)).toFixed(3)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
export function toi(ctx, a, mau = "14,16,40") { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(${mau},${a})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
export function muiTen(ctx, x1, y1, x2, y2, u = 1, mau = MUC) {
  if (u <= 0) return; const x = lerp(x1, x2, u), y = lerp(y1, y2, u), a = Math.atan2(y2 - y1, x2 - x1);
  netPts(ctx, [[x1, y1], [(x1 + x) / 2 + (y - y1) * 0.12, (y1 + y) / 2 - (x - x1) * 0.12], [x, y]], { w: 5.5, mau, seed: 400 });
  if (u > 0.8) for (const s of [-1, 1]) netPts(ctx, [[x, y], [x - Math.cos(a + s * 0.5) * 26, y - Math.sin(a + s * 0.5) * 26]], { w: 5.5, mau, seed: 401 + s });
}
export function khoanh(ctx, x, y, rx, ry, u, mau = "#e0392f", w = 8) {
  if (u <= 0) return; const n = 40, k = Math.floor(n * 1.12 * clamp(u)), pts = [];
  for (let i = 0; i <= k; i++) { const a = -2.2 + (i / n) * Math.PI * 2; pts.push([x + Math.cos(a) * rx * (1 + i * 0.002), y + Math.sin(a) * ry]); }
  if (pts.length > 1) netPts(ctx, pts, { w, mau, seed: 410 });
}
export function gachCheo(ctx, x0, y0, x1, y1, u = 1, mau = "#e0392f", w = 12) { if (u <= 0) return; netPts(ctx, [[x0, y0], [lerp(x0, x1, u), lerp(y0, y1, u)]], { w, mau, seed: 430 }); }
export function duaDua(ctx, x1, y1, x2, y2, w = 14) {
  const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a), ny = Math.cos(a);
  vePts(ctx, [[x1 + nx * w / 2, y1 + ny * w / 2], [x2 + nx * w * 0.3, y2 + ny * w * 0.3], [x2 - nx * w * 0.3, y2 - ny * w * 0.3], [x1 - nx * w / 2, y1 - ny * w / 2]], "#d9a866", { w: 3.5, seed: 420 + x1 });
}
export function avatar(ctx, x, y, r, seed, o = {}) {   // đầu người mini; o.xam = avatar trống (không ảnh đại diện)
  ctx.save(); ctx.translate(x, y); ctx.scale(r / 100, r / 100);
  if (o.xam) { ve(ctx, elip(0, 0, 96, 96), "#c9ccd3", { w: 7 }); ve(ctx, elip(0, -20, 34, 34), "#eef0f3", { w: 5 }); ve(ctx, "M-60,70 C-56,20 56,20 60,70 Z", "#eef0f3", { w: 5 }); ctx.restore(); return; }
  if (o.chu) { ve(ctx, elip(0, 0, 96, 96), o.mau ?? "#2a2631", { w: 7 }); viet(ctx, o.chu, 0, 40, { size: 120, mau: "#fff", pop: false }); ctx.restore(); return; }
  const q = rng(seed), toc = ["#2a2631", "#6b3e26", "#c9772f", "#3c4b7a", "#a33a5c", "#e8c35a"][Math.floor(q() * 6)];
  ve(ctx, elip(0, 10, 92, 84), DA, { w: 7 }); ve(ctx, q() > 0.5 ? "M-96,10 C-100,-70 -50,-96 0,-96 C50,-96 100,-70 96,10 C70,-30 -70,-30 -96,10 Z" : "M-96,40 C-110,-60 -50,-100 0,-100 C50,-100 110,-60 96,40 C90,0 70,-30 0,-34 C-70,-30 -90,0 -96,40 Z", toc, { w: 7 });
  to(ctx, elip(-30, 20, 9, 13), MUC); to(ctx, elip(30, 20, 9, 13), MUC); net(ctx, q() > 0.5 ? "M-14,50 C-6,58 6,58 14,50" : "M-12,54 L12,54", { w: 6 });
  ctx.restore();
}
export function hoa(ctx, x, y, r = 18, mau = "#f39cc0") {   // bông hoa (thả tim kiểu Zalo)
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; ve(ctx, elip(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, r * 0.5, r * 0.5), mau, { w: 3 }); }
  to(ctx, elip(x, y, r * 0.35, r * 0.35), "#f4c430");
}
export function anhSushi(ctx, x, y, k = 1, xoay = 0, o = {}) {   // ảnh chụp mâm sushi (polaroid); o.tay = có bàn tay đeo nhẫn
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, rect(-170, -150, 340, 300, 8), "#ffffff", { w: 5 }); to(ctx, rect(-148, -128, 296, 220, 4), o.nen ?? "#2f3550");
  ctx.save(); ctx.beginPath(); ctx.rect(-148, -128, 296, 220); ctx.clip();
  ctx.save(); ctx.translate(0, -18); ctx.scale(1, 0.55); D.thot(ctx, 0, 0, 0.85); ctx.restore();
  for (let i = 0; i < 8; i++) D.sushi(ctx, -96 + (i % 4) * 64, -40 + Math.floor(i / 4) * 32, 0.55, i + (o.lech ?? 0));
  if (o.tay) tayCanh(ctx, 150, 70, 0.32, 0, 0, false);
  ctx.restore(); ctx.restore();
}
/* bàn tay cận cảnh cầm đũa, đeo nhẫn (đầu ngón chỉ sang trái) */
export function tayCanh(ctx, x, y, k, t, sang = 0, sushiO = true, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(-0.12);
  if (o.dua !== false) { duaDua(ctx, -30, -56, -520, -150, 18); duaDua(ctx, -30, -10, -520, -70, 18); }
  if (sushiO) D.sushi(ctx, -500, -120, 1.4, 0);
  const ao = o.ao ?? "#f2b544", aoB = o.aoB ?? "#d8952a";
  ve(ctx, "M120,-80 L360,-110 L360,150 L110,120 C150,70 150,-30 120,-80 Z", ao, { w: 6 }); bong(ctx, "M120,-80 L360,-110 L360,150 L110,120 C150,70 150,-30 120,-80 Z", "M100,60 L380,40 L380,160 L100,160 Z", aoB);
  net(ctx, "M130,-76 C160,-20 160,60 124,118", { w: 5 });
  const V = { w: 5.5 };
  ve(ctx, "M-26,30 C-60,30 -88,40 -92,60 C-94,80 -72,86 -58,78 C-44,70 -34,62 -16,60 Z", DA, V);
  ve(ctx, "M-6,64 C-34,70 -52,82 -50,98 C-48,110 -28,112 -18,102 C-10,94 -2,88 8,86 Z", DA, V);
  ve(ctx, "M-20,-14 C-70,-14 -116,-10 -134,-4 C-152,2 -148,30 -130,30 C-100,28 -62,24 -26,26 Z", DA, V);
  ve(ctx, "M-30,-60 C20,-92 110,-84 140,-36 C164,6 156,70 116,96 C70,120 0,112 -30,80 C-56,52 -60,-30 -30,-60 Z", DA, V);
  ve(ctx, "M-10,-62 C-60,-72 -110,-80 -142,-76 C-162,-72 -160,-46 -140,-44 C-110,-42 -62,-32 -14,-24 Z", DA, V);
  ve(ctx, "M44,-72 C4,-98 -56,-102 -86,-94 C-104,-88 -100,-66 -82,-64 C-46,-62 -6,-52 24,-42 Z", DA, V);
  for (const [x1, y1] of [[-120, -66], [-114, 8], [-70, -84]]) net(ctx, `M${x1},${y1 - 8} C${x1 + 6},${y1 - 2} ${x1 + 6},${y1 + 6} ${x1},${y1 + 10}`, { w: 3 });
  if (o.nhan !== false) { ctx.save(); ctx.translate(-66, 62); ctx.rotate(0.35); ve(ctx, rect(-10, -24, 20, 48, 9), "#dfe6ee", { w: 5 }); to(ctx, rect(-5, -18, 5, 30, 3), "#ffffff"); ctx.restore(); }
  ctx.restore();
  if (sang > 0) sao(ctx, x + (-66 * Math.cos(-0.12) - 62 * Math.sin(-0.12)) * k + 20, y + (-66 * Math.sin(-0.12) + 62 * Math.cos(-0.12)) * k - 40, 46 * sang, t);
}

/* ── bối cảnh lặp lại ── */
export function phongDem(ctx, t, o = {}) {   // phòng trọ đêm
  D.phong(ctx, "#4d5578", "#3b405e", 860);
  D.cuaSo(ctx, 130, 120, 440, 320, t, true);
  D.dongHo(ctx, 760, 200, 58, o.gio ?? 11, o.phut ?? 0);
  if (o.lich !== false) D.lichO(ctx, 1660, 110, 200, 230, o.gach ?? 0);
  D.quat(ctx, 150, 870, 0.85, t);
}
export function phongNgay(ctx, t, o = {}) {   // phòng trọ ngày
  D.phong(ctx, "#f1e6d3", "#d9c4a3", 860);
  D.cuaSo(ctx, 130, 120, 440, 320, t, false);
  D.dongHo(ctx, 760, 200, 58, o.gio ?? 12, o.phut ?? 0);
  if (o.lich !== false) D.lichO(ctx, 1660, 110, 200, 230, o.gach ?? 0);
  D.quat(ctx, 150, 870, 0.85, t);
}
/* bàn làm việc: Hiếu ngồi sau bàn (HX,HY,HK). S = tư thế Hiếu; o.tren(ctx) vẽ đồ trên bàn; o.den (0..1) đèn bàn bật */
export const HX = 1110, HY = 450, HK = 1.25;
export const local = (x, y) => [(x - HX) / HK, (y - HY) / HK];
export function banLamViec(ctx, t, S, o = {}) {
  const den = o.den ?? 0;
  if (den > 0) { ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.1 * den; to(ctx, elip(1150, 470, 560, 330), "#ffd36a"); ctx.restore(); }
  if (S) veNV(ctx, HX, HY, HK, { t, ...S, anTay: true, chan: false });
  D.ban(ctx, 1110, 640, 1180, 300);
  if (o.thot !== false) { ctx.save(); ctx.translate(HX, 620); ctx.scale(1, 0.48); D.thot(ctx, 0, 0, 1.75, "go"); ctx.restore(); }
  if (o.den !== undefined) D.denBan(ctx, 1480, 650, 1.05, den, -1);
  if (o.tren) o.tren(ctx);
  if (S) veNV(ctx, HX, HY, HK, { t, ...S, chiTay: true });
  if (o.den !== undefined) D.quangDen(ctx, 1420, 418, 900, 1380, 640, den);
}
export const choSushi = (i) => [HX - 165 + (i % 4) * 110, 594 + Math.floor(i / 4) * 38];
export function tamSushi(ctx, n = 8, k = 1.05) { for (let i = 0; i < n; i++) { const [x, y] = choSushi(i); D.sushi(ctx, x, y, k, i); } }

/* nhà mẹ ở quê: "bep" | "ao" | "cong" | "phongngu" | "san" */
export function nhaMe(ctx, t, kieu = "bep", o = {}) {
  if (kieu === "bep") {
    D.phong(ctx, "#ead9b8", "#b98d62", 840);
    to(ctx, rect(0, 620, W, 220, 0), "#c97f5a"); for (let r = 0; r < 4; r++) for (let i = 0; i < 16; i++) net(ctx, rect(i * 124 + (r % 2) * 62 - 62, 620 + r * 55, 124, 55, 0), { w: 2.5, mau: "#a8603f", seed: r * 20 + i });
    netPts(ctx, [[-10, 620], [W + 10, 620]], { w: 5 });
    ve(ctx, rect(1300, 160, 420, 300, 8), "#bfe6c0", { w: 6 }); for (let i = 0; i < 5; i++) ve(ctx, elip(1340 + i * 90, 400 - (i % 2) * 40, 50, 70), "#6fbf73", { w: 4 }); for (let i = 1; i < 4; i++) netPts(ctx, [[1300 + i * 105, 164], [1300 + i * 105, 456]], { w: 5 });
    ve(ctx, rect(200, 300, 560, 26, 6), "#9c6a44", { w: 5 }); ve(ctx, "M260,300 C260,230 380,230 380,300 Z", "#5a5f6e", { w: 5 }); ve(ctx, "M440,300 C440,250 520,250 520,300 Z", "#d9a24a", { w: 5 }); ve(ctx, rect(580, 220, 90, 80, 10), "#e8e2d0", { w: 5 });
    ve(ctx, rect(140, 640, 520, 200, 10), "#8c8f9a", { w: 6 }); ve(ctx, elip(280, 640, 90, 18), "#3a3d4a", { w: 5 }); ve(ctx, elip(520, 640, 90, 18), "#3a3d4a", { w: 5 });
    ve(ctx, "M200,640 C200,560 360,560 360,640 Z", "#b0b6c2", { w: 5 }); for (let i = 0; i < 3; i++) { const pts = []; for (let j = 0; j <= 8; j++) pts.push([250 + i * 30 + Math.sin(j + t * 4 + i) * 8, 550 - j * 12]); netPts(ctx, pts, { w: 4, mau: "#ffffff", seed: 500 + i }); }
  } else if (kieu === "ao") {
    giay(ctx, "#cdeaf5"); to(ctx, "M-20,520 C400,480 1500,500 1940,530 L1940,1100 L-20,1100 Z", "#8cc66f"); net(ctx, "M-20,520 C400,480 1500,500 1940,530", { w: 6 });
    ve(ctx, "M200,700 C300,600 1500,600 1700,700 C1760,820 1500,960 960,970 C420,960 120,820 200,700 Z", "#6fb0c9", { w: 6 });
    for (let i = 0; i < 4; i++) { const r = ((t * 0.6 + i * 0.25) % 1); ctx.save(); ctx.globalAlpha = 1 - r; net(ctx, elip(900 + i * 120 - 180, 800 + (i % 2) * 40, 40 + r * 90, 10 + r * 24), { w: 3.5, mau: "#e8f6fb" }); ctx.restore(); }
    for (const x of [1760, 1840]) { ve(ctx, rect(x - 12, 260, 24, 300, 8), "#9c7a4a", { w: 5 }); for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(x, 270); ctx.rotate(-1.2 + i * 0.8); ve(ctx, "M0,0 C40,-30 140,-30 180,0 C140,20 40,20 0,0 Z", "#6fbf73", { w: 4 }); ctx.restore(); } }
    ve(ctx, "M40,520 L40,300 L360,300 L360,520 Z", "#f1d38a", { w: 6 }); ve(ctx, "M10,310 L200,180 L390,310 Z", "#c9573f", { w: 6 });
  } else if (kieu === "cong") {
    giay(ctx, "#cdeaf5"); to(ctx, rect(0, 820, W, 260, 0), "#c9b48a"); netPts(ctx, [[-10, 820], [W + 10, 820]], { w: 6 });
    ve(ctx, rect(60, 360, 760, 460, 6), "#f6e3a0", { w: 6 }); ve(ctx, "M30,370 L440,200 L850,370 Z", "#c9573f", { w: 6 }); ve(ctx, rect(330, 560, 200, 260, 6), "#9c6a44", { w: 5 });
    for (const x of [880, 1180]) ve(ctx, rect(x, 520, 60, 300, 6), "#e8e2d0", { w: 5 }); D.congSat(ctx, 940, 820, 240, 260);
    for (let i = 0; i < 8; i++) ve(ctx, elip(870 + i * 46, 520 - (i % 3) * 12, 26, 20), "#e85a9a", { w: 3.5 });
    ve(ctx, rect(1300, 300, 600, 520, 6), "#dfe9f5", { w: 6 }); ve(ctx, "M1280,310 L1600,170 L1920,310 Z", "#5a6b8a", { w: 6 });
    if (o.oto !== false) { ve(ctx, "M1360,820 L1360,740 C1360,700 1400,690 1440,690 L1500,620 C1520,600 1540,596 1580,596 L1720,596 C1760,596 1780,606 1800,630 L1860,690 C1890,694 1900,710 1900,740 L1900,820 Z", "#e2453c", { w: 6 }); ve(ctx, "M1520,690 L1570,620 L1660,620 L1660,690 Z", "#cfe8f6", { w: 4 }); ve(ctx, "M1680,690 L1680,620 L1760,620 L1810,690 Z", "#cfe8f6", { w: 4 }); for (const x of [1460, 1780]) ve(ctx, elip(x, 820, 46, 46), "#2f2f3a", { w: 5 }); sao(ctx, 1600, 600, 26, t); sao(ctx, 1860, 700, 20, t + 1); }
  } else if (kieu === "phongngu") {
    D.phong(ctx, "#343a5a", "#2a2f48", 860);
    ve(ctx, rect(1100, 560, 760, 300, 18), "#7a6aa8", { w: 6 }); ve(ctx, rect(1120, 520, 220, 80, 30), "#e9e4f5", { w: 5 });
    ve(ctx, rect(420, 620, 180, 240, 8), "#8a6a4a", { w: 5 }); ve(ctx, "M450,620 L470,520 L550,520 L570,620 Z", "#ffe7a6", { w: 5 });
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.14; to(ctx, elip(510, 560, 420, 300), "#ffd36a"); ctx.restore();
  } else if (kieu === "san") {   // sân nhà quê ban ngày
    giay(ctx, "#cdeaf5"); to(ctx, rect(0, 780, W, 300, 0), "#d9c08f"); netPts(ctx, [[-10, 780], [W + 10, 780]], { w: 6 });
    ve(ctx, rect(200, 300, 1100, 480, 6), "#f6e3a0", { w: 6 }); ve(ctx, "M160,310 L750,120 L1340,310 Z", "#c9573f", { w: 6 });
    for (let i = 0; i < 4; i++) ve(ctx, rect(300 + i * 250, 460, 150, 320, 6), "#9c6a44", { w: 5 });
    ve(ctx, rect(1500, 300, 30, 480, 8), "#9c7a4a", { w: 5 }); for (let i = 0; i < 5; i++) ve(ctx, elip(1515 + (i - 2) * 70, 260 - (i % 2) * 40, 90, 60), "#6fbf73", { w: 5 });
  }
}
/* bến xe khách + xe khách */
export function xeKhach(ctx, x, y, k = 1, t = 0, o = {}) {   // gốc giữa đáy xe
  ctx.save(); ctx.translate(x, y); ctx.scale(k * (o.lat ?? 1), k);
  ve(ctx, "M-520,-20 L-520,-300 C-520,-330 -500,-340 -470,-340 L440,-340 C500,-340 520,-300 530,-240 L540,-20 Z", "#fdfdfb", { w: 6 });
  to(ctx, rect(-516, -150, 1052, 40, 0), "#e2453c"); netPts(ctx, [[-516, -150], [536, -150]], { w: 4 }); netPts(ctx, [[-516, -110], [536, -110]], { w: 4 });
  for (let i = 0; i < 6; i++) ve(ctx, rect(-490 + i * 150, -310, 130, 110, 10), "#9fd3ea", { w: 4.5 }); ve(ctx, "M420,-310 L500,-310 C510,-280 516,-240 518,-200 L420,-200 Z", "#9fd3ea", { w: 4.5 });
  viet(ctx, o.chu ?? "XE KHÁCH", -60, -60, { size: 56, mau: "#2f5fae", pop: false });
  for (const xx of [-360, 360]) { ctx.save(); ctx.translate(xx, -10); ctx.rotate(t * 8); ve(ctx, elip(0, 0, 60, 60), "#2f2f3a", { w: 5 }); ve(ctx, elip(0, 0, 24, 24), "#b9bcc6", { w: 4 }); netPts(ctx, [[0, -24], [0, 24]], { w: 3 }); ctx.restore(); }
  ctx.restore();
}
export function benXe(ctx, t, o = {}) {
  giay(ctx, "#d8eef7"); to(ctx, rect(0, 820, W, 260, 0), "#9a9ca6"); netPts(ctx, [[-10, 820], [W + 10, 820]], { w: 6 });
  for (let i = 0; i < 8; i++) netPts(ctx, [[i * 260 + 40, 950], [i * 260 + 160, 950]], { w: 8, mau: "#e9e6df" });
  ve(ctx, rect(80, 140, 520, 120, 10), "#2f5fae", { w: 6 }); viet(ctx, o.ten ?? "BẾN XE", 340, 225, { size: 80, mau: "#fff", pop: false }); netPts(ctx, [[160, 260], [160, 820]], { w: 12, mau: "#7a7d88" }); netPts(ctx, [[520, 260], [520, 820]], { w: 12, mau: "#7a7d88" });
  if (o.xe !== false) xeKhach(ctx, o.xeX ?? 1280, 830, 0.95, t * (o.chay ?? 0), o);
}
/* Threads City: thành phố toà nhà là các bài đăng, biển neon */
export function threadsCity(ctx, t, o = {}) {
  giay(ctx, "#171b33"); for (let i = 0; i < 30; i++) { const q = rng(1500 + i); sao(ctx, q() * W, q() * 380, 4 + q() * 6, t + i, "#fff6d0"); }
  const q = rng(1600);
  for (let i = 0; i < 11; i++) {
    const w = 140 + q() * 80, h = 300 + q() * 460, x = i * 178 - 40 + q() * 30, y = 1000 - h;
    ve(ctx, rect(x, y, w, h, 18), ["#2a3158", "#323a68", "#262c4f"][i % 3], { w: 5, seed: 1700 + i });
    for (let r = 0; r < Math.floor(h / 70) - 1; r++) { const yy = y + 30 + r * 70; to(ctx, elip(x + 26, yy + 10, 10, 10), "#ff6fa0"); to(ctx, rect(x + 46, yy + 2, w - 70, 8, 4), "#5b679e"); to(ctx, rect(x + 46, yy + 16, (w - 70) * 0.6, 8, 4), "#5b679e"); }
  }
  for (const [s, x, y, mau, kc] of o.bien ?? [["50 TRIỆU", 420, 330, "#ff4fa0", 96], ["LƯƠNG 80", 1340, 260, "#3fe0ff", 84], ["OMAKASE", 900, 470, "#ffd23e", 70]]) {
    const nh = 0.75 + 0.25 * (Math.floor(t * 6 + x) % 7 ? 1 : 0);
    ctx.save(); ctx.globalAlpha = nh; const w = doRong(ctx, s, kc) + 60; ve(ctx, rect(x - w / 2, y - kc, w, kc * 1.3, 16), "#0f1226", { w: 7, mau: mau });
    viet(ctx, s, x, y, { size: kc, mau, pop: false, nen: "rgba(255,255,255,0.12)" }); ctx.restore();
  }
  to(ctx, rect(0, 1000, W, 80, 0), "#0f1226");
}
/* ── điện thoại: màn hình gọi / Zalo / Threads / thông báo tiền ── */
// manHinhGoi: o.kieu "den" (cuộc gọi đến) | "video" (mặt người gọi) | "thoai" (gọi thoại, sóng âm); o.ai = kiểu nhân vật; o.ten
export function manHinhGoi(ctx, x, y, k, t, o = {}) {
  D.dienThoai(ctx, x, y, k, o.xoay ?? 0, (g) => {
    if (o.kieu === "video") {
      g.fillStyle = o.nen ?? "#e9dcc8"; g.fillRect(-80, -140, 160, 280); g.fillStyle = "#cdb89a"; g.fillRect(-80, 40, 160, 100);
      veNV(g, o.dx ?? 0, 70, o.kNV ?? 0.42, { t, kieu: o.ai ?? "me", mat: o.mat ?? "thuong", noi: o.noi ?? 0, chan: false, ngh: o.ngh ?? 0, nhin: o.nhin, tayP: o.tayP, tayT: o.tayT });
      if (o.them) o.them(g);
    } else {
      g.fillStyle = "#3a4466"; g.fillRect(-80, -140, 160, 280);
      g.save(); g.beginPath(); g.arc(0, -50, 46, 0, 7); g.clip(); g.fillStyle = "#e9dcc8"; g.fillRect(-50, -100, 100, 100); veNV(g, 0, 20, 0.38, { t, kieu: o.ai ?? "me", mat: o.mat ?? "thuong", noi: o.noi ?? 0 }); g.restore(); net(g, elip(0, -50, 46, 46), { w: 3, mau: "#fff" });
      viet(g, o.ten ?? "Mẹ ♥", 0, 30, { size: 34, mau: "#fff", pop: false });
      if (o.kieu === "thoai") { viet(g, o.gio ?? "00:42", 0, 58, { size: 20, mau: "#c9d4ee", pop: false }); for (let i = 0; i < 9; i++) { const h = 6 + Math.abs(on(t * 8 + i, 9)) * 30 * (o.noi ?? 0.6); to(g, rect(-44 + i * 11, 96 - h / 2, 6, h, 3), "#9fd3ea"); } to(g, elip(0, 118, 14, 14), "#e5484d"); }
      else { viet(g, o.phu ?? "cuộc gọi video…", 0, 58, { size: 18, mau: "#c9d4ee", pop: false }); to(g, elip(-40, 108, 16, 16), "#e5484d"); to(g, elip(40, 108, 16, 16), "#30c46b"); }
    }
  }, { vo: o.vo ?? "#33364a" });
}
// zalo: o.tieuDe; o.tin = [{ai: seed|"me"|…, chu, anh(g) (vẽ trong ô 120×80 tâm 0,0), hoa: n, mo: true(mờ)}]; o.cuon (px); o.tatChuong
export function zalo(ctx, x, y, k, t, o = {}) {
  D.dienThoai(ctx, x, y, k, o.xoay ?? 0, (g) => {
    g.fillStyle = "#e7eef7"; g.fillRect(-80, -140, 160, 280); to(g, rect(-80, -140, 160, 46, 0), "#2f7fe0");
    viet(g, o.tieuDe ?? "Nhà Ngoại", -4, -102, { size: 17, mau: "#fff", pop: false, soi: false });
    if (o.tatChuong) { net(g, "M52,-114 C52,-122 66,-122 66,-114 L68,-102 L50,-102 Z", { w: 2, mau: "#fff" }); netPts(g, [[46, -122], [72, -96]], { w: 2.5, mau: "#ff6b6b" }); }
    g.save(); g.beginPath(); g.rect(-80, -94, 160, 234); g.clip(); g.translate(0, -(o.cuon ?? 0));
    let yy = -86;
    for (const [i, tin] of (o.tin ?? []).entries()) {
      const h = tin.anh ? 96 : 30;
      if (typeof tin.ai === "number") avatar(g, -66, yy + 10, 9, tin.ai); else { g.save(); g.beginPath(); g.arc(-66, yy + 10, 9, 0, 7); g.clip(); g.fillStyle = "#e9dcc8"; g.fillRect(-76, yy, 20, 20); veNV(g, -66, yy + 22, 0.06, { kieu: tin.ai, chan: false }); g.restore(); }
      ve(g, rect(-52, yy, 124, h, 8), "#ffffff", { w: 2 });
      if (tin.anh) { g.save(); g.translate(10, yy + 46); g.beginPath(); g.rect(-56, -40, 112, 80); g.clip(); tin.anh(g); g.restore(); if (tin.mo) { g.save(); g.globalAlpha = 0.45; g.fillStyle = "#f3f0e8"; g.fillRect(-46, yy + 6, 112, 80); g.restore(); } }
      if (tin.chu) viet(g, tin.chu, -46, yy + (tin.anh ? 92 : 20), { size: 13, pop: false, can: "left", soi: false });
      for (let j = 0; j < (tin.hoa ?? 0); j++) hoa(g, 64 - j * 12, yy + h, 5);
      yy += h + 14;
    }
    g.restore();
  }, { vo: o.vo ?? "#33364a" });
}
// threadsBai: thẻ bài đăng Threads (to, đặt giữa khung): o.ten, o.av ({seed} | {chu} | {xam}), o.chu (mảng dòng), o.anh(g) vẽ trong 520×300 tâm (0,0), o.tim
export function threadsBai(ctx, x, y, k, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const h = (o.anh ? 330 : 0) + 120 + (o.chu?.length ?? 0) * 46;
  ve(ctx, rect(-300, -h / 2, 600, h, 22), "#ffffff", { w: 5 });
  avatar(ctx, -246, -h / 2 + 50, 30, o.av?.seed ?? 3, o.av ?? {});
  viet(ctx, o.ten ?? "các bảnh", -200, -h / 2 + 62, { size: 34, pop: false, can: "left" }); for (const dx of [-14, 0, 14]) to(ctx, elip(250 + dx, -h / 2 + 52, 4, 4), "#9aa0ab");   // dấu ba chấm thay "@" (font không có)
  let yy = -h / 2 + 130; for (const d of o.chu ?? []) { viet(ctx, d, -270, yy, { size: 32, pop: false, can: "left" }); yy += 46; }
  if (o.anh) { ctx.save(); ctx.translate(0, yy + 150); ctx.beginPath(); ctx.rect(-260, -150, 520, 300); ctx.clip(); o.anh(ctx); ctx.restore(); net(ctx, rect(-260, yy, 520, 300, 12), { w: 4 }); yy += 330; }
  viet(ctx, `♥ ${o.tim ?? 0}`, -262, h / 2 - 22, { size: 30, mau: "#e0392f", pop: false, can: "left" });
  ctx.restore();
}
// thông báo ngân hàng trượt xuống
export function thongBaoTien(ctx, x, y, k, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, rect(-330, -70, 660, 140, 26), "#ffffff", { w: 5 }); ve(ctx, rect(-310, -50, 100, 100, 22), "#2f9e57", { w: 4 }); viet(ctx, "đ", -260, 22, { size: 70, mau: "#fff", pop: false });
  viet(ctx, o.so ?? "+10.000 VND", -180, -6, { size: 50, mau: "#2f9e57", pop: false, can: "left" }); viet(ctx, o.phu ?? "23:40 · PHAM VAN DUNG", -180, 44, { size: 32, mau: "#6b6560", pop: false, can: "left" });
  ctx.restore();
}
/* lọ ruốc: lọ cà phê cũ, nắp buộc chun, băng dính chữ mẹ. o.dong2 = dòng thêm (vd "Đừng đăng."), o.u2 hiện dần dòng 2 */
export function loRuoc(ctx, x, y, k = 1, o = {}) {   // gốc đáy lọ
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.xoay ?? 0); ctx.scale(k, k);
  ve(ctx, "M-90,0 C-104,0 -110,-10 -110,-30 L-110,-220 C-110,-246 -96,-256 -70,-256 L70,-256 C96,-256 110,-246 110,-220 L110,-30 C110,-10 104,0 90,0 Z", "rgba(214,232,240,0.6)", { w: 6 });
  ctx.save(); ctx.globalAlpha = 1; to(ctx, `M-100,-10 L-100,${-10 - 200 * (o.day ?? 0.85)} L100,${-10 - 200 * (o.day ?? 0.85)} L100,-10 Z`, "#c98d4e"); for (let i = 0; i < 26; i++) { const q = rng(1800 + i); to(ctx, elip(-90 + q() * 180, -20 - q() * 190 * (o.day ?? 0.85), 6, 3), "#a86e35"); } ctx.restore();
  net(ctx, "M-90,0 C-104,0 -110,-10 -110,-30 L-110,-220 C-110,-246 -96,-256 -70,-256 L70,-256 C96,-256 110,-246 110,-220 L110,-30 C110,-10 104,0 90,0 Z", { w: 6, kin: true });
  ve(ctx, rect(-96, -300, 192, 52, 10), "#d9473f", { w: 6 }); net(ctx, "M-100,-270 C-40,-262 40,-262 100,-270", { w: 5, mau: "#e8c35a" });
  ctx.save(); ctx.rotate(-0.04); ve(ctx, rect(-104, -190, 208, o.dong2 ? 128 : 84, 4), "#fdfbf2", { w: 4 });
  viet(ctx, "Ruốc. Ăn dần.", 0, -138, { size: 40, pop: false, soi: false, font: "Patrick Hand" });
  if (o.dong2) viet(ctx, o.dong2, 0, -82, { size: 32, pop: false, soi: false, u: o.u2 ?? 1, mau: "#3a4a8a" });
  ctx.restore(); ctx.restore();
}
export function batCom(ctx, x, y, k = 1, o = {}) {   // bát cơm trắng (+ ruốc)
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-110,-40 C-80,-110 80,-110 110,-40 Z", "#fffef8", { w: 5 }); for (let i = 0; i < 12; i++) { const q = rng(1900 + i); to(ctx, elip(-70 + q() * 140, -70 + q() * 26, 8, 5), "#ece6d6"); }
  if (o.ruoc) for (let i = 0; i < 14; i++) { const q = rng(1950 + i); to(ctx, elip(-50 + q() * 100, -70 + q() * 26, 7, 3), "#c98d4e"); }
  ve(ctx, "M-120,-40 L120,-40 C114,30 60,60 0,60 C-60,60 -114,30 -120,-40 Z", "#ffffff", { w: 5.5 }); net(ctx, "M-104,0 C-60,14 60,14 104,0", { w: 4, mau: "#4a8fd1" });
  ctx.restore();
}
/* thẻ chương: chữ số + tên viết tay, gạch chân chạy */
export function theChuong(ctx, t, tl, so, ten) {
  giay(ctx);
  for (let i = 0; i < 8; i++) { const q = rng(2000 + so * 10 + i); sao(ctx, 200 + q() * 1520, 160 + q() * 760, 10 + q() * 10, t + i, i % 2 ? "#ffd76a" : "#f39c9c"); }
  viet(ctx, `${so}.`, W / 2, 430, { size: 150, mau: "#e0392f", u: vao(tl, 0.0, 0.25) });
  const w = viet(ctx, ten, W / 2, 610, { size: 110, u: vao(tl, 0.15, 0.3) }) ?? 600;
  const u = vao(tl, 0.35, 0.5); if (u > 0) netPts(ctx, [[W / 2 - w / 2, 650], [W / 2 - w / 2 + w * u, 652]], { w: 7, mau: "#e0392f" });
}
/* chữ thoại: tên người nói nhỏ + lời to (dùng cho câu thoại của nhân vật) */
export function loiThoai(ctx, ai, s, x, y, tl, t0 = 0, o = {}) {
  viet(ctx, ai, x, y - (o.size ?? 72) - 14, { size: 40, mau: "#6b6560", u: vao(tl, t0) });
  viet(ctx, s, x, y, { size: o.size ?? 72, mau: o.mau ?? MUC, u: vao(tl, t0 + 0.08), xoay: o.xoay ?? 0 });
}
export { D, veNV, banTay, DA };
