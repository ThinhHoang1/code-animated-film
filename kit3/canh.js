// Cảnh câu 1–8 + tựa. Mốc hành động lấy theo thời điểm từng chữ trong giọng đọc: m(c, i) = giây của chữ thứ i.
import { W, H, MUC, GIAY, giay, viet, ve, vePts, net, netPts, to, bong, elip, rect, moHoi, gan, sao, tiaNhan, rung, vanLanh, dauHoi,
  T12, clamp, lerp, eio, eout, back, pha, on, rng } from "./but.js";
import { veNV, banTay, DA } from "./nv.js";
import * as D from "./do.js";

const m = (c, i) => c.moc[i]?.s ?? 99;
const vao = (tl, t0, d = 0.22) => clamp((tl - t0) / d);
function cam(ctx, x, y, z) { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-x, -y); }
function lac(ctx, tl, t0, a = 16, d = 0.3) { const u = tl - t0; if (u < 0 || u > d) return; const k = (1 - u / d) * a; ctx.translate(on(tl * 40, 1) * k, on(tl * 40, 2) * k); }
function chop(ctx, tl, t0, a = 0.85) { const u = tl - t0; if (u < 0 || u > 0.35) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(255,255,255,${(a * (1 - u / 0.35)).toFixed(3)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function toi(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(14,16,40,${a})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function muiTen(ctx, x1, y1, x2, y2, u = 1, mau = MUC) {   // mũi tên vẽ tay
  if (u <= 0) return; const x = lerp(x1, x2, u), y = lerp(y1, y2, u), a = Math.atan2(y2 - y1, x2 - x1);
  netPts(ctx, [[x1, y1], [(x1 + x) / 2 + (y - y1) * 0.12, (y1 + y) / 2 - (x - x1) * 0.12], [x, y]], { w: 5.5, mau, seed: 400 });
  if (u > 0.8) for (const s of [-1, 1]) netPts(ctx, [[x, y], [x - Math.cos(a + s * 0.5) * 26, y - Math.sin(a + s * 0.5) * 26]], { w: 5.5, mau, seed: 401 + s });
}
function khoanh(ctx, x, y, rx, ry, u, mau = "#e0392f") {   // khoanh tròn đỏ
  if (u <= 0) return; const n = 40, k = Math.floor(n * 1.12 * clamp(u)), pts = [];
  for (let i = 0; i <= k; i++) { const a = -2.2 + (i / n) * Math.PI * 2; pts.push([x + Math.cos(a) * rx * (1 + i * 0.002), y + Math.sin(a) * ry]); }
  if (pts.length > 1) netPts(ctx, pts, { w: 7, mau, seed: 410 });
}
function duaDua(ctx, x1, y1, x2, y2, w = 14) {   // một chiếc đũa
  const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a), ny = Math.cos(a);
  vePts(ctx, [[x1 + nx * w / 2, y1 + ny * w / 2], [x2 + nx * w * 0.3, y2 + ny * w * 0.3], [x2 - nx * w * 0.3, y2 - ny * w * 0.3], [x1 - nx * w / 2, y1 - ny * w / 2]], "#d9a866", { w: 3.5, seed: 420 + x1 });
}
function avatar(ctx, x, y, r, seed) {   // đầu người lạ mini
  const q = rng(seed), toc = ["#2a2631", "#6b3e26", "#c9772f", "#3c4b7a", "#a33a5c", "#e8c35a"][Math.floor(q() * 6)];
  ctx.save(); ctx.translate(x, y); ctx.scale(r / 100, r / 100);
  ve(ctx, elip(0, 10, 92, 84), DA, { w: 7 }); ve(ctx, q() > 0.5 ? "M-96,10 C-100,-70 -50,-96 0,-96 C50,-96 100,-70 96,10 C70,-30 -70,-30 -96,10 Z" : "M-96,40 C-110,-60 -50,-100 0,-100 C50,-100 110,-60 96,40 C90,0 70,-30 0,-34 C-70,-30 -90,0 -96,40 Z", toc, { w: 7 });
  to(ctx, elip(-30, 20, 9, 13), MUC); to(ctx, elip(30, 20, 9, 13), MUC); net(ctx, q() > 0.5 ? "M-14,50 C-6,58 6,58 14,50" : "M-12,54 L12,54", { w: 6 });
  ctx.restore();
}
function anhSushi(ctx, x, y, k = 1, xoay = 0) {   // ảnh chụp mâm sushi (polaroid)
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, rect(-170, -150, 340, 300, 8), "#ffffff", { w: 5 }); to(ctx, rect(-148, -128, 296, 220, 4), "#2f3550");
  ctx.save(); ctx.translate(0, -18); ctx.scale(1, 0.55); D.thot(ctx, 0, 0, 0.85); ctx.restore();
  for (let i = 0; i < 8; i++) D.sushi(ctx, -96 + (i % 4) * 64, -40 + Math.floor(i / 4) * 32, 0.55, i);
  ctx.restore();
}

/* phòng trọ đêm: tường, cửa sổ, đồng hồ, lịch, quạt, nệm */
function phongDem(ctx, t, o = {}) {
  D.phong(ctx, "#4d5578", "#3b405e", 860);
  D.cuaSo(ctx, 130, 120, 440, 320, t);
  D.dongHo(ctx, 760, 200, 58, o.gio ?? 11, o.phut ?? 0);
  D.lichO(ctx, 1660, 110, 200, 230, o.gach ?? 0);
  D.quat(ctx, 150, 870, 0.85, t);
}
/* bàn chụp sushi: Hiếu ngồi sau bàn, thớt + khay + đèn. S = tư thế Hiếu, o: {con (miếng trên thớt), khay, den, cam:fn vẽ thêm trên bàn} */
const HX = 1110, HY = 450, HK = 1.25;
const choSushi = (i) => [HX - 165 + (i % 4) * 110, 594 + Math.floor(i / 4) * 38];
function banSushi(ctx, t, S, o = {}) {
  const den = o.den ?? 0;
  if (den > 0) { ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.1 * den; to(ctx, elip(1150, 470, 560, 330), "#ffd36a"); ctx.restore(); }
  veNV(ctx, HX, HY, HK, { t, ...S, anTay: true, chan: false });
  D.ban(ctx, 1110, 640, 1180, 300);
  ctx.save(); ctx.translate(HX, 620); ctx.scale(1, 0.48); D.thot(ctx, 0, 0, 1.75, "go"); ctx.restore();
  const con = o.con ?? 8, popI = o.popI ?? -1, popU = o.popU ?? 1;
  for (let i = 0; i < Math.min(8, Math.ceil(con)); i++) { const [x, y] = choSushi(i); D.sushi(ctx, x, y, 1.05 * (i === popI ? back(popU) : 1), i); }
  if (o.khay !== false) D.khaySushi(ctx, 830, 612, 0.82, o.khay ?? 0, o.nhan ?? 1);
  D.denBan(ctx, 1480, 650, 1.05, den, -1);
  if (o.tren) o.tren(ctx);
  veNV(ctx, HX, HY, HK, { t, ...S, chiTay: true });
  D.quangDen(ctx, 1420, 418, 900, 1380, 640, den);
}
const local = (x, y) => [(x - HX) / HK, (y - HY) / HK];

/* ── CÂU 1: 11 giờ đêm, bày 8 miếng sushi giảm giá, bật đèn, giơ máy, Tách ── */
export function canh1(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl);
  const tBay = m(c, 6), tThot = m(c, 17) - 0.1, tDen = m(c, 19), tGio = m(c, 21), tTach = m(c, 25), t50 = m(c, 12);
  const buoc = (tThot - tBay) / 8;
  let S = { mat: "thuong", nhin: [-0.3, 0.6], tayP: { p: [96, 150], cong: 18 }, tayT: { p: [-96, 150], cong: -18 } };
  let con = 0, popI = -1, popU = 1, khay = 8, cam0 = [960, 540, lerp(1, 1.05, eio(tl / 1.5))], tren = null;
  if (tl >= tBay) {
    const k = Math.min(8, Math.floor((tq - tBay) / buoc)), u = ((tq - tBay) % buoc) / buoc;
    con = k; khay = 8 - k - (k < 8 && u > 0.45 ? 1 : 0); popI = k - 1; popU = clamp(((tl - tBay) % buoc) / 0.18 + (k >= 8 ? 1 : 0));
    if (k < 8) {
      const [sx, sy] = choSushi(k), pT = local(850, 600), pS = local(sx, sy - 22);
      const p = u < 0.45 ? [lerp(pS[0], pT[0], eio(u / 0.45)), lerp(pS[1], pT[1], eio(u / 0.45))] : [lerp(pT[0], pS[0], eio((u - 0.45) / 0.55)), lerp(pT[1], pS[1], eio((u - 0.45) / 0.55))];
      S.tayT = { p, cong: -22, kieu: "nam" };
      if (u > 0.45) { const hx = HX + p[0] * HK, hy = HY + p[1] * HK; tren = (g) => D.sushi(g, hx - 6, hy - 6, 0.9, k); }
      S.nhin = [p[0] / 160, 0.7];
    }
    cam0 = [1080, 520, 1.32];
  }
  if (tl >= t50 && tl < tDen) { S.mat = tl < t50 + 1 ? "nham" : "thuong"; if (tl < t50 + 1) S.nhin = [0, 0]; }
  let den = 0;
  if (tl >= tDen - 0.3) { S.tayP = { p: local(1470, 632), cong: 30, kieu: "chi", dai: true }; cam0 = [1220, 500, 1.3]; S.mat = "thuong"; S.nhin = [0.6, 0.3]; }
  if (tl >= tDen) den = 1;
  if (tl >= tGio) {
    const u = eout(vao(tq, tGio, 0.3));
    S = { mat: "nham", nhin: [0, -0.9], tayT: { p: [lerp(-96, -40, u), lerp(150, -205, u)], cong: -30 }, tayP: { p: [lerp(96, 40, u), lerp(150, -205, u)], cong: 30 } };
    cam0 = [1110, 410, 1.1];
    const py = HY + lerp(150, -230, u) * HK; tren = null;
    S.sauTay = (g) => D.dienThoaiSau(g, HX, py, 0.9, Math.PI);
  }
  ctx.save(); cam(ctx, ...cam0); if (tl >= tTach) lac(ctx, tl, tTach, 12);
  phongDem(ctx, t, { gio: 11, phut: Math.floor(tl * 2) });
  toi(ctx, den ? 0.05 : 0.22);
  banSushi(ctx, t, S, { con, popI, popU, khay, den, tren: (g) => { tren?.(g); } });
  if (S.sauTay) { S.sauTay(ctx); veNV(ctx, HX, HY, HK, { t, ...S, chiTay: true }); }
  if (tl >= t50 && tl < tDen) { viet(ctx, "giảm 50%!", 700, 470, { size: 70, mau: "#ffd93b", u: vao(tl, t50 + 0.2), xoay: -0.08 }); muiTen(ctx, 720, 490, 800, 560, vao(tl, t50 + 0.3, 0.3), "#ffd93b"); }
  if (tl >= tDen && tl < tGio) { viet(ctx, "cạch", 1560, 360, { size: 60, mau: "#ffd93b", u: vao(tl, tDen) }); tiaNhan(ctx, 1425, 400, 60, 100, 5, { mau: "#ffd93b", w: 5 }); }
  if (tl >= tTach) { const py = HY - 230 * HK; tiaNhan(ctx, HX, py, 150, 230, 9, { a0: -Math.PI / 2, goc: 0.42, mau: "#ffffff", w: 8 }); viet(ctx, "TÁCH!", HX + 330, py + 40, { size: 120, mau: "#ffffff", u: vao(tl, tTach, 0.18), xoay: 0.1 }); }
  ctx.restore();
  if (tl < m(c, 5) + 0.6) { viet(ctx, "11 giờ đêm", 1240, 170, { size: 92, mau: GIAY, u: vao(tl, 0.05, 0.3), xoay: -0.04 }); viet(ctx, "thứ Bảy", 1290, 270, { size: 72, mau: "#ffd93b", u: vao(tl, m(c, 3), 0.3), xoay: 0.03 }); }
  chop(ctx, tl, tTach, 0.8);
}

/* ── CÂU 2: 30 góc → omakase của 30 người trên Threads, mỗi đứa 10 nghìn ── */
const TU_THE = [
  { x: 610, y: 560, r: 0.18, k: 0.95, co: 1 }, { x: 1380, y: 900, r: -1.45, k: 0.95, co: 1 }, { x: 960, y: 230, r: Math.PI, k: 0.8, co: 1 },
  { x: 640, y: 760, r: 0.05, k: 0.95, co: 0.78 }, { x: 1310, y: 560, r: -0.32, k: 0.95, co: 1 }, { x: 560, y: 900, r: 1.45, k: 0.95, co: 1 }, { x: 1330, y: 760, r: 0.1, k: 0.9, co: 0.8 },
];
export function canh2(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tBua = m(c, 2), tOma = m(c, 8), tCua = m(c, 11), tMoi = m(c, 16), t10 = m(c, 20);
  giay(ctx);
  if (tl < tBua) {
    // 30 góc: Hiếu đổi tư thế loạn xạ quanh mâm sushi đặt trên ghế nhựa
    D.gheNhua(ctx, 960, 900, 1.3); ctx.save(); ctx.translate(960, 712); ctx.scale(1, 0.5); D.thot(ctx, 0, 0, 1.1); ctx.restore();
    for (let i = 0; i < 8; i++) D.sushi(ctx, 870 + (i % 4) * 60, 700 + Math.floor(i / 4) * 22, 0.55, i);
    const i = Math.floor(tq * 8) % TU_THE.length, P = TU_THE[i];
    ctx.save(); ctx.translate(P.x, P.y); ctx.rotate(P.r);
    const dx = 960 - P.x, dy = 700 - P.y, lx = Math.cos(-P.r) * dx - Math.sin(-P.r) * dy, ly = Math.sin(-P.r) * dx + Math.cos(-P.r) * dy;
    const a = Math.atan2(ly, lx), hx = Math.cos(a) * 150, hy = -60 + Math.sin(a) * 80;
    veNV(ctx, 0, 0, P.k, { t, mat: i % 2 ? "nham" : "ngac", co: P.co, nhin: [Math.cos(a) * 0.8, Math.sin(a) * 0.8], tayT: { p: [hx - 24, hy], cong: -20 }, tayP: { p: [hx + 24, hy], cong: 20 } });
    D.dienThoaiSau(ctx, hx * P.k, hy * P.k, 0.42 * P.k, a + Math.PI / 2);
    ctx.restore();
    if (Math.floor(tq * 8) !== Math.floor((tq - 1 / 12) * 8)) chop(ctx, 0, 0, 0.35);
    const n = Math.min(30, 1 + Math.floor((tl / tBua) * 30));
    viet(ctx, `góc ${n}`, 300, 180, { size: 84, pop: false, xoay: -0.05 });
    if (tl >= m(c, 1)) viet(ctx, "30 GÓC", 1560, 200, { size: 120, mau: "#e0392f", u: vao(tl, m(c, 1)), xoay: 0.06 });
  } else if (tl < tCua) {
    // tuần sau ảnh này thành "omakase"
    const u = vao(tl, tOma, 0.4);
    if (u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = "#1f2440"; ctx.fillRect(0, 0, W, H); ctx.restore(); for (let i = 0; i < 12; i++) { const q = rng(500 + i); sao(ctx, q() * W, q() * H, 10 + q() * 16, t + i, "#ffd76a"); } }
    anhSushi(ctx, 1100, 520, lerp(1.1, 1.35, eio(pha(tl, tBua, tCua))), -0.04);
    if (u > 0) { net(ctx, rect(1100 - 250, 520 - 220, 500, 440, 8), { w: 12, mau: "#e8b93c" }); viet(ctx, "OMAKASE", 1100, 870, { size: 130, mau: "#ffd76a", u, font: "Pangolin" }); }
    veNV(ctx, 400, 640, 1.05, { t, mat: u > 0 ? "nham" : "thuong", noi: 0, nhin: [0.7, 0], tayP: { p: [150, 20], cong: 26, kieu: "xoe" } });
    if (u > 0) { ve(ctx, "M-120,-178 C-60,-200 60,-200 120,-178 L120,-150 C60,-170 -60,-170 -120,-150 Z".replace(/(-?\d+),(-?\d+)/g, (s, a, b) => `${400 + a * 1.05},${640 + b * 1.05}`), "#ffffff", { w: 5 }); to(ctx, elip(400, 640 - 200 * 1.05, 16, 16), "#e0392f"); }
    viet(ctx, "tuần sau", 400, 200, { size: 80, mau: u > 0 ? GIAY : MUC, u: vao(tl, m(c, 4)), xoay: -0.05 });
  } else if (tl < tMoi) {
    // 30 người trên Threads đăng lại
    viet(ctx, "30 người trên Threads", W / 2, 110, { size: 82, u: vao(tl, tCua) });
    for (let i = 0; i < 30; i++) {
      const x = 270 + (i % 10) * 153, y = 300 + Math.floor(i / 10) * 255, u = vao(tl, tCua + 0.1 + i * 0.035, 0.2);
      if (u <= 0) continue;
      ctx.save(); ctx.translate(x, y); ctx.scale(back(u), back(u));
      D.dienThoai(ctx, 0, 0, 0.72, 0, (g) => { g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280); avatar(g, -44, -100, 24, 600 + i); g.fillStyle = "#bfc4cf"; g.fillRect(-12, -108, 70, 10); g.fillRect(-12, -88, 46, 8); g.save(); g.translate(0, 10); g.scale(0.38, 0.4); anhSushi(g, 0, 0, 1); g.restore(); viet(g, "omakase ✨", 0, 112, { size: 26, pop: false, soi: false }); });
      ctx.restore();
    }
  } else {
    // mỗi đứa trả 10 nghìn — tiền bay về tay Hiếu
    const vui = tl >= t10;
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2, r0 = 900, x0 = 960 + Math.cos(a) * r0, y0 = 560 + Math.sin(a) * r0 * 0.62;
      const u = clamp((tl - tMoi - i * 0.045) / 0.7); if (u <= 0) continue;
      const e = eio(u); D.tien(ctx, lerp(x0, 960 + Math.cos(a) * 60, e), lerp(y0, 380 + Math.sin(a) * 30, e), lerp(0.7, 0.32, e), 10, a * 2 + u * 3);
    }
    veNV(ctx, 960, 620, 1.1, { t, mat: vui ? "cuoi" : "nham", nhun: vui ? -Math.abs(Math.sin(T12(tl) * 9)) * 14 : 0, tayT: { p: [-120, -150], cong: -20, kieu: "xoe" }, tayP: { p: [120, -150], cong: 20, kieu: "xoe", lat: -1 } });
    viet(ctx, "mỗi đứa", 380, 620, { size: 84, u: vao(tl, m(c, 16)), xoay: -0.06 });
    viet(ctx, "10 nghìn", 1560, 640, { size: 120, mau: "#2f9e57", u: vao(tl, t10), xoay: 0.06 });
    if (vui) { viet(ctx, "+10k +10k +10k…", W / 2, 1010, { size: 64, mau: "#2f9e57", u: vao(tl, t10 + 0.2) }); }
  }
}

/* ── CÂU 3: người duy nhất được ăn thật là tôi, sau khi chụp xong. Nguội ngắt, nhưng mà sang ── */
export function canh3(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tToi = m(c, 7), tSau = m(c, 8), tXong = m(c, 11), tNguoi = m(c, 12), tSang = m(c, 14);
  if (tl < tSau) {
    let S = { mat: "thuong", nhin: [0, 0.6] };
    if (tl >= tToi) S = { mat: "cuoi", nhin: [0, 0], tayP: { p: [30, 40], cong: 40, kieu: "chi", lat: -1 }, nhun: -6 };
    ctx.save(); cam(ctx, 1110, 470, 1.3); phongDem(ctx, t, { gio: 11, phut: 50 }); toi(ctx, 0.05);
    banSushi(ctx, t, S, { con: 8, khay: false, den: 1 }); ctx.restore();
    viet(ctx, "người duy nhất được ăn thật", W / 2, 140, { size: 76, mau: GIAY, u: vao(tl, 0.05) });
    if (tl >= tToi) { viet(ctx, "LÀ TÔI", 1560, 520, { size: 120, mau: "#ffd93b", u: vao(tl, tToi), xoay: 0.08 }); muiTen(ctx, 1450, 560, 1250, 600, vao(tl, tToi + 0.15, 0.3), "#ffd93b"); }
  } else if (tl < tNguoi) {
    // sau khi chụp xong: đồng hồ quay vèo, Hiếu chụp mãi
    const xong = tl >= tXong, sp = (tl - tSau) * 40;
    ctx.save(); cam(ctx, 1110, 430, 1.15); phongDem(ctx, t, { gio: 11 + sp / 60, phut: sp % 60 }); toi(ctx, 0.05);
    const S = xong ? { mat: "chan", nhin: [0, 0.4] } : { mat: "nham", nhin: [0, -0.9], tayT: { p: [-40, -205], cong: -30 }, tayP: { p: [40, -205], cong: 30 } };
    banSushi(ctx, t, S, { con: 8, khay: false, den: 1 });
    if (!xong) { D.dienThoaiSau(ctx, HX, HY - 230 * HK, 0.9, Math.PI); veNV(ctx, HX, HY, HK, { t, ...S, chiTay: true }); if (Math.floor(tq * 6) % 2 === 0) tiaNhan(ctx, HX, HY - 230 * HK, 140, 200, 7, { mau: "#fff", w: 6, goc: 0.4 }); }
    ctx.restore();
    viet(ctx, "(sau khi chụp xong)", W / 2, 1000, { size: 70, mau: GIAY, u: vao(tl, tSau) });
    if (xong) viet(ctx, "23:59", 760, 330, { size: 60, mau: "#ffd93b", u: vao(tl, tXong) });
  } else if (tl < tSang) {
    // nguội ngắt: cận mặt, cắn miếng sushi lạnh run
    ctx.fillStyle = "#cfe8f6"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 14; i++) { const q = rng(700 + i), x = q() * W, y = ((q() * H + tl * 120) % H); sao(ctx, x, y, 8 + q() * 8, t + i, "#ffffff"); }
    const run = Math.floor(tq * 12) % 2 ? 5 : -5;
    ctx.save(); ctx.translate(run, 0);
    veNV(ctx, 960, 900, 2.6, { t, mat: "chan", nhin: [0, 0.2], tayP: { p: [44, -50], cong: 40, kieu: "nam" }, chan: false });
    duaDua(ctx, 960 + 44 * 2.6 + 20, 900 - 50 * 2.6, 960 + 10, 900 - 70 * 2.6 - 10); duaDua(ctx, 960 + 44 * 2.6 + 30, 900 - 40 * 2.6, 960 + 16, 900 - 56 * 2.6);
    D.sushi(ctx, 975, 900 - 66 * 2.6, 1.3, 0);
    vanLanh(ctx, 960, 900 - 80 * 2.6, 120, t);
    for (let i = 0; i < 7; i++) netPts(ctx, [[860 + i * 34, 560], [860 + i * 34, 620 - (i % 2) * 14]], { w: 5, mau: "#4f8fd1", seed: 700 + i });   // vạch "tụt mood" trên trán
    viet(ctx, "brrr…", 420, 760, { size: 90, mau: "#2f7fc0", u: vao(tl, tNguoi + 0.4), xoay: -0.1 });
    for (const [x, y] of [[700, 300], [1230, 280], [760, 520], [1180, 520]]) { netPts(ctx, [[x, y], [x + 16, y + 10], [x, y + 20], [x + 16, y + 30]], { w: 4, mau: "#4f9fd1" }); }
    ctx.restore();
    viet(ctx, "nguội ngắt…", 1580, 190, { size: 110, mau: "#2f7fc0", u: vao(tl, tNguoi), xoay: -0.05 });
  } else {
    // nhưng mà sang: ngón út vểnh, lấp lánh hồng
    ctx.fillStyle = "#fde4ec"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 16; i++) { const q = rng(800 + i); sao(ctx, 200 + q() * 1520, 120 + q() * 840, 12 + q() * 18, t * 1.3 + i, i % 3 ? "#ffd76a" : "#ffffff"); }
    veNV(ctx, 900, 640, 1.35, { t, mat: "sang", ngh: -0.08, nhin: [0.3, -0.2], tayP: { p: [150, -40], cong: 40, kieu: "xoe" }, chan: false });
    const hx = 900 + 150 * 1.35, hy = 640 - 40 * 1.35;
    duaDua(ctx, hx - 10, hy - 6, hx - 150, hy - 160); duaDua(ctx, hx, hy + 6, hx - 130, hy - 150);
    D.sushi(ctx, hx - 140, hy - 168, 0.8, 0);
    viet(ctx, "…nhưng mà", 1500, 330, { size: 80, u: vao(tl, tSang), xoay: -0.05 });
    viet(ctx, "SANG", 1520, 500, { size: 170, mau: "#e8a21c", u: vao(tl, m(c, 16)), xoay: 0.06 });
    if (tl >= m(c, 16)) tiaNhan(ctx, 1520, 450, 150, 210, 9, { a0: -Math.PI / 2, goc: 0.36, mau: "#e8a21c", w: 6 });
  }
}

/* bàn tay cận cảnh cầm đũa, đeo nhẫn (đầu ngón chỉ sang trái) */
function tayCanh(ctx, x, y, k, t, sang = 0, sushiO = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(-0.12);
  duaDua(ctx, -30, -56, -520, -150, 18); duaDua(ctx, -30, -10, -520, -70, 18);
  if (sushiO) D.sushi(ctx, -500, -120, 1.4, 0);
  ve(ctx, "M120,-80 L360,-110 L360,150 L110,120 C150,70 150,-30 120,-80 Z", "#f2b544", { w: 6 }); bong(ctx, "M120,-80 L360,-110 L360,150 L110,120 C150,70 150,-30 120,-80 Z", "M100,60 L380,40 L380,160 L100,160 Z", "#d8952a");
  net(ctx, "M130,-76 C160,-20 160,60 124,118", { w: 5 });
  const V = { w: 5.5 };
  ve(ctx, "M-26,30 C-60,30 -88,40 -92,60 C-94,80 -72,86 -58,78 C-44,70 -34,62 -16,60 Z", DA, V);       // áp út co
  ve(ctx, "M-6,64 C-34,70 -52,82 -50,98 C-48,110 -28,112 -18,102 C-10,94 -2,88 8,86 Z", DA, V);         // út co
  ve(ctx, "M-20,-14 C-70,-14 -116,-10 -134,-4 C-152,2 -148,30 -130,30 C-100,28 -62,24 -26,26 Z", DA, V); // giữa đỡ đũa dưới
  ve(ctx, "M-30,-60 C20,-92 110,-84 140,-36 C164,6 156,70 116,96 C70,120 0,112 -30,80 C-56,52 -60,-30 -30,-60 Z", DA, V);   // mu bàn tay
  ve(ctx, "M-10,-62 C-60,-72 -110,-80 -142,-76 C-162,-72 -160,-46 -140,-44 C-110,-42 -62,-32 -14,-24 Z", DA, V); // trỏ
  ve(ctx, "M44,-72 C4,-98 -56,-102 -86,-94 C-104,-88 -100,-66 -82,-64 C-46,-62 -6,-52 24,-42 Z", DA, V);   // cái
  for (const [x1, y1] of [[-120, -66], [-114, 8], [-70, -84]]) net(ctx, `M${x1},${y1 - 8} C${x1 + 6},${y1 - 2} ${x1 + 6},${y1 + 6} ${x1},${y1 + 10}`, { w: 3 });
  // nhẫn bạc trên ngón áp út
  ctx.save(); ctx.translate(-66, 62); ctx.rotate(0.35); ve(ctx, rect(-10, -24, 20, 48, 9), "#dfe6ee", { w: 5 }); to(ctx, rect(-5, -18, 5, 30, 3), "#ffffff"); ctx.restore();
  ctx.restore();
  if (sang > 0) sao(ctx, x + (-66 * Math.cos(-0.12) - 62 * Math.sin(-0.12)) * k + 20, y + (-66 * Math.sin(-0.12) + 62 * Math.cos(-0.12)) * k - 40, 46 * sang, t);
}
/* ── CÂU 4: nhẫn bạc mẹ mua → 3 tháng sau mẹ gọi video lúc 12h trưa: "Tay ai đây?" ── */
export function canh4(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tNhan = m(c, 7), tMe = m(c, 9), tBa = m(c, 12), tChinh = m(c, 15), tLuc = m(c, 24), tKhong = m(c, 28), tCom = m(c, 31), tMa = m(c, 33), tTay = m(c, 35);
  if (tl < tBa) {
    ctx.fillStyle = "#fff4e6"; ctx.fillRect(0, 0, W, H);
    const z = lerp(1, 1.08, eio(tl / tBa));
    tayCanh(ctx, 1150, 560, 1.55 * z, t, tl >= tNhan ? 1 : 0);
    if (tl >= m(c, 8)) { viet(ctx, "nhẫn bạc", 640, 860, { size: 96, u: vao(tl, m(c, 8)), xoay: -0.05 }); muiTen(ctx, 800, 820, 960, 700, vao(tl, m(c, 8) + 0.1, 0.3)); }
    if (tl >= tMe) viet(ctx, "mẹ mua ♥", 640, 970, { size: 80, mau: "#e0392f", u: vao(tl, tMe), xoay: 0.03 });
  } else if (tl < tChinh) {
    giay(ctx);
    const thang = ["THÁNG 9", "THÁNG 10", "THÁNG 11", "THÁNG 12"][Math.min(3, Math.floor((tl - tBa) / 0.3))];
    D.lichO(ctx, 760, 260, 400, 470, 30, { tieuDe: thang });
    viet(ctx, "3 tháng sau…", W / 2, 150, { size: 100, u: vao(tl, tBa) });
  } else if (tl < tLuc) {
    // điện thoại rung bần bật: "Mẹ" gọi video
    giay(ctx, "#f3efe6");
    const run = (Math.floor(tq * 12) % 2 ? 1 : -1) * 6;
    ve(ctx, rect(-20, 760, W + 40, 400, 0), "#c48b5c", { w: 6 });
    D.dienThoai(ctx, 960 + run, 520, 1.55, run * 0.004, (g) => {
      g.fillStyle = "#3a4466"; g.fillRect(-80, -140, 160, 280);
      g.save(); g.beginPath(); g.arc(0, -50, 46, 0, 7); g.clip(); veNV(g, 0, 20, 0.38, { t, kieu: "me", mat: "thuong" }); g.restore(); net(g, elip(0, -50, 46, 46), { w: 3, mau: "#fff" });
      viet(g, "Mẹ ♥", 0, 30, { size: 34, mau: "#fff", pop: false }); viet(g, "cuộc gọi video…", 0, 58, { size: 18, mau: "#c9d4ee", pop: false });
      to(g, elip(-40, 108, 16, 16), "#e5484d"); to(g, elip(40, 108, 16, 16), "#30c46b");
    });
    rung(ctx, 960, 520, 300, 2);
    veNV(ctx, 1640, 760, 1.1, { t, mat: "soc", nhin: [-0.8, 0], chan: false, tayT: { p: [-100, 40], cong: -10, kieu: "xoe" } });
    moHoi(ctx, 1520, 520, 1.1);
    viet(ctx, "chính cái nhẫn này…", 520, 160, { size: 76, u: vao(tl, tChinh), xoay: -0.04 });
  } else if (tl < tKhong) {
    // 12 giờ trưa
    giay(ctx, "#fff8e1");
    D.cuaSo(ctx, 160, 160, 520, 380, t, false); ve(ctx, elip(560, 250, 60, 60), "#ffd23e", { w: 5 }); tiaNhan(ctx, 560, 250, 76, 110, 10, { a0: 0, goc: 0.63, w: 5, mau: "#e8a21c" });
    D.dongHo(ctx, 1000, 330, 140, 12, 0);
    viet(ctx, "12 giờ trưa", 1000, 620, { size: 110, u: vao(tl, m(c, 25)) });
    veNV(ctx, 1560, 700, 1.15, { t, mat: "hoang", nhin: [-0.4, 0.6], chan: false, tayT: { p: [-60, 96], cong: -30 }, tayP: { p: [20, 100], cong: 30 } });
    D.dienThoaiSau(ctx, 1560 - 22 * 1.15, 700 + 92 * 1.15, 0.55, 0.12); moHoi(ctx, 1420, 470, 0.9);
  } else {
    // mẹ hiện trên màn hình
    giay(ctx, "#2b3150");
    const hoi = tl >= tMa, z = hoi ? lerp(1, 1.18, eio(pha(tl, tMa, tMa + 0.8))) : 1;
    ctx.save(); ctx.translate(760, 540); ctx.scale(z, z); ctx.translate(-760, -540);
    D.dienThoai(ctx, 760, 560, 3.25, 0, (g) => {
      g.fillStyle = "#e9dcc8"; g.fillRect(-80, -140, 160, 280); g.fillStyle = "#cdb89a"; g.fillRect(-80, 40, 160, 100);
      veNV(g, hoi ? -18 : 0, 60, 0.42, { t, kieu: "me", mat: hoi ? "nheo" : "thuong", noi: c.noi, chan: false, ngh: hoi ? 0.1 : 0, tayP: hoi ? { p: [150, -40], cong: 20, kieu: "nam" } : undefined });
      if (hoi) {
        D.dienThoai(g, 46, -10, 0.36, 0.1, (h) => { h.fillStyle = "#fff"; h.fillRect(-80, -140, 160, 280); h.save(); h.scale(0.36, 0.36); tayCanh(h, 60, 40, 0.45, t, 0, false); h.restore(); if (tl >= tTay) khoanh(h, -10, 12, 34, 28, vao(tl, tTay, 0.4)); });
      }
    }, { vo: "#1c1f2e" });
    ctx.restore();
    if (tl < tMa) { viet(ctx, "“Ăn cơm chưa con?”", 1520, 320, { size: 76, mau: GIAY, u: vao(tl, tKhong + 0.1) }); if (tl >= tCom) { netPts(ctx, [[1200, 260], [1840, 360]], { w: 14, mau: "#e0392f" }); netPts(ctx, [[1200, 360], [1840, 260]], { w: 14, mau: "#e0392f" }); } }
    if (tl >= tTay) { viet(ctx, "TAY AI", 1560, 330, { size: 150, mau: "#ff5a4f", u: vao(tl, tTay, 0.2), xoay: 0.05 }); viet(ctx, "ĐÂY?", 1580, 500, { size: 170, mau: "#ff5a4f", u: vao(tl, m(c, 37), 0.2), xoay: -0.04 }); }
    if (tl >= m(c, 36)) { veNV(ctx, 1560, 1040, 0.85, { t, mat: "soc", nhin: [-0.6, -0.3], chan: false }); moHoi(ctx, 1680, 800, 1); moHoi(ctx, 1450, 830, 0.8, -0.3); }
  }
}

/* ── TỰA ── */
export function canhTua(ctx, t, uf, c) {
  const tl = c.tl; giay(ctx);
  for (let i = 0; i < 10; i++) { const q = rng(900 + i); sao(ctx, 160 + q() * 1600, 120 + q() * 840, 12 + q() * 12, t + i, i % 2 ? "#ffd76a" : "#f39c9c"); }
  tayCanh(ctx, 1560, 860, 0.85 * back(vao(tl, 0.1, 0.4)), t, 1, true);
  D.tien(ctx, 1440, 330, 1.3 * back(vao(tl, 0.5, 0.3)), 10, -0.2);
  viet(ctx, "Bàn tay", 600, 360, { size: 170, u: vao(tl, 0.05, 0.3), xoay: -0.05 });
  viet(ctx, "mười nghìn", 660, 560, { size: 190, mau: "#e0392f", u: vao(tl, 0.35, 0.3), xoay: 0.03 });
  viet(ctx, "một truyện ở Threads City", 660, 700, { size: 56, mau: "#6b6560", u: vao(tl, 0.8, 0.3) });
}
import { canh5, canh6, canh7, canh8 } from "./canh2.js";
export const CANH = { 1: canh1, 2: canh2, 3: canh3, 4: canh4, tua: canhTua, 5: canh5, 6: canh6, 7: canh7, 8: canh8 };
