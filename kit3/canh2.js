// Cảnh câu 5–8. m(c, i) = giây của chữ thứ i trong giọng đọc.
import { W, H, MUC, GIAY, giay, viet, doRong, ve, vePts, net, netPts, to, bong, elip, rect, moHoi, gan, sao, tiaNhan, rung, dauHoi,
  T12, clamp, lerp, eio, eout, back, pha, on, rng } from "./but.js";
import { veNV, banTay, DA } from "./nv.js";
import * as D from "./do.js";

const m = (c, i) => c.moc[i]?.s ?? 99;
const vao = (tl, t0, d = 0.22) => clamp((tl - t0) / d);
function cam(ctx, x, y, z) { ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-x, -y); }
function lac(ctx, tl, t0, a = 16, d = 0.3) { const u = tl - t0; if (u < 0 || u > d) return; const k = (1 - u / d) * a; ctx.translate(on(tl * 40, 1) * k, on(tl * 40, 2) * k); }
function chop(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function muiTen(ctx, x1, y1, x2, y2, u = 1, mau = MUC) {
  if (u <= 0) return; const x = lerp(x1, x2, u), y = lerp(y1, y2, u), a = Math.atan2(y2 - y1, x2 - x1);
  netPts(ctx, [[x1, y1], [(x1 + x) / 2 + (y - y1) * 0.12, (y1 + y) / 2 - (x - x1) * 0.12], [x, y]], { w: 5.5, mau, seed: 400 });
  if (u > 0.8) for (const s of [-1, 1]) netPts(ctx, [[x, y], [x - Math.cos(a + s * 0.5) * 26, y - Math.sin(a + s * 0.5) * 26]], { w: 5.5, mau, seed: 401 + s });
}
function khoanh(ctx, x, y, rx, ry, u, mau = "#e0392f", w = 8) {
  if (u <= 0) return; const n = 40, k = Math.floor(n * 1.12 * clamp(u)), pts = [];
  for (let i = 0; i <= k; i++) { const a = -2.2 + (i / n) * Math.PI * 2; pts.push([x + Math.cos(a) * rx * (1 + i * 0.002), y + Math.sin(a) * ry]); }
  if (pts.length > 1) netPts(ctx, pts, { w, mau, seed: 410 });
}
function cocTien(ctx, x, y, k = 1, xoay = 0) {   // cọc tiền 1 triệu có đai giấy
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  for (let i = 3; i >= 0; i--) ve(ctx, rect(-100 + i * 4, -46 - i * 6, 200, 92, 8), "#86cfe0", { w: 4, seed: 600 + i });
  ve(ctx, rect(-26, -64, 52, 104, 4), "#fff4d6", { w: 4 }); viet(ctx, "1tr", 0, 2, { size: 30, pop: false, soi: false });
  ctx.restore();
}
function phongDem(ctx, t, o = {}) {
  D.phong(ctx, "#4d5578", "#3b405e", 860);
  D.cuaSo(ctx, 130, 120, 440, 320, t, o.dem ?? true);
  D.dongHo(ctx, 760, 200, 58, o.gio ?? 11, o.phut ?? 0);
  D.quat(ctx, 150, 870, 0.85, t);
}

/* ── CÂU 5: 23 tuổi, chụp ảnh cho shop đồ gỗ = cả ngày chụp thớt ── */
function studio(ctx, t, tl, o = {}) {
  giay(ctx, "#f4f1ea");
  to(ctx, "M-20,780 C400,700 1520,700 1940,780 L1940,1100 L-20,1100 Z", "#ffffff"); net(ctx, "M-20,780 C400,700 1520,700 1940,780", { w: 5 });
  D.softbox(ctx, 300, 960, 1.05); D.softbox(ctx, 1620, 960, 1.05, -1);
  if (o.bien) { const u = o.bien; ctx.save(); ctx.translate(960, 120); ctx.scale(back(u), back(u)); net(ctx, "M-200,-90 L-150,-40 M200,-90 L150,-40", { w: 5 }); ve(ctx, rect(-330, -40, 660, 110, 14), "#a5683e", { w: 6 }); viet(ctx, "ĐỒ GỖ PHÚC LỘC", 0, 34, { size: 70, mau: "#fff4d6", pop: false }); ctx.restore(); }
  const n = o.chong ?? 0;   // chồng thớt hai bên
  for (let s = 0; s < 2; s++) for (let i = 0; i < n; i++) { ctx.save(); ctx.translate(s ? 1330 : 590, 820 - i * 34); ctx.scale(0.7, 0.42); D.thot(ctx, 0, 0, 1, ["go", "nhua", "tre", "den"][(i + s) % 4], (i % 3 - 1) * 0.04); ctx.restore(); }
  ve(ctx, rect(760, 700, 400, 70, 8), "#ffffff", { w: 5 }); ve(ctx, rect(780, 770, 30, 190, 4), "#d6d6d6", { w: 4 }); ve(ctx, rect(1110, 770, 30, 190, 4), "#d6d6d6", { w: 4 });
  ctx.save(); ctx.translate(960, 600); ctx.rotate(-0.05); D.thot(ctx, 0, 0, 0.85, "go", -Math.PI / 2 + 0.1); ctx.restore();
}
function hieuChup(ctx, t, x, y, k, mat, o = {}) {
  veNV(ctx, x, y, k, { t, mat, nhin: [0.6, 0], tayT: { p: [-36, -78], cong: -40 }, tayP: { p: [70, -86], cong: 30 }, ...o });
  D.mayAnh(ctx, x + 60 * k, y - 92 * k, 0.75 * k, 0.05);
}
export function canh5(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tChup = m(c, 4), tShop = m(c, 10), tTuc = m(c, 13), tThot = m(c, 19), tGo = m(c, 20), tNhua = m(c, 22), tTre = m(c, 24), tDoi = m(c, 26);
  if (tl < tChup) {
    giay(ctx);
    veNV(ctx, 960, 560, 1.15, { t, mat: "cuoi", noi: c.noi, nhun: -Math.abs(Math.sin(tq * 6)) * 8, tayP: { p: [130, -110], cong: 26, kieu: "xoe", lat: -1 } });
    viet(ctx, "Hiếu, 23 tuổi", 1480, 260, { size: 90, u: vao(tl, m(c, 1)), xoay: 0.04 }); muiTen(ctx, 1340, 300, 1130, 360, vao(tl, m(c, 1) + 0.15, 0.3));
  } else if (tl < tGo) {
    const caNgay = tl >= tTuc, n = caNgay ? Math.min(9, Math.floor((tl - tTuc) * 7)) : 0;
    ctx.save(); lac(ctx, tl, tShop, 6);
    studio(ctx, t, tl, { bien: vao(tl, tShop, 0.3), chong: n });
    hieuChup(ctx, t, 1180, 560, 1.0, caNgay ? "chan" : "thuong");
    const nhay = caNgay ? 0.25 : 0.7; if (((tl - tChup) % nhay) < 0.07) { ctx.restore(); chop(ctx, 0.55); ctx.save(); }
    ctx.restore();
    if (caNgay) {   // mặt trời → mặt trăng chạy vòng: cả ngày
      const u = clamp((tl - tTuc) / (tGo - tTuc)), a = Math.PI + u * Math.PI, x = 960 + Math.cos(a) * 760, y = 330 + Math.sin(a) * 220;
      if (u < 0.6) { ve(ctx, elip(x, y, 44, 44), "#ffd23e", { w: 5 }); tiaNhan(ctx, x, y, 56, 80, 8, { a0: 0, goc: 0.785, w: 4, mau: "#e8a21c" }); }
      else { ve(ctx, elip(x, y, 40, 40), "#fff3c2", { w: 5 }); }
      viet(ctx, "cả ngày", 560, 340, { size: 84, u: vao(tl, m(c, 15)), xoay: -0.06 }); viet(ctx, "chụp thớt", 580, 450, { size: 84, mau: "#a5683e", u: vao(tl, tThot), xoay: -0.03 });
    } else { viet(ctx, "chụp ảnh", 560, 340, { size: 80, u: vao(tl, tChup), xoay: -0.05 }); viet(ctx, "sản phẩm", 580, 440, { size: 80, u: vao(tl, m(c, 6)), xoay: -0.03 }); }
  } else if (tl < tDoi) {
    giay(ctx, "#f4f1ea");
    ctx.save();
    for (const [t0, x, y, loai, chu, xo] of [[tGo, 470, 470, "go", "thớt gỗ", -0.22], [tNhua, 960, 520, "nhua", "thớt nhựa", 0.06], [tTre, 1450, 470, "tre", "thớt tre", 0.24]]) {
      if (tl < t0) continue; const u = vao(tl, t0, 0.18);
      ctx.save(); lac(ctx, tl, t0, 14); ctx.translate(x, lerp(-300, y, eout(u))); ctx.rotate(xo); D.thot(ctx, 0, 0, 1.25, loai, -Math.PI / 2); ctx.restore();
      viet(ctx, chu, x, y + 300, { size: 76, u: vao(tl, t0 + 0.1), mau: loai === "nhua" ? "#3f8f6b" : "#a5683e" });
      if (u >= 1 && tl < t0 + 0.3) tiaNhan(ctx, x, y + 230, 30, 80, 5, { a0: Math.PI / 2, goc: 0.5, w: 5 });
    }
    ctx.restore();
    const mat = tl >= tTre ? "dut" : tl >= tNhua ? "chan" : "thuong";
    veNV(ctx, 960, 1040, 0.8, { t, mat, chan: false, than: true });
  } else {
    // đời xoay quanh cái thớt
    giay(ctx);
    const items = [];
    for (let i = 0; i < 5; i++) { const a = (tl - tDoi) * 2.4 + (i / 5) * Math.PI * 2; items.push({ a, x: 960 + Math.cos(a) * 360, y: 470 + Math.sin(a) * 110, z: Math.sin(a), i }); }
    const veThot = (o) => { ctx.save(); ctx.translate(o.x, o.y); const k = 0.62 + 0.16 * o.z; D.thot(ctx, 0, 0, k, ["go", "nhua", "tre"][o.i % 3], -0.3 + o.z * 0.2); ctx.restore(); };
    ctx.save(); ctx.globalAlpha = 0.5; net(ctx, elip(960, 470, 360, 110), { w: 3, mau: "#b9b4ab" }); ctx.restore();
    items.filter((o) => o.z < 0).forEach(veThot);
    veNV(ctx, 960, 640, 1.15, { t, mat: "dut", ngh: Math.sin(tq * 3) * 0.06, nhin: [Math.cos((tl - tDoi) * 2.2) * 0.6, 0] });
    items.filter((o) => o.z >= 0).forEach(veThot);
    viet(ctx, "đời tôi xoay quanh cái thớt", W / 2, 1010, { size: 80, u: vao(tl, tDoi) });
  }
}

/* ── CÂU 6: lương "từ" 8 triệu — tôi chính là chữ "từ" ── */
function toTin(ctx, t, tl, c, khoanhU) {   // tờ tin tuyển dụng ghim trên bảng gỗ
  giay(ctx, "#d9b48a"); for (let i = 0; i < 40; i++) { const q = rng(1000 + i); to(ctx, elip(q() * W, q() * H, 3, 2), "#c49a6c"); }
  ve(ctx, "M560,90 L1360,110 L1340,1000 L580,990 Z", "#fffdf5", { w: 6 });
  for (const [x, y] of [[600, 130], [1320, 150]]) ve(ctx, elip(x, y, 16, 16), "#e0392f", { w: 4 });
  viet(ctx, "TUYỂN GẤP!", 960, 240, { size: 110, mau: "#e0392f", pop: false, xoay: -0.02 });
  viet(ctx, "Nhân viên chụp ảnh sản phẩm", 960, 350, { size: 60, pop: false });
  const ph = [["Lương  ", MUC], ["từ", "#e0392f"], ["  8 triệu", MUC]], ws = ph.map(([q]) => doRong(ctx, q, 100)); let x = 960 - ws.reduce((a, b) => a + b, 0) / 2;
  ph.forEach(([q, mau], i) => { viet(ctx, q, x, 540, { size: 100, mau, pop: false, can: "left" }); if (i === 1) viTu = x + ws[i] / 2; x += ws[i]; });
  for (const [s, y] of [["- Môi trường trẻ trung, năng động", 680], ["- Chụp thớt", 760], ["- Chụp thêm thớt", 840]]) viet(ctx, s, 640, y, { size: 52, pop: false, can: "left" });
  khoanh(ctx, viTu, 512, 62, 60, khoanhU, "#e0392f", 9);
}
let viTu = 960;
export function canh6(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tTin = m(c, 3), tTu = m(c, 9), tThi = m(c, 12), tToi = m(c, 14), tTu2 = m(c, 19);
  if (tl < tTin) {
    giay(ctx);
    veNV(ctx, 960, 520, 1.1, { t, mat: "thuong", noi: c.noi, tayT: { p: [-240, 150], cong: -30 }, tayP: { p: [240, 150], cong: 30 } });
    ctx.save(); ctx.translate(960, 720); ctx.rotate(-0.03); ve(ctx, rect(-340, -90, 680, 180, 10), "#fffdf5", { w: 6 }); viet(ctx, "LƯƠNG: 8.000.000đ", 0, 30, { size: 84, mau: "#2f9e57", pop: false }); ctx.restore();
  } else if (tl < tToi) {
    const z = tl >= tThi ? lerp(1, 2.1, eio(pha(tl, tThi, tThi + 0.5))) : 1;
    ctx.save(); cam(ctx, lerp(960, viTu, z - 1 > 0 ? (z - 1) / 1.1 : 0), lerp(540, 515, (z - 1) / 1.1), z); toTin(ctx, t, tl, c, vao(tl, tTu, 0.45)); ctx.restore();
    if (tl >= tThi) viet(ctx, "thì đấy…", 1660, 990, { size: 80, u: vao(tl, tThi), nen: GIAY });
  } else {
    ctx.save(); cam(ctx, viTu + 260, 515, 2.1); toTin(ctx, t, tl, c, 1); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = GIAY; ctx.fillRect(1180, 0, 740, H); ctx.restore();
    const u = eout(vao(tq, tToi, 0.3));
    veNV(ctx, 1520, lerp(1500, 820, u), 1.3, { t, mat: tl >= tTu2 ? "cuoi" : "thuong", noi: c.noi, chan: false, nhin: [-0.6, 0], tayT: { p: [-170, -40], cong: -30, kieu: "chi", lat: -1 } });
    if (u >= 1) { moHoi(ctx, 1700, 470, 1.1); viet(ctx, "tôi đây!", 1560, 180, { size: 110, u: vao(tl, tToi + 0.3), xoay: 0.05 }); }
  }
}

/* ── CÂU 7: trọ 20m² Cầu Giấy 5 triệu, còn 100 nghìn/ngày → Đéo gì cả ── */
export function canh7(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tCau = m(c, 4), t5 = m(c, 6), t8 = m(c, 11), tTru5 = m(c, 13), t3 = m(c, 16), tChia = m(c, 18), t100 = m(c, 21), t100b = m(c, 25), tGi = m(c, 33), tDeo = m(c, 34);
  if (tl < t5) {
    giay(ctx);
    ve(ctx, rect(640, 300, 640, 520, 6), "#e8e2f3", { w: 7 }); to(ctx, rect(646, 760, 628, 54, 0), "#c9bfdc");
    ve(ctx, rect(900, 690, 360, 80, 16), "#ffffff", { w: 5 }); ve(ctx, rect(1170, 660, 80, 40, 12), "#fff", { w: 4 });
    D.quat(ctx, 720, 810, 0.55, t);
    veNV(ctx, 1000, 560, 0.85, { t, mat: "chan", co: 0.9, tayT: { p: [-60, 100], cong: -10 }, tayP: { p: [60, 100], cong: 10 } });
    viet(ctx, "20m²", 960, 250, { size: 120, u: vao(tl, m(c, 2)), xoay: -0.03 });
    if (tl >= tCau) { ctx.save(); ctx.translate(1560, 420); ctx.scale(back(vao(tl, tCau, 0.3)), back(vao(tl, tCau, 0.3))); ve(ctx, rect(-170, -60, 340, 120, 12), "#2f5fae", { w: 6 }); net(ctx, rect(-156, -46, 312, 92, 8), { w: 3, mau: "#fff" }); viet(ctx, "P. Cầu Giấy", 0, 22, { size: 60, mau: "#fff", pop: false }); ctx.restore(); net(ctx, "M1560,480 L1560,860", { w: 14, mau: "#8a8f9c" }); }
  } else if (tl < tChia) {
    giay(ctx, "#f6efe2");
    D.congSat(ctx, 1240, 960, 520, 620);
    veNV(ctx, 1500, 640, 1.05, { t, kieu: "chutro", mat: tl >= tTru5 ? "cuoi" : "thuong", kinh: true, tayT: { p: [-200, 0], cong: -30, kieu: "xoe" } });
    if (tl < t8) { viet(ctx, "5 triệu", 760, 300, { size: 130, mau: "#e0392f", u: vao(tl, t5) }); viet(ctx, "(cả điện nước)", 760, 420, { size: 70, u: vao(tl, m(c, 8)) }); veNV(ctx, 380, 700, 0.95, { t, mat: "ngac", nhin: [0.8, 0] }); }
    else {
      veNV(ctx, 420, 640, 1.0, { t, mat: tl >= tTru5 ? "buon" : "thuong", nhin: [0.8, 0], tayP: { p: [130, 40], cong: 20 } });
      for (let i = 0; i < 8; i++) {
        const di = i < 5, u = di ? clamp((tl - tTru5 - i * 0.1) / 0.45) : 0, x0 = 600 + (i % 4) * 30, y0 = 640 + Math.floor(i / 4) * 60 - i * 6;
        const x1 = 1290 + (i % 3) * 30, y1 = 640 - i * 14;
        cocTien(ctx, lerp(x0, x1, eio(u)), lerp(y0, y1, eio(u)) - Math.sin(u * Math.PI) * 160, 0.62, (i - 3) * 0.12 + u * 0.5);
      }
      viet(ctx, "8 − 5 =", 700, 260, { size: 120, u: vao(tl, t8), xoay: -0.03 });
      if (tl >= m(c, 15)) { viet(ctx, "3", 960, 262, { size: 140, mau: "#e0392f", u: vao(tl, m(c, 15)) }); khoanh(ctx, 962, 220, 62, 66, vao(tl, m(c, 15) + 0.1, 0.35)); }
    }
  } else if (tl < t100b) {
    giay(ctx);
    if (tl < t100) {
      // 3 triệu chia 30 ngày: băm trên chính cái thớt
      ctx.save(); ctx.translate(960, 700); ctx.scale(1, 0.55); D.thot(ctx, 0, 0, 2.2); ctx.restore();
      const n = Math.min(30, Math.floor((tl - tChia) * 26));
      for (let i = 0; i < 30; i++) { if (i < n) { ctx.save(); ctx.translate(700 + (i % 10) * 54, 660 + Math.floor(i / 10) * 40); ctx.rotate((i % 3 - 1) * 0.1); ve(ctx, rect(-20, -14, 40, 28, 3), "#86cfe0", { w: 3 }); ctx.restore(); } }
      if (n < 30) for (let i = 0; i < 3; i++) cocTien(ctx, 1100 + i * 18, 660 - i * 8, 0.55 * (1 - n / 30), 0.1);
      const len = Math.floor(tq * 12) % 2; ctx.save(); ctx.translate(1180, len ? 520 : 600); ctx.rotate(-0.2); ve(ctx, rect(-130, -60, 200, 120, 10), "#c7ced8", { w: 6 }); ve(ctx, rect(70, -24, 150, 48, 14), "#6b4a34", { w: 5 }); ctx.restore();
      veNV(ctx, 1500, 600, 0.95, { t, mat: "tuc", tayT: { p: [-230, -60], cong: -20, kieu: "nam" } });
      viet(ctx, "3 triệu ÷ 30 ngày", 900, 250, { size: 100, u: vao(tl, t3) });
    } else {
      veNV(ctx, 960, 600, 1.2, { t, mat: "ngac", nhin: [0, 0.6], tayP: { p: [60, 20], cong: 30, kieu: "xoe", lat: -1 } });
      D.tien(ctx, 960 + 90, 600 - 20 - Math.abs(Math.sin(tl * 3)) * 16, 0.55, 100, -0.1);
      viet(ctx, "= 100 nghìn / ngày", W / 2, 190, { size: 110, mau: "#2f9e57", u: vao(tl, t100) });
    }
  } else if (tl < tDeo) {
    // 100 nghìn ở Hà Nội: phở, gửi xe, trà đá, xăng gặm dần
    giay(ctx, "#fbf3e4");
    const an = [[m(c, 27), "phở", -45], [m(c, 29), "gửi xe", -5], [m(c, 30), "trà đá", -5], [m(c, 31), "xăng", -30]];
    let con = 100; an.forEach(([t0, , v]) => { if (tl >= t0) con += v; });
    const k = 0.45 + 0.55 * (con / 100);
    D.tien(ctx, 960, 470, k * 2.4, 100, Math.sin(tl * 2) * 0.05);
    an.forEach(([t0, ten, v], i) => {
      if (tl < t0) return; const u = vao(tl, t0, 0.25), x = 300 + i * 440, y = 860;
      ctx.save(); ctx.translate(x, y); ctx.scale(back(u) * 1.7, back(u) * 1.7);
      if (i === 0) D.batPho(ctx, 0, 0, 0.9, t); else if (i === 1) D.veXe(ctx, 0, 0, 1); else if (i === 2) D.traDa(ctx, 0, 0, 1.2);
      else { ve(ctx, rect(-50, -90, 100, 170, 10), "#e0392f", { w: 5 }); ve(ctx, rect(-32, -70, 64, 44, 6), "#fff", { w: 3.5 }); net(ctx, "M50,-40 C90,-40 90,40 70,60", { w: 6 }); }
      ctx.restore();
      viet(ctx, `${ten} ${v}k`, x, y - 210, { size: 66, mau: "#e0392f", u: vao(tl, t0 + 0.08) });
    });
    viet(ctx, "100 nghìn ở Hà Nội", W / 2, 130, { size: 84, u: vao(tl, t100b) });
    if (tl >= tGi) dauHoi(ctx, 1460, 520, 260, vao(tl, tGi));
  } else {
    // Đéo gì cả.
    giay(ctx);
    ctx.save(); lac(ctx, tl, tDeo, 20, 0.5);
    veNV(ctx, 960, 620, 1.2, { t, mat: "chan", nhin: [0, 0.6], tayP: { p: [70, 20], cong: 30, kieu: "xoe", lat: -1 } });
    const a = tl * 5; to(ctx, elip(1080 + Math.cos(a) * 60, 520 + Math.sin(a * 1.3) * 30, 7, 6), MUC); net(ctx, `M${1074 + Math.cos(a) * 60},${512 + Math.sin(a * 1.3) * 30} L${1066 + Math.cos(a) * 60},${500 + Math.sin(a * 1.3) * 30}`, { w: 3 });
    for (let i = 0; i < 3; i++) { const x = ((tl * 900 + i * 700) % 2400) - 240; net(ctx, `M${x},${300 + i * 260} C${x + 80},${290 + i * 260} ${x + 160},${310 + i * 260} ${x + 240},${300 + i * 260}`, { w: 4, mau: "#b9b4ab" }); }
    viet(ctx, "ĐÉO GÌ CẢ.", W / 2, 230, { size: 190, mau: "#e0392f", u: vao(tl, tDeo, 0.15), xoay: on(tl * 30, 4) * 0.03 });
    ctx.restore();
  }
}

/* ── CÂU 8: kẻ 30 ô lên tường, gạch như thằng tù — khác mỗi thằng tù còn được nhà nước nuôi cơm ── */
function oTuong(ctx, x, y, w, h, keU, gach) {   // lưới 6×5 kẻ tay bằng bút đỏ
  const cw = w / 6, ch = h / 5, n = Math.floor(keU * 13);
  for (let i = 0; i <= 6 && i < n; i++) netPts(ctx, [[x + i * cw, y], [x + i * cw, y + h]], { w: 11, mau: "#ff5a4a", seed: 1200 + i });
  for (let j = 0; j <= 5 && j + 7 < n; j++) netPts(ctx, [[x, y + j * ch], [x + w, y + j * ch]], { w: 11, mau: "#ff5a4a", seed: 1210 + j });
  for (let i = 0; i < Math.floor(gach); i++) { const cx = x + (i % 6) * cw, cy = y + Math.floor(i / 6) * ch; netPts(ctx, [[cx + 14, cy + 14], [cx + cw - 14, cy + ch - 14]], { w: 12, mau: "#ff5a4a", seed: 1300 + i }); netPts(ctx, [[cx + cw - 14, cy + 14], [cx + 14, cy + ch - 14]], { w: 12, mau: "#ff5a4a", seed: 1340 + i }); }
}
function tayVao(ctx, x0, y0, x1, y1) {   // cánh tay hoodie vươn từ ngoài khung, bàn tay cầm bút đỏ ở (x1,y1)
  const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), w0 = 46, w1 = 30;
  const ex = x1 - Math.cos(a) * 28, ey = y1 - Math.sin(a) * 28;
  vePts(ctx, [[x0 + nx * w0, y0 + ny * w0], [ex + nx * w1, ey + ny * w1], [ex - nx * w1, ey - ny * w1], [x0 - nx * w0, y0 - ny * w0]], "#f2b544", { w: 5.5 });
  netPts(ctx, [[ex + nx * w1, ey + ny * w1], [ex - nx * w1, ey - ny * w1]], { w: 5 });
  ctx.save(); ctx.translate(ex, ey); ctx.rotate(a); ctx.scale(1.5, 1.5); banTay(ctx, "nam", 1); ve(ctx, rect(14, -30, 18, 58, 6), "#e0392f", { w: 3.5 }); to(ctx, rect(17, -40, 12, 12, 3), "#8b1e18"); ctx.restore();
}
function phongGiam(ctx, t) {
  ctx.fillStyle = "#a9adb5"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#80858d"; ctx.fillRect(0, 860, W, H - 860);
  for (let r = 0; r < 8; r++) for (let i = 0; i < 9; i++) net(ctx, rect(i * 230 + (r % 2) * 115 - 115, r * 110, 230, 110, 6), { w: 3, mau: "#7d828b", seed: r * 10 + i });
  for (let g = 0; g < 7; g++) { const x0 = 980 + (g % 4) * 190, y0 = 160 + Math.floor(g / 4) * 170; for (let i = 0; i < 4; i++) netPts(ctx, [[x0 + i * 26, y0], [x0 + i * 26 + 4, y0 + 110]], { w: 8, mau: "#2d2f36", seed: 1400 + g * 5 + i }); netPts(ctx, [[x0 - 14, y0 + 90], [x0 + 104, y0 + 20]], { w: 8, mau: "#2d2f36", seed: 1450 + g }); }
}
export function canh8(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tToi = m(c, 6), tNhu = m(c, 12), tKhac = m(c, 17), tNha = m(c, 24), tCom = m(c, 27);
  if (tl < tNhu) {
    const dem = tl < tToi || Math.floor((tl - tToi) * 6) % 2 === 0;
    ctx.save(); cam(ctx, 1100, 610, 1.75);
    phongDem(ctx, t, { dem, gio: 23 });
    if (!dem) { ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = "#fff6d6"; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    const keU = clamp(tl / (m(c, 5) + 0.2)), gach = tl < tToi ? 0 : Math.min(29, (tl - tToi) * 10);
    const GX = 860, GY = 430, GW = 480, GH = 360, cw = GW / 6, ch = GH / 5;
    oTuong(ctx, GX, GY, GW, GH, keU, gach);
    let hx, hy;
    if (tl < tToi) { const n = keU * 13, k = Math.min(12, Math.floor(n)), u = n - k; if (k <= 6) { hx = GX + k * cw; hy = GY + u * GH; } else { hx = GX + u * GW; hy = GY + (k - 7) * ch; } }
    else { const i = Math.min(29, Math.floor(gach)); hx = GX + (i % 6) * cw + cw - 14; hy = GY + Math.floor(i / 6) * ch + ch - 14; }
    tayVao(ctx, 1640, 1000, hx + 8, hy + 30);   // cận: cánh tay vươn từ ngoài khung vào, cầm bút đỏ
    ctx.restore();
    viet(ctx, tl < tToi ? "kẻ 30 ô" : "tối nào cũng gạch 1 ô", 480, 1000, { size: 80, mau: GIAY, u: vao(tl, tl < tToi ? m(c, 4) : tToi) });
  } else if (tl < tKhac) {
    // như thằng tù gạch ngày
    phongGiam(ctx, t);
    const cao = Math.floor(tq * 6) % 2;
    veNV(ctx, 760, 620, 1.15, { t, kieu: "tu", mat: "chan", nhin: [0.8, -0.3], tayP: { p: [190, cao ? -150 : -110], cong: 30, kieu: "nam" } });
    D.songSat(ctx, 60, 1900, -20, 1100, 190);
    viet(ctx, "như thằng tù gạch ngày", W / 2, 1000, { size: 80, mau: GIAY, u: vao(tl, tNhu) });
  } else {
    // khác mỗi thằng tù còn được nhà nước nuôi cơm
    const tach = tl >= tNha, xT = tach ? 520 : 960;
    ctx.save(); if (tach) { ctx.beginPath(); ctx.rect(0, 0, 960, H); ctx.clip(); }
    phongGiam(ctx, t);
    veNV(ctx, xT, 600, 1.1, { t, kieu: "tu", mat: Math.floor(tq * 4) % 2 ? "nhai" : "cuoi", nhun: -Math.abs(Math.sin(tq * 8)) * 6, chan: false, tayT: { p: [-60, 90], cong: -10 }, tayP: { p: [60, 90], cong: 10 } });
    D.khayCom(ctx, xT, 760, 1.15);
    sao(ctx, xT - 120, 700, 26, t); sao(ctx, xT + 150, 690, 22, t + 2);
    D.songSat(ctx, xT - 400, xT + 400, -20, 1100, 200);
    viet(ctx, "nhà nước nuôi", xT, 170, { size: 84, mau: GIAY, u: vao(tl, tKhac + 0.2) });
    ctx.restore();
    if (tach) {
      ctx.save(); ctx.beginPath(); ctx.rect(960, 0, 960, H); ctx.clip();
      phongDem(ctx, t, { gio: 23 }); ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = "#1b1f36"; ctx.fillRect(960, 0, 960, H); ctx.restore();
      veNV(ctx, 1440, 620, 1.1, { t, mat: "khoc", chan: false, tayT: { p: [-60, 90], cong: -10 }, tayP: { p: [60, 90], cong: 10 } });
      ve(ctx, "M1330,740 L1550,740 C1546,820 1500,860 1440,860 C1380,860 1334,820 1330,740 Z", "#ffffff", { w: 5 }); to(ctx, elip(1440, 742, 108, 18), "#f2d58a"); for (let i = 0; i < 5; i++) net(ctx, `M${1370 + i * 30},736 C${1380 + i * 30},726 ${1386 + i * 30},748 ${1396 + i * 30},738`, { w: 3.5, mau: "#c99a3a" });
      viet(ctx, "mì tôm", 1440, 950, { size: 64, mau: GIAY, u: vao(tl, tNha + 0.3) });
      viet(ctx, "tự nuôi", 1440, 170, { size: 84, mau: GIAY, u: vao(tl, tCom) });
      ctx.restore();
      netPts(ctx, [[960, -10], [960, H + 10]], { w: 10 });
    }
  }
}
