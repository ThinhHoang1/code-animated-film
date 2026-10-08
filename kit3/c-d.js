// Cảnh câu 83–109 (chương 9 "Bài nói thật", 10 "Ruốc. Ăn dần.", 11 "Giỗ ông ngoại") + đoạn kết.
// m(c, i) = giây của chữ thứ i trong giọng đọc (xem moc-doc.md).
import { W, H, MUC, GIAY, giay, viet, doRong, ve, vePts, net, netPts, to, toPts, bong, elip, rect, moHoi, gan, sao, tiaNhan, rung, vanLanh, dauHoi,
  T12, clamp, lerp, eio, eout, back, pha, on, rng } from "./but.js";
import { veNV, banTay, DA } from "./nv.js";
import * as D from "./do.js";
import { m, vao, cam, lac, chop, toi, muiTen, khoanh, gachCheo, duaDua, avatar, hoa, anhSushi, tayCanh, phongDem, phongNgay, HX, HY, HK, local,
  banLamViec, nhaMe, benXe, threadsCity, zalo, threadsBai, loRuoc, batCom } from "./chung.js";

const DO = "#e0392f", XANH = "#2f9e57";
const doan = (x1, y1, x2, y2, n = 14) => Array.from({ length: n + 1 }, (_, i) => [lerp(x1, x2, i / n), lerp(y1, y2, i / n)]);   // đoạn thẳng nhiều điểm (nét không bị vuốt mảnh)
function gach(ctx, x0, y0, x1, y1, u = 1, mau = DO, w = 12) { if (u <= 0) return; netPts(ctx, doan(x0, y0, lerp(x0, x1, u), lerp(y0, y1, u)), { w, mau, seed: 431, dau: 0.08 }); }
const chu = (ctx, s, x, y, tl, t0, o = {}) => viet(ctx, s, x, y, { size: 80, ...o, u: vao(tl, t0, o.d ?? 0.22) });

/* ── đạo cụ riêng ── */
function anhCom(g) {   // ảnh bài đăng thật: bát cơm trắng + lọ ruốc dưới đèn bàn (vẽ trong ô 520×300 tâm 0,0)
  to(g, rect(-260, -150, 520, 300, 0), "#4d5578"); to(g, rect(-260, 60, 520, 90, 0), "#b98a5c");
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.16; to(g, elip(0, 40, 260, 150), "#ffd36a"); g.restore();
  batCom(g, -90, 90, 0.95); loRuoc(g, 120, 140, 0.62);
}
function binhLuan(ctx, x, y, s, seed, k = 1, xoay = 0, o = {}) {   // bong bóng bình luận có avatar
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  const sz = o.size ?? 44, w = doRong(ctx, s, sz) + 116;
  ve(ctx, rect(-w / 2, -44, w, 88, 30), o.nen ?? "#ffffff", { w: 5, seed: seed + 3 });
  avatar(ctx, -w / 2 + 44, 0, 27, seed, o.av ?? {});
  viet(ctx, s, -w / 2 + 82, 15, { size: sz, pop: false, can: "left", mau: o.mau ?? MUC });
  ctx.restore();
}
function nhaTam(ctx) {   // nhà vệ sinh phòng trọ
  giay(ctx, "#cfe6ee");
  for (let r = 0; r < 10; r++) netPts(ctx, doan(-10, r * 110, W + 10, r * 110), { w: 2.5, mau: "#a9cbd6", seed: 2100 + r });
  for (let i = 0; i < 18; i++) netPts(ctx, doan(i * 110, -10, i * 110, H + 10), { w: 2.5, mau: "#a9cbd6", seed: 2120 + i });
  ve(ctx, rect(640, 80, 600, 420, 30), "#e9f6fb", { w: 7 }); net(ctx, "M700,140 L780,220 M720,200 L760,240", { w: 5, mau: "#ffffff" });
  ve(ctx, rect(380, 700, 1160, 70, 10), "#ffffff", { w: 6 }); ve(ctx, rect(420, 770, 1080, 330, 0), "#e8eef2", { w: 6 });
  ve(ctx, elip(960, 716, 220, 30), "#d6e4ea", { w: 5 }); ve(ctx, "M940,700 L940,640 C940,620 990,620 1000,640", null, { w: 9 });
}
function ocSen(ctx, x, y, k, t) {   // ốc sên cõng tờ tin
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-120,0 C-120,-24 60,-24 120,-6 C140,0 140,14 120,16 L-110,16 C-124,16 -126,6 -120,0 Z", "#cfd8a8", { w: 5 });
  netPts(ctx, doan(100, -10, 110, -60), { w: 4 }); netPts(ctx, doan(124, -8, 146, -54), { w: 4 }); to(ctx, elip(110, -62, 7, 7), MUC); to(ctx, elip(146, -56, 7, 7), MUC);
  ve(ctx, elip(-10, -70, 80, 74), "#e8a95a", { w: 6 }); net(ctx, "M-10,-70 C10,-90 30,-60 10,-44 C-14,-30 -40,-60 -24,-90 C-4,-118 40,-110 52,-74", { w: 5 });
  ctx.save(); ctx.translate(-10, -150); ctx.rotate(-0.12); ve(ctx, rect(-70, -40, 140, 80, 6), "#fdfbf2", { w: 4.5 }); viet(ctx, "TIN", 0, 14, { size: 40, pop: false }); ctx.restore();
  ctx.restore();
}
function tenLua(ctx, x, y, k, t, lua = 1) {   // bài đăng thành tên lửa
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  for (let i = 0; i < 3; i++) { const f = 1 + 0.25 * on(t * 18 + i * 3, 50 + i), h = (140 + i * 40) * lua * f; ve(ctx, `M${-50 + i * 50 - 30},170 C${-50 + i * 50 - 40},${170 + h * 0.5} ${-50 + i * 50},${170 + h} ${-50 + i * 50},${170 + h} C${-50 + i * 50},${170 + h} ${-50 + i * 50 + 40},${170 + h * 0.5} ${-50 + i * 50 + 30},170 Z`, i === 1 ? "#ffd23e" : "#ff8a3d", { w: 4, seed: 2200 + i }); }
  for (const s of [-1, 1]) ve(ctx, `M${s * 100},70 L${s * 170},190 L${s * 100},170 Z`, DO, { w: 5 });
  ve(ctx, "M-100,-130 C-100,-230 -40,-300 0,-330 C40,-300 100,-230 100,-130 Z", DO, { w: 6 });
  ve(ctx, rect(-100, -140, 200, 320, 20), "#ffffff", { w: 6 });
  avatar(ctx, -56, -96, 22, 0, { xam: true }); to(ctx, rect(-26, -106, 100, 12, 6), "#bfc4cf"); to(ctx, rect(-26, -86, 70, 10, 5), "#bfc4cf");
  ctx.save(); ctx.translate(0, 30); ctx.beginPath(); ctx.rect(-80, -60, 160, 120); ctx.clip(); ctx.scale(0.31, 0.4); anhCom(ctx); ctx.restore(); net(ctx, rect(-80, -30, 160, 120, 8), { w: 4 });
  ctx.restore();
}
function toaNha(ctx, t, sang) {   // khu nhà tối, ô cửa sáng dần: sang = tập chỉ số cửa đang sáng
  giay(ctx, "#121630"); for (let i = 0; i < 30; i++) { const q = rng(2300 + i); sao(ctx, q() * W, q() * 260, 4 + q() * 5, t + i, "#fff6d0"); }
  ve(ctx, rect(150, 170, 1620, 990, 10), "#2a2f4f", { w: 6 }); ve(ctx, "M110,180 L960,60 L1810,180 Z", "#232845", { w: 6 });
  for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) {
    const i = r * 8 + c, x = 230 + c * 190, y = 230 + r * 170;
    ve(ctx, rect(x, y, 130, 110, 6), sang.has(i) ? "#ffd86b" : "#1b2040", { w: 4.5, seed: 2400 + i });
    if (sang.has(i)) { avatar(ctx, x + 65, y + 66, 26, 0, { xam: true }); to(ctx, rect(x + 76, y + 76, 26, 34, 4), "#9fd3ea"); }
    netPts(ctx, doan(x + 65, y + 4, x + 65, y + 106), { w: 3.5, seed: 2450 + i });
  }
}
function dongLua(ctx, t) {   // đồng lúa quê
  giay(ctx, "#d6eef7");
  ve(ctx, "M-20,420 C200,300 360,320 520,400 C700,280 900,300 1100,410 C1300,300 1560,290 1940,410 L1940,520 L-20,520 Z", "#9cc7b0", { w: 5 });
  to(ctx, rect(0, 500, W, 580, 0), "#9fd36b");
  for (let r = 0; r < 6; r++) { const y = 520 + r * 95; netPts(ctx, doan(-10, y, W + 10, y + 10), { w: 4, mau: "#6fae45", seed: 2500 + r }); for (let i = 0; i < 26; i++) netPts(ctx, [[i * 76 + (r % 2) * 38, y + 70], [i * 76 + (r % 2) * 38 + 6, y + 30]], { w: 3, mau: "#5f9a3a", seed: 2520 + r * 30 + i }); }
  ve(ctx, "M-20,1000 C500,900 1300,900 1940,960 L1940,1100 L-20,1100 Z", "#d9c08f", { w: 5 });
  ve(ctx, rect(1560, 330, 260, 180, 6), "#f6e3a0", { w: 5 }); ve(ctx, "M1530,340 L1690,240 L1850,340 Z", "#c9573f", { w: 5 });
}
function banTho(ctx, x, y, k, t) {   // bàn thờ + ảnh ông ngoại + nhang khói
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, rect(-360, 0, 720, 60, 8), "#8a3a2a", { w: 6 }); ve(ctx, rect(-330, 60, 40, 300, 6), "#7a2f22", { w: 5 }); ve(ctx, rect(290, 60, 40, 300, 6), "#7a2f22", { w: 5 });
  ve(ctx, rect(-110, -300, 220, 280, 10), "#c9a24a", { w: 6 }); to(ctx, rect(-88, -278, 176, 236, 6), "#efe6d2");
  ctx.save(); ctx.beginPath(); ctx.rect(-88, -278, 176, 236); ctx.clip(); veNV(ctx, 0, -120, 0.62, { t: 0, kieu: "hung", C: { toc: "#e9e9e9", ao: "#5a5a6a", aoB: "#48485a", kAo: "polo" }, mat: "thuong", chan: false }); ctx.restore();
  ve(ctx, rect(-30, -20, 60, 24, 4), "#c9a24a", { w: 4 });
  for (const s of [-1, 1]) { ve(ctx, rect(s * 220 - 14, -110, 28, 110, 4), "#f4e9d0", { w: 4 }); ve(ctx, elip(s * 220, -122, 8, 14), "#ffb347", { w: 3 }); }
  ve(ctx, elip(170 - 330, -30, 70, 30), "#f4c430", { w: 4 }); for (const [a, b] of [[-190, -60], [-150, -64], [-170, -86]]) ve(ctx, elip(a, b, 22, 22), "#ff9d2e", { w: 4 });
  ve(ctx, "M120,-60 C120,-110 220,-110 220,-60 Z", "#ffe56b", { w: 4 });
  ve(ctx, rect(-50, -60, 100, 40, 8), "#9c6a44", { w: 4 }); for (let i = -1; i <= 1; i++) { netPts(ctx, doan(i * 18, -60, i * 20, -150), { w: 4, mau: "#b5352f", seed: 2600 + i }); const pts = []; for (let j = 0; j <= 10; j++) pts.push([i * 20 + Math.sin(j * 0.9 + t * 3 + i) * 12, -160 - j * 14]); ctx.save(); ctx.globalAlpha = 0.6; netPts(ctx, pts, { w: 3.5, mau: "#b9b4ab", seed: 2610 + i }); ctx.restore(); }
  ctx.restore();
}
function maCo(ctx, x, y, k = 1, o = {}) {   // mâm cỗ giỗ (nhìn chếch), o.gio = số miếng giò còn trên đĩa
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, elip(0, 0, 520, 120), "#b5352f", { w: 6 }); ve(ctx, elip(0, -8, 480, 100), "#cf4a3d", { w: 4 });
  ve(ctx, elip(-260, -20, 110, 36), "#ffffff", { w: 4.5 }); for (let i = 0; i < (o.gio ?? 6); i++) { const gx = -320 + (i % 3) * 56, gy = -36 + Math.floor(i / 3) * 26; ve(ctx, elip(gx, gy, 26 + (i === 0 ? 6 : 0), 14 + (i === 0 ? 3 : 0)), "#f6d9cf", { w: 3.5 }); net(ctx, elip(gx, gy, 14, 7), { w: 2.5, mau: "#c9a08a" }); }
  ve(ctx, elip(-20, -40, 110, 40), "#ffffff", { w: 4.5 }); ve(ctx, "M-100,-40 C-100,-110 60,-110 60,-40 Z", "#e2453c", { w: 4.5 });
  ve(ctx, elip(230, -30, 120, 40), "#ffffff", { w: 4.5 }); ve(ctx, "M150,-36 C150,-90 310,-96 320,-40 C300,-20 170,-18 150,-36 Z", "#f2c14e", { w: 4.5 });
  for (const [a, b] of [[-400, 40], [-150, 50], [110, 50], [380, 40]]) { ve(ctx, "M-26,-8 L26,-8 L18,22 L-18,22 Z".replace(/(-?\d+),(-?\d+)/g, (s, p, q) => `${a + +p},${b + +q}`), "#ffffff", { w: 3.5 }); }
  ctx.restore();
}
function nhaGio(ctx, t, o = {}) {   // trong nhà ngày giỗ: tường, bàn thờ, chiếu
  giay(ctx, "#f3d9a0"); to(ctx, rect(0, 640, W, 440, 0), "#c99a62"); netPts(ctx, doan(-10, 640, W + 10, 640), { w: 6 });
  if (o.tho !== false) banTho(ctx, 960, 300, 0.62, t);
  ve(ctx, "M80,700 L1840,700 L1920,1090 L0,1090 Z", "#f0d68a", { w: 5 }); for (let i = 0; i < 14; i++) netPts(ctx, doan(80 + i * 136, 700, i * 148, 1090), { w: 4, mau: "#d9443b", seed: 2700 + i });
}
const HANG = [["diut", 300], ["hung", 560], ["thoa", 820], ["me", 1080], ["tuan", 1340], ["hieu", 1600]];
const TUAN_GIO = { ao: "#7fa7c9", aoB: "#6187a9", kAo: "thun" };
function hangHo(ctx, t, rieng = {}, k = 0.78, y = 600) {   // cả họ ngồi sau mâm; rieng[kieu] = ghi đè tư thế
  for (const [kieu, x] of HANG) veNV(ctx, x, y, k, { t, kieu, chan: false, mat: "cuoi", C: kieu === "tuan" ? TUAN_GIO : undefined, say: kieu === "hung" ? 0.8 : 0, ...(rieng[kieu] ?? {}) });
}
function chen(ctx, x, y, k = 1) { ve(ctx, "M-26,-20 L26,-20 L18,16 L-18,16 Z".replace(/(-?\d+),(-?\d+)/g, (s, p, q) => `${x + p * k},${y + q * k}`), "#ffffff", { w: 4 }); to(ctx, elip(x, y - 16 * k, 22 * k, 5 * k), "#f6e7b0"); }
function thung(ctx, x, y, k, mo = 0) {   // thùng các-tông
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, rect(-200, -160, 400, 260, 6), "#d6a66a", { w: 6 });
  if (mo < 0.5) { ve(ctx, rect(-200, -170, 400, 30, 4), "#c99456", { w: 5 }); ve(ctx, rect(-30, -170, 60, 270, 0), "rgba(240,230,200,0.7)", { w: 3 }); viet(ctx, "Gửi: Hiếu", 0, -60, { size: 50, pop: false }); viet(ctx, "HÀ NỘI", 0, 10, { size: 44, mau: DO, pop: false }); }
  else { ve(ctx, "M-200,-160 L-260,-260 L-60,-230 L0,-160 Z", "#c99456", { w: 5 }); ve(ctx, "M200,-160 L260,-260 L60,-230 L0,-160 Z", "#c99456", { w: 5 }); }
  ctx.restore();
}
function de(ctx, x, y, k, t) {   // con dế
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, elip(0, 0, 70, 30), "#6b4a2a", { w: 5 }); ve(ctx, elip(70, -6, 24, 22), "#5a3a20", { w: 5 }); to(ctx, elip(78, -12, 5, 5), "#fff");
  for (const s of [-1, 1]) netPts(ctx, [[80, -24], [120 + s * 10, -90 - Math.sin(t * 6) * 8]], { w: 3 });
  net(ctx, "M-30,20 L-60,50 L-90,30 M10,24 L0,56 M40,22 L56,52", { w: 4 });
  ctx.restore();
}
function hieuNam(ctx, t, x, y, k, mat, o = {}) {   // Hiếu nằm ngửa trên nệm, nhìn từ trên xuống, đầu bên trái
  ve(ctx, rect(x - 420 * k, y - 190 * k, 900 * k, 380 * k, 30 * k), "#e8edf7", { w: 6 });
  ve(ctx, rect(x - 400 * k, y - 120 * k, 170 * k, 240 * k, 50 * k), "#ffffff", { w: 5 });
  veNV(ctx, x - 150 * k, y, k, { t, mat, xoay: -Math.PI / 2, chan: false, nhin: o.nhin ?? [0, 0], tayT: o.tayT, tayP: o.tayP });
  if (o.chan !== false) { ve(ctx, rect(x - 80 * k, y - 175 * k, 540 * k, 350 * k, 40 * k), "#7fa6d9", { w: 6 }); for (let i = 0; i < 4; i++) netPts(ctx, [[x + (20 + i * 120) * k, y - 170 * k], [x + (20 + i * 120) * k, y + 170 * k]], { w: 3, mau: "#5f86b9", seed: 2800 + i }); }
}

/* ── CÂU 83: mất ngủ → đăng Threads, lần này đăng thật ── */
function c83(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tNen = m(c, 6), tDang = m(c, 16), tLan = m(c, 18), tBam = m(c, 20);
  if (tl < tNen) {
    giay(ctx, "#3b405e"); for (let i = 0; i < 12; i++) netPts(ctx, doan(-10, i * 96, W + 10, i * 96 + 6), { w: 3, mau: "#33384f", seed: 2900 + i });
    hieuNam(ctx, t, 900, 560, 1.1, "bong");
    D.quat(ctx, 1700, 960, 0.7, t);
    chu(ctx, "đéo ngủ được", 1460, 220, tl, m(c, 3), { size: 96, mau: GIAY, xoay: -0.05 });
    viet(ctx, "2:00", 380, 200, { size: 80, mau: "#ffd93b", pop: false, xoay: -0.04 });
  } else if (tl < tDang) {
    // cả khu trọ: phòng nào cũng một thằng mất ngủ ôm điện thoại
    giay(ctx, "#121630"); ve(ctx, rect(200, 150, 1520, 880, 8), "#23284a", { w: 6 });
    for (let r = 0; r < 3; r++) for (let cc = 0; cc < 4; cc++) {
      const x = 240 + cc * 370, y = 190 + r * 280, i = r * 4 + cc, la = i === 5;
      ve(ctx, rect(x, y, 330, 240, 6), la ? "#4d5578" : "#2f355c", { w: 4.5, seed: 3000 + i });
      ve(ctx, rect(x + 30, y + 150, 270, 60, 14), "#e8edf7", { w: 3.5 });
      ctx.save(); ctx.translate(x + 120, y + 150); ctx.rotate(-0.15); avatar(ctx, 0, -18, 34, 3100 + i, la ? {} : {}); ctx.restore();
      ve(ctx, rect(x + 150, y + 108, 34, 52, 6), "#9fd3ea", { w: 3 });
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.18; to(ctx, elip(x + 150, y + 120, 90, 60), "#9fd3ea"); ctx.restore();
      if (la) { ve(ctx, rect(x + 70, y + 160, 120, 40, 10), "#f2b544", { w: 3.5 }); khoanh(ctx, x + 165, y + 130, 150, 110, vao(tl, tNen + 0.4, 0.5), "#ffd93b", 6); }
    }
    chu(ctx, "thằng mất ngủ nào cũng làm", W / 2, 110, tl, m(c, 10), { size: 72, mau: GIAY });
  } else if (tl < tBam - 0.15) {
    phongDem(ctx, t, { gio: 2, phut: 10, lich: false });
    const u = eout(vao(tq, tDang, 0.25));
    ve(ctx, rect(560, 760, 900, 160, 30), "#e8edf7", { w: 6 });
    veNV(ctx, 1010, lerp(820, 600, u), 1.15, { t, mat: u < 1 ? "ngac" : "tuc", chan: false, nhun: u < 1 ? 0 : -Math.abs(Math.sin(tq * 8)) * 6 });
    ve(ctx, rect(540, 800, 940, 140, 40), "#7fa6d9", { w: 6 });
    if (u < 1) tiaNhan(ctx, 1010, 300, 180, 240, 7, { mau: "#ffd93b", w: 6, goc: 0.35 });
    chu(ctx, "đăng Threads", 1540, 300, tl, tDang, { size: 90, mau: GIAY, xoay: 0.05 });
    chu(ctx, "lần này: THẬT", 1520, 430, tl, tLan, { size: 80, mau: "#ffd93b", xoay: -0.03 });
  } else {
    // cận màn hình: ngón cái bấm "Đăng"
    giay(ctx, "#1f2440");
    const bam = tl >= tBam ? 1 : 0;
    D.dienThoai(ctx, 960, 560, 3.4, 0, (g) => {
      g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280); viet(g, "Bài mới", 0, -100, { size: 20, pop: false, soi: false });
      avatar(g, -50, -78, 14, 0, { xam: true }); for (let i = 0; i < 3; i++) to(g, rect(-30, -88 + i * 16, 90 - i * 20, 8, 4), "#d5d9e0");
      ve(g, rect(-56, -30, 112, 70, 6), "#4d5578", { w: 2 }); g.save(); g.translate(0, 5); g.scale(0.21, 0.23); anhCom(g); g.restore();
      ve(g, rect(-48, 70, 96, 34, 17), bam ? "#555" : "#111", { w: 2 }); viet(g, "Đăng", 0, 94, { size: 22, mau: "#fff", pop: false, soi: false });
    });
    ctx.save(); ctx.translate(1060 + (bam ? 0 : 30), 960 - (bam ? 40 : 0)); ctx.rotate(-1.75); ctx.scale(3.2, 3.2); banTay(ctx, "chi", 1, 70); ctx.restore();
    if (bam) { tiaNhan(ctx, 960, 875, 70, 120, 7, { mau: "#ffd93b", w: 6, a0: -Math.PI / 2, goc: 0.45 }); viet(ctx, "đăng THẬT", 1560, 300, { size: 100, mau: "#ffd93b", u: vao(tl, tBam, 0.2), xoay: 0.05 }); }
  }
}
/* ── CÂU 84: acc không ảnh đại diện + ảnh bát cơm, lọ ruốc + mấy dòng ── */
function c84(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tTam = m(c, 7), tBat = m(c, 10), tLo = m(c, 13), tBang = m(c, 15), tDong = m(c, 21);
  if (tl < tTam) {
    giay(ctx);
    avatar(ctx, 760, 520, 230, 0, { xam: true }); dauHoi(ctx, 760, 600, 200, vao(tl, 0.4), "#9aa0ab");
    chu(ctx, "acc mới", 1360, 420, tl, 0.1, { size: 100 });
    chu(ctx, "không ảnh đại diện", 1360, 560, tl, m(c, 4), { size: 76, mau: DO, xoay: 0.03 });
  } else if (tl < tDong) {
    if (tl >= tBang) {   // cận băng dính chữ mẹ
      giay(ctx, "#4d5578"); to(ctx, rect(0, 900, W, 180, 0), "#c48b5c"); netPts(ctx, doan(-10, 900, W + 10, 900), { w: 6 });
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.14; to(ctx, elip(960, 600, 700, 420), "#ffd36a"); ctx.restore();
      const z = lerp(1, 1.08, eio(pha(tl, tBang, tDong))); ctx.save(); ctx.translate(960, 560); ctx.scale(z, z); ctx.translate(-960, -560);
      loRuoc(ctx, 960, 960, 2.5); ctx.restore();
      chu(ctx, "chữ mẹ", 1560, 260, tl, m(c, 17), { size: 90, mau: GIAY, xoay: 0.05 });
      return;
    }
    ctx.save(); cam(ctx, 1110, 470, 1.25);
    phongDem(ctx, t, { gio: 2, phut: 30, lich: false });
    const S = { mat: "nham", nhin: [-0.6, 0.6], tayT: { p: [-235, -30], cong: -30 }, tayP: { p: [-170, -60], cong: 40 } };
    banLamViec(ctx, t, S, { den: 1, thot: false, tren: (g) => {
      if (tl >= tBat) { const u = back(vao(tl, tBat, 0.25)); batCom(g, 960, 650, 1.0 * u); }
      if (tl >= tLo) { const u = back(vao(tl, tLo, 0.25)); loRuoc(g, 1330, 652, 0.8 * u); }
    } });
    const px = HX - 215 * HK, py = HY - 50 * HK;
    D.dienThoaiSau(ctx, px, py, 0.7, 0.5);
    veNV(ctx, HX, HY, HK, { t, ...S, chiTay: true });
    if (Math.floor(tq * 4) % 3 === 0 && tl > tBat + 0.3) tiaNhan(ctx, px + 40, py + 90, 90, 150, 6, { mau: "#fff", w: 6, a0: 0.9, goc: 0.4 });
    ctx.restore();
    if (tl < tBang) { chu(ctx, "bát cơm trắng", 420, 900, tl, tBat, { size: 76, mau: GIAY, xoay: -0.04 }); chu(ctx, "lọ ruốc", 1620, 900, tl, tLo, { size: 76, mau: GIAY, xoay: 0.04 }); }
  } else {
    // bài đăng hiện dần từng dòng theo lời đọc
    giay(ctx, "#eef1f6");
    const dong = [[m(c, 23), "Lương 8 triệu, trọ 5 triệu."], [m(c, 29), "100 nghìn một ngày."], [m(c, 33), "Gần 3 tháng bán 360 bữa omakase,"], [m(c, 41), "10 nghìn một bữa."], [m(c, 45), "Đây là bữa của tôi."]];
    const hien = dong.filter(([t0]) => tl >= t0).map(([, s]) => s);
    threadsBai(ctx, 960, 540, 1.42, t, { ten: "chưa có tên", av: { xam: true }, chu: hien.length ? hien : [" "], anh: anhCom, tim: 0 });
    if (tl >= m(c, 45)) { const h = 330 + 120 + hien.length * 46, yA = 540 + (-h / 2 + 130 + hien.length * 46 + 150) * 1.42; khoanh(ctx, 960, yA, 410, 240, vao(tl, m(c, 45) + 0.1, 0.5), DO, 7); }
  }
}
/* ── CÂU 85: đánh răng chưa xong, bài đã có người vào ── */
function c85(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tBai = m(c, 5);
  nhaTam(ctx);
  const vao2 = tl >= tBai, chai = Math.sin(tq * 20) * 10;
  const ra = {};
  veNV(ctx, 900, 560, 1.2, { t, mat: vao2 ? "ngac" : "nham", nhin: vao2 ? [0.8, 0.3] : [0, 0], chan: false, tayP: { p: [44 + chai * 0.3, -40], cong: 50, kieu: "nam" }, ra });
  if (ra.P) { const [hx, hy] = ra.P; netPts(ctx, doan(hx, hy - 6, hx - 70, hy - 18, 8), { w: 14, mau: "#4fb3e0", run: 0.6, dau: 0.05 }); ve(ctx, rect(hx - 96, hy - 34, 34, 22, 6), "#ffffff", { w: 3.5 }); }
  for (const [a, b, r] of [[870, 512, 16], [930, 516, 14], [900, 530, 12], [950, 500, 10]]) ve(ctx, elip(a, b, r, r * 0.8), "#ffffff", { w: 3 });
  ve(ctx, rect(380, 700, 1160, 70, 10), "#ffffff", { w: 6 });
  const run = vao2 ? (Math.floor(tq * 12) % 2 ? 6 : -6) : 0;
  D.dienThoai(ctx, 1360 + run, 610, 0.85, -0.05, (g) => {
    g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280);
    const n = vao2 ? Math.min(99, Math.floor(Math.pow((tl - tBai) * 6, 2)) + 1) : 0;
    for (let i = 0; i < Math.min(5, n); i++) { to(g, rect(-60, -100 + i * 40, 120, 30, 8), "#eef1f6"); avatar(g, -46, -85 + i * 40, 10, 3200 + i); to(g, rect(-30, -92 + i * 40, 70, 8, 4), "#c9ccd3"); }
    if (n) { ve(g, elip(50, -120, 26, 20), DO, { w: 2.5 }); viet(g, n >= 99 ? "99+" : String(n), 50, -112, { size: 22, mau: "#fff", pop: false, soi: false }); }
  });
  if (vao2) { rung(ctx, 1360, 610, 160, 2); chu(ctx, "bài đã có người vào!", 1340, 280, tl, tBai, { size: 76, mau: DO, xoay: 0.04 }); }
  else chu(ctx, "chưa đánh răng xong…", 560, 280, tl, 0.05, { size: 72, xoay: -0.04 });
}
/* ── CÂU 86: bình luận rơi như mưa đá lên đầu Hiếu ── */
function c86(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl);
  giay(ctx, "#dfe6ef");
  for (let i = 0; i < 26; i++) { const q = rng(3300 + i), x = q() * W, sp = 900 + q() * 600, y = ((tl * sp + q() * 1400) % 1500) - 200; ctx.save(); ctx.translate(x, y); ctx.rotate(q() - 0.5); ve(ctx, rect(-50, -20, 100, 40, 14), "#ffffff", { w: 3.5, seed: 3350 + i }); to(ctx, rect(-30, -4, 60, 8, 4), "#c9ccd3"); ctx.restore(); }
  const BL = [[m(c, 0), "Tám triệu mà cũng đăng?", 540, 150, -0.06, 11], [m(c, 5), "Mới ra trường mình đã 30 rồi.", 1390, 270, 0.05, 12], [m(c, 12), "100 nghìn một ngày ở Cầu Giấy?", 520, 400, 0.04, 13], [m(c, 19), "Chào mừng đến Threads City.", 1400, 520, -0.05, 14]];
  let dap = -1;
  BL.forEach(([t0], i) => { if (tl >= t0 + 0.3 && tl < t0 + 0.6) dap = t0 + 0.3; });
  ctx.save(); if (dap > 0) lac(ctx, tl, dap, 14, 0.3);
  veNV(ctx, 960, 840, 0.95, { t, mat: dap > 0 ? "soc" : "hoang", nhun: dap > 0 ? 16 : 0, co: dap > 0 ? 0.92 : 1, tayT: { p: [-150, -110], cong: -30, kieu: "xoe" }, tayP: { p: [150, -110], cong: 30, kieu: "xoe", lat: -1 } });
  if (dap > 0) { sao(ctx, 870, 620, 26, t); sao(ctx, 1060, 600, 22, t + 2); }
  ctx.restore();
  for (const [t0, s, xf, yf, xo, sd] of BL) {
    if (tl < t0) continue; const u = tl - t0; let x, y, r;
    if (u < 0.3) { const e = u / 0.3; x = lerp(xf, 960, 0.6); y = lerp(-120, 600, e * e); r = xo * 3; }
    else { const e = eout((u - 0.3) / 0.35); x = lerp(lerp(xf, 960, 0.6), xf, e); y = lerp(600, yf, e) - Math.sin(e * Math.PI) * 120; r = lerp(xo * 3, xo, e); }
    binhLuan(ctx, x, y, s, sd, 1.1, r, { size: 48 });
  }
}
/* ── CÂU 87: nói thật lần đầu thì bị check var ── */
function c87(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tThi = m(c, 10);
  if (tl < tThi) {
    giay(ctx);
    threadsBai(ctx, 1260, 520, 0.95, t, { ten: "chưa có tên", av: { xam: true }, chu: ["Đây là bữa của tôi."], anh: anhCom, tim: 3 });
    veNV(ctx, 480, 600, 1.15, { t, mat: "tuhao", ngh: -0.06, tayT: { p: [20, 70], cong: -20, kieu: "xoe", lat: -1 } });
    chu(ctx, "lần đầu nói thật", 480, 170, tl, m(c, 6) - 0.3, { size: 84, mau: XANH, xoay: -0.04 });
  } else {
    giay(ctx, "#f4efe4");
    threadsBai(ctx, 760, 520, 1.15, t, { ten: "chưa có tên", av: { xam: true }, chu: ["Đây là bữa của tôi."], anh: anhCom, tim: 3 });
    const sx = 700 + Math.sin(tq * 5) * 50, sy = 690 + Math.cos(tq * 4) * 26;
    ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, 120, 0, 7); ctx.clip(); ctx.translate(sx, sy); ctx.scale(1.9, 1.9); ctx.translate(-sx, -sy); threadsBai(ctx, 760, 520, 1.15, t, { ten: "chưa có tên", av: { xam: true }, chu: ["Đây là bữa của tôi."], anh: anhCom, tim: 3 }); ctx.restore();
    ve(ctx, elip(sx, sy, 120, 120), "rgba(220,240,255,0.18)", { w: 12, mau: "#5a4632" });
    const ra = {};
    veNV(ctx, 1500, 640, 1.1, { t, kieu: "thamtu", mat: "nheo", nhin: [-0.8, 0.3], tayT: { p: [-200, 40], cong: -20, kieu: "nam" }, ra });
    if (ra.T) { netPts(ctx, doan(sx + 84, sy + 84, ra.T[0] + 6, ra.T[1]), { w: 30, mau: MUC, run: 0.5, dau: 0.04 }); netPts(ctx, doan(sx + 84, sy + 84, ra.T[0] + 6, ra.T[1]), { w: 20, mau: "#7a5a3a", run: 0.5, dau: 0.04 }); }
    if (ra.T) { ctx.save(); ctx.translate(ra.T[0], ra.T[1]); banTay(ctx, "nam", 1, 71); ctx.restore(); }
    ctx.save(); ctx.translate(1520, 220); ctx.rotate(-0.12); const u = back(vao(tl, m(c, 12), 0.25)); ctx.scale(u, u); ve(ctx, rect(-230, -70, 460, 140, 14), "rgba(255,255,255,0)", { w: 9, mau: DO }); viet(ctx, "CHECK VAR", 0, 30, { size: 96, mau: DO, pop: false }); ctx.restore();
  }
}
/* ── CÂU 88: bình luận tiêu cực là nhiên liệu → bài thành tên lửa lên top ── */
function c88(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tNL = m(c, 8), tBa = m(c, 10), t20 = m(c, 21), tDem = m(c, 23), tChui = m(c, 32), tTop = m(c, 37);
  if (tl < tBa) {
    giay(ctx);
    veNV(ctx, 960, 470, 1.05, { t, mat: tl >= tNL ? "ngac" : "thuong", nhin: [0, 0.6], tayT: { p: [-200, 130], cong: -20 }, tayP: { p: [200, 130], cong: 20 } });
    ctx.save(); ctx.translate(960, 760); ctx.rotate(-0.03);
    ve(ctx, rect(-330, -240, 660, 480, 6), "#fdfbf2", { w: 6 }); viet(ctx, "BÁO MẠNG", -170, -170, { size: 56, pop: false }); netPts(ctx, doan(-300, -150, 300, -150), { w: 4 });
    viet(ctx, "Bình luận tiêu cực", 0, -70, { size: 64, pop: false, u: vao(tl, m(c, 3)) }); viet(ctx, "= NHIÊN LIỆU", 0, 10, { size: 70, mau: DO, pop: false, u: vao(tl, tNL) });
    for (let i = 0; i < 5; i++) to(ctx, rect(-290, 60 + i * 30, i % 2 ? 300 : 360, 12, 6), "#d5d9e0");
    if (tl >= tNL) { ctx.save(); ctx.translate(200, 130); ctx.scale(back(vao(tl, tNL, 0.25)), back(vao(tl, tNL, 0.25))); ve(ctx, rect(-50, -80, 100, 150, 10), DO, { w: 5 }); ve(ctx, rect(-30, -60, 60, 40, 6), "#fff", { w: 3.5 }); net(ctx, "M50,-40 C90,-40 90,40 70,60", { w: 6 }); ctx.restore(); }
    ctx.restore();
  } else if (tl < tDem) {
    giay(ctx, "#f4efe4");
    const tim = [12, 7, 19, 4];
    for (let i = 0; i < 4; i++) { const u = vao(tl, tBa + i * 0.25, 0.25); if (u <= 0) continue; anhSushi(ctx, 330 + i * 420, 440, 0.95 * back(u), (i - 1.5) * 0.04); viet(ctx, `♥ ${tim[i]}`, 330 + i * 420, 680, { size: 64, mau: DO, pop: false }); }
    chu(ctx, "3 tháng phông bạt", W / 2, 140, tl, tBa, { size: 84 });
    chu(ctx, "chưa bài nào quá 20 tim", W / 2, 860, tl, t20 - 0.6, { size: 84, mau: DO });
    veNV(ctx, 1700, 1000, 0.75, { t, mat: "chan", chan: false });
  } else {
    // đêm nói thật: cả thành phố chửi → nhiên liệu đẩy tên lửa lên top
    giay(ctx, "#171b33"); for (let i = 0; i < 24; i++) { const q = rng(3400 + i); sao(ctx, q() * W, q() * H * 0.7, 4 + q() * 6, t + i, "#fff6d0"); }
    const qd = rng(3450); for (let i = 0; i < 12; i++) { const w = 120 + qd() * 80, h = 120 + qd() * 220; ve(ctx, rect(i * 165 - 20, 1080 - h, w, h + 20, 10), "#262c4f", { w: 4.5, seed: 3460 + i }); }
    const lua = tl >= tChui ? 1.6 : 1, u = eio(pha(tl, tDem, tTop + 0.2)), y = lerp(860, 330, u);
    for (let i = 0; i < 9; i++) {   // bình luận chửi bay vào đuôi
      const q = rng(3500 + i), t0 = tDem + 0.2 + i * 0.32; if (tl < t0) continue; const e = clamp((tl - t0) / 0.6); if (e >= 1) continue;
      const x0 = q() > 0.5 ? -120 : W + 120, y0 = 300 + q() * 600;
      ctx.save(); ctx.translate(lerp(x0, 960, e), lerp(y0, y + 300, e)); ctx.scale(1 - e * 0.6, 1 - e * 0.6); ve(ctx, rect(-110, -38, 220, 76, 26), "#ffffff", { w: 4.5, seed: 3550 + i }); gan(ctx, -60, 0, 0.6); viet(ctx, ["ảo!", "nghèo!", "fake", "đăng làm gì", "khóc à?"][i % 5], 24, 14, { size: 38, mau: DO, pop: false }); ctx.restore();
    }
    tenLua(ctx, 960 + on(tl * 30, 7) * 6, y, 1.0, t, lua);
    chu(ctx, "cả thành phố xúm vào chửi", W / 2, 110, tl, m(c, 27), { size: 74, mau: GIAY });
    if (tl >= tTop) { const k = back(vao(tl, tTop, 0.3)); ctx.save(); ctx.translate(1560, 300); ctx.scale(k, k); sao(ctx, 0, 0, 120, t, "#ffd23e"); viet(ctx, "TOP", 0, 22, { size: 64, mau: DO, pop: false }); ctx.restore(); }
  }
}
/* ── CÂU 89: thức tới sáng vì hộp thư, toàn tài khoản không ảnh đại diện ── */
function c89(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tToan = m(c, 11), tGiong = m(c, 18);
  if (tl < tToan) {
    const u = clamp(tl / tToan), sang = u > 0.55;
    phongDem(ctx, t, { gio: 2 + u * 4, phut: (u * 240) % 60, lich: false });
    if (sang) { D.cuaSo(ctx, 130, 120, 440, 320, t, false); ctx.save(); ctx.beginPath(); ctx.rect(130, 120, 440, 320); ctx.clip(); ctx.globalAlpha = 0.45; ctx.fillStyle = "#ff9d5c"; ctx.fillRect(130, 120, 440, 320); ctx.globalAlpha = 1; ve(ctx, elip(350, 440, 80, 80), "#ffd23e", { w: 5 }); ctx.restore(); ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.08; ctx.fillStyle = "#ffb07a"; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    ve(ctx, rect(560, 760, 900, 160, 30), "#e8edf7", { w: 6 });
    veNV(ctx, 1010, 600, 1.15, { t, mat: "bong", nhin: [0, 0.7], chan: false, tayT: { p: [-40, 90], cong: -20 }, tayP: { p: [40, 90], cong: 20 } });
    D.dienThoaiSau(ctx, 1010, 600 + 92 * 1.15, 0.62, 0);
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.12; to(ctx, elip(1010, 520, 220, 170), "#9fd3ea"); ctx.restore();
    ve(ctx, rect(540, 800, 940, 140, 40), "#7fa6d9", { w: 6 });
    chu(ctx, "thức tới sáng", 1530, 290, tl, m(c, 4), { size: 90, mau: sang ? MUC : GIAY, xoay: 0.04 });
  } else {
    giay(ctx, "#1f2440");
    D.dienThoai(ctx, 760, 560, 3.3, 0, (g) => {
      g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280); viet(g, "Hộp thư (47)", -4, -100, { size: 20, pop: false, soi: false }); netPts(g, doan(-70, -92, 70, -92, 6), { w: 2 });
      for (let i = 0; i < 6; i++) { const u = vao(tl, tToan + i * 0.15, 0.2); if (u <= 0) continue; g.save(); g.translate(0, -66 + i * 36); g.scale(1, back(u)); avatar(g, -52, 0, 14, 0, { xam: true }); to(g, rect(-32, -9, 80, 7, 3), "#9aa0ab"); to(g, rect(-32, 3, 60, 6, 3), "#d5d9e0"); to(g, elip(60, 0, 4, 4), "#2f7fe0"); g.restore(); }
    });
    chu(ctx, "toàn acc không ảnh", 1440, 320, tl, tToan + 0.4, { size: 80, mau: GIAY });
    if (tl >= tGiong) { avatar(ctx, 1440, 620, 110, 0, { xam: true }); viet(ctx, "= tôi", 1440, 860, { size: 96, mau: DO, u: vao(tl, tGiong + 0.1) }); }
  }
}
/* ── CÂU 90: mỗi tin nhắn là một ô cửa sáng trong khu nhà tối ── */
function c90(ctx, t, uf, c) {
  const tl = c.tl;
  const TIN = [[m(c, 0), 9, ["Mình cũng thế."]], [m(c, 3), 14, ["Đừng xoá bài nhé."]], [m(c, 7), 26, ["Không dám bình luận,", "sếp mình có Threads."]], [m(c, 16), 35, ["Không dám,", "mẹ mình có Zalo."]]];
  const sang = new Set(); const them = [2, 20, 31, 5, 17, 38, 11, 28, 22, 0, 36, 13, 25, 7, 33, 19];
  TIN.forEach(([t0, i]) => { if (tl >= t0) sang.add(i); });
  them.forEach((i, k) => { if (tl >= 0.3 + k * 0.35) sang.add(i); });
  toaNha(ctx, t, sang);
  for (const [t0, i, dong] of TIN) {
    if (tl < t0) continue; const r = Math.floor(i / 8), cc = i % 8, wx = 230 + cc * 190 + 65, wy = 230 + r * 170;
    const u = back(vao(tl, t0, 0.25)), sz = 46, w = Math.max(...dong.map((s) => doRong(ctx, s, sz))) + 60, h = dong.length * 54 + 36;
    const bx = clamp(wx, w / 2 + 30, W - w / 2 - 30), by = wy - h / 2 - 20;
    ctx.save(); ctx.translate(bx, by); ctx.scale(u, u);
    ve(ctx, rect(-w / 2, -h / 2, w, h, 22), "#ffffff", { w: 5, seed: 3600 + i }); ve(ctx, `M${wx - bx - 16},${h / 2 - 2} L${wx - bx},${h / 2 + 26} L${wx - bx + 16},${h / 2 - 2} Z`, "#ffffff", { w: 0 });
    dong.forEach((s, j) => viet(ctx, s, 0, -h / 2 + 58 + j * 54, { size: sz, pop: false }));
    ctx.restore();
  }
}
/* ── CÂU 91: "Cục Thống kê" dưới bài: bình luận khai 30 triệu, hộp thư không ai dám ghi số ── */
function c91(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tPhan = m(c, 16), tHop = m(c, 26), tDeo = m(c, 28);
  giay(ctx);
  if (tl < tPhan) {
    veNV(ctx, 760, 560, 1.15, { t, mat: "nham", kinh: true, nhin: [0.4, 0.6], tayP: { p: [70, 60], cong: 20 }, tayT: { p: [-60, 70], cong: -20 } });
    ctx.save(); ctx.translate(800, 660); ctx.rotate(-0.08); ve(ctx, rect(-80, -110, 160, 220, 12), "#5a6b8a", { w: 5 }); ve(ctx, rect(-60, -90, 120, 50, 6), "#cfe8c0", { w: 3.5 }); viet(ctx, String(Math.floor(tq * 37) % 99999), 40, -54, { size: 30, pop: false, can: "right" }); for (let i = 0; i < 9; i++) ve(ctx, rect(-58 + (i % 3) * 42, -24 + Math.floor(i / 3) * 40, 32, 30, 6), "#e9ecef", { w: 3 }); ctx.restore();
    veNV(ctx, 760, 560, 1.15, { t, chiTay: true, tayP: { p: [70, 60], cong: 20 }, tayT: { p: [-60, 70], cong: -20 } });
    chu(ctx, "Cục Thống kê", 1420, 330, tl, m(c, 5), { size: 96, xoay: 0.04 }); chu(ctx, "(tự phong)", 1440, 440, tl, m(c, 6) + 0.2, { size: 60, mau: "#6b6560" });
    chu(ctx, "thu nhập bình quân", 1420, 600, tl, m(c, 8), { size: 72, mau: XANH });
  } else {
    netPts(ctx, doan(300, 900, 1650, 900), { w: 7 }); netPts(ctx, doan(300, 900, 300, 150), { w: 7 });
    const h = 620 * eout(vao(tl, tPhan, 0.8));
    ve(ctx, rect(480, 900 - h, 300, h, 8), "#ff8aa8", { w: 6 });
    viet(ctx, "bình luận", 630, 980, { size: 64, pop: false }); if (h > 500) { viet(ctx, "30 triệu+", 630, 900 - h - 40, { size: 72, mau: DO, u: vao(tl, m(c, 24)) }); for (let i = 0; i < 4; i++) avatar(ctx, 520 + i * 72, 900 - h + 50, 28, 3700 + i); }
    if (tl >= tHop) { viet(ctx, "hộp thư", 1200, 980, { size: 64, u: vao(tl, tHop) }); net(ctx, rect(1050, 400, 300, 500, 8), { w: 5, mau: "#9aa0ab" }); dauHoi(ctx, 1200, 760, 300, vao(tl, tDeo, 0.3), "#6b6560"); }
    if (tl >= tDeo) chu(ctx, "đéo ai dám ghi số", 1420, 250, tl, tDeo + 0.2, { size: 72, xoay: 0.04 });
  }
}
/* ── CÂU 92: bài trôi về Zalo họ; tin thường chậm một năm, bài chửi nhau chỉ ba hôm ── */
function c92(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tBai = m(c, 3), tTin = m(c, 10), tChui = m(c, 19);
  dongLua(ctx, t);
  if (tl < tTin) {
    chu(ctx, "3 hôm sau", 360, 200, tl, 0.05, { size: 90, xoay: -0.05 });
    zalo(ctx, 1380, 600, 2.3, t, { tieuDe: "Nhà Ngoại", tin: tl >= m(c, 7) ? [{ ai: 4, chu: "ai đăng mà thương thế", anh: (g) => { g.scale(0.22, 0.27); anhCom(g); } }] : [] });
    if (tl < m(c, 7) + 0.1) { const u = eio(pha(tl, tBai, m(c, 7) + 0.1)); const x = lerp(-150, 1380, u), y = lerp(250, 520, u) - Math.sin(u * Math.PI) * 220; ctx.save(); ctx.translate(x, y); ctx.rotate(0.2 - u * 0.3); ve(ctx, rect(-120, -80, 240, 160, 14), "#ffffff", { w: 5 }); ctx.save(); ctx.translate(0, 10); ctx.scale(0.4, 0.4); anhCom(ctx); ctx.restore(); ctx.restore(); for (let i = 1; i < 4; i++) netPts(ctx, doan(x - 140 - i * 30, y + i * 10, x - 200 - i * 40, y + i * 14), { w: 4, mau: "#ffffff", seed: 3800 + i }); }
  } else {
    const xo = lerp(1400, 1100, clamp((tl - tTin) / 4));
    ocSen(ctx, xo, 960, 1.5, t); viet(ctx, "tin thường: 1 năm", xo, 640, { size: 72, u: vao(tl, tTin + 0.3) });
    if (tl >= tChui) {
      const u = clamp((tl - tChui) / 1.2), x = lerp(-300, 2300, u);
      ctx.save(); ctx.translate(x, 820); ctx.rotate(Math.PI / 2); tenLua(ctx, 0, 0, 0.8, t, 1.3); ctx.restore();
      for (let i = 0; i < 4; i++) netPts(ctx, doan(x - 380 - i * 50, 760 + i * 36, x - 640 - i * 80, 760 + i * 36), { w: 6, mau: "#ffffff", seed: 3850 + i });
      viet(ctx, "bài chửi nhau: 3 hôm", W / 2, 230, { size: 90, mau: DO, u: vao(tl, tChui + 0.2), xoay: 0.03 });
    }
  }
}
/* ── CÂU 93: dì Út: "Thương bọn trẻ bây giờ quá." ── */
function c93(ctx, t, uf, c) {
  const tl = c.tl;
  giay(ctx, "#f6e3c8"); to(ctx, rect(0, 860, W, 220, 0), "#c99a62"); netPts(ctx, doan(-10, 860, W + 10, 860), { w: 6 });
  ve(ctx, rect(120, 150, 360, 300, 8), "#bfe6c0", { w: 6 }); for (let i = 0; i < 3; i++) ve(ctx, elip(180 + i * 120, 400 - (i % 2) * 40, 50, 70), "#6fbf73", { w: 4 }); netPts(ctx, doan(300, 154, 300, 446), { w: 5 });
  ve(ctx, rect(1640, 520, 200, 340, 8), "#9c6a44", { w: 5 });
  veNV(ctx, 700, 560, 1.3, { t, kieu: "diut", mat: "khoc", noi: c.noi, chan: false, tayT: { p: [-40, -70], cong: -40, kieu: "nam", camTren: (g) => ve(g, "M10,-30 C40,-40 60,-10 50,20 C30,30 10,20 10,-30 Z", "#ffffff", { w: 3 }) }, tayP: { p: [120, 30], cong: 30 } });
  D.dienThoai(ctx, 700 + 128 * 1.3, 560 + 10 * 1.3, 0.62, 0.2, (g) => { g.fillStyle = "#e7eef7"; g.fillRect(-80, -140, 160, 280); g.save(); g.scale(0.22, 0.26); anhCom(g); g.restore(); });
  viet(ctx, "“Thương bọn trẻ", 1330, 400, { size: 96, u: vao(tl, 0.05) }); viet(ctx, "bây giờ quá.”", 1370, 530, { size: 96, u: vao(tl, m(c, 3)) });
  viet(ctx, "dì Út", 1330, 270, { size: 54, mau: "#6b6560", u: vao(tl, 0) });
}
/* ── CÂU 94: cả họ thả mặt khóc; không ai nhận ra nét chữ trên băng dính — trừ hai người ── */
function matKhoc(ctx, x, y, r) { ve(ctx, elip(x, y, r, r), "#ffd23e", { w: 4 }); net(ctx, `M${x - r * 0.5},${y - r * 0.1} C${x - r * 0.35},${y - r * 0.3} ${x - r * 0.2},${y - r * 0.3} ${x - r * 0.1},${y - r * 0.1} M${x + r * 0.1},${y - r * 0.1} C${x + r * 0.2},${y - r * 0.3} ${x + r * 0.35},${y - r * 0.3} ${x + r * 0.5},${y - r * 0.1}`, { w: 3.5 }); net(ctx, `M${x - r * 0.3},${y + r * 0.5} C${x - r * 0.1},${y + r * 0.3} ${x + r * 0.1},${y + r * 0.3} ${x + r * 0.3},${y + r * 0.5}`, { w: 3.5 }); ve(ctx, `M${x - r * 0.42},${y} C${x - r * 0.5},${y + r * 0.3} ${x - r * 0.3},${y + r * 0.45} ${x - r * 0.3},${y + r * 0.2} Z`, "#7cc3e8", { w: 2 }); }
function c94(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tDeo = m(c, 11), tTru = m(c, 20), tNg = m(c, 23), tChi = m(c, 28);
  if (tl < tDeo) {
    giay(ctx, "#e7eef7");
    zalo(ctx, 960, 560, 3.2, t, { tieuDe: "Nhà Ngoại", tin: [{ ai: 4, chu: "thương thằng bé quá", anh: (g) => { g.scale(0.22, 0.27); anhCom(g); }, hoa: 0 }, { ai: "diut", chu: "Thương bọn trẻ bây giờ quá" }] });
    for (let i = 0; i < 14; i++) { const q = rng(3900 + i), t0 = 0.2 + i * 0.16; if (tl < t0) continue; const u = (tl - t0) / 2.4; const x = 960 + (q() - 0.5) * 1300, y = 1000 - u * 900; if (y < -60) continue; matKhoc(ctx, x + Math.sin(u * 6 + i) * 30, y, 34 + q() * 16); }
    chu(ctx, "cả họ thả mặt khóc", 1560, 150, tl, m(c, 2), { size: 70, xoay: 0.04 });
  } else if (tl < tTru) {
    giay(ctx, "#fff4e6");
    loRuoc(ctx, 900, 1000, 2.6);
    for (const [x, y, s] of [[1500, 300, 1], [1640, 520, 2], [1480, 760, 3], [300, 350, 4], [280, 700, 5]]) { avatar(ctx, x, y, 60, 4000 + s); viet(ctx, "?", x + 70, y - 40, { size: 80, mau: "#6b6560", u: vao(tl, tDeo + s * 0.1) }); }
    chu(ctx, "không ai nhận ra nét chữ", W / 2, 120, tl, m(c, 13), { size: 78, mau: DO });
  } else {
    // hai nơi cùng khựng lại: người viết chữ, và chị gái của người viết
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 960, H); ctx.clip(); nhaMe(ctx, t, "bep");
    veNV(ctx, 480, 600, 1.15, { t, kieu: "me", mat: "bong", nhin: [0, 0.5], chan: false, tayT: { p: [-30, 110], cong: -20 }, tayP: { p: [40, 110], cong: 20 } });
    D.dienThoaiSau(ctx, 480 + 5, 600 + 112 * 1.15, 0.55, 0); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(960, 0, 960, H); ctx.clip(); giay(ctx, "#f6e3c8"); to(ctx, rect(960, 820, 960, 260, 0), "#c99a62"); ve(ctx, rect(1080, 200, 300, 220, 8), "#bfe6c0", { w: 5 }); ve(ctx, rect(1560, 260, 260, 300, 8), "#c9a24a", { w: 5 });
    veNV(ctx, 1440, 600, 1.15, { t, kieu: "thoa", mat: "bong", nhin: [0, 0.5], chan: false, tayT: { p: [-30, 110], cong: -20 }, tayP: { p: [40, 110], cong: 20 } });
    D.dienThoaiSau(ctx, 1440 + 5, 600 + 112 * 1.15, 0.55, 0); ctx.restore();
    netPts(ctx, doan(960, -10, 960, H + 10), { w: 10 });
    chu(ctx, "trừ hai người", W / 2, 120, tl, tTru, { size: 80, mau: DO, nen: GIAY });
    if (tl >= tNg) { viet(ctx, "người viết chữ", 480, 960, { size: 72, u: vao(tl, tNg) }); muiTen(ctx, 480, 900, 480, 820, vao(tl, tNg + 0.1, 0.3)); }
    if (tl >= tChi) { viet(ctx, "chị gái người viết", 1440, 960, { size: 72, u: vao(tl, tChi) }); muiTen(ctx, 1440, 900, 1440, 820, vao(tl, tChi + 0.1, 0.3)); }
  }
}
/* ── CÂU 95: mẹ không gọi, bác Thoa cũng không; "Con tôi cũng ăn" vẫn nằm nguyên ── */
function c95(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tBac = m(c, 3), tCau = m(c, 7), tKhong = m(c, 17);
  if (tl < tCau) {
    phongNgay(ctx, t, { gio: 12, phut: Math.floor(tl * 4), lich: false });
    banLamViec(ctx, t, { mat: "im", nhin: [0.7, 0.5] }, { thot: false, tren: (g) => { D.dienThoai(g, 1390, 520, 0.85, 0.12, (h) => { h.fillStyle = "#1b1d29"; h.fillRect(-80, -140, 160, 280); viet(h, "12:00", 0, -40, { size: 36, mau: "#c9d4ee", pop: false, soi: false }); viet(h, "0 cuộc gọi", 0, 10, { size: 22, mau: "#8a93ad", pop: false, soi: false }); }); ve(g, "M1330,640 L1450,640 L1420,600 L1360,600 Z", "#5a5f6e", { w: 4 }); } });
    chu(ctx, "12:00", 760, 330, tl, 0.05, { size: 70, mau: DO });
    chu(ctx, "mẹ không gọi", 1560, 140, tl, 0.1, { size: 80, xoay: 0.03 });
    chu(ctx, "bác Thoa cũng không", 1560, 250, tl, tBac, { size: 66, xoay: -0.02 });
  } else {
    giay(ctx, "#e7eef7");
    zalo(ctx, 820, 560, 3.2, t, { tieuDe: "Nhà Ngoại", tin: [{ ai: "me", chu: "Con tôi cũng ăn.", anh: (g) => anhSushi(g, 0, 0, 0.36, 0, { tay: true }), hoa: 5 }, { ai: "diut", chu: "Thương bọn trẻ bây giờ quá" }] });
    khoanh(ctx, 820, 480, 300, 260, vao(tl, tCau + 0.2, 0.6), DO, 7);
    de(ctx, 1500, 820, 1.4, t); viet(ctx, "kri… kri…", 1540, 680, { size: 70, mau: "#6b6560", u: vao(tl, tCau + 0.8), xoay: on(tq, 3) * 0.03 });
    chu(ctx, "không ai cải chính", 1500, 260, tl, tKhong, { size: 80, xoay: 0.03 });
  }
}
/* ── CÂU 96: xe khách gửi lên một thùng: hai lọ ruốc; em ở quê ăn cơm nước mắm ── */
function c96(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tHai = m(c, 8), tThang = m(c, 11);
  if (tl < tHai) {
    benXe(ctx, t, { xeX: 1300 });
    veNV(ctx, 900, 600, 1.1, { t, kieu: "phuxe", mat: "chan", nhin: [-0.6, 0], tayT: { p: [-160, 60], cong: -10 }, tayP: { p: [-60, 80], cong: 10 } });
    thung(ctx, 700, 760, 0.62, 0);
    veNV(ctx, 400, 600, 1.1, { t, mat: "ngac", nhin: [0.6, 0.3], tayP: { p: [170, 80], cong: 20, kieu: "xoe" } });
    chu(ctx, "Thứ Bảy", 1500, 120, tl, 0.05, { size: 80, mau: DO, xoay: 0.03 });
  } else if (tl < tThang) {
    giay(ctx, "#fff4e6");
    thung(ctx, 960, 900, 1.6, 1);
    for (const [i, x] of [[0, 820], [1, 1100]]) { const u = eout(vao(tl, tHai + i * 0.2, 0.35)); loRuoc(ctx, x, lerp(900, 640, u), 1.15, { xoay: (i - 0.5) * 0.12 }); }
    ve(ctx, rect(640, 644, 640, 416, 10), "#d6a66a", { w: 6 }); net(ctx, "M660,700 L1260,700", { w: 3, mau: "#b8864a" });   // mặt trước thùng che chân lọ
    chu(ctx, "hai lọ ruốc", W / 2, 140, tl, tHai + 0.2, { size: 96 });
  } else {
    nhaMe(ctx, t, "bep");
    veNV(ctx, 960, 560, 1.15, { t, kieu: "em", mat: "nhai", chan: false, nhin: [0.3, 0.7], tayP: { p: [110, 120], cong: 20 }, tayT: { p: [-90, 130], cong: -20 } });
    duaDua(ctx, 960 + 110 * 1.15 + 10, 560 + 120 * 1.15 - 10, 1110, 724, 12); duaDua(ctx, 960 + 110 * 1.15 + 18, 560 + 120 * 1.15, 1120, 730, 12);
    ve(ctx, rect(560, 740, 800, 50, 10), "#9c6a44", { w: 5 }); ve(ctx, rect(600, 790, 40, 160, 4), "#9c6a44", { w: 4 }); ve(ctx, rect(1280, 790, 40, 160, 4), "#9c6a44", { w: 4 });
    batCom(ctx, 860, 740, 0.85); ve(ctx, elip(1120, 732, 70, 18), "#ffffff", { w: 4 }); to(ctx, elip(1120, 728, 56, 12), "#8a4a1c");
    viet(ctx, "nước mắm", 1120, 860, { size: 56, mau: "#8a4a1c", u: vao(tl, m(c, 19)) });
    moHoi(ctx, 1110, 380, 1.1);
    chu(ctx, "em tôi tháng này", 700, 140, tl, m(c, 14), { size: 72, xoay: -0.03 });
  }
}
/* ── CÂU 97: cận lọ thứ nhất ── */
function c97(ctx, t, uf, c) {
  const tl = c.tl;
  giay(ctx, "#fff4e6"); to(ctx, rect(0, 940, W, 140, 0), "#d9b48a"); netPts(ctx, doan(-10, 940, W + 10, 940), { w: 5 });
  ctx.save(); const z = lerp(1, 1.06, eio(tl / 3)); ctx.translate(960, 600); ctx.scale(z, z); ctx.translate(-960, -600);
  loRuoc(ctx, 1760, 960, 2.0, { xoay: 0.02 });
  loRuoc(ctx, 900, 960, 2.4);
  ctx.restore();
  chu(ctx, "lọ thứ nhất", 330, 220, tl, 0.05, { size: 80, xoay: -0.04 });
}
/* ── CÂU 98: lọ thứ hai: dưới "Ăn dần", "Đừng đăng." hiện từng nét ── */
function c98(ctx, t, uf, c) {
  const tl = c.tl, tChi = m(c, 5), tNho = m(c, 17), tDung = m(c, 20);
  giay(ctx, "#fff4e6"); to(ctx, rect(0, 940, W, 140, 0), "#d9b48a"); netPts(ctx, doan(-10, 940, W + 10, 940), { w: 5 });
  const zi = eio(pha(tl, tChi, tNho + 0.4)), z = lerp(1, 2.2, zi);
  ctx.save(); cam(ctx, 960, lerp(540, 720, zi), z);
  loRuoc(ctx, 220, 960, 2.0, { xoay: -0.02 });
  loRuoc(ctx, 960, 960, 2.4, { dong2: " " });
  // "Đừng đăng." viết dần từng nét (vạch che lùi dần từ trái sang phải)
  if (tl >= tDung) {
    const u = clamp((tl - tDung) / 1.1);
    ctx.save(); ctx.translate(960, 960); ctx.scale(2.4, 2.4); ctx.rotate(-0.04);
    const w0 = doRong(ctx, "Đừng đăng.", 32);
    ctx.beginPath(); ctx.rect(-w0 / 2 - 4, -130, (w0 + 8) * u, 70); ctx.clip();
    viet(ctx, "Đừng đăng.", 0, -82, { size: 32, mau: "#3a4a8a", pop: false, soi: false });
    ctx.restore();
  }
  ctx.restore();
  if (tl < tChi) chu(ctx, "lọ thứ hai", 1560, 220, tl, 0.05, { size: 80, xoay: 0.04 });
}
/* ── CÂU 99: giỗ ông ngoại, cậu Hưng rót rượu ── */
function c99(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tCau = m(c, 8), tRot = m(c, 10), tHai = m(c, 20);
  if (tl < tCau) {
    giay(ctx, "#f3d9a0"); to(ctx, rect(0, 900, W, 180, 0), "#c99a62");
    banTho(ctx, 960, 560, 1.15, t);
    chu(ctx, "giỗ ông ngoại", 1560, 160, tl, m(c, 5), { size: 90, xoay: 0.04 });
    chu(ctx, "CN, giữa tháng 9", 360, 160, tl, 0.05, { size: 70, mau: "#8a3a2a", xoay: -0.04 });
  } else {
    nhaGio(ctx, t);
    const rot = tl >= tRot;
    hangHo(ctx, t, { hung: { mat: "cuoi", nhin: [0.3, 0.5], tayP: rot ? { p: [150, 60], cong: 20 } : undefined } });
    maCo(ctx, 960, 850, 1.05, {});
    if (rot) { ctx.save(); ctx.translate(560 + 150 * 0.78 + 30, 600 + 40 * 0.78); ctx.rotate(1.9); ve(ctx, "M-20,-90 L20,-90 L20,-50 C40,-30 40,40 30,70 L-30,70 C-40,40 -40,-30 -20,-50 Z", "#dff3e8", { w: 4.5 }); ctx.restore(); netPts(ctx, doan(720, 700, 722, 790), { w: 4, mau: "#f6e7b0" }); chen(ctx, 720, 800, 1.1); }
    if (tl >= tHai) chu(ctx, "+ đúng 2 chữ", 1560, 120, tl, tHai, { size: 84, mau: DO, xoay: 0.04 });
  }
}
/* ── CÂU 100: cậu Hưng: "Thế bây giờ lương hai đứa THẬT RA bao nhiêu?" ── */
function c100(ctx, t, uf, c) {
  const tl = c.tl, tThat = m(c, 6);
  nhaGio(ctx, t, { tho: false }); banTho(ctx, 1580, 250, 0.6, t);
  veNV(ctx, 700, 640, 1.55, { t, kieu: "hung", mat: tl >= tThat ? "deu" : "cuoi", noi: c.noi, say: 1, chan: false, tayP: { p: [150, -10], cong: 30 } });
  chen(ctx, 700 + 160 * 1.55 + 10, 640 - 30 * 1.55, 1.6);
  viet(ctx, "Lương hai đứa", 1360, 660, { size: 80, u: vao(tl, m(c, 3)) });
  if (tl >= tThat) { viet(ctx, "THẬT RA", 1360, 800, { size: 110, mau: DO, u: vao(tl, tThat) }); netPts(ctx, doan(1170, 820, 1560, 826), { w: 7, mau: DO }); }
  if (tl >= m(c, 8)) viet(ctx, "bao nhiêu?", 1360, 930, { size: 80, u: vao(tl, m(c, 8)) });
}
/* ── CÂU 101: hai anh em đồng thanh "Cũng được ạ." ── */
function c101(ctx, t, uf, c) {
  const tl = c.tl;
  nhaGio(ctx, t, { tho: false });
  const nang = eout(vao(tl, 0, 0.3)), y = lerp(80, -130, nang);
  for (const [kieu, x] of [["tuan", 700], ["hieu", 1220]]) {
    const ra = {};
    veNV(ctx, x, 620, 1.35, { t, kieu, mat: "cuoi", noi: c.noi, C: kieu === "tuan" ? TUAN_GIO : undefined, chan: false, nhin: [kieu === "tuan" ? 0.3 : -0.3, 0], tayP: kieu === "tuan" ? { p: [150, y], cong: 30 } : undefined, tayT: kieu === "hieu" ? { p: [-150, y], cong: -30 } : undefined, ra });
    const h = kieu === "tuan" ? ra.P : ra.T; if (h) chen(ctx, h[0] + (kieu === "tuan" ? 10 : -10), h[1] - 40, 1.5);
  }
  viet(ctx, "“Cũng được ạ.”", W / 2, 170, { size: 120, u: vao(tl, 0.02, 0.18) });
}
/* ── CÂU 102: mẹ gật, bác gật; bác nhìn tay tôi hơi lâu; hai bà nhìn nhau, gật thêm ── */
function c102(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tMe = m(c, 2), tBac = m(c, 5), tRoi = m(c, 6), tHai = m(c, 13), tGat = m(c, 17);
  const gat = (t0) => (tl >= t0 && tl < t0 + 0.5 ? Math.sin(((tl - t0) / 0.5) * Math.PI) * 0.18 : 0);
  if (tl < tRoi || tl >= tHai) {
    nhaGio(ctx, t, { tho: false }); banTho(ctx, 960, 330, 0.55, t);
    const nhau = tl >= tHai;
    veNV(ctx, 640, 640, 1.35, { t, kieu: "me", mat: "thuong", nhin: nhau ? [0.8, 0] : [0, 0.2], chan: false, nhun: (gat(tMe) + gat(tGat)) * 60, ngh: nhau ? 0.06 : 0 });
    veNV(ctx, 1280, 640, 1.35, { t, kieu: "thoa", mat: nhau ? "thuong2" : "thuong", nhin: nhau ? [-0.8, 0] : [0, 0.2], chan: false, nhun: (gat(tBac) + gat(tGat + 0.08)) * 60, ngh: nhau ? -0.06 : 0 });
    if (tl >= tGat) chu(ctx, "gật thêm cái nữa", W / 2, 1000, tl, tGat, { size: 76 });
  } else {
    // bác Thoa nhìn cái nhẫn hơi lâu
    giay(ctx, "#f3d9a0");
    tayCanh(ctx, 1150, 650, 1.3, t, tl > tRoi + 0.6 ? 1 : 0, false);
    veNV(ctx, 300, 520, 1.0, { t, kieu: "thoa", mat: "nheo", nhin: [0.9, 0.4], than: false });
    const u = vao(tl, tRoi + 0.2, 0.8); if (u > 0) { const n = Math.floor(u * 10); for (let i = 0; i < n; i++) to(ctx, elip(lerp(400, 1000, i / 9), lerp(440, 690, i / 9), 6, 6), "#6b6560"); }
    chu(ctx, "hơi lâu…", 520, 900, tl, m(c, 11), { size: 80, mau: "#6b6560" });
  }
}
/* ── CÂU 103: hai bà cùng chụp mâm cỗ — hai tấm y hệt; bàn tay đeo nhẫn gắp cho anh Tuấn miếng to nhất ── */
function anhMam(ctx, x, y, k, xoay = 0) {   // ảnh mâm cỗ (polaroid)
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, rect(-170, -150, 340, 300, 8), "#ffffff", { w: 5 }); to(ctx, rect(-148, -128, 296, 220, 4), "#f0d68a");
  ctx.save(); ctx.beginPath(); ctx.rect(-148, -128, 296, 220); ctx.clip(); maCo(ctx, 0, 0, 0.3); ctx.save(); ctx.translate(90, -40); ctx.scale(0.18, 0.18); tayCanh(ctx, 0, 0, 1, 0, 0, false); ctx.restore(); ctx.restore();
  ctx.restore();
}
function c103(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tChup = m(c, 7), tNgoi = m(c, 10), tCung = m(c, 20), tGap = m(c, 28), tTo = m(c, 32);
  if (tl < tNgoi) {
    nhaGio(ctx, t, { tho: false });
    const u = eout(vao(tq, m(c, 4), 0.3));
    for (const [kieu, x] of [["thoa", 700], ["me", 1220]]) veNV(ctx, x, 560, 1.15, { t, kieu, mat: "nham", nhin: [0, 0.8], chan: false, tayT: { p: [-40, lerp(160, 130, u)], cong: -20 }, tayP: { p: [40, lerp(160, 130, u)], cong: 20 } });
    for (const x of [700, 1220]) D.dienThoaiSau(ctx, x, 560 + lerp(170, 140, u) * 1.15, 0.55, Math.PI);
    maCo(ctx, 960, 1000, 1.2);
    chop(ctx, tl, tChup, 0.6); if (tl >= tChup && tl < tChup + 0.4) for (const x of [700, 1220]) tiaNhan(ctx, x, 560 + 230 * 1.15, 90, 140, 7, { mau: "#fff", w: 6, a0: Math.PI / 2, goc: 0.4 });
    chu(ctx, "cùng giơ máy chụp", W / 2, 130, tl, m(c, 3), { size: 80 });
  } else if (tl < tCung) {
    giay(ctx, "#f4efe4");
    for (const [x, xo, ai] of [[620, -0.04, "thoa"], [1300, 0.03, "me"]]) { D.dienThoai(ctx, x, 500, 2.4, xo, (g) => { g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280); g.save(); g.scale(0.4, 0.4); anhMam(g, 0, -40, 1); g.restore(); }); }
    chu(ctx, "=", 960, 540, tl, m(c, 14), { size: 200, mau: DO });
    chu(ctx, "gần như y hệt", W / 2, 1010, tl, m(c, 16), { size: 80 });
  } else {
    // cận mâm: bàn tay đeo nhẫn gắp miếng giò to nhất sang bát anh Tuấn
    giay(ctx, "#f0d68a");
    ctx.save(); ctx.translate(1316, 700); ctx.scale(1.6, 1.6); ctx.translate(-1316, -700); maCo(ctx, 1316, 700, 1, { gio: tl >= tGap ? 5 : 6 }); ctx.restore();
    ve(ctx, "M120,820 L480,820 C476,910 410,950 300,950 C190,950 124,910 120,820 Z", "#ffffff", { w: 5 }); net(ctx, "M140,866 C230,880 370,880 460,866", { w: 4, mau: "#4a8fd1" });
    const u = eio(pha(tl, tGap, tTo + 0.2)), gx = lerp(900, 300, u), gy = lerp(650, 800, u) - Math.sin(u * Math.PI) * 180;
    tayCanh(ctx, gx + 400, gy + 120, 0.78, t, 0, false);
    ve(ctx, elip(gx, gy, 52, 26), "#f6d9cf", { w: 4 }); net(ctx, elip(gx, gy, 28, 13), { w: 3, mau: "#c9a08a" });
    veNV(ctx, 300, 560, 1.0, { t, kieu: "tuan", C: TUAN_GIO, mat: tl >= tTo ? "cuoi" : "ngac", nhin: [0.6, 0.6], chan: false });
    chu(ctx, "miếng to nhất", 1400, 200, tl, tTo, { size: 96, mau: DO, xoay: 0.04 });
    chu(ctx, "cho anh Tuấn", 680, 200, tl, m(c, 30), { size: 80, xoay: -0.03 });
  }
}
/* ── CÂU 104: hai tấm y hệt; đéo ai check var; cả họ đang ngồi ăn thật ── */
function c104(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tDeo = m(c, 12), tCa = m(c, 16);
  if (tl < tDeo) {
    giay(ctx, "#e7eef7");
    zalo(ctx, 960, 560, 3.2, t, { tieuDe: "Nhà Ngoại", tin: [{ ai: "thoa", chu: "Giỗ bố", anh: (g) => anhMam(g, 0, 0, 0.36) }, { ai: "me", chu: "Giỗ bố", anh: (g) => anhMam(g, 0, 0, 0.36, 0.03) }] });
    chu(ctx, "hai tấm y hệt", 1560, 200, tl, m(c, 5), { size: 80, xoay: 0.04 });
  } else if (tl < tCa) {
    giay(ctx, "#f4efe4");
    veNV(ctx, 960, 620, 1.2, { t, kieu: "thamtu", mat: "ngu", chan: false, ngh: 0.15, tayP: { p: [90, 140], cong: 20 } });
    ve(ctx, elip(1200, 800, 70, 70), "rgba(220,240,255,0.2)", { w: 10, mau: "#5a4632" }); netPts(ctx, doan(1150, 850, 1080, 920), { w: 16, mau: "#5a4632" });
    gach(ctx, 1110, 720, 1290, 880, vao(tl, tDeo + 0.2, 0.3)); gach(ctx, 1290, 720, 1110, 880, vao(tl, tDeo + 0.4, 0.3));
    chu(ctx, "đéo ai check var", W / 2, 150, tl, tDeo, { size: 90 });
  } else {
    nhaGio(ctx, t);
    hangHo(ctx, t, { diut: { mat: "nhai" }, hung: { mat: "nhai" }, thoa: { mat: "cuoi" }, me: { mat: "nhai" }, tuan: { mat: "cuoi" }, hieu: { mat: "nhai" } });
    maCo(ctx, 960, 850, 1.05, { gio: 3 });
    for (const [x, y, r] of [[200, 990, -0.2], [1720, 1000, 0.3]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(r); ve(ctx, rect(-50, -90, 100, 180, 14), "#33364a", { w: 5 }); ctx.restore(); }
    chu(ctx, "cả họ đang ăn thật", W / 2, 120, tl, tCa, { size: 84 });
  }
}
/* ── CÂU 105: mỗi tấm đúng một bông hoa — của bà kia gửi (hai bông bay chéo) ── */
function c105(ctx, t, uf, c) {
  const tl = c.tl, tHoa = m(c, 5), tCua = m(c, 7);
  giay(ctx, "#fde8ee");
  for (let i = 0; i < 10; i++) { const q = rng(4100 + i); sao(ctx, 160 + q() * 1600, 120 + q() * 600, 8 + q() * 10, t * 0.6 + i, i % 2 ? "#ffd76a" : "#ffffff"); }
  anhMam(ctx, 560, 400, 1.15, -0.04); anhMam(ctx, 1360, 400, 1.15, 0.04);
  viet(ctx, "ảnh bác Thoa", 560, 620, { size: 56, mau: "#6b6560", pop: false }); viet(ctx, "ảnh mẹ", 1360, 620, { size: 56, mau: "#6b6560", pop: false });
  veNV(ctx, 480, 1000, 0.9, { t, kieu: "thoa", mat: tl >= tCua ? "cuoi" : "thuong", nhin: [0.6, -0.6], than: false });
  veNV(ctx, 1440, 1000, 0.9, { t, kieu: "me", mat: tl >= tCua ? "cuoi" : "thuong", nhin: [-0.6, -0.6], than: false });
  // bông của bác Thoa bay sang ảnh của mẹ, bông của mẹ bay sang ảnh của bác — chéo nhau ở giữa
  for (const [x0, y0, x1, y1, mau, s] of [[560, 860, 1360 + 120, 520, "#f39cc0", 1], [1360, 860, 560 + 120, 520, "#ffb35c", -1]]) {
    const u = eio(pha(tl, tHoa - 0.5, tCua + 0.6)); if (u <= 0) continue;
    const x = lerp(x0, x1, u), y = lerp(y0, y1, u) - Math.sin(u * Math.PI) * 260;
    ctx.save(); ctx.translate(x, y); ctx.rotate(u * 6 * s); hoa(ctx, 0, 0, 46, mau); ctx.restore();
    if (u < 1) for (let i = 1; i < 6; i++) { const v = Math.max(0, u - i * 0.03); to(ctx, elip(lerp(x0, x1, v), lerp(y0, y1, v) - Math.sin(v * Math.PI) * 260, 6 - i, 6 - i), mau); }
  }
  chu(ctx, "đúng một bông", W / 2, 120, tl, m(c, 3), { size: 84 });
  chu(ctx, "của bà kia gửi", W / 2, 760, tl, tCua + 0.2, { size: 80, mau: DO });
}
/* ── CÂU 106: shop vẫn mở, nửa cái mồm vẫn phải ăn; trước khi chụp, tháo nhẫn ra ── */
function c106(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tNua = m(c, 7), tChi = m(c, 13), tThao = m(c, 20);
  if (tl < tNua) {
    ctx.save(); cam(ctx, 1110, 470, 1.25); phongDem(ctx, t, { gio: 23, lich: false }); toi(ctx, 0.05);
    banLamViec(ctx, t, { mat: "thuong", nhin: [0, 0.6] }, { den: 1, tren: (g) => { for (let i = 0; i < 8; i++) { const x = 945 + (i % 4) * 110, y = 594 + Math.floor(i / 4) * 38; D.sushi(g, x, y, 1.05, i); } loRuoc(g, 1360, 650, 0.6); } });
    ctx.restore();
    chu(ctx, "shop vẫn mở", 1500, 160, tl, m(c, 3), { size: 90, mau: GIAY, xoay: 0.04 });
  } else if (tl < tChi) {
    phongDem(ctx, t, { gio: 23, lich: false });
    veNV(ctx, 960, 560, 1.3, { t, mat: "nhai", chan: false, nhin: [0, 0.7], tayP: { p: [120, 140], cong: 20 }, tayT: { p: [-100, 150], cong: -20 } });
    ve(ctx, rect(400, 800, 1120, 60, 10), "#c48b5c", { w: 5 }); batCom(ctx, 960, 800, 1.1, { ruoc: true });
    duaDua(ctx, 960 + 120 * 1.3 + 10, 560 + 140 * 1.3 - 12, 1000, 730, 13); duaDua(ctx, 960 + 120 * 1.3 + 20, 560 + 140 * 1.3, 1010, 738, 13);
    chu(ctx, "nửa cái mồm vẫn phải ăn", W / 2, 140, tl, tNua, { size: 76, mau: GIAY });
  } else {
    // cận: tháo nhẫn đặt cạnh lọ ruốc
    giay(ctx, "#4d5578"); to(ctx, rect(0, 760, W, 320, 0), "#c48b5c"); netPts(ctx, doan(-10, 760, W + 10, 760), { w: 6 });
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.12; to(ctx, elip(1000, 700, 700, 300), "#ffd36a"); ctx.restore();
    loRuoc(ctx, 1450, 900, 1.5);
    const u = eio(pha(tl, tThao, tThao + 0.8)), conNhan = tl < tThao;
    tayCanh(ctx, 700, 560, 1.2, t, 0, false, { dua: false, nhan: conNhan });
    if (!conNhan) {
      const p0 = [700 + (-66 * Math.cos(-0.12) - 62 * Math.sin(-0.12)) * 1.2, 560 + (-66 * Math.sin(-0.12) + 62 * Math.cos(-0.12)) * 1.2], p1 = [1240, 880];
      const x = lerp(p0[0], p1[0], u), y = lerp(p0[1], p1[1], u) - Math.sin(u * Math.PI) * 140;
      ctx.save(); ctx.translate(x, y); ctx.rotate(lerp(0.35, 1.57, u)); const kk = lerp(1.2, 1.6, u); ctx.scale(kk, kk); ve(ctx, rect(-12, -28, 24, 56, 11), "#dfe6ee", { w: 5 }); to(ctx, rect(-6, -22, 6, 36, 3), "#ffffff"); ctx.restore();
      if (u >= 1) { sao(ctx, 1270, 830, 44, t); viet(ctx, "nhẫn", 1240, 1000, { size: 64, mau: GIAY, u: vao(tl, tThao + 0.9) }); }
    }
    chu(ctx, "trước khi chụp: tháo nhẫn", W / 2, 150, tl, m(c, 16), { size: 76, mau: GIAY });
  }
}
/* ── CÂU 107: bài trên Threads không xoá — người lạ dặn ── */
function c107(ctx, t, uf, c) {
  const tl = c.tl, tKhong = m(c, 4), tNg = m(c, 6);
  giay(ctx, "#eef1f6");
  threadsBai(ctx, 700, 540, 1.4, t, { ten: "chưa có tên", av: { xam: true }, chu: ["Đây là bữa của tôi."], anh: anhCom, tim: "12k" });
  ctx.save(); ctx.translate(1420, 420); ve(ctx, rect(-170, -60, 340, 120, 20), "#ffffff", { w: 5 }); viet(ctx, "Xoá bài?", 0, 18, { size: 60, mau: DO, pop: false }); ctx.restore();
  if (tl >= tKhong) { gach(ctx, 1260, 380, 1580, 460, vao(tl, tKhong, 0.25)); }
  if (tl >= tNg) binhLuan(ctx, 1420, 700, "Đừng xoá bài nhé.", 0, back(vao(tl, tNg, 0.25)), 0.04, { av: { xam: true } });
}
/* ── CÂU 108: ảnh mâm giỗ, tôi đéo đăng — mẹ dặn ── */
function c108(ctx, t, uf, c) {
  const tl = c.tl, tDeo = m(c, 4), tMe = m(c, 6);
  giay(ctx, "#1f2440");
  const bam = tl >= tDeo;
  D.dienThoai(ctx, 760, 560, 3.3, 0, (g) => {
    g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280); viet(g, "Ảnh", -40, -100, { size: 20, pop: false, soi: false });
    for (let i = 0; i < 6; i++) to(g, rect(-66 + (i % 3) * 45, 46 + Math.floor(i / 3) * 40, 40, 36, 3), ["#c9b3e6", "#a6d58a", "#86cfe0", "#e8c27a", "#f39cc0", "#cfe8f6"][i]);
    g.save(); g.translate(0, -40); g.scale(0.4, 0.4); anhMam(g, 0, 0, 1); g.restore();
    ve(g, rect(20, -120, 46, 24, 12), "#111", { w: 2 }); viet(g, "Đăng", 43, -102, { size: 16, mau: "#fff", pop: false, soi: false });
  });
  ctx.save(); ctx.translate(bam ? 1300 : 1080, bam ? 370 : 250); ctx.rotate(bam ? -2.6 : -2.2); ctx.scale(3, 3); banTay(ctx, "chi", 1, 72); ctx.restore();
  if (bam) chu(ctx, "đéo đăng", 1520, 560, tl, tDeo, { size: 110, mau: DO, xoay: 0.04 });
  if (tl >= tMe) { loRuoc(ctx, 1520, 1010, 0.85, { dong2: "Đừng đăng." }); viet(ctx, "mẹ dặn", 1300, 870, { size: 64, mau: GIAY, u: vao(tl, tMe) }); }
}
/* ── CÂU 109: Threads City vẫn giàu — camera lùi ra: thành phố nằm trong chiếc điện thoại cạnh hai lọ ruốc ── */
function canhBan(ctx, t) {   // bàn đêm: điện thoại dựng ngang, hai lọ ruốc bên cạnh
  phongDem(ctx, t, { gio: 23, lich: false }); toi(ctx, 0.08);
  to(ctx, rect(0, 820, W, 260, 0), "#c48b5c"); netPts(ctx, doan(-10, 820, W + 10, 820), { w: 6 });
  ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.1; to(ctx, elip(1000, 760, 760, 300), "#ffd36a"); ctx.restore();
  D.dienThoai(ctx, 820, 600, 2.4, -Math.PI / 2, (g) => { g.save(); g.rotate(Math.PI / 2); g.scale(272 / 1920, 272 / 1920); g.translate(-960, -540); threadsCity(g, t, { bien: [["50 TRIỆU", 960, 420, "#ff4fa0", 130], ["LƯƠNG 80", 1500, 250, "#3fe0ff", 90], ["OMAKASE", 450, 300, "#ffd23e", 80]] }); g.restore(); });
  ve(ctx, "M620,800 L1020,800 L1000,830 L640,830 Z", "#5a5f6e", { w: 4 });
  loRuoc(ctx, 1380, 860, 1.0, { xoay: -0.03 }); loRuoc(ctx, 1640, 870, 1.0, { dong2: "Đừng đăng.", xoay: 0.04 });
}
function c109(ctx, t, uf, c) {
  const tl = c.tl, tGiau = m(c, 4);
  const u = eio(pha(tl, 0.7, c.dur)), z = lerp(3.05, 1, u);
  ctx.save(); cam(ctx, lerp(820, 960, u), lerp(600, 540, u), z); canhBan(ctx, t); ctx.restore();
  if (tl >= tGiau && u > 0.5) viet(ctx, "vẫn giàu như cũ", W / 2, 140, { size: 90, mau: GIAY, u: vao(tl, tGiau + 0.3) });
}
/* ── KẾT ── */
function cuoi(ctx, t, uf, c) {
  const tl = c.tl;
  giay(ctx);
  for (let i = 0; i < 9; i++) { const q = rng(4200 + i); sao(ctx, 160 + q() * 1600, 90 + q() * 680, 10 + q() * 10, t * 0.5 + i, i % 2 ? "#ffd76a" : "#f39c9c"); }
  to(ctx, rect(0, 900, W, 180, 0), "#efe6d2"); netPts(ctx, doan(-10, 900, W + 10, 900), { w: 5 });
  loRuoc(ctx, 1240, 900, 1.25, { xoay: -0.03 }); loRuoc(ctx, 1560, 905, 1.25, { dong2: "Đừng đăng.", xoay: 0.04 });
  ctx.save(); ctx.translate(1010, 880); ctx.rotate(1.4); ve(ctx, rect(-12, -28, 24, 56, 11), "#dfe6ee", { w: 5 }); to(ctx, rect(-6, -22, 6, 36, 3), "#ffffff"); ctx.restore(); sao(ctx, 1030, 840, 26, t);
  viet(ctx, "Bàn tay", 560, 400, { size: 160, u: vao(tl, 0.1, 0.35), xoay: -0.05 });
  viet(ctx, "mười nghìn", 600, 590, { size: 180, mau: DO, u: vao(tl, 0.35, 0.35), xoay: 0.03 });
  viet(ctx, "— hết —", 600, 740, { size: 64, mau: "#6b6560", u: vao(tl, 0.9, 0.35) });
}

export const CANH = { 83: c83, 84: c84, 85: c85, 86: c86, 87: c87, 88: c88, 89: c89, 90: c90, 91: c91, 92: c92, 93: c93, 94: c94, 95: c95, 96: c96, 97: c97, 98: c98,
  99: c99, 100: c100, 101: c101, 102: c102, 103: c103, 104: c104, 105: c105, 106: c106, 107: c107, 108: c108, 109: c109, cuoi };
