// "Bàn tay mười nghìn" — cả phim, vẽ tay có màu. Mỗi câu một cảnh diễn đúng lời; mốc theo từng chữ (moc.json).
// Cảnh nằm ở nhiều file kit3/c-*.js (mỗi file export CANH = {số câu: hàm}); file nào lỗi thì chỉ cảnh của file đó hiện khung chờ.
import { W, H, clamp, datKhung, giay, viet } from "./kit3/but.js";
import { theChuong } from "./kit3/chung.js";
const TEP = ["./kit3/canh.js", "./kit3/c-a.js", "./kit3/c-b.js", "./kit3/c-c.js", "./kit3/c-e.js", "./kit3/c-d.js"];
export async function dungPhim(cv) {
  const ctx = cv.getContext("2d");
  const [lich, moc] = await Promise.all([fetch("lich.json").then((r) => r.json()), fetch("moc.json").then((r) => r.json())]);
  await Promise.all(['400 80px "Patrick Hand"', '400 80px "Pangolin"'].map((f) => document.fonts.load(f, "Ạ ĐÉO GÌ CẢ ằ ữ ộ đ")));
  const CANH = {}, LOI = [];
  for (const tep of TEP) {
    try { const mod = await import(tep); Object.assign(CANH, mod.CANH ?? {}); }
    catch (e) { LOI.push(`${tep}: ${e.message}`); console.error("[phim] không nạp được", tep, e); }
  }
  window.__phimLoi = LOI;
  const D = lich.doan;
  const doanTai = (t) => { let i = 0; while (i + 1 < D.length && t >= D[i + 1].bd) i++; return i; };
  function cho(ctx, d, loi) { giay(ctx); viet(ctx, `[cảnh ${d.id} chưa vẽ]`, W / 2, H / 2, { size: 70, pop: false }); if (loi) viet(ctx, String(loi).slice(0, 80), W / 2, H / 2 + 90, { size: 34, mau: "#e0392f", pop: false }); }
  function renderAt(t) {
    t = clamp(t, 0, lich.tong - 1 / 60); datKhung(t);
    const i = doanTai(t), d = D[i], tl = t - d.bd, uf = clamp(tl / Math.max(0.01, d.het - d.bd));
    const noi = d.env && t <= d.kt ? (d.env[Math.min(d.env.length - 1, Math.floor(tl * lich.fps))] ?? 0) : 0;
    const c = { noi: clamp(noi * 1.4), dur: d.het - d.bd, noiDen: d.kt - d.bd, tl, moc: moc[d.f] ?? [], d };
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.filter = "none";
    ctx.save();
    try {
      if (typeof d.id === "string" && d.id.startsWith("ch")) theChuong(ctx, t, tl, d.ch, d.ten);
      else { const f = CANH[d.id]; if (f) f(ctx, t, uf, c); else cho(ctx, d, LOI.join(" | ")); }
    } catch (e) { ctx.restore(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); cho(ctx, d, e.message); console.error("[phim] cảnh", d.id, e); }
    finally { ctx.restore(); }
  }
  return { renderAt };
}
