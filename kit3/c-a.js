// Nhánh A: cảnh câu 9–34 (cuối chương 2, chương 3 "Anh Tuấn", chương 4 "Hai luật của nghề").
import { W, H, MUC, GIAY, giay, viet, doRong, ve, vePts, net, netPts, to, toPts, bong, elip, rect, moHoi, gan, sao, tiaNhan, rung, vanLanh, dauHoi, khoi,
  T12, clamp, lerp, eio, eout, back, pha, on, rng } from "./but.js";
import { m, mc, vao, cam, lac, chop, toi, muiTen, khoanh, gachCheo, duaDua, avatar, hoa, anhSushi, tayCanh, phongDem, phongNgay, banLamViec, HX, HY, HK, local,
  tamSushi, nhaMe, xeKhach, benXe, threadsCity, manHinhGoi, zalo, threadsBai, thongBaoTien, loRuoc, batCom, loiThoai, D, veNV, banTay, DA } from "./chung.js";

const DO = "#e0392f", XANH = "#2f9e57", VANG = "#ffd23e";
const giua = (tl, a, b) => tl >= a && tl < b;

/* ── đạo cụ riêng nhánh A ── */
function xu(ctx, x, y, r = 30) { ve(ctx, elip(x, y, r, r), "#f2c94c", { w: 4.5 }); net(ctx, elip(x, y, r * 0.66, r * 0.66), { w: 2.5, mau: "#c99a2e" }); }
function lonDat(ctx, x, y, k = 1, o = {}) {   // lợn đất, tâm thân (x,y); o.vo 0..1 vỡ
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.xoay ?? 0); ctx.scale(k, k);
  if ((o.vo ?? 0) > 0) {
    const v = o.vo; const manh = [[-120, -40, -0.6], [-40, -90, 0.3], [70, -70, 0.8], [130, 10, 1.2], [-110, 60, -1.1], [30, 80, 0.5], [-20, 0, 0.1]];
    manh.forEach(([dx, dy, a], i) => { ctx.save(); ctx.translate(dx * (1 + v * 1.6), dy * (1 + v * 1.6) + v * v * 160); ctx.rotate(a * v * 3); ve(ctx, `M-40,-30 L36,-38 L44,26 L-10,40 L-46,10 Z`, i % 2 ? "#f39cb4" : "#e98aa3", { w: 4.5, seed: 700 + i }); ctx.restore(); });
    ctx.restore(); return;
  }
  for (const [lx] of [[-80], [-30], [30], [80]]) ve(ctx, rect(lx - 18, 70, 36, 50, 12), "#e98aa3", { w: 5 });
  ve(ctx, elip(0, 0, 150, 110), "#f39cb4", { w: 6 }); bong(ctx, elip(0, 0, 150, 110), "M-160,40 C-60,80 60,80 160,40 L160,120 L-160,120 Z", "#e07f99");
  ve(ctx, elip(150, 10, 40, 34), "#f7b2c4", { w: 5 }); to(ctx, elip(140, 6, 6, 9), MUC); to(ctx, elip(160, 6, 6, 9), MUC);
  ve(ctx, "M-70,-96 L-40,-140 L-20,-100 Z", "#f39cb4", { w: 4.5 }); ve(ctx, "M20,-104 L50,-146 L64,-96 Z", "#f39cb4", { w: 4.5 });
  to(ctx, elip(70, -20, 10, 13), MUC); to(ctx, elip(74, -24, 3.5, 4), "#fff"); ve(ctx, rect(-40, -112, 70, 12, 6), "#7a3d4e", { w: 3 });
  net(ctx, "M-150,-10 C-180,-30 -190,10 -170,20 C-160,26 -150,14 -160,4", { w: 4.5 });
  ctx.restore();
}
function thiep(ctx, x, y, k = 1, xoay = 0) {   // thiệp cưới đỏ chữ vàng
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, rect(-110, -76, 220, 152, 10), "#d9342b", { w: 5 }); net(ctx, rect(-96, -62, 192, 124, 6), { w: 3, mau: "#f4c430" });
  ve(ctx, "M0,-16 C-10,-36 -40,-30 -36,-8 C-32,10 -6,22 0,34 C6,22 32,10 36,-8 C40,-30 10,-36 0,-16 Z", "#f4c430", { w: 3.5 });
  viet(ctx, "Thiệp cưới", 0, 62, { size: 26, mau: "#ffe7a0", pop: false, soi: false });
  ctx.restore();
}
function bao(ctx, x, y, k, xoay, tieuDe, ve2) {   // tờ báo cầm trên tay
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, rect(-260, -180, 520, 360, 6), "#f4f1e6", { w: 5.5 }); netPts(ctx, [[0, -170], [0, 170]], { w: 2.5, mau: "#c8c2b2" });
  viet(ctx, "BÁO SÁNG", -130, -130, { size: 40, pop: false, soi: false });
  viet(ctx, tieuDe, 0, -76, { size: 46, mau: DO, pop: false, soi: false });
  for (let i = 0; i < 5; i++) { to(ctx, rect(-236, -30 + i * 30, 200, 9, 4), "#cfc8b6"); to(ctx, rect(30, 70 + i * 22, 200, 9, 4), "#cfc8b6"); }
  if (ve2) ve2(ctx);
  ctx.restore();
}
function cvGiay(ctx, x, y, k = 1, xoay = 0, o = {}) {   // tờ CV, ảnh thẻ là mặt Hiếu nếu o.hieu
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, rect(-110, -150, 220, 300, 6), "#ffffff", { w: 5 }); viet(ctx, "CV", 50, -96, { size: 50, pop: false, soi: false, mau: "#2f5fae" });
  ve(ctx, rect(-90, -130, 76, 92, 4), "#e9eef5", { w: 3.5 });
  if (o.hieu) { ctx.save(); ctx.beginPath(); ctx.rect(-90, -130, 76, 92); ctx.clip(); veNV(ctx, -52, -40, 0.28, { kieu: "hieu", mat: o.mat ?? "buon", chan: false }); ctx.restore(); } else avatar(ctx, -52, -84, 30, o.seed ?? 3);
  for (let i = 0; i < 6; i++) to(ctx, rect(-90, -10 + i * 24, i % 2 ? 140 : 180, 9, 4), "#cfd6e2");
  ctx.restore();
}
function khi(ctx, x, y, k, t) {   // con khỉ ló ra cười
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  for (const s of [-1, 1]) { ve(ctx, elip(s * 96, -10, 34, 34), "#a86e45", { w: 5 }); to(ctx, elip(s * 96, -10, 18, 18), "#f2c9a0"); }
  ve(ctx, elip(0, 0, 100, 92), "#a86e45", { w: 6 }); ve(ctx, "M-70,10 C-74,-40 -10,-50 0,-20 C10,-50 74,-40 70,10 C70,70 -70,70 -70,10 Z", "#f2c9a0", { w: 4.5 });
  for (const s of [-1, 1]) net(ctx, `M${s * 40 - 14},-6 C${s * 40 - 8},-18 ${s * 40 + 8},-18 ${s * 40 + 14},-6`, { w: 6 });
  ve(ctx, "M-36,24 C-30,64 30,64 36,24 C14,30 -14,30 -36,24 Z", "#8b3a3a", { w: 4.5 });
  ctx.restore();
}
function bieuDo(ctx, x, y, cot, o = {}) {   // biểu đồ cột vẽ tay: cot = [[nhãn, giá trị 0..1, màu, u]]
  netPts(ctx, [[x, y - (o.cao ?? 360) - 20], [x, y], [x + (o.rong ?? 420), y]], { w: 6, seed: 720 });
  cot.forEach(([nhan, v, mau, u], i) => {
    const cx = x + 60 + i * 180, h = (o.cao ?? 360) * v * eout(u ?? 1); if (h > 2) ve(ctx, rect(cx, y - h, 110, h, 6), mau, { w: 5, seed: 730 + i });
    viet(ctx, nhan, cx + 55, y + 60, { size: 40, pop: false });
  });
}
function loa(ctx, x, y, k = 1, xoay = 0) {   // loa cầm tay
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, "M0,-30 L120,-80 L120,80 L0,30 Z", "#f2f2f0", { w: 5.5 }); ve(ctx, elip(120, 0, 22, 80), "#e2453c", { w: 5 }); ve(ctx, rect(-40, -26, 44, 52, 8), "#e2453c", { w: 5 }); ve(ctx, rect(-20, 24, 20, 50, 6), "#5a5f6e", { w: 4 });
  ctx.restore();
}
function moGo(ctx, x, y, k = 1, go = 0) {   // mõ gỗ + dùi
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-80,40 C-110,-40 -40,-80 20,-70 C90,-60 110,0 80,40 Z", "#b5652f", { w: 5.5 }); net(ctx, "M-60,10 C-20,24 30,24 70,10", { w: 4 }); to(ctx, elip(0, -20, 40, 10), "#7a3d22");
  ctx.save(); ctx.translate(60, -90 + go * 40); ctx.rotate(-0.7 + go * 0.4); ve(ctx, rect(-6, -10, 12, 110, 6), "#c99a5a", { w: 4 }); ve(ctx, elip(0, -14, 20, 20), "#c99a5a", { w: 4 }); ctx.restore();
  ctx.restore();
}
function vuongMien(ctx, x, y, k = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ve(ctx, "M-70,30 L-80,-40 L-40,0 L0,-60 L40,0 L80,-40 L70,30 Z", VANG, { w: 5 }); for (const [a, b] of [[-80, -40], [0, -60], [80, -40]]) to(ctx, elip(a, b, 10, 10), DO); ctx.restore(); }
function iconApp(ctx, x, y, s, loai) {   // ô biểu tượng app vẽ tay: "in" xanh | "@" đen
  ve(ctx, rect(x - s / 2, y - s / 2, s, s, s * 0.22), loai === "in" ? "#2f6fb5" : "#1b1b20", { w: 6 });
  if (loai === "in") { viet(ctx, "in", x, y + s * 0.2, { size: s * 0.62, mau: "#fff", pop: false, dam: 0.06 }); return; }
  const r = s * 0.26; net(ctx, elip(x, y, r * 0.42, r * 0.5), { w: Math.max(4, s * 0.06), mau: "#fff" });   // biểu tượng kiểu "@" vẽ tay
  const pts = []; for (let i = 0; i <= 30; i++) { const a = 0.2 + (i / 30) * Math.PI * 1.75; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r * 1.05]); } pts.push([x + r * 0.42, y + r * 0.6]); netPts(ctx, pts, { w: Math.max(4, s * 0.07), mau: "#fff" });
}
function bang(ctx, x, y, k, so, dong) {   // bia đá ghi luật
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-200,240 L-200,-170 C-200,-250 -120,-280 0,-280 C120,-280 200,-250 200,-170 L200,240 Z", "#c9c4b8", { w: 7 }); bong(ctx, "M-200,240 L-200,-170 C-200,-250 -120,-280 0,-280 C120,-280 200,-250 200,-170 L200,240 Z", "M120,-300 L240,-300 L240,260 L120,260 Z", "#b1ab9e");
  for (const [a, b, c2] of [[-150, 100, 0.2], [100, -120, -0.5], [-60, 180, 0.6]]) net(ctx, `M${a},${b} L${a + 30},${b + 20 * c2} L${a + 50},${b + 10}`, { w: 3, mau: "#8f897d" });
  viet(ctx, so, 0, -140, { size: 130, mau: "#5a5448", pop: false, dam: 0.06 });
  dong.forEach((d, i) => viet(ctx, d, 0, 0 + i * 70, { size: 58, mau: "#3a352d", pop: false }));
  ctx.restore();
}
function kinhLup(ctx, x, y, k = 1, xoay = -0.6) { ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k); ve(ctx, rect(-12, 60, 24, 120, 10), "#6b4a34", { w: 5 }); ve(ctx, elip(0, 0, 70, 70), "rgba(200,232,248,0.45)", { w: 9, mau: "#3a3d4c" }); net(ctx, "M-30,-36 C-16,-46 0,-48 14,-44", { w: 5, mau: "#fff" }); ctx.restore(); }
function tayNu(ctx, x, y, k, seed, t) {   // bàn tay con gái móng đính đá (chĩa lên)
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, rect(-40, 40, 80, 120, 20), "#f7d3e0", { w: 5 });
  for (let i = 0; i < 4; i++) { const fx = -36 + i * 24, fh = [70, 90, 84, 62][i]; ve(ctx, rect(fx - 10, -fh + 40, 22, fh + 10, 11), DA, { w: 4, seed: seed + i }); ve(ctx, rect(fx - 8, -fh + 40, 18, 22, 8), ["#ff5fa2", "#c86bfa", "#ff5fa2", "#4fd1ff"][(i + seed) % 4], { w: 3 }); to(ctx, elip(fx + 1, -fh + 50, 3.5, 3.5), "#fff"); }
  ve(ctx, "M-40,30 C-40,90 40,100 50,40 L40,20 L-40,20 Z", DA, { w: 5 });
  ve(ctx, rect(36, 0, 22, 56, 11), DA, { w: 4 });
  ctx.restore();
  sao(ctx, x + 10 * k, y - 80 * k, 14 * k, t + seed);
}
function tayNam(ctx, x, y, k, t) {   // bàn tay đàn ông thô, đeo nhẫn bạc (chĩa lên)
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, rect(-54, 40, 108, 130, 16), "#f2b544", { w: 5.5 }); bong(ctx, rect(-54, 40, 108, 130, 16), rect(20, 30, 60, 160), "#d8952a");
  for (let i = 0; i < 4; i++) { const fx = -42 + i * 28, fh = [62, 76, 72, 56][i]; ve(ctx, rect(fx - 14, -fh + 30, 30, fh + 16, 14), "#efc9a8", { w: 5, seed: 760 + i }); net(ctx, `M${fx - 6},${-fh + 60} C${fx},${-fh + 56} ${fx + 6},${-fh + 58} ${fx + 10},${-fh + 62}`, { w: 2.5 }); }
  ve(ctx, "M-54,20 C-58,90 50,100 60,30 L54,10 L-54,10 Z", "#efc9a8", { w: 5.5 }); ve(ctx, rect(50, -10, 30, 60, 14), "#efc9a8", { w: 5 });
  ctx.save(); ctx.translate(30, 2); ve(ctx, rect(-17, -8, 34, 18, 6), "#dfe6ee", { w: 4.5 }); to(ctx, rect(-10, -4, 12, 6, 3), "#fff"); ctx.restore();
  ctx.restore();
  sao(ctx, x + 30 * k + 20, y - 10 * k, 26, t);
}
function gheMatXa(ctx, x, y, k = 1) {   // ghế mát xa đen bóng, gốc chân
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-260,0 L-200,-120 L200,-120 L280,0 Z", "#3b3f55", { w: 6 });
  ve(ctx, "M-240,-120 C-260,-260 -200,-420 -120,-460 L-40,-460 C-40,-300 -60,-200 -40,-120 Z", "#4a4f6a", { w: 6 });
  ve(ctx, rect(-60, -200, 340, 90, 40), "#4a4f6a", { w: 6 }); ve(ctx, rect(-80, -260, 300, 60, 28), "#5b627f", { w: 5 });
  for (let i = 0; i < 4; i++) to(ctx, elip(-140, -400 + i * 70, 14, 14), "#7c84a6");
  ctx.restore();
}
function tivi(ctx, x, y, w, h, t, i) { ve(ctx, rect(x, y, w, h, 8), "#22242e", { w: 5 }); to(ctx, rect(x + 10, y + 10, w - 20, h - 20, 4), ["#7ecbe8", "#f3a6c8", "#a6d58a", "#ffd76a"][(i + Math.floor(t * 1.5)) % 4]); sao(ctx, x + w * 0.7, y + h * 0.4, 14, t + i, "#fff"); }
function soKhach(ctx, x, y, k, tl, o = {}) {   // sổ khách mở, hai trang
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-420,-260 L0,-230 L420,-260 L420,260 L0,290 L-420,260 Z", "#fffdf2", { w: 6 }); netPts(ctx, [[0, -230], [0, 290]], { w: 4 });
  for (let i = 0; i < 9; i++) { netPts(ctx, [[-400, -180 + i * 52], [-20, -170 + i * 52]], { w: 2, mau: "#bfd3e6", seed: 800 + i }); netPts(ctx, [[20, -170 + i * 52], [400, -180 + i * 52]], { w: 2, mau: "#bfd3e6", seed: 820 + i }); }
  viet(ctx, "SỔ KHÁCH", -210, -200, { size: 52, pop: false, soi: false, mau: "#2f5fae" });
  ["Hùng 0906…", "Ngân 0912…", "Tú 0388…", "T. 23:40", "Vy 0977…"].forEach((s, i) => viet(ctx, s, -380, -116 + i * 60, { size: 40, pop: false, can: "left", soi: false }));
  if (o.chu) viet(ctx, o.chu, 210, -40, { size: 64, mau: DO, u: o.u ?? 1, xoay: -0.06 });
  if (o.gach) gachCheo(ctx, 80, -60, 350, -60, o.gach, DO, 10);
  ctx.restore();
}
function kinhDen(ctx, x, y, k = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); for (const s of [-1, 1]) ve(ctx, rect(s * 42 - 32, -18, 64, 40, 14), "#1b1b22", { w: 4.5 }); netPts(ctx, [[-12, -6], [12, -6]], { w: 5 }); net(ctx, "M-64,-8 C-60,-14 -50,-16 -40,-14", { w: 3, mau: "#fff" }); ctx.restore(); }
function congChua(ctx, x, y, k = 1) {   // cổng tam quan, gốc chân giữa
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  for (const s of [-1, 1]) { ve(ctx, rect(s * 260 - 40, -420, 80, 420, 6), "#e8d6a8", { w: 6 }); ve(ctx, "M" + (s * 260 - 90) + ",-420 L" + (s * 260 + 90) + ",-420 C" + (s * 260 + 110) + ",-440 " + (s * 260 + 130) + ",-470 " + (s * 260 + 140) + ",-480 L" + (s * 260 - 140) + ",-480 C" + (s * 260 - 130) + ",-470 " + (s * 260 - 110) + ",-440 " + (s * 260 - 90) + ",-420 Z", "#b5452f", { w: 5 }); }
  ve(ctx, rect(-160, -560, 320, 460, 6), "#e8d6a8", { w: 6 }); ve(ctx, rect(-110, -360, 220, 360, 100), "#5a3a2a", { w: 5 });
  ve(ctx, "M-240,-560 L240,-560 C270,-590 300,-620 320,-640 L-320,-640 C-300,-620 -270,-590 -240,-560 Z", "#b5452f", { w: 6 });
  ve(ctx, rect(-110, -520, 220, 70, 6), "#3f6f4f", { w: 4.5 }); viet(ctx, "CHÙA", 0, -468, { size: 50, mau: "#f4c430", pop: false, soi: false });
  ctx.restore();
}
function nhanTo(ctx, x, y, k, t) {   // chiếc nhẫn bạc phóng to, khắc chữ Nhẫn
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, elip(0, 0, 220, 130), "#dfe6ee", { w: 7 }); to(ctx, elip(0, -18, 170, 86), GIAY); net(ctx, elip(0, -18, 170, 86), { w: 5 });
  bong(ctx, elip(0, 0, 220, 130), "M-240,60 C-100,120 100,120 240,60 L240,140 L-240,140 Z", "#b9c2ce");
  viet(ctx, "Nhẫn", 0, 112, { size: 60, mau: "#5a6472", pop: false, soi: false });
  ctx.restore(); sao(ctx, x + 180 * k, y - 90 * k, 40, t); sao(ctx, x - 200 * k, y + 20 * k, 26, t + 1);
}
function denGT(ctx, x, y, k, sang) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ve(ctx, rect(-50, -150, 100, 300, 20), "#33364a", { w: 5 }); ["#e5484d", "#ffd23e", "#30c46b"].forEach((c2, i) => ve(ctx, elip(0, -90 + i * 90, 34, 34), sang === i ? c2 : "#5a5d6e", { w: 4 })); ctx.restore(); }
function soLL(ctx, x, y, k, mo, diem, xoay = 0) {   // sổ liên lạc
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  if (!mo) { ve(ctx, rect(-110, -150, 220, 300, 8), "#3f7fd0", { w: 5.5 }); viet(ctx, "SỔ", 0, -60, { size: 50, mau: "#fff", pop: false, soi: false }); viet(ctx, "LIÊN LẠC", 0, -10, { size: 34, mau: "#fff", pop: false, soi: false }); }
  else { ve(ctx, "M-240,-150 L0,-130 L240,-150 L240,150 L0,170 L-240,150 Z", "#fffdf2", { w: 5.5 }); netPts(ctx, [[0, -130], [0, 170]], { w: 3 }); viet(ctx, "Toán", -120, -60, { size: 44, pop: false, soi: false }); viet(ctx, diem, 120, 60, { size: 200, mau: DO, pop: false, dam: 0.06 }); khoanh(ctx, 120, 0, 90, 100, 1, DO, 7); }
  ctx.restore();
}
function canhSuoi(ctx, x, y, k = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); for (let i = 0; i < 4; i++) { ctx.save(); ctx.rotate(-0.8 + i * 0.5); ve(ctx, "M0,0 C30,-40 30,-120 0,-150 C-30,-120 -30,-40 0,0 Z", ["#ffd76a", "#ffb3c7", "#a9dcf5", "#b9e3a0"][i], { w: 4 }); ctx.restore(); } ve(ctx, rect(-8, 0, 16, 90, 6), "#9c6a44", { w: 4 }); ctx.restore(); }

/* ── CÂU 9: < một nửa Gen Z tiết kiệm đủ 3 tháng — tôi 3 ngày — với điều kiện không đứa nào cưới ── */
function c9(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tToi = m(c, 15), tBa = m(c, 19), tVoi = m(c, 21), tCuoi = m(c, 29);
  if (tl < tToi) {
    giay(ctx);
    veNV(ctx, 960, 520, 1.1, { t, mat: tl > m(c, 13) ? "ngac" : "thuong", nhin: [0, 0.6], tayT: { p: [-190, 150], cong: -20, sau: true }, tayP: { p: [190, 150], cong: 20, sau: true } });
    bao(ctx, 960, 790, 1.25, -0.03, "< 50% GEN Z", (g) => {
      ve(g, elip(130, -10, 70, 70), "#e9eef5", { w: 4 }); ve(g, "M130,-10 L130,-80 C170,-80 200,-50 200,-10 C200,30 170,60 130,60 Z", DO, { w: 4 });
      viet(g, "đủ 3 tháng", -130, 150, { size: 40, pop: false, soi: false });
    });
    for (const s2 of [-1, 1]) { ctx.save(); ctx.translate(960 + s2 * 318, 700); ctx.rotate(s2 > 0 ? Math.PI : 0); ctx.scale(1.1, 1.1); banTay(ctx, "nam", 1, 90 + s2); ctx.restore(); }
    if (tl > m(c, 13)) viet(ctx, "tiết kiệm đủ 3 tháng", W / 2, 150, { size: 76, u: vao(tl, m(c, 10)) });
  } else if (tl < tVoi) {
    giay(ctx, "#fdf3e7"); to(ctx, rect(0, 860, W, 220, 0), "#ead8bf"); netPts(ctx, [[-10, 860], [W + 10, 860]], { w: 6 });
    const lac2 = Math.sin(tq * 30) * 0.25, px = 980 + Math.sin(tq * 30) * 16, py = 400;
    veNV(ctx, 760, 620, 1.15, { t, mat: tl >= tBa ? "buon" : "nham", nhin: [0.6, -0.4], tayP: { p: [(px - 40 - 760) / 1.15, (py + 30 - 620) / 1.15], cong: 30, kieu: "nam" } });
    lonDat(ctx, px, py, 0.62, { xoay: Math.PI + lac2 });
    const n = tl < tBa ? 0 : Math.min(3, 1 + Math.floor((tl - tBa) / 0.18));
    for (let i = 0; i < n; i++) xu(ctx, 1000 + i * 56, 850, 24);
    for (let i = 0; i < 3; i++) if (tl >= tBa - 0.3 && i >= n) { const u = clamp((tl - tBa + 0.3 - i * 0.18) / 0.3); if (u > 0 && u < 1) xu(ctx, 990, lerp(470, 840, u), 22); }
    viet(ctx, "3 ngày", 1480, 340, { size: 130, mau: DO, u: vao(tl, tBa), xoay: 0.06 });
    if (tl < tBa) viet(ctx, "lắc lắc…", 1450, 300, { size: 70, u: vao(tl, tToi + 0.3) });
  } else {
    giay(ctx, "#fdf3e7");
    const vo = clamp((tl - tCuoi - 0.1) / 0.5);
    veNV(ctx, 600, 620, 1.1, { t, mat: vo > 0 ? "soc" : "thuong", nhin: [0.8, 0], tayT: { p: [-80, 130], cong: -20 }, tayP: { p: [120, 60], cong: 20, kieu: "xoe" } });
    if (vo > 0) { moHoi(ctx, 720, 300, 1.1); lac(ctx, tl, tCuoi + 0.1, 18, 0.4); }
    lonDat(ctx, 1150, 720, 0.75, { vo });
    if (vo < 0.6 && vo > 0) tiaNhan(ctx, 1150, 720, 90, 170, 9, { a0: -Math.PI / 2, goc: 0.7, w: 7, mau: DO });
    for (let i = 0; i < 4; i++) { const u = clamp((tl - tVoi - 0.5 - i * 0.35) / 0.7), tx = lerp(2100, 1180 + (i - 1.5) * 60, eio(u)), ty = lerp(560 - i * 40, 640 - i * 18, eio(u)); if (u > 0) thiep(ctx, tx, ty, 0.8, lerp(-1, (i - 1.5) * 0.25, u)); }
    viet(ctx, "với điều kiện…", 960, 110, { size: 70, mau: "#6b6560", u: vao(tl, tVoi) });
    viet(ctx, "tháng đấy", 1440, 220, { size: 70, u: vao(tl, m(c, 24)) });
    viet(ctx, "không đứa nào cưới", 1440, 320, { size: 70, u: vao(tl, m(c, 26)) });
  }
}
/* ── CÂU 10: nhảy việc? nhảy cái con khỉ — việc cho người mới -37% — nghỉ là thành cái CV ── */
function c10(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tKhi = m(c, 5), tNam = m(c, 9), tToi = m(c, 22), tThanh = m(c, 26), tNam2 = m(c, 29);
  if (tl < tNam) {
    giay(ctx);
    ve(ctx, rect(1300, 260, 320, 560, 8), "#7fbf8f", { w: 6 }); ve(ctx, rect(1330, 290, 260, 500, 6), "#a9dcb4", { w: 4 }); to(ctx, elip(1560, 560, 12, 12), MUC);
    ve(ctx, rect(1330, 160, 260, 80, 8), "#2f9e57", { w: 5 }); viet(ctx, "VIỆC MỚI →", 1460, 216, { size: 46, mau: "#fff", pop: false });
    const nhun = tl < tKhi ? 0 : (Math.floor(tq * 8) % 2 ? 14 : 0);
    veNV(ctx, 820, 600, 1.15, { t, mat: tl < tKhi ? "thuong" : "nham", co: tl < tKhi ? 1 : 0.86, nhun, nhin: [0.8, 0], tayT: { p: [-150, 60], cong: -20 }, tayP: { p: [150, 60], cong: 20 } });
    if (tl < tKhi) { dauHoi(ctx, 1060, 280, 150, vao(tl, 0.1)); viet(ctx, "nhảy việc?", 600, 220, { size: 84, u: vao(tl, m(c, 3)) }); }
    else { const u = eout(vao(tl, tKhi, 0.3)); khi(ctx, 1200, lerp(1300, 760, u), 1.1, t); viet(ctx, "nhảy cái con khỉ!", 560, 230, { size: 84, mau: DO, u: vao(tl, m(c, 7)) }); if (u >= 1) tiaNhan(ctx, 1200, 660, 130, 180, 7, { a0: -Math.PI / 2, goc: 0.45, w: 5 }); }
  } else if (tl < tToi) {
    giay(ctx);
    bieuDo(ctx, 620, 860, [["2023", 1, "#7ecbe8", 1], ["2024", 0.63, DO, vao(tl, m(c, 17), 0.6)]], { cao: 480, rong: 520 });
    if (tl >= m(c, 21)) { viet(ctx, "−37%", 1340, 560, { size: 160, mau: DO, u: vao(tl, m(c, 21)), xoay: -0.05 }); muiTen(ctx, 1000, 420, 1000, 580, vao(tl, m(c, 21), 0.3), DO); }
    viet(ctx, "việc cho người mới ra trường", W / 2, 150, { size: 72, u: vao(tl, m(c, 11)) });
    veNV(ctx, 1600, 800, 0.8, { t, mat: "hoang", chan: false, nhin: [-0.7, 0] }); moHoi(ctx, 1690, 610, 0.9);
  } else {
    giay(ctx, "#eef1f6");
    D.ban(ctx, 960, 760, 1300, 300);
    for (let i = 0; i < 14; i++) { const q = rng(840 + i); cvGiay(ctx, 520 + q() * 240, 700 - i * 14, 0.9, (q() - 0.5) * 0.3, { seed: 850 + i }); }
    for (let i = 0; i < 10; i++) { const q = rng(870 + i); cvGiay(ctx, 1400 + q() * 200, 700 - i * 14, 0.9, (q() - 0.5) * 0.3, { seed: 880 + i }); }
    if (tl < tThanh) {   // Hiếu nhảy lên rồi rơi tõm
      const u = (tl - tToi) / (tThanh - tToi), y = 600 - Math.sin(u * Math.PI) * 360;
      veNV(ctx, 960, y, 1.0, { t, mat: u < 0.5 ? "cuoi" : "hoang", tayT: { p: [-150, -120], cong: -20, kieu: "xoe" }, tayP: { p: [150, -120], cong: 20, kieu: "xoe", lat: -1 } });
      viet(ctx, "tôi mà nghỉ…", 1540, 200, { size: 80, u: vao(tl, tToi) });
    } else {
      const u = eout(vao(tl, tThanh, 0.35));
      cvGiay(ctx, 960, lerp(400, 640, u), lerp(1.6, 1.25, u), lerp(-0.6, 0.05, u), { hieu: true, mat: "khoc" });
      if (tl >= tNam2) { const a = vao(tl, tNam2, 0.4); ve(ctx, "M1100,560 L1200,560 L1190,680 L1110,680 Z", "#ffffff", { w: 5 }); net(ctx, "M1200,590 C1240,590 1240,640 1196,644", { w: 5 }); ctx.save(); ctx.globalAlpha = a; to(ctx, elip(1150, 694, 60, 12), "rgba(120,80,50,0.4)"); ctx.restore(); }
      viet(ctx, "= cái CV", 1500, 260, { size: 110, mau: DO, u: vao(tl, m(c, 28)), xoay: 0.05 });
      if (tl >= m(c, 31)) viet(ctx, "trên bàn đứa khác", 1500, 380, { size: 64, u: vao(tl, m(c, 31)) });
      if (u >= 1 && tl < tThanh + 0.6) tiaNhan(ctx, 960, 640, 230, 290, 10, { a0: -Math.PI / 2, goc: 0.6, w: 6 });
    }
  }
}
/* ── CÂU 11: thứ không phải tính tiền là ruốc — mẹ gửi xe khách — cận lọ ── */
function c11(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tRuoc = m(c, 11), tThang = m(c, 12), tLo = m(c, 22), tNap = m(c, 26), tDan = m(c, 29), tChu = m(c, 32);
  if (tl < tThang) {
    giay(ctx);
    const gia = [["phở", "45k", (g, x) => D.batPho(g, x, 560, 0.9, t)], ["trà đá", "5k", (g, x) => D.traDa(g, x, 590, 1.2)], ["gửi xe", "5k", (g, x) => D.veXe(g, x, 560, 1.1)], ["tiền trọ", "5tr", (g, x) => { ve(g, rect(x - 80, 480, 160, 140, 6), "#e8e2f3", { w: 5 }); ve(g, `M${x - 100},490 L${x},420 L${x + 100},490 Z`, "#c9573f", { w: 5 }); }]];
    gia.forEach(([ten, so, f], i) => { const x = 220 + i * 330; f(ctx, x); ve(ctx, rect(x - 70, 680, 140, 64, 10), "#fff4d6", { w: 4.5 }); viet(ctx, so, x, 728, { size: 46, mau: DO, pop: false }); });
    const u = vao(tl, tRuoc - 0.1, 0.3);
    if (u > 0) { ctx.save(); ctx.translate(1600, 640); ctx.scale(back(u), back(u)); loRuoc(ctx, 0, 0, 1.0); ctx.restore(); ve(ctx, rect(1530, 680, 140, 64, 10), "#d9f2dc", { w: 4.5 }); viet(ctx, "0đ", 1600, 728, { size: 50, mau: XANH, pop: false }); for (let i = 0; i < 4; i++) sao(ctx, 1600 + Math.cos(i * 1.6 + t) * 170, 470 + Math.sin(i * 1.6 + t) * 140, 24, t + i); }
    viet(ctx, "không phải tính tiền:", W / 2, 180, { size: 76, u: vao(tl, m(c, 6)) });
  } else if (tl < tLo) {
    // bến xe quê: mẹ gửi lọ cho phụ xe
    benXe(ctx, t, { xeX: 1300, ten: "BẾN XE HUYỆN" });
    const giao = tl > m(c, 16);
    veNV(ctx, 560, 640, 1.05, { t, kieu: "me", mat: "cuoi", nhin: [0.8, 0], tayP: { p: [170, 30], cong: 20, kieu: "nam" } });
    veNV(ctx, 900, 640, 1.05, { t, kieu: "phuxe", mat: "thuong", nhin: [-0.8, 0], tayT: { p: [-150, 30], cong: -20, kieu: "xoe", lat: -1 } });
    loRuoc(ctx, giao ? 740 : 712, 700, 0.42);
    viet(ctx, "tháng nào cũng gửi", 1300, 140, { size: 70, u: vao(tl, tThang + 0.1) });
  } else {
    giay(ctx, "#fff7ea");
    const z = lerp(1.6, 2.0, eio((tl - tLo) / (c.dur - tLo)));
    loRuoc(ctx, 960, 980, z);
    const tem = [[tLo, "lọ cà phê cũ", 1500, 300, 1200, 520], [tNap, "nắp buộc chun", 520, 210, 820, 400], [tDan, "dán băng dính", 1520, 760, 1170, 680]];
    for (const [t0, s, x, y, ax, ay] of tem) if (tl >= t0 && tl < tChu) { viet(ctx, s, x, y, { size: 70, u: vao(tl, t0) }); muiTen(ctx, x - 40 * Math.sign(x - 960), y + 30, ax, ay, vao(tl, t0 + 0.1, 0.3)); }
    if (tl >= tChu) { khoanh(ctx, 960, 980 - 138 * z - 12, 260, 90, vao(tl, tChu, 0.5), DO, 9); viet(ctx, "chữ mẹ", 520, 520, { size: 90, mau: DO, u: vao(tl, tChu), xoay: -0.06 }); }
  }
}
function docLo(ctx, t, tl, X, u) {   // Hiếu ngửa cổ dốc lọ ruốc vào mồm (u: 0 cầm lọ → 1 dốc hẳn)
  const a = lerp(-0.3, -2.1, u), kL = 0.5, lid = [lerp(X + 170, X + 62, u), lerp(560, 548, u)];
  const ox = lid[0] - Math.sin(a) * 300 * kL, oy = lid[1] + Math.cos(a) * 300 * kL, hx = ox + Math.sin(a) * 150 * kL, hy = oy - Math.cos(a) * 150 * kL;
  veNV(ctx, X, 600, 1.2, { t, mat: u > 0.6 ? "ngac" : "thuong", nhin: [0.2, -0.6], tayP: { p: [(hx - X) / 1.2, (hy - 600) / 1.2], cong: 30, kieu: "nam", sau: true } });
  ctx.save(); ctx.translate(ox, oy); ctx.rotate(a); loRuoc(ctx, 0, 0, kL); ctx.restore();
  if (u > 0.9) for (let i = 0; i < 10; i++) { const q = rng(900 + i), v = ((tl * 2.5 + q()) % 1); to(ctx, elip(lerp(X + 58, X + 6, v) + (q() - 0.5) * 12, lerp(552, 556, v) + Math.sin(v * 3) * 6, 7, 4), "#c98d4e"); }
}
/* ── CÂU 12: mẹ viết hướng dẫn sử dụng — như kiểu sợ con tu một hơi hết lọ — có hôm suýt ── */
function c12(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tNhu = m(c, 9), tTu = m(c, 17), tMa = m(c, 22), tSuyt = m(c, 27);
  if (tl < tNhu) {
    giay(ctx, "#fff7ea");
    loRuoc(ctx, 620, 900, 1.6);
    const u = eout(vao(tl, 0.3, 0.8));
    ve(ctx, `M1000,180 L1560,200 L1560,${200 + 640 * u} L1000,${180 + 640 * u} Z`, "#fffdf5", { w: 5 });
    if (u > 0.25) viet(ctx, "HƯỚNG DẪN SỬ DỤNG", 1280, 270, { size: 50, mau: "#2f5fae", pop: false });
    ["1. Ăn dần.", "2. Ăn dần.", "3. Vẫn ăn dần."].forEach((s, i) => { if (u > 0.4 + i * 0.18) viet(ctx, s, 1060, 400 + i * 120, { size: 64, pop: false, can: "left" }); });
  } else if (tl < tMa) {
    phongDem(ctx, t, { gio: 22 });
    docLo(ctx, t, tl, 960, eio(vao(tl, tNhu, 0.5)));
    viet(ctx, "tu một hơi", 1480, 690, { size: 90, mau: DO, u: vao(tl, tTu), xoay: 0.05 });
  } else {
    phongDem(ctx, t, { gio: 22 });
    const dung = tl >= tSuyt - 0.3;
    if (!dung) docLo(ctx, t, tl, 900, 1);
    else veNV(ctx, 900, 600, 1.2, { t, mat: "hoang", nhin: [0.8, 0.2], tayP: { p: [190, 40], cong: 30, kieu: "nam" } });
    if (dung) { loRuoc(ctx, 900 + 190 * 1.2 + 30, 600 + 40 * 1.2 + 120, 0.75); moHoi(ctx, 1030, 330, 1.1); moHoi(ctx, 760, 360, 0.8, -0.3); khoanh(ctx, 900 + 190 * 1.2 + 30, 600 + 40 * 1.2 + 120 - 104, 100, 44, vao(tl, tSuyt - 0.2, 0.4), DO, 6); viet(ctx, "…suýt", 1500, 300, { size: 110, u: vao(tl, tSuyt) }); }
    else viet(ctx, "nói thật…", 1500, 300, { size: 80, u: vao(tl, m(c, 23)) });
  }
}
/* ── CÂU 13: "cũng được" — mẹ soi phông bạt từ trước Threads — lớp 5: 9 điểm? tai đỏ → 4 điểm ── */
function c13(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tNhung = m(c, 7), tHoi = m(c, 18), t9 = m(c, 24), tDeo = m(c, 28), tNhin = m(c, 32), tTai = m(c, 35), t4 = m(c, 37);
  if (tl < tNhung) {
    phongNgay(ctx, t);
    veNV(ctx, 900, 600, 1.2, { t, mat: "cuoi", noi: 0, nhin: [0.5, 0], tayP: { p: [60, -60], cong: 40, kieu: "nam" } });
    D.dienThoaiSau(ctx, 900 + 60 * 1.2 + 30, 600 - 90, 0.5, 0.3); moHoi(ctx, 1020, 360, 0.9);
    viet(ctx, "lương?", 1320, 430, { size: 80, mau: "#6b6560", u: vao(tl, m(c, 2)) });
    viet(ctx, "“cũng được ạ”", 1400, 580, { size: 84, u: vao(tl, m(c, 5)) });
  } else if (tl < tHoi) {
    nhaMe(ctx, t, "bep");
    veNV(ctx, 960, 600, 1.2, { t, kieu: "me", mat: "nheo", nhin: [0.4, 0], tayP: { p: [150, -30], cong: 30, kieu: "nam" } });
    kinhLup(ctx, 960 + 150 * 1.2 + 60, 600 - 30 * 1.2 - 70, 1.0, -0.5);
    viet(ctx, "soi phông bạt", 1000, 130, { size: 76, u: vao(tl, m(c, 10)) }); viet(ctx, "từ trước cả Threads", 1000, 230, { size: 70, mau: DO, u: vao(tl, m(c, 14)) });
  } else {
    // hồi tưởng lớp 5: giấy vàng cũ
    giay(ctx, "#f3e6cf"); to(ctx, rect(0, 820, W, 260, 0), "#d9c4a3"); netPts(ctx, [[-10, 820], [W + 10, 820]], { w: 6 });
    viet(ctx, "hồi lớp 5", 260, 140, { size: 70, mau: "#8a7a60", u: vao(tl, tHoi) });
    const tai = clamp((tl - tTai + 0.4) / 0.6), mo = tl >= t4;
    const nhinTai = tl >= tNhin;
    if (!nhinTai) {
      veNV(ctx, 1260, 520, 1.25, { t, kieu: "me", mat: tl >= tDeo ? "nheo" : "thuong", nhin: [-0.6, 0.4], ngh: 0.1 });
      veNV(ctx, 760, 720, 0.85, { t, kieu: "hieube", mat: tl >= t9 ? "cuoi" : "thuong", nhin: [0.6, -0.3], tayP: { p: [160, -20], cong: 20 } });
      soLL(ctx, 760 + 160 * 0.85 + 60, 720 - 40, 0.55, false, "", 0.15);
      if (tl >= t9) viet(ctx, "“9 điểm ạ!”", 620, 330, { size: 84, u: vao(tl, t9) });
      if (tl >= tDeo) { gachCheo(ctx, 1000, 560, 1060, 620, vao(tl, tDeo, 0.25)); viet(ctx, "không xem sổ", 1500, 180, { size: 64, u: vao(tl, tDeo) }); }
    } else {
      // cận tai Hiếu bé: đỏ dần như đèn giao thông
      ctx.save(); cam(ctx, 920, 560, 1.4);
      veNV(ctx, 960, 760, 1.9, { t, kieu: "hieube", mat: mo ? "khoc" : "hoang", taiDo: tai, nhin: [0.6, 0] });
      ctx.restore();
      denGT(ctx, 1500, 420, 1.1, tai < 0.3 ? 2 : tai < 0.7 ? 1 : 0);
      if (tl >= tTai) viet(ctx, "tai đỏ", 1500, 760, { size: 110, mau: DO, u: vao(tl, tTai) });
      if (mo) { ctx.save(); const u = back(vao(tl, t4, 0.3)); ctx.translate(360, 620); ctx.scale(u, u); soLL(ctx, 0, 0, 0.95, true, "4", -0.08); ctx.restore(); }
    }
  }
}
/* ── CÂU 14: chỉ gọi thoại — gọi video là toang ── */
function c14(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tGoi = m(c, 10), tVid = m(c, 12), tToang = m(c, 15);
  if (tl < tVid) {
    giay(ctx);
    D.dienThoai(ctx, 960, 560, 2.8, 0, (g) => {
      g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280);
      g.save(); g.beginPath(); g.arc(0, -70, 34, 0, 7); g.clip(); g.fillStyle = "#e9dcc8"; g.fillRect(-40, -110, 80, 80); veNV(g, 0, -40, 0.3, { t, kieu: "me", mat: "thuong" }); g.restore(); net(g, elip(0, -70, 34, 34), { w: 3 });
      viet(g, "Mẹ ♥", 0, -14, { size: 28, pop: false });
      ve(g, rect(-66, 30, 132, 40, 14), tl >= tGoi ? "#30c46b" : "#d9f2dc", { w: 2.5 }); viet(g, "Gọi thoại", 0, 58, { size: 20, pop: false, mau: tl >= tGoi ? "#fff" : MUC });
      ve(g, rect(-66, 84, 132, 40, 14), "#e9eef5", { w: 2.5 }); viet(g, "Gọi video", 0, 112, { size: 20, pop: false });
    });
    // ngón tay né nút video, bấm nút thoại
    const u = clamp((tl - m(c, 3)) / Math.max(0.3, tGoi - m(c, 3))), ne = Math.sin(u * Math.PI) * 120;
    const fx = 960 + 40 + ne, fy = lerp(560 + 98 * 2.8 + 40, 560 + 50 * 2.8, eio(u));
    ctx.save(); ctx.translate(fx, fy); ctx.rotate(-Math.PI / 2 - 0.2); ctx.scale(2.2, 2.2); banTay(ctx, "chi", 1, 60); ctx.restore();
    if (u > 0.2 && u < 0.9) viet(ctx, "né!", 1430, 860, { size: 80, mau: DO, u: vao(tl, m(c, 3)) });
    viet(ctx, "chỉ gọi thoại", 1480, 260, { size: 80, u: vao(tl, m(c, 9)) });
  } else {
    giay(ctx, "#1f2440");
    ctx.save(); lac(ctx, tl, tToang, 22, 0.5);
    const bum = tl >= tToang;
    if (!bum) manHinhGoi(ctx, 960, 560, 2.6, t, { kieu: "video", ai: "hieu", mat: "hoang", nen: "#e9dcc8" });
    else { khoi(ctx, 960, 540, 260, t * 2, "#ffb347"); khoi(ctx, 960, 540, 170, t * 3 + 1, "#ffd76a"); tiaNhan(ctx, 960, 540, 300, 420, 14, { a0: 0, goc: 0.45, w: 9, mau: "#ffd76a" }); }
    viet(ctx, bum ? "TOANG!" : "gọi video…", 960, bum ? 600 : 170, { size: bum ? 220 : 80, mau: bum ? DO : GIAY, u: vao(tl, bum ? tToang : tVid), nen: bum ? "#fff" : undefined });
    ctx.restore();
  }
}
/* ── CÂU 15: mẹ có vũ khí hay hơn: anh Tuấn ── */
function c15(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tVu = m(c, 5), tTuan = m(c, 11);
  nhaMe(ctx, t, "bep");
  if (tl < tVu) {
    veNV(ctx, 960, 600, 1.2, { t, kieu: "me", mat: "thuong", nhin: [-0.3, 0] });
    viet(ctx, "lương?", 1000, 200, { size: 90, mau: "#6b6560", u: vao(tl, m(c, 3)) }); gachCheo(ctx, 880, 170, 1130, 180, vao(tl, m(c, 3) + 0.2, 0.3));
  } else {
    const u = eout(vao(tl, tVu, 0.35));
    if (tl >= tTuan) { toi(ctx, 0.35); for (let i = 0; i < 3; i++) { const x = 300 + i * 700; netPts(ctx, [[x, 0], [x + 40, 160], [x - 20, 220], [x + 30, 400]], { w: 9, mau: VANG, seed: 950 + i }); } }
    veNV(ctx, 900, 600, 1.2, { t, kieu: "me", mat: tl >= tTuan ? "deu" : "tuc", nhin: [0.5, -0.4], tayP: { p: [lerp(90, 120, u), lerp(128, -190, u)], cong: 20, kieu: "nam" } });
    const px = 900 + 120 * 1.2 + 20, py = 600 - 190 * 1.2 - 110;
    if (u > 0.3) {
      D.dienThoai(ctx, px, py, 0.9, 0.12, (g) => { g.fillStyle = "#dfe9f5"; g.fillRect(-80, -140, 160, 280); if (tl >= tTuan) { g.save(); g.beginPath(); g.rect(-72, -136, 144, 272); g.clip(); veNV(g, 0, 40, 0.5, { t, kieu: "tuan", mat: "tuhao", chan: false }); g.restore(); viet(g, "anh Tuấn", 0, 120, { size: 30, pop: false, mau: DO }); } });
      tiaNhan(ctx, px, py, 170, 230, 9, { a0: -Math.PI / 2, goc: 0.4, w: 6, mau: VANG }); viet(ctx, "keng!", px + 260, py - 90, { size: 70, mau: "#e8a21c", u: vao(tl, tVu + 0.2) });
    }
    viet(ctx, tl >= tTuan ? "ANH TUẤN" : "vũ khí", 1500, tl >= tTuan ? 700 : 760, { size: tl >= tTuan ? 140 : 90, mau: tl >= tTuan ? VANG : MUC, u: vao(tl, tl >= tTuan ? tTuan : m(c, 7)), nen: tl >= tTuan ? MUC : undefined });
  }
}
/* ── CÂU 16: anh Tuấn con bác Thoa — ngân hàng, 50 triệu — bác đọc như kinh ── */
function c16(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tLam = m(c, 10), tLuong = m(c, 13), tTheo = m(c, 16), tKinh = m(c, 28);
  if (tl < tLam) {
    giay(ctx);
    const nv = [["thoa", 560, 420, "bác Thoa", 0.62, m(c, 4)], ["me", 1360, 420, "mẹ", 0.62, m(c, 8)], ["tuan", 560, 840, "anh Tuấn", 0.5, 0], ["hieu", 1360, 840, "tôi", 0.5, m(c, 9)]];
    netPts(ctx, [[700, 330], [1220, 330]], { w: 6 }); viet(ctx, "chị gái", 960, 310, { size: 50, u: vao(tl, m(c, 6)) });
    netPts(ctx, [[560, 560], [560, 650]], { w: 6 }); netPts(ctx, [[1360, 560], [1360, 650]], { w: 6 });
    for (const [k2, x, y, ten, s, t0] of nv) { const u = back(vao(tl, t0, 0.3)); if (u <= 0) continue; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); veNV(ctx, 0, 0, s, { t, kieu: k2, mat: k2 === "tuan" ? "tuhao" : k2 === "hieu" ? "chan" : "cuoi", chan: false }); ctx.restore(); viet(ctx, ten, x + 260, y + 20, { size: 60, u: vao(tl, t0 + 0.1) }); }
    if (tl > m(c, 4)) sao(ctx, 470, 700, 30, t);
  } else if (tl < tTheo) {
    giay(ctx, "#eef4fb");
    ve(ctx, rect(980, 300, 760, 520, 6), "#dfe6ee", { w: 6 }); ve(ctx, "M940,310 L1360,170 L1780,310 Z", "#8fa6c4", { w: 6 }); for (let i = 0; i < 5; i++) ve(ctx, rect(1030 + i * 150, 420, 60, 400, 6), "#f4f7fb", { w: 4 });
    viet(ctx, "NGÂN HÀNG", 1360, 285, { size: 56, pop: false, mau: "#2f5fae" });
    veNV(ctx, 640, 600, 1.2, { t, kieu: "tuan", mat: "tuhao", tayP: { p: [150, -60], cong: 20, kieu: "like" } });
    if (tl >= tLuong) { const u = back(vao(tl, m(c, 14), 0.35)); ctx.save(); ctx.translate(1360, 560); ctx.scale(u, u); ve(ctx, rect(-330, -150, 660, 260, 16), "#fff4d6", { w: 7 }); viet(ctx, "50 TRIỆU", 0, 40, { size: 150, mau: DO, pop: false, dam: 0.05 }); ctx.restore(); for (let i = 0; i < 5; i++) sao(ctx, 1360 + Math.cos(i * 1.3 + t) * 380, 560 + Math.sin(i * 1.3 + t) * 200, 26, t + i); }
  } else {
    giay(ctx, "#fff1e8");
    const go = tl >= tKinh ? Math.abs(Math.sin(tq * 9)) : Math.abs(Math.sin(tq * 5)) * 0.6;
    veNV(ctx, 760, 620, 1.2, { t, kieu: "thoa", mat: tl >= tKinh ? "sang" : "cuoi", noi: Math.abs(Math.sin(tq * 7)) * 0.8, nhin: [0.5, 0], tayP: { p: [160, -40], cong: 20, kieu: "nam" }, tayT: { p: [-120, 110], cong: -20, kieu: "nam" } });
    loa(ctx, 760 + 160 * 1.2 + 30, 620 - 40 * 1.2 - 10, 1.0, -0.15);
    ve(ctx, rect(300, 900, 360, 40, 8), "#9c6a44", { w: 5 }); moGo(ctx, 480, 850, 1.3, go); viet(ctx, "cốc… cốc…", 480, 660, { size: 56, mau: "#8a5a2a", alpha: go > 0.5 ? 1 : 0.5, pop: false });
    for (let i = 0; i < 3; i++) { const u = ((tl * 0.8 + i / 3) % 1); viet(ctx, "50 triệu…", 1300 + u * 300, 500 - i * 140 + u * 20, { size: 70 + i * 6, mau: DO, alpha: 1 - u, pop: false }); }
    viet(ctx, "5 năm nay", 1500, 860, { size: 76, u: vao(tl, m(c, 25)) });
    if (tl >= tKinh) viet(ctx, "đều như kinh", 1500, 960, { size: 76, mau: "#8a5a2a", u: vao(tl, tKinh) });
  }
}
/* ── CÂU 17: trung bình 11,2 triệu — bập bênh: tôi kéo xuống, anh Tuấn kéo lên — chia đôi vẫn trên trung bình ── */
function c17(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tToi = m(c, 16), tTuanLen = m(c, 23), tCong = m(c, 25), tNghe = m(c, 38);
  if (tl < tToi) {
    giay(ctx);
    ve(ctx, rect(420, 220, 1080, 600, 12), "#3f6f4f", { w: 7 }); net(ctx, rect(440, 240, 1040, 560, 8), { w: 3, mau: "#8fb39a" });
    viet(ctx, "CỤC THỐNG KÊ", 960, 320, { size: 62, mau: "#fff", u: vao(tl, 0.05), pop: false });
    viet(ctx, "lương trung bình", 960, 470, { size: 70, mau: "#fff", u: vao(tl, m(c, 11)) });
    viet(ctx, "11,2 triệu", 960, 640, { size: 150, mau: VANG, u: vao(tl, m(c, 13)) });
  } else if (tl < tCong) {
    giay(ctx, "#eaf6fb"); to(ctx, rect(0, 900, W, 180, 0), "#a6d58a"); netPts(ctx, [[-10, 900], [W + 10, 900]], { w: 6 });
    const g = -(tl < tTuanLen - 0.2 ? lerp(0, 0.14, eio(vao(tl, tToi, 0.6))) : lerp(0.14, 0.18, eout(vao(tl, tTuanLen - 0.2, 0.4))));
    ve(ctx, "M900,900 L960,780 L1020,900 Z", "#9c6a44", { w: 6 });
    ctx.save(); ctx.translate(960, 780); ctx.rotate(g);
    ve(ctx, rect(-640, -18, 1280, 36, 10), "#e8a24a", { w: 6 });
    veNV(ctx, -560, -170, 0.85, { t, mat: "chan", co: 1, tayT: { p: [-40, 140], cong: -10 }, tayP: { p: [40, 140], cong: 10 } });
    veNV(ctx, 560, -170, 0.85, { t, kieu: "tuan", mat: tl >= tTuanLen ? "ngac" : "tuhao", tayT: { p: [-150, -140], cong: -20, kieu: "xoe" }, tayP: { p: [150, -140], cong: 20, kieu: "xoe", lat: -1 } });
    ctx.restore();
    netPts(ctx, [[0, 780], [W, 780]], { w: 5, mau: DO, seed: 980, alpha: 0.8 }); viet(ctx, "11,2tr", 960, 740, { size: 56, mau: DO, pop: false });
    viet(ctx, "kéo xuống", 330, 1010, { size: 76, u: vao(tl, m(c, 17)) }); if (tl >= tTuanLen) { viet(ctx, "kéo lên", 1560, 130, { size: 76, u: vao(tl, tTuanLen) }); for (let i = 0; i < 4; i++) sao(ctx, 1500 + Math.cos(i + t) * 140, 260 + Math.sin(i * 2 + t) * 60, 20, t + i); }
  } else {
    giay(ctx);
    viet(ctx, "(8 + 50) : 2 = 29", 960, 300, { size: 110, u: vao(tl, m(c, 26)) });
    viet(ctx, "29 > 11,2", 960, 450, { size: 110, mau: XANH, u: vao(tl, m(c, 34)) }); if (tl >= m(c, 35)) netPts(ctx, [[1290, 410], [1320, 450], [1390, 360]], { w: 12, mau: XANH });
    const mat = tl >= tNghe;
    veNV(ctx, 960, 760, 0.95, { t, mat: mat ? "sang" : "thuong", chan: false, tayP: mat ? { p: [140, -40], cong: 20, kieu: "xoe", cam: (g2) => canhSuoi(g2, 40, 0, 0.5) } : undefined });
    if (mat) { for (let i = 0; i < 3; i++) netPts(ctx, [[1180 + i * 30, 560 + i * 40], [1260 + i * 30, 540 + i * 40]], { w: 4, mau: "#7cc3e8" }); viet(ctx, "mát mặt phết", 1500, 700, { size: 80, u: vao(tl, tNghe) }); }
  }
}
/* ── CÂU 18: giám đốc nhân sự nói với báo: LinkedIn 20 triệu, sang Threads từ 50 — Threads City lần đầu ── */
function c18(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tLuong = m(c, 9), tSang = m(c, 17), t50 = m(c, 21);
  if (tl < tSang) {
    giay(ctx, "#e9edf2");
    // thành phố LinkedIn xám xịt
    const q = rng(990);
    for (let i = 0; i < 9; i++) { const w = 170 + q() * 60, h = 260 + q() * 280, x = 980 + i * 110 - 30, y = 860 - h; ve(ctx, rect(x, y, w, h, 6), ["#c9d2de", "#b9c4d2", "#d4dbe5"][i % 3], { w: 4.5, seed: 1000 + i }); for (let r = 0; r < Math.floor(h / 60) - 1; r++) for (let k2 = 0; k2 < 3; k2++) to(ctx, rect(x + 20 + k2 * 50, y + 24 + r * 60, 30, 24, 3), "#eef1f5"); }
    to(ctx, rect(0, 860, W, 220, 0), "#c2c8d0"); netPts(ctx, [[-10, 860], [W + 10, 860]], { w: 6 });
    veNV(ctx, 520, 620, 1.15, { t, kieu: "sep", mat: "thuong", noi: tl < tLuong ? c.noi : 0, nhin: [0.6, 0], tayP: { p: [150, -30], cong: 20, kieu: "nam", camTren: (g) => { ve(g, rect(10, -16, 30, 32, 10), "#3a3d4c", { w: 4 }); ve(g, elip(50, 0, 24, 30), "#5a5f6e", { w: 4 }); } } });
    viet(ctx, "giám đốc nhân sự", 520, 170, { size: 64, u: vao(tl, m(c, 1)) });
    if (tl >= tLuong) { iconApp(ctx, 1380, 330, 150, "in"); viet(ctx, "≈ 20 triệu", 1380, 520, { size: 100, mau: "#2f5fae", u: vao(tl, m(c, 15)), nen: "#fff" }); }
  } else {
    // Threads City hiện ra: lia xuống từ trời đêm, neon nhấp nháy, Hiếu bé tí há mồm
    const u = eio(vao(tl, tSang, 1.0));
    ctx.save(); cam(ctx, 960, lerp(380, 540, u), lerp(1.25, 1.0, u));
    threadsCity(ctx, t, { bien: [["50 TRIỆU", 420, 330, "#ff4fa0", 96], ["LƯƠNG 80", 1360, 250, "#3fe0ff", 84], ["OMAKASE", 900, 470, "#ffd23e", 70], ["THƯƠNG GIA", 1560, 520, "#9cff6a", 56]] });
    for (let i = 0; i < 3; i++) { const a = -1.9 + i * 0.5 + Math.sin(t * 0.9 + i) * 0.25; ctx.save(); ctx.globalAlpha = 0.22; to(ctx, `M${400 + i * 560},1000 L${400 + i * 560 + Math.cos(a) * 900 - 40},${1000 + Math.sin(a) * 900} L${400 + i * 560 + Math.cos(a) * 900 + 40},${1000 + Math.sin(a) * 900} Z`, "#fff6c4"); ctx.restore(); }
    ctx.restore();
    veNV(ctx, 960, 960, 0.55, { t, mat: "ngac", nhin: [0, -1], chan: false });
    viet(ctx, "THREADS CITY", W / 2, 140, { size: 110, mau: "#ff4fa0", u: vao(tl, tSang + 0.3), nen: "#0f1226" });
    if (tl >= m(c, 20)) viet(ctx, "từ 50 triệu", 1560, 900, { size: 84, mau: VANG, u: vao(tl, m(c, 20)) });
  }
}
/* ── CÂU 19: lương gấp đôi rưỡi, đéo cần nhảy việc, chỉ cần nhảy app ── */
function c19(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tDeo = m(c, 8), tChi = m(c, 12), tApp = m(c, 15);
  giay(ctx);
  if (tl < tDeo) {
    bieuDo(ctx, 620, 860, [["LinkedIn", 0.4, "#2f6fb5", 1], ["Threads", 1, "#1b1b20", vao(tl, m(c, 4), 0.6)]], { cao: 500, rong: 520 });
    viet(ctx, "× 2,5", 1360, 420, { size: 160, mau: DO, u: vao(tl, m(c, 5)) });
  } else if (tl < tChi) {
    ve(ctx, rect(720, 560, 300, 210, 20), "#8a5a3c", { w: 6 }); ve(ctx, rect(820, 520, 100, 50, 14), "#8a5a3c", { w: 5 }); viet(ctx, "nhảy việc", 870, 860, { size: 64, pop: false });
    gachCheo(ctx, 660, 520, 1080, 820, vao(tl, tDeo, 0.25), DO, 20); gachCheo(ctx, 1080, 520, 660, 820, vao(tl, tDeo + 0.15, 0.25), DO, 20);
    veNV(ctx, 1420, 600, 1.1, { t, mat: "deu", nhin: [-0.6, 0], tayT: { p: [-150, -30], cong: -20, kieu: "xoe", lat: -1 } });
    viet(ctx, "đéo cần", 1420, 200, { size: 96, mau: DO, u: vao(tl, tDeo) });
  } else {
    iconApp(ctx, 460, 800, 280, "in"); iconApp(ctx, 1460, 800, 280, "@");
    viet(ctx, "20tr", 460, 1010, { size: 70, mau: "#2f6fb5", pop: false }); viet(ctx, "50tr", 1460, 1010, { size: 70, mau: DO, pop: false });
    const u = clamp((tl - tChi - 0.2) / 0.9), x = lerp(460, 1460, eio(u)), y = 520 - Math.sin(u * Math.PI) * 300;
    veNV(ctx, x, y, 0.8, { t, mat: u >= 1 ? "cuoi" : "nham", co: u <= 0 ? 0.85 : 1, tayT: { p: [-130, u > 0 && u < 1 ? -130 : 110], cong: -20, kieu: "xoe" }, tayP: { p: [130, u > 0 && u < 1 ? -130 : 110], cong: 20, kieu: "xoe", lat: -1 } });
    for (let i = 0; i < 5; i++) { const v = clamp(u - i * 0.08), cx = lerp(460, 1460, v), cy = 640 - Math.abs(Math.sin(v * Math.PI * 3)) * 160; if (v > 0) xu(ctx, cx - 60, cy, 22); }
    viet(ctx, "nhảy app", W / 2, 1010, { size: 120, mau: DO, u: vao(tl, m(c, 14)) });
  }
}
/* ── CÂU 20: anh Tuấn đạt lương Threads từ hồi chưa có Threads — con nhà người ta ── */
function c20(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tTu = m(c, 6), tDung = m(c, 11), tDi = m(c, 17);
  giay(ctx, "#fff8e6");
  if (tl < tDung) {
    ve(ctx, rect(760, 620, 400, 300, 8), "#f4c430", { w: 7 }); viet(ctx, "1", 960, 820, { size: 180, mau: "#fff", pop: false, dam: 0.06 });
    ve(ctx, rect(380, 760, 380, 160, 8), "#c9d2de", { w: 6 }); ve(ctx, rect(1160, 800, 380, 120, 8), "#e0a96b", { w: 6 }); netPts(ctx, [[0, 920], [W, 920]], { w: 6 });
    veNV(ctx, 960, 400, 0.9, { t, kieu: "tuan", mat: "tuhao", tayT: { p: [-130, -130], cong: -20, kieu: "xoe" }, tayP: { p: [130, -130], cong: 20, kieu: "xoe", lat: -1 } });
    vuongMien(ctx, 960, 400 - 95 * 0.9 - 130, 0.9);
    for (let i = 0; i < 6; i++) sao(ctx, 960 + Math.cos(i + t) * 330, 300 + Math.sin(i * 1.7 + t) * 160, 24, t + i);
    viet(ctx, "lương Threads", 400, 300, { size: 76, mau: DO, u: vao(tl, m(c, 4)) });
    if (tl >= tTu) { ve(ctx, rect(1330, 230, 330, 200, 14), "#ffffff", { w: 6 }); viet(ctx, "2021", 1495, 320, { size: 90, pop: false }); iconApp(ctx, 1495, 390, 60, "@"); gachCheo(ctx, 1450, 350, 1540, 430, vao(tl, m(c, 8), 0.25)); viet(ctx, "chưa có Threads", 1495, 520, { size: 56, u: vao(tl, m(c, 8)) }); }
  } else {
    // đi trước thời đại: Tuấn đi trên vạch thời gian, bỏ xa cả cái logo Threads
    netPts(ctx, [[120, 780], [1800, 780]], { w: 8 }); for (const [x, s] of [[300, "2021"], [960, "2023"], [1620, "2025"]]) { netPts(ctx, [[x, 760], [x, 800]], { w: 6 }); viet(ctx, s, x, 860, { size: 60, pop: false }); }
    const u = eio(vao(tl, tDung, 1.6));
    iconApp(ctx, 960, 640, 110, "@");
    veNV(ctx, lerp(1200, 1620, u), 560, 0.85, { t, kieu: "tuan", mat: "tuhao", nhun: -Math.abs(Math.sin(tq * 8)) * 10, nhin: [0.6, 0] });
    vuongMien(ctx, lerp(1200, 1620, u), 560 - 95 * 0.85 - 125, 0.8);
    veNV(ctx, 300, 640, 0.7, { t, mat: "chan", nhin: [0.8, 0] });
    viet(ctx, "con nhà người ta", W / 2, 200, { size: 100, mau: DO, u: vao(tl, m(c, 13)) });
    if (tl >= tDi) viet(ctx, "đi trước thời đại", W / 2, 330, { size: 76, u: vao(tl, tDi) });
  }
}
/* ── CÂU 21: trưa nào mẹ cũng gọi ── */
function c21(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl);
  giay(ctx, "#fff8e1");
  D.dongHo(ctx, 600, 460, 230, 12, 0);
  viet(ctx, "12:00", 600, 820, { size: 110, u: vao(tl, 0.05) });
  const run = (Math.floor(tq * 12) % 2 ? 1 : -1) * 8;
  manHinhGoi(ctx, 1340 + run, 500, 1.6, t, { kieu: "den", ai: "me", ten: "Mẹ ♥", xoay: run * 0.004 });
  rung(ctx, 1340, 500, 190, 2);
  viet(ctx, "trưa nào cũng gọi", 1340, 900, { size: 70, u: vao(tl, m(c, 3)) });
}
/* ── CÂU 22 (MẸ): "Ăn gì chưa? Hôm qua bác Thoa lại kể anh Tuấn…" ── */
function c22(ctx, t, uf, c) {
  const tl = c.tl, tHom = m(c, 3), tTuan = m(c, 9);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 960, H); ctx.clip();
  nhaMe(ctx, t, "bep");
  veNV(ctx, 480, 640, 1.15, { t, kieu: "me", mat: tl >= tHom ? "tuhao" : "thuong", noi: c.noi, nhin: [0.4, 0], tayP: { p: [60, -60], cong: 40, kieu: "nam" } });
  D.dienThoaiSau(ctx, 480 + 60 * 1.15 + 34, 640 - 100, 0.45, 0.3);
  viet(ctx, tl < tHom ? "“Ăn gì chưa?”" : "“…anh Tuấn…”", 480, 200, { size: 80, u: vao(tl, tl < tHom ? 0.05 : tTuan - 0.1) });
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(960, 0, 960, H); ctx.clip();
  phongNgay(ctx, t, { lich: false });
  D.ban(ctx, 1440, 700, 800, 300);
  const up = tl >= tHom;
  if (!up) veNV(ctx, 1440, 520, 1.1, { t, mat: "thuong", nhin: [0, 0], chan: false, tayT: { p: [-120, 160], cong: -20 }, tayP: { p: [120, 160], cong: 20 } });
  else {   // úp mặt xuống bàn: lưng hoodie, hai tay khoanh, chỉ thấy đỉnh tóc
    ve(ctx, elip(1440, 640, 230, 130), "#f2b544", { w: 6 }); bong(ctx, elip(1440, 640, 230, 130), "M1500,500 L1700,500 L1700,780 L1500,780 Z", "#d8952a");
    ve(ctx, elip(1440, 600, 120, 96), "#2a2631", { w: 6 }); ve(ctx, "M1440,508 C1430,470 1460,450 1490,462 C1470,468 1462,480 1462,506 Z", "#2a2631", { w: 5 }); net(ctx, "M1380,560 C1400,540 1430,530 1460,532", { w: 5, mau: "#fff", alpha: 0.5 });
    ve(ctx, rect(1200, 650, 480, 70, 34), "#f2b544", { w: 6 }); netPts(ctx, [[1440, 654], [1440, 716]], { w: 4 });
    for (let i = 0; i < 3; i++) { const pts = []; for (let j = 0; j <= 8; j++) pts.push([1300 + i * 140 + Math.sin(j + t * 3 + i) * 10, 470 - j * 14]); netPts(ctx, pts, { w: 4, mau: "#9aa0ab", seed: 1210 + i }); }
    viet(ctx, "lại nữa…", 1440, 220, { size: 80, mau: "#6b6560", u: vao(tl, tHom + 0.2) });
  }
  for (let i = 0; i < 7; i++) { const h = 10 + Math.abs(on(t * 9 + i, 4)) * 70 * c.noi; to(ctx, rect(1640 + i * 22, 460 - h / 2, 12, h, 6), "#7ecbe8"); }
  ctx.restore();
  netPts(ctx, [[960, -10], [960, H + 10]], { w: 10 });
}
/* ── CÂU 23: nhóm Zalo nhà ngoại tắt thông báo — ảnh mờ méo dính logo — tin đến tai tôi qua mẹ, 12h trưa ── */
function anhSen(g) { g.fillStyle = "#c9e6d0"; g.fillRect(-60, -44, 120, 88); ve(g, elip(0, 10, 30, 14), "#7fbf73", { w: 2.5 }); for (let i = 0; i < 5; i++) { g.save(); g.translate(0, -6); g.rotate(-1 + i * 0.5); ve(g, "M0,0 C8,-12 8,-28 0,-34 C-8,-28 -8,-12 0,0 Z", "#f39cc0", { w: 2 }); g.restore(); } }
function anhMeo(g) { g.fillStyle = "#fff4d6"; g.fillRect(-60, -44, 120, 88); viet(g, "MẸO CHỮA", 0, -10, { size: 18, mau: DO, pop: false, soi: false }); viet(g, "BÁCH BỆNH", 0, 14, { size: 18, mau: DO, pop: false, soi: false }); to(g, elip(-30, 30, 10, 6), "#7fbf73"); }
function logo(g, s, x, y, mau) { g.save(); g.globalAlpha = 0.75; ve(g, rect(x - 22, y - 9, 44, 18, 5), mau, { w: 1.5 }); viet(g, s, x, y + 5, { size: 10, mau: "#fff", pop: false, soi: false }); g.restore(); }
function c23(ctx, t, uf, c) {
  const tl = c.tl, tTrong = m(c, 12), tMeo = m(c, 17), tLogo = m(c, 18), tTin = m(c, 25), tMe = m(c, 34);
  if (tl < tTin) {
    giay(ctx, "#eef3fa");
    const tin = [
      { ai: 1101, chu: "Chúc cả nhà ngày mới!", anh: (g) => { anhSen(g); if (tl >= tLogo) logo(g, "PAGE A", 30, -30, "#e0392f"); }, hoa: 5, mo: tl >= m(c, 16) },
      { ai: "thoa", chu: "Anh Tuấn ăn omakase", anh: (g) => anhSushi(g, 0, 0, 0.36), hoa: 9 },
      { ai: 1102, chu: "Mẹo này hay lắm", anh: (g) => { anhMeo(g); if (tl >= tLogo) { logo(g, "PAGE B", -24, 30, "#2f5fae"); logo(g, "PAGE C", 30, -32, "#2f9e57"); } }, hoa: 3, mo: tl >= m(c, 16) },
      { ai: 1103, chu: "Sen nở rồi các cụ", anh: (g) => { g.save(); g.scale(1.25, 0.8); g.rotate(0.12); anhSen(g); g.restore(); if (tl >= tLogo) logo(g, "PAGE A", -26, 28, "#e0392f"); }, hoa: 4, mo: tl >= m(c, 16) },
    ];
    const cuon = tl < tTrong ? 0 : (tl - tTrong) * 70;
    zalo(ctx, 760, 560, 3.0, t, { tieuDe: "Nhà Ngoại", tin, cuon, tatChuong: tl >= m(c, 7) });
    if (tl < tTrong) { ctx.save(); ctx.translate(760 + 60 * 3 + 40, 560 - 120 * 3 + 80); ctx.rotate(-2.2); ctx.scale(1.8, 1.8); banTay(ctx, "chi", 1, 70); ctx.restore(); viet(ctx, "tắt thông báo", 1500, 300, { size: 80, u: vao(tl, m(c, 7)) }); viet(ctx, "lâu rồi", 1500, 400, { size: 70, u: vao(tl, m(c, 10)) }); }
    else { viet(ctx, "mờ", 1440, 330, { size: 110, mau: "#8aa0b8", u: vao(tl, m(c, 16)), xoay: -0.08 }); viet(ctx, "méo", 1620, 470, { size: 110, mau: "#8aa0b8", u: vao(tl, tMeo), xoay: 0.12 }); if (tl >= tLogo) viet(ctx, "dính 3 logo", 1520, 640, { size: 84, mau: DO, u: vao(tl, tLogo) }); }
  } else {
    giay(ctx);
    zalo(ctx, 260, 560, 1.4, t, { tieuDe: "Nhà Ngoại", tin: [{ ai: 1101, anh: anhSen, hoa: 2 }, { ai: "thoa", anh: (g) => anhSushi(g, 0, 0, 0.36), hoa: 3 }] });
    muiTen(ctx, 420, 560, 680, 560, vao(tl, tTin + 0.3, 0.4));
    veNV(ctx, 900, 640, 0.95, { t, kieu: "me", mat: "cuoi", noi: 0, chan: false, tayP: { p: [60, -60], cong: 40 } });
    muiTen(ctx, 1080, 560, 1340, 560, vao(tl, m(c, 31), 0.4));
    ctx.save(); ctx.translate(1600, 560); ctx.scale(3.2, 3.2); ve(ctx, elip(0, 0, 40, 56), DA, { w: 5 }); net(ctx, "M10,-30 C30,-20 30,20 6,30 C-6,20 -4,0 8,-10", { w: 4 }); ctx.restore();
    D.dongHo(ctx, 1600, 260, 80, 12, 0);
    viet(ctx, "đúng một đường", W / 2, 140, { size: 80, u: vao(tl, m(c, 31)) });
    if (tl >= tMe) viet(ctx, "mẹ · 12 giờ trưa", W / 2, 960, { size: 90, mau: DO, u: vao(tl, tMe) });
  }
}
/* ── CÂU 24: báo viết về chợ ảnh phông bạt — omakase, ghế thương gia — 1k–20k — 500 tấm/5 ngày → mắt ra chữ đ ── */
function gheTG(g) { g.fillStyle = "#2f3550"; g.fillRect(-60, -44, 120, 88); ve(g, "M-40,40 L-30,-30 C-28,-38 -10,-40 -6,-30 L0,30 L40,34 L40,44 L-40,44 Z", "#a8703c", { w: 2.5 }); ve(g, rect(20, -30, 34, 24, 4), "#9fd3ea", { w: 2 }); }
function c24(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tAnh = m(c, 11), tTu = m(c, 18), tCo = m(c, 26), t500 = m(c, 30);
  if (tl < tAnh) {
    phongDem(ctx, t, { gio: 23, phut: 20 });
    D.dienThoai(ctx, 1000, 540, 2.9, 0, (g) => { g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280); viet(g, "TIN NÓNG", -40, -110, { size: 18, mau: DO, pop: false, soi: false }); viet(g, "Chợ ảnh", -64, -70, { size: 28, pop: false, can: "left", soi: false }); viet(g, "phông bạt", -64, -40, { size: 28, pop: false, can: "left", soi: false }); viet(g, "trên Threads", -64, -10, { size: 25, mau: DO, pop: false, can: "left", soi: false }); for (let i = 0; i < 5; i++) to(g, rect(-64, 20 + i * 22, i % 2 ? 100 : 128, 8, 4), "#cfd6e2"); });
    viet(ctx, "tháng 6", 1460, 560, { size: 84, mau: GIAY, u: vao(tl, 0.05) }); viet(ctx, "báo viết", 1480, 670, { size: 70, mau: GIAY, u: vao(tl, m(c, 2)) });
  } else if (tl < tCo) {
    giay(ctx);
    anhSushi(ctx, 560, 470, 1.15, -0.06);
    if (tl >= m(c, 13)) { ctx.save(); ctx.translate(1340, 470); ctx.rotate(0.05); ctx.scale(1.15, 1.15); ve(ctx, rect(-170, -150, 340, 300, 8), "#fff", { w: 5 }); ctx.save(); ctx.translate(0, -18); ctx.scale(2.4, 2.4); gheTG(ctx); ctx.restore(); ctx.restore(); viet(ctx, "ghế thương gia", 1340, 760, { size: 64, u: vao(tl, m(c, 14)) }); }
    viet(ctx, "omakase", 560, 760, { size: 64, u: vao(tl, m(c, 12)) });
    if (tl >= tTu) { ve(ctx, rect(700, 860, 520, 120, 16), "#fff4d6", { w: 6 }); viet(ctx, "1k – 20k / tấm", 960, 940, { size: 70, mau: DO, u: vao(tl, tTu), pop: false }); }
  } else {
    phongDem(ctx, t, { gio: 23, phut: 30 });
    const tien = tl >= t500;
    veNV(ctx, 760, 600, 1.25, { t, mat: tien ? "tien" : "ngac", nhin: [0.4, 0.3], tayP: { p: [120, 60], cong: 30, kieu: "nam" } });
    D.dienThoaiSau(ctx, 760 + 120 * 1.25 + 30, 600 + 40, 0.5, 0.2);
    if (tien) { for (let i = 0; i < 6; i++) sao(ctx, 760 + Math.cos(i + t) * 260, 420 + Math.sin(i * 1.3 + t) * 180, 22, t + i, "#9cff6a"); tiaNhan(ctx, 760, 480, 300, 380, 11, { a0: -Math.PI / 2, goc: 0.4, w: 6, mau: VANG }); }
    const n = Math.min(500, Math.floor(clamp((tl - tCo) / 1.4) * 500));
    viet(ctx, `${n} tấm`, 1300, 420, { size: 130, mau: VANG, pop: false });
    viet(ctx, "trong 5 ngày", 1300, 560, { size: 76, mau: GIAY, u: vao(tl, m(c, 32)) });
  }
}
/* ── CÂU 25: tôi nhìn cái thớt, cái thớt nhìn tôi — ngày làm cho sếp, đêm làm cho tôi ── */
function matThot(ctx, x, y, k, t, chop2) { for (const s of [-1, 1]) { ve(ctx, elip(x + s * 40 * k, y, 22 * k, chop2 ? 3 * k : 26 * k), "#fff", { w: 4 }); if (!chop2) to(ctx, elip(x + s * 40 * k - 6 * k, y + 2 * k, 9 * k, 11 * k), MUC); } }
function c25(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tThot = m(c, 4), tBan = m(c, 8), tDem = m(c, 15);
  const chop2 = (tq % 1.3) < 0.12;
  if (tl < tBan) {
    giay(ctx);
    veNV(ctx, 560, 620, 1.2, { t, mat: tl >= tThot ? "nheo" : "thuong", nhin: [0.8, 0] });
    ctx.save(); ctx.translate(1300, 560); ctx.rotate(-0.08); D.thot(ctx, 0, 0, 1.6, "go", -Math.PI / 2); ctx.restore();
    if (tl >= tThot) { matThot(ctx, 1290, 460, 1.3, t, chop2); net(ctx, "M1240,560 C1270,580 1310,580 1340,560", { w: 6 }); tiaNhan(ctx, 920, 380, 20, 80, 3, { a0: 0, goc: 0.6, w: 6 }); viet(ctx, "…", 940, 300, { size: 140, pop: false }); }
  } else {
    const dem = tl >= tDem;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 960, H); ctx.clip();
    giay(ctx, "#fff8e1"); D.softbox(ctx, 200, 960, 0.8);
    ctx.save(); ctx.translate(480, 560); D.thot(ctx, 0, 0, 1.1, "go", -Math.PI / 2); ctx.restore(); matThot(ctx, 474, 480, 0.9, t, chop2);
    veNV(ctx, 770, 640, 0.8, { t, kieu: "sep", mat: "tuc", noi: 0, nhin: [-0.8, 0], tayT: { p: [-140, -20], cong: -20, kieu: "chi", lat: -1 } });
    ve(ctx, elip(140, 140, 60, 60), "#ffd23e", { w: 5 }); viet(ctx, "ban ngày: cho sếp", 480, 990, { size: 60, u: vao(tl, tBan) });
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(960, 0, 960, H); ctx.clip();
    if (dem) {
      D.phong(ctx, "#4d5578", "#3b405e", 860); ve(ctx, elip(1780, 140, 50, 50), "#fff3c2", { w: 5 });
      ctx.save(); ctx.translate(1440, 640); ctx.scale(1, 0.5); D.thot(ctx, 0, 0, 1.2, "go"); ctx.restore();
      for (let i = 0; i < 4; i++) D.sushi(ctx, 1340 + i * 70, 620, 0.7, i);
      matThot(ctx, 1440, 560, 0.8, t, chop2); viet(ctx, "ban đêm: cho tôi", 1440, 990, { size: 60, mau: GIAY, u: vao(tl, tDem) });
      veNV(ctx, 1720, 640, 0.75, { t, mat: "nham", nhin: [-0.8, 0.3], chan: false });
    } else { giay(ctx, "#e9e6df"); dauHoi(ctx, 1440, 600, 200, 1, "#b9b4ab"); }
    ctx.restore();
    netPts(ctx, [[960, -10], [960, H + 10]], { w: 10 });
  }
}
/* ── CÂU 26: ghế thương gia = ghế mát xa siêu thị điện máy — chị bán hàng tưởng sắp mua — tuần nào cũng sắp mua ── */
function sieuThi(ctx, t) {
  giay(ctx, "#f4f6fa"); to(ctx, rect(0, 860, W, 220, 0), "#d6dbe4"); netPts(ctx, [[-10, 860], [W + 10, 860]], { w: 6 });
  for (let i = 0; i < 6; i++) tivi(ctx, 80 + i * 300, 140, 260, 160, t, i);
  ve(ctx, rect(60, 40, 600, 70, 10), "#e2453c", { w: 5 }); viet(ctx, "ĐIỆN MÁY GIÁ RẺ", 360, 92, { size: 46, mau: "#fff", pop: false });
}
function c26(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tChup = m(c, 13), tChi = m(c, 15), tTuan = m(c, 22);
  if (tl < tChup) {
    sieuThi(ctx, t); gheMatXa(ctx, 960, 860, 1.1);
    veNV(ctx, 900, 500, 0.9, { t, mat: "sang", xoay: -0.25, chan: true, tayP: { p: [180, -10], cong: 20, kieu: "nam" } });
    gheMatXa(ctx, 960, 860, 0); ve(ctx, rect(900 - 60 * 1.1, 860 - 200 * 1.1, 340 * 1.1, 90 * 1.1, 40), "#4a4f6a", { w: 6 });
    viet(ctx, "ghế “thương gia”", 1460, 420, { size: 76, mau: DO, u: vao(tl, 0.05) }); viet(ctx, "= ghế mát xa", 1460, 520, { size: 76, u: vao(tl, m(c, 6)) });
  } else if (tl < tChi) {
    // khung ngắm điện thoại chụp sát tay vịn: nhìn y như khoang thương gia
    giay(ctx, "#1b1d29"); ctx.save(); ctx.translate(960, 540); ctx.scale(6, 6); gheTG(ctx); ctx.restore();
    net(ctx, rect(300, 140, 1320, 800, 20), { w: 5, mau: "#fff" }); for (const [x, y] of [[300, 140], [1620, 140], [300, 940], [1620, 940]]) { netPts(ctx, [[x, y], [x + (x < 960 ? 80 : -80), y]], { w: 9, mau: "#fff" }); netPts(ctx, [[x, y], [x, y + (y < 540 ? 80 : -80)]], { w: 9, mau: "#fff" }); }
    viet(ctx, "chụp sát", 960, 1030, { size: 70, mau: GIAY, u: vao(tl, tChup) }); chop(ctx, tl, tChup + 0.3, 0.6);
  } else if (tl < tTuan) {
    sieuThi(ctx, t); gheMatXa(ctx, 600, 860, 0.9);
    veNV(ctx, 560, 560, 0.8, { t, mat: "hoang", xoay: -0.2, nhin: [0.8, 0] }); moHoi(ctx, 650, 330, 0.9);
    veNV(ctx, 1250, 600, 1.15, { t, kieu: "banhang", mat: "cuoi", nhin: [-0.7, 0], tayT: { p: [-160, 10], cong: -20, kieu: "nam" } });
    ctx.save(); ctx.translate(1250 - 160 * 1.15 - 70, 600 + 10 * 1.15 - 40); ctx.rotate(-0.1); ve(ctx, rect(-110, -140, 220, 280, 6), "#fffdf5", { w: 5 }); viet(ctx, "TRẢ GÓP", 0, -80, { size: 44, mau: DO, pop: false }); viet(ctx, "0%", 0, 10, { size: 96, mau: DO, pop: false }); ctx.restore();
    viet(ctx, "tưởng sắp mua", 1540, 440, { size: 80, u: vao(tl, m(c, 18)) });
  } else {
    giay(ctx);
    for (let i = 0; i < 3; i++) {
      const u = vao(tl, tTuan + i * 0.35, 0.25); if (u <= 0) continue;
      const x = 330 + i * 630; ctx.save(); ctx.translate(x, 560); ctx.scale(back(u), back(u));
      ve(ctx, rect(-280, -300, 560, 560, 16), "#f4f6fa", { w: 6 }); viet(ctx, `tuần ${i + 1}`, 0, -230, { size: 56, pop: false });
      gheMatXa(ctx, -60, 200, 0.42); veNV(ctx, -80, 40, 0.38, { t, mat: "sang", xoay: -0.25 });
      veNV(ctx, 160, 60, 0.45, { t, kieu: "banhang", mat: ["cuoi", "thuong", "chan"][i], nhin: [-0.7, 0] });
      ctx.restore();
    }
    viet(ctx, "tuần nào cũng sắp mua", W / 2, 960, { size: 80, u: vao(tl, tTuan + 0.3) });
  }
}
/* ── CÂU 27: nghề có hai luật — một: mỗi khách một góc — để check var không bắt được ── */
function c27(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tMot = m(c, 4), tDe = m(c, 9), tKhong = m(c, 17);
  giay(ctx, "#f4efe4");
  if (tl < tDe) {
    const u = back(vao(tl, 0.05, 0.4)); ctx.save(); ctx.translate(960, 600); ctx.scale(u, u);
    bang(ctx, -260, 0, 0.95, "I", tl >= tMot ? ["mỗi khách", "một góc"] : []); bang(ctx, 260, 0, 0.95, "II", []);
    ctx.restore();
    viet(ctx, "2 luật của nghề", W / 2, 150, { size: 84, u: vao(tl, 0.1) });
    if (tl >= tMot) { for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(1600, 380 + i * 200); ctx.scale(0.42, 0.42); ctx.rotate((i - 1) * 0.5); anhSushi(ctx, 0, 0, 1, 0, { lech: i }); ctx.restore(); } }
  } else {
    const bat = tl >= tKhong;
    threadsBai(ctx, 520, 520, 0.95, t, { ten: "bảnh_A", av: { seed: 11 }, chu: ["Ăn nhẹ thôi."], anh: (g) => { g.save(); g.scale(1.5, 1.5); anhSushi(g, 0, 0, 1, 0); g.restore(); }, tim: 18 });
    threadsBai(ctx, 1400, 520, 0.95, t, { ten: "bảnh_B", av: { seed: 12 }, chu: ["Ăn nhẹ thôi."], anh: (g) => { g.save(); g.scale(-1.5, 1.5); g.rotate(0.5); anhSushi(g, 0, 0, 1, 0, { lech: 3 }); g.restore(); }, tim: 22 });
    const dx = Math.sin(tq * 3) * 300;
    veNV(ctx, 960 + dx * 0.3, 760, 0.85, { t, kieu: "thamtu", mat: bat ? "hoang" : "nheo", nhin: [Math.sign(dx) * 0.8, 0], chan: false, tayP: { p: [130, -40], cong: 20, kieu: "nam" } });
    kinhLup(ctx, 960 + dx * 0.3 + 130 * 0.85 + 60, 760 - 40 * 0.85 - 60, 0.9, -0.5);
    if (bat) { dauHoi(ctx, 1080, 520, 140, vao(tl, tKhong)); viet(ctx, "không bắt được", W / 2, 1010, { size: 80, mau: DO, u: vao(tl, tKhong) }); }
    else viet(ctx, "check var", W / 2, 1010, { size: 80, u: vao(tl, m(c, 15)) });
  }
}
/* ── CÂU 28: hai: phải có tay — shop khác toàn tay con gái móng đính đá — chỉ mỗi thằng tôi bán tay nam ── */
function c28(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tShop = m(c, 3), tKhach = m(c, 12), tCa = m(c, 18), tBan = m(c, 26);
  giay(ctx, "#f4efe4");
  if (tl < tShop) {
    const u = back(vao(tl, 0.0, 0.3)); ctx.save(); ctx.translate(960, 600); ctx.scale(u, u); bang(ctx, 0, 0, 1.05, "II", ["phải có", "tay"]); ctx.restore();
  } else if (tl < tKhach) {
    giay(ctx, "#fde8f1");
    for (let i = 0; i < 6; i++) { const u = back(vao(tl, tShop + i * 0.12, 0.25)); if (u > 0) tayNu(ctx, 200 + i * 300, 760, 1.9 * u, i * 3, t); }
    viet(ctx, "toàn tay con gái", W / 2, 170, { size: 84, mau: "#c43d7a", u: vao(tl, m(c, 5)) });
    if (tl >= m(c, 9)) viet(ctx, "móng đính đá", W / 2, 290, { size: 70, u: vao(tl, m(c, 9)) });
  } else if (tl < tCa) {
    giay(ctx, "#fde8f1");
    for (let i = 0; i < 3; i++) tayNu(ctx, 260 + i * 260, 780, 1.4, i * 3, t);
    for (let i = 0; i < 3; i++) { veNV(ctx, 1150 + i * 260, 640, 0.75, { t, kieu: "nguoi", C: { ao: ["#8fb7d9", "#a6d58a", "#e8a24a"][i], toc: ["#2a2631", "#6b3e26", "#3c4b7a"][i] }, mat: "ghet", nhin: [-0.8, 0] }); }
    viet(ctx, "khách nam muốn tay nam", W / 2, 170, { size: 76, u: vao(tl, tKhach) });
  } else {
    const sang = tl >= m(c, 21);
    giay(ctx, sang ? "#2b2f45" : "#fde8f1");
    for (let i = 0; i < 6; i++) { if (i === 3) continue; tayNu(ctx, 160 + i * 320, 780, 1.6, i * 3, t); }
    if (sang) { ctx.save(); ctx.globalAlpha = 0.3; to(ctx, "M880,-20 L1040,-20 L1260,1100 L660,1100 Z", "#fff6c4"); ctx.restore(); }
    tayNam(ctx, 1120, 760, 2.2, t);
    viet(ctx, "cả cái chợ", W / 2, 120, { size: 76, mau: sang ? GIAY : MUC, u: vao(tl, tCa) });
    if (sang) viet(ctx, "mỗi mình tôi bán tay nam", W / 2, 240, { size: 76, mau: VANG, u: vao(tl, m(c, 23)) });
  }
}
/* ── CÂU 29: nhẫn bạc mẹ mua ở cổng chùa, khắc chữ Nhẫn — hôm lên Hà Nội, mẹ đeo vào tay ── */
function c29(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tMe = m(c, 8), tKhac = m(c, 13), tHom = m(c, 18), tDeo = m(c, 26);
  if (tl < tMe) { giay(ctx, "#fff4e6"); tayCanh(ctx, 1150, 560, 1.5, t, 1, false, { dua: false }); viet(ctx, "nhẫn bạc", 520, 860, { size: 96, u: vao(tl, m(c, 6)) }); return; }
  giay(ctx, "#f3e6cf");   // hồi tưởng
  if (tl < tKhac) {
    to(ctx, rect(0, 860, W, 220, 0), "#d9c4a3"); netPts(ctx, [[-10, 860], [W + 10, 860]], { w: 6 });
    congChua(ctx, 640, 860, 1.0);
    ve(ctx, rect(1120, 600, 520, 140, 8), "#c48b5c", { w: 6 }); ve(ctx, "M1100,600 L1660,600 L1620,500 L1140,500 Z", "#e2453c", { w: 5 }); for (let i = 0; i < 6; i++) ve(ctx, elip(1170 + i * 80, 640, 18, 12), "#dfe6ee", { w: 3.5 });
    veNV(ctx, 1380, 620, 0.95, { t, kieu: "me", mat: "cuoi", nhin: [0, 0.5], tayP: { p: [90, 20], cong: 20, kieu: "nam" } });
    viet(ctx, "cổng chùa", 640, 160, { size: 76, mau: "#8a5a2a", u: vao(tl, m(c, 11)) });
  } else if (tl < tHom) {
    nhanTo(ctx, 960, 520, 2.2, t);
    viet(ctx, "khắc đúng một chữ", W / 2, 140, { size: 76, u: vao(tl, tKhac) });
  } else {
    benXe(ctx, t, { xeX: 1350, ten: "BẾN XE HUYỆN" });
    ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = "#f3e6cf"; ctx.fillRect(0, 0, W, H); ctx.restore();
    const deo = tl >= tDeo;
    veNV(ctx, 900, 640, 1.05, { t, mat: "buon", nhin: [-0.4, 0.4], tayT: { p: [-120, 60], cong: -20, kieu: "xoe" } });
    veNV(ctx, 560, 640, 1.05, { t, kieu: "me", mat: "cuoi", nhin: [0.7, 0.3], tayP: { p: [150, 60], cong: 20, kieu: "nam" } });
    if (deo) { sao(ctx, 900 - 120 * 1.05 - 10, 640 + 60 * 1.05, 26, t); viet(ctx, "mẹ đeo vào tay", 1520, 270, { size: 76, u: vao(tl, tDeo) }); }
    viet(ctx, "lên Hà Nội đi học", 1100, 120, { size: 76, mau: "#8a5a2a", u: vao(tl, m(c, 20)) });
    viet(ctx, "18 tuổi", 900, 300, { size: 56, mau: "#6b6560", u: vao(tl, tHom + 0.3) });
  }
}
/* ── CÂU 30 (MẸ): "Lên đấy cái gì cũng phải nhẫn." ── */
function c30(ctx, t, uf, c) {
  const tl = c.tl;
  benXe(ctx, t, { xeX: 1450, ten: "BẾN XE HUYỆN" });
  ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = "#f3e6cf"; ctx.fillRect(0, 0, W, H); ctx.restore();
  veNV(ctx, 960, 620, 1.2, { t, mat: "buon", nhin: [-0.6, 0.2] });
  veNV(ctx, 640, 640, 1.2, { t, kieu: "me", mat: "thuong", noi: c.noi, nhin: [0.6, -0.2], tayP: { p: [190, -10], cong: 30, kieu: "xoe", lat: -1 } });
  viet(ctx, "“Cái gì cũng", 1480, 260, { size: 76, u: vao(tl, m(c, 2)) });
  viet(ctx, "phải nhẫn.”", 1500, 380, { size: 96, mau: DO, u: vao(tl, m(c, 6) - 0.1) });
}
/* ── CÂU 31: định tháo nhẫn — khách bảo tay trơn như tay mẫu, có nhẫn mới ra người thật — người thật, nghèo thật ── */
function c31(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tKhach = m(c, 6), tU = m(c, 21), tNgheo = m(c, 25);
  if (tl < tKhach) {
    phongDem(ctx, t, { gio: 23 });
    banLamViec(ctx, t, { mat: "thuong", nhin: [0, 0.8], tayT: { p: [-30, 100], cong: -30, kieu: "nam" }, tayP: { p: [30, 100], cong: 30, kieu: "nam" } }, { den: 1, tren: (g) => tamSushi(g, 8) });
    viet(ctx, "định tháo ra…", 1360, 330, { size: 80, mau: GIAY, u: vao(tl, m(c, 2)) });
  } else if (tl < tU) {
    giay(ctx);
    ctx.save(); ctx.translate(560, 560); ve(ctx, rect(-260, -280, 520, 560, 18), "#e9eef5", { w: 6 }); ctx.restore();
    ctx.save(); ctx.translate(1360, 560); ve(ctx, rect(-260, -280, 520, 560, 18), "#fff4e6", { w: 6 }); ctx.restore();
    tayCanh(ctx, 650, 560, 0.62, t, 0, false, { nhan: false, ao: "#c9ccd3", aoB: "#a9adb5" });
    tayCanh(ctx, 1450, 560, 0.62, t, tl >= m(c, 16) ? 1 : 0, false);
    viet(ctx, "tay trơn", 560, 210, { size: 64, u: vao(tl, m(c, 9)) }); viet(ctx, "= tay mẫu", 560, 920, { size: 80, mau: "#8aa0b8", u: vao(tl, m(c, 13)) });
    if (tl >= m(c, 15)) { viet(ctx, "có nhẫn", 1360, 210, { size: 64, u: vao(tl, m(c, 15)) }); viet(ctx, "= người thật", 1360, 920, { size: 80, mau: XANH, u: vao(tl, m(c, 19)) }); }
  } else {
    giay(ctx);
    const ngheo = tl >= tNgheo;
    veNV(ctx, 960, 600, 1.2, { t, mat: ngheo ? "khoc" : "cuoi", nhin: [0, 0.5], tayT: { p: [-80, 40], cong: -30, kieu: "nam" }, tayP: { p: [80, 40], cong: 30, kieu: "nam" } });
    ve(ctx, rect(960 - 120, 600 + 10, 240, 140, 16), "#8a5a3c", { w: 6 }); to(ctx, rect(960 - 100, 600 + 30, 200, 20, 6), "#5a3a2a");
    veNV(ctx, 960, 600, 1.2, { t, chiTay: true, tayT: { p: [-90, 70], cong: -30, kieu: "nam" }, tayP: { p: [90, 70], cong: 30, kieu: "nam" } });
    if (ngheo) for (let i = 0; i < 3; i++) { const u = clamp((tl - tNgheo) * 0.8 + i * 0.15), x = 960 + (i - 1) * 60 + (i - 1 || 1) * u * 420 + Math.sin(u * 9 + i) * 30, y = 700 - u * 160; ve(ctx, `M${x},${y} C${x - 40},${y - 34} ${x - 46},${y + 14} ${x},${y + 6} C${x + 46},${y + 14} ${x + 40},${y - 34} ${x},${y} Z`, "#b9b4ab", { w: 4.5 }); to(ctx, elip(x, y + 2, 5, 12), "#6b6560"); }
    viet(ctx, "người thật", 480, 260, { size: 84, u: vao(tl, m(c, 23)) }); if (ngheo) viet(ctx, "nghèo thật", 1460, 260, { size: 96, mau: DO, u: vao(tl, tNgheo) });
  }
}
/* ── CÂU 32: mỗi tuần 1 bữa × 30 góc = 300 nghìn — cái tay nuôi thêm nửa cái mồm ── */
function c32(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tCai = m(c, 8), tNua = m(c, 13);
  if (tl < tCai) {
    giay(ctx);
    viet(ctx, "1 bữa", 360, 300, { size: 96, u: vao(tl, m(c, 2)) }); viet(ctx, "× 30 góc", 860, 300, { size: 96, u: vao(tl, m(c, 4)) }); viet(ctx, "= 300k", 1440, 300, { size: 120, mau: XANH, u: vao(tl, m(c, 6)) });
    const n = tl < m(c, 6) ? 0 : Math.min(3, 1 + Math.floor((tl - m(c, 6)) / 0.2));
    for (let i = 0; i < n; i++) D.tien(ctx, 760 + i * 200, 700 - i * 10, 1.1, 100, (i - 1) * 0.12);
    veNV(ctx, 1600, 800, 0.8, { t, mat: "cuoi", chan: false, nhin: [-0.8, 0] });
  } else {
    giay(ctx, "#fff4e6");
    const X = 960, Y = 740, K = 2.0;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, X, H); ctx.clip(); veNV(ctx, X, Y, K, { t, mat: "cuoi", chan: false }); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(X, 0, W - X, H); ctx.clip(); veNV(ctx, X, Y, K, { t, mat: "khoc", chan: false }); ctx.restore();
    netPts(ctx, [[X, Y - 95 * K - 260], [X, Y - 95 * K + 120]], { w: 4, mau: "#b9b4ab" });
    if (tl >= m(c, 10)) { ctx.save(); ctx.translate(X - 160, Y - 95 * K + 160); ctx.rotate(-0.4); ve(ctx, "M0,0 L150,-60", null, { w: 0 }); netPts(ctx, [[-220, 60], [0, 0]], { w: 12, mau: "#c9ccd3" }); ve(ctx, elip(14, -4, 34, 20), "#c9ccd3", { w: 5 }); to(ctx, elip(14, -10, 24, 10), "#fffef8"); ctx.restore(); }
    viet(ctx, "nửa cái mồm", 1500, 200, { size: 96, mau: DO, u: vao(tl, tNua) });
    viet(ctx, "cái tay nuôi", 420, 200, { size: 80, u: vao(tl, tCai) });
  }
}
/* ── CÂU 33: sáu ngày cơm ruốc, thứ bảy sushi — sushi đi làm xong một ca, nguội ngắt, vẫn là sushi ── */
function c33(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tT7 = m(c, 8), tSu = m(c, 12), tNguoi = m(c, 19), tVan = m(c, 21);
  if (tl < tSu) {
    giay(ctx);
    const ngay = ["T2", "T3", "T4", "T5", "T6", "CN", "T7"];
    viet(ctx, "lịch ăn tuần", W / 2, 140, { size: 76, u: vao(tl, 0.05) });
    for (let i = 0; i < 6; i++) { const x = 190 + (i % 3) * 330, y = 330 + Math.floor(i / 3) * 360, u = back(vao(tl, i * 0.18, 0.25)); ve(ctx, rect(x - 150, y - 110, 300, 320, 14), "#ffffff", { w: 5 }); viet(ctx, ngay[i], x, y - 50, { size: 54, pop: false }); if (u > 0) { ctx.save(); ctx.translate(x, y + 110); ctx.scale(u * 0.95, u * 0.95); batCom(ctx, 0, 0, 1, { ruoc: true }); ctx.restore(); } }
    if (tl >= tT7) { const x = 1500, y = 510, u = back(vao(tl, tT7, 0.3)); ctx.save(); ctx.globalAlpha = 0.5; to(ctx, elip(x, y, 300 * u, 300 * u), "#fff1a6"); ctx.restore(); tiaNhan(ctx, x, y, 240, 320, 16, { a0: 0, goc: 0.39, w: 6, mau: "#e8a21c" }); ve(ctx, rect(x - 210, y - 230, 420, 460, 16), "#fff8e1", { w: 7 }); viet(ctx, "T7", x, y - 150, { size: 80, mau: DO, pop: false }); ctx.save(); ctx.translate(x, y + 60); ctx.scale(u, u); ctx.save(); ctx.scale(1, 0.5); D.thot(ctx, 0, 0, 1.05); ctx.restore(); for (let i = 0; i < 4; i++) D.sushi(ctx, -105 + i * 70, -14, 0.72, i); ctx.restore(); for (let i = 0; i < 4; i++) sao(ctx, x + Math.cos(i * 1.6 + t) * 200, y + Math.sin(i * 1.6 + t) * 200, 24, t + i); }
  } else if (tl < tVan) {
    giay(ctx, "#e6f2fa");
    // miếng sushi đi làm về: đội mũ bảo hộ, đeo thẻ, rã rời
    const k = 4.2, x = 900, y = 600;
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(tq * 4) * 0.04); D.sushi(ctx, 0, 0, k, 0);
    ve(ctx, "M-120,-150 C-120,-230 120,-230 120,-150 Z", "#ffd23e", { w: 6 }); ve(ctx, rect(-150, -160, 300, 26, 10), "#ffd23e", { w: 5 });
    to(ctx, elip(-50, -10, 14, 4), MUC); to(ctx, elip(50, -10, 14, 4), MUC); net(ctx, "M-30,30 C-10,20 10,20 30,30", { w: 6 });
    ctx.restore();
    ve(ctx, rect(x + 170, y + 30, 120, 150, 8), "#ffffff", { w: 5 }); viet(ctx, "ca 1", x + 230, y + 120, { size: 44, pop: false }); netPts(ctx, [[x + 230, y - 60], [x + 230, y + 30]], { w: 4 });
    moHoi(ctx, x + 220, y - 200, 1.2);
    viet(ctx, "đi làm xong một ca", 1500, 230, { size: 70, u: vao(tl, m(c, 13)) });
    if (tl >= tNguoi) { vanLanh(ctx, x, y - 140, 200, t); viet(ctx, "nguội ngắt", 1500, 360, { size: 90, mau: "#2f7fc0", u: vao(tl, tNguoi) }); }
  } else {
    phongDem(ctx, t, { gio: 23 });
    veNV(ctx, 960, 600, 1.25, { t, mat: "sang", nhin: [0, 0.6], tayT: { p: [-60, 120], cong: -40, kieu: "xoe" }, tayP: { p: [60, 120], cong: 40, kieu: "xoe", lat: -1 } });
    ctx.save(); ctx.translate(960, 790); ctx.scale(1, 0.5); D.thot(ctx, 0, 0, 1.2); ctx.restore(); for (let i = 0; i < 4; i++) D.sushi(ctx, 840 + i * 80, 770, 0.8, i);
    for (let i = 0; i < 5; i++) { const a = t * 1.5 + i * 1.3, x = 960 + Math.cos(a) * 320, y = 420 + Math.sin(a) * 120; ve(ctx, `M${x},${y + 14} C${x - 30},${y - 10} ${x - 14},${y - 30} ${x},${y - 12} C${x + 14},${y - 30} ${x + 30},${y - 10} ${x},${y + 14} Z`, "#ff6b8a", { w: 3.5 }); }
    viet(ctx, "vẫn là sushi ♥", W / 2, 1000, { size: 84, mau: GIAY, u: vao(tl, tVan) });
  }
}
/* ── CÂU 34: gọi khách là "các bảnh" — sổ ghi "các bảnh sống ảo" — lấy tiền xong còn chửi — khiếu kinh doanh ── */
function c34(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tTrong = m(c, 6), tLay = m(c, 14), tToi = m(c, 23);
  if (tl < tTrong) {
    phongDem(ctx, t, { gio: 23 });
    veNV(ctx, 760, 600, 1.2, { t, mat: "nham", nhin: [0.6, 0.2], tayP: { p: [170, 0], cong: 20, kieu: "nam" } });
    ctx.save(); ctx.translate(760 + 170 * 1.2 + 90, 600 - 10); ctx.rotate(0.1); ve(ctx, rect(-110, -150, 220, 300, 10), "#3f7fd0", { w: 6 }); viet(ctx, "SỔ KHÁCH", 0, -40, { size: 44, mau: "#fff", pop: false }); ctx.restore();
    viet(ctx, "“các bảnh”", 1380, 480, { size: 110, mau: VANG, u: vao(tl, m(c, 4)) });
  } else if (tl < tLay) {
    giay(ctx, "#e9e1cf");
    const u = clamp((tl - m(c, 10)) / 1.0);
    soKhach(ctx, 960, 560, 1.7, tl, { chu: "các bảnh", u: vao(tl, m(c, 10)) });
    if (tl >= m(c, 12)) viet(ctx, "sống ảo", 960 + 210 * 1.7, 560 + 60 * 1.7, { size: 120, mau: DO, u: vao(tl, m(c, 12)), xoay: 0.04 });
    const bx = 960 + (150 + u * 260) * 1.7 - 400, by = 560 + 30 * 1.7; ctx.save(); ctx.translate(bx, by); ctx.rotate(-0.7); ve(ctx, rect(-10, -120, 20, 130, 6), "#e0392f", { w: 4 }); ve(ctx, "M-10,10 L10,10 L0,34 Z", "#f4d8b0", { w: 3 }); ctx.restore();
  } else if (tl < tToi) {
    phongDem(ctx, t, { gio: 23 });
    veNV(ctx, 960, 600, 1.25, { t, mat: "deu", nhin: [0.3, 0], tayT: { p: [-150, -60], cong: -20, kieu: "nam" }, tayP: { p: [150, 30], cong: 20, kieu: "chi" } });
    D.tien(ctx, 960 - 150 * 1.25 - 40, 600 - 60 * 1.25 - 40, 0.75, 10, -0.4);
    viet(ctx, "lấy tiền xong", 480, 990, { size: 76, mau: GIAY, u: vao(tl, tLay) }); viet(ctx, "còn chửi", 1450, 990, { size: 90, mau: VANG, u: vao(tl, m(c, 20)) });
  } else {
    giay(ctx, "#2b2f45");
    for (let i = 0; i < 10; i++) { const q = rng(1150 + i); sao(ctx, q() * W, q() * 700, 12 + q() * 10, t + i); }
    D.gheNhua(ctx, 960, 980, 1.6);
    veNV(ctx, 960, 620, 1.2, { t, mat: "nham", nhun: -Math.abs(Math.sin(tq * 6)) * 6, tayT: { p: [-160, 60], cong: -20, kieu: "nam" }, tayP: { p: [150, -40], cong: 30, kieu: "like" } });
    kinhDen(ctx, 960, 620 - 95 * 1.2 + 10 * 1.2, 1.2);
    net(ctx, "M880,640 C900,690 1020,690 1040,640", { w: 9, mau: "#f4c430" }); to(ctx, elip(960, 690, 16, 16), "#f4c430");
    viet(ctx, "có khiếu", 420, 300, { size: 96, mau: VANG, u: vao(tl, m(c, 27)) }); viet(ctx, "kinh doanh", 1500, 300, { size: 96, mau: VANG, u: vao(tl, m(c, 28)) });
  }
}

export const CANH = { 9: c9, 10: c10, 11: c11, 12: c12, 13: c13, 14: c14, 15: c15, 16: c16, 17: c17, 18: c18, 19: c19, 20: c20, 21: c21, 22: c22, 23: c23,
  24: c24, 25: c25, 26: c26, 27: c27, 28: c28, 29: c29, 30: c30, 31: c31, 32: c32, 33: c33, 34: c34 };
