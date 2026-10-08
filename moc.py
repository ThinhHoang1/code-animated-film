import json, sys, glob, os
import mlx_whisper
D = sys.argv[1]; out = {}
for p in sorted(glob.glob(f"{D}/assets/voice/*.wav")):
    f = int(os.path.basename(p)[:3])
    r = mlx_whisper.transcribe(p, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="vi", word_timestamps=True)
    out[f] = [{"w": w["word"].strip(), "s": round(w["start"], 2), "e": round(w["end"], 2)} for s in r["segments"] for w in s.get("words", [])]
    print(f, len(out[f]), flush=True)
json.dump(out, open(f"{D}/moc.json", "w"), ensure_ascii=False)
