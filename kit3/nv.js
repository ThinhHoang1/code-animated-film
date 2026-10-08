// Nhân vật chibi vẽ tay: đầu to, má gạch hồng, tay ống tay áo + bàn tay găng, mặt đổi biểu cảm.
// Gốc (0,0) = chân cổ. Đầu tâm ở (0,-95). Chân chạm đất ở y≈222 (k=1). Tay dài tối đa ~210 (k=1).
import { MUC, ve, vePts, net, netPts, to, toPts, bong, elip, duong, rect, lerp, clamp, on, viet } from "./but.js";

export const DA = "#f8dcc4", DA_B = "#ecbf9f", MA = "#f39c9c";
const DAU = "M-112,-6 C-114,-74 -64,-104 0,-104 C64,-104 114,-74 112,-6 C110,52 70,90 0,90 C-70,90 -110,52 -112,-6 Z";

/* dàn nhân vật: màu áo/quần/tóc/giày, kiểu tóc, kiểu áo, phụ kiện */
export const KIEU = {
  hieu:   { ao: "#f2b544", aoB: "#d8952a", quan: "#3e4c6e", toc: "#2a2631", giay: "#ffffff", kToc: "hieu", kAo: "hoodie" },
  hieube: { ao: "#ffffff", aoB: "#dfe4ea", quan: "#2f4f8f", toc: "#2a2631", giay: "#e8e8e8", kToc: "hieu", kAo: "dongphuc" },
  me:     { ao: "#9b7cc4", aoB: "#7c5fa6", quan: "#4a3f5c", toc: "#3a3032", giay: "#8a5a3c", kToc: "bui", kAo: "cov" },
  thoa:   { ao: "#d9473f", aoB: "#b5352f", quan: "#3b2f3a", toc: "#2e2326", giay: "#6b3a2a", kToc: "xoan", kAo: "cov", hoaTai: true },
  tuan:   { ao: "#2f3e66", aoB: "#222e4f", quan: "#2a3352", toc: "#1f1b24", giay: "#3a2a22", kToc: "ngoi", kAo: "vest" },
  tuanxe: { ao: "#3aa564", aoB: "#2b8550", quan: "#3b4256", toc: "#1f1b24", giay: "#4a4a4a", kToc: "ngoi", kAo: "xeom" },
  dung:   { ao: "#3aa564", aoB: "#2b8550", quan: "#3b4256", toc: "#3a2a22", giay: "#4a4a4a", kToc: "baohiem", kAo: "xeom" },
  hung:   { ao: "#5d8fc9", aoB: "#4573a8", quan: "#4a4038", toc: "#3a3436", giay: "#5a4030", kToc: "hoi", kAo: "polo", ria: true },
  diut:   { ao: "#4fb3a9", aoB: "#3a938a", quan: "#3d4b5a", toc: "#2b2228", giay: "#7a5040", kToc: "duoi", kAo: "cov" },
  em:     { ao: "#ffb3c7", aoB: "#ee90a8", quan: "#ffb3c7", toc: "#2a2631", giay: "#e85a5a", kToc: "buoc", kAo: "hoa" },
  chutro: { ao: "#f59ab8", aoB: "#da7698", quan: "#f59ab8", toc: "#4a3428", giay: "#e85a5a", kToc: "lo", kAo: "cham" },
  tu:     { ao: "#e9ecef", aoB: "#c5cbd3", quan: "#e9ecef", toc: "#4a4650", giay: "#6b6b6b", kToc: "troc", kAo: "soc" },
  phuxe:  { ao: "#e9e2d0", aoB: "#cfc6b0", quan: "#5a5a6a", toc: "#2a2631", giay: "#4a4a4a", kToc: "mu", kAo: "balo", tayTran: true },
  banhang:{ ao: "#e2533f", aoB: "#c03f2e", quan: "#2f2f3a", toc: "#2b2228", giay: "#2f2f3a", kToc: "dai", kAo: "dongphucsh" },
  khach:  { ao: "#f4d8e8", aoB: "#e2b6cf", quan: "#f4d8e8", toc: "#5a3a2a", giay: "#e85a8a", kToc: "dai", kAo: "vay" },
  thamtu: { ao: "#b08a5a", aoB: "#8f6d42", quan: "#5a4632", toc: "#3a3032", giay: "#4a3426", kToc: "thamtu", kAo: "khoac" },
  nguoi:  { ao: "#8fb7d9", aoB: "#6f97ba", quan: "#4a4f5e", toc: "#3a3032", giay: "#ffffff", kToc: "ngan", kAo: "thun" },
  sep:    { ao: "#ffffff", aoB: "#dfe4ea", quan: "#2f2f3a", toc: "#2a2631", giay: "#2f2f3a", kToc: "hoi", kAo: "somi", kinh: true },
};

/* ── tóc (toạ độ theo tâm đầu) ── */
function tocSau(ctx, k, C) {
  if (k === "bui") { ve(ctx, elip(0, -112, 46, 38), C.toc, { w: 5.5 }); net(ctx, "M-24,-124 C-8,-136 12,-136 26,-124", { w: 3.5, mau: "#6a5c60" }); }
  else if (k === "duoi") { ve(ctx, "M60,-60 C130,-60 150,20 120,110 C110,60 96,10 60,-20 Z", C.toc, { w: 5 }); }
  else if (k === "buoc") { for (const s of [-1, 1]) { ve(ctx, `M${s * 100},-40 C${s * 170},-50 ${s * 180},40 ${s * 150},90 C${s * 140},40 ${s * 120},0 ${s * 96},-10 Z`, C.toc, { w: 5 }); to(ctx, elip(s * 104, -36, 12, 12), "#e2533f"); } }
  else if (k === "dai") { ve(ctx, "M-118,-20 C-130,60 -128,140 -110,190 L110,190 C128,140 130,60 118,-20 Z", C.toc, { w: 5.5 }); }
}
function tocTruoc(ctx, k, C) {
  if (k === "hieu") {
    const d = "M-120,14 C-132,-40 -110,-100 -40,-120 C-10,-132 40,-130 76,-112 C112,-94 132,-50 122,14 C114,-4 108,-18 100,-28 C96,-14 90,-4 84,4 C80,-18 72,-34 60,-44 C52,-26 40,-16 24,-10 C28,-26 26,-38 20,-50 C6,-32 -12,-22 -30,-16 C-26,-30 -26,-42 -30,-52 C-46,-36 -64,-26 -84,-20 C-90,-8 -98,2 -104,8 C-108,-2 -110,-10 -112,-16 C-116,-4 -118,6 -120,14 Z";
    ve(ctx, "M4,-122 C-6,-152 20,-174 52,-164 C34,-156 26,-142 28,-122 Z", C.toc, { w: 5 });
    ve(ctx, d, C.toc, { w: 5.5 });
    net(ctx, "M-74,-92 C-56,-106 -36,-112 -16,-112", { w: 6, mau: "#ffffff", alpha: 0.55, seed: 3 });
    net(ctx, "M30,-112 C46,-108 58,-102 66,-96", { w: 5, mau: "#ffffff", alpha: 0.45, seed: 4 });
  } else if (k === "bui") {
    ve(ctx, "M-116,20 C-130,-50 -96,-108 -10,-112 C70,-114 124,-70 118,20 C110,0 100,-18 86,-32 C60,-50 20,-56 -6,-44 C-36,-58 -70,-50 -94,-30 C-104,-16 -110,0 -116,20 Z", C.toc, { w: 5.5 });
    net(ctx, "M-60,-90 C-30,-104 10,-106 40,-96", { w: 5, mau: "#9a8a8e", seed: 6 });
  } else if (k === "xoan") {   // tóc uốn xoăn ngắn của bác Thoa
    ve(ctx, "M-124,24 C-150,0 -140,-40 -124,-56 C-140,-90 -100,-120 -70,-112 C-56,-140 -16,-146 6,-128 C30,-148 70,-140 80,-112 C112,-120 140,-90 126,-56 C146,-36 146,4 124,24 C112,0 104,-14 92,-24 C70,-50 30,-58 0,-50 C-30,-58 -70,-50 -92,-24 C-104,-14 -112,0 -124,24 Z", C.toc, { w: 5.5 });
    for (const [x, y] of [[-90, -80], [-46, -106], [0, -110], [46, -104], [90, -78], [-110, -30], [110, -30]]) net(ctx, `M${x - 10},${y} C${x - 10},${y - 12} ${x + 10},${y - 12} ${x + 10},${y}`, { w: 3, mau: "#6a5458" });
  } else if (k === "ngoi") {   // rẽ ngôi gọn gàng của anh Tuấn
    ve(ctx, "M-118,10 C-130,-60 -86,-116 -10,-118 C70,-120 126,-70 118,10 C112,-14 106,-30 96,-40 C60,-56 20,-58 -20,-60 C-50,-60 -80,-52 -100,-36 C-108,-20 -114,-4 -118,10 Z", C.toc, { w: 5.5 });
    net(ctx, "M-30,-112 C-38,-90 -44,-74 -48,-60", { w: 4, mau: "#4a4452" });
    net(ctx, "M10,-110 C40,-104 70,-92 90,-76", { w: 5, mau: "#ffffff", alpha: 0.4 });
  } else if (k === "hoi") {   // hói đỉnh, tóc hai bên
    for (const s of [-1, 1]) ve(ctx, `M${s * 118},20 C${s * 128},-20 ${s * 120},-50 ${s * 96},-66 C${s * 90},-40 ${s * 96},-10 ${s * 108},20 Z`, C.toc, { w: 5 });
    net(ctx, "M-30,-100 C-20,-106 -6,-108 6,-106 M-12,-112 C0,-120 14,-118 22,-112", { w: 3, mau: C.toc });
    net(ctx, "M-60,-80 C-40,-96 -20,-100 0,-100", { w: 6, mau: "#ffffff", alpha: 0.6 });
  } else if (k === "duoi") {
    ve(ctx, "M-116,16 C-128,-56 -84,-112 0,-112 C84,-112 128,-56 116,16 C110,-6 98,-24 80,-36 C40,-30 0,-44 -20,-60 C-40,-40 -80,-30 -100,-20 C-108,-6 -112,4 -116,16 Z", C.toc, { w: 5.5 });
    to(ctx, elip(70, -70, 12, 12), "#f4c430");
  } else if (k === "buoc") {
    ve(ctx, "M-112,4 C-120,-60 -76,-110 0,-110 C76,-110 120,-60 112,4 C100,-24 70,-40 30,-40 L0,-60 L-30,-40 C-70,-40 -100,-24 -112,4 Z", C.toc, { w: 5.5 });
  } else if (k === "dai") {
    ve(ctx, "M-118,30 C-132,-50 -90,-114 0,-114 C90,-114 132,-50 118,30 C108,0 96,-24 70,-40 C30,-56 -10,-50 -40,-40 C-70,-30 -100,-6 -118,30 Z", C.toc, { w: 5.5 });
    net(ctx, "M-60,-94 C-30,-108 10,-110 40,-102", { w: 5, mau: "#ffffff", alpha: 0.45 });
  } else if (k === "lo") {
    ve(ctx, "M-116,16 C-126,-56 -84,-108 0,-110 C84,-108 126,-56 116,16 C106,-10 92,-30 70,-40 C40,-50 -40,-50 -70,-40 C-92,-30 -106,-10 -116,16 Z", C.toc, { w: 5.5 });
    for (const [x, y, a] of [[-70, -86, -0.6], [-20, -108, -0.1], [34, -104, 0.3], [80, -76, 0.8]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ve(ctx, rect(-26, -15, 52, 30, 12), "#7ecbe8", { w: 4.5 }); net(ctx, "M-10,-14 L-10,14 M8,-14 L8,14", { w: 3 }); ctx.restore(); }
  } else if (k === "troc") {
    ve(ctx, "M-112,0 C-114,-70 -64,-106 0,-106 C64,-106 114,-70 112,0 C100,-30 70,-56 0,-58 C-70,-56 -100,-30 -112,0 Z", C.toc, { w: 5 });
    for (let i = 0; i < 18; i++) to(ctx, elip(-80 + (i % 6) * 32 + (i % 2) * 8, -88 + Math.floor(i / 6) * 14, 2.4, 2.4), "#6c6874");
  } else if (k === "ngan") {
    ve(ctx, "M-116,6 C-124,-62 -76,-112 0,-112 C76,-112 124,-62 116,6 C104,-20 84,-36 50,-44 C20,-36 -20,-36 -50,-44 C-84,-36 -104,-20 -116,6 Z", C.toc, { w: 5.5 });
  } else if (k === "mu") {   // mũ lưỡi trai
    ve(ctx, "M-112,-20 C-112,-90 -60,-118 0,-118 C60,-118 112,-90 112,-20 Z", C.mu ?? "#e2533f", { w: 5.5 }); ve(ctx, "M-20,-24 C30,-36 120,-34 160,-14 C120,-6 40,-8 -20,-12 Z", C.mu ?? "#e2533f", { w: 5 });
  } else if (k === "baohiem") {   // mũ bảo hiểm nửa đầu
    ve(ctx, "M-124,-6 C-124,-96 -66,-130 0,-130 C66,-130 124,-96 124,-6 L-124,-6 Z", "#3aa564", { w: 6 }); net(ctx, "M-80,-110 C-40,-124 40,-124 80,-110", { w: 4, mau: "#fff", alpha: 0.6 });
    net(ctx, "M-110,0 C-100,60 -60,92 -20,92 M110,0 C100,60 60,92 20,92", { w: 3.5 });
  } else if (k === "thamtu") {   // mũ thám tử
    ve(ctx, "M-120,-20 C-120,-100 -60,-128 0,-128 C60,-128 120,-100 120,-20 Z", "#b08a5a", { w: 5.5 }); ve(ctx, "M-140,-20 L140,-20 L120,0 L-120,0 Z", "#8f6d42", { w: 5 });
    for (let i = -2; i <= 2; i++) netPts(ctx, [[i * 40, -120], [i * 44, -24]], { w: 2.5, mau: "#8f6d42", seed: 70 + i });
  }
}
/* ── mặt ── */
const MAT = {   // biểu cảm → [mắt, lông mày, miệng]
  thuong: ["tron", "thuong", "cuoi_nho"], cuoi: ["cuoi", "thuong", "cuoi_to"], nham: ["nham", "thuong", "nhech"], ngac: ["trang", "nhuong", "o"],
  soc: ["doc", "nhuong", "meo"], buon: ["tron", "nhuong", "buon"], tuc: ["tron", "chau", "nghien"], chan: ["dut", "thuong", "phang"], khoc: ["nham_mat", "nhuong", "khoc"],
  nheo: ["nheo", "mot", "nghi"], sang: ["nham_mat", "thuong", "nhech"], hoang: ["trang", "nhuong", "meo"], nhai: ["nham_mat", "thuong", "nhai"], bat: ["tron", "thuong", "cuoi_to"],
  tien: ["tien", "thuong", "cuoi_to"], ngu: ["nham_mat", "thuong", "o"], tuhao: ["cuoi", "thuong", "cuoi_to"], im: ["tron", "thuong", "phang"], cui: ["nham_mat", "nhuong", "buon"],
  bong: ["trang", "nhuong", "phang"], ghet: ["nham", "chau", "nghi"], thuong2: ["tron", "nhuong", "cuoi_nho"], deu: ["nham", "mot", "nhech"],
};
function mat(ctx, S, C) {
  const [nx, ny] = S.nhin ?? [0, 0], ex = nx * 18, ey = ny * 10, [mt, may, mk0] = MAT[S.mat ?? "thuong"] ?? MAT.thuong;
  const say = S.say ?? 0;
  for (const sx of [-1, 1]) {   // má hồng gạch chéo
    ctx.save(); ctx.globalAlpha = 0.85; to(ctx, elip(sx * 70 + ex * 0.5, 36 + ey * 0.5, 21 + say * 10, 11 + say * 6), say > 0.3 ? "#ef7d7d" : MA); ctx.restore();
    for (let i = 0; i < 3; i++) netPts(ctx, [[sx * 70 + ex * 0.5 - 12 + i * 10, 42 + ey * 0.5], [sx * 70 + ex * 0.5 - 4 + i * 10, 30 + ey * 0.5]], { w: 2.6, mau: "#d9676f", seed: 20 + i + sx });
  }
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(sx * 42 + ex, 8 + ey);
    if (mt === "tron") { to(ctx, elip(0, 0, 13, 19), MUC); to(ctx, elip(-4, -7, 4.5, 5.5), "#fff"); }
    else if (mt === "cuoi" || mt === "nham_mat") net(ctx, mt === "cuoi" ? "M-15,6 C-9,-8 9,-8 15,6" : "M-15,0 C-9,9 9,9 15,0", { w: 6, seed: 30 + sx });
    else if (mt === "nham") { to(ctx, "M-15,0 C-15,20 15,20 15,0 Z", MUC); netPts(ctx, [[-20, 1], [20, -1]], { w: 6.5, seed: 31 + sx }); }
    else if (mt === "trang") { ve(ctx, elip(0, 0, 22, 25), "#fff", { w: 4.5 }); to(ctx, elip(nx * 6, 3, 4.5, 4.5), MUC); }
    else if (mt === "doc") { ve(ctx, elip(0, 0, 24, 22), "#fff", { w: 4.5 }); netPts(ctx, [[0, -12], [0, 12]], { w: 5, seed: 33 + sx }); }
    else if (mt === "dut") netPts(ctx, [[-16, 4], [16, 4]], { w: 6, seed: 34 + sx });
    else if (mt === "nheo") { to(ctx, "M-13,-1 C-13,13 13,13 13,-1 Z", MUC); to(ctx, elip(-4, 3, 3, 3), "#fff"); netPts(ctx, [[-20, -4 - sx * 3], [20, -4 + sx * 3]], { w: 7, seed: 35 + sx }); netPts(ctx, [[-12, 16], [12, 15]], { w: 3, seed: 36 + sx }); }
    else if (mt === "tien") viet(ctx, "đ", 0, 18, { size: 54, mau: "#2f9e57", pop: false, dam: 0.08 });
    ctx.restore();
    ctx.save(); ctx.translate(sx * 42 + ex * 0.8, -30 + ey * 0.8); ctx.scale(sx, 1);   // lông mày
    if (may === "thuong") net(ctx, "M-14,2 C-6,-4 6,-4 14,0", { w: 5, seed: 36 + sx });
    else if (may === "nhuong") net(ctx, "M-14,-10 C-6,-6 4,0 14,6", { w: 5, seed: 37 + sx });   // lo: đầu trong nhướng lên
    else if (may === "chau") net(ctx, "M-14,8 C-4,4 6,-4 14,-10", { w: 6, seed: 38 + sx });    // cau: đầu trong cụp xuống
    else if (may === "mot") net(ctx, sx > 0 ? "M-16,-6 C-6,-20 8,-22 16,-14" : "M-16,-6 C-6,-2 6,2 16,8", { w: 6, seed: 39 + sx });
    ctx.restore();
  }
  if (C.ria) ve(ctx, "M-34,34 C-20,24 -6,26 0,32 C6,26 20,24 34,34 C24,40 8,40 0,36 C-8,40 -24,40 -34,34 Z", C.toc, { w: 3.5 });
  ctx.save(); ctx.translate(ex * 0.7, 46 + ey * 0.7);   // miệng
  const noi = S.noi ?? 0, mk = mk0;
  if (noi > 0.12 && !["cuoi_to", "nghien", "khoc"].includes(mk)) {   // đang nói: hình miệng theo tâm trạng
    const h = 6 + noi * 22;
    if (["buon", "meo"].includes(mk)) ve(ctx, `M-16,6 C-10,${-2 - h * 0.3} 10,${-2 - h * 0.3} 16,6 C10,${6 + h * 0.7} -10,${6 + h * 0.7} -16,6 Z`, "#8b3a3a", { w: 4.5 });
    else if (["phang", "nghi"].includes(mk)) ve(ctx, elip(0, 2, 11, 3 + h * 0.4), "#8b3a3a", { w: 4.5 });
    else ve(ctx, `M-17,-2 C-14,${h} 14,${h} 17,-2 C8,2 -8,2 -17,-2 Z`, "#8b3a3a", { w: 4.5 });
  }
  else if (mk === "cuoi_nho") net(ctx, "M-16,-4 C-8,6 8,6 16,-4", { w: 5 });
  else if (mk === "cuoi_to") { const h = 22 + noi * 10; ve(ctx, `M-26,-6 C-22,${h} 22,${h} 26,-6 C10,-2 -10,-2 -26,-6 Z`, "#8b3a3a", { w: 5 }); ctx.save(); ctx.clip(new Path2D(`M-26,-6 C-22,${h} 22,${h} 26,-6 Z`)); to(ctx, elip(0, h - 4, 14, 9), "#f08b8b"); ctx.restore(); }
  else if (mk === "o") ve(ctx, elip(0, 2, 9, 12), "#8b3a3a", { w: 4.5 });
  else if (mk === "phang") netPts(ctx, [[-14, 0], [14, 0]], { w: 5 });
  else if (mk === "nghi") net(ctx, "M-16,4 C-6,-2 6,-2 16,-6", { w: 5 });
  else if (mk === "meo") net(ctx, "M-24,2 C-16,-8 -8,10 0,2 C8,-8 16,10 24,2", { w: 4.5 });
  else if (mk === "buon") net(ctx, "M-16,6 C-8,-4 8,-4 16,6", { w: 5 });
  else if (mk === "nhech") net(ctx, "M-16,0 C-2,6 10,4 20,-8", { w: 5 });
  else if (mk === "nghien") { ve(ctx, rect(-24, -8, 48, 20, 6), "#fff", { w: 4.5 }); netPts(ctx, [[-22, 2], [22, 2]], { w: 2.5 }); for (const x of [-10, 2, 14]) netPts(ctx, [[x, -6], [x, 10]], { w: 2.5 }); }
  else if (mk === "khoc") ve(ctx, "M-22,8 C-16,-10 16,-10 22,8 C8,4 -8,4 -22,8 Z", "#8b3a3a", { w: 4.5 });
  else if (mk === "nhai") { const p = Math.sin((S.t ?? 0) * 14); net(ctx, `M-14,0 C-6,${4 + p * 4} 6,${4 - p * 4} 14,0`, { w: 5 }); }
  ctx.restore();
  if (S.mat === "khoc") for (const sx of [-1, 1]) ve(ctx, `M${sx * 42 - 8},18 C${sx * 42 - 10},50 ${sx * 42 - 6},80 ${sx * 42},96 C${sx * 42 + 6},80 ${sx * 42 + 10},50 ${sx * 42 + 8},18 Z`, "#9fd6f5", { w: 3.5 });
}
/* ── tay: ống tay áo cong + bàn tay găng; tay dài quá MAX thì kéo bàn tay về ── */
const TAY_MAX = 210;
function tay(ctx, vai, ban, cong, C, o = {}) {
  let [x1, y1] = vai, [x2, y2] = ban; { const l0 = Math.hypot(x2 - x1, y2 - y1); if (l0 > TAY_MAX && !o.dai) { x2 = x1 + (x2 - x1) * TAY_MAX / l0; y2 = y1 + (y2 - y1) * TAY_MAX / l0; } }
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / l) * cong, cy = my + (dx / l) * cong;
  const L = [], R = [], n = 14;
  for (let i = 0; i <= n; i++) {
    const u = i / n, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
    const px = a * x1 + b * cx + c * x2, py = a * y1 + b * cy + c * y2;
    const tx = 2 * (1 - u) * (cx - x1) + 2 * u * (x2 - cx), ty = 2 * (1 - u) * (cy - y1) + 2 * u * (y2 - cy), tl = Math.hypot(tx, ty) || 1;
    const w = lerp(o.wVai ?? 24, o.wCo ?? 17, u);
    L.push([px - (ty / tl) * w, py + (tx / tl) * w]); R.push([px + (ty / tl) * w, py - (tx / tl) * w]);
  }
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const vaiPts = []; for (let i = 0; i <= 10; i++) { const a = Math.atan2(cy - y1, cx - x1) + Math.PI / 2 + (i / 10) * Math.PI; vaiPts.push([x1 + Math.cos(a) * (o.wVai ?? 24), y1 + Math.sin(a) * (o.wVai ?? 24)]); }
  const Rr = [...R].reverse(), ong = [...L, ...Rr, ...vaiPts];
  toPts(ctx, ong, o.mauAo ?? (C.tayTran ? DA : C.ao));
  if (o.sau) netPts(ctx, ong, { w: 5, kin: true, seed: o.seed ?? 50 });
  else { netPts(ctx, L, { w: 5, seed: o.seed ?? 50 }); netPts(ctx, R, { w: 5, seed: (o.seed ?? 50) + 1 }); }
  if (!C.tayTran) netPts(ctx, [L[n], R[n]], { w: 4.5, seed: (o.seed ?? 50) + 2 });
  ctx.save(); ctx.translate(x2, y2); ctx.rotate(ang);
  if (o.cam) { ctx.save(); o.cam(ctx); ctx.restore(); }
  banTay(ctx, o.kieu ?? "nam", o.lat ?? 1, o.seed ?? 50);
  if (o.camTren) { ctx.save(); o.camTren(ctx); ctx.restore(); }
  ctx.restore();
  return [x2, y2, ang];
}
export function banTay(ctx, kieu = "nam", lat = 1, seed = 50) {
  ctx.save(); ctx.scale(1, lat);
  if (kieu === "chi") {
    ve(ctx, "M10,-6 C24,-12 52,-12 60,-6 C66,0 60,6 52,6 C40,7 26,8 14,8 Z", DA, { w: 4.5, seed: seed + 1 });
    ve(ctx, elip(14, 6, 18, 15), DA, { w: 4.5, seed: seed + 2 });
    net(ctx, "M10,0 C14,4 18,6 24,6", { w: 3 });
  } else if (kieu === "xoe") {
    for (let i = 0; i < 4; i++) { const a = -0.55 + i * 0.36; ctx.save(); ctx.rotate(a); ve(ctx, rect(18, -7, 30, 14, 7), DA, { w: 4, seed: seed + i }); ctx.restore(); }
    ve(ctx, elip(14, 0, 19, 18), DA, { w: 4.5, seed: seed + 5 });
    ctx.save(); ctx.rotate(-1.4); ve(ctx, rect(12, -7, 22, 13, 6), DA, { w: 4, seed: seed + 6 }); ctx.restore();
  } else if (kieu === "like") {   // giơ ngón cái
    ve(ctx, elip(16, 0, 20, 18), DA, { w: 4.5, seed: seed + 3 });
    ctx.save(); ctx.rotate(-1.57); ve(ctx, rect(10, -8, 34, 16, 8), DA, { w: 4.5, seed: seed + 4 }); ctx.restore();
  } else {
    ve(ctx, elip(16, 0, 21, 18), DA, { w: 4.5, seed: seed + 3 });
    ve(ctx, elip(14, -16, 9, 7), DA, { w: 4, seed: seed + 4 });
    net(ctx, "M26,-6 C30,-2 30,4 26,8", { w: 3 });
  }
  ctx.restore();
}
/* ── áo theo kiểu ── */
const THAN = "M-58,4 C-76,12 -86,44 -86,84 C-86,114 -84,140 -80,160 L80,160 C84,140 86,114 86,84 C86,44 76,12 58,4 C30,-6 -30,-6 -58,4 Z";
const VAY = "M-58,4 C-76,12 -86,44 -86,84 C-90,120 -110,170 -120,200 L120,200 C110,170 90,120 86,84 C86,44 76,12 58,4 C30,-6 -30,-6 -58,4 Z";
function ao(ctx, C, S) {
  const vay = C.kAo === "vay", T = vay ? VAY : THAN;
  to(ctx, T, C.ao); bong(ctx, T, "M34,0 C70,18 92,80 92,210 L56,210 C62,104 58,40 34,0 Z", C.aoB);
  if (C.kAo === "soc") bong(ctx, T, "M-100,40 L100,40 L100,56 L-100,56 Z M-100,84 L100,84 L100,100 L-100,100 Z M-100,128 L100,128 L100,144 L-100,144 Z", "#7d8fb3");
  if (C.kAo === "cham") for (const [x, y] of [[-50, 50], [10, 40], [50, 90], [-30, 110], [30, 140], [-60, 140], [60, 30]]) bong(ctx, T, elip(x, y, 9, 9), "#fff2a8");
  if (C.kAo === "hoa") for (const [x, y] of [[-40, 60], [30, 50], [0, 110], [-50, 130], [50, 130]]) { bong(ctx, T, elip(x, y, 10, 10), "#ffffff"); bong(ctx, T, elip(x, y, 4, 4), "#f4c430"); }
  if (C.kAo === "xeom") bong(ctx, T, "M-100,96 L100,96 L100,112 L-100,112 Z", "#e8f0a0");
  net(ctx, T, { w: 5.5, seed: 9 });
  const k = C.kAo;
  if (k === "hoodie") { ve(ctx, "M-50,6 C-38,30 38,30 50,6 C36,-8 -36,-8 -50,6 Z", C.aoB, { w: 4.5 }); net(ctx, "M-14,22 C-16,40 -15,54 -16,66 M14,22 C16,40 15,52 16,62", { w: 3.5 }); net(ctx, "M-50,108 L50,108 L58,152 M-50,108 L-58,152", { w: 4 }); }
  else if (k === "cov" || k === "cham" || k === "hoa") { net(ctx, "M-26,4 L0,34 L26,4", { w: 4 }); }
  else if (k === "vest") {
    ve(ctx, "M-26,2 L0,40 L26,2 Z", "#ffffff", { w: 3.5 }); ve(ctx, "M-8,14 L8,14 L12,90 L0,104 L-12,90 Z", "#c0392b", { w: 3.5 });
    net(ctx, "M-30,2 L-6,60 L-40,40 M30,2 L6,60 L40,40", { w: 4 }); net(ctx, "M0,104 L0,160", { w: 3 }); to(ctx, elip(-6, 120, 4, 4), MUC); to(ctx, elip(-6, 142, 4, 4), MUC);
  } else if (k === "xeom") { net(ctx, "M-34,4 C-20,18 20,18 34,4", { w: 4 }); netPts(ctx, [[0, 16], [0, 160]], { w: 3.5 }); }
  else if (k === "polo") { ve(ctx, "M-30,0 L-4,20 L-24,34 Z", C.aoB, { w: 3.5 }); ve(ctx, "M30,0 L4,20 L24,34 Z", C.aoB, { w: 3.5 }); for (const y of [30, 50]) to(ctx, elip(0, y, 4, 4), "#ffffff"); }
  else if (k === "dongphuc") { ve(ctx, "M-30,0 L-4,22 L-26,34 Z", "#ffffff", { w: 3.5 }); ve(ctx, "M30,0 L4,22 L26,34 Z", "#ffffff", { w: 3.5 }); ve(ctx, "M-30,4 L30,4 L8,30 L16,80 L0,70 L-16,80 L-8,30 Z", "#e2453c", { w: 4 }); }
  else if (k === "dongphucsh") { net(ctx, "M-26,4 L0,30 L26,4", { w: 4 }); ve(ctx, rect(24, 50, 44, 20, 4), "#ffffff", { w: 3 }); }
  else if (k === "somi") { net(ctx, "M-26,2 L0,28 L26,2", { w: 4 }); ve(ctx, "M-6,14 L6,14 L10,90 L0,100 L-10,90 Z", "#3a6fb5", { w: 3.5 }); }
  else if (k === "khoac") { net(ctx, "M-36,4 L-6,70 M36,4 L6,70", { w: 4 }); net(ctx, "M-40,120 L-10,120 M40,120 L10,120", { w: 3.5 }); }
  else if (k === "balo") { net(ctx, "M-46,6 C-40,40 -40,100 -46,150 M46,6 C40,40 40,100 46,150", { w: 7, mau: "#5a5a6a" }); }
  else net(ctx, "M-30,4 C-16,22 16,22 30,4", { w: 4 });
  if (vay) return true;
}

/*
 S: { t, kieu, C:{ghi đè màu}, mat, noi, nhin:[x,y], ngh (nghiêng đầu), nhun (nhún y), co (bẹp/dãn), say (đỏ mặt rượu), taiDo (0..1 tai đỏ),
      tayT:{p:[x,y], cong, kieu:"nam|chi|xoe|like", cam(ctx) vẽ đồ cầm dưới bàn tay, camTren(ctx) đè lên tay, lat, sau, dai},
      tayP:{…}, chan:false (giấu chân), than:false (chỉ đầu), chiTay (lượt 2 chỉ vẽ tay), anTay (giấu tay trước), kinh }
 trả về vị trí hai bàn tay (toạ độ thế giới) qua S.ra = {T:[x,y], P:[x,y]} nếu truyền S.ra = {}
*/
export function veNV(ctx, x, y, k, S = {}) {
  const C = { ...(KIEU[S.kieu ?? "hieu"] ?? KIEU.nguoi), ...(S.C ?? {}) }; const t = S.t ?? 0;
  ctx.save(); ctx.translate(x, y + (S.nhun ?? 0)); if (S.xoay) ctx.rotate(S.xoay); ctx.scale(k, k * (S.co ?? 1));
  const vT = [-64, 26], vP = [64, 26];
  const tT = S.tayT ?? { p: [-90, 128], cong: -14 }, tP = S.tayP ?? { p: [90, 128], cong: 14 };
  const ghi = (ten, r) => { if (S.ra && r) { const m = ctx.getTransform(); S.ra[ten] = [m.a * r[0] + m.c * r[1] + m.e, m.b * r[0] + m.d * r[1] + m.f]; } };
  if (S.chiTay) {
    if (!tT.sau) ghi("T", tay(ctx, vT, tT.p, tT.cong ?? 0, C, { ...tT, seed: 51 }));
    if (!tP.sau) ghi("P", tay(ctx, vP, tP.p, tP.cong ?? 0, C, { ...tP, seed: 52 }));
    ctx.restore(); return S.ra;
  }
  if (S.than !== false) {
    if (tT.sau) ghi("T", tay(ctx, vT, tT.p, tT.cong ?? 0, C, { ...tT, seed: 51 }));
    if (tP.sau) ghi("P", tay(ctx, vP, tP.p, tP.cong ?? 0, C, { ...tP, seed: 52 }));
    if (S.chan !== false) {
      if (C.kAo !== "vay") ve(ctx, "M-78,150 L78,150 L74,196 L10,196 L6,182 L-6,182 L-10,196 L-74,196 Z", C.quan, { w: 5 });
      else for (const s of [-1, 1]) ve(ctx, rect(s * 40 - 10, 196, 20, 16, 4), DA, { w: 4 });
      ve(ctx, elip(-42, 204, 36, 17), C.giay, { w: 5 }); ve(ctx, elip(42, 204, 36, 17), C.giay, { w: 5 });
    }
    if (C.kToc === "dai") { ctx.save(); ctx.translate(0, -95); ctx.rotate(S.ngh ?? 0); tocSau(ctx, "dai", C); ctx.restore(); }   // tóc dài xoã sau lưng
    ao(ctx, C, S);
    if (!tT.sau && !S.anTay) ghi("T", tay(ctx, vT, tT.p, tT.cong ?? 0, C, { ...tT, seed: 51 }));
  }
  ctx.save(); ctx.translate(0, -95); ctx.rotate(S.ngh ?? 0);
  if (C.kToc !== "dai" || S.than === false) tocSau(ctx, C.kToc, C);
  const taiMau = S.taiDo ? `rgb(${Math.round(lerp(248, 235, S.taiDo))},${Math.round(lerp(220, 70, S.taiDo))},${Math.round(lerp(196, 60, S.taiDo))})` : DA;
  for (const sx of [-1, 1]) ve(ctx, elip(sx * 110, 12, 17, 22), taiMau, { w: 5, seed: 12 + sx });
  if (C.hoaTai) for (const sx of [-1, 1]) ve(ctx, elip(sx * 112, 40, 7, 7), "#f4c430", { w: 3 });
  ve(ctx, DAU, DA, { w: 6, seed: 13 });
  bong(ctx, DAU, "M-120,-20 C-100,30 -60,70 0,78 C60,70 100,30 120,-20 L130,100 L-130,100 Z", "rgba(236,191,159,0.55)");
  mat(ctx, S, C);
  tocTruoc(ctx, C.kToc, C);
  if (S.kinh ?? C.kinh) { for (const sx of [-1, 1]) ve(ctx, elip(sx * 42, 8, 30, 26), "rgba(255,255,255,0.25)", { w: 4.5 }); net(ctx, "M-12,6 C-4,0 4,0 12,6", { w: 4 }); }
  if (S.mat === "ngu") for (let i = 0; i < 3; i++) viet(ctx, "z", 110 + i * 34, -110 - i * 40, { size: 40 + i * 12, pop: false });
  ctx.restore();
  if (S.than !== false && !tP.sau && !S.anTay) ghi("P", tay(ctx, vP, tP.p, tP.cong ?? 0, C, { ...tP, seed: 52 }));
  ctx.restore();
  return S.ra;
}
