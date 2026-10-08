#!/usr/bin/env python3
"""Âm thanh "Bàn tay mười nghìn": nhạc nền liền mạch theo chương (tự hạ khi có giọng), hiệu ứng gắn đúng chữ,
tiếng chuyển cảnh/chuyển chương. Ghi assets/bgm/nen.wav (nhạc + hiệu ứng, cho lần render sau) và ghép tiếng mới
vào bản đã render: python3 am.py [video vào] [video ra]
"""
import json, os, re, subprocess, sys, unicodedata, wave
import numpy as np

D = os.path.dirname(os.path.abspath(__file__)); SR = 48000
lich = json.load(open(f"{D}/lich.json")); moc = json.load(open(f"{D}/moc.json")); TONG = lich["tong"]; N = int(TONG * SR) + SR
BGM = os.environ.get("BGM_DIR", f"{D}/assets/bgm-src")   # nhạc CC BY tải về (xem README)
SFX1 = os.environ.get("SFX_DIR", f"{D}/assets/sfx"); SFX2 = os.environ.get("SFX_DIR2", SFX1)
TMP = f"{D}/assets/am-tmp"; os.makedirs(TMP, exist_ok=True)

def doc(path):   # mọi định dạng → mono float 48 kHz
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()
def ghi(path, x):   # mono hoặc (n,2)
    x = np.clip(x, -1, 1); ch = 1 if x.ndim == 1 else 2
    with wave.open(path, "wb") as w: w.setnchannels(ch); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())

# ── 1. giọng đặt đúng chỗ (làm khoá hạ nhạc + trộn bản cuối)
giong = np.zeros(N, np.float32)
for d in lich["doan"]:
    if d.get("voice"):
        y = doc(f"{D}/{d['voice']}"); i = int(d["bd"] * SR); giong[i:i + len(y)] += y[:N - i]
ghi(f"{TMP}/giong.wav", giong)

# ── 2. nhạc nền: các bài chồng mép 3 s, không có khoảng hụt
NHOM = [((1, 2), "feather-waltz.mp3", 0.24), ((3, 4), "dreams-become-real.mp3", 0.26), ((5, 6), "feather-waltz.mp3", 0.24), ((7, 7), "bittersweet.mp3", 0.27),
        ((8, 8), "touching-moments-two---higher.mp3", 0.27), ((9, 9), "healing.mp3", 0.27), ((10, 11), "gymnopedie-no-1.mp3", 0.32)]
dau = []
for (a, b), _, _ in NHOM:
    ds = [d for d in lich["doan"] if a <= d.get("ch", 0) <= b]; dau.append(0.0 if not dau else ds[0]["bd"] - 1.0)
nhac = np.zeros(N, np.float32)
for k, ((a, b), tep, vol) in enumerate(NHOM):
    s0 = dau[k]; s1 = TONG if k == len(NHOM) - 1 else dau[k + 1] + 3.0; n = int((s1 - s0) * SR)
    y = doc(f"{BGM}/{tep}")
    if tep == "feather-waltz.mp3" and k == 2: y = np.roll(y, int(30 * SR))   # lần hai bắt đầu ở đoạn khác của bài
    y = np.tile(y, n // len(y) + 1)[:n] * vol
    fi = int((1.0 if k == 0 else 3.0) * SR); fo = int(3.0 * SR)
    y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)
    i = int(s0 * SR); nhac[i:i + n] += y[:N - i]
ghi(f"{TMP}/nhac.wav", nhac)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{TMP}/nhac.wav", "-i", f"{TMP}/giong.wav", "-filter_complex",
                "[0:a][1:a]sidechaincompress=threshold=0.015:ratio=7:attack=25:release=450:makeup=1[o]", "-map", "[o]", f"{TMP}/nhac-ha.wav"], check=True)
nhac = doc(f"{TMP}/nhac-ha.wav")[:N]; nhac = np.pad(nhac, (0, N - len(nhac)))

# ── 3. hiệu ứng: thư viện + vài tiếng tự tổng hợp
rng = np.random.default_rng(7)
def bao(n, a=0.002, d=0.1):
    t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
def chup():   # tiếng màn trập máy ảnh
    n = int(0.16 * SR); x = np.zeros(n)
    for t0, g in [(0, 1.0), (0.055, 0.7)]:
        m = int(0.03 * SR); b = rng.uniform(-1, 1, m) * bao(m, 0.0005, 0.006); b = b - np.convolve(b, np.ones(6) / 6, "same"); i = int(t0 * SR); x[i:i + m] += b * g
    return x * 0.9
def rung_dt():   # điện thoại rung bần bật
    t = np.arange(int(1.3 * SR)) / SR; on = ((t % 0.65) < 0.42).astype(float)
    x = (np.sin(2 * np.pi * 165 * t) + 0.5 * np.sin(2 * np.pi * 330 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * t)) * on
    x += rng.uniform(-1, 1, len(t)) * 0.15 * on; return x * 0.35
def de():   # tiếng dế kri… kri…
    t = np.arange(int(4.0 * SR)) / SR; x = np.zeros(len(t))
    for f0, lech in [(4600, 0), (4100, 0.31)]:
        tt = (t + lech) % 0.62; xung = ((tt < 0.15) & ((tt % 0.05) < 0.022)).astype(float)
        x += np.sin(2 * np.pi * f0 * t) * xung * 0.25
    return x
TU_TONG = {"chup": chup(), "rung": rung_dt(), "de": de()}
THU = {"pop": f"{SFX1}/pop.wav", "pop-high": f"{SFX1}/pop-high.wav", "ding": f"{SFX1}/ding.wav", "correct-ding": f"{SFX1}/correct-ding.wav", "cash": f"{SFX1}/cash.wav",
       "cash-register": f"{SFX1}/cash-register.wav", "boing": f"{SFX1}/boing.wav", "thud": f"{SFX1}/thud.wav", "vine-boom": f"{SFX1}/vine-boom.wav", "rimshot": f"{SFX1}/rimshot.wav",
       "record-scratch": f"{SFX1}/record-scratch.wav", "sad-trombone": f"{SFX1}/sad-trombone.wav", "whistle-up": f"{SFX1}/whistle-up.wav", "whistle-down": f"{SFX1}/whistle-down.wav",
       "inflate": f"{SFX1}/inflate.wav", "deflate": f"{SFX1}/deflate.wav", "tick": f"{SFX1}/tick.wav", "tin-tich": f"{SFX1}/tin-tich.wav", "pipe-clang": f"{SFX1}/pipe-clang.wav",
       "suspense": f"{SFX1}/suspense.wav", "error-buzz": f"{SFX1}/error-buzz.wav", "tin-breaking": f"{SFX1}/tin-breaking.wav", "drumroll": f"{SFX1}/drumroll.wav",
       "whoosh-long": f"{SFX1}/whoosh-long.wav", "whoosh-up": f"{SFX1}/whoosh-up.wav", "whoosh-down": f"{SFX1}/whoosh-down.wav", "tin-whoosh": f"{SFX1}/tin-whoosh.wav",
       "whoosh": f"{SFX2}/whoosh-short.mp3", "chime": f"{SFX2}/chime.mp3", "click": f"{SFX2}/click.mp3", "typing": f"{SFX2}/typing.mp3", "impact": f"{SFX2}/impact-bass-2.mp3",
       "impact1": f"{SFX2}/impact-bass-1.mp3", "riser": f"{SFX1}/riser.wav"}
kho = {}
def am(ten):
    if ten not in kho: kho[ten] = TU_TONG[ten] if ten in TU_TONG else doc(THU[ten])
    return kho[ten]
hieu = np.zeros(N, np.float32)
def dat(t, ten, vol=0.55):
    y = am(ten) * vol; i = int(max(0, t) * SR); hieu[i:i + len(y)] += y[:N - i]

chuan = lambda s: re.sub(r"[^\w]", "", unicodedata.normalize("NFC", s.lower()))
def tu(f, chu, lan=1):
    q = chuan(chu); k = 0
    for w in moc.get(str(f), []):
        if chuan(w["w"]).startswith(q):
            k += 1
            if k == lan: return w["s"]
    return None
# câu: [(chữ, hiệu ứng, âm lượng, lần xuất hiện, lệch giây)]
CUE = {
 1: [("giảm", "pop", .5), ("bật", "click", .8), ("tách", "chup", 1.0)], 2: [("ô", "chime", .45), ("của", "pop", .5), ("mỗi", "cash", .55), ("10", "cash-register", .6)],
 3: [("tôi", "ding", .4), ("nguội", "whistle-down", .45), ("sang", "correct-ding", .5)],
 4: [("nhẫn", "ding", .45), ("ba", "whoosh-long", .5), ("gọi", "rung", .9), ("12", "tick", .6), ("tay", "vine-boom", .75, 2)],
 5: [("chụp", "chup", .8), ("shop", "pop", .5), ("chụp", "chup", .8, 2), ("thớt", "thud", .8, 2), ("thớt", "thud", .8, 3), ("thớt", "thud", .8, 4), ("xoay", "whoosh-long", .5)],
 6: [("từ", "pop", .6), ("tôi", "boing", .5)], 7: [("20m2", "pop", .5), ("5", "cash", .55), ("5", "whoosh", .6, 2), ("chia", "thud", .6), ("100", "ding", .45), ("đéo", "record-scratch", .75)],
 8: [("gạch", "tick", .6), ("tù", "pipe-clang", .45), ("cơm", "sad-trombone", .45)],
 9: [("tôi", "tin-tich", .7), ("cưới", "tin-breaking", .55)], 10: [("khỉ", "boing", .5), ("37", "whistle-down", .5), ("mà", "boing", .5), ("cv", "thud", .6)],
 11: [("ruốc", "ding", .4), ("xe", "whoosh-long", .5), ("ruốc", "chime", .4, 2)], 12: [("tu", "whoosh-up", .5), ("suýt", "rimshot", .5)],
 13: [("tai", "tick", .6), ("đỏ", "whistle-up", .5), ("bốn", "sad-trombone", .45), ("4", "sad-trombone", .45)], 14: [("thoại", "click", .7), ("toang", "vine-boom", .75)],
 15: [("tuấn", "impact", .65)], 16: [("50", "cash-register", .55), ("kinh", "tin-tich", .7)], 17: [("xuống", "deflate", .5), ("lên", "inflate", .5), ("mặt", "correct-ding", .45)],
 18: [("thread", "riser", .45), ("50", "impact", .55)], 19: [("áp", "boing", .55)], 20: [("đi", "correct-ding", .45)], 21: [("câu", "rung", .8)],
 23: [("tắt", "click", .7), ("12", "tick", .6)], 24: [("tháng", "pop", .5), ("500", "cash-register", .55)], 25: [("nhìn", "boing", .45, 2)],
 26: [("sắp", "rimshot", .45, 2)], 27: [("1", "ding", .4), ("trách", "tick", .6)], 28: [("phải", "ding", .4), ("nam", "correct-ding", .45, 2)],
 29: [("chùa", "chime", .45), ("nhẫn", "ding", .45, 2)], 31: [("nghèo", "deflate", .45)], 32: [("300", "cash", .6), ("ba", "cash", .6)], 33: [("đờ", "rimshot", .4), ("đm", "rimshot", .4)],
 34: [("kinh", "cash-register", .5)], 35: [("11", "ding", .5), ("sợ", "suspense", .4)], 36: [("t", "tick", .6)], 37: [("kệ", "tin-tich", .7)], 38: [("đéo", "suspense", .4)],
 39: [("viết", "typing", .55), ("viết", "typing", .55, 1, 1.4), ("nhắn", "ding", .5)], 40: [("người", "chime", .5)], 41: [("vãi", "whistle-up", .45), ("ăn", "thud", .6)],
 42: [("ảnh", "chup", .7), ("phở", "pop", .5)], 43: [("cá", "pop", .5), ("ăn", "boing", .45)], 44: [("ô", "whistle-down", .45)], 45: [("10", "cash", .55)],
 46: [("2", "pop", .5)], 47: [("không", "thud", .7)], 48: [("gửi", "riser", .4)], 49: [("khoe", "chime", .4)], 50: [("vip", "ding", .5), ("miễn", "whoosh-long", .55)],
 51: [("ăn", "pop", .5), ("hoa", "pop-high", .6), ("mở", "whoosh-down", .5)], 52: [("ngắm", "chime", .35)], 53: [("11", "ding", .5)],
 54: [("6", "whistle-up", .45), ("sáu", "whistle-up", .45), ("ăn", "thud", .55)], 55: [("hoa", "pop-high", .6)],
 56: [("khoanh", "pop", .5), ("gọi", "rung", .9), ("bấm", "click", .8), ("chạy", "whoosh", .55)], 57: [("tay", "vine-boom", .75)], 58: [("sáng", "suspense", .35)],
 59: [("phần", "error-buzz", .4), ("ngón", "inflate", .5)], 60: [("đỏ", "whistle-up", .45)], 64: [("lâu", "tick", .5), ("lâu", "tick", .5, 1, 0.6), ("lâu", "tick", .5, 1, 1.2)],
 65: [("tuấn", "impact1", .5)], 66: [("nhắn", "ding", .5)], 67: [("mẹ", "impact", .6)], 68: [("phi", "whoosh-long", .55), ("áo", "impact", .6)],
 69: [("phần", "error-buzz", .4), ("đuổi", "whoosh", .55)], 70: [("45", "thud", .55), ("xếp", "deflate", .45)], 71: [("thêm", "boing", .55)], 72: [("đắt", "cash-register", .55)],
 73: [("quét", "ding", .45), ("tắt", "click", .7), ("dũng", "pop", .5)], 74: [("thua", "sad-trombone", .45)], 75: [("khoe", "chime", .35)], 76: [("120", "cash", .6), ("một", "cash", .6)],
 77: [("đêm", "tick", .5), ("khép", "pipe-clang", .4)], 78: [("cuốc", "ding", .5), ("vãi", "rimshot", .45)], 79: [("sai", "boing", .5)], 80: [("phóng", "whoosh-long", .55), ("5", "cash", .5)],
 81: [("cũng", "chime", .35)], 82: [("gạch", "tick", .6)], 83: [("đăng", "pop", .5), ("thật", "ding", .45)], 84: [("ảnh", "chup", .7)], 85: [("vào", "ding", .5), ("vào", "rung", .6)],
 86: [("8", "pop", .55), ("mới", "pop", .55), ("một", "pop", .55), ("chào", "pop", .55)], 87: [("trách", "vine-boom", .65)], 88: [("chửi", "riser", .4), ("top", "whoosh-up", .55)],
 89: [("hộp", "ding", .45)], 90: [("mình", "pop", .5), ("đừng", "pop", .5), ("mình", "pop", .5, 2), ("mình", "pop", .5, 3)], 91: [("đéo", "whistle-down", .45)],
 92: [("bài", "whoosh-long", .5)], 94: [("chữ", "impact1", .45, 2)], 95: [("không", "de", .9)], 96: [("thùng", "thud", .55), ("nước", "pop", .45)], 97: [("lọ", "chime", .3)],
 98: [("đăng", "chime", .4)], 101: [("cũng", "ding", .45)], 102: [("gật", "pop", .45)], 103: [("chụp", "chup", .6), ("chụp", "chup", .6, 1, 0.3)], 104: [("trách", "tick", .5)],
 105: [("bông", "pop-high", .55), ("gửi", "chime", .45)], 106: [("tháo", "ding", .45)], 108: [("đăng", "click", .6)], 109: [("giàu", "riser", .4)],
}
da = 0; thieu = []
for d in lich["doan"]:
    id_ = d["id"]
    if isinstance(id_, str):
        if id_.startswith("ch"): dat(d["bd"], "whoosh", .6); dat(d["bd"] + 0.12, "chime", .5)
        elif id_ == "tua": dat(d["bd"], "whoosh-up", .55); dat(d["bd"] + 0.3, "impact", .38)
        elif id_ == "cuoi": dat(d["bd"] + 0.2, "chime", .5)
        continue
    f = id_; co_dau = False
    for cue in CUE.get(f, []):
        chu, ten, vol = cue[:3]; lan = cue[3] if len(cue) > 3 else 1; lech = cue[4] if len(cue) > 4 else 0
        s = tu(f, chu, lan)
        if s is None: thieu.append(f"{f}:{chu}"); continue
        dat(d["bd"] + s + lech, ten, vol); da += 1; co_dau |= s < 0.35
    if f == 2:   # 30 góc: màn trập bấm liên hồi
        tb = tu(2, "bữa") or 0.85
        for k in range(int(tb / 0.125)): dat(d["bd"] + k * 0.125, "chup", .55)
    if not co_dau and f != 1:   # tiếng chuyển cảnh nhẹ ở đầu mỗi câu
        dat(d["bd"] - 0.06, ["tin-whoosh", "whoosh-down", "whoosh"][f % 3], .22)
print(f"đặt {da} hiệu ứng; không tìm thấy chữ: {', '.join(thieu)}")

# ── 4. nền = nhạc (đã hạ dưới giọng) + hiệu ứng → assets/bgm/nen.wav ; bản cuối = giọng + nền, chuẩn âm lượng
nen = nhac + hieu; ghi(f"{D}/assets/bgm/nen.wav", np.stack([nen, nen], 1)[:int(TONG * SR)])
ghi(f"{TMP}/tron.wav", (giong + nen)[:int(TONG * SR)])
if len(sys.argv) > 2:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", sys.argv[1], "-i", f"{TMP}/tron.wav", "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-af", "loudnorm=I=-15:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", sys.argv[2]], check=True)
    print("xong", sys.argv[2])
