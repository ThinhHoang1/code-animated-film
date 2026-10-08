#!/usr/bin/env python3
"""Dựng "Bàn tay mười nghìn" (cả phim): chon*.json → cắt lặng, xếp mốc (tựa + thẻ chương), đường bao miệng → lich.json,
nhạc nền theo chương, index.html.  Chạy: python3 dung.py
"""
import json, os, subprocess, wave
import numpy as np

D = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(f"{D}/lines.json", encoding="utf-8"))
chon = json.load(open(f"{D}/chon-9-cu.json", encoding="utf-8"))
for f in range(1, 9):   # câu 1–8 lấy từ buổi thu trước, nếu còn file
    if os.path.exists(f"{D}/giong-cu/{f:03d}-t1.wav"): chon[str(f)] = {"path": f"giong-cu/{f:03d}-t1.wav"}
if os.path.exists(f"{D}/chon-toi.json"): chon.update(json.load(open(f"{D}/chon-toi.json", encoding="utf-8")))   # giọng kể châm biếm thu lại
TEMPO = {"toi": float(os.environ.get("TEMPO_TOI", "1.06"))}
BGM = os.environ.get("BGM_DIR", f"{D}/assets/bgm-src")   # nhạc CC BY tải về (xem README)
os.makedirs(f"{D}/assets/voice", exist_ok=True); os.makedirs(f"{D}/assets/bgm", exist_ok=True)
FPS = 30

def doc(path):
    with wave.open(path) as w: sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    return sr, x
def ghi(path, sr, y):
    with wave.open(path, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
def lam_gon(src):   # cắt lặng đầu/cuối, rút lặng trong câu > 0,28 s còn 0,24 s
    sr, x = doc(src); win = int(sr * 0.02); e = np.sqrt(np.convolve(x * x, np.ones(win) / win, "same"))
    on = np.where(e > 0.012)[0]; y = x[max(0, on[0] - int(0.06 * sr)):min(len(x), on[-1] + int(0.12 * sr))]
    e2 = np.sqrt(np.convolve(y * y, np.ones(win) / win, "same")); lang = e2 < 0.012; keep = np.ones(len(y), bool); i = 0; MAX = int(0.28 * sr); GIU = int(0.24 * sr)
    while i < len(y):
        if lang[i]:
            j = i
            while j < len(y) and lang[j]: j += 1
            if j - i > MAX: keep[i + GIU // 2:j - GIU // 2] = False
            i = j
        else: i += 1
    return sr, y[keep]

voice = {}
for l in L["lines"]:
    f = l["f"]; out = f"{D}/assets/voice/{f:03d}.wav"; sr, y = lam_gon(f"{D}/{chon[str(f)]['path']}")
    if "+" in l["who"]:   # hai giọng đồng thanh: lấy bản giọng thứ hai dài gần nhất rồi trộn
        import glob
        bs = sorted(glob.glob(f"{D}/giong/{f:03d}-b*.wav"), key=lambda p: abs(len(lam_gon(p)[1]) - len(y)))
        _, y2 = lam_gon(bs[0]); n = max(len(y), len(y2)); z = np.zeros(n, np.float32); z[:len(y)] += y * 0.75; z[:len(y2)] += y2 * 0.75; y = z
    ghi(out, sr, y)
    tmp = out[:-4] + ".tmp.wav"; os.replace(out, tmp)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-filter:a", f"atempo={TEMPO.get(l['who'], 1.06)}", "-ar", str(sr), "-ac", "1", out], check=True); os.remove(tmp)
    sr, y = doc(out); hop = sr // FPS; env = [float(np.sqrt(np.mean(y[i:i + hop] ** 2))) for i in range(0, len(y), hop)]
    p95 = np.percentile(env, 95) or 1
    voice[f] = {"dur": round(len(y) / sr, 3), "env": [round(min(1, v / p95), 2) for v in env]}

# ── xếp mốc: câu 1–4 → tựa → … ; mỗi chương (từ 2) mở bằng thẻ chương 1,5 s; hết phim giữ 3,5 s
NGHI = {4: 0.3, 13: 0.5, 14: 0.5, 23: 0.5, 34: 0.5, 45: 0.5, 53: 0.6, 60: 0.6, 61: 0.7, 62: 0.6, 63: 0.5, 64: 1.0, 65: 0.8, 67: 0.8, 81: 0.6, 82: 0.6, 91: 0.6, 95: 0.8, 97: 0.6, 98: 1.0, 105: 0.6, 108: 0.6}
t = 0.5; doan = []; ch_cu = 1
def them(id_, dur, **kw):
    global t
    doan.append({"id": id_, "bd": round(t, 3), "kt": round(t + dur, 3), **kw}); t += dur
for l in L["lines"]:
    f = l["f"]
    if l["ch"] != ch_cu: ch_cu = l["ch"]; them(f"ch{ch_cu}", 1.5, ch=ch_cu, ten=L["chuong"][str(ch_cu)])
    them(f, voice[f]["dur"], f=f, ch=l["ch"], who=l["who"], env=voice[f]["env"], voice=f"assets/voice/{f:03d}.wav")
    t += NGHI.get(f, 0.3 if l["who"] != "toi" else 0.35)
    if f == 4: them("tua", 2.6, ch=1)
them("cuoi", 3.5, ch=11)
TONG = round(t + 0.3, 3)
for i, d in enumerate(doan): d["het"] = doan[i + 1]["bd"] if i + 1 < len(doan) else TONG
json.dump({"tong": TONG, "fps": FPS, "doan": doan}, open(f"{D}/lich.json", "w"), ensure_ascii=False)
print(f"tổng {TONG:.1f} s = {TONG / 60:.2f} phút, {len(doan)} đoạn")

# ── nhạc nền theo chương, chồng mép 2 s
NHAC = [((1, 2), "feather-waltz.mp3"), ((3, 4), "dreams-become-real.mp3"), ((5, 6), "feather-waltz.mp3"), ((7, 7), "bittersweet.mp3"),
        ((8, 8), "touching-moments-two---higher.mp3"), ((9, 9), "healing.mp3"), ((10, 11), "gymnopedie-no-1.mp3")]
TEN = {"feather-waltz.mp3": "Feather Waltz", "dreams-become-real.mp3": "Dreams Become Real", "bittersweet.mp3": "Bittersweet",
       "touching-moments-two---higher.mp3": "Touching Moments Two - Higher", "healing.mp3": "Healing", "gymnopedie-no-1.mp3": "Gymnopedie No 1"}
VOL = {"feather-waltz.mp3": 0.085, "dreams-become-real.mp3": 0.09, "bittersweet.mp3": 0.1, "touching-moments-two---higher.mp3": 0.1, "healing.mp3": 0.1, "gymnopedie-no-1.mp3": 0.12}
ins, flt, k = [], [], 0
for (a, b), tep in NHAC:
    ds = [d for d in doan if a <= d.get("ch", 0) <= b]; s0 = max(0, ds[0]["bd"] - 1.0); s1 = min(TONG, ds[-1]["het"] + 1.0); du = s1 - s0
    ins += ["-stream_loop", "-1", "-i", f"{BGM}/{tep}"]
    flt.append(f"[{k}:a]atrim=0:{du:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=2,afade=t=out:st={du - 2:.3f}:d=2,volume={VOL[tep]},adelay={int(s0 * 1000)}|{int(s0 * 1000)}[m{k}]"); k += 1
flt.append("".join(f"[m{i}]" for i in range(k)) + f"amix=inputs={k}:normalize=0:duration=longest,atrim=0:{TONG:.3f}[o]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(flt), "-map", "[o]", "-ac", "2", "-ar", "48000", f"{D}/assets/bgm/nen.wav"], check=True)
cong = "Nhạc: " + ", ".join(f"“{TEN[x]}”" for x in dict.fromkeys(t for _, t in NHAC)) + " — Kevin MacLeod (incompetech.com), CC BY 4.0"
json.dump({"cong": cong}, open(f"{D}/nhac.json", "w"), ensure_ascii=False)

# ── index.html
au = "\n".join(f'<audio id="g{d["f"]:03d}" src="{d["voice"]}" data-start="{d["bd"]}" data-duration="{round(d["kt"] - d["bd"], 3)}" data-track-index="{30 + i}" data-volume="1"></audio>'
               for i, d in enumerate([d for d in doan if d.get("voice")]))
cuoi = doan[-1]["bd"]
html = f'''<!doctype html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920, height=1080">
<link rel="stylesheet" href="assets/fonts/fonts.css">
<style>*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1920px;height:1080px;overflow:hidden;background:#000}}#root{{position:relative;width:1920px;height:1080px;overflow:hidden}}#c{{position:absolute;inset:0}}
#cong{{position:absolute;left:0;right:0;bottom:22px;text-align:center;font:400 26px "Patrick Hand",sans-serif;color:#6b6560;opacity:0;visibility:hidden;z-index:8}}</style>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{TONG}" data-width="1920" data-height="1080">
<canvas id="c" width="1920" height="1080" data-layout-allow-overflow></canvas>
<div id="cong">{cong}</div>
{au}
<audio id="nhac" src="assets/bgm/nen.wav" data-start="0" data-duration="{TONG}" data-track-index="29" data-volume="1"></audio>
</div>
<script>window.__timelines = window.__timelines || {{}}; const tl = gsap.timeline({{ paused: true }});
tl.fromTo('#cong', {{autoAlpha: 0}}, {{autoAlpha: 1, duration: 0.8}}, {cuoi + 0.6});
window.__timelines['main'] = tl;</script>
<script type="module">
import {{ dungPhim }} from "./phim.js";
window.__hf = window.__hf || {{}}; window.__hf.buildReady = window.__hf.buildReady || {{}};
const cv = document.getElementById("c"); let renderAt = () => {{}};
window.__hf.buildReady["c"] = dungPhim(cv).then((p) => {{ renderAt = p.renderAt; renderAt(window.__hfThreeTime || 0); }});
window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
</script></body></html>'''
open(f"{D}/index.html", "w", encoding="utf-8").write(html)
print("xong index.html,", len([d for d in doan if d.get("voice")]), "câu;", cong)
