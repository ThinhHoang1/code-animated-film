// Chương 7 "Tay ai đây" — câu 54–67. Mốc hành động theo chữ: m(c, i) = giây của chữ thứ i (xem moc-doc.md).
import { W, H, MUC, GIAY, giay, viet, doRong, ve, vePts, net, netPts, to, toPts, bong, elip, rect, moHoi, sao, tiaNhan, rung,
  T12, clamp, lerp, eio, eout, back, pha, on, rng } from "./but.js";
import { m, vao, cam, lac, chop, toi, muiTen, khoanh, avatar, hoa, tayCanh, phongDem, phongNgay, banLamViec, nhaMe, D, veNV, banTay, DA } from "./chung.js";

/* ───────── đồ riêng của chương ───────── */
const choMieng = (i) => [-96 + (i % 4) * 64, -26 + Math.floor(i / 4) * 34];
const TAY_A = { x: 120, y: 50, k: 0.3 }, TAY_B = { x: 112, y: -30, k: 0.3 };
const nhanO = (T) => [T.x - 58.1 * T.k, T.y + 69.5 * T.k];   // vị trí nhẫn trong ảnh theo chỗ đặt bàn tay
/* ảnh bữa "omakase": khung 300×220 tâm (0,0). o.goc = góc chụp khác (xoay mâm), o.T = chỗ bàn tay, o.so = số miếng được đánh số */
function anhBua(ctx, x, y, k, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.save(); ctx.beginPath(); ctx.rect(-150, -110, 300, 220); ctx.clip();
  to(ctx, rect(-150, -110, 300, 220, 0), o.nen ?? "#2f3550");
  ctx.save(); ctx.rotate(o.goc ?? 0);
  ctx.save(); ctx.translate(0, -8); ctx.scale(1, 0.55); D.thot(ctx, 0, 0, 0.9); ctx.restore();
  for (let i = 0; i < 8; i++) { const [px, py] = choMieng(i); D.sushi(ctx, px, py, 0.6, i); }
  ctx.restore();
  if (o.tay !== false) { const T = o.T ?? TAY_A; tayCanh(ctx, T.x, T.y, T.k, 0, 0, false); }
  ctx.restore();
  if (o.so) for (let i = 0; i < Math.min(8, o.so); i++) { const [px, py] = choMieng(i); ve(ctx, elip(px, py - 34, 13, 13), "#ffd23e", { w: 2.5 }); viet(ctx, `${i + 1}`, px, py - 25, { size: 22, pop: false, soi: false }); }
  if (o.vien !== false) net(ctx, rect(-150, -110, 300, 220, 4), { w: 4 });
  ctx.restore();
}
const viTriMieng = (X, Y, k, goc, i) => { const [px, py] = choMieng(i), c = Math.cos(goc), s = Math.sin(goc); return [X + (px * c - py * s) * k, Y + (px * s + py * c) * k]; };
/* đầu tròn nhỏ của một nhân vật (avatar Zalo) */
function dauNho(g, x, y, r, kieu) {
  g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip(); g.fillStyle = "#e9dcc8"; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  const kk = r / 110; veNV(g, x, y + 95 * kk + r * 0.15, kk, { kieu, chan: false, than: false }); g.restore(); net(g, elip(x, y, r, r), { w: 2 });
}
/* màn Zalo nhóm (toạ độ màn hình điện thoại 144×272) */
function zaloNen(g, tieuDe = "Nhà Ngoại") {
  g.fillStyle = "#e7eef7"; g.fillRect(-80, -140, 160, 280); to(g, rect(-80, -140, 160, 38, 0), "#2f7fe0");
  viet(g, tieuDe, 0, -107, { size: 14, mau: "#fff", pop: false, soi: false });
}
function zaloBai(g, y0, o) {   // một bài trong nhóm: avatar + tên + chữ + ảnh + hoa
  const ph = o.ph ?? 92, h = 44 + ph + 24;
  ve(g, rect(-68, y0, 136, h, 6), "#ffffff", { w: 1.6 });
  dauNho(g, -54, y0 + 14, 9, o.ai);
  viet(g, o.ten, -40, y0 + 18, { size: 11, pop: false, can: "left", soi: false }); viet(g, o.gio ?? "", 62, y0 + 17, { size: 8, mau: "#9aa0ab", pop: false, can: "right", soi: false });
  viet(g, o.chu, -62, y0 + 38, { size: 11, pop: false, can: "left", soi: false });
  g.save(); g.translate(0, y0 + 44 + ph / 2); g.beginPath(); g.rect(-62, -ph / 2, 124, ph); g.clip(); anhBua(g, 0, 0, Math.max(124 / 300, ph / 220) * (o.zoom ?? 1), { vien: false, ...o.anh }); g.restore();
  const n = o.hoa ?? 0; for (let j = 0; j < Math.min(n, 6); j++) hoa(g, -56 + j * 11, y0 + h - 11, 4.5);
  if (n > 0) viet(g, `${n}`, 62, y0 + h - 7, { size: 10, mau: "#e0392f", pop: false, can: "right", soi: false });
  return h;
}
/* màn gọi video với mẹ, khung giống câu 4 (đã duyệt): nền xanh đêm, điện thoại to bên trái, chữ bên phải */
const nhay = (tl, chu = 3.3) => (tl % chu) < 0.13;
function goiMe(ctx, t, c, o = {}) {
  giay(ctx, o.nen ?? "#2b3150");
  if (o.sau) o.sau(ctx);
  const X = o.x ?? 760, z = o.z ?? 1;
  ctx.save(); ctx.translate(X, 560); ctx.scale(z, z); ctx.translate(-X, -560);
  D.dienThoai(ctx, X, 560, 3.25, 0, (g) => {
    g.fillStyle = o.mauNen ?? "#e9dcc8"; g.fillRect(-80, -140, 160, 280); g.fillStyle = o.mauSan ?? "#cdb89a"; g.fillRect(-80, 40, 160, 100);
    veNV(g, o.dx ?? 0, 66, 0.42, { t, kieu: "me", mat: o.chop && nhay(c.tl) ? "cui" : (o.mat ?? "nheo"), noi: o.noi ?? c.noi, chan: false, ngh: o.ngh ?? 0, nhin: o.nhin, tayP: o.tayP, tayT: o.tayT });
    if (o.them) o.them(g);
    if (o.pip !== false) pipHieu(g, t, o.pipMat ?? "cui", o.pipTai ?? 0, o.pipX ?? 30);
    if (o.gio) { ve(g, rect(-66, -124, 40, 15, 7), "rgba(30,30,40,0.55)", { w: 0 }); viet(g, o.gio, -46, -112, { size: 11, mau: "#fff", pop: false, soi: false }); }
  }, { vo: "#1c1f2e" });
  ctx.restore();
}
function pipHieu(g, t, mat = "cui", taiDo = 0, x0 = 30) {   // ô nhỏ góc màn: mặt Hiếu
  ve(g, rect(x0, -122, 38, 52, 5), "#f1e6d3", { w: 1.8 });
  g.save(); g.beginPath(); g.rect(x0, -122, 38, 52); g.clip(); veNV(g, x0 + 19, -82, 0.14, { t, mat, chan: false, taiDo }); g.restore();
  net(g, rect(x0, -122, 38, 52, 5), { w: 1.8 });
}
const dongHoGoi = (giay0, tl, toc = 1) => { const s = Math.floor(giay0 + tl * toc); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
function ngon(ctx, x, y, a, k = 1) {   // một ngón tay to: đầu ngón ở (x,y), thân ngón kéo về hướng a
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(k, k);
  ve(ctx, "M0,-20 C-12,-20 -18,-10 -18,0 C-18,10 -12,20 0,20 L260,26 L260,-26 Z", DA, { w: 4.5 });
  ve(ctx, "M-4,-12 C-12,-8 -12,8 -4,12 L16,11 L16,-11 Z", "#f6c9bd", { w: 2.5 });
  net(ctx, "M70,-18 C74,-6 74,6 70,18", { w: 2.5 });
  ctx.restore();
}
function ga(ctx, x, y, k, t, gay) {   // gà trống trên cọc rào, quay sang phải
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  for (const [d, mau] of [["M-70,-10 C-140,-70 -150,-140 -104,-170 C-118,-110 -88,-62 -54,-30 Z", "#2f6b4f"], ["M-70,-4 C-150,-40 -170,-100 -140,-130 C-140,-80 -100,-40 -56,-18 Z", "#d9473f"], ["M-66,4 C-130,0 -160,-40 -150,-74 C-130,-40 -100,-20 -56,-6 Z", "#e8a21c"]]) ve(ctx, d, mau, { w: 4.5 });
  netPts(ctx, [[-14, 36], [-18, 86]], { w: 7, mau: "#e8a21c" }); netPts(ctx, [[18, 36], [22, 86]], { w: 7, mau: "#e8a21c" });
  ve(ctx, "M-80,0 C-90,-56 -24,-84 28,-66 C54,-104 84,-118 98,-92 C108,-64 92,-34 72,-12 C60,28 4,48 -36,40 C-66,36 -80,20 -80,0 Z", "#fbf6ea", { w: 5 });
  ve(ctx, "M-40,-20 C-10,-40 30,-30 42,0 C12,12 -22,10 -40,-20 Z", "#ece4d0", { w: 4 });
  ve(ctx, "M76,-112 C80,-136 92,-138 96,-120 C100,-138 114,-136 112,-114 C120,-126 130,-118 120,-104 L84,-100 Z", "#e2453c", { w: 4 });
  ve(ctx, elip(98, -76, 7, 11), "#e2453c", { w: 3 }); to(ctx, elip(88, -98, 4, 4), MUC);
  const mo = gay ? 1 : 0.2;
  ve(ctx, `M100,-102 L132,${-108 - mo * 6} L104,-94 Z`, "#f4c430", { w: 3 }); ve(ctx, `M102,-92 L128,${-84 + mo * 10} L100,-86 Z`, "#f4c430", { w: 3 });
  ctx.restore();
}
function thePhieu(ctx, x, y, n, xo = 0) {   // thẻ tang vật vàng có số
  ctx.save(); ctx.translate(x, y); ctx.rotate(xo); net(ctx, "M0,-34 C10,-50 26,-56 40,-52", { w: 3 });
  ve(ctx, "M-24,-34 L24,-34 L24,26 L0,40 L-24,26 Z", "#ffd23e", { w: 4 }); viet(ctx, `${n}`, 0, 16, { size: 40, pop: false, soi: false }); ctx.restore();
}
function gheMat(ctx, x, y, k) {   // ghế mát xa
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-70,-230 C-70,-280 70,-280 70,-230 L80,-30 L-80,-30 Z", "#4a4f63", { w: 5 }); ve(ctx, rect(-50, -230, 100, 150, 30), "#5f6580", { w: 3.5 });
  ve(ctx, "M-70,20 L70,20 L58,120 L-58,120 Z", "#4a4f63", { w: 5 }); ve(ctx, rect(-100, -50, 200, 70, 24), "#5f6580", { w: 5 });
  for (const s of [-1, 1]) { ve(ctx, rect(s > 0 ? 80 : -140, -110, 60, 110, 20), "#3a3f52", { w: 4.5 }); to(ctx, elip(s * 110, -84, 7, 7), "#e2453c"); to(ctx, elip(s * 110, -62, 7, 7), "#30c46b"); }
  ctx.restore();
}
function nhaNho(ctx, x, y, k) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ve(ctx, rect(-80, -60, 160, 120, 6), "#f6e3a0", { w: 5 }); ve(ctx, "M-100,-56 L0,-130 L100,-56 Z", "#c9573f", { w: 5 }); ve(ctx, rect(-20, 0, 40, 60, 4), "#9c6a44", { w: 4 }); ctx.restore(); }
function phieuLuong(ctx, x, y, k) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(-0.06); ve(ctx, rect(-120, -80, 240, 160, 6), "#fffdf5", { w: 5 }); viet(ctx, "PHIẾU LƯƠNG", 0, -36, { size: 30, pop: false, soi: false }); viet(ctx, "8.000.000đ", 0, 30, { size: 48, mau: "#2f9e57", pop: false, soi: false }); ctx.restore(); }
function khungNgam(ctx, x, y, k) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ve(ctx, rect(-110, -80, 220, 160, 14), "#2f3550", { w: 5 }); for (const s of [-1, 1]) { netPts(ctx, [[s * 36, -76], [s * 36, 76]], { w: 2.5, mau: "#ffffff" }); netPts(ctx, [[-106, s * 27], [106, s * 27]], { w: 2.5, mau: "#ffffff" }); } viet(ctx, "×30", 0, 22, { size: 64, mau: "#ffd23e", pop: false, soi: false }); ctx.restore(); }
function denGiaoThong(ctx, x, y, k, u) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ve(ctx, rect(-36, -100, 72, 200, 16), "#3a3d4a", { w: 5 }); netPts(ctx, [[0, 100], [0, 220]], { w: 12, mau: "#7a7d88" }); to(ctx, elip(0, -60, 22, 22), u > 0.5 ? "#ff3b30" : "#6b3a3a"); to(ctx, elip(0, 0, 22, 22), "#6b5a2a"); to(ctx, elip(0, 60, 22, 22), u > 0.5 ? "#2f4a3a" : "#30c46b"); for (const yy of [-60, 0, 60]) net(ctx, elip(0, yy, 22, 22), { w: 3 }); ctx.restore(); }
function chatT(g, t, tin, go = 0) {   // màn chat với khách "T." (không lộ mặt). tin: [{chu, nhan, u}]; go = hiện "đang gõ…"
  g.fillStyle = "#f4f6fa"; g.fillRect(-80, -140, 160, 280); to(g, rect(-80, -140, 160, 48, 0), "#ffffff"); netPts(g, [[-80, -92], [80, -92]], { w: 1.4, mau: "#d0d4dc" });
  avatar(g, -52, -108, 11, 0, { chu: "T", mau: "#2a2631" }); viet(g, "T.", -34, -103, { size: 14, pop: false, can: "left", soi: false });
  let yy = -82;
  for (const b of tin) {
    if (b.nhan) { viet(g, b.nhan, 0, yy + 8, { size: 8, mau: "#9aa0ab", pop: false, soi: false }); yy += 14; }
    const u = b.u ?? 1; if (u <= 0) continue; const cz = b.size ?? 11, w = Math.min(132, doRong(g, b.chu, cz) + 16), hh = cz * 2, s = back(u);
    g.save(); g.translate(-66, yy); g.scale(s, s); ve(g, rect(0, 0, w, hh, 9), b.mau ?? "#ffffff", { w: 1.5 }); viet(g, b.chu, 8, hh * 0.68, { size: cz, pop: false, can: "left", soi: false, mau: b.mauChu ?? MUC }); g.restore();
    yy += hh + 8;
  }
  if (go > 0) { ve(g, rect(-64, yy, 44, 20, 9), "#ffffff", { w: 1.5 }); for (let i = 0; i < 3; i++) to(g, elip(-52 + i * 10, yy + 10 - Math.max(0, Math.sin(t * 9 - i)) * 4, 3, 3), "#9aa0ab"); }
}

/* ───────── 54: 6 giờ sáng chủ nhật, bác Thoa đăng anh Tuấn ăn omakase, "Ăn nhẹ thôi." ───────── */
function c54(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tBac = m(c, 5), tDang = m(c, 7), tAnh = m(c, 8), tAn = m(c, 14);
  if (tl < tBac) {
    giay(ctx, "#fde6c8"); ve(ctx, "M1260,770 C1260,640 1540,640 1540,770 Z", "#ffb547", { w: 5 }); tiaNhan(ctx, 1400, 770, 170, 240, 7, { a0: -Math.PI / 2, goc: 0.42, w: 6, mau: "#e8a21c" });
    to(ctx, rect(0, 770, W, 310, 0), "#b5d68a"); netPts(ctx, [[-10, 770], [W + 10, 770]], { w: 6 });
    for (const [x, k] of [[220, 1], [470, 0.8]]) { nhaNho(ctx, x, 700, k); }
    for (let i = 0; i < 11; i++) { const x = 560 + i * 60; ve(ctx, rect(x - 9, 760 - (i % 2) * 14, 18, 200, 5), "#c9a26a", { w: 4, seed: 900 + i }); }
    netPts(ctx, [[540, 820], [1220, 820]], { w: 8, mau: "#a8854f" }); netPts(ctx, [[540, 880], [1220, 880]], { w: 8, mau: "#a8854f" });
    const gay = tl > 0.25 && Math.floor(tq * 6) % 2 === 0;
    ga(ctx, 860, 650, 1.35, t, gay);
    if (tl > 0.25) { viet(ctx, "Ò Ó O…!", 1180, 400, { size: 110, mau: "#e0392f", u: vao(tl, 0.25), xoay: -0.08 }); tiaNhan(ctx, 1040, 520, 40, 90, 5, { a0: -0.3, goc: 0.35, w: 5 }); }
    viet(ctx, "6 giờ sáng, chủ nhật", 560, 170, { size: 80, u: vao(tl, 0.02, 0.3), xoay: -0.03 });
  } else if (tl < tAnh) {
    D.phong(ctx, "#f6e7d6", "#d9c4a3", 860); D.cuaSo(ctx, 1280, 140, 460, 340, t, false); to(ctx, elip(1600, 260, 50, 50), "#ffb547");
    const bam = tl >= tDang;
    veNV(ctx, 720, 560, 1.2, { t, kieu: "thoa", mat: bam ? "tuhao" : "thuong", ngh: bam ? -0.06 : 0, nhin: [0.5, 0.4], tayP: { p: [96, -6], cong: 30, kieu: bam && Math.floor(tq * 8) % 2 ? "chi" : "nam" }, tayT: { p: [52, 40], cong: -20 } });
    D.dienThoaiSau(ctx, 720 + 82 * 1.2, 560 - 40 * 1.2, 0.55, 0.25);
    viet(ctx, "bác Thoa", 280, 300, { size: 80, u: vao(tl, tBac + 0.05), xoay: -0.05 }); muiTen(ctx, 360, 330, 560, 400, vao(tl, tBac + 0.15, 0.3));
    if (bam) { viet(ctx, "ĐĂNG!", 1100, 380, { size: 120, mau: "#e0392f", u: vao(tl, tDang, 0.18), xoay: 0.08 }); tiaNhan(ctx, 840, 512, 50, 100, 7, { a0: -Math.PI / 2, goc: 0.45, w: 5, mau: "#e8a21c" }); }
  } else {
    giay(ctx, "#f3efe6");
    const z = tl < tAn ? 1 : lerp(1, 1.12, eio(pha(tl, tAn, tAn + 0.6)));
    ctx.save(); ctx.translate(820, 560); ctx.scale(z, z); ctx.translate(-820, -560);
    D.dienThoai(ctx, 820, 560, 3.15, 0, (g) => {
      zaloNen(g);
      const h = zaloBai(g, -94, { ai: "thoa", ten: "Thoa Nguyễn", gio: "6:02", chu: "Anh Tuấn ăn omakase", ph: 110, hoa: Math.floor(clamp((tl - tAnh) * 9, 0, 60)), anh: {} });
      if (tl >= tAn) { const u = vao(tl, tAn, 0.35); to(g, rect(-64, -94 + h + 8, 128 * u, 26, 5), "#fff1a6"); viet(g, "“Ăn nhẹ thôi.”", -58, -94 + h + 27, { size: 16, pop: false, can: "left", soi: false }); }
    }, { vo: "#33364a" });
    ctx.restore();
    if (tl >= tAn) { viet(ctx, "Ăn nhẹ thôi.", 1520, 520, { size: 100, u: vao(tl, tAn + 0.1), xoay: -0.04 }); viet(ctx, "(câu tôi bán)", 1530, 640, { size: 56, mau: "#6b6560", u: vao(tl, tAn + 0.5), xoay: 0.03 }); }
    else viet(ctx, "anh Tuấn ăn omakase", 1480, 260, { size: 64, u: vao(tl, tAnh + 0.1), xoay: -0.03 });
  }
}

/* ───────── 55: cả họ gửi hoa cho cả hai bữa; đéo ai xem ảnh; người ta xem ai đăng ───────── */
const HO = [["hung", {}], ["diut", {}], ["nguoi", { ao: "#e8a2c8", aoB: "#cf84ad", kToc: "dai", toc: "#4a3428" }], ["nguoi", { ao: "#9ccf7a", aoB: "#7fb35e", kToc: "hoi", toc: "#5a5458", ria: true }], ["nguoi", { ao: "#f2b544", aoB: "#d8952a", kToc: "ngan", toc: "#2a2631" }]];
function c55(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tO = m(c, 8), tNguoi = m(c, 15), tAi = m(c, 18);
  if (tl < tO) {
    giay(ctx, "#f3efe6");
    D.dienThoai(ctx, 760, 560, 3.15, 0, (g) => {
      zaloNen(g);
      const n = Math.floor(clamp((tl - 0.3) * 30, 0, 99));
      const h = zaloBai(g, -98, { ai: "me", ten: "Mẹ Hiếu", gio: "T7", chu: "Con tôi cũng ăn.", ph: 44, hoa: n, anh: {} });
      zaloBai(g, -98 + h + 4, { ai: "thoa", ten: "Thoa Nguyễn", gio: "CN", chu: "Anh Tuấn ăn omakase", ph: 44, hoa: Math.floor(n * 1.1), anh: { goc: 0.14, T: TAY_B } });
    }, { vo: "#33364a" });
    for (let i = 0; i < 16; i++) { const q = rng(2100 + i), x = 300 + q() * 960, y = ((q() * 900 + tl * 420) % 1000) - 60; hoa(ctx, x, y, 22 + q() * 12, i % 2 ? "#f39cc0" : "#ffb3c7"); }
    viet(ctx, "cả hai bữa", 1520, 300, { size: 96, u: vao(tl, m(c, 5)), xoay: -0.05 }); viet(ctx, "đều được hoa", 1520, 430, { size: 72, mau: "#e0392f", u: vao(tl, m(c, 6) + 0.2), xoay: 0.03 });
  } else if (tl < tNguoi) {
    giay(ctx, "#fbf3e4"); to(ctx, rect(0, 860, W, 220, 0), "#e3d2b0"); netPts(ctx, [[-10, 860], [W + 10, 860]], { w: 6 });
    HO.forEach(([kieu, C], i) => {
      const x = 260 + i * 350, y = 600, k = 0.95, nhin = [[-0.9, 0], [0.9, -0.2], [0, 0], [-0.7, -0.5], [0.8, 0.3]][i], mat = ["cuoi", "chan", "ngu", "chan", "cuoi"][i];
      const go = Math.floor(tq * 5 + i) % 2;
      veNV(ctx, x, y, k, { t, kieu, C, mat, nhin, anTay: true, noi: i === 0 ? Math.abs(Math.sin(tl * 9)) * 0.7 : 0 });
      const px = x + 60 * k, py = y + 80 * k;
      D.dienThoai(ctx, px, py, 0.42, 0.15, (g) => { zaloNen(g); zaloBai(g, -100, { ai: i % 2 ? "me" : "thoa", ten: "…", chu: "", ph: 80, hoa: 3, anh: {} }); }, { vo: "#33364a" });
      veNV(ctx, x, y, k, { t, kieu, C, chiTay: true, tayP: { p: [70, go ? 70 : 82], cong: 20, kieu: go ? "chi" : "nam" }, tayT: { p: [30, 120], cong: -20 } });
      if (go) hoa(ctx, px + 10, py - 110 - ((tl * 3 + i) % 1) * 80, 20);
    });
    viet(ctx, "đéo ai xem ảnh", W / 2, 170, { size: 100, u: vao(tl, m(c, 11)), xoay: -0.02 });
  } else {
    giay(ctx);
    for (const [kieu, x, ten] of [["me", 600, "Mẹ Hiếu"], ["thoa", 1320, "Bác Thoa"]]) {
      ve(ctx, rect(x - 230, 300, 460, 380, 22), "#ffffff", { w: 5 });
      ctx.save(); ctx.beginPath(); ctx.arc(x, 430, 96, 0, 7); ctx.clip(); to(ctx, rect(x - 100, 330, 200, 200, 0), "#e9dcc8"); veNV(ctx, x, 452 + 95 * 0.6, 0.6, { t, kieu, chan: false, than: false, mat: kieu === "thoa" ? "tuhao" : "thuong" }); ctx.restore(); net(ctx, elip(x, 430, 96, 96), { w: 5 });
      viet(ctx, ten, x, 600, { size: 66, pop: false });
      ctx.save(); ctx.globalAlpha = 0.5; to(ctx, rect(x - 150, 720, 300, 140, 10), "#d8d4cc"); ctx.restore(); net(ctx, rect(x - 150, 720, 300, 140, 10), { w: 3, mau: "#b9b4ab" }); viet(ctx, "(ảnh)", x, 808, { size: 48, mau: "#9aa0ab", pop: false });
      for (let i = 0; i < 3; i++) hoa(ctx, x - 40 + i * 40, 268 - Math.abs(Math.sin(tl * 4 + i)) * 20, 20);
    }
    if (tl >= tAi) { khoanh(ctx, 600, 600, 170, 52, vao(tl, tAi, 0.35)); khoanh(ctx, 1320, 600, 170, 52, vao(tl, tAi + 0.1, 0.35)); }
    viet(ctx, "xem AI đăng", W / 2, 170, { size: 110, u: vao(tl, tNguoi + 0.1), xoay: -0.03 });
  }
}

/* ───────── 56: mẹ gửi ảnh chụp màn hình khoanh nhẫn méo như quả trứng → gọi video → bấm nghe ───────── */
function trungMeo(ctx, x, y, rx, ry, u, w = 5) {   // vòng khoanh méo hình quả trứng
  if (u <= 0) return; const n = 48, k = Math.floor(n * 1.08 * clamp(u)), pts = [];
  for (let i = 0; i <= k; i++) { const a = -1.9 + (i / n) * Math.PI * 2, ov = Math.sin(a) < 0 ? 1.35 : 0.9; pts.push([x + Math.cos(a) * rx * (1 + 0.12 * Math.sin(a * 3)), y + Math.sin(a) * ry * ov]); }
  if (pts.length > 1) netPts(ctx, pts, { w, mau: "#e0392f", seed: 2200 });
  return pts[pts.length - 1];
}
function naoChay(ctx, x, y, k, t) {   // bộ não có chân chạy theo sau
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); const s = Math.floor(t * 12) % 2 ? 1 : -1;
  netPts(ctx, [[-16, 40], [-20 + s * 18, 92]], { w: 7 }); netPts(ctx, [[16, 40], [20 - s * 18, 92]], { w: 7 });
  netPts(ctx, [[-56, 0], [-90, -20 + s * 16]], { w: 6 }); netPts(ctx, [[56, 0], [92, -18 - s * 16]], { w: 6 });
  ve(ctx, "M-60,0 C-72,-40 -30,-72 0,-62 C30,-76 72,-48 64,-10 C80,12 60,46 30,40 C10,56 -30,54 -40,36 C-72,40 -82,16 -60,0 Z", "#f7a8b8", { w: 5 });
  net(ctx, "M-30,-42 C-20,-20 -40,0 -20,20 M10,-52 C0,-30 20,-10 10,10 M40,-22 C30,0 46,20 30,30", { w: 3, mau: "#d9707f" });
  to(ctx, elip(-14, -6, 6, 8), MUC); to(ctx, elip(14, -6, 6, 8), MUC); net(ctx, "M-10,18 C-4,12 4,12 10,18", { w: 3.5 });
  ctx.restore(); moHoi(ctx, x + 70 * k, y - 60 * k, 0.8 * k);
}
function c56(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tCai = m(c, 10), tKhoanh = m(c, 13), tMeo = m(c, 17), tRoi = m(c, 21), tVideo = m(c, 24), tToi = m(c, 26), tNao = m(c, 31);
  if (tl < tCai) {
    ctx.save(); cam(ctx, 1060, 500, 1.18);
    phongNgay(ctx, t, { gio: 12, phut: 0, lich: false });
    const nhan = tl >= m(c, 3);
    banLamViec(ctx, t, { mat: nhan ? "ngac" : "thuong", nhin: [-0.6, 0.6] }, { thot: false, tren: (g) => {
      D.batPho(g, 1280, 610, 0.6, t);
      g.save(); g.translate(860, 618); g.scale(1, 0.45); D.dienThoai(g, 0, 0, 0.62, 1.4, (h) => { h.fillStyle = nhan ? "#dfe9f5" : "#1c1f2e"; h.fillRect(-80, -140, 160, 280); }); g.restore();
      if (nhan) { rung(g, 860, 612, 110, 1); const u = back(vao(tl, m(c, 3), 0.25)); g.save(); g.translate(820, 470); g.scale(u, u); ve(g, rect(-150, -50, 300, 100, 22), "#ffffff", { w: 5 }); dauNho(g, -112, 0, 28, "me"); viet(g, "Mẹ: [hình ảnh]", -74, 14, { size: 38, pop: false, soi: false, can: "left" }); g.restore(); }
    } });
    ctx.restore();
    viet(ctx, "trưa đấy", 300, 160, { size: 84, mau: MUC, u: vao(tl, 0.02), xoay: -0.05, nen: GIAY });
  } else if (tl < tRoi) {
    giay(ctx, "#f3efe6");
    const X = 820, Y = 540, K = 3.1, [rx0, ry0] = nhanO(TAY_A), kA = 0.78, oX = -42, oY = -26;
    let dau = null;
    D.dienThoai(ctx, X, Y, K, 0, (g) => {
      g.fillStyle = "#1c1f2e"; g.fillRect(-80, -140, 160, 280);
      anhBua(g, oX, oY, kA, { vien: false });
      dau = trungMeo(g, oX + rx0 * kA, oY + ry0 * kA, 26, 21, vao(tl, tKhoanh, tMeo - tKhoanh + 0.1), 2.6);
      viet(g, "ảnh chụp màn hình", 0, 118, { size: 12, mau: "#c9d4ee", pop: false, soi: false });
    }, { vo: "#33364a" });
    if (dau && tl < tMeo + 0.2) ngon(ctx, X + dau[0] * K, Y + dau[1] * K, 0.9, 1.15);
    if (tl >= tMeo) {
      viet(ctx, "méo như", 1500, 420, { size: 90, u: vao(tl, tMeo), xoay: -0.05 }); viet(ctx, "quả trứng", 1520, 540, { size: 100, mau: "#e0392f", u: vao(tl, m(c, 19)), xoay: 0.03 });
      ve(ctx, "M1500,620 C1450,620 1440,700 1440,740 C1440,790 1470,812 1500,812 C1530,812 1560,790 1560,740 C1560,700 1550,620 1500,620 Z", "#fffdf5", { w: 5 });
    } else viet(ctx, "cái nhẫn", 1500, 420, { size: 90, u: vao(tl, m(c, 11)), xoay: -0.04 });
  } else if (tl < tToi) {
    giay(ctx, "#2b3150");
    const run = (Math.floor(tq * 12) % 2 ? 1 : -1) * 7;
    D.dienThoai(ctx, 820 + run, 540, 3.1, run * 0.003, (g) => {
      g.fillStyle = "#3a4466"; g.fillRect(-80, -140, 160, 280);
      dauNho(g, 0, -50, 40, "me"); net(g, elip(0, -50, 40, 40), { w: 2.5, mau: "#fff" });
      viet(g, "Mẹ ♥", 0, 26, { size: 30, mau: "#fff", pop: false, soi: false }); viet(g, tl >= tVideo ? "cuộc gọi VIDEO…" : "đang gọi…", 0, 50, { size: 15, mau: "#c9d4ee", pop: false, soi: false });
      to(g, elip(-38, 100, 16, 16), "#e5484d"); to(g, elip(38, 100, 16, 16), "#30c46b");
    }, { vo: "#33364a" });
    rung(ctx, 820, 540, 320, 2, "#c9d4ee");
    viet(ctx, "rồi mẹ gọi.", 1590, 380, { size: 84, mau: GIAY, u: vao(tl, tRoi + 0.05), xoay: -0.04 });
    if (tl >= tVideo) viet(ctx, "GỌI VIDEO.", 1590, 560, { size: 110, mau: "#ff5a4f", u: vao(tl, tVideo, 0.18), xoay: 0.05 });
  } else {
    giay(ctx, "#2b3150");
    D.dienThoai(ctx, 760, 540, 3.1, 0, (g) => {
      g.fillStyle = "#3a4466"; g.fillRect(-80, -140, 160, 280); dauNho(g, 0, -50, 40, "me"); viet(g, "Mẹ ♥", 0, 26, { size: 30, mau: "#fff", pop: false, soi: false });
      to(g, elip(-38, 100, 16, 16), "#e5484d"); to(g, elip(38, 100, 16, 16), "#30c46b");
    }, { vo: "#33364a" });
    const bx = 760 + 38 * 3.1, by = 540 + 100 * 3.1, u = eout(vao(tq, tToi, 0.25)), a = 0.74;   // ngón trỏ Hiếu lao xuống nút xanh
    const L = lerp(420, 0, u), hx = bx - Math.cos(a) * L, hy = by - Math.sin(a) * L;
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(a); ctx.scale(3.4, 3.4); ctx.translate(-60, 0);
    ve(ctx, "M-14,-22 C-80,-30 -200,-40 -320,-46 L-320,46 C-200,40 -80,30 -14,22 Z", "#f2b544", { w: 5 }); bong(ctx, "M-14,-22 C-80,-30 -200,-40 -320,-46 L-320,46 C-200,40 -80,30 -14,22 Z", "M-330,10 L0,6 L0,50 L-330,50 Z", "#d8952a"); ve(ctx, rect(-40, -27, 30, 54, 10), "#d8952a", { w: 4 }); banTay(ctx, "chi", 1, 70); ctx.restore();
    if (u >= 1) { tiaNhan(ctx, bx, by, 70, 130, 8, { a0: -Math.PI / 2, goc: 0.7, w: 6, mau: "#30c46b" }); chop(ctx, tl, tToi + 0.25, 0.4); }
    if (tl >= m(c, 29)) { const nu = eout(vao(tl, m(c, 29), 0.7)); naoChay(ctx, lerp(-160, 360, nu), 900, 1.6, t); viet(ctx, "não: chờ tao!", 1570, 600, { size: 80, mau: "#f7a8b8", u: vao(tl, tNao), xoay: -0.05 }); }
    viet(ctx, "bấm nghe", 1520, 380, { size: 96, mau: GIAY, u: vao(tl, m(c, 27)), xoay: -0.04 });
  }
}

/* ───────── 57: MẸ "Tay ai đây? … sao lại nằm trên tay anh Tuấn? Mày cho nó mượn à?" ───────── */
function c57(ctx, t, uf, c) {
  const tl = c.tl, tNhan = m(c, 3), tTuan = m(c, 13), tMay = m(c, 16);
  const nghieng = tl >= tMay ? lerp(0.1, 0.18, vao(tl, tMay, 0.3)) : 0.1, z = tl >= tMay ? lerp(1, 1.12, eio(pha(tl, tMay, tMay + 0.6))) : 1;
  goiMe(ctx, t, c, { mat: "nheo", ngh: nghieng, dx: -28, z, pipMat: "hoang", pipX: -68, tayP: { p: [180, -116], cong: 24, kieu: "nam" }, them: (g) => {
    D.dienThoai(g, 50, -30, 0.3, 0.1, (h) => {
      h.fillStyle = "#e7eef7"; h.fillRect(-80, -140, 160, 280); to(h, rect(-80, -140, 160, 32, 0), "#2f7fe0"); viet(h, "Thoa Nguyễn", 0, -116, { size: 16, mau: "#fff", pop: false, soi: false });
      anhBua(h, 0, -30, 0.46, { goc: 0.14, T: TAY_B });
      const [rx, ry] = nhanO(TAY_B); if (tl >= tNhan) khoanh(h, rx * 0.46, -30 + ry * 0.46, 22, 18, vao(tl, tNhan, 0.4), "#e0392f", 4);
      if (tl >= tTuan) viet(h, "anh Tuấn", 0, 70, { size: 26, mau: "#e0392f", pop: false });
    });
  } });
  viet(ctx, "TAY AI", 1560, 300, { size: 150, mau: "#ff5a4f", u: vao(tl, 0, 0.2), xoay: 0.05 }); viet(ctx, "ĐÂY?", 1580, 470, { size: 170, mau: "#ff5a4f", u: vao(tl, m(c, 2), 0.2), xoay: -0.04 });
  if (tl >= tMay) viet(ctx, "cho nó mượn à?", 1560, 760, { size: 80, mau: GIAY, u: vao(tl, tMay + 0.05), xoay: -0.03 });
  else if (tl >= tTuan) viet(ctx, "tay anh Tuấn?", 1560, 760, { size: 80, mau: GIAY, u: vao(tl, tTuan), xoay: -0.03 });
}

/* ───────── 58: 3 tháng mẹ không phóng to ảnh anh Tuấn… đêm qua ngắm từng miếng cá của tôi… sáng nay nằm trước mặt anh Tuấn ───────── */
function c58(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tPhong = m(c, 7), tNhung = m(c, 17), tTung = m(c, 23), tSang = m(c, 28), tMay = m(c, 30), tNam = m(c, 35), tTuan = m(c, 38);
  if (tl < tPhong) {
    nhaMe(ctx, t, "bep");
    veNV(ctx, 640, 560, 1.15, { t, kieu: "me", mat: "chan", nhin: [0.4, 0.5], tayP: { p: [80, 40], cong: 20, kieu: Math.floor(tq * 10) % 2 ? "chi" : "nam" }, tayT: { p: [50, 70], cong: -20 } });
    D.dienThoaiSau(ctx, 640 + 90 * 1.15, 560 + 20 * 1.15, 0.5, 0.2);
    for (let j = 0; j < 6; j++) {   // bài anh Tuấn lướt vèo qua, không ai mở
      const y = 760 - ((tl * 1100 + j * 190) % 1100), a = clamp(1 - Math.abs(y - 400) / 520);
      if (y < -120) continue; ctx.save(); ctx.globalAlpha = a; ctx.translate(1060, y);
      ve(ctx, rect(-110, -70, 220, 140, 12), "#ffffff", { w: 4 }); anhBua(ctx, -40, 0, 0.42, { T: TAY_B, goc: 0.14 }); viet(ctx, "omakase", 60, 10, { size: 26, pop: false, soi: false });
      ctx.restore();
    }
    viet(ctx, "gần 3 tháng", 1560, 560, { size: 100, u: vao(tl, m(c, 1)), xoay: -0.05, nen: GIAY }); viet(ctx, "lướt qua hết", 1560, 690, { size: 70, mau: "#6b6560", u: vao(tl, m(c, 5)), nen: GIAY });
  } else if (tl < tNhung) {
    nhaMe(ctx, t, "bep");
    veNV(ctx, 700, 560, 1.15, { t, kieu: "me", mat: "nham", ngh: -0.16, nhin: [-0.9, -0.1], tayP: { p: [200, -36], cong: 6 }, tayT: { p: [-140, -110], cong: -30, kieu: "xoe" } });
    const px = 700 + 214 * 1.15, py = 560 - 40 * 1.15;
    D.dienThoaiSau(ctx, px, py, 0.55, -0.2);
    const nh = 0.7 + 0.3 * (Math.floor(tq * 8) % 2);
    for (let i = 0; i < 7; i++) { const a = Math.PI + (i - 3) * 0.16; netPts(ctx, [[px - 40 + Math.cos(a) * 60, py + Math.sin(a) * 60], [px - 40 + Math.cos(a) * (200 * nh), py + Math.sin(a) * (200 * nh)]], { w: 10, mau: "#f2a516", seed: 2300 + i }); }
    sao(ctx, px - 30, py - 70, 30, t); sao(ctx, px + 40, py - 120, 22, t + 1);
    viet(ctx, "phóng to?", 1450, 300, { size: 90, u: vao(tl, tPhong), xoay: -0.04, nen: GIAY }); if (tl >= tPhong + 0.4) netPts(ctx, [[1270, 270], [1640, 300]], { w: 10, mau: "#e0392f" });
    if (tl >= m(c, 15)) viet(ctx, "đau mắt!", 1460, 470, { size: 110, mau: "#e0392f", u: vao(tl, m(c, 15)), xoay: 0.05, nen: GIAY });
  } else if (tl < tSang) {
    nhaMe(ctx, t, "phongngu");
    veNV(ctx, 1350, 600, 1.1, { t, kieu: "me", mat: "thuong2", nhin: [-0.5, 0.6], chan: false, tayP: { p: [-30, 70], cong: 30 }, tayT: { p: [-60, 70], cong: -20 } });
    D.dienThoaiSau(ctx, 1350 - 50 * 1.1, 600 + 50 * 1.1, 0.46, -0.3);
    for (let i = 0; i < 3; i++) { const yy = 420 - ((tl * 80 + i * 60) % 180); viet(ctx, "♥", 1460 + i * 40, yy, { size: 44, mau: "#f39c9c", pop: false }); }
    to(ctx, elip(1150, 470, 16, 16), "#ffffff"); to(ctx, elip(1080, 420, 22, 22), "#ffffff");
    ve(ctx, rect(480, 120, 560, 420, 24), "#ffffff", { w: 5 });
    const so = tl >= tTung ? Math.min(8, 1 + Math.floor((tl - tTung) / 0.13)) : 0;
    anhBua(ctx, 760, 320, 1.6, { so });
    viet(ctx, "đêm qua", 300, 990, { size: 84, mau: GIAY, u: vao(tl, m(c, 18)), xoay: -0.05 });
    if (tl >= tTung) viet(ctx, "từng miếng cá", 760, 620, { size: 64, mau: GIAY, u: vao(tl, tTung), xoay: 0.02 });
  } else {
    giay(ctx);
    const A = [530, 480, 1.72, 0], B = [1390, 480, 1.72, 0.14];
    anhBua(ctx, A[0], A[1], A[2], {}); anhBua(ctx, B[0], B[1], B[2], { goc: B[3], T: TAY_B });
    viet(ctx, "con tôi", 530, 190, { size: 80, u: vao(tl, tSang), xoay: -0.04 }); viet(ctx, "đêm qua", 530, 820, { size: 64, mau: "#6b6560", u: vao(tl, tSang + 0.2) });
    viet(ctx, "sáng nay", 1390, 820, { size: 64, mau: "#6b6560", u: vao(tl, m(c, 29)) });
    if (tl >= tTuan) viet(ctx, "anh Tuấn", 1390, 190, { size: 80, mau: "#e0392f", u: vao(tl, tTuan), xoay: 0.04 });
    for (let i = 0; i < 8; i++) {   // nối từng miếng cá khớp nhau
      const u = vao(tl, tMay + i * 0.16, 0.25); if (u <= 0) continue;
      const [x1, y1] = viTriMieng(A[0], A[1], A[2], A[3], i), [x2, y2] = viTriMieng(B[0], B[1], B[2], B[3], i), pts = [];
      for (let k = 0; k <= 24; k++) { const v = (k / 24) * u; pts.push([lerp(x1, x2, v), lerp(y1, y2, v) - Math.sin(v * Math.PI) * (90 + i * 6)]); }
      netPts(ctx, pts, { w: 5, mau: "#e0392f", seed: 2400 + i * 30, dau: 0.04 }); if (u >= 1) { to(ctx, elip(x1, y1, 7, 7), "#e0392f"); to(ctx, elip(x2, y2, 7, 7), "#e0392f"); }
    }
    if (tl >= tNam) { const [ax, ay] = nhanO(TAY_A), [bx, by] = nhanO(TAY_B); khoanh(ctx, A[0] + ax * A[2], A[1] + ay * A[2], 44, 38, vao(tl, tNam, 0.35)); khoanh(ctx, B[0] + bx * B[2], B[1] + by * B[2], 44, 38, vao(tl, tNam + 0.15, 0.35)); }
  }
}

/* ───────── 59: Cục Phòng chống Phông bạt check var bằng phần mềm. Mẹ tôi check var bằng hai ngón tay ───────── */
function c59(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tMe = m(c, 10), tHai = m(c, 15);
  if (tl < tMe) {
    giay(ctx, "#dfe6ee"); to(ctx, rect(0, 820, W, 260, 0), "#b9c2cf"); netPts(ctx, [[-10, 820], [W + 10, 820]], { w: 6 });
    ve(ctx, rect(360, 60, 1200, 180, 14), "#2f5fae", { w: 6 }); viet(ctx, "CỤC PHÒNG CHỐNG", 960, 140, { size: 72, mau: "#fff", pop: false }); viet(ctx, "PHÔNG BẠT", 960, 215, { size: 72, mau: "#ffd23e", pop: false });
    for (const [x, i] of [[470, 0], [930, 1]]) {
      ve(ctx, rect(x - 200, 330, 400, 280, 14), "#3a3d4a", { w: 6 }); to(ctx, rect(x - 184, 346, 368, 248, 6), "#14213d");
      for (let j = 0; j < 12; j++) { const q = rng(2500 + i * 20 + j); to(ctx, rect(x - 172 + (j % 4) * 90, 360 + Math.floor(j / 4) * 76, 78, 62, 4), ["#3a6fb5", "#e2a04a", "#6fbf73", "#c25a7a"][Math.floor(q() * 4)]); }
      const sy = 346 + ((tl * 260 + i * 120) % 248); to(ctx, rect(x - 184, sy, 368, 6, 0), "#30ff8a");
      if (Math.floor(tq * 4 + i) % 2) { net(ctx, rect(x - 80, 436, 80, 66, 4), { w: 5, mau: "#ff3b30" }); }
      ve(ctx, rect(x - 30, 610, 60, 60, 4), "#3a3d4a", { w: 5 });
    }
    ve(ctx, rect(150, 670, 1110, 30, 6), "#c9cdd6", { w: 5 });
    veNV(ctx, 1520, 600, 1.05, { t, kieu: "sep", mat: "nheo", nhin: [-0.7, 0.2], chan: false, tayT: { p: [-120, Math.floor(tq * 10) % 2 ? 110 : 98], cong: -20 }, tayP: { p: [-40, Math.floor(tq * 10) % 2 ? 98 : 110], cong: 20 } });
    net(ctx, `M${1520 - 125},${600 - 120} C${1520 - 120},${600 - 290} ${1520 + 120},${600 - 290} ${1520 + 125},${600 - 120}`, { w: 8, mau: "#3a3d4a" }); netPts(ctx, [[1520 - 120, 600 - 100], [1520 - 60, 600 - 40]], { w: 5 });
    ve(ctx, rect(1250, 740, 520, 80, 10), "#5a5f6e", { w: 5 });
    const p = Math.min(99, Math.floor(tl * 45)); ve(ctx, rect(180, 880, 900, 60, 12), "#ffffff", { w: 5 }); to(ctx, rect(186, 886, 888 * p / 100, 48, 8), "#30c46b"); viet(ctx, `đang quét… ${p}%`, 630, 925, { size: 44, pop: false });
  } else {
    giay(ctx, "#f3efe6");
    const X = 900, Y = 540, K = 3.1, [rx, ry] = nhanO(TAY_B), u = eio(clamp((tl - tMe - 0.1) / (tHai + 0.5 - tMe))), s = 0.46 * Math.pow(5.5, u);
    D.dienThoai(ctx, X, Y, K, 0, (g) => {
      g.fillStyle = "#1c1f2e"; g.fillRect(-80, -140, 160, 280);
      anhBua(g, lerp(0, -rx * s, u), lerp(-10, -ry * s, u), s, { goc: 0.14, T: TAY_B, vien: false });
    }, { vo: "#33364a" });
    const sp = lerp(10, 70, u);   // hai ngón tay mẹ banh ra
    ngon(ctx, X - 20 - sp * K * 0.45, Y + 40 + sp * K * 0.45, 2.3, 0.7); ngon(ctx, X + 20 + sp * K * 0.45, Y + 30 - sp * K * 0.3, 0.45, 0.7);
    if (tl >= m(c, 17)) khoanh(ctx, X, Y, 120, 70, vao(tl, m(c, 17), 0.3), "#e0392f", 10);
    if (tl >= tHai) { viet(ctx, "2 ngón tay", 400, 820, { size: 80, u: vao(tl, tHai), xoay: -0.05 }); muiTen(ctx, 520, 760, 680, 690, vao(tl, tHai + 0.1, 0.3)); }
    viet(ctx, "mẹ tôi:", 380, 260, { size: 84, u: vao(tl, tMe), xoay: -0.05 });
    if (tl >= m(c, 17) + 0.1) { const v = back(vao(tl, m(c, 17) + 0.1, 0.2)); ctx.save(); ctx.translate(1560, 300); ctx.rotate(-0.16); ctx.scale(v, v); net(ctx, rect(-220, -80, 440, 140, 12), { w: 9, mau: "#e0392f" }); viet(ctx, "BẮT ĐƯỢC!", 0, 26, { size: 96, mau: "#e0392f", pop: false }); ctx.restore(); }
  }
}

/* ───────── 60: tôi đéo nói gì, nhưng tai tôi đỏ, qua màn hình mẹ vẫn thấy ───────── */
function c60(ctx, t, uf, c) {
  const tl = c.tl, tNhung = m(c, 4), tTai = m(c, 5), tQua = m(c, 8);
  const taiDo = clamp((tl - tTai) / (m(c, 7) + 0.25 - tTai));
  if (tl < tQua) {
    giay(ctx, "#f6e7d6");
    const X = 960, Y = 1000, K = 2.5, ex = X + 110 * K, ey = Y - 95 * K + 12 * K;
    const u = eio(vao(tl, tNhung, 0.45));
    ctx.save(); cam(ctx, lerp(960, ex - 120, u), lerp(540, ey - 60, u), lerp(1, 1.9, u));
    veNV(ctx, X, Y, K, { t, mat: "im", nhin: [0.3, 0.2], chan: false, taiDo });
    const my = Y - 95 * K + 46 * K;   // khoá kéo trên miệng
    ve(ctx, rect(X - 96, my - 16, 192, 32, 10), "#d9d4cc", { w: 5 }); netPts(ctx, [[X - 90, my], [X + 90, my]], { w: 5 }); for (let i = 0; i < 12; i++) netPts(ctx, [[X - 84 + i * 15, my - 12], [X - 84 + i * 15, my + 12]], { w: 4, seed: 2600 + i }); ve(ctx, rect(X + 92, my - 14, 30, 50, 8), "#b9bcc6", { w: 5 });
    moHoi(ctx, X - 230, Y - 330, 1.4);
    denGiaoThong(ctx, ex + 210, ey - 150, 0.9, taiDo);
    ctx.restore();
    if (tl < tNhung) viet(ctx, "…", 1500, 300, { size: 160, u: vao(tl, m(c, 2)) });
    else viet(ctx, "tai đỏ", 1600, 880, { size: 120, mau: "#e0392f", u: vao(tl, m(c, 7)), xoay: -0.05, nen: "#f6e7d6" });
  } else {
    giay(ctx, "#2b3150");
    D.dienThoai(ctx, 760, 560, 3.25, 0, (g) => {
      g.fillStyle = "#f1e6d3"; g.fillRect(-80, -140, 160, 280); g.fillStyle = "#d9c4a3"; g.fillRect(-80, 50, 160, 90);
      veNV(g, 0, 70, 0.42, { t, mat: "cui", nhin: [0, 0.6], chan: false, taiDo: 1 });
      ve(g, rect(30, -122, 38, 52, 5), "#e9dcc8", { w: 1.8 }); g.save(); g.beginPath(); g.rect(30, -122, 38, 52); g.clip(); veNV(g, 49, -82, 0.14, { t, kieu: "me", mat: "nheo", chan: false }); g.restore(); net(g, rect(30, -122, 38, 52, 5), { w: 1.8 });
    }, { vo: "#1c1f2e" });
    for (const s of [-1, 1]) { const x = 760 + s * 110 * 0.42 * 3.25, y = 560 + (70 - 95 * 0.42 + 12 * 0.42) * 3.25; tiaNhan(ctx, x, y, 70, 130, 5, { a0: s > 0 ? 0 : Math.PI, goc: 0.4, w: 8, mau: "#ff5a4f" }); }
    viet(ctx, "mẹ vẫn thấy", 1520, 470, { size: 96, mau: GIAY, u: vao(tl, m(c, 11)), xoay: -0.04 });
  }
}

/* ───────── 61: MẸ "Thế bữa nào là bữa của mày?" ───────── */
function c61(ctx, t, uf, c) {
  const tl = c.tl, z = lerp(1, 1.06, eio(tl / c.dur));
  goiMe(ctx, t, c, { mat: "buon", noi: c.noi * 0.45, chop: true, z, gio: dongHoGoi(312, tl), pipMat: "cui", pipTai: 1 });
  viet(ctx, "bữa nào", 1540, 430, { size: 96, mau: "#c9d4ee", u: vao(tl, m(c, 1)), xoay: -0.03 }); viet(ctx, "là của mày?", 1560, 560, { size: 96, mau: "#c9d4ee", u: vao(tl, m(c, 4)), xoay: 0.02 });
}

/* ───────── 62: TÔI "Không bữa nào ạ." ───────── */
function c62(ctx, t, uf, c) {
  const tl = c.tl;
  giay(ctx, "#232845"); ctx.save(); ctx.globalAlpha = 0.5; to(ctx, elip(860, 1010, 420, 70), "#3a4166"); ctx.restore();
  veNV(ctx, 860, 700, 1.45, { t, mat: "cui", ngh: 0.04, nhin: [0, 0.9], noi: c.noi * 0.55, taiDo: 1, tayT: { p: [-40, 130], cong: -10 }, tayP: { p: [40, 130], cong: 10 } });
  for (let i = 0; i < 6; i++) netPts(ctx, [[710 + i * 60, 160 - (i % 2) * 20], [710 + i * 60, 240 - (i % 2) * 20]], { w: 6, mau: "#5a6390", seed: 2700 + i });
  viet(ctx, "“Không bữa", 1500, 500, { size: 84, mau: "#c9d4ee", u: vao(tl, 0.05) }); viet(ctx, "nào ạ.”", 1520, 610, { size: 84, mau: "#c9d4ee", u: vao(tl, m(c, 2)) });
}

/* ───────── 63: tôi khai hết: 8 triệu, 5 triệu tiền phòng, cái thớt, ghế mát xa, 30 góc ───────── */
function c63(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl);
  giay(ctx, "#d9b48a"); for (let i = 0; i < 9; i++) netPts(ctx, [[i * 220, 0], [i * 220, 1080]], { w: 4, mau: "#c49a6c", seed: 2800 + i });
  to(ctx, rect(0, 880, W, 200, 0), "#b8875a"); netPts(ctx, [[-10, 880], [W + 10, 880]], { w: 6 });
  ve(ctx, rect(1300, 120, 560, 220, 12), "#9c6a44", { w: 6 });   // bàn chủ toạ: mẹ trên điện thoại
  D.dienThoai(ctx, 1580, 160, 0.95, 0, (g) => { g.fillStyle = "#e9dcc8"; g.fillRect(-80, -140, 160, 280); veNV(g, 0, 66, 0.42, { t, kieu: "me", mat: "nheo", chan: false }); }, { vo: "#1c1f2e" });
  ve(ctx, rect(1330, 260, 120, 26, 8), "#7a4a2a", { w: 4 }); ve(ctx, rect(1380, 230, 26, 60, 6), "#7a4a2a", { w: 4 });
  ve(ctx, rect(170, 620, 460, 280, 10), "#a8703c", { w: 6 });   // bục khai
  veNV(ctx, 400, 560, 1.0, { t, mat: "hoang", nhin: [0.6, -0.3], noi: c.noi, anTay: false, chan: false, tayP: { p: [120, -150], cong: 20, kieu: "xoe", lat: -1 }, tayT: { p: [-60, 90], cong: -10 } });
  ve(ctx, rect(150, 600, 500, 40, 8), "#c48b5c", { w: 6 });
  const DS = [[m(c, 3), 880, 330, (g, x, y) => phieuLuong(g, x, y, 1)], [m(c, 5), 1190, 520, (g, x, y) => { nhaNho(g, x, y, 1.05); viet(g, "5tr/tháng", x, y + 110, { size: 44, mau: "#e0392f", pop: false }); }],
    [m(c, 9), 830, 660, (g, x, y) => D.thot(g, x, y, 0.9, "go", -0.2)], [m(c, 11), 1520, 700, (g, x, y) => gheMat(g, x, y, 0.85)], [m(c, 14), 1080, 840, (g, x, y) => khungNgam(g, x, y, 1)]];
  DS.forEach(([t0, x, y, fn], i) => {
    if (tl < t0) return; const u = eout(vao(tq, t0, 0.25)), xx = lerp(W + 300, x, u), yy = y - Math.sin(u * Math.PI) * 120;
    fn(ctx, xx, yy); if (u >= 1) thePhieu(ctx, x + [130, 120, 170, 140, 130][i], y - [70, 80, 50, 140, 60][i], i + 1, 0.1);
  });
  viet(ctx, "tôi khai hết.", 400, 200, { size: 96, u: vao(tl, 0.05), xoay: -0.04 });
}

/* ───────── 64: mẹ im rất lâu, rồi hỏi đúng một câu ───────── */
function c64(ctx, t, uf, c) {
  const tl = c.tl;
  goiMe(ctx, t, c, { mat: "im", noi: 0, chop: true, gio: dongHoGoi(334, tl, 26), pipMat: "cui", pipTai: 1 });
  const ch = ["", ".", "..", "..."][Math.min(3, Math.floor(tl / 0.55))];
  viet(ctx, ch, 1500, 520, { size: 200, mau: "#c9d4ee", pop: false });
  if (tl >= m(c, 3)) viet(ctx, "rồi hỏi một câu:", 1540, 760, { size: 76, mau: "#c9d4ee", u: vao(tl, m(c, 3)), xoay: -0.03 });
}

/* ───────── 65: MẸ "Thế anh Tuấn…?" — mặt mẹ đổi sắc ───────── */
function c65(ctx, t, uf, c) {
  const tl = c.tl, u = eio(vao(tl, m(c, 1), 0.5));
  goiMe(ctx, t, c, { noi: c.noi * 0.45, nen: u > 0.5 ? "#1d2238" : "#2b3150", mat: u > 0.5 ? "bong" : "im", ngh: lerp(0, -0.05, u), mauNen: u > 0.5 ? "#c9d2de" : "#e9dcc8", mauSan: u > 0.5 ? "#a9b4c4" : "#cdb89a", gio: dongHoGoi(410, tl), pipMat: "cui", pipTai: 1, them: (g) => {
    if (u > 0) { g.save(); g.globalAlpha = 0.28 * u; to(g, elip(0, 30, 52, 46), "#7fa4d9"); g.restore(); for (let i = 0; i < 6; i++) netPts(g, [[-26 + i * 10, -10], [-26 + i * 10, 10]], { w: 1.8, mau: "#5a6aa0", seed: 2900 + i, alpha: u }); }
  } });
  viet(ctx, "…anh Tuấn?", 1540, 500, { size: 110, mau: "#c9d4ee", u: vao(tl, m(c, 1)), xoay: -0.03 });
}

/* ───────── 66: 23:40 đêm chủ nhật — khách đêm chưa nhắn tối chủ nhật bao giờ — khách nhắn ───────── */
function c66(ctx, t, uf, c) {
  const tl = c.tl, tq = T12(tl), tKhach = m(c, 5), tNhan = m(c, 14);
  if (tl < tKhach) {
    ctx.save(); cam(ctx, 960, 600, 1.1);
    phongDem(ctx, t, { gio: 23, phut: 40, lich: false }); toi(ctx, 0.35);
    ve(ctx, rect(420, 860, 1100, 110, 26), "#c9d0e6", { w: 6 }); ve(ctx, rect(460, 830, 200, 60, 24), "#eef0f8", { w: 5 });
    veNV(ctx, 640, 860, 0.95, { t, mat: "trang", nhin: [0, -1], xoay: -Math.PI / 2, tayT: { p: [-40, 120], cong: -10 }, tayP: { p: [40, 120], cong: 10 } });
    ctx.save(); ctx.translate(1290, 900); ctx.scale(1, 0.45); D.dienThoai(ctx, 0, 0, 0.6, 1.5, (h) => { h.fillStyle = "#1c1f2e"; h.fillRect(-80, -140, 160, 280); }); ctx.restore();
    ctx.restore();
    viet(ctx, "23:40", 1500, 230, { size: 130, mau: "#ffd93b", u: vao(tl, m(c, 0)), xoay: -0.04 }); viet(ctx, "chủ nhật", 1520, 350, { size: 84, mau: GIAY, u: vao(tl, m(c, 3)), xoay: 0.03 });
  } else if (tl < tNhan) {
    giay(ctx, "#1b1f36");
    D.dienThoai(ctx, 760, 540, 3.2, 0, (g) => chatT(g, t, [{ nhan: "Thứ bảy", chu: "+10.000đ" }, { nhan: "Thứ bảy", chu: "+10.000đ" }, { nhan: "Thứ bảy", chu: "+10.000đ" }, { nhan: "CHỦ NHẬT", chu: "", u: 0 }], tl > tKhach + 0.8 ? 1 : 0), { vo: "#33364a" });
    viet(ctx, "toàn thứ bảy", 1520, 380, { size: 90, mau: GIAY, u: vao(tl, tKhach + 0.1), xoay: -0.04 });
    viet(ctx, "chủ nhật?!", 1540, 540, { size: 110, mau: "#ff5a4f", u: vao(tl, m(c, 10)), xoay: 0.04 });
  } else {
    ctx.save(); cam(ctx, 960, 560, 1.15);
    phongDem(ctx, t, { gio: 23, phut: 40, lich: false }); toi(ctx, 0.4);
    ve(ctx, rect(420, 860, 1100, 110, 26), "#c9d0e6", { w: 6 });
    veNV(ctx, 960, 640, 1.15, { t, mat: "ngac", nhin: [0, 0.5], chan: false, anTay: true });
    D.dienThoaiSau(ctx, 960, 780, 0.6, 0);
    veNV(ctx, 960, 640, 1.15, { t, chiTay: true, tayT: { p: [-50, 110], cong: -20 }, tayP: { p: [50, 110], cong: 20 } });
    ctx.restore();
    viet(ctx, "khách nhắn:", 1560, 300, { size: 90, mau: GIAY, u: vao(tl, tNhan), xoay: -0.04 });
  }
}

/* ───────── 67: KHÁCH ĐÊM "Em cũng gửi mẹ à?" — Hiếu đơ người ───────── */
function c67(ctx, t, uf, c) {
  const tl = c.tl, z = lerp(1, 1.08, eio(tl / c.dur));
  giay(ctx, "#1b1f36");
  ctx.save(); ctx.translate(700, 540); ctx.scale(z, z); ctx.translate(-700, -540);
  D.dienThoai(ctx, 700, 540, 3.2, 0, (g) => chatT(g, t, [{ nhan: "Thứ bảy", chu: "+10.000đ" }, { nhan: "Thứ bảy", chu: "+10.000đ" }, { nhan: "CHỦ NHẬT · 23:41", chu: "Em cũng gửi mẹ à?", u: vao(tl, 0.02, 0.25), mau: "#fff6c4", size: 14 }]), { vo: "#33364a" });
  ctx.restore();
  ctx.save(); ctx.filter = "grayscale(1)"; veNV(ctx, 1560, 800, 1.05, { t: 0, mat: "bong", nhin: [-0.4, 0], chan: false }); ctx.restore();
  for (let i = 0; i < 3; i++) netPts(ctx, [[1440 + i * 120, 490 - (i % 2) * 20], [1440 + i * 120, 545 - (i % 2) * 20]], { w: 6, mau: "#5a6390", seed: 3000 + i });
  viet(ctx, "đơ.", 1560, 1040, { size: 80, mau: "#9aa0ab", u: vao(tl, 0.5) });
  viet(ctx, "“Em cũng", 1520, 250, { size: 84, mau: GIAY, u: vao(tl, 0.05) }); viet(ctx, "gửi mẹ à?”", 1540, 360, { size: 84, mau: GIAY, u: vao(tl, m(c, 2)) });
}

export const CANH = { 54: c54, 55: c55, 56: c56, 57: c57, 58: c58, 59: c59, 60: c60, 61: c61, 62: c62, 63: c63, 64: c64, 65: c65, 66: c66, 67: c67 };
