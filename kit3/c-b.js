// Cảnh câu 35–53 (chương 5 "Khách đêm", chương 6 "Ảnh cho mẹ"). m(c, i) = giây của chữ thứ i (xem moc-doc.md).
// Bí mật: khách đêm = anh Tuấn → chương này KHÔNG lộ mặt khách: chỉ avatar "T.", thông báo tiền, tin nhắn, bóng đen dấu hỏi.
import { W, H, MUC, GIAY, giay, viet, doRong, ve, vePts, net, netPts, to, toPts, bong, elip, rect, moHoi, gan, sao, tiaNhan, rung, dauHoi,
  T12, clamp, lerp, eio, eout, back, pha, on, rng } from "./but.js";
import { m, mc, vao, cam, lac, chop, toi, muiTen, khoanh, gachCheo, duaDua, avatar, hoa, anhSushi, tayCanh, phongDem, phongNgay,
  HX, HY, HK, local, banLamViec, tamSushi, nhaMe, zalo, threadsBai, thongBaoTien, loRuoc, batCom, D, veNV, banTay, DA } from "./chung.js";

const VANG = "#ffd93b", DO = "#e0392f", XANH = "#2f9e57";

/* ── đồ vẽ riêng của chương 5–6 ── */
function dtNam(ctx, x, y, k, sang = 0, t = 0) {   // điện thoại dựng trên bàn, màn hình sáng khi có tiền
  D.dienThoai(ctx, x, y, k, 0.12, (g) => {
    g.fillStyle = sang ? "#ffffff" : "#20243a"; g.fillRect(-80, -140, 160, 280);
    if (sang) { to(g, rect(-60, -40, 120, 80, 14), XANH); viet(g, "+10k", 0, 14, { size: 44, mau: "#fff", pop: false }); }
  });
  if (sang) tiaNhan(ctx, x + 14, y - 10, 120 * k * 1.6, 180 * k * 1.6, 9, { a0: -Math.PI / 2, goc: 0.4, mau: VANG, w: 5 });
}
function ma(ctx, x, y, k, t) {   // con ma "+10k" bay lên từ điện thoại
  ctx.save(); ctx.translate(x, y + Math.sin(t * 4) * 10); ctx.scale(k, k);
  ve(ctx, "M-70,60 L-70,-20 C-70,-80 70,-80 70,-20 L70,60 L46,44 L24,62 L0,44 L-24,62 L-46,44 Z", "#ffffff", { w: 6 });
  to(ctx, elip(-24, -16, 10, 14), MUC); to(ctx, elip(24, -16, 10, 14), MUC); ve(ctx, elip(0, 16, 12, 9), "#8b3a3a", { w: 3.5 });
  viet(ctx, "+10k", 0, 50, { size: 28, mau: XANH, pop: false });
  ctx.restore();
}
function bongChat(ctx, x, y, dong, o = {}) {   // bong bóng tin nhắn, (x,y) = góc trên trái
  const size = o.size ?? 50, u = o.u ?? 1; if (u <= 0) return;
  const w = Math.max(...dong.map((s) => doRong(ctx, s, size))) + 64, h = dong.length * size * 1.22 + 40;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(back(u), back(u)); ctx.translate(-x - w / 2, -y - h / 2);
  ve(ctx, rect(x, y, w, h, 30), o.nen ?? "#ffffff", { w: 5 });
  ve(ctx, `M${x + 26},${y + h - 4} L${x - 8},${y + h + 26} L${x + 56},${y + h - 4} Z`, o.nen ?? "#ffffff", { w: 0 });
  netPts(ctx, [[x + 24, y + h - 2], [x - 8], [x + 56, y + h - 2]].map((p, i) => i === 1 ? [x - 8, y + h + 26] : p), { w: 5 });
  dong.forEach((s, i) => viet(ctx, s, x + 32, y + 26 + size * 0.88 + i * size * 1.22, { size, pop: false, can: "left", mau: o.mau ?? MUC }));
  ctx.restore();
}
function saoKe(ctx, x, y, k, dong, o = {}) {   // sao kê ngân hàng
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const h = 130 + dong.length * 84;
  ve(ctx, rect(-330, -h / 2, 660, h, 22), "#ffffff", { w: 5 });
  to(ctx, rect(-322, -h / 2 + 8, 644, 80, 16), XANH); viet(ctx, o.tieuDe ?? "Lịch sử giao dịch", 0, -h / 2 + 64, { size: 46, mau: "#fff", pop: false });
  dong.forEach((r, i) => {
    const yy = -h / 2 + 140 + i * 84, u = r.u ?? 1; if (u <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(u * 2);
    viet(ctx, r.so ?? "+10.000", -296, yy + 12, { size: 44, mau: XANH, pop: false, can: "left" });
    viet(ctx, r.ten ?? "PHAM VAN DUNG", -76, yy + 10, { size: 34, pop: false, can: "left" });
    viet(ctx, r.gio ?? "23:40", 300, yy + 10, { size: 30, mau: "#8a8f9c", pop: false, can: "right" });
    netPts(ctx, [[-306, yy + 40], [306, yy + 40]], { w: 2, mau: "#e3e6ea", seed: 700 + i });
    ctx.restore();
  });
  ctx.restore(); return h * k;
}
function hoSoT(ctx, x, y, k, u = 1) {   // hồ sơ Threads của "T." — không ảnh, không bài
  if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k * back(u), k * back(u));
  ve(ctx, rect(-260, -240, 520, 480, 26), "#ffffff", { w: 5 });
  avatar(ctx, 0, -110, 86, 0, { chu: "T.", mau: "#2a2631" });
  viet(ctx, "T.", 0, 60, { size: 84, pop: false }); viet(ctx, "0 bài viết · 0 theo dõi", 0, 122, { size: 34, mau: "#8a8f9c", pop: false });
  ve(ctx, rect(-170, 158, 340, 58, 29), "#2a2631", { w: 3 }); viet(ctx, "Theo dõi", 0, 198, { size: 34, mau: "#fff", pop: false });
  ctx.restore();
}
function toLich(ctx, x, y, k, ngay, dong, xoay = 0, alpha = 1) {   // tờ lịch bloc "THỨ BẢY"
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k); ctx.globalAlpha *= alpha;
  ve(ctx, rect(-270, -310, 540, 620, 14), "#fffdf5", { w: 6 });
  to(ctx, rect(-262, -302, 524, 112, 10), "#e2533f"); viet(ctx, "THỨ BẢY", 0, -222, { size: 74, mau: "#fff", pop: false });
  viet(ctx, ngay, 0, -50, { size: 150, pop: false, soi: false });
  dong.forEach((r, i) => { if ((r.u ?? 1) > 0) viet(ctx, r.s, -226, 50 + i * 64, { size: 48, mau: r.mau ?? MUC, pop: false, can: "left", alpha: clamp((r.u ?? 1) * 2) }); });
  for (const s of [-1, 1]) ve(ctx, rect(s * 150 - 14, -330, 28, 54, 10), "#9aa0ab", { w: 4 });
  ctx.restore();
}
function bongNguoi(ctx, x, y, k, t) {   // bóng người không tên (không lộ mặt)
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 4); ctx.scale(k, k);
  ve(ctx, "M-92,170 C-96,80 -84,24 -54,6 C-24,-6 24,-6 54,6 C84,24 96,80 92,170 Z", "#2b2d42", { w: 6 });
  ve(ctx, "M-120,-80 C-124,-170 -64,-214 0,-214 C64,-214 124,-170 120,-80 C118,-20 80,10 0,10 C-80,10 -118,-20 -120,-80 Z", "#2b2d42", { w: 6 });
  viet(ctx, "?", 0, -50, { size: 150, mau: GIAY, pop: false, dam: 0.08 });
  ctx.restore();
}
function tayCamDT(ctx, x, y, k, manHinh, o = {}) {   // điện thoại to giữa khung + hai bàn tay cầm hai bên (góc nhìn của Hiếu)
  D.dienThoai(ctx, x, y, k, o.xoay ?? 0, manHinh);
  for (const s of [-1, 1]) {
    const hx = x + s * 92 * k, hy = y + 70 * k, a = s < 0 ? -1.15 : Math.PI + 1.15;
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(a + Math.PI); ve(ctx, rect(0, -26 * k * 0.5, 900, 52 * k * 0.5, 22), o.ao ?? "#f2b544", { w: 6 }); ctx.restore();
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(a); ctx.scale(k * 0.95, k * 0.95); banTay(ctx, "nam", s < 0 ? 1 : -1); ctx.restore();
  }
}
function loa(ctx) { ve(ctx, "M10,-16 L86,-46 L86,46 L10,16 Z", "#e2453c", { w: 5 }); ve(ctx, elip(86, 0, 10, 46), "#ffffff", { w: 4 }); ve(ctx, rect(-6, -12, 20, 24, 4), "#4a4f5e", { w: 4 }); }
function caTram(ctx, x, y, k, o = {}) {   // cá trắm ngoi lên
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.xoay ?? 0); ctx.scale(k, k);
  ve(ctx, "M-150,0 L-230,-64 L-206,0 L-230,64 Z", "#6f8a5e", { w: 5 });
  ve(ctx, "M-160,0 C-130,-74 60,-84 130,-22 C150,0 150,22 130,32 C60,84 -130,74 -160,0 Z", "#93a97e", { w: 6 });
  bong(ctx, "M-160,0 C-130,-74 60,-84 130,-22 C150,0 150,22 130,32 C60,84 -130,74 -160,0 Z", "M-170,10 L160,10 L160,90 L-170,90 Z", "#c9d6b4");
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) net(ctx, `M${-90 + i * 44},${-24 + j * 28} C${-80 + i * 44},${-14 + j * 28} ${-80 + i * 44},${-4 + j * 28} ${-90 + i * 44},${6 + j * 28}`, { w: 3, mau: "#5e7a4e", seed: 760 + i * 3 + j });
  ve(ctx, elip(84, -14, 24, 26), "#ffffff", { w: 4.5 }); to(ctx, elip(90 + (o.nhin ?? 0) * 8, -12, 10, 12), MUC); to(ctx, elip(86, -18, 4, 4), "#fff");
  ve(ctx, "M126,12 C136,20 136,30 124,32 Z", "#8b3a3a", { w: 3.5 });
  ctx.restore();
}
function banNhau(ctx, x, y) {   // bàn nhựa đỏ quán nhậu: chai bia, đĩa lạc, cốc
  ve(ctx, rect(x - 330, y, 660, 40, 8), "#e2533f", { w: 6 }); for (const s of [-1, 1]) ve(ctx, rect(x + s * 280 - 16, y + 36, 32, 220, 6), "#c9452f", { w: 5 });
  for (const [dx, h] of [[-250, 170], [-190, 150], [200, 170]]) { ve(ctx, `M${x + dx - 26},${y} L${x + dx - 26},${y - h + 60} C${x + dx - 26},${y - h + 30} ${x + dx - 10},${y - h + 24} ${x + dx - 10},${y - h} L${x + dx + 10},${y - h} C${x + dx + 10},${y - h + 24} ${x + dx + 26},${y - h + 30} ${x + dx + 26},${y - h + 60} L${x + dx + 26},${y} Z`, "#4f9a5a", { w: 5 }); to(ctx, rect(x + dx - 20, y - h + 70, 40, 34, 4), "#f2e6c4"); }
  ve(ctx, elip(x + 60, y - 10, 90, 20), "#ffffff", { w: 5 }); for (let i = 0; i < 9; i++) to(ctx, elip(x + 20 + (i % 5) * 18, y - 18 + Math.floor(i / 5) * 8, 7, 5), "#c98d4e");
  ve(ctx, "M240,0 L250,-70 L310,-70 L320,0 Z".replace(/(-?\d+),(-?\d+)/g, (s, a, b) => `${x + +a - 20},${y + +b}`), "rgba(240,190,90,0.8)", { w: 4.5 });
}
function muiTenCam(ctx, x0, y0, x1, y1, u) {   // mũi tên bay rồi cắm phập
  if (u <= 0) return; const e = eout(u), x = lerp(x0, x1, e), y = lerp(y0, y1, e), a = Math.atan2(y1 - y0, x1 - x0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  ve(ctx, rect(-260, -7, 250, 14, 6), "#9c6a44", { w: 4 }); ve(ctx, "M-10,-26 L40,0 L-10,26 Z", "#9aa0ab", { w: 5 });
  ve(ctx, "M-260,-7 L-300,-36 L-232,-7 Z", DO, { w: 4 }); ve(ctx, "M-260,7 L-300,36 L-232,7 Z", DO, { w: 4 });
  ctx.restore();
}
function lua(ctx, x, y, s, t) {   // lửa phẳng
  for (let i = 0; i < 5; i++) { const ox = (i - 2) * 70 * s, h = (180 + Math.sin(t * 9 + i * 2) * 40) * s; ve(ctx, `M${x + ox - 50 * s},${y} C${x + ox - 60 * s},${y - h * 0.5} ${x + ox},${y - h * 0.6} ${x + ox},${y - h} C${x + ox + 10 * s},${y - h * 0.6} ${x + ox + 60 * s},${y - h * 0.5} ${x + ox + 50 * s},${y} Z`, i % 2 ? "#ff9b3d" : "#ffcf4a", { w: 4, seed: 780 + i }); }
}
function nhan(ctx, x, y, k, chu = true) {   // nhẫn bạc phóng to, khắc chữ "Nhẫn"
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, elip(0, 0, 150, 150), "#fffdf5", { w: 6 });
  ve(ctx, rect(-110, -46, 220, 92, 40), "#dfe6ee", { w: 6 }); to(ctx, rect(-90, -34, 70, 14, 7), "#ffffff");
  if (chu) viet(ctx, "Nhẫn", 0, 22, { size: 60, mau: "#5f6672", pop: false, soi: false });
  ctx.restore();
}
function thePost(ctx, x, y, k, seed, sticker = 0, t = 0) {   // bài Threads mini + nhãn "Ăn nhẹ thôi."
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, rect(-150, -130, 300, 260, 18), "#ffffff", { w: 5, seed });
  avatar(ctx, -112, -96, 22, seed); to(ctx, rect(-80, -108, 120, 12, 6), "#c9ccd3"); to(ctx, rect(-80, -88, 80, 10, 5), "#dfe2e7");
  ctx.save(); ctx.translate(0, 26); ctx.scale(0.62, 0.62); anhSushi(ctx, 0, 0, 1, 0, { lech: seed % 4 }); ctx.restore();
  if (sticker > 0) { ctx.save(); ctx.translate(30, 74); ctx.rotate(-0.12); ctx.scale(back(sticker), back(sticker)); ve(ctx, rect(-110, -30, 220, 60, 8), VANG, { w: 4 }); viet(ctx, "Ăn nhẹ thôi.", 0, 14, { size: 38, pop: false, soi: false }); ctx.restore(); }
  ctx.restore();
}
function anhTho(g) {   // nội dung ảnh mâm sushi (không viền polaroid) để phóng to trong màn hình
  g.fillStyle = "#2f3550"; g.fillRect(-260, -220, 520, 440);
  g.save(); g.translate(0, -18); g.scale(1, 0.55); D.thot(g, 0, 0, 0.85); g.restore();
  for (let i = 0; i < 8; i++) D.sushi(g, -96 + (i % 4) * 64, -40 + Math.floor(i / 4) * 32, 0.55, i);
  tayCanh(g, 150, 70, 0.32, 0, 0, false);
}
function nguoiVest(ctx, x, y, k, t, seed) {   // khách sang mặc vest (không phải anh Tuấn: tóc ngắn, kính)
  const q = rng(seed);
  veNV(ctx, x, y, k, { t, kieu: "nguoi", mat: "sang", kinh: q() > 0.4, C: { ao: ["#2f3e66", "#3a3a44", "#5a2f4a"][seed % 3], aoB: "#20263f", kAo: "vest", kToc: q() > 0.5 ? "ngan" : "dai", toc: ["#2a2631", "#6b3e26", "#3c4b7a"][seed % 3] }, chan: false });
}
function banOmakase(ctx, x, y, w) { ve(ctx, rect(x - w / 2, y, w, 44, 8), "#d9b48a", { w: 5 }); to(ctx, rect(x - w / 2, y + 44, w, 400, 0), "#7a5238"); net(ctx, `M${x - w / 2},${y + 44} L${x + w / 2},${y + 44}`, { w: 4 }); }

/* ── CÂU 35: khách quen mua đúng 23:40 thứ bảy, không mặc cả → sợ như gặp ma ── */
function c35(ctx, t, uf, c) {
  const tl = c.tl, t1140 = m(c, 5), tChi = m(c, 9), tDeo = m(c, 14), tNguoi = m(c, 17), tSo = m(c, 29);
  if (tl < tChi) {
    ctx.save(); cam(ctx, 1110, 470, lerp(1.12, 1.22, eio(tl / tChi)));
    phongDem(ctx, t, { gio: 23, phut: 40 }); toi(ctx, 0.08);
    const tin = tl >= t1140;
    banLamViec(ctx, t, { mat: tin ? "ngac" : "chan", nhin: tin ? [0.6, 0.5] : [0, 0.4] }, { den: 1, thot: true, tren: (g) => { tamSushi(g, 8); dtNam(g, 1290, 548, 0.42, tin ? 1 : 0, t); } });
    viet(ctx, "23:40", 760, 330, { size: 70, mau: VANG, u: vao(tl, t1140), xoay: -0.05 });
    ctx.restore();
    if (tin) thongBaoTien(ctx, 960, lerp(-120, 130, eout(vao(tl, t1140, 0.3))), 1.05, { so: "+10.000 VND", phu: "23:40 · Thứ Bảy" });
  } else if (tl < tNguoi) {
    // chỉ lấy ảnh mới nhất, đéo mặc cả
    giay(ctx, "#eef2f8");
    D.dienThoai(ctx, 700, 560, 3.0, 0, (g) => {
      g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280); to(g, rect(-80, -140, 160, 34, 0), "#2a2631");
      avatar(g, -58, -123, 11, 0, { chu: "T.", mau: "#4a4f5e" }); viet(g, "T.", -36, -116, { size: 18, mau: "#fff", pop: false, can: "left" });
      ve(g, rect(-66, -86, 110, 30, 10), "#eef0f3", { w: 2 }); viet(g, "Ảnh mới nhất.", -58, -66, { size: 15, pop: false, can: "left", soi: false });
      if (tl >= m(c, 11)) { g.save(); g.translate(-6, 6); g.scale(0.36, 0.36); anhSushi(g, 0, 0, 1, 0.03, { tay: true }); g.restore(); viet(g, "mới nhất", -60, 76, { size: 15, mau: "#8a8f9c", pop: false, can: "left", soi: false }); }
      if (tl >= tDeo) { ve(g, rect(-66, 88, 100, 34, 10), "#e4f5e8", { w: 2 }); viet(g, "+10.000đ", -58, 111, { size: 17, mau: XANH, pop: false, can: "left", soi: false }); }
    });
    viet(ctx, "ảnh mới nhất", 1440, 260, { size: 84, u: vao(tl, m(c, 11)), xoay: -0.04 });
    if (tl >= tDeo) {
      bongChat(ctx, 1150, 420, ["“8 nghìn được không?”"], { size: 46, u: vao(tl, tDeo, 0.2), nen: "#f3f0e8" });
      gachCheo(ctx, 1130, 440, 1720, 530, vao(tl, tDeo + 0.25, 0.25)); gachCheo(ctx, 1130, 530, 1720, 440, vao(tl, tDeo + 0.4, 0.25));
      viet(ctx, "đéo mặc cả", 1450, 720, { size: 110, mau: DO, u: vao(tl, tDeo + 0.3), xoay: 0.05 });
    }
  } else {
    // người Việt không mặc cả 10 nghìn → Hiếu lùi lại như gặp ma
    ctx.save(); cam(ctx, 1060, 500, 1.1); lac(ctx, tl, tSo, 10);
    phongDem(ctx, t, { gio: 23, phut: 41 }); toi(ctx, 0.12);
    banLamViec(ctx, t, null, { den: 1, thot: true, tren: (g) => { tamSushi(g, 8); dtNam(g, 1290, 548, 0.42, 1, t); } });
    const u = eout(vao(T12(tl), tNguoi, 0.5));
    veNV(ctx, lerp(1560, 1680, u), 640, 1.05, { t, mat: tl >= tSo - 0.4 ? "hoang" : "ngac", xoay: lerp(0, 0.16, u), nhin: [-0.8, 0.2], tayT: { p: [-150, -30], cong: -20, kieu: "xoe" }, tayP: { p: [120, -60], cong: 20, kieu: "xoe", lat: -1 } });
    moHoi(ctx, 1560, 360, 1.1); if (tl >= tSo) moHoi(ctx, 1800, 400, 0.9, -0.3);
    if (tl >= tNguoi + 0.6) ma(ctx, 1300, lerp(520, 300, eout(vao(tl, tNguoi + 0.6, 0.8))), 1.1, t);
    ctx.restore();
    viet(ctx, "không mặc cả 10 nghìn?", 620, 140, { size: 72, mau: GIAY, u: vao(tl, m(c, 20)) });
    if (tl >= tSo) viet(ctx, "hơi sợ…", 620, 960, { size: 96, mau: VANG, u: vao(tl, tSo), xoay: -0.05 });
  }
}
/* ── CÂU 36: tiền từ "Phạm Văn Dũng", Threads tên "T." ── */
function c36(ctx, t, uf, c) {
  const tl = c.tl, tPham = m(c, 7), tThr = m(c, 11), tT = m(c, 14);
  giay(ctx);
  saoKe(ctx, 560, 430, 1.25, [{ u: vao(tl, 0.05) }, { u: vao(tl, 0.15), gio: "23:41" }, { u: vao(tl, 0.25), gio: "23:40" }]);
  if (tl >= tPham) { khoanh(ctx, 602, 406, 165, 40, vao(tl, tPham, 0.4)); viet(ctx, "Phạm Văn Dũng", 560, 790, { size: 84, mau: DO, u: vao(tl, tPham + 0.1) }); }
  hoSoT(ctx, 1420, 450, 0.95, vao(tl, tThr, 0.3));
  if (tl >= tT) { muiTen(ctx, 980, 330, 1160, 330, vao(tl, tT, 0.25), DO); dauHoi(ctx, 1070, 290, 110, vao(tl, tT + 0.1)); viet(ctx, "tên “T.”", 1420, 790, { size: 84, u: vao(tl, tT) }); }
  veNV(ctx, 1000, 1000, 0.8, { t, mat: tl >= tT ? "nheo" : "thuong", nhin: [tl >= tThr ? 0.8 : -0.8, -0.5], chan: false, tayT: { p: [-120, -150], cong: -20, kieu: "chi", lat: -1 } });
}
/* ── CÂU 37: tiền người khác cũng được, miễn tiền thật — kệ mẹ ── */
function c37(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tMien = m(c, 8), tKe = m(c, 12);
  giay(ctx, "#fff6dc");
  const nhun = Math.abs(Math.sin(tq * 5)) * 10;
  veNV(ctx, 960, 600, 1.15, { t, mat: tl >= tKe ? "deu" : "nham", ngh: tl >= tKe ? 0.12 : 0, nhun: -nhun, tayT: { p: [-160, -30], cong: -40, kieu: "xoe" }, tayP: { p: [160, -50], cong: 40, kieu: "xoe", lat: -1 } });
  for (const s of [-1, 1]) net(ctx, `M${960 + s * 100},${560 - 20 - nhun} C${960 + s * 120},${540 - 30 - nhun} ${960 + s * 140},${540 - 30 - nhun} ${960 + s * 160},${560 - 20 - nhun}`, { w: 4, mau: "#b9b4ab" });
  if (tl >= tMien) {   // búng đồng xu
    const u = clamp((tl - tMien) / 0.9), x = 960 + 160 * 1.15 + 30, y = 600 - 50 * 1.15 - Math.sin(u * Math.PI) * 300 - 30, sx = Math.abs(Math.cos(tl * 14));
    ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.15, sx), 1); ve(ctx, elip(0, 0, 44, 44), "#f2c23a", { w: 5 }); if (sx > 0.4) viet(ctx, "đ", 0, 16, { size: 50, mau: "#b8862a", pop: false, soi: false }); ctx.restore();
    viet(ctx, "tiền thật ✓", 1500, 250, { size: 84, mau: XANH, u: vao(tl, tMien + 0.1), xoay: 0.05 });
  }
  viet(ctx, "tiền người khác?", 430, 250, { size: 76, u: vao(tl, m(c, 4)), xoay: -0.05 });
  if (tl >= tKe) viet(ctx, "kệ mẹ.", 1500, 860, { size: 120, mau: DO, u: vao(tl, tKe), xoay: -0.04 });
}
/* ── CÂU 38: tuần nào cũng thế — lịch thứ bảy lật; khách quen là người không tên ── */
const NGAY = ["7/6", "14/6", "21/6", "28/6", "5/7", "12/7", "19/7", "26/7", "2/8", "9/8"];
function c38(ctx, t, uf, c) {
  const tl = c.tl, tKhach = m(c, 14), tDeo = m(c, 22);
  if (tl < tKhach) {
    giay(ctx, "#f3efe6");
    const dong = [{ s: "23:40", mau: "#4a4f5e", u: vao(tl, m(c, 4)) }, { s: "PHAM VAN DUNG", u: vao(tl, m(c, 5)) }, { s: "+10.000", mau: XANH, u: vao(tl, m(c, 8)) }, { s: "Nội dung: (trống)", mau: "#8a8f9c", u: vao(tl, m(c, 10)) }];
    const buoc = 0.55, p = clamp(Math.floor((tl - 0.2) / buoc), 0, NGAY.length - 1), fu = ((tl - 0.2) % buoc) / 0.3;
    toLich(ctx, 960, 560, 0.95, NGAY[p], dong);
    if (tl > 0.2 + buoc && p > 0 && fu < 1) { const e = eio(fu); toLich(ctx, 960 + e * 700, 560 - e * 500, 0.95, NGAY[p - 1], dong, e * 1.1, 1 - e); }
    viet(ctx, "tuần nào", 360, 250, { size: 84, u: vao(tl, 0.05), xoay: -0.06 }); viet(ctx, "cũng thế", 380, 350, { size: 84, u: vao(tl, m(c, 2)), xoay: -0.03 });
    veNV(ctx, 1600, 760, 0.8, { t, mat: "chan", nhin: [-0.7, -0.2], chan: false });
  } else {
    giay(ctx, "#e7e3ef");
    bongNguoi(ctx, 1280, 620, 1.15, t);
    veNV(ctx, 560, 640, 1.05, { t, mat: tl >= tDeo ? "hoang" : "nheo", nhin: [0.8, -0.2], tayP: { p: [200, -30], cong: 20, kieu: "chi" } });
    if (tl >= tDeo) moHoi(ctx, 680, 400, 1);
    viet(ctx, "khách quen nhất", 1280, 160, { size: 76, u: vao(tl, tKhach) });
    if (tl >= tDeo) viet(ctx, "đéo có tên", 1280, 1010, { size: 100, mau: DO, u: vao(tl, tDeo), xoay: 0.04 });
  }
}
/* ── CÂU 39: khách mua cả caption — Hiếu gõ "Tự thưởng cho mình chút, ăn nhẹ thôi." ── */
function c39(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tViet = m(c, 8), tHet = m(c, 15) + 0.35, tNhan = m(c, 16);
  giay(ctx, "#fbf3e4");
  const cau = "Tự thưởng cho mình chút, ăn nhẹ thôi.", n = Math.floor(clamp((tl - tViet) / (tHet - tViet)) * cau.length), go = cau.slice(0, n);
  const rungx = tl >= tNhan ? (Math.floor(tq * 12) % 2 ? 6 : -6) : 0;
  tayCamDT(ctx, 760 + rungx, 600, 2.7, (g) => {
    g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280); viet(g, "Bài viết mới", -62, -100, { size: 17, pop: false, can: "left", soi: false });
    g.save(); g.translate(0, -40); g.scale(0.34, 0.34); anhSushi(g, 0, 0, 1, 0, { tay: true }); g.restore();
    ve(g, rect(-68, 22, 136, 86, 8), "#f3f4f7", { w: 2 });
    const dong = ["Tự thưởng cho", "mình chút,", "ăn nhẹ thôi."].reduce((a, s) => { const b = a.k; a.k += s.length + 1; a.r.push(go.slice(b, Math.min(go.length, b + s.length))); return a; }, { k: 0, r: [] }).r;   // xuống dòng theo chữ
    const d1 = dong[0], d2 = dong[1], d3 = dong[2];
    [d1, d2.trimStart(), d3.trimStart()].forEach((d, i) => { if (d) viet(g, d, -62, 44 + i * 22, { size: 17, pop: false, can: "left", soi: false }); });
    if (Math.floor(tl * 3) % 2 === 0 && tl < tNhan) { const li = d3 ? 2 : d2 ? 1 : 0, cx = -62 + doRong(g, [d1, d2.trimStart(), d3.trimStart()][li], 17); netPts(g, [[cx + 2, 30 + li * 22], [cx + 2, 48 + li * 22]], { w: 1.5 }); }
    if (tl >= tNhan) { ctx.save(); ve(g, rect(-72, -136, 144, 40, 10), "#2a2631", { w: 2 }); avatar(g, -54, -116, 12, 0, { chu: "T.", mau: "#4a4f5e" }); viet(g, "T. vừa nhắn tin", -36, -110, { size: 14, mau: "#fff", pop: false, can: "left", soi: false }); ctx.restore(); }
  });
  if (tl >= tNhan) rung(ctx, 760, 560, 440, 2);
  viet(ctx, "mua cả caption", 1470, 250, { size: 80, u: vao(tl, m(c, 3) - 0.1), xoay: 0.04 });
  if (tl >= m(c, 2)) viet(ctx, "+ chữ", 1470, 360, { size: 64, mau: XANH, u: vao(tl, m(c, 3)) });
  if (tl >= tNhan) viet(ctx, "khách nhắn…", 1470, 820, { size: 84, mau: DO, u: vao(tl, tNhan), xoay: -0.04 });
}
/* ── CÂU 40: KHÁCH ĐÊM: "Bỏ chữ tự thưởng đi em. Người giàu thật không phải tự thưởng." → Hiếu được khai sáng ── */
function c40(ctx, t, uf, c) {
  const tl = c.tl, tNguoi = m(c, 6);
  giay(ctx, "#ffe7a3");
  const cx = 1450, cy = 500;
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2 + t * 0.15, b = a + 0.12; to(ctx, `M${cx},${cy} L${cx + Math.cos(a) * 1600},${cy + Math.sin(a) * 1600} L${cx + Math.cos(b) * 1600},${cy + Math.sin(b) * 1600} Z`, "#fff4cc"); }
  avatar(ctx, 150, 250, 54, 0, { chu: "T.", mau: "#2a2631" });
  bongChat(ctx, 230, 150, ["Bỏ chữ “tự thưởng”", "đi em."], { size: 54, u: vao(tl, 0.0) });
  if (tl >= tNguoi) { avatar(ctx, 150, 650, 54, 0, { chu: "T.", mau: "#2a2631" }); bongChat(ctx, 230, 530, ["Người giàu thật", "không phải tự thưởng."], { size: 54, u: vao(tl, tNguoi) }); }
  const sang = tl >= tNguoi;
  veNV(ctx, cx, 640, 1.2, { t, mat: sang ? "ngac" : "thuong", nhin: [-0.6, 0], noi: sang ? 0.8 : 0, tayT: { p: [-120, -120], cong: -20, kieu: "xoe" }, tayP: { p: [120, -120], cong: 20, kieu: "xoe", lat: -1 } });
  if (sang) { for (let i = 0; i < 6; i++) sao(ctx, cx + Math.cos(i * 1.05 + t) * 300, 380 + Math.sin(i * 1.05 + t) * 180, 26, t + i); viet(ctx, "ồ…", cx + 280, 260, { size: 110, u: vao(tl, tNguoi + 0.4), xoay: 0.08 }); }
}
/* ── CÂU 41: hay vãi chưởng → bán câu "Ăn nhẹ thôi." cho mọi bảnh ── */
function c41(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tTu = m(c, 3), tAn = m(c, 15);
  if (tl < tTu) {
    giay(ctx, "#fff4cc"); for (let i = 0; i < 8; i++) sao(ctx, 960 + Math.cos(i * 0.8) * 520, 480 + Math.sin(i * 0.8) * 320, 24, t + i);
    veNV(ctx, 960, 760, 1.6, { t, mat: "cuoi", nhun: -Math.abs(Math.sin(tq * 9)) * 10, chan: false, tayP: { p: [150, -120], cong: 30, kieu: "like" }, tayT: { p: [-150, -120], cong: -30, kieu: "like", lat: -1 } });
    viet(ctx, "hay vãi chưởng!", 1500, 200, { size: 96, mau: DO, u: vao(tl, 0.05), xoay: 0.05 });
  } else {
    giay(ctx);
    for (let i = 0; i < 8; i++) { const x = 330 + (i % 4) * 420, y = 270 + Math.floor(i / 4) * 330; thePost(ctx, x, y, 1.0, 900 + i * 7, vao(tl, tTu + 0.6 + i * 0.16, 0.2), t); }
    const dam = Math.floor(tq * 6) % 2;
    veNV(ctx, 180, 1000, 0.8, { t, mat: "nham", chan: false, tayP: { p: [110, dam ? -110 : -70], cong: 20, kieu: "nam", camTren: (g) => { ve(g, rect(10, -40, 26, 50, 8), "#9c6a44", { w: 4 }); ve(g, rect(-6, 6, 60, 26, 6), DO, { w: 4 }); } } });
    if (tl >= tAn) viet(ctx, "“Ăn nhẹ thôi.”", 1500, 1010, { size: 92, u: vao(tl, tAn), xoay: -0.03 });
    else viet(ctx, "bán cho tất cả", 1500, 1010, { size: 80, u: vao(tl, m(c, 6)) });
  }
}
/* ── CÂU 42: bác Thoa thôi khoe bằng mồm → sáng chủ nhật đăng ảnh anh Tuấn ăn omakase, đều như ăn phở ── */
function c42(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tThoi = m(c, 4), tSang = m(c, 8), tTuan = m(c, 20), tPho = m(c, 29);
  if (tl < tSang) {
    nhaMe(ctx, t, "san");
    const bo = tl >= tThoi;
    veNV(ctx, 900, 600, 1.2, { t, kieu: "thoa", mat: bo ? "ngac" : "tuhao", noi: bo ? 0 : 0.4 + 0.4 * Math.abs(Math.sin(tq * 9)), tayP: bo ? { p: [120, 110], cong: 10 } : { p: [80, -60], cong: 30, kieu: "nam", cam: (g) => loa(g) } });
    if (!bo) for (let i = 0; i < 3; i++) net(ctx, `M${1100 + i * 40},${440 - i * 30} C${1120 + i * 40},${470 - i * 30} ${1120 + i * 40},${510 - i * 30} ${1100 + i * 40},${540 - i * 30}`, { w: 5 });
    if (bo) { ctx.save(); ctx.translate(1180, 830); ctx.rotate(0.6); loa(ctx); ctx.restore(); gachCheo(ctx, 1110, 760, 1300, 900, vao(tl, tThoi + 0.1, 0.2)); gachCheo(ctx, 1110, 900, 1300, 760, vao(tl, tThoi + 0.25, 0.2)); }
    viet(ctx, "khoe bằng mồm", 600, 200, { size: 84, u: vao(tl, m(c, 5)), xoay: -0.04 });
  } else if (tl < tTuan) {
    giay(ctx, "#fde9c8"); ve(ctx, elip(280, 260, 90, 90), "#ffd23e", { w: 5 }); tiaNhan(ctx, 280, 260, 110, 160, 10, { a0: 0, goc: 0.63, w: 5, mau: "#e8a21c" });
    viet(ctx, "sáng Chủ nhật", 300, 470, { size: 76, u: vao(tl, tSang), xoay: -0.04 });
    veNV(ctx, 560, 720, 1.05, { t, kieu: "thoa", mat: "tuhao", ngh: -0.08, chan: false, tayP: { p: [170, -60], cong: 30, kieu: "chi", lat: -1 } });
    zalo(ctx, 1300, 540, 2.9, t, { tin: [{ ai: "thoa", anh: (g) => { g.scale(0.36, 0.36); anhSushi(g, 0, 0, 1, 0, { tay: true }); }, chu: "Tuấn ăn omakase", hoa: Math.min(4, Math.floor((tl - tSang) * 3)) }] });
    if (tl >= m(c, 16)) viet(ctx, "anh Tuấn ăn omakase", 1300, 1040, { size: 56, u: vao(tl, m(c, 16)) });
  } else {
    giay(ctx);
    for (let i = 0; i < 4; i++) { const u = vao(tl, tTuan + i * 0.35, 0.2); if (u <= 0) continue; const x = 270 + i * 330; ctx.save(); ctx.translate(x, 450); ctx.scale(back(u), back(u)); D.dienThoai(ctx, 0, 0, 1.55, 0, (g) => { g.fillStyle = "#ffffff"; g.fillRect(-80, -140, 160, 280); g.save(); g.translate(0, -10); g.scale(0.42, 0.42); anhSushi(g, 0, 0, 1, 0, { tay: true, lech: i }); g.restore(); }); ctx.restore(); viet(ctx, "CN", x, 800, { size: 80, mau: DO, u }); }
    if (tl >= tPho) { viet(ctx, "=", 1580, 500, { size: 140, u: vao(tl, tPho) }); D.batPho(ctx, 1720, 560, 1.1 * back(vao(tl, tPho, 0.3)), t); }
    viet(ctx, "đều như ăn phở", W / 2, 960, { size: 90, u: vao(tl, m(c, 24)) });
  }
}
/* ── CÂU 43: MẸ chê: cá sống bày lên thớt, ao nhà cá đầy có ai ăn sống đâu ── */
function c43(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tCa = m(c, 6), tNgon = m(c, 15), tAo = m(c, 19), tSong = m(c, 27);
  if (tl < tCa) {
    nhaMe(ctx, t, "ao");
    veNV(ctx, 480, 410, 1.0, { t, kieu: "me", mat: "nheo", noi: c.noi, nhin: [0.6, -0.3], tayP: { p: [170, -60], cong: 30, kieu: "nam", camTren: (g) => D.dienThoai(g, 40, -40, 0.32, 1.5, (h) => { h.fillStyle = "#2f3550"; h.fillRect(-80, -140, 160, 280); }) } });
    viet(ctx, "nét như quảng cáo", 1300, 260, { size: 80, u: vao(tl, m(c, 2)), xoay: 0.03 });
  } else if (tl < tAo) {
    giay(ctx, "#e7f1e2");
    D.dienThoai(ctx, 760, 560, 3.0, 0, (g) => { g.fillStyle = "#2f3550"; g.fillRect(-80, -140, 160, 280); g.save(); g.scale(0.42, 0.42); anhSushi(g, 0, 0, 1, 0, {}); g.restore(); });
    const ux = vao(tl, tCa + 0.2, 0.4);
    ctx.save(); ctx.translate(lerp(1100, 860, ux), lerp(900, 620, ux)); ctx.rotate(-2.3); ctx.scale(2.6, 2.6); banTay(ctx, "chi"); ctx.restore();
    viet(ctx, "cá sống!", 1450, 230, { size: 96, mau: DO, u: vao(tl, tCa), xoay: 0.05 });
    if (tl >= tNgon) { ctx.save(); ctx.translate(1420, 560); ctx.scale(2.2, 2.2); ctx.rotate(-0.2); banTay(ctx, "chi"); ctx.restore(); viet(ctx, "=", 1610, 580, { size: 120, u: vao(tl, tNgon) }); D.sushi(ctx, 1730, 560, 1.6, 0); viet(ctx, "bằng đầu ngón tay", 1540, 760, { size: 66, u: vao(tl, tNgon) }); }
    veNV(ctx, 1780, 1070, 0.85, { t, kieu: "me", mat: "nheo", noi: c.noi, nhin: [-0.7, -0.3], than: false });
  } else {
    nhaMe(ctx, t, "ao");
    const nh = tl >= tSong;
    veNV(ctx, 520, 410, 1.0, { t, kieu: "me", mat: "tuc", noi: c.noi, nhin: [0.8, 0.6], tayP: { p: [200, 40], cong: 20, kieu: "chi" } });
    const u = eout(vao(tl, tAo + 0.3, 0.45));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 900); ctx.clip();
    caTram(ctx, 1080, lerp(1000, 740, u), 1.25, { xoay: -1.15, nhin: -1 }); ctx.restore();
    if (u > 0.5) { for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.4; ve(ctx, elip(1080 + Math.cos(a) * 160, 840 + Math.sin(a) * 60, 12, 16), "#cfe8f6", { w: 3 }); } }
    if (nh) moHoi(ctx, 1230, 520, 1.1);
    viet(ctx, "ao nhà cá đầy", 1450, 230, { size: 84, u: vao(tl, tAo), xoay: 0.04 });
    if (nh) viet(ctx, "ai ăn sống đâu!", 1450, 340, { size: 84, mau: DO, u: vao(tl, tSong) });
  }
}
/* ── CÂU 44: mẹ chê omakase bằng giọng chê hàng xóm mua ô tô ── */
function c44(ctx, t, uf, c) {
  const tl = c.tl, tGiong = m(c, 6), tOto = m(c, 13);
  if (tl < tGiong) {
    giay(ctx, "#f3efe6");
    veNV(ctx, 760, 620, 1.2, { t, kieu: "me", mat: "ghet", nhin: [0.8, -0.2], ngh: -0.1, tayP: { p: [170, -40], cong: 30, kieu: "nam" } });
    D.dienThoai(ctx, 760 + 210 * 1.2, 620 - 60 * 1.2, 1.1, 0.25, (g) => { g.fillStyle = "#2f3550"; g.fillRect(-80, -140, 160, 280); g.save(); g.scale(0.42, 0.42); anhSushi(g, 0, 0, 1, 0, {}); g.restore(); });
    viet(ctx, "omakase…", 1480, 240, { size: 90, u: vao(tl, m(c, 2)), xoay: 0.05 });
  } else {
    nhaMe(ctx, t, "cong");
    veNV(ctx, 1060, 640, 1.0, { t, kieu: "me", mat: "ghet", nhin: [1, -0.1], ngh: -0.1, tayT: { p: [-40, 90], cong: -20 }, tayP: { p: [40, 90], cong: 20 } });
    if (tl >= tOto) { for (let i = 0; i < 4; i++) sao(ctx, 1450 + i * 120, 560 + (i % 2) * 120, 28, t + i); }
    viet(ctx, "y hệt giọng chê hàng xóm", 820, 150, { size: 72, u: vao(tl, tGiong) });
    if (tl >= tOto) viet(ctx, "mua ô tô", 1620, 470, { size: 70, mau: DO, u: vao(tl, tOto) });
  }
}
/* ── CÂU 45: trên ảnh lương 50 triệu — trong sao kê 10 nghìn ── */
function c45(ctx, t, uf, c) {
  const tl = c.tl, t50 = m(c, 8), tTrong = m(c, 10), t10 = m(c, 16);
  const chia = tl >= tTrong, ux = chia ? eout(vao(tl, tTrong, 0.35)) : 0, mep = lerp(W, 960, ux);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, mep, H); ctx.clip();
  giay(ctx, "#2b3150"); for (let i = 0; i < 10; i++) { const q = rng(950 + i); sao(ctx, q() * mep, q() * 500, 10 + q() * 10, t + i, "#ffd76a"); }
  const gx = lerp(960, 480, ux), sp = lerp(400, 300, ux);
  for (let i = 0; i < 3; i++) nguoiVest(ctx, gx + (i - 1) * sp, 690, 0.9, t, 960 + i);
  banOmakase(ctx, gx, 760, sp * 3 + 100);
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(gx + (i - 1) * sp, 770); ctx.scale(1, 0.5); D.thot(ctx, 0, 0, 0.75); ctx.restore(); for (let j = 0; j < 3; j++) D.sushi(ctx, gx - 60 + (i - 1) * sp + j * 60, 762, 0.6, i + j); }
  if (tl >= t50) for (let i = 0; i < 3; i++) viet(ctx, "50 triệu", gx + (i - 1) * sp, 330 - (i % 2) * 30, { size: 64, mau: VANG, u: vao(tl, t50 + i * 0.1), xoay: (i - 1) * 0.06 });
  viet(ctx, "trên ảnh", gx, 140, { size: 80, mau: GIAY, u: vao(tl, 0.05) });
  ctx.restore();
  if (chia) {
    ctx.save(); ctx.beginPath(); ctx.rect(mep, 0, W - mep, H); ctx.clip();
    giay(ctx);
    saoKe(ctx, mep + 480, 540, 0.95, Array.from({ length: 6 }, (_, i) => ({ u: vao(tl, tTrong + 0.15 + i * 0.12, 0.15), ten: "các bảnh", gio: "23:40" })));
    viet(ctx, "trong sao kê", mep + 480, 120, { size: 80, u: vao(tl, tTrong + 0.1) });
    if (tl >= t10) viet(ctx, "10 nghìn", mep + 480, 1000, { size: 110, mau: XANH, u: vao(tl, t10), xoay: -0.04 });
    ctx.restore();
    netPts(ctx, [[mep, -10], [mep, H + 10]], { w: 10 });
  }
}
/* ── CÂU 46: cuối tháng 8 cậu Hưng đang nhậu vào trả lời ảnh anh Tuấn; mẹ đọc lại hai lần ── */
function c46(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tMe = m(c, 11), t2 = m(c, 19);
  if (tl < tMe) {
    giay(ctx, "#f6e6c6"); to(ctx, rect(0, 820, W, 260, 0), "#c9a77a"); netPts(ctx, [[-10, 820], [W + 10, 820]], { w: 6 });
    for (let i = 0; i < 4; i++) { const x = 300 + i * 440; net(ctx, `M${x},0 L${x},90`, { w: 3 }); ve(ctx, elip(x, 120, 34, 34), "#ffe7a6", { w: 4 }); }
    const nac = Math.floor(tq * 3) % 4 === 0;
    veNV(ctx, 960, 470 + (nac ? -8 : 0), 1.2, { t, kieu: "hung", mat: "cuoi", say: 1, nhin: [0, 0.6], chan: false, ngh: Math.sin(tq * 2) * 0.06, tayT: { p: [-40, 70], cong: -20 }, tayP: { p: [40, 70], cong: 20 } });
    D.dienThoaiSau(ctx, 960, 470 + 60 * 1.2, 0.6, 0);
    banNhau(ctx, 960, 680);
    viet(ctx, "cuối tháng 8", 380, 300, { size: 80, u: vao(tl, 0.05), xoay: -0.05 });
    if (nac) viet(ctx, "hức!", 1240, 300, { size: 64, pop: false, xoay: 0.1 });
    if (tl >= m(c, 6)) viet(ctx, "rep ảnh anh Tuấn", 1500, 980, { size: 66, u: vao(tl, m(c, 6)) });
  } else {
    // trái: mẹ đọc to; phải: Hiếu nghe điện thoại
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 960, H); ctx.clip();
    nhaMe(ctx, t, "bep"); veNV(ctx, 480, 620, 1.0, { t, kieu: "me", mat: "nheo", noi: 0.25 + 0.5 * Math.abs(Math.sin(tq * 8)), nhin: [0.4, 0.5], tayT: { p: [-30, 50], cong: -20 }, tayP: { p: [40, 50], cong: 20 } });
    D.dienThoai(ctx, 480, 620 + 60, 0.55, 0, (g) => { g.fillStyle = "#e7eef7"; g.fillRect(-80, -140, 160, 280); });
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(960, 0, 960, H); ctx.clip();
    phongDem(ctx, t, { gio: 12, lich: false }); veNV(ctx, 1440, 640, 1.0, { t, mat: "chan", nhin: [-0.4, 0], tayP: { p: [80, -110], cong: 50 } });
    D.dienThoai(ctx, 1440 + 108, 640 - 96, 0.42, 0.25);
    ctx.restore();
    netPts(ctx, [[960, -10], [960, H + 10]], { w: 10 });
    viet(ctx, "mẹ đọc lại", 480, 150, { size: 80, u: vao(tl, tMe) });
    if (tl >= t2) viet(ctx, "×2", 1440, 230, { size: 160, mau: DO, u: vao(tl, t2), xoay: 0.08 });
  }
}
/* ── CÂU 47: CẬU HƯNG: "Thằng Hiếu đâu, có được như anh không?" → mũi tên cắm ngực Hiếu ── */
function c47(ctx, t, uf, c) {
  const tl = c.tl, tNhu = m(c, 5), tCam = tNhu + 0.25;
  giay(ctx);
  ve(ctx, rect(80, 300, 900, 360, 28), "#ffffff", { w: 5 });
  ctx.save(); ctx.beginPath(); ctx.arc(200, 420, 80, 0, 7); ctx.clip(); to(ctx, rect(110, 330, 180, 180, 0), "#cfe3f5"); veNV(ctx, 200, 520, 0.62, { t, kieu: "hung", mat: "cuoi", say: 1, noi: c.noi, chan: false }); ctx.restore(); net(ctx, elip(200, 420, 80, 80), { w: 5 });
  viet(ctx, "Cậu Hưng", 310, 380, { size: 52, mau: "#2f7fe0", pop: false, can: "left" });
  viet(ctx, "Thằng Hiếu đâu,", 310, 470, { size: 60, pop: false, can: "left" }); viet(ctx, "có được như anh không?", 310, 560, { size: 56, pop: false, can: "left", u: vao(tl, m(c, 3)) });
  const trung = tl >= tCam;
  veNV(ctx, 1500, 620, 1.1, { t, mat: trung ? "soc" : "thuong", xoay: trung ? lerp(0, 0.14, eout(vao(tl, tCam, 0.2))) : 0, nhin: [-0.6, 0], tayT: trung ? { p: [-60, 60], cong: -20, kieu: "xoe" } : undefined });
  if (tl >= tNhu) { muiTenCam(ctx, 1000, 520, 1440, 720, vao(tl, tNhu, 0.25)); }
  if (trung) { tiaNhan(ctx, 1470, 730, 70, 130, 8, { a0: Math.PI, goc: 0.4, w: 6 }); viet(ctx, "phập!", 1240, 900, { size: 100, mau: DO, u: vao(tl, tCam, 0.15), xoay: -0.08 }); }
}
/* ── CÂU 48: MẸ xắn tay áo: "Gửi mẹ một cái. Mẹ đăng cho bác mày bớt nói." ── */
function c48(ctx, t, uf, c) {
  const tl = c.tl, tGui = m(c, 10), tDang = m(c, 14);
  nhaMe(ctx, t, "bep");
  ctx.save(); ctx.globalAlpha = 0.82; to(ctx, rect(0, 0, W, H, 0), "#d9473f"); ctx.restore();
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; netPts(ctx, [[960 + Math.cos(a) * 520, 520 + Math.sin(a) * 420], [960 + Math.cos(a) * 980, 520 + Math.sin(a) * 800]], { w: 7, mau: "#ffd9cf", seed: 800 + i }); }
  if (tl >= tDang) lua(ctx, 960, 900, 1.6, t);
  const tayAo = { mauAo: DA };
  let tT = { p: [-110, 90], cong: -30, ...tayAo }, tP = { p: [110, 90], cong: 30, ...tayAo };
  if (tl >= tGui && tl < tDang) tP = { p: [140, -40], cong: 30, kieu: "xoe", lat: -1, ...tayAo };
  if (tl >= tDang) tP = { p: [130, -150], cong: 30, kieu: "nam", ...tayAo };
  veNV(ctx, 960, 620, 1.3, { t, kieu: "me", mat: "tuc", noi: c.noi, tayT: tT, tayP: tP });
  for (const s of [-1, 1]) ve(ctx, elip(960 + s * 64 * 1.3, 620 + 30 * 1.3, 30, 18), "#7c5fa6", { w: 4 });   // tay áo xắn
  if (tl >= tDang) gan(ctx, 1120, 360, 1.3);
  viet(ctx, "ra trận!", 1520, 220, { size: 96, mau: VANG, u: vao(tl, 0.1), xoay: 0.06 });
  if (tl >= tGui && tl < tDang) viet(ctx, "gửi mẹ một cái", 420, 220, { size: 76, mau: GIAY, u: vao(tl, tGui), xoay: -0.05 });
  if (tl >= tDang) viet(ctx, "cho bác mày bớt nói", 440, 220, { size: 72, mau: GIAY, u: vao(tl, tDang), xoay: -0.05 });
}
/* ── CÂU 49: lần đầu mẹ muốn khoe tôi — mà tôi chỉ có cơm ruốc và hàng trong shop ── */
function c49(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tMa = m(c, 10), tNgoai = m(c, 17);
  ctx.save(); cam(ctx, 1110, 480, 1.25);
  phongDem(ctx, t, { gio: 23 }); toi(ctx, 0.06);
  const S = tl < tMa ? { mat: "thuong2", nhin: [0, -0.2] } : { mat: tl < tNgoai ? "buon" : "chan", nhin: tl < tNgoai ? [-0.9, 0.6] : [0.9, 0.6] };
  banLamViec(ctx, t, S, { den: 1, thot: true, tren: (g) => { batCom(g, 640, 640, 0.85, { ruoc: true }); loRuoc(g, 470, 660, 0.55); tamSushi(g, 8); } });
  if (tl < tMa) { ve(ctx, "M0,-20 C-30,-60 -80,-20 0,40 C80,-20 30,-60 0,-20 Z".replace(/(-?\d+),(-?\d+)/g, (s, a, b) => `${1250 + +a * 0.8},${210 - (tl * 30 % 60) + +b * 0.8}`), "#f39c9c", { w: 4 }); }
  ctx.restore();
  if (tl < tMa) { viet(ctx, "lần đầu tiên", 480, 180, { size: 90, mau: VANG, u: vao(tl, m(c, 3)), xoay: -0.05 }); viet(ctx, "mẹ muốn khoe tôi", 520, 290, { size: 70, mau: GIAY, u: vao(tl, m(c, 6)) }); }
  else {
    viet(ctx, "cơm ruốc?", 420, 960, { size: 84, mau: GIAY, u: vao(tl, tMa + 0.3), xoay: -0.04 }); muiTen(ctx, 420, 890, 440, 780, vao(tl, tMa + 0.4, 0.3), GIAY);
    if (tl >= tNgoai) { viet(ctx, "hàng trong shop", 1450, 960, { size: 84, mau: VANG, u: vao(tl, tNgoai), xoay: 0.03 }); muiTen(ctx, 1400, 890, 1260, 780, vao(tl, tNgoai + 0.1, 0.3), VANG); }
  }
}
/* ── CÂU 50: gửi mẹ một tấm: tay tôi, đũa gỗ, chữ Nhẫn — khách VIP, miễn phí ── */
function c50(ctx, t, uf, c) {
  const tl = c.tl, tTay = m(c, 11), tDua = m(c, 13), tChu = m(c, 16), tVip = m(c, 18);
  if (tl < tTay) {
    ctx.save(); cam(ctx, 1110, 420, 1.1);
    phongDem(ctx, t, { gio: 23, phut: 15 }); toi(ctx, 0.06);
    const u = eout(vao(T12(tl), 0.2, 0.3));
    const S = { mat: "nham", nhin: [0, -0.9], tayT: { p: [lerp(-96, -40, u), lerp(150, -190, u)], cong: -30 }, tayP: { p: [lerp(96, 40, u), lerp(150, -190, u)], cong: 30 } };
    banLamViec(ctx, t, S, { den: 1, thot: true, tren: (g) => tamSushi(g, 8) });
    D.dienThoaiSau(ctx, HX, HY + lerp(150, -215, u) * HK, 0.9, Math.PI); veNV(ctx, HX, HY, HK, { t, ...S, chiTay: true });
    ctx.restore();
    viet(ctx, "tối thứ Bảy", 420, 170, { size: 80, mau: GIAY, u: vao(tl, 0.05), xoay: -0.04 });
    if (tl >= m(c, 5)) viet(ctx, "gửi mẹ", 1520, 300, { size: 96, mau: VANG, u: vao(tl, m(c, 5)), xoay: 0.05 });
    chop(ctx, tl, m(c, 10), 0.7);
  } else if (tl < tVip) {
    giay(ctx, "#fff4e6");
    tayCanh(ctx, 1150, 600, 1.4, t, tl >= tChu ? 1 : 0);
    viet(ctx, "tay tôi", 1480, 220, { size: 84, u: vao(tl, tTay), xoay: 0.05 }); muiTen(ctx, 1460, 260, 1320, 400, vao(tl, tTay + 0.1, 0.3));
    if (tl >= tDua) { viet(ctx, "đũa gỗ", 360, 300, { size: 84, u: vao(tl, tDua), xoay: -0.05 }); muiTen(ctx, 420, 330, 520, 420, vao(tl, tDua + 0.1, 0.3)); }
    if (tl >= tChu) { const u = back(vao(tl, tChu, 0.3)); nhan(ctx, 600, 820, 1.0 * u); muiTen(ctx, 760, 800, 1000, 760, vao(tl, tChu + 0.2, 0.3)); viet(ctx, "chữ Nhẫn", 600, 1030, { size: 70, u: vao(tl, tChu + 0.1) }); }
  } else {
    // ảnh bay từ Hà Nội về quê: khách VIP, miễn phí
    giay(ctx, "#e3f1f7");
    for (let i = 0; i < 6; i++) { const h = 160 + (i * 53) % 140; ve(ctx, rect(80 + i * 70, 760 - h, 60, h, 4), "#8f9bb8", { w: 4 }); }
    viet(ctx, "Hà Nội", 290, 830, { size: 60, pop: false });
    to(ctx, "M1300,760 C1500,730 1800,740 1940,760 L1940,1100 L1300,1100 Z", "#9fd07a"); ve(ctx, rect(1460, 560, 300, 200, 6), "#f6e3a0", { w: 5 }); ve(ctx, "M1430,570 L1610,460 L1790,570 Z", "#c9573f", { w: 5 });
    viet(ctx, "quê", 1610, 840, { size: 60, pop: false });
    const pts = []; for (let i = 0; i <= 30; i++) { const v = i / 30; pts.push([lerp(420, 1560, v), 600 - Math.sin(v * Math.PI) * 360]); }
    for (let i = 0; i < 30; i += 2) netPts(ctx, [pts[i], pts[i + 1]], { w: 6, mau: "#6b7280", seed: 820 + i });
    const u = eio(clamp((tl - tVip) / (c.dur - (tVip) - 0.3))), k0 = Math.min(29, Math.floor(u * 30)), p = pts[k0];
    anhSushi(ctx, p[0], p[1], 0.75, Math.sin(tl * 3) * 0.15, { tay: true });
    ctx.save(); ctx.translate(p[0] + 110, p[1] - 110); ctx.rotate(0.25); ve(ctx, elip(0, 0, 80, 50), DO, { w: 5 }); viet(ctx, "VIP", 0, 18, { size: 54, mau: "#fff", pop: false }); ctx.restore();
    viet(ctx, "miễn phí", W / 2, 1000, { size: 96, mau: XANH, u: vao(tl, m(c, 20)) });
  }
}
/* ── CÂU 51: mẹ đăng "Con tôi cũng ăn." — cả họ gửi hoa, bác Thoa không thèm mở ── */
function c51(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tRoi = m(c, 6), tBac = m(c, 13);
  if (tl < tBac) {
    giay(ctx, "#eef3fa");
    const nHoa = tl < tRoi ? 0 : Math.min(9, Math.floor((tl - m(c, 9)) * 6));
    const tin = [{ ai: "me", anh: (g) => { g.scale(0.36, 0.36); anhSushi(g, 0, 0, 1, 0, { tay: true }); }, chu: "Con tôi cũng ăn.", hoa: nHoa }];
    if (tl >= m(c, 10)) tin.push({ ai: 31, chu: "Cháu ăn sang quá!", hoa: 2 });
    if (tl >= m(c, 12)) tin.push({ ai: 47, chu: "Hiếu giỏi quá chị ơi", hoa: 3 });
    if (tl >= m(c, 12) + 0.3) tin.push({ ai: "diut", chu: "Thương cháu ♥", hoa: 1 });
    zalo(ctx, 760, 540, 3.1, t, { tin });
    if (tl >= m(c, 9)) for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, u = clamp((tl - m(c, 9) - i * 0.05) / 0.8); if (u > 0) hoa(ctx, 760 + Math.cos(a) * (200 + u * 420), 540 + Math.sin(a) * (160 + u * 320), 30, ["#f39cc0", "#ffd23e", "#f6a07a"][i % 3]); }
    veNV(ctx, 1560, 1040, 0.95, { t, kieu: "me", mat: "tuhao", chan: false, nhin: [-0.6, -0.3] });
    viet(ctx, "“Con tôi cũng ăn.”", 1500, 200, { size: 76, u: vao(tl, m(c, 2)), xoay: 0.03 });
    if (tl >= m(c, 9)) viet(ctx, "cả họ gửi hoa", 1500, 330, { size: 76, mau: "#d9478a", u: vao(tl, m(c, 9)) });
  } else {
    giay(ctx, "#f6efe2");
    veNV(ctx, 900, 620, 1.2, { t, kieu: "thoa", mat: "ghet", ngh: 0.14, nhin: [-1, -0.3], tayT: { p: [40, 70], cong: -40 }, tayP: { p: [-40, 80], cong: 40 } });
    ve(ctx, rect(1180, 830, 420, 40, 8), "#9c6a44", { w: 5 });
    ve(ctx, rect(1300, 800, 180, 34, 10), "#33364a", { w: 5 }); ve(ctx, elip(1470, 790, 24, 24), DO, { w: 4 }); viet(ctx, "9", 1470, 802, { size: 32, mau: "#fff", pop: false });
    viet(ctx, "hứ!", 620, 330, { size: 100, mau: DO, u: vao(tl, tBac), xoay: -0.08 });
    viet(ctx, "không thèm mở", 1400, 300, { size: 84, u: vao(tl, m(c, 15)), xoay: 0.04 });
  }
}
/* ── CÂU 52: đêm đấy mẹ phóng to ảnh ngắm mãi — từng miếng cá, từng ngón tay ── */
function c52(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tCon = m(c, 10), tMieng = m(c, 16), tNgon = m(c, 19);
  if (tl < tCon) {
    nhaMe(ctx, t, "phongngu");
    const k = 1.15, x = 1300, y = 560;
    veNV(ctx, x, y, k, { t, kieu: "me", mat: "thuong2", nhin: [0, 0.8], chan: false, anTay: true });
    D.dienThoai(ctx, x - 10, y + 150, 0.62, 0, (g) => { g.fillStyle = "#2f3550"; g.fillRect(-80, -140, 160, 280); g.save(); const z = 0.5 + 0.3 * eio(clamp(tl / tCon)); g.scale(z, z); anhTho(g); g.restore(); });
    veNV(ctx, x, y, k, { t, chiTay: true, kieu: "me", tayT: { p: [-50, 150], cong: -30 }, tayP: { p: [10 + Math.sin(tq * 2) * 12, 110], cong: 30, kieu: "chi" } });
    viet(ctx, "ngắm mãi", 560, 260, { size: 90, mau: "#ffe7a6", u: vao(tl, m(c, 8)), xoay: -0.05 });
  } else {
    // cận màn hình: hai ngón tay mẹ kéo phóng to
    giay(ctx, "#343a5a");
    const z1 = tl < tMieng ? lerp(1, 1.4, eio(vao(tl, tCon, 1))) : tl < tNgon ? lerp(1.4, 2.4, eio(vao(tl, tMieng, 0.6))) : 2.4;
    const fx = tl < tNgon ? lerp(0, -90, eio(vao(tl, tMieng, 0.6))) : lerp(-90, 150, eio(vao(tl, tNgon, 0.6))), fy = tl < tNgon ? lerp(0, -40, eio(vao(tl, tMieng, 0.6))) : lerp(-40, 70, eio(vao(tl, tNgon, 0.6)));
    D.dienThoai(ctx, 820, 540, 3.2, 0, (g) => { g.fillStyle = "#2f3550"; g.fillRect(-80, -140, 160, 280); g.save(); g.scale(0.62 * z1, 0.62 * z1); g.translate(-fx, -fy); anhTho(g); g.restore(); });
    const xa = 40 + Math.min(1, ((tl - tCon) % 1.4) / 1.0) * 70;
    for (const s of [-1, 1]) { ctx.save(); ctx.translate(820 + s * xa, 640 + s * xa * 0.6); ctx.rotate(s < 0 ? -2.3 : 0.84); ctx.scale(2.2, 2.2); ctx.translate(-56, 0); banTay(ctx, "chi"); ctx.restore(); }
    veNV(ctx, 1560, 1050, 0.95, { t, kieu: "me", mat: "thuong2", chan: false, nhin: [-0.6, -0.4] });
    ve(ctx, "M0,-20 C-30,-60 -80,-20 0,40 C80,-20 30,-60 0,-20 Z".replace(/(-?\d+),(-?\d+)/g, (s, a, b) => `${1700 + +a * 0.7},${560 - ((tl * 40) % 80) + +b * 0.7}`), "#f39c9c", { w: 4 });
    viet(ctx, "con trai mình ăn sang", 1500, 200, { size: 66, mau: GIAY, u: vao(tl, tCon) });
    if (tl >= tMieng) viet(ctx, "từng miếng cá", 1500, 320, { size: 70, mau: "#ffd76a", u: vao(tl, tMieng) });
    if (tl >= tNgon) viet(ctx, "từng ngón tay", 1500, 430, { size: 70, mau: "#ffd76a", u: vao(tl, tNgon) });
  }
}
/* ── CÂU 53: 23:40 khách đêm vẫn mua — một tấm cùng bữa đấy, góc khác ── */
function c53(ctx, t, uf, c) {
  const tl = c.tl, tKhach = m(c, 3), tMot = m(c, 7), tGoc = m(c, 12);
  giay(ctx, "#252a45"); for (let i = 0; i < 14; i++) { const q = rng(990 + i); sao(ctx, q() * W, q() * 360, 6 + q() * 6, t + i, "#fff6d0"); }
  if (tl < tMot) {
    D.dongHo(ctx, 960, 540, 230, 23, 40); viet(ctx, "23:40", 960, 900, { size: 110, mau: VANG, u: vao(tl, 0.05) });
    if (tl >= tKhach) thongBaoTien(ctx, 960, lerp(-120, 150, eout(vao(tl, tKhach, 0.3))), 1.1, { so: "+10.000 VND", phu: "23:40 · PHAM VAN DUNG" });
  } else {
    anhSushi(ctx, 560, 500, 1.35, -0.06, { tay: true });
    if (tl >= m(c, 9)) anhSushi(ctx, 1360, 500, 1.35, 0.06, { tay: true, lech: 1 });
    viet(ctx, "gửi mẹ", 560, 860, { size: 80, mau: GIAY, u: vao(tl, tMot) });
    if (tl >= m(c, 9)) viet(ctx, "bán cho “T.”", 1360, 860, { size: 80, mau: VANG, u: vao(tl, m(c, 9)) });
    if (tl >= tGoc) { viet(ctx, "góc khác", W / 2, 180, { size: 96, mau: DO, u: vao(tl, tGoc), xoay: -0.03 }); for (let i = 0; i < 3; i++) netPts(ctx, [[780, 420 + i * 60], [1140, 420 + i * 60]], { w: 4, mau: "#ff7a6b", seed: 840 + i, alpha: vao(tl, tGoc + i * 0.1) }); }
  }
}

export const CANH = { 35: c35, 36: c36, 37: c37, 38: c38, 39: c39, 40: c40, 41: c41, 42: c42, 43: c43, 44: c44, 45: c45, 46: c46, 47: c47, 48: c48, 49: c49, 50: c50, 51: c51, 52: c52, 53: c53 };
