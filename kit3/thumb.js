// Thumbnail vẽ tay (không chửi thề): t<10 → mẫu 1, t≥10 → mẫu 2
import { W, H, giay, viet, ve, net, netPts, to, elip, rect, moHoi, sao, tiaNhan, rung } from "./but.js";
import { veNV } from "./nv.js";
import * as D from "./do.js";
import { manHinhGoi, tayCanh, anhSushi, khoanh } from "./chung.js";
export function thu(ctx, t) {
  if (t < 10) {
    giay(ctx, "#ffd84a");
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; ctx.save(); ctx.globalAlpha = 0.18; ve(ctx, `M1250,560 L${1250 + Math.cos(a) * 1600},${560 + Math.sin(a) * 1600} L${1250 + Math.cos(a + 0.2) * 1600},${560 + Math.sin(a + 0.2) * 1600} Z`, "#ffffff", { w: 0 }); ctx.restore(); }
    manHinhGoi(ctx, 1420, 560, 3.3, 0, { kieu: "video", ai: "me", mat: "nheo", ngh: 0.1, xoay: 0.06, kNV: 0.56, dx: -6 });
    tayCanh(ctx, 830, 850, 1.05, 0, 0, true);
    { const k = 1.05, a = -0.12, rx = 830 + (-66 * Math.cos(a) - 62 * Math.sin(a)) * k, ry = 850 + (-66 * Math.sin(a) + 62 * Math.cos(a)) * k; khoanh(ctx, rx, ry, 70, 64, 1, "#e0392f", 12); tiaNhan(ctx, rx, ry, 90, 140, 5, { a0: Math.PI / 2 + 0.3, goc: 0.4, mau: "#e0392f", w: 8 }); }
    veNV(ctx, 190, 1000, 0.85, { t: 0, mat: "soc", nhin: [0.7, -0.4], chan: false }); moHoi(ctx, 300, 760, 1.2); moHoi(ctx, 90, 790, 1.0, -0.4);
    viet(ctx, "TAY AI", 560, 230, { size: 210, mau: "#e0392f", pop: false, nen: "#ffffff", xoay: -0.05 });
    viet(ctx, "ĐÂY?", 600, 430, { size: 230, mau: "#e0392f", pop: false, nen: "#ffffff", xoay: -0.03 });
  } else {
    giay(ctx, "#1f2440");
    for (let i = 0; i < 14; i++) sao(ctx, 100 + i * 130, 120 + (i % 3) * 300, 16, i, "#ffd76a");
    anhSushi(ctx, 1380, 520, 2.0, 0.05, { tay: true });
    veNV(ctx, 480, 640, 1.35, { t: 0, mat: "tien", tayP: { p: [150, -60], cong: 30, kieu: "xoe", lat: -1 } });
    D.tien(ctx, 700, 470, 1.1, 10, -0.3);
    viet(ctx, "OMAKASE", 1380, 160, { size: 150, mau: "#ffd76a", pop: false, nen: "#1f2440" });
    viet(ctx, "10 NGHÌN?", 1380, 1010, { size: 150, mau: "#ffffff", pop: false, nen: "#e0392f" });
  }
}
