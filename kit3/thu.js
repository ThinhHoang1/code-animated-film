import { giay, viet } from "./but.js";
import { veNV } from "./nv.js";
export function thu(ctx, t) {
  giay(ctx);
  const ds = [["hieu", "cuoi"], ["hieube", "tien"], ["me", "nheo"], ["thoa", "tuhao"], ["tuan", "thuong"], ["tuanxe", "buon"], ["dung", "cuoi"], ["hung", "cuoi"], ["diut", "khoc"], ["em", "nhai"], ["phuxe", "chan"], ["banhang", "cuoi"], ["khach", "nham"], ["thamtu", "nheo"], ["nguoi", "soc"], ["sep", "tuc"]];
  ds.forEach(([k, m], i) => { const x = 130 + (i % 8) * 236, y = 300 + Math.floor(i / 8) * 520; veNV(ctx, x, y, 0.5, { t, kieu: k, mat: m, say: k === "hung" ? 1 : 0, taiDo: k === "hieube" ? 1 : 0, tayP: k === "dung" ? { p: [110, -60], cong: 20, kieu: "like" } : undefined }); viet(ctx, k, x, y + 160, { size: 34, pop: false }); });
}
