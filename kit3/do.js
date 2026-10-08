// Đạo cụ + bối cảnh vẽ tay (gốc toạ độ ghi ở từng hàm).
import { MUC, W, H, ve, vePts, net, netPts, to, bong, elip, rect, duong, viet, lerp, clamp, on, rng, sao, rung } from "./but.js";

/* thớt — tâm (0,0), dài 300 */
export function thot(ctx, x, y, k = 1, loai = "go", xoay = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  const M = { go: ["#e3a96b", "#c98a4c"], nhua: ["#cfeee6", "#9fd3c6"], tre: ["#ecd391", "#d1b264"], den: ["#6d5a4a", "#55453a"] }[loai];
  const d = "M-150,-62 L110,-62 C122,-62 128,-54 132,-44 L150,-30 C160,-24 160,24 150,30 L132,44 C128,54 122,62 110,62 L-150,62 C-162,62 -168,54 -168,42 L-168,-42 C-168,-54 -162,-62 -150,-62 Z";
  to(ctx, d, M[0]); bong(ctx, d, "M-180,30 L180,30 L180,80 L-180,80 Z", M[1]);
  if (loai === "go") net(ctx, "M-140,-30 C-80,-36 -20,-24 60,-32 M-130,10 C-60,4 10,18 90,8", { w: 3, mau: "#a8703c", seed: 4 });
  if (loai === "tre") for (let i = -1; i <= 1; i++) netPts(ctx, [[-160, i * 30], [130, i * 30]], { w: 3, mau: "#b39446", seed: 5 + i });
  net(ctx, d, { w: 5.5, kin: true, seed: 3 }); ve(ctx, elip(138, 0, 9, 9), "#fbf9f4", { w: 4 });
  ctx.restore();
}
/* sushi nigiri — tâm (0,0), rộng ~100: miếng cá phủ lên nắm cơm */
export function sushi(ctx, x, y, k = 1, loai = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-38,6 C-40,-8 -24,-14 0,-14 C24,-14 40,-8 38,6 C34,18 -34,18 -38,6 Z", "#fffdf6", { w: 4.5, seed: 21 });
  for (const [a, b] of [[-20, 8], [4, 10], [22, 6]]) to(ctx, elip(a, b, 4, 2.6), "#e9e2cf");
  const L = loai % 4, top = ["#f7926a", "#d8434a", "#f6d35b", "#f6e3e3"][L];
  const d = "M-52,-2 C-54,-22 -30,-36 0,-36 C30,-36 54,-24 52,-4 C50,6 40,8 30,2 C10,-4 -10,-4 -30,2 C-42,8 -52,6 -52,-2 Z";
  to(ctx, d, top); bong(ctx, d, "M-60,-10 C-20,-18 20,-18 60,-12 L60,20 L-60,20 Z", ["#e4744d", "#b8323a", "#e2b93c", "#e8cccc"][L]);
  if (L === 0 || L === 3) net(ctx, "M-30,-28 C-26,-20 -24,-12 -28,-4 M-8,-33 C-4,-24 -2,-14 -6,-5 M14,-32 C18,-23 20,-14 16,-5 M34,-26 C38,-19 38,-12 36,-6", { w: 3.2, mau: "#ffffff", alpha: 0.85, seed: 23 });
  if (L === 2) ve(ctx, "M-9,-38 L9,-38 L9,16 L-9,16 Z", "#2f4a3a", { w: 3.5 });
  net(ctx, d, { w: 4.5, kin: true, seed: 22 });
  ctx.restore();
}
/* khay sushi siêu thị nhãn -50% — tâm (0,0) */
export function khaySushi(ctx, x, y, k = 1, con = 8, nhan = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-150,-40 L150,-40 L136,40 L-136,40 Z", "#3a3a3e", { w: 5 });
  for (let i = 0; i < con; i++) sushi(ctx, -105 + (i % 4) * 70, -14 + Math.floor(i / 4) * 30, 0.62, i);
  ve(ctx, "M-158,-46 L158,-46 L150,-30 L-150,-30 Z", "rgba(220,240,255,0.35)", { w: 3.5 });
  if (nhan > 0) { ctx.save(); ctx.translate(96, -50); ctx.rotate(0.2); ctx.scale(nhan, nhan); ve(ctx, elip(0, 0, 50, 34), "#ffd93b", { w: 5 }); viet(ctx, "-50%", 0, 14, { size: 40, mau: "#d63b2f", pop: false, dam: 0.06 }); ctx.restore(); }
  ctx.restore();
}
/* đèn bàn — gốc ở đế (0,0) */
export function denBan(ctx, x, y, k = 1, bat = 0, lat = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k * lat, k);
  ve(ctx, elip(0, 0, 60, 14), "#5c6b8a", { w: 5 });
  net(ctx, "M0,-6 L-30,-150 L50,-230", { w: 12, mau: "#5c6b8a", run: 0.6 }); net(ctx, "M0,-6 L-30,-150 L50,-230", { w: 3, mau: MUC });
  ve(ctx, elip(-30, -150, 10, 10), "#5c6b8a", { w: 4 });
  ctx.save(); ctx.translate(50, -230); ctx.rotate(0.5); ve(ctx, "M-40,0 C-40,-50 40,-50 40,0 Z", "#7486ab", { w: 5 }); if (bat > 0) to(ctx, elip(0, 0, 30, 8), "#fff6c4"); ctx.restore();
  ctx.restore();
}
export function quangDen(ctx, ax, ay, x0, x1, y, a) {   // vệt sáng hình nón từ chao đèn (ax,ay) xuống mặt bàn [x0,x1] ở y
  if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = a * 0.16;
  to(ctx, `M${ax - 22},${ay - 10} L${ax + 22},${ay + 10} L${x1},${y} L${x0},${y} Z`, "#ffd36a"); to(ctx, elip((x0 + x1) / 2, y - 6, (x1 - x0) / 2, 26), "#ffd36a"); ctx.restore();
}
/* bàn gỗ — mặt bàn trên cùng ở y, tâm x */
export function ban(ctx, x, y, w = 900, h = 300) {
  ve(ctx, rect(x - w / 2 + 30, y + 30, 26, h, 6), "#9c6a44", { w: 5 }); ve(ctx, rect(x + w / 2 - 56, y + 30, 26, h, 6), "#9c6a44", { w: 5 });
  ve(ctx, rect(x - w / 2, y, w, 40, 8), "#c48b5c", { w: 5.5 }); net(ctx, `M${x - w / 2 + 20},${y + 14} L${x - w / 4},${y + 14}`, { w: 3, mau: "#9c6a44" });
}
/* ghế nhựa đỏ — gốc chân ghế (0,0) */
export function gheNhua(ctx, x, y, k = 1, mau = "#e2533f") {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-70,-120 L70,-120 L84,0 L60,0 L48,-90 L-48,-90 L-60,0 L-84,0 Z", mau, { w: 5 });
  ve(ctx, rect(-80, -136, 160, 22, 8), mau, { w: 5 }); ve(ctx, elip(0, -100, 22, 9), "rgba(0,0,0,0.2)", { w: 3 });
  ctx.restore();
}
/* điện thoại — tâm (0,0), cao 300 (k=1); manHinh(g) vẽ trong toạ độ màn hình 150x270 tâm (0,0) */
export function dienThoai(ctx, x, y, k = 1, xoay = 0, manHinh = null, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  const v = rect(-84, -150, 168, 300, 26), m = rect(-72, -136, 144, 272, 16);
  ve(ctx, v, o.vo ?? "#33364a", { w: 5.5 });
  to(ctx, m, o.nen ?? "#dfe9f5"); if (manHinh) { ctx.save(); ctx.clip(new Path2D(m)); manHinh(ctx); ctx.restore(); }
  net(ctx, m, { w: 3.5 }); to(ctx, rect(-22, -130, 44, 10, 5), "#33364a");
  ctx.restore();
}
/* mặt sau điện thoại (cầm chụp) */
export function dienThoaiSau(ctx, x, y, k = 1, xoay = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, rect(-84, -150, 168, 300, 26), "#8fb3e0", { w: 5.5 }); ve(ctx, rect(-62, -128, 60, 70, 18), "#3b3f55", { w: 4 }); ve(ctx, elip(-46, -108, 12, 12), "#1b1d29", { w: 3 }); ve(ctx, elip(-20, -80, 12, 12), "#1b1d29", { w: 3 });
  ctx.restore();
}
/* cửa sổ có song sắt + trời đêm, trăng — góc trên trái (x,y) */
export function cuaSo(ctx, x, y, w, h, t = 0, dem = true) {
  const r = rect(x, y, w, h, 10);
  to(ctx, r, dem ? "#283a66" : "#bfe6ff");
  ctx.save(); ctx.clip(new Path2D(r));
  if (dem) { ve(ctx, elip(x + w * 0.72, y + h * 0.3, 40, 40), "#fff3c2", { w: 4 }); to(ctx, elip(x + w * 0.72 + 18, y + h * 0.3 - 10, 34, 34), "#283a66"); for (let i = 0; i < 7; i++) { const q = rng(40 + i); sao(ctx, x + q() * w, y + q() * h * 0.6, 8 + q() * 6, t + i, "#fff6d0"); } }
  for (let i = 0; i < 5; i++) { const bx = x + i * w / 5, bh = h * (0.35 + rng(70 + i)() * 0.3); ve(ctx, rect(bx, y + h - bh, w / 5 - 6, bh + 10, 0), dem ? "#1c2747" : "#9fc3df", { w: 3.5 }); if (dem) for (let j = 0; j < 4; j++) to(ctx, rect(bx + 10 + (j % 2) * 22, y + h - bh + 16 + Math.floor(j / 2) * 30, 10, 12, 2), "#ffd86b"); }
  ctx.restore();
  ve(ctx, r, null, { w: 6 }); for (let i = 1; i < 6; i++) netPts(ctx, [[x + (i * w) / 6, y + 4], [x + (i * w) / 6, y + h - 4]], { w: 5, seed: 90 + i }); netPts(ctx, [[x + 4, y + h * 0.5], [x + w - 4, y + h * 0.5]], { w: 5, seed: 97 });
}
/* đồng hồ treo tường */
export function dongHo(ctx, x, y, r, gio, phut) {
  ve(ctx, elip(x, y, r, r), "#fffdf5", { w: 6 }); ve(ctx, elip(x, y, r * 0.84, r * 0.84), null, { w: 2.5 });
  const a1 = ((gio % 12) / 12 + phut / 720) * Math.PI * 2 - Math.PI / 2, a2 = (phut / 60) * Math.PI * 2 - Math.PI / 2;
  netPts(ctx, [[x, y], [x + Math.cos(a1) * r * 0.5, y + Math.sin(a1) * r * 0.5]], { w: 7 }); netPts(ctx, [[x, y], [x + Math.cos(a2) * r * 0.74, y + Math.sin(a2) * r * 0.74]], { w: 5 });
  to(ctx, elip(x, y, 6, 6), MUC);
}
/* quạt cây — gốc chân (0,0) */
export function quat(ctx, x, y, k, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, elip(0, 0, 70, 16), "#7fb6d9", { w: 5 }); ve(ctx, rect(-8, -260, 16, 260, 6), "#7fb6d9", { w: 5 });
  ctx.save(); ctx.translate(0, -300); ve(ctx, elip(0, 0, 90, 90), "rgba(255,255,255,0.6)", { w: 5 });
  const a0 = Math.floor(t * 12) * 0.9; for (let i = 0; i < 3; i++) { ctx.save(); ctx.rotate(a0 + (i * Math.PI * 2) / 3); ve(ctx, "M0,0 C20,-20 30,-70 0,-76 C-30,-70 -20,-20 0,0 Z", "#a9d4ef", { w: 4, seed: 110 + i }); ctx.restore(); }
  ve(ctx, elip(0, 0, 14, 14), "#5a8fb5", { w: 4 }); ctx.restore(); ctx.restore();
}
/* tờ tiền VNĐ — tâm (0,0), dài 220 */
export const MENH = { 500: ["#86cfe0", "#4e9fb5", "500.000"], 100: ["#a6d58a", "#6aa452", "100.000"], 10: ["#e8c27a", "#b8904a", "10.000"], 1: ["#c9b3e6", "#8d72b8", "1.000.000"] };
export function tien(ctx, x, y, k = 1, menh = 500, xoay = 0) {
  const [m0, m1, so] = MENH[menh];
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, rect(-110, -52, 220, 104, 8), m0, { w: 4.5, seed: 120 + menh }); ve(ctx, elip(-56, 0, 30, 34), m1, { w: 3.5 }); net(ctx, rect(-100, -42, 200, 84, 5), { w: 2.5, mau: m1 });
  viet(ctx, so, 40, 14, { size: 36, mau: "#20343a", pop: false, soi: false, dam: 0.05 });
  ctx.restore();
}
/* máy ảnh DSLR — tâm (0,0) */
export function mayAnh(ctx, x, y, k = 1, xoay = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(xoay); ctx.scale(k, k);
  ve(ctx, "M-90,-40 L-40,-40 L-28,-62 L28,-62 L40,-40 L90,-40 C100,-40 104,-34 104,-24 L104,52 C104,62 98,66 90,66 L-90,66 C-100,66 -104,62 -104,52 L-104,-24 C-104,-34 -100,-40 -90,-40 Z", "#3a3d4c", { w: 5.5 });
  ve(ctx, elip(0, 12, 48, 48), "#23252f", { w: 5 }); ve(ctx, elip(0, 12, 30, 30), "#4a6fa5", { w: 4 }); to(ctx, elip(-10, 2, 9, 9), "#cfe3ff"); ve(ctx, rect(-92, -30, 26, 12, 4), "#e04a3f", { w: 3 });
  ctx.restore();
}
/* softbox đèn studio — gốc chân (0,0) */
export function softbox(ctx, x, y, k = 1, lat = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k * lat, k);
  net(ctx, "M0,0 L-50,0 M0,0 L50,0 M0,0 L0,-360", { w: 6 }); net(ctx, "M0,0 L-40,40 M0,0 L40,40", { w: 6 });
  ctx.save(); ctx.translate(0, -420); ctx.rotate(0.25); ve(ctx, "M-110,-90 L110,-90 L80,90 L-80,90 Z", "#ffffff", { w: 6 }); ve(ctx, "M-80,90 L80,90 L40,130 L-40,130 Z", "#4a4d5c", { w: 5 }); ctx.restore();
  ctx.restore();
}
/* cổng sắt xanh nhà trọ — góc trái dưới (x,y), cao h */
export function congSat(ctx, x, y, w, h, mo = 0) {
  ve(ctx, rect(x, y - h, w, h, 4), null, { w: 6 });
  for (let i = 0; i <= 8; i++) netPts(ctx, [[x + (i * w) / 8, y - h], [x + (i * w) / 8, y]], { w: 9, mau: "#3f8f6b", seed: 130 + i, run: 0.8 });
  for (const yy of [y - h + 20, y - h * 0.5, y - 20]) netPts(ctx, [[x, yy], [x + w, yy]], { w: 10, mau: "#3f8f6b", seed: 140 + yy, run: 0.8 });
  for (let i = 0; i <= 8; i++) to(ctx, elip(x + (i * w) / 8, y - h - 8, 8, 12), "#3f8f6b");
}
/* lịch giấy 30 ô — góc trên trái, số ô đã gạch */
export function lichO(ctx, x, y, w, h, gach = 0, o = {}) {
  ve(ctx, rect(x, y, w, h, 6), "#fffdf5", { w: 5 }); to(ctx, rect(x + 4, y + 4, w - 8, h * 0.16, 4), o.mauDau ?? "#e2533f");
  viet(ctx, o.tieuDe ?? "THÁNG 9", x + w / 2, y + h * 0.13, { size: h * 0.1, mau: "#fff", pop: false });
  const cw = (w - 20) / 6, ch = (h * 0.8 - 14) / 5;
  for (let i = 0; i < 30; i++) {
    const cx = x + 10 + (i % 6) * cw, cy = y + h * 0.2 + 4 + Math.floor(i / 6) * ch;
    net(ctx, rect(cx, cy, cw - 4, ch - 4, 2), { w: 2.5, seed: 150 + i });
    if (i < gach) { const u = clamp(gach - i); netPts(ctx, [[cx + 6, cy + 6], [lerp(cx + 6, cx + cw - 10, u), lerp(cy + 6, cy + ch - 10, u)]], { w: 5, mau: "#d63b2f", seed: 200 + i }); if (u >= 1) netPts(ctx, [[cx + cw - 10, cy + 6], [cx + 6, cy + ch - 10]], { w: 5, mau: "#d63b2f", seed: 230 + i }); }
  }
}
/* khay cơm tù — tâm (0,0) */
export function khayCom(ctx, x, y, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, rect(-150, -60, 300, 120, 18), "#c9d0d8", { w: 5.5 });
  ve(ctx, rect(-136, -46, 130, 92, 12), "#fffef8", { w: 4 }); for (let i = 0; i < 9; i++) to(ctx, elip(-110 + (i % 3) * 38, -24 + Math.floor(i / 3) * 24, 9, 6), "#ece6d6");
  ve(ctx, rect(6, -46, 130, 42, 10), "#b5643a", { w: 4 }); net(ctx, "M20,-30 L50,-14 M60,-34 L96,-16", { w: 3, mau: "#7a3d22" });
  ve(ctx, rect(6, 4, 130, 42, 10), "#7fbf5f", { w: 4 });
  ctx.restore();
}
/* song sắt (phòng giam) phủ ngang khung */
export function songSat(ctx, x0, x1, y0, y1, buoc = 120) {
  for (let x = x0; x <= x1; x += buoc) { ve(ctx, rect(x - 11, y0, 22, y1 - y0, 10), "#7c8494", { w: 5, seed: x }); netPts(ctx, [[x - 4, y0 + 10], [x - 4, y1 - 10]], { w: 3, mau: "#b4bac6", seed: x + 1 }); }
}
/* nền phòng: tường + sàn */
export function phong(ctx, mauTuong, mauSan, yS = 820) {
  ctx.fillStyle = mauTuong; ctx.fillRect(0, 0, W, H); ctx.fillStyle = mauSan; ctx.fillRect(0, yS, W, H - yS);
  netPts(ctx, [[-10, yS], [W + 10, yS]], { w: 6, seed: 300 });
}
/* bát phở / cốc trà đá / vé gửi xe (cho cảnh tiêu tiền) */
export function batPho(ctx, x, y, k = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  for (let i = 0; i < 3; i++) { const pts = []; for (let j = 0; j <= 10; j++) pts.push([-30 + i * 30 + Math.sin(j * 0.8 + t * 5 + i) * 8, -60 - j * 9]); netPts(ctx, pts, { w: 4, mau: "#b9b9b9", seed: 310 + i }); }
  ve(ctx, "M-90,-40 L90,-40 C86,20 50,50 0,50 C-50,50 -86,20 -90,-40 Z", "#ffffff", { w: 5.5 }); net(ctx, "M-80,-20 C-40,-10 40,-10 80,-20", { w: 4, mau: "#4a8fd1" });
  to(ctx, elip(0, -40, 88, 16), "#f1c27a"); net(ctx, elip(0, -40, 88, 16), { w: 4.5 }); net(ctx, "M-40,-44 C-20,-50 0,-38 20,-46 M10,-36 C30,-40 46,-34 60,-40", { w: 4, mau: "#fff3d0" }); to(ctx, elip(-30, -42, 10, 5), "#7fbf5f"); to(ctx, elip(36, -44, 9, 5), "#7fbf5f");
  ctx.restore();
}
export function traDa(ctx, x, y, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, "M-36,-70 L36,-70 L28,40 L-28,40 Z", "rgba(210,170,90,0.75)", { w: 5 }); for (const [a, b] of [[-12, -40], [10, -30], [-4, -10]]) ve(ctx, rect(a - 9, b - 9, 18, 18, 4), "rgba(255,255,255,0.8)", { w: 3 });
  ctx.restore();
}
export function veXe(ctx, x, y, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ve(ctx, rect(-50, -70, 100, 140, 6), "#fff4d6", { w: 4.5 }); viet(ctx, "GỬI XE", 0, -30, { size: 26, pop: false }); viet(ctx, "5.000đ", 0, 16, { size: 30, mau: "#d63b2f", pop: false }); net(ctx, "M-40,40 L40,40", { w: 3, dash: [6, 6] });
  ctx.restore();
}
