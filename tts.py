#!/usr/bin/env python3
"""Thu giọng "Bàn tay mười nghìn" (cả phim) qua LiteLLM (Gemini TTS), khung DIRECTOR'S NOTES / TRANSCRIPT.
Dùng: LITELLM_KEY=… tts.py [takes] [f,f,…]   → giong/NN-tK.wav; câu "toi+tuan" thêm giong/NN-bK.wav (giọng Tuấn)
"""
import base64, json, os, ssl, sys, urllib.request, wave
from concurrent.futures import ThreadPoolExecutor
D = os.path.dirname(os.path.abspath(__file__))
BASE = os.environ.get("LITELLM_BASE", "").rstrip("/")   # gateway OpenAI-compatible của bạn, vd LiteLLM proxy
MODEL = os.environ.get("TTS_MODEL", "gemini-2.5-flash-preview-tts")
if not BASE: raise SystemExit("Đặt LITELLM_BASE (URL gateway) và LITELLM_KEY trước khi chạy.")
CTX = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE", "/etc/ssl/cert.pem"))

def tts(text, style, dien, voice, out):
    prompt = (f"### DIRECTOR'S NOTES\nSpeaker: {style}\nDirection for this line: {dien}\n"
              f"Read the TRANSCRIPT verbatim, exactly once, in Vietnamese. Do NOT read these notes aloud. "
              f"Any question inside it is part of the line: say it with a questioning tone and stop, never answer it.\n\n"
              f"#### TRANSCRIPT\n{text}")
    body = {"model": MODEL, "messages": [{"role": "user", "content": prompt}], "modalities": ["audio"], "audio": {"voice": voice, "format": "pcm16"}}
    req = urllib.request.Request(BASE + "/v1/chat/completions", data=json.dumps(body).encode(), headers={"Authorization": "Bearer " + os.environ["LITELLM_KEY"], "Content-Type": "application/json"})
    err = None
    for _ in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180, context=CTX) as r:
                pcm = base64.b64decode(json.load(r)["choices"][0]["message"]["audio"]["data"])
            with wave.open(out, "wb") as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
            return f"{os.path.basename(out)} {len(pcm)/48000:.2f}s {voice}"
        except Exception as e:
            err = e
    return f"{os.path.basename(out)} FAIL {err}"

def main():
    d = json.load(open(f"{D}/lines.json", encoding="utf-8"))
    takes = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    only = {int(x) for x in sys.argv[2].split(",")} if len(sys.argv) > 2 else None
    os.makedirs(f"{D}/giong", exist_ok=True); jobs = []
    for l in d["lines"]:
        if only and l["f"] not in only: continue
        whos = l["who"].split("+")
        for wi, who in enumerate(whos):
            v = d["voices"][who]
            for k in range(1, takes + 1):
                jobs.append((l["t"], v["style"], l["dien"], v["voice"], f"{D}/giong/{l['f']:03d}-{'tb'[wi]}{k}.wav"))
    with ThreadPoolExecutor(max_workers=8) as ex:
        for res in ex.map(lambda j: tts(*j), jobs): print(res, flush=True)

if __name__ == "__main__":
    main()
