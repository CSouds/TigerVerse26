import base64
from pathlib import Path

in_file = Path("debug/latest.b64.txt")
out_file = Path("debug/latest.jpg")

if not in_file.exists():
    raise FileNotFoundError(f"Missing input file: {in_file.resolve()}")

b64 = in_file.read_text(encoding="utf-8").strip()
prefix = "data:image/jpeg;base64,"
if b64.startswith(prefix):
    b64 = b64[len(prefix):]

out_file.parent.mkdir(parents=True, exist_ok=True)
out_file.write_bytes(base64.b64decode(b64))
print(f"Saved: {out_file.resolve()}")
