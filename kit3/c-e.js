// Chương 8 "Linh Lang, nửa đêm" — câu 68–82: khách đêm chính là anh Tuấn, giờ chạy xe ôm.
import { W, H, MUC, GIAY, giay, viet, doRong, ve, vePts, net, netPts, to, toPts, bong, elip, rect, moHoi, gan, sao, tiaNhan, rung, khoi,
  T12, clamp, lerp, eio, eout, back, pha, on, rng } from "./but.js";
import { veNV, banTay, DA, KIEU } from "./nv.js";
import * as D from "./do.js";
import { m, vao, cam, lac, chop, toi, muiTen, khoanh, gachCheo, avatar, hoa, anhSushi, tayCanh, phongDem, banLamViec, manHinhGoi } from "./chung.js";

const VANG = "#ffd23e", DO = "#e0392f";

/* ── bối cảnh: phố Linh Lang đêm, quán trà đá trước cửa nhà hàng omakase ── */
function nhaHang(ctx, t) {   // mặt tiền x 560–1360, cửa 1080–1300
  ve(ctx, rect(560, 200, 800, 580, 4), "#3b2b24", { w: 6 });
  for (let i = 1; i < 20; i++) netPts(ctx, [[560 + i * 40, 330], [560 + i * 40, 380]], { w: 3, mau: "#2b1f1a", seed: 3200 + i });
  ve(ctx, rect(690, 226, 540, 96, 10), "#1a1412", { w: 5 }); viet(ctx, "OMAKASE", 960, 298, { size: 72, mau: "#e8b93c", pop: false });
  ve(ctx, rect(600, 390, 440, 300, 8), "#ffd98a", { w: 5 });
  to(ctx, rect(604, 590, 432, 24, 0), "#c48b5c"); for (const x of [700, 820, 940]) { to(ctx, elip(x, 560, 34, 40), "#b8904a"); to(ctx, elip(x, 506, 26, 26), "#b8904a"); }
  for (let i = 1; i < 4; i++) netPts(ctx, [[600 + i * 110, 394], [600 + i * 110, 686]], { w: 4, seed: 3230 + i }); netPts(ctx, [[604, 540], [1036, 540]], { w: 4, seed: 3240 });
  ve(ctx, rect(1080, 400, 220, 380, 4), "#2a1d18", { w: 5 });
  for (let i = 0; i < 3; i++) ve(ctx, rect(1080 + i * 73, 400, 73, 110, 2), "#2c3e6b", { w: 4, seed: 3250 + i });
  ve(ctx, elip(1190, 452, 26, 26), "#fbf9f4", { w: 3 });
  for (const x of [600, 1320]) { netPts(ctx, [[x, 330], [x, 352]], { w: 3 }); ve(ctx, elip(x, 384, 26, 34), "#e2453c", { w: 4 }); to(ctx, rect(x - 14, 350, 28, 8, 2), "#2a1d18"); to(ctx, rect(x - 14, 412, 28, 8, 2), "#2a1d18"); }
}
function phoDem(ctx, t, o = {}) {
  giay(ctx, "#1c2140");
  for (let i = 0; i < 18; i++) { const q = rng(3000 + i); to(ctx, elip(q() * W, q() * 170, 2.5, 2.5), "#fff6d0"); }
  const q = rng(3100), tr = o.troi ?? 0, lech = o.di ? -(tr % 210) : 0;
  for (let i = 0; i < 11; i++) {
    const x = i * 210 - 60 + lech, h = 420 + q() * 220, y = 640 - h;
    ve(ctx, rect(x, y, 196, h + 40, 6), i % 2 ? "#262c4f" : "#2c335a", { w: 4, seed: 3110 + i });
    for (let r = 0; r < 7; r++) for (let k = 0; k < 3; k++) if (q() > 0.6) to(ctx, rect(x + 22 + k * 56, y + 28 + r * 58, 28, 30, 3), "#ffd98a");
  }
  if (!o.di) {
  ve(ctx, rect(-10, 400, 560, 380, 0), "#6b7088", { w: 5 }); for (let i = 0; i < 11; i++) netPts(ctx, [[0, 420 + i * 33], [546, 420 + i * 33]], { w: 2.5, mau: "#575b70", seed: 3150 + i });
  ve(ctx, rect(1370, 400, 560, 380, 0), "#6b7088", { w: 5 }); for (let i = 0; i < 11; i++) netPts(ctx, [[1376, 420 + i * 33], [1930, 420 + i * 33]], { w: 2.5, mau: "#575b70", seed: 3170 + i });
  nhaHang(ctx, t);
  } else for (let i = 0; i < 4; i++) { const x = ((i * 700 - tr * 0.9) % 2800 + 2800) % 2800 - 300; ve(ctx, rect(x, 140, 18, 820, 6), "#7a7d88", { w: 4 }); ve(ctx, "M-20,-6 L50,-6 L40,18 L-10,18 Z".replace(/(-?\d+),(-?\d+)/g, (s0, a, b) => `${x + 9 + +a},${140 + +b}`), "#ffe7a6", { w: 4 }); }
  to(ctx, rect(0, 780, W, 180, 0), "#59607a"); netPts(ctx, [[-10, 780], [W + 10, 780]], { w: 5 });
  to(ctx, rect(0, 960, W, 120, 0), "#363a4f"); netPts(ctx, [[-10, 960], [W + 10, 960]], { w: 6 });
  for (let i = 0; i < 7; i++) to(ctx, rect(i * 300 + 60 - ((o.troi ?? 0) % 300), 1016, 140, 12, 4), "#d9d6cc");
  if (o.di) return;
  // cột đèn đường + vũng sáng phẳng
  ve(ctx, rect(372, 110, 18, 860, 6), "#7a7d88", { w: 4 }); net(ctx, "M381,120 C420,90 470,92 500,110", { w: 9, mau: "#7a7d88" }); ve(ctx, "M470,104 L540,104 L530,128 L480,128 Z", "#ffe7a6", { w: 4 });
  if (o.vung !== false) { ctx.save(); ctx.globalAlpha = 0.18; to(ctx, "M482,130 L528,130 L820,940 L180,940 Z", "#ffe7a6"); ctx.restore(); ctx.save(); ctx.globalAlpha = 0.3; to(ctx, elip(500, 900, 330, 50), "#ffe7a6"); ctx.restore(); }
  if (o.bien) { ve(ctx, rect(1520, 520, 300, 96, 10), "#2f5fae", { w: 5 }); net(ctx, rect(1532, 532, 276, 72, 6), { w: 3, mau: "#fff" }); viet(ctx, "P. Linh Lang", 1670, 586, { size: 46, mau: "#fff", pop: false }); netPts(ctx, [[1670, 616], [1670, 780]], { w: 12, mau: "#8a8f9c" }); }
}
function banNhua(ctx, x, y, k = 1, mau = "#3f7fd1") {   // bàn nhựa thấp, gốc chân bàn
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-80,-110 L80,-110 L96,0 L72,0 L62,-84 L-62,-84 L-72,0 L-96,0 Z", mau, { w: 5 }); ve(ctx, rect(-110, -126, 220, 22, 8), mau, { w: 5 });
  ctx.restore();
}
/* nhân vật ngồi ghế nhựa thấp: chân thả xuống đất */
function ngoiGhe(ctx, x, yG, k, S, mauGhe = "#e2533f") {
  const kg = 0.66 * k, seat = yG - 136 * kg, ny = seat - 150 * k;
  D.gheNhua(ctx, x, yG, kg, mauGhe);
  const C = { ...(KIEU[S.kieu ?? "hieu"] ?? KIEU.nguoi), ...(S.C ?? {}) }, gl = (yG - ny) / k;
  ctx.save(); ctx.translate(x, ny); ctx.scale(k, k);
  for (const s of [-1, 1]) { ve(ctx, rect(s * 40 - 18, 140, 36, gl - 152, 10), C.quan, { w: 5, seed: 3300 + s }); ve(ctx, elip(s * 48, gl - 8, 34, 15), C.giay, { w: 5, seed: 3302 + s }); }
  ctx.restore();
  veNV(ctx, x, ny, k, { ...S, chan: false });
  return ny;
}
/* quán trà đá: Tuấn ghế đỏ x=600, Hiếu ghế xanh x=930, bàn giữa */
const YG = 905;
function quan(ctx, t, o = {}) {
  phoDem(ctx, t, o);
  if (o.xe !== false) xeMay(ctx, o.xeX ?? 1560, 955, 0.95, t, { lat: -1 });
  if (o.tuan !== false) ngoiGhe(ctx, 600, YG, 0.95, { t, kieu: "tuanxe", mat: "thuong", nhin: [0.5, 0.2], tayT: { p: [-80, 128], cong: -14 }, tayP: { p: [110, 120], cong: 16 }, ...(o.T ?? {}) });
  if (o.hieu !== false) ngoiGhe(ctx, 930, YG, 0.95, { t, kieu: "hieu", mat: "thuong", nhin: [-0.5, 0.2], tayT: { p: [-110, 120], cong: -16 }, ...(o.Hi ?? {}) }, "#3f7fd1");
  banNhua(ctx, 765, YG + 10, 0.9);
  const coc = o.coc ?? [1, 1]; for (const [x, i] of [[730, 0], [800, 1]]) if (coc[i]) D.traDa(ctx, x, YG - 140, 0.62);
  if (o.tren) o.tren(ctx);
}
/* xe máy nhìn ngang (mặc định quay sang phải), gốc giữa mặt đất */
function xeMay(ctx, x, y, k, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k * (o.lat ?? 1), k);
  const mau = o.mau ?? "#2f8f5a", r = o.quay ?? 0;
  for (const xx of [-170, 170]) { ctx.save(); ctx.translate(xx, -52); ctx.rotate(r); ve(ctx, elip(0, 0, 52, 52), "#2a2a33", { w: 5 }); ve(ctx, elip(0, 0, 22, 22), "#b9bcc6", { w: 4 }); netPts(ctx, [[-22, 0], [22, 0]], { w: 3 }); ctx.restore(); }
  ve(ctx, "M-236,-72 C-236,-128 -176,-150 -104,-150 L40,-150 C72,-150 84,-120 72,-92 L44,-60 C-60,-58 -160,-58 -236,-72 Z", mau, { w: 5.5 });
  ve(ctx, "M-206,-150 C-206,-180 -176,-190 -126,-190 L8,-190 C30,-190 36,-170 24,-150 Z", "#2a2a33", { w: 5 });
  ve(ctx, "M60,-96 L146,-118 C188,-126 212,-94 202,-62 L116,-58 Z", mau, { w: 5 });
  netPts(ctx, [[160, -112], [122, -250]], { w: 12, mau: "#7a7d88" }); netPts(ctx, [[94, -252], [160, -258]], { w: 10, mau: "#2a2a33" });
  ve(ctx, elip(150, -206, 20, 16), "#fff3c2", { w: 4 });
  if (o.gio) { ve(ctx, rect(150, -240, 90, 60, 8), "#d9a866", { w: 4 }); for (let i = 1; i < 4; i++) netPts(ctx, [[150 + i * 22, -238], [150 + i * 22, -182]], { w: 2.5 }); }
  ctx.restore();
}
/* chân người ngồi trên yên xe, gốc như veNV (cổ) */
function chanXe(ctx, x, ny, k, kieu, xe0) {
  const C = KIEU[kieu]; ctx.save(); ctx.translate(x, ny); ctx.scale(k, k);
  for (const s of [-1, 1]) { ve(ctx, rect(s * 30 - 18, 140, 36, 110, 10), C.quan, { w: 5, seed: 3310 + s }); ve(ctx, elip(s * 36, 252, 32, 14), C.giay, { w: 5, seed: 3312 + s }); }
  ctx.restore();
}
/* robot phần mềm — gốc giữa chân */
function robot(ctx, x, y, k, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const xam = "#c9d3e0", xamB = "#9fb0c4";
  for (const s of [-1, 1]) ve(ctx, rect(s * 42 - 20, -92, 40, 92, 8), xamB, { w: 5, seed: 3400 + s });
  const tay = (s, a, ve2) => { ctx.save(); ctx.translate(s * 96, -230); ctx.rotate(a); ve(ctx, rect(0, -15, 110, 30, 15), xam, { w: 5, seed: 3410 + s }); ve(ctx, elip(118, 0, 24, 24), xamB, { w: 5, seed: 3412 + s }); if (ve2) { ctx.translate(118, 0); ve2(ctx); } ctx.restore(); };
  tay(-1, Math.PI - 1.1, null);
  ve(ctx, rect(-96, -270, 192, 184, 26), xam, { w: 6 });
  if (o.chu) { ve(ctx, rect(-70, -238, 140, 52, 8), "#ffffff", { w: 4 }); viet(ctx, o.chu, 0, -200, { size: 28, pop: false }); }
  if (o.caVat) ve(ctx, "M-10,-270 L10,-270 L14,-180 L0,-166 L-14,-180 Z", "#c0392b", { w: 3.5 });
  const vay = o.vay ? -1.9 + Math.sin(T12(t) * 12) * 0.35 : 1.1;
  tay(1, vay, o.camP);
  ve(ctx, rect(-116, -452, 232, 176, 32), xam, { w: 6 });
  ve(ctx, rect(-90, -428, 180, 128, 22), "#2b3150", { w: 5 });
  if (o.mat === "vui") for (const s of [-1, 1]) net(ctx, `M${s * 40 - 18},-358 C${s * 40 - 10},-378 ${s * 40 + 10},-378 ${s * 40 + 18},-358`, { w: 7, mau: "#5fe3ff" });
  else for (const s of [-1, 1]) to(ctx, elip(s * 40, -368, 13, 17), "#5fe3ff");
  net(ctx, o.mat === "vui" ? "M-24,-330 C-10,-318 10,-318 24,-330" : "M-18,-326 L18,-326", { w: 5, mau: "#5fe3ff" });
  netPts(ctx, [[0, -452], [0, -506]], { w: 6 }); ve(ctx, elip(0, -516, 14, 14), "#e2453c", { w: 4 });
  ctx.restore();
}
function thung(ctx, x, y, k = 1) {   // thùng giấy ôm trước ngực, tâm (x,y)
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, rect(-80, -50, 160, 100, 6), "#c99a5e", { w: 5 }); ve(ctx, "M-80,-50 L-60,-74 L60,-74 L80,-50 Z", "#b5864c", { w: 4.5 }); netPts(ctx, [[0, -50], [0, 50]], { w: 3, mau: "#8a6a3a" });
  ctx.restore();
}
function theTen(ctx, x, y, s, k = 1, mau = "#ffffff") {   // thẻ đeo ngực
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); netPts(ctx, [[-20, -60], [0, -24], [20, -60]], { w: 3 });
  const w = doRong(ctx, s, 30) + 24; ve(ctx, rect(-w / 2, -24, w, 44, 6), mau, { w: 4 }); viet(ctx, s, 0, 8, { size: 30, pop: false, soi: false }); ctx.restore();
}
function vienHoiTuong(ctx, t) {   // khung mây trắng quanh mép: đang hồi tưởng
  const ds = []; for (let x = 0; x <= W; x += 120) ds.push([x, 0], [x, H]); for (let y = 0; y <= H; y += 120) ds.push([0, y], [W, y]);
  ds.forEach(([x, y], i) => net(ctx, elip(x, y, 74, 74), { w: 10, kin: true, seed: 3500 + i }));
  ds.forEach(([x, y]) => to(ctx, elip(x, y, 74, 74), GIAY));
}
function vuongMien(ctx, x, y, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-70,0 L-80,-70 L-40,-36 L0,-90 L40,-36 L80,-70 L70,0 Z", "#ffcf3a", { w: 5 }); for (const xx of [-80, 0, 80]) to(ctx, elip(xx, xx === 0 ? -92 : -72, 9, 9), "#e2453c");
  ctx.restore();
}
let BONG = null;
function thoBong(ctx, f) {   // vẽ f(g) ra lớp riêng thành khối đen đặc rồi in lên tường mờ 42% (không lộ nét trong)
  if (!BONG) { BONG = document.createElement("canvas"); BONG.width = W; BONG.height = H; }
  const g = BONG.getContext("2d"); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.clearRect(0, 0, W, H); g.filter = "brightness(0)"; g.save(); f(g); g.restore(); g.filter = "none";
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= 0.42; ctx.drawImage(BONG, 0, 0); ctx.restore();
}

/* ── 68: hỏi ở đâu → định vị → phi xe ra Linh Lang → trước nhà hàng omakase thật → anh mặc áo xe ôm ── */
function c68(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tDinh = m(c, 6), tDem = m(c, 10), tLL = m(c, 18), tNgay = m(c, 20), tOma = m(c, 26), tAo = m(c, 28);
  if (tl < tDem) {
    giay(ctx, "#2b3150");
    D.dienThoai(ctx, 960, 560, 3.1, 0, (g) => {
      g.fillStyle = "#eef2f7"; g.fillRect(-80, -140, 160, 280); to(g, rect(-80, -140, 160, 40, 0), "#2a2631");
      avatar(g, -52, -118, 12, 0, { chu: "T", mau: "#5b679e" }); viet(g, "T.", -32, -110, { size: 18, mau: "#fff", pop: false, can: "left", soi: false });
      viet(g, "00:07", 0, -84, { size: 11, mau: "#9aa0ab", pop: false, soi: false });
      const u1 = vao(tl, 0.05, 0.2); if (u1 > 0) { g.save(); g.translate(30, -58); g.scale(back(u1), back(u1)); ve(g, rect(-42, -14, 84, 28, 12), "#4a8fe0", { w: 2.5 }); viet(g, "anh ở đâu?", 0, 6, { size: 15, mau: "#fff", pop: false, soi: false }); g.restore(); }
      const u2 = vao(tl, tDinh, 0.25); if (u2 > 0) {
        g.save(); g.translate(-18, 18); g.scale(back(u2), back(u2));
        ve(g, rect(-50, -46, 100, 104, 12), "#ffffff", { w: 2.5 }); to(g, rect(-44, -40, 88, 66, 6), "#cfe8c4");
        for (const [a, b, cc, d] of [[-44, -10, 44, 0], [-10, -40, 4, 26], [-44, 14, 44, 6]]) netPts(g, [[a, b], [cc, d]], { w: 4, mau: "#ffffff", seed: 3600 + a });
        ve(g, "M0,-30 C-12,-30 -16,-20 -12,-12 L0,4 L12,-12 C16,-20 12,-30 0,-30 Z", DO, { w: 2 }); to(g, elip(0, -21, 4, 4), "#fff");
        viet(g, "trà đá Linh Lang", 0, 46, { size: 13, pop: false, soi: false });
        g.restore();
      }
    }, { vo: "#1c1f2e" });
    if (tl >= tDinh) viet(ctx, "định vị", 1500, 420, { size: 90, mau: GIAY, u: vao(tl, tDinh + 0.15), xoay: 0.05 });
  } else if (tl < tNgay) {
    // phi xe đạp điện qua phố đêm
    phoDem(ctx, t, { di: true, troi: tl * 1100 });
    for (let i = 0; i < 7; i++) { const y = 560 + i * 60, x = ((i * 397 - tl * 2600) % 2200 + 2200) % 2200 - 200; netPts(ctx, [[x, y], [x + 220, y]], { w: 5, mau: "#9aa3c7", seed: 3620 + i }); }
    const nhun = Math.floor(tq * 12) % 2 ? -4 : 4, bx = 860, by = 955;
    xeMay(ctx, bx, by + nhun, 0.9, t, { mau: "#e8b94a", gio: true, quay: tl * 14 });
    const k = 0.85, ny = by - 190 * 0.9 - 150 * k + nhun;
    chanXe(ctx, bx - 40, ny, k, "hieu");
    veNV(ctx, bx - 40, ny, k, { t, mat: "tuc", ngh: 0.08, nhin: [0.8, 0], chan: false, tayT: { p: [((bx + 125 * 0.9) - (bx - 40)) / k - 30, ((by - 254 * 0.9) - ny) / k], cong: 30 }, tayP: { p: [((bx + 145 * 0.9) - (bx - 40)) / k, ((by - 250 * 0.9) - ny) / k], cong: 20 } });
    for (let i = 0; i < 3; i++) net(ctx, `M${bx - 200 - i * 30},${ny - 160 + i * 30} L${bx - 330 - i * 40},${ny - 150 + i * 30}`, { w: 6, mau: "#2a2631", seed: 3640 + i });
    viet(ctx, "nửa đêm", 380, 170, { size: 100, mau: GIAY, u: vao(tl, tDem), xoay: -0.05 });
    if (tl >= tLL) { const u = back(vao(tl, tLL, 0.3)); ctx.save(); ctx.translate(1550, 230); ctx.scale(u, u); ve(ctx, rect(-210, -64, 420, 128, 12), "#2f5fae", { w: 6 }); net(ctx, rect(-196, -50, 392, 100, 8), { w: 3, mau: "#fff" }); viet(ctx, "P. Linh Lang", 0, 22, { size: 66, mau: "#fff", pop: false }); ctx.restore(); }
  } else if (tl < tAo) {
    // toàn cảnh: quán trà đá ngay trước cửa nhà hàng omakase thật
    const z = lerp(1, 1.06, eio(pha(tl, tNgay, tAo)));
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    quan(ctx, t, { hieu: false, T: { mat: "im", nhin: [0, 0.3] } });
    const xx = lerp(-200, 1120, eout(pha(tl, tNgay, tNgay + 1.2)));
    xeMay(ctx, xx, 955, 0.8, t, { mau: "#e8b94a", gio: true, quay: tl * 10 });
    { const k = 0.75, ny = 955 - 190 * 0.8 - 150 * k; chanXe(ctx, xx - 36, ny, k, "hieu"); veNV(ctx, xx - 36, ny, k, { t, mat: "thuong", chan: false, nhin: [0.6, 0], tayT: { p: [150, 80], cong: 30 }, tayP: { p: [170, 78], cong: 20 } }); }
    ctx.restore();
    if (tl >= tOma) { viet(ctx, "omakase thật", 1560, 170, { size: 86, mau: VANG, u: vao(tl, tOma), xoay: 0.05 }); muiTen(ctx, 1420, 190, 1250, 250, vao(tl, tOma + 0.1, 0.3), VANG); }
  } else {
    // anh mặc áo xe ôm
    ctx.save(); cam(ctx, 760, 600, 1.55);
    quan(ctx, t, { hieu: false, T: { mat: "cuoi", nhin: [0.6, 0], tayP: { p: [150, -70], cong: 24, kieu: "xoe", lat: -1 } } });
    veNV(ctx, 1010, 690, 0.9, { t, mat: "soc", nhin: [-0.7, 0], tayT: { p: [-90, 120], cong: -14 }, tayP: { p: [90, 120], cong: 14 } });
    moHoi(ctx, 520, 470, 0.7);
    ctx.restore();
    viet(ctx, "áo xe ôm?!", 1560, 180, { size: 110, mau: VANG, u: vao(tl, m(c, 31)), xoay: 0.05 });
  }
}

/* ── 69 (Tuấn): tháng ba ngân hàng thay cả tổ bằng phần mềm; dạy nó ba tháng; dạy xong nó đuổi ── */
const NV_NH = [{ kieu: "sep" }, { kieu: "nguoi", C: { ao: "#ffffff", aoB: "#dfe4ea", kAo: "somi", toc: "#6b3e26", kToc: "dai" } }, { kieu: "tuan" }, { kieu: "nguoi", C: { ao: "#ffffff", aoB: "#dfe4ea", kAo: "somi", kToc: "ngan" } }];
function phongNH(ctx) {
  giay(ctx, "#dfe8ee"); to(ctx, rect(0, 800, W, 280, 0), "#b9c4cf"); netPts(ctx, [[-10, 800], [W + 10, 800]], { w: 6 });
  ve(ctx, rect(140, 120, 520, 120, 10), "#2f5fae", { w: 6 }); viet(ctx, "NGÂN HÀNG", 400, 205, { size: 72, mau: "#fff", pop: false });
  ve(ctx, rect(1500, 150, 280, 200, 10), "#ffffff", { w: 5 }); for (let i = 0; i < 4; i++) to(ctx, rect(1530 + i * 60, 300 - i * 30, 36, 30 + i * 30, 3), "#4a8fd1");
}
function c69(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tNH = m(c, 2), tPM = m(c, 9), tCai = m(c, 11), tDay = m(c, 18), t3 = m(c, 20), tXong = m(c, 22), tDuoi = m(c, 25);
  if (tl < tNH) {
    ctx.save(); cam(ctx, 760, 620, 1.5); quan(ctx, t, { T: { mat: "im", noi: c.noi, nhin: [0.5, 0.3] }, Hi: { mat: "im" } }); ctx.restore();
    viet(ctx, "tháng Ba…", 1560, 200, { size: 100, mau: GIAY, u: vao(tl, 0.1) });
  } else if (tl < tCai) {
    phongNH(ctx);
    NV_NH.forEach((s, i) => { const x = 380 + i * 380; veNV(ctx, x, 560, 0.85, { t, ...s, mat: tl >= tPM ? "ngac" : "thuong", nhin: tl >= tPM ? [((960 - x) / 600), 0] : [0, 0.5], chan: false, tayT: { p: [-60, 110], cong: -10 }, tayP: { p: [60, 110], cong: 10 } }); D.ban(ctx, x, 690, 300, 110); ve(ctx, rect(x - 70, 600, 140, 90, 8), "#3a3d4c", { w: 4 }); to(ctx, rect(x - 60, 608, 120, 72, 4), "#9fd3ea"); });
    if (tl >= tPM) { const u = back(vao(tl, tPM, 0.3)); robot(ctx, 960, 980, 0.8 * u, t, { chu: "phần mềm", mat: "vui" }); sao(ctx, 1080, 360, 30, t); sao(ctx, 840, 380, 22, t + 1); }
    viet(ctx, "cả tổ anh", 960, 950, { size: 70, u: vao(tl, m(c, 5)) });
    vienHoiTuong(ctx, t);
  } else if (tl < tXong) {
    // cả tổ dạy phần mềm ba tháng, nó lớn dần
    phongNH(ctx);
    const lon = lerp(0.55, 0.95, eio(pha(tl, tCai, tXong)));
    ve(ctx, rect(760, 330, 400, 240, 10), "#ffffff", { w: 6 }); viet(ctx, "1 + 1 = 2", 960, 470, { size: 80, pop: false });
    robot(ctx, 960, 900, lon, t, { chu: "phần mềm", mat: Math.floor(tq * 3) % 2 ? "vui" : "thuong", vay: tl >= tDay });
    NV_NH.forEach((s, i) => { const x = [320, 580, 1340, 1600][i]; veNV(ctx, x, 620, 0.85, { t, ...s, mat: "thuong", nhin: [x < 960 ? 0.7 : -0.7, 0], tayP: i < 2 ? { p: [150, -40], cong: 20, kieu: "chi" } : undefined, tayT: i >= 2 ? { p: [-150, -40], cong: -20, kieu: "chi", lat: -1 } : undefined, noi: i === 2 && tl >= tDay ? c.noi : 0 }); });
    if (tl >= t3) { D.lichO(ctx, 1250, 110, 200, 220, 30, { tieuDe: "3 THÁNG" }); }
    vienHoiTuong(ctx, t);
  } else {
    // dạy xong nó đuổi: robot cầm thẻ tên TUẤN vẫy chào, cả tổ ôm thùng ra cửa
    phongNH(ctx);
    ve(ctx, rect(1580, 380, 240, 420, 6), "#3f8f6b", { w: 6 }); viet(ctx, "LỐI RA", 1700, 360, { size: 50, mau: "#2f9e57", pop: false });
    const di = tl >= tDuoi ? (tl - tDuoi) * 160 : 0;
    NV_NH.forEach((s, i) => { const x = 700 + i * 230 + di, nh = Math.floor(tq * 8 + i) % 2 ? -5 : 0; veNV(ctx, x, 600 + nh, 0.82, { t, ...s, mat: s.kieu === "tuan" ? "buon" : "chan", nhin: [-0.5, 0], tayT: { p: [-60, 100], cong: -10 }, tayP: { p: [60, 100], cong: 10 } }); thung(ctx, x, 600 + nh + 90 * 0.82, 0.8); });
    robot(ctx, 380, 900, 1.0, t, { chu: "phần mềm", mat: "vui", vay: true, caVat: true });
    { const a = -1.9 + Math.sin(T12(t) * 12) * 0.35; theTen(ctx, 380 + 96 + Math.cos(a) * 118, 900 - 230 + Math.sin(a) * 118 + 84, "TUẤN", 1.4); }
    viet(ctx, "bye bye ♥", 470, 335, { size: 80, mau: DO, u: vao(tl, tXong + 0.1), xoay: -0.05 });
    vienHoiTuong(ctx, t);
  }
}

/* ── 70: 45% người dưới 1 năm bị cắt; Tuấn 5 năm còn bị thay; tôi chưa được 1 năm thì xếp hàng sẵn ── */
const HANG = [{ kieu: "nguoi", C: { ao: "#f39cc0", aoB: "#d97fa4" } }, { kieu: "sep" }, { kieu: "nguoi", C: { ao: "#7fbf8f", aoB: "#5f9f6f", kToc: "dai", toc: "#4a3428" } }, { kieu: "nguoi" }, { kieu: "tuan" },
  { kieu: "nguoi", C: { ao: "#f2d16b", aoB: "#d4b14a" } }, { kieu: "banhang" }, { kieu: "nguoi", C: { ao: "#b39ddb", aoB: "#9580bd", kToc: "duoi" } }, { kieu: "nguoi", C: { ao: "#ff9f80", aoB: "#e08060" } }, { kieu: "hieu" }];
const MOI = [0, 2, 5, 7, 9];   // dưới 1 năm
function c70(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), t45 = m(c, 9), tAnh = m(c, 14), tThang = m(c, 21), tXep = m(c, 30);
  const vw = tl < tAnh ? [1350, 560, 0.62] : tl < tThang ? [1300, 560, 1.25] : [60, 560, 1.25];
  ctx.save(); cam(ctx, ...vw);
  ctx.fillStyle = "#e9e2d5"; ctx.fillRect(-2000, -1000, 6000, 3000); ctx.fillStyle = "#c9bfa8"; ctx.fillRect(-2000, 820, 6000, 1500); netPts(ctx, [[-1200, 820], [3200, 820]], { w: 6 });
  ve(ctx, rect(2440, 300, 300, 520, 6), "#3f8f6b", { w: 6 }); ve(ctx, rect(2490, 220, 200, 70, 8), "#2f9e57", { w: 4 }); viet(ctx, "LỐI RA", 2590, 272, { size: 46, mau: "#fff", pop: false });
  HANG.forEach((s, i) => {
    const x = 2300 - i * 250 + Math.min(40, tl * 6), nh = Math.floor(tq * 6 + i) % 2 ? -4 : 0, ht = s.kieu === "hieu";
    const mat = ht ? "chan" : s.kieu === "tuan" ? (tl >= tAnh ? "im" : "chan") : "chan";
    veNV(ctx, x, 600 + nh, 0.82, { t, ...s, mat, nhin: [0.6, 0], tayT: { p: [-60, 100], cong: -10 }, tayP: { p: [60, 100], cong: 10 } });
    thung(ctx, x, 600 + nh + 92 * 0.82, 0.82);
    if (MOI.includes(i) && tl >= t45 - 0.2) theTen(ctx, x, 600 + nh - 300, "< 1 năm", 1.0, "#ffe7a6");
    if (s.kieu === "tuan" && tl >= tAnh) theTen(ctx, x, 600 + nh - 300, "5 năm", 1.0, "#cfe3ff");
  });
  if (tl >= tThang) moHoi(ctx, -10, 330, 0.9);
  ctx.restore();
  if (tl < tAnh) { viet(ctx, "45%", 360, 220, { size: 170, mau: DO, u: vao(tl, t45), xoay: -0.06 }); viet(ctx, "bị cắt", 360, 330, { size: 70, u: vao(tl, m(c, 11)) }); }
  else if (tl < tThang) viet(ctx, "5 năm vẫn bị thay", 960, 115, { size: 84, u: vao(tl, tAnh + 0.2) });
  else viet(ctx, "xếp hàng sẵn", 1300, 990, { size: 100, mau: DO, u: vao(tl, tXep), xoay: 0.04 });
}

/* ── 71: còn 50 triệu? Tết năm đầu đi làm, thử việc 5 triệu; cậu Hưng hỏi giữa mâm rượu; liếc mẹ, thêm chữ "mươi" ── */
function mamRuou(ctx, t, o = {}) {   // nền + chiếu; nhân vật vẽ trước khi gọi khayMam
  giay(ctx, "#f3d9b5"); to(ctx, rect(0, 660, W, 420, 0), "#e9cf8f"); netPts(ctx, [[-10, 660], [W + 10, 660]], { w: 6 });
  for (let i = 0; i < 12; i++) netPts(ctx, [[i * 170, 664], [i * 170 - 160, 1080]], { w: 2.5, mau: "#cfb26e", seed: 3700 + i });
  for (const x of [120, 1800]) { ve(ctx, elip(x, 150, 50, 60), "#e2453c", { w: 5 }); to(ctx, rect(x - 24, 82, 48, 12, 3), "#e8b93c"); to(ctx, rect(x - 24, 206, 48, 12, 3), "#e8b93c"); netPts(ctx, [[x, 40], [x, 84]], { w: 3 }); }
  ve(ctx, rect(760, 80, 400, 120, 8), "#e2453c", { w: 5 }); viet(ctx, "XUÂN", 960, 165, { size: 72, mau: "#ffd23e", pop: false });
}
function khayMam(ctx, t) {
  ve(ctx, elip(960, 820, 520, 130), "#b5352f", { w: 6 }); ve(ctx, elip(960, 808, 490, 112), "#c9573f", { w: 4 });
  ve(ctx, rect(560, 740, 130, 110, 8), "#5fa05a", { w: 5 }); netPts(ctx, [[560, 795], [690, 795]], { w: 3, mau: "#e8f0a0" }); netPts(ctx, [[625, 740], [625, 850]], { w: 3, mau: "#e8f0a0" });
  ve(ctx, elip(820, 800, 90, 34), "#ffffff", { w: 4 }); for (let i = 0; i < 4; i++) ve(ctx, elip(780 + i * 26, 796, 18, 18), "#f6e3e3", { w: 3 });
  ve(ctx, elip(1090, 800, 100, 36), "#ffffff", { w: 4 }); ve(ctx, "M1030,800 C1030,750 1150,750 1150,800 Z", "#f2c14e", { w: 4 });
  ve(ctx, "M1260,820 L1260,720 C1260,700 1280,690 1280,670 L1300,670 C1300,690 1320,700 1320,720 L1320,820 Z", "rgba(230,240,250,0.85)", { w: 4 });
  for (const x of [740, 1200]) ve(ctx, "M-16,0 L16,0 L12,30 L-12,30 Z".replace(/(-?\d+),(-?\d+)/g, (s, a, b) => `${x + +a},${862 + +b}`), "#ffffff", { w: 3 });
}
function chen(g) { g.save(); g.rotate(1.5); ve(g, "M-26,-70 L26,-70 L20,-20 L-20,-20 Z", "#ffffff", { w: 4 }); to(g, rect(-18, -62, 36, 22, 2), "#f2e6b0"); g.restore(); }
function c71(ctx, t, uf, c) {
  const tl = c.tl, tTet = m(c, 3), t5 = m(c, 12), tCau = m(c, 14), tDinh = m(c, 21), tLiec = m(c, 26), tThem = m(c, 29), tMuoi = m(c, 32);
  if (tl < tTet) {
    ctx.save(); cam(ctx, 760, 620, 1.5); quan(ctx, t, { T: { mat: "im", nhin: [0.5, 0] }, Hi: { mat: "nheo", noi: 0, nhin: [-0.6, 0] } }); ctx.restore();
    viet(ctx, "50 triệu?", 1540, 200, { size: 120, mau: VANG, u: vao(tl, 0.05), xoay: 0.05 });
  } else if (tl < tCau) {
    giay(ctx, "#fde3d3");
    net(ctx, "M-20,140 C120,160 220,120 340,180 M180,148 C220,90 260,60 320,40 M260,170 C300,220 360,240 430,236", { w: 10, mau: "#7a4a2a" });
    for (const [x, y] of [[90, 140], [200, 120], [300, 60], [330, 180], [420, 230], [250, 210], [150, 180]]) hoa(ctx, x, y, 22, "#f7a8c4");
    for (const x of [1600, 1760]) { ve(ctx, elip(x, 170, 46, 56), "#e2453c", { w: 5 }); netPts(ctx, [[x, 40], [x, 112]], { w: 3 }); }
    veNV(ctx, 960, 540, 1.05, { t, kieu: "tuan", mat: tl >= t5 ? "chan" : "thuong", tayT: { p: [-150, 120], cong: -20 }, tayP: { p: [150, 120], cong: 20 } });
    ctx.save(); ctx.translate(960, 700); ctx.rotate(-0.03); ve(ctx, rect(-260, -80, 520, 160, 10), "#fffdf5", { w: 6 }); viet(ctx, "THỬ VIỆC", 0, -12, { size: 50, mau: "#6b6560", pop: false }); if (tl >= t5) viet(ctx, "5.000.000đ", 0, 56, { size: 66, mau: "#2f9e57", u: vao(tl, t5) }); ctx.restore();
    viet(ctx, "Tết năm đầu đi làm", 960, 1000, { size: 70, u: vao(tl, tTet) });
  } else {
    // mâm rượu Tết
    mamRuou(ctx, t);
    const xong = tl >= tThem, liec = tl >= tLiec && tl < tThem;
    ctx.save(); if (tl >= tDinh) { const z = lerp(1, 1.25, eio(pha(tl, tDinh, tDinh + 0.6))); ctx.translate(1100, 560); ctx.scale(z, z); ctx.translate(-1100, -560); }
    veNV(ctx, 520, 560, 0.95, { t, kieu: "hung", say: 1, mat: xong ? "ngac" : "cuoi", noi: tl < tDinh ? c.noi : 0, nhin: [0.6, 0], chan: false, tayP: { p: [120, -40], cong: 24, kieu: "nam", camTren: chen } });
    veNV(ctx, 1380, 560, 0.95, { t, kieu: "thoa", mat: xong ? "tuhao" : liec ? "cuoi" : "thuong", nhin: [-0.7, 0], chan: false });
    veNV(ctx, 960, 560, 0.95, { t, kieu: "tuan", mat: xong ? "cuoi" : tl >= tDinh ? "bat" : "thuong", noi: tl >= tDinh && tl < tLiec ? 0.5 : 0, nhin: liec ? [1, 0] : tl < tDinh ? [-0.7, 0] : [0, 0], chan: false });
    khayMam(ctx, t);
    if (liec) moHoi(ctx, 1080, 300, 0.8);
    ctx.restore();
    if (tl < tDinh) viet(ctx, "“lương bao nhiêu?”", 600, 250, { size: 64, u: vao(tl, m(c, 16)), xoay: -0.04 });
    else if (tl < tThem) viet(ctx, "năm…", 1190, 330, { size: 90, u: vao(tl, m(c, 24)) });
    if (xong) {
      const u = eout(vao(tl, tThem + 0.1, 0.45)), z0 = 1.25;
      const mx = 1100 + (960 - 1100) * z0, my = 560 + (560 - 49 * 0.95 - 560) * z0;
      viet(ctx, "MƯƠI", lerp(mx, 960, u), lerp(my, 230, u), { size: lerp(30, 190, u), mau: "#e8a21c", pop: false, nen: "#fff4d0" });
      if (u >= 1) { tiaNhan(ctx, 960, 170, 190, 250, 9, { a0: -Math.PI / 2, goc: 0.36, mau: "#e8a21c", w: 6 }); sao(ctx, 700, 160, 30, t); sao(ctx, 1220, 150, 26, t + 1); }
    }
  }
}

/* ── 72: một chữ "mươi" bác Thoa khoe 5 năm; tôi bị đem ra so cả thời sinh viên; chữ đắt nhất họ ── */
function chuMuoi(ctx, x, y, size, t) { viet(ctx, "MƯƠI", x, y, { size, mau: "#e8a21c", pop: false, nen: "#fff4d0" }); }
function loa(g) { g.save(); g.scale(1.8, 1.8); ve(g, "M10,-14 L60,-46 L60,46 L10,14 Z", "#e9e2d0", { w: 4 }); ve(g, rect(-6, -16, 20, 32, 4), "#7a7d88", { w: 3.5 }); g.restore(); }
function c72(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tKhoe = m(c, 5), tNam = m(c, 6), tMot2 = m(c, 8), tSo = m(c, 15), tSV = m(c, 17), tDm = m(c, 20), tDat = m(c, 23);
  if (tl < tMot2) {
    giay(ctx);
    for (let i = 0; i < 14; i++) { const q = rng(3800 + i); to(ctx, rect(q() * W, ((q() * H + tl * 200) % H), 14, 8, 2), ["#e2453c", "#ffd23e", "#4a8fd1"][i % 3]); }
    chuMuoi(ctx, 960, 250, 150, t);
    veNV(ctx, 760, 640, 1.1, { t, kieu: "thoa", mat: "tuhao", noi: tl >= tKhoe ? 0.4 + 0.4 * Math.abs(Math.sin(tq * 9)) : 0, nhin: [0.5, 0], tayP: { p: [110, -60], cong: 20, kieu: "nam", camTren: loa } });
    if (tl >= tKhoe) { viet(ctx, "50 TRIỆU!!", 1430, 480, { size: 110, mau: DO, u: vao(tl, tKhoe), xoay: 0.05 }); rung(ctx, 1080, 520, 120, 2, DO); }
    if (tl >= tNam) { const nam = 2021 + Math.min(4, Math.floor((tl - tNam) / 0.18)); viet(ctx, `${nam}`, 1430, 700, { size: 90, mau: "#6b6560", pop: false }); viet(ctx, "5 năm", 1430, 800, { size: 70, u: vao(tl, m(c, 7)) }); }
  } else if (tl < tDm) {
    // cân: chữ MƯƠI nặng trĩu, thằng sinh viên nhẹ bẫng
    giay(ctx);
    const a = -0.28 * eout(vao(tl, tMot2 + 0.2, 0.5)) + Math.sin(tl * 3) * 0.02, cx = 960, cy = 330, L = 520;
    ve(ctx, rect(cx - 18, cy, 36, 600, 8), "#9c6a44", { w: 5 }); ve(ctx, rect(cx - 150, 920, 300, 40, 10), "#9c6a44", { w: 5 });
    const lx = cx - Math.cos(a) * L, ly = cy - Math.sin(a) * L, rx = cx + Math.cos(a) * L, ry = cy + Math.sin(a) * L;
    netPts(ctx, [[lx, ly], [rx, ry]], { w: 16, mau: "#7a4a2a", run: 0.6 });
    for (const [px, py] of [[lx, ly], [rx, ry]]) { netPts(ctx, [[px, py], [px - 120, py + 200]], { w: 4 }); netPts(ctx, [[px, py], [px + 120, py + 200]], { w: 4 }); ve(ctx, `M${px - 150},${py + 200} L${px + 150},${py + 200} C${px + 130},${py + 250} ${px - 130},${py + 250} ${px - 150},${py + 200} Z`, "#c9a24a", { w: 5 }); }
    ve(ctx, rect(lx - 120, ly + 90, 240, 110, 10), "#ffcf3a", { w: 5 }); chuMuoi(ctx, lx, ly + 178, 84, t);
    veNV(ctx, rx, ry + 200 - 222 * 0.6, 0.6, { t, kieu: "hieu", mat: tl >= tSo ? "chan" : "ngac", tayT: { p: [-90, 128], cong: -14 }, tayP: { p: [90, 128], cong: 14 } });
    veNV(ctx, 160, 720, 0.8, { t, kieu: "me", mat: "im", nhin: [0.8, -0.3] }); veNV(ctx, 1700, 700, 0.8, { t, kieu: "hung", mat: "cuoi", say: 0.6, nhin: [-0.8, -0.3], tayT: { p: [-150, -40], cong: -20, kieu: "chi", lat: -1 } });
    if (tl >= tSo) viet(ctx, "bị đem ra so", 960, 150, { size: 84, u: vao(tl, tSo) });
    if (tl >= tSV) viet(ctx, "suốt thời sinh viên", 960, 1030, { size: 66, mau: "#6b6560", u: vao(tl, tSV) });
  } else {
    // chữ MƯƠI đội vương miện ngồi ngai
    giay(ctx, "#fff4e0");
    for (let i = 0; i < 10; i++) { const q = rng(3900 + i); sao(ctx, 200 + q() * 1520, 120 + q() * 760, 14 + q() * 14, t + i); }
    ve(ctx, "M700,180 L1220,180 L1220,760 L700,760 Z", "#c0392b", { w: 7 }); net(ctx, rect(730, 210, 460, 520, 20), { w: 8, mau: "#ffcf3a" });
    ve(ctx, rect(640, 700, 640, 120, 18), "#c0392b", { w: 7 }); net(ctx, rect(660, 716, 600, 88, 12), { w: 6, mau: "#ffcf3a" });
    for (const x of [680, 1240]) ve(ctx, rect(x - 22, 820, 44, 140, 8), "#ffcf3a", { w: 5 }); for (const x of [650, 1270]) ve(ctx, elip(x, 260, 40, 40), "#ffcf3a", { w: 5 });
    const nh = Math.sin(tl * 4) * 6; chuMuoi(ctx, 960, 640 + nh, 220, t); vuongMien(ctx, 960, 420 + nh, 1.3);
    tiaNhan(ctx, 960, 420, 260, 330, 11, { a0: -Math.PI / 2, goc: 0.28, mau: "#e8a21c", w: 6 });
    veNV(ctx, 1600, 760, 0.9, { t, kieu: "hieu", mat: "tuc", nhin: [-0.8, -0.3] }); gan(ctx, 1700, 470, 0.9);
    if (tl >= tDat) { ve(ctx, rect(170, 470, 380, 150, 12), "#fffdf5", { w: 5 }); netPts(ctx, [[550, 545], [650, 600]], { w: 4 }); viet(ctx, "đắt nhất họ", 360, 570, { size: 74, mau: DO, u: vao(tl, tDat) }); }
  }
}

/* ── 73 (Tuấn): cả chợ chỉ shop em tay đàn ông; quét mã hiện tên NGUYỄN TRUNG HIẾU; tắt luôn; nhờ thằng Dũng chuyển hộ ── */
function tayNu(g, x, y, k) { g.save(); tayCanh(g, x, y, k, 0, 0, false, { ao: "#f7b6cf", aoB: "#e898b6", nhan: false }); g.translate(x, y); g.scale(k, k); g.rotate(-0.12); for (const [a, b] of [[-152, -62], [-142, 10], [-96, -84]]) ve(g, elip(a, b, 22, 16), "#ff3f8f", { w: 3 }); sao(g, -150, -110, 26, 0, "#ffd76a"); g.restore(); }
function c73(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tCho = m(c, 3), tTay = m(c, 8), tDem = m(c, 11), tApp = m(c, 15), tTen = m(c, 20), tTat = m(c, 23), tTu = m(c, 26), tDung = m(c, 31), tHo = m(c, 35);
  if (tl < tCho) {
    ctx.save(); cam(ctx, 760, 620, 1.5); quan(ctx, t, { T: { mat: "thuong", noi: c.noi, nhin: [0.5, 0] }, Hi: { mat: "im" } }); ctx.restore();
    return;
  }
  if (tl < tTat) {
    giay(ctx, "#2b3150");
    D.dienThoai(ctx, 820, 560, 3.1, 0, (g) => {
      g.fillStyle = "#f4f6f8"; g.fillRect(-80, -140, 160, 280);
      if (tl < tDem) {
        to(g, rect(-80, -140, 160, 54, 0), "#2a2631"); viet(g, "chợ ảnh", 0, -96, { size: 18, mau: "#fff", pop: false, soi: false });
        for (let i = 0; i < 6; i++) { const x = -36 + (i % 2) * 72, y = -48 + Math.floor(i / 2) * 64; ve(g, rect(x - 32, y - 28, 64, 58, 6), "#ffffff", { w: 2 }); g.save(); g.beginPath(); g.rect(x - 30, y - 26, 60, 54); g.clip(); if (i === 3) tayCanh(g, x + 14, y + 6, 0.075, t, 0, false); else tayNu(g, x + 14, y + 6, 0.075); g.restore(); }
        if (tl >= tTay) khoanh(g, 36, 16, 40, 36, vao(tl, tTay, 0.35), DO, 4);
      } else if (tl < tApp) {
        to(g, rect(-80, -140, 160, 54, 0), "#2f9e57"); viet(g, "quét mã", 0, -96, { size: 18, mau: "#fff", pop: false, soi: false });
        ve(g, rect(-52, -60, 104, 104, 6), "#ffffff", { w: 2.5 }); const q = rng(4000);
        for (let r = 0; r < 9; r++) for (let k = 0; k < 9; k++) if (q() > 0.5 || (r < 3 && k < 3) || (r < 3 && k > 5) || (r > 5 && k < 3)) to(g, rect(-45 + k * 10, -53 + r * 10, 9, 9, 1), MUC);
        const sy = -58 + ((tl - tDem) * 140) % 100; netPts(g, [[-56, sy], [56, sy]], { w: 3, mau: DO });
      } else {
        to(g, rect(-80, -140, 160, 54, 0), "#2f9e57"); viet(g, "chuyển tiền", 0, -96, { size: 18, mau: "#fff", pop: false, soi: false });
        viet(g, "người nhận:", -66, -70, { size: 15, mau: "#6b6560", pop: false, can: "left", soi: false });
        if (tl >= tTen) { if (tl >= tTen + 0.3) to(g, rect(-70, -56, 140, 30, 6), "#ffe0dc"); viet(g, "NGUYỄN TRUNG HIẾU", 0, -34, { size: 15, mau: tl >= tTen + 0.3 ? DO : MUC, u: vao(tl, tTen), soi: false }); }
        viet(g, "10.000đ", 0, 20, { size: 34, mau: "#2f9e57", pop: false, soi: false });
        ve(g, rect(-64, 70, 60, 30, 10), "#d5d9e0", { w: 2 }); viet(g, "Huỷ", -34, 91, { size: 16, pop: false, soi: false });
        ve(g, rect(4, 70, 60, 30, 10), "#2f9e57", { w: 2 }); viet(g, "Gửi", 34, 91, { size: 16, mau: "#fff", pop: false, soi: false });
      }
    }, { vo: "#1c1f2e" });
    const so = tl >= tTen;
    veNV(ctx, 1560, 860, 1.0, { t, kieu: "tuanxe", mat: so ? "soc" : "thuong", noi: c.noi, nhin: [-0.7, -0.2], chan: false });
    if (so) moHoi(ctx, 1420, 560, 1.0);
    if (tl < tDem) viet(ctx, "tay đàn ông", 1560, 200, { size: 84, mau: GIAY, u: vao(tl, tTay + 0.2), xoay: 0.04 });
    return;
  }
  if (tl < tTu) {
    giay(ctx, "#2b3150");
    const bam = tl >= tTat + 0.12;
    D.dienThoai(ctx, 820, 560, 3.1, 0, (g) => { g.fillStyle = bam ? "#0d0f18" : "#f4f6f8"; g.fillRect(-80, -140, 160, 280); if (!bam) { ve(g, rect(-64, 70, 60, 30, 10), "#d5d9e0", { w: 2 }); viet(g, "Huỷ", -34, 91, { size: 16, pop: false, soi: false }); } }, { vo: "#1c1f2e" });
    const fy = lerp(1300, 897, eout(vao(tl, tTat - 0.05, 0.12)));
    ve(ctx, rect(655, fy + 60, 120, 400, 30), "#3aa564", { w: 5 }); ctx.save(); ctx.translate(715, fy + 70); ctx.rotate(-Math.PI / 2); ctx.scale(2.4, 2.4); banTay(ctx, "chi", 1, 4100); ctx.restore();
    if (bam && tl < tTat + 0.35) tiaNhan(ctx, 715, fy - 80, 40, 90, 7, { a0: -Math.PI / 2, goc: 0.5, mau: GIAY, w: 5 });
    viet(ctx, "tắt luôn", 1500, 300, { size: 110, mau: GIAY, u: vao(tl, m(c, 24)), xoay: 0.04 });
    return;
  }
  // thằng Dũng: Phạm Văn Dũng chuyển hộ
  phoDem(ctx, t, { vung: false });
  xeMay(ctx, 360, 955, 0.8, t, { lat: 1 }); xeMay(ctx, 1640, 955, 0.8, t, { lat: -1 });
  veNV(ctx, 640, 720, 0.95, { t, kieu: "tuanxe", mat: "cuoi", noi: c.noi, nhin: [0.7, 0], tayP: { p: [160, -20], cong: 20, kieu: "chi" } });
  veNV(ctx, 1080, 720, 0.95, { t, kieu: "dung", mat: "cuoi", nhin: [-0.3, 0], tayT: { p: [-120, -80], cong: -20, kieu: "like", lat: -1 }, tayP: { p: [110, 60], cong: 14 } });
  if (tl >= tDung) { const u = back(vao(tl, tDung, 0.3)); D.dienThoai(ctx, 1460, 520, 1.6 * u, 0.06, (g) => { g.fillStyle = "#f4f6f8"; g.fillRect(-80, -140, 160, 280); to(g, rect(-80, -140, 160, 34, 0), "#2f9e57"); viet(g, "người gửi", 0, -60, { size: 18, mau: "#6b6560", pop: false, soi: false }); viet(g, "PHẠM VĂN DŨNG", 0, -24, { size: 17, mau: DO, pop: false, soi: false }); viet(g, "10.000đ", 0, 30, { size: 30, mau: "#2f9e57", pop: false, soi: false }); }); }
  if (tl >= tHo) viet(ctx, "chuyển hộ", 960, 200, { size: 96, mau: VANG, u: vao(tl, tHo) });
}

/* ── 74 (Tuấn): anh biết cái nhẫn; cược dì không bao giờ phóng to ảnh anh; Thua. ── */
function c74(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tNhan = m(c, 3), tCuoc = m(c, 5), tThua = m(c, 15);
  if (tl < tCuoc) {
    giay(ctx, "#fff4e6"); tayCanh(ctx, 1150, 560, 1.5, t, tl >= tNhan ? 1 : 0, true);
    if (tl >= tNhan) khoanh(ctx, 1150 - 66 * 1.5 - 4, 560 + 60 * 1.5 + 12, 70, 80, vao(tl, tNhan, 0.35));
    viet(ctx, "anh biết", 560, 900, { size: 96, u: vao(tl, m(c, 1)), xoay: -0.05 });
    return;
  }
  const thua = tl >= tThua;
  ctx.save(); cam(ctx, 700, 560, 1.45);
  quan(ctx, t, { hieu: false, T: { mat: thua ? "chan" : "cuoi", noi: c.noi, nhin: [0.4, 0.4], ngh: thua ? 0.14 : 0, tayP: { p: [90, -175], cong: 40, kieu: "nam" } } });
  moHoi(ctx, 470, 360, 0.75);
  ctx.restore();
  // mây nghĩ: dì (mẹ Hiếu) lướt qua ảnh anh, không phóng to
  if (!thua || tl < tThua + 0.4) {
    ctx.save(); if (thua) { const u = vao(tl, tThua, 0.4); ctx.globalAlpha = 1 - u; }
    for (const [x, y, r] of [[1150, 640, 22], [1210, 560, 34]]) ve(ctx, elip(x, y, r, r * 0.8), "#ffffff", { w: 5 });
    ve(ctx, "M1300,420 C1260,300 1400,220 1500,260 C1560,180 1720,190 1760,280 C1860,290 1880,420 1800,470 C1820,560 1680,600 1600,560 C1540,620 1380,600 1360,530 C1270,530 1250,450 1300,420 Z", "#ffffff", { w: 6 });
    veNV(ctx, 1460, 560, 0.42, { t, kieu: "me", mat: "chan", nhin: [0.6, 0.5], chan: false, tayP: { p: [80, 40], cong: 10 } });
    D.dienThoai(ctx, 1640, 430, 0.62, 0.1, (g) => { g.fillStyle = "#fff"; g.fillRect(-80, -140, 160, 280); g.save(); g.translate(0, -30 - ((tl * 300) % 120)); veNV(g, 0, 40, 0.3, { t, kieu: "tuan", mat: "tuhao", chan: false }); g.restore(); });
    for (let i = 0; i < 3; i++) netPts(ctx, [[1730, 350 + i * 40], [1730, 300 + i * 40]], { w: 4, seed: 4200 + i });
    if (tl >= tCuoc) viet(ctx, "cược", 1560, 720, { size: 90, mau: GIAY, u: vao(tl, tCuoc + 0.3) });
    ctx.restore();
  }
  if (thua) { const u = back(vao(tl, tThua, 0.2)); ctx.save(); ctx.translate(1520, 420); ctx.rotate(-0.15); ctx.scale(u, u); net(ctx, rect(-230, -100, 460, 200, 18), { w: 12, mau: DO }); viet(ctx, "THUA.", 0, 50, { size: 150, mau: DO, pop: false }); ctx.restore(); }
}

/* ── 75 (Tuấn): mẹ anh trưa nào cũng hỏi ăn gì chưa; anh gửi ảnh, biết mẹ sẽ đăng; mẹ anh có mỗi anh để khoe ── */
function c75(ctx, t, uf, c) {
  const tl = c.tl, tAnh = m(c, 9), tDang = m(c, 15), tMe = m(c, 16);
  if (tl < tAnh) {
    ctx.save(); cam(ctx, 700, 600, 1.5); quan(ctx, t, { hieu: false, T: { mat: "im", noi: c.noi, nhin: [0.5, 0.6] } }); ctx.restore();
    manHinhGoi(ctx, 1500, 520, 1.5, t, { kieu: "den", ai: "thoa", ten: "Mẹ ♥", phu: "12:00 · gọi đến" });
    rung(ctx, 1500, 520, 260, 2, GIAY);
    viet(ctx, "“ăn gì chưa?”", 1500, 120, { size: 76, mau: GIAY, u: vao(tl, m(c, 6)) });
  } else if (tl < tMe) {
    ctx.save(); cam(ctx, 700, 600, 1.5); quan(ctx, t, { hieu: false, T: { mat: "im", noi: c.noi, nhin: [0.3, -0.2], tayP: { p: [80, 20], cong: 30 } } }); ctx.restore();
    const u = eio(vao(tl, tAnh + 0.15, 0.9));
    D.dienThoaiSau(ctx, 880, 690, 0.6, 0.1);
    anhSushi(ctx, lerp(880, 1480, u), lerp(600, 380, u) - Math.sin(u * Math.PI) * 120, lerp(0.3, 1.0, u), lerp(0, 0.06, u), { tay: true });
    if (tl >= tDang) { const v = back(vao(tl, tDang, 0.3)); ctx.save(); ctx.translate(1480, 650); ctx.scale(v, v); ve(ctx, rect(-150, -40, 300, 80, 20), "#2f7fe0", { w: 5 }); viet(ctx, "mẹ đăng ✓", 0, 22, { size: 54, mau: "#fff", pop: false }); ctx.restore(); for (let i = 0; i < 4; i++) hoa(ctx, 1640 + (i % 2) * 50, 300 + i * 50 - (tl - tDang) * 40, 18); }
  } else {
    // cận: cốc trà đá tan dần, Tuấn nhìn xuống
    phoDem(ctx, t, { vung: false });
    veNV(ctx, 760, 900, 1.9, { t, kieu: "tuanxe", mat: "im", noi: c.noi, nhin: [0.5, 0.8], ngh: 0.05, chan: false });
    const tan = clamp((tl - tMe) / 2.2);
    ctx.save(); ctx.translate(1380, 900); ctx.scale(2.6, 2.6);
    ve(ctx, "M-36,-70 L36,-70 L28,40 L-28,40 Z", "rgba(210,170,90,0.75)", { w: 4 });
    for (const [a, b, s] of [[-12, -40, 9], [10, -30, 8], [-4, -10, 8]]) { const r = s * (1 - tan * 0.7); ve(ctx, rect(a - r, b - r + tan * 30, r * 2, r * 2, 3), "rgba(255,255,255,0.8)", { w: 2.5 }); }
    for (const [a, b] of [[-30, -20], [30, 0], [-26, 20]]) ve(ctx, "M0,-6 C3,-1 5,2 5,4 C5,7 2,8 0,8 C-2,8 -5,7 -5,4 C-5,2 -3,-1 0,-6 Z".replace(/(-?\d+),(-?\d+)/g, (s0, x, y) => `${a + +x},${b + +y + tan * 10}`), "#cfe8f6", { w: 1.5 });
    ctx.restore();
  }
}

/* ── 76: 12 thứ bảy, 12 tấm; 120 nghìn xếp thành chữ TUẤN; để được tiếp tục làm "anh Tuấn" ── */
const O_TUAN = [[350, 470, 0], [350, 560, Math.PI / 2], [570, 545, Math.PI / 2], [690, 545, Math.PI / 2], [630, 612, 0],
  [880, 562, -1.07], [960, 562, 1.07], [920, 454, 0], [990, 392, -0.9], [1130, 550, Math.PI / 2], [1250, 550, Math.PI / 2], [1190, 550, 0.82]];
function c76(ctx, t, uf, c) {
  const tl = c.tl, t12b = m(c, 3), tTra = m(c, 5), t120 = m(c, 8), tDe = m(c, 10), tLam = m(c, 14);
  giay(ctx);
  if (tl < tTra) {
    for (let i = 0; i < 12; i++) {
      const u = vao(tl, 0.05 + i * 0.2, 0.22); if (u <= 0) continue; const x = 260 + (i % 6) * 280, y = 360 + Math.floor(i / 6) * 330;
      anhSushi(ctx, x, y, 0.66 * back(u), ((i % 3) - 1) * 0.06, { tay: true, lech: i });
      viet(ctx, `T7 #${i + 1}`, x, y + 130, { size: 40, mau: "#6b6560", pop: false });
    }
    viet(ctx, "12 thứ Bảy", 960, 140, { size: 96, u: vao(tl, 0.05) });
    if (tl >= t12b) viet(ctx, "= 12 tấm", 1560, 140, { size: 80, mau: DO, u: vao(tl, t12b) });
    return;
  }
  const dx = 160, gx = (x) => x + dx;
  O_TUAN.forEach(([x, y, r], i) => {
    const u = eio(clamp((tl - tTra - i * 0.12) / 0.45)); if (u <= 0) return; const q = rng(4300 + i), x0 = q() * W, y0 = -150;
    const X = 960 + (x - 800) * 1.15, Y = 540 + (y - 520) * 1.15 - (tl >= tDe ? 330 : 0) * eio(vao(tl, tDe, 0.5));
    D.tien(ctx, lerp(x0, X, u), lerp(y0, Y, u), 0.62, 10, lerp(q() * 6, r, u));
  });
  if (tl >= t120) viet(ctx, "120.000đ", 960, tl >= tDe ? 1020 : 860, { size: 90, mau: "#2f9e57", u: vao(tl, t120) });
  if (tl >= tDe) {
    // tấm bìa "anh Tuấn" vest đội vương miện, anh Tuấn thật áo xe ôm nấp sau giơ lên
    const u = eout(vao(tl, tDe, 0.5)), y0 = lerp(1400, 880, u);
    veNV(ctx, 1010, y0 - 260, 0.85, { t, kieu: "tuanxe", mat: "chan", nhin: [0.3, -0.2], chan: false, anTay: true });
    ctx.save(); ctx.translate(960, y0); ctx.rotate(-0.03);
    ve(ctx, rect(-200, -320, 400, 380, 10), "#d9b48a", { w: 6 }); ctx.save(); ctx.beginPath(); ctx.rect(-186, -306, 372, 352); ctx.clip(); to(ctx, rect(-186, -306, 372, 352, 0), "#fff4e0");
    veNV(ctx, 0, -60, 0.8, { t, kieu: "tuan", mat: "tuhao" }); vuongMien(ctx, 0, -240, 0.7); ctx.restore();
    viet(ctx, "anh Tuấn", 0, 30, { size: 46, mau: "#7a4a2a", pop: false }); ctx.restore();
    for (const s of [-1, 1]) { ctx.save(); ctx.translate(960 + s * 205, y0 - 160); ctx.rotate(s > 0 ? Math.PI : 0); banTay(ctx, "nam", 1, 4400 + s); ctx.restore(); }
    if (tl >= tLam) viet(ctx, "làm anh Tuấn", 1580, 640, { size: 76, u: vao(tl, tLam), xoay: 0.05 });
  }
}

/* ── 77: đêm anh mua, sáng bác đăng, trưa mẹ gọi — dây chuyền khép kín chạy bằng hai thằng nghèo nhất họ ── */
const TRAM = [{ x: 330, kieu: "hieu", ten: "đêm" }, { x: 760, kieu: "tuanxe", ten: "anh mua" }, { x: 1190, kieu: "thoa", ten: "sáng" }, { x: 1610, kieu: "me", ten: "trưa" }];
function c77(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tMua = m(c, 2), tSang = m(c, 3), tDang = m(c, 5), tTrua = m(c, 6), tGoi = m(c, 9), tDay = m(c, 10), tKin = m(c, 13), tChay = m(c, 15), tHai = m(c, 17);
  const ra = tl >= tChay ? eio(vao(tl, tChay, 0.6)) : 0;
  ctx.save(); cam(ctx, 960, lerp(540, 760, ra), lerp(1, 0.72, ra));
  giay(ctx); ctx.fillStyle = GIAY; ctx.fillRect(-600, -400, 3100, 2200);
  const chay = tl * (tl >= tChay ? 260 : 120);
  // băng chuyền
  ve(ctx, rect(140, 640, 1640, 74, 37), "#4a4f62", { w: 6 });
  for (let i = 0; i < 14; i++) { ctx.save(); ctx.translate(190 + i * 118, 677); ctx.rotate(chay / 30); ve(ctx, elip(0, 0, 24, 24), "#9aa0ab", { w: 4 }); netPts(ctx, [[-20, 0], [20, 0]], { w: 3 }); ctx.restore(); }
  for (let i = 0; i < 20; i++) { const x = 160 + ((i * 90 + chay) % 1620); netPts(ctx, [[x, 644], [x + 20, 644]], { w: 4, mau: "#7a7f92", seed: 4500 + i }); }
  // trạm
  const sang = [tl >= 0, tl >= tMua, tl >= tSang, tl >= tTrua];
  TRAM.forEach((s, i) => {
    const mat = i === 0 ? (tl >= tChay ? "chan" : "thuong") : i === 1 ? "thuong" : i === 2 ? (tl >= tDang ? "tuhao" : "thuong") : (tl >= tGoi ? "cuoi" : "thuong");
    veNV(ctx, s.x, 520, 0.72, { t, kieu: s.kieu, mat, nhin: [0.5, 0.4], chan: false, tayP: i === 2 && tl >= tDang ? { p: [110, -60], cong: 20, kieu: "nam", camTren: (g) => D.dienThoai(g, 6, -40, 0.32, 0.2) } : i === 3 && tl >= tGoi ? { p: [90, -90], cong: 20, kieu: "nam", camTren: (g) => D.dienThoai(g, 6, -40, 0.32, 0.4) } : undefined });
    ctx.save(); ctx.globalAlpha = sang[i] ? 1 : 0.35; viet(ctx, s.ten, s.x, 250, { size: 54, mau: i === 0 ? "#3a4a8a" : i === 2 ? "#e8a21c" : MUC, pop: false }); ctx.restore();
  });
  ve(ctx, elip(330, 170, 30, 30), "#fff3c2", { w: 4 }); to(ctx, elip(344, 160, 26, 26), GIAY);
  if (tl >= tSang) { ve(ctx, elip(1190, 170, 28, 28), "#ffd23e", { w: 4 }); tiaNhan(ctx, 1190, 170, 36, 52, 8, { a0: 0, goc: 0.785, w: 3.5, mau: "#e8a21c" }); }
  if (tl >= tTrua) D.dongHo(ctx, 1610, 170, 34, 12, 0);
  // tấm ảnh chạy trên băng
  const mocA = [[0, 330], [tMua + 0.2, 760], [tSang + 0.3, 1190], [tTrua + 0.3, 1610]];
  let ax = 330; for (let i = 0; i < mocA.length - 1; i++) { const [t0, x0] = mocA[i], [t1, x1] = mocA[i + 1]; if (tl >= t0) ax = lerp(x0, x1, eio(clamp((tl - t0) / Math.max(0.2, (t1 - t0) * 0.8)))); }
  anhSushi(ctx, ax, 590, 0.28, 0, { tay: true });
  if (tl >= tMua) { const u = clamp((tl - tMua - 0.4) / 0.6); if (u > 0 && u < 1) D.tien(ctx, lerp(760, 330, u), 420 - Math.sin(u * Math.PI) * 120, 0.32, 10, u * 6); }
  if (tl >= tDang) for (let i = 0; i < 3; i++) hoa(ctx, 1270 + i * 34, 380 - (tl - tDang) * 60 - i * 20, 12);
  if (tl >= tGoi) { const u = vao(tl, tGoi, 0.6), pts = []; for (let k = 0; k <= 30 * u; k++) { const v = k / 30; pts.push([lerp(1610, 330, v), 330 - Math.sin(v * Math.PI) * 210]); } if (pts.length > 1) netPts(ctx, pts, { w: 5, mau: DO, seed: 4600 }); if (u >= 1) rung(ctx, 330, 360, 120, 1, DO); }
  if (tl >= tDay) {
    const u = vao(tl, tDay, 0.8), n = Math.floor(60 * u), pts = []; for (let k = 0; k <= n; k++) { const a = -Math.PI / 2 + (k / 60) * Math.PI * 2 * 0.96; pts.push([960 + Math.cos(a) * 900, 470 + Math.sin(a) * 330]); }
    if (pts.length > 1) netPts(ctx, pts, { w: 8, mau: "#2f7fe0", seed: 4610 });
    if (tl >= tKin) viet(ctx, "khép kín", 960, 105, { size: 84, mau: "#2f7fe0", u: vao(tl, tKin) });
  }
  // hai thằng nghèo nhất họ chạy guồng chuột phía dưới
  if (ra > 0) {
    for (const [i, x, kieu] of [[0, 700, "hieu"], [1, 1220, "tuanxe"]]) {
      ctx.save(); ctx.translate(x, 1090); ctx.rotate(chay / 60); ve(ctx, elip(0, 0, 200, 200), null, { w: 8 }); for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; netPts(ctx, [[0, 0], [Math.cos(a) * 196, Math.sin(a) * 196]], { w: 3, mau: "#9aa0ab", seed: 4620 + k }); } ctx.restore();
      const b = Math.floor(tq * 12 + i) % 2;
      veNV(ctx, x, 1147 + (b ? -8 : 0), 0.6, { t, kieu, mat: "chan", xoay: 0.18, tayT: { p: b ? [-120, 40] : [-60, 140], cong: -20 }, tayP: { p: b ? [60, 140] : [120, 40], cong: 20 } });
      moHoi(ctx, x + 110, 900, 0.8); netPts(ctx, [[x, 1090], [x, 714]], { w: 4, mau: "#7a7f92", seed: 4630 + i });
    }
    if (tl >= tHai) viet(ctx, "2 thằng nghèo nhất họ", 960, 1370, { size: 96, mau: DO, u: vao(tl, tHai) });
  }
  ctx.restore();
}

/* ── 78: có cuốc; chị bước ra từ nhà hàng omakase, leo lên xe anh Tuấn, gọi bạn: "tự thưởng… ngon vãi" ── */
function tui(g) { ve(g, "M14,10 L52,10 L56,50 L10,50 Z", "#e85a8a", { w: 3.5 }); net(g, "M22,10 C22,-6 44,-6 44,10", { w: 3 }); }
function dt(g) { ve(g, rect(-6, -46, 30, 56, 6), "#33364a", { w: 3 }); }
const BX = 1000, BY = 960, BK = 1.0;
function xeChoKhach(ctx, t, S1, S2, o = {}) {   // xe máy quay trái, Tuấn ngồi trước, chị ngồi sau
  xeMay(ctx, BX + (o.dx ?? 0), BY, BK, t, { lat: -1, quay: o.quay ?? 0 });
  const k = 0.85, ny = BY - 190 * BK - 150 * k, x1 = BX + (o.dx ?? 0) + 160, x0 = BX + (o.dx ?? 0) - 20;
  if (S2) { chanXe(ctx, x1, ny - 10, k, "khach"); veNV(ctx, x1, ny - 10, k, { t, kieu: "khach", chan: false, ...S2 }); }
  chanXe(ctx, x0, ny, k, "tuanxe");
  const hx = BX + (o.dx ?? 0) - 125 * BK, hy = BY - 254 * BK;
  veNV(ctx, x0, ny, k, { t, kieu: "tuanxe", chan: false, tayT: { p: [(hx - x0) / k, (hy - ny) / k], cong: -20 }, tayP: { p: [(hx - 20 - x0) / k, (hy + 6 - ny) / k], cong: -30 }, ...S1 });
}
function c78(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tCuoc = m(c, 4), tChi = m(c, 5), tLeo = m(c, 13), tTao = m(c, 23), tTu = m(c, 25), tNgon = m(c, 30);
  if (tl < tChi) {
    ctx.save(); cam(ctx, 760, 600, 1.5);
    const dung = tl >= tCuoc;
    quan(ctx, t, { tuan: !dung, Hi: { mat: "thuong", nhin: [-0.6, 0] }, T: { mat: "ngac", nhin: [0.3, -0.4], tayP: { p: [80, 10], cong: 20, camTren: dt } } });
    if (dung) D.gheNhua(ctx, 600, YG, 0.627, "#e2533f");
    if (dung) veNV(ctx, 600, 640, 0.95, { t, kieu: "tuanxe", mat: "cuoi", nhin: [0.4, -0.3], tayP: { p: [90, -40], cong: 20, camTren: dt } });
    ctx.restore();
    const u = back(vao(tl, tCuoc - 0.3, 0.25)); ctx.save(); ctx.translate(560, 220); ctx.scale(u, u); ve(ctx, rect(-230, -70, 460, 140, 24), "#2f9e57", { w: 6 }); viet(ctx, "CUỐC MỚI!", 0, 22, { size: 70, mau: "#fff", pop: false }); ctx.restore();
    if (u > 0) rung(ctx, 560, 220, 260, 1, GIAY);
  } else if (tl < tLeo) {
    // chị bước ra từ nhà hàng omakase
    ctx.save(); cam(ctx, 1190, 560, 1.55);
    phoDem(ctx, t, { vung: false });
    const u = eout(vao(tl, tChi, 0.6));
    veNV(ctx, 1190, 780 - 222 * 0.9 + lerp(-30, 0, u), 0.9, { t, kieu: "khach", mat: "sang", ngh: -0.06, nhin: [0, 0], tayT: { p: [-100, 100], cong: -20, cam: tui } });
    ctx.restore();
    for (let i = 0; i < 5; i++) { const q = rng(4700 + i); sao(ctx, 760 + q() * 420, 260 + q() * 560, 16 + q() * 14, t + i, i % 2 ? "#ffd76a" : "#ffffff"); }
    viet(ctx, "từ nhà hàng omakase", 1500, 1010, { size: 66, mau: GIAY, u: vao(tl, m(c, 10)) });
  } else if (tl < tTao) {
    // leo lên xe anh Tuấn, áp điện thoại gọi bạn
    giay(ctx, "#363a4f"); ctx.save(); cam(ctx, 1060, 700, 1.3); phoDem(ctx, t, { vung: false });
    const goi = tl >= m(c, 19);
    xeChoKhach(ctx, t, { mat: "thuong", nhin: [-0.5, 0] }, { mat: "sang", noi: goi ? c.noi : 0, nhin: [0.3, 0], tayP: goi ? { p: [96, -100], cong: 26, kieu: "nam", camTren: dt } : { p: [-60, 110], cong: 10 } });
    ctx.restore();
    viet(ctx, "gọi cho bạn", 1560, 200, { size: 80, mau: GIAY, u: vao(tl, m(c, 20)) });
  } else {
    // cận chị: "tao vừa tự thưởng cho mình chút, ngon vãi"
    ctx.save(); cam(ctx, 1150, 520, 1.6); phoDem(ctx, t, { vung: false }); ctx.restore();
    veNV(ctx, 1220, 980, 2.0, { t, kieu: "khach", mat: "sang", noi: c.noi, ngh: -0.06, nhin: [-0.3, 0], chan: false, tayP: { p: [96, -100], cong: 26, kieu: "nam", camTren: dt } });
    if (tl >= tTu) { viet(ctx, "“tự thưởng”", 520, 330, { size: 120, mau: VANG, u: vao(tl, tTu), xoay: -0.05 }); netPts(ctx, [[260, 370], [780, 362]], { w: 7, mau: VANG }); }
    if (tl >= tNgon) viet(ctx, "ngon vãi", 520, 520, { size: 90, mau: GIAY, u: vao(tl, tNgon) });
    if (tl >= tTu + 0.4) { veNV(ctx, 300, 1100, 1.0, { t, kieu: "hieu", mat: "ngac", nhin: [0.7, -0.3], chan: false }); }
  }
}

/* ── 79 (Tuấn): "Đấy. Người giàu thật cũng tự thưởng. Anh sai mẹ nó từ đầu." — quay lại nháy mắt, nổ máy ── */
function c79(ctx, t, uf, c) {
  const tl = c.tl, tTu = m(c, 4), tSai = m(c, 7), tDau = m(c, 10);
  const no = tl >= tDau;
  giay(ctx, "#363a4f"); ctx.save(); cam(ctx, 1080, 700, 1.3); phoDem(ctx, t, { vung: false }); if (no) lac(ctx, tl, tDau, 8, 0.6);
  xeChoKhach(ctx, t, { mat: tl >= tSai ? "deu" : "cuoi", noi: c.noi, nhin: [0.8, 0], ngh: -0.08 }, { mat: "sang", nhin: [0.3, 0], tayP: { p: [96, -100], cong: 26, kieu: "nam", camTren: dt } });
  if (no) for (let i = 0; i < 3; i++) khoi(ctx, BX + 280 + i * 70 + (tl - tDau) * 200, BY - 70 - i * 20, 34 + i * 10, t + i, "#c9ccd6");
  ctx.restore();
  const wB = doRong(ctx, "bỏ chữ “tự thưởng”", 72);
  viet(ctx, "bỏ chữ “tự thưởng”", 1580, 200, { size: 72, mau: GIAY, u: vao(tl, 0.05) });
  if (tl >= tTu) gachCheo(ctx, 1580 - wB / 2 - 10, 190, 1580 + wB / 2 + 10, 170, vao(tl, tTu, 0.35), DO, 12);
  if (tl >= tSai) viet(ctx, "sai từ đầu", 1600, 340, { size: 100, mau: VANG, u: vao(tl, tSai + 0.15), xoay: -0.04 });
}

/* ── 80: anh phóng đi; tôi ngồi lại một mình, trả tiền trà đá cho cả hai; bữa đầu tiên mời được anh Tuấn ── */
function c80(ctx, t, uf, c) {
  const tl = c.tl, tToi = m(c, 3), tTra = m(c, 8), t5 = m(c, 15), tBua = m(c, 19), tMoi = m(c, 25);
  if (tl < tToi) {
    quan(ctx, t, { tuan: false, xe: false, Hi: { mat: "ngac", nhin: [0.8, 0] } }); D.gheNhua(ctx, 600, YG, 0.63);
    const u = eio(clamp(tl / tToi)), dx = lerp(0, 1500, u);
    for (let i = 0; i < 5; i++) netPts(ctx, [[BX + dx - 200 - i * 60, 700 + i * 50], [BX + dx - 600 - i * 60, 700 + i * 50]], { w: 5, mau: "#9aa3c7", seed: 4800 + i });
    xeChoKhach(ctx, t, { mat: "cuoi", nhin: [-0.5, 0] }, { mat: "sang", tayP: { p: [-60, 110], cong: 10 } }, { dx, quay: -tl * 20 });
    for (let i = 0; i < 3; i++) khoi(ctx, BX + dx + 300 + i * 90, BY - 60, 40, t + i, "#c9ccd6");
    viet(ctx, "anh phóng đi", 520, 200, { size: 90, mau: GIAY, u: vao(tl, 0.05) });
    return;
  }
  if (tl < tBua) {
    ctx.save(); cam(ctx, 790, 640, 1.45);
    const tra = tl >= tTra;
    quan(ctx, t, { tuan: false, xe: false, Hi: { mat: "im", nhin: [-0.6, 0.4], tayT: tra ? { p: [-130, 196], cong: -20 } : { p: [-110, 120], cong: -16 } }, tren: (g) => { if (tl >= tTra + 0.3) D.tien(g, 790, YG - 128, 0.34, 10, 0.08); } });
    D.gheNhua(ctx, 600, YG, 0.63);
    ctx.restore();
    if (tl >= t5) viet(ctx, "5 nghìn × 2 cốc", 1450, 170, { size: 80, mau: GIAY, u: vao(tl, t5) });
    viet(ctx, "một mình", 470, 170, { size: 84, mau: GIAY, u: vao(tl, m(c, 6)), xoay: -0.04 });
    return;
  }
  ctx.save(); cam(ctx, 790, 640, 1.6);
  quan(ctx, t, { tuan: false, xe: false, Hi: { mat: "thuong", nhin: [-0.8, 0.2] }, tren: (g) => { D.tien(g, 790, YG - 128, 0.34, 10, 0.08); } });
  D.gheNhua(ctx, 600, YG, 0.63);
  ctx.restore();
  sao(ctx, 560, 430, 26, t); sao(ctx, 1380, 360, 20, t + 2);
  viet(ctx, "lần đầu mời anh Tuấn", 960, 140, { size: 84, mau: GIAY, u: vao(tl, tMoi) });
}

/* ── 81: con nhà người ta = con một nhà khác; cũng nghèo, cũng sợ mẹ buồn — bóng in tường ── */
function tuongDen(ctx) {
  giay(ctx, "#d9b878"); to(ctx, elip(960, 500, 820, 520), "#efd59a");
  for (let r = 0; r < 9; r++) for (let i = 0; i < 9; i++) net(ctx, rect(i * 230 + (r % 2) * 115 - 115, r * 100, 230, 100, 4), { w: 2.5, mau: "#cfae6e", seed: 4900 + r * 10 + i });
  to(ctx, rect(0, 900, W, 180, 0), "#59607a"); netPts(ctx, [[-10, 900], [W + 10, 900]], { w: 6 });
}
function c81(ctx, t, uf, c) {
  const tl = c.tl, tLa = m(c, 9), tCung = m(c, 14), tSo = m(c, 16);
  tuongDen(ctx);
  if (tl < tCung) {
    const u = tl < tLa ? 0 : eio(vao(tl, tLa, 0.6));
    if (u < 1) { ctx.save(); ctx.globalAlpha = 1 - u; thoBong(ctx, (g) => veNV(g, 960, 520, 1.55, { t, kieu: "tuan", mat: "tuhao" })); ctx.restore(); }
    const cy = lerp(225, 900, eio(clamp((tl - tLa) / 0.8))), cr = (tl - tLa > 0 ? (tl - tLa) * 3 : 0);
    thoBong(ctx, (g) => { g.translate(960, cy); g.rotate(cr); g.translate(-960, -cy); vuongMien(g, 960, cy, 1.5); });
    if (u > 0) { ctx.save(); ctx.globalAlpha = u; thoBong(ctx, (g) => veNV(g, 960, 520, 1.55, { t, kieu: "dung", mat: "thuong" })); ctx.restore(); }
    viet(ctx, tl < tLa ? "con nhà người ta" : "con một nhà khác", 960, 1010, { size: 90, mau: GIAY, u: vao(tl, tl < tLa ? 0.05 : tLa) });
  } else {
    const u = eio(vao(tl, tCung, 0.5));
    thoBong(ctx, (g) => veNV(g, lerp(960, 1220, u), lerp(520, 602, u), lerp(1.55, 1.25, u), { t, kieu: "dung", mat: "thuong" }));
    ctx.save(); ctx.globalAlpha = u; thoBong(ctx, (g) => veNV(g, 700, 602, 1.25, { t, kieu: "hieu", mat: "thuong" })); ctx.restore();
    viet(ctx, "cũng nghèo", 960, 140, { size: 96, u: vao(tl, tCung) });
    if (tl >= tSo) viet(ctx, "cũng sợ mẹ buồn", 960, 1010, { size: 84, mau: GIAY, u: vao(tl, tSo) });
  }
}

/* ── 82: về phòng mở sổ khách, gạch hai chữ "sống ảo" ── */
function soMo(ctx, x, y, k) {   // sổ mở nhìn trên bàn
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k * 0.5);
  ve(ctx, "M-200,-90 L0,-80 L0,90 L-200,80 Z", "#fffdf5", { w: 5 }); ve(ctx, "M200,-90 L0,-80 L0,90 L200,80 Z", "#fffdf5", { w: 5 });
  for (let i = 0; i < 5; i++) { netPts(ctx, [[-180, -50 + i * 28], [-30, -46 + i * 28]], { w: 3, mau: "#9aa0ab", seed: 5000 + i }); netPts(ctx, [[30, -46 + i * 28], [180, -50 + i * 28]], { w: 3, mau: "#9aa0ab", seed: 5010 + i }); }
  ctx.restore();
}
function c82(ctx, t, uf, c) {
  const tl = c.tl, tGach = m(c, 6), tSong = m(c, 9), tAo = m(c, 10);
  if (tl < tGach) {
    ctx.save(); cam(ctx, 1110, 520, 1.15); phongDem(ctx, t, { gio: 1, phut: 30 }); toi(ctx, 0.05);
    banLamViec(ctx, t, { mat: "im", nhin: [0, 0.7], tayT: { p: [-100, 130], cong: -16 }, tayP: { p: [100, 130], cong: 16 } }, { thot: false, den: 1, tren: (g) => soMo(g, 1110, 615, 1.3) });
    ctx.restore();
    viet(ctx, "về phòng", 520, 990, { size: 84, mau: GIAY, u: vao(tl, 0.05) });
    return;
  }
  // cận trang sổ, bút đỏ gạch "sống ảo"
  giay(ctx, "#b98058"); for (let i = 0; i < 8; i++) netPts(ctx, [[0, 80 + i * 140], [W, 60 + i * 140]], { w: 3, mau: "#a06c48", seed: 5100 + i });
  ve(ctx, "M300,110 L955,130 L955,1000 L300,980 Z", "#fffdf5", { w: 6 }); ve(ctx, "M1610,110 L965,130 L965,1000 L1610,980 Z", "#fffdf5", { w: 6 });
  to(ctx, rect(945, 130, 30, 870, 0), "#e6e1d2");
  viet(ctx, "SỔ KHÁCH", 630, 230, { size: 72, pop: false, soi: false });
  const w1 = doRong(ctx, "các bảnh ", 66), w2 = doRong(ctx, "sống ảo", 66), x0 = 630 - (w1 + w2) / 2;
  viet(ctx, "các bảnh ", x0, 330, { size: 66, pop: false, can: "left", soi: false }); viet(ctx, "sống ảo", x0 + w1, 330, { size: 66, pop: false, can: "left", soi: false });
  for (let i = 0; i < 6; i++) viet(ctx, `T. · 23:40 · 10k`, 360, 450 + i * 82, { size: 48, mau: "#3a4a8a", pop: false, can: "left", soi: false });
  for (let i = 0; i < 8; i++) viet(ctx, `bảnh ${i + 3} · 10k`, 1020, 260 + i * 86, { size: 48, mau: "#3a4a8a", pop: false, can: "left", soi: false });
  const u1 = vao(tl, tSong, Math.max(0.3, tAo - tSong)), u2 = vao(tl, tAo + 0.05, 0.3), xa = x0 + w1 - 6, xb = x0 + w1 + w2 + 6;
  if (u1 > 0) netPts(ctx, [[xa, 306], [lerp(xa, xb, u1), 300]], { w: 9, mau: DO, seed: 5200 });
  if (u2 > 0) netPts(ctx, [[xa, 322], [lerp(xa, xb, u2), 318]], { w: 9, mau: DO, seed: 5201 });
  const px = u2 > 0 ? lerp(xa, xb, u2) : lerp(xa, xb, u1), py = u2 > 0 ? 318 : 300;
  const a = 1.0, hx = px + Math.cos(a) * 150, hy = py + Math.sin(a) * 150;
  const ong = [[hx + 40, hy - 40], [W + 260, H - 240], [W - 160, H + 260], [hx - 40, hy + 40]];
  toPts(ctx, ong, "#f2b544"); toPts(ctx, [[hx + 10, hy + 10], [W + 60, H + 30], [W - 160, H + 260], [hx - 40, hy + 40]], "#d8952a");
  netPts(ctx, [ong[0], ong[1]], { w: 5, seed: 5310 }); netPts(ctx, [ong[3], ong[2]], { w: 5, seed: 5312 }); netPts(ctx, [[hx - 40, hy + 40], [hx + 40, hy - 40]], { w: 5, seed: 5311 });
  ctx.save(); ctx.translate(px, py); ctx.rotate(a); ve(ctx, rect(18, -9, 170, 18, 6), DO, { w: 4 }); ve(ctx, "M18,-9 L-4,0 L18,9 Z", "#2a2631", { w: 3 }); ctx.restore();
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(a + Math.PI); ctx.scale(2.0, 2.0); banTay(ctx, "nam", 1, 5300); ctx.restore();
}

export const CANH = { 68: c68, 69: c69, 70: c70, 71: c71, 72: c72, 73: c73, 74: c74, 75: c75, 76: c76, 77: c77, 78: c78, 79: c79, 80: c80, 81: c81, 82: c82 };
