#!/usr/bin/env python3
"""Chấm từng bản TTS theo câu bằng mlx-whisper, chọn bản khớp kịch bản nhất.

Dùng: pick_takes.py <script-lines.json> <lines-dir> <out-choice.json>
"""
import difflib, glob, json, os, re, sys, unicodedata, wave
import mlx_whisper

MODEL = "mlx-community/whisper-large-v3-turbo"
DIG = "không một hai ba bốn năm sáu bảy tám chín".split()

def num_vi(n):
    if n < 10: return DIG[n]
    if n < 20: return "mười" + ("" if n == 10 else " " + ("lăm" if n % 10 == 5 else DIG[n % 10]))
    if n < 100:
        t, u = divmod(n, 10)
        tail = "" if u == 0 else " " + {1: "mốt", 4: "tư", 5: "lăm"}.get(u, DIG[u])
        return DIG[t] + " mươi" + tail
    if n < 1000:
        h, r = divmod(n, 100)
        if r == 0: return DIG[h] + " trăm"
        if r < 10: return DIG[h] + " trăm linh " + DIG[r]
        return DIG[h] + " trăm " + num_vi(r)
    return str(n)

COLLOQ = [("hai hai tuổi", "hai mươi hai tuổi"), ("hai trăm hai lăm", "hai trăm hai mươi lăm"),
          ("ngoài hai lăm", "ngoài hai mươi lăm")]
MERGE = [(r"^tr", "ch"), (r"^gi", "d"), (r"^r", "d"), (r"^s", "x")]  # giọng Bắc đọc như nhau

def norm(text, ref=False):
    t = unicodedata.normalize("NFC", text.lower()).replace("%", " phần trăm ")
    t = re.sub(r"(\d+),(\d+)", r"\1 phẩy \2", t)
    t = re.sub(r"\d+", lambda m: " " + num_vi(int(m.group())) + " ", t)
    t = re.sub(r"[^\w\s]", " ", t)
    t = " ".join(t.split())
    if ref:
        for a, b in COLLOQ: t = t.replace(a, b)
    out = []
    for s in t.split():
        for pat, rep in MERGE: s = re.sub(pat, rep, s)
        out.append(s)
    return out

def dur(path):
    with wave.open(path) as w: return w.getnframes() / w.getframerate()

def main():
    lines = json.load(open(sys.argv[1], encoding="utf-8")); d = sys.argv[2]
    choice = {}
    for l in lines:
        ref = norm(l["t"], ref=True); best = None
        for path in sorted(glob.glob(os.path.join(d, f"{l['f']:03d}-t*.wav"))):
            D = dur(path)
            r = mlx_whisper.transcribe(path, path_or_hf_repo=MODEL, language="vi", word_timestamps=True,
                                       condition_on_previous_text=False)
            words = [w for s in r["segments"] for w in s.get("words", [])]
            # bỏ ảo giác đuôi: từ bắt đầu sát cuối file hoặc dài ~0
            words = [w for w in words if not (w["start"] > D - 0.25 or w["end"] - w["start"] < 0.02)]
            hyp = norm(" ".join(w["word"] for w in words))
            sm = difflib.SequenceMatcher(a=ref, b=hyp, autojunk=False)
            match = sum(b.size for b in sm.get_matching_blocks())
            ins = sum((j2 - j1) - (i2 - i1) for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag in ("insert", "replace") and (j2 - j1) > (i2 - i1))
            diffs = [f"{' '.join(ref[i1:i2])}→{' '.join(hyp[j1:j2])}" for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag != "equal"]
            score = match / len(ref) - 0.05 * max(ins, 0)
            key = (round(score, 3), -D)
            print(f"  {os.path.basename(path)} {D:5.2f}s score {score:.3f} {'; '.join(diffs)}")
            if best is None or key > best[0]:
                best = (key, path, D, diffs)
        choice[l["f"]] = {"path": best[1], "duration_s": round(best[2], 3), "score": best[0][0], "diffs": best[3]}
        print(f"Frame {l['f']:02d} → {os.path.basename(best[1])} (score {best[0][0]})")
    json.dump(choice, open(sys.argv[3], "w"), ensure_ascii=False, indent=1)

if __name__ == "__main__":
    main()
